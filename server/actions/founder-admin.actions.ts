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
import {
  dryRunFounderTestWorkspaceCleanup,
  purgeFounderTestWorkspace,
} from "@/server/services/founder-test-cleanup.service";

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
      value === "Invalid business status." ||
      value === "Hard cleanup is blocked for production workspaces." ||
      value === "Invalid cleanup mode." ||
      value === "Run dry-run before final cleanup." ||
      value === "Confirm that you understand this test cleanup." ||
      value === "Type the exact business name or slug to confirm cleanup.",
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

export async function founderCleanupDryRunAction(
  formData: FormData,
): Promise<never> {
  try {
    const dryRun = await dryRunFounderTestWorkspaceCleanup({
      businessId: readRequiredFormValue(formData, "businessId"),
      user: await getCurrentUser(),
    });
    const total = Object.values(dryRun.counts).reduce(
      (sum, value) => sum + value,
      0,
    );

    revalidatePath("/admin");
    redirect(
      `/admin?notice=${encodeURIComponent(
        `Dry run ready: ${total} rows across cleanup-scoped tables.`,
      )}&cleanupBusinessId=${encodeURIComponent(dryRun.businessId)}`,
    );
  } catch (error) {
    redirectWithFounderAdminError(error);
  }
}

export async function founderTestWorkspaceCleanupAction(
  formData: FormData,
): Promise<never> {
  try {
    const result = await purgeFounderTestWorkspace({
      acknowledged: formData.get("cleanupAcknowledgement") === "on",
      businessId: readRequiredFormValue(formData, "businessId"),
      cleanupMode: readRequiredFormValue(formData, "cleanupMode"),
      dryRunConfirmed:
        formData.get("dryRunConfirmedBusinessId") ===
        readRequiredFormValue(formData, "businessId"),
      finalConfirmed: formData.get("cleanupFinalConfirmation") === "on",
      typedConfirmation: readRequiredFormValue(formData, "cleanupConfirmation"),
      user: await getCurrentUser(),
    });
    const total = Object.values(result.counts).reduce(
      (sum, value) => sum + value,
      0,
    );

    revalidatePath("/admin");
    redirect(
      `/admin?notice=${encodeURIComponent(
        `Test workspace cleanup completed: ${total} rows purged. Auth users were not deleted.`,
      )}`,
    );
  } catch (error) {
    redirectWithFounderAdminError(error);
  }
}
