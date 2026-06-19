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
 * Last Updated: 2026-06-19
 * Change Log:
 * - 2026-06-19: Mapped unavailable quote state to shared semantic theme tokens.
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
  pathname,
}: Readonly<{ language: SupportedLanguage; pathname: string }>) {
  const copy = getBizPilotCopy(language).quotePage;

  return (
    <BizPilotThemeShell>
      <main className="public-site flex min-h-svh items-center justify-center px-4 py-10">
        <section className="w-full max-w-[560px] rounded-[18px] border p-6 text-center shadow-[var(--shadow-lg)]" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border-default)" }}>
          <BizPilotBrand compact subtitle={copy.unavailableSubtitle} />
          <h1 className="mt-5 text-2xl font-extrabold text-[var(--text-strong)]">
            {copy.unavailableTitle}
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--text-default)]">
            {copy.unavailableBody}
          </p>
          <div className="mt-5 flex justify-center">
            <div className="inline-flex rounded-[12px] border p-1" style={{ backgroundColor: "var(--surface-elevated)", borderColor: "var(--border-default)" }}>
              {supportedLanguages.map((option) => {
                const selected = option === language;

                return (
                  <Link
                    aria-current={selected ? "page" : undefined}
                    className="inline-flex h-8 min-w-10 items-center justify-center rounded-[9px] px-3 text-[11px] font-black"
                    href={
                      option === "en"
                        ? pathname
                        : `${pathname}?language=${encodeURIComponent(option)}`
                    }
                    key={option}
                    style={{
                      backgroundColor: selected ? "var(--biz-primary)" : "transparent",
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
            className="mt-5 inline-flex h-11 items-center justify-center rounded-[13px] px-4 text-sm font-extrabold"
            href="/"
            style={{
              backgroundColor: "var(--biz-primary)",
              color: "var(--primary-contrast)",
            }}
          >
            {copy.unavailableCta}
          </Link>
        </section>
      </main>
    </BizPilotThemeShell>
  );
}
