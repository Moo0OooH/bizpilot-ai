/**
 * ============================================================
 * File: components/public/public-v3-home.tsx
 * Project: BizPilot AI
 * Description: Renders the focused five-section Website V4 homepage in English and Canadian French.
 * Role: Communicates the scattered-message problem, one-link mechanism, organized result, cleaning proof, and truthful pilot conversion path without repeating the story.
 * Related:
 * - app/page.tsx
 * - lib/i18n/public-v3-spec.ts
 * - components/public/public-v3-home.module.css
 * - components/public/marketing-ui.tsx
 * Author: MoOoH
 * Created: 2026-07-13
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Consolidated outcomes into the workflow and trust assurances into the final CTA for a shorter five-section homepage.
 * - 2026-07-13: Created the approved seven-section V3 homepage and three-stage product story.
 * ============================================================
 */

import {
  MarketingBadge,
  MarketingButton,
  MarketingFooter,
  MarketingHeader,
  MarketingIcon,
  type MarketingIconName,
  type MarketingNavCopy,
  MarketingProductFrame,
  MarketingProductStage,
  MarketingShell,
  MarketingStateChip,
} from "@/components/public/marketing-ui";
import type { SupportedLanguage } from "@/lib/i18n/language";
import type { PublicV3Spec } from "@/lib/i18n/public-v3-spec";

import styles from "./public-v3-home.module.css";

type HomeSection = PublicV3Spec["home"]["sections"][number];

const problemSourceIcons: readonly MarketingIconName[] = [
  "camera",
  "phone",
  "globe",
  "inbox",
];
const heroStageIcons: readonly MarketingIconName[] = ["message", "link", "briefcase"];
const requestFieldIcons: readonly MarketingIconName[] = [
  "briefcase",
  "user",
  "target",
  "clock",
];

function sectionCopy(spec: PublicV3Spec, key: string): HomeSection {
  const section = spec.home.sections.find((item) => item.key === key);

  if (!section) {
    throw new Error(`Missing Website V3 homepage section: ${key}`);
  }

  return section;
}

function shellCopy(spec: PublicV3Spec): MarketingNavCopy {
  return {
    brandSubtitle: spec.nav.brandSubtitle,
    copyright: spec.nav.copyright,
    demo: spec.nav.demo,
    faq: spec.nav.faq,
    features: spec.nav.product,
    flow: spec.nav.howItWorks,
    languageLabel: spec.nav.languageLabel,
    pilot: spec.nav.pilot,
    pricing: spec.nav.pricing,
    privacy: spec.nav.privacy,
    resources: spec.nav.resources,
    security: spec.nav.security,
    signIn: spec.nav.signIn,
    startShort: spec.nav.pilot,
    terms: spec.nav.terms,
    trust: spec.nav.trust,
  };
}

function SectionHeading({
  section,
}: Readonly<{ section: HomeSection }>) {
  return (
    <div className={styles.sectionHeading}>
      <p className={styles.eyebrow}>{section.eyebrow}</p>
      <h2>{section.title}</h2>
      <p>{section.body}</p>
    </div>
  );
}

