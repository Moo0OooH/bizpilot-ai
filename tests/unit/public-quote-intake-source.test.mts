/**
 * ============================================================
 * File: tests/unit/public-quote-intake-source.test.mts
 * Project: BizPilot AI
 * Description: Source-level guardrails for the public quote intake flow.
 * Role: Verifies attribution, validation, abuse logging, privacy-mode storage,
 *       and manual-only success expectations without touching live data.
 * Related:
 * - app/(public)/quote/[slug]/page.tsx
 * - app/(public)/quote/[slug]/success/page.tsx
 * - components/public/quote-form-wizard.tsx
 * - server/actions/public-intake.actions.ts
 * - server/repositories/public-intake.repository.ts
 * - server/services/public-intake.service.ts
 * Author: MoOoH
 * Created: 2026-07-04
 * Last Updated: 2026-07-11
 * Change Log:
 * - 2026-07-11: Added guards for bilingual custom-field override resolution on public quote reads.
 * - 2026-07-04: Added active-language default field localization guards.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function source(path: string): string {
  return readFileSync(path, "utf8");
}

describe("public quote intake source contracts", () => {
  it("keeps quote pages noindex, inactive-safe, and attribution-aware", () => {
    const quotePage = source("app/(public)/quote/[slug]/page.tsx");
    const quoteSuccessPage = source("app/(public)/quote/[slug]/success/page.tsx");
    const quoteUnavailable = source("components/public/quote-unavailable.tsx");

    assert.equal(quotePage.includes("buildNoIndexMetadata"), true);
    assert.equal(quoteSuccessPage.includes("buildNoIndexMetadata"), true);
    assert.equal(
      quotePage.includes("buildQuoteAttributionFormQuery({ query, slug })"),
      true,
    );
    assert.equal(quotePage.includes("buildQuoteLanguageHref"), true);
    assert.equal(quotePage.includes("<QuoteUnavailable"), true);
    assert.equal(quoteUnavailable.includes("unavailableTitle"), true);
    assert.equal(quoteUnavailable.includes("supportedLanguages.map"), true);
    assert.equal(quoteUnavailable.includes("pathname"), true);
  });

  it("localizes default and saved custom quote fields from the active quote language", () => {
    const quotePage = source("app/(public)/quote/[slug]/page.tsx");
    const quoteSuccessPage = source("app/(public)/quote/[slug]/success/page.tsx");
    const service = source("server/services/public-intake.service.ts");
    const repository = source("server/repositories/public-intake.repository.ts");

    assert.equal(
      quotePage.indexOf("const activeLanguage = readQuoteLanguage(query);") <
        quotePage.indexOf("getPublicIntakePage({ language: activeLanguage, slug })"),
      true,
    );
    assert.equal(
      quoteSuccessPage.includes("getPublicIntakePage({ language, slug })"),
      true,
    );
    assert.equal(service.includes("language?: SupportedLanguage"), true);
    assert.equal(service.includes("language: input.language"), true);
    assert.equal(
      repository.includes("language: input.language ?? publicLink.preferred_language"),
      true,
    );
    assert.equal(
      repository.includes("resolveLocalizedTemplateFieldCopy"),
      true,
    );
    assert.equal(
      repository.includes("createSupabaseServiceRoleClient"),
      true,
    );
  });

  it("keeps hidden attribution fields and honeypot wiring on the quote form", () => {
    const quoteWizard = source("components/public/quote-form-wizard.tsx");
    const publicAction = source("server/actions/public-intake.actions.ts");

    for (const field of [
      'name="sourceChannel"',
      'name="referrer"',
      'name="sourceUrl"',
      'name="utmSource"',
      'name="utmMedium"',
      'name="utmCampaign"',
      'name="companyWebsite"',
      'name="fieldKeys"',
    ]) {
      assert.equal(quoteWizard.includes(field), true, `Missing hidden field ${field}`);
    }

    for (const actionField of [
      'readOptionalFormValue(formData, "referrer")',
      'readOptionalFormValue(formData, "sourceChannel")',
      'readOptionalFormValue(formData, "sourceUrl")',
      'readOptionalFormValue(formData, "utmCampaign")',
      'readOptionalFormValue(formData, "utmMedium")',
      'readOptionalFormValue(formData, "utmSource")',
      'readOptionalFormValue(formData, "companyWebsite")',
    ]) {
      assert.equal(
        publicAction.includes(actionField),
        true,
        `Public intake action should read ${actionField}.`,
      );
    }
  });

  it("keeps server validation for required, custom, date, number, and choice fields", () => {
    const service = source("server/services/public-intake.service.ts");

    for (const required of [
      "field.field_key",
      "field.is_required",
      "field.options",
      'input.fieldType === "number"',
      "Number.isFinite(numberValue)",
      "numberValue < 0",
      'input.fieldType === "date"',
      "isValidDateOnly(trimmed)",
      "trimmed < todayDateString()",
      'input.fieldType === "radio"',
      'input.fieldType === "select"',
      'input.fieldType === "time_window"',
      "!options.includes(trimmed)",
      "getSubmissionValues",
      "invalid_field",
    ]) {
      assert.equal(service.includes(required), true, `Missing validation guard ${required}`);
    }
  });

  it("keeps abuse, consent, stale-form, and privacy-mode gates in the submit path", () => {
    const service = source("server/services/public-intake.service.ts");
    const repository = source("server/repositories/public-intake.repository.ts");

    for (const required of [
      "enforceSubmissionRateLimit",
      "recordPublicSubmissionAttempt",
      'reason: "rate_limit_exceeded"',
      'reason: "honeypot_triggered"',
      "MINIMUM_PUBLIC_SUBMIT_AGE_MS",
      'reason: "submitted_too_fast"',
      'reason: "consent_missing"',
      'reason: "invalid_form"',
      'reason: "submission_completed"',
      "privacyMode: page.form.privacy_mode",
    ]) {
      assert.equal(service.includes(required), true, `Missing submit guard ${required}`);
    }

    assert.equal(repository.includes("privacy_mode: input.privacyMode"), true);
    assert.equal(repository.includes("lead_source_metadata"), true);
    assert.equal(repository.includes("source_url: cleanOptionalText"), true);
  });

  it("keeps customer-facing copy manual-only after successful submission", () => {
    const quoteSuccessPage = source("app/(public)/quote/[slug]/success/page.tsx");
    const copy = source("lib/i18n/bizpilot-copy.ts");

    assert.equal(quoteSuccessPage.includes("quoteSuccess.steps"), true);
    assert.equal(quoteSuccessPage.includes("No booking or price is implied"), true);
    assert.equal(copy.includes("Nothing is booked, no price is confirmed"), true);
    assert.equal(copy.includes("availability still needs business review"), true);
    assert.equal(copy.includes("no automatic messages"), true);
    assert.equal(
      copy.includes("No booking, price, or availability is confirmed by this page."),
      true,
    );
  });
});
