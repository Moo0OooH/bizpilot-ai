/**
 * File: tests/unit/founder-admin-source.test.mts
 * Project: BizPilot AI
 * Description: Source-level guardrails for founder admin resilience.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("Founder admin source safety", () => {
  it("keeps optional audit/deletion panels from crashing the whole console", () => {
    const source = readFileSync("server/services/founder-admin.service.ts", "utf8");

    assert.equal(source.includes("founder_admin.action_log_unavailable"), true);
    assert.equal(
      source.includes("founder_admin.deletion_requests_unavailable"),
      true,
    );
    assert.equal(source.includes("listFounderDeletionRequests({ supabase }).catch"), true);
    assert.equal(source.includes("founder_admin.read_unavailable"), true);
    assert.equal(source.includes('readName: "auth_users"'), true);
    assert.equal(source.includes('readName: "profiles"'), true);
    assert.equal(source.includes("founder_admin.auth_rest_unavailable"), true);
    assert.equal(source.includes("buildFounderLinkedUsersPage"), true);
    assert.equal(source.includes("supabase.auth.admin.getUserById(userId)"), true);
  });

  it("keeps founder production health checks server-only and safe", () => {
    const source = readFileSync("server/services/production-health.service.ts", "utf8");
    const pageSource = readFileSync("app/admin/page.tsx", "utf8");

    assert.equal(source.includes('import "server-only"'), true);
    assert.equal(source.includes("assertFounderUser"), true);
    assert.equal(source.includes("SUPABASE_SERVICE_ROLE_KEY"), false);
    assert.equal(source.includes("qfqendrqimqvkoojpjao"), true);
    assert.equal(pageSource.includes("FounderProductionHealthPanel"), true);
    assert.equal(pageSource.includes("Production health"), true);
  });
});
