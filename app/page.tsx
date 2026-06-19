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
 * Last Updated: 2026-06-19
 * Change Log:
 * - 2026-06-18: Applied responsive hero, section density, and no-inner-scroll demo hardening.
 * - 2026-06-19: Mapped the hero product preview to semantic theme surfaces for dark contrast.
 * - 2026-06-19: Moved visible homepage copy and metadata into the public-site i18n dictionary.
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
  readSupportedLanguage,
} from "@/lib/i18n/language";
import {
  getPublicSiteCopy,
  type PublicSiteCopy,
} from "@/lib/i18n/public-site-copy";

type HomeCopy = PublicSiteCopy["home"];

async function readPublicLanguage() {
  return readSupportedLanguage(
    (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const language = await readPublicLanguage();
  return getPublicSiteCopy(language).home.meta;
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
          className="text-[12px] font-black uppercase tracking-[0.16em]"
          style={{ color: marketingTone.teal }}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className="mt-3 text-[30px] font-black leading-[1.08] sm:text-[40px]"
        style={{ color: marketingTone.text }}
      >
        {title}
      </h2>
      {body ? (
        <p
          className="mt-4 text-[16px] leading-8"
          style={{ color: marketingTone.soft }}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}

function MiniProductMockup({ copy }: Readonly<{ copy: HomeCopy["mockup"] }>) {
  return (
    <MarketingCard
      className="w-full max-w-[600px] p-4 sm:p-5"
      style={{
        background:
          "linear-gradient(180deg, var(--surface-elevated), var(--surface))",
        borderColor: "var(--border-strong)",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      <div
        className="flex items-center justify-between gap-3 border-b pb-4"
        style={{ borderColor: "var(--border-default)" }}
      >
        <div>
          <p
            className="text-[12px] font-black uppercase tracking-[0.14em]"
            style={{ color: "var(--accent)" }}
          >
            {copy.title}
          </p>
          <h3
            className="mt-1 text-[22px] font-black"
            style={{ color: "var(--text-strong)" }}
          >
            {copy.name}
          </h3>
        </div>
        <span
          className="rounded-full border px-3 py-1 text-[12px] font-black"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--warning) 14%, var(--surface))",
            borderColor:
              "color-mix(in srgb, var(--warning) 32%, var(--border-default))",
            color: "var(--warning)",
          }}
        >
          {copy.status}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {copy.fields.map(([label, value]) => (
          <div
            className="rounded-[10px] border p-3"
            key={label}
            style={{
              backgroundColor: "var(--surface-interactive)",
              borderColor: "var(--border-default)",
            }}
          >
            <p
              className="text-[11px] font-black uppercase tracking-[0.12em]"
              style={{ color: "var(--text-muted)" }}
            >
              {label}
            </p>
            <p
              className="mt-1 text-[14px] font-black"
              style={{ color: "var(--text-strong)" }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      <div
        className="mt-4 rounded-[14px] border p-4"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--accent-decorative) 14%, var(--surface-elevated))",
          borderColor:
            "color-mix(in srgb, var(--accent-decorative) 38%, var(--border-default))",
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p
            className="text-[13px] font-black"
            style={{ color: "var(--text-strong)" }}
          >
            {copy.draftTitle}
          </p>
          <span
            className="rounded-full px-3 py-1 text-[11px] font-black"
            style={{
              backgroundColor: "var(--surface-elevated)",
              color: "var(--accent)",
            }}
          >
            {copy.draftTag}
          </span>
        </div>
        <p
          className="mt-3 text-[14px] leading-6"
          style={{ color: "var(--text-default)" }}
        >
          {copy.draftBody}
        </p>
        <button
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-[10px] px-4 text-[13px] font-black transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--primary-contrast)",
          }}
          type="button"
        >
          {copy.copyButton}
        </button>
      </div>
    </MarketingCard>
  );
}

function HeroSection({ copy }: Readonly<{ copy: HomeCopy }>) {
  return (
    <section className="pb-14 pt-9 sm:pb-16 sm:pt-12 min-[1180px]:pb-20 min-[1180px]:pt-16">
      <MarketingShell>
        <div className="grid min-w-0 items-center gap-10 min-[1100px]:grid-cols-[minmax(0,1.02fr)_minmax(28rem,0.98fr)] min-[1100px]:gap-12">
          <div className="min-w-0">
            <MarketingBadge>{copy.hero.badge}</MarketingBadge>
            <h1
              className="mt-6 max-w-[650px] text-[length:var(--text-hero)] font-black leading-[0.98] [text-wrap:balance]"
              style={{ color: marketingTone.text }}
            >
              {copy.hero.title}
            </h1>
            <p
              className="mt-6 max-w-[690px] text-[17px] leading-8 sm:text-[19px]"
              style={{ color: marketingTone.soft }}
            >
              {copy.hero.body}
            </p>
            <div className="mt-8 flex flex-col gap-3 min-[460px]:flex-row">
              <MarketingButton href="/pilot">{copy.hero.primaryCta}</MarketingButton>
              <MarketingButton href="/demo" variant="secondary">
                {copy.hero.secondaryCta}
              </MarketingButton>
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              {copy.hero.trustBadges.map((item) => (
                <span
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[12px] font-black"
                  key={item}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.045)",
                    borderColor: marketingTone.border,
                    color: marketingTone.soft,
                  }}
                >
                  <MarketingIcon name="check" />
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="flex min-w-0 justify-center min-[1100px]:justify-end">
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
        <MarketingCard className="p-5" key={item.title}>
          <h3 className="text-[18px] font-black" style={{ color: marketingTone.text }}>
            {item.title}
          </h3>
          <p className="mt-3 text-[14px] leading-7" style={{ color: marketingTone.soft }}>
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
        <div className="public-card-grid-wide mt-8">
          {copy.steps.map((step, index) => (
            <MarketingCard className="p-5 sm:p-6" key={step.title}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[12px] font-black uppercase tracking-[0.14em] text-slate-500">
                  {index + 1}
                </span>
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-[10px] text-[13px] font-black text-white"
                  style={{
                    backgroundColor:
                      index === 0 ? marketingTone.text : index === 1 ? marketingTone.blue : marketingTone.teal,
                  }}
                >
                  {index + 1}
                </span>
              </div>
              <h3 className="mt-5 text-[22px] font-black text-slate-950">
                {step.title}
              </h3>
              {step.quote ? (
                <p className="mt-4 rounded-[16px] border border-slate-200 bg-slate-50 p-4 text-[17px] font-black leading-7 text-slate-950">
                  {step.quote}
                </p>
              ) : null}
              {step.fields ? (
                <div className="mt-4 grid gap-2">
                  {step.fields.map(([label, value]) => (
                    <div
                      className="grid min-w-0 gap-1 rounded-[12px] border border-slate-200 bg-white px-3 py-2 sm:grid-cols-[86px_minmax(0,1fr)]"
                      key={label}
                    >
                      <span className="text-[12px] font-black uppercase tracking-[0.08em] text-slate-500">
                        {label}
                      </span>
                      <span className="min-w-0 break-words text-[14px] font-black text-slate-950">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
              {step.body ? (
                <div className="mt-4 rounded-[16px] border border-teal-200 bg-teal-50 p-4">
                  <p className="text-[15px] font-bold leading-7 text-slate-950">
                    {step.body}
                  </p>
                  <button
                    className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-[12px] bg-slate-950 px-4 text-[13px] font-black text-white"
                    type="button"
                  >
                    <MarketingIcon name="copy" />
                    {copy.copyButton}
                  </button>
                </div>
              ) : null}
            </MarketingCard>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
            {copy.badges.map((item) => (
              <span
                className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-black"
                key={item}
                style={{ borderColor: marketingTone.border, color: marketingTone.teal }}
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
      </MarketingShell>
    </section>
  );
}

function ListColumn({
  items,
  title,
  tone,
}: Readonly<{ items: readonly string[]; title: string; tone: "good" | "limit" }>) {
  return (
    <MarketingCard className="p-5">
      <h3 className="text-[19px] font-black" style={{ color: marketingTone.text }}>
        {title}
      </h3>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <div className="flex items-start gap-3 text-[14px] leading-6" key={item} style={{ color: marketingTone.soft }}>
            <span style={{ color: tone === "good" ? marketingTone.teal : marketingTone.gold }}>
              <MarketingIcon name={tone === "good" ? "check" : "minus"} />
            </span>
            {item}
          </div>
        ))}
      </div>
    </MarketingCard>
  );
}

export default async function HomePage() {
  const language = await readPublicLanguage();
  const navCopy = getHomeCopy(language).nav;
  const copy = getPublicSiteCopy(language).home;

  return (
    <main className="public-site min-h-svh" style={{ background: marketingBackground, color: marketingTone.text }}>
      <MarketingHeader copy={navCopy} language={language} redirectPath="/" />
      <HeroSection copy={copy} />

      <section className="py-[var(--section-space)]" id="features">
        <MarketingShell>
          <SectionTitle
            body={copy.problem.body}
            eyebrow={copy.problem.eyebrow}
            title={copy.problem.title}
          />
          <CardGrid items={copy.problem.cards} />
        </MarketingShell>
      </section>

      <section className="py-[var(--section-space-compact)]" id="cleaning">
        <MarketingShell>
          <SectionTitle
            eyebrow={copy.solution.eyebrow}
            title={copy.solution.title}
          />
          <CardGrid items={copy.solution.cards} />
        </MarketingShell>
      </section>

      <section className="py-[var(--section-space-compact)]">
        <MarketingShell>
          <SectionTitle
            eyebrow={copy.workflow.eyebrow}
            title={copy.workflow.title}
          />
          <div className="mt-8 grid gap-3 min-[1180px]:grid-cols-5">
            {copy.workflow.steps.map((step, index) => (
              <MarketingCard className="p-5" key={step}>
                <p className="text-[12px] font-black uppercase tracking-[0.14em]" style={{ color: marketingTone.teal }}>
                  {copy.workflow.stepLabel} {index + 1}
                </p>
                <p className="mt-3 text-[16px] font-black leading-6" style={{ color: marketingTone.text }}>
                  {step}
                </p>
              </MarketingCard>
            ))}
          </div>
        </MarketingShell>
      </section>

      <ProductPreview copy={copy.preview} />

      <section className="py-[var(--section-space-compact)]" id="trust">
        <MarketingShell>
          <SectionTitle
            body={copy.ai.body}
            eyebrow={copy.ai.eyebrow}
            title={copy.ai.title}
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <ListColumn items={copy.ai.canHelp} title={copy.ai.canHelpTitle} tone="good" />
            <ListColumn items={copy.ai.willNot} title={copy.ai.willNotTitle} tone="limit" />
          </div>
        </MarketingShell>
      </section>

      <section className="py-[var(--section-space-compact)]">
        <MarketingShell>
          <SectionTitle title={copy.useCases.title} />
          <div className="public-card-grid mt-8">
            {copy.useCases.items.map((item) => (
              <MarketingCard className="p-5" key={item}>
                <p className="text-[16px] font-black" style={{ color: marketingTone.text }}>
                  {item}
                </p>
              </MarketingCard>
            ))}
          </div>
        </MarketingShell>
      </section>

      <section className="py-[var(--section-space-compact)]">
        <MarketingShell>
          <MarketingCard className="p-6 sm:p-8">
            <MarketingBadge toneName="gold">{copy.roadmap.badge}</MarketingBadge>
            <h2 className="mt-5 max-w-[820px] text-[30px] font-black leading-[1.08] sm:text-[40px]" style={{ color: marketingTone.text }}>
              {copy.roadmap.title}
            </h2>
            <p className="mt-5 max-w-[860px] text-[16px] leading-8" style={{ color: marketingTone.soft }}>
              {copy.roadmap.body}
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {copy.roadmap.cards.map((item) => (
                <div className="rounded-[10px] border px-4 py-3 text-[14px] font-black" key={item} style={{ borderColor: marketingTone.border, color: marketingTone.soft }}>
                  {item}
                </div>
              ))}
            </div>
          </MarketingCard>
        </MarketingShell>
      </section>

      <section className="py-[var(--section-space-compact)]">
        <MarketingShell>
          <SectionTitle eyebrow={copy.faq.eyebrow} title={copy.faq.title} />
          <div className="mx-auto mt-8 grid max-w-[900px] gap-3">
            {copy.faq.items.map((item) => (
              <MarketingCard className="p-5" key={item.question}>
                <details>
                  <summary className="cursor-pointer list-none text-[16px] font-black" style={{ color: marketingTone.text }}>
                    {item.question}
                  </summary>
                  <p className="mt-3 text-[14px] leading-7" style={{ color: marketingTone.soft }}>
                    {item.answer}
                  </p>
                </details>
              </MarketingCard>
            ))}
          </div>
        </MarketingShell>
      </section>

      <section className="py-[var(--section-space)]" id="pilot">
        <MarketingShell>
          <MarketingCard className="p-7 sm:p-9" style={{ borderColor: "rgba(45,212,191,0.24)" }}>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <h2 className="text-[30px] font-black leading-[1.08] sm:text-[42px]" style={{ color: marketingTone.text }}>
                  {copy.finalCta.title}
                </h2>
                <p className="mt-4 max-w-[720px] text-[16px] leading-8" style={{ color: marketingTone.soft }}>
                  {copy.finalCta.body}
                </p>
                <p className="mt-4 text-[13px] font-black" style={{ color: marketingTone.teal }}>
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

      <MarketingFooter copy={navCopy} />
    </main>
  );
}
