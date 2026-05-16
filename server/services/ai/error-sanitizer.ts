/**
 * ============================================================
 * File: server/services/ai/error-sanitizer.ts
 * Project: BizPilot AI
 * Description: Phase 15 sanitizer that turns raw AI errors into safe, enumerated labels.
 * Role: Prevents provider stack traces, API keys, or other sensitive strings from being
 *       written into ai_outputs.error_message or usage_events.metadata.
 * Related:
 * - server/services/ai/lead-conversion-assistant.service.ts
 * - server/providers/ai/ai-provider.ts
 * - docs/engineering/BIZPILOT_SAFE_LOGGING_BASELINE_v1.0.md
 * Author: MoOoH
 * Created: 2026-05-15
 * Last Updated: 2026-05-15
 * Change Log:
 * - 2026-05-15: Created the AI error-sanitizer module.
 * ============================================================
 */

import "server-only";

import {
  AI_PROVIDER_ERROR_CODES,
  AiProviderError,
  type AiProviderErrorCode,
} from "@/server/providers/ai/ai-provider";

export type SanitizedAiFailureReason =
  | "ai_provider_not_configured"
  | "ai_provider_request_failed"
  | "ai_provider_empty_output"
  | "ai_provider_invalid_schema"
  | "ai_lead_not_ready"
  | "ai_unknown_failure";

const SAFE_REASON_BY_CODE: Readonly<Record<AiProviderErrorCode, SanitizedAiFailureReason>> = {
  [AI_PROVIDER_ERROR_CODES.emptyOutput]: "ai_provider_empty_output",
  [AI_PROVIDER_ERROR_CODES.invalidSchema]: "ai_provider_invalid_schema",
  [AI_PROVIDER_ERROR_CODES.notConfigured]: "ai_provider_not_configured",
  [AI_PROVIDER_ERROR_CODES.requestFailed]: "ai_provider_request_failed",
};

/**
 * Returns a stable, low-cardinality reason label suitable for persistence.
 * Never returns the underlying error message or any provider details.
 */
export function sanitizeAiFailureReason(error: unknown): SanitizedAiFailureReason {
  if (error instanceof AiProviderError) {
    return SAFE_REASON_BY_CODE[error.code] ?? "ai_unknown_failure";
  }

  if (error instanceof Error) {
    if (error.message === "Lead is not ready for AI assistance yet.") {
      return "ai_lead_not_ready";
    }
  }

  return "ai_unknown_failure";
}
