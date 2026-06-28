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
    placeholders?: Readonly<
      Record<
        QuoteFieldType,
        Readonly<{
          fieldKey: string;
          helper: string;
          label: string;
          options: string;
          preview: string;
        }>
      >
    >;
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

const fallbackPlaceholders: Record<
  QuoteFieldType,
  Readonly<{
    fieldKey: string;
    helper: string;
    label: string;
    options: string;
    preview: string;
  }>
> = {
  boolean: {
    fieldKey: "yes_no_question",
    helper: "Use for a simple yes/no detail.",
    label: "Yes/no question",
    options: "",
    preview: "Customer checks one box.",
  },
  date: {
    fieldKey: "preferred_date",
    helper: "Use when a calendar date matters.",
    label: "Preferred date",
    options: "",
    preview: "Customer chooses a date.",
  },
  email: {
    fieldKey: "alternate_email",
    helper: "Use only when a second email is useful.",
    label: "Alternate email",
    options: "",
    preview: "name@example.com",
  },
  number: {
    fieldKey: "room_count",
    helper: "Use when the answer should be numeric.",
    label: "How many rooms?",
    options: "",
    preview: "Example answer: 3",
  },
  phone: {
    fieldKey: "callback_phone",
    helper: "Use when a phone number is required.",
    label: "Callback phone",
    options: "",
    preview: "(555) 123-4567",
  },
  radio: {
    fieldKey: "home_furnished",
    helper: "Radio is best when the customer must choose one answer.",
    label: "Is the home furnished?",
    options: "Yes\nNo\nPartially",
    preview: "One visible choice is selected.",
  },
  select: {
    fieldKey: "property_type",
    helper: "Select keeps a longer list compact on the public form.",
    label: "Property type",
    options: "Apartment\nCondo\nHouse\nOffice",
    preview: "Customer opens a dropdown.",
  },
  text: {
    fieldKey: "parking_instructions",
    helper: "Short answer shown beside the quote request.",
    label: "Parking or access instructions",
    options: "",
    preview: "Example: Use visitor parking behind the building.",
  },
  textarea: {
    fieldKey: "long_answer",
    helper: "Use when the customer may explain details.",
    label: "Long answer question",
    options: "",
    preview: "Customer writes a longer note.",
  },
  time_window: {
    fieldKey: "arrival_window",
    helper: "Use when scheduling windows matter.",
    label: "Preferred arrival window",
    options: "Morning, 8-11\nAfternoon, 12-3\nEvening, 4-7",
    preview: "Customer chooses a time window.",
  },
};

