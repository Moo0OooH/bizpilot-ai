/**
 * ============================================================
 * File: tests/unit/dashboard-bilingual-copy-source.test.mts
 * Project: BizPilot AI
 * Description: Source guards for bilingual/public-owner copy cleanup in Quote Setup and quote shells.
 * Role: Prevents regressions where hardcoded labels, fake fallback values, or untranslated aria labels leak into owner/public surfaces.
 * Related:
 * - app/(public)/quote/[slug]/page.tsx
 * - components/public/quote-unavailable.tsx
 * - app/(dashboard)/dashboard/configuration/page.tsx
 * - components/dashboard/configuration-tabs.tsx
 * - lib/i18n/bizpilot-copy.ts
 * - lib/i18n/public-site-copy.ts
 * Author: MoOoH
 * Created: 2026-07-11
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Updated Quote Setup guards for the explicit public-link task and five-example FAQ summary fallback.
 * - 2026-07-14: Updated Quote Setup guards for the six-section V4 setup flow and hidden identity preservation.
 * - 2026-07-11: Added source guards for localized quote language controls and remaining Quote Setup hardcoded labels.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("Dashboard bilingual copy source guards", () => {
  it("keeps public quote language controls localized through copy dictionaries", () => {
    const quotePageSource = readFileSync(
      "app/(public)/quote/[slug]/page.tsx",
      "utf8",
    );
    const unavailableSource = readFileSync(
      "components/public/quote-unavailable.tsx",
      "utf8",
    );
    const publicCopySource = readFileSync(
      "lib/i18n/public-site-copy.ts",
      "utf8",
    );
    const bizPilotCopySource = readFileSync(
      "lib/i18n/bizpilot-copy.ts",
      "utf8",
    );

    assert.equal(quotePageSource.includes('aria-label="Quote language"'), false);
    assert.equal(quotePageSource.includes("copy.languageMenuLabel"), true);
    assert.equal(unavailableSource.includes("copy.languageMenuLabel"), true);
    assert.equal(publicCopySource.includes("languageMenuLabel"), true);
    assert.equal(
      bizPilotCopySource.includes('languageMenuLabel: "Quote language"'),
      true,
    );
    assert.equal(
      bizPilotCopySource.includes('languageMenuLabel: "Langue de la soumission"'),
      true,
    );
  });

  it("keeps Quote Setup labels, summaries, and nav aria copy localized", () => {
    const configurationSource = readFileSync(
      "app/(dashboard)/dashboard/configuration/page.tsx",
      "utf8",
    );
    const tabsSource = readFileSync(
      "components/dashboard/configuration-tabs.tsx",
      "utf8",
    );
    const bizPilotCopySource = readFileSync(
      "lib/i18n/bizpilot-copy.ts",
      "utf8",
    );

    assert.equal(configurationSource.includes("owner@example.com"), false);
    for (const tabId of [
      "configuration-overview",
      "public-link",
      "services-areas",
      "cleaning-template-fields",
      "branding",
      "faq",
      "privacy-consent",
    ]) {
      assert.equal(configurationSource.includes(`id: "${tabId}"`), true);
    }
    assert.equal(configurationSource.includes('id: "business"'), false);
    assert.equal(configurationSource.includes('id: "notifications"'), false);
    assert.equal(configurationSource.includes('name="businessName"'), true);
    assert.equal(configurationSource.includes('name="preferredLanguage"'), true);
    assert.equal(
      configurationSource.includes(
        "configuration.faqs.length || configCopy.faq.examples.length",
      ),
      true,
    );
    assert.equal(
      configurationSource.includes("configCopy.branding.logoPreviewAlt"),
      true,
    );
    assert.equal(
      configurationSource.includes("ariaLabel={configurationTabs.ariaLabel}"),
      true,
    );
    assert.equal(tabsSource.includes("ariaLabel: string"), true);
    assert.equal(tabsSource.includes("aria-label={ariaLabel}"), true);
    assert.equal(bizPilotCopySource.includes("summary: (count) => `${count} FAQs`"), true);
    assert.equal(bizPilotCopySource.includes("summary: (count) => `${count} FAQ`"), true);
    assert.equal(
      bizPilotCopySource.includes('ariaLabel: "Quote setup sections"'),
      true,
    );
    assert.equal(
      bizPilotCopySource.includes('ariaLabel: "Sections de configuration"'),
      true,
    );
  });
});
