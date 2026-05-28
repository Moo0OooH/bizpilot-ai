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
  readFounderSessionTimeoutMinutes,
  readFounderSessionTimeoutMode,
  readFounderTemporaryPassword,
  readFounderWorkspaceKind,
  repairFounderUserWorkspace,
  requestFounderUserPasswordReset,
  setFounderUserTemporaryPassword,
  updateFounderInternalNote,
  updateFounderPlan,
  updateFounderQuoteLink,
  updateFounderSessionPolicy,
  updateFounderStatus,
  updateFounderWorkspaceKind,
  updateFounderInboxLeadStatus,
  deleteFounderInboxLead,
} from "@/server/services/founder-admin.service";
import {
  dryRunFounderTestWorkspaceCleanup,
  purgeFounderTestWorkspace,
} from "@/server/services/founder-test-cleanup.service";
import { deleteFounderTestAuthUser } from "@/server/services/founder-auth-user-cleanup.service";

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
      value === "Invalid workspace kind." ||
      value === "Hard cleanup is blocked for production workspaces." ||
      value === "Invalid cleanup mode." ||
      value === "Run dry-run before final cleanup." ||
      value === "Confirm that you understand this test cleanup." ||
      value === "Type the exact business name or slug to confirm cleanup." ||
      value === "Invalid auth user cleanup mode." ||
      value === "Confirm that you understand this auth user deletion." ||
      value === "Type the exact auth user email or ID to confirm deletion." ||
      value === "Founder admin cannot delete the signed-in founder account." ||
      value === "Founder admin cannot delete a founder allowlist account." ||
      value === "Delete or transfer owned workspaces before deleting this auth user." ||
      value === "Auth user deletion is blocked for production workspaces." ||
      value ===
        "Auth user deletion is blocked until linked workspaces are marked as test, demo, or seed." ||
      value === "Auth user not found." ||
      value === "Target user does not have an email address." ||
      value === "Enter a business name for workspace repair." ||
      value === "Use 80 characters or fewer for the business name." ||
      value === "Confirm the user's email before workspace repair." ||
      value === "Target user already has a workspace or membership." ||
      value === "Confirm that this auth user should receive a recovered owner workspace." ||
      value === "Use at least 12 characters for the temporary password." ||
      value === "Choose a valid sign-out policy." ||
      value === "Choose a valid sign-out duration." ||
      value === "Confirm that you will share this temporary password securely." ||
      value === "Founder admin cannot change the signed-in account password here." ||
      value === "Founder admin cannot change a founder allowlist account password here." ||
      value === "Confirm that this deletion cannot be undone." ||
      value === "Type the exact lead ID to confirm deletion.",
    code: "UNKNOWN_ERROR",
    error,
    fallbackMessage: "Founder admin action could not be completed.",
  });

  redirect(`/admin?error=${encodeURIComponent(message)}`);
}

export async function founderWorkspaceRepairAction(
  formData: FormData,
): Promise<never> {
  let traceId: string;
  try {
    if (formData.get("workspaceRepairAcknowledgement") !== "on") {
      throw new Error(
        "Confirm that this auth user should receive a recovered owner workspace.",
      );
    }

    traceId = await repairFounderUserWorkspace({
      businessName: readRequiredFormValue(formData, "businessName"),
      targetUserId: readRequiredFormValue(formData, "targetUserId"),
      user: await getCurrentUser(),
    });
  } catch (error) {
    redirectWithFounderAdminError(error);
  }

  revalidatePath("/admin");
  redirect(
    `/admin?notice=${encodeURIComponent(
      `Workspace recovered for unlinked auth user. Trace ${traceId}.`,
    )}`,
  );
}

export async function founderInboxLeadStatusAction(
  formData: FormData,
): Promise<never> {
  try {
    const status = readRequiredFormValue(formData, "status");
    if (status !== "reviewed" && status !== "archived") {
      throw new Error("Founder admin action could not be completed.");
    }

    await updateFounderInboxLeadStatus({
      leadId: readRequiredFormValue(formData, "leadId"),
      status,
      user: await getCurrentUser(),
    });
  } catch (error) {
    redirectWithFounderAdminError(error);
  }

  revalidatePath("/admin");
  redirect("/admin?notice=Inbox%20item%20updated.");
}

export async function founderInboxLeadDeleteAction(
  formData: FormData,
): Promise<never> {
  try {
    await deleteFounderInboxLead({
      acknowledged: formData.get("deleteAcknowledgement") === "on",
      leadId: readRequiredFormValue(formData, "leadId"),
      typedConfirmation: readRequiredFormValue(formData, "leadConfirmation"),
      user: await getCurrentUser(),
    });
  } catch (error) {
    redirectWithFounderAdminError(error);
  }

  revalidatePath("/admin");
  redirect("/admin?notice=Inbox%20item%20deleted%20permanently.");
}

export async function founderPasswordResetAction(
  formData: FormData,
): Promise<never> {
  let traceId: string;
  try {
    traceId = await requestFounderUserPasswordReset({
      targetUserId: readRequiredFormValue(formData, "targetUserId"),
      user: await getCurrentUser(),
    });
  } catch (error) {
    redirectWithFounderAdminError(error);
  }

  revalidatePath("/admin");
  redirect(
    `/admin?notice=${encodeURIComponent(
      `Password reset email requested. Trace ${traceId}.`,
    )}`,
  );
}

