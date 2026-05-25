/**
 * ============================================================
 * File: lib/i18n/policy-copy.ts
 * Project: BizPilot AI
 * Description: Public trust-page copy for privacy, security, and terms pages.
 * Role: Keeps pilot-stage policy notices language-linked without adding legal automation.
 * Related:
 * - app/privacy/page.tsx
 * - app/security/page.tsx
 * - app/terms/page.tsx
 * - components/public/policy-page.tsx
 * Author: MoOoH
 * Created: 2026-05-25
 * ============================================================
 */

import {
  DEFAULT_LANGUAGE,
  readSupportedLanguage,
  type SupportedLanguage,
} from "./language.ts";

type PolicyTextPair = Readonly<{
  body: string;
  title: string;
}>;

export type PolicyPageKey = "privacy" | "security" | "terms";

export type PolicyPageCopy = Readonly<{
  badge: string;
  boundaryBody: string;
  boundaryTitle: string;
  body: string;
  effectiveDate: string;
  footerNote: string;
  referenceEyebrow?: string;
  referenceTitle?: string;
  references?: ReadonlyArray<Readonly<{ href: string; label: string }>>;
  sections: ReadonlyArray<PolicyTextPair>;
  title: string;
}>;

export type PolicyCopy = Readonly<Record<PolicyPageKey, PolicyPageCopy>>;

export const POLICY_COPY_SOURCE_LANGUAGE = DEFAULT_LANGUAGE;

const englishPolicyCopy: PolicyCopy = {
  privacy: {
    badge: "Privacy notice",
    boundaryBody:
      "Founder-controlled synthetic demos are allowed. Real customer data waits for production smokes, OpenAI validation, stable email, and backup/export readiness.",
    boundaryTitle: "Pilot boundary",
    body:
      "BizPilot is being prepared for early cleaning-business pilots. This notice explains the practical privacy rules that apply before real customer data is allowed.",
    effectiveDate: "Last updated: May 25, 2026",
    footerNote:
      "Before any real customer pilot, BizPilot must publish a verified privacy contact channel and keep the backup/export gate closed or explicitly upgraded.",
    references: [
      {
        href: "https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/pipeda_brief",
        label: "Canada PIPEDA overview",
      },
      {
        href: "https://www.cai.gouv.qc.ca/espace-evolutif-modernisation-lois/principales-modifications/",
        label: "Quebec Law 25 privacy changes",
      },
    ],
    referenceEyebrow: "Reference",
    referenceTitle: "Public privacy and security references.",
    sections: [
      {
        body:
          "BizPilot is for cleaning quote recovery: quote-page submissions, lead details, owner notes, AI-assisted summaries, manual reply drafts, and follow-up status. It is not for payment cards, government IDs, health data, or unrelated sensitive records.",
        title: "What BizPilot is designed to collect",
      },
      {
        body:
          "Collection must stay limited to what a cleaning owner needs to understand and answer a quote request: contact details, service type, location, timing, property context, and the customer's message.",
        title: "Data minimization",
      },
      {
        body:
          "Quote forms must show consent language before submission. The owner remains responsible for sending customer messages manually from their own channel; BizPilot does not auto-send customer messages.",
        title: "Consent and manual communication",
      },
      {
        body:
          "Tenant data must stay separated by business membership and row-level security. Real customer data is blocked until production smokes, backup/export posture, signup email posture, and OpenAI validation are complete.",
        title: "Current pilot-stage limitation",
      },
      {
        body:
          "Privacy requests should use the founder-provided onboarding/support channel until a dedicated privacy mailbox is verified. Requests may include access, correction, deletion, or questions about use and retention.",
        title: "Access, correction, and deletion",
      },
    ],
    title: "Privacy rules for careful quote recovery.",
  },
  security: {
    badge: "Security posture",
    boundaryBody:
      "Founder-controlled synthetic demos are allowed. Real customer data waits for production smokes, OpenAI validation, stable email, and backup/export readiness.",
    boundaryTitle: "Pilot boundary",
    body:
      "BizPilot's security model is intentionally conservative: public quote intake is treated as the highest-risk surface, and AI remains owner-reviewed.",
    effectiveDate: "Last updated: May 25, 2026",
    footerNote:
      "This page is a product security summary. It does not replace a formal security review, incident response policy, or production backup drill.",
    references: [
      {
        href: "https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/pipeda_brief",
        label: "Safeguards principle reference",
      },
      {
        href: "https://www.cai.gouv.qc.ca/espace-evolutif-modernisation-lois/principales-modifications/",
        label: "Quebec Law 25 changes",
      },
    ],
    referenceEyebrow: "Reference",
    referenceTitle: "Public privacy and security references.",
    sections: [
      {
        body:
          "Public quote pages validate active links, expected forms, consent, hidden fields, submit timing, and abuse signals before accepting synthetic or pilot submissions.",
        title: "Public quote hardening",
      },
      {
        body:
          "Business data access is controlled through authenticated membership, lifecycle status, and database row-level security. Service-role helpers must stay server-only.",
        title: "Tenant isolation",
      },
      {
        body:
          "AI output is a draft aid only. BizPilot must not auto-send, invent prices, confirm bookings, or act as a hidden operator.",
        title: "AI safety boundary",
      },
      {
        body:
          "Secrets must live in provider environment settings, not source code, logs, screenshots, docs, or commits. Missing keys should fail closed or use documented fallback behavior.",
        title: "Secret handling",
      },
      {
        body:
          "Real customer data remains blocked until backup/export/restore posture is approved. Supabase Free/no-PITR status is acceptable only for synthetic founder demos.",
        title: "Backup and restore gate",
      },
    ],
    title: "Security boundaries before real pilot data.",
  },
  terms: {
    badge: "Pilot terms",
    boundaryBody:
      "Founder-controlled synthetic demos are allowed. Real customer data waits for production smokes, OpenAI validation, stable email, and backup/export readiness.",
    boundaryTitle: "Pilot boundary",
    body:
      "These pilot-stage terms keep the offer clear while BizPilot is still founder-led and manual-billing only.",
    effectiveDate: "Last updated: May 25, 2026",
    footerNote:
      "Any paid pilot must still have a written offer or invoice/payment-link record before money is collected.",
    sections: [
      {
        body:
          "BizPilot helps cleaning businesses capture quote requests, organize leads, draft owner-reviewed replies, and keep follow-up visible. It is not an auto-send tool, booking system, invoice system, SMS/WhatsApp sender, or full CRM.",
        title: "Product scope",
      },
      {
        body:
          "The first 1-5 pilot customers receive founder-led setup at $0 in exchange for honest 30- and 60-day feedback. Customers 6-20 use $149 setup plus $49/month. The standard post-proof offer is $199 setup plus $79/month.",
        title: "Approved staged pricing",
      },
      {
        body:
          "Paid setup is refundable before onboarding work starts. After setup work starts, refunds are not automatic. Customers may cancel before the next monthly cycle; no long-term contract is promised.",
        title: "Refunds and cancellation",
      },
      {
        body:
          "Billing stays manual through invoice or a separate payment link. BizPilot does not include in-app subscription billing, invoicing, payment collection, or payment-webhook automation yet.",
        title: "Manual billing only",
      },
      {
        body:
          "BizPilot does not guarantee revenue, recovered jobs, response rates, search ranking, customer conversion, or regulatory compliance. Owners stay responsible for reviewing every reply and deciding what to send.",
        title: "No guarantees",
      },
    ],
    title: "Clear founder-pilot terms, no hidden automation.",
  },
};

