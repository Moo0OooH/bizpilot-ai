"use client";

/**
 * ============================================================
 * File: components/dashboard/custom-quote-field-builder.tsx
 * Project: BizPilot AI
 * Description: Progressive custom-field builder for the public quote form.
 * Role: Keeps the common add-question flow compact while offering recommended starters, live previews, and optional advanced controls.
 * Related:
 * - app/(dashboard)/dashboard/configuration/page.tsx
 * - components/dashboard/quote-field-type-control.tsx
 * - server/actions/business-configuration.actions.ts
 * Author: MoOoH
 * Created: 2026-06-27
 * Last Updated: 2026-07-22
 * Change Log:
 * - 2026-07-22: Added exact-time custom-field editing while reserving the canonical preferred_time field for its seeded template definition.
 * - 2026-07-22: Separated dashboard-interface labels from business-language starter content persisted to the public form.
 * - 2026-07-21: Made starter-card text direction-aware and preserved advanced numeric priority values in Latin LTR.
 * - 2026-07-16: Removed the always-open blank field, added recommended starters and live previews, and moved priority/key into progressive advanced settings.
 * - 2026-07-14: Corrected the built-in French field examples so accents and owner-facing phrasing remain production quality.
 * - 2026-07-05: Added complete BizPilot source header metadata for the custom quote field builder.
 * ============================================================
 */

import { useEffect, useRef, useState } from "react";

import type {
  FieldBuilderCopy,
  QuoteFieldType,
} from "@/components/dashboard/quote-field-type-control";
import {
  QUOTE_FORM_SECTIONS_EVENT,
  type QuoteFormBuilderSectionOption,
} from "@/components/dashboard/quote-form-structure-builder";
import type { SupportedLanguage } from "@/lib/i18n/language";

type FieldPlaceholder = Readonly<{
  fieldKey: string;
  helper: string;
  label: string;
  options: string;
  preview: string;
}>;

type CustomFieldBuilderCopy = FieldBuilderCopy &
  Readonly<{
    addAnotherField: string;
    advancedSettings: string;
    chooseStarter: string;
    customFieldBuilder: string;
    emptyBody: string;
    emptyTitle: string;
    fieldKey: string;
    fieldKeyHelp: string;
    helperText: string;
    newFieldName: string;
    options: string;
    optionsHelp: string;
    placeholders?: Readonly<Record<QuoteFieldType, FieldPlaceholder>>;
    priority: string;
    recommendedQuestions: string;
    removeField: string;
    required: string;
    section: string;
    showOnPublicForm: string;
  }>;

type DraftField = Readonly<{
  helper: string;
  id: string;
  label: string;
  options: string;
  sectionKey: string;
  type: QuoteFieldType;
}>;

const configurableFieldTypes: readonly QuoteFieldType[] = [
  "text",
  "textarea",
  "time",
  "email",
  "phone",
  "number",
  "select",
  "radio",
  "boolean",
  "date",
  "time_window",
];

