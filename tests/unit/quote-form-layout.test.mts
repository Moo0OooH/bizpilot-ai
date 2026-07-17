/**
 * File: tests/unit/quote-form-layout.test.mts
 * Project: BizPilot AI
 * Description: Unit coverage for the versioned public quote-form layout contract.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  decodePublicQuoteFieldOptions,
  encodePublicQuoteFieldOptions,
  getDefaultQuoteFormLayout,
  inferLegacyQuoteSectionKey,
  localizeQuoteFormLayout,
  mergeQuoteFormLayoutsForLanguage,
  normalizeQuoteFormLayout,
  parseQuoteFormLayout,
  resolveQuoteFieldSectionKey,
  serializeQuoteFormLayout,
  type QuoteFormLayout,
} from "../../lib/quote-form-layout.ts";

function customLayout(): QuoteFormLayout {
  return {
    displayMode: "tabs",
    header: {
      subtitle: "Tell us about the work.",
      title: "Request service",
      translations: {
        en: { subtitle: "Tell us about the work.", title: "Request service" },
        "fr-CA": {
          subtitle: "Décrivez-nous le travail.",
          title: "Demander un service",
        },
      },
    },
    sections: [
      {
        description: "Choose the work you need.",
        isHidden: false,
        key: "service",
        navLabel: "Service",
        sortOrder: 10,
        title: "What do you need?",
        translations: {
          en: {
            description: "Choose the work you need.",
            navLabel: "Service",
            title: "What do you need?",
          },
          "fr-CA": {
            description: "Choisissez le travail requis.",
            navLabel: "Service",
            title: "De quoi avez-vous besoin?",
          },
        },
      },
      {
        isHidden: true,
        key: "internal_details",
        navLabel: "Details",
        sortOrder: 20,
        title: "More details",
      },
    ],
    version: 1,
  };
}

describe("quote form layout", () => {
  it("keeps the legacy three-section experience as the safe bilingual default", () => {
    const english = getDefaultQuoteFormLayout("en");
    const french = getDefaultQuoteFormLayout("fr-CA");

    assert.equal(english.displayMode, "list");
    assert.deepEqual(
      english.sections.map((section) => section.key),
      ["service", "when_where", "contact"],
    );
    assert.equal(english.header.title, "Request a cleaning quote");
    assert.equal(english.sections[0]?.title, "What kind of cleaning?");
    assert.equal(french.header.title, "Demander une soumission de nettoyage");
    assert.equal(french.sections[0]?.title, "Quel type de nettoyage?");
  });

  it("round-trips valid layouts and safely falls back for malformed metadata", () => {
    const layout = customLayout();
    const serialized = serializeQuoteFormLayout(layout);

    assert.deepEqual(parseQuoteFormLayout(serialized), layout);
    assert.equal(parseQuoteFormLayout({ version: 99, sections: [] }), null);
    assert.equal(
      normalizeQuoteFormLayout({ broken: true }).sections[0]?.key,
      "service",
    );
  });

  it("localizes saved header and section copy without changing stable keys", () => {
    const localized = localizeQuoteFormLayout({
      language: "fr-CA",
      layout: customLayout(),
    });

    assert.equal(localized.header.title, "Demander un service");
    assert.equal(localized.sections[0]?.key, "service");
    assert.equal(
      localized.sections[0]?.title,
      "De quoi avez-vous besoin?",
    );

    const withoutOptionalCopy = localizeQuoteFormLayout({
      language: "en",
      layout: {
        ...customLayout(),
        header: { title: "Short request" },
        sections: [
          {
            key: "service",
            navLabel: "Service",
            sortOrder: 10,
            title: "Choose service",
          },
        ],
      },
    });
    assert.equal(withoutOptionalCopy.header.subtitle, undefined);
    assert.equal(withoutOptionalCopy.sections[0]?.description, undefined);
  });

  it("merges only the edited language while preserving alternate copy", () => {
    const existing = customLayout();
    const incoming: QuoteFormLayout = {
      ...existing,
      header: { subtitle: "Updated", title: "Updated request" },
      sections: [
        {
          description: "Updated description",
          key: "service",
          navLabel: "Updated nav",
          sortOrder: 10,
          title: "Updated title",
        },
      ],
    };
    const merged = mergeQuoteFormLayoutsForLanguage({
      currentLanguage: "en",
      existing,
      incoming,
    });

    assert.equal(merged.header.translations?.en?.title, "Updated request");
    assert.equal(
      merged.header.translations?.["fr-CA"]?.title,
      "Demander un service",
    );
    assert.equal(
      merged.sections[0]?.translations?.["fr-CA"]?.title,
      "De quoi avez-vous besoin?",
    );
  });

  it("keeps deterministic legacy assignment and explicit hidden-section assignment", () => {
    const layout = customLayout();

    assert.equal(inferLegacyQuoteSectionKey("cleaning_type"), "service");
    assert.equal(inferLegacyQuoteSectionKey("preferred_date"), "when_where");
    assert.equal(inferLegacyQuoteSectionKey("customer_email"), "contact");
    assert.equal(
      resolveQuoteFieldSectionKey({
        fieldKey: "notes",
        formLayout: layout,
        sectionKey: "internal_details",
      }),
      "internal_details",
    );
  });

  it("decodes legacy choice arrays and the new metadata envelope", () => {
    assert.deepEqual(
      decodePublicQuoteFieldOptions(["house", "condo"]).choices,
      ["house", "condo"],
    );

    const encoded = encodePublicQuoteFieldOptions({
      choices: ["house", "condo"],
      formLayout: customLayout(),
      sectionKey: "service",
    });
    const decoded = decodePublicQuoteFieldOptions(encoded);

    assert.deepEqual(decoded.choices, ["house", "condo"]);
    assert.equal(decoded.sectionKey, "service");
    assert.equal(decoded.formLayout?.displayMode, "tabs");
    assert.deepEqual(
      decodePublicQuoteFieldOptions({
        choices: "not-an-array",
        formLayout: { version: 999 },
        sectionKey: "../bad",
      }).choices,
      [],
    );
  });
});
