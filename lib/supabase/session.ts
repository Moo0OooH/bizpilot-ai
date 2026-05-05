/**
 * ============================================================
 * File: lib/supabase/session.ts
 * Project: BizPilot AI
 * Description: Defines server-managed Supabase Auth session cookie helpers.
 * Role: Keeps Phase 2 auth session storage centralized and HTTP-only.
 * Related:
 * - server/services/auth.service.ts
 * - lib/supabase/middleware.ts
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-04
 * Change Log:
 * - 2026-05-04: Created Phase 2 Supabase session cookie helper.
 * ============================================================
 */

import { cookies } from "next/headers";

export type SupabaseSession = Readonly<{
  accessToken: string;
  refreshToken: string;
  expiresAt?: number;
}>;

export const supabaseSessionCookieName = "bizpilot-supabase-session";

const sessionCookieMaxAgeSeconds = 60 * 60 * 24 * 7;

function isSupabaseSession(value: unknown): value is SupabaseSession {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<SupabaseSession>;

  return (
    typeof candidate.accessToken === "string" &&
    candidate.accessToken.length > 0 &&
    typeof candidate.refreshToken === "string" &&
    candidate.refreshToken.length > 0 &&
    (candidate.expiresAt === undefined || typeof candidate.expiresAt === "number")
  );
}

export async function readSupabaseSession(): Promise<SupabaseSession | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(supabaseSessionCookieName)?.value;

  if (!value) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(value);
    return isSupabaseSession(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function writeSupabaseSession(
  session: SupabaseSession,
): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(supabaseSessionCookieName, JSON.stringify(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionCookieMaxAgeSeconds,
  });
}

export async function clearSupabaseSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(supabaseSessionCookieName);
}
