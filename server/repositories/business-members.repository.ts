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
 * - 2026-05-04: Migrated membership data access to official Supabase SDK clients.
 * ============================================================
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

export type BusinessMemberRecord =
  Database["public"]["Tables"]["business_members"]["Row"];

export type BusinessMemberRole = BusinessMemberRecord["role"];

export async function createOwnerMembership(input: {
  businessId: string;
  supabase: SupabaseClient<Database>;
  userId: string;
}): Promise<BusinessMemberRecord> {
  const { data, error } = await input.supabase
    .from("business_members")
    .insert({
      business_id: input.businessId,
      user_id: input.userId,
      role: "owner",
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function listMembershipsForUser(input: {
  supabase: SupabaseClient<Database>;
  userId: string;
}): Promise<BusinessMemberRecord[]> {
  const { data, error } = await input.supabase
    .from("business_members")
    .select("*")
    .eq("user_id", input.userId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
