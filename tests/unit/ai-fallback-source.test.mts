import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("AI fallback source safety", () => {
  it("keeps provider/schema failures on the sanitized rule-fallback path", () => {
    const source = readFileSync(
      "server/services/ai/lead-conversion-assistant.service.ts",
      "utf8",
    );

    assert.equal(source.includes("sanitizeAiFailureReason(error)"), true);
    assert.equal(source.includes("fallbackBundle({ language, lead, qualityScore })"), true);
    assert.equal(source.includes('provider: "rule_fallback"'), true);
    assert.equal(source.includes('eventType: "ai_bundle_fallback"'), true);
    assert.equal(source.includes('eventLabel: "AI fallback draft prepared"'), true);
    assert.equal(source.includes("errorMessage: sanitizedReason"), true);
  });
});
