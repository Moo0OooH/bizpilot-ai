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
    assert.equal(pageSource.includes('return "users";'), true);
    assert.equal(pageSource.includes('label: "Users", panel: "users"'), true);
    assert.equal(pageSource.includes('label: "Businesses", panel: "businesses"'), true);
    assert.equal(pageSource.indexOf('label: "Users", panel: "users"') < pageSource.indexOf('label: "Businesses", panel: "businesses"'), true);
    assert.equal(pageSource.includes('User directory'), true);
    assert.equal(pageSource.includes("Operating rule"), true);
    assert.equal(pageSource.indexOf("Search users") < pageSource.indexOf("Work queues"), true);
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

    const serviceSource = readFileSync(
      "server/services/founder-admin.service.ts",
      "utf8",
    );
    assert.equal(serviceSource.includes("return founderUserPageSizes.has(pageSize) ? pageSize : 10;"), true);
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
      "Priority workspace",
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

  it("keeps founder business detail search-driven and cleanup secondary", () => {
    const pageSource = readFileSync("app/admin/page.tsx", "utf8");
    const cleanupSource = readFileSync(
      "components/admin/founder-test-cleanup-form.tsx",
      "utf8",
    );
    const businessSection = pageSource.slice(
      pageSource.indexOf("function FounderBusinessesSection"),
    );
    const businessDetail = pageSource.slice(
      pageSource.indexOf("function BusinessControlCard"),
    );
    const tileSection = businessDetail.slice(
      businessDetail.indexOf('label="Access status"'),
      businessDetail.indexOf("<section className={toolboxSectionClass}>"),
    );

    assert.equal(pageSource.includes("businessQuery?: string"), true);
    assert.equal(pageSource.includes("function matchesBusinessQuery"), true);
    assert.equal(pageSource.includes("function limitedBusinessRows"), true);
    assert.equal(
      pageSource.includes("const selectedRows = selectedBusiness ? [selectedBusiness] : [];"),
      true,
    );
    assert.equal(pageSource.includes("].slice(0, 10);"), true);
    assert.equal(pageSource.includes("Search businesses"), true);
    assert.equal(pageSource.includes("Showing the first 10 matched workspaces"), true);
    assert.equal(
      pageSource.indexOf("Search businesses") < pageSource.indexOf("visibleBusinesses.map"),
      true,
    );
    assert.equal(
      businessSection.indexOf("Priority workspace") <
        businessSection.indexOf("<MetricCard"),
      true,
    );
    assert.equal(
      tileSection.indexOf('label="Access status"') <
        tileSection.indexOf('label="Quote link"'),
      true,
    );
    assert.equal(
      tileSection.indexOf('label="Quote link"') <
        tileSection.indexOf('label="Plan"'),
      true,
    );
    assert.equal(
      tileSection.indexOf('label="Plan"') <
        tileSection.indexOf('label="Session policy"'),
      true,
    );
    assert.equal(
      tileSection.indexOf('label="Session policy"') <
        tileSection.indexOf('label="Audit events"'),
      true,
    );
    assert.equal(
      businessDetail.indexOf("Business snapshot") <
        businessDetail.indexOf("FounderTestCleanupForm"),
      true,
    );
    assert.equal(cleanupSource.includes("<details className="), true);
    assert.equal(cleanupSource.includes("<details open"), false);
    assert.equal(
      cleanupSource.indexOf("Dry run cleanup") <
        cleanupSource.indexOf("Hard purge test workspace"),
      true,
    );
    assert.equal(
      cleanupSource.includes("Dry run blocked for production"),
      true,
    );
  });
});
