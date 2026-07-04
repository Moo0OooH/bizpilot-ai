/**
 * ============================================================
 * File: tests/unit/dashboard-smoke-fixture-source.test.mts
 * Project: BizPilot AI
 * Description: Source guards for dashboard smoke fixture profiles.
 * Role: Keeps data-rich dashboard QA synthetic-only and production-prohibited.
 * Related:
 * - tests/smoke/dashboard-auth-smoke.mts
 * - docs/readiness/PHASE_25D_DASHBOARD_DATA_RICH_QA_FIXTURE_2026-07-04.md
 * Author: MoOoH
 * Created: 2026-07-04
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const smokeSource = readFileSync("tests/smoke/dashboard-auth-smoke.mts", "utf8");

test("dashboard smoke keeps basic and dense synthetic fixture profiles", () => {
  assert.equal(
    smokeSource.includes('type DashboardFixtureProfile = "basic" | "dense"'),
    true,
  );
  assert.equal(smokeSource.includes("resolveFixtureProfile"), true);
  assert.equal(
    smokeSource.includes("BIZPILOT_DASHBOARD_SMOKE_FIXTURE_PROFILE"),
    true,
  );
  assert.equal(smokeSource.includes("--fixture-profile=dense"), true);
  assert.equal(smokeSource.includes("createDenseLeadScenarios"), true);
  assert.equal(smokeSource.includes("createSyntheticLead"), true);
});

test("dense dashboard smoke covers realistic source and workflow variety", () => {
  for (const required of [
    "google_business_profile",
    "email_signature",
    "saved_reply",
    "Outside Region - Hamilton",
    "synthetic.long.customer+move-out-and-post-renovation-dashboard-fixture@example.test",
    'manualOutcome: "booked"',
    'responseSlaState: "reply_copied"',
    'status: "booked"',
  ]) {
    assert.equal(
      smokeSource.includes(required),
      true,
      `dashboard dense fixture should include ${required}`,
    );
  }
});

test("dashboard smoke remains production-prohibited for synthetic writes", () => {
  for (const required of [
    "assertDashboardSmokeSafeInput",
    "VERCEL_ENV=production",
    "NEXT_PUBLIC_APP_URL includes bizpilo.com",
    "qfqendrqimqvkoojpjao",
    "target smoke base URL is bizpilo.com",
    "Synthetic data only.",
  ]) {
    assert.equal(
      smokeSource.includes(required),
      true,
      `dashboard smoke safety source should include ${required}`,
    );
  }
});
