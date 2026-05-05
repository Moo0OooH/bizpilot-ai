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
 * ============================================================
 */

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { canManageBusiness } from "@/server/policies/business-membership.policy";
import {
  getBusinessConfiguration,
  getCleaningTemplate,
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
import type { BusinessRecord } from "@/server/repositories/businesses.repository";
import type { Json } from "@/types/database";

export type BusinessReadinessScore = Readonly<{
  completed: number;
  items: ReadonlyArray<{
    complete: boolean;
    label: string;
  }>;
  total: number;
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

function cleanOptionalText(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
}

function assertHexColor(label: string, value: string): void {
  if (!colorPattern.test(value)) {
    throw new Error(`${label} must be a valid hex color.`);
  }
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

function calculateReadiness(
  configuration: BusinessConfigurationRecord,
): BusinessReadinessScore {
  const items = [
    {
      complete: Boolean(configuration.branding),
      label: "Branding configured",
    },
    {
      complete: configuration.services.length > 0,
      label: "At least one service added",
    },
    {
      complete: configuration.serviceAreas.length > 0,
      label: "At least one service area added",
    },
    {
      complete: configuration.faqs.length > 0,
      label: "At least one FAQ added",
    },
    {
      complete: Boolean(configuration.privacySettings),
      label: "Privacy mode selected",
    },
    {
      complete: Boolean(configuration.consentSettings),
      label: "Consent notice configured",
    },
    {
      complete: Boolean(configuration.templateSettings),
      label: "Cleaning template activated",
    },
  ] as const;

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
    readiness: calculateReadiness(configuration),
  };
}

export async function saveBusinessConfiguration(
  input: BusinessConfigurationInput,
): Promise<void> {
  assertHexColor("Primary color", input.primaryColor);
  assertHexColor("Accent color", input.accentColor);

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
}
