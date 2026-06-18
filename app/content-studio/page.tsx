import type { Metadata } from "next";
import { cookies } from "next/headers";
import {
  MarketingBadge,
  MarketingButton,
  MarketingCard,
  MarketingFooter,
  MarketingHeader,
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
  title: "Content Studio Roadmap | BizPilot AI",
  description:
    "Future BizPilot AI Content Studio roadmap for owner-reviewed local business marketing content after lead recovery is validated.",
};

const cards = [
  "Instagram captions",
  "Facebook posts",
  "Google Business Profile updates",
  "Seasonal promotions",
  "Review responses",
  "Short video scripts",
  "Image prompts",
  "Visual creative briefs",
  "Content calendar",
] as const;

export default async function ContentStudioPage() {
  const language = readSupportedLanguage((await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value);
  const navCopy = getHomeCopy(language).nav;

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: marketingBackground, color: marketingTone.text }}>
      <MarketingHeader copy={navCopy} language={language} redirectPath="/content-studio" />
      <section className="px-5 py-16 sm:px-6 lg:py-24">
        <MarketingShell>
          <div className="max-w-[860px]">
            <MarketingBadge toneName="gold">Roadmap</MarketingBadge>
            <h1 className="mt-6 text-[38px] font-black leading-[1.06] sm:text-[56px]" style={{ color: marketingTone.text }}>
              Future Content Studio for local business growth.
            </h1>
            <p className="mt-6 text-[17px] leading-8" style={{ color: marketingTone.soft }}>
              BizPilot is being designed to help local service businesses create owner-reviewed marketing content after the lead recovery workflow is validated.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <MarketingCard className="p-5" key={card}>
                <p className="text-[16px] font-black" style={{ color: marketingTone.text }}>{card}</p>
              </MarketingCard>
            ))}
          </div>
          <MarketingCard className="mt-8 p-6">
            <p className="text-[16px] leading-8" style={{ color: marketingTone.soft }}>
              Like AI reply drafts, future content drafts should be reviewed by the owner before publishing.
            </p>
            <div className="mt-5">
              <MarketingButton href="/pilot">Apply for founder pilot</MarketingButton>
            </div>
          </MarketingCard>
        </MarketingShell>
      </section>
      <MarketingFooter copy={navCopy} />
    </main>
  );
}
