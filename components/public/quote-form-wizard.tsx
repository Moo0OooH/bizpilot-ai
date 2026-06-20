/**
 * ============================================================
 * File: components/public/quote-form-wizard.tsx
 * Project: BizPilot AI
 * Description: Grouped public cleaning-quote form.
 * Role: Renders Service, When & where, and Contact sections with direct submit safety and shared semantic theme tokens.
 * Related:
 * - app/(public)/quote/[slug]/page.tsx
 * - server/actions/public-intake.actions.ts
 * - docs/product/BIZPILOT_DASHBOARD_DESIGN_SYSTEM_v1.0.md
 * Author: MoOoH
 * Created: 2026-05-19
 * Last Updated: 2026-06-19
 * Change Log:
 * - 2026-05-19: Created 3-step grouped public quote form.
 * - 2026-05-22: Removed client-side step navigation dependency so public submissions cannot get stuck before submit.
 * - 2026-06-19: Mapped quote form visual styling to shared System/Light/Dark tokens.
 * ============================================================
 */

import { submitPublicIntakeAction } from "@/server/actions/public-intake.actions";
import type { getPublicIntakePage } from "@/server/services/public-intake.service";
import type { Json } from "@/types/database";
import {
  getBizPilotCopy,
  getDefaultBizPilotCopy,
  type BizPilotCopy,
  type QuoteStepCopy,
} from "@/lib/i18n/bizpilot-copy";
import type { SupportedLanguage } from "@/lib/i18n/language";
import { SubmitAgeInput } from "./submit-age-input";

type IntakePage = NonNullable<Awaited<ReturnType<typeof getPublicIntakePage>>>;
type FieldRecord = IntakePage["fields"][number];

type QueryParams = Readonly<{
  ref?: string;
  language?: string;
  source?: string;
  utm_campaign?: string;
  utm_medium?: string;
  utm_source?: string;
}>;

type StepId = QuoteStepCopy["id"];

const FIELD_INPUT =
  "h-12 w-full rounded-[14px] border border-[var(--border-strong)] bg-[var(--surface)] px-3 text-[15px] text-[var(--text-strong)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--focus-ring)]";

function groupForField(field: FieldRecord): StepId {
  const key = field.field_key.toLowerCase();

  if (
    key.includes("service_type") ||
    key.includes("cleaning_type") ||
    key.includes("property") ||
    key.includes("bedroom") ||
    key.includes("bathroom") ||
    key.includes("square") ||
    key.includes("size") ||
    key.includes("pet")
  ) {
    return "service";
  }

  if (
    key.includes("date") ||
    key.includes("time") ||
    key.includes("schedule") ||
    key.includes("city") ||
    key.includes("area") ||
    key.includes("location") ||
    key.includes("address") ||
    key.includes("postal")
  ) {
    return "when_where";
  }

  return "contact";
}

