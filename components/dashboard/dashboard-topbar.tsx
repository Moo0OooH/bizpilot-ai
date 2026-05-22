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
 * Last Updated: 2026-05-19
 * Change Log:
 * - 2026-05-19: Matched approved index.html topbar hierarchy: page title left, focused actions right, no global search clutter.
 * ============================================================
 */

import Link from "next/link";
import { usePathname } from "next/navigation";

import { signOutAction } from "@/server/actions/auth.actions";

import { CopyButton } from "./copy-button";
import { DashboardThemeSelector } from "./dashboard-theme";
import { buttonClass } from "./dashboard-ui";

type DashboardTopbarProps = Readonly<{
  activeBusinessName: string;
  businessSlug: string;
  userLabel: string;
}>;

type PageContext = Readonly<{
  subtitle: string;
  title: string;
}>;

function getPageContext(pathname: string): PageContext {
  if (pathname.startsWith("/dashboard/leads/")) {
    return {
      subtitle: "Lead details, missing info, and owner-reviewed AI drafts",
      title: "Lead Response Desk",
    };
  }

  if (pathname.startsWith("/dashboard/leads")) {
    return {
      subtitle: "Prioritize quote requests before customers move on",
      title: "Lead Recovery Queue",
    };
  }

  if (pathname === "/dashboard/configuration" || pathname === "/dashboard/quote-setup") {
    return {
      subtitle: "Public quote page, form questions, services, AI rules, and privacy",
      title: "Quote Setup",
    };
  }

  if (pathname === "/dashboard/business-profile") {
    return {
      subtitle: "Business identity and operating context",
      title: "Business Profile",
    };
  }

  if (pathname === "/dashboard/settings") {
    return {
      subtitle: "Workspace, account, theme, and MVP boundaries",
      title: "Settings",
    };
  }

  if (pathname === "/founder") {
    return {
      subtitle: "Phase 18B pilot tracking shell",
      title: "Founder Admin Console",
    };
  }

  return {
    subtitle: "Today’s lead recovery snapshot",
    title: "Dashboard",
  };
}

export function DashboardTopbar({
  activeBusinessName,
  businessSlug,
  userLabel,
}: DashboardTopbarProps) {
  const quotePath = `/quote/${businessSlug}`;
  const pathname = usePathname();
  const pageContext = getPageContext(pathname);

  return (
    <header className="dashboard-topbar sticky top-0 z-20 border-b backdrop-blur">
      <div className="flex min-h-[60px] min-w-0 items-center justify-between gap-3 px-4 py-2 sm:px-5 md:px-6 lg:px-[28px]">
        <div className="min-w-0">
          <h1 className="truncate text-[16px] font-extrabold leading-[1.2] tracking-[-0.02em] text-[var(--dash-text)] sm:text-[17px]">
            {pageContext.title}
          </h1>
          <p className="mt-0.5 hidden truncate text-[11px] leading-4 text-[var(--dash-text-muted)] sm:block">
            {pageContext.subtitle}
          </p>
        </div>

        <div className="flex min-w-0 shrink-0 items-center justify-end gap-2">
          <CopyButton className="hidden md:inline-flex" label="Copy quote link" value={quotePath} />
          <Link className={`${buttonClass} hidden lg:inline-flex`} href={quotePath}>
            Preview quote page
          </Link>
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
              <span className="truncate">Sign out</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
