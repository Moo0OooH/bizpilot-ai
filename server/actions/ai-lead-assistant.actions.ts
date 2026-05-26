/**
 * ============================================================
 * File: server/actions/ai-lead-assistant.actions.ts
 * Project: BizPilot AI
 * Description: Provides Phase 6 AI Lead Conversion Assistant server actions.
 * Role: Runs on-demand, server-side lead AI generation for authenticated business members.
 * Related:
 * - server/errors/safe-error.ts
 * - server/services/ai/lead-conversion-assistant.service.ts
 * - app/(dashboard)/dashboard/leads/[leadId]/page.tsx
 * Author: MoOoH
 * Created: 2026-05-11
 * Last Updated: 2026-05-13
 * Change Log:
 * - 2026-05-13: Mapped AI action failures to safe user-facing messages.
 * - 2026-05-11: Created on-demand AI bundle generation action.
 * ============================================================
 */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSafeUserErrorMessage } from "@/server/errors/safe-error";
import { WORKSPACE_LOCKED_FOR_NEW_WORK_MESSAGE } from "@/lib/business-lifecycle/lock";
import { getCurrentUser } from "@/server/services/auth.service";
import { getBusinessWorkspace } from "@/server/services/business.service";
import { generateLeadAiBundle } from "@/server/services/ai/lead-conversion-assistant.service";

function readRequiredFormValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Missing required field: ${key}`);
  }

  return value.trim();
}

function redirectWithLeadError(leadId: string, error: unknown): never {
  const rawMessage =
    error instanceof Error ? error.message : "AI assistant generation failed.";
  let message = getSafeUserErrorMessage({
    allowMessage: (value) =>
      value === "Lead is not ready for AI assistance yet." ||
      value === WORKSPACE_LOCKED_FOR_NEW_WORK_MESSAGE ||
      value === "No active business is available.",
    code: "AI_ASSISTANT_ERROR",
    error,
    fallbackMessage: "AI assistant could not prepare a draft. Please try again.",
  });

  if (
    rawMessage.includes("ai_outputs") ||
    rawMessage.includes("usage_events") ||
    rawMessage.includes("relation") ||
    rawMessage.includes("schema cache")
  ) {
    message = "AI assistant storage is not ready. Apply the Phase 6 migration first.";
  } else if (rawMessage === "Lead is not ready for AI assistance yet.") {
    message = rawMessage;
  }

  redirect(`/dashboard/leads/${leadId}?error=${encodeURIComponent(message)}`);
}

export async function generateLeadAiBundleAction(
  formData: FormData,
): Promise<never> {
  const leadId = readRequiredFormValue(formData, "leadId");
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const workspace = await getBusinessWorkspace({
    userId: user.id,
  });
  const activeBusiness = workspace.businesses[0];

  if (!activeBusiness) {
    redirectWithLeadError(leadId, "No active business is available.");
  }

  let notice: string;

  try {
    const output = await generateLeadAiBundle({
      actorUserId: user.id,
      business: activeBusiness,
      leadId,
    });
    notice =
      output.provider === "openai"
        ? "AI%20assistant%20draft%20generated."
        : output.errorMessage === "ai_provider_not_configured"
          ? "Fallback%20draft%20prepared.%20Model%20generation%20is%20not%20configured."
          : "Fallback%20draft%20prepared.%20Model%20generation%20did%20not%20complete.";
  } catch (error) {
    redirectWithLeadError(leadId, error);
  }

  revalidatePath(`/dashboard/leads/${leadId}`);
  redirect(`/dashboard/leads/${leadId}?notice=${notice}`);
}
