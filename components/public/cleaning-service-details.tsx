/**
 * ============================================================
 * File: components/public/cleaning-service-details.tsx
 * Project: BizPilot AI
 * Description: Interactive single-panel service detail selector for the public Cleaning page.
 * Role: Keeps Cleaning service detail content sourced from one list while rendering only one active detail panel.
 * Related:
 * - app/industries/cleaning/page.tsx
 * - app/globals.css
 * - lib/i18n/public-site-copy.ts
 * Author: MoOoH
 * Created: 2026-06-25
 * Last Updated: 2026-06-25
 * Change Log:
 * - 2026-06-25: Created the shared Cleaning service detail selector to remove duplicated responsive content.
 * ============================================================
 */

"use client";

import { useState } from "react";

import type { PublicSiteCopy } from "@/lib/i18n/public-site-copy";

type CleaningServices = PublicSiteCopy["cleaning"]["serviceCards"];
type CleaningService = CleaningServices[number];

type CleaningServiceDetailsProps = Readonly<{
  clearTitle: string;
  helpTitle: string;
  requestLabel: string;
  selectorLabel: string;
  services: CleaningServices;
}>;

function DetailList({
  items,
  tone = "default",
}: Readonly<{
  items: readonly string[];
  tone?: "default" | "teal";
}>) {
  return (
    <div className="grid gap-2">
      {items.map((detail) => (
        <div
          className="bp-copy-card-body flex items-start gap-3 text-[14px] font-bold leading-6"
          key={detail}
          style={{ color: tone === "teal" ? "var(--text-strong)" : "var(--text-default)" }}
        >
          <span
            aria-hidden
            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--accent)" }}
          />
          {detail}
        </div>
      ))}
    </div>
  );
}

export function CleaningServiceDetails({
  clearTitle,
  helpTitle,
  requestLabel,
  selectorLabel,
  services,
}: CleaningServiceDetailsProps) {
  const [activeId, setActiveId] = useState(services[0]?.id ?? "");
  const activeService: CleaningService | undefined =
    services.find((service) => service.id === activeId) ?? services[0];

  if (!activeService) {
    return null;
  }

  return (
    <div className="cleaning-detail-tabs">
      <div aria-label={selectorLabel} className="cleaning-tab-list" role="tablist">
        {services.map((service) => {
          const selected = service.id === activeService.id;

          return (
            <button
              aria-controls="cleaning-active-detail-panel"
              aria-selected={selected}
              className="cleaning-tab-button bp-copy-button"
              id={`cleaning-detail-tab-${service.id}`}
              key={service.id}
              onClick={() => setActiveId(service.id)}
              role="tab"
              type="button"
            >
              {service.title}
            </button>
          );
        })}
      </div>

      <div
        aria-labelledby={`cleaning-detail-tab-${activeService.id}`}
        className="cleaning-detail-panel"
        id="cleaning-active-detail-panel"
        key={activeService.id}
        role="tabpanel"
        tabIndex={0}
      >
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.76fr)_minmax(260px,0.54fr)] lg:items-start">
          <div>
            <h3
              className="bp-card-title bp-copy-card-title font-black leading-tight"
              style={{ color: "var(--text-strong)" }}
            >
              {activeService.title}
            </h3>
            <p
              className="bp-copy-card-body mt-3 text-[15px] leading-7"
              style={{ color: "var(--text-default)" }}
            >
              {activeService.body}
            </p>
            <div className="mt-4 rounded-[14px] border border-slate-200 bg-white p-4">
              <p className="bp-copy-eyebrow text-[12px] font-black uppercase tracking-[0.12em] text-slate-500">
                {requestLabel}
              </p>
              <p className="bp-copy-card-body mt-2 text-[14px] font-black leading-7 text-slate-950">
                {activeService.request}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div
              className="grid gap-2 rounded-[14px] border p-4"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border-default)",
              }}
            >
              <p
                className="bp-copy-eyebrow text-[12px] font-black uppercase tracking-[0.12em]"
                style={{ color: "var(--accent)" }}
              >
                {clearTitle}
              </p>
              <DetailList items={activeService.clearDetails} />
            </div>

            <div className="grid gap-2 rounded-[14px] border border-teal-200 bg-teal-50 p-4">
              <p className="bp-copy-eyebrow text-[12px] font-black uppercase tracking-[0.12em] text-teal-700">
                {helpTitle}
              </p>
              <DetailList items={activeService.missingDetails} tone="teal" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
