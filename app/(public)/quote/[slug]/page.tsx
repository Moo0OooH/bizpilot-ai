/**
 * ============================================================
 * File: app/(public)/quote/[slug]/page.tsx
 * Project: BizPilot AI
 * Description: Public branded cleaning quote page.
 * Role: Renders public-safe business branding + a grouped intake form with shared semantic theme tokens.
 * Related:
 * - components/public/quote-form-wizard.tsx
 * - server/actions/public-intake.actions.ts
 * - server/services/public-intake.service.ts
 * - supabase/migrations/0005_public_intake_and_leads.sql
 * Author: MoOoH
 * Created: 2026-05-06
 * Last Updated: 2026-06-19
 * Change Log:
 * - 2026-05-06: Created public quote page with dynamic form rendering.
 * - 2026-05-19: Replaced inline single-page form with grouped quote sections for higher completion rate per UX research.
 * - 2026-05-22: Kept all grouped sections visible so public submit does not depend on client-side step navigation.
 * - 2026-06-19: Mapped public quote shell colors to shared semantic theme tokens.
 * ============================================================
 */

import { QuoteFormWizard } from "@/components/public/quote-form-wizard";
import { QuoteUnavailable } from "@/components/public/quote-unavailable";
import {
  DEFAULT_LANGUAGE,
  languageShortLabels,
  readSupportedLanguage,
  supportedLanguages,
  type SupportedLanguage,
} from "@/lib/i18n/language";
import { getPublicSiteCopy } from "@/lib/i18n/public-site-copy";
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

function quoteLanguageHref({
  language,
  slug,
}: Readonly<{ language: SupportedLanguage; slug: string }>) {
  return language === DEFAULT_LANGUAGE
    ? `/quote/${slug}`
    : `/quote/${slug}?language=${encodeURIComponent(language)}`;
}

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
  const copy = getPublicSiteCopy(activeLanguage).quoteShell;

  if (!page) {
    return <QuoteUnavailable language={activeLanguage} pathname={`/quote/${slug}`} />;
  }

  const todayDate = todayDateString();

  return (
    <main className="public-site min-h-svh bg-[var(--canvas)] text-[var(--text-strong)]">
      <section className="border-b border-[var(--border-default)] px-5 py-6 sm:px-8">
        <div className="mx-auto w-full max-w-[780px]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] font-black uppercase tracking-[0.14em] text-[var(--primary)]">
              {page.publicLink.display_name}
            </p>
            <nav
              aria-label="Quote language"
              className="inline-flex w-fit rounded-[12px] border p-1"
              style={{
                backgroundColor: "var(--surface-elevated)",
                borderColor: "var(--border-default)",
              }}
            >
              {supportedLanguages.map((option) => {
                const selected = option === activeLanguage;

                return (
                  <a
                    aria-current={selected ? "page" : undefined}
                    className="inline-flex h-8 min-w-10 items-center justify-center rounded-[9px] px-3 text-[11px] font-black"
                    href={quoteLanguageHref({ language: option, slug })}
                    key={option}
                    style={{
                      backgroundColor: selected ? "var(--primary)" : "transparent",
                      color: selected ? "var(--primary-contrast)" : "var(--text-strong)",
                    }}
                  >
                    {languageShortLabels[option]}
                  </a>
                );
              })}
            </nav>
          </div>
          <h1 className="mt-3 text-[34px] font-black leading-[1.06] sm:text-[44px]">
            {copy.title}
          </h1>
          <p className="mt-4 max-w-[620px] text-[16px] leading-7 text-[var(--text-default)]">
            {copy.subtitle}
          </p>
          <p className="mt-4 rounded-[16px] border p-4 text-[14px] leading-6" style={{
            backgroundColor: "color-mix(in srgb, var(--warning) 12%, var(--surface))",
            borderColor: "color-mix(in srgb, var(--warning) 34%, var(--border-default))",
            color: "var(--text-strong)",
          }}>
            {copy.guardrail}
          </p>
          {query?.error ? (
            <p className="mt-4 rounded-[14px] border p-3 text-[14px]" style={{
              backgroundColor: "color-mix(in srgb, var(--danger) 12%, var(--surface))",
              borderColor: "color-mix(in srgb, var(--danger) 34%, var(--border-default))",
              color: "var(--text-strong)",
            }}>
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
