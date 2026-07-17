/**
 * ============================================================
 * File: server/repositories/business-configuration.repository.ts
 * Project: BizPilot AI
 * Description: Handles Phase 3 business configuration data access through Supabase RLS.
 * Role: Owns reads and writes for business settings, services, FAQs, areas, and template settings.
 * Related:
 * - server/services/business-configuration.service.ts
 * - supabase/migrations/0002_business_template_configuration.sql
 * Author: MoOoH
 * Created: 2026-05-05
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Added a minimal onboarding-review read so scoped saves preserve previously confirmed setup steps.
 * - 2026-07-11: Added bilingual custom quote-field override parsing, merge helpers, and localized field resolution.
 * - 2026-05-13: Enforced the server-only runtime boundary.
 * - 2026-05-05: Created Phase 3 business configuration repository.
 * - 2026-05-05: Added onboarding task reads and sync support.
 * - 2026-05-05: Merged editable template field settings from business_template_settings.
 * ============================================================
 */

import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { localizeDefaultQuoteField } from "@/lib/i18n/bizpilot-copy";
import {
  readSupportedLanguage,
  supportedLanguages,
  type SupportedLanguage,
} from "@/lib/i18n/language";
import {
  getDefaultQuoteFormLayout,
  localizeQuoteFormLayout,
  mergeQuoteFormLayoutsForLanguage,
  parseQuoteFormLayout,
  resolveQuoteFieldSectionKey,
  serializeQuoteFormLayout,
  type QuoteFormLayout,
} from "@/lib/quote-form-layout";
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
export type BusinessOnboardingTaskRecord =
  Database["public"]["Tables"]["business_onboarding_tasks"]["Row"];
export type IndustryTemplateFieldRecord =
  Database["public"]["Tables"]["industry_template_fields"]["Row"];
export type IndustryTemplateRecord =
  Database["public"]["Tables"]["industry_templates"]["Row"];
type QuoteFieldType = IndustryTemplateFieldRecord["field_type"];

export type CleaningTemplateFieldRecord = IndustryTemplateFieldRecord & {
  is_custom?: boolean;
  is_hidden: boolean;
  section_key: string;
  template_field_id: string | null;
};

export type CleaningTemplateRecord = Readonly<{
  fields: CleaningTemplateFieldRecord[];
  formLayout: QuoteFormLayout;
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

export type TemplateFieldTranslation = Readonly<{
  helpText?: string;
  label?: string;
}>;

export type TemplateFieldTranslations = Readonly<
  Partial<Record<SupportedLanguage, TemplateFieldTranslation>>
>;

export type TemplateFieldOverride = Readonly<{
  fieldType?: QuoteFieldType;
  helpText?: string;
  isHidden?: boolean;
  isRequired?: boolean;
  label?: string;
  options?: Json;
  sectionKey?: string;
  sortOrder?: number;
  translations?: TemplateFieldTranslations;
}>;

export type CustomTemplateFieldOverride = TemplateFieldOverride & Readonly<{
  fieldType: QuoteFieldType;
  label: string;
}>;

export type TemplateFieldOverrides = Readonly<{
  customFields?: Record<string, CustomTemplateFieldOverride>;
  disabledFields?: string[];
  fields?: Record<string, TemplateFieldOverride>;
  formLayout?: QuoteFormLayout;
  labels?: Record<string, string>;
  optionalFields?: string[];
  requiredFields?: string[];
}>;

async function throwIfError(error: { message: string } | null): Promise<void> {
  if (error) {
    throw new Error(error.message);
  }
}

function isRecord(value: Json | undefined): value is Record<string, Json> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function readStringMap(value: Json | undefined): Record<string, string> {
  if (!isRecord(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  );
}

function readStringList(value: Json | undefined): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function readFieldType(value: Json | undefined): QuoteFieldType | undefined {
  const allowedTypes: readonly QuoteFieldType[] = [
    "boolean",
    "date",
    "email",
    "number",
    "phone",
    "radio",
    "select",
    "text",
    "textarea",
    "time_window",
  ];

  return typeof value === "string" &&
    allowedTypes.includes(value as QuoteFieldType)
    ? (value as QuoteFieldType)
    : undefined;
}

function cleanTranslationText(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
}

function readTemplateFieldTranslation(
  value: Json | undefined,
): TemplateFieldTranslation | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const helpText = cleanTranslationText(
    typeof value.helpText === "string" ? value.helpText : undefined,
  );
  const label = cleanTranslationText(
    typeof value.label === "string" ? value.label : undefined,
  );

  return helpText || label ? { ...(helpText ? { helpText } : {}), ...(label ? { label } : {}) } : undefined;
}

function readTemplateFieldTranslations(
  value: Json | undefined,
): TemplateFieldTranslations | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const translations: Partial<Record<SupportedLanguage, TemplateFieldTranslation>> =
    {};

  for (const language of supportedLanguages) {
    const translation = readTemplateFieldTranslation(value[language]);

    if (translation) {
      translations[language] = translation;
    }
  }

  return Object.keys(translations).length > 0 ? translations : undefined;
}