function HeroProductStory({
  spec,
}: Readonly<{ spec: PublicV3Spec }>) {
  const labels = spec.home.visual.stageLabels;

  return (
    <MarketingProductFrame
      className={styles.heroProductFrame ?? ""}
      label={labels.join(" → ")}
    >
      <div className={styles.productChrome} aria-hidden="true">
        <span />
        <span />
        <span />
        <strong>BizPilot AI</strong>
      </div>
      <div className={styles.heroStages}>
        <MarketingProductStage className={styles.storyStage ?? ""}>
          <div className={styles.stageHeader}>
            <span aria-hidden="true"><MarketingIcon name={heroStageIcons[0] ?? "message"} /></span>
            <strong>{labels[0]}</strong>
          </div>
          <div className={styles.messageStack}>
            {spec.home.problemMessages.map((message, index) => (
              <div className={styles.messageBubble} key={message.label}>
                <span>
                  <MarketingIcon name={problemSourceIcons[index % problemSourceIcons.length] ?? "message"} />
                  {message.label}
                </span>
                <strong>{message.value}</strong>
              </div>
            ))}
          </div>
        </MarketingProductStage>

        <div className={styles.storyConnector} aria-hidden="true">
          <span>→</span>
        </div>

        <MarketingProductStage className={`${styles.storyStage} ${styles.linkStage}`}>
          <div className={styles.stageHeader}>
            <span aria-hidden="true"><MarketingIcon name={heroStageIcons[1] ?? "link"} /></span>
            <strong>{labels[1]}</strong>
          </div>
          <div className={styles.intakeLinkCard}>
            <span className={styles.linkIcon}>
              <MarketingIcon name="link" />
            </span>
            <strong>{spec.home.visual.linkCardTitle}</strong>
            <p>{spec.home.visual.linkCardBody}</p>
            <span className={styles.linkButton} aria-hidden="true">
              {spec.nav.howItWorks} →
            </span>
          </div>
        </MarketingProductStage>

        <div className={styles.storyConnector} aria-hidden="true">
          <span>→</span>
        </div>

        <MarketingProductStage className={`${styles.storyStage} ${styles.readyStage}`}>
          <div className={styles.stageHeader}>
            <span aria-hidden="true"><MarketingIcon name={heroStageIcons[2] ?? "briefcase"} /></span>
            <strong>{labels[2]}</strong>
          </div>
          <div className={styles.requestSummary}>
            {spec.demo.result.slice(0, 4).map((item, index) => (
              <div key={item.label}>
                <span aria-label={item.label} role="img" title={item.label}>
                  <MarketingIcon name={requestFieldIcons[index % requestFieldIcons.length] ?? "check"} />
                </span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
          <div className={styles.draftCard}>
            <span>
              <MarketingIcon name="spark" />
              {spec.home.outcomeCards[2]?.title}
            </span>
            <p>{spec.home.visual.replyDraft}</p>
          </div>
        </MarketingProductStage>
      </div>
      <figcaption className={styles.placementNote}>
        <MarketingIcon name="shield" />
        {spec.home.visual.placementNote}
      </figcaption>
    </MarketingProductFrame>
  );
}

export function PublicV3Home({
  language,
  spec,
}: Readonly<{ language: SupportedLanguage; spec: PublicV3Spec }>) {
  const nav = shellCopy(spec);
  const hero = spec.routes["/"].hero;
  const problem = sectionCopy(spec, "problem");
  const workflow = sectionCopy(spec, "workflow");
  const outcomes = sectionCopy(spec, "outcomes");
  const cleaningDemo = sectionCopy(spec, "cleaning-demo");
  const finalCta = sectionCopy(spec, "final-cta");
  const outcomeIcons: readonly MarketingIconName[] = [
    "briefcase",
    "search",
    "message",
    "target",
  ];

  return (
    <div className={`public-site ${styles.page}`}>
      <MarketingHeader
        copy={nav}
        language={language}
        redirectPath="/"
      />

      <main id="main-content">
        <section
          className={styles.heroSection}
          data-v3-section="hero"
        >
          <MarketingShell>
            <div className={styles.heroGrid}>
              <div className={styles.heroCopy}>
                <MarketingBadge>{hero.eyebrow}</MarketingBadge>
                <h1 className={styles.heroTitle}>{hero.title}</h1>
                <p className={styles.heroBody}>{hero.body}</p>
                <div className={styles.heroActions}>
                  <MarketingButton href={hero.primary.href} language={language}>
                    {hero.primary.label}
                    <MarketingIcon name="arrow" />
                  </MarketingButton>
                  <MarketingButton
                    href={hero.secondary.href}
                    language={language}
                    variant="secondary"
                  >
                    {hero.secondary.label}
                  </MarketingButton>
                </div>
                <div className={styles.heroAssurances}>
                  {spec.home.finalAssurances.slice(0, 3).map((item) => (
                    <span key={item}>
                      <MarketingIcon name="check" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <HeroProductStory spec={spec} />
            </div>
          </MarketingShell>
        </section>

        <section
          className={styles.problemSection}
          data-v3-section="problem"
        >
          <MarketingShell>
            <div className={styles.problemGrid}>
              <SectionHeading section={problem} />
              <div className={styles.problemMessages}>
                {spec.home.problemMessages.map((message, index) => (
                  <article key={message.label}>
                    <span className={styles.sourceIcon} aria-hidden="true">
                      <MarketingIcon name={problemSourceIcons[index % problemSourceIcons.length] ?? "message"} />
                    </span>
                    <div>
                      <p>{message.label}</p>
                      <strong>{message.value}</strong>
                    </div>
                    <small>{String(index + 1).padStart(2, "0")}</small>
                  </article>
                ))}
              </div>
            </div>
          </MarketingShell>
        </section>

        <section
          className={styles.workflowSection}
          data-v3-section="workflow"
          id="how-it-works"
        >
          <MarketingShell>
            <SectionHeading section={workflow} />
            <ol className={styles.workflowList}>
              {spec.home.workflowSteps.map((step, index) => (
                <li key={step.key}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className={`${styles.outcomesGrid} ${styles.workflowOutcomeGrid}`}>
              <SectionHeading section={outcomes} />
              <div className={styles.outcomePanel}>
                <div className={styles.outcomeRecordHeader}>
                  <div>
                    <span>{spec.demo.result[0]?.label}</span>
                    <strong>{spec.demo.result[0]?.value}</strong>
                  </div>
                  <MarketingStateChip>
                    <MarketingIcon name="check" />
                    {spec.home.outcomeCards[0]?.title}
                  </MarketingStateChip>
                </div>
                <div className={styles.outcomeList}>
                  {spec.home.outcomeCards.map((item, index) => (
                    <article key={item.key}>
                      <span className={styles.outcomeIcon}>
                        <MarketingIcon name={outcomeIcons[index] ?? "check"} />
                      </span>
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.body}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </MarketingShell>
        </section>

        <section
          className={styles.demoSection}
          data-v3-section="cleaning-demo"
        >
          <MarketingShell>
            <div className={styles.demoHeadingRow}>
              <SectionHeading section={cleaningDemo} />
              <MarketingButton href="/demo" language={language} variant="secondary">
                {spec.nav.demo}
                <MarketingIcon name="arrow" />
              </MarketingButton>
            </div>
            <div className={styles.demoFlow}>
              <article className={styles.demoIncoming}>
                <span className={styles.demoLabel}>01</span>
                <p>{spec.home.problemMessages[0]?.label}</p>
                <blockquote>{spec.demo.incoming}</blockquote>
              </article>
              <article className={styles.demoQuestions}>
                <span className={styles.demoLabel}>02</span>
                <h3>{spec.home.workflowSteps[1]?.title}</h3>
                <div>
                  {spec.demo.questions.slice(0, 3).map((item) => (
                    <p key={item.label}>
                      <strong>{item.label}</strong>
                      <span>{item.value}</span>
                    </p>
                  ))}
                </div>
              </article>
              <article className={styles.demoReady}>
                <span className={styles.demoLabel}>03</span>
                <h3>{spec.home.outcomeCards[2]?.title}</h3>
                <p>{spec.home.visual.replyDraft}</p>
                <div>
                  {spec.demo.reviewActions.map((action) => (
                    <MarketingStateChip key={action}>{action}</MarketingStateChip>
                  ))}
                </div>
              </article>
            </div>
          </MarketingShell>
        </section>

        <section
          className={styles.finalSection}
          data-v3-section="final-cta"
        >
          <MarketingShell>
            <div className={styles.finalPanel}>
              <div>
                <p className={styles.eyebrow}>{finalCta.eyebrow}</p>
                <h2>{finalCta.title}</h2>
                <p>{finalCta.body}</p>
                <div className={styles.finalAssurances}>
                  {spec.home.finalAssurances.map((assurance) => (
                    <span key={assurance}>
                      <MarketingIcon name="shield" />
                      {assurance}
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.finalActions}>
                <MarketingButton href="/demo" language={language}>
                  {spec.nav.demo}
                  <MarketingIcon name="arrow" />
                </MarketingButton>
                <MarketingButton
                  href="/pilot#application"
                  language={language}
                  variant="secondary"
                >
                  {spec.nav.pilot}
                </MarketingButton>
              </div>
            </div>
          </MarketingShell>
        </section>
      </main>

      <MarketingFooter copy={nav} language={language} />
    </div>
  );
}
