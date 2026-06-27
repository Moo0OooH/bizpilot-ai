/**
 * File: tests/unit/dashboard-heading-source.test.mts
 * Project: BizPilot AI
 * Description: Source guard for one content-owned dashboard heading hierarchy.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("dashboard heading hierarchy", () => {
  it("keeps route chrome from duplicating page content H1s", () => {
    const overviewSource = readFileSync(
      "app/(dashboard)/dashboard/page.tsx",
      "utf8",
    );
    const topbarSource = readFileSync(
      "components/dashboard/dashboard-topbar.tsx",
      "utf8",
    );

    assert.equal(overviewSource.includes("<h1 className="), true);
    assert.equal(topbarSource.includes("<h1"), false);
    assert.equal(topbarSource.includes("page content owns the H1"), true);
  });

  it("keeps mobile lead cards from widening on long contact text", () => {
    const queueSource = readFileSync(
      "components/dashboard/lead-workspace-queue.tsx",
      "utf8",
    );

    assert.equal(queueSource.includes("wrap?: boolean"), true);
    assert.equal(queueSource.includes("<CustomerCell copy={copy} item={item} wrap />"), true);
    assert.equal(queueSource.includes("break-all text-[12px]"), true);
    assert.equal(queueSource.includes("grid min-w-0 gap-3 overflow-hidden"), true);
  });

  it("keeps dashboard chrome and setup panels inside mobile viewports", () => {
    const globalStyles = readFileSync("app/globals.css", "utf8");
    const topbarSource = readFileSync(
      "components/dashboard/dashboard-topbar.tsx",
      "utf8",
    );
    const tabsSource = readFileSync(
      "components/dashboard/configuration-tabs.tsx",
      "utf8",
    );
    const overviewSource = readFileSync(
      "app/(dashboard)/dashboard/page.tsx",
      "utf8",
    );

    assert.equal(globalStyles.includes("max-width: var(--dashboard-max);"), true);
    assert.equal(globalStyles.includes("min-inline-size: 0;"), true);
    assert.equal(
      topbarSource.includes("w-[min(220px,calc(100vw-1.5rem))]"),
      true,
    );
    assert.equal(topbarSource.includes("sm:left-auto sm:right-0"), true);
    assert.equal(tabsSource.includes("grid min-w-0 gap-3"), true);
    assert.equal(tabsSource.includes("min-w-0 max-w-full overflow-hidden"), true);
    assert.equal(tabsSource.includes("flex min-w-0 gap-1 overflow-x-auto"), true);
    assert.equal(
      overviewSource.includes("Consolidated the owner command lane and KPI strip"),
      true,
    );
    assert.equal(overviewSource.includes("overflow-hidden p-0"), true);
    assert.equal(overviewSource.includes("grid min-h-[86px]"), true);
  });
});
