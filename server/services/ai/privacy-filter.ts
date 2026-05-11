/**
 * ============================================================
 * File: server/services/ai/privacy-filter.ts
 * Project: BizPilot AI
 * Description: Provides Phase 6 prompt privacy filtering.
 * Role: Masks direct customer contact details before AI prompts are assembled.
 * Related:
 * - server/services/ai/lead-conversion-assistant.service.ts
 * Author: MoOoH
 * Created: 2026-05-11
 * Last Updated: 2026-05-11
 * Change Log:
 * - 2026-05-11: Created basic email and phone masking for AI prompt inputs.
 * ============================================================
 */

const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const phonePattern =
  /(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}/g;

export function maskAiPromptText(value: string): string {
  return value
    .replaceAll(emailPattern, "[email masked]")
    .replaceAll(phonePattern, "[phone masked]");
}

export function maskAiPromptValue(value: unknown): unknown {
  if (typeof value === "string") {
    return maskAiPromptText(value);
  }

  if (Array.isArray(value)) {
    return value.map(maskAiPromptValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, maskAiPromptValue(entry)]),
    );
  }

  return value;
}
