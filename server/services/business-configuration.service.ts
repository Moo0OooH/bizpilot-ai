/**
 * ============================================================
 * File: server/services/business-configuration.service.ts
 * Project: BizPilot AI
 * Description: Coordinates business, Cleaning template, and public intake sync workflows.
 * Role: Validates tenant membership, normalizes owner input, computes readiness, and syncs public quote config.
 * Related:
 * - server/actions/business-configuration.actions.ts
 * - server/repositories/business-configuration.repository.ts
 * - server/policies/business-membership.policy.ts
 * Author: MoOoH
 * Created: 2026-05-05
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Scoped profile and Quote Setup review state so saving one surface cannot falsely confirm untouched setup steps.
 * - 2026-07-16: Honored explicit onboarding review state so safe starter content does not falsely mark first-time setup as owner-confirmed.
 * - 2026-07-16: Validated bounded local logo data URLs and secure remote logo URLs before persisting public branding.
 * - 2026-07-11: Preserved bilingual custom quote-field translations while syncing template and public intake updates.
 * - 2026-05-13: Enforced the server-only runtime boundary.
 * - 2026-05-05: Created Phase 3 business configuration service and readiness scoring.
 * - 2026-05-05: Added business profile updates and onboarding task synchronization.
 * - 2026-05-05: Persisted Cleaning template field edits in business_template_settings.
 * - 2026-05-06: Syncs Phase 4 public intake form, consent version, and public link after configuration saves.
 * ============================================================
 */

import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { canManageBusiness } from "@/server/policies/business-membership.policy";
import {
  getBusinessConfiguration,
  getBusinessTemplateFieldOverrides,
  getCleaningTemplate,
  listBusinessOnboardingTaskReviews,
  mergeTemplateFieldOverridesForLanguage,
  replaceBusinessOnboardingTasks,
  replaceBusinessFaqs,
  replaceBusinessServiceAreas,
  replaceBusinessServices,
  upsertBusinessBranding,
  upsertConsentSettings,
  upsertPrivacySettings,
  upsertTemplateSettings,
  type BusinessConfigurationRecord,
  type BusinessPrivacySettingsRecord,
  type CleaningTemplateRecord,
} from "@/server/repositories/business-configuration.repository";
import { listMembershipsForUser } from "@/server/repositories/business-members.repository";
import {
  updateBusinessProfile,
  type BusinessRecord,
} from "@/server/repositories/businesses.repository";
import {
  upsertConsentVersion,
  upsertIntakeFormFromTemplate,
  upsertPublicLinkVariant,
} from "@/server/repositories/public-intake.repository";
import type { Json } from "@/types/database";

export type BusinessReadinessScore = Readonly<{
  completed: number;
  items: ReadonlyArray<{
    complete: boolean;
    label: string;
    taskKey: string;
  }>;
  total: number;
}>;

type ReadinessTask = Readonly<{
  complete: boolean;
  label: string;
  taskKey: string;
}>;

export type BusinessConfigurationWorkspace = Readonly<{
  business: BusinessRecord;
  cleaningTemplate: CleaningTemplateRecord;
  configuration: BusinessConfigurationRecord;
  readiness: BusinessReadinessScore;
}>;

export type BusinessConfigurationInput = Readonly<{
  accentColor: string;
  aiDisclosureEnabled: boolean;
  businessId: string;
  businessName: string;
  businessSlug: string;
  consentNotice: string;
  customTemplateName?: string;
  faqs: ReadonlyArray<{ answer: string; question: string }>;
  fieldOverrides: Json;
  logoUrl?: string;
  primaryColor: string;
  privacyContactEmail?: string;
  privacyMode: BusinessPrivacySettingsRecord["privacy_mode"];
  preferredLanguage: BusinessRecord["preferred_language"];
  retainLeadsDays: number;
  reviewScope: "business_profile" | "quote_setup";
  serviceAreas: readonly string[];
  services: ReadonlyArray<{ description?: string; name: string }>;
  templateId: string;
  userId: string;
}>;

