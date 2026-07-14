/*
 * ============================================================
 * File: components/public/bizpilot-v2-home.tsx
 * Project: BizPilot AI
 * Description: Universal smart-intake V2 homepage.
 * Role: Shows the customer-request problem, the honest current workflow, human control, cleaning-first validation, and clear conversion paths.
 * Related:
 * - lib/i18n/public-v2-copy.ts
 * - components/public/bizpilot-v2-home.module.css
 * - app/page.tsx
 * Author: MoOoH
 * Created: 2026-07-13
 * Last Updated: 2026-07-13
 * Change Log:
 * - 2026-07-13: Added stable How it works and Use cases anchors for grouped navigation.
 * ============================================================
 */

import {
  MarketingBadge,
  MarketingButton,
  MarketingCard,
  MarketingFooter,
  MarketingHeader,
  MarketingIcon,
  MarketingShell,
  marketingBackground,
  marketingTone,
  type MarketingIconName,
} from "@/components/public/marketing-ui";
import type { SupportedLanguage } from "@/lib/i18n/language";
import type {
  PublicV2Card,
  PublicV2HomeCopy,
} from "@/lib/i18n/public-v2-copy";

import styles from "./bizpilot-v2-home.module.css";

const problemIcons: readonly MarketingIconName[] = ["warning", "link", "clock"];
const flowIcons: readonly MarketingIconName[] = [
  "link",
  "briefcase",
  "search",
  "spark",
  "check",
];
const featureIcons: readonly MarketingIconName[] = [
  "link",
  "briefcase",
  "inbox",
  "search",
  "spark",
  "target",
];

function SectionHeading({
  body,
  eyebrow,
  title,
}: Readonly<{ body?: string; eyebrow: string; title: string }>) {
  return (
    <div className={styles.sectionHeading}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className="bp-section-title bp-copy-section-title">{title}</h2>
      {body ? <p className="bp-body bp-copy-card-body">{body}</p> : null}
    </div>
  );
}

function ToneCard({
  card,
  icon,
}: Readonly<{ card: PublicV2Card; icon: MarketingIconName }>) {
  return (
    <MarketingCard
      className={`${styles.toneCard} ${card.tone ? styles[`tone-${card.tone}`] : ""}`}
    >
      <div className={styles.cardTopline}>
        <span className={styles.cardIcon}>
          <MarketingIcon name={icon} />
        </span>
        {card.badge ? (
          <MarketingBadge toneName={card.tone ?? "neutral"}>{card.badge}</MarketingBadge>
        ) : null}
      </div>
      <h3 className="bp-card-title bp-copy-card-title">{card.title}</h3>
      <p className="bp-copy-card-body">{card.body}</p>
    </MarketingCard>
  );
}

