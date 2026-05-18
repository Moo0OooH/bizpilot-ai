/**
 * ============================================================
 * File: app/(dashboard)/dashboard/page.tsx
 * Project: BizPilot AI
 * Description: Renders the protected Dashboard Overview workspace.
 * Role: Summarizes active business readiness, lead actions, recent leads, and primary shortcuts.
 * Related:
 * - app/(dashboard)/layout.tsx
 * - server/services/lead-conversion.service.ts
 * - server/services/business-configuration.service.ts
 * Author: MoOoH
 * Created: 2026-05-10
 * Last Updated: 2026-05-18
 * Change Log:
 * - 2026-05-10: Created Dashboard Overview as the default protected app page.
 * - 2026-05-11: Tightened dashboard alignment, card rhythm, and operational layout density.
 * - 2026-05-11: Upgraded overview into a quote recovery cockpit with priority actions.
 * - 2026-05-17: Added first-use Magic Moment sample lead state for pilot demos.
 * - 2026-05-18: Rebalanced overview into a premium Lead Recovery Command Center layout.
 * ============================================================
 */

import Link from "next/link";
import { redirect } from "next/navigation";
import type React from "react";

import { CopyButton } from "@/components/dashboard/copy-button";
import {
  buttonClass,
  DashboardCard,
  EmptyState,
  LeadStatusBadge,
  PageHeader,
  primaryButtonClass,
  QuickActionTile,
  RightRailPanel,
  SectionHeader,
  StatusBadge,
} from "@/components/dashboard/dashboard-ui";
import { getCurrentUser } from "@/server/services/auth.service";
import { getBusinessConfigurationWorkspace } from "@/server/services/business-configuration.service";
import { getBusinessWorkspace } from "@/server/services/business.service";
import { getLeadConversionDesk } from "@/server/services/lead-conversion.service";

export const dynamic = "force-dynamic";

