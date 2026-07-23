"use client";

/**
 * ============================================================
 * File: components/dashboard/premium-operations-workspace.tsx
 * Project: BizPilot AI
 * Description: Interactive Premium Operations workspace for priority discovery, manual draft review, and internal time coordination.
 * Role: Keeps three separately entitled add-ons compact, owner-controlled, and explicitly free of automatic sending or booking behavior.
 * Related:
 * - app/(dashboard)/dashboard/operations/page.tsx
 * - server/actions/premium-operations.actions.ts
 * - lib/i18n/dashboard-interface.ts
 * Author: MoOoH
 * Created: 2026-07-21
 * Last Updated: 2026-07-23
 * Change Log:
 * - 2026-07-23: Added a founder-only direct path from locked modules to the exact workspace entitlement controls.
 * - 2026-07-21: Created the Premium Operations dashboard workspace with manual-review safety rails.
 * - 2026-07-21: Localized all Premium Operations controls and blocked manual copying until review is recorded.
 * - 2026-07-21: Kept customer-facing bulk-reply defaults in the business language rather than the dashboard interface language.
 * - 2026-07-22: Added explicit audience filters, safe visible-only selection, full draft previews, one-step copy logging, and operating-timezone labels.
 * - 2026-07-22: Kept availability reply drafts left-to-right inside Persian and Arabic dashboard layouts.
 * ============================================================
 */

import { useMemo, useState } from "react";

import {
  cancelInternalTimeBlockAction,
  createAvailabilityReviewDraftAction,
  createBulkReplyDraftAction,
  createInternalTimeBlockAction,
  createPriorityRuleAction,
  deletePriorityRuleAction,
  reviewBulkReplyDraftAction,
} from "@/server/actions/premium-operations.actions";
import {
  buttonClass,
  DashboardCard,
  inputClass,
  labelClass,
  primaryButtonClass,
  StatusBadge,
  textareaClass,
} from "@/components/dashboard/dashboard-ui";
import { CopyAndRecordReplyButton } from "@/components/dashboard/copy-and-record-reply-button";
import {
  getDashboardInterfaceCopy,
  type DashboardInterfaceLanguage,
} from "@/lib/i18n/dashboard-interface";
import { getCustomerFacingBulkReplyDefaults } from "@/lib/i18n/customer-message-defaults";
import type { SupportedLanguage } from "@/lib/i18n/language";
import { BUSINESS_OPERATING_TIME_ZONE } from "@/lib/time/business-operating-time-zone";
import type { PremiumOperationsWorkspace } from "@/server/services/premium-operations.service";

type PremiumTab = "availability" | "bulkReply" | "prioritySearch";

type PremiumOperationsWorkspaceProps = Readonly<{
  adminControlHref?: string;
  businessLanguage: SupportedLanguage;
  canManage: boolean;
  language: DashboardInterfaceLanguage;
  workspace: PremiumOperationsWorkspace;
}>;

const ltrStructuredInputClass =
  "[direction:ltr] text-left tabular-nums [unicode-bidi:plaintext]";

function latinDateTime(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-CA", {
    calendar: "gregory",
    dateStyle: "medium",
    hour: "2-digit",
    minute: "2-digit",
    numberingSystem: "latn",
    timeZone: BUSINESS_OPERATING_TIME_ZONE,
    timeZoneName: "short",
  }).format(date);
}

function addonLocked(
  copy: ReturnType<typeof getDashboardInterfaceCopy>,
  adminControlHref?: string,
): React.ReactNode {
  return (
    <DashboardCard className="border-dashed p-4" variant="muted">
      <StatusBadge tone="neutral">{copy.common.premiumAddOn}</StatusBadge>
      <p className="mt-2 text-[13px] font-bold text-[var(--dash-text)]">
        {copy.common.approvalRequired}
      </p>
      <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
        {copy.premiumOperations.lockedDescription}
      </p>
      {adminControlHref ? (
        <a className={`${primaryButtonClass} mt-3`} href={adminControlHref}>
          {copy.premiumOperations.manageAccess}
        </a>
      ) : null}
    </DashboardCard>
  );
}

function priorityTone(rank: number | null): "amber" | "blue" | "emerald" | "neutral" | "red" {
  if (rank === null) return "neutral";
  if (rank <= 1) return "red";
  if (rank === 2) return "amber";
  if (rank === 3) return "blue";
  return "emerald";
}

function sortedUnique(values: Array<string | null>): string[] {
  return [...new Set(values.filter((value): value is string => Boolean(value)))].sort(
    (left, right) => left.localeCompare(right),
  );
}

