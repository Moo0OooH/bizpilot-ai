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
 * Last Updated: 2026-05-11
 * Change Log:
 * - 2026-05-10: Created Dashboard Overview as the default protected app page.
 * - 2026-05-11: Tightened dashboard alignment, card rhythm, and operational layout density.
 * - 2026-05-11: Upgraded overview into a quote recovery cockpit with priority actions.
 * ============================================================
 */

import Link from "next/link";
import { redirect } from "next/navigation";

import { CopyButton } from "@/components/dashboard/copy-button";
import {
  buttonClass,
  DashboardCard,
  EmptyState,
  LeadStatusBadge,
  PageHeader,
  primaryButtonClass,
  QuickActionTile,
  ResponseSlaBadge,
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

function label(value: string): string {
  return value.replaceAll("_", " ");
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
    <main className="space-y-3">
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
        description="Here's what needs attention today."
        eyebrow="Overview"
        title="Dashboard Overview"
      />

      <DashboardCard className="grid min-h-16 gap-2.5 p-3 lg:grid-cols-[9rem_repeat(3,minmax(0,1fr))] lg:items-center">
        <div className="text-xs font-semibold leading-5 text-slate-950">
          Needs your attention
        </div>
        {[
          {
            detail: "Oldest risk in the lead desk",
            href: "/dashboard/leads",
            label: "Overdue replies",
            tone: "red",
            value: overdueLeadCount,
          },
          {
            detail: "Due today",
            href: "/dashboard/leads",
            label: "Follow-up due today",
            tone: "amber",
            value: actionCounts.followUp,
          },
          {
            detail: "Not reviewed yet",
            href: "/dashboard/leads",
            label: "New lead not reviewed",
            tone: "violet",
            value: newLeadCount,
          },
        ].map((item) => (
          <Link
            className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 rounded-[10px] border border-slate-200 bg-slate-50 px-3 py-1.5 transition hover:bg-white hover:shadow-sm"
            href={item.href}
            key={item.label}
          >
            <span
              className={
                item.tone === "red"
                  ? "flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-sm font-semibold text-red-700"
                  : item.tone === "amber"
                    ? "flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-700"
                    : "flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700"
              }
            >
              {item.value}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-xs font-semibold text-slate-950">
                {item.label}
              </span>
              <span className="block truncate text-[11px] text-slate-500">
                {item.detail}
              </span>
            </span>
            <span className="text-slate-400">&gt;</span>
          </Link>
        ))}
      </DashboardCard>

      <section className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-3">
          <section className="grid auto-rows-fr gap-3 md:grid-cols-2 xl:grid-cols-5">
            <DashboardCard className="flex min-h-[168px] flex-col p-4">
              <SectionHeader title="Business Readiness" />
              <div className="mt-3 grid grid-cols-[4rem_minmax(0,1fr)] gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-[7px] border-emerald-200 text-base font-semibold text-slate-950">
                  {readinessPercent}%
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-950">
                    {missingReadinessItems.length === 0
                      ? "Ready to share"
                      : `${missingReadinessItems.length} setup tasks left`}
                  </p>
                  <div className="mt-1.5 grid gap-0.5 text-[11px] text-slate-600">
                    {readiness.items.slice(0, 3).map((item) => (
                      <span className="truncate" key={item.label}>
                        <span
                          className={
                            item.complete
                              ? "font-semibold text-emerald-700"
                              : "font-semibold text-amber-700"
                          }
                        >
                          {item.complete ? "Done" : "Open"}
                        </span>{" "}
                        {item.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <Link
                className={`${buttonClass} mt-auto w-full`}
                href="/dashboard/configuration"
              >
                View setup
              </Link>
            </DashboardCard>

            <DashboardCard className="flex min-h-[168px] flex-col p-4">
              <SectionHeader title="Quote requests captured" />
              <div className="mt-3 flex items-baseline gap-2">
                <p className="text-2xl font-semibold leading-none text-slate-950">
                  {desk.recoveryProof.quoteRequestsCaptured}
                </p>
                <p className="text-xs font-medium text-slate-500">
                  captured
                </p>
              </div>
              <p className="mt-2 inline-flex w-fit rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700">
                Public quote link is live
              </p>
              <svg
                aria-hidden="true"
                className="mt-2 h-9 w-full text-violet-600"
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
              <Link className={`${buttonClass} mt-auto w-full`} href="/dashboard/leads">
                View all leads
              </Link>
            </DashboardCard>

            <DashboardCard className="flex min-h-[168px] flex-col p-4">
              <SectionHeader title="Replies needing attention" />
              <p
                className={`mt-3 text-2xl font-semibold leading-none ${
                  repliesNeedingAttention > 0 ? "text-red-700" : "text-emerald-700"
                }`}
              >
                {repliesNeedingAttention}
              </p>
              <div className="mt-2 divide-y divide-slate-100 text-xs">
                {[
                  ["New", newLeadCount],
                  ["Follow-up due today", actionCounts.followUp],
                  ["Overdue", overdueLeadCount],
                  ["Replied", repliedLeadCount],
                ].map(([title, value]) => (
                  <div
                    className="flex items-center justify-between py-1"
                    key={title}
                  >
                    <span className="text-slate-600">{title}</span>
                    <span className="font-semibold text-slate-950">{value}</span>
                  </div>
                ))}
              </div>
              <Link className={`${buttonClass} mt-auto w-full`} href="/dashboard/leads">
                Open lead desk
              </Link>
            </DashboardCard>

            <DashboardCard className="flex min-h-[168px] flex-col p-4">
              <SectionHeader title="Reply workflow proof" />
              <p className="mt-3 text-2xl font-semibold leading-none text-slate-950">
                {replyCopiedCount}
              </p>
              <p className="mt-1.5 text-xs leading-4 text-slate-500">
                reply copies recorded in the desk
              </p>
              <div className="mt-3 h-1.5 rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-violet-600"
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
              <p className="mt-2 text-[11px] text-slate-500">
                Phase 5 tracks owner response progress.
              </p>
              <Link className={`${buttonClass} mt-auto w-full`} href="/dashboard/leads">
                Open lead desk
              </Link>
            </DashboardCard>

            <DashboardCard className="flex min-h-[168px] flex-col p-4">
              <SectionHeader title="Revenue recovery proof" />
              <div className="mt-3 grid gap-1 text-xs">
                {[
                  ["Quote requests captured", desk.recoveryProof.quoteRequestsCaptured],
                  ["Replies copied", replyCopiedCount],
                  ["Follow-ups due", desk.recoveryProof.followUpsDue],
                  ["Follow-ups sent", desk.recoveryProof.followUpsCompleted],
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
              <Link className={`${buttonClass} mt-auto w-full`} href="/dashboard/leads">
                View lead desk
              </Link>
            </DashboardCard>
          </section>

          <DashboardCard className="p-4" variant="elevated">
            <SectionHeader
              action={
                <Link
                  className="text-sm font-medium text-violet-700 hover:text-violet-800"
                  href="/dashboard/leads"
                >
                  View all leads
                </Link>
              }
              description="Newest quote requests, risk state, and the next owner action."
              title="Recent Leads"
            />
            <div className="mt-3 overflow-hidden rounded-lg border border-zinc-200">
              <div className="hidden grid-cols-[1.05fr_0.72fr_0.68fr_0.7fr_0.74fr_0.68fr_0.95fr_0.72fr_2rem] bg-slate-50 px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-slate-500 xl:grid">
                <span>Customer</span>
                <span>Service</span>
                <span>Source</span>
                <span>Quality</span>
                <span>SLA</span>
                <span>Status</span>
                <span>Next action</span>
                <span>Received</span>
                <span />
              </div>
              {recentLeads.length > 0 ? (
                recentLeads.map((item) => (
                  <Link
                    className="grid min-h-14 gap-2 border-t border-slate-200 px-3 py-2 text-xs transition hover:bg-slate-50 xl:grid-cols-[1.05fr_0.72fr_0.68fr_0.7fr_0.74fr_0.68fr_0.95fr_0.72fr_2rem] xl:items-center"
                    href={`/dashboard/leads/${item.lead.id}`}
                    key={item.lead.id}
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-slate-950">
                        {item.lead.customer_name ?? "Unnamed lead"}
                      </span>
                      <span className="block truncate text-xs text-slate-500">
                        {item.lead.customer_contact ?? "No contact captured"}
                      </span>
                    </span>
                    <span className="text-slate-700">
                      {item.lead.service_type ?? "Service not set"}
                    </span>
                    <span className="truncate text-slate-500">
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
                      {label(item.score.quality_level)}
                    </StatusBadge>
                    <ResponseSlaBadge value={item.lead.response_sla_state} />
                    <LeadStatusBadge value={item.lead.status} />
                    <span>
                      <span className="inline-flex rounded-md bg-slate-950 px-2 py-1 text-xs font-semibold text-white">
                        {item.recommendedAction}
                      </span>
                      <span className="mt-1 block text-xs leading-4 text-slate-500">
                        {item.primaryIssue}
                      </span>
                    </span>
                    <span className="text-xs text-slate-500">
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

          <DashboardCard className="p-4">
            <SectionHeader
              description="Fast owner shortcuts for the current Phase 5 workflow."
              title="Quick Actions"
            />
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <div className="flex min-h-14 items-center gap-2.5 rounded-[10px] border border-slate-200 bg-slate-50 px-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                  C
                </span>
                <CopyButton label="Copy quote link" value={quotePath} />
              </div>
              <QuickActionTile
                description="Edit quote form"
                href="/dashboard/configuration"
                icon="T"
                title="Customize template"
              />
              <QuickActionTile
                description="Logo, colors, text"
                href="/dashboard/configuration"
                icon="B"
                title="Edit branding"
              />
              <QuickActionTile
                description="Open lead desk"
                href="/dashboard/leads"
                icon="L"
                title="View leads"
              />
              <QuickActionTile
                description="See live page"
                href={quotePath}
                icon="P"
                title="Preview public page"
              />
            </div>
          </DashboardCard>
        </div>

        <aside className="space-y-3 xl:sticky xl:top-16">
          <RightRailPanel variant="priority">
            <SectionHeader
              description={`${actionCounts.reply + actionCounts.askInfo + actionCounts.followUp} items`}
              title="Today's action queue"
            />
            <div className="mt-3 grid gap-2">
              {[
                {
                  detail: `${actionCounts.reply} leads waiting`,
                  label: "Reply",
                  value: actionCounts.reply,
                },
                {
                  detail: `${actionCounts.askInfo} lead needs details`,
                  label: "Ask info",
                  value: actionCounts.askInfo,
                },
                {
                  detail: `${actionCounts.followUp} follow-up due today`,
                  label: "Follow-up",
                  value: actionCounts.followUp,
                },
              ].map((action) => (
                <Link
                  className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-2.5 rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm transition hover:bg-slate-50"
                  href="/dashboard/leads"
                  key={action.label}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700">
                    {action.value}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-slate-950">
                      {action.label}
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] text-slate-500">
                      {action.detail}
                    </span>
                  </span>
                  <span className="text-slate-400">&gt;</span>
                </Link>
              ))}
            </div>
            <Link className={`${buttonClass} mt-3 w-full`} href="/dashboard/leads">
              Open action queue
            </Link>
          </RightRailPanel>

          <RightRailPanel>
            <SectionHeader
              action={<StatusBadge tone="emerald">Active</StatusBadge>}
              description="Share this link wherever customers ask for quotes."
              title="Public quote link"
            />
            <p className="mt-3 break-all rounded-[10px] bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700">
              {quotePath}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <CopyButton label="Copy link" value={quotePath} />
              <Link className={buttonClass} href={quotePath}>
                Preview
              </Link>
            </div>
            <div className="mt-3 text-[11px] text-slate-600">
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
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link className={buttonClass} href="/dashboard/configuration">
                Placement guide
              </Link>
              <Link className={buttonClass} href="/dashboard/configuration">
                Edit link
              </Link>
            </div>
          </RightRailPanel>

          <RightRailPanel>
            <SectionHeader
              description="Highest leverage action right now."
              title="Next best step"
            />
            <p className="mt-3 text-xs leading-5 text-slate-700">
              {nextBestStep.description}
            </p>
            <Link className={`${buttonClass} mt-4 w-full`} href={nextBestStep.href}>
              {nextBestStep.title}
            </Link>
          </RightRailPanel>

          <RightRailPanel>
            <SectionHeader title="Recovery guidance" />
            <div className="mt-3 grid gap-2">
              {[
                {
                  href: "/dashboard/configuration",
                  title: "Place quote link",
                },
                {
                  href: "/dashboard/leads",
                  title: "Review follow-up queue",
                },
                {
                  href: quotePath,
                  title: "Check public quote page",
                },
              ].map((resource) => (
                <Link
                  className="flex items-center justify-between rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-violet-700 transition hover:bg-slate-50"
                  href={resource.href}
                  key={resource.title}
                >
                  <span>{resource.title}</span>
                  <span className="text-slate-400">&gt;</span>
                </Link>
              ))}
            </div>
          </RightRailPanel>
        </aside>
      </section>
    </main>
  );
}
