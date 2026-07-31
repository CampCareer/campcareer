-- Rebuild public-schema access for the CampCareer site.
--
-- After the canonical-schema cutover (report-factory migrations, July 30):
--   • Reference tables (occupations_au, colleges_au, courses_au, …) were moved
--     to the ingest schema and locked to service_role only.
--   • User-owned tables (saved_*, programme_evidence, …) were moved to the
--     retired schema and then dropped entirely.
--   • The roi_explorer_* materialised views (which joined legacy public tables)
--     were also dropped.
--
-- This migration creates SECURITY DEFINER views so that the Data API (PostgREST)
-- can serve reference data from ingest, and re-creates dropped user tables so
-- existing client code does not 404.

-- ============================================================================
-- 1.  Reference views – read-only pass-through over ingest.* tables
--     (SECURITY DEFINER behaviour is the default for PG < 15 views that are
--      owned by the migration user, who has full access to the ingest schema.)
-- ============================================================================

-- Cities
create or replace view public.cities_au as select * from ingest.cities_au;
create or replace view public.cities_ca as select * from ingest.cities_ca;
create or replace view public.cities_ie as select * from ingest.cities_ie;
create or replace view public.cities_uk as select * from ingest.cities_uk;
create or replace view public.cities_us as select * from ingest.cities_us;

-- Colleges / institutions
create or replace view public.colleges_au as select * from ingest.colleges_au;
create or replace view public.colleges_ca as select * from ingest.colleges_ca;
create or replace view public.colleges_ie as select * from ingest.colleges_ie;
create or replace view public.colleges_uk as select * from ingest.colleges_uk;
create or replace view public.colleges_us as select * from ingest.colleges_us;
create or replace view public.colleges_nl as select * from ingest.colleges_nl;

-- Courses / programmes
create or replace view public.courses_au as select * from ingest.courses_au;
create or replace view public.courses_ca as select * from ingest.courses_ca;
create or replace view public.courses_ie as select * from ingest.courses_ie;
create or replace view public.courses_uk as select * from ingest.courses_uk;
create or replace view public.programs_us as select * from ingest.programs_us;

-- Field earnings
create or replace view public.field_earnings_au as select * from ingest.field_earnings_au;
create or replace view public.field_earnings_ca as select * from ingest.field_earnings_ca;
create or replace view public.field_earnings_ie as select * from ingest.field_earnings_ie;
create or replace view public.field_earnings_uk as select * from ingest.field_earnings_uk;
create or replace view public.graduate_outcomes_ie as select * from ingest.graduate_outcomes_ie;

-- Occupation catalogues
create or replace view public.occupations_au as select * from ingest.occupations_au;
create or replace view public.occupations_ca as select * from ingest.occupations_ca;
create or replace view public.occupations_uk as select * from ingest.occupations_uk;

-- Occupation state-level data
create or replace view public.occupation_state_au as select * from ingest.occupation_state_au;
create or replace view public.occupation_state_ca as select * from ingest.occupation_state_ca;
create or replace view public.occupation_state_uk as select * from ingest.occupation_state_uk;

-- AU labour-market tables
create or replace view public.occupation_profiles_au as select * from ingest.occupation_profiles_au;
create or replace view public.occupation_outlook_au as select * from ingest.occupation_outlook_au;
create or replace view public.occupation_vacancies_au as select * from ingest.occupation_vacancies_au;
create or replace view public.occupation_regional_employment_au as select * from ingest.occupation_regional_employment_au;
create or replace view public.occupation_mobility_flows_au as select * from ingest.occupation_mobility_flows_au;
create or replace view public.occupation_mobility_stocks_au as select * from ingest.occupation_mobility_stocks_au;
create or replace view public.occupation_pathways_au as select * from ingest.occupation_pathways_au;
create or replace view public.occupation_shortage_drivers_au as select * from ingest.occupation_shortage_drivers_au;
create or replace view public.occupation_sa4_au as select * from ingest.occupation_sa4_au;

