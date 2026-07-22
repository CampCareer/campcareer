-- Commercial-report evidence ledger for Australia.
--
-- Discovery cards can safely render aggregate sources, but a paid report must
-- be able to identify the exact source, dataset date, reviewer, confidence,
-- and calculation status behind every material claim. These tables are
-- private operational data: public pages receive only curated report output.

create table if not exists public.report_metric_evidence_au (
  id uuid primary key default gen_random_uuid(),
  scope_type text not null check (scope_type in (
    'field', 'occupation', 'city', 'university', 'programme', 'roi-index', 'policy'
  )),
  scope_id text not null check (char_length(scope_id) between 1 and 180),
  metric_key text not null check (metric_key in (
    'annual_tuition_aud',
    'median_salary_aud',
    'employment_rate',
    'completion_rate',
    'job_relevance_rate',
    'annual_rent_aud',
    'annual_non_rent_living_cost_aud',
    'annual_living_cost_aud',
    'shortage_signal',
    'employment_outlook',
    'ai_exposure',
    'cricos_status',
    'provider_registration',
    'visa_policy',
    'professional_registration',
    'payback_methodology',
    'roi_methodology'
  )),
  value jsonb not null,
  unit text,
  source_name text not null check (char_length(source_name) between 2 and 240),
  source_url text not null check (source_url ~ '^https://'),
  source_content_hash text,
  data_as_of date not null,
  last_verified_at timestamptz not null default now(),
  confidence text not null check (confidence in ('high', 'medium', 'low')),
  evidence_kind text not null check (evidence_kind in ('observed', 'calculated', 'estimated', 'user_provided')),
  methodology text,
  assumptions jsonb not null default '{}'::jsonb,
  review_status text not null default 'review_required'
    check (review_status in ('review_required', 'verified', 'stale', 'rejected', 'retired')),
  effective_from date,
  effective_to date,
  reviewer_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (effective_to is null or effective_from is null or effective_to >= effective_from)
);

create unique index if not exists report_metric_evidence_au_source_version_uidx
  on public.report_metric_evidence_au (scope_type, scope_id, metric_key, source_url, data_as_of);
create index if not exists report_metric_evidence_au_release_lookup_idx
  on public.report_metric_evidence_au (scope_type, scope_id, metric_key, review_status, data_as_of desc);
create index if not exists report_metric_evidence_au_stale_review_idx
  on public.report_metric_evidence_au (review_status, last_verified_at asc);

-- A city profile separates accommodation assumptions from all other living
-- costs. This makes a shared-room estimate impossible to masquerade as a
-- studio or family estimate in a personalised ROI calculation.
create table if not exists public.city_living_cost_profiles_au (
  id uuid primary key default gen_random_uuid(),
  city_slug text not null check (city_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  city_name text not null,
  state_or_territory text not null,
  housing_scenario text not null check (housing_scenario in (
    'shared-room', 'private-room', 'studio', 'one-bedroom', 'family-two-bedroom'
  )),
  annual_rent_aud integer not null check (annual_rent_aud > 0),
  annual_non_rent_cost_aud integer not null check (annual_non_rent_cost_aud > 0),
  annual_total_living_cost_aud integer not null check (annual_total_living_cost_aud > 0),
  rent_evidence_id uuid not null references public.report_metric_evidence_au(id),
  non_rent_evidence_id uuid not null references public.report_metric_evidence_au(id),
  reviewed_at timestamptz not null default now(),
  review_status text not null default 'review_required'
    check (review_status in ('review_required', 'verified', 'stale', 'rejected')),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (annual_total_living_cost_aud = annual_rent_aud + annual_non_rent_cost_aud)
);

create unique index if not exists city_living_cost_profiles_au_version_uidx
  on public.city_living_cost_profiles_au (city_slug, housing_scenario, rent_evidence_id, non_rent_evidence_id);
create index if not exists city_living_cost_profiles_au_release_lookup_idx
  on public.city_living_cost_profiles_au (city_slug, housing_scenario, review_status, reviewed_at desc);

alter table public.report_metric_evidence_au enable row level security;
alter table public.city_living_cost_profiles_au enable row level security;

-- No anon/authenticated policy: the report generator and operator tooling use
-- a server-side service role. Public views must show only explicitly selected,
-- report-safe fields rather than this operational ledger.
grant all privileges on table public.report_metric_evidence_au, public.city_living_cost_profiles_au to service_role;
