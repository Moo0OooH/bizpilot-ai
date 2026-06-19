/**
 * ============================================================
 * File: app/pilot/page.tsx
 * Project: BizPilot AI
 * Description: Public founder-pilot application information page.
 * Role: Explains the pilot process while providing a safe no-endpoint copy-template conversion path.
 * Related:
 * - components/public/marketing-ui.tsx
 * - components/public/pilot-request-template-card.tsx
 * - docs/readiness/PHASE_24_REAL_DATA_APPROVAL_GATE_2026-05-30.md
 * - lib/i18n/public-site-copy.ts
 * Author: MoOoH
 * Created: 2026-06-18
 * Last Updated: 2026-06-19
 * Change Log:
 * - 2026-06-18: Made the request UI unmistakably preview-only with non-submitting controls.
 * - 2026-06-19: Moved visible pilot-page copy and metadata into the public-site i18n dictionary.
 * - 2026-06-19: Replaced the inactive request UI with a concise copy-template conversion card.
 * ============================================================
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";

import {
  MarketingBadge,
  MarketingCard,
  MarketingFooter,
  MarketingHeader,
  MarketingIcon,
  MarketingShell,
  marketingBackground,
  marketingTone,
} from "@/components/public/marketing-ui";
import { PilotRequestTemplateCard } from "@/components/public/pilot-request-template-card";
import { getHomeCopy } from "@/lib/i18n/home-copy";
import {
  INTERFACE_LANGUAGE_COOKIE,
  readSupportedLanguage,
} from "@/lib/i18n/language";
import { getPublicSiteCopy } from "@/lib/i18n/public-site-copy";

async function readPublicLanguage() {
  return readSupportedLanguage(
    (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const language = await readPublicLanguage();
  return getPublicSiteCopy(language).pilot.meta;
}

export default async function PilotPage() {
  const language = await readPublicLanguage();
  const navCopy = getHomeCopy(language).nav;
  const copy = getPublicSiteCopy(language).pilot;
  const valueSections = [
    { items: copy.getItems, title: copy.getTitle },
    { items: copy.fitItems, title: copy.fitTitle },
    { items: copy.nextSteps, title: copy.nextStepsTitle },
  ] as const;

  return (
    <main
      className="public-site min-h-svh"
      style={{ background: marketingBackground, color: marketingTone.text }}
    >
      <MarketingHeader
        active="pilot"
        copy={navCopy}
        language={language}
        redirectPath="/pilot"
      />
      <section className="py-[var(--section-space-compact)]">
        <MarketingShell>
          <div className="grid gap-8 min-[1100px]:grid-cols-[minmax(0,0.9fr)_minmax(340px,0.72fr)] min-[1100px]:items-start">
            <div>
              <MarketingBadge>{copy.badge}</MarketingBadge>
              <h1
                className="mt-6 text-[length:var(--text-page)] font-black leading-[1.06] [text-wrap:balance]"
                style={{ color: marketingTone.text }}
              >
                {copy.title}
              </h1>
              <p
                className="mt-6 max-w-[760px] text-[17px] leading-8"
                style={{ color: marketingTone.soft }}
              >
                {copy.body}
              </p>

              <div className="mt-8 grid gap-4">
                {valueSections.map((section) => (
                  <MarketingCard className="p-5 sm:p-6" key={section.title}>
                    <h2
                      className="text-[21px] font-black leading-tight"
                      style={{ color: marketingTone.text }}
                    >
                      {section.title}
                    </h2>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {section.items.map((item) => (
                        <div
                          className="flex min-w-0 items-start gap-3 text-[14px] font-bold leading-6"
                          key={item}
                          style={{ color: marketingTone.soft }}
                        >
                          <span
                            className="mt-0.5 shrink-0"
                            style={{ color: marketingTone.teal }}
                          >
                            <MarketingIcon name="check" />
                          </span>
                          <span className="min-w-0">{item}</span>
                        </div>
                      ))}
                    </div>
                  </MarketingCard>
                ))}
              </div>
            </div>

            <MarketingCard className="p-6 sm:p-7">
              <PilotRequestTemplateCard copy={copy.conversion} />
            </MarketingCard>
          </div>
        </MarketingShell>
      </section>
      <MarketingFooter copy={navCopy} />
    </main>
  );
}
