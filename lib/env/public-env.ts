/**
 * ============================================================
 * File: lib/env/public-env.ts
 * Project: BizPilot AI
 * Description: Validates public environment variables for the Phase 1 foundation.
 * Role: Provides client-safe environment configuration used by browser-safe helpers.
 * Related:
 * - lib/env/server-env.ts
 * - lib/supabase/client.ts
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-04
 * Change Log:
 * - 2026-05-04: Created public env validation helper and added standard header.
 * ============================================================
 */

type PublicEnv = {
  NEXT_PUBLIC_APP_URL: string;
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
};

const publicEnvKeys = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

function readPublicEnvValue(key: keyof PublicEnv): string | undefined {
  const value = process.env[key];
  return value && value.trim().length > 0 ? value : undefined;
}

export function getPublicEnv(): PublicEnv {
  const missing = publicEnvKeys.filter((key) => !readPublicEnvValue(key));

  if (missing.length > 0) {
    throw new Error(`Missing public environment variables: ${missing.join(", ")}`);
  }

  return {
    NEXT_PUBLIC_APP_URL: readPublicEnvValue("NEXT_PUBLIC_APP_URL")!,
    NEXT_PUBLIC_SUPABASE_URL: readPublicEnvValue("NEXT_PUBLIC_SUPABASE_URL")!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: readPublicEnvValue(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    )!,
  };
}
