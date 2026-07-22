/**
 * ============================================================
 * File: lib/i18n/dashboard-interface.ts
 * Project: BizPilot AI
 * Description: Dashboard-only interface language definitions and compact UI copy.
 * Role: Keeps protected-dashboard language, RTL direction, and Premium Operations wording separate from public intake and business-language content.
 * Related:
 * - lib/i18n/language.ts
 * - components/dashboard/dashboard-shell.tsx
 * - components/dashboard/dashboard-topbar.tsx
 * - app/(dashboard)/dashboard/operations/page.tsx
 * - components/dashboard/premium-operations-workspace.tsx
 * - server/services/premium-operations.service.ts
 * Author: MoOoH
 * Created: 2026-07-21
 * Last Updated: 2026-07-22
 * Change Log:
 * - 2026-07-21: Created the isolated five-language dashboard interface contract with safe cookie resolution and Premium Operations copy.
 * - 2026-07-21: Kept Premium Operations replies strictly draft-only and manually copied after approval.
 * - 2026-07-21: Completed localized Premium Operations labels for all protected interface languages.
 * - 2026-07-21: Moved customer-facing bulk-reply defaults out of dashboard-interface copy and added localized Premium Operations route feedback.
 * - 2026-07-22: Added localized filtering, status, timezone, conflict, and stale-draft feedback for the hardened workspace.
 * - 2026-07-22: Made the bounded active-request result notice explicit in every dashboard language.
 * ============================================================
 */

/**
 * These locale codes deliberately do not extend `SupportedLanguage` in
 * `lib/i18n/language.ts`. A dashboard visitor's interface preference must not
 * change the business language used for public intake, customer content, or AI.
 */
export type DashboardInterfaceLanguage = "en" | "fr-CA" | "fa" | "ar" | "es";

export type DashboardInterfaceTextDirection = "ltr" | "rtl";

export type DashboardInterfaceLanguageDefinition = Readonly<{
  code: DashboardInterfaceLanguage;
  label: string;
  nativeLabel: string;
  shortLabel: string;
  textDirection: DashboardInterfaceTextDirection;
}>;

export const DEFAULT_DASHBOARD_INTERFACE_LANGUAGE: DashboardInterfaceLanguage =
  "en";

export const DASHBOARD_INTERFACE_LANGUAGE_COOKIE =
  "bizpilot-dashboard-interface-language";

export const dashboardInterfaceLanguageDefinitions = {
  en: {
    code: "en",
    label: "English",
    nativeLabel: "English",
    shortLabel: "EN",
    textDirection: "ltr",
  },
  "fr-CA": {
    code: "fr-CA",
    label: "French (Canada)",
    nativeLabel: "Français (Canada)",
    shortLabel: "FR",
    textDirection: "ltr",
  },
  fa: {
    code: "fa",
    label: "Persian",
    nativeLabel: "فارسی",
    shortLabel: "FA",
    textDirection: "rtl",
  },
  ar: {
    code: "ar",
    label: "Arabic",
    nativeLabel: "العربية",
    shortLabel: "AR",
    textDirection: "rtl",
  },
  es: {
    code: "es",
    label: "Spanish",
    nativeLabel: "Español",
    shortLabel: "ES",
    textDirection: "ltr",
  },
} as const satisfies Record<
  DashboardInterfaceLanguage,
  DashboardInterfaceLanguageDefinition
>;

export const dashboardInterfaceLanguages = [
  "en",
  "fr-CA",
  "fa",
  "ar",
  "es",
] as const satisfies readonly DashboardInterfaceLanguage[];

export const dashboardInterfaceLanguageLabels: Readonly<
  Record<DashboardInterfaceLanguage, string>
> = {
  en: dashboardInterfaceLanguageDefinitions.en.label,
  "fr-CA": dashboardInterfaceLanguageDefinitions["fr-CA"].label,
  fa: dashboardInterfaceLanguageDefinitions.fa.label,
  ar: dashboardInterfaceLanguageDefinitions.ar.label,
  es: dashboardInterfaceLanguageDefinitions.es.label,
};

export const dashboardInterfaceLanguageNativeLabels: Readonly<
  Record<DashboardInterfaceLanguage, string>
> = {
  en: dashboardInterfaceLanguageDefinitions.en.nativeLabel,
  "fr-CA": dashboardInterfaceLanguageDefinitions["fr-CA"].nativeLabel,
  fa: dashboardInterfaceLanguageDefinitions.fa.nativeLabel,
  ar: dashboardInterfaceLanguageDefinitions.ar.nativeLabel,
  es: dashboardInterfaceLanguageDefinitions.es.nativeLabel,
};

export const dashboardInterfaceLanguageShortLabels: Readonly<
  Record<DashboardInterfaceLanguage, string>
> = {
  en: dashboardInterfaceLanguageDefinitions.en.shortLabel,
  "fr-CA": dashboardInterfaceLanguageDefinitions["fr-CA"].shortLabel,
  fa: dashboardInterfaceLanguageDefinitions.fa.shortLabel,
  ar: dashboardInterfaceLanguageDefinitions.ar.shortLabel,
  es: dashboardInterfaceLanguageDefinitions.es.shortLabel,
};

export function isDashboardInterfaceLanguage(
  value: unknown,
): value is DashboardInterfaceLanguage {
  return (
    typeof value === "string" &&
    dashboardInterfaceLanguages.includes(value as DashboardInterfaceLanguage)
  );
}

export function readDashboardInterfaceLanguage(
  value: unknown,
): DashboardInterfaceLanguage {
  return isDashboardInterfaceLanguage(value)
    ? value
    : DEFAULT_DASHBOARD_INTERFACE_LANGUAGE;
}

export function getDashboardInterfaceLanguageDefinition(
  language: unknown,
): DashboardInterfaceLanguageDefinition {
  return dashboardInterfaceLanguageDefinitions[
    readDashboardInterfaceLanguage(language)
  ];
}

export function getDashboardInterfaceTextDirection(
  language: unknown,
): DashboardInterfaceTextDirection {
  return getDashboardInterfaceLanguageDefinition(language).textDirection;
}

/**
 * Reads only the named dashboard cookie from a raw Cookie header. Malformed
 * percent encoding and unsupported values are ignored rather than surfacing a
 * request error or allowing an arbitrary locale into a protected page.
 */
export function parseDashboardInterfaceLanguageCookie(
  cookieHeader: string | null | undefined,
): DashboardInterfaceLanguage | null {
  if (
    typeof cookieHeader !== "string" ||
    cookieHeader.length === 0 ||
    cookieHeader.length > 8_192
  ) {
    return null;
  }

  for (const rawPart of cookieHeader.split(";")) {
    const separatorIndex = rawPart.indexOf("=");

    if (separatorIndex < 1) {
      continue;
    }

    const cookieName = rawPart.slice(0, separatorIndex).trim();

    if (cookieName !== DASHBOARD_INTERFACE_LANGUAGE_COOKIE) {
      continue;
    }

    const rawValue = rawPart.slice(separatorIndex + 1).trim();
    let value: string;

    try {
      value = decodeURIComponent(rawValue);
    } catch {
      continue;
    }

    if (isDashboardInterfaceLanguage(value)) {
      return value;
    }
  }

  return null;
}

export function resolveDashboardInterfaceLanguage(input?: Readonly<{
  cookieHeader?: string | null;
  cookieValue?: unknown;
}>): DashboardInterfaceLanguage {
  if (isDashboardInterfaceLanguage(input?.cookieValue)) {
    return input.cookieValue;
  }

  return (
    parseDashboardInterfaceLanguageCookie(input?.cookieHeader) ??
    DEFAULT_DASHBOARD_INTERFACE_LANGUAGE
  );
}

