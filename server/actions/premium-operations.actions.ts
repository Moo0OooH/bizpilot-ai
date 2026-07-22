/**
 * ============================================================
 * File: server/actions/premium-operations.actions.ts
 * Project: BizPilot AI
 * Description: Protected server actions for Premium Lead Operations and dashboard-interface preference.
 * Role: Bridges dashboard forms to entitlement-gated owner workflows without automatic sending, booking, or external delivery.
 * Related:
 * - server/services/premium-operations.service.ts
 * - lib/i18n/dashboard-interface.ts
 * - app/(dashboard)/dashboard/operations/page.tsx
 * Author: MoOoH
 * Created: 2026-07-21
 * Last Updated: 2026-07-22
 * Change Log:
 * - 2026-07-21: Created safe, tenant-scoped Premium Operations and dashboard-language actions.
 * - 2026-07-21: Redirected Premium Operations feedback through stable locale-neutral codes for route-level localization.
 * - 2026-07-22: Added localized fail-closed feedback for timezone, past-range, and stale availability validation.
 * - 2026-07-22: Synced the database future-start validation message with the localized past-range code.
 * ============================================================
 */

"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  DASHBOARD_INTERFACE_LANGUAGE_COOKIE,
  isDashboardInterfaceLanguage,
  premiumOperationsRouteErrorCodes,
  premiumOperationsRouteNoticeCodes,
} from "@/lib/i18n/dashboard-interface";
import { getSafeUserErrorMessage } from "@/server/errors/safe-error";
import { getCurrentUser } from "@/server/services/auth.service";
import { getBusinessWorkspace } from "@/server/services/business.service";
import {
  addInternalTimeBlock,
  addPriorityRule,
  cancelInternalTimeBlock,
  prepareAvailabilityReviewDraft,
  prepareBulkReplyDraft,
  recordBulkReplyCopied,
  removePriorityRule,
  reviewBulkReplyDraft,
} from "@/server/services/premium-operations.service";

const OPERATIONS_PATH = "/dashboard/operations";

