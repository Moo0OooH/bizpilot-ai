/**
 * ============================================================
 * File: server/services/ai/ai-cost.ts
 * Project: BizPilot AI
 * Description: Estimates Phase 6 AI usage cost metadata.
 * Role: Keeps low-cost MVP usage visible from the first AI assistant workflow.
 * Related:
 * - server/services/ai/lead-conversion-assistant.service.ts
 * Author: MoOoH
 * Created: 2026-05-11
 * Last Updated: 2026-05-11
 * Change Log:
 * - 2026-05-11: Added conservative token and estimated cost helpers.
 * ============================================================
 */

const fallbackInputCostPerMillion = 0.15;
const fallbackOutputCostPerMillion = 0.6;

export function estimateTokens(value: string): number {
  return Math.ceil(value.length / 4);
}

export function estimateAiCost(input: {
  inputTokens: number;
  outputTokens: number;
}): number {
  const inputCost = (input.inputTokens / 1_000_000) * fallbackInputCostPerMillion;
  const outputCost =
    (input.outputTokens / 1_000_000) * fallbackOutputCostPerMillion;

  return Number((inputCost + outputCost).toFixed(6));
}
