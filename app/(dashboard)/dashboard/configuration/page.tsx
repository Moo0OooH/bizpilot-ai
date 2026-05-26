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

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ConfigurationTabs } from "@/components/dashboard/configuration-tabs";
import { FlashMessage } from "@/components/dashboard/flash-message";
import {
  buttonClass,
  inputClass,
  labelClass,
  PageHeader,
  textareaClass,
} from "@/components/dashboard/dashboard-ui";
import { getBizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import {
  INTERFACE_LANGUAGE_COOKIE,
  languageLabels,
  resolveWorkspaceInterfaceLanguage,
  supportedLanguages,
} from "@/lib/i18n/language";
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

  const cookieStore = await cookies();
  const workspace = await getBusinessWorkspace({
    userId: user.id,
  });
  const activeBusiness = workspace.businesses[0];

  if (!activeBusiness) {
    const fallbackLanguage = resolveWorkspaceInterfaceLanguage({
      cookieLanguage: cookieStore.get(INTERFACE_LANGUAGE_COOKIE)?.value,
    });
    const fallbackCopy = getBizPilotCopy(fallbackLanguage).dashboard;

    return (
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-12">
        <div className="border-b border-[var(--dash-border)] pb-8">
          <p className="text-sm font-medium uppercase tracking-normal text-[var(--dash-text-muted)]">
            BizPilot AI
          </p>
          <h1 className="mt-3 text-[26px] font-semibold text-[var(--dash-text)]">
            {fallbackCopy.pages.configuration.title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--dash-text-secondary)]">
            {fallbackCopy.configuration.noBusinessDescription}
          </p>
        </div>
      </main>
    );
  }

  const activeLanguage = resolveWorkspaceInterfaceLanguage({
    businessLanguage: activeBusiness.preferred_language,
    cookieLanguage: cookieStore.get(INTERFACE_LANGUAGE_COOKIE)?.value,
  });
  const configurationWorkspace = await getBusinessConfigurationWorkspace({
    business: { ...activeBusiness, preferred_language: activeLanguage },
  });
  const { cleaningTemplate, configuration, readiness } =
    configurationWorkspace;
  const primaryColor = configuration.branding?.primary_color ?? "#18181b";
  const accentColor = configuration.branding?.accent_color ?? "#0f766e";
  const copy = getBizPilotCopy(activeLanguage);
  const dashboardCopy = copy.dashboard;
  const configurationTabs = dashboardCopy.configuration.tabs;
  const configCopy = dashboardCopy.configuration;
  const readinessLabel = (item: { label: string; taskKey: string }) =>
    dashboardCopy.readinessTasks[
      item.taskKey as keyof typeof dashboardCopy.readinessTasks
    ] ?? item.label;
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
          description={configCopy.headerDescription(activeBusiness.name)}
          eyebrow={dashboardCopy.settings.workspace}
          title={dashboardCopy.nav.quoteSetup}
        />

        {params?.notice ? (
          <FlashMessage tone="notice">
            {params.notice}
          </FlashMessage>
        ) : null}

        {params?.error ? (
          <FlashMessage durationMs={10000} tone="error">
            {params.error}
          </FlashMessage>
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
              { id: "configuration-overview", label: configurationTabs.overview },
              { id: "business-profile", label: configurationTabs.basics },
              { id: "cleaning-template-fields", label: configurationTabs.fields },
              { id: "services-areas", label: configurationTabs.services },
              { id: "branding", label: configurationTabs.branding },
              { id: "faq", label: configurationTabs.ai },
              { id: "public-page", label: configurationTabs.link },
              { id: "notifications", label: configurationTabs.notifications },
              { id: "privacy-consent", label: configurationTabs.privacy },
              { id: "setup-checklist", label: configurationTabs.readiness },
            ]}
          >
            <ConfigurationPanel
              description={configCopy.overview.description}
              id="configuration-overview"
              summary={configCopy.overview.summary(readiness.completed, readiness.total)}
              title={configCopy.overview.title}
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
                          {configCopy.overview.workspaceReadiness}
                        </p>
                        <p className="mt-1 text-[22px] font-semibold text-[var(--dash-text)]">
                          {readinessPercent}%
                        </p>
                      </div>
                      <p className="text-right text-xs font-medium text-[var(--dash-text-muted)]">
                        {configCopy.overview.complete(readiness.completed, readiness.total)}
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
                        [configCopy.overview.profile, activeBusiness.name],
                        [
                          configCopy.overview.branding,
                          logoUrl
                            ? configCopy.overview.logoConfigured
                            : configCopy.overview.colorsReady,
                        ],
                        [
                          configCopy.overview.services,
                          configCopy.overview.serviceRecords(configuration.services.length),
                        ],
                        [
                          configCopy.overview.serviceAreas,
                          configCopy.overview.coveredAreas(configuration.serviceAreas.length),
                        ],
                        [
                          configCopy.overview.quoteForm,
                          configCopy.overview.visibleQuestions(
                            visibleTemplateFieldCount,
                            cleaningTemplate.fields.length,
                          ),
                        ],
                        [configCopy.overview.faqs, String(configuration.faqs.length)],
                        [
                          configCopy.overview.privacy,
                          configuration.privacySettings?.privacy_mode ?? "standard",
                        ],
                        [configCopy.overview.publicLink, `/quote/${activeBusiness.slug}`],
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
                    {configCopy.overview.setupReport}
                  </p>
                  <div className="mt-3 grid gap-2">
                    {readiness.items.map((item) => (
                      <div
                        className="flex items-center justify-between gap-3 rounded-md bg-[var(--dash-surface)] px-3 py-2 text-xs"
                        key={item.label}
                      >
                        <span className="truncate text-[var(--dash-text-secondary)]">
                          {readinessLabel(item)}
                        </span>
                        <span
                          className={
                            item.complete
                              ? "font-medium text-emerald-700 dark:text-emerald-300"
                              : "font-medium text-amber-700 dark:text-amber-300"
                          }
                        >
                          {item.complete ? configCopy.overview.done : configCopy.overview.open}
                        </span>
                      </div>
                    ))}
                  </div>
                  <a
                    className={`${buttonClass} mt-4 w-full`}
                    href={`/quote/${activeBusiness.slug}`}
                  >
                    {configCopy.overview.previewPublicQuote}
                  </a>
                </div>
              </div>
            </ConfigurationPanel>

            <ConfigurationPanel
              description={configCopy.basics.description}
              id="business-profile"
              summary={`${activeBusiness.name} - /quote/${activeBusiness.slug}`}
              title={configCopy.basics.title}
            >
              <div className="grid gap-2.5 sm:grid-cols-3">
                <label className={labelClass}>
                  {configCopy.basics.businessName}
                  <input
                    className={inputClass}
                    defaultValue={activeBusiness.name}
                    name="businessName"
                    required
                    type="text"
                  />
                </label>
                <label className={labelClass}>
                  {configCopy.basics.publicSlug}
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
                  {configCopy.basics.templateName}
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
                  {configCopy.basics.preferredLanguage}
                  <select
                    className={inputClass}
                    defaultValue={activeLanguage}
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
                    {configCopy.basics.languageHelp}
                  </span>
                </label>
              </div>
            </ConfigurationPanel>

            <ConfigurationPanel
              description={configCopy.branding.description}
              id="branding"
              summary={
                logoUrl
                  ? configCopy.branding.logoAndColorsConfigured
                  : configCopy.branding.addLogoAndColors
              }
              title={configCopy.branding.title}
            >
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_16rem]">
                <div className="grid gap-2.5 sm:grid-cols-3">
                  <label className={`${labelClass} sm:col-span-3`}>
                    {configCopy.branding.logoUrl}
                    <input
                      className={inputClass}
                      defaultValue={logoUrl}
                      name="logoUrl"
                      type="url"
                    />
                  </label>
                  <label className={labelClass}>
                    {configCopy.branding.primaryColor}
                    <input
                      className="mt-1 h-8 w-full rounded-md border border-[var(--dash-border-strong)] px-2 py-1"
                      defaultValue={primaryColor}
                      name="primaryColor"
                      type="color"
                    />
                  </label>
                  <label className={labelClass}>
                    {configCopy.branding.accentColor}
                    <input
                      className="mt-1 h-8 w-full rounded-md border border-[var(--dash-border-strong)] px-2 py-1"
                      defaultValue={accentColor}
                      name="accentColor"
                      type="color"
                    />
                  </label>
                  <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3 sm:col-span-3">
                    <p className="text-xs font-medium text-[var(--dash-text-secondary)]">
                      {configCopy.branding.whereColorsApply}
                    </p>
                    <div className="mt-2 overflow-hidden rounded-[12px] border border-[var(--dash-border)] bg-[#071018] p-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold text-[#F5F7FA]">
                          {configCopy.branding.publicQuoteButton}
                        </span>
                        <span
                          className="rounded-[10px] px-3 py-1.5 text-xs font-semibold text-white"
                          style={{ backgroundColor: primaryColor }}
                        >
                          {configCopy.branding.submitQuoteRequest}
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
                      {configCopy.branding.accentAppears}
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
                      {configCopy.branding.logoPreview}
                    </div>
                  )}
                </div>
              </div>
            </ConfigurationPanel>

            <ConfigurationPanel
              description={configCopy.publicPage.description}
              id="public-page"
              summary={`/quote/${activeBusiness.slug}`}
              title={configCopy.publicPage.title}
            >
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                <div className="rounded-md border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3">
                  <p className="text-xs font-medium text-[var(--dash-text-secondary)]">
                    {configCopy.publicPage.publicQuoteLink}
                  </p>
                  <p className="mt-1 break-all text-sm font-semibold text-[var(--dash-text)]">
                    /quote/{activeBusiness.slug}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[var(--dash-text-muted)]">
                    {configCopy.publicPage.saveBeforePreview}
                  </p>
                </div>
                <a
                  className="inline-flex h-8 items-center justify-center rounded-md border border-[var(--dash-border-strong)] bg-[var(--dash-surface)] px-3 text-xs font-medium text-[var(--dash-text)]"
                  href={`/quote/${activeBusiness.slug}`}
                >
                  {configCopy.publicPage.previewPublicPage}
                </a>
              </div>
            </ConfigurationPanel>

            <ConfigurationPanel
              description={configCopy.notifications.description}
              id="notifications"
              summary={configCopy.notifications.summary}
              title={configCopy.notifications.title}
            >
              <div className="grid gap-2.5 sm:grid-cols-2">
                <label className={labelClass}>
                  {configCopy.notifications.ownerEmail}
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
                  {configCopy.notifications.newQuoteRequest}
                  <select className={inputClass} defaultValue="email_active" disabled>
                    <option value="email_active">{configCopy.notifications.emailActive}</option>
                    <option value="off">{configCopy.notifications.off}</option>
                  </select>
                </label>
                <label className={labelClass}>
                  SMS
                  <input
                    className={inputClass}
                    defaultValue={configCopy.notifications.futureDisabled}
                    disabled
                    type="text"
                  />
                </label>
                <label className={labelClass}>
                  WhatsApp
                  <input
                    className={inputClass}
                    defaultValue={configCopy.notifications.futureDisabled}
                    disabled
                    type="text"
                  />
                </label>
              </div>
            </ConfigurationPanel>

            <ConfigurationPanel
              description={configCopy.services.description}
              id="services-areas"
              summary={configCopy.services.summary(
                configuration.services.length,
                configuration.serviceAreas.length,
              )}
              title={configCopy.services.title}
            >
              <div className="grid gap-3.5 xl:grid-cols-2">
                <label className={labelClass}>
                  {configCopy.services.services}
                  <textarea
                    className={`${textareaClass} min-h-28`}
                    defaultValue={servicesToText(configuration.services)}
                    name="services"
                  />
                  <span className="mt-1 block text-xs leading-4 text-[var(--dash-text-muted)]">
                    {configCopy.services.servicesHelp}
                  </span>
                </label>
                <label className={labelClass}>
                  {configCopy.services.serviceAreas}
                  <textarea
                    className={`${textareaClass} min-h-28`}
                    defaultValue={serviceAreasToText(
                      configuration.serviceAreas,
                    )}
                    name="serviceAreas"
                  />
                  <span className="mt-1 block text-xs leading-4 text-[var(--dash-text-muted)]">
                    {configCopy.services.areasHelp}
                  </span>
                </label>
              </div>
            </ConfigurationPanel>

            <ConfigurationPanel
              description={configCopy.fields.description}
              id="cleaning-template-fields"
              summary={configCopy.overview.visibleQuestions(
                visibleTemplateFieldCount,
                cleaningTemplate.fields.length,
              )}
              title={configCopy.fields.title}
            >
              <div className="overflow-hidden rounded-md border border-[var(--dash-border)]">
                <div className="hidden grid-cols-[minmax(0,1fr)_6rem_5rem_7rem_4rem_6rem] items-center gap-2 border-b border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-1.5 text-xs font-medium uppercase tracking-normal text-[var(--dash-text-muted)] lg:grid">
                  <span>{configCopy.fields.customerQuestion}</span>
                  <span>{configCopy.fields.type}</span>
                  <span>{configCopy.fields.required}</span>
                  <span>{configCopy.fields.visibleOnForm}</span>
                  <span>{configCopy.fields.position}</span>
                  <span className="text-right">{configCopy.fields.customize}</span>
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
                        {field.is_required
                          ? configCopy.fields.required
                          : configCopy.fields.optional}
                      </span>
                      <span
                        className={
                          field.is_hidden ? "text-[var(--dash-text-muted)]" : "text-emerald-700 dark:text-emerald-300"
                        }
                      >
                        {field.is_hidden
                          ? configCopy.fields.hidden
                          : configCopy.fields.visible}
                      </span>
                      <span className="text-[var(--dash-text-secondary)]">{field.sort_order}</span>
                      <span className="text-left text-[var(--dash-text)] lg:text-right">
                        <span className="inline-flex h-7 items-center rounded-md border border-[var(--dash-border-strong)] bg-[var(--dash-surface)] px-2.5 text-xs font-medium group-open:hidden">
                          {configCopy.fields.customize}
                        </span>
                        <span className="hidden h-7 items-center rounded-md border border-[var(--dash-border-strong)] bg-[var(--dash-surface)] px-2.5 text-xs font-medium group-open:inline-flex">
                          {configCopy.fields.close}
                        </span>
                      </span>
                    </summary>
                    <div className="border-t border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-2.5">
                      <div className="grid gap-2.5 lg:grid-cols-[1fr_1fr_5rem_6rem_8rem] lg:items-end">
                        <label className="grid gap-1 text-xs font-medium text-[var(--dash-text)]">
                          {configCopy.fields.customerFacingQuestion}
                          <input
                            className={fieldInputClass}
                            defaultValue={field.label}
                            name={`fieldLabel:${field.field_key}`}
                            required
                            type="text"
                          />
                        </label>
                        <label className="grid gap-1 text-xs font-medium text-[var(--dash-text)]">
                          {configCopy.fields.helperText}
                          <input
                            className={fieldInputClass}
                            defaultValue={field.help_text ?? ""}
                            name={`fieldHelp:${field.field_key}`}
                            type="text"
                          />
                        </label>
                        <label className="grid gap-1 text-xs font-medium text-[var(--dash-text)]">
                          {configCopy.fields.position}
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
                          {configCopy.fields.required}
                        </label>
                        <label className="flex h-8 items-center gap-2 text-xs font-medium text-[var(--dash-text-secondary)]">
                          <input
                            defaultChecked={!field.is_hidden}
                            name={`fieldHidden:${field.field_key}`}
                            type="checkbox"
                            value=""
                          />
                          {configCopy.fields.showOnPublicForm}
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
              description={configCopy.faq.description}
              id="faq"
              summary={`${configuration.faqs.length} FAQs`}
              title={configCopy.faq.title}
            >
              <label className={labelClass}>
                {configCopy.faq.label}
                <textarea
                  className={`${inputClass} h-24 min-h-24 py-2`}
                  defaultValue={faqsToText(configuration.faqs)}
                  name="faqs"
                  placeholder={configCopy.faq.placeholder}
                />
                <span className="mt-1 block text-xs leading-4 text-[var(--dash-text-muted)]">
                  {configCopy.faq.help}
                </span>
              </label>
            </ConfigurationPanel>

            <ConfigurationPanel
              description={configCopy.privacy.description}
              id="privacy-consent"
              summary={configCopy.privacy.summary(
                configuration.privacySettings?.privacy_mode ?? "standard",
                configuration.privacySettings?.retain_leads_days ?? 365,
              )}
              title={configCopy.privacy.title}
            >
              <div className="grid gap-2.5 sm:grid-cols-2">
                <label className={labelClass}>
                  {configCopy.privacy.privacyMode}
                  <select
                    className={inputClass}
                    defaultValue={
                      configuration.privacySettings?.privacy_mode ?? "standard"
                    }
                    name="privacyMode"
                  >
                    <option value="standard">{configCopy.privacy.standard}</option>
                    <option value="minimal">{configCopy.privacy.minimal}</option>
                    <option value="forward_only">{configCopy.privacy.forwardOnly}</option>
                  </select>
                </label>
                <label className={labelClass}>
                  {configCopy.privacy.leadRetentionDays}
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
                  {configCopy.privacy.privacyContactEmail}
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
                  {configCopy.privacy.consentNotice}
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
                    {configCopy.privacy.consentHelp}
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
                  {configCopy.privacy.aiDisclosure}
                </label>
              </div>
            </ConfigurationPanel>

            <ConfigurationPanel
              description={configCopy.readiness.description(
                readiness.completed,
                readiness.total,
              )}
              id="setup-checklist"
              summary={
                readiness.completed === readiness.total
                  ? configCopy.readiness.readyToShare
                  : configCopy.readiness.setupInProgress
              }
              title={configCopy.readiness.title}
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
                      {item.complete ? configCopy.overview.done : configCopy.overview.open}
                    </span>{" "}
                    <span className="text-[var(--dash-text-secondary)]">
                      {readinessLabel(item)}
                    </span>
                  </div>
                ))}
              </div>
            </ConfigurationPanel>
          </ConfigurationTabs>
            </div>

            <aside className="space-y-3 2xl:sticky 2xl:top-20">
              <section className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3.5 shadow-sm">
                <p className="text-[18px] font-extrabold tracking-[-0.03em] text-[var(--dash-text)]">
                  {configCopy.side.workspaceReadiness}
                </p>
                <p className="mt-1 text-xs text-[var(--dash-text-muted)]">
                  {configCopy.overview.summary(readiness.completed, readiness.total)}
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
                        {readinessLabel(item)}
                      </span>
                      <span
                        className={
                          item.complete
                            ? "font-medium text-emerald-700 dark:text-emerald-300"
                            : "font-medium text-amber-700 dark:text-amber-300"
                        }
                      >
                        {item.complete ? configCopy.overview.done : configCopy.overview.open}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3.5 shadow-sm">
                <p className="text-[18px] font-extrabold tracking-[-0.03em] text-[var(--dash-text)]">
                  {configCopy.side.brandingPreview}
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
                  {configCopy.side.publicQuoteColors}
                </div>
              </section>

              <section className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3.5 shadow-sm">
                <p className="text-[18px] font-extrabold tracking-[-0.03em] text-[var(--dash-text)]">
                  {configCopy.side.publicQuoteLink}
                </p>
                <p className="mt-1 text-xs leading-5 text-[var(--dash-text-muted)]">
                  {configCopy.side.saveThenPreview}
                </p>
                <p className="mt-3 break-all rounded-md bg-[var(--dash-surface-muted)] px-3 py-2 text-sm font-semibold text-[var(--dash-text)]">
                  /quote/{activeBusiness.slug}
                </p>
                <a
                  className={`${buttonClass} mt-3 w-full`}
                  href={`/quote/${activeBusiness.slug}`}
                >
                  {configCopy.publicPage.previewPublicPage}
                </a>
              </section>
            </aside>
          </section>

        </form>
      </main>
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[var(--dash-border)] bg-[var(--dash-bg)]/95 px-4 py-2 shadow-[0_-18px_40px_rgba(0,0,0,0.18)] backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-1.5 sm:h-10 sm:flex-row sm:items-center sm:justify-between lg:pl-[244px]">
          <p className="text-xs text-[var(--dash-text-secondary)]">
            {configCopy.bottomBar.text}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <a
              className="biz-button-secondary inline-flex h-8 items-center justify-center rounded-[11px] border px-3 text-xs font-bold"
              href={`/quote/${activeBusiness.slug}`}
            >
              {configCopy.bottomBar.openPublicQuoteLink}
            </a>
            <button
              className="biz-button-primary h-8 rounded-[11px] px-4 text-xs font-bold"
              form="business-configuration-form"
              style={{ backgroundColor: "#17D492", color: "#03130c" }}
              type="submit"
            >
              {configCopy.bottomBar.saveConfiguration}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
