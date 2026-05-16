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
 * Last Updated: 2026-05-13
 * Change Log:
 * - 2026-05-13: Enforced the server-only runtime boundary.
 * - 2026-05-06: Created Phase 4 public intake service.
 * - 2026-05-07: Added server-side non-negative validation for numeric quote fields.
 * - 2026-05-08: Added server-side validation to reject past date fields.
 * ============================================================
 */

import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  enforceSubmissionRateLimit,
  recordPublicSubmissionAttempt,
} from "@/server/services/abuse-protection.service";
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

const appTimeZone = "America/New_York";

export type PublicIntakeSubmissionInput = Readonly<{
  consentAccepted: boolean;
  consentVersionId: string;
  fieldValues: Record<string, string>;
  honeypot?: string | undefined;
  intakeFormId: string;
  ipHash: string;
  source: LeadSourceInput;
  slug: string;
}>;

function cleanText(value: string | undefined): string {
  return value?.trim() ?? "";
}

function todayDateString(): string {
  const parts = new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "2-digit",
    timeZone: appTimeZone,
    year: "numeric",
  }).formatToParts(new Date());
  const valueByType = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return `${valueByType.year}-${valueByType.month}-${valueByType.day}`;
}

function isValidDateOnly(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);

  return parsed.toISOString().slice(0, 10) === value;
}

function readFieldValue(input: {
  fieldLabel: string;
  fieldType: string;
  value: string;
}): Json {
  const trimmed = input.value.trim();

  if (input.fieldType === "boolean") {
    return trimmed === "on" || trimmed === "true";
  }

  if (input.fieldType === "number") {
    if (trimmed.length === 0) {
      return null;
    }

    const numberValue = Number(trimmed);

    if (!Number.isFinite(numberValue)) {
      throw new Error(`${input.fieldLabel} must be a valid number.`);
    }

    if (numberValue < 0) {
      throw new Error(`${input.fieldLabel} cannot be negative.`);
    }

    return numberValue;
  }

  if (input.fieldType === "date") {
    if (trimmed.length === 0) {
      return null;
    }

    if (!isValidDateOnly(trimmed)) {
      throw new Error(`${input.fieldLabel} must be a valid date.`);
    }

    if (trimmed < todayDateString()) {
      throw new Error(`${input.fieldLabel} cannot be in the past.`);
    }

    return trimmed;
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
    const value = readFieldValue({
      fieldLabel: field.label,
      fieldType: field.field_type,
      value: input.fieldValues[field.field_key] ?? "",
    });

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
  const supabase = await createSupabaseServerClient();
  const page = requirePublicPage(
    await getPublicIntakePageBySlug({
      slug: input.slug,
      supabase,
    }),
  );
  const businessId = page.publicLink.business_id;

  // Rate limit first. The page is already resolved at this point so we have a
  // real business_id to scope the count against. A rate-limit exception is
  // also recorded so an attacker who keeps tripping the limit cannot keep
  // probing without leaving an audit trail.
  try {
    await enforceSubmissionRateLimit({
      businessId,
      ipHash: input.ipHash,
      supabase,
    });
  } catch (error) {
    await recordPublicSubmissionAttempt({
      businessId,
      intakeFormId: page.form.id,
      ipHash: input.ipHash,
      reason: "rate_limit_exceeded",
      supabase,
    });
    throw error;
  }

  if (cleanText(input.honeypot).length > 0) {
    await recordPublicSubmissionAttempt({
      businessId,
      intakeFormId: page.form.id,
      ipHash: input.ipHash,
      reason: "honeypot_triggered",
      supabase,
    });
    throw new Error("Submission rejected.");
  }

  if (!input.consentAccepted) {
    await recordPublicSubmissionAttempt({
      businessId,
      intakeFormId: page.form.id,
      ipHash: input.ipHash,
      reason: "consent_missing",
      supabase,
    });
    throw new Error("Consent is required before submitting.");
  }

  if (
    page.form.id !== input.intakeFormId ||
    page.consentVersion.id !== input.consentVersionId
  ) {
    await recordPublicSubmissionAttempt({
      businessId,
      intakeFormId: page.form.id,
      ipHash: input.ipHash,
      reason: "invalid_form",
      supabase,
    });
    throw new Error("The quote form changed. Please refresh and submit again.");
  }

  let values: IntakeSubmissionValueInput[];
  try {
    values = getSubmissionValues({
      fieldValues: input.fieldValues,
      page,
    });
  } catch (error) {
    await recordPublicSubmissionAttempt({
      businessId,
      intakeFormId: page.form.id,
      ipHash: input.ipHash,
      reason: "invalid_field",
      supabase,
    });
    throw error;
  }

  const valueByKey = Object.fromEntries(
    values.map((value) => [value.fieldKey, value.value]),
  );
  const submissionId = crypto.randomUUID();
  const leadId = crypto.randomUUID();
  const consentAcceptedAt = new Date().toISOString();
  const sourceChannel =
    input.source.sourceChannel ?? input.source.utmSource ?? "public_quote_link";

  await insertPublicSubmission({
    businessId,
    consentAcceptedAt,
    consentVersionId: page.consentVersion.id,
    intakeFormId: page.form.id,
    privacyMode: page.form.privacy_mode,
    submissionId,
    supabase,
  });

  await insertPublicSubmissionValues({
    businessId,
    submissionId,
    supabase,
    values,
  });

  await insertPublicLead({
    businessId,
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
    businessId,
    leadId,
    source: {
      ...input.source,
      sourceChannel,
    },
    supabase,
  });

  await recordPublicSubmissionAttempt({
    businessId,
    intakeFormId: page.form.id,
    ipHash: input.ipHash,
    reason: "submission_completed",
    supabase,
  });
}
