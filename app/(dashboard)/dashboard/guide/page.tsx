/**
 * ============================================================
 * File: app/(dashboard)/dashboard/guide/page.tsx
 * Project: BizPilot AI
 * Description: Protected owner operating guide for the manual quote-recovery dashboard.
 * Role: Gives owners a compact route map, daily manual workflow, visible gaps, and current pilot boundaries.
 * Related:
 * - components/dashboard/dashboard-sidebar.tsx
 * - components/dashboard/dashboard-topbar.tsx
 * - lib/i18n/bizpilot-copy.ts
 * Author: MoOoH
 * Created: 2026-07-04
 * Last Updated: 2026-07-05
 * Change Log:
 * - 2026-07-05: Collapsed the optional gaps panel by default to keep the owner guide lower-scroll for final polish.
 * - 2026-07-05: Added explicit accessible labels to owner guide route-map cards.
 * - 2026-07-05: Tokenized boundary status dots for dashboard theme consistency.
 * - 2026-07-04: Created the protected owner operating guide route for dashboard finalization.
 * ============================================================
 */

import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  buttonClass,
  DashboardCard,
  EmptyState,
  PageHeader,
  primaryButtonClass,
  SectionHeader,
  StatusBadge,
} from "@/components/dashboard/dashboard-ui";
import { getBizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import {
  INTERFACE_LANGUAGE_COOKIE,
  resolveWorkspaceInterfaceLanguage,
} from "@/lib/i18n/language";
import { getCurrentUser } from "@/server/services/auth.service";
import { getBusinessWorkspace } from "@/server/services/business.service";

export const dynamic = "force-dynamic";

export default async function DashboardGuidePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const cookieStore = await cookies();
  const workspace = await getBusinessWorkspace({ userId: user.id });
  const activeBusiness = workspace.businesses[0];

  if (!activeBusiness) {
    const fallbackLanguage = resolveWorkspaceInterfaceLanguage({
      cookieLanguage: cookieStore.get(INTERFACE_LANGUAGE_COOKIE)?.value,
    });
    const overviewCopy = getBizPilotCopy(fallbackLanguage).dashboard.overview;

    return (
      <main>
        <EmptyState title={overviewCopy.noWorkspaceTitle}>
          {overviewCopy.noWorkspaceBody}
        </EmptyState>
      </main>
    );
  }

  const activeLanguage = resolveWorkspaceInterfaceLanguage({
    businessLanguage: activeBusiness.preferred_language,
    cookieLanguage: cookieStore.get(INTERFACE_LANGUAGE_COOKIE)?.value,
  });
  const dashboardCopy = getBizPilotCopy(activeLanguage).dashboard;
  const guideCopy = dashboardCopy.guide;

  return (
    <main className="space-y-4">
      <PageHeader
        actions={
          <>
            <Link className={primaryButtonClass} href="/dashboard/leads">
              {guideCopy.actions.openQueue}
            </Link>
            <Link className={buttonClass} href="/dashboard/configuration">
              {guideCopy.actions.openSetup}
            </Link>
          </>
        }
        description={guideCopy.header.description}
        eyebrow={guideCopy.header.eyebrow}
        title={guideCopy.header.title}
      />

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <div className="grid min-w-0 gap-4">
          <DashboardCard className="p-4 sm:p-5" variant="priority">
            <SectionHeader
              description={guideCopy.operatingSystem.description}
              title={guideCopy.operatingSystem.title}
            />
            <div className="mt-4 grid gap-2 lg:grid-cols-5">
              {guideCopy.operatingSystem.lanes.map(([title, detail, action], index) => (
                <div
                  className="grid min-h-[136px] gap-2 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3"
                  key={title}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--dash-primary-soft)] text-[12px] font-black text-[var(--dash-primary)]">
                    {index + 1}
                  </span>
                  <span className="text-[13px] font-black text-[var(--dash-text)]">
                    {title}
                  </span>
                  <span className="text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                    {detail}
                  </span>
                  <span className="mt-auto text-[11px] font-bold leading-4 text-[var(--dash-text-muted)]">
                    {action}
                  </span>
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard className="p-4">
            <SectionHeader
              description={guideCopy.routeMap.description}
              title={guideCopy.routeMap.title}
            />
            <div className="mt-4 grid gap-2">
              {guideCopy.routeMap.items.map(([title, detail, href, cta]) => (
                <Link
                  aria-label={`${title} - ${detail} - ${cta}`}
                  className="grid gap-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3 transition hover:border-[var(--dash-primary)] hover:bg-[var(--dash-primary-soft)] sm:grid-cols-[minmax(0,0.36fr)_minmax(0,1fr)_auto] sm:items-center"
                  href={href}
                  key={href}
                >
                  <span className="text-[13px] font-black text-[var(--dash-text)]">
                    {title}
                  </span>
                  <span className="text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                    {detail}
                  </span>
                  <StatusBadge tone="blue">{cta}</StatusBadge>
                </Link>
              ))}
            </div>
          </DashboardCard>
        </div>

        <aside className="grid min-w-0 gap-4 xl:sticky xl:top-[82px]">
          <DashboardCard className="p-4">
            <SectionHeader
              description={guideCopy.launchChecklist.description}
              title={guideCopy.launchChecklist.title}
            />
            <div className="mt-4 grid gap-2">
              {guideCopy.launchChecklist.items.map(([step, title, detail]) => (
                <div
                  className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3"
                  key={step}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--dash-primary-soft)] text-[12px] font-black text-[var(--dash-primary)]">
                    {step}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-black text-[var(--dash-text)]">
                      {title}
                    </span>
                    <span className="mt-1 block text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                      {detail}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard className="p-4">
            <SectionHeader
              description={guideCopy.boundaries.description}
              title={guideCopy.boundaries.title}
            />
            <div className="mt-4 grid gap-2">
              {guideCopy.boundaries.items.map((item, index) => (
                <div
                  className="grid grid-cols-[0.65rem_minmax(0,1fr)] gap-2 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3 text-[12px] leading-5 text-[var(--dash-text-secondary)]"
                  key={item}
                >
                  <span
                    aria-hidden
                    className="mt-1.5 h-2 w-2 rounded-full"
                    style={{
                      backgroundColor:
                        index === 0
                          ? "var(--dash-danger-strong)"
                          : "var(--dash-warning-strong)",
                    }}
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </DashboardCard>

          <details
            className="overflow-hidden rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)]"
            data-dashboard-optional-guide
          >
            <summary className="cursor-pointer list-none px-4 py-3 text-[13px] font-black text-[var(--dash-text)] [&::-webkit-details-marker]:hidden">
              {guideCopy.gaps.title}
            </summary>
            <div className="grid gap-2 border-t border-[var(--dash-border)] p-4">
              <p className="text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                {guideCopy.gaps.description}
              </p>
              {guideCopy.gaps.items.map(([title, detail]) => (
                <div
                  className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3"
                  key={title}
                >
                  <p className="text-[12px] font-black text-[var(--dash-text)]">
                    {title}
                  </p>
                  <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                    {detail}
                  </p>
                </div>
              ))}
              <Link className={`${buttonClass} w-full`} href="/dashboard/settings#display-preferences">
                {guideCopy.actions.viewSettings}
              </Link>
            </div>
          </details>
        </aside>
      </section>
    </main>
  );
}
