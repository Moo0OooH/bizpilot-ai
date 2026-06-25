"use client";

/**
 * ============================================================
 * File: components/public/pilot-request-template-card.tsx
 * Project: BizPilot AI
 * Description: Client-side no-endpoint pilot request copy action.
 * Role: Copies the founder pilot request template and reveals a selectable fallback when clipboard access is unavailable.
 * Related:
 * - app/pilot/page.tsx
 * - lib/i18n/public-site-copy.ts
 * Author: MoOoH
 * Created: 2026-06-19
 * Last Updated: 2026-06-25
 * Change Log:
 * - 2026-06-19: Added Branch B pilot copy-template action with clipboard fallback.
 * - 2026-06-25: Removed the fallback template preview's nested scroll cap for final visual acceptance.
 * ============================================================
 */

import Link from "next/link";
import { useRef, useState } from "react";

import type { PilotConversionCopy } from "@/lib/i18n/public-site-copy";
import { trackPublicEvent } from "@/lib/public-events";

export function PilotRequestTemplateCard({
  copy,
}: Readonly<{ copy: PilotConversionCopy }>) {
  const templateRef = useRef<HTMLPreElement | null>(null);
  const [fallbackVisible, setFallbackVisible] = useState(false);
  const [status, setStatus] = useState("");

  function copyWithSelectionFallback() {
    const helper = document.createElement("pre");
    helper.textContent = copy.template;
    helper.style.left = "-9999px";
    helper.style.position = "fixed";
    helper.style.top = "0";
    document.body.appendChild(helper);

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(helper);
    selection?.removeAllRanges();
    selection?.addRange(range);

    let copied = false;

    try {
      copied = document.execCommand("copy");
    } finally {
      selection?.removeAllRanges();
      helper.remove();
    }

    return copied;
  }

  async function handleCopy() {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard API unavailable.");
      }

      await navigator.clipboard.writeText(copy.template);
      setFallbackVisible(false);
      setStatus(copy.copiedStatus);
      trackPublicEvent("pilot_template_copy");
    } catch {
      if (copyWithSelectionFallback()) {
        setFallbackVisible(false);
        setStatus(copy.copiedStatus);
        trackPublicEvent("pilot_template_copy");
        return;
      }

      setFallbackVisible(true);
      setStatus(copy.fallbackBody);
    }
  }

  function handleSelectTemplate() {
    const template = templateRef.current;

    if (!template) {
      return;
    }

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(template);
    selection?.removeAllRanges();
    selection?.addRange(range);
    setStatus(copy.selectedStatus);
    trackPublicEvent("pilot_template_copy");
  }

  return (
    <div className="grid gap-5">
      <div>
        <h2
          className="text-[26px] font-black leading-tight"
          style={{ color: "var(--text-strong)" }}
        >
          {copy.title}
        </h2>
        <p
          className="mt-3 text-[15px] font-bold leading-7"
          style={{ color: "var(--text-default)" }}
        >
          {copy.body}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <button
          className="inline-flex min-h-12 min-w-0 items-center justify-center rounded-[14px] px-5 text-center text-[14px] font-black leading-tight transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
          onClick={handleCopy}
          style={{
            background:
              "linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)",
            boxShadow:
              "0 16px 34px color-mix(in srgb, var(--primary) 22%, transparent)",
            color: "var(--primary-contrast)",
          }}
          type="button"
        >
          {copy.primaryAction}
        </button>
        <Link
          className="inline-flex min-h-12 min-w-0 items-center justify-center rounded-[14px] border px-5 text-center text-[14px] font-black leading-tight transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
          href="/pricing"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border-strong)",
            color: "var(--text-strong)",
          }}
        >
          {copy.secondaryAction}
        </Link>
      </div>

      <p
        aria-live="polite"
        className="min-h-6 text-[13px] font-black"
        data-testid="pilot-copy-status"
        style={{ color: "var(--accent)" }}
      >
        {status}
      </p>

      {fallbackVisible ? (
        <div className="grid gap-3 rounded-[14px] border p-4" style={{ borderColor: "var(--border-default)" }}>
          <p
            className="text-[12px] font-black uppercase tracking-[0.12em]"
            style={{ color: "var(--text-muted)" }}
          >
            {copy.templateLabel}
          </p>
          <pre
            className="whitespace-pre-wrap rounded-[12px] border p-4 text-[13px] font-bold leading-7"
            ref={templateRef}
            style={{
              backgroundColor: "var(--surface-interactive)",
              borderColor: "var(--border-default)",
              color: "var(--text-strong)",
            }}
            tabIndex={0}
          >
            {copy.template}
          </pre>
          <button
            className="inline-flex min-h-11 min-w-0 items-center justify-center justify-self-start rounded-[12px] border px-4 text-[13px] font-black focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
            onClick={handleSelectTemplate}
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border-strong)",
              color: "var(--text-strong)",
            }}
            type="button"
          >
            {copy.selectAction}
          </button>
        </div>
      ) : null}

      <details className="rounded-[14px] border p-4" style={{ borderColor: "var(--border-default)" }}>
        <summary
          className="cursor-pointer text-[14px] font-black"
          style={{ color: "var(--text-strong)" }}
        >
          {copy.previewTitle}
        </summary>
        <div className="mt-4 grid gap-2">
          {copy.previewQuestions.map((question) => (
            <div
              className="rounded-[12px] border px-3 py-2 text-[13px] font-bold"
              key={question}
              style={{
                backgroundColor: "var(--surface-interactive)",
                borderColor: "var(--border-default)",
                color: "var(--text-default)",
              }}
            >
              {question}
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
