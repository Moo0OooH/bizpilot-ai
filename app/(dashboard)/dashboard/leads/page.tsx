/**
 * ============================================================
 * File: app/(dashboard)/dashboard/leads/page.tsx
 * Project: BizPilot AI
 * Description: Renders the Phase 5 owner Lead Conversion Desk list view.
 * Role: Shows tenant-scoped leads, rule-based quality, today's actions, SLA state, and revenue recovery proof.
 * Related:
 * - server/services/lead-conversion.service.ts
 * - docs/product/BIZPILOT_BUILD_PLAN_v1.4.md
 * Author: MoOoH
 * Created: 2026-05-07
 * Last Updated: 2026-05-11
 * Change Log:
 * - 2026-05-07: Created Phase 5 lead list and action panel.
 * - 2026-05-08: Added decision reasons, recommended actions, and clearer list structure.
 * - 2026-05-11: Upgraded lead list into an operational quote recovery workspace.
 * ============================================================
 */

import Link from "next/link";
import { redirect } from "next/navigation";

import { LeadWorkspaceQueue } from "@/components/dashboard/lead-workspace-queue";
import {
  buttonClass,
  DashboardCard,
  EmptyState,
  MetricCard,
  PageHeader,
  primaryButtonClass,
  RightRailPanel,
  SectionHeader,
} from "@/components/dashboard/dashboard-ui";
import { getCurrentUser } from "@/server/services/auth.service";
import { getBusinessWorkspace } from "@/server/services/business.service";
import { getLeadConversionDesk } from "@/server/services/lead-conversion.service";

export const dynamic = "force-dynamic";

function label(value: string): string {
  return value.replaceAll("_", " ");
}

function formatDate(value: string | null): string {
  if (!value) {
    return "Not yet";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function LeadConversionDeskPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const workspace = await getBusinessWorkspace({
    userId: user.id,
  });
  const activeBusiness = workspace.businesses[0];

  if (!activeBusiness) {
    redirect("/dashboard");
  }

  const desk = await getLeadConversionDesk({
    actorUserId: user.id,
    business: activeBusiness,
  });
  const quotePath = `/quote/${activeBusiness.slug}`;
  const overdueCount = desk.leads.filter(
    (item) => item.lead.response_sla_state === "overdue",
  ).length;
  const followUpCount = desk.leads.filter(
    (item) => item.lead.status === "follow_up_needed",
  ).length;
  const newLeadCount = desk.leads.filter(
    (item) => item.lead.status === "new",
  ).length;

  return (
    <main className="space-y-4">
      <PageHeader
        actions={
          <>
            <Link className={buttonClass} href={quotePath}>
              Preview Quote Link
            </Link>
            <Link className={primaryButtonClass} href="/dashboard/leads">
              Review Queue
            </Link>
          </>
        }
        description={`Prioritize quote requests, reply faster, and track manual outcomes for ${activeBusiness.name}.`}
        eyebrow="Workspace"
        title="Lead Workspace"
      />

      <section className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-6">
        <MetricCard
          detail="Quote requests captured."
          label="Captured"
          tone="violet"
          value={desk.recoveryProof.quoteRequestsCaptured}
        />
        <MetricCard
          detail="Owner has opened or reviewed."
          label="Reviewed"
          tone="blue"
          value={desk.recoveryProof.leadsReviewed}
        />
        <MetricCard
          detail={`${overdueCount} overdue right now.`}
          label="Follow-ups due"
          tone={desk.recoveryProof.followUpsDue > 0 ? "amber" : "neutral"}
          value={desk.recoveryProof.followUpsDue}
        />
        <MetricCard
          detail="Follow-up actions completed."
          label="Completed"
          tone="emerald"
          value={desk.recoveryProof.followUpsCompleted}
        />
        <MetricCard
          detail="High-quality leads acted on."
          label="Strong acted"
          tone="emerald"
          value={desk.recoveryProof.strongLeadsActedOn}
        />
        <MetricCard
          detail="Booked, lost, or owner-marked outcomes."
          label="Outcomes"
          tone="neutral"
          value={desk.recoveryProof.outcomesMarked}
        />
      </section>

      <section className="grid items-start gap-3.5 2xl:grid-cols-[minmax(0,1fr)_320px]">
        <DashboardCard className="p-3.5" variant="elevated">
          <SectionHeader
            description="Operational queue for captured quote requests. Next action is the most important column."
            title="Lead recovery queue"
          />
          <LeadWorkspaceQueue leads={desk.leads} quotePath={quotePath} />
        </DashboardCard>

        <aside className="space-y-3 2xl:sticky 2xl:top-20">
          <RightRailPanel variant="priority">
            <SectionHeader
              description="The queue is rule-based. BizPilot never sends automatically."
              title="Today's recovery queue"
            />
            <div className="mt-3 divide-y divide-violet-100 overflow-hidden rounded-lg border border-violet-100 bg-white/70">
              {desk.todaysActions.length > 0 ? (
                desk.todaysActions.slice(0, 6).map((action) => (
                  <Link
                    className="grid gap-1 p-2.5 text-[13px] transition hover:bg-white"
                    href={`/dashboard/leads/${action.lead_id}`}
                    key={action.id}
                  >
                    <span className="font-semibold capitalize text-zinc-950">
                      {label(action.action_type)}
                    </span>
                    <span className="text-zinc-700">{action.title}</span>
                    <span className="text-xs text-zinc-500">
                      Due {formatDate(action.due_at)}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="p-3">
                  <EmptyState title="No urgent actions">
                    You&apos;re caught up. New quote requests and follow-ups will
                    appear here.
                  </EmptyState>
                </div>
              )}
            </div>
          </RightRailPanel>

          <RightRailPanel>
            <SectionHeader
              description="A fast read on lead risk before filtering."
              title="SLA summary"
            />
            <div className="mt-3 grid gap-2 text-[13px]">
              {[
                ["New leads", newLeadCount],
                ["Follow-up needed", followUpCount],
                ["Overdue", overdueCount],
              ].map(([title, value]) => (
                <div
                  className="flex items-center justify-between rounded-md bg-zinc-50 px-3 py-2"
                  key={title}
                >
                  <span className="text-zinc-600">{title}</span>
                  <span className="font-semibold text-zinc-950">{value}</span>
                </div>
              ))}
            </div>
          </RightRailPanel>

          <RightRailPanel>
            <SectionHeader
              description="Use the queue tabs and search to narrow visible leads."
              title="Filter summary"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {["All", "New", "Follow-up", "Booked", "Lost"].map((filter) => (
                <span
                  className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-600"
                  key={filter}
                >
                  {filter}
                </span>
              ))}
            </div>
          </RightRailPanel>
        </aside>
      </section>
    </main>
  );
}
