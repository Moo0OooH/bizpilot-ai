/**
 * ============================================================
 * File: tests/unit/shell-polish-source.test.mts
 * Project: BizPilot AI
 * Description: Source-level guardrails for final auth, quote, and report shell polish.
 * Role: Verifies Phase 07 shell presentation without exercising auth/data flows.
 * Related:
 * - components/auth/auth-ui.tsx
 * - components/auth/auth-password-field.tsx
 * - app/(public)/quote/[slug]/page.tsx
 * Author: MoOoH
 * Created: 2026-06-19
 * Last Updated: 2026-06-20
 * Change Log:
 * - 2026-06-20: Added 11D shell alignment contracts for auth, quote, and dashboard setup shells.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { getBizPilotCopy } from "../../lib/i18n/bizpilot-copy.ts";
import { getPublicSiteCopy } from "../../lib/i18n/public-site-copy.ts";

function source(path: string): string {
  return readFileSync(path, "utf8");
}

describe("final shell polish source contracts", () => {
  it("keeps auth chrome simple and primary actions blue", () => {
    const authUi = source("components/auth/auth-ui.tsx");
    const submitButton = source("components/auth/auth-submit-button.tsx");
    const checkEmailPage = source("app/auth/check-email/page.tsx");

    for (const forbidden of [
      "ThemePreferenceControl",
      "setInterfaceLanguageAction",
      "supportedLanguages",
      "languageNativeLabels",
    ]) {
      assert.equal(
        authUi.includes(forbidden),
        false,
        `Auth shell should not render auth utility control source: ${forbidden}`,
      );
    }

    assert.equal(authUi.includes("max-w-[520px]"), true);
    assert.equal(authUi.includes("max-w-[650px]"), false);
    assert.equal(authUi.includes("copy.backHome"), true);
    assert.equal(submitButton.includes("var(--primary)"), true);
    assert.equal(submitButton.includes("bizTheme"), false);
    assert.equal(checkEmailPage.includes("var(--primary)"), true);
    assert.equal(checkEmailPage.includes("focus-visible:ring-4"), true);
    assert.equal(checkEmailPage.includes("ThemePreferenceControl"), false);
  });

  it("uses password visibility controls without password field icons", () => {
    const passwordField = source("components/auth/auth-password-field.tsx");

    assert.equal(passwordField.includes("copy.showPassword"), true);
    assert.equal(passwordField.includes("copy.hidePassword"), true);
    assert.equal(passwordField.includes("autoComplete"), true);
    assert.equal(passwordField.includes('type={visible ? "text" : "password"}'), true);

    for (const route of [
      "app/auth/sign-in/page.tsx",
      "app/auth/sign-up/page.tsx",
      "app/auth/reset-password/reset-password-form.tsx",
    ]) {
      const routeSource = source(route);
      assert.equal(routeSource.includes("AuthPasswordField"), true);
      assert.equal(routeSource.includes('AuthFieldIcon type="password"'), false);
    }
  });

  it("keeps requested auth copy and metadata exact", () => {
    const authCopy = getBizPilotCopy("en").auth;
    const authMeta = getPublicSiteCopy("en").authMeta;

    assert.equal(
      authCopy.signInSubtitle,
      "Manage quote requests, owner-reviewed AI drafts, and manual follow-up from your BizPilot workspace.",
    );
    assert.equal(
      authCopy.needAccount,
      "Approved for pilot access but haven't created your login?",
    );
    assert.equal(authMeta.signIn.title, "Sign in | BizPilot AI");
    assert.equal(authMeta.signUp.title, "Create Owner Access | BizPilot AI");
    assert.equal(authMeta.resetPassword.title, "Reset Password | BizPilot AI");
  });

  it("keeps quote shell mobile-first with locale switching and no theme control", () => {
    const quotePage = source("app/(public)/quote/[slug]/page.tsx");
    const quoteWizard = source("components/public/quote-form-wizard.tsx");
    const quoteUnavailable = source("components/public/quote-unavailable.tsx");

    assert.equal(quotePage.includes("quoteLanguageHref"), true);
    assert.equal(quotePage.includes("languageShortLabels"), true);
    assert.equal(quotePage.includes("ThemePreferenceControl"), false);
    assert.equal(quoteWizard.includes("max-w-[780px]"), true);
    assert.equal(quoteWizard.includes("overflow-y-auto"), false);
    assert.equal(quoteUnavailable.includes("<main"), false);
    assert.equal(quoteUnavailable.includes("var(--biz-primary)"), false);
    assert.equal(quoteUnavailable.includes("var(--primary)"), true);
    assert.equal(quoteUnavailable.includes("focus-visible:ring-4"), true);
  });

  it("keeps quote consent single and honeypot hidden from normal flow", () => {
    const quoteWizard = source("components/public/quote-form-wizard.tsx");

    assert.equal(
      quoteWizard.match(/<ConsentBlock/g)?.length,
      1,
      "Quote form should render one visible consent block.",
    );
    assert.equal(
      quoteWizard.match(/copy\.quoteForm\.aiDisclosure/g)?.length,
      1,
      "AI disclosure should appear only inside the consent block.",
    );
    assert.equal(
      /<label className="hidden">\s*Company website\s*<input autoComplete="off" name="companyWebsite" tabIndex=\{-1\} \/>/s.test(
        quoteWizard,
      ),
      true,
      "Company website honeypot must stay display-hidden and out of tab order.",
    );
    assert.equal(
      quoteWizard.includes("consentNotice={page.consentVersion.consent_notice}"),
      true,
      "Visible consent copy should come from the active consent version.",
    );
  });

  it("keeps quote success actions aligned to shared shell tokens", () => {
    const quoteSuccess = source("app/(public)/quote/[slug]/success/page.tsx");

    assert.equal(quoteSuccess.includes("min-h-svh"), true);
    assert.equal(quoteSuccess.includes("items-start"), true);
    assert.equal(quoteSuccess.includes("var(--primary)"), true);
    assert.equal(quoteSuccess.includes("focus-visible:ring-4"), true);
  });

  it("keeps the setup report shell tokenized and not color-only", () => {
    const configurationPage = source(
      "app/(dashboard)/dashboard/configuration/page.tsx",
    );
    const dashboardLayout = source("app/(dashboard)/layout.tsx");
    const dashboardShell = source("components/dashboard/dashboard-shell.tsx");

    assert.equal(configurationPage.includes("configCopy.overview.setupReport"), true);
    assert.equal(configurationPage.includes("var(--dash-surface-muted)"), true);
    assert.equal(configurationPage.includes("configCopy.overview.done"), true);
    assert.equal(configurationPage.includes("configCopy.overview.open"), true);
    assert.equal(configurationPage.includes("overflow-y-auto"), false);
    assert.equal(configurationPage.includes("min-h-screen"), false);
    assert.equal(dashboardLayout.includes("min-h-screen"), false);
    assert.equal(dashboardLayout.includes("min-h-svh"), true);
    assert.equal(dashboardShell.includes('initialTheme = "light"'), true);
  });
});
