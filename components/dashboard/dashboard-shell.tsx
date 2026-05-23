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

type DashboardShellProps = Readonly<{
  activeBusinessName: string;
  activeLanguage: string;
  businessId: string;
  businessSlug: string;
  children: React.ReactNode;
  initialTheme?: DashboardTheme;
  copy: BizPilotCopy["dashboard"];
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
      <section className="min-w-0 pb-20 lg:pb-0">
        <DashboardTopbar
          activeBusinessName={activeBusinessName}
          activeLanguage={activeLanguage}
          businessId={businessId}
          businessSlug={businessSlug}
          copy={copy}
          showFounderAdmin={showFounderAdmin}
          userLabel={userLabel}
        />
        <div className="px-4 py-4 pb-8 sm:px-5 md:px-6 lg:px-[28px] 2xl:px-[28px]">
          <div className="mx-auto w-full max-w-[1440px] min-w-0">
            {children}
          </div>
        </div>
      </section>
    </DashboardThemeFrame>
  );
}
