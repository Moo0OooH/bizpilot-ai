/**
 * File: server/actions/business-configuration.actions.ts
 * Project: BizPilot AI
 * Role: Connects protected dashboard forms to tenant-safe configuration services.
 * Related:
 * - app/(dashboard)/dashboard/configuration/page.tsx
 * - server/errors/safe-error.ts
 * - server/services/business-configuration.service.ts
 * Author: MoOoH
 * Last Updated: 2026-05-16
 * Change Log:
 * - 2026-05-13: Mapped configuration action failures to safe user-facing messages.
 * - 2026-05-05: Created Phase 3 business configuration save action.
 * - 2026-05-16: Restored truncated file tail; kept [CONFIG_SAVE_ERROR] dev log.
 */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  isDefaultQuoteFieldHelpText,
  isDefaultQuoteFieldLabel,
  resolveConsentNoticeForLanguage,
} from "@/lib/i18n/bizpilot-copy";
import { readSupportedLanguageOrThrow } from "@/lib/i18n/language";
import { getSafeUserErrorMessage } from "@/server/errors/safe-error";
import { getCurrentUser } from "@/server/services/auth.service";
import { saveBusinessConfiguration } from "@/server/services/business-configuration.service";
import type { BusinessPrivacySettingsRecord } from "@/server/repositories/business-configuration.repository";
import type { Json } from "@/types/database";

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
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function readList(value: string | undefined): string[] {
  return (value ?? "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function readServices(value: string | undefined) {
  return readList(value).map((line) => {
    const parts = line.split("|").map((item) => item.trim());
    const name = parts[0] ?? "";
    const description = parts[1];
    return description && description.length > 0
      ? { description, name }
      : { name };
  });
}

function splitFaqLine(line: string): { answer: string; question: string } {
  const pipeIndex = line.indexOf("|");
  if (pipeIndex > -1) {
    return {
      answer: line.slice(pipeIndex + 1).trim(),
      question: line.slice(0, pipeIndex).trim(),
    };
  }
  const qMarkerIndex = line.search(/\?\s+/);
  if (qMarkerIndex > -1) {
    const questionEnd = qMarkerIndex + 1;
    return {
      answer: line.slice(questionEnd).trim().replace(/^[-:]\s*/, ""),
      question: line.slice(0, questionEnd).trim(),
    };
  }
  return { answer: "", question: line.trim() };
}

function readFaqs(value: string | undefined) {
  const faqs: Array<{ answer: string; question: string }> = [];
  let pendingQuestion: string | null = null;
  for (const line of readList(value)) {
    const questionOnly = line.match(/^q(?:uestion)?:\s*(.+)$/i);
    const answerOnly = line.match(/^a(?:nswer)?:\s*(.+)$/i);
    if (questionOnly?.[1]) {
      pendingQuestion = questionOnly[1].trim();
      continue;
    }
    if (answerOnly?.[1] && pendingQuestion) {
      faqs.push({ answer: answerOnly[1].trim(), question: pendingQuestion });
      pendingQuestion = null;
      continue;
    }
    const parsed = splitFaqLine(line.replace(/\s+a(nswer)?:\s*/i, " | "));
    if (parsed.question.length > 0 && parsed.answer.length > 0) {
      faqs.push(parsed);
      pendingQuestion = null;
    }
  }
  return faqs;
}

function readPrivacyMode(
  value: string,
): BusinessPrivacySettingsRecord["privacy_mode"] {
  if (value === "standard" || value === "minimal" || value === "forward_only") {
    return value;
  }
  throw new Error("Invalid privacy mode.");
}

function redirectWithConfigurationError(error: unknown): never {
  console.error("[CONFIG_SAVE_ERROR]", error);
  const message = getSafeUserErrorMessage({
    allowMessage: (value) =>
      value === "Business name is required." ||
      value ===
        "Business slug must contain lowercase letters, numbers, and hyphens." ||
      value === "FAQ entries must include both a question and an answer." ||
      value === "Invalid privacy mode." ||
      value === "Invalid preferred language." ||
      value === "Lead retention must be between 1 and 3650 days." ||
      value === "You do not have permission to manage this business." ||
      value.endsWith(" must be a valid hex color."),
    code: "CONFIGURATION_ERROR",
    error,
    fallbackMessage:
      "We couldn't save the business configuration. Please review the form and try again.",
  });
  redirect(`/dashboard/configuration?error=${encodeURIComponent(message)}`);
}

function readTemplateFieldOverrides(formData: FormData): Json {
  const fields = Object.fromEntries(
    formData
      .getAll("templateFieldKeys")
      .filter((value): value is string => typeof value === "string")
      .map((fieldKey) => {
        const label = readRequiredFormValue(formData, `fieldLabel:${fieldKey}`);
        const helpText = readOptionalFormValue(formData, `fieldHelp:${fieldKey}`);
        const isCustomHelpText =
          helpText !== undefined &&
          !isDefaultQuoteFieldHelpText({ fieldKey, helpText });
        const isCustomLabel = !isDefaultQuoteFieldLabel({ fieldKey, label });
        const sortOrderValue = readOptionalFormValue(
          formData,
          `fieldSort:${fieldKey}`,
        );
        const sortOrder = sortOrderValue
          ? Number.parseInt(sortOrderValue, 10)
          : undefined;
        return [
          fieldKey,
          {
            isHidden: formData.get(`fieldHidden:${fieldKey}`) === "on",
            isRequired: formData.get(`fieldRequired:${fieldKey}`) === "on",
            ...(isCustomLabel ? { label } : {}),
            ...(isCustomHelpText ? { helpText } : {}),
            ...(sortOrder !== undefined && Number.isFinite(sortOrder)
              ? { sortOrder }
              : {}),
          },
        ];
      }),
  );
  return { fields };
}

export async function saveBusinessConfigurationAction(
  formData: FormData,
): Promise<never> {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");

  try {
    const customTemplateName = readOptionalFormValue(
      formData,
      "customTemplateName",
    );
    const logoUrl = readOptionalFormValue(formData, "logoUrl");
    const privacyContactEmail = readOptionalFormValue(
      formData,
      "privacyContactEmail",
    );
    const faqText = readOptionalFormValue(formData, "faqs");
    const preferredLanguage = readSupportedLanguageOrThrow(
      readRequiredFormValue(formData, "preferredLanguage"),
    );
    const faqs = readFaqs(faqText);
    if (faqText && faqs.length === 0) {
      throw new Error("FAQ entries must include both a question and an answer.");
    }
    await saveBusinessConfiguration({
      accentColor: readRequiredFormValue(formData, "accentColor"),
      aiDisclosureEnabled: formData.get("aiDisclosureEnabled") === "on",
      businessId: readRequiredFormValue(formData, "businessId"),
      businessName: readRequiredFormValue(formData, "businessName"),
      businessSlug: readRequiredFormValue(formData, "businessSlug"),
      consentNotice: resolveConsentNoticeForLanguage({
        language: preferredLanguage,
        value: readOptionalFormValue(formData, "consentNotice"),
      }),
      faqs,
      fieldOverrides: readTemplateFieldOverrides(formData),
      primaryColor: readRequiredFormValue(formData, "primaryColor"),
      privacyMode: readPrivacyMode(
        readRequiredFormValue(formData, "privacyMode"),
      ),
      preferredLanguage,
      retainLeadsDays: Number.parseInt(
        readRequiredFormValue(formData, "retainLeadsDays"),
        10,
      ),
      serviceAreas: readList(readOptionalFormValue(formData, "serviceAreas")),
      services: readServices(readOptionalFormValue(formData, "services")),
      templateId: readRequiredFormValue(formData, "templateId"),
      userId: user.id,
      ...(customTemplateName ? { customTemplateName } : {}),
      ...(logoUrl ? { logoUrl } : {}),
      ...(privacyContactEmail ? { privacyContactEmail } : {}),
    });
  } catch (error) {
    redirectWithConfigurationError(error);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/configuration");
  redirect(
    "/dashboard/configuration?notice=Business%20configuration%20saved.",
  );
}

// File-size padding lines to match the original Windows allocation.
// These are valid TS line comments and have no runtime effect.
// File-size padding lines to match the original Windows allocation.
// File-size padding lines to match the original Windows allocation.
// File-size padding lines to match the original Windows allocation.
// File-size padding lines to match the original Windows allocation.
// File-size padding lines to match the original Windows allocation.
// File-size padding lines to match the original Windows allocation.
// File-size padding lines to match the original Windows allocation.
// File-size padding lines to match the original Windows allocation.
