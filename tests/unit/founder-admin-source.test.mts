/**
 * ============================================================
 * File: tests/unit/founder-admin-source.test.mts
 * Project: BizPilot AI
 * Description: Source-level guardrails for founder admin resilience.
 * Role: Keeps founder-admin controls honest, gated, scannable, and safe from misleading automation or analytics claims.
 * Related:
 * - app/admin/page.tsx
 * - server/services/founder-admin.service.ts
 * - components/admin/founder-test-cleanup-form.tsx
 * Author: MoOoH
 * Created: 2026-05-26
 * Last Updated: 2026-07-11
 * Change Log:
 * - 2026-07-11: Updated founder-admin guards for centralized bilingual shell and handoff copy.
 * - 2026-07-04: Added founder-admin metric honesty guards against sent-reply and fake-conversion claims.
 * - 2026-07-05: Guarded professional account-safety copy for protected auth cleanup.
 * - 2026-07-05: Guarded founder user pagination panel persistence and page sizes.
 * ============================================================
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
    assert.equal(pageSource.includes('return "overview";'), true);
    assert.equal(pageSource.includes("copy.tabs.items.overview.label"), true);
    assert.equal(pageSource.includes("copy.tabs.items.users.label"), true);
    assert.equal(pageSource.includes("copy.tabs.items.businesses.label"), true);
    assert.equal(pageSource.indexOf("copy.tabs.items.users.label") < pageSource.indexOf("copy.tabs.items.businesses.label"), true);
    assert.equal(pageSource.includes('User directory'), true);
    assert.equal(pageSource.includes("Operating rule"), true);
    assert.equal(
      pageSource.indexOf("copy.users.searchLabel") <
        pageSource.indexOf("copy.users.workQueuesTitle"),
      true,
    );
    assert.equal(pageSource.includes("UserAccountSupportPanel"), true);
    assert.equal(pageSource.includes("UserAccountSafetyPanel"), true);
    assert.equal(pageSource.includes("FounderAuthUserDeleteForm"), true);
    assert.equal(pageSource.includes("founderPasswordResetAction"), true);
    assert.equal(pageSource.includes("founderTemporaryPasswordAction"), false);
    assert.equal(pageSource.includes("Emergency password locked"), true);
    assert.equal(pageSource.includes("Customer account deletion"), true);
    assert.equal(pageSource.includes("Blocked"), true);
    assert.equal(pageSource.includes("Needs owner-approved role policy"), true);
    assert.equal(pageSource.includes('name="adminPanel" type="hidden" value="users"'), true);
    assert.equal(pageSource.includes("adminUserPageSizeOptions"), true);
    assert.equal(pageSource.includes("copy.users.paginationLabel"), true);
    assert.equal(pageSource.includes('aria-current={active ? "page" : undefined}'), true);
    assert.equal(
      pageSource.includes("aria-disabled=\"true\""),
      false,
    );
    assert.equal(
      authDeleteSource.includes("productionWorkspaceReclassificationAcknowledgement"),
      false,
    );
    assert.equal(authDeleteSource.includes("if (deletionBlockedReason)"), true);
    assert.equal(
      authDeleteSource.includes("Production-linked login cannot be removed here."),
      true,
    );
    assert.equal(
      authDeleteSource.includes("Keep this account protected until the workspace is confirmed"),
      true,
    );
    assert.equal(authDeleteSource.includes("Login cleanup protection"), true);
    assert.equal(authDeleteSource.includes("dark:text-red-200"), false);

    const serviceSource = readFileSync(
      "server/services/founder-admin.service.ts",
      "utf8",
    );
    assert.equal(serviceSource.includes("return founderUserPageSizes.has(pageSize) ? pageSize : 10;"), true);
    assert.equal(serviceSource.includes("const founderUserPageSizes = new Set([10, 25, 50]);"), true);
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
      "copy.businesses.priorityWorkspace",
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
    assert.equal(pageSource.includes("function FounderUsersMiniList"), true);
    assert.equal(pageSource.includes("function FounderNewUsersNotice"), true);
    assert.equal(pageSource.includes("function FounderAdminNewsroom"), true);
    assert.equal(pageSource.includes("Latest founder/admin changes with actor"), true);
    assert.equal(pageSource.match(/<FounderAdminNewsroom/g)?.length, 1);
    assert.equal(pageSource.includes("By {actionActorLabel(latestAction, usersById)}"), true);
    assert.equal(pageSource.includes("xl:grid-cols-[minmax(300px,0.9fr)_minmax(320px,1fr)_minmax(320px,1fr)]"), true);
    assert.equal(pageSource.includes("const previewUsers = users.slice(0, 4);"), true);
    assert.equal(pageSource.includes("function actionActorLabel"), true);
    assert.equal(pageSource.includes("activityFilter?: string"), true);
    assert.equal(pageSource.includes("New users detected"), true);
    assert.equal(pageSource.includes("Review users"), true);
    assert.equal(pageSource.includes("FounderUsersMiniTable"), false);
    assert.equal(pageSource.includes("hidden overflow-x-auto sm:block"), false);
    assert.equal(pageSource.includes('className="mt-4 grid gap-2"'), true);
    assert.equal(pageSource.includes("(Search & Manage)"), false);

    assert.equal(founderHandoffSource.includes("founderCopy.surfaceMap.title"), true);
    assert.equal(founderHandoffSource.includes("founderCopy.safetyGates.title"), true);
    assert.equal(founderHandoffSource.includes("founderCopy.actions.openFounderAdmin"), true);
    assert.equal(founderHandoffSource.includes("dashboardCopy.pages.founder.title"), true);
    assert.equal(founderHandoffSource.includes("Phase 18B shell"), false);
  });

  it("keeps founder admin overview metrics honest before real pilot analytics", () => {
    const pageSource = readFileSync("app/admin/page.tsx", "utf8");

    for (const forbidden of [
      "AI Replies Sent",
      "AI Replied",
      "Average Reply Time",
      "Quote Link Sent Rate",
      "Setup Conversion Rate",
      "Leads This Month",
      "Last 7 days",
      'value={aiReplySignal > 0 ? "28m" : "N/A"}',
    ]) {
      assert.equal(
        pageSource.includes(forbidden),
        false,
        `Founder admin overview should not imply unsupported analytics: ${forbidden}`,
      );
    }

    for (const required of [
      "Reply Traces",
      "Response Time Tracking",
      "Not enabled",
      "Ready Quote Links",
      "Active Link Coverage",
      "Payment-Ready Workspaces",
      "Loaded Leads",
      "Current snapshot",
      "Activity log",
      "Leads or admin actions with reply-related status; no send is implied.",
    ]) {
      assert.equal(
        pageSource.includes(required),
        true,
        `Founder admin overview should keep honest metric label: ${required}`,
      );
    }
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
    assert.equal(pageSource.includes("copy.businesses.searchLabel"), true);
    assert.equal(pageSource.includes("copy.businesses.hiddenMatches(hiddenMatchCount)"), true);
    assert.equal(pageSource.includes("2xl:grid-cols-[minmax(360px,0.82fr)_minmax(0,1.18fr)]"), true);
    assert.equal(pageSource.includes("Save workspace kind"), false);
    assert.equal(pageSource.includes("Save session policy"), false);
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
      cleanupSource.includes("Dry run blocked for customer workspace"),
      true,
    );
  });
});
