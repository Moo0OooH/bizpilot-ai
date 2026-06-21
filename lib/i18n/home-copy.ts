/**
 * ============================================================
 * File: lib/i18n/home-copy.ts
 * Project: BizPilot AI
 * Description: Central copy dictionary for the public marketing homepage.
 * Role: Keeps the current homepage design language-linked across supported languages.
 * Related:
 * - app/page.tsx
 * - components/public/marketing-ui.tsx
 * - lib/i18n/language.ts
 * Author: MoOoH
 * Created: 2026-05-23
 * Last Updated: 2026-06-21
 * Change Log:
 * - 2026-06-19: Shortened public header tagline and corrected compact French pilot CTA.
 * - 2026-06-21: Corrected compact CTA text and fr-CA accent defects visible in public shell/homepage copy.
 * ============================================================
 */

import {
  DEFAULT_LANGUAGE,
  readSupportedLanguage,
  type SupportedLanguage,
} from "./language.ts";

export type HomeLeadTone = "new" | "info" | "draft" | "replied" | "risk";

type HomeLeadCopy = Readonly<{
  customer: string;
  detail: string;
  source: string;
  status: string;
  time: string;
  tone: HomeLeadTone;
}>;

type HomeMetricCopy = Readonly<{
  label: string;
  note: string;
  value: string;
}>;

type HomeTextPair = Readonly<{
  body: string;
  title: string;
}>;

type HomeDetailPair = Readonly<{
  label: string;
  value: string;
}>;

export type HomeNavCopy = Readonly<{
  brandSubtitle: string;
  cleaning: string;
  comparison: string;
  copyright: string;
  demo: string;
  faq: string;
  features: string;
  flow: string;
  languageLabel: string;
  pilot: string;
  pricing: string;
  privacy: string;
  security: string;
  signIn: string;
  startFull: string;
  startShort: string;
  terms: string;
  trust: string;
  why: string;
}>;

export type HomeCopy = Readonly<{
  beforeAfter: Readonly<{
    afterItems: ReadonlyArray<Readonly<{ action: string; detail: string }>>;
    afterLabel: string;
    afterTitle: string;
    beforeItems: readonly string[];
    beforeLabel: string;
    beforeTitle: string;
    recoveredDetailHeader: string;
    serviceActionHeader: string;
  }>;
  commandCenter: Readonly<{
    body: string;
    eyebrow: string;
    mock: Readonly<{
      actions: ReadonlyArray<HomeTextPair>;
      aiDraftStatus: string;
      deskSubtitle: string;
      deskTitle: string;
      draft: string;
      draftLabel: string;
      leadCount: string;
      leadQueueTitle: string;
      ownerReviewStatus: string;
      queue: ReadonlyArray<HomeLeadCopy>;
      summary: string;
      summaryLabel: string;
      tags: readonly string[];
    }>;
    title: string;
  }>;
  finalCta: Readonly<{
    assurances: readonly string[];
    body: string;
    primaryCta: string;
    secondaryCta: string;
    title: string;
  }>;
  hero: Readonly<{
    badge: string;
    body: string;
    bullets: readonly string[];
    primaryCta: string;
    secondaryCta: string;
    title: string;
  }>;
  heroDesk: Readonly<{
    aiDraft: string;
    copyResponse: string;
    fromLabel: string;
    journey: ReadonlyArray<HomeDetailPair>;
    leads: ReadonlyArray<HomeLeadCopy>;
    markContacted: string;
    reply: Readonly<{
      closing: string;
      greeting: string;
      intro: string;
      questions: readonly string[];
      requestLine: string;
      signature: readonly string[];
    }>;
    replyTitle: string;
    reviewReply: string;
    title: string;
    viewAll: string;
  }>;
  painStory: Readonly<{
    body: string;
    closing: string;
    eyebrow: string;
    items: readonly string[];
    title: string;
  }>;
  metrics: Readonly<{
    eyebrow: string;
    items: ReadonlyArray<HomeMetricCopy>;
  }>;
  nav: HomeNavCopy;
  problem: Readonly<{
    body: string;
    eyebrow: string;
    items: ReadonlyArray<HomeTextPair>;
    titleHighlight: string;
    titlePrefix: string;
  }>;
  recoveryFlow: Readonly<{
    badge: string;
    steps: ReadonlyArray<Readonly<{ body: string; kicker: string; title: string }>>;
    title: string;
  }>;
  trust: Readonly<{
    eyebrow: string;
    items: ReadonlyArray<HomeTextPair>;
    title: string;
  }>;
  workflowDemo: Readonly<{
    body: string;
    eyebrow: string;
    outcome: string;
    safety: string;
    steps: ReadonlyArray<
      Readonly<{
        body: string;
        kicker: string;
        rows: ReadonlyArray<HomeDetailPair>;
        system: ReadonlyArray<Readonly<{ label: string; tone: HomeLeadTone; value: string }>>;
        title: string;
      }>
    >;
    title: string;
  }>;
}>;

