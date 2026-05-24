/**
 * ============================================================
 * File: tests/unit/business-lifecycle-lock.test.mts
 * Project: BizPilot AI
 * Description: Tests lifecycle lock classification for new customer-data work.
 * Role: Ensures deletion-requested workspaces block new AI/customer workflows.
 * Related:
 * - lib/business-lifecycle/lock.ts
 * - server/services/ai/lead-conversion-assistant.service.ts
 * Author: MoOoH
 * Created: 2026-05-24
 * ============================================================
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { isWorkspaceLockedForNewCustomerWork } from "../../lib/business-lifecycle/lock.ts";

describe("Business lifecycle lock", () => {
  it("locks workspaces that are in deletion lifecycle states", () => {
    assert.equal(isWorkspaceLockedForNewCustomerWork("deletion_requested"), true);
    assert.equal(isWorkspaceLockedForNewCustomerWork("deleting"), true);
    assert.equal(isWorkspaceLockedForNewCustomerWork("deleted"), true);
  });

  it("does not lock active or archived workspaces by deletion lifecycle alone", () => {
    assert.equal(isWorkspaceLockedForNewCustomerWork("active"), false);
    assert.equal(isWorkspaceLockedForNewCustomerWork("archived"), false);
  });
});
