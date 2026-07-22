"use client";

/**
 * ============================================================
 * File: components/dashboard/dashboard-topbar.tsx
 * Project: BizPilot AI
 * Description: Renders the protected workspace topbar.
 * Role: Provides compact quote-link, language, theme, account, and founder utilities while the sidebar owns desktop route navigation.
 * Related:
 * - components/dashboard/dashboard-shell.tsx
 * - server/actions/auth.actions.ts
 * Author: MoOoH
 * Created: 2026-05-10
 * Last Updated: 2026-07-21
 * Change Log:
 * - 2026-07-17: Filtered optional compact destinations and removed duplicate desktop Guide and Founder Admin buttons.
 * - 2026-07-16: Added Reports to compact navigation without duplicating desktop sidebar routes.
 * - 2026-07-16: Removed duplicated desktop route links, kept complete compact navigation, and made founder access visible at every responsive tier.
 * - 2026-07-16: Made the centered five-route bar the single desktop navigation and moved Guide to secondary help.
 * - 2026-07-16: Replaced the fragile client-managed desktop disclosure with centered native route navigation and full-page protected-route transitions.
 * - 2026-07-16: Moved desktop utilities to the right, restored the complete owner route menu, closed it after navigation, and disabled protected-route prefetch pressure.
 * - 2026-07-16: Anchored the desktop Actions menu inside the content column so it no longer opens beneath the fixed sidebar.
 * - 2026-07-05: Corrected the More actions control title and accessible label.
 * - 2026-05-19: Matched approved index.html topbar hierarchy: page title left, focused actions right, no global search clutter.
 * - 2026-05-23: Localized route context and actions through the central dashboard copy dictionary.
 * - 2026-05-26: Tightened responsive controls and made founder entry visible on desktop dashboards.
 * - 2026-06-27: Rendered topbar route context as display text so page content owns the H1.
 * - 2026-06-27: Kept the mobile action menu inside the viewport.
 * - 2026-07-04: Added a direct route to local display settings from the action menu.
 * - 2026-07-04: Added the core owner route map to Actions so every dashboard function is reachable from the topbar.
 * - 2026-07-04: Added the owner operating guide route to page context and Actions.
 * - 2026-07-14: Removed duplicate route title/subtitle chrome and reduced the More menu to genuinely secondary actions.
 * - 2026-07-21: Moved the dashboard-only language picker to an accessible five-language menu without changing public business language.
 * - 2026-07-21: Made the dashboard-interface language picker available inside the compact mobile More menu.
 * ============================================================
 */

import type { DashboardShellCopy } from "./dashboard-shell";
import type { OptionalDashboardSection } from "@/lib/dashboard-section-visibility";
import {
  dashboardInterfaceLanguageNativeLabels,
  dashboardInterfaceLanguages,
  getDashboardInterfaceCopy,
  type DashboardInterfaceLanguage,
} from "@/lib/i18n/dashboard-interface";
import { usePathname } from "next/navigation";

import { signOutAction } from "@/server/actions/auth.actions";
import { updateDashboardInterfaceLanguageAction } from "@/server/actions/premium-operations.actions";

import { CopyButton } from "./copy-button";
import { DashboardThemeSelector } from "./dashboard-theme";
import { buttonClass, ghostButtonClass } from "./dashboard-ui";

type DashboardTopbarProps = Readonly<{
  activeBusinessName: string;
  activeLanguage: DashboardInterfaceLanguage;
  businessLanguage: string;
  businessSlug: string;
  quoteUrl: string;
  copy: DashboardShellCopy;
  showFounderAdmin?: boolean;
  userLabel: string;
  visibleOptionalSections: readonly OptionalDashboardSection[];
}>;

