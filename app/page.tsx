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
 * Last Updated: 2026-05-21
 * ============================================================
 */

import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "BizPilot AI - Quote Recovery for Cleaning Businesses",
  description:
    "BizPilot captures cleaning quote requests, organizes every lead, drafts owner-reviewed replies, and keeps follow-ups visible without auto-sending anything.",
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

function LeadRow({ item }: Readonly<{ item: LeadItem }>) {
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
          From: {item.source}
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

function HeroDesk() {
  const leads: ReadonlyArray<LeadItem> = [
    {
      customer: "Sarah M.",
      detail: "House cleaning - 2 bed / 1 bath",
      source: "Instagram",
      status: "New",
      time: "2m ago",
      tone: "new",
    },
    {
      customer: "David L.",
      detail: "Deep clean - Apartment",
      source: "Web form",
      status: "Info needed",
      time: "21m ago",
      tone: "info",
    },
    {
      customer: "Emily R.",
      detail: "Move-out clean",
      source: "Google Business",
      status: "Draft ready",
      time: "42m ago",
      tone: "draft",
    },
    {
      customer: "Michelle T.",
      detail: "Office cleaning - Weekly",
      source: "Facebook",
      status: "Replied",
      time: "1h ago",
      tone: "replied",
    },
  ];

  return (
    <MarketingCard
      className="overflow-hidden p-3"
      style={{
        background:
          "radial-gradient(circle at 4% 0%, rgba(45,212,191,0.16), transparent 22rem), linear-gradient(145deg, rgba(10,23,35,0.96), rgba(5,12,20,0.96))",
        borderColor: "rgba(45,212,191,0.22)",
      }}
    >
      <div className="flex items-center gap-2 px-1 pb-3">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: marketingTone.emerald }} />
        <p className="text-[13px] font-black" style={{ color: marketingTone.text }}>
          Live Recovery Desk
        </p>
      </div>

        <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="grid gap-2.5">
          {leads.map((lead) => (
            <LeadRow item={lead} key={lead.customer} />
          ))}
          <div className="rounded-[10px] border px-3 py-2 text-center text-[11px] font-bold" style={{ borderColor: marketingTone.border, color: marketingTone.soft }}>
            View all leads
          </div>
        </div>

        <div
          className="rounded-[13px] border p-3"
          style={{
            background:
              "radial-gradient(circle at 96% 4%, rgba(226,232,240,0.20), transparent 10rem), radial-gradient(circle at 88% 16%, rgba(246,184,75,0.16), transparent 9rem), linear-gradient(135deg, #252B2E 0%, #1A2025 45%, #0D131A 100%)",
            borderColor: "rgba(148,203,226,0.30)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.05), 0 0 1px rgba(34,211,238,0.08), 0 0 34px rgba(56,189,248,0.08)",
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-[15px] font-black" style={{ color: marketingTone.text }}>
              Suggested reply
            </h3>
            <StatusPill status="AI draft" tone="new" />
          </div>
          <div className="mt-3 space-y-2.5 text-[11.5px] leading-5" style={{ color: marketingTone.soft }}>
            <p>Hi Sarah,</p>
            <p>Thanks for reaching out. I would be happy to help with your house cleaning.</p>
            <p>To prepare an accurate quote, could you share:</p>
            <ul className="ml-4 list-disc space-y-0.5">
              <li>Approx. home size?</li>
              <li>Preferred cleaning frequency?</li>
              <li>Any priority areas?</li>
            </ul>
            <p>Once I have those details, I can send a tailored quote.</p>
            <p>Best regards,<br />Clean Team</p>
          </div>
          <div className="mt-4 grid gap-2">
            <MarketingButton className="h-9 w-full text-[11.5px]" href="/auth/sign-up">
              Review reply
            </MarketingButton>
            <div className="grid gap-2 min-[520px]:grid-cols-2">
              <button
                className="h-9 rounded-[9px] border text-[11px] font-black"
                style={{ borderColor: marketingTone.borderStrong, color: marketingTone.text }}
                type="button"
              >
                Copy response
              </button>
              <button
                className="h-9 rounded-[9px] border text-[11px] font-black"
                style={{ borderColor: marketingTone.borderStrong, color: marketingTone.text }}
                type="button"
              >
                Mark contacted
              </button>
            </div>
          </div>
        </div>
      </div>
    </MarketingCard>
  );
}

function HeroSection() {
  return (
    <section className="px-0 pb-5 pt-6">
      <MarketingShell>
        <div className="grid min-w-0 items-center gap-7 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
          <div>
            <MarketingBadge>For cleaning teams</MarketingBadge>
            <h1 className="mt-5 max-w-[560px] text-[34px] font-black leading-[1.08] sm:text-[38px] xl:text-[40px]" style={{ color: marketingTone.text }}>
              Stop losing cleaning jobs to slow replies.
            </h1>
            <p className="mt-4 max-w-[540px] text-[14.5px] leading-7" style={{ color: marketingTone.soft }}>
              BizPilot captures quote requests, organizes every lead, and drafts owner-reviewed replies and follow-ups so cleaning businesses can respond faster without auto-sending anything.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <MarketingButton href="/auth/sign-up">
                Start free recovery <MarketingIcon name="arrow" />
              </MarketingButton>
              <MarketingButton href="#recovery-flow" variant="secondary">
                See how it works
              </MarketingButton>
            </div>
            <div className="mt-5 grid gap-2.5 text-[12px]" style={{ color: marketingTone.soft }}>
              {[
                "Works with quote requests from multiple channels",
                "AI drafts stay in your control",
                "No auto-send, no fake pricing",
              ].map((item) => (
                <span className="flex items-center gap-3" key={item}>
                  <span className="text-[#2DD4BF]">
                    <MarketingIcon name="check" />
                  </span>
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="min-w-0 lg:justify-self-end">
            <HeroDesk />
          </div>
        </div>
      </MarketingShell>
    </section>
  );
}

function MetricStrip() {
  const metrics: ReadonlyArray<Readonly<{ icon: MarketingIconName; label: string; note: string; tone: LeadTone; value: string }>> = [
    { icon: "radar", label: "Quote requests organized", note: "From all your channels", tone: "draft", value: "12" },
    { icon: "briefcase", label: "Replies drafted", note: "Ready for your review", tone: "new", value: "8" },
    { icon: "target", label: "Leads at risk", note: "Need your follow-up", tone: "risk", value: "3" },
    { icon: "copy", label: "Auto-send messages", note: "You are in control", tone: "draft", value: "0" },
  ];
  const primary = metrics[0]!;
  const secondary = metrics.slice(1);

  return (
    <section className="px-5 pb-6 sm:px-6">
      <div
        className="mx-auto grid w-full max-w-[1180px] overflow-hidden rounded-[18px] border lg:grid-cols-[1.15fr_1.85fr]"
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
            Recovery snapshot
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

function ProblemSection() {
  const problems: ReadonlyArray<ProblemItem> = [
    {
      body: "A quote request comes in. A competitor replies first.",
      icon: "clock",
      title: "Slow reply",
      tone: "risk",
    },
    {
      body: "Instagram, Google, text, and email stay scattered.",
      icon: "inbox",
      title: "Inbox chaos",
      tone: "draft",
    },
    {
      body: "No size, date, access, or priority details.",
      icon: "warning",
      title: "Missing info",
      tone: "info",
    },
    {
      body: "The customer moves on and nobody notices.",
      icon: "radar",
      title: "Quiet loss",
      tone: "draft",
    },
  ];

  return (
    <section className="px-5 py-7 sm:px-6" id="why">
      <MarketingShell>
        <div className="grid gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: marketingTone.teal }}>
              The leak map
            </p>
            <h2 className="mt-3 max-w-[520px] text-[30px] font-black leading-[1.1] sm:text-[34px]" style={{ color: marketingTone.text }}>
              The problem is not demand. It is <span style={{ color: marketingTone.emerald }}>response chaos.</span>
            </h2>
            <p className="mt-4 max-w-[50ch] text-[14.5px] leading-7" style={{ color: marketingTone.soft }}>
              Cleaning leads usually do not disappear at one dramatic moment. They leak through small gaps: delay, scattered channels, missing details, and forgotten follow-up.
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

function RecoveryFlowSection() {
  const flow: ReadonlyArray<FlowItem> = [
    {
      body: "One clean intake path from website, Instagram, Google, email, or saved replies.",
      icon: "link",
      kicker: "Capture",
      title: "Quote link",
    },
    {
      body: "Every request lands with source, status, missing details, and urgency.",
      icon: "inbox",
      kicker: "Organize",
      title: "Recovery queue",
    },
    {
      body: "The assistant drafts the reply while the owner keeps final approval.",
      icon: "pen",
      kicker: "Draft",
      title: "Approved reply",
    },
    {
      body: "Quiet leads stay visible so the next manual touch is obvious.",
      icon: "target",
      kicker: "Recover",
      title: "Follow-up radar",
    },
  ];

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
            <h2 className="max-w-[760px] text-[30px] font-black leading-[1.12]" style={{ color: marketingTone.text }}>
              One operational loop, built to keep warm leads moving.
            </h2>
            <MarketingBadge toneName="blue">Recovery loop</MarketingBadge>
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

function CommandCenterMock() {
  const queue: ReadonlyArray<LeadItem> = [
    { customer: "Sarah M.", detail: "New request - 2m ago", source: "Instagram", status: "New", time: "", tone: "new" },
    { customer: "David L.", detail: "Missing info - 21m ago", source: "Web form", status: "Info needed", time: "", tone: "info" },
    { customer: "Emily R.", detail: "Draft ready - 42m ago", source: "Google", status: "Draft ready", time: "", tone: "draft" },
    { customer: "Michelle T.", detail: "Replied - 1h ago", source: "Facebook", status: "Replied", time: "", tone: "replied" },
    { customer: "Jason P.", detail: "At risk - 2h ago", source: "Website", status: "At risk", time: "", tone: "risk" },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-[0.82fr_1.2fr_0.72fr]">
      <div className="rounded-[16px] border p-4" style={{ backgroundColor: "rgba(255,255,255,0.032)", borderColor: marketingTone.border }}>
        <div className="flex items-center justify-between">
          <h3 className="text-[14px] font-black" style={{ color: marketingTone.text }}>
            Lead queue
          </h3>
          <span className="text-[11px]" style={{ color: marketingTone.blue }}>
            12 leads
          </span>
        </div>
        <div className="mt-3 grid gap-2">
          {queue.map((lead) => (
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
              AI response desk
            </h3>
            <p className="mt-1 text-[12px]" style={{ color: marketingTone.soft }}>
              Sarah M. - House cleaning
            </p>
          </div>
          <StatusPill status="Owner review" tone="new" />
        </div>
        <div className="mt-4 grid gap-3">
          <div className="rounded-[12px] border p-4" style={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: marketingTone.border }}>
            <p className="text-[12px] font-black" style={{ color: marketingTone.text }}>
              Summary
            </p>
            <p className="mt-2 text-[12px] leading-5" style={{ color: marketingTone.soft }}>
              2 bed / 1 bath house. Looking for regular cleaning. Dog at home. Needs a quote before the weekend.
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
                Draft reply
              </p>
              <StatusPill status="AI draft" tone="draft" />
            </div>
            <p className="mt-2 text-[12px] leading-5" style={{ color: marketingTone.soft }}>
              Hi Sarah, thanks for reaching out. Could you share your home size, preferred frequency, and any priority areas so I can prepare an accurate cleaning quote?
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Home size", "Frequency", "Priority areas", "Parking"].map((item) => (
              <span className="rounded-full border px-2.5 py-1 text-[10px]" key={item} style={{ borderColor: marketingTone.border, color: marketingTone.soft }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {[
          ["Review reply", "Owner checks the draft first."],
          ["Copy response", "Send through the real channel."],
          ["Mark contacted", "Keep the follow-up state clean."],
        ].map(([title, body], index) => (
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

function CommandCenterSection() {
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
                Command center
              </p>
              <h2 className="mt-3 text-[30px] font-black leading-[1.12] sm:text-[34px]" style={{ color: marketingTone.text }}>
                Quote Recovery Desk
              </h2>
            </div>
            <p className="max-w-[520px] text-[14px] leading-7" style={{ color: marketingTone.soft }}>
              One cockpit for the lead, the missing details, the owner-reviewed draft, and the next manual action.
            </p>
          </div>
          <CommandCenterMock />
        </div>
      </MarketingShell>
    </section>
  );
}

function BeforeAfterSection() {
  const before = [
    "Leads slip through the cracks",
    "No structured intake",
    "No follow-up reminders",
    "No visibility or reliability",
  ];
  const after = [
    "Leads organized in one recovery queue",
    "Missing details highlighted",
    "Owner-reviewed AI reply ready",
    "Manual follow-up stays visible",
  ];

  return (
    <section className="px-5 py-7 sm:px-6" id="comparison">
      <MarketingShell>
        <MarketingCard className="overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="grid gap-5 border-b p-6 lg:border-b-0 lg:border-r" style={{ borderColor: marketingTone.border }}>
              <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_190px] md:items-center">
                <div>
                  <h3 className="text-[22px] font-black" style={{ color: marketingTone.red }}>
                    Before BizPilot
                  </h3>
                  <div className="mt-4 grid gap-3 text-[14px]" style={{ color: marketingTone.soft }}>
                    {before.map((item) => (
                      <span className="flex items-center gap-3" key={item}>
                        <span style={{ color: marketingTone.red }}>
                          <MarketingIcon name="x" />
                        </span>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div
                  className="relative min-h-[128px] rounded-[13px] border p-4"
                  style={{
                    background: "linear-gradient(135deg, rgba(84,167,255,0.12), rgba(255,95,102,0.10))",
                    borderColor: marketingTone.border,
                  }}
                >
                  <div className="absolute left-4 top-5 h-4 w-20 rounded bg-white/10" />
                  <div className="absolute left-8 top-11 h-5 w-24 rounded bg-white/10" />
                  <div className="absolute left-4 top-20 h-6 w-34 rounded bg-white/10" />
                  <span className="absolute bottom-4 right-4 rounded-full border px-3 py-1 text-[12px] font-black uppercase" style={{ backgroundColor: "rgba(255,95,102,0.15)", borderColor: "rgba(255,95,102,0.30)", color: marketingTone.red }}>
                    Missed
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-6">
              <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_190px] md:items-center">
                <div>
                  <h3 className="text-[22px] font-black" style={{ color: marketingTone.emerald }}>
                    After BizPilot
                  </h3>
                  <div className="mt-4 grid gap-3 text-[14px]" style={{ color: marketingTone.soft }}>
                    {after.map((item) => (
                      <span className="flex items-center gap-3" key={item}>
                        <span style={{ color: marketingTone.emerald }}>
                          <MarketingIcon name="check" />
                        </span>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div
                  className="relative min-h-[128px] rounded-[13px] border p-4"
                  style={{
                    background: "linear-gradient(135deg, rgba(45,212,191,0.14), rgba(23,212,146,0.12))",
                    borderColor: "rgba(45,212,191,0.26)",
                  }}
                >
                  {[0, 1, 2].map((item) => (
                    <div className="mb-3 flex items-center gap-3" key={item}>
                      <span className="flex h-5 w-5 items-center justify-center rounded" style={{ backgroundColor: "rgba(45,212,191,0.18)", color: marketingTone.teal }}>
                        <MarketingIcon name="check" />
                      </span>
                      <span className="h-3 w-24 rounded bg-white/14" />
                    </div>
                  ))}
                  <span className="absolute bottom-4 right-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: "linear-gradient(135deg, #2DD4BF, #17D492)", color: "#03130C" }}>
                    <MarketingIcon name="check" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </MarketingCard>
      </MarketingShell>
    </section>
  );
}

function TrustStrip() {
  const items: ReadonlyArray<Readonly<{ body: string; icon: MarketingIconName; title: string }>> = [
    { body: "We set everything up for you.", icon: "user", title: "Founder-led setup" },
    { body: "Try it. See value. Decide.", icon: "calendar", title: "14-day no-risk pilot" },
    { body: "One focus. One outcome.", icon: "briefcase", title: "Cleaning-first setup" },
    { body: "You review, copy, and send.", icon: "shield", title: "AI owner control" },
    { body: "You stay in control.", icon: "lock", title: "No auto-send. No automation." },
  ];

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
                Pilot terms
              </p>
              <h2 className="mt-3 text-[24px] font-black leading-tight" style={{ color: marketingTone.text }}>
                Built to prove value before expanding scope.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5">
              {items.map((item, index) => (
                <div
                  className="min-w-0 border-b p-4 sm:border-l lg:border-b-0"
                  key={item.title}
                  style={{ borderColor: marketingTone.border }}
                >
                  <div className="flex items-center gap-3">
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
                    <h3 className="text-[12px] font-black leading-snug" style={{ color: marketingTone.text }}>
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

function FinalCtaSection() {
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
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_390px]">
            <div>
              <h2 className="max-w-[620px] text-[36px] font-black leading-[1.12]" style={{ color: marketingTone.text }}>
                Turn more cleaning quote requests into real conversations.
              </h2>
              <p className="mt-5 max-w-[640px] text-[16px] leading-8" style={{ color: marketingTone.soft }}>
                Capture requests, ask for missing details, respond faster, and never lose a lead to silence again.
              </p>
            </div>
            <div>
              <div className="grid gap-3">
                <MarketingButton className="w-full" href="/auth/sign-up">
                  Start free recovery <MarketingIcon name="arrow" />
                </MarketingButton>
                <MarketingButton className="w-full" href="/pricing" variant="secondary">
                  See pricing
                </MarketingButton>
              </div>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[11px]" style={{ color: marketingTone.soft }}>
                {["No credit card required", "14-day no-risk pilot", "Cancel anytime"].map((item) => (
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

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: marketingBackground, color: marketingTone.text }}>
      <MarketingHeader />
      <HeroSection />
      <MetricStrip />
      <ProblemSection />
      <RecoveryFlowSection />
      <CommandCenterSection />
      <BeforeAfterSection />
      <TrustStrip />
      <FinalCtaSection />
      <MarketingFooter />
    </main>
  );
}
