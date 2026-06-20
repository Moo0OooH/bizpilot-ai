/**
 * ============================================================
 * File: tests/unit/seo-source.test.mts
 * Project: BizPilot AI
 * Description: Source-level guardrails for final public SEO/legal polish.
 * Role: Verifies canonical metadata, sitemap/robots boundaries, official references, and no-op event hooks.
 * Related:
 * - lib/seo.ts
 * - app/sitemap.ts
 * - app/robots.ts
 * - components/public/policy-page.tsx
 * Author: MoOoH
 * Created: 2026-06-20
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { getPolicyCopy } from "../../lib/i18n/policy-copy.ts";
import { getPublicSiteCopy } from "../../lib/i18n/public-site-copy.ts";
import {
  publicCanonicalRoutes,
  publicLanguageAlternates,
  publicUrl,
} from "../../lib/seo.ts";

function source(path: string): string {
  return readFileSync(path, "utf8");
}

describe("final public SEO and legal source contracts", () => {
  it("keeps Phase 08 suggested marketing titles claim-safe", () => {
    const copy = getPublicSiteCopy("en");

    assert.equal(
      copy.home.meta.title,
      "BizPilot AI | Lead Recovery for Cleaning Businesses",
    );
    assert.equal(
      copy.features.meta.title,
      "Cleaning Lead Recovery Features | BizPilot AI",
    );
    assert.equal(
      copy.cleaning.meta.title,
      "Cleaning Business Lead Recovery Software | BizPilot AI",
    );
    assert.equal(
      copy.trust.meta.title,
      "Owner-Controlled AI and Trust | BizPilot AI",
    );
    assert.equal(
      copy.demo.meta.title,
      "Cleaning Quote Workflow Demo | BizPilot AI",
    );
    assert.equal(
      copy.pricing.meta.title,
      "Founder Pilot Pricing | BizPilot AI",
    );
    assert.equal(
      copy.pilot.meta.title,
      "Cleaning Business Founder Pilot | BizPilot AI",
    );
  });

  it("uses official resource-card references without compliance claims", () => {
    const privacy = getPolicyCopy("en").privacy;
    const security = getPolicyCopy("en").security;
    const policyPage = source("components/public/policy-page.tsx");
    const trackedLink = source(
      "components/public/tracked-external-reference-link.tsx",
    );

    for (const page of [privacy, security]) {
      const hrefs = new Set(page.references?.map((reference) => reference.href));

      assert.equal(
        hrefs.has(
          "https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/",
        ),
        true,
      );
      assert.equal(
        hrefs.has(
          "https://www.cai.gouv.qc.ca/protection-renseignements-personnels/sujets-et-domaines-dinteret/principaux-changements-loi-25/",
        ),
        true,
      );

      for (const reference of page.references ?? []) {
        assert.equal(reference.title.length > 12, true);
        assert.equal(reference.description.length > 24, true);
      }
    }

    assert.equal(policyPage.includes("copy.technicalNotesTitle"), true);
    assert.equal(policyPage.includes("TrackedExternalReferenceLink"), true);
    assert.equal(trackedLink.includes('target="_blank"'), true);
    assert.equal(trackedLink.includes('rel="noopener noreferrer"'), true);
    assert.equal(trackedLink.includes("newTabLabel"), true);
    assert.equal(trackedLink.includes("external_reference_click"), true);

    for (const forbidden of ["certified", "certification", "guaranteed compliance"]) {
      assert.equal(policyPage.toLowerCase().includes(forbidden), false);
    }
  });

  it("generates canonical public URLs and hreflang alternates only for real public pages", () => {
    assert.deepEqual(publicCanonicalRoutes, [
      "/",
      "/features",
      "/industries/cleaning",
      "/trust",
      "/demo",
      "/pricing",
      "/pilot",
      "/content-studio",
      "/privacy",
      "/security",
      "/terms",
    ]);

    for (const path of publicCanonicalRoutes) {
      const alternates = publicLanguageAlternates(path);

      assert.equal(publicUrl(path).startsWith("https://bizpilo.com"), true);
      assert.equal(alternates["en-CA"].startsWith("https://bizpilo.com"), true);
      assert.equal(
        alternates["fr-CA"].includes("language=fr-CA"),
        true,
        `${path} should expose a crawlable fr-CA alternate`,
      );
      assert.equal(alternates["x-default"], alternates["en-CA"]);
    }

    for (const privateOrIntakePath of ["/auth", "/dashboard", "/admin", "/quote"]) {
      assert.equal(
        publicCanonicalRoutes.some((path) => path.startsWith(privateOrIntakePath)),
        false,
      );
    }
  });

  it("keeps sitemap/robots and route metadata wired to shared SEO helpers", () => {
    const sitemap = source("app/sitemap.ts");
    const robots = source("app/robots.ts");
    const seo = source("lib/seo.ts");

    assert.equal(sitemap.includes("publicCanonicalRoutes"), true);
    assert.equal(sitemap.includes("publicLanguageAlternates"), true);
    assert.equal(robots.includes('disallow: ['), true);

    for (const blocked of [
      '"/admin"',
      '"/auth"',
      '"/dashboard"',
      '"/founder"',
      '"/quote"',
    ]) {
      assert.equal(robots.includes(blocked), true);
    }

    assert.equal(seo.includes('"en-CA"'), true);
    assert.equal(seo.includes('"fr-CA"'), true);
    assert.equal(seo.includes('"x-default"'), true);

    for (const route of [
      "app/page.tsx",
      "app/features/page.tsx",
      "app/industries/cleaning/page.tsx",
      "app/trust/page.tsx",
      "app/demo/page.tsx",
      "app/pricing/page.tsx",
      "app/pilot/page.tsx",
      "app/content-studio/page.tsx",
      "app/privacy/page.tsx",
      "app/security/page.tsx",
      "app/terms/page.tsx",
    ]) {
      const routeSource = source(route);
      assert.equal(routeSource.includes("buildPublicMetadata"), true, route);
      assert.equal(routeSource.includes("resolvePublicRouteLanguage"), true, route);
    }

    for (const route of [
      "app/auth/sign-in/page.tsx",
      "app/auth/sign-up/page.tsx",
      "app/auth/forgot-password/page.tsx",
      "app/auth/reset-password/page.tsx",
      "app/auth/check-email/page.tsx",
      "app/(public)/quote/[slug]/page.tsx",
      "app/(public)/quote/[slug]/success/page.tsx",
    ]) {
      assert.equal(source(route).includes("buildNoIndexMetadata"), true, route);
    }
  });

  it("documents approved public events through a typed no-op helper only", () => {
    const events = source("lib/public-events.ts");

    for (const eventName of [
      "founder_pilot_cta_click",
      "demo_cta_click",
      "pricing_cta_click",
      "pilot_template_copy",
      "service_use_case_click",
      "locale_change",
      "theme_preference_change",
      "external_reference_click",
    ]) {
      assert.equal(events.includes(`"${eventName}"`), true);
    }

    assert.equal(events.includes("Intentional no-op"), true);
    assert.equal(
      source("components/public/marketing-language-menu.tsx").includes(
        "locale_change",
      ),
      true,
    );
    assert.equal(
      source("components/ui/theme-preference-control.tsx").includes(
        "theme_preference_change",
      ),
      true,
    );
    assert.equal(
      source("components/public/pilot-request-template-card.tsx").includes(
        "pilot_template_copy",
      ),
      true,
    );
  });
});
