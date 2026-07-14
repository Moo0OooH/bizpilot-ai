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
 * Last Updated: 2026-07-13
 * Change Log:
 * - 2026-07-13: Replaced legacy V2 title/event guards with V3 metadata, JSON-LD parity, and current no-op event behavior checks.
 * - 2026-07-13: Migrated canonical, redirect, structured-data, and pilot-event guards to the ten retained V3 routes.
 * - 2026-07-11: Added Content Studio breadcrumb JSON-LD guard.
 * - 2026-06-21: Added public FAQ route SEO coverage.
 * - 2026-07-04: Added comparison route, JSON-LD, OG image, and roadmap noindex guards.
 * - 2026-07-04: Added Search Console and Core Web Vitals baseline evidence guards.
 * - 2026-07-04: Added no-PII analytics taxonomy guards.
 * - 2026-07-04: Added FAQ AI-search completion evidence guards.
 * - 2026-07-05: Guarded BreadcrumbList JSON-LD on deeper canonical public routes.
 * - 2026-07-05: Guarded refreshed sitemap freshness after local public-site smoke.
 * - 2026-07-05: Updated robots source guard for exact quote-intake blocking while preserving the quote-link guide.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { getPolicyCopy } from "../../lib/i18n/policy-copy.ts";
import { getPublicV3Spec } from "../../lib/i18n/public-v3-spec.ts";
import {
  forbiddenPublicEventPayloadKeys,
  publicEventCatalog,
} from "../../lib/public-events.ts";
import {
  buildFaqPageJsonLd,
  buildHomeJsonLd,
} from "../../lib/public-structured-data.ts";
import {
  buildPublicMetadata,
  publicCanonicalRoutes,
  publicLanguageAlternates,
  publicUrl,
} from "../../lib/seo.ts";

function source(path: string): string {
  return readFileSync(path, "utf8");
}

