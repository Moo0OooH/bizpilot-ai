/**
 * ============================================================
 * File: app/(public)/quote/[slug]/success/page.tsx
 * Project: BizPilot AI
 * Description: Customer-facing quote request success page.
 * Role: Confirms intake capture, sets the right expectation about owner reply, and keeps public quote UX manual-first with shared theme tokens. No booking or price is implied.
 * Related:
 * - app/(public)/quote/[slug]/page.tsx
 * - server/services/public-intake.service.ts
 * - docs/operations/BIZPILOT_MANUAL_QA_CHECKLIST_v2.0.md
 * Author: MoOoH
 * Created: 2026-05-06
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Carried saved business branding and identity through the success state with shared accessible tokens.
 * - 2026-07-15: Redirected invalid success URLs to the localized unavailable quote state and preserved locale on the home link.
 * - 2026-07-15: Repointed the shell contract to the current V2 QA authority after legacy design-standard retirement.
 * - 2026-05-06: Created public quote request success page.
 * - 2026-06-20: Aligned success actions with shared public shell focus and short-height behavior.
 * - 2026-05-19: Rebuilt to match the approved index — dark navy surface, emerald check, next-steps card, return link. Removed the light slate theme that broke design-system parity.
 * - 2026-06-21: Localized noindex metadata from the active quote language.
 * - 2026-06-25: Added canonical public page primitive to the quote success shell.
 * - 2026-07-04: Resolved the public page using the active success language for consistent localized defaults.
 * ============================================================
 */

import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getBizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import { publicHref } from "@/lib/i18n/public-href";
import {
  DEFAULT_LANGUAGE,
  readSupportedLanguage,
} from "@/lib/i18n/language";
import {
  getPublicBrandStyle,
  isSafePublicLogoSource,
} from "@/lib/public-brand-theme";
import { buildNoIndexMetadata } from "@/lib/seo";
import { getPublicIntakePage } from "@/server/services/public-intake.service";

export const dynamic = "force-dynamic";

type SuccessPageProps = Readonly<{
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    language?: string;
  }>;
}>;

function readSuccessLanguage(query: Awaited<SuccessPageProps["searchParams"]>) {
  return readSupportedLanguage(query?.language);
}

export async function generateMetadata({
  searchParams,
}: SuccessPageProps): Promise<Metadata> {
  const query = await searchParams;
  const language = readSuccessLanguage(query);

  return buildNoIndexMetadata(getBizPilotCopy(language).quoteSuccess.meta);
}

function quoteLanguageSuffix(language: string): string {
  return language === DEFAULT_LANGUAGE ? "" : `?language=${encodeURIComponent(language)}`;
}

function readDisplayableBusinessName(value: string | null | undefined): string | null {
  const cleaned = value?.trim();

  if (!cleaned) {
    return null;
  }

  const normalized = cleaned.toLowerCase();
  const placeholderNames = new Set([
    "bizpilotowner",
    "business",
    "demo",
    "mrtester",
    "my business",
    "new",
    "sample",
    "test",
    "tester",
    "untitled",
    "your business",
  ]);

  if (placeholderNames.has(normalized) || normalized.startsWith("business-")) {
    return null;
  }

  return cleaned;
}

