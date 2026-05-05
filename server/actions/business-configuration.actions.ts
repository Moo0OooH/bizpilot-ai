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
 * ============================================================
 */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

function readFaqs(value: string | undefined) {
  return readList(value)
    .map((line) => {
      const parts = line.split("|").map((item) => item.trim());
      const question = parts[0] ?? "";
      const answer = parts[1] ?? "";

      return {
        answer,
        question,
      };
    })
    .filter((faq) => faq.question.length > 0 && faq.answer.length > 0);
}

function readFieldOverrides(formData: FormData): Json {
  const disabledFields = formData
    .getAll("disabledFields")
    .filter((value): value is string => typeof value === "string");
  const requiredFields = formData
    .getAll("requiredFields")
    .filter((value): value is string => typeof value === "string");
  const defaultRequiredFields = formData
    .getAll("defaultRequiredFields")
    .filter((value): value is string => typeof value === "string");
  const optionalFields = defaultRequiredFields.filter(
    (field) => !requiredFields.includes(field),
  );
  const labels: Record<string, string> = {};

  for (const [key, value] of formData.entries()) {
    if (
      key.startsWith("fieldLabel:") &&
      typeof value === "string" &&
      value.trim().length > 0
    ) {
      labels[key.replace("fieldLabel:", "")] = value.trim();
    }
  }

  return {
    disabledFields,
    labels,
    optionalFields,
    requiredFields,
  };
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

    await saveBusinessConfiguration({
      accentColor: readRequiredFormValue(formData, "accentColor"),
      aiDisclosureEnabled: formData.get("aiDisclosureEnabled") === "on",
      businessId: readRequiredFormValue(formData, "businessId"),
      businessName: readRequiredFormValue(formData, "businessName"),
      businessSlug: readRequiredFormValue(formData, "businessSlug"),
      consentNotice: readRequiredFormValue(formData, "consentNotice"),
      faqs: readFaqs(readOptionalFormValue(formData, "faqs")),
      fieldOverrides: readFieldOverrides(formData),
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
