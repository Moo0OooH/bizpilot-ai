/*
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

  it("keeps the V2 public story compact, responsive, and free of nested-scroll panels", () => {
    const homeSource = readFileSync(
      "components/public/bizpilot-v2-home.tsx",
      "utf8",
    );
    const homeStyles = readFileSync(
      "components/public/bizpilot-v2-home.module.css",
      "utf8",
    );
    const sharedPage = readFileSync(
      "components/public/bizpilot-v2-page.tsx",
      "utf8",
    );
    const cleaningSource = readFileSync(
      "app/industries/cleaning/page.tsx",
      "utf8",
    );

    for (const required of [
      "copy.problem.cards.map",
      "copy.flow.steps.map",
      "copy.industries.cards.map",
      "copy.features.cards.map",
      "homepage-demo-grid",
      "homepage-hero-proof-rail",
    ]) {
      assert.equal(homeSource.includes(required), true, required);
    }

    for (const required of [
      "@media (min-width: 390px)",
      "@media (min-width: 720px)",
      "@media (min-width: 1020px)",
      "@media (max-width: 359px)",
      "@media (prefers-reduced-motion: no-preference)",
    ]) {
      assert.equal(homeStyles.includes(required), true, required);
    }

    for (const forbidden of [
      "overflow-y-auto",
      "100vh",
      "width: 100vw",
      "h-screen",
      "w-screen",
    ]) {
      assert.equal(
        `${homeSource}\n${homeStyles}\n${sharedPage}`.includes(forbidden),
        false,
        forbidden,
      );
    }

    assert.equal(sharedPage.includes("copy.sections.map"), true);
    assert.equal(sharedPage.includes("MarketingPageHero"), true);
    assert.equal(cleaningSource.includes("BizPilotV2Page"), true);
    assert.equal(cleaningSource.includes("CleaningServiceDetails"), false);
  });
});
