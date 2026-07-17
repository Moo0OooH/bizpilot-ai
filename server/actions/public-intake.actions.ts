/**
 * ============================================================
 * File: server/actions/public-intake.actions.ts
 * Project: BizPilot AI
 * Description: Provides Phase 4 public intake submission server actions.
 * Role: Connects public quote forms to server-side validation and scoped lead creation.
 * Related:
 * - lib/quote-attribution.ts
 * - server/errors/safe-error.ts
 * - server/services/public-intake.service.ts
 * - app/(public)/quote/[slug]/page.tsx
 * Author: MoOoH
 * Created: 2026-05-06
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Sanitized posted attribution server-side and preserved it across failed-submission retries.
 * - 2026-05-13: Mapped public intake failures to safe user-facing messages.
 * - 2026-05-06: Created public intake submission action.
 * ============================================================
 */

"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  getBizPilotCopy,
  isSafePublicIntakeMessage,
} from "@/lib/i18n/bizpilot-copy";
import {
  DEFAULT_LANGUAGE,
  readSupportedLanguage,
  type SupportedLanguage,
} from "@/lib/i18n/language";
import {
  buildQuoteAttributionFormQuery,
  buildQuoteRetryHref,
  type QuoteAttributionFormQuery,
} from "@/lib/quote-attribution";
import { getSafeUserErrorMessage } from "@/server/errors/safe-error";
import { safeLogger } from "@/server/logging/safe-logger";
import {
  hashClientIp,
  RATE_LIMIT_EXCEEDED_MESSAGE,
} from "@/server/services/abuse-protection.service";
import {
  SUBMISSION_TOO_FAST_MESSAGE,
  submitPublicIntake,
} from "@/server/services/public-intake.service";

async function readRequestIpHash(): Promise<string> {
  const requestHeaders = await headers();
  const forwarded = requestHeaders.get("x-forwarded-for");
  const firstForwarded = forwarded?.split(",")[0]?.trim();
  const directIp =
    firstForwarded && firstForwarded.length > 0
      ? firstForwarded
      : (requestHeaders.get("x-real-ip") ?? "");

  return hashClientIp(directIp);
}

function readRequiredFormValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Missing required field: ${key}`);
  }

  return value.trim();
}

function readOptionalFormValue(
  formData: FormData,
  key: string,
): string | undefined {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function quoteLanguageSuffix(language: SupportedLanguage): string {
  return language === DEFAULT_LANGUAGE
    ? ""
    : `?language=${encodeURIComponent(language)}`;
}

function getPublicIntakeErrorName(error: unknown): string {
  return error instanceof Error ? error.name : "unknown";
}

function getPublicIntakeErrorKind(error: unknown): string {
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  if (message.includes("rate")) {
    return "rate_limit";
  }

  if (message.includes("form changed")) {
    return "stale_form";
  }

  if (
    message.includes("required in production") ||
    message.includes("environment")
  ) {
    return "environment";
  }

  if (
    message.includes("required") ||
    message.includes("valid") ||
    message.includes("option") ||
    message.includes("past") ||
    message.includes("negative") ||
    message.includes("consent")
  ) {
    return "validation";
  }

  if (
    message.includes("row-level") ||
    message.includes("policy") ||
    message.includes("constraint") ||
    message.includes("violates")
  ) {
    return "storage_or_policy";
  }

  return "unknown";
}

function getPublicIntakeFallbackMessage(input: {
  errorKind: string;
  language: SupportedLanguage;
}): string {
  const copy = getBizPilotCopy(input.language).intakeErrors;

  if (
    input.errorKind === "environment" ||
    input.errorKind === "storage_or_policy"
  ) {
    return copy.temporarySubmitUnavailable;
  }

  return copy.fallbackSubmit;
}

function redirectWithIntakeError(
  input: {
    attribution: QuoteAttributionFormQuery;
    error: unknown;
    language: SupportedLanguage;
    slug: string;
  },
): never {
  const errorKind = getPublicIntakeErrorKind(input.error);

  safeLogger.warn("public_intake.submit_failed", {
    errorKind,
    errorName: getPublicIntakeErrorName(input.error),
  });

  const message = getSafeUserErrorMessage({
    allowMessage: (value) =>
      isSafePublicIntakeMessage(value) ||
      value === SUBMISSION_TOO_FAST_MESSAGE ||
      value === RATE_LIMIT_EXCEEDED_MESSAGE,
    code: "PUBLIC_INTAKE_ERROR",
    error: input.error,
    fallbackMessage: getPublicIntakeFallbackMessage({
      errorKind,
      language: input.language,
    }),
  });
  redirect(
    buildQuoteRetryHref({
      error: message,
      language: input.language,
      query: input.attribution,
      slug: input.slug,
    }),
  );
}

export async function submitPublicIntakeAction(
  formData: FormData,
): Promise<never> {
  const slug = readRequiredFormValue(formData, "businessSlug");
  const language = readSupportedLanguage(
    readOptionalFormValue(formData, "language"),
  );
  const attribution = buildQuoteAttributionFormQuery({
    query: {
      ref: readOptionalFormValue(formData, "referrer"),
      source: readOptionalFormValue(formData, "sourceChannel"),
      utm_campaign: readOptionalFormValue(formData, "utmCampaign"),
      utm_medium: readOptionalFormValue(formData, "utmMedium"),
      utm_source: readOptionalFormValue(formData, "utmSource"),
    },
    slug,
  });

  try {
    const fieldKeys = formData
      .getAll("fieldKeys")
      .filter((value): value is string => typeof value === "string");
    const fieldValues = Object.fromEntries(
      fieldKeys.map((fieldKey) => {
        const value = formData.get(`field:${fieldKey}`);

        return [fieldKey, typeof value === "string" ? value : ""];
      }),
    );

    const ipHash = await readRequestIpHash();

    await submitPublicIntake({
      consentAccepted: formData.get("consentAccepted") === "on",
      consentVersionId: readRequiredFormValue(formData, "consentVersionId"),
      fieldValues,
      formRenderedAt: readOptionalFormValue(formData, "formRenderedAt"),
      honeypot: readOptionalFormValue(formData, "companyWebsite"),
      intakeFormId: readRequiredFormValue(formData, "intakeFormId"),
      ipHash,
      language,
      slug,
      source: {
        referrer: attribution.ref,
        sourceChannel: attribution.source,
        sourceUrl: attribution.sourceUrl,
        utmCampaign: attribution.utm_campaign,
        utmMedium: attribution.utm_medium,
        utmSource: attribution.utm_source,
      },
    });
  } catch (error) {
    redirectWithIntakeError({ attribution, error, language, slug });
  }

  redirect(`/quote/${slug}/success${quoteLanguageSuffix(language)}`);
}
