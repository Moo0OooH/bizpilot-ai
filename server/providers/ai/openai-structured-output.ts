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

export type OpenAiStructuredRequestDiagnostics = Readonly<{
  formatType: string | null;
  hasJsonSchemaFormat: boolean;
  model: string;
  schemaName: string | null;
  strict: boolean | null;
  usesResponsesApi: true;
}>;

export type OpenAiStructuredResponseDiagnostics = Readonly<{
  balancedJsonObjectFound: boolean;
  contentPartCount: number;
  contentPartTypes: string;
  directTextLength: number;
  directTextPresent: boolean;
  extractedFirstCharacterClass: string;
  extractedTextLength: number;
  generatedItemCount: number;
  generatedItemTypes: string;
  incompleteReason: string | null;
  parsedHelperPresent: boolean;
  responseErrorCode: string | null;
  responseErrorType: string | null;
  responseIdPresent: boolean;
  responseStatus: string | null;
  textPartPresent: boolean;
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

function readRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
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

function characterClass(value: string | null): string {
  const first = value?.trimStart()[0];

  if (!first) {
    return "empty";
  }

  if (first === "{") {
    return "object_start";
  }

  if (first === "[") {
    return "array_start";
  }

  if (first === "`") {
    return "code_fence";
  }

  if (/[a-z]/i.test(first)) {
    return "letter";
  }

  if (/\d/.test(first)) {
    return "digit";
  }

  return "other";
}

function summarizeTypes(values: string[]): string {
  return values.length > 0 ? Array.from(new Set(values)).join(",") : "none";
}

export function getOpenAiStructuredRequestDiagnostics(
  payload: Record<string, unknown>,
): OpenAiStructuredRequestDiagnostics {
  const text = readRecord(payload.text);
  const format = readRecord(text?.format);

  return {
    formatType: readString(format?.type),
    hasJsonSchemaFormat: format?.type === "json_schema",
    model: readString(payload.model) ?? "unknown",
    schemaName: readString(format?.name),
    strict: typeof format?.strict === "boolean" ? format.strict : null,
    usesResponsesApi: true,
  };
}

export function getOpenAiStructuredResponseDiagnostics(input: {
  extractedText: string | null;
  payload: unknown;
}): OpenAiStructuredResponseDiagnostics {
  const payload = readRecord(input.payload);
  const error = readRecord(payload?.error);
  const incompleteDetails = readRecord(payload?.incomplete_details);
  const output = Array.isArray(payload?.output) ? payload.output : [];
  const outputItemTypes: string[] = [];
  const contentPartTypes: string[] = [];
  let contentPartCount = 0;
  let outputTextPartPresent = false;

  for (const item of output) {
    const outputItem = readRecord(item);
    const itemType = readString(outputItem?.type);
    if (itemType) {
      outputItemTypes.push(itemType);
    }

    const content = Array.isArray(outputItem?.content) ? outputItem.content : [];
    for (const part of content) {
      contentPartCount += 1;
      const contentPart = readRecord(part);
      const partType = readString(contentPart?.type);
      if (partType) {
        contentPartTypes.push(partType);
      }
      if (partType === "output_text" || partType === "text") {
        outputTextPartPresent = true;
      }
    }
  }

  const directOutputText = readString(payload?.output_text);

  return {
    balancedJsonObjectFound: Boolean(
      input.extractedText && firstBalancedJsonObject(input.extractedText),
    ),
    contentPartCount,
    contentPartTypes: summarizeTypes(contentPartTypes),
    directTextLength: directOutputText?.length ?? 0,
    directTextPresent: Boolean(directOutputText),
    extractedFirstCharacterClass: characterClass(input.extractedText),
    extractedTextLength: input.extractedText?.length ?? 0,
    generatedItemCount: output.length,
    generatedItemTypes: summarizeTypes(outputItemTypes),
    incompleteReason: readString(incompleteDetails?.reason),
    parsedHelperPresent: Boolean(payload && "output_parsed" in payload),
    responseErrorCode: readString(error?.code),
    responseErrorType: readString(error?.type),
    responseIdPresent: Boolean(readString(payload?.id)),
    responseStatus: readString(payload?.status),
    textPartPresent: outputTextPartPresent,
  };
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
