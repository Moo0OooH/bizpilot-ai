/**
 * ============================================================
 * File: tests/unit/security-ops-source.test.mts
 * Project: BizPilot AI
 * Description: Source-level guardrails for security operations readiness.
 * Role: Keeps abuse retention, CSP, registers, runtime, and credential hygiene documented.
 * Related:
 * - supabase/migrations/0023_public_submission_abuse_log_retention.sql
 * - docs/security/BIZPILOT_SECURITY_OPERATIONS_REGISTER_2026-07-04.md
 * - docs/readiness/PHASE_25O_SECURITY_RUNTIME_OPS_2026-07-04.md
 * Author: MoOoH
 * Created: 2026-07-04
 * Last Updated: 2026-07-04
 * Change Log:
 * - 2026-07-04: Added Phase 25O security/runtime operations guards.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function source(path: string): string {
  return readFileSync(path, "utf8");
}

describe("security and runtime operations source contracts", () => {
  const migration = source(
    "supabase/migrations/0023_public_submission_abuse_log_retention.sql",
  );
  const migrationIndex = source("supabase/migrations/README.md");
  const rlsTest = source("tests/rls/public-submission-abuse-log.test.sql");
  const register = source(
    "docs/security/BIZPILOT_SECURITY_OPERATIONS_REGISTER_2026-07-04.md",
  );
  const phase25o = source(
    "docs/readiness/PHASE_25O_SECURITY_RUNTIME_OPS_2026-07-04.md",
  );
  const backlog = source(
    "docs/readiness/PHASE_25_SITE_DASHBOARD_GROWTH_BACKLOG_2026-07-04.md",
  );
  const nextConfig = source("next.config.ts");
  const packageJson = source("package.json");
  const abuseService = source("server/services/abuse-protection.service.ts");

  it("keeps IP hash salt production-safe and retention cleanup service-role-only", () => {
    for (const required of [
      "BIZPILOT_IP_HASH_SALT is required in production.",
      "DEFAULT_SALT_FALLBACK",
      "process.env.NODE_ENV",
      "process.env.VERCEL_ENV",
    ]) {
      assert.equal(abuseService.includes(required), true, `Missing ${required}.`);
    }

    for (const required of [
      "delete_old_public_submission_abuse_logs",
      "retention_days integer default 90",
      "retention_days < 7 or retention_days > 365",
      "delete from public.public_submission_abuse_log",
      "revoke all on function public.delete_old_public_submission_abuse_logs(integer) from anon",
      "revoke all on function public.delete_old_public_submission_abuse_logs(integer) from authenticated",
      "grant execute on function public.delete_old_public_submission_abuse_logs(integer)",
      "to service_role",
    ]) {
      assert.equal(migration.includes(required), true, `Missing ${required}.`);
    }

    assert.equal(
      migrationIndex.includes("0023_public_submission_abuse_log_retention.sql"),
      true,
    );
    assert.equal(migrationIndex.includes("currently `0023`"), true);
  });

  it("keeps RLS coverage for abuse retention cleanup without running production DB", () => {
    for (const required of [
      "T7: abuse-log retention cleanup is service-role-only",
      "set local role anon",
      "anon must not execute delete_old_public_submission_abuse_logs",
      "set local role service_role",
      "service_role cleanup should delete exactly 1 old abuse row",
      "old abuse row should be removed",
    ]) {
      assert.equal(rlsTest.includes(required), true, `Missing ${required}.`);
    }
  });

  it("keeps security operations registers header-only and secret-free", () => {
    for (const required of [
      "Privacy Request Register",
      "Privacy Incident Register",
      "Credential Rotation Register",
      "CSP And Security Header Register",
      "Do not add real customer personal data",
      "Do not paste customer messages",
      "Do not add third-party analytics",
      "old_credential_disabled",
      "owner_confirmed",
      "Content-Security-Policy-Report-Only",
    ]) {
      assert.equal(register.includes(required), true, `Missing ${required}.`);
    }
  });

  it("keeps CSP/security headers and runtime posture source-backed", () => {
    for (const required of [
      "Content-Security-Policy",
      "frame-ancestors 'none'",
      "X-Frame-Options",
      "DENY",
      "X-Content-Type-Options",
      "nosniff",
      "Referrer-Policy",
      "Permissions-Policy",
      "payment=()",
    ]) {
      assert.equal(nextConfig.includes(required), true, `Missing ${required}.`);
    }

    for (const required of [
      "\"packageManager\": \"pnpm@10.18.3\"",
      "\"node\": \">=24 <25\"",
      "\"next\": \"16.2.4\"",
      "\"react\": \"19.2.4\"",
    ]) {
      assert.equal(packageJson.includes(required), true, `Missing ${required}.`);
    }
  });

  it("records official source-backed Phase 25O evidence and preserved gates", () => {
    for (const required of [
      "https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html",
      "https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html",
      "https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html",
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy",
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy-Report-Only",
      "https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html",
      "does not",
      "run migrations against production",
      "print or rotate secrets",
      "pnpm test:rls NOT RUN - requires local DATABASE_URL target",
    ]) {
      assert.equal(phase25o.includes(required), true, `Missing ${required}.`);
    }

    for (const required of [
      "Progress Addendum - Phase 25O",
      "85 done",
      "86 done with migration-ready cleanup helper",
      "87 done as header-only privacy request and incident registers",
      "88 done as CSP/report-only hardening plan",
      "91 done",
      "92 done as credential rotation register and owner-action flow",
      "100 preserved",
    ]) {
      assert.equal(backlog.includes(required), true, `Missing ${required}.`);
    }
  });
});
