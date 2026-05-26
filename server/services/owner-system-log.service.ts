/**
 * ============================================================
 * File: server/services/owner-system-log.service.ts
 * Project: BizPilot AI
 * Description: Owner-visible system change history for workspace settings.
 * Role: Exposes founder/admin changes with trace IDs while preserving support-only note content.
 * Related:
 * - app/(dashboard)/dashboard/settings/page.tsx
 * - server/services/founder-admin.service.ts
 * - supabase/migrations/0021_session_policy_and_owner_audit.sql
 * Author: MoOoH
 * Created: 2026-05-25
 * ============================================================
 */

import "server-only";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { safeLogger } from "@/server/logging/safe-logger";
import type { Database } from "@/types/database";

type AdminActionLogRecord =
  Database["public"]["Tables"]["admin_action_log"]["Row"];

export type OwnerSystemChangeLogItem = Readonly<{
  actionType: AdminActionLogRecord["action_type"];
  createdAt: string;
  id: string;
  newValues: AdminActionLogRecord["new_values"];
  note: string | null;
  previousValues: AdminActionLogRecord["previous_values"];
}>;

function ownerVisibleNote(action: AdminActionLogRecord): string | null {
  if (action.action_type === "internal_note_added") {
    return null;
  }

  return action.note;
}

export async function getOwnerSystemChangeLog(input: {
  businessId: string;
  limit?: number;
  userId: string;
}): Promise<OwnerSystemChangeLogItem[]> {
  const supabase = createSupabaseServiceRoleClient();

  try {
    const { data: membership, error: membershipError } = await supabase
      .from("business_members")
      .select("id")
      .eq("business_id", input.businessId)
      .eq("user_id", input.userId)
      .eq("status", "active")
      .in("role", ["owner", "admin"])
      .maybeSingle();

    if (membershipError) {
      throw new Error(membershipError.message);
    }

    if (!membership) {
      return [];
    }

    const { data, error } = await supabase
      .from("admin_action_log")
      .select("*")
      .eq("business_id", input.businessId)
      .order("created_at", { ascending: false })
      .limit(input.limit ?? 10);

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map((action) => ({
      actionType: action.action_type,
      createdAt: action.created_at,
      id: action.id,
      newValues: action.new_values,
      note: ownerVisibleNote(action),
      previousValues: action.previous_values,
    }));
  } catch (error) {
    safeLogger.warn("owner_system_log.unavailable", {
      business_id: input.businessId,
      error_name: error instanceof Error ? error.name : "unknown",
    });

    return [];
  }
}
