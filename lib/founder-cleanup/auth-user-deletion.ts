/**
 * ============================================================
 * File: lib/founder-cleanup/auth-user-deletion.ts
 * Project: BizPilot AI
 * Description: Pure safety helpers for founder-only fake/test auth user deletion.
 * Role: Keeps auth identity deletion tightly scoped to non-production test users.
 * Author: MoOoH
 * Created: 2026-05-24
 * Last Updated: 2026-05-24
 * ============================================================
 */

import {
  isCleanupEligibleWorkspaceKind,
  normalizeFounderCleanupConfirmation,
  type CleanupWorkspaceKind,
} from "./confirmation.ts";

export const FOUNDER_TEST_AUTH_USER_DELETE_ACKNOWLEDGEMENT =
  "I understand this deletes only a fake/test auth login and cannot be undone.";

export type FounderAuthUserDeletionMode = "test_auth_user_delete";

export type FounderAuthUserDeletionBusinessContext = Readonly<{
  businessId: string;
  membershipRole: string | null;
  ownerUserId: string;
  workspaceKind: CleanupWorkspaceKind;
}>;

export function isExactAuthUserDeleteConfirmation(input: {
  targetEmail: string | null;
  targetUserId: string;
  typedConfirmation: string;
}): boolean {
  const typed = normalizeFounderCleanupConfirmation(input.typedConfirmation);
  const email = input.targetEmail?.trim().toLowerCase() ?? null;

  return typed === input.targetUserId || Boolean(email && typed.toLowerCase() === email);
}

export function getFounderAuthUserDeletionBlock(input: {
  actorUserId: string;
  allowProductionWorkspaceReclassification?: boolean;
  isFounderUser: boolean;
  linkedBusinesses: readonly FounderAuthUserDeletionBusinessContext[];
  targetUserId: string;
}): string | null {
  if (input.targetUserId === input.actorUserId) {
    return "Founder admin cannot delete the signed-in founder account.";
  }

  if (input.isFounderUser) {
    return "Founder admin cannot delete a founder allowlist account.";
  }

  const productionBusinesses = input.linkedBusinesses.filter(
    (business) => business.workspaceKind === "production_customer",
  );

  if (productionBusinesses.length > 0) {
    if (!input.allowProductionWorkspaceReclassification) {
      return "Auth user deletion is blocked for production workspaces.";
    }

    if (
      productionBusinesses.some(
        (business) => business.ownerUserId !== input.targetUserId,
      )
    ) {
      return "Auth user deletion is blocked because the user belongs to a production workspace they do not own.";
    }
  }

  if (
    input.linkedBusinesses.some((business) => {
      if (
        input.allowProductionWorkspaceReclassification &&
        business.ownerUserId === input.targetUserId &&
        business.workspaceKind === "production_customer"
      ) {
        return false;
      }

      return !isCleanupEligibleWorkspaceKind(business.workspaceKind);
    })
  ) {
    return "Auth user deletion is blocked until linked workspaces are marked as test, demo, or seed.";
  }

  return null;
}

export function validateFounderAuthUserDeleteConfirmation(input: {
  acknowledged: boolean;
  cleanupMode: string;
  finalConfirmed: boolean;
  productionWorkspaceReclassificationAcknowledged?: boolean;
  targetEmail: string | null;
  targetUserId: string;
  typedConfirmation: string;
}): void {
  if (input.cleanupMode !== "test_auth_user_delete") {
    throw new Error("Invalid auth user cleanup mode.");
  }

  if (!input.acknowledged || !input.finalConfirmed) {
    throw new Error("Confirm that you understand this auth user deletion.");
  }

  if (
    !isExactAuthUserDeleteConfirmation({
      targetEmail: input.targetEmail,
      targetUserId: input.targetUserId,
      typedConfirmation: input.typedConfirmation,
    })
  ) {
    throw new Error("Type the exact auth user email or ID to confirm deletion.");
  }
}
