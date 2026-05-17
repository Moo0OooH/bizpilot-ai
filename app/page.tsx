/**
 * ============================================================
 * File: app/page.tsx
 * Project: BizPilot AI
 * Description: Renders the public pain-first BizPilot AI landing page.
 * Role: Communicates the cleaning quote recovery offer in 5 compact folds.
 * Related:
 * - app/layout.tsx
 * - app/globals.css
 * - docs/BIZPILOT_STRATEGIC_ALIGNMENT_UPDATE_v1.6.md (Section 15: Landing Page)
 * Author: MoOoH
 * Last Updated: 2026-05-17
 * Change Log:
 * - 2026-05-17: Rewrote the page around cleaning quote recovery and pilot-demo clarity.
 * - 2026-05-17: Tightened responsive landing structure, sections, and calm visual hierarchy.
 * - 2026-05-17: Phase 17C pass. Added the Before/After transformation proof,
 *   tightened nav and section density, and kept the page focused on quote recovery.
 * ============================================================
 */

import Link from "next/link";
import type { ReactNode } from "react";

const outcomes = [
  "AI-assisted replies",
  "Follow-up reminders",
  "Lead recovery",
] as const;

const transformation = [
  ["Scattered DM", "Structured lead"],
  ["Missing address or room count", "Property details captured"],
  ["No preferred date visible", "Preferred date surfaced"],
  ["Easy to forget", "Follow-up suggested"],
  ["Owner guesses what to say", "AI reply ready to review"],
] as const;

const lostReasons = [
  {
    detail: "Customers move on when replies take too long.",
    icon: "S",
    title: "Slow replies",
  },
  {
    detail: "Quote requests get buried in chats and inboxes.",
    icon: "M",
    title: "Messy DMs and emails",
  },
  {
    detail: "You forget to follow up and lose the job.",
    icon: "F",
    title: "Missed follow-ups",
  },
  {
    detail: "Details are incomplete or hard to track.",
    icon: "Q",
    title: "Quote chaos",
  },
] as const;

const demoSteps = [
  {
    detail: "From your public quote link.",
    title: "Customer submits a quote request",
  },
  {
    detail: "AI summarizes the details and suggests the best response.",
    title: "BizPilot organizes the lead",
  },
  {
    detail: "Close more jobs before customers go elsewhere.",
    title: "You reply faster and follow up",
  },
] as const;

const priorityCards = [
  ["New Quote Requests", "7", "text-emerald-300", "2 new since 8:00 AM"],
  ["Needs Reply", "4", "text-red-300", "Oldest waiting 18h"],
  ["At Risk", "3", "text-amber-300", "Follow up before evening"],
  ["AI Drafts Ready", "5", "text-violet-300", "Owner review needed"],
] as const;

function PrimaryCta({
  children,
  href = "/dashboard",
}: Readonly<{ children: ReactNode; href?: string }>) {
  return (
    <Link
      className="inline-flex h-11 items-center justify-center rounded-[10px] bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 sm:min-w-[200px]"
      href={href}
    >
      {children}
      <span className="ml-2">-&gt;</span>
    </Link>
  );
}

function SecondaryCta({
  children,
  href = "/dashboard",
}: Readonly<{ children: ReactNode; href?: string }>) {
  return (
    <Link
      className="inline-flex h-11 items-center justify-center rounded-[10px] border border-white/15 bg-white/[0.04] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-white/[0.08] sm:min-w-[140px]"
      href={href}
    >
      {children}
    </Link>
  );
}

