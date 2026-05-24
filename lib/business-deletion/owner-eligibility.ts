/**
 * ============================================================
 * File: lib/business-deletion/owner-eligibility.ts
 * Project: BizPilot AI
 * Description: Pure owner eligibility helper for workspace deletion requests.
 * Role: Keeps the settings UI and tests aligned with owner-only lifecycle rules.
 * Author: MoOoH
 * Created: 2026-05-24
 * Last Updated: 2026-05-24
 * ============================================================
 */

export type DeletionRequestBusinessState = Readonly<{
  lifecycleStatus: string;
  status: string;
}>;

export type DeletionRequestMembershipState = Readonly<{
  businessId: string;
  role: string;
  status: string;
  userId: string;
}>;

export function canUserRequestWorkspaceDeletion(input: {
  business: DeletionRequestBusinessState;
  businessId: string;
  memberships: readonly DeletionRequestMembershipState[];
  userId: string;
}): boolean {
  const isActiveOwner = input.memberships.some(
    (membership) =>
      membership.businessId === input.businessId &&
      membership.userId === input.userId &&
      membership.role === "owner" &&
      membership.status === "active",
  );

  return (
    isActiveOwner &&
    input.business.status === "active" &&
    input.business.lifecycleStatus === "active"
  );
}
