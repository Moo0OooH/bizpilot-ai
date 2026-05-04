/**
 * File: lib/supabase/client.ts
 * Project: BizPilot AI
 * Description: Holds browser Supabase client configuration for the Phase 1 foundation.
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-04
 */

import { getPublicEnv } from "@/lib/env/public-env";

export type SupabaseBrowserClientConfig = {
  url: string;
  anonKey: string;
};

export function getSupabaseBrowserClientConfig(): SupabaseBrowserClientConfig {
  const env = getPublicEnv();

  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}
