/**
 * ============================================================
 * File: tests/unit/public-brand-theme.test.mts
 * Project: BizPilot AI
 * Description: Unit coverage for shared public brand color derivation.
 * Role: Prevents unreadable CTA foregrounds, unsafe logo schemes, and preview/public token drift.
 * Related:
 * - lib/public-brand-theme.ts
 * - app/(public)/quote/[slug]/page.tsx
 * Author: MoOoH
 * Created: 2026-07-16
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Added WCAG contrast, fallback, hover, focus, and logo-source coverage.
 * ============================================================
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  contrastRatio,
  getPublicBrandPalette,
  isSafePublicLogoSource,
  normalizeBrandHex,
  readableBrandForeground,
} from "../../lib/public-brand-theme.ts";

describe("public brand theme", () => {
  it("chooses the higher-contrast black or white CTA text", () => {
    for (const background of ["#00aa00", "#808080", "#ff0000", "#f22618", "#1f1fef"]) {
      const foreground = readableBrandForeground(background);
      assert.ok(contrastRatio(background, foreground) >= 4.5, `${background} should remain readable`);
    }
  });

  it("normalizes invalid values and derives distinct interaction tokens", () => {
    assert.equal(normalizeBrandHex("not-a-color", "#3f5cff"), "#3f5cff");
    const palette = getPublicBrandPalette({
      accent_color: "#ffeeaa",
      primary_color: "#1F1FEF",
    });

    assert.equal(palette.primary, "#1f1fef");
    assert.notEqual(palette.primaryHover, palette.primary);
    assert.ok(contrastRatio(palette.focus, "#ffffff") >= 3);
    assert.ok(contrastRatio(palette.primaryText, "#ffffff") >= 4.5);
    assert.ok(contrastRatio(palette.primary, palette.onPrimary) >= 4.5);
  });

  it("accepts only bounded data images or HTTPS logo URLs", () => {
    assert.equal(isSafePublicLogoSource("data:image/png;base64,AAAA"), true);
    assert.equal(isSafePublicLogoSource("https://example.com/logo.png"), true);
    assert.equal(isSafePublicLogoSource("http://example.com/logo.png"), false);
    assert.equal(isSafePublicLogoSource("javascript:alert(1)"), false);
  });
});
