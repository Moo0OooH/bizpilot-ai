/**
 * File: tests/unit/dashboard-v3-final-acceptance-source.test.mts
 * Project: BizPilot AI
 * Description: Final source guards for the Dashboard V3 completion package.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("Dashboard V3 final acceptance source guards", () => {
  it("keeps the final completion report tied to the prompt pack and safety gates", () => {
    const report = readFileSync(
      "docs/readiness/DASHBOARD_V3_FINAL_COMPLETION_REPORT_2026-06-27.md",
      "utf8",
    );
    const figmaHandoff = readFileSync(
      "docs/readiness/DASHBOARD_V3_FIGMA_HANDOFF_AND_VISUAL_QA_2026-06-27.md",
      "utf8",
    );

    assert.equal(report.includes("# Dashboard V3 Final Completion Report"), true);
    assert.equal(report.includes("Prompt Completion Scorecard"), true);
    assert.equal(report.includes("| 00 | PASS |"), true);
    assert.equal(report.includes("| 14 | PASS |"), true);
    assert.equal(report.includes("standalone P21 blueprint"), true);
    assert.equal(report.includes("No real customer data"), true);
    assert.equal(report.includes("paid pilot"), true);
    assert.equal(report.includes("pnpm verify"), true);
    assert.equal(report.includes("git diff --check"), true);
    assert.equal(report.includes("forbidden internal seed matches are zero"), true);
    assert.equal(report.includes("Generated artifacts remain untracked"), true);
    assert.equal(report.includes("Figma / Visual Handoff"), true);
    assert.equal(report.includes("https://www.figma.com/design/dkklUNcV1JxIpHXk2q27n9"), true);
    assert.equal(report.includes("dashboard-v3-final-handoff-browser-qa.json"), true);
    assert.equal(figmaHandoff.includes("# Dashboard V3 Figma Handoff and Visual QA"), true);
    assert.equal(figmaHandoff.includes("Figma Starter"), true);
    assert.equal(figmaHandoff.includes("Desktop / Owner Overview / 1440"), true);
    assert.equal(figmaHandoff.includes("Mobile / Lead Detail / 390"), true);
    assert.equal(figmaHandoff.includes("pnpm verify"), true);
  });

  it("keeps owner navigation compact and route-owned", () => {
    const sidebar = readFileSync(
      "components/dashboard/dashboard-sidebar.tsx",
      "utf8",
    );

    assert.equal(sidebar.includes('href: "/dashboard"'), true);
    assert.equal(sidebar.includes('href: "/dashboard/leads"'), true);
    assert.equal(sidebar.includes('href: "/dashboard/configuration"'), true);
    assert.equal(sidebar.includes('href: "/dashboard/business-profile"'), true);
    assert.equal(sidebar.includes('href: "/dashboard/settings"'), true);
    assert.equal(sidebar.includes('pathname.startsWith("/dashboard/leads")'), true);
    assert.equal(sidebar.includes(".slice(0, 5)"), true);
    assert.equal(sidebar.includes('href: "/dashboard/founder"'), false);
  });

  it("keeps dashboard and admin routes in a fixed viewport shell", () => {
    const dashboardFrame = readFileSync(
      "components/dashboard/dashboard-theme.tsx",
      "utf8",
    );
    const dashboardShell = readFileSync(
      "components/dashboard/dashboard-shell.tsx",
      "utf8",
    );
    const sidebar = readFileSync(
      "components/dashboard/dashboard-sidebar.tsx",
      "utf8",
    );
    const adminFrame = readFileSync(
      "components/admin/founder-admin-theme.tsx",
      "utf8",
    );
    const admin = readFileSync("app/admin/page.tsx", "utf8");
    const topbar = readFileSync(
      "components/dashboard/dashboard-topbar.tsx",
      "utf8",
    );

    assert.equal(dashboardFrame.includes("dashboard-frame h-svh"), true);
    assert.equal(dashboardFrame.includes("overflow-hidden"), true);
    assert.equal(dashboardShell.includes("flex h-svh min-w-0 flex-col overflow-hidden"), true);
    assert.equal(dashboardShell.includes("flex-1 overflow-y-auto"), true);
    assert.equal(sidebar.includes("sticky top-0 hidden h-svh w-[224px]"), true);
    assert.equal(sidebar.includes("dashboard-mobile-nav fixed inset-x-0 bottom-0"), true);
    assert.equal(topbar.includes('const quotePath = `/quote/${businessSlug}`'), true);
    assert.equal(topbar.includes('href="/admin"'), true);
    assert.equal(adminFrame.includes("h-svh overflow-hidden"), true);
    assert.equal(admin.includes("flex h-dvh min-h-0 w-full flex-col overflow-hidden lg:flex-row"), true);
    assert.equal(admin.includes('href={adminUsersHref(params, { adminPanel: item.panel })}'), true);
    assert.equal(admin.includes('aria-label="Admin sections"'), true);
    assert.equal(admin.includes("grid grid-cols-3 gap-1"), true);
    assert.equal(admin.includes("flex-1 overflow-y-auto"), true);
  });

  it("keeps owner lead recovery action-first and manual-safe", () => {
    const overview = readFileSync("app/(dashboard)/dashboard/page.tsx", "utf8");
    const queue = readFileSync(
      "components/dashboard/lead-workspace-queue.tsx",
      "utf8",
    );
    const detail = readFileSync(
      "app/(dashboard)/dashboard/leads/[leadId]/page.tsx",
      "utf8",
    );

    assert.equal(overview.includes("overviewCopy.suggestedNextAction"), true);
    assert.equal(overview.includes("overviewCopy.startGuide"), true);
    assert.equal(overview.includes("priorityTiles"), true);
    assert.equal(overview.includes("<LeadWorkspaceQueue"), true);
    assert.equal(overview.includes("ownerOverviewKpiCards"), true);
    assert.equal(overview.includes("OwnerTrendChart"), true);
    assert.equal(overview.includes("LeadSourcesDonut"), true);
    assert.equal(overview.includes("OwnerTodoTodayPanel"), true);
    assert.equal(queue.includes("QueueInsightStrip"), true);
    assert.equal(queue.includes("ownerSafeLeadText"), true);
    assert.equal(queue.includes("limit?: number"), true);
    assert.equal(detail.includes("detailCopy.manualWorkflow.steps.map"), true);
    assert.equal(detail.includes("generateLeadAiBundleAction"), true);
    assert.equal(detail.includes("ownerSafeLeadText"), true);
    assert.equal(detail.includes("markReplyCopiedAction"), true);
  });

  it("keeps setup/profile/settings cleanup secondary and compact", () => {
    const configuration = readFileSync(
      "app/(dashboard)/dashboard/configuration/page.tsx",
      "utf8",
    );
    const businessProfile = readFileSync(
      "app/(dashboard)/dashboard/business-profile/page.tsx",
      "utf8",
    );
    const leadDetail = readFileSync(
      "app/(dashboard)/dashboard/leads/[leadId]/page.tsx",
      "utf8",
    );
    const settings = readFileSync(
      "app/(dashboard)/dashboard/settings/page.tsx",
      "utf8",
    );
    const dashboardLayout = readFileSync(
      "app/(dashboard)/layout.tsx",
      "utf8",
    );
    const flashMessage = readFileSync(
      "components/dashboard/flash-message.tsx",
      "utf8",
    );
    const workspaceDeletion = readFileSync(
      "components/dashboard/workspace-deletion-request-form.tsx",
      "utf8",
    );
    const globals = readFileSync("app/globals.css", "utf8");

    assert.equal(configuration.includes("ConfigurationTabs"), true);
    assert.equal(configuration.includes("ConfigurationPanel"), true);
    assert.equal(configuration.includes("rgba(23,212,146"), false);
    assert.equal(configuration.includes("bg-[#071018]"), false);
    assert.equal(configuration.includes("text-emerald-700"), false);
    assert.equal(configuration.includes("text-amber-700"), false);
    assert.equal(configuration.includes("text-red-700"), false);
    assert.equal(configuration.includes("var(--dash-preview-bg)"), true);
    assert.equal(globals.includes("--dash-preview-bg: #071018;"), true);
    assert.equal(businessProfile.includes("Change Log:"), true);
    assert.equal(businessProfile.includes("openQuoteSetup"), true);
    assert.equal(businessProfile.includes("p-[22px]"), false);
    assert.equal(leadDetail.includes("p-[18px]"), false);
    assert.equal(leadDetail.includes("p-[22px]"), false);
    assert.equal(leadDetail.includes("p-4 sm:p-5"), true);
    assert.equal(settings.includes("countFeaturesByState"), true);
    assert.equal(settings.includes("<details className="), true);
    assert.equal(settings.includes("WorkspaceDeletionRequestForm"), true);
    assert.equal(settings.includes("rounded-[14px]"), false);
    assert.equal(settings.includes("rounded-[16px]"), false);
    assert.equal(flashMessage.includes("rounded-[14px]"), false);
    assert.equal(flashMessage.includes("var(--dash-danger-border)"), true);
    assert.equal(flashMessage.includes("var(--dash-success-border)"), true);
    assert.equal(flashMessage.includes("var(--dash-warning-border)"), true);
    assert.equal(workspaceDeletion.includes("var(--dash-danger-border)"), true);
    assert.equal(workspaceDeletion.includes("var(--dash-danger-soft)"), true);
    assert.equal(workspaceDeletion.includes("var(--dash-danger-strong)"), true);
    assert.equal(workspaceDeletion.includes("border-red"), false);
    assert.equal(workspaceDeletion.includes("bg-red"), false);
    assert.equal(workspaceDeletion.includes("text-red"), false);
    assert.equal(dashboardLayout.includes("var(--dash-danger-border)"), true);
    assert.equal(dashboardLayout.includes("border-red"), false);
  });

  it("keeps founder/admin search-first and business cleanup gated", () => {
    const admin = readFileSync("app/admin/page.tsx", "utf8");
    const cleanup = readFileSync(
      "components/admin/founder-test-cleanup-form.tsx",
      "utf8",
    );

    assert.equal(admin.includes("| \"overview\""), true);
    assert.equal(admin.includes("FounderAdminOverviewSection"), true);
    assert.equal(admin.includes("FounderLeadsStatusDonut"), true);
    assert.equal(admin.includes("FounderSystemHealthSummary"), true);
    assert.equal(admin.indexOf("Search users") < admin.indexOf("Work queues"), true);
    assert.equal(admin.includes("businessQuery?: string"), true);
    assert.equal(admin.includes("function limitedBusinessRows"), true);
    assert.equal(admin.includes("].slice(0, 10);"), true);
    assert.equal(admin.includes("Search businesses"), true);
    assert.equal(admin.indexOf("Search businesses") < admin.indexOf("visibleBusinesses.map"), true);
    assert.equal(cleanup.includes("<details className="), true);
    assert.equal(cleanup.includes("<details open"), false);
    assert.equal(cleanup.includes("Dry run cleanup"), true);
    assert.equal(cleanup.includes("Hard purge is blocked for production_customer"), true);
  });
});
