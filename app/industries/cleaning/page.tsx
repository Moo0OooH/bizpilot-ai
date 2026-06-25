/**
 * ============================================================
 * File: app/industries/cleaning/page.tsx
 * Project: BizPilot AI
 * Description: Public cleaning-industry page for lead recovery positioning.
 * Role: Shows cleaning-specific services, workflow, and quote-request proof.
 * Related:
 * - components/public/marketing-ui.tsx
 * - app/demo/page.tsx
 * - lib/i18n/public-site-copy.ts
 * Author: MoOoH
 * Created: 2026-06-18
 * Last Updated: 2026-06-21
 * Change Log:
 * - 2026-06-18: Added quote example, organized lead details, and top/end pilot CTAs.
 * - 2026-06-19: Moved visible cleaning-page copy and metadata into the public-site i18n dictionary.
 * - 2026-06-19: Rebuilt cleaning page around three service-family panels with stable service anchors.
 * - 2026-06-20: Tightened service-family card spacing while preserving all cleaning anchors.
 * - 2026-06-21: Replaced oversized service-family cards with compact services and shared details.
 * - 2026-06-21: Removed repeated service cards from detail panels and simplified the six-service Cleaning page.
 * - 2026-06-25: Rebuilt the page around six compact services, one shared detail selector, and a shorter workflow.
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
  const copy = getPublicSiteCopy(language).cleaning;
  const services = copy.serviceCards;
  const workflowSteps = copy.example.workflow.split(" -> ");

  return (
    <main className="bp-page public-site min-h-svh" style={{ background: marketingBackground, color: marketingTone.text }}>
      <MarketingHeader copy={navCopy} language={language} redirectPath="/industries/cleaning" />
      <section className="bp-section-hero cleaning-page-section">
        <MarketingShell>
          <div className="bp-hero-grid cleaning-hero-grid grid min-w-0 items-center gap-6 min-[1100px]:grid-cols-[minmax(0,0.96fr)_minmax(19rem,0.48fr)]">
            <div className="min-w-0">
              <MarketingBadge>{copy.badge}</MarketingBadge>
              <h1 className="bp-page-title bp-copy-hero mt-5 font-black leading-[1.06]" style={{ color: marketingTone.text }}>
                {copy.title}
              </h1>
              <p className="bp-body bp-copy-hero-body mt-5 max-w-[46rem] leading-8" style={{ color: marketingTone.soft }}>
                {copy.body}
              </p>
              <p className="bp-copy-card-body mt-4 max-w-[46rem] text-[15px] leading-7" style={{ color: marketingTone.soft }}>
                {copy.intro}
              </p>
              <div className="bp-button-row mt-6 flex flex-col gap-3 sm:flex-row">
                <MarketingButton href="/pilot">{copy.ctaPrimary}</MarketingButton>
                <MarketingButton href="/demo" variant="secondary">{copy.ctaSecondary}</MarketingButton>
              </div>
            </div>

            <MarketingCard className="cleaning-before-after-card p-5 sm:p-6">
              <MarketingBadge toneName="blue">{copy.beforeAfter.beforeLabel}</MarketingBadge>
              <p className="mt-4 rounded-[14px] border border-slate-200 bg-slate-50 p-4 text-[15px] font-black leading-7 text-slate-950">
                {copy.beforeAfter.before}
              </p>
              <h2 className="bp-card-title bp-copy-card-title mt-5 font-black leading-tight" style={{ color: marketingTone.text }}>
                {copy.beforeAfter.title}
              </h2>
              <p className="bp-copy-card-body mt-3 text-[14px] leading-7" style={{ color: marketingTone.soft }}>
                {copy.beforeAfter.body}
              </p>
              <div className="mt-5 rounded-[14px] border border-teal-200 bg-teal-50 p-4">
                <p className="text-[12px] font-black uppercase tracking-[0.12em] text-teal-700">
                  {copy.beforeAfter.afterLabel}
                </p>
                <p className="mt-2 text-[14px] font-bold leading-7 text-slate-950">
                  {copy.beforeAfter.after}
                </p>
              </div>
            </MarketingCard>
          </div>

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
              <div className="max-w-[52rem]">
                <h2 className="bp-section-title bp-copy-section-title font-black leading-tight" style={{ color: marketingTone.text }}>
                  {copy.detailSection.title}
                </h2>
                <p className="bp-copy-card-body mt-3 text-[15px] leading-7" style={{ color: marketingTone.soft }}>
                  {copy.detailSection.body}
                </p>
                <p className="bp-copy-card-body mt-3 text-[14px] font-bold leading-7" style={{ color: marketingTone.soft }}>
                  {copy.detailHelp.body}
                </p>
              </div>

            <div className="cleaning-detail-desktop cleaning-detail-tabs">
              <div aria-label={copy.detailSection.title} className="cleaning-tab-list" role="tablist">
                {services.map((service, index) => (
                  <div
                    className="cleaning-tab-item"
                    key={service.id}
                  >
                    <input
                      className="cleaning-tab-input"
                      defaultChecked={index === 0}
                      id={`cleaning-tab-${service.id}`}
                      name="cleaning-detail-tab"
                      type="radio"
                    />
                    <label
                      aria-controls={`cleaning-panel-${service.id}`}
                      className="cleaning-tab-label bp-copy-button"
                      htmlFor={`cleaning-tab-${service.id}`}
                      id={`cleaning-tab-label-${service.id}`}
                      role="tab"
                    >
                      {service.title}
                    </label>
                    <div
                      aria-labelledby={`cleaning-tab-label-${service.id}`}
                      className="cleaning-tab-panel"
                      id={`cleaning-panel-${service.id}`}
                      role="tabpanel"
                    >
                      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.76fr)_minmax(260px,0.54fr)] lg:items-start">
                        <div>
                          <h3 className="bp-card-title bp-copy-card-title font-black leading-tight" style={{ color: marketingTone.text }}>
                            {service.title}
                          </h3>
                          <p className="bp-copy-card-body mt-3 text-[15px] leading-7" style={{ color: marketingTone.soft }}>
                            {service.body}
                          </p>
                          <div className="mt-4 rounded-[14px] border border-slate-200 bg-white p-4">
                            <p className="bp-copy-eyebrow text-[12px] font-black uppercase tracking-[0.12em] text-slate-500">
                              {copy.example.requestLabel}
                            </p>
                            <p className="bp-copy-card-body mt-2 text-[14px] font-black leading-7 text-slate-950">
                              {service.request}
                            </p>
                          </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                          <div className="grid gap-2 rounded-[14px] border p-4" style={{ backgroundColor: "var(--surface-interactive)", borderColor: marketingTone.border }}>
                            <p className="bp-copy-eyebrow text-[12px] font-black uppercase tracking-[0.12em]" style={{ color: marketingTone.teal }}>
                              {copy.detailSection.clearTitle}
                            </p>
                            {service.clearDetails.map((detail) => (
                              <div className="bp-copy-card-body flex items-start gap-3 text-[14px] font-bold leading-6" key={detail} style={{ color: marketingTone.soft }}>
                                <span className="mt-0.5 shrink-0" style={{ color: marketingTone.teal }}>
                                  <MarketingIcon name="check" />
                                </span>
                                {detail}
                              </div>
                            ))}
                          </div>
                          <div className="grid gap-2 rounded-[14px] border border-teal-200 bg-teal-50 p-4">
                            <p className="bp-copy-eyebrow text-[12px] font-black uppercase tracking-[0.12em] text-teal-700">
                              {copy.detailHelp.title}
                            </p>
                            {service.missingDetails.map((detail) => (
                              <div className="bp-copy-card-body flex items-start gap-3 text-[14px] font-bold leading-6 text-slate-950" key={detail}>
                                <span className="mt-0.5 shrink-0 text-teal-700">
                                  <MarketingIcon name="check" />
                                </span>
                                {detail}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="cleaning-detail-mobile">
              {services.map((service, index) => (
                <details
                  className="rounded-[14px] border border-[var(--border-default)] bg-[var(--surface-interactive)] p-4"
                  id={`cleaning-mobile-detail-${service.id}`}
                  key={service.id}
                  open={index === 0}
                >
                  <summary className="bp-copy-card-title cursor-pointer list-none text-[17px] font-black leading-tight" style={{ color: marketingTone.text }}>
                    {service.title}
                  </summary>
                  <p className="bp-copy-card-body mt-3 text-[14px] leading-7" style={{ color: marketingTone.soft }}>
                    {service.body}
                  </p>
                  <div className="mt-4 rounded-[12px] border border-slate-200 bg-white p-3.5">
                    <p className="bp-copy-eyebrow text-[12px] font-black uppercase tracking-[0.12em] text-slate-500">
                      {copy.example.requestLabel}
                    </p>
                    <p className="bp-copy-card-body mt-2 text-[14px] font-black leading-7 text-slate-950">
                      {service.request}
                    </p>
                  </div>
                  <div className="mt-4 grid gap-2 rounded-[12px] border border-[var(--border-default)] bg-[var(--surface)] p-3.5">
                    <p className="bp-copy-eyebrow text-[13px] font-black uppercase tracking-[0.12em]" style={{ color: marketingTone.teal }}>
                      {copy.detailSection.clearTitle}
                    </p>
                    {service.clearDetails.map((detail) => (
                      <div className="bp-copy-card-body flex items-start gap-3 text-[14px] font-bold leading-6" key={detail} style={{ color: marketingTone.soft }}>
                        <span className="mt-0.5 shrink-0" style={{ color: marketingTone.teal }}>
                          <MarketingIcon name="check" />
                        </span>
                        {detail}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 grid gap-2 rounded-[12px] border border-teal-200 bg-teal-50 p-3.5">
                    <p className="bp-copy-eyebrow text-[13px] font-black uppercase tracking-[0.12em] text-teal-700">
                      {copy.detailHelp.title}
                    </p>
                    {service.missingDetails.map((detail) => (
                      <div className="bp-copy-card-body flex items-start gap-3 text-[14px] font-bold leading-6 text-slate-950" key={detail}>
                        <span className="mt-0.5 shrink-0 text-teal-700">
                          <MarketingIcon name="check" />
                        </span>
                        {detail}
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
            </MarketingCard>
          </div>

          <MarketingCard className="mt-8 p-5 sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,0.86fr)_minmax(300px,0.72fr)] lg:items-start">
              <div>
                <h2 className="bp-section-title bp-copy-section-title font-black" style={{ color: marketingTone.text }}>{copy.example.title}</h2>
                <ol className="mt-4 grid gap-2">
                  {workflowSteps.map((step, index) => (
                    <li className="bp-copy-card-body flex items-start gap-3 text-[14px] font-bold leading-6" key={step} style={{ color: marketingTone.soft }}>
                      <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-black" style={{ backgroundColor: "var(--surface-accent)", color: marketingTone.teal }}>
                        {index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
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
                <MarketingButton href="/pilot">{copy.ctaPrimary} <MarketingIcon name="arrow" /></MarketingButton>
                <MarketingButton href="/demo" variant="secondary">{copy.ctaSecondary}</MarketingButton>
              </div>
            </div>
          </MarketingCard>
        </MarketingShell>
      </section>
      <MarketingFooter copy={navCopy} />
    </main>
  );
}
