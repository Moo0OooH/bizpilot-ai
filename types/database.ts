/**
 * ============================================================
 * File: types/database.ts
 * Project: BizPilot AI
 * Description: Defines the Phase 3 Supabase database type surface.
 * Role: Provides typed Supabase clients for auth, tenant, and business configuration tables.
 * Related:
 * - supabase/migrations/0001_auth_tenant_foundation.sql
 * - lib/supabase/server.ts
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-04
 * Change Log:
 * - 2026-05-04: Created Phase 2 database types for Supabase SDK clients.
 * - 2026-05-05: Added Phase 3 business and Cleaning template configuration tables.
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
      business_branding: {
        Row: {
          accent_color: string;
          business_id: string;
          created_at: Timestamp;
          logo_url: string | null;
          primary_color: string;
          updated_at: Timestamp;
        };
        Insert: {
          accent_color?: string;
          business_id: string;
          created_at?: Timestamp;
          logo_url?: string | null;
          primary_color?: string;
          updated_at?: Timestamp;
        };
        Update: {
          accent_color?: string;
          business_id?: string;
          created_at?: Timestamp;
          logo_url?: string | null;
          primary_color?: string;
          updated_at?: Timestamp;
        };
        Relationships: [];
      };
      business_consent_settings: {
        Row: {
          ai_disclosure_enabled: boolean;
          business_id: string;
          consent_notice: string;
          created_at: Timestamp;
          privacy_contact_email: string | null;
          updated_at: Timestamp;
        };
        Insert: {
          ai_disclosure_enabled?: boolean;
          business_id: string;
          consent_notice?: string;
          created_at?: Timestamp;
          privacy_contact_email?: string | null;
          updated_at?: Timestamp;
        };
        Update: {
          ai_disclosure_enabled?: boolean;
          business_id?: string;
          consent_notice?: string;
          created_at?: Timestamp;
          privacy_contact_email?: string | null;
          updated_at?: Timestamp;
        };
        Relationships: [];
      };
      business_faqs: {
        Row: {
          answer: string;
          business_id: string;
          created_at: Timestamp;
          id: string;
          is_active: boolean;
          question: string;
          sort_order: number;
          updated_at: Timestamp;
        };
        Insert: {
          answer: string;
          business_id: string;
          created_at?: Timestamp;
          id?: string;
          is_active?: boolean;
          question: string;
          sort_order?: number;
          updated_at?: Timestamp;
        };
        Update: {
          answer?: string;
          business_id?: string;
          created_at?: Timestamp;
          id?: string;
          is_active?: boolean;
          question?: string;
          sort_order?: number;
          updated_at?: Timestamp;
        };
        Relationships: [];
      };
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
      business_onboarding_tasks: {
        Row: {
          business_id: string;
          completed_at: Timestamp | null;
          created_at: Timestamp;
          id: string;
          label: string;
          sort_order: number;
          task_key: string;
          updated_at: Timestamp;
        };
        Insert: {
          business_id: string;
          completed_at?: Timestamp | null;
          created_at?: Timestamp;
          id?: string;
          label: string;
          sort_order?: number;
          task_key: string;
          updated_at?: Timestamp;
        };
        Update: {
          business_id?: string;
          completed_at?: Timestamp | null;
          created_at?: Timestamp;
          id?: string;
          label?: string;
          sort_order?: number;
          task_key?: string;
          updated_at?: Timestamp;
        };
        Relationships: [];
      };
      business_privacy_settings: {
        Row: {
          business_id: string;
          created_at: Timestamp;
          privacy_mode: "forward_only" | "minimal" | "standard";
          retain_leads_days: number;
          updated_at: Timestamp;
        };
        Insert: {
          business_id: string;
          created_at?: Timestamp;
          privacy_mode?: "forward_only" | "minimal" | "standard";
          retain_leads_days?: number;
          updated_at?: Timestamp;
        };
        Update: {
          business_id?: string;
          created_at?: Timestamp;
          privacy_mode?: "forward_only" | "minimal" | "standard";
          retain_leads_days?: number;
          updated_at?: Timestamp;
        };
        Relationships: [];
      };
      business_service_areas: {
        Row: {
          business_id: string;
          created_at: Timestamp;
          id: string;
          is_active: boolean;
          name: string;
          sort_order: number;
          updated_at: Timestamp;
        };
        Insert: {
          business_id: string;
          created_at?: Timestamp;
          id?: string;
          is_active?: boolean;
          name: string;
          sort_order?: number;
          updated_at?: Timestamp;
        };
        Update: {
          business_id?: string;
          created_at?: Timestamp;
          id?: string;
          is_active?: boolean;
          name?: string;
          sort_order?: number;
          updated_at?: Timestamp;
        };
        Relationships: [];
      };
      business_services: {
        Row: {
          business_id: string;
          created_at: Timestamp;
          description: string | null;
          id: string;
          is_active: boolean;
          name: string;
          sort_order: number;
          updated_at: Timestamp;
        };
        Insert: {
          business_id: string;
          created_at?: Timestamp;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
          sort_order?: number;
          updated_at?: Timestamp;
        };
        Update: {
          business_id?: string;
          created_at?: Timestamp;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          sort_order?: number;
          updated_at?: Timestamp;
        };
        Relationships: [];
      };
      business_template_settings: {
        Row: {
          business_id: string;
          created_at: Timestamp;
          custom_name: string | null;
          field_overrides: Json;
          id: string;
          is_active: boolean;
          template_id: string;
          updated_at: Timestamp;
        };
        Insert: {
          business_id: string;
          created_at?: Timestamp;
          custom_name?: string | null;
          field_overrides?: Json;
          id?: string;
          is_active?: boolean;
          template_id: string;
          updated_at?: Timestamp;
        };
        Update: {
          business_id?: string;
          created_at?: Timestamp;
          custom_name?: string | null;
          field_overrides?: Json;
          id?: string;
          is_active?: boolean;
          template_id?: string;
          updated_at?: Timestamp;
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
      industry_template_fields: {
        Row: {
          created_at: Timestamp;
          field_key: string;
          field_type:
            | "boolean"
            | "date"
            | "email"
            | "number"
            | "phone"
            | "select"
            | "text"
            | "textarea"
            | "time_window";
          help_text: string | null;
          id: string;
          is_active: boolean;
          is_required: boolean;
          label: string;
          options: Json;
          sort_order: number;
          template_id: string;
          updated_at: Timestamp;
        };
        Insert: {
          created_at?: Timestamp;
          field_key: string;
          field_type:
            | "boolean"
            | "date"
            | "email"
            | "number"
            | "phone"
            | "select"
            | "text"
            | "textarea"
            | "time_window";
          help_text?: string | null;
          id?: string;
          is_active?: boolean;
          is_required?: boolean;
          label: string;
          options?: Json;
          sort_order?: number;
          template_id: string;
          updated_at?: Timestamp;
        };
        Update: {
          created_at?: Timestamp;
          field_key?: string;
          field_type?:
            | "boolean"
            | "date"
            | "email"
            | "number"
            | "phone"
            | "select"
            | "text"
            | "textarea"
            | "time_window";
          help_text?: string | null;
          id?: string;
          is_active?: boolean;
          is_required?: boolean;
          label?: string;
          options?: Json;
          sort_order?: number;
          template_id?: string;
          updated_at?: Timestamp;
        };
        Relationships: [];
      };
      industry_templates: {
        Row: {
          created_at: Timestamp;
          description: string | null;
          id: string;
          is_active: boolean;
          name: string;
          slug: string;
          updated_at: Timestamp;
          vertical_id: string;
        };
        Insert: {
          created_at?: Timestamp;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
          slug: string;
          updated_at?: Timestamp;
          vertical_id: string;
        };
        Update: {
          created_at?: Timestamp;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          slug?: string;
          updated_at?: Timestamp;
          vertical_id?: string;
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
      verticals: {
        Row: {
          created_at: Timestamp;
          description: string | null;
          id: string;
          is_active: boolean;
          name: string;
          slug: string;
          updated_at: Timestamp;
        };
        Insert: {
          created_at?: Timestamp;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
          slug: string;
          updated_at?: Timestamp;
        };
        Update: {
          created_at?: Timestamp;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          slug?: string;
          updated_at?: Timestamp;
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
