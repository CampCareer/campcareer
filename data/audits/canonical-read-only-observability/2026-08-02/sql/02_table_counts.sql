-- 02_table_counts.sql
-- Read-only enumeration of canonical tables that the runner then counts with
-- an exact `select count(*)` per table (never a Postgres estimate).
--
-- This file returns the list of relations to count; the runner executes one
-- exact COUNT per relation inside a READ ONLY transaction and records
-- count_status per table (observed/permission_denied/timeout/missing/error).
--
-- Safe statement audit: SELECT + metadata functions only.

select
  n.nspname as schema_name,
  c.relname as table_name,
  case c.relkind
    when 'r' then 'table'
    when 'p' then 'partitioned_table'
  end as relation_type
from pg_catalog.pg_namespace n
join pg_catalog.pg_class c on c.relnamespace = n.oid
where n.nspname in ('core', 'catalog', 'taxonomy', 'evidence', 'labour', 'reporting', 'ingest')
  and c.relkind in ('r', 'p')
  and not c.relispartition
order by n.nspname, c.relname;
