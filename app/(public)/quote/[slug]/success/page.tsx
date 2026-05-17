/**
 * ============================================================
 * File: app/(public)/quote/[slug]/success/page.tsx
 * Project: BizPilot AI
 * Description: Renders the Phase 4 public intake success page.
 * Role: Confirms quote request capture without email or AI workflows.
 * Related:
 * - app/(public)/quote/[slug]/page.tsx
 * - server/actions/public-intake.actions.ts
 * Author: MoOoH
 * Created: 2026-05-06
 * Last Updated: 2026-05-06
 * Change Log:
 * - 2026-05-06: Created public quote request success page.
 * ============================================================
 */

import { notFound } from "next/navigation";

import { getPublicIntakePage } from "@/server/services/public-intake.service";

export const dynamic = "force-dynamic";

type SuccessPageProps = Readonly<{
  params: Promise<{
    slug: string;
  }>;
}>;

export default async function QuoteSuccessPage({ params }: SuccessPageProps) {
  const { slug } = await params;
  const page = await getPublicIntakePage({ slug });

  if (!page) {
    notFound();
  }

  return (
    <main className="flex min-h-screen items-center bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] px-6 py-12 text-slate-950">
      <section className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_22px_55px_rgba(15,23,42,0.10)]">
        <p className="text-sm font-medium uppercase tracking-normal text-[var(--biz-primary)]">
          Request submitted
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Thanks. {page.publicLink.display_name} received your quote request.
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          The business will review the details and follow up directly. No
          booking or price is confirmed until they contact you.
        </p>
      </section>
    </main>
  );
}
