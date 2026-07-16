/**
 * ============================================================
 * File: components/public/public-v3-page.tsx
 * Project: BizPilot AI
 * Description: Shared renderer for the retained Website V3 product, demo, pricing, pilot, FAQ, and trust routes.
 * Role: Gives each route a distinct conversion job while preserving one bilingual shell, compact visual system, and manual-first product boundary.
 * Related:
 * - lib/i18n/public-v3-spec.ts
 * - components/public/public-v3-page.module.css
 * - components/public/public-v3-demo.tsx
 * - components/public/public-v3-pilot-request.tsx
 * Author: MoOoH
 * Created: 2026-07-13
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Gave Features, Pricing, FAQ, and Trust distinct visual jobs and aligned pricing conversion with the copy-only pilot request.
 * - 2026-07-13: Created the consolidated V3 renderer for six retained marketing routes.
 * ============================================================
 */

import { JsonLdScript } from "@/components/public/json-ld";
import {
  MarketingBadge,
  MarketingButton,
  MarketingCard,
  MarketingFooter,
  MarketingHeader,
  MarketingIcon,
  type MarketingIconName,
  MarketingProductFrame,
  MarketingStateChip,
} from "@/components/public/marketing-ui";
import { PublicV3Demo } from "@/components/public/public-v3-demo";
import { PublicV3PilotRequest } from "@/components/public/public-v3-pilot-request";
import type { SupportedLanguage } from "@/lib/i18n/language";
import {
  getPublicV3Spec,
  type PublicV3Spec,
} from "@/lib/i18n/public-v3-spec";
import {
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
} from "@/lib/public-structured-data";

import styles from "./public-v3-page.module.css";

export type PublicV3MarketingRoute =
  | "/features"
  | "/demo"
  | "/pricing"
  | "/pilot"
  | "/faq"
  | "/trust";

const routeIcons: Readonly<Record<PublicV3MarketingRoute, readonly MarketingIconName[]>> = {
  "/features": ["link", "search", "pen"],
  "/demo": ["message", "search", "check"],
  "/pricing": ["target", "check", "briefcase"],
  "/pilot": ["search", "link", "user"],
  "/faq": ["message", "shield", "check"],
  "/trust": ["inbox", "spark", "shield"],
};
const visualStageIcons: readonly MarketingIconName[] = ["message", "link", "check"];
const visualSourceIcons: readonly MarketingIconName[] = ["camera", "phone", "globe"];
const visualPlanIcons: readonly MarketingIconName[] = ["target", "briefcase", "spark"];

