/**
 * ============================================================
 * File: app/content-studio/page.tsx
 * Project: BizPilot AI
 * Description: Public roadmap page for future owner-reviewed content assistance.
 * Role: Labels Content Studio as roadmap while preserving cleaning-first lead recovery scope.
 * Related:
 * - components/public/marketing-ui.tsx
 * - app/features/page.tsx
 * - lib/i18n/public-site-copy.ts
 * Author: MoOoH
 * Created: 2026-06-18
 * Last Updated: 2026-06-19
 * Change Log:
 * - 2026-06-18: Applied responsive section spacing and intrinsic card grid.
 * - 2026-06-19: Moved visible Content Studio roadmap copy and metadata into the public-site i18n dictionary.
 * - 2026-06-19: Rebuilt the page as a clear owner-reviewed roadmap surface.
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
  return getPublicSiteCopy(language).contentStudio.meta;
}

export default async function ContentStudioPage() {
  const language = await readPublicLanguage();
  const navCopy = getHomeCopy(language).nav;
  const copy = getPublicSiteCopy(language).contentStudio;

  return (
    <main className="public-site min-h-svh" style={{ background: marketingBackground, color: marketingTone.text }}>
      <MarketingHeader copy={navCopy} language={language} redirectPath="/content-studio" />
      <section className="py-[var(--section-space-compact)]">
        <MarketingShell>
          <div className="max-w-[860px]">
            <MarketingBadge toneName="gold">{copy.badge}</MarketingBadge>
            <h1 className="mt-6 text-[length:var(--text-page)] font-black leading-[1.06] [text-wrap:balance]" style={{ color: marketingTone.text }}>
              {copy.title}
            </h1>
            <p className="mt-6 text-[17px] leading-8" style={{ color: marketingTone.soft }}>
              {copy.body}
            </p>
          </div>
          <div className="supporting-six-grid mt-10">
            {copy.cards.map((card, index) => (
              <MarketingCard className="flex min-h-[150px] flex-col p-5" key={card}>
                <span className="flex h-9 w-9 items-center justify-center rounded-[12px] text-[12px] font-black" style={{ backgroundColor: "color-mix(in srgb, var(--warning) 14%, transparent)", color: marketingTone.gold }}>
                  {index + 1}
                </span>
                <p className="mt-4 text-[17px] font-black leading-6" style={{ color: marketingTone.text }}>{card}</p>
              </MarketingCard>
            ))}
          </div>
          <MarketingCard className="mt-8 p-6 sm:p-7">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div className="flex min-w-0 items-start gap-4">
                <span className="mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px]" style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)", color: marketingTone.teal }}>
                  <MarketingIcon name="pen" />
                </span>
                <p className="min-w-0 text-[16px] font-bold leading-8" style={{ color: marketingTone.soft }}>
                  {copy.footer}
                </p>
              </div>
              <MarketingButton href="/pilot">{copy.cta}</MarketingButton>
            </div>
          </MarketingCard>
        </MarketingShell>
      </section>
      <MarketingFooter copy={navCopy} />
    </main>
  );
}
