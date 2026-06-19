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
 * ============================================================
 */

export type ThemePreference = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export const THEME_PREFERENCE_COOKIE = "bizpilot-theme-preference";
export const THEME_PREFERENCE_STORAGE_KEY = "bizpilot-theme-preference";
export const LEGACY_DASHBOARD_THEME_COOKIE = "bizpilot-dashboard-theme";
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function readThemePreference(value: unknown): ThemePreference {
  return value === "light" || value === "dark" || value === "system"
    ? value
    : "system";
}

export function resolveThemeForServer(preference: ThemePreference): ResolvedTheme {
  return preference === "dark" ? "dark" : "light";
}
