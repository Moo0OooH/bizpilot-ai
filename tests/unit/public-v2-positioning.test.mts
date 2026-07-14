/**
 * ============================================================
 * File: tests/unit/public-v2-positioning.test.mts
 * Project: BizPilot AI
 * Description: Product-truth and bilingual-shape tests for the universal public V2.
 * Role: Prevents cleaning-only brand regression, roadmap overstatement, autonomous-AI claims, and EN/fr-CA structure drift.
 * Related:
 * - lib/i18n/public-v2-copy.ts
 * - app/page.tsx
 * - components/public/bizpilot-v2-home.tsx
 * Author: MoOoH
 * Created: 2026-07-13
 * Last Updated: 2026-07-13
 * Change Log:
 * - 2026-07-13: Aligned final social-preview assertions with the V3 hero and removed the retired roadmap-label expectation.
 * - 2026-07-13: Migrated secondary-route and shared-renderer guards from the Phase 5 transition state to completed Phase 6 V3 consolidation.
 * - 2026-07-13: Moved the homepage source guard to V3 while retained secondary pages remain on V2 until Phase 6.
 * - 2026-07-13: Aligned shared-shell coverage with the simplified V3 footer information architecture.
 * - 2026-07-13: Added regression coverage for universal guide copy, fallback metadata, and accented fr-CA JSON-LD.
 * - 2026-07-13: Added source guards for route-specific V2 page variants and grouped navigation copy.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { supportedLanguages } from "../../lib/i18n/language.ts";
import {
  getPublicV2Copy,
  PUBLIC_V2_SOURCE_LANGUAGE,
} from "../../lib/i18n/public-v2-copy.ts";
import { getPublicSiteCopy } from "../../lib/i18n/public-site-copy.ts";

type CopyShape =
  | string
  | CopyShape[]
  | {
      [key: string]: CopyShape;
    };

function sortedEntries(value: Record<string, unknown>): [string, unknown][] {
  return Object.entries(value).sort(([left], [right]) =>
    left.localeCompare(right),
  );
}

function copyShape(value: unknown): CopyShape {
  if (Array.isArray(value)) {
    return value.map(copyShape);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      sortedEntries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        copyShape(item),
      ]),
    );
  }

  return value === null ? "null" : typeof value;
}

function serialized(language: (typeof supportedLanguages)[number]): string {
  return JSON.stringify(getPublicV2Copy(language));
}

describe("public V2 positioning", () => {
  it("keeps every supported language structurally synchronized", () => {
    assert.equal(PUBLIC_V2_SOURCE_LANGUAGE, "en");
    const sourceShape = copyShape(getPublicV2Copy(PUBLIC_V2_SOURCE_LANGUAGE));

    for (const language of supportedLanguages) {
      assert.deepEqual(
        copyShape(getPublicV2Copy(language)),
        sourceShape,
        `${language} V2 copy must match the English source shape.`,
      );
    }
  });

  it("keeps the first fold universal and moves cleaning-first validation below it", () => {
    const english = getPublicV2Copy("en");
    const french = getPublicV2Copy("fr-CA");

    assert.match(english.home.hero.title, /customer requests/i);
    assert.match(english.home.hero.body, /service businesses/i);
    assert.doesNotMatch(english.home.hero.body, /starting with cleaning businesses/i);
    assert.doesNotMatch(english.home.meta.description, /starting with cleaning businesses/i);
    assert.match(english.home.industries.cards[0]?.badge ?? "", /founder pilot/i);
    assert.equal(english.home.industries.cards[0]?.title, "Cleaning");

    assert.match(french.home.hero.body, /entreprises de services/i);
    assert.doesNotMatch(french.home.hero.body, /en commençant par/i);
    assert.doesNotMatch(french.home.meta.description, /en commençant par/i);
    assert.equal(french.home.industries.cards[0]?.title, "Entretien");
  });

  it("keeps the current product anchored to one smart intake link", () => {
    for (const language of supportedLanguages) {
      const copy = getPublicV2Copy(language);
      const text = serialized(language);

      assert.equal(copy.home.hero.placements.length, 4);
      assert.equal(copy.home.flow.steps.length, 5);
      assert.equal(copy.home.features.cards.length, 6);
      assert.match(
        text,
        language === "fr-CA" ? /lien intelligent/i : /smart intake link/i,
      );
    }
  });

  it("labels direct channel integrations as roadmap instead of active", () => {
    const english = getPublicV2Copy("en");
    const french = getPublicV2Copy("fr-CA");

    assert.match(english.features.notice?.title ?? "", /not part of the current product claim/i);
    assert.match(english.features.notice?.body ?? "", /roadmap/i);
    assert.match(english.faq.items[0]?.answer ?? "", /No\./);
    assert.match(english.faq.items[0]?.answer ?? "", /roadmap items/i);

    assert.match(french.features.notice?.body ?? "", /feuille de route/i);
    assert.match(french.faq.items[0]?.answer ?? "", /^Non\./);
    assert.match(french.faq.items[0]?.answer ?? "", /feuille de route/i);
  });

  it("protects owner approval and rejects autonomous business decisions", () => {
    for (const language of supportedLanguages) {
      const text = serialized(language);
      const faq = getPublicV2Copy(language).faq.items;

      assert.match(
        text,
        language === "fr-CA" ? /aucun envoi automatique/i : /no auto-send/i,
      );
      assert.match(
        faq[1]?.answer ?? "",
        language === "fr-CA" ? /^Non\./ : /^No\./,
      );
      assert.match(
        faq[2]?.answer ?? "",
        language === "fr-CA" ? /n’invente pas de prix/i : /does not invent pricing/i,
      );
    }
  });

  it("keeps the product before CRM and before confirmed booking", () => {
    const english = getPublicV2Copy("en");

    assert.match(english.comparison.badge, /Before CRM/i);
    assert.match(english.comparison.body, /booking software handles confirmed work/i);
    assert.match(english.comparison.notice?.title ?? "", /does not auto-book/i);
    assert.match(english.faq.items[5]?.answer ?? "", /without trying to replace a full CRM/i);
  });

  it("keeps approved pilot pricing and manual billing boundaries", () => {
    const englishPricing = getPublicV2Copy("en").pricing;
    const text = JSON.stringify(englishPricing);

    for (const approvedValue of [
      "$0 setup",
      "$149 setup + $49/month",
      "$199 setup + $79/month",
    ]) {
      assert.equal(text.includes(approvedValue), true, `Missing approved value ${approvedValue}.`);
    }

    assert.match(englishPricing.body, /no self-serve checkout/i);
    assert.match(englishPricing.notice?.body ?? "", /manual invoice or Stripe Payment Link/i);
    assert.match(englishPricing.notice?.body ?? "", /does not currently offer in-app billing automation/i);
  });

  it("keeps the homepage and retained secondary routes on V3 after Phase 6", () => {
    const homepage = readFileSync("app/page.tsx", "utf8");
    assert.equal(homepage.includes("getPublicV3Spec"), true);
    assert.equal(homepage.includes("PublicV3Home"), true);
    assert.equal(homepage.includes("buildHomeJsonLd(language)"), true);

    const sourceFiles = [
      "app/features/page.tsx",
      "app/demo/page.tsx",
      "app/pricing/page.tsx",
      "app/pilot/page.tsx",
      "app/trust/page.tsx",
      "app/faq/page.tsx",
      "app/privacy/page.tsx",
      "app/security/page.tsx",
      "app/terms/page.tsx",
    ] as const;

    for (const file of sourceFiles) {
      assert.equal(
        readFileSync(file, "utf8").includes("getPublicV3Spec"),
        true,
        `${file} must read the public V3 dictionary.`,
      );
    }

    const structuredData = readFileSync("lib/public-structured-data.ts", "utf8");
    const socialPreview = readFileSync("app/opengraph-image.tsx", "utf8");
    const rootLayout = readFileSync("app/layout.tsx", "utf8");

    assert.equal(structuredData.includes("smart customer intake"), true);
    assert.equal(structuredData.includes("cleaning business founder pilot"), true);
    assert.equal(socialPreview.includes("scattered customer messages"), true);
    assert.equal(socialPreview.includes("Human-reviewed drafts"), true);
    assert.equal(socialPreview.includes("Roadmap integrations labeled"), false);
    assert.equal(rootLayout.includes("Smart Customer Intake & Reply Workspace"), true);
    assert.equal(rootLayout.includes("Lead Recovery for Cleaning Businesses"), false);
    assert.equal(structuredData.includes("prépare des brouillons assistés par IA à valider"), true);
    assert.equal(structuredData.includes("Espace intelligent de demandes client et de réponses"), true);
  });

  it("keeps the educational guides universal while the demo and pilot remain cleaning-first", () => {
    const english = getPublicSiteCopy("en");
    const french = getPublicSiteCopy("fr-CA");

    assert.match(english.quoteLinkGuide.title, /customer intake/i);
    assert.match(english.replySpeedGuide.title, /customer replies/i);
    assert.match(english.quoteLinkGuide.meta.title, /customer intake/i);
    assert.match(english.replySpeedGuide.meta.title, /customer replies/i);
    assert.match(french.quoteLinkGuide.title, /lien intelligent/i);
    assert.match(french.replySpeedGuide.meta.title, /demandes client/i);
    assert.match(english.demo.body, /move-out cleaning/i);
    assert.match(english.pilot.title, /cleaning/i);
  });

  it("keeps core pages visually differentiated without duplicating route renderers", () => {
    const renderer = readFileSync("components/public/public-v3-page.tsx", "utf8");
    const header = readFileSync("components/public/marketing-ui.tsx", "utf8");
    const redirects = readFileSync("next.config.ts", "utf8");

    for (const marker of [
      "FeaturesContent",
      "DemoContent",
      "PricingContent",
      "PilotContent",
      "FaqContent",
      "TrustContent",
    ]) {
      assert.match(renderer, new RegExp(marker));
    }

    for (const removedRoute of [
      "/comparison",
      "/quote-link-guide",
      "/faster-quote-replies",
      "/content-studio",
      "/industries/cleaning",
    ]) {
      assert.doesNotMatch(header, new RegExp(`href: "${removedRoute}"`));
      assert.match(redirects, new RegExp(`source: "${removedRoute.replaceAll("/", "\\/")}"`));
    }
  });
});
