/*
 * ============================================================
 * File: lib/i18n/public-v2-fr-copy.ts
 * Project: BizPilot AI
 * Description: Complete Canadian French copy for the universal public V2.
 * Role: Prevents English inheritance and keeps current-product, roadmap, pricing, trust, and founder-pilot claims equivalent in fr-CA.
 * Related:
 * - lib/i18n/public-v2-copy.ts
 * - tests/unit/public-v2-french-copy.test.mts
 * Author: MoOoH
 * Created: 2026-07-13
 * Last Updated: 2026-07-13
 * ============================================================
 */

import type { PublicV2Copy } from "./public-v2-copy.ts";

export function buildPublicV2FrenchCopy(): PublicV2Copy {
  const nav = {
    brandSubtitle: "Espace intelligent de demandes client et de réponses",
    cleaning: "Pilote entretien",
    comparison: "Comparer",
    copyright: "Copyright 2026 BizPilot AI. Tous droits réservés.",
    demo: "Démo",
    faq: "FAQ",
    features: "Produit",
    flow: "Fonctionnement",
    guide: "Guide du lien de demande",
    languageLabel: "Langue du site",
    pilot: "Pilote",
    pricing: "Tarifs",
    privacy: "Confidentialité",
    security: "Sécurité",
    signIn: "Connexion",
    startFull: "Demander l’accès au pilote fondateur",
    startShort: "Demander l’accès",
    terms: "Conditions",
    trust: "Confiance",
    why: "Pourquoi BizPilot",
  } as const;

  const faqItems = [
    {
      question:
        "BizPilot se connecte-t-il directement à Gmail, WhatsApp, Instagram ou aux SMS aujourd’hui?",
      answer:
        "Non. Le pilote actuel utilise un seul lien intelligent que vous pouvez partager sur votre site Web, votre fiche d’établissement Google, vos profils sociaux, vos réponses enregistrées ou votre signature courriel. Les intégrations directes sont des éléments de la feuille de route et ne sont pas présentées comme des fonctions actives.",
    },
    {
      question: "L’IA envoie-t-elle des messages automatiquement?",
      answer:
        "Non. BizPilot prépare un résumé et un brouillon. Le propriétaire vérifie, modifie, copie et envoie lui-même la réponse dans le véritable canal du client.",
    },
    {
      question:
        "BizPilot peut-il inventer un prix ou confirmer une réservation?",
      answer:
        "Non. BizPilot peut repérer les renseignements manquants et aider à préparer une relance prudente. Il n’invente pas de prix, ne promet pas de disponibilité, ne perçoit pas de paiement et ne confirme pas de réservation.",
    },
    {
      question: "BizPilot est-il réservé aux entreprises d’entretien?",
      answer:
        "Le cœur du produit est conçu pour les entreprises de services locales. L’entretien est le premier modèle complet, la première démo et le premier marché du pilote fondateur. Les autres modèles de services demeurent dans la feuille de route jusqu’à la validation du flux d’entretien.",
    },
    {
      question:
        "Que se passe-t-il après l’envoi du formulaire par le client?",
      answer:
        "La demande devient une fiche organisée, les renseignements manquants sont signalés et un résumé ainsi qu’un brouillon assistés par l’IA peuvent être préparés pour la validation du propriétaire.",
    },
    {
      question:
        "BizPilot est-il un CRM, un outil de réservation ou un système de facturation?",
      answer:
        "Non. BizPilot intervient avant ces systèmes. Il aide à transformer une demande vague en prochaine action claire et vérifiable, sans chercher à remplacer un CRM complet, un calendrier, une plateforme de réservation ou un système de facturation.",
    },
  ] as const;

  return {
    home: {
      meta: {
        title:
          "Espace intelligent de demandes client et de réponses | BizPilot AI",
        description:
          "BizPilot aide les entreprises de services à recueillir les demandes avec un lien intelligent, à organiser les renseignements manquants et à préparer des brouillons assistés par l’IA que le propriétaire valide, en commençant par les entreprises d’entretien.",
      },
      nav,
      hero: {
        badge: "Demandes client intelligentes + réponses validées",
        title:
          "Transformez les demandes dispersées en réponses claires, prêtes à vérifier.",
        body:
          "BizPilot donne aux entreprises de services un lien intelligent, organise chaque demande, montre ce qui manque et prépare un brouillon assisté par l’IA que le propriétaire vérifie et envoie — en commençant par les entreprises d’entretien.",
        primaryCta: "Voir le flux d’entretien",
        secondaryCta: "Demander l’accès au pilote fondateur",
        note:
          "Produit actuel : lien intelligent, espace de demandes organisé, brouillons assistés par l’IA et validation manuelle du propriétaire. Les intégrations directes demeurent dans la feuille de route.",
        placements: [
          "Bouton du site Web",
          "Fiche d’établissement Google",
          "Bio Instagram ou réponse enregistrée",
          "Signature courriel",
        ],
        proofs: [
          { label: "Collecte", value: "Un seul lien clair" },
          {
            label: "Clarté",
            value: "Renseignements manquants visibles",
          },
          { label: "Contrôle", value: "Rien ne part sans vous" },
        ],
        workspace: {
          title: "Espace de demande client",
          intakeLabel: "Nouvelle demande par lien intelligent",
          customer: "Maria — Entretien de déménagement",
          status: "Réponse requise avant vendredi",
          missingLabel: "BizPilot a repéré ce qui manque",
          fields: [
            { label: "Propriété", value: "Superficie" },
            {
              label: "Portée",
              value: "Intérieur des électroménagers",
            },
            {
              label: "Accès",
              value: "Stationnement ou consignes pour la clé",
            },
            {
              label: "Horaire",
              value: "Plage d’arrivée souhaitée",
            },
          ],
          replyLabel: "Brouillon assisté par l’IA prêt à vérifier",
          draft:
            "Bonjour Maria, merci de nous avoir écrit. Pouvez-vous confirmer la superficie, les électroménagers à nettoyer, les consignes d’accès et l’heure souhaitée afin que je puisse préparer une soumission exacte?",
          actions: [
            "Vérifier",
            "Modifier",
            "Copier",
            "Envoyer manuellement",
          ],
        },
      },
      statement: {
        title:
          "Vos clients n’ont pas besoin d’une autre application. Ils ont besoin d’une façon claire de demander — et d’une réponse rapide et exacte.",
        body:
          "BizPilot crée ce parcours sans prétendre que toutes les boîtes de réception sont déjà connectées. Partagez un seul lien là où les clients vous trouvent, puis validez chaque réponse avant son envoi.",
      },
      problem: {
        eyebrow: "La véritable fuite",
        title:
          "La demande a de la valeur — mais elle est souvent incomplète, dispersée et facile à retarder.",
        body:
          "Les propriétaires sont sur les chantiers, sur la route, avec leur équipe ou avec leurs clients actuels. Le problème n’est pas le manque de messages; c’est le travail nécessaire pour transformer une demande vague en prochaine réponse responsable.",
        cards: [
          {
            title: "Demandes vagues",
            body:
              "Le client demande un prix sans fournir la portée, le lieu, l’horaire, l’accès ou les détails du service nécessaires pour répondre de façon responsable.",
            badge: "Contexte manquant",
            tone: "gold",
          },
          {
            title: "Points d’entrée dispersés",
            body:
              "Le site Web, la fiche Google, les profils sociaux, les réponses enregistrées et le courriel peuvent mener vers des parcours différents ou peu clairs.",
            badge: "Collecte incohérente",
            tone: "red",
          },
          {
            title: "Préparation manuelle lente",
            body:
              "Même après avoir vu la demande, le propriétaire doit encore l’interpréter, poser les bonnes questions et rédiger la première réponse.",
            badge: "Prochaine action retardée",
            tone: "blue",
          },
        ],
      },
      flow: {
        eyebrow: "Un flux honnête",
        title:
          "De la demande client à la réponse approuvée par le propriétaire.",
        body:
          "Chaque étape remplit un seul rôle. Aucun prix inventé, aucune réservation automatique et aucun message envoyé sans validation humaine.",
        steps: [
          {
            badge: "01",
            title: "Partager",
            body:
              "Placez un seul lien intelligent sur les pages et canaux que vos clients utilisent déjà.",
          },
          {
            badge: "02",
            title: "Recueillir",
            body:
              "Utilisez un formulaire adapté au service pour obtenir les renseignements nécessaires à une réponse utile.",
          },
          {
            badge: "03",
            title: "Organiser",
            body:
              "Transformez la demande en fiche claire avec la source, le service, l’horaire et les renseignements manquants.",
          },
          {
            badge: "04",
            title: "Préparer",
            body:
              "Générez un résumé et un brouillon assistés par l’IA dans le contexte approuvé de l’entreprise.",
          },
          {
            badge: "05",
            title: "Approuver",
            body:
              "Vérifiez, modifiez, copiez et envoyez manuellement la réponse dans le véritable canal du client.",
          },
        ],
      },
      control: {
        eyebrow: "Une limite claire pour l’IA",
        title: "L’IA aide au travail. Le propriétaire garde la décision.",
        body:
          "BizPilot repose sur la validation humaine, des limites explicites et une solution de repli manuelle toujours disponible.",
        steps: [
          {
            title: "L’IA lit",
            body:
              "Elle résume uniquement les renseignements disponibles dans la demande et le contexte d’entreprise approuvé.",
            tone: "blue",
          },
          {
            title: "L’IA prépare",
            body:
              "Elle propose une réponse ou une question de suivi sans inventer un prix ni une promesse.",
            tone: "teal",
          },
          {
            title: "Vous approuvez",
            body:
              "Le propriétaire peut modifier, refuser ou copier le brouillon. Aucun envoi automatique n’est effectué dans le pilote actuel.",
            tone: "gold",
          },
          {
            title: "Le client reçoit",
            body:
              "Le message final est envoyé manuellement dans le véritable canal de communication de l’entreprise.",
            tone: "neutral",
          },
        ],
      },
      day: {
        eyebrow: "Un rythme de travail plus calme",
        title:
          "Une journée avec BizPilot commence par la clarté, pas par une autre boîte de réception.",
        body:
          "Le produit ne promet pas des réservations automatiques. Il rend la prochaine action responsable plus facile à voir et à accomplir.",
        moments: [
          {
            badge: "8 h",
            title: "Les nouvelles demandes sont visibles",
            body:
              "Les demandes provenant du lien intelligent sont organisées dans un seul espace pour le propriétaire.",
          },
          {
            badge: "9 h",
            title: "Les renseignements manquants sont clairs",
            body:
              "Le propriétaire voit quelles demandes exigent plus de détails sur la portée, l’horaire, l’accès ou le service avant une soumission.",
          },
          {
            badge: "10 h",
            title: "Les brouillons sont prêts à vérifier",
            body:
              "Les réponses assistées par l’IA donnent un point de départ utile sans rien envoyer automatiquement.",
          },
          {
            badge: "Ensuite",
            title: "Le suivi reste visible",
            body:
              "La prochaine intervention manuelle du propriétaire reste visible au lieu de dépendre de sa mémoire.",
          },
        ],
      },
      industries: {
        eyebrow: "Cœur universel, lancement ciblé",
        title:
          "Conçu pour plusieurs entreprises de services — validé d’abord avec l’entretien.",
        body:
          "Seuls le modèle et la démo d’entretien sont présentés comme prêts pour le pilote. Les autres secteurs sont explicitement des modèles de la feuille de route, et non des fonctions actives.",
        cards: [
          {
            badge: "Pilote fondateur",
            title: "Entretien",
            body:
              "Entretien résidentiel, grand ménage, emménagement ou déménagement, bureaux, location courte durée et après-construction.",
            tone: "teal",
          },
          {
            badge: "Modèle de la feuille de route",
            title: "CVAC + plomberie",
            body:
              "Type de service, urgence, contexte de la propriété, accès, détails du problème et horaire souhaité.",
            tone: "neutral",
          },
          {
            badge: "Modèle de la feuille de route",
            title: "Aménagement paysager + peinture",
            body:
              "Portée du projet, photos, mesures, préférences de matériaux, horaire et accès au site.",
            tone: "neutral",
          },
          {
            badge: "Modèle de la feuille de route",
            title: "Autres services locaux",
            body:
              "Une base de collecte configurable pour de futures catégories de services validées.",
            tone: "neutral",
          },
        ],
      },
      features: {
        eyebrow: "Ce que le produit fait aujourd’hui",
        title:
          "Un espace ciblé entre une demande confuse et votre prochain système.",
        body:
          "BizPilot n’est pas un CRM complet ni un moteur de réservation. Il traite le moment à forte friction de la collecte et de la réponse, avant que ces outils deviennent utiles.",
        cards: [
          {
            title: "Lien intelligent",
            body:
              "Un parcours mobile clair que vous pouvez partager là où les clients découvrent déjà l’entreprise.",
          },
          {
            title: "Formulaires adaptés au service",
            body:
              "Des champs et modèles modifiables qui recueillent les détails nécessaires au service choisi.",
          },
          {
            title: "Fiche de demande organisée",
            body:
              "Le client, le service, la source, l’horaire, les détails et la prochaine action dans une seule vue.",
          },
          {
            title: "Détection des renseignements manquants",
            body:
              "Une liste claire de ce qu’il faut encore obtenir avant une soumission ou une prochaine réponse responsable.",
          },
          {
            title: "Résumé et brouillon assistés par l’IA",
            body:
              "Une aide sur demande qui prépare un point de départ utile dans des limites approuvées.",
          },
          {
            title: "Suivi manuel visible",
            body:
              "La prochaine action du propriétaire reste visible sans prétendre que le produit envoie ou réserve automatiquement.",
          },
        ],
      },
      finalCta: {
        title:
          "Voyez à quel point votre prochaine demande client pourrait être plus claire.",
        body:
          "Le pilote fondateur commence avec un flux de collecte pour l’entretien, un espace pour le propriétaire et un processus de réponse contrôlé.",
        primary: "Voir la démo d’entretien",
        secondary: "Demander l’accès au pilote fondateur",
        assurances: [
          "Aucune carte de crédit à la demande",
          "Aucun envoi automatique",
          "Aucun prix inventé",
          "Configuration dirigée par le fondateur",
        ],
      },
    },
    features: {
      meta: {
        title: "Produit | BizPilot AI",
        description:
          "Découvrez le lien intelligent, les formulaires adaptés, l’espace organisé, la détection des renseignements manquants, les brouillons assistés par l’IA et la validation manuelle de BizPilot.",
      },
      badge: "Produit actuel",
      title:
        "Tout ce qu’il faut pour transformer une demande vague en prochaine réponse claire.",
      body:
        "BizPilot cible l’écart entre la demande et la réponse, avant le CRM, la réservation, la facturation ou l’automatisation. Le produit actuel est volontairement ciblé, contrôlé par le propriétaire et prêt pour un pilote auprès des entreprises d’entretien.",
      primaryCta: "Voir la démo du flux",
      secondaryCta: "Examiner les limites de confiance",
      signals: [
        { label: "Collecter", value: "Un lien intelligent" },
        {
          label: "Comprendre",
          value: "Demande structurée + renseignements manquants",
        },
        {
          label: "Répondre",
          value: "Brouillon IA validé par le propriétaire",
        },
      ],
      sections: [
        {
          eyebrow: "Collecter",
          title: "Donnez à chaque client un parcours de demande clair.",
          body:
            "Partagez le lien intelligent sur votre site Web, votre fiche d’établissement Google, vos profils sociaux, vos réponses enregistrées ou vos signatures courriel.",
          cards: [
            {
              title: "Lien intelligent",
              body:
                "Un parcours direct, à votre image et adapté au mobile pour les demandes client.",
            },
            {
              title: "Attribution de la source",
              body:
                "Conservez un contexte simple sur l’emplacement du lien sans insérer de renseignements personnels dans les balises de suivi.",
            },
            {
              title: "Champs adaptés au service",
              body:
                "Posez les bonnes questions pour le service choisi au lieu d’utiliser un seul formulaire de contact générique.",
            },
          ],
        },
        {
          eyebrow: "Organiser",
          title: "Rendez la demande utile avant la réponse du propriétaire.",
          cards: [
            {
              title: "Espace de demandes",
              body:
                "Voyez ensemble le client, le service, la source, l’horaire, les détails et la prochaine action.",
            },
            {
              title: "Détection des renseignements manquants",
              body:
                "Faites ressortir ce qui manque avant de préparer une soumission ou de faire une promesse.",
            },
            {
              title: "Suivi manuel visible",
              body:
                "Gardez la prochaine intervention humaine visible au lieu de dépendre de la mémoire.",
            },
          ],
        },
        {
          eyebrow: "Assister",
          title:
            "Utilisez l’IA comme point de départ préparé — jamais comme opérateur autonome.",
          cards: [
            {
              title: "Résumé de la demande",
              body:
                "Condensez la demande client dans le contexte dont le propriétaire a besoin.",
            },
            {
              title: "Brouillon de réponse",
              body:
                "Préparez une réponse prudente ou une question de suivi pour la validation du propriétaire.",
            },
            {
              title: "Limite d’approbation",
              body:
                "Vérifiez, modifiez, copiez et envoyez manuellement. Aucun envoi automatique dans le produit actuel.",
            },
          ],
        },
      ],
      notice: {
        badge: "Feuille de route — non actif",
        title:
          "Les intégrations directes aux boîtes de réception ne font pas partie des fonctions actives.",
        body:
          "Les connexions à Gmail, WhatsApp, Instagram, Messenger et aux SMS sont des éléments de la feuille de route qui pourront être explorés après validation. Aujourd’hui, le flux honnête commence par le lien intelligent.",
      },
      finalCta: {
        title:
          "Voyez le flux ciblé avant de comparer des listes de fonctions.",
        body:
          "La démo d’entretien montre le parcours actuel complet, de la demande à la réponse validée par le propriétaire.",
        primary: "Voir la démo",
        secondary: "Comparer BizPilot",
      },
    },
    demo: {
      meta: {
        title: "Démo du flux d’entretien | BizPilot AI",
        description:
          "Voyez le flux d’entretien actuel de BizPilot : lien intelligent, demande organisée, renseignements manquants, brouillon assisté par l’IA et validation manuelle du propriétaire.",
      },
      badge: "Démo d’entretien actuelle",
      title:
        "Voyez une demande client devenir une prochaine réponse prudente et vérifiable.",
      body:
        "La démo reste volontairement concrète : un client soumet une demande d’entretien, BizPilot l’organise, fait ressortir les renseignements manquants et prépare un brouillon que le propriétaire vérifie et envoie manuellement.",
      primaryCta: "Demander l’accès au pilote fondateur",
      secondaryCta: "Explorer le produit",
      signals: [
        { label: "Entrée", value: "Lien de demande d’entretien" },
        {
          label: "Traitement",
          value: "Détails structurés + champs manquants",
        },
        {
          label: "Résultat",
          value: "Brouillon à valider par le propriétaire",
        },
      ],
      sections: [
        {
          eyebrow: "Étape 1",
          title:
            "Le client utilise un seul lien clair pour sa demande d’entretien.",
          cards: [
            {
              title: "Service",
              body: "Entretien de déménagement",
            },
            { title: "Horaire", body: "Requis avant vendredi" },
            {
              title: "Note initiale",
              body:
                "Le client demande une soumission, mais ne précise pas toute la portée ni les consignes d’accès.",
            },
          ],
        },
        {
          eyebrow: "Étape 2",
          title: "BizPilot transforme l’envoi en demande organisée.",
          cards: [
            {
              title: "Renseignements connus",
              body:
                "Le client, le service, l’échéance, le parcours de contact et la demande originale.",
            },
            {
              title: "Renseignements manquants",
              body:
                "La superficie, les électroménagers, le stationnement ou la clé et l’heure souhaitée.",
            },
            {
              title: "Prochaine action",
              body:
                "Demander une seule fois les détails manquants avant de préparer une soumission.",
            },
          ],
        },
        {
          eyebrow: "Étape 3",
          title:
            "L’IA prépare une réponse prudente pour le propriétaire.",
          cards: [
            {
              title: "Résumé",
              body:
                "Une lecture courte et factuelle de la demande et de son urgence.",
            },
            {
              title: "Brouillon",
              body:
                "Une relance polie qui demande exactement les renseignements manquants.",
            },
            {
              title: "Action du propriétaire",
              body:
                "Vérifier, modifier, copier et envoyer manuellement dans le véritable canal du client.",
            },
          ],
        },
      ],
      notice: {
        badge: "Limite de la démo",
        title:
          "Il ne s’agit pas d’une démo de réservation ou de messagerie automatique.",
        body:
          "La démo n’invente pas de prix, ne confirme pas de disponibilité, ne perçoit pas de paiement, ne réserve pas un travail et n’envoie pas automatiquement de message au client.",
      },
      finalCta: {
        title:
          "Utilisez d’abord ce flux avec un véritable service d’entretien.",
        body:
          "La configuration dirigée par le fondateur garde le premier pilote assez ciblé pour être mesuré et amélioré.",
        primary: "Demander l’accès au pilote",
        secondary: "Voir les tarifs du pilote",
      },
    },
    pricing: {
      meta: {
        title: "Tarifs du pilote fondateur | BizPilot AI",
        description:
          "Consultez les tarifs progressifs du pilote pour le flux d’entretien actuel, avec configuration et facturation manuelles après approbation.",
      },
      badge: "Conditions du pilote fondateur",
      title:
        "Des tarifs simples pour un seul flux contrôlé de demandes client.",
      body:
        "Les tarifs sont progressifs parce que le produit est encore validé auprès d’entreprises d’entretien. Il n’y a aucun paiement autonome ni aucune promesse de facturation automatique.",
      primaryCta: "Demander l’accès au pilote fondateur",
      secondaryCta: "Examiner les limites du produit",
      signals: [
        { label: "Configuration", value: "Dirigée par le fondateur" },
        { label: "Facturation", value: "Manuelle après approbation" },
        {
          label: "Portée",
          value: "Collecte + réponses validées par le propriétaire",
        },
      ],
      sections: [
        {
          eyebrow: "Entreprises 1 à 5",
          title: "Pilote fondateur avec rétroaction",
          cards: [
            {
              badge: "Rétroaction requise",
              title: "0 $ de frais de configuration",
              price: "Validation dirigée par le fondateur",
              body:
                "Pour les premières entreprises d’entretien approuvées qui souhaitent tester un flux et fournir une rétroaction structurée.",
              points: [
                "Lien de demande d’entretien",
                "Espace de demandes",
                "Résumé et brouillon assistés par l’IA",
                "Copie et envoi manuels",
                "Rétroaction après 30 et 60 jours",
              ],
              cta: "Demander l’accès au pilote fondateur",
              tone: "teal",
            },
          ],
        },
        {
          eyebrow: "Après la cohorte de rétroaction",
          title: "Pilotes Départ et Pro",
          cards: [
            {
              badge: "Pilote Départ",
              title: "149 $ de configuration + 49 $/mois",
              price: "Facturation manuelle après approbation",
              body:
                "Un flux ciblé et à votre image pour la collecte et la récupération des demandes, avec l’accompagnement du fondateur.",
              points: [
                "Page publique de demande intelligente",
                "Espace de récupération des demandes",
                "Brouillons assistés par l’IA que vous validez",
                "Suivi manuel visible",
                "Accompagnement à la mise en route",
              ],
              cta: "Demander le pilote Départ",
              tone: "blue",
            },
            {
              badge: "Pilote Pro",
              title: "199 $ de configuration + 79 $/mois",
              price: "Facturation manuelle après approbation",
              body:
                "Le même flux contrôlé avec une image de marque renforcée, un ajustement du style de réponse et une mise en route prioritaire.",
              points: [
                "Tout ce qui est inclus dans Départ",
                "Page de demande à l’image de l’entreprise",
                "Ajustement du style de réponse et de la FAQ",
                "Ajustement des brouillons de suivi",
                "Mise en route prioritaire",
              ],
              cta: "Demander le pilote Pro",
              tone: "gold",
            },
          ],
        },
      ],
      notice: {
        badge: "Avant tout pilote payant",
        title:
          "La portée, le soutien, l’annulation, les remboursements et le mode de paiement sont confirmés d’abord.",
        body:
          "Le paiement, s’il est approuvé, utilise une facture manuelle ou un lien de paiement Stripe. BizPilot n’offre actuellement aucune facturation automatisée dans l’application.",
      },
      finalCta: {
        title: "Commencez par la compatibilité, pas par le paiement.",
        body:
          "Le fondateur examine l’entreprise, son parcours de collecte actuel et la portée du pilote avant toute configuration ou tout paiement.",
        primary: "Demander l’accès au pilote",
        secondary: "Lire la FAQ",
      },
    },
    pilot: {
      meta: {
        title:
          "Pilote fondateur pour entreprises d’entretien | BizPilot AI",
        description:
          "Demandez l’accès au pilote fondateur de BizPilot pour les entreprises d’entretien et testez un flux de collecte intelligente, d’organisation des demandes et de réponses validées par le propriétaire.",
      },
      badge: "Entreprises d’entretien d’abord",
      title:
        "Validez un flux de demandes client avant d’élargir le produit.",
      body:
        "Le pilote fondateur s’adresse aux entreprises d’entretien qui reçoivent actuellement des demandes de soumission incomplètes et qui souhaitent tester un flux contrôlé, axé sur le travail manuel.",
      primaryCta: "Commencer la demande de pilote",
      secondaryCta: "Voir les tarifs",
      signals: [
        { label: "Marché", value: "Entreprises d’entretien" },
        {
          label: "Flux",
          value: "Un parcours de demande + réponse",
        },
        {
          label: "Contrôle",
          value: "Le propriétaire valide chaque brouillon",
        },
      ],
      sections: [
        {
          eyebrow: "Bonne compatibilité",
          title: "À qui s’adresse le premier pilote?",
          cards: [
            {
              title: "Les demandes arrivent incomplètes",
              body:
                "Les clients demandent un prix sans fournir assez de détails sur le service, la portée, l’accès ou l’horaire.",
            },
            {
              title: "Le propriétaire répond manuellement",
              body:
                "L’entreprise veut un meilleur point de départ, et non un robot autonome qui communique avec les clients.",
            },
            {
              title: "Une rétroaction est possible",
              body:
                "Le propriétaire peut examiner la configuration, utiliser le flux et transmettre une rétroaction précise aux moments convenus.",
            },
          ],
        },
        {
          eyebrow: "Processus",
          title: "Que se passe-t-il après la demande?",
          cards: [
            {
              badge: "01",
              title: "Évaluation de la compatibilité",
              body:
                "Le fondateur examine le parcours de soumission actuel, les services et les limites du pilote.",
            },
            {
              badge: "02",
              title: "Configuration manuelle",
              body:
                "Un modèle d’entretien, un lien intelligent et un espace pour le propriétaire sont configurés.",
            },
            {
              badge: "03",
              title: "Utilisation contrôlée",
              body:
                "L’entreprise valide chaque brouillon assisté par l’IA et envoie manuellement les messages aux clients.",
            },
            {
              badge: "04",
              title: "Rétroaction",
              body:
                "Les résultats, les irritants et les changements au produit sont examinés avant tout déploiement élargi.",
            },
          ],
        },
      ],
      notice: {
        badge: "Porte d’approbation",
        title:
          "L’envoi d’une demande ne crée pas un compte payant et n’autorise aucun changement en production.",
        body:
          "Les véritables données client, le paiement et la mise en route commencent seulement après l’approbation explicite de la compatibilité, de la portée, de la confidentialité, du soutien et du fonctionnement.",
      },
      finalCta: {
        title:
          "Présentez votre flux actuel, pas un processus futur parfait.",
        body:
          "Le pilote sert à comprendre où les demandes client deviennent lentes, incomplètes ou difficiles à traiter.",
        primary: "Commencer la demande",
        secondary: "Voir la démo",
      },
    },
    trust: {
      meta: {
        title: "Confiance et contrôle humain | BizPilot AI",
        description:
          "Découvrez les principes de BizPilot pour la validation humaine, la minimisation des données, la transparence de l’IA, les limites du produit et l’étiquetage de la feuille de route.",
      },
      badge: "La confiance par les limites du produit",
      title:
        "La promesse la plus sûre est celle que le produit peut prouver aujourd’hui.",
      body:
        "BizPilot réduit la friction liée aux réponses sans cacher l’incertitude, inventer des décisions d’entreprise ou présenter des intégrations de la feuille de route comme des fonctions actives.",
      primaryCta: "Examiner le flux",
      secondaryCta: "Lire l’avis de confidentialité",
      signals: [
        {
          label: "Contrôle humain",
          value: "Chaque brouillon doit être validé",
        },
        {
          label: "Portée honnête",
          value: "La feuille de route est clairement identifiée",
        },
        {
          label: "Solution de repli",
          value: "Le flux manuel demeure disponible",
        },
      ],
      sections: [
        {
          eyebrow: "Supervision humaine",
          title: "L’IA prépare; le propriétaire décide.",
          cards: [
            {
              title: "Aucun envoi automatique",
              body:
                "Le pilote actuel n’envoie pas de messages aux clients au nom du propriétaire.",
            },
            {
              title: "Aucun prix inventé",
              body:
                "L’assistant demande les détails manquants au lieu de créer un prix, un rabais ou une promesse de disponibilité.",
            },
            {
              title: "Résultat modifiable",
              body:
                "Le propriétaire peut modifier, refuser ou ignorer chaque brouillon assisté par l’IA.",
            },
          ],
        },
        {
          eyebrow: "Discipline des données et du produit",
          title:
            "Recueillez ce dont le flux a besoin — et nommez clairement ce que le produit ne fait pas.",
          cards: [
            {
              title: "Collecte limitée à la finalité",
              body:
                "Les formulaires doivent demander uniquement les renseignements sur le client et le service nécessaires au flux de soumission.",
            },
            {
              title: "Étiquettes claires pour la feuille de route",
              body:
                "Les intégrations directes, les autres secteurs, la réservation et l’automatisation demeurent clairement présentés comme des travaux futurs.",
            },
            {
              title: "Aucune prétention de CRM complet",
              body:
                "BizPilot résout l’écart entre la collecte et la réponse sans prétendre remplacer tous les systèmes de l’entreprise.",
            },
          ],
        },
      ],
      notice: {
        badge: "Porte de production",
        title:
          "La validation locale n’autorise pas les changements dans une base de données de production gérée.",
        body:
          "La sauvegarde, la dérive des migrations, la posture de sécurité en production et la capacité de restauration doivent être vérifiées par les portes de publication existantes contrôlées par le propriétaire avant toute modification en production.",
      },
      finalCta: {
        title:
          "La confiance commence avant que le client envoie quoi que ce soit.",
        body:
          "Examinez le flux exact, le parcours des données et les contrôles manuels avant de rejoindre le pilote.",
        primary: "Voir la démo",
        secondary: "Lire la FAQ",
      },
    },
    comparison: {
      meta: {
        title:
          "BizPilot comparé aux formulaires, CRM et outils de réservation",
        description:
          "Comparez le flux de collecte intelligente et de réponses validées de BizPilot avec les formulaires génériques, les boîtes manuelles, les CRM complets et les plateformes de réservation.",
      },
      badge: "Avant le CRM. Après les demandes confuses.",
      title:
        "Utilisez BizPilot pour l’écart entre la demande et la réponse — pas pour remplacer tous vos outils.",
      body:
        "Un formulaire recueille des champs. Un CRM gère un pipeline plus large. Un logiciel de réservation traite le travail confirmé. BizPilot cible le moment où la demande est encore vague et où le propriétaire a besoin d’une prochaine réponse claire.",
      primaryCta: "Voir le flux",
      secondaryCta: "Explorer le produit",
      signals: [
        { label: "Formulaire", value: "Recueille des champs" },
        {
          label: "BizPilot",
          value: "Organise + prépare la prochaine réponse",
        },
        {
          label: "CRM ou réservation",
          value: "Gère les étapes ultérieures",
        },
      ],
      sections: [
        {
          eyebrow: "Choisir selon le travail à accomplir",
          title: "Chaque catégorie résout un problème différent.",
          cards: [
            {
              title: "Générateur de formulaires générique",
              body:
                "Utile lorsque la collecte de champs de base suffit. Le propriétaire doit encore interpréter, prioriser et rédiger la réponse.",
            },
            {
              title: "Boîtes de réception et feuilles de calcul",
              body:
                "Fonctionnent à très faible volume, mais les demandes incomplètes et les prochaines actions sont faciles à perdre pendant les journées chargées.",
            },
            {
              title: "BizPilot",
              body:
                "Utile lorsque le problème immédiat consiste à transformer une demande de service incomplète en prochaine réponse organisée et validée par le propriétaire.",
            },
            {
              title: "CRM complet",
              body:
                "Utile pour les équipes qui ont un pipeline défini, des étapes de vente, des permissions et une gestion plus large du cycle client.",
            },
            {
              title: "Plateforme de réservation ou de facturation",
              body:
                "Utile lorsque la portée, le prix, la disponibilité et l’intention du client sont assez clairs pour confirmer le travail.",
            },
          ],
        },
      ],
      notice: {
        badge: "Limite du produit",
        title:
          "BizPilot ne réserve pas automatiquement, ne facture pas, ne perçoit pas de paiement et ne remplace pas un CRM complet.",
        body:
          "Sa valeur se situe dans le moment qui précède ces systèmes : collecte, clarté, préparation de la réponse et suivi manuel visible.",
      },
      finalCta: {
        title:
          "Comparez le flux, pas la longueur de la liste de fonctions.",
        body:
          "Voyez si la démo d’entretien actuelle résout exactement le problème de collecte de votre entreprise.",
        primary: "Voir la démo",
        secondary: "Demander l’accès au pilote",
      },
    },
    cleaning: {
      meta: {
        title:
          "Collecte client et réponses de soumission pour l’entretien | BizPilot AI",
        description:
          "Le premier flux complet de BizPilot aide les entreprises d’entretien à recueillir de meilleures demandes, à repérer les renseignements manquants et à préparer des réponses validées par le propriétaire.",
      },
      badge: "Premier secteur complet",
      title:
        "Un flux intelligent construit autour des vraies questions de soumission en entretien.",
      body:
        "L’entretien est le premier marché parce que les demandes sont fréquentes, urgentes et souvent incomplètes. Le modèle recueille des détails propres au service sans prétendre qu’un formulaire peut calculer automatiquement chaque soumission.",
      primaryCta: "Voir la démo d’entretien",
      secondaryCta: "Demander l’accès au pilote fondateur",
      signals: [
        {
          label: "Services",
          value: "Six types de demandes prêts pour le pilote",
        },
        {
          label: "Résultat",
          value: "Renseignements manquants + brouillon",
        },
        {
          label: "Contrôle",
          value: "Le propriétaire fixe le prix et envoie",
        },
      ],
      sections: [
        {
          eyebrow: "Services prêts pour le pilote",
          title:
            "Une famille de modèles pour six demandes d’entretien courantes.",
          cards: [
            {
              title: "Entretien résidentiel",
              body:
                "Superficie, pièces, salles de bain, fréquence, priorités, animaux, stationnement et accès.",
            },
            {
              title: "Grand ménage",
              body:
                "État de la propriété, zones prioritaires, électroménagers, accumulation, photos et horaire.",
            },
            {
              title: "Emménagement ou déménagement",
              body:
                "Échéance, superficie, électroménagers et armoires, accès et moment de l’inspection.",
            },
            {
              title: "Entretien de bureaux",
              body:
                "Superficie, fréquence, horaire, salles de bain, cuisines, fournitures, clés et règles de l’immeuble.",
            },
            {
              title: "Rotation de location courte durée",
              body:
                "Heures de départ et d’arrivée, chambres, salles de bain, literie, réapprovisionnement, lessive et consignes d’entrée.",
            },
            {
              title: "Après-construction",
              body:
                "Superficie du chantier, poussière et débris, planchers ou vitres, échéance, accès et contraintes de sécurité.",
            },
          ],
        },
        {
          eyebrow: "Ce qui demeure humain",
          title:
            "Le formulaire améliore la demande. Le propriétaire prend toujours la décision d’entreprise.",
          cards: [
            {
              title: "Examen de la portée",
              body:
                "Le propriétaire décide si les renseignements soumis suffisent pour une soumission, une visite ou une relance.",
            },
            {
              title: "Décision sur le prix",
              body:
                "BizPilot n’invente pas les prix, les rabais, le temps de l’équipe ou la disponibilité.",
            },
            {
              title: "Réponse finale",
              body:
                "Le propriétaire vérifie et envoie manuellement le message dans le véritable canal du client.",
            },
          ],
        },
      ],
      notice: {
        badge: "Règle d’expansion",
        title:
          "L’entretien n’est pas un simple exemple décoratif; c’est la porte de validation.",
        body:
          "Les autres modèles d’entreprises de services ne doivent pas être présentés comme actifs avant que ce flux ait démontré son utilité, sa sécurité et sa viabilité opérationnelle.",
      },
      finalCta: {
        title:
          "Commencez avec un service d’entretien et un véritable parcours de demande.",
        body:
          "Le pilote fondateur sert à améliorer le flux avant d’élargir la catégorie.",
        primary: "Demander l’accès au pilote",
        secondary: "Voir les tarifs",
      },
    },
    faq: {
      meta: {
        title: "FAQ BizPilot | Produit, IA, pilote et feuille de route",
        description:
          "Obtenez des réponses claires sur le lien intelligent de BizPilot, les brouillons assistés par l’IA, le pilote d’entretien, les intégrations de la feuille de route, les tarifs et les limites du produit.",
      },
      badge: "Réponses directes",
      title:
        "Sachez exactement ce que BizPilot fait aujourd’hui — et ce qui demeure dans la feuille de route.",
      body:
        "Le produit est plus facile à comprendre et à faire confiance lorsque le flux actuel, les contrôles humains et les projets futurs sont clairement séparés.",
      primaryCta: "Voir la démo",
      secondaryCta: "Demander l’accès au pilote",
      signals: [
        {
          label: "Actuel",
          value: "Lien intelligent + espace organisé",
        },
        { label: "IA", value: "Aide au brouillon seulement" },
        {
          label: "Feuille de route",
          value: "Intégrations + autres secteurs",
        },
      ],
      sections: [
        {
          eyebrow: "Produit et IA",
          title: "Les questions essentielles avant de rejoindre le pilote.",
          cards: faqItems.map((item) => ({
            title: item.question,
            body: item.answer,
          })),
        },
      ],
      finalCta: {
        title: "Voyez les limites actuelles du produit en action.",
        body:
          "La démo d’entretien est la façon la plus claire de comprendre ce qui est réellement offert aujourd’hui.",
        primary: "Voir la démo",
        secondary: "Examiner la confiance",
      },
      items: faqItems,
    },
  };
}