export default async function QuoteSuccessPage({
  params,
  searchParams,
}: SuccessPageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const language = readSuccessLanguage(query);
  const quotePath = `/quote/${encodeURIComponent(slug)}${quoteLanguageSuffix(language)}`;
  const page = await getPublicIntakePage({ language, slug });

  if (!page) {
    redirect(quotePath);
  }

  const businessName = readDisplayableBusinessName(page.publicLink.display_name);
  const logoUrl = isSafePublicLogoSource(page.branding?.logo_url)
    ? page.branding.logo_url
    : null;
  const copy = getBizPilotCopy(language);

  return (
    <main
      className="bp-page public-site flex min-h-svh items-start justify-center px-4 py-8 sm:items-center sm:px-6 sm:py-10"
      style={{
        ...getPublicBrandStyle(page.branding),
        background: "var(--marketing-background)",
        color: "var(--text-strong)",
      }}
    >
      <section
        className="mx-auto w-full max-w-[480px] rounded-[20px] border p-6 sm:p-7"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border-default)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <div className="mb-5 flex items-center gap-3 border-b border-[var(--border-default)] pb-4">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- Owner-provided bounded data/HTTPS branding is shared with the quote page.
            <img
              alt=""
              className="h-10 w-10 rounded-[11px] border border-[var(--border-default)] bg-white object-contain p-1"
              src={logoUrl}
            />
          ) : (
            <span
              aria-hidden
              className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-[var(--primary)] text-[12px] font-black text-[var(--primary-contrast)]"
            >
              {page.publicLink.display_name.slice(0, 2).toUpperCase()}
            </span>
          )}
          <span className="min-w-0 truncate text-[12px] font-black uppercase tracking-[0.1em] text-[var(--brand-primary-text)]">
            {page.publicLink.display_name}
          </span>
        </div>

        <span
          aria-hidden="true"
          className="flex h-12 w-12 items-center justify-center rounded-full"
          style={{
            backgroundColor: "rgba(20,184,166,0.16)",
            color: "var(--success)",
          }}
        >
          <svg
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M5 12l4 4 10-10" />
          </svg>
        </span>

        <p
          className="mt-5 text-[11px] font-extrabold uppercase tracking-[0.14em]"
          style={{ color: "var(--text-default)" }}
        >
          {copy.quoteSuccess.requestSent}
        </p>

        <h1
          className="mt-2 text-[26px] font-extrabold leading-tight tracking-[-0.03em]"
          style={{ color: "var(--text-strong)" }}
        >
          {copy.quoteSuccess.title(businessName)}
        </h1>

        <p
          className="mt-3 text-sm leading-6"
          style={{ color: "var(--text-default)" }}
        >
          {copy.quoteSuccess.body}
        </p>

        <div
          className="mt-5 grid gap-2.5 rounded-[14px] border p-3.5"
          style={{
            backgroundColor: "var(--surface-interactive)",
            borderColor: "var(--border-default)",
          }}
        >
          <p
            className="text-[12px] font-extrabold uppercase tracking-[0.14em]"
            style={{ color: "var(--text-muted)" }}
          >
            {copy.quoteSuccess.nextTitle}
          </p>
          <ul
            className="grid gap-2 text-sm leading-6"
            style={{ color: "var(--text-strong)" }}
          >
            {copy.quoteSuccess.steps(businessName).map((item, index) => (
              <li className="flex items-start gap-2" key={item}>
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold"
                  style={{
                    backgroundColor: "rgba(20,184,166,0.16)",
                    color: "var(--success)",
                  }}
                >
                  {index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Link
            className="inline-flex h-11 flex-1 items-center justify-center rounded-[13px] px-3.5 text-[13px] font-extrabold shadow-sm transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)] sm:flex-none sm:min-w-[180px]"
            href={quotePath}
            style={{
              background:
                "linear-gradient(135deg, var(--primary), var(--primary-hover))",
              color: "var(--primary-contrast)",
            }}
          >
            {copy.quoteSuccess.submitAnother}
          </Link>
          <Link
            className="inline-flex h-11 flex-1 items-center justify-center rounded-[13px] border px-3.5 text-[13px] font-extrabold transition hover:bg-[var(--surface-interactive)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)] sm:flex-none sm:min-w-[140px]"
            href={publicHref("/", language)}
            style={{
              borderColor: "var(--border-strong)",
              color: "var(--text-strong)",
            }}
          >
            {copy.quoteSuccess.backHome}
          </Link>
        </div>

        <p
          className="mt-5 text-center text-[11px]"
          style={{ color: "var(--text-muted)" }}
        >
          {copy.quoteSuccess.footer(businessName)}
        </p>
      </section>
    </main>
  );
}
