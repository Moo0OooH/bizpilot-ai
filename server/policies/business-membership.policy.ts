/**
 * ============================================================
 * File: server/policies/business-membership.policy.ts
 * Project: BizPilot AI
 * Description: Defines Phase 2 business membership authorization helpers.
 * Role: Centralizes tenant membership decisions for services and dashboard reads.
 * Related:
 * - server/repositories/business-members.repository.ts
 * - server/services/business.service.ts
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-13
 * Change Log:
 * - 2026-05-13: Enforced the server-only runtime boundary.
 * - 2026-05-04: Created Phase 2 business membership policy helper.
 * ============================================================
 */

import "server-only";

import type {
  BusinessMemberRecord,
  BusinessMemberRole,
} from "@/server/repositories/business-members.repository";

const elevatedRoles = new Set<BusinessMemberRole>(["owner", "admin"]);

export function isBusinessMember(input: {
  businessId: string;
  memberships: BusinessMemberRecord[];
  userId: string;
}): boolean {
  return input.memberships.some(
    (membership) =>
      membership.business_id === input.businessId &&
      membership.user_id === input.userId,
  );
}

export function canManageBusiness(input: {
  businessId: string;
  memberships: BusinessMemberRecord[];
  userId: string;
}): boolean {
  return input.memberships.some(
    (membership) =>
      membership.business_id === input.businessId &&
      membership.user_id === input.userId &&
      elevatedRoles.has(membership.role),
  );
}