function readRequired(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Missing required field: ${key}`);
  }
  return value.trim();
}

function readOptional(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readCsv(formData: FormData, key: string): string[] {
  return readOptional(formData, key)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function readLeadIds(formData: FormData): string[] {
  return formData
    .getAll("leadId")
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);
}

function safeDashboardRedirect(value: string): string {
  return value.startsWith("/dashboard/") ? value : "/dashboard";
}

async function getActionContext(input: { requireManager?: boolean } = {}) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");
  const workspace = await getBusinessWorkspace({ userId: user.id });
  const business = workspace.businesses[0];
  if (!business) throw new Error("No active business is available.");
  if (
    input.requireManager === true &&
    !workspace.memberships.some(
      (membership) =>
        membership.business_id === business.id &&
        membership.user_id === user.id &&
        membership.status === "active" &&
        (membership.role === "owner" || membership.role === "admin"),
    )
  ) {
    throw new Error("You do not have permission to manage this business.");
  }
  return { business, user };
}

function premiumOperationsErrorCode(message: string): string {
  switch (message) {
    case "This Premium add-on is not active for this workspace.":
      return premiumOperationsRouteErrorCodes.addonInactive;
    case "This workspace is not active.":
      return premiumOperationsRouteErrorCodes.workspaceInactive;
    case "This workspace is locked for new work.":
      return premiumOperationsRouteErrorCodes.workspaceLocked;
    case "Priority name must be at least 2 characters.":
      return premiumOperationsRouteErrorCodes.invalidPriorityName;
    case "Priority rank must be between 1 and 5.":
      return premiumOperationsRouteErrorCodes.invalidPriorityRank;
    case "Limit reached: up to 20 priority views are supported.":
      return premiumOperationsRouteErrorCodes.maximumPriorityRules;
    case "Choose a valid time range of up to 24 hours.":
      return premiumOperationsRouteErrorCodes.invalidAvailabilityRange;
    case "Choose valid local times outside a daylight-saving transition.":
      return premiumOperationsRouteErrorCodes.invalidLocalTime;
    case "Choose a future time range.":
    case "Active internal time blocks must start in the future.":
      return premiumOperationsRouteErrorCodes.pastAvailabilityRange;
    case "This internal time overlaps another active time block.":
      return premiumOperationsRouteErrorCodes.timeBlockConflict;
    case "Client and service are required.":
      return premiumOperationsRouteErrorCodes.requiredAvailabilityDetails;
    case "Select at least one lead.":
      return premiumOperationsRouteErrorCodes.noEligibleLeads;
    case "A review batch can contain up to 50 leads.":
      return premiumOperationsRouteErrorCodes.maximumBatchRecipients;
    case "A title and draft message are required.":
      return premiumOperationsRouteErrorCodes.requiredDraftContent;
    case "One or more selected leads are unavailable.":
      return premiumOperationsRouteErrorCodes.leadUnavailable;
    case "You do not have permission to manage this business.":
      return premiumOperationsRouteErrorCodes.managerPermissionRequired;
    case "Booked, lost, and archived leads cannot be added to a draft batch.":
      return premiumOperationsRouteErrorCodes.terminalLeadSelection;
    case "The requested draft is unavailable.":
      return premiumOperationsRouteErrorCodes.draftUnavailable;
    case "A manager must review this draft before it can be copied.":
      return premiumOperationsRouteErrorCodes.managerReviewRequired;
    case "This request does not include a usable preferred time.":
      return premiumOperationsRouteErrorCodes.unusablePreferredTime;
    case "This request no longer conflicts with a saved internal time block.":
      return premiumOperationsRouteErrorCodes.availabilityConflictResolved;
    case "An availability review draft already exists for this request.":
      return premiumOperationsRouteErrorCodes.availabilityDraftExists;
    case "This availability draft is no longer current.":
      return premiumOperationsRouteErrorCodes.availabilityDraftStale;
    case "The requested internal time block is unavailable.":
      return premiumOperationsRouteErrorCodes.timeBlockUnavailable;
    default:
      return premiumOperationsRouteErrorCodes.generic;
  }
}

function redirectWithOperationsError(error: unknown): never {
  const message = getSafeUserErrorMessage({
    allowMessage: (value) =>
      value === "This Premium add-on is not active for this workspace." ||
      value === "This workspace is not active." ||
      value === "This workspace is locked for new work." ||
      value === "Priority name must be at least 2 characters." ||
      value === "Priority rank must be between 1 and 5." ||
      value === "Limit reached: up to 20 priority views are supported." ||
      value === "Choose a valid time range of up to 24 hours." ||
      value === "Choose valid local times outside a daylight-saving transition." ||
      value === "Choose a future time range." ||
      value === "Active internal time blocks must start in the future." ||
      value === "This internal time overlaps another active time block." ||
      value === "Client and service are required." ||
      value === "Select at least one lead." ||
      value === "A review batch can contain up to 50 leads." ||
      value === "A title and draft message are required." ||
      value === "One or more selected leads are unavailable." ||
      value === "You do not have permission to manage this business." ||
      value === "Booked, lost, and archived leads cannot be added to a draft batch." ||
      value === "The requested draft is unavailable." ||
      value === "A manager must review this draft before it can be copied." ||
      value === "This request does not include a usable preferred time." ||
      value === "This request no longer conflicts with a saved internal time block." ||
      value === "An availability review draft already exists for this request." ||
      value === "This availability draft is no longer current." ||
      value === "The requested internal time block is unavailable.",
    code: "PREMIUM_OPERATIONS_ERROR",
    error,
    fallbackMessage: "We couldn't complete this Premium Operations action. Please try again.",
  });
  redirect(
    `${OPERATIONS_PATH}?error=${encodeURIComponent(
      premiumOperationsErrorCode(message),
    )}`,
  );
}

function refreshPremiumOperations(): void {
  revalidatePath(OPERATIONS_PATH);
  revalidatePath("/dashboard/leads");
  revalidatePath("/dashboard");
}

export async function updateDashboardInterfaceLanguageAction(
  formData: FormData,
): Promise<never> {
  const language = readRequired(formData, "language");
  if (!isDashboardInterfaceLanguage(language)) {
    redirect(`${safeDashboardRedirect(readOptional(formData, "redirectTo"))}?error=Invalid%20dashboard%20language.`);
  }
  const cookieStore = await cookies();
  cookieStore.set(DASHBOARD_INTERFACE_LANGUAGE_COOKIE, language, {
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  redirect(safeDashboardRedirect(readOptional(formData, "redirectTo")));
}

export async function createPriorityRuleAction(formData: FormData): Promise<never> {
  try {
    const { business, user } = await getActionContext({ requireManager: true });
    await addPriorityRule({
      actorUserId: user.id,
      areaTerms: readCsv(formData, "areaTerms"),
      business,
      description: readOptional(formData, "description"),
      name: readRequired(formData, "name"),
      priorityRank: Number(readRequired(formData, "priorityRank")),
      serviceTerms: readCsv(formData, "serviceTerms"),
    });
  } catch (error) {
    redirectWithOperationsError(error);
  }
  refreshPremiumOperations();
  redirect(
    `${OPERATIONS_PATH}?notice=${premiumOperationsRouteNoticeCodes.priorityRuleSaved}`,
  );
}

export async function deletePriorityRuleAction(formData: FormData): Promise<never> {
  try {
    const { business } = await getActionContext({ requireManager: true });
    await removePriorityRule({ business, ruleId: readRequired(formData, "ruleId") });
  } catch (error) {
    redirectWithOperationsError(error);
  }
  refreshPremiumOperations();
  redirect(
    `${OPERATIONS_PATH}?notice=${premiumOperationsRouteNoticeCodes.priorityRuleRemoved}`,
  );
}

export async function createInternalTimeBlockAction(
  formData: FormData,
): Promise<never> {
  try {
    const { business, user } = await getActionContext({ requireManager: true });
    const status = readOptional(formData, "status") === "tentative" ? "tentative" : "reserved";
    await addInternalTimeBlock({
      actorUserId: user.id,
      business,
      clientName: readRequired(formData, "clientName"),
      companyName: readOptional(formData, "companyName"),
      endsAt: readRequired(formData, "endsAt"),
      leadId: readOptional(formData, "leadId"),
      notes: readOptional(formData, "notes"),
      serviceLabel: readRequired(formData, "serviceLabel"),
      startsAt: readRequired(formData, "startsAt"),
      status,
    });
  } catch (error) {
    redirectWithOperationsError(error);
  }
  refreshPremiumOperations();
  redirect(
    `${OPERATIONS_PATH}?notice=${premiumOperationsRouteNoticeCodes.internalTimeBlockSaved}`,
  );
}

export async function cancelInternalTimeBlockAction(
  formData: FormData,
): Promise<never> {
  try {
    const { business } = await getActionContext({ requireManager: true });
    await cancelInternalTimeBlock({
      business,
      timeBlockId: readRequired(formData, "timeBlockId"),
    });
  } catch (error) {
    redirectWithOperationsError(error);
  }
  refreshPremiumOperations();
  redirect(
    `${OPERATIONS_PATH}?notice=${premiumOperationsRouteNoticeCodes.internalTimeBlockCancelled}`,
  );
}

export async function createBulkReplyDraftAction(
  formData: FormData,
): Promise<never> {
  try {
    const { business, user } = await getActionContext({ requireManager: true });
    await prepareBulkReplyDraft({
      actorUserId: user.id,
      business,
      leadIds: readLeadIds(formData),
      messageTemplate: readRequired(formData, "messageTemplate"),
      title: readRequired(formData, "title"),
    });
  } catch (error) {
    redirectWithOperationsError(error);
  }
  refreshPremiumOperations();
  redirect(
    `${OPERATIONS_PATH}?notice=${premiumOperationsRouteNoticeCodes.draftBatchPrepared}`,
  );
}

export async function createAvailabilityReviewDraftAction(
  formData: FormData,
): Promise<never> {
  try {
    const { business, user } = await getActionContext({ requireManager: true });
    await prepareAvailabilityReviewDraft({
      actorUserId: user.id,
      business,
      draft: readRequired(formData, "draft"),
      leadId: readRequired(formData, "leadId"),
    });
  } catch (error) {
    redirectWithOperationsError(error);
  }
  refreshPremiumOperations();
  redirect(
    `${OPERATIONS_PATH}?notice=${premiumOperationsRouteNoticeCodes.availabilityReplyPrepared}`,
  );
}

export async function reviewBulkReplyDraftAction(
  formData: FormData,
): Promise<never> {
  try {
    const { business } = await getActionContext({ requireManager: true });
    await reviewBulkReplyDraft({
      business,
      draftId: readRequired(formData, "draftId"),
    });
  } catch (error) {
    redirectWithOperationsError(error);
  }
  refreshPremiumOperations();
  redirect(
    `${OPERATIONS_PATH}?notice=${premiumOperationsRouteNoticeCodes.draftReviewRecorded}`,
  );
}

export async function recordBulkReplyCopiedAction(
  formData: FormData,
): Promise<never> {
  try {
    const { business } = await getActionContext({ requireManager: true });
    await recordBulkReplyCopied({
      business,
      recipientId: readRequired(formData, "recipientId"),
    });
  } catch (error) {
    redirectWithOperationsError(error);
  }
  refreshPremiumOperations();
  redirect(
    `${OPERATIONS_PATH}?notice=${premiumOperationsRouteNoticeCodes.manualCopyRecorded}`,
  );
}
