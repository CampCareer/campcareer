-- Toronto city MVP for Canada.
-- Scope v1 is the named City of Toronto study market. Neighbouring GTA municipalities
-- such as Mississauga, Brampton and Oakville are not inferred into Toronto delivery claims.

create table if not exists public.city_directory_ca_v1 (
  city_id uuid primary key,
  country_code text not null,
  slug text not null unique,
  name text not null,
  region text not null,
  scope_kind text,
  latitude numeric,
  longitude numeric,
  linked_campus_count integer not null default 0,
  linked_institution_count integer not null default 0,
  linked_program_count integer not null default 0,
  source_system text,
  source_record_key text,
  updated_at timestamptz not null default now()
);

alter table public.city_directory_ca_v1 enable row level security;
revoke all on public.city_directory_ca_v1 from anon, authenticated;
grant select on public.city_directory_ca_v1 to service_role;

create table if not exists public.city_institution_directory_ca_v1 (
  city_id uuid not null,
  campus_id uuid not null,
  institution_id uuid not null,
  institution_name text not null,
  institution_type text,
  website_url text,
  campus_name text not null,
  locality text,
  region text not null,
  primary key (city_id, campus_id)
);

create index if not exists city_institution_directory_ca_v1_city_idx
  on public.city_institution_directory_ca_v1 (city_id, institution_name);

alter table public.city_institution_directory_ca_v1 enable row level security;
revoke all on public.city_institution_directory_ca_v1 from anon, authenticated;
grant select on public.city_institution_directory_ca_v1 to service_role;

truncate table public.city_institution_directory_ca_v1;
truncate table public.city_directory_ca_v1;

insert into public.city_directory_ca_v1 (
  city_id, country_code, slug, name, region, scope_kind, latitude, longitude,
  linked_campus_count, linked_institution_count, linked_program_count,
  source_system, source_record_key, updated_at
)
select
  g.id,
  g.country_code,
  g.slug,
  g.name,
  g.region_code,
  g.scope_kind,
  g.latitude,
  g.longitude,
  count(distinct c.id) filter (where c.status = 'active')::integer,
  count(distinct c.institution_id) filter (where c.status = 'active')::integer,
  count(distinct po.programme_id) filter (
    where c.status = 'active'
      and coalesce(po.enrolment_status, 'active') <> 'inactive'
  )::integer,
  'core.geographies',
  g.code,
  now()
from core.geographies g
left join catalog.campuses c
  on c.geography_id = g.id
 and c.country_code = 'CA'
left join catalog.programme_offerings po on po.campus_id = c.id
where g.country_code = 'CA'
  and g.geography_type = 'city'
  and g.canonical_geography_id is null
  and g.status = 'active'
  and g.slug is not null
group by g.id, g.country_code, g.slug, g.name, g.region_code, g.scope_kind,
         g.latitude, g.longitude, g.code;

insert into public.city_institution_directory_ca_v1 (
  city_id, campus_id, institution_id, institution_name, institution_type,
  website_url, campus_name, locality, region
)
select
  c.geography_id,
  c.id,
  i.id,
  i.canonical_name,
  coalesce(i.institution_kind, i.institution_type),
  i.website_url,
  c.name,
  coalesce(c.locality, c.city),
  c.region
from catalog.campuses c
join catalog.institutions i on i.id = c.institution_id
join core.geographies g on g.id = c.geography_id
where c.country_code = 'CA'
  and c.status = 'active'
  and i.country_code = 'CA'
  and g.geography_type = 'city'
  and g.canonical_geography_id is null
  and g.status = 'active';

