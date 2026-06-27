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

  it("keeps confirmed unlinked workspace repair founder-only and logged", () => {
    const serviceSource = readFileSync(
      "server/services/founder-admin.service.ts",
      "utf8",
    );
    const actionSource = readFileSync(
      "server/actions/founder-admin.actions.ts",
      "utf8",
    );
    const pageSource = readFileSync("app/admin/page.tsx", "utf8");

    assert.equal(serviceSource.includes("repairFounderUserWorkspace"), true);
    assert.equal(serviceSource.includes("assertFounderUser(input.user)"), true);
    assert.equal(serviceSource.includes("recoverWorkspaceAccess"), true);
    assert.equal(
      serviceSource.includes("Target user already has a workspace or membership."),
      true,
    );
    assert.equal(
      serviceSource.includes("founder_admin.workspace_repair_completed"),
      true,
    );
    assert.equal(actionSource.includes("founderWorkspaceRepairAction"), true);
    assert.equal(
      actionSource.includes("workspaceRepairAcknowledgement"),
      true,
    );
    assert.equal(pageSource.includes("FounderWorkspaceRepairControls"), false);
    assert.equal(pageSource.includes("Recover owner workspace"), false);
    assert.equal(
      pageSource.includes(
        "Workspace repair remains a founder-admin action outside this read-only",
      ),
      true,
    );
    assert.equal(
      pageSource.includes("Requires owner-approved security gate."),
      true,
    );
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

  it("keeps founder user operations capability-gated", () => {
    const pageSource = readFileSync("app/admin/page.tsx", "utf8");
    const authDeleteSource = readFileSync(
      "components/admin/founder-auth-user-delete-form.tsx",
      "utf8",
    );

    assert.equal(pageSource.includes("FounderAdminCapabilityMatrix"), true);
    assert.equal(pageSource.includes("UserAccountSupportPanel"), true);
    assert.equal(pageSource.includes("UserDestructiveZone"), true);
    assert.equal(pageSource.includes("FounderAuthUserDeleteForm"), true);
    assert.equal(pageSource.includes("founderPasswordResetAction"), true);
    assert.equal(pageSource.includes("founderTemporaryPasswordAction"), false);
    assert.equal(pageSource.includes("Temporary password gated"), true);
    assert.equal(pageSource.includes("Production user delete"), true);
    assert.equal(pageSource.includes("Blocked"), true);
    assert.equal(
      authDeleteSource.includes("productionWorkspaceReclassificationAcknowledgement"),
      false,
    );
    assert.equal(
      authDeleteSource.includes("Production-linked users cannot be deleted from this UI."),
      true,
    );
  });

  it("keeps founder admin panels scannable and cleanup controls readable", () => {
    const pageSource = readFileSync("app/admin/page.tsx", "utf8");
    const cleanupSource = readFileSync(
      "components/admin/founder-test-cleanup-form.tsx",
      "utf8",
    );
    const founderHandoffSource = readFileSync(
      "app/(dashboard)/founder/page.tsx",
      "utf8",
    );

    for (const required of [
      "FounderHealthSection",
      "FounderActivitySection",
      "Production Health",
      "Admin Inbox",
      "Activity Log",
      "xl:top-[5.75rem]",
    ]) {
      assert.equal(
        pageSource.includes(required),
        true,
        `Founder admin page missing ${required}.`,
      );
    }

    assert.equal(cleanupSource.includes("disabledButtonClass"), true);
    assert.equal(cleanupSource.includes("var(--dash-danger-border)"), true);
    assert.equal(cleanupSource.includes("var(--dash-danger-strong)"), true);
    assert.equal(cleanupSource.includes("text-red-200"), false);
    assert.equal(cleanupSource.includes("rounded-[14px]"), false);
    assert.equal(pageSource.includes("function adminBusinessHref"), true);
    assert.equal(
      pageSource.includes("href={adminUsersHref(params, {\n                businessId: business.businessId"),
      false,
    );

    assert.equal(founderHandoffSource.includes("Founder Admin Handoff"), true);
    assert.equal(founderHandoffSource.includes("Admin surface map"), true);
    assert.equal(founderHandoffSource.includes("Safety gates"), true);
    assert.equal(founderHandoffSource.includes("Open Founder Admin"), true);
    assert.equal(founderHandoffSource.includes("Phase 18B shell"), false);
  });
});
