/**
 * ============================================================
 * File: components/public/quote-form-wizard.tsx
 * Project: BizPilot AI
 * Description: Configurable public cleaning-quote form renderer.
 * Role: Maps persisted fields into owner-authored sections and delegates accessible list, tab, or step behavior.
 * Related:
 * - components/public/quote-form-flow.tsx
 * - app/(public)/quote/[slug]/page.tsx
 * - lib/quote-form-layout.ts
 * - server/actions/public-intake.actions.ts
 * Author: MoOoH
 * Created: 2026-05-19
 * Last Updated: 2026-07-17
 * Change Log:
 * - 2026-07-17: Replaced heuristic fixed steps with persisted titles, sections, assignments, and display modes.
 * - 2026-07-16: Added branded section progress and persisted consent copy.
 * - 2026-07-05: Improved field semantics, attribution, and required boolean enforcement.
 * ============================================================
 */

import {
  getBizPilotCopy,
  getDefaultBizPilotCopy,
  resolveConsentNoticeForLanguage,
  type BizPilotCopy,
  type QuoteStepCopy,
} from "@/lib/i18n/bizpilot-copy";
import type { SupportedLanguage } from "@/lib/i18n/language";
import { submitPublicIntakeAction } from "@/server/actions/public-intake.actions";
import type { getPublicIntakePage } from "@/server/services/public-intake.service";
import type { Json } from "@/types/database";
import { QuoteFormFlow } from "./quote-form-flow";
import { SubmitAgeInput } from "./submit-age-input";

type IntakePage = NonNullable<Awaited<ReturnType<typeof getPublicIntakePage>>>;
type FieldRecord = IntakePage["fields"][number];

type QueryParams = Readonly<{
  ref?: string;
  language?: string;
  source?: string;
  sourceUrl?: string;
  utm_campaign?: string;
  utm_medium?: string;
  utm_source?: string;
}>;

type StepId = QuoteStepCopy["id"];

const FIELD_INPUT =
  "quote-field-control h-12 w-full rounded-[14px] border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 text-[15px] text-[var(--text-strong)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--focus-ring)]";

function inputTypeForField(fieldType: FieldRecord["field_type"]): string {
  if (fieldType === "phone") return "tel";
  if (fieldType === "number" || fieldType === "date" || fieldType === "email") {
    return fieldType;
  }
  return "text";
}

