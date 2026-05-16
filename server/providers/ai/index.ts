/**
 * ============================================================
 * File: server/providers/ai/index.ts
 * Project: BizPilot AI
 * Description: Phase 15 AI provider factory.
 * Role: Returns the env-backed default AIProvider for the assistant service.
 *       Other providers can be added here without touching the service layer.
 * Related:
 * - server/providers/ai/ai-provider.ts
 * - server/providers/ai/openai-provider.ts
 * - lib/env/server-env.ts
 * - server/services/ai/lead-conversion-assistant.service.ts
 * Author: MoOoH
 * Created: 2026-05-15
 * Last Updated: 2026-05-15
 * Change Log:
 * - 2026-05-15: Created default-provider factory.
 * ============================================================
 */

import "server-only";

import { getServerEnv } from "@/lib/env/server-env";
import {
  AI_PROVIDER_ERROR_CODES,
  AiProviderError,
  type AIProvider,
} from "@/server/providers/ai/ai-provider";
import { createOpenAiProvider } from "@/server/providers/ai/openai-provider";

export { AI_PROVIDER_ERROR_CODES, AiProviderError } from "@/server/providers/ai/ai-provider";
export type {
  AIProvider,
  AiProviderErrorCode,
  AiProviderName,
  GenerateStructuredBundleInput,
  GenerateStructuredBundleOutput,
  StructuredBundleSchema,
} from "@/server/providers/ai/ai-provider";

/**
 * Returns the active AIProvider derived from server-only env. When no provider
 * is configured, returns null so callers can degrade to the rule-based fallback
 * instead of failing the user's request.
 */
export function getDefaultAiProvider(): AIProvider | null {
  const env = getServerEnv();

  if (env.OPENAI_API_KEY) {
    return createOpenAiProvider({ apiKey: env.OPENAI_API_KEY });
  }

  return null;
}

/**
 * Same as getDefaultAiProvider but throws an AiProviderError when no provider
 * is configured. Use only in code paths that cannot meaningfully fall back.
 */
export function requireDefaultAiProvider(): AIProvider {
  const provider = getDefaultAiProvider();

  if (!provider) {
    throw new AiProviderError({
      code: AI_PROVIDER_ERROR_CODES.notConfigured,
      message: "No AI provider is configured.",
      providerName: "openai",
    });
  }

  return provider;
}
