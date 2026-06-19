/**
 * ============================================================
 * File: app/demo/page.tsx
 * Project: BizPilot AI
 * Description: Public full-demo page for the cleaning quote recovery workflow.
 * Role: Shows the manual-first request-to-draft workflow without implying automation.
 * Related:
 * - components/public/marketing-ui.tsx
 * - app/page.tsx
 * - lib/i18n/public-site-copy.ts
 * Author: MoOoH
 * Created: 2026-06-18
 * Last Updated: 2026-06-19
 * Change Log:
 * - 2026-06-18: Grouped the demo into concise responsive chapters with visible guardrails.
 * - 2026-06-19: Moved visible demo-page copy and metadata into the public-site i18n dictionary.
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
  return getPublicSiteCopy(language).demo.meta;
}

function DemoPanel({
  items,
  title,
}: Readonly<{ items: readonly string[]; title: string }>) {
  return (
    <div className="min-w-0 rounded-[16px] border border-slate-200 bg-white p-5 shadow-[0_18px_42px_rgba(15,23,42,0.06)]">
      <p className="text-[12px] font-black uppercase tracking-[0.14em] text-slate-500">
        {title}
      </p>
      <div className="mt-3 grid gap-2">
        {items.map((item) => (
          <p
            className="rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-2 text-[14px] font-bold leading-6 text-slate-950"
            key={item}
          >
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

export default async function DemoPage() {
  const language = await readPublicLanguage();
  const navCopy = getHomeCopy(language).nav;
  const copy = getPublicSiteCopy(language).demo;

  return (
    <main
      className="public-site min-h-svh"
      style={{ background: marketingBackground, color: marketingTone.text }}
    >
      <MarketingHeader copy={navCopy} language={language} redirectPath="/demo" />

      <section className="pb-12 pt-10 sm:pt-14 lg:pb-16 lg:pt-20">
        <MarketingShell>
          <div className="mx-auto max-w-[920px] text-center">
            <MarketingBadge>{copy.badge}</MarketingBadge>
            <h1
              className="mt-5 text-[length:var(--text-page)] font-black leading-[1.06] [text-wrap:balance]"
              style={{ color: marketingTone.text }}
            >
              {copy.title}
            </h1>
            <p
              className="mx-auto mt-5 max-w-[760px] text-[17px] leading-8"
              style={{ color: marketingTone.soft }}
            >
              {copy.body}
            </p>
          </div>
        </MarketingShell>
      </section>

      <section className="pb-[var(--section-space)]">
        <MarketingShell>
          <div className="grid gap-4">
            {copy.chapters.map((item) => (
              <MarketingCard className="p-5 sm:p-6" key={item.title}>
                <div className="grid min-w-0 gap-5 min-[1040px]:grid-cols-[minmax(0,0.92fr)_minmax(320px,0.82fr)] min-[1040px]:items-center">
                  <div className="min-w-0">
                    <span
                      className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] text-[13px] font-black text-white"
                      style={{ backgroundColor: marketingTone.blue }}
                    >
                      {item.eyebrow}
                    </span>
                    <h2 className="mt-4 text-[24px] font-black leading-tight text-slate-950">
                      {item.title}
                    </h2>
                    <p
                      className="mt-3 max-w-[680px] text-[15px] leading-7"
                      style={{ color: marketingTone.soft }}
                    >
                      {item.body}
                    </p>
                  </div>
                  <DemoPanel items={item.panelItems} title={item.panelTitle} />
                </div>
              </MarketingCard>
            ))}

            <MarketingCard className="p-6 sm:p-8">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                <div>
                  <h2 className="text-[28px] font-black leading-tight text-slate-950">
                    {copy.cta.title}
                  </h2>
                  <p
                    className="mt-3 max-w-[720px] text-[15px] leading-7"
                    style={{ color: marketingTone.soft }}
                  >
                    {copy.cta.body}
                  </p>
                </div>
                <MarketingButton href="/pilot">
                  {copy.cta.button} <MarketingIcon name="arrow" />
                </MarketingButton>
              </div>
            </MarketingCard>
          </div>
        </MarketingShell>
      </section>

      <MarketingFooter copy={navCopy} />
    </main>
  );
}
