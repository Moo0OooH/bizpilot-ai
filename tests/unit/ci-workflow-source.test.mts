/**
 * ============================================================
 * File: tests/unit/ci-workflow-source.test.mts
 * Project: BizPilot AI
 * Description: Source guards for the credential-free GitHub Actions workflow.
 * Role: Prevents CI from targeting managed Supabase or restoring obsolete debug workflows.
 * Related:
 * - .github/workflows/ci.yml
 * - package.json
 * Author: MoOoH
 * Created: 2026-07-12
 * Last Updated: 2026-07-12
 * Change Log:
 * - 2026-07-12: Added final CI isolation and verification-source guards.
 * ============================================================
 */

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";

const ciWorkflowPath = ".github/workflows/ci.yml";
const ciWorkflow = readFileSync(ciWorkflowPath, "utf8");

describe("GitHub Actions CI source contract", () => {
  it("uses stable action versions and the repository verification command", () => {
    for (const required of [
      "actions/checkout@v7",
      "pnpm/action-setup@v6",
      "actions/setup-node@v6",
      "pnpm install --frozen-lockfile",
      "pnpm verify",
    ]) {
      assert.equal(ciWorkflow.includes(required), true, `Missing ${required}.`);
    }
  });

  it("keeps CI placeholders local-only and free of deployment secrets", () => {
    for (const prohibited of [
      "qfqendrqimqvkoojpjao",
      ".supabase.co",
      "SUPABASE_SECRET_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
      "OPENAI_API_KEY",
      "VERCEL_ENV: production",
    ]) {
      assert.equal(
        ciWorkflow.includes(prohibited),
        false,
        `CI workflow must not contain ${prohibited}.`,
      );
    }

    assert.equal(
      ciWorkflow.includes("NEXT_PUBLIC_SUPABASE_URL: http://127.0.0.1:54321"),
      true,
    );
  });

  it("does not retain obsolete checkout diagnostic workflows", () => {
    assert.equal(existsSync(".github/workflows/checkout-debug.yml"), false);
    assert.equal(existsSync(".github/workflows/checkout-diagnostic.yml"), false);
  });
});
