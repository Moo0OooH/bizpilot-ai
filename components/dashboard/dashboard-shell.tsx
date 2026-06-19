/**
 * File: components/dashboard/dashboard-shell.tsx
 * Project: BizPilot AI
 * Role: Shared protected dashboard application shell with shared theme preference.
 * Last Updated: 2026-06-19
 */

import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardThemeFrame } from "./dashboard-theme";
import { DashboardTopbar } from "./dashboard-topbar";
import type { BizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import type { ThemePreference } from "@/lib/theme";

export type DashboardShellCopy = Pick<
  BizPilotCopy["dashboard"],
  "actions" | "nav" | "pages" | "status" | "theme"
> &
  Readonly<{
    settings: Pick<BizPilotCopy["dashboard"]["settings"], "plan">;
  }>;

type DashboardShellProps = Readonly<{
  activeBusinessName: string;
  activeLanguage: string;
  businessId: string;
  businessSlug: string;
  children: React.ReactNode;
  initialTheme?: ThemePreference;
  copy: DashboardShellCopy;
  showFounderAdmin?: boolean;
  userLabel: string;
}>;

export function DashboardShell({
  activeBusinessName,
  activeLanguage,
  businessId,
  businessSlug,
  children,
  copy,
  initialTheme = "dark",
  showFounderAdmin = false,
  userLabel,
}: DashboardShellProps) {
  return (
    <DashboardThemeFrame initialTheme={initialTheme} labels={copy.theme}>
      <DashboardSidebar
        activeBusinessName={activeBusinessName}
        businessSlug={businessSlug}
        copy={copy}
        userLabel={userLabel}
      />
      <section className="flex min-h-svh min-w-0 flex-col pb-20 lg:pb-0">
        <DashboardTopbar
          activeBusinessName={activeBusinessName}
          activeLanguage={activeLanguage}
          businessId={businessId}
          businessSlug={businessSlug}
          copy={copy}
          showFounderAdmin={showFounderAdmin}
          userLabel={userLabel}
        />
        <div className="min-h-0 flex-1 px-3 py-3 pb-8 sm:px-5 md:px-6 lg:px-6 2xl:px-8">
          <div className="dashboard-container min-w-0">
            {children}
          </div>
        </div>
      </section>
    </DashboardThemeFrame>
  );
}