function groupFields(fields: ReadonlyArray<FieldRecord>): Record<StepId, FieldRecord[]> {
  const buckets: Record<StepId, FieldRecord[]> = {
    contact: [],
    service: [],
    when_where: [],
  };

  fields.forEach((field) => buckets[groupForField(field)].push(field));
  return buckets;
}

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
  copy,
  field,
  required,
  todayDate,
}: Readonly<{
  copy: BizPilotCopy;
  field: FieldRecord;
  required: boolean;
  todayDate: string;
}>) {
  if (field.field_type === "textarea") {
    return (
      <textarea
        className={`${FIELD_INPUT} h-auto min-h-[84px] py-2 leading-6`}
        name={`field:${field.field_key}`}
        required={required}
      />
    );
  }

  if (field.field_type === "boolean") {
    return (
      <input
        className="h-4 w-4 shrink-0 accent-[var(--accent)]"
        name={`field:${field.field_key}`}
        type="checkbox"
      />
    );
  }

  if (field.field_type === "radio") {
    return (
      <div className="grid gap-2">
        {getOptions(field.options).map((option) => (
          <label
            className="flex min-h-11 items-center gap-2 rounded-[12px] border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2 text-[14px] font-semibold text-[var(--text-strong)]"
            key={option}
          >
            <input
              className="h-4 w-4 shrink-0 accent-[var(--accent)]"
              name={`field:${field.field_key}`}
              required={required}
              type="radio"
              value={option}
            />
            {copy.optionLabels[option] ?? toOptionLabel(option)}
          </label>
        ))}
      </div>
    );
  }

  if (field.field_type === "select" || field.field_type === "time_window") {
    return (
      <select
        className={`${FIELD_INPUT} pr-8`}
        defaultValue=""
        name={`field:${field.field_key}`}
        required={required}
      >
        <option value="">
          {copy.quoteForm.selectPlaceholder}
        </option>
        {getOptions(field.options).map((option) => (
          <option
            key={option}
            value={option}
          >
            {copy.optionLabels[option] ?? toOptionLabel(option)}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      className={FIELD_INPUT}
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

  if (field.field_type === "boolean") {
    return (
      <label
        className={`flex items-center gap-3 rounded-[14px] border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-3 ${colSpan}`}
      >
        <FieldInput
          copy={copy}
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
            <span className="mt-0.5 block text-[12px] leading-5 text-[var(--text-muted)]">
              {field.help_text}
            </span>
          ) : null}
        </span>
      </label>
    );
  }

  return (
    <label className={`flex min-w-0 flex-col gap-1.5 ${colSpan}`}>
      <span className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-default)]">
        {field.label}
        {field.is_required ? (
          <span className="text-[var(--danger)]"> *</span>
        ) : null}
      </span>
      <FieldInput
        copy={copy}
        field={field}
        required={field.is_required}
        todayDate={todayDate}
      />
      {field.help_text ? (
        <span className="text-[12px] leading-5 text-[var(--text-muted)]">
          {field.help_text}
        </span>
      ) : null}
    </label>
  );
}

function ConsentBlock({
  aiDisclosureEnabled,
  consentNotice,
  copy,
}: Readonly<{
  aiDisclosureEnabled: boolean;
  consentNotice: string;
  copy: BizPilotCopy;
}>) {
  return (
    <label className="mt-4 flex items-start gap-3 rounded-[14px] border border-[var(--border-strong)] bg-[var(--surface)] p-4 text-[13px] leading-6 text-[var(--text-default)]">
      <input
        className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]"
        name="consentAccepted"
        required
        type="checkbox"
      />
      <span>
        {consentNotice}
        {aiDisclosureEnabled ? (
          <span className="mt-1.5 block text-[11px] text-[var(--text-muted)]">
            {copy.quoteForm.aiDisclosure}
          </span>
        ) : null}
      </span>
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
  const groups = groupFields(page.fields);
  const steps = copy.quoteForm.steps;

  return (
    <form
      action={submitPublicIntakeAction}
      className="mx-auto w-full max-w-[780px] space-y-5 px-5 py-8 pb-12 sm:px-8"
    >
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
      <input name="sourceUrl" type="hidden" value="" />
      <input name="utmSource" type="hidden" value={query?.utm_source ?? ""} />
      <input name="utmMedium" type="hidden" value={query?.utm_medium ?? ""} />
      <input name="utmCampaign" type="hidden" value={query?.utm_campaign ?? ""} />
      <label className="hidden">
        Company website
        <input autoComplete="off" name="companyWebsite" tabIndex={-1} />
      </label>

      {page.fields.map((field) => (
        <input
          key={field.id}
          name="fieldKeys"
          type="hidden"
          value={field.field_key}
        />
      ))}

      {steps.map((step, index) => {
        const fields = groups[step.id];

        return (
          <section
            className="rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]"
            id={`quote-step-${index}`}
            key={step.id}
          >
            <header className="mb-4 space-y-1">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                {copy.quoteForm.stepProgress(index + 1, steps.length, step.label)}
              </p>
              <h2 className="text-[22px] font-extrabold leading-tight text-[var(--text-strong)]">
                {step.title}
              </h2>
              <p className="text-[14px] leading-6 text-[var(--text-default)]">
                {step.description}
              </p>
            </header>

            {fields.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2">
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

            {index === steps.length - 1 ? (
              <ConsentBlock
                aiDisclosureEnabled={page.consentVersion.ai_disclosure_enabled}
                consentNotice={page.consentVersion.consent_notice}
                copy={copy}
              />
            ) : null}
          </section>
        );
      })}

      {query?.source === "rate_limited_demo" ? null : null}

      <p
        className="rounded-[14px] border p-4 text-[13px] leading-6"
        style={{
          backgroundColor: "color-mix(in srgb, var(--warning) 12%, var(--surface))",
          borderColor: "color-mix(in srgb, var(--warning) 34%, var(--border-default))",
          color: "var(--text-strong)",
        }}
      >
        {copy.quoteForm.guardrail}
      </p>

      <div className="flex justify-end pt-1">
        <button
          className="inline-flex min-h-12 w-full items-center justify-center rounded-[14px] px-5 text-[15px] font-extrabold transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] sm:w-auto sm:min-w-[220px]"
          style={{
            background: "linear-gradient(135deg, var(--primary), var(--primary-hover))",
            boxShadow: "0 14px 30px color-mix(in srgb, var(--primary) 22%, transparent)",
            color: "var(--primary-contrast)",
          }}
          type="submit"
        >
          {copy.quoteForm.submitButton}
        </button>
      </div>
    </form>
  );
}

export type { StepId };
export const QUOTE_WIZARD_STEPS = getDefaultBizPilotCopy().quoteForm.steps;
