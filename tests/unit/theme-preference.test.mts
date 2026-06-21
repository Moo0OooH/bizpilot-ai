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
 * Last Updated: 2026-06-21
 * Change Log:
 * - 2026-06-19: Added Phase 01 theme default and effective-theme coverage.
 * - 2026-06-21: Added public theme token contrast contracts.
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

type Rgb = Readonly<{ b: number; g: number; r: number }>;

function readThemeVariables(
  source: string,
  blockPattern: RegExp,
  label: string,
): Record<string, string> {
  const match = blockPattern.exec(source);

  if (!match) {
    throw new Error(`Missing ${label} theme block.`);
  }

  const block = match[1];
  if (!block) {
    throw new Error(`Missing ${label} theme declarations.`);
  }

  return Object.fromEntries(
    Array.from(block.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)).map(
      ([, key, value]) => [key, value],
    ),
  );
}

function readToken(
  tokens: Record<string, string>,
  key: string,
  themeName: string,
): string {
  const value = tokens[key];

  if (!value) {
    throw new Error(`${themeName} is missing --${key}.`);
  }

  return value;
}

function rgbFromHex(value: string): Rgb {
  const hex = value.replace("#", "");
  return {
    b: Number.parseInt(hex.slice(4, 6), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    r: Number.parseInt(hex.slice(0, 2), 16),
  };
}

function channelLuminance(value: number): number {
  const ratio = value / 255;
  return ratio <= 0.03928
    ? ratio / 12.92
    : ((ratio + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(color: Rgb): number {
  return (
    0.2126 * channelLuminance(color.r) +
    0.7152 * channelLuminance(color.g) +
    0.0722 * channelLuminance(color.b)
  );
}

function contrastRatio(left: string, right: string): number {
  const leftLuminance = relativeLuminance(rgbFromHex(left));
  const rightLuminance = relativeLuminance(rgbFromHex(right));
  const lighter = Math.max(leftLuminance, rightLuminance);
  const darker = Math.min(leftLuminance, rightLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

function assertContrast(
  actual: number,
  minimum: number,
  label: string,
): void {
  assert.ok(
    actual >= minimum,
    `${label} contrast ${actual.toFixed(2)} is below ${minimum}:1.`,
  );
}

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

  it("keeps public light and dark theme tokens contrast-ready", () => {
    const globals = readFileSync("app/globals.css", "utf8");
    const light = readThemeVariables(
      globals,
      /:root,\s*\[data-theme="light"\]\s*\{([\s\S]*?)\n\}/,
      "light",
    );
    const dark = readThemeVariables(
      globals,
      /\[data-theme="dark"\]\s*\{([\s\S]*?)\n\}/,
      "dark",
    );

    for (const [name, tokens] of [
      ["light", light],
      ["dark", dark],
    ] as const) {
      for (const textToken of ["text-strong", "text-default", "text-muted"]) {
        assertContrast(
          contrastRatio(
            readToken(tokens, textToken, name),
            readToken(tokens, "surface", name),
          ),
          4.5,
          `${name} ${textToken} on surface`,
        );
      }

      assertContrast(
        contrastRatio(
          readToken(tokens, "primary-contrast", name),
          readToken(tokens, "primary", name),
        ),
        4.5,
        `${name} primary button text`,
      );
      assertContrast(
        contrastRatio(
          readToken(tokens, "focus-ring", name),
          readToken(tokens, "surface", name),
        ),
        3,
        `${name} focus ring on surface`,
      );
      assertContrast(
        contrastRatio(
          readToken(tokens, "accent", name),
          readToken(tokens, "surface", name),
        ),
        3,
        `${name} accent on surface`,
      );
    }
  });
});
