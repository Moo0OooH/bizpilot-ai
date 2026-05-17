"use client";

/**
 * ============================================================
 * File: components/dashboard/lead-workspace-queue.tsx
 * Project: BizPilot AI
 * Description: Renders the interactive Lead Workspace queue table.
 * Role: Provides filtering, search, tenant lead rows, and first-use sample guidance.
 * Related:
 * - app/(dashboard)/dashboard/leads/page.tsx
 * - components/dashboard/dashboard-ui.tsx
 * Author: MoOoH
 * Created: 2026-05-11
 * Last Updated: 2026-05-17
 * Change Log:
 * - 2026-05-11: Created the interactive lead queue.
 * - 2026-05-17: Added Magic Moment empty state aligned to the pilot demo flow.
 * ============================================================
 */

import Link from "next/link";
import { useMemo, useState } from "react";

import { CopyButton } from "@/components/dashboard/copy-button";
import {
  buttonClass,
  EmptyState,
  inputClass,
  LeadQualityBadge,
  LeadStatusBadge,
  ResponseSlaBadge,
} from "@/components/dashboard/dashboard-ui";
import type { LeadDeskItem } from "@/server/services/lead-conversion.service";

type LeadFilter = "all" | "new" | "follow_up" | "booked" | "lost";

type LeadWorkspaceQueueProps = Readonly<{
  leads: LeadDeskItem[];
  quotePath: string;
}>;

const filters: ReadonlyArray<{ label: string; value: LeadFilter }> = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Follow-up", value: "follow_up" },
  { label: "Booked", value: "booked" },
  { label: "Lost", value: "lost" },
];