const frenchPolicyCopy: PolicyCopy = {
  privacy: {
    badge: "Avis de confidentialite",
    boundaryBody:
      "Les demos synthetiques controlees par le fondateur sont permises. Les donnees reelles attendent les smokes production, la validation OpenAI, le courriel stable et la posture sauvegarde/export.",
    boundaryTitle: "Limite du pilote",
    body:
      "BizPilot est prepare pour les premiers pilotes avec des entreprises de nettoyage. Cet avis explique les regles pratiques avant l'utilisation de donnees reelles de clients.",
    effectiveDate: "Derniere mise a jour: 25 mai 2026",
    footerNote:
      "Avant tout pilote reel, BizPilot doit publier un canal de contact confidentialite verifie et fermer ou ameliorer le gate de sauvegarde/export.",
    references: englishPolicyCopy.privacy.references ?? [],
    referenceEyebrow: "Reference",
    referenceTitle: "References publiques de confidentialite et securite.",
    sections: [
      {
        body:
          "BizPilot sert a recuperer les demandes de soumission: formulaires publics, details du lead, notes du proprietaire, resumes IA, brouillons manuels et statut de suivi. Il ne doit pas recevoir de cartes de paiement, pieces d'identite, donnees de sante ou dossiers sensibles non relies.",
        title: "Ce que BizPilot doit collecter",
      },
      {
        body:
          "La collecte doit rester limitee a ce qu'un proprietaire de nettoyage doit savoir pour repondre: contact, type de service, lieu, moment, contexte de propriete et message du client.",
        title: "Minimisation des donnees",
      },
      {
        body:
          "Les formulaires de soumission doivent afficher un texte de consentement. Le proprietaire reste responsable d'envoyer les messages manuellement depuis son propre canal; BizPilot n'envoie pas automatiquement les messages clients.",
        title: "Consentement et communication manuelle",
      },
      {
        body:
          "Les donnees de chaque entreprise doivent rester separees par l'adhesion et la securite au niveau des lignes. Les donnees reelles restent bloquees jusqu'aux smokes production, sauvegarde/export, posture courriel signup et validation OpenAI.",
        title: "Limite actuelle du pilote",
      },
      {
        body:
          "Les demandes de confidentialite passent par le canal d'onboarding/support fourni par le fondateur jusqu'a verification d'une boite dediee. Les demandes peuvent porter sur l'acces, la correction, la suppression, l'utilisation ou la conservation.",
        title: "Acces, correction et suppression",
      },
    ],
    title: "Regles de confidentialite pour la recuperation des soumissions.",
  },
  security: {
    badge: "Posture de securite",
    boundaryBody:
      "Les demos synthetiques controlees par le fondateur sont permises. Les donnees reelles attendent les smokes production, la validation OpenAI, le courriel stable et la posture sauvegarde/export.",
    boundaryTitle: "Limite du pilote",
    body:
      "Le modele de securite BizPilot reste conservateur: l'intake public est traite comme surface critique, et l'IA reste revisee par le proprietaire.",
    effectiveDate: "Derniere mise a jour: 25 mai 2026",
    footerNote:
      "Cette page resume la securite produit. Elle ne remplace pas un audit formel, une politique d'incident ou un exercice de restauration.",
    references: englishPolicyCopy.security.references ?? [],
    referenceEyebrow: "Reference",
    referenceTitle: "References publiques de confidentialite et securite.",
    sections: [
      {
        body:
          "Les pages de soumission publiques valident le lien actif, le formulaire attendu, le consentement, les champs caches, le temps de soumission et les signaux d'abus avant d'accepter une soumission synthetique ou pilote.",
        title: "Durcissement des soumissions publiques",
      },
      {
        body:
          "L'acces aux donnees d'entreprise passe par l'authentification, l'adhesion, le statut lifecycle et la securite RLS de la base de donnees. Les helpers service-role doivent rester cote serveur.",
        title: "Isolation des tenants",
      },
      {
        body:
          "L'IA aide seulement a preparer un brouillon. BizPilot ne doit pas envoyer automatiquement, inventer des prix, confirmer des reservations ou agir comme operateur cache.",
        title: "Limite de securite IA",
      },
      {
        body:
          "Les secrets doivent rester dans les environnements fournisseurs, jamais dans le code, les logs, captures, docs ou commits. Les cles manquantes doivent echouer proprement ou utiliser un fallback documente.",
        title: "Gestion des secrets",
      },
      {
        body:
          "Les donnees reelles restent bloquees jusqu'a approbation de la sauvegarde/export/restauration. Le statut Supabase Free/sans PITR est acceptable seulement pour les demos synthetiques fondateur.",
        title: "Gate sauvegarde et restauration",
      },
    ],
    title: "Frontieres de securite avant les donnees reelles.",
  },
  terms: {
    badge: "Conditions pilote",
    boundaryBody:
      "Les demos synthetiques controlees par le fondateur sont permises. Les donnees reelles attendent les smokes production, la validation OpenAI, le courriel stable et la posture sauvegarde/export.",
    boundaryTitle: "Limite du pilote",
    body:
      "Ces conditions de pilote gardent l'offre claire pendant que BizPilot reste guide par le fondateur avec facturation manuelle.",
    effectiveDate: "Derniere mise a jour: 25 mai 2026",
    footerNote:
      "Tout pilote payant doit avoir une offre ecrite, facture ou lien de paiement separe avant toute collecte d'argent.",
    sections: [
      {
        body:
          "BizPilot aide les entreprises de nettoyage a capter les demandes, organiser les leads, preparer des brouillons revises par le proprietaire et garder les suivis visibles. Ce n'est pas un outil d'envoi automatique, reservation, facturation, SMS/WhatsApp ou CRM complet.",
        title: "Scope produit",
      },
      {
        body:
          "Les clients pilotes 1 a 5 recoivent une configuration fondateur a 0 $ contre un feedback honnete a 30 et 60 jours. Les clients 6 a 20 utilisent 149 $ setup plus 49 $/mois. L'offre standard apres preuve est 199 $ setup plus 79 $/mois.",
        title: "Tarifs stages approuves",
      },
      {
        body:
          "Le setup payant est remboursable avant le debut du travail d'onboarding. Apres le debut du setup, le remboursement n'est pas automatique. Le client peut annuler avant le prochain cycle mensuel; aucun contrat long terme n'est promis.",
        title: "Remboursements et annulation",
      },
      {
        body:
          "La facturation reste manuelle par facture ou lien de paiement separe. BizPilot n'inclut pas encore de billing in-app, facturation, collecte de paiement ou webhook paiement.",
        title: "Facturation manuelle seulement",
      },
      {
        body:
          "BizPilot ne garantit pas les revenus, jobs recuperes, taux de reponse, classement, conversion client ou conformite reglementaire. Le proprietaire reste responsable de reviser chaque reponse.",
        title: "Aucune garantie",
      },
    ],
    title: "Conditions claires, sans automation cachee.",
  },
};

const policyCopyByLanguage: Record<SupportedLanguage, PolicyCopy> = {
  en: englishPolicyCopy,
  "fr-CA": frenchPolicyCopy,
};

export function getPolicyCopy(language: unknown): PolicyCopy {
  return policyCopyByLanguage[readSupportedLanguage(language)];
}
