/**
 * ============================================================
 * File: lib/lead-source-analytics.ts
 * Project: BizPilot AI
 * Description: Pure lead-source normalization and analytics helpers.
 * Role: Converts captured quote attribution into deterministic owner and
 *       founder reporting without database, UI, or runtime dependencies.
 * Related:
 * - lib/quote-attribution.ts
 * - server/repositories/lead-conversion.repository.ts
 * - server/repositories/founder-admin.repository.ts
 * - tests/unit/lead-source-analytics.test.mts
 * Author: MoOoH
 * Created: 2026-07-16
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Added reusable source taxonomy, attribution resolution, date
 *   ranges, summaries, outcome/source/campaign breakdowns, and recent activity.
 * ============================================================
 */

export const LEAD_SOURCE_KEYS = [
  "website",
  "google_business_profile",
  "instagram",
  "facebook",
  "tiktok",
  "linkedin",
  "youtube",
  "whatsapp",
  "email",
  "saved_reply",
  "direct",
  "custom",
  "unknown",
] as const;

export type LeadSourceKey = (typeof LEAD_SOURCE_KEYS)[number];
export type LeadSourceAnalyticsRange = 7 | 30 | 90 | "all";

export type LeadSourceAnalyticsLead = Readonly<{
  businessId?: string | null | undefined;
  businessName?: string | null | undefined;
  createdAt: string;
  id: string;
  manualOutcome?: string | null | undefined;
  sourceChannel?: string | null | undefined;
  status?: string | null | undefined;
  utmCampaign?: string | null | undefined;
  utmSource?: string | null | undefined;
}>;

export type NormalizedLeadSource = Readonly<{
  key: LeadSourceKey;
  label: string;
  value: string;
}>;

export type LeadSourceBreakdownItem = Readonly<{
  count: number;
  key: LeadSourceKey;
  label: string;
  share: number;
  sharePercent: number;
  value: string;
}>;

export type LeadAnalyticsBreakdownItem = Readonly<{
  count: number;
  key: string;
  label: string;
  share: number;
  sharePercent: number;
}>;

export type LeadSourceAnalyticsResult = Readonly<{
  campaigns: readonly LeadAnalyticsBreakdownItem[];
  manualOutcomes: Readonly<{
    byManualOutcome: readonly LeadAnalyticsBreakdownItem[];
    byStatus: readonly LeadAnalyticsBreakdownItem[];
    effective: readonly LeadAnalyticsBreakdownItem[];
  }>;
  range: LeadSourceAnalyticsRange;
  rangeStart: string | null;
  recentActivity: readonly Readonly<{
    businessId: string | null;
    businessName: string | null;
    campaign: string | null;
    createdAt: string;
    leadId: string;
    manualOutcome: string | null;
    source: NormalizedLeadSource;
    status: string | null;
  }>[];
  sources: readonly LeadSourceBreakdownItem[];
  summary: Readonly<{
    attributedLeads: number;
    attributionRate: number;
    campaignTaggedLeads: number;
    topSource: LeadSourceBreakdownItem | null;
    totalLeads: number;
    unknownLeads: number;
  }>;
}>;

const SOURCE_LABELS = {
  custom: "Custom",
  direct: "Direct",
  email: "Email",
  facebook: "Facebook",
  google_business_profile: "Google Business Profile",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  saved_reply: "Saved reply",
  tiktok: "TikTok",
  unknown: "Unknown",
  website: "Website",
  whatsapp: "WhatsApp",
  youtube: "YouTube",
} as const satisfies Record<LeadSourceKey, string>;

const SOURCE_ALIASES: Readonly<Record<string, Exclude<LeadSourceKey, "custom">>> = {
  "(direct)": "direct",
  "(none)": "direct",
  "(not_set)": "unknown",
  direct: "direct",
  email: "email",
  email_campaign: "email",
  email_signature: "email",
  facebook: "facebook",
  fb: "facebook",
  g_business_profile: "google_business_profile",
  gbp: "google_business_profile",
  gmb: "google_business_profile",
  google_business: "google_business_profile",
  google_business_profile: "google_business_profile",
  google_maps: "google_business_profile",
  google_my_business: "google_business_profile",
  homepage: "website",
  instagram: "instagram",
  insta: "instagram",
  linkedin: "linkedin",
  newsletter: "email",
  none: "direct",
  not_provided: "unknown",
  organic_website: "website",
  public_quote_link: "direct",
  saved_reply: "saved_reply",
  site: "website",
  tik_tok: "tiktok",
  tiktok: "tiktok",
  unknown: "unknown",
  unattributed: "unknown",
  web: "website",
  website: "website",
  website_footer: "website",
  whatsapp: "whatsapp",
  whats_app: "whatsapp",
  youtube: "youtube",
};

