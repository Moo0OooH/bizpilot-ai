/**
 * File: tests/unit/i18n-layout-source.test.mts
 * Project: BizPilot AI
 * Description: Source-level guards for bilingual copy health and compact page layouts.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const copyFiles = [
  "lib/i18n/language.ts",
  "lib/i18n/home-copy.ts",
  "lib/i18n/public-site-copy.ts",
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
    assert.equal(source.includes("<details className=\"mt-3"), true);
    assert.equal(source.includes("settingsCopy.systemHistory.title"), true);
    assert.equal(source.includes("settingsCopy.lifecycle.title"), true);
    assert.equal(source.includes('DashboardCard className="p-[18px]'), false);
  });

  it("keeps secondary public content collapsible instead of long-scroll by default", () => {
    const homeSource = readFileSync("app/page.tsx", "utf8");
    const cleaningSource = readFileSync(
      "app/industries/cleaning/page.tsx",
      "utf8",
    );

    assert.equal(homeSource.includes("<details>"), true);
    assert.equal(homeSource.includes("copy.useCases.cards.map"), true);
    assert.equal(homeSource.includes("copy.faq.items.map"), true);
    assert.equal(
      cleaningSource.includes(
        "Collapsed secondary service detail/workflow panels",
      ),
      true,
    );
    assert.equal(cleaningSource.includes("<CleaningServiceDetails"), true);
  });
});
