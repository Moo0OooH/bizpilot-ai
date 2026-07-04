/**
 * ============================================================
 * File: app/comparison/page.tsx
 * Project: BizPilot AI
 * Description: Public comparison page for cleaning-business lead recovery buyers.
 * Role: Explains where BizPilot fits versus CRMs, form builders, booking tools, and manual inboxes without expanding scope.
 * Related:
 * - components/public/marketing-ui.tsx
 * - lib/i18n/public-site-copy.ts
 * - lib/public-structured-data.ts
 * Author: MoOoH
 * Created: 2026-07-04
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

type ComparisonPageProps = Readonly<{
  searchParams?: PublicRouteSearchParams;
}>;

async function readPublicLanguage(searchParams?: PublicRouteSearchParams) {
  return resolvePublicRouteLanguage(
    searchParams,
    (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );
}

export async function generateMetadata({
  searchParams,
}: ComparisonPageProps = {}): Promise<Metadata> {
  const language = await readPublicLanguage(searchParams);
  return buildPublicMetadata(
    "/comparison",
    getPublicSiteCopy(language).comparison.meta,
    language,
  );
}

export default async function ComparisonPage({
  searchParams,
}: ComparisonPageProps = {}) {
  const language = await readPublicLanguage(searchParams);
  const navCopy = getHomeCopy(language).nav;
  const copy = getPublicSiteCopy(language).comparison;

  return (
    <main className="bp-page public-site min-h-svh" style={{ background: marketingBackground, color: marketingTone.text }}>
      <JsonLdScript
        data={buildBreadcrumbJsonLd(
          [
            { name: "BizPilot AI", path: "/" },
            { name: copy.title, path: "/comparison" },
          ],
          language,
        )}
        id="bizpilot-comparison-breadcrumb-jsonld"
      />
      <MarketingHeader active="comparison" copy={navCopy} language={language} redirectPath="/comparison" />
      <section className="bp-section-tight">
        <MarketingShell>
          <div className="max-w-[940px]">
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
              <MarketingButton href="/demo" variant="secondary">
                {copy.secondaryCta}
              </MarketingButton>
            </div>
          </div>
        </MarketingShell>
      </section>

      <section className="pb-[var(--bp-section-tight-space)]">
        <MarketingShell>
          <div className="comparison-grid grid gap-4 lg:grid-cols-2">
            {copy.rows.map((row) => (
              <MarketingCard className="grid min-w-0 gap-4 p-5 sm:p-6" key={row.option}>
                <div>
                  <p className="bp-copy-eyebrow text-[11px] font-black uppercase tracking-[0.14em]" style={{ color: marketingTone.teal }}>
                    {row.option}
                  </p>
                  <h2 className="bp-card-title bp-copy-card-title mt-2 font-black leading-tight" style={{ color: marketingTone.text }}>
                    {row.difference}
                  </h2>
                </div>
                <div className="grid gap-3">
                  <div className="rounded-[14px] border px-4 py-3" style={{ backgroundColor: "var(--surface-interactive)", borderColor: marketingTone.border }}>
                    <p className="text-[12px] font-black uppercase tracking-[0.12em]" style={{ color: marketingTone.muted }}>
                      {copy.bestForLabel}
                    </p>
                    <p className="bp-copy-card-body mt-2 text-[14px] font-bold leading-6" style={{ color: marketingTone.soft }}>
                      {row.bestFor}
                    </p>
                  </div>
                  <div className="rounded-[14px] border px-4 py-3" style={{ backgroundColor: "color-mix(in srgb, var(--warning) 8%, var(--surface))", borderColor: "color-mix(in srgb, var(--warning) 28%, var(--border-default))" }}>
                    <p className="text-[12px] font-black uppercase tracking-[0.12em]" style={{ color: marketingTone.gold }}>
                      {copy.cautionLabel}
                    </p>
                    <p className="bp-copy-card-body mt-2 text-[14px] font-bold leading-6" style={{ color: marketingTone.soft }}>
                      {row.caution}
                    </p>
                  </div>
                </div>
              </MarketingCard>
            ))}
          </div>

          <MarketingCard className="mt-8 p-6 sm:p-7">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)]">
              <div>
                <h2 className="bp-card-title bp-copy-section-title font-black leading-tight" style={{ color: marketingTone.text }}>
                  {copy.proof.title}
                </h2>
                <p className="bp-copy-card-body mt-3 text-[15px] font-bold leading-7" style={{ color: marketingTone.soft }}>
                  {copy.proof.body}
                </p>
              </div>
              <div className="supporting-four-grid">
                {copy.proof.items.map((item, index) => (
                  <div className="rounded-[14px] border px-4 py-3" key={item} style={{ backgroundColor: "var(--surface-interactive)", borderColor: marketingTone.border }}>
                    <span className="flex h-8 w-8 items-center justify-center rounded-[10px] text-[12px] font-black" style={{ backgroundColor: "var(--primary)", color: "var(--primary-contrast)" }}>
                      {index + 1}
                    </span>
                    <p className="bp-copy-card-body mt-3 text-[14px] font-black leading-6" style={{ color: marketingTone.text }}>
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </MarketingCard>

          <MarketingCard className="mt-8 p-6 sm:p-7" style={{ borderColor: "rgba(245,158,11,0.32)" }}>
            <div className="flex min-w-0 items-start gap-4">
              <span className="mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-amber-50 text-amber-600">
                <MarketingIcon name="shield" />
              </span>
              <div className="min-w-0">
                <h2 className="bp-card-title bp-copy-section-title font-black" style={{ color: marketingTone.text }}>
                  {copy.guardrail.title}
                </h2>
                <p className="bp-copy-card-body mt-3 text-[15px] font-bold leading-7" style={{ color: marketingTone.soft }}>
                  {copy.guardrail.body}
                </p>
              </div>
            </div>
          </MarketingCard>
        </MarketingShell>
      </section>
      <MarketingFooter copy={navCopy} />
    </main>
  );
}
