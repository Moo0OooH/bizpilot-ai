/**
 * ============================================================
 * File: tests/unit/quote-field-translation-overrides.test.mts
 * Project: BizPilot AI
 * Description: Source guards for bilingual custom quote-field override storage and public resolution.
 * Role: Protects the translation-map merge and lookup hooks that keep EN/FR custom labels from regressing into mixed-language public forms.
 * Related:
 * - server/actions/business-configuration.actions.ts
 * - server/repositories/business-configuration.repository.ts
 * - server/repositories/public-intake.repository.ts
 * Author: MoOoH
 * Created: 2026-07-11
 * Last Updated: 2026-07-11
 * Change Log:
 * - 2026-07-11: Added source guards for bilingual custom quote-field translation storage and public lookup.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("quote-field translation override source guards", () => {
  it("stores per-language translations during quote-setup saves", () => {
    const action = readFileSync(
      "server/actions/business-configuration.actions.ts",
      "utf8",
    );

    assert.equal(action.includes("function buildFieldTranslations"), true);
    assert.equal(action.includes("[input.language]"), true);
    assert.equal(action.includes("translations"), true);
    assert.equal(
      action.includes("fieldOverrides: readTemplateFieldOverrides(formData, preferredLanguage)"),
      true,
    );
  });

  it("parses, merges, and resolves translations from template overrides", () => {
    const repository = readFileSync(
      "server/repositories/business-configuration.repository.ts",
      "utf8",
    );

    for (const marker of [
      "export type TemplateFieldTranslations",
      "function readTemplateFieldTranslations",
      "function mergeTemplateFieldTranslations",
      "export function mergeTemplateFieldOverridesForLanguage",
      "export function resolveLocalizedTemplateFieldCopy",
      "input.translations?.[language]",
    ]) {
      assert.equal(
        repository.includes(marker),
        true,
        `Missing repository translation marker: ${marker}`,
      );
    }
  });

  it("keeps public quote reads wired to bilingual override resolution", () => {
    const publicRepository = readFileSync(
      "server/repositories/public-intake.repository.ts",
      "utf8",
    );
    const configService = readFileSync(
      "server/services/business-configuration.service.ts",
      "utf8",
    );

    assert.equal(
      publicRepository.includes("readLocalizedPublicFieldOverrides"),
      true,
    );
    assert.equal(
      publicRepository.includes("createSupabaseServiceRoleClient"),
      true,
    );
    assert.equal(
      publicRepository.includes("resolveLocalizedTemplateFieldCopy"),
      true,
    );
    assert.equal(
      configService.includes("mergeTemplateFieldOverridesForLanguage"),
      true,
    );
  });
});
