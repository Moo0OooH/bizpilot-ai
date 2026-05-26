"use client";

/**
 * ============================================================
 * File: components/dashboard/dashboard-topbar.tsx
 * Project: BizPilot AI
 * Description: Renders the protected workspace topbar.
 * Role: Provides route-aware command-center page context, quote-link actions, theme selector, and user controls.
 * Related:
 * - components/dashboard/dashboard-shell.tsx
 * - server/actions/auth.actions.ts
 * Author: MoOoH
 * Created: 2026-05-10
 * Last Updated: 2026-05-26
 * Change Log:
 * - 2026-05-19: Matched approved index.html topbar hierarchy: page title left, focused actions right, no global search clutter.
 * - 2026-05-23: Localized route context and actions through the central dashboard copy dictionary.
 * - 2026-05-26: Tightened responsive controls and made founder entry visible on desktop dashboards.
 * ============================================================
 */

import type { DashboardShellCopy } from "./dashboard-shell";
import { languageShortLabels, supportedLanguages } from "@/lib/i18n/language";
import Link from "next/link";
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
  copy: DashboardShellCopy;
  showFounderAdmin?: boolean;
  userLabel: string;
}>;

type PageContext = Readonly<{
  subtitle: string;
  title: string;
}>;

function getPageContext(
  pathname: string,
  copy: DashboardShellCopy,
): PageContext {
  if (pathname.startsWith("/dashboard/leads/")) {
    return copy.pages.leadDetail;
  }

  if (pathname.startsWith("/dashboard/leads")) {
    return copy.pages.leads;
  }

  if (pathname === "/dashboard/configuration" || pathname === "/dashboard/quote-setup") {
    return copy.pages.configuration;
  }

  if (pathname === "/dashboard/business-profile") {
    return copy.pages.businessProfile;
  }

  if (pathname === "/dashboard/settings") {
    return copy.pages.settings;
  }

  if (pathname === "/founder" || pathname === "/admin") {
    return copy.pages.founder;
  }

  return copy.pages.dashboard;
}

export function DashboardTopbar({
  activeBusinessName,
  activeLanguage,
  businessId,
  businessSlug,
  copy,
  showFounderAdmin = false,
  userLabel,
}: DashboardTopbarProps) {
  const quotePath = `/quote/${businessSlug}`;
  const pathname = usePathname();
  const pageContext = getPageContext(pathname, copy);

  return (
    <header className="dashboard-topbar sticky top-0 z-20 border-b backdrop-blur">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 px-3 py-2 sm:min-h-[58px] sm:flex-nowrap sm:gap-3 sm:px-5 md:px-6 lg:px-5">
        <div className="min-w-0 flex-1 basis-[12rem]">
          <h1 className="truncate text-[16px] font-extrabold leading-[1.2] text-[var(--dash-text)] sm:text-[17px]">
            {pageContext.title}
          </h1>
          <p className="mt-0.5 hidden truncate text-[11px] leading-4 text-[var(--dash-text-muted)] sm:block">
            {pageContext.subtitle}
          </p>
        </div>

        <div className="flex min-w-0 basis-full items-center justify-between gap-2 sm:basis-auto sm:justify-end">
          <CopyButton
            className="!hidden md:!inline-flex"
            label={copy.actions.copyQuoteLink}
            value={quotePath}
          />
          <Link className={`${buttonClass} !hidden lg:!inline-flex`} href={quotePath}>
            {copy.actions.previewQuotePage}
          </Link>
          {showFounderAdmin ? (
            <Link className={`${ghostButtonClass} !hidden lg:!inline-flex`} href="/admin">
              {copy.pages.founder.title}
            </Link>
          ) : null}
          <form
            action={updateWorkspaceLanguageAction}
            className="flex h-9 items-center rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] p-1 sm:h-10"
          >
            <input name="businessId" type="hidden" value={businessId} />
            <input name="redirectTo" type="hidden" value={pathname} />
            {supportedLanguages.map((language) => (
              <button
                aria-pressed={activeLanguage === language}
                className={
                  activeLanguage === language
                    ? "h-8 rounded-md bg-[var(--dash-primary)] px-2.5 text-[12px] font-black text-white shadow-sm"
                    : "h-8 rounded-md px-2.5 text-[12px] font-bold text-[var(--dash-text-secondary)] transition hover:bg-[var(--dash-surface-muted)] hover:text-[var(--dash-text)]"
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
          <DashboardThemeSelector />
          <div className="hidden min-w-0 max-w-[190px] rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] px-3 py-2 text-[13px] font-bold text-[var(--dash-text)] xl:block">
            <span className="block truncate">{activeBusinessName}</span>
          </div>
          <form action={signOutAction}>
            <button
              className="biz-button-secondary inline-flex h-9 max-w-[5.5rem] items-center justify-center rounded-lg border px-3 text-[12px] font-bold shadow-sm sm:h-10 sm:max-w-[8rem] sm:text-[13px]"
              title={userLabel}
              type="submit"
            >
              <span className="truncate">{copy.actions.signOut}</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
