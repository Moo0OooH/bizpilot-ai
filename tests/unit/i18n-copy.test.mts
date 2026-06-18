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
