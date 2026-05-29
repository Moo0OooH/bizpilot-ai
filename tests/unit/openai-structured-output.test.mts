import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildOpenAiStructuredResponsePayload,
  parseOpenAiStructuredJson,
} from "../../server/providers/ai/openai-structured-output.ts";

const bundleSchema = {
  additionalProperties: false,
  properties: {
    followUpDraft: { type: "string" },
    leadQualityExplanation: { type: "string" },
    leadSummary: { type: "string" },
    missingInfoReasoning: { type: "string" },
    replyDraft: { type: "string" },
    suggestedNextAction: { type: "string" },
    toneVariants: {
      additionalProperties: false,
      properties: {
        concise: { type: "string" },
        friendly: { type: "string" },
      },
      required: ["concise", "friendly"],
      type: "object",
    },
  },
  required: [
    "followUpDraft",
    "leadQualityExplanation",
    "leadSummary",
    "missingInfoReasoning",
    "replyDraft",
    "suggestedNextAction",
    "toneVariants",
  ],
  type: "object",
} as const;

describe("OpenAI structured output helpers", () => {
  it("builds the Responses API structured-output payload shape", () => {
    const payload = buildOpenAiStructuredResponsePayload({
      inputContext: "{\"lead\":\"synthetic\"}",
      instructions: "Return only JSON.",
      maxOutputTokens: 900,
      model: "gpt-5.1",
      schema: {
        definition: bundleSchema,
        name: "lead_conversion_bundle_v1",
      },
    });

    assert.equal(payload.model, "gpt-5.1");
    assert.equal(payload.input, "{\"lead\":\"synthetic\"}");
    assert.equal(payload.instructions, "Return only JSON.");
    assert.equal(payload.max_output_tokens, 900);
    assert.deepEqual(payload.text, {
      format: {
        name: "lead_conversion_bundle_v1",
        schema: bundleSchema,
        strict: true,
        type: "json_schema",
      },
    });
  });

  it("keeps the lead bundle schema strict for structured outputs", () => {
    assert.equal(bundleSchema.additionalProperties, false);
    assert.equal(
      bundleSchema.required.length,
      Object.keys(bundleSchema.properties).length,
    );
    assert.equal(bundleSchema.properties.toneVariants.additionalProperties, false);
    assert.equal(
      bundleSchema.properties.toneVariants.required.length,
      Object.keys(bundleSchema.properties.toneVariants.properties).length,
    );
  });

  it("parses direct structured JSON", () => {
    assert.deepEqual(parseOpenAiStructuredJson("{\"leadSummary\":\"ok\"}"), {
      leadSummary: "ok",
    });
  });

  it("extracts a balanced JSON object from fenced or prefixed text", () => {
    assert.deepEqual(
      parseOpenAiStructuredJson(
        "```json\n{\"leadSummary\":\"ok\",\"toneVariants\":{\"concise\":\"a\"}}\n```",
      ),
      { leadSummary: "ok", toneVariants: { concise: "a" } },
    );

    assert.deepEqual(
      parseOpenAiStructuredJson(
        "Here is the JSON: {\"replyDraft\":\"Hello {owner}\",\"followUpDraft\":\"Later\"}",
      ),
      { replyDraft: "Hello {owner}", followUpDraft: "Later" },
    );
  });

  it("still rejects output without a parseable JSON object", () => {
    assert.throws(
      () => parseOpenAiStructuredJson("I cannot produce that."),
      /did not contain a JSON object/,
    );
  });
});
