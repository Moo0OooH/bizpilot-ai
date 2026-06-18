/**
 * ============================================================
 * File: app/pricing/page.tsx
 * Project: BizPilot AI
 * Description: Public pilot pricing page for cleaning-first lead recovery.
 * Role: Keeps pricing cautious while founder pilot terms are validated.
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
    "Simple founder pilot pricing information for cleaning businesses exploring BizPilot AI lead recovery.",
};

const pilotBullets = [
  "Quote request link",
  "Lead inbox",
  "AI draft assistance",
  "Manual copy/send workflow",
  "Manual onboarding",
  "Feedback-based product improvements",
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
          <div className="mx-auto max-w-[780px] text-center">
            <MarketingBadge>Founder pilot</MarketingBadge>
            <h1 className="mt-6 text-[38px] font-black leading-[1.06] sm:text-[56px]" style={{ color: marketingTone.text }}>
              Simple pilot pricing for cleaning businesses.
            </h1>
            <p className="mt-6 text-[17px] leading-8" style={{ color: marketingTone.soft }}>
              BizPilot is currently preparing a controlled founder pilot for cleaning businesses. Pilot pricing will be simple, transparent, and designed for small service businesses.
            </p>
          </div>

          <MarketingCard className="mx-auto mt-10 max-w-[760px] p-7 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[12px] font-black uppercase tracking-[0.14em]" style={{ color: marketingTone.teal }}>
                  For early cleaning businesses
                </p>
                <h2 className="mt-2 text-[30px] font-black" style={{ color: marketingTone.text }}>
                  Founder Pilot
                </h2>
              </div>
              <MarketingBadge toneName="neutral">Manual onboarding</MarketingBadge>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {pilotBullets.map((item) => (
                <div className="flex items-center gap-3 rounded-[14px] border px-4 py-3 text-[14px] font-bold" key={item} style={{ borderColor: marketingTone.border, color: marketingTone.soft }}>
                  <span style={{ color: marketingTone.teal }}>
                    <MarketingIcon name="check" />
                  </span>
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[13px] leading-6" style={{ color: marketingTone.muted }}>
                Public fixed pricing will be shared after the founder pilot terms are approved.
              </p>
              <MarketingButton href="/pilot">Apply for pilot</MarketingButton>
            </div>
          </MarketingCard>
        </MarketingShell>
      </section>
      <MarketingFooter copy={navCopy} />
    </main>
  );
}
