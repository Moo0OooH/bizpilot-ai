/**
 * ============================================================
 * File: components/public/public-v3-demo.tsx
 * Project: BizPilot AI
 * Description: Lightweight interactive walkthrough for the cleaning Smart Intake Link demo.
 * Role: Lets visitors inspect the vague message, intake questions, and review-ready result without submitting data or triggering automation.
 * Related:
 * - components/public/public-v3-page.tsx
 * - components/public/public-v3-page.module.css
 * - lib/i18n/public-v3-spec.ts
 * Author: MoOoH
 * Created: 2026-07-13
 * Last Updated: 2026-07-17
 * Change Log:
 * - 2026-07-17: Reworked the walkthrough into a numbered, high-context stage navigator with a clearer active work surface.
 * - 2026-07-13: Added roving focus and arrow, Home, and End keyboard behavior for the accessible tab pattern.
 * - 2026-07-13: Created the safe three-stage V3 cleaning walkthrough.
 * ============================================================
 */

"use client";

import { useRef, useState } from "react";

import {
  MarketingCard,
  MarketingIcon,
  MarketingStateChip,
} from "@/components/public/marketing-ui";
import type { PublicV3Spec } from "@/lib/i18n/public-v3-spec";

import styles from "./public-v3-page.module.css";

export function PublicV3Demo({
  copy,
  draft,
  labels,
}: Readonly<{
  copy: PublicV3Spec["demo"];
  draft: string;
  labels: readonly [string, string, string];
}>) {
  const [activeStage, setActiveStage] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function selectStage(index: number) {
    setActiveStage(index);
    tabRefs.current[index]?.focus();
  }

  function handleTabKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    const lastIndex = labels.length - 1;
    let nextIndex: number | undefined;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = index === lastIndex ? 0 : index + 1;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = index === 0 ? lastIndex : index - 1;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = lastIndex;
    }

    if (nextIndex !== undefined) {
      event.preventDefault();
      selectStage(nextIndex);
    }
  }

  return (
    <div className={styles.demoPanel} id="demo">
      <div aria-label={labels.join(", ")} className={styles.demoTabs} role="tablist">
        {labels.map((label, index) => (
          <button
            aria-controls={`demo-panel-${index}`}
            aria-selected={activeStage === index}
            className={styles.demoTab}
            id={`demo-tab-${index}`}
            key={label}
            onKeyDown={(event) => handleTabKeyDown(event, index)}
            onClick={() => setActiveStage(index)}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            role="tab"
            tabIndex={activeStage === index ? 0 : -1}
            type="button"
          >
            <span className={styles.demoTabNumber}>{String(index + 1).padStart(2, "0")}</span>
            <span className={styles.demoTabLabel}>{label}</span>
            <span className={styles.demoTabState} aria-hidden="true" />
          </button>
        ))}
      </div>

      <MarketingCard className={styles.demoContent}>
        <div
          aria-labelledby={`demo-tab-${activeStage}`}
          id={`demo-panel-${activeStage}`}
          role="tabpanel"
          tabIndex={0}
        >
          <div className={styles.demoContentHeader}>
            <MarketingStateChip>{String(activeStage + 1).padStart(2, "0")}</MarketingStateChip>
            <strong>{labels[activeStage]}</strong>
            <MarketingIcon name={activeStage === 2 ? "check" : activeStage === 1 ? "search" : "message"} />
          </div>
          {activeStage === 0 ? (
            <div className={styles.incomingScene}>
              <span><MarketingIcon name="message" /></span>
              <p className={styles.messageBubble}>{copy.incoming}</p>
            </div>
          ) : null}

          {activeStage === 1 ? (
            <div className={styles.demoGrid}>
              {copy.questions.map((item) => (
                <div className={styles.demoDatum} key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          ) : null}

          {activeStage === 2 ? (
            <>
              <div className={styles.demoGrid}>
                {copy.result.map((item) => (
                  <div className={styles.demoDatum} key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
              <blockquote className={styles.draft}>{draft}</blockquote>
              <div className={styles.reviewActions}>
                {copy.reviewActions.map((action) => (
                  <span key={action}>{action}</span>
                ))}
              </div>
            </>
          ) : null}

          <p className={styles.boundary}>{copy.reviewBoundary}</p>
        </div>
      </MarketingCard>
    </div>
  );
}
