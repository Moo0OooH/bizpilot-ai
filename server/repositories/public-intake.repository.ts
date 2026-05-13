/**
 * ============================================================
 * File: server/repositories/public-intake.repository.ts
 * Project: BizPilot AI
 * Description: Handles Phase 4 public intake, submission, lead, and source data access.
 * Role: Owns public-safe reads, scoped inserts, and form sync operations through Supabase RLS.
 * Related:
 * - server/services/public-intake.service.ts
 * - server/services/business-configuration.service.ts
 * - supabase/migrations/0005_public_intake_and_leads.sql
 * Author: MoOoH
 * Created: 2026-05-06
 * Last Updated: 2026-05-13
 * Change Log:
 * - 2026-05-13: Enforced the server-only runtime boundary.
 * - 2026-05-06: Created Phase 4 public intake repository.
 * ============================================================
 */

import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { CleaningTemplateFieldRecord } from "@/server/repositories/business-configuration.repository";
import type { Database, Json } from "@/types/database";

export type IntakeFormRecord =
  Database["public"]["Tables"]["intake_forms"]["Row"];
export type IntakeFormFieldRecord =
  Database["public"]["Tables"]["intake_form_fields"]["Row"];
export type ConsentVersionRecord =
  Database["public"]["Tables"]["consent_versions"]["Row"];
export type PublicLinkVariantRecord =
  Database["public"]["Tables"]["public_link_variants"]["Row"];
export type BusinessBrandingRecord =
  Database["public"]["Tables"]["business_branding"]["Row"];

export type PublicIntakePageRecord = Readonly<{
  branding: BusinessBrandingRecord | null;
  consentVersion: ConsentVersionRecord;
  fields: IntakeFormFieldRecord[];
  form: IntakeFormRecord;
  publicLink: PublicLinkVariantRecord;
}>;

export type IntakeSubmissionValueInput = Readonly<{
  fieldKey: string;
  fieldLabel: string;
  value: Json;
}>;

export type LeadSourceInput = Readonly<{
  referrer?: string | undefined;
  sourceChannel?: string | undefined;
  sourceUrl?: string | undefined;
  utmCampaign?: string | undefined;
  utmMedium?: string | undefined;
  utmSource?: string | undefined;
}>;

async function throwIfError(error: { message: string } | null): Promise<void> {
  if (error) {
    throw new Error(error.message);
  }
}

function cleanOptionalText(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}

export async function upsertPublicLinkVariant(input: {
  businessId: string;
  displayName: string;
  slug: string;
  supabase: SupabaseClient<Database>;
}): Promise<void> {
  await throwIfError(
    (await input.supabase
      .from("public_link_variants")
      .update({ is_active: false })
      .eq("business_id", input.businessId)).error,
  );

  const { error } = await input.supabase.from("public_link_variants").upsert(
    {
      business_id: input.businessId,
      display_name: input.displayName,
      is_active: true,
      slug: input.slug,
    },
    { onConflict: "slug" },
  );

  await throwIfError(error);
}

export async function upsertConsentVersion(input: {
  aiDisclosureEnabled: boolean;
  businessId: string;
  consentNotice: string;
  privacyContactEmail?: string;
  supabase: SupabaseClient<Database>;
}): Promise<void> {
  const { error } = await input.supabase.from("consent_versions").upsert(
    {
      ai_disclosure_enabled: input.aiDisclosureEnabled,
      business_id: input.businessId,
      consent_notice: input.consentNotice,
      is_active: true,
      privacy_contact_email: cleanOptionalText(input.privacyContactEmail),
      version_label: "v1",
    },
    { onConflict: "business_id,version_label" },
  );

  await throwIfError(error);
}

export async function upsertIntakeFormFromTemplate(input: {
  businessId: string;
  fields: CleaningTemplateFieldRecord[];
  formName: string;
  privacyMode: "minimal" | "standard";
  supabase: SupabaseClient<Database>;
  templateId: string;
}): Promise<void> {
  const { data: form, error: formError } = await input.supabase
    .from("intake_forms")
    .upsert(
      {
        business_id: input.businessId,
        is_active: true,
        name: input.formName,
        privacy_mode: input.privacyMode,
        template_id: input.templateId,
      },
      { onConflict: "business_id,template_id" },
    )
    .select("*")
    .single();

  await throwIfError(formError);

  if (!form) {
    throw new Error("Unable to sync public intake form.");
  }

  await throwIfError(
    (await input.supabase
      .from("intake_form_fields")
      .delete()
      .eq("intake_form_id", form.id)).error,
  );

  if (input.fields.length === 0) {
    return;
  }

  const { error } = await input.supabase.from("intake_form_fields").insert(
    input.fields.map((field) => ({
      business_id: input.businessId,
      field_key: field.field_key,
      field_type: field.field_type,
      help_text: field.help_text,
      intake_form_id: form.id,
      is_hidden: field.is_hidden,
      is_required: field.is_required,
      label: field.label,
      options: field.options,
      sort_order: field.sort_order,
      template_field_id: field.template_field_id,
    })),
  );

  await throwIfError(error);
}

