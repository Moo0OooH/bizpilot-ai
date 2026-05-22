/**
 * ============================================================
 * File: components/public/quote-form-wizard.tsx
 * Project: BizPilot AI
 * Description: Grouped public cleaning-quote form.
 * Role: Renders Service, When & where, and Contact sections with direct submit safety.
 * Related:
 * - app/(public)/quote/[slug]/page.tsx
 * - server/actions/public-intake.actions.ts
 * - docs/product/BIZPILOT_DASHBOARD_DESIGN_SYSTEM_v1.0.md
 * Author: MoOoH
 * Created: 2026-05-19
 * Last Updated: 2026-05-22
 * Change Log:
 * - 2026-05-19: Created 3-step grouped public quote form.
 * - 2026-05-22: Removed client-side step navigation dependency so public submissions cannot get stuck before submit.
 * ============================================================
 */

import { submitPublicIntakeAction } from "@/server/actions/public-intake.actions";
import type { getPublicIntakePage } from "@/server/services/public-intake.service";
import type { Json } from "@/types/database";
import { SubmitAgeInput } from "./submit-age-input";

type IntakePage = NonNullable<Awaited<ReturnType<typeof getPublicIntakePage>>>;
type FieldRecord = IntakePage["fields"][number];

type QueryParams = Readonly<{
  ref?: string;
  source?: string;
  utm_campaign?: string;
  utm_medium?: string;
  utm_source?: string;
}>;

type StepId = "service" | "when_where" | "contact";

type StepConfig = Readonly<{
  description: string;
  id: StepId;
  label: string;
  title: string;
}>;

const STEPS: ReadonlyArray<StepConfig> = [
  {
    description: "A few quick details so the owner can prepare an accurate reply.",
    id: "service",
    label: "Service",
    title: "What kind of cleaning?",
  },
  {
    description: "Timing and location help the owner check availability and travel.",
    id: "when_where",
    label: "When & where",
    title: "When and where?",
  },
  {
    description:
      "We pass these details directly to the business. Nothing is sent automatically.",
    id: "contact",
    label: "Contact",
    title: "How should the owner reach you?",
  },
];

const FIELD_INPUT =
  "h-11 w-full rounded-[10px] border border-white/[0.10] bg-[rgba(255,255,255,0.04)] px-3 text-[14px] text-[#F5F7FA] outline-none transition placeholder:text-[rgba(245,247,250,0.35)] focus:border-[#17D492] focus:ring-4 focus:ring-[rgba(23,212,146,0.15)]";

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
    key.includes("note") ||
    key.includes("message") ||
    key.includes("contact") ||
    key.includes("email") ||
    key.includes("phone")
  );
}

