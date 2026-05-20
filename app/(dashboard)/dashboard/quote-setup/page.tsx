/**
 * ============================================================
 * File: app/(dashboard)/dashboard/quote-setup/page.tsx
 * Project: BizPilot AI
 * Description: Provides the canonical Quote Setup route alias.
 * Role: Keeps the product wording aligned with the dashboard navigation while preserving the existing configuration implementation.
 * Related:
 * - app/(dashboard)/dashboard/configuration/page.tsx
 * Author: MoOoH
 * Created: 2026-05-18
 * Last Updated: 2026-05-18
 * Change Log:
 * - 2026-05-18: Added Phase 18A route alias for Quote Setup.
 * ============================================================
 */

import { redirect } from "next/navigation";

export default function QuoteSetupAliasPage() {
  redirect("/dashboard/configuration");
}
