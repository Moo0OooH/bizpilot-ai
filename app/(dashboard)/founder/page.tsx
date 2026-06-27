/**
 * ============================================================
 * File: app/(dashboard)/founder/page.tsx
 * Project: BizPilot AI
 * Description: Internal founder operations handoff inside the owner shell.
 * Role: Separates the primary founder admin console from owner dashboard workflows.
 * Related:
 * - app/admin/page.tsx
 * - docs/readiness/BIZPILOT_DASHBOARD_MARKETING_SEO_OPERATING_STANDARD_2026-06-27.md
 * Author: MoOoH
 * Created: 2026-05-18
 * Last Updated: 2026-06-27
 * Change Log:
 * - 2026-05-18: Created original founder placeholder.
 * - 2026-05-19: Matched approved index.html Founder Admin layout.
 * - 2026-06-27: Rebuilt as a clean handoff to the primary Founder Admin console.
 * ============================================================
 */

import Link from "next/link";
import { redirect } from "next/navigation";

import {
  buttonClass,
  DashboardCard,
  MetricCard,
  PageHeader,
  primaryButtonClass,
  SectionHeader,
  StatusBadge,
} from "@/components/dashboard/dashboard-ui";
import { getCurrentUser } from "@/server/services/auth.service";
import { getBusinessWorkspace } from "@/server/services/business.service";

export const dynamic = "force-dynamic";

const adminSurfaces = [
  {
    description:
      "Cross-workspace businesses, plans, quote links, notes, cleanup gates, and audit trail.",
    href: "/admin",
    label: "Primary console",
    title: "Founder Admin",
    tone: "emerald",
  },
  {
    description:
      "Owner workflow for quote requests, manual AI draft review, setup, profile, and settings.",
    href: "/dashboard",
    label: "Owner scope",
    title: "Owner Dashboard",
    tone: "blue",
  },
  {
    description:
      "Current internal route: use it as an orientation page, not as the main admin surface.",
    href: "/founder",
    label: "Handoff",
    title: "This Page",
    tone: "amber",
  },
] as const;

const blockedGates = [
  "Production user deletion",
  "Invite, role, suspend, or remove member access",
  "Real customer data approval",
  "Paid pilot, billing, payment, and refund automation",
] as const;

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
        actions={
          <>
            <Link className={primaryButtonClass} href="/admin">
              Open Founder Admin
            </Link>
            <Link className={buttonClass} href="/dashboard">
              Owner dashboard
            </Link>
          </>
        }
        description="Internal handoff page for founder operations. The primary admin work happens in /admin; the owner dashboard stays focused on manual lead recovery."
        eyebrow="Founder Operations"
        title="Founder Admin Handoff"
      />

      <section className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          detail="Visible through the current signed-in workspace context."
          label="Accessible workspaces"
          tone="emerald"
          value={accessibleBusinesses.length}
        />
        <MetricCard
          detail="Use /admin for cross-workspace operational review."
          label="Primary admin"
          tone="blue"
          value="/admin"
        />
        <MetricCard
          detail="Manual lead recovery remains the customer-facing surface."
          label="Owner workflow"
          tone="neutral"
          value="/dashboard"
        />
        <MetricCard
          detail="Do not cross these without owner-approved readiness gates."
          label="Blocked gates"
          tone="red"
          value={blockedGates.length}
        />
      </section>

      <DashboardCard className="p-4 sm:p-5" variant="elevated">
        <SectionHeader
          description="Keep each surface clear: founder operations are internal, owner tools are manual-first, and customer quote forms stay public/intake-only."
          title="Admin surface map"
        />
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {adminSurfaces.map((surface) => (
            <Link
              className="grid min-h-[150px] gap-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-4 text-left transition hover:border-[var(--dash-primary-border)] hover:bg-[var(--dash-primary-soft)]"
              href={surface.href}
              key={surface.title}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-black text-[var(--dash-text)]">
                  {surface.title}
                </p>
                <StatusBadge tone={surface.tone}>{surface.label}</StatusBadge>
              </div>
              <p className="text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                {surface.description}
              </p>
            </Link>
          ))}
        </div>
      </DashboardCard>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.72fr)]">
        <DashboardCard className="p-4 sm:p-5" variant="priority">
          <SectionHeader
            action={<StatusBadge tone="blue">{accessibleBusinesses.length}</StatusBadge>}
            description="This is a safe, owner-scoped preview only. Use the primary Founder Admin for cross-workspace controls."
            title="Accessible workspace preview"
          />
          <div className="mt-4 divide-y divide-[var(--dash-border)] overflow-hidden rounded-lg border border-[var(--dash-border)]">
            {accessibleBusinesses.length > 0 ? (
              accessibleBusinesses.map((business) => (
                <div
                  className="grid gap-3 bg-[var(--dash-surface-muted)] px-3.5 py-3 text-[13px] md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center"
                  key={business.id}
                >
                  <div className="min-w-0">
                    <p className="truncate font-black text-[var(--dash-text)]">
                      {business.name}
                    </p>
                    <p className="mt-0.5 truncate text-[12px] font-bold text-[var(--dash-text-muted)]">
                      /{business.slug}
                    </p>
                  </div>
                  <Link className={buttonClass} href={`/quote/${business.slug}`}>
                    Preview quote
                  </Link>
                  <Link
                    className={buttonClass}
                    href={`/admin?businessId=${encodeURIComponent(business.id)}`}
                  >
                    Admin controls
                  </Link>
                </div>
              ))
            ) : (
              <p className="bg-[var(--dash-surface-muted)] px-4 py-6 text-center text-sm text-[var(--dash-text-secondary)]">
                No workspace is linked to this account yet.
              </p>
            )}
          </div>
        </DashboardCard>

        <DashboardCard className="p-4 sm:p-5" variant="default">
          <SectionHeader
            action={<StatusBadge tone="red">Blocked</StatusBadge>}
            description="These remain gated by the project operating standard and must not be blended into normal dashboard polish."
            title="Safety gates"
          />
          <ul className="mt-4 grid gap-2 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
            {blockedGates.map((gate) => (
              <li
                className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3 font-bold"
                key={gate}
              >
                {gate}
              </li>
            ))}
          </ul>
        </DashboardCard>
      </div>
    </main>
  );
}
