/**
 * ============================================================
 * File: app/(dashboard)/dashboard/page.tsx
 * Project: BizPilot AI
 * Description: Renders the protected owner Dashboard Overview.
 * Role: Shows one recommended action, compact setup readiness, today's recovery priorities, and the lead queue.
 * Related:
 * - app/(dashboard)/layout.tsx
 * - components/dashboard/lead-workspace-queue.tsx
 * - server/services/lead-conversion.service.ts
 * - server/services/business-configuration.service.ts
 * Author: MoOoH
 * Created: 2026-05-10
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Marked owner quote previews so unavailable states return to setup instead of the marketing site.
 * - 2026-07-14: Rebuilt the overview around one decision, one readiness block, one priority list, and one queue; removed low-signal charts and repeated panels.
 * ============================================================
 */

import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { CopyButton } from "@/components/dashboard/copy-button";
import { LeadWorkspaceQueue } from "@/components/dashboard/lead-workspace-queue";
import {
  buttonClass,
  DashboardCard,
  EmptyState,
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
import { getBusinessConfigurationWorkspace } from "@/server/services/business-configuration.service";
import { getBusinessWorkspace } from "@/server/services/business.service";
import {
  getLeadConversionDesk,
  type LeadDeskItem,
} from "@/server/services/lead-conversion.service";

export const dynamic = "force-dynamic";

type DashboardTone = "amber" | "blue" | "emerald" | "neutral" | "red";

type PriorityItem = Readonly<{
  actionLabel: string;
  count: number;
  detail: string;
  href: string;
  label: string;
  tone: DashboardTone;
}>;

const dashboardToneStyles: Record<
  DashboardTone,
  Readonly<{ border: string; soft: string; strong: string }>
> = {
  amber: {
    border: "var(--dash-warning-border)",
    soft: "var(--dash-warning-soft)",
    strong: "var(--dash-warning-strong)",
  },
  blue: {
    border: "var(--dash-primary-border)",
    soft: "var(--dash-primary-soft)",
    strong: "var(--dash-primary-strong)",
  },
  emerald: {
    border: "var(--dash-success-border)",
    soft: "var(--dash-success-soft)",
    strong: "var(--dash-success-strong)",
  },
  neutral: {
    border: "var(--dash-border)",
    soft: "var(--dash-surface-muted)",
    strong: "var(--dash-text-secondary)",
  },
  red: {
    border: "var(--dash-danger-border)",
    soft: "var(--dash-danger-soft)",
    strong: "var(--dash-danger-strong)",
  },
};

function pickFocusLead(leads: readonly LeadDeskItem[]): LeadDeskItem | undefined {
  return (
    leads.find((item) => item.lead.response_sla_state === "overdue") ??
    leads.find((item) => item.score.quality_level === "needs_info") ??
    leads.find((item) => item.lead.status === "new") ??
    leads[0]
  );
}

function TodayPriorityList({
  assistantBody,
  assistantTitle,
  items,
  title,
}: Readonly<{
  assistantBody: string;
  assistantTitle: string;
  items: readonly PriorityItem[];
  title: string;
}>) {
  return (
    <DashboardCard className="p-4">
      <SectionHeader title={title} />
      <div
        className="mt-3 grid gap-2 md:grid-cols-3"
        data-dashboard-priority-order
      >
        {items.map((item) => {
          const tone = dashboardToneStyles[item.tone];

          return (
            <Link
              className="grid min-h-[88px] grid-cols-[2rem_minmax(0,1fr)] gap-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3 transition hover:border-[var(--dash-primary)] hover:bg-[var(--dash-primary-soft)]"
              href={item.href}
              key={item.label}
            >
              <span
                aria-hidden
                className="flex h-8 w-8 items-center justify-center rounded-lg border text-[12px] font-black"
                style={{
                  backgroundColor: tone.soft,
                  borderColor: tone.border,
                  color: tone.strong,
                }}
              >
                {item.count}
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-black text-[var(--dash-text)]">
                  {item.label}
                </span>
                <span className="mt-1 block text-[11px] leading-4 text-[var(--dash-text-secondary)]">
                  {item.detail}
                </span>
                <span className="mt-2 block text-[11px] font-black text-[var(--dash-primary-strong)]">
                  {item.actionLabel}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
      <p className="mt-3 rounded-lg border border-[var(--dash-primary-border)] bg-[var(--dash-primary-soft)] px-3 py-2 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
        <span className="font-black text-[var(--dash-text)]">{assistantTitle}</span>{" "}
        {assistantBody}
      </p>
    </DashboardCard>
  );
}

export default async function DashboardOverviewPage() {
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
  const overviewCopy = dashboardCopy.overview;
  const visualCopy = overviewCopy.visualDashboard;
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
  const quotePreviewPath = `${quotePath}?preview=dashboard${
    activeLanguage === "en" ? "" : `&language=${encodeURIComponent(activeLanguage)}`
  }`;
  const leadQueueHref = "/dashboard/leads";
  const needsReplyHref = "/dashboard/leads?focus=needs_reply";
  const atRiskHref = "/dashboard/leads?focus=at_risk";
  const missingInfoHref = "/dashboard/leads?focus=missing_info";
  const aiReadyHref = "/dashboard/leads?focus=ai_ready";
  const focusLead = pickFocusLead(desk.leads);
  const attentionCount = desk.leads.filter(
    (item) =>
      item.lead.status === "new" ||
      item.lead.status === "follow_up_needed" ||
      item.lead.response_sla_state === "overdue",
  ).length;
  const newQuoteCount =
    desk.recoveryProof.quoteRequestsCaptured ?? desk.leads.length;
  const needsReplyCount = desk.leads.filter(
    (item) =>
      item.lead.status === "new" || item.lead.status === "follow_up_needed",
  ).length;
  const atRiskCount = desk.leads.filter(
    (item) => item.lead.response_sla_state === "overdue",
  ).length;
  const missingInfoCount = desk.leads.filter(
    (item) => item.score.quality_level === "needs_info",
  ).length;
  const aiDraftReadyCount = desk.leads.filter(
    (item) =>
      !item.lead.first_reply_copied_at &&
      item.lead.status !== "booked" &&
      item.lead.status !== "lost",
  ).length;
  const askInfoActions = desk.todaysActions.filter(
    (action) => action.action_type === "ask_info",
  ).length;
  const followUpActions = desk.todaysActions.filter(
    (action) => action.action_type === "follow_up",
  ).length;
  const missingReadinessItems = readiness.items.filter((item) => !item.complete);
  const firstMissingReadinessLabel = missingReadinessItems[0]
    ? (dashboardCopy.readinessTasks[
        missingReadinessItems[0].taskKey as keyof typeof dashboardCopy.readinessTasks
      ] ?? missingReadinessItems[0].label)
    : null;
  const readinessPercent = Math.min(
    100,
    Math.max(
      0,
      Math.round((readiness.completed / Math.max(readiness.total, 1)) * 100),
    ),
  );
  const primaryActionHref = firstMissingReadinessLabel
    ? "/dashboard/configuration"
    : focusLead
      ? `/dashboard/leads/${focusLead.lead.id}`
      : leadQueueHref;
  const primaryActionLabel = firstMissingReadinessLabel
    ? overviewCopy.finishSetup
    : focusLead
      ? overviewCopy.reviewUrgentLead
      : dashboardCopy.actions.openLeadQueue;
  const primaryActionDetail = firstMissingReadinessLabel
    ? `${overviewCopy.startGuide.next}: ${firstMissingReadinessLabel}`
    : (focusLead?.recommendedAction ?? overviewCopy.featuredFallbackAction);
  const metricTiles = [
    {
      detail: overviewCopy.metrics.newQuoteRequests.detail,
      href: leadQueueHref,
      label: overviewCopy.metrics.newQuoteRequests.label,
      tone: "emerald" as const,
      value: newQuoteCount,
    },
    {
      detail: overviewCopy.metrics.needsReply.detail,
      href: needsReplyHref,
      label: overviewCopy.metrics.needsReply.label,
      tone: needsReplyCount > 0 ? ("amber" as const) : ("neutral" as const),
      value: needsReplyCount,
    },
    {
      detail: overviewCopy.metrics.atRiskLeads.detail,
      href: atRiskHref,
      label: overviewCopy.metrics.atRiskLeads.label,
      tone: atRiskCount > 0 ? ("red" as const) : ("neutral" as const),
      value: atRiskCount,
    },
    {
      detail: overviewCopy.metrics.aiDraftsReady.detail,
      href: aiReadyHref,
      label: overviewCopy.metrics.aiDraftsReady.label,
      tone: aiDraftReadyCount > 0 ? ("blue" as const) : ("neutral" as const),
      value: aiDraftReadyCount,
    },
  ];
  const todayPriorities: readonly PriorityItem[] = [
    {
      actionLabel: overviewCopy.openQueue,
      count: needsReplyCount + atRiskCount,
      detail: overviewCopy.recoveryFocus.replyDetail(needsReplyCount + atRiskCount),
      href: needsReplyHref,
      label: overviewCopy.recoveryFocus.replyTitle,
      tone:
        atRiskCount > 0 ? "red" : needsReplyCount > 0 ? "amber" : "neutral",
    },
    {
      actionLabel: overviewCopy.openQueue,
      count: missingInfoCount + askInfoActions,
      detail: overviewCopy.recoveryFocus.missingInfoDetail(
        missingInfoCount + askInfoActions,
      ),
      href: missingInfoHref,
      label: overviewCopy.recoveryFocus.missingInfoTitle,
      tone: missingInfoCount + askInfoActions > 0 ? "amber" : "neutral",
    },
    {
      actionLabel: overviewCopy.openQueue,
      count: followUpActions,
      detail: overviewCopy.recoveryFocus.followUpDetail(followUpActions),
      href: needsReplyHref,
      label: overviewCopy.recoveryFocus.followUpTitle,
      tone: followUpActions > 0 ? "blue" : "neutral",
    },
  ];
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
  const quotePreviewHref =
    readiness.completed === readiness.total
      ? quotePreviewPath
      : "/dashboard/configuration";

  return (
    <main className="space-y-4">
      <header className="flex flex-col gap-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-4 shadow-sm sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--dash-text-muted)]">
            {activeBusiness.name}
          </p>
          <h1 className="mt-1 text-[24px] font-black leading-tight text-[var(--dash-text)] sm:text-[30px]">
            {visualCopy.title}
          </h1>
          <p className="mt-1 max-w-3xl text-[13px] leading-5 text-[var(--dash-text-secondary)]">
            {overviewCopy.heroDescription}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2" data-dashboard-utility-actions>
          <CopyButton
            failedLabel={dashboardCopy.actions.copyFailed}
            label={overviewCopy.copyLink}
            successLabel={dashboardCopy.actions.copySuccess}
            value={quotePath}
          />
          <Link className={buttonClass} href={quotePreviewHref}>
            {dashboardCopy.actions.previewQuotePage}
          </Link>
        </div>
      </header>

      <DashboardCard className="overflow-hidden p-0" variant="priority">
        <div className="grid xl:grid-cols-[minmax(0,1.18fr)_minmax(300px,0.82fr)]">
          <section className="min-w-0 p-4 sm:p-5">
            <StatusBadge tone="blue">{overviewCopy.heroBadge}</StatusBadge>
            <h2 className="mt-3 max-w-3xl text-[23px] font-black leading-tight text-[var(--dash-text)] sm:text-[28px]">
              {overviewCopy.heroTitle(attentionCount)}
            </h2>
            <div
              className="mt-4 grid gap-3 rounded-lg border border-[var(--dash-primary-border)] bg-[var(--dash-surface)] p-3.5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
              data-dashboard-primary-action
            >
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--dash-primary-strong)]">
                  {overviewCopy.suggestedNextAction}
                </p>
                <p className="mt-1 text-[17px] font-black text-[var(--dash-text)]">
                  {primaryActionLabel}
                </p>
                <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                  {primaryActionDetail}
                </p>
              </div>
              <Link className={primaryButtonClass} href={primaryActionHref}>
                {primaryActionLabel}
              </Link>
            </div>
          </section>

          <section className="min-w-0 border-t border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-4 sm:p-5 xl:border-l xl:border-t-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--dash-text-muted)]">
                  {overviewCopy.readiness.title}
                </p>
                <p className="mt-1 text-[24px] font-black text-[var(--dash-text)]">
                  {readinessPercent}%
                </p>
              </div>
              <StatusBadge tone={missingReadinessItems.length === 0 ? "emerald" : "amber"}>
                {missingReadinessItems.length === 0
                  ? overviewCopy.readiness.ready
                  : overviewCopy.readiness.incomplete}
              </StatusBadge>
            </div>
            <p className="mt-2 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
              {firstMissingReadinessLabel ?? overviewCopy.readiness.activeAndReady}
            </p>
            <details className="mt-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)]">
              <summary className="cursor-pointer list-none px-3 py-2 text-[12px] font-black text-[var(--dash-text)] [&::-webkit-details-marker]:hidden">
                {overviewCopy.startGuide.title}
              </summary>
              <div className="grid gap-2 border-t border-[var(--dash-border)] p-3">
                {overviewCopy.startGuide.items.map(([title, detail], index) => {
                  const done = Boolean(startGuideDoneStates[index]);

                  return (
                    <Link
                      className="grid grid-cols-[1.5rem_minmax(0,1fr)_auto] gap-2 rounded-lg bg-[var(--dash-surface-muted)] p-2"
                      href={startGuideLinks[index] ?? "/dashboard"}
                      key={title}
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--dash-primary-soft)] text-[11px] font-black text-[var(--dash-primary)]">
                        {index + 1}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[12px] font-black text-[var(--dash-text)]">
                          {title}
                        </span>
                        <span className="mt-0.5 block text-[11px] leading-4 text-[var(--dash-text-secondary)]">
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
            </details>
          </section>
        </div>

        <div className="grid gap-2 border-t border-[var(--dash-border)] p-3 sm:grid-cols-2 xl:grid-cols-4">
          {metricTiles.map((tile) => (
            <Link
              className="grid min-h-[78px] grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3 transition hover:border-[var(--dash-primary)] hover:bg-[var(--dash-primary-soft)]"
              href={tile.href}
              key={tile.label}
            >
              <span className="min-w-0">
                <span className="block text-[12px] font-black text-[var(--dash-text)]">
                  {tile.label}
                </span>
                <span className="mt-1 block text-[11px] leading-4 text-[var(--dash-text-secondary)]">
                  {tile.detail}
                </span>
              </span>
              <StatusBadge tone={tile.tone}>{tile.value}</StatusBadge>
            </Link>
          ))}
        </div>
      </DashboardCard>

      <TodayPriorityList
        assistantBody={visualCopy.aiAssistantBody(needsReplyCount + atRiskCount)}
        assistantTitle={visualCopy.aiAssistantTitle}
        items={todayPriorities}
        title={overviewCopy.recoveryFocus.title}
      />

      <section className="grid gap-2">
        <SectionHeader
          action={
            <Link className={buttonClass} href={leadQueueHref}>
              {overviewCopy.openQueue}
            </Link>
          }
          description={overviewCopy.queue.description}
          title={overviewCopy.queue.title}
        />
        <LeadWorkspaceQueue
          compact
          language={activeLanguage}
          leads={desk.leads}
          limit={5}
          quotePath={quotePath}
        />
      </section>
    </main>
  );
}
