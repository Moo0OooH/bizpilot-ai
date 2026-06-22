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
  const compactServices = copy.families.flatMap((family) =>
    family.services.map((service) => ({
      ...service,
      familyTitle: family.title,
    })),
  );

  return (
    <main className="public-site min-h-svh" style={{ background: marketingBackground, color: marketingTone.text }}>
      <MarketingHeader copy={navCopy} language={language} redirectPath="/industries/cleaning" />
      <section className="py-[var(--section-space-compact)]">
        <MarketingShell>
          <div className="grid gap-8 min-[1040px]:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.75fr)] min-[1040px]:items-start">
            <div>
              <MarketingBadge>{copy.badge}</MarketingBadge>
              <h1 className="bp-copy-hero mt-6 text-[length:var(--text-page)] font-black leading-[1.06]" style={{ color: marketingTone.text }}>
                {copy.title}
              </h1>
              <p className="bp-copy-hero-body mt-6 text-[17px] leading-8" style={{ color: marketingTone.soft }}>
                {copy.body}
              </p>
              <p className="bp-copy-card-body mt-6 text-[16px] leading-8" style={{ color: marketingTone.soft }}>
                {copy.intro}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <MarketingButton href="/pilot">{copy.ctaPrimary}</MarketingButton>
                <MarketingButton href="/demo" variant="secondary">{copy.ctaSecondary}</MarketingButton>
              </div>
            </div>
            <MarketingCard className="p-6">
              <MarketingBadge toneName="blue">{copy.beforeAfter.beforeLabel}</MarketingBadge>
              <p className="mt-4 rounded-[14px] border border-slate-200 bg-slate-50 p-4 text-[15px] font-black leading-7 text-slate-950">
                {copy.beforeAfter.before}
              </p>
              <h2 className="bp-copy-card-title mt-5 text-[22px] font-black leading-tight" style={{ color: marketingTone.text }}>
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

          <div className="mt-8">
            <h2 className="bp-copy-section-title text-[26px] font-black leading-tight" style={{ color: marketingTone.text }}>
              {copy.servicesTitle}
            </h2>
            <div className="cleaning-service-grid mt-5">
              {compactServices.map((service) => (
                <article
                  className="cleaning-service-card rounded-[16px] border border-[var(--border-default)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)]"
                  id={service.id}
                  key={service.id}
                >
                  <p className="bp-copy-meta text-[11px] font-black uppercase tracking-[0.12em]" style={{ color: marketingTone.teal }}>
                    {service.familyTitle}
                  </p>
                  <h3 className="bp-copy-card-title mt-2 text-[18px] font-black leading-tight" style={{ color: marketingTone.text }}>
                    {service.title}
                  </h3>
                  <p className="bp-copy-card-body mt-2 text-[14px] font-bold leading-6" style={{ color: marketingTone.soft }}>
                    {service.body}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <MarketingCard className="mt-8 p-5 sm:p-6">
            <div className="cleaning-detail-desktop cleaning-detail-tabs">
              {copy.families.map((family, index) => (
                <input
                  className="cleaning-tab-input"
                  defaultChecked={index === 0}
                  id={`cleaning-tab-${index}`}
                  key={`cleaning-tab-${family.title}`}
                  name="cleaning-detail-tab"
                  type="radio"
                />
              ))}
              <div aria-label={copy.servicesTitle} className="grid gap-2 md:grid-cols-3" role="tablist">
                {copy.families.map((family, index) => (
                  <label
                    className="cleaning-tab-label bp-copy-button"
                    htmlFor={`cleaning-tab-${index}`}
                    id={`cleaning-tab-label-${index}`}
                    key={family.title}
                    role="tab"
                  >
                    {family.title}
                  </label>
                ))}
              </div>
              <div className="mt-5">
                {copy.families.map((family, index) => (
                  <div
                    aria-labelledby={`cleaning-tab-label-${index}`}
                    className={`cleaning-tab-panel cleaning-panel-${index}`}
                    id={`cleaning-panel-${index}`}
                    key={family.title}
                    role="tabpanel"
                  >
                    <div className="grid gap-5 lg:grid-cols-[minmax(0,0.78fr)_minmax(260px,0.52fr)] lg:items-start">
                      <div>
                        <h3 className="bp-copy-card-title text-[23px] font-black leading-tight" style={{ color: marketingTone.text }}>
                          {family.title}
                        </h3>
                        <p className="bp-copy-card-body mt-3 text-[15px] leading-7" style={{ color: marketingTone.soft }}>
                          {family.body}
                        </p>
                        <div className="mt-4 rounded-[14px] border border-teal-200 bg-teal-50 p-4">
                          <p className="bp-copy-eyebrow text-[12px] font-black uppercase tracking-[0.12em] text-teal-700">
                            {copy.detailHelp.title}
                          </p>
                          <p className="bp-copy-card-body mt-2 text-[14px] font-bold leading-7 text-slate-950">
                            {copy.detailHelp.body}
                          </p>
                        </div>
                      </div>
                      <div className="grid gap-4">
                        <div className="rounded-[14px] border border-slate-200 bg-white p-4">
                          <p className="bp-copy-eyebrow text-[12px] font-black uppercase tracking-[0.12em] text-slate-500">
                            {family.requestLabel}
                          </p>
                          <p className="bp-copy-card-body mt-2 text-[14px] font-black leading-7 text-slate-950">
                            {family.request}
                          </p>
                        </div>
                        <div className="grid gap-2">
                          <p className="bp-copy-eyebrow text-[13px] font-black uppercase tracking-[0.12em]" style={{ color: marketingTone.teal }}>
                            {family.detailsTitle}
                          </p>
                          {family.details.map((detail) => (
                            <div className="bp-copy-card-body flex items-start gap-3 text-[14px] font-bold leading-6" key={detail} style={{ color: marketingTone.soft }}>
                              <span className="mt-0.5 shrink-0" style={{ color: marketingTone.teal }}>
                                <MarketingIcon name="check" />
                              </span>
                              {detail}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="cleaning-detail-mobile">
              {copy.families.map((family, index) => (
                <details
                  className="rounded-[14px] border border-[var(--border-default)] bg-[var(--surface-interactive)] p-4"
                  key={family.title}
                  open={index === 0}
                >
                  <summary className="bp-copy-card-title cursor-pointer list-none text-[17px] font-black leading-tight" style={{ color: marketingTone.text }}>
                    {family.title}
                  </summary>
                  <p className="bp-copy-card-body mt-3 text-[14px] leading-7" style={{ color: marketingTone.soft }}>
                    {family.body}
                  </p>
                  <div className="mt-4 rounded-[12px] border border-teal-200 bg-teal-50 p-3.5">
                    <p className="bp-copy-eyebrow text-[12px] font-black uppercase tracking-[0.12em] text-teal-700">
                      {copy.detailHelp.title}
                    </p>
                    <p className="bp-copy-card-body mt-2 text-[14px] font-bold leading-7 text-slate-950">
                      {copy.detailHelp.body}
                    </p>
                  </div>
                  <div className="mt-4 rounded-[12px] border border-slate-200 bg-white p-3.5">
                    <p className="bp-copy-eyebrow text-[12px] font-black uppercase tracking-[0.12em] text-slate-500">
                      {family.requestLabel}
                    </p>
                    <p className="bp-copy-card-body mt-2 text-[14px] font-black leading-7 text-slate-950">
                      {family.request}
                    </p>
                  </div>
                  <div className="mt-4 grid gap-2">
                    <p className="bp-copy-eyebrow text-[13px] font-black uppercase tracking-[0.12em]" style={{ color: marketingTone.teal }}>
                      {family.detailsTitle}
                    </p>
                    {family.details.map((detail) => (
                      <div className="bp-copy-card-body flex items-start gap-3 text-[14px] font-bold leading-6" key={detail} style={{ color: marketingTone.soft }}>
                        <span className="mt-0.5 shrink-0" style={{ color: marketingTone.teal }}>
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

          <MarketingCard className="mt-8 p-6 sm:p-7">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,0.86fr)_minmax(300px,0.72fr)] lg:items-start">
              <div>
                <h2 className="bp-copy-section-title text-[24px] font-black" style={{ color: marketingTone.text }}>{copy.example.title}</h2>
                <p className="bp-copy-card-body mt-3 text-[15px] leading-7" style={{ color: marketingTone.soft }}>
                  {copy.example.workflow}
                </p>
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
                <MarketingButton href="/pilot">{copy.ctaPrimary} <MarketingIcon name="arrow" /></MarketingButton>
              </div>
            </div>
          </MarketingCard>
        </MarketingShell>
      </section>
      <MarketingFooter copy={navCopy} />
    </main>
  );
}
