/**
 * ============================================================
 * File: tests/unit/quote-setup-field-builder-source.test.mts
 * Project: BizPilot AI
 * Description: Source guards for Quote Setup custom-field type switching.
 * Role: Prevents client-state regressions and protects exact-time field setup semantics.
 * Related:
 * - components/dashboard/custom-quote-field-builder.tsx
 * - components/dashboard/quote-field-type-control.tsx
 * - server/actions/business-configuration.actions.ts
 * Author: MoOoH
 * Created: 2026-06-27
 * Last Updated: 2026-07-22
 * Change Log:
 * - 2026-07-22: Added exact-time type and reserved canonical-key source contracts.
 * - 2026-07-22: Guarded business-language starter content from dashboard-interface locale leakage.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("Quote Setup field builder source safety", () => {
  it("captures field type changes before the React state updater runs", () => {
    const source = readFileSync(
      "components/dashboard/custom-quote-field-builder.tsx",
      "utf8",
    );
    const selectHandlerStart = source.indexOf("const nextType =");

    assert.notEqual(selectHandlerStart, -1);
    assert.notEqual(
      source.indexOf("event.currentTarget.value as QuoteFieldType", selectHandlerStart),
      -1,
    );
    const stateUpdaterSnippet = source.slice(
      source.indexOf("setFields((current) =>", selectHandlerStart),
      source.indexOf(");", source.indexOf("setFields((current) =>", selectHandlerStart)) + 2,
    );

    assert.equal(stateUpdaterSnippet.includes("event.currentTarget"), false);
    assert.equal(stateUpdaterSnippet.includes("type: nextType"), true);
  });

  it("keeps type-specific placeholders and samples in the add-field builder", () => {
    const source = readFileSync(
      "components/dashboard/custom-quote-field-builder.tsx",
      "utf8",
    );

    assert.equal(source.includes("fallbackPlaceholders"), true);
    assert.equal(source.includes("frenchFallbackPlaceholders"), true);
    assert.equal(source.includes('radio: {'), true);
    assert.equal(source.includes('select: {'), true);
    assert.equal(source.includes('time: {'), true);
    assert.equal(source.includes('time_window: {'), true);
    assert.equal(source.includes("placeholder={placeholder.label}"), true);
    assert.equal(source.includes("placeholder={placeholder.options}"), true);
    assert.equal(source.includes("{placeholder.preview}"), true);
  });

  it("supports exact-time fields without treating them as choice fields", () => {
    const builder = readFileSync(
      "components/dashboard/custom-quote-field-builder.tsx",
      "utf8",
    );
    const typeControl = readFileSync(
      "components/dashboard/quote-field-type-control.tsx",
      "utf8",
    );
    const action = readFileSync(
      "server/actions/business-configuration.actions.ts",
      "utf8",
    );
    const repository = readFileSync(
      "server/repositories/business-configuration.repository.ts",
      "utf8",
    );
    const databaseTypes = readFileSync("types/database.ts", "utf8");
    const choiceTypes = typeControl.slice(
      typeControl.indexOf("const choiceFieldTypes"),
      typeControl.indexOf("const fieldInputClass"),
    );

    assert.match(builder, /configurableFieldTypes[\s\S]*"time"/);
    assert.match(typeControl, /configurableFieldTypes[\s\S]*"time"/);
    assert.doesNotMatch(choiceTypes, /^\s*"time",?$/m);
    assert.match(repository, /allowedTypes[\s\S]*"time"/);
    assert.match(
      repository,
      /fieldKey === canonicalExactTimeFieldKey[\s\S]*fieldType: "time"/,
    );
    assert.match(
      repository,
      /entry\[0\] !== canonicalExactTimeFieldKey && isRecord\(entry\[1\]\)/,
    );
    assert.match(databaseTypes, /field_type:[\s\S]*\| "time"/);
    assert.equal(
      action.includes(
        "The preferred_time key is reserved for the template's exact-time field.",
      ),
      true,
    );
    assert.equal(action.includes("canonicalExactTimeFieldKey"), true);
    assert.equal(action.includes('input.fieldType !== "time"'), true);
  });

  it("keeps persisted starter content in the business language", () => {
    const builder = readFileSync(
      "components/dashboard/custom-quote-field-builder.tsx",
      "utf8",
    );
    const configurationPage = readFileSync(
      "app/(dashboard)/dashboard/configuration/page.tsx",
      "utf8",
    );
    assert.equal(builder.includes("contentLanguage"), true);
    assert.equal(builder.includes("contentPlaceholders"), true);
    assert.equal(builder.includes("persistedPlaceholders[type]"), true);
    assert.equal(builder.includes("copy.placeholders?.[type]"), false);
    assert.equal(
      configurationPage.includes(
        "publicBusinessCopy.dashboard.configuration.fields.placeholders",
      ),
      true,
    );
    assert.equal(
      configurationPage.includes(
        "contentLanguage={activeBusiness.preferred_language}",
      ),
      true,
    );
  });
});