function RouteVisual({ path, spec }: Readonly<{ path: PublicV3MarketingRoute; spec: PublicV3Spec }>) {
  const route = spec.routes[path];

  if (path === "/features") {
    return (
      <MarketingProductFrame className={styles.routeVisual} label={route.hero.eyebrow}>
        <div className={styles.visualChrome}>
          <span>{route.hero.eyebrow}</span>
          <MarketingStateChip>{spec.features.length}</MarketingStateChip>
        </div>
        <div className={styles.workspaceVisual}>
          <div className={styles.workspaceRail}>
            {spec.home.problemMessages.slice(0, 3).map((item, index) => (
              <span className={index === 0 ? styles.activeRailItem : ""} key={item.label}>
                <MarketingIcon name={visualSourceIcons[index % visualSourceIcons.length] ?? "message"} />
                {item.label}
              </span>
            ))}
          </div>
          <div className={styles.workspaceRecord}>
            <strong>{spec.features[2]?.title}</strong>
            {spec.demo.result.slice(0, 3).map((item) => (
              <p key={item.label}><span>{item.label}</span>{item.value}</p>
            ))}
            <div className={styles.workspaceDraft}>
              <MarketingIcon name="spark" />
              <span>{spec.features[4]?.title}</span>
            </div>
          </div>
        </div>
      </MarketingProductFrame>
    );
  }

  if (path === "/demo") {
    return (
      <MarketingProductFrame className={styles.routeVisual} label={route.hero.eyebrow}>
        <div className={styles.visualChrome}><span>{route.hero.eyebrow}</span><MarketingStateChip>01 → 03</MarketingStateChip></div>
        <div className={styles.journeyVisual}>
          {spec.home.visual.stageLabels.map((label, index) => (
            <div className={styles.journeyStep} key={label}>
              <span aria-hidden="true">
                <MarketingIcon name={visualStageIcons[index % visualStageIcons.length] ?? "check"} />
              </span>
              <div><strong>{label}</strong><small>{index === 0 ? spec.demo.incoming : index === 1 ? spec.demo.questions[0]?.value : spec.home.visual.replyDraft}</small></div>
            </div>
          ))}
        </div>
      </MarketingProductFrame>
    );
  }

  if (path === "/pricing") {
    return (
      <div className={styles.pricingVisual} aria-label={route.hero.eyebrow}>
        {spec.pricing.tiers.map((tier, index) => (
          <div className={styles.miniPlan} key={tier.name}>
            <span aria-hidden="true">
              <MarketingIcon name={visualPlanIcons[index % visualPlanIcons.length] ?? "briefcase"} />
            </span>
            <strong>{tier.name}</strong>
            <b>{tier.price}</b>
          </div>
        ))}
      </div>
    );
  }

  if (path === "/pilot") {
    return (
      <div className={styles.pilotVisual} aria-label={route.hero.eyebrow}>
        <span className={styles.pilotMark}><MarketingIcon name="user" /></span>
        <strong>{spec.pilot.nextSteps[0]?.title}</strong>
        <div>
          {spec.pilot.fit.slice(0, 3).map((item) => <p key={item}><MarketingIcon name="check" />{item}</p>)}
        </div>
      </div>
    );
  }

  if (path === "/faq") {
    return (
      <div className={styles.faqVisual} aria-label={route.hero.eyebrow}>
        {spec.faqItems.slice(0, 4).map((item, index) => (
          <div key={item.key}>
            <span aria-hidden="true">
              <MarketingIcon name={routeIcons["/faq"][index % routeIcons["/faq"].length] ?? "message"} />
            </span>
            <strong>{item.question}</strong>
            <MarketingIcon name="arrow" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.trustVisual} aria-label={route.hero.eyebrow}>
      <span className={styles.trustMark}><MarketingIcon name="shield" /></span>
      <div>
        {spec.home.finalAssurances.map((item) => <p key={item}><MarketingIcon name="check" />{item}</p>)}
      </div>
    </div>
  );
}

function FeaturesContent({ spec }: Readonly<{ spec: PublicV3Spec }>) {
  const scope = spec.faqItems.find((item) => item.key === "direct-integrations") ?? spec.faqItems[0];

  return (
    <section className={styles.section}>
      <div className="v3-container">
        <div className={styles.featureGrid}>
          {spec.features.map((feature, index) => (
            <MarketingCard
              className={`${styles.featureCard} ${index === 0 ? styles.featureCardFeatured : ""} ${index === spec.features.length - 1 ? styles.featureCardControl : ""}`}
              id={feature.key}
              key={feature.key}
            >
              <span className={styles.cardIcon}>
                <MarketingIcon name={routeIcons["/features"][index % 3] ?? "check"} />
              </span>
              <div>
                <h2 className={styles.cardTitle}>{feature.title}</h2>
                <p className={styles.cardBody}>{feature.body}</p>
              </div>
            </MarketingCard>
          ))}
        </div>
        {scope ? (
          <MarketingCard className={styles.scopeCard} id="focused-by-design">
            <h2>{scope.question}</h2>
            <p>{scope.answer}</p>
          </MarketingCard>
        ) : null}
      </div>
    </section>
  );
}

function DemoContent({ spec }: Readonly<{ spec: PublicV3Spec }>) {
  const labels = spec.home.visual.stageLabels.slice(0, 3) as [string, string, string];

  return (
    <section className={styles.section}>
      <div className="v3-container">
        <PublicV3Demo copy={spec.demo} draft={spec.home.visual.replyDraft} labels={labels} />
      </div>
    </section>
  );
}

function PricingContent({
  language,
  spec,
}: Readonly<{ language: SupportedLanguage; spec: PublicV3Spec }>) {
  return (
    <section className={styles.section}>
      <div className="v3-container">
        <div className={styles.pricingGrid}>
          {spec.pricing.tiers.map((tier, index) => (
            <MarketingCard
              className={`${styles.priceCard} ${index === 0 ? styles.priceCardFeatured : styles.priceCardFuture}`}
              key={tier.name}
            >
              <MarketingBadge toneName={index === 0 ? "teal" : "neutral"}>
                {tier.badge}
              </MarketingBadge>
              <h2 className={styles.cardTitle}>{tier.name}</h2>
              <p className={styles.price}>{tier.price}</p>
              <p className={styles.cardBody}>{tier.body}</p>
              <ul className={styles.pointList}>
                {tier.points.map((point) => (
                  <li key={point}>
                    <MarketingIcon name="check" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              {index === 0 ? (
                <MarketingButton
                  className={styles.priceCta ?? ""}
                  href="/pilot#application"
                  language={language}
                >
                  {spec.routes["/pilot"].hero.primary.label}
                  <MarketingIcon name="arrow" />
                </MarketingButton>
              ) : null}
            </MarketingCard>
          ))}
        </div>
        <p className={styles.notice}>{spec.pricing.notice}</p>
      </div>
    </section>
  );
}

function PilotContent({ spec }: Readonly<{ spec: PublicV3Spec }>) {
  return (
    <section className={styles.section}>
      <div className="v3-container">
        <div className={styles.pilotGrid}>
          <div className={styles.fitGrid}>
            {spec.pilot.fit.map((item) => (
              <MarketingCard className={styles.fitCard} key={item}>
                <span className={styles.cardIcon}>
                  <MarketingIcon name="check" />
                </span>
                <p className={styles.cardBody}>{item}</p>
              </MarketingCard>
            ))}
          </div>
          <PublicV3PilotRequest copy={spec.pilot} />
        </div>
        <div className={styles.stepGrid}>
          {spec.pilot.nextSteps.map((step, index) => (
            <MarketingCard className={styles.stepCard} key={step.key}>
              <MarketingStateChip>{index + 1}</MarketingStateChip>
              <h2 className={styles.cardTitle}>{step.title}</h2>
              <p className={styles.cardBody}>{step.body}</p>
            </MarketingCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqContent({ spec }: Readonly<{ spec: PublicV3Spec }>) {
  return (
    <section className={styles.section}>
      <div className="v3-container">
        <div className={styles.faqGroups}>
          {spec.faqGroups.map((group, groupIndex) => (
            <section className={styles.faqGroup} key={group.key}>
              <div className={styles.faqGroupHeading}>
                <MarketingStateChip>{String(groupIndex + 1).padStart(2, "0")}</MarketingStateChip>
                <h2>{group.title}</h2>
              </div>
              <div className={styles.faqList}>
                {group.itemKeys.map((itemKey) => {
                  const item = spec.faqItems.find((candidate) => candidate.key === itemKey);

                  return item ? (
                    <details className={styles.faqItem} key={item.key}>
                      <summary>{item.question}</summary>
                      <p>{item.answer}</p>
                    </details>
                  ) : null;
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustContent({
  language,
  spec,
}: Readonly<{ language: SupportedLanguage; spec: PublicV3Spec }>) {
  const controlFlow = spec.trust.slice(0, 4);
  const operatingBoundaries = spec.trust.slice(4);

  return (
    <section className={styles.section}>
      <div className="v3-container">
        <ol className={styles.trustSequence}>
          {controlFlow.map((item, index) => (
            <li key={item.key}>
              <MarketingStateChip>{String(index + 1).padStart(2, "0")}</MarketingStateChip>
              <span className={styles.cardIcon}>
                <MarketingIcon name={routeIcons["/trust"][index % 3] ?? "shield"} />
              </span>
              <div>
                <h2 className={styles.cardTitle}>{item.title}</h2>
                <p className={styles.cardBody}>{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className={styles.trustGrid}>
          {operatingBoundaries.map((item, index) => (
            <MarketingCard className={styles.trustCard} key={item.key}>
              <span className={styles.cardIcon}>
                <MarketingIcon name={routeIcons["/trust"][index % 3] ?? "shield"} />
              </span>
              <h2 className={styles.cardTitle}>{item.title}</h2>
              <p className={styles.cardBody}>{item.body}</p>
            </MarketingCard>
          ))}
        </div>
        <div className={styles.trustEvidenceLinks}>
          <MarketingButton href="/privacy" language={language} variant="secondary">
            {spec.nav.privacy}
          </MarketingButton>
          <MarketingButton href="/security" language={language} variant="secondary">
            {spec.nav.security}
          </MarketingButton>
          <MarketingButton href="/terms" language={language} variant="ghost">
            {spec.nav.terms}
          </MarketingButton>
        </div>
      </div>
    </section>
  );
}

function RouteContent({
  language,
  path,
  spec,
}: Readonly<{
  language: SupportedLanguage;
  path: PublicV3MarketingRoute;
  spec: PublicV3Spec;
}>) {
  switch (path) {
    case "/features":
      return <FeaturesContent spec={spec} />;
    case "/demo":
      return <DemoContent spec={spec} />;
    case "/pricing":
      return <PricingContent language={language} spec={spec} />;
    case "/pilot":
      return <PilotContent spec={spec} />;
    case "/faq":
      return <FaqContent spec={spec} />;
    case "/trust":
      return <TrustContent language={language} spec={spec} />;
  }
}

export function PublicV3Page({
  language,
  path,
}: Readonly<{ language: SupportedLanguage; path: PublicV3MarketingRoute }>) {
  const spec = getPublicV3Spec(language);
  const route = spec.routes[path];

  return (
    <div className={`${styles.page} public-site`} data-public-v3-route={path}>
      <JsonLdScript
        data={buildBreadcrumbJsonLd(
          [
            { name: "BizPilot AI", path: "/" },
            { name: route.hero.title, path },
          ],
          language,
        )}
        id={`bizpilot-v3-${path.slice(1)}-breadcrumb-jsonld`}
      />
      {path === "/faq" ? (
        <JsonLdScript
          data={buildFaqPageJsonLd(spec.faqItems, language)}
          id="bizpilot-v3-faq-jsonld"
        />
      ) : null}
      <MarketingHeader copy={spec.nav} language={language} redirectPath={path} />
      <main id="main-content">
        <section className={styles.hero}>
          <div className={`v3-container ${styles.heroGrid}`}>
            <div className={styles.heroCopy}>
              <MarketingBadge>{route.hero.eyebrow}</MarketingBadge>
              <h1 className={styles.heroTitle}>{route.hero.title}</h1>
              <p className={styles.heroBody}>{route.hero.body}</p>
              <div className={styles.actions}>
                <MarketingButton href={route.hero.primary.href} language={language}>
                  {route.hero.primary.label}
                  <MarketingIcon name="arrow" />
                </MarketingButton>
                <MarketingButton
                  href={route.hero.secondary.href}
                  language={language}
                  variant="secondary"
                >
                  {route.hero.secondary.label}
                </MarketingButton>
              </div>
            </div>
            <RouteVisual path={path} spec={spec} />
          </div>
        </section>
        <RouteContent language={language} path={path} spec={spec} />
      </main>
      <MarketingFooter copy={spec.nav} language={language} />
    </div>
  );
}
