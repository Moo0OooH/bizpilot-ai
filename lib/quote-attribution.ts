/**
 * ============================================================
 * File: lib/quote-attribution.ts
 * Project: BizPilot AI
 * Description: Safe public quote attribution helpers.
 * Role: Preserves quote-link source context without storing customer field data
 *       or arbitrary query parameters in lead attribution metadata.
 * Related:
 * - app/(public)/quote/[slug]/page.tsx
 * - components/public/quote-form-wizard.tsx
 * - server/actions/public-intake.actions.ts
 * Author: MoOoH
 * Created: 2026-07-04
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Preserved validated attribution parameters across failed quote-submission retries.
 * - 2026-07-05: Added complete BizPilot source header metadata for quote attribution helpers.
 * - 2026-07-04: Created safe public quote attribution helpers.
 * ============================================================
 */

import {
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
  type SupportedLanguage,
} from "./i18n/language.ts";
import { getPublicSiteOrigin } from "./seo.ts";

type QuoteAttributionQueryValue = string | readonly string[] | undefined;

export type QuoteAttributionSearchParams = Readonly<{
  language?: QuoteAttributionQueryValue;
  ref?: QuoteAttributionQueryValue;
  source?: QuoteAttributionQueryValue;
  utm_campaign?: QuoteAttributionQueryValue;
  utm_medium?: QuoteAttributionQueryValue;
  utm_source?: QuoteAttributionQueryValue;
}>;

type QuoteAttributionFields = Partial<
  Record<
    | "language"
    | "ref"
    | "source"
    | "utm_campaign"
    | "utm_medium"
    | "utm_source",
    string
  >
>;

export type QuoteAttributionFormQuery = Readonly<
  QuoteAttributionFields & {
    sourceUrl: string;
  }
>;

const quoteAttributionParamOrder = [
  "language",
  "ref",
  "source",
  "utm_campaign",
  "utm_medium",
  "utm_source",
] as const satisfies ReadonlyArray<keyof QuoteAttributionFields>;

const MAX_ATTRIBUTION_VALUE_LENGTH = 160;
const controlCharacterPattern = /[\u0000-\u001F\u007F]/gu;

function firstQueryValue(
  value: QuoteAttributionQueryValue,
): string | undefined {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : undefined;
  }

  return typeof value === "string" ? value : undefined;
}

function cleanQuoteAttributionValue(
  value: QuoteAttributionQueryValue,
): string | undefined {
  const rawValue = firstQueryValue(value);

  if (!rawValue) {
    return undefined;
  }

  const cleanedValue = rawValue
    .replace(controlCharacterPattern, "")
    .trim()
    .slice(0, MAX_ATTRIBUTION_VALUE_LENGTH);

  return cleanedValue.length > 0 ? cleanedValue : undefined;
}

function cleanQuoteLanguage(
  value: QuoteAttributionQueryValue,
): SupportedLanguage | undefined {
  const cleanedValue = cleanQuoteAttributionValue(value);

  return isSupportedLanguage(cleanedValue) ? cleanedValue : undefined;
}

function getCleanQuoteAttribution(
  query: QuoteAttributionSearchParams | undefined,
): QuoteAttributionFields {
  const attribution: QuoteAttributionFields = {};

  if (!query) {
    return attribution;
  }

  const language = cleanQuoteLanguage(query.language);
  const ref = cleanQuoteAttributionValue(query.ref);
  const source = cleanQuoteAttributionValue(query.source);
  const utmCampaign = cleanQuoteAttributionValue(query.utm_campaign);
  const utmMedium = cleanQuoteAttributionValue(query.utm_medium);
  const utmSource = cleanQuoteAttributionValue(query.utm_source);

  if (language) attribution.language = language;
  if (ref) attribution.ref = ref;
  if (source) attribution.source = source;
  if (utmCampaign) attribution.utm_campaign = utmCampaign;
  if (utmMedium) attribution.utm_medium = utmMedium;
  if (utmSource) attribution.utm_source = utmSource;

  return attribution;
}

function quotePathForSlug(slug: string): string {
  return `/quote/${encodeURIComponent(slug.trim())}`;
}

function appendQuoteAttributionParams(input: {
  attribution: QuoteAttributionFields;
  includeDefaultLanguage: boolean;
  params: URLSearchParams;
}) {
  for (const key of quoteAttributionParamOrder) {
    const value = input.attribution[key];

    if (!value) {
      continue;
    }

    if (
      key === "language" &&
      !input.includeDefaultLanguage &&
      value === DEFAULT_LANGUAGE
    ) {
      continue;
    }

    input.params.set(key, value);
  }
}

function createQuoteUrl(input: {
  origin?: string | undefined;
  slug: string;
}): URL {
  const path = quotePathForSlug(input.slug);

  try {
    return new URL(path, input.origin ?? getPublicSiteOrigin());
  } catch {
    return new URL(path, getPublicSiteOrigin());
  }
}

export function buildQuoteSourceUrl(input: {
  origin?: string | undefined;
  query?: QuoteAttributionSearchParams | undefined;
  slug: string;
}): string {
  const url = createQuoteUrl({
    origin: input.origin,
    slug: input.slug,
  });

  appendQuoteAttributionParams({
    attribution: getCleanQuoteAttribution(input.query),
    includeDefaultLanguage: true,
    params: url.searchParams,
  });

  return url.toString();
}

export function buildQuoteAttributionFormQuery(input: {
  origin?: string | undefined;
  query?: QuoteAttributionSearchParams | undefined;
  slug: string;
}): QuoteAttributionFormQuery {
  const attribution = getCleanQuoteAttribution(input.query);

  return {
    ...attribution,
    sourceUrl: buildQuoteSourceUrl({
      origin: input.origin,
      query: attribution,
      slug: input.slug,
    }),
  };
}

export function buildQuoteLanguageHref(input: {
  language: SupportedLanguage;
  query?: QuoteAttributionSearchParams | undefined;
  slug: string;
}): string {
  const attribution = getCleanQuoteAttribution(input.query);

  if (input.language === DEFAULT_LANGUAGE) {
    delete attribution.language;
  } else {
    attribution.language = input.language;
  }

  const params = new URLSearchParams();

  appendQuoteAttributionParams({
    attribution,
    includeDefaultLanguage: false,
    params,
  });

  const queryString = params.toString();
  const path = quotePathForSlug(input.slug);

  return queryString.length > 0 ? `${path}?${queryString}` : path;
}

export function buildQuoteRetryHref(input: {
  error: string;
  language: SupportedLanguage;
  query?: QuoteAttributionSearchParams | undefined;
  slug: string;
}): string {
  const attribution = getCleanQuoteAttribution(input.query);

  if (input.language === DEFAULT_LANGUAGE) {
    delete attribution.language;
  } else {
    attribution.language = input.language;
  }

  const params = new URLSearchParams({ error: input.error });

  appendQuoteAttributionParams({
    attribution,
    includeDefaultLanguage: false,
    params,
  });

  return `${quotePathForSlug(input.slug)}?${params.toString()}`;
}
