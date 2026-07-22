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
 * Last Updated: 2026-07-22
 * Change Log:
 * - 2026-07-22: Added bilingual canonical exact-time labels and safe validation-message coverage.
 * - 2026-07-21: Updated the protected-dashboard language-switch source contract for the isolated five-language interface cookie and action.
 * - 2026-07-17: Updated public-copy guards for the concise bilingual Website V4 editorial hierarchy.
 * - 2026-07-16: Aligned dashboard recovery assertions with segment retry instead of a misleading full reload.
 * - 2026-07-15: Added the bilingual global error copy namespace to the explicit dictionary contract.
 * - 2026-07-16: Aligned CTA-truth, grouped-FAQ, and focused-home assertions with the final public polish.
 * - 2026-07-13: Migrated retained-route, FAQ, pilot, and fr-CA shell guards to the completed Website V3 contract.
 * - 2026-07-13: Migrated the homepage dictionary guard to the typed Website V3 specification.
 * - 2026-07-12: Updated pilot conversion assertions for the manual email-draft path.
 * - 2026-06-20: Added public-grid balance and forced-height regression checks.
 * - 2026-06-21: Added fr-CA public shell accent regression checks.
 * - 2026-06-21: Added canonical four-step public grid coverage.
 * - 2026-06-21: Added multilingual copy length budgets for hero and pricing parity.
 * - 2026-06-21: Added fr-CA public policy accent and meaning guards.
 * - 2026-06-21: Added homepage/full FAQ split copy guards.
 * - 2026-06-21: Locked the Cleaning page to six services without small-commercial copy.
 * - 2026-06-21: Locked final quote consent and no-confirmation notices.
 * - 2026-06-25: Updated canonical homepage hero copy for owner-review wording.
 * - 2026-06-25: Locked Cleaning copy to six service detail entries instead of repeated families.
 * - 2026-06-25: Updated Cleaning layout source guard to the shared detail selector component.
 * - 2026-06-26: Locked the compact homepage workflow preview copy and legacy wording cleanup guards.
 * - 2026-07-04: Locked quote success manual-review expectation copy.
 * - 2026-07-04: Added the protected owner guide route to dashboard i18n source coverage.
 * - 2026-07-05: Locked bilingual homepage product-scene hero copy.
 * - 2026-07-05: Locked the hot quote rescue hero and preview copy.
 * - 2026-07-05: Added regression coverage for legacy quote-field localization and dashboard form placeholders.
 * - 2026-07-11: Locked the stronger bilingual quote-rescue homepage hero copy.
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
import { getPublicV3Spec } from "../../lib/i18n/public-v3-spec.ts";
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
  "app/(dashboard)/dashboard/error.tsx",
  "app/(dashboard)/dashboard/guide/page.tsx",
  "app/(dashboard)/dashboard/settings/page.tsx",
  "app/(dashboard)/dashboard/business-profile/page.tsx",
  "app/(dashboard)/dashboard/configuration/page.tsx",
  "components/dashboard/lead-workspace-queue.tsx",
  "components/dashboard/workspace-deletion-request-form.tsx",
] as const;

