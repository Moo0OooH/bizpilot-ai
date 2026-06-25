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
 * Last Updated: 2026-06-25
 * Change Log:
 * - 2026-06-16: Updated public trust copy to reflect Phase 23/24 synthetic proof and remaining real-data gates.
 * - 2026-06-18: Reframed public policy copy around owner-friendly summaries and approved staged pilot pricing.
 * - 2026-06-21: Restored fr-CA accents and cleaner localized wording for public legal pages.
 * - 2026-06-21: Polished final public privacy, security, and terms wording.
 * - 2026-06-25: Polished fr-CA terms wording around project-pilot terminology.
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

type PolicyReference = Readonly<{
  description: string;
  href: string;
  title: string;
}>;

export type PolicyPageKey = "privacy" | "security" | "terms";

export type PolicyPageCopy = Readonly<{
  badge: string;
  boundaryBody: string;
  boundaryTitle: string;
  body: string;
  effectiveDate: string;
  externalNewTabLabel: string;
  footerNote: string;
  meta: Readonly<{
    description: string;
    title: string;
  }>;
  referenceEyebrow?: string;
  referenceTitle?: string;
  references?: ReadonlyArray<PolicyReference>;
  sections: ReadonlyArray<PolicyTextPair>;
  technicalNotesTitle: string;
  title: string;
}>;

export type PolicyCopy = Readonly<Record<PolicyPageKey, PolicyPageCopy>>;

export const POLICY_COPY_SOURCE_LANGUAGE = DEFAULT_LANGUAGE;