function MoreIcon() {
  return (
    <svg
      aria-hidden
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M5 12h14M5 7h14M5 17h14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function DashboardTopbar({
  activeBusinessName,
  activeLanguage,
  businessLanguage,
  businessSlug,
  quoteUrl,
  copy,
  showFounderAdmin = false,
  userLabel,
  visibleOptionalSections,
}: DashboardTopbarProps) {
  const interfaceCopy = getDashboardInterfaceCopy(activeLanguage);
  const quotePath = `/quote/${businessSlug}`;
  const quotePreviewPath = `${quotePath}?preview=dashboard${
    businessLanguage === "fr-CA" ? "&language=fr-CA" : ""
  }`;
  const pathname = usePathname();
  const primaryRoutes = [
    { href: "/dashboard", label: copy.nav.overview },
    { href: "/dashboard/leads", label: copy.nav.leads },
    { href: "/dashboard/configuration", label: copy.nav.quoteSetup },
    { href: "/dashboard/business-profile", label: copy.nav.businessProfile },
    { href: "/dashboard/settings", label: copy.nav.settings },
  ] as const;
  const menuRoutes = [
    ...primaryRoutes,
    { href: "/dashboard/operations", label: copy.nav.premiumOperations },
    ...(visibleOptionalSections.includes("reports")
      ? [{ href: "/dashboard/reports", label: copy.nav.reports }]
      : []),
    ...(visibleOptionalSections.includes("guide")
      ? [{ href: "/dashboard/guide", label: copy.nav.guide }]
      : []),
  ] as const;

  function isActiveRoute(href: string): boolean {
    if (href === "/dashboard") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  }

  return (
    <header className="dashboard-topbar sticky top-0 z-20 shrink-0 border-b backdrop-blur">
      <div className="flex min-w-0 items-center gap-2 px-3 py-2 sm:min-h-[56px] sm:gap-3 sm:px-5 md:px-6 lg:px-5">
        <a className="flex min-w-0 items-center gap-2 lg:hidden" href="/dashboard">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--dash-primary)] text-sm font-black text-white">
            B
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[14px] font-black text-[var(--dash-text)]">
              BizPilot AI
            </span>
            <span className="hidden truncate text-[11px] text-[var(--dash-text-muted)] sm:block">
              {activeBusinessName}
            </span>
          </span>
        </a>

        <div className="ms-auto flex min-w-0 items-center justify-end gap-1.5 sm:gap-2">
          <details className="group relative lg:hidden">
            <summary
              aria-label={interfaceCopy.shell.moreActions}
              className={`${buttonClass} list-none cursor-pointer [&::-webkit-details-marker]:hidden`}
              title={interfaceCopy.shell.moreActions}
            >
              <MoreIcon />
              <span className="hidden md:inline">{interfaceCopy.shell.moreActions}</span>
            </summary>
            <div className="absolute end-0 top-11 z-30 grid w-[min(240px,calc(100vw-1.5rem))] gap-1.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] p-2.5 shadow-[0_18px_48px_rgba(2,6,23,0.18)]">
              <CopyButton
                className="!w-full !justify-start"
                failedLabel={interfaceCopy.shell.copyFailed}
                label={interfaceCopy.shell.copyQuoteLink}
                successLabel={interfaceCopy.shell.copySuccess}
                value={quoteUrl}
              />
              <a
                className={`${buttonClass} w-full justify-start`}
                href={quotePreviewPath}
              >
                {interfaceCopy.shell.previewQuotePage}
              </a>
              <form
                action={updateDashboardInterfaceLanguageAction}
                className="grid gap-1.5 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-2 sm:hidden"
              >
                <input name="redirectTo" type="hidden" value={pathname} />
                <label
                  className="text-[11px] font-black text-[var(--dash-text-secondary)]"
                  htmlFor="dashboard-interface-language-mobile"
                >
                  {interfaceCopy.shell.dashboardLanguage}
                </label>
                <select
                  aria-label={interfaceCopy.shell.selectDashboardLanguage}
                  className="min-h-9 w-full rounded-md border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] px-2 text-[12px] font-black text-[var(--dash-text)] outline-none"
                  defaultValue={activeLanguage}
                  id="dashboard-interface-language-mobile"
                  name="language"
                  onChange={(event) => event.currentTarget.form?.requestSubmit()}
                >
                  {dashboardInterfaceLanguages.map((language) => (
                    <option key={language} value={language}>
                      {dashboardInterfaceLanguageNativeLabels[language]}
                    </option>
                  ))}
                </select>
              </form>
              <div className="my-0.5 border-t border-[var(--dash-border)]" />
              {menuRoutes.map((route) => (
                <a
                  aria-current={isActiveRoute(route.href) ? "page" : undefined}
                  className={`${ghostButtonClass} w-full justify-start`}
                  href={route.href}
                  key={route.href}
                >
                  {route.label}
                </a>
              ))}
              {showFounderAdmin ? (
                <a className={`${ghostButtonClass} w-full justify-start`} href="/admin">
                  {copy.pages.founder.title}
                </a>
              ) : null}
            </div>
          </details>
          <form
            action={updateDashboardInterfaceLanguageAction}
            className="hidden h-9 items-center rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] px-2 sm:flex sm:h-10"
          >
            <input name="redirectTo" type="hidden" value={pathname} />
            <label className="sr-only" htmlFor="dashboard-interface-language">
              {interfaceCopy.shell.selectDashboardLanguage}
            </label>
            <select
              aria-label={interfaceCopy.shell.selectDashboardLanguage}
              className="h-8 max-w-[10rem] bg-transparent px-1 text-[12px] font-black text-[var(--dash-text)] outline-none sm:h-9"
              defaultValue={activeLanguage}
              id="dashboard-interface-language"
              name="language"
              onChange={(event) => event.currentTarget.form?.requestSubmit()}
            >
              {dashboardInterfaceLanguages.map((language) => (
                <option key={language} value={language}>
                  {dashboardInterfaceLanguageNativeLabels[language]}
                </option>
              ))}
            </select>
          </form>
          <div className="hidden sm:block">
            <DashboardThemeSelector />
          </div>
          <form action={signOutAction}>
            <button
              className="biz-button-secondary inline-flex h-9 max-w-[5.5rem] items-center justify-center rounded-lg border px-2.5 text-[11px] font-bold shadow-sm sm:h-10 sm:max-w-[8rem] sm:px-3 sm:text-[13px]"
              title={userLabel}
              type="submit"
            >
              <span className="truncate whitespace-nowrap">{interfaceCopy.shell.signOut}</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
