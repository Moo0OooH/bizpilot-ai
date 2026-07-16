/**
 * ============================================================
 * File: lib/i18n/bizpilot-copy.ts
 * Project: BizPilot AI
 * Description: Small dictionary for MVP-safe English and Canadian French copy.
 * Role: Localizes public quote, quote success, safe intake errors, and rule-based AI copy without a full framework.
 * Related:
 * - lib/i18n/language.ts
 * - components/public/quote-form-wizard.tsx
 * - server/services/public-intake.service.ts
 * - server/services/ai/lead-conversion-assistant.service.ts
 * Author: MoOoH
 * Created: 2026-05-23
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Added bilingual guided setup copy for local logo uploads, recommended fields, FAQ knowledge, unique quote links, and owner preview recovery.
 * - 2026-07-15: Added centralized EN/fr-CA copy for the global runtime error boundary.
 * - 2026-07-14: Polished Canadian French dashboard/admin accents and updated Settings guidance to match the simplified protected experience.
 * - 2026-07-11: Added bilingual founder-admin activity metadata, inbox, status-chart, and safety-rail copy fields.
 * - 2026-07-11: Added founder-admin overview and directory copy fields to match bilingual dictionary entries.
 * - 2026-07-11: Completed founder-admin detail copy shape for type-safe bilingual admin labels.
 * - 2026-07-11: Restored dashboard admin and founder handoff copy shape for production type checks.
 * - 2026-07-05: Added safe Google login copy for existing owner accounts.
 * - 2026-07-05: Added Quote Setup readiness command copy for first open setup actions.
 * - 2026-07-05: Reframed lead-detail owner notes as a private scratchpad with gated persistence.
 * - 2026-07-05: Reframed Business Profile future fields as gated storage decisions.
 * - 2026-07-05: Reworded settings roadmap copy from placeholders to gated references.
 * - 2026-07-05: Softened auth confirmation success copy to avoid overpromising workspace readiness.
 * - 2026-07-05: Added focus-aware lead queue command copy for manual recovery lanes.
 * - 2026-07-05: Added bilingual route-aware dashboard guide copy for every protected owner page.
 * - 2026-07-05: Standardized owner overview utility CTA copy for action-first dashboard hierarchy.
 * - 2026-07-05: Added accessible lead queue pagination labels and page-button copy.
 * - 2026-07-05: Expanded quote-field legacy default localization and dashboard form placeholders.
 * - 2026-07-11: Localized remaining owner/public configuration labels, summaries, and quote language switch accessibility copy.
 * - 2026-07-04: Added Settings feature guide details and lead queue pagination copy.
 * - 2026-07-04: Tightened dashboard copy around manual draft review, copied replies, and unwired roadmap fields.
 * - 2026-07-04: Added local dashboard display preference copy for density, guide, and insight controls.
 * - 2026-07-04: Clarified overview queue-filter and public quote-form action labels.
 * - 2026-07-04: Added protected owner operating guide copy and navigation labels.
 * - 2026-06-16: Aligned Settings copy with Phase 23/24 readiness and first-pilot manual-only decisions.
 * - 2026-06-19: Updated dashboard theme help copy for the Light-by-default public theme foundation.
 * - 2026-06-21: Added localized quote success noindex metadata.
 * - 2026-06-25: Polished owner-review wording in dashboard and status helper copy.
 * - 2026-06-26: Removed legacy owner-heavy and desk wording before Dashboard D1.
 * - 2026-06-27: Clarified Quote Setup choice-option help for time-window custom fields.
 * - 2026-06-27: Added owner first-run setup guidance copy for the dashboard overview.
 * ============================================================
 */

import {
  DEFAULT_LANGUAGE,
  readSupportedLanguage,
  type SupportedLanguage,
} from "./language.ts";
import type {
  FeatureCategory,
  FeatureGuideStatus,
  FeatureKey,
  FeatureLevel,
  FeatureState,
} from "../features/feature-registry.ts";

/**
 * Copy namespaces stay domain-based on purpose:
 * - quotePage / quoteForm / quoteSuccess: public customer quote flow
 * - quoteFields / optionLabels / intakeErrors: form schema and safe validation
 * - leadRules / aiFallback / demo: owner-reviewed lead recovery moments
 *
 * Adding a new language should be a complete dictionary addition, not scattered
 * conditional UI copy.
 */
type QuoteStepId = "service" | "when_where" | "contact";
type QuoteFieldTypeLabelKey =
  | "boolean"
  | "date"
  | "email"
  | "number"
  | "phone"
  | "radio"
  | "select"
  | "text"
  | "textarea"
  | "time_window";

type MetaCopy = Readonly<{
  description: string;
  title: string;
}>;

type GlobalErrorCopy = Readonly<{
  body: string;
  eyebrow: string;
  reload: string;
  title: string;
}>;

export type QuoteStepCopy = Readonly<{
  description: string;
  id: QuoteStepId;
  label: string;
  title: string;
}>;

type IntakeErrorCopy = Readonly<{
  consentRequired: string;
  fallbackSubmit: string;
  formChanged: string;
  invalidChoice: (label: string) => string;
  linkUnavailable: string;
  rejected: string;
  submittedTooFast: string;
  temporarySubmitUnavailable: string;
  fieldRequired: (label: string) => string;
  nonNegativeNumber: (label: string) => string;
  validDate: (label: string) => string;
  validNumber: (label: string) => string;
  notPastDate: (label: string) => string;
}>;

type LeadRuleCopy = Readonly<{
  actionAskInfo: string;
  actionFollowUp: string;
  actionReply: string;
  actionReplyOverdue: string;
  archiveOrReviewArea: string;
  completeExplanation: string;
  followUpToday: string;
  lowFitExplanation: string;
  markBookedLost: string;
  noOpenAction: string;
  outcomeBooked: string;
  outcomeLost: string;
  readyForReply: string;
  recommendedAskInfo: string;
  replyCopiedWaiting: string;
  manuallyMarkedNotFit: string;
  responseState: (state: string) => string;
  missingExplanation: (labels: string[]) => string;
}>;

type AiFallbackCopy = Readonly<{
  areaFallback: string;
  missingNone: string;
  serviceFallback: string;
  askMissingDetails: string;
  replyWarmLead: string;
  followUpDraft: (service: string, area: string) => string;
  leadSummary: (qualityLevel: string, service: string, area: string) => string;
  missingText: (missing: readonly string[]) => string;
  replyDraft: (service: string, missingText: string) => string;
  toneConcise: (service: string, missingText: string) => string;
  toneFriendly: (service: string, missingText: string) => string;
}>;

type DemoLeadTone = "amber" | "blue" | "emerald" | "red";

type DemoSampleLeadCopy = Readonly<{
  area: string;
  customer: string;
  detail: string;
  followUpDraft: string;
  replyDraft: string;
  status: string;
  tone: DemoLeadTone;
}>;

type DemoCopy = Readonly<{
  aiDraftReady: string;
  aiSummary: string;
  aiSummaryLabel: string;
  copyResponse: string;
  detailOne: string;
  detailTwo: string;
  detailThree: string;
  detailFour: string;
  disappearsNote: string;
  featuredLeadTitle: string;
  followUpDraft: string;
  followUpLabel: string;
  markContacted: string;
  missingInfo: string;
  missingInfoLabel: string;
  notStored: string;
  replyDraft: string;
  replyDraftLabel: string;
  replyNeeded: string;
  reviewReply: string;
  sampleAreas: readonly string[];
  sampleDemoState: string;
  sampleLeads: readonly DemoSampleLeadCopy[];
  sampleStatuses: readonly string[];
  shareQuoteLink: string;
  suggestedNextAction: string;
  suggestedNextActionLabel: string;
}>;

type QuoteFieldCopy = Readonly<{
  helpText?: string;
  label: string;
}>;

type PageContextCopy = Readonly<{
  subtitle: string;
  title: string;
}>;

type DashboardBusinessProfileCopy = Readonly<{
  accountEmailHelp: string;
  aiNotes: string;
  aiNotesDescription: string;
  business: string;
  businessIdentity: string;
  businessIdentityDescription: string;
  businessName: string;
  businessType: string;
  cleaning: string;
  description: string;
  futureDescription: string;
  futureFields: string;
  languageHelp: string;
  logoUrl: string;
  notInMvp: string;
  oneAreaPerLine: string;
  openQuoteSetup: string;
  ownerEmail: string;
  preferredLanguage: string;
  previewQuotePage: string;
  publicQuoteLink: string;
  publicSlug: string;
  roadmapFields: ReadonlyArray<readonly [string, string]>;
  save: string;
  saveNote: string;
  serviceAreas: string;
  serviceAreasPlaceholder: string;
  templateName: string;
  verticalHelp: string;
}>;

type DashboardConfigurationCopy = Readonly<{
  bottomBar: Readonly<{
    openPublicQuoteLink: string;
    saveConfiguration: string;
    text: string;
  }>;
  branding: Readonly<{
    accentAppears: string;
    accentColor: string;
    addLogoAndColors: string;
    colorsConfigured: string;
    description: string;
    fileError: string;
    logoAndColorsConfigured: string;
    logoPreviewAlt: string;
    logoPreview: string;
    logoUrl: string;
    logoUrlHelp: string;
    primaryColor: string;
    publicQuoteButton: string;
    removeLogo: string;
    resetColors: string;
    submitQuoteRequest: string;
    title: string;
    uploadHelp: string;
    uploadLogo: string;
    whereColorsApply: string;
  }>;
  basics: Readonly<{
    businessName: string;
    description: string;
    languageHelp: string;
    preferredLanguage: string;
    publicSlug: string;
    templateName: string;
    title: string;
  }>;
  fields: Readonly<{
    addAnotherField: string;
    addCustomField: string;
    advancedSettings: string;
    close: string;
    chooseStarter: string;
    customFieldBuilder: string;
    customerFacingQuestion: string;
    customerQuestion: string;
    customize: string;
    description: string;
    emptyBody: string;
    emptyTitle: string;
    fieldKey: string;
    fieldKeyHelp: string;
    helperText: string;
    hidden: string;
    newFieldName: string;
    optional: string;
    options: string;
    optionsHelp: string;
    placeholders?: Readonly<
      Record<
        QuoteFieldTypeLabelKey,
        Readonly<{
          fieldKey: string;
          helper: string;
          label: string;
          options: string;
          preview: string;
        }>
      >
    >;
    position: string;
    priority: string;
    recommendedQuestions: string;
    removeField: string;
    required: string;
    showOnPublicForm: string;
    title: string;
    type: string;
    typeLabels: Readonly<Record<QuoteFieldTypeLabelKey, string>>;
    visible: string;
    visibleOnForm: string;
  }>;
  faq: Readonly<{
    clearExamples: string;
    description: string;
    examples: readonly string[];
    guardrailTitle: string;
    guardrails: readonly string[];
    help: string;
    label: string;
    loadExamples: string;
    placeholder: string;
    summary: (count: number) => string;
    title: string;
  }>;
  headerDescription: (businessName: string) => string;
  noBusinessDescription: string;
  notifications: Readonly<{
    channels: Readonly<{
      sms: string;
      whatsapp: string;
    }>;
    description: string;
    emailActive: string;
    futureDisabled: string;
    newQuoteRequest: string;
    off: string;
    ownerEmail: string;
    summary: string;
    title: string;
  }>;
  overview: Readonly<{
    branding: string;
    colorsReady: string;
    complete: (completed: number, total: number) => string;
    coveredAreas: (count: number) => string;
    description: string;
    done: string;
    faqs: string;
    logoConfigured: string;
    open: string;
    previewPublicQuote: string;
    privacy: string;
    profile: string;
    publicLink: string;
    quoteForm: string;
    serviceAreas: string;
    serviceRecords: (count: number) => string;
    services: string;
    setupReport: string;
    summary: (completed: number, total: number) => string;
    title: string;
    visibleQuestions: (visible: number, total: number) => string;
    workspaceReadiness: string;
  }>;
  privacy: Readonly<{
    aiDisclosure: string;
    consentHelp: string;
    consentNotice: string;
    description: string;
    forwardOnly: string;
    leadRetentionDays: string;
    minimal: string;
    privacyContactEmail: string;
    privacyMode: string;
    standard: string;
    summary: (mode: string, days: number) => string;
    title: string;
  }>;
  publicPage: Readonly<{
    copyLink: string;
    description: string;
    placementTitle: string;
    placements: readonly string[];
    previewPublicPage: string;
    publicQuoteLink: string;
    saveBeforePreview: string;
    title: string;
    uniqueLinkDescription: string;
    uniqueLinkTitle: string;
  }>;
  readiness: Readonly<{
    description: (completed: number, total: number) => string;
    fixFirst: (task: string) => string;
    manualOnly: string;
    nextAction: string;
    readyToShare: string;
    readyState: string;
    reviewChecklist: string;
    shareWhenReady: string;
    setupInProgress: string;
    title: string;
  }>;
  services: Readonly<{
    areasHelp: string;
    description: string;
    serviceAreas: string;
    services: string;
    servicesHelp: string;
    summary: (serviceCount: number, areaCount: number) => string;
    title: string;
  }>;
  side: Readonly<{
    brandingPreview: string;
    publicQuoteColors: string;
    publicQuoteLink: string;
    saveThenPreview: string;
    workspaceReadiness: string;
  }>;
  tabs: Readonly<{
    ariaLabel: string;
    ai: string;
    basics: string;
    branding: string;
    fields: string;
    link: string;
    notifications: string;
    overview: string;
    privacy: string;
    readiness: string;
    services: string;
  }>;
}>;

type DashboardLeadQueueCopy = Readonly<{
  age: Readonly<{
    ago: string;
    day: (count: number) => string;
    hour: (count: number) => string;
    minute: (count: number) => string;
    notAvailable: string;
    olderDateLocale: string;
  }>;
  empty: Readonly<{
    clearFilters: string;
    filteredBody: string;
    filteredTitle: string;
    noLeadsBody: string;
    noLeadsTitle: string;
  }>;
  fallbacks: Readonly<{
    area: string;
    service: string;
    unnamedLead: string;
  }>;
  filters: Readonly<{
    aiReady: string;
    all: string;
    atRisk: string;
    lost: string;
    missingInfo: string;
    needsReply: string;
    reviewed: string;
    won: string;
  }>;
  headers: Readonly<{
    customer: string;
    location: string;
    nextAction: string;
    requested: string;
    service: string;
    status: string;
  }>;
  pagination: Readonly<{
    navigationLabel: string;
    next: string;
    pageButtonAriaLabel: (page: number) => string;
    pageRange: (start: number, end: number, total: number) => string;
    pageSizeAriaLabel: string;
    pageSizeLabel: string;
    pageSizeOption: (count: number) => string;
    pageStatus: (current: number, total: number) => string;
    previous: string;
  }>;
  searchPlaceholder: string;
  sorts: Readonly<{
    mostUrgent: string;
    newest: string;
    oldest: string;
  }>;
  priorityHint: string;
  resultSummary: (visible: number, total: number) => string;
  searchAriaLabel: string;
  filterAriaLabel: string;
  sortAriaLabel: string;
  status: Readonly<{
    archived: string;
    atRisk: string;
    lost: string;
    missingInfo: string;
    needsReply: string;
    reviewed: string;
    won: string;
  }>;
  reset: string;
}>;

type DashboardLeadDetailCopy = Readonly<{
  actionItems: string;
  ai: Readonly<{
    copyFollowUp: string;
    copyReply: string;
    editManually: string;
    editManuallyTitle: string;
    estimatedCost: string;
    fallbackReason: string;
    followUpDraft: string;
    generate: string;
    guardrails: string;
    guardrailBadges: readonly string[];
    manualDraftDescription: string;
    missingInfo: string;
    modelDraft: string;
    nextAction: string;
    noSend: string;
    ownerReviewRequired: string;
    regenerate: string;
    ruleFallback: string;
    source: string;
    suggestedReply: string;
    title: string;
  }>;
  backToQueue: string;
  completeAction: string;
  copiedDone: string;
  detailDescription: (service: string, area: string, age: string) => string;
  fields: Readonly<{
    contact: string;
    name: string;
    serviceType: string;
    cityArea: string;
    source: string;
    submitted: string;
  }>;
  fallbacks: Readonly<{
    area: string;
    contact: string;
    service: string;
    source: string;
    unnamedLead: string;
  }>;
  labels: Readonly<{
    manualOutcome: string;
    primaryIssue: string;
    recommendedAction: string;
    status: string;
  }>;
  mark: string;
  markReplyCopied: string;
  markWon: string;
  manualWorkflow: Readonly<{
    description: string;
    outcomeNote: string;
    primaryAction: string;
    secondaryAction: string;
    steps: ReadonlyArray<readonly [string, string]>;
    title: string;
  }>;
  missing: Readonly<{
    description: string;
    noRequiredMissing: string;
    title: string;
  }>;
  noActionItemsBody: string;
  noActionItemsTitle: string;
  noTimelineBody: string;
  noTimelineTitle: string;
  notProvided: string;
  notYet: string;
  ownerNotes: Readonly<{
    description: string;
    persistenceNote: string;
    placeholder: string;
    title: string;
  }>;
  quoteIntakeFields: string;
  sourceAttribution: Readonly<{
    description: string;
    fields: Readonly<{
      referrer: string;
      sourceUrl: string;
      utmCampaign: string;
      utmMedium: string;
      utmSource: string;
    }>;
    title: string;
  }>;
  routing: Readonly<{
    badges: readonly string[];
    description: string;
    missingInfoLabel: string;
    nextActionLabel: string;
    noMissingInfo: string;
    priorityLabel: string;
    priorities: Record<string, string>;
    queueLabel: string;
    queues: Record<string, string>;
    reasonLabel: string;
    reasons: Record<string, string>;
    reviewerLabel: string;
    reviewers: Record<string, string>;
    nextActions: Record<string, string>;
    title: string;
  }>;
  save: string;
  sections: Readonly<{
    controlsDescription: string;
    controlsTitle: string;
    leadDetailsDescription: string;
    leadDetailsTitle: string;
  }>;
  manualOutcomeHelp: string;
  statusLabels: Record<string, string>;
  timeline: string;
  values: Readonly<{
    no: string;
    yes: string;
  }>;
}>;

type DashboardLeadQueueFocusKey =
  | "ai_ready"
  | "all"
  | "at_risk"
  | "lost"
  | "missing_info"
  | "needs_reply"
  | "reviewed"
  | "won";

type DashboardLeadsPageCopy = Readonly<{
  active: string;
  atRiskBadge: (count: number) => string;
  command: Readonly<{
    countLabel: (count: number, total: number) => string;
    manualOnly: string;
    noMatchingLead: string;
    routeLabel: string;
    safeAction: string;
    secondaryLabel: string;
    states: Readonly<
      Record<
        DashboardLeadQueueFocusKey,
        Readonly<{
          description: string;
          emptyDescription: string;
          emptyPrimaryLabel: string;
          emptyTitle: string;
          primaryLabel: string;
          title: string;
        }>
      >
    >;
  }>;
  focusAtRiskDescription: (count: number) => string;
  focusHealthyDescription: string;
  focusTitle: string;
  lastSubmission: (age: string) => string;
  missingInfoBadge: (count: number) => string;
  newBadge: (count: number) => string;
  openQuoteSetup: string;
  quoteLinkHealth: string;
  statusRulesBody: string;
  statusRulesTitle: string;
}>;

type DashboardGuideCopy = Readonly<{
  actions: Readonly<{
    openQueue: string;
    openSetup: string;
    viewSettings: string;
  }>;
  boundaries: Readonly<{
    description: string;
    items: readonly string[];
    title: string;
  }>;
  gaps: Readonly<{
    description: string;
    items: ReadonlyArray<readonly [string, string]>;
    title: string;
  }>;
  header: Readonly<{
    description: string;
    eyebrow: string;
    title: string;
  }>;
  launchChecklist: Readonly<{
    description: string;
    items: ReadonlyArray<readonly [string, string, string]>;
    title: string;
  }>;
  operatingSystem: Readonly<{
    description: string;
    lanes: ReadonlyArray<readonly [string, string, string]>;
    title: string;
  }>;
  routeMap: Readonly<{
    description: string;
    items: ReadonlyArray<readonly [string, string, string, string]>;
    title: string;
  }>;
}>;

type DashboardRouteGuideKey =
  | "businessProfile"
  | "configuration"
  | "guide"
  | "leadDetail"
  | "leads"
  | "overview"
  | "settings";

type DashboardRouteGuideCopy = Readonly<{
  ariaLabel: string;
  fullGuide: string;
  label: string;
  routes: Readonly<Record<
    DashboardRouteGuideKey,
    Readonly<{
      focus: string;
      next: string;
      primaryHref: string;
      primaryLabel: string;
      secondaryHref: string;
      secondaryLabel: string;
    }>
  >>;
}>;

type DashboardOverviewCopy = Readonly<{
  aiControlBody: string;
  aiControlBadges: readonly string[];
  aiControlTitle: string;
  atRiskSoon: string;
  copyLink: string;
  featuredFallbackAction: string;
  featuredFallbackAge: string;
  featuredFallbackArea: string;
  featuredFallbackCustomer: string;
  featuredFallbackService: string;
  finishSetup: string;
  guidesAndAiControls: string;
  heroBadge: string;
  heroDescription: string;
  heroTitle: (count: number) => string;
  startGuide: Readonly<{
    description: string;
    done: string;
    items: ReadonlyArray<readonly [string, string]>;
    next: string;
    title: string;
  }>;
  commandFlow: Readonly<{
    description: string;
    items: ReadonlyArray<readonly [string, string]>;
    title: string;
  }>;
  metrics: Readonly<{
    aiDraftsReady: Readonly<{ detail: string; label: string }>;
    atRiskLeads: Readonly<{ detail: string; label: string }>;
    needsReply: Readonly<{ detail: string; label: string }>;
    newQuoteRequests: Readonly<{ detail: string; label: string }>;
  }>;
  noWorkspaceBody: string;
  noWorkspaceTitle: string;
  openQueue: string;
  readiness: Readonly<{
    activeAndReady: string;
    incomplete: string;
    liveAndShareable: string;
    needed: string;
    ready: string;
    tasksLeft: (count: number) => string;
    title: string;
  }>;
  recentActivity: Readonly<{
    description: string;
    emptyBody: string;
    emptyTitle: string;
    title: string;
  }>;
  recoveryFocus: Readonly<{
    description: (count: number) => string;
    followUpDetail: (count: number) => string;
    followUpTitle: string;
    itemCount: (count: number) => string;
    missingInfoDetail: (count: number) => string;
    missingInfoTitle: string;
    replyDetail: (count: number) => string;
    replyTitle: string;
    title: string;
  }>;
  reviewUrgentLead: string;
  routine: Readonly<{
    steps: ReadonlyArray<readonly [string, string, string]>;
    title: string;
  }>;
  status: Readonly<{
    aiDraftReady: string;
    missingInfo: string;
    ready: string;
  }>;
  suggestedNextAction: string;
  setupChecklist: string;
  visualDashboard: Readonly<{
    aiAssistantBody: (count: number) => string;
    aiAssistantTitle: string;
    dateRange: string;
    filters: string;
    kpis: Readonly<{
      aiRepliesSent: string;
      awaitingReply: string;
      dealsWon: string;
      newLeads: string;
      quoteLinkSent: string;
      readinessCompleted: string;
    }>;
    leadQueueTitle: string;
    leadSources: string;
    leadsTrend: string;
    newLead: string;
    newLeadsCenter: string;
    ownerReviewRequired: string;
    todo: Readonly<{
      completeReadiness: string;
      prepareQuotes: string;
      replyToLeads: string;
      sendFollowUp: string;
      title: string;
    }>;
    title: string;
    viewAll: string;
    viewFullReport: string;
  }>;
  queue: Readonly<{
    description: string;
    title: string;
  }>;
}>;

type DashboardWorkspaceAccessCopy = Readonly<{
  businessNameLabel: string;
  businessNamePlaceholder: string;
  deletionRequestedBody: string;
  deletionRequestedTitle: string;
  eyebrow: string;
  pausedBody: string;
  pausedTitle: string;
  recoverWorkspace: string;
  recoveryHelp: string;
  signedInAs: (email: string) => string;
}>;

type DashboardErrorBoundaryCopy = Readonly<{
  body: string;
  eyebrow: string;
  reload: string;
  title: string;
}>;

type PlanSlug = "founder_pilot" | "paused" | "pro" | "starter";
type SessionTimeoutMode = "after_duration" | "always_on";
type WorkspaceKind = "demo" | "founder_test" | "production_customer" | "seed";
type ActivityFilter =
  | "access"
  | "all"
  | "auth"
  | "cleanup"
  | "notes"
  | "plan"
  | "quote"
  | "system";

type DashboardAdminCopy = Readonly<{
  locale: string;
  accessBlocked: Readonly<{
    backToDashboard: string;
    badge: string;
    description: string;
    eyebrow: string;
    help: string;
    signIn: string;
    title: string;
  }>;
  businesses: Readonly<{
    detail: Readonly<{
      accessControl: Readonly<{
        changeLabel: string;
        description: string;
        onboardingNote: string;
        title: string;
        warning: string;
      }>;
      allChangesNote: string;
      auditLog: Readonly<{
        badgeCount: (count: number) => string;
        description: string;
        emptyState: string;
        lastUpdatedLabel: string;
        notePrefix: string;
        notRecordedYet: string;
        title: string;
        updatedByFounderAdmin: string;
        updatedByLabel: string;
      }>;
      cleanupDryRunCounts: string;
      dailyUse: string;
      fullSystemChangeLog: string;
      internalNote: string;
      nextBadge: string;
      noAdminChanges: string;
      notesDescription: string;
      notesSensitive: string;
      notesTitle: string;
      planControl: Readonly<{
        changeLabel: string;
        description: string;
        pilotNotice: string;
        title: string;
        warning: string;
      }>;
      planLabels: Readonly<Record<PlanSlug, string>>;
      priorityDescription: string;
      priorityTitle: string;
      quoteLinkControl: Readonly<{
        changeLabel: string;
        description: string;
        inactiveNotice: string;
        title: string;
        warning: string;
      }>;
      recentChangesTitle: string;
      recentChangesPanel: Readonly<{
        description: string;
        emptyState: string;
        loggedBadge: (count: number) => string;
        viewFullActivity: string;
      }>;
      recommendedDescription: string;
      recommendationStates: Readonly<{
        activateQuoteLink: string;
        blockedUntilRestored: string;
        holdQuoteLinkDuringOnboarding: string;
        readyForDailyUse: string;
      }>;
      recommendedTitle: string;
      saveAccess: string;
      saveKind: string;
      saveNote: string;
      savePlan: string;
      saveQuoteLink: string;
      snapshotDescription: (businessName: string) => string;
      snapshotTitle: string;
      tiles: Readonly<{
        accessStatus: string;
        accessStatusActiveDescription: string;
        accessStatusLimitedDescription: string;
        auditEvents: string;
        plan: string;
        planDescription: string;
        quoteLink: string;
        quoteLinkActive: string;
        quoteLinkActiveDescription: string;
        quoteLinkInactive: string;
        quoteLinkInactiveDescription: string;
        sessionPolicy: string;
        sessionPolicyAlwaysOnDescription: string;
        sessionPolicyTimedDescription: string;
      }>;
      toolsControlled: string;
      toolsDescription: string;
      toolsTitle: string;
      viewFullCustomerProfile: string;
      whyLabel: string;
      workspaceKind: string;
      workspaceKindHelp: string;
      workspaceKindLabels: Readonly<Record<WorkspaceKind, string>>;
      safetyRail: Readonly<{
        customerWorkspaceDescription: string;
        customerWorkspaceTitle: string;
        dryRunDescription: string;
        dryRunTitle: string;
        guardedBadge: string;
        title: string;
      }>;
    }>;
    emptyWorkspace: string;
    hiddenMatches: (count: number) => string;
    intakeOff: string;
    intakeOpen: string;
    noMatches: string;
    openControls: string;
    operationsDescription: string;
    operationsEyebrow: string;
    operationsTitle: string;
    openInbox: string;
    checkHealth: string;
    manageUsers: string;
    priorityWorkspace: string;
    reset: string;
    searchLabel: string;
    searchPlaceholder: string;
    searchSubmit: string;
    selectedWorkspaceVisible: string;
    subtitle: string;
    title: string;
  }>;
  controls: Readonly<{
    accessNotePlaceholder: string;
    internalNotePlaceholder: string;
    planNotePlaceholder: string;
    quoteLinkNotePlaceholder: string;
    savePolicy: string;
    sessionPolicySummaryAfterDuration: (duration: string) => string;
    sessionPolicySummaryAlwaysOn: string;
    sessionTimeoutDurationLabels: Readonly<Record<number, string>>;
    sessionTimeoutModeLabels: Readonly<Record<SessionTimeoutMode, string>>;
    sessionPolicy: string;
    sessionPolicyHelp: string;
    sessionPolicyNotePlaceholder: string;
    signOutDuration: string;
    workspaceKindNotePlaceholder: string;
  }>;
  routeMessages: Readonly<{
    actionFailed: string;
    updated: string;
  }>;
  tabs: Readonly<{
    ariaLabel: string;
    brandSubtitle: string;
    groups: Readonly<{
      command: string;
      operations: string;
      system: string;
    }>;
    items: Readonly<{
      activity: Readonly<{ description: string; label: string }>;
      businesses: Readonly<{ description: string; label: string }>;
      health: Readonly<{ description: string; label: string }>;
      leads: Readonly<{ description: string; label: string }>;
      overview: Readonly<{ description: string; label: string }>;
      users: Readonly<{ description: string; label: string }>;
    }>;
    snapshots: Readonly<{
      active: string;
      paidReady: string;
      paused: string;
    }>;
  }>;
  theme: Readonly<{
    ariaLabel: string;
  }>;
  topbar: Readonly<{
    badge: string;
    ownerDashboard: string;
    panelTitles: Readonly<{
      activity: string;
      businesses: string;
      health: string;
      leads: string;
      overview: string;
      users: string;
    }>;
    productionCheck: string;
    productionHealthy: string;
  }>;
  overview: Readonly<{
    activityFilters: Readonly<Record<ActivityFilter, string>>;
    activityMeta: Readonly<{
      actionLabels: Readonly<{
        business_cancelled: string;
        business_deletion_requested: string;
        business_reactivated: string;
        business_suspended: string;
        internal_note_added: string;
        password_reset_requested: string;
        plan_changed: string;
        quote_link_disabled: string;
        quote_link_enabled: string;
        session_policy_changed: string;
        status_changed: string;
        temporary_password_set: string;
        test_auth_user_deleted: string;
        test_workspace_cleanup_completed: string;
      }>;
      actorFallback: (id: string) => string;
      emptyValue: string;
      internalNotePresenceChanged: string;
      internalNoteSaved: string;
      leadInboxTarget: string;
      noActivityYet: string;
      noPriorValue: string;
      platformTarget: string;
      stateOff: string;
      stateOn: string;
      systemActor: string;
    }>;
    activitySection: Readonly<{
      badgeCount: (count: number) => string;
      description: string;
      eyebrow: string;
      feedTitle: string;
      title: string;
    }>;
    activitySummary: Readonly<{
      byLabel: string;
      emptyState: string;
      latestBadge: string;
      targetLabel: string;
      title: string;
      viewAll: string;
    }>;
    activityZeroState: string;
    healthSection: Readonly<{
      description: string;
      eyebrow: string;
      healthy: string;
      needsAttention: string;
      notice: string;
      title: string;
    }>;
    leadInboxSection: Readonly<{
      archive: string;
      areaNotSet: string;
      badgeCount: (count: number) => string;
      confirmLeadId: string;
      contactLabel: string;
      deleteAcknowledgement: string;
      deletePermanently: string;
      description: string;
      emptyState: string;
      leadIdLabel: string;
      markReviewed: string;
      noneReferrer: string;
      permanentDeleteTitle: string;
      referrerLabel: string;
      serviceNotSet: string;
      sourceLabel: string;
      statusLabels: Readonly<{
        archived: string;
        reviewed: string;
        submitted: string;
      }>;
      unknownSender: string;
      unknownSource: string;
    }>;
    leadStatusChart: Readonly<{
      ariaLabel: string;
      title: string;
      totalLeads: string;
    }>;
    leadStatusLabels: Readonly<{
      awaitingReply: string;
      completed: string;
      new: string;
      quoteSent: string;
      replyCopied: string;
    }>;
    metricCards: Readonly<{
      activeBusinesses: Readonly<{ detail: string; label: string }>;
      loadedLeads: Readonly<{ detail: string; label: string }>;
      readinessCompleted: Readonly<{ detail: string; label: string }>;
      replyTraces: Readonly<{ detail: string; label: string }>;
      totalUsers: Readonly<{ detail: string; label: string }>;
      usersNeedingAttention: Readonly<{ detail: string; label: string }>;
    }>;
    metricsPanel: Readonly<{
      activePilots: Readonly<{ detail: string; label: string }>;
      authUsers: Readonly<{ detail: string; label: string }>;
      description: string;
      paymentReady: Readonly<{ detail: string; label: string }>;
      pausedAccess: Readonly<{ detail: string; label: string }>;
      title: string;
    }>;
    newUsersNotice: Readonly<{
      confirmed: string;
      daysAgo: (days: number) => string;
      emailPending: string;
      latestBadge: string;
      latestTitle: string;
      newBadge: (count: number) => string;
      newTitle: string;
      noWorkspace: string;
      reviewUsers: string;
      today: string;
    }>;
    newsroom: Readonly<{
      byLabel: string;
      defaultFilterLabel: string;
      description: string;
      emptyState: string;
      noNoteRecorded: string;
      shownBadge: (count: number) => string;
      targetLabel: string;
      title: string;
      viewFullLog: string;
    }>;
    page: Readonly<{
      actions: Readonly<{
        activityLog: string;
        allWorkspaces: string;
        currentSnapshot: string;
      }>;
      description: string;
      eyebrow: string;
      title: string;
    }>;
    productionHealthPanel: Readonly<{
      actionLog: string;
      authRest: string;
      authSdk: string;
      businesses: string;
      deletionRequests: string;
      diagnosticsUnavailable: string;
      fail: string;
      healthy: string;
      keyProject: string;
      keyProjectMatches: string;
      keyProjectMismatch: string;
      keyProjectNotEncoded: string;
      members: string;
      needsAttention: string;
      noStatus: string;
      ok: string;
      productionHealth: string;
      profiles: string;
      quoteLinks: string;
      runtimeDescription: string;
      runtimeUnavailableDescription: string;
      serviceCredentialIssuerRefLabel: string;
      serviceCredentialIssuerRefMismatch: string;
      serviceCredentialKinds: Readonly<{
        jwt_anon: string;
        jwt_other: string;
        jwt_service_role: string;
        missing: string;
        supabase_publishable: string;
        supabase_secret: string;
        unknown: string;
      }>;
      serviceKey: string;
      statusSummary: (sdkStatus: string, restStatus: string) => string;
      supabaseProjectRefLabel: string;
      supabaseTarget: string;
      supabaseTargetCanonical: string;
      supabaseTargetMismatch: string;
      title: string;
    }>;
    recentActionsPanel: Readonly<{
      description: string;
      emptyState: string;
      noNote: string;
      title: string;
    }>;
    systemHealthSummary: Readonly<{
      actionNeeded: string;
      checks: Readonly<{
        adminLog: string;
        authService: string;
        database: string;
        deletionRequests: string;
        profiles: string;
        quoteLinks: string;
      }>;
      needsCheck: string;
      operational: string;
      title: string;
      viewSystemHealth: string;
    }>;
    leadSourceLabels: Readonly<{
      facebook: string;
      google: string;
      instagram: string;
      other: string;
      website: string;
    }>;
    topLeadSourcesTitle: string;
    trackingCards: Readonly<{
      activeLinkCoverage: Readonly<{ detail: string; label: string }>;
      paymentReadyWorkspaces: Readonly<{ detail: string; label: string }>;
      readyQuoteLinks: Readonly<{ detail: string; label: string }>;
      responseTimeTracking: Readonly<{
        detail: string;
        label: string;
        value: string;
      }>;
    }>;
    usersMiniList: Readonly<{
      allUsers: string;
      emptyState: string;
      leadsSuffix: string;
      title: string;
    }>;
  }>;
  users: Readonly<{
    accountSafety: Readonly<{
      description: string;
      doubleConfirm: string;
      protected: string;
      title: string;
    }>;
    accountSupport: Readonly<{
      available: string;
      description: string;
      emergencyDescription: string;
      emergencyLocked: string;
      passwordResetUnavailable: string;
      resetDescription: string;
      resetUnavailableDescription: string;
      restricted: string;
      sendPasswordReset: string;
      title: string;
    }>;
    accessStatusLabel: string;
    accessStatusOptions: Readonly<{
      active: string;
      all: string;
      cancelled: string;
      onboarding: string;
      suspended: string;
      unlinked: string;
    }>;
    authLabel: string;
    authOptions: Readonly<{
      all: string;
      confirmed: string;
      founder: string;
      unconfirmed: string;
    }>;
    capabilityMatrix: Readonly<{
      description: string;
      gateAware: string;
      items: Readonly<{
        customerAccountDeletion: Readonly<{ detail: string; label: string; value: string }>;
        inviteRoleSuspend: Readonly<{ detail: string; label: string; value: string }>;
        leadInboxCleanup: Readonly<{ detail: string; label: string; value: string }>;
        passwordReset: Readonly<{ detail: string; label: string; value: string }>;
        planStatusQuoteLink: Readonly<{ detail: string; label: string; value: string }>;
        syntheticLoginCleanup: Readonly<{ detail: string; label: string; value: string }>;
      }>;
      title: string;
    }>;
    details: string;
    directory: Readonly<{
      businessLabel: string;
      confirmedBadge: string;
      description: string;
      founderBadge: string;
      groupTitles: Readonly<{
        accessStatus: string;
        plan: string;
        priority: string;
      }>;
      lastSignInLabel: string;
      leadsLabel: string;
      loadedCount: (count: number) => string;
      pageSizeOption: (count: number) => string;
      pageSummary: (page: number, totalPages: number) => string;
      phoneLabel: string;
      rangeSummary: (start: number, end: number, total: number) => string;
      searchModeIndexed: string;
      searchModePaged: string;
      shownBadge: (count: number) => string;
      title: string;
      unconfirmedBadge: string;
      userIdLabel: string;
    }>;
    hiddenByFilters: string;
    lockedAccess: Readonly<{
      blocked: string;
      description: string;
      items: Readonly<{
        changeRole: Readonly<{ label: string; reason: string }>;
        inviteMember: Readonly<{ label: string; reason: string }>;
        removeFromWorkspace: Readonly<{ label: string; reason: string }>;
        suspendAccess: Readonly<{ label: string; reason: string }>;
      }>;
      title: string;
    }>;
    next: string;
    noBusinessLinked: string;
    noQuoteLink: string;
    noPlan: string;
    none: string;
    noUsers: string;
    overview: Readonly<{
      actions: Readonly<{
        businesses: string;
        health: string;
      }>;
      description: string;
      eyebrow: string;
      gatedOperations: string;
      metrics: Readonly<{
        authUsersDescription: string;
        authUsersLabel: string;
        noBusinessDescription: string;
        noBusinessLabel: string;
        pausedAccessDescription: string;
        pausedAccessLabel: string;
        unconfirmedDescription: string;
        unconfirmedLabel: string;
      }>;
      operatingRule: Readonly<{
        description: string;
        searchModeIndexed: string;
        searchModeLabel: string;
        searchModePaged: string;
        supportGuard: string;
        title: string;
      }>;
      title: string;
    }>;
    pageAriaLabel: (page: number) => string;
    paginationLabel: string;
    previous: string;
    quoteActive: string;
    quoteInactive: string;
    reset: string;
    searchLabel: string;
    searchPlaceholder: string;
    searchSubmit: string;
    showLabel: string;
    showingRange: (start: number, end: number, total: number) => string;
    workspaceDetail: Readonly<{
      description: string;
      fields: Readonly<{
        business: string;
        membership: string;
        plan: string;
        quoteLink: string;
        role: string;
        workspaceKind: string;
      }>;
      openBusinessControls: string;
      repairNotice: string;
      title: string;
    }>;
    workQueuesDescription: string;
    workQueuesTitle: string;
    showingPerPage: (count: number) => string;
  }>;
}>;

