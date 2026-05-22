/**
 * ============================================================
 * File: lib/env/server-env.ts
 * Project: BizPilot AI
 * Description: Validates server-only environment variables for future server workflows.
 * Role: Extends public env validation with optional server-side integration keys.
 * Related:
 * - lib/env/public-env.ts
 * - lib/supabase/server.ts
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-13
 * Change Log:
 * - 2026-05-04: Created server env validation helper and added standard header.
 * - 2026-05-04: Added explicit server-only env boundary notes for Phase 1.
 * - 2026-05-13: Enforced the server-only runtime boundary for private env reads.
 * ============================================================
 */

import "server-only";

import { getPublicEnv } from "@/lib/env/public-env";

type ServerEnv = ReturnType<typeof getPublicEnv> & {
  SUPABASE_SERVICE_ROLE_KEY?: string;
  OPENAI_API_KEY?: string;
  RESEND_API_KEY?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  BIZPILOT_FOUNDER_EMAILS?: string;
};

const optionalServerEnvKeys = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "OPENAI_API_KEY",
  "RESEND_API_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "BIZPILOT_FOUNDER_EMAILS",
] as const;

// Server-only values must never be imported by client components.
function readServerEnvValue(
  key: (typeof optionalServerEnvKeys)[number],
): string | undefined {
  const value = process.env[key];
  return value && value.trim().length > 0 ? value : undefined;
}

export function getServerEnv(): ServerEnv {
  const env: ServerEnv = {
    ...getPublicEnv(),
  };

  for (const key of optionalServerEnvKeys) {
    const value = readServerEnvValue(key);
    if (value) {
      env[key] = value;
    }
  }

  return env;
}
