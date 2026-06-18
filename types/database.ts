/**
 * ============================================================
 * File: types/database.ts
 * Project: BizPilot AI
 * Description: Defines the Phase 5 Supabase database type surface.
 * Role: Provides typed Supabase clients for auth, tenant, configuration, public intake, and lead conversion tables.
 * Related:
 * - supabase/migrations/0001_auth_tenant_foundation.sql
 * - lib/supabase/server.ts
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-04
 * Change Log:
 * - 2026-05-04: Created Phase 2 database types for Supabase SDK clients.
 * - 2026-05-05: Added Phase 3 business and Cleaning template configuration tables.
 * - 2026-05-05: Aligned template field edits with business_template_settings.
 * - 2026-05-06: Added Phase 4 public intake, submission, lead, consent, and source tables.
 * - 2026-05-07: Added Phase 5 lead conversion desk tables and lead workflow fields.
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
type WorkspaceKind = "demo" | "founder_test" | "production_customer" | "seed";
type SessionTimeoutMode = "after_duration" | "always_on";
type BusinessLifecycleStatus =
  | "active"
  | "archived"
  | "deleted"
  | "deleting"
  | "deletion_requested";
type BusinessDeletionRequestStatus =
  | "approved"
  | "cancelled"
  | "completed"
  | "pending"
  | "processing"
  | "rejected";
type BusinessDeletionRequestType = "production_deletion" | "test_cleanup";
type BusinessDeletionReasonCode =
  | "cleanup"
  | "duplicate_workspace"
  | "fake_test_data"
  | "no_longer_needed"
  | "other"
  | "pilot_ended"
  | "privacy_request"
  | "switching_tools";
type BusinessDeletionMode =
  | "production_anonymization"
  | "production_purge"
  | "test_hard_purge";
type BusinessDeletionActorType = "founder" | "owner" | "system";

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
          status: "active" | "disabled";
          user_id: string;
        };
        Insert: {
          business_id: string;
          created_at?: Timestamp;
          id?: string;
          role: "admin" | "concierge_limited" | "member" | "owner";
          status?: "active" | "disabled";
          user_id: string;
        };
        Update: {
          business_id?: string;
          created_at?: Timestamp;
          id?: string;
          role?: "admin" | "concierge_limited" | "member" | "owner";
          status?: "active" | "disabled";
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
          deleted_at: Timestamp | null;
          deletion_requested_at: Timestamp | null;
          id: string;
          internal_note: string | null;
          lifecycle_status: BusinessLifecycleStatus;
          lifecycle_updated_at: Timestamp;
          name: string;
          owner_user_id: string;
          plan_expires_at: Timestamp | null;
          plan_slug: "founder_pilot" | "paused" | "pro" | "starter";
          plan_started_at: Timestamp;
          preferred_language: "en" | "fr-CA";
          session_timeout_minutes: number | null;
          session_timeout_mode: SessionTimeoutMode;
          slug: string;
          status: "active" | "cancelled" | "onboarding" | "suspended";
          updated_at: Timestamp;
          workspace_kind: WorkspaceKind;
        };
        Insert: {
          created_at?: Timestamp;
          deleted_at?: Timestamp | null;
          deletion_requested_at?: Timestamp | null;
          id?: string;
          internal_note?: string | null;
          lifecycle_status?: BusinessLifecycleStatus;
          lifecycle_updated_at?: Timestamp;
          name: string;
          owner_user_id: string;
          plan_expires_at?: Timestamp | null;
          plan_slug?: "founder_pilot" | "paused" | "pro" | "starter";
          plan_started_at?: Timestamp;
          preferred_language?: "en" | "fr-CA";
          session_timeout_minutes?: number | null;
          session_timeout_mode?: SessionTimeoutMode;
          slug: string;
          status?: "active" | "cancelled" | "onboarding" | "suspended";
          updated_at?: Timestamp;
          workspace_kind?: WorkspaceKind;
        };
        Update: {
          created_at?: Timestamp;
          deleted_at?: Timestamp | null;
          deletion_requested_at?: Timestamp | null;
          id?: string;
          internal_note?: string | null;
          lifecycle_status?: BusinessLifecycleStatus;
          lifecycle_updated_at?: Timestamp;
          name?: string;
          owner_user_id?: string;
          plan_expires_at?: Timestamp | null;
          plan_slug?: "founder_pilot" | "paused" | "pro" | "starter";
          plan_started_at?: Timestamp;
          preferred_language?: "en" | "fr-CA";
          session_timeout_minutes?: number | null;
          session_timeout_mode?: SessionTimeoutMode;
          slug?: string;
          status?: "active" | "cancelled" | "onboarding" | "suspended";
          updated_at?: Timestamp;
          workspace_kind?: WorkspaceKind;
        };
        Relationships: [];
      };
      business_deletion_requests: {
        Row: {
          approved_at: Timestamp | null;
          approved_by_user_id: string | null;
          business_id: string;
          cancelled_at: Timestamp | null;
          cancelled_by_user_id: string | null;
          completed_at: Timestamp | null;
          created_at: Timestamp;
          id: string;
          processing_started_at: Timestamp | null;
          reason_code: BusinessDeletionReasonCode | null;
          rejected_at: Timestamp | null;
          request_type: BusinessDeletionRequestType;
          requested_at: Timestamp;
          requested_by_user_id: string;
          status: BusinessDeletionRequestStatus;
          updated_at: Timestamp;
        };
        Insert: {
          approved_at?: Timestamp | null;
          approved_by_user_id?: string | null;
          business_id: string;
          cancelled_at?: Timestamp | null;
          cancelled_by_user_id?: string | null;
          completed_at?: Timestamp | null;
          created_at?: Timestamp;
          id?: string;
          processing_started_at?: Timestamp | null;
          reason_code?: BusinessDeletionReasonCode | null;
          rejected_at?: Timestamp | null;
          request_type?: BusinessDeletionRequestType;
          requested_at?: Timestamp;
          requested_by_user_id: string;
          status?: BusinessDeletionRequestStatus;
          updated_at?: Timestamp;
        };
        Update: {
          approved_at?: Timestamp | null;
          approved_by_user_id?: string | null;
          business_id?: string;
          cancelled_at?: Timestamp | null;
          cancelled_by_user_id?: string | null;
          completed_at?: Timestamp | null;
          created_at?: Timestamp;
          id?: string;
          processing_started_at?: Timestamp | null;
          reason_code?: BusinessDeletionReasonCode | null;
          rejected_at?: Timestamp | null;
          request_type?: BusinessDeletionRequestType;
          requested_at?: Timestamp;
          requested_by_user_id?: string;
          status?: BusinessDeletionRequestStatus;
          updated_at?: Timestamp;
        };
        Relationships: [];
      };
      business_deletion_tombstones: {
        Row: {
          anonymized_tables: string[];
          audit_version: string;
          business_id: string;
          completed_at: Timestamp;
          completed_by_actor_type: BusinessDeletionActorType;
          deletion_mode: BusinessDeletionMode;
          deletion_request_id: string | null;
          id: string;
          purged_tables: string[];
          reason_code: BusinessDeletionReasonCode | null;
          retained_reason_code: string | null;
          workspace_kind: WorkspaceKind;
        };
        Insert: {
          anonymized_tables?: string[];
          audit_version?: string;
          business_id: string;
          completed_at?: Timestamp;
          completed_by_actor_type: BusinessDeletionActorType;
          deletion_mode: BusinessDeletionMode;
          deletion_request_id?: string | null;
          id?: string;
          purged_tables?: string[];
          reason_code?: BusinessDeletionReasonCode | null;
          retained_reason_code?: string | null;
          workspace_kind: WorkspaceKind;
        };
        Update: {
          anonymized_tables?: string[];
          audit_version?: string;
          business_id?: string;
          completed_at?: Timestamp;
          completed_by_actor_type?: BusinessDeletionActorType;
          deletion_mode?: BusinessDeletionMode;
          deletion_request_id?: string | null;
          id?: string;
          purged_tables?: string[];
          reason_code?: BusinessDeletionReasonCode | null;
          retained_reason_code?: string | null;
          workspace_kind?: WorkspaceKind;
        };
        Relationships: [];
      };
      admin_action_log: {
        Row: {
          action_type:
            | "business_cancelled"
            | "business_deletion_requested"
            | "business_reactivated"
            | "business_suspended"
            | "internal_note_added"
            | "password_reset_requested"
            | "plan_changed"
            | "quote_link_disabled"
            | "quote_link_enabled"
            | "session_policy_changed"
            | "status_changed"
            | "temporary_password_set"
            | "test_auth_user_deleted"
            | "test_workspace_cleanup_completed";
          actor_user_id: string | null;
          business_id: string | null;
          created_at: Timestamp;
          id: string;
          new_values: Json;
          note: string | null;
          previous_values: Json;
        };
        Insert: {
          action_type:
            | "business_cancelled"
            | "business_deletion_requested"
            | "business_reactivated"
            | "business_suspended"
            | "internal_note_added"
            | "password_reset_requested"
            | "plan_changed"
            | "quote_link_disabled"
            | "quote_link_enabled"
            | "session_policy_changed"
            | "status_changed"
            | "temporary_password_set"
            | "test_auth_user_deleted"
            | "test_workspace_cleanup_completed";
          actor_user_id?: string | null;
          business_id?: string | null;
          created_at?: Timestamp;
          id?: string;
          new_values?: Json;
          note?: string | null;
          previous_values?: Json;
        };
        Update: {
          action_type?:
            | "business_cancelled"
            | "business_deletion_requested"
            | "business_reactivated"
            | "business_suspended"
            | "internal_note_added"
            | "password_reset_requested"
            | "plan_changed"
            | "quote_link_disabled"
            | "quote_link_enabled"
            | "session_policy_changed"
            | "status_changed"
            | "temporary_password_set"
            | "test_auth_user_deleted"
            | "test_workspace_cleanup_completed";
          actor_user_id?: string | null;
          business_id?: string | null;
          created_at?: Timestamp;
          id?: string;
          new_values?: Json;
          note?: string | null;
          previous_values?: Json;
        };
        Relationships: [];
      };
      consent_versions: {
        Row: {
          ai_disclosure_enabled: boolean;
          business_id: string;
          consent_notice: string;
          created_at: Timestamp;
          id: string;
          is_active: boolean;
          privacy_contact_email: string | null;
          updated_at: Timestamp;
          version_label: string;
        };
        Insert: {
          ai_disclosure_enabled?: boolean;
          business_id: string;
          consent_notice: string;
          created_at?: Timestamp;
          id?: string;
          is_active?: boolean;
          privacy_contact_email?: string | null;
          updated_at?: Timestamp;
          version_label?: string;
        };
        Update: {
          ai_disclosure_enabled?: boolean;
          business_id?: string;
          consent_notice?: string;
          created_at?: Timestamp;
          id?: string;
          is_active?: boolean;
          privacy_contact_email?: string | null;
          updated_at?: Timestamp;
          version_label?: string;
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
            | "radio"
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
            | "radio"
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
            | "radio"
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
      intake_form_fields: {
        Row: {
          business_id: string;
          created_at: Timestamp;
          field_key: string;
          field_type:
            | "boolean"
            | "date"
            | "email"
            | "number"
            | "phone"
            | "radio"
            | "select"
            | "text"
            | "textarea"
            | "time_window";
          help_text: string | null;
          id: string;
          intake_form_id: string;
          is_hidden: boolean;
          is_required: boolean;
          label: string;
          options: Json;
          sort_order: number;
          template_field_id: string | null;
          updated_at: Timestamp;
        };
        Insert: {
          business_id: string;
          created_at?: Timestamp;
          field_key: string;
          field_type:
            | "boolean"
            | "date"
            | "email"
            | "number"
            | "phone"
            | "radio"
            | "select"
            | "text"
            | "textarea"
            | "time_window";
          help_text?: string | null;
          id?: string;
          intake_form_id: string;
          is_hidden?: boolean;
          is_required?: boolean;
          label: string;
          options?: Json;
          sort_order?: number;
          template_field_id?: string | null;
          updated_at?: Timestamp;
        };
        Update: {
          business_id?: string;
          created_at?: Timestamp;
          field_key?: string;
          field_type?:
            | "boolean"
            | "date"
            | "email"
            | "number"
            | "phone"
            | "radio"
            | "select"
            | "text"
            | "textarea"
            | "time_window";
          help_text?: string | null;
          id?: string;
          intake_form_id?: string;
          is_hidden?: boolean;
          is_required?: boolean;
          label?: string;
          options?: Json;
          sort_order?: number;
          template_field_id?: string | null;
          updated_at?: Timestamp;
        };
        Relationships: [];
      };
      intake_forms: {
        Row: {
          business_id: string;
          created_at: Timestamp;
          id: string;
          is_active: boolean;
          name: string;
          privacy_mode: "minimal" | "standard";
          template_id: string;
          updated_at: Timestamp;
        };
        Insert: {
          business_id: string;
          created_at?: Timestamp;
          id?: string;
          is_active?: boolean;
          name: string;
          privacy_mode?: "minimal" | "standard";
          template_id: string;
          updated_at?: Timestamp;
        };
        Update: {
          business_id?: string;
          created_at?: Timestamp;
          id?: string;
          is_active?: boolean;
          name?: string;
          privacy_mode?: "minimal" | "standard";
          template_id?: string;
          updated_at?: Timestamp;
        };
        Relationships: [];
      };
      intake_submission_values: {
        Row: {
          business_id: string;
          created_at: Timestamp;
          field_key: string;
          field_label: string;
          field_value: Json;
          id: string;
          submission_id: string;
        };
        Insert: {
          business_id: string;
          created_at?: Timestamp;
          field_key: string;
          field_label: string;
          field_value?: Json;
          id?: string;
          submission_id: string;
        };
        Update: {
          business_id?: string;
          created_at?: Timestamp;
          field_key?: string;
          field_label?: string;
          field_value?: Json;
          id?: string;
          submission_id?: string;
        };
        Relationships: [];
      };
      intake_submissions: {
        Row: {
          business_id: string;
          consent_accepted_at: Timestamp;
          consent_version_id: string;
          created_at: Timestamp;
          delete_request_status: "completed" | "none" | "requested";
          id: string;
          intake_form_id: string;
          privacy_mode: "minimal" | "standard";
          status: "archived" | "reviewed" | "submitted";
        };
        Insert: {
          business_id: string;
          consent_accepted_at: Timestamp;
          consent_version_id: string;
          created_at?: Timestamp;
          delete_request_status?: "completed" | "none" | "requested";
          id?: string;
          intake_form_id: string;
          privacy_mode?: "minimal" | "standard";
          status?: "archived" | "reviewed" | "submitted";
        };
        Update: {
          business_id?: string;
          consent_accepted_at?: Timestamp;
          consent_version_id?: string;
          created_at?: Timestamp;
          delete_request_status?: "completed" | "none" | "requested";
          id?: string;
          intake_form_id?: string;
          privacy_mode?: "minimal" | "standard";
          status?: "archived" | "reviewed" | "submitted";
        };
        Relationships: [];
      };
      lead_source_metadata: {
        Row: {
          business_id: string;
          created_at: Timestamp;
          id: string;
          lead_id: string;
          referrer: string | null;
          source_channel: string | null;
          source_url: string | null;
          utm_campaign: string | null;
          utm_medium: string | null;
          utm_source: string | null;
        };
        Insert: {
          business_id: string;
          created_at?: Timestamp;
          id?: string;
          lead_id: string;
          referrer?: string | null;
          source_channel?: string | null;
          source_url?: string | null;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
        };
        Update: {
          business_id?: string;
          created_at?: Timestamp;
          id?: string;
          lead_id?: string;
          referrer?: string | null;
          source_channel?: string | null;
          source_url?: string | null;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
        };
        Relationships: [];
      };
      ai_outputs: {
        Row: {
          business_id: string;
          cached_tokens: number;
          created_at: Timestamp;
          error_message: string | null;
          estimated_cost: number;
          id: string;
          input_hash: string;
          input_tokens: number;
          lead_id: string;
          model: string;
          output: Json;
          output_tokens: number;
          output_type: "lead_conversion_bundle";
          prompt_name: string;
          prompt_version: string;
          provider: "openai" | "rule_fallback";
          status: "failed" | "fallback" | "generated";
          updated_at: Timestamp;
        };
        Insert: {
          business_id: string;
          cached_tokens?: number;
          created_at?: Timestamp;
          error_message?: string | null;
          estimated_cost?: number;
          id?: string;
          input_hash: string;
          input_tokens?: number;
          lead_id: string;
          model: string;
          output?: Json;
          output_tokens?: number;
          output_type: "lead_conversion_bundle";
          prompt_name: string;
          prompt_version: string;
          provider?: "openai" | "rule_fallback";
          status?: "failed" | "fallback" | "generated";
          updated_at?: Timestamp;
        };
        Update: {
          business_id?: string;
          cached_tokens?: number;
          created_at?: Timestamp;
          error_message?: string | null;
          estimated_cost?: number;
          id?: string;
          input_hash?: string;
          input_tokens?: number;
          lead_id?: string;
          model?: string;
          output?: Json;
          output_tokens?: number;
          output_type?: "lead_conversion_bundle";
          prompt_name?: string;
          prompt_version?: string;
          provider?: "openai" | "rule_fallback";
          status?: "failed" | "fallback" | "generated";
          updated_at?: Timestamp;
        };
        Relationships: [];
      };
      lead_action_items: {
        Row: {
          action_type: "ask_info" | "follow_up" | "reply";
          business_id: string;
          completed_at: Timestamp | null;
          created_at: Timestamp;
          due_at: Timestamp | null;
          id: string;
          lead_id: string;
          status: "completed" | "dismissed" | "open";
          title: string;
          updated_at: Timestamp;
        };
        Insert: {
          action_type: "ask_info" | "follow_up" | "reply";
          business_id: string;
          completed_at?: Timestamp | null;
          created_at?: Timestamp;
          due_at?: Timestamp | null;
          id?: string;
          lead_id: string;
          status?: "completed" | "dismissed" | "open";
          title: string;
          updated_at?: Timestamp;
        };
        Update: {
          action_type?: "ask_info" | "follow_up" | "reply";
          business_id?: string;
          completed_at?: Timestamp | null;
          created_at?: Timestamp;
          due_at?: Timestamp | null;
          id?: string;
          lead_id?: string;
          status?: "completed" | "dismissed" | "open";
          title?: string;
          updated_at?: Timestamp;
        };
        Relationships: [];
      };
      lead_events: {
        Row: {
          actor_user_id: string | null;
          business_id: string;
          created_at: Timestamp;
          event_label: string;
          event_type:
            | "action_completed"
            | "follow_up_marked"
            | "lead_created"
            | "lead_viewed"
            | "outcome_marked"
            | "reply_copied"
            | "score_calculated"
            | "status_changed";
          id: string;
          lead_id: string;
          metadata: Json;
        };
        Insert: {
          actor_user_id?: string | null;
          business_id: string;
          created_at?: Timestamp;
          event_label: string;
          event_type:
            | "action_completed"
            | "follow_up_marked"
            | "lead_created"
            | "lead_viewed"
            | "outcome_marked"
            | "reply_copied"
            | "score_calculated"
            | "status_changed";
          id?: string;
          lead_id: string;
          metadata?: Json;
        };
        Update: {
          actor_user_id?: string | null;
          business_id?: string;
          created_at?: Timestamp;
          event_label?: string;
          event_type?:
            | "action_completed"
            | "follow_up_marked"
            | "lead_created"
            | "lead_viewed"
            | "outcome_marked"
            | "reply_copied"
            | "score_calculated"
            | "status_changed";
          id?: string;
          lead_id?: string;
          metadata?: Json;
        };
        Relationships: [];
      };
      lead_quality_scores: {
        Row: {
          business_id: string;
          calculated_at: Timestamp;
          completeness_label:
            | "complete"
            | "mostly_complete"
            | "needs_info"
            | "poor";
          completeness_score: number;
          created_at: Timestamp;
          explanation: string;
          id: string;
          lead_id: string;
          missing_info_keys: string[];
          quality_level: "good" | "low_fit" | "needs_info" | "strong";
          updated_at: Timestamp;
        };
        Insert: {
          business_id: string;
          calculated_at?: Timestamp;
          completeness_label:
            | "complete"
            | "mostly_complete"
            | "needs_info"
            | "poor";
          completeness_score: number;
          created_at?: Timestamp;
          explanation: string;
          id?: string;
          lead_id: string;
          missing_info_keys?: string[];
          quality_level: "good" | "low_fit" | "needs_info" | "strong";
          updated_at?: Timestamp;
        };
        Update: {
          business_id?: string;
          calculated_at?: Timestamp;
          completeness_label?:
            | "complete"
            | "mostly_complete"
            | "needs_info"
            | "poor";
          completeness_score?: number;
          created_at?: Timestamp;
          explanation?: string;
          id?: string;
          lead_id?: string;
          missing_info_keys?: string[];
          quality_level?: "good" | "low_fit" | "needs_info" | "strong";
          updated_at?: Timestamp;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          business_id: string;
          city_or_service_area: string | null;
          created_at: Timestamp;
          customer_contact: string | null;
          customer_name: string | null;
          first_reply_copied_at: Timestamp | null;
          first_response_latency: string | null;
          first_viewed_at: Timestamp | null;
          id: string;
          intake_submission_id: string;
          last_owner_action_at: Timestamp | null;
          manual_outcome:
            | "asked_info"
            | "booked"
            | "lost"
            | "no_response"
            | "not_a_fit"
            | null;
          response_sla_state:
            | "follow_up_due"
            | "new"
            | "overdue"
            | "reply_copied"
            | "viewed";
          response_status:
            | "follow_up_due"
            | "new"
            | "overdue"
            | "reply_copied"
            | "viewed";
          service_type: string | null;
          source_channel: string | null;
          status:
            | "archived"
            | "booked"
            | "follow_up_needed"
            | "lost"
            | "new"
            | "replied"
            | "reviewed";
          updated_at: Timestamp;
        };
        Insert: {
          business_id: string;
          city_or_service_area?: string | null;
          created_at?: Timestamp;
          customer_contact?: string | null;
          customer_name?: string | null;
          first_reply_copied_at?: Timestamp | null;
          first_response_latency?: string | null;
          first_viewed_at?: Timestamp | null;
          id?: string;
          intake_submission_id: string;
          last_owner_action_at?: Timestamp | null;
          manual_outcome?:
            | "asked_info"
            | "booked"
            | "lost"
            | "no_response"
            | "not_a_fit"
            | null;
          response_sla_state?:
            | "follow_up_due"
            | "new"
            | "overdue"
            | "reply_copied"
            | "viewed";
          response_status?:
            | "follow_up_due"
            | "new"
            | "overdue"
            | "reply_copied"
            | "viewed";
          service_type?: string | null;
          source_channel?: string | null;
          status?:
            | "archived"
            | "booked"
            | "follow_up_needed"
            | "lost"
            | "new"
            | "replied"
            | "reviewed";
          updated_at?: Timestamp;
        };
        Update: {
          business_id?: string;
          city_or_service_area?: string | null;
          created_at?: Timestamp;
          customer_contact?: string | null;
          customer_name?: string | null;
          first_reply_copied_at?: Timestamp | null;
          first_response_latency?: string | null;
          first_viewed_at?: Timestamp | null;
          id?: string;
          intake_submission_id?: string;
          last_owner_action_at?: Timestamp | null;
          manual_outcome?:
            | "asked_info"
            | "booked"
            | "lost"
            | "no_response"
            | "not_a_fit"
            | null;
          response_sla_state?:
            | "follow_up_due"
            | "new"
            | "overdue"
            | "reply_copied"
            | "viewed";
          response_status?:
            | "follow_up_due"
            | "new"
            | "overdue"
            | "reply_copied"
            | "viewed";
          service_type?: string | null;
          source_channel?: string | null;
          status?:
            | "archived"
            | "booked"
            | "follow_up_needed"
            | "lost"
            | "new"
            | "replied"
            | "reviewed";
          updated_at?: Timestamp;
        };
        Relationships: [];
      };
      usage_events: {
        Row: {
          business_id: string;
          cached_tokens: number;
          created_at: Timestamp;
          estimated_cost: number;
          event_type:
            | "ai_bundle_failed"
            | "ai_bundle_fallback"
            | "ai_bundle_generated";
          id: string;
          input_tokens: number;
          lead_id: string | null;
          metadata: Json;
          model: string;
          operation_type: "lead_conversion_bundle";
          output_tokens: number;
          provider: "openai" | "rule_fallback";
        };
        Insert: {
          business_id: string;
          cached_tokens?: number;
          created_at?: Timestamp;
          estimated_cost?: number;
          event_type:
            | "ai_bundle_failed"
            | "ai_bundle_fallback"
            | "ai_bundle_generated";
          id?: string;
          input_tokens?: number;
          lead_id?: string | null;
          metadata?: Json;
          model: string;
          operation_type?: "lead_conversion_bundle";
          output_tokens?: number;
          provider: "openai" | "rule_fallback";
        };
        Update: {
          business_id?: string;
          cached_tokens?: number;
          created_at?: Timestamp;
          estimated_cost?: number;
          event_type?:
            | "ai_bundle_failed"
            | "ai_bundle_fallback"
            | "ai_bundle_generated";
          id?: string;
          input_tokens?: number;
          lead_id?: string | null;
          metadata?: Json;
          model?: string;
          operation_type?: "lead_conversion_bundle";
          output_tokens?: number;
          provider?: "openai" | "rule_fallback";
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
      public_link_variants: {
        Row: {
          business_id: string;
          created_at: Timestamp;
          display_name: string;
          id: string;
          is_active: boolean;
          preferred_language: "en" | "fr-CA";
          slug: string;
          updated_at: Timestamp;
        };
        Insert: {
          business_id: string;
          created_at?: Timestamp;
          display_name: string;
          id?: string;
          is_active?: boolean;
          preferred_language?: "en" | "fr-CA";
          slug: string;
          updated_at?: Timestamp;
        };
        Update: {
          business_id?: string;
          created_at?: Timestamp;
          display_name?: string;
          id?: string;
          is_active?: boolean;
          preferred_language?: "en" | "fr-CA";
          slug?: string;
          updated_at?: Timestamp;
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
      can_request_business_deletion: {
        Args: { target_business_id: string };
        Returns: boolean;
      };
      can_view_business_deletion_request: {
        Args: { target_business_id: string };
        Returns: boolean;
      };
      count_recent_public_submission_attempts: {
        Args: {
          target_business_id: string;
          target_ip_hash: string;
          target_window_minutes: number;
        };
        Returns: number;
      };
      is_business_member: {
        Args: { target_business_id: string };
        Returns: boolean;
      };
      owns_business: {
        Args: { target_business_id: string };
        Returns: boolean;
      };
      record_public_submission_attempt: {
        Args: {
          target_business_id: string;
          target_intake_form_id: string | null;
          target_ip_hash: string;
          target_reason: string;
        };
        Returns: void;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
