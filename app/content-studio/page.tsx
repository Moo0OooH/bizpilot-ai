/**
 * ============================================================
 * File: app/content-studio/page.tsx
 * Project: BizPilot AI
 * Description: Public roadmap page for future owner-reviewed content assistance.
 * Role: Labels Content Studio as roadmap while preserving cleaning-first lead recovery scope.
 * Related:
 * - components/public/marketing-ui.tsx
 * - app/features/page.tsx
 * Author: MoOoH
 * Created: 2026-06-18
 * Last Updated: 2026-06-18
 * Change Log:
 * - 2026-06-18: Applied responsive section spacing and intrinsic card grid.
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
    <main className="public-site min-h-svh" style={{ background: marketingBackground, color: marketingTone.text }}>
      <MarketingHeader copy={navCopy} language={language} redirectPath="/content-studio" />
      <section className="py-[var(--section-space-compact)]">
        <MarketingShell>
          <div className="max-w-[860px]">
            <MarketingBadge toneName="gold">Roadmap</MarketingBadge>
            <h1 className="mt-6 text-[length:var(--text-page)] font-black leading-[1.06] [text-wrap:balance]" style={{ color: marketingTone.text }}>
              Future Content Studio for local business growth.
            </h1>
            <p className="mt-6 text-[17px] leading-8" style={{ color: marketingTone.soft }}>
              This page is roadmap only. BizPilot may later help local businesses create owner-reviewed marketing content after the cleaning lead recovery workflow is validated.
            </p>
          </div>
          <div className="public-card-grid mt-10">
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
