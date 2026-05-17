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
    "Capture cleaner quote requests from one branded link.",
    "See which leads need a reply or follow-up now.",
    "Prepare owner-reviewed AI reply drafts without auto-sending.",
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
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-12">
        <section className="grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-zinc-500">
              Quote Recovery Command Center
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-normal text-zinc-950 sm:text-5xl">
              Stop losing cleaning quotes in scattered messages.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600">
              BizPilot gives cleaning businesses a branded quote link, organizes
              every request into a focused lead desk, and prepares safe reply
              drafts the owner reviews before sending.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="rounded-[10px] bg-zinc-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
                href="/dashboard"
              >
                See Quote Recovery
              </Link>
              <Link
                className="rounded-[10px] border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50"
                href="/auth/sign-in"
              >
                Sign in
              </Link>
            </div>
            <div className="mt-8 grid gap-2">
              {outcomes.map((outcome) => (
                <div
                  className="flex items-start gap-2 text-sm leading-6 text-zinc-700"
                  key={outcome}
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[14px] border border-zinc-200 bg-white p-4 shadow-[0_18px_45px_rgba(24,24,27,0.08)]">
            <div className="flex items-center justify-between gap-3 border-b border-zinc-200 pb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-normal text-zinc-500">
                  Magic demo
                </p>
                <h2 className="mt-1 text-base font-semibold text-zinc-950">
                  From messy quote to next action
                </h2>
              </div>
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800">
                Sample
              </span>
            </div>
            <div className="mt-4 grid gap-3">
              {demoSteps.map((step, index) => (
                <div
                  className="grid grid-cols-[2rem_1fr] gap-3 rounded-[10px] border border-zinc-200 bg-zinc-50 p-3"
                  key={step}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-950 text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-zinc-700">{step}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 rounded-[10px] border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">
              The customer still receives messages from the owner, not from an
              autonomous AI system.
            </p>
          </aside>
        </section>

        <section className="mt-10 grid gap-4 border-t border-zinc-200 pt-6 sm:grid-cols-3">
          {links.map((item) => (
            <Link
              className="rounded-[12px] border border-zinc-200 bg-white p-4 text-sm shadow-sm transition hover:bg-zinc-50"
              href={item.href}
              key={item.href}
            >
              <span className="block font-semibold text-zinc-950">
                {item.label}
              </span>
              <span className="mt-2 block leading-6 text-zinc-600">
                {item.description}
              </span>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
