"use client";

import { useEffect } from "react";

type GlobalErrorProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[bizpilot] app.error_boundary", {
      digest: error.digest ?? "none",
      name: error.name,
    });
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#071018] px-4 py-8 text-white">
      <section className="w-full max-w-lg rounded-lg border border-white/10 bg-[#0d1721] p-6 shadow-2xl">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-white/45">
          BizPilot
        </p>
        <h1 className="mt-3 text-2xl font-black tracking-tight">
          The workspace needs a refresh.
        </h1>
        <p className="mt-3 text-sm leading-6 text-white/70">
          The app caught a safe runtime error instead of leaving the page in a
          generic crash state.
        </p>
        <button
          className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#17d492] px-4 text-sm font-black text-[#062014]"
          onClick={reset}
          type="button"
        >
          Reload workspace
        </button>
      </section>
    </main>
  );
}
