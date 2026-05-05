/**
 * ============================================================
 * File: server/actions/business-configuration.actions.ts
 * Project: BizPilot AI
 * Description: Provides Phase 3 business configuration server actions.
 * Role: Connects protected dashboard forms to tenant-safe configuration services.
 * Related:
 * - app/(dashboard)/dashboard/page.tsx
 * - server/services/business-configuration.service.ts
 * Author: MoOoH
 * Created: 2026-05-05
 * Last Updated: 2026-05-05
 * Change Log:
 * - 2026-05-05: Created Phase 3 business configuration save action.
 * - 2026-05-05: Added business profile fields to the configuration save action.
 * - 2026-05-05: Added Cleaning template label and required-field overrides.
 * - 2026-05-05: Persisted optional overrides for default-required template fields.
 * - 2026-05-05: Made FAQ parsing tolerant of common question/answer formats.
 * - 2026-05-05: Added explicit error handling for invalid FAQ textarea content.
 * - 2026-05-05: Switched template field customization to business_template_fields rows.
 * ============================================================
 */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/server/services/auth.service";
import { saveBusinessConfiguration } from "@/server/services/business-configuration.service";
import type {
  BusinessPrivacySettingsRecord,
  BusinessTemplateFieldOverrideInput,
} from "@/server/repositories/business-configuration.repository";

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

  return {
    answer: "",
    question: line.trim(),
  };
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
      faqs.push({
        answer: answerOnly[1].trim(),
        question: pendingQuestion,
      });
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
  const message =
    error instanceof Error ? error.message : "Business configuration failed.";
  redirect(`/dashboard?error=${encodeURIComponent(message)}`);
}

function readTemplateFieldOverrides(
  formData: FormData,
): BusinessTemplateFieldOverrideInput[] {
  return formData
    .getAll("templateFieldIds")
    .filter((value): value is string => typeof value === "string")
    .map((templateFieldId) => {
      const fieldKey = readRequiredFormValue(
        formData,
        `fieldKey:${templateFieldId}`,
      );
      const labelOverride = readRequiredFormValue(
        formData,
        `fieldLabel:${templateFieldId}`,
      );
      const helpTextOverride = readOptionalFormValue(
        formData,
        `fieldHelp:${templateFieldId}`,
      );
      const sortOrderValue = readOptionalFormValue(
        formData,
        `fieldSort:${templateFieldId}`,
      );
      const sortOrderOverride = sortOrderValue
        ? Number.parseInt(sortOrderValue, 10)
        : undefined;

      return {
        fieldKey,
        isHidden: formData.get(`fieldHidden:${templateFieldId}`) === "on",
        isRequiredOverride:
          formData.get(`fieldRequired:${templateFieldId}`) === "on",
        labelOverride,
        templateFieldId,
        ...(helpTextOverride ? { helpTextOverride } : {}),
        ...(sortOrderOverride !== undefined && Number.isFinite(sortOrderOverride)
          ? { sortOrderOverride }
          : {}),
      };
    });
}

export async function saveBusinessConfigurationAction(
  formData: FormData,
): Promise<never> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

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
      consentNotice: readRequiredFormValue(formData, "consentNotice"),
      faqs,
      fieldOverrides: {},
      primaryColor: readRequiredFormValue(formData, "primaryColor"),
      privacyMode: readPrivacyMode(
        readRequiredFormValue(formData, "privacyMode"),
      ),
      retainLeadsDays: Number.parseInt(
        readRequiredFormValue(formData, "retainLeadsDays"),
        10,
      ),
      serviceAreas: readList(readOptionalFormValue(formData, "serviceAreas")),
      services: readServices(readOptionalFormValue(formData, "services")),
      templateFieldOverrides: readTemplateFieldOverrides(formData),
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
  redirect("/dashboard?notice=Business%20configuration%20saved.");
}
