/**
 * ============================================================
 * File: server/actions/founder-admin.actions.ts
 * Project: BizPilot AI
 * Description: Founder-only admin server actions for manual pilot controls.
 * Role: Connects /admin forms to service-role operations after founder auth.
 * Related:
 * - app/admin/page.tsx
 * - server/services/founder-admin.service.ts
 * Author: MoOoH
 * Created: 2026-05-22
 * Last Updated: 2026-05-22
 * ============================================================
 */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSafeUserErrorMessage } from "@/server/errors/safe-error";
import { getCurrentUser } from "@/server/services/auth.service";
import {
  readFounderBusinessStatus,
  readFounderPlanSlug,
  updateFounderInternalNote,
  updateFounderPlan,
  updateFounderQuoteLink,
  updateFounderStatus,
} from "@/server/services/founder-admin.service";

function readRequiredFormValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Missing required field: ${key}`);
  }

  return value.trim();
}

function readOptionalFormValue(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function redirectWithFounderAdminError(error: unknown): never {
  const message = getSafeUserErrorMessage({
    allowMessage: (value) =>
      value === "Founder admin requires sign-in." ||
      value === "Founder admin is not configured." ||
      value === "Founder admin access required." ||
      value === "Invalid plan." ||
      value === "Invalid business status.",
    code: "UNKNOWN_ERROR",
    error,
    fallbackMessage: "Founder admin action could not be completed.",
  });

  redirect(`/admin?error=${encodeURIComponent(message)}`);
}

export async function updateFounderPlanAction(formData: FormData): Promise<never> {
  try {
    const user = await getCurrentUser();
    const note = readOptionalFormValue(formData, "note");

    await updateFounderPlan({
      businessId: readRequiredFormValue(formData, "businessId"),
      planSlug: readFounderPlanSlug(readRequiredFormValue(formData, "planSlug")),
      user,
      ...(note ? { note } : {}),
    });
  } catch (error) {
    redirectWithFounderAdminError(error);
  }

  revalidatePath("/admin");
  redirect("/admin?notice=Plan%20updated.");
}

export async function updateFounderStatusAction(formData: FormData): Promise<never> {
  try {
    const user = await getCurrentUser();
    const note = readOptionalFormValue(formData, "note");

    await updateFounderStatus({
      businessId: readRequiredFormValue(formData, "businessId"),
      status: readFounderBusinessStatus(
        readRequiredFormValue(formData, "businessStatus"),
      ),
      user,
      ...(note ? { note } : {}),
    });
  } catch (error) {
    redirectWithFounderAdminError(error);
  }

  revalidatePath("/admin");
  redirect("/admin?notice=Status%20updated.");
}

export async function updateFounderQuoteLinkAction(
  formData: FormData,
): Promise<never> {
  try {
    const user = await getCurrentUser();
    const note = readOptionalFormValue(formData, "note");

    await updateFounderQuoteLink({
      active: readRequiredFormValue(formData, "quoteLinkActive") === "true",
      businessId: readRequiredFormValue(formData, "businessId"),
      user,
      ...(note ? { note } : {}),
    });
  } catch (error) {
    redirectWithFounderAdminError(error);
  }

  revalidatePath("/admin");
  redirect("/admin?notice=Quote%20link%20updated.");
}

export async function updateFounderInternalNoteAction(
  formData: FormData,
): Promise<never> {
  try {
    const user = await getCurrentUser();

    await updateFounderInternalNote({
      businessId: readRequiredFormValue(formData, "businessId"),
      note: readRequiredFormValue(formData, "internalNote"),
      user,
    });
  } catch (error) {
    redirectWithFounderAdminError(error);
  }

  revalidatePath("/admin");
  redirect("/admin?notice=Internal%20note%20saved.");
}
