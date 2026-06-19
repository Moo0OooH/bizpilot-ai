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
 * - 2026-06-19: Rebuilt cleaning page around three service-family panels with stable service anchors.
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
          <div className="grid gap-8 min-[1040px]:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.75fr)] min-[1040px]:items-start">
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
              <MarketingBadge toneName="blue">{copy.beforeAfter.beforeLabel}</MarketingBadge>
              <p className="mt-4 rounded-[14px] border border-slate-200 bg-slate-50 p-4 text-[15px] font-black leading-7 text-slate-950">
                {copy.beforeAfter.before}
              </p>
              <h2 className="mt-5 text-[22px] font-black leading-tight" style={{ color: marketingTone.text }}>
                {copy.beforeAfter.title}
              </h2>
              <p className="mt-3 text-[14px] leading-7" style={{ color: marketingTone.soft }}>
                {copy.beforeAfter.body}
              </p>
              <div className="mt-5 rounded-[14px] border border-teal-200 bg-teal-50 p-4">
                <p className="text-[12px] font-black uppercase tracking-[0.12em] text-teal-700">
                  {copy.beforeAfter.afterLabel}
                </p>
                <p className="mt-2 text-[14px] font-bold leading-7 text-slate-950">
                  {copy.beforeAfter.after}
                </p>
              </div>
            </MarketingCard>
          </div>

          <div className="supporting-three-grid mt-10">
            {copy.families.map((family) => (
              <MarketingCard className="flex min-w-0 flex-col p-6" key={family.title}>
                <h2 className="text-[24px] font-black leading-tight" style={{ color: marketingTone.text }}>
                  {family.title}
                </h2>
                <p className="mt-3 text-[15px] leading-7" style={{ color: marketingTone.soft }}>
                  {family.body}
                </p>
                <div className="mt-5 grid gap-3">
                  {family.services.map((service) => (
                    <div
                      className="rounded-[14px] border border-slate-200 bg-slate-50 p-4"
                      id={service.id}
                      key={service.id}
                    >
                      <h3 className="text-[16px] font-black text-slate-950">
                        {service.title}
                      </h3>
                      <p className="mt-2 text-[13px] font-bold leading-6 text-slate-700">
                        {service.body}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-[14px] border border-slate-200 bg-white p-4">
                  <p className="text-[12px] font-black uppercase tracking-[0.12em] text-slate-500">
                    {family.requestLabel}
                  </p>
                  <p className="mt-2 text-[14px] font-black leading-7 text-slate-950">
                    {family.request}
                  </p>
                </div>
                <div className="mt-5 grid gap-2">
                  <p className="text-[13px] font-black uppercase tracking-[0.12em]" style={{ color: marketingTone.teal }}>
                    {family.detailsTitle}
                  </p>
                  {family.details.map((detail) => (
                    <div className="flex items-start gap-3 text-[14px] font-bold leading-6" key={detail} style={{ color: marketingTone.soft }}>
                      <span className="mt-0.5 shrink-0" style={{ color: marketingTone.teal }}>
                        <MarketingIcon name="check" />
                      </span>
                      {detail}
                    </div>
                  ))}
                </div>
              </MarketingCard>
            ))}
          </div>

          <MarketingCard className="mt-8 p-6 sm:p-7">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,0.86fr)_minmax(300px,0.72fr)] lg:items-start">
              <div>
                <h2 className="text-[24px] font-black" style={{ color: marketingTone.text }}>{copy.example.title}</h2>
                <p className="mt-3 text-[15px] leading-7" style={{ color: marketingTone.soft }}>
                  {copy.example.workflow}
                </p>
                <div className="mt-5 rounded-[14px] border p-4" style={{ backgroundColor: "var(--surface-interactive)", borderColor: marketingTone.border }}>
                  <p className="text-[12px] font-black uppercase tracking-[0.12em]" style={{ color: marketingTone.muted }}>{copy.example.requestLabel}</p>
                  <p className="mt-2 text-[15px] font-black leading-7" style={{ color: marketingTone.text }}>
                    {copy.example.request}
                  </p>
                </div>
              </div>
              <div className="grid gap-3">
                {copy.example.fields.map(([label, value]) => (
                  <div className="grid min-w-0 gap-1 rounded-[12px] border px-3 py-2 sm:grid-cols-[88px_minmax(0,1fr)]" key={label} style={{ backgroundColor: "var(--surface-interactive)", borderColor: marketingTone.border }}>
                    <span className="text-[12px] font-black uppercase tracking-[0.08em]" style={{ color: marketingTone.muted }}>{label}</span>
                    <span className="min-w-0 text-[14px] font-black" style={{ color: marketingTone.text }}>{value}</span>
                  </div>
                ))}
                <MarketingButton href="/pilot">{copy.ctaPrimary} <MarketingIcon name="arrow" /></MarketingButton>
              </div>
            </div>
          </MarketingCard>
        </MarketingShell>
      </section>
      <MarketingFooter copy={navCopy} />
    </main>
  );
}
