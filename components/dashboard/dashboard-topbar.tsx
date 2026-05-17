/**
 * ============================================================
 * File: components/dashboard/dashboard-topbar.tsx
 * Project: BizPilot AI
 * Description: Renders the protected workspace topbar.
 * Role: Provides workspace context, search affordance, notifications, quick actions, and user controls.
 * Related:
 * - components/dashboard/dashboard-shell.tsx
 * - server/actions/auth.actions.ts
 * Author: MoOoH
 * Created: 2026-05-10
 * Last Updated: 2026-05-17
 * Change Log:
 * - 2026-05-10: Added SaaS workspace topbar.
 * - 2026-05-17: Tuned actions for owner attention and quote recovery.
 * - 2026-05-17: Added a persisted dashboard light/dark theme selector.
 * ============================================================
 */

import Link from "next/link";

import { signOutAction } from "@/server/actions/auth.actions";

import { DashboardThemeSelector } from "./dashboard-theme";
import { buttonClass, primaryButtonClass } from "./dashboard-ui";

type DashboardTopbarProps = Readonly<{
  activeBusinessName: string;
  businessSlug: string;
  userLabel: string;
}>;

export function DashboardTopbar({
  activeBusinessName,
  businessSlug,
  userLabel,
}: DashboardTopbarProps) {
  return (
    <header className="dashboard-topbar sticky top-0 z-20 border-b backdrop-blur">
      <div className="flex min-h-12 items-center gap-2 px-3 py-1.5 sm:gap-2.5 lg:px-5">
        <button
          className="dashboard-business-switcher inline-flex h-8 w-[138px] min-w-0 items-center gap-2 rounded-[9px] border px-2.5 text-sm font-medium shadow-sm sm:w-[160px]"
          type="button"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--dash-primary)] text-[10px] font-semibold text-white">
            BP
          </span>
          <span className="truncate">{activeBusinessName}</span>
          <span className="ml-auto text-slate-400">v</span>
        </button>

        <div className="dashboard-topbar-search hidden h-8 min-w-0 max-w-[580px] flex-1 items-center rounded-[9px] border px-3 text-sm md:flex">
          Search leads, follow-ups, and quote requests...
          <span className="ml-auto rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] text-slate-400">
            /
          </span>
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <DashboardThemeSelector />
          <Link className={`${buttonClass} hidden sm:inline-flex`} href={`/quote/${businessSlug}`}>
            Quote Link
          </Link>
          <Link className={primaryButtonClass} href="/dashboard/leads">
            Review
          </Link>
          <button
            aria-label="Notifications"
            className="biz-button-secondary inline-flex h-8 w-8 items-center justify-center rounded-[9px] border text-sm font-medium shadow-sm"
            type="button"
          >
            N
          </button>
          <form action={signOutAction}>
            <button
              className="biz-button-secondary inline-flex h-8 max-w-[5.5rem] items-center justify-center rounded-[9px] border px-3 text-sm font-medium shadow-sm sm:max-w-[8rem]"
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
