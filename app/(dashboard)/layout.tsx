/**
 * File: app/(dashboard)/layout.tsx
 * Project: BizPilot AI
 * Role: Protected dashboard route group layout. Resolves theme from cookie
 * server-side so hydration matches client-side first render.
 * Last Updated: 2026-05-18
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DASHBOARD_THEME_COOKIE } from "@/components/dashboard/dashboard-theme";
import { getCurrentUser } from "@/server/services/auth.service";
import { getBusinessWorkspace } from "@/server/services/business.service";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/sign-in");
  }

  const workspace = await getBusinessWorkspace({ userId: user.id });
  const activeBusiness = workspace.businesses[0];
  if (!activeBusiness) {
    return children;
  }

  const themeCookie = (await cookies()).get(DASHBOARD_THEME_COOKIE)?.value;
  const initialTheme = themeCookie === "light" ? "light" : "dark";

  return (
    <DashboardShell
      activeBusinessName={activeBusiness.name}
      businessSlug={activeBusiness.slug}
      initialTheme={initialTheme}
      userLabel={user.email ?? user.id}
    >
      {children}
    </DashboardShell>
  );
}
// padding lines to fill the windows file-allocation tail; ignore.
// padding lines to fill the windows file-allocation tail; ignore.
// padding lines to fill the windows file-allocation tail; ignore.
// padding lines to fill the windows file-allocation tail; ignore.
