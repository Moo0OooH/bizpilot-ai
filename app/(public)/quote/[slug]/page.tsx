/**
 * ============================================================
 * File: app/(public)/quote/[slug]/page.tsx
 * Project: BizPilot AI
 * Description: Public branded cleaning quote page.
 * Role: Renders public-safe business branding + a grouped intake form.
 * Related:
 * - components/public/quote-form-wizard.tsx
 * - server/actions/public-intake.actions.ts
 * - server/services/public-intake.service.ts
 * - supabase/migrations/0005_public_intake_and_leads.sql
 * Author: MoOoH
 * Created: 2026-05-06
 * Last Updated: 2026-05-19
 * Change Log:
 * - 2026-05-06: Created public quote page with dynamic form rendering.
 * - 2026-05-19: Replaced inline single-page form with grouped quote sections for higher completion rate per UX research.
 * - 2026-05-22: Kept all grouped sections visible so public submit does not depend on client-side step navigation.
 * ============================================================
 */

import { QuoteFormWizard } from "@/components/public/quote-form-wizard";
import { QuoteUnavailable } from "@/components/public/quote-unavailable";
import {
  DEFAULT_LANGUAGE,
  readSupportedLanguage,
} from "@/lib/i18n/language";
import { getPublicIntakePage } from "@/server/services/public-intake.service";

export const dynamic = "force-dynamic";

type QuotePageProps = Readonly<{
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    error?: string;
    language?: string;
    ref?: string;
    source?: string;
    utm_campaign?: string;
    utm_medium?: string;
    utm_source?: string;
  }>;
}>;

const appTimeZone = "America/New_York";

function todayDateString(): string {
  const parts = new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "2-digit",
    timeZone: appTimeZone,
    year: "numeric",
  }).formatToParts(new Date());
  const valueByType = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );
  return `${valueByType.year}-${valueByType.month}-${valueByType.day}`;
}

export default async function QuotePage({
  params,
  searchParams,
}: QuotePageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const page = await getPublicIntakePage({ slug });
  const activeLanguage = query?.language
    ? readSupportedLanguage(query.language)
    : DEFAULT_LANGUAGE;

  if (!page) {
    return <QuoteUnavailable language={activeLanguage} pathname={`/quote/${slug}`} />;
  }

  const todayDate = todayDateString();

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <section className="border-b border-[#E2E8F0] px-5 py-6 sm:px-8">
        <div className="mx-auto w-full max-w-[780px]">
          <p className="text-[13px] font-black uppercase tracking-[0.14em] text-[#2563EB]">
            {page.publicLink.display_name}
          </p>
          <h1 className="mt-3 text-[34px] font-black leading-[1.06] sm:text-[44px]">
            Request a cleaning quote
          </h1>
          <p className="mt-4 max-w-[620px] text-[16px] leading-7 text-[#334155]">
            Tell us what you need and we&apos;ll review your request.
          </p>
          <p className="mt-4 rounded-[16px] border border-amber-200 bg-amber-50 p-4 text-[14px] leading-6 text-amber-800">
            This form does not confirm booking or pricing. The business owner will review your request and reply.
          </p>
          {query?.error ? (
            <p className="mt-4 rounded-[14px] border border-red-200 bg-red-50 p-3 text-[14px] text-red-700">
              {query.error}
            </p>
          ) : null}
        </div>
      </section>

      <QuoteFormWizard
        language={activeLanguage}
        page={page}
        query={query}
        slug={slug}
        todayDate={todayDate}
      />
    </main>
  );
}
