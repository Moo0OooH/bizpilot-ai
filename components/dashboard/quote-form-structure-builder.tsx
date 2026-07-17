"use client";

/**
 * ============================================================
 * File: components/dashboard/quote-form-structure-builder.tsx
 * Project: BizPilot AI
 * Description: Owner-facing quote form structure and presentation editor.
 * Role: Edits the public form header, display mode, ordered sections, and field assignments.
 * Related:
 * - app/(dashboard)/dashboard/configuration/page.tsx
 * - lib/quote-form-layout.ts
 * - components/public/quote-form-flow.tsx
 * Author: MoOoH
 * Created: 2026-07-17
 * Last Updated: 2026-07-17
 * Change Log:
 * - 2026-07-17: Added the versioned list, tabs, and multi-step structure editor.
 * ============================================================
 */

import { useEffect, useMemo, useRef, useState } from "react";

import {
  MAX_QUOTE_FORM_SECTIONS,
  type QuoteFormDisplayMode,
  type QuoteFormLayout,
  type QuoteFormSection,
} from "@/lib/quote-form-layout";

export const QUOTE_FORM_SECTIONS_EVENT = "bizpilot:quote-form-sections";

export type QuoteFormBuilderSectionOption = Readonly<{
  key: string;
  label: string;
}>;

export type QuoteFormStructureCopy = Readonly<{
  addSection: string;
  assignmentDescription: string;
  assignmentTitle: string;
  description: string;
  displayMode: string;
  displayModeHelp: Readonly<Record<QuoteFormDisplayMode, string>>;
  displayModeLabels: Readonly<Record<QuoteFormDisplayMode, string>>;
  formHeader: string;
  formSubtitle: string;
  formTitle: string;
  hiddenSection: string;
  languageNotice: string;
  livePreview: string;
  moveDown: string;
  moveUp: string;
  newSectionName: string;
  question: string;
  removeSection: string;
  sectionDescription: string;
  sectionNavigationLabel: string;
  sectionTitle: string;
  sections: string;
  showSection: string;
  title: string;
  visibleSection: string;
}>;

type StructureField = Readonly<{
  fieldKey: string;
  label: string;
  sectionKey?: string;
}>;

const inputClass =
  "biz-field h-10 w-full min-w-0 rounded-lg border px-3 text-[13px] outline-none transition focus:border-[var(--dash-primary)]";
const textareaClass =
  "biz-field min-h-20 w-full min-w-0 rounded-lg border px-3 py-2 text-[13px] outline-none transition focus:border-[var(--dash-primary)]";

function moveItem<T>(items: readonly T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length || from === to) return [...items];
  const next = [...items];
  const [item] = next.splice(from, 1);
  if (item !== undefined) next.splice(to, 0, item);
  return next;
}

function nextSectionKey(sections: readonly QuoteFormSection[], seed: number) {
  const existing = new Set(sections.map((section) => section.key));
  let candidate = Math.max(seed, 1);
  while (existing.has(`custom_section_${candidate}`)) candidate += 1;
  return { key: `custom_section_${candidate}`, nextSeed: candidate + 1 };
}

