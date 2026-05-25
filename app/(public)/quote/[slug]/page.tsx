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

import Link from "next/link";

import { QuoteFormWizard } from "@/components/public/quote-form-wizard";
import { QuoteUnavailable } from "@/components/public/quote-unavailable";
import {
  BizPilotBrand,
  BizPilotThemeShell,
} from "@/components/ui/bizpilot-theme";
import { bizColors, bizTheme } from "@/lib/design-tokens";
import { getBizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import {
  DEFAULT_LANGUAGE,
  languageShortLabels,
  readSupportedLanguage,
  supportedLanguages,
  type SupportedLanguage,
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

type QuotePageQuery = NonNullable<Awaited<QuotePageProps["searchParams"]>>;

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

function quoteLanguageHref(input: {
  language: SupportedLanguage;
  query: QuotePageQuery | undefined;
  slug: string;
}): string {
  const search = new URLSearchParams();
  const trackingKeys = [
    "ref",
    "source",
    "utm_campaign",
    "utm_medium",
    "utm_source",
  ] as const;

  for (const key of trackingKeys) {
    const value = input.query?.[key];

    if (value) {
      search.set(key, value);
    }
  }

  if (input.language !== DEFAULT_LANGUAGE) {
    search.set("language", input.language);
  }

  const query = search.toString();

  return query ? `/quote/${input.slug}?${query}` : `/quote/${input.slug}`;
}

function QuoteLanguageSwitch({
  activeLanguage,
  query,
  slug,
}: Readonly<{
  activeLanguage: SupportedLanguage;
  query: QuotePageQuery | undefined;
  slug: string;
}>) {
  return (
    <div className="inline-flex rounded-[12px] border border-white/[0.10] bg-white/[0.035] p-1">
      {supportedLanguages.map((language) => {
        const selected = language === activeLanguage;

        return (
          <Link
            aria-current={selected ? "page" : undefined}
            className="inline-flex h-8 min-w-10 items-center justify-center rounded-[9px] px-3 text-[11px] font-black"
            href={quoteLanguageHref({ language, query, slug })}
            key={language}
            style={{
              backgroundColor: selected ? "var(--biz-primary)" : "transparent",
              color: selected ? "#03130c" : "#F5F7FA",
            }}
          >
            {languageShortLabels[language]}
          </Link>
        );
      })}
    </div>
  );
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

  const primaryColor = page.branding?.primary_color ?? bizColors.accent;
  const accentColor = page.branding?.accent_color ?? bizColors.accent;
  const copy = getBizPilotCopy(activeLanguage);
  const todayDate = todayDateString();

  return (
    <BizPilotThemeShell>
      <section className="border-b border-white/[0.06] px-4 py-4 sm:px-6">
        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <BizPilotBrand compact subtitle={copy.quotePage.subtitle} />
            <QuoteLanguageSwitch
              activeLanguage={activeLanguage}
              query={query}
              slug={slug}
            />
          </div>

          <div className="rounded-[16px] border border-white/[0.08] bg-white/[0.035] p-4">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#17D492]/20 bg-[#17D492]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#17D492]">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: primaryColor }}
              />
              {copy.quotePage.badge}
            </p>
            <h1 className="mt-2.5 text-[22px] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#F5F7FA] sm:text-[26px]">
              {page.publicLink.display_name}
            </h1>
            <p
              className={`mt-1.5 max-w-[60ch] text-[13px] leading-5 ${bizTheme.secondaryText}`}
            >
              {copy.quotePage.description}
            </p>
            <div
              className="mt-3 h-px w-full opacity-70"
              style={{
                background: `linear-gradient(90deg, ${accentColor}, transparent)`,
              }}
            />
          </div>

          {query?.error ? (
            <p className="rounded-[10px] border border-[#FF5C5C]/22 bg-[#FF5C5C]/10 p-2.5 text-[13px] text-[#FFB4B4]">
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
    </BizPilotThemeShell>
  );
}
