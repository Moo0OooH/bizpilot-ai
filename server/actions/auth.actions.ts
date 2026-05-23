/**
 * ============================================================
 * File: server/actions/auth.actions.ts
 * Project: BizPilot AI
 * Description: Provides Phase 2 authentication server actions.
 * Role: Connects auth forms to Supabase Auth and tenant setup services.
 * Related:
 * - app/auth/sign-in/page.tsx
 * - app/auth/sign-up/page.tsx
 * - server/services/auth.service.ts
 * - server/services/business.service.ts
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-12
 * Change Log:
 * - 2026-05-04: Created Phase 2 auth server actions.
 * - 2026-05-04: Kept Next.js redirects outside sign-up error handling.
 * - 2026-05-04: Added service-role tenant setup fallback for confirmed-email flows.
 * - 2026-05-04: Removed manual access-token handling after Supabase SDK migration.
 * - 2026-05-04: Use service-role tenant bootstrap after sign-up to avoid cookie timing gaps.
 * - 2026-05-11: Added user-facing sign-in validation and auth error copy.
 * - 2026-05-12: Added user-facing sign-up validation and auth error copy.
 * ============================================================
 */

"use server";

import { redirect } from "next/navigation";

import { getPublicEnv } from "@/lib/env/public-env";
import {
  sendPasswordResetEmail,
  signInWithPassword,
  signOut,
  signUpWithPassword,
  updatePasswordFromReset,
} from "@/server/services/auth.service";
import { createFoundingBusiness } from "@/server/services/business.service";

const PASSWORD_RESET_NOTICE =
  "If an account exists, we'll send reset instructions.";
const PASSWORD_RESET_RATE_LIMIT_MESSAGE =
  "Too many reset requests. Please wait a few minutes and try again.";
const PASSWORD_REUSE_MESSAGE =
  "You can't reuse your previous password. Choose a new password you have not used for this account.";
const SIGN_UP_CHECK_EMAIL_NOTICE =
  "Check your email to confirm your account. If this email is already registered, sign in instead.";
const SIGN_UP_EMAIL_RATE_LIMIT_MESSAGE =
  "Too many account creation attempts. Please wait a few minutes and try again.";
const SIGN_UP_EMAIL_DELIVERY_MESSAGE =
  "We couldn't send the confirmation email. Please wait a few minutes and try again.";
const AUTH_INTENT_SIGN_UP = "sign-up";
const AUTH_INTENT_PASSWORD_RESET = "password-reset";

function redirectWithSignInError(message: string): never {
  redirect(`/auth/sign-in?error=${encodeURIComponent(message)}`);
}

function redirectWithSignUpError(message: string): never {
  redirect(`/auth/sign-up?error=${encodeURIComponent(message)}`);
}

function redirectWithCheckEmailNotice(message: string): never {
  redirect(`/auth/check-email?notice=${encodeURIComponent(message)}`);
}

function redirectWithForgotPasswordError(message: string): never {
  redirect(`/auth/forgot-password?error=${encodeURIComponent(message)}`);
}

function redirectWithResetPasswordError(message: string, code?: string): never {
  const searchParams = new URLSearchParams({ error: message });

  if (code) {
    searchParams.set("code", code);
  }

  redirect(`/auth/reset-password?${searchParams.toString()}`);
}

function readSignInEmail(formData: FormData): string {
  const value = formData.get("email");

  if (typeof value !== "string" || value.trim().length === 0) {
    redirectWithSignInError("Enter your email address.");
  }

  const email = value.trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirectWithSignInError("Enter a valid email address.");
  }

  return email;
}

function readAuthIntent(formData: FormData): string | undefined {
  const value = formData.get("authIntent");
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}

function assertSignUpFormIntent(formData: FormData): void {
  const intent = readAuthIntent(formData);
  if (intent && intent !== AUTH_INTENT_SIGN_UP) {
    redirectWithSignUpError("Reload the sign-up page and try again.");
  }
}

function assertPasswordResetFormIntent(formData: FormData): void {
  const intent = readAuthIntent(formData);
  const hasSignUpOnlyFields =
    formData.has("displayName") || formData.has("businessName");

  if (intent === AUTH_INTENT_SIGN_UP || hasSignUpOnlyFields) {
    console.warn("[auth:password-reset] blocked sign-up payload");
    redirectWithSignUpError("Reload the sign-up page and try again.");
  }

  if (intent && intent !== AUTH_INTENT_PASSWORD_RESET) {
    redirectWithForgotPasswordError("Reload the reset page and try again.");
  }
}

