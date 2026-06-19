/**
 * ============================================================
 * File: app/pricing/page.tsx
 * Project: BizPilot AI
 * Description: Public pilot pricing page for cleaning-first lead recovery.
 * Role: Presents approved staged pilot terms with readiness/payment guardrails.
 * Related:
 * - components/public/marketing-ui.tsx
 * - lib/i18n/home-copy.ts
 * - lib/i18n/public-site-copy.ts
 * Author: MoOoH
 * Last Updated: 2026-06-19
 * Change Log:
 * - 2026-06-18: Removed duplicate monthly price highlights and aligned card reflow.
 * - 2026-06-19: Moved visible pricing-page copy and metadata into the public-site i18n dictionary.
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
  return getPublicSiteCopy(language).pricing.meta;
}

export default async function PricingPage() {
  const language = await readPublicLanguage();
  const navCopy = getHomeCopy(language).nav;
  const copy = getPublicSiteCopy(language).pricing;

  return (
    <main className="public-site min-h-svh" style={{ background: marketingBackground, color: marketingTone.text }}>
      <MarketingHeader active="pricing" copy={navCopy} language={language} redirectPath="/pricing" />
      <section className="py-[var(--section-space)]">
        <MarketingShell>
          <div className="mx-auto max-w-[820px] text-center">
            <MarketingBadge>{copy.badge}</MarketingBadge>
            <h1 className="mt-6 text-[length:var(--text-page)] font-black leading-[1.06] [text-wrap:balance]" style={{ color: marketingTone.text }}>
              {copy.title}
            </h1>
            <p className="mt-6 text-[17px] leading-8" style={{ color: marketingTone.soft }}>
              {copy.body}
            </p>
          </div>

          <div className="mt-10 grid gap-5 min-[1180px]:grid-cols-3">
            {copy.cards.map((card) => (
              <MarketingCard className="flex min-w-0 flex-col p-6 sm:p-7" key={card.title}>
                <div>
                  <p className="text-[12px] font-black uppercase tracking-[0.14em]" style={{ color: marketingTone.teal }}>
                    {card.cohort}
                  </p>
                  <h2 className="mt-3 text-[27px] font-black leading-tight" style={{ color: marketingTone.text }}>
                    {card.title}
                  </h2>
                  <div className="mt-5">
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
                  {copy.guardrail.title}
                </h2>
                <p className="mt-3 text-[15px] font-bold leading-7" style={{ color: marketingTone.soft }}>
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
