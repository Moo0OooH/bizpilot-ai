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
 * Last Updated: 2026-06-25
 * Change Log:
 * - 2026-06-20: Added 11D shell alignment contracts for auth, quote, and dashboard setup shells.
 * - 2026-06-21: Locked quote honeypot hiding and single consent review notice rendering.
 * - 2026-06-25: Locked final auth and quote spacing polish markers.
 * - 2026-06-25: Updated quote form rhythm markers for final field/helper spacing.
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
    assert.equal(authUi.includes("px-4 py-5 sm:px-6 sm:py-6"), true);
    assert.equal(authUi.includes("rounded-[20px] border p-5 sm:p-6"), true);
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
      "Manage quote requests, AI reply drafts you approve, and manual follow-up from your BizPilot workspace.",
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
    for (const required of [
      "quote-form-shell",
      "quote-step-card",
      "quote-field-row",
      "quote-field-control h-12",
      "quote-field-helper",
      "quote-consent-block",
      "quote-submit-guardrail",
      "quote-submit-button",
      "px-4 py-6 pb-10",
      "space-y-5 px-4 py-6 pb-10",
      "gap-4 md:grid-cols-2",
      "space-y-2",
      "sm:space-y-6",
    ]) {
      assert.equal(
        quoteWizard.includes(required),
        true,
        `Quote form mobile polish missing ${required}.`,
      );
    }
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
      undefined,
      "AI disclosure should not render as a separate duplicate notice.",
    );
    assert.equal(
      quoteWizard.includes("Company website"),
      false,
      "Company website honeypot text should not be exposed in rendered markup.",
    );
    assert.equal(
      /<input\s+aria-hidden="true"\s+autoComplete="off"\s+className="hidden"\s+name="companyWebsite"\s+tabIndex=\{-1\}\s+type="text"\s+\/>/s.test(
        quoteWizard,
      ),
      true,
      "Company website honeypot must stay display-hidden, assistive-tech hidden, and out of tab order.",
    );
    assert.equal(
      quoteWizard.includes("consentNotice={copy.quoteForm.consentNoticeDefault}"),
      true,
      "Visible quote consent copy should use the final localized notice.",
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
