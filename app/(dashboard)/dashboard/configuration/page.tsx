/**
 * ============================================================
 * File: app/(dashboard)/dashboard/configuration/page.tsx
 * Project: BizPilot AI
 * Description: Renders the protected business and public quote configuration workspace.
 * Role: Lets owners configure business settings, the editable Cleaning template, and public quote link.
 * Related:
 * - server/services/auth.service.ts
 * - server/services/business.service.ts
 * - server/actions/auth.actions.ts
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-09
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
      className="scroll-mt-4 rounded-lg border border-zinc-200 bg-white p-3.5 shadow-sm"
      id={id}
    >
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_18rem] sm:items-start">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-zinc-950">{title}</h2>
          {description ? (
            <p className="mt-1 text-xs leading-5 text-zinc-600">
              {description}
            </p>
          ) : null}
        </div>
        {summary ? (
          <p className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs leading-4 text-zinc-600">
            {summary}
          </p>
        ) : null}
      </div>
      <div className="mt-3.5 border-t border-zinc-100 pt-3.5">{children}</div>
    </section>
  );
}

const fieldInputClass =
  "h-8 w-full rounded-md border border-zinc-300 bg-white px-2.5 text-xs text-zinc-950 outline-none focus:border-zinc-950";

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
        <div className="border-b border-zinc-200 pb-8">
          <p className="text-sm font-medium uppercase tracking-normal text-zinc-500">
            BizPilot AI
          </p>
          <h1 className="mt-3 text-[26px] font-semibold text-zinc-950">
            Business configuration
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
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
          title="Business Configuration"
        />

        {params?.notice ? (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
            {params.notice}
          </p>
        ) : null}

        {params?.error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
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

          <section className="grid items-start gap-3.5 2xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0">
          <ConfigurationTabs
            sections={[
              { id: "configuration-overview", label: "Overview" },
              { id: "business-profile", label: "Profile" },
              { id: "branding", label: "Branding" },
              { id: "services-areas", label: "Services" },
              { id: "public-page", label: "Public Page" },
              { id: "cleaning-template-fields", label: "Quote Form" },
              { id: "faq", label: "FAQ" },
              { id: "privacy-consent", label: "Privacy" },
              { id: "setup-checklist", label: "Readiness" },
            ]}
          >
            <ConfigurationPanel
              description="A clean operating summary of the business identity, public quote link, setup health, and configured quote foundation."
              id="configuration-overview"
              summary={`${readiness.completed}/${readiness.total} setup items complete`}
              title="Business setup overview"
            >
              <div className="grid gap-3.5 xl:grid-cols-[minmax(0,1fr)_20rem]">
                <div className="grid gap-3.5 lg:grid-cols-[17rem_minmax(0,1fr)]">
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3.5">
                    <div
                      className="flex h-28 items-center justify-center overflow-hidden rounded-lg border bg-white"
                      style={{ borderColor: accentColor }}
                    >
                      {logoUrl ? (
                        <object
                          aria-label="Logo preview"
                          className="h-full max-h-28 w-full object-contain p-4"
                          data={logoUrl}
                        >
                          <span className="text-xs text-zinc-500">
                            Logo preview unavailable
                          </span>
                        </object>
                      ) : (
                        <span
                          className="flex h-12 w-12 items-center justify-center rounded-lg text-sm font-semibold text-white"
                          style={{ backgroundColor: primaryColor }}
                        >
                          BP
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-sm font-semibold text-zinc-950">
                      {activeBusiness.name}
                    </p>
                    <p className="mt-1 break-all text-xs text-zinc-500">
                      /quote/{activeBusiness.slug}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <span
                        className="h-5 w-5 rounded-full border border-zinc-200"
                        style={{ backgroundColor: primaryColor }}
                      />
                      <span
                        className="h-5 w-5 rounded-full border border-zinc-200"
                        style={{ backgroundColor: accentColor }}
                      />
                    </div>
                  </div>

                  <div className="rounded-lg border border-zinc-200 bg-white p-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                          Workspace readiness
                        </p>
                        <p className="mt-1 text-[22px] font-semibold text-zinc-950">
                          {readinessPercent}%
                        </p>
                      </div>
                      <p className="text-right text-xs font-medium text-zinc-500">
                        {readiness.completed}/{readiness.total} complete
                      </p>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-100">
                      <div
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: accentColor,
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
                          className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2"
                          key={title}
                        >
                          <p className="text-xs font-medium text-zinc-500">
                            {title}
                          </p>
                          <p className="mt-1 truncate text-xs font-semibold text-zinc-950">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3.5">
                  <p className="text-sm font-semibold text-zinc-950">
                    Setup report
                  </p>
                  <div className="mt-3 grid gap-2">
                    {readiness.items.map((item) => (
                      <div
                        className="flex items-center justify-between gap-3 rounded-md bg-white px-3 py-2 text-xs"
                        key={item.label}
                      >
                        <span className="truncate text-zinc-700">
                          {item.label}
                        </span>
                        <span
                          className={
                            item.complete
                              ? "font-medium text-emerald-700"
                              : "font-medium text-amber-700"
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
              title="Business basics"
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
              </div>
            </ConfigurationPanel>

            <ConfigurationPanel
              description="Public-facing visual settings for the cleaning quote experience."
              id="branding"
              summary={logoUrl ? "Logo and colors configured" : "Add logo and colors"}
              title="Branding"
            >
              <div className="grid gap-2.5 md:grid-cols-[minmax(0,1fr)_12rem]">
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
                      className="mt-1 h-8 w-full rounded-md border border-zinc-300 px-2 py-1"
                      defaultValue={primaryColor}
                      name="primaryColor"
                      type="color"
                    />
                  </label>
                  <label className={labelClass}>
                    Accent color
                    <input
                      className="mt-1 h-8 w-full rounded-md border border-zinc-300 px-2 py-1"
                      defaultValue={accentColor}
                      name="accentColor"
                      type="color"
                    />
                  </label>
                  <div className="rounded-md border border-zinc-200 bg-zinc-50 p-2">
                    <p className="text-xs font-medium text-zinc-700">
                      Public form preview
                    </p>
                    <div
                      className="mt-1.5 rounded-md px-3 py-1.5 text-center text-xs font-medium text-white"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Request a quote
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-zinc-600">
                      <span
                        className="h-3 w-3 rounded-full border border-zinc-200"
                        style={{ backgroundColor: accentColor }}
                      />
                      Accent color
                    </div>
                  </div>
                </div>
                <div
                  className="flex min-h-24 items-center justify-center overflow-hidden rounded-md border bg-zinc-50"
                  style={{ borderColor: accentColor }}
                >
                  {logoUrl ? (
                    <object
                      aria-label="Logo preview"
                      className="h-full max-h-24 w-full object-contain p-3"
                      data={logoUrl}
                    >
                      <div className="px-3 text-center text-xs text-zinc-500">
                        Logo preview unavailable
                      </div>
                    </object>
                  ) : (
                    <div className="px-3 text-center text-xs text-zinc-500">
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
                <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
                  <p className="text-xs font-medium text-zinc-700">
                    Public quote link
                  </p>
                  <p className="mt-1 break-all text-sm font-semibold text-zinc-950">
                    /quote/{activeBusiness.slug}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    Save changes before previewing branding, consent, services,
                    and quote questions.
                  </p>
                </div>
                <a
                  className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-800"
                  href={`/quote/${activeBusiness.slug}`}
                >
                  Preview public page
                </a>
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
                  <span className="mt-1 block text-xs leading-4 text-zinc-500">
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
                  <span className="mt-1 block text-xs leading-4 text-zinc-500">
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
              <div className="overflow-hidden rounded-md border border-zinc-200">
                <div className="hidden grid-cols-[minmax(0,1fr)_6rem_5rem_7rem_4rem_6rem] items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium uppercase tracking-normal text-zinc-500 lg:grid">
                  <span>Customer question</span>
                  <span>Type</span>
                  <span>Required</span>
                  <span>Visible on form</span>
                  <span>Position</span>
                  <span className="text-right">Customize</span>
                </div>
                {cleaningTemplate.fields.map((field) => (
                  <details
                    className="group border-b border-zinc-200 bg-white last:border-b-0"
                    key={field.id}
                    name="public-quote-question"
                  >
                    <input
                      name="templateFieldKeys"
                      type="hidden"
                      value={field.field_key}
                    />
                    <summary className="grid cursor-pointer list-none gap-2 px-3 py-2 text-xs hover:bg-zinc-50 lg:grid-cols-[minmax(0,1fr)_6rem_5rem_7rem_4rem_6rem] lg:items-center [&::-webkit-details-marker]:hidden">
                      <span className="min-w-0 truncate font-medium text-zinc-950">
                        {field.label}
                      </span>
                      <span className="capitalize text-zinc-500">
                        {field.field_type.replaceAll("_", " ")}
                      </span>
                      <span
                        className={
                          field.is_required
                            ? "text-emerald-700"
                            : "text-zinc-500"
                        }
                      >
                        {field.is_required ? "Required" : "Optional"}
                      </span>
                      <span
                        className={
                          field.is_hidden ? "text-zinc-500" : "text-emerald-700"
                        }
                      >
                        {field.is_hidden ? "Not visible" : "Visible"}
                      </span>
                      <span className="text-zinc-700">{field.sort_order}</span>
                      <span className="text-left text-zinc-950 lg:text-right">
                        <span className="inline-flex h-7 items-center rounded-md border border-zinc-300 bg-white px-2.5 text-xs font-medium group-open:hidden">
                          Customize
                        </span>
                        <span className="hidden h-7 items-center rounded-md border border-zinc-300 bg-white px-2.5 text-xs font-medium group-open:inline-flex">
                          Close
                        </span>
                      </span>
                    </summary>
                    <div className="border-t border-zinc-100 bg-zinc-50 px-3 py-2.5">
                      <div className="grid gap-2.5 lg:grid-cols-[1fr_1fr_5rem_6rem_8rem] lg:items-end">
                        <label className="grid gap-1 text-xs font-medium text-zinc-800">
                          Customer-facing question
                          <input
                            className={fieldInputClass}
                            defaultValue={field.label}
                            name={`fieldLabel:${field.field_key}`}
                            required
                            type="text"
                          />
                        </label>
                        <label className="grid gap-1 text-xs font-medium text-zinc-800">
                          Helper text
                          <input
                            className={fieldInputClass}
                            defaultValue={field.help_text ?? ""}
                            name={`fieldHelp:${field.field_key}`}
                            type="text"
                          />
                        </label>
                        <label className="grid gap-1 text-xs font-medium text-zinc-800">
                          Position
                          <input
                            className={fieldInputClass}
                            defaultValue={field.sort_order}
                            name={`fieldSort:${field.field_key}`}
                            type="number"
                          />
                        </label>
                        <label className="flex h-8 items-center gap-2 text-xs font-medium text-zinc-700">
                          <input
                            defaultChecked={field.is_required}
                            name={`fieldRequired:${field.field_key}`}
                            type="checkbox"
                          />
                          Required
                        </label>
                        <label className="flex h-8 items-center gap-2 text-xs font-medium text-zinc-700">
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
              title="FAQ"
            >
              <label className={labelClass}>
                FAQ
                <textarea
                  className={`${inputClass} h-24 min-h-24 py-2`}
                  defaultValue={faqsToText(configuration.faqs)}
                  name="faqs"
                  placeholder="Do you bring supplies? | Yes, we bring all standard supplies."
                />
                <span className="mt-1 block text-xs leading-4 text-zinc-500">
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
              title="Privacy and consent"
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
                      "By submitting this request, you agree that your information will be shared with this business to respond to your quote request. BizPilot may help prepare internal AI drafts, but the business reviews messages before sending."
                    }
                    name="consentNotice"
                  />
                </label>
                <label className="flex h-8 items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 text-xs font-medium text-zinc-800">
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
              title="Setup checklist"
            >
              <div className="grid gap-1.5 sm:grid-cols-2">
                {readiness.items.map((item) => (
                  <div
                    className="rounded-md border border-zinc-200 bg-zinc-50 p-1.5 text-xs"
                    key={item.label}
                  >
                    <span
                      className={
                        item.complete
                          ? "font-medium text-emerald-700"
                          : "font-medium text-zinc-500"
                      }
                    >
                      {item.complete ? "Done" : "Open"}
                    </span>{" "}
                    <span className="text-zinc-700">{item.label}</span>
                  </div>
                ))}
              </div>
            </ConfigurationPanel>
          </ConfigurationTabs>
            </div>

            <aside className="space-y-3 2xl:sticky 2xl:top-20">
              <section className="rounded-lg border border-zinc-200 bg-white p-3.5 shadow-sm">
                <p className="text-sm font-semibold text-zinc-950">
                  Workspace readiness
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {readiness.completed}/{readiness.total} setup items complete
                </p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: accentColor,
                      width: `${readinessPercent}%`,
                    }}
                  />
                </div>
                <div className="mt-3 grid gap-2">
                  {readiness.items.slice(0, 6).map((item) => (
                    <div
                      className="flex items-center justify-between gap-3 rounded-md bg-zinc-50 px-3 py-2 text-xs"
                      key={item.label}
                    >
                      <span className="truncate text-zinc-700">
                        {item.label}
                      </span>
                      <span
                        className={
                          item.complete
                            ? "font-medium text-emerald-700"
                            : "font-medium text-amber-700"
                        }
                      >
                        {item.complete ? "Done" : "Open"}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-zinc-200 bg-white p-3.5 shadow-sm">
                <p className="text-sm font-semibold text-zinc-950">
                  Branding preview
                </p>
                <div
                  className="mt-3 flex h-24 items-center justify-center overflow-hidden rounded-lg border bg-zinc-50"
                  style={{ borderColor: accentColor }}
                >
                  {logoUrl ? (
                    <object
                      aria-label="Logo preview"
                      className="h-full max-h-24 w-full object-contain p-3"
                      data={logoUrl}
                    >
                      <span className="text-xs text-zinc-500">
                        Logo preview unavailable
                      </span>
                    </object>
                  ) : (
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-xs font-semibold text-white"
                      style={{ backgroundColor: primaryColor }}
                    >
                      BP
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
                  <span
                    className="h-5 w-5 rounded-full border border-zinc-200"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <span
                    className="h-5 w-5 rounded-full border border-zinc-200"
                    style={{ backgroundColor: accentColor }}
                  />
                  Public quote colors
                </div>
              </section>

              <section className="rounded-lg border border-zinc-200 bg-white p-3.5 shadow-sm">
                <p className="text-sm font-semibold text-zinc-950">
                  Public quote link
                </p>
                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Save changes, then preview the customer-facing quote flow.
                </p>
                <p className="mt-3 break-all rounded-md bg-zinc-50 px-3 py-2 text-sm font-semibold text-zinc-950">
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
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-zinc-200 bg-white/95 px-4 py-1.5 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-1.5 sm:h-10 sm:flex-row sm:items-center sm:justify-between lg:pl-[240px]">
          <p className="text-xs text-zinc-600">
            Save configuration after editing, then preview the public quote
            link.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <a
              className="inline-flex h-7 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-800"
              href={`/quote/${activeBusiness.slug}`}
            >
              Open public quote link
            </a>
            <button
              className="h-7 rounded-md px-4 text-xs font-medium text-white"
              form="business-configuration-form"
              style={{ backgroundColor: primaryColor }}
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
