/**
 * ============================================================
 * File: tests/unit/public-v3-spec.test.mts
 * Project: BizPilot AI
 * Description: Verifies the Website V3 bilingual content and route contract.
 * Role: Prevents route, section, CTA, and content-shape drift between English and Canadian French before UI implementation.
 * Related:
 * - lib/i18n/public-v3-spec.ts
 * - lib/i18n/language.ts
 * - docs/website-v4/CURRENT.md
 * Author: MoOoH
 * Created: 2026-07-13
 * Last Updated: 2026-07-23
 * Change Log:
 * - 2026-07-23: Guarded single-form tracked channel links, honest source reporting, richer tier value, and compact price typography.
 * - 2026-07-22: Added bilingual Premium Operations commercial, manual-review, no-auto-send, and internal-availability boundary guards.
 * - 2026-07-17: Required three bilingual proof points per product-route introduction and explanatory first-stage Demo context.
 * - 2026-07-17: Added bilingual editorial-introduction and French pilot-term quality guards for the full public redesign.
 * - 2026-07-16: Clarified that seven bilingual copy modules feed the focused five-section homepage renderer.
 * - 2026-07-15: Repointed the bilingual contract to the current Website V4 authority.
 * - 2026-07-13: Added Phase 2 parity, route, section, pricing, and product-boundary checks.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import {
  getPublicV3Spec,
  publicV3PrimaryRoutes,
} from "../../lib/i18n/public-v3-spec.ts";
import { supportedLanguages } from "../../lib/i18n/language.ts";

function contentShape(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(contentShape);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, contentShape(child)]),
    );
  }

  return typeof value;
}

describe("Website V3 bilingual content contract", () => {
  it("defines only the ten retained public marketing and legal routes", () => {
    assert.deepEqual(publicV3PrimaryRoutes, [
      "/",
      "/features",
      "/demo",
      "/pricing",
      "/pilot",
      "/faq",
      "/trust",
      "/privacy",
      "/security",
      "/terms",
    ]);

    for (const language of supportedLanguages) {
      assert.deepEqual(
        Object.keys(getPublicV3Spec(language).routes),
        publicV3PrimaryRoutes,
      );
    }
  });

  it("keeps the complete English and French content structures synchronized", () => {
    assert.deepEqual(
      contentShape(getPublicV3Spec("fr-CA")),
      contentShape(getPublicV3Spec("en")),
    );
  });

  it("keeps seven approved copy modules available to the focused homepage renderer", () => {
    const expectedKeys = [
      "hero",
      "problem",
      "workflow",
      "outcomes",
      "cleaning-demo",
      "trust",
      "final-cta",
    ];

    for (const language of supportedLanguages) {
      assert.deepEqual(
        getPublicV3Spec(language).home.sections.map((section) => section.key),
        expectedKeys,
      );
    }
  });

  it("gives every retained route complete metadata and two internal actions", () => {
    for (const language of supportedLanguages) {
      for (const route of publicV3PrimaryRoutes) {
        const copy = getPublicV3Spec(language).routes[route];

        assert.ok(copy.meta.title.trim());
        assert.ok(copy.meta.description.trim());
        assert.ok(copy.hero.eyebrow.trim());
        assert.ok(copy.hero.title.trim());
        assert.ok(copy.hero.body.trim());
        assert.match(copy.hero.primary.href, /^\//);
        assert.match(copy.hero.secondary.href, /^\//);
        assert.ok(copy.hero.primary.label.trim());
        assert.ok(copy.hero.secondary.label.trim());
      }
    }
  });

  it("gives every retained product route a synchronized editorial introduction", () => {
    const productRoutes = [
      "/features",
      "/demo",
      "/pricing",
      "/pilot",
      "/faq",
      "/trust",
    ] as const;

    for (const language of supportedLanguages) {
      for (const route of productRoutes) {
        const section = getPublicV3Spec(language).routes[route].section;

        assert.ok(section?.eyebrow.trim(), `${language} ${route} eyebrow`);
        assert.ok(section?.title.trim(), `${language} ${route} title`);
        assert.ok(section?.body.trim(), `${language} ${route} body`);
        assert.equal(
          section?.highlights.length,
          3,
          `${language} ${route} proof-point count`,
        );

        for (const highlight of section?.highlights ?? []) {
          assert.ok(highlight.label.trim(), `${language} ${route} proof label`);
          assert.ok(highlight.value.trim(), `${language} ${route} proof value`);
        }
      }
    }
  });

  it("preserves the approved workflow, capability, and control boundaries", () => {
    for (const language of supportedLanguages) {
      const spec = getPublicV3Spec(language);

      assert.deepEqual(
        spec.home.workflowSteps.map((step) => step.key),
        ["share", "ask", "organize", "review"],
      );
      assert.deepEqual(
        spec.features.map((feature) => feature.key),
        [
          "share-anywhere",
          "service-questions",
          "organized-request",
          "missing-details",
          "reply-drafts",
          "human-control",
        ],
      );
      assert.ok(spec.demo.incomingContext.trim());
      assert.match(spec.home.visual.placementNote, /not direct|pas des intégrations/i);
      assert.match(spec.demo.reviewBoundary, /no message|aucun message/i);
      assert.match(spec.pilot.submissionBoundary, /does not submit|n'envoie/i);
      assert.match(
        spec.home.sections.find((section) => section.key === "workflow")?.body ??
          "",
        /tracked link|lien suivi/i,
      );
      assert.match(
        spec.home.workflowSteps[0]?.body ?? "",
        /same Smart Intake form|même formulaire de collecte/i,
      );
      assert.match(
        spec.home.workflowSteps[2]?.body ?? "",
        /campaign tag|étiquette de campagne/i,
      );
    }
  });

  it("keeps the three approved pilot tiers and prices aligned", () => {
    const englishPricing = getPublicV3Spec("en").pricing;
    const frenchPricing = getPublicV3Spec("fr-CA").pricing;

    assert.deepEqual(
      englishPricing.tiers.map((tier) => tier.price),
      ["$0 setup", "$149 setup + $49/month", "$199 setup + $79/month"],
    );
    assert.equal(frenchPricing.tiers.length, englishPricing.tiers.length);
    assert.deepEqual(
      frenchPricing.tiers.map((tier) => tier.points.length),
      englishPricing.tiers.map((tier) => tier.points.length),
    );
    assert.match(englishPricing.notice, /No checkout/i);
    assert.match(frenchPricing.notice, /Aucun paiement/i);
    assert.doesNotMatch(
      JSON.stringify(frenchPricing),
      /\bsetup\b|\/month\b/i,
    );
  });

  it("uses a responsive price scale and keeps desktop plan prices on one line", () => {
    const styles = readFileSync(
      "components/public/public-v3-page.module.css",
      "utf8",
    );

    assert.equal(
      styles.includes(
        "font-size: clamp(1.6rem, 1.35rem + 0.65vw, 2rem);",
      ),
      true,
    );
    assert.equal(styles.includes(".price { white-space: nowrap; }"), true);
    assert.equal(
      getPublicV3Spec("en").pricing.tiers.every(
        (tier) => tier.body.length >= 140,
      ),
      true,
    );
  });

  it("presents Premium Operations as separate manual-first add-ons without invented prices", () => {
    const english = getPublicV3Spec("en");
    const french = getPublicV3Spec("fr-CA");
    const expectedKeys = [
      "priority-workbench",
      "bulk-reply-review",
      "availability-coordination",
    ];

    for (const spec of [english, french]) {
      assert.deepEqual(
        spec.premiumOperations.cards.map((card) => card.key),
        expectedKeys,
      );
      assert.equal(spec.premiumOperations.cards.length, 3);
      assert.doesNotMatch(
        JSON.stringify(spec.premiumOperations),
        /\$\s*\d|\d+\s*\$/u,
        "Premium add-on copy must not invent a dollar price.",
      );
    }

    assert.match(english.premiumOperations.body, /separately enabled, paid add-ons/i);
    assert.match(english.premiumOperations.pricingNote, /not included in the base pilot tiers/i);
    assert.match(english.premiumOperations.boundary, /reviewed and copied manually/i);
    assert.match(
      english.premiumOperations.cards[1]?.boundary ?? "",
      /no campaign delivery.*automatic send/i,
    );
    assert.match(
      english.premiumOperations.cards[2]?.boundary ?? "",
      /internal coordination only.*booking confirmation/i,
    );
    assert.match(
      english.faqItems.find((item) => item.key === "pricing")?.answer ?? "",
      /paid add-ons.*confirmed separately/i,
    );

    assert.match(
      french.premiumOperations.body,
      /modules complémentaires payants, activés séparément/i,
    );
    assert.match(french.premiumOperations.pricingNote, /pas incluses dans les tarifs de base/i);
    assert.match(french.premiumOperations.boundary, /copiées manuellement/i);
    assert.match(
      french.premiumOperations.cards[1]?.boundary ?? "",
      /aucune campagne.*envoi automatique/i,
    );
    assert.match(
      french.premiumOperations.cards[2]?.boundary ?? "",
      /coordination interne seulement.*confirmation de réservation/i,
    );
  });

  it("keeps FAQ and trust coverage complete in both languages", () => {
    for (const language of supportedLanguages) {
      const spec = getPublicV3Spec(language);

      assert.equal(spec.faqItems.length, 10);
      assert.equal(spec.trust.length, 6);
      assert.equal(new Set(spec.faqItems.map((item) => item.key)).size, 10);
      assert.equal(new Set(spec.trust.map((item) => item.key)).size, 6);
    }
  });
});