function readTemplateFieldOverride(
  value: Record<string, Json>,
): TemplateFieldOverride {
  const fieldType = readFieldType(value.fieldType);
  const translations = readTemplateFieldTranslations(value.translations);

  return {
    ...(fieldType ? { fieldType } : {}),
    ...(typeof value.helpText === "string"
      ? { helpText: value.helpText }
      : {}),
    ...(typeof value.isHidden === "boolean"
      ? { isHidden: value.isHidden }
      : {}),
    ...(typeof value.isRequired === "boolean"
      ? { isRequired: value.isRequired }
      : {}),
    ...(typeof value.label === "string" ? { label: value.label } : {}),
    ...(value.options !== undefined ? { options: value.options } : {}),
    ...(typeof value.sectionKey === "string"
      ? { sectionKey: value.sectionKey }
      : {}),
    ...(typeof value.sortOrder === "number"
      ? { sortOrder: value.sortOrder }
      : {}),
    ...(translations ? { translations } : {}),
  };
}

export function readTemplateFieldOverrides(value: Json): TemplateFieldOverrides {
  if (!isRecord(value)) {
    return {};
  }

  const formLayout = parseQuoteFormLayout(value.formLayout);

  const fields = isRecord(value.fields)
    ? Object.fromEntries(
        Object.entries(value.fields)
          .filter((entry): entry is [string, Record<string, Json>] =>
            isRecord(entry[1]),
          )
          .map(([fieldKey, override]) => [
            fieldKey,
            readTemplateFieldOverride(override),
          ]),
      )
    : {};
  const customFields = isRecord(value.customFields)
    ? Object.fromEntries(
        Object.entries(value.customFields)
          .filter((entry): entry is [string, Record<string, Json>] =>
            isRecord(entry[1]),
          )
          .map(([fieldKey, override]) => {
            const fieldType = readFieldType(override.fieldType);
            const label =
              typeof override.label === "string" ? override.label : undefined;

            if (!fieldType || !label) {
              return null;
            }

            return [
              fieldKey,
              {
                ...readTemplateFieldOverride(override),
                fieldType,
                label,
              },
            ] as const;
          })
          .filter(
            (entry): entry is readonly [string, CustomTemplateFieldOverride] =>
              entry !== null,
          ),
      )
    : {};

  return {
    customFields,
    disabledFields: readStringList(value.disabledFields),
    fields,
    ...(formLayout ? { formLayout } : {}),
    labels: readStringMap(value.labels),
    optionalFields: readStringList(value.optionalFields),
    requiredFields: readStringList(value.requiredFields),
  };
}

function serializeTemplateFieldTranslation(
  translation: TemplateFieldTranslation,
): Record<string, Json> {
  return {
    ...(translation.helpText ? { helpText: translation.helpText } : {}),
    ...(translation.label ? { label: translation.label } : {}),
  };
}

function serializeTemplateFieldTranslations(
  translations: TemplateFieldTranslations | undefined,
): Record<string, Json> | undefined {
  if (!translations) {
    return undefined;
  }

  const serializedTranslations: Record<string, Json> = {};

  for (const language of supportedLanguages) {
    const translation = translations[language];

    if (!translation) {
      continue;
    }

    const serialized = serializeTemplateFieldTranslation(translation);

    if (Object.keys(serialized).length > 0) {
      serializedTranslations[language] = serialized;
    }
  }

  return Object.keys(serializedTranslations).length > 0
    ? serializedTranslations
    : undefined;
}

function serializeTemplateFieldOverride(
  override: TemplateFieldOverride,
): Record<string, Json> {
  const translations = serializeTemplateFieldTranslations(override.translations);

  return {
    ...(override.fieldType ? { fieldType: override.fieldType } : {}),
    ...(override.helpText !== undefined ? { helpText: override.helpText } : {}),
    ...(override.isHidden !== undefined ? { isHidden: override.isHidden } : {}),
    ...(override.isRequired !== undefined
      ? { isRequired: override.isRequired }
      : {}),
    ...(override.label !== undefined ? { label: override.label } : {}),
    ...(override.options !== undefined ? { options: override.options } : {}),
    ...(override.sectionKey !== undefined
      ? { sectionKey: override.sectionKey }
      : {}),
    ...(override.sortOrder !== undefined
      ? { sortOrder: override.sortOrder }
      : {}),
    ...(translations ? { translations } : {}),
  };
}

