/**
 * ============================================================
 * File: components/public/policy-page.tsx
 * Project: BizPilot AI
 * Description: Shared renderer for public privacy, security, and terms pages.
 * Role: Keeps trust pages visually consistent with the public marketing surface.
 * Related:
 * - lib/i18n/policy-copy.ts
 * - app/privacy/page.tsx
 * - app/security/page.tsx
 * - app/terms/page.tsx
 * Author: MoOoH
 * Created: 2026-05-25
 * Last Updated: 2026-06-18
 * Change Log:
 * - 2026-06-18: Switched policy pages to narrow readable containers and owner-first summaries.
 * - 2026-06-25: Normalized policy page rhythm to canonical bp sizing primitives.
 * ============================================================
 */

import {
  MarketingBadge,
  MarketingButton,
  MarketingCard,
  MarketingFooter,
  MarketingHeader,
  MarketingIcon,
  MarketingSectionTitle,
  marketingBackground,
  marketingTone,
} from "@/components/public/marketing-ui";
import { TrackedExternalReferenceLink } from "@/components/public/tracked-external-reference-link";
import type { HomeNavCopy } from "@/lib/i18n/home-copy";
import type { SupportedLanguage } from "@/lib/i18n/language";
import type { PolicyPageCopy } from "@/lib/i18n/policy-copy";

export function PolicyPage({
  copy,
  language,
  navCopy,
  pagePath,
}: Readonly<{
  copy: PolicyPageCopy;
  language: SupportedLanguage;
  navCopy: HomeNavCopy;
  pagePath: string;
}>) {
  return (
    <main
      className="bp-page public-site min-h-svh"
      style={{ background: marketingBackground, color: marketingTone.text }}
    >
      <MarketingHeader
        copy={navCopy}
        language={language}
        redirectPath={pagePath}
      />

      <section className="bp-section-tight">
        <div className="legal-container">
          <div className="grid min-w-0 gap-6">
            <div className="min-w-0">
              <MarketingBadge>{copy.badge}</MarketingBadge>
              <h1
                className="bp-page-title mt-5 font-black leading-[1.06] [text-wrap:balance]"
                style={{ color: marketingTone.text }}
              >
                {copy.title}
              </h1>
              <p
                className="bp-body mt-5 max-w-[720px] leading-8"
                style={{ color: marketingTone.soft }}
              >
                {copy.body}
              </p>
              <p
                className="mt-4 text-[12px] font-bold uppercase"
                style={{ color: marketingTone.muted }}
              >
                {copy.effectiveDate}
              </p>
            </div>

            <MarketingCard className="p-5">
              <p
                className="text-[12px] font-black uppercase"
                style={{ color: marketingTone.teal }}
              >
                {copy.boundaryTitle}
              </p>
              <p
                className="mt-3 text-[14px] leading-7"
                style={{ color: marketingTone.soft }}
              >
                {copy.boundaryBody}
              </p>
            </MarketingCard>
          </div>
        </div>
      </section>

      {copy.references?.length ? (
        <section className="py-6">
          <div className="legal-container">
            <MarketingSectionTitle
              {...(copy.referenceEyebrow
                ? { eyebrow: copy.referenceEyebrow }
                : {})}
              title={copy.referenceTitle ?? "References"}
            />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {copy.references.map((reference) => (
                <TrackedExternalReferenceLink
                  description={reference.description}
                  href={reference.href}
                  key={reference.href}
                  newTabLabel={copy.externalNewTabLabel}
                  title={reference.title}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="py-6">
        <div className="legal-container">
          <details
            className="rounded-[18px] border p-5"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: marketingTone.border,
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <summary
              className="cursor-pointer text-[15px] font-black leading-6"
              style={{ color: marketingTone.text }}
            >
              {copy.technicalNotesTitle}
            </summary>
            <div className="mt-5 grid min-w-0 gap-4">
              {copy.sections.map((section) => (
                <div
                  className="rounded-[14px] border p-4"
                  key={section.title}
                  style={{
                    backgroundColor: "var(--surface-interactive)",
                    borderColor: marketingTone.border,
                  }}
                >
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-[10px]"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--accent) 12%, transparent)",
                      color: marketingTone.teal,
                    }}
                  >
                    <MarketingIcon name="shield" />
                  </span>
                  <h2
                    className="bp-card-title mt-5 font-black leading-snug"
                    style={{ color: marketingTone.text }}
                  >
                    {section.title}
                  </h2>
                  <p
                    className="mt-3 text-[14px] leading-7"
                    style={{ color: marketingTone.soft }}
                  >
                    {section.body}
                  </p>
                </div>
              ))}
            </div>
          </details>
        </div>
      </section>

      <section className="pb-[var(--bp-section-tight-space)] pt-6">
        <div className="legal-container">
          <MarketingCard
            className="grid min-w-0 gap-5 p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
            style={{ borderColor: "rgba(45,212,191,0.24)" }}
          >
            <p
              className="max-w-[760px] text-[14px] leading-7"
              style={{ color: marketingTone.soft }}
            >
              {copy.footerNote}
            </p>
            <MarketingButton href="/pricing" variant="secondary">
              {navCopy.pricing}
            </MarketingButton>
          </MarketingCard>
        </div>
      </section>

      <MarketingFooter copy={navCopy} />
    </main>
  );
}
