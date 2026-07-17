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
 * Last Updated: 2026-07-17
 * Change Log:
 * - 2026-07-17: Updated brand-lockup guards for the concise responsive tagline and dedicated CSS visibility contract.
 * - 2026-07-16: Locked both header pilot actions to the truthful copy-only application anchor.
 * - 2026-07-14: Moved the desktop threshold to 1180px after simplifying the retained navigation.
 * - 2026-07-13: Locked deterministic locale links, the measured 1440px desktop threshold, and the compact final navigation architecture.
 * - 2026-06-19: Added Phase 02 header/navigation source contract coverage.
 * - 2026-06-21: Added public acceptance guards for duplicate pilot CTA markup.
 * - 2026-07-04: Added comparison route navigation guard.
 * - 2026-07-13: Locked grouped Product, Use cases, and Resources navigation with complete mobile exposure.
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
  it("keeps the final grouped public navigation order", () => {
    assert.match(marketingUiSource, /directItems\.map/);
    assert.match(marketingUiSource, /navGroups\.map/);
    assert.match(marketingUiSource, /label: copy\.resources/);
    assert.match(marketingUiSource, /href: "\/features"/);
    assert.match(marketingUiSource, /href: "\/#how-it-works"/);
    assert.match(marketingUiSource, /href: "\/demo"/);
    assert.match(marketingUiSource, /href: "\/pricing"/);
    assert.match(marketingUiSource, /href: "\/faq"/);
    assert.match(marketingUiSource, /href: "\/trust"/);
    assert.match(marketingUiSource, /navGroups\.map\(\(group\) => \(/);
  });

  it("uses content-fit header behavior without truncating the brand tagline", () => {
    assert.match(marketingUiSource, /min-\[1180px\]:flex/);
    assert.match(marketingUiSource, /v3-brand-subtitle/);
    assert.match(marketingUiSource, /Smart requests\. Human review\./);
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
      /\{copy\.startShort\}\r?\n\s+<\/MarketingButton>/,
      "Desktop header should keep one compact pilot CTA.",
    );
    assert.match(
      marketingUiSource,
      /\{copy\.startShort\}\r?\n\s+<\/MarketingButton>/,
      "Compact menu should use the short pilot CTA.",
    );
    assert.equal(
      marketingUiSource.match(/<MarketingButton[^>]+href="\/pilot#application"/g)?.length,
      2,
      "MarketingHeader should expose only desktop and compact-menu pilot CTA buttons.",
    );
  });

  it("keeps language switching as a compact menu that preserves anchors", () => {
    assert.match(languageMenuSource, /aria-haspopup="menu"/);
    assert.match(languageMenuSource, /role="menuitemradio"/);
    assert.match(languageMenuSource, /window\.location\.hash/);
    assert.match(languageMenuSource, /languageNativeLabels/);
    assert.match(languageMenuSource, /href=\{publicLanguageHref\(navigationTarget, option\)\}/);
    assert.match(languageMenuSource, /<a\s+aria-checked=\{selected\}/);
    assert.equal(languageMenuSource.includes('import Link from "next/link"'), false);
    assert.equal(languageMenuSource.includes("setInterfaceLanguageAction"), false);
    assert.equal(languageMenuSource.includes("type=\"submit\""), false);
  });

  it("keeps the compact disclosure keyboard-safe", () => {
    assert.match(compactMenuSource, /aria-expanded=\{open\}/);
    assert.match(compactMenuSource, /buttonRef/);
    assert.match(compactMenuSource, /Escape/);
    assert.match(compactMenuSource, /requestAnimationFrame/);
    assert.equal(compactMenuSource.includes("max-h-[calc(100dvh"), true);
    assert.equal(compactMenuSource.includes("overflow-y-auto"), true);
  });
});
