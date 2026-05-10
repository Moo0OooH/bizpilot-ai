/**
 * ============================================================
 * File: app/(dashboard)/dashboard/page.tsx
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
 * ============================================================
 */

import Link from "next/link";
import { redirect } from "next/navigation";

import { signOutAction } from "@/server/actions/auth.actions";
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

function SectionCard({
  children,
  description,
  id,
  title,
}: Readonly<{
  children: React.ReactNode;
  description?: string;
  id?: string;
  title: string;
}>) {
  return (
    <section
      className="scroll-mt-4 rounded-md border border-zinc-200 bg-white p-2.5 shadow-sm"
      id={id}
    >
      <div className="border-b border-zinc-100 pb-2">
        <h2 className="text-sm font-semibold text-zinc-950">{title}</h2>
        {description ? (
          <p className="mt-1 text-xs leading-5 text-zinc-600">
            {description}
          </p>
        ) : null}
      </div>
      <div className="pt-2.5">{children}</div>
    </section>
  );
}

const inputClass =
  "mt-1 h-8 w-full rounded-md border border-zinc-300 bg-white px-2.5 text-xs text-zinc-950 outline-none focus:border-zinc-950";
const labelClass = "block text-xs font-medium text-zinc-800";
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
          <h1 className="mt-3 text-3xl font-semibold text-zinc-950">
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

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col px-3 py-3 pb-16">
        <div className="flex flex-col gap-3 border-b border-zinc-200 pb-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-normal text-zinc-500">
              BizPilot AI
            </p>
            <h1 className="mt-1 text-xl font-semibold text-zinc-950">
              Business configuration
            </h1>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-zinc-600">
              Configure the cleaning quote experience, public link, consent,
              and owner-ready lead foundation for {activeBusiness.name}.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              className="rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-800"
              href="/dashboard/leads"
            >
              Lead Conversion Desk
            </Link>
            <form action={signOutAction}>
              <button
                className="rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-800"
                type="submit"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>

        {params?.notice ? (
          <p className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 p-2 text-xs text-emerald-800">
            {params.notice}
          </p>
        ) : null}

        {params?.error ? (
          <p className="mt-3 rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700">
            {params.error}
          </p>
        ) : null}

        <section className="grid gap-2.5 py-3 sm:grid-cols-3">
          <div className="rounded-md border border-zinc-200 bg-white p-2.5 shadow-sm">
            <p className="text-xs text-zinc-500">Signed in as</p>
            <p className="mt-0.5 break-words text-xs font-medium text-zinc-950">
              {user.email ?? user.id}
            </p>
          </div>
          <div className="rounded-md border border-zinc-200 bg-white p-2.5 shadow-sm">
            <p className="text-xs text-zinc-500">Active business</p>
            <p className="mt-0.5 break-words text-xs font-medium text-zinc-950">
              {activeBusiness.name}
            </p>
          </div>
          <div className="rounded-md border border-zinc-200 bg-white p-2.5 shadow-sm">
            <p className="text-xs text-zinc-500">Readiness</p>
            <p className="mt-0.5 text-xs font-medium text-zinc-950">
              {readiness.completed}/{readiness.total} setup tasks complete
            </p>
          </div>
        </section>

        <div className="grid gap-2 lg:grid-cols-[8.75rem_minmax(0,1fr)_15.5rem]">
          <aside className="hidden lg:block">
            <nav className="sticky top-3 rounded-md border border-zinc-200 bg-white p-1.5 text-xs shadow-sm">
              <a
                className="block rounded px-2 py-1 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
                href="#business-profile"
              >
                Business profile
              </a>
              <a
                className="block rounded px-2 py-1 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
                href="#branding"
              >
                Branding
              </a>
              <a
                className="block rounded px-2 py-1 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
                href="#services-areas"
              >
                Services & areas
              </a>
              <a
                className="block rounded px-2 py-1 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
                href="#cleaning-template-fields"
              >
                Cleaning template
              </a>
              <a
                className="block rounded px-2 py-1 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
                href="#faq"
              >
                FAQ
              </a>
              <a
                className="block rounded px-2 py-1 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
                href="#privacy-consent"
              >
                Privacy & consent
              </a>
              <a
                className="block rounded px-2 py-1 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
                href="#setup-checklist"
              >
                Setup checklist
              </a>
            </nav>
          </aside>

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

            <SectionCard
              description="Core identity used across the protected workspace and public quote link."
              id="business-profile"
              title="Business profile"
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
            </SectionCard>

            <SectionCard
              description="Public-facing visual settings for the cleaning quote experience."
              id="branding"
              title="Branding"
            >
              <div className="grid gap-2.5 sm:grid-cols-3">
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
                  Primary color
                  <input
                    className="mt-1 h-8 w-full rounded-md border border-zinc-300 px-2 py-1"
                    defaultValue={
                      configuration.branding?.primary_color ?? "#18181b"
                    }
                    name="primaryColor"
                    type="color"
                  />
                </label>
                <label className={labelClass}>
                  Accent color
                  <input
                    className="mt-1 h-8 w-full rounded-md border border-zinc-300 px-2 py-1"
                    defaultValue={
                      configuration.branding?.accent_color ?? "#0f766e"
                    }
                    name="accentColor"
                    type="color"
                  />
                </label>
              </div>
            </SectionCard>

            <SectionCard
              description="Enter one city, neighborhood, or service region per line. Leads outside these areas may be marked as low fit."
              id="services-areas"
              title="Services & covered areas"
            >
              <div className="grid gap-2.5 xl:grid-cols-2">
                <label className={labelClass}>
                  Services
                  <textarea
                    className={`${inputClass} h-20 min-h-20 py-2`}
                    defaultValue={servicesToText(configuration.services)}
                    name="services"
                  />
                </label>
                <label className={labelClass}>
                  Service areas
                  <textarea
                    className={`${inputClass} h-20 min-h-20 py-2`}
                    defaultValue={serviceAreasToText(
                      configuration.serviceAreas,
                    )}
                    name="serviceAreas"
                  />
                  <span className="mt-1 block text-xs leading-4 text-zinc-500">
                    Example: Montréal, Laval, Longueuil, South Shore
                  </span>
                </label>
              </div>
            </SectionCard>

            <SectionCard
              description="Choose which customer questions appear on the public quote form and how they read."
              id="cleaning-template-fields"
              title="Cleaning template"
            >
              <div className="overflow-hidden rounded-md border border-zinc-200">
                <div className="hidden grid-cols-[minmax(0,1fr)_5rem_7rem_4rem_6rem] items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium uppercase tracking-normal text-zinc-500 lg:grid">
                  <span>Customer question</span>
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
                    <summary className="grid cursor-pointer list-none gap-2 px-3 py-2 text-xs hover:bg-zinc-50 lg:grid-cols-[minmax(0,1fr)_5rem_7rem_4rem_6rem] lg:items-center [&::-webkit-details-marker]:hidden">
                      <span className="min-w-0 truncate font-medium text-zinc-950">
                        {field.label}
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
            </SectionCard>

            <SectionCard
              description="Reusable customer questions and answers for the cleaning business profile."
              id="faq"
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
            </SectionCard>

            <SectionCard
              description="Consent and retention settings used by public quote submissions."
              id="privacy-consent"
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
            </SectionCard>

          </form>

          <aside className="space-y-3 lg:sticky lg:top-3 lg:self-start">
            <SectionCard title="Workspace status">
              <p className="text-xs font-medium text-zinc-950">
                {readiness.completed}/{readiness.total} ready
              </p>
              <p className="mt-1 text-xs leading-4 text-zinc-600">
                Review the setup checklist before sharing the public quote
                link.
              </p>
              <button
                className="mt-2 w-full rounded-md bg-zinc-950 px-3 py-1.5 text-xs font-medium text-white"
                form="business-configuration-form"
                type="submit"
              >
                Save configuration
              </button>
            </SectionCard>

            <SectionCard title="Public quote link">
              <p className="text-xs leading-4 text-zinc-600">
                Save configuration after edits to refresh form fields, consent,
                and branding shown to customers.
              </p>
              <a
                className="mt-2 inline-flex rounded-md border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-800"
                href={`/quote/${activeBusiness.slug}`}
              >
                Open /quote/{activeBusiness.slug}
              </a>
            </SectionCard>

            <SectionCard title="Quick navigation">
              <nav className="grid gap-1 text-xs">
                <a className="text-zinc-700 hover:text-zinc-950" href="#business-profile">
                  Business profile
                </a>
                <a className="text-zinc-700 hover:text-zinc-950" href="#branding">
                  Branding
                </a>
                <a className="text-zinc-700 hover:text-zinc-950" href="#services-areas">
                  Services & covered areas
                </a>
                <a
                  className="text-zinc-700 hover:text-zinc-950"
                  href="#cleaning-template-fields"
                >
                  Cleaning template
                </a>
                <a className="text-zinc-700 hover:text-zinc-950" href="#faq">
                  FAQ
                </a>
                <a className="text-zinc-700 hover:text-zinc-950" href="#privacy-consent">
                  Privacy & consent
                </a>
                {configuration.onboardingTasks.length > 0 ? (
                  <a className="text-zinc-700 hover:text-zinc-950" href="#setup-checklist">
                    Setup task log
                  </a>
                ) : null}
              </nav>
            </SectionCard>

            <SectionCard id="setup-checklist" title="Setup checklist">
              <details>
                <summary className="flex cursor-pointer items-center justify-between text-xs font-medium text-zinc-800">
                  <span>{readiness.completed}/{readiness.total} completed</span>
                  <span className="text-zinc-500">View</span>
                </summary>
                <div className="mt-2 space-y-1.5">
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
                {configuration.onboardingTasks.length > 0 ? (
                  <div className="mt-2 divide-y divide-zinc-200 rounded-md border border-zinc-200">
                    {configuration.onboardingTasks.map((task) => (
                      <div
                        className="flex items-center justify-between gap-2 p-1.5 text-xs"
                        key={task.id}
                      >
                        <span className="font-medium text-zinc-900">
                          {task.label}
                        </span>
                        <span className="shrink-0 text-zinc-500">
                          {task.completed_at ? "Completed" : "Open"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </details>
            </SectionCard>
          </aside>
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-zinc-200 bg-white/95 px-4 py-1.5 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-1.5 sm:h-10 sm:flex-row sm:items-center sm:justify-between">
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
              className="h-7 rounded-md bg-zinc-950 px-4 text-xs font-medium text-white"
              form="business-configuration-form"
              type="submit"
            >
              Save configuration
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
