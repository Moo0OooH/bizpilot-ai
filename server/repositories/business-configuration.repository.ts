/**
 * ============================================================
 * File: server/repositories/business-configuration.repository.ts
 * Project: BizPilot AI
 * Description: Handles Phase 3 business configuration data access through Supabase RLS.
 * Role: Owns reads and writes for business settings, services, FAQs, areas, and template settings.
 * Related:
 * - server/services/business-configuration.service.ts
 * - supabase/migrations/0002_business_template_configuration.sql
 * - supabase/migrations/0003_business_template_field_overrides.sql
 * Author: MoOoH
 * Created: 2026-05-05
 * Last Updated: 2026-05-05
 * Change Log:
 * - 2026-05-05: Created Phase 3 business configuration repository.
 * - 2026-05-05: Added onboarding task reads and sync support.
 * - 2026-05-05: Added business-level template field override merge and persistence.
 * ============================================================
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Json } from "@/types/database";

export type BusinessBrandingRecord =
  Database["public"]["Tables"]["business_branding"]["Row"];
export type BusinessConsentSettingsRecord =
  Database["public"]["Tables"]["business_consent_settings"]["Row"];
export type BusinessFaqRecord =
  Database["public"]["Tables"]["business_faqs"]["Row"];
export type BusinessPrivacySettingsRecord =
  Database["public"]["Tables"]["business_privacy_settings"]["Row"];
export type BusinessServiceAreaRecord =
  Database["public"]["Tables"]["business_service_areas"]["Row"];
export type BusinessServiceRecord =
  Database["public"]["Tables"]["business_services"]["Row"];
export type BusinessTemplateSettingsRecord =
  Database["public"]["Tables"]["business_template_settings"]["Row"];
export type BusinessTemplateFieldRecord =
  Database["public"]["Tables"]["business_template_fields"]["Row"];
export type BusinessOnboardingTaskRecord =
  Database["public"]["Tables"]["business_onboarding_tasks"]["Row"];
export type IndustryTemplateFieldRecord =
  Database["public"]["Tables"]["industry_template_fields"]["Row"];
export type IndustryTemplateRecord =
  Database["public"]["Tables"]["industry_templates"]["Row"];

export type CleaningTemplateFieldRecord = IndustryTemplateFieldRecord & {
  business_override_id: string | null;
  is_hidden: boolean;
  template_field_id: string;
};

export type CleaningTemplateRecord = Readonly<{
  fields: CleaningTemplateFieldRecord[];
  template: IndustryTemplateRecord;
}>;

export type BusinessConfigurationRecord = Readonly<{
  branding: BusinessBrandingRecord | null;
  consentSettings: BusinessConsentSettingsRecord | null;
  faqs: BusinessFaqRecord[];
  onboardingTasks: BusinessOnboardingTaskRecord[];
  privacySettings: BusinessPrivacySettingsRecord | null;
  serviceAreas: BusinessServiceAreaRecord[];
  services: BusinessServiceRecord[];
  templateSettings: BusinessTemplateSettingsRecord | null;
}>;

export type BusinessTemplateFieldOverrideInput = Readonly<{
  fieldKey: string;
  helpTextOverride?: string;
  isHidden: boolean;
  isRequiredOverride?: boolean;
  labelOverride?: string;
  optionsOverride?: Json;
  sortOrderOverride?: number;
  templateFieldId: string;
}>;

async function throwIfError(error: { message: string } | null): Promise<void> {
  if (error) {
    throw new Error(error.message);
  }
}

export async function getCleaningTemplate(input: {
  businessId: string;
  supabase: SupabaseClient<Database>;
}): Promise<CleaningTemplateRecord> {
  const { data: template, error: templateError } = await input.supabase
    .from("industry_templates")
    .select("*")
    .eq("slug", "cleaning-smart-quote-v1")
    .single();

  await throwIfError(templateError);

  if (!template) {
    throw new Error("Cleaning template is not seeded.");
  }

  const { data: fields, error: fieldsError } = await input.supabase
    .from("industry_template_fields")
    .select("*")
    .eq("template_id", template.id)
    .order("sort_order", { ascending: true });

  await throwIfError(fieldsError);

  const { data: overrides, error: overridesError } = await input.supabase
    .from("business_template_fields")
    .select("*")
    .eq("business_id", input.businessId);

  await throwIfError(overridesError);

  const overridesByFieldId = new Map(
    (overrides ?? []).map((override) => [override.template_field_id, override]),
  );
  const mergedFields = (fields ?? [])
    .map((field): CleaningTemplateFieldRecord => {
      const override = overridesByFieldId.get(field.id);

      return {
        ...field,
        business_override_id: override?.id ?? null,
        help_text: override?.help_text_override ?? field.help_text,
        is_hidden: override?.is_hidden ?? false,
        is_required: override?.is_required_override ?? field.is_required,
        label: override?.label_override ?? field.label,
        options: override?.options_override ?? field.options,
        sort_order: override?.sort_order_override ?? field.sort_order,
        template_field_id: field.id,
      };
    })
    .sort((left, right) => left.sort_order - right.sort_order);

  return {
    fields: mergedFields,
    template,
  };
}

export async function getBusinessConfiguration(input: {
  businessId: string;
  supabase: SupabaseClient<Database>;
}): Promise<BusinessConfigurationRecord> {
  const [
    branding,
    consentSettings,
    faqs,
    privacySettings,
    serviceAreas,
    services,
    onboardingTasks,
    templateSettings,
  ] = await Promise.all([
    input.supabase
      .from("business_branding")
      .select("*")
      .eq("business_id", input.businessId)
      .maybeSingle(),
    input.supabase
      .from("business_consent_settings")
      .select("*")
      .eq("business_id", input.businessId)
      .maybeSingle(),
    input.supabase
      .from("business_faqs")
      .select("*")
      .eq("business_id", input.businessId)
      .order("sort_order", { ascending: true }),
    input.supabase
      .from("business_privacy_settings")
      .select("*")
      .eq("business_id", input.businessId)
      .maybeSingle(),
    input.supabase
      .from("business_service_areas")
      .select("*")
      .eq("business_id", input.businessId)
      .order("sort_order", { ascending: true }),
    input.supabase
      .from("business_services")
      .select("*")
      .eq("business_id", input.businessId)
      .order("sort_order", { ascending: true }),
    input.supabase
      .from("business_onboarding_tasks")
      .select("*")
      .eq("business_id", input.businessId)
      .order("sort_order", { ascending: true }),
    input.supabase
      .from("business_template_settings")
      .select("*")
      .eq("business_id", input.businessId)
      .eq("is_active", true)
      .maybeSingle(),
  ]);

  await Promise.all([
    throwIfError(branding.error),
    throwIfError(consentSettings.error),
    throwIfError(faqs.error),
    throwIfError(privacySettings.error),
    throwIfError(serviceAreas.error),
    throwIfError(services.error),
    throwIfError(onboardingTasks.error),
    throwIfError(templateSettings.error),
  ]);

  return {
    branding: branding.data,
    consentSettings: consentSettings.data,
    faqs: faqs.data ?? [],
    onboardingTasks: onboardingTasks.data ?? [],
    privacySettings: privacySettings.data,
    serviceAreas: serviceAreas.data ?? [],
    services: services.data ?? [],
    templateSettings: templateSettings.data,
  };
}

export async function upsertBusinessBranding(input: {
  accentColor: string;
  businessId: string;
  logoUrl?: string;
  primaryColor: string;
  supabase: SupabaseClient<Database>;
}): Promise<void> {
  const { error } = await input.supabase.from("business_branding").upsert({
    accent_color: input.accentColor,
    business_id: input.businessId,
    logo_url: input.logoUrl ?? null,
    primary_color: input.primaryColor,
  });

  await throwIfError(error);
}

export async function replaceBusinessServices(input: {
  businessId: string;
  services: ReadonlyArray<{ description?: string; name: string }>;
  supabase: SupabaseClient<Database>;
}): Promise<void> {
  await throwIfError(
    (await input.supabase
      .from("business_services")
      .delete()
      .eq("business_id", input.businessId)).error,
  );

  if (input.services.length === 0) {
    return;
  }

  const { error } = await input.supabase.from("business_services").insert(
    input.services.map((service, index) => ({
      business_id: input.businessId,
      description: service.description ?? null,
      name: service.name,
      sort_order: (index + 1) * 10,
    })),
  );

  await throwIfError(error);
}

export async function replaceBusinessFaqs(input: {
  businessId: string;
  faqs: ReadonlyArray<{ answer: string; question: string }>;
  supabase: SupabaseClient<Database>;
}): Promise<void> {
  await throwIfError(
    (await input.supabase
      .from("business_faqs")
      .delete()
      .eq("business_id", input.businessId)).error,
  );

  if (input.faqs.length === 0) {
    return;
  }

  const { error } = await input.supabase.from("business_faqs").insert(
    input.faqs.map((faq, index) => ({
      answer: faq.answer,
      business_id: input.businessId,
      question: faq.question,
      sort_order: (index + 1) * 10,
    })),
  );

  await throwIfError(error);
}

export async function replaceBusinessServiceAreas(input: {
  areas: readonly string[];
  businessId: string;
  supabase: SupabaseClient<Database>;
}): Promise<void> {
  await throwIfError(
    (await input.supabase
      .from("business_service_areas")
      .delete()
      .eq("business_id", input.businessId)).error,
  );

  if (input.areas.length === 0) {
    return;
  }

  const { error } = await input.supabase.from("business_service_areas").insert(
    input.areas.map((area, index) => ({
      business_id: input.businessId,
      name: area,
      sort_order: (index + 1) * 10,
    })),
  );

  await throwIfError(error);
}

export async function upsertPrivacySettings(input: {
  businessId: string;
  privacyMode: BusinessPrivacySettingsRecord["privacy_mode"];
  retainLeadsDays: number;
  supabase: SupabaseClient<Database>;
}): Promise<void> {
  const { error } = await input.supabase
    .from("business_privacy_settings")
    .upsert({
      business_id: input.businessId,
      privacy_mode: input.privacyMode,
      retain_leads_days: input.retainLeadsDays,
    });

  await throwIfError(error);
}

export async function upsertConsentSettings(input: {
  aiDisclosureEnabled: boolean;
  businessId: string;
  consentNotice: string;
  privacyContactEmail?: string;
  supabase: SupabaseClient<Database>;
}): Promise<void> {
  const { error } = await input.supabase
    .from("business_consent_settings")
    .upsert({
      ai_disclosure_enabled: input.aiDisclosureEnabled,
      business_id: input.businessId,
      consent_notice: input.consentNotice,
      privacy_contact_email: input.privacyContactEmail ?? null,
    });

  await throwIfError(error);
}

export async function upsertTemplateSettings(input: {
  businessId: string;
  customName?: string;
  fieldOverrides: Json;
  supabase: SupabaseClient<Database>;
  templateId: string;
}): Promise<void> {
  const { error } = await input.supabase
    .from("business_template_settings")
    .upsert(
      {
        business_id: input.businessId,
        custom_name: input.customName ?? null,
        field_overrides: input.fieldOverrides,
        is_active: true,
        template_id: input.templateId,
      },
      { onConflict: "business_id,template_id" },
    );

  await throwIfError(error);
}

export async function replaceBusinessTemplateFieldOverrides(input: {
  businessId: string;
  overrides: readonly BusinessTemplateFieldOverrideInput[];
  supabase: SupabaseClient<Database>;
}): Promise<void> {
  await throwIfError(
    (await input.supabase
      .from("business_template_fields")
      .delete()
      .eq("business_id", input.businessId)).error,
  );

  if (input.overrides.length === 0) {
    return;
  }

  const { error } = await input.supabase
    .from("business_template_fields")
    .insert(
      input.overrides.map((override) => ({
        business_id: input.businessId,
        field_key: override.fieldKey,
        help_text_override: override.helpTextOverride ?? null,
        is_hidden: override.isHidden,
        is_required_override: override.isRequiredOverride ?? null,
        label_override: override.labelOverride ?? null,
        options_override: override.optionsOverride ?? null,
        sort_order_override: override.sortOrderOverride ?? null,
        template_field_id: override.templateFieldId,
      })),
    );

  await throwIfError(error);
}

export async function replaceBusinessOnboardingTasks(input: {
  businessId: string;
  supabase: SupabaseClient<Database>;
  tasks: ReadonlyArray<{
    complete: boolean;
    label: string;
    taskKey: string;
  }>;
}): Promise<void> {
  await throwIfError(
    (await input.supabase
      .from("business_onboarding_tasks")
      .delete()
      .eq("business_id", input.businessId)).error,
  );

  if (input.tasks.length === 0) {
    return;
  }

  const now = new Date().toISOString();
  const { error } = await input.supabase
    .from("business_onboarding_tasks")
    .insert(
      input.tasks.map((task, index) => ({
        business_id: input.businessId,
        completed_at: task.complete ? now : null,
        label: task.label,
        sort_order: (index + 1) * 10,
        task_key: task.taskKey,
      })),
    );

  await throwIfError(error);
}
