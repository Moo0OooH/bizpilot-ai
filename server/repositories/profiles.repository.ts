/**
 * ============================================================
 * File: server/repositories/profiles.repository.ts
 * Project: BizPilot AI
 * Description: Reads Phase 2 user profiles through Supabase RLS.
 * Role: Owns profile data access for authenticated users.
 * Related:
 * - server/services/auth.service.ts
 * - supabase/migrations/0001_auth_tenant_foundation.sql
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-04
 * Change Log:
 * - 2026-05-04: Created Phase 2 profiles repository.
 * - 2026-05-04: Migrated profile reads to official Supabase SDK clients.
 * ============================================================
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

export type ProfileRecord = Database["public"]["Tables"]["profiles"]["Row"];

export async function getProfileByUserId(input: {
  supabase: SupabaseClient<Database>;
  userId: string;
}): Promise<ProfileRecord | null> {
  const { data, error } = await input.supabase
    .from("profiles")
    .select("*")
    .eq("user_id", input.userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
