/**
 * ============================================================
 * File: app/(dashboard)/dashboard/configuration/page.tsx
 * Project: BizPilot AI
 * Description: Renders the focused protected Quote Setup workspace.
 * Role: Lets owners configure services, intake questions, branding, reply guidance, privacy, consent, and public-link readiness without duplicating Business Profile.
 * Related:
 * - server/services/auth.service.ts
 * - server/services/business.service.ts
 * - server/actions/auth.actions.ts
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-07-23
 * Change Log:
 * - 2026-07-23: Moved task navigation directly below the route header and collapsed the secondary six-stage journey into the Overview panel.
 * - 2026-07-22: Kept persisted custom-field starter content in the business language instead of the dashboard-interface language.
 * - 2026-07-21: Replaced physical dashboard alignment with logical equivalents and pinned numeric/email values to Latin LTR inputs.
 * - 2026-07-16: Scoped full Quote Setup saves to setup tasks while preserving separate Business Profile confirmation.
 * - 2026-07-16: Added a first-to-last setup journey, reordered tasks for launch logic, and added privacy-safe tracked channel links.
 * - 2026-07-16: Kept FAQ editor props fully serializable so Quote Setup renders in authenticated production requests.
 * - 2026-07-16: Simplified Quote Setup into guided tasks, added local branding and FAQ knowledge editors, exposed the full unique business link, and made preview repair derived public records before opening.
 * - 2026-07-05: Added a compact Quote Setup readiness command strip for first open setup action scanability.
 * - 2026-07-05: Clamped Quote Setup readiness progress to a safe 0-100 display range.
 * - 2026-07-05: Highlighted the first open Quote Setup readiness item for final owner acceptance polish.
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
 * - 2026-06-16: Aligned notifications and forward-only privacy controls with first-pilot readiness gates.
 * - 2026-06-20: Replaced the no-business setup fallback with an svh-based shell-safe layout.
 * - 2026-06-27: Normalized Quote Setup source structure and Dashboard V3 token usage.
 * - 2026-07-04: Switched internal quote preview anchors to Next Link for faster dashboard navigation.
 * - 2026-07-11: Localized remaining Quote Setup hardcoded labels, summaries, and fallback values.
 * - 2026-07-14: Reduced ten overlapping sections to six owner tasks and made Business Profile the sole identity editor.
 * ============================================================
 */

import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { BrandingEditor } from "@/components/dashboard/branding-editor";
import { ConfigurationTabs } from "@/components/dashboard/configuration-tabs";
import { CopyButton } from "@/components/dashboard/copy-button";
import { CustomQuoteFieldBuilder } from "@/components/dashboard/custom-quote-field-builder";
import { FaqKnowledgeEditor } from "@/components/dashboard/faq-knowledge-editor";
import { FlashMessage } from "@/components/dashboard/flash-message";
import { QuoteFieldTypeControl } from "@/components/dashboard/quote-field-type-control";
import { QuoteFormStructureBuilder } from "@/components/dashboard/quote-form-structure-builder";
import { TrackedQuoteLinkBuilder } from "@/components/dashboard/tracked-quote-link-builder";
import {
  buttonClass,
  inputClass,
  labelClass,
  PageHeader,
  textareaClass,
} from "@/components/dashboard/dashboard-ui";
import { getBizPilotCopy } from "@/lib/i18n/bizpilot-copy";
import {
  DASHBOARD_INTERFACE_LANGUAGE_COOKIE,
  resolveDashboardInterfaceLanguage,
} from "@/lib/i18n/dashboard-interface";
import { getDashboardInterfaceLegacyCopy } from "@/lib/i18n/dashboard-legacy-interface";
import { readSafeRouteFlashMessage } from "@/lib/i18n/route-messages";
import { getPublicSiteOrigin } from "@/lib/seo";
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
      className="scroll-mt-4 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] p-4 shadow-sm"
      id={id}
    >
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_18rem] sm:items-start">
        <div className="min-w-0">
          <h2 className="text-[18px] font-extrabold text-[var(--dash-text)]">{title}</h2>
          {description ? (
            <p className="mt-1 text-[13px] leading-5 text-[var(--dash-text-secondary)]">
              {description}
            </p>
          ) : null}
        </div>
        {summary ? (
          <p className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-2 text-xs leading-4 text-[var(--dash-text-secondary)]">
            {summary}
          </p>
        ) : null}
      </div>
      <div className="mt-4 border-t border-[var(--dash-border)] pt-4">{children}</div>
    </section>
  );
}

