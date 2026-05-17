"use client";

/**
 * ============================================================
 * File: components/dashboard/dashboard-sidebar.tsx
 * Project: BizPilot AI
 * Description: Renders the shared protected dashboard sidebar navigation.
 * Role: Provides route-aware app navigation for protected dashboard pages.
 * Related:
 * - components/dashboard/dashboard-shell.tsx
 * - app/(dashboard)/layout.tsx
 * Author: MoOoH
 * Created: 2026-05-10
 * Last Updated: 2026-05-17
 * Change Log:
 * - 2026-05-10: Created reusable dashboard sidebar shell component.
 * - 2026-05-17: Tuned navigation for calm quote recovery positioning.
 * ============================================================
 */

import Link from "next/link";
import { usePathname } from "next/navigation";

type DashboardSidebarProps = Readonly<{
  activeBusinessName: string;
  userLabel: string;
}>;

type NavigationItem = Readonly<{
  href?: string;
  icon: string;
  label: string;
  match?: (pathname: string) => boolean;
}>;

type NavigationGroup = Readonly<{
  items: NavigationItem[];
  label: string;
}>;

const navigationGroups: NavigationGroup[] = [
  {
    label: "Overview",
    items: [
      {
        href: "/dashboard",
        icon: "O",
        label: "Overview",
        match: (pathname) => pathname === "/dashboard",
      },
    ],
  },
  {
    label: "Workspace",
    items: [
      {
        href: "/dashboard/leads",
        icon: "L",
        label: "Leads",
        match: (pathname) => pathname.startsWith("/dashboard/leads"),
      },
    ],
  },
  {
    label: "Business setup",
    items: [
      {
        href: "/dashboard/configuration",
        icon: "Q",
        label: "Quote Setup",
        match: (pathname) => pathname === "/dashboard/configuration",
      },
    ],
  },
];

function navClass(isActive: boolean, isDisabled: boolean): string {
  if (isDisabled) {
    return "flex h-8 items-center gap-2.5 rounded-[10px] px-3 text-white/35";
  }

  if (isActive) {
    return "flex h-8 items-center gap-2.5 rounded-[10px] bg-[var(--dash-primary)] px-3 font-medium text-white shadow-sm";
  }

  return "flex h-8 items-center gap-2.5 rounded-[10px] px-3 text-slate-300 transition hover:bg-white/[0.06] hover:text-white";
}

function NavIcon({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-current/15 text-[11px] font-semibold">
      {children}
    </span>
  );
}

export function DashboardSidebar({
  activeBusinessName,
  userLabel,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  return (
    <aside className="dashboard-sidebar sticky top-0 hidden h-screen border-r text-white lg:flex lg:flex-col">
      <div className="border-b border-white/10 px-4 py-3.5">
        <p className="text-base font-semibold tracking-normal text-white">
          BizPilot
        </p>
        <p className="mt-1 truncate text-xs text-white/55">
          Calm quote recovery workspace
        </p>
      </div>
      <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-3.5 text-sm">
        {navigationGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 text-xs font-semibold uppercase tracking-wide text-white/45">
              {group.label}
            </p>
            <div className="mt-2 grid gap-1">
              {group.items.map((item) => {
                const isActive = item.match?.(pathname) ?? false;
                const className = navClass(isActive, !item.href);
                const content = (
                  <>
                    <NavIcon>{item.icon}</NavIcon>
                    <span className="truncate">{item.label}</span>
                  </>
                );

                return item.href ? (
                  <Link className={className} href={item.href} key={item.label}>
                    {content}
                  </Link>
                ) : (
                  <span className={className} key={item.label}>
                    {content}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="space-y-3 border-t border-white/10 p-3 text-xs">
        <div className="rounded-[12px] border border-white/10 bg-white/[0.05] p-3">
          <p className="font-medium text-white">{activeBusinessName}</p>
          <p className="mt-2 text-white/50">Signed in as</p>
          <p className="mt-0.5 break-words text-white/80">{userLabel}</p>
        </div>
      </div>
    </aside>
  );
}
