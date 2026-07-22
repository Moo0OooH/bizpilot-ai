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
 * - lib/quote-attribution.ts
 * - supabase/migrations/0005_public_intake_and_leads.sql
 * Author: MoOoH
 * Created: 2026-05-06
 * Last Updated: 2026-07-22
 * Change Log:
 * - 2026-07-16: Unified preview/runtime brand tokens, added accessible brand contrast, and stopped overriding semantic success colors.
 * - 2026-07-16: Applied saved business logo and colors to the public quote experience and added owner-aware preview recovery.
 * - 2026-05-06: Created public quote page with dynamic form rendering.
 * - 2026-05-19: Replaced inline single-page form with grouped quote sections for higher completion rate per UX research.
 * - 2026-05-22: Kept all grouped sections visible so public submit does not depend on client-side step navigation.
 * - 2026-06-19: Mapped public quote shell colors to shared semantic theme tokens.
 * - 2026-06-21: Localized noindex metadata from the active quote language.
 * - 2026-06-25: Polished quote shell spacing while preserving safe GET and submit behavior.
 * - 2026-06-27: Guarded route error copy against raw provider or database messages.
 * - 2026-07-04: Preserved safe quote-link attribution across source URL capture and language switches.
 * - 2026-07-04: Loaded default quote-field labels from the active quote language to prevent EN/FR mixing.
 * - 2026-07-11: Localized the quote language-switch aria label through the public copy dictionary.
 * - 2026-07-22: Reused the canonical Toronto operating timezone for public date boundaries.
 * ============================================================
 */

import { QuoteFormWizard } from "@/components/public/quote-form-wizard";
import { QuoteUnavailable } from "@/components/public/quote-unavailable";
import {
  getBizPilotCopy,
  isSafePublicIntakeMessage,
} from "@/lib/i18n/bizpilot-copy";
import {
  DEFAULT_LANGUAGE,
  languageShortLabels,
  readSupportedLanguage,
  supportedLanguages,
} from "@/lib/i18n/language";
import { getPublicSiteCopy } from "@/lib/i18n/public-site-copy";
import {
  buildQuoteAttributionFormQuery,
  buildQuoteLanguageHref,
} from "@/lib/quote-attribution";
import {
  getPublicBrandStyle,
  isSafePublicLogoSource,
} from "@/lib/public-brand-theme";
import { buildNoIndexMetadata } from "@/lib/seo";
import { BUSINESS_OPERATING_TIME_ZONE } from "@/lib/time/business-operating-time-zone";
import { getPublicIntakePage } from "@/server/services/public-intake.service";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type QuotePageProps = Readonly<{
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    error?: string | string[];
    language?: string | string[];
    preview?: string | string[];
    ref?: string | string[];
    source?: string | string[];
    utm_campaign?: string | string[];
    utm_medium?: string | string[];
    utm_source?: string | string[];
  }>;
}>;

function readSingleQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function readQuoteLanguage(query: Awaited<QuotePageProps["searchParams"]>) {
  const requestedLanguage = Array.isArray(query?.language)
    ? query?.language[0]
    : query?.language;

  return requestedLanguage
    ? readSupportedLanguage(requestedLanguage)
    : DEFAULT_LANGUAGE;
}

export async function generateMetadata({
  searchParams,
}: QuotePageProps): Promise<Metadata> {
  const query = await searchParams;
  const activeLanguage = readQuoteLanguage(query);

  return buildNoIndexMetadata(getPublicSiteCopy(activeLanguage).quoteShell.meta);
}

function todayDateString(): string {
  const parts = new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "2-digit",
    timeZone: BUSINESS_OPERATING_TIME_ZONE,
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
  const activeLanguage = readQuoteLanguage(query);
  const page = await getPublicIntakePage({ language: activeLanguage, slug });
  const attributionQuery = buildQuoteAttributionFormQuery({ query, slug });
  const copy = getPublicSiteCopy(activeLanguage).quoteShell;
  const intakeErrors = getBizPilotCopy(activeLanguage).intakeErrors;
  const routeErrorParam = Array.isArray(query?.error)
    ? query?.error[0]
    : query?.error;
  const routeError =
    routeErrorParam
      ? isSafePublicIntakeMessage(routeErrorParam)
        ? routeErrorParam
        : intakeErrors.fallbackSubmit
      : null;

  if (!page) {
    return (
      <QuoteUnavailable
        language={activeLanguage}
        ownerPreview={readSingleQueryValue(query?.preview) === "dashboard"}
        pathname={`/quote/${slug}`}
      />
    );
  }

  const todayDate = todayDateString();
  const logoUrl = isSafePublicLogoSource(page.branding?.logo_url)
    ? page.branding.logo_url
    : null;

  return (
    <main
      className="bp-page public-site min-h-svh bg-[var(--canvas)] text-[var(--text-strong)]"
      style={getPublicBrandStyle(page.branding)}
    >
      <section className="border-b border-[var(--border-default)] px-4 py-5 sm:px-8 sm:py-6">
        <div className="mx-auto w-full max-w-[780px]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- Business logos may be bounded local data images or owner-provided HTTPS assets.
                <img
                  alt=""
                  className="h-11 w-11 shrink-0 rounded-[12px] border border-[var(--border-default)] bg-white object-contain p-1.5 shadow-sm"
                  src={logoUrl}
                />
              ) : (
                <span
                  aria-hidden
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[var(--primary)] text-[13px] font-black text-[var(--primary-contrast)] shadow-sm"
                >
                  {page.publicLink.display_name.slice(0, 2).toUpperCase()}
                </span>
              )}
              <p className="truncate text-[13px] font-black uppercase tracking-[0.12em] text-[var(--brand-primary-text)]">
                {page.publicLink.display_name}
              </p>
            </div>
            <nav
              aria-label={copy.languageMenuLabel}
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
                    href={buildQuoteLanguageHref({
                      language: option,
                      query,
                      slug,
                    })}
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
          <h1 className="mt-3 break-words text-[32px] font-black leading-[1.06] sm:text-[40px]">
            {page.formLayout.header.title}
          </h1>
          <p className="mt-4 max-w-[620px] text-[16px] leading-7 text-[var(--text-default)]">
            {page.formLayout.header.subtitle ?? copy.subtitle}
          </p>
          <p className="mt-4 rounded-[16px] border p-4 text-[14px] leading-6" style={{
            backgroundColor: "color-mix(in srgb, var(--warning) 12%, var(--surface))",
            borderColor: "color-mix(in srgb, var(--warning) 34%, var(--border-default))",
            color: "var(--text-strong)",
          }}>
            {copy.guardrail}
          </p>
          {routeError ? (
            <p className="mt-4 rounded-[14px] border p-3 text-[14px]" style={{
              backgroundColor: "color-mix(in srgb, var(--danger) 12%, var(--surface))",
              borderColor: "color-mix(in srgb, var(--danger) 34%, var(--border-default))",
              color: "var(--text-strong)",
            }}>
              {routeError}
            </p>
          ) : null}
        </div>
      </section>

      <QuoteFormWizard
        language={activeLanguage}
        page={page}
        query={attributionQuery}
        slug={slug}
        todayDate={todayDate}
      />
    </main>
  );
}
