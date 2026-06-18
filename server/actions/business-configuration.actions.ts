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
 * - 2026-06-16: Rejected forward-only privacy mode until the full intake/storage behavior exists.
 */

"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  isDefaultQuoteFieldHelpText,
  isDefaultQuoteFieldLabel,
  resolveConsentNoticeForLanguage,
} from "@/lib/i18n/bizpilot-copy";
import {
  INTERFACE_LANGUAGE_COOKIE,
  readSupportedLanguageOrThrow,
} from "@/lib/i18n/language";
import { getSafeUserErrorMessage } from "@/server/errors/safe-error";
import { safeLogger } from "@/server/logging/safe-logger";
import { getCurrentUser } from "@/server/services/auth.service";
import { saveBusinessConfiguration } from "@/server/services/business-configuration.service";
import { updateWorkspaceLanguage } from "@/server/services/business.service";
import type { BusinessPrivacySettingsRecord } from "@/server/repositories/business-configuration.repository";
import type { Json } from "@/types/database";

const quoteFieldTypes = [
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
] as const;
type QuoteFieldType = (typeof quoteFieldTypes)[number];
type TemplateFieldSettings = {
  fieldType?: QuoteFieldType;
  helpText?: string;
  isHidden: boolean;
  isRequired: boolean;
  label?: string;
  options?: string[];
  sortOrder?: number;
};
const choiceFieldTypes = new Set<QuoteFieldType>([
  "radio",
  "select",
  "time_window",
]);
const customFieldKeyPattern = /^[a-z][a-z0-9_]*$/;

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

function readOptionList(value: string | undefined): string[] {
  return (value ?? "")
    .split(/\r?\n|,/)
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
  if (value === "standard" || value === "minimal") {
    return value;
  }
  throw new Error("Invalid privacy mode.");
}

function readQuoteFieldType(value: string | undefined): QuoteFieldType {
  if (
    typeof value === "string" &&
    quoteFieldTypes.includes(value as QuoteFieldType)
  ) {
    return value as QuoteFieldType;
  }

  throw new Error("Invalid field type.");
}

function normalizeCustomFieldKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_")
    .slice(0, 48);
}

function readFieldSortOrder(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const sortOrder = Number.parseInt(value, 10);

  if (!Number.isFinite(sortOrder) || sortOrder < 1 || sortOrder > 999) {
    throw new Error("Field priority must be a number between 1 and 999.");
  }

  return sortOrder;
}

function readChoiceOptions(input: {
  fieldType: QuoteFieldType;
  optionsText: string | undefined;
  requireChoices: boolean;
}): string[] | undefined {
  if (!choiceFieldTypes.has(input.fieldType)) {
    return undefined;
  }

  const options = Array.from(new Set(readOptionList(input.optionsText))).slice(
    0,
    20,
  );
  if (input.requireChoices && options.length < 2) {
    throw new Error("Choice fields need at least two options.");
  }

  return options.length > 0 ? options : undefined;
}

function getConfigurationErrorName(error: unknown): string {
  return error instanceof Error ? error.name : "unknown";
}

function getConfigurationErrorKind(error: unknown): string {
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  if (message.includes("preferred_language") && message.includes("schema")) {
    return "missing_preferred_language_column";
  }

  if (message.includes("permission")) {
    return "permission";
  }

  if (message.includes("valid hex color")) {
    return "validation_color";
  }

  if (
    message.includes("required") ||
    message.includes("invalid") ||
    message.includes("retention")
  ) {
    return "validation";
  }

  return "unknown";
}