-- Policy / programme-page tables
create or replace view public.visa_occupation_status_au as select * from ingest.visa_occupation_status_au;
create or replace view public.regulatory_requirements_au as select * from ingest.regulatory_requirements_au;
create or replace view public.program_page_facts_au as select * from ingest.program_page_facts_au;
create or replace view public.state_salary_multiplier as select * from ingest.state_salary_multiplier;
create or replace view public.country_pr_pathways as select * from ingest.country_pr_pathways;
create or replace view public.shortage_occupations_ie as select * from ingest.shortage_occupations_ie;
create or replace view public.language_schools_ie as select * from ingest.language_schools_ie;
create or replace view public.language_courses_ie as select * from ingest.language_courses_ie;

-- ============================================================================
-- 2.  majors view – taxonomy.study_concepts was the canonical successor
--     (the old public.majors table was moved to retired and dropped).
-- ============================================================================

create or replace view public.majors as
select
  row_number() over (order by sc.created_at)::bigint as id,
  sc.canonical_name  as name,
  sc.name_ko,
  sc.slug,
  sc.concept_type    as category,
  sc.status,
  sc.created_at,
  sc.updated_at
from taxonomy.study_concepts sc
where sc.status = 'active';

-- ============================================================================
-- 3.  roi_explorer_au – regular (non-materialised) views that join the
--     underlying ingest tables.
--     (These were formerly materialised views in the public schema, moved to
--      retired and then cascade-dropped.)
-- ============================================================================

create or replace view public.roi_explorer_au as
select
  c.id::text                            as college_id,
  c.name                                as college_name,
  c.state                               as college_state,
  c.school_type                         as school_type,
  coalesce(ft.tuition, 0)::int          as tuition,
  -- graduation_rate, rent_median, etc. may exist on colleges_au if populated by
  -- legacy SQL scripts; default to NULL so the view never fails on missing cols.
  null::numeric                         as graduation_rate,
  null::int                             as median_earnings,
  null::text                            as field_name,
  null::int                             as aqf_level,
  null::numeric                         as employment_rate,
  null::int                             as rent_median,
  null::int                             as cost_of_living_index,
  null::int                             as median_household_income,
  co.duration_years::int                as duration_years,
  co.course_count::int                  as course_count,
  null::int                             as avg_cao_points,
  null::int                             as min_cao_points,
  null::int                             as max_cao_points,
  null::int                             as nfq_level,
  0::int                                as net_salary,
  0::numeric                            as roi_score,
  0::numeric                            as payback_years,
  null::numeric                         as latitude,
  null::numeric                         as longitude
from ingest.colleges_au c
left join (
  select institution_id,
         min(duration_years) as duration_years,
         count(*)            as course_count
  from ingest.courses_au
  group by institution_id
) co on co.institution_id = c.institution_id
left join (
  select institution_id,
         min(tuition_fee_aud) as tuition
  from ingest.courses_au
  where tuition_fee_aud is not null and tuition_fee_aud > 0
  group by institution_id
) ft on ft.institution_id = c.institution_id;

-- Other country ROI views (pass-through structure, columns match what roi-query.ts expects)
create or replace view public.roi_explorer_ca as
select
  c.id::text as college_id,
  c.name as college_name,
  c.province as college_state,
  c.school_type as school_type,
  coalesce(ft.tuition, 0)::int as tuition,
  null::numeric as graduation_rate,
  null::int as median_earnings,
  null::text as field_name,
  null::int as aqf_level,
  null::numeric as employment_rate,
  null::int as rent_median,
  null::int as cost_of_living_index,
  null::int as median_household_income,
  co.duration_years::int as duration_years,
  co.course_count::int as course_count,
  null::int as nfq_level,
  0::int as net_salary,
  0::numeric as roi_score,
  0::numeric as payback_years,
  null::numeric as latitude,
  null::numeric as longitude
