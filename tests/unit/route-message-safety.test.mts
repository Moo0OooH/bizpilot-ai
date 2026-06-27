/**
 * File: tests/unit/route-message-safety.test.mts
 * Project: BizPilot AI
 * Description: Guards user-facing route flash messages from raw query-string copy.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { getBizPilotCopy } from "../../lib/i18n/bizpilot-copy.ts";
import {
  readSafeAuthRouteError,
  readSafeAuthRouteNotice,
  readSafeRouteFlashMessage,
} from "../../lib/i18n/route-messages.ts";

describe("Route message safety", () => {
  it("maps known auth route messages and hides injected auth copy", () => {
    const messages = getBizPilotCopy("en").auth.routeMessages;

    assert.equal(
      readSafeAuthRouteError("Enter your email address.", messages),
      messages.emailRequired,
    );
    assert.equal(
      readSafeAuthRouteError("<script>alert(1)</script>", messages),
      messages.genericError,
    );
    assert.equal(
      readSafeAuthRouteNotice(
        "Password updated. Sign in with your new password.",
        messages,
      ),
      messages.passwordUpdated,
    );
  });

  it("keeps dashboard route flashes short and non-technical", () => {
    assert.equal(
      readSafeRouteFlashMessage("Plan updated.", "fallback"),
      "Plan updated.",
    );
    assert.equal(
      readSafeRouteFlashMessage("Raw database or provider error", "fallback"),
      "fallback",
    );
    assert.equal(
      readSafeRouteFlashMessage("x".repeat(181), "fallback"),
      "fallback",
    );
  });

  it("keeps auth and quote routes off raw query rendering", () => {
    const guardedSources = [
      "app/auth/sign-in/page.tsx",
      "app/auth/sign-up/page.tsx",
      "app/auth/forgot-password/page.tsx",
      "app/(public)/quote/[slug]/page.tsx",
      "app/(dashboard)/dashboard/configuration/page.tsx",
      "app/(dashboard)/dashboard/settings/page.tsx",
      "app/(dashboard)/dashboard/business-profile/page.tsx",
      "app/(dashboard)/dashboard/leads/[leadId]/page.tsx",
      "app/admin/page.tsx",
    ];

    for (const path of guardedSources) {
      const source = readFileSync(path, "utf8");

      assert.equal(source.includes("{params.error}"), false, path);
      assert.equal(source.includes("{params.notice}"), false, path);
      assert.equal(source.includes("{query.error}"), false, path);
      assert.equal(source.includes("{query.notice}"), false, path);
    }
  });

  it("keeps public quote errors constrained to safe intake copy", () => {
    const source = readFileSync("app/(public)/quote/[slug]/page.tsx", "utf8");

    assert.equal(source.includes("isSafePublicIntakeMessage"), true);
    assert.equal(source.includes("intakeErrors.fallbackSubmit"), true);
  });
});
