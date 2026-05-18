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
 * Last Updated: 2026-05-18
 * Change Log:
 * - 2026-05-06: Created public quote page with dynamic form rendering.
 * - 2026-05-18: Applied shared BizPilot landing theme tokens to the public quote page.
 * ============================================================
 */

import { notFound } from "next/navigation";

import {
  BizPilotBrand,
  BizPilotThemeShell,
} from "@/components/ui/bizpilot-theme";
import { bizColors, bizTheme } from "@/lib/design-tokens";
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
  const baseClass = `${bizTheme.field} mt-2 px-3 py-2`;

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
        className="mt-3 h-5 w-5 accent-[#17D492]"
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

  const primaryColor = page.branding?.primary_color ?? bizColors.accent;
  const accentColor = page.branding?.accent_color ?? bizColors.accent;
  const todayDate = todayDateString();

  return (
    <BizPilotThemeShell>
      <section className="border-b border-white/[0.06] px-4 py-7 sm:px-6">
        <div className="mx-auto flex w-full max-w-[760px] flex-col gap-6">
          <BizPilotBrand compact subtitle="Quote request" />

          <div className="rounded-[18px] border border-white/[0.08] bg-white/[0.035] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.16)] sm:p-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#17D492]/18 bg-[#17D492]/8 px-3 py-1 text-[11px] font-bold uppercase text-[#17D492]">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: primaryColor }}
              />
              Cleaning quote request
            </p>
            <h1 className="mt-4 text-[30px] font-bold leading-[1.05] tracking-[-0.03em] text-[#F5F7FA] sm:text-[36px]">
              {page.publicLink.display_name}
            </h1>
            <p className={`mt-3 max-w-[44ch] text-sm leading-6 ${bizTheme.secondaryText}`}>
              Share the details for your cleaning request. The business will review your request and follow up directly.
            </p>
            <div
              className="mt-5 h-px w-full opacity-70"
              style={{
                background: `linear-gradient(90deg, ${accentColor}, transparent)`,
              }}
            />
          </div>
        </div>
      </section>

      <form
        action={submitPublicIntakeAction}
        className="mx-auto w-full max-w-[760px] space-y-4 px-4 py-6 sm:px-6"
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
          <p className="rounded-[12px] border border-[#FF5C5C]/22 bg-[#FF5C5C]/10 p-3 text-sm text-[#FFB4B4]">
            {query.error}
          </p>
        ) : null}

        <div className="space-y-3.5">
          {page.fields.map((field) => (
            <label
              className="block rounded-[14px] border border-white/[0.08] bg-[rgba(13,23,33,0.78)] p-3.5 text-sm font-semibold text-[rgba(245,247,250,0.84)] shadow-[0_16px_44px_rgba(0,0,0,0.14)]"
              key={field.id}
            >
              <span>
                {field.label}
                {field.is_required ? (
                  <span className="text-[#FF5C5C]"> *</span>
                ) : null}
              </span>
              {field.help_text ? (
                <span className={`mt-1 block text-xs leading-5 ${bizTheme.mutedText}`}>
                  {field.help_text}
                </span>
              ) : null}
              <input name="fieldKeys" type="hidden" value={field.field_key} />
              <FieldInput field={field} todayDate={todayDate} />
            </label>
          ))}
        </div>

        <label className="flex items-start gap-3 rounded-[14px] border border-white/[0.08] bg-white/[0.035] p-3.5 text-sm leading-6 text-[rgba(245,247,250,0.72)] shadow-[0_16px_44px_rgba(0,0,0,0.12)]">
          <input
            className="mt-1 h-4 w-4 accent-[#17D492]"
            name="consentAccepted"
            required
            type="checkbox"
          />
          <span>
            {page.consentVersion.consent_notice}
            {page.consentVersion.ai_disclosure_enabled ? (
              <span className={`block pt-2 text-xs ${bizTheme.mutedText}`}>
                BizPilot may help prepare internal AI drafts later, but the
                business reviews messages before sending.
              </span>
            ) : null}
          </span>
        </label>

        <button
          className={`${bizTheme.buttonPrimary} h-11 w-full px-6 text-sm sm:w-auto`}
          type="submit"
        >
          Submit quote request
        </button>
      </form>
    </BizPilotThemeShell>
  );
}
