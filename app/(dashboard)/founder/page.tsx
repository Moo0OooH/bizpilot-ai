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
 * Last Updated: 2026-07-11
 * Change Log:
 * - 2026-07-11: Moved founder handoff labels and safety-gate copy into the bilingual dashboard dictionary.
 * - 2026-07-05: Removed stale placeholder wording from founder handoff history.
 * - 2026-05-18: Created original founder handoff shell.
 * - 2026-05-19: Matched approved index.html Founder Admin layout.
 * - 2026-06-27: Rebuilt as a clean handoff to the primary Founder Admin console.
 * - 2026-07-05: Aligned blocked-gate language with customer account safety copy.
 * - 2026-07-05: Gated founder handoff access behind the founder allowlist.
 * ============================================================
 */

import Link from "next/link";
import { cookies } from "next/headers";
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
import { getBizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import {
  INTERFACE_LANGUAGE_COOKIE,
  resolveWorkspaceInterfaceLanguage,
} from "@/lib/i18n/language";
import { getCurrentUser } from "@/server/services/auth.service";
import { getBusinessWorkspace } from "@/server/services/business.service";
import { isFounderUser } from "@/server/services/founder-admin.service";

export const dynamic = "force-dynamic";

export default async function FounderConsolePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  if (!isFounderUser(user)) {
    redirect("/dashboard");
  }

  const [workspace, cookieStore] = await Promise.all([
    getBusinessWorkspace({ userId: user.id }),
    cookies(),
  ]);
  const activeLanguage = resolveWorkspaceInterfaceLanguage({
    businessLanguage: workspace.businesses[0]?.preferred_language,
    cookieLanguage: cookieStore.get(INTERFACE_LANGUAGE_COOKIE)?.value,
  });
  const dashboardCopy = getBizPilotCopy(activeLanguage).dashboard;
  const founderCopy = dashboardCopy.founderHandoff;
  const accessibleBusinesses = workspace.businesses;
  const adminSurfaces = [
    {
      description: founderCopy.surfaces.founderAdminDescription,
      href: "/admin",
      label: founderCopy.statuses.primaryConsole,
      title: founderCopy.surfaces.founderAdminTitle,
      tone: "emerald",
    },
    {
      description: founderCopy.surfaces.dashboardDescription,
      href: "/dashboard",
      label: founderCopy.statuses.ownerScope,
      title: founderCopy.surfaces.dashboardTitle,
      tone: "blue",
    },
    {
      description: founderCopy.surfaces.currentDescription,
      href: "/founder",
      label: founderCopy.statuses.handoff,
      title: founderCopy.surfaces.currentTitle,
      tone: "amber",
    },
  ] as const;
  const blockedGates = founderCopy.blockedGates;

  return (
    <main className="space-y-4">
      <PageHeader
        actions={
          <>
            <Link className={primaryButtonClass} href="/admin">
              {founderCopy.actions.openFounderAdmin}
            </Link>
            <Link className={buttonClass} href="/dashboard">
              {founderCopy.actions.ownerDashboard}
            </Link>
          </>
        }
        description={founderCopy.description}
        eyebrow={founderCopy.eyebrow}
        title={dashboardCopy.pages.founder.title}
      />

      <section className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          detail={founderCopy.metrics.accessibleWorkspacesDetail}
          label={founderCopy.metrics.accessibleWorkspacesLabel}
          tone="emerald"
          value={accessibleBusinesses.length}
        />
        <MetricCard
          detail={founderCopy.metrics.primaryAdminDetail}
          label={founderCopy.metrics.primaryAdminLabel}
          tone="blue"
          value="/admin"
        />
        <MetricCard
          detail={founderCopy.metrics.ownerWorkflowDetail}
          label={founderCopy.metrics.ownerWorkflowLabel}
          tone="neutral"
          value="/dashboard"
        />
        <MetricCard
          detail={founderCopy.metrics.blockedGatesDetail}
          label={founderCopy.metrics.blockedGatesLabel}
          tone="red"
          value={blockedGates.length}
        />
      </section>

      <DashboardCard className="p-4 sm:p-5" variant="elevated">
        <SectionHeader
          description={founderCopy.surfaceMap.description}
          title={founderCopy.surfaceMap.title}
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
            description={founderCopy.workspacePreview.description}
            title={founderCopy.workspacePreview.title}
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
                    {founderCopy.actions.previewQuote}
                  </Link>
                  <Link
                    className={buttonClass}
                    href={`/admin?businessId=${encodeURIComponent(business.id)}`}
                  >
                    {founderCopy.actions.adminControls}
                  </Link>
                </div>
              ))
            ) : (
              <p className="bg-[var(--dash-surface-muted)] px-4 py-6 text-center text-sm text-[var(--dash-text-secondary)]">
                {founderCopy.emptyState}
              </p>
            )}
          </div>
        </DashboardCard>

        <DashboardCard className="p-4 sm:p-5" variant="default">
          <SectionHeader
            action={<StatusBadge tone="red">{founderCopy.statuses.blocked}</StatusBadge>}
            description={founderCopy.safetyGates.description}
            title={founderCopy.safetyGates.title}
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
