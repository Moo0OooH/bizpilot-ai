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
  title: "Trust | BizPilot AI",
  description:
    "BizPilot AI is manual-first: AI drafts, owners review, and no customer messages are sent automatically in the first pilot.",
};

const trustItems = [
  ["No auto-send", "BizPilot does not automatically send customer messages in the first pilot."],
  ["Owner-reviewed AI", "AI drafts are reviewed, edited, and sent manually by the business owner."],
  ["No fake pricing", "The assistant should ask for missing details instead of inventing prices."],
  ["No booking confirmation", "A quote request never becomes a confirmed booking by itself."],
  ["Real customer data readiness gate", "Real customer data stays blocked until final readiness approval is complete."],
  ["Safe fallback if AI is unavailable", "If AI is unavailable, the owner still has a clear manual workflow."],
  ["Manual communication only in first pilot", "The first pilot is built around copy/send owner control."],
] as const;

export default async function TrustPage() {
  const language = readSupportedLanguage((await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value);
  const navCopy = getHomeCopy(language).nav;

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: marketingBackground, color: marketingTone.text }}>
      <MarketingHeader copy={navCopy} language={language} redirectPath="/trust" />
      <section className="px-5 py-16 sm:px-6 lg:py-24">
        <MarketingShell>
          <div className="mx-auto max-w-[820px] text-center">
            <MarketingBadge>Trust-first workflow</MarketingBadge>
            <h1 className="mt-6 text-[38px] font-black leading-[1.06] sm:text-[56px]" style={{ color: marketingTone.text }}>
              Built for owner control and trust.
            </h1>
            <p className="mt-6 text-[17px] leading-8" style={{ color: marketingTone.soft }}>
              BizPilot is manual-first. AI assists with drafts, but the owner reviews and sends every customer message.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {trustItems.map(([title, body]) => (
              <MarketingCard className="p-6" key={title}>
                <div className="flex items-start gap-3">
                  <span className="mt-1" style={{ color: marketingTone.teal }}><MarketingIcon name="shield" /></span>
                  <div>
                    <h2 className="text-[19px] font-black" style={{ color: marketingTone.text }}>{title}</h2>
                    <p className="mt-2 text-[15px] leading-7" style={{ color: marketingTone.soft }}>{body}</p>
                  </div>
                </div>
              </MarketingCard>
            ))}
          </div>
          <MarketingCard className="mt-8 p-6" style={{ borderColor: "rgba(245,158,11,0.28)" }}>
            <MarketingBadge toneName="gold">Technical readiness notes</MarketingBadge>
            <p className="mt-4 text-[15px] leading-7" style={{ color: marketingTone.soft }}>
              BizPilot&apos;s commercial pilot terms are staged, but real customer data and paid pilot execution still depend on readiness gates, including final no-secret production smoke, explicit owner approval before real customer data, and a prepared manual invoice or Stripe Payment Link process before collecting payment.
            </p>
          </MarketingCard>
          <div className="mt-8 text-center">
            <MarketingButton href="/pilot">Apply for founder pilot</MarketingButton>
          </div>
        </MarketingShell>
      </section>
      <MarketingFooter copy={navCopy} />
    </main>
  );
}
