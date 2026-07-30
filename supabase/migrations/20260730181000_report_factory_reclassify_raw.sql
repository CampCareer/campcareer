-- Retire approximate legacy ROI projections and reclassify retained source datasets.

drop materialized view if exists public.roi_explorer_au cascade;
drop materialized view if exists public.roi_explorer_ca cascade;
drop materialized view if exists public.roi_explorer_ie cascade;
drop materialized view if exists public.roi_explorer_uk cascade;
drop materialized view if exists public.roi_explorer_us cascade;
drop materialized view if exists public.roi_explorer_by_field_us cascade;
drop materialized view if exists public.roi_explorer_nl cascade;

alter table public.cities_au set schema ingest;
alter table public.cities_ca set schema ingest;
alter table public.cities_ie set schema ingest;
alter table public.cities_uk set schema ingest;
alter table public.cities_us set schema ingest;

alter table public.colleges_au set schema ingest;
alter table public.colleges_ca set schema ingest;
alter table public.colleges_ie set schema ingest;
alter table public.colleges_uk set schema ingest;
alter table public.colleges_us set schema ingest;
alter table public.colleges_nl set schema ingest;

alter table public.courses_au set schema ingest;
alter table public.courses_ca set schema ingest;
alter table public.courses_ie set schema ingest;
alter table public.courses_uk set schema ingest;
alter table public.programs_us set schema ingest;

alter table public.field_earnings_au set schema ingest;
alter table public.field_earnings_ca set schema ingest;
alter table public.field_earnings_ie set schema ingest;
alter table public.field_earnings_uk set schema ingest;
alter table public.graduate_outcomes_ie set schema ingest;

alter table public.occupations_au set schema ingest;
alter table public.occupations_ca set schema ingest;
alter table public.occupations_uk set schema ingest;
alter table public.occupation_state_au set schema ingest;
alter table public.occupation_state_ca set schema ingest;
alter table public.occupation_state_uk set schema ingest;
alter table public.occupation_profiles_au set schema ingest;
alter table public.occupation_outlook_au set schema ingest;
alter table public.occupation_vacancies_au set schema ingest;
alter table public.occupation_regional_employment_au set schema ingest;
alter table public.occupation_mobility_flows_au set schema ingest;
alter table public.occupation_mobility_stocks_au set schema ingest;
alter table public.occupation_pathways_au set schema ingest;
alter table public.occupation_shortage_drivers_au set schema ingest;
alter table public.occupation_sa4_au set schema ingest;

alter table public.visa_occupation_status_au set schema ingest;
alter table public.regulatory_requirements_au set schema ingest;
alter table public.program_page_facts_au set schema ingest;
alter table public.state_salary_multiplier set schema ingest;
alter table public.country_pr_pathways set schema ingest;
alter table public.shortage_occupations_ie set schema ingest;
alter table public.language_schools_ie set schema ingest;
alter table public.language_courses_ie set schema ingest;

alter table public.data_source_runs set schema evidence;
alter table evidence.data_source_runs rename to ingestion_runs;

grant usage on schema ingest to service_role;
grant all privileges on all tables in schema ingest to service_role;
grant usage,select on all sequences in schema ingest to service_role;
grant all privileges on table evidence.ingestion_runs to service_role;

comment on schema ingest is 'Raw and source-shaped datasets retained for reproducible canonical imports; applications must read canonical schemas instead.';
comment on table evidence.ingestion_runs is 'Immutable source retrieval and import run history.';