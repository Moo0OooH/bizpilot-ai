import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { extractOpenAiResponseText } from "../../server/providers/ai/openai-response-parser.ts";

describe("OpenAI response parser", () => {
  it("reads SDK-style output_text", () => {
    assert.equal(
      extractOpenAiResponseText({ output_text: "{\"ok\":true}" }),
      "{\"ok\":true}",
    );
  });

  it("reads raw Responses API output text content", () => {
    assert.equal(
      extractOpenAiResponseText({
        output: [
          {
            content: [
              {
                text: "{\"summary\":\"ready\"}",
                type: "output_text",
              },
            ],
          },
        ],
      }),
      "{\"summary\":\"ready\"}",
    );
  });

  it("joins multiple output text chunks", () => {
    assert.equal(
      extractOpenAiResponseText({
        output: [
          {
            content: [
              {
                text: "{\"a\":",
                type: "output_text",
              },
              {
                text: "1}",
                type: "output_text",
              },
            ],
          },
        ],
      }),
      "{\"a\":\n1}",
    );
  });

  it("ignores empty or non-text payloads", () => {
    assert.equal(extractOpenAiResponseText(null), null);
    assert.equal(extractOpenAiResponseText({ output_text: "   " }), null);
    assert.equal(
      extractOpenAiResponseText({
        output: [{ content: [{ type: "refusal", text: "blocked" }] }],
      }),
      null,
    );
  });
});