const colorPattern = /^#[0-9a-fA-F]{6}$/;
const logoDataUrlPattern = /^data:image\/(?:jpeg|png|webp);base64,[a-zA-Z0-9+/=]+$/;
const maxLogoDataUrlLength = 360_000;
const maxRemoteLogoUrlLength = 2_048;
const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function cleanOptionalText(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
}

function normalizeLogoUrl(value: string | undefined): string | undefined {
  const logoUrl = cleanOptionalText(value);
  if (!logoUrl) return undefined;

  if (
    logoUrl.length <= maxLogoDataUrlLength &&
    logoDataUrlPattern.test(logoUrl)
  ) {
    return logoUrl;
  }

  try {
    const parsed = new URL(logoUrl);
    if (
      parsed.protocol === "https:" &&
      logoUrl.length <= maxRemoteLogoUrlLength
    ) {
      return parsed.toString();
    }
  } catch {
    // The shared validation error below intentionally hides URL parser details.
  }

  throw new Error(
    "Logo must be a secure HTTPS URL or a PNG, JPG, or WebP upload under 2 MB.",
  );
}

function assertHexColor(label: string, value: string): void {
  if (!colorPattern.test(value)) {
    throw new Error(`${label} must be a valid hex color.`);
  }
}

function normalizeSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function assertBusinessProfile(input: {
  businessName: string;
  businessSlug: string;
}): { businessName: string; businessSlug: string } {
  const businessName = input.businessName.trim();
  const businessSlug = normalizeSlug(input.businessSlug);

  if (businessName.length === 0) {
    throw new Error("Business name is required.");
  }

  if (!slugPattern.test(businessSlug)) {
    throw new Error("Business slug must contain lowercase letters, numbers, and hyphens.");
  }

  return {
    businessName,
    businessSlug,
  };
}

function getPublicIntakePrivacyMode(
  value: BusinessPrivacySettingsRecord["privacy_mode"],
): "minimal" | "standard" {
  return value === "minimal" ? "minimal" : "standard";
}

function assertManageAccess(input: {
  businessId: string;
  memberships: Awaited<ReturnType<typeof listMembershipsForUser>>;
  userId: string;
}): void {
  if (!canManageBusiness(input)) {
    throw new Error("You do not have permission to manage this business.");
  }
}

function getConfigurationReadinessTasks(input: {
  business: BusinessRecord;
  configuration: BusinessConfigurationRecord;
}): ReadinessTask[] {
  const { business, configuration } = input;
  const reviewedByTaskKey = new Map(
    configuration.onboardingTasks.map((task) => [
      task.task_key,
      task.completed_at !== null,
    ]),
  );
  const isReviewedAndValid = (taskKey: string, isValid: boolean) =>
    reviewedByTaskKey.has(taskKey)
      ? reviewedByTaskKey.get(taskKey) === true && isValid
      : isValid;

  return [
    {
      complete: isReviewedAndValid(
        "business_profile",
        business.name.trim().length > 0 && slugPattern.test(business.slug),
      ),
      label: "Business profile confirmed",
      taskKey: "business_profile",
    },
    {
      complete: isReviewedAndValid("branding", Boolean(configuration.branding)),
      label: "Branding configured",
      taskKey: "branding",
    },
    {
      complete: isReviewedAndValid("services", configuration.services.length > 0),
      label: "At least one service added",
      taskKey: "services",
    },
    {
      complete: isReviewedAndValid(
        "service_areas",
        configuration.serviceAreas.length > 0,
      ),
      label: "At least one service area added",
      taskKey: "service_areas",
    },
    {
      complete: isReviewedAndValid("faqs", configuration.faqs.length > 0),
      label: "At least one FAQ added",
      taskKey: "faqs",
    },
    {
      complete: isReviewedAndValid(
        "privacy",
        Boolean(configuration.privacySettings),
      ),
      label: "Privacy mode selected",
      taskKey: "privacy",
    },
    {
      complete: isReviewedAndValid(
        "consent",
        Boolean(configuration.consentSettings),
      ),
      label: "Consent notice configured",
      taskKey: "consent",
    },
    {
      complete: isReviewedAndValid(
        "cleaning_template",
        Boolean(configuration.templateSettings),
      ),
      label: "Cleaning template activated",
      taskKey: "cleaning_template",
    },
  ];
}

