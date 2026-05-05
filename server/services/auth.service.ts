/**
 * ============================================================
 * File: server/services/auth.service.ts
 * Project: BizPilot AI
 * Description: Handles Phase 2 Supabase Auth sign-in, sign-up, and session reads.
 * Role: Owns authentication workflow boundaries before tenant services run.
 * Related:
 * - server/actions/auth.actions.ts
 * - lib/supabase/rest.ts
 * - lib/supabase/session.ts
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-04
 * Change Log:
 * - 2026-05-04: Created Phase 2 Supabase Auth service.
 * - 2026-05-04: Aligned auth DTOs with exact optional property types.
 * ============================================================
 */

import {
  clearSupabaseSession,
  readSupabaseSession,
  writeSupabaseSession,
  type SupabaseSession,
} from "@/lib/supabase/session";
import { requestSupabaseAuth } from "@/lib/supabase/rest";

export type AuthUser = Readonly<{
  email?: string;
  id: string;
}>;

type SupabaseAuthResponse = Readonly<{
  access_token?: string;
  expires_at?: number;
  refresh_token?: string;
  user?: {
    email?: string;
    id: string;
  };
}>;

type SupabaseUserResponse = Readonly<{
  email?: string;
  id: string;
}>;

function toSession(response: SupabaseAuthResponse): SupabaseSession | null {
  if (!response.access_token || !response.refresh_token) {
    return null;
  }

  const session: SupabaseSession = {
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
  };

  if (response.expires_at !== undefined) {
    return {
      ...session,
      expiresAt: response.expires_at,
    };
  }

  return session;
}

function toAuthUser(response: SupabaseUserResponse): AuthUser {
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
  const response = await requestSupabaseAuth<SupabaseAuthResponse>(
    "token?grant_type=password",
    {
      method: "POST",
      body: {
        email: input.email,
        password: input.password,
      },
    },
  );
  const session = toSession(response);

  if (!session || !response.user) {
    throw new Error("Supabase did not return a sign-in session.");
  }

  await writeSupabaseSession(session);

  return toAuthUser(response.user);
}

export async function signUpWithPassword(input: {
  displayName?: string;
  email: string;
  password: string;
}): Promise<{ user: AuthUser; sessionCreated: boolean }> {
  const response = await requestSupabaseAuth<SupabaseAuthResponse>("signup", {
    method: "POST",
    body: {
      email: input.email,
      password: input.password,
      data: {
        display_name: input.displayName,
      },
    },
  });

  if (!response.user) {
    throw new Error("Supabase did not return a signed-up user.");
  }

  const session = toSession(response);

  if (session) {
    await writeSupabaseSession(session);
  }

  return {
    user: toAuthUser(response.user),
    sessionCreated: Boolean(session),
  };
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await readSupabaseSession();

  if (!session) {
    return null;
  }

  try {
    const response = await requestSupabaseAuth<SupabaseUserResponse>("user", {
      accessToken: session.accessToken,
    });

    return toAuthUser(response);
  } catch {
    await clearSupabaseSession();
    return null;
  }
}

export async function getCurrentAccessToken(): Promise<string | null> {
  const session = await readSupabaseSession();
  return session?.accessToken ?? null;
}

export async function signOut(): Promise<void> {
  await clearSupabaseSession();
}
