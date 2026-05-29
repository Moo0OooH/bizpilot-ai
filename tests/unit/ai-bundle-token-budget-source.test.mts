import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("AI bundle token budget source", () => {
  it("passes a larger output budget only for the lead conversion bundle", () => {
    const source = readFileSync(
      "server/services/ai/lead-conversion-assistant.service.ts",
      "utf8",
    );

    assert.equal(
      source.includes("LEAD_CONVERSION_BUNDLE_MAX_OUTPUT_TOKENS = 3_000"),
      true,
    );
    assert.equal(
      source.includes("maxOutputTokens: LEAD_CONVERSION_BUNDLE_MAX_OUTPUT_TOKENS"),
      true,
    );
  });
});
