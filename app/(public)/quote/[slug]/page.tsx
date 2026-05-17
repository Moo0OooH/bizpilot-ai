/**
 * ============================================================
 * File: app/(public)/quote/[slug]/page.tsx
 * Project: BizPilot AI
 * Description: Renders the Phase 4 public branded quote request page.
 * Role: Displays public-safe business branding and dynamic Cleaning intake fields.
 * Related:
 * - server/actions/public-intake.actions.ts
 * - server/services/public-intake.service.ts
 * - supabase/migrations/0005_public_intake_and_leads.sql
 * Author: MoOoH
 * Created: 2026-05-06
 * Last Updated: 2026-05-06
 * Change Log:
 * - 2026-05-06: Created public quote page with dynamic form rendering.
 * ============================================================
 */

import { notFound } from "next/navigation";

import { submitPublicIntakeAction } from "@/server/actions/public-intake.actions";
import { getPublicIntakePage } from "@/server/services/public-intake.service";
import type { Json } from "@/types/database";

export const dynamic = "force-dynamic";

type QuotePageProps = Readonly<{
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    error?: string;
    ref?: string;
    source?: string;
    utm_campaign?: string;
    utm_medium?: string;
    utm_source?: string;
  }>;
}>;

type FieldRecord = NonNullable<
  Awaited<ReturnType<typeof getPublicIntakePage>>
>["fields"][number];

const appTimeZone = "America/New_York";

function todayDateString(): string {
  const parts = new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "2-digit",
    timeZone: appTimeZone,
    year: "numeric",
  }).formatToParts(new Date());
  const valueByType = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return `${valueByType.year}-${valueByType.month}-${valueByType.day}`;
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

function inputTypeForField(fieldType: FieldRecord["field_type"]): string {
  if (fieldType === "phone") {
    return "tel";
  }

  if (fieldType === "number" || fieldType === "date" || fieldType === "email") {
    return fieldType;
  }

  return "text";
}

function getNumberMinimum(field: FieldRecord): number | undefined {
  return field.field_type === "number" ? 0 : undefined;
}

function getInputMinimum(input: {
  field: FieldRecord;
  todayDate: string;
}): number | string | undefined {
  if (input.field.field_type === "date") {
    return input.todayDate;
  }

  return getNumberMinimum(input.field);
}

function FieldInput({
  field,
  todayDate,
}: Readonly<{ field: FieldRecord; todayDate: string }>) {
  const baseClass =
    "mt-2 w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[var(--biz-primary)] focus:ring-2 focus:ring-emerald-600/15";

  if (field.field_type === "textarea") {
    return (
      <textarea
        className={`${baseClass} min-h-24`}
        name={`field:${field.field_key}`}
        required={field.is_required}
      />
    );
  }

  if (field.field_type === "boolean") {
    return (
      <input
        className="mt-3 h-5 w-5"
        name={`field:${field.field_key}`}
        type="checkbox"
      />
    );
  }

  if (field.field_type === "select" || field.field_type === "time_window") {
    return (
      <select
        className={baseClass}
        name={`field:${field.field_key}`}
        required={field.is_required}
      >
        <option value="">Select an option</option>
        {getOptions(field.options).map((option) => (
          <option key={option} value={option}>
            {toOptionLabel(option)}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      className={baseClass}
      min={getInputMinimum({ field, todayDate })}
      name={`field:${field.field_key}`}
      required={field.is_required}
      type={inputTypeForField(field.field_type)}
    />
  );
}

export default async function QuotePage({
  params,
  searchParams,
}: QuotePageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const page = await getPublicIntakePage({ slug });

  if (!page) {
    notFound();
  }

  const primaryColor = page.branding?.primary_color ?? "#18181b";
  const accentColor = page.branding?.accent_color ?? "#0f766e";
  const todayDate = todayDateString();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] text-slate-950">
      <section
        className="border-b border-slate-200 bg-white/80 px-4 py-8 shadow-[0_10px_35px_rgba(15,23,42,0.04)] sm:px-6"
        style={{
          borderColor: accentColor,
        }}
      >
        <div className="mx-auto flex w-full max-w-[700px] flex-col gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-normal text-slate-500">
              Quote request
            </p>
            <h1 className="mt-2 text-[28px] font-semibold leading-tight tracking-normal sm:text-[32px]">
              {page.publicLink.display_name}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Share the details for your cleaning request. The business will
              review your request and follow up directly.
            </p>
          </div>
        </div>
      </section>

      <form
        action={submitPublicIntakeAction}
        className="mx-auto w-full max-w-[700px] space-y-4 px-4 py-6 sm:px-6"
      >
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
        <input
          name="utmCampaign"
          type="hidden"
          value={query?.utm_campaign ?? ""}
        />
        <label className="hidden">
          Company website
          <input autoComplete="off" name="companyWebsite" tabIndex={-1} />
        </label>

        {query?.error ? (
          <p className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {query.error}
          </p>
        ) : null}

        <div className="space-y-3.5">
          {page.fields.map((field) => (
            <label
              className="block rounded-[12px] border border-slate-200 bg-white p-3.5 text-sm font-medium text-slate-800 shadow-[0_10px_26px_rgba(15,23,42,0.045)]"
              key={field.id}
            >
              <span>
                {field.label}
                {field.is_required ? (
                  <span className="text-red-600"> *</span>
                ) : null}
              </span>
              {field.help_text ? (
                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  {field.help_text}
                </span>
              ) : null}
              <input name="fieldKeys" type="hidden" value={field.field_key} />
              <FieldInput field={field} todayDate={todayDate} />
            </label>
          ))}
        </div>

        <label className="flex items-start gap-3 rounded-[12px] border border-slate-200 bg-white p-3.5 text-sm leading-6 text-slate-700 shadow-[0_10px_26px_rgba(15,23,42,0.045)]">
          <input
            className="mt-1 h-4 w-4"
            name="consentAccepted"
            required
            type="checkbox"
          />
          <span>
            {page.consentVersion.consent_notice}
            {page.consentVersion.ai_disclosure_enabled ? (
              <span className="block pt-2 text-xs text-slate-500">
                BizPilot may help prepare internal AI drafts later, but the
                business reviews messages before sending.
              </span>
            ) : null}
          </span>
        </label>

        <button
          className="h-11 w-full rounded-[10px] px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(4,120,87,0.18)] sm:w-auto"
          style={{
            backgroundColor: primaryColor,
          }}
          type="submit"
        >
          Submit quote request
        </button>
      </form>
    </main>
  );
}
