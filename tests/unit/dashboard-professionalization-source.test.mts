/**
 * ============================================================
 * File: tests/unit/dashboard-professionalization-source.test.mts
 * Project: BizPilot AI
 * Description: Source guards for P12 dashboard visual/readability polish.
 * Role: Keeps dashboard queue, detail, and owner-review source contracts stable as dashboard phases evolve.
 * Related:
 * - components/dashboard/lead-workspace-queue.tsx
 * - app/(dashboard)/dashboard/leads/[leadId]/page.tsx
 * - lib/i18n/bizpilot-copy.ts
 * - docs/readiness/PHASE_26A_OWNER_DASHBOARD_GUIDE_AND_QUEUE_FINALIZATION_2026-07-04.md
 * Author: MoOoH
 * Created: 2026-06-26
 * Last Updated: 2026-07-05
 * Change Log:
 * - 2026-07-05: Guarded owner overview priority hierarchy, tokenized insight visuals, and demoted utility quote-page actions.
 * - 2026-07-05: Guarded accessible lead queue pagination controls.
 * - 2026-07-04: Added lead queue pagination source guards.
 * - 2026-07-04: Updated overview source guards for the simplified action-first cockpit.
 * - 2026-07-04: Guarded the richer owner manual queue and protected operating guide.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("P12 dashboard professionalization source guards", () => {
  it("keeps the dashboard command lane manual-first and visible", () => {
    const overviewSource = readFileSync(
      "app/(dashboard)/dashboard/page.tsx",
      "utf8",
    );
    const copySource = readFileSync("lib/i18n/bizpilot-copy.ts", "utf8");

    assert.equal(overviewSource.includes("overviewCopy.commandFlow"), false);
    assert.equal(overviewSource.includes("overviewCopy.startGuide"), true);
    assert.equal(overviewSource.includes("primaryActionHref"), true);
    assert.equal(overviewSource.includes("priorityTiles"), true);
    assert.equal(overviewSource.includes("OwnerTodoTodayPanel"), true);
    assert.equal(overviewSource.includes("overviewCopy.recoveryFocus.replyDetail"), true);
    assert.equal(overviewSource.includes("overviewCopy.metrics.aiDraftsReady.detail"), true);
    assert.equal(overviewSource.includes("actionLabel"), true);
    assert.equal(overviewSource.includes("data-dashboard-primary-action"), true);
    assert.equal(overviewSource.includes("data-dashboard-priority-order"), true);
    assert.equal(overviewSource.includes("data-dashboard-utility-actions"), true);
    assert.equal(overviewSource.includes("data-dashboard-secondary-insights"), true);
    assert.equal(overviewSource.includes("className={buttonClass} href={quotePath}"), true);
    assert.equal(overviewSource.includes("className={primaryButtonClass} href={quotePath}"), false);
    assert.equal(overviewSource.includes("OwnerTrendChart"), true);
    assert.equal(overviewSource.includes("LeadSourcesDonut"), true);
    assert.equal(overviewSource.includes("ownerOverviewKpiCards"), false);
    assert.equal(overviewSource.includes("\"violet\""), false);
    assert.equal(overviewSource.includes("#6d5dfc"), false);
    assert.equal(overviewSource.includes("#4f46e5"), false);
    assert.equal(overviewSource.includes("stopColor=\"var(--dash-primary)\""), true);
    assert.equal(overviewSource.includes("stroke=\"var(--dash-primary)\""), true);
    assert.equal(overviewSource.includes("fill=\"var(--dash-surface)\""), true);
    assert.equal(overviewSource.includes("var(--dash-warning-strong)"), true);
    assert.equal(overviewSource.includes("var(--dash-danger-strong)"), true);
    assert.equal(copySource.includes("Start here"), true);
    assert.equal(copySource.includes("Finish quote setup"), true);
    assert.equal(copySource.includes("Preview quote page"), true);
    assert.equal(copySource.includes("Today's manual recovery lane"), true);
    assert.equal(copySource.includes("Manual send"), true);
    assert.equal(copySource.includes("Owner copies, edits, and sends."), true);
    assert.equal(copySource.includes("No auto-send"), true);
    assert.equal(copySource.includes("No invented pricing"), true);
    assert.equal(copySource.includes("Owner Operating Guide"), true);
    assert.equal(copySource.includes("Manual recovery operating system"), true);
    assert.equal(copySource.includes("Visible gaps and gates"), true);
  });

  it("keeps lead queue scanning accessible and priority-based", () => {
    const queueSource = readFileSync(
      "components/dashboard/lead-workspace-queue.tsx",
      "utf8",
    );
    const copySource = readFileSync("lib/i18n/bizpilot-copy.ts", "utf8");

    assert.equal(queueSource.includes("QueueInsightStrip"), true);
    assert.equal(queueSource.includes("aria-label={queueCopy.searchAriaLabel}"), true);
    assert.equal(queueSource.includes("aria-label={queueCopy.filterAriaLabel}"), true);
    assert.equal(queueSource.includes("aria-label={queueCopy.sortAriaLabel}"), true);
    assert.equal(queueSource.includes("type LeadPageSize = 10 | 25 | 50;"), true);
    assert.equal(queueSource.includes("const shouldPaginate = !compact && typeof limit !== \"number\";"), true);
    assert.equal(queueSource.includes("QueuePagination"), true);
    assert.equal(queueSource.includes("paginationWindow"), true);
    assert.equal(queueSource.includes("aria-label={copy.pagination.navigationLabel}"), true);
    assert.equal(queueSource.includes('aria-current={active ? "page" : undefined}'), true);
    assert.equal(queueSource.includes("copy.pagination.pageButtonAriaLabel(page)"), true);
    assert.equal(queueSource.includes("const showPaginationControls = shouldPaginate && renderedLeads.length > 0;"), true);
    assert.equal(queueSource.includes("visibleLeads.map"), true);
    assert.equal(queueSource.includes("setCurrentPage(1);"), true);
    assert.equal(copySource.includes("Priority order favors overdue requests"), true);
    assert.equal(copySource.includes("Choose rows per page"), true);
    assert.equal(copySource.includes("Choisir le nombre de lignes par page"), true);
    assert.equal(copySource.includes("Lead queue pagination"), true);
    assert.equal(copySource.includes("Pagination de la file de prospects"), true);
  });

  it("keeps internal seed lead labels out of owner-facing lead surfaces", () => {
    const uiSource = readFileSync("components/dashboard/dashboard-ui.tsx", "utf8");
    const overviewSource = readFileSync(
      "app/(dashboard)/dashboard/page.tsx",
      "utf8",
    );
    const queueSource = readFileSync(
      "components/dashboard/lead-workspace-queue.tsx",
      "utf8",
    );
    const detailSource = readFileSync(
      "app/(dashboard)/dashboard/leads/[leadId]/page.tsx",
      "utf8",
    );

    assert.equal(uiSource.includes("ownerSafeLeadText"), true);
    assert.equal(uiSource.includes("internalLeadTextPattern"), true);
    assert.equal(uiSource.includes('return "?"'), true);
    assert.equal(uiSource.includes("phase\\s*\\d"), true);
    assert.equal(uiSource.includes("phase\\d+[a-z]?\\+bizpilotowner"), true);
    assert.equal(uiSource.includes("synthetic"), true);
    assert.equal(uiSource.includes("bizpilotowner(?:\\s+|\\+)"), true);
    assert.equal(overviewSource.includes("ownerSafeLeadText"), true);
    assert.equal(queueSource.includes("ownerSafeLeadText"), true);
    assert.equal(detailSource.includes("ownerSafeLeadText"), true);
    assert.equal(
      detailSource.includes("return ownerSafeLeadText(value, detailCopy.notProvided);"),
      true,
    );
    assert.equal(
      queueSource.includes("Avatar name={customerDisplayName}"),
      true,
    );
    assert.equal(
      overviewSource.includes("Avatar name={customerDisplayName}"),
      true,
    );
  });

  it("keeps owner review steps explicit on lead detail", () => {
    const detailSource = readFileSync(
      "app/(dashboard)/dashboard/leads/[leadId]/page.tsx",
      "utf8",
    );
    const copySource = readFileSync("lib/i18n/bizpilot-copy.ts", "utf8");

    assert.equal(
      detailSource.includes("detailCopy.manualWorkflow.steps.map"),
      true,
    );
    assert.equal(copySource.includes("Generate or inspect the AI-supported reply."), true);
    assert.equal(copySource.includes("Update status after the manual contact."), true);
    assert.equal(copySource.includes("Mettre à jour le statut après le contact manuel."), true);
  });

  it("keeps the owner guide finalization report explicit about gaps", () => {
    const report = readFileSync(
      "docs/readiness/PHASE_26A_OWNER_DASHBOARD_GUIDE_AND_QUEUE_FINALIZATION_2026-07-04.md",
      "utf8",
    );

    for (const required of [
      "Added `/dashboard/guide` as a protected owner route.",
      "manual recovery queue",
      "reply needed",
      "AI draft ready",
      "Dedicated keyboard/focus and screenshot QA",
      "Team assignment",
      "Notification automation",
      "Paid pilot",
      "Do not run synthetic dashboard smoke against managed Supabase or production.",
    ]) {
      assert.equal(report.includes(required), true, `Missing ${required}.`);
    }
  });
});
