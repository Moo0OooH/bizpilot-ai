/**
 * ============================================================
 * File: server/actions/public-intake.actions.ts
 * Project: BizPilot AI
 * Description: Provides Phase 4 public intake submission server actions.
 * Role: Connects public quote forms to server-side validation and scoped lead creation.
 * Related:
 * - server/errors/safe-error.ts
 * - server/services/public-intake.service.ts
 * - app/(public)/quote/[slug]/page.tsx
 * Author: MoOoH
 * Created: 2026-05-06
 * Last Updated: 2026-05-13
 * Change Log:
 * - 2026-05-13: Mapped public intake failures to safe user-facing messages.
 * - 2026-05-06: Created public intake submission action.
 * ============================================================
 */

"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getSafeUserErrorMessage } from "@/server/errors/safe-error";
import {
  hashClientIp,
  RATE_LIMIT_EXCEEDED_MESSAGE,
} from "@/server/services/abuse-protection.service";
import { submitPublicIntake } from "@/server/services/public-intake.service";

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

function redirectWithIntakeError(slug: string, error: unknown): never {
  const message = getSafeUserErrorMessage({
    allowMessage: (value) =>
      value === "Consent is required before submitting." ||
      value === "Submission rejected." ||
      value === "The quote form changed. Please refresh and submit again." ||
      value === "This quote link is not available." ||
      value === RATE_LIMIT_EXCEEDED_MESSAGE ||
      value.endsWith(" is required.") ||
      value.endsWith(" must be a valid number.") ||
      value.endsWith(" cannot be negative.") ||
      value.endsWith(" must be a valid date.") ||
      value.endsWith(" cannot be in the past."),
    code: "PUBLIC_INTAKE_ERROR",
    error,
    fallbackMessage:
      "We couldn't submit the quote request. Please review the form and try again.",
  });

  redirect(`/quote/${slug}?error=${encodeURIComponent(message)}`);
}

export async function submitPublicIntakeAction(
  formData: FormData,
): Promise<never> {
  const slug = readRequiredFormValue(formData, "businessSlug");

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
      honeypot: readOptionalFormValue(formData, "companyWebsite"),
      intakeFormId: readRequiredFormValue(formData, "intakeFormId"),
      ipHash,
      slug,
      source: {
        referrer: readOptionalFormValue(formData, "referrer"),
        sourceChannel: readOptionalFormValue(formData, "sourceChannel"),
        sourceUrl: readOptionalFormValue(formData, "sourceUrl"),
        utmCampaign: readOptionalFormValue(formData, "utmCampaign"),
        utmMedium: readOptionalFormValue(formData, "utmMedium"),
        utmSource: readOptionalFormValue(formData, "utmSource"),
      },
    });
  } catch (error) {
    redirectWithIntakeError(slug, error);
  }

  redirect(`/quote/${slug}/success`);
}