export function QuoteFormStructureBuilder({
  copy,
  fields,
  initialLayout,
}: Readonly<{
  copy: QuoteFormStructureCopy;
  fields: readonly StructureField[];
  initialLayout: QuoteFormLayout;
}>) {
  const [displayMode, setDisplayMode] =
    useState<QuoteFormDisplayMode>(initialLayout.displayMode);
  const [formTitle, setFormTitle] = useState(initialLayout.header.title);
  const [formSubtitle, setFormSubtitle] = useState(
    initialLayout.header.subtitle ?? "",
  );
  const [sections, setSections] = useState<readonly QuoteFormSection[]>(
    initialLayout.sections,
  );
  const [assignments, setAssignments] = useState<Record<string, string>>(() => {
    const fallback = initialLayout.sections[0]?.key ?? "service";
    return Object.fromEntries(
      fields.map((field) => [field.fieldKey, field.sectionKey ?? fallback]),
    );
  });
  const nextSectionSeed = useRef(initialLayout.sections.length + 1);
  const visibleSectionCount = sections.filter(
    (section) => !section.isHidden,
  ).length;
  const sectionOptions = useMemo<readonly QuoteFormBuilderSectionOption[]>(
    () =>
      sections.map((section) => ({
        key: section.key,
        label: section.navLabel,
      })),
    [sections],
  );

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent(QUOTE_FORM_SECTIONS_EVENT, {
        detail: { sections: sectionOptions },
      }),
    );
  }, [sectionOptions]);

  function updateSection(
    key: string,
    update: Partial<QuoteFormSection>,
  ) {
    setSections((current) =>
      current.map((section) =>
        section.key === key ? { ...section, ...update } : section,
      ),
    );
  }

  function addSection() {
    if (sections.length >= MAX_QUOTE_FORM_SECTIONS) return;
    const generated = nextSectionKey(sections, nextSectionSeed.current);
    nextSectionSeed.current = generated.nextSeed;
    const label = `${copy.newSectionName} ${sections.length + 1}`;
    setSections((current) => [
      ...current,
      {
        description: "",
        isHidden: false,
        key: generated.key,
        navLabel: label,
        sortOrder: (current.length + 1) * 10,
        title: label,
      },
    ]);
  }

  function removeSection(key: string) {
    if (sections.length <= 1) return;
    const remaining = sections.filter((section) => section.key !== key);
    const fallback = remaining.find((section) => !section.isHidden)?.key ??
      remaining[0]?.key;
    if (!fallback) return;
    setSections(remaining);
    setAssignments((current) =>
      Object.fromEntries(
        Object.entries(current).map(([fieldKey, sectionKey]) => [
          fieldKey,
          sectionKey === key ? fallback : sectionKey,
        ]),
      ),
    );
  }

  return (
    <div className="mb-4 grid min-w-0 gap-4 rounded-xl border border-[var(--dash-primary-border)] bg-[var(--dash-primary-soft)] p-3.5 sm:p-4 2xl:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="min-w-0">
        <div>
          <h3 className="text-[17px] font-black text-[var(--dash-text)]">
            {copy.title}
          </h3>
          <p className="mt-1 max-w-3xl text-[12px] leading-5 text-[var(--dash-text-secondary)]">
            {copy.description}
          </p>
          <p className="mt-2 text-[11px] font-semibold text-[var(--dash-primary-strong)]">
            {copy.languageNotice}
          </p>
        </div>

        <fieldset className="mt-4">
          <legend className="text-[12px] font-black text-[var(--dash-text)]">
            {copy.displayMode}
          </legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {(["list", "tabs", "steps"] as const).map((mode) => (
              <label
                className={`cursor-pointer rounded-lg border p-3 transition ${
                  displayMode === mode
                    ? "border-[var(--dash-primary)] bg-[var(--dash-surface)] shadow-sm"
                    : "border-[var(--dash-border)] bg-[var(--dash-surface-muted)]"
                }`}
                key={mode}
              >
                <span className="flex items-center gap-2 text-[12px] font-black text-[var(--dash-text)]">
                  <input
                    checked={displayMode === mode}
                    name="formDisplayMode"
                    onChange={() => setDisplayMode(mode)}
                    type="radio"
                    value={mode}
                  />
                  {copy.displayModeLabels[mode]}
                </span>
                <span className="mt-1.5 block text-[11px] leading-4 text-[var(--dash-text-muted)]">
                  {copy.displayModeHelp[mode]}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-4 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3.5">
          <legend className="px-1 text-[12px] font-black text-[var(--dash-text)]">
            {copy.formHeader}
          </legend>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-1 text-[12px] font-bold text-[var(--dash-text)]">
              {copy.formTitle}
              <input
                className={inputClass}
                maxLength={100}
                name="formTitle"
                onChange={(event) => setFormTitle(event.currentTarget.value)}
                required
                type="text"
                value={formTitle}
              />
            </label>
            <label className="grid gap-1 text-[12px] font-bold text-[var(--dash-text)]">
              {copy.formSubtitle}
              <input
                className={inputClass}
                maxLength={240}
                name="formSubtitle"
                onChange={(event) => setFormSubtitle(event.currentTarget.value)}
                type="text"
                value={formSubtitle}
              />
            </label>
          </div>
        </fieldset>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="text-[14px] font-black text-[var(--dash-text)]">
              {copy.sections}
            </h4>
            <p className="text-[11px] text-[var(--dash-text-muted)]">
              {sections.length}/{MAX_QUOTE_FORM_SECTIONS}
            </p>
          </div>
          <button
            className="biz-button-secondary inline-flex h-9 items-center justify-center rounded-lg border px-3 text-[12px] font-bold disabled:cursor-not-allowed disabled:opacity-50"
            disabled={sections.length >= MAX_QUOTE_FORM_SECTIONS}
            onClick={addSection}
            type="button"
          >
            + {copy.addSection}
          </button>
        </div>

        <div className="mt-2 grid gap-2.5">
          {sections.map((section, index) => {
            return (
              <article
                className="min-w-0 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3"
                key={section.key}
              >
                <input name="formSectionKeys" type="hidden" value={section.key} />
                <input
                  name={`sectionSort:${section.key}`}
                  type="hidden"
                  value={(index + 1) * 10}
                />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--dash-primary)] text-[11px] font-black text-white">
                      {index + 1}
                    </span>
                    <span className="truncate text-[12px] font-black text-[var(--dash-text)]">
                      {section.navLabel}
                    </span>
                    <span className="rounded-full border border-[var(--dash-border)] px-2 py-0.5 text-[10px] font-bold text-[var(--dash-text-muted)]">
                      {section.isHidden ? copy.hiddenSection : copy.visibleSection}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      aria-label={copy.moveUp}
                      className="biz-button-secondary h-8 rounded-md border px-2 text-[11px] font-bold disabled:opacity-40"
                      disabled={index === 0}
                      onClick={() =>
                        setSections((current) => moveItem(current, index, index - 1))
                      }
                      type="button"
                    >
                      ↑
                    </button>
                    <button
                      aria-label={copy.moveDown}
                      className="biz-button-secondary h-8 rounded-md border px-2 text-[11px] font-bold disabled:opacity-40"
                      disabled={index === sections.length - 1}
                      onClick={() =>
                        setSections((current) => moveItem(current, index, index + 1))
                      }
                      type="button"
                    >
                      ↓
                    </button>
                    <button
                      className="h-8 rounded-md px-2 text-[11px] font-bold text-[var(--dash-danger-strong)] disabled:opacity-40"
                      disabled={sections.length <= 1}
                      onClick={() => removeSection(section.key)}
                      type="button"
                    >
                      {copy.removeSection}
                    </button>
                  </div>
                </div>
                <div className="mt-3 grid gap-2.5 md:grid-cols-2">
                  <label className="grid gap-1 text-[11px] font-bold text-[var(--dash-text)]">
                    {copy.sectionNavigationLabel}
                    <input
                      className={inputClass}
                      maxLength={40}
                      name={`sectionLabel:${section.key}`}
                      onChange={(event) =>
                        updateSection(section.key, {
                          navLabel: event.currentTarget.value,
                        })
                      }
                      required
                      type="text"
                      value={section.navLabel}
                    />
                  </label>
                  <label className="grid gap-1 text-[11px] font-bold text-[var(--dash-text)]">
                    {copy.sectionTitle}
                    <input
                      className={inputClass}
                      maxLength={100}
                      name={`sectionTitle:${section.key}`}
                      onChange={(event) =>
                        updateSection(section.key, {
                          title: event.currentTarget.value,
                        })
                      }
                      required
                      type="text"
                      value={section.title}
                    />
                  </label>
                  <label className="grid gap-1 text-[11px] font-bold text-[var(--dash-text)] md:col-span-2">
                    {copy.sectionDescription}
                    <textarea
                      className={textareaClass}
                      maxLength={240}
                      name={`sectionDescription:${section.key}`}
                      onChange={(event) =>
                        updateSection(section.key, {
                          description: event.currentTarget.value,
                        })
                      }
                      value={section.description ?? ""}
                    />
                  </label>
                </div>
                <label className="mt-2.5 flex min-h-8 items-center gap-2 text-[11px] font-bold text-[var(--dash-text-secondary)]">
                  <input
                    aria-disabled={!section.isHidden && visibleSectionCount <= 1}
                    checked={!section.isHidden}
                    name={`sectionVisible:${section.key}`}
                    onChange={(event) => {
                      if (!event.currentTarget.checked && visibleSectionCount <= 1) {
                        return;
                      }
                      updateSection(section.key, {
                        isHidden: !event.currentTarget.checked,
                      });
                    }}
                    type="checkbox"
                  />
                  {copy.showSection}
                </label>
              </article>
            );
          })}
        </div>

        <fieldset className="mt-4 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3.5">
          <legend className="px-1 text-[12px] font-black text-[var(--dash-text)]">
            {copy.assignmentTitle}
          </legend>
          <p className="mb-3 text-[11px] leading-4 text-[var(--dash-text-muted)]">
            {copy.assignmentDescription}
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {fields.map((field) => (
              <label
                className="grid min-w-0 gap-1 rounded-md border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-2.5 text-[11px] font-bold text-[var(--dash-text)]"
                key={field.fieldKey}
              >
                <span className="truncate">{field.label}</span>
                <select
                  className={inputClass}
                  name={`fieldSection:${field.fieldKey}`}
                  onChange={(event) =>
                    setAssignments((current) => ({
                      ...current,
                      [field.fieldKey]: event.currentTarget.value,
                    }))
                  }
                  value={assignments[field.fieldKey] ?? sections[0]?.key}
                >
                  {sections.map((section) => (
                    <option key={section.key} value={section.key}>
                      {section.navLabel}
                      {section.isHidden ? ` (${copy.hiddenSection})` : ""}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <aside className="h-fit min-w-0 rounded-lg border border-[var(--dash-primary-border)] bg-[var(--dash-surface)] p-3.5 2xl:sticky 2xl:top-20">
        <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[var(--dash-primary-strong)]">
          {copy.livePreview}
        </p>
        <h4 className="mt-2 break-words text-[18px] font-black text-[var(--dash-text)]">
          {formTitle}
        </h4>
        {formSubtitle ? (
          <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
            {formSubtitle}
          </p>
        ) : null}
        <div className="mt-3 flex max-w-full gap-1.5 overflow-x-auto pb-1">
          {sections
            .filter((section) => !section.isHidden)
            .map((section, index) => (
              <span
                className="shrink-0 rounded-full border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-2.5 py-1 text-[10px] font-bold text-[var(--dash-text-secondary)]"
                key={section.key}
              >
                {displayMode === "steps" ? `${index + 1}. ` : ""}
                {section.navLabel}
              </span>
            ))}
        </div>
        <div className="mt-3 grid gap-2">
          {sections
            .filter((section) => !section.isHidden)
            .slice(0, displayMode === "list" ? undefined : 1)
            .map((section) => (
              <div
                className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3"
                key={section.key}
              >
                <p className="text-[12px] font-black text-[var(--dash-text)]">
                  {section.title}
                </p>
                {section.description ? (
                  <p className="mt-1 text-[10px] leading-4 text-[var(--dash-text-muted)]">
                    {section.description}
                  </p>
                ) : null}
              </div>
            ))}
        </div>
      </aside>
    </div>
  );
}
