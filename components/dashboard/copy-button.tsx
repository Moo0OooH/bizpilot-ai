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
 * Last Updated: 2026-05-18
 * Change Log:
 * - 2026-05-11: Added reusable copy action for quote links.
 * - 2026-05-18: Added safe absolute-link copying and error fallback for pilot demos.
 * ============================================================
 */

import { useState } from "react";

import { buttonClass } from "./dashboard-ui";

function resolveCopyValue(value: string): string {
  if (typeof window === "undefined") {
    return value;
  }

  if (value.startsWith("http") || value.startsWith("mailto:") || value.startsWith("tel:")) {
    return value;
  }

  if (value.startsWith("/")) {
    return `${window.location.origin}${value}`;
  }

  return value;
}

export function CopyButton({
  className = "",
  label = "Copy",
  value,
}: Readonly<{
  className?: string;
  label?: string;
  value: string;
}>) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <button
      className={`${buttonClass} ${className}`}
      onClick={() => {
        const nextValue = resolveCopyValue(value);

        if (!navigator.clipboard) {
          setFailed(true);
          window.setTimeout(() => setFailed(false), 1800);
          return;
        }

        void navigator.clipboard
          .writeText(nextValue)
          .then(() => {
            setFailed(false);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
          })
          .catch(() => {
            setCopied(false);
            setFailed(true);
            window.setTimeout(() => setFailed(false), 1800);
          });
      }}
      type="button"
    >
      {failed ? "Copy failed" : copied ? "Copied" : label}
    </button>
  );
}
