"use client";

/**
 * ============================================================
 * File: components/dashboard/dashboard-sidebar.tsx
 * Project: BizPilot AI
 * Description: Renders complete grouped owner navigation on desktop and the five primary tasks on mobile.
 * Role: Keeps every owner route, Guide, account identity, and authorized Founder Admin entry visible without duplicating desktop navigation.
 * Related:
 * - components/dashboard/dashboard-shell.tsx
 * - components/dashboard/dashboard-topbar.tsx
 * - app/(dashboard)/layout.tsx
 * - app/admin/page.tsx
 * Author: MoOoH
 * Created: 2026-05-10
 * Last Updated: 2026-07-21
 * Change Log:
 * - 2026-07-17: Filtered only the allowlisted Reports and Guide destinations from server-validated display preferences.
 * - 2026-07-16: Added the role-safe owner Reports destination while retaining five focused mobile tasks.
 * - 2026-07-16: Restored the professional grouped desktop sidebar and added an explicit authorized Founder Admin destination.
 * - 2026-07-16: Kept resilient native navigation and a focused five-task mobile bar.
 * - 2026-07-21: Added the Premium Operations route and logical RTL sidebar placement.
 * ============================================================
 */

import { usePathname } from "next/navigation";

import type { DashboardShellCopy } from "./dashboard-shell";
import type { OptionalDashboardSection } from "@/lib/dashboard-section-visibility";

type DashboardSidebarProps = Readonly<{
  activeBusinessName: string;
  copy: DashboardShellCopy;
  showFounderAdmin?: boolean;
  userLabel: string;
  visibleOptionalSections: readonly OptionalDashboardSection[];
}>;

type DashboardNavIconName =
  | "admin"
  | "business"
  | "guide"
  | "leads"
  | "operations"
  | "overview"
  | "quote"
  | "reports"
  | "settings";

type NavigationItem = Readonly<{
  href: string;
  icon: DashboardNavIconName;
  label: string;
  match: (pathname: string) => boolean;
  optionalSection?: OptionalDashboardSection;
}>;

type NavigationGroup = Readonly<{
  items: readonly NavigationItem[];
  label: string;
}>;

function getOwnerNavigation(
  copy: DashboardShellCopy,
  visibleOptionalSections: readonly OptionalDashboardSection[],
): NavigationGroup[] {
  const groups: NavigationGroup[] = [
    {
      label: copy.nav.groupCommand,
      items: [
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
          href: "/dashboard/operations",
          icon: "operations",
          label: copy.nav.premiumOperations,
          match: (pathname) => pathname === "/dashboard/operations",
        },
        {
          href: "/dashboard/reports",
          icon: "reports",
          label: copy.nav.reports,
          match: (pathname) => pathname === "/dashboard/reports",
          optionalSection: "reports",
        },
      ],
    },
    {
      label: copy.nav.groupSetup,
      items: [
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
      ],
    },
    {
      label: copy.nav.groupControl,
      items: [
        {
          href: "/dashboard/settings",
          icon: "settings",
          label: copy.nav.settings,
          match: (pathname) => pathname === "/dashboard/settings",
        },
        {
          href: "/dashboard/guide",
          icon: "guide",
          label: copy.nav.guide,
          match: (pathname) => pathname === "/dashboard/guide",
          optionalSection: "guide",
        },
      ],
    },
  ];

  return groups.map((group) => ({
    ...group,
    items: group.items.filter(
      (item) =>
        !item.optionalSection ||
        visibleOptionalSections.includes(item.optionalSection),
    ),
  }));
}

