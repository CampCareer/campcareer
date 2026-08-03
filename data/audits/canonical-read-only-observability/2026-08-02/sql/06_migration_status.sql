-- 06_migration_status.sql
-- Read-only GAP-007 migration presence check (migration 20260712121724).
-- Confirms whether the migration version is recorded and whether its tables
-- exist in the actual database. No migration is applied or reverted.
--
-- Safe statement audit: SELECT + metadata functions only.

-- 1. Migration version recorded in supabase_migrations.schema_migrations.
select
  '20260712121724' as migration_version,
  exists (
    select 1 from supabase_migrations.schema_migrations
    where version = '20260712121724' or version like '20260712121724%'
  ) as migration_version_recorded;

-- 2. GAP-007 tables present in the actual database (any schema).
select
  to_regclass('public.concept_career_mappings') as concept_career_mappings,
  to_regclass('public.career_compensation_observations') as career_compensation_observations,
  to_regclass('public.housing_cost_observations') as housing_cost_observations,
  to_regclass('public.country_comparison_coverage') as country_comparison_coverage,
  to_regclass('public.partner_profiles') as partner_profiles,
  to_regclass('public.partner_members') as partner_members,
  to_regclass('public.lead_requests') as lead_requests,
  to_regclass('public.lead_assignments') as lead_assignments,
  to_regclass('public.lead_status_events') as lead_status_events;

-- 3. RLS status for the GAP-007 tables if present (metadata only).
select
  n.nspname as table_schema,
  c.relname as table_name,
  c.relrowsecurity as rls_enabled
from pg_catalog.pg_namespace n
join pg_catalog.pg_class c on c.relnamespace = n.oid
where c.relname in (
  'concept_career_mappings',
  'career_compensation_observations',
  'housing_cost_observations',
  'country_comparison_coverage'
)
order by n.nspname, c.relname;

-- 4. Same-migration cohort tables (from 20260711194734 + 20260712121724) presence,
--    used to distinguish 'migration not applied' from 'table dropped later'.
select
  to_regclass('public.decision_plans') as decision_plans,
  to_regclass('public.plan_save_intents') as plan_save_intents,
  to_regclass('public.canonical_concepts') as canonical_concepts,
  to_regclass('public.course_offerings') as course_offerings,
  to_regclass('public.taxonomy_nodes') as taxonomy_nodes;
