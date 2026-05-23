/**
 * ============================================================
 * File: app/auth/callback/route.ts
 * Project: BizPilot AI
 * Description: Handles non-recovery Supabase Auth callbacks.
 * Role: Exchanges signup/email-confirm auth codes without treating them as
 * password reset links.
 * Related:
 * - proxy.ts
 * - server/services/auth.service.ts
 * - app/auth/reset-password/page.tsx
 * Author: MoOoH
 * Created: 2026-05-23
 * ============================================================
 */

import { NextResponse, type NextRequest } from "next/server";

import {
  copyAuthCallbackParams,
  getSafeAuthCallbackNextPath,
  isRecoveryAuthCallback,
} from "@/lib/auth/auth-callback-routing";
import { exchangeAuthCodeForSession } from "@/server/services/auth.service";

const AUTH_CALLBACK_ERROR =
  "This confirmation link is invalid or expired. Sign in or create a new account.";
const AUTH_CALLBACK_NOTICE = "Email confirmed. Your workspace is ready.";

function buildSignInUrl(
  request: NextRequest,
  key: "error" | "notice",
  value: string,
): URL {
  const url = new URL("/auth/sign-in", request.url);
  url.searchParams.set(key, value);

  return url;
}

function hasCallbackError(request: NextRequest): boolean {
  return (
    request.nextUrl.searchParams.has("error") ||
    request.nextUrl.searchParams.has("error_code")
  );
}

export async function GET(request: NextRequest) {
  if (isRecoveryAuthCallback(request.nextUrl)) {
    const resetUrl = new URL("/auth/reset-password", request.url);

    copyAuthCallbackParams(request.nextUrl, resetUrl);

    return NextResponse.redirect(resetUrl);
  }

  if (hasCallbackError(request)) {
    return NextResponse.redirect(
      buildSignInUrl(request, "error", AUTH_CALLBACK_ERROR),
    );
  }

  const code = request.nextUrl.searchParams.get("code")?.trim();

  if (!code) {
    return NextResponse.redirect(
      buildSignInUrl(request, "error", AUTH_CALLBACK_ERROR),
    );
  }

  try {
    await exchangeAuthCodeForSession(code);
  } catch {
    return NextResponse.redirect(
      buildSignInUrl(request, "error", AUTH_CALLBACK_ERROR),
    );
  }

  const redirectUrl = new URL(
    getSafeAuthCallbackNextPath(request.nextUrl.searchParams.get("next")),
    request.url,
  );
  redirectUrl.searchParams.set("notice", AUTH_CALLBACK_NOTICE);

  return NextResponse.redirect(redirectUrl);
}
