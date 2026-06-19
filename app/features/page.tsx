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
 * Last Updated: 2026-06-19
 * Change Log:
 * - 2026-06-18: Added compact proof visual, trust strip, and responsive intrinsic grid.
 * - 2026-06-19: Moved visible feature-page copy and metadata into the public-site i18n dictionary.
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
  readSupportedLanguage,
} from "@/lib/i18n/language";
import { getPublicSiteCopy } from "@/lib/i18n/public-site-copy";

async function readPublicLanguage() {
  return readSupportedLanguage(
    (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const language = await readPublicLanguage();
  return getPublicSiteCopy(language).features.meta;
}

export default async function FeaturesPage() {
  const language = await readPublicLanguage();
  const navCopy = getHomeCopy(language).nav;
  const copy = getPublicSiteCopy(language).features;

  return (
    <main className="public-site min-h-svh" style={{ background: marketingBackground, color: marketingTone.text }}>
      <MarketingHeader copy={navCopy} language={language} redirectPath="/features" />
      <section className="py-[var(--section-space-compact)]">
        <MarketingShell>
          <div className="max-w-[820px]">
            <MarketingBadge>{copy.badge}</MarketingBadge>
            <h1 className="mt-6 text-[length:var(--text-page)] font-black leading-[1.06] [text-wrap:balance]" style={{ color: marketingTone.text }}>
              {copy.title}
            </h1>
          </div>
          <div className="public-card-grid mt-10">
            {copy.cards.map((item) => (
              <MarketingCard className="p-6" key={item.title}>
                <h2 className="text-[20px] font-black" style={{ color: marketingTone.text }}>{item.title}</h2>
                <p className="mt-3 text-[15px] leading-7" style={{ color: marketingTone.soft }}>{item.body}</p>
              </MarketingCard>
            ))}
          </div>
          <MarketingCard className="mt-8 p-6 sm:p-7">
            <div className="grid gap-5 min-[900px]:grid-cols-[minmax(0,0.9fr)_minmax(260px,0.7fr)] min-[900px]:items-center">
              <div>
                <MarketingBadge>{copy.proof.badge}</MarketingBadge>
                <h2 className="mt-4 text-[26px] font-black leading-tight" style={{ color: marketingTone.text }}>
                  {copy.proof.title}
                </h2>
                <p className="mt-3 text-[15px] leading-7" style={{ color: marketingTone.soft }}>
                  {copy.proof.body}
                </p>
              </div>
              <div className="grid gap-2">
                {copy.proof.items.map((item) => (
                  <div className="flex min-w-0 items-center gap-3 rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-2 text-[14px] font-black text-slate-950" key={item}>
                    <span className="text-teal-600"><MarketingIcon name="check" /></span>
                    <span className="min-w-0">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </MarketingCard>
          <MarketingCard className="mt-8 p-6" style={{ borderColor: "rgba(245,158,11,0.28)" }}>
            <MarketingBadge toneName="gold">{copy.roadmap.badge}</MarketingBadge>
            <p className="mt-4 text-[16px] leading-8" style={{ color: marketingTone.soft }}>
              {copy.roadmap.body}
            </p>
          </MarketingCard>
          <div className="mt-8 flex flex-wrap gap-2 rounded-[16px] border border-slate-200 bg-white p-4 text-[13px] font-black" style={{ color: marketingTone.soft }}>
            {copy.badges.map((item) => (
              <span className="inline-flex min-h-10 items-center rounded-full border border-slate-200 px-3" key={item}>{item}</span>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <MarketingButton href="/pilot">{copy.primaryCta} <MarketingIcon name="arrow" /></MarketingButton>
            <MarketingButton href="/trust" variant="secondary">{copy.secondaryCta}</MarketingButton>
          </div>
        </MarketingShell>
      </section>
      <MarketingFooter copy={navCopy} />
    </main>
  );
}
