/**
 * ============================================================
 * File: app/faster-quote-replies/page.tsx
 * Project: BizPilot AI
 * Description: Public reply-speed guide for cleaning quote requests.
 * Role: Gives cleaning owners a practical content and operations guide without implying automation.
 * Related:
 * - components/public/marketing-ui.tsx
 * - lib/i18n/public-site-copy.ts
 * - lib/public-structured-data.ts
 * Author: MoOoH
 * Created: 2026-07-04
 * Last Updated: 2026-07-04
 * Change Log:
 * - 2026-07-04: Created the public reply-speed content guide for Phase 25U.
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

type FasterQuoteRepliesPageProps = Readonly<{
  searchParams?: PublicRouteSearchParams;
}>;

const workflowIcons = [
  "link",
  "radar",
  "pen",
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
}: FasterQuoteRepliesPageProps = {}): Promise<Metadata> {
  const language = await readPublicLanguage(searchParams);
  return buildPublicMetadata(
    "/faster-quote-replies",
    getPublicSiteCopy(language).replySpeedGuide.meta,
    language,
  );
}

export default async function FasterQuoteRepliesPage({
  searchParams,
}: FasterQuoteRepliesPageProps = {}) {
  const language = await readPublicLanguage(searchParams);
  const navCopy = getHomeCopy(language).nav;
  const copy = getPublicSiteCopy(language).replySpeedGuide;

  return (
    <main className="bp-page public-site min-h-svh" style={{ background: marketingBackground, color: marketingTone.text }}>
      <JsonLdScript
        data={buildBreadcrumbJsonLd(
          [
            { name: "BizPilot AI", path: "/" },
            { name: copy.title, path: "/faster-quote-replies" },
          ],
          language,
        )}
        id="bizpilot-faster-quote-replies-breadcrumb-jsonld"
      />
      <MarketingHeader copy={navCopy} language={language} redirectPath="/faster-quote-replies" />
      <section className="bp-section-tight">
        <MarketingShell>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.54fr)_minmax(320px,0.46fr)] lg:items-start">
            <div className="min-w-0">
              <MarketingBadge toneName="blue">{copy.badge}</MarketingBadge>
              <h1 className="bp-page-title bp-copy-hero mt-5 font-black leading-[1.06]" style={{ color: marketingTone.text }}>
                {copy.title}
              </h1>
              <p className="bp-body bp-copy-hero-body mt-5 max-w-[760px] leading-8" style={{ color: marketingTone.soft }}>
                {copy.body}
              </p>
              <div className="bp-button-row mt-6 flex flex-col gap-3 sm:flex-row">
                <MarketingButton href="/quote-link-guide">
                  {copy.primaryCta} <MarketingIcon name="arrow" />
                </MarketingButton>
                <MarketingButton href="/pilot" variant="secondary">
                  {copy.secondaryCta}
                </MarketingButton>
              </div>
            </div>

            <MarketingCard className="reply-speed-board min-w-0 p-5 sm:p-6">
              <MarketingBadge toneName="neutral">{copy.board.eyebrow}</MarketingBadge>
              <h2 className="bp-card-title bp-copy-section-title mt-4 font-black leading-tight" style={{ color: marketingTone.text }}>
                {copy.board.title}
              </h2>
              <div className="mt-5 grid gap-3">
                {copy.board.items.map((item, index) => (
                  <div
                    className="grid min-w-0 gap-2 rounded-[14px] border px-4 py-3 sm:grid-cols-[minmax(0,0.38fr)_minmax(0,1fr)]"
                    key={item[0]}
                    style={{ backgroundColor: index === 2 ? "color-mix(in srgb, var(--primary) 10%, var(--surface))" : "var(--surface-interactive)", borderColor: marketingTone.border }}
                  >
                    <span className="text-[12px] font-black uppercase tracking-[0.12em]" style={{ color: index === 2 ? marketingTone.blue : marketingTone.muted }}>
                      {item[0]}
                    </span>
                    <span className="bp-copy-card-body min-w-0 text-[14px] font-black leading-6" style={{ color: marketingTone.text }}>
                      {item[1]}
                    </span>
                  </div>
                ))}
              </div>
            </MarketingCard>
          </div>
        </MarketingShell>
      </section>

      <section className="pb-[var(--bp-section-tight-space)]">
        <MarketingShell>
          <MarketingCard className="p-5 sm:p-7">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,0.34fr)_minmax(0,1fr)]">
              <div>
                <MarketingBadge>{copy.workflowTitle}</MarketingBadge>
              </div>
              <div className="supporting-four-grid">
                {copy.workflow.map((item, index) => (
                  <div className="min-w-0 rounded-[14px] border px-4 py-4" key={item.title} style={{ backgroundColor: "var(--surface-interactive)", borderColor: marketingTone.border }}>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-[11px]" style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)", color: marketingTone.teal }}>
                      <MarketingIcon name={workflowIcons[index] ?? "check"} />
                    </span>
                    <p className="bp-copy-eyebrow mt-4 text-[11px] font-black uppercase tracking-[0.12em]" style={{ color: marketingTone.muted }}>
                      {item.signal}
                    </p>
                    <h2 className="bp-card-title bp-copy-card-title mt-2 font-black leading-tight" style={{ color: marketingTone.text }}>
                      {item.title}
                    </h2>
                    <p className="bp-copy-card-body mt-3 text-[14px] font-bold leading-6" style={{ color: marketingTone.soft }}>
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </MarketingCard>

          <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)]">
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
                <MarketingBadge toneName="blue">{copy.calendarTitle}</MarketingBadge>
                <p className="bp-copy-card-body mt-4 text-[15px] font-bold leading-7" style={{ color: marketingTone.soft }}>
                  {copy.calendarBody}
                </p>
              </div>
              <div className="mt-6 grid gap-4">
                {copy.calendar.map((item) => (
                  <div className="rounded-[14px] border px-4 py-4" key={item.period} style={{ backgroundColor: "var(--surface-interactive)", borderColor: marketingTone.border }}>
                    <p className="text-[11px] font-black uppercase tracking-[0.12em]" style={{ color: marketingTone.muted }}>
                      {item.period}
                    </p>
                    <h2 className="bp-card-title bp-copy-card-title mt-2 font-black leading-tight" style={{ color: marketingTone.text }}>
                      {item.title}
                    </h2>
                    <p className="bp-copy-card-body mt-2 text-[14px] font-bold leading-6" style={{ color: marketingTone.soft }}>
                      {item.body}
                    </p>
                    <ul className="mt-3 grid gap-2">
                      {item.actions.map((action) => (
                        <li className="flex min-w-0 gap-2 text-[13px] font-bold leading-6" key={action} style={{ color: marketingTone.soft }}>
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: marketingTone.teal }} />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </MarketingCard>
          </div>

          <MarketingCard className="mt-8 p-6 sm:p-7" style={{ borderColor: "rgba(245,158,11,0.32)" }}>
            <div className="flex min-w-0 items-start gap-4">
              <span className="mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-amber-50 text-amber-600">
                <MarketingIcon name="shield" />
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
            <ul className="mt-5 grid gap-3 md:grid-cols-3">
              {copy.guardrail.items.map((item) => (
                <li className="rounded-[14px] border px-4 py-3 text-[13px] font-black leading-6" key={item} style={{ backgroundColor: "var(--surface-interactive)", borderColor: marketingTone.border, color: marketingTone.text }}>
                  {item}
                </li>
              ))}
            </ul>
          </MarketingCard>
        </MarketingShell>
      </section>
      <MarketingFooter copy={navCopy} />
    </main>
  );
}
