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
 * Last Updated: 2026-06-21
 * Change Log:
 * - 2026-06-16: Updated public trust copy to reflect Phase 23/24 synthetic proof and remaining real-data gates.
 * - 2026-06-18: Reframed public policy copy around owner-friendly summaries and approved staged pilot pricing.
 * - 2026-06-21: Restored fr-CA accents and cleaner localized wording for public legal pages.
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
      "BizPilot is manual-first. It should collect only what a cleaning owner needs to review a quote request and reply responsibly.",
    boundaryTitle: "Plain-language summary",
    body:
      "BizPilot is being prepared for early cleaning-business pilots. This notice explains the practical privacy rules that apply before real customer data is allowed.",
    effectiveDate: "Last updated: June 16, 2026",
    externalNewTabLabel: "Opens in a new tab",
    footerNote:
      "Before any real customer pilot, BizPilot must keep the first pilot manual-only and record final readiness approval from the owner.",
    meta: {
      description:
        "BizPilot AI privacy notice for careful cleaning quote recovery, consent, data minimization, and real customer data readiness gates.",
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
        title: "Commission d'acces a l'information: Law 25 changes",
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
          "Tenant data must stay separated by business membership and row-level security. Synthetic production proof, OpenAI provider proof, Auth email proof, and DB-level backup/export/restore proof are recorded; real customer data remains blocked until the final readiness approval gate closes.",
        title: "Real customer data gate",
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
      "BizPilot uses conservative safeguards for public quote intake, tenant access, secret handling, and owner-reviewed AI drafts.",
    boundaryTitle: "Plain-language summary",
    body:
      "BizPilot's security model is intentionally conservative: public quote intake is treated as the highest-risk surface, and AI remains owner-reviewed.",
    effectiveDate: "Last updated: June 16, 2026",
    externalNewTabLabel: "Opens in a new tab",
    footerNote:
      "This page is a product security summary. It does not replace a formal security review, incident response policy, or production backup drill.",
    meta: {
      description:
        "BizPilot AI security summary for public quote intake, tenant isolation, owner-reviewed AI drafts, and readiness gates.",
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
        title: "Commission d'acces a l'information: Law 25 changes",
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
          "BizPilot helps cleaning businesses capture quote requests, organize leads, prepare replies for owner review, and keep follow-up visible. It is not an auto-send tool, booking system, invoice system, SMS/WhatsApp sender, or full CRM.",
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
      "BizPilot est manuel d'abord. Il doit collecter seulement ce qu'un propriétaire d'entreprise de nettoyage doit savoir pour réviser une demande et répondre prudemment.",
    boundaryTitle: "Résumé simple",
    body:
      "BizPilot est préparé pour les premiers pilotes avec des entreprises de nettoyage. Cet avis explique les règles pratiques avant l'utilisation de données client réelles.",
    effectiveDate: "Dernière mise à jour : 16 juin 2026",
    externalNewTabLabel: "Ouvre dans un nouvel onglet",
    footerNote:
      "Avant tout pilote réel, BizPilot doit garder le premier pilote manuel et enregistrer l'approbation finale du propriétaire.",
    meta: {
      description:
        "Avis de confidentialité BizPilot AI pour la récupération prudente des soumissions de nettoyage, le consentement et les portes de préparation.",
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
        title: "Commission d'accès à l'information : changements de la Loi 25",
      },
    ],
    referenceEyebrow: "Référence",
    referenceTitle: "Références publiques de confidentialité et sécurité.",
    sections: [
      {
        body:
          "BizPilot sert à récupérer les demandes de soumission : formulaires publics, détails du prospect, notes du propriétaire, résumés IA, brouillons manuels et statut de suivi. Il ne doit pas recevoir de cartes de paiement, pièces d'identité, données de santé ou dossiers sensibles non reliés.",
        title: "Ce que BizPilot doit collecter",
      },
      {
        body:
          "La collecte doit rester limitée à ce qu'un propriétaire d'entreprise de nettoyage doit savoir pour répondre : contact, type de service, lieu, moment, contexte de propriété et message du client.",
        title: "Minimisation des données",
      },
      {
        body:
          "Les formulaires de soumission doivent afficher un texte de consentement. Le propriétaire reste responsable d'envoyer les messages manuellement depuis son propre canal; BizPilot n'envoie pas automatiquement les messages clients.",
        title: "Consentement et communication manuelle",
      },
      {
        body:
          "Les données de chaque entreprise doivent rester séparées par l'adhésion et la sécurité RLS. La preuve production synthétique, OpenAI, courriel auth et sauvegarde/restauration DB-level est enregistrée; les données réelles restent bloquées jusqu'à la gate finale d'approbation.",
        title: "Gate des données réelles",
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
      "BizPilot applique des protections conservatrices pour les soumissions publiques, l'accès tenant, les secrets et les brouillons IA révisés par le propriétaire.",
    boundaryTitle: "Résumé simple",
    body:
      "Le modèle de sécurité BizPilot reste conservateur : l'intake public est traité comme surface critique, et l'IA reste révisée par le propriétaire.",
    effectiveDate: "Dernière mise à jour : 16 juin 2026",
    externalNewTabLabel: "Ouvre dans un nouvel onglet",
    footerNote:
      "Cette page résume la sécurité produit. Elle ne remplace pas un audit formel, une politique d'incident ou un exercice de restauration.",
    meta: {
      description:
        "Résumé de sécurité BizPilot AI pour les soumissions publiques, l'isolation des tenants, les brouillons IA révisés et les portes de préparation.",
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
        title: "Commission d'accès à l'information : changements de la Loi 25",
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
          "L'accès aux données d'entreprise passe par l'authentification, l'adhésion, le statut lifecycle et la sécurité RLS de la base de données. Les helpers service-role doivent rester côté serveur.",
        title: "Isolation des tenants",
      },
      {
        body:
          "L'IA aide seulement à préparer un brouillon. BizPilot ne doit pas envoyer automatiquement, inventer des prix, confirmer des réservations ou agir comme opérateur caché.",
        title: "Limite de sécurité IA",
      },
      {
        body:
          "Les secrets doivent rester dans les environnements fournisseurs, jamais dans le code, les logs, captures, docs ou commits. Les clés manquantes doivent échouer proprement ou utiliser un fallback documenté.",
        title: "Gestion des secrets",
      },
      {
        body:
          "La preuve export/restauration DB-level est passée pour la cible synthétique. La preuve stricte app/dashboard/RLS restaurée reste différée à P1 avant pilote payant, migrations production, nettoyage destructif, travail bulk ou échelle plus large.",
        title: "Gate sauvegarde et restauration",
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
          "BizPilot aide les entreprises de nettoyage à capter les demandes, organiser les prospects, préparer des brouillons révisés par le propriétaire et garder les suivis visibles. Ce n'est pas un outil d'envoi automatique, réservation, facturation, SMS/WhatsApp ou CRM complet.",
        title: "Portée produit",
      },
      {
        body:
          "BizPilot utilise des conditions pilote par étapes : les 1 à 5 premières entreprises de nettoyage peuvent rejoindre le Founder Feedback Pilot à $0 setup avec engagement de feedback à 30 et 60 jours; les clients 6 à 20 utilisent Starter Pilot à $149 setup et $49/month; après preuve ou après les 20 premiers clients, Pro Pilot est à $199 setup et $79/month.",
        title: "Tarifs pilote",
      },
      {
        body:
          "Le setup payant est remboursable avant le début du travail d'onboarding. Après le début du setup, le remboursement n'est pas automatique. Le client peut annuler avant le prochain cycle mensuel; aucun contrat long terme n'est promis.",
        title: "Remboursements et annulation",
      },
      {
        body:
          "La facturation reste manuelle par facture ou lien de paiement séparé. BizPilot n'inclut pas encore de billing in-app, facturation, collecte de paiement ou webhook paiement.",
        title: "Facturation manuelle seulement",
      },
      {
        body:
          "BizPilot ne garantit pas les revenus, jobs récupérés, taux de réponse, classement, conversion client ou conformité réglementaire. Le propriétaire reste responsable de réviser chaque réponse.",
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
