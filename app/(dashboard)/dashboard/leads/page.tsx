/**
 * ============================================================
 * File: app/(dashboard)/dashboard/leads/page.tsx
 * Project: BizPilot AI
 * Description: Lead Recovery Queue route.
 * Role: Single page header + queue + right rail (today’s focus, quote link health, status rules) — matches approved index.html.
 * Related:
 * - server/services/lead-conversion.service.ts
 * - components/dashboard/lead-workspace-queue.tsx
 * - docs/product/BIZPILOT_DASHBOARD_UX_STANDARD_v1.0.md
 * Author: MoOoH
 * Created: 2026-05-07
 * Last Updated: 2026-05-19
 * Change Log:
 * - 2026-05-19: Removed duplicate header + duplicate search/filter card; right rail rebuilt to mirror index pixel-for-pixel content.
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
import { getLeadConversionDesk } from "@/server/services/lead-conversion.service";

export const dynamic = "force-dynamic";

type LeadQueueCopy = ReturnType<typeof getBizPilotCopy>["dashboard"]["leadQueue"];

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

export default async function LeadConversionDeskPage() {
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

  return (
    <main className="space-y-[18px]">
      <PageHeader
        actions={
          <>
            <CopyButton label={copy.actions.copyQuoteLink} value={quotePath} />
            <Link className={primaryButtonClass} href={quotePath}>
              {copy.actions.previewQuotePage}
            </Link>
          </>
        }
        description={copy.pages.leads.subtitle}
        eyebrow={copy.nav.leads}
        title={copy.pages.leads.title}
      />

      <section className="grid min-w-0 items-start gap-[18px] xl:grid-cols-[minmax(0,1fr)_320px]">
        <LeadWorkspaceQueue
          language={activeLanguage}
          leads={desk.leads}
          quotePath={quotePath}
        />

        <aside className="min-w-0 space-y-[14px] xl:sticky xl:top-[92px]">
          <DashboardCard className="p-[18px]" variant="priority">
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

          <DashboardCard className="p-[18px]">
            <SectionHeader
              action={<StatusBadge tone="emerald">{leadsCopy.active}</StatusBadge>}
              description={leadsCopy.lastSubmission(
                formatAgeShort(lastSubmissionAt, queueCopy),
              )}
              title={leadsCopy.quoteLinkHealth}
            />
            <div className="mt-3 rounded-[13px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3 text-[13px] text-[var(--dash-text-secondary)]">
              <span className="break-all font-black text-[var(--dash-text)]">
                {quotePath}
              </span>
            </div>
            <div className="mt-3">
              <CopyButton
                className="w-full"
                label={copy.actions.copyQuoteLink}
                value={quotePath}
              />
            </div>
          </DashboardCard>

          <DashboardCard className="p-[18px]">
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
