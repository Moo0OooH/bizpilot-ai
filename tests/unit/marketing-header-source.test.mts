/**
 * ============================================================
 * File: tests/unit/marketing-header-source.test.mts
 * Project: BizPilot AI
 * Description: Source-level checks for public marketing header contracts.
 * Role: Protects compact navigation, locale, and active-route behavior during final public polish.
 * Related:
 * - components/public/marketing-ui.tsx
 * - components/public/marketing-language-menu.tsx
 * - components/public/marketing-compact-menu.tsx
 * Author: MoOoH
 * Created: 2026-06-19
 * Last Updated: 2026-06-21
 * Change Log:
 * - 2026-06-19: Added Phase 02 header/navigation source contract coverage.
 * - 2026-06-21: Added public acceptance guards for duplicate pilot CTA markup.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const marketingUiSource = readFileSync(
  "components/public/marketing-ui.tsx",
  "utf8",
);
const languageMenuSource = readFileSync(
  "components/public/marketing-language-menu.tsx",
  "utf8",
);
const compactMenuSource = readFileSync(
  "components/public/marketing-compact-menu.tsx",
  "utf8",
);

describe("public marketing header source contract", () => {
  it("keeps the final public navigation order", () => {
    const expectedOrder = [
      'key: "features"',
      'key: "cleaning"',
      'key: "trust"',
      'key: "demo"',
      'key: "pricing"',
      'key: "pilot"',
    ];

    let previousIndex = -1;
    for (const marker of expectedOrder) {
      const nextIndex = marketingUiSource.indexOf(marker);
      assert.notEqual(nextIndex, -1, `${marker} missing from MarketingHeader`);
      assert.ok(nextIndex > previousIndex, `${marker} is out of order`);
      previousIndex = nextIndex;
    }
  });

  it("uses content-fit header behavior without truncating the brand tagline", () => {
    assert.match(marketingUiSource, /min-\[1240px\]:flex/);
    assert.match(marketingUiSource, /min-\[1240px\]:block/);
    assert.match(marketingUiSource, /Lead recovery for cleaning businesses/);
    assert.equal(marketingUiSource.includes("truncate"), false);
  });

  it("uses compact utility controls and active route state", () => {
    assert.match(marketingUiSource, /MarketingLanguageMenu/);
    assert.match(marketingUiSource, /ThemePreferenceControl/);
    assert.match(marketingUiSource, /aria-current=\{selected \? "page"/);
    assert.equal(marketingUiSource.includes("supportedLanguages.map"), false);
  });

  it("keeps compact and desktop pilot CTAs from duplicating visible shell markup", () => {
    assert.equal(
      marketingUiSource.includes('className="hidden sm:block min-[1240px]:hidden"'),
      false,
      "MarketingHeader should not keep the old standalone compact pilot CTA wrapper.",
    );
    assert.match(
      marketingUiSource,
      /\{copy\.startFull\}\r?\n\s+<\/MarketingButton>/,
      "Desktop header should keep one full pilot CTA.",
    );
    assert.match(
      marketingUiSource,
      /\{copy\.startShort\}\r?\n\s+<\/MarketingButton>/,
      "Compact menu should use the short pilot CTA.",
    );
    assert.equal(
      marketingUiSource.match(/<MarketingButton[^>]+href="\/pilot"/g)?.length,
      2,
      "MarketingHeader should expose only desktop and compact-menu pilot CTA buttons.",
    );
  });

  it("keeps language switching as a compact menu that preserves anchors", () => {
    assert.match(languageMenuSource, /aria-haspopup="menu"/);
    assert.match(languageMenuSource, /role="menuitemradio"/);
    assert.match(languageMenuSource, /window\.location\.hash/);
    assert.match(languageMenuSource, /languageNativeLabels/);
  });

  it("keeps the compact disclosure keyboard-safe", () => {
    assert.match(compactMenuSource, /aria-expanded=\{open\}/);
    assert.match(compactMenuSource, /buttonRef/);
    assert.match(compactMenuSource, /Escape/);
    assert.match(compactMenuSource, /requestAnimationFrame/);
  });
});
