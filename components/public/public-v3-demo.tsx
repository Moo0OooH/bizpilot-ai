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
 * Last Updated: 2026-07-13
 * Change Log:
 * - 2026-07-13: Created the safe three-stage V3 cleaning walkthrough.
 * ============================================================
 */

"use client";

import { useState } from "react";

import { MarketingCard } from "@/components/public/marketing-ui";
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
            onClick={() => setActiveStage(index)}
            role="tab"
            type="button"
          >
            {index + 1}. {label}
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
          {activeStage === 0 ? (
            <p className={styles.messageBubble}>{copy.incoming}</p>
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
