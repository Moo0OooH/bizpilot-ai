"use client";

/**
 * ============================================================
 * File: components/dashboard/dashboard-theme.tsx
 * Project: BizPilot AI
 * Description: Hydration-safe dashboard theme provider and selector.
 * Role: Applies protected dashboard theme state and renders the shared theme selector.
 * Related:
 * - components/dashboard/dashboard-shell.tsx
 * - lib/theme.ts
 * Author: MoOoH
 * Created: 2026-05-10
 * Last Updated: 2026-07-21
 * Change Log:
 * - 2026-07-16: Restored the compact desktop sidebar column as the single wide-screen route navigation.
 * - 2026-07-16: Removed the obsolete fixed desktop sidebar column so the centered navigation owns the full protected viewport.
 * - 2026-07-04: Added default dashboard display data attributes for density, guides, and insights.
 * - 2026-07-14: Removed obsolete local density, guide, and insight attributes after dashboard simplification.
 * - 2026-07-21: Applied dashboard-only language direction and normalized structured inputs to Latin LTR values.
 * - 2026-07-21: Normalized dynamically inserted structured inputs even when the input node itself is added directly.
 * ============================================================
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
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  DashboardInterfaceLanguage,
  DashboardInterfaceTextDirection,
} from "@/lib/i18n/dashboard-interface";

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
  direction = "ltr",
  initialTheme = "light",
  language = "en",
  labels = {
    dark: "Dark",
    label: "Dashboard theme",
    light: "Light",
    system: "System",
  },
}: Readonly<{
  children: ReactNode;
  direction?: DashboardInterfaceTextDirection;
  initialTheme?: ThemePreference;
  language?: DashboardInterfaceLanguage;
  labels?: ThemeContextValue["labels"];
}>) {
  const [theme, setThemeState] = useState<ThemePreference>(initialTheme);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>("light");
  const frameRef = useRef<HTMLElement>(null);

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

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const selector = [
      'input[type="date"]',
      'input[type="datetime-local"]',
      'input[type="email"]',
      'input[type="number"]',
      'input[type="tel"]',
      'input[type="time"]',
      'input[type="url"]',
    ].join(",");
    const normalizeInput = (input: HTMLInputElement): void => {
      input.dir = "ltr";
      input.lang = "en-CA";
      input.dataset.dashboardStructured = "true";
    };
    const normalize = (root: ParentNode): void => {
      if (root instanceof HTMLInputElement && root.matches(selector)) {
        normalizeInput(root);
      }
      root
        .querySelectorAll<HTMLInputElement>(selector)
        .forEach(normalizeInput);
    };

    normalize(frame);
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) normalize(node);
        });
      }
    });
    observer.observe(frame, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [direction, language]);

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
        className={`${themeClass} dashboard-frame h-svh min-w-0 overflow-hidden transition-colors lg:grid lg:grid-cols-[240px_minmax(0,1fr)] ${
          direction === "rtl" ? "dashboard-frame--rtl" : ""
        }`}
        data-dashboard-frame
        dir={direction}
        lang={language}
        ref={frameRef}
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
