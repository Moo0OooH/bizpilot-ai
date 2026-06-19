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
 * Last Updated: 2026-06-19
 * Change Log:
 * - 2026-06-18: Created compact navigation controller for responsive header QA.
 * - 2026-06-19: Switched compact menu colors to semantic theme tokens.
 * ============================================================
 */

import { useEffect, useRef, useState, type ReactNode } from "react";

export function MarketingCompactMenu({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="relative min-[1180px]:hidden" ref={rootRef}>
      <button
        aria-controls="marketing-compact-menu"
        aria-expanded={open}
        aria-label={open ? "Close site navigation" : "Open site navigation"}
        className="flex min-h-11 cursor-pointer items-center justify-center rounded-[12px] border px-3 text-[13px] font-black transition hover:bg-[var(--surface-interactive)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
        onClick={() => setOpen((value) => !value)}
        style={{
          backgroundColor: "var(--surface-elevated)",
          borderColor: "var(--border-strong)",
          color: "var(--text-strong)",
        }}
        type="button"
      >
        Menu
      </button>
      {open ? (
        <div
          className="absolute right-0 top-[calc(100%+0.65rem)] z-50 grid max-h-[min(70svh,32rem)] w-[min(88vw,22rem)] gap-3 overflow-y-auto rounded-[18px] border p-3 shadow-[var(--shadow-lg)]"
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
