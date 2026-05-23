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
  getAuthCallbackKind,
  getAuthCallbackFailureRedirect,
  getSafeAuthCallbackNextPath,
  isRecoveryAuthCallback,
} from "@/lib/auth/auth-callback-routing";
import { safeLogger } from "@/server/logging/safe-logger";
import { exchangeAuthCodeForSession } from "@/server/services/auth.service";

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

function readErrorField(error: unknown, key: string): string | number | undefined {
  if (!error || typeof error !== "object" || !(key in error)) {
    return undefined;
  }

  const value = (error as Record<string, unknown>)[key];
  return typeof value === "string" || typeof value === "number"
    ? value
    : undefined;
}

function getExchangeErrorKind(error: unknown): string {
  const rawMessage =
    error instanceof Error
      ? error.message
      : (readErrorField(error, "message") ?? "");
  const message = String(rawMessage).toLowerCase();

  if (message.includes("code verifier") || message.includes("pkce")) {
    return "pkce_session_exchange";
  }

  if (
    message.includes("expired") ||
    message.includes("invalid") ||
    message.includes("otp")
  ) {
    return "invalid_or_expired_code";
  }

  return "unknown";
}

function getExchangeErrorMetadata(
  error: unknown,
): Record<string, string | number> {
  const errorName =
    error instanceof Error
      ? error.name
      : (readErrorField(error, "name") ?? "unknown");
  const errorStatus =
    readErrorField(error, "status") ??
    readErrorField(error, "statusCode") ??
    readErrorField(error, "code") ??
    "unknown";

  return {
    errorKind: getExchangeErrorKind(error),
    errorName: String(errorName),
    errorStatus,
  };
}

export async function GET(request: NextRequest) {
  const callbackKind = getAuthCallbackKind(request.nextUrl);

  if (isRecoveryAuthCallback(request.nextUrl)) {
    const resetUrl = new URL("/auth/reset-password", request.url);

    copyAuthCallbackParams(request.nextUrl, resetUrl);

    return NextResponse.redirect(resetUrl);
  }

  if (hasCallbackError(request)) {
    safeLogger.warn("auth.callback.provider_error", {
      callbackKind,
      failureStage: "provider_error",
      hasCode: request.nextUrl.searchParams.has("code"),
      hasErrorCode: request.nextUrl.searchParams.has("error_code"),
      hasErrorDescription: request.nextUrl.searchParams.has("error_description"),
      hasNext: request.nextUrl.searchParams.has("next"),
      hasType: request.nextUrl.searchParams.has("type"),
    });
    const redirect = getAuthCallbackFailureRedirect({
      callbackKind,
      failureStage: "provider_error",
    });

    return NextResponse.redirect(
      buildSignInUrl(request, redirect.key, redirect.message),
    );
  }

  const code = request.nextUrl.searchParams.get("code")?.trim();

  if (!code) {
    safeLogger.warn("auth.callback.missing_code", {
      callbackKind,
      failureStage: "missing_code",
      hasErrorCode: false,
      hasNext: request.nextUrl.searchParams.has("next"),
      hasType: request.nextUrl.searchParams.has("type"),
    });
    const redirect = getAuthCallbackFailureRedirect({
      callbackKind,
      failureStage: "missing_code",
    });

    return NextResponse.redirect(
      buildSignInUrl(request, redirect.key, redirect.message),
    );
  }

  try {
    await exchangeAuthCodeForSession(code);
  } catch (error) {
    safeLogger.warn("auth.callback.exchange_failed", {
      callbackKind,
      failureStage: "exchange_failed",
      hasNext: request.nextUrl.searchParams.has("next"),
      hasType: request.nextUrl.searchParams.has("type"),
      ...getExchangeErrorMetadata(error),
    });
    const redirect = getAuthCallbackFailureRedirect({
      callbackKind,
      failureStage: "exchange_failed",
    });

    return NextResponse.redirect(
      buildSignInUrl(request, redirect.key, redirect.message),
    );
  }

  const redirectUrl = new URL(
    getSafeAuthCallbackNextPath(request.nextUrl.searchParams.get("next")),
    request.url,
  );
  redirectUrl.searchParams.set("notice", AUTH_CALLBACK_NOTICE);

  return NextResponse.redirect(redirectUrl);
}
