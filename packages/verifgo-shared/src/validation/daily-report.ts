import type { DailyReportDraft, ValidationResult } from "../types.ts";

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function validateDailyReportDraft(
  draft: DailyReportDraft,
): ValidationResult {
  const errors: string[] = [];

  if (!draft.vehicleId) {
    errors.push("vehicle_required");
  }

  if (!ISO_DATE_PATTERN.test(draft.reportDate)) {
    errors.push("report_date_invalid");
  }

  if (!Number.isInteger(draft.odometerReading) || draft.odometerReading < 0) {
    errors.push("odometer_invalid");
  }

  if (draft.inspectionItems.length === 0) {
    errors.push("inspection_items_required");
  }

  if (!draft.allRequiredItemsConfirmed) {
    errors.push("required_items_not_confirmed");
  }

  for (const defect of draft.defects) {
    if (!defect.itemCode) {
      errors.push("defect_item_required");
    }

    if (defect.description.trim().length < 3) {
      errors.push("defect_description_required");
    }
  }

  return {
    errors,
    ok: errors.length === 0,
  };
}
