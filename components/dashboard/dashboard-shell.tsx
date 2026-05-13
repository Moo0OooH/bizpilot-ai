/**
 * ============================================================
 * File: components/dashboard/dashboard-shell.tsx
 * Project: BizPilot AI
 * Description: Provides the shared protected dashboard application shell.
 * Role: Owns common dashboard frame, navigation, header, and utility rail.
 * Related:
 * - components/dashboard/dashboard-sidebar.tsx
 * - app/(dashboard)/layout.tsx
 * Author: MoOoH
 * Created: 2026-05-10
 * Last Updated: 2026-05-10
 * Change Log:
 * - 2026-05-10: Created reusable protected dashboard shell.
 * ============================================================
 */

import { DashboardSidebar } from "./dashboard-sidebar";
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
    <main className="min-h-screen bg-slate-50 text-slate-950 lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
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

        <div className="px-4 py-4 pb-10 sm:px-5 lg:px-6">
          <div className="mx-auto w-full max-w-[1240px] min-w-0">
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
