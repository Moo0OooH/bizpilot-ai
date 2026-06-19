"use client";

/**
 * ============================================================
 * File: components/ui/theme-preference-control.tsx
 * Project: BizPilot AI
 * Description: Shared compact Light/Dark/System theme preference menu.
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
 * - 2026-06-19: Rebuilt the selector as a compact sun/moon menu and defaulted fresh sessions to Light.
 * ============================================================
 */

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import {
  DEFAULT_THEME_PREFERENCE,
  LEGACY_DASHBOARD_THEME_COOKIE,
  THEME_COLOR_BY_RESOLVED,
  THEME_COOKIE_MAX_AGE,
  THEME_PREFERENCE_COOKIE,
  THEME_PREFERENCE_STORAGE_KEY,
  type ResolvedTheme,
  type ThemePreference,
  readResolvedTheme,
  readThemePreference,
  resolveEffectiveTheme,
} from "@/lib/theme";

type ThemeLabels = Readonly<{
  change: string;
  dark: string;
  label: string;
  light: string;
  selected: string;
  system: string;
}>;

const englishThemeLabels: ThemeLabels = {
  change: "Change theme",
  dark: "Dark",
  label: "Theme",
  light: "Light",
  selected: "Selected",
  system: "Use device setting",
};

const labelsByLanguage: Record<string, ThemeLabels> = {
  en: englishThemeLabels,
  "fr-CA": {
    change: "Modifier le thème",
    dark: "Sombre",
    label: "Thème",
    light: "Clair",
    selected: "Sélectionné",
    system: "Utiliser le réglage de l'appareil",
  },
};

const themeOptions: readonly ThemePreference[] = ["light", "dark", "system"];