export const HOME_COPY_SOURCE_LANGUAGE = DEFAULT_LANGUAGE;

export const homeCopyNamespaces = [
  "nav",
  "hero",
  "heroDesk",
  "metrics",
  "painStory",
  "problem",
  "recoveryFlow",
  "workflowDemo",
  "commandCenter",
  "beforeAfter",
  "trust",
  "finalCta",
] as const satisfies readonly (keyof HomeCopy)[];

const englishHomeCopy: HomeCopy = {
  beforeAfter: {
    afterItems: [
      { action: "House cleaning request organized", detail: "Service type" },
      { action: "Ask before estimating time and crew", detail: "Home size" },
      {
        action: "Match one-time, weekly, or biweekly cleaning",
        detail: "Frequency",
      },
      { action: "Confirm parking, pets, and entry notes", detail: "Access" },
      { action: "Keep the next manual touch visible", detail: "Follow-up" },
    ],
    afterLabel: "After",
    afterTitle: "BizPilot turns it into a next action.",
    beforeItems: [
      "DM: how much?",
      "No home size",
      "No service timing",
      "No access details",
      "No follow-up state",
    ],
    beforeLabel: "Before",
    beforeTitle: "A warm lead arrives messy.",
    recoveredDetailHeader: "Recovered detail",
    serviceActionHeader: "Service action",
  },
  commandCenter: {
    body:
      "One simple view for the lead, the missing details, the owner-reviewed draft, and the next manual action.",
    eyebrow: "Command center",
    mock: {
      actions: [
        {
          body: "Owner checks the draft first.",
          title: "Review reply",
        },
        {
          body: "Send through the real channel.",
          title: "Copy response",
        },
        {
          body: "Keep the follow-up state clean.",
          title: "Mark contacted",
        },
      ],
      aiDraftStatus: "AI draft",
      deskSubtitle: "Sarah M. - House cleaning",
      deskTitle: "AI response desk",
      draft:
        "Hi Sarah, thanks for reaching out. Could you share your home size, preferred frequency, and any priority areas so I can prepare an accurate cleaning quote?",
      draftLabel: "Draft reply",
      leadCount: "12 leads",
      leadQueueTitle: "Lead queue",
      ownerReviewStatus: "Owner review",
      queue: [
        {
          customer: "Sarah M.",
          detail: "New request - 2m ago",
          source: "Instagram",
          status: "New",
          time: "",
          tone: "new",
        },
        {
          customer: "David L.",
          detail: "Missing info - 21m ago",
          source: "Web form",
          status: "Info needed",
          time: "",
          tone: "info",
        },
        {
          customer: "Emily R.",
          detail: "Draft ready - 42m ago",
          source: "Google",
          status: "Draft ready",
          time: "",
          tone: "draft",
        },
        {
          customer: "Michelle T.",
          detail: "Replied - 1h ago",
          source: "Facebook",
          status: "Replied",
          time: "",
          tone: "replied",
        },
        {
          customer: "Jason P.",
          detail: "At risk - 2h ago",
          source: "Website",
          status: "At risk",
          time: "",
          tone: "risk",
        },
      ],
      summary:
        "2 bed / 1 bath house. Looking for regular cleaning. Dog at home. Needs a quote before the weekend.",
      summaryLabel: "Summary",
      tags: ["Home size", "Frequency", "Priority areas", "Parking"],
    },
    title: "Quote Recovery Desk",
  },
  finalCta: {
    assurances: [
      "Limited founder pilot",
      "Manual onboarding",
      "No auto-send",
    ],
    body:
      "Start with one clean quote workflow: capture the request, recover missing details, review the draft, and send before the lead goes cold.",
    primaryCta: "Join founder pilot",
    secondaryCta: "See pricing",
    title: "Make the next missed quote request much harder to lose.",
  },
  hero: {
    badge: "For cleaning teams losing leads to delayed replies",
    body:
      "Every delayed quote reply is a customer already comparing you to another cleaner. BizPilot organizes the request, highlights what is missing, and drafts the reply for you to review and send.",
    bullets: [
      "See the customer request, source, urgency, and missing info",
      "Review an AI-drafted reply before anything is sent",
      "No auto-send, no fake pricing, no takeover",
    ],
    primaryCta: "Apply for founder pilot",
    secondaryCta: "See the quote recovery workflow",
    title: "Stop losing cleaning jobs one delayed reply at a time.",
  },
  heroDesk: {
    aiDraft: "AI draft",
    copyResponse: "Copy response",
    fromLabel: "From",
    journey: [
      { label: "Request", value: "Move-out quote" },
      { label: "Organized", value: "Source + deadline" },
      { label: "Missing", value: "Square footage" },
      { label: "Drafted", value: "Owner review" },
      { label: "Sent", value: "Manual copy" },
      { label: "Saved", value: "Lead stays warm" },
    ],
    leads: [
      {
        customer: "Sarah M.",
        detail: "House cleaning - 2 bed / 1 bath",
        source: "Instagram",
        status: "New",
        time: "2m ago",
        tone: "new",
      },
      {
        customer: "David L.",
        detail: "Deep clean - Apartment",
        source: "Web form",
        status: "Info needed",
        time: "21m ago",
        tone: "info",
      },
      {
        customer: "Emily R.",
        detail: "Move-out clean",
        source: "Google Business",
        status: "Draft ready",
        time: "42m ago",
        tone: "draft",
      },
      {
        customer: "Michelle T.",
        detail: "Office cleaning - Weekly",
        source: "Facebook",
        status: "Replied",
        time: "1h ago",
        tone: "replied",
      },
    ],
    markContacted: "Mark contacted",
    reply: {
      closing:
        "Once I have those details, I can send a tailored quote.",
      greeting: "Hi Sarah,",
      intro:
        "Thanks for reaching out. I would be happy to help with your house cleaning.",
      questions: [
        "Approx. home size?",
        "Preferred cleaning frequency?",
        "Any priority areas?",
      ],
      requestLine: "To prepare an accurate quote, could you share:",
      signature: ["Best regards,", "Clean Team"],
    },
    replyTitle: "Suggested reply",
    reviewReply: "Review reply",
    title: "Live Recovery Desk",
    viewAll: "View all leads",
  },
  metrics: {
    eyebrow: "Recovery snapshot",
    items: [
      {
        label: "Quote requests organized",
        note: "From your quote workflow",
        value: "12",
      },
      {
        label: "Replies drafted",
        note: "Ready for your review",
        value: "8",
      },
      {
        label: "Leads at risk",
        note: "Need your follow-up",
        value: "3",
      },
      {
        label: "Auto-send messages",
        note: "You are in control",
        value: "0",
      },
    ],
  },
  painStory: {
    body:
      "Most lost jobs do not feel lost in the moment. They look like a normal busy day until the customer has already booked another cleaner.",
    closing:
      "BizPilot keeps that request visible while there is still time to reply.",
    eyebrow: "What losing a lead actually looks like",
    items: [
      "You finish a cleaning job.",
      "You check Instagram three hours later.",
      "A customer asked for a quote.",
      "The request is missing square footage and access details.",
      "They already messaged another company.",
    ],
    title: "The lead was warm. The reply was late.",
  },
  nav: {
    brandSubtitle: "Lead recovery for cleaning businesses",
    cleaning: "Cleaning",
    comparison: "Comparison",
    copyright: "Copyright 2026 BizPilot AI. All rights reserved.",
    demo: "Demo",
    faq: "FAQ",
    features: "Features",
    flow: "How it works",
    languageLabel: "Homepage language",
    pilot: "Pilot",
    pricing: "Pricing",
    privacy: "Privacy",
    security: "Security",
    signIn: "Sign in",
    startFull: "Join founder pilot",
    startShort: "Join pilot",
    terms: "Terms",
    trust: "Trust",
    why: "Why BizPilot",
  },
  problem: {
    body:
      "Cleaning leads usually do not disappear at one dramatic moment. They leak through small gaps: delay, scattered channels, missing details, and forgotten follow-up.",
    eyebrow: "The leak map",
    items: [
      {
        body: "A quote request comes in. A competitor replies first.",
        title: "Slow reply",
      },
      {
        body: "Instagram, Google, text, and email stay scattered.",
        title: "Inbox chaos",
      },
      {
        body: "No size, date, access, or priority details.",
        title: "Missing info",
      },
      {
        body: "The customer moves on and nobody notices.",
        title: "Quiet loss",
      },
    ],
    titleHighlight: "response chaos.",
    titlePrefix: "The problem is not demand. It is",
  },
  recoveryFlow: {
    badge: "Recovery loop",
    steps: [
      {
        body:
          "One clean intake path from website, Instagram, Google, email, or saved replies.",
        kicker: "Capture",
        title: "Quote link",
      },
      {
        body:
          "Every request lands with source, status, missing details, and urgency.",
        kicker: "Organize",
        title: "Recovery queue",
      },
      {
        body:
          "The assistant drafts the reply while the owner keeps final approval.",
        kicker: "Draft",
        title: "Approved reply",
      },
      {
        body:
          "Quiet leads stay visible so the next manual touch is obvious.",
        kicker: "Recover",
        title: "Follow-up radar",
      },
    ],
    title: "One operational loop, built to keep warm leads moving.",
  },
  workflowDemo: {
    body:
      "Use the tabs to follow one realistic quote request from messy customer question to flagged lead, owner alert, reviewed response, and follow-up. Every handoff stays visible and nothing is sent automatically.",
    eyebrow: "Tabbed live demo",
    outcome: "Owner-reviewed reply ready without guessing.",
    safety: "Privacy, consent, and manual send stay visible in the flow.",
    steps: [
      {
        body:
          "A customer asks a vague pricing question. BizPilot captures the channel, keeps the original request intact, and turns it into a structured lead instead of letting it sit in an inbox.",
        kicker: "1 / Customer question",
        rows: [
          { label: "Customer asks", value: "How much for a move-out clean?" },
          { label: "Source", value: "Instagram DM" },
          { label: "System state", value: "New lead created" },
        ],
        system: [
          { label: "Capture", tone: "new", value: "Original text and source are preserved for owner review." },
          { label: "Privacy", tone: "draft", value: "Only quote workflow fields are organized; no hidden external send happens." },
          { label: "Next step", tone: "info", value: "Lead is ready for missing-info analysis." },
        ],
        title: "The messy request becomes a lead record.",
      },
      {
        body:
          "The system flags the request before the owner quotes too early. Missing square footage, access details, preferred date, and urgency are surfaced as operational flags.",
        kicker: "2 / Flags",
        rows: [
          { label: "Missing", value: "Square footage" },
          { label: "Missing", value: "Parking and access" },
          { label: "Risk", value: "Quote would be premature" },
        ],
        system: [
          { label: "Flag", tone: "risk", value: "Needs info before price estimate." },
          { label: "Priority", tone: "info", value: "Move-out timing makes the lead time-sensitive." },
          { label: "Owner view", tone: "draft", value: "The queue shows why this lead needs review." },
        ],
        title: "The owner sees what is missing and why it matters.",
      },
      {
        body:
          "BizPilot drafts a response that asks only for the missing details needed to qualify the job. The owner sees the draft, edits if needed, then copies and sends through the real channel.",
        kicker: "3 / Owner response",
        rows: [
          { label: "Draft asks", value: "Size, date, access" },
          { label: "Control", value: "Owner approves" },
          { label: "Send mode", value: "Manual copy/send" },
        ],
        system: [
          { label: "AI scope", tone: "draft", value: "Drafting support only; no autonomous customer message." },
          { label: "Safety", tone: "new", value: "No fake price is generated without required context." },
          { label: "Seller action", tone: "info", value: "Copy reply, send in Instagram, mark contacted." },
        ],
        title: "The seller gets a useful draft, not an auto-send.",
      },
      {
        body:
          "After the owner replies, the lead stays in a clean follow-up state. If the customer does not answer, BizPilot keeps the next manual touch visible so the warm lead does not disappear.",
        kicker: "4 / Follow-up",
        rows: [
          { label: "Status", value: "Waiting for customer" },
          { label: "Follow-up", value: "Tomorrow" },
          { label: "Outcome", value: "Lead stays warm" },
        ],
        system: [
          { label: "Follow-up", tone: "new", value: "Next manual touch is visible in the queue." },
          { label: "Audit", tone: "draft", value: "Owner action stays separate from AI draft state." },
          { label: "Boundary", tone: "risk", value: "No booking, invoice, SMS, WhatsApp, or calendar automation is implied." },
        ],
        title: "The warm lead stays visible after the first reply.",
      },
    ],
    title: "Watch the full quote recovery process, tab by tab.",
  },
  trust: {
    eyebrow: "Pilot terms",
    items: [
      {
        body: "We set everything up for you.",
        title: "Founder-led setup",
      },
      {
        body: "Try it. See value. Decide.",
        title: "Founder pilot",
      },
      {
        body: "One focus. One outcome.",
        title: "Cleaning-first setup",
      },
      {
        body: "You review, copy, and send.",
        title: "AI owner control",
      },
      {
        body: "You stay in control.",
        title: "No auto-send. No automation.",
      },
    ],
    title: "Built to prove value before expanding scope.",
  },
};

