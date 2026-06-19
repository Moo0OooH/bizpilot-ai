"use client";

/**
 * ============================================================
 * File: components/ui/theme-preference-control.tsx
 * Project: BizPilot AI
 * Description: Shared System/Light/Dark theme preference selector.
 * Role: Lets public, auth, and app shells persist one theme preference without changing product logic.
 * Related:
 * - lib/theme.ts
 * - app/layout.tsx
 * - components/public/marketing-ui.tsx
 * - components/auth/auth-ui.tsx
 * Author: MoOoH
 * Created: 2026-06-19
 * Last Updated: 2026-06-19
 * Change Log:
 * - 2026-06-19: Added accessible shared theme selector for the unified theme foundation.
 * ============================================================
 */

import { useEffect, useState } from "react";

import {
  LEGACY_DASHBOARD_THEME_COOKIE,
  THEME_COOKIE_MAX_AGE,
  THEME_PREFERENCE_COOKIE,
  THEME_PREFERENCE_STORAGE_KEY,
  type ResolvedTheme,
  type ThemePreference,
  readThemePreference,
} from "@/lib/theme";

type ThemeLabels = Readonly<{
  dark: string;
  label: string;
  light: string;
  system: string;
}>;

const englishThemeLabels: ThemeLabels = {
  dark: "Dark",
  label: "Theme preference",
  light: "Light",
  system: "System",
};

const labelsByLanguage: Record<string, ThemeLabels> = {
  en: englishThemeLabels,
  "fr-CA": {
    dark: "Sombre",
    label: "Préférence de thème",
    light: "Clair",
    system: "Système",
  },
};

function resolveSystemTheme(): ResolvedTheme {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
}

export function applyThemePreference(preference: ThemePreference): void {
  const resolved = preference === "system" ? resolveSystemTheme() : preference;
  const root = document.documentElement;

  root.dataset.themePreference = preference;
  root.dataset.theme = resolved;
  root.style.colorScheme = resolved;

  document.cookie = `${THEME_PREFERENCE_COOKIE}=${preference}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; samesite=lax`;
  document.cookie = `${LEGACY_DASHBOARD_THEME_COOKIE}=${preference}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; samesite=lax`;
  window.localStorage.setItem(THEME_PREFERENCE_STORAGE_KEY, preference);
}

export function ThemePreferenceControl({
  className = "",
  language = "en",
  labels,
}: Readonly<{
  className?: string;
  language?: string;
  labels?: ThemeLabels;
}>) {
  const text = labels ?? labelsByLanguage[language] ?? englishThemeLabels;
  const [preference, setPreference] = useState<ThemePreference>(() => {
    if (typeof document === "undefined" || typeof window === "undefined") {
      return "system";
    }

    const rootPreference = readThemePreference(
      document.documentElement.dataset.themePreference,
    );
    const stored = window.localStorage.getItem(THEME_PREFERENCE_STORAGE_KEY);

    return stored === null ? rootPreference : readThemePreference(stored);
  });

  useEffect(() => {
    applyThemePreference(preference);
  }, [preference]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    function handleSystemChange() {
      if (readThemePreference(document.documentElement.dataset.themePreference) === "system") {
        applyThemePreference("system");
      }
    }

    media.addEventListener("change", handleSystemChange);

    return () => {
      media.removeEventListener("change", handleSystemChange);
    };
  }, []);

  return (
    <div
      aria-label={text.label}
      className={`inline-flex min-h-11 items-center rounded-[12px] border p-1 text-[11px] font-black shadow-sm ${className}`}
      role="group"
      style={{
        backgroundColor: "var(--surface-elevated)",
        borderColor: "var(--border-default)",
        color: "var(--text-default)",
      }}
    >
      {(["system", "light", "dark"] as const).map((option) => (
        <button
          aria-pressed={preference === option}
          className="min-h-9 rounded-[9px] px-2.5 transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
          key={option}
          onClick={() => {
            setPreference(option);
            applyThemePreference(option);
          }}
          style={{
            backgroundColor:
              preference === option ? "var(--primary)" : "transparent",
            color:
              preference === option ? "var(--primary-contrast)" : "var(--text-default)",
          }}
          type="button"
        >
          {text[option]}
        </button>
      ))}
    </div>
  );
}
