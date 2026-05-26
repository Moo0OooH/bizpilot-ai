/**
 * ============================================================
 * File: app/page.tsx
 * Project: BizPilot AI
 * Description: Public homepage for the cleaning-first Quote Recovery Command Center.
 * Role: Presents the pre-dashboard marketing surface without expanding product scope.
 * Related:
 * - docs/CURRENT_CANONICAL_DOCS_v1.7.md
 * - docs/operations/BIZPILOT_PHASE_18A_NEXT_TAB_HANDOFF_v1.0.md
 * - components/public/marketing-ui.tsx
 * Author: MoOoH
 * Last Updated: 2026-05-26
 * Change Log:
 * - 2026-05-26: Rebuilt the first viewport into an immersive product-led homepage hero.
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
  type MarketingIconName,
  MarketingShell,
  marketingBackground,
  marketingTone,
} from "@/components/public/marketing-ui";
import { InteractiveCleaningDemoSection } from "@/components/public/interactive-cleaning-demo";
import { getHomeCopy, type HomeCopy } from "@/lib/i18n/home-copy";
import {
  INTERFACE_LANGUAGE_COOKIE,
  readSupportedLanguage,
} from "@/lib/i18n/language";

export const metadata: Metadata = {
  title: "BizPilot AI - Recover Cleaning Quote Requests Faster",
  description:
    "BizPilot helps cleaning businesses organize quote requests, recover missing details, draft owner-reviewed replies, and follow up before warm leads go cold.",
};

type LeadTone = "new" | "info" | "draft" | "replied" | "risk";

type LeadItem = Readonly<{
  customer: string;
  detail: string;
  source: string;
  status: string;
  time: string;
  tone: LeadTone;
}>;

type ProblemItem = Readonly<{
  body: string;
  icon: MarketingIconName;
  title: string;
  tone: LeadTone;
}>;

type FlowItem = Readonly<{
  body: string;
  icon: MarketingIconName;
  kicker: string;
  title: string;
}>;

const leadToneStyles: Record<LeadTone, { accent: string; bg: string; border: string; text: string }> = {
  draft: {
    accent: marketingTone.blue,
    bg: "rgba(84,167,255,0.12)",
    border: "rgba(84,167,255,0.30)",
    text: "#86C5FF",
  },
  info: {
    accent: marketingTone.gold,
    bg: "rgba(246,184,75,0.13)",
    border: "rgba(246,184,75,0.30)",
    text: marketingTone.gold,
  },
  new: {
    accent: marketingTone.emerald,
    bg: "rgba(23,212,146,0.12)",
    border: "rgba(23,212,146,0.30)",
    text: marketingTone.emerald,
  },
  replied: {
    accent: "#2CE59C",
    bg: "rgba(44,229,156,0.11)",
    border: "rgba(44,229,156,0.28)",
    text: "#58EBAF",
  },
  risk: {
    accent: marketingTone.red,
    bg: "rgba(255,95,102,0.12)",
    border: "rgba(255,95,102,0.30)",
    text: "#FF8C92",
  },
};

function StatusPill({ status, tone }: Readonly<{ status: string; tone: LeadTone }>) {
  const selected = leadToneStyles[tone];

  return (
    <span
      className="inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[9.5px] font-black uppercase leading-none"
      style={{ backgroundColor: selected.bg, borderColor: selected.border, color: selected.text }}
    >
      {status}
    </span>
  );
}

function LeadRow({
  fromLabel,
  item,
}: Readonly<{ fromLabel: string; item: LeadItem }>) {
  const selected = leadToneStyles[item.tone];

  return (
    <div
      className="grid gap-2 rounded-[12px] border p-2.5 min-[520px]:grid-cols-[minmax(0,1fr)_auto] min-[520px]:items-start"
      style={{ backgroundColor: "rgba(255,255,255,0.035)", borderColor: marketingTone.border }}
    >
      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: selected.accent }} />
          <p className="truncate text-[13px] font-black" style={{ color: marketingTone.text }}>
            {item.customer}
          </p>
        </div>
        <p className="mt-1 truncate text-[10.5px]" style={{ color: marketingTone.soft }}>
          {item.detail}
        </p>
        <p className="mt-1 truncate text-[9.5px]" style={{ color: marketingTone.muted }}>
          {fromLabel}: {item.source}
        </p>
      </div>
      <div className="flex items-center justify-between gap-3 min-[520px]:flex-col min-[520px]:items-end">
        <span className="text-[9.5px] font-bold" style={{ color: marketingTone.muted }}>
          {item.time}
        </span>
        <StatusPill status={item.status} tone={item.tone} />
      </div>
    </div>
  );
}

function HeroProductScene({
  copy,
}: Readonly<{ copy: HomeCopy["heroDesk"] }>) {
  return (
    <div
      aria-hidden
      className="pointer-events-none relative min-h-[520px] w-full min-w-0 overflow-hidden rounded-[22px] border p-3 shadow-[0_38px_120px_rgba(0,0,0,0.42)] sm:min-h-[560px] sm:p-4 lg:min-h-[620px]"
      style={{
        background:
          "radial-gradient(circle at 76% 8%, rgba(226,232,240,0.20), transparent 13rem), radial-gradient(circle at 22% 4%, rgba(45,212,191,0.20), transparent 18rem), linear-gradient(145deg, rgba(13,28,42,0.96), rgba(5,12,20,0.98))",
        borderColor: "rgba(148,203,226,0.22)",
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(226,232,240,0.46), rgba(45,212,191,0.28), transparent)" }}
      />
      <div
        className="absolute -right-20 top-12 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(45,212,191,0.18)" }}
      />
      <div
        className="absolute -bottom-24 left-10 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(84,167,255,0.12)" }}
      />

      <div className="relative grid h-full min-h-[494px] grid-rows-[auto_minmax(0,1fr)_auto] gap-3 sm:min-h-[528px] lg:min-h-[588px]">
        <div className="flex items-center justify-between gap-3 rounded-[14px] border px-3 py-2" style={{ backgroundColor: "rgba(255,255,255,0.045)", borderColor: marketingTone.border }}>
          <div className="flex min-w-0 items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: marketingTone.emerald }} />
            <p className="truncate text-[13px] font-black" style={{ color: marketingTone.text }}>
              {copy.title}
            </p>
          </div>
          <StatusPill status={copy.aiDraft} tone="new" />
        </div>

        <div className="grid min-h-0 gap-3 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="grid min-h-0 gap-2">
            {copy.leads.map((lead) => (
              <LeadRow fromLabel={copy.fromLabel} item={lead} key={lead.customer} />
            ))}
          </div>

          <div className="grid min-h-0 gap-3">
            <div
              className="rounded-[16px] border p-4"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.075), rgba(255,255,255,0.035))",
                borderColor: "rgba(148,203,226,0.24)",
              }}
            >
              <div className="grid grid-cols-3 gap-2">
                {copy.journey.slice(0, 3).map((item, index) => (
                  <div
                    className="min-h-[62px] rounded-[12px] border px-3 py-2"
                    key={`${item.label}-${item.value}`}
                    style={{
                      background:
                        index === 1
                          ? "linear-gradient(135deg, rgba(45,212,191,0.16), rgba(23,212,146,0.07))"
                          : "rgba(255,255,255,0.04)",
                      borderColor:
                        index === 1
                          ? "rgba(45,212,191,0.26)"
                          : marketingTone.border,
                    }}
                  >
                    <p className="text-[9px] font-black uppercase tracking-[0.14em]" style={{ color: marketingTone.muted }}>
                      {item.label}
                    </p>
                    <p className="mt-1 text-[12px] font-black leading-snug" style={{ color: index === 1 ? marketingTone.teal : marketingTone.text }}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="min-h-0 rounded-[18px] border p-4"
              style={{
                background:
                  "radial-gradient(circle at 96% 4%, rgba(226,232,240,0.18), transparent 10rem), linear-gradient(135deg, #2A3033 0%, #1D252B 45%, #0E151D 100%)",
                borderColor: "rgba(148,203,226,0.30)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.05), 0 0 34px rgba(56,189,248,0.08)",
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-[15px] font-black" style={{ color: marketingTone.text }}>
                  {copy.replyTitle}
                </h3>
                <StatusPill status={copy.aiDraft} tone="new" />
              </div>
              <div className="mt-3 space-y-2 text-[12px] leading-5" style={{ color: marketingTone.soft }}>
                <p>{copy.reply.greeting}</p>
                <p>{copy.reply.intro}</p>
                <p>{copy.reply.requestLine}</p>
                <ul className="ml-4 list-disc space-y-0.5">
                  {copy.reply.questions.map((question) => (
                    <li key={question}>{question}</li>
                  ))}
                </ul>
                <p>{copy.reply.closing}</p>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {[copy.reviewReply, copy.copyResponse, copy.markContacted].map((action, index) => (
                  <div
                    className="h-9 rounded-[10px] border px-2 text-center text-[10.5px] font-black leading-9"
                    key={action}
                    style={{
                      backgroundColor:
                        index === 0 ? "rgba(45,212,191,0.16)" : "rgba(255,255,255,0.035)",
                      borderColor:
                        index === 0 ? "rgba(45,212,191,0.28)" : marketingTone.borderStrong,
                      color: index === 0 ? marketingTone.teal : marketingTone.text,
                    }}
                  >
                    {action}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          {copy.journey.slice(3, 6).map((item, index) => (
            <div
              className="rounded-[13px] border px-3 py-2"
              key={`${item.label}-${item.value}`}
              style={{
                backgroundColor: index === 2 ? "rgba(45,212,191,0.11)" : "rgba(255,255,255,0.04)",
                borderColor: index === 2 ? "rgba(45,212,191,0.24)" : marketingTone.border,
              }}
            >
              <p className="text-[9px] font-black uppercase tracking-[0.14em]" style={{ color: marketingTone.muted }}>
                {item.label}
              </p>
              <p className="mt-1 truncate text-[12px] font-black" style={{ color: index === 2 ? marketingTone.teal : marketingTone.text }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroSection({ copy }: Readonly<{ copy: HomeCopy }>) {
  return (
    <section className="relative overflow-hidden px-5 pb-7 pt-5 sm:px-6 sm:pb-9 sm:pt-7">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(5,11,18,0.98) 0%, rgba(5,11,18,0.90) 36%, rgba(5,11,18,0.44) 68%, rgba(5,11,18,0.92) 100%)",
        }}
      />
      <MarketingShell className="relative max-w-[1320px]">
        <div className="relative min-h-[calc(100svh-96px)] overflow-hidden rounded-[28px] border px-4 py-6 sm:px-7 sm:py-8 lg:min-h-[760px] lg:px-10 lg:py-10" style={{ borderColor: "rgba(148,203,226,0.16)" }}>
          <div className="absolute inset-0">
            <HeroProductScene copy={copy.heroDesk} />
          </div>
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(5,11,18,0.98) 0%, rgba(5,11,18,0.92) 34%, rgba(5,11,18,0.42) 66%, rgba(5,11,18,0.16) 100%)",
            }}
          />

          <div className="relative z-10 flex min-h-[calc(100svh-150px)] max-w-[720px] flex-col justify-center py-10 lg:min-h-[660px]">
            <MarketingBadge>{copy.hero.badge}</MarketingBadge>
            <h1 className="mt-5 text-[38px] font-black leading-[1.02] min-[380px]:text-[44px] sm:text-[58px] lg:text-[68px]" style={{ color: marketingTone.text }}>
              {copy.hero.title}
            </h1>
            <p className="mt-5 max-w-[620px] text-[16px] leading-8 sm:text-[18px] sm:leading-9" style={{ color: marketingTone.soft }}>
              {copy.hero.body}
            </p>
            <div className="mt-7 grid gap-3 min-[430px]:flex min-[430px]:flex-wrap">
              <MarketingButton className="w-full px-5 min-[430px]:w-auto" href="/auth/sign-up">
                {copy.hero.primaryCta} <MarketingIcon name="arrow" />
              </MarketingButton>
              <MarketingButton className="w-full px-5 min-[430px]:w-auto" href="#cleaning-demo" variant="secondary">
                {copy.hero.secondaryCta}
              </MarketingButton>
            </div>
            <div className="mt-8 grid max-w-[620px] gap-2.5 sm:grid-cols-3" style={{ color: marketingTone.soft }}>
              {copy.hero.bullets.map((item) => (
                <span className="flex min-w-0 items-center gap-2 rounded-[12px] border px-3 py-2 text-[12px] font-bold" key={item} style={{ backgroundColor: "rgba(255,255,255,0.045)", borderColor: marketingTone.border }}>
                  <span className="shrink-0 text-[#2DD4BF]">
                    <MarketingIcon name="check" />
                  </span>
                  <span className="min-w-0 leading-5">{item}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </MarketingShell>
    </section>
  );
}

function MetricStrip({ copy }: Readonly<{ copy: HomeCopy["metrics"] }>) {
  const metricVisuals: ReadonlyArray<Readonly<{ icon: MarketingIconName; tone: LeadTone }>> = [
    { icon: "radar", tone: "draft" },
    { icon: "briefcase", tone: "new" },
    { icon: "target", tone: "risk" },
    { icon: "copy", tone: "draft" },
  ];
  const metrics = copy.items.map((item, index) => ({
    ...item,
    icon: metricVisuals[index]?.icon ?? "radar",
    tone: metricVisuals[index]?.tone ?? "draft",
  }));
  const primary = metrics[0]!;
  const secondary = metrics.slice(1);

  return (
    <section className="px-5 pb-6 sm:px-6">
      <div
        className="mx-auto grid w-full max-w-[1200px] overflow-hidden rounded-[18px] border lg:grid-cols-[1.15fr_1.85fr]"
        style={{
          background:
            "linear-gradient(135deg, rgba(37,43,46,0.58) 0%, rgba(13,19,26,0.95) 48%, rgba(7,16,25,0.96) 100%)",
          borderColor: marketingTone.border,
          boxShadow: "0 26px 80px rgba(0,0,0,0.26)",
        }}
      >
        <div className="relative min-w-0 border-b p-5 lg:border-b-0 lg:border-r" style={{ borderColor: marketingTone.border }}>
          <div
            aria-hidden
            className="absolute inset-x-5 top-0 h-px"
            style={{ background: "linear-gradient(90deg, rgba(56,189,248,0.02), rgba(226,232,240,0.35), rgba(45,212,191,0.22))" }}
          />
          <p className="text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: marketingTone.muted }}>
            {copy.eyebrow}
          </p>
          <div className="mt-4 flex items-center gap-4">
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] text-[22px]"
              style={{
                background: "linear-gradient(135deg, rgba(84,167,255,0.22), rgba(45,212,191,0.09))",
                color: leadToneStyles[primary.tone].text,
              }}
            >
              <MarketingIcon name={primary.icon} />
            </span>
            <div>
              <p className="text-[40px] font-black leading-none" style={{ color: marketingTone.text }}>
                {primary.value}
              </p>
              <p className="mt-2 text-[14px] font-black" style={{ color: marketingTone.text }}>
                {primary.label}
              </p>
              <p className="mt-1 text-[12px]" style={{ color: marketingTone.muted }}>
                {primary.note}
              </p>
            </div>
          </div>
        </div>

        <div className="grid min-w-0 md:grid-cols-3">
          {secondary.map((metric, index) => {
            const selected = leadToneStyles[metric.tone];

            return (
              <div
                className="relative min-w-0 border-b p-5 md:border-b-0 md:border-l"
                key={metric.label}
                style={{ borderColor: index === 0 ? "transparent" : marketingTone.border }}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[30px] font-black leading-none" style={{ color: marketingTone.text }}>
                    {metric.value}
                  </p>
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] text-[18px]"
                    style={{
                      background:
                        metric.tone === "risk"
                          ? "linear-gradient(135deg, rgba(255,95,102,0.22), rgba(246,184,75,0.10))"
                          : `linear-gradient(135deg, ${selected.bg}, rgba(56,189,248,0.07))`,
                      color: selected.text,
                    }}
                  >
                    <MarketingIcon name={metric.icon} />
                  </span>
                </div>
                <p className="mt-4 text-[13px] font-black" style={{ color: marketingTone.text }}>
                  {metric.label}
                </p>
                <p className="mt-1 text-[12px]" style={{ color: marketingTone.muted }}>
                  {metric.note}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PainStorySection({ copy }: Readonly<{ copy: HomeCopy["painStory"] }>) {
  return (
    <section className="px-5 py-7 sm:px-6">
      <MarketingShell>
        <div
          className="grid min-w-0 gap-6 overflow-hidden rounded-[18px] border p-5 lg:grid-cols-[0.82fr_1.18fr] lg:items-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,95,102,0.10), rgba(13,19,26,0.94) 36%, rgba(5,12,20,0.96) 100%)",
            borderColor: "rgba(255,95,102,0.20)",
          }}
        >
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: marketingTone.red }}>
              {copy.eyebrow}
            </p>
            <h2 className="mt-3 max-w-[560px] text-[26px] font-black leading-[1.1] sm:text-[34px]" style={{ color: marketingTone.text }}>
              {copy.title}
            </h2>
            <p className="mt-4 max-w-[58ch] text-[14.5px] leading-7" style={{ color: marketingTone.soft }}>
              {copy.body}
            </p>
            <p className="mt-4 max-w-[54ch] text-[13px] font-black leading-6" style={{ color: marketingTone.teal }}>
              {copy.closing}
            </p>
          </div>

          <div className="grid min-w-0 gap-2.5">
            {copy.items.map((item, index) => (
              <div
                className="grid min-h-[54px] grid-cols-[34px_minmax(0,1fr)] items-center gap-3 rounded-[10px] border px-3 py-2"
                key={item}
                style={{
                  backgroundColor:
                    index === copy.items.length - 1
                      ? "rgba(255,95,102,0.10)"
                      : "rgba(255,255,255,0.035)",
                  borderColor:
                    index === copy.items.length - 1
                      ? "rgba(255,95,102,0.24)"
                      : marketingTone.border,
                }}
              >
                <span
                  className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] text-[11px] font-black"
                  style={{
                    backgroundColor:
                      index === copy.items.length - 1
                        ? "rgba(255,95,102,0.18)"
                        : "rgba(246,184,75,0.12)",
                    color:
                      index === copy.items.length - 1
                        ? marketingTone.red
                        : marketingTone.gold,
                  }}
                >
                  {index + 1}
                </span>
                <p className="text-[13px] font-bold leading-5" style={{ color: marketingTone.soft }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </MarketingShell>
    </section>
  );
}

function ProblemSection({ copy }: Readonly<{ copy: HomeCopy["problem"] }>) {
  const problemVisuals: ReadonlyArray<Readonly<{ icon: MarketingIconName; tone: LeadTone }>> = [
    { icon: "clock", tone: "risk" },
    { icon: "inbox", tone: "draft" },
    { icon: "warning", tone: "info" },
    { icon: "radar", tone: "draft" },
  ];
  const problems: ReadonlyArray<ProblemItem> = copy.items.map((item, index) => ({
    ...item,
    icon: problemVisuals[index]?.icon ?? "clock",
    tone: problemVisuals[index]?.tone ?? "draft",
  }));

  return (
    <section className="px-5 py-7 sm:px-6" id="why">
      <MarketingShell>
        <div className="grid min-w-0 gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: marketingTone.teal }}>
              {copy.eyebrow}
            </p>
            <h2 className="mt-3 max-w-[14ch] text-[26px] font-black leading-[1.1] sm:max-w-[520px] sm:text-[34px]" style={{ color: marketingTone.text }}>
              {copy.titlePrefix}{" "}
              <span style={{ color: marketingTone.emerald }}>{copy.titleHighlight}</span>
            </h2>
            <p className="mt-4 max-w-[34ch] text-[14.5px] leading-7 sm:max-w-[50ch]" style={{ color: marketingTone.soft }}>
              {copy.body}
            </p>
          </div>

          <div
            className="relative overflow-hidden rounded-[18px] border"
            style={{
              background:
                "linear-gradient(135deg, rgba(37,43,46,0.46), rgba(9,20,31,0.86) 40%, rgba(5,12,20,0.94))",
              borderColor: marketingTone.border,
            }}
          >
            <div
              aria-hidden
              className="absolute bottom-4 left-8 top-4 w-px"
              style={{ background: "linear-gradient(180deg, rgba(255,95,102,0.28), rgba(246,184,75,0.26), rgba(45,212,191,0.30))" }}
            />
            <div className="grid">
              {problems.map((problem, index) => {
                const selected = leadToneStyles[problem.tone];

                return (
                  <div
                    className="grid gap-4 border-b p-4 pl-16 last:border-b-0 sm:grid-cols-[92px_minmax(0,1fr)_minmax(0,1.2fr)] sm:items-center sm:pl-20"
                    key={problem.title}
                    style={{ borderColor: marketingTone.border }}
                  >
                    <span
                      className="absolute left-[1.35rem] mt-1 flex h-10 w-10 items-center justify-center rounded-full border text-[18px] sm:left-[2rem]"
                      style={{
                        background:
                          problem.tone === "risk"
                            ? "linear-gradient(135deg, rgba(255,95,102,0.25), rgba(246,184,75,0.10))"
                            : `linear-gradient(135deg, ${selected.bg}, rgba(56,189,248,0.08))`,
                        borderColor: selected.border,
                        color: selected.text,
                      }}
                    >
                      <MarketingIcon name={problem.icon} />
                    </span>
                    <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: marketingTone.muted }}>
                      0{index + 1}
                    </p>
                    <h3 className="text-[17px] font-black" style={{ color: marketingTone.text }}>
                      {problem.title}
                    </h3>
                    <p className="text-[13px] leading-6" style={{ color: marketingTone.soft }}>
                      {problem.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </MarketingShell>
    </section>
  );
}

function RecoveryFlowSection({
  copy,
}: Readonly<{ copy: HomeCopy["recoveryFlow"] }>) {
  const flowIcons: readonly MarketingIconName[] = ["link", "inbox", "pen", "target"];
  const flow: ReadonlyArray<FlowItem> = copy.steps.map((item, index) => ({
    ...item,
    icon: flowIcons[index] ?? "link",
  }));

  return (
    <section className="px-5 py-7 sm:px-6" id="recovery-flow">
      <MarketingShell>
        <div
          className="overflow-hidden rounded-[22px] border p-5 sm:p-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(14,116,144,0.16), rgba(13,19,26,0.94) 38%, rgba(5,12,20,0.96) 100%)",
            borderColor: "rgba(56,189,248,0.18)",
          }}
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-[760px] text-[26px] font-black leading-[1.12] sm:text-[30px]" style={{ color: marketingTone.text }}>
              {copy.title}
            </h2>
            <MarketingBadge toneName="blue">{copy.badge}</MarketingBadge>
          </div>

          <div className="relative mt-7 grid gap-5 lg:grid-cols-4">
            <div
              aria-hidden
              className="absolute left-8 right-8 top-[1.45rem] hidden h-px lg:block"
              style={{ background: "linear-gradient(90deg, rgba(45,212,191,0.45), rgba(56,189,248,0.34), rgba(246,184,75,0.20), rgba(45,212,191,0.45))" }}
            />
            {flow.map((item, index) => (
              <div className="relative min-w-0" key={item.title}>
                <span
                  className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border text-[20px]"
                  style={{
                    background:
                      index === 2
                        ? "linear-gradient(135deg, rgba(56,189,248,0.24), rgba(246,184,75,0.10))"
                        : "linear-gradient(135deg, rgba(45,212,191,0.20), rgba(56,189,248,0.08))",
                    borderColor: "rgba(148,203,226,0.26)",
                    color: index === 2 ? "#7DD3FC" : marketingTone.teal,
                  }}
                >
                  <MarketingIcon name={item.icon} />
                </span>
                <p className="mt-5 text-[11px] font-black uppercase tracking-[0.14em]" style={{ color: marketingTone.teal }}>
                  {item.kicker}
                </p>
                <h3 className="mt-2 text-[18px] font-black" style={{ color: marketingTone.text }}>
                  {item.title}
                </h3>
                <p className="mt-3 max-w-[29ch] text-[13px] leading-6" style={{ color: marketingTone.soft }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </MarketingShell>
    </section>
  );
}

function CommandCenterMock({
  copy,
}: Readonly<{ copy: HomeCopy["commandCenter"]["mock"] }>) {
  return (
    <div className="grid gap-4 lg:grid-cols-[0.82fr_1.2fr_0.72fr]">
      <div className="rounded-[16px] border p-4" style={{ backgroundColor: "rgba(255,255,255,0.032)", borderColor: marketingTone.border }}>
        <div className="flex items-center justify-between">
          <h3 className="text-[14px] font-black" style={{ color: marketingTone.text }}>
            {copy.leadQueueTitle}
          </h3>
          <span className="text-[11px]" style={{ color: marketingTone.blue }}>
            {copy.leadCount}
          </span>
        </div>
        <div className="mt-3 grid gap-2">
          {copy.queue.map((lead) => (
            <div
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-[11px] border p-2.5"
              key={lead.customer}
              style={{ backgroundColor: "rgba(255,255,255,0.035)", borderColor: marketingTone.border }}
            >
              <div className="min-w-0">
                <p className="truncate text-[12px] font-black" style={{ color: marketingTone.text }}>
                  {lead.customer}
                </p>
                <p className="truncate text-[10px]" style={{ color: marketingTone.muted }}>
                  {lead.detail}
                </p>
              </div>
              <StatusPill status={lead.status} tone={lead.tone} />
            </div>
          ))}
        </div>
      </div>

      <div
        className="rounded-[18px] border p-4"
        style={{
          background:
            "radial-gradient(circle at 98% 0%, rgba(226,232,240,0.13), transparent 12rem), linear-gradient(135deg, rgba(37,43,46,0.50), rgba(10,22,34,0.95) 44%, rgba(6,13,21,0.96))",
          borderColor: "rgba(148,203,226,0.22)",
        }}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-[14px] font-black" style={{ color: marketingTone.text }}>
              {copy.deskTitle}
            </h3>
            <p className="mt-1 text-[12px]" style={{ color: marketingTone.soft }}>
              {copy.deskSubtitle}
            </p>
          </div>
          <StatusPill status={copy.ownerReviewStatus} tone="new" />
        </div>
        <div className="mt-4 grid gap-3">
          <div className="rounded-[12px] border p-4" style={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: marketingTone.border }}>
            <p className="text-[12px] font-black" style={{ color: marketingTone.text }}>
              {copy.summaryLabel}
            </p>
            <p className="mt-2 text-[12px] leading-5" style={{ color: marketingTone.soft }}>
              {copy.summary}
            </p>
          </div>
          <div
            className="rounded-[12px] border p-4"
            style={{
              background:
                "linear-gradient(135deg, rgba(37,43,46,0.46), rgba(26,32,37,0.72) 45%, rgba(13,19,26,0.88))",
              borderColor: "rgba(148,203,226,0.20)",
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-[12px] font-black" style={{ color: marketingTone.text }}>
                {copy.draftLabel}
              </p>
              <StatusPill status={copy.aiDraftStatus} tone="draft" />
            </div>
            <p className="mt-2 text-[12px] leading-5" style={{ color: marketingTone.soft }}>
              {copy.draft}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {copy.tags.map((item) => (
              <span className="rounded-full border px-2.5 py-1 text-[10px]" key={item} style={{ borderColor: marketingTone.border, color: marketingTone.soft }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {copy.actions.map(({ body, title }, index) => (
          <div
            className="rounded-[14px] border p-4"
            key={title}
            style={{
              background:
                index === 0
                  ? "linear-gradient(135deg, rgba(45,212,191,0.16), rgba(56,189,248,0.06))"
                  : "rgba(255,255,255,0.03)",
              borderColor: index === 0 ? "rgba(45,212,191,0.24)" : marketingTone.border,
            }}
          >
            <p className="text-[13px] font-black" style={{ color: index === 0 ? marketingTone.teal : marketingTone.text }}>
              {title}
            </p>
            <p className="mt-2 text-[12px] leading-5" style={{ color: marketingTone.soft }}>
              {body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommandCenterSection({
  copy,
}: Readonly<{ copy: HomeCopy["commandCenter"] }>) {
  return (
    <section className="px-5 py-7 sm:px-6">
      <MarketingShell>
        <div
          className="overflow-hidden rounded-[22px] border p-5 sm:p-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(7,16,25,0.96), rgba(13,19,26,0.96) 48%, rgba(37,43,46,0.44))",
            borderColor: "rgba(148,203,226,0.18)",
          }}
        >
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: marketingTone.teal }}>
                {copy.eyebrow}
              </p>
              <h2 className="mt-3 text-[26px] font-black leading-[1.12] sm:text-[34px]" style={{ color: marketingTone.text }}>
                {copy.title}
              </h2>
            </div>
            <p className="max-w-[520px] text-[14px] leading-7" style={{ color: marketingTone.soft }}>
              {copy.body}
            </p>
          </div>
          <CommandCenterMock copy={copy.mock} />
        </div>
      </MarketingShell>
    </section>
  );
}

function BeforeAfterSection({
  copy,
}: Readonly<{ copy: HomeCopy["beforeAfter"] }>) {
  return (
    <section className="px-5 py-7 sm:px-6" id="comparison">
      <MarketingShell>
        <div
          className="overflow-hidden rounded-[20px] border p-6 sm:p-8"
          style={{
            background:
              "radial-gradient(circle at 76% 10%, rgba(226,232,240,0.08), transparent 12rem), linear-gradient(135deg, rgba(48,55,58,0.56), rgba(10,22,34,0.94) 44%, rgba(12,25,38,0.94))",
            borderColor: "rgba(148,203,226,0.18)",
          }}
        >
          <div className="grid gap-7 lg:grid-cols-[minmax(0,0.94fr)_88px_minmax(0,1.06fr)] lg:items-center">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: marketingTone.red }}>
                {copy.beforeLabel}
              </p>
              <h2 className="mt-3 text-[28px] font-black leading-tight" style={{ color: marketingTone.text }}>
                {copy.beforeTitle}
              </h2>
              <div className="mt-5 grid gap-2">
                {copy.beforeItems.map((item) => (
                  <div
                    className="flex items-center gap-3 rounded-[12px] border px-4 py-2.5 text-[13px]"
                    key={item}
                    style={{ backgroundColor: "rgba(255,95,102,0.07)", borderColor: "rgba(255,95,102,0.18)", color: marketingTone.soft }}
                  >
                    <span style={{ color: marketingTone.red }}>
                      <MarketingIcon name="x" />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full border text-[22px] sm:h-20 sm:w-20 sm:text-[28px]"
                style={{
                  background: "linear-gradient(135deg, rgba(56,189,248,0.18), rgba(246,184,75,0.10))",
                  borderColor: "rgba(148,203,226,0.24)",
                  color: marketingTone.teal,
                }}
              >
                <MarketingIcon name="arrow" />
              </div>
            </div>

            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: marketingTone.teal }}>
                {copy.afterLabel}
              </p>
              <h2 className="mt-3 text-[28px] font-black leading-tight" style={{ color: marketingTone.text }}>
                {copy.afterTitle}
              </h2>
              <div className="mt-5 grid gap-2">
                <div
                  className="hidden px-3 text-[10px] font-black uppercase tracking-[0.14em] sm:grid sm:grid-cols-[0.55fr_1fr]"
                  style={{ color: marketingTone.muted }}
                >
                  <span>{copy.recoveredDetailHeader}</span>
                  <span>{copy.serviceActionHeader}</span>
                </div>
                {copy.afterItems.map((item) => (
                  <div
                    className="grid gap-1.5 rounded-[12px] border px-4 py-2.5 text-[13px] sm:grid-cols-[0.48fr_1fr] sm:items-center"
                    key={item.detail}
                    style={{ backgroundColor: "rgba(45,212,191,0.075)", borderColor: "rgba(45,212,191,0.20)", color: marketingTone.soft }}
                  >
                    <span className="flex items-center gap-2 font-black" style={{ color: marketingTone.teal }}>
                      <MarketingIcon name="check" />
                      {item.detail}
                    </span>
                    <span>
                      {item.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </MarketingShell>
    </section>
  );
}

function TrustStrip({ copy }: Readonly<{ copy: HomeCopy["trust"] }>) {
  const icons: readonly MarketingIconName[] = [
    "user",
    "calendar",
    "briefcase",
    "shield",
    "lock",
  ];
  const items = copy.items.map((item, index) => ({
    ...item,
    icon: icons[index] ?? "shield",
  }));

  return (
    <section className="px-5 py-7 sm:px-6">
      <MarketingShell>
        <div
          className="overflow-hidden rounded-[18px] border"
          style={{
            background:
              "linear-gradient(90deg, rgba(37,43,46,0.52), rgba(9,20,31,0.88) 36%, rgba(5,12,20,0.94))",
            borderColor: marketingTone.border,
          }}
        >
          <div className="grid lg:grid-cols-[0.7fr_1.3fr]">
            <div className="border-b p-5 lg:border-b-0 lg:border-r" style={{ borderColor: marketingTone.border }}>
              <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: marketingTone.teal }}>
                {copy.eyebrow}
              </p>
              <h2 className="mt-3 text-[24px] font-black leading-tight" style={{ color: marketingTone.text }}>
                {copy.title}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5">
              {items.map((item, index) => (
                <div
                  className="min-w-0 border-b p-4 sm:border-l lg:border-b-0"
                  key={item.title}
                  style={{ borderColor: marketingTone.border }}
                >
                  <div className="grid gap-3">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-[17px]"
                      style={{
                        background:
                          index === 1
                            ? "linear-gradient(135deg, rgba(56,189,248,0.18), rgba(246,184,75,0.08))"
                            : "linear-gradient(135deg, rgba(45,212,191,0.15), rgba(56,189,248,0.05))",
                        color: index === 1 ? "#7DD3FC" : marketingTone.teal,
                      }}
                    >
                      <MarketingIcon name={item.icon} />
                    </span>
                    <h3 className="min-w-0 text-[12px] font-black leading-snug" style={{ color: marketingTone.text }}>
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-[11px] leading-5" style={{ color: marketingTone.muted }}>
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MarketingShell>
    </section>
  );
}

function FinalCtaSection({ copy }: Readonly<{ copy: HomeCopy["finalCta"] }>) {
  return (
    <section className="px-5 py-7 sm:px-6">
      <MarketingShell>
        <MarketingCard
          className="overflow-hidden p-7"
          style={{
            background:
              "radial-gradient(circle at 94% 8%, rgba(226,232,240,0.14), transparent 18rem), radial-gradient(circle at 72% 2%, rgba(246,184,75,0.10), transparent 16rem), linear-gradient(135deg, rgba(37,43,46,0.62), rgba(11,25,37,0.98) 38%, rgba(5,12,20,0.96))",
            borderColor: "rgba(148,203,226,0.22)",
          }}
        >
          <div className="grid min-w-0 items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,390px)]">
            <div className="min-w-0">
              <h2 className="max-w-[620px] text-[26px] font-black leading-[1.12] sm:text-[36px]" style={{ color: marketingTone.text }}>
                {copy.title}
              </h2>
              <p className="mt-5 max-w-[640px] text-[16px] leading-8" style={{ color: marketingTone.soft }}>
                {copy.body}
              </p>
            </div>
            <div className="min-w-0">
              <div className="grid gap-3">
                <MarketingButton className="w-full" href="/auth/sign-up">
                  {copy.primaryCta} <MarketingIcon name="arrow" />
                </MarketingButton>
                <MarketingButton className="w-full" href="/pricing" variant="secondary">
                  {copy.secondaryCta}
                </MarketingButton>
              </div>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[11px]" style={{ color: marketingTone.soft }}>
                {copy.assurances.map((item) => (
                  <span className="flex items-center gap-2" key={item}>
                    <span style={{ color: marketingTone.teal }}>
                      <MarketingIcon name="check" />
                    </span>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </MarketingCard>
      </MarketingShell>
    </section>
  );
}

export default async function HomePage() {
  const language = readSupportedLanguage(
    (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );
  const copy = getHomeCopy(language);

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: marketingBackground, color: marketingTone.text }}>
      <MarketingHeader copy={copy.nav} language={language} redirectPath="/" />
      <HeroSection copy={copy} />
      <MetricStrip copy={copy.metrics} />
      <PainStorySection copy={copy.painStory} />
      <ProblemSection copy={copy.problem} />
      <RecoveryFlowSection copy={copy.recoveryFlow} />
      <InteractiveCleaningDemoSection language={language} />
      <CommandCenterSection copy={copy.commandCenter} />
      <BeforeAfterSection copy={copy.beforeAfter} />
      <TrustStrip copy={copy.trust} />
      <FinalCtaSection copy={copy.finalCta} />
      <MarketingFooter copy={copy.nav} />
    </main>
  );
}
