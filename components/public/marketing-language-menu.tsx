"use client";

/**
 * ============================================================
 * File: components/public/marketing-language-menu.tsx
 * Project: BizPilot AI
 * Description: Compact public locale disclosure menu.
 * Role: Preserves route, query, and hash while switching public interface language.
 * Related:
 * - components/public/marketing-ui.tsx
 * - lib/i18n/language.ts
 * - server/actions/business-configuration.actions.ts
 * Author: MoOoH
 * Created: 2026-06-19
 * Last Updated: 2026-06-19
 * Change Log:
 * - 2026-06-19: Added compact EN/FR locale control for public header polish.
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
  languageNativeLabels,
  languageShortLabels,
  supportedLanguages,
  type SupportedLanguage,
} from "@/lib/i18n/language";
import { setInterfaceLanguageAction } from "@/server/actions/business-configuration.actions";

function LocaleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.4"
      />
    </svg>
  );
}

export function MarketingLanguageMenu({
  buttonClassName = "",
  className = "",
  label,
  language,
  redirectPath,
}: Readonly<{
  buttonClassName?: string;
  className?: string;
  label: string;
  language: SupportedLanguage;
  redirectPath: string;
}>) {
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const redirectRef = useRef<HTMLInputElement | null>(null);
  const rootRef = useRef<HTMLFormElement | null>(null);
  const [open, setOpen] = useState(false);
  const selectedIndex = Math.max(0, supportedLanguages.indexOf(language));

  const closeMenu = useCallback((restoreFocus = false) => {
    setOpen(false);

    if (restoreFocus) {
      window.requestAnimationFrame(() => buttonRef.current?.focus());
    }
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const timer = window.setTimeout(() => {
      optionRefs.current[selectedIndex]?.focus();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [open, selectedIndex]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        rootRef.current &&
        !rootRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMenu, open]);

  function syncRedirectTarget() {
    if (!redirectRef.current) {
      return;
    }

    redirectRef.current.value = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  }

  function focusOption(index: number) {
    const normalizedIndex =
      (index + supportedLanguages.length) % supportedLanguages.length;
    optionRefs.current[normalizedIndex]?.focus();
  }

  function handleTriggerKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
    }
  }

  function handleOptionKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
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
      focusOption(supportedLanguages.length - 1);
      return;
    }

    if (event.key === "Tab") {
      setOpen(false);
    }
  }

  return (
    <form
      action={setInterfaceLanguageAction}
      aria-label={label}
      className={`relative inline-flex items-center ${className}`}
      onSubmit={() => {
        syncRedirectTarget();
        setOpen(false);
      }}
      ref={rootRef}
    >
      <input
        defaultValue={redirectPath}
        name="redirectTo"
        ref={redirectRef}
        type="hidden"
      />
      <button
        aria-controls={open ? menuId : undefined}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`${label}: ${languageNativeLabels[language]}`}
        className={`inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-[12px] border px-3 text-[12px] font-black shadow-sm transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)] ${buttonClassName}`}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleTriggerKeyDown}
        ref={buttonRef}
        style={{
          backgroundColor: "var(--surface-elevated)",
          borderColor: "var(--border-default)",
          color: "var(--text-strong)",
        }}
        type="button"
      >
        <LocaleIcon />
        <span>{languageShortLabels[language]}</span>
        <ChevronIcon />
      </button>
      {open ? (
        <div
          aria-label={label}
          className="absolute right-0 top-full z-50 mt-2 grid w-60 gap-1 rounded-[12px] border p-2 text-[13px] font-black shadow-lg"
          id={menuId}
          role="menu"
          style={{
            backgroundColor: "var(--surface-elevated)",
            borderColor: "var(--border-default)",
            color: "var(--text-default)",
          }}
        >
          {supportedLanguages.map((option, index) => {
            const selected = option === language;

            return (
              <button
                aria-checked={selected}
                className="flex min-h-11 w-full items-center gap-3 rounded-[10px] border px-3 text-left transition hover:bg-[var(--surface-interactive)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
                key={option}
                name="language"
                onKeyDown={(event) => handleOptionKeyDown(event, index)}
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                role="menuitemradio"
                style={{
                  backgroundColor: selected
                    ? "var(--surface-interactive)"
                    : "transparent",
                  borderColor: selected
                    ? "var(--border-strong)"
                    : "transparent",
                  color: "var(--text-strong)",
                }}
                tabIndex={-1}
                type="submit"
                value={option}
              >
                <span
                  className="inline-flex h-8 min-w-8 items-center justify-center rounded-[9px] text-[11px]"
                  style={{
                    backgroundColor: selected
                      ? "var(--primary)"
                      : "var(--surface-interactive)",
                    color: selected
                      ? "var(--primary-contrast)"
                      : "var(--text-default)",
                  }}
                >
                  {languageShortLabels[option]}
                </span>
                <span className="min-w-0 flex-1">
                  {languageNativeLabels[option]}
                </span>
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-full border"
                  style={{
                    backgroundColor: selected
                      ? "var(--primary)"
                      : "transparent",
                    borderColor: selected
                      ? "var(--primary)"
                      : "var(--border-strong)",
                  }}
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </form>
  );
}
