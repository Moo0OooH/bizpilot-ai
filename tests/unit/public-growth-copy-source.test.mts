/**
 * ============================================================
 * File: tests/unit/public-growth-copy-source.test.mts
 * Project: BizPilot AI
 * Description: Source guards for Phase 25 public growth copy.
 * Role: Keeps public copy workflow-led, cleaning-specific, and manual-first.
 * Related:
 * - lib/i18n/public-site-copy.ts
 * - app/features/page.tsx
 * - app/industries/cleaning/page.tsx
 * Author: MoOoH
 * Created: 2026-07-04
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const publicCopy = readFileSync("lib/i18n/public-site-copy.ts", "utf8");

test("features copy follows the manual quote recovery workflow", () => {
  for (const required of [
    "Capture requests where customers already find you.",
    "Organize each request before it becomes inbox work.",
    "Keep source context visible on the lead.",
    "Prepare the first reply without inventing details.",
    "Review, copy, and send manually.",
    "Keep follow-up from disappearing.",
  ]) {
    assert.equal(publicCopy.includes(required), true, `missing ${required}`);
  }

  assert.equal(publicCopy.includes("You copy, send manually, and keep follow-up visible"), true);
  assert.equal(publicCopy.includes("No auto-send"), true);
});

test("cleaning page copy stays service-specific without booking claims", () => {
  for (const required of [
    "residential, office, move-out, deep-clean, and recurring quote requests",
    "service, area, timing, contact path, source context",
    "Customer opens your quote link",
    "You review, copy, and send manually",
  ]) {
    assert.equal(publicCopy.includes(required), true, `missing ${required}`);
  }

  for (const forbidden of [
    "books the job automatically",
    "confirms the booking",
    "sends automatically",
  ]) {
    assert.equal(
      publicCopy.toLowerCase().includes(forbidden),
      false,
      `public growth copy should not include ${forbidden}`,
    );
  }
});

test("pilot proof metrics stay honest before real testimonials exist", () => {
  const pilotSource = readFileSync("app/pilot/page.tsx", "utf8");

  for (const required of [
    "What the pilot will measure",
    "Response speed",
    "Missing-detail clarity",
    "Follow-up visibility",
    "Source context",
    "These are pilot learning metrics, not testimonials, conversion-rate claims, or a performance guarantee.",
  ]) {
    assert.equal(publicCopy.includes(required), true, `missing ${required}`);
  }

  assert.equal(
    pilotSource.includes("copy.proof.metrics"),
    true,
    "Pilot page should render measured pilot proof architecture.",
  );
  assert.equal(
    pilotSource.includes("<form"),
    false,
    "Pilot proof section should not introduce a submitting form.",
  );

  for (const forbidden of [
    "guaranteed revenue",
    "guaranteed leads",
    "guaranteed conversion",
    "books jobs automatically",
    "auto-send replies",
    "real customer testimonials",
  ]) {
    assert.equal(
      publicCopy.toLowerCase().includes(forbidden),
      false,
      `pilot proof copy should not include ${forbidden}`,
    );
  }
});

test("pricing trust boundaries stay manual before paid pilot", () => {
  const pricingSource = readFileSync("app/pricing/page.tsx", "utf8");

  for (const required of [
    "Before any paid pilot starts",
    "No self-serve checkout is enabled.",
    "refund handling",
    "It is not booking, invoicing, SMS/WhatsApp, or full CRM software.",
    "Support, refund, and payment expectations are confirmed before any paid pilot",
  ]) {
    assert.equal(publicCopy.includes(required), true, `missing ${required}`);
  }

  assert.equal(
    pricingSource.includes("copy.trustBoundary"),
    true,
    "Pricing page should render paid-pilot trust boundaries from localized copy.",
  );

  for (const forbidden of [
    "self-serve checkout is live",
    "payment automation is enabled",
    "automatic refund",
    "bookings included",
    "SMS campaigns included",
  ]) {
    assert.equal(
      publicCopy.toLowerCase().includes(forbidden),
      false,
      `pricing trust copy should not include ${forbidden}`,
    );
  }
});