const frenchHomeCopy: HomeCopy = {
  beforeAfter: {
    afterItems: [
      {
        action: "Demande de nettoyage résidentiel organisée",
        detail: "Type de service",
      },
      {
        action: "Demander avant d'estimer le temps et l'équipe",
        detail: "Taille du logement",
      },
      {
        action: "Faire correspondre une fois, hebdo ou aux deux semaines",
        detail: "Fréquence",
      },
      {
        action: "Confirmer stationnement, animaux et accès",
        detail: "Accès",
      },
      {
        action: "Garder le prochain suivi manuel visible",
        detail: "Suivi",
      },
    ],
    afterLabel: "Après",
    afterTitle: "BizPilot le transforme en prochaine action.",
    beforeItems: [
      "DM: combien?",
      "Aucune taille de logement",
      "Aucun moment de service",
      "Aucun détail d'accès",
      "Aucun état de suivi",
    ],
    beforeLabel: "Avant",
    beforeTitle: "Un lead chaud arrive en désordre.",
    recoveredDetailHeader: "Détail récupéré",
    serviceActionHeader: "Action de service",
  },
  commandCenter: {
    body:
      "Un poste de pilotage pour le lead, les détails manquants, le brouillon révisé par le propriétaire et la prochaine action manuelle.",
    eyebrow: "Centre de commande",
    mock: {
      actions: [
        {
          body: "Le propriétaire vérifie le brouillon d'abord.",
          title: "Réviser la réponse",
        },
        {
          body: "Envoyer par le vrai canal client.",
          title: "Copier la réponse",
        },
        {
          body: "Garder l'état de suivi propre.",
          title: "Marquer contacté",
        },
      ],
      aiDraftStatus: "Brouillon IA",
      deskSubtitle: "Sarah M. - Nettoyage maison",
      deskTitle: "Bureau de réponse IA",
      draft:
        "Bonjour Sarah, merci pour votre demande. Pouvez-vous partager la taille du logement, la fréquence souhaitée et les zones prioritaires afin que je prépare une soumission précise?",
      draftLabel: "Brouillon de réponse",
      leadCount: "12 leads",
      leadQueueTitle: "File de leads",
      ownerReviewStatus: "Révision propriétaire",
      queue: [
        {
          customer: "Sarah M.",
          detail: "Nouvelle demande - 2 min",
          source: "Instagram",
          status: "Nouveau",
          time: "",
          tone: "new",
        },
        {
          customer: "David L.",
          detail: "Infos manquantes - 21 min",
          source: "Formulaire web",
          status: "Infos requises",
          time: "",
          tone: "info",
        },
        {
          customer: "Emily R.",
          detail: "Brouillon prêt - 42 min",
          source: "Google",
          status: "Brouillon prêt",
          time: "",
          tone: "draft",
        },
        {
          customer: "Michelle T.",
          detail: "Répondu - 1 h",
          source: "Facebook",
          status: "Répondu",
          time: "",
          tone: "replied",
        },
        {
          customer: "Jason P.",
          detail: "À risque - 2 h",
          source: "Site web",
          status: "À risque",
          time: "",
          tone: "risk",
        },
      ],
      summary:
        "Maison 2 chambres / 1 salle de bain. Cherche un nettoyage régulier. Chien à la maison. Besoin d'une soumission avant la fin de semaine.",
      summaryLabel: "Résumé",
      tags: [
        "Taille du logement",
        "Fréquence",
        "Zones prioritaires",
        "Stationnement",
      ],
    },
    title: "Bureau de récupération des soumissions",
  },
  finalCta: {
    assurances: [
      "Aucune carte requise",
      "Pilote sans risque de 14 jours",
      "Annulez quand vous voulez",
    ],
    body:
      "Captez les demandes, demandez les détails manquants, répondez plus vite et ne perdez plus un lead dans le silence.",
    primaryCta: "Rejoindre le pilote fondateur",
    secondaryCta: "Voir les prix",
    title:
      "Transformez plus de demandes de soumission en vraies conversations.",
  },
  hero: {
    badge: "Pour les équipes de nettoyage",
    body:
      "BizPilot capte les demandes de soumission, organise chaque lead et prépare des réponses et suivis révisés par le propriétaire afin que les entreprises de nettoyage répondent plus vite sans envoi automatique.",
    bullets: [
      "Fonctionne avec les demandes venant de plusieurs canaux",
      "Les brouillons IA restent sous votre contrôle",
      "Aucun envoi automatique, aucun prix inventé",
    ],
    primaryCta: "Postuler au pilote fondateur",
    secondaryCta: "Voir le fonctionnement",
    title:
      "Arrêtez de perdre des mandats de nettoyage à cause des réponses lentes.",
  },
  heroDesk: {
    aiDraft: "Brouillon IA",
    copyResponse: "Copier la réponse",
    fromLabel: "Source",
    journey: [
      { label: "Demande", value: "Soumission départ" },
      { label: "Organisée", value: "Source + délai" },
      { label: "Manquant", value: "Pieds carrés" },
      { label: "Brouillon", value: "Révision" },
      { label: "Envoyée", value: "Copie manuelle" },
      { label: "Sauvée", value: "Lead gardé chaud" },
    ],
    leads: [
      {
        customer: "Sarah M.",
        detail: "Nettoyage maison - 2 ch. / 1 sdb",
        source: "Instagram",
        status: "Nouveau",
        time: "2 min",
        tone: "new",
      },
      {
        customer: "David L.",
        detail: "Grand ménage - Appartement",
        source: "Formulaire web",
        status: "Infos requises",
        time: "21 min",
        tone: "info",
      },
      {
        customer: "Emily R.",
        detail: "Nettoyage de départ",
        source: "Google Business",
        status: "Brouillon prêt",
        time: "42 min",
        tone: "draft",
      },
      {
        customer: "Michelle T.",
        detail: "Nettoyage bureau - Hebdo",
        source: "Facebook",
        status: "Répondu",
        time: "1 h",
        tone: "replied",
      },
    ],
    markContacted: "Marquer contacté",
    reply: {
      closing:
        "Avec ces détails, je pourrai envoyer une soumission adaptée.",
      greeting: "Bonjour Sarah,",
      intro:
        "Merci pour votre demande. Je serais heureux de vous aider pour le nettoyage de votre maison.",
      questions: [
        "Taille approximative du logement?",
        "Fréquence de nettoyage souhaitée?",
        "Zones prioritaires?",
      ],
      requestLine:
        "Pour préparer une soumission précise, pouvez-vous partager:",
      signature: ["Cordialement,", "Clean Team"],
    },
    replyTitle: "Réponse suggérée",
    reviewReply: "Réviser la réponse",
    title: "Bureau de récupération en direct",
    viewAll: "Voir tous les leads",
  },
  metrics: {
    eyebrow: "Instantané récupération",
    items: [
      {
        label: "Demandes organisées",
        note: "Depuis tous vos canaux",
        value: "12",
      },
      {
        label: "Réponses préparées",
        note: "Prêtes pour votre révision",
        value: "8",
      },
      {
        label: "Leads à risque",
        note: "Besoin de votre suivi",
        value: "3",
      },
      {
        label: "Messages auto-envoyés",
        note: "Vous gardez le contrôle",
        value: "0",
      },
    ],
  },
  painStory: {
    body:
      "Les mandats perdus ne semblent pas toujours perdus sur le moment. Ils ressemblent à une journée chargée, jusqu'à ce que le client ait déjà choisi une autre entreprise.",
    closing:
      "BizPilot garde la demande visible pendant qu'il reste encore le temps de répondre.",
    eyebrow: "À quoi ressemble vraiment un lead perdu",
    items: [
      "Vous terminez un nettoyage.",
      "Vous regardez Instagram trois heures plus tard.",
      "Un client a demandé une soumission.",
      "Il manque les pieds carrés et les détails d'accès.",
      "Il a déjà écrit à une autre entreprise.",
    ],
    title: "Le lead était chaud. La réponse était tardive.",
  },
  nav: {
    brandSubtitle: "Leads pour le nettoyage",
    cleaning: "Nettoyage",
    comparison: "Comparaison",
    copyright: "Copyright 2026 BizPilot AI. Tous droits réservés.",
    demo: "Démo",
    faq: "FAQ",
    features: "Fonctions",
    flow: "Fonctionnement",
    languageLabel: "Langue de la page d'accueil",
    pilot: "Pilote",
    pricing: "Prix",
    privacy: "Confidentialité",
    security: "Sécurité",
    signIn: "Connexion",
    startFull: "Rejoindre le pilote",
    startShort: "Pilote",
    terms: "Conditions",
    trust: "Confiance",
    why: "Pourquoi BizPilot",
  },
  problem: {
    body:
      "Les leads de nettoyage ne disparaissent pas toujours d'un coup. Ils fuient par de petites brèches: délai, canaux éparpillés, détails manquants et suivis oubliés.",
    eyebrow: "Carte des fuites",
    items: [
      {
        body: "Une demande arrive. Un concurrent répond en premier.",
        title: "Réponse lente",
      },
      {
        body: "Instagram, Google, texto et courriel restent dispersés.",
        title: "Boîtes éparpillées",
      },
      {
        body: "Pas de taille, date, accès ou détails prioritaires.",
        title: "Infos manquantes",
      },
      {
        body: "Le client passe à autre chose sans que personne le voie.",
        title: "Perte silencieuse",
      },
    ],
    titleHighlight: "chaos de réponse.",
    titlePrefix: "Le problème n'est pas la demande. C'est le",
  },
  recoveryFlow: {
    badge: "Boucle de récupération",
    steps: [
      {
        body:
          "Un chemin clair depuis le site web, Instagram, Google, courriel ou réponses enregistrées.",
        kicker: "Capter",
        title: "Lien de soumission",
      },
      {
        body:
          "Chaque demande arrive avec source, statut, détails manquants et urgence.",
        kicker: "Organiser",
        title: "File de récupération",
      },
      {
        body:
          "L'assistant prépare la réponse pendant que le propriétaire garde l'approbation finale.",
        kicker: "Rédiger",
        title: "Réponse approuvée",
      },
      {
        body:
          "Les leads silencieux restent visibles pour rendre le prochain suivi évident.",
        kicker: "Récupérer",
        title: "Radar de suivi",
      },
    ],
    title:
      "Une boucle opérationnelle pour garder les leads chauds en mouvement.",
  },
  workflowDemo: {
    body:
      "Suivez une demande réaliste, de la question client au lead signalé, à l'avis au propriétaire, à la réponse révisée et au suivi. Rien n'est envoyé automatiquement.",
    eyebrow: "Démo par onglets",
    outcome: "Réponse prête à réviser sans deviner.",
    safety: "Confidentialité, consentement et envoi manuel restent visibles.",
    steps: [
      {
        body:
          "Un client pose une question vague sur le prix. BizPilot garde la demande originale, capte le canal et crée un lead structuré au lieu de le laisser dans une boîte de réception.",
        kicker: "1 / Question client",
        rows: [
          { label: "Question", value: "Combien pour un départ?" },
          { label: "Source", value: "DM Instagram" },
          { label: "État", value: "Nouveau lead créé" },
        ],
        system: [
          { label: "Capture", tone: "new", value: "Le texte original et la source restent visibles." },
          { label: "Confidentialité", tone: "draft", value: "Seulement les champs de soumission sont organisés." },
          { label: "Prochaine étape", tone: "info", value: "Analyse des infos manquantes." },
        ],
        title: "La demande vague devient un lead.",
      },
      {
        body:
          "Le système signale ce qui manque avant que le propriétaire donne un prix trop tôt: pieds carrés, accès, date souhaitée et urgence.",
        kicker: "2 / Signaux",
        rows: [
          { label: "Manquant", value: "Pieds carrés" },
          { label: "Manquant", value: "Stationnement/accès" },
          { label: "Risque", value: "Prix prématuré" },
        ],
        system: [
          { label: "Signal", tone: "risk", value: "Infos requises avant estimation." },
          { label: "Priorité", tone: "info", value: "Le départ rend le lead sensible au temps." },
          { label: "Vue vendeur", tone: "draft", value: "La file explique pourquoi réviser." },
        ],
        title: "Le propriétaire voit ce qui manque.",
      },
      {
        body:
          "BizPilot prépare une réponse qui demande les bons détails. Le propriétaire révise, ajuste au besoin, puis copie et envoie dans le vrai canal.",
        kicker: "3 / Réponse",
        rows: [
          { label: "Demande", value: "Taille, date, accès" },
          { label: "Contrôle", value: "Révision propriétaire" },
          { label: "Envoi", value: "Copie manuelle" },
        ],
        system: [
          { label: "Scope IA", tone: "draft", value: "Aide à la rédaction seulement." },
          { label: "Sécurité", tone: "new", value: "Aucun prix inventé sans contexte." },
          { label: "Action vendeur", tone: "info", value: "Copier, envoyer, marquer contacté." },
        ],
        title: "Le vendeur obtient un brouillon utile.",
      },
      {
        body:
          "Après la réponse, le lead garde un état clair. Si le client ne répond pas, le prochain suivi manuel reste visible.",
        kicker: "4 / Suivi",
        rows: [
          { label: "Statut", value: "En attente client" },
          { label: "Suivi", value: "Demain" },
          { label: "Résultat", value: "Lead gardé chaud" },
        ],
        system: [
          { label: "Suivi", tone: "new", value: "La prochaine touche manuelle reste visible." },
          { label: "Audit", tone: "draft", value: "Action propriétaire séparée du brouillon IA." },
          { label: "Limite", tone: "risk", value: "Pas de réservation, facture, SMS, WhatsApp ou calendrier." },
        ],
        title: "Le lead chaud reste visible.",
      },
    ],
    title: "Voyez tout le processus de récupération, onglet par onglet.",
  },
  trust: {
    eyebrow: "Conditions pilote",
    items: [
      {
        body: "Nous configurons tout pour vous.",
        title: "Configuration accompagnée",
      },
      {
        body: "Essayez. Voyez la valeur. Décidez.",
        title: "Pilote sans risque de 14 jours",
      },
      {
        body: "Un focus. Un résultat.",
        title: "Nettoyage d'abord",
      },
      {
        body: "Vous révisez, copiez et envoyez.",
        title: "Contrôle IA propriétaire",
      },
      {
        body: "Vous gardez le contrôle.",
        title: "Aucun envoi auto. Aucune automation.",
      },
    ],
    title:
      "Construit pour prouver la valeur avant d'élargir le scope.",
  },
};

const homeCopyByLanguage: Record<SupportedLanguage, HomeCopy> = {
  en: englishHomeCopy,
  "fr-CA": frenchHomeCopy,
};

export function getHomeCopy(language: unknown): HomeCopy {
  return homeCopyByLanguage[readSupportedLanguage(language)];
}
