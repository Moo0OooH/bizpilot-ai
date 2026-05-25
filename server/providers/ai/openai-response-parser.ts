/**
 * ============================================================
 * File: server/providers/ai/openai-response-parser.ts
 * Project: BizPilot AI
 * Description: Extracts generated text from OpenAI Responses API payloads.
 * Role: Keeps the provider resilient to SDK-style output_text and raw REST output items.
 * Related:
 * - server/providers/ai/openai-provider.ts
 * Author: MoOoH
 * Created: 2026-05-25
 * Last Updated: 2026-05-25
 * Change Log:
 * - 2026-05-25: Added raw Responses API output item parser.
 * ============================================================
 */

type OpenAiResponseContentItem = Readonly<{
  text?: unknown;
  type?: unknown;
}>;

type OpenAiResponseOutputItem = Readonly<{
  content?: unknown;
}>;

type OpenAiResponsePayload = Readonly<{
  output?: unknown;
  output_text?: unknown;
}>;

function readNonEmptyText(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  return value.trim().length > 0 ? value : null;
}

export function extractOpenAiResponseText(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const response = payload as OpenAiResponsePayload;
  const directText = readNonEmptyText(response.output_text);

  if (directText) {
    return directText;
  }

  if (!Array.isArray(response.output)) {
    return null;
  }

  const chunks: string[] = [];

  for (const outputItem of response.output) {
    if (!outputItem || typeof outputItem !== "object") {
      continue;
    }

    const content = (outputItem as OpenAiResponseOutputItem).content;

    if (!Array.isArray(content)) {
      continue;
    }

    for (const contentItem of content) {
      if (!contentItem || typeof contentItem !== "object") {
        continue;
      }

      const item = contentItem as OpenAiResponseContentItem;
      const text = readNonEmptyText(item.text);

      if (
        text &&
        (item.type === "output_text" ||
          item.type === "text" ||
          typeof item.type !== "string")
      ) {
        chunks.push(text);
      }
    }
  }

  return chunks.length > 0 ? chunks.join("\n") : null;
}
