"use client";

/**
 * ============================================================
 * File: app/(dashboard)/dashboard/error.tsx
 * Project: BizPilot AI
 * Description: Protected dashboard route error boundary UI.
 * Role: Shows localized, safe recovery copy when an owner dashboard route catches a runtime error.
 * Related:
 * - app/(dashboard)/layout.tsx
 * - lib/i18n/bizpilot-copy.ts
 * Author: MoOoH
 * Created: 2026-07-05
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Replaced the misleading full-dashboard reload with segment retry and explicit unchanged-data reassurance.
 * - 2026-07-16: Added full-reload recovery and native fallback navigation so one failed route cannot trap the owner.
 * - 2026-07-05: Added complete BizPilot source header metadata and alert semantics.
 * ============================================================
 */

import { useEffect, useSyncExternalStore } from "react";

import {
  isDashboardInterfaceLanguage,
  parseDashboardInterfaceLanguageCookie,
  type DashboardInterfaceLanguage,
} from "@/lib/i18n/dashboard-interface";
import { getDashboardInterfaceLegacyCopy } from "@/lib/i18n/dashboard-legacy-interface";

type DashboardErrorProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

function readDashboardErrorLanguage(): DashboardInterfaceLanguage {
  if (typeof document === "undefined") {
    return "en";
  }

  const frameLanguage = document
    .querySelector("[data-dashboard-frame]")
    ?.getAttribute("lang");

  return isDashboardInterfaceLanguage(frameLanguage)
    ? frameLanguage
    : (parseDashboardInterfaceLanguageCookie(document.cookie) ?? "en");
}

function readServerDashboardErrorLanguage(): DashboardInterfaceLanguage {
  return "en";
}

function subscribeDashboardLanguage(): () => void {
  return () => undefined;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error("[bizpilot] dashboard.error_boundary", {
      digest: error.digest ?? "none",
      name: error.name,
    });
  }, [error]);

  const language = useSyncExternalStore(
    subscribeDashboardLanguage,
    readDashboardErrorLanguage,
    readServerDashboardErrorLanguage,
  );
  const dashboardCopy = getDashboardInterfaceLegacyCopy(language).dashboard;
  const errorCopy = dashboardCopy.errorBoundary;
  const navCopy = dashboardCopy.nav;

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-8">
      <section
        className="w-full max-w-lg rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-6 shadow-xl"
        role="alert"
      >
        <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--dash-text-muted)]">
          {errorCopy.eyebrow}
        </p>
        <h1 className="mt-3 text-2xl font-black tracking-tight text-[var(--dash-text)]">
          {errorCopy.title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--dash-text-secondary)]">
          {errorCopy.body}
        </p>
        <button
          className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg bg-[var(--dash-primary)] px-4 text-sm font-black text-white"
          onClick={reset}
          type="button"
        >
          {errorCopy.reload}
        </button>
        <nav className="mt-3 flex flex-wrap gap-2" aria-label={navCopy.groupCommand}>
          <a className="biz-button-secondary inline-flex min-h-10 items-center justify-center rounded-lg border px-3 text-[12px] font-bold" href="/dashboard">
            {navCopy.overview}
          </a>
          <a className="biz-button-secondary inline-flex min-h-10 items-center justify-center rounded-lg border px-3 text-[12px] font-bold" href="/dashboard/configuration">
            {navCopy.quoteSetup}
          </a>
          <a className="biz-button-secondary inline-flex min-h-10 items-center justify-center rounded-lg border px-3 text-[12px] font-bold" href="/dashboard/guide">
            {navCopy.guide}
          </a>
        </nav>
      </section>
    </main>
  );
}
