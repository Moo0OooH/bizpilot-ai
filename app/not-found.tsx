/**
 * ============================================================
 * File: app/not-found.tsx
 * Project: BizPilot AI
 * Description: Accessible bilingual not-found state for unmatched application URLs.
 * Role: Replaces the generic framework fallback without creating a new product route.
 * Related:
 * - app/layout.tsx
 * - components/public/marketing-ui.tsx
 * - lib/i18n/public-v3-spec.ts
 * Author: MoOoH
 * Created: 2026-07-15
 * Last Updated: 2026-07-15
 * Change Log:
 * - 2026-07-15: Added the initial EN/fr-CA 404 recovery surface.
 * ============================================================
 */

import { cookies } from "next/headers";

import {
  MarketingBadge,
  MarketingButton,
  MarketingFooter,
  MarketingHeader,
} from "@/components/public/marketing-ui";
import {
  INTERFACE_LANGUAGE_COOKIE,
  readSupportedLanguage,
} from "@/lib/i18n/language";
import { getPublicV3Spec } from "@/lib/i18n/public-v3-spec";

export default async function NotFound() {
  const language = readSupportedLanguage(
    (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );
  const spec = getPublicV3Spec(language);
  const copy = spec.notFound;

  return (
    <>
      <MarketingHeader
        active="home"
        copy={spec.nav}
        language={language}
        redirectPath="/"
      />
      <main
        className="flex flex-1 items-center py-[clamp(4rem,10vw,8rem)]"
        id="main-content"
      >
        <section className="v3-container w-full">
          <div className="mx-auto max-w-[760px] text-center">
            <MarketingBadge>{copy.eyebrow}</MarketingBadge>
            <h1 className="mt-6 text-[clamp(2.25rem,6vw,4.5rem)] font-black leading-[1.02] tracking-[-0.05em] text-[var(--text)]">
              {copy.title}
            </h1>
            <p className="mx-auto mt-5 max-w-[640px] text-[clamp(1rem,2vw,1.2rem)] leading-8 text-[var(--text-secondary)]">
              {copy.body}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <MarketingButton href="/" language={language}>
                {copy.primary}
              </MarketingButton>
              <MarketingButton
                href="/#how-it-works"
                language={language}
                variant="secondary"
              >
                {copy.secondary}
              </MarketingButton>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter copy={spec.nav} language={language} />
    </>
  );
}
