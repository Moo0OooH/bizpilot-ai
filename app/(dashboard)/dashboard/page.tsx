/**
 * ============================================================
 * File: app/(dashboard)/dashboard/page.tsx
 * Project: BizPilot AI
 * Description: Renders the protected Phase 3 business configuration workspace.
 * Role: Lets owners configure business settings and the editable Cleaning template.
 * Related:
 * - server/services/auth.service.ts
 * - server/services/business.service.ts
 * - server/actions/auth.actions.ts
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-04
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
 * ============================================================
 */

import { redirect } from "next/navigation";

import { saveBusinessConfigurationAction } from "@/server/actions/business-configuration.actions";
import { signOutAction } from "@/server/actions/auth.actions";
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
            Phase 3 configuration
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
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-12">
      <div className="flex flex-col gap-6 border-b border-zinc-200 pb-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-normal text-zinc-500">
            BizPilot AI
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-zinc-950">
            Business configuration
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
            Phase 3 configures the business profile, operating basics, privacy,
            consent, and editable Cleaning template. Public intake and leads
            start later.
          </p>
        </div>
        <form action={signOutAction}>
          <button
            className="border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800"
            type="submit"
          >
            Sign out
          </button>
        </form>
      </div>

      {params?.notice ? (
        <p className="mt-6 border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          {params.notice}
        </p>
      ) : null}

      {params?.error ? (
        <p className="mt-6 border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {params.error}
        </p>
      ) : null}

      <section className="grid gap-4 py-8 sm:grid-cols-3">
        <div className="border border-zinc-200 p-4">
          <p className="text-sm text-zinc-500">Signed in as</p>
          <p className="mt-2 break-words text-sm font-medium text-zinc-950">
            {user.email ?? user.id}
          </p>
        </div>
        <div className="border border-zinc-200 p-4">
          <p className="text-sm text-zinc-500">Active business</p>
          <p className="mt-2 break-words text-sm font-medium text-zinc-950">
            {activeBusiness.name}
          </p>
        </div>
        <div className="border border-zinc-200 p-4">
          <p className="text-sm text-zinc-500">Readiness</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-950">
            {readiness.completed}/{readiness.total}
          </p>
        </div>
      </section>

      <section className="border-t border-zinc-200 py-8">
        <h2 className="text-base font-semibold text-zinc-950">
          Readiness checklist
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {readiness.items.map((item) => (
            <div className="border border-zinc-200 p-3 text-sm" key={item.label}>
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
      </section>

      <form
        action={saveBusinessConfigurationAction}
        className="space-y-10 border-t border-zinc-200 py-8"
      >
        <input name="businessId" type="hidden" value={activeBusiness.id} />
        <input
          name="templateId"
          type="hidden"
          value={cleaningTemplate.template.id}
        />

        <section>
          <h2 className="text-base font-semibold text-zinc-950">
            Business profile
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-zinc-800">
              Business name
              <input
                className="mt-2 w-full border border-zinc-300 px-3 py-2 text-base text-zinc-950 outline-none focus:border-zinc-950"
                defaultValue={activeBusiness.name}
                name="businessName"
                required
                type="text"
              />
            </label>
            <label className="block text-sm font-medium text-zinc-800">
              Public slug
              <input
                className="mt-2 w-full border border-zinc-300 px-3 py-2 text-base text-zinc-950 outline-none focus:border-zinc-950"
                defaultValue={activeBusiness.slug}
                name="businessSlug"
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                required
                type="text"
              />
            </label>
            <label className="block text-sm font-medium text-zinc-800">
              Logo URL
              <input
                className="mt-2 w-full border border-zinc-300 px-3 py-2 text-base text-zinc-950 outline-none focus:border-zinc-950"
                defaultValue={configuration.branding?.logo_url ?? ""}
                name="logoUrl"
                type="url"
              />
            </label>
            <label className="block text-sm font-medium text-zinc-800">
              Template name
              <input
                className="mt-2 w-full border border-zinc-300 px-3 py-2 text-base text-zinc-950 outline-none focus:border-zinc-950"
                defaultValue={
                  configuration.templateSettings?.custom_name ??
                  cleaningTemplate.template.name
                }
                name="customTemplateName"
                type="text"
              />
            </label>
            <label className="block text-sm font-medium text-zinc-800">
              Primary color
              <input
                className="mt-2 h-11 w-full border border-zinc-300 px-3 py-2"
                defaultValue={
                  configuration.branding?.primary_color ?? "#18181b"
                }
                name="primaryColor"
                type="color"
              />
            </label>
            <label className="block text-sm font-medium text-zinc-800">
              Accent color
              <input
                className="mt-2 h-11 w-full border border-zinc-300 px-3 py-2"
                defaultValue={configuration.branding?.accent_color ?? "#0f766e"}
                name="accentColor"
                type="color"
              />
            </label>
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-950">
            Operating basics
          </h2>
          <div className="mt-4 grid gap-4">
            <label className="block text-sm font-medium text-zinc-800">
              Services
              <textarea
                className="mt-2 min-h-32 w-full border border-zinc-300 px-3 py-2 text-base text-zinc-950 outline-none focus:border-zinc-950"
                defaultValue={servicesToText(configuration.services)}
                name="services"
              />
            </label>
            <label className="block text-sm font-medium text-zinc-800">
              Service areas
              <textarea
                className="mt-2 min-h-24 w-full border border-zinc-300 px-3 py-2 text-base text-zinc-950 outline-none focus:border-zinc-950"
                defaultValue={serviceAreasToText(configuration.serviceAreas)}
                name="serviceAreas"
              />
            </label>
            <label className="block text-sm font-medium text-zinc-800">
              FAQ
              <textarea
                className="mt-2 min-h-32 w-full border border-zinc-300 px-3 py-2 text-base text-zinc-950 outline-none focus:border-zinc-950"
                defaultValue={faqsToText(configuration.faqs)}
                name="faqs"
                placeholder="Do you bring supplies? | Yes, we bring all standard supplies."
              />
              <span className="mt-2 block text-xs leading-5 text-zinc-500">
                One FAQ per line. Use: Question? | Answer
              </span>
            </label>
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-950">
            Privacy and consent
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-zinc-800">
              Privacy mode
              <select
                className="mt-2 w-full border border-zinc-300 px-3 py-2 text-base text-zinc-950 outline-none focus:border-zinc-950"
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
            <label className="block text-sm font-medium text-zinc-800">
              Lead retention days
              <input
                className="mt-2 w-full border border-zinc-300 px-3 py-2 text-base text-zinc-950 outline-none focus:border-zinc-950"
                defaultValue={
                  configuration.privacySettings?.retain_leads_days ?? 365
                }
                min={1}
                name="retainLeadsDays"
                type="number"
              />
            </label>
            <label className="block text-sm font-medium text-zinc-800 sm:col-span-2">
              Privacy contact email
              <input
                className="mt-2 w-full border border-zinc-300 px-3 py-2 text-base text-zinc-950 outline-none focus:border-zinc-950"
                defaultValue={
                  configuration.consentSettings?.privacy_contact_email ?? ""
                }
                name="privacyContactEmail"
                type="email"
              />
            </label>
            <label className="block text-sm font-medium text-zinc-800 sm:col-span-2">
              Consent notice
              <textarea
                className="mt-2 min-h-28 w-full border border-zinc-300 px-3 py-2 text-base text-zinc-950 outline-none focus:border-zinc-950"
                defaultValue={
                  configuration.consentSettings?.consent_notice ??
                  "By submitting this request, you agree that your information will be shared with this business to respond to your quote request. BizPilot may help prepare internal AI drafts, but the business reviews messages before sending."
                }
                name="consentNotice"
              />
            </label>
            <label className="flex items-center gap-3 text-sm font-medium text-zinc-800">
              <input
                defaultChecked={
                  configuration.consentSettings?.ai_disclosure_enabled ?? true
                }
                name="aiDisclosureEnabled"
                type="checkbox"
              />
              Show AI draft disclosure
            </label>
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-950">
            Cleaning template
          </h2>
          <div className="mt-4 divide-y divide-zinc-200 border border-zinc-200">
            {cleaningTemplate.fields.map((field) => (
              <div
                className="grid gap-4 p-4 text-sm sm:grid-cols-[1fr_1fr_7rem_auto_auto]"
                key={field.id}
              >
                <input
                  name="templateFieldKeys"
                  type="hidden"
                  value={field.field_key}
                />
                <label className="block font-medium text-zinc-800">
                  {field.field_key}
                  <input
                    className="mt-2 w-full border border-zinc-300 px-3 py-2 text-base text-zinc-950 outline-none focus:border-zinc-950"
                    defaultValue={field.label}
                    name={`fieldLabel:${field.field_key}`}
                    required
                    type="text"
                  />
                </label>
                <label className="block font-medium text-zinc-800">
                  Help text
                  <input
                    className="mt-2 w-full border border-zinc-300 px-3 py-2 text-base text-zinc-950 outline-none focus:border-zinc-950"
                    defaultValue={field.help_text ?? ""}
                    name={`fieldHelp:${field.field_key}`}
                    type="text"
                  />
                </label>
                <label className="block font-medium text-zinc-800">
                  Order
                  <input
                    className="mt-2 w-full border border-zinc-300 px-3 py-2 text-base text-zinc-950 outline-none focus:border-zinc-950"
                    defaultValue={field.sort_order}
                    name={`fieldSort:${field.field_key}`}
                    type="number"
                  />
                </label>
                <label className="flex items-center gap-2 text-zinc-700">
                  <input
                    defaultChecked={field.is_required}
                    name={`fieldRequired:${field.field_key}`}
                    type="checkbox"
                  />
                  Required
                </label>
                <label className="flex items-center gap-2 text-zinc-700">
                  <input
                    defaultChecked={field.is_hidden}
                    name={`fieldHidden:${field.field_key}`}
                    type="checkbox"
                  />
                  Hide
                </label>
              </div>
            ))}
          </div>
        </section>

        <button
          className="bg-zinc-950 px-5 py-3 text-sm font-medium text-white"
          type="submit"
        >
          Save configuration
        </button>
      </form>

      {configuration.onboardingTasks.length > 0 ? (
        <section className="border-t border-zinc-200 py-8">
          <h2 className="text-base font-semibold text-zinc-950">
            Setup task log
          </h2>
          <div className="mt-4 divide-y divide-zinc-200 border border-zinc-200">
            {configuration.onboardingTasks.map((task) => (
              <div
                className="flex flex-col gap-1 p-4 text-sm sm:flex-row sm:items-center sm:justify-between"
                key={task.id}
              >
                <span className="font-medium text-zinc-950">
                  {task.label}
                </span>
                <span className="text-zinc-500">
                  {task.completed_at ? "Completed" : "Open"}
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