from ingest.colleges_ca c
left join (select institution_id, min(duration_years) as duration_years, count(*) as course_count from ingest.courses_ca group by institution_id) co on co.institution_id = c.institution_id
left join (select institution_id, min(tuition_fee_cad) as tuition from ingest.courses_ca where tuition_fee_cad is not null and tuition_fee_cad > 0 group by institution_id) ft on ft.institution_id = c.institution_id;

create or replace view public.roi_explorer_uk as
select
  c.id::text as college_id,
  c.name as college_name,
  c.region as college_state,
  c.school_type as school_type,
  coalesce(ft.tuition, 0)::int as tuition,
  null::numeric as graduation_rate,
  null::int as median_earnings,
  null::text as field_name,
  null::int as aqf_level,
  null::numeric as employment_rate,
  null::int as rent_median,
  null::int as cost_of_living_index,
  null::int as median_household_income,
  co.duration_years::int as duration_years,
  co.course_count::int as course_count,
  null::int as nfq_level,
  0::int as net_salary,
  0::numeric as roi_score,
  0::numeric as payback_years,
  null::numeric as latitude,
  null::numeric as longitude
from ingest.colleges_uk c
left join (select institution_id, min(duration_years) as duration_years, count(*) as course_count from ingest.courses_uk group by institution_id) co on co.institution_id = c.institution_id
left join (select institution_id, min(tuition_fee_gbp) as tuition from ingest.courses_uk where tuition_fee_gbp is not null and tuition_fee_gbp > 0 group by institution_id) ft on ft.institution_id = c.institution_id;

create or replace view public.roi_explorer_ie as
select
  c.id::text as college_id,
  c.name as college_name,
  c.region as college_state,
  c.school_type as school_type,
  null::int as tuition,
  null::numeric as graduation_rate,
  null::int as median_earnings,
  null::text as field_name,
  null::int as aqf_level,
  null::numeric as employment_rate,
  null::int as rent_median,
  null::int as cost_of_living_index,
  null::int as median_household_income,
  co.duration_years::int as duration_years,
  co.course_count::int as course_count,
  cp.avg_cao_points::numeric as avg_cao_points,
  cp.min_cao_points::numeric as min_cao_points,
  cp.max_cao_points::numeric as max_cao_points,
  null::int as nfq_level,
  0::int as net_salary,
  0::numeric as roi_score,
  0::numeric as payback_years,
  null::numeric as latitude,
  null::numeric as longitude
from ingest.colleges_ie c
left join (select institution_id, min(duration_years) as duration_years, count(*) as course_count from ingest.courses_ie group by institution_id) co on co.institution_id = c.institution_id
left join (select institution_id, avg(cao_points_2025) as avg_cao_points, min(cao_points_2025) as min_cao_points, max(cao_points_2025) as max_cao_points from ingest.courses_ie where cao_points_2025 is not null group by institution_id) cp on cp.institution_id = c.institution_id;

-- roi_explorer_us: institution-level US data
create or replace view public.roi_explorer_us as
select
  c.id::text                            as college_id,
  c.name                                as college_name,
  c.state                               as college_state,
  c.school_type                         as school_type,
  coalesce(c.avg_net_price, 0)::int     as tuition,
  c.graduation_rate                     as graduation_rate,
  c.median_earnings::int                as median_earnings,
  null::text                            as field_name,
  null::int                             as aqf_level,
  null::numeric                         as employment_rate,
  null::int                             as rent_median,
  null::int                             as cost_of_living_index,
  null::int                             as median_household_income,
  null::int                             as duration_years,
  null::int                             as course_count,
  null::int                             as nfq_level,
  0::int                                as net_salary,
  0::numeric                            as roi_score,
  0::numeric                            as payback_years,
  null::numeric                         as latitude,
  null::numeric                         as longitude
from ingest.colleges_us c;