export async function getPublicIntakePageBySlug(input: {
  slug: string;
  supabase: SupabaseClient<Database>;
}): Promise<PublicIntakePageRecord | null> {
  const { data: publicLink, error: publicLinkError } = await input.supabase
    .from("public_link_variants")
    .select("*")
    .eq("slug", input.slug)
    .eq("is_active", true)
    .maybeSingle();

  await throwIfError(publicLinkError);

  if (!publicLink) {
    return null;
  }

  const [branding, form, consentVersion] = await Promise.all([
    input.supabase
      .from("business_branding")
      .select("*")
      .eq("business_id", publicLink.business_id)
      .maybeSingle(),
    input.supabase
      .from("intake_forms")
      .select("*")
      .eq("business_id", publicLink.business_id)
      .eq("is_active", true)
      .maybeSingle(),
    input.supabase
      .from("consent_versions")
      .select("*")
      .eq("business_id", publicLink.business_id)
      .eq("is_active", true)
      .maybeSingle(),
  ]);

  await Promise.all([
    throwIfError(branding.error),
    throwIfError(form.error),
    throwIfError(consentVersion.error),
  ]);

  if (!form.data || !consentVersion.data) {
    return null;
  }

  const { data: fields, error: fieldsError } = await input.supabase
    .from("intake_form_fields")
    .select("*")
    .eq("intake_form_id", form.data.id)
    .eq("is_hidden", false)
    .order("sort_order", { ascending: true });

  await throwIfError(fieldsError);

  return {
    branding: branding.data,
    consentVersion: consentVersion.data,
    fields: fields ?? [],
    form: form.data,
    publicLink,
  };
}

export async function insertPublicSubmission(input: {
  businessId: string;
  consentAcceptedAt: string;
  consentVersionId: string;
  intakeFormId: string;
  privacyMode: "minimal" | "standard";
  submissionId: string;
  supabase: SupabaseClient<Database>;
}): Promise<void> {
  const { error } = await input.supabase.from("intake_submissions").insert({
    business_id: input.businessId,
    consent_accepted_at: input.consentAcceptedAt,
    consent_version_id: input.consentVersionId,
    id: input.submissionId,
    intake_form_id: input.intakeFormId,
    privacy_mode: input.privacyMode,
  });

  await throwIfError(error);
}

export async function insertPublicSubmissionValues(input: {
  businessId: string;
  submissionId: string;
  supabase: SupabaseClient<Database>;
  values: readonly IntakeSubmissionValueInput[];
}): Promise<void> {
  if (input.values.length === 0) {
    return;
  }

  const { error } = await input.supabase.from("intake_submission_values").insert(
    input.values.map((value) => ({
      business_id: input.businessId,
      field_key: value.fieldKey,
      field_label: value.fieldLabel,
      field_value: value.value,
      submission_id: input.submissionId,
    })),
  );

  await throwIfError(error);
}

export async function insertPublicLead(input: {
  businessId: string;
  cityOrServiceArea?: string | undefined;
  customerContact?: string | undefined;
  customerName?: string | undefined;
  leadId: string;
  serviceType?: string | undefined;
  sourceChannel?: string | undefined;
  submissionId: string;
  supabase: SupabaseClient<Database>;
}): Promise<void> {
  const { error } = await input.supabase.from("leads").insert({
    business_id: input.businessId,
    city_or_service_area: cleanOptionalText(input.cityOrServiceArea),
    customer_contact: cleanOptionalText(input.customerContact),
    customer_name: cleanOptionalText(input.customerName),
    id: input.leadId,
    intake_submission_id: input.submissionId,
    service_type: cleanOptionalText(input.serviceType),
    source_channel: cleanOptionalText(input.sourceChannel),
  });

  await throwIfError(error);
}

export async function insertLeadSourceMetadata(input: {
  businessId: string;
  leadId: string;
  source: LeadSourceInput;
  supabase: SupabaseClient<Database>;
}): Promise<void> {
  const { error } = await input.supabase.from("lead_source_metadata").insert({
    business_id: input.businessId,
    lead_id: input.leadId,
    referrer: cleanOptionalText(input.source.referrer),
    source_channel: cleanOptionalText(input.source.sourceChannel),
    source_url: cleanOptionalText(input.source.sourceUrl),
    utm_campaign: cleanOptionalText(input.source.utmCampaign),
    utm_medium: cleanOptionalText(input.source.utmMedium),
    utm_source: cleanOptionalText(input.source.utmSource),
  });

  await throwIfError(error);
}
