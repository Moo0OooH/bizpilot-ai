/**
 * ============================================================
 * File: app/features/page.tsx
 * Project: BizPilot AI
 * Description: Public features page for cleaning-first lead recovery.
 * Role: Explains quote link, inbox, lead detail, AI draft assistance, and manual copy/send with localized copy.
 * Related:
 * - components/public/marketing-ui.tsx
 * - app/page.tsx
 * - lib/i18n/public-site-copy.ts
 * Author: MoOoH
 * Created: 2026-06-18
 * Last Updated: 2026-06-21
 * Change Log:
 * - 2026-06-18: Added compact proof visual, trust strip, and responsive intrinsic grid.
 * - 2026-06-19: Moved visible feature-page copy and metadata into the public-site i18n dictionary.
 * - 2026-06-19: Locked the feature grid and rebuilt product proof as one workflow strip.
 * - 2026-06-20: Removed fixed feature-card height and tightened grid rhythm.
 * - 2026-06-21: Moved the four-step proof strip onto the canonical responsive grid.
 * - 2026-06-21: Applied localization-aware copy roles to feature and proof cards.
 * - 2026-06-25: Normalized page rhythm to canonical bp sizing primitives.
 * ============================================================
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";

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
import {
  INTERFACE_LANGUAGE_COOKIE,
} from "@/lib/i18n/language";
import { getPublicSiteCopy } from "@/lib/i18n/public-site-copy";
import {
  buildPublicMetadata,
  resolvePublicRouteLanguage,
  type PublicRouteSearchParams,
} from "@/lib/seo";

type FeaturesPageProps = Readonly<{
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
}: FeaturesPageProps = {}): Promise<Metadata> {
  const language = await readPublicLanguage(searchParams);
  return buildPublicMetadata(
    "/features",
    getPublicSiteCopy(language).features.meta,
    language,
  );
}

export default async function FeaturesPage({
  searchParams,
}: FeaturesPageProps = {}) {
  const language = await readPublicLanguage(searchParams);
  const navCopy = getHomeCopy(language).nav;
  const copy = getPublicSiteCopy(language).features;
  const featureIcons = ["link", "inbox", "briefcase", "spark", "copy", "target"] as const;

  return (
    <main className="bp-page public-site min-h-svh" style={{ background: marketingBackground, color: marketingTone.text }}>
      <MarketingHeader copy={navCopy} language={language} redirectPath="/features" />
      <section className="bp-section-tight">
        <MarketingShell>
          <div className="max-w-[820px]">
            <MarketingBadge>{copy.badge}</MarketingBadge>
            <h1 className="bp-page-title bp-copy-hero mt-5 font-black leading-[1.06]" style={{ color: marketingTone.text }}>
              {copy.title}
            </h1>
          </div>
          <div className="bp-grid-six supporting-six-grid mt-8">
            {copy.cards.map((item, index) => (
              <MarketingCard className="bp-card-structured min-w-0 p-5 sm:p-6" key={item.title}>
                <span
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-[12px]"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)",
                    color: marketingTone.teal,
                  }}
                >
                  <MarketingIcon name={featureIcons[index] ?? "check"} />
                </span>
                <h2 className="bp-card-title bp-copy-card-title font-black leading-tight" style={{ color: marketingTone.text }}>{item.title}</h2>
                <p className="bp-copy-card-body mt-3 text-[15px] leading-7" style={{ color: marketingTone.soft }}>{item.body}</p>
              </MarketingCard>
            ))}
          </div>
          <MarketingCard className="mt-8 p-6 sm:p-7">
            <div className="grid gap-5">
              <div>
                <MarketingBadge>{copy.proof.badge}</MarketingBadge>
                <h2 className="bp-section-title bp-copy-section-title mt-4 font-black leading-tight" style={{ color: marketingTone.text }}>
                  {copy.proof.title}
                </h2>
                <p className="bp-copy-card-body mt-3 text-[15px] leading-7" style={{ color: marketingTone.soft }}>
                  {copy.proof.body}
                </p>
              </div>
              <div className="supporting-four-grid">
                {copy.proof.items.map((item, index) => (
                  <div className="min-w-0 rounded-[14px] border border-slate-200 bg-slate-50 p-4 text-slate-950" key={item}>
                    <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-slate-950 text-[12px] font-black text-white">
                      {index + 1}
                    </span>
                    <span className="bp-copy-card-body mt-3 block text-[14px] font-black leading-6">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </MarketingCard>
          <MarketingCard className="mt-8 p-6" style={{ borderColor: "rgba(245,158,11,0.28)" }}>
            <MarketingBadge toneName="gold">{copy.roadmap.badge}</MarketingBadge>
            <p className="bp-copy-card-body mt-4 text-[16px] leading-8" style={{ color: marketingTone.soft }}>
              {copy.roadmap.body}
            </p>
          </MarketingCard>
          <div className="bp-button-row mt-8 flex flex-wrap gap-2 rounded-[16px] border border-slate-200 bg-white p-4 text-[13px] font-black" style={{ color: marketingTone.soft }}>
            {copy.badges.map((item) => (
              <span className="bp-copy-status inline-flex min-h-10 items-center rounded-full border border-slate-200 px-3" key={item}>{item}</span>
            ))}
          </div>
          <div className="bp-button-row mt-8 flex flex-col gap-3 sm:flex-row">
            <MarketingButton href="/pilot">{copy.primaryCta} <MarketingIcon name="arrow" /></MarketingButton>
            <MarketingButton href="/trust" variant="secondary">{copy.secondaryCta}</MarketingButton>
          </div>
        </MarketingShell>
      </section>
      <MarketingFooter copy={navCopy} />
    </main>
  );
}
