/**
 * ============================================================
 * File: server/services/ai/prompt-registry.ts
 * Project: BizPilot AI
 * Description: Defines Phase 6 AI prompt registry entries.
 * Role: Keeps AI prompts versioned and outside UI components.
 * Related:
 * - server/services/ai/lead-conversion-assistant.service.ts
 * - docs/engineering/BIZPILOT_ENGINEERING_STANDARD_v1.4.md
 * Author: MoOoH
 * Created: 2026-05-11
 * Last Updated: 2026-05-13
 * Change Log:
 * - 2026-05-13: Enforced the server-only runtime boundary.
 * - 2026-05-11: Created first lead conversion assistant prompt entry.
 * ============================================================
 */

import "server-only";

export type PromptRegistryEntry = Readonly<{
  approvedModel: string;
  costNotes: string;
  failureFallback: string;
  inputContext: string;
  name: string;
  outputSchemaName: string;
  privacyNotes: string;
  purpose: string;
  version: string;
}>;

export const leadConversionBundlePrompt: PromptRegistryEntry = {
  approvedModel: "gpt-5.1",
  costNotes: "One on-demand bundle per lead; cache by input hash.",
  failureFallback: "Use rule-based reply and follow-up drafts.",
  inputContext: "Cleaning quote lead, rule-based quality score, missing info, and owner next action.",
  name: "lead_conversion_bundle",
  outputSchemaName: "lead_conversion_bundle_v1",
  privacyNotes: "Do not include customer contact fields in prompt text. Mask accidental emails and phone numbers.",
  purpose: "Prepare assistant-only lead summary, reply draft, follow-up draft, and next action guidance.",
  version: "2026-05-11.v1",
};

export const leadConversionBundleInstructions = `
You are BizPilot AI, an assistant for cleaning business owners.
Prepare owner-facing help for recovering one quote request.

Rules:
- Assistant-only. Never auto-send, book, negotiate, or guarantee revenue.
- Do not invent price, availability, discounts, or exact service scope.
- Keep drafts concise, practical, and ready for the owner to edit.
- Ask for missing quote details when needed.
- Use plain professional language for a local cleaning business.
- Return only JSON that matches the requested schema.
`.trim();
