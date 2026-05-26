/**
 * ============================================================
 * File: server/services/auth.service.ts
 * Project: BizPilot AI
 * Description: Handles Phase 2 Supabase Auth sign-in, sign-up, and session reads.
 * Role: Owns authentication workflow boundaries before tenant services run.
 * Related:
 * - server/actions/auth.actions.ts
 * - lib/supabase/server.ts
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-13
 * Change Log:
 * - 2026-05-13: Enforced the server-only runtime boundary.
 * - 2026-05-04: Created Phase 2 Supabase Auth service.
 * - 2026-05-04: Aligned auth DTOs with exact optional property types.
 * - 2026-05-04: Migrated auth workflows to the official Supabase SDK.
 * ============================================================
 */

import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthUser = Readonly<{
  businessName?: string;
  displayName?: string;
  email?: string;
  id: string;
}>;

export type PasswordResetFailureStage = "exchange" | "update";

export class PasswordResetFlowError extends Error {
  readonly recoveryCodeExchanged: boolean;
  readonly stage: PasswordResetFailureStage;

  constructor(
    message: string,
    input: {
      recoveryCodeExchanged: boolean;
      stage: PasswordResetFailureStage;
    },
  ) {
    super(message);
    this.name = "PasswordResetFlowError";
    this.recoveryCodeExchanged = input.recoveryCodeExchanged;
    this.stage = input.stage;
  }
}

export function getPasswordResetFlowErrorContext(error: unknown): {
  recoveryCodeExchanged: boolean;
  stage?: PasswordResetFailureStage;
} {
  if (error instanceof PasswordResetFlowError) {
    return {
      recoveryCodeExchanged: error.recoveryCodeExchanged,
      stage: error.stage,
    };
  }

  return {
    recoveryCodeExchanged: false,
  };
}

function readMetadataText(
  metadata: Record<string, unknown> | undefined,
  key: string,
): string | undefined {
  const value = metadata?.[key];

  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}

function toAuthUser(response: {
  email?: string;
  id: string;
  user_metadata?: Record<string, unknown>;
}): AuthUser {
  const user: AuthUser = {
    id: response.id,
  };
  const businessName = readMetadataText(response.user_metadata, "business_name");
  const displayName = readMetadataText(response.user_metadata, "display_name");

  return {
    ...user,
    ...(businessName ? { businessName } : {}),
    ...(displayName ? { displayName } : {}),
    ...(response.email !== undefined ? { email: response.email } : {}),
  };
}

export async function signInWithPassword(input: {
  email: string;
  password: string;
}): Promise<AuthUser> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error("Supabase did not return a signed-in user.");
  }

  return toAuthUser(data.user);
}

export async function signUpWithPassword(input: {
  businessName?: string;
  displayName?: string;
  emailRedirectTo?: string;
  email: string;
  password: string;
}): Promise<{
  identityCreated: boolean;
  sessionCreated: boolean;
  user: AuthUser;
}> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      ...(input.emailRedirectTo
        ? { emailRedirectTo: input.emailRedirectTo }
        : {}),
      data: {
        business_name: input.businessName ?? "",
        display_name: input.displayName ?? "",
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error("Supabase did not return a signed-up user.");
  }

  return {
    identityCreated:
      !Array.isArray(data.user.identities) || data.user.identities.length > 0,
    user: toAuthUser(data.user),
    sessionCreated: Boolean(data.session),
  };
}

export async function sendPasswordResetEmail(input: {
  email: string;
  redirectTo: string;
}): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(input.email, {
    redirectTo: input.redirectTo,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function exchangeAuthCodeForSession(code: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    throw new PasswordResetFlowError(error.message, {
      recoveryCodeExchanged: false,
      stage: "exchange",
    });
  }
}

export async function updatePasswordFromReset(input: {
  code?: string | undefined;
  password: string;
}): Promise<void> {
  const supabase = await createSupabaseServerClient();
  let recoveryCodeExchanged = false;

  if (input.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(input.code);

    if (error) {
      throw new PasswordResetFlowError(error.message, {
        recoveryCodeExchanged,
        stage: "exchange",
      });
    }

    recoveryCodeExchanged = true;
  }

  const { error } = await supabase.auth.updateUser({
    password: input.password,
  });

  if (error) {
    throw new PasswordResetFlowError(error.message, {
      recoveryCodeExchanged,
      stage: "update",
    });
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return toAuthUser(user);
}

export async function signOut(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
}