function getInputReadinessTasks(input: {
  business: BusinessRecord;
  configuration: BusinessConfigurationInput;
}): ReadinessTask[] {
  const { business, configuration } = input;

  return [
    {
      complete: business.name.trim().length > 0 && slugPattern.test(business.slug),
      label: "Business profile confirmed",
      taskKey: "business_profile",
    },
    {
      complete: true,
      label: "Branding configured",
      taskKey: "branding",
    },
    {
      complete: configuration.services.length > 0,
      label: "At least one service added",
      taskKey: "services",
    },
    {
      complete: configuration.serviceAreas.length > 0,
      label: "At least one service area added",
      taskKey: "service_areas",
    },
    {
      complete: configuration.faqs.length > 0,
      label: "At least one FAQ added",
      taskKey: "faqs",
    },
    {
      complete: true,
      label: "Privacy mode selected",
      taskKey: "privacy",
    },
    {
      complete: configuration.consentNotice.trim().length > 0,
      label: "Consent notice configured",
      taskKey: "consent",
    },
    {
      complete: configuration.templateId.trim().length > 0,
      label: "Cleaning template activated",
      taskKey: "cleaning_template",
    },
  ];
}

function scopeReviewedReadinessTasks(input: {
  currentReviews: ReadonlyArray<
    Readonly<{ completed_at: string | null; task_key: string }>
  >;
  reviewScope: BusinessConfigurationInput["reviewScope"];
  tasks: readonly ReadinessTask[];
}): ReadinessTask[] {
  const reviewByTaskKey = new Map(
    input.currentReviews.map((task) => [
      task.task_key,
      task.completed_at !== null,
    ]),
  );

  return input.tasks.map((task) => {
    const isInCurrentReviewScope =
      input.reviewScope === "business_profile"
        ? task.taskKey === "business_profile"
        : task.taskKey !== "business_profile";
    const wasPreviouslyReviewed = reviewByTaskKey.has(task.taskKey)
      ? reviewByTaskKey.get(task.taskKey) === true
      : true;

    return {
      ...task,
      complete:
        task.complete && (isInCurrentReviewScope || wasPreviouslyReviewed),
    };
  });
}

function calculateReadiness(
  business: BusinessRecord,
  configuration: BusinessConfigurationRecord,
): BusinessReadinessScore {
  const items = getConfigurationReadinessTasks({
    business,
    configuration,
  }).map((item) => ({
    complete: item.complete,
    label: item.label,
    taskKey: item.taskKey,
  }));

  return {
    completed: items.filter((item) => item.complete).length,
    items,
    total: items.length,
  };
}

export async function getBusinessConfigurationWorkspace(input: {
  business: BusinessRecord;
}): Promise<BusinessConfigurationWorkspace> {
  const supabase = await createSupabaseServerClient();
  const [configuration, cleaningTemplate] = await Promise.all([
    getBusinessConfiguration({
      businessId: input.business.id,
      supabase,
    }),
    getCleaningTemplate({
      businessId: input.business.id,
      preferredLanguage: input.business.preferred_language,
      supabase,
    }),
  ]);

  return {
    business: input.business,
    cleaningTemplate,
    configuration,
    readiness: calculateReadiness(input.business, configuration),
  };
}

