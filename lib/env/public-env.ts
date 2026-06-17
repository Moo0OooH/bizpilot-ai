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
 * Last Updated: 2026-06-17
 * Change Log:
 * - 2026-05-04: Created public env validation helper and added standard header.
 * - 2026-05-04: Added URL format validation for public environment values.
 * - 2026-06-17: Prefer Supabase publishable keys while keeping legacy anon-key fallback.
 * ============================================================
 */

type PublicEnv = {
  NEXT_PUBLIC_APP_URL: string;
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
  SUPABASE_PUBLIC_API_KEY: string;
};

const requiredPublicEnvKeys = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
] as const;

const supabasePublicKeyEnvKeys = [
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

type PublicEnvKey =
  | (typeof requiredPublicEnvKeys)[number]
  | (typeof supabasePublicKeyEnvKeys)[number];

function readPublicEnvValue(key: PublicEnvKey): string | undefined {
  const value = process.env[key];
  return value && value.trim().length > 0 ? value : undefined;
}

function assertValidUrl(key: PublicEnvKey, value: string): void {
  try {
    new URL(value);
  } catch {
    throw new Error(`Invalid URL in public environment variable: ${key}`);
  }
}

export function getPublicEnv(): PublicEnv {
  const missing = requiredPublicEnvKeys.filter((key) => !readPublicEnvValue(key));
  const publishableKey = readPublicEnvValue(supabasePublicKeyEnvKeys[0]);
  const legacyAnonKey = readPublicEnvValue(supabasePublicKeyEnvKeys[1]);
  const supabasePublicApiKey = publishableKey ?? legacyAnonKey;

  if (missing.length > 0) {
    throw new Error(`Missing public environment variables: ${missing.join(", ")}`);
  }

  if (!supabasePublicApiKey) {
    throw new Error(
      "Missing public environment variables: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or legacy NEXT_PUBLIC_SUPABASE_ANON_KEY)",
    );
  }

  const env = {
    NEXT_PUBLIC_APP_URL: readPublicEnvValue("NEXT_PUBLIC_APP_URL")!,
    NEXT_PUBLIC_SUPABASE_URL: readPublicEnvValue("NEXT_PUBLIC_SUPABASE_URL")!,
    ...(publishableKey
      ? { NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: publishableKey }
      : {}),
    ...(legacyAnonKey ? { NEXT_PUBLIC_SUPABASE_ANON_KEY: legacyAnonKey } : {}),
    SUPABASE_PUBLIC_API_KEY: supabasePublicApiKey,
  };

  assertValidUrl("NEXT_PUBLIC_APP_URL", env.NEXT_PUBLIC_APP_URL);
  assertValidUrl("NEXT_PUBLIC_SUPABASE_URL", env.NEXT_PUBLIC_SUPABASE_URL);

  return env;
}
