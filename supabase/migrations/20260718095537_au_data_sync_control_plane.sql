-- Provenance and review controls for the AU study-data refresh pipeline.
-- These tables are deliberately private: the public product reads the curated
-- occupation/programme tables, while operators retain an auditable source log.

create table if not exists public.data_source_runs (
  id uuid primary key default gen_random_uuid(),
  source_key text not null,
  source_name text not null,
  source_url text not null,
  local_path text,
  content_sha256 text,
  published_at date,
  retrieved_at timestamptz not null default now(),
  completed_at timestamptz,
  status text not null check (status in ('fetched', 'unchanged', 'imported', 'review_required', 'failed')),
  row_counts jsonb not null default '{}'::jsonb,
  warnings jsonb not null default '[]'::jsonb,
  details jsonb not null default '{}'::jsonb
);

create index if not exists data_source_runs_source_lookup_idx
  on public.data_source_runs (source_key, retrieved_at desc);
create unique index if not exists data_source_runs_source_hash_uidx
  on public.data_source_runs (source_key, content_sha256)
  where content_sha256 is not null;

-- CRICOS is the authority for international-student course registration.
-- Keep a lifecycle marker even when an old record remains in the table so
-- pages never imply that a no-longer-active course is currently enrolable.
alter table public.courses_au
  add column if not exists cricos_status text not null default 'active',
  add column if not exists cricos_last_seen_at timestamptz,
  add column if not exists cricos_content_hash text;

alter table public.courses_au
  drop constraint if exists courses_au_cricos_status_check;
alter table public.courses_au
  add constraint courses_au_cricos_status_check
  check (cricos_status in ('active', 'expired', 'unknown'));
create index if not exists courses_au_cricos_active_idx
  on public.courses_au (institution_id, aqf_level, cricos_last_seen_at desc)
  where cricos_status = 'active';

-- Field-level facts from a provider's own course page. A value is not
-- automatically shown as verified: the review state is explicit and the
-- original URL/hash is retained for every published fact.
create table if not exists public.program_page_facts_au (
  id bigint generated always as identity primary key,
  course_id bigint not null references public.courses_au(id) on delete cascade,
  field_key text not null check (field_key in (
    'annual_tuition_aud', 'english_requirement', 'entry_requirements',
    'intakes', 'campus', 'duration', 'application_deadline'
  )),
  value jsonb not null,
  source_url text not null,
  source_content_hash text,
  extracted_at timestamptz not null default now(),
  effective_from date,
  effective_to date,
  review_status text not null default 'auto_extracted'
    check (review_status in ('auto_extracted', 'verified', 'stale', 'rejected')),
  reviewed_at timestamptz,
  reviewer_note text
);
create index if not exists program_page_facts_au_lookup_idx
  on public.program_page_facts_au (course_id, field_key, extracted_at desc);
create index if not exists program_page_facts_au_review_idx
  on public.program_page_facts_au (review_status, extracted_at desc);

-- Legal and professional rules must be maintained separately from course
-- marketing content. The mandatory review state prevents unverified crawler
-- output from being presented as licensing or migration advice.
create table if not exists public.regulatory_requirements_au (
  id bigint generated always as identity primary key,
  scope_type text not null check (scope_type in ('occupation', 'major', 'qualification')),
  scope_code text not null,
  state_or_territory text not null default 'AU',
  authority_name text not null,
  authority_url text not null,
  requirement_type text not null check (requirement_type in ('licence', 'registration', 'qualification', 'skills_assessment')),
  requirement_text text not null,
  source_content_hash text,
  effective_from date,
  effective_to date,
  review_status text not null default 'review_required'
    check (review_status in ('review_required', 'verified', 'stale', 'retired')),
  last_checked_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewer_note text
);
create index if not exists regulatory_requirements_au_scope_idx
  on public.regulatory_requirements_au (scope_type, scope_code, state_or_territory, review_status);

create table if not exists public.visa_occupation_status_au (
  id bigint generated always as identity primary key,
  osca_code text,
  anzsco_v13_code text,
  list_name text not null,
  visa_stream text,
  status text not null check (status in ('eligible', 'not_listed', 'review_required', 'superseded')),
  effective_from date,
  effective_to date,
  source_url text not null,
  source_content_hash text,
  retrieved_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewer_note text,
  check (osca_code is not null or anzsco_v13_code is not null)
);
create index if not exists visa_occupation_status_au_lookup_idx
  on public.visa_occupation_status_au (osca_code, anzsco_v13_code, list_name, effective_from desc);

alter table public.data_source_runs enable row level security;
alter table public.program_page_facts_au enable row level security;
alter table public.regulatory_requirements_au enable row level security;
alter table public.visa_occupation_status_au enable row level security;

-- No anon/authenticated policies: these are internal operational records.
grant all privileges on table public.data_source_runs, public.program_page_facts_au,
  public.regulatory_requirements_au, public.visa_occupation_status_au to service_role;
grant usage, select on all sequences in schema public to service_role;
