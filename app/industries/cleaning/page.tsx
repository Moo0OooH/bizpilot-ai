/**
 * ============================================================
 * File: app/industries/cleaning/page.tsx
 * Project: BizPilot AI
 * Description: Public cleaning-industry page for lead recovery positioning.
 * Role: Shows cleaning-specific services, workflow, and quote-request proof.
 * Related:
 * - components/public/marketing-ui.tsx
 * - app/demo/page.tsx
 * Author: MoOoH
 * Created: 2026-06-18
 * Last Updated: 2026-06-18
 * Change Log:
 * - 2026-06-18: Added quote example, organized lead details, and top/end pilot CTAs.
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

export const metadata: Metadata = {
  title: "Cleaning Business Lead Recovery Software | BizPilot AI",
  description:
    "BizPilot AI helps cleaning business owners collect quote requests, organize leads, and draft fast owner-reviewed replies.",
};

const services = [
  "Residential cleaning",
  "Deep cleaning",
  "Move-in / move-out",
  "Office cleaning",
  "Airbnb turnover",
  "Post-construction cleaning",
  "Small commercial cleaning",
] as const;

export default async function CleaningPage() {
  const language = readSupportedLanguage((await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value);
  const navCopy = getHomeCopy(language).nav;

  return (
    <main className="public-site min-h-svh" style={{ background: marketingBackground, color: marketingTone.text }}>
      <MarketingHeader copy={navCopy} language={language} redirectPath="/industries/cleaning" />
      <section className="py-[var(--section-space-compact)]">
        <MarketingShell>
          <div className="grid gap-10 min-[1040px]:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.7fr)] min-[1040px]:items-start">
            <div>
              <MarketingBadge>Cleaning businesses first</MarketingBadge>
              <h1 className="mt-6 text-[length:var(--text-page)] font-black leading-[1.06] [text-wrap:balance]" style={{ color: marketingTone.text }}>
                Lead recovery software for cleaning businesses.
              </h1>
              <p className="mt-6 text-[17px] leading-8" style={{ color: marketingTone.soft }}>
                BizPilot helps cleaning business owners collect quote requests, organize leads, and draft fast owner-reviewed replies.
              </p>
              <p className="mt-6 text-[16px] leading-8" style={{ color: marketingTone.soft }}>
                Cleaning owners are often away from a desk. They&apos;re on jobs, driving, managing staff, or answering existing customers. Quote requests arrive at the worst time - and slow replies can cost jobs.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <MarketingButton href="/pilot">Join the cleaning founder pilot</MarketingButton>
                <MarketingButton href="/demo" variant="secondary">See demo</MarketingButton>
              </div>
            </div>
            <MarketingCard className="p-6">
              <h2 className="text-[20px] font-black" style={{ color: marketingTone.text }}>Services supported in the pilot</h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {services.map((service) => (
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
                <h2 className="text-[24px] font-black" style={{ color: marketingTone.text }}>Cleaning quote workflow</h2>
                <p className="mt-4 text-[16px] leading-8" style={{ color: marketingTone.soft }}>
                  Customer requests quote {"->"} Owner sees service details {"->"} AI summarizes {"->"} AI drafts reply {"->"} Owner copies and sends manually
                </p>
                <div className="mt-5 rounded-[16px] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[12px] font-black uppercase tracking-[0.12em] text-slate-500">Example request</p>
                  <p className="mt-2 text-[16px] font-black leading-7 text-slate-950">
                    &quot;Hi, can you do a move-out cleaning before Friday? It&apos;s a 2-bedroom apartment.&quot;
                  </p>
                </div>
              </div>
              <div className="grid gap-2">
                {[
                  ["Service", "Move-out cleaning"],
                  ["Property", "2-bedroom apartment"],
                  ["Timing", "Before Friday"],
                  ["Missing", "square footage, appliances, access notes"],
                  ["Status", "Needs reply"],
                ].map(([label, value]) => (
                  <div className="grid min-w-0 gap-1 rounded-[12px] border border-slate-200 bg-white px-3 py-2 sm:grid-cols-[88px_minmax(0,1fr)]" key={label}>
                    <span className="text-[12px] font-black uppercase tracking-[0.08em] text-slate-500">{label}</span>
                    <span className="min-w-0 text-[14px] font-black text-slate-950">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </MarketingCard>
          <div className="mt-8">
            <MarketingButton href="/pilot">Join the cleaning founder pilot <MarketingIcon name="arrow" /></MarketingButton>
          </div>
        </MarketingShell>
      </section>
      <MarketingFooter copy={navCopy} />
    </main>
  );
}
