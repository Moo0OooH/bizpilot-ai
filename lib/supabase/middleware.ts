/**
 * ============================================================
 * File: lib/supabase/middleware.ts
 * Project: BizPilot AI
 * Description: Provides Phase 2 request protection for authenticated route groups.
 * Role: Keeps route-level session checks separate from secure server-side data checks.
 * Related:
 * - proxy.ts
 * - lib/supabase/server.ts
 * - app/(dashboard)/dashboard/page.tsx
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-04
 * Change Log:
 * - 2026-05-04: Created Phase 2 dashboard route guard helper.
 * - 2026-05-04: Switched dashboard guard to official Supabase SSR client.
 * ============================================================
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseServerClientConfig } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type SessionPolicyBusiness = Partial<
  Pick<
    Database["public"]["Tables"]["businesses"]["Row"],
    "session_timeout_minutes" | "session_timeout_mode"
  >
>;

function sessionPolicyExpired(input: {
  business: SessionPolicyBusiness | null | undefined;
  lastSignInAt: string | null | undefined;
  now: number;
}): boolean {
  if (input.business?.session_timeout_mode !== "after_duration") {
    return false;
  }

  const minutes = input.business.session_timeout_minutes;
  if (!minutes || minutes < 1 || !input.lastSignInAt) {
    return false;
  }

  const signedInAt = Date.parse(input.lastSignInAt);
  if (!Number.isFinite(signedInAt)) {
    return false;
  }

  return input.now - signedInAt >= minutes * 60 * 1000;
}

function redirectToSignIn(input: {
  nextPath: string;
  requestUrl: string;
  response: NextResponse;
}): NextResponse {
  const signInUrl = new URL("/auth/sign-in", input.requestUrl);
  signInUrl.searchParams.set("next", input.nextPath);
  signInUrl.searchParams.set(
    "notice",
    "Your session ended based on workspace security settings.",
  );

  const redirectResponse = NextResponse.redirect(signInUrl);
  for (const cookie of input.response.cookies.getAll()) {
    redirectResponse.cookies.set(cookie);
  }

  return redirectResponse;
}

export async function protectDashboardRequest(
  request: NextRequest,
): Promise<NextResponse> {
  const config = getSupabaseServerClientConfig();
  let response = NextResponse.next({
    request,
  });
  const supabase = createServerClient<Database>(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({
          request,
        });

        cookiesToSet.forEach(({ name, options, value }) => {
          response.cookies.set(name, value, options);
        });

        Object.entries(headers).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
      },
    },
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const signInUrl = new URL("/auth/sign-in", request.url);
    signInUrl.searchParams.set("next", request.nextUrl.pathname);

    return NextResponse.redirect(signInUrl);
  }

  const { data: businesses, error } = await supabase
    .from("businesses")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1);
  const activeBusiness = businesses?.[0] as SessionPolicyBusiness | undefined;

  if (
    !error &&
    sessionPolicyExpired({
      business: activeBusiness,
      lastSignInAt: user.last_sign_in_at,
      now: Date.now(),
    })
  ) {
    await supabase.auth.signOut();

    return redirectToSignIn({
      nextPath: request.nextUrl.pathname,
      requestUrl: request.url,
      response,
    });
  }

  return response;
}