insert into evidence.sources (
  source_key, organisation_name, source_name, source_type, canonical_url,
  country_code, active, updated_at
)
values
  ('cc_ca_toronto_population_2024_v1', 'City of Toronto', 'Development Pipeline 2024 — Toronto population estimate', 'government_dataset', 'https://www.toronto.ca/legdocs/mmis/2025/ph/bgrd/backgroundfile-255739.pdf', 'CA', true, now()),
  ('cc_ca_rotman_toronto_living_cost_v1', 'University of Toronto — Rotman School of Management', 'Typical living expenses — Full-Time MBA', 'provider', 'https://www.rotman.utoronto.ca/programs/mba-programs/full-time-mba/tuition-scholarships/', 'CA', true, now()),
  ('cc_ca_ttc_fares_2026_v1', 'Toronto Transit Commission', 'TTC fares and post-secondary student pass', 'regulator', 'https://www.ttc.ca/Fares-and-passes/Fares-Types', 'CA', true, now()),
  ('cc_ca_ircc_student_work_2026_v1', 'Immigration, Refugees and Citizenship Canada', 'Work off campus as an international student', 'government_dataset', 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/work-off-campus.html', 'CA', true, now()),
  ('cc_ca_toronto_industry_sectors_2026_v1', 'City of Toronto', 'Industry sector support', 'government_dataset', 'https://www.toronto.ca/business-economy/industry-sector-support/', 'CA', true, now())
on conflict (source_key) do update set
  organisation_name = excluded.organisation_name,
  source_name = excluded.source_name,
  source_type = excluded.source_type,
  canonical_url = excluded.canonical_url,
  country_code = excluded.country_code,
  active = true,
  updated_at = now();

with snapshot_data(source_key, source_url, data_as_of, metadata) as (
  values
    ('cc_ca_toronto_population_2024_v1', 'https://www.toronto.ca/legdocs/mmis/2025/ph/bgrd/backgroundfile-255739.pdf', date '2024-07-01', '{"population":3273119,"geography":"City of Toronto","upstream":"Statistics Canada Annual Demographic Estimates: Subprovincial Areas"}'::jsonb),
    ('cc_ca_rotman_toronto_living_cost_v1', 'https://www.rotman.utoronto.ca/programs/mba-programs/full-time-mba/tuition-scholarships/', date '2026-08-08', '{"annual_low":23856,"annual_high":38756,"currency":"CAD","scenario":"single Full-Time MBA student, first 12 months in Toronto","includes":["textbooks","laptop","housing","food","public transportation","personal expenses","UHIP"]}'::jsonb),
    ('cc_ca_ttc_fares_2026_v1', 'https://www.ttc.ca/Fares-and-passes/Fares-Types', date '2026-08-08', '{"post_secondary_monthly_pass":128.15,"adult_presto_single":3.30,"currency":"CAD","post_secondary_photo_id_required":true}'::jsonb),
    ('cc_ca_ircc_student_work_2026_v1', 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/work-off-campus.html', date '2026-08-08', '{"off_campus_hours_per_week_during_academic_sessions":24,"unlimited_during_eligible_scheduled_breaks":true,"eligibility_conditions_apply":true}'::jsonb),
    ('cc_ca_toronto_industry_sectors_2026_v1', 'https://www.toronto.ca/business-economy/industry-sector-support/', date '2026-08-08', '{"sectors":["Financial services","Technology","Life sciences","Film and creative industries","Green economy","Food and beverage","Education"]}'::jsonb)
)
insert into evidence.source_snapshots (
  source_id, source_url, content_sha256, data_as_of, retrieved_at, valid_from,
  snapshot_status, metadata
)
select
  s.id,
  d.source_url,
  encode(digest(d.source_key || '|' || d.data_as_of::text || '|' || d.metadata::text, 'sha256'), 'hex'),
  d.data_as_of,
  now(),
  d.data_as_of,
  'captured',
  d.metadata || jsonb_build_object('captured_for', 'toronto_city_mvp_v1', 'country_code', 'CA')
from snapshot_data d
join evidence.sources s on s.source_key = d.source_key
on conflict (source_id, content_sha256) where content_sha256 is not null do update set
  source_url = excluded.source_url,
  data_as_of = excluded.data_as_of,
  retrieved_at = excluded.retrieved_at,
  valid_from = excluded.valid_from,
  snapshot_status = 'captured',
  metadata = excluded.metadata;

with toronto as (
  select id from core.geographies
  where country_code = 'CA'
    and geography_type = 'city'
    and slug = 'toronto'
    and canonical_geography_id is null
    and status = 'active'
  limit 1
)
delete from evidence.metric_observations o
using toronto t
where o.scope_type = 'city'
  and o.scope_id = t.id::text
  and o.metric_key in (
    'city_population',
    'student_living_cost_monthly_range',
    'student_transport_monthly_reference',
    'student_work_hours_week',
    'employment_focus_sectors'
  );

with toronto as (
  select id from core.geographies
  where country_code = 'CA'
    and geography_type = 'city'
    and slug = 'toronto'
    and canonical_geography_id is null
    and status = 'active'
  limit 1
), metric_data(metric_key, source_key, value, unit, confidence, evidence_kind, methodology, assumptions, effective_from) as (
  values
    ('city_population', 'cc_ca_toronto_population_2024_v1', '{"amount":3273119,"geography":"City of Toronto"}'::jsonb, 'people', 'high', 'observed', 'City of Toronto planning bulletin cites Statistics Canada estimated population as of July 1, 2024.', '{"not_cma_population":true}'::jsonb, date '2024-07-01'),
    ('student_living_cost_monthly_range', 'cc_ca_rotman_toronto_living_cost_v1', '{"low":1988,"high":3229.67,"currency":"CAD","period":"month","scenario":"single Full-Time MBA student, first 12 months in Toronto","indicative":true}'::jsonb, 'CAD/month', 'medium', 'calculated', 'Rotman annual living-expense range of CAD 23,856–38,756 divided by 12. Includes textbooks, laptop, housing, food, public transportation, personal expenses and UHIP; tuition excluded.', '{"annual_low":23856,"annual_high":38756,"tuition_excluded":true,"specific_student_scenario":true}'::jsonb, date '2026-08-08'),
    ('student_transport_monthly_reference', 'cc_ca_ttc_fares_2026_v1', '{"amount":128.15,"currency":"CAD","period":"month","transport_kind":"post_secondary_monthly_pass","eligibility_required":true,"adult_presto_single":3.30}'::jsonb, 'CAD/month', 'high', 'observed', 'TTC published post-secondary student monthly pass. Valid post-secondary photo identification requirements apply.', '{"not_equivalent_to_pay_as_you_go":true}'::jsonb, date '2026-08-08'),
    ('student_work_hours_week', 'cc_ca_ircc_student_work_2026_v1', '{"hours":24,"period":"week_during_academic_sessions","unlimited_during_eligible_scheduled_breaks":true,"eligibility_conditions_apply":true}'::jsonb, 'hours/week', 'high', 'observed', 'IRCC off-campus work rule for eligible international students during regular academic sessions.', '{}'::jsonb, date '2026-08-08'),
    ('employment_focus_sectors', 'cc_ca_toronto_industry_sectors_2026_v1', '{"sectors":["Financial services","Technology","Life sciences","Film and creative industries","Green economy","Food and beverage","Education"],"basis":"City of Toronto industry sector support"}'::jsonb, 'qualitative', 'medium', 'observed', 'Qualitative Toronto industry context from City sector-support pages; not a shortage ranking.', '{"not_a_shortage_measure":true}'::jsonb, date '2026-08-08')
)
insert into evidence.metric_observations (
  metric_key, scope_type, scope_id, value, unit, source_snapshot_id,
  evidence_kind, confidence, methodology, assumptions, effective_from,
  review_status, reviewed_at, reviewer_note, created_at, updated_at
)
select
  m.metric_key, 'city', t.id::text, m.value, m.unit, ss.id,
  m.evidence_kind, m.confidence, m.methodology, m.assumptions, m.effective_from,
  'verified', now(), 'Toronto city MVP verified from official Canadian government, City of Toronto, TTC or University of Toronto primary sources.', now(), now()
from metric_data m
cross join toronto t
join evidence.sources src on src.source_key = m.source_key
join evidence.source_snapshots ss on ss.source_id = src.id
  and ss.data_as_of = m.effective_from
  and ss.snapshot_status in ('captured','unchanged')
order by m.metric_key;

with toronto as (
  select id from core.geographies
  where country_code='CA' and geography_type='city' and slug='toronto'
    and canonical_geography_id is null and status='active'
  limit 1
)
delete from public.report_metric_evidence_city p
using toronto t
where p.geography_id = t.id;

insert into public.report_metric_evidence_city (
  geography_id, scope_type, scope_id, metric_key, value, source_name, source_url,
  data_as_of, last_verified_at, confidence, evidence_kind, review_status,
  created_at, updated_at
)
select
  o.scope_id::uuid, o.scope_type, o.scope_id, o.metric_key, o.value,
  src.source_name, ss.source_url,
  coalesce(ss.data_as_of, o.effective_from, current_date),
  coalesce(o.reviewed_at, o.updated_at, now()),
  o.confidence, o.evidence_kind, o.review_status, o.created_at, o.updated_at
from evidence.metric_observations o
join evidence.source_snapshots ss on ss.id = o.source_snapshot_id
join evidence.sources src on src.id = ss.source_id
join core.geographies g on g.id::text = o.scope_id
where o.scope_type = 'city'
  and g.country_code = 'CA'
  and g.slug = 'toronto'
  and g.canonical_geography_id is null
  and o.review_status = 'verified'
  and o.metric_key in (
    'city_population',
    'student_living_cost_monthly_range',
    'student_transport_monthly_reference',
    'student_work_hours_week',
    'employment_focus_sectors'
  );