-- roi_explorer_by_field_us: field-level US data (by cip_code / field_name)
create or replace view public.roi_explorer_by_field_us as
select
  c.id::text                            as college_id,
  c.name                                as college_name,
  c.state                               as college_state,
  c.school_type                         as school_type,
  coalesce(c.avg_net_price, 0)::int     as tuition,
  c.graduation_rate                     as graduation_rate,
  coalesce(p.median_earnings, c.median_earnings)::int as median_earnings,
  p.field_name,
  null::int                             as aqf_level,
  p.employment_rate                     as employment_rate,
  null::int                             as rent_median,
  null::int                             as cost_of_living_index,
  null::int                             as median_household_income,
  null::int                             as duration_years,
  1::int                                as course_count,
  null::int                             as nfq_level,
  0::int                                as net_salary,
  0::numeric                            as roi_score,
  0::numeric                            as payback_years,
  null::numeric                         as latitude,
  null::numeric                         as longitude
from ingest.colleges_us c
left join ingest.programs_us p on p.college_id = c.id
where p.field_name is not null;

-- roi_explorer_nl: institution-level NL data (pattern from init-nl.sql)
create or replace view public.roi_explorer_nl as
select
  c.id::text as college_id,
  c.name as college_name,
  c.province as college_state,
  c.city as college_city,
  'public' as school_type,
  coalesce(c.tuition, 15000)::int as tuition,
  coalesce(c.graduation_rate, 0.82)::numeric as graduation_rate,
  coalesce(c.median_earnings, 48000)::int as median_earnings,
  null::text as field_name,
  null::int as nfq_level,
  null::numeric as employment_rate,
  coalesce(c.rent_median, 1000)::int as rent_median,
  coalesce(c.cost_of_living_index, 65)::int as cost_of_living_index,
  null::int as median_household_income,
  3::int as duration_years,
  1::int as course_count,
  null::numeric as avg_cao_points,
  null::numeric as min_cao_points,
  null::numeric as max_cao_points,
  greatest(0, coalesce(c.median_earnings, 48000) - coalesce(c.rent_median, 1000) * 0.45 * 12 * 1.4)::int as net_salary,
  case
    when coalesce(c.tuition, 15000) > 0 and coalesce(c.median_earnings, 48000) > 0
    then round(greatest(0, coalesce(c.median_earnings, 48000) - coalesce(c.rent_median, 1000) * 0.45 * 12 * 1.4) * coalesce(c.graduation_rate, 0.82) / (coalesce(c.tuition, 15000) * 3) * 100, 1)
    else 0
  end::numeric as roi_score,
  case
    when (coalesce(c.median_earnings, 48000) - coalesce(c.rent_median, 1000) * 0.45 * 12 * 1.4) > 0
    then round(coalesce(c.tuition, 15000) * 3.0 / greatest(1, coalesce(c.median_earnings, 48000) - coalesce(c.rent_median, 1000) * 0.45 * 12 * 1.4), 1)
    else 0
  end::numeric as payback_years
from ingest.colleges_nl c;

-- roi_explorer_de: placeholder for Germany (not yet launched)
create or replace view public.roi_explorer_de as
select
  null::text as college_id,
  null::text as college_name,
  null::text as college_state,
  null::text as school_type,
  0::int as tuition,
  null::numeric as graduation_rate,
  null::int as median_earnings,
  null::text as field_name,
  null::int as aqf_level,
  null::numeric as employment_rate,
  null::int as rent_median,
  null::int as cost_of_living_index,
  null::int as median_household_income,
  null::int as duration_years,
  0::int as course_count,
  null::int as nfq_level,
  0::int as net_salary,
  0::numeric as roi_score,
  0::numeric as payback_years,
  null::numeric as latitude,
  null::numeric as longitude
where false;

-- ============================================================================
-- 4.  Re-create user-owned tables that were dropped with the retired schema.
--     Data cannot be recovered; table definitions are restored so the
--     application can write new rows and query existing (empty) tables.
-- ============================================================================

