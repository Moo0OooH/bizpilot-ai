/**
 * File: tests/unit/auth-identity-recovery-source.test.mts
 * Project: BizPilot AI
 * Description: Source guardrails for detached Google identity recovery.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("Auth identity recovery source safety", () => {
  it("preserves the canonical owner UUID and deletes only a workspace-free Google duplicate", () => {
    const source = readFileSync(
      "server/services/auth-identity-recovery.service.ts",
      "utf8",
    );
    const deleteIndex = source.indexOf("auth.admin.deleteUser(");
    const detachedMembershipIndex = source.indexOf("detachedMemberships");
    const canonicalMembershipIndex = source.indexOf("canonicalMembership");

    assert.equal(source.includes('input.currentUser.authProvider !== "google"'), true);
    assert.equal(source.includes('detachedProviders.has("email")'), true);
    assert.equal(source.includes('canonicalProviders.has("email")'), true);
    assert.equal(source.includes('.eq("owner_user_id", detachedUser.id)'), true);
    assert.equal(source.includes('.eq("role", "owner")'), true);
    assert.equal(source.includes('.eq("status", "active")'), true);
    assert.ok(detachedMembershipIndex > -1);
    assert.ok(canonicalMembershipIndex > detachedMembershipIndex);
    assert.ok(deleteIndex > canonicalMembershipIndex);
    assert.equal(
      source.includes("auth.admin.deleteUser(canonicalUser.id"),
      false,
    );
  });

  it("links Google only from an authenticated owner session", () => {
    const actionSource = readFileSync("server/actions/auth.actions.ts", "utf8");
    const serviceSource = readFileSync("server/services/auth.service.ts", "utf8");
    const settingsSource = readFileSync(
      "app/(dashboard)/dashboard/settings/page.tsx",
      "utf8",
    );

    assert.equal(actionSource.includes("connectGoogleIdentityAction"), true);
    assert.equal(actionSource.includes("const user = await getCurrentUser()"), true);
    assert.equal(serviceSource.includes("supabase.auth.linkIdentity"), true);
    assert.equal(settingsSource.includes("connectGoogleIdentityAction"), true);
    assert.equal(settingsSource.includes('authProviders.includes("google")'), true);
  });

  it("does not report reset delivery success after an auth provider error", () => {
    const actionSource = readFileSync("server/actions/auth.actions.ts", "utf8");
    const failureIndex = actionSource.indexOf(
      'safeLogger.error("auth.password_reset.primary_failed"',
    );
    const deliveryErrorIndex = actionSource.indexOf(
      "redirectWithForgotPasswordError(PASSWORD_RESET_DELIVERY_MESSAGE)",
      failureIndex,
    );

    assert.ok(failureIndex > -1);
    assert.ok(deliveryErrorIndex > failureIndex);
  });
});