type DashboardFounderHandoffCopy = Readonly<{
  actions: Readonly<{
    adminControls: string;
    openFounderAdmin: string;
    ownerDashboard: string;
    previewQuote: string;
  }>;
  blockedGates: readonly string[];
  description: string;
  emptyState: string;
  eyebrow: string;
  metrics: Readonly<{
    accessibleWorkspacesDetail: string;
    accessibleWorkspacesLabel: string;
    blockedGatesDetail: string;
    blockedGatesLabel: string;
    ownerWorkflowDetail: string;
    ownerWorkflowLabel: string;
    primaryAdminDetail: string;
    primaryAdminLabel: string;
  }>;
  safetyGates: Readonly<{
    description: string;
    title: string;
  }>;
  statuses: Readonly<{
    blocked: string;
    handoff: string;
    next: string;
    ownerScope: string;
    primaryConsole: string;
  }>;
  surfaceMap: Readonly<{
    description: string;
    title: string;
  }>;
  surfaces: Readonly<{
    currentDescription: string;
    currentTitle: string;
    dashboardDescription: string;
    dashboardTitle: string;
    founderAdminDescription: string;
    founderAdminTitle: string;
  }>;
  workspacePreview: Readonly<{
    description: string;
    title: string;
  }>;
}>;

type DashboardFeatureRegistryCopy = Readonly<{
  activationLabel: string;
  categoryLabels: Readonly<Record<FeatureCategory, string>>;
  description: string;
  featureCopy: Readonly<Record<
    FeatureKey,
    Readonly<{
      activation: string;
      name: string;
      ownerGuide: string;
      setup: string;
      summary: string;
      textGuide: string;
      visualGuide: string;
    }>
  >>;
  guideLabels: Readonly<Record<FeatureGuideStatus, string>>;
  guideDetailsLabel: string;
  guidesLabel: string;
  levelLabel: string;
  levelLabels: Readonly<Record<FeatureLevel, string>>;
  ownerLabel: string;
  ownerGuideLabel: string;
  setupLabel: string;
  stateLabels: Readonly<Record<FeatureState, string>>;
  statusLabel: string;
  textGuideLabel: string;
  title: string;
  visualGuideLabel: string;
}>;

type AuthCopy = Readonly<{
  backHome: string;
  businessName: string;
  checkEmailFooter: string;
  checkEmailNotice: string;
  checkEmailResetPassword: string;
  checkEmailSubtitle: string;
  checkEmailTitle: string;
  checkEmailUseAnother: string;
  confirmPassword: string;
  createAccount: string;
  createAccountPending: string;
  createWorkspaceFooter: string;
  createWorkspaceSubtitle: string;
  createWorkspaceTitle: string;
  email: string;
  emailPasswordDivider: string;
  forgotPassword: string;
  forgotPasswordFooter: string;
  forgotPasswordQuestion: string;
  forgotPasswordSubtitle: string;
  forgotPasswordTitle: string;
  googleExistingWorkspaceOnly: string;
  googleSignIn: string;
  googleSignInHelp: string;
  hidePassword: string;
  hidePasswordShort: string;
  name: string;
  needAccount: string;
  needNewResetLink: string;
  newPassword: string;
  ownerAccess: string;
  password: string;
  passwordHelp: string;
  repeatNewPassword: string;
  requestAgain: string;
  routeMessages: Readonly<{
    accountExists: string;
    businessRequired: string;
    checkEmail: string;
    confirmEmail: string;
    emailConfirmed: string;
    emailDelivery: string;
    emailInvalid: string;
    emailRequired: string;
    genericError: string;
    genericNotice: string;
    googleUnavailable: string;
    nameRequired: string;
    newPasswordRequired: string;
    passwordIncorrect: string;
    passwordMismatch: string;
    passwordRequired: string;
    passwordReuse: string;
    passwordUpdated: string;
    rateLimit: string;
    reload: string;
    resetInvalid: string;
    resetInstructions: string;
    signInFailed: string;
    signUpFailed: string;
    strongPassword: string;
  }>;
  resetInvalid: string;
  resetPasswordFooter: string;
  resetPasswordReuseHelp: string;
  resetPasswordSubtitle: string;
  resetPasswordTitle: string;
  resetPreparing: string;
  resetRequestPending: string;
  resetRequestSubmit: string;
  signIn: string;
  signInFooter: string;
  signInPending: string;
  signInQuestion: string;
  signInSubtitle: string;
  signInTitle: string;
  showPassword: string;
  showPasswordShort: string;
  updatePassword: string;
  updatePasswordPending: string;
  yourBusiness: string;
  yourName: string;
}>;

type DashboardCopy = Readonly<{
  actions: Readonly<{
    copyFailed: string;
    copyQuoteLink: string;
    copySuccess: string;
    displaySettings: string;
    moreActions: string;
    openLeadQueue: string;
    previewPublicPage: string;
    previewQuotePage: string;
    saveConfiguration: string;
    signOut: string;
  }>;
  admin: DashboardAdminCopy;
  businessProfile: DashboardBusinessProfileCopy;
  configuration: DashboardConfigurationCopy;
  errorBoundary: DashboardErrorBoundaryCopy;
  founderHandoff: DashboardFounderHandoffCopy;
  guide: DashboardGuideCopy;
  leadDetail: DashboardLeadDetailCopy;
  leadQueue: DashboardLeadQueueCopy;
  leadsPage: DashboardLeadsPageCopy;
  overview: DashboardOverviewCopy;
  routeGuide: DashboardRouteGuideCopy;
  routeMessages: Readonly<{
    genericError: string;
    genericNotice: string;
  }>;
  nav: Readonly<{
    businessProfile: string;
    groupCommand: string;
    groupControl: string;
    groupSetup: string;
    guide: string;
    leads: string;
    overview: string;
    ownerWorkspace: string;
    quoteSetup: string;
    settings: string;
    workspaceSubtitle: string;
  }>;
  pages: Readonly<{
    businessProfile: PageContextCopy;
    configuration: PageContextCopy;
    dashboard: PageContextCopy;
    founder: PageContextCopy;
    guide: PageContextCopy;
    leadDetail: PageContextCopy;
    leads: PageContextCopy;
    settings: PageContextCopy;
  }>;
  readinessTasks: Readonly<Record<
    | "branding"
    | "business_profile"
    | "cleaning_template"
    | "consent"
    | "faqs"
    | "privacy"
    | "service_areas"
    | "services",
    string
  >>;
  settings: Readonly<{
    account: string;
    billing: string;
    business: string;
    displayPreferences: Readonly<{
      densityLabel: string;
      densityOptions: Readonly<Record<"compact" | "comfortable" | "spacious", string>>;
      description: string;
      guideLabel: string;
      guideOptions: Readonly<Record<"expanded" | "minimal" | "standard", string>>;
      insightLabel: string;
      insightOptions: Readonly<Record<"hidden" | "standard", string>>;
      localOnly: string;
      reset: string;
      title: string;
    }>;
    featureRegistry: DashboardFeatureRegistryCopy;
    future: string;
    futureSections: string;
    futureSectionsDescription: string;
    futureSectionHints: Readonly<{
      billing: string;
      integrations: string;
      teamMembers: string;
    }>;
    guardrails: string;
    guardrailsDescription: string;
    guardrailItems: readonly string[];
    integrations: string;
    language: string;
    languageDescription: string;
    languageHelp: string;
    lifecycle: Readonly<{
      deletionIneligibleBody: string;
      deletionIneligibleTitle: string;
      description: string;
      lifecycleStatus: string;
      lockBehavior: string;
      lockBehaviorDescription: string;
      title: string;
    }>;
    sessionPolicy: Readonly<{
      afterDuration: (minutes: number) => string;
      alwaysOn: string;
      description: string;
      managedByFounder: string;
      title: string;
    }>;
    systemHistory: Readonly<{
      actions: Readonly<Record<string, string>>;
      changeFallback: string;
      description: string;
      emptyBody: string;
      emptyTitle: string;
      noteLabel: string;
      title: string;
      traceLabel: string;
    }>;
    deletionForm: Readonly<{
      acknowledgement: string;
      body: string;
      dataNotice: string;
      dangerZone: string;
      submit: string;
      title: string;
      typeBusinessName: string;
    }>;
    manualBilling: string;
    notInMvp: string;
    plan: string;
    quickLinks: string;
    signedInAs: string;
    teamMembers: string;
    theme: string;
    themeDescription: string;
    themeHelp: string;
    workspace: string;
    workspaceDescription: string;
  }>;
  status: Readonly<{
    active: string;
    done: string;
    open: string;
    pilot: string;
  }>;
  theme: Readonly<{
    dark: string;
    label: string;
    light: string;
    system: string;
  }>;
  workspaceAccess: DashboardWorkspaceAccessCopy;
}>;

export type BizPilotCopy = Readonly<{
  aiFallback: AiFallbackCopy;
  auth: AuthCopy;
  dashboard: DashboardCopy;
  demo: DemoCopy;
  globalError: GlobalErrorCopy;
  intakeErrors: IntakeErrorCopy;
  leadRules: LeadRuleCopy;
  missingInfoLabels: Record<string, string>;
  optionLabels: Record<string, string>;
  quoteFields: Record<string, QuoteFieldCopy>;
  quoteForm: Readonly<{
    aiDisclosure: string;
    consentNoticeDefault: string;
    emptySection: string;
    guardrail: string;
    selectPlaceholder: string;
    submitButton: string;
    stepProgress: (index: number, total: number, label: string) => string;
    steps: ReadonlyArray<QuoteStepCopy>;
  }>;
  quotePage: Readonly<{
    badge: string;
    description: string;
    languageMenuLabel: string;
    ownerUnavailableBody: string;
    ownerUnavailableCta: string;
    ownerUnavailableTitle: string;
    subtitle: string;
    unavailableBody: string;
    unavailableCta: string;
    unavailableSubtitle: string;
    unavailableTitle: string;
  }>;
  quoteSuccess: Readonly<{
    backHome: string;
    body: string;
    footer: (businessName: string | null) => string;
    meta: MetaCopy;
    nextTitle: string;
    requestSent: string;
    submitAnother: string;
    title: (businessName: string | null) => string;
    steps: (businessName: string | null) => string[];
  }>;
}>;

export const BIZPILOT_COPY_SOURCE_LANGUAGE = DEFAULT_LANGUAGE;

export const bizPilotCopyNamespaces = [
  "quotePage",
  "auth",
  "dashboard",
  "quoteForm",
  "quoteSuccess",
  "quoteFields",
  "optionLabels",
  "intakeErrors",
  "leadRules",
  "aiFallback",
  "demo",
  "globalError",
  "missingInfoLabels",
] as const satisfies readonly (keyof BizPilotCopy)[];

