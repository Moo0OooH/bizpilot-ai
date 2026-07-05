"use client";

/**
 * ============================================================
 * File: components/dashboard/dashboard-route-guide.tsx
 * Project: BizPilot AI
 * Description: Route-aware guide rail for protected dashboard pages.
 * Role: Shows the current page priority, safest next action, and guide links across the owner workspace.
 * Related:
 * - components/dashboard/dashboard-shell.tsx
 * - lib/i18n/bizpilot-copy.ts
 * - components/dashboard/dashboard-display-preferences.tsx
 * Author: MoOoH
 * Created: 2026-07-05
 * Last Updated: 2026-07-05
 * Change Log:
 * - 2026-07-05: Created bilingual route-aware dashboard guidance for all protected owner pages.
 * ============================================================
 */

import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonClass, ghostButtonClass } from "./dashboard-ui";
import type { BizPilotCopy } from "@/lib/i18n/bizpilot-copy";

type DashboardRouteGuideCopy = BizPilotCopy["dashboard"]["routeGuide"];
type DashboardRouteGuideKey = keyof DashboardRouteGuideCopy["routes"];

type DashboardRouteGuideRailProps = Readonly<{
  copy: DashboardRouteGuideCopy;
}>;

const routeMatchers: ReadonlyArray<
  readonly [DashboardRouteGuideKey, (pathname: string) => boolean]
> = [
  ["leadDetail", (pathname) => pathname.startsWith("/dashboard/leads/")],
  ["leads", (pathname) => pathname.startsWith("/dashboard/leads")],
  [
    "configuration",
    (pathname) =>
      pathname.startsWith("/dashboard/configuration") ||
      pathname.startsWith("/dashboard/quote-setup"),
  ],
  [
    "businessProfile",
    (pathname) => pathname.startsWith("/dashboard/business-profile"),
  ],
  ["guide", (pathname) => pathname.startsWith("/dashboard/guide")],
  ["settings", (pathname) => pathname.startsWith("/dashboard/settings")],
  [
    "overview",
    (pathname) => pathname === "/dashboard" || pathname === "/dashboard/",
  ],
];

function readRouteGuideKey(pathname: string | null): DashboardRouteGuideKey {
  const normalizedPathname = pathname ?? "/dashboard";
  const match = routeMatchers.find(([, matches]) => matches(normalizedPathname));

  return match?.[0] ?? "overview";
}

export function DashboardRouteGuideRail({ copy }: DashboardRouteGuideRailProps) {
  const pathname = usePathname();
  const routeKey = readRouteGuideKey(pathname);
  const route = copy.routes[routeKey];

  return (
    <section
      aria-label={copy.ariaLabel}
      className="dashboard-route-guide border-b px-3 py-2 sm:px-5 md:px-6 lg:px-6 2xl:px-8"
      data-dashboard-optional-guide
      data-dashboard-route-guide
    >
      <div className="dashboard-container grid min-w-0 gap-3 py-2 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--dash-primary-strong)]">
            {copy.label}
          </p>
          <p className="mt-1 text-sm font-black leading-5 text-[var(--dash-text)]">
            {route.focus}
          </p>
          <p className="mt-1 max-w-4xl text-xs font-semibold leading-5 text-[var(--dash-text-secondary)]">
            {route.next}
          </p>
        </div>
        <div className="flex min-w-0 flex-wrap items-center gap-2 lg:justify-end">
          <Link className={`${buttonClass} max-w-full text-left`} href={route.primaryHref}>
            {route.primaryLabel}
          </Link>
          <Link className={`${ghostButtonClass} max-w-full text-left`} href={route.secondaryHref}>
            {route.secondaryLabel}
          </Link>
          <Link className={`${ghostButtonClass} max-w-full text-left`} href="/dashboard/guide">
            {copy.fullGuide}
          </Link>
        </div>
      </div>
    </section>
  );
}
