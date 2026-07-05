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
 * Last Updated: 2026-07-04
 * Change Log:
 * - 2026-05-19: Rebuilt the overview from the approved index.html source of truth with workflow-first hierarchy.
 * - 2026-06-27: Promoted the overview hero title to the page H1 after topbar heading cleanup.
 * - 2026-06-27: Consolidated the owner command lane and KPI strip into one calmer action board.
 * - 2026-06-27: Added a first-run Start Here path for owner setup, sharing, and lead review.
 * - 2026-06-27: Reworked the first viewport into a prioritized next-action cockpit.
 * - 2026-06-27: Hid synthetic/internal seed labels behind owner-safe display fallbacks.
 * - 2026-07-04: Simplified the overview hierarchy around one action-first cockpit and moved charts below the manual queue.
 * - 2026-07-04: Routed overview metrics into focused lead queue states instead of ambiguous public-form destinations.
 * - 2026-07-04: Upgraded the Today panel into a richer manual queue with reasons and route-level CTAs.
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

type DashboardTone = "amber" | "blue" | "emerald" | "neutral" | "red" | "violet";

type LeadSourceSegment = Readonly<{
  color: string;
  label: string;
  value: number;
}>;

type OwnerTrendPoint = Readonly<{
  count: number;
  label: string;
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
    border: "rgba(14, 165, 233, 0.28)",
    soft: "rgba(14, 165, 233, 0.12)",
    strong: "#0284c7",
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
  violet: {
    border: "rgba(124, 58, 237, 0.26)",
    soft: "rgba(124, 58, 237, 0.12)",
    strong: "#6d28d9",
  },
};

function compactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
    Math.max(0, value),
  );
}

function normalizeLeadSource(value: string | null): string {
  const normalized = (value ?? "").trim().toLowerCase();

  if (!normalized || normalized.includes("web") || normalized.includes("site")) {
    return "Website";
  }

  if (normalized.includes("google") || normalized.includes("search")) {
    return "Google";
  }

  if (normalized.includes("facebook") || normalized === "fb") {
    return "Facebook";
  }

  if (normalized.includes("instagram") || normalized === "ig") {
    return "Instagram";
  }

  return "Other";
}

function buildLeadSourceSegments(leads: LeadDeskItem[]): LeadSourceSegment[] {
  const sourceOrder = ["Website", "Google", "Facebook", "Instagram", "Other"];
  const sourceColors: Record<string, string> = {
    Facebook: "#f59e0b",
    Google: "#0ea5e9",
    Instagram: "#ef4444",
    Other: "#14b8a6",
    Website: "#6d5dfc",
  };
  const counts = new Map(sourceOrder.map((label) => [label, 0]));

  for (const item of leads) {
    const label = normalizeLeadSource(item.lead.source_channel);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  return sourceOrder.map((label) => ({
    color: sourceColors[label] ?? "#64748b",
    label,
    value: counts.get(label) ?? 0,
  }));
}

function buildOwnerLeadTrend(leads: LeadDeskItem[], days = 8): OwnerTrendPoint[] {
  const formatter = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
  });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: days }, (_, index) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (days - 1 - index));
    const nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    const count = leads.filter((item) => {
      const createdAt = new Date(item.lead.created_at);

      return createdAt >= day && createdAt < nextDay;
    }).length;

    return {
      count,
      label: formatter.format(day),
    };
  });
}

function conicGradientFor(segments: LeadSourceSegment[]): string {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  let cursor = 0;

  if (total <= 0) {
    return "conic-gradient(var(--dash-border) 0deg 360deg)";
  }

  return `conic-gradient(${segments
    .map((segment) => {
      const start = cursor;
      const end = cursor + (segment.value / total) * 360;
      cursor = end;

      return `${segment.color} ${start.toFixed(1)}deg ${end.toFixed(1)}deg`;
    })
    .join(", ")})`;
}

