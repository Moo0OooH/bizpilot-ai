/**
 * File: components/dashboard/dashboard-shell.tsx
 * Project: BizPilot AI
 * Role: Shared protected dashboard application shell.
 * Last Updated: 2026-05-18
 */

import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardThemeFrame } from "./dashboard-theme";
import { DashboardTopbar } from "./dashboard-topbar";
import type { BizPilotCopy } from "@/lib/i18n/bizpilot-copy";

type DashboardTheme = "dark" | "light";

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
  initialTheme?: DashboardTheme;
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
      <section className="flex min-h-screen min-w-0 flex-col pb-20 lg:h-screen lg:min-h-0 lg:overflow-hidden lg:pb-0">
        <DashboardTopbar
          activeBusinessName={activeBusinessName}
          activeLanguage={activeLanguage}
          businessId={businessId}
          businessSlug={businessSlug}
          copy={copy}
          showFounderAdmin={showFounderAdmin}
          userLabel={userLabel}
        />
        <div className="min-h-0 flex-1 px-3 py-3 pb-8 sm:px-5 md:px-6 lg:overflow-y-auto lg:px-5 2xl:px-6">
          <div className="mx-auto w-full max-w-[1500px] min-w-0">
            {children}
          </div>
        </div>
      </section>
    </DashboardThemeFrame>
  );
}
