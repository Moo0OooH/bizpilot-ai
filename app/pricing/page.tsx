/**
 * ============================================================
 * File: app/pricing/page.tsx
 * Project: BizPilot AI
 * Description: Public pricing page for founder-led cleaning quote recovery pilots.
 * Role: Presents Phase 18 pricing without adding billing, booking, or automation scope.
 * Related:
 * - docs/gtm/BIZPILOT_GTM_PLAYBOOK_v1.1.md
 * - docs/operations/BIZPILOT_PHASE_18_PILOT_OPERATING_GUIDE_v1.0.md
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
  title: "Pricing - BizPilot AI",
  description:
    "Founder-led pricing for cleaning businesses that want a done-for-you quote recovery system with owner-reviewed AI drafts.",
};

type Plan = Readonly<{
  cta: string;
  description: string;
  features: ReadonlyArray<string>;
  monthly: string;
  name: string;
  recommended?: boolean;
  setup: string;
}>;

const plans: ReadonlyArray<Plan> = [
  {
    cta: "Start founder setup",
    description:
      "For a small cleaning business that wants the quote link, lead queue, and owner-reviewed draft workflow set up cleanly.",
    features: [
      "Branded public quote link",
      "Cleaning services and service areas configured",
      "Lead recovery queue",
      "AI reply drafts you review",
      "Manual follow-up visibility",
      "14-day setup support",
    ],
    monthly: "$49/mo",
    name: "Founder Setup",
    setup: "$199 setup",
  },
  {
    cta: "Choose Founder Plus",
    description:
      "Recommended for owners who want deeper wording, FAQ, and follow-up tuning during the first pilot cycle.",
    features: [
      "Everything in Founder Setup",
      "Reply style and FAQ tuning",
      "Missing-info question review",
      "Quote link placement guidance",
      "Weekly pilot check-in",
      "Priority founder support",
    ],
    monthly: "$79/mo",
    name: "Founder Plus",
    recommended: true,
    setup: "$299 setup",
  },
];

function PricingHero() {
  return (
    <section className="px-5 py-14 sm:px-6">
      <MarketingShell>
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <MarketingBadge>Founder pilot pricing</MarketingBadge>
            <h1 className="mt-6 max-w-[680px] text-[46px] font-black leading-[1.08]" style={{ color: marketingTone.text }}>
              Start with one workflow that can recover real cleaning jobs.
            </h1>
            <p className="mt-5 max-w-[650px] text-[17px] leading-8" style={{ color: marketingTone.soft }}>
              BizPilot is sold as a done-for-you quote recovery system: setup, quote link, organized leads, owner-reviewed AI drafts, and follow-up visibility. No auto-send, no booking system, no bloated CRM.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <MarketingButton href="/auth/sign-up">
                Start free recovery <MarketingIcon name="arrow" />
              </MarketingButton>
              <MarketingButton href="/#recovery-flow" variant="secondary">
                See workflow
              </MarketingButton>
            </div>
          </div>

          <MarketingCard
            className="p-6"
            style={{
              background:
                "radial-gradient(circle at 0% 0%, rgba(45,212,191,0.20), transparent 26rem), linear-gradient(145deg, rgba(10,23,35,0.96), rgba(5,12,20,0.96))",
              borderColor: "rgba(45,212,191,0.24)",
            }}
          >
            <p className="text-[12px] font-black uppercase" style={{ color: marketingTone.teal }}>
              Pilot promise
            </p>
            <h2 className="mt-4 text-[31px] font-black leading-[1.14]" style={{ color: marketingTone.text }}>
              You stay in control of every customer message.
            </h2>
            <div className="mt-6 grid gap-3 text-[14px]" style={{ color: marketingTone.soft }}>
              {[
                "Owner reviews every AI draft",
                "Nothing sends automatically",
                "No invented prices or availability",
                "Setup is guided by the founder",
              ].map((item) => (
                <span className="flex items-center gap-3" key={item}>
                  <span style={{ color: marketingTone.teal }}>
                    <MarketingIcon name="check" />
                  </span>
                  {item}
                </span>
              ))}
            </div>
          </MarketingCard>
        </div>
      </MarketingShell>
    </section>
  );
}

function PlanCard({ plan }: Readonly<{ plan: Plan }>) {
  return (
    <MarketingCard
      className="relative flex h-full flex-col p-6"
      style={
        plan.recommended
          ? {
              background:
                "radial-gradient(circle at 0% 0%, rgba(45,212,191,0.19), transparent 26rem), linear-gradient(180deg, rgba(13,28,42,0.96), rgba(7,16,25,0.92))",
              borderColor: "rgba(45,212,191,0.30)",
            }
          : undefined
      }
    >
      {plan.recommended ? (
        <span
          className="absolute right-5 top-5 rounded-full border px-3 py-1 text-[11px] font-black uppercase"
          style={{
            backgroundColor: "rgba(45,212,191,0.12)",
            borderColor: "rgba(45,212,191,0.30)",
            color: marketingTone.teal,
          }}
        >
          Recommended
        </span>
      ) : null}
      <p className="text-[13px] font-black uppercase" style={{ color: marketingTone.muted }}>
        {plan.name}
      </p>
      <div className="mt-5 flex flex-wrap items-end gap-x-3 gap-y-1">
        <span className="text-[40px] font-black leading-none" style={{ color: marketingTone.text }}>
          {plan.monthly}
        </span>
        <span className="pb-1 text-[14px] font-bold" style={{ color: marketingTone.muted }}>
          {plan.setup}
        </span>
      </div>
      <p className="mt-5 text-[14px] leading-7" style={{ color: marketingTone.soft }}>
        {plan.description}
      </p>
      <ul className="mt-6 grid gap-3">
        {plan.features.map((feature) => (
          <li className="flex items-start gap-3 text-[14px] leading-6" key={feature} style={{ color: marketingTone.soft }}>
            <span className="mt-1 shrink-0" style={{ color: marketingTone.teal }}>
              <MarketingIcon name="check" />
            </span>
            {feature}
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <MarketingButton className="w-full" href="/auth/sign-up" variant={plan.recommended ? "primary" : "secondary"}>
          {plan.cta}
        </MarketingButton>
      </div>
    </MarketingCard>
  );
}

function PricingPlans() {
  return (
    <section className="px-5 py-8 sm:px-6" id="plans">
      <MarketingShell>
        <MarketingSectionTitle
          align="center"
          eyebrow="Simple founder offers"
          lead="The first pilots stay intentionally focused: quote capture, organized leads, safer drafts, and follow-up visibility."
          title="Pricing for cleaning quote recovery."
        />
        <div className="mt-9 grid gap-5 lg:grid-cols-2">
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>
      </MarketingShell>
    </section>
  );
}

function IncludedSection() {
  const items: ReadonlyArray<Readonly<{ body: string; icon: MarketingIconName; title: string }>> = [
    {
      body: "A branded quote page customers can use from your site, Instagram, Google profile, email, or saved reply.",
      icon: "link",
      title: "Quote link setup",
    },
    {
      body: "Every request lands in a clear queue with status, urgency, source, and missing details.",
      icon: "inbox",
      title: "Lead recovery desk",
    },
    {
      body: "BizPilot prepares replies and follow-ups. The owner reviews, edits, copies, and sends manually.",
      icon: "pen",
      title: "Owner-reviewed AI",
    },
    {
      body: "First-week support helps tune questions, services, FAQs, and the owner workflow.",
      icon: "user",
      title: "Founder-led onboarding",
    },
  ];

  return (
    <section className="px-5 py-10 sm:px-6">
      <MarketingShell>
        <div
          className="rounded-[16px] border p-6"
          style={{
            background:
              "radial-gradient(circle at 0% 0%, rgba(45,212,191,0.17), transparent 24rem), linear-gradient(135deg, rgba(11,25,37,0.98), rgba(5,12,20,0.96))",
            borderColor: "rgba(45,212,191,0.22)",
          }}
        >
          <div className="grid gap-8 lg:grid-cols-[0.62fr_1fr]">
            <div>
              <MarketingBadge>What you get</MarketingBadge>
              <h2 className="mt-5 text-[34px] font-black leading-[1.12]" style={{ color: marketingTone.text }}>
                A focused recovery workflow, not another software maze.
              </h2>
              <p className="mt-5 text-[16px] leading-8" style={{ color: marketingTone.soft }}>
                The offer is designed for cleaning owners who need faster response, cleaner intake, and follow-up visibility before they need a full operations platform.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {items.map((item) => (
                <div className="rounded-[13px] border p-5" key={item.title} style={{ backgroundColor: "rgba(255,255,255,0.035)", borderColor: marketingTone.border }}>
                  <span className="flex h-11 w-11 items-center justify-center rounded-[11px]" style={{ backgroundColor: "rgba(45,212,191,0.11)", color: marketingTone.teal }}>
                    <MarketingIcon name={item.icon} />
                  </span>
                  <h3 className="mt-5 text-[17px] font-black" style={{ color: marketingTone.text }}>
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[13px] leading-6" style={{ color: marketingTone.soft }}>
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

function GuardrailSection() {
  const guardrails = [
    "No auto-send",
    "No invented cleaning prices",
    "No booking confirmation",
    "No SMS or WhatsApp automation in this pilot",
    "No full CRM scope",
  ];

  return (
    <section className="px-5 py-8 sm:px-6">
      <MarketingShell>
        <MarketingCard className="grid gap-8 p-6 lg:grid-cols-[0.75fr_1fr] lg:items-center">
          <div>
            <p className="text-[12px] font-black uppercase" style={{ color: marketingTone.teal }}>
              Built for trust
            </p>
            <h2 className="mt-4 text-[32px] font-black leading-[1.13]" style={{ color: marketingTone.text }}>
              The assistant helps you reply faster. It does not become your operator.
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {guardrails.map((guardrail) => (
              <span
                className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[12px] font-black"
                key={guardrail}
                style={{
                  backgroundColor: "rgba(45,212,191,0.08)",
                  borderColor: "rgba(45,212,191,0.22)",
                  color: marketingTone.teal,
                }}
              >
                <MarketingIcon name="check" />
                {guardrail}
              </span>
            ))}
          </div>
        </MarketingCard>
      </MarketingShell>
    </section>
  );
}

function FaqSection() {
  const items: ReadonlyArray<Readonly<{ answer: string; question: string }>> = [
    {
      question: "Is this a booking or invoice system?",
      answer:
        "No. The current product is focused on quote recovery before the job is booked: capture the request, identify missing details, prepare a reply draft, and keep follow-up visible.",
    },
    {
      question: "Will BizPilot message customers automatically?",
      answer:
        "No. AI drafts stay owner-reviewed. You review, edit, copy, and send from your own channel.",
    },
    {
      question: "What happens during the 14-day pilot?",
      answer:
        "The founder helps configure your quote page, service list, basic branding, intake questions, sample lead, and first-week workflow.",
    },
    {
      question: "Why is there a setup fee?",
      answer:
        "The first version is done-for-you. Setup covers configuring the quote workflow around your cleaning business instead of handing you another empty tool.",
    },
  ];

  return (
    <section className="px-5 py-10 sm:px-6" id="faq">
      <MarketingShell>
        <MarketingSectionTitle
          align="center"
          eyebrow="FAQ"
          title="Straight answers before you start."
        />
        <div className="mx-auto mt-8 grid max-w-[880px] gap-3">
          {items.map((item) => (
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
  );
}

function PricingCta() {
  return (
    <section className="px-5 py-8 sm:px-6">
      <MarketingShell>
        <MarketingCard
          className="p-7"
          style={{
            background:
              "radial-gradient(circle at 8% 0%, rgba(45,212,191,0.22), transparent 26rem), linear-gradient(135deg, rgba(11,25,37,0.98), rgba(5,12,20,0.96))",
            borderColor: "rgba(45,212,191,0.24)",
          }}
        >
          <div className="grid items-center gap-7 lg:grid-cols-[1fr_auto]">
            <div>
              <MarketingBadge>Ready for pilot setup</MarketingBadge>
              <h2 className="mt-4 max-w-[740px] text-[34px] font-black leading-[1.12]" style={{ color: marketingTone.text }}>
                Start with the recovery workflow, then decide from real usage.
              </h2>
              <p className="mt-4 max-w-[680px] text-[16px] leading-8" style={{ color: marketingTone.soft }}>
                The goal is simple: prove that faster, cleaner quote response helps your cleaning business recover more conversations.
              </p>
            </div>
            <MarketingButton href="/auth/sign-up">
              Start free recovery <MarketingIcon name="arrow" />
            </MarketingButton>
          </div>
        </MarketingCard>
      </MarketingShell>
    </section>
  );
}

export default function PricingPage() {
  return (
    <main className="min-h-screen" style={{ background: marketingBackground, color: marketingTone.text }}>
      <MarketingHeader active="pricing" />
      <PricingHero />
      <PricingPlans />
      <IncludedSection />
      <GuardrailSection />
      <FaqSection />
      <PricingCta />
      <MarketingFooter />
    </main>
  );
}
