/**
 * ============================================================
 * File: app/pilot/page.tsx
 * Project: BizPilot AI
 * Description: Public founder-pilot application information page.
 * Role: Explains the pilot process while providing a safe no-endpoint copy-template conversion path.
 * Related:
 * - components/public/marketing-ui.tsx
 * - components/public/pilot-request-template-card.tsx
 * - docs/readiness/PHASE_24_REAL_DATA_APPROVAL_GATE_2026-05-30.md
 * - lib/i18n/public-site-copy.ts
 * Author: MoOoH
 * Created: 2026-06-18
 * Last Updated: 2026-07-12
 * Change Log:
 * - 2026-07-12: Added a manual email-draft conversion path and preserved public language links.
 * - 2026-06-18: Made the request UI unmistakably preview-only with non-submitting controls.
 * - 2026-06-19: Moved visible pilot-page copy and metadata into the public-site i18n dictionary.
 * - 2026-06-19: Replaced the inactive request UI with a concise copy-template conversion card.
 * - 2026-06-25: Normalized pilot page rhythm while keeping the non-submitting template flow.
 * - 2026-07-04: Added honest pilot proof metrics without fake claims or data submission.
 * - 2026-07-05: Added BreadcrumbList JSON-LD for the public page-content sweep.
 * - 2026-07-05: Added a route-aware next-step panel for pilot applicants.
 * - 2026-07-05: Tokenized pilot guardrail warning treatment while keeping the non-submitting path.
 * - 2026-07-11: Rebuilt the first fold with the shared research-backed public page hero and copy-template anchor.
 * ============================================================
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";

import { JsonLdScript } from "@/components/public/json-ld";
import {
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
import { PilotRequestTemplateCard } from "@/components/public/pilot-request-template-card";
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

type PilotPageProps = Readonly<{
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
}: PilotPageProps = {}): Promise<Metadata> {
  const language = await readPublicLanguage(searchParams);
  return buildPublicMetadata(
    "/pilot",
    getPublicSiteCopy(language).pilot.meta,
    language,
  );
}

export default async function PilotPage({ searchParams }: PilotPageProps = {}) {
  const language = await readPublicLanguage(searchParams);
  const navCopy = getHomeCopy(language).nav;
  const siteCopy = getPublicSiteCopy(language);
  const copy = siteCopy.pilot;
  const valueSections = [
    { items: copy.getItems, title: copy.getTitle },
    { items: copy.fitItems, title: copy.fitTitle },
    { items: copy.nextSteps, title: copy.nextStepsTitle },
  ] as const;

  return (
    <main
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
        id="bizpilot-pilot-breadcrumb-jsonld"
      />
      <MarketingHeader
        active="pilot"
        copy={navCopy}
        language={language}
        redirectPath="/pilot"
      />
      <section className="bp-section-tight">
        <MarketingShell>
          <MarketingPageHero
            language={language}
            actions={[
              {
                href: "#pilot-request-template",
                label: copy.conversion.primaryAction,
              },
              {
                href: "/pricing",
                label: navCopy.pricing,
                variant: "secondary",
              },
            ]}
            badge={copy.badge}
            body={copy.body}
            signals={copy.proof.metrics.slice(0, 3).map((metric, index) => ({
              icon: index === 0 ? "target" : index === 1 ? "shield" : "lock",
              label: metric.label,
              toneName: index === 2 ? "gold" : "teal",
              value: metric.value,
            }))}
            title={copy.title}
            visual={{
              body: copy.proof.body,
              eyebrow: copy.proof.title,
              footer: copy.proof.guardrail,
              items: copy.nextSteps.map((step, index) => ({
                icon: index === 0 ? "message" : index === 1 ? "pen" : "copy",
                label: `${index + 1}`,
                value: step,
              })),
              title: copy.nextStepsTitle,
            }}
          />

          <div className="mt-8 grid gap-8 min-[1100px]:grid-cols-[minmax(0,0.9fr)_minmax(340px,0.72fr)] min-[1100px]:items-start">
            <div className="grid gap-4">
              {valueSections.map((section) => (
                <MarketingCard className="p-5 sm:p-6" key={section.title}>
                  <h2
                    className="bp-card-title font-black leading-tight"
                    style={{ color: marketingTone.text }}
                  >
                    {section.title}
                  </h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {section.items.map((item) => (
                      <div
                        className="flex min-w-0 items-start gap-3 text-[14px] font-bold leading-6"
                        key={item}
                        style={{ color: marketingTone.soft }}
                      >
                        <span
                          className="mt-0.5 shrink-0"
                          style={{ color: marketingTone.teal }}
                        >
                          <MarketingIcon name="check" />
                        </span>
                        <span className="min-w-0">{item}</span>
                      </div>
                    ))}
                  </div>
                </MarketingCard>
              ))}
            </div>

            <div id="pilot-request-template">
              <MarketingCard className="p-6 sm:p-7">
                <PilotRequestTemplateCard copy={copy.conversion} language={language} />
              </MarketingCard>
            </div>
          </div>

          <MarketingCard className="mt-8 p-5 sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[minmax(220px,0.36fr)_minmax(0,1fr)] lg:items-start">
              <div>
                <h2
                  className="bp-card-title font-black leading-tight"
                  style={{ color: marketingTone.text }}
                >
                  {copy.proof.title}
                </h2>
                <p
                  className="mt-3 text-[15px] font-bold leading-7"
                  style={{ color: marketingTone.soft }}
                >
                  {copy.proof.body}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {copy.proof.metrics.map((metric) => (
                  <div
                    className="min-w-0 rounded-[14px] border px-4 py-3"
                    key={metric.label}
                    style={{
                      backgroundColor: "var(--surface-interactive)",
                      borderColor: marketingTone.border,
                    }}
                  >
                    <p
                      className="text-[12px] font-black uppercase tracking-[0.14em]"
                      style={{ color: marketingTone.teal }}
                    >
                      {metric.label}
                    </p>
                    <h3
                      className="mt-2 text-[15px] font-black leading-6"
                      style={{ color: marketingTone.text }}
                    >
                      {metric.value}
                    </h3>
                    <p
                      className="mt-2 text-[13px] font-bold leading-6"
                      style={{ color: marketingTone.muted }}
                    >
                      {metric.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="mt-5 flex min-w-0 items-start gap-3 rounded-[14px] border px-4 py-3 text-[14px] font-bold leading-6"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "rgba(245,158,11,0.32)",
                color: marketingTone.soft,
              }}
            >
              <span className="mt-0.5 shrink-0" style={{ color: marketingTone.gold }}>
                <MarketingIcon name="warning" />
              </span>
              <span className="min-w-0">{copy.proof.guardrail}</span>
            </div>
          </MarketingCard>
          <MarketingNextStepPanel
            language={language}
            body={copy.proof.title}
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
                toneName: "gold",
              },
              {
                description: siteCopy.trust.badge,
                href: "/trust",
                icon: "shield",
                label: navCopy.trust,
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
