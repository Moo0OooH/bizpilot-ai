/**
 * ============================================================
 * File: app/(dashboard)/dashboard/page.tsx
 * Project: BizPilot AI
 * Description: Renders the protected Dashboard Overview workspace.
 * Role: Shows the Quote Recovery Command Center overview with magic moment, recovery metrics, queue preview, and setup readiness.
 * Related:
 * - app/(dashboard)/layout.tsx
 * - server/services/lead-conversion.service.ts
 * - server/services/business-configuration.service.ts
 * Author: MoOoH
 * Created: 2026-05-10
 * Last Updated: 2026-06-27
 * Change Log:
 * - 2026-05-19: Rebuilt the overview from the approved index.html source of truth with workflow-first hierarchy.
 * - 2026-06-27: Promoted the overview hero title to the page H1 after topbar heading cleanup.
 * - 2026-06-27: Consolidated the owner command lane and KPI strip into one calmer action board.
 * - 2026-06-27: Added a first-run Start Here path for owner setup, sharing, and lead review.
 * - 2026-06-27: Reworked the first viewport into a prioritized next-action cockpit.
 * - 2026-06-27: Hid synthetic/internal seed labels behind owner-safe display fallbacks.
 * ============================================================
 */

import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { CopyButton } from "@/components/dashboard/copy-button";
import { LeadWorkspaceQueue } from "@/components/dashboard/lead-workspace-queue";
import {
  Avatar,
  buttonClass,
  DashboardCard,
  EmptyState,
  ownerSafeLeadText,
  primaryButtonClass,
  RightRailPanel,
  SectionHeader,
  shortCustomerName,
  StatusBadge,
} from "@/components/dashboard/dashboard-ui";
import { getBizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import {
  INTERFACE_LANGUAGE_COOKIE,
  resolveWorkspaceInterfaceLanguage,
} from "@/lib/i18n/language";
import { getCurrentUser } from "@/server/services/auth.service";
import { getBusinessConfigurationWorkspace } from "@/server/services/business-configuration.service";
import { getBusinessWorkspace } from "@/server/services/business.service";
import { getLeadConversionDesk, type LeadDeskItem } from "@/server/services/lead-conversion.service";

export const dynamic = "force-dynamic";

type LeadQueueCopy = ReturnType<typeof getBizPilotCopy>["dashboard"]["leadQueue"];

function formatDate(value: string | null, copy: LeadQueueCopy): string {
  if (!value) {
    return copy.age.notAvailable;
  }

  return new Intl.DateTimeFormat(copy.age.olderDateLocale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatAge(value: string | null, copy: LeadQueueCopy): string {
  if (!value) {
    return copy.age.notAvailable;
  }

  const createdAt = new Date(value).getTime();
  const diffMinutes = Math.max(0, Math.round((Date.now() - createdAt) / 60000));
  const suffix = copy.age.ago ? ` ${copy.age.ago}` : "";

  if (diffMinutes < 60) {
    return `${copy.age.minute(Math.max(diffMinutes, 1))}${suffix}`;
  }

  const diffHours = Math.round(diffMinutes / 60);

  if (diffHours < 24) {
    return `${copy.age.hour(diffHours)}${suffix}`;
  }

  return formatDate(value, copy);
}

function featuredLeadFrom(leads: LeadDeskItem[]): LeadDeskItem | undefined {
  return (
    leads.find((item) => item.lead.response_sla_state === "overdue") ??
    leads.find((item) => item.score.quality_level === "needs_info") ??
    leads.find((item) => item.lead.status === "new") ??
    leads[0]
  );
}

export default async function DashboardOverviewPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const cookieStore = await cookies();
  const workspace = await getBusinessWorkspace({
    userId: user.id,
  });
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
  const overviewCopy = dashboardCopy.overview;
  const queueCopy = dashboardCopy.leadQueue;
  const localizedBusiness = {
    ...activeBusiness,
    preferred_language: activeLanguage,
  };

  const [configurationWorkspace, desk] = await Promise.all([
    getBusinessConfigurationWorkspace({ business: localizedBusiness }),
    getLeadConversionDesk({ actorUserId: user.id, business: localizedBusiness }),
  ]);

  const { readiness } = configurationWorkspace;
  const quotePath = `/quote/${activeBusiness.slug}`;
  const recentLeads = desk.leads.slice(0, 4);
  const featuredLead = featuredLeadFrom(desk.leads);
  const attentionCount = Math.max(
    desk.leads.filter(
      (item) =>
        item.lead.status === "new" ||
        item.lead.status === "follow_up_needed" ||
        item.lead.response_sla_state === "overdue",
    ).length,
    1,
  );
  const newQuoteCount = desk.recoveryProof.quoteRequestsCaptured || desk.leads.length;
  const needsReplyCount = desk.leads.filter(
    (item) => item.lead.status === "new" || item.lead.status === "follow_up_needed",
  ).length;
  const atRiskCount = desk.leads.filter(
    (item) => item.lead.response_sla_state === "overdue",
  ).length;
  const aiDraftReadyCount = desk.leads.filter(
    (item) => !item.lead.first_reply_copied_at && item.lead.status !== "booked" && item.lead.status !== "lost",
  ).length;
  const missingInfoCount = desk.leads.filter(
    (item) => item.score.quality_level === "needs_info",
  ).length;
  const replyActions = desk.todaysActions.filter((action) => action.action_type === "reply").length;
  const askInfoActions = desk.todaysActions.filter((action) => action.action_type === "ask_info").length;
  const followUpActions = desk.todaysActions.filter((action) => action.action_type === "follow_up").length;
  const manualFlowMetrics = [
    {
      href: quotePath,
      tone: "emerald",
      value: newQuoteCount,
    },
    {
      href: "/dashboard/leads",
      tone: needsReplyCount + atRiskCount > 0 ? "amber" : "neutral",
      value: needsReplyCount + atRiskCount,
    },
    {
      href: "/dashboard/leads",
      tone: "blue",
      value: aiDraftReadyCount,
    },
    {
      href: "/dashboard/leads",
      tone:
        replyActions + askInfoActions + followUpActions > 0
          ? "red"
          : "neutral",
      value: replyActions + askInfoActions + followUpActions,
    },
  ] as const;
  const readinessPercent = Math.round(
    (readiness.completed / Math.max(readiness.total, 1)) * 100,
  );
  const missingReadinessItems = readiness.items.filter((item) => !item.complete);
  const firstMissingReadinessLabel = missingReadinessItems[0]
    ? (dashboardCopy.readinessTasks[
        missingReadinessItems[0].taskKey as keyof typeof dashboardCopy.readinessTasks
      ] ?? missingReadinessItems[0].label)
    : null;
  const startGuideLinks = [
    "/dashboard/configuration",
    quotePath,
    "/dashboard/leads",
  ] as const;
  const startGuideDoneStates = [
    missingReadinessItems.length === 0,
    newQuoteCount > 0,
    desk.leads.length > 0 && needsReplyCount + atRiskCount === 0,
  ] as const;
  const featuredLeadName = ownerSafeLeadText(
    featuredLead?.lead.customer_name,
    overviewCopy.featuredFallbackCustomer,
  );
  const featuredLeadService = ownerSafeLeadText(
    featuredLead?.lead.service_type,
    overviewCopy.featuredFallbackService,
  );
  const featuredLeadArea = ownerSafeLeadText(
    featuredLead?.lead.city_or_service_area,
    overviewCopy.featuredFallbackArea,
  );
  const featuredLeadAge = featuredLead
    ? formatAge(featuredLead.lead.created_at, queueCopy)
    : overviewCopy.featuredFallbackAge;
  const featuredNextAction =
    featuredLead?.recommendedAction ??
    overviewCopy.featuredFallbackAction;
  const primaryActionHref = firstMissingReadinessLabel
    ? "/dashboard/configuration"
    : featuredLead
      ? `/dashboard/leads/${featuredLead.lead.id}`
      : "/dashboard/leads";
  const primaryActionLabel = firstMissingReadinessLabel
    ? overviewCopy.finishSetup
    : featuredLead
      ? overviewCopy.reviewUrgentLead
      : dashboardCopy.actions.openLeadQueue;
  const primaryActionDetail = firstMissingReadinessLabel
    ? `${overviewCopy.startGuide.next}: ${firstMissingReadinessLabel}`
    : featuredNextAction;
  const priorityTiles = [
    {
      detail: overviewCopy.metrics.newQuoteRequests.detail,
      href: quotePath,
      label: overviewCopy.metrics.newQuoteRequests.label,
      tone: "emerald" as const,
      value: newQuoteCount,
    },
    {
      detail: overviewCopy.metrics.needsReply.detail,
      href: "/dashboard/leads",
      label: overviewCopy.metrics.needsReply.label,
      tone: needsReplyCount > 0 ? ("amber" as const) : ("neutral" as const),
      value: needsReplyCount,
    },
    {
      detail: overviewCopy.metrics.atRiskLeads.detail,
      href: "/dashboard/leads",
      label: overviewCopy.metrics.atRiskLeads.label,
      tone: atRiskCount > 0 ? ("red" as const) : ("neutral" as const),
      value: atRiskCount,
    },
    {
      detail: overviewCopy.metrics.aiDraftsReady.detail,
      href: "/dashboard/leads",
      label: overviewCopy.metrics.aiDraftsReady.label,
      tone: aiDraftReadyCount > 0 ? ("blue" as const) : ("neutral" as const),
      value: aiDraftReadyCount,
    },
  ];

  return (
    <main className="space-y-3">
      <DashboardCard
        className="overflow-hidden p-0"
        variant="priority"
      >
        <div className="grid xl:grid-cols-[minmax(0,1.08fr)_minmax(330px,0.92fr)]">
          <section className="min-w-0 p-4 md:p-5">
            <StatusBadge tone="blue">{overviewCopy.heroBadge}</StatusBadge>
            <h1 className="mt-3 max-w-3xl text-[24px] font-black leading-tight text-[var(--dash-text)] sm:text-[30px]">
              {overviewCopy.heroTitle(attentionCount)}
            </h1>
            <p className="mt-3 max-w-2xl text-[13px] leading-6 text-[var(--dash-text-secondary)]">
              {overviewCopy.heroDescription}
            </p>

            <div className="mt-5 grid gap-3 rounded-lg border border-[var(--dash-primary-border)] bg-[var(--dash-surface)] p-3.5 shadow-sm lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--dash-primary-strong)]">
                  {overviewCopy.suggestedNextAction}
                </p>
                <p className="mt-1 text-[18px] font-black leading-6 text-[var(--dash-text)]">
                  {primaryActionLabel}
                </p>
                <p className="mt-1 text-[13px] leading-5 text-[var(--dash-text-secondary)]">
                  {primaryActionDetail}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <Link className={primaryButtonClass} href={primaryActionHref}>
                  {primaryActionLabel}
                </Link>
                <Link className={buttonClass} href="/dashboard/leads">
                  {dashboardCopy.actions.openLeadQueue}
                </Link>
              </div>
            </div>
          </section>

          <section className="min-w-0 border-t border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-4 md:p-5 xl:border-l xl:border-t-0">
            <SectionHeader
              action={
                <StatusBadge tone={missingReadinessItems.length === 0 ? "emerald" : "amber"}>
                  {missingReadinessItems.length === 0
                    ? overviewCopy.startGuide.done
                    : overviewCopy.startGuide.next}
                </StatusBadge>
              }
              description={
                firstMissingReadinessLabel
                  ? `${overviewCopy.startGuide.description} ${overviewCopy.startGuide.next}: ${firstMissingReadinessLabel}`
                  : overviewCopy.startGuide.description
              }
              title={overviewCopy.startGuide.title}
            />
            <div className="mt-3 grid gap-2">
              {overviewCopy.startGuide.items.map(([title, detail], index) => {
                const done = Boolean(startGuideDoneStates[index]);

                return (
                  <Link
                    className={[
                      "grid min-h-[72px] grid-cols-[2rem_minmax(0,1fr)_auto] items-start gap-3 rounded-lg border p-3 transition",
                      done
                        ? "border-[var(--dash-success-border)] bg-[var(--dash-success-soft)]"
                        : "border-[var(--dash-border)] bg-[var(--dash-surface)] hover:border-[var(--dash-primary)] hover:bg-[var(--dash-primary-soft)]",
                    ].join(" ")}
                    href={startGuideLinks[index] ?? "/dashboard"}
                    key={title}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--dash-primary-soft)] text-[12px] font-black text-[var(--dash-primary)]">
                      {index + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] font-black text-[var(--dash-text)]">
                        {title}
                      </span>
                      <span className="mt-1 block text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                        {detail}
                      </span>
                    </span>
                    <StatusBadge tone={done ? "emerald" : "blue"}>
                      {done ? overviewCopy.startGuide.done : overviewCopy.startGuide.next}
                    </StatusBadge>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        <div className="grid gap-2 border-t border-[var(--dash-border)] bg-[var(--dash-surface)] p-3 sm:grid-cols-2 xl:grid-cols-4">
          {priorityTiles.map((tile) => (
            <Link
              className="grid min-h-[86px] grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3 transition hover:border-[var(--dash-primary)] hover:bg-[var(--dash-primary-soft)]"
              href={tile.href}
              key={tile.label}
            >
              <span className="min-w-0">
                <span className="block truncate text-[12px] font-black text-[var(--dash-text-secondary)]">
                  {tile.label}
                </span>
                <span className="mt-1 block text-[12px] leading-5 text-[var(--dash-text-muted)]">
                  {tile.detail}
                </span>
              </span>
              <StatusBadge tone={tile.tone}>{String(tile.value)}</StatusBadge>
            </Link>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard className="p-3.5 sm:p-4">
        <SectionHeader
          description={overviewCopy.commandFlow.description}
          title={overviewCopy.commandFlow.title}
        />
        <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {overviewCopy.commandFlow.items.map(([label, detail], index) => {
            const metric = manualFlowMetrics[index] ?? {
              href: "/dashboard/leads",
              tone: "neutral" as const,
              value: 0,
            };

            return (
              <Link
                className="grid min-h-[104px] grid-rows-[auto_1fr] gap-2 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3 transition hover:border-[var(--dash-primary)] hover:bg-[var(--dash-primary-soft)]"
                href={metric.href}
                key={label}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[13px] font-black text-[var(--dash-text)]">
                    {index + 1}. {label}
                  </span>
                  <StatusBadge tone={metric.tone}>
                    {String(metric.value)}
                  </StatusBadge>
                </div>
                <span className="text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                  {detail}
                </span>
              </Link>
            );
          })}
        </div>
      </DashboardCard>

      <DashboardCard className="p-3.5 sm:p-4" variant="elevated">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.42fr)] lg:items-center">
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2.5">
              <Avatar name={featuredLeadName} size={40} tone="primary" />
              <span className="min-w-0">
                <span className="block truncate text-[15px] font-black text-[var(--dash-text)]">
                  {shortCustomerName(featuredLeadName, queueCopy.fallbacks.unnamedLead)}
                </span>
                <span className="mt-0.5 block truncate text-[12px] leading-4 text-[var(--dash-text-secondary)]">
                  {featuredLeadService} / {featuredLeadArea} / {featuredLeadAge}
                </span>
              </span>
            </div>
            <p className="mt-3 text-[13px] leading-5 text-[var(--dash-text-secondary)]">
              <span className="font-black text-[var(--dash-text)]">{overviewCopy.suggestedNextAction}</span>{" "}
              {featuredNextAction}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 lg:justify-end">
            <StatusBadge tone={atRiskCount > 0 ? "red" : "amber"}>{overviewCopy.atRiskSoon}</StatusBadge>
            <StatusBadge tone="emerald">{overviewCopy.status.aiDraftReady}</StatusBadge>
            <StatusBadge tone={missingInfoCount > 0 ? "amber" : "neutral"}>
              {missingInfoCount > 0 ? overviewCopy.status.missingInfo : overviewCopy.status.ready}
            </StatusBadge>
          </div>
        </div>
      </DashboardCard>

      <section className="grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,1.42fr)_minmax(300px,0.58fr)]">
        <div className="grid min-w-0 gap-3">
          <div className="grid gap-2">
            <SectionHeader
              action={
                <Link className={buttonClass} href="/dashboard/leads">
                  {overviewCopy.openQueue}
                </Link>
              }
              description={overviewCopy.queue.description}
              title={overviewCopy.queue.title}
            />
            <LeadWorkspaceQueue
              compact
              language={activeLanguage}
              leads={recentLeads}
              limit={5}
              quotePath={quotePath}
            />
          </div>

          <DashboardCard className="p-3.5">
            <SectionHeader
              description={overviewCopy.recentActivity.description}
              title={overviewCopy.recentActivity.title}
            />
            <div className="mt-3 grid gap-2">
              {recentLeads.length > 0 ? (
                recentLeads.slice(0, 5).map((item) => {
                  const customerDisplayName = ownerSafeLeadText(
                    item.lead.customer_name,
                    queueCopy.fallbacks.unnamedLead,
                  );

                  return (
                    <Link
                      className="grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-2.5 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-2.5 transition hover:border-[var(--dash-primary)] hover:bg-[var(--dash-primary-soft)]"
                      href={`/dashboard/leads/${item.lead.id}`}
                      key={item.lead.id}
                    >
                      <Avatar name={customerDisplayName} size={32} />
                      <span className="min-w-0">
                        <span className="block truncate text-[12.5px] font-extrabold text-[var(--dash-text)]">
                          {shortCustomerName(
                            customerDisplayName,
                            queueCopy.fallbacks.unnamedLead,
                          )}
                        </span>
                        <span className="mt-0.5 block truncate text-[11px] leading-4 text-[var(--dash-text-secondary)]">
                          {item.primaryIssue || item.recommendedAction}
                        </span>
                      </span>
                      <span className="whitespace-nowrap text-[11px] text-[var(--dash-text-muted)]">
                        {formatAge(item.lead.created_at, queueCopy)}
                      </span>
                    </Link>
                  );
                })
              ) : (
                <EmptyState title={overviewCopy.recentActivity.emptyTitle}>
                  {overviewCopy.recentActivity.emptyBody}
                </EmptyState>
              )}
            </div>
          </DashboardCard>
        </div>

        <aside className="grid min-w-0 gap-3 xl:sticky xl:top-[92px]">
          <RightRailPanel variant="priority">
            <SectionHeader
              action={
                <StatusBadge tone={missingReadinessItems.length === 0 ? "emerald" : "amber"}>
                  {missingReadinessItems.length === 0
                    ? overviewCopy.readiness.ready
                    : overviewCopy.readiness.incomplete}
                </StatusBadge>
              }
              description={overviewCopy.readiness.liveAndShareable}
              title={overviewCopy.readiness.title}
            />
            <div className="mt-4 grid gap-3">
              <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-[var(--dash-primary)] bg-[var(--dash-primary-soft)] text-[13px] font-black text-[var(--dash-text)]">
                  {readinessPercent}%
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-black text-[var(--dash-text)]">
                    {missingReadinessItems.length === 0
                      ? overviewCopy.readiness.activeAndReady
                      : overviewCopy.readiness.tasksLeft(missingReadinessItems.length)}
                  </p>
                  <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                    {overviewCopy.readiness.liveAndShareable}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <CopyButton
                  failedLabel={dashboardCopy.actions.copyFailed}
                  label={overviewCopy.copyLink}
                  successLabel={dashboardCopy.actions.copySuccess}
                  value={quotePath}
                />
                <Link className={buttonClass} href="/dashboard/configuration">
                  {overviewCopy.finishSetup}
                </Link>
              </div>
              <details className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)]">
                <summary className="cursor-pointer list-none px-3 py-2 text-[12px] font-black text-[var(--dash-text)] [&::-webkit-details-marker]:hidden">
                  {overviewCopy.setupChecklist}
                </summary>
                <div className="grid gap-2 border-t border-[var(--dash-border)] p-3 text-[13px]">
                  {readiness.items.slice(0, 5).map((item) => (
                    <div
                      className="flex items-start justify-between gap-3 border-b border-[var(--dash-border)] pb-2 last:border-b-0 last:pb-0"
                      key={item.label}
                    >
                      <span className="text-[var(--dash-text-secondary)]">
                        {dashboardCopy.readinessTasks[
                          item.taskKey as keyof typeof dashboardCopy.readinessTasks
                        ] ?? item.label}
                      </span>
                      <StatusBadge tone={item.complete ? "emerald" : "amber"}>
                        {item.complete ? dashboardCopy.status.done : overviewCopy.readiness.needed}
                      </StatusBadge>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          </RightRailPanel>

          <RightRailPanel>
            <SectionHeader
              description={overviewCopy.recoveryFocus.description(
                replyActions + askInfoActions + followUpActions,
              )}
              title={overviewCopy.recoveryFocus.title}
            />
            <div className="mt-3 grid gap-2">
              {[
                [
                  overviewCopy.recoveryFocus.replyTitle,
                  overviewCopy.recoveryFocus.replyDetail(replyActions),
                  replyActions,
                  "blue",
                ],
                [
                  overviewCopy.recoveryFocus.missingInfoTitle,
                  overviewCopy.recoveryFocus.missingInfoDetail(askInfoActions),
                  askInfoActions,
                  "amber",
                ],
                [
                  overviewCopy.recoveryFocus.followUpTitle,
                  overviewCopy.recoveryFocus.followUpDetail(followUpActions),
                  followUpActions,
                  "red",
                ],
              ].map(([title, detail, value, tone]) => (
                <Link
                  className="grid min-h-[54px] grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-2.5 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-2 text-[13px] transition hover:border-[var(--dash-primary)] hover:bg-[var(--dash-primary-soft)]"
                  href="/dashboard/leads"
                  key={String(title)}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--dash-primary-soft)] text-[13px] font-black text-[var(--dash-primary)]">
                    {value}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-black text-[var(--dash-text)]">{title}</span>
                    <span className="mt-0.5 block truncate text-[12px] text-[var(--dash-text-secondary)]">
                      {detail}
                    </span>
                  </span>
                  <StatusBadge tone={tone as "amber" | "blue" | "red"}>{String(value)}</StatusBadge>
                </Link>
              ))}
            </div>
          </RightRailPanel>

          <details className="overflow-hidden rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)]">
            <summary className="cursor-pointer list-none px-3.5 py-3 text-[13px] font-black text-[var(--dash-text)] transition hover:bg-[var(--dash-surface-muted)] [&::-webkit-details-marker]:hidden">
              {overviewCopy.guidesAndAiControls}
            </summary>
            <div className="grid gap-3 border-t border-[var(--dash-border)] p-3.5">
              <div>
                <SectionHeader title={overviewCopy.aiControlTitle} />
                <p className="mt-3 text-[13px] leading-6 text-[var(--dash-text-secondary)]">
                  {overviewCopy.aiControlBody}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {overviewCopy.aiControlBadges.map((badge, index) => (
                    <StatusBadge key={badge} tone={index === 2 ? "blue" : "emerald"}>
                      {badge}
                    </StatusBadge>
                  ))}
                </div>
              </div>
              <div className="h-px bg-[var(--dash-border)]" />
              <div>
                <SectionHeader title={overviewCopy.routine.title} />
                <div className="mt-3 grid gap-2 text-[13px]">
                  {overviewCopy.routine.steps.map(([step, title, detail]) => (
                    <div className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-2 rounded-lg bg-[var(--dash-surface-muted)] p-2.5" key={step}>
                      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--dash-primary-soft)] text-xs font-black text-[var(--dash-primary)]">
                        {step}
                      </span>
                      <span>
                        <span className="block font-black text-[var(--dash-text)]">{title}</span>
                        <span className="mt-0.5 block text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                          {detail}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </details>
        </aside>
      </section>
    </main>
  );
}
