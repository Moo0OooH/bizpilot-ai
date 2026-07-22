"use client";

/**
 * ============================================================
 * File: components/dashboard/copy-and-record-reply-button.tsx
 * Project: BizPilot AI
 * Description: Copies an approved Premium Operations reply and records the manual copy only after clipboard success.
 * Role: Prevents copy-log acknowledgements from being recorded before the browser confirms the manual clipboard action.
 * Related:
 * - components/dashboard/premium-operations-workspace.tsx
 * - server/actions/premium-operations.actions.ts
 * Author: MoOoH
 * Created: 2026-07-22
 * Last Updated: 2026-07-22
 * Change Log:
 * - 2026-07-22: Added one-step approved reply copy with success-gated server logging.
 * ============================================================
 */

import { useRef, useState } from "react";

import { buttonClass } from "@/components/dashboard/dashboard-ui";
import { recordBulkReplyCopiedAction } from "@/server/actions/premium-operations.actions";

export function CopyAndRecordReplyButton({
  failedLabel,
  label,
  recipientId,
  value,
}: Readonly<{
  failedLabel: string;
  label: string;
  recipientId: string;
  value: string;
}>) {
  const formRef = useRef<HTMLFormElement>(null);
  const [copyFailed, setCopyFailed] = useState(false);
  const [copying, setCopying] = useState(false);

  return (
    <form action={recordBulkReplyCopiedAction} ref={formRef}>
      <input name="recipientId" type="hidden" value={recipientId} />
      <button
        className={buttonClass}
        disabled={copying}
        onClick={() => {
          if (!navigator.clipboard) {
            setCopyFailed(true);
            return;
          }
          setCopyFailed(false);
          setCopying(true);
          void navigator.clipboard
            .writeText(value)
            .then(() => formRef.current?.requestSubmit())
            .catch(() => {
              setCopyFailed(true);
              setCopying(false);
            });
        }}
        type="button"
      >
        {copyFailed ? failedLabel : label}
      </button>
    </form>
  );
}
