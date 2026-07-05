/**
 * ============================================================
 * File: app/page.tsx
 * Project: BizPilot AI
 * Description: Public homepage for cleaning-first lead recovery.
 * Role: Converts cleaning business owners into founder pilot applicants with localized public copy.
 * Related:
 * - components/public/marketing-ui.tsx
 * - lib/i18n/home-copy.ts
 * - lib/i18n/public-site-copy.ts
 * Author: MoOoH
 * Created: 2026-05-02
 * Last Updated: 2026-07-05
 * Change Log:
 * - 2026-06-18: Applied responsive hero, section density, and no-inner-scroll demo hardening.
 * - 2026-06-19: Mapped the hero product preview to semantic theme surfaces for dark contrast.
 * - 2026-06-19: Moved visible homepage copy and metadata into the public-site i18n dictionary.
 * - 2026-06-19: Finalized balanced homepage rhythm, four-step demo, and locked cleaning-use-case links.
 * - 2026-06-20: Stabilized bilingual hero scale and first-fold CTA placement.
 * - 2026-06-20: Removed forced card heights from demo and cleaning-use-case grids.
 * - 2026-06-21: Removed duplicate visible numbering from the homepage product preview.
 * - 2026-06-21: Moved the workflow strip onto canonical responsive grid classes.
 * - 2026-06-21: Removed the repeated five-card workflow section so the product demo carries the workflow story once.
 * - 2026-06-21: Attached localization-aware copy roles to homepage headings, cards, and badges.
 * - 2026-06-21: Tightened first-fold hero rhythm so the preview card stays visible on desktop.
 * - 2026-06-21: Shortened the homepage FAQ and linked to the dedicated full FAQ route.
 * - 2026-06-21: Removed the homepage roadmap band so the page stays focused on quote recovery proof.
 * - 2026-06-25: Rebalanced homepage hero, CTA grouping, mockup density, and Problem section rhythm.
 * - 2026-06-25: Tightened hero copy rhythm, mockup density, and Problem-section handoff.
 * - 2026-06-26: Replaced the four-card workflow preview with one compact owner-review panel.
 * - 2026-06-26: Upgraded the hero mockup into a premium signal-flow board.
 * - 2026-07-04: Added public JSON-LD for WebSite, Organization, SoftwareApplication, and Service.
 * - 2026-07-05: Rebuilt the homepage hero as a full-stage product scene with overlay copy.
 * - 2026-07-05: Added a route-aware next-step panel below the founder-pilot CTA.
 * - 2026-07-05: Refocused the hero and second section around a hot-lead risk-to-remedy story.
 * ============================================================
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

import { JsonLdScript } from "@/components/public/json-ld";
import {
  MarketingBadge,
  MarketingButton,
  MarketingCard,
  MarketingFooter,
  MarketingHeader,
  MarketingIcon,
  MarketingNextStepPanel,
  MarketingShell,
  marketingBackground,
  marketingTone,
} from "@/components/public/marketing-ui";
import { getHomeCopy } from "@/lib/i18n/home-copy";
import {
  INTERFACE_LANGUAGE_COOKIE,
} from "@/lib/i18n/language";
import {
  getPublicSiteCopy,
  type PublicSiteCopy,
} from "@/lib/i18n/public-site-copy";
import { buildHomeJsonLd } from "@/lib/public-structured-data";
import {
  buildPublicMetadata,
  resolvePublicRouteLanguage,
  type PublicRouteSearchParams,
} from "@/lib/seo";

type HomeCopy = PublicSiteCopy["home"];

type HomePageProps = Readonly<{
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
}: HomePageProps = {}): Promise<Metadata> {
  const language = await readPublicLanguage(searchParams);
  return buildPublicMetadata("/", getPublicSiteCopy(language).home.meta, language);
}

function SectionTitle({
  body,
  eyebrow,
  title,
}: Readonly<{ body?: string; eyebrow?: string; title: string }>) {
  return (
    <div className="mx-auto max-w-[780px] text-center">
      {eyebrow ? (
        <p
          className="bp-copy-eyebrow text-[12px] font-black uppercase tracking-[0.16em]"
          style={{ color: marketingTone.teal }}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className="bp-copy-section-title homepage-section-heading mt-3 font-black"
        style={{ color: marketingTone.text }}
      >
        {title}
      </h2>
      {body ? (
        <p
          className="bp-copy-card-body mt-4 text-[16px] leading-8"
          style={{ color: marketingTone.soft }}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}

function sourceChannelKey(source: string) {
  const normalized = source.toLowerCase();

  if (normalized.includes("text") || normalized.includes("texto")) {
    return "text";
  }

  if (normalized.includes("phone") || normalized.includes("call") || normalized.includes("appel")) {
    return "phone";
  }

  if (normalized.includes("google")) {
    return "google";
  }

  if (normalized.includes("facebook")) {
    return "facebook";
  }

  if (normalized.includes("instagram")) {
    return "instagram";
  }

  if (normalized.includes("site") || normalized.includes("web")) {
    return "website";
  }

  return "message";
}

function SourceChannelMark({ source }: Readonly<{ source: string }>) {
  const channel = sourceChannelKey(source);

  if (channel === "google") {
    return (
      <span aria-hidden className="homepage-source-mark homepage-source-mark--google">
        <svg className="homepage-source-brand" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8.25" />
          <path d="M12 12h7.2" />
          <path d="M18.1 15.6A7.4 7.4 0 0 1 12 19.4a7.4 7.4 0 1 1 5.2-12.7" />
        </svg>
      </span>
    );
  }

  if (channel === "facebook") {
    return (
      <span aria-hidden className="homepage-source-mark homepage-source-mark--facebook">
        <svg className="homepage-source-brand homepage-source-brand--facebook" fill="none" viewBox="0 0 24 24">
          <path d="M14.4 8.2h2.15V4.7h-2.9c-3.25 0-4.72 1.94-4.72 4.54v2.06H6.6v3.82h2.33v4.18h4.16v-4.18h2.78l0.47-3.82h-3.25V9.68c0-.96.34-1.48 1.31-1.48Z" />
        </svg>
      </span>
    );
  }

  if (channel === "instagram") {
    return (
      <span aria-hidden className="homepage-source-mark homepage-source-mark--instagram">
        <svg className="homepage-source-brand" fill="none" viewBox="0 0 24 24">
          <rect height="15" rx="4.25" width="15" x="4.5" y="4.5" />
          <circle cx="12" cy="12" r="3.2" />
          <circle cx="16.5" cy="7.5" r="0.8" />
        </svg>
      </span>
    );
  }

  if (channel === "text") {
    return (
      <span aria-hidden className="homepage-source-mark homepage-source-mark--text">
        <svg className="homepage-source-brand" fill="none" viewBox="0 0 24 24">
          <path d="M5.2 6.5h13.6v8.2H10l-4.8 3.8z" />
          <path d="M8.4 9.3h7.2M8.4 12h5.3" />
        </svg>
      </span>
    );
  }

  if (channel === "phone") {
    return (
      <span aria-hidden className="homepage-source-mark homepage-source-mark--phone">
        <MarketingIcon name="phone" />
      </span>
    );
  }

  return (
    <span aria-hidden className="homepage-source-mark homepage-source-mark--website">
      <MarketingIcon name="globe" />
    </span>
  );
}

function MiniProductMockup({ copy }: Readonly<{ copy: HomeCopy["mockup"] }>) {
  const activeLead = copy.leads[0];
  const missingDetails = copy.bizPilotActions.slice(0, 4);
  const visibleSources = copy.sources.slice(0, 3);

  return (
    <div
      aria-label={copy.boardLabel}
      className="homepage-hero-mockup homepage-product-scene"
    >
      <div className="homepage-product-window homepage-rescue-board">
        <div className="homepage-product-topbar">
          <span className="homepage-product-brand">BizPilot AI</span>
          <span className="homepage-product-safety homepage-wait-pill">
            <MarketingIcon name="clock" />
            {copy.chaosSubtitle}
          </span>
        </div>

        <div className="homepage-risk-heading">
          <span className="homepage-risk-icon" aria-hidden>
            <MarketingIcon name="warning" />
          </span>
          <div className="min-w-0">
            <p className="homepage-panel-heading-text">{copy.chaosTitle}</p>
            <p className="homepage-panel-subtitle">{copy.chaosHint}</p>
          </div>
          <span className="homepage-product-safety">
            <MarketingIcon name="shield" />
            {copy.boardSafety}
          </span>
        </div>

        <article className="homepage-lead-card" aria-label={activeLead?.title ?? copy.chaosTitle}>
          <span className="homepage-lead-avatar" aria-hidden>
            MA
          </span>
          <div className="min-w-0">
            <div className="homepage-lead-title-row">
              <p>{activeLead?.title}</p>
              <span>{copy.messages[0]}</span>
            </div>
            <p className="homepage-lead-meta">{activeLead?.body}</p>
            <div className="homepage-channel-strip" aria-label={copy.chaosHint}>
              {visibleSources.map((source) => (
                <span className="homepage-channel-pill" key={source}>
                  <SourceChannelMark source={source} />
                </span>
              ))}
              <span className="homepage-source-summary">{copy.messages[1]}</span>
            </div>
            <p className="homepage-risk-alert">
              <MarketingIcon name="warning" />
              {copy.chaosBadge}
            </p>
          </div>
        </article>

        <div className="homepage-remedy-grid">
          <section className="homepage-missing-card" aria-label={copy.bizPilotTitle}>
            <p className="homepage-clarity-badge">{copy.bizPilotTitle}</p>
            <p className="homepage-draft-title">{copy.bizPilotBody}</p>
            <div className="homepage-missing-list">
              {missingDetails.map((detail) => (
                <p key={detail}>
                  <MarketingIcon name="search" />
                  {detail}
                </p>
              ))}
            </div>
          </section>

          <div className="homepage-cleaning-visual" aria-hidden="true">
            <span className="homepage-bottle homepage-bottle--spray" />
            <span className="homepage-bottle homepage-bottle--soap" />
            <span className="homepage-towel" />
            <span className="homepage-brush" />
          </div>
        </div>

        <section className="homepage-owner-draft" aria-label={copy.clarityTitle}>
          <div className="homepage-draft-icon" aria-hidden>
            <MarketingIcon name="message" />
          </div>
          <div className="min-w-0">
            <p className="homepage-clarity-badge">{copy.clarityBadge}</p>
            <p className="homepage-draft-title">{copy.draftTitle}</p>
            <p className="homepage-draft-body">{copy.draftBody}</p>
          </div>
          <span className="homepage-draft-action">
            <MarketingIcon name="copy" />
            {copy.copyButton}
          </span>
        </section>
      </div>
    </div>
  );
}

function HeroSection({ copy }: Readonly<{ copy: HomeCopy }>) {
  return (
    <section className="bp-section-hero homepage-hero-section">
      <MarketingShell className="homepage-hero-shell">
        <div className="homepage-hero-stage">
          <div className="homepage-hero-copy min-w-0">
            <MarketingBadge>{copy.hero.badge}</MarketingBadge>
            <h1
              className="bp-copy-hero homepage-hero-title mt-4 font-black"
              style={{ color: marketingTone.text }}
            >
              {copy.hero.title}
            </h1>
            <p
              className="bp-copy-hero-body homepage-hero-body mt-4 text-[16px] leading-7 sm:text-[17px]"
              style={{ color: marketingTone.soft }}
            >
              {copy.hero.body}
            </p>
            <ul
              aria-label={copy.hero.proofLabel}
              className="homepage-hero-proof-rail mt-5 grid min-w-0 gap-2"
            >
              {copy.hero.signals.map((item) => (
                <li className="homepage-hero-proof-item min-w-0" key={item.label}>
                  <span className="homepage-hero-proof-label">{item.label}</span>
                  <span className="homepage-hero-proof-value">{item.value}</span>
                </li>
              ))}
            </ul>
            <ul className="homepage-hero-bullets mt-5 flex flex-wrap gap-2">
              {copy.hero.bullets.map((item) => (
                <li
                  className="homepage-hero-bullet flex min-w-0 items-start gap-2 text-[13px] font-black leading-5"
                  key={item}
                  style={{ color: marketingTone.text }}
                >
                  <span className="mt-0.5 shrink-0" style={{ color: marketingTone.teal }}>
                    <MarketingIcon name="check" />
                  </span>
                  <span className="min-w-0">{item}</span>
                </li>
              ))}
            </ul>
            <div className="bp-button-row homepage-hero-actions mt-5 flex flex-col gap-3 min-[390px]:flex-row">
              <MarketingButton href="/pilot">{copy.hero.primaryCta}</MarketingButton>
              <MarketingButton href="/demo" variant="secondary">
                {copy.hero.secondaryCta}
              </MarketingButton>
            </div>
            <p className="bp-copy-meta homepage-hero-note mt-4 inline-flex min-w-0 items-center gap-2 text-[12px] font-black leading-5" style={{ color: marketingTone.teal }}>
              <MarketingIcon name="shield" />
              {copy.hero.note}
            </p>
          </div>
          <MiniProductMockup copy={copy.mockup} />
        </div>
      </MarketingShell>
    </section>
  );
}

function CardGrid({
  items,
}: Readonly<{ items: ReadonlyArray<Readonly<{ body: string; title: string }>> }>) {
  return (
    <div className="public-card-grid mt-8">
      {items.map((item) => (
        <MarketingCard className="bp-card-structured p-5" key={item.title}>
          <h3 className="bp-copy-card-title text-[18px] font-black" style={{ color: marketingTone.text }}>
            {item.title}
          </h3>
          <p className="bp-copy-card-body mt-3 text-[14px] leading-7" style={{ color: marketingTone.soft }}>
            {item.body}
          </p>
        </MarketingCard>
      ))}
    </div>
  );
}

function ProductPreview({ copy }: Readonly<{ copy: HomeCopy["preview"] }>) {
  return (
    <section className="homepage-snapshot-section py-[var(--section-space-compact)]" id="demo">
      <MarketingShell>
        <SectionTitle body={copy.body} title={copy.title} />
        <MarketingCard className="homepage-demo-grid homepage-recovery-snapshot mt-7 p-4 sm:p-5 lg:p-6">
          <div className="homepage-snapshot-steps">
              {copy.steps.map((step, index) => (
                <div
                  className="homepage-snapshot-step"
                  key={step}
                >
                  <span aria-hidden>
                    {index + 1}
                  </span>
                  <p>{step}</p>
                </div>
              ))}
          </div>

          <div className="homepage-snapshot-grid">
            <article className="homepage-snapshot-risk">
                <p
                  className="bp-copy-eyebrow text-[11px] font-black uppercase tracking-[0.14em]"
                  style={{ color: marketingTone.gold }}
                >
                  {copy.request.title}
                </p>
                <p
                  className="mt-3 text-[20px] font-black leading-7 sm:text-[24px]"
                  style={{ color: "var(--text-strong)" }}
                >
                  {copy.request.quote}
                </p>
                <p className="homepage-snapshot-warning">
                  <MarketingIcon name="warning" />
                  {copy.badges[0]}
                </p>
            </article>

            <div className="homepage-snapshot-right">
              <section className="homepage-snapshot-lead" aria-label={copy.organizedLead.title}>
                  <p
                    className="bp-copy-eyebrow text-[11px] font-black uppercase tracking-[0.14em]"
                    style={{ color: marketingTone.teal }}
                  >
                    {copy.organizedLead.title}
                  </p>
                  <div className="mt-3 grid gap-2">
                    {copy.organizedLead.fields.map(([label, value]) => (
                      <div
                        className="homepage-snapshot-field"
                        key={label}
                      >
                        <span
                          className="bp-copy-meta text-[11px] font-black uppercase tracking-[0.08em]"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {label}
                        </span>
                        <span
                          className="min-w-0 break-words text-[14px] font-black leading-5"
                          style={{ color: "var(--text-strong)" }}
                        >
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
              </section>

              <section className="homepage-snapshot-draft" aria-label={copy.draft.title}>
                  <p
                    className="bp-copy-card-title text-[16px] font-black"
                    style={{ color: "var(--text-strong)" }}
                  >
                    {copy.draft.title}
                  </p>
                  <p
                    className="bp-copy-card-body mt-2 text-[14px] font-bold leading-6"
                    style={{ color: "var(--text-default)" }}
                  >
                    {copy.draft.body}
                  </p>
                  <button
                    className="bp-copy-button mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-[12px] px-4 text-[13px] font-black transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "var(--primary-contrast)",
                    }}
                    type="button"
                  >
                    <MarketingIcon name="copy" />
                    {copy.copyButton}
                  </button>
              </section>
            </div>
          </div>

          <div className="homepage-snapshot-footer">
            <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
              {copy.badges.map((item) => (
                <span
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-black"
                  key={item}
                  style={{
                    borderColor: marketingTone.border,
                    color: marketingTone.teal,
                  }}
                >
                  <MarketingIcon name="check" />
                  {item}
                </span>
              ))}
            </div>
              <MarketingButton href="/demo" variant="secondary">
                {copy.cta}
              </MarketingButton>
          </div>
        </MarketingCard>
      </MarketingShell>
    </section>
  );
}

function GuardrailStrip({ items }: Readonly<{ items: readonly string[] }>) {
  return (
    <section
      className="homepage-guardrail-strip border-y"
      id="trust"
      style={{
        backgroundColor:
          "color-mix(in srgb, var(--accent) 6%, var(--canvas))",
        borderColor: marketingTone.border,
      }}
    >
      <MarketingShell>
        <div className="grid gap-3 py-5 sm:grid-cols-3">
        {items.map((item) => (
          <div className="bp-copy-card-body flex min-w-0 items-start gap-3 text-[14px] font-black leading-6" key={item} style={{ color: marketingTone.text }}>
            <span className="mt-0.5 shrink-0" style={{ color: marketingTone.teal }}>
              <MarketingIcon name="check" />
            </span>
            <span className="min-w-0">{item}</span>
          </div>
        ))}
        </div>
      </MarketingShell>
    </section>
  );
}

export default async function HomePage({ searchParams }: HomePageProps = {}) {
  const language = await readPublicLanguage(searchParams);
  const navCopy = getHomeCopy(language).nav;
  const siteCopy = getPublicSiteCopy(language);
  const copy = siteCopy.home;

  return (
    <main className="bp-page public-site min-h-svh" style={{ background: marketingBackground, color: marketingTone.text }}>
      <JsonLdScript data={buildHomeJsonLd(language)} id="bizpilot-home-jsonld" />
      <MarketingHeader copy={navCopy} language={language} redirectPath="/" />
      <HeroSection copy={copy} />
      <ProductPreview copy={copy.preview} />

      <section className="homepage-problem-section" id="features">
        <MarketingShell>
          <SectionTitle
            body={copy.problem.body}
            eyebrow={copy.problem.eyebrow}
            title={copy.problem.title}
          />
          <CardGrid items={copy.problem.cards} />
        </MarketingShell>
      </section>

      <GuardrailStrip items={copy.preview.badges} />

      <section className="py-[var(--section-space-compact)]">
        <MarketingShell>
          <details>
            <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <SectionTitle body={copy.useCases.body} title={copy.useCases.title} />
            </summary>
            <div className="homepage-use-case-grid mt-6">
              {copy.useCases.cards.map((item) => (
                <Link
                  className="group flex min-w-0 flex-col justify-between rounded-[20px] border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-md)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--surface-elevated)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)] active:translate-y-0"
                  href={item.href}
                  key={item.href}
                  style={{
                    color: marketingTone.text,
                  }}
                >
                  <span>
                    <span className="bp-copy-card-title block text-[18px] font-black">
                      {item.title}
                    </span>
                    <span
                      className="bp-copy-card-body mt-3 block text-[14px] font-bold leading-6"
                      style={{ color: marketingTone.soft }}
                    >
                      {item.body}
                    </span>
                  </span>
                  <span
                    className="mt-5 inline-flex items-center gap-2 text-[13px] font-black transition group-hover:translate-x-1"
                    style={{ color: marketingTone.teal }}
                  >
                    <MarketingIcon name="arrow" />
                  </span>
                </Link>
              ))}
            </div>
          </details>
        </MarketingShell>
      </section>

      <section className="py-[var(--section-space)]" id="pilot">
        <MarketingShell>
          <MarketingCard className="p-7 sm:p-9" style={{ borderColor: "rgba(45,212,191,0.24)" }}>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <h2 className="bp-copy-section-title text-[30px] font-black leading-[1.08] sm:text-[42px]" style={{ color: marketingTone.text }}>
                  {copy.finalCta.title}
                </h2>
                <p className="bp-copy-card-body mt-4 max-w-[720px] text-[16px] leading-8" style={{ color: marketingTone.soft }}>
                  {copy.finalCta.body}
                </p>
                <p className="bp-copy-meta mt-4 text-[13px] font-black" style={{ color: marketingTone.teal }}>
                  {copy.finalCta.note}
                </p>
              </div>
              <MarketingButton href="/pilot">
                {copy.finalCta.cta} <MarketingIcon name="arrow" />
              </MarketingButton>
            </div>
          </MarketingCard>
          <MarketingNextStepPanel
            body={copy.preview.title}
            className="mt-8"
            items={[
              {
                description: siteCopy.features.badge,
                href: "/features",
                icon: "spark",
                label: navCopy.features,
              },
              {
                description: siteCopy.demo.badge,
                href: "/demo",
                icon: "radar",
                label: navCopy.demo,
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

      <section className="py-[var(--section-space-compact)]">
        <MarketingShell>
          <details>
            <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <SectionTitle eyebrow={copy.faq.eyebrow} title={copy.faq.title} />
            </summary>
            <div className="mx-auto mt-6 grid max-w-[900px] gap-3">
              {copy.faq.items.map((item) => (
                <MarketingCard className="p-5" key={item.question}>
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
            <div className="mt-7 flex justify-center">
              <MarketingButton href="/faq" variant="secondary">
                {copy.faq.cta} <MarketingIcon name="arrow" />
              </MarketingButton>
            </div>
          </details>
        </MarketingShell>
      </section>

      <MarketingFooter copy={navCopy} />
    </main>
  );
}