const englishCopy: BizPilotCopy = {
  aiFallback: {
    areaFallback: "your area",
    askMissingDetails: "Ask for the missing quote details.",
    followUpDraft: (service, area) =>
      `Hi, just following up on your ${service} quote request for ${area}. If you still need help, send me any missing details and I can help move this forward.`,
    leadSummary: (qualityLevel, service, area) =>
      `This is a ${qualityLevel} ${service} quote request for ${area}.`,
    missingNone: "I have the key details needed to reply.",
    missingText: (missing) =>
      missing.length > 0
        ? `I need a few details first: ${missing.join(", ")}.`
        : englishCopy.aiFallback.missingNone,
    replyDraft: (service, missingText) =>
      `Hi, thanks for reaching out about ${service}. ${missingText} Once I have that, I can review the request and follow up with the next step.`,
    replyWarmLead: "Reply now while the lead is warm.",
    serviceFallback: "cleaning",
    toneConcise: (service, missingText) =>
      `Thanks for the ${service} request. ${missingText}`,
    toneFriendly: (service, missingText) =>
      `Hi, thanks so much for reaching out about ${service}. ${missingText}`,
  },
  auth: {
    backHome: "Back home",
    businessName: "Business name",
    checkEmailFooter:
      "Confirmation and reset links are handled through secure BizPilot auth email.",
    checkEmailNotice:
      "If this email can create a new workspace, we'll send confirmation instructions. If you've used this email before, sign in or reset your password.",
    checkEmailResetPassword: "Reset password",
    checkEmailSubtitle:
      "We'll send the next step only when this email can create a new BizPilot workspace.",
    checkEmailTitle: "Next steps",
    checkEmailUseAnother: "Use another email",
    confirmPassword: "Confirm password",
    createAccount: "Create owner access",
    createAccountPending: "Creating owner access...",
    createWorkspaceFooter:
      "Owner access for cleaning businesses already onboarded to BizPilot AI.",
    createWorkspaceSubtitle:
      "Create your BizPilot workspace only if you've been invited or approved for pilot access.",
    createWorkspaceTitle: "Create owner access",
    email: "Email",
    emailPasswordDivider: "or use email",
    forgotPassword: "Forgot password?",
    forgotPasswordFooter:
      "Password reset is handled through Supabase Auth email recovery.",
    forgotPasswordQuestion: "Remembered your password?",
    forgotPasswordSubtitle:
      "Enter your owner email and we'll send reset instructions if an account exists.",
    forgotPasswordTitle: "Reset password",
    googleExistingWorkspaceOnly:
      "Google is for already approved owner accounts with an existing workspace. To create a new workspace, use the email form below.",
    googleSignIn: "Continue with Google",
    googleSignInHelp:
      "Login only. BizPilot does not request Gmail access and does not create a workspace from Google.",
    hidePassword: "Hide password",
    hidePasswordShort: "Hide",
    name: "Name",
    needAccount: "Approved for pilot access but haven't created your login?",
    needNewResetLink: "Need a new reset link?",
    newPassword: "New password",
    ownerAccess: "Owner access",
    password: "Password",
    passwordHelp: "Use at least 8 characters for your password.",
    repeatNewPassword: "Repeat your new password",
    requestAgain: "Request again",
    routeMessages: {
      accountExists: "An account with this email already exists. Sign in instead.",
      businessRequired: "Enter your business name.",
      checkEmail: "Email confirmed. Please sign in to continue.",
      confirmEmail: "Confirm your email before signing in.",
      emailConfirmed: "Email confirmed. Continue to your workspace.",
      emailDelivery:
        "We couldn't send the confirmation email. Please wait a few minutes and try again.",
      emailInvalid: "Enter a valid email address.",
      emailRequired: "Enter your email address.",
      genericError: "We couldn't complete that request. Check the form and try again.",
      genericNotice: "Your account update was received.",
      googleUnavailable:
        "Google sign-in is not ready yet. Use email and password or ask the founder to enable it.",
      nameRequired: "Enter your name.",
      newPasswordRequired: "Enter your new password.",
      passwordIncorrect: "Email or password is incorrect.",
      passwordMismatch: "Passwords do not match.",
      passwordRequired: "Enter your password.",
      passwordReuse:
        "You can't reuse your previous password. Choose a new password you have not used for this account.",
      passwordUpdated: "Password updated. Sign in with your new password.",
      rateLimit: "Too many attempts. Please wait a few minutes and try again.",
      reload: "Reload the page and try again.",
      resetInvalid:
        "This reset link is invalid or expired. Request a new password reset.",
      resetInstructions:
        "If an account exists, we'll send reset instructions.",
      signInFailed: "We couldn't sign you in. Please try again.",
      signUpFailed: "We couldn't create your account. Please try again.",
      strongPassword: "Use a stronger password with at least 8 characters.",
    },
    resetInvalid:
      "This reset link is invalid or expired. Request a new password reset.",
    resetPasswordFooter: "Use a new password that is unique to BizPilot.",
    resetPasswordReuseHelp:
      "Choose a new password. You cannot reuse your previous password.",
    resetPasswordSubtitle:
      "Choose a new password for your owner workspace.",
    resetPasswordTitle: "Set new password",
    resetPreparing: "Preparing your secure reset session...",
    resetRequestPending: "Sending instructions...",
    resetRequestSubmit: "Send reset instructions",
    signIn: "Sign in",
    signInFooter: "Secure owner access for your BizPilot AI workspace.",
    signInPending: "Opening workspace...",
    signInQuestion: "Already have an account?",
    signInSubtitle:
      "Manage quote requests, AI reply drafts you approve, and manual follow-up from your BizPilot workspace.",
    signInTitle: "Sign in",
    showPassword: "Show password",
    showPasswordShort: "Show",
    updatePassword: "Update password",
    updatePasswordPending: "Updating password...",
    yourBusiness: "Your business",
    yourName: "Your name",
  },
  globalError: {
    body:
      "BizPilot caught a safe runtime error. Reload the page to try again without exposing internal details.",
    eyebrow: "BizPilot",
    reload: "Reload page",
    title: "This page needs a refresh.",
  },
  dashboard: {
    actions: {
      copyFailed: "Copy failed",
      copyQuoteLink: "Copy quote link",
      copySuccess: "Copied",
      displaySettings: "Display settings",
      moreActions: "Actions",
      openLeadQueue: "Open Lead Queue",
      previewPublicPage: "Preview public page",
      previewQuotePage: "Preview quote page",
      saveConfiguration: "Save configuration",
      signOut: "Sign out",
    },
    admin: {
      locale: "en-US",
      accessBlocked: {
        backToDashboard: "Back to dashboard",
        badge: "Internal only",
        description:
          "This console is reserved for founder operations and requires an explicit email allowlist.",
        eyebrow: "Founder Admin",
        help:
          "Set `BIZPILOT_FOUNDER_EMAILS` on the server to the approved founder email list, then sign in with one of those accounts.",
        signIn: "Sign in",
        title: "Access unavailable",
      },
      businesses: {
        detail: {
          accessControl: {
            changeLabel: "Change access to",
            description:
              "Controls sign-in eligibility, dashboard access, and the customer lifecycle state shown to founder operations.",
            onboardingNote:
              "Onboarding restricts full access until setup is complete.",
            title: "Access status",
            warning:
              "Suspended or cancelled states block customer-facing access. Use them only when the account should stop operating.",
          },
          allChangesNote:
            "All changes are manual, traceable, and reversible by the founder. Use controls with operational awareness.",
          auditLog: {
            badgeCount: (count) => `${count} logged`,
            description:
              "Owner-visible trail for founder/admin changes, with trace IDs for support verification.",
            emptyState: "No system changes logged for this customer yet.",
            lastUpdatedLabel: "Last updated",
            notePrefix: "Note",
            notRecordedYet: "Not recorded yet",
            title: "Customer system change log",
            updatedByFounderAdmin: "Founder Admin",
            updatedByLabel: "Updated by",
          },
          cleanupDryRunCounts: "Cleanup dry run counts",
          dailyUse: "Daily use",
          fullSystemChangeLog: "Full system change log",
          internalNote: "Internal note",
          nextBadge: "Next",
          noAdminChanges: "No admin changes recorded yet.",
          notesDescription:
            "Record context, run cleanup, then review the change trail.",
          notesSensitive: "Sensitive",
          notesTitle: "3) Notes, cleanup, and audit",
          planControl: {
            changeLabel: "Change plan to",
            description:
              "Founder/admin controlled billing tier. Customers should not self-change this state from their dashboard.",
            pilotNotice:
              "Pilot plan limits usage and supports controlled rollout.",
            title: "Plan",
            warning:
              "Plan changes affect founder reporting and manual billing readiness. Record why the customer is moving tiers.",
          },
          planLabels: {
            founder_pilot: "Founder Pilot",
            paused: "Paused",
            pro: "Pro",
            starter: "Starter",
          },
          priorityDescription: "Change access, plan, and intake state first.",
          priorityTitle: "1) Priority controls",
          quoteLinkControl: {
            changeLabel: "Change quote link to",
            description:
              "Controls whether the public quote form can accept new leads for this customer.",
            inactiveNotice:
              "Inactive link blocks all incoming public quote submissions.",
            title: "Public quote link",
            warning:
              "If inactive, the public quote form is blocked and the customer cannot receive new leads from the public intake page.",
          },
          recentChangesTitle: "Recent admin changes",
          recentChangesPanel: {
            description: "Founder/admin action trail for support verification.",
            emptyState: "No admin changes recorded yet.",
            loggedBadge: (count) => `${count} logged`,
            viewFullActivity: "View full activity log",
          },
          recommendedDescription: "Based on current access and quote-link state.",
          recommendationStates: {
            activateQuoteLink:
              "Activate the public quote link so the customer can receive new leads.",
            blockedUntilRestored:
              "Customer and public access should stay blocked until the account is intentionally restored.",
            holdQuoteLinkDuringOnboarding:
              "Keep the public quote form inactive until onboarding is complete and the customer is ready.",
            readyForDailyUse: "Business is ready for daily use.",
          },
          recommendedTitle: "Recommended next action",
          saveAccess: "Save access",
          saveKind: "Save kind",
          saveNote: "Save note",
          savePlan: "Save plan",
          saveQuoteLink: "Save quote link",
          snapshotDescription: (businessName) =>
            `Operational summary at a glance for ${businessName}.`,
          snapshotTitle: "Business snapshot",
          tiles: {
            accessStatus: "Access status",
            accessStatusActiveDescription:
              "Customer has daily dashboard access.",
            accessStatusLimitedDescription:
              "Limited dashboard access and lifecycle readiness.",
            auditEvents: "Audit events",
            plan: "Plan",
            planDescription:
              "Plan is founder controlled. Customer cannot change plan.",
            quoteLink: "Quote link",
            quoteLinkActive: "Active",
            quoteLinkActiveDescription:
              "Public quote form can accept new leads.",
            quoteLinkInactive: "Inactive",
            quoteLinkInactiveDescription:
              "Public quote form is blocked. No new leads can enter.",
            sessionPolicy: "Session policy",
            sessionPolicyAlwaysOnDescription:
              "Customer access stays active until sign-out.",
            sessionPolicyTimedDescription:
              "Customer sessions expire after the selected duration.",
          },
          toolsControlled: "Controlled",
          toolsDescription:
            "Use these when setup, session, or cleanup state is wrong.",
          toolsTitle: "2) Workspace tools",
          viewFullCustomerProfile: "View full customer profile",
          whyLabel:
            "Why: keeps customer experience clean and prevents incomplete lead intake.",
          workspaceKind: "Workspace kind",
          workspaceKindHelp:
            "Mark only confirmed synthetic/internal workspaces as Founder test, Demo, or Seed before cleanup.",
          workspaceKindLabels: {
            demo: "Demo",
            founder_test: "Founder test",
            production_customer: "Production customer",
            seed: "Seed",
          },
          safetyRail: {
            customerWorkspaceDescription:
              "Hard cleanup and synthetic/test login cleanup are blocked for production-customer workspaces and owner accounts.",
            customerWorkspaceTitle: "Customer workspace is protected",
            dryRunDescription:
              "Test/demo cleanup requires counts, acknowledgement, and exact business name or slug confirmation.",
            dryRunTitle: "Dry-run comes first",
            guardedBadge: "Guarded",
            title: "Cleanup safety",
          },
        },
        emptyWorkspace: "No business workspace is available yet.",
        hiddenMatches: (count) =>
          `Showing the first 10 matched workspaces. ${count} more matched ${count === 1 ? "workspace is" : "workspaces are"} hidden. Search by owner, business, or slug to narrow the list.`,
        intakeOff: "Intake off",
        intakeOpen: "Intake open",
        noMatches: "No businesses match this search.",
        openControls: "Open controls",
        operationsDescription:
          "Founder command center for pilot access, quote links, plan state, workspace safety, customer notes, and audit trails.",
        operationsEyebrow: "Founder Admin",
        operationsTitle: "Business Operations",
        openInbox: "Open inbox",
        checkHealth: "Check health",
        manageUsers: "Manage users",
        priorityWorkspace: "Priority workspace",
        reset: "Reset",
        searchLabel: "Search businesses",
        searchPlaceholder: "Business, owner, slug",
        searchSubmit: "Search",
        selectedWorkspaceVisible:
          "Selected workspace stays visible even when it does not match the current search.",
        subtitle: "Select one workspace; edit it in the detail panel.",
        title: "Businesses",
      },
      controls: {
        accessNotePlaceholder: "Optional access note",
        internalNotePlaceholder:
          "Objection, setup state, next founder follow-up",
        planNotePlaceholder: "Optional plan note",
        quoteLinkNotePlaceholder: "Optional quote link note",
        savePolicy: "Save policy",
        sessionPolicySummaryAfterDuration: (duration) => `Sign out after ${duration}`,
        sessionPolicySummaryAlwaysOn: "Always on",
        sessionTimeoutDurationLabels: {
          15: "15 minutes",
          30: "30 minutes",
          60: "1 hour",
          240: "4 hours",
          480: "8 hours",
          720: "12 hours",
          1440: "24 hours",
          10080: "7 days",
        },
        sessionTimeoutModeLabels: {
          after_duration: "Sign out after duration",
          always_on: "Always on",
        },
        sessionPolicy: "Session policy",
        sessionPolicyHelp:
          "Checked on the next dashboard request. Every policy edit is written to the customer system log.",
        sessionPolicyNotePlaceholder: "Reason owner can trace later",
        signOutDuration: "Sign-out duration",
        workspaceKindNotePlaceholder: "Why this is safe",
      },
      routeMessages: {
        actionFailed: "Founder admin action could not be completed.",
        updated: "Done. The admin workspace has been updated.",
      },
      tabs: {
        ariaLabel: "Admin sections",
        brandSubtitle: "Founder operations",
        groups: {
          command: "Command",
          operations: "Operations",
          system: "System",
        },
        items: {
          activity: {
            description: "Audit trail",
            label: "Activity",
          },
          businesses: {
            description: "Workspace controls",
            label: "Businesses",
          },
          health: {
            description: "Runtime checks",
            label: "Health",
          },
          leads: {
            description: "Lead review and cleanup",
            label: "Leads",
          },
          overview: {
            description: "Read-only command view",
            label: "Overview",
          },
          users: {
            description: "Search, support, gated tools",
            label: "Users",
          },
        },
        snapshots: {
          active: "Active",
          paidReady: "Paid-ready",
          paused: "Paused",
        },
      },
      theme: {
        ariaLabel: "Founder admin theme",
      },
      topbar: {
        badge: "Founder admin",
        ownerDashboard: "Owner dashboard",
        panelTitles: {
          activity: "Activity Log",
          businesses: "Businesses",
          health: "Production Health",
          leads: "Admin Inbox",
          overview: "Admin Overview",
          users: "Users",
        },
        productionCheck: "Production: check",
        productionHealthy: "Production: healthy",
      },
      overview: {
        activityFilters: {
          access: "Access",
          all: "All",
          auth: "Auth",
          cleanup: "Cleanup",
          notes: "Notes",
          plan: "Plan",
          quote: "Quote",
          system: "System",
        },
        activityMeta: {
          actionLabels: {
            business_cancelled: "Business cancelled",
            business_deletion_requested: "Deletion requested",
            business_reactivated: "Business reactivated",
            business_suspended: "Business suspended",
            internal_note_added: "Internal note saved",
            password_reset_requested: "Password reset requested",
            plan_changed: "Plan changed",
            quote_link_disabled: "Quote link disabled",
            quote_link_enabled: "Quote link enabled",
            session_policy_changed: "Session policy changed",
            status_changed: "Workspace status changed",
            temporary_password_set: "Temporary password set",
            test_auth_user_deleted: "Test auth user deleted",
            test_workspace_cleanup_completed: "Test workspace cleanup",
          },
          actorFallback: (id) => `Actor ${id}`,
          emptyValue: "empty",
          internalNotePresenceChanged: "Internal note presence changed",
          internalNoteSaved: "Internal note saved",
          leadInboxTarget: "Lead inbox",
          noActivityYet: "No activity yet",
          noPriorValue: "no prior value",
          platformTarget: "Platform",
          stateOff: "off",
          stateOn: "on",
          systemActor: "System",
        },
        activitySection: {
          badgeCount: (count) => `${count} logged`,
          description:
            "Trace founder-admin writes after authorization. Use this as the review trail for support, cleanup, and access changes.",
          eyebrow: "Founder Admin",
          feedTitle: "Activity command feed",
          title: "Activity Log",
        },
        activitySummary: {
          byLabel: "By",
          emptyState: "No admin actions logged yet.",
          latestBadge: "Latest",
          targetLabel: "on",
          title: "Recent Activities",
          viewAll: "View all activities",
        },
        activityZeroState: "No admin actions logged yet.",
        healthSection: {
          description:
            "Read-only production diagnostics for founder operations. Failed checks explain why admin counts can look empty or incomplete.",
          eyebrow: "Founder Admin",
          healthy: "Healthy",
          needsAttention: "Needs attention",
          notice:
            "Founder data may be incomplete because one or more production runtime checks failed. Treat zero users or zero businesses as diagnostic until this panel is clean.",
          title: "Production Health",
        },
        leadInboxSection: {
          archive: "Archive",
          areaNotSet: "Area not set",
          badgeCount: (count) => `${count} inbox items`,
          confirmLeadId: "Type Lead ID to confirm",
          contactLabel: "Contact",
          deleteAcknowledgement: "I understand this delete is permanent.",
          deletePermanently: "Delete permanently",
          description:
            "Incoming user quote messages for founder triage. Review, archive, or permanently delete spam/test submissions.",
          emptyState: "No inbox items yet.",
          leadIdLabel: "Lead ID",
          markReviewed: "Mark reviewed",
          noneReferrer: "none",
          permanentDeleteTitle: "Permanent delete (cannot be undone)",
          referrerLabel: "Referrer",
          serviceNotSet: "Service not set",
          sourceLabel: "Source",
          statusLabels: {
            archived: "Archived",
            reviewed: "Reviewed",
            submitted: "Submitted",
          },
          unknownSender: "Unknown sender",
          unknownSource: "unknown",
        },
        leadStatusChart: {
          ariaLabel: "Leads by status",
          title: "Leads by Status",
          totalLeads: "Total Leads",
        },
        leadStatusLabels: {
          awaitingReply: "Awaiting Reply",
          completed: "Completed",
          new: "New",
          quoteSent: "Quote Sent",
          replyCopied: "Reply copied",
        },
        metricCards: {
          activeBusinesses: {
            detail: "Active or onboarding workspaces.",
            label: "Active Businesses",
          },
          loadedLeads: {
            detail: "Loaded lead signals.",
            label: "Loaded Leads",
          },
          readinessCompleted: {
            detail: "Active public quote links.",
            label: "Readiness Completed",
          },
          replyTraces: {
            detail:
              "Leads or admin actions with reply-related status; no send is implied.",
            label: "Reply Traces",
          },
          totalUsers: {
            detail: "Auth users in founder search.",
            label: "Total Users",
          },
          usersNeedingAttention: {
            detail: "Support-priority users.",
            label: "Users Needing Attention",
          },
        },
        metricsPanel: {
          activePilots: {
            detail: "Onboarding or active businesses.",
            label: "Active pilots",
          },
          authUsers: {
            detail: "Auth users available through paged founder search.",
            label: "Auth users",
          },
          description:
            "High-level counts stay here as a compact snapshot instead of occupying the workspace.",
          paymentReady: {
            detail: "Starter or Pro manual plans.",
            label: "Payment-ready",
          },
          pausedAccess: {
            detail: "Suspended or cancelled access.",
            label: "Paused access",
          },
          title: "Workspace snapshot",
        },
        newUsersNotice: {
          confirmed: "Confirmed",
          daysAgo: (days) => `${days}d ago`,
          emailPending: "Email pending",
          latestBadge: "Latest",
          latestTitle: "Latest user activity",
          newBadge: (count) => `${count} new`,
          newTitle: "New users detected",
          noWorkspace: "No workspace",
          reviewUsers: "Review users",
          today: "Today",
        },
        newsroom: {
          byLabel: "By:",
          defaultFilterLabel: "System",
          description:
            "Latest founder/admin changes with actor, target, category, timestamp, and direct review links.",
          emptyState: "No matching admin actions yet.",
          noNoteRecorded: "No note recorded",
          shownBadge: (count) => `${count} shown`,
          targetLabel: "Target:",
          title: "Admin newsroom",
          viewFullLog: "View full log",
        },
        page: {
          actions: {
            activityLog: "Activity log",
            allWorkspaces: "All workspaces",
            currentSnapshot: "Current snapshot",
          },
          description:
            "Monitor users, workspaces, lead flow, readiness, health, and recent founder actions from one read-only command view.",
          eyebrow: "Founder Admin",
          title: "Admin Overview",
        },
        productionHealthPanel: {
          actionLog: "Action log",
          authRest: "Auth REST",
          authSdk: "Auth SDK",
          businesses: "Businesses",
          deletionRequests: "Deletion requests",
          diagnosticsUnavailable: "Founder runtime diagnostics are unavailable.",
          fail: "Fail",
          healthy: "Healthy",
          keyProject: "Key project",
          keyProjectMatches: "Matches",
          keyProjectMismatch: "Mismatch",
          keyProjectNotEncoded: "Not encoded",
          members: "Members",
          needsAttention: "Needs attention",
          noStatus: "n/a",
          ok: "OK",
          productionHealth: "Production health",
          profiles: "Profiles",
          quoteLinks: "Quote links",
          runtimeDescription:
            "Runtime health could not be loaded without exposing internals.",
          runtimeUnavailableDescription:
            "Read-only runtime diagnostics for Supabase targets, auth reachability, and founder-admin data dependencies.",
          serviceCredentialIssuerRefLabel: "Service credential issuer ref",
          serviceCredentialIssuerRefMismatch:
            "(does not match Supabase target)",
          serviceCredentialKinds: {
            jwt_anon: "JWT anon",
            jwt_other: "JWT non-service",
            jwt_service_role: "JWT service",
            missing: "Missing",
            supabase_publishable: "Publishable",
            supabase_secret: "Secret",
            unknown: "Unknown",
          },
          serviceKey: "Service key",
          statusSummary: (sdkStatus, restStatus) =>
            `Auth status: SDK ${sdkStatus} / REST ${restStatus}`,
          supabaseProjectRefLabel: "Supabase project ref",
          supabaseTarget: "Supabase target",
          supabaseTargetCanonical: "Canonical",
          supabaseTargetMismatch: "Mismatch",
          title: "Production health",
        },
        recentActionsPanel: {
          description: "Service-role writes after founder authorization.",
          emptyState: "No admin actions logged yet.",
          noNote: "No note",
          title: "Recent admin actions",
        },
        systemHealthSummary: {
          actionNeeded: "Check",
          checks: {
            adminLog: "Admin log",
            authService: "Auth service",
            database: "Database",
            deletionRequests: "Deletion requests",
            profiles: "Profiles",
            quoteLinks: "Quote links",
          },
          needsCheck: "Needs check",
          operational: "Operational",
          title: "System Health",
          viewSystemHealth: "View system health",
        },
        leadSourceLabels: {
          facebook: "Facebook",
          google: "Google",
          instagram: "Instagram",
          other: "Other",
          website: "Website",
        },
        topLeadSourcesTitle: "Top Lead Sources",
        trackingCards: {
          activeLinkCoverage: {
            detail: "Active quote links over total businesses.",
            label: "Active Link Coverage",
          },
          paymentReadyWorkspaces: {
            detail: "Payment-ready plans over total businesses.",
            label: "Payment-Ready Workspaces",
          },
          readyQuoteLinks: {
            detail: "Non-cancelled workspaces with an active public quote link.",
            label: "Ready Quote Links",
          },
          responseTimeTracking: {
            detail:
              "Requires real owner workflow timestamps before pilot reporting.",
            label: "Response Time Tracking",
            value: "Not enabled",
          },
        },
        usersMiniList: {
          allUsers: "All users",
          emptyState: "No users loaded yet.",
          leadsSuffix: "leads",
          title: "Users",
        },
      },
      users: {
        accountSafety: {
          description:
            "Synthetic/test login cleanup only. Customer-protected accounts remain locked.",
          doubleConfirm: "Double confirm",
          protected: "Protected",
          title: "Account safety and cleanup",
        },
        accountSupport: {
          available: "Available",
          description:
            "Founder-only auth support. Prefer reset email over temporary passwords.",
          emergencyDescription:
            "Temporary password setting is emergency-only and is intentionally not exposed in the console. Use reset email unless a separate support incident is approved.",
          emergencyLocked: "Emergency password locked",
          passwordResetUnavailable: "Password reset unavailable",
          resetDescription:
            "Sends a Supabase reset email to the target account and logs a trace. No password is printed or stored here.",
          resetUnavailableDescription:
            "Password reset is disabled for founder accounts or accounts without an email address.",
          restricted: "Restricted",
          sendPasswordReset: "Send password reset",
          title: "Account support",
        },
        accessStatusLabel: "Access status",
        accessStatusOptions: {
          active: "Active access",
          all: "All users",
          cancelled: "Cancelled",
          onboarding: "Onboarding",
          suspended: "Suspended",
          unlinked: "No business linked",
        },
        authLabel: "Auth",
        authOptions: {
          all: "All auth states",
          confirmed: "Confirmed email",
          founder: "Founder accounts",
          unconfirmed: "Unconfirmed email",
        },
        capabilityMatrix: {
          description:
            "Operational capability map for founder/admin work. Destructive and access-changing actions stay explicit.",
          gateAware: "Gate-aware",
          items: {
            customerAccountDeletion: {
              detail:
                "Real customer account deletion needs backup, proof, and approval.",
              label: "Customer account deletion",
              value: "Blocked",
            },
            inviteRoleSuspend: {
              detail:
                "Requires owner-approved schema/RLS and last-owner protection.",
              label: "Invite / role / suspend",
              value: "Blocked",
            },
            leadInboxCleanup: {
              detail: "Review/archive and exact-ID hard delete for spam/test leads.",
              label: "Lead inbox cleanup",
              value: "Guarded",
            },
            passwordReset: {
              detail:
                "Sends a reset email; founder accounts stay protected in the UI.",
              label: "Password reset",
              value: "Available",
            },
            planStatusQuoteLink: {
              detail: "Founder-only, audited business controls.",
              label: "Plan, status, quote link",
              value: "Active",
            },
            syntheticLoginCleanup: {
              detail:
                "Exact email/ID confirmation; customer-protected users are blocked.",
              label: "Synthetic login cleanup",
              value: "Guarded",
            },
          },
          title: "Admin capability matrix",
        },
        details: "Details",
        directory: {
          businessLabel: "Business",
          confirmedBadge: "Confirmed",
          description:
            "Search first, then expand one user for account, workspace, and gated support tools.",
          founderBadge: "Founder",
          groupTitles: {
            accessStatus: "Access status",
            plan: "Plan",
            priority: "Priority",
          },
          lastSignInLabel: "Last sign-in",
          leadsLabel: "Leads",
          loadedCount: (count) => `${count} loaded`,
          pageSizeOption: (count) => `${count} users`,
          pageSummary: (page, totalPages) => `Page ${page} / ${totalPages}`,
          phoneLabel: "Phone",
          rangeSummary: (start, end, total) => `Showing ${start}-${end} of ${total}`,
          searchModeIndexed: "Search indexed",
          searchModePaged: "Paged",
          shownBadge: (count) => `${count} shown`,
          title: "User directory",
          unconfirmedBadge: "Unconfirmed",
          userIdLabel: "User ID",
        },
        hiddenByFilters: "Some loaded users are hidden by access/auth filters.",
        lockedAccess: {
          blocked: "Blocked",
          description: "Requires owner-approved security gate.",
          items: {
            changeRole: {
              label: "Change role",
              reason:
                "Needs owner-approved role policy and last-owner protection.",
            },
            inviteMember: {
              label: "Invite member",
              reason: "Needs team-member schema and invite audit flow.",
            },
            removeFromWorkspace: {
              label: "Remove from workspace",
              reason:
                "Needs membership audit, ownership checks, and recovery path.",
            },
            suspendAccess: {
              label: "Suspend access",
              reason:
                "Needs reversible access state and customer-facing notice.",
            },
          },
          title: "Access management",
        },
        next: "Next",
        noBusinessLinked: "No business linked",
        noQuoteLink: "No quote link",
        noPlan: "No plan",
        none: "None",
        noUsers: "No users found.",
        overview: {
          actions: {
            businesses: "Businesses",
            health: "Health",
          },
          description:
            "Founder-only user search, account support, synthetic/test cleanup, and detail review. Role and production access changes stay blocked until the owner-approved security/RLS gate is closed.",
          eyebrow: "Founder Admin",
          gatedOperations: "Gated operations",
          metrics: {
            authUsersDescription:
              "Auth users available through founder-only paging/search.",
            authUsersLabel: "Auth users",
            noBusinessDescription:
              "Loaded users without a linked workspace.",
            noBusinessLabel: "No business",
            pausedAccessDescription:
              "Loaded users attached to suspended or cancelled access.",
            pausedAccessLabel: "Paused access",
            unconfirmedDescription:
              "Loaded users with email confirmation still pending.",
            unconfirmedLabel: "Unconfirmed",
          },
          operatingRule: {
            description:
              "Invite, role change, suspend, remove, and customer account deletion require the owner-approved security/RLS gate.",
            searchModeIndexed: "indexed auth filter",
            searchModeLabel: "Search mode",
            searchModePaged: "paged auth list",
            supportGuard:
              "Password reset and synthetic/test login cleanup are guarded.",
            title: "Operating rule",
          },
          title: "Users",
        },
        pageAriaLabel: (page) => `Page ${page}`,
        paginationLabel: "User directory pagination",
        previous: "Previous",
        quoteActive: "Quote active",
        quoteInactive: "Quote inactive",
        reset: "Reset",
        searchLabel: "Search users",
        searchPlaceholder: "Name, email, phone",
        searchSubmit: "Search",
        showLabel: "Show",
        showingRange: (start, end, total) =>
          `Showing ${start}-${end} of ${total} auth user(s).`,
        workspaceDetail: {
          description:
            "Read-only account and workspace context for founder review.",
          fields: {
            business: "Business",
            membership: "Membership",
            plan: "Plan",
            quoteLink: "Quote link",
            role: "Role",
            workspaceKind: "Workspace kind",
          },
          openBusinessControls: "Open business controls",
          repairNotice:
            "Workspace repair remains a founder-admin action outside this read-only Users foundation.",
          title: "User detail",
        },
        workQueuesDescription:
          "Start with risk and recovery queues, then search inside the result.",
        workQueuesTitle: "Work queues",
        showingPerPage: (count) => `Showing up to ${count} users per page`,
      },
    },
    errorBoundary: {
      body:
        "BizPilot caught a safe dashboard error. Reload the workspace to try again without exposing internal details.",
      eyebrow: "Dashboard",
      reload: "Reload dashboard",
      title: "This workspace needs a refresh.",
    },
    founderHandoff: {
      actions: {
        adminControls: "Admin controls",
        openFounderAdmin: "Open Founder Admin",
        ownerDashboard: "Owner dashboard",
        previewQuote: "Preview quote",
      },
      blockedGates: [
        "Customer account deletion",
        "Invite, role, suspend, or remove member access",
        "Real customer data approval",
        "Paid pilot, billing, payment, and refund automation",
      ],
      description:
        "Internal handoff page for founder operations. The primary admin work happens in /admin; the owner dashboard stays focused on manual lead recovery.",
      emptyState: "No workspace is linked to this account yet.",
      eyebrow: "Founder Operations",
      metrics: {
        accessibleWorkspacesDetail:
          "Visible through the current signed-in workspace context.",
        accessibleWorkspacesLabel: "Accessible workspaces",
        blockedGatesDetail:
          "Do not cross these without owner-approved readiness gates.",
        blockedGatesLabel: "Blocked gates",
        ownerWorkflowDetail:
          "Manual lead recovery remains the customer-facing surface.",
        ownerWorkflowLabel: "Owner workflow",
        primaryAdminDetail:
          "Use /admin for cross-workspace operational review.",
        primaryAdminLabel: "Primary admin",
      },
      safetyGates: {
        description:
          "These remain gated by the project operating standard and must not be blended into normal dashboard polish.",
        title: "Safety gates",
      },
      statuses: {
        blocked: "Blocked",
        handoff: "Handoff",
        next: "Next",
        ownerScope: "Owner scope",
        primaryConsole: "Primary console",
      },
      surfaceMap: {
        description:
          "Keep each surface clear: founder operations are internal, owner tools are manual-first, and customer quote forms stay public/intake-only.",
        title: "Admin surface map",
      },
      surfaces: {
        currentDescription:
          "Current internal route: use it as an orientation page, not as the main admin surface.",
        currentTitle: "This Page",
        dashboardDescription:
          "Owner workflow for quote requests, manual AI draft review, setup, profile, and settings.",
        dashboardTitle: "Owner Dashboard",
        founderAdminDescription:
          "Cross-workspace businesses, plans, quote links, notes, cleanup gates, and audit trail.",
        founderAdminTitle: "Founder Admin",
      },
      workspacePreview: {
        description:
          "This is a safe, owner-scoped preview only. Use the primary Founder Admin for cross-workspace controls.",
        title: "Accessible workspace preview",
      },
    },
    routeMessages: {
      genericError:
        "We couldn't complete that action. Review the fields and try again.",
      genericNotice: "Done. The workspace has been updated.",
    },
    businessProfile: {
      accountEmailHelp: "Account email - change it from Settings.",
      aiNotes: "Service area & operating notes",
      aiNotesDescription:
        "Operating context that helps the owner and AI prepare better drafts. AI guardrails and FAQ details stay in Quote Setup.",
      business: "Business",
      businessIdentity: "Business identity",
      businessIdentityDescription:
        "Owner-facing identity used across the dashboard, public quote page, and AI draft context.",
      businessName: "Business name",
      businessType: "Business type",
      cleaning: "Cleaning",
      description:
        "Business identity and operating context. This is separate from Quote Setup.",
      futureDescription:
        "Additional profile fields stay gated until the pilot proves they need saved storage and an approved migration.",
      futureFields: "Gated profile fields",
      languageHelp: "Used for the public quote page and AI draft language.",
      logoUrl: "Logo URL",
      notInMvp: "Not in MVP",
      oneAreaPerLine:
        "One area per line. Used to score leads and explain coverage.",
      openQuoteSetup: "Open Quote Setup",
      ownerEmail: "Owner email (read-only)",
      preferredLanguage: "Preferred language",
      previewQuotePage: "Preview Quote Page",
      publicQuoteLink: "Public quote link",
      publicSlug: "Public slug",
      roadmapFields: [
        ["Owner display name", "Phase 18B"],
        ["Owner phone", "Phase 18B"],
        ["Public website", "Phase 18B"],
        ["City", "Phase 18B"],
        ["Province", "Phase 18B"],
        ["Response hours", "Phase 18B"],
      ],
      save: "Save Business Profile",
      saveNote:
        "Save persists identity changes. Quote-form questions are managed in Quote Setup.",
      serviceAreas: "Service areas",
      serviceAreasPlaceholder: "Montreal\nLaval\nLongueuil",
      templateName: "Custom quote template name",
      verticalHelp:
        "Current scope is cleaning-first. Other verticals stay locked until the validation gate clears.",
    },
    configuration: {
      basics: {
        businessName: "Business name",
        description:
          "Core identity used across the protected workspace and public quote link.",
        languageHelp: "Controls public quote copy and AI draft language.",
        preferredLanguage: "Preferred language",
        publicSlug: "Public slug",
        templateName: "Template name",
        title: "Public quote basics",
      },
      bottomBar: {
        openPublicQuoteLink: "Save & preview",
        saveConfiguration: "Save configuration",
        text: "Save applies the setup and repairs the public quote link before preview.",
      },
      branding: {
        accentAppears:
          "Accent appears on progress, focus, and supporting highlights.",
        accentColor: "Accent color",
        addLogoAndColors: "Add logo and colors",
        colorsConfigured: "Colors ready",
        description:
          "Public-facing visual settings for the cleaning quote experience.",
        fileError: "Choose a PNG, JPG, or WebP logo under 2 MB.",
        logoAndColorsConfigured: "Logo and colors configured",
        logoPreviewAlt: "Logo preview",
        logoPreview: "Logo preview",
        logoUrl: "Logo URL",
        logoUrlHelp: "Optional alternative: paste a secure HTTPS image URL.",
        primaryColor: "Primary color",
        publicQuoteButton: "Public quote button",
        removeLogo: "Remove logo",
        resetColors: "Reset colors",
        submitQuoteRequest: "Submit quote request",
        title: "Branding",
        uploadHelp: "PNG, JPG, or WebP up to 2 MB. BizPilot resizes it before saving.",
        uploadLogo: "Choose logo file",
        whereColorsApply: "Where these colors apply",
      },
      fields: {
        addAnotherField: "Add field",
        addCustomField: "Add custom field",
        advancedSettings: "Advanced settings",
        chooseStarter: "Start with a recommended question",
        close: "Close",
        customFieldBuilder:
          "Create owner-specific questions. Choice options appear only when the field type needs them.",
        customerFacingQuestion: "Customer-facing question",
        customerQuestion: "Customer question",
        customize: "Customize",
        description:
          "Choose which customer questions appear on the public quote form, add owner-specific fields, and set their priority.",
        emptyBody: "Add a blank question or choose a recommended cleaning question above.",
        emptyTitle: "No new custom question yet",
        fieldKey: "Field key",
        fieldKeyHelp:
          "Optional. Lowercase letters, numbers, and underscores. Leave blank to generate from the label.",
        helperText: "Helper text",
        hidden: "Not visible",
        newFieldName: "New customer question",
        optional: "Optional",
        options: "Options",
        optionsHelp:
          "For select, radio, or time-window fields. One option per line or comma.",
        placeholders: {
          boolean: {
            fieldKey: "yes_no_question",
            helper: "Use for a simple yes/no detail.",
            label: "Yes/no question",
            options: "",
            preview: "Customer checks one box.",
          },
          date: {
            fieldKey: "preferred_date",
            helper: "Use when a calendar date matters.",
            label: "Preferred date",
            options: "",
            preview: "Customer chooses a date.",
          },
          email: {
            fieldKey: "alternate_email",
            helper: "Use only when a second email is useful.",
            label: "Alternate email",
            options: "",
            preview: "name@example.com",
          },
          number: {
            fieldKey: "room_count",
            helper: "Use when the answer should be numeric.",
            label: "How many rooms?",
            options: "",
            preview: "Example answer: 3",
          },
          phone: {
            fieldKey: "callback_phone",
            helper: "Use when a phone number is required.",
            label: "Callback phone",
            options: "",
            preview: "(555) 123-4567",
          },
          radio: {
            fieldKey: "home_furnished",
            helper: "Radio is best when the customer must choose one answer.",
            label: "Is the home furnished?",
            options: "Yes\nNo\nPartially",
            preview: "One visible choice is selected.",
          },
          select: {
            fieldKey: "property_type",
            helper: "Select keeps a longer list compact on the public form.",
            label: "Property type",
            options: "Apartment\nCondo\nHouse\nOffice",
            preview: "Customer opens a dropdown.",
          },
          text: {
            fieldKey: "parking_instructions",
            helper: "Short answer shown beside the quote request.",
            label: "Parking or access instructions",
            options: "",
            preview: "Example: Use visitor parking behind the building.",
          },
          textarea: {
            fieldKey: "long_answer",
            helper: "Use when the customer may explain details.",
            label: "Long answer question",
            options: "",
            preview: "Customer writes a longer note.",
          },
          time_window: {
            fieldKey: "arrival_window",
            helper: "Use when scheduling windows matter.",
            label: "Preferred arrival window",
            options: "Morning, 8-11\nAfternoon, 12-3\nEvening, 4-7",
            preview: "Customer chooses a time window.",
          },
        },
        position: "Position",
        priority: "Priority",
        recommendedQuestions: "Recommended for cleaning quotes",
        removeField: "Remove field",
        required: "Required",
        showOnPublicForm: "Show on public form",
        title: "Form Questions",
        type: "Type",
        typeLabels: {
          boolean: "Checkbox",
          date: "Date",
          email: "Email",
          number: "Number",
          phone: "Phone",
          radio: "Radio",
          select: "Select",
          text: "Text",
          textarea: "Long text",
          time_window: "Time window",
        },
        visible: "Visible",
        visibleOnForm: "Visible on form",
      },
      faq: {
        clearExamples: "Clear",
        description:
          "Owner-approved facts that help BizPilot prepare safer reply drafts. Every draft still requires your review.",
        examples: [
          "Do you bring supplies? | Yes, we bring standard cleaning supplies unless you prefer us to use yours.",
          "What areas do you serve? | We serve the areas listed on this quote page; share your address and we will confirm coverage.",
          "Do you offer move-out cleaning? | Yes, select move-out cleaning and share the property size and access details.",
          "How is pricing confirmed? | We review the request details before confirming a quote; the form does not create a final price.",
          "How soon will you reply? | We review new requests manually and reply after availability and details are checked.",
        ],
        guardrailTitle: "How BizPilot uses this knowledge",
        guardrails: [
          "Uses only answers you save here.",
          "Does not invent prices or availability.",
          "Keeps missing information visible.",
          "Creates a draft for owner review, never an automatic send.",
        ],
        help: "One FAQ per line. Use: Question? | Answer",
        label: "FAQ",
        loadExamples: "Load 5 examples",
        placeholder: "Do you bring supplies? | Yes, we bring all standard supplies.",
        summary: (count) => `${count} FAQs`,
        title: "AI instructions and FAQ",
      },
      headerDescription: (businessName) =>
        `Configure the cleaning quote experience, public link, consent, and owner-ready lead foundation for ${businessName}.`,
      noBusinessDescription: "No tenant business is available for this user yet.",
      notifications: {
        channels: {
          sms: "SMS",
          whatsapp: "WhatsApp",
        },
        description:
          "First pilot is manual-only: owners check the dashboard. Owner notification email, SMS, and WhatsApp stay disabled before validation.",
        emailActive: "Manual dashboard check only",
        futureDisabled: "Disabled before validation",
        newQuoteRequest: "New quote request",
        off: "Off",
        ownerEmail: "Owner email",
        summary: "Manual dashboard check only - owner notification deferred",
        title: "Notifications",
      },
      overview: {
        branding: "Branding",
        colorsReady: "Colors ready",
        complete: (completed, total) => `${completed}/${total} complete`,
        coveredAreas: (count) => `${count} covered areas`,
        description:
          "A clean operating summary of the quote link, setup health, and public customer experience.",
        done: "Done",
        faqs: "FAQ",
        logoConfigured: "Logo configured",
        open: "Open",
        previewPublicQuote: "Preview public quote",
        privacy: "Privacy",
        profile: "Profile",
        publicLink: "Public link",
        quoteForm: "Quote form",
        serviceAreas: "Service areas",
        serviceRecords: (count) => `${count} service records`,
        services: "Services",
        setupReport: "Setup report",
        summary: (completed, total) => `${completed}/${total} setup items complete`,
        title: "Quote setup overview",
        visibleQuestions: (visible, total) => `${visible}/${total} visible questions`,
        workspaceReadiness: "Workspace readiness",
      },
      privacy: {
        aiDisclosure: "Show AI draft disclosure",
        consentHelp:
          "Shown on the public quote page. If left blank, a safe default is saved so the consent version stays valid.",
        consentNotice: "Consent notice",
        description: "Consent and retention settings used by public quote submissions.",
        forwardOnly: "Forward-only (planned)",
        leadRetentionDays: "Lead retention days",
        minimal: "Minimal data",
        privacyContactEmail: "Privacy contact email",
        privacyMode: "Privacy mode",
        standard: "Standard",
        summary: (mode, days) => `${mode} - ${days} days`,
        title: "Privacy",
      },
      publicPage: {
        copyLink: "Copy unique link",
        description:
          "Shareable customer quote page generated from the active business slug and quote form.",
        placementTitle: "Where to place it",
        placements: [
          "Instagram and Facebook bio or message reply",
          "WhatsApp Business greeting or quick reply",
          "Website quote button",
          "Email signature and Google Business profile",
        ],
        previewPublicPage: "Preview public page",
        publicQuoteLink: "Public quote link",
        saveBeforePreview:
          "Save changes before previewing branding, consent, services, and quote questions.",
        title: "Quote link and public page",
        uniqueLinkDescription:
          "This customer-ready address belongs only to this business. Save setup before sharing it.",
        uniqueLinkTitle: "Your business quote link",
      },
      readiness: {
        description: (completed, total) => `${completed}/${total} setup tasks complete.`,
        fixFirst: (task) => `Finish "${task}" before sharing the quote link.`,
        manualOnly: "Manual owner-controlled setup",
        nextAction: "Next setup action",
        readyToShare: "Ready to share",
        readyState: "Ready for manual sharing",
        reviewChecklist: "Review checklist",
        shareWhenReady:
          "All setup items are complete. Save changes, preview the public link, then share manually through your existing channels.",
        setupInProgress: "Setup in progress",
        title: "Quote link readiness",
      },
      services: {
        areasHelp: "Example: Montreal, Laval, Longueuil, South Shore",
        description:
          "Enter one city, neighborhood, or service region per line. Leads outside these areas may be marked as low fit.",
        serviceAreas: "Service areas",
        services: "Services",
        servicesHelp: "One service per line. Use: Service name | Optional note",
        summary: (serviceCount, areaCount) =>
          `${serviceCount} services - ${areaCount} areas`,
        title: "Services & covered areas",
      },
      side: {
        brandingPreview: "Branding preview",
        publicQuoteColors: "Public quote colors",
        publicQuoteLink: "Public quote link",
        saveThenPreview:
          "Save changes, then preview the customer-facing quote flow.",
        workspaceReadiness: "Workspace readiness",
      },
      tabs: {
        ariaLabel: "Quote setup sections",
        ai: "AI Instructions",
        basics: "Public Basics",
        branding: "Branding",
        fields: "Form Questions",
        link: "Public Link",
        notifications: "Notifications",
        overview: "Overview",
        privacy: "Privacy",
        readiness: "Readiness",
        services: "Services",
      },
    },
    leadQueue: {
      age: {
        ago: "ago",
        day: (count) => `${count}d`,
        hour: (count) => `${count}h`,
        minute: (count) => `${count}m`,
        notAvailable: "-",
        olderDateLocale: "en",
      },
      empty: {
        clearFilters: "Clear filters",
        filteredBody:
          "Try another search, clear filters, or sort by newest quote requests.",
        filteredTitle: "No leads match those filters.",
        noLeadsBody: "Share your quote link to start capturing requests.",
        noLeadsTitle: "No leads yet.",
      },
      fallbacks: {
        area: "Area pending",
        service: "Service not set",
        unnamedLead: "Unnamed lead",
      },
      filters: {
        aiReady: "AI draft ready",
        all: "All statuses",
        atRisk: "At risk",
        lost: "Lost",
        missingInfo: "Missing info",
        needsReply: "Needs reply",
        reviewed: "Reviewed",
        won: "Won",
      },
      headers: {
        customer: "Customer",
        location: "Location",
        nextAction: "Next action",
        requested: "Requested",
        service: "Service",
        status: "Status",
      },
      pagination: {
        navigationLabel: "Lead queue pagination",
        next: "Next",
        pageButtonAriaLabel: (page) => `Page ${page}`,
        pageRange: (start, end, total) => `Showing ${start}-${end} of ${total}`,
        pageSizeAriaLabel: "Choose rows per page",
        pageSizeLabel: "Rows",
        pageSizeOption: (count) => `${count} per page`,
        pageStatus: (current, total) => `Page ${current} of ${total}`,
        previous: "Previous",
      },
      reset: "Reset",
      searchPlaceholder: "Search leads, city, service...",
      sorts: {
        mostUrgent: "Most urgent",
        newest: "Newest",
        oldest: "Oldest",
      },
      priorityHint:
        "Priority order favors overdue requests, missing details, new leads, and open owner actions.",
      resultSummary: (visible, total) => `${visible}/${total} visible`,
      searchAriaLabel: "Search the lead recovery queue",
      filterAriaLabel: "Filter leads by status",
      sortAriaLabel: "Sort leads",
      status: {
        archived: "Archived",
        atRisk: "At risk",
        lost: "Lost",
        missingInfo: "Missing info",
        needsReply: "Needs reply",
        reviewed: "Reviewed",
        won: "Won",
      },
    },
    leadDetail: {
      actionItems: "Action items",
      ai: {
        copyFollowUp: "Copy follow-up",
        copyReply: "Copy reply",
        editManually: "Edit manually",
        editManuallyTitle: "Editing inline is a later workflow improvement.",
        estimatedCost: "Est. cost",
        fallbackReason: "AI fallback reason",
        followUpDraft: "Follow-up draft",
        generate: "Generate AI draft",
        guardrails: "AI guardrails",
        guardrailBadges: [
          "No auto-send",
          "No invented pricing",
          "Reviewed by you",
        ],
        manualDraftDescription:
          "Generate a draft when ready. BizPilot prepares a summary, reply draft, follow-up draft, and next action. You review, copy, and send manually.",
        missingInfo: "Missing info",
        modelDraft: "Model draft",
        nextAction: "Next action",
        noSend: "No send button in MVP. You copy, edit, and send manually.",
        ownerReviewRequired: "Review required",
        regenerate: "Regenerate",
        ruleFallback: "Rule fallback",
        source: "Source",
        suggestedReply: "Suggested reply",
        title: "AI draft support",
      },
      backToQueue: "Back to Lead Recovery Queue",
      completeAction: "Complete",
      copiedDone: "Done",
      detailDescription: (service, area, age) =>
        `${service} request - ${area} - received ${age}`,
      fields: {
        cityArea: "City / area",
        contact: "Contact",
        name: "Name",
        serviceType: "Service type",
        source: "Source",
        submitted: "Submitted",
      },
      fallbacks: {
        area: "Area missing",
        contact: "No contact captured",
        service: "Service not set",
        source: "Quote link",
        unnamedLead: "Unnamed lead",
      },
      labels: {
        manualOutcome: "Manual outcome",
        primaryIssue: "Primary issue",
        recommendedAction: "Recommended action",
        status: "Status",
      },
      mark: "Mark",
      markReplyCopied: "Mark reply copied",
      markWon: "Record won manually",
      manualWorkflow: {
        description:
          "Start with the safest owner action: review the request, use the AI draft only as support, then copy and send through your normal customer channel.",
        outcomeNote:
          "Record won or lost only after you have contacted the customer outside BizPilot.",
        primaryAction: "Mark copied after copy",
        secondaryAction: "Record outcome after contact",
        steps: [
          ["Review", "Check the request and missing details."],
          ["Draft", "Generate or inspect the AI-supported reply."],
          ["Copy", "Edit and send through your normal channel."],
          ["Record", "Update status after the manual contact."],
        ],
        title: "Next manual step",
      },
      missing: {
        description: "Ask these before estimating or promising availability.",
        noRequiredMissing: "No required quote details missing",
        title: "Missing information detected",
      },
      noActionItemsBody: "Follow-up and reply tasks will appear here.",
      noActionItemsTitle: "No action items",
      noTimelineBody:
        "Lead activity will appear here as you review and act.",
      noTimelineTitle: "No timeline events",
      notProvided: "Not provided",
      notYet: "Not yet",
      ownerNotes: {
        description:
          "Private scratchpad for pilot learning and follow-up quality. Keep anything important in your operating system until saved notes are approved.",
        persistenceNote:
          "Not saved: persistent owner notes are a gated storage decision for a later approved phase.",
        placeholder:
          "Add notes about this request, objections, pricing context, or follow-up outcome...",
        title: "Private scratchpad",
      },
      quoteIntakeFields: "Quote intake fields",
      sourceAttribution: {
        description:
          "Captured source context for this request. Use it to understand where the quote link worked; do not treat it as a full analytics report.",
        fields: {
          referrer: "Referrer",
          sourceUrl: "Source URL",
          utmCampaign: "UTM campaign",
          utmMedium: "UTM medium",
          utmSource: "UTM source",
        },
        title: "Source attribution",
      },
      routing: {
        badges: ["Human review required", "No auto-assignment"],
        description:
          "Rule-based cleaning intake suggestion. Nothing is assigned or sent automatically.",
        missingInfoLabel: "Missing info",
        nextActionLabel: "Next action",
        noMissingInfo: "No routing blockers found",
        priorityLabel: "Priority",
        priorities: {
          high: "High priority",
          review: "Review needed",
          standard: "Standard priority",
        },
        queueLabel: "Suggested queue",
        queues: {
          commercial_cleaning: "Commercial Cleaning",
          intake_review: "Intake Review",
          move_out_cleaning: "Move-out Cleaning",
          owner_review: "Review",
          recurring_opportunity: "Recurring Opportunity",
        },
        reasonLabel: "Reason",
        reasons: {
          commercial_request: "Commercial or office request",
          follow_up_due: "Follow-up is due",
          missing_required_info: "Required quote details are missing",
          move_out_request: "Move-out cleaning request",
          outside_service_area: "Outside configured service area",
          preferred_date_soon: "Preferred date is soon",
          ready_for_owner_reply: "Ready for your reply",
          recurring_request: "Recurring cleaning opportunity",
          response_overdue: "Response is overdue",
        },
        reviewerLabel: "Suggested reviewer",
        reviewers: {
          owner: "You",
        },
        nextActions: {
          ask_missing_info: "Ask for missing information before estimating.",
          follow_up: "Follow up with the customer today.",
          owner_review: "Review the request and prepare a manual reply.",
          reply_fast: "Reply quickly while the customer is still comparing.",
          review_service_area:
            "Review the service area before quoting or archiving.",
        },
        title: "Smart Intake Routing",
      },
      save: "Save",
      sections: {
        controlsDescription:
          "You control status and manual outcome tracking. Nothing is sent, booked, or changed automatically.",
        controlsTitle: "Lead controls",
        leadDetailsDescription:
          "Quote intake values captured from the public form.",
        leadDetailsTitle: "Lead details",
      },
      manualOutcomeHelp:
        "Use manual outcome only after the owner has replied or confirmed the result outside BizPilot.",
      statusLabels: {
        archived: "Archived",
        action_completed: "Action completed",
        ask_info: "Ask info",
        asked_info: "Asked info",
        booked: "Won (manual outcome)",
        completed: "Completed",
        dismissed: "Dismissed",
        follow_up: "Follow-up",
        follow_up_due: "Follow-up due",
        follow_up_marked: "Follow-up marked",
        follow_up_needed: "Follow-up needed",
        lead_created: "Lead created",
        lead_viewed: "Lead viewed",
        lost: "Lost",
        low_fit: "Low fit",
        new: "New",
        no_response: "No response",
        not_a_fit: "Not a fit",
        open: "Open",
        overdue: "Overdue",
        outcome_marked: "Outcome marked",
        reply: "Reply",
        reply_copied_event: "Reply copied",
        replied: "Replied",
        reply_copied: "Reply copied",
        reviewed: "Reviewed",
        score_calculated: "Score calculated",
        status_changed: "Status changed",
        viewed: "Viewed",
      },
      timeline: "Timeline",
      values: {
        no: "No",
        yes: "Yes",
      },
    },
    leadsPage: {
      active: "Active",
      atRiskBadge: (count) => `${count} at risk`,
      command: {
        countLabel: (count, total) => `${count} of ${total} in this lane`,
        manualOnly: "Manual review only",
        noMatchingLead:
          "Nothing is waiting in this lane right now. Keep the quote setup ready and return to the full queue when new requests arrive.",
        routeLabel: "Current queue lane",
        safeAction: "Safest next manual action",
        secondaryLabel: "Open operating guide",
        states: {
          ai_ready: {
            description:
              "Start with the first lead that can use an owner-reviewed draft. Copy, edit, and send outside BizPilot only after checking the request.",
            emptyDescription:
              "No draft-ready lead is waiting. Use the full queue to review newer requests or setup gaps.",
            emptyPrimaryLabel: "Back to all leads",
            emptyTitle: "No draft-ready leads in this lane.",
            primaryLabel: "Review draft-ready lead",
            title: "Review the next draft-ready lead.",
          },
          all: {
            description:
              "Work the queue in recovery order: overdue requests, missing information, new quote requests, then reviewed outcomes.",
            emptyDescription:
              "No quote requests are captured yet. Keep setup complete and share the quote link from the channels you already use.",
            emptyPrimaryLabel: "Check quote setup",
            emptyTitle: "No quote requests captured yet.",
            primaryLabel: "Review first lead",
            title: "Work the highest-priority quote request first.",
          },
          at_risk: {
            description:
              "Open the oldest at-risk request before reviewed or archived work. The owner still decides what to send.",
            emptyDescription:
              "No at-risk lead is waiting. Keep scanning new requests before they age into follow-up risk.",
            emptyPrimaryLabel: "Back to all leads",
            emptyTitle: "No at-risk leads right now.",
            primaryLabel: "Review at-risk lead",
            title: "Recover the at-risk lead first.",
          },
          lost: {
            description:
              "Use this lane to inspect manually closed losses and avoid mixing them with today's reply work.",
            emptyDescription:
              "No lost outcomes are recorded. Return to the active queue for current manual recovery work.",
            emptyPrimaryLabel: "Back to all leads",
            emptyTitle: "No lost outcomes in this lane.",
            primaryLabel: "Review lost detail",
            title: "Inspect the closed lost outcome.",
          },
          missing_info: {
            description:
              "Open the first request with missing details and ask only for the information needed to prepare a useful quote.",
            emptyDescription:
              "No missing-information lead is waiting. Continue with reply-ready or at-risk requests.",
            emptyPrimaryLabel: "Back to all leads",
            emptyTitle: "No missing-information leads right now.",
            primaryLabel: "Ask for missing info",
            title: "Ask for the missing details first.",
          },
          needs_reply: {
            description:
              "Open the first request that needs an owner reply. Review the draft, edit if needed, then copy and send manually.",
            emptyDescription:
              "No reply-needed lead is waiting. Check the full queue or keep setup ready for the next request.",
            emptyPrimaryLabel: "Back to all leads",
            emptyTitle: "No reply-needed leads right now.",
            primaryLabel: "Review reply-needed lead",
            title: "Reply to the next waiting request.",
          },
          reviewed: {
            description:
              "Use this lane to audit requests that were already reviewed without pulling focus from open reply work.",
            emptyDescription:
              "No reviewed leads are recorded yet. Start from the active queue when new requests arrive.",
            emptyPrimaryLabel: "Back to all leads",
            emptyTitle: "No reviewed leads in this lane.",
            primaryLabel: "Review completed detail",
            title: "Inspect the reviewed lead detail.",
          },
          won: {
            description:
              "Use won outcomes as manual proof of completed owner work, not as an automated revenue claim.",
            emptyDescription:
              "No won outcomes are recorded. Keep today's recovery queue focused on current requests.",
            emptyPrimaryLabel: "Back to all leads",
            emptyTitle: "No won outcomes in this lane.",
            primaryLabel: "Review won detail",
            title: "Inspect the closed won outcome.",
          },
        },
      },
      focusAtRiskDescription: (count) =>
        `${count} lead${count === 1 ? "" : "s"} are at risk. Review them before reviewed or archived requests.`,
      focusHealthyDescription:
        "No at-risk leads right now. Keep checking new requests as they arrive.",
      focusTitle: "Today's recovery focus",
      lastSubmission: (age) => `Last submission: ${age}.`,
      missingInfoBadge: (count) => `${count} missing info`,
      newBadge: (count) => `${count} new`,
      openQuoteSetup: "Open Quote Setup",
      quoteLinkHealth: "Quote link health",
      statusRulesBody:
        "New -> Needs reply -> Reviewed / Won / Lost. AI drafts are reviewed by you only; no automatic sending.",
      statusRulesTitle: "Status rules",
    },
    guide: {
      actions: {
        openQueue: "Open lead queue",
        openSetup: "Open Quote Setup",
        viewSettings: "View display settings",
      },
      boundaries: {
        description:
          "These limits keep the owner dashboard honest for the current pilot.",
        items: [
          "No automatic sending, booking, invoicing, or payment collection.",
          "No invented pricing, availability, or customer promises.",
          "No production cleanup, real-customer-data opening, or paid-pilot gate without explicit approval.",
        ],
        title: "Manual-first boundaries",
      },
      gaps: {
        description:
          "Known gaps are named here so they stay visible without pretending they are already enabled.",
        items: [
          ["Visual focus QA", "Dedicated keyboard/focus and screenshot review still needs a browser QA pass before paid pilot."],
          ["Saved queue views", "Useful after real owner behavior proves which lead lanes matter most."],
          ["Team assignment", "Blocked until the owner/team access and RLS gate is approved."],
          ["Notification automation", "Email, SMS, and WhatsApp automation remain future-gated behind consent, provider, cost, and rollback checks."],
        ],
        title: "Visible gaps and gates",
      },
      header: {
        description:
          "A compact operating guide for the manual quote-recovery dashboard: what to open, what to do first, and what stays intentionally blocked.",
        eyebrow: "BizPilotOwner",
        title: "Owner Operating Guide",
      },
      launchChecklist: {
        description:
          "The shortest path from setup to repeatable owner review.",
        items: [
          ["1", "Finish quote setup", "Confirm services, areas, intake questions, privacy, and branding."],
          ["2", "Share one public link", "Use the quote link on the website, Google profile, or manual outreach."],
          ["3", "Review the queue daily", "Start with overdue, missing-info, and new quote requests."],
          ["4", "Copy only after review", "Edit AI-supported drafts before sending outside BizPilot."],
          ["5", "Record the result", "Update status or manual outcome after contact happens."],
        ],
        title: "Owner launch checklist",
      },
      operatingSystem: {
        description:
          "The dashboard is organized around one manual recovery loop, not a full CRM.",
        lanes: [
          ["Capture", "Quote requests arrive from the public link.", "Keep the link active and shareable."],
          ["Triage", "At-risk, missing-info, and new leads rise first.", "Open the focused queue filters."],
          ["Draft", "BizPilot prepares review-only reply and follow-up drafts.", "Generate or inspect the draft."],
          ["Manual send", "The owner copies, edits, and sends outside BizPilot.", "No message is sent by the app."],
          ["Record", "Status, action items, and outcomes keep the workspace current.", "Update only after real contact."],
        ],
        title: "Manual recovery operating system",
      },
      routeMap: {
        description:
          "Each route has one owner job so the dashboard stays compact.",
        items: [
          ["Overview", "One next action, setup readiness, and the most urgent queue preview.", "/dashboard", "Open overview"],
          ["Leads", "Search, filter, sort, and review every quote request.", "/dashboard/leads", "Open queue"],
          ["Quote Setup", "Services, areas, questions, consent, branding, and public link readiness.", "/dashboard/configuration", "Open setup"],
          ["Business Profile", "Business identity and reply context that supports better manual responses.", "/dashboard/business-profile", "Open profile"],
          ["Settings", "Language, theme, display preferences, feature state, and guarded lifecycle actions.", "/dashboard/settings", "Open settings"],
        ],
        title: "Dashboard route map",
      },
    },
    overview: {
      aiControlBody:
        "BizPilot drafts replies, summaries, and follow-ups. Nothing is sent automatically.",
      aiControlBadges: ["No auto-send", "No invented pricing", "Reviewed by you"],
      aiControlTitle: "AI stays under your control",
      atRiskSoon: "At risk soon",
      copyLink: "Copy link",
      featuredFallbackAction:
        "Review the request and send a manual reply.",
      featuredFallbackAge: "22m ago",
      featuredFallbackArea: "Plateau",
      featuredFallbackCustomer: "Sarah M.",
      featuredFallbackService: "Move-out cleaning",
      finishSetup: "Finish setup",
      guidesAndAiControls: "Manual workflow guide",
      heroBadge: "Manual-first recovery",
      heroDescription:
        "Respond while the customer is still comparing options. BizPilot organizes urgent quote requests, drafts a reply, and keeps you in control.",
      heroTitle: (count) =>
        count === 1
          ? "1 quote request needs attention today."
          : `${count} quote requests need attention today.`,
      startGuide: {
        description:
          "A calm launch path for the first owner session. Finish only the next useful step.",
        done: "Done",
        items: [
          ["Finish quote setup", "Confirm services, areas, questions, privacy, and branding."],
          ["Share the quote link", "Copy the public link when readiness is complete."],
          ["Review new requests", "Open the queue, reply manually, then record the outcome."],
        ],
        next: "Next",
        title: "Start here",
      },
      commandFlow: {
        description:
          "Keep the day tight: capture requests, prioritize urgency, review the draft, then send manually outside BizPilot.",
        items: [
          ["Capture", "New quote requests land in one queue."],
          ["Prioritize", "At-risk and missing-detail leads rise first."],
          ["Draft", "AI support stays review-only."],
          ["Manual send", "Owner copies, edits, and sends."],
        ],
        title: "Today's manual recovery lane",
      },
      metrics: {
        aiDraftsReady: {
          detail: "Review before using. No auto-send.",
          label: "AI drafts ready",
        },
        atRiskLeads: {
          detail: "No reply after the recovery threshold",
          label: "At risk leads",
        },
        needsReply: {
          detail: "Waiting for your response",
          label: "Needs reply",
        },
        newQuoteRequests: {
          detail: "Last 7 days · healthy pilot signal",
          label: "New quote requests",
        },
      },
      noWorkspaceBody:
        "Create or join a business workspace before using the lead workspace.",
      noWorkspaceTitle: "No business workspace yet.",
      openQueue: "Open queue",
      queue: {
        description:
          "The 5 most urgent quote requests. Open the full queue to filter, sort, and act on every lead.",
        title: "Lead Recovery Queue",
      },
      readiness: {
        activeAndReady: "Active and ready",
        incomplete: "Incomplete",
        liveAndShareable: "Public quote link is live and shareable.",
        needed: "Needed",
        ready: "Ready",
        tasksLeft: (count) => `${count} tasks left`,
        title: "Quote link readiness",
      },
      recentActivity: {
        description: "Operational timeline for quote recovery and manual actions.",
        emptyBody:
          "New quote requests, AI summaries, review actions, and quote link copies will appear here.",
        emptyTitle: "No recent activity yet.",
        title: "Recent Activity",
      },
      recoveryFocus: {
        description: (count) => `${count} items`,
        followUpDetail: (count) => `${count} follow-up due today`,
        followUpTitle: "Follow-up due",
        itemCount: (count) => String(count),
        missingInfoDetail: (count) => `${count} lead needs details`,
        missingInfoTitle: "Missing info",
        replyDetail: (count) => `${count} leads waiting`,
        replyTitle: "Reply needed",
        title: "Today's recovery focus",
      },
      reviewUrgentLead: "Review urgent lead",
      routine: {
        steps: [
          ["1", "Review at-risk leads", "Start with overdue quote requests."],
          ["2", "Copy AI replies", "Edit before sending manually."],
          ["3", "Follow up unanswered requests", "Use owner-approved drafts."],
        ],
        title: "Workspace routine suggestion",
      },
      status: {
        aiDraftReady: "AI draft ready",
        missingInfo: "Missing info",
        ready: "Ready",
      },
      suggestedNextAction: "Suggested next action:",
      setupChecklist: "Setup checklist",
      visualDashboard: {
        aiAssistantBody: (count) =>
          `You have ${count} lead${count === 1 ? "" : "s"} waiting for your reply. Owner review remains required before anything is sent.`,
        aiAssistantTitle: "AI Assistant",
        dateRange: "Last 7 days",
        filters: "Filter queue",
        kpis: {
          aiRepliesSent: "Drafts Copied",
          awaitingReply: "Awaiting Your Reply",
          dealsWon: "Booked Outcomes",
          newLeads: "New Leads",
          quoteLinkSent: "Active Quote Link",
          readinessCompleted: "Readiness Completed",
        },
        leadQueueTitle: "Lead Queue (Needs Your Action)",
        leadSources: "Lead Sources",
        leadsTrend: "Leads Trend",
        newLead: "Preview quote page",
        newLeadsCenter: "New Leads",
        ownerReviewRequired:
          "Owner review remains required before anything is sent.",
        todo: {
          completeReadiness: "Complete readiness",
          prepareQuotes: "Prepare quotes",
          replyToLeads: "Reply to leads",
          sendFollowUp: "Send follow-up",
          title: "To Do Today",
        },
        title: "Overview",
        viewAll: "View all",
        viewFullReport: "View full report",
      },
    },
    routeGuide: {
      ariaLabel: "Page guide and priority actions",
      fullGuide: "Open full guide",
      label: "Page guide",
      routes: {
        businessProfile: {
          focus: "Business profile explains how the owner wants quotes framed.",
          next:
            "Keep identity, service notes, and FAQ context current before relying on AI-supported drafts.",
          primaryHref: "/dashboard/business-profile",
          primaryLabel: "Review profile",
          secondaryHref: "/dashboard/configuration",
          secondaryLabel: "Open quote setup",
        },
        configuration: {
          focus: "Quote setup controls what customers see before they submit.",
          next:
            "Confirm services, areas, consent, questions, and AI rules before sharing the quote link.",
          primaryHref: "/dashboard/configuration",
          primaryLabel: "Check setup",
          secondaryHref: "/dashboard/business-profile",
          secondaryLabel: "Review profile",
        },
        guide: {
          focus: "Operating guide keeps the manual recovery routine visible.",
          next:
            "Use it to confirm route priorities, MVP boundaries, and the remaining gates before production sign-off.",
          primaryHref: "/dashboard/leads",
          primaryLabel: "Open queue",
          secondaryHref: "/dashboard/settings",
          secondaryLabel: "Review boundaries",
        },
        leadDetail: {
          focus: "Lead response desk is for one owner-reviewed customer reply.",
          next:
            "Verify missing info, inspect AI-supported text, copy the draft, and record manual contact status only.",
          primaryHref: "/dashboard/leads",
          primaryLabel: "Back to queue",
          secondaryHref: "/dashboard/guide",
          secondaryLabel: "Review routine",
        },
        leads: {
          focus: "Lead queue is the main manual recovery workbench.",
          next:
            "Prioritize overdue requests, AI-ready drafts, and missing-info leads before lower-risk rows.",
          primaryHref: "/dashboard/leads?focus=at_risk",
          primaryLabel: "Review at-risk leads",
          secondaryHref: "/dashboard/leads?focus=ai_ready",
          secondaryLabel: "AI-ready drafts",
        },
        overview: {
          focus: "Dashboard overview shows today's safest owner action first.",
          next:
            "Start with the highest-risk queue item, then finish setup blockers that prevent sharing the quote link.",
          primaryHref: "/dashboard/leads?focus=at_risk",
          primaryLabel: "Review at-risk leads",
          secondaryHref: "/dashboard/configuration",
          secondaryLabel: "Finish setup",
        },
        settings: {
          focus: "Settings keeps account, display, and MVP boundaries explicit.",
          next:
            "Adjust local display preferences here, but keep billing, automations, and team features gated.",
          primaryHref: "/dashboard/settings",
          primaryLabel: "Review settings",
          secondaryHref: "/dashboard/guide",
          secondaryLabel: "Open guide",
        },
      },
    },
    nav: {
      businessProfile: "Business Profile",
      groupCommand: "Command",
      groupControl: "Control",
      groupSetup: "Setup",
      guide: "Guide",
      leads: "Leads",
      overview: "Overview",
      ownerWorkspace: "Workspace",
      quoteSetup: "Quote Setup",
      settings: "Settings",
      workspaceSubtitle: "Lead recovery workspace",
    },
    pages: {
      businessProfile: {
        subtitle: "Business identity and operating context",
        title: "Business Profile",
      },
      configuration: {
        subtitle:
          "Public quote page, form questions, services, AI rules, and privacy",
        title: "Quote Setup",
      },
      dashboard: {
        subtitle: "Today's lead recovery snapshot",
        title: "Dashboard",
      },
      founder: {
        subtitle: "Founder handoff and internal admin orientation",
        title: "Founder Admin Console",
      },
      guide: {
        subtitle: "Manual quote-recovery routine, route map, and gated gaps",
        title: "Owner Operating Guide",
      },
      leadDetail: {
        subtitle: "Lead details, missing info, and AI-assisted drafts reviewed by you",
        title: "Lead Response Desk",
      },
      leads: {
        subtitle: "Prioritize quote requests before customers move on",
        title: "Lead Recovery Queue",
      },
      settings: {
        subtitle: "Workspace, account, theme, and MVP boundaries",
        title: "Settings",
      },
    },
    readinessTasks: {
      branding: "Branding configured",
      business_profile: "Business profile confirmed",
      cleaning_template: "Cleaning template activated",
      consent: "Consent notice configured",
      faqs: "At least one FAQ added",
      privacy: "Privacy mode selected",
      service_areas: "At least one service area added",
      services: "At least one service added",
    },
    settings: {
      account: "Account",
      billing: "Billing",
      business: "Business",
      displayPreferences: {
        densityLabel: "Density",
        densityOptions: {
          compact: "Compact",
          comfortable: "Comfortable",
          spacious: "Wide",
        },
        description:
          "Adjust how much dashboard help and insight detail is visible on this device. These controls do not change workspace data.",
        guideLabel: "Guide panels",
        guideOptions: {
          expanded: "Expanded",
          minimal: "Minimal",
          standard: "Standard",
        },
        insightLabel: "Insight panels",
        insightOptions: {
          hidden: "Hide optional insights",
          standard: "Show insights",
        },
        localOnly:
          "Saved locally in this browser. Owner workflow, quote setup, and admin gates stay unchanged.",
        reset: "Reset view",
        title: "Display preferences",
      },
      featureRegistry: {
        activationLabel: "Activation",
        categoryLabels: {
          admin: "Admin",
          ai: "AI",
          billing: "Billing",
          communication: "Communication",
          data: "Data",
          intake: "Intake",
          recovery: "Recovery",
          scheduling: "Scheduling",
          settings: "Settings",
        },
        description:
          "Owner-controlled feature levels. Active tools stay clear, setup-required tools show the blocker, and planned tools stay non-clickable.",
        featureCopy: {
          ai_draft_assistant: {
            activation:
              "Founder enables model-backed AI for approved pilot use after final no-secret smoke and owner approval.",
            name: "AI draft assistant",
            ownerGuide:
              "Confirm Phase 24F/24G gates, keep usage monitored, and keep owner review required.",
            setup:
              "Synthetic OpenAI provider proof passed; real customer use remains gated by final smoke and owner approval.",
            summary:
              "Summaries, reply drafts, and follow-up drafts remain owner-reviewed.",
            textGuide:
              "Explains fallback behavior, privacy limits, and that BizPilot never sends automatically.",
            visualGuide:
              "Show summary, suggested reply, follow-up, copy action, and fallback banner.",
          },
          backup_restore_posture: {
            activation:
              "Founder accepts the DB-level restore proof for first limited pilot and completes strict restored app/RLS proof before paid pilot or risky data work.",
            name: "Backup and restore posture",
            ownerGuide:
              "Record storage location, access list, restore target, Phase 24C.0 proof, and Phase 24C.1 deferral.",
            setup:
              "DB-level export/restore proof passed; strict restored app/dashboard/RLS proof remains P1 before paid pilot, migrations, or destructive work.",
            summary:
              "Separates the passed DB-level backup proof from the deferred strict restored app/RLS proof.",
            textGuide:
              "Explains what is backed up, where exports live, and who can restore.",
            visualGuide:
              "Show readiness checklist, restore-drill status, and owner decision state.",
          },
          billing_payment_links: {
            activation:
              "Founder keeps billing manual or adds payment links after payment setup.",
            name: "Billing and payment links",
            ownerGuide:
              "Confirm pricing, payment provider, refund/cancel language, and smoke path.",
            setup: "Payment provider/account setup required.",
            summary:
              "Staged pilot billing can be tracked without pretending in-app billing exists.",
            textGuide:
              "Explains manual billing, payment-link use, cancellation, and refund limits.",
            visualGuide:
              "Show plan state, payment setup needed, and non-clickable billing actions.",
          },
          business_branding: {
            activation: "Owner edits branding in Quote Setup.",
            name: "Business branding",
            ownerGuide:
              "Verify contrast and public quote preview after logo/color changes.",
            setup: "Available now.",
            summary:
              "Logo, colors, service areas, services, FAQs, and privacy copy shape the quote page.",
            textGuide:
              "Explains how branding affects customer trust and the public quote page.",
            visualGuide:
              "Show quote-page preview, brand colors, services, FAQs, and consent area.",
          },
          custom_smtp_auth_email: {
            activation:
              "Auth email is enabled after Resend DNS, Supabase SMTP, signup confirmation, and reset smokes passed.",
            name: "Custom SMTP auth email",
            ownerGuide:
              "Never print credentials. Keep app-level owner notification email separate and deferred.",
            setup:
              "Auth email proof passed; owner notification email remains deferred for the first pilot.",
            summary:
              "Signup confirmation and password reset email delivery for real pilots.",
            textGuide:
              "Explains confirmation/reset behavior and what to do when email is missing.",
            visualGuide:
              "Show signup email, reset email, provider-log check, and retry path.",
          },
          fr_ca_language: {
            activation: "Owner selects workspace language.",
            name: "English / fr-CA workspace language",
            ownerGuide:
              "Keep strings in central dictionaries and run language smoke for quote flows.",
            setup: "Available now.",
            summary:
              "Dashboard and quote-flow copy can follow the workspace language.",
            textGuide:
              "Explains what changes when the workspace language changes.",
            visualGuide:
              "Show language selector, public quote copy, validation copy, and success state.",
          },
          founder_admin_controls: {
            activation: "Founder/admin only.",
            name: "Founder admin controls",
            ownerGuide:
              "Use dry-run first, log actions, and keep destructive paths separately approved.",
            setup: "Owner-controlled.",
            summary:
              "Workspace kind, plan/status, quote-link, session policy, notes, and cleanup safety.",
            textGuide:
              "Explains which changes a customer can see and which are founder-only.",
            visualGuide:
              "Show traceable admin actions, session policy, cleanup dry-run, and blocked purge.",
          },
          invoices_payments: {
            activation:
              "Founder decides whether invoice/payment workflow becomes part of a paid level.",
            name: "Invoices and payments",
            ownerGuide:
              "Define provider, tax/refund language, webhook rollback, and support flow.",
            setup: "Planned; payment provider setup required before launch.",
            summary:
              "Future invoice/payment workflow that must not imply payment success before it exists.",
            textGuide:
              "Explains what payment actions are manual versus automated.",
            visualGuide:
              "Show invoice draft, payment status, error state, and manual fallback.",
          },
          customer_contact_list: {
            activation:
              "Founder enables after contact consent, retention, export, and premium access rules are defined.",
            name: "Customer contact list",
            ownerGuide:
              "Define owner/admin visibility, contact import rules, opt-out handling, and export limits.",
            setup:
              "Planned premium feature; contact data rules and backup posture are required first.",
            summary:
              "A premium owner/admin list built from customer email or phone contact paths for follow-up and statistics.",
            textGuide:
              "Explains who can see the list, what contact types are stored, and how advertising use is limited.",
            visualGuide:
              "Show customer list, contact type filters, owner/admin visibility, consent status, and export-disabled state.",
          },
          lead_source_attribution_analytics: {
            activation:
              "Founder enables after source taxonomy and chart privacy rules are approved.",
            name: "Lead source analytics",
            ownerGuide:
              "Use leads.source_channel and lead_source_metadata; never add leads.source.",
            setup:
              "Planned premium/admin feature; source taxonomy and dashboard charts are not active yet.",
            summary:
              "Shows whether leads came from website, Instagram, Facebook, Google, direct links, or campaign URLs.",
            textGuide:
              "Explains source labels, UTM fields, referrers, and why unknown sources stay honest.",
            visualGuide:
              "Show source mix chart, top channels, recent source list, unknown bucket, and date filter.",
          },
          quote_link_intake: {
            activation: "Owner controls the active public quote link.",
            name: "Public quote link and intake",
            ownerGuide:
              "Run public quote security smoke when form behavior changes.",
            setup: "Available now.",
            summary:
              "A customer-safe quote link captures structured cleaning requests.",
            textGuide:
              "Explains link sharing, required fields, consent, and unavailable states.",
            visualGuide:
              "Show active link, form steps, validation, consent, and success page.",
          },
          quote_recovery_queue: {
            activation: "Core dashboard feature.",
            name: "Lead recovery queue",
            ownerGuide:
              "Keep queue priority, lead status, and follow-up language aligned with real workflow.",
            setup: "Available now.",
            summary:
              "Prioritizes new, urgent, missing-info, and follow-up leads for owner action.",
            textGuide:
              "Explains statuses, next actions, owner review, and copy/send boundary.",
            visualGuide:
              "Show queue priority, filters, lead detail, AI draft, and copy action.",
          },
          scheduling_booking: {
            activation:
              "Founder decides provider and feature level after quote recovery is proven.",
            name: "Scheduling and booking",
            ownerGuide:
              "Define manual/automated boundary, provider sync, conflicts, and cancellation rules.",
            setup: "Planned; not enabled.",
            summary:
              "Future scheduling workflow that must not confirm bookings until real booking exists.",
            textGuide:
              "Explains request versus confirmed booking and owner approval rules.",
            visualGuide:
              "Show requested time, owner approval, confirmation, conflict, and cancellation states.",
          },
          sms_whatsapp_messaging: {
            activation:
              "Founder enables only after provider approval, consent, templates, and smoke tests.",
            name: "SMS / WhatsApp messaging",
            ownerGuide:
              "Confirm opt-in, templates, deliverability logs, unsubscribe, and data retention.",
            setup: "External provider and compliance setup required.",
            summary:
              "Future messaging workflow; current product does not send these messages.",
            textGuide:
              "Explains consent, manual review, send status, failed delivery, and opt-out.",
            visualGuide:
              "Show channel status, consent, draft, send review, delivery, and failure states.",
          },
          team_members: {
            activation:
              "Founder decides team level after owner-only workflow is stable.",
            name: "Team members",
            ownerGuide:
              "Define roles, invitations, RLS coverage, audit log, and offboarding path.",
            setup: "Planned; not enabled.",
            summary:
              "Future multi-user workspace access with roles and traceability.",
            textGuide:
              "Explains roles, permissions, invites, and what each member can access.",
            visualGuide:
              "Show role list, invite, pending invite, access denied, and removal states.",
          },
        },
        guideLabels: {
          draft: "Guide draft",
          ready: "Guide ready",
          required: "Guide required",
        },
        guideDetailsLabel: "Guide details",
        guidesLabel: "Guides",
        levelLabel: "Level",
        levelLabels: {
          admin: "Admin",
          core: "Core",
          custom: "Custom",
          founder: "Founder",
          pilot: "Pilot",
          plus: "Plus",
          premium: "Premium",
        },
        ownerLabel: "Owner",
        ownerGuideLabel: "Owner/admin guide",
        setupLabel: "Setup",
        stateLabels: {
          blocked_external: "External blocker",
          enabled: "Enabled",
          owner_controlled: "Owner controlled",
          planned: "Planned",
          setup_required: "Setup required",
        },
        statusLabel: "Status",
        textGuideLabel: "Text guide",
        title: "Feature levels",
        visualGuideLabel: "Visual guide",
      },
      future: "Future",
      futureSections: "Future sections",
      futureSectionsDescription:
        "Future capabilities stay listed as gated reference only until validation clears.",
      futureSectionHints: {
        billing: "Stripe Payment Links first",
        integrations: "Webhooks deferred",
        teamMembers: "Owner-only in pilot",
      },
      guardrails: "Production readiness guardrails",
      guardrailsDescription:
        "What stays true while BizPilot expands through owner-controlled feature levels.",
      guardrailItems: [
        "Do not default-enable provider, payment, or automation features.",
        "Do not imply send, booking, invoice, or payment success before BizPilot actually performs it.",
        "Every new feature needs a visual guide, text guide, owner guide, and Settings state.",
        "External blockers stay visible until API, account, DNS, provider, or payment setup is complete.",
      ],
      integrations: "Integrations",
      language: "Workspace language",
      languageDescription:
        "One language controls dashboard labels, auth copy, quote-page defaults, and owner-reviewed AI draft language.",
      languageHelp:
        "Changing this updates the business language and the interface cookie used before sign-in.",
      lifecycle: {
        deletionIneligibleBody:
          "This workspace is not currently eligible for a new deletion request, or your membership cannot request one.",
        deletionIneligibleTitle: "Workspace deletion requests are owner-only.",
        description:
          "Owner-only workspace lifecycle controls. Login account deletion is separate.",
        lifecycleStatus: "Lifecycle status",
        lockBehavior: "Lock behavior",
        lockBehaviorDescription:
          "Deletion requests lock quote links, new submissions, and AI draft generation while review is pending.",
        title: "Workspace lifecycle",
      },
      sessionPolicy: {
        afterDuration: (minutes) =>
          minutes >= 1440
            ? `Sign out after ${minutes / 1440} day${minutes === 1440 ? "" : "s"}`
            : minutes >= 60
              ? `Sign out after ${minutes / 60} hour${minutes === 60 ? "" : "s"}`
              : `Sign out after ${minutes} minutes`,
        alwaysOn: "Always on",
        description:
          "Founder-managed sign-out policy for this workspace. Changes are logged below for traceability.",
        managedByFounder:
          "Managed by BizPilot founder support. The policy is checked on dashboard requests.",
        title: "Session security",
      },
      systemHistory: {
        actions: {
          business_cancelled: "Business cancelled",
          business_deletion_requested: "Deletion requested",
          business_reactivated: "Business reactivated",
          business_suspended: "Business suspended",
          internal_note_added: "Support note saved",
          password_reset_requested: "Password reset requested",
          plan_changed: "Plan changed",
          quote_link_disabled: "Quote link disabled",
          quote_link_enabled: "Quote link enabled",
          session_policy_changed: "Session policy changed",
          status_changed: "Workspace status changed",
          temporary_password_set: "Temporary password set",
          test_auth_user_deleted: "Test login deleted",
          test_workspace_cleanup_completed: "Test workspace cleanup",
        },
        changeFallback: "Workspace setting changed",
        description:
          "A traceable owner view of founder/admin changes that affected this workspace.",
        emptyBody:
          "When BizPilot founder support changes plan, access, quote links, or session policy, the event appears here.",
        emptyTitle: "No system changes logged yet.",
        noteLabel: "Note",
        title: "System change history",
        traceLabel: "Trace",
      },
      deletionForm: {
        acknowledgement:
          "I understand this requests workspace deletion review and does not automatically delete my login account.",
        body:
          "This will lock the business workspace, disable public quote links, block new quote submissions, and stop new AI draft generation. It does not delete your login account automatically.",
        dangerZone: "Danger zone",
        dataNotice:
          "Customer data is not purged by this request. Final deletion and anonymization require a controlled review process.",
        submit: "Request workspace deletion",
        title: "Request workspace deletion",
        typeBusinessName: "Type your business name to confirm",
      },
      manualBilling: "Manual billing during production readiness.",
      notInMvp: "Not in MVP",
      plan: "Plan",
      quickLinks: "Quick links",
      signedInAs: "Signed in as",
      teamMembers: "Team members",
      theme: "Theme",
      themeDescription:
        "Hydration-safe theme. The first paint is resolved server-side.",
      themeHelp:
        "New sessions start in Light. Choose Dark or System when you want a fixed or device-based view.",
      workspace: "Workspace",
      workspaceDescription:
        "Workspace, account, theme, language, feature levels, and owner-controlled setup.",
    },
    status: {
      active: "Active",
      done: "Done",
      open: "Open",
      pilot: "Pilot",
    },
    theme: {
      dark: "Dark",
      label: "Dashboard theme",
      light: "Light",
      system: "System",
    },
    workspaceAccess: {
      businessNameLabel: "Business name",
      businessNamePlaceholder: "Your cleaning business",
      deletionRequestedBody:
        "This business workspace is locked while the deletion request is reviewed. Your login account is not deleted automatically.",
      deletionRequestedTitle: "Workspace deletion has been requested.",
      eyebrow: "Workspace access",
      pausedBody:
        "Your dashboard is currently blocked because no active business membership is available. Your data is retained; contact BizPilot support if this looks unexpected.",
      pausedTitle: "This workspace is paused or unavailable.",
      recoverWorkspace: "Recover workspace",
      recoveryHelp:
        "Use this only if signup created your login but did not finish the workspace setup.",
      signedInAs: (email) => `Signed in as ${email}`,
    },
  },
  demo: {
    aiDraftReady: "AI draft ready",
    aiSummary:
      "Warm quote request with urgency, but the owner needs home size and access details before estimating.",
    aiSummaryLabel: "AI summary:",
    copyResponse: "Copy Response",
    detailFour: "Small office cleaning. Reply copied; waiting for owner outcome.",
    detailOne: "Move-out cleaning before Friday. Missing apartment size.",
    detailThree: "Weekly cleaning lead went quiet after first reply.",
    detailTwo:
      "Deep clean request with bedrooms, bathrooms, and timing included.",
    disappearsNote:
      "This demo state is static UI only. It is not saved as a real lead and disappears as soon as real quote requests arrive.",
    featuredLeadTitle: "Maria S. - move-out cleaning",
    followUpDraft:
      "Hi Maria, just checking whether you still need help with the move-out clean. Send the apartment size and preferred time window and I can help prepare the next step.",
    followUpLabel: "Follow-up draft:",
    markContacted: "Mark Contacted",
    missingInfo:
      "Ask for apartment size, whether the unit will be empty, access details, and the preferred arrival window.",
    missingInfoLabel: "Missing info:",
    notStored: "Not stored",
    replyDraft:
      "Hi Maria, thanks for reaching out. Could you send the apartment size, preferred cleaning date, and whether the unit will be empty?",
    replyDraftLabel: "Reply draft:",
    replyNeeded: "Reply needed",
    reviewReply: "Review Reply",
    sampleAreas: ["Downtown", "Laval", "Plateau", "Westmount"],
    sampleDemoState: "Sample demo state",
    sampleLeads: [
      {
        area: "Downtown",
        customer: "Maria Santos",
        detail: "Move-out cleaning before Friday. Missing apartment size.",
        followUpDraft:
          "Hi Maria, just checking whether you still need help with the move-out clean. Send the apartment size and preferred time window and I can help prepare the next step.",
        replyDraft:
          "Hi Maria, thanks for reaching out. Could you send the apartment size, preferred cleaning date, and whether the unit will be empty?",
        status: "Missing info",
        tone: "amber",
      },
      {
        area: "Laval",
        customer: "Daniel Roy",
        detail: "Deep clean request with bedrooms, bathrooms, and timing included.",
        followUpDraft:
          "Hi Daniel, following up on your deep clean request. If the timing still works, the owner can review the details and respond with next steps.",
        replyDraft:
          "Hi Daniel, thanks for the details. I can review the request and follow up with a tailored estimate range after confirming access and priority areas.",
        status: "Draft ready",
        tone: "blue",
      },
      {
        area: "Plateau",
        customer: "Nadia Khan",
        detail: "Weekly cleaning lead went quiet after first reply.",
        followUpDraft:
          "Hi Nadia, just following up on your weekly cleaning request. If you are still comparing options, I can help answer any questions.",
        replyDraft:
          "Hi Nadia, thanks for asking about weekly cleaning. Could you confirm the home size, pets, and your preferred weekday?",
        status: "Follow-up due",
        tone: "red",
      },
      {
        area: "Westmount",
        customer: "Office Manager",
        detail: "Small office cleaning. Reply copied; waiting for owner outcome.",
        followUpDraft:
          "Hi, checking in on the office cleaning request. Let me know if you want to move forward or adjust the scope.",
        replyDraft:
          "Thanks for the office cleaning details. The owner will review the scope and respond manually with next steps.",
        status: "Copied",
        tone: "emerald",
      },
    ],
    sampleStatuses: ["Missing info", "Draft ready", "Follow-up due", "Copied"],
    shareQuoteLink: "Share Quote Link",
    suggestedNextAction:
      "Review the reply draft, copy it manually, and send it through the customer channel the owner already uses.",
    suggestedNextActionLabel: "Suggested next action:",
  },
  intakeErrors: {
    consentRequired: "Consent is required before submitting.",
    fallbackSubmit:
      "We couldn't submit the quote request. Reopen this quote link, check required fields, and try again.",
    fieldRequired: (label) => `${label} is required.`,
    formChanged: "The quote form changed. Please refresh and submit again.",
    invalidChoice: (label) => `${label} has an unavailable option.`,
    linkUnavailable: "This quote link is not available.",
    nonNegativeNumber: (label) => `${label} cannot be negative.`,
    notPastDate: (label) => `${label} cannot be in the past.`,
    rejected: "Submission rejected.",
    submittedTooFast: "Please wait a moment and submit the quote request again.",
    temporarySubmitUnavailable:
      "We couldn't submit this quote request right now. Please contact the business directly or try again later.",
    validDate: (label) => `${label} must be a valid date.`,
    validNumber: (label) => `${label} must be a valid number.`,
  },
  leadRules: {
    actionAskInfo: "Ask for missing quote details",
    actionFollowUp: "Follow up with this lead",
    actionReply: "Reply to this lead",
    actionReplyOverdue: "Reply to overdue lead",
    archiveOrReviewArea: "Review service area before replying",
    completeExplanation:
      "Contact, service, area, timing, and quote details are present.",
    followUpToday: "Follow up today",
    lowFitExplanation:
      "Outside configured service area. Details can be complete while fit remains low.",
    manuallyMarkedNotFit: "Manually marked not a fit",
    markBookedLost: "Mark booked/lost when known",
    missingExplanation: (labels) => `Missing ${labels.join(", ")}.`,
    noOpenAction: "No open action",
    outcomeBooked: "Outcome booked",
    outcomeLost: "Outcome lost",
    readyForReply: "Ready for owner reply.",
    recommendedAskInfo: "Ask for missing info",
    replyCopiedWaiting: "Reply copied, waiting for outcome.",
    responseState: (state) => `Response state is ${state}.`,
  },
  missingInfoLabels: {
    bathrooms: "bathrooms",
    bedrooms: "bedrooms",
    city_or_service_area: "service area",
    cleaning_type: "cleaning type",
    customer_contact: "contact details",
    preferred_date: "preferred date",
    preferred_time_window: "preferred time window",
    property_type: "property type",
  },
  optionLabels: {
    afternoon: "Afternoon",
    apartment: "Apartment",
    condo: "Condo",
    deep: "Deep",
    evening: "Evening",
    flexible: "Flexible",
    house: "House",
    morning: "Morning",
    move_in_move_out: "Move In Move Out",
    office: "Office",
    other: "Other",
    post_construction: "Post Construction",
    standard: "Standard",
  },
  quoteFields: {
    bathrooms: {
      helpText: "Optional bathroom count for residential jobs.",
      label: "Bathrooms",
    },
    bedrooms: {
      helpText: "Optional room count for residential jobs.",
      label: "Bedrooms",
    },
    city_or_service_area: {
      helpText: "Where the cleaning request is located.",
      label: "City or service area",
    },
    cleaning_type: {
      helpText: "The kind of cleaning requested.",
      label: "Cleaning type",
    },
    customer_contact: {
      helpText: "Email or phone so the business can follow up.",
      label: "Customer contact",
    },
    customer_email: {
      helpText: "Best email address so the business can follow up.",
      label: "Email address",
    },
    customer_name: {
      helpText: "Name of the person requesting the quote.",
      label: "Customer name",
    },
    customer_phone: {
      helpText: "Best phone number so the business can follow up.",
      label: "Phone number",
    },
    home_address: {
      helpText:
        "Street address or nearest major intersection for the cleaning request.",
      label: "Home address",
    },
    notes: {
      helpText: "Extra context for the business.",
      label: "Notes",
    },
    pets: {
      helpText: "Whether pets are present.",
      label: "Pets",
    },
    preferred_date: {
      helpText: "Customer preferred service date.",
      label: "Preferred date",
    },
    preferred_time_window: {
      helpText: "Customer preferred time window.",
      label: "Preferred time window",
    },
    property_type: {
      helpText: "The property category for the request.",
      label: "Property type",
    },
    square_footage_optional: {
      helpText: "Optional size estimate when known.",
      label: "Square footage",
    },
  },
  quoteForm: {
    aiDisclosure:
      "BizPilot may help prepare an internal draft, but the business reviews every message before sending it.",
    consentNoticeDefault:
      "By sending this request, you agree to share your information with this business so they can respond to your quote request. BizPilot may help prepare an internal draft, but the business reviews every message before sending it.",
    emptySection: "Nothing to fill on this section.",
    guardrail:
      "Submitting this form does not confirm pricing, availability, or booking.",
    selectPlaceholder: "Select an option",
    stepProgress: (index, total, label) => `Step ${index} of ${total} - ${label}`,
    steps: [
      {
        description:
          "A few quick details so the business can prepare an accurate reply.",
        id: "service",
        label: "Service",
        title: "What kind of cleaning?",
      },
      {
        description:
          "Timing and location help the business check availability and travel.",
        id: "when_where",
        label: "When & where",
        title: "When and where?",
      },
      {
        description:
          "We pass these details directly to the business. Nothing is sent automatically.",
        id: "contact",
        label: "Contact",
        title: "How should the business reach you?",
      },
    ],
    submitButton: "Send quote request",
  },
  quotePage: {
    badge: "Cleaning quote",
    description:
      "A short quote form. The business reviews every request and replies directly - nothing is sent automatically.",
    languageMenuLabel: "Quote language",
    ownerUnavailableBody:
      "This owner preview is not ready yet. Return to Quote Setup, complete the required items, then choose Save & preview to create or repair the public page.",
    ownerUnavailableCta: "Back to Quote Setup",
    ownerUnavailableTitle: "Finish quote setup first",
    subtitle: "Quote request",
    unavailableBody:
      "This quote page is not accepting requests right now. Check that the link is complete, or contact the business directly if you need help with an existing request.",
    unavailableCta: "Back to BizPilot",
    unavailableSubtitle: "Quote request",
    unavailableTitle: "Quote page unavailable",
  },
  quoteSuccess: {
    backHome: "Back home",
    body:
      "The business will review your request and follow up directly. Nothing is booked, no price is confirmed, and availability still needs business review.",
    footer: (businessName) =>
      businessName
        ? `BizPilot helps ${businessName} reply faster while keeping every message approved by the business.`
        : "BizPilot helps the business reply faster while keeping every message approved by the business.",
    meta: {
      description:
        "Quote request received for business review. No booking, price, or availability is confirmed by this page.",
      title: "Quote request received | BizPilot AI",
    },
    nextTitle: "What happens next",
    requestSent: "Request sent",
    steps: (businessName) => [
      businessName
        ? `${businessName} reviews your request and any missing details.`
        : "The business reviews your request and any missing details.",
      "They check pricing and availability before replying - no automatic messages.",
      "You hear back through the contact details you submitted.",
    ],
    submitAnother: "Submit another request",
    title: (businessName) =>
      businessName
        ? `Thanks - your request was sent to ${businessName}.`
        : "Thanks - your quote request was sent.",
  },
};

