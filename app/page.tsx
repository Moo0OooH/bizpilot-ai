export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
          BizPilot AI
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
          Phase 1 Project Foundation
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600">
          Technical foundation only. No product features, lead workflows, AI
          generation, billing, or quote functionality are implemented in this
          phase.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            "Next.js App Router",
            "TypeScript strict",
            "Tailwind CSS",
          ].map((item) => (
            <div
              key={item}
              className="border border-zinc-200 bg-white p-4 text-sm font-medium text-zinc-800"
            >
              {item}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
