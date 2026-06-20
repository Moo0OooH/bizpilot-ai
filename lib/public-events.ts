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
 * ============================================================
 */

export type PublicEventName =
  | "demo_cta_click"
  | "external_reference_click"
  | "founder_pilot_cta_click"
  | "locale_change"
  | "pilot_template_copy"
  | "pricing_cta_click"
  | "service_use_case_click"
  | "theme_preference_change";

type PublicEventPayload = Readonly<Record<string, string | number | boolean>>;

export function trackPublicEvent(
  _eventName: PublicEventName,
  _payload: PublicEventPayload = {},
): void {
  void _eventName;
  void _payload;

  // Intentional no-op until an approved first-party analytics sink exists.
}