const frenchCopy: BizPilotCopy = {
  aiFallback: {
    areaFallback: "votre secteur",
    askMissingDetails: "Demander les détails manquants pour la soumission.",
    followUpDraft: (service, area) =>
      `Bonjour, je fais un suivi concernant votre demande de soumission pour ${service} à ${area}. Si vous avez toujours besoin d'aide, envoyez-moi les détails manquants et je pourrai préparer la prochaine étape.`,
    leadSummary: (qualityLevel, service, area) =>
      `Demande de soumission ${service} à ${area}, niveau ${qualityLevel}.`,
    missingNone: "J'ai les principaux détails nécessaires pour répondre.",
    missingText: (missing) =>
      missing.length > 0
        ? `Il me manque quelques détails: ${missing.join(", ")}.`
        : frenchCopy.aiFallback.missingNone,
    replyDraft: (service, missingText) =>
      `Bonjour, merci pour votre demande concernant ${service}. ${missingText} Dès que j'aurai ces informations, je pourrai réviser la demande et vous revenir avec la prochaine étape.`,
    replyWarmLead: "Répondre maintenant pendant que la demande est encore chaude.",
    serviceFallback: "nettoyage",
    toneConcise: (service, missingText) =>
      `Merci pour votre demande de ${service}. ${missingText}`,
    toneFriendly: (service, missingText) =>
      `Bonjour, merci beaucoup pour votre demande concernant ${service}. ${missingText}`,
  },
  auth: {
    backHome: "Retour",
    businessName: "Nom de l'entreprise",
    checkEmailFooter:
      "Les liens de confirmation et de réinitialisation passent par le courriel sécurisé de BizPilot.",
    checkEmailNotice:
      "Si ce courriel peut créer un nouvel espace, nous enverrons les instructions de confirmation. Si vous avez déjà utilisé ce courriel, connectez-vous ou réinitialisez votre mot de passe.",
    checkEmailResetPassword: "Réinitialiser le mot de passe",
    checkEmailSubtitle:
      "Nous envoyons la prochaine étape seulement si ce courriel peut créer un nouvel espace BizPilot.",
    checkEmailTitle: "Prochaines étapes",
    checkEmailUseAnother: "Utiliser un autre courriel",
    confirmPassword: "Confirmer le mot de passe",
    createAccount: "Créer l'accès à l'espace",
    createAccountPending: "Création de l'accès...",
    createWorkspaceFooter:
      "Accès à l'espace pour les entreprises déjà intégrées à BizPilot AI.",
    createWorkspaceSubtitle:
      "Créez votre espace BizPilot seulement si vous avez été invité ou approuvé pour le pilote.",
    createWorkspaceTitle: "Créer l'accès à l'espace",
    email: "Courriel",
    emailPasswordDivider: "ou utiliser le courriel",
    forgotPassword: "Mot de passe oublié?",
    forgotPasswordFooter:
      "La réinitialisation passe par le courriel de récupération Supabase Auth.",
    forgotPasswordQuestion: "Mot de passe retrouvé?",
    forgotPasswordSubtitle:
      "Entrez le courriel du responsable. Nous enverrons les instructions si un compte existe.",
    forgotPasswordTitle: "Réinitialiser le mot de passe",
    googleExistingWorkspaceOnly:
      "Google est réservé aux responsables deja approuves avec un espace existant. Pour créer un nouvel espace, utilisez le formulaire courriel ci-dessous.",
    googleSignIn: "Continuer avec Google",
    googleSignInHelp:
      "Connexion seulement. BizPilot ne demande pas l'accès Gmail et ne crée pas d'espace depuis Google.",
    hidePassword: "Masquer le mot de passe",
    hidePasswordShort: "Masquer",
    name: "Nom",
    needAccount: "Approuvé pour le pilote, mais vous n'avez pas encore créé votre accès?",
    needNewResetLink: "Besoin d'un nouveau lien?",
    newPassword: "Nouveau mot de passe",
    ownerAccess: "Accès à l'espace",
    password: "Mot de passe",
    passwordHelp: "Utilisez au moins 8 caractères pour votre mot de passe.",
    repeatNewPassword: "Répétez le nouveau mot de passe",
    requestAgain: "Demander à nouveau",
    routeMessages: {
      accountExists:
        "Un compte existe déjà avec ce courriel. Connectez-vous plutôt.",
      businessRequired: "Entrez le nom de votre entreprise.",
      checkEmail: "Courriel confirmé. Connectez-vous pour continuer.",
      confirmEmail: "Confirmez votre courriel avant de vous connecter.",
      emailConfirmed: "Courriel confirmé. Continuez vers votre espace.",
      emailDelivery:
        "Nous n'avons pas pu envoyer le courriel de confirmation. Attendez quelques minutes, puis réessayez.",
      emailInvalid: "Entrez une adresse courriel valide.",
      emailRequired: "Entrez votre adresse courriel.",
      genericError:
        "Nous n'avons pas pu compléter cette demande. Vérifiez le formulaire et réessayez.",
      genericNotice: "La mise à jour du compte a été reçue.",
      googleUnavailable:
        "La connexion Google n'est pas encore prête. Utilisez le courriel et le mot de passe ou demandez au fondateur de l'activer.",
      nameRequired: "Entrez votre nom.",
      newPasswordRequired: "Entrez votre nouveau mot de passe.",
      passwordIncorrect: "Le courriel ou le mot de passe est incorrect.",
      passwordMismatch: "Les mots de passe ne correspondent pas.",
      passwordRequired: "Entrez votre mot de passe.",
      passwordReuse:
        "Vous ne pouvez pas réutiliser votre ancien mot de passe. Choisissez un nouveau mot de passe pour ce compte.",
      passwordUpdated:
        "Mot de passe mis à jour. Connectez-vous avec votre nouveau mot de passe.",
      rateLimit:
        "Trop de tentatives. Attendez quelques minutes, puis réessayez.",
      reload: "Rechargez la page et réessayez.",
      resetInvalid:
        "Ce lien de réinitialisation est invalide ou expiré. Demandez un nouveau lien.",
      resetInstructions:
        "Si un compte existe, nous enverrons les instructions de réinitialisation.",
      signInFailed: "Nous n'avons pas pu vous connecter. Réessayez.",
      signUpFailed: "Nous n'avons pas pu créer votre compte. Réessayez.",
      strongPassword:
        "Utilisez un mot de passe plus fort avec au moins 8 caractères.",
    },
    resetInvalid:
      "Ce lien de réinitialisation est invalide ou expiré. Demandez un nouveau lien.",
    resetPasswordFooter: "Utilisez un mot de passe unique pour BizPilot.",
    resetPasswordReuseHelp:
      "Choisissez un nouveau mot de passe. Vous ne pouvez pas réutiliser l'ancien.",
    resetPasswordSubtitle:
      "Choisissez un nouveau mot de passe pour votre espace de travail.",
    resetPasswordTitle: "Définir un nouveau mot de passe",
    resetPreparing: "Préparation de votre session de réinitialisation...",
    resetRequestPending: "Envoi des instructions...",
    resetRequestSubmit: "Envoyer les instructions",
    signIn: "Connexion",
    signInFooter: "Accès sécurisé à votre espace BizPilot AI.",
    signInPending: "Ouverture de l'espace...",
    signInQuestion: "Vous avez déjà un compte?",
    signInSubtitle:
      "Gérez les demandes de soumission, les brouillons IA à valider et les suivis manuels depuis votre espace BizPilot.",
    signInTitle: "Connexion",
    showPassword: "Afficher le mot de passe",
    showPasswordShort: "Afficher",
    updatePassword: "Mettre à jour le mot de passe",
    updatePasswordPending: "Mise à jour...",
    yourBusiness: "Votre entreprise",
    yourName: "Votre nom",
  },
  globalError: {
    body:
      "BizPilot a intercepté une erreur sûre. Rechargez la page pour réessayer sans exposer de détails internes.",
    eyebrow: "BizPilot",
    reload: "Recharger la page",
    title: "Cette page doit être rafraîchie.",
  },
  dashboard: {
    actions: {
      copyFailed: "Copie impossible",
      copyQuoteLink: "Copier le lien",
      copySuccess: "Copié",
      displaySettings: "Réglages d'affichage",
      moreActions: "Actions",
      openLeadQueue: "Ouvrir les prospects",
      previewPublicPage: "Voir la page publique",
      previewQuotePage: "Aperçu de la soumission",
      saveConfiguration: "Enregistrer",
      signOut: "Déconnexion",
    },
    admin: {
      locale: "fr-CA",
      accessBlocked: {
        backToDashboard: "Retour au tableau de bord",
        badge: "Interne seulement",
        description:
          "Cette console est réservée aux opérations fondateur et exige une liste d'accès courriel explicite.",
        eyebrow: "Admin fondateur",
        help:
          "Définissez `BIZPILOT_FOUNDER_EMAILS` côté serveur avec les courriels fondateur approuvés, puis connectez-vous avec l'un de ces comptes.",
        signIn: "Connexion",
        title: "Accès indisponible",
      },
      businesses: {
        detail: {
          accessControl: {
            changeLabel: "Changer l'accès pour",
            description:
              "Contrôle l'admissibilité à la connexion, l'accès au tableau et l'état du cycle client visible aux opérations fondateur.",
            onboardingNote:
              "L'onboarding limite l'accès complet jusqu’à la fin de la configuration.",
            title: "Statut d'accès",
            warning:
              "Les états suspendu ou annule bloquent l'accès client. Utilisez-les seulement quand le compte doit cesser d'opérer.",
          },
          allChangesNote:
            "Tous les changements restent manuels, traçables et réversibles par le fondateur. Utilisez les contrôles avec discernement opérationnel.",
          auditLog: {
            badgeCount: (count) => `${count} consignes`,
            description:
              "Trace visible par le responsable pour les changements fondateur/admin, avec identifiants de suivi pour le soutien.",
            emptyState: "Aucun changement système consigne pour ce client.",
            lastUpdatedLabel: "Dernière mise à jour",
            notePrefix: "Note",
            notRecordedYet: "Pas encore consigne",
            title: "Journal système client",
            updatedByFounderAdmin: "Admin fondateur",
            updatedByLabel: "Mis à jour par",
          },
          cleanupDryRunCounts: "Comptes du dry run de nettoyage",
          dailyUse: "Usage quotidien",
          fullSystemChangeLog: "Journal système complet",
          internalNote: "Note interne",
          nextBadge: "Suite",
          noAdminChanges: "Aucun changement admin enregistre.",
          notesDescription:
            "Ajoutez le contexte, lancez le nettoyage, puis vérifiez la trace.",
          notesSensitive: "Sensible",
          notesTitle: "3) Notes, nettoyage et audit",
          priorityDescription:
            "Changez d'abord l'accès, le forfait et l'état de la demande publique.",
          priorityTitle: "1) Contrôles prioritaires",
          planControl: {
            changeLabel: "Changer le forfait pour",
            description:
              "Palier de facturation contrôlé par le fondateur/admin. Le client ne doit pas le changer lui-même depuis son tableau.",
            pilotNotice:
              "Le forfait pilote limité l'usage et soutient un déploiement contrôlé.",
            title: "Forfait",
            warning:
              "Les changements de forfait touchent les rapports fondateur et la préparation de facturation manuelle. Notez pourquoi le client change de palier.",
          },
          planLabels: {
            founder_pilot: "Pilote fondateur",
            paused: "En pause",
            pro: "Pro",
            starter: "Starter",
          },
          quoteLinkControl: {
            changeLabel: "Changer le lien public pour",
            description:
              "Contrôle si le formulaire public peut accepter de nouveaux prospects pour ce client.",
            inactiveNotice:
              "Le lien inactif bloque toutes les nouvelles demandes publiques.",
            title: "Lien public",
            warning:
              "Si le lien est inactif, le formulaire public est bloqué et le client ne peut pas recevoir de nouveaux prospects depuis la page publique.",
          },
          recentChangesTitle: "Changements admin récents",
          recentChangesPanel: {
            description: "Piste d'actions fondateur/admin pour la vérification du support.",
            emptyState: "Aucun changement admin enregistre pour l'instant.",
            loggedBadge: (count) => `${count} consignes`,
            viewFullActivity: "Voir le journal complet",
          },
          recommendedDescription:
            "Basé sur l'accès actuel et l'état du lien public.",
          recommendationStates: {
            activateQuoteLink:
              "Activez le lien public pour que le client puisse recevoir de nouveaux prospects.",
            blockedUntilRestored:
              "L'accès client et public doit rester bloque jusqu’àu rétablissement volontaire du compte.",
            holdQuoteLinkDuringOnboarding:
              "Gardez le formulaire public inactif jusqu’à la fin de l'onboarding et la préparation du client.",
            readyForDailyUse: "L'entreprise est prête pour l'usage quotidien.",
          },
          recommendedTitle: "Prochaine action recommandée",
          saveAccess: "Enregistrer l'accès",
          saveKind: "Enregistrer le type",
          saveNote: "Enregistrer la note",
          savePlan: "Enregistrer le forfait",
          saveQuoteLink: "Enregistrer le lien public",
          snapshotDescription: (businessName) =>
            `Résumé opérationnel rapide pour ${businessName}.`,
          snapshotTitle: "Aperçu entreprise",
          tiles: {
            accessStatus: "Statut d'accès",
            accessStatusActiveDescription:
              "Le client a un accès quotidien au tableau.",
            accessStatusLimitedDescription:
              "Accès limite au tableau et préparation du cycle de vie.",
            auditEvents: "Événements d'audit",
            plan: "Forfait",
            planDescription:
              "Le forfait est contrôlé par le fondateur. Le client ne peut pas le modifier.",
            quoteLink: "Lien public",
            quoteLinkActive: "Actif",
            quoteLinkActiveDescription:
              "Le formulaire public peut accepter de nouveaux prospects.",
            quoteLinkInactive: "Inactif",
            quoteLinkInactiveDescription:
              "Le formulaire public est bloqué. Aucun nouveau prospect ne peut entrer.",
            sessionPolicy: "Politique de session",
            sessionPolicyAlwaysOnDescription:
              "L'accès client reste actif jusqu’à la déconnexion.",
            sessionPolicyTimedDescription:
              "Les sessions client expirent après la durée choisie.",
          },
          toolsControlled: "Contrôle",
          toolsDescription:
            "Utilisez ces outils quand la configuration, la session ou le nettoyage sont incorrects.",
          toolsTitle: "2) Outils d'espace",
          viewFullCustomerProfile: "Voir le profil client complet",
          whyLabel:
            "Pourquoi : garde une expérience client claire et évite une demande publique incomplète.",
          workspaceKind: "Type d'espace",
          workspaceKindHelp:
            "Marquez seulement les espaces internes/synthétiques confirmes comme Founder test, Demo ou Seed avant nettoyage.",
          workspaceKindLabels: {
            demo: "Demo",
            founder_test: "Test fondateur",
            production_customer: "Client production",
            seed: "Seed",
          },
          safetyRail: {
            customerWorkspaceDescription:
              "Le nettoyage dur et le nettoyage des connexions test/synthétiques restent bloqués pour les espaces client production et les comptes propriétaire.",
            customerWorkspaceTitle: "L'espace client reste protégé",
            dryRunDescription:
              "Le nettoyage test/demo exige les comptes, l'accuse de reception et la confirmation exacte du nom ou slug d'entreprise.",
            dryRunTitle: "Le dry-run passe d'abord",
            guardedBadge: "Garde",
            title: "Sécurité nettoyage",
          },
        },
        emptyWorkspace: "Aucun espace entreprise n'est disponible pour l'instant.",
        hiddenMatches: (count) =>
          `Les 10 premiers espaces correspondants sont affichés. ${count} autre${count === 1 ? "" : "s"} espace${count === 1 ? "" : "s"} correspond${count === 1 ? "" : "ent"} mais reste${count === 1 ? "" : "nt"} masqué${count === 1 ? "" : "s"}. Recherchez par responsable, entreprise ou slug pour réduire la liste.`,
        intakeOff: "Demandes fermées",
        intakeOpen: "Demandes ouvertes",
        noMatches: "Aucune entreprise ne correspond à cette recherche.",
        reset: "Réinitialiser",
        searchLabel: "Rechercher des entreprises",
        searchPlaceholder: "Entreprise, responsable, slug",
        searchSubmit: "Rechercher",
        openControls: "Ouvrir les contrôles",
        operationsDescription:
          "Poste de commande fondateur pour l'accès pilote, les liens publics, l'état du forfait, la sécurité de l'espace, les notes client et les journaux d'audit.",
        operationsEyebrow: "Admin fondateur",
        operationsTitle: "Opérations entreprises",
        openInbox: "Ouvrir la boite",
        checkHealth: "Verifier la sante",
        manageUsers: "Gerer les utilisateurs",
        priorityWorkspace: "Espace prioritaire",
        selectedWorkspaceVisible:
          "L'espace sélectionné reste visible même s'il ne correspond pas à la recherche actuelle.",
        subtitle: "Sélectionnez un espace; modifiez-le dans le panneau de détail.",
        title: "Entreprises",
      },
      controls: {
        accessNotePlaceholder: "Note d'accès optionnelle",
        internalNotePlaceholder:
          "Objection, état de configuration, prochain suivi fondateur",
        planNotePlaceholder: "Note de forfait optionnelle",
        quoteLinkNotePlaceholder: "Note de lien de soumission optionnelle",
        savePolicy: "Enregistrer la politique",
        sessionPolicySummaryAfterDuration: (duration) => `Déconnexion après ${duration}`,
        sessionPolicySummaryAlwaysOn: "Toujours actif",
        sessionTimeoutDurationLabels: {
          15: "15 minutes",
          30: "30 minutes",
          60: "1 heure",
          240: "4 heures",
          480: "8 heures",
          720: "12 heures",
          1440: "24 heures",
          10080: "7 jours",
        },
        sessionTimeoutModeLabels: {
          after_duration: "Deconnecter après la durée choisie",
          always_on: "Toujours actif",
        },
        sessionPolicy: "Politique de session",
        sessionPolicyHelp:
          "Vérifiée à la prochaine requête du tableau de bord. Chaque modification est inscrite au journal système client.",
        sessionPolicyNotePlaceholder: "Raison traçable par le client",
        signOutDuration: "Durée de déconnexion",
        workspaceKindNotePlaceholder: "Pourquoi c'est sûr",
      },
      routeMessages: {
        actionFailed: "L'action admin fondateur n'a pas pu être complétée.",
        updated: "Terminé. L'espace admin a été mis à jour.",
      },
      tabs: {
        ariaLabel: "Sections admin",
        brandSubtitle: "Opérations fondateur",
        groups: {
          command: "Commande",
          operations: "Opérations",
          system: "Système",
        },
        items: {
          activity: {
            description: "Journal d'audit",
            label: "Activité",
          },
          businesses: {
            description: "Contrôles des espaces",
            label: "Entreprises",
          },
          health: {
            description: "Vérifications runtime",
            label: "Santé",
          },
          leads: {
            description: "Révision et nettoyage des prospects",
            label: "Prospects",
          },
          overview: {
            description: "Vue de commande lecture seule",
            label: "Aperçu",
          },
          users: {
            description: "Recherche, soutien, outils gardés",
            label: "Utilisateurs",
          },
        },
        snapshots: {
          active: "Actif",
          paidReady: "Prêt payé",
          paused: "En pause",
        },
      },
      theme: {
        ariaLabel: "Thème admin fondateur",
      },
      topbar: {
        badge: "Admin fondateur",
        ownerDashboard: "Tableau responsable",
        panelTitles: {
          activity: "Journal d'activité",
          businesses: "Entreprises",
          health: "Santé production",
          leads: "Boîte admin",
          overview: "Aperçu admin",
          users: "Utilisateurs",
        },
        productionCheck: "Production: vérifier",
        productionHealthy: "Production: saine",
      },
      overview: {
        activityFilters: {
          access: "Accès",
          all: "Tout",
          auth: "Auth",
          cleanup: "Nettoyage",
          notes: "Notes",
          plan: "Forfait",
          quote: "Lien public",
          system: "Système",
        },
        activityMeta: {
          actionLabels: {
            business_cancelled: "Entreprise annulee",
            business_deletion_requested: "Suppression demandee",
            business_reactivated: "Entreprise reactivee",
            business_suspended: "Entreprise suspendue",
            internal_note_added: "Note interne enregistree",
            password_reset_requested: "Reinitialisation du mot de passe demandee",
            plan_changed: "Forfait modifié",
            quote_link_disabled: "Lien public désactivé",
            quote_link_enabled: "Lien public activé",
            session_policy_changed: "Politique de session modifiee",
            status_changed: "Statut d'espace modifie",
            temporary_password_set: "Mot de passe temporaire defini",
            test_auth_user_deleted: "Utilisateur auth test supprime",
            test_workspace_cleanup_completed: "Nettoyage d'espace test",
          },
          actorFallback: (id) => `Acteur ${id}`,
          emptyValue: "vide",
          internalNotePresenceChanged: "Presence de note interne modifiee",
          internalNoteSaved: "Note interne enregistree",
          leadInboxTarget: "Boite prospects",
          noActivityYet: "Aucune activite",
          noPriorValue: "aucune valeur precedente",
          platformTarget: "Plateforme",
          stateOff: "off",
          stateOn: "on",
          systemActor: "Système",
        },
        activitySection: {
          badgeCount: (count) => `${count} consignes`,
          description:
            "Trace les ecritures fondateur/admin après autorisation. Utilisez cette piste pour le support, le nettoyage et les changements d'accès.",
          eyebrow: "Admin fondateur",
          feedTitle: "Flux des commandes d'activite",
          title: "Journal d'activite",
        },
        activitySummary: {
          byLabel: "Par",
          emptyState: "Aucune action admin consignée.",
          latestBadge: "Dernière",
          targetLabel: "sur",
          title: "Activites recentes",
          viewAll: "Voir toutes les activites",
        },
        activityZeroState: "Aucune action admin consignée.",
        healthSection: {
          description:
            "Diagnostics production en lecture seule pour les opérations fondateur. Les vérifications en echec expliquent pourquoi les comptes admin peuvent sembler vides ou incomplets.",
          eyebrow: "Admin fondateur",
          healthy: "Saine",
          needsAttention: "A verifier",
          notice:
            "Les données fondateur peuvent etre incomplètes parce qu'une ou plusieurs vérifications runtime de production ont echoue. Traitez zero utilisateur ou zero entreprise comme un signal de diagnostic tant que ce panneau n'est pas sain.",
          title: "Sante production",
        },
        leadInboxSection: {
          archive: "Archiver",
          areaNotSet: "Zone non definie",
          badgeCount: (count) => `${count} éléments boite`,
          confirmLeadId: "Saisissez l'ID prospect pour confirmer",
          contactLabel: "Contact",
          deleteAcknowledgement: "Je comprends que cette suppression est definitive.",
          deletePermanently: "Supprimer definitivement",
          description:
            "Messages entrants de soumission pour le tri fondateur. Revisez, archivez ou supprimez definitivement les envois spam/test.",
          emptyState: "Aucun element dans la boite pour l'instant.",
          leadIdLabel: "ID prospect",
          markReviewed: "Marquer revise",
          noneReferrer: "aucun",
          permanentDeleteTitle: "Suppression definitive (irreversible)",
          referrerLabel: "Referent",
          serviceNotSet: "Service non defini",
          sourceLabel: "Source",
          statusLabels: {
            archived: "Archive",
            reviewed: "Revise",
            submitted: "Soumis",
          },
          unknownSender: "Expediteur inconnu",
          unknownSource: "inconnue",
        },
        leadStatusChart: {
          ariaLabel: "Prospects par statut",
          title: "Prospects par statut",
          totalLeads: "Total prospects",
        },
        leadStatusLabels: {
          awaitingReply: "En attente de réponse",
          completed: "Complete",
          new: "Nouveau",
          quoteSent: "Devis envoyé",
          replyCopied: "Réponse copiee",
        },
        metricCards: {
          activeBusinesses: {
            detail: "Espaces actifs ou en onboarding.",
            label: "Entreprises actives",
          },
          loadedLeads: {
            detail: "Signaux de prospects charges.",
            label: "Prospects charges",
          },
          readinessCompleted: {
            detail: "Liens publics actifs.",
            label: "Préparation completee",
          },
          replyTraces: {
            detail:
              "Prospects ou actions admin avec un état lié à la réponse; aucun envoi n'est sous-entendu.",
            label: "Traces de réponse",
          },
          totalUsers: {
            detail: "Utilisateurs auth dans la recherche fondateur.",
            label: "Total utilisateurs",
          },
          usersNeedingAttention: {
            detail: "Utilisateurs prioritaires pour le support.",
            label: "Utilisateurs à surveiller",
          },
        },
        metricsPanel: {
          activePilots: {
            detail: "Entreprises en onboarding ou actives.",
            label: "Pilotes actifs",
          },
          authUsers: {
            detail: "Utilisateurs auth disponibles via recherche paginée fondateur.",
            label: "Utilisateurs auth",
          },
          description:
            "Les comptes de haut niveau restent ici comme aperçu compact au lieu d'occuper l'espace de travail.",
          paymentReady: {
            detail: "Forfaits manuels Starter ou Pro.",
            label: "Prêt paiement",
          },
          pausedAccess: {
            detail: "Accès suspendu ou annule.",
            label: "Accès en pause",
          },
          title: "Aperçu de l'espace",
        },
        newUsersNotice: {
          confirmed: "Confirme",
          daysAgo: (days) => `il y a ${days} j`,
          emailPending: "Courriel en attente",
          latestBadge: "Dernier",
          latestTitle: "Dernière activite utilisateur",
          newBadge: (count) => `${count} nouveau${count === 1 ? "" : "x"}`,
          newTitle: "Nouveaux utilisateurs detectes",
          noWorkspace: "Aucun espace",
          reviewUsers: "Voir les utilisateurs",
          today: "Aujourd'hui",
        },
        newsroom: {
          byLabel: "Par :",
          defaultFilterLabel: "Système",
          description:
            "Derniers changements fondateur/admin avec acteur, cible, catégorie, horodatage et liens directs de révision.",
          emptyState: "Aucune action admin correspondante pour l'instant.",
          noNoteRecorded: "Aucune note enregistree",
          shownBadge: (count) => `${count} affiches`,
          targetLabel: "Cible :",
          title: "Salle d'actualites admin",
          viewFullLog: "Voir le journal complet",
        },
        page: {
          actions: {
            activityLog: "Journal d'activite",
            allWorkspaces: "Tous les espaces",
            currentSnapshot: "Instantane actuel",
          },
          description:
            "Surveillez utilisateurs, espaces, flux de prospects, préparation, sante et actions recentes du fondateur depuis une vue de commande en lecture seule.",
          eyebrow: "Admin fondateur",
          title: "Aperçu admin",
        },
        productionHealthPanel: {
          actionLog: "Journal d'actions",
          authRest: "Auth REST",
          authSdk: "Auth SDK",
          businesses: "Entreprises",
          deletionRequests: "Demandes de suppression",
          diagnosticsUnavailable: "Les diagnostics runtime fondateur sont indisponibles.",
          fail: "Echec",
          healthy: "Saine",
          keyProject: "Projet de cle",
          keyProjectMatches: "Correspond",
          keyProjectMismatch: "Ecart",
          keyProjectNotEncoded: "Non encode",
          members: "Membres",
          needsAttention: "A verifier",
          noStatus: "s.o.",
          ok: "OK",
          productionHealth: "Sante production",
          profiles: "Profils",
          quoteLinks: "Liens publics",
          runtimeDescription:
            "La sante runtime n'a pas pu etre chargee sans exposer d'informations internes.",
          runtimeUnavailableDescription:
            "Diagnostics runtime en lecture seule pour les cibles Supabase, la disponibilite auth et les dependances de données admin fondateur.",
          serviceCredentialIssuerRefLabel: "Ref emetteur du secret service",
          serviceCredentialIssuerRefMismatch:
            "(ne correspond pas à la cible Supabase)",
          serviceCredentialKinds: {
            jwt_anon: "JWT anon",
            jwt_other: "JWT non service",
            jwt_service_role: "JWT service",
            missing: "Manquant",
            supabase_publishable: "Publishable",
            supabase_secret: "Secret",
            unknown: "Inconnu",
          },
          serviceKey: "Cle service",
          statusSummary: (sdkStatus, restStatus) =>
            `Statut auth : SDK ${sdkStatus} / REST ${restStatus}`,
          supabaseProjectRefLabel: "Ref projet Supabase",
          supabaseTarget: "Cible Supabase",
          supabaseTargetCanonical: "Canonique",
          supabaseTargetMismatch: "Ecart",
          title: "Sante production",
        },
        recentActionsPanel: {
          description: "Écritures service-rôle après autorisation fondateur.",
          emptyState: "Aucune action admin consignée.",
          noNote: "Aucune note",
          title: "Actions admin recentes",
        },
        systemHealthSummary: {
          actionNeeded: "Verifier",
          checks: {
            adminLog: "Journal admin",
            authService: "Service auth",
            database: "Base de données",
            deletionRequests: "Demandes de suppression",
            profiles: "Profils",
            quoteLinks: "Liens publics",
          },
          needsCheck: "A verifier",
          operational: "Opérationnel",
          title: "Sante système",
          viewSystemHealth: "Voir la sante système",
        },
        leadSourceLabels: {
          facebook: "Facebook",
          google: "Google",
          instagram: "Instagram",
          other: "Autre",
          website: "Site web",
        },
        topLeadSourcesTitle: "Principales sources de prospects",
        trackingCards: {
          activeLinkCoverage: {
            detail: "Liens publics actifs sur le total des entreprises.",
            label: "Couverture des liens actifs",
          },
          paymentReadyWorkspaces: {
            detail: "Forfaits prets paiement sur le total des entreprises.",
            label: "Espaces prets paiement",
          },
          readyQuoteLinks: {
            detail:
              "Espaces non annules avec un lien public actif.",
            label: "Liens de devis prets",
          },
          responseTimeTracking: {
            detail:
              "Exige de vrais horodatages du flux responsable avant tout reporting pilote.",
            label: "Suivi du temps de réponse",
            value: "Non active",
          },
        },
        usersMiniList: {
          allUsers: "Tous les utilisateurs",
          emptyState: "Aucun utilisateur charge.",
          leadsSuffix: "prospects",
          title: "Utilisateurs",
        },
      },
      users: {
        accountSafety: {
          description:
            "Nettoyage des connexions synthétiques/test seulement. Les comptes clients protégés restent verrouillés.",
          doubleConfirm: "Double confirmation",
          protected: "Protege",
          title: "Sécurité et nettoyage du compte",
        },
        accountSupport: {
          available: "Disponible",
          description:
            "Support auth reserve au fondateur. Preferez le courriel de réinitialisation aux mots de passe temporaires.",
          emergencyDescription:
            "Le mot de passe temporaire est réservé aux urgences et reste volontairement absent de la console. Utilisez le courriel de réinitialisation sauf si un incident de support distinct est approuvé.",
          emergencyLocked: "Mot de passe d'urgence verrouille",
          passwordResetUnavailable: "Reinitialisation indisponible",
          resetDescription:
            "Envoie un courriel de réinitialisation Supabase au compte cible et consigne une trace. Aucun mot de passe n'est affiche ni stocke ici.",
          resetUnavailableDescription:
            "La réinitialisation est desactivee pour les comptes fondateur ou sans adresse courriel.",
          restricted: "Restreint",
          sendPasswordReset: "Envoyer la réinitialisation",
          title: "Support du compte",
        },
        accessStatusLabel: "État d'accès",
        accessStatusOptions: {
          active: "Accès actif",
          all: "Tous les utilisateurs",
          cancelled: "Annulé",
          onboarding: "Intégration",
          suspended: "Suspendu",
          unlinked: "Aucune entreprise liée",
        },
        authLabel: "Auth",
        authOptions: {
          all: "Tous les états auth",
          confirmed: "Courriel confirmé",
          founder: "Comptes fondateur",
          unconfirmed: "Courriel non confirmé",
        },
        capabilityMatrix: {
          description:
            "Carte des capacites opérationnelles pour le travail fondateur/admin. Les actions destructrices ou qui changent l'accès restent explicites.",
          gateAware: "Sous garde",
          items: {
            customerAccountDeletion: {
              detail:
                "La suppression d'un vrai compte client exige sauvegarde, preuve et approbation.",
              label: "Suppression de compte client",
              value: "Bloque",
            },
            inviteRoleSuspend: {
              detail:
                "Nécessite schéma/RLS approuve par le responsable et protection du dernier propriétaire.",
              label: "Invitation / rôle / suspension",
              value: "Bloque",
            },
            leadInboxCleanup: {
              detail:
                "Revision/archivage et suppression dure par ID exact pour prospects spam/test.",
              label: "Nettoyage de la boite prospects",
              value: "Garde",
            },
            passwordReset: {
              detail:
                "Envoie un courriel de réinitialisation; les comptes fondateur restent protégés dans l'UI.",
              label: "Reinitialisation du mot de passe",
              value: "Disponible",
            },
            planStatusQuoteLink: {
              detail: "Contrôles entreprise réservés au fondateur et audités.",
              label: "Forfait, statut, lien public",
              value: "Actif",
            },
            syntheticLoginCleanup: {
              detail:
                "Confirmation exacte par courriel/ID; les utilisateurs client protégés restent bloqués.",
              label: "Nettoyage des connexions synthétiques",
              value: "Garde",
            },
          },
          title: "Matrice des capacites admin",
        },
        details: "Détails",
        directory: {
          businessLabel: "Entreprise",
          confirmedBadge: "Confirme",
          description:
            "Cherchez d'abord, puis ouvrez un seul utilisateur pour le compte, l'espace et les outils de support gardes.",
          founderBadge: "Fondateur",
          groupTitles: {
            accessStatus: "État d'accès",
            plan: "Forfait",
            priority: "Priorité",
          },
          lastSignInLabel: "Dernière connexion",
          leadsLabel: "Prospects",
          loadedCount: (count) => `${count} charges`,
          pageSizeOption: (count) => `${count} utilisateurs`,
          pageSummary: (page, totalPages) => `Page ${page} / ${totalPages}`,
          phoneLabel: "Téléphone",
          rangeSummary: (start, end, total) => `Affichage ${start}-${end} de ${total}`,
          searchModeIndexed: "Recherche indexée",
          searchModePaged: "Pagine",
          shownBadge: (count) => `${count} affiches`,
          title: "Repertoire utilisateurs",
          unconfirmedBadge: "Non confirmé",
          userIdLabel: "ID utilisateur",
        },
        hiddenByFilters:
          "Certains utilisateurs chargés sont masqués par les filtres d'accès/auth.",
        lockedAccess: {
          blocked: "Bloque",
          description: "Nécessite une garde de sécurité approuvée par le responsable.",
          items: {
            changeRole: {
              label: "Changer le rôle",
              reason:
                "Nécessite une politique de rôle approuvée et une protection du dernier propriétaire.",
            },
            inviteMember: {
              label: "Inviter un membre",
              reason:
                "Nécessite le schéma de membre d'équipe et un flux d'audit d'invitation.",
            },
            removeFromWorkspace: {
              label: "Retirer de l'espace",
              reason:
                "Nécessite audit d'appartenance, vérifications de propriété et chemin de reprise.",
            },
            suspendAccess: {
              label: "Suspendre l'accès",
              reason:
                "Nécessite un état d'accès réversible et un avis visible côté client.",
            },
          },
          title: "Gestion des accès",
        },
        next: "Suivant",
        noBusinessLinked: "Aucune entreprise liée",
        noPlan: "Aucun forfait",
        noQuoteLink: "Aucun lien de soumission",
        none: "Aucun",
        noUsers: "Aucun utilisateur trouvé.",
        overview: {
          actions: {
            businesses: "Entreprises",
            health: "Sante",
          },
          description:
            "Recherche utilisateur réservée au fondateur, support de compte, nettoyage synthétique/test et révision détaillée. Les changements de rôle et d'accès production restent bloqués jusqu’à la garde sécurité/RLS approuvée.",
          eyebrow: "Admin fondateur",
          gatedOperations: "Opérations gardees",
          metrics: {
            authUsersDescription:
              "Utilisateurs auth disponibles via pagination/recherche réservée au fondateur.",
            authUsersLabel: "Utilisateurs auth",
            noBusinessDescription:
              "Utilisateurs charges sans espace lie.",
            noBusinessLabel: "Aucune entreprise",
            pausedAccessDescription:
              "Utilisateurs chargés rattachés à un accès suspendu ou annule.",
            pausedAccessLabel: "Accès en pause",
            unconfirmedDescription:
              "Utilisateurs charges dont la confirmation courriel reste en attente.",
            unconfirmedLabel: "Non confirmés",
          },
          operatingRule: {
            description:
              "Invitation, changement de rôle, suspension, retrait et suppression de compte client exigent la garde sécurité/RLS approuvée par le responsable.",
            searchModeIndexed: "filtre auth indexé",
            searchModeLabel: "Mode de recherche",
            searchModePaged: "liste auth paginee",
            supportGuard:
              "La réinitialisation du mot de passe et le nettoyage des connexions synthétiques restent gardes.",
            title: "Regle d'exploitation",
          },
          title: "Utilisateurs",
        },
        pageAriaLabel: (page) => `Page ${page}`,
        paginationLabel: "Pagination du répertoire utilisateurs",
        previous: "Précédent",
        quoteActive: "Soumission active",
        quoteInactive: "Soumission inactive",
        reset: "Réinitialiser",
        searchLabel: "Rechercher les utilisateurs",
        searchPlaceholder: "Nom, courriel, téléphone",
        searchSubmit: "Rechercher",
        showLabel: "Afficher",
        showingRange: (start, end, total) =>
          `Affichage ${start}-${end} de ${total} utilisateur${total === 1 ? "" : "s"} auth.`,
        workspaceDetail: {
          description:
            "Contexte du compte et de l'espace en lecture seule pour la révision du fondateur.",
          fields: {
            business: "Entreprise",
            membership: "Appartenance",
            plan: "Forfait",
            quoteLink: "Lien public",
            role: "Role",
            workspaceKind: "Type d'espace",
          },
          openBusinessControls: "Ouvrir les contrôles entreprise",
          repairNotice:
            "La reparation d'espace reste une action fondateur-admin hors de cette base Utilisateurs en lecture seule.",
          title: "Detail utilisateur",
        },
        workQueuesDescription:
          "Commencez par les files de risque et de reprise, puis cherchez dans le résultat.",
        workQueuesTitle: "Files de travail",
        showingPerPage: (count) =>
          `Affichage de jusqu'à ${count} utilisateurs par page`,
      },
    },
    founderHandoff: {
      actions: {
        adminControls: "Contrôles admin",
        openFounderAdmin: "Ouvrir l'admin fondateur",
        ownerDashboard: "Tableau responsable",
        previewQuote: "Aperçu soumission",
      },
      blockedGates: [
        "Suppression de compte client",
        "Invitation, rôle, suspension ou retrait d'accès membre",
        "Approbation des données client réelles",
        "Pilote payé, facturation, paiement et automatisation des remboursements",
      ],
      description:
        "Page de transfert interne pour les opérations fondateur. Le travail admin principal se fait dans /admin; le tableau responsable reste centré sur la récupération manuelle des prospects.",
      emptyState: "Aucun espace n'est lié à ce compte pour l'instant.",
      eyebrow: "Opérations fondateur",
      metrics: {
        accessibleWorkspacesDetail:
          "Visible selon le contexte d'espace du compte connecté.",
        accessibleWorkspacesLabel: "Espaces accessibles",
        blockedGatesDetail:
          "Ne pas les franchir sans les gates de préparation approuvés.",
        blockedGatesLabel: "Gates bloqués",
        ownerWorkflowDetail:
          "La récupération manuelle reste la surface visible par le client.",
        ownerWorkflowLabel: "Flux responsable",
        primaryAdminDetail:
          "Utilisez /admin pour la révision opérationnelle multi-espaces.",
        primaryAdminLabel: "Admin principal",
      },
      safetyGates: {
        description:
          "Ces limites restent gouvernées par le standard opérationnel du projet et ne doivent pas être mélangées au polish normal du tableau.",
        title: "Gates de sécurité",
      },
      statuses: {
        blocked: "Bloqué",
        handoff: "Transfert",
        next: "Prochain",
        ownerScope: "Portée responsable",
        primaryConsole: "Console principale",
      },
      surfaceMap: {
        description:
          "Gardez chaque surface claire: opérations fondateur internes, outils responsables manuels, formulaires publics réservés aux demandes.",
        title: "Carte des surfaces admin",
      },
      surfaces: {
        currentDescription:
          "Route interne actuelle: l'utiliser comme orientation, pas comme surface admin principale.",
        currentTitle: "Cette page",
        dashboardDescription:
          "Flux responsable pour demandes de soumission, révision manuelle des brouillons IA, configuration, profil et réglages.",
        dashboardTitle: "Tableau responsable",
        founderAdminDescription:
          "Entreprises multi-espaces, forfaits, liens de soumission, notes, gates de nettoyage et journal d'audit.",
        founderAdminTitle: "Admin fondateur",
      },
      workspacePreview: {
        description:
          "Aperçu sûr et limité à l'espace responsable. Utilisez l'admin fondateur principal pour les contrôles multi-espaces.",
        title: "Aperçu de l'espace accessible",
      },
    },
    errorBoundary: {
      body:
        "BizPilot a intercepté une erreur sûre du tableau de bord. Rechargez l'espace pour réessayer sans exposer de détails internes.",
      eyebrow: "Tableau de bord",
      reload: "Recharger le tableau de bord",
      title: "Cet espace doit être rafraîchi.",
    },
    routeMessages: {
      genericError:
        "Nous n'avons pas pu compléter cette action. Vérifiez les champs et réessayez.",
      genericNotice: "Terminé. L'espace a été mis à jour.",
    },
    businessProfile: {
      accountEmailHelp: "Courriel du compte - modifiez-le dans les réglages.",
      aiNotes: "Zone de service et notes opérationnelles",
      aiNotesDescription:
        "Contexte qui aide votre équipe et l'IA à préparer de meilleurs brouillons. Les garde-fous IA et FAQ restent dans Configuration.",
      business: "Entreprise",
      businessIdentity: "Identité de l'entreprise",
      businessIdentityDescription:
        "Identité utilisée dans le tableau de bord, la page publique et le contexte des brouillons IA.",
      businessName: "Nom de l'entreprise",
      businessType: "Type d'entreprise",
      cleaning: "Nettoyage",
      description:
        "Identité de l'entreprise et contexte opérationnel. Cette section est séparée de Configuration.",
      futureDescription:
        "Ces champs restent verrouillés jusqu'à ce que le pilote confirme le besoin de stockage et d'une migration approuvée.",
      futureFields: "Champs de profil verrouillés",
      languageHelp:
        "Utilisée pour la page publique et la langue des brouillons IA.",
      logoUrl: "URL du logo",
      notInMvp: "Hors MVP",
      oneAreaPerLine:
        "Une zone par ligne. Utilisée pour scorer les prospects et expliquer la couverture.",
      openQuoteSetup: "Ouvrir Configuration",
      ownerEmail: "Courriel du responsable (lecture seule)",
      preferredLanguage: "Langue préférée",
      previewQuotePage: "Aperçu page de soumission",
      publicQuoteLink: "Lien public",
      publicSlug: "Slug public",
      roadmapFields: [
        ["Nom public du responsable", "Phase 18B"],
        ["Téléphone du responsable", "Phase 18B"],
        ["Site web public", "Phase 18B"],
        ["Ville", "Phase 18B"],
        ["Province", "Phase 18B"],
        ["Heures de réponse", "Phase 18B"],
      ],
      save: "Enregistrer le profil",
      saveNote:
        "L'enregistrement conserve les changements d'identité. Les questions du formulaire se gèrent dans Configuration.",
      serviceAreas: "Zones desservies",
      serviceAreasPlaceholder: "Montréal\nLaval\nLongueuil",
      templateName: "Nom du modèle de soumission",
      verticalHelp:
        "Le périmètre actuel reste concentré sur le nettoyage. Les autres verticales restent verrouillées jusqu'à validation.",
    },
    configuration: {
      basics: {
        businessName: "Nom de l'entreprise",
        description:
          "Identité principale utilisée dans l'espace protégé et le lien public.",
        languageHelp:
          "Contrôle le texte de la page publique et la langue des brouillons IA.",
        preferredLanguage: "Langue préférée",
        publicSlug: "Slug public",
        templateName: "Nom du modèle",
        title: "Bases du lien public",
      },
      bottomBar: {
        openPublicQuoteLink: "Enregistrer et prévisualiser",
        saveConfiguration: "Enregistrer",
        text: "L'enregistrement applique la configuration et répare le lien public avant l'aperçu.",
      },
      branding: {
        accentAppears:
          "L'accent apparaît sur la progression, le focus et les éléments de soutien.",
        accentColor: "Couleur d'accent",
        addLogoAndColors: "Ajouter logo et couleurs",
        colorsConfigured: "Couleurs prêtes",
        description:
          "Réglages visuels publics pour l'expérience de soumission de nettoyage.",
        fileError: "Choisissez un logo PNG, JPG ou WebP de moins de 2 Mo.",
        logoAndColorsConfigured: "Logo et couleurs configurés",
        logoPreviewAlt: "Aperçu du logo",
        logoPreview: "Aperçu du logo",
        logoUrl: "URL du logo",
        logoUrlHelp: "Autre option : collez une URL d'image HTTPS sécurisée.",
        primaryColor: "Couleur principale",
        publicQuoteButton: "Bouton de soumission public",
        removeLogo: "Retirer le logo",
        resetColors: "Réinitialiser les couleurs",
        submitQuoteRequest: "Envoyer la demande",
        title: "Marque",
        uploadHelp: "PNG, JPG ou WebP jusqu'à 2 Mo. BizPilot le redimensionne avant l'enregistrement.",
        uploadLogo: "Choisir un fichier de logo",
        whereColorsApply: "Où ces couleurs s'appliquent",
      },
      fields: {
        addAnotherField: "Ajouter un champ",
        addCustomField: "Ajouter un champ",
        advancedSettings: "Paramètres avancés",
        chooseStarter: "Commencer avec une question recommandée",
        close: "Fermer",
        customFieldBuilder:
          "Créez des questions internes. Les options apparaissent seulement quand le type du champ les exige.",
        customerFacingQuestion: "Question visible par le client",
        customerQuestion: "Question client",
        customize: "Personnaliser",
        description:
          "Choisissez les questions affichées sur le formulaire public, ajoutez des champs internes et définissez leur priorité.",
        emptyBody: "Ajoutez une question vide ou choisissez une question de nettoyage recommandée ci-dessus.",
        emptyTitle: "Aucune nouvelle question personnalisée",
        fieldKey: "Clé du champ",
        fieldKeyHelp:
          "Optionnel. Lettres minuscules, chiffres et traits de soulignement. Laissez vide pour générer depuis le libellé.",
        helperText: "Texte d'aide",
        hidden: "Non visible",
        newFieldName: "Nouvelle question client",
        optional: "Optionnel",
        options: "Options",
        optionsHelp:
          "Pour les champs de liste, radio ou plage horaire. Une option par ligne ou séparée par une virgule.",
        placeholders: {
          boolean: {
            fieldKey: "animaux_maison",
            helper: "Utile si l'équipe doit se préparer pour des animaux.",
            label: "Avez-vous des animaux à la maison?",
            options: "",
            preview: "Le client coche une case.",
          },
          date: {
            fieldKey: "date_menage_souhaitee",
            helper: "Demandez la date idéale du service.",
            label: "Date de ménage souhaitée",
            options: "",
            preview: "Le client choisit une date.",
          },
          email: {
            fieldKey: "courriel_facturation",
            helper:
              "À utiliser seulement si ce courriel diffère du contact principal.",
            label: "Courriel de facturation",
            options: "",
            preview: "nom@exemple.com",
          },
          number: {
            fieldKey: "nombre_chambres",
            helper: "Les nombres aident à estimer le temps et l'équipe.",
            label: "Combien de chambres?",
            options: "",
            preview: "Exemple de réponse : 3",
          },
          phone: {
            fieldKey: "telephone_rappel",
            helper:
              "Meilleur numéro si le responsable doit confirmer les détails.",
            label: "Téléphone de rappel",
            options: "",
            preview: "(555) 123-4567",
          },
          radio: {
            fieldKey: "logement_meuble",
            helper:
              "Radio convient quand le client doit choisir une seule réponse.",
            label: "Le logement est-il meublé?",
            options: "Oui\nNon\nPartiellement",
            preview: "Une seule option visible est choisie.",
          },
          select: {
            fieldKey: "type_propriete",
            helper:
              "La liste déroulante garde les longues listes compactes.",
            label: "Type de propriété",
            options: "Appartement\nCondo\nMaison\nBureau",
            preview: "Le client ouvre une liste.",
          },
          text: {
            fieldKey: "instructions_stationnement",
            helper: "Réponse courte affichée avec la demande.",
            label: "Instructions de stationnement ou d'accès",
            options: "",
            preview: "Exemple : utilisez le stationnement visiteur.",
          },
          textarea: {
            fieldKey: "demandes_speciales",
            helper: "Utilisez un texte long pour les détails à expliquer.",
            label: "Autre chose à savoir?",
            options: "",
            preview: "Le client écrit une note plus longue.",
          },
          time_window: {
            fieldKey: "plage_arrivee_souhaitee",
            helper: "Les plages horaires facilitent la planification.",
            label: "Plage d'arrivée souhaitée",
            options: "Matin, 8-11\nAprès-midi, 12-3\nSoir, 4-7",
            preview: "Le client choisit une plage horaire.",
          },
        },
        position: "Position",
        priority: "Priorité",
        recommendedQuestions: "Recommandées pour les soumissions de nettoyage",
        removeField: "Retirer le champ",
        required: "Requis",
        showOnPublicForm: "Afficher sur le formulaire public",
        title: "Questions du formulaire",
        type: "Type",
        typeLabels: {
          boolean: "Case à cocher",
          date: "Date",
          email: "Courriel",
          number: "Nombre",
          phone: "Téléphone",
          radio: "Radio",
          select: "Liste déroulante",
          text: "Texte",
          textarea: "Texte long",
          time_window: "Plage horaire",
        },
        visible: "Visible",
        visibleOnForm: "Visible sur le formulaire",
      },
      faq: {
        clearExamples: "Effacer",
        description:
          "Faits approuvés par le responsable qui aident BizPilot à préparer des brouillons plus sûrs. Chaque brouillon exige toujours votre révision.",
        examples: [
          "Apportez-vous les fournitures? | Oui, nous apportons les fournitures de nettoyage courantes, sauf si vous préférez les vôtres.",
          "Quelles zones desservez-vous? | Nous desservons les zones indiquées sur cette page; partagez votre adresse et nous confirmerons la couverture.",
          "Offrez-vous le nettoyage de déménagement? | Oui, choisissez ce service et indiquez la taille du logement et les détails d'accès.",
          "Comment le prix est-il confirmé? | Nous révisons les détails avant de confirmer une soumission; le formulaire ne crée pas un prix final.",
          "Quand répondrez-vous? | Nous révisons manuellement les nouvelles demandes et répondons après vérification des détails et des disponibilités.",
        ],
        guardrailTitle: "Comment BizPilot utilise ces renseignements",
        guardrails: [
          "Utilise seulement les réponses enregistrées ici.",
          "N'invente ni prix ni disponibilité.",
          "Garde les renseignements manquants visibles.",
          "Crée un brouillon à réviser, jamais un envoi automatique.",
        ],
        help: "Une FAQ par ligne. Format: Question? | Réponse",
        label: "FAQ",
        loadExamples: "Charger 5 exemples",
        placeholder: "Apportez-vous les fournitures? | Oui, nous apportons les fournitures standards.",
        summary: (count) => `${count} FAQ`,
        title: "Instructions IA et FAQ",
      },
      headerDescription: (businessName) =>
        `Configurez l'expérience de soumission, le lien public, le consentement et la base de récupération pour ${businessName}.`,
      noBusinessDescription:
        "Aucune entreprise locataire n'est disponible pour cet utilisateur.",
      notifications: {
        channels: {
          sms: "SMS",
          whatsapp: "WhatsApp",
        },
        description:
          "Le premier pilote est manuel: vous vérifiez le tableau de bord. Les notifications courriel, SMS et WhatsApp restent désactivées avant validation.",
        emailActive: "Vérification manuelle du tableau de bord",
        futureDisabled: "Desactive avant validation",
        newQuoteRequest: "Nouvelle demande",
        off: "Désactivé",
        ownerEmail: "Courriel du responsable",
        summary:
          "Vérification manuelle du tableau de bord - notification courriel différée",
        title: "Notifications",
      },
      overview: {
        branding: "Marque",
        colorsReady: "Couleurs prêtes",
        complete: (completed, total) => `${completed}/${total} complété`,
        coveredAreas: (count) => `${count} zones couvertes`,
        description:
          "Résumé opérationnel du lien public, de la préparation et de l'expérience client.",
        done: "Terminé",
        faqs: "FAQ",
        logoConfigured: "Logo configuré",
        open: "Ouvert",
        previewPublicQuote: "Aperçu du lien public",
        privacy: "Confidentialité",
        profile: "Profil",
        publicLink: "Lien public",
        quoteForm: "Formulaire",
        serviceAreas: "Zones desservies",
        serviceRecords: (count) => `${count} services`,
        services: "Services",
        setupReport: "Rapport de configuration",
        summary: (completed, total) => `${completed}/${total} éléments complétés`,
        title: "Vue d'ensemble de la configuration",
        visibleQuestions: (visible, total) => `${visible}/${total} questions visibles`,
        workspaceReadiness: "Préparation de l'espace",
      },
      privacy: {
        aiDisclosure: "Afficher la divulgation IA",
        consentHelp:
          "Affiché sur la page publique. Si le champ est vide, une valeur sécuritaire est enregistrée pour garder le consentement valide.",
        consentNotice: "Avis de consentement",
        description:
          "Réglages de consentement et de conservation pour les demandes publiques.",
        forwardOnly: "Transfert seulement (planifie)",
        leadRetentionDays: "Jours de conservation",
        minimal: "Données minimales",
        privacyContactEmail: "Courriel de confidentialité",
        privacyMode: "Mode de confidentialité",
        standard: "Standard",
        summary: (mode, days) => `${mode} - ${days} jours`,
        title: "Confidentialité",
      },
      publicPage: {
        copyLink: "Copier le lien unique",
        description:
          "Page de soumission partageable générée à partir du slug actif et du formulaire.",
        placementTitle: "Où le partager",
        placements: [
          "Bio Instagram et Facebook ou réponse aux messages",
          "Message d'accueil ou réponse rapide WhatsApp Business",
          "Bouton de soumission sur votre site web",
          "Signature courriel et fiche d'établissement Google",
        ],
        previewPublicPage: "Aperçu public",
        publicQuoteLink: "Lien public",
        saveBeforePreview:
          "Enregistrez les changements avant de prévisualiser la marque, le consentement, les services et les questions.",
        title: "Lien public et page de soumission",
        uniqueLinkDescription:
          "Cette adresse destinée aux clients appartient uniquement à cette entreprise. Enregistrez la configuration avant de la partager.",
        uniqueLinkTitle: "Lien de soumission de votre entreprise",
      },
      readiness: {
        description: (completed, total) => `${completed}/${total} tâches complétées.`,
        fixFirst: (task) =>
          `Terminez "${task}" avant de partager le lien de soumission.`,
        manualOnly: "Configuration contrôlée par le responsable",
        nextAction: "Prochaine action de configuration",
        readyToShare: "Prêt à partager",
        readyState: "Prêt au partage manuel",
        reviewChecklist: "Revoir la liste",
        shareWhenReady:
          "Tous les éléments de configuration sont termines. Enregistrez, previsualisez le lien public, puis partagez-le manuellement dans vos canaux existants.",
        setupInProgress: "Configuration en cours",
        title: "Préparation du lien public",
      },
      services: {
        areasHelp: "Exemple: Montréal, Laval, Longueuil, Rive-Sud",
        description:
          "Entrez une ville, un quartier ou une région par ligne. Les prospects hors zone peuvent être marqués comme moins compatibles.",
        serviceAreas: "Zones desservies",
        services: "Services",
        servicesHelp: "Un service par ligne. Format: Nom du service | Note optionnelle",
        summary: (serviceCount, areaCount) =>
          `${serviceCount} services - ${areaCount} zones`,
        title: "Services et zones couvertes",
      },
      side: {
        brandingPreview: "Aperçu de la marque",
        publicQuoteColors: "Couleurs du lien public",
        publicQuoteLink: "Lien public",
        saveThenPreview:
          "Enregistrez les changements, puis prévisualisez le parcours client.",
        workspaceReadiness: "Préparation de l'espace",
      },
      tabs: {
        ariaLabel: "Sections de configuration",
        ai: "Instructions IA",
        basics: "Bases publiques",
        branding: "Marque",
        fields: "Questions",
        link: "Lien public",
        notifications: "Notifications",
        overview: "Vue d'ensemble",
        privacy: "Confidentialité",
        readiness: "Prêt",
        services: "Services",
      },
    },
    leadQueue: {
      age: {
        ago: "",
        day: (count) => `${count} j`,
        hour: (count) => `${count} h`,
        minute: (count) => `${count} min`,
        notAvailable: "-",
        olderDateLocale: "fr-CA",
      },
      empty: {
        clearFilters: "Réinitialiser",
        filteredBody:
          "Essayez une autre recherche, réinitialisez les filtres ou triez par demandes récentes.",
        filteredTitle: "Aucun prospect ne correspond à ces filtres.",
        noLeadsBody:
          "Partagez votre lien de soumission pour commencer à recevoir des demandes.",
        noLeadsTitle: "Aucune demande pour l'instant.",
      },
      fallbacks: {
        area: "Secteur à confirmer",
        service: "Service non défini",
        unnamedLead: "Prospect sans nom",
      },
      filters: {
        aiReady: "Brouillon IA prêt",
        all: "Tous les statuts",
        atRisk: "À risque",
        lost: "Perdu",
        missingInfo: "Infos manquantes",
        needsReply: "Réponse requise",
        reviewed: "Révisé",
        won: "Gagné",
      },
      headers: {
        customer: "Client",
        location: "Lieu",
        nextAction: "Prochaine action",
        requested: "Demandé",
        service: "Service",
        status: "Statut",
      },
      pagination: {
        navigationLabel: "Pagination de la file de prospects",
        next: "Suivant",
        pageButtonAriaLabel: (page) => `Page ${page}`,
        pageRange: (start, end, total) => `Affichage ${start}-${end} sur ${total}`,
        pageSizeAriaLabel: "Choisir le nombre de lignes par page",
        pageSizeLabel: "Lignes",
        pageSizeOption: (count) => `${count} par page`,
        pageStatus: (current, total) => `Page ${current} de ${total}`,
        previous: "Précédent",
      },
      reset: "Réinitialiser",
      searchPlaceholder: "Rechercher prospects, ville, service...",
      sorts: {
        mostUrgent: "Plus urgent",
        newest: "Plus récent",
        oldest: "Plus ancien",
      },
      priorityHint:
        "L'ordre de priorité met d'abord les demandes en retard, les détails manquants, les nouveaux prospects et les actions ouvertes.",
      resultSummary: (visible, total) => `${visible}/${total} visibles`,
      searchAriaLabel: "Rechercher dans la file de récupération",
      filterAriaLabel: "Filtrer les prospects par statut",
      sortAriaLabel: "Trier les prospects",
      status: {
        archived: "Archivé",
        atRisk: "À risque",
        lost: "Perdu",
        missingInfo: "Infos manquantes",
        needsReply: "Réponse requise",
        reviewed: "Révisé",
        won: "Gagné",
      },
    },
    leadDetail: {
      actionItems: "Actions",
      ai: {
        copyFollowUp: "Copier le suivi",
        copyReply: "Copier la réponse",
        editManually: "Modifier manuellement",
        editManuallyTitle:
          "La modification intégrée est une amélioration de flux future.",
        estimatedCost: "Coût estimé",
        fallbackReason: "Raison du repli IA",
        followUpDraft: "Brouillon de suivi",
        generate: "Générer un brouillon IA",
        guardrails: "Garde-fous IA",
        guardrailBadges: [
          "Aucun envoi automatique",
          "Aucun prix inventé",
          "À valider par vous",
        ],
        manualDraftDescription:
          "Générez un brouillon quand vous êtes prêt. BizPilot prépare un résumé, une réponse, un suivi et la prochaine action. Vous validez, copiez et envoyez manuellement.",
        missingInfo: "Infos manquantes",
        modelDraft: "Brouillon modèle",
        nextAction: "Prochaine action",
        noSend:
          "Aucun bouton d'envoi dans le MVP. Vous copiez, modifiez et envoyez manuellement.",
        ownerReviewRequired: "Validation requise",
        regenerate: "Regénérer",
        ruleFallback: "Repli par règles",
        source: "Source",
        suggestedReply: "Réponse suggérée",
        title: "Soutien brouillon IA",
      },
      backToQueue: "Retour à la file de récupération",
      completeAction: "Compléter",
      copiedDone: "Terminé",
      detailDescription: (service, area, age) =>
        `Demande ${service} - ${area} - reçue ${age}`,
      fields: {
        cityArea: "Ville / secteur",
        contact: "Contact",
        name: "Nom",
        serviceType: "Type de service",
        source: "Source",
        submitted: "Soumis",
      },
      fallbacks: {
        area: "Secteur manquant",
        contact: "Aucun contact capturé",
        service: "Service non défini",
        source: "Lien de soumission",
        unnamedLead: "Prospect sans nom",
      },
      labels: {
        manualOutcome: "Résultat manuel",
        primaryIssue: "Point principal",
        recommendedAction: "Action recommandée",
        status: "Statut",
      },
      mark: "Marquer",
      markReplyCopied: "Marquer la réponse copiée",
      markWon: "Noter gagné manuellement",
      manualWorkflow: {
        description:
          "Commencez par l'action propriétaire la plus sûre: révisez la demande, utilisez le brouillon IA seulement comme soutien, puis copiez et envoyez par votre canal client habituel.",
        outcomeNote:
          "Notez gagné ou perdu seulement après avoir contacté le client hors de BizPilot.",
        primaryAction: "Marquer copie après copie",
        secondaryAction: "Noter le résultat après contact",
        steps: [
          ["Réviser", "Vérifier la demande et les détails manquants."],
          ["Brouillon", "Générer ou vérifier la réponse aidée par l'IA."],
          ["Copier", "Modifier et envoyer par votre canal habituel."],
          ["Noter", "Mettre à jour le statut après le contact manuel."],
        ],
        title: "Prochaine étape manuelle",
      },
      missing: {
        description:
          "Demandez ces détails avant d'estimer ou de promettre une disponibilité.",
        noRequiredMissing: "Aucun détail requis ne manque",
        title: "Informations manquantes détectées",
      },
      noActionItemsBody: "Les tâches de réponse et de suivi apparaîtront ici.",
      noActionItemsTitle: "Aucune action",
      noTimelineBody:
        "L'activité du prospect apparaîtra ici pendant votre validation.",
      noTimelineTitle: "Aucun événement",
      notProvided: "Non fourni",
      notYet: "Pas encore",
      ownerNotes: {
        description:
          "Bloc-notes privé pour apprendre pendant le pilote et améliorer les suivis. Gardez toute information importante dans votre système opérationnel jusqu'à l'approbation des notes sauvegardées.",
        persistenceNote:
          "Non sauvegardé: les notes persistantes restent une décision de stockage verrouillée pour une phase approuvée plus tard.",
        placeholder:
          "Ajoutez des notes sur la demande, les objections, le contexte de prix ou le résultat du suivi...",
        title: "Bloc-notes privé",
      },
      quoteIntakeFields: "Champs de soumission",
      sourceAttribution: {
        description:
          "Contexte de provenance capturé pour cette demande. Utilisez-le pour comprendre où le lien de soumission a fonctionné; ce n'est pas un rapport analytique complet.",
        fields: {
          referrer: "Référent",
          sourceUrl: "URL source",
          utmCampaign: "Campagne UTM",
          utmMedium: "Média UTM",
          utmSource: "Source UTM",
        },
        title: "Attribution source",
      },
      routing: {
        badges: ["Révision humaine requise", "Aucune assignation automatique"],
        description:
          "Suggestion de routage par règles pour les demandes de nettoyage. Rien n'est assigné ou envoyé automatiquement.",
        missingInfoLabel: "Infos manquantes",
        nextActionLabel: "Prochaine action",
        noMissingInfo: "Aucun blocage de routage détecté",
        priorityLabel: "Priorité",
        priorities: {
          high: "Priorité élevée",
          review: "Révision requise",
          standard: "Priorité standard",
        },
        queueLabel: "File suggérée",
        queues: {
          commercial_cleaning: "Nettoyage commercial",
          intake_review: "Révision de demande",
          move_out_cleaning: "Nettoyage de déménagement",
          owner_review: "Validation",
          recurring_opportunity: "Occasion récurrente",
        },
        reasonLabel: "Raison",
        reasons: {
          commercial_request: "Demande commerciale ou bureau",
          follow_up_due: "Suivi dû",
          missing_required_info: "Détails requis manquants",
          move_out_request: "Demande de nettoyage de déménagement",
          outside_service_area: "Hors zone desservie configurée",
          preferred_date_soon: "Date souhaitée bientôt",
          ready_for_owner_reply: "Prêt pour votre réponse",
          recurring_request: "Occasion de nettoyage récurrent",
          response_overdue: "Réponse en retard",
        },
        reviewerLabel: "Réviseur suggéré",
        reviewers: {
          owner: "Vous",
        },
        nextActions: {
          ask_missing_info:
            "Demander les informations manquantes avant d'estimer.",
          follow_up: "Faire un suivi avec le client aujourd'hui.",
          owner_review:
            "Réviser la demande et préparer une réponse manuelle.",
          reply_fast:
            "Répondre vite pendant que le client compare encore.",
          review_service_area:
            "Vérifier la zone desservie avant de soumettre ou d'archiver.",
        },
        title: "Routage intelligent des demandes",
      },
      save: "Enregistrer",
      sections: {
        controlsDescription:
          "Vous contrôlez le statut et le résultat manuel. Rien n'est envoyé, réservé ou changé automatiquement.",
        controlsTitle: "Contrôles du prospect",
        leadDetailsDescription:
          "Valeurs capturées depuis le formulaire public.",
        leadDetailsTitle: "Détails du prospect",
      },
      manualOutcomeHelp:
        "Utilisez le résultat manuel seulement après que le responsable a répondu ou confirmé le résultat hors de BizPilot.",
      statusLabels: {
        archived: "Archivé",
        action_completed: "Action complétée",
        ask_info: "Demander infos",
        asked_info: "Infos demandées",
        booked: "Gagné (résultat manuel)",
        completed: "Complété",
        dismissed: "Ignoré",
        follow_up: "Suivi",
        follow_up_due: "Suivi dû",
        follow_up_marked: "Suivi marqué",
        follow_up_needed: "Suivi requis",
        lead_created: "Prospect créé",
        lead_viewed: "Prospect vu",
        lost: "Perdu",
        low_fit: "Peu compatible",
        new: "Nouveau",
        no_response: "Sans réponse",
        not_a_fit: "Pas compatible",
        open: "Ouvert",
        overdue: "En retard",
        outcome_marked: "Résultat marqué",
        reply: "Réponse",
        reply_copied_event: "Réponse copiée",
        replied: "Répondu",
        reply_copied: "Réponse copiée",
        reviewed: "Révisé",
        score_calculated: "Score calculé",
        status_changed: "Statut modifié",
        viewed: "Vu",
      },
      timeline: "Chronologie",
      values: {
        no: "Non",
        yes: "Oui",
      },
    },
    leadsPage: {
      active: "Actif",
      command: {
        countLabel: (count, total) => `${count} sur ${total} dans cette file`,
        manualOnly: "Révision manuelle seulement",
        noMatchingLead:
          "Rien n'attend dans cette file pour l'instant. Gardez la configuration prête et revenez à la file complète quand de nouvelles demandes arrivent.",
        routeLabel: "File actuelle",
        safeAction: "Prochaine action manuelle la plus sûre",
        secondaryLabel: "Ouvrir le guide",
        states: {
          ai_ready: {
            description:
              "Commencez par le premier prospect qui peut utiliser un brouillon à réviser. Copiez, modifiez et envoyez hors BizPilot seulement après vérification.",
            emptyDescription:
              "Aucun prospect avec brouillon prêt n'attend. Utilisez la file complète pour revoir les nouvelles demandes ou les écarts de configuration.",
            emptyPrimaryLabel: "Retour à tous les prospects",
            emptyTitle: "Aucun brouillon prêt dans cette file.",
            primaryLabel: "Réviser le brouillon",
            title: "Réviser le prochain prospect avec brouillon prêt.",
          },
          all: {
            description:
              "Travaillez la file dans l'ordre de récupération: demandes en retard, infos manquantes, nouvelles demandes, puis résultats déjà revus.",
            emptyDescription:
              "Aucune demande de soumission n'est capturée. Gardez la configuration complète et partagez le lien depuis vos canaux existants.",
            emptyPrimaryLabel: "Vérifier la configuration",
            emptyTitle: "Aucune demande de soumission capturée.",
            primaryLabel: "Réviser le premier prospect",
            title: "Traiter d'abord la demande la plus prioritaire.",
          },
          at_risk: {
            description:
              "Ouvrez la plus ancienne demande à risque avant les demandes déjà revues ou archivées. Le responsable décide toujours quoi envoyer.",
            emptyDescription:
              "Aucun prospect à risque n'attend. Continuez à vérifier les nouvelles demandes avant qu'elles deviennent à risque.",
            emptyPrimaryLabel: "Retour à tous les prospects",
            emptyTitle: "Aucun prospect à risque pour l'instant.",
            primaryLabel: "Réviser le prospect à risque",
            title: "Récupérer le prospect à risque d'abord.",
          },
          lost: {
            description:
              "Utilisez cette file pour inspecter les pertes fermées manuellement sans les mélanger au travail de réponse du jour.",
            emptyDescription:
              "Aucun résultat perdu n'est enregistré. Retournez à la file active pour le travail manuel en cours.",
            emptyPrimaryLabel: "Retour à tous les prospects",
            emptyTitle: "Aucun résultat perdu dans cette file.",
            primaryLabel: "Réviser le détail perdu",
            title: "Inspecter le résultat perdu fermé.",
          },
          missing_info: {
            description:
              "Ouvrez la première demande avec détails manquants et demandez seulement l'information nécessaire pour préparer une soumission utile.",
            emptyDescription:
              "Aucun prospect avec infos manquantes n'attend. Continuez avec les demandes prêtes à réponse ou à risque.",
            emptyPrimaryLabel: "Retour à tous les prospects",
            emptyTitle: "Aucune info manquante pour l'instant.",
            primaryLabel: "Demander les infos",
            title: "Demander les détails manquants d'abord.",
          },
          needs_reply: {
            description:
              "Ouvrez la première demande qui attend une réponse. Révisez le brouillon, modifiez au besoin, puis copiez et envoyez manuellement.",
            emptyDescription:
              "Aucun prospect n'attend une réponse. Vérifiez la file complète ou gardez la configuration prête.",
            emptyPrimaryLabel: "Retour à tous les prospects",
            emptyTitle: "Aucune réponse requise pour l'instant.",
            primaryLabel: "Réviser la réponse",
            title: "Répondre à la prochaine demande en attente.",
          },
          reviewed: {
            description:
              "Utilisez cette file pour auditer les demandes déjà revues sans retirer l'attention du travail ouvert.",
            emptyDescription:
              "Aucun prospect révisé n'est enregistré. Commencez par la file active quand de nouvelles demandes arrivent.",
            emptyPrimaryLabel: "Retour à tous les prospects",
            emptyTitle: "Aucun prospect révisé dans cette file.",
            primaryLabel: "Réviser le détail complété",
            title: "Inspecter le détail du prospect révisé.",
          },
          won: {
            description:
              "Utilisez les résultats gagnés comme preuve manuelle du travail réalisé, pas comme une promesse de revenu automatisée.",
            emptyDescription:
              "Aucun résultat gagné n'est enregistré. Gardez la file du jour concentrée sur les demandes actuelles.",
            emptyPrimaryLabel: "Retour à tous les prospects",
            emptyTitle: "Aucun résultat gagné dans cette file.",
            primaryLabel: "Réviser le détail gagné",
            title: "Inspecter le résultat gagné fermé.",
          },
        },
      },
      atRiskBadge: (count) => `${count} à risque`,
      focusAtRiskDescription: (count) =>
        `${count} prospect${count === 1 ? "" : "s"} à risque. Révisez-les avant les demandes déjà validées ou archivées.`,
      focusHealthyDescription:
        "Aucun prospect à risque pour l'instant. Continuez à vérifier les nouvelles demandes.",
      focusTitle: "Focus récupération du jour",
      lastSubmission: (age) => `Dernière demande: ${age}.`,
      missingInfoBadge: (count) => `${count} infos manquantes`,
      newBadge: (count) => `${count} nouveau${count === 1 ? "" : "x"}`,
      openQuoteSetup: "Ouvrir Configuration",
      quoteLinkHealth: "Santé du lien public",
      statusRulesBody:
        "Nouveau -> Réponse requise -> Validé / Gagné / Perdu. Les brouillons IA restent à valider par vous; aucun envoi automatique.",
      statusRulesTitle: "Règles de statut",
    },
    guide: {
      actions: {
        openQueue: "Ouvrir la file",
        openSetup: "Ouvrir Configuration",
        viewSettings: "Voir les réglages d'affichage",
      },
      boundaries: {
        description:
          "Ces limites gardent le tableau de bord honnete pour le pilote actuel.",
        items: [
          "Aucun envoi automatique, aucune reservation, aucune facture et aucun paiement.",
          "Aucun prix, disponibilite ou engagement client invente.",
          "Aucune purge production, aucune ouverture de données reelles et aucune porte de pilote payant sans approbation explicite.",
        ],
        title: "Limites manuelles",
      },
      gaps: {
        description:
          "Les ecarts connus restent visibles sans pretendre qu'ils sont deja actives.",
        items: [
          ["QA visuelle et focus", "La vérification clavier/focus et captures d’écran reste à faire avant un pilote payant."],
          ["Vues sauvegardees de file", "Utile après avoir observe les vrais comportements du responsable."],
          ["Assignation d'équipe", "Bloqué jusqu’à l'approbation de la porte accès équipe et RLS."],
          ["Notifications automatisées", "Courriel, SMS et WhatsApp restent bloqués par consentement, fournisseur, coûts et retour arrière."],
        ],
        title: "Ecarts visibles et portes",
      },
      header: {
        description:
          "Guide compact du tableau de bord manuel: quoi ouvrir, quoi traiter en premier et ce qui reste volontairement bloque.",
        eyebrow: "BizPilotOwner",
        title: "Guide d'operation responsable",
      },
      launchChecklist: {
        description:
          "Le chemin le plus court entre la configuration et la révision quotidienne.",
        items: [
          ["1", "Terminer la configuration", "Confirmer services, zones, questions, confidentialite et marque."],
          ["2", "Partager un lien public", "Utiliser le lien sur le site, le profil Google ou la prospection manuelle."],
          ["3", "Réviser la file chaque jour", "Commencer par les demandes en retard, incomplètes et nouvelles."],
          ["4", "Copier seulement après révision", "Modifier les brouillons IA avant d'envoyer hors BizPilot."],
          ["5", "Noter le résultat", "Mettre à jour le statut ou le résultat après le contact."],
        ],
        title: "Checklist de lancement",
      },
      operatingSystem: {
        description:
          "Le tableau de bord suit une boucle de recuperation manuelle, pas un CRM complet.",
        lanes: [
          ["Capture", "Les demandes arrivent depuis le lien public.", "Garder le lien actif et partageable."],
          ["Triage", "Demandes à risque, incomplètes et nouvelles montent d'abord.", "Ouvrir les filtres de file."],
          ["Brouillon", "BizPilot prépare des brouillons à réviser.", "Générer ou inspecter le brouillon."],
          ["Envoi manuel", "Le responsable copie, modifie et envoie hors BizPilot.", "Aucun message n'est envoyé par l'app."],
          ["Noter", "Statut, actions et résultats gardent l’espace à jour.", "Mettre à jour après un vrai contact."],
        ],
        title: "Système de recuperation manuelle",
      },
      routeMap: {
        description:
          "Chaque route a un travail clair pour garder l'espace compact.",
        items: [
          ["Vue d'ensemble", "Une prochaine action, la préparation et les demandes urgentes.", "/dashboard", "Ouvrir"],
          ["Prospects", "Chercher, filtrer, trier et reviser chaque demande.", "/dashboard/leads", "Ouvrir la file"],
          ["Configuration", "Services, zones, questions, consentement, marque et lien public.", "/dashboard/configuration", "Ouvrir"],
          ["Profil d'entreprise", "Identité et contexte utiles aux réponses manuelles.", "/dashboard/business-profile", "Ouvrir le profil"],
          ["Réglages", "Langue, thème, historique, sécurité et cycle de vie.", "/dashboard/settings", "Ouvrir"],
        ],
        title: "Carte des routes",
      },
    },
    overview: {
      aiControlBody:
        "BizPilot prépare des réponses, résumés et suivis. Rien n'est envoyé automatiquement.",
      aiControlBadges: [
        "Aucun envoi automatique",
        "Aucun prix inventé",
        "À valider par vous",
      ],
      aiControlTitle: "L'IA reste sous votre contrôle",
      atRiskSoon: "Bientôt à risque",
      copyLink: "Copier le lien",
      featuredFallbackAction:
        "Réviser la demande et envoyer une réponse manuelle.",
      featuredFallbackAge: "22 min",
      featuredFallbackArea: "Plateau",
      featuredFallbackCustomer: "Sarah M.",
      featuredFallbackService: "Nettoyage de déménagement",
      finishSetup: "Terminer la configuration",
      guidesAndAiControls: "Guide du flux manuel",
      heroBadge: "Récupération manuelle",
      heroDescription:
        "Répondez pendant que le client compare encore ses options. BizPilot organise les demandes urgentes, prépare une réponse et vous garde en contrôle.",
      heroTitle: (count) =>
        `${count} demande${count === 1 ? "" : "s"} de soumission demandent votre attention aujourd'hui.`,
      startGuide: {
        description:
          "Un lancement calme pour la première session du responsable. Terminez seulement la prochaine étape utile.",
        done: "Terminé",
        items: [
          ["Terminer la configuration", "Confirmez les services, zones, questions, confidentialité et marque."],
          ["Partager le lien de soumission", "Copiez le lien public quand la préparation est complète."],
          ["Réviser les nouvelles demandes", "Ouvrez la file, répondez manuellement, puis notez le résultat."],
        ],
        next: "Suivant",
        title: "Commencer ici",
      },
      commandFlow: {
        description:
          "Gardez la journée claire: capturer les demandes, prioriser l'urgence, valider le brouillon, puis envoyer manuellement hors BizPilot.",
        items: [
          ["Capturer", "Les nouvelles demandes arrivent dans une seule file."],
          ["Prioriser", "Les prospects à risque ou incomplets montent d'abord."],
          ["Brouillon", "Le soutien IA reste à valider."],
          ["Envoi manuel", "Le responsable copie, modifie et envoie."],
        ],
        title: "Flux manuel de récupération du jour",
      },
      metrics: {
        aiDraftsReady: {
          detail: "Réviser avant utilisation. Aucun envoi automatique.",
          label: "Brouillons IA prêts",
        },
        atRiskLeads: {
          detail: "Aucune réponse après le seuil de récupération",
          label: "Prospects à risque",
        },
        needsReply: {
          detail: "En attente de votre réponse",
          label: "Réponse requise",
        },
        newQuoteRequests: {
          detail: "7 derniers jours · signal pilote sain",
          label: "Nouvelles demandes",
        },
      },
      noWorkspaceBody:
        "Créez ou rejoignez un espace d'entreprise avant d'utiliser le bureau de récupération.",
      noWorkspaceTitle: "Aucun espace d'entreprise pour l'instant.",
      openQueue: "Ouvrir la file",
      queue: {
        description:
          "Les 5 demandes les plus urgentes. Ouvrez la file complète pour filtrer, trier et agir sur chaque prospect.",
        title: "File de récupération",
      },
      readiness: {
        activeAndReady: "Actif et prêt",
        incomplete: "Incomplet",
        liveAndShareable: "Le lien public est actif et prêt à partager.",
        needed: "Requis",
        ready: "Prêt",
        tasksLeft: (count) => `${count} tâche${count === 1 ? "" : "s"} restante${count === 1 ? "" : "s"}`,
        title: "Préparation du lien public",
      },
      recentActivity: {
        description:
          "Chronologie opérationnelle des demandes et actions manuelles.",
        emptyBody:
          "Les nouvelles demandes, résumés IA, actions de révision et copies du lien apparaîtront ici.",
        emptyTitle: "Aucune activité récente pour l'instant.",
        title: "Activité récente",
      },
      recoveryFocus: {
        description: (count) => `${count} élément${count === 1 ? "" : "s"}`,
        followUpDetail: (count) => `${count} suivi dû aujourd'hui`,
        followUpTitle: "Suivi dû",
        itemCount: (count) => String(count),
        missingInfoDetail: (count) => `${count} prospect a besoin de détails`,
        missingInfoTitle: "Infos manquantes",
        replyDetail: (count) => `${count} prospect${count === 1 ? "" : "s"} en attente`,
        replyTitle: "Réponse requise",
        title: "Focus récupération du jour",
      },
      reviewUrgentLead: "Réviser le prospect urgent",
      routine: {
        steps: [
          ["1", "Réviser les prospects à risque", "Commencer par les demandes en retard."],
          ["2", "Copier les réponses IA", "Modifier avant l'envoi manuel."],
          ["3", "Relancer les demandes sans réponse", "Utiliser les brouillons approuvés."],
        ],
        title: "Routine suggérée",
      },
      status: {
        aiDraftReady: "Brouillon IA prêt",
        missingInfo: "Infos manquantes",
        ready: "Prêt",
      },
      suggestedNextAction: "Prochaine action suggérée:",
      setupChecklist: "Liste de configuration",
      visualDashboard: {
        aiAssistantBody: (count) =>
          `${count} prospect${count === 1 ? "" : "s"} attend${count === 1 ? "" : "ent"} votre réponse. La validation du responsable reste requise avant tout envoi.`,
        aiAssistantTitle: "Assistant IA",
        dateRange: "7 derniers jours",
        filters: "Filtrer la file",
        kpis: {
          aiRepliesSent: "Brouillons copies",
          awaitingReply: "En attente de votre réponse",
          dealsWon: "Résultats réservés",
          newLeads: "Nouveaux prospects",
          quoteLinkSent: "Lien de soumission actif",
          readinessCompleted: "Préparation terminée",
        },
        leadQueueTitle: "File de prospects (a traiter)",
        leadSources: "Sources des prospects",
        leadsTrend: "Tendance des prospects",
        newLead: "Prévisualiser la page de soumission",
        newLeadsCenter: "Nouveaux prospects",
        ownerReviewRequired:
          "La validation du responsable reste requise avant tout envoi.",
        todo: {
          completeReadiness: "Completer la préparation",
          prepareQuotes: "Preparer les soumissions",
          replyToLeads: "Repondre aux prospects",
          sendFollowUp: "Envoyer un suivi",
          title: "A faire aujourd'hui",
        },
        title: "Vue d'ensemble",
        viewAll: "Tout voir",
        viewFullReport: "Voir le rapport complet",
      },
    },
    routeGuide: {
      ariaLabel: "Guide de page et actions prioritaires",
      fullGuide: "Guide complet",
      label: "Guide de page",
      routes: {
        businessProfile: {
          focus: "Le profil explique comment le responsable veut cadrer les soumissions.",
          next:
            "Gardez l'identité, les notes de service et les FAQ à jour avant d'utiliser les brouillons IA.",
          primaryHref: "/dashboard/business-profile",
          primaryLabel: "Réviser le profil",
          secondaryHref: "/dashboard/configuration",
          secondaryLabel: "Ouvrir la configuration",
        },
        configuration: {
          focus: "La configuration contrôle ce que le client voit avant l'envoi.",
          next:
            "Confirmez services, zones, consentement, questions et règles IA avant de partager le lien.",
          primaryHref: "/dashboard/configuration",
          primaryLabel: "Verifier la configuration",
          secondaryHref: "/dashboard/business-profile",
          secondaryLabel: "Réviser le profil",
        },
        guide: {
          focus: "Le guide garde la routine manuelle visible.",
          next:
            "Utilisez-le pour confirmer les priorités, les limites MVP et les gates restants avant la production.",
          primaryHref: "/dashboard/leads",
          primaryLabel: "Ouvrir la file",
          secondaryHref: "/dashboard/settings",
          secondaryLabel: "Voir les limites",
        },
        leadDetail: {
          focus: "Le bureau de réponse sert a traiter une réponse client validee par le responsable.",
          next:
            "Verifiez les infos manquantes, inspectez le texte IA, copiez le brouillon et notez seulement le contact manuel.",
          primaryHref: "/dashboard/leads",
          primaryLabel: "Retour à la file",
          secondaryHref: "/dashboard/guide",
          secondaryLabel: "Réviser la routine",
        },
        leads: {
          focus: "La file de prospects est le poste principal de recuperation manuelle.",
          next:
            "Priorisez les demandes en retard, les brouillons prets et les infos manquantes avant les lignes moins urgentes.",
          primaryHref: "/dashboard/leads?focus=at_risk",
          primaryLabel: "Réviser les prospects à risque",
          secondaryHref: "/dashboard/leads?focus=ai_ready",
          secondaryLabel: "Brouillons IA prets",
        },
        overview: {
          focus: "Le tableau de bord affiche d'abord l'action responsable la plus sure.",
          next:
            "Commencez par le prospect le plus risqué, puis terminez les blocages qui empêchent le partage du lien.",
          primaryHref: "/dashboard/leads?focus=at_risk",
          primaryLabel: "Réviser les prospects à risque",
          secondaryHref: "/dashboard/configuration",
          secondaryLabel: "Terminer la configuration",
        },
        settings: {
          focus: "Les réglages gardent le compte, la sécurité et les limites MVP explicites.",
          next:
            "Ajustez les preferences locales ici, mais gardez facturation, automatisations et équipe gates.",
          primaryHref: "/dashboard/settings",
          primaryLabel: "Réviser les réglages",
          secondaryHref: "/dashboard/guide",
          secondaryLabel: "Ouvrir le guide",
        },
      },
    },
    nav: {
      businessProfile: "Profil d'entreprise",
      groupCommand: "Commandes",
      groupControl: "Contrôle",
      groupSetup: "Configuration",
      guide: "Guide",
      leads: "Prospects",
      overview: "Vue d'ensemble",
      ownerWorkspace: "Espace de travail",
      quoteSetup: "Configuration",
      settings: "Réglages",
      workspaceSubtitle: "Espace de récupération",
    },
    pages: {
      businessProfile: {
        subtitle: "Identité de l'entreprise et contexte opérationnel",
        title: "Profil d'entreprise",
      },
      configuration: {
        subtitle:
          "Page publique, questions, services, règles IA et confidentialité",
        title: "Configuration",
      },
      dashboard: {
        subtitle: "Vue d'aujourd'hui pour récupérer les demandes",
        title: "Tableau de bord",
      },
      founder: {
        subtitle: "Relais fondateur et orientation vers la console interne",
        title: "Console fondateur",
      },
      guide: {
        subtitle: "Routine manuelle, carte des routes et ecarts gates",
        title: "Guide d'operation responsable",
      },
      leadDetail: {
        subtitle: "Détails du prospect, infos manquantes et brouillons IA à valider",
        title: "Bureau de réponse",
      },
      leads: {
        subtitle:
          "Priorisez les demandes avant que les clients passent à autre chose",
        title: "File de récupération",
      },
      settings: {
        subtitle: "Espace, compte, thème et limites MVP",
        title: "Réglages",
      },
    },
    readinessTasks: {
      branding: "Marque configurée",
      business_profile: "Profil d'entreprise confirmé",
      cleaning_template: "Modèle de nettoyage activé",
      consent: "Avis de consentement configuré",
      faqs: "Au moins une FAQ ajoutée",
      privacy: "Mode de confidentialité sélectionné",
      service_areas: "Au moins une zone desservie ajoutée",
      services: "Au moins un service ajouté",
    },
    settings: {
      account: "Compte",
      billing: "Facturation",
      business: "Entreprise",
      displayPreferences: {
        densityLabel: "Densité",
        densityOptions: {
          compact: "Compact",
          comfortable: "Confortable",
          spacious: "Large",
        },
        description:
          "Ajustez la quantite d'aide et de détails visibles dans ce navigateur. Ces réglages ne changent pas les données de l'espace.",
        guideLabel: "Guides",
        guideOptions: {
          expanded: "Developpe",
          minimal: "Minimal",
          standard: "Standard",
        },
        insightLabel: "Panneaux d'analyse",
        insightOptions: {
          hidden: "Masquer les analyses optionnelles",
          standard: "Afficher les analyses",
        },
        localOnly:
          "Enregistre localement dans ce navigateur. Le flux responsable, la configuration et les contrôles admin ne changent pas.",
        reset: "Reinitialiser la vue",
        title: "Réglages d'affichage",
      },
      featureRegistry: {
        activationLabel: "Activation",
        categoryLabels: {
          admin: "Admin",
          ai: "IA",
          billing: "Facturation",
          communication: "Communication",
          data: "Données",
          intake: "Demandes",
          recovery: "Relance",
          scheduling: "Planification",
          settings: "Réglages",
        },
        description:
          "Niveaux de fonctionnalites contrôlés par le responsable principal. Les outils actifs sont clairs, les outils à configurer affichent le blocage, et les outils planifiés restent non cliquables.",
        featureCopy: {
          ai_draft_assistant: {
            activation:
              "Le fondateur active l'IA modèle pour un pilote approuvé après le smoke final sans secret et votre approbation.",
            name: "Assistant IA de brouillons",
            ownerGuide:
              "Vérifier les gates Phase 24F/24G, surveiller l'usage et garder la validation humaine obligatoire.",
            setup:
              "La preuve fournisseur OpenAI synthétique est passée; l'usage données réelles reste gate par smoke final et approbation finale.",
            summary:
              "Les résumés, brouillons de réponse et suivis restent validés par vous.",
            textGuide:
              "Explique le fallback, la confidentialite et le fait que BizPilot n'envoie pas automatiquement.",
            visualGuide:
              "Montrer résumé, réponse suggérée, suivi, action copier et banniere fallback.",
          },
          backup_restore_posture: {
            activation:
              "Le fondateur accepte la preuve DB-level pour le premier pilote limité et complète la preuve app/RLS restaurée avant pilote payant ou travail sur des données à risque.",
            name: "Sauvegarde et restauration",
            ownerGuide:
              "Noter emplacement, accès, cible de restauration, preuve Phase 24C.0 et deferral Phase 24C.1.",
            setup:
              "La preuve export/restauration DB-level est passee; la preuve app/dashboard/RLS restaurée reste P1 avant pilote payant, migrations ou opérations destructives.",
            summary:
              "Separe la preuve DB-level passee de la preuve stricte app/RLS differee.",
            textGuide:
              "Explique ce qui est sauvegarde, ou les exports vivent et qui peut restaurer.",
            visualGuide:
              "Montrer checklist, statut de drill et décision responsable.",
          },
          billing_payment_links: {
            activation:
              "Le fondateur garde la facturation manuelle ou ajoute des liens de paiement après configuration.",
            name: "Facturation et liens de paiement",
            ownerGuide:
              "Confirmer prix, fournisseur, annulation/remboursement et smoke.",
            setup: "Fournisseur/compte paiement requis.",
            summary:
              "La facturation pilote peut être suivie sans prétendre que la facturation intégrée existe.",
            textGuide:
              "Explique facturation manuelle, liens de paiement, annulation et limites de remboursement.",
            visualGuide:
              "Montrer forfait, configuration paiement requise et actions de facturation non cliquables.",
          },
          business_branding: {
            activation: "Vous modifiez la marque dans Configuration.",
            name: "Marque d'entreprise",
            ownerGuide:
              "Verifier contraste et aperçu public après les changements logo/couleur.",
            setup: "Disponible maintenant.",
            summary:
              "Logo, couleurs, zones, services, FAQ et confidentialite forment la page publique.",
            textGuide:
              "Explique comment la marque renforce la confiance sur la page publique.",
            visualGuide:
              "Montrer aperçu public, couleurs, services, FAQ et consentement.",
          },
          custom_smtp_auth_email: {
            activation:
              "Le courriel auth est actif après Resend DNS, SMTP Supabase, confirmation signup et reset smokes passes.",
            name: "SMTP personnalise auth email",
            ownerGuide:
              "Ne jamais imprimer les identifiants. Garder la notification courriel app séparée et différée.",
            setup:
              "La preuve courriel auth est passée; la notification courriel reste différée pour le premier pilote.",
            summary:
              "Livraison des confirmations signup et resets mot de passe pour vrais pilotes.",
            textGuide:
              "Explique confirmation/reset et quoi faire si l'email manque.",
            visualGuide:
              "Montrer email signup, email reset, logs fournisseur et retry.",
          },
          fr_ca_language: {
            activation: "Vous choisissez la langue de l'espace.",
            name: "Langue anglais / fr-CA",
            ownerGuide:
              "Garder les textes dans les dictionnaires centraux et lancer les smokes langue.",
            setup: "Disponible maintenant.",
            summary:
              "Le tableau de bord et la demande publique peuvent suivre la langue de l'espace.",
            textGuide:
              "Explique ce qui change quand la langue de l'espace change.",
            visualGuide:
              "Montrer selecteur, page publique, validation et succes.",
          },
          founder_admin_controls: {
            activation: "Fondateur/admin seulement.",
            name: "Contrôles admin fondateur",
            ownerGuide:
              "Utiliser dry-run d'abord, journaliser les actions et separer les actions destructives.",
            setup: "Contrôle par le responsable principal.",
            summary:
              "Type d'espace, forfait/statut, lien public, session, notes et sécurité cleanup.",
            textGuide:
              "Explique les changements visibles par le client et ceux réservés au fondateur.",
            visualGuide:
              "Montrer actions tracees, session, dry-run cleanup et purge bloquee.",
          },
          invoices_payments: {
            activation:
              "Le fondateur decide si facture/paiement devient un niveau payant.",
            name: "Factures et paiements",
            ownerGuide:
              "Definir fournisseur, taxes/remboursement, rollback webhook et support.",
            setup: "Planifie; fournisseur paiement requis avant lancement.",
            summary:
              "Workflow futur qui ne doit pas impliquer un paiement reussi avant d'exister.",
            textGuide:
              "Explique les actions manuelles versus automatisées.",
            visualGuide:
              "Montrer brouillon facture, statut paiement, erreur et fallback manuel.",
          },
          customer_contact_list: {
            activation:
              "Le fondateur active après règles de consentement, retention, export et accès premium.",
            name: "Liste de contacts clients",
            ownerGuide:
              "Définir visibilité responsable/admin, import contacts, opt-out et limites export.",
            setup:
              "Fonction premium planifiee; règles contact et posture backup requises d'abord.",
            summary:
              "Liste premium responsable/admin créée depuis courriel ou téléphone client pour suivi et statistiques.",
            textGuide:
              "Explique qui voit la liste, quels contacts sont stockes et les limites d'usage publicitaire.",
            visualGuide:
              "Montrer liste clients, filtres par contact, visibilité responsable/admin, consentement et export désactivé.",
          },
          lead_source_attribution_analytics: {
            activation:
              "Le fondateur active après taxonomie source et règles de confidentialite des graphiques.",
            name: "Analyse des sources de prospects",
            ownerGuide:
              "Utiliser leads.source_channel et lead_source_metadata; ne jamais ajouter leads.source.",
            setup:
              "Fonction premium/admin planifiee; taxonomie source et graphiques non actifs.",
            summary:
              "Montre si les prospects viennent du site web, Instagram, Facebook, Google, liens directs ou campagnes.",
            textGuide:
              "Explique libelles de source, UTM, referents et pourquoi les sources inconnues restent honnetes.",
            visualGuide:
              "Montrer graphique des sources, meilleurs canaux, liste recente, bucket inconnu et filtre date.",
          },
          quote_link_intake: {
            activation: "Vous contrôlez le lien public actif.",
            name: "Lien public et formulaire",
            ownerGuide:
              "Lancer le smoke sécurité quote quand le formulaire change.",
            setup: "Disponible maintenant.",
            summary:
              "Un lien client capture des demandes structurees de nettoyage.",
            textGuide:
              "Explique partage du lien, champs requis, consentement et états indisponibles.",
            visualGuide:
              "Montrer lien actif, etapes, validation, consentement et succes.",
          },
          quote_recovery_queue: {
            activation: "Fonction coeur du tableau de bord.",
            name: "File de relance prospects",
            ownerGuide:
              "Garder priorité, statut et suivi alignés avec le vrai flux.",
            setup: "Disponible maintenant.",
            summary:
              "Priorise nouvelles demandes, urgences, infos manquantes et suivis.",
            textGuide:
              "Explique statuts, prochaines actions, validation et copier/envoyer.",
            visualGuide:
              "Montrer file, filtres, detail prospect, brouillon IA et action copier.",
          },
          scheduling_booking: {
            activation:
              "Le fondateur choisit fournisseur et niveau après preuve quote recovery.",
            name: "Planification et réservation",
            ownerGuide:
              "Definir limite manuel/auto, sync fournisseur, conflits et annulations.",
            setup: "Planifie; non active.",
            summary:
              "Flux futur qui ne confirme pas de réservation avant la vraie intégration.",
            textGuide:
              "Explique demande versus réservation confirmée et règles d'approbation.",
            visualGuide:
              "Montrer heure demandee, approbation, confirmation, conflit et annulation.",
          },
          sms_whatsapp_messaging: {
            activation:
              "Le fondateur active après approbation fournisseur, consentement, templates et smokes.",
            name: "Messagerie SMS / WhatsApp",
            ownerGuide:
              "Verifier opt-in, templates, logs, desinscription et retention.",
            setup: "Fournisseur externe et conformite requis.",
            summary:
              "Workflow futur; le produit actuel n'envoie pas ces messages.",
            textGuide:
              "Explique consentement, revue manuelle, statut envoi, echec et opt-out.",
            visualGuide:
              "Montrer statut canal, consentement, brouillon, revue, livraison et echec.",
          },
          team_members: {
            activation:
              "Le fondateur choisit le niveau équipe après stabilité du compte principal.",
            name: "Membres d'équipe",
            ownerGuide:
              "Definir rôles, invitations, RLS, audit log et offboarding.",
            setup: "Planifie; non active.",
            summary:
              "Accès multi-utilisateur futur avec rôles et tracabilite.",
            textGuide:
              "Explique rôles, permissions, invitations et accès.",
            visualGuide:
              "Montrer rôles, invitation, invitation en attente, accès refuse et retrait.",
          },
        },
        guideLabels: {
          draft: "Guide brouillon",
          ready: "Guide prêt",
          required: "Guide requis",
        },
        guideDetailsLabel: "Détails du guide",
        guidesLabel: "Guides",
        levelLabel: "Niveau",
        levelLabels: {
          admin: "Admin",
          core: "Base",
          custom: "Personnalisé",
          founder: "Fondateur",
          pilot: "Pilote",
          plus: "Plus",
          premium: "Premium",
        },
        ownerLabel: "Responsable",
        ownerGuideLabel: "Guide responsable/admin",
        setupLabel: "Configuration",
        stateLabels: {
          blocked_external: "Blocage externe",
          enabled: "Actif",
          owner_controlled: "Contrôle responsable",
          planned: "Planifie",
          setup_required: "Configuration requise",
        },
        statusLabel: "Statut",
        textGuideLabel: "Guide texte",
        title: "Niveaux de fonctionnalites",
        visualGuideLabel: "Guide visuel",
      },
      future: "Futur",
      futureSections: "Sections futures",
      futureSectionsDescription:
        "Les capacités futures restent indiquées comme référence verrouillée jusqu'à validation.",
      futureSectionHints: {
        billing: "Liens de paiement Stripe en premier",
        integrations: "Webhooks reportés",
        teamMembers: "Compte principal seulement pendant le pilote",
      },
      guardrails: "Garde-fous de préparation production",
      guardrailsDescription:
        "Ce qui reste vrai pendant que BizPilot grandit avec des niveaux de fonctionnalites contrôles.",
      guardrailItems: [
        "Ne pas activer par defaut les fonctions fournisseur, paiement ou automatisation.",
        "Ne pas impliquer envoi, réservation, facture ou paiement réussi avant que BizPilot le fasse vraiment.",
        "Chaque nouvelle fonction exige guide visuel, guide texte, guide responsable et état dans Réglages.",
        "Les blocages externes restent visibles jusqu'à la fin de la configuration API, compte, DNS, fournisseur ou paiement.",
      ],
      integrations: "Intégrations",
      language: "Langue de l'espace",
      languageDescription:
        "Une seule langue contrôle le tableau de bord, l'authentification, les valeurs par défaut de la page publique et les brouillons IA.",
      languageHelp:
        "Ce changement met à jour la langue de l'entreprise et le cookie utilisé avant connexion.",
      lifecycle: {
        deletionIneligibleBody:
          "Cet espace n'est pas admissible à une nouvelle demande de suppression, ou votre rôle ne peut pas en demander une.",
        deletionIneligibleTitle:
          "Les demandes de suppression d'espace sont réservées au responsable principal.",
        description:
          "Contrôles de cycle de vie réservés au responsable principal. La suppression du compte de connexion est séparée.",
        lifecycleStatus: "Statut du cycle de vie",
        lockBehavior: "Comportement du verrouillage",
        lockBehaviorDescription:
          "Les demandes de suppression verrouillent les liens de soumission, les nouvelles demandes et la génération de brouillons IA pendant la révision.",
        title: "Cycle de vie de l'espace",
      },
      sessionPolicy: {
        afterDuration: (minutes) =>
          minutes >= 1440
            ? `Déconnexion après ${minutes / 1440} jour${minutes === 1440 ? "" : "s"}`
            : minutes >= 60
              ? `Déconnexion après ${minutes / 60} heure${minutes === 60 ? "" : "s"}`
              : `Déconnexion après ${minutes} minutes`,
        alwaysOn: "Toujours actif",
        description:
          "Politique de déconnexion gérée par le fondateur pour cet espace. Les changements sont consignés ci-dessous.",
        managedByFounder:
          "Géré par le support fondateur BizPilot. La politique est vérifiée lors des requêtes du tableau de bord.",
        title: "Sécurité de session",
      },
      systemHistory: {
        actions: {
          business_cancelled: "Entreprise annulée",
          business_deletion_requested: "Suppression demandée",
          business_reactivated: "Entreprise réactivée",
          business_suspended: "Entreprise suspendue",
          internal_note_added: "Note support enregistrée",
          password_reset_requested: "Réinitialisation du mot de passe demandée",
          plan_changed: "Forfait modifié",
          quote_link_disabled: "Lien de soumission désactivé",
          quote_link_enabled: "Lien de soumission activé",
          session_policy_changed: "Politique de session modifiée",
          status_changed: "Statut de l'espace modifié",
          temporary_password_set: "Mot de passe temporaire défini",
          test_auth_user_deleted: "Connexion test supprimée",
          test_workspace_cleanup_completed: "Nettoyage d'espace test",
        },
        changeFallback: "Paramètre de l'espace modifié",
        description:
          "Vue traçable des changements fondateur/admin qui ont touché cet espace.",
        emptyBody:
          "Quand le support fondateur BizPilot change le forfait, l'accès, les liens de soumission ou la politique de session, l'événement apparaît ici.",
        emptyTitle: "Aucun changement système enregistré.",
        noteLabel: "Note",
        title: "Historique des changements système",
        traceLabel: "Trace",
      },
      deletionForm: {
        acknowledgement:
          "Je comprends que ceci demande une révision de suppression de l'espace et ne supprime pas automatiquement mon compte de connexion.",
        body:
          "Cela verrouillera l'espace d'entreprise, désactivera les liens publics, bloquera les nouvelles demandes et arrêtera la génération de nouveaux brouillons IA. Cela ne supprime pas automatiquement votre compte de connexion.",
        dangerZone: "Zone dangereuse",
        dataNotice:
          "Les données client ne sont pas supprimées par cette demande. La suppression finale et l'anonymisation exigent un processus de révision contrôlé.",
        submit: "Demander la suppression de l'espace",
        title: "Demander la suppression de l'espace",
        typeBusinessName: "Tapez le nom de l'entreprise pour confirmer",
      },
      manualBilling: "Facturation manuelle pendant la préparation production.",
      notInMvp: "Hors MVP",
      plan: "Forfait",
      quickLinks: "Liens rapides",
      signedInAs: "Connecté comme",
      teamMembers: "Membres",
      theme: "Thème",
      themeDescription:
        "Thème sans problème d'hydratation. Le premier affichage est résolu côté serveur.",
      themeHelp:
        "Les nouvelles sessions commencent en mode clair. Choisissez Sombre ou Système pour une vue fixe ou basée sur l'appareil.",
      workspace: "Espace",
      workspaceDescription:
        "Espace, compte, thème, langue, niveaux de fonctionnalités et configuration contrôlée par le responsable principal.",
    },
    status: {
      active: "Actif",
      done: "Terminé",
      open: "Ouvert",
      pilot: "Pilote",
    },
    theme: {
      dark: "Sombre",
      label: "Thème du tableau de bord",
      light: "Clair",
      system: "Système",
    },
    workspaceAccess: {
      businessNameLabel: "Nom de l'entreprise",
      businessNamePlaceholder: "Votre entreprise de nettoyage",
      deletionRequestedBody:
        "Cet espace d'entreprise est verrouillé pendant la révision de la demande de suppression. Votre compte de connexion n'est pas supprimé automatiquement.",
      deletionRequestedTitle: "La suppression de l'espace a été demandée.",
      eyebrow: "Accès à l'espace",
      pausedBody:
        "Votre tableau de bord est bloqué, car aucune adhésion active à une entreprise n'est disponible. Vos données sont conservées; contactez le support BizPilot si cela semble inattendu.",
      pausedTitle: "Cet espace est suspendu ou indisponible.",
      recoverWorkspace: "Récupérer l'espace",
      recoveryHelp:
        "Utilisez ceci seulement si l'inscription a créé votre connexion sans terminer la configuration de l'espace.",
      signedInAs: (email) => `Connecté comme ${email}`,
    },
  },
  demo: {
    aiDraftReady: "Brouillon IA prêt",
    aiSummary:
      "Demande de soumission chaude et urgente, mais il manque la taille du logement et les détails d'accès avant de préparer une estimation.",
    aiSummaryLabel: "Résumé IA:",
    copyResponse: "Copier la réponse",
    detailFour:
      "Petit bureau à nettoyer. Réponse copiée; résultat en attente.",
    detailOne:
      "Nettoyage de déménagement avant vendredi. Taille du logement manquante.",
    detailThree:
      "Demande de nettoyage hebdomadaire sans réponse après le premier suivi.",
    detailTwo:
      "Grand ménage avec chambres, salles de bain et horaire déjà fournis.",
    disappearsNote:
      "Cet état démo est seulement affiché dans l'interface. Il n'est pas enregistré comme vrai prospect et disparaît dès que de vraies demandes arrivent.",
    featuredLeadTitle: "Maria S. - nettoyage de déménagement",
    followUpDraft:
      "Bonjour Maria, je fais un suivi pour savoir si vous avez toujours besoin d'aide avec le nettoyage de déménagement. Envoyez la taille du logement et la plage horaire souhaitée, et je pourrai préparer la prochaine étape.",
    followUpLabel: "Brouillon de suivi:",
    markContacted: "Marquer contacté",
    missingInfo:
      "Demander la taille du logement, si l'unité sera vide, les détails d'accès et la plage horaire souhaitée.",
    missingInfoLabel: "Infos manquantes:",
    notStored: "Non enregistré",
    replyDraft:
      "Bonjour Maria, merci pour votre demande. Pouvez-vous m'envoyer la taille du logement, la date de nettoyage souhaitée et confirmer si l'unité sera vide?",
    replyDraftLabel: "Brouillon de réponse:",
    replyNeeded: "Réponse requise",
    reviewReply: "Réviser la réponse",
    sampleAreas: ["Centre-ville", "Laval", "Plateau", "Westmount"],
    sampleDemoState: "État démo",
    sampleLeads: [
      {
        area: "Centre-ville",
        customer: "Maria Santos",
        detail:
          "Nettoyage de déménagement avant vendredi. Taille du logement manquante.",
        followUpDraft:
          "Bonjour Maria, je fais un suivi pour savoir si vous avez toujours besoin d'aide avec le nettoyage de déménagement. Envoyez la taille du logement et la plage horaire souhaitée, et je pourrai préparer la prochaine étape.",
        replyDraft:
          "Bonjour Maria, merci pour votre demande. Pouvez-vous m'envoyer la taille du logement, la date de nettoyage souhaitée et confirmer si l'unité sera vide?",
        status: "Infos manquantes",
        tone: "amber",
      },
      {
        area: "Laval",
        customer: "Daniel Roy",
        detail:
          "Grand ménage avec chambres, salles de bain et horaire déjà fournis.",
        followUpDraft:
          "Bonjour Daniel, je fais un suivi sur votre demande de grand ménage. Si l'horaire convient toujours, vous pouvez revoir les détails et répondre avec la prochaine étape.",
        replyDraft:
          "Bonjour Daniel, merci pour les détails. Je peux revoir la demande et préparer une fourchette d'estimation après confirmation de l'accès et des zones prioritaires.",
        status: "Brouillon prêt",
        tone: "blue",
      },
      {
        area: "Plateau",
        customer: "Nadia Khan",
        detail:
          "Demande de nettoyage hebdomadaire sans réponse après le premier suivi.",
        followUpDraft:
          "Bonjour Nadia, je fais un suivi sur votre demande de nettoyage hebdomadaire. Si vous comparez encore les options, je peux répondre à vos questions.",
        replyDraft:
          "Bonjour Nadia, merci pour votre demande de nettoyage hebdomadaire. Pouvez-vous confirmer la taille du logement, les animaux et le jour de semaine préféré?",
        status: "Suivi dû",
        tone: "red",
      },
      {
        area: "Westmount",
        customer: "Gestionnaire bureau",
        detail:
          "Petit bureau à nettoyer. Réponse copiée; résultat en attente.",
        followUpDraft:
          "Bonjour, je fais un suivi sur la demande de nettoyage du bureau. Dites-moi si vous voulez avancer ou ajuster l'étendue du travail.",
        replyDraft:
          "Merci pour les détails du nettoyage de bureau. Nous réviserons l'étendue et répondrons manuellement avec la prochaine étape.",
        status: "Copié",
        tone: "emerald",
      },
    ],
    sampleStatuses: ["Infos manquantes", "Brouillon prêt", "Suivi dû", "Copié"],
    shareQuoteLink: "Partager le lien",
    suggestedNextAction:
      "Réviser le brouillon, le copier manuellement et l'envoyer par le canal client que vous utilisez déjà.",
    suggestedNextActionLabel: "Prochaine action suggérée:",
  },
  intakeErrors: {
    consentRequired: "Le consentement est requis avant l'envoi.",
    fallbackSubmit:
      "Nous n'avons pas pu envoyer la demande de soumission. Rouvrez ce lien, vérifiez les champs requis et réessayez.",
    fieldRequired: (label) => `${label} doit être rempli.`,
    formChanged:
      "Le formulaire de soumission a changé. Veuillez rafraîchir la page et réessayer.",
    invalidChoice: (label) => `${label} contient une option indisponible.`,
    linkUnavailable: "Ce lien de soumission n'est pas disponible.",
    nonNegativeNumber: (label) => `${label} ne peut pas être négatif.`,
    notPastDate: (label) => `${label} ne peut pas être dans le passé.`,
    rejected: "Soumission rejetée.",
    submittedTooFast:
      "Veuillez attendre un moment, puis envoyer la demande de soumission à nouveau.",
    temporarySubmitUnavailable:
      "Nous ne pouvons pas envoyer cette demande pour le moment. Veuillez contacter l'entreprise directement ou réessayer plus tard.",
    validDate: (label) => `${label} doit être une date valide.`,
    validNumber: (label) => `${label} doit être un nombre valide.`,
  },
  leadRules: {
    actionAskInfo: "Demander les détails manquants",
    actionFollowUp: "Faire un suivi avec ce prospect",
    actionReply: "Répondre à ce prospect",
    actionReplyOverdue: "Répondre au prospect en retard",
    archiveOrReviewArea: "Vérifier le secteur desservi avant de répondre",
    completeExplanation:
      "Contact, service, secteur, horaire et détails de soumission présents.",
    followUpToday: "Faire un suivi aujourd'hui",
    lowFitExplanation:
      "Hors du secteur desservi configuré. Les détails peuvent être complets même si le fit reste faible.",
    manuallyMarkedNotFit: "Marqué manuellement comme non compatible",
    markBookedLost: "Marquer gagné/perdu quand ce sera connu",
    missingExplanation: (labels) => `Il manque: ${labels.join(", ")}.`,
    noOpenAction: "Aucune action ouverte",
    outcomeBooked: "Résultat gagné",
    outcomeLost: "Résultat perdu",
    readyForReply: "Prêt pour votre réponse.",
    recommendedAskInfo: "Demander les infos manquantes",
    replyCopiedWaiting: "Réponse copiée, résultat en attente.",
    responseState: (state) => `État de réponse: ${state}.`,
  },
  missingInfoLabels: {
    bathrooms: "salles de bain",
    bedrooms: "chambres",
    city_or_service_area: "secteur desservi",
    cleaning_type: "type de nettoyage",
    customer_contact: "coordonnées",
    preferred_date: "date souhaitée",
    preferred_time_window: "plage horaire souhaitée",
    property_type: "type de propriété",
  },
  optionLabels: {
    afternoon: "Après-midi",
    apartment: "Appartement",
    condo: "Condo",
    deep: "Grand ménage",
    evening: "Soir",
    flexible: "Flexible",
    house: "Maison",
    morning: "Matin",
    move_in_move_out: "Déménagement",
    office: "Bureau",
    other: "Autre",
    post_construction: "Après construction",
    standard: "Standard",
  },
  quoteFields: {
    bathrooms: {
      helpText: "Nombre de salles de bain pour les logements résidentiels.",
      label: "Salles de bain",
    },
    bedrooms: {
      helpText: "Nombre de chambres pour les logements résidentiels.",
      label: "Chambres",
    },
    city_or_service_area: {
      helpText: "Secteur où le nettoyage est demandé.",
      label: "Ville ou secteur",
    },
    cleaning_type: {
      helpText: "Le type de nettoyage demandé.",
      label: "Type de nettoyage",
    },
    customer_contact: {
      helpText: "Courriel ou téléphone pour que l'entreprise puisse faire le suivi.",
      label: "Coordonnées",
    },
    customer_email: {
      helpText: "Meilleur courriel pour que l'entreprise puisse faire le suivi.",
      label: "Adresse courriel",
    },
    customer_name: {
      helpText: "Nom de la personne qui demande la soumission.",
      label: "Nom du client",
    },
    customer_phone: {
      helpText: "Meilleur numéro de téléphone pour que l'entreprise puisse faire le suivi.",
      label: "Numéro de téléphone",
    },
    home_address: {
      helpText:
        "Adresse ou intersection majeure la plus proche pour la demande de nettoyage.",
      label: "Adresse du domicile",
    },
    notes: {
      helpText: "Contexte supplémentaire pour l'entreprise.",
      label: "Notes",
    },
    pets: {
      helpText: "Indiquez si des animaux sont présents.",
      label: "Animaux",
    },
    preferred_date: {
      helpText: "Date de service souhaitée.",
      label: "Date souhaitée",
    },
    preferred_time_window: {
      helpText: "Plage horaire souhaitée.",
      label: "Plage horaire souhaitée",
    },
    property_type: {
      helpText: "Catégorie de propriété pour la demande.",
      label: "Type de propriété",
    },
    square_footage_optional: {
      helpText: "Estimation de la superficie, si connue.",
      label: "Superficie",
    },
  },
  quoteForm: {
    aiDisclosure:
      "BizPilot peut aider à préparer un brouillon interne, mais l’entreprise révise chaque message avant de l’envoyer.",
    consentNoticeDefault:
      "En envoyant cette demande, vous acceptez que vos renseignements soient partagés avec cette entreprise afin qu’elle puisse répondre à votre demande de soumission. BizPilot peut aider à préparer un brouillon interne, mais l’entreprise révise chaque message avant de l’envoyer.",
    emptySection: "Rien à remplir dans cette section.",
    guardrail:
      "L’envoi de ce formulaire ne confirme ni prix, ni disponibilité, ni réservation.",
    selectPlaceholder: "Sélectionner une option",
    stepProgress: (index, total, label) =>
      `Étape ${index} sur ${total} - ${label}`,
    steps: [
      {
        description:
          "Quelques détails rapides pour aider l'entreprise à préparer une réponse précise.",
        id: "service",
        label: "Service",
        title: "Quel type de nettoyage?",
      },
      {
        description:
          "Le moment et l'emplacement aident l'entreprise à vérifier la disponibilité et le déplacement.",
        id: "when_where",
        label: "Quand et où",
        title: "Quand et où?",
      },
      {
        description:
          "Ces détails sont transmis directement à l'entreprise. Rien n'est envoyé automatiquement.",
        id: "contact",
        label: "Contact",
        title: "Comment l'entreprise peut-elle vous joindre?",
      },
    ],
    submitButton: "Envoyer la demande",
  },
  quotePage: {
    badge: "Soumission de nettoyage",
    description:
      "Un court formulaire de soumission. L'entreprise révise chaque demande et répond directement - rien n'est envoyé automatiquement.",
    languageMenuLabel: "Langue de la soumission",
    ownerUnavailableBody:
      "Cet aperçu n'est pas encore prêt. Retournez à Configuration, complétez les éléments requis, puis choisissez Enregistrer et prévisualiser pour créer ou réparer la page publique.",
    ownerUnavailableCta: "Retour à Configuration",
    ownerUnavailableTitle: "Terminez d'abord la configuration",
    subtitle: "Demande de soumission",
    unavailableBody:
      "Cette page de soumission n'accepte pas de demandes en ce moment. Vérifiez que le lien est complet ou contactez l'entreprise directement si vous avez besoin d'aide pour une demande existante.",
    unavailableCta: "Retour à BizPilot",
    unavailableSubtitle: "Demande de soumission",
    unavailableTitle: "Page de soumission indisponible",
  },
  quoteSuccess: {
    backHome: "Retour à l'accueil",
    body:
      "L'entreprise examinera votre demande et vous contactera directement pour la suite. Aucune réservation ni aucun prix n'est confirmé, et la disponibilité doit encore être validée par l'entreprise.",
    footer: (businessName) =>
      businessName
        ? `BizPilot aide ${businessName} à répondre plus vite tout en gardant chaque message validé avant envoi.`
        : "BizPilot aide l'entreprise à répondre plus vite tout en gardant chaque message validé avant envoi.",
    meta: {
      description:
        "Demande de soumission reçue pour validation par l'entreprise. Aucune réservation, aucun prix ni aucune disponibilité ne sont confirmés par cette page.",
      title: "Demande de soumission reçue | BizPilot AI",
    },
    nextTitle: "Prochaines étapes",
    requestSent: "Demande envoyée",
    steps: (businessName) => [
      businessName
        ? `${businessName} examine votre demande et les détails manquants.`
        : "L'entreprise examine votre demande et les détails manquants.",
      "Elle vérifie le prix et la disponibilité avant de répondre - aucun message automatique.",
      "Vous recevrez une réponse avec les coordonnées que vous avez soumises.",
    ],
    submitAnother: "Envoyer une autre demande",
    title: (businessName) =>
      businessName
        ? `Merci - votre demande a été envoyée à ${businessName}.`
        : "Merci - votre demande de soumission a été envoyée.",
  },
};

