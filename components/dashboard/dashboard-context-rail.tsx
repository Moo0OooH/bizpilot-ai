/**
 * ============================================================
 * File: components/dashboard/dashboard-context-rail.tsx
 * Project: BizPilot AI
 * Description: Renders adaptive right-side dashboard context.
 * Role: Shows workspace readiness, quote link access, and contextual operational prompts.
 * Related:
 * - components/dashboard/dashboard-shell.tsx
 * Author: MoOoH
 * Created: 2026-05-10
 * Last Updated: 2026-05-10
 * Change Log:
 * - 2026-05-10: Added reusable SaaS context rail.
 * ============================================================
 */

import Link from "next/link";

import { buttonClass, DashboardCard, SectionHeader } from "./dashboard-ui";

type DashboardContextRailProps = Readonly<{
  activeBusinessName: string;
  businessSlug: string;
  readinessCompleted: number;
  readinessTotal: number;
}>;

export function DashboardContextRail({
  activeBusinessName,
  businessSlug,
  readinessCompleted,
  readinessTotal,
}: DashboardContextRailProps) {
  const readinessPercent = Math.round(
    (readinessCompleted / Math.max(readinessTotal, 1)) * 100,
  );

  return (
    <aside className="hidden 2xl:block">
      <div className="sticky top-[4.5rem] space-y-3">
        <DashboardCard className="p-3">
          <SectionHeader
            description={`${readinessCompleted}/${readinessTotal} setup items complete`}
            title="Workspace readiness"
          />
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-zinc-950"
              style={{ width: `${readinessPercent}%` }}
            />
          </div>
          <Link
            className={`${buttonClass} mt-3 w-full`}
            href="/dashboard/configuration#setup-checklist"
          >
            Review setup
          </Link>
        </DashboardCard>

        <DashboardCard className="p-3">
          <SectionHeader
            description="Customer-facing quote request flow"
            title="Public quote link"
          />
          <p className="mt-3 break-all rounded-md bg-zinc-50 p-2 text-xs text-zinc-600">
            /quote/{businessSlug}
          </p>
          <Link className={`${buttonClass} mt-3 w-full`} href={`/quote/${businessSlug}`}>
            Preview link
          </Link>
        </DashboardCard>

        <DashboardCard className="p-3">
          <SectionHeader title="Next best action" />
          <p className="mt-2 text-xs leading-5 text-zinc-600">
            Keep {activeBusinessName} ready by reviewing open lead actions, then
            preview the quote link after configuration updates.
          </p>
        </DashboardCard>
      </div>
    </aside>
  );
}
