/**
 * ============================================================
 * File: lib/supabase/client.ts
 * Project: BizPilot AI
 * Description: Holds browser Supabase client configuration for the Phase 1 foundation.
 * Role: Provides browser-safe Supabase settings without creating auth or data workflows.
 * Related:
 * - lib/env/public-env.ts
 * - lib/supabase/server.ts
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-04
 * Change Log:
 * - 2026-05-04: Created browser Supabase config placeholder and added standard header.
 * - 2026-05-04: Clarified Phase 1 placeholder boundary and returned immutable config.
 * ============================================================
 */

import { getPublicEnv } from "@/lib/env/public-env";

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
