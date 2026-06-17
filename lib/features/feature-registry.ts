/**
 * ============================================================
 * File: lib/features/feature-registry.ts
 * Project: BizPilot AI
 * Description: Central Settings-visible feature state registry.
 * Role: Keeps customer-visible capability states honest against readiness gates.
 * Related:
 * - app/(dashboard)/dashboard/settings/page.tsx
 * - docs/product/BIZPILOT_FEATURE_ENTITLEMENT_AND_GUIDE_STANDARD_v1.0.md
 * Author: MoOoH
 * Created: 2026-05-26
 * Last Updated: 2026-06-16
 * Change Log:
 * - 2026-06-16: Aligned AI, auth email, and backup states with Phase 23/24 readiness truth.
 * ============================================================
 */

export type FeatureCategory =
  | "admin"
  | "ai"
  | "billing"
  | "communication"
  | "data"
  | "intake"
  | "recovery"
  | "scheduling"
  | "settings";

export type FeatureLevel =
  | "admin"
  | "core"
  | "custom"
  | "founder"
  | "pilot"
  | "plus"
  | "premium";

export type FeatureState =
  | "blocked_external"
  | "enabled"
  | "owner_controlled"
  | "planned"
  | "setup_required";

export type FeatureGuideStatus = "draft" | "ready" | "required";

export type FeatureKey =
  | "ai_draft_assistant"
  | "backup_restore_posture"
  | "billing_payment_links"
  | "business_branding"
  | "custom_smtp_auth_email"
  | "fr_ca_language"
  | "founder_admin_controls"
  | "invoices_payments"
  | "customer_contact_list"
  | "lead_source_attribution_analytics"
  | "quote_link_intake"
  | "quote_recovery_queue"
  | "scheduling_booking"
  | "sms_whatsapp_messaging"
  | "team_members";

export type FeatureRegistryItem = Readonly<{
  category: FeatureCategory;
  guideStatus: FeatureGuideStatus;
  key: FeatureKey;
  level: FeatureLevel;
  ownerAuthority: "founder" | "owner" | "support";
  state: FeatureState;
}>;

export const featureRegistry = [
  {
    category: "recovery",
    guideStatus: "ready",
    key: "quote_recovery_queue",
    level: "core",
    ownerAuthority: "owner",
    state: "enabled",
  },
  {
    category: "intake",
    guideStatus: "ready",
    key: "quote_link_intake",
    level: "core",
    ownerAuthority: "owner",
    state: "enabled",
  },
  {
    category: "settings",
    guideStatus: "ready",
    key: "business_branding",
    level: "core",
    ownerAuthority: "owner",
    state: "enabled",
  },
  {
    category: "settings",
    guideStatus: "ready",
    key: "fr_ca_language",
    level: "core",
    ownerAuthority: "owner",
    state: "enabled",
  },
  {
    category: "ai",
    guideStatus: "required",
    key: "ai_draft_assistant",
    level: "pilot",
    ownerAuthority: "founder",
    state: "owner_controlled",
  },
  {
    category: "admin",
    guideStatus: "ready",
    key: "founder_admin_controls",
    level: "admin",
    ownerAuthority: "founder",
    state: "owner_controlled",
  },
  {
    category: "communication",
    guideStatus: "required",
    key: "custom_smtp_auth_email",
    level: "admin",
    ownerAuthority: "founder",
    state: "enabled",
  },
  {
    category: "data",
    guideStatus: "required",
    key: "backup_restore_posture",
    level: "admin",
    ownerAuthority: "founder",
    state: "owner_controlled",
  },
  {
    category: "billing",
    guideStatus: "required",
    key: "billing_payment_links",
    level: "pilot",
    ownerAuthority: "founder",
    state: "setup_required",
  },
  {
    category: "settings",
    guideStatus: "draft",
    key: "team_members",
    level: "plus",
    ownerAuthority: "founder",
    state: "planned",
  },
  {
    category: "scheduling",
    guideStatus: "draft",
    key: "scheduling_booking",
    level: "plus",
    ownerAuthority: "founder",
    state: "planned",
  },
  {
    category: "billing",
    guideStatus: "draft",
    key: "invoices_payments",
    level: "plus",
    ownerAuthority: "founder",
    state: "planned",
  },
  {
    category: "data",
    guideStatus: "required",
    key: "lead_source_attribution_analytics",
    level: "premium",
    ownerAuthority: "founder",
    state: "planned",
  },
  {
    category: "communication",
    guideStatus: "required",
    key: "customer_contact_list",
    level: "premium",
    ownerAuthority: "founder",
    state: "planned",
  },
  {
    category: "communication",
    guideStatus: "draft",
    key: "sms_whatsapp_messaging",
    level: "custom",
    ownerAuthority: "founder",
    state: "blocked_external",
  },
] as const satisfies readonly FeatureRegistryItem[];

export function getFeatureStateTone(
  state: FeatureState,
): "amber" | "blue" | "emerald" | "neutral" | "red" {
  if (state === "enabled") return "emerald";
  if (state === "owner_controlled") return "blue";
  if (state === "setup_required") return "amber";
  if (state === "blocked_external") return "red";
  return "neutral";
}