const copyByLanguage: Record<SupportedLanguage, BizPilotCopy> = {
  en: englishCopy,
  "fr-CA": frenchCopy,
};

export function getBizPilotCopy(language: unknown): BizPilotCopy {
  return copyByLanguage[readSupportedLanguage(language)];
}

export function getDefaultBizPilotCopy(): BizPilotCopy {
  return copyByLanguage[DEFAULT_LANGUAGE];
}

const legacyDefaultQuoteFieldCopies: Record<string, readonly QuoteFieldCopy[]> = {
  customer_contact: [
    {
      helpText: "Email or phone for owner follow-up.",
      label: "Customer contact",
    },
    {
      helpText: "Courriel ou téléphone pour le suivi du propriétaire.",
      label: "Coordonnées",
    },
  ],
  customer_email: [
    {
      helpText: "Best email address for owner follow-up.",
      label: "Email address",
    },
    {
      helpText: "Meilleur courriel pour le suivi du propriétaire.",
      label: "Adresse courriel",
    },
  ],
  customer_phone: [
    {
      helpText: "Best phone number for owner follow-up.",
      label: "Phone number",
    },
    {
      helpText: "Meilleur numéro de téléphone pour le suivi du propriétaire.",
      label: "Numéro de téléphone",
    },
  ],
  notes: [
    {
      helpText: "Extra context for the owner.",
      label: "Notes",
    },
    {
      helpText: "Contexte supplémentaire pour le propriétaire.",
      label: "Notes",
    },
  ],
};

