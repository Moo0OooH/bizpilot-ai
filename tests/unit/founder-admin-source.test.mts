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
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Guarded progressive Business Operations disclosures and protected-route navigation hardening.
 * - 2026-07-14: Updated overview guards for localized compact metrics and direct founder-to-admin routing.
 * - 2026-07-11: Added guards for localized founder inbox, safety rail, and admin activity metadata hooks.
 * - 2026-07-11: Replaced stale admin panel literal guard with localized topbar copy guard.
 * - 2026-07-11: Guarded founder health, activity, and user-directory localization hooks.
 * - 2026-07-11: Updated founder user-operations guards for localized overview and support panels.
 * - 2026-07-11: Updated business-detail guards for localized admin tile labels.
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
        "workspaceDetailCopy.repairNotice",
      ),
      true,
    );
    assert.equal(
      pageSource.includes("lockedAccessCopy.description"),
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
    assert.equal(pageSource.includes("copy.overview.productionHealthPanel"), true);
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
    assert.equal(pageSource.includes("directoryCopy.title"), true);
    assert.equal(pageSource.includes("directoryCopy.description"), true);
    assert.equal(pageSource.includes("overviewCopy.operatingRule.title"), true);
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
    assert.equal(pageSource.includes("accountSupportCopy.emergencyLocked"), true);
    assert.equal(
      pageSource.includes("capabilityCopy.items.customerAccountDeletion.label"),
      true,
    );
    assert.equal(pageSource.includes("lockedAccessCopy.blocked"), true);
    assert.equal(
      pageSource.includes("lockedAccessCopy.items.changeRole"),
      true,
    );
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
      "FounderAdminOverviewSection",
      "FounderAdminNewsroom",
      "copy.overview.activityMeta",
      "copy.overview.leadInboxSection",
      "copy.overview.healthSection",
      "copy.overview.productionHealthPanel",
      "copy.businesses.detail.safetyRail",
      "copy.topbar.panelTitles.leads",
      "directoryCopy.title",
      "copy.businesses.priorityWorkspace",
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
    assert.equal(pageSource.includes("function FounderUsersMiniList"), false);
    assert.equal(pageSource.includes("function FounderNewUsersNotice"), false);
    assert.equal(pageSource.includes("function FounderLeadsStatusDonut"), false);
    assert.equal(pageSource.match(/<FounderAdminNewsroom/g)?.length, 1);
    assert.equal(pageSource.includes("function actionActorLabel"), true);
    assert.equal(pageSource.includes("activityFilter?: string"), true);
    assert.equal(pageSource.includes("FounderUsersMiniTable"), false);
    assert.equal(pageSource.includes("hidden overflow-x-auto sm:block"), false);
    assert.equal(pageSource.includes("(Search & Manage)"), false);

    assert.equal(founderHandoffSource.includes('redirect("/admin")'), true);
    assert.equal(founderHandoffSource.includes("founderCopy.surfaceMap.title"), false);
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
      'label="Businesses"',
      'label="Active pilots"',
      'label="Payment-ready"',
      'label="Quote links off"',
      'label="Paused access"',
    ]) {
      assert.equal(
        pageSource.includes(forbidden),
        false,
        `Founder admin overview should not imply unsupported analytics: ${forbidden}`,
      );
    }

    for (const required of [
      "overviewCopy.metricCards.totalUsers",
      "overviewCopy.metricCards.activeBusinesses",
      "overviewCopy.metricCards.loadedLeads",
      "overviewCopy.metricCards.readinessCompleted",
      "overviewCopy.healthSection.notice",
      "overviewCopy.page.actions.activityLog",
      "copy.overview.metricsPanel.activePilots",
      "copy.overview.metricsPanel.pausedAccess",
    ]) {
      assert.equal(
        pageSource.includes(required),
        true,
        `Founder admin overview should keep honest localized metric: ${required}`,
      );
    }
  });
  it("keeps Business Operations complete but progressively disclosed", () => {
    const pageSource = readFileSync("app/admin/page.tsx", "utf8");

    assert.equal(pageSource.includes("data-admin-business-controls"), true);
    assert.equal(pageSource.includes("data-admin-workspace-tools"), true);
    assert.equal(pageSource.includes("data-admin-sensitive-tools"), true);
    assert.equal(pageSource.includes("data-admin-recent-changes"), true);
    assert.equal(pageSource.includes("xl:grid-cols-4"), true);
    assert.equal(pageSource.includes("prefetch={false}"), true);
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
      businessDetail.indexOf("detailCopy.tiles.accessStatus"),
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
      pageSource.indexOf("copy.businesses.searchLabel") <
        pageSource.indexOf("visibleBusinesses.map"),
      true,
    );
    assert.equal(
      businessSection.indexOf("copy.businesses.priorityWorkspace") <
        businessSection.indexOf("<MetricCard"),
      true,
    );
    assert.equal(
      tileSection.indexOf("detailCopy.tiles.accessStatus") <
        tileSection.indexOf("detailCopy.tiles.quoteLink"),
      true,
    );
    assert.equal(
      tileSection.indexOf("detailCopy.tiles.quoteLink") <
        tileSection.indexOf("detailCopy.tiles.plan"),
      true,
    );
    assert.equal(
      tileSection.indexOf("detailCopy.tiles.plan") <
        tileSection.indexOf("detailCopy.tiles.sessionPolicy"),
      true,
    );
    assert.equal(
      tileSection.indexOf("detailCopy.tiles.sessionPolicy") <
        tileSection.indexOf("detailCopy.tiles.auditEvents"),
      true,
    );
    assert.equal(
      businessDetail.indexOf("detailCopy.snapshotTitle") <
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
