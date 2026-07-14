/**
 * ============================================================
 * File: app/pilot/page.tsx
 * Project: BizPilot AI
 * Description: Public cleaning founder-pilot application page under the universal V2 positioning.
 * Role: Explains fit and process while preserving the recipient-free manual email-draft and copy-template conversion path.
 * Related:
 * - components/public/pilot-request-template-card.tsx
 * - lib/i18n/public-v2-copy.ts
 * - lib/i18n/public-site-copy.ts
 * Author: MoOoH
 * Created: 2026-06-18
 * Last Updated: 2026-07-13
 * Change Log:
 * - 2026-07-13: Separated header, main content, and footer into correct page landmarks.
 * - 2026-07-13: Added the shared main-content target for keyboard skip navigation.
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
  MarketingPageHero,
  MarketingShell,
  marketingBackground,
  marketingTone,
} from "@/components/public/marketing-ui";
import { PilotRequestTemplateCard } from "@/components/public/pilot-request-template-card";
import { INTERFACE_LANGUAGE_COOKIE } from "@/lib/i18n/language";
import { getPublicSiteCopy } from "@/lib/i18n/public-site-copy";
import { getPublicV2Copy } from "@/lib/i18n/public-v2-copy";
import { buildBreadcrumbJsonLd } from "@/lib/public-structured-data";
import {
  buildPublicMetadata,
  resolvePublicRouteLanguage,
  type PublicRouteSearchParams,
} from "@/lib/seo";

type PilotPageProps = Readonly<{ searchParams?: PublicRouteSearchParams }>;

async function readPublicLanguage(searchParams?: PublicRouteSearchParams) {
  return resolvePublicRouteLanguage(
    searchParams,
    (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );
}

export async function generateMetadata({
  searchParams,
}: PilotPageProps = {}): Promise<Metadata> {
  const language = await readPublicLanguage(searchParams);
  return buildPublicMetadata(
    "/pilot",
    getPublicV2Copy(language).pilot.meta,
    language,
  );
}

export default async function PilotPage({ searchParams }: PilotPageProps = {}) {
  const language = await readPublicLanguage(searchParams);
  const v2 = getPublicV2Copy(language);
  const copy = v2.pilot;
  const conversion = getPublicSiteCopy(language).pilot.conversion;

  return (
    <div
      className="bp-page public-site min-h-svh"
      style={{ background: marketingBackground, color: marketingTone.text }}
    >
      <JsonLdScript
        data={buildBreadcrumbJsonLd(
          [
            { name: "BizPilot AI", path: "/" },
            { name: copy.title, path: "/pilot" },
          ],
          language,
        )}
        id="bizpilot-v2-pilot-breadcrumb-jsonld"
      />
      <MarketingHeader
        copy={v2.home.nav}
        language={language}
        redirectPath="/pilot"
      />
      <main id="main-content">

      <section className="bp-section-tight">
        <MarketingShell>
          <MarketingPageHero
            actions={[
              {
                href: "#pilot-request-template",
                label: (
                  <>
                    {copy.primaryCta}
                    <MarketingIcon name="arrow" />
                  </>
                ),
              },
              {
                href: "/pricing",
                label: copy.secondaryCta,
                variant: "secondary",
              },
            ]}
            badge={copy.badge}
            body={copy.body}
            language={language}
            signals={copy.signals.map((signal, index) => ({
              icon: index === 0 ? "briefcase" : index === 1 ? "link" : "shield",
              label: signal.label,
              toneName: index === 2 ? "gold" : "teal",
              value: signal.value,
            }))}
            title={copy.title}
            visual={{
              body: copy.sections[1]?.title ?? copy.body,
              eyebrow: copy.badge,
              items: (copy.sections[1]?.cards ?? []).map((card, index) => ({
                icon: index === 0 ? "search" : index === 1 ? "pen" : index === 2 ? "user" : "message",
                label: card.badge ?? `${index + 1}`,
                value: card.title,
              })),
              title: copy.sections[0]?.title ?? copy.title,
            }}
          />

          <div className="mt-8 grid min-w-0 gap-8 min-[1100px]:grid-cols-[minmax(0,0.95fr)_minmax(340px,0.72fr)] min-[1100px]:items-start">
            <div className="grid min-w-0 gap-5">
              {copy.sections.map((section) => (
                <MarketingCard className="p-5 sm:p-6" key={section.title}>
                  {section.eyebrow ? (
                    <p
                      className="bp-copy-eyebrow text-[12px] font-black uppercase tracking-[0.14em]"
                      style={{ color: marketingTone.teal }}
                    >
                      {section.eyebrow}
                    </p>
                  ) : null}
                  <h2
                    className="bp-card-title bp-copy-section-title mt-3 font-black leading-tight"
                    style={{ color: marketingTone.text }}
                  >
                    {section.title}
                  </h2>
                  {section.body ? (
                    <p
                      className="bp-copy-card-body mt-3 text-[15px] leading-7"
                      style={{ color: marketingTone.soft }}
                    >
                      {section.body}
                    </p>
                  ) : null}
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {section.cards.map((card, index) => (
                      <div
                        className="min-w-0 rounded-[14px] border p-4"
                        key={card.title}
                        style={{
                          backgroundColor: "var(--surface-interactive)",
                          borderColor: marketingTone.border,
                        }}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] text-[11px] font-black"
                            style={{
                              backgroundColor:
                                "color-mix(in srgb, var(--accent) 12%, var(--surface))",
                              color: marketingTone.teal,
                            }}
                          >
                            {card.badge ?? index + 1}
                          </span>
                          <h3
                            className="min-w-0 text-[14px] font-black leading-5"
                            style={{ color: marketingTone.text }}
                          >
                            {card.title}
                          </h3>
                        </div>
                        <p
                          className="mt-3 text-[13px] font-bold leading-6"
                          style={{ color: marketingTone.soft }}
                        >
                          {card.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </MarketingCard>
              ))}
            </div>

            <div className="min-w-0" id="pilot-request-template">
              <MarketingCard className="p-6 sm:p-7">
                <PilotRequestTemplateCard copy={conversion} language={language} />
              </MarketingCard>
            </div>
          </div>

          {copy.notice ? (
            <MarketingCard
              className="mt-8 p-6 sm:p-7"
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--warning) 10%, var(--surface)), var(--surface) 72%)",
                borderColor:
                  "color-mix(in srgb, var(--warning) 30%, var(--border-default))",
              }}
            >
              <MarketingBadge toneName="gold">{copy.notice.badge}</MarketingBadge>
              <h2
                className="bp-card-title bp-copy-section-title mt-4 font-black leading-tight"
                style={{ color: marketingTone.text }}
              >
                {copy.notice.title}
              </h2>
              <p
                className="bp-copy-card-body mt-3 text-[15px] leading-8"
                style={{ color: marketingTone.soft }}
              >
                {copy.notice.body}
              </p>
            </MarketingCard>
          ) : null}

          <MarketingCard
            className="mt-8 p-6 sm:p-8"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in srgb, var(--primary) 12%, var(--surface)), var(--surface) 70%)",
              borderColor:
                "color-mix(in srgb, var(--primary) 28%, var(--border-default))",
            }}
          >
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <h2
                  className="bp-section-title bp-copy-section-title font-black leading-tight"
                  style={{ color: marketingTone.text }}
                >
                  {copy.finalCta.title}
                </h2>
                <p
                  className="bp-copy-card-body mt-3 max-w-[760px] text-[15px] leading-8"
                  style={{ color: marketingTone.soft }}
                >
                  {copy.finalCta.body}
                </p>
              </div>
              <div className="bp-button-row flex flex-col gap-3 sm:flex-row lg:flex-col">
                <MarketingButton href="#pilot-request-template" language={language}>
                  {copy.finalCta.primary}
                  <MarketingIcon name="arrow" />
                </MarketingButton>
                <MarketingButton href="/demo" language={language} variant="secondary">
                  {copy.finalCta.secondary}
                </MarketingButton>
              </div>
            </div>
          </MarketingCard>
        </MarketingShell>
      </section>

      </main>
      <MarketingFooter copy={v2.home.nav} language={language} />
    </div>
  );
}
