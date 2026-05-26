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
import { getBizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import {
  INTERFACE_LANGUAGE_COOKIE,
  resolveWorkspaceInterfaceLanguage,
} from "@/lib/i18n/language";
import { signOutAction } from "@/server/actions/auth.actions";
import { getCurrentUser } from "@/server/services/auth.service";
import {
  getBusinessWorkspace,
  getWorkspaceAccessSummary,
} from "@/server/services/business.service";
import { isFounderUser } from "@/server/services/founder-admin.service";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/sign-in");
  }

  const cookieStore = await cookies();
  const workspace = await getBusinessWorkspace({ userId: user.id });
  const activeBusiness = workspace.businesses[0];
  if (!activeBusiness) {
    const accessSummary = await getWorkspaceAccessSummary({ userId: user.id });
    const isDeletionRequested =
      accessSummary?.lifecycleStatus === "deletion_requested";
    const activeLanguage = resolveWorkspaceInterfaceLanguage({
      cookieLanguage: cookieStore.get(INTERFACE_LANGUAGE_COOKIE)?.value,
    });
    const copy = getBizPilotCopy(activeLanguage).dashboard;
    const accessCopy = copy.workspaceAccess;

    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--dash-bg)] px-4 py-8 text-[var(--dash-text)]">
        <DashboardCard className="max-w-xl p-6 sm:p-8" variant="priority">
          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--dash-text-muted)]">
            {accessCopy.eyebrow}
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-[-0.03em]">
            {isDeletionRequested
              ? accessCopy.deletionRequestedTitle
              : accessCopy.pausedTitle}
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--dash-text-secondary)]">
            {isDeletionRequested
              ? accessCopy.deletionRequestedBody
              : accessCopy.pausedBody}
          </p>
          {accessSummary ? (
            <p className="mt-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3 text-sm font-bold text-[var(--dash-text)]">
              {accessSummary.businessName}
            </p>
          ) : null}
          <div className="mt-5 flex flex-wrap gap-2">
            <form action={signOutAction}>
              <button className={buttonClass} type="submit">
                {copy.actions.signOut}
              </button>
            </form>
          </div>
        </DashboardCard>
      </main>
    );
  }

  const themeCookie = cookieStore.get(DASHBOARD_THEME_COOKIE)?.value;
  const activeLanguage = resolveWorkspaceInterfaceLanguage({
    businessLanguage: activeBusiness.preferred_language,
    cookieLanguage: cookieStore.get(INTERFACE_LANGUAGE_COOKIE)?.value,
  });
  const initialTheme = themeCookie === "dark" ? "dark" : "light";
  const copy = getBizPilotCopy(activeLanguage).dashboard;
  const shellCopy = {
    actions: copy.actions,
    nav: copy.nav,
    pages: copy.pages,
    settings: {
      plan: copy.settings.plan,
    },
    status: copy.status,
    theme: copy.theme,
  };

  return (
    <DashboardShell
      activeBusinessName={activeBusiness.name}
      activeLanguage={activeLanguage}
      businessId={activeBusiness.id}
      businessSlug={activeBusiness.slug}
      copy={shellCopy}
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