const frenchFallbackPlaceholders: typeof fallbackPlaceholders = {
  boolean: {
    fieldKey: "animaux_maison",
    helper: "Utile si l'equipe doit se preparer pour des animaux.",
    label: "Avez-vous des animaux a la maison?",
    options: "",
    preview: "Le client coche oui/non.",
  },
  date: {
    fieldKey: "date_menage_souhaitee",
    helper: "Demandez la date ideale du service.",
    label: "Date de menage souhaitee",
    options: "",
    preview: "Le client choisit une date.",
  },
  email: {
    fieldKey: "courriel_facturation",
    helper: "A utiliser seulement si ce courriel differe du contact principal.",
    label: "Courriel de facturation",
    options: "",
    preview: "nom@exemple.com",
  },
  number: {
    fieldKey: "nombre_chambres",
    helper: "Les nombres aident a estimer le temps et l'equipe.",
    label: "Combien de chambres?",
    options: "",
    preview: "Exemple de reponse: 3",
  },
  phone: {
    fieldKey: "telephone_rappel",
    helper: "Meilleur numero si le responsable doit confirmer les details.",
    label: "Telephone de rappel",
    options: "",
    preview: "(555) 123-4567",
  },
  radio: {
    fieldKey: "logement_meuble",
    helper: "Radio convient quand le client doit choisir une seule reponse.",
    label: "Le logement est-il meuble?",
    options: "Oui\nNon\nPartiellement",
    preview: "Une seule option visible est choisie.",
  },
  select: {
    fieldKey: "type_propriete",
    helper: "La liste deroulante garde les longues listes compactes.",
    label: "Type de propriete",
    options: "Appartement\nCondo\nMaison\nBureau",
    preview: "Le client ouvre une liste.",
  },
  text: {
    fieldKey: "instructions_stationnement",
    helper: "Reponse courte affichee avec la demande.",
    label: "Instructions de stationnement ou d'acces",
    options: "",
    preview: "Exemple: utilisez le stationnement visiteur.",
  },
  textarea: {
    fieldKey: "demandes_speciales",
    helper: "Utilisez un texte long pour les details a expliquer.",
    label: "Autre chose a savoir?",
    options: "",
    preview: "Le client ecrit une note plus longue.",
  },
  time_window: {
    fieldKey: "plage_arrivee_souhaitee",
    helper: "Les plages horaires facilitent la planification.",
    label: "Plage d'arrivee souhaitee",
    options: "Matin, 8-11\nApres-midi, 12-3\nSoir, 4-7",
    preview: "Le client choisit une plage horaire.",
  },
};

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
  const fallbackCopy =
    copy.typeLabels.email.toLowerCase().includes("courriel")
      ? frenchFallbackPlaceholders
      : fallbackPlaceholders;
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
          const placeholder =
            copy.placeholders?.[field.type] ?? fallbackCopy[field.type];

          return (
            <div
              className="grid gap-3 rounded-md border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3 xl:grid-cols-[minmax(0,1fr)_18rem]"
              key={field.id}
            >
              <input name="newCustomFieldSlots" type="hidden" value={field.id} />
              <div className="min-w-0">
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_12rem_7rem] lg:items-end">
                  <label className="grid gap-1 text-xs font-medium text-[var(--dash-text)]">
                    {copy.newFieldName}
                    <input
                      className={fieldInputClass}
                      name={`newFieldLabel:${field.id}`}
                      placeholder={placeholder.label}
                      type="text"
                    />
                  </label>
                  <label className="grid gap-1 text-xs font-medium text-[var(--dash-text)]">
                    {copy.type}
                    <select
                      className={fieldInputClass}
                      name={`newFieldType:${field.id}`}
                      onChange={(event) => {
                        const nextType =
                          event.currentTarget.value as QuoteFieldType;
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

                <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                  <label className="grid gap-1 text-xs font-medium text-[var(--dash-text)]">
                    {copy.helperText}
                    <input
                      className={fieldInputClass}
                      name={`newFieldHelp:${field.id}`}
                      placeholder={placeholder.helper}
                      type="text"
                    />
                  </label>
                  {isChoiceField ? (
                    <label className="grid gap-1 text-xs font-medium text-[var(--dash-text)]">
                      {copy.options}
                      <textarea
                        className={fieldTextareaClass}
                        name={`newFieldOptions:${field.id}`}
                        placeholder={placeholder.options}
                      />
                      <span className="text-[11px] leading-4 text-[var(--dash-text-muted)]">
                        {copy.optionsHelp}
                      </span>
                    </label>
                  ) : (
                    <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3 text-[12px] leading-5 text-[var(--dash-text-muted)]">
                      {placeholder.preview}
                    </div>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-2">
                  <div className="flex flex-wrap gap-3">
                    <label className="flex min-h-7 items-center gap-2 text-xs font-medium text-[var(--dash-text-secondary)]">
                      <input
                        name={`newFieldRequired:${field.id}`}
                        type="checkbox"
                      />
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
                  {fields.length > 1 ? (
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
                  ) : null}
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
                      placeholder={placeholder.fieldKey}
                      type="text"
                    />
                    <span className="text-[11px] leading-4 text-[var(--dash-text-muted)]">
                      {copy.fieldKeyHelp}
                    </span>
                  </label>
                </details>
              </div>

              <aside className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
                <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[var(--dash-text-muted)]">
                  {copy.typeLabels[field.type]}
                </p>
                <p className="mt-2 text-[13px] font-black text-[var(--dash-text)]">
                  {placeholder.label}
                </p>
                <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                  {placeholder.helper}
                </p>
                {isChoiceField ? (
                  <div className="mt-3 grid gap-1.5">
                    {placeholder.options.split(/\n|,/).map((option) => (
                      <span
                        className="rounded-md border border-[var(--dash-border)] bg-[var(--dash-surface)] px-2.5 py-1.5 text-[12px] font-bold text-[var(--dash-text-secondary)]"
                        key={option.trim()}
                      >
                        {option.trim()}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 rounded-md border border-[var(--dash-border)] bg-[var(--dash-surface)] px-2.5 py-2 text-[12px] font-bold text-[var(--dash-text-secondary)]">
                    {placeholder.preview}
                  </p>
                )}
              </aside>
            </div>
          );
        })}
      </div>
    </div>
  );
}
