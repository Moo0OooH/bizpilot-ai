/**
 * ============================================================
 * File: server/repositories/businesses.repository.ts
 * Project: BizPilot AI
 * Description: Handles business tenant data access through Supabase RLS.
 * Role: Owns business reads, owner-created tenant inserts, and profile updates.
 * Related:
 * - server/services/business.service.ts
 * - server/repositories/business-members.repository.ts
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-13
 * Change Log:
 * - 2026-05-13: Enforced the server-only runtime boundary.
 * - 2026-05-04: Created Phase 2 businesses repository.
 * - 2026-05-04: Added server-only service-role option for sign-up tenant setup.
 * - 2026-05-04: Migrated business data access to official Supabase SDK clients.
 * - 2026-05-05: Added Phase 3 business profile update support.
 * ============================================================
 */

import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

export type BusinessRecord = Database["public"]["Tables"]["businesses"]["Row"];

export async function createBusinessForOwner(input: {
  name: string;
  ownerUserId: string;
  slug: string;
  supabase: SupabaseClient<Database>;
}): Promise<BusinessRecord> {
  const { data, error } = await input.supabase
    .from("businesses")
    .insert({
      name: input.name,
      owner_user_id: input.ownerUserId,
      slug: input.slug,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function listBusinessesForUser(input: {
  supabase: SupabaseClient<Database>;
}): Promise<BusinessRecord[]> {
  const { data, error } = await input.supabase
    .from("businesses")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateBusinessProfile(input: {
  businessId: string;
  name: string;
  slug: string;
  supabase: SupabaseClient<Database>;
}): Promise<BusinessRecord> {
  const { data, error } = await input.supabase
    .from("businesses")
    .update({
      name: input.name,
      slug: input.slug,
    })
    .eq("id", input.businessId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
