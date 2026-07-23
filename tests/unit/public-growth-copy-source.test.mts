/**
 * ============================================================
 * File: tests/unit/public-growth-copy-source.test.mts
 * Project: BizPilot AI
 * Description: Source guards for the Website V3 growth and manual-first conversion message.
 * Role: Protects smart intake, cleaning-first proof, safe pilot conversion, approved pricing, and human-control boundaries.
 * Related:
 * - lib/i18n/public-v3-spec.ts
 * - components/public/public-v3-page.tsx
 * - components/public/public-v3-pilot-request.tsx
 * Author: MoOoH
 * Created: 2026-07-04
 * Last Updated: 2026-07-23
 * Change Log:
 * - 2026-07-23: Updated the workflow contract for one shared form with placement-specific tracked links.
 * - 2026-07-13: Replaced retired V2 route guards with retained Website V3 conversion contracts.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { getPolicyCopy } from "../../lib/i18n/policy-copy.ts";
import { getPublicV3Spec } from "../../lib/i18n/public-v3-spec.ts";

const english = getPublicV3Spec("en");
const french = getPublicV3Spec("fr-CA");

function source(path: string): string {
  return readFileSync(path, "utf8");
}

test("features copy follows the current smart-intake workflow", () => {
  const workflowSection = english.home.sections.find(
    (section) => section.key === "workflow",
  );

  assert.deepEqual(
    english.home.workflowSteps.map((step) => step.title),
    ["Share tracked links", "Ask", "Organize", "Review"],
  );
  assert.match(workflowSection?.body ?? "", /one customer intake form/i);
  assert.match(workflowSection?.body ?? "", /source and optional campaign tag/i);
  assert.equal(english.features.length, 6);
  assert.match(english.features[0]?.title ?? "", /One link/i);
  assert.match(english.features[4]?.title ?? "", /AI-assisted reply drafts/i);
  assert.match(english.faqItems[0]?.answer ?? "", /not active product functionality/i);
  assert.match(french.trust[3]?.title ?? "", /Validation humaine/i);
});

test("cleaning remains the first complete vertical without booking claims", () => {
  const serialized = JSON.stringify(english).toLowerCase();

  assert.match(english.routes["/demo"].hero.eyebrow, /cleaning/i);
  assert.match(english.routes["/pilot"].hero.eyebrow, /cleaning/i);
  assert.match(english.faqItems.at(-1)?.answer ?? "", /only complete pilot template/i);
  for (const forbidden of [
    "books the job automatically",
    "confirms the booking automatically",
    "sends customer messages automatically",
  ]) {
    assert.equal(serialized.includes(forbidden), false, forbidden);
  }
});

test("pilot conversion stays founder-led and non-submitting", () => {
  const pilotRoute = source("app/pilot/page.tsx");
  const requestCard = source("components/public/public-v3-pilot-request.tsx");

  assert.equal(english.pilot.fit.length, 4);
  assert.equal(english.pilot.nextSteps.length, 4);
  assert.match(english.pilot.submissionBoundary, /does not submit or store/i);
  assert.match(french.pilot.submissionBoundary, /n'envoie ni ne conserve/i);
  assert.equal(pilotRoute.includes("PublicV3Page"), true);
  assert.equal(pilotRoute.includes("getPublicV3Spec"), true);
  assert.equal(requestCard.includes("navigator.clipboard.writeText"), true);
  assert.equal(requestCard.includes('aria-live="polite"'), true);
  for (const forbidden of ["mailto:", "fetch(", "XMLHttpRequest", "<form", "<input"]) {
    assert.equal(requestCard.includes(forbidden), false, forbidden);
  }
});

test("pricing keeps approved values and manual paid-pilot gates", () => {
  const serialized = JSON.stringify(english.pricing);
  for (const approvedValue of [
    "$0 setup",
    "$149 setup + $49/month",
    "$199 setup + $79/month",
  ]) {
    assert.equal(serialized.includes(approvedValue), true, approvedValue);
  }

  assert.match(english.pricing.notice, /No checkout happens on this page/i);
  assert.match(english.pricing.notice, /confirmed before any paid pilot/i);
  assert.equal(source("app/pricing/page.tsx").includes("PublicV3Page"), true);
});

test("trust and security copy keep human and production gates explicit", () => {
  const securityText = JSON.stringify(getPolicyCopy("en").security);

  assert.deepEqual(
    english.trust.slice(0, 4).map((item) => item.title),
    [
      "Explicit customer inputs",
      "Visible missing information",
      "Bounded AI assistance",
      "Human review before sending",
    ],
  );
  assert.equal(source("app/trust/page.tsx").includes("PublicV3Page"), true);
  for (const required of [
    "Local-only dashboard QA",
    "managed/non-local Supabase projects",
    "production URLs",
    "Strict restored app/dashboard/RLS proof remains deferred",
  ]) {
    assert.equal(securityText.includes(required), true, required);
  }

  const combined = `${JSON.stringify(english)}\n${securityText}`.toLowerCase();
  for (const forbidden of ["real customer data is approved", "production is certified"]) {
    assert.equal(combined.includes(forbidden), false, forbidden);
  }
});
