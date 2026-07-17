"use client";

/**
 * ============================================================
 * File: components/dashboard/dashboard-sidebar.tsx
 * Project: BizPilot AI
 * Description: Renders the shared protected dashboard mobile navigation.
 * Role: Keeps the five primary owner destinations available on compact viewports without duplicating desktop navigation.
 * Related:
 * - components/dashboard/dashboard-shell.tsx
 * - components/dashboard/dashboard-topbar.tsx
 * - app/(dashboard)/layout.tsx
 * Author: MoOoH
 * Created: 2026-05-10
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Removed the redundant fixed desktop sidebar after promoting the centered top navigation to the single desktop route map.
 * - 2026-07-16: Switched protected route destinations to resilient full-page transitions.
 * - 2026-07-14: Reduced primary navigation to five owner tasks and made Settings discoverable in the mobile bar.
 * ============================================================
 */

import { usePathname } from "next/navigation";

import type { DashboardShellCopy } from "./dashboard-shell";

type DashboardSidebarProps = Readonly<{
  copy: DashboardShellCopy;
}>;

type DashboardNavIconName =
  | "business"
  | "leads"
  | "overview"
  | "quote"
  | "settings";

type NavigationItem = Readonly<{
  href: string;
  icon: DashboardNavIconName;
  label: string;
  match: (pathname: string) => boolean;
}>;

function getOwnerNavigation(copy: DashboardShellCopy): NavigationItem[] {
  return [
    {
      href: "/dashboard",
      icon: "overview",
      label: copy.nav.overview,
      match: (pathname) => pathname === "/dashboard",
    },
    {
      href: "/dashboard/leads",
      icon: "leads",
      label: copy.nav.leads,
      match: (pathname) => pathname.startsWith("/dashboard/leads"),
    },
    {
      href: "/dashboard/configuration",
      icon: "quote",
      label: copy.nav.quoteSetup,
      match: (pathname) =>
        pathname === "/dashboard/configuration" ||
        pathname === "/dashboard/quote-setup",
    },
    {
      href: "/dashboard/business-profile",
      icon: "business",
      label: copy.nav.businessProfile,
      match: (pathname) => pathname === "/dashboard/business-profile",
    },
    {
      href: "/dashboard/settings",
      icon: "settings",
      label: copy.nav.settings,
      match: (pathname) => pathname === "/dashboard/settings",
    },
  ];
}

function DashboardNavIcon({ name }: Readonly<{ name: DashboardNavIconName }>) {
  const paths: Record<DashboardNavIconName, React.ReactNode> = {
    business: (
      <>
        <path d="M5 20V7h14v13" />
        <path d="M8 20v-5h8v5M8 10h.01M12 10h.01M16 10h.01" />
      </>
    ),
    leads: (
      <>
        <path d="M5 6h14M5 12h10M5 18h7" />
        <path d="M18 15l2 2-2 2" />
      </>
    ),
    overview: (
      <>
        <path d="M4 13h6V4H4zM14 20h6V4h-6z" />
        <path d="M4 20h6v-3H4z" />
      </>
    ),
    quote: (
      <>
        <path d="M6 4h12v16H6z" />
        <path d="M9 8h6M9 12h6M9 16h3" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3M12 18v3M4.8 4.8l2.1 2.1M17.1 17.1l2.1 2.1M3 12h3M18 12h3M4.8 19.2l2.1-2.1M17.1 6.9l2.1-2.1" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden
      className="h-[15px] w-[15px]"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {paths[name]}
    </svg>
  );
}

function MobileNavLink({
  item,
  pathname,
}: Readonly<{ item: NavigationItem; pathname: string }>) {
  const isActive = item.match(pathname);

  return (
    <a
      aria-current={isActive ? "page" : undefined}
      className={
        isActive
          ? "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-lg bg-[var(--dash-primary-soft)] px-1.5 py-1.5 text-[var(--dash-primary)]"
          : "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-lg px-1.5 py-1.5 text-[var(--dash-text-muted)]"
      }
      href={item.href}
    >
      <DashboardNavIcon name={item.icon} />
      <span className="max-w-full truncate text-[10px] font-bold leading-none">
        {item.label}
      </span>
    </a>
  );
}

export function DashboardSidebar({ copy }: DashboardSidebarProps) {
  const pathname = usePathname();
  const navigation = getOwnerNavigation(copy);

  return (
    <nav
      aria-label={copy.nav.groupCommand}
      className="dashboard-mobile-nav fixed inset-x-0 bottom-0 z-30 border-t border-[var(--dash-border)] bg-[var(--dash-bg)]/95 px-2 py-2 shadow-[0_-10px_28px_rgba(0,0,0,0.18)] backdrop-blur lg:hidden"
    >
      <div className="mx-auto flex max-w-xl gap-1">
        {navigation.map((item) => (
          <MobileNavLink item={item} key={item.href} pathname={pathname} />
        ))}
      </div>
    </nav>
  );
}
