/**
 * ============================================================
 * File: lib/public-events.ts
 * Project: BizPilot AI
 * Description: Typed no-op public event helper for approved future analytics hooks.
 * Role: Documents event names without sending personal data or installing analytics scripts.
 * Related:
 * - components/public/marketing-language-menu.tsx
 * - components/public/pilot-request-template-card.tsx
 * - components/ui/theme-preference-control.tsx
 * Author: MoOoH
 * Created: 2026-06-20
 * Last Updated: 2026-07-04
 * Change Log:
 * - 2026-07-04: Added no-PII event catalog and safe payload-key contract.
 * ============================================================
 */

export type PublicEventName =
  | "comparison_cta_click"
  | "demo_cta_click"
  | "external_reference_click"
  | "faq_item_open"
  | "founder_pilot_cta_click"
  | "locale_change"
  | "pilot_template_copy"
  | "pricing_cta_click"
  | "quote_link_guide_cta_click"
  | "service_use_case_click"
  | "theme_preference_change";

type PublicEventPayload = Readonly<Record<string, string | number | boolean>>;

type PublicEventDefinition = Readonly<{
  category: "content" | "conversion" | "preference" | "reference";
  description: string;
  safePayloadKeys: readonly string[];
}>;

export const publicEventCatalog = {
  comparison_cta_click: {
    category: "conversion",
    description: "User clicks from the comparison page toward demo or pilot intent.",
    safePayloadKeys: ["route", "cta", "language"],
  },
  demo_cta_click: {
    category: "conversion",
    description: "User clicks a public demo CTA.",
    safePayloadKeys: ["route", "cta", "language"],
  },
  external_reference_click: {
    category: "reference",
    description: "User opens an official external privacy/security reference.",
    safePayloadKeys: ["route", "reference", "language"],
  },
  faq_item_open: {
    category: "content",
    description: "User opens a public FAQ item.",
    safePayloadKeys: ["route", "topic", "language"],
  },
  founder_pilot_cta_click: {
    category: "conversion",
    description: "User clicks a founder-pilot application CTA.",
    safePayloadKeys: ["route", "cta", "language"],
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
  pricing_cta_click: {
    category: "conversion",
    description: "User clicks from pricing toward the pilot request flow.",
    safePayloadKeys: ["route", "plan", "language"],
  },
  quote_link_guide_cta_click: {
    category: "conversion",
    description: "User clicks from the quote-link placement guide toward pilot intent.",
    safePayloadKeys: ["route", "placement", "language"],
  },
  service_use_case_click: {
    category: "content",
    description: "User opens or selects a cleaning service use case.",
    safePayloadKeys: ["route", "service", "language"],
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
