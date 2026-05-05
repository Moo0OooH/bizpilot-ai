/**
 * ============================================================
 * File: server/services/business-configuration.service.ts
 * Project: BizPilot AI
 * Description: Coordinates Phase 3 business and Cleaning template configuration workflows.
 * Role: Validates tenant membership, normalizes owner input, and computes readiness state.
 * Related:
 * - server/actions/business-configuration.actions.ts
 * - server/repositories/business-configuration.repository.ts
 * - server/policies/business-membership.policy.ts
 * Author: MoOoH
 * Created: 2026-05-05
 * Last Updated: 2026-05-05
 * Change Log:
 * - 2026-05-05: Created Phase 3 business configuration service and readiness scoring.
 * - 2026-05-05: Added business profile updates and onboarding task synchronization.
 * ============================================================
 */

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { canManageBusiness } from "@/server/policies/business-membership.policy";
import {
  getBusinessConfiguration,
  getCleaningTemplate,
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
import type { Json } from "@/types/database";

export type BusinessReadinessScore = Readonly<{
  completed: number;
  items: ReadonlyArray<{
    complete: boolean;
    label: string;
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
  retainLeadsDays: number;
  serviceAreas: readonly string[];
  services: ReadonlyArray<{ description?: string; name: string }>;
  templateId: string;
  userId: string;
}>;

const colorPattern = /^#[0-9a-fA-F]{6}$/;
const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function cleanOptionalText(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
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

  return [
    {
      complete: business.name.trim().length > 0 && slugPattern.test(business.slug),
      label: "Business profile confirmed",
      taskKey: "business_profile",
    },
    {
      complete: Boolean(configuration.branding),
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
      complete: Boolean(configuration.privacySettings),
      label: "Privacy mode selected",
      taskKey: "privacy",
    },
    {
      complete: Boolean(configuration.consentSettings),
      label: "Consent notice configured",
      taskKey: "consent",
    },
    {
      complete: Boolean(configuration.templateSettings),
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
    getCleaningTemplate({ supabase }),
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

  const logoUrl = cleanOptionalText(input.logoUrl);
  const privacyContactEmail = cleanOptionalText(input.privacyContactEmail);
  const customTemplateName = cleanOptionalText(input.customTemplateName);

  const updatedBusiness = await updateBusinessProfile({
    businessId: input.businessId,
    name: businessProfile.businessName,
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
      fieldOverrides: input.fieldOverrides,
      supabase,
      templateId: input.templateId,
      ...(customTemplateName ? { customName: customTemplateName } : {}),
    }),
  ]);

  await replaceBusinessOnboardingTasks({
    businessId: input.businessId,
    supabase,
    tasks: getInputReadinessTasks({
      business: updatedBusiness,
      configuration: input,
    }),
  });
}
