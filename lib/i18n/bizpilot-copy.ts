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
 * Last Updated: 2026-06-16
 * Change Log:
 * - 2026-06-16: Aligned Settings copy with Phase 23/24 readiness and first-pilot manual-only decisions.
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
  linkUnavailable: string;
  rejected: string;
  submittedTooFast: string;
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
    logoAndColorsConfigured: string;
    logoPreview: string;
    logoUrl: string;
    primaryColor: string;
    publicQuoteButton: string;
    submitQuoteRequest: string;
    title: string;
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
    addCustomField: string;
    close: string;
    customFieldBuilder: string;
    customerFacingQuestion: string;
    customerQuestion: string;
    customize: string;
    description: string;
    fieldKey: string;
    fieldKeyHelp: string;
    helperText: string;
    hidden: string;
    newFieldName: string;
    optional: string;
    options: string;
    optionsHelp: string;
    position: string;
    priority: string;
    required: string;
    showOnPublicForm: string;
    title: string;
    type: string;
    typeLabels: Readonly<Record<QuoteFieldTypeLabelKey, string>>;
    visible: string;
    visibleOnForm: string;
  }>;
  faq: Readonly<{
    description: string;
    help: string;
    label: string;
    placeholder: string;
    title: string;
  }>;
  headerDescription: (businessName: string) => string;
  noBusinessDescription: string;
  notifications: Readonly<{
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
    description: string;
    previewPublicPage: string;
    publicQuoteLink: string;
    saveBeforePreview: string;
    title: string;
  }>;
  readiness: Readonly<{
    description: (completed: number, total: number) => string;
    readyToShare: string;
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
  searchPlaceholder: string;
  sorts: Readonly<{
    mostUrgent: string;
    newest: string;
    oldest: string;
  }>;
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
  statusLabels: Record<string, string>;
  timeline: string;
  values: Readonly<{
    no: string;
    yes: string;
  }>;
}>;

type DashboardLeadsPageCopy = Readonly<{
  active: string;
  atRiskBadge: (count: number) => string;
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
  heroBadge: string;
  heroDescription: string;
  heroTitle: (count: number) => string;
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
  queue: Readonly<{
    description: string;
    title: string;
  }>;
}>;

type DashboardWorkspaceAccessCopy = Readonly<{
  deletionRequestedBody: string;
  deletionRequestedTitle: string;
  eyebrow: string;
  pausedBody: string;
  pausedTitle: string;
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
  guidesLabel: string;
  levelLabel: string;
  levelLabels: Readonly<Record<FeatureLevel, string>>;
  ownerLabel: string;
  stateLabels: Readonly<Record<FeatureState, string>>;
  statusLabel: string;
  title: string;
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
  forgotPassword: string;
  forgotPasswordFooter: string;
  forgotPasswordQuestion: string;
  forgotPasswordSubtitle: string;
  forgotPasswordTitle: string;
  name: string;
  needAccount: string;
  needNewResetLink: string;
  newPassword: string;
  ownerAccess: string;
  password: string;
  passwordHelp: string;
  repeatNewPassword: string;
  requestAgain: string;
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
  updatePassword: string;
  updatePasswordPending: string;
  yourBusiness: string;
  yourName: string;
}>;

type DashboardCopy = Readonly<{
  actions: Readonly<{
    copyQuoteLink: string;
    openLeadQueue: string;
    previewPublicPage: string;
    previewQuotePage: string;
    saveConfiguration: string;
    signOut: string;
  }>;
  businessProfile: DashboardBusinessProfileCopy;
  configuration: DashboardConfigurationCopy;
  leadDetail: DashboardLeadDetailCopy;
  leadQueue: DashboardLeadQueueCopy;
  leadsPage: DashboardLeadsPageCopy;
  overview: DashboardOverviewCopy;
  nav: Readonly<{
    businessProfile: string;
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
  }>;
  workspaceAccess: DashboardWorkspaceAccessCopy;
}>;

