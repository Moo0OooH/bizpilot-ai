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

  it("stores signup business name for future workspace recovery", () => {
    const authSource = readFileSync("server/services/auth.service.ts", "utf8");
    const actionSource = readFileSync("server/actions/auth.actions.ts", "utf8");

    assert.equal(authSource.includes("businessName?: string"), true);
    assert.equal(authSource.includes("business_name: input.businessName"), true);
    assert.equal(actionSource.includes("businessName,"), true);
  });

  it("exposes a guarded owner workspace recovery path", () => {
    const layoutSource = readFileSync("app/(dashboard)/layout.tsx", "utf8");
    const actionSource = readFileSync(
      "server/actions/workspace-recovery.actions.ts",
      "utf8",
    );
    const serviceSource = readFileSync("server/services/business.service.ts", "utf8");

    assert.equal(layoutSource.includes("Recover workspace"), true);
    assert.equal(actionSource.includes("getCurrentUser"), true);
    assert.equal(actionSource.includes("recoverWorkspaceAccess"), true);
    assert.equal(
      serviceSource.includes("blocked_existing_workspace_state"),
      true,
    );
    assert.equal(serviceSource.includes("status === \"suspended\""), false);
    assert.equal(serviceSource.includes("disable row level security"), false);
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