function normalizeQuoteFieldDefaultText(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase("en")
    .replace(/[’']/g, "'")
    .replace(/\s+/g, " ");
}

function defaultQuoteFieldTextMatches(left: string, right: string): boolean {
  return (
    left === right ||
    normalizeQuoteFieldDefaultText(left) === normalizeQuoteFieldDefaultText(right)
  );
}

function defaultQuoteFieldCopies(fieldKey: string): QuoteFieldCopy[] {
  const activeDefaults = Object.values(copyByLanguage)
    .map((copy) => copy.quoteFields[fieldKey])
    .filter((copy): copy is QuoteFieldCopy => Boolean(copy));

  return [
    ...activeDefaults,
    ...(legacyDefaultQuoteFieldCopies[fieldKey] ?? []),
  ];
}

export function isDefaultQuoteFieldHelpText(input: {
  fieldKey: string;
  helpText: string;
}): boolean {
  return defaultQuoteFieldCopies(input.fieldKey).some(
    (field) =>
      field.helpText
        ? defaultQuoteFieldTextMatches(field.helpText, input.helpText)
        : false,
  );
}

export function isDefaultQuoteFieldLabel(input: {
  fieldKey: string;
  label: string;
}): boolean {
  return defaultQuoteFieldCopies(input.fieldKey).some(
    (field) => defaultQuoteFieldTextMatches(field.label, input.label),
  );
}

export function resolveConsentNoticeForLanguage(input: {
  language: unknown;
  value?: string | undefined;
}): string {
  const language = readSupportedLanguage(input.language);
  const value = input.value?.trim();
  const defaultConsentNotices = Object.values(copyByLanguage).map(
    (copy) => copy.quoteForm.consentNoticeDefault,
  );
  const legacyDefaultConsentNotices = [
    "By submitting this request, you agree that your information will be shared with this business to respond to your quote request. BizPilot may help prepare internal AI drafts, but the business reviews messages before sending.",
    "En envoyant cette demande, vous acceptez que vos renseignements soient partagés avec cette entreprise afin qu'elle réponde à votre demande de soumission. BizPilot peut aider à préparer des brouillons IA internes, mais l'entreprise révise les messages avant de les envoyer.",
  ];

  if (
    !value ||
    defaultConsentNotices.includes(value) ||
    legacyDefaultConsentNotices.includes(value)
  ) {
    return copyByLanguage[language].quoteForm.consentNoticeDefault;
  }

  return value;
}

export function getQuoteOptionLabel(input: {
  language: unknown;
  value: string;
}): string {
  const copy = getBizPilotCopy(input.language);
  const translated = copy.optionLabels[input.value];

  if (translated) {
    return translated;
  }

  return input.value
    .split(/[_-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function localizeDefaultQuoteField(input: {
  fieldKey: string;
  helpText: string | null;
  label: string;
  language: unknown;
}): { helpText: string | null; label: string } {
  const language = readSupportedLanguage(input.language);
  const target = copyByLanguage[language].quoteFields[input.fieldKey];

  if (!target) {
    return {
      helpText: input.helpText,
      label: input.label,
    };
  }

  return {
    helpText:
      input.helpText && isDefaultQuoteFieldHelpText({
        fieldKey: input.fieldKey,
        helpText: input.helpText,
      })
        ? (target.helpText ?? null)
        : input.helpText,
    label: isDefaultQuoteFieldLabel({
      fieldKey: input.fieldKey,
      label: input.label,
    })
      ? target.label
      : input.label,
  };
}

export function isSafePublicIntakeMessage(message: string): boolean {
  const exactMessages = Object.values(copyByLanguage).flatMap((copy) => [
    copy.intakeErrors.consentRequired,
    copy.intakeErrors.formChanged,
    copy.intakeErrors.linkUnavailable,
    copy.intakeErrors.rejected,
    copy.intakeErrors.submittedTooFast,
    copy.intakeErrors.temporarySubmitUnavailable,
  ]);

  if (exactMessages.includes(message)) {
    return true;
  }

  const suffixes = [
    " is required.",
    " must be a valid number.",
    " cannot be negative.",
    " must be a valid date.",
    " cannot be in the past.",
    " has an unavailable option.",
    " contient une option indisponible.",
    " doit être rempli.",
    " doit être un nombre valide.",
    " ne peut pas être négatif.",
    " doit être une date valide.",
    " ne peut pas être dans le passé.",
  ];

  return suffixes.some((suffix) => message.endsWith(suffix));
}
