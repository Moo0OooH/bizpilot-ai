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
  ["New quote requests", "7", "text-emerald-200", "2 unread since 8:00 AM"],
  ["Needs reply", "4", "text-red-200", "2 waiting over 3h"],
  ["At risk", "3", "text-amber-200", "Follow up before 5 PM"],
  ["AI drafts ready", "5", "text-violet-200", "Owner review needed"],
] as const;

function PrimaryCta({
  children,
  href = "/dashboard",
}: Readonly<{ children: ReactNode; href?: string }>) {
  return (
    <Link
      className="inline-flex h-10 items-center justify-center rounded-[10px] bg-[var(--biz-primary)] px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(4,120,87,0.22)] transition hover:bg-[var(--biz-primary-hover)] sm:min-w-[190px]"
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
      className="inline-flex h-10 items-center justify-center rounded-[10px] border border-white/12 bg-white/[0.035] px-5 text-sm font-semibold text-slate-200 shadow-sm transition hover:border-white/20 hover:bg-white/[0.06] sm:min-w-[132px]"
      href={href}
    >
      {children}
    </Link>
  );
}

function DashboardPreview() {
  return (
    <aside className="overflow-hidden rounded-[16px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,31,45,0.94),rgba(11,23,40,0.96))] shadow-[0_24px_65px_rgba(0,0,0,0.30)]">
      <div className="grid lg:grid-cols-[8.5rem_1fr]">
        <div className="hidden border-r border-white/10 bg-[#08121e]/82 p-3 lg:block">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[var(--biz-primary)] text-[9px]">
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
            <p>Quote link active</p>
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
                4 leads need a reply before they cool off.
              </p>
            </div>
            <Link
              className="inline-flex h-8 items-center justify-center rounded-[8px] bg-[var(--biz-primary)] px-3 text-xs font-semibold text-white"
              href="/dashboard/leads"
            >
              Review queue
            </Link>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 xl:grid-cols-4">
            {priorityCards.map(([label, value, tone, detail]) => (
              <div
                className="rounded-[10px] border border-white/10 bg-white/[0.045] p-2.5"
                key={label}
              >
                <p className="text-[11px] font-semibold text-white">{label}</p>
                <p className={`mt-1 text-2xl font-semibold ${tone}`}>{value}</p>
                <p className="text-[11px] text-slate-400">{detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 hidden gap-2 sm:grid xl:grid-cols-[1.35fr_0.9fr]">
            <div className="rounded-[10px] border border-white/10 bg-white/[0.045] p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-white">
                  Priority: at-risk leads
                </p>
                <span className="text-[10px] text-slate-500">Updated 12m ago</span>
              </div>
              <div className="mt-2 divide-y divide-white/10">
                {[
                  ["Sarah J.", "Move-out cleaning - Fri 3 PM", "No reply in 18h"],
                  ["David L.", "Deep cleaning - Sat morning", "Follow-up due"],
                ].map(([name, request, risk]) => (
                  <div
                    className="grid grid-cols-[1fr_auto] gap-2 py-2 text-xs"
                    key={name}
                  >
                    <span>
                      <span className="block font-medium text-white">{name}</span>
                      <span className="text-[11px] text-slate-400">{request}</span>
                    </span>
                    <span className="self-center rounded-full border border-amber-400/20 bg-amber-500/12 px-2 py-0.5 text-[10px] text-amber-200">
                      {risk}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[10px] border border-white/10 bg-white/[0.045] p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-white">AI drafts ready</p>
                <span className="text-[10px] text-violet-200">manual review</span>
              </div>
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
                        {index === 0 ? "Regular cleaning - today" : "Move-in - missing address"}
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
    <section className="border-t border-white/10 py-7" id="transformation">
      <div className="grid gap-4 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-normal text-emerald-200">
            The first 3 minutes
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white sm:text-[27px]">
            Turn quote chaos into a clear next action.
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            BizPilot takes the messy request that would usually sit in a DM and
            turns it into a lead the owner can review, reply to, and follow up on.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[14px] border border-white/10 bg-[linear-gradient(180deg,rgba(239,68,68,0.055),rgba(255,255,255,0.035))] p-4">
            <p className="text-xs font-semibold uppercase tracking-normal text-red-200">
              Before BizPilot
            </p>
            <div className="mt-3 rounded-[10px] border border-white/10 bg-[#08121e]/72 p-3 text-sm leading-6 text-slate-300">
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

          <div className="rounded-[14px] border border-emerald-300/16 bg-[linear-gradient(180deg,rgba(4,120,87,0.12),rgba(255,255,255,0.035))] p-4">
            <p className="text-xs font-semibold uppercase tracking-normal text-emerald-200">
              After BizPilot
            </p>
            <div className="mt-3 rounded-[10px] border border-white/10 bg-[#08121e]/72 p-3 text-sm leading-6 text-slate-200">
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
    <div className="relative min-h-screen overflow-hidden bg-[var(--biz-page-bg)] text-[var(--biz-page-text)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_20%_10%,rgba(14,165,233,0.08),transparent_28rem),radial-gradient(circle_at_78%_8%,rgba(4,120,87,0.12),transparent_26rem)]" />
      <div className="pointer-events-none absolute inset-x-0 top-[430px] h-80 bg-[radial-gradient(circle_at_50%_0%,rgba(148,163,184,0.05),transparent_30rem)]" />
      <main className="relative mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        {/* Nav */}
        <nav className="flex min-h-14 items-center justify-between gap-3 py-2.5">
          <Link className="flex items-center gap-2 font-semibold" href="/">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--biz-primary)] text-xs">
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
              className="hidden rounded-[10px] border border-white/12 bg-white/[0.035] px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.06] sm:inline-flex"
              href="/dashboard"
            >
              See Demo
            </Link>
            <Link
              className="rounded-[10px] bg-[var(--biz-primary)] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[var(--biz-primary-hover)] sm:px-4"
              href="/auth/sign-in"
            >
              Get Early Access
            </Link>
          </div>
        </nav>

        {/* Fold 1 - Hero */}
        <section className="grid gap-7 py-7 sm:py-9 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,530px)] lg:items-center lg:gap-9">
          <div>
            <p className="inline-flex rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-medium text-slate-300">
              For cleaning businesses
            </p>
            <h1 className="mt-3 max-w-[600px] text-[35px] font-semibold leading-[1.06] tracking-normal sm:text-[42px] lg:text-[48px]">
              <span className="text-white">Stop losing cleaning </span>
              <span className="text-emerald-300">quote requests.</span>
            </h1>
            <p className="mt-3 max-w-[540px] text-[15px] leading-[1.65] text-slate-300">
              BizPilot helps cleaning businesses respond faster, organize new
              quote requests, and follow up before customers disappear.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <PrimaryCta>Start Recovering Leads</PrimaryCta>
              <SecondaryCta>See Demo</SecondaryCta>
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
              {outcomes.map((outcome) => (
                <div
                  className="flex items-center gap-2 text-sm leading-6 text-slate-300"
                  key={outcome}
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300/85" />
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
        <section className="border-t border-white/10 py-7" id="why">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white sm:text-[27px]">
              Why cleaning businesses lose leads
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              It happens every day. BizPilot helps you fix it.
            </p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {lostReasons.map((reason) => (
              <div
                className="rounded-[14px] border border-white/10 bg-[var(--biz-page-surface)]/68 p-4 shadow-[0_16px_38px_rgba(0,0,0,0.14)]"
                key={reason.title}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-300/18 bg-emerald-500/[0.075] text-sm font-semibold text-emerald-200">
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
        <section className="border-t border-white/10 py-7" id="how-it-works">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white sm:text-[27px]">
              How BizPilot works
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              A simple system to recover more leads and win more jobs.
            </p>
          </div>
          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {demoSteps.map((step, index) => (
              <div
                className="grid gap-3 rounded-[14px] border border-white/10 bg-[var(--biz-page-surface)]/68 p-4 shadow-[0_16px_38px_rgba(0,0,0,0.14)] sm:grid-cols-[3rem_1fr] lg:grid-cols-1"
                key={step.title}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-300/18 bg-emerald-500/[0.075] text-sm font-semibold text-emerald-200">
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
        <section className="border-t border-white/10 py-7" id="cta">
          <div className="overflow-hidden rounded-[16px] border border-white/10 bg-[linear-gradient(90deg,rgba(4,120,87,0.15),rgba(18,31,45,0.92))] p-5 shadow-[0_20px_55px_rgba(0,0,0,0.22)] sm:p-6">
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