export type DashboardInterfaceCopy = Readonly<{
  shell: Readonly<{
    account: string;
    closeMenu: string;
    copyFailed: string;
    copyQuoteLink: string;
    copySuccess: string;
    dashboardLanguage: string;
    moreActions: string;
    openMenu: string;
    previewQuotePage: string;
    selectDashboardLanguage: string;
    signOut: string;
    skipToContent: string;
    theme: Readonly<{
      dark: string;
      label: string;
      light: string;
      system: string;
    }>;
    workspace: string;
  }>;
  nav: Readonly<{
    businessProfile: string;
    guide: string;
    groupCommand: string;
    groupControl: string;
    groupSetup: string;
    leads: string;
    overview: string;
    premiumOperations: string;
    quoteSetup: string;
    reports: string;
    settings: string;
    workspaceSubtitle: string;
  }>;
  common: Readonly<{
    approvalRequired: string;
    back: string;
    cancel: string;
    clear: string;
    close: string;
    create: string;
    delete: string;
    draft: string;
    edit: string;
    loading: string;
    noResults: string;
    optional: string;
    premiumAddOn: string;
    required: string;
    retry: string;
    save: string;
    search: string;
    selectAll: string;
    selectedCount: (count: number) => string;
    viewDetails: string;
  }>;
  premiumOperations: Readonly<{
    badge: string;
    description: string;
    lockedDescription: string;
    title: string;
    tabs: Readonly<{
      availability: string;
      bulkReply: string;
      prioritySearch: string;
    }>;
    prioritySearch: Readonly<{
      addRule: string;
      allRules: string;
      areaPlaceholder: string;
      areaTerms: string;
      availabilityCheckLimit: string;
      description: string;
      descriptionLabel: string;
      filters: Readonly<{
        allValues: string;
        location: string;
        requestedDate: string;
        requestedTime: string;
        service: string;
        status: string;
      }>;
      noMatchingLeads: string;
      leadDetailsNeedReview: string;
      priority: Readonly<{
        high: string;
        low: string;
        standard: string;
      }>;
      priorityRank: string;
      queryPlaceholder: string;
      resultCount: (count: number) => string;
      ruleName: string;
      rulesLabel: string;
      servicePlaceholder: string;
      serviceTerms: string;
      statusLabels: Readonly<
        Record<
          | "archived"
          | "booked"
          | "follow_up_needed"
          | "lost"
          | "new"
          | "replied"
          | "reviewed",
          string
        >
      >;
      title: string;
      unnamedRequest: string;
    }>;
    bulkReply: Readonly<{
      approvalNote: string;
      audienceLabel: string;
      createDraft: string;
      copied: string;
      copyDraft: string;
      copyFailed: string;
      description: string;
      draftLabel: string;
      draftTitle: string;
      manualCopyDescription: string;
      manualCopyLog: string;
      noEligibleRecipients: string;
      recipientCount: (count: number) => string;
      recordCopy: string;
      reviewDraft: string;
      reviewQueue: string;
      statusDraft: string;
      statusReviewed: string;
      title: string;
    }>;
    availability: Readonly<{
      addAvailability: string;
      cancelled: string;
      clientOrCompany: string;
      company: string;
      date: string;
      description: string;
      endTime: string;
      noAvailability: string;
      notes: string;
      reserved: string;
      service: string;
      startTime: string;
      status: string;
      tentative: string;
      timeFormatHint: string;
      timeZoneLabel: (timeZone: string) => string;
      title: string;
      unavailable: string;
      utcTimeStorage: string;
    }>;
    conflict: Readonly<{
      alertDescription: string;
      alertTitle: string;
      approveForManualCopy: string;
      approvalNote: string;
      noExactTimeConflict: string;
      suggestedDraft: (requestedTime: string, nextAvailableTime: string) => string;
      suggestedDraftLabel: string;
    }>;
  }>;
}>;

