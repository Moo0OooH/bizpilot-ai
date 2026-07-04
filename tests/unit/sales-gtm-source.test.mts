/**
 * ============================================================
 * File: tests/unit/sales-gtm-source.test.mts
 * Project: BizPilot AI
 * Description: Source-level guardrails for founder-led GTM and pilot operations.
 * Role: Keeps sales docs aligned with manual-first quote recovery and policy-safe local trust.
 * Related:
 * - docs/sales/FOUNDER_CRM_AND_OUTREACH_PLAYBOOK.md
 * - docs/sales/FOUNDER_CRM_PROSPECT_TEMPLATE.csv
 * - docs/readiness/PHASE_25M_GTM_AND_PILOT_OPS_PACKET_2026-07-04.md
 * Author: MoOoH
 * Created: 2026-07-04
 * Last Updated: 2026-07-04
 * Change Log:
 * - 2026-07-04: Added Phase 25M GTM/pilot-ops packet guards.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function source(path: string): string {
  return readFileSync(path, "utf8");
}

describe("founder GTM and pilot-ops source contracts", () => {
  const playbook = source("docs/sales/FOUNDER_CRM_AND_OUTREACH_PLAYBOOK.md");
  const template = source("docs/sales/FOUNDER_CRM_PROSPECT_TEMPLATE.csv");
  const phase25m = source(
    "docs/readiness/PHASE_25M_GTM_AND_PILOT_OPS_PACKET_2026-07-04.md",
  );
  const backlog = source(
    "docs/readiness/PHASE_25_SITE_DASHBOARD_GROWTH_BACKLOG_2026-07-04.md",
  );

  it("keeps the founder CRM template header-only and validation-ready", () => {
    const rows = template.trim().split(/\r?\n/u);
    const fields = rows[0]?.split(",") ?? [];

    assert.equal(rows.length, 1);
    for (const field of [
      "source_type",
      "source_permission",
      "quote_link_placement_candidate",
      "last_outreach_date",
      "demo_date",
      "objection_category",
      "support_expectation",
      "refund_payment_terms_confirmed",
      "proof_metric_focus",
    ]) {
      assert.equal(fields.includes(field), true, `Missing CRM field ${field}.`);
      assert.equal(
        playbook.includes(`\`${field}\``),
        true,
        `Playbook missing ${field}.`,
      );
    }
  });

  it("keeps outreach and demo scripts manual-first and cleaning-specific", () => {
    for (const required of [
      "Phase 25M GTM / pilot-ops packet ready",
      "cleaning quote workflow",
      "Nothing sends automatically. You review, edit, copy, and send",
      "Five-Minute Demo Run-Of-Show",
      "synthetic/sample cleaning data only",
      "manual owner review and copy/send",
      "no auto-send, no booking, no invoicing, no SMS/WhatsApp automation",
    ]) {
      assert.equal(playbook.includes(required), true, `Missing ${required}.`);
    }
  });

  it("keeps paid pilot collection blocked behind support and refund gates", () => {
    for (const required of [
      "Pilot payment remains blocked",
      "manual invoice",
      "no self-serve checkout",
      "no automatic renewal",
      "refund terms before collection",
      "support expectations",
      "rollback path",
      "paid pilot remains blocked",
    ]) {
      assert.equal(
        `${playbook}\n${phase25m}`.includes(required),
        true,
        `Missing ${required}.`,
      );
    }
  });

  it("keeps Google Business Profile and review guidance policy-safe", () => {
    for (const required of [
      "Google Business Profile",
      "Google local business links",
      "Google review request guidance",
      "FTC Consumer Reviews and Testimonials Rule",
      "Do not offer incentives for reviews",
      "Do not ask customers to remove/change negative reviews",
      "Do not generate fake, AI-written, staff, family, or conflict-of-interest reviews",
      "selective positive-review solicitation",
      "https://support.google.com/business/answer/3474122",
      "https://support.google.com/contributionpolicy/answer/7400114",
      "https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers",
    ]) {
      assert.equal(
        `${playbook}\n${phase25m}`.includes(required),
        true,
        `Missing ${required}.`,
      );
    }
  });

  it("records Phase 25M backlog advancement without opening future gates", () => {
    for (const required of [
      "Progress Addendum - Phase 25M",
      "80 done",
      "81 done",
      "82 done",
      "83 done as a manual pilot-ops packet; paid pilot remains blocked",
      "84 done",
      "89 preserved as a required paid-pilot blocker",
      "94 preserved",
      "95 preserved",
      "96 preserved",
      "97 preserved",
      "100 preserved",
    ]) {
      assert.equal(backlog.includes(required), true, `Missing ${required}.`);
    }
  });
});