export async function founderTemporaryPasswordAction(
  formData: FormData,
): Promise<never> {
  let traceId: string;
  try {
    if (formData.get("temporaryPasswordAcknowledgement") !== "on") {
      throw new Error("Confirm that you will share this temporary password securely.");
    }

    traceId = await setFounderUserTemporaryPassword({
      targetUserId: readRequiredFormValue(formData, "targetUserId"),
      temporaryPassword: readFounderTemporaryPassword(
        readRequiredFormValue(formData, "temporaryPassword"),
      ),
      user: await getCurrentUser(),
    });
  } catch (error) {
    redirectWithFounderAdminError(error);
  }

  revalidatePath("/admin");
  redirect(
    `/admin?notice=${encodeURIComponent(
      `Temporary password set. Share it securely and ask the user to change it after sign-in. Trace ${traceId}.`,
    )}`,
  );
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

export async function updateFounderWorkspaceKindAction(
  formData: FormData,
): Promise<never> {
  try {
    const user = await getCurrentUser();
    const note = readOptionalFormValue(formData, "note");

    await updateFounderWorkspaceKind({
      businessId: readRequiredFormValue(formData, "businessId"),
      user,
      workspaceKind: readFounderWorkspaceKind(
        readRequiredFormValue(formData, "workspaceKind"),
      ),
      ...(note ? { note } : {}),
    });
  } catch (error) {
    redirectWithFounderAdminError(error);
  }

  revalidatePath("/admin");
  redirect("/admin?notice=Workspace%20kind%20updated.");
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

export async function updateFounderSessionPolicyAction(
  formData: FormData,
): Promise<never> {
  try {
    const user = await getCurrentUser();
    const note = readOptionalFormValue(formData, "note");
    const sessionTimeoutMode = readFounderSessionTimeoutMode(
      readRequiredFormValue(formData, "sessionTimeoutMode"),
    );

    await updateFounderSessionPolicy({
      businessId: readRequiredFormValue(formData, "businessId"),
      sessionTimeoutMinutes:
        sessionTimeoutMode === "after_duration"
          ? readFounderSessionTimeoutMinutes(
              readRequiredFormValue(formData, "sessionTimeoutMinutes"),
            )
          : null,
      sessionTimeoutMode,
      user,
      ...(note ? { note } : {}),
    });
  } catch (error) {
    redirectWithFounderAdminError(error);
  }

  revalidatePath("/admin");
  revalidatePath("/dashboard/settings");
  redirect("/admin?notice=Session%20policy%20updated.");
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
  let cleanupBusinessId: string;
  let total = 0;
  try {
    const dryRun = await dryRunFounderTestWorkspaceCleanup({
      businessId: readRequiredFormValue(formData, "businessId"),
      user: await getCurrentUser(),
    });
    total = Object.values(dryRun.counts).reduce(
      (sum, value) => sum + value,
      0,
    );
    cleanupBusinessId = dryRun.businessId;
  } catch (error) {
    redirectWithFounderAdminError(error);
  }

  revalidatePath("/admin");
  redirect(
    `/admin?notice=${encodeURIComponent(
      `Dry run ready: ${total} rows across cleanup-scoped tables.`,
    )}&cleanupBusinessId=${encodeURIComponent(cleanupBusinessId)}`,
  );
}

export async function founderTestWorkspaceCleanupAction(
  formData: FormData,
): Promise<never> {
  let total = 0;
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
    total = Object.values(result.counts).reduce(
      (sum, value) => sum + value,
      0,
    );
  } catch (error) {
    redirectWithFounderAdminError(error);
  }

  revalidatePath("/admin");
  redirect(
    `/admin?notice=${encodeURIComponent(
      `Test workspace cleanup completed: ${total} rows purged. Auth users were not deleted.`,
    )}`,
  );
}

export async function founderTestAuthUserDeleteAction(
  formData: FormData,
): Promise<never> {
  let linkedBusinessCount = 0;
  try {
    const result = await deleteFounderTestAuthUser({
      acknowledged: formData.get("authUserDeleteAcknowledgement") === "on",
      cleanupMode: readRequiredFormValue(formData, "cleanupMode"),
      finalConfirmed: formData.get("authUserDeleteFinalConfirmation") === "on",
      productionWorkspaceReclassificationAcknowledged:
        formData.get("productionWorkspaceReclassificationAcknowledgement") === "on",
      targetUserId: readRequiredFormValue(formData, "targetUserId"),
      typedConfirmation: readRequiredFormValue(
        formData,
        "authUserDeleteConfirmation",
      ),
      user: await getCurrentUser(),
    });
    linkedBusinessCount = result.linkedBusinessCount;
  } catch (error) {
    redirectWithFounderAdminError(error);
  }

  revalidatePath("/admin");
  redirect(
    `/admin?notice=${encodeURIComponent(
      `Test auth user deleted. Linked businesses at deletion time: ${linkedBusinessCount}.`,
    )}`,
  );
}
