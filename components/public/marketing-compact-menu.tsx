"use client";

/**
 * ============================================================
 * File: components/public/marketing-compact-menu.tsx
 * Project: BizPilot AI
 * Description: Client-side compact public navigation menu controller.
 * Role: Adds accessible expanded state, Escape close, outside-click close, and theme-token-safe styling for the responsive marketing header.
 * Related:
 * - components/public/marketing-ui.tsx
 * Author: MoOoH
 * Created: 2026-06-18
 * Last Updated: 2026-07-13
 * Change Log:
 * - 2026-07-13: Localized compact-navigation controls and adopted shared V3 focus and control styling.
 * - 2026-07-13: Removed the first-viewport nested scroller and aligned the compact-menu breakpoint with measured desktop fit.
 * - 2026-06-18: Created compact navigation controller for responsive header QA.
 * - 2026-06-19: Switched compact menu colors to semantic theme tokens.
 * - 2026-06-19: Added focus return, icon trigger, and disclosure semantics for final header polish.
 * - 2026-06-20: Stabilized compact menu width against narrow viewport overflow.
 * ============================================================
 */

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import type { SupportedLanguage } from "@/lib/i18n/language";

function MenuIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

export function MarketingCompactMenu({
  children,
  language = "en",
}: Readonly<{ children: ReactNode; language?: SupportedLanguage | undefined }>) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

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

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        closeMenu(false);
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

  return (
    <div className="relative min-[1440px]:hidden" ref={rootRef}>
      <button
        aria-controls="marketing-compact-menu"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={
          language === "fr-CA"
            ? open
              ? "Fermer la navigation du site"
              : "Ouvrir la navigation du site"
            : open
              ? "Close site navigation"
              : "Open site navigation"
        }
        className="v3-control flex h-11 w-11 cursor-pointer items-center justify-center rounded-[var(--v3-radius-sm)] border text-[13px] font-black shadow-sm transition hover:bg-[var(--surface-interactive)]"
        onClick={() => setOpen((value) => !value)}
        ref={buttonRef}
        style={{
          backgroundColor: "var(--surface-elevated)",
          borderColor: "var(--border-default)",
          color: "var(--text-strong)",
        }}
        type="button"
      >
        <MenuIcon />
      </button>
      {open ? (
        <div
          className="absolute right-0 top-[calc(100%+0.65rem)] z-50 grid w-[min(calc(100vw-2rem),22rem)] gap-3 rounded-[18px] border p-3 shadow-[var(--shadow-lg)]"
          id="marketing-compact-menu"
          style={{
            backgroundColor: "var(--surface-elevated)",
            borderColor: "var(--border-default)",
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
