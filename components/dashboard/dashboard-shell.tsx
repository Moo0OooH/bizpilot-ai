/**
 * File: components/dashboard/dashboard-shell.tsx
 * Project: BizPilot AI
 * Role: Shared protected dashboard application shell.
 * Last Updated: 2026-05-18
 */

import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardThemeFrame } from "./dashboard-theme";
import { DashboardTopbar } from "./dashboard-topbar";

type DashboardTheme = "dark" | "light";

type DashboardShellProps = Readonly<{
  activeBusinessName: string;
  businessSlug: string;
  children: React.ReactNode;
  initialTheme?: DashboardTheme;
  userLabel: string;
}>;

export function DashboardShell({
  activeBusinessName,
  businessSlug,
  children,
  initialTheme = "dark",
  userLabel,
}: DashboardShellProps) {
  return (
    <DashboardThemeFrame initialTheme={initialTheme}>
      <DashboardSidebar
        activeBusinessName={activeBusinessName}
        businessSlug={businessSlug}
        userLabel={userLabel}
      />
      <section className="min-w-0 pb-20 lg:pb-0">
        <DashboardTopbar
          activeBusinessName={activeBusinessName}
          businessSlug={businessSlug}
          userLabel={userLabel}
        />
        <div className="px-4 py-4 pb-8 sm:px-5 md:px-6 lg:px-[28px] 2xl:px-[28px]">
          <div className="mx-auto w-full max-w-[1220px] min-w-0">
            {children}
          </div>
        </div>
      </section>
    </DashboardThemeFrame>
  );
}
