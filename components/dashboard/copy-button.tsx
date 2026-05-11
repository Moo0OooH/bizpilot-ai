"use client";

/**
 * ============================================================
 * File: components/dashboard/copy-button.tsx
 * Project: BizPilot AI
 * Description: Provides a small client-side copy button for dashboard actions.
 * Role: Copies public quote links without adding server-side workflow complexity.
 * Related:
 * - app/(dashboard)/dashboard/page.tsx
 * Author: MoOoH
 * Created: 2026-05-11
 * Last Updated: 2026-05-11
 * Change Log:
 * - 2026-05-11: Added reusable copy action for quote links.
 * ============================================================
 */

import { useState } from "react";

import { buttonClass } from "./dashboard-ui";

export function CopyButton({
  label = "Copy",
  value,
}: Readonly<{
  label?: string;
  value: string;
}>) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      className={buttonClass}
      onClick={() => {
        void navigator.clipboard.writeText(value).then(() => {
          setCopied(true);
          window.setTimeout(() => {
            setCopied(false);
          }, 1600);
        });
      }}
      type="button"
    >
      {copied ? "Copied" : label}
    </button>
  );
}
