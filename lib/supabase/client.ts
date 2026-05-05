/**
 * ============================================================
 * File: lib/supabase/client.ts
 * Project: BizPilot AI
 * Description: Creates browser-safe Supabase clients for Phase 2 auth flows.
 * Role: Provides the official Supabase browser client for client components when needed.
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
 * ============================================================
 */

import { createBrowserClient } from "@supabase/ssr";

import { getPublicEnv } from "@/lib/env/public-env";
import type { Database } from "@/types/database";

export type SupabaseBrowserClientConfig = Readonly<{
  url: string;
  anonKey: string;
}>;

export function getSupabaseBrowserClientConfig(): SupabaseBrowserClientConfig {
  const env = getPublicEnv();

  // Phase 1 only exposes validated config. Real browser auth starts in Phase 2.
  return Object.freeze({
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
}

export function createSupabaseBrowserClient() {
  const config = getSupabaseBrowserClientConfig();

  return createBrowserClient<Database>(config.url, config.anonKey);
}
