/**
 * ============================================================
 * File: lib/i18n/route-messages.ts
 * Project: BizPilot AI
 * Description: Safe URL flash-message readers for public, auth, dashboard, and admin routes.
 * Role: Prevents raw query-string text, provider errors, or technical logs from becoming user-facing UI copy.
 * Related:
 * - lib/i18n/bizpilot-copy.ts
 * - app/auth/sign-in/page.tsx
 * - app/(public)/quote/[slug]/page.tsx
 * Author: MoOoH
 * Created: 2026-06-27
 * ============================================================
 */

import type { BizPilotCopy } from "./bizpilot-copy";

type AuthRouteMessages = BizPilotCopy["auth"]["routeMessages"];

const technicalMessagePattern =
  /(<|>|{|}|\[|\]|`|database|exception|jwt|postgres|provider|rls|schema cache|secret|service-role|stack|supabase|token)/i;

const authErrorMessageKeys = new Map<RegExp, keyof AuthRouteMessages>([
  [/^An account with this email already exists\. Sign in instead\.$/, "accountExists"],
  [/^Confirm your email before signing in\.$/, "confirmEmail"],
  [/^Email or password is incorrect\.$/, "passwordIncorrect"],
  [/^Enter a valid email address\.$/, "emailInvalid"],
  [/^Enter your business name\.$/, "businessRequired"],
  [/^Enter your email address\.$/, "emailRequired"],
  [/^Enter your name\.$/, "nameRequired"],
  [/^Enter your new password\.$/, "newPasswordRequired"],
  [/^Enter your password\.$/, "passwordRequired"],
  [/^Passwords do not match\.$/, "passwordMismatch"],
  [/^Reload the (reset|sign-up) page and try again\.$/, "reload"],
  [/^This confirmation link is invalid or expired\. Sign in or create a new account\.$/, "resetInvalid"],
  [/^This reset link is invalid or expired\. Request a new password reset\.$/, "resetInvalid"],
  [/^Too many (account creation|reset|sign-in) (attempts|requests)\. Please wait (a moment|a few minutes) and try again\.$/, "rateLimit"],
  [/^Use a stronger new password with at least 8 characters\.$/, "strongPassword"],
  [/^Use at least 8 characters for your password\.$/, "strongPassword"],
  [/^We couldn't create your account\. Please try again\.$/, "signUpFailed"],
  [/^We couldn't send the confirmation email\. Please wait a few minutes and try again\.$/, "emailDelivery"],
  [/^We couldn't sign you in\. Please try again\.$/, "signInFailed"],
  [/^You can't reuse your previous password\. Choose a new password you have not used for this account\.$/, "passwordReuse"],
]);

const authNoticeMessageKeys = new Map<RegExp, keyof AuthRouteMessages>([
  [/^Email confirmed\. Please sign in to continue\.$/, "checkEmail"],
  [/^Email confirmed\. Your workspace is ready\.$/, "emailConfirmed"],
  [/^If an account exists, we'll send reset instructions\.$/, "resetInstructions"],
  [/^Password updated\. Sign in with your new password\.$/, "passwordUpdated"],
]);

function readMappedAuthRouteMessage(
  value: string | undefined,
  messages: AuthRouteMessages,
  map: ReadonlyMap<RegExp, keyof AuthRouteMessages>,
  fallbackKey: keyof AuthRouteMessages,
): string | null {
  const normalized = value?.trim().replace(/\s+/g, " ");

  if (!normalized) {
    return null;
  }

  for (const [pattern, key] of map) {
    if (pattern.test(normalized)) {
      return messages[key];
    }
  }

  return messages[fallbackKey];
}

export function readSafeAuthRouteError(
  value: string | undefined,
  messages: AuthRouteMessages,
): string | null {
  return readMappedAuthRouteMessage(
    value,
    messages,
    authErrorMessageKeys,
    "genericError",
  );
}

export function readSafeAuthRouteNotice(
  value: string | undefined,
  messages: AuthRouteMessages,
): string | null {
  return readMappedAuthRouteMessage(
    value,
    messages,
    authNoticeMessageKeys,
    "genericNotice",
  );
}

export function readSafeRouteFlashMessage(
  value: string | undefined,
  fallback: string,
): string | null {
  const normalized = value?.trim().replace(/\s+/g, " ");

  if (!normalized) {
    return null;
  }

  if (normalized.length > 180 || technicalMessagePattern.test(normalized)) {
    return fallback;
  }

  return normalized;
}