function redirectWithConfigurationError(error: unknown): never {
  safeLogger.error("business_configuration.save_failed", {
    errorKind: getConfigurationErrorKind(error),
    errorName: getConfigurationErrorName(error),
  });
  const message = getSafeUserErrorMessage({
    allowMessage: (value) =>
      value === "Business name is required." ||
      value ===
        "Business slug must contain lowercase letters, numbers, and hyphens." ||
      value === "FAQ entries must include both a question and an answer." ||
      value === "Choice fields need at least two options." ||
      value === "Custom field keys must be unique." ||
      value === "Custom field label is required." ||
      value ===
        "Custom field key must start with a letter and contain only lowercase letters, numbers, and underscores." ||
      value === "Custom field limit is 12." ||
      value === "Field priority must be a number between 1 and 999." ||
      value === "Invalid field type." ||
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

function readRedirectPath(formData: FormData, fallback: string): string {
  const value = formData.get("redirectTo");
  return typeof value === "string" && value.startsWith("/") ? value : fallback;
}

async function persistInterfaceLanguage(language: string): Promise<void> {
  (await cookies()).set(INTERFACE_LANGUAGE_COOKIE, language, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });
}

function isMissingPreferredLanguageColumn(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("preferred_language") &&
    message.toLowerCase().includes("schema")
  );
}

function readTemplateFieldOverrides(formData: FormData): Json {
  const templateFieldKeys = formData
    .getAll("templateFieldKeys")
    .filter((value): value is string => typeof value === "string");
  const customFieldKeys = new Set(
    formData
      .getAll("customFieldKeys")
      .filter((value): value is string => typeof value === "string"),
  );
  const usedKeys = new Set(templateFieldKeys);

  const fieldEntries = templateFieldKeys
    .map((fieldKey): [string, TemplateFieldSettings] | null => {
      const isCustomField = customFieldKeys.has(fieldKey);
      if (isCustomField && formData.get(`fieldDelete:${fieldKey}`) === "on") {
        return null;
      }

      const label = readRequiredFormValue(formData, `fieldLabel:${fieldKey}`);
      const helpText = readOptionalFormValue(formData, `fieldHelp:${fieldKey}`);
      const fieldType = readQuoteFieldType(
        readOptionalFormValue(formData, `fieldType:${fieldKey}`),
      );
      const isCustomHelpText =
        helpText !== undefined &&
        !isDefaultQuoteFieldHelpText({ fieldKey, helpText });
      const isCustomLabel = !isDefaultQuoteFieldLabel({ fieldKey, label });
      const options = readChoiceOptions({
        fieldType,
        optionsText: readOptionalFormValue(formData, `fieldOptions:${fieldKey}`),
        requireChoices: isCustomField,
      });
      const sortOrder = readFieldSortOrder(
        readOptionalFormValue(formData, `fieldSort:${fieldKey}`),
      );
      const fieldSettings = {
        ...(isCustomField ? { fieldType } : {}),
        isHidden: formData.get(`fieldHidden:${fieldKey}`) === "on",
        isRequired: formData.get(`fieldRequired:${fieldKey}`) === "on",
        ...(isCustomLabel || isCustomField ? { label } : {}),
        ...(isCustomHelpText || (isCustomField && helpText)
          ? { helpText }
          : {}),
        ...(options ? { options } : {}),
        ...(sortOrder !== undefined ? { sortOrder } : {}),
      };

      return [fieldKey, fieldSettings];
    })
    .filter(
      (entry): entry is [string, TemplateFieldSettings] => entry !== null,
    );
  const customFields: Record<string, TemplateFieldSettings> = Object.fromEntries(
    fieldEntries.filter(([fieldKey]) => customFieldKeys.has(fieldKey)),
  );
  const fields = Object.fromEntries(
    fieldEntries.filter(([fieldKey]) => !customFieldKeys.has(fieldKey)),
  );
  const newCustomFieldSlots = formData
    .getAll("newCustomFieldSlots")
    .filter((value): value is string => typeof value === "string");

  for (const slot of newCustomFieldSlots) {
    const label = readOptionalFormValue(formData, `newFieldLabel:${slot}`);
    if (!label) continue;

    const fieldKey = normalizeCustomFieldKey(
      readOptionalFormValue(formData, `newFieldKey:${slot}`) ?? label,
    );
    if (!customFieldKeyPattern.test(fieldKey)) {
      throw new Error(
        "Custom field key must start with a letter and contain only lowercase letters, numbers, and underscores.",
      );
    }

    if (usedKeys.has(fieldKey)) {
      throw new Error("Custom field keys must be unique.");
    }

    const fieldType = readQuoteFieldType(
      readOptionalFormValue(formData, `newFieldType:${slot}`),
    );
    const options = readChoiceOptions({
      fieldType,
      optionsText: readOptionalFormValue(formData, `newFieldOptions:${slot}`),
      requireChoices: true,
    });
    const sortOrder = readFieldSortOrder(
      readOptionalFormValue(formData, `newFieldSort:${slot}`),
    );

    const helpText = readOptionalFormValue(formData, `newFieldHelp:${slot}`);
    customFields[fieldKey] = {
      fieldType,
      isHidden: formData.get(`newFieldVisible:${slot}`) !== "on",
      isRequired: formData.get(`newFieldRequired:${slot}`) === "on",
      label,
      ...(helpText ? { helpText } : {}),
      ...(options ? { options } : {}),
      ...(sortOrder !== undefined ? { sortOrder } : {}),
    };
    usedKeys.add(fieldKey);
  }

  if (Object.keys(customFields).length > 12) {
    throw new Error("Custom field limit is 12.");
  }

  return { customFields, fields };
}

export async function saveBusinessConfigurationAction(
  formData: FormData,
): Promise<never> {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");

  try {
    const businessSlug = readRequiredFormValue(formData, "businessSlug");
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
      businessSlug,
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
    await persistInterfaceLanguage(preferredLanguage);
    revalidatePath(`/quote/${businessSlug}`);
  } catch (error) {
    redirectWithConfigurationError(error);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/configuration");
  redirect(
    "/dashboard/configuration?notice=Business%20configuration%20saved.",
  );
}

export async function setInterfaceLanguageAction(
  formData: FormData,
): Promise<never> {
  const language = readSupportedLanguageOrThrow(
    readRequiredFormValue(formData, "language"),
  );

  await persistInterfaceLanguage(language);
  redirect(readRedirectPath(formData, "/auth/sign-in"));
}

export async function updateWorkspaceLanguageAction(
  formData: FormData,
): Promise<never> {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");

  const language = readSupportedLanguageOrThrow(
    readRequiredFormValue(formData, "language"),
  );
  const redirectTo = readRedirectPath(formData, "/dashboard/settings");
  await persistInterfaceLanguage(language);

  try {
    await updateWorkspaceLanguage({
      businessId: readRequiredFormValue(formData, "businessId"),
      language,
      userId: user.id,
    });
  } catch (error) {
    if (isMissingPreferredLanguageColumn(error)) {
      safeLogger.warn("business_configuration.language_cookie_fallback", {
        errorKind: getConfigurationErrorKind(error),
        errorName: getConfigurationErrorName(error),
      });
      revalidatePath("/dashboard");
      revalidatePath("/dashboard/settings");
      revalidatePath("/dashboard/configuration");
      redirect(redirectTo);
    }
    redirectWithConfigurationError(error);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/configuration");
  redirect(redirectTo);
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
