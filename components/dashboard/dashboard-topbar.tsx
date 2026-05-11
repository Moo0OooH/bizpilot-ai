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
 * Last Updated: 2026-05-10
 * Change Log:
 * - 2026-05-10: Added SaaS workspace topbar.
 * ============================================================
 */

import Link from "next/link";

import { signOutAction } from "@/server/actions/auth.actions";

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
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-14 items-center gap-3 px-5">
        <button
          className="inline-flex h-9 w-[170px] min-w-0 items-center gap-2 rounded-[10px] border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 shadow-sm"
          type="button"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-950 text-[10px] font-semibold text-white">
            BP
          </span>
          <span className="truncate">{activeBusinessName}</span>
          <span className="ml-auto text-slate-400">v</span>
        </button>

        <div className="hidden h-9 min-w-0 max-w-[640px] flex-1 items-center rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 md:flex">
          Search leads, actions, and setup...
          <span className="ml-auto rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] text-slate-400">
            /
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Link className={buttonClass} href={`/quote/${businessSlug}`}>
            Preview
          </Link>
          <Link className={primaryButtonClass} href="/dashboard/leads">
            Actions
          </Link>
          <button
            aria-label="Notifications"
            className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-sm"
            type="button"
          >
            N
          </button>
          <form action={signOutAction}>
            <button
              className="inline-flex h-9 max-w-[8rem] items-center justify-center rounded-[10px] border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 shadow-sm"
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
