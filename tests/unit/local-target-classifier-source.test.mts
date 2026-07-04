/**
 * ============================================================
 * File: tests/unit/local-target-classifier-source.test.mts
 * Project: BizPilot AI
 * Description: Source guards for local-only target classification scripts.
 * Role: Keeps dashboard smoke and RLS gate helpers from weakening production/non-local protections.
 * Related:
 * - scripts/check-local-targets.mts
 * - tests/rls/run-rls-tests.mts
 * - tests/smoke/dashboard-auth-smoke.mts
 * Author: MoOoH
 * Created: 2026-07-04
 * Last Updated: 2026-07-04
 * Change Log:
 * - 2026-07-04: Added source guards for no-secret local target classification and env-file RLS loading.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("local target classifier source guards", () => {
  it("keeps package scripts for no-secret target checks", () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
      scripts: Record<string, string>;
    };

    assert.equal(
      packageJson.scripts["check:targets"],
      "node --experimental-strip-types scripts/check-local-targets.mts",
    );
    assert.equal(
      packageJson.scripts["check:dashboard-local"],
      "node --experimental-strip-types scripts/check-local-targets.mts --require-dashboard-local",
    );
    assert.equal(
      packageJson.scripts["check:db-local"],
      "node --experimental-strip-types scripts/check-local-targets.mts --require-db-local",
    );
  });

  it("keeps managed Supabase and canonical production project blocked", () => {
    const classifierSource = readFileSync("scripts/check-local-targets.mts", "utf8");

    assert.equal(classifierSource.includes("qfqendrqimqvkoojpjao"), true);
    assert.equal(classifierSource.includes(".supabase.co"), true);
    assert.equal(classifierSource.includes(".supabase.in"), true);
    assert.equal(classifierSource.includes("--require-dashboard-local"), true);
    assert.equal(classifierSource.includes("--require-db-local"), true);
    assert.equal(classifierSource.includes("VERCEL_ENV=production"), true);
    assert.equal(classifierSource.includes("SUPABASE_SECRET_KEY"), false);
    assert.equal(classifierSource.includes("SUPABASE_SERVICE_ROLE_KEY"), false);
  });

  it("lets RLS tests load local env files while preserving local-only refusal", () => {
    const rlsRunnerSource = readFileSync("tests/rls/run-rls-tests.mts", "utf8");

    assert.equal(rlsRunnerSource.includes('for (const file of [".env.local", ".env"])'), true);
    assert.equal(rlsRunnerSource.includes("readDatabaseUrl(fileValues)"), true);
    assert.equal(rlsRunnerSource.includes("Refusing to run RLS tests against non-local host"), true);
    assert.equal(rlsRunnerSource.includes("Refusing to run RLS tests against a managed Supabase project URL"), true);
    assert.equal(rlsRunnerSource.includes('databaseUrl.replace(/:[^:@/]+@/, ":***@")'), true);
  });
});
