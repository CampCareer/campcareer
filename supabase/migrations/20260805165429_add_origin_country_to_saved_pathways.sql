alter table public.saved_pathways
  add column if not exists origin_country_code text;

alter table public.saved_pathways
  drop constraint if exists saved_pathways_user_country_field_unique;

alter table public.saved_pathways
  drop constraint if exists saved_pathways_user_origin_country_field_unique;

alter table public.saved_pathways
  add constraint saved_pathways_user_origin_country_field_unique
  unique nulls not distinct (user_id, origin_country_code, country_code, field_slug);

comment on column public.saved_pathways.origin_country_code is
  'Optional origin or citizenship country code for the saved cross-border pathway. Legacy rows may be null.';
