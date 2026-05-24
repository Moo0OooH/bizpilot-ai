-- Phase 21C Owner SQL Verification Pack
-- Project: BizPilot AI
-- Target: bizpilot-production / qfqendrqimqvkoojpjao
-- Last Updated: 2026-05-24
--
-- Safety:
-- - Read-only verification queries are allowed by owner decision.
-- - Owner states there are no serious/real users yet and approves
--   repo-backed database/security alignment after target verification.
-- - Do not add ad-hoc columns. Do not add leads.source.
-- - Do not re-apply migration 0018 blindly; verify it first.
-- - Do not paste connection strings, keys, tokens, customer rows, names, emails, or phones.
-- - Run one section at a time in Supabase SQL Editor.
-- - Do not run the PostgREST cache reload section unless owner separately approves it.

-- ============================================================
-- 1. Migration history
-- ============================================================

select version, name, executed_at
from supabase_migrations.schema_migrations
order by version;

-- ============================================================
-- 2. Required columns
-- ============================================================

with expected(table_name, column_name) as (
  values
    ('businesses', 'status'),
    ('businesses', 'internal_note'),
    ('business_members', 'status'),
    ('public_link_variants', 'preferred_language'),
    ('leads', 'source_channel')
)
select
  e.table_name,
  e.column_name,
  case when c.column_name is null then false else true end as exists,
  c.data_type,
  c.is_nullable,
  c.column_default
from expected e
left join information_schema.columns c
  on c.table_schema = 'public'
 and c.table_name = e.table_name
 and c.column_name = e.column_name
order by e.table_name, e.column_name;

-- ============================================================
-- 2A. Lifecycle/deletion columns from migration 0018
-- ============================================================

with expected(table_name, column_name) as (
  values
    ('businesses', 'workspace_kind'),
    ('businesses', 'lifecycle_status'),
    ('businesses', 'lifecycle_updated_at'),
    ('businesses', 'deletion_requested_at'),
    ('businesses', 'deleted_at')
)
select
  e.table_name,
  e.column_name,
  case when c.column_name is null then false else true end as exists,
  c.data_type,
  c.is_nullable,
  c.column_default
from expected e
left join information_schema.columns c
  on c.table_schema = 'public'
 and c.table_name = e.table_name
 and c.column_name = e.column_name
order by e.table_name, e.column_name;

-- ============================================================
-- 2B. Lifecycle/deletion tables from migration 0018
-- ============================================================

with expected(table_name) as (
  values
    ('business_deletion_requests'),
    ('business_deletion_tombstones')
)
select
  e.table_name,
  case when c.relname is null then false else true end as exists,
  n.nspname as schema_name,
  c.relrowsecurity as rls_enabled,
  c.relforcerowsecurity as force_rls
from expected e
left join pg_class c
  on c.relname = e.table_name
 and c.relkind = 'r'
left join pg_namespace n
  on n.oid = c.relnamespace
 and n.nspname = 'public'
order by e.table_name;

-- ============================================================
-- 3. Required RPC/functions
-- ============================================================

with expected(function_name) as (
  values
    ('public_can_insert_submission_value'),
    ('record_public_submission_attempt'),
    ('count_recent_public_submission_attempts'),
    ('can_request_business_deletion'),
    ('can_view_business_deletion_request')
)
select
  e.function_name,
  case when p.oid is null then false else true end as exists,
  n.nspname as schema_name,
  pg_get_function_identity_arguments(p.oid) as args
from expected e
left join pg_proc p
  on p.proname = e.function_name
left join pg_namespace n
  on n.oid = p.pronamespace
 and n.nspname = 'public'
order by e.function_name;

-- ============================================================
-- 3A. Lifecycle/deletion function details from migration 0018
-- ============================================================

select
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as args,
  p.prosecdef as security_definer
from pg_proc p
join pg_namespace n
  on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in (
    'can_request_business_deletion',
    'can_view_business_deletion_request',
    'set_business_lifecycle_updated_at'
  )
order by p.proname;

-- ============================================================
-- 4. RLS enabled status
-- ============================================================

select
  n.nspname as schema_name,
  c.relname as table_name,
  c.relrowsecurity as rls_enabled,
  c.relforcerowsecurity as force_rls
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'r'
order by c.relname;

-- ============================================================
-- 5. Policy list
-- ============================================================

select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
order by tablename, policyname;

-- ============================================================
-- 6. Safe table counts only
-- ============================================================

select 'businesses' as table_name, count(*) as row_count from public.businesses
union all
select 'business_members', count(*) from public.business_members
union all
select 'public_link_variants', count(*) from public.public_link_variants
union all
select 'leads', count(*) from public.leads
union all
select 'business_deletion_requests', count(*) from public.business_deletion_requests
union all
select 'business_deletion_tombstones', count(*) from public.business_deletion_tombstones;

-- ============================================================
-- 7. PostgREST schema cache reload
-- ============================================================
-- Do not run this during initial read-only verification.
-- Run only after migrations/functions are applied or verified, PostgREST
-- still cannot see the functions, and owner separately approves reload.
--
-- NOTIFY pgrst, 'reload schema';
