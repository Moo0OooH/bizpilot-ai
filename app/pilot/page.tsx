/**
 * ============================================================
 * File: app/pilot/page.tsx
 * Project: BizPilot AI
 * Description: Public founder-pilot application information page.
 * Role: Explains the pilot process while keeping the preview-only request UI non-submitting.
 * Related:
 * - components/public/marketing-ui.tsx
 * - docs/readiness/PHASE_24_REAL_DATA_APPROVAL_GATE_2026-05-30.md
 * - lib/i18n/public-site-copy.ts
 * Author: MoOoH
 * Created: 2026-06-18
 * Last Updated: 2026-06-19
 * Change Log:
 * - 2026-06-18: Made the request UI unmistakably preview-only with disabled controls.
 * - 2026-06-19: Moved visible pilot-page copy and metadata into the public-site i18n dictionary.
 * ============================================================
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";

import {
  MarketingBadge,
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
  return getPublicSiteCopy(language).pilot.meta;
}

export default async function PilotPage() {
  const language = await readPublicLanguage();
  const navCopy = getHomeCopy(language).nav;
  const copy = getPublicSiteCopy(language).pilot;
  const fields = [
    ["businessName", copy.form.businessName, "text"],
    ["ownerName", copy.form.ownerName, "text"],
    ["email", copy.form.email, "email"],
    ["phone", copy.form.phone, "tel"],
    ["city", copy.form.city, "text"],
    ["website", copy.form.website, "url"],
  ] as const;

  return (
    <main
      className="public-site min-h-svh"
      style={{ background: marketingBackground, color: marketingTone.text }}
    >
      <MarketingHeader copy={navCopy} language={language} redirectPath="/pilot" />
      <section className="py-[var(--section-space)]">
        <MarketingShell>
          <div className="grid gap-10 min-[1100px]:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.75fr)] min-[1100px]:items-start">
            <div>
              <MarketingBadge>{copy.badge}</MarketingBadge>
              <h1
                className="mt-6 text-[length:var(--text-page)] font-black leading-[1.06] [text-wrap:balance]"
                style={{ color: marketingTone.text }}
              >
                {copy.title}
              </h1>
              <p
                className="mt-6 text-[17px] leading-8"
                style={{ color: marketingTone.soft }}
              >
                {copy.body}
              </p>

              <MarketingCard className="mt-8 p-6">
                <h2
                  className="text-[20px] font-black"
                  style={{ color: marketingTone.text }}
                >
                  {copy.nextStepsTitle}
                </h2>
                <div className="mt-5 grid gap-3">
                  {copy.nextSteps.map((item, index) => (
                    <div
                      className="grid grid-cols-[36px_minmax(0,1fr)] items-start gap-3 text-[14px] font-bold"
                      key={item}
                      style={{ color: marketingTone.soft }}
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#2563EB] text-[12px] font-black text-white">
                        {index + 1}
                      </span>
                      <span className="min-w-0 pt-1.5">{item}</span>
                    </div>
                  ))}
                </div>
              </MarketingCard>

              <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-1">
                <MarketingCard className="p-6">
                  <h2
                    className="text-[20px] font-black"
                    style={{ color: marketingTone.text }}
                  >
                    {copy.getTitle}
                  </h2>
                  <div className="mt-5 grid gap-3">
                    {copy.getItems.map((item) => (
                      <div
                        className="flex items-start gap-3 text-[14px] font-bold"
                        key={item}
                        style={{ color: marketingTone.soft }}
                      >
                        <span className="mt-0.5" style={{ color: marketingTone.teal }}>
                          <MarketingIcon name="check" />
                        </span>
                        {item}
                      </div>
                    ))}
                  </div>
                </MarketingCard>

                <MarketingCard className="p-6">
                  <h2
                    className="text-[20px] font-black"
                    style={{ color: marketingTone.text }}
                  >
                    {copy.fitTitle}
                  </h2>
                  <div className="mt-5 grid gap-3">
                    {copy.fitItems.map((item) => (
                      <div
                        className="flex items-start gap-3 text-[14px] font-bold"
                        key={item}
                        style={{ color: marketingTone.soft }}
                      >
                        <span className="mt-0.5" style={{ color: marketingTone.teal }}>
                          <MarketingIcon name="check" />
                        </span>
                        {item}
                      </div>
                    ))}
                  </div>
                </MarketingCard>
              </div>
            </div>

            <MarketingCard className="p-6">
              <h2
                className="text-[24px] font-black"
                style={{ color: marketingTone.text }}
              >
                {copy.form.title}
              </h2>
              <p
                className="mt-3 rounded-[14px] border border-amber-200 bg-amber-50 p-4 text-[13px] font-bold leading-6 text-amber-800"
                id="pilot-preview-status"
              >
                {copy.form.previewNotice}
              </p>
              <p
                className="mt-4 text-[14px] leading-7"
                style={{ color: marketingTone.soft }}
              >
                {copy.form.previewBody}
              </p>
              <form
                aria-describedby="pilot-preview-status"
                aria-label={copy.form.title}
                className="mt-5 grid gap-4"
              >
                <fieldset className="grid gap-4 opacity-60" disabled>
                <legend className="sr-only">{copy.form.fieldsetLegend}</legend>
                {fields.map(([name, label, type]) => (
                  <label
                    className="grid gap-1.5 text-[13px] font-bold"
                    key={name}
                    style={{ color: marketingTone.soft }}
                  >
                    {label}
                    <input
                      className="h-12 rounded-[14px] border bg-white px-3 text-[15px] outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[rgba(37,99,235,0.18)]"
                      disabled
                      name={name}
                      type={type}
                    />
                  </label>
                ))}
                <label
                  className="grid gap-1.5 text-[13px] font-bold"
                  style={{ color: marketingTone.soft }}
                >
                  {copy.form.services}
                  <textarea
                    className="min-h-[88px] rounded-[14px] border bg-white px-3 py-2 text-[15px] outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[rgba(37,99,235,0.18)]"
                    disabled
                    name="services"
                  />
                </label>
                <label
                  className="grid gap-1.5 text-[13px] font-bold"
                  style={{ color: marketingTone.soft }}
                >
                  {copy.form.weeklyQuotes}
                  <select
                    className="h-12 rounded-[14px] border bg-white px-3 text-[15px] outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[rgba(37,99,235,0.18)]"
                    defaultValue=""
                    disabled
                    name="weeklyQuotes"
                  >
                    <option disabled value="">{copy.form.selectOne}</option>
                    {copy.form.weeklyQuoteOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
                <label
                  className="grid gap-1.5 text-[13px] font-bold"
                  style={{ color: marketingTone.soft }}
                >
                  {copy.form.biggestProblem}
                  <textarea
                    className="min-h-[88px] rounded-[14px] border bg-white px-3 py-2 text-[15px] outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[rgba(37,99,235,0.18)]"
                    disabled
                    name="problem"
                  />
                </label>
                <label
                  className="grid gap-1.5 text-[13px] font-bold"
                  style={{ color: marketingTone.soft }}
                >
                  {copy.form.language}
                  <select
                    className="h-12 rounded-[14px] border bg-white px-3 text-[15px] outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[rgba(37,99,235,0.18)]"
                    defaultValue=""
                    disabled
                    name="language"
                  >
                    <option disabled value="">{copy.form.selectOne}</option>
                    {copy.form.languageOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
                </fieldset>
                <button
                  aria-disabled="true"
                  className="min-h-12 cursor-not-allowed rounded-[14px] bg-slate-300 px-5 text-[14px] font-black text-slate-600"
                  disabled
                  type="button"
                >
                  {copy.form.copyTemplate}
                </button>
                <div className="rounded-[14px] border border-amber-200 bg-amber-50 p-4">
                  <p className="text-[13px] font-black text-amber-800">
                    {copy.form.previewStatus}
                  </p>
                  <p className="mt-2 text-[12px] leading-6 text-amber-800">
                    {copy.form.safeBody}
                  </p>
                </div>
                <MarketingCard className="p-4" style={{ boxShadow: "none" }}>
                  <p
                    className="text-[12px] font-black uppercase tracking-[0.12em]"
                    style={{ color: marketingTone.teal }}
                  >
                    {copy.form.requestTemplateLabel}
                  </p>
                  <div
                    className="mt-3 whitespace-pre-line text-[13px] font-bold leading-7"
                    style={{ color: marketingTone.soft }}
                  >
                    {copy.form.requestTemplate}
                  </div>
                </MarketingCard>
              </form>
            </MarketingCard>
          </div>
        </MarketingShell>
      </section>
      <MarketingFooter copy={navCopy} />
    </main>
  );
}
