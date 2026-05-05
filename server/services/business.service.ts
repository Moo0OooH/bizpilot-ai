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
 * - 2026-05-04: Migrated business workflows to official Supabase SDK clients.
 * ============================================================
 */

import {
  createSupabaseServerClient,
  createSupabaseServiceRoleClient,
} from "@/lib/supabase/server";
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
  businessName: string;
  ownerUserId: string;
  serviceRole?: boolean;
}): Promise<BusinessRecord> {
  const supabase = input.serviceRole
    ? createSupabaseServiceRoleClient()
    : await createSupabaseServerClient();
  const business = await createBusinessForOwner({
    name: input.businessName,
    ownerUserId: input.ownerUserId,
    slug: toSlug(input.businessName),
    supabase,
  });

  await createOwnerMembership({
    businessId: business.id,
    supabase,
    userId: input.ownerUserId,
  });

  return business;
}

export async function getBusinessWorkspace(input: {
  userId: string;
}): Promise<BusinessWorkspace> {
  const supabase = await createSupabaseServerClient();
  const [businesses, memberships] = await Promise.all([
    listBusinessesForUser({ supabase }),
    listMembershipsForUser({
      supabase,
      userId: input.userId,
    }),
  ]);

  return {
    businesses,
    memberships,
  };
}
