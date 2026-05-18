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
 * Last Updated: 2026-05-18
 * Change Log:
 * - 2026-05-10: Created reusable dashboard sidebar shell component.
 * - 2026-05-17: Tuned navigation for calm quote recovery positioning.
 * - 2026-05-18: Rebalanced sidebar width, active states, and account treatment.
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
    return "flex h-9 items-center gap-2.5 rounded-[11px] px-3 text-white/35";
  }

  if (isActive) {
    return "flex h-9 items-center gap-2.5 rounded-[11px] border border-[#17D492]/18 bg-[#17D492]/14 px-3 font-semibold text-[#F5F7FA] shadow-[0_10px_26px_rgba(23,212,146,0.07)]";
  }

  return "flex h-9 items-center gap-2.5 rounded-[11px] px-3 text-[rgba(245,247,250,0.62)] transition hover:bg-[rgba(23,212,146,0.08)] hover:text-[#F5F7FA]";
}

function NavIcon({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] border border-current/15 text-[12px] font-semibold">
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
    <aside className="dashboard-sidebar sticky top-0 hidden h-screen w-[260px] border-r text-white lg:flex lg:flex-col">
      <div className="border-b border-white/10 px-5 py-4">
        <p className="text-lg font-semibold tracking-normal text-white">
          BizPilot
        </p>
        <p className="mt-1.5 truncate text-[13px] text-white/58">
          Calm quote recovery workspace
        </p>
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto px-3.5 py-5 text-[13px]">
        {navigationGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 text-[12px] font-semibold uppercase tracking-wide text-white/42">
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
      <div className="space-y-2 border-t border-white/10 p-3 text-[13px]">
        <div className="rounded-[14px] border border-white/[0.08] bg-white/[0.03] p-3">
          <p className="truncate font-semibold text-white">{activeBusinessName}</p>
          <p className="mt-1.5 text-[12px] text-white/42">Signed in as</p>
          <p className="mt-0.5 break-words text-[12px] text-white/68">{userLabel}</p>
        </div>
      </div>
    </aside>
  );
}
