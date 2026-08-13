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
 * Last Updated: 2026-07-17
 * Change Log:
 * - 2026-07-17: Normalized the verified Auth provider for server-side workspace-creation policy checks.
 * - 2026-07-16: Memoized the current-user read per server render so protected layouts and pages share one verified session lookup.
 * - 2026-07-05: Added login-only Google OAuth redirect support without tenant bootstrap.
 * - 2026-05-13: Enforced the server-only runtime boundary.
 * - 2026-05-04: Created Phase 2 Supabase Auth service.
 * - 2026-05-04: Aligned auth DTOs with exact optional property types.
 * - 2026-05-04: Migrated auth workflows to the official Supabase SDK.
 * ============================================================
 */

import "server-only";

import { cache } from "react";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthProvider = "email" | "google" | "unknown";

export type AuthUser = Readonly<{
  authProvider: AuthProvider;
  authProviders: readonly AuthProvider[];
  businessName?: string;
  displayName?: string;
  email?: string;
  id: string;
}>;

export type PasswordResetFailureStage = "exchange" | "update";

export const GOOGLE_AUTH_LOGIN_SCOPES = "openid email profile";

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

function readAuthProvider(
  metadata: Record<string, unknown> | undefined,
): AuthProvider {
  const provider = readMetadataText(metadata, "provider")?.toLowerCase();

  return provider === "email" || provider === "google"
    ? provider
    : "unknown";
}

function readAuthProviders(
  metadata: Record<string, unknown> | undefined,
): readonly AuthProvider[] {
  const providers = metadata?.providers;
  const normalized = Array.isArray(providers)
    ? providers
        .filter((provider): provider is string => typeof provider === "string")
        .map((provider) => provider.toLowerCase())
        .filter(
          (provider): provider is "email" | "google" =>
            provider === "email" || provider === "google",
        )
    : [];
  const primaryProvider = readAuthProvider(metadata);

  return Array.from(
    new Set<AuthProvider>([
      ...normalized,
      ...(primaryProvider !== "unknown" ? [primaryProvider] : []),
    ]),
  );
}

function toAuthUser(response: {
  app_metadata?: Record<string, unknown>;
  email?: string;
  id: string;
  user_metadata?: Record<string, unknown>;
}): AuthUser {
  const user: AuthUser = {
    authProvider: readAuthProvider(response.app_metadata),
    authProviders: readAuthProviders(response.app_metadata),
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

export async function signInWithGoogleOAuth(input: {
  redirectTo: string;
}): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: input.redirectTo,
      scopes: GOOGLE_AUTH_LOGIN_SCOPES,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.url) {
    throw new Error("Supabase did not return a Google OAuth redirect URL.");
  }

  return data.url;
}

export async function linkGoogleIdentity(input: {
  redirectTo: string;
}): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.linkIdentity({
    provider: "google",
    options: {
      redirectTo: input.redirectTo,
      scopes: GOOGLE_AUTH_LOGIN_SCOPES,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.url) {
    throw new Error("Supabase did not return a Google identity-link URL.");
  }

  return data.url;
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

export async function exchangeAuthCodeForSession(code: string): Promise<AuthUser> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    throw new PasswordResetFlowError(error.message, {
      recoveryCodeExchanged: false,
      stage: "exchange",
    });
  }

  if (!data.user) {
    throw new PasswordResetFlowError(
      "Supabase did not return a user for the auth callback.",
      {
        recoveryCodeExchanged: false,
        stage: "exchange",
      },
    );
  }

  return toAuthUser(data.user);
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

export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return toAuthUser(user);
});

export async function signOut(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
}