function formatDate(value: string | null): string {
  if (!value) {
    return "Not yet";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function riskLabel(value: string): string {
  if (value === "strong") {
    return "Low";
  }

  if (value === "needs_info") {
    return "Medium";
  }

  return "High";
}

function KpiIcon({
  children,
  tone,
}: Readonly<{ children: React.ReactNode; tone: string }>) {
  const toneClass =
    tone === "emerald"
      ? "bg-emerald-100 text-emerald-700"
      : tone === "amber"
        ? "bg-amber-100 text-amber-700"
        : tone === "red"
          ? "bg-red-100 text-red-700"
          : tone === "blue"
            ? "bg-blue-100 text-blue-700"
            : "bg-emerald-100 text-emerald-700";

  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold ${toneClass}`}
    >
      {children}
    </span>
  );
}

function MagicMomentSampleCard({ quotePath }: Readonly<{ quotePath: string }>) {
  return (
    <DashboardCard className="p-5" variant="priority">
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr_auto] xl:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone="amber">Sample lead</StatusBadge>
            <StatusBadge tone="red">Reply needed</StatusBadge>
          </div>
          <h2 className="mt-4 text-[17px] font-semibold text-slate-950">
            Maria needs a move-out cleaning quote by Friday
          </h2>
          <p className="mt-2 text-[15px] leading-6 text-slate-700">
            This is a demo lead so a new owner sees the quote recovery workflow
            before real requests arrive.
          </p>
        </div>

        <div className="grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
          <div className="rounded-[14px] border border-emerald-100 bg-white p-4">
            <p className="font-semibold text-slate-950">AI-style summary</p>
            <p className="mt-1 leading-5">
              Move-out cleaning, 2-bedroom apartment, downtown area. Missing
              preferred arrival window.
            </p>
          </div>
          <div className="rounded-[14px] border border-emerald-100 bg-white p-4">
            <p className="font-semibold text-slate-950">Suggested reply</p>
            <p className="mt-1 leading-5">
              Ask for the best time window, then confirm the next step manually.
            </p>
          </div>
          <div className="rounded-[14px] border border-emerald-100 bg-white p-4">
            <p className="font-semibold text-slate-950">Follow-up risk</p>
            <p className="mt-1 leading-5">
              Warm quote request. Reply today before the customer checks another
              cleaner.
            </p>
          </div>
        </div>

        <div className="grid gap-2 xl:w-40">
          <Link className={primaryButtonClass} href="/dashboard/leads">
            Review lead flow
          </Link>
          <CopyButton label="Copy quote link" value={quotePath} />
        </div>
      </div>
    </DashboardCard>
  );
}

export default async function DashboardOverviewPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const workspace = await getBusinessWorkspace({
    userId: user.id,
  });
  const activeBusiness = workspace.businesses[0];

  if (!activeBusiness) {
    return (
      <main>
        <PageHeader
          description="No tenant business is available for this user yet."
          eyebrow="Overview"
          title="Dashboard Overview"
        />
      </main>
    );
  }

  const [configurationWorkspace, desk] = await Promise.all([
    getBusinessConfigurationWorkspace({
      business: activeBusiness,
    }),
    getLeadConversionDesk({
      actorUserId: user.id,
      business: activeBusiness,
    }),
  ]);
  const { readiness } = configurationWorkspace;
  const recentLeads = desk.leads.slice(0, 5);
  const newLeadCount = desk.leads.filter(
    (item) => item.lead.status === "new",
  ).length;
  const repliedLeadCount = desk.leads.filter(
    (item) => item.lead.status === "replied",
  ).length;
  const bookedCount = desk.leads.filter(
    (item) => item.lead.status === "booked",
  ).length;
  const lostCount = desk.leads.filter(
    (item) => item.lead.status === "lost",
  ).length;
  const replyCopiedCount = desk.leads.filter(
    (item) => item.lead.first_reply_copied_at,
  ).length;
  const overdueLeadCount = desk.leads.filter(
    (item) => item.lead.response_sla_state === "overdue",
  ).length;
  const readinessPercent = Math.round(
    (readiness.completed / Math.max(readiness.total, 1)) * 100,
  );
  const missingReadinessItems = readiness.items.filter((item) => !item.complete);
  const quotePath = `/quote/${activeBusiness.slug}`;
  const actionCounts = {
    askInfo: desk.todaysActions.filter(
      (action) => action.action_type === "ask_info",
    ).length,
    followUp: desk.todaysActions.filter(
      (action) => action.action_type === "follow_up",
    ).length,
    reply: desk.todaysActions.filter((action) => action.action_type === "reply")
      .length,
  };
  const repliesNeedingAttention =
    actionCounts.reply + actionCounts.followUp + overdueLeadCount;
  const quoteLinkPlacementProgress =
    readiness.items.find((item) => item.label.toLowerCase().includes("public"))
      ?.complete ?? false;
  const nextBestStep =
    repliesNeedingAttention > 0
      ? {
          description:
            "Clear the reply and follow-up queue before new quote requests go cold.",
          href: "/dashboard/leads",
          title: "Open the Lead Desk",
        }
      : missingReadinessItems.length > 0
        ? {
            description:
              "Finish the remaining setup items so the quote link is ready to share.",
            href: "/dashboard/configuration",
            title: "Finish business setup",
          }
        : {
            description:
              "Place your quote link in one more channel to capture more quote requests.",
            href: "/dashboard/configuration",
            title: "Expand quote link placement",
          };

  return (
    <main className="space-y-4">
      <PageHeader
        actions={
          <>
            <Link className={buttonClass} href={quotePath}>
              Preview Quote Link
            </Link>
            <Link className={primaryButtonClass} href="/dashboard/leads">
              Open Lead Desk
            </Link>
          </>
        }
        description="See what needs attention, which leads are at risk, and what to do next."
        eyebrow="Overview"
        title="Dashboard Overview"
      />

      <DashboardCard className="grid gap-2.5 p-3.5 lg:grid-cols-[8.5rem_repeat(3,minmax(0,1fr))] lg:items-center">
        <div className="text-[14px] font-semibold leading-5 text-slate-950">
          Needs attention
        </div>
        {[
          {
            detail: "Quote requests at risk",
            href: "/dashboard/leads",
            label: "Reply needed",
            tone: "red",
            value: overdueLeadCount,
          },
          {
            detail: "Due today",
            href: "/dashboard/leads",
            label: "Follow-up due",
            tone: "amber",
            value: actionCounts.followUp,
          },
          {
            detail: "Not reviewed yet",
            href: "/dashboard/leads",
            label: "New quote request",
            tone: "emerald",
            value: newLeadCount,
          },
        ].map((item) => (
          <Link
            className="grid min-h-[58px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-[13px] border border-slate-200 bg-slate-50 px-3.5 py-2 transition hover:border-[rgba(23,212,146,0.18)] hover:bg-[rgba(23,212,146,0.08)]"
            href={item.href}
            key={item.label}
          >
            <span
              className={
                item.tone === "red"
                  ? "flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-xs font-semibold text-red-700"
                  : item.tone === "amber"
                    ? "flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-700"
                    : "flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-[13px] font-semibold text-emerald-700"
              }
            >
              {item.value}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[15px] font-semibold text-slate-950">
                {item.label}
              </span>
              <span className="block truncate text-[13px] text-slate-500">
                {item.detail}
              </span>
            </span>
            <span className="text-slate-400">&gt;</span>
          </Link>
        ))}
      </DashboardCard>

      <section className="grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="min-w-0 space-y-4">
          <section className="grid min-w-0 gap-3.5 md:grid-cols-2 xl:grid-cols-3">
            <DashboardCard className="flex min-h-[142px] flex-col p-4">
              <div className="flex items-start gap-3">
                <KpiIcon tone="emerald">Q</KpiIcon>
                <SectionHeader title="Quote link readiness" />
              </div>
              <div className="mt-4 grid grid-cols-[3.5rem_minmax(0,1fr)] gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-[4px] border-emerald-200 text-[13px] font-semibold text-slate-950">
                  {readinessPercent}%
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-slate-950">
                    {missingReadinessItems.length === 0
                      ? "Ready"
                      : `${missingReadinessItems.length} tasks left`}
                  </p>
                  <p className="mt-0.5 text-[13px] leading-5 text-slate-600">
                    Public quote link is live.
                  </p>
                </div>
              </div>
              <Link
                className={`${buttonClass} mt-auto w-full whitespace-nowrap`}
                href="/dashboard/configuration"
              >
                Check setup
              </Link>
            </DashboardCard>

            <DashboardCard className="flex min-h-[142px] flex-col p-4">
              <div className="flex items-start gap-3">
                <KpiIcon tone="blue">L</KpiIcon>
                <SectionHeader title="Quote requests" />
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <p className="text-[30px] font-semibold leading-none text-slate-950">
                  {desk.recoveryProof.quoteRequestsCaptured}
                </p>
                <p className="text-[13px] font-medium text-slate-500">
                  captured
                </p>
              </div>
              <p className="mt-2 inline-flex w-fit rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-medium text-emerald-700">
                Link is live
              </p>
              <svg
                aria-hidden="true"
                className="mt-1.5 h-5 w-full text-emerald-700"
                fill="none"
                viewBox="0 0 180 56"
              >
                <path
                  d="M4 42 C18 20, 28 48, 42 30 S70 18, 82 28 S108 42, 122 24 S148 12, 176 20"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="3"
                />
              </svg>
              <Link className={`${buttonClass} mt-auto w-full whitespace-nowrap`} href="/dashboard/leads">
                Open desk
              </Link>
            </DashboardCard>

            <DashboardCard className="flex min-h-[142px] flex-col p-4">
              <div className="flex items-start gap-3">
                <KpiIcon tone="amber">!</KpiIcon>
                <SectionHeader title="Needs attention" />
              </div>
              <p
                className={`mt-4 text-[30px] font-semibold leading-none ${
                  repliesNeedingAttention > 0 ? "text-red-700" : "text-emerald-700"
                }`}
              >
                {repliesNeedingAttention}
              </p>
              <div className="mt-2.5 divide-y divide-slate-100 text-[13px]">
                {[
                  ["New", newLeadCount],
                  ["Follow-up due today", actionCounts.followUp],
                  ["Overdue", overdueLeadCount],
                  ["Replied", repliedLeadCount],
                ].map(([title, value]) => (
                  <div
                    className="flex items-center justify-between py-0.5"
                    key={title}
                  >
                    <span className="text-slate-600">{title}</span>
                    <span className="font-semibold text-slate-950">{value}</span>
                  </div>
                ))}
              </div>
              <Link className={`${buttonClass} mt-auto w-full whitespace-nowrap`} href="/dashboard/leads">
                Review
              </Link>
            </DashboardCard>

            <DashboardCard className="flex min-h-[142px] flex-col p-4">
              <div className="flex items-start gap-3">
                <KpiIcon tone="emerald">R</KpiIcon>
                <SectionHeader title="Reply proof" />
              </div>
              <p className="mt-4 text-[30px] font-semibold leading-none text-slate-950">
                {replyCopiedCount}
              </p>
              <p className="mt-1.5 text-[13px] leading-5 text-slate-500">
                reply copies saved
              </p>
              <div className="mt-3 h-1.5 rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{
                    width: `${
                      desk.recoveryProof.quoteRequestsCaptured > 0
                        ? Math.min(
                            100,
                            Math.round(
                              (replyCopiedCount /
                                desk.recoveryProof.quoteRequestsCaptured) *
                                100,
                            ),
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
              <p className="mt-2.5 text-[13px] leading-5 text-slate-500">
                Owner response tracking is active.
              </p>
              <Link className={`${buttonClass} mt-auto w-full whitespace-nowrap`} href="/dashboard/leads">
                Open desk
              </Link>
            </DashboardCard>

            <DashboardCard className="flex min-h-[142px] flex-col p-4">
              <div className="flex items-start gap-3">
                <KpiIcon tone="emerald">$</KpiIcon>
                <SectionHeader title="Recovery proof" />
              </div>
              <div className="mt-3 grid gap-1 text-[13px]">
                {[
                  ["Requests captured", desk.recoveryProof.quoteRequestsCaptured],
                  ["Replies copied", replyCopiedCount],
                  ["Follow-ups due", desk.recoveryProof.followUpsDue],
                  ["Follow-ups done", desk.recoveryProof.followUpsCompleted],
                  ["Booked", bookedCount],
                  ["Lost / closed", lostCount],
                ].map(([title, value]) => (
                  <div
                    className="flex items-center justify-between gap-2"
                    key={title}
                  >
                    <span className="truncate text-slate-600">{title}</span>
                    <span className="font-semibold text-slate-950">{value}</span>
                  </div>
                ))}
              </div>
              <Link className={`${buttonClass} mt-auto w-full whitespace-nowrap`} href="/dashboard/leads">
                View leads
              </Link>
            </DashboardCard>

            <DashboardCard className="flex min-h-[142px] flex-col p-4">
              <div className="flex items-start gap-3">
                <KpiIcon tone="emerald">B</KpiIcon>
                <SectionHeader title="Booked signal" />
              </div>
              <p className="mt-4 text-[30px] font-semibold leading-none text-slate-950">
                {bookedCount}
              </p>
              <div className="mt-3 grid gap-1 text-[13px]">
                {[
                  ["Follow-ups done", desk.recoveryProof.followUpsCompleted],
                  ["Booked", bookedCount],
                  ["Lost / closed", lostCount],
                ].map(([title, value]) => (
                  <div
                    className="flex items-center justify-between gap-2"
                    key={title}
                  >
                    <span className="truncate text-slate-600">{title}</span>
                    <span className="font-semibold text-slate-950">{value}</span>
                  </div>
                ))}
              </div>
              <Link className={`${buttonClass} mt-auto w-full whitespace-nowrap`} href="/dashboard/leads">
                View outcomes
              </Link>
            </DashboardCard>
          </section>

          {recentLeads.length === 0 ? (
            <MagicMomentSampleCard quotePath={quotePath} />
          ) : null}

          <DashboardCard className="p-4" variant="elevated">
            <SectionHeader
              action={
                <Link
                  className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                  href="/dashboard/leads"
                >
                  View all leads
                </Link>
              }
              description="Newest requests, risk, and next action."
              title="Lead Recovery Queue"
            />
            <div className="mt-4 overflow-hidden rounded-[16px] border border-zinc-200">
              <div className="hidden grid-cols-[minmax(220px,1.15fr)_140px_150px_110px_150px_minmax(220px,1fr)_150px_40px] bg-slate-50 px-4 py-3 text-[12px] font-semibold uppercase tracking-wide text-slate-500 xl:grid">
                <span>Customer</span>
                <span>Service</span>
                <span>Source</span>
                <span>Risk</span>
                <span>Status</span>
                <span>Next action</span>
                <span>Received</span>
                <span />
              </div>
              {recentLeads.length > 0 ? (
                recentLeads.map((item) => (
                  <Link
                    className="grid min-h-[64px] gap-3 border-t border-slate-200 px-4 py-3 text-sm transition hover:border-[rgba(23,212,146,0.18)] hover:bg-[rgba(23,212,146,0.08)] xl:grid-cols-[minmax(220px,1.15fr)_140px_150px_110px_150px_minmax(220px,1fr)_150px_40px] xl:items-center"
                    href={`/dashboard/leads/${item.lead.id}`}
                    key={item.lead.id}
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-slate-950">
                        {item.lead.customer_name ?? "Unnamed lead"}
                      </span>
                      <span className="block break-all text-[13px] leading-5 text-slate-500">
                        {item.lead.customer_contact ?? "No contact captured"}
                      </span>
                    </span>
                    <span className="text-slate-700">
                      {item.lead.service_type ?? "Service not set"}
                    </span>
                    <span className="break-words text-slate-500">
                      {item.lead.source_channel ?? "Quote link"}
                    </span>
                    <StatusBadge
                      tone={
                        item.score.quality_level === "strong"
                          ? "emerald"
                          : item.score.quality_level === "needs_info"
                            ? "amber"
                            : "blue"
                      }
                    >
                      {riskLabel(item.score.quality_level)}
                    </StatusBadge>
                    <LeadStatusBadge value={item.lead.status} />
                    <span className="leading-5 text-slate-700">
                      {item.recommendedAction}
                    </span>
                    <span className="text-[13px] leading-5 text-slate-500">
                      {formatDate(item.lead.created_at)}
                    </span>
                    <span className="text-right text-slate-400">...</span>
                  </Link>
                ))
              ) : (
                <div className="p-3">
                  <EmptyState
                    action={<CopyButton label="Copy quote link" value={quotePath} />}
                    title="No quote requests yet"
                  >
                    Share your public quote link on your website, Instagram bio,
                    or Google Business Profile to start capturing leads.
                  </EmptyState>
                </div>
              )}
            </div>
          </DashboardCard>

          <DashboardCard className="p-5">
            <SectionHeader
              description="Three focused actions that support quote recovery."
              title="Quick Actions"
            />
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="flex min-h-14 items-center gap-3 rounded-[14px] border border-slate-200 bg-slate-50 px-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                  C
                </span>
                <CopyButton label="Copy quote link" value={quotePath} />
              </div>
              <QuickActionTile
                description="Review waiting leads"
                href="/dashboard/leads"
                icon="L"
                title="Open Lead Desk"
              />
              <QuickActionTile
                description="Form, link, and branding"
                href="/dashboard/configuration"
                icon="Q"
                title="Customize quote page"
              />
            </div>
          </DashboardCard>
        </div>

        <aside className="min-w-0 space-y-3.5 xl:sticky xl:top-[74px]">
          <RightRailPanel variant="priority">
            <SectionHeader
              description={`${actionCounts.reply + actionCounts.askInfo + actionCounts.followUp} items`}
              title="Today's recovery queue"
            />
            <div className="mt-2.5 grid gap-2">
              {[
                {
                  detail: `${actionCounts.reply} leads waiting`,
                  label: "Reply needed",
                  value: actionCounts.reply,
                },
                {
                  detail: `${actionCounts.askInfo} lead needs details`,
                  label: "Missing info",
                  value: actionCounts.askInfo,
                },
                {
                  detail: `${actionCounts.followUp} follow-up due today`,
                  label: "Follow-up due",
                  value: actionCounts.followUp,
                },
              ].map((action) => (
                <Link
                  className="grid min-h-[54px] grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-2.5 rounded-[13px] border border-slate-200 bg-white px-3 py-2 text-[13px] shadow-sm transition hover:border-[rgba(23,212,146,0.18)] hover:bg-[rgba(23,212,146,0.08)]"
                  href="/dashboard/leads"
                  key={action.label}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-[13px] font-semibold text-emerald-700">
                    {action.value}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-slate-950">
                      {action.label}
                    </span>
                    <span className="mt-0.5 block truncate text-[12px] text-slate-500">
                      {action.detail}
                    </span>
                  </span>
                  <span className="text-slate-400">&gt;</span>
                </Link>
              ))}
            </div>
            <Link className={`${buttonClass} mt-2.5 w-full`} href="/dashboard/leads">
              Review waiting leads
            </Link>
          </RightRailPanel>

          <RightRailPanel>
            <SectionHeader
              action={<StatusBadge tone="emerald">Active</StatusBadge>}
              description="Share this link wherever customers ask for quotes."
              title="Public quote link"
            />
            <p className="mt-3 break-all rounded-[13px] bg-emerald-50 px-3 py-2.5 text-[13px] font-semibold text-emerald-700">
              {quotePath}
            </p>
            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <CopyButton label="Copy link" value={quotePath} />
              <Link className={buttonClass} href={quotePath}>
                Preview
              </Link>
            </div>
            <div className="mt-3 text-[12px] leading-5 text-slate-600">
              {quoteLinkPlacementProgress
                ? "Placed in 1 of 2 recommended channels"
                : "Not placed in recommended channels yet"}
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: quoteLinkPlacementProgress ? "50%" : "0%" }}
                />
              </div>
            </div>
          </RightRailPanel>

          <RightRailPanel>
            <SectionHeader
              description="Highest leverage action right now."
              title="Next best step"
            />
            <p className="mt-3 text-[13px] leading-5 text-slate-700">
              {nextBestStep.description}
            </p>
            <Link className={`${buttonClass} mt-3 w-full`} href={nextBestStep.href}>
              {nextBestStep.title}
            </Link>
          </RightRailPanel>
        </aside>
      </section>
    </main>
  );
}
