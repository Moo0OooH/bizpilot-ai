/**
 * ============================================================
 * File: lib/auth/auth-callback-routing.ts
 * Project: BizPilot AI
 * Description: Pure helpers for Supabase Auth callback routing.
 * Role: Keeps signup confirmation and password recovery callback decisions
 * explicit and testable.
 * Related:
 * - proxy.ts
 * - app/auth/callback/route.ts
 * Author: MoOoH
 * Created: 2026-05-23
 * ============================================================
 */

export const AUTH_CALLBACK_KEYS = [
  "code",
  "error",
  "error_code",
  "error_description",
  "next",
  "type",
] as const;

export type AuthCallbackKind = "email_confirmation" | "recovery" | "signup";
export type AuthCallbackFailureStage =
  | "exchange_failed"
  | "missing_code"
  | "provider_error";

export const AUTH_CALLBACK_INVALID_ERROR =
  "This confirmation link is invalid or expired. Sign in or create a new account.";
export const AUTH_CALLBACK_EXCHANGE_NOTICE =
  "Email confirmed. Please sign in to continue.";

export function copyAuthCallbackParams(source: URL, target: URL): void {
  for (const key of AUTH_CALLBACK_KEYS) {
    const value = source.searchParams.get(key);

    if (value) {
      target.searchParams.set(key, value);
    }
  }
}

export function hasRootAuthCallbackParams(url: URL): boolean {
  return (
    url.searchParams.has("code") ||
    url.searchParams.has("error") ||
    url.searchParams.has("error_code")
  );
}

export function isRecoveryAuthCallback(url: URL): boolean {
  return url.searchParams.get("type") === "recovery";
}

export function getAuthCallbackKind(url: URL): AuthCallbackKind {
  if (isRecoveryAuthCallback(url)) {
    return "recovery";
  }

  return url.searchParams.get("type") === "signup"
    ? "signup"
    : "email_confirmation";
}

export function getRootAuthCallbackTargetPath(
  url: URL,
): "/auth/callback" | "/auth/reset-password" {
  return isRecoveryAuthCallback(url) ? "/auth/reset-password" : "/auth/callback";
}

export function getSafeAuthCallbackNextPath(value: string | null): string {
  if (!value?.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value === "/dashboard" || value.startsWith("/dashboard/")
    ? value
    : "/dashboard";
}

export function getAuthCallbackFailureRedirect(input: {
  callbackKind: AuthCallbackKind;
  failureStage: AuthCallbackFailureStage;
}): { key: "error" | "notice"; message: string } {
  if (
    input.callbackKind !== "recovery" &&
    input.failureStage !== "missing_code"
  ) {
    return {
      key: "notice",
      message: AUTH_CALLBACK_EXCHANGE_NOTICE,
    };
  }

  return {
    key: "error",
    message: AUTH_CALLBACK_INVALID_ERROR,
  };
}
