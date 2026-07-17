"use client";

/**
 * ============================================================
 * File: components/dashboard/faq-knowledge-editor.tsx
 * Project: BizPilot AI
 * Description: Guided editor for owner-approved FAQ knowledge used by the AI reply assistant.
 * Role: Provides five bilingual-ready starter answers, a live count, and explicit manual-first AI boundaries without adding configuration clutter.
 * Related:
 * - app/(dashboard)/dashboard/configuration/page.tsx
 * - server/services/ai/lead-conversion-assistant.service.ts
 * - server/actions/business-configuration.actions.ts
 * Author: MoOoH
 * Created: 2026-07-16
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Replaced the function-valued count formatter with serializable singular/plural labels for the server-to-client boundary.
 * - 2026-07-16: Added starter FAQ insertion, clear control, live count, and visible AI knowledge guardrails.
 * ============================================================
 */

import { useMemo, useState } from "react";

type FaqKnowledgeEditorCopy = Readonly<{
  clearExamples: string;
  countMany: string;
  countOne: string;
  guardrailTitle: string;
  guardrails: readonly string[];
  help: string;
  label: string;
  loadExamples: string;
}>;

function countFaqLines(value: string): number {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.includes("|") && line.split("|")[0]?.trim()).length;
}

export function FaqKnowledgeEditor({
  copy,
  examples,
  initialValue,
}: Readonly<{
  copy: FaqKnowledgeEditorCopy;
  examples: readonly string[];
  initialValue: string;
}>) {
  const exampleText = examples.join("\n");
  const [value, setValue] = useState(initialValue.trim() || exampleText);
  const count = useMemo(() => countFaqLines(value), [value]);

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <label className="text-[13px] font-bold text-[var(--dash-text)]" htmlFor="business-faq-knowledge">
            {copy.label}
          </label>
          <span className="rounded-full border border-[var(--dash-primary-border)] bg-[var(--dash-primary-soft)] px-2.5 py-1 text-[11px] font-black text-[var(--dash-primary-strong)]">
            {count} {count === 1 ? copy.countOne : copy.countMany}
          </span>
        </div>
        <textarea
          className="biz-field min-h-52 w-full rounded-lg border px-3 py-3 text-[13px] leading-6 outline-none transition focus:border-[var(--dash-primary)]"
          id="business-faq-knowledge"
          name="faqs"
          onChange={(event) => setValue(event.currentTarget.value)}
          value={value}
        />
        <p className="mt-2 text-[12px] leading-5 text-[var(--dash-text-muted)]">
          {copy.help}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            className="biz-button-secondary inline-flex h-9 items-center justify-center rounded-lg border px-3 text-[12px] font-bold"
            onClick={() => setValue(exampleText)}
            type="button"
          >
            {copy.loadExamples}
          </button>
          <button
            className="biz-button-secondary inline-flex h-9 items-center justify-center rounded-lg border px-3 text-[12px] font-bold"
            onClick={() => setValue("")}
            type="button"
          >
            {copy.clearExamples}
          </button>
        </div>
      </div>

      <aside className="rounded-lg border border-[var(--dash-primary-border)] bg-[var(--dash-primary-soft)] p-4">
        <h3 className="text-[13px] font-black text-[var(--dash-text)]">
          {copy.guardrailTitle}
        </h3>
        <ul className="mt-3 grid gap-2.5">
          {copy.guardrails.map((guardrail) => (
            <li
              className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-2 text-[12px] leading-5 text-[var(--dash-text-secondary)]"
              key={guardrail}
            >
              <span
                aria-hidden
                className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--dash-primary)] text-[10px] font-black text-white"
              >
                ✓
              </span>
              <span>{guardrail}</span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
