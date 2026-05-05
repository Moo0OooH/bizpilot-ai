/**
 * ============================================================
 * File: lib/supabase/middleware.ts
 * Project: BizPilot AI
 * Description: Provides Phase 2 request protection for authenticated route groups.
 * Role: Keeps route-level session checks separate from secure server-side data checks.
 * Related:
 * - proxy.ts
 * - lib/supabase/session.ts
 * - app/(dashboard)/dashboard/page.tsx
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-04
 * Change Log:
 * - 2026-05-04: Created Phase 2 dashboard route guard helper.
 * ============================================================
 */

import { NextResponse, type NextRequest } from "next/server";

import { supabaseSessionCookieName } from "@/lib/supabase/session";

export function protectDashboardRequest(request: NextRequest): NextResponse {
  const sessionCookie = request.cookies.get(supabaseSessionCookieName);

  if (!sessionCookie?.value) {
    const signInUrl = new URL("/auth/sign-in", request.url);
    signInUrl.searchParams.set("next", request.nextUrl.pathname);

    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}
