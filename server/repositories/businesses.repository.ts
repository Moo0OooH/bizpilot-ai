/**
 * ============================================================
 * File: server/repositories/businesses.repository.ts
 * Project: BizPilot AI
 * Description: Handles Phase 2 business tenant data access through Supabase RLS.
 * Role: Owns business reads and owner-created tenant inserts.
 * Related:
 * - server/services/business.service.ts
 * - server/repositories/business-members.repository.ts
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-04
 * Change Log:
 * - 2026-05-04: Created Phase 2 businesses repository.
 * - 2026-05-04: Added server-only service-role option for sign-up tenant setup.
 * ============================================================
 */

import { requestSupabaseTable } from "@/lib/supabase/rest";

export type BusinessRecord = Readonly<{
  id: string;
  name: string;
  owner_user_id: string;
  slug: string;
}>;

export async function createBusinessForOwner(input: {
  accessToken?: string;
  name: string;
  ownerUserId: string;
  serviceRole?: boolean;
  slug: string;
}): Promise<BusinessRecord> {
  const businesses = await requestSupabaseTable<BusinessRecord[]>("businesses", {
    ...(input.accessToken ? { accessToken: input.accessToken } : {}),
    method: "POST",
    prefer: "return=representation",
    ...(input.serviceRole !== undefined ? { serviceRole: input.serviceRole } : {}),
    body: {
      name: input.name,
      owner_user_id: input.ownerUserId,
      slug: input.slug,
    },
  });

  if (!businesses[0]) {
    throw new Error("Supabase did not return the created business.");
  }

  return businesses[0];
}

export async function listBusinessesForUser(input: {
  accessToken: string;
}): Promise<BusinessRecord[]> {
  const query = new URLSearchParams({
    select: "id,name,slug,owner_user_id",
    order: "created_at.asc",
  });

  return requestSupabaseTable<BusinessRecord[]>("businesses", {
    accessToken: input.accessToken,
    query: query.toString(),
  });
}
