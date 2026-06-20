"use client";

/**
 * ============================================================
 * File: components/public/tracked-external-reference-link.tsx
 * Project: BizPilot AI
 * Description: Client-side official-reference link card with typed no-op instrumentation.
 * Role: Keeps external legal/security reference clicks documented without adding analytics.
 * Related:
 * - components/public/policy-page.tsx
 * - lib/public-events.ts
 * Author: MoOoH
 * Created: 2026-06-20
 * ============================================================
 */

import { trackPublicEvent } from "@/lib/public-events";

function ExternalIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M7 17 17 7M9 7h8v8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M14 19H5V10"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function TrackedExternalReferenceLink({
  description,
  href,
  newTabLabel,
  title,
}: Readonly<{
  description: string;
  href: string;
  newTabLabel: string;
  title: string;
}>) {
  return (
    <a
      className="grid min-w-0 gap-2 rounded-[14px] border p-4 text-left transition hover:bg-[var(--surface-interactive)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
      href={href}
      onClick={() => trackPublicEvent("external_reference_click")}
      rel="noopener noreferrer"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border-default)",
      }}
      target="_blank"
    >
      <span className="flex min-w-0 items-start justify-between gap-3">
        <span
          className="min-w-0 text-[14px] font-black leading-6"
          style={{ color: "var(--text-strong)" }}
        >
          {title}
        </span>
        <span
          className="mt-1 shrink-0"
          style={{ color: "var(--primary)" }}
        >
          <ExternalIcon />
        </span>
      </span>
      <span
        className="text-[13px] leading-6"
        style={{ color: "var(--text-default)" }}
      >
        {description}
      </span>
      <span
        className="text-[11px] font-black uppercase tracking-[0.08em]"
        style={{ color: "var(--text-muted)" }}
      >
        {newTabLabel}
      </span>
    </a>
  );
}
