"use client";

/**
 * ============================================================
 * File: components/dashboard/dashboard-display-preferences.tsx
 * Project: BizPilot AI
 * Description: Local dashboard display preference provider and controls.
 * Role: Lets owners adjust density, optional guide panels, and insight panels without changing workspace data.
 * Related:
 * - components/dashboard/dashboard-shell.tsx
 * - app/(dashboard)/dashboard/settings/page.tsx
 * - app/globals.css
 * Author: MoOoH
 * Created: 2026-07-04
 * Last Updated: 2026-07-04
 * Change Log:
 * - 2026-07-04: Created local-only display controls for dashboard density, guide panels, and insight panels.
 * - 2026-07-04: Reapplied preferences after protected-route navigation and made localStorage persistence fail-safe.
 * ============================================================
 */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

import { buttonClass } from "./dashboard-ui";
import type { BizPilotCopy } from "@/lib/i18n/bizpilot-copy";

export const DASHBOARD_DISPLAY_PREFERENCES_STORAGE_KEY =
  "bizpilot-dashboard-display-preferences";

type DashboardDensity = "compact" | "comfortable" | "spacious";
type DashboardGuideMode = "expanded" | "minimal" | "standard";
type DashboardInsightMode = "hidden" | "standard";

type DashboardDisplayPreferences = Readonly<{
  density: DashboardDensity;
  guideMode: DashboardGuideMode;
  insightMode: DashboardInsightMode;
}>;

type DashboardDisplayPreferenceKey = keyof DashboardDisplayPreferences;

type DashboardDisplayPreferencesContextValue = Readonly<{
  preferences: DashboardDisplayPreferences;
  resetPreferences: () => void;
  setPreference: <Key extends DashboardDisplayPreferenceKey>(
    key: Key,
    value: DashboardDisplayPreferences[Key],
  ) => void;
}>;

type DashboardDisplayPreferencesCopy =
  BizPilotCopy["dashboard"]["settings"]["displayPreferences"];

const defaultDisplayPreferences: DashboardDisplayPreferences = {
  density: "compact",
  guideMode: "standard",
  insightMode: "standard",
};

const DashboardDisplayPreferencesContext =
  createContext<DashboardDisplayPreferencesContextValue | null>(null);

function isDashboardDensity(value: unknown): value is DashboardDensity {
  return value === "compact" || value === "comfortable" || value === "spacious";
}

function isDashboardGuideMode(value: unknown): value is DashboardGuideMode {
  return value === "expanded" || value === "minimal" || value === "standard";
}

function isDashboardInsightMode(value: unknown): value is DashboardInsightMode {
  return value === "hidden" || value === "standard";
}

function normalizeDisplayPreferences(
  value: unknown,
): DashboardDisplayPreferences {
  if (!value || typeof value !== "object") {
    return defaultDisplayPreferences;
  }

  const candidate = value as Partial<Record<DashboardDisplayPreferenceKey, unknown>>;

  return {
    density: isDashboardDensity(candidate.density)
      ? candidate.density
      : defaultDisplayPreferences.density,
    guideMode: isDashboardGuideMode(candidate.guideMode)
      ? candidate.guideMode
      : defaultDisplayPreferences.guideMode,
    insightMode: isDashboardInsightMode(candidate.insightMode)
      ? candidate.insightMode
      : defaultDisplayPreferences.insightMode,
  };
}

function readDisplayPreferences(): DashboardDisplayPreferences {
  try {
    const stored = window.localStorage.getItem(
      DASHBOARD_DISPLAY_PREFERENCES_STORAGE_KEY,
    );

    return stored
      ? normalizeDisplayPreferences(JSON.parse(stored))
      : defaultDisplayPreferences;
  } catch {
    return defaultDisplayPreferences;
  }
}

function applyDisplayPreferences(preferences: DashboardDisplayPreferences) {
  document.documentElement.dataset.dashboardDensity = preferences.density;
  document.documentElement.dataset.dashboardGuides = preferences.guideMode;
  document.documentElement.dataset.dashboardInsights = preferences.insightMode;

  document.querySelectorAll<HTMLElement>(".dashboard-frame").forEach((frame) => {
    frame.dataset.dashboardDensity = preferences.density;
    frame.dataset.dashboardGuides = preferences.guideMode;
    frame.dataset.dashboardInsights = preferences.insightMode;
  });

  document
    .querySelectorAll<HTMLDetailsElement>("[data-dashboard-optional-guide]")
    .forEach((details) => {
      if (preferences.guideMode === "expanded") {
        details.open = true;
      }

      if (preferences.guideMode === "minimal") {
        details.open = false;
      }
    });
}

