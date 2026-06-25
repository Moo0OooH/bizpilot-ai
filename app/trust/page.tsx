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
 * Last Updated: 2026-06-20
 * Change Log:
 * - 2026-06-18: Tightened trust grid and added Privacy/Security links.
 * - 2026-06-19: Moved visible trust-page copy and metadata into the public-site i18n dictionary.
 * - 2026-06-19: Replaced trust cards with three full-width owner-control pillars.
 * - 2026-06-20: Balanced trust as three grouped pillar columns on desktop.
 * - 2026-06-25: Normalized trust page spacing and type to canonical bp primitives.
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

type TrustPageProps = Readonly<{
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
}: TrustPageProps = {}): Promise<Metadata> {
  const language = await readPublicLanguage(searchParams);
  return buildPublicMetadata(
    "/trust",
    getPublicSiteCopy(language).trust.meta,
    language,
  );
}

export default async function TrustPage({ searchParams }: TrustPageProps = {}) {
  const language = await readPublicLanguage(searchParams);
  const navCopy = getHomeCopy(language).nav;
  const copy = getPublicSiteCopy(language).trust;

  return (
    <main className="bp-page public-site min-h-svh" style={{ background: marketingBackground, color: marketingTone.text }}>
      <MarketingHeader copy={navCopy} language={language} redirectPath="/trust" />
      <section className="bp-section-tight">
        <MarketingShell>
          <div className="mx-auto max-w-[820px] text-center">
            <MarketingBadge>{copy.badge}</MarketingBadge>
            <h1 className="bp-page-title mt-5 font-black leading-[1.06] [text-wrap:balance]" style={{ color: marketingTone.text }}>
              {copy.title}
            </h1>
            <p className="bp-body mt-5 leading-8" style={{ color: marketingTone.soft }}>
              {copy.body}
            </p>
          </div>
          <div className="bp-trust-grid supporting-three-grid mt-8">
            {copy.pillars.map((pillar) => (
              <MarketingCard className="flex min-w-0 flex-col p-5 sm:p-6" key={pillar.title}>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-[14px]" style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)", color: marketingTone.teal }}>
                  <MarketingIcon name="shield" />
                </span>
                <h2 className="bp-card-title mt-4 font-black leading-tight" style={{ color: marketingTone.text }}>{pillar.title}</h2>
                <p className="bp-copy-card-body mt-3 text-[15px] leading-7" style={{ color: marketingTone.soft }}>{pillar.body}</p>
                <div className="mt-5 grid gap-3">
                  {pillar.points.map((point) => (
                    <div className="flex min-w-0 items-start gap-3 rounded-[14px] border p-3.5 text-[14px] font-black leading-6" key={point} style={{ backgroundColor: "var(--surface-interactive)", borderColor: marketingTone.border, color: marketingTone.text }}>
                      <span className="mt-0.5 shrink-0" style={{ color: marketingTone.teal }}>
                        <MarketingIcon name="check" />
                      </span>
                      <span className="min-w-0 break-words">{point}</span>
                    </div>
                  ))}
                </div>
              </MarketingCard>
            ))}
          </div>
          <MarketingCard className="mt-8 p-6" style={{ borderColor: "rgba(245,158,11,0.28)" }}>
            <MarketingBadge toneName="gold">{copy.notes.badge}</MarketingBadge>
            <p className="bp-copy-card-body mt-4 text-[15px] leading-7" style={{ color: marketingTone.soft }}>
              {copy.notes.body}
            </p>
          </MarketingCard>
          <div className="bp-button-row mt-8 flex flex-col justify-center gap-3 sm:flex-row">
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
