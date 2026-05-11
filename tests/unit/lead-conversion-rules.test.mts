/**
 * ============================================================
 * File: tests/unit/lead-conversion-rules.test.mts
 * Project: BizPilot AI
 * Description: Tests pure Phase 5 Lead Conversion Desk rule logic.
 * Role: Verifies quality scoring, missing info, service-area matching, SLA state, recommended actions, and proof metrics.
 * Related:
 * - server/services/lead-conversion-rules.service.ts
 * - docs/product/BIZPILOT_SCORING_SPEC_v1.1.md
 * Author: MoOoH
 * Created: 2026-05-09
 * Last Updated: 2026-05-09
 * Change Log:
 * - 2026-05-09: Created focused Phase 5 rule unit tests.
 * ============================================================
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  calculateLeadQuality,
  calculateRevenueRecoveryProof,
  calculateSlaState,
  chooseAction,
  serviceAreaMatches,
  shouldSuppressOpenActions,
  summarizeLeadDecision,
  type RuleLead,
  type RulePersistedQualityScore,
  type RuleSubmissionValue,
} from "../../server/services/lead-conversion-rules.service.ts";

const baseLead: RuleLead = {
  business_id: "business-1",
  city_or_service_area: "Boucherville",
  created_at: "2026-05-09T12:00:00.000Z",
  customer_contact: "customer@example.com",
  first_reply_copied_at: null,
  first_viewed_at: null,
  id: "lead-1",
  manual_outcome: null,
  response_sla_state: "new",
  service_type: "standard",
  status: "new",
};

const completeValues: RuleSubmissionValue[] = [
  { field_key: "customer_contact", field_value: "customer@example.com" },
  { field_key: "cleaning_type", field_value: "standard" },
  { field_key: "property_type", field_value: "house" },
  { field_key: "bedrooms", field_value: 2 },
  { field_key: "bathrooms", field_value: 1 },
  { field_key: "preferred_date", field_value: "2026-05-12" },
  { field_key: "preferred_time_window", field_value: "morning" },
  { field_key: "city_or_service_area", field_value: "Boucherville" },
];

function score(
  overrides: Partial<RulePersistedQualityScore> = {},
): RulePersistedQualityScore {
  return {
    completeness_score: 100,
    explanation: "Contact, service, area, timing, and quote details are present.",
    lead_id: baseLead.id,
    missing_info_keys: [],
    quality_level: "strong",
    ...overrides,
  };
}

describe("Lead Conversion Desk rules", () => {
  it("scores a complete in-area cleaning lead as strong", () => {
    const result = calculateLeadQuality({
      lead: baseLead,
      serviceAreas: ["Boucherville", "Longueuil"],
      submissionValues: completeValues,
    });

    assert.equal(result.qualityLevel, "strong");
    assert.equal(result.completenessLabel, "complete");
    assert.equal(result.completenessScore, 100);
    assert.deepEqual(result.missingInfoKeys, []);
  });

  it("detects important missing quote information", () => {
    const result = calculateLeadQuality({
      lead: baseLead,
      serviceAreas: ["Boucherville"],
      submissionValues: completeValues.filter(
        (value) =>
          value.field_key !== "bathrooms" &&
          value.field_key !== "preferred_date",
      ),
    });

    assert.equal(result.qualityLevel, "needs_info");
    assert.deepEqual(result.missingInfoKeys.sort(), [
      "bathrooms",
      "preferred_date",
    ]);
    assert.match(result.explanation, /Missing bathrooms, preferred date/);
  });

  it("matches service areas with normalized city text", () => {
    assert.equal(
      serviceAreaMatches({
        lead: baseLead,
        serviceAreas: ["South Shore - Boucherville"],
        values: { city_or_service_area: "boucherville" },
      }),
      true,
    );

    assert.equal(
      serviceAreaMatches({
        lead: { ...baseLead, city_or_service_area: "Laval" },
        serviceAreas: ["Boucherville"],
        values: { city_or_service_area: "Laval" },
      }),
      false,
    );
  });

  it("calculates SLA and follow-up states", () => {
    assert.equal(
      calculateSlaState({
        lead: baseLead,
        now: new Date("2026-05-09T18:00:00.000Z"),
      }),
      "new",
    );
    assert.equal(
      calculateSlaState({
        lead: baseLead,
        now: new Date("2026-05-10T13:00:00.000Z"),
      }),
      "overdue",
    );
    assert.equal(
      calculateSlaState({
        lead: {
          ...baseLead,
          first_reply_copied_at: "2026-05-09T12:00:00.000Z",
          response_sla_state: "reply_copied",
          status: "replied",
        },
        now: new Date("2026-05-11T13:00:00.000Z"),
      }),
      "follow_up_due",
    );
  });

  it("returns decision reasons and recommended actions", () => {
    assert.deepEqual(
      summarizeLeadDecision({
        lead: baseLead,
        score: score({
          explanation: "Missing bathrooms.",
          missing_info_keys: ["bathrooms"],
          quality_level: "needs_info",
        }),
      }),
      {
        primaryIssue: "Missing bathrooms.",
        recommendedAction: "Ask for missing info",
      },
    );

    assert.equal(
      chooseAction({
        lead: { ...baseLead, response_sla_state: "overdue" },
        score: score(),
      }).actionType,
      "reply",
    );

    assert.equal(
      chooseAction({
        lead: {
          ...baseLead,
          first_reply_copied_at: "2026-05-09T12:00:00.000Z",
          response_sla_state: "follow_up_due",
          status: "replied",
        },
        score: score(),
      }).actionType,
      "follow_up",
    );

    assert.equal(
      shouldSuppressOpenActions({
        lead: baseLead,
        score: score({ quality_level: "low_fit" }),
      }),
      true,
    );
  });

  it("calculates revenue recovery proof summary", () => {
    const proof = calculateRevenueRecoveryProof({
      actions: [
        { action_type: "follow_up", status: "open" },
        { action_type: "follow_up", status: "completed" },
        { action_type: "reply", status: "completed" },
      ],
      leads: [
        { ...baseLead, first_viewed_at: "2026-05-09T12:30:00.000Z" },
        {
          ...baseLead,
          first_reply_copied_at: "2026-05-09T12:45:00.000Z",
          id: "lead-2",
          manual_outcome: "booked",
          status: "booked",
        },
      ],
      scores: [
        score({ lead_id: "lead-1", quality_level: "strong" }),
        score({ lead_id: "lead-2", quality_level: "strong" }),
      ],
    });

    assert.deepEqual(proof, {
      followUpsCompleted: 1,
      followUpsDue: 1,
      leadsReviewed: 1,
      outcomesMarked: 1,
      quoteRequestsCaptured: 2,
      strongLeadsActedOn: 2,
    });
  });
});
