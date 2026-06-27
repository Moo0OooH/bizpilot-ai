"use client";

import { useMemo, useRef, useState } from "react";

import type {
  FieldBuilderCopy,
  QuoteFieldType,
} from "@/components/dashboard/quote-field-type-control";

type CustomFieldBuilderCopy = FieldBuilderCopy &
  Readonly<{
    addAnotherField: string;
    advancedSettings: string;
    customFieldBuilder: string;
    fieldKey: string;
    fieldKeyHelp: string;
    helperText: string;
    newFieldName: string;
    options: string;
    optionsHelp: string;
    priority: string;
    removeField: string;
    required: string;
    showOnPublicForm: string;
  }>;

type DraftField = Readonly<{
  id: string;
  type: QuoteFieldType;
}>;

const configurableFieldTypes: readonly QuoteFieldType[] = [
  "text",
  "textarea",
  "email",
  "phone",
  "number",
  "select",
  "radio",
  "boolean",
  "date",
  "time_window",
];

const choiceFieldTypes = new Set<QuoteFieldType>([
  "radio",
  "select",
  "time_window",
]);

const fieldInputClass =
  "biz-field h-10 w-full rounded-lg border px-3 text-[13px] outline-none transition focus:border-[var(--dash-primary)]";
const fieldTextareaClass =
  "biz-field min-h-24 w-full rounded-lg border px-3 py-2 text-[13px] outline-none transition focus:border-[var(--dash-primary)]";

function createDraftField(index: number): DraftField {
  return {
    id: `custom_${index}`,
    type: "text",
  };
}

export function CustomQuoteFieldBuilder({
  copy,
}: Readonly<{
  copy: CustomFieldBuilderCopy;
}>) {
  const nextIndex = useRef(2);
  const [fields, setFields] = useState<readonly DraftField[]>([
    createDraftField(1),
  ]);
  const defaultPriorityById = useMemo(
    () =>
      Object.fromEntries(
        fields.map((field, index) => [field.id, String((index + 13) * 10)]),
      ),
    [fields],
  );

  return (
    <div className="mt-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <div>
          <h3 className="text-sm font-extrabold text-[var(--dash-text)]">
            {copy.addAnotherField}
          </h3>
          <p className="mt-1 text-xs leading-5 text-[var(--dash-text-secondary)]">
            {copy.customFieldBuilder}
          </p>
        </div>
        <button
          className="biz-button-secondary inline-flex h-9 items-center justify-center rounded-lg border px-3 text-xs font-bold"
          onClick={() => {
            const field = createDraftField(nextIndex.current);
            nextIndex.current += 1;
            setFields((current) => [...current, field]);
          }}
          type="button"
        >
          {copy.addAnotherField}
        </button>
      </div>

      <div className="mt-3 grid gap-3">
        {fields.map((field) => {
          const isChoiceField = choiceFieldTypes.has(field.type);

          return (
            <div
              className="rounded-md border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3"
              key={field.id}
            >
              <input name="newCustomFieldSlots" type="hidden" value={field.id} />
              <div className="grid gap-3 xl:grid-cols-[minmax(20rem,1fr)_14rem_8rem] xl:items-end">
                <label className="grid gap-1 text-xs font-medium text-[var(--dash-text)]">
                  {copy.newFieldName}
                  <input
                    className={fieldInputClass}
                    name={`newFieldLabel:${field.id}`}
                    type="text"
                  />
                </label>
                <label className="grid gap-1 text-xs font-medium text-[var(--dash-text)]">
                  {copy.type}
                  <select
                    className={fieldInputClass}
                    name={`newFieldType:${field.id}`}
                    onChange={(event) => {
                      const nextType = event.currentTarget.value as QuoteFieldType;
                      setFields((current) =>
                        current.map((item) =>
                          item.id === field.id
                            ? {
                                ...item,
                                type: nextType,
                              }
                            : item,
                        ),
                      );
                    }}
                    value={field.type}
                  >
                    {configurableFieldTypes.map((type) => (
                      <option key={type} value={type}>
                        {copy.typeLabels[type]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1 text-xs font-medium text-[var(--dash-text)]">
                  {copy.priority}
                  <input
                    className={fieldInputClass}
                    defaultValue={defaultPriorityById[field.id]}
                    max={999}
                    min={1}
                    name={`newFieldSort:${field.id}`}
                    type="number"
                  />
                </label>
              </div>

              <div className="mt-3 flex flex-wrap gap-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-2">
                <label className="flex min-h-7 items-center gap-2 text-xs font-medium text-[var(--dash-text-secondary)]">
                  <input name={`newFieldRequired:${field.id}`} type="checkbox" />
                  {copy.required}
                </label>
                <label className="flex min-h-7 items-center gap-2 text-xs font-medium text-[var(--dash-text-secondary)]">
                  <input
                    defaultChecked
                    name={`newFieldVisible:${field.id}`}
                    type="checkbox"
                  />
                  {copy.showOnPublicForm}
                </label>
              </div>

              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                <label className="grid gap-1 text-xs font-medium text-[var(--dash-text)]">
                  {copy.helperText}
                  <input
                    className={fieldInputClass}
                    name={`newFieldHelp:${field.id}`}
                    type="text"
                  />
                </label>
                {isChoiceField ? (
                  <label className="grid gap-1 text-xs font-medium text-[var(--dash-text)]">
                    {copy.options}
                    <textarea
                      className={fieldTextareaClass}
                      name={`newFieldOptions:${field.id}`}
                    />
                    <span className="text-[11px] leading-4 text-[var(--dash-text-muted)]">
                      {copy.optionsHelp}
                    </span>
                  </label>
                ) : (
                  <div className="hidden lg:block" />
                )}
              </div>

              <details className="mt-3 rounded-md border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-2">
                <summary className="cursor-pointer list-none text-xs font-bold text-[var(--dash-text)] [&::-webkit-details-marker]:hidden">
                  {copy.advancedSettings}
                </summary>
                <label className="mt-2 grid gap-1 text-xs font-medium text-[var(--dash-text)]">
                  {copy.fieldKey}
                  <input
                    className={fieldInputClass}
                    name={`newFieldKey:${field.id}`}
                    pattern="[a-z][a-z0-9_]*"
                    type="text"
                  />
                  <span className="text-[11px] leading-4 text-[var(--dash-text-muted)]">
                    {copy.fieldKeyHelp}
                  </span>
                </label>
              </details>

              {fields.length > 1 ? (
                <div className="mt-3 flex justify-end">
                  <button
                    className="biz-button-secondary inline-flex h-8 items-center justify-center rounded-lg border px-3 text-xs font-bold"
                    onClick={() =>
                      setFields((current) =>
                        current.filter((item) => item.id !== field.id),
                      )
                    }
                    type="button"
                  >
                    {copy.removeField}
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
