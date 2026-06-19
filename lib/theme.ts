/**
 * ============================================================
 * File: lib/theme.ts
 * Project: BizPilot AI
 * Description: Shared UI theme preference helpers.
 * Role: Keeps System, Light, and Dark preference names stable across public, auth, quote, dashboard, and admin shells.
 * Related:
 * - app/layout.tsx
 * - components/ui/theme-preference-control.tsx
 * - components/dashboard/dashboard-theme.tsx
 * Author: MoOoH
 * Created: 2026-06-19
 * Last Updated: 2026-06-19
 * Change Log:
 * - 2026-06-19: Created shared theme constants for the unified responsive foundation.
 * - 2026-06-19: Defaulted fresh or invalid theme preferences to Light and added effective-theme helpers.
 * ============================================================
 */

export type ThemePreference = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export const DEFAULT_THEME_PREFERENCE: ThemePreference = "light";
export const THEME_PREFERENCE_COOKIE = "bizpilot-theme-preference";
export const THEME_PREFERENCE_STORAGE_KEY = "bizpilot-theme-preference";
export const LEGACY_DASHBOARD_THEME_COOKIE = "bizpilot-dashboard-theme";
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
export const THEME_COLOR_BY_RESOLVED: Record<ResolvedTheme, string> = {
  dark: "#08111F",
  light: "#F8FAFC",
};

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

export function readThemePreference(
  value: unknown,
  fallback: ThemePreference = DEFAULT_THEME_PREFERENCE,
): ThemePreference {
  return isThemePreference(value) ? value : fallback;
}

export function readResolvedTheme(value: unknown): ResolvedTheme {
  return value === "dark" ? "dark" : "light";
}

export function resolveEffectiveTheme(
  preference: ThemePreference,
  systemDark: boolean,
): ResolvedTheme {
  if (preference === "system") {
    return systemDark ? "dark" : "light";
  }

  return preference;
}

export function resolveThemeForServer(preference: ThemePreference): ResolvedTheme {
  return resolveEffectiveTheme(preference, false);
}
