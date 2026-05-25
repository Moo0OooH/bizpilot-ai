/**
 * ============================================================
 * File: tests/unit/signup-quote-bootstrap-source.test.mts
 * Project: BizPilot AI
 * Description: Source-level checks for signup quote-page bootstrap.
 * Role: Guards the synthetic-demo signup path so a confirmed owner lands with
 *       a previewable public quote page instead of an unavailable link.
 * Related:
 * - server/services/business.service.ts
 * - server/repositories/public-intake.repository.ts
 * Author: MoOoH
 * Created: 2026-05-25
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("Signup quote bootstrap source safety", () => {
  it("creates the public quote dependencies after owner membership exists", () => {
    const source = readFileSync("server/services/business.service.ts", "utf8");

    assert.equal(source.includes("bootstrapDefaultQuoteConfiguration"), true);
    assert.ok(
      source.indexOf("await createOwnerMembership") <
        source.indexOf("await bootstrapDefaultQuoteConfiguration"),
    );
    assert.equal(source.includes("upsertPublicLinkVariant"), true);
    assert.equal(source.includes("upsertConsentVersion"), true);
    assert.equal(source.includes("upsertIntakeFormFromTemplate"), true);
  });

  it("uses conservative default setup data without weakening tenant access", () => {
    const source = readFileSync("server/services/business.service.ts", "utf8");

    assert.equal(source.includes('privacyMode: "standard"'), true);
    assert.equal(source.includes("retainLeadsDays: 365"), true);
    assert.equal(source.includes("fieldOverrides: { fields: {} }"), true);
    assert.equal(source.includes("create policy"), false);
    assert.equal(source.includes("disable row level security"), false);
  });
});
