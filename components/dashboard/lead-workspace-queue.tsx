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
 * Last Updated: 2026-06-27
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
  primaryButtonClass,
  shortCustomerName,
  StatusBadge,
} from "@/components/dashboard/dashboard-ui";
import { CopyButton } from "@/components/dashboard/copy-button";
import { getBizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import type { SupportedLanguage } from "@/lib/i18n/language";
import type { LeadDeskItem } from "@/server/services/lead-conversion.service";

type LeadQueueCopy = ReturnType<typeof getBizPilotCopy>["dashboard"]["leadQueue"];

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
  language?: SupportedLanguage | undefined;
  leads: LeadDeskItem[];
  /** Hard cap on rendered rows — used by dashboard overview (5). */
  limit?: number;
  quotePath: string;
}>;

const filters: ReadonlyArray<{
  copyKey: keyof LeadQueueCopy["filters"];
  value: LeadFilter;
}> = [
  { copyKey: "all", value: "all" },
  { copyKey: "needsReply", value: "needs_reply" },
  { copyKey: "atRisk", value: "at_risk" },
  { copyKey: "missingInfo", value: "missing_info" },
  { copyKey: "aiReady", value: "ai_ready" },
  { copyKey: "reviewed", value: "reviewed" },
  { copyKey: "won", value: "won" },
  { copyKey: "lost", value: "lost" },
];

function formatAge(value: string | null, copy: LeadQueueCopy): string {
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
  if (diffDays < 7) return `${copy.age.day(diffDays)}${suffix}`;
  return new Intl.DateTimeFormat(copy.age.olderDateLocale, {
    dateStyle: "medium",
  }).format(new Date(value));
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

function displayStatus(item: LeadDeskItem, copy: LeadQueueCopy): {
  label: string;
  tone: "amber" | "blue" | "emerald" | "neutral" | "red";
} {
  if (item.lead.status === "booked") return { label: copy.status.won, tone: "emerald" };
  if (item.lead.status === "lost") return { label: copy.status.lost, tone: "neutral" };
  if (item.lead.status === "archived") return { label: copy.status.archived, tone: "neutral" };
  if (item.lead.response_sla_state === "overdue") return { label: copy.status.atRisk, tone: "red" };
  if (item.score.quality_level === "needs_info") return { label: copy.status.missingInfo, tone: "amber" };
  if (item.lead.status === "reviewed" || item.lead.status === "replied") {
    return { label: copy.status.reviewed, tone: "neutral" };
  }
  return { label: copy.status.needsReply, tone: "blue" };
}

function summarizeService(item: LeadDeskItem, copy: LeadQueueCopy): string {
  return item.lead.service_type ?? copy.fallbacks.service;
}

function summarizeArea(item: LeadDeskItem, copy: LeadQueueCopy): string {
  return item.lead.city_or_service_area ?? copy.fallbacks.area;
}

function CustomerCell({
  copy,
  item,
  wrap = false,
}: Readonly<{ copy: LeadQueueCopy; item: LeadDeskItem; wrap?: boolean }>) {
  const sub = item.lead.customer_contact ?? summarizeService(item, copy);
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <Avatar name={item.lead.customer_name} size={36} />
      <div className="min-w-0">
        <p
          className={
            wrap
              ? "break-words text-[13px] font-black leading-5 text-[var(--dash-text)]"
              : "truncate text-[13px] font-black text-[var(--dash-text)]"
          }
        >
          {shortCustomerName(item.lead.customer_name, copy.fallbacks.unnamedLead)}
        </p>
        <p
          className={
            wrap
              ? "mt-0.5 break-all text-[12px] leading-4 text-[var(--dash-text-muted)]"
              : "mt-0.5 truncate text-[12px] text-[var(--dash-text-muted)]"
          }
        >
          {sub}
        </p>
      </div>
    </div>
  );
}

function LeadMobileCard({
  copy,
  item,
}: Readonly<{ copy: LeadQueueCopy; item: LeadDeskItem }>) {
  const status = displayStatus(item, copy);
  return (
    <Link
      className="grid min-w-0 gap-3 overflow-hidden border-b border-[var(--dash-border)] p-3.5 text-[13px] transition last:border-b-0 hover:bg-[var(--dash-primary-soft)] xl:hidden"
      href={`/dashboard/leads/${item.lead.id}`}
    >
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        <CustomerCell copy={copy} item={item} wrap />
        <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <span className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-2.5">
          <span className="block text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--dash-text-muted)]">
            {copy.headers.service}
          </span>
          <span className="mt-1 block break-words text-[var(--dash-text)]">
            {summarizeService(item, copy)}
          </span>
        </span>
        <span className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-2.5">
          <span className="block text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--dash-text-muted)]">
            {copy.headers.location}
          </span>
          <span className="mt-1 block break-words text-[var(--dash-text)]">
            {summarizeArea(item, copy)}
          </span>
        </span>
      </div>
      <span className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-2.5">
        <span className="block text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--dash-text-muted)]">
          {copy.headers.nextAction}
        </span>
        <span className="mt-1 block text-[12px] leading-5 text-[var(--dash-text-secondary)]">
          {item.recommendedAction}
        </span>
      </span>
    </Link>
  );
}

