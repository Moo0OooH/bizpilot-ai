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
  email?: string;
  id: string;
}>;

function toAuthUser(response: { email?: string; id: string }): AuthUser {
  const user: AuthUser = {
    id: response.id,
  };

  if (response.email !== undefined) {
    return {
      ...user,
      email: response.email,
    };
  }

  return user;
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
  displayName?: string;
  email: string;
  password: string;
}): Promise<{ user: AuthUser; sessionCreated: boolean }> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
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
    user: toAuthUser(data.user),
    sessionCreated: Boolean(data.session),
  };
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
