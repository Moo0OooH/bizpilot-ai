/**
 * ============================================================
 * File: app/faq/page.tsx
 * Project: BizPilot AI
 * Description: Public FAQ page for the cleaning-business founder pilot.
 * Role: Presents localized product-truth, pricing, privacy, and roadmap answers without expanding pilot claims.
 * Related:
 * - app/page.tsx
 * - components/public/marketing-ui.tsx
 * - lib/i18n/public-site-copy.ts
 * Author: MoOoH
 * Created: 2026-06-21
 * Last Updated: 2026-06-21
 * Change Log:
 * - 2026-06-21: Created the dedicated full FAQ route moved out of the homepage.
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
} from "@/lib/i18n/language";
import { getPublicSiteCopy } from "@/lib/i18n/public-site-copy";
import {
  buildPublicMetadata,
  resolvePublicRouteLanguage,
  type PublicRouteSearchParams,
} from "@/lib/seo";

type FaqPageProps = Readonly<{
  searchParams?: PublicRouteSearchParams;
}>;

async function readPublicLanguage(searchParams?: PublicRouteSearchParams) {
  return resolvePublicRouteLanguage(
    searchParams,
    (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );
}

export async function generateMetadata({
  searchParams,
}: FaqPageProps = {}): Promise<Metadata> {
  const language = await readPublicLanguage(searchParams);
  return buildPublicMetadata(
    "/faq",
    getPublicSiteCopy(language).faq.meta,
    language,
  );
}

export default async function FaqPage({ searchParams }: FaqPageProps = {}) {
  const language = await readPublicLanguage(searchParams);
  const navCopy = getHomeCopy(language).nav;
  const copy = getPublicSiteCopy(language).faq;

  return (
    <main className="public-site min-h-svh" style={{ background: marketingBackground, color: marketingTone.text }}>
      <MarketingHeader copy={navCopy} language={language} redirectPath="/faq" />
      <section className="py-[var(--section-space-compact)]">
        <MarketingShell>
          <div className="max-w-[900px]">
            <MarketingBadge>{copy.badge}</MarketingBadge>
            <h1 className="bp-copy-hero mt-6 text-[length:var(--text-page)] font-black leading-[1.06]" style={{ color: marketingTone.text }}>
              {copy.title}
            </h1>
            <p className="bp-copy-hero-body mt-5 max-w-[780px] text-[17px] leading-8" style={{ color: marketingTone.soft }}>
              {copy.body}
            </p>
          </div>
        </MarketingShell>
      </section>

      <section className="pb-[var(--section-space)]">
        <MarketingShell>
          <div className="grid gap-10">
            {copy.sections.map((section, sectionIndex) => {
              const sectionId = `faq-section-${sectionIndex + 1}`;

              return (
                <section aria-labelledby={sectionId} className="public-faq-section" key={section.title}>
                  <div className="max-w-[760px]">
                    <h2 className="bp-copy-section-title text-[26px] font-black leading-tight" id={sectionId} style={{ color: marketingTone.text }}>
                      {section.title}
                    </h2>
                  </div>
                  <div className="public-faq-grid mt-5 grid gap-3 lg:grid-cols-2">
                    {section.items.map((item) => (
                      <MarketingCard className="p-5 sm:p-6" key={item.question}>
                        <details>
                          <summary className="bp-copy-card-title cursor-pointer list-none text-[16px] font-black" style={{ color: marketingTone.text }}>
                            {item.question}
                          </summary>
                          <p className="bp-copy-card-body mt-3 text-[14px] leading-7" style={{ color: marketingTone.soft }}>
                            {item.answer}
                          </p>
                        </details>
                      </MarketingCard>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <MarketingButton href="/pilot">
              {navCopy.startFull} <MarketingIcon name="arrow" />
            </MarketingButton>
            <MarketingButton href="/pricing" variant="secondary">
              {navCopy.pricing}
            </MarketingButton>
          </div>
        </MarketingShell>
      </section>
      <MarketingFooter copy={navCopy} />
    </main>
  );
}