export function PremiumOperationsWorkspace({
  adminControlHref,
  businessLanguage,
  canManage,
  language,
  workspace,
}: PremiumOperationsWorkspaceProps) {
  const copy = getDashboardInterfaceCopy(language);
  const customerDraftDefaults = getCustomerFacingBulkReplyDefaults(businessLanguage);
  const [activeTab, setActiveTab] = useState<PremiumTab>("prioritySearch");
  const [query, setQuery] = useState("");
  const [ruleId, setRuleId] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");
  const [requestedDateFilter, setRequestedDateFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
  const [draftTitle, setDraftTitle] = useState(
    customerDraftDefaults.title,
  );
  const [draftTemplate, setDraftTemplate] = useState(
    customerDraftDefaults.template,
  );

  const areaOptions = useMemo(
    () => sortedUnique(workspace.leads.map((lead) => lead.area)),
    [workspace.leads],
  );
  const serviceOptions = useMemo(
    () => sortedUnique(workspace.leads.map((lead) => lead.service)),
    [workspace.leads],
  );
  const statusOptions = useMemo(
    () => sortedUnique(workspace.leads.map((lead) => lead.status)),
    [workspace.leads],
  );
  const timeOptions = useMemo(
    () => sortedUnique(workspace.leads.map((lead) => lead.requestedTimeWindow)),
    [workspace.leads],
  );

  const filteredLeads = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("en-CA");
    return workspace.leads.filter((lead) => {
      if (ruleId !== "all" && !lead.priority.matchingRuleIds.includes(ruleId)) {
        return false;
      }
      if (areaFilter !== "all" && lead.area !== areaFilter) return false;
      if (serviceFilter !== "all" && lead.service !== serviceFilter) return false;
      if (statusFilter !== "all" && lead.status !== statusFilter) return false;
      if (
        timeFilter !== "all" &&
        lead.requestedTimeWindow !== timeFilter
      ) {
        return false;
      }
      if (requestedDateFilter && lead.requestedDate !== requestedDateFilter) {
        return false;
      }
      if (!normalizedQuery) return true;
      return [lead.customerName, lead.area, lead.service]
        .filter((value): value is string => Boolean(value))
        .some((value) => value.toLocaleLowerCase("en-CA").includes(normalizedQuery));
    });
  }, [
    areaFilter,
    query,
    requestedDateFilter,
    ruleId,
    serviceFilter,
    statusFilter,
    timeFilter,
    workspace.leads,
  ]);

  const selectableLeadIds = filteredLeads
    .filter((lead) => !["archived", "booked", "lost"].includes(lead.status))
    .map((lead) => lead.id);
  const selectedVisibleLeadIds = selectableLeadIds.filter((leadId) =>
    selectedLeadIds.has(leadId),
  );
  const recipientCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const recipient of workspace.recipients) {
      counts.set(recipient.draft_id, (counts.get(recipient.draft_id) ?? 0) + 1);
    }
    return counts;
  }, [workspace.recipients]);
  const batchById = useMemo(
    () => new Map(workspace.batches.map((batch) => [batch.id, batch])),
    [workspace.batches],
  );
  const leadById = useMemo(
    () => new Map(workspace.leads.map((lead) => [lead.id, lead])),
    [workspace.leads],
  );
  const recipientsByDraft = useMemo(() => {
    const recipients = new Map<
      string,
      PremiumOperationsWorkspace["recipients"]
    >();
    for (const recipient of workspace.recipients) {
      recipients.set(recipient.draft_id, [
        ...(recipients.get(recipient.draft_id) ?? []),
        recipient,
      ]);
    }
    return recipients;
  }, [workspace.recipients]);

  function leadStatusLabel(status: string): string {
    return (
      copy.premiumOperations.prioritySearch.statusLabels[
        status as keyof typeof copy.premiumOperations.prioritySearch.statusLabels
      ] ?? status.replaceAll("_", " ")
    );
  }

  function clearSelection(): void {
    setSelectedLeadIds(new Set());
  }

  function clearFilters(): void {
    setAreaFilter("all");
    setQuery("");
    setRequestedDateFilter("");
    setRuleId("all");
    setServiceFilter("all");
    setStatusFilter("all");
    setTimeFilter("all");
    clearSelection();
  }

  function renderLeadFilters(): React.ReactNode {
    const filters = copy.premiumOperations.prioritySearch.filters;
    return (
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        <label className={labelClass}>
          {copy.common.search}
          <input
            className={inputClass}
            onChange={(event) => {
              clearSelection();
              setQuery(event.target.value);
            }}
            placeholder={copy.premiumOperations.prioritySearch.queryPlaceholder}
            type="search"
            value={query}
          />
        </label>
        <label className={labelClass}>
          {copy.premiumOperations.prioritySearch.rulesLabel}
          <select
            className={inputClass}
            onChange={(event) => {
              clearSelection();
              setRuleId(event.target.value);
            }}
            value={ruleId}
          >
            <option value="all">
              {copy.premiumOperations.prioritySearch.allRules}
            </option>
            {workspace.priorityRules
              .filter((rule) => rule.is_active)
              .map((rule) => (
                <option key={rule.id} value={rule.id}>
                  {rule.name}
                </option>
              ))}
          </select>
        </label>
        <label className={labelClass}>
          {filters.service}
          <select
            className={inputClass}
            onChange={(event) => {
              clearSelection();
              setServiceFilter(event.target.value);
            }}
            value={serviceFilter}
          >
            <option value="all">{filters.allValues}</option>
            {serviceOptions.map((service) => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          {filters.location}
          <select
            className={inputClass}
            onChange={(event) => {
              clearSelection();
              setAreaFilter(event.target.value);
            }}
            value={areaFilter}
          >
            <option value="all">{filters.allValues}</option>
            {areaOptions.map((area) => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          {filters.status}
          <select
            className={inputClass}
            onChange={(event) => {
              clearSelection();
              setStatusFilter(event.target.value);
            }}
            value={statusFilter}
          >
            <option value="all">{filters.allValues}</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>{leadStatusLabel(status)}</option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          {filters.requestedDate}
          <input
            className={`${inputClass} ${ltrStructuredInputClass}`}
            dir="ltr"
            lang="en-CA"
            onChange={(event) => {
              clearSelection();
              setRequestedDateFilter(event.target.value);
            }}
            type="date"
            value={requestedDateFilter}
          />
        </label>
        <label className={labelClass}>
          {filters.requestedTime}
          <select
            className={`${inputClass} ${ltrStructuredInputClass}`}
            dir="ltr"
            lang="en-CA"
            onChange={(event) => {
              clearSelection();
              setTimeFilter(event.target.value);
            }}
            value={timeFilter}
          >
            <option value="all">{filters.allValues}</option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </label>
        <div className="flex items-end">
          <button className={buttonClass} onClick={clearFilters} type="button">
            {copy.common.clear}
          </button>
        </div>
      </div>
    );
  }

  function toggleLead(leadId: string): void {
    setSelectedLeadIds((current) => {
      const next = new Set(current);
      if (next.has(leadId)) next.delete(leadId);
      else if (next.size < 50) next.add(leadId);
      return next;
    });
  }

  function selectVisible(): void {
    setSelectedLeadIds((current) => {
      const next = new Set(current);
      for (const leadId of selectableLeadIds) {
        if (next.size >= 50) break;
        next.add(leadId);
      }
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <DashboardCard className="p-4 sm:p-5" variant="priority">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <StatusBadge tone="blue">{copy.premiumOperations.badge}</StatusBadge>
            <h2 className="mt-2 text-[20px] font-black text-[var(--dash-text)]">
              {copy.premiumOperations.title}
            </h2>
            <p className="mt-1 max-w-3xl text-[13px] leading-5 text-[var(--dash-text-secondary)]">
              {copy.premiumOperations.description}
            </p>
            {workspace.leadLimitReached ? (
              <p className="mt-2 text-[12px] font-bold text-[var(--dash-warning-strong)]">
                {copy.premiumOperations.prioritySearch.availabilityCheckLimit}
              </p>
            ) : null}
          </div>
          <div
            aria-label={copy.premiumOperations.title}
            className="flex max-w-full flex-wrap gap-1 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-1"
            role="tablist"
          >
            {(
              [
                ["prioritySearch", copy.premiumOperations.tabs.prioritySearch],
                ["bulkReply", copy.premiumOperations.tabs.bulkReply],
                ["availability", copy.premiumOperations.tabs.availability],
              ] as const
            ).map(([tab, label]) => (
              <button
                aria-selected={activeTab === tab}
                className={
                  activeTab === tab
                    ? "min-h-9 rounded-md bg-[var(--dash-primary)] px-3 text-[12px] font-black text-white"
                    : "min-h-9 rounded-md px-3 text-[12px] font-bold text-[var(--dash-text-secondary)] transition hover:bg-[var(--dash-surface-elevated)]"
                }
                key={tab}
                onClick={() => setActiveTab(tab)}
                role="tab"
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </DashboardCard>

      {activeTab === "prioritySearch" ? (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <DashboardCard className="p-4" variant="default">
            {workspace.entitlements.priority_workbench ? (
              <>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h3 className="text-[16px] font-black text-[var(--dash-text)]">
                      {copy.premiumOperations.prioritySearch.title}
                    </h3>
                    <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                      {copy.premiumOperations.prioritySearch.description}
                    </p>
                  </div>
                  {workspace.entitlements.bulk_reply_review && canManage ? (
                    <button className={buttonClass} onClick={selectVisible} type="button">
                      {copy.common.selectAll}
                    </button>
                  ) : null}
                </div>
                <div className="mt-4">{renderLeadFilters()}</div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[12px] text-[var(--dash-text-muted)]">
                  <span>{copy.premiumOperations.prioritySearch.resultCount(filteredLeads.length)}</span>
                </div>
                <div className="mt-3 grid gap-2">
                  {filteredLeads.length > 0 ? (
                    filteredLeads.map((lead) => {
                      const selectable = !["archived", "booked", "lost"].includes(lead.status);
                      return (
                        <label
                          className="grid cursor-pointer gap-2 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] p-3 transition hover:border-[var(--dash-primary-border)] sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center"
                          key={lead.id}
                        >
                          {workspace.entitlements.bulk_reply_review && canManage ? (
                            <input
                              aria-label={`${copy.common.selectAll}: ${
                                lead.customerName ??
                                copy.premiumOperations.prioritySearch.unnamedRequest
                              }`}
                              checked={selectedLeadIds.has(lead.id)}
                              disabled={!selectable}
                              onChange={() => toggleLead(lead.id)}
                              type="checkbox"
                            />
                          ) : null}
                          <span className="min-w-0">
                            <span className="block truncate text-[13px] font-black text-[var(--dash-text)]">
                              {lead.customerName ??
                                copy.premiumOperations.prioritySearch.unnamedRequest}
                            </span>
                            <span className="mt-0.5 block truncate text-[12px] text-[var(--dash-text-secondary)]">
                              {[lead.service, lead.area].filter(Boolean).join(" · ") ||
                                copy.premiumOperations.prioritySearch
                                  .leadDetailsNeedReview}
                            </span>
                          </span>
                          <span className="flex flex-wrap gap-1 sm:justify-end">
                            <StatusBadge tone={priorityTone(lead.priority.priorityRank)}>
                              {lead.priority.priorityRank
                                ? (
                                  <span data-dashboard-ltr-value dir="ltr" lang="en-CA">
                                    P{lead.priority.priorityRank}
                                  </span>
                                )
                                : copy.premiumOperations.prioritySearch.priority.standard}
                            </StatusBadge>
                            <StatusBadge tone="neutral">{leadStatusLabel(lead.status)}</StatusBadge>
                          </span>
                        </label>
                      );
                    })
                  ) : (
                    <p className="rounded-lg border border-dashed border-[var(--dash-border)] p-5 text-center text-[13px] text-[var(--dash-text-secondary)]">
                      {copy.premiumOperations.prioritySearch.noMatchingLeads}
                    </p>
                  )}
                </div>
              </>
            ) : (
              addonLocked(copy, adminControlHref)
            )}
          </DashboardCard>

          <div className="space-y-4">
            {workspace.entitlements.priority_workbench ? (
              <DashboardCard className="p-4" variant="default">
                <h3 className="text-[15px] font-black text-[var(--dash-text)]">
                  {copy.premiumOperations.prioritySearch.rulesLabel}
                </h3>
                {!canManage ? (
                  <p className="mt-2 text-[12px] text-[var(--dash-text-secondary)]">
                    {copy.common.approvalRequired}
                  </p>
                ) : null}
                {canManage ? <form action={createPriorityRuleAction} className="mt-3 grid gap-2.5">
                  <label className={labelClass}>
                    {copy.premiumOperations.prioritySearch.ruleName}
                    <input className={inputClass} maxLength={80} name="name" required type="text" />
                  </label>
                  <label className={labelClass}>
                    {copy.premiumOperations.prioritySearch.priorityRank}
                    <input
                      className={`${inputClass} ${ltrStructuredInputClass}`}
                      defaultValue="3"
                      dir="ltr"
                      lang="en-CA"
                      max="5"
                      min="1"
                      name="priorityRank"
                      required
                      type="number"
                    />
                  </label>
                  <label className={labelClass}>
                    {copy.premiumOperations.prioritySearch.serviceTerms}
                    <input
                      className={inputClass}
                      name="serviceTerms"
                      placeholder={copy.premiumOperations.prioritySearch.servicePlaceholder}
                      type="text"
                    />
                  </label>
                  <label className={labelClass}>
                    {copy.premiumOperations.prioritySearch.areaTerms}
                    <input
                      className={inputClass}
                      name="areaTerms"
                      placeholder={copy.premiumOperations.prioritySearch.areaPlaceholder}
                      type="text"
                    />
                  </label>
                  <label className={labelClass}>
                    {copy.premiumOperations.prioritySearch.descriptionLabel}
                    <textarea className={textareaClass} maxLength={280} name="description" rows={2} />
                  </label>
                  <button className={primaryButtonClass} type="submit">
                    {copy.premiumOperations.prioritySearch.addRule}
                  </button>
                </form> : null}
                {workspace.priorityRules.length > 0 ? (
                  <div className="mt-4 grid gap-2 border-t border-[var(--dash-border)] pt-3">
                    {workspace.priorityRules.map((rule) => (
                      <div className="flex items-center justify-between gap-2" key={rule.id}>
                        <span className="min-w-0 truncate text-[12px] font-bold text-[var(--dash-text)]">
                          <span data-dashboard-ltr-value dir="ltr" lang="en-CA">
                            P{rule.priority_rank}
                          </span>{" "}
                          · {rule.name}
                        </span>
                        {canManage ? (
                          <form action={deletePriorityRuleAction}>
                            <input name="ruleId" type="hidden" value={rule.id} />
                            <button className="text-[11px] font-bold text-[var(--dash-danger-strong)]" type="submit">
                              {copy.common.delete}
                            </button>
                          </form>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </DashboardCard>
            ) : null}
          </div>
        </div>
      ) : null}

      {activeTab === "bulkReply" ? (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)]">
          <DashboardCard className="p-4" variant="default">
            {workspace.entitlements.bulk_reply_review ? (
              <>
                <h3 className="text-[16px] font-black text-[var(--dash-text)]">
                  {copy.premiumOperations.bulkReply.title}
                </h3>
                <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                  {copy.premiumOperations.bulkReply.description}
                </p>
                {canManage ? (
                  <>
                    <div className="mt-4 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-[12px] font-black text-[var(--dash-text)]">
                          {copy.premiumOperations.bulkReply.audienceLabel}
                        </p>
                        <button className={buttonClass} onClick={selectVisible} type="button">
                          {copy.common.selectAll}
                        </button>
                      </div>
                      <div className="mt-3">{renderLeadFilters()}</div>
                      <div className="mt-3 grid max-h-64 gap-2 overflow-y-auto pe-1">
                        {filteredLeads.length > 0 ? (
                          filteredLeads.map((lead) => {
                            const selectable = !["archived", "booked", "lost"].includes(lead.status);
                            return (
                              <label
                                className="flex cursor-pointer items-center justify-between gap-3 rounded-md border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] px-3 py-2"
                                key={lead.id}
                              >
                                <span className="flex min-w-0 items-center gap-2">
                                  <input
                                    aria-label={`${copy.common.selectAll}: ${
                                      lead.customerName ?? copy.premiumOperations.prioritySearch.unnamedRequest
                                    }`}
                                    checked={selectedLeadIds.has(lead.id)}
                                    disabled={!selectable || (!selectedLeadIds.has(lead.id) && selectedVisibleLeadIds.length >= 50)}
                                    onChange={() => toggleLead(lead.id)}
                                    type="checkbox"
                                  />
                                  <span className="min-w-0">
                                    <span className="block truncate text-[12px] font-bold text-[var(--dash-text)]">
                                      {lead.customerName ?? copy.premiumOperations.prioritySearch.unnamedRequest}
                                    </span>
                                    <span className="block truncate text-[11px] text-[var(--dash-text-secondary)]">
                                      {[lead.service, lead.area].filter(Boolean).join(" · ") || copy.premiumOperations.prioritySearch.leadDetailsNeedReview}
                                    </span>
                                  </span>
                                </span>
                                <StatusBadge tone="neutral">{leadStatusLabel(lead.status)}</StatusBadge>
                              </label>
                            );
                          })
                        ) : (
                          <p className="text-[12px] text-[var(--dash-text-secondary)]">
                            {copy.premiumOperations.prioritySearch.noMatchingLeads}
                          </p>
                        )}
                      </div>
                    </div>
                    <form action={createBulkReplyDraftAction} className="mt-3 grid gap-3">
                  {selectedVisibleLeadIds.map((leadId) => (
                    <input key={leadId} name="leadId" type="hidden" value={leadId} />
                  ))}
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
                    <span className="text-[12px] font-bold text-[var(--dash-text-secondary)]">
                      {copy.premiumOperations.bulkReply.audienceLabel}
                    </span>
                    <StatusBadge tone={selectedVisibleLeadIds.length > 0 ? "blue" : "neutral"}>
                      {copy.premiumOperations.bulkReply.recipientCount(selectedVisibleLeadIds.length)}
                    </StatusBadge>
                  </div>
                  <label className={labelClass}>
                    {copy.premiumOperations.bulkReply.draftTitle}
                    <input
                      className={inputClass}
                      dir="ltr"
                      lang={businessLanguage}
                      maxLength={120}
                      name="title"
                      onChange={(event) => setDraftTitle(event.target.value)}
                      required
                      type="text"
                      value={draftTitle}
                    />
                  </label>
                  <label className={labelClass}>
                    {copy.premiumOperations.bulkReply.draftLabel}
                    <textarea
                      className={textareaClass}
                      dir="ltr"
                      lang={businessLanguage}
                      maxLength={4000}
                      name="messageTemplate"
                      onChange={(event) => setDraftTemplate(event.target.value)}
                      required
                      rows={7}
                      value={draftTemplate}
                    />
                  </label>
                  <p className="text-[12px] leading-5 text-[var(--dash-text-muted)]">
                    {copy.premiumOperations.bulkReply.approvalNote}
                  </p>
                  <button className={primaryButtonClass} disabled={selectedVisibleLeadIds.length === 0} type="submit">
                    {copy.premiumOperations.bulkReply.createDraft}
                  </button>
                    </form>
                  </>
                ) : (
                  <p className="mt-3 text-[12px] text-[var(--dash-text-secondary)]">
                    {copy.common.approvalRequired}
                  </p>
                )}
              </>
            ) : (
              addonLocked(copy, adminControlHref)
            )}
          </DashboardCard>
          <DashboardCard className="p-4" variant="muted">
            <h3 className="text-[15px] font-black text-[var(--dash-text)]">
              {copy.premiumOperations.bulkReply.reviewQueue}
            </h3>
            <div className="mt-3 grid gap-2">
              {workspace.batches.length > 0 ? (
                workspace.batches.map((batch) => {
                  const previewRecipients = recipientsByDraft.get(batch.id) ?? [];
                  return (
                    <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] p-3" key={batch.id}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[13px] font-black text-[var(--dash-text)]">{batch.title}</p>
                          <p className="mt-0.5 text-[11px] text-[var(--dash-text-muted)]">
                            {copy.premiumOperations.bulkReply.recipientCount(recipientCounts.get(batch.id) ?? 0)}
                          </p>
                        </div>
                        <StatusBadge tone={batch.status === "reviewed" ? "emerald" : "amber"}>
                          {batch.status === "reviewed"
                            ? copy.premiumOperations.bulkReply.statusReviewed
                            : copy.premiumOperations.bulkReply.statusDraft}
                        </StatusBadge>
                      </div>
                      <details className="mt-2 rounded-md border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-2">
                        <summary className="cursor-pointer text-[12px] font-bold text-[var(--dash-text)]">
                          {copy.premiumOperations.bulkReply.draftLabel}
                        </summary>
                        <p
                          className="mt-2 whitespace-pre-wrap text-[12px] leading-5 text-[var(--dash-text-secondary)]"
                          dir="ltr"
                          lang={businessLanguage}
                        >
                          {batch.message_template}
                        </p>
                        <div className="mt-3 grid max-h-80 gap-2 overflow-y-auto pe-1">
                          {previewRecipients.map((recipient) => (
                            <div className="rounded-md border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] p-2" key={recipient.id}>
                              <p className="text-[11px] font-black text-[var(--dash-text)]">
                                {leadById.get(recipient.lead_id)?.customerName ??
                                  copy.premiumOperations.prioritySearch.unnamedRequest}
                              </p>
                              <p
                                className="mt-1 whitespace-pre-wrap text-[11px] leading-5 text-[var(--dash-text-secondary)]"
                                dir="ltr"
                                lang={businessLanguage}
                              >
                                {recipient.rendered_message}
                              </p>
                            </div>
                          ))}
                        </div>
                      </details>
                      {batch.status !== "reviewed" && canManage ? (
                        <form action={reviewBulkReplyDraftAction} className="mt-2">
                          <input name="draftId" type="hidden" value={batch.id} />
                          <button className={buttonClass} type="submit">
                            {copy.premiumOperations.bulkReply.reviewDraft}
                          </button>
                        </form>
                      ) : null}
                    </div>
                  );
                })
              ) : (
                <p className="text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                  {copy.premiumOperations.bulkReply.noEligibleRecipients}
                </p>
              )}
            </div>
          </DashboardCard>
        </div>
      ) : null}

      {activeTab === "availability" ? (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(19rem,0.8fr)]">
          <DashboardCard className="p-4" variant="default">
            {workspace.entitlements.availability_coordination ? (
              <>
                <h3 className="text-[16px] font-black text-[var(--dash-text)]">
                  {copy.premiumOperations.availability.title}
                </h3>
                <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                  {copy.premiumOperations.availability.description}
                </p>
                {canManage ? (
                  <form action={createInternalTimeBlockAction} className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  <label className={labelClass}>
                    {copy.premiumOperations.availability.clientOrCompany}
                    <input className={inputClass} maxLength={160} name="clientName" required type="text" />
                  </label>
                  <label className={labelClass}>
                    {copy.premiumOperations.availability.company} ({copy.common.optional})
                    <input className={inputClass} maxLength={160} name="companyName" type="text" />
                  </label>
                  <label className={labelClass}>
                    {copy.premiumOperations.availability.service}
                    <input className={inputClass} maxLength={160} name="serviceLabel" required type="text" />
                  </label>
                  <label className={labelClass}>
                    {copy.premiumOperations.availability.status}
                    <select className={inputClass} name="status">
                      <option value="reserved">
                        {copy.premiumOperations.availability.reserved}
                      </option>
                      <option value="tentative">
                        {copy.premiumOperations.availability.tentative}
                      </option>
                    </select>
                  </label>
                  <label className={labelClass}>
                    {copy.premiumOperations.availability.startTime}
                    <input className={`${inputClass} ${ltrStructuredInputClass}`} dir="ltr" lang="en-CA" name="startsAt" required type="datetime-local" />
                  </label>
                  <label className={labelClass}>
                    {copy.premiumOperations.availability.endTime}
                    <input className={`${inputClass} ${ltrStructuredInputClass}`} dir="ltr" lang="en-CA" name="endsAt" required type="datetime-local" />
                  </label>
                  <label className={`${labelClass} sm:col-span-2`}>
                    {copy.premiumOperations.availability.notes} ({copy.common.optional})
                    <textarea className={textareaClass} maxLength={600} name="notes" rows={2} />
                  </label>
                  <p className="sm:col-span-2 text-[12px] leading-5 text-[var(--dash-text-muted)]">
                    {copy.premiumOperations.availability.timeFormatHint}{" "}
                    <span data-dashboard-ltr-value dir="ltr" lang="en-CA">
                      {copy.premiumOperations.availability.timeZoneLabel(
                        BUSINESS_OPERATING_TIME_ZONE,
                      )}
                    </span>{" "}
                    {copy.premiumOperations.availability.utcTimeStorage}
                  </p>
                  <button className={`${primaryButtonClass} sm:col-span-2`} type="submit">
                    {copy.premiumOperations.availability.addAvailability}
                  </button>
                  </form>
                ) : (
                  <p className="mt-3 text-[12px] text-[var(--dash-text-secondary)]">
                    {copy.common.approvalRequired}
                  </p>
                )}
                <div className="mt-5 grid gap-2 border-t border-[var(--dash-border)] pt-4">
                  {workspace.timeBlocks.length > 0 ? (
                    workspace.timeBlocks.map((block) => (
                      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3" key={block.id}>
                        <span className="min-w-0">
                          <span className="block truncate text-[13px] font-black text-[var(--dash-text)]">{block.client_name}</span>
                          <span className="mt-0.5 block truncate text-[11px] text-[var(--dash-text-secondary)]">
                            {block.service_label} ·{" "}
                            <span data-dashboard-ltr-value dir="ltr" lang="en-CA">
                              {latinDateTime(block.starts_at)} — {latinDateTime(block.ends_at)}
                            </span>
                          </span>
                        </span>
                        <span className="flex items-center gap-2">
                          <StatusBadge
                            tone={
                              block.status === "cancelled"
                                ? "neutral"
                                : block.status === "reserved"
                                  ? "blue"
                                  : "amber"
                            }
                          >
                            {block.status === "cancelled"
                              ? copy.premiumOperations.availability.cancelled
                              : block.status === "reserved"
                                ? copy.premiumOperations.availability.reserved
                                : copy.premiumOperations.availability.tentative}
                          </StatusBadge>
                          {canManage && block.status !== "cancelled" ? (
                            <form action={cancelInternalTimeBlockAction}>
                              <input name="timeBlockId" type="hidden" value={block.id} />
                              <button className={buttonClass} type="submit">
                                {copy.common.cancel}
                              </button>
                            </form>
                          ) : null}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-[12px] text-[var(--dash-text-secondary)]">{copy.premiumOperations.availability.noAvailability}</p>
                  )}
                </div>
              </>
            ) : (
              addonLocked(copy, adminControlHref)
            )}
          </DashboardCard>
          <DashboardCard className="p-4" variant="priority">
            <h3 className="text-[15px] font-black text-[var(--dash-text)]">{copy.premiumOperations.conflict.alertTitle}</h3>
            <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">{copy.premiumOperations.conflict.alertDescription}</p>
            <div className="mt-3 grid gap-3">
              {workspace.availabilityAlerts.length > 0 ? (
                workspace.availabilityAlerts.map((alert) => (
                  <div className="rounded-lg border border-[var(--dash-warning-border)] bg-[var(--dash-warning-soft)] p-3" key={alert.leadId}>
                    <p className="text-[12px] font-bold text-[var(--dash-warning-strong)]">
                      <span data-dashboard-ltr-value dir="ltr" lang="en-CA">
                        {latinDateTime(alert.requestedStartsAt)}
                      </span>
                    </p>
                    {canManage ? <form action={createAvailabilityReviewDraftAction} className="mt-2 grid gap-2">
                      <input name="leadId" type="hidden" value={alert.leadId} />
                      <label className={labelClass}>
                        {copy.premiumOperations.conflict.suggestedDraftLabel}
                        <textarea
                          className={`${textareaClass} text-left [direction:ltr] [unicode-bidi:plaintext]`}
                          data-dashboard-ltr-value
                          defaultValue={alert.draft}
                          dir="ltr"
                          lang={businessLanguage}
                          name="draft"
                          required
                          rows={5}
                        />
                      </label>
                      <p className="text-[11px] leading-4 text-[var(--dash-text-secondary)]">{copy.premiumOperations.conflict.approvalNote}</p>
                      <button className={primaryButtonClass} type="submit">{copy.premiumOperations.conflict.approveForManualCopy}</button>
                    </form> : (
                      <p className="mt-2 text-[11px] text-[var(--dash-text-secondary)]">
                        {copy.common.approvalRequired}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="rounded-lg border border-dashed border-[var(--dash-border)] p-4 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                  {copy.premiumOperations.conflict.noExactTimeConflict}
                </p>
              )}
            </div>
          </DashboardCard>
        </div>
      ) : null}

      {workspace.recipients.length > 0 ? (
        <DashboardCard className="p-4" variant="muted">
          <h3 className="text-[15px] font-black text-[var(--dash-text)]">
            {copy.premiumOperations.bulkReply.manualCopyLog}
          </h3>
          <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
            {copy.premiumOperations.bulkReply.manualCopyDescription}
          </p>
          <div className="mt-3 grid gap-2">
            {workspace.recipients.map((recipient) => (
              <div className="grid gap-2 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] p-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center" key={recipient.id}>
                <p
                  className="whitespace-pre-wrap text-[12px] leading-5 text-[var(--dash-text-secondary)]"
                  dir="ltr"
                  lang={businessLanguage}
                >
                  {recipient.rendered_message}
                </p>
                <div className="flex flex-wrap gap-2 md:justify-end">
                  {recipient.copied_at ? (
                    <StatusBadge tone="emerald">
                      {copy.premiumOperations.bulkReply.copied}
                    </StatusBadge>
                  ) : batchById.get(recipient.draft_id)?.status === "reviewed" && canManage ? (
                    <CopyAndRecordReplyButton
                      failedLabel={copy.premiumOperations.bulkReply.copyFailed}
                      label={copy.premiumOperations.bulkReply.copyDraft}
                      recipientId={recipient.id}
                      value={recipient.rendered_message}
                    />
                  ) : canManage ? (
                    <form action={reviewBulkReplyDraftAction}>
                      <input
                        name="draftId"
                        type="hidden"
                        value={recipient.draft_id}
                      />
                      <button className={buttonClass} type="submit">
                        {copy.premiumOperations.bulkReply.reviewDraft}
                      </button>
                    </form>
                  ) : (
                    <StatusBadge tone="neutral">{copy.common.approvalRequired}</StatusBadge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      ) : null}
    </div>
  );
}
