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
 * Last Updated: 2026-07-16
 * Change Log:
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
 * ============================================================
 */

import type { DashboardShellCopy } from "./dashboard-shell";
import { languageShortLabels, supportedLanguages } from "@/lib/i18n/language";
import { usePathname } from "next/navigation";

import { signOutAction } from "@/server/actions/auth.actions";
import { updateWorkspaceLanguageAction } from "@/server/actions/business-configuration.actions";

import { CopyButton } from "./copy-button";
import { DashboardThemeSelector } from "./dashboard-theme";
import { buttonClass, ghostButtonClass } from "./dashboard-ui";

type DashboardTopbarProps = Readonly<{
  activeBusinessName: string;
  activeLanguage: string;
  businessId: string;
  businessSlug: string;
  quoteUrl: string;
  copy: DashboardShellCopy;
  showFounderAdmin?: boolean;
  userLabel: string;
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
  businessId,
  businessSlug,
  quoteUrl,
  copy,
  showFounderAdmin = false,
  userLabel,
}: DashboardTopbarProps) {
  const quotePath = `/quote/${businessSlug}`;
  const quotePreviewPath = `${quotePath}?preview=dashboard${
    activeLanguage === "fr-CA" ? "&language=fr-CA" : ""
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
    { href: "/dashboard/guide", label: copy.nav.guide },
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

        <div className="ml-auto flex min-w-0 items-center justify-end gap-1.5 sm:gap-2">
          <details className="group relative lg:hidden">
            <summary
              aria-label={copy.actions.moreActions}
              className={`${buttonClass} list-none cursor-pointer [&::-webkit-details-marker]:hidden`}
              title={copy.actions.moreActions}
            >
              <MoreIcon />
              <span className="hidden md:inline">{copy.actions.moreActions}</span>
            </summary>
            <div className="absolute right-0 top-11 z-30 grid w-[min(240px,calc(100vw-1.5rem))] gap-1.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] p-2.5 shadow-[0_18px_48px_rgba(2,6,23,0.18)]">
              <CopyButton
                className="!w-full !justify-start"
                failedLabel={copy.actions.copyFailed}
                label={copy.actions.copyQuoteLink}
                successLabel={copy.actions.copySuccess}
                value={quoteUrl}
              />
              <a
                className={`${buttonClass} w-full justify-start`}
                href={quotePreviewPath}
              >
                {copy.actions.previewQuotePage}
              </a>
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
            action={updateWorkspaceLanguageAction}
            className="hidden h-9 max-w-[11rem] items-center overflow-hidden rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] p-1 sm:flex sm:h-10"
          >
            <input name="businessId" type="hidden" value={businessId} />
            <input name="redirectTo" type="hidden" value={pathname} />
            {supportedLanguages.map((language) => (
              <button
                aria-pressed={activeLanguage === language}
                className={
                  activeLanguage === language
                    ? "h-8 whitespace-nowrap rounded-md bg-[var(--dash-primary)] px-2.5 text-[12px] font-black text-white shadow-sm"
                    : "h-8 whitespace-nowrap rounded-md px-2.5 text-[12px] font-bold text-[var(--dash-text-secondary)] transition hover:bg-[var(--dash-surface-muted)] hover:text-[var(--dash-text)]"
                }
                key={language}
                name="language"
                type="submit"
                value={language}
              >
                {languageShortLabels[language]}
              </button>
            ))}
          </form>
          <div className="hidden sm:block">
            <DashboardThemeSelector />
          </div>
          <a
            className={`${ghostButtonClass} hidden min-h-10 items-center justify-center px-2.5 lg:inline-flex`}
            href="/dashboard/guide"
          >
            {copy.nav.guide}
          </a>
          {showFounderAdmin ? (
            <a
              className={`${ghostButtonClass} hidden min-h-10 items-center justify-center border-[var(--dash-primary-border)] bg-[var(--dash-primary-soft)] px-2.5 text-[var(--dash-primary-strong)] lg:inline-flex`}
              href="/admin"
            >
              {copy.pages.founder.title}
            </a>
          ) : null}
          <form action={signOutAction}>
            <button
              className="biz-button-secondary inline-flex h-9 max-w-[5.5rem] items-center justify-center rounded-lg border px-2.5 text-[11px] font-bold shadow-sm sm:h-10 sm:max-w-[8rem] sm:px-3 sm:text-[13px]"
              title={userLabel}
              type="submit"
            >
              <span className="truncate whitespace-nowrap">{copy.actions.signOut}</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
