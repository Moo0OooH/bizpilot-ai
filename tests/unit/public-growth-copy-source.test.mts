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