function getConfiguredPasswordResetRedirectTo(): string {
  return new URL(
    "/auth/reset-password",
    getPublicEnv().NEXT_PUBLIC_APP_URL,
  ).toString();
}

function getConfiguredAuthCallbackRedirectTo(): string {
  return new URL(
    "/auth/callback",
    getPublicEnv().NEXT_PUBLIC_APP_URL,
  ).toString();
}

function getEmailDomain(email: string): string {
  return email.split("@").at(1)?.toLowerCase() ?? "unknown";
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

function getSupabaseErrorDiagnostics(error: unknown): {
  message: string;
  name?: string;
  status?: string | number;
} {
  const message =
    error instanceof Error
      ? error.message
      : (readErrorField(error, "message") ?? "Unknown Supabase Auth error");
  const name =
    error instanceof Error
      ? error.name
      : readErrorField(error, "name");
  const status =
    readErrorField(error, "status") ??
    readErrorField(error, "statusCode") ??
    readErrorField(error, "code");

  return {
    message: String(message),
    ...(name ? { name: String(name) } : {}),
    ...(status ? { status } : {}),
  };
}

function isRedirectConfigurationError(error: unknown): boolean {
  const { message, name, status } = getSupabaseErrorDiagnostics(error);
  const details = `${message} ${name ?? ""} ${status ?? ""}`.toLowerCase();
  const providerErrorHints = [
    "rate limit",
    "too many",
    "security purposes",
    "smtp",
    "provider",
    "email rate",
    "email not sent",
  ];
  const redirectErrorHints = [
    "redirect",
    "redirect_to",
    "uri",
    "url",
    "allow",
    "allowed",
    "not allowed",
  ];

  return (
    !providerErrorHints.some((hint) => details.includes(hint)) &&
    redirectErrorHints.some((hint) => details.includes(hint))
  );
}

function isPasswordResetRateLimitError(error: unknown): boolean {
  const { message, name, status } = getSupabaseErrorDiagnostics(error);
  const details = `${message} ${name ?? ""} ${status ?? ""}`.toLowerCase();

  return (
    status === 429 ||
    details.includes("rate limit") ||
    details.includes("too many") ||
    details.includes("security purposes")
  );
}

function isPasswordReuseError(error: unknown): boolean {
  const { message, name, status } = getSupabaseErrorDiagnostics(error);
  const details = `${message} ${name ?? ""} ${status ?? ""}`.toLowerCase();

  return (
    details.includes("same password") ||
    details.includes("same as") ||
    details.includes("cannot be the same") ||
    details.includes("must be different") ||
    details.includes("should be different") ||
    details.includes("different from the old")
  );
}

function isPasswordValidationError(error: unknown): boolean {
  const { message, name, status } = getSupabaseErrorDiagnostics(error);
  const details = `${message} ${name ?? ""} ${status ?? ""}`.toLowerCase();

  return (
    status === 422 ||
    details.includes("password") ||
    details.includes("weak")
  );
}

function isEmailRateLimitError(error: unknown): boolean {
  const { message, name, status } = getSupabaseErrorDiagnostics(error);
  const details = `${message} ${name ?? ""} ${status ?? ""}`.toLowerCase();

  return (
    status === 429 ||
    details.includes("rate limit") ||
    details.includes("too many") ||
    details.includes("security purposes") ||
    details.includes("over email send rate limit") ||
    details.includes("email rate limit")
  );
}

function isEmailDeliveryError(error: unknown): boolean {
  const { message, name, status } = getSupabaseErrorDiagnostics(error);
  const details = `${message} ${name ?? ""} ${status ?? ""}`.toLowerCase();

  return (
    details.includes("confirmation email") ||
    details.includes("email not sent") ||
    details.includes("send email") ||
    details.includes("sending email") ||
    details.includes("smtp") ||
    details.includes("provider")
  );
}

function readPasswordResetEmail(formData: FormData): string {
  const value = formData.get("email");

  if (typeof value !== "string" || value.trim().length === 0) {
    redirectWithForgotPasswordError("Enter your email address.");
  }

  const email = value.trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirectWithForgotPasswordError("Enter a valid email address.");
  }

  return email;
}

function readSignInPassword(formData: FormData): string {
  const value = formData.get("password");

  if (typeof value !== "string" || value.trim().length === 0) {
    redirectWithSignInError("Enter your password.");
  }

  return value;
}

