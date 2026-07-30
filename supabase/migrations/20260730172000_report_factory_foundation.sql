-- CampCareer Report Factory Foundation v1
--
-- Additive only. This migration does not alter, delete, or backfill existing
-- country-specific production tables.

create schema if not exists core;
create schema if not exists catalog;
create schema if not exists evidence;
create schema if not exists labour;
create schema if not exists reporting;

-- ---------------------------------------------------------------------------
-- Core reference data
-- ---------------------------------------------------------------------------

create table if not exists core.countries (
  code text primary key check (code ~ '^[A-Z]{2}$'),
  name text not null,
  default_currency text not null check (default_currency ~ '^[A-Z]{3}$'),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists core.currencies (
  code text primary key check (code ~ '^[A-Z]{3}$'),
  name text not null,
  minor_units smallint not null default 2 check (minor_units between 0 and 4),
  created_at timestamptz not null default now()
);

create table if not exists core.qualification_frameworks (
  id uuid primary key default gen_random_uuid(),
  country_code text not null references core.countries(code),
  framework_code text not null,
  name text not null,
  version text,
  source_url text,
  effective_from date,
  effective_to date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (country_code, framework_code, version)
);

create table if not exists core.qualification_levels (
  id uuid primary key default gen_random_uuid(),
  framework_id uuid not null references core.qualification_frameworks(id) on delete cascade,
  level_code text not null,
  label text not null,
  rank_order smallint,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (framework_id, level_code)
);

-- ---------------------------------------------------------------------------
-- Catalogue
-- ---------------------------------------------------------------------------

create table if not exists catalog.institutions (
  id uuid primary key default gen_random_uuid(),
  country_code text not null references core.countries(code),
  canonical_name text not null,
  institution_type text,
  website_url text,
  status text not null default 'active'
    check (status in ('active', 'inactive', 'unknown')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists institutions_country_name_uidx
  on catalog.institutions (country_code, lower(canonical_name));

create table if not exists catalog.institution_identifiers (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references catalog.institutions(id) on delete cascade,
  identifier_system text not null,
  identifier_value text not null,
  source_url text,
  valid_from date,
  valid_to date,
  created_at timestamptz not null default now(),
  unique (identifier_system, identifier_value)
);

create index if not exists institution_identifiers_institution_idx
  on catalog.institution_identifiers (institution_id);

create table if not exists catalog.campuses (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references catalog.institutions(id) on delete cascade,
  name text not null,
  city text,
  region text,
  country_code text not null references core.countries(code),
  latitude numeric(9,6),
  longitude numeric(9,6),
  status text not null default 'active'
    check (status in ('active', 'inactive', 'unknown')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (institution_id, name, city)
);

create index if not exists campuses_institution_idx
  on catalog.campuses (institution_id);

create table if not exists catalog.programmes (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references catalog.institutions(id) on delete cascade,
  canonical_title text not null,
  qualification_level_id uuid references core.qualification_levels(id),
  programme_type text,
  field_code text,
  field_name text,
  default_duration_months integer check (default_duration_months is null or default_duration_months > 0),
  status text not null default 'active'
    check (status in ('active', 'inactive', 'unknown')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists programmes_institution_idx
  on catalog.programmes (institution_id);
create index if not exists programmes_field_idx
  on catalog.programmes (field_code, field_name);

create table if not exists catalog.programme_identifiers (
  id uuid primary key default gen_random_uuid(),
  programme_id uuid not null references catalog.programmes(id) on delete cascade,
  identifier_system text not null,
  identifier_value text not null,
  source_url text,
  valid_from date,
  valid_to date,
  created_at timestamptz not null default now(),
  unique (identifier_system, identifier_value)
);

create index if not exists programme_identifiers_programme_idx
  on catalog.programme_identifiers (programme_id);

create table if not exists catalog.programme_offerings (
  id uuid primary key default gen_random_uuid(),
  programme_id uuid not null references catalog.programmes(id) on delete cascade,
  campus_id uuid references catalog.campuses(id) on delete set null,
  market text not null default 'international'
    check (market in ('international', 'domestic', 'both', 'unknown')),
  delivery_mode text,
  intake_label text,
  intake_start_date date,
  application_deadline date,
  duration_months integer check (duration_months is null or duration_months > 0),
  enrolment_status text not null default 'unknown'
    check (enrolment_status in ('open', 'closed', 'planned', 'suspended', 'unknown')),
  source_url text,
  valid_from date,
  valid_to date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (valid_to is null or valid_from is null or valid_to >= valid_from)
);

create index if not exists programme_offerings_programme_idx
  on catalog.programme_offerings (programme_id, intake_start_date desc);
create index if not exists programme_offerings_campus_idx
  on catalog.programme_offerings (campus_id);

create table if not exists catalog.programme_fees (
  id uuid primary key default gen_random_uuid(),
  offering_id uuid not null references catalog.programme_offerings(id) on delete cascade,
  fee_type text not null,
  amount numeric(14,2) not null check (amount >= 0),
  currency_code text not null references core.currencies(code),
  billing_basis text not null
    check (billing_basis in ('annual', 'total', 'semester', 'term', 'credit', 'one_off', 'other')),
  student_market text not null default 'international'
    check (student_market in ('international', 'domestic', 'both', 'unknown')),
  evidence_id uuid,
  effective_from date,
  effective_to date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (effective_to is null or effective_from is null or effective_to >= effective_from)
);

create index if not exists programme_fees_offering_idx
  on catalog.programme_fees (offering_id, fee_type, effective_from desc);

create table if not exists catalog.programme_requirements (
  id uuid primary key default gen_random_uuid(),
  offering_id uuid not null references catalog.programme_offerings(id) on delete cascade,
  requirement_type text not null
    check (requirement_type in ('academic', 'english', 'placement', 'registration', 'experience', 'document', 'other')),
  requirement_text text not null,
  structured_value jsonb not null default '{}'::jsonb,
  evidence_id uuid,
  effective_from date,
  effective_to date,
  review_status text not null default 'review_required'
    check (review_status in ('review_required', 'verified', 'stale', 'rejected', 'retired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (effective_to is null or effective_from is null or effective_to >= effective_from)
);

create index if not exists programme_requirements_offering_idx
  on catalog.programme_requirements (offering_id, requirement_type);

create table if not exists catalog.programme_accreditations (
  id uuid primary key default gen_random_uuid(),
  programme_id uuid not null references catalog.programmes(id) on delete cascade,
  campus_id uuid references catalog.campuses(id) on delete set null,
  authority_name text not null,
  authority_url text,
  accreditation_type text not null,
  status text not null
    check (status in ('approved', 'conditional', 'pending', 'expired', 'not_approved', 'unknown')),
  status_text text,
  evidence_id uuid,
  effective_from date,
  effective_to date,
  last_checked_at timestamptz,
  review_status text not null default 'review_required'
    check (review_status in ('review_required', 'verified', 'stale', 'rejected', 'retired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (effective_to is null or effective_from is null or effective_to >= effective_from)
);

create index if not exists programme_accreditations_programme_idx
  on catalog.programme_accreditations (programme_id, authority_name, status);
create index if not exists programme_accreditations_campus_idx
  on catalog.programme_accreditations (campus_id);

-- ---------------------------------------------------------------------------
-- Evidence
-- ---------------------------------------------------------------------------

create table if not exists evidence.sources (
  id uuid primary key default gen_random_uuid(),
  source_key text not null unique,
  organisation_name text not null,
  source_name text not null,
  source_type text not null
    check (source_type in ('regulator', 'government_dataset', 'provider', 'professional_body', 'official_correspondence', 'market', 'internal')),
  canonical_url text,
  country_code text references core.countries(code),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists evidence.source_snapshots (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references evidence.sources(id) on delete cascade,
  source_url text not null,
  content_sha256 text,
  storage_path text,
  published_at date,
  data_as_of date,
  retrieved_at timestamptz not null default now(),
  valid_from date,
  valid_to date,
  snapshot_status text not null default 'captured'
    check (snapshot_status in ('captured', 'unchanged', 'superseded', 'failed', 'review_required')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  check (valid_to is null or valid_from is null or valid_to >= valid_from)
);

create unique index if not exists source_snapshots_source_hash_uidx
  on evidence.source_snapshots (source_id, content_sha256)
  where content_sha256 is not null;
create index if not exists source_snapshots_source_date_idx
  on evidence.source_snapshots (source_id, retrieved_at desc);

create table if not exists evidence.metric_observations (
  id uuid primary key default gen_random_uuid(),
  metric_key text not null,
  scope_type text not null,
  scope_id text not null,
  value jsonb not null,
  unit text,
  source_snapshot_id uuid not null references evidence.source_snapshots(id),
  evidence_kind text not null
    check (evidence_kind in ('observed', 'calculated', 'estimated', 'user_provided')),
  confidence text not null
    check (confidence in ('high', 'medium', 'low')),
  methodology text,
  assumptions jsonb not null default '{}'::jsonb,
  effective_from date,
  effective_to date,
  review_status text not null default 'review_required'
    check (review_status in ('review_required', 'verified', 'stale', 'rejected', 'retired')),
  reviewed_at timestamptz,
  reviewer_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (effective_to is null or effective_from is null or effective_to >= effective_from)
);

create index if not exists metric_observations_scope_idx
  on evidence.metric_observations (scope_type, scope_id, metric_key, review_status);
create index if not exists metric_observations_snapshot_idx
  on evidence.metric_observations (source_snapshot_id);

create table if not exists evidence.claims (
  id uuid primary key default gen_random_uuid(),
  claim_key text not null unique,
  claim_text text not null,
  locale text not null default 'en',
  claim_type text not null
    check (claim_type in ('fact', 'calculation', 'ranking', 'recommendation', 'disclosure', 'methodology')),
  materiality text not null default 'material'
    check (materiality in ('material', 'supporting', 'context')),
  scope_type text,
  scope_id text,
  publication_status text not null default 'draft'
    check (publication_status in ('draft', 'approved', 'stale', 'retired', 'prohibited')),
  valid_from date,
  valid_to date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (valid_to is null or valid_from is null or valid_to >= valid_from)
);

create index if not exists claims_scope_idx
  on evidence.claims (scope_type, scope_id, publication_status);

create table if not exists evidence.claim_evidence (
  claim_id uuid not null references evidence.claims(id) on delete cascade,
  metric_observation_id uuid not null references evidence.metric_observations(id) on delete restrict,
  support_role text not null default 'primary'
    check (support_role in ('primary', 'secondary', 'limitation', 'contradictory')),
  created_at timestamptz not null default now(),
  primary key (claim_id, metric_observation_id)
);

create index if not exists claim_evidence_observation_idx
  on evidence.claim_evidence (metric_observation_id);

create table if not exists evidence.review_events (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  previous_status text,
  new_status text not null,
  reviewer_id uuid,
  review_note text,
  reviewed_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists review_events_entity_idx
  on evidence.review_events (entity_type, entity_id, reviewed_at desc);

-- Add evidence foreign keys after evidence tables exist.
alter table catalog.programme_fees
  add constraint programme_fees_evidence_id_fkey
  foreign key (evidence_id) references evidence.metric_observations(id) on delete set null;

alter table catalog.programme_requirements
  add constraint programme_requirements_evidence_id_fkey
  foreign key (evidence_id) references evidence.metric_observations(id) on delete set null;

alter table catalog.programme_accreditations
  add constraint programme_accreditations_evidence_id_fkey
  foreign key (evidence_id) references evidence.metric_observations(id) on delete set null;

-- ---------------------------------------------------------------------------
-- Labour outcomes
-- ---------------------------------------------------------------------------

create table if not exists labour.outcome_observations (
  id uuid primary key default gen_random_uuid(),
  country_code text not null references core.countries(code),
  institution_id uuid references catalog.institutions(id) on delete set null,
  programme_id uuid references catalog.programmes(id) on delete set null,
  field_code text,
  field_name text,
  occupation_system text,
  occupation_code text,
  qualification_level_id uuid references core.qualification_levels(id),
  geography_code text,
  cohort_type text not null default 'all'
    check (cohort_type in ('all', 'domestic', 'international', 'mixed', 'unknown')),
  graduation_year smallint,
  outcome_window_months numeric(6,2),
  metric_key text not null,
  value numeric,
  unit text,
  respondent_count integer check (respondent_count is null or respondent_count >= 0),
  population_count integer check (population_count is null or population_count >= 0),
  evidence_id uuid not null references evidence.metric_observations(id),
  review_status text not null default 'review_required'
    check (review_status in ('review_required', 'verified', 'stale', 'rejected', 'retired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists outcome_observations_provider_field_idx
  on labour.outcome_observations (country_code, institution_id, field_code, metric_key, graduation_year desc);
create index if not exists outcome_observations_programme_idx
  on labour.outcome_observations (programme_id, metric_key);
create index if not exists outcome_observations_evidence_idx
  on labour.outcome_observations (evidence_id);

-- ---------------------------------------------------------------------------
-- Reporting and release control
-- ---------------------------------------------------------------------------

create table if not exists reporting.products (
  id uuid primary key default gen_random_uuid(),
  product_key text not null unique,
  country_code text references core.countries(code),
  field_code text,
  product_type text not null
    check (product_type in ('focus_report', 'comparison_report', 'personalised_report', 'preview', 'web_index')),
  name text not null,
  default_currency text references core.currencies(code),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists reporting.methodology_versions (
  id uuid primary key default gen_random_uuid(),
  methodology_key text not null,
  version text not null,
  status text not null default 'draft'
    check (status in ('draft', 'approved', 'superseded', 'retired')),
  description text not null,
  specification jsonb not null default '{}'::jsonb,
  code_commit_sha text,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  unique (methodology_key, version)
);

create table if not exists reporting.ranking_models (
  id uuid primary key default gen_random_uuid(),
  model_key text not null,
  version text not null,
  methodology_version_id uuid not null references reporting.methodology_versions(id),
  country_code text references core.countries(code),
  field_code text,
  pathway_group text,
  status text not null default 'draft'
    check (status in ('draft', 'approved', 'superseded', 'retired')),
  created_at timestamptz not null default now(),
  unique (model_key, version)
);

create table if not exists reporting.ranking_weights (
  ranking_model_id uuid not null references reporting.ranking_models(id) on delete cascade,
  metric_key text not null,
  weight numeric(8,6) not null check (weight >= 0 and weight <= 1),
  minimum_confidence text not null default 'medium'
    check (minimum_confidence in ('high', 'medium', 'low')),
  missing_data_treatment text not null default 'exclude'
    check (missing_data_treatment in ('exclude', 'neutral', 'penalise', 'not_applicable')),
  created_at timestamptz not null default now(),
  primary key (ranking_model_id, metric_key)
);

create table if not exists reporting.analysis_runs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references reporting.products(id),
  methodology_version_id uuid not null references reporting.methodology_versions(id),
  ranking_model_id uuid references reporting.ranking_models(id),
  run_type text not null
    check (run_type in ('roi', 'ranking', 'scenario', 'report_build', 'validation')),
  status text not null default 'queued'
    check (status in ('queued', 'running', 'completed', 'failed', 'cancelled')),
  input_hash text,
  output_hash text,
  code_commit_sha text,
  started_at timestamptz,
  completed_at timestamptz,
  warnings jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analysis_runs_product_idx
  on reporting.analysis_runs (product_id, created_at desc);

create table if not exists reporting.analysis_inputs (
  id uuid primary key default gen_random_uuid(),
  analysis_run_id uuid not null references reporting.analysis_runs(id) on delete cascade,
  input_key text not null,
  scope_type text,
  scope_id text,
  value jsonb not null,
  evidence_id uuid references evidence.metric_observations(id),
  created_at timestamptz not null default now(),
  unique (analysis_run_id, input_key, scope_type, scope_id)
);

create index if not exists analysis_inputs_run_idx
  on reporting.analysis_inputs (analysis_run_id);
create index if not exists analysis_inputs_evidence_idx
  on reporting.analysis_inputs (evidence_id);

create table if not exists reporting.analysis_outputs (
  id uuid primary key default gen_random_uuid(),
  analysis_run_id uuid not null references reporting.analysis_runs(id) on delete cascade,
  output_key text not null,
  scope_type text,
  scope_id text,
  value jsonb not null,
  confidence text
    check (confidence is null or confidence in ('high', 'medium', 'low')),
  data_coverage_pct numeric(5,2)
    check (data_coverage_pct is null or data_coverage_pct between 0 and 100),
  created_at timestamptz not null default now(),
  unique (analysis_run_id, output_key, scope_type, scope_id)
);

create index if not exists analysis_outputs_run_idx
  on reporting.analysis_outputs (analysis_run_id);

create table if not exists reporting.report_releases (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references reporting.products(id),
  release_version text not null,
  analysis_run_id uuid references reporting.analysis_runs(id),
  status text not null default 'draft'
    check (status in ('draft', 'candidate', 'approved', 'released', 'superseded', 'withdrawn')),
  release_date date,
  source_baseline_hash text,
  model_baseline_hash text,
  manuscript_hash text,
  approval_note text,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  unique (product_id, release_version)
);

create table if not exists reporting.report_artifacts (
  id uuid primary key default gen_random_uuid(),
  report_release_id uuid not null references reporting.report_releases(id) on delete cascade,
  artifact_type text not null
    check (artifact_type in ('pdf', 'docx', 'xlsx', 'html', 'json', 'manifest', 'preview', 'source_pack')),
  file_name text not null,
  storage_path text,
  content_sha256 text not null,
  byte_size bigint check (byte_size is null or byte_size >= 0),
  page_count integer check (page_count is null or page_count >= 0),
  status text not null default 'candidate'
    check (status in ('candidate', 'approved', 'released', 'superseded', 'withdrawn')),
  created_at timestamptz not null default now(),
  unique (report_release_id, artifact_type, content_sha256)
);

create index if not exists report_artifacts_release_idx
  on reporting.report_artifacts (report_release_id);

create table if not exists reporting.monitoring_actions (
  id uuid primary key default gen_random_uuid(),
  report_release_id uuid references reporting.report_releases(id) on delete cascade,
  scope_type text not null,
  scope_id text not null,
  priority text not null
    check (priority in ('P0', 'P1', 'P2', 'P3')),
  control_type text not null,
  action_text text not null,
  trigger_condition text,
  due_at timestamptz,
  status text not null default 'open'
    check (status in ('open', 'monitoring', 'resolved', 'superseded', 'cancelled')),
  owner text,
  resolved_at timestamptz,
  resolution_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists monitoring_actions_release_priority_idx
  on reporting.monitoring_actions (report_release_id, priority, status);

-- ---------------------------------------------------------------------------
-- Security: foundation tables are private operational data.
-- ---------------------------------------------------------------------------

alter table core.countries enable row level security;
alter table core.currencies enable row level security;
alter table core.qualification_frameworks enable row level security;
alter table core.qualification_levels enable row level security;

alter table catalog.institutions enable row level security;
alter table catalog.institution_identifiers enable row level security;
alter table catalog.campuses enable row level security;
alter table catalog.programmes enable row level security;
alter table catalog.programme_identifiers enable row level security;
alter table catalog.programme_offerings enable row level security;
alter table catalog.programme_fees enable row level security;
alter table catalog.programme_requirements enable row level security;
alter table catalog.programme_accreditations enable row level security;

alter table evidence.sources enable row level security;
alter table evidence.source_snapshots enable row level security;
alter table evidence.metric_observations enable row level security;
alter table evidence.claims enable row level security;
alter table evidence.claim_evidence enable row level security;
alter table evidence.review_events enable row level security;

alter table labour.outcome_observations enable row level security;

alter table reporting.products enable row level security;
alter table reporting.methodology_versions enable row level security;
alter table reporting.ranking_models enable row level security;
alter table reporting.ranking_weights enable row level security;
alter table reporting.analysis_runs enable row level security;
alter table reporting.analysis_inputs enable row level security;
alter table reporting.analysis_outputs enable row level security;
alter table reporting.report_releases enable row level security;
alter table reporting.report_artifacts enable row level security;
alter table reporting.monitoring_actions enable row level security;

grant usage on schema core, catalog, evidence, labour, reporting to service_role;
grant all privileges on all tables in schema core, catalog, evidence, labour, reporting to service_role;
grant usage, select on all sequences in schema core, catalog, evidence, labour, reporting to service_role;

alter default privileges in schema core grant all on tables to service_role;
alter default privileges in schema catalog grant all on tables to service_role;
alter default privileges in schema evidence grant all on tables to service_role;
alter default privileges in schema labour grant all on tables to service_role;
alter default privileges in schema reporting grant all on tables to service_role;

alter default privileges in schema core grant usage, select on sequences to service_role;
alter default privileges in schema catalog grant usage, select on sequences to service_role;
alter default privileges in schema evidence grant usage, select on sequences to service_role;
alter default privileges in schema labour grant usage, select on sequences to service_role;
alter default privileges in schema reporting grant usage, select on sequences to service_role;
