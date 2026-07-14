/**
 * ============================================================
 * File: components/public/public-v3-pilot-request.tsx
 * Project: BizPilot AI
 * Description: Safe copy-only founder-pilot request card for the Website V3 pilot page.
 * Role: Prepares a localized request template without submission, storage, account creation, charging, or an empty-recipient email action.
 * Related:
 * - components/public/public-v3-page.tsx
 * - components/public/public-v3-page.module.css
 * - lib/i18n/public-v3-spec.ts
 * Author: MoOoH
 * Created: 2026-07-13
 * Last Updated: 2026-07-13
 * Change Log:
 * - 2026-07-13: Created the V3 copy-only pilot request mechanism and removed the recipient-free email dead end.
 * ============================================================
 */

"use client";

import { useMemo, useRef, useState } from "react";

import { MarketingCard } from "@/components/public/marketing-ui";
import type { PublicV3Spec } from "@/lib/i18n/public-v3-spec";
import { trackPublicEvent } from "@/lib/public-events";

import styles from "./public-v3-page.module.css";

export function PublicV3PilotRequest({
  copy,
}: Readonly<{ copy: PublicV3Spec["pilot"] }>) {
  const templateRef = useRef<HTMLPreElement | null>(null);
  const [status, setStatus] = useState("");
  const template = useMemo(
    () =>
      [
        copy.applicationTemplateTitle,
        "",
        ...copy.applicationFields.map((field) => `${field}: `),
      ].join("\n"),
    [copy],
  );

  function selectTemplate() {
    if (!templateRef.current) {
      return;
    }

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(templateRef.current);
    selection?.removeAllRanges();
    selection?.addRange(range);
    setStatus(copy.applicationSelectFallback);
    trackPublicEvent("pilot_template_copy");
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(template);
      setStatus(copy.applicationCopied);
      trackPublicEvent("pilot_template_copy");
    } catch {
      selectTemplate();
    }
  }

  return (
    <MarketingCard className={styles.applicationCard} id="application">
      <p className={styles.eyebrow}>{copy.applicationAction}</p>
      <pre className={styles.template} ref={templateRef} tabIndex={0}>
        {template}
      </pre>
      <div className={styles.copyRow}>
        <button className={styles.copyButton} onClick={handleCopy} type="button">
          {copy.applicationAction}
        </button>
        <span aria-live="polite" className={styles.copyStatus}>
          {status}
        </span>
      </div>
      <p className={styles.boundary}>{copy.submissionBoundary}</p>
    </MarketingCard>
  );
}
