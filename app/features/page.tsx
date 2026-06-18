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
    <main className="min-h-screen overflow-x-hidden" style={{ background: marketingBackground, color: marketingTone.text }}>
      <MarketingHeader copy={navCopy} language={language} redirectPath="/features" />
      <section className="px-5 py-16 sm:px-6 lg:py-24">
        <MarketingShell>
          <div className="max-w-[820px]">
            <MarketingBadge>Features</MarketingBadge>
            <h1 className="mt-6 text-[38px] font-black leading-[1.06] sm:text-[56px]" style={{ color: marketingTone.text }}>
              A simple system to capture, organize, and reply to cleaning leads faster.
            </h1>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map(([title, body]) => (
              <MarketingCard className="p-6" key={title}>
                <h2 className="text-[20px] font-black" style={{ color: marketingTone.text }}>{title}</h2>
                <p className="mt-3 text-[15px] leading-7" style={{ color: marketingTone.soft }}>{body}</p>
              </MarketingCard>
            ))}
          </div>
          <MarketingCard className="mt-8 p-6" style={{ borderColor: "rgba(245,158,11,0.28)" }}>
            <MarketingBadge toneName="gold">Roadmap</MarketingBadge>
            <p className="mt-4 text-[16px] leading-8" style={{ color: marketingTone.soft }}>
              Follow-up drafts, reporting, Content Studio, integrations, and multi-industry templates are planned after validation.
            </p>
          </MarketingCard>
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
