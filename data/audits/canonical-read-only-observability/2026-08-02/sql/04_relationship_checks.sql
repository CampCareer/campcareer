-- 04_relationship_checks.sql
-- Read-only identity and relationship integrity checks at count level only.
-- No raw entity names, UUIDs, or personal data are selected.
--
-- Safe statement audit: SELECT + metadata functions only.

-- 1. Canonical tables without a primary key (metadata only; not a data leak).
select 'tables_without_primary_key' as check_name, n.nspname || '.' || c.relname as subject,
       null::bigint as result_count, 'count' as result_kind
from pg_catalog.pg_namespace n
join pg_catalog.pg_class c on c.relnamespace = n.oid
where n.nspname in ('core', 'catalog', 'taxonomy', 'evidence', 'labour', 'reporting', 'ingest')
  and c.relkind in ('r', 'p')
  and not exists (
    select 1 from pg_index i
    where i.indrelid = c.oid and i.indisprimary
  )
order by n.nspname, c.relname;

-- 2. Duplicate canonical country codes in core.countries (should be zero).
select 'duplicate_canonical_country_code' as check_name, 'core.countries' as subject,
       (select count(*) - count(distinct code) from core.countries) as result_count,
       'count' as result_kind;

-- 3. United Kingdom code observed in core.countries. Informational: the
--    canonical seed uses 'UK', while the five-country programmatic set uses
--    'GB'. A non-zero count here documents the observed discrepancy (expected
--    per 20260730180000 seed: 1) and is not a defect requiring a fix.
select 'uk_country_code_observed' as check_name, 'core.countries' as subject,
       (select count(*) from core.countries where code = 'UK') as result_count,
       'count' as result_kind;

-- 4. Orphan institutions: campuses/programmes reference institutions that are missing.
--    Count is derived via anti-join so no orphan rows are emitted.
select 'orphan_campus' as check_name, 'catalog.campuses' as subject,
       (select count(*) from catalog.campuses c where not exists (
          select 1 from catalog.institutions i where i.id = c.institution_id)) as result_count,
       'count' as result_kind;

select 'orphan_programme' as check_name, 'catalog.programmes' as subject,
       (select count(*) from catalog.programmes p where not exists (
          select 1 from catalog.institutions i where i.id = p.institution_id)) as result_count,
       'count' as result_kind;

select 'orphan_programme_offering' as check_name, 'catalog.programme_offerings' as subject,
       (select count(*) from catalog.programme_offerings o where not exists (
          select 1 from catalog.programmes p where p.id = o.programme_id)) as result_count,
       'count' as result_kind;

select 'orphan_programme_identifier' as check_name, 'catalog.programme_identifiers' as subject,
       (select count(*) from catalog.programme_identifiers pi where not exists (
          select 1 from catalog.programmes p where p.id = pi.programme_id)) as result_count,
       'count' as result_kind;

select 'orphan_occupation_identifier' as check_name, 'taxonomy.occupation_identifiers' as subject,
       (select count(*) from taxonomy.occupation_identifiers oi where not exists (
          select 1 from taxonomy.occupations o where o.id = oi.occupation_id)) as result_count,
       'count' as result_kind;

select 'orphan_source_snapshot' as check_name, 'evidence.source_snapshots' as subject,
       (select count(*) from evidence.source_snapshots snp where not exists (
          select 1 from evidence.sources s where s.id = snp.source_id)) as result_count,
       'count' as result_kind;

-- 5. Metric observations without a source snapshot reference.
select 'metric_observation_without_source' as check_name, 'evidence.metric_observations' as subject,
       (select count(*) from evidence.metric_observations where source_snapshot_id is null) as result_count,
       'count' as result_kind;

-- 6. Reviewed-date check on evidence.metric_observations where review_status
--    is not 'review_required' but reviewed_at is null (count only).
select 'verified_without_reviewed_date' as check_name, 'evidence.metric_observations' as subject,
       (select count(*) from evidence.metric_observations
         where review_status <> 'review_required' and reviewed_at is null) as result_count,
       'count' as result_kind;

-- 7. Duplicate programmes per institution/canonical_title (count of dup groups).
select 'duplicate_programme_title' as check_name, 'catalog.programmes' as subject,
       (select count(*) from (
          select institution_id, canonical_title
          from catalog.programmes
          group by institution_id, canonical_title
          having count(*) > 1) d) as result_count,
       'count' as result_kind;

-- NOTE: empty-canonical-table detection is derived by the runner from the exact
-- per-table counts in 02_table_counts.sql (a table is empty iff actual_row_count=0).
