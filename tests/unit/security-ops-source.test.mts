/**
 * ============================================================
 * File: tests/unit/security-ops-source.test.mts
 * Project: BizPilot AI
 * Description: Source-level guardrails for security operations readiness.
 * Role: Keeps abuse retention, CSP, registers, runtime, and credential hygiene documented.
 * Related:
 * - supabase/migrations/0023_public_submission_abuse_log_retention.sql
 * - docs/security/BIZPILOT_SECURITY_OPERATIONS_REGISTER_2026-07-04.md
 * - docs/project-v2/MASTER_PHASE_AND_FINALIZATION_PLAN_2026-07-15.md
 * Author: MoOoH
 * Created: 2026-07-04
 * Last Updated: 2026-07-15
 * Change Log:
 * - 2026-07-15: Replaced Phase 25 report guards with current register and master-gate guards.
 * - 2026-07-04: Added Phase 25O security/runtime operations guards.
 * - 2026-07-04: Synced migration index guard after Supabase readiness hardening migration.
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
  const masterPlan = source(
    "docs/project-v2/MASTER_PHASE_AND_FINALIZATION_PLAN_2026-07-15.md",
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
    assert.equal(migrationIndex.includes("currently `0024`"), true);
  });

  it("keeps RLS coverage for abuse retention cleanup without running production DB", () => {
    for (const required of [
      "T7: abuse-log retention cleanup grants are service-role-only",
      "direct execution attempt",
      "anon/authenticated denial",
      "Do not execute the retention helper in this RLS suite",
      "has_function_privilege('service_role'",
      "service_role must have EXECUTE on delete_old_public_submission_abuse_logs",
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

  it("records official security references and preserves current external gates", () => {
    for (const required of [
      "https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html",
      "https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html",
      "https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html",
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy",
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy-Report-Only",
      "https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html",
      "does not authorize anyone to run migrations against Production",
      "print or rotate secrets",
      "RLS suite remains `GATED`",
    ]) {
      assert.equal(register.includes(required), true, `Missing ${required}.`);
    }

    for (const required of [
      "Tenant isolation, RLS, schema, backup, restore",
      "Read-only drift map",
      "Synthetic writes run only against a classifier-approved local/disposable target",
      "Production is read-only unless an exact separately approved change plan",
      "Real customer data",
      "NOT APPROVED",
      "Paid pilot",
    ]) {
      assert.equal(masterPlan.includes(required), true, `Missing ${required}.`);
    }
  });
});
