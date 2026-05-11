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
 * Last Updated: 2026-05-08
 * Change Log:
 * - 2026-05-07: Created Phase 5 lead list and action panel.
 * - 2026-05-08: Added decision reasons, recommended actions, and clearer list structure.
 * ============================================================
 */

import Link from "next/link";
import { redirect } from "next/navigation";

import {
  DashboardCard,
  EmptyState,
  inputClass,
  KpiCard,
  PageHeader,
  SectionHeader,
  StatusBadge,
  TabLink,
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

function qualityTone(
  qualityLevel: string,
): "amber" | "blue" | "emerald" | "neutral" {
  if (qualityLevel === "strong") {
    return "emerald";
  }

  if (qualityLevel === "good") {
    return "blue";
  }

  if (qualityLevel === "needs_info") {
    return "amber";
  }

  return "neutral";
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

  return (
    <main className="space-y-5">
      <PageHeader
        description={`Review captured quote requests, prioritize replies, and track manual outcomes for ${activeBusiness.name}.`}
        eyebrow="Workspace"
        title="Lead Conversion Desk"
      />

      <section className="grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Captured" value={desk.recoveryProof.quoteRequestsCaptured} />
        <KpiCard label="Reviewed" value={desk.recoveryProof.leadsReviewed} />
        <KpiCard label="Follow-ups due" value={desk.recoveryProof.followUpsDue} />
        <KpiCard label="Completed" value={desk.recoveryProof.followUpsCompleted} />
        <KpiCard label="Strong acted" value={desk.recoveryProof.strongLeadsActedOn} />
        <KpiCard label="Outcomes" value={desk.recoveryProof.outcomesMarked} />
      </section>

      <DashboardCard className="p-3">
        <SectionHeader
          description="Simple Phase 5 action queue: reply, ask info, or follow up."
          title="Today's action panel"
        />
        <div className="mt-3 divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200">
          {desk.todaysActions.length > 0 ? (
            desk.todaysActions.slice(0, 6).map((action) => (
              <Link
                className="grid gap-2 p-3 text-sm transition hover:bg-zinc-50 sm:grid-cols-[8rem_1fr_auto]"
                href={`/dashboard/leads/${action.lead_id}`}
                key={action.id}
              >
                <span className="font-medium capitalize text-zinc-700">
                  {label(action.action_type)}
                </span>
                <span className="text-zinc-950">{action.title}</span>
                <span className="text-zinc-500">
                  Due {formatDate(action.due_at)}
                </span>
              </Link>
            ))
          ) : (
            <div className="p-3">
              <EmptyState title="No open lead actions">
                New and overdue quote requests will appear here.
              </EmptyState>
            </div>
          )}
        </div>
      </DashboardCard>

      <DashboardCard className="p-3">
        <SectionHeader
          description="Search and triage the current lead pipeline."
          title="Leads"
        />
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1 rounded-lg bg-zinc-100 p-1">
            <TabLink active href="/dashboard/leads">All</TabLink>
            <TabLink href="/dashboard/leads">New</TabLink>
            <TabLink href="/dashboard/leads">Follow-up</TabLink>
            <TabLink href="/dashboard/leads">Won</TabLink>
            <TabLink href="/dashboard/leads">Lost</TabLink>
          </div>
          <div className="w-full lg:w-72">
            <input
              className={inputClass}
              placeholder="Search leads"
              readOnly
              type="search"
            />
          </div>
        </div>

        <div className="mt-3 overflow-hidden rounded-lg border border-zinc-200">
          <div className="hidden grid-cols-[1fr_0.75fr_0.85fr_0.8fr_0.75fr_0.75fr_7rem_1.05fr_8rem] border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 xl:grid">
            <span>Customer</span>
            <span>Service</span>
            <span>Location</span>
            <span>Quality</span>
            <span>SLA</span>
            <span>Status</span>
            <span>Source</span>
            <span>Next action</span>
            <span>Created</span>
          </div>
          {desk.leads.length > 0 ? (
            desk.leads.map((item) => (
              <Link
                className="grid gap-4 border-b border-zinc-200 p-4 text-sm transition last:border-b-0 hover:bg-zinc-50 xl:grid-cols-[1fr_0.75fr_0.85fr_0.8fr_0.75fr_0.75fr_7rem_1.05fr_8rem]"
                href={`/dashboard/leads/${item.lead.id}`}
                key={item.lead.id}
              >
                <span>
                  <span className="block font-medium text-zinc-950">
                    {item.lead.customer_name ?? "Unnamed lead"}
                  </span>
                  <span className="mt-1 block text-zinc-500">
                    {item.lead.customer_contact ?? "No contact captured"}
                  </span>
                </span>
                <span className="text-zinc-700">
                  {item.lead.service_type ?? "Service not set"}
                </span>
                <span className="text-zinc-700">
                  {item.lead.city_or_service_area ?? "Area missing"}
                </span>
                <span>
                  <StatusBadge tone={qualityTone(item.score.quality_level)}>
                    {label(item.score.quality_level)}
                  </StatusBadge>
                  <span className="mt-1 block text-xs capitalize text-zinc-500">
                    {item.score.completeness_score}% details{" "}
                    {label(item.score.completeness_label)}
                  </span>
                </span>
                <span className="capitalize text-zinc-700">
                  {label(item.lead.response_sla_state)}
                </span>
                <span className="capitalize text-zinc-700">
                  {label(item.lead.status)}
                </span>
                <span className="text-zinc-500">
                  {item.lead.source_channel ?? "Unknown"}
                </span>
                <span>
                  <span className="block font-medium text-zinc-950">
                    {item.recommendedAction}
                  </span>
                  <span className="mt-1 block text-xs text-zinc-500">
                    {item.primaryIssue}
                  </span>
                </span>
                <span className="text-zinc-500">
                  {formatDate(item.lead.created_at)}
                </span>
              </Link>
            ))
          ) : (
            <div className="p-4">
              <EmptyState title="No leads yet">
                Public quote submissions will appear here after leads are captured.
              </EmptyState>
            </div>
          )}
        </div>
      </DashboardCard>
    </main>
  );
}
