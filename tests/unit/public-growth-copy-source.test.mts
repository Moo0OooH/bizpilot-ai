/*
 * ============================================================
 * File: tests/unit/public-growth-copy-source.test.mts
 * Project: BizPilot AI
 * Description: Source guards for the universal public V2 growth message.
 * Role: Protects the smart-intake workflow, cleaning-first launch, manual conversion, staged pricing, and trust boundaries.
 * Related:
 * - lib/i18n/public-v2-copy.ts
 * - app/pilot/page.tsx
 * - app/pricing/page.tsx
 * - app/trust/page.tsx
 * Author: MoOoH
 * Created: 2026-07-04
 * Last Updated: 2026-07-13
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { getPolicyCopy } from "../../lib/i18n/policy-copy.ts";
import { getPublicV2Copy } from "../../lib/i18n/public-v2-copy.ts";

const english = getPublicV2Copy("en");
const french = getPublicV2Copy("fr-CA");

function source(path: string): string {
  return readFileSync(path, "utf8");
}

test("features copy follows the current smart-intake workflow", () => {
  assert.deepEqual(
    english.home.flow.steps.map((step) => step.title),
    ["Share", "Collect", "Organize", "Prepare", "Approve"],
  );
  assert.equal(english.home.features.cards.length, 6);
  assert.match(english.features.notice?.badge ?? "", /Roadmap/i);
  assert.match(
    english.features.notice?.body ?? "",
    /Gmail, WhatsApp, Instagram, Messenger, and SMS/i,
  );
  assert.match(english.home.control.title, /owner keeps the decision/i);
  assert.match(french.home.control.title, /proprietaire garde la decision/i);
});

test("cleaning remains the first complete vertical without booking claims", () => {
  const serviceCards = english.cleaning.sections[0]?.cards ?? [];

  assert.equal(serviceCards.length, 6);
  assert.deepEqual(
    serviceCards.map((card) => card.title),
    [
      "Residential cleaning",
      "Deep cleaning",
      "Move-in / move-out",
      "Office cleaning",
      "Airbnb turnover",
      "Post-construction",
    ],
  );
  assert.equal(english.home.industries.cards[0]?.title, "Cleaning");
  assert.match(english.home.industries.cards[0]?.badge ?? "", /Founder pilot/i);
  assert.equal(
    english.home.industries.cards.slice(1).every((card) =>
      /Roadmap template/i.test(card.badge ?? ""),
    ),
    true,
  );

  const serialized = JSON.stringify(english).toLowerCase();
  for (const forbidden of [
    "books the job automatically",
    "confirms the booking automatically",
    "sends customer messages automatically",
  ]) {
    assert.equal(serialized.includes(forbidden), false, forbidden);
  }
});

test("pilot conversion stays founder-led, measurable, and non-submitting", () => {
  const pilotSource = source("app/pilot/page.tsx");
  const templateSource = source(
    "components/public/pilot-request-template-card.tsx",
  );

  assert.equal(english.pilot.sections.length, 2);
  assert.match(english.pilot.badge, /Cleaning businesses first/i);
  assert.match(english.pilot.notice?.badge ?? "", /Approval gate/i);
  assert.match(
    english.pilot.notice?.body ?? "",
    /Real customer data, payment, and onboarding begin only after explicit/i,
  );
  assert.match(french.pilot.notice?.badge ?? "", /Porte d'approbation/i);

  assert.equal(pilotSource.includes("PilotRequestTemplateCard"), true);
  assert.equal(pilotSource.includes('id="pilot-request-template"'), true);
  assert.equal(pilotSource.includes("getPublicV2Copy"), true);
  assert.equal(pilotSource.includes("getPublicSiteCopy"), true);
  for (const forbidden of ["<form", "<input", "<select", "<textarea"]) {
    assert.equal(pilotSource.includes(forbidden), false, forbidden);
  }

  assert.equal(templateSource.includes("navigator.clipboard.writeText"), true);
  assert.equal(templateSource.includes('document.execCommand("copy")'), true);
  assert.equal(templateSource.includes('aria-live="polite"'), true);
  assert.equal(templateSource.includes("mailto:?subject="), true);
  for (const forbidden of ["fetch(", "XMLHttpRequest", "<form"]) {
    assert.equal(templateSource.includes(forbidden), false, forbidden);
  }
});

test("pricing keeps approved values and manual paid-pilot gates", () => {
  const pricingSource = source("app/pricing/page.tsx");
  const serialized = JSON.stringify(english.pricing);

  for (const approvedValue of [
    "$0 setup",
    "$149 setup + $49/month",
    "$199 setup + $79/month",
  ]) {
    assert.equal(serialized.includes(approvedValue), true, approvedValue);
  }

  assert.match(english.pricing.body, /no self-serve checkout/i);
  assert.match(
    english.pricing.notice?.body ?? "",
    /manual invoice or Stripe Payment Link/i,
  );
  assert.match(
    english.pricing.notice?.body ?? "",
    /does not currently offer in-app billing automation/i,
  );
  assert.equal(pricingSource.includes("getPublicV2Copy"), true);
  assert.equal(pricingSource.includes("BizPilotV2Page"), true);
});

test("trust and security copy keep human and production gates explicit", () => {
  const trustSource = source("app/trust/page.tsx");
  const security = getPolicyCopy("en").security;
  const securityText = JSON.stringify(security);

  assert.deepEqual(
    english.trust.sections[0]?.cards.map((card) => card.title),
    ["No automatic sending", "No invented pricing", "Editable output"],
  );
  assert.match(english.trust.notice?.badge ?? "", /Production gate/i);
  assert.match(
    english.trust.notice?.body ?? "",
    /Backup, migration drift, production security posture, and restore confidence/i,
  );
  assert.equal(trustSource.includes("getPublicV2Copy"), true);
  assert.equal(trustSource.includes("BizPilotV2Page"), true);

  for (const required of [
    "Local-only dashboard QA",
    "managed/non-local Supabase projects",
    "production URLs",
    "Strict restored app/dashboard/RLS proof remains deferred",
  ]) {
    assert.equal(securityText.includes(required), true, required);
  }

  const combined = `${JSON.stringify(english)}\n${securityText}`.toLowerCase();
  for (const forbidden of [
    "real customer data is approved",
    "paid pilot is approved",
    "dashboard smoke can run against production",
    "restored app proof passed",
  ]) {
    assert.equal(combined.includes(forbidden), false, forbidden);
  }
});
