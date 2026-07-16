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
 * - 2026-07-16: Added full-reload recovery and native fallback navigation so one failed route cannot trap the owner.
 * - 2026-07-05: Added complete BizPilot source header metadata and alert semantics.
 * ============================================================
 */

import { useEffect, useSyncExternalStore } from "react";

import { getBizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import {
  readSupportedLanguage,
  type SupportedLanguage,
} from "@/lib/i18n/language";

type DashboardErrorProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

function readDashboardErrorLanguage(): SupportedLanguage {
  if (typeof document === "undefined") {
    return "en";
  }

  return readSupportedLanguage(document.documentElement.lang);
}

function readServerDashboardErrorLanguage(): SupportedLanguage {
  return "en";
}

function subscribeDashboardLanguage(): () => void {
  return () => undefined;
}

export default function DashboardError({ error }: DashboardErrorProps) {
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
  const errorCopy = getBizPilotCopy(language).dashboard.errorBoundary;
  const navCopy = getBizPilotCopy(language).dashboard.nav;

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
          onClick={() => window.location.reload()}
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
