/**
 * ============================================================
 * File: tests/unit/dashboard-interface.test.mts
 * Project: BizPilot AI
 * Description: Tests the protected-dashboard language and RTL interface contract.
 * Role: Keeps dashboard-only locales separate from public/business language selection and verifies safe locale resolution.
 * Related:
 * - lib/i18n/dashboard-interface.ts
 * - lib/i18n/language.ts
 * - components/dashboard/dashboard-theme.tsx
 * Author: MoOoH
 * Created: 2026-07-21
 * Last Updated: 2026-07-22
 * Change Log:
 * - 2026-07-21: Added five-language dictionary, cookie-resolution, RTL, and public-language-isolation coverage.
 * - 2026-07-21: Added Premium Operations route-feedback localization and compact language-picker coverage.
 * - 2026-07-22: Guarded honest disclosure of the bounded 250-request Operations view.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import {
  DASHBOARD_INTERFACE_LANGUAGE_COOKIE,
  dashboardInterfaceCopy,
  dashboardInterfaceLanguageDefinitions,
  dashboardInterfaceLanguages,
  getDashboardInterfaceCopy,
  getDashboardInterfaceTextDirection,
  parseDashboardInterfaceLanguageCookie,
  premiumOperationsRouteErrorCodes,
  premiumOperationsRouteNoticeCodes,
  readPremiumOperationsRouteFlashMessage,
  readDashboardInterfaceLanguage,
  resolveDashboardInterfaceLanguage,
} from "../../lib/i18n/dashboard-interface.ts";
import { supportedLanguages } from "../../lib/i18n/language.ts";

type CopyShape =
  | string
  | CopyShape[]
  | {
      [key: string]: CopyShape;
    };

function copyShape(value: unknown): CopyShape {
  if (Array.isArray(value)) {
    return value.map(copyShape);
  }

  if (typeof value === "function") {
    return `function:${value.length}`;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => [key, copyShape(item)]),
    );
  }

  return value === null ? "null" : typeof value;
}

describe("dashboard interface language", () => {
  it("offers the five protected-interface languages with correct text direction", () => {
    assert.deepEqual(dashboardInterfaceLanguages, ["en", "fr-CA", "fa", "ar", "es"]);
    assert.equal(dashboardInterfaceLanguageDefinitions.fa.nativeLabel, "فارسی");
    assert.equal(dashboardInterfaceLanguageDefinitions.ar.nativeLabel, "العربية");
    assert.equal(getDashboardInterfaceTextDirection("fa"), "rtl");
    assert.equal(getDashboardInterfaceTextDirection("ar"), "rtl");
    assert.equal(getDashboardInterfaceTextDirection("es"), "ltr");
  });

  it("keeps dashboard-only locales out of public and business language support", () => {
    assert.deepEqual(supportedLanguages, ["en", "fr-CA"]);
    assert.equal(supportedLanguages.includes("fa" as never), false);
    assert.equal(supportedLanguages.includes("ar" as never), false);
    assert.equal(supportedLanguages.includes("es" as never), false);
  });

  it("accepts only the dedicated dashboard cookie and safely falls back", () => {
    const cookieHeader = [
      "unrelated=fa",
      `${DASHBOARD_INTERFACE_LANGUAGE_COOKIE}=ar`,
      "business-language=fr-CA",
    ].join("; ");

    assert.equal(parseDashboardInterfaceLanguageCookie(cookieHeader), "ar");
    assert.equal(
      parseDashboardInterfaceLanguageCookie(
        `${DASHBOARD_INTERFACE_LANGUAGE_COOKIE}=%E0%A4%A`,
      ),
      null,
    );
    assert.equal(
      resolveDashboardInterfaceLanguage({
        cookieHeader,
        cookieValue: "es",
      }),
      "es",
    );
    assert.equal(readDashboardInterfaceLanguage("unsupported"), "en");
  });

  it("keeps every protected-interface dictionary at the English source shape", () => {
    const englishShape = copyShape(dashboardInterfaceCopy.en);

    for (const language of dashboardInterfaceLanguages) {
      assert.deepEqual(
        copyShape(getDashboardInterfaceCopy(language)),
        englishShape,
        `${language} dashboard interface copy differs from English shape.`,
      );
    }
  });

  it("retains explicit manual-review copy in Premium Operations", () => {
    const english = getDashboardInterfaceCopy("en").premiumOperations;

    assert.match(english.description, /manager approves (a )?manual copy/i);
    assert.match(english.bulkReply.description, /never .* automatically/i);
    assert.match(english.conflict.approvalNote, /does not .* automatically/i);
  });

  it("discloses the bounded 250-request Operations view in every language", () => {
    for (const language of dashboardInterfaceLanguages) {
      assert.match(
        getDashboardInterfaceCopy(language).premiumOperations.prioritySearch
          .availabilityCheckLimit,
        /250/,
        `${language} does not disclose the active-request result cap.`,
      );
    }
    assert.match(
      getDashboardInterfaceCopy("en").premiumOperations.prioritySearch
        .availabilityCheckLimit,
      /older active requests are not included/i,
    );
  });

  it("renders Premium Operations route feedback in the dashboard interface language", () => {
    assert.equal(
      readPremiumOperationsRouteFlashMessage({
        kind: "notice",
        language: "fr-CA",
        value: premiumOperationsRouteNoticeCodes.priorityRuleSaved,
      }),
      "La règle de priorité a été enregistrée.",
    );
    assert.equal(
      readPremiumOperationsRouteFlashMessage({
        kind: "error",
        language: "fa",
        value: premiumOperationsRouteErrorCodes.managerReviewRequired,
      }),
      "پیش از کپی‌کردن، مدیر باید این پیش‌نویس را بررسی کند.",
    );
    assert.equal(
      readPremiumOperationsRouteFlashMessage({
        kind: "error",
        language: "ar",
        value: premiumOperationsRouteErrorCodes.managerPermissionRequired,
      }),
      "لا يمكن إدارة هذا التغيير في العمليات المميزة إلا للمالك أو المدير.",
    );
    assert.equal(
      readPremiumOperationsRouteFlashMessage({
        kind: "notice",
        language: "es",
        value: "untrusted-message",
      }),
      null,
    );
    assert.equal(
      readPremiumOperationsRouteFlashMessage({
        kind: "error",
        language: "ar",
        value: "untrusted-message",
      }),
      "تعذّر إكمال إجراء العمليات المميزة هذا. يُرجى المحاولة مرة أخرى.",
    );
  });

  it("covers every stable Premium Operations feedback code in every dashboard language", () => {
    for (const language of dashboardInterfaceLanguages) {
      for (const value of Object.values(premiumOperationsRouteErrorCodes)) {
        assert.ok(
          readPremiumOperationsRouteFlashMessage({
            kind: "error",
            language,
            value,
          }),
          `${language} is missing the ${value} Premium Operations error copy.`,
        );
      }
      for (const value of Object.values(premiumOperationsRouteNoticeCodes)) {
        assert.ok(
          readPremiumOperationsRouteFlashMessage({
            kind: "notice",
            language,
            value,
          }),
          `${language} is missing the ${value} Premium Operations notice copy.`,
        );
      }
    }
  });

  it("keeps the dashboard-interface selector reachable in the compact More menu", () => {
    const topbar = readFileSync(
      "components/dashboard/dashboard-topbar.tsx",
      "utf8",
    );

    assert.match(topbar, /dashboard-interface-language-mobile/);
    assert.match(topbar, /className="[^"\n]*sm:hidden/);
    assert.match(topbar, /action=\{updateDashboardInterfaceLanguageAction\}/);
  });
});
