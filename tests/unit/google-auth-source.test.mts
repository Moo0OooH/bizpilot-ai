/**
 * ============================================================
 * File: tests/unit/google-auth-source.test.mts
 * Project: BizPilot AI
 * Description: Source-level guards for Phase 27B Google login.
 * Role: Proves Google OAuth stays login-only and does not weaken signup,
 *       workspace, redirect, or phone-auth boundaries.
 * Related:
 * - server/actions/auth.actions.ts
 * - server/services/auth.service.ts
 * - app/auth/sign-in/page.tsx
 * - app/auth/sign-up/page.tsx
 * Author: MoOoH
 * Created: 2026-07-05
 * Last Updated: 2026-07-17
 * Change Log:
 * - 2026-07-17: Guarded provider-normalized recovery so Google login cannot create a new workspace.
 * - 2026-07-05: Created Google login source guards for Phase 27B.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function readSource(path: string): string {
  return readFileSync(path, "utf8");
}

describe("Google auth source safety", () => {
  it("starts Google OAuth through the existing auth callback route with login-only scopes", () => {
    const serviceSource = readSource("server/services/auth.service.ts");
    const actionSource = readSource("server/actions/auth.actions.ts");

    assert.equal(serviceSource.includes("signInWithGoogleOAuth"), true);
    assert.equal(serviceSource.includes('provider: "google"'), true);
    assert.equal(
      serviceSource.includes(
        'export const GOOGLE_AUTH_LOGIN_SCOPES = "openid email profile"',
      ),
      true,
    );
    assert.equal(serviceSource.toLowerCase().includes("gmail"), false);
    assert.equal(actionSource.includes('new URL("/auth/callback"'), true);
    assert.equal(
      actionSource.includes("getSafeAuthCallbackNextPath(nextPath ?? null)"),
      true,
    );
    assert.equal(actionSource.includes("signInWithGoogleOAuth({"), true);
  });

  it("keeps Google OAuth separate from signup workspace bootstrap", () => {
    const actionSource = readSource("server/actions/auth.actions.ts");
    const callbackSource = readSource("app/auth/callback/route.ts");
    const googleActionStart = actionSource.indexOf(
      "export async function signInWithGoogleAction",
    );
    const nextActionStart = actionSource.indexOf(
      "export async function requestPasswordResetAction",
    );
    const googleActionSource = actionSource.slice(
      googleActionStart,
      nextActionStart,
    );

    assert.ok(googleActionStart > -1);
    assert.ok(nextActionStart > googleActionStart);
    assert.equal(googleActionSource.includes("createFoundingBusiness"), false);
    assert.equal(googleActionSource.includes("signUpWithPassword"), false);
    assert.equal(callbackSource.includes("createFoundingBusiness"), false);
    assert.equal(callbackSource.includes("signUpWithPassword"), false);
  });

  it("allows existing-workspace repair but blocks new workspace creation for Google identities", () => {
    const authServiceSource = readSource("server/services/auth.service.ts");
    const businessServiceSource = readSource("server/services/business.service.ts");
    const recoveryActionSource = readSource(
      "server/actions/workspace-recovery.actions.ts",
    );
    const founderServiceSource = readSource(
      "server/services/founder-admin.service.ts",
    );
    const creationPolicyIndex = businessServiceSource.indexOf(
      "if (!input.allowWorkspaceCreation)",
    );
    const existingRepairReturnIndex = businessServiceSource.indexOf(
      "return recoverableOwnedBusiness;",
    );
    const createWorkspaceIndex = businessServiceSource.indexOf(
      "const business = await createFoundingBusiness({",
      creationPolicyIndex,
    );

    assert.equal(authServiceSource.includes('authProvider: AuthProvider'), true);
    assert.equal(
      authServiceSource.includes("readAuthProvider(response.app_metadata)"),
      true,
    );
    assert.equal(
      recoveryActionSource.includes(
        'allowWorkspaceCreation: user.authProvider === "email"',
      ),
      true,
    );
    assert.ok(existingRepairReturnIndex > -1);
    assert.ok(creationPolicyIndex > existingRepairReturnIndex);
    assert.ok(creationPolicyIndex > -1);
    assert.ok(createWorkspaceIndex > creationPolicyIndex);
    assert.equal(
      founderServiceSource.includes("allowWorkspaceCreation: true"),
      true,
    );
  });

  it("keeps callback completion copy provider-neutral and exact Admin redirects safe", () => {
    const callbackSource = readSource("app/auth/callback/route.ts");
    const routingSource = readSource("lib/auth/auth-callback-routing.ts");

    assert.equal(
      callbackSource.includes(
        'const AUTH_CALLBACK_NOTICE = "Sign-in complete. Continue to your workspace."',
      ),
      true,
    );
    assert.equal(callbackSource.includes("Email confirmed. Continue"), false);
    assert.equal(routingSource.includes('if (value === "/admin")'), true);
  });

  it("adds Google entry points without removing email/password auth", () => {
    const signInSource = readSource("app/auth/sign-in/page.tsx");
    const signUpSource = readSource("app/auth/sign-up/page.tsx");

    assert.equal(signInSource.includes("signInWithGoogleAction"), true);
    assert.equal(signInSource.includes("signInAction"), true);
    assert.equal(signInSource.includes('name="email"'), true);
    assert.equal(signInSource.includes('name="password"'), true);
    assert.equal(signUpSource.includes("signInWithGoogleAction"), true);
    assert.equal(signUpSource.includes("signUpAction"), true);
    assert.equal(signUpSource.includes("googleExistingWorkspaceOnly"), true);
    assert.equal(signUpSource.includes('"businessName"'), true);
  });

  it("keeps phone auth blocked in auth entry code", () => {
    const authSources = [
      readSource("server/services/auth.service.ts"),
      readSource("server/actions/auth.actions.ts"),
      readSource("app/auth/sign-in/page.tsx"),
      readSource("app/auth/sign-up/page.tsx"),
    ].join("\n");

    assert.equal(authSources.includes("signInWithOtp"), false);
    assert.equal(authSources.includes("verifyOtp"), false);
    assert.equal(authSources.includes('provider: "phone"'), false);
    assert.equal(authSources.includes('channel: "sms"'), false);
    assert.equal(authSources.toLowerCase().includes("whatsapp"), false);
  });
});
