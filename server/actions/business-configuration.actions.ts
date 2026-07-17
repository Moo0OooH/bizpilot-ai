/**
 * ============================================================
 * File: server/actions/business-configuration.actions.ts
 * Project: BizPilot AI
 * Description: Server actions for saving owner-facing business and quote-setup configuration.
 * Role: Reads protected dashboard form payloads, normalizes quote-field overrides, and redirects with safe save outcomes.
 * Related:
 * - app/(dashboard)/dashboard/configuration/page.tsx
 * - server/errors/safe-error.ts
 * - server/services/business-configuration.service.ts
 * Author: MoOoH
 * Created: 2026-05-05
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Passed an explicit review scope so each surface confirms its own tasks and returns success or errors to its safe owning route.
 * - 2026-07-16: Added save-and-preview intent so owner previews synchronize and repair the public quote page before navigation.
 * - 2026-07-13: Removed the obsolete public locale Server Action after public switching moved to deterministic locale URLs.
 * - 2026-07-11: Added per-language custom quote-field translation payloads for bilingual workspace saves.
 * - 2026-06-16: Rejected forward-only privacy mode until the full intake/storage behavior exists.
 * - 2026-05-16: Restored truncated file tail; kept [CONFIG_SAVE_ERROR] dev log.
 * - 2026-05-13: Mapped configuration action failures to safe user-facing messages.
 * - 2026-05-05: Created Phase 3 business configuration save action.
 * ============================================================
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
  type SupportedLanguage,
} from "@/lib/i18n/language";
import {
  MAX_QUOTE_FORM_COPY_LENGTH,
  MAX_QUOTE_FORM_HEADER_TITLE_LENGTH,
  MAX_QUOTE_FORM_NAV_LABEL_LENGTH,
  MAX_QUOTE_FORM_SECTIONS,
  MAX_QUOTE_FORM_SECTION_TITLE_LENGTH,
  QUOTE_FORM_LAYOUT_VERSION,
  isQuoteFormSectionKey,
  serializeQuoteFormLayout,
  type QuoteFormDisplayMode,
  type QuoteFormLayout,
  type QuoteFormSection,
} from "@/lib/quote-form-layout";
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
  sectionKey?: string;
  sortOrder?: number;
  translations?: Partial<
    Record<
      SupportedLanguage,
      {
        helpText?: string;
        label?: string;
      }
    >
  >;
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

function readConfigurationReviewScope(
  formData: FormData,
): "business_profile" | "quote_setup" {
  return formData.get("reviewScope") === "business_profile"
    ? "business_profile"
    : "quote_setup";
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

function readBoundedConfigurationText(input: {
  label: string;
  maximum: number;
  required?: boolean;
  value: string | undefined;
}): string | undefined {
  const value = input.value?.trim();

  if (!value) {
    if (input.required) {
      throw new Error(`${input.label} is required.`);
    }
    return undefined;
  }

  if (value.length > input.maximum) {
    throw new Error(`${input.label} is too long.`);
  }

  return value;
}

function readQuoteFormDisplayMode(
  value: string | undefined,
): QuoteFormDisplayMode {
  if (value === "list" || value === "tabs" || value === "steps") {
    return value;
  }

  throw new Error("Invalid quote form display mode.");
}

function readQuoteFormLayout(
  formData: FormData,
  language: SupportedLanguage,
): QuoteFormLayout | undefined {
  const rawDisplayMode = readOptionalFormValue(formData, "formDisplayMode");
  const sectionKeys = formData
    .getAll("formSectionKeys")
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);

  if (!rawDisplayMode && sectionKeys.length === 0) {
    return undefined;
  }

  if (sectionKeys.length < 1 || sectionKeys.length > MAX_QUOTE_FORM_SECTIONS) {
    throw new Error(
      `Quote forms need between 1 and ${MAX_QUOTE_FORM_SECTIONS} sections.`,
    );
  }

  const uniqueKeys = new Set(sectionKeys);
  if (
    uniqueKeys.size !== sectionKeys.length ||
    sectionKeys.some((key) => !isQuoteFormSectionKey(key))
  ) {
    throw new Error("Quote form section keys must be unique and valid.");
  }

  const title = readBoundedConfigurationText({
    label: "Quote form title",
    maximum: MAX_QUOTE_FORM_HEADER_TITLE_LENGTH,
    required: true,
    value: readOptionalFormValue(formData, "formTitle"),
  });
  const subtitle = readBoundedConfigurationText({
    label: "Quote form subtitle",
    maximum: MAX_QUOTE_FORM_COPY_LENGTH,
    value: readOptionalFormValue(formData, "formSubtitle"),
  });
  const sections: QuoteFormSection[] = sectionKeys.map((key, index) => {
    const navLabel = readBoundedConfigurationText({
      label: "Section navigation label",
      maximum: MAX_QUOTE_FORM_NAV_LABEL_LENGTH,
      required: true,
      value: readOptionalFormValue(formData, `sectionLabel:${key}`),
    });
    const sectionTitle = readBoundedConfigurationText({
      label: "Section title",
      maximum: MAX_QUOTE_FORM_SECTION_TITLE_LENGTH,
      required: true,
      value: readOptionalFormValue(formData, `sectionTitle:${key}`),
    });
    const description = readBoundedConfigurationText({
      label: "Section description",
      maximum: MAX_QUOTE_FORM_COPY_LENGTH,
      value: readOptionalFormValue(formData, `sectionDescription:${key}`),
    });
    const sortOrder =
      readFieldSortOrder(
        readOptionalFormValue(formData, `sectionSort:${key}`),
      ) ??
      (index + 1) * 10;

    return {
      ...(description ? { description } : {}),
      isHidden: formData.get(`sectionVisible:${key}`) !== "on",
      key,
      navLabel: navLabel!,
      sortOrder,
      title: sectionTitle!,
      translations: {
        [language]: {
          ...(description ? { description } : {}),
          navLabel: navLabel!,
          title: sectionTitle!,
        },
      },
    };
  });

  if (sections.every((section) => section.isHidden)) {
    throw new Error("At least one quote form section must be visible.");
  }

  return {
    displayMode: readQuoteFormDisplayMode(rawDisplayMode),
    header: {
      ...(subtitle ? { subtitle } : {}),
      title: title!,
      translations: {
        [language]: {
          ...(subtitle ? { subtitle } : {}),
          title: title!,
        },
      },
    },
    sections,
    version: QUOTE_FORM_LAYOUT_VERSION,
  };
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

function redirectWithConfigurationError(
  error: unknown,
  reviewScope: "business_profile" | "quote_setup",
): never {
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
      value === "Invalid quote form display mode." ||
      value === "Invalid quote form section assignment." ||
      value === "At least one quote form section must be visible." ||
      value === "Quote form fields must use an existing section." ||
      value === "Quote form section keys must be unique and valid." ||
      value ===
        `Quote forms need between 1 and ${MAX_QUOTE_FORM_SECTIONS} sections.` ||
      value.endsWith(" is too long.") ||
      value === "Lead retention must be between 1 and 3650 days." ||
      value ===
        "Logo must be a secure HTTPS URL or a PNG, JPG, or WebP upload under 2 MB." ||
      value === "You do not have permission to manage this business." ||
      value.endsWith(" must be a valid hex color."),
    code: "CONFIGURATION_ERROR",
    error,
    fallbackMessage:
      "We couldn't save the business configuration. Please review the form and try again.",
  });
  const returnPath =
    reviewScope === "business_profile"
      ? "/dashboard/business-profile"
      : "/dashboard/configuration";
  redirect(`${returnPath}?error=${encodeURIComponent(message)}`);
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

function buildFieldTranslations(input: {
  helpText: string | undefined;
  label: string | undefined;
  language: SupportedLanguage;
}): TemplateFieldSettings["translations"] | undefined {
  if (!input.helpText && !input.label) {
    return undefined;
  }

  return {
    [input.language]: {
      ...(input.helpText ? { helpText: input.helpText } : {}),
      ...(input.label ? { label: input.label } : {}),
    },
  };
}

function readFieldSectionAssignment(input: {
  formLayout: QuoteFormLayout | undefined;
  value: string | undefined;
}): string | undefined {
  if (!input.value) return undefined;

  if (!isQuoteFormSectionKey(input.value)) {
    throw new Error("Invalid quote form section assignment.");
  }

  if (
    input.formLayout &&
    !input.formLayout.sections.some((section) => section.key === input.value)
  ) {
    throw new Error("Quote form fields must use an existing section.");
  }

  return input.value;
}

function readTemplateFieldOverrides(
  formData: FormData,
  language: SupportedLanguage,
): Json {
  const formLayout = readQuoteFormLayout(formData, language);
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
      const sectionKey = readFieldSectionAssignment({
        formLayout,
        value: readOptionalFormValue(formData, `fieldSection:${fieldKey}`),
      });
      const customLabel = isCustomLabel || isCustomField ? label : undefined;
      const customHelpText =
        isCustomHelpText || (isCustomField && helpText) ? helpText : undefined;
      const translations = buildFieldTranslations({
        helpText: customHelpText,
        label: customLabel,
        language,
      });
      const fieldSettings = {
        ...(isCustomField ? { fieldType } : {}),
        isHidden: formData.get(`fieldHidden:${fieldKey}`) === "on",
        isRequired: formData.get(`fieldRequired:${fieldKey}`) === "on",
        ...(customLabel ? { label: customLabel } : {}),
        ...(customHelpText ? { helpText: customHelpText } : {}),
        ...(options ? { options } : {}),
        ...(sectionKey ? { sectionKey } : {}),
        ...(sortOrder !== undefined ? { sortOrder } : {}),
        ...(translations ? { translations } : {}),
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
    const sectionKey = readFieldSectionAssignment({
      formLayout,
      value: readOptionalFormValue(formData, `newFieldSection:${slot}`),
    });

    const helpText = readOptionalFormValue(formData, `newFieldHelp:${slot}`);
    const translations = buildFieldTranslations({
      helpText,
      label,
      language,
    });
    customFields[fieldKey] = {
      fieldType,
      isHidden: formData.get(`newFieldVisible:${slot}`) !== "on",
      isRequired: formData.get(`newFieldRequired:${slot}`) === "on",
      label,
      ...(helpText ? { helpText } : {}),
      ...(options ? { options } : {}),
      ...(sectionKey ? { sectionKey } : {}),
      ...(sortOrder !== undefined ? { sortOrder } : {}),
      ...(translations ? { translations } : {}),
    };
    usedKeys.add(fieldKey);
  }

  if (Object.keys(customFields).length > 12) {
    throw new Error("Custom field limit is 12.");
  }

  return {
    customFields,
    fields,
    ...(formLayout
      ? { formLayout: serializeQuoteFormLayout(formLayout) }
      : {}),
  };
}

export async function saveBusinessConfigurationAction(
  formData: FormData,
): Promise<never> {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");

  const shouldPreview = formData.get("submitIntent") === "preview";
  const reviewScope = readConfigurationReviewScope(formData);
  const returnPath =
    reviewScope === "business_profile"
      ? "/dashboard/business-profile"
      : "/dashboard/configuration";
  let savedBusinessSlug = "";
  let savedLanguage: SupportedLanguage = "en";

  try {
    const businessSlug = readRequiredFormValue(formData, "businessSlug");
    savedBusinessSlug = businessSlug;
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
    savedLanguage = preferredLanguage;
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
      ...(reviewScope === "quote_setup"
        ? {
            fieldOverrides: readTemplateFieldOverrides(formData, preferredLanguage),
          }
        : {}),
      primaryColor: readRequiredFormValue(formData, "primaryColor"),
      privacyMode: readPrivacyMode(
        readRequiredFormValue(formData, "privacyMode"),
      ),
      preferredLanguage,
      retainLeadsDays: Number.parseInt(
        readRequiredFormValue(formData, "retainLeadsDays"),
        10,
      ),
      reviewScope,
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
    redirectWithConfigurationError(error, reviewScope);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/business-profile");
  revalidatePath("/dashboard/configuration");

  if (shouldPreview) {
    const languageQuery =
      savedLanguage === "en"
        ? "?preview=dashboard"
        : `?preview=dashboard&language=${encodeURIComponent(savedLanguage)}`;
    redirect(`/quote/${savedBusinessSlug}${languageQuery}`);
  }

  redirect(`${returnPath}?notice=Business%20configuration%20saved.`);
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
    redirectWithConfigurationError(error, "quote_setup");
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
