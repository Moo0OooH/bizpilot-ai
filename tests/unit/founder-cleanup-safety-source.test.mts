/**
 * ============================================================
 * File: tests/unit/founder-cleanup-safety-source.test.mts
 * Project: BizPilot AI
 * Description: Source-level safety checks for founder test cleanup implementation.
 * Role: Guards against accidental auth.users deletion and client-side service-role imports.
 * Related:
 * - server/services/founder-test-cleanup.service.ts
 * - components/admin/founder-test-cleanup-form.tsx
 * Author: MoOoH
 * Created: 2026-05-24
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("Founder cleanup source safety", () => {
  it("does not delete auth users from workspace cleanup", () => {
    const source = readFileSync(
      "server/services/founder-test-cleanup.service.ts",
      "utf8",
    );

    assert.equal(source.includes("deleteUser("), false);
    assert.equal(source.includes(".auth.admin.deleteUser"), false);
    assert.equal(source.includes("authUsersDeleted: false"), true);
    assert.equal(source.includes("authUsersDeleted: true"), true);
  });

  it("keeps auth user deletion in a separate guarded service", () => {
    const source = readFileSync(
      "server/services/founder-auth-user-cleanup.service.ts",
      "utf8",
    );
    const form = readFileSync(
      "components/admin/founder-auth-user-delete-form.tsx",
      "utf8",
    );

    assert.equal(source.includes(".auth.admin.deleteUser"), true);
    assert.equal(
      source.includes("validateFounderAuthUserDeleteConfirmation"),
      true,
    );
    assert.equal(source.includes("getFounderAuthUserDeletionBlock"), true);
    assert.equal(source.includes('actionType: "test_auth_user_deleted"'), true);
    assert.equal(source.includes("updateFounderAdminActionNewValues"), true);
    assert.ok(
      source.indexOf("const actionId = await insertFounderAdminAction") <
        source.indexOf(".auth.admin.deleteUser"),
    );
    assert.equal(form.includes("createSupabaseServiceRoleClient"), false);
    assert.equal(form.includes("@/lib/supabase/server"), false);
  });

  it("does not expose service-role helpers to the client cleanup form", () => {
    const source = readFileSync(
      "components/admin/founder-test-cleanup-form.tsx",
      "utf8",
    );

    assert.equal(source.includes("createSupabaseServiceRoleClient"), false);
    assert.equal(source.includes("@/lib/supabase/server"), false);
  });

  it("requires dry-run before the final cleanup form can submit", () => {
    const component = readFileSync(
      "components/admin/founder-test-cleanup-form.tsx",
      "utf8",
    );
    const action = readFileSync("server/actions/founder-admin.actions.ts", "utf8");
    const service = readFileSync(
      "server/services/founder-test-cleanup.service.ts",
      "utf8",
    );

    assert.equal(component.includes("dryRunAvailable &&"), true);
    assert.equal(component.includes("dryRunConfirmedBusinessId"), true);
    assert.equal(action.includes("dryRunConfirmed:"), true);
    assert.equal(service.includes("Run dry-run before final cleanup."), true);
  });

  it("keeps production-safe cleanup warnings visible in founder admin UI", () => {
    const cleanupForm = readFileSync(
      "components/admin/founder-test-cleanup-form.tsx",
      "utf8",
    );
    const authDeleteForm = readFileSync(
      "components/admin/founder-auth-user-delete-form.tsx",
      "utf8",
    );
    const adminPage = readFileSync("app/admin/page.tsx", "utf8");

    assert.equal(
      cleanupForm.includes("Hard purge is blocked for production_customer"),
      true,
    );
    assert.equal(
      cleanupForm.includes("Workspace cleanup never deletes Supabase Auth users"),
      true,
    );
    assert.equal(
      authDeleteForm.includes("keeps founder and production-customer accounts blocked"),
      true,
    );
    assert.equal(adminPage.includes("FounderAdminSafetyRail"), true);
    assert.equal(adminPage.includes("Production customer is locked"), true);
  });

  it("dry-run counts rows without selecting customer content columns", () => {
    const source = readFileSync(
      "server/services/founder-test-cleanup.service.ts",
      "utf8",
    );

    assert.equal(source.includes('select("*", { count: "exact", head: true })'), true);
    assert.equal(source.includes("customer_email"), false);
    assert.equal(source.includes("customer_phone"), false);
    assert.equal(source.includes("prompt"), false);
    assert.equal(source.includes("output_text"), false);
  });
});
