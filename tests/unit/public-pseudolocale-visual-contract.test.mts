/**
 * ============================================================
 * File: tests/unit/public-pseudolocale-visual-contract.test.mts
 * Project: BizPilot AI
 * Description: Test-only pseudolocale and public visual contract guards.
 * Role: Ensures en-XA expansion coverage without exposing it in production language menus.
 * Related:
 * - lib/i18n/language.ts
 * - lib/i18n/public-site-copy.ts
 * - app/globals.css
 * Author: MoOoH
 * Created: 2026-06-21
 * Last Updated: 2026-06-21
 * Change Log:
 * - 2026-06-21: Added accented pseudolocale output and final UI matrix source contracts.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import {
  languageDefinitions,
  supportedLanguages,
} from "../../lib/i18n/language.ts";
import { getPolicyCopy } from "../../lib/i18n/policy-copy.ts";
import { getPublicSiteCopy } from "../../lib/i18n/public-site-copy.ts";

type CopyValue =
  | string
  | readonly CopyValue[]
  | {
      readonly [key: string]: CopyValue;
    };

const TEST_PSEUDO_LOCALE = "en-XA";
const protectedTokenPattern =
  /(\{[^}]+\}|%[sdifjoO]|https?:\/\/[^\s]+|\$[0-9][\w./-]*)/g;
const accentMap: Record<string, string> = {
  A: "Å",
  E: "É",
  I: "Ï",
  O: "Ø",
  U: "Û",
  a: "å",
  e: "é",
  i: "ï",
  o: "ø",
  u: "û",
};
const pseudoAccentPattern = /[ÅÉÏØÛåéïøû]/;
const requiredViewportMatrix = [
  "320x568",
  "360x800",
  "390x844",
  "430x932",
  "768x1024",
  "1024x768",
  "1280x720",
  "1366x768",
  "1440x900",
  "1920x1080",
] as const;

function pseudoLocalizeString(value: string): string {
  const parts = value.split(protectedTokenPattern);
  const transformed = parts
    .map((part) => {
      if (!part || protectedTokenPattern.test(part)) {
        protectedTokenPattern.lastIndex = 0;
        return part;
      }

      protectedTokenPattern.lastIndex = 0;
      return [...part]
        .map((character) => accentMap[character] ?? character)
        .join("");
    })
    .join("");
  const targetLength = Math.ceil(value.length * 1.38);
  const padding = "~".repeat(Math.max(0, targetLength - transformed.length));

  return `[${transformed}${padding}]`;
}

function pseudoLocalizeCopy<T extends CopyValue>(value: T): T {
  if (typeof value === "string") {
    return pseudoLocalizeString(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => pseudoLocalizeCopy(item)) as unknown as T;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      pseudoLocalizeCopy(item as CopyValue),
    ]),
  ) as T;
}

function expansionRatio(source: string, expanded: string): number {
  return expanded.length / source.length;
}

describe("public pseudolocale visual contracts", () => {
  it("keeps en-XA test-only and out of production language surfaces", () => {
    const languageSource = readFileSync("lib/i18n/language.ts", "utf8");
    const languageMenuSource = readFileSync(
      "components/public/marketing-language-menu.tsx",
      "utf8",
    );

    assert.equal(supportedLanguages.includes(TEST_PSEUDO_LOCALE as never), false);
    assert.equal(TEST_PSEUDO_LOCALE in languageDefinitions, false);
    assert.equal(languageSource.includes(TEST_PSEUDO_LOCALE), false);
    assert.equal(languageMenuSource.includes(TEST_PSEUDO_LOCALE), false);
  });

  it("expands important public strings while preserving placeholders and tokens", () => {
    const sample =
      "Hello {ownerName}, keep $49/month and https://example.test intact: %s";
    const expandedSample = pseudoLocalizeString(sample);

    for (const token of ["{ownerName}", "$49/month", "https://example.test", "%s"]) {
      assert.equal(expandedSample.includes(token), true);
    }
    assert.match(expandedSample, pseudoAccentPattern);

    const publicCopy = getPublicSiteCopy("en");
    const pseudoCopy = pseudoLocalizeCopy(publicCopy);
    const sourceStrings = [
      publicCopy.home.hero.title,
      publicCopy.home.hero.body,
      publicCopy.home.mockup.draftBody,
      publicCopy.features.title,
      publicCopy.cleaning.title,
      publicCopy.pricing.title,
      publicCopy.pricing.cards[1]?.highlight ?? "",
      publicCopy.pilot.conversion.template,
      getPolicyCopy("en").privacy.title,
    ];
    const pseudoStrings = [
      pseudoCopy.home.hero.title,
      pseudoCopy.home.hero.body,
      pseudoCopy.home.mockup.draftBody,
      pseudoCopy.features.title,
      pseudoCopy.cleaning.title,
      pseudoCopy.pricing.title,
      pseudoCopy.pricing.cards[1]?.highlight ?? "",
      pseudoCopy.pilot.conversion.template,
      pseudoLocalizeCopy(getPolicyCopy("en").privacy.title),
    ];

    for (const [index, source] of sourceStrings.entries()) {
      const ratio = expansionRatio(source, pseudoStrings[index] ?? "");
      assert.equal(
        ratio >= 1.35 && ratio <= 1.55,
        true,
        `Pseudo expansion ratio ${ratio.toFixed(2)} for ${source}`,
      );
      assert.match(
        pseudoStrings[index] ?? "",
        pseudoAccentPattern,
        `Pseudo string should include accented expansion characters for ${source}`,
      );
    }
  });

  it("keeps final UI matrix coverage tied to visual and bilingual contracts", () => {
    const matrixSmoke = readFileSync(
      "tests/smoke/final-ui-matrix-smoke.mts",
      "utf8",
    );

    for (const viewport of requiredViewportMatrix) {
      assert.equal(
        matrixSmoke.includes(`"${viewport}"`),
        true,
        `Final UI matrix missing viewport ${viewport}`,
      );
    }

    for (const required of [
      'type Locale = "en" | "fr-CA"',
      'const TEST_PSEUDO_LOCALE = "en-XA"',
      'const themeMatrix = ["light", "dark"]',
      "test pseudolocale falls back to production English",
      "no stale header control text",
      "no missing-copy artifacts",
      "no pseudolocale exposed",
      "cleaning has six compact cards",
      "cleaning has desktop tabs and mobile accordion",
      "pricing has three plan cards",
      "pricing CTAs anchored",
      "external link target/rel",
      "internal links same tab",
      "sitemap localized alternates",
      "robots excludes private/intake paths",
    ]) {
      assert.equal(
        matrixSmoke.includes(required),
        true,
        `Final UI matrix should not be HTTP-only; missing ${required}`,
      );
    }
  });

  it("keeps visual measurement hooks available for multilingual browser contracts", () => {
    const globals = readFileSync("app/globals.css", "utf8");
    const matrixSmoke = readFileSync(
      "tests/smoke/final-ui-matrix-smoke.mts",
      "utf8",
    );

    for (const required of [
      ".bp-copy-hero",
      ".bp-copy-button",
      ".bp-copy-status",
      ".cleaning-service-grid",
      ".public-pricing-grid",
      "data-theme",
      "themeMatrix",
      TEST_PSEUDO_LOCALE,
    ]) {
      assert.equal(
        globals.includes(required) || matrixSmoke.includes(required),
        true,
        `Visual contract hook missing ${required}`,
      );
    }
  });
});
