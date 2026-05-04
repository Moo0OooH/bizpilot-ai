/**
 * ============================================================
 * File: lib/supabase/config.ts
 * Project: BizPilot AI
 * Description: Provides a compatibility wrapper for Supabase client configuration.
 * Role: Keeps earlier imports stable while Phase 1 moves toward split client/server files.
 * Related:
 * - lib/supabase/client.ts
 * - lib/env/public-env.ts
 * Author: MoOoH
 * Created: 2026-05-02
 * Last Updated: 2026-05-04
 * Change Log:
 * - 2026-05-04: Updated wrapper to use public env validation and added standard header.
 * ============================================================
 */

import { getPublicEnv } from "@/lib/env/public-env";

export type SupabaseClientConfig = {
  url: string;
  anonKey: string;
};

export function getSupabaseClientConfig(): SupabaseClientConfig {
  const env = getPublicEnv();

  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}
