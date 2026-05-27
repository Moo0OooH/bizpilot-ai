/**
 * ============================================================
 * File: tests/unit/founder-auth-user-deletion.test.mts
 * Project: BizPilot AI
 * Description: Tests founder fake/test auth user deletion guards.
 * Role: Ensures auth identity deletion cannot target founders or production users.
 * Related:
 * - lib/founder-cleanup/auth-user-deletion.ts
 * Author: MoOoH
 * Created: 2026-05-24
 * ============================================================
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getFounderAuthUserDeletionBlock,
  isExactAuthUserDeleteConfirmation,
  validateFounderAuthUserDeleteConfirmation,
} from "../../lib/founder-cleanup/auth-user-deletion.ts";

describe("Founder auth user deletion guards", () => {
  it("requires exact email or user id confirmation", () => {
    assert.equal(
      isExactAuthUserDeleteConfirmation({
        targetEmail: "fake-owner@example.com",
        targetUserId: "user-123",
        typedConfirmation: "fake-owner@example.com",
      }),
      true,
    );
    assert.equal(
      isExactAuthUserDeleteConfirmation({
        targetEmail: "fake-owner@example.com",
        targetUserId: "user-123",
        typedConfirmation: "user-123",
      }),
      true,
    );
    assert.equal(
      isExactAuthUserDeleteConfirmation({
        targetEmail: "fake-owner@example.com",
        targetUserId: "user-123",
        typedConfirmation: "fake owner",
      }),
      false,
    );
  });

  it("blocks founder, self, and production workspace users", () => {
    assert.equal(
      getFounderAuthUserDeletionBlock({
        actorUserId: "founder-1",
        isFounderUser: false,
        linkedBusinesses: [],
        targetUserId: "founder-1",
      }),
      "Founder admin cannot delete the signed-in founder account.",
    );
    assert.equal(
      getFounderAuthUserDeletionBlock({
        actorUserId: "founder-1",
        isFounderUser: true,
        linkedBusinesses: [],
        targetUserId: "founder-2",
      }),
      "Founder admin cannot delete a founder allowlist account.",
    );
    assert.equal(
      getFounderAuthUserDeletionBlock({
        actorUserId: "founder-1",
        isFounderUser: false,
        linkedBusinesses: [
          {
            businessId: "biz-2",
            membershipRole: "member",
            ownerUserId: "other-user",
            workspaceKind: "production_customer",
          },
        ],
        targetUserId: "target-1",
      }),
      "Auth user deletion is blocked for production workspaces.",
    );
  });

  it("allows non-founder users linked only to test/demo/seed workspaces", () => {
    assert.equal(
      getFounderAuthUserDeletionBlock({
        actorUserId: "founder-1",
        isFounderUser: false,
        linkedBusinesses: [
          {
            businessId: "biz-1",
            membershipRole: "member",
            ownerUserId: "owner-1",
            workspaceKind: "founder_test",
          },
          {
            businessId: "biz-2",
            membershipRole: "owner",
            ownerUserId: "target-1",
            workspaceKind: "demo",
          },
        ],
        targetUserId: "target-1",
      }),
      null,
    );
  });

  it("allows explicit reclassification only for production workspaces owned by the target", () => {
    assert.equal(
      getFounderAuthUserDeletionBlock({
        actorUserId: "founder-1",
        allowProductionWorkspaceReclassification: true,
        isFounderUser: false,
        linkedBusinesses: [
          {
            businessId: "biz-owned",
            membershipRole: "owner",
            ownerUserId: "target-1",
            workspaceKind: "production_customer",
          },
        ],
        targetUserId: "target-1",
      }),
      null,
    );
    assert.equal(
      getFounderAuthUserDeletionBlock({
        actorUserId: "founder-1",
        allowProductionWorkspaceReclassification: true,
        isFounderUser: false,
        linkedBusinesses: [
          {
            businessId: "biz-member",
            membershipRole: "member",
            ownerUserId: "other-user",
            workspaceKind: "production_customer",
          },
        ],
        targetUserId: "target-1",
      }),
      "Auth user deletion is blocked because the user belongs to a production workspace they do not own.",
    );
  });

  it("rejects weak final confirmations", () => {
    assert.throws(
      () =>
        validateFounderAuthUserDeleteConfirmation({
          acknowledged: false,
          cleanupMode: "test_auth_user_delete",
          finalConfirmed: true,
          targetEmail: "fake-owner@example.com",
          targetUserId: "user-123",
          typedConfirmation: "fake-owner@example.com",
        }),
      /Confirm that you understand this auth user deletion\./,
    );
    assert.throws(
      () =>
        validateFounderAuthUserDeleteConfirmation({
          acknowledged: true,
          cleanupMode: "wrong_mode",
          finalConfirmed: true,
          targetEmail: "fake-owner@example.com",
          targetUserId: "user-123",
          typedConfirmation: "fake-owner@example.com",
        }),
      /Invalid auth user cleanup mode\./,
    );
    assert.throws(
      () =>
        validateFounderAuthUserDeleteConfirmation({
          acknowledged: true,
          cleanupMode: "test_auth_user_delete",
          finalConfirmed: true,
          targetEmail: "fake-owner@example.com",
          targetUserId: "user-123",
          typedConfirmation: "fake",
        }),
      /Type the exact auth user email or ID to confirm deletion\./,
    );
  });
});