function ThemeIcon({
  name,
}: Readonly<{
  name: "device" | "moon" | "sun";
}>) {
  if (name === "sun") {
    return (
      <svg
        aria-hidden="true"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 3v2.25M12 18.75V21M4.64 4.64l1.6 1.6M17.76 17.76l1.6 1.6M3 12h2.25M18.75 12H21M4.64 19.36l1.6-1.6M17.76 6.24l1.6-1.6"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <path
          d="M12 15.75A3.75 3.75 0 1 0 12 8.25a3.75 3.75 0 0 0 0 7.5Z"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    );
  }

  if (name === "moon") {
    return (
      <svg
        aria-hidden="true"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M20.25 14.5A7.72 7.72 0 0 1 9.5 3.75 8.25 8.25 0 1 0 20.25 14.5Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M4.5 5.5h15A1.5 1.5 0 0 1 21 7v8.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 15.5V7a1.5 1.5 0 0 1 1.5-1.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M9 20h6M12 17v3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function iconForPreference(preference: ThemePreference): "device" | "moon" | "sun" {
  if (preference === "system") {
    return "device";
  }

  return preference === "dark" ? "moon" : "sun";
}

function resolveSystemTheme(): ResolvedTheme {
  return resolveEffectiveTheme(
    "system",
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
}

function updateThemeColorMeta(resolved: ResolvedTheme): void {
  const color = THEME_COLOR_BY_RESOLVED[resolved];
  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }

  meta.content = color;
}

export function applyThemePreference(preference: ThemePreference): ResolvedTheme {
  const resolved = preference === "system" ? resolveSystemTheme() : preference;
  const root = document.documentElement;

  root.dataset.themePreference = preference;
  root.dataset.theme = resolved;
  root.style.colorScheme = resolved;
  updateThemeColorMeta(resolved);

  document.cookie = `${THEME_PREFERENCE_COOKIE}=${preference}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; samesite=lax`;
  document.cookie = `${LEGACY_DASHBOARD_THEME_COOKIE}=${preference}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; samesite=lax`;

  try {
    window.localStorage.setItem(THEME_PREFERENCE_STORAGE_KEY, preference);
  } catch {
    // Cookie persistence still keeps the preference across ordinary reloads.
  }

  return resolved;
}

function readInitialPreference(): ThemePreference {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return DEFAULT_THEME_PREFERENCE;
  }

  const rootPreference = readThemePreference(
    document.documentElement.dataset.themePreference,
  );
  let stored: string | null = null;

  try {
    stored = window.localStorage.getItem(THEME_PREFERENCE_STORAGE_KEY);
  } catch {
    stored = null;
  }

  return stored === null
    ? rootPreference
    : readThemePreference(stored, rootPreference);
}

function readInitialResolvedTheme(): ResolvedTheme {
  if (typeof document === "undefined") {
    return "light";
  }

  return readResolvedTheme(document.documentElement.dataset.theme);
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
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [preference, setPreference] = useState<ThemePreference>(
    readInitialPreference,
  );
  const [effectiveTheme, setEffectiveTheme] = useState<ResolvedTheme>(
    readInitialResolvedTheme,
  );
  const selectedIndex = Math.max(0, themeOptions.indexOf(preference));
  const effectiveLabel = effectiveTheme === "dark" ? text.dark : text.light;

  const closeMenu = useCallback((restoreFocus = false) => {
    setIsOpen(false);

    if (restoreFocus) {
      window.requestAnimationFrame(() => buttonRef.current?.focus());
    }
  }, []);

  useEffect(() => {
    applyThemePreference(preference);
  }, [preference]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    function handleSystemChange() {
      if (
        readThemePreference(document.documentElement.dataset.themePreference) ===
        "system"
      ) {
        setEffectiveTheme(applyThemePreference("system"));
      }
    }

    media.addEventListener("change", handleSystemChange);

    return () => {
      media.removeEventListener("change", handleSystemChange);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timer = window.setTimeout(() => {
      optionRefs.current[selectedIndex]?.focus();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [isOpen, selectedIndex]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (
        event.target instanceof Node &&
        rootRef.current &&
        !rootRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMenu, isOpen]);

  function focusOption(index: number) {
    const normalizedIndex =
      (index + themeOptions.length) % themeOptions.length;
    optionRefs.current[normalizedIndex]?.focus();
  }

  function selectPreference(nextPreference: ThemePreference) {
    setPreference(nextPreference);
    setEffectiveTheme(applyThemePreference(nextPreference));
    closeMenu(true);
  }

  function handleTriggerKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
    }
  }

  function handleOptionKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
    option: ThemePreference,
  ) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusOption(index + 1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      focusOption(index - 1);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusOption(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      focusOption(themeOptions.length - 1);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectPreference(option);
      return;
    }

    if (event.key === "Tab") {
      setIsOpen(false);
    }
  }

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      ref={rootRef}
    >
      <button
        aria-controls={isOpen ? menuId : undefined}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`${text.label}: ${effectiveLabel}. ${text.change}.`}
        className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] border shadow-sm transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
        onClick={() => setIsOpen((current) => !current)}
        onKeyDown={handleTriggerKeyDown}
        ref={buttonRef}
        style={{
          backgroundColor: "var(--surface-elevated)",
          borderColor: "var(--border-default)",
          color: "var(--text-strong)",
        }}
        title={`${text.label}: ${effectiveLabel}`}
        type="button"
      >
        <ThemeIcon name={effectiveTheme === "dark" ? "moon" : "sun"} />
      </button>

      {isOpen ? (
        <div
          aria-label={text.label}
          className="absolute right-0 top-full z-50 mt-2 grid w-60 gap-1 rounded-[12px] border p-2 text-[13px] font-black shadow-lg"
          id={menuId}
          role="menu"
          style={{
            backgroundColor: "var(--surface-elevated)",
            borderColor: "var(--border-default)",
            color: "var(--text-default)",
          }}
        >
          {themeOptions.map((option, index) => {
            const isSelected = preference === option;

            return (
              <button
                aria-checked={isSelected}
                className="flex min-h-11 w-full items-center gap-3 rounded-[10px] border px-3 text-left transition hover:bg-[var(--surface-interactive)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
                key={option}
                onClick={() => selectPreference(option)}
                onKeyDown={(event) => handleOptionKeyDown(event, index, option)}
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                role="menuitemradio"
                style={{
                  backgroundColor: isSelected
                    ? "var(--surface-interactive)"
                    : "transparent",
                  borderColor: isSelected
                    ? "var(--border-strong)"
                    : "transparent",
                  color: "var(--text-strong)",
                }}
                tabIndex={-1}
                type="button"
              >
                <span
                  aria-hidden="true"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px]"
                  style={{
                    backgroundColor: isSelected
                      ? "var(--primary)"
                      : "var(--surface-interactive)",
                    color: isSelected
                      ? "var(--primary-contrast)"
                      : "var(--text-default)",
                  }}
                >
                  <ThemeIcon name={iconForPreference(option)} />
                </span>
                <span className="min-w-0 flex-1">{text[option]}</span>
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-full border"
                  style={{
                    backgroundColor: isSelected
                      ? "var(--primary)"
                      : "transparent",
                    borderColor: isSelected
                      ? "var(--primary)"
                      : "var(--border-strong)",
                  }}
                />
                {isSelected ? (
                  <span className="sr-only">{text.selected}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
