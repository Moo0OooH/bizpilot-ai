/**
 * ============================================================
 * File: app/(dashboard)/dashboard/reports/page.tsx
 * Project: BizPilot AI
 * Description: Protected owner lead-source and manual-outcome report.
 * Role: Turns existing safe quote-link attribution into an honest, date-filtered operational report without exposing customer contact data.
 * Related:
 * - server/services/lead-reporting.service.ts
 * - lib/lead-source-analytics.ts
 * - components/dashboard/dashboard-sidebar.tsx
 * Author: MoOoH
 * Created: 2026-07-16
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Created owner source-mix, campaign, workflow, and recent-activity reporting with privacy and truncation disclosures.
 * ============================================================
 */

import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  buttonClass,
  DashboardCard,
  EmptyState,
  MetricCard,
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
import type { LeadSourceKey } from "@/lib/lead-source-analytics";
import { getCurrentUser } from "@/server/services/auth.service";
import { getBusinessWorkspace } from "@/server/services/business.service";
import {
  getOwnerLeadSourceReport,
  readLeadSourceAnalyticsRange,
} from "@/server/services/lead-reporting.service";

export const dynamic = "force-dynamic";

type ReportsPageProps = Readonly<{
  searchParams?: Promise<{ range?: string | string[] }>;
}>;

function rangeHref(range: "7" | "30" | "90" | "all"): string {
  return `/dashboard/reports?range=${range}`;
}

