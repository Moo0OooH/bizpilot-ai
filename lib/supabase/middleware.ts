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

  return NextResponse.next();
}
