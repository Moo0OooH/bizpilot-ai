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

import { buttonClass } from "./dashboard-ui";

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
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-14 items-center gap-3 px-4">
        <button
          className="inline-flex h-8 min-w-0 max-w-[15rem] items-center gap-2 rounded-md border border-zinc-300 bg-white px-2.5 text-xs font-medium text-zinc-900 shadow-sm"
          type="button"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded bg-zinc-950 text-[10px] font-semibold text-white">
            BP
          </span>
          <span className="truncate">{activeBusinessName}</span>
          <span className="text-zinc-400">v</span>
        </button>

        <div className="hidden h-8 min-w-0 flex-1 items-center rounded-md border border-zinc-200 bg-zinc-50 px-2.5 text-xs text-zinc-500 md:flex">
          Search leads, actions, and setup
          <span className="ml-auto rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] text-zinc-400">
            /
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Link className={buttonClass} href={`/quote/${businessSlug}`}>
            Preview
          </Link>
          <Link className={buttonClass} href="/dashboard/leads">
            New action
          </Link>
          <button
            aria-label="Notifications"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-300 bg-white text-xs font-medium text-zinc-700 shadow-sm"
            type="button"
          >
            N
          </button>
          <form action={signOutAction}>
            <button
              className="inline-flex h-8 max-w-[8rem] items-center justify-center rounded-md border border-zinc-300 bg-white px-2.5 text-xs font-medium text-zinc-800 shadow-sm"
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