-- 4a. saved_courses
create table if not exists public.saved_courses (
  id            bigint generated always as identity primary key,
  user_id       uuid not null references auth.users(id) on delete cascade,
  course_id     text,
  country       text not null default 'AU',
  course_name   text not null default '',
  college_name  text not null default '',
  field_name    text not null default '',
  tuition       numeric(14,2),
  created_at    timestamptz not null default now(),
  unique (user_id, course_id)
);

alter table public.saved_courses enable row level security;

create policy "users_manage_own_saved_courses"
  on public.saved_courses for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- 4b. saved_occupations
create table if not exists public.saved_occupations (
  id        bigint generated always as identity primary key,
  user_id   uuid not null references auth.users(id) on delete cascade,
  occ_code  text not null,
  occ_title text not null default '',
  country   text not null default '',
  created_at timestamptz not null default now(),
  unique (user_id, occ_code)
);

alter table public.saved_occupations enable row level security;

create policy "users_manage_own_saved_occupations"
  on public.saved_occupations for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- 4c. saved_universities
create table if not exists public.saved_universities (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  univ_slug  text not null,
  univ_name  text not null default '',
  created_at timestamptz not null default now(),
  unique (user_id, univ_slug)
);

alter table public.saved_universities enable row level security;

create policy "users_manage_own_saved_universities"
  on public.saved_universities for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- 4d. saved_study_concepts
create table if not exists public.saved_study_concepts (
  id              bigint generated always as identity primary key,
  user_id         uuid not null references auth.users(id) on delete cascade,
  concept_slug    text not null check (char_length(concept_slug) between 1 and 120),
  concept_label   text not null default '' check (char_length(concept_label) <= 160),
  concept_label_ko text not null default '' check (char_length(concept_label_ko) <= 160),
  category        text not null default '' check (char_length(category) <= 80),
  country         text not null default 'AU' check (country = 'AU'),
  created_at      timestamptz not null default now(),
  unique (user_id, concept_slug)
);

create index if not exists saved_study_concepts_user_created_idx
  on public.saved_study_concepts (user_id, created_at desc);

alter table public.saved_study_concepts enable row level security;

create policy "users read own saved study concepts"
  on public.saved_study_concepts for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "users insert own saved study concepts"
  on public.saved_study_concepts for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "users update own saved study concepts"
  on public.saved_study_concepts for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "users delete own saved study concepts"
  on public.saved_study_concepts for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- 4e. programme_evidence
create table if not exists public.programme_evidence (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  programme_key text not null check (char_length(programme_key) between 2 and 180),
  evidence_type text not null check (evidence_type in ('course', 'registration', 'fees', 'admission')),
  official_url  text not null check (char_length(official_url) <= 500 and official_url ~ '^https://'),
  note          text not null default '' check (char_length(note) <= 600),
  created_at    timestamptz not null default now(),
  unique (user_id, programme_key, evidence_type)
);

create index if not exists programme_evidence_user_programme_idx
  on public.programme_evidence (user_id, programme_key, created_at desc);

alter table public.programme_evidence enable row level security;

create policy "users read own programme evidence"
  on public.programme_evidence for select
  to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

-- 4f. program_completions
create table if not exists public.program_completions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  program_id   text not null check (program_id in ('research-foundation-v1')),
  evidence     jsonb not null,
  completed_at timestamptz not null default now(),
  created_at   timestamptz not null default now(),
  unique (user_id, program_id),
  check (jsonb_typeof(evidence) = 'object')
);

create index if not exists program_completions_user_completed_idx
  on public.program_completions (user_id, completed_at desc);

alter table public.program_completions enable row level security;

create policy "users read own programme completions"
  on public.program_completions for select
  to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

-- 4g. contribution_submissions
create table if not exists public.contribution_submissions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  kind          text not null check (kind in ('review', 'correction', 'source')),
  target_path   text not null check (char_length(target_path) between 1 and 500 and target_path like '/%' and target_path not like '//%'),
  target_label  text not null default '' check (char_length(target_label) <= 180),
  description   text not null check (char_length(description) between 30 and 3000),
  source_url    text check (source_url is null or (char_length(source_url) <= 500 and source_url ~ '^https?://')),
  status        text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewer_note text check (reviewer_note is null or char_length(reviewer_note) <= 1000),
  reviewed_at   timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  check (kind <> 'source' or source_url is not null)
);