export type BizPilotCopy = Readonly<{
  aiFallback: AiFallbackCopy;
  auth: AuthCopy;
  dashboard: DashboardCopy;
  demo: DemoCopy;
  intakeErrors: IntakeErrorCopy;
  leadRules: LeadRuleCopy;
  missingInfoLabels: Record<string, string>;
  optionLabels: Record<string, string>;
  quoteFields: Record<string, QuoteFieldCopy>;
  quoteForm: Readonly<{
    aiDisclosure: string;
    consentNoticeDefault: string;
    emptySection: string;
    selectPlaceholder: string;
    submitButton: string;
    stepProgress: (index: number, total: number, label: string) => string;
    steps: ReadonlyArray<QuoteStepCopy>;
  }>;
  quotePage: Readonly<{
    badge: string;
    description: string;
    subtitle: string;
    unavailableBody: string;
    unavailableCta: string;
    unavailableSubtitle: string;
    unavailableTitle: string;
  }>;
  quoteSuccess: Readonly<{
    backHome: string;
    body: string;
    footer: (businessName: string) => string;
    nextTitle: string;
    requestSent: string;
    submitAnother: string;
    title: (businessName: string) => string;
    steps: (businessName: string) => string[];
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
    createAccount: "Create account",
    createAccountPending: "Creating workspace...",
    createWorkspaceFooter:
      "Owner access for the BizPilot AI Quote Recovery workspace.",
    createWorkspaceSubtitle:
      "Create owner access and your first business workspace.",
    createWorkspaceTitle: "Create your workspace",
    email: "Email",
    forgotPassword: "Forgot password?",
    forgotPasswordFooter:
      "Password reset is handled through Supabase Auth email recovery.",
    forgotPasswordQuestion: "Remembered your password?",
    forgotPasswordSubtitle:
      "Enter your owner email and we'll send reset instructions if an account exists.",
    forgotPasswordTitle: "Reset password",
    name: "Name",
    needAccount: "Need an account?",
    needNewResetLink: "Need a new reset link?",
    newPassword: "New password",
    ownerAccess: "Owner access",
    password: "Password",
    passwordHelp: "Use at least 8 characters for your password.",
    repeatNewPassword: "Repeat your new password",
    requestAgain: "Request again",
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
    signInFooter: "Secure owner access for your Quote Recovery workspace.",
    signInPending: "Opening workspace...",
    signInQuestion: "Already have an account?",
    signInSubtitle:
      "Manage quote requests, replies, and follow-ups from one place.",
    signInTitle: "Sign in",
    updatePassword: "Update password",
    updatePasswordPending: "Updating password...",
    yourBusiness: "Your business",
    yourName: "Your name",
  },
  dashboard: {
    actions: {
      copyQuoteLink: "Copy quote link",
      openLeadQueue: "Open Lead Queue",
      previewPublicPage: "Preview public page",
      previewQuotePage: "Preview quote page",
      saveConfiguration: "Save configuration",
      signOut: "Sign out",
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
        "These fields are part of the approved index design but are not yet wired to a database column. They will land with their own migration after pilot validation.",
      futureFields: "Roadmap fields",
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
        openPublicQuoteLink: "Open public quote link",
        saveConfiguration: "Save configuration",
        text: "Save configuration after editing, then preview the public quote link.",
      },
      branding: {
        accentAppears:
          "Accent appears on progress, focus, and supporting highlights.",
        accentColor: "Accent color",
        addLogoAndColors: "Add logo and colors",
        colorsConfigured: "Colors ready",
        description:
          "Public-facing visual settings for the cleaning quote experience.",
        logoAndColorsConfigured: "Logo and colors configured",
        logoPreview: "Logo preview",
        logoUrl: "Logo URL",
        primaryColor: "Primary color",
        publicQuoteButton: "Public quote button",
        submitQuoteRequest: "Submit quote request",
        title: "Branding",
        whereColorsApply: "Where these colors apply",
      },
      fields: {
        addCustomField: "Add custom field",
        close: "Close",
        customFieldBuilder:
          "Create owner-specific questions with type, visibility, required status, and priority.",
        customerFacingQuestion: "Customer-facing question",
        customerQuestion: "Customer question",
        customize: "Customize",
        description:
          "Choose which customer questions appear on the public quote form, add owner-specific fields, and set their priority.",
        fieldKey: "Field key",
        fieldKeyHelp:
          "Optional. Lowercase letters, numbers, and underscores. Leave blank to generate from the label.",
        helperText: "Helper text",
        hidden: "Not visible",
        newFieldName: "New customer question",
        optional: "Optional",
        options: "Options",
        optionsHelp: "For select or radio fields. One option per line or comma.",
        position: "Position",
        priority: "Priority",
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
        description:
          "Reusable customer questions and answers for the cleaning business profile.",
        help: "One FAQ per line. Use: Question? | Answer",
        label: "FAQ",
        placeholder: "Do you bring supplies? | Yes, we bring all standard supplies.",
        title: "AI instructions and FAQ",
      },
      headerDescription: (businessName) =>
        `Configure the cleaning quote experience, public link, consent, and owner-ready lead foundation for ${businessName}.`,
      noBusinessDescription: "No tenant business is available for this user yet.",
      notifications: {
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
        description:
          "Shareable customer quote page generated from the active business slug and quote form.",
        previewPublicPage: "Preview public page",
        publicQuoteLink: "Public quote link",
        saveBeforePreview:
          "Save changes before previewing branding, consent, services, and quote questions.",
        title: "Quote link and public page",
      },
      readiness: {
        description: (completed, total) => `${completed}/${total} setup tasks complete.`,
        readyToShare: "Ready to share",
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
      reset: "Reset",
      searchPlaceholder: "Search leads, city, service...",
      sorts: {
        mostUrgent: "Most urgent",
        newest: "Newest",
        oldest: "Oldest",
      },
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
          "Owner reviewed",
        ],
        manualDraftDescription:
          "Generate a draft when ready. BizPilot prepares a summary, reply draft, follow-up draft, and next action. Owner reviews, copies, and sends manually.",
        missingInfo: "Missing info",
        modelDraft: "Model draft",
        nextAction: "Next action",
        noSend: "No Send button in MVP. Owner copies and sends manually.",
        ownerReviewRequired: "Owner review required",
        regenerate: "Regenerate",
        ruleFallback: "Rule fallback",
        source: "Source",
        suggestedReply: "Suggested reply",
        title: "AI Summary",
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
      markReplyCopied: "Mark Reply Copied",
      markWon: "Mark Won",
      missing: {
        description: "Ask these before estimating or promising availability.",
        noRequiredMissing: "No required quote details missing",
        title: "Missing information detected",
      },
      noActionItemsBody: "Follow-up and reply tasks will appear here.",
      noActionItemsTitle: "No action items",
      noTimelineBody:
        "Lead activity will appear here as the owner reviews and acts.",
      noTimelineTitle: "No timeline events",
      notProvided: "Not provided",
      notYet: "Not yet",
      ownerNotes: {
        description:
          "Private notes for pilot learning and follow-up quality. Storage will be wired in a later phase; the field is visible to remind the owner of what to track.",
        persistenceNote:
          "Notes persistence is part of Phase 18B and is not yet stored server-side.",
        placeholder:
          "Add notes about this request, objections, pricing context, or follow-up outcome...",
        title: "Owner notes",
      },
      quoteIntakeFields: "Quote intake fields",
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
          owner_review: "Owner Review",
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
          ready_for_owner_reply: "Ready for owner reply",
          recurring_request: "Recurring cleaning opportunity",
          response_overdue: "Response is overdue",
        },
        reviewerLabel: "Suggested reviewer",
        reviewers: {
          owner: "Owner",
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
          "Owner-controlled status and manual outcome tracking. Nothing changes automatically.",
        controlsTitle: "Lead controls",
        leadDetailsDescription:
          "Quote intake values captured from the public form.",
        leadDetailsTitle: "Lead details",
      },
      statusLabels: {
        archived: "Archived",
        action_completed: "Action completed",
        ask_info: "Ask info",
        asked_info: "Asked info",
        booked: "Booked",
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
        "New -> Needs reply -> Reviewed / Won / Lost. AI drafts are owner-reviewed only; no automatic sending.",
      statusRulesTitle: "Status rules",
    },
    overview: {
      aiControlBody:
        "BizPilot drafts replies, summaries, and follow-ups. Nothing is sent automatically.",
      aiControlBadges: ["No auto-send", "No invented pricing", "Owner reviewed"],
      aiControlTitle: "AI stays under your control",
      atRiskSoon: "At risk soon",
      copyLink: "Copy link",
      featuredFallbackAction:
        "Ask for apartment size, preferred date, and access details before giving an estimate range.",
      featuredFallbackAge: "22m ago",
      featuredFallbackArea: "Plateau",
      featuredFallbackCustomer: "Sarah M.",
      featuredFallbackService: "Move-out cleaning",
      finishSetup: "Finish setup",
      heroBadge: "Phase 21Q - Production readiness",
      heroDescription:
        "Reply while the customer is still comparing options. BizPilot surfaces urgent leads, drafts the response, and keeps the owner in control.",
      heroTitle: (count) => `${count} quote requests need attention today.`,
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
          detail: "Waiting for owner response",
          label: "Needs reply",
        },
        newQuoteRequests: {
          detail: "Last 7 days · healthy pilot signal",
          label: "New quote requests",
        },
      },
      noWorkspaceBody:
        "Create or join a business workspace before using the quote recovery desk.",
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
        description: "Operational timeline for quote recovery and owner actions.",
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
        title: "Owner routine suggestion",
      },
      status: {
        aiDraftReady: "AI draft ready",
        missingInfo: "Missing info",
        ready: "Ready",
      },
      suggestedNextAction: "Suggested next action:",
    },
    nav: {
      businessProfile: "Business Profile",
      leads: "Leads",
      overview: "Overview",
      ownerWorkspace: "Owner workspace",
      quoteSetup: "Quote Setup",
      settings: "Settings",
      workspaceSubtitle: "Quote Recovery Desk",
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
        subtitle: "Phase 18B pilot tracking shell",
        title: "Founder Admin Console",
      },
      leadDetail: {
        subtitle: "Lead details, missing info, and owner-reviewed AI drafts",
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
        stateLabels: {
          blocked_external: "External blocker",
          enabled: "Enabled",
          owner_controlled: "Owner controlled",
          planned: "Planned",
          setup_required: "Setup required",
        },
        statusLabel: "Status",
        title: "Feature levels",
      },
      future: "Future",
      futureSections: "Future sections",
      futureSectionsDescription:
        "Roadmap placeholders stay visible but locked before validation.",
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
        "Dark mode remains the default operational view. Light mode is available for daytime use.",
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
    },
    workspaceAccess: {
      deletionRequestedBody:
        "This business workspace is locked while the deletion request is reviewed. Your login account is not deleted automatically.",
      deletionRequestedTitle: "Workspace deletion has been requested.",
      eyebrow: "Workspace access",
      pausedBody:
        "Your dashboard is currently blocked because no active business membership is available. Your data is retained; contact BizPilot support if this looks unexpected.",
      pausedTitle: "This workspace is paused or unavailable.",
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
      "We couldn't submit the quote request. Please review the form and try again.",
    fieldRequired: (label) => `${label} is required.`,
    formChanged: "The quote form changed. Please refresh and submit again.",
    linkUnavailable: "This quote link is not available.",
    nonNegativeNumber: (label) => `${label} cannot be negative.`,
    notPastDate: (label) => `${label} cannot be in the past.`,
    rejected: "Submission rejected.",
    submittedTooFast: "Please wait a moment and submit the quote request again.",
    validDate: (label) => `${label} must be a valid date.`,
    validNumber: (label) => `${label} must be a valid number.`,
  },
  leadRules: {
    actionAskInfo: "Ask for missing quote details",
    actionFollowUp: "Follow up with this lead",
    actionReply: "Reply to this lead",
    actionReplyOverdue: "Reply to overdue lead",
    archiveOrReviewArea: "Archive or review service area",
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
      helpText: "Email or phone for owner follow-up.",
      label: "Customer contact",
    },
    customer_email: {
      helpText: "Best email address for owner follow-up.",
      label: "Email address",
    },
    customer_name: {
      helpText: "Name of the person requesting the quote.",
      label: "Customer name",
    },
    customer_phone: {
      helpText: "Best phone number for owner follow-up.",
      label: "Phone number",
    },
    home_address: {
      helpText:
        "Street address or nearest major intersection for the cleaning request.",
      label: "Home address",
    },
    notes: {
      helpText: "Extra context for the owner.",
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
      "BizPilot may help prepare internal AI drafts later, but the business reviews messages before sending.",
    consentNoticeDefault:
      "By submitting this request, you agree that your information will be shared with this business to respond to your quote request. BizPilot may help prepare internal AI drafts, but the business reviews messages before sending.",
    emptySection: "Nothing to fill on this section.",
    selectPlaceholder: "Select an option",
    stepProgress: (index, total, label) => `Step ${index} of ${total} - ${label}`,
    steps: [
      {
        description:
          "A few quick details so the owner can prepare an accurate reply.",
        id: "service",
        label: "Service",
        title: "What kind of cleaning?",
      },
      {
        description:
          "Timing and location help the owner check availability and travel.",
        id: "when_where",
        label: "When & where",
        title: "When and where?",
      },
      {
        description:
          "We pass these details directly to the business. Nothing is sent automatically.",
        id: "contact",
        label: "Contact",
        title: "How should the owner reach you?",
      },
    ],
    submitButton: "Send quote request",
  },
  quotePage: {
    badge: "Cleaning quote",
    description:
      "A short quote form. The business owner reviews every request and replies directly - nothing is sent automatically.",
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
      "The business reviews every request manually. They will follow up directly with the next step. Nothing is booked and no price is confirmed yet.",
    footer: (businessName) =>
      `BizPilot AI helps ${businessName} reply faster. The business stays in control of every message.`,
    nextTitle: "What happens next",
    requestSent: "Request sent",
    steps: (businessName) => [
      `${businessName} reviews your request and missing details.`,
      "They prepare an owner-reviewed reply - no automatic messages.",
      "You hear back through the contact you submitted.",
    ],
    submitAnother: "Submit another quote",
    title: (businessName) =>
      `Thanks - ${businessName} received your quote request.`,
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
    createAccount: "Créer le compte",
    createAccountPending: "Création de l'espace...",
    createWorkspaceFooter:
      "Accès propriétaire pour l'espace Quote Recovery de BizPilot AI.",
    createWorkspaceSubtitle:
      "Créez l'accès propriétaire et votre premier espace d'entreprise.",
    createWorkspaceTitle: "Créer votre espace",
    email: "Courriel",
    forgotPassword: "Mot de passe oublié?",
    forgotPasswordFooter:
      "La réinitialisation passe par le courriel de récupération Supabase Auth.",
    forgotPasswordQuestion: "Mot de passe retrouvé?",
    forgotPasswordSubtitle:
      "Entrez votre courriel propriétaire. Nous enverrons les instructions si un compte existe.",
    forgotPasswordTitle: "Réinitialiser le mot de passe",
    name: "Nom",
    needAccount: "Besoin d'un compte?",
    needNewResetLink: "Besoin d'un nouveau lien?",
    newPassword: "Nouveau mot de passe",
    ownerAccess: "Accès propriétaire",
    password: "Mot de passe",
    passwordHelp: "Utilisez au moins 8 caractères pour votre mot de passe.",
    repeatNewPassword: "Répétez le nouveau mot de passe",
    requestAgain: "Demander à nouveau",
    resetInvalid:
      "Ce lien de réinitialisation est invalide ou expiré. Demandez un nouveau lien.",
    resetPasswordFooter: "Utilisez un mot de passe unique pour BizPilot.",
    resetPasswordReuseHelp:
      "Choisissez un nouveau mot de passe. Vous ne pouvez pas réutiliser l'ancien.",
    resetPasswordSubtitle:
      "Choisissez un nouveau mot de passe pour votre espace propriétaire.",
    resetPasswordTitle: "Définir un nouveau mot de passe",
    resetPreparing: "Préparation de votre session de réinitialisation...",
    resetRequestPending: "Envoi des instructions...",
    resetRequestSubmit: "Envoyer les instructions",
    signIn: "Connexion",
    signInFooter: "Accès sécurisé à votre espace Quote Recovery.",
    signInPending: "Ouverture de l'espace...",
    signInQuestion: "Vous avez déjà un compte?",
    signInSubtitle:
      "Gérez les demandes de soumission, les réponses et les suivis au même endroit.",
    signInTitle: "Connexion",
    updatePassword: "Mettre à jour le mot de passe",
    updatePasswordPending: "Mise à jour...",
    yourBusiness: "Votre entreprise",
    yourName: "Votre nom",
  },
  dashboard: {
    actions: {
      copyQuoteLink: "Copier le lien",
      openLeadQueue: "Ouvrir les leads",
      previewPublicPage: "Voir la page publique",
      previewQuotePage: "Aperçu de la soumission",
      saveConfiguration: "Enregistrer",
      signOut: "Déconnexion",
    },
    businessProfile: {
      accountEmailHelp: "Courriel du compte - modifiez-le dans les réglages.",
      aiNotes: "Zone de service et notes opérationnelles",
      aiNotesDescription:
        "Contexte qui aide le propriétaire et l'IA à préparer de meilleurs brouillons. Les garde-fous IA et FAQ restent dans Configuration.",
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
        "Ces champs font partie du design approuvé, mais ne sont pas encore reliés à la base de données. Ils arriveront avec leur propre migration après validation pilote.",
      futureFields: "Champs de feuille de route",
      languageHelp:
        "Utilisée pour la page publique et la langue des brouillons IA.",
      logoUrl: "URL du logo",
      notInMvp: "Hors MVP",
      oneAreaPerLine:
        "Une zone par ligne. Utilisée pour scorer les leads et expliquer la couverture.",
      openQuoteSetup: "Ouvrir Configuration",
      ownerEmail: "Courriel propriétaire (lecture seule)",
      preferredLanguage: "Langue préférée",
      previewQuotePage: "Aperçu page de soumission",
      publicQuoteLink: "Lien public",
      publicSlug: "Slug public",
      roadmapFields: [
        ["Nom public propriétaire", "Phase 18B"],
        ["Téléphone propriétaire", "Phase 18B"],
        ["Site web public", "Phase 18B"],
        ["Ville", "Phase 18B"],
        ["Province", "Phase 18B"],
        ["Heures de réponse", "Phase 18B"],
      ],
      save: "Enregistrer le profil",
      saveNote:
        "L'enregistrement conserve les changements d'identité. Les questions du formulaire se gèrent dans Configuration.",
      serviceAreas: "Zones desservies",
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
        openPublicQuoteLink: "Ouvrir le lien public",
        saveConfiguration: "Enregistrer",
        text: "Enregistrez la configuration après les changements, puis prévisualisez le lien public.",
      },
      branding: {
        accentAppears:
          "L'accent apparaît sur la progression, le focus et les éléments de soutien.",
        accentColor: "Couleur d'accent",
        addLogoAndColors: "Ajouter logo et couleurs",
        colorsConfigured: "Couleurs prêtes",
        description:
          "Réglages visuels publics pour l'expérience de soumission de nettoyage.",
        logoAndColorsConfigured: "Logo et couleurs configurés",
        logoPreview: "Aperçu du logo",
        logoUrl: "URL du logo",
        primaryColor: "Couleur principale",
        publicQuoteButton: "Bouton de soumission public",
        submitQuoteRequest: "Envoyer la demande",
        title: "Marque",
        whereColorsApply: "Où ces couleurs s'appliquent",
      },
      fields: {
        addCustomField: "Ajouter un champ",
        close: "Fermer",
        customFieldBuilder:
          "Créez des questions propres au propriétaire avec type, visibilité, statut requis et priorité.",
        customerFacingQuestion: "Question visible par le client",
        customerQuestion: "Question client",
        customize: "Personnaliser",
        description:
          "Choisissez les questions affichées sur le formulaire public, ajoutez des champs propres au propriétaire et définissez leur priorité.",
        fieldKey: "Clé du champ",
        fieldKeyHelp:
          "Optionnel. Lettres minuscules, chiffres et traits de soulignement. Laissez vide pour générer depuis le libellé.",
        helperText: "Texte d'aide",
        hidden: "Non visible",
        newFieldName: "Nouvelle question client",
        optional: "Optionnel",
        options: "Options",
        optionsHelp:
          "Pour les champs select ou radio. Une option par ligne ou séparée par une virgule.",
        position: "Position",
        priority: "Priorité",
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
          select: "Select",
          text: "Texte",
          textarea: "Texte long",
          time_window: "Plage horaire",
        },
        visible: "Visible",
        visibleOnForm: "Visible sur le formulaire",
      },
      faq: {
        description:
          "Questions et réponses réutilisables pour le profil de l'entreprise de nettoyage.",
        help: "Une FAQ par ligne. Format: Question? | Réponse",
        label: "FAQ",
        placeholder: "Apportez-vous les fournitures? | Oui, nous apportons les fournitures standards.",
        title: "Instructions IA et FAQ",
      },
      headerDescription: (businessName) =>
        `Configurez l'expérience de soumission, le lien public, le consentement et la base de récupération pour ${businessName}.`,
      noBusinessDescription:
        "Aucune entreprise locataire n'est disponible pour cet utilisateur.",
      notifications: {
        description:
          "Le premier pilote est manuel: le proprietaire verifie le tableau de bord. Les notifications courriel proprietaire, SMS et WhatsApp restent desactivees avant validation.",
        emailActive: "Verification manuelle du tableau de bord",
        futureDisabled: "Desactive avant validation",
        newQuoteRequest: "Nouvelle demande",
        off: "Désactivé",
        ownerEmail: "Courriel propriétaire",
        summary:
          "Verification manuelle du tableau de bord - notification proprietaire differee",
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
        description:
          "Page de soumission partageable générée à partir du slug actif et du formulaire.",
        previewPublicPage: "Aperçu public",
        publicQuoteLink: "Lien public",
        saveBeforePreview:
          "Enregistrez les changements avant de prévisualiser la marque, le consentement, les services et les questions.",
        title: "Lien public et page de soumission",
      },
      readiness: {
        description: (completed, total) => `${completed}/${total} tâches complétées.`,
        readyToShare: "Prêt à partager",
        setupInProgress: "Configuration en cours",
        title: "Préparation du lien public",
      },
      services: {
        areasHelp: "Exemple: Montréal, Laval, Longueuil, Rive-Sud",
        description:
          "Entrez une ville, un quartier ou une région par ligne. Les leads hors zone peuvent être marqués comme moins compatibles.",
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
        filteredTitle: "Aucun lead ne correspond à ces filtres.",
        noLeadsBody:
          "Partagez votre lien de soumission pour commencer à recevoir des demandes.",
        noLeadsTitle: "Aucun lead pour l'instant.",
      },
      fallbacks: {
        area: "Secteur à confirmer",
        service: "Service non défini",
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
      reset: "Réinitialiser",
      searchPlaceholder: "Rechercher leads, ville, service...",
      sorts: {
        mostUrgent: "Plus urgent",
        newest: "Plus récent",
        oldest: "Plus ancien",
      },
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
          "La modification intégrée est une amélioration de workflow future.",
        estimatedCost: "Coût estimé",
        fallbackReason: "Raison du repli IA",
        followUpDraft: "Brouillon de suivi",
        generate: "Générer un brouillon IA",
        guardrails: "Garde-fous IA",
        guardrailBadges: [
          "Aucun envoi automatique",
          "Aucun prix inventé",
          "Révisé par le propriétaire",
        ],
        manualDraftDescription:
          "Générez un brouillon quand vous êtes prêt. BizPilot prépare un résumé, une réponse, un suivi et la prochaine action. Le propriétaire révise, copie et envoie manuellement.",
        missingInfo: "Infos manquantes",
        modelDraft: "Brouillon modèle",
        nextAction: "Prochaine action",
        noSend:
          "Aucun bouton Envoyer dans le MVP. Le propriétaire copie et envoie manuellement.",
        ownerReviewRequired: "Révision propriétaire requise",
        regenerate: "Regénérer",
        ruleFallback: "Repli par règles",
        source: "Source",
        suggestedReply: "Réponse suggérée",
        title: "Résumé IA",
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
        unnamedLead: "Lead sans nom",
      },
      labels: {
        manualOutcome: "Résultat manuel",
        primaryIssue: "Point principal",
        recommendedAction: "Action recommandée",
        status: "Statut",
      },
      mark: "Marquer",
      markReplyCopied: "Réponse copiée",
      markWon: "Marquer gagné",
      missing: {
        description:
          "Demandez ces détails avant d'estimer ou de promettre une disponibilité.",
        noRequiredMissing: "Aucun détail requis ne manque",
        title: "Informations manquantes détectées",
      },
      noActionItemsBody: "Les tâches de réponse et de suivi apparaîtront ici.",
      noActionItemsTitle: "Aucune action",
      noTimelineBody:
        "L'activité du lead apparaîtra ici pendant la révision par le propriétaire.",
      noTimelineTitle: "Aucun événement",
      notProvided: "Non fourni",
      notYet: "Pas encore",
      ownerNotes: {
        description:
          "Notes privées pour apprendre pendant le pilote et améliorer les suivis. La sauvegarde sera reliée dans une phase future; le champ rappelle quoi suivre.",
        persistenceNote:
          "La sauvegarde des notes fait partie de la Phase 18B et n'est pas encore stockée côté serveur.",
        placeholder:
          "Ajoutez des notes sur la demande, les objections, le contexte de prix ou le résultat du suivi...",
        title: "Notes propriétaire",
      },
      quoteIntakeFields: "Champs de soumission",
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
          intake_review: "Révision intake",
          move_out_cleaning: "Nettoyage de déménagement",
          owner_review: "Révision propriétaire",
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
          ready_for_owner_reply: "Prêt pour une réponse propriétaire",
          recurring_request: "Occasion de nettoyage récurrent",
          response_overdue: "Réponse en retard",
        },
        reviewerLabel: "Réviseur suggéré",
        reviewers: {
          owner: "Propriétaire",
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
          "Statut et résultat manuel contrôlés par le propriétaire. Rien ne change automatiquement.",
        controlsTitle: "Contrôles du lead",
        leadDetailsDescription:
          "Valeurs capturées depuis le formulaire public.",
        leadDetailsTitle: "Détails du lead",
      },
      statusLabels: {
        archived: "Archivé",
        action_completed: "Action complétée",
        ask_info: "Demander infos",
        asked_info: "Infos demandées",
        booked: "Gagné",
        completed: "Complété",
        dismissed: "Ignoré",
        follow_up: "Suivi",
        follow_up_due: "Suivi dû",
        follow_up_marked: "Suivi marqué",
        follow_up_needed: "Suivi requis",
        lead_created: "Lead créé",
        lead_viewed: "Lead vu",
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
      atRiskBadge: (count) => `${count} à risque`,
      focusAtRiskDescription: (count) =>
        `${count} lead${count === 1 ? "" : "s"} à risque. Révisez-les avant les demandes déjà révisées ou archivées.`,
      focusHealthyDescription:
        "Aucun lead à risque pour l'instant. Continuez à vérifier les nouvelles demandes.",
      focusTitle: "Focus récupération du jour",
      lastSubmission: (age) => `Dernière demande: ${age}.`,
      missingInfoBadge: (count) => `${count} infos manquantes`,
      newBadge: (count) => `${count} nouveau${count === 1 ? "" : "x"}`,
      openQuoteSetup: "Ouvrir Configuration",
      quoteLinkHealth: "Santé du lien public",
      statusRulesBody:
        "Nouveau -> Réponse requise -> Révisé / Gagné / Perdu. Les brouillons IA sont révisés par le propriétaire seulement; aucun envoi automatique.",
      statusRulesTitle: "Règles de statut",
    },
    overview: {
      aiControlBody:
        "BizPilot prépare des réponses, résumés et suivis. Rien n'est envoyé automatiquement.",
      aiControlBadges: [
        "Aucun envoi automatique",
        "Aucun prix inventé",
        "Révisé par le propriétaire",
      ],
      aiControlTitle: "L'IA reste sous votre contrôle",
      atRiskSoon: "Bientôt à risque",
      copyLink: "Copier le lien",
      featuredFallbackAction:
        "Demander la taille du logement, la date souhaitée et les détails d'accès avant de donner une fourchette d'estimation.",
      featuredFallbackAge: "22 min",
      featuredFallbackArea: "Plateau",
      featuredFallbackCustomer: "Sarah M.",
      featuredFallbackService: "Nettoyage de déménagement",
      finishSetup: "Terminer la configuration",
      heroBadge: "Phase 21Q - Préparation production",
      heroDescription:
        "Répondez pendant que le client compare encore ses options. BizPilot fait ressortir les leads urgents, prépare la réponse et garde le propriétaire en contrôle.",
      heroTitle: (count) =>
        `${count} demande${count === 1 ? "" : "s"} de soumission demandent votre attention aujourd'hui.`,
      metrics: {
        aiDraftsReady: {
          detail: "Réviser avant utilisation. Aucun envoi automatique.",
          label: "Brouillons IA prêts",
        },
        atRiskLeads: {
          detail: "Aucune réponse après le seuil de récupération",
          label: "Leads à risque",
        },
        needsReply: {
          detail: "En attente d'une réponse du propriétaire",
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
          "Les 5 demandes les plus urgentes. Ouvrez la file complète pour filtrer, trier et agir sur chaque lead.",
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
          "Chronologie opérationnelle des demandes et actions du propriétaire.",
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
        missingInfoDetail: (count) => `${count} lead a besoin de détails`,
        missingInfoTitle: "Infos manquantes",
        replyDetail: (count) => `${count} leads en attente`,
        replyTitle: "Réponse requise",
        title: "Focus récupération du jour",
      },
      reviewUrgentLead: "Réviser le lead urgent",
      routine: {
        steps: [
          ["1", "Réviser les leads à risque", "Commencer par les demandes en retard."],
          ["2", "Copier les réponses IA", "Modifier avant l'envoi manuel."],
          ["3", "Relancer les demandes sans réponse", "Utiliser les brouillons approuvés."],
        ],
        title: "Routine suggérée au propriétaire",
      },
      status: {
        aiDraftReady: "Brouillon IA prêt",
        missingInfo: "Infos manquantes",
        ready: "Prêt",
      },
      suggestedNextAction: "Prochaine action suggérée:",
    },
    nav: {
      businessProfile: "Profil d'entreprise",
      leads: "Leads",
      overview: "Vue d'ensemble",
      ownerWorkspace: "Espace propriétaire",
      quoteSetup: "Configuration",
      settings: "Réglages",
      workspaceSubtitle: "Bureau Quote Recovery",
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
        subtitle: "Vue d'aujourd'hui pour récupérer les leads",
        title: "Tableau de bord",
      },
      founder: {
        subtitle: "Console de suivi pilote Phase 18B",
        title: "Console fondateur",
      },
      leadDetail: {
        subtitle: "Détails du lead, infos manquantes et brouillons IA révisés",
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
      featureRegistry: {
        activationLabel: "Activation",
        categoryLabels: {
          admin: "Admin",
          ai: "IA",
          billing: "Facturation",
          communication: "Communication",
          data: "Donnees",
          intake: "Demandes",
          recovery: "Relance",
          scheduling: "Planification",
          settings: "Reglages",
        },
        description:
          "Niveaux de fonctionnalites controles par le proprietaire principal. Les outils actifs sont clairs, les outils a configurer affichent le blocage, et les outils planifies restent non cliquables.",
        featureCopy: {
          ai_draft_assistant: {
            activation:
              "Le fondateur active l'IA modele pour un pilote approuve apres le smoke final sans secret et l'approbation proprietaire.",
            name: "Assistant IA de brouillons",
            ownerGuide:
              "Verifier les gates Phase 24F/24G, surveiller l'usage et garder la revue proprietaire obligatoire.",
            setup:
              "La preuve fournisseur OpenAI synthetique est passee; l'usage donnees reelles reste gate par smoke final et approbation proprietaire.",
            summary:
              "Les resumes, brouillons de reponse et suivis restent relus par le proprietaire.",
            textGuide:
              "Explique le fallback, la confidentialite et le fait que BizPilot n'envoie pas automatiquement.",
            visualGuide:
              "Montrer resume, reponse suggeree, suivi, action copier et banniere fallback.",
          },
          backup_restore_posture: {
            activation:
              "Le fondateur accepte la preuve DB-level pour le premier pilote limite et complete la preuve app/RLS restauree avant pilote payant ou travail data risque.",
            name: "Sauvegarde et restauration",
            ownerGuide:
              "Noter emplacement, acces, cible de restauration, preuve Phase 24C.0 et deferral Phase 24C.1.",
            setup:
              "La preuve export/restauration DB-level est passee; la preuve app/dashboard/RLS restauree reste P1 avant pilote payant, migrations ou operations destructives.",
            summary:
              "Separe la preuve DB-level passee de la preuve stricte app/RLS differee.",
            textGuide:
              "Explique ce qui est sauvegarde, ou les exports vivent et qui peut restaurer.",
            visualGuide:
              "Montrer checklist, statut de drill et decision proprietaire.",
          },
          billing_payment_links: {
            activation:
              "Le fondateur garde la facturation manuelle ou ajoute des liens de paiement apres setup.",
            name: "Facturation et liens de paiement",
            ownerGuide:
              "Confirmer prix, fournisseur, annulation/remboursement et smoke.",
            setup: "Fournisseur/compte paiement requis.",
            summary:
              "La facturation pilote peut etre suivie sans pretendre que le billing in-app existe.",
            textGuide:
              "Explique facturation manuelle, liens de paiement, annulation et limites de remboursement.",
            visualGuide:
              "Montrer forfait, setup paiement requis et actions billing non cliquables.",
          },
          business_branding: {
            activation: "Le proprietaire modifie la marque dans Quote Setup.",
            name: "Marque d'entreprise",
            ownerGuide:
              "Verifier contraste et apercu public apres les changements logo/couleur.",
            setup: "Disponible maintenant.",
            summary:
              "Logo, couleurs, zones, services, FAQ et confidentialite forment la page publique.",
            textGuide:
              "Explique comment la marque renforce la confiance sur la page publique.",
            visualGuide:
              "Montrer apercu public, couleurs, services, FAQ et consentement.",
          },
          custom_smtp_auth_email: {
            activation:
              "Le courriel auth est actif apres Resend DNS, SMTP Supabase, confirmation signup et reset smokes passes.",
            name: "SMTP personnalise auth email",
            ownerGuide:
              "Ne jamais imprimer les identifiants. Garder la notification proprietaire app separee et differee.",
            setup:
              "La preuve courriel auth est passee; la notification proprietaire reste differee pour le premier pilote.",
            summary:
              "Livraison des confirmations signup et resets mot de passe pour vrais pilotes.",
            textGuide:
              "Explique confirmation/reset et quoi faire si l'email manque.",
            visualGuide:
              "Montrer email signup, email reset, logs fournisseur et retry.",
          },
          fr_ca_language: {
            activation: "Le proprietaire choisit la langue de l'espace.",
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
            name: "Controles admin fondateur",
            ownerGuide:
              "Utiliser dry-run d'abord, journaliser les actions et separer les actions destructives.",
            setup: "Controle par le proprietaire principal.",
            summary:
              "Type d'espace, forfait/statut, lien public, session, notes et securite cleanup.",
            textGuide:
              "Explique les changements visibles par le client et ceux reserves au fondateur.",
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
              "Explique les actions manuelles versus automatisees.",
            visualGuide:
              "Montrer brouillon facture, statut paiement, erreur et fallback manuel.",
          },
          customer_contact_list: {
            activation:
              "Le fondateur active apres regles de consentement, retention, export et acces premium.",
            name: "Liste de contacts clients",
            ownerGuide:
              "Definir visibilite owner/admin, import contacts, opt-out et limites export.",
            setup:
              "Fonction premium planifiee; regles contact et posture backup requises d'abord.",
            summary:
              "Liste premium owner/admin creee depuis email ou telephone client pour suivi et statistiques.",
            textGuide:
              "Explique qui voit la liste, quels contacts sont stockes et les limites d'usage publicitaire.",
            visualGuide:
              "Montrer liste clients, filtres par contact, visibilite owner/admin, consentement et export desactive.",
          },
          lead_source_attribution_analytics: {
            activation:
              "Le fondateur active apres taxonomie source et regles de confidentialite des graphiques.",
            name: "Analytics des sources de leads",
            ownerGuide:
              "Utiliser leads.source_channel et lead_source_metadata; ne jamais ajouter leads.source.",
            setup:
              "Fonction premium/admin planifiee; taxonomie source et graphiques non actifs.",
            summary:
              "Montre si les leads viennent du site web, Instagram, Facebook, Google, liens directs ou campagnes.",
            textGuide:
              "Explique libelles de source, UTM, referents et pourquoi les sources inconnues restent honnetes.",
            visualGuide:
              "Montrer graphique des sources, meilleurs canaux, liste recente, bucket inconnu et filtre date.",
          },
          quote_link_intake: {
            activation: "Le proprietaire controle le lien public actif.",
            name: "Lien public et intake",
            ownerGuide:
              "Lancer le smoke securite quote quand le formulaire change.",
            setup: "Disponible maintenant.",
            summary:
              "Un lien client capture des demandes structurees de nettoyage.",
            textGuide:
              "Explique partage du lien, champs requis, consentement et etats indisponibles.",
            visualGuide:
              "Montrer lien actif, etapes, validation, consentement et succes.",
          },
          quote_recovery_queue: {
            activation: "Fonction coeur du tableau de bord.",
            name: "File de relance leads",
            ownerGuide:
              "Garder priorite, statut et suivi alignes avec le vrai workflow.",
            setup: "Disponible maintenant.",
            summary:
              "Priorise nouveaux leads, urgences, infos manquantes et suivis.",
            textGuide:
              "Explique statuts, prochaines actions, revue proprietaire et copier/envoyer.",
            visualGuide:
              "Montrer file, filtres, detail lead, brouillon IA et action copier.",
          },
          scheduling_booking: {
            activation:
              "Le fondateur choisit fournisseur et niveau apres preuve quote recovery.",
            name: "Planification et booking",
            ownerGuide:
              "Definir limite manuel/auto, sync fournisseur, conflits et annulations.",
            setup: "Planifie; non active.",
            summary:
              "Workflow futur qui ne confirme pas de booking avant la vraie integration.",
            textGuide:
              "Explique demande versus booking confirme et regles d'approbation.",
            visualGuide:
              "Montrer heure demandee, approbation, confirmation, conflit et annulation.",
          },
          sms_whatsapp_messaging: {
            activation:
              "Le fondateur active apres approbation fournisseur, consentement, templates et smokes.",
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
              "Le fondateur choisit le niveau equipe apres stabilite owner-only.",
            name: "Membres d'equipe",
            ownerGuide:
              "Definir roles, invitations, RLS, audit log et offboarding.",
            setup: "Planifie; non active.",
            summary:
              "Acces multi-utilisateur futur avec roles et tracabilite.",
            textGuide:
              "Explique roles, permissions, invitations et acces.",
            visualGuide:
              "Montrer roles, invitation, invitation en attente, acces refuse et retrait.",
          },
        },
        guideLabels: {
          draft: "Guide brouillon",
          ready: "Guide pret",
          required: "Guide requis",
        },
        guidesLabel: "Guides",
        levelLabel: "Niveau",
        levelLabels: {
          admin: "Admin",
          core: "Core",
          custom: "Custom",
          founder: "Fondateur",
          pilot: "Pilote",
          plus: "Plus",
          premium: "Premium",
        },
        ownerLabel: "Responsable",
        stateLabels: {
          blocked_external: "Blocage externe",
          enabled: "Actif",
          owner_controlled: "Controle owner",
          planned: "Planifie",
          setup_required: "Setup requis",
        },
        statusLabel: "Statut",
        title: "Niveaux de fonctionnalites",
      },
      future: "Futur",
      futureSections: "Sections futures",
      futureSectionsDescription:
        "Les éléments de feuille de route restent visibles mais verrouillés avant validation.",
      futureSectionHints: {
        billing: "Stripe Payment Links en premier",
        integrations: "Webhooks reportés",
        teamMembers: "Propriétaire seulement pendant le pilote",
      },
      guardrails: "Garde-fous de préparation production",
      guardrailsDescription:
        "Ce qui reste vrai pendant que BizPilot grandit avec des niveaux de fonctionnalites controles.",
      guardrailItems: [
        "Ne pas activer par defaut les fonctions fournisseur, paiement ou automatisation.",
        "Ne pas impliquer envoi, booking, facture ou paiement reussi avant que BizPilot le fasse vraiment.",
        "Chaque nouvelle fonction exige guide visuel, guide texte, guide owner et etat dans Settings.",
        "Les blocages externes restent visibles jusqu'a la fin du setup API, compte, DNS, fournisseur ou paiement.",
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
          "Les demandes de suppression d'espace sont réservées au propriétaire.",
        description:
          "Contrôles de cycle de vie réservés au propriétaire. La suppression du compte de connexion est séparée.",
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
          "Vue traçable, côté propriétaire, des changements fondateur/admin qui ont touché cet espace.",
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
        "Le mode sombre reste le mode opérationnel par défaut. Le mode clair est disponible le jour.",
      workspace: "Espace",
      workspaceDescription:
        "Espace, compte, theme, langue, niveaux de fonctionnalites et setup controle par le proprietaire principal.",
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
    },
    workspaceAccess: {
      deletionRequestedBody:
        "Cet espace d'entreprise est verrouillé pendant la révision de la demande de suppression. Votre compte de connexion n'est pas supprimé automatiquement.",
      deletionRequestedTitle: "La suppression de l'espace a été demandée.",
      eyebrow: "Accès à l'espace",
      pausedBody:
        "Votre tableau de bord est bloqué, car aucune adhésion active à une entreprise n'est disponible. Vos données sont conservées; contactez le support BizPilot si cela semble inattendu.",
      pausedTitle: "Cet espace est suspendu ou indisponible.",
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
      "Cet état démo est seulement affiché dans l'interface. Il n'est pas enregistré comme vrai lead et disparaît dès que de vraies demandes arrivent.",
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
          "Bonjour Daniel, je fais un suivi sur votre demande de grand ménage. Si l'horaire convient toujours, le propriétaire peut revoir les détails et vous répondre avec la prochaine étape.",
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
          "Merci pour les détails du nettoyage de bureau. Le propriétaire révisera l'étendue et répondra manuellement avec la prochaine étape.",
        status: "Copié",
        tone: "emerald",
      },
    ],
    sampleStatuses: ["Infos manquantes", "Brouillon prêt", "Suivi dû", "Copié"],
    shareQuoteLink: "Partager le lien",
    suggestedNextAction:
      "Réviser le brouillon, le copier manuellement et l'envoyer par le canal client que le propriétaire utilise déjà.",
    suggestedNextActionLabel: "Prochaine action suggérée:",
  },
  intakeErrors: {
    consentRequired: "Le consentement est requis avant l'envoi.",
    fallbackSubmit:
      "Nous n'avons pas pu envoyer la demande de soumission. Veuillez vérifier le formulaire et réessayer.",
    fieldRequired: (label) => `${label} doit être rempli.`,
    formChanged:
      "Le formulaire de soumission a changé. Veuillez rafraîchir la page et réessayer.",
    linkUnavailable: "Ce lien de soumission n'est pas disponible.",
    nonNegativeNumber: (label) => `${label} ne peut pas être négatif.`,
    notPastDate: (label) => `${label} ne peut pas être dans le passé.`,
    rejected: "Soumission rejetée.",
    submittedTooFast:
      "Veuillez attendre un moment, puis envoyer la demande de soumission à nouveau.",
    validDate: (label) => `${label} doit être une date valide.`,
    validNumber: (label) => `${label} doit être un nombre valide.`,
  },
  leadRules: {
    actionAskInfo: "Demander les détails manquants",
    actionFollowUp: "Faire un suivi avec ce lead",
    actionReply: "Répondre à ce lead",
    actionReplyOverdue: "Répondre au lead en retard",
    archiveOrReviewArea: "Archiver ou vérifier le secteur desservi",
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
    readyForReply: "Prêt pour une réponse du propriétaire.",
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
      helpText: "Courriel ou téléphone pour le suivi du propriétaire.",
      label: "Coordonnées",
    },
    customer_email: {
      helpText: "Meilleur courriel pour le suivi du propriétaire.",
      label: "Adresse courriel",
    },
    customer_name: {
      helpText: "Nom de la personne qui demande la soumission.",
      label: "Nom du client",
    },
    customer_phone: {
      helpText: "Meilleur numéro de téléphone pour le suivi du propriétaire.",
      label: "Numéro de téléphone",
    },
    home_address: {
      helpText:
        "Adresse ou intersection majeure la plus proche pour la demande de nettoyage.",
      label: "Adresse du domicile",
    },
    notes: {
      helpText: "Contexte supplémentaire pour le propriétaire.",
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
      "BizPilot peut aider à préparer des brouillons IA internes plus tard, mais l'entreprise révise les messages avant de les envoyer.",
    consentNoticeDefault:
      "En envoyant cette demande, vous acceptez que vos renseignements soient partagés avec cette entreprise afin qu'elle réponde à votre demande de soumission. BizPilot peut aider à préparer des brouillons IA internes, mais l'entreprise révise les messages avant de les envoyer.",
    emptySection: "Rien à remplir dans cette section.",
    selectPlaceholder: "Sélectionner une option",
    stepProgress: (index, total, label) =>
      `Étape ${index} sur ${total} - ${label}`,
    steps: [
      {
        description:
          "Quelques détails rapides pour aider le propriétaire à préparer une réponse précise.",
        id: "service",
        label: "Service",
        title: "Quel type de nettoyage?",
      },
      {
        description:
          "Le moment et l'emplacement aident le propriétaire à vérifier la disponibilité et le déplacement.",
        id: "when_where",
        label: "Quand et où",
        title: "Quand et où?",
      },
      {
        description:
          "Ces détails sont transmis directement à l'entreprise. Rien n'est envoyé automatiquement.",
        id: "contact",
        label: "Contact",
        title: "Comment le propriétaire peut-il vous joindre?",
      },
    ],
    submitButton: "Envoyer la demande",
  },
  quotePage: {
    badge: "Soumission de nettoyage",
    description:
      "Un court formulaire de soumission. Le propriétaire révise chaque demande et répond directement - rien n'est envoyé automatiquement.",
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
      "L'entreprise révise chaque demande manuellement. Elle vous répondra directement avec la prochaine étape. Rien n'est réservé et aucun prix n'est confirmé pour l'instant.",
    footer: (businessName) =>
      `BizPilot AI aide ${businessName} à répondre plus vite. L'entreprise garde le contrôle de chaque message.`,
    nextTitle: "Prochaines étapes",
    requestSent: "Demande envoyée",
    steps: (businessName) => [
      `${businessName} révise votre demande et les détails manquants.`,
      "L'entreprise prépare une réponse révisée par le propriétaire - aucun message automatique.",
      "Vous recevrez une réponse par le moyen de contact soumis.",
    ],
    submitAnother: "Envoyer une autre demande",
    title: (businessName) =>
      `Merci - ${businessName} a reçu votre demande de soumission.`,
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

function defaultQuoteFieldCopies(fieldKey: string): QuoteFieldCopy[] {
  return Object.values(copyByLanguage)
    .map((copy) => copy.quoteFields[fieldKey])
    .filter((copy): copy is QuoteFieldCopy => Boolean(copy));
}

export function isDefaultQuoteFieldHelpText(input: {
  fieldKey: string;
  helpText: string;
}): boolean {
  return defaultQuoteFieldCopies(input.fieldKey).some(
    (field) => field.helpText === input.helpText,
  );
}

export function isDefaultQuoteFieldLabel(input: {
  fieldKey: string;
  label: string;
}): boolean {
  return defaultQuoteFieldCopies(input.fieldKey).some(
    (field) => field.label === input.label,
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

  if (!value || defaultConsentNotices.includes(value)) {
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
    " doit être rempli.",
    " doit être un nombre valide.",
    " ne peut pas être négatif.",
    " doit être une date valide.",
    " ne peut pas être dans le passé.",
  ];

  return suffixes.some((suffix) => message.endsWith(suffix));
}
