/**
 * ============================================================
 * File: server/actions/lead-conversion.actions.ts
 * Project: BizPilot AI
 * Description: Provides Phase 5 Lead Conversion Desk server actions.
 * Role: Connects protected owner lead workflow forms to tenant-safe services.
 * Related:
 * - app/(dashboard)/dashboard/leads/[leadId]/page.tsx
 * - server/services/lead-conversion.service.ts
 * Author: MoOoH
 * Created: 2026-05-07
 * Last Updated: 2026-05-07
 * Change Log:
 * - 2026-05-07: Created Lead Conversion Desk status, copy, action, and outcome actions.
 * ============================================================
 */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/server/services/auth.service";
import { getBusinessWorkspace } from "@/server/services/business.service";
import {
  completeActionItem,
  markLeadOutcome,
  markReplyCopied,
  updateLeadStatus,
} from "@/server/services/lead-conversion.service";
import type {
  LeadManualOutcome,
  LeadStatus,
} from "@/server/repositories/lead-conversion.repository";

function readRequiredFormValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Missing required field: ${key}`);
  }

  return value.trim();
}

function readLeadStatus(value: string): LeadStatus {
  if (
    value === "new" ||
    value === "reviewed" ||
    value === "replied" ||
    value === "follow_up_needed" ||
    value === "booked" ||
    value === "lost" ||
    value === "archived"
  ) {
    return value;
  }

  throw new Error("Invalid lead status.");
}

function readManualOutcome(value: string): LeadManualOutcome {
  if (
    value === "booked" ||
    value === "lost" ||
    value === "no_response" ||
    value === "not_a_fit" ||
    value === "asked_info"
  ) {
    return value;
  }

  throw new Error("Invalid manual outcome.");
}

async function getActiveBusinessForAction() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const workspace = await getBusinessWorkspace({
    userId: user.id,
  });
  const activeBusiness = workspace.businesses[0];

  if (!activeBusiness) {
    throw new Error("No active business is available.");
  }

  return activeBusiness;
}

function redirectWithLeadError(leadId: string, error: unknown): never {
  const message =
    error instanceof Error ? error.message : "Lead workflow update failed.";
  redirect(`/dashboard/leads/${leadId}?error=${encodeURIComponent(message)}`);
}

export async function updateLeadStatusAction(
  formData: FormData,
): Promise<never> {
  const leadId = readRequiredFormValue(formData, "leadId");

  try {
    await updateLeadStatus({
      business: await getActiveBusinessForAction(),
      leadId,
      status: readLeadStatus(readRequiredFormValue(formData, "status")),
    });
  } catch (error) {
    redirectWithLeadError(leadId, error);
  }

  revalidatePath("/dashboard/leads");
  revalidatePath(`/dashboard/leads/${leadId}`);
  redirect(`/dashboard/leads/${leadId}?notice=Lead%20status%20updated.`);
}

export async function markReplyCopiedAction(
  formData: FormData,
): Promise<never> {
  const leadId = readRequiredFormValue(formData, "leadId");

  try {
    await markReplyCopied({
      business: await getActiveBusinessForAction(),
      leadId,
    });
  } catch (error) {
    redirectWithLeadError(leadId, error);
  }

  revalidatePath("/dashboard/leads");
  revalidatePath(`/dashboard/leads/${leadId}`);
  redirect(`/dashboard/leads/${leadId}?notice=Reply%20copy%20recorded.`);
}

export async function markLeadOutcomeAction(
  formData: FormData,
): Promise<never> {
  const leadId = readRequiredFormValue(formData, "leadId");

  try {
    await markLeadOutcome({
      business: await getActiveBusinessForAction(),
      leadId,
      manualOutcome: readManualOutcome(
        readRequiredFormValue(formData, "manualOutcome"),
      ),
    });
  } catch (error) {
    redirectWithLeadError(leadId, error);
  }

  revalidatePath("/dashboard/leads");
  revalidatePath(`/dashboard/leads/${leadId}`);
  redirect(`/dashboard/leads/${leadId}?notice=Lead%20outcome%20saved.`);
}

export async function completeActionItemAction(
  formData: FormData,
): Promise<never> {
  const leadId = readRequiredFormValue(formData, "leadId");

  try {
    await completeActionItem({
      actionItemId: readRequiredFormValue(formData, "actionItemId"),
      business: await getActiveBusinessForAction(),
      leadId,
    });
  } catch (error) {
    redirectWithLeadError(leadId, error);
  }

  revalidatePath("/dashboard/leads");
  revalidatePath(`/dashboard/leads/${leadId}`);
  redirect(`/dashboard/leads/${leadId}?notice=Action%20completed.`);
}
