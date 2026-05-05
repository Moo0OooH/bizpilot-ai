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
 * Last Updated: 2026-05-04
 * Change Log:
 * - 2026-05-04: Created Phase 2 auth server actions.
 * - 2026-05-04: Kept Next.js redirects outside sign-up error handling.
 * - 2026-05-04: Added service-role tenant setup fallback for confirmed-email flows.
 * - 2026-05-04: Removed manual access-token handling after Supabase SDK migration.
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

function readRequiredFormValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Missing required field: ${key}`);
  }

  return value.trim();
}

function redirectWithAuthError(path: string, error: unknown): never {
  const message =
    error instanceof Error ? error.message : "Authentication request failed.";
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function signInAction(formData: FormData): Promise<never> {
  try {
    await signInWithPassword({
      email: readRequiredFormValue(formData, "email"),
      password: readRequiredFormValue(formData, "password"),
    });
  } catch (error) {
    redirectWithAuthError("/auth/sign-in", error);
  }

  redirect("/dashboard");
}

export async function signUpAction(formData: FormData): Promise<never> {
  const businessName = readRequiredFormValue(formData, "businessName");
  let sessionCreated = false;

  try {
    const result = await signUpWithPassword({
      displayName: readRequiredFormValue(formData, "displayName"),
      email: readRequiredFormValue(formData, "email"),
      password: readRequiredFormValue(formData, "password"),
    });

    sessionCreated = result.sessionCreated;

    await createFoundingBusiness({
      businessName,
      ownerUserId: result.user.id,
      serviceRole: !sessionCreated,
    });
  } catch (error) {
    redirectWithAuthError("/auth/sign-up", error);
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
