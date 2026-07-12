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
 * Last Updated: 2026-07-12
 * Change Log:
 * - 2026-07-12: Preserved the active public language through shared conversion links.
 * - 2026-06-21: Created the dedicated full FAQ route moved out of the homepage.
 * - 2026-06-25: Normalized FAQ rhythm and compact section headings to bp primitives.
 * - 2026-07-04: Added FAQPage and breadcrumb JSON-LD for AI-search/SEO clarity.
 * - 2026-07-05: Added a route-aware next-step panel after FAQ answers.
 * - 2026-07-11: Rebuilt the first fold with the shared research-backed public page hero.
 * ============================================================
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";

import { JsonLdScript } from "@/components/public/json-ld";
import {
  MarketingButton,
  MarketingCard,
  MarketingFooter,
  MarketingHeader,
  MarketingIcon,
  MarketingNextStepPanel,
  MarketingPageHero,
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
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
} from "@/lib/public-structured-data";
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
  const siteCopy = getPublicSiteCopy(language);
  const copy = siteCopy.faq;
  const faqItems = copy.sections.flatMap((section) => section.items);

  return (
    <main className="bp-page public-site min-h-svh" style={{ background: marketingBackground, color: marketingTone.text }}>
      <JsonLdScript
        data={buildBreadcrumbJsonLd(
          [
            { name: "Home", path: "/" },
            { name: copy.title, path: "/faq" },
          ],
          language,
        )}
        id="bizpilot-faq-breadcrumb-jsonld"
      />
      <JsonLdScript
        data={buildFaqPageJsonLd(faqItems, language)}
        id="bizpilot-faq-jsonld"
      />
      <MarketingHeader copy={navCopy} language={language} redirectPath="/faq" />
      <section className="bp-section-tight">
        <MarketingShell>
          <MarketingPageHero
            language={language}
            actions={[
              {
                href: "/pilot",
                label: (
                  <>
                    {navCopy.startFull} <MarketingIcon name="arrow" />
                  </>
                ),
              },
              {
                href: "/pricing",
                label: navCopy.pricing,
                variant: "secondary",
              },
            ]}
            badge={copy.badge}
            body={copy.body}
            signals={copy.sections.slice(0, 3).map((section, index) => ({
              icon: index === 0 ? "message" : index === 1 ? "shield" : "briefcase",
              label: copy.badge,
              value: section.title,
            }))}
            title={copy.title}
            visual={{
              body: copy.body,
              eyebrow: copy.badge,
              items: copy.sections.slice(0, 3).map((section, index) => ({
                icon: index === 0 ? "check" : index === 1 ? "lock" : "spark",
                label: section.title,
                value: section.items[0]?.question ?? section.title,
              })),
              title: navCopy.flow,
            }}
          />
        </MarketingShell>
      </section>

      <section className="pb-[var(--bp-section-tight-space)]">
        <MarketingShell>
          <div className="grid gap-8">
            {copy.sections.map((section, sectionIndex) => {
              const sectionId = `faq-section-${sectionIndex + 1}`;

              return (
                <section aria-labelledby={sectionId} className="public-faq-section" key={section.title}>
                  <div className="max-w-[760px]">
                    <h2 className="bp-card-title bp-copy-section-title font-black leading-tight" id={sectionId} style={{ color: marketingTone.text }}>
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
          <div className="bp-button-row mt-10 flex flex-col gap-3 sm:flex-row">
            <MarketingButton href="/pilot" language={language}>
              {navCopy.startFull} <MarketingIcon name="arrow" />
            </MarketingButton>
            <MarketingButton href="/pricing" language={language} variant="secondary">
              {navCopy.pricing}
            </MarketingButton>
          </div>
          <MarketingNextStepPanel
            language={language}
            body={copy.badge}
            className="mt-8"
            items={[
              {
                description: siteCopy.demo.badge,
                href: "/demo",
                icon: "radar",
                label: navCopy.demo,
                toneName: "blue",
              },
              {
                description: siteCopy.pricing.badge,
                href: "/pricing",
                icon: "briefcase",
                label: navCopy.pricing,
              },
              {
                description: siteCopy.pilot.badge,
                href: "/pilot",
                icon: "arrow",
                label: navCopy.pilot,
                toneName: "gold",
              },
            ]}
            title={navCopy.flow}
          />
        </MarketingShell>
      </section>
      <MarketingFooter copy={navCopy} language={language} />
    </main>
  );
}
