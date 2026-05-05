/**
 * ============================================================
 * File: lib/supabase/server.ts
 * Project: BizPilot AI
 * Description: Provides server-side Supabase placeholder configuration for Phase 1.
 * Role: Keeps server Supabase environment access centralized before auth is implemented.
 * Related:
 * - lib/env/server-env.ts
 * - lib/supabase/client.ts
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-04
 * Change Log:
 * - 2026-05-04: Created server Supabase config placeholder and added standard header.
 * - 2026-05-04: Clarified server-only placeholder boundary and returned immutable config.
 * - 2026-05-04: Added official Supabase SSR and service-role client factories.
 * - 2026-05-04: Restored Phase 1 placeholder boundary and disabled real client creation.
 * ============================================================
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import { getServerEnv } from "@/lib/env/server-env";
import type { Database } from "@/types/database";

export type SupabaseServerClientConfig = Readonly<{
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
}>;

export function getSupabaseServerClientConfig(): SupabaseServerClientConfig {
  const env = getServerEnv();

  return Object.freeze({
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ...(env.SUPABASE_SERVICE_ROLE_KEY
      ? { serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY }
      : {}),
  });
}

export async function createSupabaseServerClient(): Promise<
  SupabaseClient<Database>
> {
  throw new Error("Supabase server client creation starts in Phase 2.");
}

export function createSupabaseServiceRoleClient(): SupabaseClient<Database> {
  throw new Error("Supabase service-role client creation starts in Phase 2.");
}
