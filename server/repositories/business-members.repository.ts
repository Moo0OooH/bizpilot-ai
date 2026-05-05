/**
 * ============================================================
 * File: server/repositories/business-members.repository.ts
 * Project: BizPilot AI
 * Description: Handles Phase 2 business membership data access through Supabase RLS.
 * Role: Owns tenant membership reads and owner membership creation.
 * Related:
 * - server/services/business.service.ts
 * - server/policies/business-membership.policy.ts
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-04
 * Change Log:
 * - 2026-05-04: Created Phase 2 business members repository.
 * - 2026-05-04: Added server-only service-role option for sign-up tenant setup.
 * ============================================================
 */

import { requestSupabaseTable } from "@/lib/supabase/rest";

export type BusinessMemberRole = "admin" | "concierge_limited" | "member" | "owner";

export type BusinessMemberRecord = Readonly<{
  business_id: string;
  id: string;
  role: BusinessMemberRole;
  user_id: string;
}>;

export async function createOwnerMembership(input: {
  accessToken?: string;
  businessId: string;
  serviceRole?: boolean;
  userId: string;
}): Promise<BusinessMemberRecord> {
  const memberships = await requestSupabaseTable<BusinessMemberRecord[]>(
    "business_members",
    {
      ...(input.accessToken ? { accessToken: input.accessToken } : {}),
      method: "POST",
      prefer: "return=representation",
      ...(input.serviceRole !== undefined ? { serviceRole: input.serviceRole } : {}),
      body: {
        business_id: input.businessId,
        user_id: input.userId,
        role: "owner",
      },
    },
  );

  if (!memberships[0]) {
    throw new Error("Supabase did not return the created membership.");
  }

  return memberships[0];
}

export async function listMembershipsForUser(input: {
  accessToken: string;
  userId: string;
}): Promise<BusinessMemberRecord[]> {
  const query = new URLSearchParams({
    select: "id,business_id,user_id,role",
    user_id: `eq.${input.userId}`,
    order: "created_at.asc",
  });

  return requestSupabaseTable<BusinessMemberRecord[]>("business_members", {
    accessToken: input.accessToken,
    query: query.toString(),
  });
}
