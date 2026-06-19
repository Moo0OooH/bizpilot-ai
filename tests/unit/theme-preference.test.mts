/**
 * ============================================================
 * File: tests/unit/theme-preference.test.mts
 * Project: BizPilot AI
 * Description: Tests shared theme preference defaults and resolution.
 * Role: Protects the public Light-by-default theme contract from regressions.
 * Related:
 * - lib/theme.ts
 * - app/layout.tsx
 * - components/ui/theme-preference-control.tsx
 * Author: MoOoH
 * Created: 2026-06-19
 * Last Updated: 2026-06-19
 * Change Log:
 * - 2026-06-19: Added Phase 01 theme default and effective-theme coverage.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import {
  DEFAULT_THEME_PREFERENCE,
  THEME_COLOR_BY_RESOLVED,
  readResolvedTheme,
  readThemePreference,
  resolveEffectiveTheme,
  resolveThemeForServer,
} from "../../lib/theme.ts";

describe("shared theme preference", () => {
  it("defaults fresh sessions to light with OS light or OS dark", () => {
    const preference = readThemePreference(undefined);

    assert.equal(preference, DEFAULT_THEME_PREFERENCE);
    assert.equal(resolveEffectiveTheme(preference, false), "light");
    assert.equal(resolveEffectiveTheme(preference, true), "light");
  });

  it("keeps explicit dark and light preferences stable", () => {
    assert.equal(resolveEffectiveTheme(readThemePreference("dark"), false), "dark");
    assert.equal(resolveEffectiveTheme(readThemePreference("dark"), true), "dark");
    assert.equal(resolveEffectiveTheme(readThemePreference("light"), false), "light");
    assert.equal(resolveEffectiveTheme(readThemePreference("light"), true), "light");
  });

  it("follows the operating system only when device setting is selected", () => {
    const preference = readThemePreference("system");

    assert.equal(resolveEffectiveTheme(preference, false), "light");
    assert.equal(resolveEffectiveTheme(preference, true), "dark");
  });

  it("recovers invalid stored values to light", () => {
    assert.equal(readThemePreference("sepia"), "light");
    assert.equal(readThemePreference(null), "light");
    assert.equal(readThemePreference("", "dark"), "dark");
  });

  it("keeps server resolution hydration-safe", () => {
    assert.equal(resolveThemeForServer("light"), "light");
    assert.equal(resolveThemeForServer("dark"), "dark");
    assert.equal(resolveThemeForServer("system"), "light");
    assert.equal(readResolvedTheme("dark"), "dark");
    assert.equal(readResolvedTheme("system"), "light");
  });

  it("keeps the first-paint bootstrap on the light default", () => {
    const layoutSource = readFileSync("app/layout.tsx", "utf8");

    assert.match(layoutSource, /DEFAULT_THEME_PREFERENCE/);
    assert.doesNotMatch(layoutSource, /\|\|"system"/);
    assert.equal(THEME_COLOR_BY_RESOLVED.light, "#F8FAFC");
    assert.equal(THEME_COLOR_BY_RESOLVED.dark, "#08111F");
  });
});
