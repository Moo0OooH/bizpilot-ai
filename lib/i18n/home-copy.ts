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

export type HomeNavCopy = Readonly<{
  brandSubtitle: string;
  comparison: string;
  copyright: string;
  faq: string;
  flow: string;
  languageLabel: string;
  pricing: string;
  signIn: string;
  startFull: string;
  startShort: string;
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
}>;

export const HOME_COPY_SOURCE_LANGUAGE = DEFAULT_LANGUAGE;

export const homeCopyNamespaces = [
  "nav",
  "hero",
  "heroDesk",
  "metrics",
  "problem",
  "recoveryFlow",
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
      "One cockpit for the lead, the missing details, the owner-reviewed draft, and the next manual action.",
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
      "No credit card required",
      "14-day no-risk pilot",
      "Cancel anytime",
    ],
    body:
      "Capture requests, ask for missing details, respond faster, and never lose a lead to silence again.",
    primaryCta: "Start free recovery",
    secondaryCta: "See pricing",
    title: "Turn more cleaning quote requests into real conversations.",
  },
  hero: {
    badge: "For cleaning teams",
    body:
      "BizPilot captures quote requests, organizes every lead, and drafts owner-reviewed replies and follow-ups so cleaning businesses can respond faster without auto-sending anything.",
    bullets: [
      "Works with quote requests from multiple channels",
      "AI drafts stay in your control",
      "No auto-send, no fake pricing",
    ],
    primaryCta: "Start free recovery",
    secondaryCta: "See how it works",
    title: "Stop losing cleaning jobs to slow replies.",
  },
  heroDesk: {
    aiDraft: "AI draft",
    copyResponse: "Copy response",
    fromLabel: "From",
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
        note: "From all your channels",
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
  nav: {
    brandSubtitle: "Quote Recovery Command Center",
    comparison: "Comparison",
    copyright: "Copyright 2026 BizPilot AI. All rights reserved.",
    faq: "FAQ",
    flow: "How it works",
    languageLabel: "Homepage language",
    pricing: "Pricing",
    signIn: "Sign in",
    startFull: "Start free recovery",
    startShort: "Start",
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
  trust: {
    eyebrow: "Pilot terms",
    items: [
      {
        body: "We set everything up for you.",
        title: "Founder-led setup",
      },
      {
        body: "Try it. See value. Decide.",
        title: "14-day no-risk pilot",
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
    primaryCta: "Démarrer la récupération",
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
      "Aucun envoi automatique, aucun prix invente",
    ],
    primaryCta: "Démarrer la récupération",
    secondaryCta: "Voir le fonctionnement",
    title:
      "Arrêtez de perdre des mandats de nettoyage à cause des réponses lentes.",
  },
  heroDesk: {
    aiDraft: "Brouillon IA",
    copyResponse: "Copier la réponse",
    fromLabel: "Source",
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
        label: "Messages auto-envoyes",
        note: "Vous gardez le contrôle",
        value: "0",
      },
    ],
  },
  nav: {
    brandSubtitle: "Centre de récupération des soumissions",
    comparison: "Comparaison",
    copyright: "Copyright 2026 BizPilot AI. Tous droits réservés.",
    faq: "FAQ",
    flow: "Fonctionnement",
    languageLabel: "Langue de la page d'accueil",
    pricing: "Prix",
    signIn: "Connexion",
    startFull: "Démarrer la récupération",
    startShort: "Démarrer",
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
        body: "Instagram, Google, texto et courriel restent disperses.",
        title: "Boîtes éparpillées",
      },
      {
        body: "Pas de taille, date, accès ou détails prioritaires.",
        title: "Infos manquantes",
      },
      {
        body: "Le client passe a autre chose sans que personne le voie.",
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
