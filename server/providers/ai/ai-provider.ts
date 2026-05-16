/**
 * ============================================================
 * File: server/providers/ai/ai-provider.ts
 * Project: BizPilot AI
 * Description: Phase 15 AI provider boundary interface for assistant workflows.
 * Role: Defines the AIProvider contract so concrete providers (OpenAI today, others later)
 *       can be swapped without touching the lead conversion assistant service.
 * Related:
 * - server/providers/ai/openai-provider.ts
 * - server/providers/ai/index.ts
 * - server/services/ai/lead-conversion-assistant.service.ts
 * - docs/architecture/BIZPILOT_VENDOR_INDEPENDENCE_AND_PORTABILITY_STANDARD_v1.0.md (Section 12.1)
 * Author: MoOoH
 * Created: 2026-05-15
 * Last Updated: 2026-05-15
 * Change Log:
 * - 2026-05-15: Created AIProvider interface and shared types.
 * ============================================================
 */

import "server-only";

export type AiProviderName = "openai" | "anthropic" | "google" | "local";

export type StructuredBundleSchema = Readonly<{
  definition: unknown;
  name: string;
}>;

export type GenerateStructuredBundleInput<T> = Readonly<{
  inputContext: string;
  instructions: string;
  maxOutputTokens?: number;
  model: string;
  schema: StructuredBundleSchema;
  validate: (parsed: unknown) => T | null;
}>;

export type GenerateStructuredBundleOutput<T> = Readonly<{
  output: T;
  outputText: string;
}>;

export interface AIProvider {
  readonly providerName: AiProviderName;
  generateStructuredBundle<T>(
    input: GenerateStructuredBundleInput<T>,
  ): Promise<GenerateStructuredBundleOutput<T>>;
}

/**
 * Domain-stable error codes that any AIProvider implementation may throw.
 * The lead conversion assistant maps these to safe persisted metadata.
 */
export const AI_PROVIDER_ERROR_CODES = {
  emptyOutput: "ai_provider_empty_output",
  invalidSchema: "ai_provider_invalid_schema",
  notConfigured: "ai_provider_not_configured",
  requestFailed: "ai_provider_request_failed",
} as const;

export type AiProviderErrorCode =
  (typeof AI_PROVIDER_ERROR_CODES)[keyof typeof AI_PROVIDER_ERROR_CODES];

export class AiProviderError extends Error {
  readonly code: AiProviderErrorCode;
  readonly providerName: AiProviderName;

  constructor(input: {
    cause?: unknown;
    code: AiProviderErrorCode;
    message: string;
    providerName: AiProviderName;
  }) {
    super(input.message, { cause: input.cause });
    this.code = input.code;
    this.name = "AiProviderError";
    this.providerName = input.providerName;
  }
}