export async function saveBusinessConfiguration(
  input: BusinessConfigurationInput,
): Promise<void> {
  assertHexColor("Primary color", input.primaryColor);
  assertHexColor("Accent color", input.accentColor);
  const businessProfile = assertBusinessProfile({
    businessName: input.businessName,
    businessSlug: input.businessSlug,
  });

  if (input.retainLeadsDays < 1 || input.retainLeadsDays > 3650) {
    throw new Error("Lead retention must be between 1 and 3650 days.");
  }

  const supabase = await createSupabaseServerClient();
  const memberships = await listMembershipsForUser({
    supabase,
    userId: input.userId,
  });

  assertManageAccess({
    businessId: input.businessId,
    memberships,
    userId: input.userId,
  });

  const logoUrl = normalizeLogoUrl(input.logoUrl);
  const privacyContactEmail = cleanOptionalText(input.privacyContactEmail);
  const customTemplateName = cleanOptionalText(input.customTemplateName);
  const existingFieldOverrides = await getBusinessTemplateFieldOverrides({
    businessId: input.businessId,
    supabase,
    templateId: input.templateId,
  });
  const currentOnboardingReviews = await listBusinessOnboardingTaskReviews({
    businessId: input.businessId,
    supabase,
  });
  const mergedFieldOverrides = mergeTemplateFieldOverridesForLanguage({
    currentLanguage: input.preferredLanguage,
    existing: existingFieldOverrides,
    incoming: input.fieldOverrides,
  });

  const updatedBusiness = await updateBusinessProfile({
    businessId: input.businessId,
    name: businessProfile.businessName,
    preferredLanguage: input.preferredLanguage,
    slug: businessProfile.businessSlug,
    supabase,
  });

  await Promise.all([
    upsertBusinessBranding({
      accentColor: input.accentColor,
      businessId: input.businessId,
      primaryColor: input.primaryColor,
      supabase,
      ...(logoUrl ? { logoUrl } : {}),
    }),
    replaceBusinessServices({
      businessId: input.businessId,
      services: input.services,
      supabase,
    }),
    replaceBusinessFaqs({
      businessId: input.businessId,
      faqs: input.faqs,
      supabase,
    }),
    replaceBusinessServiceAreas({
      areas: input.serviceAreas,
      businessId: input.businessId,
      supabase,
    }),
    upsertPrivacySettings({
      businessId: input.businessId,
      privacyMode: input.privacyMode,
      retainLeadsDays: input.retainLeadsDays,
      supabase,
    }),
    upsertConsentSettings({
      aiDisclosureEnabled: input.aiDisclosureEnabled,
      businessId: input.businessId,
      consentNotice: input.consentNotice,
      supabase,
      ...(privacyContactEmail ? { privacyContactEmail } : {}),
    }),
    upsertTemplateSettings({
      businessId: input.businessId,
      fieldOverrides: mergedFieldOverrides,
      supabase,
      templateId: input.templateId,
      ...(customTemplateName ? { customName: customTemplateName } : {}),
    }),
  ]);

  const cleaningTemplate = await getCleaningTemplate({
    businessId: input.businessId,
    preferredLanguage: updatedBusiness.preferred_language,
    supabase,
  });
  const publicTemplateName =
    customTemplateName ?? cleaningTemplate.template.name;

  await Promise.all([
    upsertPublicLinkVariant({
      businessId: input.businessId,
      displayName: updatedBusiness.name,
      preferredLanguage: updatedBusiness.preferred_language,
      slug: updatedBusiness.slug,
      supabase,
    }),
    upsertConsentVersion({
      aiDisclosureEnabled: input.aiDisclosureEnabled,
      businessId: input.businessId,
      consentNotice: input.consentNotice,
      supabase,
      ...(privacyContactEmail ? { privacyContactEmail } : {}),
    }),
    upsertIntakeFormFromTemplate({
      businessId: input.businessId,
      fields: cleaningTemplate.fields,
      formName: publicTemplateName,
      privacyMode: getPublicIntakePrivacyMode(input.privacyMode),
      supabase,
      templateId: input.templateId,
    }),
  ]);

  await replaceBusinessOnboardingTasks({
    businessId: input.businessId,
    supabase,
    tasks: scopeReviewedReadinessTasks({
      currentReviews: currentOnboardingReviews,
      reviewScope: input.reviewScope,
      tasks: getInputReadinessTasks({
        business: updatedBusiness,
        configuration: input,
      }),
    }),
  });
}
