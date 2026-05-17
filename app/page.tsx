/**
 * ============================================================
 * File: app/page.tsx
 * Project: BizPilot AI
 * Description: Renders the public pain-first BizPilot AI landing page.
 * Role: Explains the cleaning quote recovery offer and routes owners to demo/sign-in flows.
 * Related:
 * - app/layout.tsx
 * - app/globals.css
 * Author: MoOoH
 * Created: 2026-05-02
 * Last Updated: 2026-05-17
 * Change Log:
 * - 2026-05-04: Added standard project file header.
 * - 2026-05-04: Aligned foundation page typography with UI standards.
 * - 2026-05-04: Updated home screen status for Phase 2 tenant foundation.
 * - 2026-05-05: Updated home screen status for Phase 3 configuration foundation.
 * - 2026-05-06: Updated home screen status for Phase 4 public intake foundation.
 * - 2026-05-08: Updated home screen for Phase 5 and added useful navigation links.
 * - 2026-05-17: Rewrote the page around cleaning quote recovery and pilot-demo clarity.
 * - 2026-05-17: Tightened responsive landing structure, sections, and calm visual hierarchy.
 * ============================================================
 */

import Link from "next/link";
import type { ReactNode } from "react";

const outcomes = [
  "AI-assisted replies",
  "Follow-up reminders",
  "Lead recovery",
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
  ["New Quote Requests", "7", "text-emerald-300", "30% vs last 7 days"],
  ["Needs Reply", "4", "text-red-300", "Urgent attention"],
  ["At Risk", "3", "text-amber-300", "May be lost soon"],
  ["AI Drafts Ready", "5", "text-violet-300", "Ready for review"],
] as const;

const quickLinks = [
  {
    description: "See the recovery queue, quote link, and next best actions.",
    href: "/dashboard",
    label: "Open Dashboard",
  },
  {
    description: "Review captured quote requests, reply risk, and outcomes.",
    href: "/dashboard/leads",
    label: "Open Lead Desk",
  },
  {
    description: "Access the protected owner workspace.",
    href: "/auth/sign-in",
    label: "Sign in",
  },
] as const;

function PrimaryCta({
  children,
  href = "/dashboard",
}: Readonly<{ children: ReactNode; href?: string }>) {
  return (
    <Link
      className="inline-flex h-12 items-center justify-center rounded-[10px] bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 sm:min-w-[210px]"
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
      className="inline-flex h-12 items-center justify-center rounded-[10px] border border-white/15 bg-white/[0.04] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-white/[0.08] sm:min-w-[150px]"
      href={href}
    >
      {children}
    </Link>
  );
}

