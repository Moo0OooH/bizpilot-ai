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
    const selectHandlerStart = source.indexOf(
      "const nextType = event.currentTarget.value as QuoteFieldType;",
    );

    assert.notEqual(selectHandlerStart, -1);
    const stateUpdaterSnippet = source.slice(
      source.indexOf("setFields((current) =>", selectHandlerStart),
      source.indexOf(");", source.indexOf("setFields((current) =>", selectHandlerStart)) + 2,
    );

    assert.equal(stateUpdaterSnippet.includes("event.currentTarget"), false);
    assert.equal(stateUpdaterSnippet.includes("type: nextType"), true);
  });
});
