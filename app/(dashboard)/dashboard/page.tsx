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
 * Last Updated: 2026-05-19
 * Change Log:
 * - 2026-05-19: Rebuilt the overview from the approved index.html source of truth with workflow-first hierarchy.
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
  MetricCard,
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
  const readinessPercent = Math.round(
    (readiness.completed / Math.max(readiness.total, 1)) * 100,
  );
  const missingReadinessItems = readiness.items.filter((item) => !item.complete);
  const featuredLeadName =
    featuredLead?.lead.customer_name ?? overviewCopy.featuredFallbackCustomer;
  const featuredLeadService =
    featuredLead?.lead.service_type ?? overviewCopy.featuredFallbackService;
  const featuredLeadArea =
    featuredLead?.lead.city_or_service_area ?? overviewCopy.featuredFallbackArea;
  const featuredLeadAge = featuredLead
    ? formatAge(featuredLead.lead.created_at, queueCopy)
    : overviewCopy.featuredFallbackAge;
  const featuredNextAction =
    featuredLead?.recommendedAction ??
    overviewCopy.featuredFallbackAction;

  return (
    <main className="space-y-3">
      <DashboardCard
        className="grid gap-4 p-4 md:p-5 xl:grid-cols-[minmax(0,1.38fr)_minmax(300px,0.62fr)] xl:items-stretch"
        variant="priority"
      >
        <div className="min-w-0">
          <StatusBadge tone="blue">{overviewCopy.heroBadge}</StatusBadge>
          <h2 className="mt-3 max-w-3xl text-[22px] font-extrabold leading-tight text-[var(--dash-text)] sm:text-[26px]">
            {overviewCopy.heroTitle(attentionCount)}
          </h2>
          <p className="mt-2.5 max-w-2xl text-[13px] leading-6 text-[var(--dash-text-secondary)]">
            {overviewCopy.heroDescription}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link className={primaryButtonClass} href={featuredLead ? `/dashboard/leads/${featuredLead.lead.id}` : "/dashboard/leads"}>
              {overviewCopy.reviewUrgentLead}
            </Link>
            <Link className={buttonClass} href="/dashboard/leads">
              {dashboardCopy.actions.openLeadQueue}
            </Link>
            <CopyButton
              className="md:!hidden"
              label={overviewCopy.copyLink}
              value={quotePath}
            />
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {[
              [overviewCopy.recoveryFocus.replyTitle, needsReplyCount, "blue"],
              [overviewCopy.status.missingInfo, missingInfoCount, "amber"],
              [overviewCopy.metrics.atRiskLeads.label, atRiskCount, "red"],
            ].map(([label, value, tone]) => (
              <Link
                className="flex min-h-12 items-center justify-between gap-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-2 text-[13px] transition hover:border-[var(--dash-primary)] hover:bg-[var(--dash-primary-soft)]"
                href="/dashboard/leads"
                key={String(label)}
              >
                <span className="truncate font-bold text-[var(--dash-text-secondary)]">
                  {label}
                </span>
                <StatusBadge tone={tone as "amber" | "blue" | "red"}>
                  {String(value)}
                </StatusBadge>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <Avatar name={featuredLeadName} size={36} tone="primary" />
            <span className="min-w-0">
              <span className="block truncate text-[14px] font-extrabold text-[var(--dash-text)]">
                {shortCustomerName(featuredLeadName)}
              </span>
              <span className="mt-0.5 block truncate text-[12px] leading-4 text-[var(--dash-text-secondary)]">
                {featuredLeadService} / {featuredLeadArea} / {featuredLeadAge}
              </span>
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <StatusBadge tone={atRiskCount > 0 ? "red" : "amber"}>{overviewCopy.atRiskSoon}</StatusBadge>
            <StatusBadge tone="emerald">{overviewCopy.status.aiDraftReady}</StatusBadge>
            <StatusBadge tone={missingInfoCount > 0 ? "amber" : "neutral"}>
              {missingInfoCount > 0 ? overviewCopy.status.missingInfo : overviewCopy.status.ready}
            </StatusBadge>
          </div>
          <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] p-2.5 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
            <span className="font-extrabold text-[var(--dash-text)]">{overviewCopy.suggestedNextAction}</span>{" "}
            {featuredNextAction}
          </div>
        </div>
      </DashboardCard>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          detail={overviewCopy.metrics.newQuoteRequests.detail}
          label={overviewCopy.metrics.newQuoteRequests.label}
          tone="emerald"
          value={newQuoteCount}
        />
        <MetricCard
          detail={overviewCopy.metrics.needsReply.detail}
          label={overviewCopy.metrics.needsReply.label}
          tone={needsReplyCount > 0 ? "amber" : "neutral"}
          value={needsReplyCount}
        />
        <MetricCard
          detail={overviewCopy.metrics.atRiskLeads.detail}
          label={overviewCopy.metrics.atRiskLeads.label}
          tone={atRiskCount > 0 ? "red" : "neutral"}
          value={atRiskCount}
        />
        <MetricCard
          detail={overviewCopy.metrics.aiDraftsReady.detail}
          label={overviewCopy.metrics.aiDraftsReady.label}
          tone="blue"
          value={aiDraftReadyCount}
        />
      </section>

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
                recentLeads.slice(0, 5).map((item) => (
                  <Link
                    className="grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-2.5 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-2.5 transition hover:border-[var(--dash-primary)] hover:bg-[var(--dash-primary-soft)]"
                    href={`/dashboard/leads/${item.lead.id}`}
                    key={item.lead.id}
                  >
                    <Avatar name={item.lead.customer_name} size={32} />
                    <span className="min-w-0">
                      <span className="block truncate text-[12.5px] font-extrabold text-[var(--dash-text)]">
                        {shortCustomerName(item.lead.customer_name)}
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] leading-4 text-[var(--dash-text-secondary)]">
                        {item.primaryIssue || item.recommendedAction}
                      </span>
                    </span>
                    <span className="whitespace-nowrap text-[11px] text-[var(--dash-text-muted)]">
                      {formatAge(item.lead.created_at, queueCopy)}
                    </span>
                  </Link>
                ))
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
                <CopyButton label={overviewCopy.copyLink} value={quotePath} />
                <Link className={buttonClass} href="/dashboard/configuration">
                  {overviewCopy.finishSetup}
                </Link>
              </div>
              <details className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)]">
                <summary className="cursor-pointer list-none px-3 py-2 text-[12px] font-black text-[var(--dash-text)] [&::-webkit-details-marker]:hidden">
                  Setup checklist
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
              Guides and AI controls
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
