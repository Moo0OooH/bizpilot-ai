/**
 * ============================================================
 * File: tests/unit/dashboard-section-visibility.test.mts
 * Project: BizPilot AI
 * Description: Unit and source contracts for optional dashboard navigation visibility.
 * Role: Keeps preferences allowlisted, authenticated, bilingual, and separate from authorization.
 * Related:
 * - lib/dashboard-section-visibility.ts
 * - server/actions/dashboard-display.actions.ts
 * - app/(dashboard)/layout.tsx
 * Author: MoOoH
 * Created: 2026-07-17
 * Last Updated: 2026-07-17
 * Change Log:
 * - 2026-07-17: Added parser, persistence, navigation, route-access, and copy coverage.
 * ============================================================
 */

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";

import {
  DEFAULT_VISIBLE_DASHBOARD_SECTIONS,
  OPTIONAL_DASHBOARD_SECTIONS,
  normalizeVisibleDashboardSections,
  parseVisibleDashboardSections,
  serializeVisibleDashboardSections,
} from "../../lib/dashboard-section-visibility.ts";
import { getBizPilotCopy } from "../../lib/i18n/bizpilot-copy.ts";

function source(path: string): string {
  return readFileSync(path, "utf8");
}

describe("dashboard section visibility", () => {
  it("allows only Reports and Guide with stable defaults and ordering", () => {
    assert.deepEqual(OPTIONAL_DASHBOARD_SECTIONS, ["reports", "guide"]);
    assert.deepEqual(DEFAULT_VISIBLE_DASHBOARD_SECTIONS, ["reports", "guide"]);
    assert.deepEqual(parseVisibleDashboardSections(undefined), [
      "reports",
      "guide",
    ]);
    assert.deepEqual(parseVisibleDashboardSections(""), []);
    assert.deepEqual(
      parseVisibleDashboardSections("guide,admin,reports,guide,overview"),
      ["reports", "guide"],
    );
    assert.deepEqual(
      normalizeVisibleDashboardSections([
        "settings",
        "reports",
        "leads",
        "guide",
      ]),
      ["reports", "guide"],
    );
    assert.equal(
      serializeVisibleDashboardSections(["guide", "reports", "admin"]),
      "reports,guide",
    );
    assert.deepEqual(parseVisibleDashboardSections("x".repeat(129)), [
      "reports",
      "guide",
    ]);
  });

  it("persists the display-only preference through an authenticated HTTP-only action", () => {
    const action = source("server/actions/dashboard-display.actions.ts");
    const layout = source("app/(dashboard)/layout.tsx");
    const settings = source("app/(dashboard)/dashboard/settings/page.tsx");

    for (const required of [
      "getCurrentUser()",
      "normalizeVisibleDashboardSections",
      "serializeVisibleDashboardSections",
      "httpOnly: true",
      'sameSite: "lax"',
      'redirect("/dashboard/settings")',
    ]) {
      assert.equal(action.includes(required), true, `Missing ${required}.`);
    }
    assert.equal(
      action.includes(
        'redirect("/auth/sign-in?redirectTo=%2Fdashboard%2Fsettings")',
      ),
      true,
    );
    assert.equal(layout.includes("parseVisibleDashboardSections"), true);
    assert.equal(
      layout.includes("visibleOptionalSections={visibleOptionalSections}"),
      true,
    );
    assert.equal(
      settings.includes("updateDashboardSectionVisibilityAction"),
      true,
    );
    assert.equal(
      settings.match(/name="visibleDashboardSection"/g)?.length,
      2,
    );
  });

  it("filters optional navigation without hiding core routes or changing authorization", () => {
    const helper = source("lib/dashboard-section-visibility.ts");
    const sidebar = source("components/dashboard/dashboard-sidebar.tsx");
    const topbar = source("components/dashboard/dashboard-topbar.tsx");
    const reportsRoute = "app/(dashboard)/dashboard/reports/page.tsx";
    const guideRoute = "app/(dashboard)/dashboard/guide/page.tsx";

    assert.equal(sidebar.match(/optionalSection:/g)?.length, 2);
    assert.equal(sidebar.includes('optionalSection: "reports"'), true);
    assert.equal(sidebar.includes('optionalSection: "guide"'), true);
    assert.equal(topbar.includes('includes("reports")'), true);
    assert.equal(topbar.includes('includes("guide")'), true);
    assert.equal(
      topbar.includes('<details className="group relative lg:hidden">'),
      true,
    );
    assert.equal(
      sidebar.includes("hidden h-svh w-[240px]") &&
        sidebar.includes("lg:flex lg:flex-col"),
      true,
    );
    assert.equal(topbar.match(/href="\/admin"/g)?.length, 1);
    assert.equal(topbar.includes('href="/dashboard/guide"'), false);
    assert.equal(sidebar.match(/href="\/admin"/g)?.length, 1);
    for (const core of ["overview", "leads", "configuration", "settings", "admin"] ) {
      assert.equal(
        helper.includes(`"${core}"`),
        false,
        `${core} must never enter the optional-section allowlist.`,
      );
    }
    assert.equal(existsSync(reportsRoute), true);
    assert.equal(existsSync(guideRoute), true);
    assert.equal(source(reportsRoute).includes("dashboard-section-visibility"), false);
    assert.equal(source(guideRoute).includes("dashboard-section-visibility"), false);
  });

  it("keeps the display-only boundary explicit in both supported languages", () => {
    const english = getBizPilotCopy("en").dashboard.settings.navigationSections;
    const french = getBizPilotCopy("fr-CA").dashboard.settings.navigationSections;

    assert.match(english.displayOnly, /display only/i);
    assert.match(english.displayOnly, /permissions do not change/i);
    assert.match(english.alwaysVisible, /Founder Admin/i);
    assert.match(french.displayOnly, /seulement l'affichage/i);
    assert.match(french.displayOnly, /autorisations ne changent pas/i);
    assert.match(french.alwaysVisible, /Admin fondateur/i);
  });
});
