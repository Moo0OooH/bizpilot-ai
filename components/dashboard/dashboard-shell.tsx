/**
 * ============================================================
 * File: components/dashboard/dashboard-shell.tsx
 * Project: BizPilot AI
 * Description: Shared protected dashboard application shell.
 * Role: Composes the compact sidebar, utility topbar, theme frame, and content rail for owner workspace pages.
 * Related:
 * - components/dashboard/dashboard-theme.tsx
 * - components/dashboard/dashboard-sidebar.tsx
 * - components/dashboard/dashboard-topbar.tsx
 * Author: MoOoH
 * Created: 2026-05-10
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Restored the complete grouped desktop sidebar and founder entry without duplicating route navigation in the topbar.
 * - 2026-07-16: Removed the duplicated desktop sidebar while retaining the five-destination mobile action bar.
 * - 2026-07-16: Passed the absolute business quote URL into the shell so copy actions share a complete customer-ready link.
 * - 2026-06-19: Added shared theme preference support to the protected dashboard shell.
 * - 2026-06-20: Matched the shell fallback theme to the product-wide light-first default.
 * - 2026-07-04: Added local display preference provider for density, guide, and insight controls.
 * - 2026-07-05: Added the route-aware guide rail across protected dashboard pages.
 * - 2026-07-14: Removed the repeated global guide rail and local density provider so each route owns one clear page priority.
 * ============================================================
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
  quoteUrl: string;
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
  quoteUrl,
  children,
  copy,
  initialTheme = "light",
  showFounderAdmin = false,
  userLabel,
}: DashboardShellProps) {
  return (
    <DashboardThemeFrame initialTheme={initialTheme} labels={copy.theme}>
      <DashboardSidebar
        activeBusinessName={activeBusinessName}
        copy={copy}
        showFounderAdmin={showFounderAdmin}
        userLabel={userLabel}
      />
      <section className="flex h-svh min-w-0 flex-col overflow-hidden pb-20 lg:pb-0">
        <DashboardTopbar
          activeBusinessName={activeBusinessName}
          activeLanguage={activeLanguage}
          businessId={businessId}
          businessSlug={businessSlug}
          quoteUrl={quoteUrl}
          copy={copy}
          showFounderAdmin={showFounderAdmin}
          userLabel={userLabel}
        />
        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 pb-8 sm:px-5 md:px-6 lg:px-6 2xl:px-8">
          <div className="dashboard-container min-w-0">
            {children}
          </div>
        </div>
      </section>
    </DashboardThemeFrame>
  );
}