describe("final public SEO and legal source contracts", () => {
  it("builds unique, localized V3 metadata for every canonical route", () => {
    for (const language of ["en", "fr-CA"] as const) {
      const spec = getPublicV3Spec(language);
      const titles = publicCanonicalRoutes.map((path) => spec.routes[path].meta.title);
      const descriptions = publicCanonicalRoutes.map(
        (path) => spec.routes[path].meta.description,
      );

      assert.equal(new Set(titles).size, publicCanonicalRoutes.length);
      assert.equal(new Set(descriptions).size, publicCanonicalRoutes.length);

      for (const path of publicCanonicalRoutes) {
        const copy = spec.routes[path].meta;
        const metadata = buildPublicMetadata(path, copy, language);

        assert.equal(metadata.title, copy.title);
        assert.equal(metadata.description, copy.description);
        assert.equal(metadata.alternates?.canonical, publicUrl(path, language));
        assert.deepEqual(
          metadata.alternates?.languages,
          publicLanguageAlternates(path),
        );
        assert.equal(JSON.stringify(metadata).includes(copy.title), true);
        assert.equal(JSON.stringify(metadata).includes(copy.description), true);
      }
    }
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
      "/demo",
      "/pricing",
      "/pilot",
      "/faq",
      "/trust",
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

    for (const privateOrIntakePath of ["/auth", "/dashboard", "/admin"]) {
      assert.equal(
        publicCanonicalRoutes.some((path) => path.startsWith(privateOrIntakePath)),
        false,
      );
    }

    assert.equal(
      publicCanonicalRoutes.some((path) => {
        const route = String(path);
        return route === "/quote" || route.startsWith("/quote/");
      }),
      false,
    );
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
      '"/quote$"',
      '"/quote/"',
    ]) {
      assert.equal(robots.includes(blocked), true);
    }

    assert.equal(seo.includes('"en-CA"'), true);
    assert.equal(seo.includes('"fr-CA"'), true);
    assert.equal(seo.includes('"x-default"'), true);
    assert.equal(seo.includes("summary_large_image"), true);
    assert.equal(seo.includes("/opengraph-image"), true);
    assert.equal(sitemap.includes("2026-07-13T00:00:00.000Z"), true);

    for (const route of [
      "app/page.tsx",
      "app/faq/page.tsx",
      "app/features/page.tsx",
      "app/trust/page.tsx",
      "app/demo/page.tsx",
      "app/pricing/page.tsx",
      "app/pilot/page.tsx",
      "app/privacy/page.tsx",
      "app/security/page.tsx",
      "app/terms/page.tsx",
    ]) {
      const routeSource = source(route);
      assert.equal(routeSource.includes("buildPublicMetadata"), true, route);
      assert.equal(routeSource.includes("resolvePublicRouteLanguage"), true, route);
    }

    const redirectConfig = source("next.config.ts");
    for (const path of [
      "/comparison",
      "/quote-link-guide",
      "/faster-quote-replies",
      "/content-studio",
      "/industries/cleaning",
    ]) {
      assert.equal(redirectConfig.includes(`source: "${path}"`), true, path);
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
    const analyticsSpec = source(
      "docs/readiness/PHASE_25L_NO_PII_ANALYTICS_FOUNDER_FUNNEL_2026-07-04.md",
    );

    for (const eventName of [
      "pilot_template_copy",
      "locale_change",
      "theme_preference_change",
      "external_reference_click",
    ]) {
      assert.equal(events.includes(`"${eventName}"`), true);
    }

    assert.equal(events.includes("Intentional no-op"), true);
    assert.equal(events.includes("publicEventCatalog"), true);
    assert.deepEqual(
      Object.keys(publicEventCatalog).sort(),
      [
        "external_reference_click",
        "locale_change",
        "pilot_template_copy",
        "theme_preference_change",
      ].sort(),
    );
    assert.deepEqual(
      [...forbiddenPublicEventPayloadKeys],
      [
        "email",
        "phone",
        "name",
        "address",
        "message",
        "quoteDetails",
        "prompt",
        "aiOutput",
        "customerId",
        "leadId",
      ],
    );
    for (const definition of Object.values(publicEventCatalog)) {
      const safePayloadKeys: readonly string[] = definition.safePayloadKeys;
      for (const forbidden of forbiddenPublicEventPayloadKeys) {
        assert.equal(
          safePayloadKeys.includes(forbidden),
          false,
          `${definition.description} should not allow ${forbidden}.`,
        );
      }
    }
    for (const required of [
      "No analytics sink is approved yet.",
      "Future Founder Funnel Dashboard",
      "Pilot template copy/select events",
      "lead_source_metadata",
      "leads.first_reply_copied_at",
      "No customer free text",
      "first-party analytics sink",
    ]) {
      assert.equal(
        analyticsSpec.includes(required),
        true,
        `Analytics spec missing ${required}.`,
      );
    }
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
      source("components/public/public-v3-pilot-request.tsx").includes(
        "pilot_template_copy",
      ),
      true,
    );
  });

  it("emits structured data through the approved helper and shared V3 renderer", () => {
    const jsonLd = source("components/public/json-ld.tsx");
    const structured = source("lib/public-structured-data.ts");
    const home = source("app/page.tsx");
    const faq = source("app/faq/page.tsx");
    const sharedV3 = source("components/public/public-v3-page.tsx");
    const policyPage = source("components/public/policy-page.tsx");
    const ogImage = source("app/opengraph-image.tsx");

    assert.equal(jsonLd.includes('type="application/ld+json"'), true);
    assert.equal(jsonLd.includes("JSON.stringify(data).replaceAll"), true);
    assert.equal(jsonLd.includes("u003c"), true);
    assert.equal(structured.includes('"FAQPage"'), true);
    assert.equal(structured.includes('"BreadcrumbList"'), true);
    assert.equal(structured.includes('"SoftwareApplication"'), true);
    assert.equal(structured.includes('"Service"'), true);
    assert.equal(home.includes("buildHomeJsonLd"), true);
    assert.equal(faq.includes("PublicV3Page"), true);
    assert.equal(sharedV3.includes("buildFaqPageJsonLd(spec.faqItems, language)"), true);
    assert.equal(sharedV3.includes("buildBreadcrumbJsonLd"), true);

    for (const route of [
      "app/features/page.tsx",
      "app/trust/page.tsx",
      "app/demo/page.tsx",
      "app/pricing/page.tsx",
      "app/faq/page.tsx",
      "app/pilot/page.tsx",
    ]) {
      assert.equal(source(route).includes("PublicV3Page"), true, route);
    }

    assert.equal(policyPage.includes("buildBreadcrumbJsonLd"), true);
    assert.equal(policyPage.includes("JsonLdScript"), true);
    assert.equal(policyPage.includes("breadcrumbId"), true);
    assert.equal(ogImage.includes("ImageResponse"), true);

    const englishHomeJson = JSON.stringify(buildHomeJsonLd("en"));
    const frenchHomeJson = JSON.stringify(buildHomeJsonLd("fr-CA"));
    const frenchSpec = getPublicV3Spec("fr-CA");
    const frenchFaqJson = JSON.stringify(
      buildFaqPageJsonLd(frenchSpec.faqItems, "fr-CA"),
    );

    assert.equal(englishHomeJson.includes("one link"), true);
    assert.equal(englishHomeJson.includes("owner review"), true);
    assert.equal(frenchHomeJson.includes("demande client organisée"), true);
    assert.equal(frenchHomeJson.includes("brouillon prêt à vérifier"), true);
    assert.equal(frenchHomeJson.includes("content-studio"), false);
    for (const item of frenchSpec.faqItems) {
      assert.equal(frenchFaqJson.includes(item.question), true);
      assert.equal(frenchFaqJson.includes(item.answer), true);
    }
  });

  it("keeps FAQ AI-search content source-backed without ranking claims", () => {
    const faqItems = getPublicV3Spec("en").faqItems;
    const keys = faqItems.map((item) => item.key);
    const faqRoute = source("app/faq/page.tsx");
    const sharedV3 = source("components/public/public-v3-page.tsx");
    const structured = source("lib/public-structured-data.ts");
    const phase25n = source(
      "docs/readiness/PHASE_25N_FAQ_AI_SEARCH_COMPLETION_2026-07-04.md",
    );

    for (const key of [
      "direct-integrations",
      "after-submit",
      "ai-role",
      "auto-send",
      "pricing-booking",
      "verticals",
    ]) {
      assert.equal(keys.includes(key), true, key);
    }

    assert.equal(faqRoute.includes("PublicV3Page"), true);
    assert.equal(sharedV3.includes("buildFaqPageJsonLd(spec.faqItems, language)"), true);
    assert.equal(structured.includes('"FAQPage"'), true);
    for (const required of [
      "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data",
      "https://developers.google.com/search/docs/appearance/structured-data/search-gallery",
      "https://developers.google.com/search/blog/2023/08/howto-faq-changes",
      "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
      "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
      "FAQPage JSON-LD does not guarantee indexing, rankings, rich results, AI",
      "BizPilot does not auto-send messages.",
      "Paid pilot collection remains blocked",
    ]) {
      assert.equal(phase25n.includes(required), true, required);
    }
  });

  it("keeps Search Console and Core Web Vitals checklist source-backed", () => {
    const checklist = source(
      "docs/readiness/PHASE_25K_SEARCH_CONSOLE_CWV_BASELINE_2026-07-04.md",
    );

    for (const officialSource of [
      "https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap",
      "https://developers.google.com/search/docs/crawling-indexing/robots/intro",
      "https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing",
      "https://developers.google.com/search/docs/appearance/core-web-vitals",
      "https://developers.google.com/speed/docs/insights/v5/about",
      "https://developers.google.com/search/updates",
    ]) {
      assert.equal(
        checklist.includes(officialSource),
        true,
        `Missing official source ${officialSource}.`,
      );
    }

    for (const required of [
      "https://bizpilo.com/sitemap.xml",
      "Use URL Inspection",
      "Google treats sitemap submission as a discovery hint",
      "not a noindex mechanism",
      "LCP good: <= 2.5s",
      "INP good: <= 200ms",
      "CLS good: <= 0.1",
      "Lighthouse 13.4.0",
      "| `/` | 65 | 6505ms | 0.000 | 419ms |",
      "INP must be verified",
    ]) {
      assert.equal(checklist.includes(required), true, `Missing ${required}.`);
    }
  });
});
