"use client";

/**
 * ============================================================
 * File: components/public/quote-form-flow.tsx
 * Project: BizPilot AI
 * Description: Accessible interaction shell for configurable public quote forms.
 * Role: Renders list, tab, or multi-step navigation while preserving one safe server-action form.
 * Related:
 * - components/public/quote-form-wizard.tsx
 * - lib/quote-form-layout.ts
 * Author: MoOoH
 * Created: 2026-07-17
 * Last Updated: 2026-07-17
 * Change Log:
 * - 2026-07-17: Added owner-configurable list, tabs, and validated multi-step behavior.
 * ============================================================
 */

import {
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useFormStatus } from "react-dom";

import type { QuoteFormDisplayMode } from "@/lib/quote-form-layout";

type FlowSection = Readonly<{
  content: ReactNode;
  description?: string | undefined;
  key: string;
  navLabel: string;
  title: string;
}>;

type FlowCopy = Readonly<{
  backButton: string;
  continueButton: string;
  emptySection: string;
  guardrail: string;
  sectionNavigationLabel: string;
  stepProgress: (index: number, total: number, label: string) => string;
  submitButton: string;
}>;

function SubmitButton({ label }: Readonly<{ label: string }>) {
  const status = useFormStatus();

  return (
    <button
      aria-busy={status.pending}
      className="quote-submit-button inline-flex min-h-12 w-full items-center justify-center rounded-[14px] px-5 text-[15px] font-extrabold transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] disabled:cursor-wait disabled:opacity-70 sm:w-auto sm:min-w-[220px]"
      disabled={status.pending}
      style={{
        background:
          "linear-gradient(135deg, var(--primary), var(--primary-hover))",
        boxShadow:
          "0 14px 30px color-mix(in srgb, var(--primary) 22%, transparent)",
        color: "var(--primary-contrast)",
      }}
      type="submit"
    >
      {label}
    </button>
  );
}

function firstInvalidControl(container: ParentNode): HTMLElement | null {
  const controls = Array.from(
    container.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      "input:not([type='hidden']):not(:disabled), select:not(:disabled), textarea:not(:disabled)",
    ),
  );

  return controls.find((control) => !control.checkValidity()) ?? null;
}

function reportInvalidControl(control: HTMLElement | null) {
  if (!control) return;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (
        control instanceof HTMLInputElement ||
        control instanceof HTMLSelectElement ||
        control instanceof HTMLTextAreaElement
      ) {
        control.reportValidity();
      }
      control.focus({ preventScroll: true });
      control.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
}