function LogoPreviewImage({
  alt,
  className,
  logoUrl,
}: Readonly<{ alt: string; className: string; logoUrl: string }>) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- Customer logo URLs are arbitrary HTTPS assets; Next Image remote allowlists would block pilot setup previews.
    <img alt={alt} className={className} src={logoUrl} />
  );
}

const fieldInputClass =
  "biz-field h-10 w-full rounded-lg border px-3 text-[13px] outline-none transition focus:border-[var(--dash-primary)]";

type SetupReadinessKey =
  | "branding"
  | "business_profile"
  | "cleaning_template"
  | "consent"
  | "faqs"
  | "privacy"
  | "service_areas"
  | "services";

type SetupJourneyStatus = "complete" | "current" | "upcoming";

const setupJourneyStageDefinitions: ReadonlyArray<{
  copyIndex: 0 | 1 | 2 | 3 | 4 | 5;
  defaultHref: string;
  tasks: ReadonlyArray<Readonly<{ href: string; key: SetupReadinessKey }>>;
}> = [
  {
    copyIndex: 0,
    defaultHref: "/dashboard/business-profile",
    tasks: [
      { href: "/dashboard/business-profile", key: "business_profile" },
    ],
  },
  {
    copyIndex: 1,
    defaultHref: "#services-areas",
    tasks: [
      { href: "#services-areas", key: "services" },
      { href: "#services-areas", key: "service_areas" },
    ],
  },
  {
    copyIndex: 2,
    defaultHref: "#cleaning-template-fields",
    tasks: [
      { href: "#cleaning-template-fields", key: "cleaning_template" },
    ],
  },
  {
    copyIndex: 3,
    defaultHref: "#branding",
    tasks: [{ href: "#branding", key: "branding" }],
  },
  {
    copyIndex: 4,
    defaultHref: "#faq",
    tasks: [
      { href: "#faq", key: "faqs" },
      { href: "#privacy-consent", key: "privacy" },
      { href: "#privacy-consent", key: "consent" },
    ],
  },
  {
    copyIndex: 5,
    defaultHref: "#public-link",
    tasks: [],
  },
];

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const cookieStore = await cookies();
  const interfaceLanguage = resolveDashboardInterfaceLanguage({
    cookieValue: cookieStore.get(DASHBOARD_INTERFACE_LANGUAGE_COOKIE)?.value,
  });
  const interfaceCopy = getDashboardInterfaceLegacyCopy(interfaceLanguage);
  const workspace = await getBusinessWorkspace({
    userId: user.id,
  });
  const activeBusiness = workspace.businesses[0];

  if (!activeBusiness) {
    const fallbackCopy = interfaceCopy.dashboard;

    return (
      <main className="mx-auto flex min-h-svh w-full max-w-5xl flex-col px-4 py-8 sm:px-6 sm:py-12">
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

  const configurationWorkspace = await getBusinessConfigurationWorkspace({
    business: activeBusiness,
  });
  const { cleaningTemplate, configuration, readiness } =
    configurationWorkspace;
  const primaryColor = configuration.branding?.primary_color ?? "#18181b";
  const accentColor = configuration.branding?.accent_color ?? "#0f766e";
  const publicBusinessCopy = getBizPilotCopy(activeBusiness.preferred_language);
  const dashboardCopy = interfaceCopy.dashboard;
  const configurationTabs = dashboardCopy.configuration.tabs;
  const configCopy = dashboardCopy.configuration;
  const routeNotice = readSafeRouteFlashMessage(
    params?.notice,
    dashboardCopy.routeMessages.genericNotice,
  );
  const routeError = readSafeRouteFlashMessage(
    params?.error,
    dashboardCopy.routeMessages.genericError,
  );
  const readinessLabel = (item: { label: string; taskKey: string }) =>
    dashboardCopy.readinessTasks[
      item.taskKey as keyof typeof dashboardCopy.readinessTasks
    ] ?? item.label;
  const logoUrl = configuration.branding?.logo_url ?? "";
  const quotePath = `/quote/${activeBusiness.slug}`;
  const quoteUrl = new URL(quotePath, getPublicSiteOrigin()).toString();
  const visibleTemplateFieldCount = cleaningTemplate.fields.filter(
    (field) => !field.is_hidden,
  ).length;
  const readinessPercent = Math.min(
    100,
    Math.max(
      0,
      Math.round((readiness.completed / Math.max(readiness.total, 1)) * 100),
    ),
  );
  const firstOpenReadinessItem = readiness.items.find((item) => !item.complete);
  const readinessCommandTitle = firstOpenReadinessItem
    ? configCopy.readiness.nextAction
    : configCopy.readiness.readyState;
  const readinessCommandBody = firstOpenReadinessItem
    ? configCopy.readiness.fixFirst(readinessLabel(firstOpenReadinessItem))
    : configCopy.readiness.shareWhenReady;
  const readinessByTaskKey = new Map(
    readiness.items.map((item) => [item.taskKey, item.complete]),
  );
  const setupJourneyStages = setupJourneyStageDefinitions.map((stage) => {
    const completedTaskCount = stage.tasks.filter(
      (task) => readinessByTaskKey.get(task.key) === true,
    ).length;
    const firstOpenTask = stage.tasks.find(
      (task) => readinessByTaskKey.get(task.key) !== true,
    );

    return {
      completedTaskCount:
        stage.tasks.length > 0 ? completedTaskCount : readiness.completed,
      description: configCopy.setupJourney.stages[stage.copyIndex].description,
      href: firstOpenTask?.href ?? stage.defaultHref,
      isComplete:
        stage.tasks.length > 0 && completedTaskCount === stage.tasks.length,
      taskCount: stage.tasks.length > 0 ? stage.tasks.length : readiness.total,
      title: configCopy.setupJourney.stages[stage.copyIndex].title,
    };
  });
  const currentSetupJourneyStageIndex = setupJourneyStages.findIndex(
    (stage) => !stage.isComplete,
  );
  const setupJourneyStatus = (
    isComplete: boolean,
    index: number,
  ): SetupJourneyStatus => {
    if (index === currentSetupJourneyStageIndex) {
      return "current";
    }

    return isComplete ? "complete" : "upcoming";
  };

  return (
    <>
      <main className="space-y-4 pb-44 sm:pb-28 lg:pb-20">
        <PageHeader
          description={configCopy.headerDescription(activeBusiness.name)}
          eyebrow={dashboardCopy.settings.workspace}
          title={dashboardCopy.nav.quoteSetup}
        />

        {routeNotice ? (
          <FlashMessage tone="notice">
            {routeNotice}
          </FlashMessage>
        ) : null}

        {routeError ? (
          <FlashMessage durationMs={10000} tone="error">
            {routeError}
          </FlashMessage>
        ) : null}

        <form
          action={saveBusinessConfigurationAction}
          className="space-y-3"
          id="business-configuration-form"
        >
          <input name="businessId" type="hidden" value={activeBusiness.id} />
          <input name="reviewScope" type="hidden" value="quote_setup" />
          <input
            name="templateId"
            type="hidden"
            value={cleaningTemplate.template.id}
          />
          <input name="businessName" type="hidden" value={activeBusiness.name} />
          <input name="businessSlug" type="hidden" value={activeBusiness.slug} />
          <input
            name="customTemplateName"
            type="hidden"
            value={
              configuration.templateSettings?.custom_name ??
              cleaningTemplate.template.name
            }
          />
          <input
            name="preferredLanguage"
            type="hidden"
            value={activeBusiness.preferred_language}
          />

          <section>
            <div className="min-w-0">
              <ConfigurationTabs
                ariaLabel={configurationTabs.ariaLabel}
                sections={[
                  { id: "configuration-overview", label: configurationTabs.overview },
                  { id: "services-areas", label: configurationTabs.services },
                  { id: "cleaning-template-fields", label: configurationTabs.fields },
                  { id: "branding", label: configurationTabs.branding },
                  { id: "faq", label: configurationTabs.ai },
                  { id: "privacy-consent", label: configurationTabs.privacy },
                  { id: "public-link", label: configurationTabs.link },
                ]}
              >
            <ConfigurationPanel
              description={configCopy.overview.description}
              id="configuration-overview"
              summary={configCopy.overview.summary(readiness.completed, readiness.total)}
              title={configCopy.overview.title}
            >
              <section
                className="grid gap-3 rounded-lg border border-[var(--dash-primary-border)] bg-[var(--dash-primary-soft)] p-3.5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                data-dashboard-quote-readiness-command
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--dash-primary-strong)]">
                    {configCopy.readiness.manualOnly}
                  </p>
                  <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-[18px] font-extrabold text-[var(--dash-text)]">
                      {readinessCommandTitle}
                    </h3>
                    <span className="text-sm font-semibold text-[var(--dash-text-secondary)]">
                      {configCopy.overview.complete(readiness.completed, readiness.total)}
                    </span>
                  </div>
                  <p className="mt-1 text-[13px] leading-5 text-[var(--dash-text-secondary)]">
                    {readinessCommandBody}
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row md:justify-end">
                  <Link className={buttonClass} href="#setup-readiness-checklist">
                    {configCopy.readiness.reviewChecklist}
                  </Link>
                  <button
                    className={buttonClass}
                    name="submitIntent"
                    type="submit"
                    value="preview"
                  >
                    {configCopy.overview.previewPublicQuote}
                  </button>
                </div>
              </section>

              <details
                className="mt-3 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)]"
                data-dashboard-setup-journey
              >
                <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 px-3.5 py-3 [&::-webkit-details-marker]:hidden">
                  <span className="min-w-0">
                    <span className="block text-[13px] font-extrabold text-[var(--dash-text)]">
                      {configCopy.setupJourney.title}
                    </span>
                    <span className="mt-0.5 block text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                      {configCopy.setupJourney.description}
                    </span>
                  </span>
                  <span className="rounded-full border border-[var(--dash-border)] bg-[var(--dash-surface)] px-2.5 py-1 text-[11px] font-bold text-[var(--dash-text-secondary)]">
                    {configCopy.overview.complete(readiness.completed, readiness.total)}
                  </span>
                </summary>
                <ol
                  aria-label={configCopy.setupJourney.ariaLabel}
                  className="grid gap-2 border-t border-[var(--dash-border)] p-3 sm:grid-cols-2 2xl:grid-cols-3"
                >
                  {setupJourneyStages.map((stage, index) => {
                    const status = setupJourneyStatus(stage.isComplete, index);
                    const statusLabel =
                      status === "complete"
                        ? configCopy.setupJourney.complete
                        : status === "current"
                          ? configCopy.setupJourney.current
                          : configCopy.setupJourney.upcoming;
                    const statusClass =
                      status === "complete"
                        ? "border-[var(--dash-success-border)] bg-[var(--dash-success-soft)] text-[var(--dash-success-strong)]"
                        : status === "current"
                          ? "border-[var(--dash-primary-border)] bg-[var(--dash-primary-soft)] text-[var(--dash-primary-strong)]"
                          : "border-[var(--dash-border)] bg-[var(--dash-surface)] text-[var(--dash-text-muted)]";

                    return (
                      <li key={stage.title}>
                        <Link
                          aria-current={status === "current" ? "step" : undefined}
                          className={`group grid h-full min-h-28 rounded-lg border p-3 outline-none transition hover:border-[var(--dash-primary-border)] hover:bg-[var(--dash-primary-soft)] focus-visible:ring-2 focus-visible:ring-[var(--dash-primary)] ${
                            status === "current"
                              ? "border-[var(--dash-primary)] bg-[var(--dash-primary-soft)]"
                              : "border-[var(--dash-border)] bg-[var(--dash-surface)]"
                          }`}
                          href={stage.href}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-[11px] font-bold uppercase tracking-wide text-[var(--dash-text-muted)]">
                              {configCopy.setupJourney.stepLabel(
                                index + 1,
                                setupJourneyStages.length,
                              )}
                            </span>
                            <span
                              className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${statusClass}`}
                            >
                              {statusLabel}
                            </span>
                          </div>
                          <h4 className="mt-2 text-sm font-extrabold text-[var(--dash-text)] group-hover:text-[var(--dash-primary-strong)]">
                            {stage.title}
                          </h4>
                          <p className="mt-1 text-xs leading-[1.15rem] text-[var(--dash-text-secondary)]">
                            {stage.description}
                          </p>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </details>

              <div className="grid gap-3.5 2xl:grid-cols-[minmax(0,1fr)_20rem]">
                <div className="grid gap-3.5 xl:grid-cols-[17rem_minmax(0,1fr)]">
                  <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3.5">
                    <div className="flex h-28 items-center justify-center overflow-hidden rounded-lg border border-[var(--dash-primary-border)] bg-[var(--dash-surface)]">
                      {logoUrl ? (
                        <LogoPreviewImage
                          alt={configCopy.branding.logoPreviewAlt}
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
                      <p className="text-end text-xs font-medium text-[var(--dash-text-muted)]">
                        {configCopy.overview.complete(readiness.completed, readiness.total)}
                      </p>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--dash-surface-muted)]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: "var(--dash-primary)",
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

                <div
                  className="scroll-mt-24 rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-3.5"
                  id="setup-readiness-checklist"
                >
                  <p className="text-[18px] font-extrabold text-[var(--dash-text)]">
                    {configCopy.overview.setupReport}
                  </p>
                  <div className="mt-3 grid gap-2">
                    {readiness.items.map((item) => {
                      const isFirstOpenItem =
                        firstOpenReadinessItem?.taskKey === item.taskKey;

                      return (
                      <div
                        aria-current={isFirstOpenItem ? "step" : undefined}
                        className={`flex items-center justify-between gap-3 rounded-md px-3 py-2 text-xs ${
                          isFirstOpenItem
                            ? "border border-[var(--dash-warning-border)] bg-[var(--dash-warning-soft)]"
                            : "bg-[var(--dash-surface)]"
                        }`}
                        key={item.label}
                      >
                        <span className="truncate text-[var(--dash-text-secondary)]">
                          {readinessLabel(item)}
                        </span>
                        <span
                          className={
                            item.complete
                              ? "font-medium text-[var(--dash-success-strong)]"
                              : "font-medium text-[var(--dash-warning-strong)]"
                          }
                        >
                          {item.complete ? configCopy.overview.done : configCopy.overview.open}
                        </span>
                      </div>
                      );
                    })}
                  </div>
                  <button
                    className={`${buttonClass} mt-4 w-full`}
                    name="submitIntent"
                    type="submit"
                    value="preview"
                  >
                    {configCopy.overview.previewPublicQuote}
                  </button>
                </div>
              </div>
            </ConfigurationPanel>

            <ConfigurationPanel
              description={configCopy.publicPage.description}
              id="public-link"
              summary={configCopy.publicPage.uniqueLinkDescription}
              title={configCopy.publicPage.uniqueLinkTitle}
            >
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
                <div className="min-w-0 rounded-xl border border-[var(--dash-primary-border)] bg-[var(--dash-primary-soft)] p-4">
                  <p className="text-[12px] font-black uppercase tracking-[0.08em] text-[var(--dash-primary-strong)]">
                    {configCopy.publicPage.publicQuoteLink}
                  </p>
                  <p className="mt-2 break-all rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] px-3 py-3 font-mono text-[13px] font-bold text-[var(--dash-text)]">
                    {quoteUrl}
                  </p>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <CopyButton
                      className="min-h-10"
                      label={configCopy.publicPage.copyLink}
                      value={quoteUrl}
                    />
                    <button
                      className="biz-button-primary min-h-10 rounded-lg px-4 text-[12px] font-bold"
                      name="submitIntent"
                      type="submit"
                      value="preview"
                    >
                      {configCopy.bottomBar.openPublicQuoteLink}
                    </button>
                  </div>
                  <p className="mt-3 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
                    {configCopy.publicPage.saveBeforePreview}
                  </p>
                </div>

                <aside className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-4">
                  <h3 className="text-[14px] font-black text-[var(--dash-text)]">
                    {configCopy.publicPage.placementTitle}
                  </h3>
                  <ol className="mt-3 grid gap-2.5">
                    {configCopy.publicPage.placements.map((placement, index) => (
                      <li
                        className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-2 text-[12px] leading-5 text-[var(--dash-text-secondary)]"
                        key={placement}
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--dash-primary)] text-[10px] font-black text-white">
                          {index + 1}
                        </span>
                        <span>{placement}</span>
                      </li>
                    ))}
                  </ol>
                </aside>
              </div>
              <div className="mt-4">
                <TrackedQuoteLinkBuilder
                  baseUrl={quoteUrl}
                  copy={configCopy.sourceLinks}
                />
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
              <BrandingEditor
                businessName={activeBusiness.name}
                copy={configCopy.branding}
                initialAccentColor={accentColor}
                initialLogoUrl={logoUrl}
                initialPrimaryColor={primaryColor}
              />
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
              <QuoteFormStructureBuilder
                copy={configCopy.fields.formStructure}
                fields={cleaningTemplate.fields.map((field) => ({
                  fieldKey: field.field_key,
                  label: field.label,
                  sectionKey: field.section_key,
                }))}
                initialLayout={cleaningTemplate.formLayout}
              />
              <div className="overflow-hidden rounded-md border border-[var(--dash-border)]">
                <div className="hidden grid-cols-[minmax(0,1fr)_7rem_5rem_7rem_4rem_6rem] items-center gap-2 border-b border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-1.5 text-xs font-medium uppercase tracking-normal text-[var(--dash-text-muted)] lg:grid">
                  <span>{configCopy.fields.customerQuestion}</span>
                  <span>{configCopy.fields.type}</span>
                  <span>{configCopy.fields.required}</span>
                  <span>{configCopy.fields.visibleOnForm}</span>
                  <span>{configCopy.fields.position}</span>
                  <span className="text-end">{configCopy.fields.customize}</span>
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
                    {field.is_custom ? (
                      <input
                        name="customFieldKeys"
                        type="hidden"
                        value={field.field_key}
                      />
                    ) : null}
                    <summary className="grid cursor-pointer list-none gap-2 px-3 py-2 text-xs transition hover:bg-[var(--dash-primary-soft)] lg:grid-cols-[minmax(0,1fr)_7rem_5rem_7rem_4rem_6rem] lg:items-center [&::-webkit-details-marker]:hidden">
                      <span className="min-w-0 truncate font-medium text-[var(--dash-text)]">
                        {field.label}
                      </span>
                      <span className="capitalize text-[var(--dash-text-muted)]">
                        {configCopy.fields.typeLabels[field.field_type]}
                      </span>
                      <span
                        className={
                          field.is_required
                            ? "text-[var(--dash-success-strong)]"
                            : "text-[var(--dash-text-muted)]"
                        }
                      >
                        {field.is_required
                          ? configCopy.fields.required
                          : configCopy.fields.optional}
                      </span>
                      <span
                        className={
                          field.is_hidden
                            ? "text-[var(--dash-text-muted)]"
                            : "text-[var(--dash-success-strong)]"
                        }
                      >
                        {field.is_hidden
                          ? configCopy.fields.hidden
                          : configCopy.fields.visible}
                      </span>
                      <span className="text-[var(--dash-text-secondary)]">{field.sort_order}</span>
                      <span className="text-start text-[var(--dash-text)] lg:text-end">
                        <span className="inline-flex h-7 items-center rounded-md border border-[var(--dash-border-strong)] bg-[var(--dash-surface)] px-2.5 text-xs font-medium group-open:hidden">
                          {configCopy.fields.customize}
                        </span>
                        <span className="hidden h-7 items-center rounded-md border border-[var(--dash-border-strong)] bg-[var(--dash-surface)] px-2.5 text-xs font-medium group-open:inline-flex">
                          {configCopy.fields.close}
                        </span>
                      </span>
                    </summary>
                    <div className="border-t border-[var(--dash-border)] bg-[var(--dash-surface-muted)] px-3 py-2.5">
                      <div className="grid gap-2.5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_8rem_5rem_6rem_8rem] lg:items-end">
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
                        <QuoteFieldTypeControl
                          copy={configCopy.fields}
                          defaultType={field.field_type}
                          fieldKey={field.field_key}
                          isCustom={field.is_custom ?? false}
                          options={field.options}
                        />
                        <label className="grid gap-1 text-xs font-medium text-[var(--dash-text)]">
                          {configCopy.fields.priority}
                          <input
                            className={fieldInputClass}
                            data-dashboard-ltr-value="true"
                            defaultValue={field.sort_order}
                            dir="ltr"
                            lang="en-CA"
                            max={999}
                            min={1}
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
                        {field.is_custom ? (
                          <label className="flex h-8 items-center gap-2 text-xs font-medium text-[var(--dash-danger-strong)]">
                            <input
                              name={`fieldDelete:${field.field_key}`}
                              type="checkbox"
                            />
                            {configCopy.fields.removeField}
                          </label>
                        ) : null}
                      </div>
                    </div>
                  </details>
                ))}
              </div>
              <CustomQuoteFieldBuilder
                contentLanguage={activeBusiness.preferred_language}
                contentPlaceholders={
                  publicBusinessCopy.dashboard.configuration.fields.placeholders
                }
                copy={configCopy.fields}
                initialSections={cleaningTemplate.formLayout.sections.map(
                  (section) => ({
                    key: section.key,
                    label: section.navLabel,
                  }),
                )}
              />
            </ConfigurationPanel>

            <ConfigurationPanel
              description={configCopy.faq.description}
              id="faq"
              summary={configCopy.faq.summary(
                configuration.faqs.length || configCopy.faq.examples.length,
              )}
              title={configCopy.faq.title}
            >
              <FaqKnowledgeEditor
                copy={{
                  clearExamples: configCopy.faq.clearExamples,
                  countMany: configCopy.faq.countMany,
                  countOne: configCopy.faq.countOne,
                  guardrailTitle: configCopy.faq.guardrailTitle,
                  guardrails: configCopy.faq.guardrails,
                  help: configCopy.faq.help,
                  label: configCopy.faq.label,
                  loadExamples: configCopy.faq.loadExamples,
                }}
                examples={configCopy.faq.examples}
                initialValue={faqsToText(configuration.faqs)}
              />
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
                    <option disabled value="forward_only">{configCopy.privacy.forwardOnly}</option>
                  </select>
                </label>
                <label className={labelClass}>
                  {configCopy.privacy.leadRetentionDays}
                  <input
                    className={inputClass}
                    data-dashboard-ltr-value="true"
                    defaultValue={
                      configuration.privacySettings?.retain_leads_days ?? 365
                    }
                    dir="ltr"
                    lang="en-CA"
                    min={1}
                    name="retainLeadsDays"
                    type="number"
                  />
                </label>
                <label className={`${labelClass} sm:col-span-2`}>
                  {configCopy.privacy.privacyContactEmail}
                  <input
                    className={inputClass}
                    data-dashboard-ltr-value="true"
                    defaultValue={
                      configuration.consentSettings?.privacy_contact_email ??
                      ""
                    }
                    dir="ltr"
                    lang="en-CA"
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
                      publicBusinessCopy.quoteForm.consentNoticeDefault
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

              </ConfigurationTabs>
            </div>
          </section>

        </form>
      </main>
      <div className="dashboard-configuration-actions fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] start-0 end-0 z-20 border-t border-[var(--dash-border)] bg-[var(--dash-bg)]/95 px-3 py-2 shadow-[0_-10px_28px_rgba(0,0,0,0.14)] backdrop-blur sm:px-4 lg:bottom-0 lg:start-[240px]">
        <div className="dashboard-container flex flex-col gap-1.5 sm:min-h-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[var(--dash-text-secondary)]">
            {configCopy.bottomBar.text}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              className="biz-button-secondary inline-flex h-8 items-center justify-center rounded-lg border px-3 text-xs font-bold"
              form="business-configuration-form"
              name="submitIntent"
              type="submit"
              value="preview"
            >
              {configCopy.bottomBar.openPublicQuoteLink}
            </button>
            <button
              className="biz-button-primary h-8 rounded-lg px-4 text-xs font-bold"
              form="business-configuration-form"
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