function redirectWithCleanSignInAuthError(error: unknown): never {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  const rateLimitHints = ["rate limit", "too many", "security purposes"];
  const invalidCredentialHints = [
    "invalid login credentials",
    "invalid credentials",
    "invalid email or password",
  ];

  if (message.includes("email not confirmed")) {
    redirectWithSignInError("Confirm your email before signing in.");
  }

  if (rateLimitHints.some((hint) => message.includes(hint))) {
    redirectWithSignInError(
      "Too many sign-in attempts. Please wait a moment and try again.",
    );
  }

  if (invalidCredentialHints.some((hint) => message.includes(hint))) {
    redirectWithSignInError("Email or password is incorrect.");
  }

  redirectWithSignInError("We couldn't sign you in. Please try again.");
}

function readSignUpText(input: {
  formData: FormData;
  key: string;
  message: string;
}): string {
  const value = input.formData.get(input.key);

  if (typeof value !== "string" || value.trim().length === 0) {
    redirectWithSignUpError(input.message);
  }

  return value.trim();
}

function readSignUpEmail(formData: FormData): string {
  const email = readSignUpText({
    formData,
    key: "email",
    message: "Enter your email address.",
  });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirectWithSignUpError("Enter a valid email address.");
  }

  return email;
}

function readSignUpPassword(formData: FormData): string {
  const password = readSignUpText({
    formData,
    key: "password",
    message: "Enter your password.",
  });

  if (password.length < 8) {
    redirectWithSignUpError("Use at least 8 characters for your password.");
  }

  return password;
}

function readResetPassword(formData: FormData, code?: string): string {
  const value = formData.get("password");

  if (typeof value !== "string" || value.trim().length === 0) {
    redirectWithResetPasswordError("Enter your new password.", code);
  }

  const password = value;

  if (password.length < 8) {
    redirectWithResetPasswordError(
      "Use at least 8 characters for your password.",
      code,
    );
  }

  const confirmation = formData.get("confirmPassword");

  if (typeof confirmation !== "string" || confirmation !== password) {
    redirectWithResetPasswordError("Passwords do not match.", code);
  }

  return password;
}

function redirectWithCleanSignUpAuthError(error: unknown): never {
  const message = getSupabaseErrorDiagnostics(error).message.toLowerCase();

  if (
    message.includes("already registered") ||
    message.includes("already exists") ||
    message.includes("user already")
  ) {
    redirectWithSignUpError(
      "An account with this email already exists. Sign in instead.",
    );
  }

  if (message.includes("invalid email")) {
    redirectWithSignUpError("Enter a valid email address.");
  }

  if (isEmailRateLimitError(error)) {
    redirectWithSignUpError(SIGN_UP_EMAIL_RATE_LIMIT_MESSAGE);
  }

  if (isEmailDeliveryError(error)) {
    redirectWithSignUpError(SIGN_UP_EMAIL_DELIVERY_MESSAGE);
  }

  if (message.includes("password") || message.includes("weak")) {
    redirectWithSignUpError("Use at least 8 characters for your password.");
  }

  redirectWithSignUpError("We couldn't create your account. Please try again.");
}

export async function signInAction(formData: FormData): Promise<never> {
  const email = readSignInEmail(formData);
  const password = readSignInPassword(formData);

  try {
    await signInWithPassword({
      email,
      password,
    });
  } catch (error) {
    redirectWithCleanSignInAuthError(error);
  }

  redirect("/dashboard");
}

