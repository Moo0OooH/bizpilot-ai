/**
 * ============================================================
 * File: server/services/lead-reporting.service.ts
 * Project: BizPilot AI
 * Description: Read-only owner lead source reporting service.
 * Role: Combines RLS-scoped lead signals with normalized attribution analytics and an explicit bounded-result flag.
 * Related:
 * - server/repositories/lead-reporting.repository.ts
 * - lib/lead-source-analytics.ts
 * - app/(dashboard)/dashboard/reports/page.tsx
 * Author: MoOoH
 * Created: 2026-07-16
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Batched source-metadata reads so the 1,000-row report cannot exceed safe query URL sizes.
 * - 2026-07-16: Created owner source-report aggregation with validated date windows and truncation disclosure.
 * ============================================================
 */

import "server-only";

import {
  buildLeadSourceAnalytics,
  type LeadSourceAnalyticsRange,
  type LeadSourceAnalyticsResult,
} from "@/lib/lead-source-analytics";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  listLeadReportingRows,
  listLeadReportingSources,
} from "@/server/repositories/lead-reporting.repository";

const REPORT_ROW_LIMIT = 1000;
const REPORT_SOURCE_BATCH_SIZE = 200;

async function listLeadReportingSourcesInBatches(input: {
  businessId: string;
  leadIds: readonly string[];
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
}) {
  const batches: string[][] = [];

  for (
    let index = 0;
    index < input.leadIds.length;
    index += REPORT_SOURCE_BATCH_SIZE
  ) {
    batches.push(input.leadIds.slice(index, index + REPORT_SOURCE_BATCH_SIZE));
  }

  const rows = await Promise.all(
    batches.map((leadIds) =>
      listLeadReportingSources({
        businessId: input.businessId,
        leadIds,
        supabase: input.supabase,
      }),
    ),
  );

  return rows.flat();
}

export function readLeadSourceAnalyticsRange(
  value: string | string[] | undefined,
): LeadSourceAnalyticsRange {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === "7") return 7;
  if (raw === "90") return 90;
  if (raw === "all") return "all";
  return 30;
}

export async function getOwnerLeadSourceReport(input: {
  businessId: string;
  range: LeadSourceAnalyticsRange;
}): Promise<Readonly<{
  analytics: LeadSourceAnalyticsResult;
  isTruncated: boolean;
}>> {
  const supabase = await createSupabaseServerClient();
  const now = new Date();
  const rangeStart =
    input.range === "all"
      ? undefined
      : new Date(now.getTime() - input.range * 86_400_000).toISOString();
  const rows = await listLeadReportingRows({
    businessId: input.businessId,
    limit: REPORT_ROW_LIMIT + 1,
    ...(rangeStart ? { rangeStart } : {}),
    supabase,
  });
  const isTruncated = rows.length > REPORT_ROW_LIMIT;
  const boundedRows = rows.slice(0, REPORT_ROW_LIMIT);
  const sourceRows = await listLeadReportingSourcesInBatches({
    businessId: input.businessId,
    leadIds: boundedRows.map((lead) => lead.id),
    supabase,
  });
  const sourceByLeadId = new Map(sourceRows.map((source) => [source.lead_id, source]));
  const analytics = buildLeadSourceAnalytics(
    boundedRows.map((lead) => {
      const source = sourceByLeadId.get(lead.id);
      return {
        businessId: lead.business_id,
        createdAt: lead.created_at,
        id: lead.id,
        manualOutcome: lead.manual_outcome,
        sourceChannel: lead.source_channel,
        status: lead.status,
        utmCampaign: source?.utm_campaign,
        utmSource: source?.utm_source,
      };
    }),
    { now, range: input.range, recentLimit: 12 },
  );

  return { analytics, isTruncated };
}
