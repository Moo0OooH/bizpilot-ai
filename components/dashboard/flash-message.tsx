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
 * ============================================================
 */

import { useEffect, useState } from "react";

type FlashTone = "error" | "notice" | "warning";

const defaultClearParams = ["notice", "error"] as const;

const toneClasses: Record<FlashTone, string> = {
  error:
    "border-red-300/35 bg-red-500/12 text-red-700 dark:text-red-200",
  notice:
    "border-emerald-300/35 bg-emerald-500/12 text-emerald-700 dark:text-emerald-200",
  warning:
    "border-amber-300/35 bg-amber-500/12 text-amber-700 dark:text-amber-200",
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
      className={`rounded-[14px] border p-3 text-xs font-medium transition ${toneClasses[tone]}`}
      role={tone === "error" ? "alert" : "status"}
    >
      {children}
    </p>
  );
}
