/*
 * ============================================================
 * File: tests/unit/public-v2-french-copy.test.mts
 * Project: BizPilot AI
 * Description: Canadian French completeness and parity guards for the public V2.
 * Role: Prevents English section inheritance, missing French accents, roadmap drift, and legacy navigation on public supporting routes.
 * Related:
 * - lib/i18n/public-v2-copy.ts
 * - lib/i18n/public-v2-fr-copy.ts
 * - app/privacy/page.tsx
 * Author: MoOoH
 * Created: 2026-07-13
 * Last Updated: 2026-07-13
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { getPublicV2Copy } from "../../lib/i18n/public-v2-copy.ts";

function source(path: string): string {
  return readFileSync(path, "utf8");
}

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectStrings);
  }

  if (value && typeof value === "object") {
    return Object.values(value).flatMap(collectStrings);
  }

  return [];
}

describe("public V2 Canadian French copy", () => {
  it("uses the complete fr-CA builder at runtime", () => {
    const dictionary = source("lib/i18n/public-v2-copy.ts");
    const french = source("lib/i18n/public-v2-fr-copy.ts");

    assert.equal(dictionary.includes("buildPublicV2FrenchCopy"), true);
    assert.equal(french.includes("export function buildPublicV2FrenchCopy"), true);
    assert.equal(french.includes("Complete Canadian French copy"), true);
  });

  it("keeps all major pages fully localized instead of inheriting English sections", () => {
    const french = getPublicV2Copy("fr-CA");
    const text = collectStrings(french).join("\n");

    for (const forbidden of [
      "Current product",
      "Everything needed to turn a vague request",
      "Capture",
      "Organize",
      "Use AI as a prepared starting point",
      "Current cleaning demo",
      "Founder-pilot terms",
      "Cleaning businesses first",
      "Trust by product boundary",
      "Before CRM. After messy requests.",
      "First complete vertical",
      "Straight answers",
      "Watch the demo",
      "Apply for the pilot",
      "Roadmap template",
    ]) {
      assert.equal(
        text.includes(forbidden),
        false,
        `fr-CA should not contain inherited English copy: ${forbidden}`,
      );
    }

    assert.equal(french.features.sections.length, 3);
    assert.equal(french.demo.sections.length, 3);
    assert.equal(french.pricing.sections.length, 2);
    assert.equal(french.pilot.sections.length, 2);
    assert.equal(french.trust.sections.length, 2);
    assert.equal(french.comparison.sections.length, 1);
    assert.equal(french.cleaning.sections[0]?.cards.length, 6);
    assert.equal(french.faq.items.length, 6);
  });

  it("uses readable Canadian French accents and product terminology", () => {
    const french = getPublicV2Copy("fr-CA");
    const text = collectStrings(french).join("\n");

    for (const required of [
      "réponses",
      "accès",
      "Démo",
      "Sécurité",
      "Confidentialité",
      "réservés",
      "renseignements manquants",
      "feuille de route",
      "propriétaire",
      "brouillon assisté par l’IA",
      "entreprises d’entretien",
    ]) {
      assert.equal(text.includes(required), true, required);
    }
  });

  it("keeps current-product and roadmap claims equivalent in fr-CA", () => {
    const french = getPublicV2Copy("fr-CA");

    assert.match(french.features.notice?.badge ?? "", /Feuille de route/i);
    assert.match(
      french.features.notice?.body ?? "",
      /Gmail, WhatsApp, Instagram, Messenger et aux SMS/i,
    );
    assert.match(
      french.features.notice?.body ?? "",
      /après validation/i,
    );
    assert.match(french.trust.sections[0]?.cards[0]?.title ?? "", /Aucun envoi automatique/i);
    assert.match(french.trust.sections[0]?.cards[1]?.title ?? "", /Aucun prix inventé/i);
    assert.match(french.comparison.notice?.title ?? "", /ne réserve pas automatiquement/i);
    assert.match(french.pilot.notice?.badge ?? "", /Porte d’approbation/i);
  });

  it("keeps supporting and policy routes on the V2 navigation source", () => {
    for (const file of [
      "app/content-studio/page.tsx",
      "app/quote-link-guide/page.tsx",
      "app/faster-quote-replies/page.tsx",
      "app/privacy/page.tsx",
      "app/security/page.tsx",
      "app/terms/page.tsx",
    ]) {
      const route = source(file);
      assert.equal(route.includes("getPublicV2NavCopy"), true, file);
      assert.equal(route.includes("getHomeCopy"), false, file);
    }
  });

  it("keeps fallback metadata and navigation aligned with the V2 category", () => {
    const seo = source("lib/seo.ts");
    const marketingUi = source("components/public/marketing-ui.tsx");

    assert.equal(
      seo.includes("BizPilot AI smart customer intake and reply workspace preview"),
      true,
    );
    assert.equal(seo.includes("lead recovery workspace preview"), false);
    assert.equal(
      marketingUi.includes("Smart customer intake and reply workspace"),
      true,
    );
    assert.equal(
      marketingUi.includes("Lead recovery for cleaning businesses"),
      false,
    );
  });
});
