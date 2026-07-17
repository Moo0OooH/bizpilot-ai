"use client";

/**
 * ============================================================
 * File: components/dashboard/tracked-quote-link-builder.tsx
 * Project: BizPilot AI
 * Description: Owner-facing tracked quote-link builder for channel attribution.
 * Role: Generates privacy-safe source variants for one public quote destination without saving customer data or requiring a database write.
 * Related:
 * - app/(dashboard)/dashboard/configuration/page.tsx
 * - lib/quote-attribution.ts
 * - app/(dashboard)/dashboard/reports/page.tsx
 * Author: MoOoH
 * Created: 2026-07-16
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Created preset and custom tracked links with bounded source/campaign tags and explicit privacy guidance.
 * ============================================================
 */

import { useState } from "react";

import { CopyButton } from "./copy-button";

type TrackedQuoteLinkCopy = Readonly<{
  campaignLabel: string;
  campaignPlaceholder: string;
  copyLink: string;
  customLabel: string;
  customPlaceholder: string;
  description: string;
  privacy: string;
  presets: ReadonlyArray<Readonly<{
    key: string;
    label: string;
    medium: string;
  }>>;
  title: string;
}>;

function safeTag(value: string, fallback = ""): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || fallback;
}

function trackedUrl(input: {
  baseUrl: string;
  campaign: string;
  medium: string;
  source: string;
}): string {
  const url = new URL(input.baseUrl);
  const source = safeTag(input.source, "other");
  const medium = safeTag(input.medium, "link");
  const campaign = safeTag(input.campaign, "quote-link");
  url.searchParams.set("source", source);
  url.searchParams.set("utm_source", source);
  url.searchParams.set("utm_medium", medium);
  url.searchParams.set("utm_campaign", campaign);
  url.searchParams.set("ref", `${source}-${medium}`.slice(0, 160));
  return url.toString();
}

export function TrackedQuoteLinkBuilder({
  baseUrl,
  copy,
}: Readonly<{
  baseUrl: string;
  copy: TrackedQuoteLinkCopy;
}>) {
  const [campaign, setCampaign] = useState("quote-link");
  const [customSource, setCustomSource] = useState("");
  const customKey = safeTag(customSource);
  const customUrl = trackedUrl({
    baseUrl,
    campaign,
    medium: "custom-link",
    source: customKey || "other",
  });

  return (
    <section className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-4">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start">
        <div>
          <h3 className="text-[15px] font-black text-[var(--dash-text)]">{copy.title}</h3>
          <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
            {copy.description}
          </p>
        </div>
        <label className="grid gap-1.5 text-[12px] font-black text-[var(--dash-text)]">
          {copy.campaignLabel}
          <input
            className="biz-field h-10 rounded-lg border px-3 text-[12px] font-medium"
            maxLength={80}
            onChange={(event) => setCampaign(event.currentTarget.value)}
            placeholder={copy.campaignPlaceholder}
            type="text"
            value={campaign}
          />
        </label>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {copy.presets.map((preset) => (
          <div
            className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-2.5"
            key={`${preset.key}-${preset.medium}`}
          >
            <span className="min-w-0">
              <span className="block truncate text-[12px] font-black text-[var(--dash-text)]">
                {preset.label}
              </span>
              <span className="mt-0.5 block truncate font-mono text-[10px] text-[var(--dash-text-muted)]">
                {preset.key} / {preset.medium}
              </span>
            </span>
            <CopyButton
              className="!min-h-8 !px-2.5 !text-[11px]"
              label={copy.copyLink}
              value={trackedUrl({
                baseUrl,
                campaign,
                medium: preset.medium,
                source: preset.key,
              })}
            />
          </div>
        ))}
      </div>

      <div className="mt-3 grid gap-2 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <label className="grid gap-1.5 text-[12px] font-black text-[var(--dash-text)]">
          {copy.customLabel}
          <input
            className="biz-field h-10 rounded-lg border px-3 text-[12px] font-medium"
            maxLength={80}
            onChange={(event) => setCustomSource(event.currentTarget.value)}
            placeholder={copy.customPlaceholder}
            type="text"
            value={customSource}
          />
        </label>
        <CopyButton
          className="!min-h-10"
          label={copy.copyLink}
          value={customUrl}
        />
      </div>

      <p className="mt-3 rounded-lg border border-[var(--dash-warning-border)] bg-[var(--dash-warning-soft)] px-3 py-2 text-[11px] leading-5 text-[var(--dash-warning-strong)]">
        {copy.privacy}
      </p>
    </section>
  );
}
