/**
 * ============================================================
 * File: tests/unit/dashboard-responsive-shell-source.test.mts
 * Project: BizPilot AI
 * Description: Source contracts for protected-shell narrow viewport containment.
 * Role: Prevents setup tab and founder topbar regressions that clip localized controls.
 * Related:
 * - components/dashboard/configuration-tabs.tsx
 * - app/admin/page.tsx
 * Author: MoOoH
 * Created: 2026-07-17
 * Last Updated: 2026-07-17
 * Change Log:
 * - 2026-07-17: Added setup-scrollport and founder-topbar wrapping contracts.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function source(path: string): string {
  return readFileSync(path, "utf8");
}

describe("dashboard responsive shell source contracts", () => {
  it("keeps setup tabs aligned with the nested scrollport and horizontally contained", () => {
    const tabs = source("components/dashboard/configuration-tabs.tsx");

    assert.equal(tabs.includes("sticky top-2"), true);
    assert.equal(tabs.includes("top-[66px]"), false);
    assert.equal(
      tabs.includes("overflow-x-auto overscroll-x-contain"),
      true,
    );
    assert.equal(tabs.includes("max-w-full scroll-px-2 touch-pan-x"), true);
    assert.equal(tabs.includes("[scrollbar-width:thin]"), true);
  });

  it("keeps founder topbar utilities wrapping until the medium breakpoint", () => {
    const page = source("app/admin/page.tsx");
    const topbar = page.slice(
      page.indexOf("function AdminTopBar"),
      page.indexOf("function AdminTabsBar"),
    );

    assert.equal(topbar.includes("md:flex-nowrap md:gap-4 md:py-0"), true);
    assert.equal(
      topbar.includes("sm:justify-end md:basis-auto md:flex-nowrap"),
      true,
    );
    assert.equal(topbar.includes("sm:flex-nowrap"), false);
    assert.equal(topbar.includes("sm:basis-auto"), false);
  });
});
