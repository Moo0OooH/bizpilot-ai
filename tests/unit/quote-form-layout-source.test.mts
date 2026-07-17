/**
 * File: tests/unit/quote-form-layout-source.test.mts
 * Project: BizPilot AI
 * Description: Source contracts for migration-free quote-form layout persistence.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function source(path: string): string {
  return readFileSync(path, "utf8");
}

describe("quote form layout source contracts", () => {
  it("stores layouts and section assignments inside existing field overrides", () => {
    const repository = source(
      "server/repositories/business-configuration.repository.ts",
    );

    for (const marker of [
      "formLayout?: QuoteFormLayout",
      "sectionKey?: string",
      "parseQuoteFormLayout(value.formLayout)",
      "serializeQuoteFormLayout(overrides.formLayout)",
      "mergeQuoteFormLayoutsForLanguage",
      "section_key: sectionKey",
    ]) {
      assert.equal(repository.includes(marker), true, `Missing ${marker}`);
    }
  });

  it("keeps Business Profile saves from rewriting quote fields or layout", () => {
    const action = source("server/actions/business-configuration.actions.ts");
    const service = source("server/services/business-configuration.service.ts");

    assert.equal(
      action.includes('reviewScope === "quote_setup"'),
      true,
    );
    assert.equal(service.includes("fieldOverrides?: Json"), true);
    assert.equal(service.includes("if (mergedFieldOverrides)"), true);
  });

  it("uses a legacy-safe public options metadata envelope", () => {
    const layout = source("lib/quote-form-layout.ts");
    const repository = source("server/repositories/public-intake.repository.ts");
    const service = source("server/services/public-intake.service.ts");

    assert.equal(layout.includes("Array.isArray(value)"), true);
    assert.equal(layout.includes("choices:"), true);
    assert.equal(layout.includes("formLayout:"), true);
    assert.equal(layout.includes("sectionKey:"), true);
    assert.equal(repository.includes("encodePublicQuoteFieldOptions"), true);
    assert.equal(repository.includes("decodePublicQuoteFieldOptions"), true);
    assert.equal(repository.includes("formLayout,"), true);
    assert.equal(service.includes("getPublicQuoteFieldChoices"), true);
  });

  it("keeps question visibility independent from section visibility", () => {
    const businessRepository = source(
      "server/repositories/business-configuration.repository.ts",
    );

    assert.equal(
      businessRepository.includes(
        "is_hidden: fieldOverride?.isHidden ?? isLegacyHidden ?? false",
      ),
      true,
    );
    assert.equal(
      businessRepository.includes("is_hidden: field.isHidden ?? false"),
      true,
    );
    assert.equal(businessRepository.includes("sectionHidden ||"), false);
  });

  it("recovers layout metadata before filtering hidden questions and sections", () => {
    const publicRepository = source(
      "server/repositories/public-intake.repository.ts",
    );

    assert.equal(publicRepository.includes('.eq("is_hidden", false)'), false);
    assert.equal(
      publicRepository.includes("if (field.is_hidden || sectionHidden) return []"),
      true,
    );
    assert.ok(
      publicRepository.indexOf("decodePublicQuoteFieldOptions(field.options)") <
        publicRepository.indexOf("if (field.is_hidden || sectionHidden) return []"),
    );
  });
});
