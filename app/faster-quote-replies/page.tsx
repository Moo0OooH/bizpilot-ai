/**
 * ============================================================
 * File: app/faster-quote-replies/page.tsx
 * Project: BizPilot AI
 * Description: Public reply-speed guide for customer requests.
 * Role: Gives service-business owners a practical content and operations guide without implying automation.
 * Related:
 * - components/public/marketing-ui.tsx
 * - lib/i18n/public-site-copy.ts
 * - lib/public-structured-data.ts
 * Author: MoOoH
 * Created: 2026-07-04
 * Last Updated: 2026-07-13
 * Change Log:
 * - 2026-07-13: Separated header, main content, and footer into correct page landmarks.
 * - 2026-07-13: Added the shared main-content target for keyboard skip navigation.
 * - 2026-07-12: Preserved the active public language through shared conversion links.
 * - 2026-07-04: Created the public reply-speed content guide for Phase 25U.
 * - 2026-07-05: Added a route-aware next-step panel for reply-speed education.
 * - 2026-07-05: Tokenized reply-speed guardrail icon treatment for light/dark launch polish.
 * - 2026-07-11: Rebuilt the first fold with the shared research-backed public page hero.
 * - 2026-07-13: Aligned the guide route with the universal customer-intake category.
 * ============================================================
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";

import { JsonLdScript } from "@/components/public/json-ld";
import {
  MarketingBadge,
  MarketingCard,
  MarketingFooter,
  MarketingHeader,
  MarketingIcon,
  MarketingNextStepPanel,
  MarketingPageHero,
  MarketingShell,
  marketingBackground,
  marketingTone,
  type MarketingIconName,
} from "@/components/public/marketing-ui";
import { getPublicV2NavCopy } from "@/lib/i18n/public-v2-copy";
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
  const navCopy = getPublicV2NavCopy(language);
  const siteCopy = getPublicSiteCopy(language);
  const copy = siteCopy.replySpeedGuide;

  return (
    <div className="bp-page public-site min-h-svh" style={{ background: marketingBackground, color: marketingTone.text }}>
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
      <main id="main-content">
      <section className="bp-section-tight">
        <MarketingShell>
          <MarketingPageHero
            language={language}
            actions={[
              {
                href: "/quote-link-guide",
                label: (
                  <>
                    {copy.primaryCta} <MarketingIcon name="arrow" />
                  </>
                ),
              },
              {
                href: "/pilot",
                label: copy.secondaryCta,
                variant: "secondary",
              },
            ]}
            badge={copy.badge}
            badgeTone="blue"
            body={copy.body}
            className="reply-speed-board"
            signals={copy.board.items.slice(0, 3).map((item, index) => ({
              icon: index === 0 ? "message" : index === 1 ? "warning" : "pen",
              label: item[0],
              toneName: index === 1 ? "gold" : "teal",
              value: item[1],
            }))}
            title={copy.title}
            visual={{
              body: copy.calendarBody,
              eyebrow: copy.board.eyebrow,
              items: copy.workflow.slice(0, 4).map((item, index) => ({
                icon: workflowIcons[index] ?? "check",
                label: item.signal,
                value: item.title,
              })),
              title: copy.board.title,
            }}
          />
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
              <span
                className="mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px]"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--warning) 12%, var(--surface))",
                  color: marketingTone.gold,
                }}
              >
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
          <MarketingNextStepPanel
            language={language}
            body={copy.workflowTitle}
            className="mt-8"
            items={[
              {
                description: siteCopy.quoteLinkGuide.badge,
                href: "/quote-link-guide",
                icon: "link",
                label: navCopy.guide,
              },
              {
                description: siteCopy.demo.badge,
                href: "/demo",
                icon: "radar",
                label: navCopy.demo,
                toneName: "blue",
              },
              {
                description: siteCopy.pilot.badge,
                href: "/pilot",
                icon: "arrow",
                label: navCopy.pilot,
                toneName: "gold",
              },
            ]}
            title={navCopy.flow}
          />
        </MarketingShell>
      </section>
      </main>
      <MarketingFooter copy={navCopy} language={language} />
    </div>
  );
}
