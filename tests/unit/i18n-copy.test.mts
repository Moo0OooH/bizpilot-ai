/**
 * ============================================================
 * File: tests/unit/i18n-copy.test.mts
 * Project: BizPilot AI
 * Description: Tests MVP-safe language dictionary helpers.
 * Role: Verifies quote-field localization, option labels, and safe public intake messages.
 * Related:
 * - lib/i18n/bizpilot-copy.ts
 * - lib/i18n/language.ts
 * Author: MoOoH
 * Created: 2026-05-23
 * Last Updated: 2026-06-21
 * Change Log:
 * - 2026-06-20: Added public-grid balance and forced-height regression checks.
 * - 2026-06-21: Added fr-CA public shell accent regression checks.
 * - 2026-06-21: Added canonical four-step public grid coverage.
 * - 2026-06-21: Added multilingual copy length budgets for hero and pricing parity.
 * - 2026-06-21: Added fr-CA public policy accent and meaning guards.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import {
  BIZPILOT_COPY_SOURCE_LANGUAGE,
  bizPilotCopyNamespaces,
  getBizPilotCopy,
  getQuoteOptionLabel,
  isSafePublicIntakeMessage,
  localizeDefaultQuoteField,
  resolveConsentNoticeForLanguage,
} from "../../lib/i18n/bizpilot-copy.ts";
import {
  getHomeCopy,
  HOME_COPY_SOURCE_LANGUAGE,
  homeCopyNamespaces,
} from "../../lib/i18n/home-copy.ts";
import {
  getPricingCopy,
  PRICING_COPY_SOURCE_LANGUAGE,
  pricingCopyNamespaces,
} from "../../lib/i18n/pricing-copy.ts";
import {
  getPolicyCopy,
  POLICY_COPY_SOURCE_LANGUAGE,
} from "../../lib/i18n/policy-copy.ts";
import {
  getPublicSiteCopy,
  PUBLIC_SITE_COPY_SOURCE_LANGUAGE,
  publicSiteCopyNamespaces,
} from "../../lib/i18n/public-site-copy.ts";
import {
  languageDefinitions,
  resolveWorkspaceInterfaceLanguage,
  supportedLanguages,
} from "../../lib/i18n/language.ts";

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

  if (typeof value === "function") {
    return `function:${value.length}`;
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

const userFacingSourceFiles = [
  "lib/i18n/language.ts",
  "lib/i18n/bizpilot-copy.ts",
  "lib/i18n/home-copy.ts",
  "lib/i18n/pricing-copy.ts",
  "lib/i18n/policy-copy.ts",
  "lib/i18n/public-site-copy.ts",
  "app/(dashboard)/layout.tsx",
  "app/(dashboard)/dashboard/page.tsx",
  "app/(dashboard)/dashboard/leads/[leadId]/page.tsx",
  "app/(dashboard)/dashboard/leads/page.tsx",
  "app/(dashboard)/dashboard/settings/page.tsx",
  "app/(dashboard)/dashboard/business-profile/page.tsx",
  "app/(dashboard)/dashboard/configuration/page.tsx",
  "components/dashboard/lead-workspace-queue.tsx",
  "components/dashboard/workspace-deletion-request-form.tsx",
] as const;

const dashboardSourceFiles = userFacingSourceFiles.filter((file) =>
  file.startsWith("app/(dashboard)") || file.startsWith("components/dashboard"),
);

const finalPublicRouteSourceFiles = [
  "app/page.tsx",
  "app/features/page.tsx",
  "app/industries/cleaning/page.tsx",
  "app/trust/page.tsx",
  "app/demo/page.tsx",
  "app/pricing/page.tsx",
  "app/pilot/page.tsx",
  "app/content-studio/page.tsx",
  "app/privacy/page.tsx",
  "app/security/page.tsx",
  "app/terms/page.tsx",
  "app/auth/sign-in/page.tsx",
  "app/auth/sign-up/page.tsx",
  "app/auth/forgot-password/page.tsx",
  "app/auth/reset-password/page.tsx",
  "app/auth/check-email/page.tsx",
  "app/(public)/quote/[slug]/page.tsx",
  "components/public/quote-form-wizard.tsx",
] as const;

const mojibakePattern =
  /(?:\u00c3[\u0080-\u00bf]|\u00c2[\u0080-\u00bf]|\u00e2[\u0080-\uffff]|\ufffd)/u;

describe("BizPilot language copy", () => {
  it("keeps supported languages in the central registry", () => {
    assert.equal(BIZPILOT_COPY_SOURCE_LANGUAGE, "en");
    assert.equal(new Set(supportedLanguages).size, supportedLanguages.length);
    assert.equal(supportedLanguages.includes("en"), true);
    assert.equal(supportedLanguages.includes("fr-CA"), true);
    assert.equal(languageDefinitions.en.nativeLabel, "English");
    assert.equal(languageDefinitions["fr-CA"].nativeLabel, "Français (Canada)");
    assert.equal(
      languageDefinitions["fr-CA"].aiInstruction,
      "Canadian French for a Quebec cleaning business",
    );
  });

  it("uses workspace language as the authenticated dashboard source of truth", () => {
    assert.equal(
      resolveWorkspaceInterfaceLanguage({
        businessLanguage: "fr-CA",
        cookieLanguage: "en",
      }),
      "fr-CA",
    );
    assert.equal(
      resolveWorkspaceInterfaceLanguage({
        cookieLanguage: "fr-CA",
      }),
      "fr-CA",
    );
    assert.equal(
      resolveWorkspaceInterfaceLanguage({
        businessLanguage: "unsupported",
        cookieLanguage: "unsupported",
      }),
      "en",
    );
  });

  it("keeps localized user-facing source free from mojibake artifacts", () => {
    for (const file of userFacingSourceFiles) {
      assert.equal(
        mojibakePattern.test(readFileSync(file, "utf8")),
        false,
        `${file} contains likely mojibake. Re-save as UTF-8 and keep visible copy in the dictionary.`,
      );
    }
  });

  it("keeps dashboard UI language branching out of routes and components", () => {
    for (const file of dashboardSourceFiles) {
      const source = readFileSync(file, "utf8");
      assert.equal(
        source.includes('=== "fr-CA"') || source.includes("=== 'fr-CA'"),
        false,
        `${file} should use getBizPilotCopy(...) instead of local language conditionals.`,
      );
    }
  });

  it("keeps dashboard language switching and demo leads centralized", () => {
    const topbar = readFileSync(
      "components/dashboard/dashboard-topbar.tsx",
      "utf8",
    );
    const queue = readFileSync(
      "components/dashboard/lead-workspace-queue.tsx",
      "utf8",
    );

    assert.equal(topbar.includes("updateWorkspaceLanguageAction"), true);
    assert.equal(topbar.includes("setInterfaceLanguageAction"), false);
    assert.equal(queue.includes("copy.demo.sampleLeads"), true);
    assert.equal(queue.includes("const sampleLeads = ["), false);
  });

  it("keeps demo queue sample leads in the selected language", () => {
    const englishDemo = getBizPilotCopy("en").demo.sampleLeads
      .map((lead) => `${lead.area} ${lead.customer} ${lead.detail} ${lead.status}`)
      .join(" ");
    const frenchDemo = getBizPilotCopy("fr-CA").demo.sampleLeads
      .map((lead) => `${lead.area} ${lead.customer} ${lead.detail} ${lead.status}`)
      .join(" ");

    assert.equal(
      /Nettoyage|Réponse|Brouillon|Infos manquantes|Suivi dû/u.test(
        englishDemo,
      ),
      false,
    );
    assert.equal(
      /Move-out|Deep clean|Weekly cleaning|Missing info|Draft ready|Follow-up due|Office Manager/u.test(
        frenchDemo,
      ),
      false,
    );
  });

  it("keeps every supported language structurally synced with source copy", () => {
    const sourceCopy = getBizPilotCopy(BIZPILOT_COPY_SOURCE_LANGUAGE);
    const sourceShape = copyShape(sourceCopy);

    for (const language of supportedLanguages) {
      assert.deepEqual(
        copyShape(getBizPilotCopy(language)),
        sourceShape,
        `${language} copy must match the ${BIZPILOT_COPY_SOURCE_LANGUAGE} copy shape.`,
      );
    }
  });

  it("keeps homepage copy structurally synced for every supported language", () => {
    assert.equal(HOME_COPY_SOURCE_LANGUAGE, "en");
    const sourceCopy = getHomeCopy(HOME_COPY_SOURCE_LANGUAGE);
    const sourceShape = copyShape(sourceCopy);

    for (const language of supportedLanguages) {
      assert.deepEqual(
        copyShape(getHomeCopy(language)),
        sourceShape,
        `${language} homepage copy must match the ${HOME_COPY_SOURCE_LANGUAGE} homepage copy shape.`,
      );
    }
  });

  it("keeps pricing and FAQ copy structurally synced for every supported language", () => {
    assert.equal(PRICING_COPY_SOURCE_LANGUAGE, "en");
    const sourceCopy = getPricingCopy(PRICING_COPY_SOURCE_LANGUAGE);
    const sourceShape = copyShape(sourceCopy);

    for (const language of supportedLanguages) {
      assert.deepEqual(
        copyShape(getPricingCopy(language)),
        sourceShape,
        `${language} pricing copy must match the ${PRICING_COPY_SOURCE_LANGUAGE} pricing copy shape.`,
      );
    }
  });

  it("keeps public policy copy structurally synced for every supported language", () => {
    assert.equal(POLICY_COPY_SOURCE_LANGUAGE, "en");
    const sourceCopy = getPolicyCopy(POLICY_COPY_SOURCE_LANGUAGE);
    const sourceShape = copyShape(sourceCopy);

    for (const language of supportedLanguages) {
      assert.deepEqual(
        copyShape(getPolicyCopy(language)),
        sourceShape,
        `${language} policy copy must match the ${POLICY_COPY_SOURCE_LANGUAGE} policy copy shape.`,
      );
    }
  });

  it("keeps final public-site copy structurally synced for every supported language", () => {
    assert.equal(PUBLIC_SITE_COPY_SOURCE_LANGUAGE, "en");
    const sourceCopy = getPublicSiteCopy(PUBLIC_SITE_COPY_SOURCE_LANGUAGE);
    const sourceShape = copyShape(sourceCopy);

    for (const language of supportedLanguages) {
      assert.deepEqual(
        copyShape(getPublicSiteCopy(language)),
        sourceShape,
        `${language} public-site copy must match the ${PUBLIC_SITE_COPY_SOURCE_LANGUAGE} public-site copy shape.`,
      );
    }
  });

  it("keeps final public routes wired to dictionaries instead of hardcoded marketing copy", () => {
    const dictionaryBackedRoutes = finalPublicRouteSourceFiles.filter(
      (file) =>
        !file.includes("quote-form-wizard") &&
        !file.includes("/privacy/") &&
        !file.includes("/security/") &&
        !file.includes("/terms/"),
    );

    for (const file of dictionaryBackedRoutes) {
      const source = readFileSync(file, "utf8");
      assert.equal(
        source.includes("getPublicSiteCopy"),
        true,
        `${file} should read public route copy from the public-site dictionary.`,
      );
    }

    for (const file of [
      "app/privacy/page.tsx",
      "app/security/page.tsx",
      "app/terms/page.tsx",
    ]) {
      const source = readFileSync(file, "utf8");
      assert.equal(
        source.includes("getPolicyCopy"),
        true,
        `${file} should read public policy copy from the policy dictionary.`,
      );
      assert.equal(
        source.includes("generateMetadata"),
        true,
        `${file} should expose language-aware metadata.`,
      );
    }

    const homepageSource = readFileSync("app/page.tsx", "utf8");
    for (const phrase of [
      "Stop losing cleaning quote requests to slow replies.",
      "Messages get buried",
      "Your next customer may already be waiting.",
      "AI drafts. You decide.",
    ]) {
      assert.equal(
        homepageSource.includes(phrase),
        false,
        `app/page.tsx should not keep hardcoded homepage phrase: ${phrase}`,
      );
    }

    const quoteWizardSource = readFileSync(
      "components/public/quote-form-wizard.tsx",
      "utf8",
    );
    assert.equal(
      quoteWizardSource.includes("copy.quoteForm.guardrail"),
      true,
      "Quote form guardrail copy should follow the selected quote language.",
    );

    const proxySource = readFileSync("proxy.ts", "utf8");
    for (const authPath of [
      "/auth/sign-in",
      "/auth/sign-up",
      "/auth/forgot-password",
      "/auth/reset-password",
      "/auth/check-email",
    ]) {
      assert.equal(
        proxySource.includes(authPath),
        true,
        `proxy.ts should apply language query cookies to ${authPath}.`,
      );
    }
  });

  it("keeps fr-CA public marketing copy localized and claim-equivalent", () => {
    const frenchPublicCopy = getPublicSiteCopy("fr-CA");
    const frenchPublicText = JSON.stringify(frenchPublicCopy);

    assert.equal(
      frenchPublicCopy.home.hero.title,
      "Ne perdez plus de soumissions faute de réponse rapide.",
    );
    assert.ok(
      frenchPublicCopy.home.hero.title.length <= 58,
      "fr-CA homepage hero title should stay inside the first-fold parity budget.",
    );
    assert.equal(
      frenchPublicCopy.home.hero.primaryCta,
      "Rejoindre le pilote",
    );
    assert.equal(frenchPublicCopy.home.hero.secondaryCta, "Voir la démo");
    assert.equal(
      frenchPublicCopy.home.hero.body,
      "Centralisez les demandes, organisez les prospects et préparez des réponses à valider — sans envoi automatique.",
    );
    assert.deepEqual(frenchPublicCopy.home.hero.trustBadges, [
      "Aucun envoi automatique",
      "Brouillons IA validés par vous",
      "Copie et envoi manuels",
    ]);
    assert.equal(frenchPublicCopy.home.mockup.title, "Nouvelle demande");
    assert.equal(frenchPublicCopy.home.mockup.status, "À répondre");
    assert.equal(frenchPublicCopy.home.mockup.draftTitle, "Brouillon suggéré");
    assert.equal(frenchPublicCopy.home.mockup.draftTag, "L'IA prépare. Vous envoyez.");
    assert.equal(frenchPublicCopy.home.mockup.copyButton, "Copier la réponse");

    for (const englishPhrase of [
      "Stop losing cleaning quote requests to slow replies.",
      "Built for cleaning businesses first",
      "AI drafts reviewed by you",
      "Manual copy and send",
      "Payment and product guardrails",
      "Ne perdez plus de demandes de soumission à cause de réponses trop lentes.",
      "Ne perdez plus de demandes de nettoyage à cause de réponses lentes.",
    ]) {
      assert.equal(
        frenchPublicText.includes(englishPhrase),
        false,
        `fr-CA public copy should not contain English phrase: ${englishPhrase}`,
      );
    }
  });

  it("keeps fr-CA terminology professional and consistent", () => {
    const frenchPublicCopy = getPublicSiteCopy("fr-CA");
    const frenchHomeCopy = getHomeCopy("fr-CA");
    const frenchPublicText = JSON.stringify(frenchPublicCopy);
    const frenchHomeText = JSON.stringify(frenchHomeCopy);
    const combinedFrenchPublicText = `${frenchPublicText} ${frenchHomeText}`;

    assert.equal(
      frenchHomeCopy.nav.brandSubtitle,
      "Suivi des demandes pour entreprises de nettoyage",
    );
    assert.equal(
      frenchPublicCopy.cleaning.services.includes("Nettoyage avant/après déménagement"),
      true,
    );
    assert.equal(
      frenchPublicCopy.cleaning.services.includes("Nettoyage entre séjours Airbnb"),
      true,
    );
    assert.equal(
      frenchPublicCopy.trust.items.some(
        (item) => item.title === "Brouillons IA validés par vous",
      ),
      true,
    );

    for (const forbidden of [
      /Leads pour le nettoyage/u,
      /Nettoyage de départ/u,
      /nettoyage de départ/u,
      /manuel d'abord/u,
      /espace propriétaire/u,
      /révisé par le propriétaire/u,
      /réponse requise/u,
      /Brouillons IA révisés/u,
      /Aucun envoi auto(?!matique)/u,
      /Copie\/envoi manuel/u,
      /Projet pilote fondateur/u,
      /Participer au projet pilote/u,
      /Postuler au projet pilote/u,
      /turnovers/u,
      /Onboarding/u,
      /Remise en état entre séjours/u,
      /Aucune automation/u,
    ]) {
      assert.equal(
        forbidden.test(combinedFrenchPublicText),
        false,
        `fr-CA public copy should not contain stale or literal terminology: ${forbidden}`,
      );
    }
  });

  it("keeps fr-CA public shell and homepage copy accented", () => {
    const frenchHomeCopy = getHomeCopy("fr-CA");
    const frenchHomeText = JSON.stringify(frenchHomeCopy);
    const interactiveDemoSource = readFileSync(
      "components/public/interactive-cleaning-demo.tsx",
      "utf8",
    );

    assert.equal(frenchHomeCopy.nav.demo, "Démo");
    assert.equal(frenchHomeCopy.nav.privacy, "Confidentialité");
    assert.equal(frenchHomeCopy.nav.security, "Sécurité");
    assert.equal(frenchHomeCopy.nav.startFull, "Rejoindre le pilote");
    assert.equal(frenchHomeCopy.nav.startShort, "Pilote");
    assert.equal(frenchHomeCopy.workflowDemo.eyebrow, "Démo par onglets");
    assert.equal(
      frenchHomeCopy.workflowDemo.safety,
      "Confidentialité, consentement et envoi manuel restent visibles.",
    );

    for (const forbidden of [
      "Confidentialite",
      "Securite",
      "Demo par onglets",
      "demande realiste",
      "Le systeme",
      "Le proprietaire",
      "Aucun prix invente",
      "Pret a reviser",
    ]) {
      assert.equal(
        frenchHomeText.includes(forbidden),
        false,
        `fr-CA home copy should not contain no-accent phrase: ${forbidden}`,
      );
      assert.equal(
        interactiveDemoSource.includes(forbidden),
        false,
        `fr-CA interactive demo source should not contain no-accent phrase: ${forbidden}`,
      );
    }

    assert.equal(interactiveDemoSource.includes("Démo nettoyage"), true);
    assert.equal(interactiveDemoSource.includes("Brouillon pour révision"), true);
    assert.equal(interactiveDemoSource.includes("Étape ${current} de ${total}"), true);
  });

  it("keeps fr-CA public policy copy accented and meaning-equivalent", () => {
    const frenchPolicyCopy = getPolicyCopy("fr-CA");
    const frenchPolicyText = JSON.stringify(frenchPolicyCopy);

    assert.equal(
      frenchPolicyCopy.privacy.title,
      "Règles de confidentialité pour la récupération des soumissions.",
    );
    assert.equal(
      frenchPolicyCopy.security.title,
      "Frontières de sécurité avant les données réelles.",
    );
    assert.equal(
      frenchPolicyCopy.terms.title,
      "Conditions claires, sans automatisation cachée.",
    );
    assert.equal(
      frenchPolicyCopy.terms.sections[0]?.title,
      "Portée produit",
    );

    for (const forbidden of [
      "Avis de confidentialite",
      "Regles de confidentialite",
      "recuperation des soumissions",
      "Frontieres de securite",
      "donnees reelles",
      "automation cachee",
      "Scope produit",
      "proprietaire",
      "reponse",
      "resume",
    ]) {
      assert.equal(
        frenchPolicyText.includes(forbidden),
        false,
        `fr-CA policy copy should not contain no-accent or English artifact: ${forbidden}`,
      );
    }
  });

  it("keeps public hero and pricing copy inside multilingual visual budgets", () => {
    for (const language of supportedLanguages) {
      const copy = getPublicSiteCopy(language);
      const pricingCards = copy.pricing.cards;

      assert.ok(copy.home.hero.title.length <= 58, `${language} hero title is too long for first-fold parity.`);
      assert.ok(copy.home.hero.primaryCta.length <= 22, `${language} primary hero CTA is too long.`);
      assert.ok(copy.home.hero.secondaryCta.length <= 18, `${language} secondary hero CTA is too long.`);
      assert.equal(pricingCards.length, 3, `${language} pricing should keep three plan cards.`);

      for (const card of pricingCards) {
        assert.ok(card.cohort.length <= 36, `${language} pricing cohort is too long: ${card.cohort}`);
        assert.ok(card.title.length <= 28, `${language} pricing title is too long: ${card.title}`);
        assert.ok(card.highlight.length <= 38, `${language} pricing highlight is too long: ${card.highlight}`);
        assert.ok(card.cta.length <= 28, `${language} pricing CTA is too long: ${card.cta}`);
      }
    }
  });

  it("keeps canonical English public copy manual-first and dictionary-owned", () => {
    const englishPublicCopy = getPublicSiteCopy("en");
    const englishPublicText = JSON.stringify(englishPublicCopy);

    assert.equal(
      englishPublicCopy.home.hero.title,
      "Stop losing cleaning quote requests to slow replies.",
    );
    assert.equal(
      englishPublicCopy.home.hero.body,
      "Capture quote requests, organize leads, and prepare replies for owner review — without auto-send.",
    );
    assert.deepEqual(englishPublicCopy.home.hero.trustBadges, [
      "No auto-send",
      "AI drafts reviewed by you",
      "Manual copy and send",
    ]);
    assert.equal(englishPublicCopy.home.mockup.title, "New quote request");
    assert.equal(englishPublicCopy.home.mockup.status, "Needs reply");
    assert.equal(englishPublicCopy.home.mockup.draftTitle, "Suggested reply");
    assert.equal(englishPublicCopy.home.mockup.draftTag, "AI drafts. You send.");
    assert.equal(englishPublicCopy.home.mockup.copyButton, "Copy reply");

    for (const forbidden of [
      "AI draft card",
      "Stop losing cleaning quotes to slow replies.",
      "draft fast owner-reviewed replies",
      "owner-reviewed replies",
      "owner-reviewed draft",
      "Owner-reviewed reply draft",
      "Owner-reviewed AI drafts",
      "Manual send + guardrails.",
      "command center",
      "cockpit",
    ]) {
      assert.equal(
        englishPublicText.includes(forbidden),
        false,
        `English public copy should not contain stale wording: ${forbidden}`,
      );
    }

    const homepageSource = readFileSync("app/page.tsx", "utf8");
    assert.equal(
      homepageSource.includes("Stop losing cleaning quote requests to slow replies."),
      false,
      "Homepage route should read the canonical hero title from the dictionary.",
    );
    assert.equal(
      homepageSource.includes("AI drafts reviewed by you"),
      false,
      "Homepage route should read trust badges from the dictionary.",
    );
  });

  it("keeps homepage cleaning use-case cards locked to six service anchors", () => {
    const englishUseCases = getPublicSiteCopy("en").home.useCases;

    assert.equal(
      englishUseCases.title,
      "Built for the cleaning jobs you quote every week.",
    );
    assert.equal(
      englishUseCases.body,
      "BizPilot keeps the service, timing, missing details, and next reply clear across common residential and commercial cleaning requests.",
    );
    assert.deepEqual(
      englishUseCases.cards.map((card) => card.href),
      [
        "/industries/cleaning#residential",
        "/industries/cleaning#deep-cleaning",
        "/industries/cleaning#move-in-out",
        "/industries/cleaning#office",
        "/industries/cleaning#airbnb",
        "/industries/cleaning#post-construction",
      ],
    );

    for (const language of supportedLanguages) {
      assert.equal(
        getPublicSiteCopy(language).home.useCases.cards.length,
        6,
        `${language} homepage use-case grid must stay 3x2 / 2x3 / 1x6 friendly.`,
      );
      assert.equal(
        getPublicSiteCopy(language).home.preview.steps.length,
        4,
        `${language} homepage demo must keep three states plus manual-send outcome.`,
      );
    }

    const homepageSource = readFileSync("app/page.tsx", "utf8");
    assert.equal(homepageSource.includes("homepage-use-case-grid"), true);
    assert.equal(homepageSource.includes("homepage-demo-grid"), true);

    const globalStyles = readFileSync("app/globals.css", "utf8");
    assert.equal(
      globalStyles.includes(".homepage-use-case-grid"),
      true,
      "Homepage service cards should use the locked grid class.",
    );
    assert.equal(
      globalStyles.includes("grid-template-columns: repeat(3, minmax(0, 1fr));"),
      true,
      "Homepage service cards should lock to three columns on wide desktop.",
    );
  });

  it("keeps final supporting-page polish structure locked", () => {
    const englishPublicCopy = getPublicSiteCopy("en");

    assert.deepEqual(
      englishPublicCopy.features.cards.map((card) => card.title),
      [
        "Capture every quote request in one clean flow.",
        "Know who needs a reply now.",
        "See the job context before you answer.",
        "Prepare a draft reply for review.",
        "Copy and send from the channel you already use.",
        "Keep the next manual action clear.",
      ],
    );
    assert.deepEqual(
      englishPublicCopy.features.proof.items,
      [
        "Customer submits a quote request",
        "BizPilot organizes service, timing, and missing details",
        "AI prepares a draft reply for owner review",
        "Owner copies, edits if needed, and sends manually",
      ],
    );

    assert.equal(englishPublicCopy.cleaning.families.length, 3);
    assert.deepEqual(
      englishPublicCopy.cleaning.families.map((family) => family.services.length),
      [2, 2, 3],
    );
    const cleaningServiceIds = new Set(
      englishPublicCopy.cleaning.families.flatMap((family) =>
        family.services.map((service) => service.id),
      ),
    );
    for (const serviceId of [
      "residential",
      "deep-cleaning",
      "move-in-out",
      "office",
      "airbnb",
      "post-construction",
    ]) {
      assert.equal(
        cleaningServiceIds.has(serviceId),
        true,
        `Cleaning page should expose #${serviceId}.`,
      );
    }

    assert.equal(englishPublicCopy.trust.pillars.length, 3);
    assert.deepEqual(
      englishPublicCopy.trust.pillars.map((pillar) => pillar.title),
      [
        "You stay in control",
        "Quotes stay honest",
        "The workflow fails safely",
      ],
    );
    for (const pillar of englishPublicCopy.trust.pillars) {
      assert.equal(pillar.points.length, 3);
    }

    assert.equal(englishPublicCopy.demo.chapters.length, 4);
    assert.deepEqual(
      englishPublicCopy.demo.chapters.at(-1)?.panelItems.slice(-5),
      [
        "No auto-send",
        "No invented price",
        "No booking confirmation",
        "No SMS/WhatsApp automation",
        "No full CRM claim",
      ],
    );

    assert.deepEqual(
      englishPublicCopy.pricing.cards.flatMap((card) => card.priceLines),
      ["$0 setup", "$149 setup", "$49/month", "$199 setup", "$79/month"],
    );
    assert.equal(englishPublicCopy.pricing.afterApply.steps.length, 3);
    assert.equal(englishPublicCopy.contentStudio.cards.length, 6);
    assert.equal(
      englishPublicCopy.contentStudio.cards.every(
        (card) => card.title.length > 0 && card.body.length >= 24,
      ),
      true,
      "Content Studio six-card roadmap should include value text, not title-only cards.",
    );
    assert.equal(
      englishPublicCopy.contentStudio.footer.includes(
        "No automatic posting is promised.",
      ),
      true,
    );

    const routeExpectations: ReadonlyArray<
      readonly [file: string, required: string, forbidden?: string]
    > = [
      ["app/features/page.tsx", "supporting-six-grid"],
      ["app/features/page.tsx", "supporting-four-grid"],
      ["app/industries/cleaning/page.tsx", "supporting-three-grid"],
      ["app/trust/page.tsx", "copy.pillars", "copy.items"],
      ["app/trust/page.tsx", "supporting-three-grid"],
      ["app/pricing/page.tsx", "copy.afterApply"],
      ["app/pricing/page.tsx", "supporting-three-grid"],
      ["app/content-studio/page.tsx", "supporting-six-grid"],
    ];

    for (const [file, required, forbidden] of routeExpectations) {
      const source = readFileSync(file, "utf8");
      assert.equal(
        source.includes(required),
        true,
        `${file} should include ${required}.`,
      );
      if (forbidden) {
        assert.equal(
          source.includes(forbidden),
          false,
          `${file} should no longer include ${forbidden}.`,
        );
      }
    }

    const globalStyles = readFileSync("app/globals.css", "utf8");
    assert.equal(globalStyles.includes(".supporting-six-grid"), true);
    assert.equal(globalStyles.includes(".supporting-three-grid"), true);
    assert.equal(
      globalStyles.includes("gap: var(--grid-gap);"),
      true,
      "Supporting grids should use fluid grid gaps rather than fixed one-off spacing.",
    );

    for (const [file, forbidden] of [
      ["app/page.tsx", "min-h-[170px]"],
      ["app/page.tsx", "min-h-[260px]"],
      ["app/features/page.tsx", "min-h-[210px]"],
      ["app/content-studio/page.tsx", "min-h-[150px]"],
    ] as const) {
      assert.equal(
        readFileSync(file, "utf8").includes(forbidden),
        false,
        `${file} should not force marketing card height with ${forbidden}.`,
      );
    }
  });

  it("keeps pilot Branch B conversion honest and non-submitting", () => {
    const englishPilotCopy = getPublicSiteCopy("en").pilot;
    const frenchPilotCopy = getPublicSiteCopy("fr-CA").pilot;

    assert.equal(
      englishPilotCopy.title,
      "Help shape BizPilot around real cleaning work.",
    );
    assert.equal(
      englishPilotCopy.body,
      "Join a small founder-led pilot built to help cleaning businesses capture quote requests, reply faster, and stay in control.",
    );
    assert.equal(
      englishPilotCopy.conversion.title,
      "Pilot requests are being prepared.",
    );
    assert.equal(
      englishPilotCopy.conversion.template,
      "Subject: BizPilot founder pilot request\nBusiness name:\nWork email:\nCity / service area:\nCleaning services:\nApproximate quote requests per week:\nBiggest lead-management problem:\nPreferred language: English / French / Both",
    );
    assert.equal(englishPilotCopy.conversion.previewQuestions.length, 6);
    assert.equal(frenchPilotCopy.conversion.previewQuestions.length, 6);
    assert.equal(
      JSON.stringify(frenchPilotCopy).includes("Copy pilot request template"),
      false,
      "fr-CA pilot copy should not fall back to English CTA text.",
    );

    const pilotSource = readFileSync("app/pilot/page.tsx", "utf8");
    for (const forbidden of ["<form", "<input", "<select", "<textarea"]) {
      assert.equal(
        pilotSource.includes(forbidden),
        false,
        `Pilot page should not render default form control ${forbidden}.`,
      );
    }
    assert.equal(
      pilotSource.includes("disabled"),
      false,
      "Pilot page should not keep disabled form/control source.",
    );
    assert.equal(
      pilotSource.includes("PilotRequestTemplateCard"),
      true,
      "Pilot page should use the clipboard conversion component.",
    );

    const conversionSource = readFileSync(
      "components/public/pilot-request-template-card.tsx",
      "utf8",
    );
    assert.equal(
      conversionSource.includes("navigator.clipboard.writeText"),
      true,
      "Pilot request action should use the Clipboard API.",
    );
    assert.equal(
      conversionSource.includes('document.execCommand("copy")'),
      true,
      "Pilot request action should attempt a selection-based copy fallback.",
    );
    assert.equal(
      conversionSource.includes('aria-live="polite"'),
      true,
      "Pilot request copy status should be announced.",
    );
    for (const forbidden of ["fetch(", "XMLHttpRequest", "<form"]) {
      assert.equal(
        conversionSource.includes(forbidden),
        false,
        `Pilot request copy action should not include ${forbidden}.`,
      );
    }
  });

  it("keeps public copy namespaces explicit and complete", () => {
    assert.deepEqual(
      [...bizPilotCopyNamespaces],
      [
        "quotePage",
        "auth",
        "dashboard",
        "quoteForm",
        "quoteSuccess",
        "quoteFields",
        "optionLabels",
        "intakeErrors",
        "leadRules",
        "aiFallback",
        "demo",
        "missingInfoLabels",
      ],
    );
    assert.deepEqual(
      [...homeCopyNamespaces],
      [
        "nav",
        "hero",
        "heroDesk",
        "metrics",
        "painStory",
        "problem",
        "recoveryFlow",
        "workflowDemo",
        "commandCenter",
        "beforeAfter",
        "trust",
        "finalCta",
      ],
    );
    assert.deepEqual(
      [...pricingCopyNamespaces],
      ["hero", "plans", "included", "guardrails", "faq", "cta"],
    );
    assert.deepEqual(
      [...publicSiteCopyNamespaces],
      [
        "home",
        "features",
        "cleaning",
        "trust",
        "demo",
        "pricing",
        "pilot",
        "contentStudio",
        "authMeta",
        "quoteShell",
      ],
    );
  });

  it("localizes default quote fields without overwriting custom owner labels", () => {
    assert.deepEqual(
      localizeDefaultQuoteField({
        fieldKey: "bathrooms",
        helpText: "Optional bathroom count for residential jobs.",
        label: "Bathrooms",
        language: "fr-CA",
      }),
      {
        helpText: "Nombre de salles de bain pour les logements résidentiels.",
        label: "Salles de bain",
      },
    );

    assert.deepEqual(
      localizeDefaultQuoteField({
        fieldKey: "bathrooms",
        helpText: "Owner custom help",
        label: "Owner custom label",
        language: "fr-CA",
      }),
      {
        helpText: "Owner custom help",
        label: "Owner custom label",
      },
    );

    assert.deepEqual(
      localizeDefaultQuoteField({
        fieldKey: "bathrooms",
        helpText: "Nombre de salles de bain pour les logements résidentiels.",
        label: "Salles de bain",
        language: "en",
      }),
      {
        helpText: "Optional bathroom count for residential jobs.",
        label: "Bathrooms",
      },
    );
  });

  it("localizes known option labels and public intake messages safely", () => {
    assert.equal(
      getQuoteOptionLabel({ language: "fr-CA", value: "move_in_move_out" }),
      "Déménagement",
    );
    assert.equal(
      getBizPilotCopy("fr-CA").quoteForm.submitButton,
      "Envoyer la demande",
    );
    assert.equal(
      isSafePublicIntakeMessage("Salles de bain doit être rempli."),
      true,
    );
    assert.equal(
      isSafePublicIntakeMessage(
        getBizPilotCopy("en").intakeErrors.invalidChoice("Service"),
      ),
      true,
    );
    assert.equal(
      isSafePublicIntakeMessage(
        getBizPilotCopy("fr-CA").intakeErrors.invalidChoice("Service"),
      ),
      true,
    );
    assert.equal(
      isSafePublicIntakeMessage(
        getBizPilotCopy("en").intakeErrors.temporarySubmitUnavailable,
      ),
      true,
    );
    assert.equal(
      isSafePublicIntakeMessage("Raw database or provider error"),
      false,
    );
  });

  it("normalizes default consent notices when the business language changes", () => {
    const englishNotice = getBizPilotCopy("en").quoteForm.consentNoticeDefault;
    const frenchNotice = getBizPilotCopy("fr-CA").quoteForm.consentNoticeDefault;

    assert.equal(
      resolveConsentNoticeForLanguage({
        language: "fr-CA",
        value: englishNotice,
      }),
      frenchNotice,
    );

    assert.equal(
      resolveConsentNoticeForLanguage({
        language: "fr-CA",
        value: "Custom owner consent notice",
      }),
      "Custom owner consent notice",
    );
  });
});