export function serializeTemplateFieldOverrides(
  overrides: TemplateFieldOverrides,
): Json {
  return {
    ...(overrides.customFields
      ? {
          customFields: Object.fromEntries(
            Object.entries(overrides.customFields).map(([fieldKey, override]) => [
              fieldKey,
              serializeTemplateFieldOverride(override),
            ]),
          ),
        }
      : {}),
    ...(overrides.disabledFields ? { disabledFields: overrides.disabledFields } : {}),
    ...(overrides.fields
      ? {
          fields: Object.fromEntries(
            Object.entries(overrides.fields).map(([fieldKey, override]) => [
              fieldKey,
              serializeTemplateFieldOverride(override),
            ]),
          ),
        }
      : {}),
    ...(overrides.formLayout
      ? { formLayout: serializeQuoteFormLayout(overrides.formLayout) }
      : {}),
    ...(overrides.labels ? { labels: overrides.labels } : {}),
    ...(overrides.optionalFields ? { optionalFields: overrides.optionalFields } : {}),
    ...(overrides.requiredFields ? { requiredFields: overrides.requiredFields } : {}),
  };
}

function mergeTemplateFieldTranslations(input: {
  currentLanguage: SupportedLanguage;
  existing: TemplateFieldTranslations | undefined;
  incoming: TemplateFieldTranslations | undefined;
}): TemplateFieldTranslations | undefined {
  const merged: Partial<Record<SupportedLanguage, TemplateFieldTranslation>> = {};

  for (const language of supportedLanguages) {
    if (language === input.currentLanguage) {
      const currentTranslation = input.incoming?.[language];
      if (currentTranslation) {
        merged[language] = currentTranslation;
      }
      continue;
    }

    const preservedTranslation =
      input.incoming?.[language] ?? input.existing?.[language];

    if (preservedTranslation) {
      merged[language] = preservedTranslation;
    }
  }

  return Object.keys(merged).length > 0 ? merged : undefined;
}

function mergeTemplateFieldOverride<T extends TemplateFieldOverride>(input: {
  currentLanguage: SupportedLanguage;
  existing: T | undefined;
  incoming: T;
}): T {
  const translations = mergeTemplateFieldTranslations({
    currentLanguage: input.currentLanguage,
    existing: input.existing?.translations,
    incoming: input.incoming.translations,
  });

  return {
    ...input.incoming,
    ...(input.incoming.sectionKey ?? input.existing?.sectionKey
      ? { sectionKey: input.incoming.sectionKey ?? input.existing?.sectionKey }
      : {}),
    ...(translations ? { translations } : {}),
  } as T;
}

export function mergeTemplateFieldOverridesForLanguage(input: {
  currentLanguage: SupportedLanguage;
  existing: Json | TemplateFieldOverrides;
  incoming: Json | TemplateFieldOverrides;
}): Json {
  const existing = readTemplateFieldOverrides(input.existing as Json);
  const incoming = readTemplateFieldOverrides(input.incoming as Json);

  const fields = Object.fromEntries(
    Object.entries(incoming.fields ?? {}).map(([fieldKey, override]) => [
      fieldKey,
      mergeTemplateFieldOverride({
        currentLanguage: input.currentLanguage,
        existing: existing.fields?.[fieldKey],
        incoming: override,
      }),
    ]),
  );
  const customFields = Object.fromEntries(
    Object.entries(incoming.customFields ?? {}).map(([fieldKey, override]) => [
      fieldKey,
      mergeTemplateFieldOverride({
        currentLanguage: input.currentLanguage,
        existing: existing.customFields?.[fieldKey],
        incoming: override,
      }),
    ]),
  );
  const formLayout = incoming.formLayout
    ? mergeQuoteFormLayoutsForLanguage({
        currentLanguage: input.currentLanguage,
        existing: existing.formLayout ?? getDefaultQuoteFormLayout(),
        incoming: incoming.formLayout,
      })
    : existing.formLayout;

  return serializeTemplateFieldOverrides({
    ...incoming,
    customFields,
    fields,
    ...(formLayout ? { formLayout } : {}),
  });
}

export function resolveLocalizedTemplateFieldCopy(input: {
  fieldKey: string;
  helpText: string | null;
  label: string;
  language: unknown;
  translations: TemplateFieldTranslations | undefined;
}): { helpText: string | null; label: string } {
  const language = readSupportedLanguage(input.language);
  const localizedTranslation = input.translations?.[language];
  const label = localizedTranslation?.label ?? input.label;
  const helpText = localizedTranslation?.helpText ?? input.helpText;

  return localizeDefaultQuoteField({
    fieldKey: input.fieldKey,
    helpText,
    label,
    language,
  });
}