export const dashboardInterfaceCopy = {
  en: {
    shell: {
      account: "Account",
      closeMenu: "Close menu",
      copyFailed: "Copy failed",
      copyQuoteLink: "Copy quote link",
      copySuccess: "Copied",
      dashboardLanguage: "Dashboard language",
      moreActions: "More actions",
      openMenu: "Open menu",
      previewQuotePage: "Preview quote page",
      selectDashboardLanguage: "Select dashboard language",
      signOut: "Sign out",
      skipToContent: "Skip to content",
      theme: {
        dark: "Dark",
        label: "Dashboard theme",
        light: "Light",
        system: "System",
      },
      workspace: "Workspace",
    },
    nav: {
      businessProfile: "Business profile",
      guide: "Guide",
      groupCommand: "Command",
      groupControl: "Control",
      groupSetup: "Setup",
      leads: "Leads",
      overview: "Overview",
      premiumOperations: "Premium Operations",
      quoteSetup: "Quote setup",
      reports: "Reports",
      settings: "Settings",
      workspaceSubtitle: "Lead recovery workspace",
    },
    common: {
      approvalRequired: "Manager approval required",
      back: "Back",
      cancel: "Cancel",
      clear: "Clear",
      close: "Close",
      create: "Create",
      delete: "Delete",
      draft: "Draft",
      edit: "Edit",
      loading: "Loading…",
      noResults: "No results found.",
      optional: "Optional",
      premiumAddOn: "Premium add-on",
      required: "Required",
      retry: "Try again",
      save: "Save",
      search: "Search",
      selectAll: "Select all",
      selectedCount: (count) => `${count} selected`,
      viewDetails: "View details",
    },
    premiumOperations: {
      badge: "Premium add-on",
      description:
        "Advanced workflow tools for finding the right requests, preparing group replies, and protecting your availability. Every message remains a draft until a manager approves a manual copy.",
      lockedDescription:
        "This separately priced add-on is not active for this workspace. It remains outside the standard plan until founder support enables it.",
      title: "Premium Operations",
      tabs: {
        availability: "Availability",
        bulkReply: "Bulk reply",
        prioritySearch: "Priority search",
      },
      prioritySearch: {
        addRule: "Add priority rule",
        allRules: "All priority rules",
        areaPlaceholder: "e.g. Downtown, Boucherville",
        areaTerms: "Area terms",
        availabilityCheckLimit:
          "Showing the newest 250 active requests; older active requests are not included.",
        description:
          "Build a focused list from location, service, requested date, status, and the priority rules you define.",
        descriptionLabel: "Description",
        filters: {
          allValues: "All",
          location: "Location",
          requestedDate: "Requested date",
          requestedTime: "Requested time",
          service: "Service",
          status: "Status",
        },
        noMatchingLeads: "No requests match this priority view.",
        leadDetailsNeedReview: "Request details need review",
        priority: {
          high: "High priority",
          low: "Low priority",
          standard: "Standard priority",
        },
        priorityRank: "Priority rank (1–5)",
        queryPlaceholder: "Search name, location, or service",
        resultCount: (count) =>
          count === 1 ? "1 matching request" : `${count} matching requests`,
        ruleName: "Rule name",
        rulesLabel: "Priority rules",
        servicePlaceholder: "e.g. short cut, deep cleaning",
        serviceTerms: "Service terms",
        statusLabels: {
          archived: "Archived",
          booked: "Booked",
          follow_up_needed: "Follow-up needed",
          lost: "Lost",
          new: "New",
          replied: "Replied",
          reviewed: "Reviewed",
        },
        title: "Priority search",
        unnamedRequest: "Unnamed request",
      },
      bulkReply: {
        approvalNote:
          "A manager must review and approve this draft before it can be copied manually.",
        audienceLabel: "Audience",
        createDraft: "Create reply draft",
        copied: "Copied",
        copyDraft: "Copy draft",
        copyFailed: "Copy failed",
        description:
          "Prepare one tailored reply for a selected group. It is never copied or delivered automatically.",
        draftLabel: "Reply draft",
        draftTitle: "Draft title",
        manualCopyDescription:
          "Copy each approved reply through your existing customer channel. BizPilot does not deliver it.",
        manualCopyLog: "Manual copy log",
        noEligibleRecipients: "Select at least one eligible request to prepare a reply draft.",
        recipientCount: (count) =>
          count === 1 ? "1 recipient" : `${count} recipients`,
        recordCopy: "Record copy",
        reviewDraft: "Review draft",
        reviewQueue: "Review queue",
        statusDraft: "Draft",
        statusReviewed: "Reviewed",
        title: "Bulk reply draft",
      },
      availability: {
        addAvailability: "Add availability",
        cancelled: "Cancelled",
        clientOrCompany: "Client or company",
        company: "Company",
        date: "Date",
        description:
          "Set internal service windows for a client or company and keep the team aware of reserved time.",
        endTime: "End time",
        noAvailability: "No availability has been added yet.",
        notes: "Notes",
        reserved: "Reserved",
        service: "Service",
        startTime: "Start time",
        status: "Status",
        tentative: "Tentative",
        timeFormatHint: "Use standard 24-hour numbers for all times.",
        timeZoneLabel: (timeZone) => `Operating timezone: ${timeZone}`,
        title: "Availability",
        unavailable: "Unavailable",
        utcTimeStorage:
          "Times are entered and displayed in the operating timezone, then stored as UTC instants.",
      },
      conflict: {
        alertDescription:
          "A new request overlaps an existing appointment. Review the suggested reply before copying it.",
        alertTitle: "Requested time is already occupied",
        approveForManualCopy: "Approve for manual copy",
        approvalNote:
          "This reply is a draft only. It does not promise availability or copy automatically.",
        noExactTimeConflict:
          "No exact time conflicts are waiting for review. Requests with broad labels such as “morning” remain manual review items instead of being treated as an exact slot.",
        suggestedDraft: (requestedTime, nextAvailableTime) =>
          `We are fully occupied at ${requestedTime}. The first internal opening to review is ${nextAvailableTime}. Would that work for you?`,
        suggestedDraftLabel: "Suggested availability reply",
      },
    },
  },
  "fr-CA": {
    shell: {
      account: "Compte",
      closeMenu: "Fermer le menu",
      copyFailed: "Échec de la copie",
      copyQuoteLink: "Copier le lien de demande",
      copySuccess: "Copié",
      dashboardLanguage: "Langue du tableau de bord",
      moreActions: "Autres actions",
      openMenu: "Ouvrir le menu",
      previewQuotePage: "Prévisualiser la page de demande",
      selectDashboardLanguage: "Choisir la langue du tableau de bord",
      signOut: "Se déconnecter",
      skipToContent: "Aller au contenu",
      theme: {
        dark: "Sombre",
        label: "Thème du tableau de bord",
        light: "Clair",
        system: "Système",
      },
      workspace: "Espace de travail",
    },
    nav: {
      businessProfile: "Profil d’entreprise",
      guide: "Guide",
      groupCommand: "Commandes",
      groupControl: "Contrôle",
      groupSetup: "Configuration",
      leads: "Demandes",
      overview: "Aperçu",
      premiumOperations: "Opérations Premium",
      quoteSetup: "Configuration des demandes",
      reports: "Rapports",
      settings: "Paramètres",
      workspaceSubtitle: "Espace de récupération",
    },
    common: {
      approvalRequired: "Approbation du gestionnaire requise",
      back: "Retour",
      cancel: "Annuler",
      clear: "Effacer",
      close: "Fermer",
      create: "Créer",
      delete: "Supprimer",
      draft: "Brouillon",
      edit: "Modifier",
      loading: "Chargement…",
      noResults: "Aucun résultat.",
      optional: "Facultatif",
      premiumAddOn: "Supplément Premium",
      required: "Requis",
      retry: "Réessayer",
      save: "Enregistrer",
      search: "Rechercher",
      selectAll: "Tout sélectionner",
      selectedCount: (count) => `${count} sélectionné${count === 1 ? "" : "s"}`,
      viewDetails: "Voir les détails",
    },
    premiumOperations: {
      badge: "Supplément Premium",
      description:
        "Des outils avancés pour trouver les bonnes demandes, préparer des réponses groupées et protéger vos disponibilités. Chaque message reste un brouillon jusqu’à l’approbation d’une copie manuelle par un gestionnaire.",
      lockedDescription:
        "Ce supplément facturé séparément n’est pas actif pour cet espace de travail. Il demeure hors du forfait standard jusqu’à son activation par le soutien fondateur.",
      title: "Opérations Premium",
      tabs: {
        availability: "Disponibilités",
        bulkReply: "Réponse groupée",
        prioritySearch: "Recherche par priorité",
      },
      prioritySearch: {
        addRule: "Ajouter une règle de priorité",
        allRules: "Toutes les règles de priorité",
        areaPlaceholder: "p. ex. centre-ville, Boucherville",
        areaTerms: "Termes de zone",
        availabilityCheckLimit:
          "Les 250 demandes actives les plus récentes sont affichées; les demandes actives plus anciennes ne sont pas incluses.",
        description:
          "Créez une liste ciblée selon l’emplacement, le service, la date demandée, le statut et vos règles de priorité.",
        descriptionLabel: "Description",
        filters: {
          allValues: "Tous",
          location: "Emplacement",
          requestedDate: "Date demandée",
          requestedTime: "Heure demandée",
          service: "Service",
          status: "Statut",
        },
        noMatchingLeads: "Aucune demande ne correspond à cette vue prioritaire.",
        leadDetailsNeedReview: "Les détails de la demande doivent être examinés",
        priority: {
          high: "Priorité élevée",
          low: "Priorité basse",
          standard: "Priorité normale",
        },
        priorityRank: "Rang de priorité (1–5)",
        queryPlaceholder: "Rechercher un nom, un emplacement ou un service",
        resultCount: (count) =>
          count === 1 ? "1 demande correspondante" : `${count} demandes correspondantes`,
        ruleName: "Nom de la règle",
        rulesLabel: "Règles de priorité",
        servicePlaceholder: "p. ex. coupe courte, nettoyage en profondeur",
        serviceTerms: "Termes de service",
        statusLabels: {
          archived: "Archivée",
          booked: "Réservée",
          follow_up_needed: "Suivi requis",
          lost: "Perdue",
          new: "Nouvelle",
          replied: "Réponse envoyée",
          reviewed: "Examinée",
        },
        title: "Recherche par priorité",
        unnamedRequest: "Demande sans nom",
      },
      bulkReply: {
        approvalNote:
          "Un gestionnaire doit examiner et approuver ce brouillon avant toute copie manuelle.",
        audienceLabel: "Destinataires",
        createDraft: "Créer un brouillon de réponse",
        copied: "Copié",
        copyDraft: "Copier le brouillon",
        copyFailed: "Échec de la copie",
        description:
          "Préparez une réponse adaptée pour un groupe sélectionné. Elle n’est jamais copiée ni livrée automatiquement.",
        draftLabel: "Brouillon de réponse",
        draftTitle: "Titre du brouillon",
        manualCopyDescription:
          "Copiez chaque réponse approuvée par votre canal client existant. BizPilot ne la livre pas.",
        manualCopyLog: "Journal de copie manuelle",
        noEligibleRecipients:
          "Sélectionnez au moins une demande admissible pour préparer un brouillon de réponse.",
        recipientCount: (count) =>
          count === 1 ? "1 destinataire" : `${count} destinataires`,
        recordCopy: "Enregistrer la copie",
        reviewDraft: "Examiner le brouillon",
        reviewQueue: "File d’examen",
        statusDraft: "Brouillon",
        statusReviewed: "Examiné",
        title: "Brouillon de réponse groupée",
      },
      availability: {
        addAvailability: "Ajouter une disponibilité",
        cancelled: "Annulé",
        clientOrCompany: "Client ou entreprise",
        company: "Entreprise",
        date: "Date",
        description:
          "Planifiez des plages de service pour un client ou une entreprise afin que l’équipe voie les heures réservées.",
        endTime: "Heure de fin",
        noAvailability: "Aucune disponibilité n’a encore été ajoutée.",
        notes: "Notes",
        reserved: "Réservé",
        service: "Service",
        startTime: "Heure de début",
        status: "Statut",
        tentative: "Provisoire",
        timeFormatHint: "Utilisez des chiffres standard au format 24 heures pour toutes les heures.",
        timeZoneLabel: (timeZone) => `Fuseau horaire d’exploitation : ${timeZone}`,
        title: "Disponibilités",
        unavailable: "Indisponible",
        utcTimeStorage:
          "Les heures sont saisies et affichées dans le fuseau d’exploitation, puis stockées comme instants UTC.",
      },
      conflict: {
        alertDescription:
          "Une nouvelle demande chevauche un rendez-vous existant. Examinez la réponse suggérée avant de la copier.",
        alertTitle: "L’heure demandée est déjà occupée",
        approveForManualCopy: "Approuver pour une copie manuelle",
        approvalNote:
          "Cette réponse est seulement un brouillon. Elle ne promet pas de disponibilité et n’est pas copiée automatiquement.",
        noExactTimeConflict:
          "Aucun conflit d’heure exacte n’attend un examen. Les demandes avec un libellé large comme « matin » restent à examiner manuellement plutôt que d’être traitées comme un créneau précis.",
        suggestedDraft: (requestedTime, nextAvailableTime) =>
          `Nous sommes complets à ${requestedTime}. Notre première disponibilité est à ${nextAvailableTime}. Est-ce que cela vous conviendrait?`,
        suggestedDraftLabel: "Réponse suggérée sur les disponibilités",
      },
    },
  },
  fa: {
    shell: {
      account: "حساب کاربری",
      closeMenu: "بستن منو",
      copyFailed: "کپی ناموفق بود",
      copyQuoteLink: "کپی پیوند درخواست",
      copySuccess: "کپی شد",
      dashboardLanguage: "زبان داشبورد",
      moreActions: "عملیات بیشتر",
      openMenu: "باز کردن منو",
      previewQuotePage: "پیش‌نمایش صفحهٔ درخواست",
      selectDashboardLanguage: "انتخاب زبان داشبورد",
      signOut: "خروج",
      skipToContent: "رفتن به محتوا",
      theme: {
        dark: "تیره",
        label: "پوستهٔ داشبورد",
        light: "روشن",
        system: "سیستم",
      },
      workspace: "فضای کاری",
    },
    nav: {
      businessProfile: "پروفایل کسب‌وکار",
      guide: "راهنما",
      groupCommand: "عملیات",
      groupControl: "کنترل",
      groupSetup: "راه‌اندازی",
      leads: "درخواست‌ها",
      overview: "نمای کلی",
      premiumOperations: "عملیات ویژه",
      quoteSetup: "تنظیم فرم درخواست",
      reports: "گزارش‌ها",
      settings: "تنظیمات",
      workspaceSubtitle: "فضای پیگیری درخواست‌ها",
    },
    common: {
      approvalRequired: "تأیید مدیر لازم است",
      back: "بازگشت",
      cancel: "لغو",
      clear: "پاک کردن",
      close: "بستن",
      create: "ایجاد",
      delete: "حذف",
      draft: "پیش‌نویس",
      edit: "ویرایش",
      loading: "در حال بارگذاری…",
      noResults: "نتیجه‌ای پیدا نشد.",
      optional: "اختیاری",
      premiumAddOn: "افزونه ویژه",
      required: "الزامی",
      retry: "تلاش دوباره",
      save: "ذخیره",
      search: "جست‌وجو",
      selectAll: "انتخاب همه",
      selectedCount: (count) => `${count} مورد انتخاب شده`,
      viewDetails: "مشاهده جزئیات",
    },
    premiumOperations: {
      badge: "افزونه ویژه",
      description:
        "ابزارهای پیشرفته برای یافتن درخواست‌های مناسب، آماده‌کردن پاسخ‌های گروهی و مدیریت ظرفیت. هر پیام تا تأیید مدیر برای کپی دستی فقط پیش‌نویس باقی می‌ماند.",
      lockedDescription:
        "این افزونه با هزینهٔ جداگانه برای این فضای کاری فعال نیست و تا فعال‌سازی توسط پشتیبانی بنیان‌گذار خارج از طرح استاندارد می‌ماند.",
      title: "عملیات ویژه",
      tabs: {
        availability: "زمان‌بندی و ظرفیت",
        bulkReply: "پاسخ گروهی",
        prioritySearch: "جست‌وجوی اولویت‌محور",
      },
      prioritySearch: {
        addRule: "افزودن قانون اولویت",
        allRules: "همهٔ قوانین اولویت",
        areaPlaceholder: "برای نمونه: مرکز شهر، بوشرویل",
        areaTerms: "عبارت‌های محدوده",
        availabilityCheckLimit:
          "جدیدترین 250 درخواست فعال نمایش داده می‌شوند؛ درخواست‌های فعال قدیمی‌تر در این نما نیستند.",
        description:
          "فهرستی هدفمند بر اساس موقعیت، خدمت، تاریخ درخواستی، وضعیت و قوانین اولویتی خود بسازید.",
        descriptionLabel: "توضیحات",
        filters: {
          allValues: "همه",
          location: "موقعیت",
          requestedDate: "تاریخ درخواستی",
          requestedTime: "زمان درخواستی",
          service: "خدمت",
          status: "وضعیت",
        },
        noMatchingLeads: "درخواستی با این نمای اولویت پیدا نشد.",
        leadDetailsNeedReview: "جزئیات درخواست نیاز به بررسی دارد",
        priority: {
          high: "اولویت بالا",
          low: "اولویت پایین",
          standard: "اولویت عادی",
        },
        priorityRank: "رتبهٔ اولویت (1–5)",
        queryPlaceholder: "جست‌وجو در نام، موقعیت یا خدمت",
        resultCount: (count) => `${count} درخواست منطبق`,
        ruleName: "نام قانون",
        rulesLabel: "قوانین اولویت",
        servicePlaceholder: "برای نمونه: کوتاهی مو، نظافت عمیق",
        serviceTerms: "عبارت‌های خدمت",
        statusLabels: {
          archived: "بایگانی‌شده",
          booked: "رزروشده",
          follow_up_needed: "نیازمند پیگیری",
          lost: "از‌دست‌رفته",
          new: "جدید",
          replied: "پاسخ‌داده‌شده",
          reviewed: "بررسی‌شده",
        },
        title: "جست‌وجوی اولویت‌محور",
        unnamedRequest: "درخواست بدون نام",
      },
      bulkReply: {
        approvalNote:
          "مدیر باید این پیش‌نویس را بررسی و تأیید کند تا بتوان آن را به‌صورت دستی کپی کرد.",
        audienceLabel: "دریافت‌کنندگان",
        createDraft: "ساخت پیش‌نویس پاسخ",
        copied: "کپی شد",
        copyDraft: "کپی پیش‌نویس",
        copyFailed: "کپی ناموفق بود",
        description:
          "یک پاسخ متناسب برای گروه انتخاب‌شده آماده کنید. هیچ پاسخی خودکار کپی یا تحویل نمی‌شود.",
        draftLabel: "پیش‌نویس پاسخ",
        draftTitle: "عنوان پیش‌نویس",
        manualCopyDescription:
          "هر پاسخ تأییدشده را از طریق کانال فعلی ارتباط با مشتری کپی کنید. BizPilot آن را تحویل نمی‌دهد.",
        manualCopyLog: "گزارش کپی دستی",
        noEligibleRecipients:
          "برای آماده‌کردن پیش‌نویس پاسخ، دست‌کم یک درخواست واجد شرایط انتخاب کنید.",
        recipientCount: (count) => `${count} دریافت‌کننده`,
        recordCopy: "ثبت کپی",
        reviewDraft: "بررسی پیش‌نویس",
        reviewQueue: "صف بررسی",
        statusDraft: "پیش‌نویس",
        statusReviewed: "بررسی‌شده",
        title: "پیش‌نویس پاسخ گروهی",
      },
      availability: {
        addAvailability: "افزودن زمان آزاد",
        cancelled: "لغوشده",
        clientOrCompany: "مشتری یا شرکت",
        company: "شرکت",
        date: "تاریخ",
        description:
          "برای یک مشتری یا شرکت بازه‌های خدمت تعیین کنید تا زمان‌های رزروشده برای تیم روشن باشد.",
        endTime: "زمان پایان",
        noAvailability: "هنوز زمانی ثبت نشده است.",
        notes: "یادداشت‌ها",
        reserved: "رزرو داخلی",
        service: "خدمت",
        startTime: "زمان شروع",
        status: "وضعیت",
        tentative: "موقت",
        timeFormatHint: "برای همه زمان‌ها از اعداد استاندارد 24 ساعته استفاده کنید.",
        timeZoneLabel: (timeZone) => `منطقهٔ زمانی کاری: ${timeZone}`,
        title: "زمان‌بندی و ظرفیت",
        unavailable: "غیرقابل رزرو",
        utcTimeStorage:
          "زمان‌ها در منطقهٔ زمانی کاری وارد و نمایش داده می‌شوند و به‌صورت لحظهٔ UTC ذخیره می‌شوند.",
      },
      conflict: {
        alertDescription:
          "درخواست جدید با یک قرار موجود هم‌پوشانی دارد. پیش‌نویس پیشنهادی را پیش از کپی‌کردن بررسی کنید.",
        alertTitle: "زمان درخواستی قبلاً پر شده است",
        approveForManualCopy: "تأیید برای کپی دستی",
        approvalNote:
          "این متن فقط پیش‌نویس است؛ نه زمان خالی را تضمین می‌کند و نه خودکار کپی می‌شود.",
        noExactTimeConflict:
          "هیچ تداخل زمانی دقیقی در انتظار بررسی نیست. درخواست‌هایی با برچسب کلی مانند «صبح» به‌جای تبدیل‌شدن به یک بازهٔ دقیق، برای بررسی دستی باقی می‌مانند.",
        suggestedDraft: (requestedTime, nextAvailableTime) =>
          `در ساعت ${requestedTime} ظرفیت کامل است. اولین زمان آزاد ما ${nextAvailableTime} است. آیا برای شما مناسب است؟`,
        suggestedDraftLabel: "پاسخ پیشنهادی درباره زمان آزاد",
      },
    },
  },
  ar: {
    shell: {
      account: "الحساب",
      closeMenu: "إغلاق القائمة",
      copyFailed: "تعذر النسخ",
      copyQuoteLink: "نسخ رابط الطلب",
      copySuccess: "تم النسخ",
      dashboardLanguage: "لغة لوحة التحكم",
      moreActions: "إجراءات أخرى",
      openMenu: "فتح القائمة",
      previewQuotePage: "معاينة صفحة الطلب",
      selectDashboardLanguage: "اختيار لغة لوحة التحكم",
      signOut: "تسجيل الخروج",
      skipToContent: "الانتقال إلى المحتوى",
      theme: {
        dark: "داكن",
        label: "مظهر لوحة التحكم",
        light: "فاتح",
        system: "النظام",
      },
      workspace: "مساحة العمل",
    },
    nav: {
      businessProfile: "ملف النشاط التجاري",
      guide: "الدليل",
      groupCommand: "العمليات",
      groupControl: "التحكم",
      groupSetup: "الإعداد",
      leads: "الطلبات",
      overview: "نظرة عامة",
      premiumOperations: "العمليات المميزة",
      quoteSetup: "إعداد نموذج الطلب",
      reports: "التقارير",
      settings: "الإعدادات",
      workspaceSubtitle: "مساحة متابعة الطلبات",
    },
    common: {
      approvalRequired: "موافقة المدير مطلوبة",
      back: "رجوع",
      cancel: "إلغاء",
      clear: "مسح",
      close: "إغلاق",
      create: "إنشاء",
      delete: "حذف",
      draft: "مسودة",
      edit: "تعديل",
      loading: "جارٍ التحميل…",
      noResults: "لا توجد نتائج.",
      optional: "اختياري",
      premiumAddOn: "إضافة مميزة",
      required: "مطلوب",
      retry: "إعادة المحاولة",
      save: "حفظ",
      search: "بحث",
      selectAll: "تحديد الكل",
      selectedCount: (count) => `${count} محدد`,
      viewDetails: "عرض التفاصيل",
    },
    premiumOperations: {
      badge: "إضافة مميزة",
      description:
        "أدوات متقدمة للعثور على الطلبات المناسبة، وإعداد ردود جماعية، وحماية مواعيدك المتاحة. تبقى كل رسالة مسودة حتى يوافق المدير على النسخ اليدوي.",
      lockedDescription:
        "هذه الإضافة ذات السعر المنفصل غير مفعّلة لمساحة العمل هذه، وتبقى خارج الباقة القياسية إلى أن يفعّلها دعم المؤسس.",
      title: "العمليات المميزة",
      tabs: {
        availability: "التوفر والمواعيد",
        bulkReply: "رد جماعي",
        prioritySearch: "البحث حسب الأولوية",
      },
      prioritySearch: {
        addRule: "إضافة قاعدة أولوية",
        allRules: "كل قواعد الأولوية",
        areaPlaceholder: "مثال: وسط المدينة، بوشرفيل",
        areaTerms: "عبارات المنطقة",
        availabilityCheckLimit:
          "تُعرض أحدث 250 طلباً نشطاً؛ الطلبات النشطة الأقدم غير مضمنة في هذا العرض.",
        description:
          "أنشئ قائمة مركزة بحسب الموقع والخدمة والتاريخ المطلوب والحالة وقواعد الأولوية التي تحددها.",
        descriptionLabel: "الوصف",
        filters: {
          allValues: "الكل",
          location: "الموقع",
          requestedDate: "التاريخ المطلوب",
          requestedTime: "الوقت المطلوب",
          service: "الخدمة",
          status: "الحالة",
        },
        noMatchingLeads: "لا توجد طلبات تطابق عرض الأولوية هذا.",
        leadDetailsNeedReview: "تفاصيل الطلب تحتاج إلى مراجعة",
        priority: {
          high: "أولوية عالية",
          low: "أولوية منخفضة",
          standard: "أولوية عادية",
        },
        priorityRank: "رتبة الأولوية (1–5)",
        queryPlaceholder: "ابحث بالاسم أو الموقع أو الخدمة",
        resultCount: (count) => `${count} طلبات مطابقة`,
        ruleName: "اسم القاعدة",
        rulesLabel: "قواعد الأولوية",
        servicePlaceholder: "مثال: قصّة قصيرة، تنظيف عميق",
        serviceTerms: "عبارات الخدمة",
        statusLabels: {
          archived: "مؤرشف",
          booked: "محجوز",
          follow_up_needed: "يحتاج إلى متابعة",
          lost: "مفقود",
          new: "جديد",
          replied: "تم الرد",
          reviewed: "تمت المراجعة",
        },
        title: "البحث حسب الأولوية",
        unnamedRequest: "طلب بلا اسم",
      },
      bulkReply: {
        approvalNote:
          "يجب أن يراجع المدير هذه المسودة ويعتمدها قبل نسخها يدوياً.",
        audienceLabel: "المستلمون",
        createDraft: "إنشاء مسودة رد",
        copied: "تم النسخ",
        copyDraft: "نسخ المسودة",
        copyFailed: "تعذر النسخ",
        description:
          "أعدّ رداً مناسباً لمجموعة محددة. لا يتم نسخ أي رد أو تسليمه تلقائياً.",
        draftLabel: "مسودة الرد",
        draftTitle: "عنوان المسودة",
        manualCopyDescription:
          "انسخ كل رد مُعتمد عبر قناة العملاء الحالية. لا يقوم BizPilot بتسليمه.",
        manualCopyLog: "سجل النسخ اليدوي",
        noEligibleRecipients:
          "حدّد طلباً مؤهلاً واحداً على الأقل لإعداد مسودة رد.",
        recipientCount: (count) => `${count} مستلمين`,
        recordCopy: "تسجيل النسخ",
        reviewDraft: "مراجعة المسودة",
        reviewQueue: "طابور المراجعة",
        statusDraft: "مسودة",
        statusReviewed: "تمت المراجعة",
        title: "مسودة رد جماعي",
      },
      availability: {
        addAvailability: "إضافة وقت متاح",
        cancelled: "ملغى",
        clientOrCompany: "العميل أو الشركة",
        company: "الشركة",
        date: "التاريخ",
        description:
          "حدّد نوافذ الخدمة لعميل أو شركة حتى يعرف الفريق الأوقات المحجوزة.",
        endTime: "وقت الانتهاء",
        noAvailability: "لم تتم إضافة أوقات متاحة بعد.",
        notes: "ملاحظات",
        reserved: "محجوز داخلياً",
        service: "الخدمة",
        startTime: "وقت البدء",
        status: "الحالة",
        tentative: "مبدئي",
        timeFormatHint: "استخدم أرقاماً معيارية بنظام 24 ساعة لكل الأوقات.",
        timeZoneLabel: (timeZone) => `المنطقة الزمنية للعمل: ${timeZone}`,
        title: "التوفر والمواعيد",
        unavailable: "غير متاح",
        utcTimeStorage:
          "تُدخل الأوقات وتُعرض في منطقة العمل الزمنية، ثم تُخزّن كلحظات UTC.",
      },
      conflict: {
        alertDescription:
          "يتداخل طلب جديد مع موعد قائم. راجع الرد المقترح قبل نسخه.",
        alertTitle: "الوقت المطلوب مشغول بالفعل",
        approveForManualCopy: "اعتماد للنسخ اليدوي",
        approvalNote:
          "هذا الرد مسودة فقط. لا يعد بالتوفر ولا يُنسخ تلقائياً.",
        noExactTimeConflict:
          "لا توجد تعارضات وقت دقيقة بانتظار المراجعة. الطلبات ذات العناوين العامة مثل «صباحاً» تبقى عناصر مراجعة يدوية بدلاً من معاملتها كفترة محددة.",
        suggestedDraft: (requestedTime, nextAvailableTime) =>
          `نحن محجوزون بالكامل في ${requestedTime}. أول وقت متاح لدينا هو ${nextAvailableTime}. هل يناسبك ذلك؟`,
        suggestedDraftLabel: "رد مقترح بشأن التوفر",
      },
    },
  },
  es: {
    shell: {
      account: "Cuenta",
      closeMenu: "Cerrar menú",
      copyFailed: "Error al copiar",
      copyQuoteLink: "Copiar enlace de solicitud",
      copySuccess: "Copiado",
      dashboardLanguage: "Idioma del panel",
      moreActions: "Más acciones",
      openMenu: "Abrir menú",
      previewQuotePage: "Vista previa de la página de solicitud",
      selectDashboardLanguage: "Seleccionar el idioma del panel",
      signOut: "Cerrar sesión",
      skipToContent: "Ir al contenido",
      theme: {
        dark: "Oscuro",
        label: "Tema del panel",
        light: "Claro",
        system: "Sistema",
      },
      workspace: "Espacio de trabajo",
    },
    nav: {
      businessProfile: "Perfil del negocio",
      guide: "Guía",
      groupCommand: "Operaciones",
      groupControl: "Control",
      groupSetup: "Configuración",
      leads: "Solicitudes",
      overview: "Resumen",
      premiumOperations: "Operaciones Premium",
      quoteSetup: "Configuración de solicitudes",
      reports: "Informes",
      settings: "Configuración",
      workspaceSubtitle: "Espacio de recuperación de solicitudes",
    },
    common: {
      approvalRequired: "Se requiere aprobación del gerente",
      back: "Volver",
      cancel: "Cancelar",
      clear: "Limpiar",
      close: "Cerrar",
      create: "Crear",
      delete: "Eliminar",
      draft: "Borrador",
      edit: "Editar",
      loading: "Cargando…",
      noResults: "No se encontraron resultados.",
      optional: "Opcional",
      premiumAddOn: "Complemento Premium",
      required: "Obligatorio",
      retry: "Intentar de nuevo",
      save: "Guardar",
      search: "Buscar",
      selectAll: "Seleccionar todo",
      selectedCount: (count) => `${count} seleccionados`,
      viewDetails: "Ver detalles",
    },
    premiumOperations: {
      badge: "Complemento Premium",
      description:
        "Herramientas avanzadas para encontrar las solicitudes adecuadas, preparar respuestas grupales y proteger tu disponibilidad. Cada mensaje sigue siendo un borrador hasta que un gerente apruebe su copia manual.",
      lockedDescription:
        "Este complemento con precio independiente no está activo para este espacio de trabajo. Permanece fuera del plan estándar hasta que el soporte del fundador lo habilite.",
      title: "Operaciones Premium",
      tabs: {
        availability: "Disponibilidad",
        bulkReply: "Respuesta grupal",
        prioritySearch: "Búsqueda por prioridad",
      },
      prioritySearch: {
        addRule: "Añadir regla de prioridad",
        allRules: "Todas las reglas de prioridad",
        areaPlaceholder: "p. ej., centro, Boucherville",
        areaTerms: "Términos de zona",
        availabilityCheckLimit:
          "Se muestran las 250 solicitudes activas más recientes; las anteriores no están incluidas.",
        description:
          "Crea una lista enfocada según la ubicación, el servicio, la fecha solicitada, el estado y las reglas de prioridad que definas.",
        descriptionLabel: "Descripción",
        filters: {
          allValues: "Todos",
          location: "Ubicación",
          requestedDate: "Fecha solicitada",
          requestedTime: "Hora solicitada",
          service: "Servicio",
          status: "Estado",
        },
        noMatchingLeads: "Ninguna solicitud coincide con esta vista de prioridad.",
        leadDetailsNeedReview: "Los detalles de la solicitud necesitan revisión",
        priority: {
          high: "Prioridad alta",
          low: "Prioridad baja",
          standard: "Prioridad normal",
        },
        priorityRank: "Rango de prioridad (1–5)",
        queryPlaceholder: "Buscar por nombre, ubicación o servicio",
        resultCount: (count) =>
          count === 1 ? "1 solicitud coincidente" : `${count} solicitudes coincidentes`,
        ruleName: "Nombre de la regla",
        rulesLabel: "Reglas de prioridad",
        servicePlaceholder: "p. ej., corte corto, limpieza profunda",
        serviceTerms: "Términos de servicio",
        statusLabels: {
          archived: "Archivada",
          booked: "Reservada",
          follow_up_needed: "Necesita seguimiento",
          lost: "Perdida",
          new: "Nueva",
          replied: "Respondida",
          reviewed: "Revisada",
        },
        title: "Búsqueda por prioridad",
        unnamedRequest: "Solicitud sin nombre",
      },
      bulkReply: {
        approvalNote:
          "Un gerente debe revisar y aprobar este borrador antes de poder copiarlo manualmente.",
        audienceLabel: "Destinatarios",
        createDraft: "Crear borrador de respuesta",
        copied: "Copiado",
        copyDraft: "Copiar borrador",
        copyFailed: "Error al copiar",
        description:
          "Prepara una respuesta adaptada para un grupo seleccionado. Nunca se copia ni se entrega automáticamente.",
        draftLabel: "Borrador de respuesta",
        draftTitle: "Título del borrador",
        manualCopyDescription:
          "Copia cada respuesta aprobada mediante tu canal actual de clientes. BizPilot no la entrega.",
        manualCopyLog: "Registro de copia manual",
        noEligibleRecipients:
          "Selecciona al menos una solicitud apta para preparar un borrador de respuesta.",
        recipientCount: (count) =>
          count === 1 ? "1 destinatario" : `${count} destinatarios`,
        recordCopy: "Registrar copia",
        reviewDraft: "Revisar borrador",
        reviewQueue: "Cola de revisión",
        statusDraft: "Borrador",
        statusReviewed: "Revisado",
        title: "Borrador de respuesta grupal",
      },
      availability: {
        addAvailability: "Añadir disponibilidad",
        cancelled: "Cancelado",
        clientOrCompany: "Cliente o empresa",
        company: "Empresa",
        date: "Fecha",
        description:
          "Define ventanas de servicio para un cliente o una empresa y mantén al equipo al tanto de las horas reservadas.",
        endTime: "Hora de finalización",
        noAvailability: "Aún no se ha añadido disponibilidad.",
        notes: "Notas",
        reserved: "Reservado internamente",
        service: "Servicio",
        startTime: "Hora de inicio",
        status: "Estado",
        tentative: "Provisional",
        timeFormatHint: "Usa números estándar de 24 horas para todas las horas.",
        timeZoneLabel: (timeZone) => `Zona horaria operativa: ${timeZone}`,
        title: "Disponibilidad",
        unavailable: "No disponible",
        utcTimeStorage:
          "Las horas se introducen y muestran en la zona operativa y se guardan como instantes UTC.",
      },
      conflict: {
        alertDescription:
          "Una nueva solicitud se superpone con una cita existente. Revisa la respuesta sugerida antes de copiarla.",
        alertTitle: "La hora solicitada ya está ocupada",
        approveForManualCopy: "Aprobar para copia manual",
        approvalNote:
          "Esta respuesta solo es un borrador. No promete disponibilidad ni se copia automáticamente.",
        noExactTimeConflict:
          "No hay conflictos de hora exacta pendientes de revisión. Las solicitudes con etiquetas generales como «mañana» siguen siendo elementos de revisión manual en vez de tratarse como un horario exacto.",
        suggestedDraft: (requestedTime, nextAvailableTime) =>
          `Estamos completamente ocupados a las ${requestedTime}. Nuestra primera hora disponible es ${nextAvailableTime}. ¿Te funciona?`,
        suggestedDraftLabel: "Respuesta sugerida de disponibilidad",
      },
    },
  },
} as const satisfies Record<DashboardInterfaceLanguage, DashboardInterfaceCopy>;

