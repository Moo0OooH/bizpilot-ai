/**
 * ============================================================
 * File: tests/unit/dashboard-legacy-interface.test.mts
 * Project: BizPilot AI
 * Description: Regression coverage for legacy protected-dashboard UI locales.
 * Role: Keeps FA/AR/ES rendering separate from business/public/AI language
 *       while retaining Latin digit presentation in every interface locale.
 * Related:
 * - lib/i18n/dashboard-legacy-interface.ts
 * - lib/i18n/dashboard-legacy-fa.json
 * - lib/i18n/dashboard-legacy-ar.json
 * - lib/i18n/bizpilot-copy.ts
 * - app/(dashboard)/layout.tsx
 * Author: MoOoH
 * Created: 2026-07-21
 * Last Updated: 2026-07-22
 * Change Log:
 * - 2026-07-22: Added exhaustive Persian map, fallback-inventory, script, and Latin-number parity coverage.
 * - 2026-07-22: Added exhaustive Arabic map/fallback coverage and protected business-language fixture regressions.
 * - 2026-07-22: Added exact Spanish fallback inventory, dynamic-copy coverage, and structural-value isolation regressions.
 * - 2026-07-21: Added protected-dashboard locale isolation and Latin-digit coverage.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { getBizPilotCopy } from "../../lib/i18n/bizpilot-copy.ts";
import {
  getDashboardInterfaceFormattingLocale,
  getDashboardInterfaceLegacyCopy,
} from "../../lib/i18n/dashboard-legacy-interface.ts";

const nativeDigitPattern = /[\u0660-\u0669\u06f0-\u06f9]/u;

const ownerDashboardSections = [
  "actions",
  "errorBoundary",
  "routeMessages",
  "businessProfile",
  "configuration",
  "leadQueue",
  "leadDetail",
  "leadsPage",
  "guide",
  "reports",
  "overview",
  "routeGuide",
  "nav",
  "pages",
  "readinessTasks",
  "settings",
  "status",
  "theme",
  "workspaceAccess",
] as const;

type CopyRecord = Readonly<Record<string, unknown>>;
type StaticFallback = Readonly<{ path: string; value: string }>;

const arabicTranslationMap = JSON.parse(
  readFileSync("lib/i18n/dashboard-legacy-ar.json", "utf8"),
) as Readonly<Record<string, string>>;

const persianTranslationMap = JSON.parse(
  readFileSync("lib/i18n/dashboard-legacy-fa.json", "utf8"),
) as Readonly<Record<string, string>>;

function collectStaticFallbacks(
  source: unknown,
  localized: unknown,
  path: readonly string[],
  fallbacks: StaticFallback[],
): void {
  if (typeof source === "string") {
    if (source === localized) {
      fallbacks.push({ path: path.join("."), value: source });
    }
    return;
  }

  if (!source || typeof source !== "object") return;

  const localizedRecord =
    localized && typeof localized === "object"
      ? (localized as CopyRecord)
      : undefined;

  for (const [key, value] of Object.entries(source)) {
    collectStaticFallbacks(
      value,
      localizedRecord?.[key],
      [...path, key],
      fallbacks,
    );
  }
}

function ownerCopyRoots(language: "en" | "fa" | "ar" | "es") {
  const copy = getDashboardInterfaceLegacyCopy(language);

  return {
    dashboard: Object.fromEntries(
      ownerDashboardSections.map((section) => [
        section,
        copy.dashboard[section],
      ]),
    ),
    demo: copy.demo,
    missingInfoLabels: copy.missingInfoLabels,
  };
}

const intentionalSpanishStableValues = new Set([
  "",
  "-",
  "(555) 123-4567",
  "BizPilotOwner",
  "Control",
  "Core",
  "Custom",
  "Facebook",
  "Instagram",
  "LinkedIn",
  "No",
  "Plan",
  "Plus",
  "Premium",
  "SMS",
  "TikTok",
  "Visible",
  "WhatsApp",
  "YouTube",
]);

function isProtectedBusinessLanguagePath(path: string): boolean {
  return (
    path === "dashboard.businessProfile.serviceAreasPlaceholder" ||
    path === "dashboard.overview.featuredFallbackArea" ||
    path === "dashboard.overview.featuredFallbackCustomer" ||
    /^dashboard\.configuration\.fields\.placeholders\.[^.]+\.(?:fieldKey|helper|label|options|preview)$/u.test(
      path,
    ) ||
    /^dashboard\.configuration\.faq\.(?:examples\.\d+|placeholder)$/u.test(
      path,
    ) ||
    /^dashboard\.configuration\.sourceLinks\.(?:campaignPlaceholder|customPlaceholder)$/u.test(
      path,
    ) ||
    /^dashboard\.configuration\.sourceLinks\.presets\.\d+\.(?:key|medium)$/u.test(
      path,
    ) ||
    /^demo\.(?:aiSummary|detailFour|detailOne|detailThree|detailTwo|featuredLeadTitle|followUpDraft|missingInfo|replyDraft)$/u.test(
      path,
    ) ||
    /^demo\.sampleAreas\.\d+$/u.test(path) ||
    /^demo\.sampleLeads\.\d+\.(?:area|customer|detail|followUpDraft|replyDraft|tone)$/u.test(
      path,
    )
  );
}

function isIntentionalSpanishStableFallback({
  path,
  value,
}: StaticFallback): boolean {
  return (
    intentionalSpanishStableValues.has(value) ||
    /^[0-9]+$/u.test(value) ||
    value.startsWith("/") ||
    isProtectedBusinessLanguagePath(path)
  );
}

function isIntentionalArabicStableFallback({
  path,
  value,
}: StaticFallback): boolean {
  return (
    value === "" ||
    value === "-" ||
    value === "BizPilotOwner" ||
    /^[0-9]+$/u.test(value) ||
    value.startsWith("/") ||
    path === "missingInfoLabels.property_type" ||
    isProtectedBusinessLanguagePath(path)
  );
}

const isIntentionalPersianStableFallback =
  isIntentionalArabicStableFallback;

function collectStaticValues(value: unknown, values: Set<string>): void {
  if (typeof value === "string") {
    values.add(value);
    return;
  }

  if (!value || typeof value !== "object") return;
  for (const entry of Object.values(value)) {
    collectStaticValues(entry, values);
  }
}

function collectFunctionFallbacks(
  source: unknown,
  localized: unknown,
  path: readonly string[],
  fallbacks: string[],
): void {
  if (typeof source === "function") {
    assert.equal(
      typeof localized,
      "function",
      `${path.join(".")} must remain callable.`,
    );
    const argumentsForProbe = [2, 3, 4].slice(0, source.length);
    const sourceValue = source(...argumentsForProbe);
    const localizedValue = (localized as (...args: number[]) => unknown)(
      ...argumentsForProbe,
    );
    if (sourceValue === localizedValue) fallbacks.push(path.join("."));
    return;
  }

  if (!source || typeof source !== "object") return;
  const localizedRecord =
    localized && typeof localized === "object"
      ? (localized as CopyRecord)
      : undefined;

  for (const [key, value] of Object.entries(source)) {
    collectFunctionFallbacks(
      value,
      localizedRecord?.[key],
      [...path, key],
      fallbacks,
    );
  }
}

const legacyProtectedRoutes = [
  "app/(dashboard)/layout.tsx",
  "app/(dashboard)/dashboard/page.tsx",
  "app/(dashboard)/dashboard/leads/page.tsx",
  "app/(dashboard)/dashboard/leads/[leadId]/page.tsx",
  "app/(dashboard)/dashboard/configuration/page.tsx",
  "app/(dashboard)/dashboard/business-profile/page.tsx",
  "app/(dashboard)/dashboard/settings/page.tsx",
  "app/(dashboard)/dashboard/reports/page.tsx",
  "app/(dashboard)/dashboard/guide/page.tsx",
  "app/(dashboard)/dashboard/error.tsx",
] as const;

describe("legacy protected-dashboard interface locales", () => {
  it("uses the established English/French source and translated core route hierarchy", () => {
    const english = getDashboardInterfaceLegacyCopy("en");
    const french = getDashboardInterfaceLegacyCopy("fr-CA");
    const fa = getDashboardInterfaceLegacyCopy("fa");
    const ar = getDashboardInterfaceLegacyCopy("ar");
    const es = getDashboardInterfaceLegacyCopy("es");

    assert.equal(
      french.dashboard.pages.settings.title,
      getBizPilotCopy("fr-CA").dashboard.pages.settings.title,
    );
    assert.equal(english.dashboard.pages.leads.title, "Lead Recovery Queue");
    assert.equal(fa.dashboard.nav.leads, "درخواست‌ها");
    assert.equal(ar.dashboard.pages.settings.title, "الإعدادات");
    assert.equal(es.dashboard.pages.reports.title, "Informes");
    assert.equal(fa.dashboard.leadQueue.filters.needsReply, "نیازمند پاسخ");
    assert.equal(ar.dashboard.leadQueue.sorts.mostUrgent, "الأكثر إلحاحاً");
    assert.equal(es.dashboard.overview.readiness.ready, "Listo");
  });

  it("has no unexpected static English fallback in Spanish owner routes", () => {
    const fallbacks: StaticFallback[] = [];
    collectStaticFallbacks(
      ownerCopyRoots("en"),
      ownerCopyRoots("es"),
      [],
      fallbacks,
    );

    assert.deepEqual(
      fallbacks.filter((entry) => !isIntentionalSpanishStableFallback(entry)),
      [],
    "Spanish owner-route copy must translate every visible UI string except explicit product, platform, route, identifier, sample-data, and business-language content tokens.",
    );
  });

  it("has exactly the reviewed Arabic owner-route map and 119 intentional static fallbacks", () => {
    const english = ownerCopyRoots("en");
    const fallbacks: StaticFallback[] = [];
    collectStaticFallbacks(english, ownerCopyRoots("ar"), [], fallbacks);

    assert.deepEqual(
      fallbacks.filter(
        (entry) => !isIntentionalArabicStableFallback(entry),
      ),
      [],
      "Arabic owner-route copy may leave unchanged only protected structural, customer/business-language, sample-identity, route, and numeric values.",
    );
    assert.equal(fallbacks.length, 162);
    assert.equal(new Set(fallbacks.map(({ value }) => value)).size, 119);

    const englishValues = new Set<string>();
    collectStaticValues(english, englishValues);
    assert.equal(englishValues.size, 1126);
    assert.equal(Object.keys(arabicTranslationMap).length, 1007);
    assert.equal(
      [...englishValues].filter(
        (value) => !Object.hasOwn(arabicTranslationMap, value),
      ).length,
      119,
    );

    for (const [source, localized] of Object.entries(arabicTranslationMap)) {
      assert.ok(englishValues.has(source), `Unknown Arabic source: ${source}`);
      assert.match(
        localized,
        /[\u0600-\u06ff]/u,
        `Arabic translation must contain Arabic script: ${source}`,
      );
      assert.doesNotMatch(localized, nativeDigitPattern);
      assert.deepEqual(
        localized.match(/[0-9]+/gu) ?? [],
        source.match(/[0-9]+/gu) ?? [],
        `Arabic translation must preserve Latin numeric semantics: ${source}`,
      );
    }
  });

  it("has exactly the reviewed Persian owner-route map and 119 intentional static fallbacks", () => {
    const english = ownerCopyRoots("en");
    const fallbacks: StaticFallback[] = [];
    collectStaticFallbacks(english, ownerCopyRoots("fa"), [], fallbacks);

    assert.deepEqual(
      fallbacks.filter(
        (entry) => !isIntentionalPersianStableFallback(entry),
      ),
      [],
      "Persian owner-route copy may leave unchanged only protected structural, customer/business-language, sample-identity, route, and numeric values.",
    );
    assert.equal(fallbacks.length, 162);
    assert.equal(new Set(fallbacks.map(({ value }) => value)).size, 119);

    const englishValues = new Set<string>();
    collectStaticValues(english, englishValues);
    assert.equal(englishValues.size, 1126);
    assert.equal(Object.keys(persianTranslationMap).length, 1007);
    assert.equal(
      [...englishValues].filter(
        (value) => !Object.hasOwn(persianTranslationMap, value),
      ).length,
      119,
    );

    for (const [source, localized] of Object.entries(persianTranslationMap)) {
      assert.ok(englishValues.has(source), `Unknown Persian source: ${source}`);
      assert.match(
        localized,
        /[\u0600-\u06ff]/u,
        `Persian translation must contain Persian script: ${source}`,
      );
      assert.doesNotMatch(localized, nativeDigitPattern);
      assert.deepEqual(
        localized.match(/[0-9]+/gu) ?? [],
        source.match(/[0-9]+/gu) ?? [],
        `Persian translation must preserve Latin numeric semantics: ${source}`,
      );
    }
  });

  it("keeps critical Persian owner copy translated across every main route", () => {
    const english = getDashboardInterfaceLegacyCopy("en").dashboard;
    const persian = getDashboardInterfaceLegacyCopy("fa").dashboard;
    const routePairs = [
      [english.businessProfile.description, persian.businessProfile.description],
      [english.configuration.basics.title, persian.configuration.basics.title],
      [english.leadDetail.ai.title, persian.leadDetail.ai.title],
      [english.leadsPage.statusRulesTitle, persian.leadsPage.statusRulesTitle],
      [english.guide.header.description, persian.guide.header.description],
      [english.reports.header.description, persian.reports.header.description],
      [english.overview.heroDescription, persian.overview.heroDescription],
      [
        english.settings.displayPreferences.title,
        persian.settings.displayPreferences.title,
      ],
      [english.workspaceAccess.pausedTitle, persian.workspaceAccess.pausedTitle],
    ] as const;

    for (const [source, localized] of routePairs) {
      assert.notEqual(localized, source);
      assert.match(localized, /[\u0600-\u06ff]/u);
    }
  });

  it("localizes every dynamic owner-route sentence in FA, AR, and ES", () => {
    const english = ownerCopyRoots("en");

    for (const language of ["fa", "ar", "es"] as const) {
      const fallbacks: string[] = [];
      collectFunctionFallbacks(
        english,
        ownerCopyRoots(language),
        [],
        fallbacks,
      );

      assert.deepEqual(
        fallbacks,
        ["dashboard.overview.recoveryFocus.itemCount"],
        `${language} may keep only the deliberately numeric dynamic item count unchanged.`,
      );
    }
  });

  it("never translates route targets, persisted field keys, tracking codes, or sample identities", () => {
    const english = getDashboardInterfaceLegacyCopy("en");

    for (const language of ["fa", "ar", "es"] as const) {
      const localized = getDashboardInterfaceLegacyCopy(language);

      assert.equal(
        localized.dashboard.routeGuide.routes.leads.primaryHref,
        english.dashboard.routeGuide.routes.leads.primaryHref,
      );
      const localizedPlaceholders =
        localized.dashboard.configuration.fields.placeholders;
      const englishPlaceholders =
        english.dashboard.configuration.fields.placeholders;
      assert.ok(localizedPlaceholders);
      assert.ok(englishPlaceholders);
      assert.equal(
        localizedPlaceholders.date.fieldKey,
        englishPlaceholders.date.fieldKey,
      );
      assert.deepEqual(
        localizedPlaceholders,
        englishPlaceholders,
        "Dashboard locale must not rewrite customer-facing starter content; the business language owns these values.",
      );
      assert.deepEqual(
        localized.dashboard.configuration.sourceLinks.presets.map(
          ({ key, medium }) => ({ key, medium }),
        ),
        english.dashboard.configuration.sourceLinks.presets.map(
          ({ key, medium }) => ({ key, medium }),
        ),
      );
      assert.equal(
        localized.dashboard.configuration.sourceLinks.campaignPlaceholder,
        english.dashboard.configuration.sourceLinks.campaignPlaceholder,
      );
      assert.equal(
        localized.dashboard.configuration.sourceLinks.customPlaceholder,
        english.dashboard.configuration.sourceLinks.customPlaceholder,
      );
      assert.deepEqual(
        localized.dashboard.configuration.faq.examples,
        english.dashboard.configuration.faq.examples,
        "Dashboard locale must not rewrite customer-facing FAQ examples.",
      );
      assert.equal(
        localized.dashboard.configuration.faq.placeholder,
        english.dashboard.configuration.faq.placeholder,
      );
      assert.deepEqual(
        localized.demo.sampleLeads.map(
          ({ area, customer, detail, followUpDraft, replyDraft, tone }) => ({
          area,
          customer,
          detail,
          followUpDraft,
          replyDraft,
          tone,
          }),
        ),
        english.demo.sampleLeads.map(
          ({ area, customer, detail, followUpDraft, replyDraft, tone }) => ({
          area,
          customer,
          detail,
          followUpDraft,
          replyDraft,
          tone,
          }),
        ),
      );
      for (const key of [
        "aiSummary",
        "detailFour",
        "detailOne",
        "detailThree",
        "detailTwo",
        "featuredLeadTitle",
        "followUpDraft",
        "missingInfo",
        "replyDraft",
      ] as const) {
        assert.equal(localized.demo[key], english.demo[key]);
      }
    }
  });

  it("keeps locale presentation numbers in Latin digits", () => {
    const adapterSource = readFileSync(
      "lib/i18n/dashboard-legacy-interface.ts",
      "utf8",
    );
    const arabicMapSource = readFileSync(
      "lib/i18n/dashboard-legacy-ar.json",
      "utf8",
    );
    const persianMapSource = readFileSync(
      "lib/i18n/dashboard-legacy-fa.json",
      "utf8",
    );

    assert.doesNotMatch(adapterSource, nativeDigitPattern);
    assert.doesNotMatch(arabicMapSource, nativeDigitPattern);
    assert.doesNotMatch(persianMapSource, nativeDigitPattern);

    for (const language of ["en", "fr-CA", "fa", "ar", "es"] as const) {
      const formatted = new Intl.NumberFormat(
        getDashboardInterfaceFormattingLocale(language),
      ).format(1234567);

      assert.match(formatted, /[0-9]/u, `${language} must use Latin digits.`);
      assert.doesNotMatch(
        formatted,
        nativeDigitPattern,
        `${language} must not use Arabic or Persian digit glyphs.`,
      );
    }
  });

  it("routes all legacy dashboard bodies through the isolated interface adapter", () => {
    for (const file of legacyProtectedRoutes) {
      const source = readFileSync(file, "utf8");

      assert.match(
        source,
        /getDashboardInterfaceLegacyCopy|DashboardInterfaceLegacyCopy/u,
        `${file} must use the dashboard-only legacy copy adapter.`,
      );
      assert.doesNotMatch(
        source,
        /preferred_language:\s*(?:interfaceLanguage|activeLanguage)/u,
        `${file} must never inject the dashboard interface locale into a business.`,
      );
    }

    const queue = readFileSync(
      "components/dashboard/lead-workspace-queue.tsx",
      "utf8",
    );
    assert.match(queue, /getDashboardInterfaceLegacyCopy\(language\)/u);
    assert.doesNotMatch(queue, /getBizPilotCopy/u);
  });

  it("retains the business language only where public quote defaults are needed", () => {
    for (const file of [
      "app/(dashboard)/dashboard/configuration/page.tsx",
      "app/(dashboard)/dashboard/business-profile/page.tsx",
    ]) {
      const source = readFileSync(file, "utf8");
      assert.match(
        source,
        /getBizPilotCopy\(activeBusiness\.preferred_language\)/u,
      );
      assert.match(source, /business:\s*activeBusiness/u);
    }
  });
});
