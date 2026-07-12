/**
 * ============================================================
 * File: tests/unit/public-language-links.test.mts
 * Project: BizPilot AI
 * Description: Unit checks for public marketing language-preserving hrefs.
 * Role: Prevents fr-CA navigation from silently returning visitors to English pages.
 * Related:
 * - lib/i18n/public-href.ts
 * - components/public/marketing-ui.tsx
 * - tests/smoke/public-route-smoke.mts
 * Author: MoOoH
 * Created: 2026-07-12
 * Last Updated: 2026-07-12
 * Change Log:
 * - 2026-07-12: Added fr-CA query, hash, and shared-shell link regression coverage.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { publicHref } from "../../lib/i18n/public-href.ts";

const marketingUiSource = readFileSync(
  "components/public/marketing-ui.tsx",
  "utf8",
);

describe("public language-preserving links", () => {
  it("keeps fr-CA on internal routes while preserving query and hash", () => {
    assert.equal(publicHref("/features", "fr-CA"), "/features?language=fr-CA");
    assert.equal(
      publicHref("/industries/cleaning?source=header#services", "fr-CA"),
      "/industries/cleaning?source=header&language=fr-CA#services",
    );
  });

  it("leaves English, external, and hash-only hrefs unchanged", () => {
    assert.equal(publicHref("/features", "en"), "/features");
    assert.equal(publicHref("mailto:?subject=pilot", "fr-CA"), "mailto:?subject=pilot");
    assert.equal(publicHref("#pilot-request-template", "fr-CA"), "#pilot-request-template");
  });

  it("routes every shared marketing link primitive through the helper", () => {
    assert.match(marketingUiSource, /const localizedHref = publicHref\(href, language\)/);
    assert.match(marketingUiSource, /href=\{publicHref\(item\.href, language\)\}/);
    assert.match(marketingUiSource, /href=\{publicHref\(link\.href, language\)\}/);
    assert.match(marketingUiSource, /<MarketingBrand language=\{language\}/);
  });
});
