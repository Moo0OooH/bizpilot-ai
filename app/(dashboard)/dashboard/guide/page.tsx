/**
 * ============================================================
 * File: app/(dashboard)/dashboard/guide/page.tsx
 * Project: BizPilot AI
 * Description: Protected two-part setup, optimization, workflow, and reporting guide for the manual quote-recovery dashboard.
 * Role: Gives owners a readiness-aware launch path followed by the daily operating, attribution-reporting, troubleshooting, and capability map.
 * Related:
 * - components/dashboard/dashboard-sidebar.tsx
 * - components/dashboard/dashboard-topbar.tsx
 * - lib/i18n/bizpilot-copy.ts
 * Author: MoOoH
 * Created: 2026-07-04
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Reorganized the guide into setup/optimization and workflow/reporting parts, added live readiness, source-tag reporting guidance, and a Reports route.
 * - 2026-07-16: Added a first-session path, daily routine, protected-link hardening, and practical troubleshooting for new owners.
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
import {
  DASHBOARD_INTERFACE_LANGUAGE_COOKIE,
  resolveDashboardInterfaceLanguage,
} from "@/lib/i18n/dashboard-interface";
import { getDashboardInterfaceLegacyCopy } from "@/lib/i18n/dashboard-legacy-interface";
import { getCurrentUser } from "@/server/services/auth.service";
import { getBusinessConfigurationWorkspace } from "@/server/services/business-configuration.service";
import { getBusinessWorkspace } from "@/server/services/business.service";

export const dynamic = "force-dynamic";

export default async function DashboardGuidePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const cookieStore = await cookies();
  const interfaceLanguage = resolveDashboardInterfaceLanguage({
    cookieValue: cookieStore.get(DASHBOARD_INTERFACE_LANGUAGE_COOKIE)?.value,
  });
  const interfaceCopy = getDashboardInterfaceLegacyCopy(interfaceLanguage);
  const workspace = await getBusinessWorkspace({ userId: user.id });
  const activeBusiness = workspace.businesses[0];

  if (!activeBusiness) {
    const overviewCopy = interfaceCopy.dashboard.overview;

    return (
      <main>
        <EmptyState title={overviewCopy.noWorkspaceTitle}>
          {overviewCopy.noWorkspaceBody}
        </EmptyState>
      </main>
    );
  }

  const dashboardCopy = interfaceCopy.dashboard;
  const guideCopy = dashboardCopy.guide;
  const reportsCopy = dashboardCopy.reports;
  const configurationCopy = dashboardCopy.configuration;
  const configurationWorkspace = await getBusinessConfigurationWorkspace({
    business: activeBusiness,
  });
  const readiness = configurationWorkspace.readiness;
  const readinessPercent = Math.min(
    100,
    Math.max(
      0,
      Math.round((readiness.completed / Math.max(readiness.total, 1)) * 100),
    ),
  );
  const firstOpenReadinessItem = readiness.items.find((item) => !item.complete);
  const firstOpenReadinessLabel = firstOpenReadinessItem
    ? (dashboardCopy.readinessTasks[
        firstOpenReadinessItem.taskKey as keyof typeof dashboardCopy.readinessTasks
      ] ?? firstOpenReadinessItem.label)
    : null;
  const isReady = readiness.completed === readiness.total;

  return (
    <main className="space-y-4">
      <PageHeader
        actions={
          <>
            <Link className={primaryButtonClass} href="/dashboard/leads" prefetch={false}>
              {guideCopy.actions.openQueue}
            </Link>
            <Link className={buttonClass} href="/dashboard/configuration" prefetch={false}>
              {guideCopy.actions.openSetup}
            </Link>
          </>
        }
        description={guideCopy.header.description}
        eyebrow={guideCopy.header.eyebrow}
        title={guideCopy.header.title}
      />

      <nav
        aria-label={guideCopy.header.title}
        className="grid gap-3 sm:grid-cols-2"
      >
        <a
          className="group grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-4 shadow-sm transition hover:border-[var(--dash-primary)] hover:bg-[var(--dash-primary-soft)]"
          href="#setup-optimization"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--dash-primary)] text-[12px] font-black text-white">
            01
          </span>
          <span className="min-w-0">
            <span className="block text-[14px] font-black text-[var(--dash-text)]">
              {guideCopy.parts.setup.title}
            </span>
            <span className="mt-1 block text-[12px] leading-5 text-[var(--dash-text-secondary)]">
              {guideCopy.parts.setup.description}
            </span>
          </span>
        </a>
        <a
          className="group grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-4 shadow-sm transition hover:border-[var(--dash-primary)] hover:bg-[var(--dash-primary-soft)]"
          href="#workflow-reporting"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--dash-primary)] text-[12px] font-black text-white">
            02
          </span>
          <span className="min-w-0">
            <span className="block text-[14px] font-black text-[var(--dash-text)]">
              {guideCopy.parts.workflow.title}
            </span>
            <span className="mt-1 block text-[12px] leading-5 text-[var(--dash-text-secondary)]">
              {guideCopy.parts.workflow.description}
            </span>
          </span>
        </a>
      </nav>

      <section
        aria-label={guideCopy.parts.setup.title}
        className="scroll-mt-24 space-y-4"
        id="setup-optimization"
      >
        <DashboardCard className="p-4 sm:p-5" variant="priority">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <SectionHeader
              description={guideCopy.parts.setup.description}
              title={guideCopy.parts.setup.title}
            />
            <StatusBadge tone={isReady ? "emerald" : "amber"}>
              {configurationCopy.readiness.description(
                readiness.completed,
                readiness.total,
              )}
            </StatusBadge>
          </div>
          <div className="mt-4 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
            <div className="h-2 overflow-hidden rounded-full bg-[var(--dash-border)]">
              <div
                aria-label={configurationCopy.readiness.title}
                aria-valuemax={readiness.total}
                aria-valuemin={0}
                aria-valuenow={readiness.completed}
                className="h-full rounded-full bg-[var(--dash-primary)] transition-[width]"
                role="progressbar"
                style={{ width: `${readinessPercent}%` }}
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="max-w-3xl text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                {isReady
                  ? configurationCopy.readiness.shareWhenReady
                  : configurationCopy.readiness.fixFirst(
                      firstOpenReadinessLabel ?? configurationCopy.readiness.title,
                    )}
              </p>
              <Link
                className={buttonClass}
                href="/dashboard/configuration"
                prefetch={false}
              >
                {configurationCopy.readiness.reviewChecklist}
              </Link>
            </div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {guideCopy.firstSession.items.map(([step, title, detail, href]) => (
              <Link
                aria-label={`${step}. ${title} - ${detail}`}
                className="group grid min-h-[148px] gap-2 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--dash-primary)] hover:shadow-sm"
                href={href}
                key={`${step}-${href}`}
                prefetch={false}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--dash-primary)] text-[12px] font-black text-white">
                  {step}
                </span>
                <span className="text-[14px] font-black text-[var(--dash-text)]">
                  {title}
                </span>
                <span className="text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                  {detail}
                </span>
              </Link>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard className="p-4 sm:p-5">
          <SectionHeader
            description={guideCopy.launchChecklist.description}
            title={guideCopy.launchChecklist.title}
          />
          <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-5">
            {guideCopy.launchChecklist.items.map(([step, title, detail]) => (
              <div
                className="grid min-w-0 grid-cols-[2rem_minmax(0,1fr)] gap-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3 xl:grid-cols-1"
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
      </section>

      <section
        aria-label={guideCopy.parts.workflow.title}
        className="scroll-mt-24 space-y-4"
        id="workflow-reporting"
      >
        <DashboardCard className="p-4 sm:p-5" variant="priority">
          <SectionHeader
            description={guideCopy.parts.workflow.description}
            title={guideCopy.parts.workflow.title}
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

        <DashboardCard className="p-4 sm:p-5">
          <SectionHeader
            description={reportsCopy.header.description}
            title={reportsCopy.header.title}
          />
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            <div className="flex min-h-[164px] flex-col rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-4">
              <h3 className="text-[13px] font-black text-[var(--dash-text)]">
                {configurationCopy.sourceLinks.title}
              </h3>
              <p className="mt-2 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                {configurationCopy.sourceLinks.description}
              </p>
              <Link
                className={`${buttonClass} mt-4 w-full sm:w-fit`}
                href="/dashboard/configuration#public-link"
                prefetch={false}
              >
                {reportsCopy.actions.buildLinks}
              </Link>
            </div>
            <div className="flex min-h-[164px] flex-col rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-4">
              <h3 className="text-[13px] font-black text-[var(--dash-text)]">
                {reportsCopy.sourceMix.title}
              </h3>
              <p className="mt-2 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                {reportsCopy.sourceMix.description}
              </p>
              <Link
                className={`${primaryButtonClass} mt-4 w-full sm:w-fit`}
                href="/dashboard/reports"
                prefetch={false}
              >
                {dashboardCopy.nav.reports}
              </Link>
            </div>
            <div className="flex min-h-[164px] flex-col rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-4">
              <h3 className="text-[13px] font-black text-[var(--dash-text)]">
                {reportsCopy.outcomes.title}
              </h3>
              <p className="mt-2 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                {reportsCopy.outcomes.description}
              </p>
              <Link
                className={`${buttonClass} mt-4 w-full sm:w-fit`}
                href="/dashboard/leads"
                prefetch={false}
              >
                {reportsCopy.actions.openLeads}
              </Link>
            </div>
          </div>
          <div className="mt-3 grid gap-2 lg:grid-cols-2">
            <p className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
              {reportsCopy.notices.trackedDefinition}
            </p>
            <p className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
              {reportsCopy.notices.privacy}
            </p>
          </div>
        </DashboardCard>

        <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
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
                  prefetch={false}
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
              <Link
                aria-label={`${reportsCopy.header.title} - ${reportsCopy.header.description}`}
                className="grid gap-3 rounded-lg border border-[var(--dash-primary)] bg-[var(--dash-primary-soft)] p-3 transition hover:bg-[var(--dash-surface)] sm:grid-cols-[minmax(0,0.36fr)_minmax(0,1fr)_auto] sm:items-center"
                href="/dashboard/reports"
                prefetch={false}
              >
                <span className="text-[13px] font-black text-[var(--dash-text)]">
                  {dashboardCopy.nav.reports}
                </span>
                <span className="text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                  {reportsCopy.header.description}
                </span>
                <StatusBadge tone="blue">{dashboardCopy.nav.reports}</StatusBadge>
              </Link>
            </div>
          </DashboardCard>

          <DashboardCard className="p-4 sm:p-5" variant="priority">
            <SectionHeader
              description={guideCopy.dailyRoutine.description}
              title={guideCopy.dailyRoutine.title}
            />
            <div className="mt-4 grid gap-2">
              {guideCopy.dailyRoutine.items.map(([when, title, detail]) => (
                <div
                  className="grid gap-1 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3"
                  key={when}
                >
                  <span className="text-[11px] font-black uppercase tracking-[0.08em] text-[var(--dash-primary)]">
                    {when}
                  </span>
                  <span className="text-[13px] font-black text-[var(--dash-text)]">{title}</span>
                  <span className="text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                    {detail}
                  </span>
                </div>
              ))}
            </div>
          </DashboardCard>
        </section>

        <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)]">
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
            className="self-start overflow-hidden rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)]"
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
              <Link
                className={`${buttonClass} w-full`}
                href="/dashboard/settings"
                prefetch={false}
              >
                {guideCopy.actions.viewSettings}
              </Link>
            </div>
          </details>
        </section>
      </section>
    </main>
  );
}
