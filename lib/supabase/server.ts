/**
 * File: lib/supabase/server.ts
 * Project: BizPilot AI
 * Description: Holds server Supabase configuration for the Phase 1 foundation.
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-04
 */

import { getServerEnv } from "@/lib/env/server-env";

export type SupabaseServerClientConfig = {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
};

export function getSupabaseServerClientConfig(): SupabaseServerClientConfig {
  const env = getServerEnv();
  const config: SupabaseServerClientConfig = {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };

  if (env.SUPABASE_SERVICE_ROLE_KEY) {
    config.serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
  }

  return config;
}