function DashboardPreview() {
  return (
    <aside className="overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.055] shadow-[0_24px_65px_rgba(0,0,0,0.34)]">
      <div className="grid lg:grid-cols-[9.5rem_1fr]">
        <div className="hidden border-r border-white/10 bg-black/20 p-4 lg:block">
          <div className="flex items-center gap-2 font-semibold">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-600 text-[10px]">
              BP
            </span>
            BizPilot
          </div>
          <div className="mt-7 grid gap-2 text-xs text-slate-300">
            {["Overview", "Leads", "Quote Setup", "Follow Ups"].map(
              (item, index) => (
                <div
                  className={
                    index === 0
                      ? "rounded-[9px] bg-white/[0.08] px-3 py-2 font-medium text-white"
                      : "rounded-[9px] px-3 py-2"
                  }
                  key={item}
                >
                  {item}
                </div>
              ),
            )}
          </div>
          <div className="mt-24 text-xs text-slate-400">
            <p className="font-medium text-white">Demo Cleaning Co.</p>
            <p className="mt-1">Owner</p>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-normal text-slate-400">
                Dashboard preview
              </p>
              <h2 className="mt-1 text-xl font-semibold text-white">
                Good morning, Alex
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Here&apos;s what needs your attention today.
              </p>
            </div>
            <Link
              className="inline-flex h-9 items-center justify-center rounded-[9px] bg-emerald-600 px-3 text-xs font-semibold text-white"
              href="/dashboard/leads"
            >
              Review Leads
            </Link>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {priorityCards.map(([label, value, tone, detail]) => (
              <div
                className="rounded-[12px] border border-white/10 bg-black/18 p-3"
                key={label}
              >
                <p className="text-xs font-semibold text-white">{label}</p>
                <p className={`mt-2 text-3xl font-semibold ${tone}`}>{value}</p>
                <p className="mt-1 text-xs text-slate-400">{detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 xl:grid-cols-[1.35fr_0.9fr]">
            <div className="rounded-[12px] border border-white/10 bg-black/18 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">
                  Priority: At Risk Leads
                </p>
                <span className="text-slate-500">-&gt;</span>
              </div>
              <div className="mt-3 divide-y divide-white/10">
                {[
                  ["Sarah J.", "Move-out cleaning - Friday", "High risk"],
                  ["David L.", "Deep cleaning - This weekend", "Medium risk"],
                ].map(([name, request, risk]) => (
                  <div
                    className="grid grid-cols-[1fr_auto] gap-3 py-3 text-sm"
                    key={name}
                  >
                    <span>
                      <span className="block font-medium text-white">{name}</span>
                      <span className="text-xs text-slate-400">{request}</span>
                    </span>
                    <span className="self-center rounded-full border border-amber-400/20 bg-amber-500/15 px-2 py-1 text-[11px] text-amber-200">
                      {risk}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[12px] border border-white/10 bg-black/18 p-3">
              <p className="text-sm font-semibold text-white">AI Draft Ready</p>
              <div className="mt-3 grid gap-3">
                {["Emily K.", "James T.", "Olivia M."].map((lead, index) => (
                  <div
                    className="grid grid-cols-[2rem_1fr_auto] items-center gap-2 text-sm"
                    key={lead}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">
                      {lead.charAt(0)}
                    </span>
                    <span>
                      <span className="block font-medium text-white">{lead}</span>
                      <span className="text-xs text-slate-400">
                        {index === 0 ? "Regular cleaning" : "Move-in cleaning"}
                      </span>
                    </span>
                    <span className="text-xs text-slate-400">{index + 1}h</span>
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

export default function Home() {
  return (
    <div className="min-h-screen bg-[#07101a] text-white">
      <main className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <nav className="flex min-h-12 items-center justify-between gap-3">
          <Link className="flex items-center gap-2 font-semibold" href="/">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-xs">
              BP
            </span>
            BizPilot
          </Link>
          <div className="hidden items-center gap-7 text-sm text-slate-300 lg:flex">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#cleaning">For Cleaning Businesses</a>
            <a href="#pricing">Pricing</a>
            <a href="#about">About</a>
          </div>
          <div className="flex items-center gap-2">
            <Link
              className="hidden rounded-[10px] border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-white/[0.08] sm:inline-flex"
              href="/dashboard"
            >
              See Demo
            </Link>
            <Link
              className="rounded-[10px] bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 sm:px-4"
              href="/auth/sign-in"
            >
              Get Early Access
            </Link>
          </div>
        </nav>

        <section className="grid gap-8 py-12 sm:py-16 lg:min-h-[590px] lg:grid-cols-[minmax(0,0.78fr)_minmax(28rem,0.92fr)] lg:items-center">
          <div>
            <p className="inline-flex rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-medium text-slate-300">
              For cleaning businesses
            </p>
            <h1 className="mt-5 max-w-3xl text-[40px] font-semibold leading-[1.05] tracking-normal sm:text-[56px] lg:text-[64px]">
              <span className="text-white">Stop losing cleaning </span>
              <span className="text-emerald-400">quote requests.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              BizPilot helps cleaning businesses respond faster, organize new
              quote requests, and follow up before customers disappear.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <PrimaryCta>Start Recovering Leads</PrimaryCta>
              <SecondaryCta>See Demo</SecondaryCta>
            </div>
            <div className="mt-8 flex flex-wrap gap-5">
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

        <section className="border-t border-white/10 py-10" id="features">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              Why cleaning businesses lose leads
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              It happens every day. BizPilot helps you fix it.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {lostReasons.map((reason) => (
              <div
                className="rounded-[14px] border border-white/10 bg-white/[0.04] p-4"
                key={reason.title}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-400/25 bg-emerald-500/10 text-sm font-semibold text-emerald-300">
                  {reason.icon}
                </span>
                <h3 className="mt-4 text-sm font-semibold text-white">
                  {reason.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {reason.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 py-10" id="how-it-works">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              How BizPilot works
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              A simple system to recover more leads and win more jobs.
            </p>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3 lg:items-stretch">
            {demoSteps.map((step, index) => (
              <div
                className="grid gap-4 rounded-[16px] border border-white/10 bg-white/[0.04] p-5 sm:grid-cols-[3.5rem_1fr] lg:grid-cols-1"
                key={step.title}
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-500/10 text-lg font-semibold text-emerald-300">
                  {index + 1}
                </span>
                <span>
                  <h3 className="text-lg font-semibold leading-6 text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {step.detail}
                  </p>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 py-10" id="cleaning">
          <div className="overflow-hidden rounded-[18px] border border-white/10 bg-[linear-gradient(90deg,rgba(16,185,129,0.16),rgba(255,255,255,0.05))] p-5 md:p-7">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Start recovering leads today.
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Built for founder-led setup with real cleaning businesses:
                  quote link, lead desk, safe AI drafts, and follow-up clarity.
                </p>
              </div>
              <PrimaryCta>Start Recovering Leads</PrimaryCta>
            </div>
          </div>
        </section>

        <section
          className="grid gap-4 border-t border-white/10 py-8 md:grid-cols-2"
          id="pricing"
        >
          <div className="rounded-[14px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm font-semibold uppercase tracking-normal text-emerald-300">
              Pilot offer
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Founder-led setup first.
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Early customers get concierge setup for quote link, services,
              branding basics, demo lead, and first-week workflow.
            </p>
          </div>
          <div
            className="rounded-[14px] border border-white/10 bg-white/[0.04] p-5"
            id="about"
          >
            <p className="text-sm font-semibold uppercase tracking-normal text-emerald-300">
              Owner-safe AI
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Drafts only. You stay in control.
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              BizPilot prepares concise reply and follow-up drafts. Owners
              review, copy, and send manually.
            </p>
          </div>
        </section>

        <section className="grid gap-4 border-t border-white/10 py-8 sm:grid-cols-3">
          {quickLinks.map((item) => (
            <Link
              className="rounded-[12px] border border-white/10 bg-white/[0.04] p-4 text-sm shadow-sm transition hover:bg-white/[0.07]"
              href={item.href}
              key={item.href}
            >
              <span className="block font-semibold text-white">{item.label}</span>
              <span className="mt-2 block leading-6 text-slate-400">
                {item.description}
              </span>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
