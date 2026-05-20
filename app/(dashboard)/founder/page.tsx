/**
 * ============================================================
 * File: app/(dashboard)/founder/page.tsx
 * Project: BizPilot AI
 * Description: Founder Admin Console — Phase 18B pilot tracking shell.
 * Role: Internal-only surface for the founder to monitor pilot businesses, validation signals, and outreach progress. NOT customer-facing.
 * Related:
 * - docs/operations/BIZPILOT_PHASE_18_PILOT_OPERATING_GUIDE_v1.0.md
 * - docs/operations/BIZPILOT_STRATEGIC_ALIGNMENT_IMPLEMENTATION_CHECKLIST_v1.6.md
 * - artifacts/phase18/BizPilot_Phase18_Founder_CRM_Template.xlsx
 * Author: MoOoH
 * Created: 2026-05-18
 * Last Updated: 2026-05-19
 * Change Log:
 * - 2026-05-18: Created Phase 18B shell with single-tenant placeholder.
 * - 2026-05-19: Matched approved index.html Founder Admin layout: header with "Not owner-facing" badge, 4 metric cards, pilot tracking table, and explicit reminder that founder-only authorization is required before cross-tenant aggregation lands.
 * ============================================================
 */

import Link from "next/link";
import { redirect } from "next/navigation";

import {
  buttonClass,
  DashboardCard,
  MetricCard,
  PageHeader,
  SectionHeader,
  StatusBadge,
} from "@/components/dashboard/dashboard-ui";
import { getCurrentUser } from "@/server/services/auth.service";
import { getBusinessWorkspace } from "@/server/services/business.service";

export const dynamic = "force-dynamic";

export default async function FounderConsolePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const workspace = await getBusinessWorkspace({ userId: user.id });
  const accessibleBusinesses = workspace.businesses;

  return (
    <main className="space-y-4">
      <PageHeader
        actions={<StatusBadge tone="amber">Not owner-facing</StatusBadge>}
        description="Phase 18B shell for founder-led pilot tracking. Cross-tenant aggregation will land once a founder-only policy and tenant-safe service exist. Use the Founder CRM workbook for live pilot notes."
        eyebrow="Phase 18B - Internal"
        title="Founder Admin Console"
      />

      <section className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          detail="Connected to the current accessible workspace only."
          label="Pilot businesses"
          tone="emerald"
          value={accessibleBusinesses.length}
        />
        <MetricCard
          detail="Activates after founder-only aggregation lands."
          label="Active quote links"
          tone="blue"
          value="TBD"
        />
        <MetricCard
          detail="Tracked manually in the Founder CRM workbook today."
          label="Leads captured"
          tone="amber"
          value="TBD"
        />
        <MetricCard
          detail="Validation signal: 3 needed to clear the validation gate."
          label="Payment ready"
          tone="neutral"
          value="TBD"
        />
      </section>

      <DashboardCard className="p-[22px]" variant="elevated">
        <SectionHeader
          action={
            <Link className={buttonClass} href="/dashboard">
              Back to Owner Dashboard
            </Link>
          }
          description="This table is intentionally limited until founder-only authorization and tenant-safe aggregation are wired."
          title="Pilot tracking"
        />

        <div className="mt-4 overflow-hidden rounded-[16px] border border-[var(--dash-border)]">
          <div className="hidden grid-cols-[minmax(180px,1.2fr)_120px_130px_120px_120px_minmax(180px,1fr)] border-b border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3.5 py-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--dash-text-muted)] lg:grid">
            <span>Business</span>
            <span>Status</span>
            <span>Quote link</span>
            <span>Leads</span>
            <span>AI usage</span>
            <span>Pilot note</span>
          </div>

          {accessibleBusinesses.length > 0 ? (
            accessibleBusinesses.map((business) => (
              <div
                className="grid gap-3 border-b border-[var(--dash-border)] px-3.5 py-3 text-[13px] last:border-b-0 lg:grid-cols-[minmax(180px,1.2fr)_120px_130px_120px_120px_minmax(180px,1fr)] lg:items-center"
                key={business.id}
              >
                <span className="min-w-0">
                  <span className="block truncate font-extrabold text-[var(--dash-text)]">
                    {business.name}
                  </span>
                  <span className="mt-0.5 block truncate text-[12px] text-[var(--dash-text-muted)]">
                    /{business.slug}
                  </span>
                </span>
                <StatusBadge tone="amber">Pilot</StatusBadge>
                <Link className={`${buttonClass} max-w-[110px]`} href={`/quote/${business.slug}`}>
                  Open link
                </Link>
                <span className="text-[var(--dash-text-secondary)]">
                  Owner scope only
                </span>
                <span className="text-[var(--dash-text-secondary)]">
                  Owner scope only
                </span>
                <span className="text-[var(--dash-text-muted)]">
                  Add founder note in CRM workbook.
                </span>
              </div>
            ))
          ) : (
            <p className="px-3.5 py-6 text-center text-[13px] text-[var(--dash-text-muted)]">
              No businesses accessible to this account yet.
            </p>
          )}
        </div>
      </DashboardCard>

      <DashboardCard className="p-[22px]" variant="priority">
        <SectionHeader
          description="The MVP keeps founder operations boring and safe. Anything below stays manual until pilot validation justifies automation."
          title="Phase 18B scope guard"
        />
        <ul className="mt-4 grid gap-2 text-[13px] leading-6 text-[var(--dash-text-secondary)] sm:grid-cols-2">
          <li className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
            <span className="font-bold text-[var(--dash-text)]">
              Founder CRM:
            </span>{" "}
            <code>artifacts/phase18/BizPilot_Phase18_Founder_CRM_Template.xlsx</code>
          </li>
          <li className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
            <span className="font-bold text-[var(--dash-text)]">
              Cross-tenant queries:
            </span>{" "}
            blocked until a founder-only RLS policy is reviewed.
          </li>
          <li className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
            <span className="font-bold text-[var(--dash-text)]">
              Not-now list still active:
            </span>{" "}
            no booking, billing automation, autonomous sending, second vertical, or full CRM expansion before the validation gate.
          </li>
          <li className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
            <span className="font-bold text-[var(--dash-text)]">
              Validation gate:
            </span>{" "}
            3+ paying / payment-ready cleaning businesses with repeat weekly usage.
          </li>
        </ul>
      </DashboardCard>
    </main>
  );
}
