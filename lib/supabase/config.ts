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
 * - 2026-05-04: Delegated compatibility wrapper to the browser Supabase placeholder.
 * - 2026-05-04: Confirmed Phase 1 placeholder compatibility boundary.
 * ============================================================
 */

import {
  getSupabaseBrowserClientConfig,
  type SupabaseBrowserClientConfig,
} from "@/lib/supabase/client";

export type SupabaseClientConfig = SupabaseBrowserClientConfig;

export function getSupabaseClientConfig(): SupabaseClientConfig {
  return getSupabaseBrowserClientConfig();
}
