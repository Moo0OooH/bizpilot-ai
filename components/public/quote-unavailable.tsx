/**
 * ============================================================
 * File: components/public/quote-unavailable.tsx
 * Project: BizPilot AI
 * Description: Localized public quote unavailable state.
 * Role: Keeps missing/inactive quote links language-aware and theme-aware without exposing tenant data.
 * Related:
 * - app/(public)/quote/page.tsx
 * - app/(public)/quote/[slug]/page.tsx
 * - lib/i18n/bizpilot-copy.ts
 * Author: MoOoH
 * Created: 2026-05-25
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Added owner-preview guidance and a direct return to Quote Setup while preserving preview context across languages.
 * - 2026-06-19: Mapped unavailable quote state to shared semantic theme tokens.
 * - 2026-06-20: Aligned the unavailable quote shell action with shared primary and focus tokens.
 * - 2026-07-11: Added a localized aria label to the unavailable quote language switcher.
 * ============================================================
 */

import Link from "next/link";

import {
  BizPilotBrand,
  BizPilotThemeShell,
} from "@/components/ui/bizpilot-theme";
import { getBizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import {
  languageShortLabels,
  supportedLanguages,
  type SupportedLanguage,
} from "@/lib/i18n/language";

export function QuoteUnavailable({
  language,
  ownerPreview = false,
  pathname,
}: Readonly<{
  language: SupportedLanguage;
  ownerPreview?: boolean;
  pathname: string;
}>) {
  const copy = getBizPilotCopy(language).quotePage;
  const title = ownerPreview ? copy.ownerUnavailableTitle : copy.unavailableTitle;
  const body = ownerPreview ? copy.ownerUnavailableBody : copy.unavailableBody;
  const cta = ownerPreview ? copy.ownerUnavailableCta : copy.unavailableCta;

  return (
    <BizPilotThemeShell>
      <div className="public-site flex min-h-svh items-start justify-center px-4 py-8 sm:items-center sm:py-10">
        <section className="w-full max-w-[560px] rounded-[18px] border p-6 text-center shadow-[var(--shadow-lg)]" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border-default)" }}>
          <BizPilotBrand compact subtitle={copy.unavailableSubtitle} />
          <h1 className="mt-5 text-2xl font-extrabold text-[var(--text-strong)]">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--text-default)]">
            {body}
          </p>
          <div className="mt-5 flex justify-center">
            <div
              aria-label={copy.languageMenuLabel}
              className="inline-flex rounded-[12px] border p-1"
              role="navigation"
              style={{ backgroundColor: "var(--surface-elevated)", borderColor: "var(--border-default)" }}
            >
              {supportedLanguages.map((option) => {
                const selected = option === language;

                return (
                  <Link
                    aria-current={selected ? "page" : undefined}
                    className="inline-flex h-8 min-w-10 items-center justify-center rounded-[9px] px-3 text-[11px] font-black transition hover:bg-[var(--surface-interactive)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
                    href={
                      option === "en"
                        ? `${pathname}${ownerPreview ? "?preview=dashboard" : ""}`
                        : `${pathname}?language=${encodeURIComponent(option)}${
                            ownerPreview ? "&preview=dashboard" : ""
                          }`
                    }
                    key={option}
                    style={{
                      backgroundColor: selected ? "var(--primary)" : "transparent",
                      color: selected ? "var(--primary-contrast)" : "var(--text-strong)",
                    }}
                  >
                    {languageShortLabels[option]}
                  </Link>
                );
              })}
            </div>
          </div>
          <Link
            className="mt-5 inline-flex h-11 items-center justify-center rounded-[13px] px-4 text-sm font-extrabold shadow-sm transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
            href={ownerPreview ? "/dashboard/configuration" : "/"}
            style={{
              background: "linear-gradient(135deg, var(--primary), var(--primary-hover))",
              boxShadow: "0 14px 30px color-mix(in srgb, var(--primary) 22%, transparent)",
              color: "var(--primary-contrast)",
            }}
          >
            {cta}
          </Link>
        </section>
      </div>
    </BizPilotThemeShell>
  );
}
