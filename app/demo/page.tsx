/**
 * ============================================================
 * File: app/demo/page.tsx
 * Project: BizPilot AI
 * Description: Public full-demo page for the cleaning quote recovery workflow.
 * Role: Shows the manual-first request-to-draft workflow without implying automation.
 * Related:
 * - components/public/marketing-ui.tsx
 * - app/page.tsx
 * - lib/i18n/public-site-copy.ts
 * Author: MoOoH
 * Created: 2026-06-18
 * Last Updated: 2026-07-12
 * Change Log:
 * - 2026-07-12: Preserved the active public language through shared conversion links.
 * - 2026-06-18: Grouped the demo into concise responsive chapters with visible guardrails.
 * - 2026-06-19: Moved visible demo-page copy and metadata into the public-site i18n dictionary.
 * - 2026-06-20: Tightened demo chapter spacing for a shorter normal-flow page.
 * - 2026-06-25: Normalized demo page rhythm to canonical bp primitives.
 * - 2026-07-04: Added a product-real owner-view preview before the narrative chapters.
 * - 2026-07-05: Added BreadcrumbList JSON-LD for the public page-content sweep.
 * - 2026-07-05: Added a route-aware next-step panel after the product walkthrough.
 * - 2026-07-05: Tokenized demo workspace panels for launch-ready light/dark consistency.
 * - 2026-07-11: Rebuilt the first fold with the shared research-backed public page hero.
 * ============================================================
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";

import { JsonLdScript } from "@/components/public/json-ld";
import {
  MarketingButton,
  MarketingCard,
  MarketingFooter,
  MarketingHeader,
  MarketingIcon,
  MarketingNextStepPanel,
  MarketingPageHero,
  MarketingShell,
  marketingBackground,
  marketingTone,
} from "@/components/public/marketing-ui";
import { getHomeCopy } from "@/lib/i18n/home-copy";
import {
  INTERFACE_LANGUAGE_COOKIE,
} from "@/lib/i18n/language";
import { getPublicSiteCopy } from "@/lib/i18n/public-site-copy";
import { buildBreadcrumbJsonLd } from "@/lib/public-structured-data";
import {
  buildPublicMetadata,
  resolvePublicRouteLanguage,
  type PublicRouteSearchParams,
} from "@/lib/seo";

type DemoPageProps = Readonly<{
  searchParams?: PublicRouteSearchParams;
}>;

type DemoWorkspaceCopy = ReturnType<typeof getPublicSiteCopy>["demo"]["workspace"];

async function readPublicLanguage(searchParams?: PublicRouteSearchParams) {
  return resolvePublicRouteLanguage(
    searchParams,
    (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );
}

export async function generateMetadata({
  searchParams,
}: DemoPageProps = {}): Promise<Metadata> {
  const language = await readPublicLanguage(searchParams);
  return buildPublicMetadata(
    "/demo",
    getPublicSiteCopy(language).demo.meta,
    language,
  );
}

function DemoPanel({
  items,
  title,
}: Readonly<{ items: readonly string[]; title: string }>) {
  return (
    <div
      className="min-w-0 rounded-[8px] border p-5 shadow-[var(--shadow-sm)]"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: marketingTone.border,
      }}
    >
      <p
        className="text-[12px] font-black uppercase"
        style={{ color: marketingTone.muted }}
      >
        {title}
      </p>
      <div className="mt-3 grid gap-2">
        {items.map((item) => (
          <p
            className="rounded-[12px] border px-3 py-2 text-[14px] font-bold leading-6"
            key={item}
            style={{
              backgroundColor: "var(--surface-interactive)",
              borderColor: marketingTone.border,
              color: marketingTone.text,
            }}
          >
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

function DemoWorkspace({ copy }: Readonly<{ copy: DemoWorkspaceCopy }>) {
  return (
    <div
      className="demo-owner-workspace min-w-0 rounded-[14px] border p-4 shadow-[var(--shadow-lg)] sm:p-5 lg:p-6"
      style={{
        backgroundColor: "var(--surface-elevated)",
        borderColor: marketingTone.border,
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-black uppercase" style={{ color: marketingTone.teal }}>
            {copy.sampleLabel}
          </p>
          <h2 className="mt-2 text-[1.65rem] font-black leading-tight" style={{ color: marketingTone.text }}>
            {copy.title}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {copy.guardrails.map((item) => (
            <span
              className="inline-flex min-h-8 items-center rounded-[8px] border px-2.5 text-[11px] font-black"
              key={item}
              style={{
                backgroundColor: "color-mix(in srgb, var(--accent) 8%, var(--surface))",
                borderColor: "color-mix(in srgb, var(--accent) 26%, var(--border-default))",
                color: marketingTone.text,
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 grid min-w-0 gap-3 min-[1060px]:grid-cols-[minmax(0,0.78fr)_minmax(0,0.86fr)_minmax(0,1.08fr)]">
        <section
          className="min-w-0 rounded-[10px] border p-4"
          style={{
            backgroundColor: "var(--surface-interactive)",
            borderColor: marketingTone.border,
          }}
        >
          <p className="text-[12px] font-black uppercase" style={{ color: marketingTone.muted }}>{copy.quoteLink.label}</p>
          <p
            className="mt-2 break-words rounded-[8px] border px-3 py-2 text-[13px] font-black"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: marketingTone.border,
              color: marketingTone.text,
            }}
          >
            {copy.quoteLink.value}
          </p>
          <p className="mt-3 text-[14px] font-semibold leading-6" style={{ color: marketingTone.soft }}>
            {copy.quoteLink.body}
          </p>
          <div className="mt-4 grid gap-2">
            {copy.fields.map((item) => (
              <div
                className="grid gap-1 rounded-[8px] border px-3 py-2"
                key={item[0]}
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: marketingTone.border,
                }}
              >
                <span className="text-[11px] font-black uppercase" style={{ color: marketingTone.muted }}>{item[0]}</span>
                <span className="text-[13px] font-black leading-5" style={{ color: marketingTone.text }}>{item[1]}</span>
              </div>
            ))}
          </div>
        </section>

        <section
          className="min-w-0 rounded-[10px] border p-4"
          style={{
            backgroundColor: "color-mix(in srgb, var(--warning) 10%, var(--surface))",
            borderColor: "color-mix(in srgb, var(--warning) 30%, var(--border-default))",
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span
              className="rounded-full px-3 py-1 text-[11px] font-black"
              style={{
                backgroundColor: "var(--surface)",
                color: marketingTone.gold,
              }}
            >
              {copy.lead.status}
            </span>
            <span className="text-[12px] font-black" style={{ color: marketingTone.muted }}>{copy.lead.source}</span>
          </div>
          <h3 className="mt-4 text-[1.1rem] font-black leading-tight" style={{ color: marketingTone.text }}>
            {copy.lead.title}
          </h3>
          <p className="mt-2 text-[13px] font-bold" style={{ color: marketingTone.soft }}>{copy.lead.meta}</p>
          <div
            className="mt-4 rounded-[8px] border p-3"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "color-mix(in srgb, var(--warning) 30%, var(--border-default))",
            }}
          >
            <p className="text-[12px] font-black uppercase" style={{ color: marketingTone.gold }}>{copy.missingTitle}</p>
            <ul className="mt-3 grid gap-2">
              {copy.missing.map((item) => (
                <li className="flex gap-2 text-[13px] font-bold leading-5" key={item} style={{ color: marketingTone.soft }}>
                  <MarketingIcon name="warning" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          className="min-w-0 rounded-[10px] border p-4"
          style={{
            backgroundColor: "color-mix(in srgb, var(--accent) 10%, var(--surface))",
            borderColor: "color-mix(in srgb, var(--accent) 30%, var(--border-default))",
          }}
        >
          <div
            className="rounded-[8px] border p-3"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "color-mix(in srgb, var(--accent) 30%, var(--border-default))",
            }}
          >
            <p className="text-[12px] font-black uppercase" style={{ color: marketingTone.teal }}>{copy.summary.title}</p>
            <p className="mt-2 text-[13px] font-bold leading-6" style={{ color: marketingTone.soft }}>{copy.summary.body}</p>
          </div>
          <div
            className="mt-3 rounded-[8px] border p-3"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "color-mix(in srgb, var(--accent) 30%, var(--border-default))",
            }}
          >
            <p className="text-[12px] font-black uppercase" style={{ color: marketingTone.teal }}>{copy.draft.title}</p>
            <p className="mt-2 text-[13px] font-semibold leading-6" style={{ color: marketingTone.soft }}>{copy.draft.body}</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {copy.actions.map((item, index) => (
              <span
                className="inline-flex min-h-9 items-center gap-2 rounded-[8px] px-3 text-[12px] font-black"
                key={item}
                style={{
                  backgroundColor: index === 0 ? marketingTone.blue : "var(--surface)",
                  border: index === 0 ? "1px solid transparent" : `1px solid ${marketingTone.border}`,
                  color: index === 0 ? "var(--primary-contrast)" : marketingTone.text,
                }}
              >
                <MarketingIcon name={index === 1 ? "copy" : "check"} />
                {item}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default async function DemoPage({ searchParams }: DemoPageProps = {}) {
  const language = await readPublicLanguage(searchParams);
  const navCopy = getHomeCopy(language).nav;
  const siteCopy = getPublicSiteCopy(language);
  const copy = siteCopy.demo;

  return (
    <main
      className="bp-page public-site min-h-svh"
      style={{ background: marketingBackground, color: marketingTone.text }}
    >
      <JsonLdScript
        data={buildBreadcrumbJsonLd(
          [
            { name: "BizPilot AI", path: "/" },
            { name: copy.title, path: "/demo" },
          ],
          language,
        )}
        id="bizpilot-demo-breadcrumb-jsonld"
      />
      <MarketingHeader copy={navCopy} language={language} redirectPath="/demo" />

      <section className="bp-section-tight">
        <MarketingShell>
          <MarketingPageHero
            language={language}
            actions={[
              {
                href: "/pilot",
                label: (
                  <>
                    {copy.cta.button} <MarketingIcon name="arrow" />
                  </>
                ),
              },
              {
                href: "/pricing",
                label: navCopy.pricing,
                variant: "secondary",
              },
            ]}
            badge={copy.badge}
            body={copy.body}
            signals={copy.workspace.guardrails.slice(0, 3).map((item, index) => ({
              icon: index === 0 ? "radar" : index === 1 ? "shield" : "check",
              label: copy.workspace.sampleLabel,
              value: item,
            }))}
            title={copy.title}
            visual={{
              body: copy.workspace.summary.body,
              eyebrow: copy.workspace.sampleLabel,
              items: [
                {
                  icon: "link",
                  label: copy.workspace.quoteLink.label,
                  value: copy.workspace.quoteLink.body,
                },
                {
                  icon: "warning",
                  label: copy.workspace.missingTitle,
                  toneName: "gold",
                  value: copy.workspace.missing.slice(0, 2).join(" / "),
                },
                {
                  icon: "copy",
                  label: copy.workspace.draft.title,
                  value: copy.workspace.actions.join(" / "),
                },
              ],
              title: copy.workspace.title,
            }}
          />
        </MarketingShell>
      </section>

      <section className="pb-[var(--bp-section-tight-space)]">
        <MarketingShell>
          <div className="grid gap-3">
            <DemoWorkspace copy={copy.workspace} />

            {copy.chapters.map((item) => (
              <MarketingCard className="p-5 sm:p-6" key={item.title}>
                <div className="grid min-w-0 gap-5 min-[1040px]:grid-cols-[minmax(0,0.92fr)_minmax(320px,0.82fr)] min-[1040px]:items-center">
                  <div className="min-w-0">
                    <span
                      className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] text-[13px] font-black text-white"
                      style={{ backgroundColor: marketingTone.blue }}
                    >
                      {item.eyebrow}
                    </span>
                    <h2 className="bp-card-title mt-4 font-black leading-tight" style={{ color: marketingTone.text }}>
                      {item.title}
                    </h2>
                    <p
                      className="mt-3 max-w-[680px] text-[15px] leading-7"
                      style={{ color: marketingTone.soft }}
                    >
                      {item.body}
                    </p>
                  </div>
                  <DemoPanel items={item.panelItems} title={item.panelTitle} />
                </div>
              </MarketingCard>
            ))}

            <MarketingCard className="p-6 sm:p-8">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                <div>
                  <h2 className="bp-section-title font-black leading-tight" style={{ color: marketingTone.text }}>
                    {copy.cta.title}
                  </h2>
                  <p
                    className="mt-3 max-w-[720px] text-[15px] leading-7"
                    style={{ color: marketingTone.soft }}
                  >
                    {copy.cta.body}
                  </p>
                </div>
                <MarketingButton href="/pilot" language={language}>
                  {copy.cta.button} <MarketingIcon name="arrow" />
                </MarketingButton>
              </div>
            </MarketingCard>

            <MarketingNextStepPanel
              language={language}
              body={copy.workspace.sampleLabel}
              items={[
                {
                  description: siteCopy.pilot.badge,
                  href: "/pilot",
                  icon: "arrow",
                  label: navCopy.pilot,
                  toneName: "gold",
                },
                {
                  description: siteCopy.pricing.badge,
                  href: "/pricing",
                  icon: "briefcase",
                  label: navCopy.pricing,
                  toneName: "blue",
                },
                {
                  description: siteCopy.quoteLinkGuide.badge,
                  href: "/quote-link-guide",
                  icon: "link",
                  label: navCopy.guide,
                },
              ]}
              title={navCopy.flow}
            />
          </div>
        </MarketingShell>
      </section>

      <MarketingFooter copy={navCopy} language={language} />
    </main>
  );
}
