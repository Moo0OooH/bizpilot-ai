/**
 * ============================================================
 * File: app/page.tsx
 * Project: BizPilot AI
 * Description: Renders the current phase status home screen.
 * Role: Confirms Phase 3 business configuration scope without public product workflows.
 * Related:
 * - app/layout.tsx
 * - app/globals.css
 * Author: MoOoH
 * Created: 2026-05-02
 * Last Updated: 2026-05-04
 * Change Log:
 * - 2026-05-04: Added standard project file header.
 * - 2026-05-04: Aligned foundation page typography with UI standards.
 * - 2026-05-04: Updated home screen status for Phase 2 tenant foundation.
 * - 2026-05-05: Updated home screen status for Phase 3 configuration foundation.
 * ============================================================
 */

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16">
        <p className="text-sm font-medium uppercase tracking-normal text-zinc-500">
          BizPilot AI
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
          Phase 3 Business Configuration Core
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600">
          Business profile, branding, services, FAQ, service areas, privacy,
          consent, Cleaning template settings, and readiness scoring. Public
          intake, leads, AI, email, and billing remain out of scope.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            "Business config",
            "Cleaning template",
            "Readiness score",
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
