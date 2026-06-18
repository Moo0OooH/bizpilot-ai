/**
 * ============================================================
 * File: app/page.tsx
 * Project: BizPilot AI
 * Description: Public homepage for cleaning-first lead recovery.
 * Role: Converts cleaning business owners into founder pilot applicants.
 * Related:
 * - components/public/marketing-ui.tsx
 * - lib/i18n/home-copy.ts
 * Author: MoOoH
 * Last Updated: 2026-06-18
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

export const metadata: Metadata = {
  title: "BizPilot AI | Lead Recovery for Cleaning Businesses",
  description:
    "BizPilot AI helps cleaning businesses collect quote requests, organize leads, and draft fast owner-reviewed replies — without auto-sending customer messages.",
};

const problemCards = [
  {
    body: "Quote requests arrive through different channels and are easy to miss.",
    title: "Messages get buried",
  },
  {
    body: "Customers often contact more than one cleaning business.",
    title: "Replies take too long",
  },
  {
    body: "Owners waste time writing the same first reply again and again.",
    title: "No ready response",
  },
] as const;

const solutionCards = [
  {
    body: "Share a simple quote link with customers.",
    title: "Capture quote requests",
  },
  {
    body: "See who needs a reply and what service they requested.",
    title: "Review organized leads",
  },
  {
    body: "Use a professional draft, edit it, and send it manually.",
    title: "Copy AI-drafted replies",
  },
] as const;

const workflowSteps = [
  "Share your BizPilot quote link",
  "Customer submits a request",
  "Lead appears in your dashboard",
  "BizPilot drafts a response",
  "You review and send manually",
] as const;

const aiCanHelp = [
  "Summarizing quote requests",
  "Drafting friendly replies",
  "Suggesting follow-up questions",
  "Improving tone",
  "Creating English or French response drafts",
] as const;

const aiWillNot = [
  "Send messages automatically",
  "Invent prices",
  "Promise availability",
  "Confirm bookings",
  "Replace owner judgment",
] as const;

const cleaningUseCases = [
  "Residential cleaning",
  "Deep cleaning",
  "Move-in / move-out",
  "Office cleaning",
  "Airbnb turnover",
  "Post-construction cleaning",
] as const;

const roadmapCards = [
  "Social captions",
  "Google Business posts",
  "Seasonal campaign ideas",
  "Review responses",
  "Image prompts",
  "Content calendar",
] as const;

const faqItems = [
  {
    answer:
      "No. BizPilot starts as a focused lead recovery workflow for cleaning quote requests, not a full CRM.",
    question: "Is BizPilot a full CRM?",
  },
  {
    answer:
      "No. In the first pilot, BizPilot drafts replies and the owner reviews, edits, copies, and sends manually.",
    question: "Does BizPilot send messages automatically?",
  },
  {
    answer:
      "No. BizPilot should not invent prices. It can help ask for the missing details needed before you quote.",
    question: "Can AI create prices for me?",
  },
  {
    answer:
      "BizPilot is built for cleaning businesses first: residential, deep cleaning, move-out, office, Airbnb turnover, and related quote requests.",
    question: "Who is BizPilot for first?",
  },
  {
    answer:
      "The request appears as an organized lead with the service, timing, property details, status, and an owner-reviewed reply draft when enough context is available.",
    question: "What happens when a customer submits a quote request?",
  },
  {
    answer:
      "Later, possibly. The founder pilot is cleaning-only so the workflow can be proven before expanding.",
    question: "Will BizPilot support other industries?",
  },
  {
    answer:
      "Content Studio is a roadmap direction for owner-reviewed posts, updates, campaigns, service descriptions, and visual content briefs. It is not the first pilot promise.",
    question: "What is the future Content Studio?",
  },
] as const;

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

function MiniProductMockup() {
  return (
    <MarketingCard
      className="p-4 sm:p-5"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(241,248,247,0.96))",
        borderColor: "rgba(15, 23, 42, 0.10)",
        boxShadow: "0 28px 80px rgba(15,23,42,0.16)",
      }}
    >
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <p className="text-[12px] font-black uppercase tracking-[0.14em] text-teal-700">
            New quote request
          </p>
          <h3 className="mt-1 text-[22px] font-black text-slate-950">
            Maria L.
          </h3>
        </div>
        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[12px] font-black text-amber-700">
          Needs reply
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {[
          ["Service", "Move-out cleaning"],
          ["Property", "2 bed / 1 bath"],
          ["Timing", "Saturday morning"],
          ["Status", "Needs reply"],
        ].map(([label, value]) => (
          <div className="rounded-[10px] border border-slate-200 bg-white p-3" key={label}>
            <p className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">
              {label}
            </p>
            <p className="mt-1 text-[14px] font-black text-slate-950">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-[14px] border border-teal-200 bg-teal-50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[13px] font-black text-slate-950">AI draft card</p>
          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black text-teal-700">
            AI drafts. You send.
          </span>
        </div>
        <p className="mt-3 text-[14px] leading-6 text-slate-700">
          Hi Maria, thanks for reaching out. I can help with your move-out
          cleaning. Could you confirm the address area and whether appliances
          need cleaning so I can prepare an accurate quote?
        </p>
        <button
          className="mt-4 inline-flex h-10 items-center justify-center rounded-[10px] bg-slate-950 px-4 text-[13px] font-black text-white"
          type="button"
        >
          Copy reply
        </button>
      </div>
    </MarketingCard>
  );
}

function HeroSection() {
  return (
    <section className="px-5 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:pb-28 lg:pt-20">
      <MarketingShell>
        <div className="grid min-w-0 items-center gap-10 lg:grid-cols-[minmax(0,0.94fr)_minmax(360px,0.86fr)]">
          <div className="min-w-0">
            <MarketingBadge>Built for cleaning businesses first</MarketingBadge>
            <h1
              className="mt-6 max-w-[820px] text-[42px] font-black leading-[1.02] sm:text-[58px] lg:text-[66px]"
              style={{ color: marketingTone.text }}
            >
              Stop losing cleaning quote requests to slow replies.
            </h1>
            <p
              className="mt-6 max-w-[690px] text-[17px] leading-8 sm:text-[19px]"
              style={{ color: marketingTone.soft }}
            >
              BizPilot helps cleaning businesses collect quote requests,
              organize leads, and draft fast owner-reviewed replies - so owners
              can respond faster without giving up control.
            </p>
            <div className="mt-8 flex flex-col gap-3 min-[460px]:flex-row">
              <MarketingButton href="/pilot">Join founder pilot</MarketingButton>
              <MarketingButton href="#demo" variant="secondary">
                Watch demo
              </MarketingButton>
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              {[
                "No auto-send",
                "Owner-reviewed AI drafts",
                "Manual copy/send workflow",
              ].map((item) => (
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
          <MiniProductMockup />
        </div>
      </MarketingShell>
    </section>
  );
}

function CardGrid({
  items,
}: Readonly<{ items: ReadonlyArray<Readonly<{ body: string; title: string }>> }>) {
  return (
    <div className="mt-8 grid gap-4 md:grid-cols-3">
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

function ProductPreview() {
  const demoSteps = [
    {
      body: '"Hi, how much for a move-out clean before Friday?"',
      title: "Customer request",
    },
    {
      body: "Service: Move-out cleaning. Timing: Before Friday. Status: Needs reply.",
      title: "Lead organized",
    },
    {
      body: "Square footage, appliances, access notes.",
      title: "Missing details",
    },
    {
      body: "Sarah needs a move-out cleaning before Friday, but pricing would be risky without square footage, appliance details, and access notes.",
      title: "AI summary",
    },
    {
      body: "Hi Sarah, thanks for reaching out. We can help with move-out cleaning. Could you please confirm the approximate square footage, whether appliances need interior cleaning, and any access notes?",
      title: "Draft reply",
    },
    {
      body: "Owner edits if needed.",
      title: "Owner review",
    },
    {
      body: "Owner copies and sends from their own channel. Lead status stays visible.",
      title: "Manual send",
    },
  ] as const;

  return (
    <section className="px-5 py-16 sm:px-6 lg:py-24" id="demo">
      <MarketingShell>
        <SectionTitle
          body="Follow one realistic move-out cleaning request from customer message to owner-reviewed reply. The system organizes the work; the owner stays in control."
          title="See how BizPilot handles a cleaning quote request."
        />
        <div className="mt-8 grid gap-4">
          {demoSteps.map((step, index) => (
            <MarketingCard className="p-5 sm:p-6" key={step.title}>
              <div className="grid gap-4 sm:grid-cols-[80px_minmax(0,1fr)] sm:items-start">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#2563EB] text-[14px] font-black text-white sm:h-14 sm:w-14">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-[19px] font-black" style={{ color: marketingTone.text }}>
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-7" style={{ color: marketingTone.soft }}>
                    {step.body}
                  </p>
                </div>
              </div>
            </MarketingCard>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {["No auto-send", "No invented price"].map((item) => (
            <span className="rounded-full border px-4 py-2 text-[13px] font-black" key={item} style={{ borderColor: marketingTone.border, color: marketingTone.teal }}>
              {item}
            </span>
          ))}
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
  const language = readSupportedLanguage(
    (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );
  const navCopy = getHomeCopy(language).nav;

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: marketingBackground, color: marketingTone.text }}>
      <MarketingHeader copy={navCopy} language={language} redirectPath="/" />
      <HeroSection />

      <section className="px-5 py-16 sm:px-6 lg:py-24" id="features">
        <MarketingShell>
          <SectionTitle
            body="Cleaning owners receive quote requests while working, driving, managing a team, or answering customers. When messages get buried or replies are delayed, customers move on."
            eyebrow="Problem"
            title="Your next customer may already be waiting."
          />
          <CardGrid items={problemCards} />
        </MarketingShell>
      </section>

      <section className="px-5 py-16 sm:px-6 lg:py-24" id="cleaning">
        <MarketingShell>
          <SectionTitle
            eyebrow="Solution"
            title="A simple lead recovery system for cleaning businesses."
          />
          <CardGrid items={solutionCards} />
        </MarketingShell>
      </section>

      <section className="px-5 py-16 sm:px-6 lg:py-24">
        <MarketingShell>
          <SectionTitle eyebrow="How it works" title="Five steps, no hidden automation." />
          <div className="mt-8 grid gap-3 lg:grid-cols-5">
            {workflowSteps.map((step, index) => (
              <MarketingCard className="p-5" key={step}>
                <p className="text-[12px] font-black uppercase tracking-[0.14em]" style={{ color: marketingTone.teal }}>
                  Step {index + 1}
                </p>
                <p className="mt-3 text-[16px] font-black leading-6" style={{ color: marketingTone.text }}>
                  {step}
                </p>
              </MarketingCard>
            ))}
          </div>
        </MarketingShell>
      </section>

      <ProductPreview />

      <section className="px-5 py-16 sm:px-6 lg:py-24" id="trust">
        <MarketingShell>
          <SectionTitle
            body="BizPilot does not automatically send customer messages in the first pilot. AI helps prepare replies, but every message is reviewed, edited, and sent manually by the owner."
            eyebrow="Manual-first AI"
            title="AI drafts. You decide."
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <ListColumn items={aiCanHelp} title="AI can help with" tone="good" />
            <ListColumn items={aiWillNot} title="AI will not" tone="limit" />
          </div>
        </MarketingShell>
      </section>

      <section className="px-5 py-16 sm:px-6 lg:py-24">
        <MarketingShell>
          <SectionTitle title="Built around real cleaning quote requests." />
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cleaningUseCases.map((item) => (
              <MarketingCard className="p-5" key={item}>
                <p className="text-[16px] font-black" style={{ color: marketingTone.text }}>
                  {item}
                </p>
              </MarketingCard>
            ))}
          </div>
        </MarketingShell>
      </section>

      <section className="px-5 py-16 sm:px-6 lg:py-24">
        <MarketingShell>
          <MarketingCard className="p-6 sm:p-8">
            <MarketingBadge toneName="gold">Roadmap</MarketingBadge>
            <h2 className="mt-5 max-w-[820px] text-[30px] font-black leading-[1.08] sm:text-[40px]" style={{ color: marketingTone.text }}>
              More than lead replies - future growth content for your business.
            </h2>
            <p className="mt-5 max-w-[860px] text-[16px] leading-8" style={{ color: marketingTone.soft }}>
              BizPilot is being designed to help local service businesses create owner-reviewed social posts, Google Business updates, follow-up campaigns, service descriptions, seasonal promotions, and visual content briefs.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {roadmapCards.map((item) => (
                <div className="rounded-[10px] border px-4 py-3 text-[14px] font-black" key={item} style={{ borderColor: marketingTone.border, color: marketingTone.soft }}>
                  {item}
                </div>
              ))}
            </div>
          </MarketingCard>
        </MarketingShell>
      </section>

      <section className="px-5 py-16 sm:px-6 lg:py-24">
        <MarketingShell>
          <SectionTitle eyebrow="FAQ" title="Straight answers for the founder pilot." />
          <div className="mx-auto mt-8 grid max-w-[900px] gap-3">
            {faqItems.map((item) => (
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

      <section className="px-5 py-16 sm:px-6 lg:py-24" id="pilot">
        <MarketingShell>
          <MarketingCard className="p-7 sm:p-9" style={{ borderColor: "rgba(45,212,191,0.24)" }}>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <h2 className="text-[30px] font-black leading-[1.08] sm:text-[42px]" style={{ color: marketingTone.text }}>
                  Join the founder pilot for cleaning businesses.
                </h2>
                <p className="mt-4 max-w-[720px] text-[16px] leading-8" style={{ color: marketingTone.soft }}>
                  We&apos;re starting with a small group of cleaning businesses to test the workflow, improve the product, and build around real owner feedback.
                </p>
                <p className="mt-4 text-[13px] font-black" style={{ color: marketingTone.teal }}>
                  Limited pilot. Manual onboarding. No auto-send.
                </p>
              </div>
              <MarketingButton href="/pilot">
                Apply for founder pilot <MarketingIcon name="arrow" />
              </MarketingButton>
            </div>
          </MarketingCard>
        </MarketingShell>
      </section>

      <MarketingFooter copy={navCopy} />
    </main>
  );
}
