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
 * Last Updated: 2026-05-23
 * Change Log:
 * - 2026-05-19: Matched approved index.html topbar hierarchy: page title left, focused actions right, no global search clutter.
 * - 2026-05-23: Localized route context and actions through the central dashboard copy dictionary.
 * ============================================================
 */

import type { BizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import { languageShortLabels, supportedLanguages } from "@/lib/i18n/language";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { signOutAction } from "@/server/actions/auth.actions";
import { setInterfaceLanguageAction } from "@/server/actions/business-configuration.actions";

import { CopyButton } from "./copy-button";
import { DashboardThemeSelector } from "./dashboard-theme";
import { buttonClass, ghostButtonClass } from "./dashboard-ui";

type DashboardTopbarProps = Readonly<{
  activeBusinessName: string;
  activeLanguage: string;
  businessId: string;
  businessSlug: string;
  copy: BizPilotCopy["dashboard"];
  showFounderAdmin?: boolean;
  userLabel: string;
}>;

type PageContext = Readonly<{
  subtitle: string;
  title: string;
}>;

function getPageContext(
  pathname: string,
  copy: BizPilotCopy["dashboard"],
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
      <div className="flex min-h-[64px] min-w-0 items-center justify-between gap-3 px-4 py-2 sm:px-5 md:px-6 lg:px-[28px]">
        <div className="min-w-0">
          <h1 className="truncate text-[16px] font-extrabold leading-[1.2] tracking-[-0.02em] text-[var(--dash-text)] sm:text-[17px]">
            {pageContext.title}
          </h1>
          <p className="mt-0.5 hidden truncate text-[11px] leading-4 text-[var(--dash-text-muted)] sm:block">
            {pageContext.subtitle}
          </p>
        </div>

        <div className="flex min-w-0 shrink-0 items-center justify-end gap-2">
          <CopyButton
            className="hidden md:inline-flex"
            label={copy.actions.copyQuoteLink}
            value={quotePath}
          />
          <Link className={`${buttonClass} hidden lg:inline-flex`} href={quotePath}>
            {copy.actions.previewQuotePage}
          </Link>
          {showFounderAdmin ? (
            <Link className={`${ghostButtonClass} hidden xl:inline-flex`} href="/admin">
              {copy.pages.founder.title}
            </Link>
          ) : null}
          <form
            action={setInterfaceLanguageAction}
            className="hidden h-10 items-center rounded-[13px] border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] p-1 sm:flex"
          >
            <input name="businessId" type="hidden" value={businessId} />
            <input name="redirectTo" type="hidden" value={pathname} />
            {supportedLanguages.map((language) => (
              <button
                aria-pressed={activeLanguage === language}
                className={
                  activeLanguage === language
                    ? "h-8 rounded-[10px] bg-[var(--dash-primary)] px-2.5 text-[12px] font-black text-[#03130c]"
                    : "h-8 rounded-[10px] px-2.5 text-[12px] font-bold text-[var(--dash-text-secondary)]"
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
          <div className="hidden min-w-0 max-w-[210px] rounded-[13px] border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] px-3 py-2 text-[13px] font-bold text-[var(--dash-text)] xl:block">
            <span className="block truncate">{activeBusinessName}</span>
          </div>
          <form action={signOutAction}>
            <button
              className="biz-button-secondary inline-flex h-10 max-w-[5.5rem] items-center justify-center rounded-[13px] border px-3 text-[13px] font-bold shadow-sm sm:max-w-[8rem]"
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
