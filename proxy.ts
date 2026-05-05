/**
 * ============================================================
 * File: proxy.ts
 * Project: BizPilot AI
 * Description: Defines the Next.js request proxy for protected Phase 2 routes.
 * Role: Routes dashboard requests through the Supabase session guard.
 * Related:
 * - lib/supabase/middleware.ts
 * - app/(dashboard)/dashboard/page.tsx
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-04
 * Change Log:
 * - 2026-05-04: Created Phase 2 dashboard proxy guard.
 * ============================================================
 */

import type { NextRequest } from "next/server";

import { protectDashboardRequest } from "@/lib/supabase/middleware";

export function proxy(request: NextRequest) {
  return protectDashboardRequest(request);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
