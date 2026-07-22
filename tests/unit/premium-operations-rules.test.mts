/**
 * ============================================================
 * File: tests/unit/premium-operations-rules.test.mts
 * Project: BizPilot AI
 * Description: Tests deterministic Premium Operations priority, conflict, and draft rules.
 * Role: Protects paid add-on behavior without depending on Supabase or any message delivery integration.
 * Related:
 * - server/services/premium-operations-rules.service.ts
 * - server/services/premium-operations.service.ts
 * - docs/product/BIZPILOT_PREMIUM_OPERATIONS_ADDONS_v1.0.md
 * Author: MoOoH
 * Created: 2026-07-21
 * Last Updated: 2026-07-22
 * Change Log:
 * - 2026-07-22: Covered deterministic timezone conversion, DST gaps/overlaps, and same-window opening bounds.
 * - 2026-07-22: Covered operating-timezone request parsing and truthful local-window labels.
 * - 2026-07-21: Added pure-rule coverage for priority ranking, exact-time conflicts, internal openings, and manual-review drafts.
 * ============================================================
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  findConflictingTimeBlocks,
  findFirstInternalOpening,
  formatRequestedTimeWindowLabel,
  getPriorityMatch,
  isExactRequestedTimeWindow,
  isTerminalLeadStatus,
  parseRequestedTimeWindow,
  parseZonedLocalDateTime,
  rankLeadsByPriority,
  renderAvailabilityReviewDraft,
  renderBulkDraft,
  timeRangesOverlap,
  type InternalTimeBlock,
  type PriorityLead,
  type PriorityRule,
} from "../../server/services/premium-operations-rules.service.ts";

const lead = (overrides: Partial<PriorityLead> = {}): PriorityLead => ({
  area: "Toronto",
  createdAt: "2026-07-21T09:00:00.000Z",
  id: "lead-default",
  qualityLevel: "strong",
  service: "Deep cleaning",
  slaState: "new",
  status: "new",
  ...overrides,
});

const rule = (overrides: Partial<PriorityRule> = {}): PriorityRule => ({
  areaTerms: [],
  id: "rule-default",
  isActive: true,
  name: "Default priority",
  priorityRank: 3,
  serviceTerms: [],
  ...overrides,
});

const block = (overrides: Partial<InternalTimeBlock> = {}): InternalTimeBlock => ({
  endsAt: "2026-07-23T10:00:00.000Z",
  id: "block-default",
  startsAt: "2026-07-23T09:00:00.000Z",
  status: "reserved",
  ...overrides,
});

describe("Premium Operations rules", () => {
  it("matches active service and area rules, then uses the best rank", () => {
    const result = getPriorityMatch(lead(), [
      rule({
        areaTerms: ["Toronto"],
        id: "rank-4",
        name: "Toronto general",
        priorityRank: 4,
        serviceTerms: ["clean"],
      }),
      rule({
        areaTerms: ["Toronto"],
        id: "rank-1",
        name: "Toronto deep clean",
        priorityRank: 1,
        serviceTerms: ["deep"],
      }),
      rule({
        id: "inactive",
        isActive: false,
        priorityRank: 0,
      }),
    ]);

    assert.equal(result.priorityRank, 1);
    assert.deepEqual(result.matchingRuleIds, ["rank-1", "rank-4"]);
  });

  it("sorts saved priority before urgency and newest lead", () => {
    const ranked = rankLeadsByPriority({
      leads: [
        lead({
          createdAt: "2026-07-21T11:00:00.000Z",
          id: "unmatched-new",
          slaState: "new",
          service: "Window cleaning",
        }),
        lead({
          createdAt: "2026-07-21T08:00:00.000Z",
          id: "matched-overdue",
          slaState: "overdue",
        }),
        lead({
          createdAt: "2026-07-21T12:00:00.000Z",
          id: "matched-newer",
        }),
      ],
      rules: [
        rule({
          areaTerms: ["Toronto"],
          id: "deep-cleaning",
          priorityRank: 2,
          serviceTerms: ["deep"],
        }),
      ],
    });

    assert.deepEqual(
      ranked.map((item) => item.id),
      ["matched-overdue", "matched-newer", "unmatched-new"],
    );
  });

  it("resolves canonical times and conservative named service windows", () => {
    assert.deepEqual(
      parseRequestedTimeWindow({
        date: "2026-07-23",
        timeWindow: "09:30-10:45",
      }),
      {
        startsAt: "2026-07-23T09:30:00.000Z",
        endsAt: "2026-07-23T10:45:00.000Z",
      },
    );

    assert.deepEqual(
      parseRequestedTimeWindow({
        date: "2026-07-23",
        defaultDurationMinutes: 5,
        timeWindow: "13:00",
      }),
      {
        startsAt: "2026-07-23T13:00:00.000Z",
        endsAt: "2026-07-23T13:15:00.000Z",
      },
    );
    assert.equal(
      parseRequestedTimeWindow({ date: "2026-07-23", timeWindow: "10:30-09:30" }),
      null,
    );

    assert.deepEqual(
      parseRequestedTimeWindow({ date: "2026-07-23", timeWindow: "morning" }),
      {
        startsAt: "2026-07-23T08:00:00.000Z",
        endsAt: "2026-07-23T12:00:00.000Z",
      },
    );
    assert.equal(isExactRequestedTimeWindow("morning"), false);
    assert.equal(isExactRequestedTimeWindow("09:30-10:45"), true);
    assert.equal(
      formatRequestedTimeWindowLabel("morning"),
      "Morning (08:00–12:00 local time)",
    );
    assert.equal(
      formatRequestedTimeWindowLabel("evening", "fr-CA"),
      "Soir (17:00–21:00 heure locale)",
    );
    assert.deepEqual(
      parseRequestedTimeWindow({
        date: "2026-07-23",
        timeWindow: "09:30-10:45",
        timeZone: "America/Toronto",
      }),
      {
        endsAt: "2026-07-23T14:45:00.000Z",
        startsAt: "2026-07-23T13:30:00.000Z",
      },
    );
    assert.deepEqual(
      parseRequestedTimeWindow({
        date: "2026-07-23",
        timeWindow: "morning",
        timeZone: "America/Toronto",
      }),
      {
        endsAt: "2026-07-23T16:00:00.000Z",
        startsAt: "2026-07-23T12:00:00.000Z",
      },
    );
    assert.equal(
      parseRequestedTimeWindow({
        date: "2026-11-01",
        timeWindow: "01:30",
        timeZone: "America/Toronto",
      }),
      null,
    );
  });

  it("converts local manager times without server-timezone or DST ambiguity", () => {
    assert.deepEqual(
      parseZonedLocalDateTime({
        timeZone: "America/Toronto",
        value: "2026-07-23T09:30",
      }),
      { instant: "2026-07-23T13:30:00.000Z", status: "valid" },
    );
    assert.deepEqual(
      parseZonedLocalDateTime({
        timeZone: "America/Toronto",
        value: "2026-03-08T02:30",
      }),
      { status: "invalid" },
    );
    assert.deepEqual(
      parseZonedLocalDateTime({
        timeZone: "America/Toronto",
        value: "2026-11-01T01:30",
      }),
      { status: "ambiguous" },
    );
    assert.deepEqual(
      parseZonedLocalDateTime({ timeZone: "Not/AZone", value: "2026-07-23T09:30" }),
      { status: "invalid" },
    );
  });

  it("uses half-open ranges and ignores cancelled internal holds", () => {
    assert.equal(
      timeRangesOverlap({
        leftEnd: "2026-07-23T10:00:00.000Z",
        leftStart: "2026-07-23T09:00:00.000Z",
        rightEnd: "2026-07-23T11:00:00.000Z",
        rightStart: "2026-07-23T10:00:00.000Z",
      }),
      false,
    );

    const conflicts = findConflictingTimeBlocks({
      blocks: [
        block({ id: "reserved" }),
        block({
          id: "cancelled",
          status: "cancelled",
          startsAt: "2026-07-23T09:15:00.000Z",
        }),
      ],
      requested: {
        startsAt: "2026-07-23T09:30:00.000Z",
        endsAt: "2026-07-23T10:30:00.000Z",
      },
    });

    assert.deepEqual(conflicts.map((item) => item.id), ["reserved"]);
  });

  it("moves an internal suggestion past overlapping holds without confirming a booking", () => {
    const opening = findFirstInternalOpening({
      blocks: [
        block({
          endsAt: "2026-07-23T10:00:00.000Z",
          id: "first",
          startsAt: "2026-07-23T09:00:00.000Z",
        }),
        block({
          endsAt: "2026-07-23T11:00:00.000Z",
          id: "second",
          startsAt: "2026-07-23T10:00:00.000Z",
        }),
      ],
      durationMinutes: 60,
      from: "2026-07-23T09:30:00.000Z",
    });

    assert.deepEqual(opening, {
      startsAt: "2026-07-23T11:00:00.000Z",
      endsAt: "2026-07-23T12:00:00.000Z",
    });
    assert.equal(
      findFirstInternalOpening({
        blocks: [
          block({
            endsAt: "2026-07-23T21:00:00.000Z",
            startsAt: "2026-07-23T20:00:00.000Z",
          }),
        ],
        durationMinutes: 60,
        from: "2026-07-23T20:30:00.000Z",
        until: "2026-07-23T21:00:00.000Z",
      }),
      null,
    );

    const draft = renderAvailabilityReviewDraft({
      customerName: "Ari Customer",
      isExactTime: true,
      requestedTimeLabel: "2026-07-23 09:30 UTC",
      suggestedTimeLabel: "2026-07-23 11:00 UTC",
    });
    assert.match(draft, /fully occupied/i);
    assert.match(draft, /confirm the next step manually/i);
    assert.doesNotMatch(draft, /booking confirmed/i);

    const broadWindowDraft = renderAvailabilityReviewDraft({
      customerName: "Ari Customer",
      isExactTime: false,
      requestedTimeLabel: "Morning (08:00–12:00 UTC)",
      suggestedTimeLabel: null,
    });
    assert.match(broadWindowDraft, /reviewing availability/i);
    assert.doesNotMatch(broadWindowDraft, /fully occupied/i);
    assert.doesNotMatch(broadWindowDraft, /booking confirmed/i);

    const frenchDraft = renderAvailabilityReviewDraft({
      customerName: "Ari Customer",
      isExactTime: false,
      language: "fr-CA",
      requestedTimeLabel: "Matin (08:00–12:00 UTC)",
      suggestedTimeLabel: null,
    });
    assert.match(frenchDraft, /vérifions les disponibilités/i);
    assert.doesNotMatch(frenchDraft, /complets/i);
  });

  it("renders tokens locally and excludes terminal leads from batch eligibility", () => {
    assert.equal(
      renderBulkDraft({
        customerName: "Ari Customer",
        service: "Deep cleaning",
        template: "Hi {{firstName}}, we are reviewing {{service}} for {{customerName}}.",
      }),
      "Hi Ari, we are reviewing Deep cleaning for Ari Customer.",
    );
    assert.equal(isTerminalLeadStatus("archived"), true);
    assert.equal(isTerminalLeadStatus("booked"), true);
    assert.equal(isTerminalLeadStatus("lost"), true);
    assert.equal(isTerminalLeadStatus("new"), false);
  });
});
