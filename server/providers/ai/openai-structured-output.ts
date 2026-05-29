/**
 * ============================================================
 * File: server/providers/ai/openai-structured-output.ts
 * Project: BizPilot AI
 * Description: Small helpers for OpenAI Responses API structured output payloads.
 * Role: Keeps the JSON-schema request shape and tolerant JSON extraction testable.
 * Related:
 * - server/providers/ai/openai-provider.ts
 * - tests/unit/openai-structured-output.test.mts
 * Author: MoOoH
 * Created: 2026-05-29
 * ============================================================
 */

export type OpenAiStructuredOutputSchema = Readonly<{
  definition: unknown;
  name: string;
}>;

export type OpenAiStructuredResponsePayloadInput = Readonly<{
  inputContext: string;
  instructions: string;
  maxOutputTokens: number;
  model: string;
  schema: OpenAiStructuredOutputSchema;
}>;

export function buildOpenAiStructuredResponsePayload(
  input: OpenAiStructuredResponsePayloadInput,
): Record<string, unknown> {
  return {
    input: input.inputContext,
    instructions: input.instructions,
    max_output_tokens: input.maxOutputTokens,
    model: input.model,
    text: {
      format: {
        name: input.schema.name,
        schema: input.schema.definition,
        strict: true,
        type: "json_schema",
      },
    },
  };
}

function firstBalancedJsonObject(value: string): string | null {
  const start = value.indexOf("{");

  if (start < 0) {
    return null;
  }

  let depth = 0;
  let escaped = false;
  let inString = false;

  for (let index = start; index < value.length; index += 1) {
    const character = value[index];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (character === "\\") {
      escaped = inString;
      continue;
    }

    if (character === "\"") {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (character === "{") {
      depth += 1;
    } else if (character === "}") {
      depth -= 1;

      if (depth === 0) {
        return value.slice(start, index + 1);
      }
    }
  }

  return null;
}

export function parseOpenAiStructuredJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    const candidate = firstBalancedJsonObject(value);

    if (!candidate) {
      throw new SyntaxError("OpenAI structured output did not contain a JSON object.");
    }

    return JSON.parse(candidate);
  }
}
