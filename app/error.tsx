"use client";

/**
 * ============================================================
 * File: app/error.tsx
 * Project: BizPilot AI
 * Description: Global application error boundary UI.
 * Role: Shows a safe refresh action when an unexpected runtime error reaches the root app boundary.
 * Related:
 * - app/layout.tsx
 * - app/(dashboard)/dashboard/error.tsx
 * - lib/i18n/bizpilot-copy.ts
 * Author: MoOoH
 * Created: 2026-07-05
 * Last Updated: 2026-07-15
 * Change Log:
 * - 2026-07-15: Localized the global recovery state from the active document language.
 * - 2026-07-05: Added complete BizPilot source header metadata and alert semantics.
 * ============================================================
 */

import { useEffect, useSyncExternalStore } from "react";

import { getBizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import {
  readSupportedLanguage,
  type SupportedLanguage,
} from "@/lib/i18n/language";

type GlobalErrorProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

function readGlobalErrorLanguage(): SupportedLanguage {
  if (typeof document === "undefined") {
    return "en";
  }

  return readSupportedLanguage(document.documentElement.lang);
}

function readServerGlobalErrorLanguage(): SupportedLanguage {
  return "en";
}

function subscribeGlobalLanguage(): () => void {
  return () => undefined;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[bizpilot] app.error_boundary", {
      digest: error.digest ?? "none",
      name: error.name,
    });
  }, [error]);

  const language = useSyncExternalStore(
    subscribeGlobalLanguage,
    readGlobalErrorLanguage,
    readServerGlobalErrorLanguage,
  );
  const copy = getBizPilotCopy(language).globalError;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#071018] px-4 py-8 text-white">
      <section
        className="w-full max-w-lg rounded-lg border border-white/10 bg-[#0d1721] p-6 shadow-2xl"
        role="alert"
      >
        <p className="text-xs font-black uppercase tracking-[0.14em] text-white/45">
          {copy.eyebrow}
        </p>
        <h1 className="mt-3 text-2xl font-black tracking-tight">
          {copy.title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-white/70">
          {copy.body}
        </p>
        <button
          className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#17d492] px-4 text-sm font-black text-[#062014]"
          onClick={reset}
          type="button"
        >
          {copy.reload}
        </button>
      </section>
    </main>
  );
}