function ProductScene({ copy }: Readonly<{ copy: PublicV2HomeCopy["hero"] }>) {
  return (
    <div
      aria-label={copy.workspace.title}
      className={`homepage-hero-mockup homepage-product-scene ${styles.productScene}`}
    >
      <div className={styles.sceneChrome} aria-hidden="true">
        <span />
        <span />
        <span />
        <strong>BizPilot AI</strong>
      </div>

      <div className={styles.sceneFlow}>
        <section className={styles.placementPanel}>
          <div className={styles.panelHeading}>
            <span className={styles.stepNumber}>01</span>
            <div>
              <p>{copy.workspace.intakeLabel}</p>
              <strong>{copy.placements[0]}</strong>
            </div>
          </div>
          <div className={styles.placementStack}>
            {copy.placements.map((placement, index) => (
              <div className={styles.placementItem} key={placement}>
                <span className={styles.placementIcon}>
                  <MarketingIcon
                    name={index === 0 ? "globe" : index === 1 ? "search" : index === 2 ? "message" : "link"}
                  />
                </span>
                <span>{placement}</span>
                <MarketingIcon name="arrow" />
              </div>
            ))}
          </div>
          <div className={styles.currentTruth}>
            <MarketingIcon name="shield" />
            <span>{copy.note}</span>
          </div>
        </section>

        <div className={styles.flowBridge} aria-hidden="true">
          <span />
          <MarketingIcon name="arrow" />
        </div>

        <section className={styles.intakePanel}>
          <div className={styles.panelHeading}>
            <span className={styles.stepNumber}>02</span>
            <div>
              <p>{copy.workspace.intakeLabel}</p>
              <strong>{copy.workspace.customer}</strong>
            </div>
          </div>
          <p className={styles.requestStatus}>{copy.workspace.status}</p>
          <div className={styles.formPreview}>
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className={styles.intakeSuccess}>
            <MarketingIcon name="check" />
            <span>{copy.proofs[0]?.value}</span>
          </div>
        </section>

        <div className={styles.flowBridge} aria-hidden="true">
          <span />
          <MarketingIcon name="arrow" />
        </div>

        <section className={styles.workspacePanel}>
          <div className={styles.panelHeading}>
            <span className={styles.stepNumber}>03</span>
            <div>
              <p>{copy.workspace.missingLabel}</p>
              <strong>{copy.workspace.title}</strong>
            </div>
          </div>
          <div className={styles.missingGrid}>
            {copy.workspace.fields.map((field) => (
              <div key={field.label}>
                <span>{field.label}</span>
                <strong>{field.value}</strong>
              </div>
            ))}
          </div>
          <div className={styles.draftBox}>
            <div>
              <MarketingIcon name="spark" />
              <strong>{copy.workspace.replyLabel}</strong>
            </div>
            <p>{copy.workspace.draft}</p>
          </div>
          <div className={styles.actionRow}>
            {copy.workspace.actions.map((action, index) => (
              <span className={index === 0 ? styles.primaryAction : ""} key={action}>
                {index === 0 ? <MarketingIcon name="check" /> : null}
                {action}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export function BizPilotV2Home({
  copy,
  language,
}: Readonly<{ copy: PublicV2HomeCopy; language: SupportedLanguage }>) {
  return (
    <main
      className="bp-page public-site min-h-svh"
      style={{ background: marketingBackground, color: marketingTone.text }}
    >
      <MarketingHeader copy={copy.nav} language={language} redirectPath="/" />

      <section className={`homepage-hero-section bp-section-hero ${styles.heroSection}`}>
        <MarketingShell>
          <div className={`homepage-hero-stage ${styles.heroStage}`}>
            <div className={styles.heroCopy}>
              <MarketingBadge>{copy.hero.badge}</MarketingBadge>
              <h1 className={`bp-display bp-copy-hero homepage-hero-title ${styles.heroTitle}`}>
                {copy.hero.title}
              </h1>
              <p className={`bp-body bp-copy-hero-body ${styles.heroBody}`}>
                {copy.hero.body}
              </p>
              <div className={`bp-button-row homepage-hero-actions ${styles.heroActions}`}>
                <MarketingButton href="/demo" language={language}>
                  {copy.hero.primaryCta}
                  <MarketingIcon name="arrow" />
                </MarketingButton>
                <MarketingButton href="/pilot" language={language} variant="secondary">
                  {copy.hero.secondaryCta}
                </MarketingButton>
              </div>
              <div className={`homepage-hero-proof-rail ${styles.proofRail}`}>
                {copy.hero.proofs.map((proof, index) => (
                  <div className={styles.proofItem} key={proof.label}>
                    <span>
                      <MarketingIcon name={index === 0 ? "link" : index === 1 ? "search" : "shield"} />
                    </span>
                    <div>
                      <small>{proof.label}</small>
                      <strong>{proof.value}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <ProductScene copy={copy.hero} />
          </div>
        </MarketingShell>
      </section>

      <section className={`homepage-problem-section bp-section-tight ${styles.statementSection}`}>
        <MarketingShell>
          <MarketingCard className={styles.statementCard ?? ""}>
            <span className={styles.statementIcon}>
              <MarketingIcon name="message" />
            </span>
            <div>
              <h2 className="bp-section-title bp-copy-section-title">{copy.statement.title}</h2>
              <p className="bp-body bp-copy-card-body">{copy.statement.body}</p>
            </div>
          </MarketingCard>
        </MarketingShell>
      </section>

      <section className={`bp-section ${styles.problemSection}`}>
        <MarketingShell>
          <SectionHeading
            body={copy.problem.body}
            eyebrow={copy.problem.eyebrow}
            title={copy.problem.title}
          />
          <div className={`bp-grid-three ${styles.problemGrid}`}>
            {copy.problem.cards.map((card, index) => (
              <ToneCard
                card={card}
                icon={problemIcons[index] ?? "warning"}
                key={card.title}
              />
            ))}
          </div>
        </MarketingShell>
      </section>

      <section className={`bp-section ${styles.flowSection}`} id="how-it-works">
        <MarketingShell>
          <SectionHeading
            body={copy.flow.body}
            eyebrow={copy.flow.eyebrow}
            title={copy.flow.title}
          />
          <div className={`homepage-demo-grid ${styles.flowGrid}`}>
            {copy.flow.steps.map((step, index) => (
              <article className={styles.flowCard} key={step.title}>
                <div className={styles.flowCardTop}>
                  <span>{step.badge}</span>
                  <span>
                    <MarketingIcon name={flowIcons[index] ?? "check"} />
                  </span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
                {index < copy.flow.steps.length - 1 ? (
                  <div className={styles.flowConnector} aria-hidden="true">
                    <span />
                    <MarketingIcon name="arrow" />
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </MarketingShell>
      </section>

      <section className={`bp-section ${styles.controlSection}`}>
        <MarketingShell>
          <div className={styles.controlLayout}>
            <div className={styles.controlCopy}>
              <SectionHeading
                body={copy.control.body}
                eyebrow={copy.control.eyebrow}
                title={copy.control.title}
              />
              <div className={styles.controlPromise}>
                <MarketingIcon name="shield" />
                <strong>{copy.hero.proofs[2]?.value}</strong>
              </div>
            </div>
            <div className={styles.controlSteps}>
              {copy.control.steps.map((step, index) => (
                <div className={styles.controlStep} key={step.title}>
                  <span>
                    <MarketingIcon name={index === 0 ? "search" : index === 1 ? "spark" : index === 2 ? "user" : "message"} />
                  </span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </MarketingShell>
      </section>

      <section className="bp-section">
        <MarketingShell>
          <SectionHeading
            body={copy.day.body}
            eyebrow={copy.day.eyebrow}
            title={copy.day.title}
          />
          <div className={styles.timeline}>
            {copy.day.moments.map((moment, index) => (
              <article className={styles.timelineItem} key={moment.title}>
                <div className={styles.timelineMarker}>
                  <span>{moment.badge}</span>
                  {index < copy.day.moments.length - 1 ? <i aria-hidden="true" /> : null}
                </div>
                <MarketingCard className={styles.timelineCard ?? ""}>
                  <h3>{moment.title}</h3>
                  <p>{moment.body}</p>
                </MarketingCard>
              </article>
            ))}
          </div>
        </MarketingShell>
      </section>

      <section className={`bp-section ${styles.industrySection}`} id="use-cases">
        <MarketingShell>
          <SectionHeading
            body={copy.industries.body}
            eyebrow={copy.industries.eyebrow}
            title={copy.industries.title}
          />
          <div className={`bp-grid-two ${styles.industryGrid}`}>
            {copy.industries.cards.map((card, index) => (
              <ToneCard
                card={card}
                icon={index === 0 ? "briefcase" : "radar"}
                key={card.title}
              />
            ))}
          </div>
        </MarketingShell>
      </section>

      <section className="bp-section">
        <MarketingShell>
          <SectionHeading
            body={copy.features.body}
            eyebrow={copy.features.eyebrow}
            title={copy.features.title}
          />
          <div className={`bp-grid-three ${styles.featureGrid}`}>
            {copy.features.cards.map((card, index) => (
              <MarketingCard className={styles.featureCard ?? ""} key={card.title}>
                <span>
                  <MarketingIcon name={featureIcons[index] ?? "check"} />
                </span>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </MarketingCard>
            ))}
          </div>
          <div className={styles.featureActions}>
            <MarketingButton href="/features" language={language}>
              {copy.nav.features}
              <MarketingIcon name="arrow" />
            </MarketingButton>
            <MarketingButton href="/comparison" language={language} variant="secondary">
              {copy.nav.comparison}
            </MarketingButton>
          </div>
        </MarketingShell>
      </section>

      <section className={`bp-section ${styles.finalSection}`}>
        <MarketingShell>
          <MarketingCard className={styles.finalCard ?? ""}>
            <div className={styles.finalCopy}>
              <MarketingBadge toneName="blue">BizPilot AI</MarketingBadge>
              <h2 className="bp-section-title bp-copy-section-title">{copy.finalCta.title}</h2>
              <p className="bp-body bp-copy-card-body">{copy.finalCta.body}</p>
              <div className={styles.assuranceRow}>
                {copy.finalCta.assurances.map((assurance) => (
                  <span key={assurance}>
                    <MarketingIcon name="check" />
                    {assurance}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.finalActions}>
              <MarketingButton href="/demo" language={language}>
                {copy.finalCta.primary}
                <MarketingIcon name="arrow" />
              </MarketingButton>
              <MarketingButton href="/pilot" language={language} variant="secondary">
                {copy.finalCta.secondary}
              </MarketingButton>
            </div>
          </MarketingCard>
        </MarketingShell>
      </section>

      <MarketingFooter copy={copy.nav} language={language} />
    </main>
  );
}