function DashboardNavIcon({ name }: Readonly<{ name: DashboardNavIconName }>) {
  const paths: Record<DashboardNavIconName, React.ReactNode> = {
    admin: (
      <>
        <path d="M4 20V8l8-4 8 4v12" />
        <path d="M8 20v-6h8v6M9 9h.01M12 9h.01M15 9h.01" />
      </>
    ),
    business: (
      <>
        <path d="M5 20V7h14v13" />
        <path d="M8 20v-5h8v5M8 10h.01M12 10h.01M16 10h.01" />
      </>
    ),
    guide: (
      <>
        <path d="M6 4h10a2 2 0 0 1 2 2v14H8a2 2 0 0 1-2-2z" />
        <path d="M10 8h4M10 12h5M10 16h3" />
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
    operations: (
      <>
        <path d="M5 5h14v14H5z" />
        <path d="M8 9h8M8 13h5M8 17h3" />
      </>
    ),
    quote: (
      <>
        <path d="M6 4h12v16H6z" />
        <path d="M9 8h6M9 12h6M9 16h3" />
      </>
    ),
    reports: (
      <>
        <path d="M5 20V11M12 20V4M19 20v-6" />
        <path d="M3 20h18" />
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

function navClass(isActive: boolean, isAdmin = false): string {
  if (isActive || isAdmin) {
    return "flex min-h-10 items-center gap-3 rounded-lg border border-[var(--dash-primary-border)] bg-[var(--dash-primary-soft)] px-3 font-black text-[var(--dash-primary-strong)] transition hover:border-[var(--dash-primary)]";
  }

  return "flex min-h-10 items-center gap-3 rounded-lg border border-transparent px-3 font-bold text-[var(--dash-text-secondary)] transition hover:border-[var(--dash-border)] hover:bg-[var(--dash-surface-muted)] hover:text-[var(--dash-text)]";
}

function NavIcon({
  active,
  name,
}: Readonly<{ active: boolean; name: DashboardNavIconName }>) {
  return (
    <span
      className={
        active
          ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--dash-primary)] text-white"
          : "flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--dash-surface-muted)] text-[var(--dash-text-secondary)]"
      }
    >
      <DashboardNavIcon name={name} />
    </span>
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

export function DashboardSidebar({
  activeBusinessName,
  copy,
  showFounderAdmin = false,
  userLabel,
  visibleOptionalSections,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const navigation = getOwnerNavigation(copy, visibleOptionalSections);
  const mobileNavigation = navigation
    .flatMap((group) => group.items)
    .filter(
      (item) =>
        item.href !== "/dashboard/guide" &&
        item.href !== "/dashboard/reports" &&
        item.href !== "/dashboard/operations",
    );

  return (
    <>
      <aside className="dashboard-sidebar sticky top-0 hidden h-svh w-[240px] border-e px-3.5 py-4 lg:flex lg:flex-col">
        <a
          className="flex items-center gap-3 border-b border-[var(--dash-border)] px-2 pb-4"
          href="/dashboard"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--dash-primary)] text-[16px] font-black text-white">
            B
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[15px] font-black text-[var(--dash-text)]">
              BizPilot AI
            </span>
            <span className="mt-0.5 block truncate text-[12px] text-[var(--dash-text-muted)]">
              {copy.nav.workspaceSubtitle}
            </span>
          </span>
        </a>

        <nav className="mt-4 min-h-0 flex-1 space-y-4 overflow-y-auto pe-1 text-[13px]">
          {navigation.map((group) => (
            <section key={group.label}>
              <p className="mx-2.5 mb-2 text-[11px] font-black uppercase tracking-[0.08em] text-[var(--dash-text-muted)]">
                {group.label}
              </p>
              <div className="grid gap-1.5">
                {group.items.map((item) => {
                  const isActive = item.match(pathname);
                  return (
                    <a
                      aria-current={isActive ? "page" : undefined}
                      className={navClass(isActive)}
                      href={item.href}
                      key={item.href}
                    >
                      <NavIcon active={isActive} name={item.icon} />
                      <span className="truncate">{item.label}</span>
                    </a>
                  );
                })}
              </div>
            </section>
          ))}
        </nav>

        <div className="mt-3 grid gap-3">
          {showFounderAdmin ? (
            <a className={navClass(false, true)} href="/admin">
              <NavIcon active name="admin" />
              <span className="min-w-0">
                <span className="block truncate">{copy.pages.founder.title}</span>
                <span className="mt-0.5 block truncate text-[10px] font-bold text-[var(--dash-text-muted)]">
                  {copy.pages.founder.subtitle}
                </span>
              </span>
            </a>
          ) : null}
          <div
            className="flex items-center gap-2.5 border-t border-[var(--dash-border)] px-2 pt-3 text-[12px]"
            title={userLabel}
          >
            <span
              aria-hidden
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--dash-primary-soft)] text-[11px] font-black text-[var(--dash-primary)]"
            >
              {activeBusinessName.charAt(0).toUpperCase()}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-black text-[var(--dash-text)]">
                {activeBusinessName}
              </span>
              <span className="mt-0.5 block truncate text-[var(--dash-text-muted)]">
                {userLabel}
              </span>
            </span>
          </div>
        </div>
      </aside>

      <nav
        aria-label={copy.nav.groupCommand}
        className="dashboard-mobile-nav fixed inset-x-0 bottom-0 z-30 border-t border-[var(--dash-border)] bg-[var(--dash-bg)]/95 px-2 py-2 shadow-[0_-10px_28px_rgba(0,0,0,0.18)] backdrop-blur lg:hidden"
      >
        <div className="mx-auto flex max-w-xl gap-1">
          {mobileNavigation.map((item) => (
            <MobileNavLink item={item} key={item.href} pathname={pathname} />
          ))}
        </div>
      </nav>
    </>
  );
}
