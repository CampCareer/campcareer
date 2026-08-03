-- 01_schema_inventory.sql
-- Read-only canonical schema inventory for CampCareer.
-- Runs inside the runner's READ ONLY transaction. Returns relation-level
-- metadata only; NO raw row values are ever selected.
--
-- Safe statement audit: SELECT + metadata functions only. No INSERT/UPDATE/
-- DELETE/ALTER/CREATE/DROP/GRANT/REVOKE/TRUNCATE/MERGE/CALL/DO/COPY/VACUUM.

-- 1. Schema existence and relation kind inventory for canonical allowlist.
select
  n.nspname as schema_name,
  c.relname as relation_name,
  case c.relkind
    when 'r' then 'table'
    when 'v' then 'view'
    when 'm' then 'materialized_view'
    when 'p' then 'partitioned_table'
    else c.relkind::text
  end as relation_type,
  pg_get_userbyid(c.relowner) as owner,
  c.relrowsecurity as rls_enabled,
  exists (
    select 1 from pg_index i
    where i.indrelid = c.oid and i.indisprimary
  ) as has_primary_key,
  (
    select count(*) from pg_constraint con
    where con.conrelid = c.oid and con.contype = 'f'
  ) as foreign_key_count,
  exists (
    select 1 from pg_attribute a
    where a.attrelid = c.oid
      and a.attnum > 0 and not a.attisdropped
      and lower(a.attname) like '%country%'
  ) as has_country_column,
  exists (
    select 1 from pg_attribute a
    where a.attrelid = c.oid
      and a.attnum > 0 and not a.attisdropped
      and lower(a.attname) in ('created_at', 'updated_at')
  ) as has_created_updated,
  exists (
    select 1 from pg_attribute a
    where a.attrelid = c.oid
      and a.attnum > 0 and not a.attisdropped
      and lower(a.attname) like '%review%'
  ) as has_reviewed_date,
  exists (
    select 1 from pg_attribute a
    where a.attrelid = c.oid
      and a.attnum > 0 and not a.attisdropped
      and (lower(a.attname) like '%source%' or lower(a.attname) like '%snapshot%')
  ) as has_source_or_snapshot_column
from pg_catalog.pg_namespace n
join pg_catalog.pg_class c on c.relnamespace = n.oid
where n.nspname in ('core', 'catalog', 'taxonomy', 'evidence', 'labour', 'reporting', 'ingest')
  and c.relkind in ('r', 'v', 'm', 'p')
order by n.nspname, c.relname;

-- 2. Schema presence summary for the canonical allowlist (always all rows,
--    even for schemas with no relations, so absence is distinguishable).
select
  n.nspname as schema_name,
  n.nspowner::regrole::text as schema_owner,
  count(c.oid) filter (where c.relkind in ('r', 'p')) as table_count,
  count(c.oid) filter (where c.relkind = 'v') as view_count,
  count(c.oid) filter (where c.relkind = 'm') as materialized_view_count
from pg_catalog.pg_namespace n
left join pg_catalog.pg_class c on c.relnamespace = n.oid
where n.nspname in ('core', 'catalog', 'taxonomy', 'evidence', 'labour', 'reporting', 'ingest')
group by n.nspname, n.nspowner
order by n.nspname;
