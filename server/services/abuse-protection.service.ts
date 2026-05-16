/**
 * ============================================================
 * File: server/services/abuse-protection.service.ts
 * Project: BizPilot AI
 * Description: Phase 13 abuse-protection helpers for the public quote submission path.
 * Role: Provides IP hashing, abuse-attempt logging, and a per-(business, ip) rate limiter
 *       that delegates counting to the Postgres security-definer helper.
 * Related:
 * - supabase/migrations/0013_public_submission_abuse_log.sql
 * - server/services/public-intake.service.ts
 * - server/actions/public-intake.actions.ts
 * - lib/env/server-env.ts
 * Author: MoOoH
 * Created: 2026-05-15
 * Last Updated: 2026-05-15
 * Change Log:
 * - 2026-05-15: Created the abuse-protection service. Server-only by design.
 * ============================================================
 */

import "server-only";

import { createHash } from "node:crypto";

import { getServerEnv } from "@/lib/env/server-env";
import type { Database } from "@/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";

export type AbuseAttemptReason =
  | "submission_completed"
  | "rate_limit_exceeded"
  | "honeypot_triggered"
  | "consent_missing"
  | "invalid_form"
  | "invalid_field";

export type RateLimitExceededError = Error & { readonly safeReason: "rate_limit_exceeded" };

export const RATE_LIMIT_EXCEEDED_MESSAGE =
  "Too many requests. Please wait a few minutes and try again.";

export const DEFAULT_RATE_LIMIT_MAX_ATTEMPTS = 10;
export const DEFAULT_RATE_LIMIT_WINDOW_MINUTES = 60;

const DEFAULT_SALT_FALLBACK = "bizpilot-default-ip-salt-v1";

function getIpHashSalt(): string {
  const env = getServerEnv();
  return env.NEXT_PUBLIC_APP_URL || DEFAULT_SALT_FALLBACK;
}

export function hashClientIp(rawIp: string | null | undefined): string {
  const safeIp = (rawIp ?? "").trim() || "unknown";
  const salt = getIpHashSalt();
  return createHash("sha256").update(`${salt}:${safeIp}`).digest("hex");
}

export async function recordPublicSubmissionAttempt(input: {
  businessId: string;
  intakeFormId: string | null;
  ipHash: string;
  reason: AbuseAttemptReason;
  supabase: SupabaseClient<Database>;
}): Promise<void> {
  // Best-effort logging. We never want abuse-protection logging to break a
  // legitimate submission, so we swallow the result rather than throwing.
  const { error } = await input.supabase.rpc("record_public_submission_attempt", {
    target_business_id: input.businessId,
    target_intake_form_id: input.intakeFormId,
    target_ip_hash: input.ipHash,
    target_reason: input.reason,
  });

  if (error) {
    // Intentional swallow. Phase 13.1 may add server-side safe logging here.
    return;
  }
}

export async function enforceSubmissionRateLimit(input: {
  businessId: string;
  ipHash: string;
  maxAttempts?: number;
  supabase: SupabaseClient<Database>;
  windowMinutes?: number;
}): Promise<void> {
  const maxAttempts = input.maxAttempts ?? DEFAULT_RATE_LIMIT_MAX_ATTEMPTS;
  const windowMinutes = input.windowMinutes ?? DEFAULT_RATE_LIMIT_WINDOW_MINUTES;

  const { data, error } = await input.supabase.rpc(
    "count_recent_public_submission_attempts",
    {
      target_business_id: input.businessId,
      target_ip_hash: input.ipHash,
      target_window_minutes: windowMinutes,
    },
  );

  if (error) {
    // Fail open on counting errors. The legitimate flow must not break because
    // of a transient infrastructure problem in the rate-limit helper.
    return;
  }

  const recentCount = typeof data === "number" ? data : 0;

  if (recentCount >= maxAttempts) {
    throw new Error(RATE_LIMIT_EXCEEDED_MESSAGE);
  }
}
