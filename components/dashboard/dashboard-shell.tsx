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
 * Last Updated: 2026-07-21
 * Change Log:
 * - 2026-07-17: Passed server-validated optional section visibility to desktop and compact navigation.
 * - 2026-07-16: Restored the complete grouped desktop sidebar and founder entry without duplicating route navigation in the topbar.
 * - 2026-07-16: Removed the duplicated desktop sidebar while retaining the five-destination mobile action bar.
 * - 2026-07-16: Passed the absolute business quote URL into the shell so copy actions share a complete customer-ready link.
 * - 2026-06-19: Added shared theme preference support to the protected dashboard shell.
 * - 2026-06-20: Matched the shell fallback theme to the product-wide light-first default.
 * - 2026-07-04: Added local display preference provider for density, guide, and insight controls.
 * - 2026-07-05: Added the route-aware guide rail across protected dashboard pages.
 * - 2026-07-14: Removed the repeated global guide rail and local density provider so each route owns one clear page priority.
 * - 2026-07-21: Passed isolated dashboard language direction into the shell while keeping business language distinct.
 * ============================================================
 */

import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardThemeFrame } from "./dashboard-theme";
import { DashboardTopbar } from "./dashboard-topbar";
import type { OptionalDashboardSection } from "@/lib/dashboard-section-visibility";
import type { BizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import type {
  DashboardInterfaceLanguage,
  DashboardInterfaceTextDirection,
} from "@/lib/i18n/dashboard-interface";
import type { ThemePreference } from "@/lib/theme";

export type DashboardShellCopy = Omit<
  Pick<
  BizPilotCopy["dashboard"],
  "actions" | "nav" | "pages" | "status" | "theme"
  >,
  "nav"
> &
  Readonly<{
    nav: BizPilotCopy["dashboard"]["nav"] & {
      premiumOperations: string;
    };
    settings: Pick<BizPilotCopy["dashboard"]["settings"], "plan">;
  }>;

type DashboardShellProps = Readonly<{
  activeBusinessName: string;
  activeLanguage: DashboardInterfaceLanguage;
  businessLanguage: string;
  businessSlug: string;
  quoteUrl: string;
  children: React.ReactNode;
  initialTheme?: ThemePreference;
  textDirection: DashboardInterfaceTextDirection;
  copy: DashboardShellCopy;
  showFounderAdmin?: boolean;
  userLabel: string;
  visibleOptionalSections: readonly OptionalDashboardSection[];
}>;

export function DashboardShell({
  activeBusinessName,
  activeLanguage,
  businessLanguage,
  businessSlug,
  quoteUrl,
  children,
  copy,
  initialTheme = "light",
  textDirection,
  showFounderAdmin = false,
  userLabel,
  visibleOptionalSections,
}: DashboardShellProps) {
  return (
    <DashboardThemeFrame
      direction={textDirection}
      initialTheme={initialTheme}
      labels={copy.theme}
      language={activeLanguage}
    >
      <DashboardSidebar
        activeBusinessName={activeBusinessName}
        copy={copy}
        showFounderAdmin={showFounderAdmin}
        userLabel={userLabel}
        visibleOptionalSections={visibleOptionalSections}
      />
      <section className="flex h-svh min-w-0 flex-col overflow-hidden pb-20 lg:pb-0">
        <DashboardTopbar
          activeBusinessName={activeBusinessName}
          activeLanguage={activeLanguage}
          businessLanguage={businessLanguage}
          businessSlug={businessSlug}
          quoteUrl={quoteUrl}
          copy={copy}
          showFounderAdmin={showFounderAdmin}
          userLabel={userLabel}
          visibleOptionalSections={visibleOptionalSections}
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
