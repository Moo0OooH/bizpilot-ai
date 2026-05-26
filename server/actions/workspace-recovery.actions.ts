/**
 * File: server/actions/workspace-recovery.actions.ts
 * Project: BizPilot AI
 * Description: Repairs signup/bootstrap gaps for signed-in owners with no workspace.
 * Role: Lets a blocked owner recover a missing workspace without weakening RLS.
 */

"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { WORKSPACE_RECOVERY_ERROR_COOKIE } from "@/lib/workspace-recovery/constants";
import { safeLogger } from "@/server/logging/safe-logger";
import { getCurrentUser } from "@/server/services/auth.service";
import { recoverWorkspaceAccess } from "@/server/services/business.service";

function readBusinessName(formData: FormData): string {
  const value = formData.get("businessName");

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error("Business name is required.");
  }

  return value.trim();
}

function redirectWithRecoveryError(): never {
  redirect("/dashboard");
}

export async function recoverWorkspaceAccessAction(
  formData: FormData,
): Promise<never> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  try {
    await recoverWorkspaceAccess({
      businessName: readBusinessName(formData),
      userId: user.id,
    });
  } catch (error) {
    const errorCode =
      error instanceof Error
        ? error.message === "Business name is required."
          ? "missing_business_name"
          : error.message ===
              "This account already has a workspace record that needs founder review."
            ? "existing_workspace_state"
            : "workspace_recovery_failed"
        : "workspace_recovery_failed";

    safeLogger.warn("workspace_recovery.failed", {
      errorCode,
      errorName: error instanceof Error ? error.name : "unknown",
      userId: user.id,
    });

    const message =
      error instanceof Error &&
      (error.message === "Business name is required." ||
        error.message ===
          "This account already has a workspace record that needs founder review.")
        ? error.message
        : "We couldn't recover this workspace automatically. Founder review is needed.";

    (await cookies()).set(WORKSPACE_RECOVERY_ERROR_COOKIE, message, {
      httpOnly: true,
      maxAge: 60,
      path: "/dashboard",
      sameSite: "lax",
      secure: true,
    });

    redirectWithRecoveryError();
  }

  revalidatePath("/dashboard");
  redirect("/dashboard?notice=Workspace%20recovered.");
}