create index if not exists contribution_submissions_user_created_idx
  on public.contribution_submissions (user_id, created_at desc);
create index if not exists contribution_submissions_status_created_idx
  on public.contribution_submissions (status, created_at asc);

alter table public.contribution_submissions enable row level security;

create policy "contributors read own submissions"
  on public.contribution_submissions for select
  to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "contributors submit pending work"
  on public.contribution_submissions for insert
  to authenticated
  with check (
    (select auth.uid()) is not null
    and (select auth.uid()) = user_id
    and status = 'pending'
    and reviewer_note is null
    and reviewed_at is null
  );

create policy "contributors withdraw pending work"
  on public.contribution_submissions for delete
  to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.uid()) = user_id
    and status = 'pending'
  );

-- 4h. reputation_ledger
create table if not exists public.reputation_ledger (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  contribution_id uuid not null unique references public.contribution_submissions(id) on delete cascade,
  event_type      text not null check (event_type = 'approved_contribution'),
  points          smallint not null check (points > 0 and points <= 100),
  created_at      timestamptz not null default now()
);

create index if not exists reputation_ledger_user_created_idx
  on public.reputation_ledger (user_id, created_at desc);

alter table public.reputation_ledger enable row level security;

create policy "contributors read own reputation"
  on public.reputation_ledger for select
  to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

