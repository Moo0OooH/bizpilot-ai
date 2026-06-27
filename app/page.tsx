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
 * Last Updated: 2026-06-26
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
 * ============================================================
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

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
  type MarketingIconName,
} from "@/components/public/marketing-ui";
import { getHomeCopy } from "@/lib/i18n/home-copy";
import {
  INTERFACE_LANGUAGE_COOKIE,
} from "@/lib/i18n/language";
import {
  getPublicSiteCopy,
  type PublicSiteCopy,
} from "@/lib/i18n/public-site-copy";
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

function MiniProductMockup({ copy }: Readonly<{ copy: HomeCopy["mockup"] }>) {
  const sourceTones = [
    marketingTone.gold,
    marketingTone.blue,
    marketingTone.teal,
    marketingTone.red,
  ] as const;
  const sourceIcons: readonly MarketingIconName[] = [
    "globe",
    "search",
    "message",
    "phone",
  ];

  return (
    <div
      className="homepage-hero-mockup homepage-signal-board w-full rounded-[20px] border p-3 sm:p-4"
      style={{
        background:
          "linear-gradient(135deg, color-mix(in srgb, var(--surface-elevated) 92%, var(--primary) 8%), var(--surface))",
        borderColor: "var(--border-strong)",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      <div className="homepage-signal-rail" aria-hidden="true" />
      <div className="homepage-board-topline mb-3 flex min-w-0 items-center justify-between gap-3">
        <span
          className="bp-copy-status inline-flex min-w-0 items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-black"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border-default)",
            color: "var(--text-strong)",
          }}
        >
          <MarketingIcon name="radar" />
          {copy.boardLabel}
        </span>
        <span
          className="homepage-board-safety bp-copy-status hidden rounded-full border px-3 py-1.5 text-[11px] font-black sm:inline-flex"
          style={{
            backgroundColor: "color-mix(in srgb, var(--accent) 10%, var(--surface))",
            borderColor: "color-mix(in srgb, var(--accent) 30%, var(--border-default))",
            color: "var(--accent)",
          }}
        >
          {copy.boardSafety}
        </span>
      </div>
      <div className="homepage-chaos-clarity-flow homepage-signal-flow grid min-w-0 items-stretch gap-3">
        <section className="homepage-chaos-panel homepage-signal-panel min-w-0">
          <div className="homepage-visual-heading">
            <p className="bp-copy-eyebrow text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: marketingTone.gold }}>
              {copy.chaosTitle}
            </p>
            <h3 className="bp-copy-card-title mt-1 min-h-0 text-[15px] font-black leading-tight" style={{ color: "var(--text-strong)" }}>
              {copy.chaosSubtitle}
            </h3>
          </div>

          <div className="homepage-chaos-source-grid mt-3 grid gap-2">
            {copy.sources.slice(0, 4).map((source, index) => (
              <span
                className="homepage-source-chip bp-copy-status min-w-0 rounded-[12px] border px-2.5 py-2 text-[11px] font-black leading-4"
                key={source}
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--surface-interactive) 86%, var(--canvas))",
                  borderColor:
                    "color-mix(in srgb, var(--border-default) 78%, transparent)",
                  color: sourceTones[index] ?? marketingTone.text,
                }}
              >
                <span
                  aria-hidden
                  className="homepage-source-icon"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, currentColor 13%, var(--surface))",
                  }}
                >
                  <MarketingIcon name={sourceIcons[index] ?? "message"} />
                </span>
                {source}
              </span>
            ))}
          </div>

          <div className="homepage-chaos-messages mt-3 grid gap-2">
            {copy.messages.slice(0, 4).map((message) => (
              <p
                className="homepage-signal-message bp-copy-card-body min-w-0 rounded-[12px] border px-3 py-2 text-[11px] font-bold leading-4"
                key={message}
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border-default)",
                  color: "var(--text-default)",
                }}
              >
                <span aria-hidden className="homepage-message-mark" />
                <span>{message}</span>
              </p>
            ))}
          </div>
        </section>

        <div className="homepage-flow-connector homepage-flow-connector--desktop" aria-hidden="true">
          <MarketingIcon name="arrow" />
        </div>

        <section
          className="homepage-bizpilot-node min-w-0 rounded-[16px] border p-3"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--accent) 10%, var(--surface-elevated))",
            borderColor:
              "color-mix(in srgb, var(--accent) 36%, var(--border-default))",
          }}
        >
          <p className="bp-copy-card-title min-h-0 text-[16px] font-black" style={{ color: "var(--text-strong)" }}>
            {copy.bizPilotTitle}
          </p>
          <p className="bp-copy-meta mt-1 text-[11px] font-bold leading-4" style={{ color: "var(--text-default)" }}>
            {copy.bizPilotBody}
          </p>
          <div className="homepage-bizpilot-pulse" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="homepage-bizpilot-action-grid mt-3 grid gap-2">
            {copy.bizPilotActions.slice(0, 4).map((action) => (
              <span
                className="bp-copy-status inline-flex min-w-0 items-center gap-2 rounded-[10px] px-2.5 py-1.5 text-[11px] font-black"
                key={action}
                style={{
                  backgroundColor: "var(--surface)",
                  color: "var(--text-strong)",
                }}
              >
                <MarketingIcon name="check" />
                {action}
              </span>
            ))}
          </div>
        </section>

        <div className="homepage-flow-connector homepage-flow-connector--desktop" aria-hidden="true">
          <MarketingIcon name="arrow" />
        </div>

        <section className="homepage-clarity-panel homepage-signal-panel min-w-0">
          <div className="homepage-visual-heading">
            <p className="bp-copy-eyebrow text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: marketingTone.teal }}>
              {copy.clarityTitle}
            </p>
            <h3 className="bp-copy-card-title mt-1 min-h-0 text-[15px] font-black leading-tight" style={{ color: "var(--text-strong)" }}>
              {copy.claritySubtitle}
            </h3>
          </div>

          <div className="homepage-clarity-leads mt-3 grid gap-2">
            {copy.leads.slice(0, 2).map((lead, index) => (
              <div
                className="homepage-clarity-lead homepage-signal-lead min-w-0 rounded-[12px] border p-3"
                key={lead.title}
                style={{
                  backgroundColor:
                    index === 0
                      ? "color-mix(in srgb, var(--warning) 10%, var(--surface))"
                      : "var(--surface-interactive)",
                  borderColor:
                    index === 0
                      ? "color-mix(in srgb, var(--warning) 32%, var(--border-default))"
                      : "var(--border-default)",
                }}
              >
                <div className="flex min-w-0 items-start justify-between gap-2">
                  <p className="bp-copy-card-title min-h-0 text-[12px] font-black leading-4" style={{ color: "var(--text-strong)" }}>
                    {lead.title}
                  </p>
                  <span
                    className="homepage-priority-dot"
                    aria-hidden
                    style={{
                      backgroundColor: index === 0 ? "var(--warning)" : "var(--accent)",
                    }}
                  />
                </div>
                <p className="bp-copy-card-body mt-1 text-[11px] font-bold leading-4" style={{ color: "var(--text-default)" }}>
                  {lead.body}
                </p>
              </div>
            ))}
          </div>

          <div
            className="homepage-hero-draft-card homepage-signal-draft mt-3 rounded-[14px] border p-3"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--accent-decorative) 12%, var(--surface-elevated))",
              borderColor:
                "color-mix(in srgb, var(--accent-decorative) 34%, var(--border-default))",
            }}
          >
            <p className="bp-copy-card-title min-h-0 text-[12px] font-black leading-4" style={{ color: "var(--text-strong)" }}>
              {copy.draftTitle}
            </p>
            <div className="homepage-draft-lines mt-2" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <p className="bp-copy-card-body homepage-mockup-draft-body mt-1.5 text-[11px] leading-4" style={{ color: "var(--text-default)" }}>
              {copy.draftBody}
            </p>
            <button
              className="bp-copy-button mt-3 inline-flex min-h-8 items-center justify-center rounded-[10px] px-3 text-[11px] font-black transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-contrast)",
              }}
              type="button"
            >
              {copy.copyButton}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function HeroSection({ copy }: Readonly<{ copy: HomeCopy }>) {
  return (
    <section className="bp-section-hero homepage-hero-section">
      <MarketingShell>
        <div className="bp-hero-grid homepage-hero-grid grid min-w-0 items-center gap-5 min-[1100px]:grid-cols-[minmax(0,0.88fr)_minmax(32rem,0.98fr)] min-[1100px]:gap-8">
          <div className="homepage-hero-copy min-w-0">
            <MarketingBadge>{copy.hero.badge}</MarketingBadge>
            <h1
              className="bp-copy-hero homepage-hero-title mt-3 font-black"
              style={{ color: marketingTone.text }}
            >
              {copy.hero.title}
            </h1>
            <p
              className="bp-copy-hero-body homepage-hero-body mt-3 text-[16px] leading-7 sm:text-[17px]"
              style={{ color: marketingTone.soft }}
            >
              {copy.hero.body}
            </p>
            <ul className="homepage-hero-bullets mt-4 flex flex-wrap gap-2">
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
            <div className="bp-button-row homepage-hero-actions mt-4 flex flex-col gap-3 min-[360px]:flex-row">
              <MarketingButton href="/pilot">{copy.hero.primaryCta}</MarketingButton>
              <MarketingButton href="/demo" variant="secondary">
                {copy.hero.secondaryCta}
              </MarketingButton>
            </div>
            <p className="bp-copy-meta homepage-hero-note mt-3 inline-flex min-w-0 items-center gap-2 text-[12px] font-black leading-5" style={{ color: marketingTone.teal }}>
              <MarketingIcon name="shield" />
              {copy.hero.note}
            </p>
          </div>
          <div className="homepage-hero-visual flex min-w-0 justify-center min-[1100px]:justify-end">
            <MiniProductMockup copy={copy.mockup} />
          </div>
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
    <section className="py-[var(--section-space-compact)]" id="demo">
      <MarketingShell>
        <SectionTitle body={copy.body} title={copy.title} />
        <MarketingCard className="homepage-demo-grid mt-7 p-4 sm:p-5 lg:p-6">
          <div className="grid gap-4">
            <div className="grid gap-2 sm:grid-cols-3">
              {copy.steps.map((step, index) => (
                <div
                  className="flex min-w-0 items-center gap-2 rounded-[12px] border px-3 py-2"
                  key={step}
                  style={{
                    backgroundColor: "var(--surface-interactive)",
                    borderColor: "var(--border-default)",
                  }}
                >
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] text-[11px] font-black"
                    style={{
                      backgroundColor:
                        index === 0
                          ? marketingTone.text
                          : index === 1
                            ? marketingTone.blue
                            : marketingTone.teal,
                      color: "var(--primary-contrast)",
                    }}
                  >
                    {index + 1}
                  </span>
                  <span
                    className="bp-copy-status min-w-0 text-[12px] font-black leading-4"
                    style={{ color: "var(--text-strong)" }}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div
                className="rounded-[18px] border p-4"
                style={{
                  backgroundColor: "var(--surface-elevated)",
                  borderColor: "var(--border-default)",
                }}
              >
                <p
                  className="bp-copy-eyebrow text-[11px] font-black uppercase tracking-[0.14em]"
                  style={{ color: marketingTone.gold }}
                >
                  {copy.request.title}
                </p>
                <p
                  className="mt-3 rounded-[14px] border p-4 text-[16px] font-black leading-7"
                  style={{
                    backgroundColor: "var(--surface)",
                    borderColor: "var(--border-default)",
                    color: "var(--text-strong)",
                  }}
                >
                  {copy.request.quote}
                </p>
              </div>

              <div className="grid gap-3">
                <div
                  className="rounded-[18px] border p-4"
                  style={{
                    backgroundColor: "var(--surface-elevated)",
                    borderColor: "var(--border-default)",
                  }}
                >
                  <p
                    className="bp-copy-eyebrow text-[11px] font-black uppercase tracking-[0.14em]"
                    style={{ color: marketingTone.teal }}
                  >
                    {copy.organizedLead.title}
                  </p>
                  <div className="mt-3 grid gap-2">
                    {copy.organizedLead.fields.map(([label, value]) => (
                      <div
                        className="grid min-w-0 gap-1 rounded-[12px] border px-3 py-2 sm:grid-cols-[92px_minmax(0,1fr)]"
                        key={label}
                        style={{
                          backgroundColor: "var(--surface)",
                          borderColor: "var(--border-default)",
                        }}
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
                </div>

                <div
                  className="rounded-[18px] border p-4"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--accent-decorative) 10%, var(--surface-elevated))",
                    borderColor:
                      "color-mix(in srgb, var(--accent-decorative) 34%, var(--border-default))",
                  }}
                >
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
                </div>
              </div>
            </div>

            <div
              className="flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row"
              style={{ borderColor: "var(--border-default)" }}
            >
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
  const copy = getPublicSiteCopy(language).home;

  return (
    <main className="bp-page public-site min-h-svh" style={{ background: marketingBackground, color: marketingTone.text }}>
      <MarketingHeader copy={navCopy} language={language} redirectPath="/" />
      <HeroSection copy={copy} />

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

      <ProductPreview copy={copy.preview} />

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
