"use client";

/**
 * ============================================================
 * File: components/dashboard/lead-workspace-queue.tsx
 * Project: BizPilot AI
 * Description: Interactive Lead Recovery Queue table.
 * Role: Filters + sort + privacy-safe customer cell with avatar/initials; no horizontal scroll on common laptop widths; deterministic 5-row limit when used in the dashboard overview.
 * Related:
 * - app/(dashboard)/dashboard/leads/page.tsx
 * - app/(dashboard)/dashboard/page.tsx
 * - components/dashboard/dashboard-ui.tsx
 * Author: MoOoH
 * Created: 2026-05-11
 * Last Updated: 2026-05-19
 * Change Log:
 * - 2026-05-19: Rebuilt to match the approved index.html exactly — initials avatar, short customer name, no min-width horizontal scroll, single SectionHeader (page-level header lives on the route), and a `limit` prop for dashboard previews.
 * ============================================================
 */

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  Avatar,
  buttonClass,
  DashboardCard,
  EmptyState,
  inputClass,
  shortCustomerName,
  StatusBadge,
} from "@/components/dashboard/dashboard-ui";
import { CopyButton } from "@/components/dashboard/copy-button";
import type { LeadDeskItem } from "@/server/services/lead-conversion.service";

type LeadFilter =
  | "all"
  | "needs_reply"
  | "at_risk"
  | "missing_info"
  | "ai_ready"
  | "reviewed"
  | "won"
  | "lost";

type LeadSort = "newest" | "oldest" | "most_urgent";

type LeadWorkspaceQueueProps = Readonly<{
  /** When true, hide filter toolbar (overview preview mode). */
  compact?: boolean;
  leads: LeadDeskItem[];
  /** Hard cap on rendered rows — used by dashboard overview (5). */
  limit?: number;
  quotePath: string;
}>;

const filters: ReadonlyArray<{ label: string; value: LeadFilter }> = [
  { label: "All statuses", value: "all" },
  { label: "Needs reply", value: "needs_reply" },
  { label: "At risk", value: "at_risk" },
  { label: "Missing info", value: "missing_info" },
  { label: "AI draft ready", value: "ai_ready" },
  { label: "Reviewed", value: "reviewed" },
  { label: "Won", value: "won" },
  { label: "Lost", value: "lost" },
];

