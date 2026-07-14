/**
 * ============================================================
 * File: lib/public-events.ts
 * Project: BizPilot AI
 * Description: Typed no-op public event helper for approved future analytics hooks.
 * Role: Documents event names without sending personal data or installing analytics scripts.
 * Related:
 * - components/public/marketing-language-menu.tsx
 * - components/public/public-v3-pilot-request.tsx
 * - components/ui/theme-preference-control.tsx
 * Author: MoOoH
 * Created: 2026-06-20
 * Last Updated: 2026-07-13
 * Change Log:
 * - 2026-07-13: Removed analytics names owned by routes and interactions retired in the V3 consolidation.
 * - 2026-07-04: Added no-PII event catalog and safe payload-key contract.
 * ============================================================
 */

export type PublicEventName =
  | "external_reference_click"
  | "locale_change"
  | "pilot_template_copy"
  | "theme_preference_change";

type PublicEventPayload = Readonly<Record<string, string | number | boolean>>;

type PublicEventDefinition = Readonly<{
  category: "content" | "conversion" | "preference" | "reference";
  description: string;
  safePayloadKeys: readonly string[];
}>;

export const publicEventCatalog = {
  external_reference_click: {
    category: "reference",
    description: "User opens an official external privacy/security reference.",
    safePayloadKeys: ["route", "reference", "language"],
  },
  locale_change: {
    category: "preference",
    description: "User changes the public-site language.",
    safePayloadKeys: ["route", "from", "to"],
  },
  pilot_template_copy: {
    category: "conversion",
    description: "User copies or selects the no-endpoint pilot request template.",
    safePayloadKeys: ["route", "method", "language"],
  },
  theme_preference_change: {
    category: "preference",
    description: "User changes the public theme preference.",
    safePayloadKeys: ["route", "from", "to"],
  },
} as const satisfies Record<PublicEventName, PublicEventDefinition>;

export const forbiddenPublicEventPayloadKeys = [
  "email",
  "phone",
  "name",
  "address",
  "message",
  "quoteDetails",
  "prompt",
  "aiOutput",
  "customerId",
  "leadId",
] as const;

export function trackPublicEvent(
  _eventName: PublicEventName,
  _payload: PublicEventPayload = {},
): void {
  void _eventName;
  void _payload;

  // Intentional no-op until an approved first-party analytics sink exists.
}
