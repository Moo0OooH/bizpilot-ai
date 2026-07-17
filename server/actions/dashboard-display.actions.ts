/**
 * ============================================================
 * File: server/actions/dashboard-display.actions.ts
 * Project: BizPilot AI
 * Description: Authenticated server actions for dashboard display preferences.
 * Role: Persists allowlisted optional navigation sections in an HTTP-only browser cookie.
 * Related:
 * - lib/dashboard-section-visibility.ts
 * - app/(dashboard)/dashboard/settings/page.tsx
 * - app/(dashboard)/layout.tsx
 * Author: MoOoH
 * Created: 2026-07-17
 * Last Updated: 2026-07-17
 * Change Log:
 * - 2026-07-17: Added authenticated Reports and Guide navigation visibility persistence.
 * ============================================================
 */

"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  DASHBOARD_SECTION_VISIBILITY_COOKIE,
  DASHBOARD_SECTION_VISIBILITY_MAX_AGE,
  normalizeVisibleDashboardSections,
  serializeVisibleDashboardSections,
} from "@/lib/dashboard-section-visibility";
import { getCurrentUser } from "@/server/services/auth.service";

export async function updateDashboardSectionVisibilityAction(
  formData: FormData,
): Promise<never> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/sign-in?redirectTo=%2Fdashboard%2Fsettings");
  }

  const visibleSections = normalizeVisibleDashboardSections(
    formData.getAll("visibleDashboardSection"),
  );
  const cookieStore = await cookies();

  cookieStore.set(
    DASHBOARD_SECTION_VISIBILITY_COOKIE,
    serializeVisibleDashboardSections(visibleSections),
    {
      httpOnly: true,
      maxAge: DASHBOARD_SECTION_VISIBILITY_MAX_AGE,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  );

  revalidatePath("/dashboard", "layout");
  redirect("/dashboard/settings");
}
