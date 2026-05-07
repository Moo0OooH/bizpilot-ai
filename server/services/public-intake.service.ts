/**
 * ============================================================
 * File: server/services/public-intake.service.ts
 * Project: BizPilot AI
 * Description: Coordinates Phase 4 public quote page reads and lead submissions.
 * Role: Validates public intake input, enforces scoped submission rules, and creates initial leads.
 * Related:
 * - server/actions/public-intake.actions.ts
 * - server/repositories/public-intake.repository.ts
 * - app/(public)/quote/[slug]/page.tsx
 * Author: MoOoH
 * Created: 2026-05-06
 * Last Updated: 2026-05-06
 * Change Log:
 * - 2026-05-06: Created Phase 4 public intake service.
 * ============================================================
 */

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  getPublicIntakePageBySlug,
  insertLeadSourceMetadata,
  insertPublicLead,
  insertPublicSubmission,
  insertPublicSubmissionValues,
  type IntakeSubmissionValueInput,
  type LeadSourceInput,
  type PublicIntakePageRecord,
} from "@/server/repositories/public-intake.repository";
import type { Json } from "@/types/database";

export type PublicIntakeSubmissionInput = Readonly<{
  consentAccepted: boolean;
  consentVersionId: string;
  fieldValues: Record<string, string>;
  honeypot?: string | undefined;
  intakeFormId: string;
  source: LeadSourceInput;
  slug: string;
}>;

function cleanText(value: string | undefined): string {
  return value?.trim() ?? "";
}

function readFieldValue(value: string, fieldType: string): Json {
  const trimmed = value.trim();

  if (fieldType === "boolean") {
    return trimmed === "on" || trimmed === "true";
  }

  if (fieldType === "number") {
    return trimmed.length > 0 ? Number(trimmed) : null;
  }

  return trimmed.length > 0 ? trimmed : null;
}

function jsonToText(value: Json | undefined): string | undefined {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}

function requirePublicPage(
  page: PublicIntakePageRecord | null,
): PublicIntakePageRecord {
  if (!page) {
    throw new Error("This quote link is not available.");
  }

  return page;
}

function getSubmissionValues(input: {
  fieldValues: Record<string, string>;
  page: PublicIntakePageRecord;
}): IntakeSubmissionValueInput[] {
  return input.page.fields.map((field) => {
    const value = readFieldValue(
      input.fieldValues[field.field_key] ?? "",
      field.field_type,
    );

    if (field.is_required && (value === null || value === "")) {
      throw new Error(`${field.label} is required.`);
    }

    return {
      fieldKey: field.field_key,
      fieldLabel: field.label,
      value,
    };
  });
}

export async function getPublicIntakePage(input: {
  slug: string;
}): Promise<PublicIntakePageRecord | null> {
  const supabase = await createSupabaseServerClient();

  return getPublicIntakePageBySlug({
    slug: input.slug,
    supabase,
  });
}

export async function submitPublicIntake(
  input: PublicIntakeSubmissionInput,
): Promise<void> {
  if (cleanText(input.honeypot).length > 0) {
    throw new Error("Submission rejected.");
  }

  if (!input.consentAccepted) {
    throw new Error("Consent is required before submitting.");
  }

  const supabase = await createSupabaseServerClient();
  const page = requirePublicPage(
    await getPublicIntakePageBySlug({
      slug: input.slug,
      supabase,
    }),
  );

  if (
    page.form.id !== input.intakeFormId ||
    page.consentVersion.id !== input.consentVersionId
  ) {
    throw new Error("The quote form changed. Please refresh and submit again.");
  }

  const values = getSubmissionValues({
    fieldValues: input.fieldValues,
    page,
  });
  const valueByKey = Object.fromEntries(
    values.map((value) => [value.fieldKey, value.value]),
  );
  const submissionId = crypto.randomUUID();
  const leadId = crypto.randomUUID();
  const consentAcceptedAt = new Date().toISOString();
  const sourceChannel =
    input.source.sourceChannel ?? input.source.utmSource ?? "public_quote_link";

  await insertPublicSubmission({
    businessId: page.publicLink.business_id,
    consentAcceptedAt,
    consentVersionId: page.consentVersion.id,
    intakeFormId: page.form.id,
    privacyMode: page.form.privacy_mode,
    submissionId,
    supabase,
  });

  await insertPublicSubmissionValues({
    businessId: page.publicLink.business_id,
    submissionId,
    supabase,
    values,
  });

  await insertPublicLead({
    businessId: page.publicLink.business_id,
    cityOrServiceArea: jsonToText(valueByKey.city_or_service_area),
    customerContact: jsonToText(valueByKey.customer_contact),
    customerName: jsonToText(valueByKey.customer_name),
    leadId,
    serviceType: jsonToText(valueByKey.cleaning_type),
    sourceChannel,
    submissionId,
    supabase,
  });

  await insertLeadSourceMetadata({
    businessId: page.publicLink.business_id,
    leadId,
    source: {
      ...input.source,
      sourceChannel,
    },
    supabase,
  });
}
