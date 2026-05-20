/**
 * ============================================================
 * File: app/(dashboard)/dashboard/settings/page.tsx
 * Project: BizPilot AI
 * Description: Owner workspace settings — account, theme, future sections.
 * Role: Three-card layout matching the approved index.html. Account exposes sign-out; theme uses the hydration-safe DashboardThemeSelector; future sections are visible as disabled roadmap placeholders per the v1.6 Not-Now list.
 * Related:
 * - components/dashboard/dashboard-theme.tsx
 * - server/actions/auth.actions.ts
 * - docs/BIZPILOT_STRATEGIC_ALIGNMENT_UPDATE_v1.6.md
 * Author: MoOoH
 * Created: 2026-05-18
 * Last Updated: 2026-05-19
 * Change Log:
 * - 2026-05-18: Created Settings shell.
 * - 2026-05-19: Rebuilt as three-card row exactly matching the index — Account, Theme, Future — and added a sticky workspace-info side panel + scope guard.
 * ============================================================
 */

import { redirect } from "next/navigation";

import { DashboardThemeSelector } from "@/components/dashboard/dashboard-theme";
import {
  buttonClass,
  DashboardCard,
  disabledButtonClass,
  PageHeader,
  primaryButtonClass,
  SectionHeader,
  StatusBadge,
} from "@/components/dashboard/dashboard-ui";
import { signOutAction } from "@/server/actions/auth.actions";
import { getCurrentUser } from "@/server/services/auth.service";
import { getBusinessWorkspace } from "@/server/services/business.service";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");

  const workspace = await getBusinessWorkspace({ userId: user.id });
  const activeBusiness = workspace.businesses[0];
  if (!activeBusiness) redirect("/dashboard");

  return (
    <main className="space-y-4">
      <PageHeader
        description="Workspace, account, theme, and future billing/team sections."
        eyebrow="Workspace"
        title="Settings"
      />

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-4">
          <section className="grid min-w-0 gap-4 md:grid-cols-3">
            <DashboardCard className="p-[22px]" variant="elevated">
              <SectionHeader title="Account" />
              <div className="my-3 h-px bg-[var(--dash-border)]" />
              <div className="space-y-3">
                <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--dash-text-muted)]">
                    Signed in as
                  </p>
                  <p className="mt-1 break-all text-sm font-extrabold text-[var(--dash-text)]">
                    {user.email ?? user.id}
                  </p>
                </div>
                <form action={signOutAction}>
                  <button className={`${buttonClass} w-full`} type="submit">
                    Sign out
                  </button>
                </form>
              </div>
            </DashboardCard>

            <DashboardCard className="p-[22px]">
              <SectionHeader
                description="Hydration-safe theme. Initial value is resolved from a cookie server-side so the first paint never flashes."
                title="Theme"
              />
              <div className="my-3 h-px bg-[var(--dash-border)]" />
              <div className="flex flex-col gap-3">
                <DashboardThemeSelector />
                <p className="text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                  Keep dark mode as the default for the operational
                  command-center feel. Light mode is available for daytime use.
                </p>
              </div>
            </DashboardCard>

            <DashboardCard className="p-[22px]">
              <SectionHeader
                description="Visible as roadmap placeholders, disabled before validation."
                title="Future sections"
              />
              <div className="my-3 h-px bg-[var(--dash-border)]" />
              <div className="space-y-2">
                {[
                  ["Billing", "Stripe Payment Links first"],
                  ["Team members", "Owner-only in pilot"],
                  ["Integrations", "Webhooks deferred"],
                ].map(([title, hint]) => (
                  <div
                    className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3"
                    key={title}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-extrabold text-[var(--dash-text)]">
                        {title}
                      </p>
                      <StatusBadge>Future</StatusBadge>
                    </div>
                    <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                      {hint}
                    </p>
                    <button
                      className={`${disabledButtonClass} mt-3 w-full`}
                      type="button"
                    >
                      Not in MVP
                    </button>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </section>

          <DashboardCard className="p-[22px]">
            <SectionHeader
              description="What stays on while the pilot validates. Anything below is intentionally locked."
              title="Phase 18A guardrails"
            />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                "No auto-send (AI drafts only; owner copies and sends manually).",
                "No invented pricing or availability.",
                "No booking, invoices, SMS, WhatsApp, or full CRM expansion.",
                "Cleaning-first vertical until 3 paying/payment-ready businesses.",
              ].map((item) => (
                <p
                  className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3 text-[13px] leading-6 text-[var(--dash-text-secondary)]"
                  key={item}
                >
                  {item}
                </p>
              ))}
            </div>
          </DashboardCard>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-[92px]">
          <DashboardCard className="p-[22px]" variant="priority">
            <SectionHeader title="Workspace" />
            <div className="my-3 h-px bg-[var(--dash-border)]" />
            <div className="space-y-3">
              <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--dash-text-muted)]">
                  Business
                </p>
                <p className="mt-1 truncate text-sm font-extrabold text-[var(--dash-text)]">
                  {activeBusiness.name}
                </p>
                <p className="mt-0.5 break-all text-[12px] text-[var(--dash-text-muted)]">
                  /{activeBusiness.slug}
                </p>
              </div>
              <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--dash-text-muted)]">
                  Plan
                </p>
                <p className="mt-1 text-sm font-extrabold text-[var(--dash-text)]">
                  Pilot
                </p>
                <p className="mt-0.5 text-[12px] text-[var(--dash-text-muted)]">
                  Manual billing during Phase 18A.
                </p>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard className="p-[22px]">
            <SectionHeader title="Quick links" />
            <div className="mt-3 grid gap-2">
              <a className={buttonClass} href="/dashboard/configuration">
                Quote Setup
              </a>
              <a className={buttonClass} href="/dashboard/business-profile">
                Business Profile
              </a>
              <a className={primaryButtonClass} href="/dashboard/leads">
                Open Lead Queue
              </a>
            </div>
          </DashboardCard>
        </aside>
      </section>
    </main>
  );
}