function getOptions(value: Json): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function toOptionLabel(value: string): string {
  return value
    .split(/[_-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function toSafeDomIdPart(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "option"
  );
}

function getInputMinimum(input: {
  field: FieldRecord;
  todayDate: string;
}): number | string | undefined {
  if (input.field.field_type === "date") return input.todayDate;
  if (input.field.field_type === "number") return 0;
  return undefined;
}

function isWideField(field: FieldRecord): boolean {
  const key = field.field_key.toLowerCase();
  return (
    field.field_type === "textarea" ||
    field.field_type === "boolean" ||
    field.field_type === "radio" ||
    key.includes("note") ||
    key.includes("message") ||
    key.includes("contact") ||
    key.includes("email") ||
    key.includes("phone")
  );
}

function FieldInput({
  ariaDescribedBy,
  copy,
  controlId,
  field,
  required,
  todayDate,
}: Readonly<{
  ariaDescribedBy?: string | undefined;
  copy: BizPilotCopy;
  controlId: string;
  field: FieldRecord;
  required: boolean;
  todayDate: string;
}>) {
  if (field.field_type === "textarea") {
    return (
      <textarea
        aria-describedby={ariaDescribedBy}
        className={`${FIELD_INPUT} h-auto min-h-[96px] py-2.5 leading-6`}
        id={controlId}
        name={`field:${field.field_key}`}
        required={required}
      />
    );
  }

  if (field.field_type === "boolean") {
    return (
      <input
        aria-describedby={ariaDescribedBy}
        className="h-4 w-4 shrink-0 accent-[var(--accent)]"
        id={controlId}
        name={`field:${field.field_key}`}
        required={required}
        type="checkbox"
      />
    );
  }

  if (field.field_type === "radio") {
    return (
      <div className="grid gap-2.5">
        {getOptions(field.options).map((option, index) => {
          const optionId = `${controlId}-${index}-${toSafeDomIdPart(option)}`;

          return (
            <label
              className="quote-radio-option flex min-h-12 items-center gap-2.5 rounded-[12px] border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2.5 text-[14px] font-semibold text-[var(--text-strong)]"
              htmlFor={optionId}
              key={option}
            >
              <input
                className="h-4 w-4 shrink-0 accent-[var(--accent)]"
                id={optionId}
                name={`field:${field.field_key}`}
                required={required}
                type="radio"
                value={option}
              />
              {copy.optionLabels[option] ?? toOptionLabel(option)}
            </label>
          );
        })}
      </div>
    );
  }

  if (field.field_type === "select" || field.field_type === "time_window") {
    return (
      <select
        aria-describedby={ariaDescribedBy}
        className={`${FIELD_INPUT} pr-8`}
        defaultValue=""
        id={controlId}
        name={`field:${field.field_key}`}
        required={required}
      >
        <option value="">{copy.quoteForm.selectPlaceholder}</option>
        {getOptions(field.options).map((option) => (
          <option key={option} value={option}>
            {copy.optionLabels[option] ?? toOptionLabel(option)}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      aria-describedby={ariaDescribedBy}
      className={FIELD_INPUT}
      id={controlId}
      min={getInputMinimum({ field, todayDate })}
      name={`field:${field.field_key}`}
      required={required}
      type={inputTypeForField(field.field_type)}
    />
  );
}

function FieldRow({
  copy,
  field,
  todayDate,
}: Readonly<{
  copy: BizPilotCopy;
  field: FieldRecord;
  todayDate: string;
}>) {
  const colSpan = isWideField(field) ? "md:col-span-2" : "";
  const controlId = `quote-field-${field.id}`;
  const helperId = field.help_text ? `${controlId}-helper` : undefined;

  if (field.field_type === "boolean") {
    return (
      <label
        className={`quote-boolean-field flex items-start gap-3 rounded-[14px] border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-3 ${colSpan}`}
        htmlFor={controlId}
      >
        <FieldInput
          ariaDescribedBy={helperId}
          copy={copy}
          controlId={controlId}
          field={field}
          required={field.is_required}
          todayDate={todayDate}
        />
        <span className="min-w-0">
          <span className="block text-[14px] font-bold text-[var(--text-strong)]">
            {field.label}
            {field.is_required ? (
              <span className="text-[var(--danger)]"> *</span>
            ) : null}
          </span>
          {field.help_text ? (
            <span
              className="quote-field-helper mt-1 block text-[12px] leading-5 text-[var(--text-muted)]"
              id={helperId}
            >
              {field.help_text}
            </span>
          ) : null}
        </span>
      </label>
    );
  }

  if (field.field_type === "radio") {
    return (
      <fieldset
        aria-describedby={helperId}
        className={`quote-field-row flex min-w-0 flex-col gap-2.5 ${colSpan}`}
      >
        <legend className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-default)]">
          {field.label}
          {field.is_required ? (
            <span className="text-[var(--danger)]"> *</span>
          ) : null}
        </legend>
        <FieldInput
          copy={copy}
          controlId={controlId}
          field={field}
          required={field.is_required}
          todayDate={todayDate}
        />
        {field.help_text ? (
          <span
            className="quote-field-helper mt-1 text-[12px] leading-5 text-[var(--text-muted)]"
            id={helperId}
          >
            {field.help_text}
          </span>
        ) : null}
      </fieldset>
    );
  }

  return (
    <div className={`quote-field-row flex min-w-0 flex-col gap-2.5 ${colSpan}`}>
      <label
        className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-default)]"
        htmlFor={controlId}
      >
        {field.label}
        {field.is_required ? (
          <span className="text-[var(--danger)]"> *</span>
        ) : null}
      </label>
      <FieldInput
        ariaDescribedBy={helperId}
        copy={copy}
        controlId={controlId}
        field={field}
        required={field.is_required}
        todayDate={todayDate}
      />
      {field.help_text ? (
        <span
          className="quote-field-helper mt-1 text-[12px] leading-5 text-[var(--text-muted)]"
          id={helperId}
        >
          {field.help_text}
        </span>
      ) : null}
    </div>
  );
}

function ConsentBlock({ consentNotice }: Readonly<{ consentNotice: string }>) {
  return (
    <label className="quote-consent-block mt-5 flex items-start gap-3 rounded-[14px] border border-[var(--border-strong)] bg-[var(--surface)] p-4 text-[13px] leading-6 text-[var(--text-default)] sm:p-5">
      <input
        className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]"
        name="consentAccepted"
        required
        type="checkbox"
      />
      <span>{consentNotice}</span>
    </label>
  );
}

export function QuoteFormWizard({
  language,
  page,
  query,
  slug,
  todayDate,
}: Readonly<{
  language: SupportedLanguage;
  page: IntakePage;
  query: QueryParams | undefined;
  slug: string;
  todayDate: string;
}>) {
  const copy = getBizPilotCopy(language);
  const configuredSections = page.formLayout.sections.filter(
    (section) => !section.isHidden,
  );
  const sections =
    configuredSections.length > 0
      ? configuredSections
      : page.formLayout.sections.slice(0, 1);
  const fallbackSectionKey = sections[0]?.key ?? "contact";
  const availableSectionKeys = new Set(sections.map((section) => section.key));
  const fieldsBySection = new Map<string, FieldRecord[]>(
    sections.map((section) => [section.key, []]),
  );

  page.fields.forEach((field) => {
    const sectionKey = availableSectionKeys.has(field.section_key)
      ? field.section_key
      : fallbackSectionKey;
    fieldsBySection.get(sectionKey)?.push(field);
  });

  const hiddenFields = (
    <>
      <input name="businessSlug" type="hidden" value={slug} />
      <input name="language" type="hidden" value={language} />
      <input name="intakeFormId" type="hidden" value={page.form.id} />
      <input
        name="consentVersionId"
        type="hidden"
        value={page.consentVersion.id}
      />
      <SubmitAgeInput />
      <input
        name="sourceChannel"
        type="hidden"
        value={query?.source ?? "public_quote_link"}
      />
      <input name="referrer" type="hidden" value={query?.ref ?? ""} />
      <input name="sourceUrl" type="hidden" value={query?.sourceUrl ?? ""} />
      <input name="utmSource" type="hidden" value={query?.utm_source ?? ""} />
      <input name="utmMedium" type="hidden" value={query?.utm_medium ?? ""} />
      <input name="utmCampaign" type="hidden" value={query?.utm_campaign ?? ""} />
      <input
        aria-hidden="true"
        autoComplete="off"
        className="hidden"
        name="companyWebsite"
        tabIndex={-1}
        type="text"
      />
      {page.fields.map((field) => (
        <input
          key={field.id}
          name="fieldKeys"
          type="hidden"
          value={field.field_key}
        />
      ))}
    </>
  );

  return (
    <QuoteFormFlow
      action={submitPublicIntakeAction}
      copy={{
        backButton: copy.quoteForm.backButton,
        continueButton: copy.quoteForm.continueButton,
        emptySection: copy.quoteForm.emptySection,
        guardrail: copy.quoteForm.guardrail,
        sectionNavigationLabel: copy.quoteForm.sectionNavigationLabel,
        stepProgressLabels: sections.map((section, index) =>
          copy.quoteForm.stepProgress(
            index + 1,
            sections.length,
            section.navLabel,
          ),
        ),
        submitButton: copy.quoteForm.submitButton,
      }}
      displayMode={page.formLayout.displayMode}
      hiddenFields={hiddenFields}
      sections={sections.map((section, index) => {
        const fields = fieldsBySection.get(section.key) ?? [];

        return {
          content: (
            <>
              {fields.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {fields.map((field) => (
                    <FieldRow
                      copy={copy}
                      field={field}
                      key={field.id}
                      todayDate={todayDate}
                    />
                  ))}
                </div>
              ) : (
                <p className="rounded-[14px] border border-[var(--border-default)] bg-[var(--canvas-subtle)] p-3 text-[13px] text-[var(--text-muted)]">
                  {copy.quoteForm.emptySection}
                </p>
              )}
              {index === sections.length - 1 ? (
                <ConsentBlock
                  consentNotice={resolveConsentNoticeForLanguage({
                    language,
                    value: page.consentVersion.consent_notice,
                  })}
                />
              ) : null}
            </>
          ),
          description: section.description,
          key: section.key,
          navLabel: section.navLabel,
          title: section.title,
        };
      })}
    />
  );
}

export type { StepId };
export const QUOTE_WIZARD_STEPS = getDefaultBizPilotCopy().quoteForm.steps;
