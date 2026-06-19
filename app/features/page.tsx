/**
 * ============================================================
 * File: app/features/page.tsx
 * Project: BizPilot AI
 * Description: Public features page for cleaning-first lead recovery.
 * Role: Explains quote link, inbox, lead detail, AI draft assistance, and manual copy/send.
 * Related:
 * - components/public/marketing-ui.tsx
 * - app/page.tsx
 * Author: MoOoH
 * Created: 2026-06-18
 * Last Updated: 2026-06-18
 * Change Log:
 * - 2026-06-18: Added compact proof visual, trust strip, and responsive intrinsic grid.
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
  title: "Features | BizPilot AI",
  description:
    "BizPilot AI features for cleaning businesses: quote link, lead inbox, lead detail, owner-reviewed AI drafts, and manual copy/send workflow.",
};

const features = [
  ["Quote link", "Give customers one simple place to request a quote."],
  ["Lead inbox", "See new quote requests in an organized dashboard instead of scattered messages."],
  ["Lead detail", "Review service type, contact info, timing, notes, and reply status."],
  ["AI draft assistant", "Generate a helpful first reply that the owner can review and edit."],
  ["Manual copy/send", "Copy the response and send it yourself through your preferred channel."],
  ["Trust-first workflow", "No automatic customer messaging in the first pilot."],
] as const;

export default async function FeaturesPage() {
  const language = readSupportedLanguage((await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value);
  const navCopy = getHomeCopy(language).nav;

  return (
    <main className="public-site min-h-svh" style={{ background: marketingBackground, color: marketingTone.text }}>
      <MarketingHeader copy={navCopy} language={language} redirectPath="/features" />
      <section className="py-[var(--section-space-compact)]">
        <MarketingShell>
          <div className="max-w-[820px]">
            <MarketingBadge>Features</MarketingBadge>
            <h1 className="mt-6 text-[length:var(--text-page)] font-black leading-[1.06] [text-wrap:balance]" style={{ color: marketingTone.text }}>
              A simple system to capture, organize, and reply to cleaning leads faster.
            </h1>
          </div>
          <div className="public-card-grid mt-10">
            {features.map(([title, body]) => (
              <MarketingCard className="p-6" key={title}>
                <h2 className="text-[20px] font-black" style={{ color: marketingTone.text }}>{title}</h2>
                <p className="mt-3 text-[15px] leading-7" style={{ color: marketingTone.soft }}>{body}</p>
              </MarketingCard>
            ))}
          </div>
          <MarketingCard className="mt-8 p-6 sm:p-7">
            <div className="grid gap-5 min-[900px]:grid-cols-[minmax(0,0.9fr)_minmax(260px,0.7fr)] min-[900px]:items-center">
              <div>
                <MarketingBadge>Product proof</MarketingBadge>
                <h2 className="mt-4 text-[26px] font-black leading-tight" style={{ color: marketingTone.text }}>
                  From quote link to owner-reviewed reply.
                </h2>
                <p className="mt-3 text-[15px] leading-7" style={{ color: marketingTone.soft }}>
                  BizPilot keeps the first pilot focused: collect the request, organize what matters, draft a helpful reply, and leave the final send to the owner.
                </p>
              </div>
              <div className="grid gap-2">
                {["Quote request captured", "Missing details highlighted", "AI draft prepared", "Owner copies and sends manually"].map((item) => (
                  <div className="flex min-w-0 items-center gap-3 rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-2 text-[14px] font-black text-slate-950" key={item}>
                    <span className="text-teal-600"><MarketingIcon name="check" /></span>
                    <span className="min-w-0">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </MarketingCard>
          <MarketingCard className="mt-8 p-6" style={{ borderColor: "rgba(245,158,11,0.28)" }}>
            <MarketingBadge toneName="gold">Roadmap</MarketingBadge>
            <p className="mt-4 text-[16px] leading-8" style={{ color: marketingTone.soft }}>
              Follow-up drafts, reporting, Content Studio, integrations, and multi-industry templates are planned after validation.
            </p>
          </MarketingCard>
          <div className="mt-8 flex flex-wrap gap-2 rounded-[16px] border border-slate-200 bg-white p-4 text-[13px] font-black" style={{ color: marketingTone.soft }}>
            {["No auto-send", "No invented price", "Owner decides", "Cleaning-first pilot"].map((item) => (
              <span className="inline-flex min-h-10 items-center rounded-full border border-slate-200 px-3" key={item}>{item}</span>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <MarketingButton href="/pilot">Join founder pilot <MarketingIcon name="arrow" /></MarketingButton>
            <MarketingButton href="/trust" variant="secondary">Read trust approach</MarketingButton>
          </div>
        </MarketingShell>
      </section>
      <MarketingFooter copy={navCopy} />
    </main>
  );
}
