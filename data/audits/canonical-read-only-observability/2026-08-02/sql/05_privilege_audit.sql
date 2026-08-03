-- 05_privilege_audit.sql
-- Read-only privilege audit for canonical (private) schemas and api_private.
-- Target roles: anon, authenticated, service_role.
-- Reports booleans/counts only - never grants, credentials, or ACL values.
--
-- Safe statement audit: SELECT + metadata functions only.

-- 1. Schema-level USAGE privilege per role (expected: false for anon/authenticated
--    on canonical schemas; api_private is a server-only read model so anon and
--    authenticated USAGE must be false there too).
select
  n.nspname as schema_name,
  r.rolname as role_name,
  has_schema_privilege(r.rolname, n.nspname, 'USAGE') as has_schema_usage
from pg_catalog.pg_namespace n
cross join (
  select rolname from pg_catalog.pg_roles where rolname in ('anon', 'authenticated', 'service_role')
) r
where n.nspname in ('core', 'catalog', 'taxonomy', 'evidence', 'labour', 'reporting', 'ingest', 'api_private')
order by n.nspname, r.rolname;

-- 2. Per-role table privilege summary per schema (does ANY table in the schema
--    grant the privilege to the role?). Counts of granted tables, not ACL text.
select
  n.nspname as schema_name,
  r.rolname as role_name,
  count(c.oid) filter (where has_table_privilege(r.rolname, c.oid, 'SELECT')) as tables_select,
  count(c.oid) filter (where has_table_privilege(r.rolname, c.oid, 'INSERT')) as tables_insert,
  count(c.oid) filter (where has_table_privilege(r.rolname, c.oid, 'UPDATE')) as tables_update,
  count(c.oid) filter (where has_table_privilege(r.rolname, c.oid, 'DELETE')) as tables_delete,
  count(c.oid) as tables_total
from pg_catalog.pg_namespace n
join pg_catalog.pg_class c on c.relnamespace = n.oid
cross join (
  select rolname from pg_catalog.pg_roles where rolname in ('anon', 'authenticated', 'service_role')
) r
where n.nspname in ('core', 'catalog', 'taxonomy', 'evidence', 'labour', 'reporting', 'ingest', 'api_private')
  and c.relkind in ('r', 'p', 'v', 'm')
group by n.nspname, r.rolname
order by n.nspname, r.rolname;

-- 3. Roles that own or have been granted usage on canonical schemas (metadata only).
select
  n.nspname as schema_name,
  pg_get_userbyid(n.nspowner) as schema_owner,
  array_agg(distinct pr.rolname order by pr.rolname) filter (
    where has_schema_privilege(pr.rolname, n.nspname, 'USAGE')
  ) as roles_with_usage
from pg_catalog.pg_namespace n
cross join pg_catalog.pg_roles pr
where n.nspname in ('core', 'catalog', 'taxonomy', 'evidence', 'labour', 'reporting', 'ingest', 'api_private')
  and pr.rolname not like 'pg_%'
group by n.nspname, n.nspowner
order by n.nspname;
