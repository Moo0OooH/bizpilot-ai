/**
 * ============================================================
 * File: lib/supabase/client.ts
 * Project: BizPilot AI
 * Description: Provides browser-safe Supabase placeholder configuration for Phase 1.
 * Role: Keeps public Supabase environment access centralized before auth is implemented.
 * Related:
 * - lib/env/public-env.ts
 * - lib/supabase/server.ts
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-04
 * Change Log:
 * - 2026-05-04: Created browser Supabase config placeholder and added standard header.
 * - 2026-05-04: Clarified Phase 1 placeholder boundary and returned immutable config.
 * - 2026-05-04: Added official Supabase browser client factory.
 * - 2026-05-04: Restored Phase 1 placeholder boundary and disabled real client creation.
 * ============================================================
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import { getPublicEnv } from "@/lib/env/public-env";
import type { Database } from "@/types/database";

export type SupabaseBrowserClientConfig = Readonly<{
  url: string;
  anonKey: string;
}>;

export function getSupabaseBrowserClientConfig(): SupabaseBrowserClientConfig {
  const env = getPublicEnv();

  return Object.freeze({
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
}

export function createSupabaseBrowserClient(): SupabaseClient<Database> {
  throw new Error("Supabase browser client creation starts in Phase 2.");
}
