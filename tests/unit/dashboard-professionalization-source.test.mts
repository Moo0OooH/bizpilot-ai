/**
 * File: tests/unit/dashboard-professionalization-source.test.mts
 * Project: BizPilot AI
 * Description: Source guards for P12 dashboard visual/readability polish.
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

    assert.equal(overviewSource.includes("overviewCopy.commandFlow"), true);
    assert.equal(copySource.includes("Today's manual recovery lane"), true);
    assert.equal(copySource.includes("Manual send"), true);
    assert.equal(copySource.includes("Owner copies, edits, and sends."), true);
    assert.equal(copySource.includes("No auto-send"), true);
    assert.equal(copySource.includes("No invented pricing"), true);
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
    assert.equal(copySource.includes("Priority order favors overdue requests"), true);
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
});