function persistDisplayPreferences(preferences: DashboardDisplayPreferences) {
  try {
    window.localStorage.setItem(
      DASHBOARD_DISPLAY_PREFERENCES_STORAGE_KEY,
      JSON.stringify(preferences),
    );
  } catch {
    // Local-only visual preferences are optional; storage failures must not break the dashboard.
  }
}

function useDashboardDisplayPreferences() {
  const context = useContext(DashboardDisplayPreferencesContext);

  if (!context) {
    throw new Error(
      "Dashboard display preferences must be used inside DashboardDisplayPreferencesFrame.",
    );
  }

  return context;
}

export function DashboardDisplayPreferencesFrame({
  children,
}: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const [preferences, setPreferences] = useState<DashboardDisplayPreferences>(() =>
    typeof window === "undefined"
      ? defaultDisplayPreferences
      : readDisplayPreferences(),
  );

  useEffect(() => {
    applyDisplayPreferences(preferences);
    if (typeof window !== "undefined") {
      persistDisplayPreferences(preferences);
    }
  }, [pathname, preferences]);

  const value = useMemo<DashboardDisplayPreferencesContextValue>(
    () => ({
      preferences,
      resetPreferences: () => setPreferences(defaultDisplayPreferences),
      setPreference: (key, nextValue) =>
        setPreferences((current) => ({
          ...current,
          [key]: nextValue,
        })),
    }),
    [preferences],
  );

  return (
    <DashboardDisplayPreferencesContext.Provider value={value}>
      {children}
    </DashboardDisplayPreferencesContext.Provider>
  );
}

function optionButtonClass(active: boolean): string {
  return active
    ? "min-h-10 rounded-lg border border-[var(--dash-primary)] bg-[var(--dash-primary-soft)] px-3 py-2 text-left text-[12px] font-black text-[var(--dash-text)] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--dash-bg)]"
    : "min-h-10 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-2 text-left text-[12px] font-bold text-[var(--dash-text-secondary)] transition hover:border-[var(--dash-primary)] hover:bg-[var(--dash-primary-soft)] hover:text-[var(--dash-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--dash-bg)]";
}

function PreferenceButton({
  active,
  children,
  onClick,
}: Readonly<{
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}>) {
  return (
    <button
      aria-pressed={active}
      className={optionButtonClass(active)}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export function DashboardDisplayPreferencesControl({
  copy,
}: Readonly<{
  copy: DashboardDisplayPreferencesCopy;
}>) {
  const { preferences, resetPreferences, setPreference } =
    useDashboardDisplayPreferences();

  return (
    <div className="grid gap-4" id="display-preferences">
      <div>
        <h2 className="text-[15px] font-black text-[var(--dash-text)]">
          {copy.title}
        </h2>
        <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
          {copy.description}
        </p>
      </div>

      <div className="grid gap-3 xl:grid-cols-3">
        <fieldset className="grid gap-2">
          <legend className="text-[11px] font-black uppercase tracking-[0.12em] text-[var(--dash-text-muted)]">
            {copy.densityLabel}
          </legend>
          {(["compact", "comfortable", "spacious"] as const).map((option) => (
            <PreferenceButton
              active={preferences.density === option}
              key={option}
              onClick={() => setPreference("density", option)}
            >
              {copy.densityOptions[option]}
            </PreferenceButton>
          ))}
        </fieldset>

        <fieldset className="grid gap-2">
          <legend className="text-[11px] font-black uppercase tracking-[0.12em] text-[var(--dash-text-muted)]">
            {copy.guideLabel}
          </legend>
          {(["standard", "minimal", "expanded"] as const).map((option) => (
            <PreferenceButton
              active={preferences.guideMode === option}
              key={option}
              onClick={() => setPreference("guideMode", option)}
            >
              {copy.guideOptions[option]}
            </PreferenceButton>
          ))}
        </fieldset>

        <fieldset className="grid gap-2">
          <legend className="text-[11px] font-black uppercase tracking-[0.12em] text-[var(--dash-text-muted)]">
            {copy.insightLabel}
          </legend>
          {(["standard", "hidden"] as const).map((option) => (
            <PreferenceButton
              active={preferences.insightMode === option}
              key={option}
              onClick={() => setPreference("insightMode", option)}
            >
              {copy.insightOptions[option]}
            </PreferenceButton>
          ))}
        </fieldset>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
        <p className="text-[12px] leading-5 text-[var(--dash-text-secondary)]">
          {copy.localOnly}
        </p>
        <button className={buttonClass} onClick={resetPreferences} type="button">
          {copy.reset}
        </button>
      </div>
    </div>
  );
}
