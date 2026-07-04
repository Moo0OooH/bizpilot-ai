/**
 * ============================================================
 * File: tests/unit/supabase-database-readiness-source.test.mts
 * Project: BizPilot AI
 * Description: Source guards for Supabase database readiness and RLS hardening.
 * Role: Keeps Supabase status-aware operations, migration-first database changes, and RLS performance posture from regressing.
 * Related:
 * - supabase/migrations/0024_supabase_status_and_rls_performance_hardening.sql
 * - supabase/migrations/README.md
 * - package.json
 * Author: MoOoH
 * Created: 2026-07-04
 * Last Updated: 2026-07-04
 * Change Log:
 * - 2026-07-04: Created source guards for Supabase status-aware database readiness.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("Supabase database readiness source guards", () => {
  it("keeps the consolidated Supabase audit command available", () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
      scripts: Record<string, string>;
    };

    assert.equal(
      packageJson.scripts["audit:supabase"],
      "pnpm check:targets && node --experimental-strip-types scripts/supabase-explicit-grant-audit.mts",
    );
  });

  it("keeps the latest Supabase migration non-destructive and RLS-performance aligned", () => {
    const migration = readFileSync(
      "supabase/migrations/0024_supabase_status_and_rls_performance_hardening.sql",
      "utf8",
    );

    assert.equal(migration.includes("(select auth.uid())"), true);
    assert.equal(
      migration.includes("business_members_business_user_status_role_idx"),
      true,
    );
    assert.equal(
      migration.includes("public_link_variants_business_active_idx"),
      true,
    );
    assert.equal(
      migration.includes("intake_form_fields_form_business_hidden_idx"),
      true,
    );
    assert.equal(migration.includes("create or replace function public.is_business_member"), true);
    assert.equal(migration.includes("create policy \"profiles_select_own\""), true);
    assert.equal(migration.includes("delete from "), false);
    assert.equal(migration.includes("truncate "), false);
    assert.equal(migration.includes("drop table"), false);
  });

  it("documents the Supabase status gate before remote database operations", () => {
    const readme = readFileSync("supabase/migrations/README.md", "utf8");

    assert.equal(readme.includes("0024_supabase_status_and_rls_performance_hardening.sql"), true);
    assert.equal(readme.includes("Supabase operational status gate"), true);
    assert.equal(readme.includes("17.6.1.121"), true);
    assert.equal(readme.includes("Do not restart, resize, restore, branch, or upgrade"), true);
    assert.equal(readme.includes("exact target confirmation"), true);
  });
});
