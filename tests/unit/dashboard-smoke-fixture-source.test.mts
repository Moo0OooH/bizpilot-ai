/**
 * ============================================================
 * File: tests/unit/dashboard-smoke-fixture-source.test.mts
 * Project: BizPilot AI
 * Description: Source guards for dashboard smoke fixture profiles.
 * Role: Keeps data-rich dashboard QA synthetic-only and production-prohibited.
 * Related:
 * - tests/smoke/dashboard-auth-smoke.mts
 * - docs/project-v2/BILINGUAL_ROUTE_AND_FLOW_AUDIT_2026-07-15.md
 * Author: MoOoH
 * Created: 2026-07-04
 * Last Updated: 2026-07-17
 * Change Log:
 * - 2026-07-17: Guarded Reports route coverage and the RSC serialization failure marker.
 * - 2026-07-15: Repointed fixture coverage to the current bilingual workflow audit.
 * - 2026-07-04: Added source guards for opt-in founder/admin dashboard smoke coverage.
 * - 2026-07-04: Guarded owner operating guide route smoke coverage.
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

test("dashboard smoke remains local-only and production-prohibited for synthetic writes", () => {
  for (const required of [
    "assertDashboardSmokeSafeInput",
    "localSupabaseHost",
    "isLocalSupabaseHost",
    'host === "localhost"',
    'host === "127.0.0.1"',
    'host === "[::1]"',
    'host === "host.docker.internal"',
    "VERCEL_ENV=production",
    "NEXT_PUBLIC_APP_URL includes bizpilo.com",
    "NEXT_PUBLIC_SUPABASE_URL is managed/non-local",
    "qfqendrqimqvkoojpjao",
    "target smoke base URL is bizpilo.com",
    "dashboard-auth-smoke is local-only for synthetic data creation",
    "Point NEXT_PUBLIC_SUPABASE_URL at a local Supabase target",
    "Synthetic data only.",
  ]) {
    assert.equal(
      smokeSource.includes(required),
      true,
      `dashboard smoke safety source should include ${required}`,
    );
  }
});

test("dashboard smoke can opt into founder admin routes only with synthetic founder email gating", () => {
  for (const required of [
    "founderAdminTargets",
    'path: "/founder"',
    'path: "/admin?adminPanel=overview"',
    'path: "/admin?adminPanel=users"',
    'path: "/admin?adminPanel=businesses"',
    'path: "/admin?adminPanel=leads"',
    'path: "/admin?adminPanel=health"',
    'path: "/admin?adminPanel=activity"',
    'resolveBooleanCliEnv("include-admin")',
    "BIZPILOT_DASHBOARD_SMOKE_INCLUDE_ADMIN",
    "resolveSyntheticSmokeEmail",
    "dashboard-smoke-email",
    "@example.test",
    "assertFounderSmokeConfigured",
    "BIZPILOT_FOUNDER_EMAILS",
    "Admin route smoke requires BIZPILOT_FOUNDER_EMAILS",
    "...(includeAdmin ? founderAdminTargets : [])",
  ]) {
    assert.equal(
      smokeSource.includes(required),
      true,
      `dashboard admin smoke source should include ${required}`,
    );
  }
});

test("dashboard smoke includes optional owner routes and catches RSC serialization failures", () => {
  for (const required of [
    'path: "/dashboard/reports"',
    'path: "/dashboard/guide"',
    "Functions cannot be passed directly to Client Components",
  ]) {
    assert.equal(
      smokeSource.includes(required),
      true,
      `dashboard smoke should include ${required}`,
    );
  }
});
