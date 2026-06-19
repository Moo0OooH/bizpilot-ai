/**
 * ============================================================
 * File: app/industries/cleaning/page.tsx
 * Project: BizPilot AI
 * Description: Public cleaning-industry page for lead recovery positioning.
 * Role: Shows cleaning-specific services, workflow, and quote-request proof.
 * Related:
 * - components/public/marketing-ui.tsx
 * - app/demo/page.tsx
 * - lib/i18n/public-site-copy.ts
 * Author: MoOoH
 * Created: 2026-06-18
 * Last Updated: 2026-06-19
 * Change Log:
 * - 2026-06-18: Added quote example, organized lead details, and top/end pilot CTAs.
 * - 2026-06-19: Moved visible cleaning-page copy and metadata into the public-site i18n dictionary.
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
  return getPublicSiteCopy(language).cleaning.meta;
}

export default async function CleaningPage() {
  const language = await readPublicLanguage();
  const navCopy = getHomeCopy(language).nav;
  const copy = getPublicSiteCopy(language).cleaning;

  return (
    <main className="public-site min-h-svh" style={{ background: marketingBackground, color: marketingTone.text }}>
      <MarketingHeader copy={navCopy} language={language} redirectPath="/industries/cleaning" />
      <section className="py-[var(--section-space-compact)]">
        <MarketingShell>
          <div className="grid gap-10 min-[1040px]:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.7fr)] min-[1040px]:items-start">
            <div>
              <MarketingBadge>{copy.badge}</MarketingBadge>
              <h1 className="mt-6 text-[length:var(--text-page)] font-black leading-[1.06] [text-wrap:balance]" style={{ color: marketingTone.text }}>
                {copy.title}
              </h1>
              <p className="mt-6 text-[17px] leading-8" style={{ color: marketingTone.soft }}>
                {copy.body}
              </p>
              <p className="mt-6 text-[16px] leading-8" style={{ color: marketingTone.soft }}>
                {copy.intro}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <MarketingButton href="/pilot">{copy.ctaPrimary}</MarketingButton>
                <MarketingButton href="/demo" variant="secondary">{copy.ctaSecondary}</MarketingButton>
              </div>
            </div>
            <MarketingCard className="p-6">
              <h2 className="text-[20px] font-black" style={{ color: marketingTone.text }}>{copy.servicesTitle}</h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {copy.services.map((service) => (
                  <div className="flex min-h-10 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 text-[13px] font-bold" key={service} style={{ color: marketingTone.soft }}>
                    <span style={{ color: marketingTone.teal }}><MarketingIcon name="check" /></span>
                    {service}
                  </div>
                ))}
              </div>
            </MarketingCard>
          </div>
          <MarketingCard className="mt-10 p-6 sm:p-7">
            <div className="grid gap-6 min-[980px]:grid-cols-[minmax(0,0.86fr)_minmax(300px,0.74fr)]">
              <div>
                <h2 className="text-[24px] font-black" style={{ color: marketingTone.text }}>{copy.example.title}</h2>
                <p className="mt-4 text-[16px] leading-8" style={{ color: marketingTone.soft }}>
                  {copy.example.workflow}
                </p>
                <div className="mt-5 rounded-[16px] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[12px] font-black uppercase tracking-[0.12em] text-slate-500">{copy.example.requestLabel}</p>
                  <p className="mt-2 text-[16px] font-black leading-7 text-slate-950">
                    {copy.example.request}
                  </p>
                </div>
              </div>
              <div className="grid gap-2">
                {copy.example.fields.map(([label, value]) => (
                  <div className="grid min-w-0 gap-1 rounded-[12px] border border-slate-200 bg-white px-3 py-2 sm:grid-cols-[88px_minmax(0,1fr)]" key={label}>
                    <span className="text-[12px] font-black uppercase tracking-[0.08em] text-slate-500">{label}</span>
                    <span className="min-w-0 text-[14px] font-black text-slate-950">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </MarketingCard>
          <div className="mt-8">
            <MarketingButton href="/pilot">{copy.ctaPrimary} <MarketingIcon name="arrow" /></MarketingButton>
          </div>
        </MarketingShell>
      </section>
      <MarketingFooter copy={navCopy} />
    </main>
  );
}
