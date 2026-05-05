/**
 * ============================================================
 * File: lib/supabase/server.ts
 * Project: BizPilot AI
 * Description: Creates server-side Supabase clients for Phase 2 auth and tenant workflows.
 * Role: Provides request-scoped and service-role Supabase clients behind one boundary.
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
 * ============================================================
 */

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

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

export async function createSupabaseServerClient() {
  const config = getSupabaseServerClientConfig();
  const cookieStore = await cookies();

  return createServerClient<Database>(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, options, value }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot always set cookies; middleware refreshes sessions.
        }
      },
    },
  });
}

export function createSupabaseServiceRoleClient() {
  const config = getSupabaseServerClientConfig();

  if (!config.serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for tenant setup.");
  }

  return createClient<Database>(config.url, config.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
