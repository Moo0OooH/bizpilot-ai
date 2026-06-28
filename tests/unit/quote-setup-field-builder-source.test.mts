/**
 * File: tests/unit/quote-setup-field-builder-source.test.mts
 * Project: BizPilot AI
 * Description: Source guards for Quote Setup custom-field type switching.
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
    assert.equal(source.includes('time_window: {'), true);
    assert.equal(source.includes("placeholder={placeholder.label}"), true);
    assert.equal(source.includes("placeholder={placeholder.options}"), true);
    assert.equal(source.includes("{placeholder.preview}"), true);
  });
});
