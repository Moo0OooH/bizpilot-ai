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
 * Last Updated: 2026-06-20
 * Change Log:
 * - 2026-06-18: Created compact navigation controller for responsive header QA.
 * - 2026-06-19: Switched compact menu colors to semantic theme tokens.
 * - 2026-06-19: Added focus return, icon trigger, and disclosure semantics for final header polish.
 * - 2026-06-20: Stabilized compact menu width against narrow viewport overflow.
 * ============================================================
 */

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

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
}: Readonly<{ children: ReactNode }>) {
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
    <div className="relative min-[1240px]:hidden" ref={rootRef}>
      <button
        aria-controls="marketing-compact-menu"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={open ? "Close site navigation" : "Open site navigation"}
        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-[12px] border text-[13px] font-black shadow-sm transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
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
          className="absolute right-0 top-[calc(100%+0.65rem)] z-50 grid max-h-[min(70svh,32rem)] w-[min(calc(100vw-2rem),22rem)] gap-3 overflow-y-auto overscroll-contain rounded-[18px] border p-3 shadow-[var(--shadow-lg)]"
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
