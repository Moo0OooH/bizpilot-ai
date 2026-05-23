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
 * - 2026-05-04: Awaited official Supabase SSR dashboard guard.
 * ============================================================
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  copyAuthCallbackParams,
  getRootAuthCallbackTargetPath,
  hasRootAuthCallbackParams,
} from "@/lib/auth/auth-callback-routing";
import { protectDashboardRequest } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  if (
    request.nextUrl.pathname === "/" &&
    hasRootAuthCallbackParams(request.nextUrl)
  ) {
    const callbackUrl = new URL(
      getRootAuthCallbackTargetPath(request.nextUrl),
      request.url,
    );

    copyAuthCallbackParams(request.nextUrl, callbackUrl);

    return NextResponse.redirect(callbackUrl);
  }

  if (request.nextUrl.pathname === "/") {
    return NextResponse.next();
  }

  return protectDashboardRequest(request);
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
