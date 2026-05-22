"use client";

/**
 * ============================================================
 * File: components/public/quote-form-wizard.tsx
 * Project: BizPilot AI
 * Description: 3-step grouped wizard for the public cleaning-quote form.
 * Role: Replaces the single-page scroll form with Service → When &amp; Where → Contact. Industry research (Klientboost, HubSpot, Unbounce) shows multi-step grouped wizards convert 2-4× better than single-page forms on 8+ field intakes while keeping mobile completion high. Matches the Operational Calm UX doctrine — no glow, no animation noise.
 * Related:
 * - app/(public)/quote/[slug]/page.tsx
 * - server/actions/public-intake.actions.ts
 * - docs/product/BIZPILOT_DASHBOARD_DESIGN_SYSTEM_v1.0.md
 * Author: MoOoH
 * Created: 2026-05-19
 * Change Log:
 * - 2026-05-19: Created. All fields stay mounted (display:none for inactive steps + dynamic `required`) so the server action still receives every value on final submit.
 * ============================================================
 */

import { useMemo, useRef, useState } from "react";

import { submitPublicIntakeAction } from "@/server/actions/public-intake.actions";
import type { getPublicIntakePage } from "@/server/services/public-intake.service";
import type { Json } from "@/types/database";

// ───────── Types & helpers ─────────

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
    id: "service",
    label: "Service",
    title: "What kind of cleaning?",
    description: "A few quick details so the owner can prepare an accurate reply.",
  },
  {
    id: "when_where",
    label: "When & where",
    title: "When and where?",
    description: "Timing and location help the owner check availability and travel.",
  },
  {
    id: "contact",
    label: "Contact",
    title: "How should the owner reach you?",
    description: "We pass these details directly to the business — nothing is sent automatically.",
  },
];

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

