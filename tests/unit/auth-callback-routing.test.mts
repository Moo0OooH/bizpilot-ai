/**
 * ============================================================
 * File: tests/unit/auth-callback-routing.test.mts
 * Project: BizPilot AI
 * Description: Tests Supabase Auth callback routing decisions.
 * Role: Prevents signup confirmation callbacks from being treated as password
 * recovery callbacks.
 * Related:
 * - lib/auth/auth-callback-routing.ts
 * - proxy.ts
 * - app/auth/callback/route.ts
 * Author: MoOoH
 * Created: 2026-05-23
 * ============================================================
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  AUTH_CALLBACK_EXCHANGE_NOTICE,
  AUTH_CALLBACK_INVALID_ERROR,
  copyAuthCallbackParams,
  getAuthCallbackFailureRedirect,
  getAuthCallbackKind,
  getRootAuthCallbackTargetPath,
  getSafeAuthCallbackNextPath,
  hasRootAuthCallbackParams,
  isRecoveryAuthCallback,
} from "../../lib/auth/auth-callback-routing.ts";

describe("Auth callback routing", () => {
  it("routes untyped root auth codes to the signup/email callback", () => {
    const url = new URL("https://bizpilo.com/?code=confirmation-code");

    assert.equal(hasRootAuthCallbackParams(url), true);
    assert.equal(isRecoveryAuthCallback(url), false);
    assert.equal(getAuthCallbackKind(url), "email_confirmation");
    assert.equal(getRootAuthCallbackTargetPath(url), "/auth/callback");
  });

  it("classifies explicit signup callbacks without treating them as recovery", () => {
    const url = new URL("https://bizpilo.com/?code=signup-code&type=signup");

    assert.equal(hasRootAuthCallbackParams(url), true);
    assert.equal(isRecoveryAuthCallback(url), false);
    assert.equal(getAuthCallbackKind(url), "signup");
    assert.equal(getRootAuthCallbackTargetPath(url), "/auth/callback");
  });

  it("routes explicit recovery callbacks to the reset password page", () => {
    const url = new URL(
      "https://bizpilo.com/?code=recovery-code&type=recovery",
    );

    assert.equal(hasRootAuthCallbackParams(url), true);
    assert.equal(isRecoveryAuthCallback(url), true);
    assert.equal(getAuthCallbackKind(url), "recovery");
    assert.equal(getRootAuthCallbackTargetPath(url), "/auth/reset-password");
  });

  it("copies only expected Supabase callback query params", () => {
    const source = new URL(
      "https://bizpilo.com/?code=abc&type=recovery&access_token=secret",
    );
    const target = new URL("https://bizpilo.com/auth/reset-password");

    copyAuthCallbackParams(source, target);

    assert.equal(target.searchParams.get("code"), "abc");
    assert.equal(target.searchParams.get("type"), "recovery");
    assert.equal(target.searchParams.has("access_token"), false);
  });

  it("keeps post-confirm redirects constrained to dashboard paths", () => {
    assert.equal(getSafeAuthCallbackNextPath(null), "/dashboard");
    assert.equal(getSafeAuthCallbackNextPath("/dashboard"), "/dashboard");
    assert.equal(
      getSafeAuthCallbackNextPath("/dashboard/leads"),
      "/dashboard/leads",
    );
    assert.equal(getSafeAuthCallbackNextPath("/admin"), "/dashboard");
    assert.equal(getSafeAuthCallbackNextPath("//evil.example"), "/dashboard");
  });

  it("uses a neutral sign-in notice when signup confirmation exchange fails", () => {
    assert.deepEqual(
      getAuthCallbackFailureRedirect({
        callbackKind: "email_confirmation",
        failureStage: "exchange_failed",
      }),
      {
        key: "notice",
        message: AUTH_CALLBACK_EXCHANGE_NOTICE,
      },
    );

    assert.deepEqual(
      getAuthCallbackFailureRedirect({
        callbackKind: "signup",
        failureStage: "provider_error",
      }),
      {
        key: "notice",
        message: AUTH_CALLBACK_EXCHANGE_NOTICE,
      },
    );
  });

  it("keeps missing confirmation codes and recovery failures invalid", () => {
    assert.deepEqual(
      getAuthCallbackFailureRedirect({
        callbackKind: "email_confirmation",
        failureStage: "missing_code",
      }),
      {
        key: "error",
        message: AUTH_CALLBACK_INVALID_ERROR,
      },
    );

    assert.deepEqual(
      getAuthCallbackFailureRedirect({
        callbackKind: "recovery",
        failureStage: "exchange_failed",
      }),
      {
        key: "error",
        message: AUTH_CALLBACK_INVALID_ERROR,
      },
    );
  });
});