export function QuoteFormFlow({
  action,
  copy,
  displayMode: requestedDisplayMode,
  hiddenFields,
  sections,
}: Readonly<{
  action: (formData: FormData) => void | Promise<void>;
  copy: FlowCopy;
  displayMode: QuoteFormDisplayMode;
  hiddenFields: ReactNode;
  sections: readonly FlowSection[];
}>) {
  const displayMode =
    sections.length <= 1 ? "list" : requestedDisplayMode;
  const [activeIndex, setActiveIndex] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRefs = useRef<Array<HTMLHeadingElement | null>>([]);

  function focusSection(index: number) {
    setActiveIndex(index);
    requestAnimationFrame(() => {
      const heading = headingRefs.current[index];
      heading?.focus({ preventScroll: true });
      heading?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function validateSection(index: number): boolean {
    const form = formRef.current;
    const section = form?.querySelector<HTMLElement>(
      `[data-quote-section-index="${index}"]`,
    );
    if (!section) return true;
    const invalid = firstInvalidControl(section);
    if (!invalid) return true;
    reportInvalidControl(invalid);
    return false;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const invalid = firstInvalidControl(event.currentTarget);
    if (!invalid) return;

    event.preventDefault();
    const section = invalid.closest<HTMLElement>("[data-quote-section-index]");
    const sectionIndex = Number(section?.dataset.quoteSectionIndex ?? 0);
    if (Number.isFinite(sectionIndex)) setActiveIndex(sectionIndex);
    reportInvalidControl(invalid);
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const currentIndex = Number(event.currentTarget.dataset.tabIndex ?? 0);
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % sections.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + sections.length) % sections.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = sections.length - 1;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    focusSection(nextIndex);
    requestAnimationFrame(() => {
      formRef.current
        ?.querySelector<HTMLButtonElement>(`[data-tab-index="${nextIndex}"]`)
        ?.focus();
    });
  }

  const showGlobalSubmit = displayMode !== "steps";

  return (
    <form
      action={action}
      className="quote-form-shell mx-auto w-full max-w-[780px] space-y-5 px-4 py-6 pb-10 sm:space-y-6 sm:px-8 sm:py-8 sm:pb-12"
      noValidate
      onSubmit={handleSubmit}
      ref={formRef}
    >
      {hiddenFields}

      {displayMode === "list" ? (
        <nav
          aria-label={copy.sectionNavigationLabel}
          className="max-w-full overflow-hidden rounded-[16px] border border-[var(--border-default)] bg-[var(--surface)] p-3 shadow-[var(--shadow-sm)]"
        >
          <ol className="flex max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-1 touch-pan-x sm:grid sm:grid-cols-[repeat(auto-fit,minmax(0,1fr))] sm:overflow-visible sm:pb-0">
            {sections.map((section, index) => (
              <li className="min-w-[8rem] flex-1 sm:min-w-0" key={section.key}>
                <a
                  className="group grid gap-2 rounded-[11px] px-2 py-2 text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
                  href={`#quote-section-${section.key}`}
                >
                  <span
                    aria-hidden
                    className="h-1.5 rounded-full bg-[var(--brand-accent)] transition group-hover:opacity-80"
                  />
                  <span className="truncate text-[11px] font-extrabold text-[var(--text-strong)] sm:text-[12px]">
                    {index + 1}. {section.navLabel}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      {displayMode === "tabs" ? (
        <div
          aria-label={copy.sectionNavigationLabel}
          className="flex max-w-full gap-2 overflow-x-auto overscroll-x-contain rounded-[16px] border border-[var(--border-default)] bg-[var(--surface)] p-2 shadow-[var(--shadow-sm)] touch-pan-x"
          role="tablist"
        >
          {sections.map((section, index) => (
            <button
              aria-controls={`quote-panel-${section.key}`}
              aria-selected={activeIndex === index}
              className={`min-h-11 shrink-0 rounded-[11px] px-4 text-[12px] font-extrabold outline-none transition focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)] ${
                activeIndex === index
                  ? "bg-[var(--primary)] text-[var(--primary-contrast)]"
                  : "bg-[var(--canvas-subtle)] text-[var(--text-strong)]"
              }`}
              data-tab-index={index}
              id={`quote-tab-${section.key}`}
              key={section.key}
              onClick={() => focusSection(index)}
              onKeyDown={handleTabKeyDown}
              role="tab"
              tabIndex={activeIndex === index ? 0 : -1}
              type="button"
            >
              {section.navLabel}
            </button>
          ))}
        </div>
      ) : null}

      {displayMode === "steps" ? (
        <nav
          aria-label={copy.sectionNavigationLabel}
          className="max-w-full overflow-hidden rounded-[16px] border border-[var(--border-default)] bg-[var(--surface)] p-3 shadow-[var(--shadow-sm)]"
        >
          <ol className="flex max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-1 touch-pan-x">
            {sections.map((section, index) => (
              <li className="min-w-[8rem] flex-1" key={section.key}>
                <span
                  aria-current={activeIndex === index ? "step" : undefined}
                  className="grid gap-2 rounded-[11px] px-2 py-2 text-center"
                >
                  <span
                    aria-hidden
                    className={`h-1.5 rounded-full ${
                      index <= activeIndex
                        ? "bg-[var(--brand-accent)]"
                        : "bg-[var(--canvas-subtle)]"
                    }`}
                  />
                  <span className="truncate text-[11px] font-extrabold text-[var(--text-strong)] sm:text-[12px]">
                    {index + 1}. {section.navLabel}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      {sections.map((section, index) => {
        const isActive = displayMode === "list" || activeIndex === index;
        const isLast = index === sections.length - 1;

        return (
          <section
            aria-labelledby={`quote-heading-${section.key}`}
            className="quote-step-card scroll-mt-5 rounded-[20px] border border-[var(--border-default)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)] sm:rounded-[24px] sm:p-6"
            data-quote-section-index={index}
            hidden={!isActive}
            id={
              displayMode === "tabs"
                ? `quote-panel-${section.key}`
                : `quote-section-${section.key}`
            }
            key={section.key}
            role={displayMode === "tabs" ? "tabpanel" : undefined}
          >
            <header className="mb-5 space-y-2">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                {copy.stepProgress(index + 1, sections.length, section.navLabel)}
              </p>
              <div
                aria-hidden
                className="h-1.5 overflow-hidden rounded-full bg-[var(--canvas-subtle)]"
              >
                <div
                  className="h-full rounded-full bg-[var(--brand-accent)]"
                  style={{ width: `${((index + 1) / sections.length) * 100}%` }}
                />
              </div>
              <h2
                className="scroll-mt-5 text-[22px] font-extrabold leading-tight text-[var(--text-strong)] outline-none"
                id={`quote-heading-${section.key}`}
                ref={(element) => {
                  headingRefs.current[index] = element;
                }}
                tabIndex={-1}
              >
                {section.title}
              </h2>
              {section.description ? (
                <p className="text-[14px] leading-6 text-[var(--text-default)]">
                  {section.description}
                </p>
              ) : null}
            </header>

            {section.content}

            {displayMode === "steps" ? (
              <div className="mt-6 flex flex-col-reverse gap-2 border-t border-[var(--border-default)] pt-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  className="inline-flex min-h-12 items-center justify-center rounded-[14px] border border-[var(--border-strong)] bg-[var(--surface)] px-5 text-[14px] font-extrabold text-[var(--text-strong)] disabled:opacity-40"
                  disabled={index === 0}
                  onClick={() => focusSection(index - 1)}
                  type="button"
                >
                  {copy.backButton}
                </button>
                {isLast ? (
                  <SubmitButton label={copy.submitButton} />
                ) : (
                  <button
                    className="inline-flex min-h-12 items-center justify-center rounded-[14px] bg-[var(--primary)] px-5 text-[14px] font-extrabold text-[var(--primary-contrast)] focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
                    onClick={() => {
                      if (validateSection(index)) focusSection(index + 1);
                    }}
                    type="button"
                  >
                    {copy.continueButton}
                  </button>
                )}
              </div>
            ) : null}
          </section>
        );
      })}

      <p
        className="quote-submit-guardrail rounded-[14px] border p-4 text-[13px] leading-6 sm:p-5"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--warning) 12%, var(--surface))",
          borderColor:
            "color-mix(in srgb, var(--warning) 34%, var(--border-default))",
          color: "var(--text-strong)",
        }}
      >
        {copy.guardrail}
      </p>

      {showGlobalSubmit ? (
        <div className="quote-submit-row flex justify-end pt-2">
          <SubmitButton label={copy.submitButton} />
        </div>
      ) : null}
    </form>
  );
}
