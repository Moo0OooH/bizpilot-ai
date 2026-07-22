/**
 * ============================================================
 * File: tests/unit/supabase-explicit-grant-audit.test.mts
 * Project: BizPilot AI
 * Description: Regression tests for the static Supabase explicit-grant audit parser.
 * Role: Ensures quoted and standard unquoted CREATE POLICY identifiers are both audited without bypassing grant enforcement.
 * Related:
 * - scripts/supabase-explicit-grant-audit.mts
 * - tests/unit/supabase-database-readiness-source.test.mts
 * - package.json
 * Author: MoOoH
 * Created: 2026-07-21
 * Last Updated: 2026-07-21
 * Change Log:
 * - 2026-07-21: Added isolated no-database regression coverage for quoted and unquoted policy identifiers.
 * ============================================================
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, it } from "node:test";

const auditScript = resolve("scripts/supabase-explicit-grant-audit.mts");

function runAuditFixture(sql: string) {
  const fixtureRoot = mkdtempSync(join(tmpdir(), "bizpilot-supabase-audit-"));
  const migrationDir = join(fixtureRoot, "supabase", "migrations");
  mkdirSync(migrationDir, { recursive: true });
  writeFileSync(join(migrationDir, "0001_policy-fixture.sql"), sql, "utf8");

  try {
    return spawnSync(
      process.execPath,
      ["--experimental-strip-types", auditScript],
      {
        cwd: fixtureRoot,
        encoding: "utf8",
      },
    );
  } finally {
    rmSync(fixtureRoot, { force: true, recursive: true });
  }
}

describe("Supabase explicit-grant audit policy parsing", () => {
  it("accepts matching grants for quoted and unquoted policy names", () => {
    const result = runAuditFixture(`
      create table public.quoted_policy_target (id uuid);
      alter table public.quoted_policy_target enable row level security;
      create policy "quoted policy name" on public.quoted_policy_target for select to authenticated using (true);
      grant select on public.quoted_policy_target to authenticated;

      create table public.unquoted_policy_target (id uuid);
      alter table public.unquoted_policy_target enable row level security;
      create policy unquoted_policy_name on public.unquoted_policy_target for select to authenticated using (true);
      grant select on public.unquoted_policy_target to authenticated;
    `);

    assert.equal(result.error, undefined);
    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.match(result.stdout, /quoted_policy_target/);
    assert.match(result.stdout, /unquoted_policy_target/);
    assert.match(result.stdout, /Result: PASS \(explicit grant \+ RLS posture check\)/);
  });

  it("still blocks an unquoted policy whose required table grant is absent", () => {
    const result = runAuditFixture(`
      create table public.unquoted_policy_without_grant (id uuid);
      alter table public.unquoted_policy_without_grant enable row level security;
      create policy unquoted_policy_without_grant on public.unquoted_policy_without_grant for select to authenticated using (true);
    `);

    assert.equal(result.error, undefined);
    assert.equal(result.status, 1, result.stderr || result.stdout);
    assert.match(
      result.stdout,
      /unquoted_policy_without_grant: authenticated policy requires S but authenticated table grant is missing/,
    );
  });
});