const COL_TEMPLATE =
  "grid-cols-[minmax(0,1.35fr)_minmax(0,0.95fr)_minmax(0,0.95fr)_96px_minmax(112px,0.75fr)_minmax(0,1.2fr)]";

function LeadDesktopRow({
  copy,
  item,
}: Readonly<{ copy: LeadQueueCopy; item: LeadDeskItem }>) {
  const status = displayStatus(item, copy);
  return (
    <Link
      className={`hidden ${COL_TEMPLATE} items-center gap-3 border-b border-[var(--dash-border)] px-3 py-2.5 text-[13px] transition last:border-b-0 hover:bg-[var(--dash-primary-soft)] xl:grid`}
      href={`/dashboard/leads/${item.lead.id}`}
    >
      <CustomerCell copy={copy} item={item} />
      <span className="truncate text-[var(--dash-text-secondary)]">
        {summarizeService(item, copy)}
      </span>
      <span className="truncate text-[var(--dash-text-secondary)]">
        {summarizeArea(item, copy)}
      </span>
      <span className="text-[var(--dash-text-muted)]">
        {formatAge(item.lead.created_at, copy)}
      </span>
      <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
      <span className="min-w-0 truncate text-[var(--dash-text-secondary)]">
        {item.recommendedAction}
      </span>
    </Link>
  );
}

function LeadDesktopHeader({ copy }: Readonly<{ copy: LeadQueueCopy }>) {
  return (
    <div
      className={`sticky top-0 z-10 hidden ${COL_TEMPLATE} items-center gap-3 border-b border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-2.5 text-[11px] font-black uppercase text-[var(--dash-text-muted)] xl:grid`}
    >
      <span>{copy.headers.customer}</span>
      <span>{copy.headers.service}</span>
      <span>{copy.headers.location}</span>
      <span>{copy.headers.requested}</span>
      <span>{copy.headers.status}</span>
      <span>{copy.headers.nextAction}</span>
    </div>
  );
}

function QueueInsightStrip({
  atRiskCount,
  copy,
  missingInfoCount,
  needsReplyCount,
  totalCount,
  visibleCount,
}: Readonly<{
  atRiskCount: number;
  copy: LeadQueueCopy;
  missingInfoCount: number;
  needsReplyCount: number;
  totalCount: number;
  visibleCount: number;
}>) {
  return (
    <div className="mt-3 grid gap-2 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
      <div className="flex flex-wrap gap-2">
        <StatusBadge tone="neutral">
          {copy.resultSummary(visibleCount, totalCount)}
        </StatusBadge>
        <StatusBadge tone={needsReplyCount > 0 ? "blue" : "neutral"}>
          {copy.status.needsReply}: {needsReplyCount}
        </StatusBadge>
        <StatusBadge tone={atRiskCount > 0 ? "red" : "neutral"}>
          {copy.status.atRisk}: {atRiskCount}
        </StatusBadge>
        <StatusBadge tone={missingInfoCount > 0 ? "amber" : "neutral"}>
          {copy.status.missingInfo}: {missingInfoCount}
        </StatusBadge>
      </div>
      <p className="text-[12px] leading-5 text-[var(--dash-text-muted)]">
        {copy.priorityHint}
      </p>
    </div>
  );
}

