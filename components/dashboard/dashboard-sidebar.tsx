"use client";

/**
 * ============================================================
 * File: components/dashboard/dashboard-sidebar.tsx
 * Project: BizPilot AI
 * Description: Renders the shared protected dashboard sidebar navigation.
 * Role: Provides route-aware app navigation for the Quote Recovery Command Center.
 * Related:
 * - components/dashboard/dashboard-shell.tsx
 * - app/(dashboard)/layout.tsx
 * Author: MoOoH
 * Created: 2026-05-10
 * Last Updated: 2026-06-18
 * Change Log:
 * - 2026-05-19: Matched approved index.html sidebar rhythm, brand block, active states, mobile nav, and quote-link readiness footer.
 * - 2026-05-23: Localized sidebar labels from the central BizPilot copy dictionary.
 * - 2026-05-26: Replaced letter-only navigation markers with consistent inline dashboard icons.
 * - 2026-06-18: Updated desktop sidebar height to svh for responsive shell readiness.
 * ============================================================
 */

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { DashboardShellCopy } from "./dashboard-shell";

import { CopyButton } from "./copy-button";
import { StatusBadge } from "./dashboard-ui";

type DashboardSidebarProps = Readonly<{
  activeBusinessName: string;
  businessSlug: string;
  copy: DashboardShellCopy;
  userLabel: string;
}>;

type NavigationItem = Readonly<{
  href: string;
  icon: DashboardNavIconName;
  label: string;
  match?: (pathname: string) => boolean;
}>;

type NavigationGroup = Readonly<{
  items: NavigationItem[];
  label: string;
}>;

type DashboardNavIconName =
  | "business"
  | "leads"
  | "overview"
  | "quote"
  | "settings";

function getOwnerNavigation(copy: DashboardShellCopy): NavigationGroup[] {
  return [
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
      ],
    },
  ];
}

function navClass(isActive: boolean): string {
  if (isActive) {
    return "flex min-h-10 items-center gap-3 rounded-lg border border-[var(--dash-primary)] bg-[var(--dash-primary-soft)] px-3 font-bold text-[var(--dash-text)]";
  }

  return "flex min-h-10 items-center gap-3 rounded-lg border border-transparent px-3 font-bold text-[var(--dash-text-secondary)] transition hover:border-[var(--dash-border)] hover:bg-[var(--dash-surface-muted)] hover:text-[var(--dash-text)]";
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

function NavIcon({
  active,
  name,
}: Readonly<{ active: boolean; name: DashboardNavIconName }>) {
  return (
    <span
      className={
        active
          ? "flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-md bg-[var(--dash-primary)] text-white"
          : "flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-md bg-[var(--dash-surface-muted)] text-[var(--dash-text-secondary)]"
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
  const isActive = item.match?.(pathname) ?? pathname === item.href;

  return (
    <Link
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
    </Link>
  );
}

export function DashboardSidebar({
  activeBusinessName,
  businessSlug,
  copy,
  userLabel,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const quotePath = `/quote/${businessSlug}`;
  const navigation = getOwnerNavigation(copy);
  const mobileNavigation = navigation
    .flatMap((group) => group.items)
    .slice(0, 5);

  return (
    <>
      <aside className="dashboard-sidebar sticky top-0 hidden h-svh w-[224px] border-r px-3.5 py-4 lg:flex lg:flex-col">
        <Link
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
        </Link>

        <nav className="mt-4 flex-1 space-y-4 overflow-y-auto text-[13px]">
          {navigation.map((group) => (
            <div key={group.label}>
              <p className="mx-2.5 mb-2 text-[11px] font-black uppercase tracking-[0.08em] text-[var(--dash-text-muted)]">
                {group.label}
              </p>
              <div className="grid gap-1.5">
                {group.items.map((item) => {
                  const isActive =
                    item.match?.(pathname) ?? pathname === item.href;

                  return (
                    <Link
                      className={navClass(isActive)}
                      href={item.href}
                      key={item.href}
                    >
                      <NavIcon active={isActive} name={item.icon} />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-auto grid gap-3">
          <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
            <div className="mb-2.5 flex items-center justify-between gap-3 text-[12px] text-[var(--dash-text-muted)]">
              <span>{copy.actions.copyQuoteLink}</span>
              <StatusBadge tone="emerald">{copy.status.active}</StatusBadge>
            </div>
            <div className="mb-2.5 flex items-center justify-between gap-3 text-[12px] text-[var(--dash-text-muted)]">
              <span>{copy.settings.plan}</span>
              <span className="font-bold text-[var(--dash-text-secondary)]">
                {copy.status.pilot}
              </span>
            </div>
            <CopyButton
              className="w-full"
              failedLabel={copy.actions.copyFailed}
              label={copy.actions.copyQuoteLink}
              successLabel={copy.actions.copySuccess}
              value={quotePath}
            />
          </div>

          <div
            className="flex items-center gap-2.5 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-2.5 text-[12px]"
            title={userLabel}
          >
            <span
              aria-hidden
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--dash-primary-soft)] text-[11px] font-black text-[var(--dash-primary)]"
            >
              {activeBusinessName.charAt(0).toUpperCase()}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-black text-[var(--dash-text)]">
                {activeBusinessName}
              </span>
              <span className="mt-0.5 block truncate text-[var(--dash-text-muted)]">
                {copy.nav.ownerWorkspace}
              </span>
            </span>
          </div>
        </div>
      </aside>

      <nav className="dashboard-mobile-nav fixed inset-x-0 bottom-0 z-30 border-t border-[var(--dash-border)] bg-[var(--dash-bg)]/95 px-2 py-2 shadow-[0_-10px_28px_rgba(0,0,0,0.18)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl gap-1">
          {mobileNavigation.map((item) => (
            <MobileNavLink item={item} key={item.href} pathname={pathname} />
          ))}
        </div>
      </nav>
    </>
  );
}
