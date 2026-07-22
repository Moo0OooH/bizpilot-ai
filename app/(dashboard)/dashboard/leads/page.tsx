/**
 * ============================================================
 * File: app/(dashboard)/dashboard/leads/page.tsx
 * Project: BizPilot AI
 * Description: Owner Lead Recovery Queue route.
 * Role: Shows one filter-aware recovery cue above the searchable, sortable, paginated lead queue.
 * Related:
 * - server/services/lead-conversion.service.ts
 * - components/dashboard/lead-workspace-queue.tsx
 * - docs/dashboard-v4/CURRENT.md
 * Author: MoOoH
 * Created: 2026-05-07
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Added owner-aware public quote preview links while preserving the shareable customer URL.
 * - 2026-07-14: Removed repeated status, link-health, and rules rails; kept contextual guidance only when a focused queue is requested.
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
  shortCustomerName,
  StatusBadge,
} from "@/components/dashboard/dashboard-ui";
import {
  DASHBOARD_INTERFACE_LANGUAGE_COOKIE,
  resolveDashboardInterfaceLanguage,
} from "@/lib/i18n/dashboard-interface";
import { getDashboardInterfaceLegacyCopy } from "@/lib/i18n/dashboard-legacy-interface";
import { getCurrentUser } from "@/server/services/auth.service";
import { getBusinessWorkspace } from "@/server/services/business.service";
import {
  getLeadConversionDesk,
  type LeadDeskItem,
} from "@/server/services/lead-conversion.service";

export const dynamic = "force-dynamic";

type LeadConversionDeskPageProps = Readonly<{
  searchParams?: Promise<{ focus?: string | string[] }>;
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

function queuePriority(item: LeadDeskItem): number {
  if (item.lead.response_sla_state === "overdue") return 100;
  if (item.score.quality_level === "needs_info") return 86;
  if (item.lead.status === "new") return 80;
  if (item.lead.status === "follow_up_needed") return 72;
  if (item.action?.status === "open") return 65;
  return 20;
}

function pickFocusLead(leads: readonly LeadDeskItem[]): LeadDeskItem | undefined {
  return [...leads].sort((left, right) => {
    const priorityDifference = queuePriority(right) - queuePriority(left);

    if (priorityDifference !== 0) return priorityDifference;

    return (
      new Date(right.lead.created_at).getTime() -
      new Date(left.lead.created_at).getTime()
    );
  })[0];
}

function focusTone(
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

export default async function LeadConversionDeskPage({
  searchParams,
}: LeadConversionDeskPageProps) {
  const [query, user] = await Promise.all([searchParams, getCurrentUser()]);
  if (!user) redirect("/auth/sign-in");

  const workspace = await getBusinessWorkspace({ userId: user.id });
  const activeBusiness = workspace.businesses[0];
  if (!activeBusiness) redirect("/dashboard");

  const interfaceLanguage = resolveDashboardInterfaceLanguage({
    cookieValue: (await cookies()).get(
      DASHBOARD_INTERFACE_LANGUAGE_COOKIE,
    )?.value,
  });
  const copy = getDashboardInterfaceLegacyCopy(interfaceLanguage).dashboard;
  const leadsCopy = copy.leadsPage;
  const queueCopy = copy.leadQueue;
  const initialFilter = readLeadQueueFocus(query?.focus);
  const desk = await getLeadConversionDesk({
    actorUserId: user.id,
    business: activeBusiness,
  });
  const quotePath = `/quote/${activeBusiness.slug}`;
  const quotePreviewPath = `${quotePath}?preview=dashboard${
    activeBusiness.preferred_language === "en"
      ? ""
      : `&language=${encodeURIComponent(activeBusiness.preferred_language)}`
  }`;
  const focusedLeads = desk.leads.filter((item) =>
    leadMatchesQueueFocus(item, initialFilter),
  );
  const focusLead = pickFocusLead(focusedLeads);
  const focusCommand = leadsCopy.command.states[initialFilter];
  const hasFocus = initialFilter !== "all";
  const hasFocusLead = Boolean(focusLead);
  const focusLeadName = focusLead
    ? ownerSafeLeadText(
        focusLead.lead.customer_name,
        queueCopy.fallbacks.unnamedLead,
      )
    : null;
  const focusPrimaryHref = focusLead
    ? `/dashboard/leads/${focusLead.lead.id}`
    : desk.leads.length > 0
      ? "/dashboard/leads"
      : "/dashboard/configuration";

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
            <Link className={buttonClass} href={quotePreviewPath}>
              {copy.actions.previewQuotePage}
            </Link>
          </>
        }
        description={copy.pages.leads.subtitle}
        eyebrow={copy.nav.leads}
        title={copy.pages.leads.title}
      />

      {hasFocus ? (
        <DashboardCard
          className="p-4"
          data-dashboard-lead-focus-command
          data-dashboard-lead-focus-state={initialFilter}
          variant="priority"
        >
          <div className="grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge tone={focusTone(initialFilter, focusedLeads.length)}>
                  {leadsCopy.command.countLabel(
                    focusedLeads.length,
                    desk.leads.length,
                  )}
                </StatusBadge>
                {focusLeadName ? (
                  <span className="truncate text-[12px] font-black text-[var(--dash-text)]">
                    {shortCustomerName(
                      focusLeadName,
                      queueCopy.fallbacks.unnamedLead,
                    )}
                  </span>
                ) : null}
              </div>
              <h2 className="mt-2 text-[18px] font-black text-[var(--dash-text)] sm:text-[21px]">
                {hasFocusLead ? focusCommand.title : focusCommand.emptyTitle}
              </h2>
              <p className="mt-1 max-w-3xl text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                {hasFocusLead
                  ? focusCommand.description
                  : focusCommand.emptyDescription}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              <Link className={primaryButtonClass} href={focusPrimaryHref}>
                {hasFocusLead
                  ? focusCommand.primaryLabel
                  : focusCommand.emptyPrimaryLabel}
              </Link>
              <Link className={buttonClass} href="/dashboard/leads">
                {queueCopy.filters.all}
              </Link>
            </div>
          </div>
        </DashboardCard>
      ) : null}

      <LeadWorkspaceQueue
        initialFilter={initialFilter}
        key={initialFilter}
        language={interfaceLanguage}
        leads={desk.leads}
        quotePath={quotePath}
      />
    </main>
  );
}
