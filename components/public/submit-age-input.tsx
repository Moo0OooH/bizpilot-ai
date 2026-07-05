"use client";

/**
 * ============================================================
 * File: components/public/submit-age-input.tsx
 * Project: BizPilot AI
 * Description: Hidden submit-age marker for public quote abuse protection.
 * Role: Records initial render time so the server can reject unrealistically fast form submissions.
 * Related:
 * - components/public/quote-form-wizard.tsx
 * - server/services/public-intake.service.ts
 * Author: MoOoH
 * Created: 2026-05-22
 * Last Updated: 2026-07-05
 * Change Log:
 * - 2026-07-05: Added complete source header changelog for abuse-protection marker.
 * - 2026-05-22: Created submit-age hidden input for public quote abuse protection.
 * ============================================================
 */

import { useState } from "react";

export function SubmitAgeInput() {
  const [renderedAt] = useState(() => Date.now().toString());

  return (
    <input name="formRenderedAt" readOnly type="hidden" value={renderedAt} />
  );
}
