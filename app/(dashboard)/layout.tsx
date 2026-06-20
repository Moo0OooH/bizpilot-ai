/**
 * ============================================================
 * File: app/(dashboard)/layout.tsx
 * Project: BizPilot AI
 * Description: Protected dashboard route-group layout and workspace access shell.
 * Role: Resolves auth/workspace access, theme preference, and dashboard shell copy before rendering protected pages.
 * Related:
 * - components/dashboard/dashboard-shell.tsx
 * - components/dashboard/dashboard-theme.tsx
 * - server/services/auth.service.ts
 * Author: MoOoH
 * Created: 2026-05-02
 * Last Updated: 2026-06-20
 * Change Log:
 * - 2026-06-19: Resolved theme preference from cookies for hydration-safe dashboard rendering.
 * - 2026-06-20: Made the workspace-access recovery shell short-height safe with svh and natural overflow.
 * ============================================================
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DASHBOARD_THEME_COOKIE } from "@/components/dashboard/dashboard-theme";
import {
  buttonClass,
  DashboardCard,
  inputClass,
  primaryButtonClass,
} from "@/components/dashboard/dashboard-ui";
import { getBizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import {
  INTERFACE_LANGUAGE_COOKIE,
  resolveWorkspaceInterfaceLanguage,
} from "@/lib/i18n/language";
import { readThemePreference } from "@/lib/theme";
import { WORKSPACE_RECOVERY_ERROR_COOKIE } from "@/lib/workspace-recovery/constants";
import { signOutAction } from "@/server/actions/auth.actions";
import { recoverWorkspaceAccessAction } from "@/server/actions/workspace-recovery.actions";
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
    const recoveryError = cookieStore.get(WORKSPACE_RECOVERY_ERROR_COOKIE)?.value;
    const isDeletionRequested =
      accessSummary?.lifecycleStatus === "deletion_requested";
    const activeLanguage = resolveWorkspaceInterfaceLanguage({
      cookieLanguage: cookieStore.get(INTERFACE_LANGUAGE_COOKIE)?.value,
    });
    const copy = getBizPilotCopy(activeLanguage).dashboard;
    const accessCopy = copy.workspaceAccess;

    return (
      <main className="flex min-h-svh min-w-0 items-start justify-center bg-[var(--dash-bg)] px-4 py-8 text-[var(--dash-text)] sm:items-center">
        <DashboardCard className="w-full max-w-xl p-6 sm:p-8" variant="priority">
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
          {recoveryError ? (
            <p className="mt-4 rounded-lg border border-red-300/50 bg-red-50 p-3 text-sm font-bold leading-5 text-red-700">
              {recoveryError}
            </p>
          ) : null}
          {!accessSummary ? (
            <form
              action={recoverWorkspaceAccessAction}
              className="mt-5 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-4"
            >
              <label className="grid gap-2 text-sm font-bold text-[var(--dash-text)]">
                Business name
                <input
                  className={inputClass}
                  defaultValue={user.businessName ?? ""}
                  maxLength={80}
                  name="businessName"
                  placeholder="Your cleaning business"
                  required
                  type="text"
                />
              </label>
              <input name="accountEmail" type="hidden" value={user.email ?? ""} />
              {user.email ? (
                <p className="mt-2 text-xs font-bold leading-5 text-[var(--dash-text-muted)]">
                  Signed in as {user.email}
                </p>
              ) : null}
              <p className="mt-2 text-xs leading-5 text-[var(--dash-text-secondary)]">
                Use this only if signup created your login but did not finish
                the workspace setup.
              </p>
              <button className={`${primaryButtonClass} mt-3`} type="submit">
                Recover workspace
              </button>
            </form>
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
  const initialTheme = readThemePreference(themeCookie);
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
