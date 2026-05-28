export type VerifGoLanguage = "en" | "fr";

export type VehicleType = "rideshare" | "taxi" | "ev" | "hybrid" | "other";

export type InspectionItemStatus = "defect" | "na" | "ok";

export type DefectSeverity = "major" | "minor" | "unknown";

export type ReportStatus = "corrected" | "draft" | "submitted" | "voided";

export type SyncStatus = "failed" | "local_only" | "synced";

export type VehicleSetup = Readonly<{
  accessoryNumber: string | null;
  isDefault: boolean;
  make: string | null;
  model: string | null;
  plateNumber: string;
  vehicleType: VehicleType;
  year: number | null;
}>;

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
