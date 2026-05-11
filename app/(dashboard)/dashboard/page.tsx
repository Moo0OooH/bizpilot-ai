/**
 * ============================================================
 * File: app/(dashboard)/dashboard/page.tsx
 * Project: BizPilot AI
 * Description: Renders the protected Dashboard Overview workspace.
 * Role: Summarizes active business readiness, lead actions, recent leads, and primary shortcuts.
 * Related:
 * - app/(dashboard)/layout.tsx
 * - server/services/lead-conversion.service.ts
 * - server/services/business-configuration.service.ts
 * Author: MoOoH
 * Created: 2026-05-10
 * Last Updated: 2026-05-10
 * Change Log:
 * - 2026-05-10: Created Dashboard Overview as the default protected app page.
 * ============================================================
 */

import Link from "next/link";
import { redirect } from "next/navigation";

import {
  buttonClass,
  DashboardCard,
  EmptyState,
  KpiCard,
  PageHeader,
  SectionHeader,
  StatusBadge,
} from "@/components/dashboard/dashboard-ui";
import { getCurrentUser } from "@/server/services/auth.service";
import { getBusinessConfigurationWorkspace } from "@/server/services/business-configuration.service";
import { getBusinessWorkspace } from "@/server/services/business.service";
import { getLeadConversionDesk } from "@/server/services/lead-conversion.service";

export const dynamic = "force-dynamic";

function formatDate(value: string | null): string {
  if (!value) {
    return "Not yet";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function label(value: string): string {
  return value.replaceAll("_", " ");
}

export default async function DashboardOverviewPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const workspace = await getBusinessWorkspace({
    userId: user.id,
  });
  const activeBusiness = workspace.businesses[0];

  if (!activeBusiness) {
    return (
      <main>
        <PageHeader
          description="No tenant business is available for this user yet."
          eyebrow="Overview"
          title="Dashboard"
        />
      </main>
    );
  }

  const [configurationWorkspace, desk] = await Promise.all([
    getBusinessConfigurationWorkspace({
      business: activeBusiness,
    }),
    getLeadConversionDesk({
      actorUserId: user.id,
      business: activeBusiness,
    }),
  ]);
  const { readiness } = configurationWorkspace;
  const recentLeads = desk.leads.slice(0, 5);
  const todaysActions = desk.todaysActions.slice(0, 5);
  const overdueLeads = desk.leads.filter(
    (item) => item.lead.response_sla_state === "overdue",
  ).length;

  return (
    <main className="space-y-5">
      <PageHeader
        actions={
          <>
            <Link className={buttonClass} href="/dashboard/configuration">
              Configure
            </Link>
            <Link className={buttonClass} href={`/quote/${activeBusiness.slug}`}>
              Preview quote link
            </Link>
          </>
        }
        description={`Monitor lead recovery, setup readiness, and conversion activity for ${activeBusiness.name}.`}
        eyebrow="Overview"
        title="Dashboard"
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard
          detail={activeBusiness.name}
          label="Active workspace"
          value="Ready"
        />
        <KpiCard
          detail="Business setup progress"
          label="Readiness"
          value={`${readiness.completed}/${readiness.total}`}
        />
        <KpiCard
          detail="Open today"
          label="Lead actions"
          value={desk.todaysActions.length}
        />
        <KpiCard
          detail="Need owner attention"
          label="Overdue leads"
          value={overdueLeads}
        />
        <KpiCard
          detail={`/quote/${activeBusiness.slug}`}
          label="Public quote link"
          value="Live"
        />
      </section>

      <section className="grid gap-3 xl:grid-cols-[1fr_1fr]">
        <DashboardCard className="p-3">
          <SectionHeader
            action={
              <Link className="text-xs font-medium text-zinc-700" href="/dashboard/leads">
                View all
              </Link>
            }
            description="Rule-based reply, info request, and follow-up work."
            title="Today's actions"
          />
          <div className="mt-3 divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200">
            {todaysActions.length > 0 ? (
              todaysActions.map((action) => (
                <Link
                  className="grid gap-1 p-3 text-sm transition hover:bg-zinc-50"
                  href={`/dashboard/leads/${action.lead_id}`}
                  key={action.id}
                >
                  <span className="font-medium text-zinc-950">
                    {action.title}
                  </span>
                  <span className="capitalize text-zinc-500">
                    {label(action.action_type)} - Due {formatDate(action.due_at)}
                  </span>
                </Link>
              ))
            ) : (
              <div className="p-3">
                <EmptyState title="No open lead actions">
                  New quote requests and follow-ups will appear here.
                </EmptyState>
              </div>
            )}
          </div>
        </DashboardCard>

        <DashboardCard className="p-3">
          <SectionHeader
            action={
              <Link className="text-xs font-medium text-zinc-700" href="/dashboard/leads">
                Open desk
              </Link>
            }
            description="Latest quote requests captured from the public link."
            title="Recent leads"
          />
          <div className="mt-3 divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200">
            {recentLeads.length > 0 ? (
              recentLeads.map((item) => (
                <Link
                  className="grid gap-2 p-3 text-sm transition hover:bg-zinc-50"
                  href={`/dashboard/leads/${item.lead.id}`}
                  key={item.lead.id}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="font-medium text-zinc-950">
                      {item.lead.customer_name ?? "Unnamed lead"}
                    </span>
                    <StatusBadge>{label(item.score.quality_level)}</StatusBadge>
                  </span>
                  <span className="text-xs text-zinc-500">
                    {item.lead.service_type ?? "Service not set"} -{" "}
                    {item.lead.city_or_service_area ?? "Area missing"}
                  </span>
                </Link>
              ))
            ) : (
              <div className="p-3">
                <EmptyState title="No leads yet">
                  Public quote submissions will appear here.
                </EmptyState>
              </div>
            )}
          </div>
        </DashboardCard>
      </section>

      <DashboardCard className="p-3">
        <SectionHeader
          description="High-signal shortcuts for the founder-led workflow."
          title="Quick actions"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Link className={buttonClass} href="/dashboard/leads">
            Open Lead Desk
          </Link>
          <Link className={buttonClass} href="/dashboard/configuration">
            Business Setup
          </Link>
          <Link className={buttonClass} href={`/quote/${activeBusiness.slug}`}>
            Preview Quote Link
          </Link>
        </div>
      </DashboardCard>

      <DashboardCard className="p-3">
        <SectionHeader
          description="Lightweight Phase 5 proof of owner review and follow-up activity."
          title="Revenue recovery proof"
        />
        <div className="mt-3 grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {[
            ["Captured", desk.recoveryProof.quoteRequestsCaptured],
            ["Reviewed", desk.recoveryProof.leadsReviewed],
            ["Follow-ups due", desk.recoveryProof.followUpsDue],
            ["Follow-ups done", desk.recoveryProof.followUpsCompleted],
            ["Strong acted", desk.recoveryProof.strongLeadsActedOn],
            ["Outcomes", desk.recoveryProof.outcomesMarked],
          ].map(([labelText, value]) => (
            <div
              className="rounded-md border border-zinc-200 bg-zinc-50 p-3"
              key={labelText}
            >
              <p className="text-xs font-medium text-zinc-500">{labelText}</p>
              <p className="mt-1 text-lg font-semibold text-zinc-950">
                {value}
              </p>
            </div>
          ))}
        </div>
      </DashboardCard>
    </main>
  );
}
