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
 * Last Updated: 2026-07-12
 * Change Log:
 * - 2026-07-12: Preserved the active public language through shared conversion links.
 * - 2026-06-18: Tightened trust grid and added Privacy/Security links.
 * - 2026-06-19: Moved visible trust-page copy and metadata into the public-site i18n dictionary.
 * - 2026-06-19: Replaced trust cards with three full-width owner-control pillars.
 * - 2026-06-20: Balanced trust as three grouped pillar columns on desktop.
 * - 2026-06-25: Normalized trust page spacing and type to canonical bp primitives.
 * - 2026-07-04: Added current evidence and open-gate trust boundaries.
 * - 2026-07-05: Added BreadcrumbList JSON-LD for the public page-content sweep.
 * - 2026-07-05: Added a route-aware next-step panel for trust and policy flow.
 * - 2026-07-11: Rebuilt the first fold with the shared research-backed public page hero.
 * ============================================================
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";
import { JsonLdScript } from "@/components/public/json-ld";
import {
  MarketingBadge,
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
import { buildBreadcrumbJsonLd } from "@/lib/public-structured-data";
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
  const siteCopy = getPublicSiteCopy(language);
  const copy = siteCopy.trust;

  return (
    <main className="bp-page public-site min-h-svh" style={{ background: marketingBackground, color: marketingTone.text }}>
      <JsonLdScript
        data={buildBreadcrumbJsonLd(
          [
            { name: "BizPilot AI", path: "/" },
            { name: copy.title, path: "/trust" },
          ],
          language,
        )}
        id="bizpilot-trust-breadcrumb-jsonld"
      />
      <MarketingHeader copy={navCopy} language={language} redirectPath="/trust" />
      <section className="bp-section-tight">
        <MarketingShell>
          <MarketingPageHero
            language={language}
            actions={[
              {
                href: "/privacy",
                label: copy.privacyCta,
                variant: "secondary",
              },
              {
                href: "/security",
                label: copy.securityCta,
                variant: "secondary",
              },
              {
                href: "/pilot",
                label: copy.primaryCta,
              },
            ]}
            badge={copy.badge}
            body={copy.body}
            signals={copy.pillars.map((pillar, index) => ({
              icon: index === 0 ? "shield" : index === 1 ? "pen" : "lock",
              label: pillar.title,
              value: pillar.body,
            }))}
            title={copy.title}
            visual={{
              body: copy.evidence.body,
              eyebrow: copy.evidence.title,
              items: copy.evidence.items.slice(0, 3).map((item, index) => ({
                icon: index === 0 ? "check" : index === 1 ? "shield" : "lock",
                label: item.title,
                value: item.body,
              })),
              title: copy.notes.badge,
            }}
          />
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
          <MarketingCard className="mt-8 p-5 sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[minmax(220px,0.34fr)_minmax(0,1fr)] lg:items-start">
              <div>
                <h2 className="bp-card-title bp-copy-section-title font-black leading-tight" style={{ color: marketingTone.text }}>
                  {copy.evidence.title}
                </h2>
                <p className="bp-copy-card-body mt-3 text-[15px] leading-7" style={{ color: marketingTone.soft }}>
                  {copy.evidence.body}
                </p>
              </div>
              <div className="grid gap-3 min-[900px]:grid-cols-2">
                {copy.evidence.items.map((item) => (
                  <div
                    className="bp-copy-card-body min-w-0 rounded-[14px] border px-4 py-3"
                    key={item.title}
                    style={{
                      backgroundColor: "var(--surface-interactive)",
                      borderColor: marketingTone.border,
                      color: marketingTone.soft,
                    }}
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="mt-1 shrink-0" style={{ color: marketingTone.teal }}>
                        <MarketingIcon name="lock" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-[14px] font-black leading-6" style={{ color: marketingTone.text }}>
                          {item.title}
                        </h3>
                        <p className="mt-1 text-[13px] font-bold leading-6">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </MarketingCard>
          <MarketingCard className="mt-8 p-6" style={{ borderColor: "rgba(245,158,11,0.28)" }}>
            <MarketingBadge toneName="gold">{copy.notes.badge}</MarketingBadge>
            <p className="bp-copy-card-body mt-4 text-[15px] leading-7" style={{ color: marketingTone.soft }}>
              {copy.notes.body}
            </p>
          </MarketingCard>
          <div className="bp-button-row mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <MarketingButton href="/privacy" language={language} variant="secondary">{copy.privacyCta}</MarketingButton>
            <MarketingButton href="/security" language={language} variant="secondary">{copy.securityCta}</MarketingButton>
            <MarketingButton href="/pilot" language={language}>{copy.primaryCta}</MarketingButton>
          </div>
          <MarketingNextStepPanel
            language={language}
            body={copy.evidence.title}
            className="mt-8"
            items={[
              {
                description: copy.securityCta,
                href: "/security",
                icon: "lock",
                label: navCopy.security,
                toneName: "blue",
              },
              {
                description: copy.privacyCta,
                href: "/privacy",
                icon: "shield",
                label: navCopy.privacy,
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
