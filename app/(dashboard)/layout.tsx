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
import { buttonClass, DashboardCard } from "@/components/dashboard/dashboard-ui";
import { signOutAction } from "@/server/actions/auth.actions";
import { getCurrentUser } from "@/server/services/auth.service";
import { getBusinessWorkspace } from "@/server/services/business.service";
import { isFounderUser } from "@/server/services/founder-admin.service";

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
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--dash-bg)] px-4 py-8 text-[var(--dash-text)]">
        <DashboardCard className="max-w-xl p-6 sm:p-8" variant="priority">
          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--dash-text-muted)]">
            Workspace access
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-[-0.03em]">
            This workspace is paused or unavailable.
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--dash-text-secondary)]">
            Your dashboard is currently blocked because no active business
            membership is available. Your data is retained; contact BizPilot
            support if this looks unexpected.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <form action={signOutAction}>
              <button className={buttonClass} type="submit">
                Sign out
              </button>
            </form>
          </div>
        </DashboardCard>
      </main>
    );
  }

  const themeCookie = (await cookies()).get(DASHBOARD_THEME_COOKIE)?.value;
  const initialTheme = themeCookie === "light" ? "light" : "dark";

  return (
    <DashboardShell
      activeBusinessName={activeBusiness.name}
      businessSlug={activeBusiness.slug}
      initialTheme={initialTheme}
      showFounderAdmin={isFounderUser(user)}
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