const GENERIC_SOURCE_VALUES = new Set([
  "direct",
  "public_quote_link",
  "unknown",
  "unattributed",
]);

const MAX_LABEL_LENGTH = 80;

function cleanValue(value: string | null | undefined): string {
  return (value ?? "")
    .replace(/[\u0000-\u001F\u007F]/gu, "")
    .trim()
    .slice(0, MAX_LABEL_LENGTH);
}

function canonicalize(value: string | null | undefined): string {
  return cleanValue(value)
    .toLocaleLowerCase("en-CA")
    .replace(/[\s/.-]+/gu, "_")
    .replace(/[^\p{L}\p{N}_()]+/gu, "")
    .replace(/_+/gu, "_")
    .replace(/^_|_$/gu, "");
}

function titleCase(value: string): string {
  return value
    .replaceAll("_", " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toLocaleUpperCase("en-CA") + word.slice(1))
    .join(" ");
}

function ratio(count: number, total: number): number {
  return total === 0 ? 0 : count / total;
}

function percentage(count: number, total: number): number {
  return Math.round(ratio(count, total) * 1_000) / 10;
}

function normalizeDimension(value: string | null | undefined): string | null {
  const canonicalValue = canonicalize(value);
  return canonicalValue.length > 0 ? canonicalValue : null;
}

function compareBreakdowns(
  left: Pick<LeadAnalyticsBreakdownItem, "count" | "label">,
  right: Pick<LeadAnalyticsBreakdownItem, "count" | "label">,
): number {
  return right.count - left.count || left.label.localeCompare(right.label, "en-CA");
}

export function normalizeLeadSource(
  value: string | null | undefined,
): NormalizedLeadSource {
  const canonicalValue = canonicalize(value);

  if (!canonicalValue) {
    return { key: "unknown", label: SOURCE_LABELS.unknown, value: "unknown" };
  }

  const key = SOURCE_ALIASES[canonicalValue] ?? "custom";

  if (key === "custom") {
    return {
      key,
      label: titleCase(canonicalValue) || SOURCE_LABELS.custom,
      value: canonicalValue,
    };
  }

  return { key, label: SOURCE_LABELS[key], value: key };
}

export function deriveEffectiveLeadSource(input: {
  sourceChannel?: string | null | undefined;
  utmSource?: string | null | undefined;
}): NormalizedLeadSource {
  const channelValue = canonicalize(input.sourceChannel);
  const channel = normalizeLeadSource(input.sourceChannel);
  const utmSource = normalizeLeadSource(input.utmSource);
  const channelIsMeaningful =
    channel.key !== "unknown" && !GENERIC_SOURCE_VALUES.has(channelValue);

  if (channelIsMeaningful) {
    return channel;
  }

  if (utmSource.key !== "unknown" && utmSource.key !== "direct") {
    return utmSource;
  }

  return channel.key === "unknown" ? utmSource : channel;
}

export function isLeadInAnalyticsRange(input: {
  createdAt: string;
  now: Date;
  range: LeadSourceAnalyticsRange;
}): boolean {
  if (input.range === "all") {
    return true;
  }

  const createdAt = Date.parse(input.createdAt);
  const now = input.now.getTime();

  if (!Number.isFinite(createdAt) || !Number.isFinite(now)) {
    return false;
  }

  const rangeStart = now - input.range * 24 * 60 * 60 * 1_000;
  return createdAt >= rangeStart && createdAt <= now;
}

function buildStringBreakdown(input: {
  denominator: number;
  values: readonly string[];
}): LeadAnalyticsBreakdownItem[] {
  const counts = new Map<string, { count: number; label: string }>();

  for (const value of input.values) {
    const key = normalizeDimension(value) ?? "unknown";
    const existing = counts.get(key);
    counts.set(key, {
      count: (existing?.count ?? 0) + 1,
      label: existing?.label ?? titleCase(key),
    });
  }

  return [...counts.entries()]
    .map(([key, item]) => ({
      count: item.count,
      key,
      label: item.label,
      share: ratio(item.count, input.denominator),
      sharePercent: percentage(item.count, input.denominator),
    }))
    .sort(compareBreakdowns);
}

export function buildLeadSourceAnalytics(
  leads: readonly LeadSourceAnalyticsLead[],
  options: Readonly<{
    now?: Date | undefined;
    range?: LeadSourceAnalyticsRange | undefined;
    recentLimit?: number | undefined;
  }> = {},
): LeadSourceAnalyticsResult {
  const now = options.now ?? new Date();
  const range = options.range ?? 30;
  const filteredLeads = leads.filter((lead) =>
    isLeadInAnalyticsRange({ createdAt: lead.createdAt, now, range }),
  );
  const totalLeads = filteredLeads.length;
  const sourceCounts = new Map<
    string,
    { count: number; source: NormalizedLeadSource }
  >();

  for (const lead of filteredLeads) {
    const source = deriveEffectiveLeadSource(lead);
    const groupKey = `${source.key}:${source.value}`;
    const existing = sourceCounts.get(groupKey);
    sourceCounts.set(groupKey, {
      count: (existing?.count ?? 0) + 1,
      source,
    });
  }

  const sources = [...sourceCounts.values()]
    .map(({ count, source }) => ({
      count,
      key: source.key,
      label: source.label,
      share: ratio(count, totalLeads),
      sharePercent: percentage(count, totalLeads),
      value: source.value,
    }))
    .sort(compareBreakdowns);
  const unknownLeads = sources
    .filter((source) => source.key === "unknown")
    .reduce((total, source) => total + source.count, 0);
  const directLeads = sources
    .filter((source) => source.key === "direct")
    .reduce((total, source) => total + source.count, 0);
  const attributedLeads = totalLeads - unknownLeads - directLeads;
  const campaigns = buildStringBreakdown({
    denominator: totalLeads,
    values: filteredLeads.flatMap((lead) => {
      const campaign = cleanValue(lead.utmCampaign);
      return campaign ? [campaign] : [];
    }),
  });
  const byStatus = buildStringBreakdown({
    denominator: totalLeads,
    values: filteredLeads.map((lead) => cleanValue(lead.status) || "unknown"),
  });
  const byManualOutcome = buildStringBreakdown({
    denominator: totalLeads,
    values: filteredLeads.flatMap((lead) => {
      const manualOutcome = cleanValue(lead.manualOutcome);
      return manualOutcome ? [manualOutcome] : [];
    }),
  });
  const effectiveOutcomes = buildStringBreakdown({
    denominator: totalLeads,
    values: filteredLeads.map(
      (lead) =>
        cleanValue(lead.manualOutcome) || cleanValue(lead.status) || "unknown",
    ),
  });
  const recentLimit = Math.max(0, Math.floor(options.recentLimit ?? 10));
  const recentActivity = [...filteredLeads]
    .sort((left, right) => {
      const leftTimestamp = Date.parse(left.createdAt);
      const rightTimestamp = Date.parse(right.createdAt);
      const safeLeft = Number.isFinite(leftTimestamp) ? leftTimestamp : -Infinity;
      const safeRight = Number.isFinite(rightTimestamp) ? rightTimestamp : -Infinity;
      return safeRight - safeLeft || left.id.localeCompare(right.id, "en-CA");
    })
    .slice(0, recentLimit)
    .map((lead) => ({
      businessId: lead.businessId ?? null,
      businessName: cleanValue(lead.businessName) || null,
      campaign: cleanValue(lead.utmCampaign) || null,
      createdAt: lead.createdAt,
      leadId: lead.id,
      manualOutcome: cleanValue(lead.manualOutcome) || null,
      source: deriveEffectiveLeadSource(lead),
      status: cleanValue(lead.status) || null,
    }));

  return {
    campaigns,
    manualOutcomes: {
      byManualOutcome,
      byStatus,
      effective: effectiveOutcomes,
    },
    range,
    rangeStart:
      range === "all"
        ? null
        : new Date(now.getTime() - range * 24 * 60 * 60 * 1_000).toISOString(),
    recentActivity,
    sources,
    summary: {
      attributedLeads,
      attributionRate: percentage(attributedLeads, totalLeads),
      campaignTaggedLeads: campaigns.reduce(
        (total, campaign) => total + campaign.count,
        0,
      ),
      topSource:
        sources.find(
          (source) => source.key !== "direct" && source.key !== "unknown",
        ) ?? null,
      totalLeads,
      unknownLeads,
    },
  };
}
