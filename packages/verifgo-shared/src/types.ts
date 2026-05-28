export type VerifGoLanguage = "en" | "fr";

export type VehicleUse = "delivery" | "personal" | "rideshare" | "taxi";

export type VehiclePowertrain =
  | "diesel"
  | "electric"
  | "gas"
  | "hybrid"
  | "plug_in_hybrid";

export type InspectionItemStatus = "defect" | "na" | "ok";

export type DefectSeverity = "major" | "minor" | "unknown";

export type ReportStatus = "corrected" | "draft" | "submitted" | "voided";

export type SyncStatus = "failed" | "local_only" | "synced";

export type VehicleSetup = Readonly<{
  accessoryNumber: string | null;
  isDefault: boolean;
  make: string | null;
  model: string | null;
  photoPath: string | null;
  plateNumber: string;
  powertrain: VehiclePowertrain;
  vehicleUse: VehicleUse;
  year: number | null;
}>;

export type SmartReminderCode =
  | "battery_cold_check"
  | "emergency_kit_check"
  | "summer_tire_wait"
  | "washer_fluid_winter"
  | "winter_tire_deadline"
  | "winter_tire_install";

export type DailyReportDraft = Readonly<{
  allRequiredItemsConfirmed: boolean;
  clientSubmittedAt: string | null;
  defects: readonly ReportDefectInput[];
  gpsConsentGiven: boolean;
  inspectionItems: readonly DailyReportItemInput[];
  odometerReading: number;
  offlineCreated: boolean;
  reportDate: string;
  vehicleId: string;
}>;

export type DailyReportItemInput = Readonly<{
  itemCode: string;
  status: InspectionItemStatus;
}>;

export type ReportDefectInput = Readonly<{
  description: string;
  itemCode: string;
  photoPath?: string | null;
  severity: DefectSeverity;
}>;

export type ValidationResult = Readonly<{
  errors: readonly string[];
  ok: boolean;
}>;
