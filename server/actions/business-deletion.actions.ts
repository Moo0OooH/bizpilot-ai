/**
 * ============================================================
 * File: server/actions/business-deletion.actions.ts
 * Project: BizPilot AI
 * Description: Owner-only workspace deletion request server action.
 * Role: Connects the settings danger zone to safe workspace lock behavior.
 * Related:
 * - app/(dashboard)/dashboard/settings/page.tsx
 * - server/services/business-deletion.service.ts
 * Author: MoOoH
 * Created: 2026-05-24
 * Last Updated: 2026-05-24
 * ============================================================
 */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSafeUserErrorMessage } from "@/server/errors/safe-error";
import { getCurrentUser } from "@/server/services/auth.service";
import { requestBusinessDeletion } from "@/server/services/business-deletion.service";

function readRequiredFormValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Missing required field: ${key}`);
  }

  return value.trim();
}

function redirectWithDeletionRequestError(error: unknown): never {
  const message = getSafeUserErrorMessage({
    allowMessage: (value) =>
      value === "Confirm that you understand what this request does." ||
      value === "Type the exact business name to confirm." ||
      value === "Only the active business owner can request workspace deletion." ||
      value === "This workspace is not active for deletion request." ||
      value === "Sign in to request workspace deletion.",
    code: "UNKNOWN_ERROR",
    error,
    fallbackMessage: "Workspace deletion request could not be submitted.",
  });

  redirect(`/dashboard/settings?error=${encodeURIComponent(message)}`);
}

export async function requestBusinessDeletionAction(
  formData: FormData,
): Promise<never> {
  try {
    await requestBusinessDeletion({
      acknowledged: formData.get("deletionAcknowledgement") === "on",
      businessId: readRequiredFormValue(formData, "businessId"),
      typedBusinessName: readRequiredFormValue(formData, "businessNameConfirmation"),
      user: await getCurrentUser(),
    });
  } catch (error) {
    redirectWithDeletionRequestError(error);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  redirect(
    "/dashboard/settings?notice=Workspace%20deletion%20requested.%20The%20workspace%20is%20now%20locked.",
  );
}
