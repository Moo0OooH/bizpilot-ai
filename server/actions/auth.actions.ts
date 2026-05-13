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

import {
  signInWithPassword,
  signOut,
  signUpWithPassword,
} from "@/server/services/auth.service";
import { createFoundingBusiness } from "@/server/services/business.service";

function redirectWithSignInError(message: string): never {
  redirect(`/auth/sign-in?error=${encodeURIComponent(message)}`);
}

function redirectWithSignUpError(message: string): never {
  redirect(`/auth/sign-up?error=${encodeURIComponent(message)}`);
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

function redirectWithCleanSignUpAuthError(error: unknown): never {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  const rateLimitHints = ["rate limit", "too many", "security purposes"];

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

  if (rateLimitHints.some((hint) => message.includes(hint))) {
    redirectWithSignUpError(
      "Too many account creation attempts. Please wait a moment and try again.",
    );
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

export async function signUpAction(formData: FormData): Promise<never> {
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
  const password = readSignUpPassword(formData);
  let sessionCreated = false;

  try {
    const result = await signUpWithPassword({
      displayName,
      email,
      password,
    });

    sessionCreated = result.sessionCreated;

    await createFoundingBusiness({
      businessName,
      ownerUserId: result.user.id,
      serviceRole: true,
    });
  } catch (error) {
    redirectWithCleanSignUpAuthError(error);
  }

  if (!sessionCreated) {
    redirect(
      "/auth/sign-in?notice=Check%20your%20email%20to%20confirm%20your%20account.",
    );
  }

  redirect("/dashboard");
}

export async function signOutAction(): Promise<never> {
  await signOut();
  redirect("/auth/sign-in");
}