function formatDate(value: string | null): string {
  if (!value) {
    return "Not yet";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function matchesFilter(item: LeadDeskItem, filter: LeadFilter): boolean {
  if (filter === "all") {
    return true;
  }

  if (filter === "follow_up") {
    return (
      item.lead.status === "follow_up_needed" ||
      item.lead.response_sla_state === "follow_up_due"
    );
  }

  return item.lead.status === filter;
}

function matchesSearch(item: LeadDeskItem, search: string): boolean {
  const normalizedSearch = search.trim().toLowerCase();

  if (normalizedSearch.length === 0) {
    return true;
  }

  return [
    item.lead.customer_name,
    item.lead.customer_contact,
    item.lead.service_type,
    item.lead.source_channel,
    item.lead.city_or_service_area,
    item.recommendedAction,
    item.primaryIssue,
  ]
    .filter((value): value is string => Boolean(value))
    .some((value) => value.toLowerCase().includes(normalizedSearch));
}

function SampleLeadEmptyState({ quotePath }: Readonly<{ quotePath: string }>) {
  return (
    <div className="grid gap-3 rounded-lg border border-dashed border-violet-200 bg-violet-50/60 p-3.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-800">
          Sample lead
        </span>
        <span className="rounded-full border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-medium text-red-700">
          Reply needed
        </span>
      </div>
      <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto] lg:items-center">
        <div>
          <p className="text-sm font-semibold text-zinc-950">
            Maria Santos - move-out cleaning
          </p>
          <p className="mt-1 text-[13px] leading-5 text-zinc-700">
            2-bedroom apartment, downtown. Wants help before Friday. Missing
            preferred arrival window.
          </p>
        </div>
        <div className="rounded-[10px] border border-violet-100 bg-white p-3 text-[13px] leading-5 text-zinc-700">
          <span className="font-semibold text-zinc-950">Next action:</span> Ask
          for the time window, then copy a concise owner-reviewed reply.
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:w-44 lg:grid-cols-1">
          <CopyButton label="Copy quote link" value={quotePath} />
          <Link className={buttonClass} href="/dashboard/configuration">
            Check setup
          </Link>
        </div>
      </div>
      <p className="text-xs leading-5 text-zinc-600">
        This sample is not stored as customer data. It shows the workflow until
        real quote requests arrive.
      </p>
    </div>
  );
}

export function LeadWorkspaceQueue({
  leads,
  quotePath,
}: LeadWorkspaceQueueProps) {
  const [activeFilter, setActiveFilter] = useState<LeadFilter>("all");
  const [search, setSearch] = useState("");
  const hasActiveFilter = activeFilter !== "all" || search.trim().length > 0;
  const filteredLeads = useMemo(
    () =>
      leads.filter(
        (item) => matchesFilter(item, activeFilter) && matchesSearch(item, search),
      ),
    [activeFilter, leads, search],
  );

  function clearFilters() {
    setActiveFilter("all");
    setSearch("");
  }

  return (
    <>
      <div className="mt-3 flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1 rounded-lg bg-zinc-100 p-1">
          {filters.map((filter) => (
            <button
              className={
                activeFilter === filter.value
                  ? "inline-flex h-8 items-center rounded-md bg-zinc-950 px-3 text-xs font-medium text-white"
                  : "inline-flex h-8 items-center rounded-md px-3 text-xs font-medium text-zinc-600 hover:bg-white hover:text-zinc-950"
              }
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              type="button"
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
          <input
            className={`${inputClass} lg:w-72`}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, contact, service, area"
            type="search"
            value={search}
          />
          {hasActiveFilter ? (
            <button className={buttonClass} onClick={clearFilters} type="button">
              Clear
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-lg border border-zinc-200">
        <div className="hidden grid-cols-[1.1fr_0.75fr_0.85fr_0.78fr_0.78fr_0.78fr_0.7fr_1.1fr_0.8fr] border-b border-zinc-200 bg-zinc-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500 xl:grid">
          <span>Customer</span>
          <span>Service</span>
          <span>Location</span>
          <span>Quality</span>
          <span>SLA</span>
          <span>Status</span>
          <span>Source</span>
          <span>Next action</span>
          <span>Created</span>
        </div>
        {filteredLeads.length > 0 ? (
          filteredLeads.map((item) => (
            <Link
              className="grid gap-2.5 border-b border-zinc-200 px-3 py-2.5 text-[13px] transition last:border-b-0 hover:bg-zinc-50 xl:min-h-[56px] xl:grid-cols-[1.1fr_0.75fr_0.85fr_0.78fr_0.78fr_0.78fr_0.7fr_1.1fr_0.8fr] xl:items-center"
              href={`/dashboard/leads/${item.lead.id}`}
              key={item.lead.id}
            >
              <span className="min-w-0">
                <span className="block truncate font-semibold text-zinc-950">
                  {item.lead.customer_name ?? "Unnamed lead"}
                </span>
                <span className="mt-0.5 block truncate text-xs text-zinc-500">
                  {item.lead.customer_contact ?? "No contact captured"}
                </span>
              </span>
              <span className="text-zinc-700">
                {item.lead.service_type ?? "Service not set"}
              </span>
              <span className="text-zinc-700">
                {item.lead.city_or_service_area ?? "Area missing"}
              </span>
              <LeadQualityBadge value={item.score.quality_level} />
              <ResponseSlaBadge value={item.lead.response_sla_state} />
              <LeadStatusBadge value={item.lead.status} />
              <span className="truncate text-xs text-zinc-500">
                {item.lead.source_channel ?? "Unknown"}
              </span>
              <span>
                <span className="inline-flex rounded-md bg-zinc-950 px-2 py-0.5 text-xs font-medium text-white">
                  {item.recommendedAction}
                </span>
                <span className="mt-0.5 block text-xs leading-4 text-zinc-500">
                  {item.primaryIssue}
                </span>
              </span>
              <span className="text-xs text-zinc-500">
                {formatDate(item.lead.created_at)}
              </span>
            </Link>
          ))
        ) : (
          <div className="p-4">
            {leads.length === 0 ? (
              <SampleLeadEmptyState quotePath={quotePath} />
            ) : (
              <EmptyState
                action={
                  hasActiveFilter ? (
                    <button
                      className={buttonClass}
                      onClick={clearFilters}
                      type="button"
                    >
                      Clear filters
                    </button>
                  ) : undefined
                }
                title="No leads found."
              >
                Try another search or clear filters.
              </EmptyState>
            )}
          </div>
        )}
      </div>
    </>
  );
}
