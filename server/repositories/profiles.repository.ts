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
 * ============================================================
 */

import { requestSupabaseTable } from "@/lib/supabase/rest";

export type ProfileRecord = Readonly<{
  display_name: string | null;
  id: string;
  user_id: string;
}>;

export async function getProfileByUserId(input: {
  accessToken: string;
  userId: string;
}): Promise<ProfileRecord | null> {
  const query = new URLSearchParams({
    select: "id,user_id,display_name",
    user_id: `eq.${input.userId}`,
    limit: "1",
  });
  const profiles = await requestSupabaseTable<ProfileRecord[]>("profiles", {
    accessToken: input.accessToken,
    query: query.toString(),
  });

  return profiles[0] ?? null;
}