export function getDashboardInterfaceCopy(
  language: unknown,
): DashboardInterfaceCopy {
  return dashboardInterfaceCopy[readDashboardInterfaceLanguage(language)];
}

/**
 * Stable route codes let server actions remain language-neutral while the
 * protected route renders feedback in the active dashboard interface language.
 * They are deliberately separate from the customer-facing draft defaults.
 */
export type PremiumOperationsRouteErrorKey =
  | "addonInactive"
  | "availabilityConflictResolved"
  | "availabilityDraftExists"
  | "availabilityDraftStale"
  | "draftUnavailable"
  | "generic"
  | "invalidAvailabilityRange"
  | "invalidLocalTime"
  | "invalidPriorityName"
  | "invalidPriorityRank"
  | "leadUnavailable"
  | "managerPermissionRequired"
  | "managerReviewRequired"
  | "maximumBatchRecipients"
  | "maximumPriorityRules"
  | "noEligibleLeads"
  | "pastAvailabilityRange"
  | "requiredAvailabilityDetails"
  | "requiredDraftContent"
  | "terminalLeadSelection"
  | "timeBlockConflict"
  | "timeBlockUnavailable"
  | "unusablePreferredTime"
  | "workspaceInactive"
  | "workspaceLocked";

export type PremiumOperationsRouteNoticeKey =
  | "availabilityReplyPrepared"
  | "draftBatchPrepared"
  | "draftReviewRecorded"
  | "internalTimeBlockCancelled"
  | "internalTimeBlockSaved"
  | "manualCopyRecorded"
  | "priorityRuleRemoved"
  | "priorityRuleSaved";

