"use client";

/**
 * ============================================================
 * File: components/dashboard/flash-message.tsx
 * Project: BizPilot AI
 * Description: Transient dashboard notice/error banner that clears URL flash params.
 * Role: Shows short-lived UI feedback without leaving stale query-string alerts after refresh.
 * Related:
 * - app/(dashboard)/dashboard/leads/[leadId]/page.tsx
 * - app/(dashboard)/dashboard/settings/page.tsx
 * - app/(dashboard)/dashboard/configuration/page.tsx
 * Author: MoOoH
 * Created: 2026-05-25
 * Last Updated: 2026-06-27
 * Change Log:
 * - 2026-06-27: Replaced ad-hoc alert colors/radius with Dashboard V3 tokens.
 * ============================================================
 */

import { useEffect, useState } from "react";

type FlashTone = "error" | "notice" | "warning";

const defaultClearParams = ["notice", "error"] as const;

const toneClasses: Record<FlashTone, string> = {
  error:
    "border-[var(--dash-danger-border)] bg-[var(--dash-danger-soft)] text-[var(--dash-danger-strong)]",
  notice:
    "border-[var(--dash-success-border)] bg-[var(--dash-success-soft)] text-[var(--dash-success-strong)]",
  warning:
    "border-[var(--dash-warning-border)] bg-[var(--dash-warning-soft)] text-[var(--dash-warning-strong)]",
};

function clearFlashParams(paramNames: readonly string[]) {
  const url = new URL(window.location.href);
  let changed = false;

  for (const paramName of paramNames) {
    if (url.searchParams.has(paramName)) {
      url.searchParams.delete(paramName);
      changed = true;
    }
  }

  if (changed) {
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }
}

export function FlashMessage({
  children,
  clearParams = defaultClearParams,
  durationMs = 6500,
  tone,
}: Readonly<{
  children: React.ReactNode;
  clearParams?: readonly string[];
  durationMs?: number;
  tone: FlashTone;
}>) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(false);
      clearFlashParams(clearParams);
    }, durationMs);

    return () => window.clearTimeout(timer);
  }, [clearParams, durationMs]);

  if (!visible) {
    return null;
  }

  return (
    <p
      aria-live={tone === "error" ? "assertive" : "polite"}
      className={`rounded-lg border p-3 text-xs font-medium transition ${toneClasses[tone]}`}
      role={tone === "error" ? "alert" : "status"}
    >
      {children}
    </p>
  );
}
