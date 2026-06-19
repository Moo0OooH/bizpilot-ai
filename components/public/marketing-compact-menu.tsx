"use client";

/**
 * ============================================================
 * File: components/public/marketing-compact-menu.tsx
 * Project: BizPilot AI
 * Description: Client-side compact public navigation menu controller.
 * Role: Adds accessible expanded state, Escape close, and outside-click close for the responsive marketing header.
 * Related:
 * - components/public/marketing-ui.tsx
 * Author: MoOoH
 * Created: 2026-06-18
 * Last Updated: 2026-06-18
 * Change Log:
 * - 2026-06-18: Created compact navigation controller for responsive header QA.
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
        className="flex min-h-11 cursor-pointer items-center justify-center rounded-[12px] border px-3 text-[13px] font-black transition hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(37,99,235,0.18)]"
        onClick={() => setOpen((value) => !value)}
        style={{
          backgroundColor: "#FFFFFF",
          borderColor: "#CBD5E1",
          color: "#0F172A",
        }}
        type="button"
      >
        Menu
      </button>
      {open ? (
        <div
          className="absolute right-0 top-[calc(100%+0.65rem)] z-50 grid max-h-[min(70svh,32rem)] w-[min(88vw,22rem)] gap-3 overflow-y-auto rounded-[18px] border bg-white p-3 shadow-[0_18px_48px_rgba(15,23,42,0.16)]"
          id="marketing-compact-menu"
          style={{ borderColor: "#E2E8F0" }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
