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
 * ============================================================
 */

import {
  DEFAULT_LANGUAGE,
  readSupportedLanguage,
  type SupportedLanguage,
} from "./language.ts";

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
  sampleStatuses: readonly string[];
  shareQuoteLink: string;
  suggestedNextAction: string;
  suggestedNextActionLabel: string;
}>;

type QuoteFieldCopy = Readonly<{
  helpText?: string;
  label: string;
}>;

export type BizPilotCopy = Readonly<{
  aiFallback: AiFallbackCopy;
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