export async function getBusinessTemplateFieldOverrides(input: {
  businessId: string;
  supabase: SupabaseClient<Database>;
  templateId: string;
}): Promise<TemplateFieldOverrides> {
  const { data: templateSettings, error: templateSettingsError } =
    await input.supabase
      .from("business_template_settings")
      .select("field_overrides")
      .eq("business_id", input.businessId)
      .eq("template_id", input.templateId)
      .maybeSingle();

  await throwIfError(templateSettingsError);

  return readTemplateFieldOverrides(templateSettings?.field_overrides ?? {});
}

export async function getCleaningTemplate(input: {
  businessId: string;
  preferredLanguage?: Database["public"]["Tables"]["businesses"]["Row"]["preferred_language"];
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

  const overrides = await getBusinessTemplateFieldOverrides({
    businessId: input.businessId,
    supabase: input.supabase,
    templateId: template.id,
  });
  const formLayout = localizeQuoteFormLayout({
    language: input.preferredLanguage,
    layout: overrides.formLayout ?? getDefaultQuoteFormLayout(),
  });
  const mergedFields = (fields ?? [])
    .map((field): CleaningTemplateFieldRecord => {
      const fieldOverride = overrides.fields?.[field.field_key];
      const legacyLabel = overrides.labels?.[field.field_key];
      const isLegacyRequired = overrides.requiredFields?.includes(
        field.field_key,
      );
      const isLegacyOptional = overrides.optionalFields?.includes(
        field.field_key,
      );
      const isLegacyHidden = overrides.disabledFields?.includes(
        field.field_key,
      );
      const isRequired =
        fieldOverride?.isRequired ??
        (isLegacyRequired ? true : isLegacyOptional ? false : field.is_required);

      const label = fieldOverride?.label ?? legacyLabel ?? field.label;
      const helpText = fieldOverride?.helpText ?? field.help_text;
      const localized = resolveLocalizedTemplateFieldCopy({
        fieldKey: field.field_key,
        helpText,
        label,
        language: input.preferredLanguage,
        translations: fieldOverride?.translations,
      });
      const sectionKey = resolveQuoteFieldSectionKey({
        fieldKey: field.field_key,
        formLayout,
        sectionKey: fieldOverride?.sectionKey,
      });

      return {
        ...field,
        help_text: localized.helpText,
        is_hidden: fieldOverride?.isHidden ?? isLegacyHidden ?? false,
        is_required: isRequired,
        label: localized.label,
        field_type: fieldOverride?.fieldType ?? field.field_type,
        options: fieldOverride?.options ?? field.options,
        section_key: sectionKey,
        sort_order: fieldOverride?.sortOrder ?? field.sort_order,
        template_field_id: field.id,
      };
    });
  const customFields = Object.entries(overrides.customFields ?? {}).map(
    ([fieldKey, field]): CleaningTemplateFieldRecord => {
      const localized = resolveLocalizedTemplateFieldCopy({
        fieldKey,
        helpText: field.helpText ?? null,
        label: field.label,
        language: input.preferredLanguage,
        translations: field.translations,
      });
      const sectionKey = resolveQuoteFieldSectionKey({
        fieldKey,
        formLayout,
        sectionKey: field.sectionKey,
      });

      return {
        created_at: template.created_at,
        field_key: fieldKey,
        field_type: field.fieldType,
        help_text: localized.helpText,
        id: `${template.id}:${fieldKey}`,
        is_active: true,
        is_custom: true,
        is_hidden: field.isHidden ?? false,
        is_required: field.isRequired ?? false,
        label: localized.label,
        options: field.options ?? [],
        section_key: sectionKey,
        sort_order: field.sortOrder ?? 500,
        template_field_id: null,
        template_id: template.id,
        updated_at: template.updated_at,
      };
    },
  );
  const allFields = [...mergedFields, ...customFields]
    .sort((left, right) => left.sort_order - right.sort_order);

  return {
    fields: allFields,
    formLayout,
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

export async function listBusinessOnboardingTaskReviews(input: {
  businessId: string;
  supabase: SupabaseClient<Database>;
}): Promise<Array<Pick<BusinessOnboardingTaskRecord, "completed_at" | "task_key">>> {
  const { data, error } = await input.supabase
    .from("business_onboarding_tasks")
    .select("completed_at,task_key")
    .eq("business_id", input.businessId);

  await throwIfError(error);
  return data ?? [];
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