export default async function DashboardReportsPage({
  searchParams,
}: ReportsPageProps) {
  const [params, user] = await Promise.all([searchParams, getCurrentUser()]);
  if (!user) redirect("/auth/sign-in");

  const cookieStore = await cookies();
  const workspace = await getBusinessWorkspace({ userId: user.id });
  const activeBusiness = workspace.businesses[0];

  if (!activeBusiness) {
    const language = resolveWorkspaceInterfaceLanguage({
      cookieLanguage: cookieStore.get(INTERFACE_LANGUAGE_COOKIE)?.value,
    });
    const overviewCopy = getBizPilotCopy(language).dashboard.overview;
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
  const copy = dashboardCopy.reports;
  const range = readLeadSourceAnalyticsRange(params?.range);
  const { analytics, isTruncated } = await getOwnerLeadSourceReport({
    businessId: activeBusiness.id,
    range,
  });
  const dateFormatter = new Intl.DateTimeFormat(activeLanguage, {
    dateStyle: "medium",
  });
  const sourceLabel = (key: LeadSourceKey, fallback: string) =>
    copy.sourceLabels[key] ?? fallback;
  const manualOutcomeCount = analytics.manualOutcomes.byManualOutcome.reduce(
    (total, item) => total + item.count,
    0,
  );
  const topSource = analytics.summary.topSource;
  const filterItems = [
    [7, "7", copy.filters.last7],
    [30, "30", copy.filters.last30],
    [90, "90", copy.filters.last90],
    ["all", "all", copy.filters.all],
  ] as const;

  return (
    <main className="space-y-4">
      <PageHeader
        actions={
          <>
            <Link className={primaryButtonClass} href="/dashboard/configuration#public-link">
              {copy.actions.buildLinks}
            </Link>
            <Link className={buttonClass} href="/dashboard/leads">
              {copy.actions.openLeads}
            </Link>
          </>
        }
        description={copy.header.description}
        eyebrow={copy.header.eyebrow}
        title={copy.header.title}
      />

      <DashboardCard className="p-3">
        <nav aria-label={copy.filters.label} className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[12px] font-black text-[var(--dash-text-secondary)]">
            {copy.filters.label}
          </span>
          {filterItems.map(([value, hrefValue, label]) => (
            <Link
              aria-current={range === value ? "page" : undefined}
              className={
                range === value
                  ? "inline-flex min-h-9 items-center rounded-lg border border-[var(--dash-primary)] bg-[var(--dash-primary-soft)] px-3 text-[12px] font-black text-[var(--dash-primary-strong)]"
                  : buttonClass
              }
              href={rangeHref(hrefValue)}
              key={hrefValue}
            >
              {label}
            </Link>
          ))}
        </nav>
      </DashboardCard>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          detail={copy.metrics.totalRequests.detail}
          label={copy.metrics.totalRequests.label}
          tone="blue"
          value={String(analytics.summary.totalLeads)}
        />
        <MetricCard
          detail={copy.metrics.attributed.detail}
          label={copy.metrics.attributed.label}
          tone={analytics.summary.attributionRate >= 80 ? "emerald" : "amber"}
          value={`${analytics.summary.attributionRate}%`}
        />
        <MetricCard
          detail={copy.metrics.topSource.detail}
          label={copy.metrics.topSource.label}
          tone="blue"
          value={topSource ? sourceLabel(topSource.key, topSource.label) : "—"}
        />
        <MetricCard
          detail={copy.metrics.manualOutcomes.detail}
          label={copy.metrics.manualOutcomes.label}
          tone={manualOutcomeCount > 0 ? "emerald" : "neutral"}
          value={String(manualOutcomeCount)}
        />
      </section>

      {isTruncated ? (
        <p className="rounded-lg border border-[var(--dash-warning-border)] bg-[var(--dash-warning-soft)] px-4 py-3 text-[12px] font-bold text-[var(--dash-warning-strong)]">
          {copy.notices.truncated}
        </p>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <DashboardCard className="p-4 sm:p-5" variant="priority">
          <SectionHeader
            description={copy.sourceMix.description}
            title={copy.sourceMix.title}
          />
          {analytics.sources.length > 0 ? (
            <div className="mt-4 grid gap-3">
              {analytics.sources.map((source) => (
                <div className="grid gap-2" key={`${source.key}-${source.value}`}>
                  <div className="flex items-center justify-between gap-3 text-[12px]">
                    <span className="font-black text-[var(--dash-text)]">
                      {sourceLabel(source.key, source.label)}
                    </span>
                    <span className="text-[var(--dash-text-secondary)]">
                      {copy.sourceMix.requestCount(source.count)} · {source.sharePercent}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--dash-surface-muted)]">
                    <div
                      className="h-full rounded-full bg-[var(--dash-primary)]"
                      style={{ width: `${Math.max(source.sharePercent, 2)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-4 text-[13px] leading-5 text-[var(--dash-text-secondary)]">
              {copy.sourceMix.empty}
            </p>
          )}
        </DashboardCard>

        <DashboardCard className="p-4 sm:p-5">
          <SectionHeader
            description={copy.campaigns.description}
            title={copy.campaigns.title}
          />
          <div className="mt-4 grid gap-2">
            {analytics.campaigns.length > 0 ? (
              analytics.campaigns.slice(0, 8).map((campaign) => (
                <div
                  className="flex items-center justify-between gap-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-2"
                  key={campaign.key}
                >
                  <span className="min-w-0 truncate text-[12px] font-bold text-[var(--dash-text)]">
                    {campaign.label}
                  </span>
                  <StatusBadge tone="blue">{campaign.count}</StatusBadge>
                </div>
              ))
            ) : (
              <p className="text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                {copy.campaigns.empty}
              </p>
            )}
          </div>
        </DashboardCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <DashboardCard className="p-4 sm:p-5">
          <SectionHeader
            description={copy.outcomes.description}
            title={copy.outcomes.title}
          />
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {analytics.manualOutcomes.effective.length > 0 ? (
              analytics.manualOutcomes.effective.map((outcome) => (
                <div
                  className="flex items-center justify-between gap-2 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-2"
                  key={outcome.key}
                >
                  <span className="text-[12px] font-bold text-[var(--dash-text)]">
                    {copy.workflowLabels[
                      outcome.key as keyof typeof copy.workflowLabels
                    ] ?? outcome.label}
                  </span>
                  <StatusBadge tone="neutral">{outcome.count}</StatusBadge>
                </div>
              ))
            ) : (
              <p className="text-[12px] text-[var(--dash-text-secondary)]">
                {copy.outcomes.empty}
              </p>
            )}
          </div>
        </DashboardCard>

        <DashboardCard className="p-4 sm:p-5">
          <SectionHeader
            description={copy.recent.description}
            title={copy.recent.title}
          />
          <div className="mt-4 grid gap-2">
            {analytics.recentActivity.length > 0 ? (
              analytics.recentActivity.slice(0, 8).map((item) => (
                <div
                  className="grid gap-1 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                  key={item.leadId}
                >
                  <span className="min-w-0">
                    <span className="block text-[12px] font-black text-[var(--dash-text)]">
                      {sourceLabel(item.source.key, item.source.label)}
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] text-[var(--dash-text-muted)]">
                      {copy.recent.campaign}: {item.campaign ?? "—"} · {copy.recent.status}:{" "}
                      {copy.workflowLabels[
                        (item.manualOutcome ?? item.status ?? "unknown") as keyof typeof copy.workflowLabels
                      ] ?? item.manualOutcome ?? item.status ?? copy.workflowLabels.unknown}
                    </span>
                  </span>
                  <span className="text-[11px] font-bold text-[var(--dash-text-secondary)]">
                    {dateFormatter.format(new Date(item.createdAt))}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-[12px] text-[var(--dash-text-secondary)]">
                {copy.recent.empty}
              </p>
            )}
          </div>
        </DashboardCard>
      </section>

      <div className="grid gap-2 sm:grid-cols-2">
        <p className="rounded-lg border border-[var(--dash-primary-border)] bg-[var(--dash-primary-soft)] px-4 py-3 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
          {copy.notices.trackedDefinition}
        </p>
        <p className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] px-4 py-3 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
          {copy.notices.privacy}
        </p>
      </div>
    </main>
  );
}
