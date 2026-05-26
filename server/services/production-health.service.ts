/**
 * File: server/services/production-health.service.ts
 * Project: BizPilot AI
 * Description: Founder-only safe runtime diagnostics for production wiring.
 * Role: Verifies Supabase target and privileged read health without exposing secrets.
 */

import "server-only";

import { getServerEnv } from "@/lib/env/server-env";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import type { AuthUser } from "@/server/services/auth.service";
import { assertFounderUser } from "@/server/services/founder-admin.service";
import type { Database } from "@/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";

const canonicalProductionSupabaseRef = "qfqendrqimqvkoojpjao";

type HealthCheck = Readonly<{
  count: number | null;
  ok: boolean;
  status: number | null;
}>;

export type FounderProductionHealth = Readonly<{
  authAdmin: HealthCheck;
  businessMembers: HealthCheck;
  businesses: HealthCheck;
  deletionRequests: HealthCheck;
  publicLinks: HealthCheck;
  profiles: HealthCheck;
  recentActions: HealthCheck;
  supabaseHostRef: string | null;
  supabaseTargetMatchesCanonical: boolean;
}>;

function readSupabaseHostRef(url: string): string | null {
  try {
    return new URL(url).host.split(".")[0] ?? null;
  } catch {
    return null;
  }
}

async function countTable(
  supabase: SupabaseClient<Database>,
  table: keyof Database["public"]["Tables"],
): Promise<HealthCheck> {
  const { count, error, status } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true });

  return {
    count: count ?? null,
    ok: !error,
    status: status ?? null,
  };
}

export async function getFounderProductionHealth(input: {
  user: AuthUser | null;
}): Promise<FounderProductionHealth> {
  assertFounderUser(input.user);

  const env = getServerEnv();
  const supabaseHostRef = readSupabaseHostRef(env.NEXT_PUBLIC_SUPABASE_URL);
  const supabase = createSupabaseServiceRoleClient();
  const [
    authUsersResult,
    businesses,
    businessMembers,
    profiles,
    publicLinks,
    recentActions,
    deletionRequests,
  ] = await Promise.all([
    supabase.auth.admin.listUsers({ page: 1, perPage: 1 }),
    countTable(supabase, "businesses"),
    countTable(supabase, "business_members"),
    countTable(supabase, "profiles"),
    countTable(supabase, "public_link_variants"),
    countTable(supabase, "admin_action_log"),
    countTable(supabase, "business_deletion_requests"),
  ]);
  const authData = authUsersResult.data as { total?: number } | null;

  return {
    authAdmin: {
      count: authData?.total ?? null,
      ok: !authUsersResult.error,
      status: authUsersResult.error?.status ?? null,
    },
    businessMembers,
    businesses,
    deletionRequests,
    profiles,
    publicLinks,
    recentActions,
    supabaseHostRef,
    supabaseTargetMatchesCanonical:
      supabaseHostRef === canonicalProductionSupabaseRef,
  };
}
