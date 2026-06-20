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
import {
  INTERFACE_LANGUAGE_COOKIE,
  isSupportedLanguage,
} from "@/lib/i18n/language";
import { protectDashboardRequest } from "@/lib/supabase/middleware";

const interfaceLanguageMaxAge = 60 * 60 * 24 * 365;

function appendRequestCookie(
  cookieHeader: string | null,
  name: string,
  value: string,
): string {
  const serialized = `${name}=${encodeURIComponent(value)}`;

  if (!cookieHeader) {
    return serialized;
  }

  const keptCookies = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .filter((cookie) => !cookie.startsWith(`${name}=`));

  return [...keptCookies, serialized].join("; ");
}

function publicLanguageResponse(request: NextRequest): NextResponse {
  const language = request.nextUrl.searchParams.get("language");

  if (!isSupportedLanguage(language)) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(
    "cookie",
    appendRequestCookie(
      request.headers.get("cookie"),
      INTERFACE_LANGUAGE_COOKIE,
      language,
    ),
  );

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.cookies.set(INTERFACE_LANGUAGE_COOKIE, language, {
    maxAge: interfaceLanguageMaxAge,
    path: "/",
    sameSite: "lax",
  });

  return response;
}

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

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    return protectDashboardRequest(request);
  }

  return publicLanguageResponse(request);
}

export const config = {
  matcher: [
    "/",
    "/features",
    "/industries/cleaning",
    "/trust",
    "/demo",
    "/pricing",
    "/pilot",
    "/content-studio",
    "/privacy",
    "/security",
    "/terms",
    "/quote/:path*",
    "/dashboard/:path*",
  ],
};