const dashboardSourceFiles = userFacingSourceFiles.filter((file) =>
  file.startsWith("app/(dashboard)") || file.startsWith("components/dashboard"),
);

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
    const dashboardInterface = readFileSync(
      "lib/i18n/dashboard-interface.ts",
      "utf8",
    );
    const dashboardAction = readFileSync(
      "server/actions/premium-operations.actions.ts",
      "utf8",
    );
    const dashboardLayout = readFileSync("app/(dashboard)/layout.tsx", "utf8");
    const queue = readFileSync(
      "components/dashboard/lead-workspace-queue.tsx",
      "utf8",
    );

    assert.equal(topbar.includes("updateDashboardInterfaceLanguageAction"), true);
    assert.equal(topbar.includes("dashboardInterfaceLanguages.map"), true);
    assert.equal(topbar.includes("supportedLanguages"), false);
    assert.equal(topbar.includes("updateWorkspaceLanguageAction"), false);
    assert.equal(topbar.includes("setInterfaceLanguageAction"), false);
    assert.equal(
      dashboardInterface.includes("DASHBOARD_INTERFACE_LANGUAGE_COOKIE"),
      true,
    );
    assert.equal(
      dashboardAction.includes("cookieStore.set(DASHBOARD_INTERFACE_LANGUAGE_COOKIE"),
      true,
    );
    assert.equal(
      dashboardLayout.includes("resolveDashboardInterfaceLanguage"),
      true,
    );
    assert.equal(
      dashboardLayout.includes("getDashboardInterfaceLegacyCopy(activeLanguage)"),
      true,
    );
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

  it("keeps legacy public homepage wording out of dictionary copy", () => {
    const publicHomepageText = JSON.stringify({
      en: getHomeCopy("en"),
      fr: getHomeCopy("fr-CA"),
    });

    for (const forbidden of [
      /Quote Recovery Desk/u,
      /Command center/u,
      /Centre de commande/u,
      /Stop losing cleaning jobs one delayed reply at a time\./u,
      /no[- ]risk pilot/i,
      /credit card/i,
      /cancel anytime/i,
      /Pilote sans risque/u,
      /Aucune carte requise/u,
      /Annulez quand vous voulez/u,
      /Bureau de récupération des soumissions/u,
      /Bureau de réponse IA/u,
    ]) {
      assert.equal(
        forbidden.test(publicHomepageText),
        false,
        `Homepage dictionaries should not contain legacy public wording: ${forbidden}`,
      );
    }
  });

  it("keeps fr-CA pricing CTAs localized without changing pilot values", () => {
    const frenchPricingCopy = getPricingCopy("fr-CA");
    const frenchPricingText = JSON.stringify(frenchPricingCopy);

    assert.equal(frenchPricingCopy.cta.button, "Rejoindre le pilote");
    assert.equal(frenchPricingCopy.hero.primaryCta, "Rejoindre le pilote");
    assert.equal(frenchPricingCopy.hero.secondaryCta, "Voir le fonctionnement");
    assert.equal(frenchPricingCopy.plans.items[0]?.cta, "Rejoindre le pilote");
    assert.equal(frenchPricingCopy.plans.items[1]?.cta, "Postuler au pilote");
    assert.equal(frenchPricingCopy.plans.items[2]?.cta, "Postuler au pilote");
    assert.equal(frenchPricingCopy.plans.items[0]?.monthly, "Setup pilote à 0 $");
    assert.equal(frenchPricingCopy.plans.items[1]?.monthly, "Tarif pilote");
    assert.equal(frenchPricingCopy.plans.items[2]?.monthly, "Offre future");

    for (const forbidden of [
      "Apply for founder pilot",
      "Apply for pilot",
      "See workflow",
      "Voir le workflow",
      "Choisir Starter",
      "Choisir Pro",
      "application requise",
      "roadmap",
    ]) {
      assert.equal(
        frenchPricingText.includes(forbidden),
        false,
        `fr-CA pricing copy should not contain stale CTA/setup wording: ${forbidden}`,
      );
    }
  });

  it("keeps dashboard copy shape synced while replacing legacy visible labels", () => {
    const englishDashboardCopy = getBizPilotCopy("en").dashboard;
    const frenchDashboardCopy = getBizPilotCopy("fr-CA").dashboard;

    assert.deepEqual(
      copyShape(frenchDashboardCopy),
      copyShape(englishDashboardCopy),
      "fr-CA dashboard copy must keep keys and function arity synced with English.",
    );

    assert.equal(englishDashboardCopy.nav.ownerWorkspace, "Workspace");
    assert.equal(
      englishDashboardCopy.nav.workspaceSubtitle,
      "Lead recovery workspace",
    );
    assert.equal(
      englishDashboardCopy.leadDetail.ai.ownerReviewRequired,
      "Review required",
    );
    assert.deepEqual(englishDashboardCopy.overview.aiControlBadges, [
      "No auto-send",
      "No invented pricing",
      "Reviewed by you",
    ]);

    assert.equal(frenchDashboardCopy.nav.ownerWorkspace, "Espace de travail");
    assert.equal(
      frenchDashboardCopy.nav.workspaceSubtitle,
      "Espace de récupération",
    );
    assert.equal(
      frenchDashboardCopy.leadDetail.ai.ownerReviewRequired,
      "Validation requise",
    );
    assert.deepEqual(frenchDashboardCopy.overview.aiControlBadges, [
      "Aucun envoi automatique",
      "Aucun prix inventé",
      "À valider par vous",
    ]);
    assert.equal(
      frenchDashboardCopy.leadQueue.searchPlaceholder,
      "Rechercher prospects, ville, service...",
    );
    assert.equal(
      frenchDashboardCopy.settings.featureRegistry.levelLabels.core,
      "Base",
    );
    assert.equal(
      frenchDashboardCopy.settings.featureRegistry.levelLabels.custom,
      "Personnalisé",
    );
    assert.equal(
      frenchDashboardCopy.settings.featureRegistry.stateLabels.setup_required,
      "Configuration requise",
    );
    assert.equal(
      englishDashboardCopy.businessProfile.serviceAreasPlaceholder,
      "Montreal\nLaval\nLongueuil",
    );
    assert.equal(
      frenchDashboardCopy.businessProfile.serviceAreasPlaceholder,
      "Montréal\nLaval\nLongueuil",
    );
    assert.equal(
      englishDashboardCopy.configuration.fields.placeholders?.phone.label,
      "Callback phone",
    );
    assert.equal(
      frenchDashboardCopy.configuration.fields.placeholders?.phone.label,
      "Téléphone de rappel",
    );
    assert.equal(
      englishDashboardCopy.errorBoundary.reload,
      "Try again",
    );
    assert.equal(
      frenchDashboardCopy.errorBoundary.reload,
      "Réessayer",
    );

    const dashboardErrorSource = readFileSync(
      "app/(dashboard)/dashboard/error.tsx",
      "utf8",
    );
    const businessProfileSource = readFileSync(
      "app/(dashboard)/dashboard/business-profile/page.tsx",
      "utf8",
    );
    assert.equal(
      dashboardErrorSource.includes(
        "getDashboardInterfaceLegacyCopy(language).dashboard",
      ),
      true,
      "Dashboard error boundary should read visible labels from the dictionary.",
    );
    for (const hardcodedErrorCopy of [
      "This workspace needs a refresh.",
      "Reload dashboard",
    ]) {
      assert.equal(
        dashboardErrorSource.includes(hardcodedErrorCopy),
        false,
        `Dashboard error boundary should not hardcode visible copy: ${hardcodedErrorCopy}`,
      );
    }
    assert.equal(
      businessProfileSource.includes("placeholder={text.serviceAreasPlaceholder}"),
      true,
      "Business Profile service-area placeholder should follow the active dashboard language.",
    );
    assert.equal(
      businessProfileSource.includes('placeholder={"Montreal\\nLaval\\nLongueuil"}'),
      false,
      "Business Profile should not hardcode English service-area placeholder text.",
    );

    const visibleFrenchDashboardText = JSON.stringify({
      demo: getBizPilotCopy("fr-CA").demo,
      errorBoundary: frenchDashboardCopy.errorBoundary,
      leadRules: getBizPilotCopy("fr-CA").leadRules,
      nav: frenchDashboardCopy.nav,
      leadQueue: frenchDashboardCopy.leadQueue,
      leadDetailAi: frenchDashboardCopy.leadDetail.ai,
      leadDetailFallbacks: frenchDashboardCopy.leadDetail.fallbacks,
      leadDetailNotes: frenchDashboardCopy.leadDetail.ownerNotes,
      leadDetailRouting: frenchDashboardCopy.leadDetail.routing,
      leadDetailSections: frenchDashboardCopy.leadDetail.sections,
      leadsPage: frenchDashboardCopy.leadsPage,
      overview: frenchDashboardCopy.overview,
      featureRegistryLabels: {
        levelLabels: frenchDashboardCopy.settings.featureRegistry.levelLabels,
        stateLabels: frenchDashboardCopy.settings.featureRegistry.stateLabels,
      },
    });

    for (const forbidden of [
      "Révisé par le propriétaire",
      "Révision propriétaire requise",
      "Révision propriétaire",
      "Espace propriétaire",
      "Bureau Quote Recovery",
      "Rechercher leads",
      "Aucun lead",
      "Lead sans nom",
      "Leads à risque",
      "leads en attente",
      "réponse propriétaire",
      "réponse du propriétaire",
      "Setup requis",
      "Controle owner",
      "Owner workspace",
      "Quote Recovery Desk",
      "Owner reviewed",
      "Owner review required",
    ]) {
      assert.equal(
        visibleFrenchDashboardText.includes(forbidden),
        false,
        `Visible dashboard copy should not contain legacy wording: ${forbidden}`,
      );
    }
  });

  it("keeps final public routes wired to the active dictionaries instead of hardcoded marketing copy", () => {
    const homepage = readFileSync("app/page.tsx", "utf8");
    assert.equal(homepage.includes("getPublicV3Spec"), true);
    assert.equal(homepage.includes("PublicV3Home"), true);
    assert.equal(homepage.includes("generateMetadata"), true);

    const retainedRoutes = [
      "app/features/page.tsx",
      "app/demo/page.tsx",
      "app/pricing/page.tsx",
      "app/pilot/page.tsx",
      "app/trust/page.tsx",
      "app/faq/page.tsx",
    ] as const;

    for (const file of retainedRoutes) {
      const source = readFileSync(file, "utf8");
      assert.equal(
        source.includes("getPublicV3Spec"),
        true,
        `${file} should read the active public V3 dictionary.`,
      );
      assert.equal(source.includes("PublicV3Page"), true, file);
      assert.equal(source.includes("generateMetadata"), true, file);
    }

    for (const file of [
      "app/privacy/page.tsx",
      "app/security/page.tsx",
      "app/terms/page.tsx",
    ]) {
      const source = readFileSync(file, "utf8");
      assert.equal(source.includes("getPolicyCopy"), true, file);
      assert.equal(source.includes("getPublicV3Spec"), true, file);
      assert.equal(source.includes("generateMetadata"), true, file);
    }

    const homepageSource = readFileSync("app/page.tsx", "utf8");
    assert.equal(homepageSource.includes("PublicV3Home"), true);
    for (const phrase of [
      "Stop losing cleaning quote requests to slow replies.",
      "Messages get buried",
      "Your next customer may already be waiting.",
      "AI drafts. You decide.",
    ]) {
      assert.equal(
        homepageSource.includes(phrase),
        false,
        `app/page.tsx should not keep hardcoded legacy phrase: ${phrase}`,
      );
    }

    const quoteWizardSource = readFileSync(
      "components/public/quote-form-wizard.tsx",
      "utf8",
    );
    assert.equal(quoteWizardSource.includes("copy.quoteForm.guardrail"), true);

    const proxySource = readFileSync("proxy.ts", "utf8");
    for (const authPath of [
      "/auth/sign-in",
      "/auth/sign-up",
      "/auth/forgot-password",
      "/auth/reset-password",
      "/auth/check-email",
    ]) {
      assert.equal(proxySource.includes(authPath), true, authPath);
    }
  });

  it("keeps fr-CA public marketing copy localized and claim-equivalent", () => {
    const frenchPublicCopy = getPublicSiteCopy("fr-CA");
    const frenchPublicText = JSON.stringify(frenchPublicCopy);

    assert.equal(
      frenchPublicCopy.home.hero.title,
      "Transformez les demandes manquées en réponses prêtes.",
    );
    assert.ok(
      frenchPublicCopy.home.hero.title.length <= 70,
      "fr-CA homepage hero title should stay inside the first-fold parity budget.",
    );
    assert.equal(
      frenchPublicCopy.home.hero.primaryCta,
      "Rejoindre le pilote",
    );
    assert.equal(frenchPublicCopy.home.hero.secondaryCta, "Voir le flux");
    assert.equal(
      frenchPublicCopy.home.hero.body,
      "BizPilot regroupe Google, téléphone, site web et réseaux sociaux, repère les détails manquants et prépare un brouillon à valider, copier et envoyer manuellement.",
    );
    assert.deepEqual(frenchPublicCopy.home.hero.bullets, [
      "Vue unique des demandes dispersées",
      "Détails manquants avant la soumission",
      "Réponse à valider, aucun envoi auto",
    ]);
    assert.equal(
      frenchPublicCopy.home.hero.note,
      "Projet pilote guidé. Vous copiez et envoyez. Aucun envoi automatique ni prix inventé.",
    );
    assert.equal(frenchPublicCopy.home.mockup.chaosTitle, "La demande de déménagement refroidit");
    assert.equal(frenchPublicCopy.home.mockup.chaosSubtitle, "47 minutes sans réponse");
    assert.equal(frenchPublicCopy.home.mockup.bizPilotTitle, "Détails repérés par BizPilot");
    assert.deepEqual(frenchPublicCopy.home.mockup.bizPilotActions, [
      "Taille du logement",
      "Intérieur des électros",
      "Notes d'accès",
      "Moment souhaité",
    ]);
    assert.equal(frenchPublicCopy.home.mockup.clarityTitle, "Réponse prête à valider");
    assert.equal(frenchPublicCopy.home.mockup.claritySubtitle, "Validation");
    assert.equal(frenchPublicCopy.home.mockup.draftTitle, "Poser les bonnes questions une fois");
    assert.equal(frenchPublicCopy.home.mockup.copyButton, "Réviser et copier");
    assert.equal(frenchPublicCopy.home.hero.proofLabel, "Parcours de sauvetage");
    assert.deepEqual(frenchPublicCopy.home.hero.signals, [
      {
        label: "Sources",
        value: "Google, appel, social",
      },
      {
        label: "Détails",
        value: "Taille, accès, moment",
      },
      {
        label: "Réponse",
        value: "Valider et copier",
      },
    ]);
    assert.equal(frenchPublicCopy.home.mockup.sources.length, 5);
    assert.equal(frenchPublicCopy.home.mockup.messages.length, 4);
    assert.equal(frenchPublicCopy.home.mockup.leads.length, 2);
    assert.equal(
      frenchPublicCopy.home.preview.title,
      "Voyez le risque, les détails manquants et la réponse.",
    );
    assert.equal(
      frenchPublicCopy.home.preview.body,
      "Une vue claire montre le risque, les détails manquants et la réponse que vous pouvez valider ensuite.",
    );
    assert.deepEqual(frenchPublicCopy.home.preview.steps, [
      "Repérer le risque",
      "Trouver les détails manquants",
      "Valider la réponse",
    ]);
    assert.equal(frenchPublicCopy.home.preview.request.title, "Soumission à risque");
    assert.equal(frenchPublicCopy.home.preview.organizedLead.title, "Détails manquants repérés par BizPilot");
    assert.equal(frenchPublicCopy.home.preview.draft.title, "Réponse prête à valider");
    assert.equal(frenchPublicCopy.home.preview.copyButton, "Réviser et copier");

    for (const englishPhrase of [
      "Stop losing cleaning quote requests to slow replies.",
      "Turn missed quote requests into ready replies.",
      "Built for cleaning businesses first",
      "Cleaning quote recovery",
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
        (item) => item.title === "Brouillons IA à valider par vous",
      ),
      true,
    );

    for (const forbidden of [
      /Leads pour le nettoyage/u,
      /Nettoyage de départ/u,
      /nettoyage de départ/u,
      /prospects de nettoyage/u,
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
    const frenchSpec = getPublicV3Spec("fr-CA");
    const frenchHomeText = JSON.stringify(frenchSpec);
    const interactiveDemoSource = readFileSync(
      "components/public/public-v3-demo.tsx",
      "utf8",
    );

    assert.equal(frenchSpec.nav.demo, "Démo");
    assert.equal(frenchSpec.nav.privacy, "Confidentialité");
    assert.equal(frenchSpec.nav.security, "Sécurité");
    assert.equal(frenchSpec.nav.startShort, "Préparer");
    assert.match(frenchSpec.routes["/demo"].hero.title, /demande vague.*claire/i);

    for (const forbidden of [
      "Confidentialite",
      "Securite",
      "Demo par onglets",
      "demande realiste",
      "Le systeme",
      "Le proprietaire",
      "Aucun prix invente",
      "Pret a reviser",
      "nettoyage de départ",
      "Nouveau lead",
      "Lead chaud",
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

    assert.equal(interactiveDemoSource.includes("PublicV3Spec"), true);
    assert.equal(interactiveDemoSource.includes("copy.reviewBoundary"), true);
    assert.equal(interactiveDemoSource.includes("copy.reviewActions.map"), true);
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
      "manuel d'abord",
      "Gate des données réelles",
      "gate finale",
      "DB-level",
      "travail bulk",
      "révisé par le propriétaire",
      "Suivez si la prochaine étape est répondre",
      "projet pilote fondateur",
      "révisée par le propriétaire",
      "révisés par le propriétaire",
      "Founder Feedback Pilot",
      "Starter Pilot",
      "travail d'onboarding",
      "billing in-app",
      "webhook paiement",
      "jobs récupérés",
      "l'intake public",
      "Isolation des tenants",
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

  it("keeps fr-CA auth and quote shell copy natural and owner-controlled", () => {
    const frenchCopy = getBizPilotCopy("fr-CA");
    const visibleFrenchAuthAndQuoteText = [
      JSON.stringify(frenchCopy.auth),
      JSON.stringify(frenchCopy.quoteForm),
      JSON.stringify(frenchCopy.quotePage),
      frenchCopy.quoteSuccess.footer("BizPilot Test"),
      frenchCopy.quoteSuccess.title("BizPilot Test"),
      ...frenchCopy.quoteSuccess.steps("BizPilot Test"),
    ].join(" ");

    assert.equal(
      frenchCopy.auth.resetPasswordSubtitle,
      "Choisissez un nouveau mot de passe pour votre espace de travail.",
    );
    assert.equal(
      frenchCopy.auth.signInSubtitle,
      "Gérez les demandes de soumission, les brouillons IA à valider et les suivis manuels depuis votre espace BizPilot.",
    );
    assert.equal(
      frenchCopy.quoteSuccess.steps("BizPilot Test")[1],
      "Elle vérifie le prix et la disponibilité avant de répondre - aucun message automatique.",
    );

    for (const forbidden of [
      "espace propriétaire",
      "onboardées",
      "révisé par le propriétaire",
      "révisée par le propriétaire",
      "révisés par le propriétaire",
      "message automatique envoyé",
      "réservation confirmée",
    ]) {
      assert.equal(
        visibleFrenchAuthAndQuoteText.includes(forbidden),
        false,
        `fr-CA auth/quote copy should not contain stale or literal wording: ${forbidden}`,
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
    const englishBizPilotCopy = getBizPilotCopy("en");
    const englishPublicCopy = getPublicSiteCopy("en");
    const englishPolicyCopy = getPolicyCopy("en");
    const englishPublicText = JSON.stringify({
      policy: englishPolicyCopy,
      public: englishPublicCopy,
    });

    assert.equal(
      englishPublicCopy.home.hero.title,
      "Turn missed quote requests into ready replies.",
    );
    assert.equal(
      englishPublicCopy.home.hero.body,
      "BizPilot gathers Google, phone, website, and social context, flags missing quote details, and prepares a draft you review, copy, and send manually.",
    );
    assert.deepEqual(englishPublicCopy.home.hero.bullets, [
      "One lead view for scattered requests",
      "Missing details before any quote",
      "Review-ready reply, no auto-send",
    ]);
    assert.equal(
      englishPublicCopy.home.hero.note,
      "Founder-led pilot. You copy and send. No auto-send or invented pricing.",
    );
    assert.equal(englishPublicCopy.home.mockup.chaosTitle, "Move-out quote is getting cold");
    assert.equal(englishPublicCopy.home.mockup.chaosSubtitle, "47-minute response gap");
    assert.equal(englishPublicCopy.home.mockup.bizPilotTitle, "Details BizPilot surfaces");
    assert.deepEqual(englishPublicCopy.home.mockup.bizPilotActions, [
      "Home size",
      "Appliance interiors",
      "Access notes",
      "Preferred time",
    ]);
    assert.equal(englishPublicCopy.home.mockup.clarityTitle, "Reply ready to review");
    assert.equal(englishPublicCopy.home.mockup.claritySubtitle, "Owner review");
    assert.equal(englishPublicCopy.home.mockup.draftTitle, "Ask the right questions once");
    assert.equal(englishPublicCopy.home.mockup.copyButton, "Review & copy");
    assert.equal(englishPublicCopy.home.hero.proofLabel, "Quote rescue path");
    assert.deepEqual(englishPublicCopy.home.hero.signals, [
      {
        label: "Sources",
        value: "Google, call, social",
      },
      {
        label: "Details",
        value: "Size, access, time",
      },
      {
        label: "Reply",
        value: "Review and copy",
      },
    ]);
    assert.equal(englishPublicCopy.home.mockup.sources.length, 5);
    assert.equal(englishPublicCopy.home.mockup.messages.length, 4);
    assert.equal(englishPublicCopy.home.mockup.leads.length, 2);
    assert.equal(
      englishPublicCopy.home.preview.title,
      "See the risk, missing details, and reply in one view.",
    );
    assert.equal(
      englishPublicCopy.home.preview.body,
      "One clear snapshot shows the quote risk, the missing details, and the reply the owner can review next.",
    );
    assert.deepEqual(englishPublicCopy.home.preview.steps, [
      "Spot the hot request",
      "Find missing details",
      "Review the reply",
    ]);
    assert.equal(englishPublicCopy.home.preview.request.title, "At-risk quote");
    assert.equal(englishPublicCopy.home.preview.organizedLead.title, "Missing details BizPilot surfaces");
    assert.equal(englishPublicCopy.home.preview.draft.title, "Reply ready to review");
    assert.equal(englishPublicCopy.home.preview.copyButton, "Review & copy");
    assert.deepEqual(englishBizPilotCopy.quoteSuccess.steps(""), [
      "The business reviews your request and any missing details.",
      "They check pricing and availability before replying - no automatic messages.",
      "You hear back through the contact details you submitted.",
    ]);

    for (const forbidden of [
      "AI draft card",
      "prepare replies to approve",
      "reply to approve",
      "Stop losing cleaning quotes to slow replies.",
      "draft fast owner-reviewed replies",
      "owner-reviewed replies",
      "owner-reviewed draft",
      "Owner-reviewed reply draft",
      "Owner-reviewed AI drafts",
      "prepared for owner review",
      "Reply draft to approve",
      "reply draft for owner review",
      "manual-first path",
      "privacy readiness",
      "Commission d'acces a l'information",
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

  it("keeps the universal homepage honest while cleaning remains the complete launch vertical", () => {
    const english = getPublicV3Spec("en");

    assert.match(english.routes["/"].hero.eyebrow, /smart intake.*human review/i);
    assert.match(english.routes["/demo"].hero.eyebrow, /cleaning/i);
    assert.match(english.routes["/pilot"].hero.eyebrow, /cleaning/i);
    assert.match(english.faqItems.at(-1)?.answer ?? "", /only complete pilot template/i);
    assert.equal(english.demo.questions.length, 4);
    assert.equal(english.demo.result.length, 5);

    for (const language of supportedLanguages) {
      const copy = getPublicV3Spec(language);
      assert.equal(copy.home.sections.length, 7, language);
      assert.equal(copy.home.workflowSteps.length, 4, language);
      assert.equal(copy.demo.questions.length, 4, language);
    }

    const homepageSource = readFileSync(
      "components/public/public-v3-home.tsx",
      "utf8",
    );
    assert.equal(homepageSource.includes('data-v3-section="cleaning-demo"'), true);
    assert.equal(homepageSource.includes("spec.demo.result.slice"), true);
    assert.equal(homepageSource.includes("direct inbox integrations"), false);
  });

  it("keeps the homepage focused while full product objections stay on the FAQ route", () => {
    const english = getPublicV3Spec("en");
    const keys = english.faqItems.map((item) => item.key);

    assert.equal(english.faqItems.length, 10);
    for (const key of [
      "direct-integrations",
      "link-placement",
      "after-submit",
      "ai-role",
      "auto-send",
      "pricing-booking",
      "setup",
      "data",
      "pricing",
      "verticals",
    ]) {
      assert.equal(keys.includes(key), true, key);
    }

    const homepageSource = readFileSync(
      "components/public/public-v3-home.tsx",
      "utf8",
    );
    const faqSource = readFileSync("app/faq/page.tsx", "utf8");
    const sharedPageSource = readFileSync(
      "components/public/public-v3-page.tsx",
      "utf8",
    );

    assert.equal(homepageSource.includes("spec.faqItems.map"), false);
    assert.equal(faqSource.includes("PublicV3Page"), true);
    assert.equal(faqSource.includes("getPublicV3Spec"), true);
    assert.equal(sharedPageSource.includes("spec.faqGroups.map"), true);
    assert.equal(english.faqGroups.length, 3);
    assert.equal(readFileSync("proxy.ts", "utf8").includes('"/faq"'), true);
  });

  it("keeps final V3 supporting-page structure and product boundaries locked", () => {
    const english = getPublicV3Spec("en");

    assert.equal(english.features.length, 6);
    assert.equal(english.trust.length, 6);
    assert.equal(english.demo.questions.length, 4);
    assert.equal(english.demo.result.length, 5);
    assert.equal(english.pilot.fit.length, 4);
    assert.equal(english.pilot.nextSteps.length, 4);
    assert.equal(english.faqItems.length, 10);

    const pricingText = JSON.stringify(english.pricing);
    for (const value of [
      "$0 setup",
      "$149 setup + $49/month",
      "$199 setup + $79/month",
    ]) {
      assert.equal(pricingText.includes(value), true, value);
    }
    assert.match(english.faqItems[0]?.answer ?? "", /not active product functionality/i);
    assert.match(english.trust[3]?.title ?? "", /Human review/i);
    assert.match(english.pricing.notice, /No checkout happens/i);

    for (const file of [
      "app/features/page.tsx",
      "app/trust/page.tsx",
      "app/demo/page.tsx",
      "app/pricing/page.tsx",
      "app/faq/page.tsx",
      "app/pilot/page.tsx",
    ]) {
      const source = readFileSync(file, "utf8");
      assert.equal(source.includes("PublicV3Page"), true, file);
      assert.equal(source.includes("getPublicV3Spec"), true, file);
    }

    const sharedPage = readFileSync(
      "components/public/public-v3-page.tsx",
      "utf8",
    );
    for (const required of [
      "FeaturesContent",
      "DemoContent",
      "PricingContent",
      "PilotContent",
      "FaqContent",
      "TrustContent",
    ]) {
      assert.equal(sharedPage.includes(required), true, required);
    }

    for (const [file, forbidden] of [
      ["app/page.tsx", "min-h-[170px]"],
      ["app/page.tsx", "min-h-[260px]"],
      ["app/features/page.tsx", "min-h-[210px]"],
    ] as const) {
      assert.equal(readFileSync(file, "utf8").includes(forbidden), false, file);
    }
  });

  it("keeps founder-pilot conversion honest, bilingual, and non-submitting", () => {
    const englishPilot = getPublicV3Spec("en").pilot;
    const frenchPilot = getPublicV3Spec("fr-CA").pilot;

    assert.equal(englishPilot.fit.length, 4);
    assert.equal(frenchPilot.fit.length, 4);
    assert.equal(englishPilot.applicationFields.length, 7);
    assert.equal(frenchPilot.applicationFields.length, 7);
    assert.match(englishPilot.submissionBoundary, /does not submit or store/i);
    assert.match(frenchPilot.submissionBoundary, /n'envoie ni ne conserve/i);

    const pilotSource = readFileSync("app/pilot/page.tsx", "utf8");
    for (const forbidden of ["<form", "<input", "<select", "<textarea"]) {
      assert.equal(pilotSource.includes(forbidden), false, forbidden);
    }
    assert.equal(pilotSource.includes("PublicV3Page"), true);
    assert.equal(pilotSource.includes("getPublicV3Spec"), true);

    const conversionSource = readFileSync(
      "components/public/public-v3-pilot-request.tsx",
      "utf8",
    );
    assert.equal(conversionSource.includes("navigator.clipboard.writeText"), true);
    assert.equal(conversionSource.includes("selectTemplate"), true);
    assert.equal(conversionSource.includes('aria-live="polite"'), true);
    for (const forbidden of ["mailto:", "fetch(", "XMLHttpRequest", "<form"]) {
      assert.equal(conversionSource.includes(forbidden), false, forbidden);
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
        "globalError",
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
        "faq",
        "comparison",
        "quoteLinkGuide",
        "replySpeedGuide",
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
    const englishQuoteFields = getBizPilotCopy("en").quoteFields;
    const frenchQuoteFields = getBizPilotCopy("fr-CA").quoteFields;
    const englishCustomerContact = englishQuoteFields.customer_contact;
    const frenchCustomerPhone = frenchQuoteFields.customer_phone;
    const englishCustomerEmail = englishQuoteFields.customer_email;

    assert.ok(englishCustomerContact);
    assert.ok(frenchCustomerPhone);
    assert.ok(englishCustomerEmail);

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
        fieldKey: "customer_contact",
        helpText: "Courriel ou téléphone pour le suivi du propriétaire.",
        label: "Customer contact",
        language: "en",
      }),
      {
        helpText: englishCustomerContact.helpText,
        label: englishCustomerContact.label,
      },
    );

    assert.deepEqual(
      localizeDefaultQuoteField({
        fieldKey: "customer_phone",
        helpText: "Best phone number for owner follow-up.",
        label: "Phone number",
        language: "fr-CA",
      }),
      {
        helpText: frenchCustomerPhone.helpText,
        label: frenchCustomerPhone.label,
      },
    );

    assert.deepEqual(
      localizeDefaultQuoteField({
        fieldKey: "customer_email",
        helpText: "Meilleur courriel pour le suivi du propriétaire.",
        label: "Email address",
        language: "en",
      }),
      {
        helpText: englishCustomerEmail.helpText,
        label: englishCustomerEmail.label,
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
      getBizPilotCopy("en").dashboard.configuration.fields.typeLabels.time,
      "Exact time",
    );
    assert.equal(
      getBizPilotCopy("fr-CA").dashboard.configuration.fields.typeLabels.time,
      "Heure exacte",
    );
    assert.equal(
      getBizPilotCopy("fr-CA").quoteFields.preferred_time?.label,
      "Heure exacte souhaitée",
    );
    assert.deepEqual(
      localizeDefaultQuoteField({
        fieldKey: "preferred_time",
        helpText:
          "Optional exact local time. Availability is still confirmed manually.",
        label: "Exact preferred time",
        language: "fr-CA",
      }),
      {
        helpText:
          "Heure exacte souhaitée. L'entreprise vérifie toujours la disponibilité avant de confirmer.",
        label: "Heure exacte souhaitée",
      },
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
        getBizPilotCopy("en").intakeErrors.validTime("Preferred exact time"),
      ),
      true,
    );
    assert.equal(
      isSafePublicIntakeMessage(
        getBizPilotCopy("fr-CA").intakeErrors.validTime(
          "Heure exacte souhaitée",
        ),
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
      englishNotice,
      "By sending this request, you agree to share your information with this business so they can respond to your quote request. BizPilot may help prepare an internal draft, but the business reviews every message before sending it.",
    );
    assert.equal(
      frenchNotice,
      "En envoyant cette demande, vous acceptez que vos renseignements soient partagés avec cette entreprise afin qu’elle puisse répondre à votre demande de soumission. BizPilot peut aider à préparer un brouillon interne, mais l’entreprise révise chaque message avant de l’envoyer.",
    );
    assert.equal(
      getBizPilotCopy("en").quoteForm.guardrail,
      "Submitting this form does not confirm pricing, availability, or booking.",
    );
    assert.equal(
      getBizPilotCopy("fr-CA").quoteForm.guardrail,
      "L’envoi de ce formulaire ne confirme ni prix, ni disponibilité, ni réservation.",
    );

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
        value:
          "By submitting this request, you agree that your information will be shared with this business to respond to your quote request. BizPilot may help prepare internal AI drafts, but the business reviews messages before sending.",
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

  it("keeps quote success copy from implying booking, pricing, or availability confirmation", () => {
    const english = getBizPilotCopy("en").quoteSuccess;
    const englishBody = [
      english.body,
      english.meta.description,
      ...english.steps("Sparkle Cleaning"),
    ].join(" ");

    assert.equal(englishBody.includes("Nothing is booked"), true);
    assert.equal(englishBody.includes("no price is confirmed"), true);
    assert.equal(englishBody.includes("availability still needs business review"), true);
    assert.equal(englishBody.includes("no automatic messages"), true);

    const french = getBizPilotCopy("fr-CA").quoteSuccess;
    const frenchBody = [
      french.body,
      french.meta.description,
      ...french.steps("BizPilot Test"),
    ].join(" ");

    assert.equal(frenchBody.includes("Aucune réservation"), true);
    assert.equal(frenchBody.includes("aucun prix n'est confirmé"), true);
    assert.equal(frenchBody.includes("aucune disponibilité ne sont confirmés"), true);
    assert.equal(frenchBody.includes("aucun message automatique"), true);
  });
});
