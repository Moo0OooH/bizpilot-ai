/**
 * ============================================================
 * File: app/(dashboard)/dashboard/leads/page.tsx
 * Project: BizPilot AI
 * Description: Lead Recovery Queue route.
 * Role: Shows the manual lead recovery queue with focus guidance, queue controls, and setup support.
 * Related:
 * - server/services/lead-conversion.service.ts
 * - components/dashboard/lead-workspace-queue.tsx
 * - docs/product/BIZPILOT_DASHBOARD_UX_STANDARD_v1.0.md
 * Author: MoOoH
 * Created: 2026-05-07
 * Last Updated: 2026-07-05
 * Change Log:
 * - 2026-07-05: Added a focus-aware command strip so overview queue links surface the safest manual next action.
 * - 2026-07-04: Added safe URL focus handling so overview metrics open the queue with the right filter selected.
 * - 2026-05-19: Removed duplicate header + duplicate search/filter card; right rail rebuilt to mirror index pixel-for-pixel content.
 * ============================================================
 */

import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { CopyButton } from "@/components/dashboard/copy-button";
import {
  LeadWorkspaceQueue,
  type LeadQueueInitialFilter,
} from "@/components/dashboard/lead-workspace-queue";
import {
  buttonClass,
  DashboardCard,
  ownerSafeLeadText,
  PageHeader,
  primaryButtonClass,
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
import { getBusinessWorkspace } from "@/server/services/business.service";
import {
  getLeadConversionDesk,
  type LeadDeskItem,
} from "@/server/services/lead-conversion.service";

export const dynamic = "force-dynamic";

type LeadQueueCopy = ReturnType<typeof getBizPilotCopy>["dashboard"]["leadQueue"];

type LeadConversionDeskPageProps = Readonly<{
  searchParams?: Promise<{
    focus?: string | string[];
  }>;
}>;

function readLeadQueueFocus(
  value: string | string[] | undefined,
): LeadQueueInitialFilter {
  const rawValue = Array.isArray(value) ? value[0] : value;

  if (
    rawValue === "needs_reply" ||
    rawValue === "at_risk" ||
    rawValue === "missing_info" ||
    rawValue === "ai_ready" ||
    rawValue === "reviewed" ||
    rawValue === "won" ||
    rawValue === "lost"
  ) {
    return rawValue;
  }

  return "all";
}

function leadMatchesQueueFocus(
  item: LeadDeskItem,
  focus: LeadQueueInitialFilter,
): boolean {
  if (focus === "all") return true;
  if (focus === "needs_reply") {
    return (
      item.lead.status === "new" ||
      item.lead.status === "follow_up_needed" ||
      item.lead.response_sla_state === "new" ||
      item.lead.response_sla_state === "overdue"
    );
  }
  if (focus === "at_risk") return item.lead.response_sla_state === "overdue";
  if (focus === "missing_info") return item.score.quality_level === "needs_info";
  if (focus === "ai_ready") {
    return (
      item.lead.status === "new" ||
      item.lead.status === "follow_up_needed" ||
      item.action?.status === "open" ||
      !item.lead.first_reply_copied_at
    );
  }
  if (focus === "reviewed") {
    return item.lead.status === "reviewed" || item.lead.status === "replied";
  }
  if (focus === "won") {
    return item.lead.status === "booked" || item.lead.manual_outcome === "booked";
  }
  if (focus === "lost") {
    return item.lead.status === "lost" || item.lead.manual_outcome === "lost";
  }

  return true;
}

function queueFocusPriority(item: LeadDeskItem): number {
  if (item.lead.response_sla_state === "overdue") return 100;
  if (item.score.quality_level === "needs_info") return 86;
  if (item.lead.status === "new") return 80;
  if (item.lead.status === "follow_up_needed") return 72;
  if (item.action?.status === "open") return 65;
  if (item.lead.status === "booked") return 34;
  if (item.lead.status === "lost") return 30;

  return 20;
}

function pickFocusLead(leads: LeadDeskItem[]): LeadDeskItem | undefined {
  return [...leads].sort((left, right) => {
    const priorityDifference =
      queueFocusPriority(right) - queueFocusPriority(left);

    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    return (
      new Date(right.lead.created_at).getTime() -
      new Date(left.lead.created_at).getTime()
    );
  })[0];
}

function queueFocusTone(
  focus: LeadQueueInitialFilter,
  matchCount: number,
): "amber" | "blue" | "emerald" | "neutral" | "red" {
  if (matchCount <= 0) return "neutral";
  if (focus === "at_risk") return "red";
  if (focus === "missing_info") return "amber";
  if (focus === "reviewed" || focus === "won") return "emerald";
  if (focus === "lost") return "neutral";

  return "blue";
}

function formatAgeShort(value: string | null, copy: LeadQueueCopy): string {
  if (!value) return copy.age.notAvailable;
  const diffMinutes = Math.max(
    0,
    Math.round((Date.now() - new Date(value).getTime()) / 60000),
  );
  const suffix = copy.age.ago ? ` ${copy.age.ago}` : "";
  if (diffMinutes < 60) return `${copy.age.minute(Math.max(diffMinutes, 1))}${suffix}`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${copy.age.hour(diffHours)}${suffix}`;
  const diffDays = Math.round(diffHours / 24);
  return `${copy.age.day(diffDays)}${suffix}`;
}

export default async function LeadConversionDeskPage({
  searchParams,
}: LeadConversionDeskPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");

  const workspace = await getBusinessWorkspace({ userId: user.id });
  const activeBusiness = workspace.businesses[0];
  if (!activeBusiness) redirect("/dashboard");

  const activeLanguage = resolveWorkspaceInterfaceLanguage({
    businessLanguage: activeBusiness.preferred_language,
    cookieLanguage: (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  });
  const copy = getBizPilotCopy(activeLanguage).dashboard;
  const leadsCopy = copy.leadsPage;
  const queueCopy = copy.leadQueue;
  const query = await searchParams;
  const initialFilter = readLeadQueueFocus(query?.focus);

  const desk = await getLeadConversionDesk({
    actorUserId: user.id,
    business: { ...activeBusiness, preferred_language: activeLanguage },
  });

  const quotePath = `/quote/${activeBusiness.slug}`;
  const overdueCount = desk.leads.filter(
    (item) => item.lead.response_sla_state === "overdue",
  ).length;
  const missingInfoCount = desk.leads.filter(
    (item) => item.score.quality_level === "needs_info",
  ).length;
  const newLeadCount = desk.leads.filter(
    (item) => item.lead.status === "new",
  ).length;
  const lastSubmissionAt = desk.leads[0]?.lead.created_at ?? null;
  const focusedLeads = desk.leads.filter((item) =>
    leadMatchesQueueFocus(item, initialFilter),
  );
  const focusLead = pickFocusLead(focusedLeads);
  const focusCommand = leadsCopy.command.states[initialFilter];
  const focusHasLead = Boolean(focusLead);
  const focusTitle = focusHasLead ? focusCommand.title : focusCommand.emptyTitle;
  const focusDescription = focusHasLead
    ? focusCommand.description
    : focusCommand.emptyDescription;
  const focusPrimaryHref = focusLead
    ? `/dashboard/leads/${focusLead.lead.id}`
    : desk.leads.length > 0
      ? "/dashboard/leads"
      : "/dashboard/configuration";
  const focusPrimaryLabel = focusHasLead
    ? focusCommand.primaryLabel
    : focusCommand.emptyPrimaryLabel;
  const focusLeadName = focusLead
    ? ownerSafeLeadText(focusLead.lead.customer_name, queueCopy.fallbacks.unnamedLead)
    : null;
  const focusLeadService = focusLead
    ? ownerSafeLeadText(focusLead.lead.service_type, queueCopy.fallbacks.service)
    : null;
  const focusLeadArea = focusLead
    ? ownerSafeLeadText(focusLead.lead.city_or_service_area, queueCopy.fallbacks.area)
    : null;

  return (
    <main className="space-y-4">
      <PageHeader
        actions={
          <>
            <CopyButton
              failedLabel={copy.actions.copyFailed}
              label={copy.actions.copyQuoteLink}
              successLabel={copy.actions.copySuccess}
              value={quotePath}
            />
            <Link className={buttonClass} href={quotePath}>
              {copy.actions.previewQuotePage}
            </Link>
          </>
        }
        description={copy.pages.leads.subtitle}
        eyebrow={copy.nav.leads}
        title={copy.pages.leads.title}
      />

      <DashboardCard
        className="p-4 sm:p-5"
        data-dashboard-lead-focus-command
        data-dashboard-lead-focus-state={initialFilter}
        variant="priority"
      >
        <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.46fr)] lg:items-center">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2">
              <StatusBadge tone={queueFocusTone(initialFilter, focusedLeads.length)}>
                {leadsCopy.command.countLabel(focusedLeads.length, desk.leads.length)}
              </StatusBadge>
              <StatusBadge tone="blue">{leadsCopy.command.manualOnly}</StatusBadge>
            </div>
            <p className="mt-3 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--dash-primary-strong)]">
              {leadsCopy.command.safeAction}
            </p>
            <h2 className="mt-1 text-[22px] font-black leading-tight text-[var(--dash-text)] sm:text-[26px]">
              {focusTitle}
            </h2>
            <p className="mt-2 max-w-3xl text-[13px] leading-6 text-[var(--dash-text-secondary)]">
              {focusDescription}
            </p>
          </div>

          <div
            className="grid min-w-0 gap-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3 shadow-sm"
            data-dashboard-lead-command-action
          >
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--dash-text-muted)]">
              {leadsCopy.command.routeLabel}
            </p>
            {focusLead && focusLeadName && focusLeadService && focusLeadArea ? (
              <div className="min-w-0 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
                <p className="truncate text-[14px] font-black text-[var(--dash-text)]">
                  {shortCustomerName(focusLeadName, queueCopy.fallbacks.unnamedLead)}
                </p>
                <p className="mt-1 truncate text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                  {focusLeadService} / {focusLeadArea}
                </p>
              </div>
            ) : (
              <p className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                {leadsCopy.command.noMatchingLead}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <Link className={primaryButtonClass} href={focusPrimaryHref}>
                {focusPrimaryLabel}
              </Link>
              <Link className={buttonClass} href="/dashboard/guide">
                {leadsCopy.command.secondaryLabel}
              </Link>
            </div>
          </div>
        </div>
      </DashboardCard>

      <section className="grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <LeadWorkspaceQueue
          initialFilter={initialFilter}
          key={initialFilter}
          language={activeLanguage}
          leads={desk.leads}
          quotePath={quotePath}
        />

        <aside className="min-w-0 space-y-3 xl:sticky xl:top-[82px]">
          <DashboardCard className="p-4" variant="priority">
            <SectionHeader
              description={
                overdueCount > 0
                  ? leadsCopy.focusAtRiskDescription(overdueCount)
                  : leadsCopy.focusHealthyDescription
              }
              title={leadsCopy.focusTitle}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <StatusBadge tone={overdueCount > 0 ? "red" : "neutral"}>
                {leadsCopy.atRiskBadge(overdueCount)}
              </StatusBadge>
              <StatusBadge tone={missingInfoCount > 0 ? "amber" : "neutral"}>
                {leadsCopy.missingInfoBadge(missingInfoCount)}
              </StatusBadge>
              <StatusBadge tone={newLeadCount > 0 ? "blue" : "neutral"}>
                {leadsCopy.newBadge(newLeadCount)}
              </StatusBadge>
            </div>
          </DashboardCard>

          <DashboardCard className="p-4">
            <SectionHeader
              action={<StatusBadge tone="emerald">{leadsCopy.active}</StatusBadge>}
              description={leadsCopy.lastSubmission(
                formatAgeShort(lastSubmissionAt, queueCopy),
              )}
              title={leadsCopy.quoteLinkHealth}
            />
            <div className="mt-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3 text-[13px] text-[var(--dash-text-secondary)]">
              <span className="break-all font-black text-[var(--dash-text)]">
                {quotePath}
              </span>
            </div>
            <div className="mt-3">
              <CopyButton
                className="w-full"
                failedLabel={copy.actions.copyFailed}
                label={copy.actions.copyQuoteLink}
                successLabel={copy.actions.copySuccess}
                value={quotePath}
              />
            </div>
          </DashboardCard>

          <DashboardCard className="p-4">
            <SectionHeader title={leadsCopy.statusRulesTitle} />
            <div className="my-3 h-px bg-[var(--dash-border)]" />
            <p className="text-[13px] leading-6 text-[var(--dash-text-secondary)]">
              {leadsCopy.statusRulesBody}
            </p>
            <div className="mt-3">
              <Link className={`${buttonClass} w-full`} href="/dashboard/configuration">
                {leadsCopy.openQuoteSetup}
              </Link>
            </div>
          </DashboardCard>
        </aside>
      </section>
    </main>
  );
}
