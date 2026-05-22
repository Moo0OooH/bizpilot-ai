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
  MarketingSectionTitle,
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
      className="inline-flex shrink-0 items-center rounded-full border px-2 py-1 text-[10px] font-black uppercase leading-none"
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
      className="grid gap-3 rounded-[12px] border p-3 min-[520px]:grid-cols-[minmax(0,1fr)_auto] min-[520px]:items-start"
      style={{ backgroundColor: "rgba(255,255,255,0.035)", borderColor: marketingTone.border }}
    >
      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: selected.accent }} />
          <p className="truncate text-[13px] font-black" style={{ color: marketingTone.text }}>
            {item.customer}
          </p>
        </div>
        <p className="mt-1 truncate text-[11px]" style={{ color: marketingTone.soft }}>
          {item.detail}
        </p>
        <p className="mt-1 truncate text-[10px]" style={{ color: marketingTone.muted }}>
          From: {item.source}
        </p>
      </div>
      <div className="flex items-center justify-between gap-3 min-[520px]:flex-col min-[520px]:items-end">
        <span className="text-[10px] font-bold" style={{ color: marketingTone.muted }}>
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
      className="overflow-hidden p-4"
      style={{
        background:
          "radial-gradient(circle at 4% 0%, rgba(45,212,191,0.16), transparent 22rem), linear-gradient(145deg, rgba(10,23,35,0.96), rgba(5,12,20,0.96))",
        borderColor: "rgba(45,212,191,0.22)",
      }}
    >
      <div className="flex items-center gap-2 px-1 pb-4">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: marketingTone.emerald }} />
        <p className="text-[15px] font-black" style={{ color: marketingTone.text }}>
          Live Recovery Desk
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="grid gap-2.5">
          {leads.map((lead) => (
            <LeadRow item={lead} key={lead.customer} />
          ))}
          <div className="rounded-[10px] border px-3 py-2 text-center text-[11px] font-bold" style={{ borderColor: marketingTone.border, color: marketingTone.soft }}>
            View all leads
          </div>
        </div>

        <div
          className="rounded-[13px] border p-4"
          style={{ backgroundColor: "rgba(255,255,255,0.035)", borderColor: marketingTone.border }}
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-[15px] font-black" style={{ color: marketingTone.text }}>
              Suggested reply
            </h3>
            <StatusPill status="AI draft" tone="new" />
          </div>
          <div className="mt-5 space-y-4 text-[13px] leading-6" style={{ color: marketingTone.soft }}>
            <p>Hi Sarah,</p>
            <p>
              Thanks for reaching out. I would be happy to help with your house cleaning.
            </p>
            <p>To provide an accurate quote, could you share:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Approx. size of your home?</li>
              <li>How often would you like cleaning?</li>
              <li>Any priority areas or special requests?</li>
            </ul>
            <p>Once I have a few details, I can send you a quick, tailored quote.</p>
            <p>Best regards,<br />Clean Team</p>
          </div>
          <div className="mt-5 grid gap-2">
            <MarketingButton className="h-10 w-full text-[12px]" href="/auth/sign-up">
              Review reply
            </MarketingButton>
            <div className="grid gap-2 min-[520px]:grid-cols-2">
              <button
                className="h-10 rounded-[9px] border text-[12px] font-black"
                style={{ borderColor: marketingTone.borderStrong, color: marketingTone.text }}
                type="button"
              >
                Copy response
              </button>
              <button
                className="h-10 rounded-[9px] border text-[12px] font-black"
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
    <section className="px-0 py-12">
      <MarketingShell>
        <div className="grid items-center gap-10 lg:grid-cols-[0.84fr_1.16fr]">
          <div>
            <MarketingBadge>For cleaning teams</MarketingBadge>
            <h1 className="mt-6 max-w-[620px] text-[46px] font-black leading-[1.08]" style={{ color: marketingTone.text }}>
              Stop losing cleaning jobs to slow replies.
            </h1>
            <p className="mt-5 max-w-[560px] text-[17px] leading-8" style={{ color: marketingTone.soft }}>
              BizPilot captures quote requests, organizes every lead, and drafts owner-reviewed replies and follow-ups so cleaning businesses can respond faster without auto-sending anything.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <MarketingButton href="/auth/sign-up">
                Start free recovery <MarketingIcon name="arrow" />
              </MarketingButton>
              <MarketingButton href="#recovery-flow" variant="secondary">
                See how it works
              </MarketingButton>
            </div>
            <div className="mt-7 grid gap-3 text-[13px]" style={{ color: marketingTone.soft }}>
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
          <HeroDesk />
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

  return (
    <section className="px-5 pb-10 sm:px-6">
      <div
        className="mx-auto grid w-full max-w-[1180px] gap-0 overflow-hidden rounded-[14px] border md:grid-cols-2 lg:grid-cols-4"
        style={{
          background: "linear-gradient(180deg, rgba(9,20,31,0.78), rgba(5,12,20,0.86))",
          borderColor: marketingTone.border,
        }}
      >
        {metrics.map((metric, index) => {
          const selected = leadToneStyles[metric.tone];

          return (
            <div
              className="flex min-w-0 items-center gap-4 border-b p-5 lg:border-b-0 lg:border-l lg:first:border-l-0"
              key={metric.label}
              style={{ borderColor: index === 0 ? "transparent" : marketingTone.border }}
            >
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[11px]"
                style={{ backgroundColor: selected.bg, color: selected.text }}
              >
                <MarketingIcon name={metric.icon} />
              </span>
              <div className="min-w-0">
                <p className="text-[30px] font-black leading-none" style={{ color: marketingTone.text }}>
                  {metric.value}
                </p>
                <p className="mt-2 text-[13px] font-black" style={{ color: marketingTone.text }}>
                  {metric.label}
                </p>
                <p className="mt-1 text-[12px]" style={{ color: marketingTone.muted }}>
                  {metric.note}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ProblemSection() {
  const problems: ReadonlyArray<ProblemItem> = [
    {
      body: "A quick response window vanishes. A slower reply feels like a no.",
      icon: "clock",
      title: "Reply delays turn intent into doubt",
      tone: "risk",
    },
    {
      body: "Instagram, Google, text, email. Valuable leads are missed.",
      icon: "inbox",
      title: "Scattered inboxes hide requests",
      tone: "draft",
    },
    {
      body: "No apartment size, no preferred date, no parking. You back and forth.",
      icon: "warning",
      title: "Missing details slow the sale",
      tone: "info",
    },
    {
      body: "The customer moved on. You may never know.",
      icon: "radar",
      title: "No follow-up means quiet loss",
      tone: "draft",
    },
  ];

  return (
    <section className="px-5 py-8 sm:px-6" id="why">
      <MarketingShell>
        <MarketingSectionTitle
          align="center"
          title={
            <>
              The problem is not demand. It is <span style={{ color: marketingTone.emerald }}>response chaos.</span>
            </>
          }
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {problems.map((problem) => {
            const selected = leadToneStyles[problem.tone];

            return (
              <MarketingCard className="p-5" key={problem.title}>
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-[11px]"
                  style={{ backgroundColor: selected.bg, color: selected.text }}
                >
                  <MarketingIcon name={problem.icon} />
                </span>
                <h3 className="mt-5 text-[17px] font-black leading-snug" style={{ color: marketingTone.text }}>
                  {problem.title}
                </h3>
                <p className="mt-3 text-[13px] leading-6" style={{ color: marketingTone.soft }}>
                  {problem.body}
                </p>
              </MarketingCard>
            );
          })}
        </div>
      </MarketingShell>
    </section>
  );
}

function RecoveryFlowSection() {
  const flow: ReadonlyArray<FlowItem> = [
    {
      body: "Automatically pulls DMs, texts, forms into one place.",
      icon: "link",
      kicker: "Capture",
      title: "Smart quote link",
    },
    {
      body: "Every lead with missing info, urgency, and status.",
      icon: "inbox",
      kicker: "Organize",
      title: "Lead recovery queue",
    },
    {
      body: "AI prepares drafts. You edit, refine, and send manually.",
      icon: "pen",
      kicker: "Draft",
      title: "Owner-reviewed AI replies",
    },
    {
      body: "Built-in follow-ups for leads that go quiet.",
      icon: "target",
      kicker: "Recover",
      title: "Follow-up radar",
    },
  ];

  return (
    <section className="px-5 py-10 sm:px-6" id="recovery-flow">
      <MarketingShell>
        <MarketingSectionTitle
          align="center"
          title={
            <>
              A quote recovery system built around <span style={{ color: marketingTone.emerald }}>one operational loop.</span>
            </>
          }
        />
        <div className="mt-8 grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-center">
          {flow.map((item, index) => (
            <div className="contents" key={item.title}>
              <MarketingCard className="p-5">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-[12px]"
                  style={{ backgroundColor: "rgba(45,212,191,0.12)", color: marketingTone.teal }}
                >
                  <MarketingIcon name={item.icon} />
                </span>
                <p className="mt-5 text-[11px] font-black uppercase" style={{ color: marketingTone.teal }}>
                  {item.kicker}
                </p>
                <h3 className="mt-2 text-[17px] font-black" style={{ color: marketingTone.text }}>
                  {item.title}
                </h3>
                <p className="mt-3 text-[13px] leading-6" style={{ color: marketingTone.soft }}>
                  {item.body}
                </p>
              </MarketingCard>
              {index < flow.length - 1 ? (
                <span className="hidden text-center lg:block" style={{ color: marketingTone.teal }}>
                  <MarketingIcon name="arrow" />
                </span>
              ) : null}
            </div>
          ))}
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
    <MarketingCard className="p-4" style={{ background: "linear-gradient(180deg, rgba(10,22,34,0.95), rgba(6,13,21,0.95))" }}>
      <div className="grid gap-4 lg:grid-cols-[0.78fr_1.22fr]">
        <div>
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
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-[10px] border p-2.5"
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
            <div className="rounded-[10px] border px-3 py-2 text-center text-[11px] font-bold" style={{ borderColor: marketingTone.border, color: marketingTone.soft }}>
              View all leads
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-[14px] font-black" style={{ color: marketingTone.text }}>
            AI response desk
          </h3>
          <p className="mt-1 text-[12px]" style={{ color: marketingTone.soft }}>
            Sarah M. - House cleaning
          </p>
          <div className="mt-4 grid gap-3">
            <div className="rounded-[12px] border p-4" style={{ backgroundColor: "rgba(255,255,255,0.035)", borderColor: marketingTone.border }}>
              <p className="text-[12px] font-black" style={{ color: marketingTone.text }}>
                Summary
              </p>
              <p className="mt-2 text-[12px] leading-5" style={{ color: marketingTone.soft }}>
                2 bed / 1 bath house. Looking for regular cleaning. Mentioned dog at home.
              </p>
            </div>
            <div className="rounded-[12px] border p-4" style={{ backgroundColor: "rgba(255,255,255,0.035)", borderColor: marketingTone.border }}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-[12px] font-black" style={{ color: marketingTone.text }}>
                  Draft reply
                </p>
                <StatusPill status="AI draft" tone="new" />
              </div>
              <p className="mt-2 text-[12px] leading-5" style={{ color: marketingTone.soft }}>
                Hi Sarah, thanks for reaching out. I would be happy to help with your home clean and fresh. To give you an accurate quote, could you share how often you would like cleaning and any priority areas?
              </p>
            </div>
            <div className="rounded-[12px] border p-4" style={{ backgroundColor: "rgba(255,255,255,0.035)", borderColor: marketingTone.border }}>
              <p className="text-[12px] font-black" style={{ color: marketingTone.text }}>
                Missing info
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Home size", "Frequency", "Priority areas", "Parking"].map((item) => (
                  <span className="rounded-full border px-2.5 py-1 text-[10px]" key={item} style={{ borderColor: marketingTone.border, color: marketingTone.soft }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-[12px] border p-4" style={{ backgroundColor: "rgba(255,255,255,0.035)", borderColor: marketingTone.border }}>
              <p className="text-[12px] font-black" style={{ color: marketingTone.text }}>
                Suggested next action
              </p>
              <p className="mt-2 text-[12px]" style={{ color: marketingTone.soft }}>
                Ask for home size and cleaning frequency.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-4">
        {["Review reply", "Copy response", "Mark contacted", "Share quote link"].map((item, index) => (
          <button
            className="h-10 rounded-[9px] border text-[12px] font-black"
            key={item}
            style={{
              background: index === 0 ? "linear-gradient(135deg, #2DD4BF 0%, #17D492 100%)" : "transparent",
              borderColor: index === 0 ? "transparent" : marketingTone.borderStrong,
              color: index === 0 ? "#03130C" : marketingTone.text,
            }}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>
    </MarketingCard>
  );
}

function CommandCenterSection() {
  return (
    <section className="px-5 py-10 sm:px-6">
      <MarketingShell>
        <div className="grid items-center gap-9 lg:grid-cols-[0.42fr_0.58fr]">
          <div>
            <p className="text-[12px] font-black uppercase" style={{ color: marketingTone.teal }}>
              Your command center
            </p>
            <h2 className="mt-4 text-[32px] font-black leading-[1.13]" style={{ color: marketingTone.text }}>
              The Quote Recovery Command Desk
            </h2>
            <p className="mt-5 text-[16px] leading-8" style={{ color: marketingTone.soft }}>
              See every new request, understand what is missing, and respond with confidence.
            </p>
            <div className="mt-6 grid gap-3 text-[14px]" style={{ color: marketingTone.soft }}>
              {["All channels in one place", "AI drafts ready to review", "Missing info highlighted", "Follow-up radar built in"].map((item) => (
                <span className="flex items-center gap-3" key={item}>
                  <span style={{ color: marketingTone.teal }}>
                    <MarketingIcon name="check" />
                  </span>
                  {item}
                </span>
              ))}
            </div>
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
    <section className="px-5 py-8 sm:px-6" id="comparison">
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
    { body: "One focus. One outcome.", icon: "briefcase", title: "Built for cleaning businesses first" },
    { body: "You review, copy, and send.", icon: "shield", title: "AI stays under owner control" },
    { body: "You stay in control.", icon: "lock", title: "No auto-send. No automation." },
  ];

  return (
    <section className="px-5 py-8 sm:px-6">
      <MarketingShell>
        <MarketingCard className="grid overflow-hidden md:grid-cols-5">
          {items.map((item, index) => (
            <div
              className="min-w-0 border-b p-5 text-center md:border-b-0 md:border-l md:first:border-l-0"
              key={item.title}
              style={{ borderColor: index === 0 ? "transparent" : marketingTone.border }}
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[12px]" style={{ backgroundColor: "rgba(45,212,191,0.10)", color: marketingTone.teal }}>
                <MarketingIcon name={item.icon} />
              </span>
              <h3 className="mx-auto mt-4 max-w-[190px] text-[14px] font-black leading-snug" style={{ color: marketingTone.text }}>
                {item.title}
              </h3>
              <p className="mt-2 text-[11px] leading-5" style={{ color: marketingTone.muted }}>
                {item.body}
              </p>
            </div>
          ))}
        </MarketingCard>
      </MarketingShell>
    </section>
  );
}

function FinalCtaSection() {
  return (
    <section className="px-5 py-8 sm:px-6">
      <MarketingShell>
        <MarketingCard
          className="overflow-hidden p-7"
          style={{
            background:
              "radial-gradient(circle at 8% 0%, rgba(45,212,191,0.22), transparent 26rem), linear-gradient(135deg, rgba(11,25,37,0.98), rgba(5,12,20,0.96))",
            borderColor: "rgba(45,212,191,0.22)",
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
    <main className="min-h-screen" style={{ background: marketingBackground, color: marketingTone.text }}>
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
