/**
 * ============================================================
 * File: components/dashboard/dashboard-shell.tsx
 * Project: BizPilot AI
 * Description: Provides the shared protected dashboard application shell.
 * Role: Owns common dashboard frame, navigation, header, theme, and utility rail.
 * Related:
 * - components/dashboard/dashboard-sidebar.tsx
 * - app/(dashboard)/layout.tsx
 * Author: MoOoH
 * Created: 2026-05-10
 * Last Updated: 2026-05-17
 * Change Log:
 * - 2026-05-10: Created reusable protected dashboard shell.
 * - 2026-05-17: Applied the scoped calm dark dashboard theme.
 * - 2026-05-17: Added owner-selectable dashboard light/dark theme support.
 * ============================================================
 */

import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardThemeFrame } from "./dashboard-theme";
import { DashboardTopbar } from "./dashboard-topbar";

type DashboardShellProps = Readonly<{
  activeBusinessName: string;
  businessSlug: string;
  children: React.ReactNode;
  userLabel: string;
}>;

export function DashboardShell({
  activeBusinessName,
  businessSlug,
  children,
  userLabel,
}: DashboardShellProps) {
  return (
    <DashboardThemeFrame>
      <DashboardSidebar
        activeBusinessName={activeBusinessName}
        userLabel={userLabel}
      />

      <section className="min-w-0">
        <DashboardTopbar
          activeBusinessName={activeBusinessName}
          businessSlug={businessSlug}
          userLabel={userLabel}
        />

        <div className="px-3 py-3 pb-8 sm:px-4 lg:px-5">
          <div className="mx-auto w-full max-w-[1180px] min-w-0">
            {children}
          </div>
        </div>
      </section>
    </DashboardThemeFrame>
  );
}
