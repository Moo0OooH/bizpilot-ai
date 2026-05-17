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
 * ============================================================
 */

import Link from "next/link";

export default function Home() {
  const outcomes = [
    "AI-assisted replies",
    "Follow-up reminders",
    "Lead recovery",
  ];
  const lostReasons = [
    {
      detail: "Customers move on when replies take too long.",
      title: "Slow replies",
    },
    {
      detail: "Quote requests get buried in chats and inboxes.",
      title: "Messy DMs and emails",
    },
    {
      detail: "You forget to follow up and lose the job.",
      title: "Missed follow-ups",
    },
    {
      detail: "Details are incomplete or hard to track.",
      title: "Quote chaos",
    },
  ];
  const demoSteps = [
    "Customer submits a cleaning quote request.",
    "BizPilot organizes the lead and highlights missing details.",
    "Owner reviews a reply draft, copies it, and follows up manually.",
  ];
  const links = [
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
  ];

  return (
    <div className="min-h-screen bg-[#07101a] text-white">
      <main className="mx-auto w-full max-w-6xl px-6 py-5">
        <nav className="flex h-12 items-center justify-between">
          <Link className="flex items-center gap-2 font-semibold" href="/">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-xs">
              BP
            </span>
            BizPilot
          </Link>
          <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#cleaning">For Cleaning Businesses</a>
          </div>
          <Link
            className="rounded-[10px] bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
            href="/auth/sign-in"
          >
            Get Early Access
          </Link>
        </nav>

        <section className="grid min-h-[560px] gap-8 py-16 lg:grid-cols-[1fr_27rem] lg:items-center">
          <div>
            <p className="inline-flex rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-medium text-slate-300">
              For cleaning businesses
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-normal sm:text-5xl">
              <span className="text-white">Stop losing cleaning </span>
              <span className="text-emerald-400">quote requests.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              BizPilot helps cleaning businesses respond faster, organize new
              quote requests, and follow up before customers disappear.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="rounded-[10px] bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
                href="/dashboard"
              >
                Start Recovering Leads
              </Link>
              <Link
                className="rounded-[10px] border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-white/[0.08]"
                href="/dashboard"
              >
                See Demo
              </Link>
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

          <aside className="rounded-[16px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_24px_65px_rgba(0,0,0,0.32)]">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-normal text-slate-400">
                  Needs Reply
                </p>
                <h2 className="mt-1 text-base font-semibold text-white">
                  New quote requests
                </h2>
              </div>
              <span className="rounded-full border border-red-400/20 bg-red-500/15 px-2 py-1 text-xs font-medium text-red-300">
                3
              </span>
            </div>
            <div className="mt-4 grid gap-3">
              {["Sarah J. - Move-out cleaning", "Mike R. - Deep cleaning", "Emily K. - Regular cleaning"].map((lead, index) => (
                <div
                  className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 rounded-[10px] border border-white/10 bg-black/20 p-3"
                  key={lead}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">
                    {lead.charAt(0)}
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-white">
                      {lead}
                    </span>
                    <span className="text-xs text-slate-400">
                      {index === 0 ? "2h ago" : index === 1 ? "5h ago" : "8h ago"}
                    </span>
                  </span>
                  <span className="text-slate-500">›</span>
                </div>
              ))}
            </div>
            <Link
              className="mt-4 inline-flex w-full items-center justify-center rounded-[10px] border border-white/10 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/[0.06]"
              href="/dashboard/leads"
            >
              View all leads
            </Link>
          </aside>
        </section>

        <section
          className="border-t border-white/10 py-10"
          id="features"
        >
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white">
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
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-400/25 bg-emerald-500/10 text-emerald-300">
                  ✓
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

        <section className="grid gap-6 border-t border-white/10 py-10 lg:grid-cols-[20rem_1fr]" id="how-it-works">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-emerald-300">
              How it works
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              From quote request to clear next action.
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {demoSteps.map((step, index) => (
              <div
                className="rounded-[14px] border border-white/10 bg-white/[0.04] p-4"
                key={step}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <p className="mt-4 text-sm leading-6 text-slate-300">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 py-10" id="cleaning">
          <div className="rounded-[18px] border border-white/10 bg-white/[0.05] p-5 md:p-7">
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
              <Link
                className="inline-flex h-11 items-center justify-center rounded-[10px] bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-500"
                href="/dashboard"
              >
                See Demo
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 border-t border-white/10 py-8 sm:grid-cols-3">
          {links.map((item) => (
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
