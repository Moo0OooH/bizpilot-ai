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

const demoSections = [
  {
    body: "A vague request arrives while the owner is busy. Details are missing, pricing is risky, and the message is easy to forget.",
    eyebrow: "1",
    panelBody: '"Hi, how much for move-out cleaning before Friday?"',
    panelTitle: "Customer message",
    title: "Before BizPilot",
  },
  {
    body: "BizPilot starts by collecting cleaning-specific context instead of treating every inquiry like a generic contact form.",
    eyebrow: "2",
    panelBody:
      "Service: Move-out cleaning\nTiming: Before Friday\nProperty: Move-out request\nConsent: Customer expects the owner to review and reply",
    panelTitle: "Captured context",
    title: "Quote request captured",
  },
  {
    body: "The request becomes a clean lead record with the details the owner needs to decide the next step.",
    eyebrow: "3",
    panelBody:
      "Service: Move-out cleaning\nTiming: Before Friday\nSource: Quote request\nStatus: Needs reply\nMissing: square footage, appliances, access notes",
    panelTitle: "Lead card",
    title: "Lead organized",
  },
  {
    body: "BizPilot keeps the owner from guessing by surfacing what is still needed before a responsible quote.",
    eyebrow: "4",
    panelBody: "Square footage\nAppliance cleaning\nAccess notes",
    panelTitle: "Missing details",
    title: "Missing details highlighted",
  },
  {
    body: "The summary is short, practical, and focused on helping the owner respond faster without inventing facts.",
    eyebrow: "5",
    panelBody:
      "Sarah needs a move-out cleaning before Friday, but pricing would be risky without square footage, appliance details, and access notes.",
    panelTitle: "Owner summary",
    title: "AI summary",
  },
  {
    body: "AI prepares a useful first reply. The owner reviews it, edits it if needed, and stays responsible for the final message.",
    eyebrow: "6",
    panelBody:
      "Hi Sarah, thanks for reaching out. Could you confirm the approximate square footage, whether appliances need interior cleaning, and any access notes so I can prepare an accurate quote?",
    panelTitle: "Draft reply",
    title: "Owner-reviewed draft",
  },
  {
    body: "BizPilot does not send the message. The owner copies the reply and sends it from their own channel.",
    eyebrow: "7",
    panelBody: "Review\nEdit if needed\nCopy reply\nSend manually",
    panelTitle: "Owner action",
    title: "Manual copy/send",
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
  body,
  title,
}: Readonly<{ body: string; title: string }>) {
  return (
    <div className="min-w-0 rounded-[16px] border border-slate-200 bg-white p-5 shadow-[0_18px_42px_rgba(15,23,42,0.06)]">
      <p className="text-[12px] font-black uppercase tracking-[0.14em] text-slate-500">
        {title}
      </p>
      <p className="mt-3 whitespace-pre-line break-words text-[15px] font-bold leading-7 text-slate-950">
        {body}
      </p>
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
      className="min-h-screen overflow-x-hidden"
      style={{ background: marketingBackground, color: marketingTone.text }}
    >
      <MarketingHeader copy={navCopy} language={language} redirectPath="/demo" />

      <section className="px-5 pb-12 pt-12 sm:px-6 lg:pb-16 lg:pt-20">
        <MarketingShell>
          <div className="mx-auto max-w-[920px] text-center">
            <MarketingBadge>60-second workflow demo</MarketingBadge>
            <h1
              className="mt-5 text-[38px] font-black leading-[1.04] sm:text-[54px]"
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

      <section className="px-5 pb-16 sm:px-6 lg:pb-24">
        <MarketingShell>
          <div className="grid gap-4">
            {demoSections.map((item) => (
              <MarketingCard className="p-5 sm:p-6" key={item.title}>
                <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(320px,0.82fr)] lg:items-center">
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
                  <DemoPanel body={item.panelBody} title={item.panelTitle} />
                </div>
              </MarketingCard>
            ))}

            <MarketingCard className="p-5 sm:p-6">
              <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(320px,0.82fr)] lg:items-center">
                <div className="min-w-0">
                  <span
                    className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] text-[13px] font-black text-white"
                    style={{ backgroundColor: marketingTone.teal }}
                  >
                    8
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
