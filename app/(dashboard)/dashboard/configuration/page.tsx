/**
 * ============================================================
 * File: app/(dashboard)/dashboard/configuration/page.tsx
 * Project: BizPilot AI
 * Description: Renders the protected Quote Setup workspace.
 * Role: Lets owners configure the public quote page, services, form questions, AI guardrails, and privacy settings.
 * Related:
 * - server/services/auth.service.ts
 * - server/services/business.service.ts
 * - server/actions/auth.actions.ts
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-18
 * Change Log:
 * - 2026-05-04: Created protected Phase 2 dashboard shell.
 * - 2026-05-04: Removed manual token plumbing after Supabase SDK migration.
 * - 2026-05-04: Marked dashboard shell as request-time only.
 * - 2026-05-05: Added Phase 3 business configuration forms and readiness score.
 * - 2026-05-05: Added editable business profile fields and setup task display.
 * - 2026-05-05: Added Cleaning template label and required-field overrides.
 * - 2026-05-05: Persisted optional overrides for default-required template fields.
 * - 2026-05-05: Clarified FAQ textarea format for persistent FAQ parsing.
 * - 2026-05-05: Loads Cleaning template field edits from business_template_settings.
 * - 2026-05-06: Shows the Phase 4 public quote link generated from the business slug.
 * - 2026-05-09: Polished the business configuration UX into clearer cards and sections.
 * - 2026-05-10: Moved Business Configuration from /dashboard to /dashboard/configuration.
 * ============================================================
 */

import { redirect } from "next/navigation";

import { ConfigurationTabs } from "@/components/dashboard/configuration-tabs";
import {
  buttonClass,
  inputClass,
  labelClass,
  PageHeader,
  textareaClass,
} from "@/components/dashboard/dashboard-ui";
import { getBizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import { languageLabels, supportedLanguages } from "@/lib/i18n/language";
import { saveBusinessConfigurationAction } from "@/server/actions/business-configuration.actions";
import { getCurrentUser } from "@/server/services/auth.service";
import { getBusinessConfigurationWorkspace } from "@/server/services/business-configuration.service";
import { getBusinessWorkspace } from "@/server/services/business.service";

export const dynamic = "force-dynamic";

type DashboardPageProps = Readonly<{
  searchParams?: Promise<{
    error?: string;
    notice?: string;
  }>;
}>;

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

function serviceAreasToText(
  areas: Awaited<
    ReturnType<typeof getBusinessConfigurationWorkspace>
  >["configuration"]["serviceAreas"],
): string {
  return areas.map((area) => area.name).join("\n");
}

function ConfigurationPanel({
  children,
  description,
  id,
  summary,
  title,
}: Readonly<{
  children: React.ReactNode;
  description?: string;
  id?: string;
  summary?: string;
  title: string;
}>) {
  return (
    <section
      className="scroll-mt-4 rounded-[24px] border border-[var(--dash-border)] bg-[var(--dash-surface)] p-[18px] shadow-[0_16px_44px_rgba(2,6,23,0.12)]"
      id={id}
    >
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_18rem] sm:items-start">
        <div className="min-w-0">
          <h2 className="text-[18px] font-extrabold tracking-[-0.03em] text-[var(--dash-text)]">{title}</h2>
          {description ? (
            <p className="mt-1 text-[13px] leading-5 text-[var(--dash-text-secondary)]">
              {description}
            </p>
          ) : null}
        </div>
        {summary ? (
          <p className="rounded-[12px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-2 text-xs leading-4 text-[var(--dash-text-secondary)]">
            {summary}
          </p>
        ) : null}
      </div>
      <div className="mt-4 border-t border-[var(--dash-border)] pt-4">{children}</div>
    </section>
  );
}

function LogoPreviewImage({
  className,
  logoUrl,
}: Readonly<{ className: string; logoUrl: string }>) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- Customer logo URLs are arbitrary HTTPS assets; Next Image remote allowlists would block pilot setup previews.
    <img alt="Logo preview" className={className} src={logoUrl} />
  );
}

