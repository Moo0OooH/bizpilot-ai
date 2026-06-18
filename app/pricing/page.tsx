/**
 * ============================================================
 * File: app/pricing/page.tsx
 * Project: BizPilot AI
 * Description: Public pilot pricing page for cleaning-first lead recovery.
 * Role: Presents approved staged pilot terms with readiness/payment guardrails.
 * Related:
 * - components/public/marketing-ui.tsx
 * - lib/i18n/home-copy.ts
 * Author: MoOoH
 * Last Updated: 2026-06-18
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
  title: "Pilot Pricing | BizPilot AI",
  description:
    "Approved staged pilot pricing for cleaning businesses exploring BizPilot AI lead recovery, with manual setup and payment guardrails.",
};

const pricingCards = [
  {
    bullets: [
      "Founder-led setup",
      "Cleaning quote request link",
      "Lead inbox",
      "AI summary and reply draft assistance",
      "Manual copy/send workflow",
      "30- and 60-day feedback commitment",
      "No auto-send",
    ],
    cohort: "For first 1-5 cleaning businesses",
    cta: "Apply for founder pilot",
    highlight: "Feedback commitment required",
    priceLines: ["$0 setup"],
    title: "Founder Feedback Pilot",
  },
  {
    bullets: [
      "Public quote page",
      "Lead recovery dashboard",
      "AI reply drafts owner reviews",
      "Manual follow-up visibility",
      "Founder setup guidance",
      "Manual invoice or Stripe Payment Link only",
    ],
    cohort: "For customers 6-20",
    cta: "Apply for pilot",
    highlight: "$49/month",
    priceLines: ["$149 setup", "$49/month"],
    title: "Starter Pilot",
  },
  {
    bullets: [
      "Everything in Starter",
      "Stronger branded quote page",
      "Reply style and FAQ tuning",
      "Follow-up draft tuning",
      "Better lead organization",
      "Priority onboarding",
      "Simple usage insights",
    ],
    cohort: "After proof / after first 20 customers",
    cta: "Apply for pilot",
    highlight: "$79/month",
    priceLines: ["$199 setup", "$79/month"],
    title: "Pro Pilot",
  },
] as const;

export default async function PricingPage() {
  const language = readSupportedLanguage(
    (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );
  const navCopy = getHomeCopy(language).nav;

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: marketingBackground, color: marketingTone.text }}>
      <MarketingHeader active="pricing" copy={navCopy} language={language} redirectPath="/pricing" />
      <section className="px-5 py-16 sm:px-6 lg:py-24">
        <MarketingShell>
          <div className="mx-auto max-w-[820px] text-center">
            <MarketingBadge>Approved staged pilot terms</MarketingBadge>
            <h1 className="mt-6 text-[38px] font-black leading-[1.06] sm:text-[56px]" style={{ color: marketingTone.text }}>
              Simple pilot pricing for cleaning businesses.
            </h1>
            <p className="mt-6 text-[17px] leading-8" style={{ color: marketingTone.soft }}>
              BizPilot is starting with controlled cleaning-business pilot cohorts. Setup and billing stay founder-led, manual, and approval-gated.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {pricingCards.map((card) => (
              <MarketingCard className="flex min-w-0 flex-col p-6 sm:p-7" key={card.title}>
                <div>
                  <p className="text-[12px] font-black uppercase tracking-[0.14em]" style={{ color: marketingTone.teal }}>
                    {card.cohort}
                  </p>
                  <h2 className="mt-3 text-[27px] font-black leading-tight" style={{ color: marketingTone.text }}>
                    {card.title}
                  </h2>
                  <div className="mt-5 min-h-[78px]">
                    {card.priceLines.map((line) => (
                      <p className="text-[28px] font-black leading-tight" key={line} style={{ color: marketingTone.text }}>
                        {line}
                      </p>
                    ))}
                  </div>
                  <p className="mt-3 rounded-[12px] border px-3 py-2 text-[13px] font-black" style={{ borderColor: marketingTone.border, color: marketingTone.soft }}>
                    {card.highlight}
                  </p>
                </div>

                <div className="mt-6 grid flex-1 gap-3">
                  {card.bullets.map((item) => (
                    <div className="flex min-w-0 items-start gap-3 text-[14px] font-bold leading-6" key={item} style={{ color: marketingTone.soft }}>
                      <span className="mt-0.5 shrink-0" style={{ color: marketingTone.teal }}>
                        <MarketingIcon name="check" />
                      </span>
                      <span className="min-w-0 break-words">{item}</span>
                    </div>
                  ))}
                </div>

                <MarketingButton className="mt-7 w-full" href="/pilot">
                  {card.cta}
                </MarketingButton>
              </MarketingCard>
            ))}
          </div>

          <MarketingCard className="mt-8 p-6 sm:p-7" style={{ borderColor: "rgba(245,158,11,0.32)" }}>
            <div className="grid gap-5 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-[14px] bg-amber-50 text-amber-600">
                <MarketingIcon name="lock" />
              </span>
              <div>
                <h2 className="text-[23px] font-black" style={{ color: marketingTone.text }}>
                  Payment and product guardrails
                </h2>
                <p className="mt-3 text-[15px] font-bold leading-7" style={{ color: marketingTone.soft }}>
                  Payment collection starts only after final readiness approval and a manual invoice or Stripe Payment Link process is prepared. BizPilot does not include in-app billing automation, booking, invoicing, SMS/WhatsApp automation, or auto-send.
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
