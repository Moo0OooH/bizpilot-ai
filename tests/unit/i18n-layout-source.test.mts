/**
 * ============================================================
 * File: tests/unit/i18n-layout-source.test.mts
 * Project: BizPilot AI
 * Description: Source-level guards for bilingual copy health and compact responsive layouts.
 * Role: Protects localized copy quality, dashboard disclosure behavior, and the V2 mobile-first public narrative.
 * Related:
 * - lib/i18n/public-v2-copy.ts
 * - components/public/bizpilot-v2-home.tsx
 * - components/public/bizpilot-v2-home.module.css
 * Author: MoOoH
 * Created: 2026-06-19
 * Last Updated: 2026-07-13
 * Change Log:
 * - 2026-07-13: Migrated compact public-layout guards from retired V2 files to the shared V3 renderers.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const copyFiles = [
  "lib/i18n/language.ts",
  "lib/i18n/home-copy.ts",
  "lib/i18n/public-site-copy.ts",
  "lib/i18n/public-v2-copy.ts",
  "lib/i18n/bizpilot-copy.ts",
  "lib/i18n/policy-copy.ts",
  "lib/i18n/pricing-copy.ts",
] as const;

describe("bilingual copy and compact layout guards", () => {
  it("keeps visible EN/fr-CA copy free of common mojibake sequences", () => {
    const mojibakePattern = /Ã|Â|â€|â€™|â€œ|â€“|â€˜/;

    for (const file of copyFiles) {
      const source = readFileSync(file, "utf8");

      assert.equal(
        mojibakePattern.test(source),
        false,
        `${file} contains mojibake-like text.`,
      );
    }
  });

  it("keeps French language labels readable in selectors", () => {
    const source = readFileSync("lib/i18n/language.ts", "utf8");

    assert.equal(source.includes('label: "Français (Canada)"'), true);
    assert.equal(source.includes('nativeLabel: "Français (Canada)"'), true);
    assert.equal(source.includes('shortLabel: "FR"'), true);
  });

  it("keeps dashboard settings from expanding long documentation by default", () => {
    const source = readFileSync(
      "app/(dashboard)/dashboard/settings/page.tsx",
      "utf8",
    );

    assert.equal(source.includes("countFeaturesByState"), true);
    assert.equal(source.includes("featureStateCounts"), true);
    assert.equal(source.includes("settingsCopy.featureRegistry.guidesLabel"), true);
    assert.equal(source.includes("data-dashboard-optional-guide"), true);
    assert.equal(source.includes("settingsCopy.systemHistory.title"), true);
    assert.equal(source.includes("settingsCopy.lifecycle.title"), true);
    assert.equal(source.includes('DashboardCard className="p-[18px]'), false);
  });

  it("keeps the V3 public story compact, responsive, and free of nested-scroll panels", () => {
    const homeSource = readFileSync("components/public/public-v3-home.tsx", "utf8");
    const homeStyles = readFileSync("components/public/public-v3-home.module.css", "utf8");
    const sharedPage = readFileSync("components/public/public-v3-page.tsx", "utf8");
    const pageStyles = readFileSync("components/public/public-v3-page.module.css", "utf8");

    for (const required of [
      "spec.home.problemMessages.map",
      "spec.home.workflowSteps.map",
      "spec.home.outcomeCards.map",
      "MarketingProductFrame",
      "RouteContent",
      "PublicV3Demo",
    ]) {
      assert.equal(`${homeSource}\n${sharedPage}`.includes(required), true, required);
    }

    for (const forbidden of ["overflow-y-auto", "100vh", "width: 100vw", "h-screen", "w-screen"]) {
      assert.equal(
        `${homeSource}\n${homeStyles}\n${sharedPage}\n${pageStyles}`.includes(forbidden),
        false,
        forbidden,
      );
    }

    assert.equal(pageStyles.includes("@media (min-width: 960px)"), true);
    assert.equal(pageStyles.includes("@media (max-width: 480px)"), true);
    assert.equal(homeStyles.includes("@media (prefers-reduced-motion: no-preference)"), true);
  });
});
