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
 * Last Updated: 2026-07-11
 * Change Log:
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
import { getPublicSiteCopy } from "../../lib/i18n/public-site-copy.ts";
import { getPublicV2Copy } from "../../lib/i18n/public-v2-copy.ts";
import {
  forbiddenPublicEventPayloadKeys,
  publicEventCatalog,
} from "../../lib/public-events.ts";
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
      copy.faq.meta.title,
      "FAQ for Cleaning Business Owners | BizPilot AI",
    );
    assert.equal(
      copy.comparison.meta.title,
      "BizPilot vs CRM, Forms, and Booking Tools | BizPilot AI",
    );
    assert.equal(
      copy.cleaning.meta.title,
      "Cleaning Business Lead Recovery Software | BizPilot AI",
    );
    assert.equal(
      copy.trust.meta.title,
      "Business-Controlled AI and Trust | BizPilot AI",
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
      "/faq",
      "/comparison",
      "/quote-link-guide",
      "/faster-quote-replies",
      "/features",
      "/industries/cleaning",
      "/trust",
      "/demo",
      "/pricing",
      "/pilot",
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
    assert.equal(sitemap.includes("2026-07-05T00:00:00.000Z"), true);

    for (const route of [
      "app/page.tsx",
      "app/faq/page.tsx",
      "app/comparison/page.tsx",
      "app/quote-link-guide/page.tsx",
      "app/faster-quote-replies/page.tsx",
      "app/features/page.tsx",
      "app/industries/cleaning/page.tsx",
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

    assert.equal(
      source("app/content-studio/page.tsx").includes("buildNoIndexMetadata"),
      true,
      "Content Studio should remain available but noindex while it is roadmap-only.",
    );

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
      "comparison_cta_click",
      "founder_pilot_cta_click",
      "demo_cta_click",
      "pricing_cta_click",
      "quote_link_guide_cta_click",
      "pilot_template_copy",
      "faq_item_open",
      "service_use_case_click",
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
        "comparison_cta_click",
        "demo_cta_click",
        "external_reference_click",
        "faq_item_open",
        "founder_pilot_cta_click",
        "locale_change",
        "pilot_template_copy",
        "pricing_cta_click",
        "quote_link_guide_cta_click",
        "service_use_case_click",
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
      source("components/public/pilot-request-template-card.tsx").includes(
        "pilot_template_copy",
      ),
      true,
    );
  });

  it("emits structured data through the approved helper and shared V2 renderer", () => {
    const jsonLd = source("components/public/json-ld.tsx");
    const structured = source("lib/public-structured-data.ts");
    const home = source("app/page.tsx");
    const faq = source("app/faq/page.tsx");
    const sharedV2 = source("components/public/bizpilot-v2-page.tsx");
    const pilot = source("app/pilot/page.tsx");
    const quoteLinkGuide = source("app/quote-link-guide/page.tsx");
    const replySpeedGuide = source("app/faster-quote-replies/page.tsx");
    const policyPage = source("components/public/policy-page.tsx");
    const ogImage = source("app/opengraph-image.tsx");

    assert.equal(jsonLd.includes('type="application/ld+json"'), true);
    assert.equal(jsonLd.includes('replaceAll("<", "\\u003c")'), true);
    assert.equal(structured.includes('"FAQPage"'), true);
    assert.equal(structured.includes('"BreadcrumbList"'), true);
    assert.equal(structured.includes('"SoftwareApplication"'), true);
    assert.equal(structured.includes('"Service"'), true);
    assert.equal(home.includes("buildHomeJsonLd"), true);
    assert.equal(faq.includes("faqItems={copy.items}"), true);
    assert.equal(sharedV2.includes("buildFaqPageJsonLd(faqItems, language)"), true);
    assert.equal(sharedV2.includes("buildBreadcrumbJsonLd"), true);
    assert.equal(pilot.includes("buildBreadcrumbJsonLd"), true);
    assert.equal(pilot.includes("bizpilot-v2-pilot-breadcrumb-jsonld"), true);
    assert.equal(quoteLinkGuide.includes("buildBreadcrumbJsonLd"), true);
    assert.equal(replySpeedGuide.includes("buildBreadcrumbJsonLd"), true);

    for (const route of [
      "app/features/page.tsx",
      "app/industries/cleaning/page.tsx",
      "app/trust/page.tsx",
      "app/demo/page.tsx",
      "app/pricing/page.tsx",
      "app/comparison/page.tsx",
      "app/faq/page.tsx",
    ]) {
      assert.equal(source(route).includes("BizPilotV2Page"), true, route);
    }

    assert.equal(policyPage.includes("buildBreadcrumbJsonLd"), true);
    assert.equal(policyPage.includes("JsonLdScript"), true);
    assert.equal(policyPage.includes("breadcrumbId"), true);
    assert.equal(ogImage.includes("ImageResponse"), true);
  });

  it("keeps FAQ AI-search content source-backed without ranking claims", () => {
    const questions = getPublicV2Copy("en").faq.items.map(
      (item) => item.question,
    );
    const faqRoute = source("app/faq/page.tsx");
    const sharedV2 = source("components/public/bizpilot-v2-page.tsx");
    const structured = source("lib/public-structured-data.ts");
    const phase25n = source(
      "docs/readiness/PHASE_25N_FAQ_AI_SEARCH_COMPLETION_2026-07-04.md",
    );

    for (const question of [
      "Does BizPilot connect directly to Gmail, WhatsApp, Instagram, or SMS today?",
      "Does AI send messages automatically?",
      "Can BizPilot invent prices or confirm bookings?",
      "Is BizPilot only for cleaning businesses?",
      "What happens after a customer submits the intake form?",
      "Is BizPilot a CRM, booking platform, or invoicing system?",
    ]) {
      assert.equal(questions.includes(question), true, question);
    }

    assert.equal(faqRoute.includes("faqItems={copy.items}"), true);
    assert.equal(sharedV2.includes("buildFaqPageJsonLd(faqItems, language)"), true);
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
