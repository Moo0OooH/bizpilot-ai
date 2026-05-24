/**
 * ============================================================
 * File: lib/founder-cleanup/confirmation.ts
 * Project: BizPilot AI
 * Description: Pure confirmation helpers for founder test workspace cleanup.
 * Role: Keeps hard-purge confirmations exact and test/demo/seed scoped.
 * Author: MoOoH
 * Created: 2026-05-24
 * Last Updated: 2026-05-24
 * ============================================================
 */

export const FOUNDER_TEST_CLEANUP_ACKNOWLEDGEMENT =
  "I understand this hard-purges only a founder_test, demo, or seed workspace.";

export type FounderCleanupMode = "test_hard_purge";
export type CleanupWorkspaceKind =
  | "production_customer"
  | "founder_test"
  | "demo"
  | "seed";

const cleanupEligibleKinds = new Set<CleanupWorkspaceKind>([
  "founder_test",
  "demo",
  "seed",
]);

export function normalizeFounderCleanupConfirmation(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function isCleanupEligibleWorkspaceKind(
  workspaceKind: CleanupWorkspaceKind,
): boolean {
  return cleanupEligibleKinds.has(workspaceKind);
}

export function isExactBusinessNameOrSlugConfirmation(input: {
  businessName: string;
  businessSlug: string;
  typedConfirmation: string;
}): boolean {
  const typed = normalizeFounderCleanupConfirmation(input.typedConfirmation);

  return (
    typed === normalizeFounderCleanupConfirmation(input.businessName) ||
    typed === normalizeFounderCleanupConfirmation(input.businessSlug)
  );
}

export function validateFounderCleanupConfirmation(input: {
  acknowledged: boolean;
  businessName: string;
  businessSlug: string;
  cleanupMode: string;
  finalConfirmed: boolean;
  typedConfirmation: string;
}): void {
  if (input.cleanupMode !== "test_hard_purge") {
    throw new Error("Invalid cleanup mode.");
  }

  if (!input.acknowledged || !input.finalConfirmed) {
    throw new Error("Confirm that you understand this test cleanup.");
  }

  if (
    !isExactBusinessNameOrSlugConfirmation({
      businessName: input.businessName,
      businessSlug: input.businessSlug,
      typedConfirmation: input.typedConfirmation,
    })
  ) {
    throw new Error("Type the exact business name or slug to confirm cleanup.");
  }
}