function DashboardPreview() {
  return (
    <aside className="overflow-hidden rounded-[16px] border border-white/10 bg-[#0b1728]/88 shadow-[0_18px_46px_rgba(0,0,0,0.26)]">
      <div className="grid lg:grid-cols-[8.5rem_1fr]">
        <div className="hidden border-r border-white/10 bg-black/20 p-3 lg:block">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-600 text-[9px]">
              BP
            </span>
            BizPilot
          </div>
          <div className="mt-6 grid gap-1.5 text-xs text-slate-300">
            {["Overview", "Leads", "Quote Setup", "Follow Ups"].map(
              (item, index) => (
                <div
                  className={
                    index === 0
                      ? "rounded-[8px] bg-white/[0.08] px-2.5 py-1.5 font-medium text-white"
                      : "rounded-[8px] px-2.5 py-1.5"
                  }
                  key={item}
                >
                  {item}
                </div>
              ),
            )}
          </div>
          <div className="mt-12 text-[11px] text-slate-400">
            <p className="font-medium text-white">Demo Cleaning Co.</p>
            <p>Owner</p>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex flex-col gap-2 border-b border-white/10 pb-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-normal text-slate-400">
                Dashboard preview
              </p>
              <h2 className="mt-0.5 text-base font-semibold text-white">
                Good morning, Alex
              </h2>
              <p className="text-xs text-slate-400">
                Here&apos;s what needs your attention today.
              </p>
            </div>
            <Link
              className="inline-flex h-8 items-center justify-center rounded-[8px] bg-emerald-600 px-3 text-xs font-semibold text-white"
              href="/dashboard/leads"
            >
              Review Leads
            </Link>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {priorityCards.map(([label, value, tone, detail]) => (
              <div
                className="rounded-[10px] border border-white/10 bg-black/18 p-2.5"
                key={label}
              >
                <p className="text-[11px] font-semibold text-white">{label}</p>
                <p className={`mt-1 text-2xl font-semibold ${tone}`}>{value}</p>
                <p className="text-[11px] text-slate-400">{detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 grid gap-2 xl:grid-cols-[1.35fr_0.9fr]">
            <div className="rounded-[10px] border border-white/10 bg-black/18 p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-white">
                  Priority: At Risk Leads
                </p>
                <span className="text-slate-500">-&gt;</span>
              </div>
              <div className="mt-2 divide-y divide-white/10">
                {[
                  ["Sarah J.", "Move-out cleaning - Fri 3 PM", "High risk"],
                  ["David L.", "Deep cleaning - Sat morning", "Medium risk"],
                ].map(([name, request, risk]) => (
                  <div
                    className="grid grid-cols-[1fr_auto] gap-2 py-2 text-xs"
                    key={name}
                  >
                    <span>
                      <span className="block font-medium text-white">{name}</span>
                      <span className="text-[11px] text-slate-400">{request}</span>
                    </span>
                    <span className="self-center rounded-full border border-amber-400/20 bg-amber-500/15 px-2 py-0.5 text-[10px] text-amber-200">
                      {risk}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[10px] border border-white/10 bg-black/18 p-3">
              <p className="text-xs font-semibold text-white">AI Draft Ready</p>
              <div className="mt-2 grid gap-2">
                {["Emily K.", "James T.", "Olivia M."].map((lead, index) => (
                  <div
                    className="grid grid-cols-[1.75rem_1fr_auto] items-center gap-2 text-xs"
                    key={lead}
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold text-white">
                      {lead.charAt(0)}
                    </span>
                    <span>
                      <span className="block font-medium text-white">{lead}</span>
                      <span className="text-[10px] text-slate-400">
                        {index === 0 ? "Regular cleaning - today" : "Move-in cleaning"}
                      </span>
                    </span>
                    <span className="text-[10px] text-slate-400">{index + 1}h</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function TransformationSection() {
  return (
    <section className="border-t border-white/10 py-8" id="transformation">
      <div className="grid gap-4 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-normal text-emerald-300">
            The first 3 minutes
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white sm:text-[28px]">
            Turn quote chaos into a clear next action.
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            BizPilot takes the messy request that would usually sit in a DM and
            turns it into a lead the owner can review, reply to, and follow up on.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[14px] border border-red-400/15 bg-red-500/[0.035] p-4">
            <p className="text-xs font-semibold uppercase tracking-normal text-red-200">
              Before BizPilot
            </p>
            <div className="mt-3 rounded-[10px] border border-white/10 bg-black/18 p-3 text-sm leading-6 text-slate-300">
              &quot;Hi, how much for a move-out clean this week?&quot;
            </div>
            <ul className="mt-3 grid gap-2 text-sm text-slate-400">
              {transformation.map(([before]) => (
                <li className="flex gap-2" key={before}>
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-300/80" />
                  <span>{before}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[14px] border border-emerald-400/18 bg-emerald-500/[0.045] p-4">
            <p className="text-xs font-semibold uppercase tracking-normal text-emerald-200">
              After BizPilot
            </p>
            <div className="mt-3 rounded-[10px] border border-white/10 bg-black/18 p-3 text-sm leading-6 text-slate-200">
              Sarah J. - Move-out cleaning - Friday - AI reply ready
            </div>
            <ul className="mt-3 grid gap-2 text-sm text-slate-300">
              {transformation.map(([, after]) => (
                <li className="flex gap-2" key={after}>
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" />
                  <span>{after}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 py-6">
      <div className="flex flex-col gap-3 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 font-medium text-slate-300">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-600 text-[9px]">
            BP
          </span>
          BizPilot AI - Lead recovery for cleaning businesses
        </div>
        <p>(c) 2026 BizPilot AI. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--biz-page-bg)] text-[var(--biz-page-text)]">
      <main className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Nav */}
        <nav className="flex min-h-14 items-center justify-between gap-3 py-3">
          <Link className="flex items-center gap-2 font-semibold" href="/">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-xs">
              BP
            </span>
            BizPilot
          </Link>
          <div className="hidden items-center gap-5 text-sm text-slate-300 lg:flex">
            <a className="hover:text-white" href="#why">Features</a>
            <a className="hover:text-white" href="#how-it-works">How It Works</a>
            <a className="hover:text-white" href="#cta">Pricing</a>
            <a className="hover:text-white" href="/dashboard">Demo</a>
          </div>
          <div className="flex items-center gap-2">
            <Link
              className="hidden rounded-[10px] border border-white/15 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.08] sm:inline-flex"
              href="/dashboard"
            >
              See Demo
            </Link>
            <Link
              className="rounded-[10px] bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:px-4"
              href="/auth/sign-in"
            >
              Get Early Access
            </Link>
          </div>
        </nav>

        {/* Fold 1 - Hero */}
        <section className="grid gap-7 py-8 sm:py-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,540px)] lg:items-center lg:gap-9">
          <div>
            <p className="inline-flex rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-medium text-slate-300">
              For cleaning businesses
            </p>
            <h1 className="mt-4 max-w-[620px] text-[36px] font-semibold leading-[1.08] tracking-normal sm:text-[44px] lg:text-[52px]">
              <span className="text-white">Stop losing cleaning </span>
              <span className="text-emerald-400">quote requests.</span>
            </h1>
            <p className="mt-4 max-w-[560px] text-[15px] leading-7 text-slate-300">
              BizPilot helps cleaning businesses respond faster, organize new
              quote requests, and follow up before customers disappear.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <PrimaryCta>Start Recovering Leads</PrimaryCta>
              <SecondaryCta>See Demo</SecondaryCta>
            </div>
            <div className="mt-5 flex flex-wrap gap-5">
              {outcomes.map((outcome) => (
                <div
                  className="flex items-center gap-2 text-sm leading-6 text-slate-300"
                  key={outcome}
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          <DashboardPreview />
        </section>

        {/* Fold 2 - Transformation */}
        <TransformationSection />

        {/* Fold 3 - Why */}
        <section className="border-t border-white/10 py-8" id="why">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white sm:text-[28px]">
              Why cleaning businesses lose leads
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              It happens every day. BizPilot helps you fix it.
            </p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {lostReasons.map((reason) => (
              <div
                className="rounded-[14px] border border-white/10 bg-white/[0.04] p-4"
                key={reason.title}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-400/25 bg-emerald-500/10 text-sm font-semibold text-emerald-300">
                  {reason.icon}
                </span>
                <h3 className="mt-3 text-sm font-semibold text-white">
                  {reason.title}
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-400">
                  {reason.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Fold 4 - How */}
        <section className="border-t border-white/10 py-8" id="how-it-works">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white sm:text-[28px]">
              How BizPilot works
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              A simple system to recover more leads and win more jobs.
            </p>
          </div>
          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {demoSteps.map((step, index) => (
              <div
                className="grid gap-3 rounded-[14px] border border-white/10 bg-white/[0.04] p-4 sm:grid-cols-[3rem_1fr] lg:grid-cols-1"
                key={step.title}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-500/10 text-base font-semibold text-emerald-300">
                  {index + 1}
                </span>
                <span>
                  <h3 className="text-base font-semibold leading-6 text-white">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-slate-400">
                    {step.detail}
                  </p>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Fold 5 - Final CTA */}
        <section className="border-t border-white/10 py-8" id="cta">
          <div className="overflow-hidden rounded-[16px] border border-white/10 bg-[linear-gradient(90deg,rgba(16,185,129,0.16),rgba(255,255,255,0.05))] p-5 sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Start recovering leads today.
                </h2>
                <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-400">
                  Stop losing quote requests. Start winning more cleaning jobs.
                </p>
              </div>
              <PrimaryCta>Start Recovering Leads</PrimaryCta>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
