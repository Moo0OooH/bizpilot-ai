/**
 * ============================================================
 * File: tests/unit/sales-gtm-source.test.mts
 * Project: BizPilot AI
 * Description: Source-level guardrails for founder-led validation and gated pilot operations.
 * Role: Keeps sales docs aligned with manual-first quote recovery, current V2 gates, and policy-safe local trust.
 * Related:
 * - docs/sales/FOUNDER_CRM_AND_OUTREACH_PLAYBOOK.md
 * - docs/sales/FOUNDER_CRM_PROSPECT_TEMPLATE.csv
 * - docs/project-v2/MASTER_PHASE_AND_FINALIZATION_PLAN_2026-07-15.md
 * - prompts/BIZPILOT_EXTERNAL_ACTION_PROMPT_PACK_v2.1.md
 * Author: MoOoH
 * Created: 2026-07-04
 * Last Updated: 2026-07-15
 * Change Log:
 * - 2026-07-15: Replaced Phase 25 report dependencies with the current master and pilot-readiness gates.
 * - 2026-07-14: Replaced the stale Phase 25M status assertion with the current external-validation and V2 gate contract.
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
  const pilotReadiness = source(
    "docs/operations/BIZPILOT_PILOT_READINESS_CHECKLIST_v2.0.md",
  );
  const masterPlan = source(
    "docs/project-v2/MASTER_PHASE_AND_FINALIZATION_PLAN_2026-07-15.md",
  );
  const routeAudit = source(
    "docs/project-v2/BILINGUAL_ROUTE_AND_FLOW_AUDIT_2026-07-15.md",
  );
  const externalPromptPack = source(
    "prompts/BIZPILOT_EXTERNAL_ACTION_PROMPT_PACK_v2.1.md",
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
      "Current external prospect-validation workflow",
      "real-data and paid-pilot gates remain separate",
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
      "NOT APPROVED",
    ]) {
      assert.equal(
        `${playbook}\n${pilotReadiness}\n${masterPlan}`.includes(required),
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
      "selective review",
      "https://support.google.com/business/answer/3474122",
      "https://support.google.com/contributionpolicy/answer/7400114",
      "https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers",
    ]) {
      assert.equal(
        `${playbook}\n${pilotReadiness}`.includes(required),
        true,
        `Missing ${required}.`,
      );
    }
  });

  it("keeps founder-led validation sequenced before real data and paid pilot", () => {
    for (const required of [
      "Public discovery → pilot",
      "There is no fake form submission, automated outreach, checkout, or activation",
      "Real customer data",
      "NOT APPROVED",
      "Paid pilot",
      "NOT APPROVED",
      "Use only real prospect consent evidence",
    ]) {
      assert.equal(
        `${masterPlan}\n${pilotReadiness}\n${routeAudit}\n${externalPromptPack}`.includes(
          required,
        ),
        true,
        `Missing ${required}.`,
      );
    }
  });
});
