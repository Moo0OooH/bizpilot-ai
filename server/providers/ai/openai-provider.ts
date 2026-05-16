/**
 * ============================================================
 * File: server/providers/ai/openai-provider.ts
 * Project: BizPilot AI
 * Description: Phase 15 concrete OpenAI implementation of the AIProvider boundary.
 * Role: Owns the raw fetch to https://api.openai.com/v1/responses and the JSON-schema
 *       contract so the assistant service can stay provider-agnostic.
 * Related:
 * - server/providers/ai/ai-provider.ts
 * - server/providers/ai/index.ts
 * Author: MoOoH
 * Created: 2026-05-15
 * Last Updated: 2026-05-15
 * Change Log:
 * - 2026-05-15: Extracted the OpenAI call from lead-conversion-assistant.service.ts.
 * ============================================================
 */

import "server-only";

import {
  AI_PROVIDER_ERROR_CODES,
  AiProviderError,
  type AIProvider,
  type GenerateStructuredBundleInput,
  type GenerateStructuredBundleOutput,
} from "@/server/providers/ai/ai-provider";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MAX_OUTPUT_TOKENS = 900;

export type OpenAiProviderConfig = Readonly<{
  apiKey: string;
}>;

export function createOpenAiProvider(config: OpenAiProviderConfig): AIProvider {
  if (!config.apiKey || config.apiKey.trim().length === 0) {
    throw new AiProviderError({
      code: AI_PROVIDER_ERROR_CODES.notConfigured,
      message: "OpenAI API key is required to construct the provider.",
      providerName: "openai",
    });
  }

  return {
    providerName: "openai",
    async generateStructuredBundle<T>(
      input: GenerateStructuredBundleInput<T>,
    ): Promise<GenerateStructuredBundleOutput<T>> {
      let response: Response;

      try {
        response = await fetch(OPENAI_RESPONSES_URL, {
          body: JSON.stringify({
            input: input.inputContext,
            instructions: input.instructions,
            max_output_tokens: input.maxOutputTokens ?? DEFAULT_MAX_OUTPUT_TOKENS,
            model: input.model,
            text: {
              format: {
                name: input.schema.name,
                schema: input.schema.definition,
                strict: true,
                type: "json_schema",
              },
            },
          }),
          headers: {
            Authorization: `Bearer ${config.apiKey}`,
            "Content-Type": "application/json",
          },
          method: "POST",
        });
      } catch (cause) {
        throw new AiProviderError({
          cause,
          code: AI_PROVIDER_ERROR_CODES.requestFailed,
          message: "OpenAI request failed at network layer.",
          providerName: "openai",
        });
      }

      if (!response.ok) {
        throw new AiProviderError({
          code: AI_PROVIDER_ERROR_CODES.requestFailed,
          message: `OpenAI request failed with status ${response.status}.`,
          providerName: "openai",
        });
      }

      const payload = (await response.json()) as { output_text?: string };
      const outputText = payload.output_text;

      if (!outputText) {
        throw new AiProviderError({
          code: AI_PROVIDER_ERROR_CODES.emptyOutput,
          message: "OpenAI response did not include output text.",
          providerName: "openai",
        });
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(outputText);
      } catch (cause) {
        throw new AiProviderError({
          cause,
          code: AI_PROVIDER_ERROR_CODES.invalidSchema,
          message: "OpenAI response was not valid JSON.",
          providerName: "openai",
        });
      }

      const validated = input.validate(parsed);

      if (validated === null) {
        throw new AiProviderError({
          code: AI_PROVIDER_ERROR_CODES.invalidSchema,
          message: "OpenAI response did not match the expected schema.",
          providerName: "openai",
        });
      }

      return {
        output: validated,
        outputText,
      };
    },
  };
}
