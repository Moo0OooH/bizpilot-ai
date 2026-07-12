/**
 * ============================================================
 * File: app/industries/cleaning/page.tsx
 * Project: BizPilot AI
 * Description: Public cleaning-industry page for lead recovery positioning.
 * Role: Shows cleaning-specific services, workflow, and quote-request proof.
 * Related:
 * - components/public/marketing-ui.tsx
 * - components/public/cleaning-service-details.tsx
 * - app/demo/page.tsx
 * - lib/i18n/public-site-copy.ts
 * Author: MoOoH
 * Created: 2026-06-18
 * Last Updated: 2026-07-12
 * Change Log:
 * - 2026-07-12: Preserved the active public language through shared conversion links.
 * - 2026-06-18: Added quote example, organized lead details, and top/end pilot CTAs.
 * - 2026-06-19: Moved visible cleaning-page copy and metadata into the public-site i18n dictionary.
 * - 2026-06-19: Rebuilt cleaning page around three service-family panels with stable service anchors.
 * - 2026-06-20: Tightened service-family card spacing while preserving all cleaning anchors.
 * - 2026-06-21: Replaced oversized service-family cards with compact services and shared details.
 * - 2026-06-21: Removed repeated service cards from detail panels and simplified the six-service Cleaning page.
 * - 2026-06-25: Rebuilt the page around six compact services, one shared detail selector, and a shorter workflow.
 * - 2026-06-25: Replaced duplicated desktop/mobile detail blocks with one active service detail panel.
 * - 2026-06-27: Collapsed secondary service detail/workflow panels to reduce mobile scroll.
 * - 2026-07-05: Added BreadcrumbList JSON-LD for the public page-content sweep.
 * - 2026-07-05: Added a route-aware next-step panel for cleaning-owner education.
 * - 2026-07-05: Tokenized cleaning proof cards for launch-ready light/dark consistency.
 * - 2026-07-11: Rebuilt the first fold with the shared research-backed public page hero.
 * ============================================================
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";

import { JsonLdScript } from "@/components/public/json-ld";
import { CleaningServiceDetails } from "@/components/public/cleaning-service-details";
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
import { buildBreadcrumbJsonLd } from "@/lib/public-structured-data";
import {
  buildPublicMetadata,
  resolvePublicRouteLanguage,
  type PublicRouteSearchParams,
} from "@/lib/seo";

type CleaningPageProps = Readonly<{
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
}: CleaningPageProps = {}): Promise<Metadata> {
  const language = await readPublicLanguage(searchParams);
  return buildPublicMetadata(
    "/industries/cleaning",
    getPublicSiteCopy(language).cleaning.meta,
    language,
  );
}

export default async function CleaningPage({
  searchParams,
}: CleaningPageProps = {}) {
  const language = await readPublicLanguage(searchParams);
  const navCopy = getHomeCopy(language).nav;
  const siteCopy = getPublicSiteCopy(language);
  const copy = siteCopy.cleaning;
  const services = copy.serviceCards;
  const workflowSteps = copy.example.workflow.split(" -> ");

  return (
    <main className="bp-page public-site min-h-svh" style={{ background: marketingBackground, color: marketingTone.text }}>
      <JsonLdScript
        data={buildBreadcrumbJsonLd(
          [
            { name: "BizPilot AI", path: "/" },
            { name: copy.title, path: "/industries/cleaning" },
          ],
          language,
        )}
        id="bizpilot-cleaning-breadcrumb-jsonld"
      />
      <MarketingHeader copy={navCopy} language={language} redirectPath="/industries/cleaning" />
      <section className="bp-section-hero cleaning-page-section">
        <MarketingShell>
          <MarketingPageHero
            language={language}
            actions={[
              {
                href: "/pilot",
                label: copy.ctaPrimary,
              },
              {
                href: "/demo",
                label: copy.ctaSecondary,
                variant: "secondary",
              },
            ]}
            badge={copy.badge}
            body={
              <>
                {copy.body}
                <span className="mt-4 block text-[15px] font-bold leading-7">
                  {copy.intro}
                </span>
              </>
            }
            className="cleaning-hero-grid"
            signals={services.slice(0, 3).map((service, index) => ({
              icon: index === 0 ? "briefcase" : index === 1 ? "spark" : "target",
              label: copy.servicesTitle,
              value: service.title,
            }))}
            title={copy.title}
            visual={{
              body: copy.beforeAfter.body,
              eyebrow: copy.beforeAfter.beforeLabel,
              items: [
                {
                  icon: "message",
                  label: copy.beforeAfter.beforeLabel,
                  toneName: "blue",
                  value: copy.beforeAfter.before,
                },
                {
                  icon: "pen",
                  label: copy.beforeAfter.afterLabel,
                  value: copy.beforeAfter.after,
                },
              ],
              title: copy.beforeAfter.title,
            }}
          />

          <section aria-labelledby="cleaning-services-heading" className="mt-10">
            <h2 id="cleaning-services-heading" className="bp-section-title bp-copy-section-title font-black leading-tight" style={{ color: marketingTone.text }}>
              {copy.servicesTitle}
            </h2>
            <div className="bp-grid-six cleaning-service-grid mt-5">
              {services.map((service) => (
                <article
                  className="cleaning-service-card rounded-[16px] border border-[var(--border-default)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)]"
                  id={service.id}
                  key={service.id}
                >
                  <h3 className="bp-card-title bp-copy-card-title text-[18px] font-black leading-tight" style={{ color: marketingTone.text }}>
                    {service.title}
                  </h3>
                  <p className="bp-copy-card-body mt-2 text-[14px] font-bold leading-6" style={{ color: marketingTone.soft }}>
                    {service.body}
                  </p>
                  <a
                    className="bp-copy-button mt-4 inline-flex min-h-9 items-center justify-center rounded-[10px] border px-3 text-[12px] font-black transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
                    href="#cleaning-details"
                    style={{
                      backgroundColor: "var(--surface-elevated)",
                      borderColor: marketingTone.border,
                      color: marketingTone.text,
                    }}
                  >
                    {copy.serviceActionLabel}
                  </a>
                </article>
              ))}
            </div>
          </section>

          <div id="cleaning-details">
            <MarketingCard className="mt-8 p-5 sm:p-6">
              <details>
                <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <div className="max-w-[52rem]">
                    <h2 className="bp-section-title bp-copy-section-title font-black leading-tight" style={{ color: marketingTone.text }}>
                      {copy.detailSection.title}
                    </h2>
                    <p className="bp-copy-card-body mt-3 text-[15px] leading-7" style={{ color: marketingTone.soft }}>
                      {copy.detailSection.body}
                    </p>
                  </div>
                </summary>
                <p className="bp-copy-card-body mt-4 text-[14px] font-bold leading-7" style={{ color: marketingTone.soft }}>
                  {copy.detailHelp.body}
                </p>
                <CleaningServiceDetails
                  clearTitle={copy.detailSection.clearTitle}
                  helpTitle={copy.detailHelp.title}
                  requestLabel={copy.example.requestLabel}
                  selectorLabel={copy.detailSection.title}
                  services={services}
                />
              </details>
            </MarketingCard>
          </div>

          <MarketingCard className="mt-8 p-5 sm:p-6">
            <details>
              <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <h2 className="bp-section-title bp-copy-section-title font-black" style={{ color: marketingTone.text }}>{copy.example.title}</h2>
              </summary>
              <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,0.86fr)_minmax(300px,0.72fr)] lg:items-start">
                <div>
                  <ul className="grid gap-2">
                    {workflowSteps.map((step, index) => (
                      <li className="bp-copy-card-body flex items-start gap-3 text-[14px] font-bold leading-6" key={step} style={{ color: marketingTone.soft }}>
                        <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-black" style={{ backgroundColor: "var(--surface-accent)", color: marketingTone.teal }}>
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 rounded-[14px] border p-4" style={{ backgroundColor: "var(--surface-interactive)", borderColor: marketingTone.border }}>
                    <p className="bp-copy-eyebrow text-[12px] font-black uppercase tracking-[0.12em]" style={{ color: marketingTone.muted }}>{copy.example.requestLabel}</p>
                    <p className="bp-copy-card-body mt-2 text-[15px] font-black leading-7" style={{ color: marketingTone.text }}>
                      {copy.example.request}
                    </p>
                  </div>
                </div>
                <div className="grid gap-3">
                  {copy.example.fields.map(([label, value]) => (
                    <div className="grid min-w-0 gap-1 rounded-[12px] border px-3 py-2 sm:grid-cols-[88px_minmax(0,1fr)]" key={label} style={{ backgroundColor: "var(--surface-interactive)", borderColor: marketingTone.border }}>
                      <span className="text-[12px] font-black uppercase tracking-[0.08em]" style={{ color: marketingTone.muted }}>{label}</span>
                      <span className="min-w-0 text-[14px] font-black" style={{ color: marketingTone.text }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </details>
          </MarketingCard>

          <MarketingCard className="mt-8 p-6 sm:p-7">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <h2 className="bp-section-title bp-copy-section-title font-black" style={{ color: marketingTone.text }}>
                  {copy.finalCta.title}
                </h2>
                <p className="bp-copy-card-body mt-3 max-w-[48rem] text-[15px] leading-7" style={{ color: marketingTone.soft }}>
                  {copy.finalCta.body}
                </p>
              </div>
              <div className="bp-button-row flex flex-col gap-3 sm:flex-row lg:flex-col">
                <MarketingButton href="/pilot" language={language}>{copy.ctaPrimary} <MarketingIcon name="arrow" /></MarketingButton>
                <MarketingButton href="/demo" language={language} variant="secondary">{copy.ctaSecondary}</MarketingButton>
              </div>
            </div>
          </MarketingCard>
          <MarketingNextStepPanel
            language={language}
            body={copy.detailHelp.title}
            className="mt-8"
            items={[
              {
                description: siteCopy.quoteLinkGuide.badge,
                href: "/quote-link-guide",
                icon: "link",
                label: navCopy.guide,
              },
              {
                description: siteCopy.replySpeedGuide.badge,
                href: "/faster-quote-replies",
                icon: "clock",
                label: siteCopy.replySpeedGuide.badge,
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
            title={navCopy.flow}
          />
        </MarketingShell>
      </section>
      <MarketingFooter copy={navCopy} language={language} />
    </main>
  );
}
