/**
 * ============================================================
 * File: lib/business-deletion/confirmation.ts
 * Project: BizPilot AI
 * Description: Pure confirmation helpers for owner-requested workspace deletion.
 * Role: Keeps double-confirmation validation testable without service-role access.
 * Related:
 * - server/services/business-deletion.service.ts
 * - tests/unit/business-deletion-confirmation.test.mts
 * Author: MoOoH
 * Created: 2026-05-24
 * Last Updated: 2026-05-24
 * ============================================================
 */

export const BUSINESS_DELETION_ACKNOWLEDGEMENT =
  "I understand this requests workspace deletion and does not delete my login account automatically.";

export function normalizeBusinessDeletionConfirmation(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function isExactBusinessNameConfirmation(input: {
  businessName: string;
  typedBusinessName: string;
}): boolean {
  return (
    normalizeBusinessDeletionConfirmation(input.typedBusinessName) ===
    normalizeBusinessDeletionConfirmation(input.businessName)
  );
}

export function validateBusinessDeletionConfirmation(input: {
  acknowledged: boolean;
  businessName: string;
  typedBusinessName: string;
}): void {
  if (!input.acknowledged) {
    throw new Error("Confirm that you understand what this request does.");
  }

  if (
    !isExactBusinessNameConfirmation({
      businessName: input.businessName,
      typedBusinessName: input.typedBusinessName,
    })
  ) {
    throw new Error("Type the exact business name to confirm.");
  }
}