function SampleLeadEmptyState({
  language,
  quotePath,
}: Readonly<{ language?: SupportedLanguage | undefined; quotePath: string }>) {
  const copy = getBizPilotCopy(language);
  const sampleLeads = copy.demo.sampleLeads;
  const [selectedLeadIndex, setSelectedLeadIndex] = useState(0);
  const fallbackLead = {
    area: copy.demo.sampleAreas[0] ?? "",
    customer: copy.demo.featuredLeadTitle,
    detail: copy.demo.detailOne,
    followUpDraft: copy.demo.followUpDraft,
    replyDraft: copy.demo.replyDraft,
    status: copy.demo.sampleStatuses[0] ?? copy.demo.missingInfoLabel,
    tone: "amber" as const,
  };
  const featured =
    sampleLeads[selectedLeadIndex] ?? sampleLeads[0] ?? fallbackLead;

  return (
    <div className="grid gap-4 rounded-lg border border-dashed border-[var(--dash-primary)] bg-[var(--dash-primary-soft)] p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge tone="amber">{copy.demo.sampleDemoState}</StatusBadge>
        <StatusBadge tone="red">{copy.demo.replyNeeded}</StatusBadge>
        <StatusBadge tone="emerald">{copy.demo.aiDraftReady}</StatusBadge>
        <StatusBadge tone="blue">{copy.demo.notStored}</StatusBadge>
      </div>

      <div className="grid items-start gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.9fr)]">
        <div className="flex items-center gap-3">
          <Avatar name={featured.customer} size={44} tone="primary" />
          <div>
            <p className="text-[15px] font-black text-[var(--dash-text)]">
              {shortCustomerName(
                featured.customer,
                copy.dashboard.leadQueue.fallbacks.unnamedLead,
              )}
            </p>
            <p className="mt-1 text-[13px] leading-5 text-[var(--dash-text-secondary)]">
              {featured.detail}
            </p>
          </div>
        </div>
        <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] p-3 text-[13px] leading-5 text-[var(--dash-text-secondary)]">
          <span className="font-black text-[var(--dash-text)]">
            {copy.demo.aiSummaryLabel}
          </span>{" "}
          {copy.demo.aiSummary}
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {sampleLeads.map((lead, index) => (
          <button
            aria-pressed={selectedLeadIndex === index}
            className={
              selectedLeadIndex === index
                ? "grid gap-2 rounded-lg border border-[var(--dash-primary)] bg-[var(--dash-primary-soft)] p-3 text-left transition"
                : "grid gap-2 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] p-3 text-left transition hover:border-[var(--dash-primary)] hover:bg-[var(--dash-primary-soft)]"
            }
            key={lead.customer}
            onClick={() => setSelectedLeadIndex(index)}
            type="button"
          >
            <div className="flex min-w-0 items-start justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2.5">
                <Avatar name={lead.customer} size={34} />
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-black text-[var(--dash-text)]">
                    {shortCustomerName(
                      lead.customer,
                      copy.dashboard.leadQueue.fallbacks.unnamedLead,
                    )}
                  </span>
                  <span className="mt-0.5 block truncate text-[12px] text-[var(--dash-text-muted)]">
                    {lead.area}
                  </span>
                </span>
              </div>
              <StatusBadge tone={lead.tone}>{lead.status}</StatusBadge>
            </div>
            <p className="text-[12px] leading-5 text-[var(--dash-text-secondary)]">
              {lead.detail}
            </p>
          </button>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] p-3 text-[13px] leading-5 text-[var(--dash-text-secondary)]">
          <span className="font-black text-[var(--dash-text)]">{copy.demo.missingInfoLabel}</span>{" "}
          {copy.demo.missingInfo}
        </div>
        <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] p-3 text-[13px] leading-5 text-[var(--dash-text-secondary)]">
          <span className="font-black text-[var(--dash-text)]">{copy.demo.suggestedNextActionLabel}</span>{" "}
          {copy.demo.suggestedNextAction}
        </div>
        <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] p-3 text-[13px] leading-5 text-[var(--dash-text-secondary)]">
          <span className="font-black text-[var(--dash-text)]">{copy.demo.replyDraftLabel}</span>{" "}
          {featured.replyDraft}
        </div>
        <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] p-3 text-[13px] leading-5 text-[var(--dash-text-secondary)]">
          <span className="font-black text-[var(--dash-text)]">{copy.demo.followUpLabel}</span>{" "}
          {featured.followUpDraft}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link className={primaryButtonClass} href="/dashboard/leads">
          {copy.demo.reviewReply}
        </Link>
        <CopyButton
          failedLabel={copy.dashboard.actions.copyFailed}
          label={copy.demo.copyResponse}
          successLabel={copy.dashboard.actions.copySuccess}
          value={featured.replyDraft}
        />
        <button className={buttonClass} disabled type="button">
          {copy.demo.markContacted}
        </button>
        <CopyButton
          failedLabel={copy.dashboard.actions.copyFailed}
          label={copy.demo.shareQuoteLink}
          successLabel={copy.dashboard.actions.copySuccess}
          value={quotePath}
        />
      </div>

      <p className="text-[12px] leading-5 text-[var(--dash-text-muted)]">
        {copy.demo.disappearsNote}
      </p>
    </div>
  );
}

