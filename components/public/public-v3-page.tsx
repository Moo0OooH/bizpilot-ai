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
 * Last Updated: 2026-07-13
 * Change Log:
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
  MarketingProductStage,
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

function signalItems(spec: PublicV3Spec, path: PublicV3MarketingRoute) {
  switch (path) {
    case "/features":
      return spec.features.slice(0, 3).map((item) => ({ detail: item.body, title: item.title }));
    case "/demo":
      return [
        { detail: spec.demo.incoming, title: spec.home.visual.stageLabels[0] ?? "" },
        { detail: spec.demo.questions[0]?.value ?? "", title: spec.home.visual.stageLabels[1] ?? "" },
        { detail: spec.demo.reviewBoundary, title: spec.home.visual.stageLabels[2] ?? "" },
      ];
    case "/pricing":
      return spec.pricing.tiers.map((tier) => ({ detail: tier.price, title: tier.name }));
    case "/pilot":
      return spec.pilot.nextSteps.slice(0, 3).map((item) => ({ detail: item.body, title: item.title }));
    case "/faq":
      return spec.faqItems.slice(0, 3).map((item) => ({ detail: item.answer, title: item.question }));
    case "/trust":
      return spec.trust.slice(0, 3).map((item) => ({ detail: item.body, title: item.title }));
  }
}

function RouteSignal({ path, spec }: Readonly<{ path: PublicV3MarketingRoute; spec: PublicV3Spec }>) {
  const route = spec.routes[path];
  const icons = routeIcons[path];

  return (
    <MarketingProductFrame className={styles.signalFrame} label={route.hero.eyebrow}>
      <div className={styles.signalHeader}>
        <span>{route.hero.eyebrow}</span>
        <MarketingStateChip>{signalItems(spec, path).length}</MarketingStateChip>
      </div>
      <div className={styles.signalList}>
        {signalItems(spec, path).map((item, index) => (
          <MarketingProductStage className={styles.signalStage} key={item.title}>
            <span className={styles.signalIcon}>
              <MarketingIcon name={icons[index] ?? "check"} />
            </span>
            <div>
              <strong>{item.title}</strong>
              <span>{item.detail}</span>
            </div>
          </MarketingProductStage>
        ))}
      </div>
    </MarketingProductFrame>
  );
}

function FeaturesContent({ spec }: Readonly<{ spec: PublicV3Spec }>) {
  const scope = spec.faqItems.find((item) => item.key === "direct-integrations") ?? spec.faqItems[0];

  return (
    <section className={styles.section}>
      <div className="v3-container">
        <div className={styles.featureGrid}>
          {spec.features.map((feature, index) => (
            <MarketingCard className={styles.featureCard} id={feature.key} key={feature.key}>
              <span className={styles.cardIcon}>
                <MarketingIcon name={routeIcons["/features"][index % 3] ?? "check"} />
              </span>
              <h2 className={styles.cardTitle}>{feature.title}</h2>
              <p className={styles.cardBody}>{feature.body}</p>
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

function PricingContent({ spec }: Readonly<{ spec: PublicV3Spec }>) {
  return (
    <section className={styles.section}>
      <div className="v3-container">
        <div className={styles.pricingGrid}>
          {spec.pricing.tiers.map((tier) => (
            <MarketingCard className={styles.priceCard} key={tier.name}>
              <MarketingBadge toneName={tier.price.startsWith("$0") ? "teal" : "blue"}>
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
        <div className={styles.faqList}>
          {spec.faqItems.map((item) => (
            <details className={styles.faqItem} key={item.key}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustContent({ spec }: Readonly<{ spec: PublicV3Spec }>) {
  return (
    <section className={styles.section}>
      <div className="v3-container">
        <div className={styles.trustGrid}>
          {spec.trust.map((item, index) => (
            <MarketingCard className={styles.trustCard} key={item.key}>
              <span className={styles.cardIcon}>
                <MarketingIcon name={routeIcons["/trust"][index % 3] ?? "shield"} />
              </span>
              <h2 className={styles.cardTitle}>{item.title}</h2>
              <p className={styles.cardBody}>{item.body}</p>
            </MarketingCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function RouteContent({ path, spec }: Readonly<{ path: PublicV3MarketingRoute; spec: PublicV3Spec }>) {
  switch (path) {
    case "/features":
      return <FeaturesContent spec={spec} />;
    case "/demo":
      return <DemoContent spec={spec} />;
    case "/pricing":
      return <PricingContent spec={spec} />;
    case "/pilot":
      return <PilotContent spec={spec} />;
    case "/faq":
      return <FaqContent spec={spec} />;
    case "/trust":
      return <TrustContent spec={spec} />;
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
            <RouteSignal path={path} spec={spec} />
          </div>
        </section>
        <RouteContent path={path} spec={spec} />
      </main>
      <MarketingFooter copy={spec.nav} language={language} />
    </div>
  );
}
