import type { VerifGoLanguage } from "../types.ts";

export const VERIFGO_SUPPORTED_LANGUAGES: readonly VerifGoLanguage[] = [
  "en",
  "fr",
];

export const VERIFGO_MVP_FEATURES = [
  "persistent_auth",
  "language_selection",
  "driver_profile",
  "vehicle_setup",
  "reminder_setup",
  "daily_verification_flow",
  "odometer_input",
  "article_65_checklist",
  "one_tap_no_defect",
  "defect_mode_optional_photo",
  "immutable_submit",
  "today_report_card",
  "history",
  "inspector_mode",
  "pdf_export_offline_sync",
] as const;

export const VERIFGO_FORBIDDEN_PRODUCT_CLAIMS = [
  "official_saaq_approval",
  "guaranteed_fine_avoidance",
  "legal_advice",
  "automatic_defect_detection",
  "fake_reports",
  "backdating",
  "bulk_report_generation",
] as const;

export const VERIFGO_REPORT_DISCLAIMER_EN =
  "This report was generated from information submitted by the driver. VerifGo QC helps drivers record and store their daily verification report. It does not replace official inspection requirements, legal advice, or the driver's own responsibility for accuracy.";

export const VERIFGO_REPORT_DISCLAIMER_FR =
  "Ce rapport a ete genere a partir des informations soumises par le conducteur. VerifGo QC aide les conducteurs a enregistrer et conserver leur verification quotidienne. Il ne remplace pas les exigences officielles, les conseils juridiques ni la responsabilite du conducteur quant a l'exactitude des informations.";

export const VERIFGO_DEFAULT_INSPECTION_ITEM_CODES = [
  "odometer",
  "tires_wheels",
  "brakes",
  "steering",
  "lights_signals",
  "windshield_wipers",
  "mirrors",
  "horn",
  "seatbelts",
  "doors",
  "dashboard_warning_lights",
  "passenger_transport_condition",
  "ev_battery_charge",
] as const;

export const VERIFGO_PREMIUM_SMART_REMINDERS = [
  {
    code: "winter_tire_install",
    defaultLeadDays: 30,
    guidance:
      "Prepare winter tires before Quebec's December 1 winter-ready requirement.",
    recommendedMonthDay: "11-01",
  },
  {
    code: "winter_tire_deadline",
    defaultLeadDays: 7,
    guidance:
      "Quebec winter tire period runs from December 1 to March 15 for most Quebec-registered motor vehicles.",
    recommendedMonthDay: "11-24",
  },
  {
    code: "washer_fluid_winter",
    defaultLeadDays: 14,
    guidance:
      "Check winter windshield washer fluid before freezing weather and keep extra fluid in the vehicle.",
    recommendedMonthDay: "11-15",
  },
  {
    code: "emergency_kit_check",
    defaultLeadDays: 14,
    guidance:
      "Check scraper, snow brush, shovel, gloves, blanket, jumper cables, and other winter kit items.",
    recommendedMonthDay: "11-15",
  },
  {
    code: "battery_cold_check",
    defaultLeadDays: 14,
    guidance:
      "Cold weather stresses batteries and electrical systems; prompt drivers to inspect before winter.",
    recommendedMonthDay: "11-15",
  },
  {
    code: "summer_tire_wait",
    defaultLeadDays: 7,
    guidance:
      "After March 15, remind drivers that Quebec recommends waiting a few weeks before reinstalling summer or all-season tires.",
    recommendedMonthDay: "03-15",
  },
] as const;
