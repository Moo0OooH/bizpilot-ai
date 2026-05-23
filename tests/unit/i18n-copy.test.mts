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
import { languageDefinitions, supportedLanguages } from "../../lib/i18n/language.ts";

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
        "problem",
        "recoveryFlow",
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
