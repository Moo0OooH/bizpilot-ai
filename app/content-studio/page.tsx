/**
 * ============================================================
 * File: app/content-studio/page.tsx
 * Project: BizPilot AI
 * Description: Public roadmap page for future owner-reviewed content assistance.
 * Role: Labels Content Studio as roadmap while preserving the current smart-intake and owner-reviewed reply scope.
 * Related:
 * - components/public/marketing-ui.tsx
 * - app/features/page.tsx
 * - lib/i18n/public-site-copy.ts
 * Author: MoOoH
 * Created: 2026-06-18
 * Last Updated: 2026-07-12
 * Change Log:
 * - 2026-07-12: Preserved the active public language through shared conversion links.
 * - 2026-07-05: Reused the roadmap explanation in the next-step panel for clearer visitor guidance.
 * - 2026-06-18: Applied responsive section spacing and intrinsic card grid.
 * - 2026-06-19: Moved visible Content Studio roadmap copy and metadata into the public-site i18n dictionary.
 * - 2026-06-19: Rebuilt the page as a clear owner-reviewed roadmap surface.
 * - 2026-06-20: Removed fixed roadmap-card height and tightened six-card rhythm.
 * - 2026-06-25: Normalized roadmap page rhythm to canonical bp primitives.
 * - 2026-07-04: Marked roadmap-only Content Studio as noindex while keeping the route available for visitors.
 * - 2026-07-05: Added a route-aware next-step panel that keeps roadmap traffic in the current product scope.
 * - 2026-07-11: Rebuilt the first fold with the shared research-backed public page hero.
 * - 2026-07-11: Added BreadcrumbList JSON-LD for roadmap route parity with public pages.
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
import { getPublicV2NavCopy } from "@/lib/i18n/public-v2-copy";
import {
  INTERFACE_LANGUAGE_COOKIE,
} from "@/lib/i18n/language";
import { buildBreadcrumbJsonLd } from "@/lib/public-structured-data";
import { getPublicSiteCopy } from "@/lib/i18n/public-site-copy";
import {
  buildNoIndexMetadata,
  resolvePublicRouteLanguage,
  type PublicRouteSearchParams,
} from "@/lib/seo";

type ContentStudioPageProps = Readonly<{
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
}: ContentStudioPageProps = {}): Promise<Metadata> {
  const language = await readPublicLanguage(searchParams);
  return buildNoIndexMetadata(getPublicSiteCopy(language).contentStudio.meta);
}

export default async function ContentStudioPage({
  searchParams,
}: ContentStudioPageProps = {}) {
  const language = await readPublicLanguage(searchParams);
  const navCopy = getPublicV2NavCopy(language);
  const siteCopy = getPublicSiteCopy(language);
  const copy = siteCopy.contentStudio;

  return (
    <main className="bp-page public-site min-h-svh" style={{ background: marketingBackground, color: marketingTone.text }}>
      <JsonLdScript
        data={buildBreadcrumbJsonLd(
          [
            { name: "BizPilot AI", path: "/" },
            { name: copy.title, path: "/content-studio" },
          ],
          language,
        )}
        id="bizpilot-content-studio-breadcrumb-jsonld"
      />
      <MarketingHeader copy={navCopy} language={language} redirectPath="/content-studio" />
      <section className="bp-section-tight">
        <MarketingShell>
          <MarketingPageHero
            language={language}
            actions={[
              {
                href: "/pilot",
                label: copy.cta,
              },
              {
                href: "/features",
                label: navCopy.features,
                variant: "secondary",
              },
            ]}
            badge={copy.badge}
            badgeTone="gold"
            body={copy.body}
            signals={copy.cards.slice(0, 3).map((card, index) => ({
              icon: index === 0 ? "pen" : index === 1 ? "calendar" : "shield",
              label: copy.badge,
              toneName: "gold",
              value: card.title,
            }))}
            title={copy.title}
            visual={{
              body: copy.footer,
              eyebrow: copy.badge,
              items: copy.cards.slice(0, 4).map((card, index) => ({
                icon: index === 0 ? "pen" : index === 1 ? "message" : "check",
                label: `${index + 1}`,
                toneName: "gold",
                value: card.body,
              })),
              title: navCopy.why,
            }}
          />
          <div className="bp-grid-six supporting-six-grid mt-8">
            {copy.cards.map((card, index) => (
              <MarketingCard className="flex min-w-0 flex-col p-5 sm:p-6" key={card.title}>
                <span className="flex h-9 w-9 items-center justify-center rounded-[12px] text-[12px] font-black" style={{ backgroundColor: "color-mix(in srgb, var(--warning) 14%, transparent)", color: marketingTone.gold }}>
                  {index + 1}
                </span>
                <h2 className="bp-card-title mt-4 font-black leading-tight" style={{ color: marketingTone.text }}>{card.title}</h2>
                <p className="mt-3 text-[14px] font-bold leading-6" style={{ color: marketingTone.soft }}>{card.body}</p>
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
              <div className="bp-button-row">
                <MarketingButton href="/pilot" language={language}>{copy.cta}</MarketingButton>
              </div>
            </div>
          </MarketingCard>
          <MarketingNextStepPanel
            language={language}
            body={copy.body}
            className="mt-8"
            items={[
              {
                description: siteCopy.features.badge,
                href: "/features",
                icon: "spark",
                label: navCopy.features,
              },
              {
                description: siteCopy.comparison.badge,
                href: "/comparison",
                icon: "search",
                label: navCopy.comparison,
                toneName: "blue",
              },
              {
                description: siteCopy.pilot.badge,
                href: "/pilot",
                icon: "arrow",
                label: navCopy.pilot,
                toneName: "gold",
              },
            ]}
            title={navCopy.why}
          />
        </MarketingShell>
      </section>
      <MarketingFooter copy={navCopy} language={language} />
    </main>
  );
}
