/**
 * ============================================================
 * File: app/quote-link-guide/page.tsx
 * Project: BizPilot AI
 * Description: Public guide for placing a cleaning quote request link.
 * Role: Gives founder-pilot owners practical, source-backed placement guidance without implying booking or automation.
 * Related:
 * - components/public/marketing-ui.tsx
 * - lib/i18n/public-site-copy.ts
 * - lib/public-structured-data.ts
 * Author: MoOoH
 * Created: 2026-07-04
 * Last Updated: 2026-07-04
 * Change Log:
 * - 2026-07-04: Created the public quote-link placement guide for Phase 25C.
 * ============================================================
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";

import { JsonLdScript } from "@/components/public/json-ld";
import {
  MarketingBadge,
  MarketingButton,
  MarketingCard,
  MarketingFooter,
  MarketingHeader,
  MarketingIcon,
  MarketingShell,
  marketingBackground,
  marketingTone,
  type MarketingIconName,
} from "@/components/public/marketing-ui";
import { getHomeCopy } from "@/lib/i18n/home-copy";
import { INTERFACE_LANGUAGE_COOKIE } from "@/lib/i18n/language";
import { getPublicSiteCopy } from "@/lib/i18n/public-site-copy";
import { buildBreadcrumbJsonLd } from "@/lib/public-structured-data";
import {
  buildPublicMetadata,
  resolvePublicRouteLanguage,
  type PublicRouteSearchParams,
} from "@/lib/seo";

type QuoteLinkGuidePageProps = Readonly<{
  searchParams?: PublicRouteSearchParams;
}>;

const channelIcons = [
  "globe",
  "search",
  "camera",
  "message",
  "copy",
] as const satisfies readonly MarketingIconName[];

async function readPublicLanguage(searchParams?: PublicRouteSearchParams) {
  return resolvePublicRouteLanguage(
    searchParams,
    (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );
}

export async function generateMetadata({
  searchParams,
}: QuoteLinkGuidePageProps = {}): Promise<Metadata> {
  const language = await readPublicLanguage(searchParams);
  return buildPublicMetadata(
    "/quote-link-guide",
    getPublicSiteCopy(language).quoteLinkGuide.meta,
    language,
  );
}

export default async function QuoteLinkGuidePage({
  searchParams,
}: QuoteLinkGuidePageProps = {}) {
  const language = await readPublicLanguage(searchParams);
  const navCopy = getHomeCopy(language).nav;
  const copy = getPublicSiteCopy(language).quoteLinkGuide;

  return (
    <main className="bp-page public-site min-h-svh" style={{ background: marketingBackground, color: marketingTone.text }}>
      <JsonLdScript
        data={buildBreadcrumbJsonLd(
          [
            { name: "BizPilot AI", path: "/" },
            { name: copy.title, path: "/quote-link-guide" },
          ],
          language,
        )}
        id="bizpilot-quote-link-guide-breadcrumb-jsonld"
      />
      <MarketingHeader copy={navCopy} language={language} redirectPath="/quote-link-guide" />
      <section className="bp-section-tight">
        <MarketingShell>
          <div className="max-w-[920px]">
            <MarketingBadge toneName="blue">{copy.badge}</MarketingBadge>
            <h1 className="bp-page-title bp-copy-hero mt-5 font-black leading-[1.06]" style={{ color: marketingTone.text }}>
              {copy.title}
            </h1>
            <p className="bp-body bp-copy-hero-body mt-5 max-w-[820px] leading-8" style={{ color: marketingTone.soft }}>
              {copy.body}
            </p>
            <div className="bp-button-row mt-6 flex flex-col gap-3 sm:flex-row">
              <MarketingButton href="/pilot">
                {copy.primaryCta} <MarketingIcon name="arrow" />
              </MarketingButton>
              <MarketingButton href="/comparison" variant="secondary">
                {copy.secondaryCta}
              </MarketingButton>
              <MarketingButton href="/faster-quote-replies" variant="secondary">
                {copy.replySpeedCta}
              </MarketingButton>
            </div>
          </div>
        </MarketingShell>
      </section>

      <section className="pb-[var(--bp-section-tight-space)]">
        <MarketingShell>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,0.34fr)_minmax(0,1fr)]">
            <MarketingCard className="p-5 sm:p-6">
              <MarketingBadge toneName="neutral">{copy.checklistTitle}</MarketingBadge>
              <ul className="mt-5 grid gap-3">
                {copy.checklist.map((item) => (
                  <li className="flex min-w-0 gap-3 text-[14px] font-bold leading-6" key={item} style={{ color: marketingTone.soft }}>
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[7px]" style={{ backgroundColor: "color-mix(in srgb, var(--success) 14%, var(--surface))", color: marketingTone.emerald }}>
                      <MarketingIcon name="check" />
                    </span>
                    <span className="min-w-0">{item}</span>
                  </li>
                ))}
              </ul>
            </MarketingCard>

            <MarketingCard className="p-5 sm:p-6">
              <div className="max-w-[760px]">
                <MarketingBadge>{copy.templateTitle}</MarketingBadge>
                <p className="bp-copy-card-body mt-4 text-[15px] font-bold leading-7" style={{ color: marketingTone.soft }}>
                  {copy.templateBody}
                </p>
              </div>
              <div className="mt-6 grid gap-4">
                {copy.channels.map((channel, index) => (
                  <div className="rounded-[16px] border p-4" key={channel.title} style={{ backgroundColor: "var(--surface-interactive)", borderColor: marketingTone.border }}>
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px]" style={{ backgroundColor: "color-mix(in srgb, var(--primary) 12%, transparent)", color: marketingTone.blue }}>
                        <MarketingIcon name={channelIcons[index] ?? "link"} />
                      </span>
                      <div className="min-w-0">
                        <h2 className="bp-card-title bp-copy-card-title font-black leading-tight" style={{ color: marketingTone.text }}>
                          {channel.title}
                        </h2>
                        <p className="bp-copy-card-body mt-2 text-[14px] font-bold leading-6" style={{ color: marketingTone.soft }}>
                          {channel.body}
                        </p>
                      </div>
                    </div>
                    <ol className="mt-4 grid gap-2">
                      {channel.steps.map((step, stepIndex) => (
                        <li className="flex min-w-0 gap-3 text-[13px] font-bold leading-6" key={step} style={{ color: marketingTone.soft }}>
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] text-[11px] font-black" style={{ backgroundColor: "var(--surface)", color: marketingTone.text }}>
                            {stepIndex + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                    <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,0.28fr)_minmax(0,1fr)]">
                      <div className="rounded-[12px] border px-3 py-2" style={{ backgroundColor: "var(--surface)", borderColor: marketingTone.border }}>
                        <p className="text-[11px] font-black uppercase tracking-[0.12em]" style={{ color: marketingTone.muted }}>
                          {copy.sourceLabel}
                        </p>
                        <code className="mt-1 block break-all text-[13px] font-black" style={{ color: marketingTone.text }}>
                          {channel.tag}
                        </code>
                      </div>
                      <div className="rounded-[12px] border px-3 py-2" style={{ backgroundColor: "var(--surface)", borderColor: marketingTone.border }}>
                        <p className="text-[11px] font-black uppercase tracking-[0.12em]" style={{ color: marketingTone.muted }}>
                          {copy.templateUrlLabel}
                        </p>
                        <code className="mt-1 block break-all text-[12px] font-bold leading-5" style={{ color: marketingTone.text }}>
                          {channel.template}
                        </code>
                      </div>
                    </div>
                    <p className="mt-4 rounded-[12px] border px-3 py-2 text-[13px] font-bold leading-6" style={{ backgroundColor: "color-mix(in srgb, var(--warning) 9%, var(--surface))", borderColor: "color-mix(in srgb, var(--warning) 30%, var(--border-default))", color: marketingTone.soft }}>
                      {channel.caution}
                    </p>
                  </div>
                ))}
              </div>
            </MarketingCard>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,0.5fr)_minmax(0,0.5fr)]">
            <MarketingCard className="p-5 sm:p-6" style={{ borderColor: "rgba(245,158,11,0.32)" }}>
              <div className="flex min-w-0 items-start gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-amber-50 text-amber-600">
                  <MarketingIcon name="warning" />
                </span>
                <div className="min-w-0">
                  <h2 className="bp-card-title bp-copy-section-title font-black leading-tight" style={{ color: marketingTone.text }}>
                    {copy.guardrail.title}
                  </h2>
                  <p className="bp-copy-card-body mt-3 text-[15px] font-bold leading-7" style={{ color: marketingTone.soft }}>
                    {copy.guardrail.body}
                  </p>
                </div>
              </div>
              <ul className="mt-5 grid gap-3">
                {copy.guardrail.items.map((item) => (
                  <li className="flex gap-3 text-[14px] font-bold leading-6" key={item} style={{ color: marketingTone.soft }}>
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: marketingTone.gold }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </MarketingCard>

            <MarketingCard className="p-5 sm:p-6">
              <MarketingBadge toneName="neutral">{copy.referencesTitle}</MarketingBadge>
              <div className="mt-5 grid gap-3">
                {copy.references.map((reference) => (
                  <a
                    className="group rounded-[14px] border px-4 py-3 transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
                    href={reference.href}
                    key={reference.href}
                    rel="noopener noreferrer"
                    style={{ backgroundColor: "var(--surface-interactive)", borderColor: marketingTone.border, color: marketingTone.text }}
                    target="_blank"
                  >
                    <span className="flex min-w-0 items-center justify-between gap-3">
                      <span className="text-[14px] font-black leading-6">{reference.label}</span>
                      <MarketingIcon name="arrow" />
                    </span>
                    <span className="mt-2 block text-[13px] font-bold leading-6" style={{ color: marketingTone.soft }}>
                      {reference.note}
                    </span>
                  </a>
                ))}
              </div>
            </MarketingCard>
          </div>
        </MarketingShell>
      </section>
      <MarketingFooter copy={navCopy} />
    </main>
  );
}
