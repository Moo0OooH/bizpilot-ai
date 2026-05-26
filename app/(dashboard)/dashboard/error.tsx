"use client";

import { useEffect } from "react";

type DashboardErrorProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error("[bizpilot] dashboard.error_boundary", {
      digest: error.digest ?? "none",
      name: error.name,
    });
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-8">
      <section className="w-full max-w-lg rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-6 shadow-xl">
        <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--dash-text-muted)]">
          Dashboard
        </p>
        <h1 className="mt-3 text-2xl font-black tracking-tight text-[var(--dash-text)]">
          This workspace needs a refresh.
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--dash-text-secondary)]">
          BizPilot caught a safe dashboard error. Reload the workspace to try
          again without exposing internal details.
        </p>
        <button
          className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg bg-[var(--dash-primary)] px-4 text-sm font-black text-white"
          onClick={reset}
          type="button"
        >
          Reload dashboard
        </button>
      </section>
    </main>
  );
}
