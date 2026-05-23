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
 * Last Updated: 2026-05-23
 * Change Log:
 * - 2026-05-19: Matched approved index.html sidebar rhythm, brand block, active states, mobile nav, and quote-link readiness footer.
 * - 2026-05-23: Localized sidebar labels from the central BizPilot copy dictionary.
 * ============================================================
 */

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { BizPilotCopy } from "@/lib/i18n/bizpilot-copy";

import { CopyButton } from "./copy-button";
import { StatusBadge } from "./dashboard-ui";

type DashboardSidebarProps = Readonly<{
  activeBusinessName: string;
  businessSlug: string;
  copy: BizPilotCopy["dashboard"];
  userLabel: string;
}>;

type NavigationItem = Readonly<{
  href: string;
  icon: string;
  label: string;
  match?: (pathname: string) => boolean;
}>;

type NavigationGroup = Readonly<{
  items: NavigationItem[];
  label: string;
}>;

function getOwnerNavigation(copy: BizPilotCopy["dashboard"]): NavigationGroup[] {
  return [
    {
      label: copy.nav.ownerWorkspace,
      items: [
        {
          href: "/dashboard",
          icon: "O",
          label: copy.nav.overview,
          match: (pathname) => pathname === "/dashboard",
        },
        {
          href: "/dashboard/leads",
          icon: "L",
          label: copy.nav.leads,
          match: (pathname) => pathname.startsWith("/dashboard/leads"),
        },
        {
          href: "/dashboard/configuration",
          icon: "Q",
          label: copy.nav.quoteSetup,
          match: (pathname) =>
            pathname === "/dashboard/configuration" ||
            pathname === "/dashboard/quote-setup",
        },
        {
          href: "/dashboard/business-profile",
          icon: "B",
          label: copy.nav.businessProfile,
          match: (pathname) => pathname === "/dashboard/business-profile",
        },
        {
          href: "/dashboard/settings",
          icon: "S",
          label: copy.nav.settings,
          match: (pathname) => pathname === "/dashboard/settings",
        },
      ],
    },
  ];
}

function navClass(isActive: boolean): string {
  if (isActive) {
    return "flex min-h-11 items-center gap-3 rounded-[14px] border border-[rgba(20,184,166,0.34)] bg-[var(--dash-primary-soft)] px-3 font-bold text-[var(--dash-text)] shadow-[inset_0_0_0_1px_rgba(20,184,166,0.07)]";
  }

  return "flex min-h-11 items-center gap-3 rounded-[14px] border border-transparent px-3 font-bold text-[var(--dash-text-secondary)] transition hover:border-[var(--dash-border)] hover:bg-[rgba(148,163,184,0.08)] hover:text-[var(--dash-text)]";
}

function NavIcon({
  active,
  children,
}: Readonly<{ active: boolean; children: React.ReactNode }>) {
  return (
    <span
      className={
        active
          ? "flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[9px] bg-[rgba(20,184,166,0.22)] text-[11px] font-black"
          : "flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[9px] bg-[rgba(148,163,184,0.09)] text-[11px] font-black"
      }
    >
      {children}
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
          ? "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[12px] bg-[var(--dash-primary-soft)] px-1.5 py-1.5 text-[var(--dash-primary)]"
          : "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[12px] px-1.5 py-1.5 text-[var(--dash-text-muted)]"
      }
      href={item.href}
    >
      <span className="text-[11px] font-black">{item.icon}</span>
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
      <aside className="dashboard-sidebar sticky top-0 hidden h-screen w-[244px] border-r px-4 py-5 lg:flex lg:flex-col">
        <Link
          className="flex items-center gap-3 border-b border-[var(--dash-border)] px-2.5 pb-[18px]"
          href="/dashboard"
        >
          <span className="flex h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-gradient-to-br from-[#2dd4bf] to-[#10b981] text-[18px] font-black text-[#022c22] shadow-[0_12px_28px_rgba(20,184,166,0.26)]">
            B
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[16px] font-black tracking-[-0.03em] text-[var(--dash-text)]">
              BizPilot AI
            </span>
            <span className="mt-0.5 block truncate text-[12px] text-[var(--dash-text-muted)]">
              {copy.nav.workspaceSubtitle}
            </span>
          </span>
        </Link>

        <nav className="mt-5 flex-1 space-y-5 overflow-y-auto text-[14px]">
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
                      <NavIcon active={isActive}>{item.icon}</NavIcon>
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-auto grid gap-3">
          <div className="rounded-[18px] border border-[var(--dash-border)] bg-[rgba(255,255,255,0.035)] p-[14px]">
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
              label={copy.actions.copyQuoteLink}
              value={quotePath}
            />
          </div>

          <div
            className="flex items-center gap-2.5 rounded-[14px] border border-[var(--dash-border)] bg-[rgba(255,255,255,0.035)] px-3 py-2.5 text-[12px]"
            title={userLabel}
          >
            <span
              aria-hidden
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--dash-primary-soft)] text-[11px] font-black text-[var(--dash-primary)]"
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

      <nav className="dashboard-mobile-nav fixed inset-x-0 bottom-0 z-30 border-t border-[var(--dash-border)] bg-[var(--dash-bg)]/95 px-2 py-2 shadow-[0_-18px_40px_rgba(0,0,0,0.28)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl gap-1">
          {mobileNavigation.map((item) => (
            <MobileNavLink item={item} key={item.href} pathname={pathname} />
          ))}
        </div>
      </nav>
    </>
  );
}
