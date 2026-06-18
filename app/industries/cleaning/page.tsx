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
    <main className="min-h-screen overflow-x-hidden" style={{ background: marketingBackground, color: marketingTone.text }}>
      <MarketingHeader copy={navCopy} language={language} redirectPath="/industries/cleaning" />
      <section className="px-5 py-16 sm:px-6 lg:py-24">
        <MarketingShell>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.7fr)] lg:items-start">
            <div>
              <MarketingBadge>Cleaning businesses first</MarketingBadge>
              <h1 className="mt-6 text-[38px] font-black leading-[1.06] sm:text-[56px]" style={{ color: marketingTone.text }}>
                Lead recovery software for cleaning businesses.
              </h1>
              <p className="mt-6 text-[17px] leading-8" style={{ color: marketingTone.soft }}>
                BizPilot helps cleaning business owners collect quote requests, organize leads, and draft fast owner-reviewed replies.
              </p>
              <p className="mt-6 text-[16px] leading-8" style={{ color: marketingTone.soft }}>
                Cleaning owners are often away from a desk. They&apos;re on jobs, driving, managing staff, or answering existing customers. Quote requests arrive at the worst time - and slow replies can cost jobs.
              </p>
            </div>
            <MarketingCard className="p-6">
              <h2 className="text-[20px] font-black" style={{ color: marketingTone.text }}>Services supported in the pilot</h2>
              <div className="mt-5 grid gap-3">
                {services.map((service) => (
                  <div className="flex items-center gap-3 text-[14px] font-bold" key={service} style={{ color: marketingTone.soft }}>
                    <span style={{ color: marketingTone.teal }}><MarketingIcon name="check" /></span>
                    {service}
                  </div>
                ))}
              </div>
            </MarketingCard>
          </div>
          <MarketingCard className="mt-10 p-6">
            <h2 className="text-[24px] font-black" style={{ color: marketingTone.text }}>Cleaning quote workflow</h2>
            <p className="mt-4 text-[16px] leading-8" style={{ color: marketingTone.soft }}>
              Customer requests quote {"->"} Owner sees service details {"->"} AI summarizes the request {"->"} AI drafts a reply {"->"} Owner copies and sends manually
            </p>
            <div className="mt-6">
              <MarketingButton href="/pilot">Join the cleaning founder pilot</MarketingButton>
            </div>
          </MarketingCard>
        </MarketingShell>
      </section>
      <MarketingFooter copy={navCopy} />
    </main>
  );
}
