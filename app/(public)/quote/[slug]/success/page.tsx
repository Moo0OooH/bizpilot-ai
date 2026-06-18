/**
 * ============================================================
 * File: app/(public)/quote/[slug]/success/page.tsx
 * Project: BizPilot AI
 * Description: Customer-facing quote request success page.
 * Role: Confirms intake capture, sets the right expectation about owner reply, and keeps public quote UX manual-first. No booking or price is implied.
 * Related:
 * - app/(public)/quote/[slug]/page.tsx
 * - server/services/public-intake.service.ts
 * - docs/product/BIZPILOT_DASHBOARD_DESIGN_SYSTEM_v1.0.md
 * Author: MoOoH
 * Created: 2026-05-06
 * Last Updated: 2026-05-19
 * Change Log:
 * - 2026-05-06: Created public quote request success page.
 * - 2026-05-19: Rebuilt to match the approved index — dark navy surface, emerald check, next-steps card, return link. Removed the light slate theme that broke design-system parity.
 * ============================================================
 */

import Link from "next/link";
import { notFound } from "next/navigation";

import { getBizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import {
  DEFAULT_LANGUAGE,
  readSupportedLanguage,
} from "@/lib/i18n/language";
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
  const page = await getPublicIntakePage({ slug });

  if (!page) {
    notFound();
  }

  const businessName = readDisplayableBusinessName(page.publicLink.display_name);
  const language = readSupportedLanguage(query?.language);
  const copy = getBizPilotCopy(language);
  const quotePath = `/quote/${slug}${quoteLanguageSuffix(language)}`;

  return (
    <main
      className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6"
      style={{
        background:
          "radial-gradient(circle at 18% 6%, rgba(20,184,166,0.16), transparent 28%), radial-gradient(circle at 86% 12%, rgba(45,212,191,0.10), transparent 26%), linear-gradient(140deg, var(--biz-page-bg), var(--biz-bg-dark-2))",
        color: "var(--biz-page-text)",
      }}
    >
      <section
        className="mx-auto w-full max-w-[480px] rounded-[20px] border p-6 sm:p-7"
        style={{
          backgroundColor: "var(--biz-page-surface)",
          borderColor: "var(--biz-page-border)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.32)",
        }}
      >
        <span
          aria-hidden="true"
          className="flex h-12 w-12 items-center justify-center rounded-full"
          style={{
            backgroundColor: "rgba(20,184,166,0.16)",
            color: "var(--biz-primary)",
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
          style={{ color: "var(--biz-page-text-soft)" }}
        >
          {copy.quoteSuccess.requestSent}
        </p>

        <h1
          className="mt-2 text-[26px] font-extrabold leading-tight tracking-[-0.03em]"
          style={{ color: "var(--biz-page-text)" }}
        >
          {copy.quoteSuccess.title(businessName)}
        </h1>

        <p
          className="mt-3 text-sm leading-6"
          style={{ color: "var(--biz-page-text-soft)" }}
        >
          {copy.quoteSuccess.body}
        </p>

        <div
          className="mt-5 grid gap-2.5 rounded-[14px] border p-3.5"
          style={{
            backgroundColor: "rgba(255,255,255,0.035)",
            borderColor: "var(--biz-page-border)",
          }}
        >
          <p
            className="text-[12px] font-extrabold uppercase tracking-[0.14em]"
            style={{ color: "var(--biz-page-text-soft)" }}
          >
            {copy.quoteSuccess.nextTitle}
          </p>
          <ul
            className="grid gap-2 text-sm leading-6"
            style={{ color: "var(--biz-page-text)" }}
          >
            {copy.quoteSuccess.steps(businessName).map((item, index) => (
              <li className="flex items-start gap-2" key={item}>
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold"
                  style={{
                    backgroundColor: "rgba(20,184,166,0.16)",
                    color: "var(--biz-primary)",
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
            className="inline-flex h-11 flex-1 items-center justify-center rounded-[13px] px-3.5 text-[13px] font-extrabold sm:flex-none sm:min-w-[180px]"
            href={quotePath}
            style={{
              backgroundColor: "var(--biz-primary)",
              color: "#03130c",
            }}
          >
            {copy.quoteSuccess.submitAnother}
          </Link>
          <Link
            className="inline-flex h-11 flex-1 items-center justify-center rounded-[13px] border px-3.5 text-[13px] font-extrabold sm:flex-none sm:min-w-[140px]"
            href="/"
            style={{
              borderColor: "var(--biz-border-strong)",
              color: "var(--biz-page-text)",
            }}
          >
            {copy.quoteSuccess.backHome}
          </Link>
        </div>

        <p
          className="mt-5 text-center text-[11px]"
          style={{ color: "var(--biz-page-text-muted)" }}
        >
          {copy.quoteSuccess.footer(businessName)}
        </p>
      </section>
    </main>
  );
}