-- 4i. notifications_sent
create table if not exists public.notifications_sent (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references auth.users(id) on delete cascade,
  channel   text not null,
  template  text not null,
  payload   jsonb not null default '{}'::jsonb,
  status    text not null default 'sent',
  sent_at   timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.notifications_sent enable row level security;
grant select, insert, update on public.notifications_sent to service_role;

-- 4j. audit / check-list tables
create table if not exists public.checklist_cache (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references auth.users(id) on delete cascade,
  cache_key text not null,
  payload   jsonb not null default '{}'::jsonb,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.checklist_cache enable row level security;

-- 4k. user_checklist_progress
create table if not exists public.user_checklist_progress (
  id        bigint generated always as identity primary key,
  user_id   uuid not null references auth.users(id) on delete cascade,
  step_key  text not null,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, step_key)
);

alter table public.user_checklist_progress enable row level security;

create policy "users_manage_own_checklist_progress"
  on public.user_checklist_progress for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- 4l. user_career_paths
create table if not exists public.user_career_paths (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references auth.users(id) on delete cascade,
  path_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_career_paths enable row level security;

-- 4m. user_documents
create table if not exists public.user_documents (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  doc_type   text not null,
  doc_label  text not null default '',
  storage_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_documents enable row level security;

-- 4n. user_timeline
create table if not exists public.user_timeline (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  event_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.user_timeline enable row level security;

-- 4o. user_calendar_notes
create table if not exists public.user_calendar_notes (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  note_date  date not null,
  title      text not null default '',
  content    text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_calendar_notes enable row level security;

-- 4p. occupation_state_nomination
create table if not exists public.occupation_state_nomination (
  id        bigint generated always as identity primary key,
  state     text not null,
  occ_code  text not null,
  status    text not null default 'unknown',
  unique (state, occ_code)
);

alter table public.occupation_state_nomination enable row level security;

-- 4q. au_major_signals
create table if not exists public.au_major_signals (
  id           bigint generated always as identity primary key,
  major_slug   text not null,
  signal_type  text not null,
  signal_value numeric,
  source       text,
  as_of        date,
  created_at   timestamptz not null default now()
);

alter table public.au_major_signals enable row level security;

-- 4r. roi_history
create table if not exists public.roi_history (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  country    text not null,
  params     jsonb not null default '{}'::jsonb,
  result     jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.roi_history enable row level security;

-- 4s. report_decision_options
create table if not exists public.report_decision_options (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid,
  option_key text not null,
  label     text not null,
  value     jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.report_decision_options enable row level security;

-- 4t. report_intakes
create table if not exists public.report_intakes (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid,
  intake_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.report_intakes enable row level security;

-- 4u. report_launch_interests
create table if not exists public.report_launch_interests (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  country    text,
  locale     text not null default 'en',
  status     text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.report_launch_interests enable row level security;

-- 4v. report_orders
create table if not exists public.report_orders (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid,
  report_key text not null,
  status     text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.report_orders enable row level security;

-- 4w. city_living_cost_profiles_au
create table if not exists public.city_living_cost_profiles_au (
  id                         uuid primary key default gen_random_uuid(),
  city_slug                  text not null,
  city_name                  text not null,
  state_or_territory         text not null,
  housing_scenario           text not null,
  annual_rent_aud            integer not null,
  annual_non_rent_cost_aud   integer not null,
  annual_total_living_cost_aud integer not null,
  reviewed_at                timestamptz not null default now(),
  review_status              text not null default 'review_required',
  created_at                 timestamptz not null default now(),
  updated_at                 timestamptz not null default now()
);

alter table public.city_living_cost_profiles_au enable row level security;

-- 4x. report_metric_evidence_au
create table if not exists public.report_metric_evidence_au (
  id            uuid primary key default gen_random_uuid(),
  scope_type    text not null,
  scope_id      text not null,
  metric_key    text not null,
  value         jsonb not null,
  source_name   text not null,
  source_url    text not null,
  data_as_of    date not null,
  last_verified_at timestamptz not null default now(),
  confidence    text not null default 'medium',
  evidence_kind text not null default 'observed',
  review_status text not null default 'review_required',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.report_metric_evidence_au enable row level security;

-- 4y. data_source_runs (moved to evidence.ingestion_runs by management-API migration)
-- Recreate as a view pointing to the canonical table so code continues to work.
create or replace view public.data_source_runs as
select id, source_key, source_name, source_url, status, row_counts, warnings, details, completed_at as created_at
from evidence.ingestion_runs;

-- ============================================================================
-- 5.  Mark all reference views as security_invoker = false so they run with
--     the owner's privileges (which include access to the ingest schema).
-- ============================================================================

do $$
declare
  ref_views text[] := array[
    'cities_au','cities_ca','cities_ie','cities_uk','cities_us',
    'colleges_au','colleges_ca','colleges_ie','colleges_uk','colleges_us','colleges_nl',
    'courses_au','courses_ca','courses_ie','courses_uk','programs_us',
    'field_earnings_au','field_earnings_ca','field_earnings_ie','field_earnings_uk',
    'graduate_outcomes_ie',
    'occupations_au','occupations_ca','occupations_uk',
    'occupation_state_au','occupation_state_ca','occupation_state_uk',
    'occupation_profiles_au','occupation_outlook_au','occupation_vacancies_au',
    'occupation_regional_employment_au','occupation_mobility_flows_au','occupation_mobility_stocks_au',
    'occupation_pathways_au','occupation_shortage_drivers_au','occupation_sa4_au',
    'visa_occupation_status_au','regulatory_requirements_au','program_page_facts_au',
    'state_salary_multiplier','country_pr_pathways','shortage_occupations_ie',
    'language_schools_ie','language_courses_ie','majors','data_source_runs',
    'roi_explorer_au','roi_explorer_ca','roi_explorer_uk','roi_explorer_ie',
    'roi_explorer_us','roi_explorer_by_field_us','roi_explorer_nl','roi_explorer_de'
  ];
  v text;
begin
  foreach v in array ref_views
  loop
    execute format('alter view public.%I set (security_invoker = false)', v);
  end loop;
end;
$$;

-- ============================================================================
-- 6.  Grant public read on all reference views + user tables
-- ============================================================================

grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon, authenticated;

-- Restore default privileges so future tables also get SELECT granted.
alter default privileges in schema public grant select on tables to anon, authenticated;


