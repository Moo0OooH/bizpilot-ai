"use client";

/**
 * File: components/dashboard/dashboard-theme.tsx
 * Project: BizPilot AI
 * Role: Hydration-safe dashboard theme provider and selector.
 * Last Updated: 2026-05-18
 */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type DashboardTheme = "dark" | "light";
type ThemeContextValue = Readonly<{
  labels: {
    dark: string;
    label: string;
    light: string;
  };
  setTheme: (nextTheme: DashboardTheme) => void;
  theme: DashboardTheme;
}>;

export const DASHBOARD_THEME_COOKIE = "bizpilot-dashboard-theme";
const STORAGE_KEY = "bizpilot-dashboard-theme";
const MAX_AGE = 60 * 60 * 24 * 365;

const ThemeContext = createContext<ThemeContextValue | null>(null);

function persistTheme(nextTheme: DashboardTheme): void {
  document.cookie = `${DASHBOARD_THEME_COOKIE}=${nextTheme}; path=/; max-age=${MAX_AGE}; samesite=lax`;
  window.localStorage.setItem(STORAGE_KEY, nextTheme);
}

export function DashboardThemeFrame({
  children,
  initialTheme = "light",
  labels = {
    dark: "Dark",
    label: "Dashboard theme",
    light: "Light",
  },
}: Readonly<{
  children: ReactNode;
  initialTheme?: DashboardTheme;
  labels?: ThemeContextValue["labels"];
}>) {
  const [theme, setThemeState] = useState<DashboardTheme>(initialTheme);

  useEffect(() => {
    persistTheme(initialTheme);
  }, [initialTheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      labels,
      setTheme: (nextTheme) => {
        setThemeState(nextTheme);
        persistTheme(nextTheme);
      },
      theme,
    }),
    [labels, theme],
  );

  const themeClass = theme === "dark" ? "biz-dashboard-dark" : "biz-dashboard-light";

  return (
    <ThemeContext.Provider value={value}>
      <main
        className={`${themeClass} dashboard-frame min-h-screen min-w-0 overflow-x-hidden transition-colors lg:grid lg:h-screen lg:grid-cols-[224px_minmax(0,1fr)] lg:overflow-hidden`}
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
      className="inline-flex h-9 rounded-lg border border-[var(--dash-border-strong)] bg-[var(--dash-surface-elevated)] p-1 text-xs font-semibold shadow-sm"
      role="group"
    >
      {(["light", "dark"] as const).map((option) => (
        <button
          aria-pressed={theme === option}
          className={
            theme === option
              ? "rounded-md bg-[var(--dash-primary)] px-2.5 text-white"
              : "rounded-md px-2.5 text-[var(--dash-text-secondary)] transition hover:bg-[var(--dash-surface-muted)] hover:text-[var(--dash-text)]"
          }
          key={option}
          onClick={() => setTheme(option)}
          type="button"
        >
          {option === "light" ? labels.light : labels.dark}
        </button>
      ))}
    </div>
  );
}