const fieldInputClass =
  "biz-field h-10 w-full rounded-[12px] border px-3 text-[13px] outline-none transition focus:border-[var(--dash-primary)]";

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const workspace = await getBusinessWorkspace({
    userId: user.id,
  });
  const activeBusiness = workspace.businesses[0];

  if (!activeBusiness) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-12">
        <div className="border-b border-[var(--dash-border)] pb-8">
          <p className="text-sm font-medium uppercase tracking-normal text-[var(--dash-text-muted)]">
            BizPilot AI
          </p>
          <h1 className="mt-3 text-[26px] font-semibold text-[var(--dash-text)]">
            Quote setup
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--dash-text-secondary)]">
            No tenant business is available for this user yet.
          </p>
        </div>
      </main>
    );
  }

  const configurationWorkspace = await getBusinessConfigurationWorkspace({
    business: activeBusiness,
  });
  const { cleaningTemplate, configuration, readiness } =
    configurationWorkspace;
  const primaryColor = configuration.branding?.primary_color ?? "#18181b";
  const accentColor = configuration.branding?.accent_color ?? "#0f766e";
  const copy = getBizPilotCopy(activeBusiness.preferred_language);
  const logoUrl = configuration.branding?.logo_url ?? "";
  const visibleTemplateFieldCount = cleaningTemplate.fields.filter(
    (field) => !field.is_hidden,
  ).length;
  const readinessPercent = Math.round(
    (readiness.completed / Math.max(readiness.total, 1)) * 100,
  );

  return (
    <>
      <main className="space-y-4">
        <PageHeader
          description={`Configure the cleaning quote experience, public link, consent, and owner-ready lead foundation for ${activeBusiness.name}.`}
          eyebrow="Business setup"
          title="Quote Setup"
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
            className="space-y-3"
            id="business-configuration-form"
          >
            <input name="businessId" type="hidden" value={activeBusiness.id} />
            <input
              name="templateId"
              type="hidden"
              value={cleaningTemplate.template.id}
            />

          <section className="grid items-start gap-4 2xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0">
          <ConfigurationTabs
            sections={[
              { id: "configuration-overview", label: "Overview" },
              { id: "business-profile", label: "Public Basics" },
              { id: "cleaning-template-fields", label: "Form Questions" },
              { id: "services-areas", label: "Services" },
              { id: "branding", label: "Branding" },
              { id: "faq", label: "AI Instructions" },
              { id: "public-page", label: "Public Link" },
              { id: "notifications", label: "Notifications" },
              { id: "privacy-consent", label: "Privacy" },
              { id: "setup-checklist", label: "Readiness" },
            ]}
          >
            <ConfigurationPanel
              description="A clean operating summary of the quote link, setup health, and public customer experience."
              id="configuration-overview"
              summary={`${readiness.completed}/${readiness.total} setup items complete`}
              title="Quote setup overview"
            >
              <div className="grid gap-3.5 xl:grid-cols-[minmax(0,1fr)_20rem]">
                <div className="grid gap-3.5 lg:grid-cols-[17rem_minmax(0,1fr)]">
                  <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3.5">
                    <div
                      className="flex h-28 items-center justify-center overflow-hidden rounded-lg border bg-[var(--dash-surface)]"
                      style={{ borderColor: "rgba(23,212,146,0.22)" }}
                    >
                      {logoUrl ? (
                        <LogoPreviewImage
                          className="h-full max-h-28 w-full object-contain p-4"
                          logoUrl={logoUrl}
                        />
                      ) : (
                        <span
                          className="flex h-12 w-12 items-center justify-center rounded-lg text-sm font-semibold text-white"
                          style={{ backgroundColor: primaryColor }}
                        >
                          BP
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-sm font-semibold text-[var(--dash-text)]">
                      {activeBusiness.name}
                    </p>
                    <p className="mt-1 break-all text-xs text-[var(--dash-text-muted)]">
                      /quote/{activeBusiness.slug}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <span
                        className="h-5 w-5 rounded-full border border-[var(--dash-border)]"
                        style={{ backgroundColor: primaryColor }}
                      />
                      <span
                        className="h-5 w-5 rounded-full border border-[var(--dash-border)]"
                        style={{ backgroundColor: accentColor }}
                      />
                    </div>
                  </div>

                  <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-[var(--dash-text-muted)]">
                          Workspace readiness
                        </p>
                        <p className="mt-1 text-[22px] font-semibold text-[var(--dash-text)]">
                          {readinessPercent}%
                        </p>
                      </div>
                      <p className="text-right text-xs font-medium text-[var(--dash-text-muted)]">
                        {readiness.completed}/{readiness.total} complete
                      </p>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--dash-surface-muted)]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: "#17D492",
                          width: `${readinessPercent}%`,
                        }}
                      />
                    </div>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {[
                        ["Profile", activeBusiness.name],
                        ["Branding", logoUrl ? "Logo configured" : "Colors ready"],
                        [
                          "Services",
                          `${configuration.services.length} service records`,
                        ],
                        [
                          "Service areas",
                          `${configuration.serviceAreas.length} covered areas`,
                        ],
                        [
                          "Quote form",
                          `${visibleTemplateFieldCount}/${cleaningTemplate.fields.length} visible questions`,
                        ],
                        ["FAQ", `${configuration.faqs.length} answers`],
                        [
                          "Privacy",
                          configuration.privacySettings?.privacy_mode ?? "standard",
                        ],
                        ["Public link", `/quote/${activeBusiness.slug}`],
                      ].map(([title, value]) => (
                        <div
                          className="rounded-md border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-2"
                          key={title}
                        >
                          <p className="text-xs font-medium text-[var(--dash-text-muted)]">
                            {title}
                          </p>
                          <p className="mt-1 truncate text-xs font-semibold text-[var(--dash-text)]">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3.5">
                  <p className="text-[18px] font-extrabold tracking-[-0.03em] text-[var(--dash-text)]">
                    Setup report
                  </p>
                  <div className="mt-3 grid gap-2">
                    {readiness.items.map((item) => (
                      <div
                        className="flex items-center justify-between gap-3 rounded-md bg-[var(--dash-surface)] px-3 py-2 text-xs"
                        key={item.label}
                      >
                        <span className="truncate text-[var(--dash-text-secondary)]">
                          {item.label}
                        </span>
                        <span
                          className={
                            item.complete
                              ? "font-medium text-emerald-700 dark:text-emerald-300"
                              : "font-medium text-amber-700 dark:text-amber-300"
                          }
                        >
                          {item.complete ? "Done" : "Open"}
                        </span>
                      </div>
                    ))}
                  </div>
                  <a
                    className={`${buttonClass} mt-4 w-full`}
                    href={`/quote/${activeBusiness.slug}`}
                  >
                    Preview public quote
                  </a>
                </div>
              </div>
            </ConfigurationPanel>

            <ConfigurationPanel
              description="Core identity used across the protected workspace and public quote link."
              id="business-profile"
              summary={`${activeBusiness.name} - /quote/${activeBusiness.slug}`}
              title="Public quote basics"
            >
              <div className="grid gap-2.5 sm:grid-cols-3">
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
                <label className={labelClass}>
                  Template name
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
                  <span className="mt-1 block text-xs leading-4 text-[var(--dash-text-muted)]">
                    Controls public quote copy and AI draft language.
                  </span>
                </label>
              </div>
            </ConfigurationPanel>

            <ConfigurationPanel
              description="Public-facing visual settings for the cleaning quote experience."
              id="branding"
              summary={logoUrl ? "Logo and colors configured" : "Add logo and colors"}
              title="Branding"
            >
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_16rem]">
                <div className="grid gap-2.5 sm:grid-cols-3">
                  <label className={`${labelClass} sm:col-span-3`}>
                    Logo URL
                    <input
                      className={inputClass}
                      defaultValue={logoUrl}
                      name="logoUrl"
                      type="url"
                    />
                  </label>
                  <label className={labelClass}>
                    Primary color
                    <input
                      className="mt-1 h-8 w-full rounded-md border border-[var(--dash-border-strong)] px-2 py-1"
                      defaultValue={primaryColor}
                      name="primaryColor"
                      type="color"
                    />
                  </label>
                  <label className={labelClass}>
                    Accent color
                    <input
                      className="mt-1 h-8 w-full rounded-md border border-[var(--dash-border-strong)] px-2 py-1"
                      defaultValue={accentColor}
                      name="accentColor"
                      type="color"
                    />
                  </label>
                  <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3 sm:col-span-3">
                    <p className="text-xs font-medium text-[var(--dash-text-secondary)]">
                      Where these colors apply
                    </p>
                    <div className="mt-2 overflow-hidden rounded-[12px] border border-[var(--dash-border)] bg-[#071018] p-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold text-[#F5F7FA]">
                          Public quote button
                        </span>
                        <span
                          className="rounded-[10px] px-3 py-1.5 text-xs font-semibold text-white"
                          style={{ backgroundColor: primaryColor }}
                        >
                          Submit quote request
                        </span>
                      </div>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--dash-surface)]/10">
                        <div
                          className="h-full rounded-full"
                          style={{ backgroundColor: accentColor, width: "62%" }}
                        />
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-[var(--dash-text-secondary)]">
                      <span
                        className="h-3 w-3 rounded-full border border-[var(--dash-border)]"
                        style={{ backgroundColor: accentColor }}
                      />
                      Accent appears on progress, focus, and supporting highlights.
                    </div>
                  </div>
                </div>
                <div
                  className="flex min-h-24 items-center justify-center overflow-hidden rounded-md border bg-[var(--dash-surface-muted)]"
                  style={{ borderColor: accentColor }}
                >
                  {logoUrl ? (
                    <LogoPreviewImage
                      className="h-full max-h-24 w-full object-contain p-3"
                      logoUrl={logoUrl}
                    />
                  ) : (
                    <div className="px-3 text-center text-xs text-[var(--dash-text-muted)]">
                      Logo preview
                    </div>
                  )}
                </div>
              </div>
            </ConfigurationPanel>

            <ConfigurationPanel
              description="Shareable customer quote page generated from the active business slug and quote form."
              id="public-page"
              summary={`/quote/${activeBusiness.slug}`}
              title="Quote link and public page"
            >
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                <div className="rounded-md border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
                  <p className="text-xs font-medium text-[var(--dash-text-secondary)]">
                    Public quote link
                  </p>
                  <p className="mt-1 break-all text-sm font-semibold text-[var(--dash-text)]">
                    /quote/{activeBusiness.slug}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[var(--dash-text-muted)]">
                    Save changes before previewing branding, consent, services,
                    and quote questions.
                  </p>
                </div>
                <a
                  className="inline-flex h-8 items-center justify-center rounded-md border border-[var(--dash-border-strong)] bg-[var(--dash-surface)] px-3 text-xs font-medium text-[var(--dash-text)]"
                  href={`/quote/${activeBusiness.slug}`}
                >
                  Preview public page
                </a>
              </div>
            </ConfigurationPanel>

            <ConfigurationPanel
              description="MVP keeps notifications simple: owner email awareness only. SMS and WhatsApp stay disabled before validation."
              id="notifications"
              summary="Email active - SMS/WhatsApp disabled"
              title="Notifications"
            >
              <div className="grid gap-2.5 sm:grid-cols-2">
                <label className={labelClass}>
                  Owner email
                  <input
                    className={inputClass}
                    defaultValue={
                      configuration.consentSettings?.privacy_contact_email ??
                      "owner@example.com"
                    }
                    disabled
                    type="email"
                  />
                </label>
                <label className={labelClass}>
                  New quote request
                  <select className={inputClass} defaultValue="email_active" disabled>
                    <option value="email_active">Email active</option>
                    <option value="off">Off</option>
                  </select>
                </label>
                <label className={labelClass}>
                  SMS
                  <input
                    className={inputClass}
                    defaultValue="Future - disabled"
                    disabled
                    type="text"
                  />
                </label>
                <label className={labelClass}>
                  WhatsApp
                  <input
                    className={inputClass}
                    defaultValue="Future - disabled"
                    disabled
                    type="text"
                  />
                </label>
              </div>
            </ConfigurationPanel>

            <ConfigurationPanel
              description="Enter one city, neighborhood, or service region per line. Leads outside these areas may be marked as low fit."
              id="services-areas"
              summary={`${configuration.services.length} services - ${configuration.serviceAreas.length} areas`}
              title="Services & covered areas"
            >
              <div className="grid gap-3.5 xl:grid-cols-2">
                <label className={labelClass}>
                  Services
                  <textarea
                    className={`${textareaClass} min-h-28`}
                    defaultValue={servicesToText(configuration.services)}
                    name="services"
                  />
                  <span className="mt-1 block text-xs leading-4 text-[var(--dash-text-muted)]">
                    One service per line. Use: Service name | Optional note
                  </span>
                </label>
                <label className={labelClass}>
                  Service areas
                  <textarea
                    className={`${textareaClass} min-h-28`}
                    defaultValue={serviceAreasToText(
                      configuration.serviceAreas,
                    )}
                    name="serviceAreas"
                  />
                  <span className="mt-1 block text-xs leading-4 text-[var(--dash-text-muted)]">
                    Example: Montreal, Laval, Longueuil, South Shore
                  </span>
                </label>
              </div>
            </ConfigurationPanel>

            <ConfigurationPanel
              description="Choose which customer questions appear on the public quote form and how they read."
              id="cleaning-template-fields"
              summary={`${visibleTemplateFieldCount}/${cleaningTemplate.fields.length} visible questions`}
              title="Cleaning template"
            >
              <div className="overflow-hidden rounded-md border border-[var(--dash-border)]">
                <div className="hidden grid-cols-[minmax(0,1fr)_6rem_5rem_7rem_4rem_6rem] items-center gap-2 border-b border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-1.5 text-xs font-medium uppercase tracking-normal text-[var(--dash-text-muted)] lg:grid">
                  <span>Customer question</span>
                  <span>Type</span>
                  <span>Required</span>
                  <span>Visible on form</span>
                  <span>Position</span>
                  <span className="text-right">Customize</span>
                </div>
                {cleaningTemplate.fields.map((field) => (
                  <details
                    className="group border-b border-[var(--dash-border)] bg-[var(--dash-surface)] last:border-b-0"
                    key={field.id}
                    name="public-quote-question"
                  >
                    <input
                      name="templateFieldKeys"
                      type="hidden"
                      value={field.field_key}
                    />
                    <summary className="grid cursor-pointer list-none gap-2 px-3 py-2 text-xs transition hover:bg-[rgba(23,212,146,0.08)] lg:grid-cols-[minmax(0,1fr)_6rem_5rem_7rem_4rem_6rem] lg:items-center [&::-webkit-details-marker]:hidden">
                      <span className="min-w-0 truncate font-medium text-[var(--dash-text)]">
                        {field.label}
                      </span>
                      <span className="capitalize text-[var(--dash-text-muted)]">
                        {field.field_type.replaceAll("_", " ")}
                      </span>
                      <span
                        className={
                          field.is_required
                            ? "text-emerald-700 dark:text-emerald-300"
                            : "text-[var(--dash-text-muted)]"
                        }
                      >
                        {field.is_required ? "Required" : "Optional"}
                      </span>
                      <span
                        className={
                          field.is_hidden ? "text-[var(--dash-text-muted)]" : "text-emerald-700 dark:text-emerald-300"
                        }
                      >
                        {field.is_hidden ? "Not visible" : "Visible"}
                      </span>
                      <span className="text-[var(--dash-text-secondary)]">{field.sort_order}</span>
                      <span className="text-left text-[var(--dash-text)] lg:text-right">
                        <span className="inline-flex h-7 items-center rounded-md border border-[var(--dash-border-strong)] bg-[var(--dash-surface)] px-2.5 text-xs font-medium group-open:hidden">
                          Customize
                        </span>
                        <span className="hidden h-7 items-center rounded-md border border-[var(--dash-border-strong)] bg-[var(--dash-surface)] px-2.5 text-xs font-medium group-open:inline-flex">
                          Close
                        </span>
                      </span>
                    </summary>
                    <div className="border-t border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-2.5">
                      <div className="grid gap-2.5 lg:grid-cols-[1fr_1fr_5rem_6rem_8rem] lg:items-end">
                        <label className="grid gap-1 text-xs font-medium text-[var(--dash-text)]">
                          Customer-facing question
                          <input
                            className={fieldInputClass}
                            defaultValue={field.label}
                            name={`fieldLabel:${field.field_key}`}
                            required
                            type="text"
                          />
                        </label>
                        <label className="grid gap-1 text-xs font-medium text-[var(--dash-text)]">
                          Helper text
                          <input
                            className={fieldInputClass}
                            defaultValue={field.help_text ?? ""}
                            name={`fieldHelp:${field.field_key}`}
                            type="text"
                          />
                        </label>
                        <label className="grid gap-1 text-xs font-medium text-[var(--dash-text)]">
                          Position
                          <input
                            className={fieldInputClass}
                            defaultValue={field.sort_order}
                            name={`fieldSort:${field.field_key}`}
                            type="number"
                          />
                        </label>
                        <label className="flex h-8 items-center gap-2 text-xs font-medium text-[var(--dash-text-secondary)]">
                          <input
                            defaultChecked={field.is_required}
                            name={`fieldRequired:${field.field_key}`}
                            type="checkbox"
                          />
                          Required
                        </label>
                        <label className="flex h-8 items-center gap-2 text-xs font-medium text-[var(--dash-text-secondary)]">
                          <input
                            defaultChecked={!field.is_hidden}
                            name={`fieldHidden:${field.field_key}`}
                            type="checkbox"
                            value=""
                          />
                          Show on public form
                          <input
                            name={`fieldHidden:${field.field_key}`}
                            type="hidden"
                            value="on"
                          />
                        </label>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </ConfigurationPanel>

            <ConfigurationPanel
              description="Reusable customer questions and answers for the cleaning business profile."
              id="faq"
              summary={`${configuration.faqs.length} FAQs`}
              title="AI instructions and FAQ"
            >
              <label className={labelClass}>
                FAQ
                <textarea
                  className={`${inputClass} h-24 min-h-24 py-2`}
                  defaultValue={faqsToText(configuration.faqs)}
                  name="faqs"
                  placeholder="Do you bring supplies? | Yes, we bring all standard supplies."
                />
                <span className="mt-1 block text-xs leading-4 text-[var(--dash-text-muted)]">
                  One FAQ per line. Use: Question? | Answer
                </span>
              </label>
            </ConfigurationPanel>

            <ConfigurationPanel
              description="Consent and retention settings used by public quote submissions."
              id="privacy-consent"
              summary={`${configuration.privacySettings?.privacy_mode ?? "standard"} - ${
                configuration.privacySettings?.retain_leads_days ?? 365
              } days`}
              title="Privacy"
            >
              <div className="grid gap-2.5 sm:grid-cols-2">
                <label className={labelClass}>
                  Privacy mode
                  <select
                    className={inputClass}
                    defaultValue={
                      configuration.privacySettings?.privacy_mode ?? "standard"
                    }
                    name="privacyMode"
                  >
                    <option value="standard">Standard</option>
                    <option value="minimal">Minimal data</option>
                    <option value="forward_only">Forward-only</option>
                  </select>
                </label>
                <label className={labelClass}>
                  Lead retention days
                  <input
                    className={inputClass}
                    defaultValue={
                      configuration.privacySettings?.retain_leads_days ?? 365
                    }
                    min={1}
                    name="retainLeadsDays"
                    type="number"
                  />
                </label>
                <label className={`${labelClass} sm:col-span-2`}>
                  Privacy contact email
                  <input
                    className={inputClass}
                    defaultValue={
                      configuration.consentSettings?.privacy_contact_email ??
                      ""
                    }
                    name="privacyContactEmail"
                    type="email"
                  />
                </label>
                <label className={`${labelClass} sm:col-span-2`}>
                  Consent notice
                  <textarea
                    className={`${inputClass} h-20 min-h-20 py-2`}
                    defaultValue={
                      configuration.consentSettings?.consent_notice ??
                      copy.quoteForm.consentNoticeDefault
                    }
                    minLength={20}
                    name="consentNotice"
                    required
                  />
                  <span className="mt-1 block text-xs leading-4 text-[var(--dash-text-muted)]">
                    Shown on the public quote page. If left blank, a safe default is saved so the consent version stays valid.
                  </span>
                </label>
                <label className="flex h-8 items-center gap-2 rounded-md border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-2.5 text-xs font-medium text-[var(--dash-text)]">
                  <input
                    defaultChecked={
                      configuration.consentSettings?.ai_disclosure_enabled ??
                      true
                    }
                    name="aiDisclosureEnabled"
                    type="checkbox"
                  />
                  Show AI draft disclosure
                </label>
              </div>
            </ConfigurationPanel>

            <ConfigurationPanel
              description={`${readiness.completed}/${readiness.total} setup tasks complete.`}
              id="setup-checklist"
              summary={
                readiness.completed === readiness.total
                  ? "Ready to share"
                  : "Setup in progress"
              }
              title="Quote link readiness"
            >
              <div className="grid gap-1.5 sm:grid-cols-2">
                {readiness.items.map((item) => (
                  <div
                    className="rounded-md border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-1.5 text-xs"
                    key={item.label}
                  >
                    <span
                      className={
                        item.complete
                          ? "font-medium text-emerald-700 dark:text-emerald-300"
                          : "font-medium text-[var(--dash-text-muted)]"
                      }
                    >
                      {item.complete ? "Done" : "Open"}
                    </span>{" "}
                    <span className="text-[var(--dash-text-secondary)]">{item.label}</span>
                  </div>
                ))}
              </div>
            </ConfigurationPanel>
          </ConfigurationTabs>
            </div>

            <aside className="space-y-3 2xl:sticky 2xl:top-20">
              <section className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3.5 shadow-sm">
                <p className="text-[18px] font-extrabold tracking-[-0.03em] text-[var(--dash-text)]">
                  Workspace readiness
                </p>
                <p className="mt-1 text-xs text-[var(--dash-text-muted)]">
                  {readiness.completed}/{readiness.total} setup items complete
                </p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--dash-surface-muted)]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: "#17D492",
                      width: `${readinessPercent}%`,
                    }}
                  />
                </div>
                <div className="mt-3 grid gap-2">
                  {readiness.items.slice(0, 6).map((item) => (
                    <div
                      className="flex items-center justify-between gap-3 rounded-md bg-[var(--dash-surface-muted)] px-3 py-2 text-xs"
                      key={item.label}
                    >
                      <span className="truncate text-[var(--dash-text-secondary)]">
                        {item.label}
                      </span>
                      <span
                        className={
                          item.complete
                            ? "font-medium text-emerald-700 dark:text-emerald-300"
                            : "font-medium text-amber-700 dark:text-amber-300"
                        }
                      >
                        {item.complete ? "Done" : "Open"}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3.5 shadow-sm">
                <p className="text-[18px] font-extrabold tracking-[-0.03em] text-[var(--dash-text)]">
                  Branding preview
                </p>
                <div
                  className="mt-3 flex h-24 items-center justify-center overflow-hidden rounded-lg border bg-[var(--dash-surface-muted)]"
                  style={{ borderColor: "rgba(23,212,146,0.22)" }}
                >
                  {logoUrl ? (
                    <LogoPreviewImage
                      className="h-full max-h-24 w-full object-contain p-3"
                      logoUrl={logoUrl}
                    />
                  ) : (
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-xs font-semibold text-white"
                      style={{ backgroundColor: primaryColor }}
                    >
                      BP
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-[var(--dash-text-muted)]">
                  <span
                    className="h-5 w-5 rounded-full border border-[var(--dash-border)]"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <span
                    className="h-5 w-5 rounded-full border border-[var(--dash-border)]"
                    style={{ backgroundColor: accentColor }}
                  />
                  Public quote colors
                </div>
              </section>

              <section className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3.5 shadow-sm">
                <p className="text-[18px] font-extrabold tracking-[-0.03em] text-[var(--dash-text)]">
                  Public quote link
                </p>
                <p className="mt-1 text-xs leading-5 text-[var(--dash-text-muted)]">
                  Save changes, then preview the customer-facing quote flow.
                </p>
                <p className="mt-3 break-all rounded-md bg-[var(--dash-surface-muted)] px-3 py-2 text-sm font-semibold text-[var(--dash-text)]">
                  /quote/{activeBusiness.slug}
                </p>
                <a
                  className={`${buttonClass} mt-3 w-full`}
                  href={`/quote/${activeBusiness.slug}`}
                >
                  Preview public page
                </a>
              </section>
            </aside>
          </section>

        </form>
      </main>
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[var(--dash-border)] bg-[var(--dash-bg)]/95 px-4 py-2 shadow-[0_-18px_40px_rgba(0,0,0,0.18)] backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-1.5 sm:h-10 sm:flex-row sm:items-center sm:justify-between lg:pl-[272px]">
          <p className="text-xs text-[var(--dash-text-secondary)]">
            Save configuration after editing, then preview the public quote
            link.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <a
              className="biz-button-secondary inline-flex h-8 items-center justify-center rounded-[11px] border px-3 text-xs font-bold"
              href={`/quote/${activeBusiness.slug}`}
            >
              Open public quote link
            </a>
            <button
              className="biz-button-primary h-8 rounded-[11px] px-4 text-xs font-bold"
              form="business-configuration-form"
              style={{ backgroundColor: "#17D492", color: "#03130c" }}
              type="submit"
            >
              Save configuration
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
