-- ============================================================
-- File: supabase/migrations/0017_business_preferred_language.sql
-- Project: BizPilot AI
-- Description: Adds MVP-safe business language support for Quebec/Canada pilots.
-- Role: Stores owner-selected language on businesses and denormalizes it onto public quote links.
-- Author: MoOoH
-- Created: 2026-05-23
-- ============================================================

alter table public.businesses
  add column if not exists preferred_language text not null default 'en';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'businesses_preferred_language_check'
      and conrelid = 'public.businesses'::regclass
  ) then
    alter table public.businesses
      add constraint businesses_preferred_language_check
      check (preferred_language in ('en', 'fr-CA'));
  end if;
end
$$;

alter table public.public_link_variants
  add column if not exists preferred_language text not null default 'en';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'public_link_variants_preferred_language_check'
      and conrelid = 'public.public_link_variants'::regclass
  ) then
    alter table public.public_link_variants
      add constraint public_link_variants_preferred_language_check
      check (preferred_language in ('en', 'fr-CA'));
  end if;
end
$$;

update public.public_link_variants plv
set preferred_language = businesses.preferred_language
from public.businesses
where businesses.id = plv.business_id;

create index if not exists businesses_preferred_language_idx
  on public.businesses(preferred_language);