function inputTypeForField(fieldType: FieldRecord["field_type"]): string {
  if (fieldType === "phone") return "tel";
  if (fieldType === "number" || fieldType === "date" || fieldType === "email")
    return fieldType;
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

// ───────── Atoms ─────────

const FIELD_INPUT =
  "h-11 w-full rounded-[10px] border border-white/[0.10] bg-[rgba(255,255,255,0.04)] px-3 text-[14px] text-[#F5F7FA] outline-none transition placeholder:text-[rgba(245,247,250,0.35)] focus:border-[#17D492] focus:ring-4 focus:ring-[rgba(23,212,146,0.15)]";

function FieldInput({
  field,
  todayDate,
  required,
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
  isStepActive,
  todayDate,
}: Readonly<{
  field: FieldRecord;
  isStepActive: boolean;
  todayDate: string;
}>) {
  const required = field.is_required && isStepActive;
  const colSpan = isWideField(field) ? "md:col-span-2" : "";

  if (field.field_type === "boolean") {
    return (
      <label
        className={`flex items-center gap-3 rounded-[10px] border border-white/[0.08] bg-[rgba(255,255,255,0.04)] px-3 py-2.5 ${colSpan}`}
      >
        <FieldInput field={field} required={required} todayDate={todayDate} />
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
      <FieldInput field={field} required={required} todayDate={todayDate} />
      {field.help_text ? (
        <span className="text-[11px] leading-4 text-[rgba(245,247,250,0.46)]">
          {field.help_text}
        </span>
      ) : null}
    </label>
  );
}

function ProgressBar({
  current,
  steps,
  onJump,
}: Readonly<{
  current: number;
  onJump: (index: number) => void;
  steps: ReadonlyArray<StepConfig>;
}>) {
  return (
    <ol className="mb-5 grid grid-cols-3 gap-2" role="list">
      {steps.map((step, index) => {
        const isCurrent = index === current;
        const isDone = index < current;
        const canJumpBack = index < current;
        return (
          <li className="min-w-0" key={step.id}>
            <button
              aria-current={isCurrent ? "step" : undefined}
              className="group flex w-full items-center gap-2 text-left disabled:cursor-not-allowed"
              disabled={!canJumpBack}
              onClick={() => onJump(index)}
              type="button"
            >
              <span
                aria-hidden
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[12px] font-black transition"
                style={
                  isCurrent
                    ? {
                        backgroundColor: "rgba(20,184,166,0.18)",
                        borderColor: "rgba(20,184,166,0.45)",
                        color: "#2dd4bf",
                      }
                    : isDone
                      ? {
                          backgroundColor: "rgba(20,184,166,0.10)",
                          borderColor: "rgba(20,184,166,0.30)",
                          color: "#2dd4bf",
                        }
                      : {
                          backgroundColor: "rgba(255,255,255,0.04)",
                          borderColor: "rgba(255,255,255,0.10)",
                          color: "rgba(245,247,250,0.46)",
                        }
                }
              >
                {isDone ? "✓" : index + 1}
              </span>
              <span className="min-w-0 leading-tight">
                <span
                  className="block truncate text-[12px] font-extrabold"
                  style={{
                    color: isCurrent || isDone ? "#F5F7FA" : "rgba(245,247,250,0.55)",
                  }}
                >
                  {step.label}
                </span>
                <span
                  className="block truncate text-[10px] uppercase tracking-[0.08em]"
                  style={{ color: "rgba(245,247,250,0.46)" }}
                >
                  Step {index + 1} of {steps.length}
                </span>
              </span>
            </button>
            <div
              aria-hidden
              className="mt-1.5 h-0.5 w-full rounded-full"
              style={{
                background:
                  isCurrent || isDone
                    ? "linear-gradient(90deg, #14b8a6, #2dd4bf)"
                    : "rgba(255,255,255,0.06)",
              }}
            />
          </li>
        );
      })}
    </ol>
  );
}

// ───────── Wizard ─────────

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
  const [step, setStep] = useState(0);
  const formRef = useRef<HTMLFormElement | null>(null);

  // Group fields once per render.
  const groups = useMemo(() => {
    const buckets: Record<StepId, FieldRecord[]> = {
      service: [],
      when_where: [],
      contact: [],
    };
    page.fields.forEach((field) => buckets[groupForField(field)].push(field));
    return buckets;
  }, [page.fields]);

  const isLast = step === STEPS.length - 1;

  function validateStep(targetIndex: number): boolean {
    const root = document.getElementById(`quote-step-${targetIndex}`);
    if (!root) return true;
    const controls = root.querySelectorAll<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >("input, select, textarea");
    let firstInvalid:
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
      | null = null;

    for (const control of controls) {
      if (!control.checkValidity()) {
        firstInvalid = control;
        break;
      }
    }

    if (firstInvalid) {
      firstInvalid.reportValidity();
      firstInvalid.focus();
      return false;
    }

    return true;
  }

  function goNext() {
    if (validateStep(step)) {
      setStep((current) => Math.min(STEPS.length - 1, current + 1));
      requestAnimationFrame(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  function goBack() {
    setStep((current) => Math.max(0, current - 1));
  }

  // Intercept Enter / submit so a non-final step advances instead of submitting.
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (!isLast) {
      event.preventDefault();
      goNext();
    }
  }

  return (
    <form
      action={submitPublicIntakeAction}
      className="mx-auto w-full max-w-[720px] space-y-4 px-4 py-5 pb-10 sm:px-6"
      onSubmit={handleSubmit}
      ref={formRef}
    >
      {/* Hidden metadata — always present */}
      <input name="businessSlug" type="hidden" value={slug} />
      <input name="intakeFormId" type="hidden" value={page.form.id} />
      <input
        name="consentVersionId"
        type="hidden"
        value={page.consentVersion.id}
      />
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

      {/* Field key registry — every field key submitted on every save. */}
      {page.fields.map((field) => (
        <input
          key={field.id}
          name="fieldKeys"
          type="hidden"
          value={field.field_key}
        />
      ))}

      <ProgressBar current={step} onJump={(i) => setStep(i)} steps={STEPS} />

      {/* Header for current step */}
      <header className="space-y-1">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[rgba(245,247,250,0.55)]">
          {STEPS[step]?.label}
        </p>
        <h2 className="text-[22px] font-extrabold leading-tight tracking-[-0.03em] text-[#F5F7FA]">
          {STEPS[step]?.title}
        </h2>
        <p className="text-[13px] leading-5 text-[rgba(245,247,250,0.72)]">
          {STEPS[step]?.description}
        </p>
      </header>

      {/* Step panels — all mounted, only active is visible. */}
      {STEPS.map((stepConfig, index) => {
        const fields = groups[stepConfig.id];
        const isStepActive = index === step;
        return (
          <section
            aria-hidden={!isStepActive}
            id={`quote-step-${index}`}
            key={stepConfig.id}
            style={{ display: isStepActive ? "block" : "none" }}
          >
            {fields.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2">
                {fields.map((field) => (
                  <FieldRow
                    field={field}
                    isStepActive={isStepActive}
                    key={field.id}
                    todayDate={todayDate}
                  />
                ))}
              </div>
            ) : (
              <p className="rounded-[12px] border border-white/[0.08] bg-[rgba(255,255,255,0.04)] p-3 text-[13px] text-[rgba(245,247,250,0.55)]">
                Nothing to fill on this step. Continue to the next.
              </p>
            )}

            {/* Consent only on final step */}
            {index === STEPS.length - 1 ? (
              <ConsentBlock
                aiDisclosureEnabled={page.consentVersion.ai_disclosure_enabled}
                consentNotice={page.consentVersion.consent_notice}
                isActive={isStepActive}
              />
            ) : null}
          </section>
        );
      })}

      {/* Server-rendered error (from redirect) */}
      {query?.source === "rate_limited_demo" ? null : null}

      {/* Navigation */}
      <Navigation
        canGoBack={step > 0}
        isLast={isLast}
        onBack={goBack}
        onNext={goNext}
      />
    </form>
  );
}

// ───────── Consent + Navigation ─────────

function ConsentBlock({
  aiDisclosureEnabled,
  consentNotice,
  isActive,
}: Readonly<{
  aiDisclosureEnabled: boolean;
  consentNotice: string;
  isActive: boolean;
}>) {
  return (
    <label className="mt-4 flex items-start gap-3 rounded-[12px] border border-white/[0.08] bg-[rgba(255,255,255,0.04)] p-3 text-[12px] leading-5 text-[rgba(245,247,250,0.72)]">
      <input
        className="mt-0.5 h-4 w-4 shrink-0 accent-[#17D492]"
        name="consentAccepted"
        required={isActive}
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

function Navigation({
  canGoBack,
  isLast,
  onBack,
  onNext,
}: Readonly<{
  canGoBack: boolean;
  isLast: boolean;
  onBack: () => void;
  onNext: () => void;
}>) {
  return (
    <div className="flex items-center gap-2 pt-1">
      {canGoBack ? (
        <button
          className="inline-flex h-11 items-center justify-center rounded-[12px] border px-4 text-[13px] font-extrabold transition hover:-translate-y-0.5"
          onClick={onBack}
          style={{
            backgroundColor: "rgba(255,255,255,0.04)",
            borderColor: "rgba(255,255,255,0.14)",
            color: "#F5F7FA",
          }}
          type="button"
        >
          ← Back
        </button>
      ) : null}
      <div className="flex-1" />
      {isLast ? (
        <button
          className="inline-flex h-11 min-w-[200px] items-center justify-center rounded-[12px] px-5 text-[14px] font-extrabold transition hover:-translate-y-0.5"
          style={{
            background: "linear-gradient(135deg, #14b8a6, #2dd4bf)",
            color: "#022c22",
            boxShadow: "0 14px 30px rgba(20,184,166,0.22)",
          }}
          type="submit"
        >
          Send quote request
        </button>
      ) : (
        <button
          className="inline-flex h-11 min-w-[140px] items-center justify-center rounded-[12px] px-5 text-[13px] font-extrabold transition hover:-translate-y-0.5"
          onClick={onNext}
          style={{
            background: "linear-gradient(135deg, #14b8a6, #2dd4bf)",
            color: "#022c22",
            boxShadow: "0 14px 30px rgba(20,184,166,0.22)",
          }}
          type="button"
        >
          Continue →
        </button>
      )}
    </div>
  );
}

// Helper exports — used by the page wrapper if it ever wants to surface
// the step list (analytics, breadcrumbs, etc.).
export type { StepId };
export const QUOTE_WIZARD_STEPS = STEPS;
