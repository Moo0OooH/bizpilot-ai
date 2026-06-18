"use client";

import { useState } from "react";

import type { Json } from "@/types/database";

type QuoteFieldType =
  | "boolean"
  | "date"
  | "email"
  | "number"
  | "phone"
  | "radio"
  | "select"
  | "text"
  | "textarea"
  | "time_window";

type FieldBuilderCopy = Readonly<{
  options: string;
  optionsHelp: string;
  type: string;
  typeLabels: Readonly<Record<QuoteFieldType, string>>;
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

function optionsToText(options: Json): string {
  return Array.isArray(options)
    ? options
        .filter((option): option is string => typeof option === "string")
        .join("\n")
    : "";
}

export function QuoteFieldTypeControl({
  copy,
  defaultType,
  fieldKey,
  isCustom,
  options,
}: Readonly<{
  copy: FieldBuilderCopy;
  defaultType: QuoteFieldType;
  fieldKey: string;
  isCustom: boolean;
  options: Json;
}>) {
  const [selectedType, setSelectedType] = useState<QuoteFieldType>(defaultType);
  const inputName = `fieldType:${fieldKey}`;
  const optionsName = `fieldOptions:${fieldKey}`;

  return (
    <>
      <label className="grid gap-1 text-xs font-medium text-[var(--dash-text)]">
        {copy.type}
        {isCustom ? (
          <select
            className={fieldInputClass}
            defaultValue={defaultType}
            name={inputName}
            onChange={(event) =>
              setSelectedType(event.currentTarget.value as QuoteFieldType)
            }
          >
            {configurableFieldTypes.map((type) => (
              <option key={type} value={type}>
                {copy.typeLabels[type]}
              </option>
            ))}
          </select>
        ) : (
          <>
            <input name={inputName} type="hidden" value={defaultType} />
            <input
              className={fieldInputClass}
              defaultValue={copy.typeLabels[defaultType]}
              disabled
              type="text"
            />
          </>
        )}
      </label>

      {choiceFieldTypes.has(isCustom ? selectedType : defaultType) ? (
        <label className="grid gap-1 text-xs font-medium text-[var(--dash-text)] lg:col-span-2">
          {copy.options}
          <textarea
            className={fieldTextareaClass}
            defaultValue={optionsToText(options)}
            name={optionsName}
          />
          <span className="text-[11px] leading-4 text-[var(--dash-text-muted)]">
            {copy.optionsHelp}
          </span>
        </label>
      ) : null}
    </>
  );
}

export type { FieldBuilderCopy, QuoteFieldType };
