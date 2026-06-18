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

import { getBizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import type { SupportedLanguage } from "@/lib/i18n/language";
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
  formRenderedAt?: string | undefined;
  honeypot?: string | undefined;
  intakeFormId: string;
  ipHash: string;
  language: SupportedLanguage;
  source: LeadSourceInput;
  slug: string;
}>;

export const SUBMISSION_TOO_FAST_MESSAGE =
  "Please wait a moment and submit the quote request again.";

const MINIMUM_PUBLIC_SUBMIT_AGE_MS = 2500;

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
  copy: ReturnType<typeof getBizPilotCopy>;
  fieldLabel: string;
  fieldOptions: Json;
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
      throw new Error(input.copy.intakeErrors.validNumber(input.fieldLabel));
    }

    if (numberValue < 0) {
      throw new Error(input.copy.intakeErrors.nonNegativeNumber(input.fieldLabel));
    }

    return numberValue;
  }

  if (input.fieldType === "date") {
    if (trimmed.length === 0) {
      return null;
    }

    if (!isValidDateOnly(trimmed)) {
      throw new Error(input.copy.intakeErrors.validDate(input.fieldLabel));
    }

    if (trimmed < todayDateString()) {
      throw new Error(input.copy.intakeErrors.notPastDate(input.fieldLabel));
    }

    return trimmed;
  }

  if (
    input.fieldType === "radio" ||
    input.fieldType === "select" ||
    input.fieldType === "time_window"
  ) {
    const options = Array.isArray(input.fieldOptions)
      ? input.fieldOptions.filter((item): item is string => typeof item === "string")
      : [];

    if (trimmed.length === 0) {
      return null;
    }

    if (options.length > 0 && !options.includes(trimmed)) {
      throw new Error(input.copy.intakeErrors.formChanged);
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
    throw new Error(getBizPilotCopy(null).intakeErrors.linkUnavailable);
  }

  return page;
}

function getSubmissionAgeMs(formRenderedAt: string | undefined): number | null {
  if (!formRenderedAt) {
    return null;
  }

  const renderedAtMs = Number(formRenderedAt);

  if (!Number.isFinite(renderedAtMs) || renderedAtMs <= 0) {
    return null;
  }

  return Date.now() - renderedAtMs;
}

function getSubmissionValues(input: {
  copy: ReturnType<typeof getBizPilotCopy>;
  fieldValues: Record<string, string>;
  page: PublicIntakePageRecord;
}): IntakeSubmissionValueInput[] {
  return input.page.fields.map((field) => {
    const value = readFieldValue({
      copy: input.copy,
      fieldLabel: field.label,
      fieldOptions: field.options,
      fieldType: field.field_type,
      value: input.fieldValues[field.field_key] ?? "",
    });

    if (field.is_required && (value === null || value === "")) {
      throw new Error(input.copy.intakeErrors.fieldRequired(field.label));
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
  const copy = getBizPilotCopy(input.language);

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
    throw new Error(copy.intakeErrors.rejected);
  }

  const submissionAgeMs = getSubmissionAgeMs(input.formRenderedAt);
  if (
    submissionAgeMs === null ||
    submissionAgeMs < MINIMUM_PUBLIC_SUBMIT_AGE_MS
  ) {
    await recordPublicSubmissionAttempt({
      businessId,
      intakeFormId: page.form.id,
      ipHash: input.ipHash,
      reason: "submitted_too_fast",
      supabase,
    });
    throw new Error(copy.intakeErrors.submittedTooFast);
  }

  if (!input.consentAccepted) {
    await recordPublicSubmissionAttempt({
      businessId,
      intakeFormId: page.form.id,
      ipHash: input.ipHash,
      reason: "consent_missing",
      supabase,
    });
    throw new Error(copy.intakeErrors.consentRequired);
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
    throw new Error(copy.intakeErrors.formChanged);
  }

  let values: IntakeSubmissionValueInput[];
  try {
    values = getSubmissionValues({
      copy,
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
