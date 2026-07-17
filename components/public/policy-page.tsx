/**
 * ============================================================
 * File: components/public/policy-page.tsx
 * Project: BizPilot AI
 * Description: Shared renderer for public privacy, security, and terms pages.
 * Role: Keeps legal reading focused while preserving bilingual navigation, evidence, and policy references.
 * Related:
 * - lib/i18n/policy-copy.ts
 * - app/privacy/page.tsx
 * - app/security/page.tsx
 * - app/terms/page.tsx
 * Author: MoOoH
 * Created: 2026-05-25
 * Last Updated: 2026-07-17
 * Change Log:
 * - 2026-07-17: Rebuilt all policy routes as open, indexed reading experiences with visible sections, route-specific accents, and bilingual evidence cards.
 * - 2026-07-16: Replaced the marketing-heavy legal shell with focused brand/language controls, calmer typography, and one trust-oriented next step.
 * - 2026-07-13: Migrated policy pages to the V3 shell, route hero, metadata contract, and compact legal navigation.
 * - 2026-07-13: Separated header, main content, and footer into correct page landmarks.
 * - 2026-07-13: Added the shared main-content target for keyboard skip navigation.
 * - 2026-07-12: Preserved the active public language through policy conversion links.
 * - 2026-06-18: Switched policy pages to narrow readable containers and owner-first summaries.
 * - 2026-06-25: Normalized policy page rhythm to canonical bp sizing primitives.
 * - 2026-07-05: Added shared BreadcrumbList JSON-LD for public policy pages.
 * - 2026-07-05: Added a shared next-step panel for policy-to-conversion flow.
 * ============================================================
 */

import { JsonLdScript } from "@/components/public/json-ld";
import {
  MarketingBadge,
  MarketingButton,
  MarketingFooter,
  MarketingHeader,
  MarketingIcon,
  type MarketingNavCopy,
} from "@/components/public/marketing-ui";
import { TrackedExternalReferenceLink } from "@/components/public/tracked-external-reference-link";
import type { SupportedLanguage } from "@/lib/i18n/language";
import type { PolicyPageCopy } from "@/lib/i18n/policy-copy";
import type { PublicV3Spec } from "@/lib/i18n/public-v3-spec";
import { buildBreadcrumbJsonLd } from "@/lib/public-structured-data";
import type { PublicCanonicalRoute } from "@/lib/seo";

import styles from "./policy-page.module.css";

export function PolicyPage({
  copy,
  language,
  navCopy,
  pagePath,
  routeHero,
}: Readonly<{
  copy: PolicyPageCopy;
  language: SupportedLanguage;
  navCopy: MarketingNavCopy;
  pagePath: PublicCanonicalRoute;
  routeHero: PublicV3Spec["routes"]["/privacy"]["hero"];
}>) {
  const breadcrumbId = `bizpilot-${pagePath.slice(1).replaceAll("/", "-")}-breadcrumb-jsonld`;

  return (
    <div
      className={`${styles.page} public-site`}
      data-policy-route={pagePath}
    >
      <JsonLdScript
        data={buildBreadcrumbJsonLd(
          [
            { name: "BizPilot AI", path: "/" },
            { name: copy.title, path: pagePath },
          ],
          language,
        )}
        id={breadcrumbId}
      />
      <MarketingHeader
        copy={navCopy}
        language={language}
        redirectPath={pagePath}
        variant="legal"
      />
      <main id="main-content">
        <section className={styles.hero}>
          <div className={`v3-container ${styles.heroGrid}`}>
            <div className={styles.heroCopy}>
              <MarketingBadge>{routeHero.eyebrow}</MarketingBadge>
              <h1 className={styles.heroTitle}>
                {routeHero.title}
              </h1>
              <p className={styles.heroBody}>
                {routeHero.body}
              </p>
              <p className={styles.effectiveDate}>
                {copy.effectiveDate}
              </p>
            </div>

            <aside className={styles.summaryCard}>
              <span className={styles.summaryIcon}><MarketingIcon name="shield" /></span>
              <p className={styles.summaryLabel}>{copy.boundaryTitle}</p>
              <p className={styles.summaryBody}>{copy.boundaryBody}</p>
            </aside>
          </div>
        </section>

        <section className={styles.readingSection}>
          <div className={`v3-container ${styles.readingLayout}`}>
            <aside className={styles.contentsCard}>
              <p>{copy.technicalNotesTitle}</p>
              <ol>
                {copy.sections.map((section, index) => (
                  <li key={section.title}>
                    <a href={`#policy-section-${index + 1}`}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </aside>

            <div className={styles.document}>
              <header className={styles.documentHeader}>
                <p>{copy.badge}</p>
                <h2>{copy.title}</h2>
                <p>{copy.body}</p>
              </header>

              <div className={styles.policySections}>
                {copy.sections.map((section, index) => (
                  <article id={`policy-section-${index + 1}`} key={section.title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{section.title}</h3>
                      <p>{section.body}</p>
                    </div>
                  </article>
                ))}
              </div>

              {copy.references?.length && copy.referenceTitle ? (
                <section className={styles.references}>
                  {copy.referenceEyebrow ? <p>{copy.referenceEyebrow}</p> : null}
                  <h2>{copy.referenceTitle}</h2>
                  <div>
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
                </section>
              ) : null}

              <footer className={styles.policyFooter}>
                <p>{copy.footerNote}</p>
                <MarketingButton href="/trust" language={language} variant="secondary">
                  {navCopy.trust}
                </MarketingButton>
              </footer>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter copy={navCopy} language={language} variant="legal" />
    </div>
  );
}
