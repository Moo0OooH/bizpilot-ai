/**
 * ============================================================
 * File: app/demo/page.tsx
 * Project: BizPilot AI
 * Description: Public full-demo page for the cleaning quote recovery workflow.
 * Role: Shows the manual-first request-to-draft workflow without implying automation.
 * Related:
 * - components/public/marketing-ui.tsx
 * - app/page.tsx
 * Author: MoOoH
 * Created: 2026-06-18
 * Last Updated: 2026-06-18
 * Change Log:
 * - 2026-06-18: Grouped the demo into concise responsive chapters with visible guardrails.
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
  title: "Demo | BizPilot AI",
  description:
    "See how BizPilot AI captures a cleaning quote request, organizes the lead, highlights missing details, and prepares an owner-reviewed reply.",
};

const demoChapters = [
  {
    body: "A vague request arrives while the owner is busy. Details are missing, pricing is risky, and the message is easy to forget.",
    eyebrow: "1",
    panelItems: ['"Hi, how much for move-out cleaning before Friday?"'],
    panelTitle: "Customer message",
    title: "Request arrives.",
  },
  {
    body: "BizPilot turns the message into cleaning-specific context and highlights what is missing before a responsible quote.",
    eyebrow: "2",
    panelItems: [
      "Service: Move-out cleaning",
      "Timing: Before Friday",
      "Status: Needs reply",
      "Missing: square footage, appliances, access notes",
      "Consent: owner-reviewed reply expected",
    ],
    panelTitle: "Organized lead",
    title: "BizPilot organizes it and highlights missing details.",
  },
  {
    body: "AI prepares a short owner summary and a practical first reply. The draft asks for missing details instead of inventing a price.",
    eyebrow: "3",
    panelItems: [
      "Sarah needs a move-out cleaning before Friday, but pricing would be risky without square footage, appliance details, and access notes.",
      "Hi Sarah, thanks for reaching out. Could you confirm the approximate square footage, whether appliances need interior cleaning, and any access notes so I can prepare an accurate quote?",
    ],
    panelTitle: "AI summary and draft",
    title: "AI prepares an owner-reviewed draft.",
  },
  {
    body: "The owner reviews, edits if needed, copies the reply, and sends it manually from their own channel. Guardrails stay visible.",
    eyebrow: "4",
    panelItems: ["Review", "Edit if needed", "Copy reply", "Send manually"],
    panelTitle: "Owner action",
    title: "Owner copies and sends manually.",
  },
] as const;

const guardrails = [
  "No auto-send",
  "No invented price",
  "No booking confirmation",
  "No SMS/WhatsApp automation",
  "No full CRM claim",
] as const;

function DemoPanel({
  items,
  title,
}: Readonly<{ items: readonly string[]; title: string }>) {
  return (
    <div className="min-w-0 rounded-[16px] border border-slate-200 bg-white p-5 shadow-[0_18px_42px_rgba(15,23,42,0.06)]">
      <p className="text-[12px] font-black uppercase tracking-[0.14em] text-slate-500">
        {title}
      </p>
      <div className="mt-3 grid gap-2">
        {items.map((item) => (
          <p
            className="rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-2 text-[14px] font-bold leading-6 text-slate-950"
            key={item}
          >
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

export default async function DemoPage() {
  const language = readSupportedLanguage(
    (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );
  const navCopy = getHomeCopy(language).nav;

  return (
    <main
      className="public-site min-h-svh"
      style={{ background: marketingBackground, color: marketingTone.text }}
    >
      <MarketingHeader copy={navCopy} language={language} redirectPath="/demo" />

      <section className="pb-12 pt-10 sm:pt-14 lg:pb-16 lg:pt-20">
        <MarketingShell>
          <div className="mx-auto max-w-[920px] text-center">
            <MarketingBadge>60-second workflow demo</MarketingBadge>
            <h1
              className="mt-5 text-[length:var(--text-page)] font-black leading-[1.06] [text-wrap:balance]"
              style={{ color: marketingTone.text }}
            >
              See how BizPilot handles a cleaning quote request.
            </h1>
            <p
              className="mx-auto mt-5 max-w-[760px] text-[17px] leading-8"
              style={{ color: marketingTone.soft }}
            >
              Follow one realistic move-out cleaning request from customer
              message to owner-reviewed reply.
            </p>
          </div>
        </MarketingShell>
      </section>

      <section className="pb-[var(--section-space)]">
        <MarketingShell>
          <div className="grid gap-4">
            {demoChapters.map((item) => (
              <MarketingCard className="p-5 sm:p-6" key={item.title}>
                <div className="grid min-w-0 gap-5 min-[1040px]:grid-cols-[minmax(0,0.92fr)_minmax(320px,0.82fr)] min-[1040px]:items-center">
                  <div className="min-w-0">
                    <span
                      className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] text-[13px] font-black text-white"
                      style={{ backgroundColor: marketingTone.blue }}
                    >
                      {item.eyebrow}
                    </span>
                    <h2 className="mt-4 text-[24px] font-black leading-tight text-slate-950">
                      {item.title}
                    </h2>
                    <p
                      className="mt-3 max-w-[680px] text-[15px] leading-7"
                      style={{ color: marketingTone.soft }}
                    >
                      {item.body}
                    </p>
                  </div>
                  <DemoPanel items={item.panelItems} title={item.panelTitle} />
                </div>
              </MarketingCard>
            ))}

            <MarketingCard className="p-5 sm:p-6">
              <div className="grid min-w-0 gap-5 min-[1040px]:grid-cols-[minmax(0,0.92fr)_minmax(320px,0.82fr)] min-[1040px]:items-center">
                <div className="min-w-0">
                  <span
                    className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] text-[13px] font-black text-white"
                    style={{ backgroundColor: marketingTone.teal }}
                  >
                    5
                  </span>
                  <h2 className="mt-4 text-[24px] font-black leading-tight text-slate-950">
                    Guardrails
                  </h2>
                  <p
                    className="mt-3 max-w-[680px] text-[15px] leading-7"
                    style={{ color: marketingTone.soft }}
                  >
                    The product stays manual-first so the owner keeps control of
                    customer communication and quote decisions.
                  </p>
                </div>
                <div className="grid min-w-0 gap-3">
                  {guardrails.map((item) => (
                    <div
                      className="flex min-w-0 items-start gap-3 rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-[14px] font-black text-slate-950"
                      key={item}
                    >
                      <span className="mt-0.5 text-teal-600">
                        <MarketingIcon name="check" />
                      </span>
                      <span className="min-w-0 break-words">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </MarketingCard>

            <MarketingCard className="p-6 sm:p-8">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                <div>
                  <h2 className="text-[28px] font-black leading-tight text-slate-950">
                    Try the founder pilot workflow with real cleaning leads.
                  </h2>
                  <p
                    className="mt-3 max-w-[720px] text-[15px] leading-7"
                    style={{ color: marketingTone.soft }}
                  >
                    BizPilot is starting with cleaning businesses first so the
                    product can be shaped around real quote requests and owner
                    feedback.
                  </p>
                </div>
                <MarketingButton href="/pilot">
                  Apply for founder pilot <MarketingIcon name="arrow" />
                </MarketingButton>
              </div>
            </MarketingCard>
          </div>
        </MarketingShell>
      </section>

      <MarketingFooter copy={navCopy} />
    </main>
  );
}
