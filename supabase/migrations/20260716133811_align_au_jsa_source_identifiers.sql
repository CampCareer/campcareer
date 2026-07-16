-- JSA Training Occupation Pathways is published against OSCA, while the
-- Occupation Profiles dataset remains ANZSCO v1.3. Keep both identifiers
-- explicit rather than implying that they are interchangeable.
alter table public.occupation_pathways_au
  add column if not exists osca_code text;

alter table public.occupation_pathways_au
  drop constraint if exists occupation_pathways_au_pkey;

alter table public.occupation_pathways_au
  alter column anzsco_v13 drop not null;

alter table public.occupation_pathways_au
  alter column osca_code set not null;

alter table public.occupation_pathways_au
  add primary key (osca_code, qualification_code);

drop index if exists public.occupation_pathways_au_anzsco_idx;
create index if not exists occupation_pathways_au_osca_idx
  on public.occupation_pathways_au (osca_code);

-- The supplied IVI workbook is the published three-month-average series.
alter table public.occupation_vacancies_au
  drop constraint if exists occupation_vacancies_au_series_check;

alter table public.occupation_vacancies_au
  add constraint occupation_vacancies_au_series_check
  check (series in ('original', 'seasonally_adjusted', 'trend', 'three_month_average'));

-- Retain labels in addition to codes so Maps can present a regional signal
-- without joining to another geography reference table.
alter table public.occupation_regional_employment_au
  add column if not exists state text,
  add column if not exists sa4_name text;