function formatAge(value: string | null): string {
  if (!value) return "—";
  const diffMinutes = Math.max(
    0,
    Math.round((Date.now() - new Date(value).getTime()) / 60000),
  );
  if (diffMinutes < 60) return `${Math.max(diffMinutes, 1)}m`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d`;
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
    new Date(value),
  );
}

function createdTimestamp(item: LeadDeskItem): number {
  return item.lead.created_at ? new Date(item.lead.created_at).getTime() : 0;
}

function urgencyScore(item: LeadDeskItem): number {
  if (item.lead.response_sla_state === "overdue") return 100;
  if (item.score.quality_level === "needs_info") return 86;
  if (item.lead.status === "new") return 80;
  if (item.lead.status === "follow_up_needed") return 72;
  if (item.action?.status === "open") return 65;
  return 20;
}

function matchesFilter(item: LeadDeskItem, filter: LeadFilter): boolean {
  if (filter === "all") return true;
  if (filter === "needs_reply") {
    return (
      item.lead.status === "new" ||
      item.lead.status === "follow_up_needed" ||
      item.lead.response_sla_state === "new" ||
      item.lead.response_sla_state === "overdue"
    );
  }
  if (filter === "at_risk") return item.lead.response_sla_state === "overdue";
  if (filter === "missing_info") return item.score.quality_level === "needs_info";
  if (filter === "ai_ready") {
    return (
      item.lead.status === "new" ||
      item.lead.status === "follow_up_needed" ||
      item.action?.status === "open" ||
      !item.lead.first_reply_copied_at
    );
  }
  if (filter === "reviewed") {
    return item.lead.status === "reviewed" || item.lead.status === "replied";
  }
  if (filter === "won") {
    return item.lead.status === "booked" || item.lead.manual_outcome === "booked";
  }
  if (filter === "lost") {
    return item.lead.status === "lost" || item.lead.manual_outcome === "lost";
  }
  return true;
}

function matchesSearch(item: LeadDeskItem, search: string): boolean {
  const normalizedSearch = search.trim().toLowerCase();
  if (normalizedSearch.length === 0) return true;
  return [
    item.lead.customer_name,
    item.lead.customer_contact,
    item.lead.service_type,
    item.lead.source_channel,
    item.lead.city_or_service_area,
    item.recommendedAction,
    item.primaryIssue,
    item.score.explanation,
  ]
    .filter((value): value is string => Boolean(value))
    .some((value) => value.toLowerCase().includes(normalizedSearch));
}

function sortLeads(leads: LeadDeskItem[], sort: LeadSort): LeadDeskItem[] {
  return [...leads].sort((left, right) => {
    if (sort === "oldest") {
      return createdTimestamp(left) - createdTimestamp(right);
    }
    if (sort === "most_urgent") {
      const urgencyDifference = urgencyScore(right) - urgencyScore(left);
      return urgencyDifference !== 0
        ? urgencyDifference
        : createdTimestamp(right) - createdTimestamp(left);
    }
    return createdTimestamp(right) - createdTimestamp(left);
  });
}

function displayStatus(item: LeadDeskItem): {
  label: string;
  tone: "amber" | "blue" | "emerald" | "neutral" | "red";
} {
  if (item.lead.status === "booked") return { label: "Won", tone: "emerald" };
  if (item.lead.status === "lost") return { label: "Lost", tone: "neutral" };
  if (item.lead.status === "archived") return { label: "Archived", tone: "neutral" };
  if (item.lead.response_sla_state === "overdue") return { label: "At risk", tone: "red" };
  if (item.score.quality_level === "needs_info") return { label: "Missing info", tone: "amber" };
  if (item.lead.status === "reviewed" || item.lead.status === "replied") {
    return { label: "Reviewed", tone: "neutral" };
  }
  return { label: "Needs reply", tone: "blue" };
}

function summarizeService(item: LeadDeskItem): string {
  return item.lead.service_type ?? "Service not set";
}

function summarizeArea(item: LeadDeskItem): string {
  return item.lead.city_or_service_area ?? "Area pending";
}

function CustomerCell({ item }: Readonly<{ item: LeadDeskItem }>) {
  const sub = item.lead.customer_contact ?? summarizeService(item);
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <Avatar name={item.lead.customer_name} size={36} />
      <div className="min-w-0">
        <p className="truncate text-[13px] font-black text-[var(--dash-text)]">
          {shortCustomerName(item.lead.customer_name)}
        </p>
        <p className="mt-0.5 truncate text-[12px] text-[var(--dash-text-muted)]">
          {sub}
        </p>
      </div>
    </div>
  );
}

function LeadMobileCard({ item }: Readonly<{ item: LeadDeskItem }>) {
  const status = displayStatus(item);
  return (
    <Link
      className="grid gap-3 border-b border-[var(--dash-border)] p-3.5 text-[13px] transition last:border-b-0 hover:bg-[var(--dash-primary-soft)] xl:hidden"
      href={`/dashboard/leads/${item.lead.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <CustomerCell item={item} />
        <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <span className="rounded-[12px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-2.5">
          <span className="block text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--dash-text-muted)]">
            Service
          </span>
          <span className="mt-1 block truncate text-[var(--dash-text)]">
            {summarizeService(item)}
          </span>
        </span>
        <span className="rounded-[12px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-2.5">
          <span className="block text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--dash-text-muted)]">
            Location
          </span>
          <span className="mt-1 block truncate text-[var(--dash-text)]">
            {summarizeArea(item)}
          </span>
        </span>
      </div>
    </Link>
  );
}

const COL_TEMPLATE =
  "grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_120px_72px_minmax(0,1fr)]";

function LeadDesktopRow({ item }: Readonly<{ item: LeadDeskItem }>) {
  const status = displayStatus(item);
  return (
    <Link
      className={`hidden ${COL_TEMPLATE} items-center gap-3 border-b border-[var(--dash-border)] px-4 py-3 text-[13px] transition last:border-b-0 hover:bg-[var(--dash-primary-soft)] xl:grid`}
      href={`/dashboard/leads/${item.lead.id}`}
    >
      <CustomerCell item={item} />
      <span className="truncate text-[var(--dash-text-secondary)]">
        {summarizeService(item)}
      </span>
      <span className="truncate text-[var(--dash-text-secondary)]">
        {summarizeArea(item)}
      </span>
      <span className="text-[var(--dash-text-muted)]">
        {formatAge(item.lead.created_at)} ago
      </span>
      <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
      <span className="min-w-0 truncate text-[var(--dash-text-secondary)]">
        {item.recommendedAction}
      </span>
    </Link>
  );
}

function LeadDesktopHeader() {
  return (
    <div
      className={`hidden ${COL_TEMPLATE} items-center gap-3 border-b border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-4 py-3 text-[11px] font-black uppercase tracking-[0.08em] text-[var(--dash-text-muted)] xl:grid`}
    >
      <span>Customer</span>
      <span>Service</span>
      <span>Location</span>
      <span>Requested</span>
      <span>Status</span>
      <span>Next action</span>
    </div>
  );
}

