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
 * Last Updated: 2026-05-10
 * Change Log:
 * - 2026-05-10: Created reusable dashboard sidebar shell component.
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
        icon: "D",
        label: "Dashboard",
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
      { icon: "C", label: "Customers" },
      { icon: "K", label: "Calendar" },
      { icon: "A", label: "Analytics" },
    ],
  },
  {
    label: "Business setup",
    items: [
      {
        href: "/dashboard/configuration",
        icon: "B",
        label: "Business Configuration",
        match: (pathname) => pathname === "/dashboard/configuration",
      },
    ],
  },
  {
    label: "System",
    items: [
      { icon: "T", label: "Team" },
      { icon: "I", label: "Integrations" },
      { icon: "$", label: "Billing" },
      { icon: "G", label: "Settings" },
    ],
  },
];

function navClass(isActive: boolean, isDisabled: boolean): string {
  if (isDisabled) {
    return "flex h-8 items-center gap-2 rounded-md px-2 text-zinc-400";
  }

  if (isActive) {
    return "flex h-8 items-center gap-2 rounded-md bg-zinc-950 px-2 font-medium text-white shadow-sm";
  }

  return "flex h-8 items-center gap-2 rounded-md px-2 text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950";
}

function NavIcon({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-current/15 text-[10px] font-semibold">
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
    <aside className="sticky top-0 hidden h-screen border-r border-zinc-200 bg-white lg:flex lg:flex-col">
      <div className="border-b border-zinc-100 px-4 py-4">
        <p className="text-sm font-semibold tracking-normal text-zinc-950">
          BizPilot AI
        </p>
        <p className="mt-1 truncate text-xs text-zinc-500">
          Quote recovery workspace
        </p>
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4 text-xs">
        {navigationGroups.map((group) => (
          <div key={group.label}>
            <p className="px-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
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
      <div className="border-t border-zinc-100 p-3 text-xs">
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-2.5">
          <p className="font-medium text-zinc-950">{activeBusinessName}</p>
          <p className="mt-2 text-zinc-500">Signed in as</p>
          <p className="mt-0.5 break-words text-zinc-800">{userLabel}</p>
        </div>
      </div>
    </aside>
  );
}