type PremiumOperationsRouteMessages = Readonly<{
  errors: Readonly<Record<PremiumOperationsRouteErrorKey, string>>;
  notices: Readonly<Record<PremiumOperationsRouteNoticeKey, string>>;
}>;

export const premiumOperationsRouteErrorCodes = {
  addonInactive: "addon-inactive",
  availabilityConflictResolved: "availability-conflict-resolved",
  availabilityDraftExists: "availability-draft-exists",
  availabilityDraftStale: "availability-draft-stale",
  draftUnavailable: "draft-unavailable",
  generic: "action-unavailable",
  invalidAvailabilityRange: "invalid-availability-range",
  invalidLocalTime: "invalid-local-time",
  invalidPriorityName: "invalid-priority-name",
  invalidPriorityRank: "invalid-priority-rank",
  leadUnavailable: "lead-unavailable",
  managerPermissionRequired: "manager-permission-required",
  managerReviewRequired: "manager-review-required",
  maximumBatchRecipients: "maximum-batch-recipients",
  maximumPriorityRules: "maximum-priority-rules",
  noEligibleLeads: "no-eligible-leads",
  pastAvailabilityRange: "past-availability-range",
  requiredAvailabilityDetails: "required-availability-details",
  requiredDraftContent: "required-draft-content",
  terminalLeadSelection: "terminal-lead-selection",
  timeBlockConflict: "time-block-conflict",
  timeBlockUnavailable: "time-block-unavailable",
  unusablePreferredTime: "unusable-preferred-time",
  workspaceInactive: "workspace-inactive",
  workspaceLocked: "workspace-locked",
} as const satisfies Record<PremiumOperationsRouteErrorKey, string>;