function SampleLeadEmptyState({ quotePath }: Readonly<{ quotePath: string }>) {
  return (
    <div className="grid gap-4 rounded-[20px] border border-dashed border-[rgba(20,184,166,0.28)] bg-[var(--dash-primary-soft)] p-5">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge tone="amber">Sample lead</StatusBadge>
        <StatusBadge tone="red">Reply needed</StatusBadge>
        <StatusBadge tone="emerald">AI draft ready</StatusBadge>
      </div>
      <div className="grid items-center gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.9fr)_11rem]">
        <div className="flex items-center gap-3">
          <Avatar name="Maria Santos" size={44} tone="primary" />
          <div>
            <p className="text-[15px] font-black text-[var(--dash-text)]">
              Maria S. — move-out cleaning
            </p>
            <p className="mt-1 text-[13px] leading-5 text-[var(--dash-text-secondary)]">
              2-bedroom apartment, downtown. Needs help before Friday.
            </p>
          </div>
        </div>
        <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] p-3 text-[13px] leading-5 text-[var(--dash-text-secondary)]">
          <span className="font-black text-[var(--dash-text)]">Next action:</span>{" "}
          Ask for the time window, then copy an owner-reviewed reply.
        </div>
        <div className="grid gap-2 lg:grid-cols-1">
          <CopyButton label="Copy quote link" value={quotePath} />
          <Link className={buttonClass} href="/dashboard/configuration">
            Check setup
          </Link>
        </div>
      </div>
      <p className="text-[12px] leading-5 text-[var(--dash-text-muted)]">
        Sample is not stored as customer data. It shows the workflow until real
        quote requests arrive.
      </p>
    </div>
  );
}

export function LeadWorkspaceQueue({
  compact = false,
  leads,
  limit,
  quotePath,
}: LeadWorkspaceQueueProps) {
  const [activeFilter, setActiveFilter] = useState<LeadFilter>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<LeadSort>("most_urgent");

  const hasActiveFilter = activeFilter !== "all" || search.trim().length > 0;

  const filteredLeads = useMemo(() => {
    const sorted = sortLeads(
      leads.filter(
        (item) => matchesFilter(item, activeFilter) && matchesSearch(item, search),
      ),
      sort,
    );
    return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
  }, [activeFilter, leads, limit, search, sort]);

  function clearFilters() {
    setActiveFilter("all");
    setSearch("");
    setSort("most_urgent");
  }

  return (
    <DashboardCard className="overflow-hidden p-0" variant="elevated">
      {!compact ? (
        <div className="border-b border-[var(--dash-border)] p-4 sm:p-[18px]">
          <div className="flex flex-wrap items-center gap-2">
            <input
              className={`${inputClass} min-w-0 flex-[1_1_240px]`}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search leads, city, service…"
              type="search"
              value={search}
            />
            <select
              className={`${inputClass} flex-[0_0_180px]`}
              onChange={(event) => setActiveFilter(event.target.value as LeadFilter)}
              value={activeFilter}
            >
              {filters.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
            <select
              className={`${inputClass} flex-[0_0_160px]`}
              onChange={(event) => setSort(event.target.value as LeadSort)}
              value={sort}
            >
              <option value="most_urgent">Most urgent</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
            <button
              className={`${buttonClass} flex-[0_0_auto]`}
              onClick={clearFilters}
              type="button"
            >
              Reset
            </button>
          </div>
        </div>
      ) : null}

      <div className="min-w-0">
        {filteredLeads.length > 0 ? (
          <>
            <LeadDesktopHeader />
            <div className="xl:hidden">
              {filteredLeads.map((item) => (
                <LeadMobileCard item={item} key={item.lead.id} />
              ))}
            </div>
            <div className="hidden xl:block">
              {filteredLeads.map((item) => (
                <LeadDesktopRow item={item} key={item.lead.id} />
              ))}
            </div>
          </>
        ) : (
          <div className="p-4">
            {leads.length === 0 ? (
              <SampleLeadEmptyState quotePath={quotePath} />
            ) : hasActiveFilter ? (
              <EmptyState
                action={
                  <button className={buttonClass} onClick={clearFilters} type="button">
                    Clear filters
                  </button>
                }
                title="No leads match those filters."
              >
                Try another search, clear filters, or sort by newest quote requests.
              </EmptyState>
            ) : (
              <EmptyState title="No leads yet.">
                Share your quote link to start capturing requests.
              </EmptyState>
            )}
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
