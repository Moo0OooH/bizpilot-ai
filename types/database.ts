/**
 * ============================================================
 * File: types/database.ts
 * Project: BizPilot AI
 * Description: Defines the Phase 2 Supabase database type surface.
 * Role: Provides typed Supabase clients for auth and tenant foundation tables.
 * Related:
 * - supabase/migrations/0001_auth_tenant_foundation.sql
 * - lib/supabase/server.ts
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-04
 * Change Log:
 * - 2026-05-04: Created Phase 2 database types for Supabase SDK clients.
 * ============================================================
 */

export type Json =
  | boolean
  | null
  | number
  | string
  | Json[]
  | { [key: string]: Json | undefined };

type Timestamp = string;

export type Database = {
  public: {
    Tables: {
      business_members: {
        Row: {
          business_id: string;
          created_at: Timestamp;
          id: string;
          role: "admin" | "concierge_limited" | "member" | "owner";
          user_id: string;
        };
        Insert: {
          business_id: string;
          created_at?: Timestamp;
          id?: string;
          role: "admin" | "concierge_limited" | "member" | "owner";
          user_id: string;
        };
        Update: {
          business_id?: string;
          created_at?: Timestamp;
          id?: string;
          role?: "admin" | "concierge_limited" | "member" | "owner";
          user_id?: string;
        };
        Relationships: [];
      };
      businesses: {
        Row: {
          created_at: Timestamp;
          id: string;
          name: string;
          owner_user_id: string;
          slug: string;
          updated_at: Timestamp;
        };
        Insert: {
          created_at?: Timestamp;
          id?: string;
          name: string;
          owner_user_id: string;
          slug: string;
          updated_at?: Timestamp;
        };
        Update: {
          created_at?: Timestamp;
          id?: string;
          name?: string;
          owner_user_id?: string;
          slug?: string;
          updated_at?: Timestamp;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: Timestamp;
          display_name: string | null;
          id: string;
          updated_at: Timestamp;
          user_id: string;
        };
        Insert: {
          created_at?: Timestamp;
          display_name?: string | null;
          id?: string;
          updated_at?: Timestamp;
          user_id: string;
        };
        Update: {
          created_at?: Timestamp;
          display_name?: string | null;
          id?: string;
          updated_at?: Timestamp;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      can_manage_business: {
        Args: { target_business_id: string };
        Returns: boolean;
      };
      is_business_member: {
        Args: { target_business_id: string };
        Returns: boolean;
      };
      owns_business: {
        Args: { target_business_id: string };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