const englishPolicyCopy: PolicyCopy = {
  privacy: {
    badge: "Privacy notice",
    boundaryBody:
      "BizPilot keeps communication in the business's hands and collects only the details needed to answer a cleaning quote request.",
    boundaryTitle: "Plain-language summary",
    body:
      "This notice explains the practical privacy rules for BizPilot quote recovery: collect less, show consent, and keep customer communication under business control.",
    effectiveDate: "Last updated: June 16, 2026",
    externalNewTabLabel: "Opens in a new tab",
    footerNote:
      "Before any real customer pilot, BizPilot stays manual-only and requires explicit pilot approval.",
    meta: {
      description:
        "BizPilot AI privacy notice for careful cleaning quote recovery, consent, data minimization, and business-controlled customer communication.",
      title: "Privacy Notice | BizPilot AI",
    },
    references: [
      {
        description:
          "Federal private-sector privacy law topics from Canada's privacy regulator.",
        href: "https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/",
        title: "Office of the Privacy Commissioner of Canada: PIPEDA",
      },
      {
        description:
          "Quebec regulator overview of privacy-law modernization changes.",
        href: "https://www.cai.gouv.qc.ca/protection-renseignements-personnels/sujets-et-domaines-dinteret/principaux-changements-loi-25/",
        title: "Commission d’accès à l’information du Québec: Law 25 changes",
      },
    ],
    referenceEyebrow: "Reference",
    referenceTitle: "Public privacy and security references.",
    sections: [
      {
        body:
          "BizPilot is for cleaning quote recovery: quote-page submissions, lead details, business notes, AI-assisted summaries, manual reply drafts, and follow-up status. It is not for payment cards, government IDs, health data, or unrelated sensitive records.",
        title: "What BizPilot is designed to collect",
      },
      {
        body:
          "Collection must stay limited to what a cleaning business needs to understand and answer a quote request: contact details, service type, location, timing, property context, and the customer's message.",
        title: "Data minimization",
      },
      {
        body:
          "Quote forms must show consent language before submission. The business remains responsible for sending customer messages manually from its own channel; BizPilot does not auto-send customer messages.",
        title: "Consent and manual communication",
      },
      {
        body:
          "Tenant data must stay separated by business membership and row-level security. Synthetic production proof, OpenAI provider proof, Auth email proof, and DB-level backup/export/restore proof are recorded; real customer data remains blocked until explicit pilot approval.",
        title: "Real customer data approval",
      },
      {
        body:
          "Privacy requests should use the founder-provided onboarding/support channel until a dedicated privacy mailbox is verified. Requests may include access, correction, deletion, or questions about use and retention.",
        title: "Access, correction, and deletion",
      },
    ],
    technicalNotesTitle: "Technical notes and operating boundaries",
    title: "Privacy rules for careful quote recovery.",
  },
  security: {
    badge: "Security posture",
    boundaryBody:
      "BizPilot uses conservative safeguards for public quote forms, account access, secret handling, and AI text that the business approves before sending.",
    boundaryTitle: "Plain-language summary",
    body:
      "BizPilot treats public quote intake as a sensitive surface. The workflow is designed to keep access scoped, secrets out of source, and final customer messages under business control.",
    effectiveDate: "Last updated: June 16, 2026",
    externalNewTabLabel: "Opens in a new tab",
    footerNote:
      "This page is a product security summary. It does not replace a formal security review, incident response policy, or production backup drill.",
    meta: {
      description:
        "BizPilot AI security summary for public quote intake, tenant isolation, approved AI drafts, and production safeguards.",
      title: "Security Summary | BizPilot AI",
    },
    references: [
      {
        description:
          "Federal privacy-law topics, including safeguards and compliance help.",
        href: "https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/",
        title: "Office of the Privacy Commissioner of Canada: PIPEDA",
      },
      {
        description:
          "Quebec privacy-law changes that affect private-sector organizations.",
        href: "https://www.cai.gouv.qc.ca/protection-renseignements-personnels/sujets-et-domaines-dinteret/principaux-changements-loi-25/",
        title: "Commission d’accès à l’information du Québec: Law 25 changes",
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
          "DB-level export/restore proof passed for the synthetic target. Strict restored app/dashboard/RLS proof remains deferred to P1 before paid pilot, production migrations, destructive cleanup, bulk work, or broader scale.",
        title: "Backup and restore gate",
      },
    ],
    technicalNotesTitle: "Technical notes and operating boundaries",
    title: "Security boundaries before real pilot data.",
  },
  terms: {
    badge: "Pilot terms",
    boundaryBody:
      "Setup, billing, and real customer data stay founder-led, manual, and approval-gated during the pilot.",
    boundaryTitle: "Plain-language summary",
    body:
      "These pilot-stage terms keep the offer clear while BizPilot is still founder-led and manual-billing only.",
    effectiveDate: "Last updated: June 16, 2026",
    externalNewTabLabel: "Opens in a new tab",
    footerNote:
      "Any paid pilot must still have a written offer or invoice/payment-link record before money is collected.",
    meta: {
      description:
        "BizPilot AI founder-pilot terms covering manual billing, staged pilot pricing, product scope, refunds, and no-guarantee boundaries.",
      title: "Pilot Terms | BizPilot AI",
    },
    sections: [
      {
        body:
          "BizPilot helps cleaning businesses capture quote requests, organize leads, prepare replies the business approves, and keep follow-up visible. It is not an auto-send tool, booking system, invoice system, SMS/WhatsApp sender, or full CRM.",
        title: "Product scope",
      },
      {
        body:
          "BizPilot uses staged pilot terms: first 1-5 cleaning businesses may join the Founder Feedback Pilot at $0 setup with a 30- and 60-day feedback commitment; customers 6-20 use Starter Pilot at $149 setup and $49/month; after proof or after the first 20 customers, Pro Pilot is $199 setup and $79/month.",
        title: "Pilot pricing",
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
    technicalNotesTitle: "Technical notes and operating boundaries",
    title: "Clear founder-pilot terms, no hidden automation.",
  },
};

const frenchPolicyCopy: PolicyCopy = {
  privacy: {
    badge: "Avis de confidentialité",
    boundaryBody:
      "BizPilot garde la communication entre les mains de l'entreprise et collecte seulement les détails utiles pour répondre à une demande de soumission.",
    boundaryTitle: "Résumé simple",
    body:
      "Cet avis explique les règles pratiques de confidentialité pour BizPilot : collecter moins, afficher le consentement et laisser l'entreprise contrôler les messages aux clients.",
    effectiveDate: "Dernière mise à jour : 16 juin 2026",
    externalNewTabLabel: "Ouvre dans un nouvel onglet",
    footerNote:
      "Avant toute utilisation avec de vraies données clients, BizPilot reste manuel et exige une approbation explicite du projet pilote.",
    meta: {
      description:
        "Avis de confidentialité BizPilot AI pour la récupération prudente des soumissions de nettoyage, le consentement, la minimisation des données et le contrôle des messages par l'entreprise.",
      title: "Avis de confidentialité | BizPilot AI",
    },
    references: [
      {
        description:
          "Sujets sur la loi fédérale canadienne applicable au secteur privé.",
        href: "https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/",
        title: "Commissariat à la protection de la vie privée du Canada : LPRPDE",
      },
      {
        description:
          "Aperçu du régulateur québécois sur les changements de la Loi 25.",
        href: "https://www.cai.gouv.qc.ca/protection-renseignements-personnels/sujets-et-domaines-dinteret/principaux-changements-loi-25/",
        title: "Commission d’accès à l’information du Québec : changements de la Loi 25",
      },
    ],
    referenceEyebrow: "Référence",
    referenceTitle: "Références publiques de confidentialité et sécurité.",
    sections: [
      {
        body:
          "BizPilot sert à récupérer les demandes de soumission : formulaires publics, détails du prospect, notes de l'entreprise, résumés IA, brouillons manuels et statut de suivi. Il ne doit pas recevoir de cartes de paiement, pièces d'identité, données de santé ou dossiers sensibles non reliés.",
        title: "Ce que BizPilot doit collecter",
      },
      {
        body:
          "La collecte doit rester limitée à ce qu'une entreprise de nettoyage doit savoir pour répondre : contact, type de service, lieu, moment, contexte de propriété et message du client.",
        title: "Minimisation des données",
      },
      {
        body:
          "Les formulaires de soumission doivent afficher un texte de consentement. L'entreprise reste responsable d'envoyer les messages manuellement depuis son propre canal; BizPilot n'envoie pas automatiquement les messages clients.",
        title: "Consentement et communication manuelle",
      },
      {
        body:
          "Les données de chaque entreprise doivent rester séparées par l'adhésion et la sécurité RLS. Les preuves synthétiques de production, du fournisseur OpenAI, du courriel d'authentification et de la sauvegarde/restauration sont enregistrées; les données réelles restent bloquées jusqu'à l'approbation finale.",
        title: "Approbation des données réelles",
      },
      {
        body:
          "Les demandes de confidentialité passent par le canal d'onboarding/support fourni par le fondateur jusqu'à vérification d'une boîte dédiée. Les demandes peuvent porter sur l'accès, la correction, la suppression, l'utilisation ou la conservation.",
        title: "Accès, correction et suppression",
      },
    ],
    technicalNotesTitle: "Notes techniques et limites opérationnelles",
    title: "Règles de confidentialité pour la récupération des soumissions.",
  },
  security: {
    badge: "Posture de sécurité",
    boundaryBody:
      "BizPilot applique des protections conservatrices pour les formulaires publics, l'accès aux comptes, les secrets et les textes IA à valider avant l'envoi.",
    boundaryTitle: "Résumé simple",
    body:
      "BizPilot traite les demandes publiques comme une surface sensible. Le flux garde l'accès limité, les secrets hors du code et les messages finaux sous le contrôle de l'entreprise.",
    effectiveDate: "Dernière mise à jour : 16 juin 2026",
    externalNewTabLabel: "Ouvre dans un nouvel onglet",
    footerNote:
      "Cette page résume la sécurité produit. Elle ne remplace pas un audit formel, une politique d'incident ou un exercice de restauration.",
    meta: {
      description:
        "Résumé de sécurité BizPilot AI pour les soumissions publiques, l'isolation des espaces clients, les brouillons IA à valider et les protections de production.",
      title: "Résumé de sécurité | BizPilot AI",
    },
    references: [
      {
        description:
          "Sujets sur la loi fédérale, incluant les mesures de protection et l'aide à la conformité.",
        href: "https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/",
        title: "Commissariat à la protection de la vie privée du Canada : LPRPDE",
      },
      {
        description:
          "Changements québécois en protection des renseignements personnels pour les organisations.",
        href: "https://www.cai.gouv.qc.ca/protection-renseignements-personnels/sujets-et-domaines-dinteret/principaux-changements-loi-25/",
        title: "Commission d’accès à l’information du Québec : changements de la Loi 25",
      },
    ],
    referenceEyebrow: "Référence",
    referenceTitle: "Références publiques de confidentialité et sécurité.",
    sections: [
      {
        body:
          "Les pages de soumission publiques valident le lien actif, le formulaire attendu, le consentement, les champs cachés, le temps de soumission et les signaux d'abus avant d'accepter une soumission synthétique ou pilote.",
        title: "Durcissement des soumissions publiques",
      },
      {
        body:
          "L'accès aux données d'entreprise passe par l'authentification, l'adhésion, l'état du cycle de vie et la sécurité RLS de la base de données. Les helpers de rôle service doivent rester côté serveur.",
        title: "Isolation des espaces clients",
      },
      {
        body:
          "L'IA aide seulement à préparer un brouillon. BizPilot ne doit pas envoyer automatiquement, inventer des prix, confirmer des réservations ou agir comme opérateur caché.",
        title: "Limite de sécurité IA",
      },
      {
        body:
          "Les secrets doivent rester dans les environnements fournisseurs, jamais dans le code, les journaux, captures, docs ou commits. Les clés manquantes doivent échouer proprement ou utiliser une solution de repli documentée.",
        title: "Gestion des secrets",
      },
      {
        body:
          "La preuve d'export et de restauration est enregistrée pour la cible synthétique. La preuve stricte de l'application restaurée, du tableau de bord et de la sécurité RLS reste différée à P1 avant un pilote payant, des migrations de production, un nettoyage destructif ou un travail à plus grande échelle.",
        title: "Approbation sauvegarde et restauration",
      },
    ],
    technicalNotesTitle: "Notes techniques et limites opérationnelles",
    title: "Frontières de sécurité avant les données réelles.",
  },
  terms: {
    badge: "Conditions pilote",
    boundaryBody:
      "La mise en place, la facturation et les données réelles restent guidées par le fondateur, manuelles et soumises à approbation pendant le pilote.",
    boundaryTitle: "Résumé simple",
    body:
      "Ces conditions de pilote gardent l'offre claire pendant que BizPilot reste guidé par le fondateur avec facturation manuelle.",
    effectiveDate: "Dernière mise à jour : 16 juin 2026",
    externalNewTabLabel: "Ouvre dans un nouvel onglet",
    footerNote:
      "Tout pilote payant doit avoir une offre écrite, facture ou lien de paiement séparé avant toute collecte d'argent.",
    meta: {
      description:
        "Conditions du projet pilote BizPilot AI couvrant la facturation manuelle, les tarifs pilotes, les remboursements et les limites sans garantie.",
      title: "Conditions pilote | BizPilot AI",
    },
    sections: [
      {
        body:
          "BizPilot aide les entreprises de nettoyage à capter les demandes, organiser les prospects, préparer des réponses à valider et garder les suivis visibles. Ce n'est pas un outil d'envoi automatique, réservation, facturation, SMS/WhatsApp ou CRM complet.",
        title: "Portée produit",
      },
      {
        body:
          "BizPilot utilise des conditions pilote par étapes : les 1 à 5 premières entreprises de nettoyage peuvent rejoindre le projet pilote à $0 setup avec un engagement de commentaires à 30 et 60 jours; les clients 6 à 20 utilisent le pilote de départ à $149 setup et $49/month; après preuve ou après les 20 premiers clients, le pilote Pro est à $199 setup et $79/month.",
        title: "Tarifs pilote",
      },
      {
        body:
          "Les frais de mise en place payants sont remboursables avant le début du travail d'intégration. Après le début de la mise en place, le remboursement n'est pas automatique. Le client peut annuler avant le prochain cycle mensuel; aucun contrat long terme n'est promis.",
        title: "Remboursements et annulation",
      },
      {
        body:
          "La facturation reste manuelle par facture ou lien de paiement séparé. BizPilot n'inclut pas encore de facturation intégrée à l'application, de collecte de paiement ou d'automatisation de paiement.",
        title: "Facturation manuelle seulement",
      },
      {
        body:
          "BizPilot ne garantit pas les revenus, travaux récupérés, taux de réponse, classement, conversion client ou conformité réglementaire. Le propriétaire reste responsable de réviser chaque réponse.",
        title: "Aucune garantie",
      },
    ],
    technicalNotesTitle: "Notes techniques et limites opérationnelles",
    title: "Conditions claires, sans automatisation cachée.",
  },
};

const policyCopyByLanguage: Record<SupportedLanguage, PolicyCopy> = {
  en: englishPolicyCopy,
  "fr-CA": frenchPolicyCopy,
};

export function getPolicyCopy(language: unknown): PolicyCopy {
  return policyCopyByLanguage[readSupportedLanguage(language)];
}
