-- Read-only observation queries for the 10.6 five-country canonical coverage audit.
-- All statements are SELECT-only; no DML. Run via psql with a read-only role,
-- or adapt table references to the public view equivalents observed via PostgREST.
-- Date of observation: 2026-08-02

-- 1. Five-country entity counts (public view layer over ingest.*).
--    NOTE: PostgREST-only environments must use the /rest/v1 endpoint counts
--    captured in public_schema_counts.tsv instead of these psql queries.
select 'colleges_au' as entity, count(*) from public.colleges_au
union all select 'colleges_ca', count(*) from public.colleges_ca
union all select 'colleges_ie', count(*) from public.colleges_ie
union all select 'colleges_uk', count(*) from public.colleges_uk
union all select 'colleges_us', count(*) from public.colleges_us;

select 'courses_au' as entity, count(*) from public.courses_au
union all select 'courses_ca', count(*) from public.courses_ca
union all select 'courses_ie', count(*) from public.courses_ie
union all select 'courses_uk', count(*) from public.courses_uk
union all select 'programs_us', count(*) from public.programs_us;

select 'occupations_au' as entity, count(*) from public.occupations_au
union all select 'occupations_ca', count(*) from public.occupations_ca
union all select 'occupations_uk', count(*) from public.occupations_uk;

-- 2. Occupations / US / IE canonical gap check (expect zero rows for US + IE).
select 'occupations_us_missing' as entity, count(*) from pg_catalog.pg_tables
where schemaname = 'public' and tablename in ('occupations_us');

select 'occupations_ie_missing' as entity, count(*) from pg_catalog.pg_tables
where schemaname = 'public' and tablename in ('occupations_ie');

-- 3. api_private read-model availability (AU-only today).
select table_name from information_schema.tables
where table_schema = 'api_private'
order by table_name;

-- 4. Origin-comparison runtime dependency presence (GAP-007).
select 'concept_career_mappings' as tbl, count(*) from public.concept_career_mappings
union all select 'career_compensation_observations', count(*) from public.career_compensation_observations
union all select 'housing_cost_observations', count(*) from public.housing_cost_observations
union all select 'country_comparison_coverage', count(*) from public.country_comparison_coverage;

-- 5. Canonical schema table inventory (static-analysis view; not exposed to PostgREST).
select table_schema, table_name
from information_schema.tables
where table_schema in ('core', 'catalog', 'taxonomy', 'evidence', 'labour', 'reporting', 'ingest', 'retired')
order by table_schema, table_name;

-- 6. Row counts for canonical schemas (requires read access to canonical schemas).
select 'catalog.institutions' as tbl, count(*) from catalog.institutions
union all select 'catalog.programmes', count(*) from catalog.programmes
union all select 'catalog.programme_offerings', count(*) from catalog.programme_offerings
union all select 'catalog.legacy_entity_map', count(*) from catalog.legacy_entity_map
union all select 'taxonomy.occupations', count(*) from taxonomy.occupations
union all select 'taxonomy.occupation_identifiers', count(*) from taxonomy.occupation_identifiers
union all select 'evidence.source_register_records', count(*) from evidence.source_register_records
union all select 'evidence.metric_observations', count(*) from evidence.metric_observations;
