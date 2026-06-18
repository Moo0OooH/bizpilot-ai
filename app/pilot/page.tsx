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
  title: "Founder Pilot | BizPilot AI",
  description:
    "Apply for the BizPilot AI founder pilot for cleaning businesses that want faster owner-reviewed quote replies without full CRM complexity.",
};

const fitItems = [
  "Owner-operated cleaning businesses",
  "Small cleaning teams",
  "Businesses receiving quote requests online",
  "Owners who want faster replies without full CRM complexity",
] as const;

const fields = [
  ["businessName", "Business name", "text"],
  ["ownerName", "Owner name", "text"],
  ["email", "Email", "email"],
  ["phone", "Phone", "tel"],
  ["city", "City", "text"],
  ["website", "Website or social link", "url"],
] as const;

export default async function PilotPage() {
  const language = readSupportedLanguage((await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value);
  const navCopy = getHomeCopy(language).nav;

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: marketingBackground, color: marketingTone.text }}>
      <MarketingHeader copy={navCopy} language={language} redirectPath="/pilot" />
      <section className="px-5 py-16 sm:px-6 lg:py-24">
        <MarketingShell>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.75fr)] lg:items-start">
            <div>
              <MarketingBadge>Founder pilot</MarketingBadge>
              <h1 className="mt-6 text-[38px] font-black leading-[1.06] sm:text-[56px]" style={{ color: marketingTone.text }}>
                Join the BizPilot founder pilot.
              </h1>
              <p className="mt-6 text-[17px] leading-8" style={{ color: marketingTone.soft }}>
                We&apos;re starting with a small group of cleaning businesses to improve the product around real owner workflows.
              </p>
              <MarketingCard className="mt-8 p-6">
                <h2 className="text-[20px] font-black" style={{ color: marketingTone.text }}>Who it&apos;s for</h2>
                <div className="mt-5 grid gap-3">
                  {fitItems.map((item) => (
                    <div className="flex items-center gap-3 text-[14px] font-bold" key={item} style={{ color: marketingTone.soft }}>
                      <span style={{ color: marketingTone.teal }}><MarketingIcon name="check" /></span>
                      {item}
                    </div>
                  ))}
                </div>
              </MarketingCard>
            </div>

            <MarketingCard className="p-6">
              <h2 className="text-[24px] font-black" style={{ color: marketingTone.text }}>Pilot application preview</h2>
              <p className="mt-3 text-[14px] leading-7" style={{ color: marketingTone.soft }}>
                This form UI is safe preview-only for now. It does not store pilot application data in production.
              </p>
              <form className="mt-5 grid gap-4" aria-label="Founder pilot application preview">
                {fields.map(([name, label, type]) => (
                  <label className="grid gap-1.5 text-[13px] font-bold" key={name} style={{ color: marketingTone.soft }}>
                    {label}
                    <input
                      className="h-12 rounded-[14px] border bg-white px-3 text-[15px] outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[rgba(37,99,235,0.18)]"
                      name={name}
                      type={type}
                    />
                  </label>
                ))}
                <label className="grid gap-1.5 text-[13px] font-bold" style={{ color: marketingTone.soft }}>
                  Cleaning services offered
                  <textarea className="min-h-[88px] rounded-[14px] border bg-white px-3 py-2 text-[15px] outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[rgba(37,99,235,0.18)]" name="services" />
                </label>
                <label className="grid gap-1.5 text-[13px] font-bold" style={{ color: marketingTone.soft }}>
                  Approximate quote requests per week
                  <select className="h-12 rounded-[14px] border bg-white px-3 text-[15px] outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[rgba(37,99,235,0.18)]" name="weeklyQuotes" defaultValue="">
                    <option value="" disabled>Select one</option>
                    <option>1-5</option>
                    <option>6-15</option>
                    <option>16+</option>
                    <option>Not sure</option>
                  </select>
                </label>
                <label className="grid gap-1.5 text-[13px] font-bold" style={{ color: marketingTone.soft }}>
                  Biggest lead management problem
                  <textarea className="min-h-[88px] rounded-[14px] border bg-white px-3 py-2 text-[15px] outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[rgba(37,99,235,0.18)]" name="problem" />
                </label>
                <label className="grid gap-1.5 text-[13px] font-bold" style={{ color: marketingTone.soft }}>
                  Preferred language
                  <select className="h-12 rounded-[14px] border bg-white px-3 text-[15px] outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[rgba(37,99,235,0.18)]" name="language" defaultValue="">
                    <option value="" disabled>Select one</option>
                    <option>English</option>
                    <option>French</option>
                    <option>Both</option>
                  </select>
                </label>
                <button
                  className="min-h-12 rounded-[14px] bg-slate-300 px-5 text-[14px] font-black text-slate-700"
                  type="button"
                >
                  Application form coming soon
                </button>
                <p className="text-[12px] leading-6" style={{ color: marketingTone.muted }}>
                  To apply today, email the founder directly or use the existing onboarding channel. No unapproved production data collection was added.
                </p>
                <MarketingButton href="mailto:m.beagi@gmail.com?subject=BizPilot%20AI%20founder%20pilot">
                  Email founder pilot request
                </MarketingButton>
              </form>
            </MarketingCard>
          </div>
        </MarketingShell>
      </section>
      <MarketingFooter copy={navCopy} />
    </main>
  );
}