function FieldInput({
  field,
  required,
  todayDate,
}: Readonly<{ field: FieldRecord; required: boolean; todayDate: string }>) {
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
        className="h-4 w-4 shrink-0 accent-[#17D492]"
        name={`field:${field.field_key}`}
        type="checkbox"
      />
    );
  }

  if (field.field_type === "select" || field.field_type === "time_window") {
    return (
      <select
        className={`${FIELD_INPUT} pr-8`}
        defaultValue=""
        name={`field:${field.field_key}`}
        required={required}
        style={{ backgroundColor: "#0D1721" }}
      >
        <option style={{ backgroundColor: "#0D1721" }} value="">
          Select an option
        </option>
        {getOptions(field.options).map((option) => (
          <option
            key={option}
            style={{ backgroundColor: "#0D1721" }}
            value={option}
          >
            {toOptionLabel(option)}
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
  field,
  todayDate,
}: Readonly<{
  field: FieldRecord;
  todayDate: string;
}>) {
  const colSpan = isWideField(field) ? "md:col-span-2" : "";

  if (field.field_type === "boolean") {
    return (
      <label
        className={`flex items-center gap-3 rounded-[10px] border border-white/[0.08] bg-[rgba(255,255,255,0.04)] px-3 py-2.5 ${colSpan}`}
      >
        <FieldInput
          field={field}
          required={field.is_required}
          todayDate={todayDate}
        />
        <span className="min-w-0">
          <span className="block text-[13px] font-bold text-[#F5F7FA]">
            {field.label}
            {field.is_required ? (
              <span className="text-[#FF5C5C]"> *</span>
            ) : null}
          </span>
          {field.help_text ? (
            <span className="mt-0.5 block text-[11px] leading-4 text-[rgba(245,247,250,0.55)]">
              {field.help_text}
            </span>
          ) : null}
        </span>
      </label>
    );
  }

  return (
    <label className={`flex min-w-0 flex-col gap-1.5 ${colSpan}`}>
      <span className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[rgba(245,247,250,0.72)]">
        {field.label}
        {field.is_required ? (
          <span className="text-[#FF5C5C]"> *</span>
        ) : null}
      </span>
      <FieldInput
        field={field}
        required={field.is_required}
        todayDate={todayDate}
      />
      {field.help_text ? (
        <span className="text-[11px] leading-4 text-[rgba(245,247,250,0.46)]">
          {field.help_text}
        </span>
      ) : null}
    </label>
  );
}

function ConsentBlock({
  aiDisclosureEnabled,
  consentNotice,
}: Readonly<{
  aiDisclosureEnabled: boolean;
  consentNotice: string;
}>) {
  return (
    <label className="mt-4 flex items-start gap-3 rounded-[12px] border border-white/[0.08] bg-[rgba(255,255,255,0.04)] p-3 text-[12px] leading-5 text-[rgba(245,247,250,0.72)]">
      <input
        className="mt-0.5 h-4 w-4 shrink-0 accent-[#17D492]"
        name="consentAccepted"
        required
        type="checkbox"
      />
      <span>
        {consentNotice}
        {aiDisclosureEnabled ? (
          <span className="mt-1.5 block text-[11px] text-[rgba(245,247,250,0.46)]">
            BizPilot may help prepare internal AI drafts later, but the business
            reviews messages before sending.
          </span>
        ) : null}
      </span>
    </label>
  );
}

export function QuoteFormWizard({
  page,
  query,
  slug,
  todayDate,
}: Readonly<{
  page: IntakePage;
  query: QueryParams | undefined;
  slug: string;
  todayDate: string;
}>) {
  const groups = groupFields(page.fields);

  return (
    <form
      action={submitPublicIntakeAction}
      className="mx-auto w-full max-w-[720px] space-y-4 px-4 py-5 pb-10 sm:px-6"
    >
      <input name="businessSlug" type="hidden" value={slug} />
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

      {STEPS.map((step, index) => {
        const fields = groups[step.id];

        return (
          <section
            className="rounded-[16px] border border-white/[0.08] bg-[rgba(255,255,255,0.035)] p-4"
            id={`quote-step-${index}`}
            key={step.id}
          >
            <header className="mb-4 space-y-1">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[rgba(245,247,250,0.55)]">
                Step {index + 1} of {STEPS.length} - {step.label}
              </p>
              <h2 className="text-[21px] font-extrabold leading-tight tracking-[-0.03em] text-[#F5F7FA]">
                {step.title}
              </h2>
              <p className="text-[13px] leading-5 text-[rgba(245,247,250,0.72)]">
                {step.description}
              </p>
            </header>

            {fields.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2">
                {fields.map((field) => (
                  <FieldRow field={field} key={field.id} todayDate={todayDate} />
                ))}
              </div>
            ) : (
              <p className="rounded-[12px] border border-white/[0.08] bg-[rgba(255,255,255,0.04)] p-3 text-[13px] text-[rgba(245,247,250,0.55)]">
                Nothing to fill on this section.
              </p>
            )}

            {index === STEPS.length - 1 ? (
              <ConsentBlock
                aiDisclosureEnabled={page.consentVersion.ai_disclosure_enabled}
                consentNotice={page.consentVersion.consent_notice}
              />
            ) : null}
          </section>
        );
      })}

      {query?.source === "rate_limited_demo" ? null : null}

      <div className="flex justify-end pt-1">
        <button
          className="inline-flex h-11 min-w-[200px] items-center justify-center rounded-[12px] px-5 text-[14px] font-extrabold transition hover:-translate-y-0.5"
          style={{
            background: "linear-gradient(135deg, #14b8a6, #2dd4bf)",
            boxShadow: "0 14px 30px rgba(20,184,166,0.22)",
            color: "#022c22",
          }}
          type="submit"
        >
          Send quote request
        </button>
      </div>
    </form>
  );
}

export type { StepId };
export const QUOTE_WIZARD_STEPS = STEPS;
