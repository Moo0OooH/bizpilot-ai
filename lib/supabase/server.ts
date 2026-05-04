/**
 * ============================================================
 * File: lib/supabase/server.ts
 * Project: BizPilot AI
 * Description: Holds server Supabase configuration for the Phase 1 foundation.
 * Role: Provides server-side Supabase settings without implementing database workflows.
 * Related:
 * - lib/env/server-env.ts
 * - lib/supabase/client.ts
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-04
 * Change Log:
 * - 2026-05-04: Created server Supabase config placeholder and added standard header.
 * - 2026-05-04: Clarified server-only placeholder boundary and returned immutable config.
 * ============================================================
 */

import { getServerEnv } from "@/lib/env/server-env";

export type SupabaseServerClientConfig = Readonly<{
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
}>;

export function getSupabaseServerClientConfig(): SupabaseServerClientConfig {
  const env = getServerEnv();

  // Phase 1 only exposes validated config. Real server auth and queries start later.
  return Object.freeze({
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ...(env.SUPABASE_SERVICE_ROLE_KEY
      ? { serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY }
      : {}),
  });
}
