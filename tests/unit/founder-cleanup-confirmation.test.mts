/**
 * ============================================================
 * File: tests/unit/founder-cleanup-confirmation.test.mts
 * Project: BizPilot AI
 * Description: Tests founder test/demo cleanup confirmation helpers.
 * Role: Ensures production workspaces and weak confirmations cannot pass pure guards.
 * Related:
 * - lib/founder-cleanup/confirmation.ts
 * Author: MoOoH
 * Created: 2026-05-24
 * ============================================================
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  isCleanupEligibleWorkspaceKind,
  isExactBusinessNameOrSlugConfirmation,
  validateFounderCleanupConfirmation,
} from "../../lib/founder-cleanup/confirmation.ts";

describe("Founder test cleanup confirmation", () => {
  it("allows only explicit non-production workspace kinds", () => {
    assert.equal(isCleanupEligibleWorkspaceKind("founder_test"), true);
    assert.equal(isCleanupEligibleWorkspaceKind("demo"), true);
    assert.equal(isCleanupEligibleWorkspaceKind("seed"), true);
    assert.equal(isCleanupEligibleWorkspaceKind("production_customer"), false);
  });

  it("accepts exact business name or slug confirmations", () => {
    assert.equal(
      isExactBusinessNameOrSlugConfirmation({
        businessName: "Internal Demo Cleaning",
        businessSlug: "internal-demo-cleaning",
        typedConfirmation: "Internal Demo Cleaning",
      }),
      true,
    );
    assert.equal(
      isExactBusinessNameOrSlugConfirmation({
        businessName: "Internal Demo Cleaning",
        businessSlug: "internal-demo-cleaning",
        typedConfirmation: "internal-demo-cleaning",
      }),
      true,
    );
    assert.equal(
      isExactBusinessNameOrSlugConfirmation({
        businessName: "Internal Demo Cleaning",
        businessSlug: "internal-demo-cleaning",
        typedConfirmation: "internal demo cleaning",
      }),
      false,
    );
  });

  it("rejects missing acknowledgement, final confirmation, and wrong mode", () => {
    assert.throws(
      () =>
        validateFounderCleanupConfirmation({
          acknowledged: false,
          businessName: "Internal Demo Cleaning",
          businessSlug: "internal-demo-cleaning",
          cleanupMode: "test_hard_purge",
          finalConfirmed: true,
          typedConfirmation: "Internal Demo Cleaning",
        }),
      /Confirm that you understand this test cleanup\./,
    );
    assert.throws(
      () =>
        validateFounderCleanupConfirmation({
          acknowledged: true,
          businessName: "Internal Demo Cleaning",
          businessSlug: "internal-demo-cleaning",
          cleanupMode: "test_hard_purge",
          finalConfirmed: false,
          typedConfirmation: "Internal Demo Cleaning",
        }),
      /Confirm that you understand this test cleanup\./,
    );
    assert.throws(
      () =>
        validateFounderCleanupConfirmation({
          acknowledged: true,
          businessName: "Internal Demo Cleaning",
          businessSlug: "internal-demo-cleaning",
          cleanupMode: "production_purge",
          finalConfirmed: true,
          typedConfirmation: "Internal Demo Cleaning",
        }),
      /Invalid cleanup mode\./,
    );
  });
});
