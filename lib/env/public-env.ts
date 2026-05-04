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
 * - 2026-05-04: Added URL format validation for public environment values.
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

function assertValidUrl(key: keyof PublicEnv, value: string): void {
  try {
    new URL(value);
  } catch {
    throw new Error(`Invalid URL in public environment variable: ${key}`);
  }
}

export function getPublicEnv(): PublicEnv {
  const missing = publicEnvKeys.filter((key) => !readPublicEnvValue(key));

  if (missing.length > 0) {
    throw new Error(`Missing public environment variables: ${missing.join(", ")}`);
  }

  const env = {
    NEXT_PUBLIC_APP_URL: readPublicEnvValue("NEXT_PUBLIC_APP_URL")!,
    NEXT_PUBLIC_SUPABASE_URL: readPublicEnvValue("NEXT_PUBLIC_SUPABASE_URL")!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: readPublicEnvValue(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    )!,
  };

  assertValidUrl("NEXT_PUBLIC_APP_URL", env.NEXT_PUBLIC_APP_URL);
  assertValidUrl("NEXT_PUBLIC_SUPABASE_URL", env.NEXT_PUBLIC_SUPABASE_URL);

  return env;
}
