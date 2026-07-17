/**
 * ============================================================
 * File: lib/public-brand-theme.ts
 * Project: BizPilot AI
 * Description: Shared safe color and logo helpers for branded public quote surfaces.
 * Role: Keeps dashboard previews, public intake, and success pages visually consistent while deriving WCAG-readable foregrounds.
 * Related:
 * - components/dashboard/branding-editor.tsx
 * - app/(public)/quote/[slug]/page.tsx
 * - app/(public)/quote/[slug]/success/page.tsx
 * Author: MoOoH
 * Created: 2026-07-16
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Created shared brand tokens, contrast calculations, hover derivation, and bounded logo validation.
 * ============================================================
 */

import type { CSSProperties } from "react";

export type PublicBrandingInput = Readonly<{
  accent_color?: string | null;
  logo_url?: string | null;
  primary_color?: string | null;
}> | null;

export type PublicBrandPalette = Readonly<{
  accent: string;
  focus: string;
  onPrimary: "#000000" | "#ffffff";
  primary: string;
  primaryHover: string;
  primaryText: string;
}>;

export const DEFAULT_PUBLIC_PRIMARY = "#3f5cff";
export const DEFAULT_PUBLIC_ACCENT = "#0f8f83";

const safeHexColorPattern = /^#[0-9a-fA-F]{6}$/;
const safeLogoDataPattern =
  /^data:image\/(?:jpeg|png|webp);base64,[a-zA-Z0-9+/=]+$/;

export function normalizeBrandHex(value: string | null | undefined, fallback: string): string {
  return safeHexColorPattern.test(value ?? "")
    ? (value as string).toLowerCase()
    : fallback.toLowerCase();
}

function linearChannel(channel: number): number {
  const normalized = channel / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hexColor: string): number {
  const safeColor = normalizeBrandHex(hexColor, "#000000");
  const red = linearChannel(Number.parseInt(safeColor.slice(1, 3), 16));
  const green = linearChannel(Number.parseInt(safeColor.slice(3, 5), 16));
  const blue = linearChannel(Number.parseInt(safeColor.slice(5, 7), 16));
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function contrastRatio(first: string, second: string): number {
  const lighter = Math.max(relativeLuminance(first), relativeLuminance(second));
  const darker = Math.min(relativeLuminance(first), relativeLuminance(second));
  return (lighter + 0.05) / (darker + 0.05);
}

export function readableBrandForeground(
  background: string,
): "#000000" | "#ffffff" {
  return contrastRatio(background, "#000000") >=
    contrastRatio(background, "#ffffff")
    ? "#000000"
    : "#ffffff";
}

function mixHex(color: string, target: "#000000" | "#ffffff", amount: number): string {
  const source = normalizeBrandHex(color, DEFAULT_PUBLIC_PRIMARY);
  const mixed = [1, 3, 5].map((start) => {
    const from = Number.parseInt(source.slice(start, start + 2), 16);
    const to = Number.parseInt(target.slice(start, start + 2), 16);
    return Math.round(from + (to - from) * amount)
      .toString(16)
      .padStart(2, "0");
  });
  return `#${mixed.join("")}`;
}

function contrastSafeAgainstWhite(color: string, minimumRatio: number): string {
  let candidate = normalizeBrandHex(color, DEFAULT_PUBLIC_ACCENT);

  for (let attempt = 0; attempt < 12; attempt += 1) {
    if (contrastRatio(candidate, "#ffffff") >= minimumRatio) return candidate;
    candidate = mixHex(candidate, "#000000", 0.14);
  }

  return "#334155";
}

export function getPublicBrandPalette(
  branding: PublicBrandingInput,
): PublicBrandPalette {
  const primary = normalizeBrandHex(
    branding?.primary_color,
    DEFAULT_PUBLIC_PRIMARY,
  );
  const accent = normalizeBrandHex(
    branding?.accent_color,
    DEFAULT_PUBLIC_ACCENT,
  );
  const onPrimary = readableBrandForeground(primary);
  const primaryHover = mixHex(
    primary,
    onPrimary === "#ffffff" ? "#000000" : "#ffffff",
    0.13,
  );

  return {
    accent,
    focus: contrastSafeAgainstWhite(accent, 3),
    onPrimary,
    primary,
    primaryHover,
    primaryText: contrastSafeAgainstWhite(primary, 4.5),
  };
}

export function getPublicBrandStyle(
  branding: PublicBrandingInput,
): CSSProperties {
  const palette = getPublicBrandPalette(branding);

  return {
    "--accent": palette.accent,
    "--brand-accent": palette.accent,
    "--brand-focus": palette.focus,
    "--brand-on-primary": palette.onPrimary,
    "--brand-primary": palette.primary,
    "--brand-primary-hover": palette.primaryHover,
    "--brand-primary-text": palette.primaryText,
    "--focus-ring": palette.focus,
    "--link": palette.focus,
    "--primary": palette.primary,
    "--primary-contrast": palette.onPrimary,
    "--primary-hover": palette.primaryHover,
  } as CSSProperties;
}

export function isSafePublicLogoSource(
  value: string | null | undefined,
): value is string {
  if (!value) return false;
  if (value.length <= 360_000 && safeLogoDataPattern.test(value)) return true;

  try {
    return value.length <= 2_048 && new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}
