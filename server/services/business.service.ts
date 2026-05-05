/**
 * ============================================================
 * File: server/services/business.service.ts
 * Project: BizPilot AI
 * Description: Coordinates Phase 2 tenant business setup and membership reads.
 * Role: Owns business foundation workflows without adding product configuration.
 * Related:
 * - server/repositories/businesses.repository.ts
 * - server/repositories/business-members.repository.ts
 * - server/policies/business-membership.policy.ts
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-04
 * Change Log:
 * - 2026-05-04: Created Phase 2 business foundation service.
 * - 2026-05-04: Added service-role path for sign-up before confirmed sessions.
 * ============================================================
 */

import {
  createOwnerMembership,
  listMembershipsForUser,
  type BusinessMemberRecord,
} from "@/server/repositories/business-members.repository";
import {
  createBusinessForOwner,
  listBusinessesForUser,
  type BusinessRecord,
} from "@/server/repositories/businesses.repository";

export type BusinessWorkspace = Readonly<{
  businesses: BusinessRecord[];
  memberships: BusinessMemberRecord[];
}>;

function toSlug(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return slug || `business-${Date.now()}`;
}

export async function createFoundingBusiness(input: {
  accessToken?: string;
  businessName: string;
  ownerUserId: string;
  serviceRole?: boolean;
}): Promise<BusinessRecord> {
  const business = await createBusinessForOwner({
    ...(input.accessToken ? { accessToken: input.accessToken } : {}),
    name: input.businessName,
    ownerUserId: input.ownerUserId,
    ...(input.serviceRole !== undefined ? { serviceRole: input.serviceRole } : {}),
    slug: toSlug(input.businessName),
  });

  await createOwnerMembership({
    ...(input.accessToken ? { accessToken: input.accessToken } : {}),
    businessId: business.id,
    ...(input.serviceRole !== undefined ? { serviceRole: input.serviceRole } : {}),
    userId: input.ownerUserId,
  });

  return business;
}

export async function getBusinessWorkspace(input: {
  accessToken: string;
  userId: string;
}): Promise<BusinessWorkspace> {
  const [businesses, memberships] = await Promise.all([
    listBusinessesForUser({ accessToken: input.accessToken }),
    listMembershipsForUser({
      accessToken: input.accessToken,
      userId: input.userId,
    }),
  ]);

  return {
    businesses,
    memberships,
  };
}
