-- Global comparison, optional origin personalisation, and consented lead flow.
-- Public comparison data remains server-served; these tables are never exposed
-- to anonymous users through the Data API.

alter table public.decision_plans alter column origin_country drop not null;
alter table public.plan_save_intents alter column origin_country drop not null;

create table public.concept_career_mappings (
  id bigint generated always as identity primary key,
  concept_id text not null references public.canonical_concepts(id) on delete cascade,
  canonical_career_id text not null,
  country_code text not null check (country_code ~ '^[A-Z]{2}$'),
  relation text not null check (relation = 'exact'),
  source_url text not null,
  as_of date not null,
  last_verified_at timestamptz not null,
  review_status text not null check (review_status in ('APPROVED', 'STALE', 'REVIEW_REQUIRED')),
  unique (concept_id, canonical_career_id, country_code)
);

create table public.career_compensation_observations (
  id bigint generated always as identity primary key,
  canonical_career_id text not null,
  country_code text not null check (country_code ~ '^[A-Z]{2}$'),
  city text,
  employment_basis text not null check (employment_basis in ('FULL_TIME_EMPLOYEE', 'ALL_EMPLOYEES')),
  annual_gross_amount numeric(14, 2) not null check (annual_gross_amount > 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  source_name text not null,
  source_url text not null,
  as_of date not null,
  last_verified_at timestamptz not null,
  review_status text not null check (review_status in ('APPROVED', 'STALE', 'REVIEW_REQUIRED'))
);

create table public.housing_cost_observations (
  id bigint generated always as identity primary key,
  country_code text not null check (country_code ~ '^[A-Z]{2}$'),
  city text not null,
  housing_type text not null check (housing_type in ('SHARED_STUDENT', 'ONE_BEDROOM_CITY_CENTRE', 'ONE_BEDROOM_OUTSIDE_CENTRE')),
  monthly_amount numeric(14, 2) not null check (monthly_amount > 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  source_name text not null,
  source_url text not null,
  as_of date not null,
  last_verified_at timestamptz not null,
  review_status text not null check (review_status in ('APPROVED', 'STALE', 'REVIEW_REQUIRED')),
  unique (country_code, city, housing_type, as_of)
);

create table public.country_comparison_coverage (
  concept_id text not null references public.canonical_concepts(id) on delete cascade,
  origin_country text not null check (origin_country ~ '^[A-Z]{2}$'),
  destination_country text not null check (destination_country ~ '^[A-Z]{2}$'),
  status text not null check (status in ('READY', 'UNAVAILABLE', 'REVIEW_REQUIRED')),
  reason text,
  last_verified_at timestamptz not null,
  primary key (concept_id, origin_country, destination_country)
);

create table public.partner_profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  partner_type text not null check (partner_type in ('INSTITUTION', 'AGENCY')),
  status text not null check (status in ('PENDING', 'VERIFIED', 'SUSPENDED')) default 'PENDING',
  verification_notes text,
  data_processing_agreement_at timestamptz,
  response_sla_business_hours integer check (response_sla_business_hours > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.partner_members (
  partner_id uuid not null references public.partner_profiles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('ADMIN', 'OPERATOR')),
  created_at timestamptz not null default now(),
  primary key (partner_id, user_id)
);

create table public.lead_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  concept_id text not null references public.canonical_concepts(id),
  destination_country text not null check (destination_country ~ '^[A-Z]{2}$'),
  course_offering_id bigint references public.course_offerings(id),
  intended_intake text,
  first_year_budget numeric(14, 2) check (first_year_budget is null or first_year_budget > 0),
  budget_currency text check (budget_currency is null or budget_currency ~ '^[A-Z]{3}$'),
  help_needed text[] not null default '{}',
  contact_name text not null,
  contact_email text not null,
  consented_at timestamptz not null,
  consent_version text not null,
  status text not null check (status in ('SUBMITTED', 'QUALIFIED', 'SHARED', 'ACCEPTED', 'CONTACTED', 'APPOINTMENT', 'APPLIED', 'ENROLLED', 'REJECTED')) default 'SUBMITTED',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lead_assignments (
  id uuid primary key default gen_random_uuid(),
  lead_request_id uuid not null references public.lead_requests(id) on delete cascade,
  partner_id uuid not null references public.partner_profiles(id),
  status text not null check (status in ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED')) default 'PENDING',
  shared_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  unique (lead_request_id, partner_id)
);

create table public.lead_status_events (
  id bigint generated always as identity primary key,
  lead_request_id uuid not null references public.lead_requests(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  previous_status text,
  next_status text not null,
  note text,
  created_at timestamptz not null default now()
);

create index concept_career_mappings_lookup_idx on public.concept_career_mappings (concept_id, country_code, review_status);
create unique index career_compensation_observations_unique_idx on public.career_compensation_observations (canonical_career_id, country_code, coalesce(city, ''), employment_basis, as_of);
create index career_compensation_lookup_idx on public.career_compensation_observations (canonical_career_id, country_code, review_status, last_verified_at desc);
create index housing_cost_lookup_idx on public.housing_cost_observations (country_code, housing_type, review_status, last_verified_at desc);
create index country_comparison_coverage_lookup_idx on public.country_comparison_coverage (concept_id, origin_country, status);
create index lead_requests_user_created_idx on public.lead_requests (user_id, created_at desc);
create index lead_requests_status_created_idx on public.lead_requests (status, created_at desc);
create index lead_assignments_partner_status_idx on public.lead_assignments (partner_id, status, created_at desc);
create index lead_status_events_request_created_idx on public.lead_status_events (lead_request_id, created_at desc);

alter table public.concept_career_mappings enable row level security;
alter table public.career_compensation_observations enable row level security;
alter table public.housing_cost_observations enable row level security;
alter table public.country_comparison_coverage enable row level security;
alter table public.partner_profiles enable row level security;
alter table public.partner_members enable row level security;
alter table public.lead_requests enable row level security;
alter table public.lead_assignments enable row level security;
alter table public.lead_status_events enable row level security;

create policy lead_requests_select_own on public.lead_requests
  for select to authenticated using ((select auth.uid()) = user_id);
create policy partner_members_select_own on public.partner_members
  for select to authenticated using ((select auth.uid()) = user_id);
create policy lead_assignments_select_partner on public.lead_assignments
  for select to authenticated using (exists (
    select 1 from public.partner_members member
    where member.partner_id = lead_assignments.partner_id and member.user_id = (select auth.uid())
  ));
create policy lead_status_events_select_owner_or_partner on public.lead_status_events
  for select to authenticated using (
    exists (select 1 from public.lead_requests request where request.id = lead_status_events.lead_request_id and request.user_id = (select auth.uid()))
    or exists (
      select 1 from public.lead_assignments assignment
      join public.partner_members member on member.partner_id = assignment.partner_id
      where assignment.lead_request_id = lead_status_events.lead_request_id and member.user_id = (select auth.uid())
    )
  );

revoke all on table public.concept_career_mappings, public.career_compensation_observations, public.housing_cost_observations, public.country_comparison_coverage, public.partner_profiles, public.partner_members, public.lead_requests, public.lead_assignments, public.lead_status_events from anon, authenticated;
grant select on table public.lead_requests, public.partner_members, public.lead_assignments, public.lead_status_events to authenticated;
grant all on table public.concept_career_mappings, public.career_compensation_observations, public.housing_cost_observations, public.country_comparison_coverage, public.partner_profiles, public.partner_members, public.lead_requests, public.lead_assignments, public.lead_status_events to service_role;
grant usage, select on all sequences in schema public to service_role;
