/**
 * ============================================================
 * File: components/admin/founder-admin-theme.tsx
 * Project: BizPilot AI
 * Description: Founder admin light/dark frame and compact theme selector.
 * Role: Keeps the internal console visually aligned with the shared owner dashboard theme system.
 * Author: MoOoH
 * Created: 2026-05-27
 * Last Updated: 2026-06-19
 * Change Log:
 * - 2026-06-18: Switched the admin frame to svh for safer short-height scrolling.
 * - 2026-06-19: Added System theme preference support using the shared theme cookie.
 * ============================================================
 */

"use client";

import React, { useEffect, useMemo, useState } from "react";

import {
  LEGACY_DASHBOARD_THEME_COOKIE,
  THEME_COOKIE_MAX_AGE,
  THEME_PREFERENCE_COOKIE,
  THEME_PREFERENCE_STORAGE_KEY,
  type ResolvedTheme,
  type ThemePreference,
} from "@/lib/theme";

type FounderAdminTheme = ThemePreference;

const FounderAdminThemeContext = React.createContext<{
  setTheme: (theme: FounderAdminTheme) => void;
  theme: FounderAdminTheme;
} | null>(null);

function resolveSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function persistTheme(theme: FounderAdminTheme): ResolvedTheme {
  const effectiveTheme = theme === "system" ? resolveSystemTheme() : theme;

  document.cookie = `${THEME_PREFERENCE_COOKIE}=${theme}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; samesite=lax`;
  document.cookie = `${LEGACY_DASHBOARD_THEME_COOKIE}=${theme}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; samesite=lax`;
  window.localStorage.setItem(THEME_PREFERENCE_STORAGE_KEY, theme);
  document.documentElement.dataset.themePreference = theme;
  document.documentElement.dataset.theme = effectiveTheme;
  document.documentElement.style.colorScheme = effectiveTheme;

  return effectiveTheme;
}

export function FounderAdminThemeFrame({
  children,
  initialTheme = "light",
}: Readonly<{
  children: React.ReactNode;
  initialTheme?: FounderAdminTheme;
}>) {
  const [theme, setThemeState] = useState<FounderAdminTheme>(initialTheme);
  const [effectiveTheme, setEffectiveTheme] = useState<ResolvedTheme>(
    initialTheme === "dark" ? "dark" : "light",
  );
  const value = useMemo(
    () => ({
      setTheme: (nextTheme: FounderAdminTheme) => {
        setThemeState(nextTheme);
        setEffectiveTheme(persistTheme(nextTheme));
      },
      theme,
    }),
    [theme],
  );

  useEffect(() => {
    persistTheme(initialTheme);
  }, [initialTheme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    function updateSystemTheme() {
      if (theme === "system") {
        setEffectiveTheme(media.matches ? "dark" : "light");
      }
    }

    updateSystemTheme();
    media.addEventListener("change", updateSystemTheme);

    return () => {
      media.removeEventListener("change", updateSystemTheme);
    };
  }, [theme]);

  return (
    <FounderAdminThemeContext.Provider value={value}>
      <main
        className={`biz-founder-admin biz-founder-admin-${effectiveTheme} min-h-svh overflow-x-clip px-3 py-3 text-[var(--dash-text)] sm:px-5 sm:py-5 lg:px-5 2xl:px-6`}
      >
        {children}
      </main>
    </FounderAdminThemeContext.Provider>
  );
}

export function FounderAdminThemeSelector() {
  const context = React.useContext(FounderAdminThemeContext);

  if (!context) {
    return null;
  }

  return (
    <div
      aria-label="Founder admin theme"
      className="inline-flex rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-1"
    >
      {(["system", "light", "dark"] as const).map((option) => (
        <button
          aria-pressed={context.theme === option}
          className={
            context.theme === option
              ? "rounded-md bg-[var(--dash-surface)] px-3 py-1.5 text-[12px] font-black text-[var(--dash-text)] shadow-sm"
              : "rounded-md px-3 py-1.5 text-[12px] font-black text-[var(--dash-text-muted)] transition hover:text-[var(--dash-text)]"
          }
          key={option}
          onClick={() => context.setTheme(option)}
          type="button"
        >
          {option === "system" ? "System" : option === "light" ? "Light" : "Dark"}
        </button>
      ))}
    </div>
  );
}
