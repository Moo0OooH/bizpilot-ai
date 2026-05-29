/**
 * ============================================================
 * File: components/admin/founder-admin-theme.tsx
 * Project: BizPilot AI
 * Description: Founder admin light/dark frame and compact theme selector.
 * Role: Keeps the internal console visually aligned with the owner dashboard theme system.
 * Author: MoOoH
 * Created: 2026-05-27
 * ============================================================
 */

"use client";

import React, { useEffect, useMemo, useState } from "react";

type FounderAdminTheme = "dark" | "light";

const themeCookieName = "bizpilot-dashboard-theme";
const themeMaxAge = 60 * 60 * 24 * 365;

const FounderAdminThemeContext = React.createContext<{
  setTheme: (theme: FounderAdminTheme) => void;
  theme: FounderAdminTheme;
} | null>(null);

function persistTheme(theme: FounderAdminTheme): void {
  document.cookie = `${themeCookieName}=${theme}; path=/; max-age=${themeMaxAge}; samesite=lax`;
  window.localStorage.setItem(themeCookieName, theme);
}

export function FounderAdminThemeFrame({
  children,
  initialTheme = "light",
}: Readonly<{
  children: React.ReactNode;
  initialTheme?: FounderAdminTheme;
}>) {
  const [theme, setThemeState] = useState<FounderAdminTheme>(initialTheme);
  const value = useMemo(
    () => ({
      setTheme: (nextTheme: FounderAdminTheme) => {
        setThemeState(nextTheme);
        persistTheme(nextTheme);
      },
      theme,
    }),
    [theme],
  );

  useEffect(() => {
    persistTheme(initialTheme);
  }, [initialTheme]);

  return (
    <FounderAdminThemeContext.Provider value={value}>
      <main
        className={`biz-founder-admin biz-founder-admin-${theme} min-h-screen overflow-x-clip px-3 py-3 text-[var(--dash-text)] sm:px-5 sm:py-5 lg:px-5 2xl:px-6`}
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
      {(["light", "dark"] as const).map((option) => (
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
          {option === "light" ? "Light" : "Dark"}
        </button>
      ))}
    </div>
  );
}
