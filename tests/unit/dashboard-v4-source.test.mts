/**
 * ============================================================
 * File: tests/unit/dashboard-v4-source.test.mts
 * Project: BizPilot AI
 * Description: Source-level regression contracts for the simplified Dashboard V4 owner and founder experience.
 * Role: Prevents reintroduction of duplicated navigation, decorative dashboards, no-op controls, unsafe automation claims, or hidden mobile destinations.
 * Related:
 * - app/(dashboard)/dashboard/page.tsx
 * - app/(dashboard)/dashboard/leads/page.tsx
 * - app/(dashboard)/dashboard/leads/[leadId]/page.tsx
 * - app/(dashboard)/dashboard/configuration/page.tsx
 * - app/(dashboard)/dashboard/settings/page.tsx
 * - app/admin/page.tsx
 * Author: MoOoH
 * Created: 2026-07-14
 * Last Updated: 2026-07-14
 * Change Log:
 * - 2026-07-14: Replaced superseded Dashboard V3/P12 guards with the current task-first V4 acceptance contract.
 * ============================================================
 */

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("Dashboard V4 source contracts", () => {
  it("keeps five task destinations visible on desktop and mobile", () => {
    const sidebar = readFileSync(
      "components/dashboard/dashboard-sidebar.tsx",
      "utf8",
    );

    for (const href of [
      "/dashboard",
      "/dashboard/leads",
      "/dashboard/configuration",
      "/dashboard/business-profile",
      "/dashboard/settings",
    ]) {
      assert.equal(sidebar.includes(`href: "${href}"`), true, `Missing ${href}.`);
    }

    assert.equal(sidebar.includes(".flatMap((group) => group.items)"), true);
    assert.equal(sidebar.includes(".slice(0, 5)"), false);
    assert.equal(sidebar.includes('href="/dashboard/guide"'), true);
    assert.equal(sidebar.includes('href: "/dashboard/guide"'), false);
    assert.equal(sidebar.includes('href: "/dashboard/founder"'), false);
  });

  it("keeps the shell compact and lets route content own headings", () => {
    const shell = readFileSync("components/dashboard/dashboard-shell.tsx", "utf8");
    const topbar = readFileSync("components/dashboard/dashboard-topbar.tsx", "utf8");
    const theme = readFileSync("components/dashboard/dashboard-theme.tsx", "utf8");
    const globals = readFileSync("app/globals.css", "utf8");

    assert.equal(shell.includes("DashboardRouteGuideRail"), false);
    assert.equal(shell.includes("DashboardDisplayPreferencesFrame"), false);
    assert.equal(topbar.includes("<h1"), false);
    assert.equal(topbar.includes("right-0 top-11"), true);
    assert.equal(topbar.includes("calc(100vw-1.5rem)"), true);
    assert.equal(theme.includes("dashboard-frame h-svh"), true);
    assert.equal(globals.includes("--dashboard-max: 90rem;"), true);
    assert.equal(globals.includes(".dashboard-route-guide"), false);
    assert.equal(
      existsSync("components/dashboard/dashboard-route-guide.tsx"),
      false,
    );
    assert.equal(
      existsSync("components/dashboard/dashboard-display-preferences.tsx"),
      false,
    );
  });

  it("keeps the owner overview decision-first without decorative analytics", () => {
    const overview = readFileSync("app/(dashboard)/dashboard/page.tsx", "utf8");

    for (const required of [
      "primaryActionHref",
      "missingReadinessItems",
      "data-dashboard-primary-action",
      "data-dashboard-priority-order",
      "TodayPriorityList",
      "<LeadWorkspaceQueue",
      "limit={5}",
    ]) {
      assert.equal(overview.includes(required), true, `Missing ${required}.`);
    }

    for (const removed of [
      "OwnerTrendChart",
      "LeadSourcesDonut",
      "OwnerTodoTodayPanel",
      "data-dashboard-secondary-insights",
    ]) {
      assert.equal(overview.includes(removed), false, `Retained ${removed}.`);
    }
  });

  it("keeps lead triage focused, editable, and manual-safe", () => {
    const leads = readFileSync("app/(dashboard)/dashboard/leads/page.tsx", "utf8");
    const queue = readFileSync(
      "components/dashboard/lead-workspace-queue.tsx",
      "utf8",
    );
    const detail = readFileSync(
      "app/(dashboard)/dashboard/leads/[leadId]/page.tsx",
      "utf8",
    );
    const editableDraft = readFileSync(
      "components/dashboard/editable-draft.tsx",
      "utf8",
    );

    assert.equal(leads.includes("const hasFocus = initialFilter !== \"all\";"), true);
    assert.equal(leads.includes("data-dashboard-lead-focus-command"), true);
    assert.equal(leads.includes("<LeadWorkspaceQueue"), true);
    assert.equal(leads.includes("quoteLinkHealth"), false);
    assert.equal(queue.includes("QueuePagination"), true);
    assert.equal(queue.includes("ownerSafeLeadText"), true);
    assert.equal(queue.includes('href="/dashboard/configuration"'), true);
    assert.equal(detail.includes("<EditableDraft"), true);
    assert.equal(detail.includes("ownerNotes"), false);
    assert.equal(detail.includes("disabledButtonClass"), false);
    assert.equal(detail.includes("detailCopy.manualWorkflow.steps.map"), true);
    assert.equal(detail.includes("detailCopy.ai.noSend"), true);
    assert.equal(editableDraft.includes("setIsEditing"), true);
    assert.equal(editableDraft.includes("<CopyButton"), true);
  });

  it("keeps Quote Setup and Settings compact without duplicated profile controls", () => {
    const configuration = readFileSync(
      "app/(dashboard)/dashboard/configuration/page.tsx",
      "utf8",
    );
    const settings = readFileSync(
      "app/(dashboard)/dashboard/settings/page.tsx",
      "utf8",
    );

    for (const tabId of [
      "configuration-overview",
      "services-areas",
      "cleaning-template-fields",
      "branding",
      "faq",
      "privacy-consent",
    ]) {
      assert.equal(
        configuration.includes(`id: "${tabId}"`),
        true,
        `Missing compact setup tab ${tabId}.`,
      );
    }

    for (const removedTab of ["business", "notifications", "public-page", "readiness"]) {
      assert.equal(configuration.includes(`id: "${removedTab}"`), false);
    }

    assert.equal(configuration.includes('name="businessName"'), true);
    assert.equal(configuration.includes('name="preferredLanguage"'), true);
    assert.equal(settings.includes("WorkspaceDeletionRequestForm"), true);
    assert.equal(settings.includes("settingsCopy.systemHistory.title"), true);
    assert.equal(settings.includes("settingsCopy.lifecycle.title"), true);
    assert.equal(settings.includes("countFeaturesByState"), false);
    assert.equal(settings.includes("DashboardDisplayPreferencesControl"), false);
  });

  it("keeps founder operations guarded while simplifying the overview", () => {
    const admin = readFileSync("app/admin/page.tsx", "utf8");
    const founder = readFileSync("app/(dashboard)/founder/page.tsx", "utf8");
    const cleanup = readFileSync(
      "components/admin/founder-test-cleanup-form.tsx",
      "utf8",
    );

    assert.equal(admin.includes("FounderAdminOverviewSection"), true);
    assert.equal(admin.includes("FounderLeadsStatusDonut"), false);
    assert.equal(admin.includes("FounderTopLeadSources"), false);
    assert.equal(admin.includes("overviewCopy.metricCards.totalUsers"), true);
    assert.equal(admin.includes("overviewCopy.healthSection.notice"), true);
    assert.equal(admin.includes('label="Businesses"'), false);
    assert.equal(admin.includes('label="Active pilots"'), false);
    assert.equal(admin.includes('return value && value.trim().length > 0 ? value : "Not captured"'), false);
    assert.equal(founder.includes('redirect("/admin")'), true);
    assert.equal(cleanup.includes("<details className="), true);
    assert.equal(cleanup.includes("disabledButtonClass"), true);
  });

  it("keeps autonomous product claims out of protected surfaces", () => {
    const sources = [
      readFileSync("app/(dashboard)/dashboard/page.tsx", "utf8"),
      readFileSync("app/(dashboard)/dashboard/leads/page.tsx", "utf8"),
      readFileSync("app/(dashboard)/dashboard/leads/[leadId]/page.tsx", "utf8"),
      readFileSync("app/admin/page.tsx", "utf8"),
    ].join("\n");

    for (const forbidden of [
      "AI Replies Sent",
      "Average Reply Time",
      "Setup Conversion Rate",
      "automatically sends",
      "confirmed booking",
    ]) {
      assert.equal(sources.includes(forbidden), false, `Unsafe claim: ${forbidden}`);
    }
  });
});
