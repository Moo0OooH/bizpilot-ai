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
 * Last Updated: 2026-07-05
 * Change Log:
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