export async function requestPasswordResetAction(
  formData: FormData,
): Promise<never> {
  assertPasswordResetFormIntent(formData);
  const email = readPasswordResetEmail(formData);
  const emailDomain = getEmailDomain(email);
  const redirectTo = getConfiguredPasswordResetRedirectTo();
  const configuredRedirectTo = getConfiguredPasswordResetRedirectTo();

  console.info("[auth:password-reset] request received", {
    emailDomain,
    fallbackRedirectTo: configuredRedirectTo,
    primaryRedirectTo: redirectTo,
  });

  try {
    await sendPasswordResetEmail({
      email,
      redirectTo,
    });
    console.info("[auth:password-reset] primary attempt succeeded", {
      emailDomain,
      primaryRedirectTo: redirectTo,
    });
  } catch (error) {
    const diagnostics = getSupabaseErrorDiagnostics(error);

    console.error("[auth:password-reset] primary attempt failed", {
      emailDomain,
      error: diagnostics,
      redirectTo,
    });

    if (isPasswordResetRateLimitError(error)) {
      redirectWithForgotPasswordError(PASSWORD_RESET_RATE_LIMIT_MESSAGE);
    }

    if (
      redirectTo !== configuredRedirectTo &&
      isRedirectConfigurationError(error)
    ) {
      console.info("[auth:password-reset] fallback attempt started", {
        emailDomain,
        fallbackRedirectTo: configuredRedirectTo,
      });

      try {
        await sendPasswordResetEmail({
          email,
          redirectTo: configuredRedirectTo,
        });
        console.info("[auth:password-reset] fallback attempt succeeded", {
          emailDomain,
          fallbackRedirectTo: configuredRedirectTo,
        });
      } catch (fallbackError) {
        console.error("[auth:password-reset] fallback attempt failed", {
          emailDomain,
          error: getSupabaseErrorDiagnostics(fallbackError),
          fallbackRedirectTo: configuredRedirectTo,
        });
      }
    } else {
      console.info("[auth:password-reset] fallback attempt skipped", {
        emailDomain,
        fallbackRedirectTo: configuredRedirectTo,
        primaryRedirectTo: redirectTo,
        reason:
          redirectTo === configuredRedirectTo
            ? "primary and fallback redirects match"
            : "primary error was not redirect allowlist style",
      });
    }

    // Keep password reset non-enumerating. The user sees the same safe message
    // whether the account exists, the provider throttles, or delivery fails.
  }

  redirect(
    `/auth/forgot-password?notice=${encodeURIComponent(PASSWORD_RESET_NOTICE)}`,
  );
}

export async function updatePasswordAction(formData: FormData): Promise<never> {
  assertPasswordResetFormIntent(formData);
  const rawCode = formData.get("code");
  const code =
    typeof rawCode === "string" && rawCode.trim().length > 0
      ? rawCode.trim()
      : undefined;
  const password = readResetPassword(formData, code);

  try {
    await updatePasswordFromReset({
      ...(code ? { code } : {}),
      password,
    });
  } catch (error) {
    if (isPasswordReuseError(error)) {
      redirectWithResetPasswordError(PASSWORD_REUSE_MESSAGE, code);
    }

    if (isPasswordValidationError(error)) {
      redirectWithResetPasswordError(
        "Use a stronger new password with at least 8 characters.",
        code,
      );
    }

    redirectWithResetPasswordError(
      "This reset link is invalid or expired. Request a new password reset.",
      code,
    );
  }

  await signOut();

  redirect(
    "/auth/sign-in?notice=Password%20updated.%20Sign%20in%20with%20your%20new%20password.",
  );
}

export async function signUpAction(formData: FormData): Promise<never> {
  assertSignUpFormIntent(formData);
  const businessName = readSignUpText({
    formData,
    key: "businessName",
    message: "Enter your business name.",
  });
  const displayName = readSignUpText({
    formData,
    key: "displayName",
    message: "Enter your name.",
  });
  const email = readSignUpEmail(formData);
  const emailDomain = getEmailDomain(email);
  const password = readSignUpPassword(formData);
  let existingIdentityResponse = false;
  let sessionCreated = false;

  console.info("[auth:signup] request received", {
    callbackRedirectTo: getConfiguredAuthCallbackRedirectTo(),
    emailDomain,
  });

  try {
    const result = await signUpWithPassword({
      displayName,
      email,
      emailRedirectTo: getConfiguredAuthCallbackRedirectTo(),
      password,
    });

    sessionCreated = result.sessionCreated;

    console.info("[auth:signup] supabase signup succeeded", {
      emailDomain,
      identityCreated: result.identityCreated,
      sessionCreated,
    });

    if (!result.identityCreated) {
      console.info("[auth:signup] workspace bootstrap skipped", {
        emailDomain,
        reason: "supabase did not create a new identity",
      });
      existingIdentityResponse = true;
      sessionCreated = false;
    } else {
      await createFoundingBusiness({
        businessName,
        ownerUserId: result.user.id,
        serviceRole: true,
      });

      console.info("[auth:signup] workspace bootstrap succeeded", {
        emailDomain,
        sessionCreated,
      });
    }
  } catch (error) {
    console.error("[auth:signup] failed", {
      emailDomain,
      error: getSupabaseErrorDiagnostics(error),
    });
    redirectWithCleanSignUpAuthError(error);
  }

  if (existingIdentityResponse) {
    redirectWithCheckEmailNotice(SIGN_UP_CHECK_EMAIL_NOTICE);
  }

  if (!sessionCreated) {
    redirectWithCheckEmailNotice(SIGN_UP_CHECK_EMAIL_NOTICE);
  }

  redirect("/dashboard");
}

export async function signOutAction(): Promise<never> {
  await signOut();
  redirect("/auth/sign-in");
}
