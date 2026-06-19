/**
 * ============================================================
 * File: app/trust/page.tsx
 * Project: BizPilot AI
 * Description: Public trust page for the manual-first founder pilot.
 * Role: Explains owner control, AI draft guardrails, readiness gates, and trust links.
 * Related:
 * - components/public/marketing-ui.tsx
 * - app/privacy/page.tsx
 * - app/security/page.tsx
 * - lib/i18n/public-site-copy.ts
 * Author: MoOoH
 * Created: 2026-06-18
 * Last Updated: 2026-06-19
 * Change Log:
 * - 2026-06-18: Tightened trust grid and added Privacy/Security links.
 * - 2026-06-19: Moved visible trust-page copy and metadata into the public-site i18n dictionary.
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
  return getPublicSiteCopy(language).trust.meta;
}

export default async function TrustPage() {
  const language = await readPublicLanguage();
  const navCopy = getHomeCopy(language).nav;
  const copy = getPublicSiteCopy(language).trust;

  return (
    <main className="public-site min-h-svh" style={{ background: marketingBackground, color: marketingTone.text }}>
      <MarketingHeader copy={navCopy} language={language} redirectPath="/trust" />
      <section className="py-[var(--section-space-compact)]">
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
          <div className="public-card-grid mt-10">
            {copy.items.map((item) => (
              <MarketingCard className="p-6" key={item.title}>
                <div className="flex items-start gap-3">
                  <span className="mt-1" style={{ color: marketingTone.teal }}><MarketingIcon name="shield" /></span>
                  <div>
                    <h2 className="text-[19px] font-black" style={{ color: marketingTone.text }}>{item.title}</h2>
                    <p className="mt-2 text-[15px] leading-7" style={{ color: marketingTone.soft }}>{item.body}</p>
                  </div>
                </div>
              </MarketingCard>
            ))}
          </div>
          <MarketingCard className="mt-8 p-6" style={{ borderColor: "rgba(245,158,11,0.28)" }}>
            <MarketingBadge toneName="gold">{copy.notes.badge}</MarketingBadge>
            <p className="mt-4 text-[15px] leading-7" style={{ color: marketingTone.soft }}>
              {copy.notes.body}
            </p>
          </MarketingCard>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <MarketingButton href="/privacy" variant="secondary">{copy.privacyCta}</MarketingButton>
            <MarketingButton href="/security" variant="secondary">{copy.securityCta}</MarketingButton>
            <MarketingButton href="/pilot">{copy.primaryCta}</MarketingButton>
          </div>
        </MarketingShell>
      </section>
      <MarketingFooter copy={navCopy} />
    </main>
  );
}
