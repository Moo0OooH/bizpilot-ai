/**
 * ============================================================
 * File: server/actions/workspace-recovery.actions.ts
 * Project: BizPilot AI
 * Description: Repairs signup/bootstrap gaps for signed-in owners with no workspace.
 * Role: Lets a blocked owner recover a missing workspace without weakening RLS.
 * Related:
 * - lib/workspace-recovery/constants.ts
 * - server/services/business.service.ts
 * - server/services/auth.service.ts
 * Author: MoOoH
 * Created: 2026-07-05
 * Last Updated: 2026-07-17
 * Change Log:
 * - 2026-07-17: Restricted new-workspace recovery to verified email identities while retaining existing-workspace repair for every provider.
 * - 2026-07-05: Completed BizPilot source header metadata for workspace recovery action.
 * ============================================================
 */

"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { WORKSPACE_RECOVERY_ERROR_COOKIE } from "@/lib/workspace-recovery/constants";
import { getServerEnv } from "@/lib/env/server-env";
import { safeLogger } from "@/server/logging/safe-logger";
import {
  getCurrentUser,
  signOut,
} from "@/server/services/auth.service";
import { repairDetachedGoogleIdentity } from "@/server/services/auth-identity-recovery.service";
import {
  EXISTING_WORKSPACE_REQUIRED_ERROR,
  recoverWorkspaceAccess,
} from "@/server/services/business.service";

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
      allowWorkspaceCreation: user.authProvider === "email",
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
            : error.message === EXISTING_WORKSPACE_REQUIRED_ERROR
              ? "existing_workspace_required"
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
          "This account already has a workspace record that needs founder review." ||
        error.message === EXISTING_WORKSPACE_REQUIRED_ERROR)
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

export async function repairDetachedGoogleIdentityAction(): Promise<never> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  let result: Awaited<ReturnType<typeof repairDetachedGoogleIdentity>>;

  try {
    result = await repairDetachedGoogleIdentity({
      currentUser: user,
      resetRedirectTo: new URL(
        "/auth/reset-password",
        getServerEnv().NEXT_PUBLIC_APP_URL,
      ).toString(),
    });
  } catch (error) {
    safeLogger.warn("auth.identity_repair.action_failed", {
      errorName: error instanceof Error ? error.name : "unknown",
      userId: user.id,
    });

    (await cookies()).set(
      WORKSPACE_RECOVERY_ERROR_COOKIE,
      "We couldn't safely reconcile these login identities automatically. Founder review is required.",
      {
        httpOnly: true,
        maxAge: 60,
        path: "/dashboard",
        sameSite: "lax",
        secure: true,
      },
    );
    redirect("/dashboard");
  }

  try {
    await signOut();
  } catch {
    safeLogger.warn("auth.identity_repair.sign_out_skipped", {
      traceId: result.traceId,
    });
  }

  if (!result.resetEmailSent) {
    redirect(
      "/auth/forgot-password?error=We%20couldn't%20send%20reset%20instructions%20right%20now.%20No%20email%20was%20sent.%20Please%20wait%20a%20few%20minutes%20and%20try%20again.",
    );
  }

  redirect(
    "/auth/sign-in?notice=Google%20sign-in%20repaired.%20Check%20your%20email%20to%20set%20a%20password%2C%20then%20sign%20in%20and%20connect%20Google%20from%20Settings.",
  );
}
