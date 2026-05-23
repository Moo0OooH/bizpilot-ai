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
