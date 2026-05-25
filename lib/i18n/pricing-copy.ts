/**
 * ============================================================
 * File: lib/i18n/pricing-copy.ts
 * Project: BizPilot AI
 * Description: Central copy dictionary for the public pricing and FAQ page.
 * Role: Keeps pricing offers and FAQs language-linked across supported languages.
 * Related:
 * - app/pricing/page.tsx
 * - lib/i18n/home-copy.ts
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

export type PricingPlanCopy = Readonly<{
  cta: string;
  description: string;
  features: readonly string[];
  monthly: string;
  name: string;
  recommended?: boolean;
  setup: string;
}>;

type PricingTextPair = Readonly<{
  body: string;
  title: string;
}>;

export type PricingCopy = Readonly<{
  cta: Readonly<{
    badge: string;
    body: string;
    button: string;
    title: string;
  }>;
  faq: Readonly<{
    eyebrow: string;
    items: ReadonlyArray<Readonly<{ answer: string; question: string }>>;
    title: string;
  }>;
  guardrails: Readonly<{
    eyebrow: string;
    items: readonly string[];
    title: string;
  }>;
  hero: Readonly<{
    badge: string;
    body: string;
    primaryCta: string;
    promise: Readonly<{
      bullets: readonly string[];
      eyebrow: string;
      title: string;
    }>;
    secondaryCta: string;
    title: string;
  }>;
  included: Readonly<{
    badge: string;
    body: string;
    items: ReadonlyArray<PricingTextPair>;
    title: string;
  }>;
  plans: Readonly<{
    eyebrow: string;
    items: ReadonlyArray<PricingPlanCopy>;
    lead: string;
    recommendedLabel: string;
    title: string;
  }>;
}>;

export const PRICING_COPY_SOURCE_LANGUAGE = DEFAULT_LANGUAGE;

export const pricingCopyNamespaces = [
  "hero",
  "plans",
  "included",
  "guardrails",
  "faq",
  "cta",
] as const satisfies readonly (keyof PricingCopy)[];

const englishPricingCopy: PricingCopy = {
  cta: {
    badge: "Ready for pilot setup",
    body:
      "The goal is simple: prove that faster, cleaner quote response helps your cleaning business recover more conversations.",
    button: "Start founder pilot",
    title:
      "Start with the recovery workflow, then decide from real usage.",
  },
  faq: {
    eyebrow: "FAQ",
    items: [
      {
        answer:
          "No. The current product is focused on quote recovery before the job is booked: capture the request, identify missing details, prepare a reply draft, and keep follow-up visible.",
        question: "Is this a booking or invoice system?",
      },
      {
        answer:
          "No. AI drafts stay owner-reviewed. You review, edit, copy, and send from your own channel.",
        question: "Will BizPilot message customers automatically?",
      },
      {
        answer:
          "The founder helps configure your quote page, service list, basic branding, intake questions, sample lead, and first-week workflow.",
        question: "What happens during the Founder Pilot?",
      },
      {
        answer:
          "The first version is done-for-you. Setup covers configuring the quote workflow around your cleaning business instead of handing you another empty tool.",
        question: "Why is there a setup fee?",
      },
    ],
    title: "Straight answers before you start.",
  },
  guardrails: {
    eyebrow: "Built for trust",
    items: [
      "No auto-send",
      "No invented cleaning prices",
      "No booking confirmation",
      "No SMS or WhatsApp automation in this pilot",
      "No full CRM scope",
    ],
    title:
      "The assistant helps you reply faster. It does not become your operator.",
  },
  hero: {
    badge: "Founder pilot pricing",
    body:
      "BizPilot is sold as a done-for-you quote recovery system: setup, quote link, organized leads, owner-reviewed AI drafts, and follow-up visibility. No auto-send, no booking system, no bloated CRM.",
    primaryCta: "Start founder pilot",
    promise: {
      bullets: [
        "Owner reviews every AI draft",
        "Nothing sends automatically",
        "No invented prices or availability",
        "Setup is guided by the founder",
      ],
      eyebrow: "Pilot promise",
      title: "You stay in control of every customer message.",
    },
    secondaryCta: "See workflow",
    title: "Start with one workflow that can recover real cleaning jobs.",
  },
  included: {
    badge: "What you get",
    body:
      "The offer is designed for cleaning owners who need faster response, cleaner intake, and follow-up visibility before they need a full operations platform.",
    items: [
      {
        body:
          "A branded quote page customers can use from your site, Instagram, Google profile, email, or saved reply.",
        title: "Quote link setup",
      },
      {
        body:
          "Every request lands in a clear queue with status, urgency, source, and missing details.",
        title: "Lead recovery desk",
      },
      {
        body:
          "BizPilot prepares replies and follow-ups. The owner reviews, edits, copies, and sends manually.",
        title: "Owner-reviewed AI",
      },
      {
        body:
          "First-week support helps tune questions, services, FAQs, and the owner workflow.",
        title: "Founder-led onboarding",
      },
    ],
    title: "A focused recovery workflow, not another software maze.",
  },
  plans: {
    eyebrow: "Simple founder offers",
    items: [
      {
        cta: "Start founder pilot",
        description:
          "For the first cleaning businesses validating the quote recovery workflow with founder-led setup and manual support.",
        features: [
          "First 1-5 pilot customers",
          "Free founder-led setup",
          "Public quote page",
          "Lead recovery queue",
          "AI summary",
          "AI reply drafts you review",
          "AI follow-up drafts",
          "30- and 60-day feedback required",
          "Manual copy/send only",
        ],
        monthly: "$0 setup pilot",
        name: "Founder Pilot",
        recommended: true,
        setup: "feedback commitment",
      },
      {
        cta: "Choose Starter",
        description:
          "For early customers after the first proof points are collected: one clean quote link, one lead workspace, and owner-reviewed AI drafts.",
        features: [
          "Pilot customers 6-20",
          "One quote page",
          "Lead workspace",
          "Basic AI drafts",
          "Manual follow-up visibility",
          "Basic branding",
          "Founder setup guidance",
        ],
        monthly: "$49/mo",
        name: "Starter",
        setup: "$149 setup",
      },
      {
        cta: "Choose Pro",
        description:
          "For the standard paid offer after early testimonials prove that quote recovery is working.",
        features: [
          "After first 20 customers",
          "Everything in Starter",
          "Stronger branded quote page",
          "Reply style and FAQ tuning",
          "Follow-up draft tuning",
          "Better lead organization",
          "Priority setup",
          "Simple usage insights",
        ],
        monthly: "$79/mo",
        name: "Pro",
        setup: "$199 setup",
      },
    ],
    lead:
      "The first pilots stay intentionally focused: quote capture, organized leads, safer drafts, and follow-up visibility.",
    recommendedLabel: "Recommended",
    title: "Pricing for cleaning quote recovery.",
  },
};

const frenchPricingCopy: PricingCopy = {
  cta: {
    badge: "Prêt pour la configuration pilote",
    body:
      "L'objectif est simple: prouver qu'une réponse de soumission plus rapide et plus claire aide votre entreprise de nettoyage à récupérer plus de conversations.",
    button: "Démarrer le pilote fondateur",
    title:
      "Commencez avec le workflow de récupération, puis décidez à partir de l'usage réel.",
  },
  faq: {
    eyebrow: "FAQ",
    items: [
      {
        answer:
          "Non. Le produit actuel se concentre sur la récupération des demandes avant que le travail soit réservé: capter la demande, identifier les détails manquants, préparer un brouillon de réponse et garder le suivi visible.",
        question: "Est-ce un système de réservation ou de facturation?",
      },
      {
        answer:
          "Non. Les brouillons IA restent révisés par le propriétaire. Vous révisez, modifiez, copiez et envoyez depuis votre propre canal.",
        question: "BizPilot envoie-t-il automatiquement des messages aux clients?",
      },
      {
        answer:
          "Le fondateur aide à configurer votre page de soumission, la liste de services, l'identité visuelle de base, les questions d'intake, un lead exemple et le workflow de la première semaine.",
        question: "Que se passe-t-il pendant le pilote fondateur?",
      },
      {
        answer:
          "La première version est faite pour vous. Les frais couvrent la configuration du workflow autour de votre entreprise de nettoyage au lieu de vous donner un autre outil vide.",
        question: "Pourquoi y a-t-il des frais de configuration?",
      },
    ],
    title: "Des réponses claires avant de commencer.",
  },
  guardrails: {
    eyebrow: "Conçu pour la confiance",
    items: [
      "Aucun envoi automatique",
      "Aucun prix de nettoyage inventé",
      "Aucune confirmation de réservation",
      "Aucune automation SMS ou WhatsApp dans ce pilote",
      "Aucun scope CRM complet",
    ],
    title:
      "L'assistant vous aide à répondre plus vite. Il ne devient pas votre opérateur.",
  },
  hero: {
    badge: "Tarifs du pilote fondateur",
    body:
      "BizPilot est vendu comme un système de récupération de soumissions fait pour vous: configuration, lien de soumission, leads organisés, brouillons IA révisés par le propriétaire et visibilité des suivis. Aucun envoi automatique, aucun système de réservation, aucun CRM gonflé.",
    primaryCta: "Démarrer le pilote fondateur",
    promise: {
      bullets: [
        "Le propriétaire révise chaque brouillon IA",
        "Rien n'est envoyé automatiquement",
        "Aucun prix ou disponibilité inventé",
        "La configuration est guidée par le fondateur",
      ],
      eyebrow: "Promesse du pilote",
      title: "Vous gardez le contrôle de chaque message client.",
    },
    secondaryCta: "Voir le workflow",
    title:
      "Commencez avec un seul workflow qui peut récupérer de vrais mandats de nettoyage.",
  },
  included: {
    badge: "Ce qui est inclus",
    body:
      "L'offre est conçue pour les propriétaires de nettoyage qui ont besoin de répondre plus vite, de mieux capter les demandes et de garder le suivi visible avant d'avoir besoin d'une plateforme opérationnelle complète.",
    items: [
      {
        body:
          "Une page de soumission à votre image que les clients peuvent utiliser depuis votre site, Instagram, profil Google, courriel ou réponse enregistrée.",
        title: "Configuration du lien de soumission",
      },
      {
        body:
          "Chaque demande arrive dans une file claire avec statut, urgence, source et détails manquants.",
        title: "Bureau de récupération des leads",
      },
      {
        body:
          "BizPilot prépare les réponses et suivis. Le propriétaire révise, modifie, copie et envoie manuellement.",
        title: "IA révisée par le propriétaire",
      },
      {
        body:
          "Le soutien de la première semaine aide à ajuster les questions, services, FAQ et le workflow du propriétaire.",
        title: "Onboarding guidé par le fondateur",
      },
    ],
    title: "Un workflow de récupération ciblé, pas un autre labyrinthe logiciel.",
  },
  plans: {
    eyebrow: "Offres fondatrices simples",
    items: [
      {
        cta: "Démarrer le pilote fondateur",
        description:
          "Pour les premières entreprises de nettoyage qui valident le workflow de récupération avec configuration fondatrice et soutien manuel.",
        features: [
          "Clients pilotes 1 a 5",
          "Configuration fondateur gratuite",
          "Page publique de soumission",
          "File de récupération des leads",
          "Résumé IA",
          "Brouillons de réponse IA à réviser",
          "Brouillons de suivi IA",
          "Feedback requis a 30 et 60 jours",
          "Copie/envoi manuel seulement",
        ],
        monthly: "Setup pilote a 0 $",
        name: "Pilote fondateur",
        recommended: true,
        setup: "engagement de feedback",
      },
      {
        cta: "Choisir Starter",
        description:
          "Pour les premiers clients apres les premieres preuves: un lien de soumission clair, un espace lead et des brouillons IA revises par le proprietaire.",
        features: [
          "Clients pilotes 6 a 20",
          "Une page de soumission",
          "Espace lead",
          "Brouillons IA de base",
          "Visibilité simple des suivis manuels",
          "Branding de base",
          "Guidance de configuration fondatrice",
        ],
        monthly: "49 $/mois",
        name: "Starter",
        setup: "149 $ setup",
      },
      {
        cta: "Choisir Pro",
        description:
          "Pour l'offre payante standard apres que les premiers temoignages prouvent que la recuperation des soumissions fonctionne.",
        features: [
          "Apres les 20 premiers clients",
          "Tout ce qui est inclus dans Starter",
          "Page de soumission plus fortement brandée",
          "Réglage du style de réponse et des FAQ",
          "Réglage des brouillons de suivi",
          "Meilleure organisation des leads",
          "Configuration prioritaire",
          "Insights d'usage simples",
        ],
        monthly: "79 $/mois",
        name: "Pro",
        setup: "199 $ setup",
      },
    ],
    lead:
      "Les premiers pilotes restent volontairement ciblés: capture des demandes, leads organisés, brouillons plus sûrs et visibilité des suivis.",
    recommendedLabel: "Recommandé",
    title: "Tarifs pour récupérer les soumissions de nettoyage.",
  },
};

const pricingCopyByLanguage: Record<SupportedLanguage, PricingCopy> = {
  en: englishPricingCopy,
  "fr-CA": frenchPricingCopy,
};

export function getPricingCopy(language: unknown): PricingCopy {
  return pricingCopyByLanguage[readSupportedLanguage(language)];
}
