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
  type AiProviderErrorCode,
  type GenerateStructuredBundleInput,
  type GenerateStructuredBundleOutput,
} from "@/server/providers/ai/ai-provider";
import { safeLogger } from "@/server/logging/safe-logger";
import { extractOpenAiResponseText } from "@/server/providers/ai/openai-response-parser";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MAX_OUTPUT_TOKENS = 900;
const DEFAULT_REQUEST_TIMEOUT_MS = 20_000;
const OPENAI_FALLBACK_MODELS = ["gpt-4.1-mini"] as const;

export type OpenAiProviderConfig = Readonly<{
  apiKey: string;
}>;

type OpenAiErrorPayload = Readonly<{
  error?: Readonly<{
    code?: unknown;
    param?: unknown;
    type?: unknown;
  }>;
}>;

type OpenAiFailureDetails = Readonly<{
  providerErrorCode: string | null;
  providerErrorParam: string | null;
  providerErrorType: string | null;
  requestId: string | null;
  retryAfter: string | null;
  safeCode: AiProviderErrorCode;
  status: number;
}>;

function readSafeString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

async function readOpenAiFailureDetails(
  response: Response,
): Promise<OpenAiFailureDetails> {
  const requestId = response.headers.get("x-request-id");
  const retryAfter = response.headers.get("retry-after");
  let payload: OpenAiErrorPayload | null = null;

  try {
    payload = (await response.json()) as OpenAiErrorPayload;
  } catch {
    payload = null;
  }

  const providerErrorCode = readSafeString(payload?.error?.code);
  const providerErrorParam = readSafeString(payload?.error?.param);
  const providerErrorType = readSafeString(payload?.error?.type);

  return {
    providerErrorCode,
    providerErrorParam,
    providerErrorType,
    requestId,
    retryAfter,
    safeCode: classifyOpenAiFailure({
      providerErrorCode,
      providerErrorType,
      status: response.status,
    }),
    status: response.status,
  };
}

function classifyOpenAiFailure(input: {
  providerErrorCode: string | null;
  providerErrorType: string | null;
  status: number;
}): AiProviderErrorCode {
  if (input.status === 401 || input.status === 403) {
    return AI_PROVIDER_ERROR_CODES.authFailed;
  }

  if (input.status === 429) {
    if (
      input.providerErrorCode === "insufficient_quota" ||
      input.providerErrorType === "insufficient_quota"
    ) {
      return AI_PROVIDER_ERROR_CODES.quotaExceeded;
    }

    return AI_PROVIDER_ERROR_CODES.rateLimited;
  }

  return AI_PROVIDER_ERROR_CODES.requestFailed;
}

function getModelAttempts(primaryModel: string): string[] {
  return [
    primaryModel,
    ...OPENAI_FALLBACK_MODELS.filter((model) => model !== primaryModel),
  ];
}

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
      const modelAttempts = getModelAttempts(input.model);

      for (const [attemptIndex, model] of modelAttempts.entries()) {
        const attempt = attemptIndex + 1;
        let response: Response;

        safeLogger.info("ai.openai.request_started", {
          attempt,
          inputChars: input.inputContext.length,
          instructionChars: input.instructions.length,
          maxOutputTokens: input.maxOutputTokens ?? DEFAULT_MAX_OUTPUT_TOKENS,
          model,
          schemaName: input.schema.name,
        });

        try {
          response = await fetch(OPENAI_RESPONSES_URL, {
            body: JSON.stringify({
              input: input.inputContext,
              instructions: input.instructions,
              max_output_tokens: input.maxOutputTokens ?? DEFAULT_MAX_OUTPUT_TOKENS,
              model,
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
            signal: AbortSignal.timeout(DEFAULT_REQUEST_TIMEOUT_MS),
          });
        } catch (cause) {
          safeLogger.warn("ai.openai.network_failed", {
            attempt,
            model,
          });

          throw new AiProviderError({
            cause,
            code: AI_PROVIDER_ERROR_CODES.requestFailed,
            message: "OpenAI request failed at network layer.",
            providerName: "openai",
          });
        }

        if (!response.ok) {
          const failureDetails = await readOpenAiFailureDetails(response);
          const retryWithNextModel =
            failureDetails.safeCode === AI_PROVIDER_ERROR_CODES.rateLimited &&
            attemptIndex < modelAttempts.length - 1;

          safeLogger.warn("ai.openai.request_failed", {
            attempt,
            model,
            providerErrorCode: failureDetails.providerErrorCode,
            providerErrorParam: failureDetails.providerErrorParam,
            providerErrorType: failureDetails.providerErrorType,
            requestId: failureDetails.requestId,
            retryAfter: failureDetails.retryAfter,
            retryWithNextModel,
            safeCode: failureDetails.safeCode,
            status: failureDetails.status,
          });

          if (retryWithNextModel) {
            continue;
          }

          throw new AiProviderError({
            code: failureDetails.safeCode,
            message: `OpenAI request failed with status ${response.status}.`,
            providerName: "openai",
          });
        }

        const requestId = response.headers.get("x-request-id");
        const payload = await response.json();
        const outputText = extractOpenAiResponseText(payload);

        safeLogger.info("ai.openai.response_received", {
          attempt,
          model,
          outputTextPresent: Boolean(outputText),
          requestId,
        });

        if (!outputText) {
          safeLogger.warn("ai.openai.empty_output", {
            attempt,
            model,
            requestId,
          });

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
          safeLogger.warn("ai.openai.invalid_json", {
            attempt,
            model,
            requestId,
          });

          throw new AiProviderError({
            cause,
            code: AI_PROVIDER_ERROR_CODES.invalidSchema,
            message: "OpenAI response was not valid JSON.",
            providerName: "openai",
          });
        }

        const validated = input.validate(parsed);

        if (validated === null) {
          safeLogger.warn("ai.openai.invalid_schema", {
            attempt,
            model,
            requestId,
          });

          throw new AiProviderError({
            code: AI_PROVIDER_ERROR_CODES.invalidSchema,
            message: "OpenAI response did not match the expected schema.",
            providerName: "openai",
          });
        }

        return {
          model,
          output: validated,
          outputText,
        };
      }

      throw new AiProviderError({
        code: AI_PROVIDER_ERROR_CODES.requestFailed,
        message: "OpenAI request failed after all model attempts.",
        providerName: "openai",
      });
    },
  };
}