const starterTypes: readonly QuoteFieldType[] = [
  "select",
  "number",
  "boolean",
  "textarea",
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

const fallbackPlaceholders: Record<QuoteFieldType, FieldPlaceholder> = {
  boolean: {
    fieldKey: "pets_at_home",
    helper: "Helps the team prepare for pets before arrival.",
    label: "Will pets be at home?",
    options: "",
    preview: "Customer checks one box.",
  },
  date: {
    fieldKey: "preferred_date",
    helper: "Use when a calendar date matters.",
    label: "Preferred cleaning date",
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
    fieldKey: "bedroom_count",
    helper: "Helps the owner understand the property size.",
    label: "How many bedrooms?",
    options: "",
    preview: "Example answer: 3",
  },
  phone: {
    fieldKey: "callback_phone",
    helper: "Best number if the owner needs to confirm details.",
    label: "Callback phone",
    options: "",
    preview: "(555) 123-4567",
  },
  radio: {
    fieldKey: "home_furnished",
    helper: "Use when the customer must choose one visible answer.",
    label: "Is the home furnished?",
    options: "Yes\nNo\nPartially",
    preview: "One visible choice is selected.",
  },
  select: {
    fieldKey: "property_type",
    helper: "Helps route the request to the right cleaning workflow.",
    label: "What type of property is this?",
    options: "Apartment\nCondo\nHouse\nOffice",
    preview: "Customer opens a compact list.",
  },
  text: {
    fieldKey: "parking_instructions",
    helper: "Short access detail shown beside the quote request.",
    label: "Parking or access instructions",
    options: "",
    preview: "Example: Use visitor parking behind the building.",
  },
  textarea: {
    fieldKey: "special_requests",
    helper: "Use for details that do not fit a short answer.",
    label: "Anything else we should know?",
    options: "",
    preview: "Customer writes a longer note.",
  },
  time: {
    fieldKey: "arrival_time",
    helper:
      "Collect an exact preferred time without confirming availability or a booking.",
    label: "Exact preferred time",
    options: "",
    preview: "Customer chooses a 24-hour time.",
  },
  time_window: {
    fieldKey: "arrival_window",
    helper: "Collect a preferred window without confirming availability.",
    label: "Preferred arrival window",
    options: "Morning, 8-11\nAfternoon, 12-3\nEvening, 4-7",
    preview: "Customer chooses a time window.",
  },
};

const frenchFallbackPlaceholders: typeof fallbackPlaceholders = {
  boolean: {
    fieldKey: "animaux_maison",
    helper: "Aide l'équipe à se préparer avant son arrivée.",
    label: "Y aura-t-il des animaux sur place?",
    options: "",
    preview: "Le client coche une case.",
  },
  date: {
    fieldKey: "date_menage_souhaitee",
    helper: "Demandez la date idéale sans confirmer la disponibilité.",
    label: "Date de ménage souhaitée",
    options: "",
    preview: "Le client choisit une date.",
  },
  email: {
    fieldKey: "courriel_secondaire",
    helper: "À utiliser seulement si un second courriel est utile.",
    label: "Courriel secondaire",
    options: "",
    preview: "nom@exemple.com",
  },
  number: {
    fieldKey: "nombre_chambres",
    helper: "Aide le responsable à comprendre la taille du logement.",
    label: "Combien de chambres?",
    options: "",
    preview: "Exemple de réponse : 3",
  },
  phone: {
    fieldKey: "telephone_rappel",
    helper: "Meilleur numéro si le responsable doit confirmer les détails.",
    label: "Téléphone de rappel",
    options: "",
    preview: "(555) 123-4567",
  },
  radio: {
    fieldKey: "logement_meuble",
    helper: "À utiliser quand le client doit choisir une réponse visible.",
    label: "Le logement est-il meublé?",
    options: "Oui\nNon\nPartiellement",
    preview: "Une seule option visible est choisie.",
  },
  select: {
    fieldKey: "type_propriete",
    helper: "Aide à diriger la demande vers le bon service.",
    label: "Quel est le type de propriété?",
    options: "Appartement\nCondo\nMaison\nBureau",
    preview: "Le client ouvre une liste compacte.",
  },
  text: {
    fieldKey: "instructions_acces",
    helper: "Courte précision d'accès affichée avec la demande.",
    label: "Instructions de stationnement ou d'accès",
    options: "",
    preview: "Exemple : utilisez le stationnement visiteur.",
  },
  textarea: {
    fieldKey: "demandes_speciales",
    helper: "Utilisez ce champ pour les détails plus longs.",
    label: "Autre chose à savoir?",
    options: "",
    preview: "Le client écrit une note plus longue.",
  },
  time: {
    fieldKey: "heure_arrivee",
    helper:
      "Recueille une heure exacte souhaitée sans confirmer la disponibilité ni une réservation.",
    label: "Heure exacte souhaitée",
    options: "",
    preview: "Le client choisit une heure au format 24 heures.",
  },
  time_window: {
    fieldKey: "plage_arrivee_souhaitee",
    helper: "Recueille une préférence sans confirmer la disponibilité.",
    label: "Plage d'arrivée souhaitée",
    options: "Matin, 8-11\nAprès-midi, 12-3\nSoir, 4-7",
    preview: "Le client choisit une plage horaire.",
  },
};

function createDraftField(
  index: number,
  type: QuoteFieldType,
  sectionKey: string,
  placeholder?: FieldPlaceholder,
): DraftField {
  return {
    helper: placeholder?.helper ?? "",
    id: `custom_${index}`,
    label: placeholder?.label ?? "",
    options: placeholder?.options ?? "",
    sectionKey,
    type,
  };
}

export function CustomQuoteFieldBuilder({
  contentLanguage,
  contentPlaceholders,
  copy,
  initialSections,
}: Readonly<{
  contentLanguage: SupportedLanguage;
  contentPlaceholders: Readonly<Record<QuoteFieldType, FieldPlaceholder>> | undefined;
  copy: CustomFieldBuilderCopy;
  initialSections: readonly QuoteFormBuilderSectionOption[];
}>) {
  const fallbackCopy =
    contentLanguage === "fr-CA"
      ? frenchFallbackPlaceholders
      : fallbackPlaceholders;
  const persistedPlaceholders = contentPlaceholders ?? fallbackCopy;
  const nextIndex = useRef(1);
  const [fields, setFields] = useState<readonly DraftField[]>([]);
  const [sectionOptions, setSectionOptions] =
    useState<readonly QuoteFormBuilderSectionOption[]>(initialSections);

  useEffect(() => {
    function handleSections(event: Event) {
      const customEvent = event as CustomEvent<{
        sections?: readonly QuoteFormBuilderSectionOption[];
      }>;
      const nextSections = customEvent.detail?.sections?.filter(
        (section) => section.key && section.label,
      );
      if (!nextSections || nextSections.length === 0) return;
      const allowedKeys = new Set(nextSections.map((section) => section.key));
      const fallbackKey = nextSections[0]?.key ?? "service";
      setSectionOptions(nextSections);
      setFields((current) =>
        current.map((field) =>
          allowedKeys.has(field.sectionKey)
            ? field
            : { ...field, sectionKey: fallbackKey },
        ),
      );
    }

    window.addEventListener(QUOTE_FORM_SECTIONS_EVENT, handleSections);
    return () =>
      window.removeEventListener(QUOTE_FORM_SECTIONS_EVENT, handleSections);
  }, []);

  function addField(type: QuoteFieldType, useStarter: boolean) {
    const placeholder = persistedPlaceholders[type];
    const field = createDraftField(
      nextIndex.current,
      type,
      sectionOptions[0]?.key ?? "service",
      useStarter ? placeholder : undefined,
    );
    nextIndex.current += 1;
    setFields((current) => [...current, field]);
  }

  function updateField(id: string, update: Partial<DraftField>) {
    setFields((current) =>
      current.map((field) =>
        field.id === id ? { ...field, ...update } : field,
      ),
    );
  }

  return (
    <div className="mt-4 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3.5 sm:p-4">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div className="min-w-0">
          <h3 className="text-[15px] font-black text-[var(--dash-text)]">
            {copy.addAnotherField}
          </h3>
          <p className="mt-1 max-w-3xl text-[12px] leading-5 text-[var(--dash-text-secondary)]">
            {copy.customFieldBuilder}
          </p>
        </div>
        <button
          className="biz-button-secondary inline-flex h-10 items-center justify-center rounded-lg border px-3.5 text-[12px] font-bold"
          onClick={() => addField("text", false)}
          type="button"
        >
          + {copy.addAnotherField}
        </button>
      </div>

      <details className="mt-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)]">
        <summary className="cursor-pointer list-none px-3.5 py-3 text-[12px] font-black text-[var(--dash-text)] [&::-webkit-details-marker]:hidden">
          {copy.chooseStarter}
        </summary>
        <div className="border-t border-[var(--dash-border)] p-3.5">
          <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[var(--dash-text-muted)]">
            {copy.recommendedQuestions}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {starterTypes.map((type) => {
              const placeholder = persistedPlaceholders[type];
              return (
                <button
                  className="biz-button-secondary inline-flex min-h-9 items-center justify-center rounded-lg border px-3 text-start text-[12px] font-bold"
                  key={type}
                  onClick={() => addField(type, true)}
                  type="button"
                >
                  + {placeholder.label}
                </button>
              );
            })}
          </div>
        </div>
      </details>

      {fields.length === 0 ? (
        <div className="mt-3 rounded-lg border border-dashed border-[var(--dash-border-strong)] bg-[var(--dash-surface)] px-4 py-5 text-center">
          <p className="text-[13px] font-black text-[var(--dash-text)]">
            {copy.emptyTitle}
          </p>
          <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-muted)]">
            {copy.emptyBody}
          </p>
        </div>
      ) : null}

      <div className="mt-3 grid gap-3">
        {fields.map((field, index) => {
          const isChoiceField = choiceFieldTypes.has(field.type);
          const placeholder = persistedPlaceholders[field.type];
          const previewLabel = field.label.trim() || placeholder.label;
          const previewHelper = field.helper.trim() || placeholder.helper;
          const previewOptions = field.options.trim() || placeholder.options;

          return (
            <article
              className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3.5"
              key={field.id}
            >
              <input name="newCustomFieldSlots" type="hidden" value={field.id} />
              <div className="flex items-center justify-between gap-3 border-b border-[var(--dash-border)] pb-3">
                <p className="text-[13px] font-black text-[var(--dash-text)]">
                  {index + 1}. {previewLabel}
                </p>
                <button
                  className="text-[12px] font-bold text-[var(--dash-danger-strong)]"
                  onClick={() =>
                    setFields((current) => current.filter((item) => item.id !== field.id))
                  }
                  type="button"
                >
                  {copy.removeField}
                </button>
              </div>

              <div className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1fr)_18rem]">
                <div className="min-w-0">
                  <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_13rem_13rem]">
                    <label className="grid gap-1 text-[12px] font-bold text-[var(--dash-text)]">
                      {copy.newFieldName}
                      <input
                        className={fieldInputClass}
                        name={`newFieldLabel:${field.id}`}
                        onChange={(event) => updateField(field.id, { label: event.currentTarget.value })}
                        placeholder={placeholder.label}
                        type="text"
                        value={field.label}
                      />
                    </label>
                    <label className="grid gap-1 text-[12px] font-bold text-[var(--dash-text)]">
                      {copy.type}
                      <select
                        className={fieldInputClass}
                        name={`newFieldType:${field.id}`}
                        onChange={(event) => {
                          const nextType = event.currentTarget.value as QuoteFieldType;
                          setFields((current) =>
                            current.map((item) =>
                              item.id === field.id ? { ...item, type: nextType } : item,
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
                    <label className="grid gap-1 text-[12px] font-bold text-[var(--dash-text)]">
                      {copy.section}
                      <select
                        className={fieldInputClass}
                        name={`newFieldSection:${field.id}`}
                        onChange={(event) =>
                          updateField(field.id, {
                            sectionKey: event.currentTarget.value,
                          })
                        }
                        value={field.sectionKey}
                      >
                        {sectionOptions.map((section) => (
                          <option key={section.key} value={section.key}>
                            {section.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="mt-3 grid gap-1 text-[12px] font-bold text-[var(--dash-text)]">
                    {copy.helperText}
                    <input
                      className={fieldInputClass}
                      name={`newFieldHelp:${field.id}`}
                      onChange={(event) => updateField(field.id, { helper: event.currentTarget.value })}
                      placeholder={placeholder.helper}
                      type="text"
                      value={field.helper}
                    />
                  </label>

                  {isChoiceField ? (
                    <label className="mt-3 grid gap-1 text-[12px] font-bold text-[var(--dash-text)]">
                      {copy.options}
                      <textarea
                        className={fieldTextareaClass}
                        name={`newFieldOptions:${field.id}`}
                        onChange={(event) => updateField(field.id, { options: event.currentTarget.value })}
                        placeholder={placeholder.options}
                        value={field.options}
                      />
                      <span className="text-[11px] leading-4 text-[var(--dash-text-muted)]">
                        {copy.optionsHelp}
                      </span>
                    </label>
                  ) : null}

                  <div className="mt-3 flex flex-wrap gap-4 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-2.5">
                    <label className="flex min-h-7 items-center gap-2 text-[12px] font-bold text-[var(--dash-text-secondary)]">
                      <input name={`newFieldRequired:${field.id}`} type="checkbox" />
                      {copy.required}
                    </label>
                    <label className="flex min-h-7 items-center gap-2 text-[12px] font-bold text-[var(--dash-text-secondary)]">
                      <input defaultChecked name={`newFieldVisible:${field.id}`} type="checkbox" />
                      {copy.showOnPublicForm}
                    </label>
                  </div>

                  <details className="mt-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)]">
                    <summary className="cursor-pointer list-none px-3 py-2.5 text-[12px] font-bold text-[var(--dash-text)] [&::-webkit-details-marker]:hidden">
                      {copy.advancedSettings}
                    </summary>
                    <div className="grid gap-3 border-t border-[var(--dash-border)] p-3 md:grid-cols-[8rem_minmax(0,1fr)]">
                      <label className="grid gap-1 text-[12px] font-bold text-[var(--dash-text)]">
                        {copy.priority}
                        <input
                          className={fieldInputClass}
                          data-dashboard-ltr-value="true"
                          defaultValue={(index + 13) * 10}
                          dir="ltr"
                          lang="en-CA"
                          max={999}
                          min={1}
                          name={`newFieldSort:${field.id}`}
                          type="number"
                        />
                      </label>
                      <label className="grid gap-1 text-[12px] font-bold text-[var(--dash-text)]">
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
                    </div>
                  </details>
                </div>

                <aside className="rounded-lg border border-[var(--dash-primary-border)] bg-[var(--dash-primary-soft)] p-3.5">
                  <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[var(--dash-primary-strong)]">
                    {copy.typeLabels[field.type]}
                  </p>
                  <p className="mt-2 text-[14px] font-black text-[var(--dash-text)]">
                    {previewLabel}
                  </p>
                  <p className="mt-1 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                    {previewHelper}
                  </p>
                  {isChoiceField ? (
                    <div className="mt-3 grid gap-1.5">
                      {previewOptions.split(/\n|,/).filter(Boolean).map((option) => (
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
            </article>
          );
        })}
      </div>
    </div>
  );
}
