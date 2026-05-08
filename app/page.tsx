/**
 * ============================================================
 * File: app/page.tsx
 * Project: BizPilot AI
 * Description: Renders the current Phase 5 project status home screen.
 * Role: Links owners to the dashboard, Lead Conversion Desk, and sign-in flow.
 * Related:
 * - app/layout.tsx
 * - app/globals.css
 * Author: MoOoH
 * Created: 2026-05-02
 * Last Updated: 2026-05-06
 * Change Log:
 * - 2026-05-04: Added standard project file header.
 * - 2026-05-04: Aligned foundation page typography with UI standards.
 * - 2026-05-04: Updated home screen status for Phase 2 tenant foundation.
 * - 2026-05-05: Updated home screen status for Phase 3 configuration foundation.
 * - 2026-05-06: Updated home screen status for Phase 4 public intake foundation.
 * - 2026-05-08: Updated home screen for Phase 5 and added useful navigation links.
 * ============================================================
 */

import Link from "next/link";

export default function Home() {
  const links = [
    {
      description: "Configure business profile, branding, services, consent, and quote link.",
      href: "/dashboard",
      label: "Business dashboard",
    },
    {
      description: "Review captured quote requests, actions, outcomes, and proof metrics.",
      href: "/dashboard/leads",
      label: "Lead Conversion Desk",
    },
    {
      description: "Access the protected owner workspace.",
      href: "/auth/sign-in",
      label: "Sign in",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16">
        <p className="text-sm font-medium uppercase tracking-normal text-zinc-500">
          BizPilot AI
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
          Phase 5 Lead Conversion Desk
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600">
          Public quote capture is live. Owners can now review leads, see
          rule-based quality and missing info, manage follow-up actions, and
          track manual outcomes before AI drafts are added in Phase 6.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            className="bg-zinc-950 px-5 py-3 text-sm font-medium text-white"
            href="/dashboard/leads"
          >
            Open Lead Desk
          </Link>
          <Link
            className="border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-800"
            href="/dashboard"
          >
            Open Dashboard
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {links.map((item) => (
            <Link
              key={item.href}
              className="border border-zinc-200 bg-white p-4 text-sm hover:bg-zinc-50"
              href={item.href}
            >
              <span className="block font-medium text-zinc-950">
                {item.label}
              </span>
              <span className="mt-2 block leading-6 text-zinc-600">
                {item.description}
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