export const premiumOperationsRouteNoticeCodes = {
  availabilityReplyPrepared: "availability-reply-prepared",
  draftBatchPrepared: "draft-batch-prepared",
  draftReviewRecorded: "draft-review-recorded",
  internalTimeBlockCancelled: "internal-time-block-cancelled",
  internalTimeBlockSaved: "internal-time-block-saved",
  manualCopyRecorded: "manual-copy-recorded",
  priorityRuleRemoved: "priority-rule-removed",
  priorityRuleSaved: "priority-rule-saved",
} as const satisfies Record<PremiumOperationsRouteNoticeKey, string>;

const premiumOperationsRouteMessages = {
  en: {
    errors: {
      addonInactive: "This Premium add-on is not active for this workspace.",
      availabilityConflictResolved:
        "This request no longer conflicts with a saved internal time block.",
      availabilityDraftExists:
        "An availability review draft already exists for this request.",
      availabilityDraftStale:
        "This availability draft is no longer current. Reopen the conflict and prepare a new draft.",
      draftUnavailable: "That draft is no longer available.",
      generic:
        "We couldn't complete that Premium Operations action. Please try again.",
      invalidAvailabilityRange: "Choose a valid time range of up to 24 hours.",
      invalidLocalTime:
        "Choose valid local times outside a daylight-saving transition.",
      invalidPriorityName: "Enter a priority name with at least 2 characters.",
      invalidPriorityRank: "Choose a priority rank from 1 to 5.",
      leadUnavailable: "One or more selected requests are unavailable.",
      managerPermissionRequired:
        "Only an owner or admin can manage this Premium Operations change.",
      managerReviewRequired:
        "A manager must review this draft before it can be copied.",
      maximumBatchRecipients:
        "A review batch can contain up to 50 requests.",
      maximumPriorityRules: "Up to 20 priority rules are supported.",
      noEligibleLeads: "Select at least one eligible request.",
      pastAvailabilityRange: "Choose a future time range.",
      requiredAvailabilityDetails: "Client and service are required.",
      requiredDraftContent: "Enter a title and reply draft.",
      terminalLeadSelection:
        "Booked, lost, and archived requests can't be added to a draft batch.",
      timeBlockConflict:
        "This time overlaps another active internal time block.",
      timeBlockUnavailable: "That internal time block is no longer available.",
      unusablePreferredTime:
        "This request does not include a usable preferred time.",
      workspaceInactive: "This workspace is not active.",
      workspaceLocked: "This workspace is locked for new work.",
    },
    notices: {
      availabilityReplyPrepared: "Availability reply prepared for review.",
      draftBatchPrepared: "Reply draft prepared for review.",
      draftReviewRecorded: "Draft review recorded.",
      internalTimeBlockCancelled: "Internal time block cancelled.",
      internalTimeBlockSaved: "Internal time block saved.",
      manualCopyRecorded: "Manual copy recorded.",
      priorityRuleRemoved: "Priority rule removed.",
      priorityRuleSaved: "Priority rule saved.",
    },
  },
  "fr-CA": {
    errors: {
      addonInactive: "Ce supplément Premium n’est pas actif pour cet espace de travail.",
      availabilityConflictResolved:
        "Cette demande n’entre plus en conflit avec une plage horaire interne enregistrée.",
      availabilityDraftExists:
        "Un brouillon de disponibilité existe déjà pour cette demande.",
      availabilityDraftStale:
        "Ce brouillon de disponibilité n’est plus à jour. Rouvrez le conflit et préparez un nouveau brouillon.",
      draftUnavailable: "Ce brouillon n’est plus disponible.",
      generic:
        "Nous n’avons pas pu terminer cette action des Opérations Premium. Réessayez.",
      invalidAvailabilityRange:
        "Choisissez une plage horaire valide d’au plus 24 heures.",
      invalidLocalTime:
        "Choisissez des heures locales valides hors d’une transition d’heure saisonnière.",
      invalidPriorityName:
        "Saisissez un nom de priorité d’au moins 2 caractères.",
      invalidPriorityRank: "Choisissez un rang de priorité de 1 à 5.",
      leadUnavailable:
        "Une ou plusieurs demandes sélectionnées ne sont plus disponibles.",
      managerPermissionRequired:
        "Seul un propriétaire ou un administrateur peut gérer cette modification des Opérations Premium.",
      managerReviewRequired:
        "Un gestionnaire doit examiner ce brouillon avant sa copie.",
      maximumBatchRecipients:
        "Un lot à examiner peut contenir au plus 50 demandes.",
      maximumPriorityRules: "Jusqu’à 20 règles de priorité sont prises en charge.",
      noEligibleLeads: "Sélectionnez au moins une demande admissible.",
      pastAvailabilityRange: "Choisissez une plage horaire future.",
      requiredAvailabilityDetails: "Le client et le service sont requis.",
      requiredDraftContent: "Saisissez un titre et un brouillon de réponse.",
      terminalLeadSelection:
        "Les demandes réservées, perdues ou archivées ne peuvent pas être ajoutées à un lot.",
      timeBlockConflict:
        "Cette plage chevauche une autre plage horaire interne active.",
      timeBlockUnavailable:
        "Cette plage horaire interne n’est plus disponible.",
      unusablePreferredTime:
        "Cette demande ne contient pas d’heure souhaitée utilisable.",
      workspaceInactive: "Cet espace de travail n’est pas actif.",
      workspaceLocked: "Cet espace de travail est verrouillé pour les nouvelles demandes.",
    },
    notices: {
      availabilityReplyPrepared:
        "La réponse sur les disponibilités est prête à être examinée.",
      draftBatchPrepared: "Le brouillon de réponse est prêt à être examiné.",
      draftReviewRecorded: "L’examen du brouillon a été enregistré.",
      internalTimeBlockCancelled: "La plage horaire interne a été annulée.",
      internalTimeBlockSaved: "La plage horaire interne a été enregistrée.",
      manualCopyRecorded: "La copie manuelle a été enregistrée.",
      priorityRuleRemoved: "La règle de priorité a été supprimée.",
      priorityRuleSaved: "La règle de priorité a été enregistrée.",
    },
  },
  fa: {
    errors: {
      addonInactive: "این افزونهٔ ویژه برای این فضای کاری فعال نیست.",
      availabilityConflictResolved:
        "این درخواست دیگر با بازهٔ زمانی داخلی ذخیره‌شده تداخل ندارد.",
      availabilityDraftExists:
        "برای این درخواست، پیش‌نویس بررسی ظرفیت از قبل وجود دارد.",
      availabilityDraftStale:
        "این پیش‌نویس ظرفیت دیگر به‌روز نیست. تداخل را دوباره باز کنید و پیش‌نویس تازه‌ای بسازید.",
      draftUnavailable: "این پیش‌نویس دیگر در دسترس نیست.",
      generic:
        "انجام این عملیات ویژه ممکن نشد. لطفاً دوباره تلاش کنید.",
      invalidAvailabilityRange:
        "یک بازهٔ زمانی معتبر تا سقف 24 ساعت انتخاب کنید.",
      invalidLocalTime:
        "زمان‌های محلی معتبری خارج از تغییر ساعت فصلی انتخاب کنید.",
      invalidPriorityName: "نام اولویت باید دست‌کم 2 نویسه داشته باشد.",
      invalidPriorityRank: "رتبهٔ اولویت را از 1 تا 5 انتخاب کنید.",
      leadUnavailable: "یک یا چند درخواست انتخاب‌شده دیگر در دسترس نیستند.",
      managerPermissionRequired:
        "فقط مالک یا مدیر می‌تواند این تغییر در عملیات ویژه را مدیریت کند.",
      managerReviewRequired:
        "پیش از کپی‌کردن، مدیر باید این پیش‌نویس را بررسی کند.",
      maximumBatchRecipients:
        "هر بستهٔ بررسی حداکثر می‌تواند 50 درخواست داشته باشد.",
      maximumPriorityRules: "حداکثر 20 قانون اولویت پشتیبانی می‌شود.",
      noEligibleLeads: "دست‌کم یک درخواست واجد شرایط انتخاب کنید.",
      pastAvailabilityRange: "یک بازهٔ زمانی در آینده انتخاب کنید.",
      requiredAvailabilityDetails: "نام مشتری و خدمت لازم هستند.",
      requiredDraftContent: "عنوان و متن پیش‌نویس پاسخ را وارد کنید.",
      terminalLeadSelection:
        "درخواست‌های رزرو‌شده، از‌دست‌رفته یا بایگانی‌شده را نمی‌توان به بسته افزود.",
      timeBlockConflict:
        "این زمان با یک بازهٔ زمانی داخلی فعال دیگر هم‌پوشانی دارد.",
      timeBlockUnavailable: "این بازهٔ زمانی داخلی دیگر در دسترس نیست.",
      unusablePreferredTime:
        "این درخواست زمان ترجیحی قابل‌استفاده‌ای ندارد.",
      workspaceInactive: "این فضای کاری فعال نیست.",
      workspaceLocked: "این فضای کاری برای کار جدید قفل شده است.",
    },
    notices: {
      availabilityReplyPrepared:
        "پاسخ مربوط به ظرفیت برای بررسی آماده شد.",
      draftBatchPrepared: "پیش‌نویس پاسخ برای بررسی آماده شد.",
      draftReviewRecorded: "بررسی پیش‌نویس ثبت شد.",
      internalTimeBlockCancelled: "بازهٔ زمانی داخلی لغو شد.",
      internalTimeBlockSaved: "بازهٔ زمانی داخلی ذخیره شد.",
      manualCopyRecorded: "کپی دستی ثبت شد.",
      priorityRuleRemoved: "قانون اولویت حذف شد.",
      priorityRuleSaved: "قانون اولویت ذخیره شد.",
    },
  },
  ar: {
    errors: {
      addonInactive: "هذه الإضافة المميزة غير مفعّلة لمساحة العمل هذه.",
      availabilityConflictResolved:
        "لم يعد هذا الطلب يتعارض مع فترة زمنية داخلية محفوظة.",
      availabilityDraftExists:
        "توجد بالفعل مسودة مراجعة للتوفر لهذا الطلب.",
      availabilityDraftStale:
        "لم تعد مسودة التوفر هذه حديثة. أعد فتح التعارض وأنشئ مسودة جديدة.",
      draftUnavailable: "لم تعد هذه المسودة متاحة.",
      generic:
        "تعذّر إكمال إجراء العمليات المميزة هذا. يُرجى المحاولة مرة أخرى.",
      invalidAvailabilityRange:
        "اختر نطاقاً زمنياً صالحاً لا يتجاوز 24 ساعة.",
      invalidLocalTime:
        "اختر أوقاتاً محلية صالحة خارج انتقال التوقيت الموسمي.",
      invalidPriorityName: "أدخل اسماً للأولوية من حرفين على الأقل.",
      invalidPriorityRank: "اختر رتبة أولوية من 1 إلى 5.",
      leadUnavailable: "طلب واحد أو أكثر من الطلبات المحددة لم يعد متاحاً.",
      managerPermissionRequired:
        "لا يمكن إدارة هذا التغيير في العمليات المميزة إلا للمالك أو المدير.",
      managerReviewRequired:
        "يجب أن يراجع المدير هذه المسودة قبل نسخها.",
      maximumBatchRecipients:
        "يمكن أن تضم دفعة المراجعة حتى 50 طلباً.",
      maximumPriorityRules: "يتم دعم ما يصل إلى 20 قاعدة أولوية.",
      noEligibleLeads: "حدّد طلباً مؤهلاً واحداً على الأقل.",
      pastAvailabilityRange: "اختر نطاقاً زمنياً مستقبلياً.",
      requiredAvailabilityDetails: "العميل والخدمة مطلوبان.",
      requiredDraftContent: "أدخل عنواناً ومسودة رد.",
      terminalLeadSelection:
        "لا يمكن إضافة الطلبات المحجوزة أو المفقودة أو المؤرشفة إلى دفعة مسودة.",
      timeBlockConflict:
        "يتداخل هذا الوقت مع فترة زمنية داخلية نشطة أخرى.",
      timeBlockUnavailable: "لم تعد الفترة الزمنية الداخلية متاحة.",
      unusablePreferredTime:
        "لا يتضمن هذا الطلب وقتاً مفضلاً صالحاً للاستخدام.",
      workspaceInactive: "مساحة العمل هذه غير نشطة.",
      workspaceLocked: "مساحة العمل هذه مقفلة أمام العمل الجديد.",
    },
    notices: {
      availabilityReplyPrepared: "تم إعداد رد التوفر للمراجعة.",
      draftBatchPrepared: "تم إعداد مسودة الرد للمراجعة.",
      draftReviewRecorded: "تم تسجيل مراجعة المسودة.",
      internalTimeBlockCancelled: "تم إلغاء الفترة الزمنية الداخلية.",
      internalTimeBlockSaved: "تم حفظ الفترة الزمنية الداخلية.",
      manualCopyRecorded: "تم تسجيل النسخ اليدوي.",
      priorityRuleRemoved: "تمت إزالة قاعدة الأولوية.",
      priorityRuleSaved: "تم حفظ قاعدة الأولوية.",
    },
  },
  es: {
    errors: {
      addonInactive: "Este complemento Premium no está activo para este espacio de trabajo.",
      availabilityConflictResolved:
        "Esta solicitud ya no entra en conflicto con un bloque de tiempo interno guardado.",
      availabilityDraftExists:
        "Ya existe un borrador de revisión de disponibilidad para esta solicitud.",
      availabilityDraftStale:
        "Este borrador de disponibilidad ya no está actualizado. Vuelve a abrir el conflicto y prepara uno nuevo.",
      draftUnavailable: "Ese borrador ya no está disponible.",
      generic:
        "No pudimos completar esa acción de Operaciones Premium. Inténtalo de nuevo.",
      invalidAvailabilityRange:
        "Elige un intervalo de tiempo válido de hasta 24 horas.",
      invalidLocalTime:
        "Elige horas locales válidas fuera de una transición del horario estacional.",
      invalidPriorityName:
        "Introduce un nombre de prioridad de al menos 2 caracteres.",
      invalidPriorityRank: "Elige un rango de prioridad del 1 al 5.",
      leadUnavailable:
        "Una o más solicitudes seleccionadas ya no están disponibles.",
      managerPermissionRequired:
        "Solo un propietario o administrador puede gestionar este cambio de Operaciones Premium.",
      managerReviewRequired:
        "Un gerente debe revisar este borrador antes de poder copiarlo.",
      maximumBatchRecipients:
        "Un lote de revisión puede contener hasta 50 solicitudes.",
      maximumPriorityRules: "Se admiten hasta 20 reglas de prioridad.",
      noEligibleLeads: "Selecciona al menos una solicitud apta.",
      pastAvailabilityRange: "Elige un intervalo de tiempo futuro.",
      requiredAvailabilityDetails: "El cliente y el servicio son obligatorios.",
      requiredDraftContent: "Introduce un título y un borrador de respuesta.",
      terminalLeadSelection:
        "Las solicitudes reservadas, perdidas o archivadas no se pueden añadir a un lote de borrador.",
      timeBlockConflict:
        "Este horario se superpone con otro bloque de tiempo interno activo.",
      timeBlockUnavailable:
        "Ese bloque de tiempo interno ya no está disponible.",
      unusablePreferredTime:
        "Esta solicitud no incluye una hora preferida utilizable.",
      workspaceInactive: "Este espacio de trabajo no está activo.",
      workspaceLocked: "Este espacio de trabajo está bloqueado para trabajo nuevo.",
    },
    notices: {
      availabilityReplyPrepared:
        "La respuesta de disponibilidad está lista para revisión.",
      draftBatchPrepared: "El borrador de respuesta está listo para revisión.",
      draftReviewRecorded: "La revisión del borrador se registró.",
      internalTimeBlockCancelled: "Bloque de tiempo interno cancelado.",
      internalTimeBlockSaved: "El bloque de tiempo interno se guardó.",
      manualCopyRecorded: "La copia manual se registró.",
      priorityRuleRemoved: "La regla de prioridad se eliminó.",
      priorityRuleSaved: "La regla de prioridad se guardó.",
    },
  },
} as const satisfies Record<DashboardInterfaceLanguage, PremiumOperationsRouteMessages>;

function findPremiumOperationsErrorKey(
  value: string,
): PremiumOperationsRouteErrorKey {
  for (const [key, code] of Object.entries(premiumOperationsRouteErrorCodes)) {
    if (code === value) {
      return key as PremiumOperationsRouteErrorKey;
    }
  }

  return "generic";
}

function findPremiumOperationsNoticeKey(
  value: string,
): PremiumOperationsRouteNoticeKey | null {
  for (const [key, code] of Object.entries(premiumOperationsRouteNoticeCodes)) {
    if (code === value) {
      return key as PremiumOperationsRouteNoticeKey;
    }
  }

  return null;
}

export function readPremiumOperationsRouteFlashMessage(input: Readonly<{
  kind: "error" | "notice";
  language: unknown;
  value: string | undefined;
}>): string | null {
  const value = input.value?.trim();
  if (!value) return null;

  const messages = premiumOperationsRouteMessages[
    readDashboardInterfaceLanguage(input.language)
  ];
  if (input.kind === "error") {
    return messages.errors[findPremiumOperationsErrorKey(value)];
  }

  const key = findPremiumOperationsNoticeKey(value);
  return key ? messages.notices[key] : null;
}
