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
import { cookies } from "next/headers";

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
import { getHomeCopy } from "@/lib/i18n/home-copy";
import {
  INTERFACE_LANGUAGE_COOKIE,
  readSupportedLanguage,
} from "@/lib/i18n/language";
import {
  getPricingCopy,
  type PricingCopy,
  type PricingPlanCopy,
} from "@/lib/i18n/pricing-copy";

export const metadata: Metadata = {
  title: "Pricing - BizPilot AI",
  description:
    "Founder-led pricing for cleaning businesses that want a done-for-you quote recovery system with owner-reviewed AI drafts.",
};

function PricingHero({ copy }: Readonly<{ copy: PricingCopy["hero"] }>) {
  return (
    <section className="px-5 py-14 sm:px-6">
      <MarketingShell>
        <div className="grid min-w-0 items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="min-w-0">
            <MarketingBadge>{copy.badge}</MarketingBadge>
            <h1
              className="mt-6 max-w-[15ch] text-[32px] font-black leading-[1.08] sm:max-w-[680px] sm:text-[40px] lg:text-[46px]"
              style={{ color: marketingTone.text }}
            >
              {copy.title}
            </h1>
            <p
              className="mt-5 max-w-[34ch] text-[17px] leading-8 sm:max-w-[650px]"
              style={{ color: marketingTone.soft }}
            >
              {copy.body}
            </p>
            <div className="mt-8 grid gap-3 min-[430px]:flex min-[430px]:flex-wrap">
              <MarketingButton className="w-full min-[430px]:w-auto" href="/auth/sign-up">
                {copy.primaryCta} <MarketingIcon name="arrow" />
              </MarketingButton>
              <MarketingButton className="w-full min-[430px]:w-auto" href="/#recovery-flow" variant="secondary">
                {copy.secondaryCta}
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
            <p
              className="text-[12px] font-black uppercase"
              style={{ color: marketingTone.teal }}
            >
              {copy.promise.eyebrow}
            </p>
            <h2
              className="mt-4 max-w-[16ch] text-[26px] font-black leading-[1.14] sm:max-w-none sm:text-[31px]"
              style={{ color: marketingTone.text }}
            >
              {copy.promise.title}
            </h2>
            <div
              className="mt-6 grid gap-3 text-[14px]"
              style={{ color: marketingTone.soft }}
            >
              {copy.promise.bullets.map((item) => (
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

function PlanCard({
  plan,
  recommendedLabel,
}: Readonly<{ plan: PricingPlanCopy; recommendedLabel: string }>) {
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
          className="mb-4 inline-flex w-fit rounded-full border px-3 py-1 text-[11px] font-black uppercase sm:absolute sm:right-5 sm:top-5 sm:mb-0"
          style={{
            backgroundColor: "rgba(45,212,191,0.12)",
            borderColor: "rgba(45,212,191,0.30)",
            color: marketingTone.teal,
          }}
        >
          {recommendedLabel}
        </span>
      ) : null}
      <p
        className="text-[13px] font-black uppercase"
        style={{ color: marketingTone.muted }}
      >
        {plan.name}
      </p>
      <div className="mt-5 flex flex-wrap items-end gap-x-3 gap-y-1">
        <span
          className="text-[40px] font-black leading-none"
          style={{ color: marketingTone.text }}
        >
          {plan.monthly}
        </span>
        <span
          className="pb-1 text-[14px] font-bold"
          style={{ color: marketingTone.muted }}
        >
          {plan.setup}
        </span>
      </div>
      <p
        className="mt-5 text-[14px] leading-7"
        style={{ color: marketingTone.soft }}
      >
        {plan.description}
      </p>
      <ul className="mt-6 grid gap-3">
        {plan.features.map((feature) => (
          <li
            className="flex items-start gap-3 text-[14px] leading-6"
            key={feature}
            style={{ color: marketingTone.soft }}
          >
            <span
              className="mt-1 shrink-0"
              style={{ color: marketingTone.teal }}
            >
              <MarketingIcon name="check" />
            </span>
            {feature}
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <MarketingButton
          className="w-full"
          href="/auth/sign-up"
          variant={plan.recommended ? "primary" : "secondary"}
        >
          {plan.cta}
        </MarketingButton>
      </div>
    </MarketingCard>
  );
}

function PricingPlans({ copy }: Readonly<{ copy: PricingCopy["plans"] }>) {
  return (
    <section className="px-5 py-8 sm:px-6" id="plans">
      <MarketingShell>
        <MarketingSectionTitle
          align="center"
          eyebrow={copy.eyebrow}
          lead={copy.lead}
          title={copy.title}
        />
        <div className="mt-9 grid min-w-0 gap-5 lg:grid-cols-3">
          {copy.items.map((plan) => (
            <PlanCard
              key={plan.name}
              plan={plan}
              recommendedLabel={copy.recommendedLabel}
            />
          ))}
        </div>
      </MarketingShell>
    </section>
  );
}

function IncludedSection({
  copy,
}: Readonly<{ copy: PricingCopy["included"] }>) {
  const icons: readonly MarketingIconName[] = ["link", "inbox", "pen", "user"];
  const items = copy.items.map((item, index) => ({
    ...item,
    icon: icons[index] ?? "link",
  }));

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
          <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1fr)]">
            <div className="min-w-0">
              <MarketingBadge>{copy.badge}</MarketingBadge>
              <h2
                className="mt-5 max-w-[16ch] text-[28px] font-black leading-[1.12] sm:max-w-none sm:text-[34px]"
                style={{ color: marketingTone.text }}
              >
                {copy.title}
              </h2>
              <p
                className="mt-5 max-w-[34ch] text-[16px] leading-8 sm:max-w-none"
                style={{ color: marketingTone.soft }}
              >
                {copy.body}
              </p>
            </div>
            <div className="grid min-w-0 gap-4 md:grid-cols-2">
              {items.map((item) => (
                <div
                  className="rounded-[13px] border p-5"
                  key={item.title}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.035)",
                    borderColor: marketingTone.border,
                  }}
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-[11px]"
                    style={{
                      backgroundColor: "rgba(45,212,191,0.11)",
                      color: marketingTone.teal,
                    }}
                  >
                    <MarketingIcon name={item.icon} />
                  </span>
                  <h3
                    className="mt-5 text-[17px] font-black"
                    style={{ color: marketingTone.text }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="mt-3 text-[13px] leading-6"
                    style={{ color: marketingTone.soft }}
                  >
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

function GuardrailSection({
  copy,
}: Readonly<{ copy: PricingCopy["guardrails"] }>) {
  return (
    <section className="px-5 py-8 sm:px-6">
      <MarketingShell>
        <MarketingCard className="grid min-w-0 gap-8 p-6 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)] lg:items-center">
          <div className="min-w-0">
            <p
              className="text-[12px] font-black uppercase"
              style={{ color: marketingTone.teal }}
            >
              {copy.eyebrow}
            </p>
            <h2
              className="mt-4 max-w-[16ch] text-[26px] font-black leading-[1.13] sm:max-w-none sm:text-[32px]"
              style={{ color: marketingTone.text }}
            >
              {copy.title}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {copy.items.map((guardrail) => (
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

function FaqSection({ copy }: Readonly<{ copy: PricingCopy["faq"] }>) {
  return (
    <section className="px-5 py-10 sm:px-6" id="faq">
      <MarketingShell>
        <MarketingSectionTitle
          align="center"
          eyebrow={copy.eyebrow}
          title={copy.title}
        />
        <div className="mx-auto mt-8 grid max-w-[880px] gap-3">
          {copy.items.map((item) => (
            <MarketingCard className="p-5" key={item.question}>
              <details>
                <summary
                  className="cursor-pointer list-none text-[16px] font-black"
                  style={{ color: marketingTone.text }}
                >
                  {item.question}
                </summary>
                <p
                  className="mt-3 text-[14px] leading-7"
                  style={{ color: marketingTone.soft }}
                >
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

function PricingCta({ copy }: Readonly<{ copy: PricingCopy["cta"] }>) {
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
          <div className="grid min-w-0 items-center gap-7 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div className="min-w-0">
              <MarketingBadge>{copy.badge}</MarketingBadge>
              <h2
                className="mt-4 max-w-[16ch] text-[28px] font-black leading-[1.12] sm:max-w-[740px] sm:text-[34px]"
                style={{ color: marketingTone.text }}
              >
                {copy.title}
              </h2>
              <p
                className="mt-4 max-w-[34ch] text-[16px] leading-8 sm:max-w-[680px]"
                style={{ color: marketingTone.soft }}
              >
                {copy.body}
              </p>
            </div>
            <MarketingButton href="/auth/sign-up">
              {copy.button} <MarketingIcon name="arrow" />
            </MarketingButton>
          </div>
        </MarketingCard>
      </MarketingShell>
    </section>
  );
}

export default async function PricingPage() {
  const language = readSupportedLanguage(
    (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );
  const pricingCopy = getPricingCopy(language);
  const navCopy = getHomeCopy(language).nav;

  return (
    <main
      className="min-h-screen overflow-x-hidden"
      style={{ background: marketingBackground, color: marketingTone.text }}
    >
      <MarketingHeader
        active="pricing"
        copy={navCopy}
        language={language}
        redirectPath="/pricing"
      />
      <PricingHero copy={pricingCopy.hero} />
      <PricingPlans copy={pricingCopy.plans} />
      <IncludedSection copy={pricingCopy.included} />
      <GuardrailSection copy={pricingCopy.guardrails} />
      <FaqSection copy={pricingCopy.faq} />
      <PricingCta copy={pricingCopy.cta} />
      <MarketingFooter copy={navCopy} />
    </main>
  );
}