function LeadQueueEmptyStarter({
  language,
  quotePath,
}: Readonly<{ language?: SupportedLanguage | undefined; quotePath: string }>) {
  const copy = getBizPilotCopy(language);
  const queueCopy = copy.dashboard.leadQueue;

  return (
    <div className="grid gap-4 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-4 sm:p-5">
      <EmptyState title={queueCopy.empty.noLeadsTitle}>
        {queueCopy.empty.noLeadsBody}
      </EmptyState>
      <div className="flex flex-wrap justify-center gap-2">
        <CopyButton
          failedLabel={copy.dashboard.actions.copyFailed}
          label={copy.demo.shareQuoteLink}
          successLabel={copy.dashboard.actions.copySuccess}
          value={quotePath}
        />
        <Link className={buttonClass} href="/dashboard/quote-setup">
          {copy.dashboard.nav.quoteSetup}
        </Link>
      </div>
      <details className="rounded-lg border border-dashed border-[var(--dash-primary)] bg-[var(--dash-primary-soft)]">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-black text-[var(--dash-text)]">
          {copy.demo.sampleDemoState}
          <span className="ml-2 text-[12px] font-bold text-[var(--dash-text-muted)]">
            {copy.demo.notStored}
          </span>
        </summary>
        <div className="border-t border-[rgba(20,184,166,0.18)] p-3">
          <SampleLeadEmptyState language={language} quotePath={quotePath} />
        </div>
      </details>
    </div>
  );
}

export function LeadWorkspaceQueue({
  compact = false,
  language,
  leads,
  limit,
  quotePath,
}: LeadWorkspaceQueueProps) {
  const copy = getBizPilotCopy(language);
  const queueCopy = copy.dashboard.leadQueue;
  const [activeFilter, setActiveFilter] = useState<LeadFilter>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<LeadSort>("most_urgent");

  const hasActiveFilter = activeFilter !== "all" || search.trim().length > 0;
  const needsReplyCount = leads.filter((item) => matchesFilter(item, "needs_reply")).length;
  const atRiskCount = leads.filter((item) => matchesFilter(item, "at_risk")).length;
  const missingInfoCount = leads.filter((item) => matchesFilter(item, "missing_info")).length;

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
        <div className="border-b border-[var(--dash-border)] p-3">
          <div className="flex flex-wrap items-center gap-2">
            <input
              aria-label={queueCopy.searchAriaLabel}
              className={`${inputClass} min-w-0 flex-[1_1_280px]`}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={queueCopy.searchPlaceholder}
              type="search"
              value={search}
            />
            <select
              aria-label={queueCopy.filterAriaLabel}
              className={`${inputClass} flex-[0_0_176px]`}
              onChange={(event) => setActiveFilter(event.target.value as LeadFilter)}
              value={activeFilter}
            >
              {filters.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {queueCopy.filters[filter.copyKey]}
                </option>
              ))}
            </select>
            <select
              aria-label={queueCopy.sortAriaLabel}
              className={`${inputClass} flex-[0_0_154px]`}
              onChange={(event) => setSort(event.target.value as LeadSort)}
              value={sort}
            >
              <option value="most_urgent">{queueCopy.sorts.mostUrgent}</option>
              <option value="newest">{queueCopy.sorts.newest}</option>
              <option value="oldest">{queueCopy.sorts.oldest}</option>
            </select>
            <button
              className={`${buttonClass} flex-[0_0_auto]`}
              onClick={clearFilters}
              type="button"
            >
              {queueCopy.reset}
            </button>
          </div>
          <QueueInsightStrip
            atRiskCount={atRiskCount}
            copy={queueCopy}
            missingInfoCount={missingInfoCount}
            needsReplyCount={needsReplyCount}
            totalCount={leads.length}
            visibleCount={filteredLeads.length}
          />
        </div>
      ) : null}

      <div className="min-w-0">
        {filteredLeads.length > 0 ? (
          <>
            <LeadDesktopHeader copy={queueCopy} />
            <div className="xl:hidden">
              {filteredLeads.map((item) => (
                <LeadMobileCard copy={queueCopy} item={item} key={item.lead.id} />
              ))}
            </div>
            <div className="hidden xl:block">
              {filteredLeads.map((item) => (
                <LeadDesktopRow copy={queueCopy} item={item} key={item.lead.id} />
              ))}
            </div>
          </>
        ) : (
          <div className="p-4">
            {leads.length === 0 ? (
              <LeadQueueEmptyStarter language={language} quotePath={quotePath} />
            ) : hasActiveFilter ? (
              <EmptyState
                action={
                  <button className={buttonClass} onClick={clearFilters} type="button">
                    {queueCopy.empty.clearFilters}
                  </button>
                }
                title={queueCopy.empty.filteredTitle}
              >
                {queueCopy.empty.filteredBody}
              </EmptyState>
            ) : (
              <EmptyState title={queueCopy.empty.noLeadsTitle}>
                {queueCopy.empty.noLeadsBody}
              </EmptyState>
            )}
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