function OwnerTrendChart({
  ariaLabel,
  points,
}: Readonly<{ ariaLabel: string; points: readonly OwnerTrendPoint[] }>) {
  const width = 320;
  const height = 180;
  const paddingX = 18;
  const paddingY = 18;
  const maxCount = Math.max(1, ...points.map((point) => point.count));
  const coordinates = points.map((point, index) => {
    const x =
      paddingX +
      (index / Math.max(points.length - 1, 1)) * (width - paddingX * 2);
    const y =
      height -
      paddingY -
      (point.count / maxCount) * (height - paddingY * 2);

    return { ...point, x, y };
  });
  const line = coordinates
    .map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`)
    .join(" ");
  const area = [
    `${paddingX},${height - paddingY}`,
    line,
    `${width - paddingX},${height - paddingY}`,
  ].join(" ");

  return (
    <div className="mt-4 min-w-0">
      <svg
        aria-label={ariaLabel}
        className="h-[190px] w-full"
        preserveAspectRatio="none"
        role="img"
        viewBox={`0 0 ${width} ${height}`}
      >
        <defs>
          <linearGradient id="owner-trend-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#6d5dfc" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#6d5dfc" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((index) => {
          const y = paddingY + index * ((height - paddingY * 2) / 3);

          return (
            <line
              key={index}
              stroke="var(--dash-border)"
              strokeWidth="1"
              x1={paddingX}
              x2={width - paddingX}
              y1={y}
              y2={y}
            />
          );
        })}
        <polygon fill="url(#owner-trend-fill)" points={area} />
        <polyline
          fill="none"
          points={line}
          stroke="#4f46e5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
        {coordinates.map((point) => (
          <circle
            cx={point.x}
            cy={point.y}
            fill="#ffffff"
            key={`${point.label}-${point.count}`}
            r="3.8"
            stroke="#4f46e5"
            strokeWidth="2"
          />
        ))}
      </svg>
      <div className="mt-1 grid grid-cols-4 gap-1 text-[10.5px] font-bold text-[var(--dash-text-muted)] sm:grid-cols-8">
        {points.map((point) => (
          <span className="truncate" key={point.label}>
            {point.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function LeadSourcesDonut({
  centerLabel,
  segments,
  title,
  total,
  viewFullReport,
}: Readonly<{
  centerLabel: string;
  segments: readonly LeadSourceSegment[];
  title: string;
  total: number;
  viewFullReport: string;
}>) {
  const safeTotal = Math.max(total, 0);

  return (
    <DashboardCard className="p-4">
      <SectionHeader
        action={<StatusBadge tone="blue">{compactNumber(safeTotal)}</StatusBadge>}
        title={title}
      />
      <div className="mt-5 grid gap-4 sm:grid-cols-[minmax(150px,0.7fr)_minmax(0,1fr)] sm:items-center xl:grid-cols-1 2xl:grid-cols-[minmax(150px,0.7fr)_minmax(0,1fr)]">
        <div
          aria-label="New leads by source"
          className="mx-auto grid h-36 w-36 place-items-center rounded-full"
          role="img"
          style={{ background: conicGradientFor([...segments]) }}
        >
          <div className="grid h-[88px] w-[88px] place-items-center rounded-full border border-[var(--dash-border)] bg-[var(--dash-surface)] text-center">
            <span>
              <span className="block text-2xl font-black leading-none text-[var(--dash-text)]">
                {compactNumber(safeTotal)}
              </span>
              <span className="mt-1 block text-[11px] font-bold text-[var(--dash-text-secondary)]">
                {centerLabel}
              </span>
            </span>
          </div>
        </div>
        <div className="grid gap-2">
          {segments.map((segment) => {
            const percent =
              safeTotal > 0 ? Math.round((segment.value / safeTotal) * 100) : 0;

            return (
              <div
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 text-[12px]"
                key={segment.label}
              >
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="truncate font-bold text-[var(--dash-text-secondary)]">
                  {segment.label}
                </span>
                <span className="font-black text-[var(--dash-text)]">
                  {percent}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <Link
        className="mt-5 inline-flex text-[12px] font-black text-[var(--dash-primary-strong)]"
        href="/dashboard/leads"
      >
        {viewFullReport}
      </Link>
    </DashboardCard>
  );
}

function OwnerTodoTodayPanel({
  assistantBody,
  assistantTitle,
  items,
  title,
}: Readonly<{
  assistantBody: string;
  assistantTitle: string;
  items: ReadonlyArray<{
    actionLabel: string;
    count: number;
    detail: string;
    href: string;
    label: string;
    tone: DashboardTone;
  }>;
  title: string;
}>) {
  return (
    <DashboardCard className="p-4">
      <SectionHeader title={title} />
      <div className="mt-4 grid gap-2">
        {items.map((item) => {
          const toneStyle = dashboardToneStyles[item.tone];

          return (
            <Link
              className="grid min-h-[64px] grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-2.5 transition hover:border-[var(--dash-primary)] hover:bg-[var(--dash-primary-soft)]"
              href={item.href}
              key={item.label}
            >
              <span
                aria-hidden
                className="flex h-7 w-7 items-center justify-center rounded-md border text-[11px] font-black"
                style={{
                  backgroundColor: toneStyle.soft,
                  borderColor: toneStyle.border,
                  color: toneStyle.strong,
                }}
              >
                {compactNumber(item.count)}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[12px] font-black text-[var(--dash-text)]">
                  {item.label}
                </span>
                <span className="mt-0.5 block text-[11px] leading-4 text-[var(--dash-text-secondary)]">
                  {item.detail}
                </span>
              </span>
              <span className="whitespace-nowrap text-[11px] font-black text-[var(--dash-primary-strong)]">
                {item.actionLabel}
              </span>
            </Link>
          );
        })}
      </div>
      <div className="mt-4 rounded-lg border border-[var(--dash-primary-border)] bg-[var(--dash-primary-soft)] p-3">
        <p className="text-[12px] font-black text-[var(--dash-text)]">
          {assistantTitle}
        </p>
        <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
          {assistantBody}
        </p>
      </div>
    </DashboardCard>
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
  const visualCopy = overviewCopy.visualDashboard;
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
  const leadQueueHref = "/dashboard/leads";
  const leadQueueNeedsReplyHref = "/dashboard/leads?focus=needs_reply";
  const leadQueueAtRiskHref = "/dashboard/leads?focus=at_risk";
  const leadQueueMissingInfoHref = "/dashboard/leads?focus=missing_info";
  const leadQueueAiReadyHref = "/dashboard/leads?focus=ai_ready";
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
  const askInfoActions = desk.todaysActions.filter((action) => action.action_type === "ask_info").length;
  const followUpActions = desk.todaysActions.filter((action) => action.action_type === "follow_up").length;
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
      href: leadQueueHref,
      label: overviewCopy.metrics.newQuoteRequests.label,
      tone: "emerald" as const,
      value: newQuoteCount,
    },
    {
      detail: overviewCopy.metrics.needsReply.detail,
      href: leadQueueNeedsReplyHref,
      label: overviewCopy.metrics.needsReply.label,
      tone: needsReplyCount > 0 ? ("amber" as const) : ("neutral" as const),
      value: needsReplyCount,
    },
    {
      detail: overviewCopy.metrics.atRiskLeads.detail,
      href: leadQueueAtRiskHref,
      label: overviewCopy.metrics.atRiskLeads.label,
      tone: atRiskCount > 0 ? ("red" as const) : ("neutral" as const),
      value: atRiskCount,
    },
    {
      detail: overviewCopy.metrics.aiDraftsReady.detail,
      href: leadQueueAiReadyHref,
      label: overviewCopy.metrics.aiDraftsReady.label,
      tone: aiDraftReadyCount > 0 ? ("blue" as const) : ("neutral" as const),
      value: aiDraftReadyCount,
    },
  ];
  const ownerLeadTrend = buildOwnerLeadTrend(desk.leads);
  const leadSourceSegments = buildLeadSourceSegments(desk.leads);
  const todayTodoItems = [
    {
      actionLabel: overviewCopy.openQueue,
      count: needsReplyCount + atRiskCount,
      detail: overviewCopy.recoveryFocus.replyDetail(needsReplyCount + atRiskCount),
      href: leadQueueNeedsReplyHref,
      label: overviewCopy.recoveryFocus.replyTitle,
      tone: (needsReplyCount + atRiskCount > 0 ? "violet" : "neutral") as DashboardTone,
    },
    {
      actionLabel: overviewCopy.openQueue,
      count: followUpActions,
      detail: overviewCopy.recoveryFocus.followUpDetail(followUpActions),
      href: leadQueueNeedsReplyHref,
      label: overviewCopy.recoveryFocus.followUpTitle,
      tone: (followUpActions > 0 ? "blue" : "neutral") as DashboardTone,
    },
    {
      actionLabel: overviewCopy.finishSetup,
      count: missingReadinessItems.length,
      detail: firstMissingReadinessLabel ?? overviewCopy.readiness.activeAndReady,
      href: "/dashboard/configuration",
      label: visualCopy.todo.completeReadiness,
      tone: (missingReadinessItems.length > 0 ? "emerald" : "neutral") as DashboardTone,
    },
    {
      actionLabel: overviewCopy.openQueue,
      count: missingInfoCount + askInfoActions,
      detail: overviewCopy.recoveryFocus.missingInfoDetail(missingInfoCount + askInfoActions),
      href: leadQueueMissingInfoHref,
      label: overviewCopy.recoveryFocus.missingInfoTitle,
      tone: (missingInfoCount + askInfoActions > 0 ? "amber" : "neutral") as DashboardTone,
    },
    {
      actionLabel: overviewCopy.openQueue,
      count: aiDraftReadyCount,
      detail: overviewCopy.metrics.aiDraftsReady.detail,
      href: leadQueueAiReadyHref,
      label: overviewCopy.metrics.aiDraftsReady.label,
      tone: (aiDraftReadyCount > 0 ? "blue" : "neutral") as DashboardTone,
    },
  ];
  return (
    <main className="space-y-3">
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
        <div className="flex shrink-0 flex-wrap gap-2">
          <span className="inline-flex min-h-9 items-center rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 text-[12px] font-black text-[var(--dash-text-secondary)]">
            {visualCopy.dateRange}
          </span>
          <Link className={buttonClass} href={leadQueueNeedsReplyHref}>
            {visualCopy.filters}
          </Link>
          <Link className={primaryButtonClass} href={quotePath}>
            {visualCopy.newLead}
          </Link>
        </div>
      </header>

      <DashboardCard
        className="overflow-hidden p-0"
        variant="priority"
      >
        <div className="grid xl:grid-cols-[minmax(0,1.08fr)_minmax(330px,0.92fr)]">
          <section className="min-w-0 p-4 md:p-5">
            <StatusBadge tone="blue">{overviewCopy.heroBadge}</StatusBadge>
            <h2 className="mt-3 max-w-3xl text-[24px] font-black leading-tight text-[var(--dash-text)] sm:text-[30px]">
              {overviewCopy.heroTitle(attentionCount)}
            </h2>
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
                <Link className={buttonClass} href={leadQueueHref}>
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

      <OwnerTodoTodayPanel
        assistantBody={visualCopy.aiAssistantBody(needsReplyCount + atRiskCount)}
        assistantTitle={visualCopy.aiAssistantTitle}
        items={todayTodoItems}
        title={overviewCopy.recoveryFocus.title}
      />

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

          <details
            className="overflow-hidden rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)]"
            data-dashboard-optional-guide
          >
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

      <section
        className="grid min-w-0 gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.65fr)]"
        data-dashboard-insight-panel
      >
        <DashboardCard className="p-4">
          <SectionHeader
            action={
              <span className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-2.5 py-1 text-[11px] font-black text-[var(--dash-text-secondary)]">
                {visualCopy.dateRange}
              </span>
            }
            title={visualCopy.leadsTrend}
          />
          <OwnerTrendChart ariaLabel={visualCopy.leadsTrend} points={ownerLeadTrend} />
        </DashboardCard>

        <LeadSourcesDonut
          centerLabel={visualCopy.newLeadsCenter}
          segments={leadSourceSegments}
          title={visualCopy.leadSources}
          total={leadSourceSegments.reduce((sum, segment) => sum + segment.value, 0)}
          viewFullReport={visualCopy.viewFullReport}
        />
      </section>
    </main>
  );
}
