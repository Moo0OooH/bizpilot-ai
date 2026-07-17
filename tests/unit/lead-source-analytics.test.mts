/**
 * ============================================================
 * File: tests/unit/lead-source-analytics.test.mts
 * Project: BizPilot AI
 * Description: Unit coverage for pure lead-source analytics helpers.
 * Role: Verifies source taxonomy, attribution precedence, reporting ranges,
 *       breakdown math, outcomes, campaigns, and recent activity ordering.
 * Related:
 * - lib/lead-source-analytics.ts
 * - lib/quote-attribution.ts
 * - server/repositories/lead-conversion.repository.ts
 * Author: MoOoH
 * Created: 2026-07-16
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Added complete deterministic lead-source analytics coverage.
 * ============================================================
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildLeadSourceAnalytics,
  deriveEffectiveLeadSource,
  isLeadInAnalyticsRange,
  normalizeLeadSource,
  type LeadSourceAnalyticsLead,
} from "../../lib/lead-source-analytics.ts";

const NOW = new Date("2026-07-16T12:00:00.000Z");

function lead(
  id: string,
  input: Partial<Omit<LeadSourceAnalyticsLead, "id">> = {},
): LeadSourceAnalyticsLead {
  return {
    createdAt: "2026-07-15T12:00:00.000Z",
    id,
    ...input,
  };
}

describe("lead source analytics", () => {
  it("normalizes the supported source taxonomy and useful aliases", () => {
    const expectations = [
      ["web", "website", "Website"],
      ["google-business-profile", "google_business_profile", "Google Business Profile"],
      ["insta", "instagram", "Instagram"],
      ["fb", "facebook", "Facebook"],
      ["Tik Tok", "tiktok", "TikTok"],
      ["LinkedIn", "linkedin", "LinkedIn"],
      ["YouTube", "youtube", "YouTube"],
      ["Whats App", "whatsapp", "WhatsApp"],
      ["email_signature", "email", "Email"],
      ["saved-reply", "saved_reply", "Saved reply"],
      ["public_quote_link", "direct", "Direct"],
      ["local_partner", "custom", "Local Partner"],
      [null, "unknown", "Unknown"],
    ] as const;

    for (const [value, key, label] of expectations) {
      assert.deepEqual(
        { key: normalizeLeadSource(value).key, label: normalizeLeadSource(value).label },
        { key, label },
      );
    }
  });

  it("prefers a meaningful channel and falls back from generic channels to UTM", () => {
    assert.equal(
      deriveEffectiveLeadSource({
        sourceChannel: "saved_reply",
        utmSource: "instagram",
      }).key,
      "saved_reply",
    );
    assert.equal(
      deriveEffectiveLeadSource({
        sourceChannel: "public_quote_link",
        utmSource: "instagram",
      }).key,
      "instagram",
    );
    assert.equal(
      deriveEffectiveLeadSource({ sourceChannel: "direct", utmSource: "gbp" }).key,
      "google_business_profile",
    );
    assert.equal(
      deriveEffectiveLeadSource({ sourceChannel: null, utmSource: "facebook" }).key,
      "facebook",
    );
    assert.equal(
      deriveEffectiveLeadSource({ sourceChannel: "direct", utmSource: null }).key,
      "direct",
    );
  });

  it("applies inclusive 7, 30, 90, and all-time ranges", () => {
    assert.equal(
      isLeadInAnalyticsRange({
        createdAt: "2026-07-09T12:00:00.000Z",
        now: NOW,
        range: 7,
      }),
      true,
    );
    assert.equal(
      isLeadInAnalyticsRange({
        createdAt: "2026-07-09T11:59:59.999Z",
        now: NOW,
        range: 7,
      }),
      false,
    );
    assert.equal(
      isLeadInAnalyticsRange({
        createdAt: "2026-06-16T12:00:00.000Z",
        now: NOW,
        range: 30,
      }),
      true,
    );
    assert.equal(
      isLeadInAnalyticsRange({
        createdAt: "2026-04-17T12:00:00.000Z",
        now: NOW,
        range: 90,
      }),
      true,
    );
    assert.equal(
      isLeadInAnalyticsRange({ createdAt: "invalid", now: NOW, range: "all" }),
      true,
    );
  });

  it("builds totals, source shares, campaigns, outcomes, and recent activity", () => {
    const analytics = buildLeadSourceAnalytics(
      [
        lead("instagram-new", {
          businessId: "business-a",
          businessName: "Clean Team",
          createdAt: "2026-07-16T10:00:00.000Z",
          manualOutcome: "booked",
          sourceChannel: "public_quote_link",
          status: "booked",
          utmCampaign: "Summer Clean",
          utmSource: "instagram",
        }),
        lead("instagram-old", {
          createdAt: "2026-07-14T10:00:00.000Z",
          sourceChannel: "instagram",
          status: "new",
          utmCampaign: "summer-clean",
        }),
        lead("facebook", {
          createdAt: "2026-07-13T10:00:00.000Z",
          manualOutcome: "lost",
          sourceChannel: "direct",
          status: "reviewed",
          utmSource: "facebook",
        }),
        lead("unknown", {
          createdAt: "2026-07-12T10:00:00.000Z",
          sourceChannel: null,
          status: null,
        }),
        lead("outside-range", {
          createdAt: "2026-06-01T10:00:00.000Z",
          sourceChannel: "website",
          status: "new",
        }),
      ],
      { now: NOW, range: 30, recentLimit: 3 },
    );

    assert.deepEqual(analytics.summary, {
      attributedLeads: 3,
      attributionRate: 75,
      campaignTaggedLeads: 2,
      topSource: analytics.sources[0],
      totalLeads: 4,
      unknownLeads: 1,
    });
    assert.deepEqual(
      analytics.sources.map(({ count, key, sharePercent }) => ({
        count,
        key,
        sharePercent,
      })),
      [
        { count: 2, key: "instagram", sharePercent: 50 },
        { count: 1, key: "facebook", sharePercent: 25 },
        { count: 1, key: "unknown", sharePercent: 25 },
      ],
    );
    assert.deepEqual(
      analytics.campaigns.map(({ count, key, sharePercent }) => ({
        count,
        key,
        sharePercent,
      })),
      [
        { count: 2, key: "summer_clean", sharePercent: 50 },
      ],
    );
    assert.deepEqual(
      analytics.manualOutcomes.byManualOutcome.map(({ count, key }) => ({ count, key })),
      [
        { count: 1, key: "booked" },
        { count: 1, key: "lost" },
      ],
    );
    assert.deepEqual(
      analytics.manualOutcomes.effective.map(({ count, key }) => ({ count, key })),
      [
        { count: 1, key: "booked" },
        { count: 1, key: "lost" },
        { count: 1, key: "new" },
        { count: 1, key: "unknown" },
      ],
    );
    assert.deepEqual(
      analytics.recentActivity.map(({ leadId }) => leadId),
      ["instagram-new", "instagram-old", "facebook"],
    );
    assert.equal(analytics.recentActivity[0]?.source.key, "instagram");
    assert.equal(analytics.recentActivity[0]?.businessName, "Clean Team");
    assert.equal(analytics.rangeStart, "2026-06-16T12:00:00.000Z");
  });

  it("is deterministic for empty input and alphabetically breaks count ties", () => {
    const empty = buildLeadSourceAnalytics([], { now: NOW, range: "all" });
    assert.equal(empty.summary.totalLeads, 0);
    assert.equal(empty.summary.attributionRate, 0);
    assert.equal(empty.summary.topSource, null);
    assert.equal(empty.rangeStart, null);

    const tied = buildLeadSourceAnalytics(
      [
        lead("z", { sourceChannel: "youtube" }),
        lead("f", { sourceChannel: "facebook" }),
      ],
      { now: NOW, range: 7 },
    );
    assert.deepEqual(
      tied.sources.map(({ key }) => key),
      ["facebook", "youtube"],
    );

    const untagged = buildLeadSourceAnalytics(
      [
        lead("direct", { sourceChannel: "public_quote_link" }),
        lead("tracked", { sourceChannel: "instagram" }),
      ],
      { now: NOW, range: 7 },
    );
    assert.equal(untagged.summary.attributedLeads, 1);
    assert.equal(untagged.summary.attributionRate, 50);
    assert.equal(untagged.summary.topSource?.key, "instagram");
  });
});
