/**
 * ============================================================
 * File: supabase/migrations/0027_premium_operations_safe_parser_volatility.sql
 * Project: BizPilot AI
 * Description: Aligns safe date/time parser volatility with PostgreSQL cast semantics.
 * Role: Removes managed-database lint warnings without changing parser behavior or grants.
 * Related:
 * - supabase/migrations/0026_premium_operations_schedule_integrity.sql
 * - tests/unit/security-ops-source.test.mts
 * Author: MoOoH
 * Created: 2026-11-19
 * Last Updated: 2026-11-19
 * Change Log:
 * - 2026-11-19: Marked date/time parser helpers STABLE because their casts are not immutable.
 * ============================================================
 */

alter function public.premium_operations_safe_date(text) stable;
alter function public.premium_operations_safe_time(text) stable;

