/**
 * ============================================================
 * File: tests/unit/quote-attribution.test.mts
 * Project: BizPilot AI
 * Description: Regression coverage for public quote source attribution.
 * Role: Verifies quote links preserve safe source/UTM context without storing
 *       arbitrary customer query data in lead attribution metadata.
 * Related:
 * - lib/quote-attribution.ts
 * - app/(public)/quote/[slug]/page.tsx
 * - components/public/quote-form-wizard.tsx
 * Author: MoOoH
 * Created: 2026-07-04
 * ============================================================
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildQuoteAttributionFormQuery,
  buildQuoteLanguageHref,
  buildQuoteSourceUrl,
  type QuoteAttributionSearchParams,
} from "../../lib/quote-attribution.ts";

function parsePublicUrl(value: string): URL {
  return new URL(value);
}

describe("quote attribution", () => {
  it("builds a safe source URL from approved quote attribution parameters", () => {
    const formQuery = buildQuoteAttributionFormQuery({
      query: {
        language: "fr-CA",
        ref: "website-footer",
        source: "instagram",
        utm_campaign: "summer cleaning",
        utm_medium: "bio",
        utm_source: "instagram",
      },
      slug: "sparkle-cleaning",
    });
    const url = parsePublicUrl(formQuery.sourceUrl);

    assert.equal(url.origin, "https://bizpilo.com");
    assert.equal(url.pathname, "/quote/sparkle-cleaning");
    assert.equal(url.searchParams.get("language"), "fr-CA");
    assert.equal(url.searchParams.get("ref"), "website-footer");
    assert.equal(url.searchParams.get("source"), "instagram");
    assert.equal(url.searchParams.get("utm_campaign"), "summer cleaning");
    assert.equal(url.searchParams.get("utm_medium"), "bio");
    assert.equal(url.searchParams.get("utm_source"), "instagram");
    assert.equal(formQuery.source, "instagram");
    assert.equal(formQuery.utm_source, "instagram");
  });

  it("drops arbitrary customer or redirect query fields from sourceUrl", () => {
    const query = {
      customer_email: "client@example.com",
      message: "Please clean before Friday",
      phone: "555-0100",
      redirect: "https://example.invalid",
      source: "gbp",
      utm_source: ["google-business-profile", "ignored"],
    } as Record<string, unknown> as QuoteAttributionSearchParams;
    const url = parsePublicUrl(
      buildQuoteSourceUrl({
        query,
        slug: "maid-pro",
      }),
    );

    assert.equal(url.searchParams.get("source"), "gbp");
    assert.equal(url.searchParams.get("utm_source"), "google-business-profile");

    for (const blocked of [
      "customer_email",
      "message",
      "phone",
      "redirect",
    ]) {
      assert.equal(url.searchParams.has(blocked), false);
      assert.equal(url.toString().includes(blocked), false);
    }
  });

  it("cleans unsupported language and unsafe control characters", () => {
    const noisySource = ` google${String.fromCharCode(0)}ads${String.fromCharCode(10)} `;
    const longCampaign = "x".repeat(180);
    const formQuery = buildQuoteAttributionFormQuery({
      query: {
        language: "es-MX",
        source: noisySource,
        utm_campaign: longCampaign,
      },
      slug: "sparkle-cleaning",
    });
    const url = parsePublicUrl(formQuery.sourceUrl);

    assert.equal(formQuery.language, undefined);
    assert.equal(formQuery.source, "googleads");
    assert.equal(formQuery.utm_campaign?.length, 160);
    assert.equal(url.searchParams.has("language"), false);
    assert.equal(url.searchParams.get("source"), "googleads");
    assert.equal(url.searchParams.get("utm_campaign")?.length, 160);
  });

  it("preserves safe attribution when switching quote-page languages", () => {
    const frenchHref = new URL(
      buildQuoteLanguageHref({
        language: "fr-CA",
        query: {
          ref: "saved-reply",
          source: "instagram",
          utm_source: "instagram",
        },
        slug: "sparkle-cleaning",
      }),
      "https://bizpilo.com",
    );
    const englishHref = new URL(
      buildQuoteLanguageHref({
        language: "en",
        query: {
          language: "fr-CA",
          ref: "saved-reply",
          source: "instagram",
          utm_source: "instagram",
        },
        slug: "sparkle-cleaning",
      }),
      "https://bizpilo.com",
    );

    assert.equal(frenchHref.pathname, "/quote/sparkle-cleaning");
    assert.equal(frenchHref.searchParams.get("language"), "fr-CA");
    assert.equal(frenchHref.searchParams.get("ref"), "saved-reply");
    assert.equal(frenchHref.searchParams.get("source"), "instagram");
    assert.equal(frenchHref.searchParams.get("utm_source"), "instagram");

    assert.equal(englishHref.pathname, "/quote/sparkle-cleaning");
    assert.equal(englishHref.searchParams.has("language"), false);
    assert.equal(englishHref.searchParams.get("ref"), "saved-reply");
    assert.equal(englishHref.searchParams.get("source"), "instagram");
    assert.equal(englishHref.searchParams.get("utm_source"), "instagram");
  });
});
