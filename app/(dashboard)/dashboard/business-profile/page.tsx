/**
 * ============================================================
 * File: app/(dashboard)/dashboard/business-profile/page.tsx
 * Project: BizPilot AI
 * Description: Business Profile workspace — identity + operating context.
 * Role: Owner-facing identity card kept separate from Quote Setup, matching the approved index.html two-card layout. Only fields that exist in the v1.5 schema today are editable; the rest are shown as roadmap placeholders so the visual matches the index without violating "no schema expansion" (Engineering Standard v1.5 §3).
 * Related:
 * - app/(dashboard)/dashboard/configuration/page.tsx
 * - server/actions/business-configuration.actions.ts
 * - docs/engineering/BIZPILOT_ENGINEERING_STANDARD_v1.5.md
 * Author: MoOoH
 * Created: 2026-05-18
 * Last Updated: 2026-05-19
 * Change Log:
 * - 2026-05-18: Created the Phase 18A Business Profile workspace.
 * - 2026-05-19: Rebuilt as a two-card layout mirroring the approved index.html — Business identity + Service area & operating notes — and clearly flagged future fields without touching the database schema.
 * ============================================================
 */

import Link from "next/link";
import { redirect } from "next/navigation";

import { CopyButton } from "@/components/dashboard/copy-button";
import {
  buttonClass,
  DashboardCard,
  disabledButtonClass,
  inputClass,
  labelClass,
  PageHeader,
  primaryButtonClass,
  SectionHeader,
  StatusBadge,
  textareaClass,
} from "@/components/dashboard/dashboard-ui";
import { getBizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import { languageLabels, supportedLanguages } from "@/lib/i18n/language";
import { saveBusinessConfigurationAction } from "@/server/actions/business-configuration.actions";
import { getCurrentUser } from "@/server/services/auth.service";
import { getBusinessConfigurationWorkspace } from "@/server/services/business-configuration.service";
import { getBusinessWorkspace } from "@/server/services/business.service";

export const dynamic = "force-dynamic";

type BusinessProfilePageProps = Readonly<{
  searchParams?: Promise<{
    error?: string;
    notice?: string;
  }>;
}>;

function serviceAreasToText(
  areas: Awaited<
    ReturnType<typeof getBusinessConfigurationWorkspace>
  >["configuration"]["serviceAreas"],
): string {
  return areas.map((area) => area.name).join("\n");
}

function servicesToText(
  services: Awaited<
    ReturnType<typeof getBusinessConfigurationWorkspace>
  >["configuration"]["services"],
): string {
  return services
    .map((service) =>
      service.description
        ? `${service.name} | ${service.description}`
        : service.name,
    )
    .join("\n");
}

function faqsToText(
  faqs: Awaited<
    ReturnType<typeof getBusinessConfigurationWorkspace>
  >["configuration"]["faqs"],
): string {
  return faqs.map((faq) => `${faq.question} | ${faq.answer}`).join("\n");
}

export default async function BusinessProfilePage({
  searchParams,
}: BusinessProfilePageProps) {
  const [params, user] = await Promise.all([searchParams, getCurrentUser()]);

  if (!user) {
    redirect("/auth/sign-in");
  }

  const workspace = await getBusinessWorkspace({ userId: user.id });
  const activeBusiness = workspace.businesses[0];

  if (!activeBusiness) {
    redirect("/dashboard");
  }

  const configurationWorkspace = await getBusinessConfigurationWorkspace({
    business: activeBusiness,
  });
  const { cleaningTemplate, configuration } = configurationWorkspace;
  const quotePath = `/quote/${activeBusiness.slug}`;
  const primaryColor = configuration.branding?.primary_color ?? "#18181b";
  const accentColor = configuration.branding?.accent_color ?? "#0f766e";
  const copy = getBizPilotCopy(activeBusiness.preferred_language);
  const consentNotice =
    configuration.consentSettings?.consent_notice ??
    copy.quoteForm.consentNoticeDefault;
  const privacyMode = configuration.privacySettings?.privacy_mode ?? "standard";
  const retainLeadsDays =
    configuration.privacySettings?.retain_leads_days ?? 365;

  return (
    <main className="space-y-4">
      <PageHeader
        actions={
          <>
            <CopyButton label="Copy quote link" value={quotePath} />
            <Link className={buttonClass} href="/dashboard/configuration">
              Open Quote Setup
            </Link>
            <Link className={primaryButtonClass} href={quotePath}>
              Preview Quote Page
            </Link>
          </>
        }
        description="Business identity and operating context. This is separate from Quote Setup."
        eyebrow="Business"
        title="Business Profile"
      />

      {params?.notice ? (
        <p className="rounded-[14px] border border-emerald-300/35 bg-emerald-500/12 p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-200">
          {params.notice}
        </p>
      ) : null}

      {params?.error ? (
        <p className="rounded-[14px] border border-red-300/35 bg-red-500/12 p-3 text-xs font-semibold text-red-700 dark:text-red-200">
          {params.error}
        </p>
      ) : null}

      <form
        action={saveBusinessConfigurationAction}
        className="space-y-4"
        id="business-profile-form"
      >
        {/* Hidden fields preserve every required input across saves. */}
        <input name="businessId" type="hidden" value={activeBusiness.id} />
        <input
          name="templateId"
          type="hidden"
          value={cleaningTemplate.template.id}
        />
        <input name="primaryColor" type="hidden" value={primaryColor} />
        <input name="accentColor" type="hidden" value={accentColor} />
        <input name="consentNotice" type="hidden" value={consentNotice} />
        <input name="privacyMode" type="hidden" value={privacyMode} />
        <input
          name="retainLeadsDays"
          type="hidden"
          value={retainLeadsDays}
        />
        <input
          name="services"
          type="hidden"
          value={servicesToText(configuration.services)}
        />
        <input
          name="faqs"
          type="hidden"
          value={faqsToText(configuration.faqs)}
        />
        {configuration.consentSettings?.privacy_contact_email ? (
          <input
            name="privacyContactEmail"
            type="hidden"
            value={configuration.consentSettings.privacy_contact_email}
          />
        ) : null}
        {configuration.consentSettings?.ai_disclosure_enabled ?? true ? (
          <input name="aiDisclosureEnabled" type="hidden" value="on" />
        ) : null}
        {cleaningTemplate.fields.map((field) => (
          <span hidden key={field.field_key}>
            <input name="templateFieldKeys" type="hidden" value={field.field_key} />
            <input name={`fieldLabel:${field.field_key}`} type="hidden" value={field.label} />
            <input
              name={`fieldHelp:${field.field_key}`}
              type="hidden"
              value={field.help_text ?? ""}
            />
            <input
              name={`fieldSort:${field.field_key}`}
              type="hidden"
              value={field.sort_order}
            />
            {field.is_required ? (
              <input
                name={`fieldRequired:${field.field_key}`}
                type="hidden"
                value="on"
              />
            ) : null}
            {field.is_hidden ? (
              <input
                name={`fieldHidden:${field.field_key}`}
                type="hidden"
                value="on"
              />
            ) : null}
          </span>
        ))}

        <section className="grid min-w-0 gap-4 xl:grid-cols-2">
          <DashboardCard className="p-[22px]" variant="elevated">
            <SectionHeader
              description="Owner-facing identity used across the dashboard, public quote page, and AI draft context."
              title="Business identity"
            />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className={labelClass}>
                Business name
                <input
                  className={inputClass}
                  defaultValue={activeBusiness.name}
                  name="businessName"
                  required
                  type="text"
                />
              </label>
              <label className={labelClass}>
                Public slug
                <input
                  className={inputClass}
                  defaultValue={activeBusiness.slug}
                  name="businessSlug"
                  pattern="[a-z0-9]+(-[a-z0-9]+)*"
                  required
                  type="text"
                />
              </label>
              <label className={`${labelClass} sm:col-span-2`}>
                Custom quote template name
                <input
                  className={inputClass}
                  defaultValue={
                    configuration.templateSettings?.custom_name ??
                    cleaningTemplate.template.name
                  }
                  name="customTemplateName"
                  type="text"
                />
              </label>
              <label className={labelClass}>
                Preferred language
                <select
                  className={inputClass}
                  defaultValue={activeBusiness.preferred_language}
                  name="preferredLanguage"
                  required
                >
                  {supportedLanguages.map((language) => (
                    <option key={language} value={language}>
                      {languageLabels[language]}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] leading-4 text-[var(--dash-text-muted)]">
                  Used for the public quote page and AI draft language.
                </span>
              </label>
              <label className={labelClass}>
                Owner email (read-only)
                <input
                  className={inputClass}
                  defaultValue={user.email ?? user.id}
                  disabled
                  type="email"
                />
                <span className="text-[11px] leading-4 text-[var(--dash-text-muted)]">
                  Account email — change it from Settings.
                </span>
              </label>
              <label className={labelClass}>
                Business type
                <input
                  className={inputClass}
                  defaultValue="Cleaning"
                  disabled
                  type="text"
                />
                <span className="text-[11px] leading-4 text-[var(--dash-text-muted)]">
                  Phase 18A is cleaning-first. Other verticals are locked until
                  the validation gate clears.
                </span>
              </label>
            </div>
          </DashboardCard>

          <DashboardCard className="p-[22px]">
            <SectionHeader
              description="Operating context that helps the owner and AI prepare better drafts. AI guardrails and FAQ details stay in Quote Setup."
              title="Service area & operating notes"
            />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className={labelClass}>
                Logo URL
                <input
                  className={inputClass}
                  defaultValue={configuration.branding?.logo_url ?? ""}
                  name="logoUrl"
                  type="url"
                />
              </label>
              <label className={labelClass}>
                Public quote link
                <input
                  className={inputClass}
                  defaultValue={quotePath}
                  disabled
                  type="text"
                />
              </label>
              <label className={`${labelClass} sm:col-span-2`}>
                Service areas
                <textarea
                  className={`${textareaClass} min-h-28`}
                  defaultValue={serviceAreasToText(configuration.serviceAreas)}
                  name="serviceAreas"
                  placeholder={"Montreal\nLaval\nLongueuil"}
                />
                <span className="text-[11px] leading-4 text-[var(--dash-text-muted)]">
                  One area per line. Used to score leads and explain coverage.
                </span>
              </label>
            </div>
          </DashboardCard>
        </section>

        <DashboardCard className="p-[22px]" variant="priority">
          <SectionHeader
            description="These fields are part of the approved index design but are not yet wired to a database column. They will land with their own migration after pilot validation — adding them now would violate the v1.5 'no schema expansion mid-phase' rule."
            title="Roadmap fields"
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Owner display name", "Phase 18B"],
              ["Owner phone", "Phase 18B"],
              ["Public website", "Phase 18B"],
              ["City", "Phase 18B"],
              ["Province", "Phase 18B"],
              ["Response hours", "Phase 18B"],
            ].map(([title, badge]) => (
              <div
                className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3"
                key={title}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-extrabold text-[var(--dash-text)]">
                    {title}
                  </p>
                  <StatusBadge>{badge}</StatusBadge>
                </div>
                <button
                  className={`${disabledButtonClass} mt-3 w-full`}
                  type="button"
                >
                  Not in MVP
                </button>
              </div>
            ))}
          </div>
        </DashboardCard>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-[var(--dash-border)] bg-[var(--dash-surface-elevated)] p-3">
          <p className="text-[12px] text-[var(--dash-text-secondary)]">
            Save persists identity changes. Quote-form questions are managed in
            Quote Setup.
          </p>
          <button className={primaryButtonClass} type="submit">
            Save Business Profile
          </button>
        </div>
      </form>
    </main>
  );
}
