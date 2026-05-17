"use client";

/**
 * ============================================================
 * File: components/dashboard/dashboard-theme.tsx
 * Project: BizPilot AI
 * Description: Provides owner-selectable dashboard light/dark theme state.
 * Role: Wraps the protected dashboard shell and exposes a compact theme selector.
 * Related:
 * - components/dashboard/dashboard-shell.tsx
 * - components/dashboard/dashboard-topbar.tsx
 * - app/globals.css
 * Author: MoOoH
 * Created: 2026-05-17
 * Last Updated: 2026-05-17
 * Change Log:
 * - 2026-05-17: Created persisted dark/light dashboard theme controls.
 * ============================================================
 */

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type DashboardTheme = "dark" | "light";

type DashboardThemeContextValue = Readonly<{
  setTheme: (theme: DashboardTheme) => void;
  theme: DashboardTheme;
}>;

const storageKey = "bizpilot-dashboard-theme";
const DashboardThemeContext = createContext<DashboardThemeContextValue | null>(
  null,
);

function readStoredTheme(): DashboardTheme {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.localStorage.getItem(storageKey) === "light" ? "light" : "dark";
}

function useDashboardTheme(): DashboardThemeContextValue {
  const value = useContext(DashboardThemeContext);

  if (!value) {
    throw new Error("DashboardThemeSelector must be used inside DashboardThemeFrame.");
  }

  return value;
}

export function DashboardThemeFrame({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [theme, setThemeState] = useState<DashboardTheme>(() => readStoredTheme());

  const value = useMemo<DashboardThemeContextValue>(
    () => ({
      setTheme: (nextTheme) => {
        setThemeState(nextTheme);
        window.localStorage.setItem(storageKey, nextTheme);
      },
      theme,
    }),
    [theme],
  );
  const themeClass = theme === "dark" ? "biz-dashboard-dark" : "biz-dashboard-light";

  return (
    <DashboardThemeContext.Provider value={value}>
      <main
        className={`${themeClass} min-h-screen text-slate-950 transition-colors lg:grid lg:grid-cols-[240px_minmax(0,1fr)]`}
      >
        {children}
      </main>
    </DashboardThemeContext.Provider>
  );
}

export function DashboardThemeSelector() {
  const { setTheme, theme } = useDashboardTheme();

  return (
    <div
      aria-label="Dashboard theme"
      className="hidden h-9 rounded-[9px] border border-slate-200 bg-white p-1 text-xs font-medium shadow-sm sm:inline-flex"
      role="group"
    >
      {(["light", "dark"] as const).map((option) => (
        <button
          aria-pressed={theme === option}
          className={
            theme === option
              ? "rounded-md bg-emerald-600 px-2.5 text-white"
              : "rounded-md px-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
          }
          key={option}
          onClick={() => setTheme(option)}
          type="button"
        >
          {option === "light" ? "Light" : "Dark"}
        </button>
      ))}
    </div>
  );
}
