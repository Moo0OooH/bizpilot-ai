"use client";

/**
 * File: components/dashboard/dashboard-theme.tsx
 * Project: BizPilot AI
 * Role: Hydration-safe dashboard theme provider and System/Light/Dark selector.
 * Last Updated: 2026-06-27
 */

import {
  LEGACY_DASHBOARD_THEME_COOKIE,
  THEME_COOKIE_MAX_AGE,
  THEME_PREFERENCE_COOKIE,
  THEME_PREFERENCE_STORAGE_KEY,
  type ResolvedTheme,
  type ThemePreference,
} from "@/lib/theme";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ThemeContextValue = Readonly<{
  labels: {
    dark: string;
    label: string;
    light: string;
    system: string;
  };
  effectiveTheme: ResolvedTheme;
  setTheme: (nextTheme: ThemePreference) => void;
  theme: ThemePreference;
}>;

export const DASHBOARD_THEME_COOKIE = THEME_PREFERENCE_COOKIE;

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function persistTheme(nextTheme: ThemePreference): ResolvedTheme {
  const effectiveTheme =
    nextTheme === "system" ? resolveSystemTheme() : nextTheme;

  document.cookie = `${THEME_PREFERENCE_COOKIE}=${nextTheme}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; samesite=lax`;
  document.cookie = `${LEGACY_DASHBOARD_THEME_COOKIE}=${nextTheme}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; samesite=lax`;
  window.localStorage.setItem(THEME_PREFERENCE_STORAGE_KEY, nextTheme);
  document.documentElement.dataset.themePreference = nextTheme;
  document.documentElement.dataset.theme = effectiveTheme;
  document.documentElement.style.colorScheme = effectiveTheme;

  return effectiveTheme;
}

export function DashboardThemeFrame({
  children,
  initialTheme = "light",
  labels = {
    dark: "Dark",
    label: "Dashboard theme",
    light: "Light",
    system: "System",
  },
}: Readonly<{
  children: ReactNode;
  initialTheme?: ThemePreference;
  labels?: ThemeContextValue["labels"];
}>) {
  const [theme, setThemeState] = useState<ThemePreference>(initialTheme);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>("light");

  useEffect(() => {
    persistTheme(initialTheme);
  }, [initialTheme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    function updateSystemTheme() {
      setSystemTheme(media.matches ? "dark" : "light");
    }

    updateSystemTheme();
    media.addEventListener("change", updateSystemTheme);

    return () => {
      media.removeEventListener("change", updateSystemTheme);
    };
  }, []);

  const effectiveTheme = theme === "system" ? systemTheme : theme;

  const value = useMemo<ThemeContextValue>(
    () => ({
      effectiveTheme,
      labels,
      setTheme: (nextTheme) => {
        setThemeState(nextTheme);
        setSystemTheme(persistTheme(nextTheme));
      },
      theme,
    }),
    [effectiveTheme, labels, theme],
  );

  const themeClass =
    effectiveTheme === "dark" ? "biz-dashboard-dark" : "biz-dashboard-light";

  return (
    <ThemeContext.Provider value={value}>
      <main
        className={`${themeClass} dashboard-frame min-h-svh min-w-0 transition-colors lg:grid lg:grid-cols-[224px_minmax(0,1fr)]`}
      >
        {children}
      </main>
    </ThemeContext.Provider>
  );
}

export function DashboardThemeSelector() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("DashboardThemeSelector must be used inside DashboardThemeFrame.");
  }

  const { labels, setTheme, theme } = context;

  return (
    <div
      aria-label={labels.label}
      className="inline-flex min-h-10 rounded-lg border border-[var(--dash-border-strong)] bg-[var(--dash-surface-elevated)] p-1 text-xs font-semibold shadow-sm"
      role="group"
    >
      {(["system", "light", "dark"] as const).map((option) => (
          <button
            aria-pressed={theme === option}
            className={
              theme === option
                ? "min-h-8 whitespace-nowrap rounded-md bg-[var(--dash-primary)] px-2.5 text-white"
                : "min-h-8 whitespace-nowrap rounded-md px-2.5 text-[var(--dash-text-secondary)] transition hover:bg-[var(--dash-surface-muted)] hover:text-[var(--dash-text)]"
            }
            key={option}
            onClick={() => setTheme(option)}
          type="button"
        >
          {option === "system"
            ? labels.system
            : option === "light"
              ? labels.light
              : labels.dark}
        </button>
      ))}
    </div>
  );
}
