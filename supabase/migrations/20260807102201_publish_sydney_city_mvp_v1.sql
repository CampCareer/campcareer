-- Sydney city MVP publication layer.
-- Uses canonical geography IDs from core.geographies and keeps legacy city
-- strings only as compatibility data. Program counts on the city page remain
-- explicitly representative-city mappings until campus-level verification.

create table if not exists public.report_metric_evidence_city (
  id uuid primary key default gen_random_uuid(),
  geography_id uuid not null references core.geographies(id) on delete cascade,
  scope_type text not null default 'city' check (scope_type = 'city'),
  scope_id text not null,
  metric_key text not null,
  value jsonb not null,
  source_name text not null,
  source_url text not null,
  data_as_of date not null,
  last_verified_at timestamptz not null default now(),
  confidence text not null default 'medium' check (confidence in ('high','medium','low')),
  evidence_kind text not null default 'observed' check (evidence_kind in ('observed','calculated','estimated','user_provided')),
  review_status text not null default 'review_required' check (review_status in ('review_required','verified','stale','rejected','retired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (geography_id, metric_key)
);

create index if not exists report_metric_evidence_city_scope_idx
  on public.report_metric_evidence_city (scope_type, scope_id, metric_key, review_status);

alter table public.report_metric_evidence_city enable row level security;
revoke all on public.report_metric_evidence_city from anon, authenticated;
grant select on public.report_metric_evidence_city to service_role;

create table if not exists public.city_directory_au_v1 (
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
  source_system text,
  source_record_key text,
  updated_at timestamptz not null default now()
);

alter table public.city_directory_au_v1 enable row level security;
revoke all on public.city_directory_au_v1 from anon, authenticated;
grant select on public.city_directory_au_v1 to service_role;

create table if not exists public.city_institution_directory_au_v1 (
  city_id uuid not null,
  campus_id uuid not null,
  institution_id uuid not null,
  institution_name text not null,
  institution_type text,
  website_url text,
  campus_name text not null,
  locality text,
  region text not null,
  legacy_provider_id text,
  primary key (city_id, campus_id)
);

create index if not exists city_institution_directory_au_v1_city_idx
  on public.city_institution_directory_au_v1 (city_id, institution_name);

alter table public.city_institution_directory_au_v1 enable row level security;
revoke all on public.city_institution_directory_au_v1 from anon, authenticated;
grant select on public.city_institution_directory_au_v1 to service_role;

truncate table public.city_institution_directory_au_v1;
truncate table public.city_directory_au_v1;

insert into public.city_directory_au_v1 (
  city_id, country_code, slug, name, region, scope_kind, latitude, longitude,
  linked_campus_count, linked_institution_count, source_system, source_record_key, updated_at
)
select
  g.id,
  g.country_code,
  g.slug,
  g.name,
  min(c.region) as region,
  g.scope_kind,
  g.latitude,
  g.longitude,
  count(distinct c.id)::integer,
  count(distinct c.institution_id)::integer,
  g.metadata ->> 'source_id',
  g.metadata ->> 'source_record_key',
  now()
from core.geographies g
join catalog.campuses c on c.geography_id = g.id
where g.country_code = 'AU'
  and g.geography_type = 'city'
  and g.canonical_geography_id is null
  and g.status = 'active'
  and g.slug is not null
group by g.id, g.country_code, g.slug, g.name, g.scope_kind, g.latitude, g.longitude,
         g.metadata ->> 'source_id', g.metadata ->> 'source_record_key';

insert into public.city_institution_directory_au_v1 (
  city_id, campus_id, institution_id, institution_name, institution_type,
  website_url, campus_name, locality, region, legacy_provider_id
)
select
  c.geography_id,
  c.id,
  i.id,
  i.canonical_name,
  i.institution_type,
  i.website_url,
  c.name,
  c.locality,
  c.region,
  provider.identifier_value
from catalog.campuses c
join catalog.institutions i on i.id = c.institution_id
left join lateral (
  select ii.identifier_value
  from catalog.institution_identifiers ii
  where ii.institution_id = i.id
    and ii.identifier_system = 'AU_PROVIDER_ID'
  order by ii.valid_to nulls first, ii.created_at desc
  limit 1
) provider on true
join core.geographies g on g.id = c.geography_id
where c.country_code = 'AU'
  and c.status = 'active'
  and g.geography_type = 'city'
  and g.canonical_geography_id is null
  and g.status = 'active';

insert into evidence.sources (
  source_key, organisation_name, source_name, source_type, canonical_url, country_code, active, updated_at
)
values
  ('cc_au_abs_sydney_population_2025_v1', 'Australian Bureau of Statistics', 'Regional population 2024-25 — Greater Sydney', 'government_dataset', 'https://www.abs.gov.au/statistics/people/population/regional-population/latest-release', 'AU', true, now()),
  ('cc_au_unsw_sydney_living_cost_2026_v1', 'UNSW Sydney', 'Cost of living in Sydney as an international student', 'provider', 'https://www.unsw.edu.au/study/your-future/cost-of-living-sydney', 'AU', true, now()),
  ('cc_au_transport_nsw_fares_2026_v1', 'Transport for NSW', 'Opal fares and weekly travel caps', 'regulator', 'https://transportnsw.info/tickets-fares/fares', 'AU', true, now()),
  ('cc_au_study_nsw_work_rights_2026_v1', 'Study NSW', 'Work rights for international students in NSW', 'government_dataset', 'https://www.study.nsw.gov.au/current-students/working-in-nsw/work-rights', 'AU', true, now()),
  ('cc_au_study_nsw_sydney_destination_2026_v1', 'Study NSW', 'Studying in Greater Sydney', 'government_dataset', 'https://www.study.nsw.gov.au/why-nsw/destinations/sydney', 'AU', true, now())
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
    ('cc_au_abs_sydney_population_2025_v1', 'https://www.abs.gov.au/statistics/people/population/regional-population/latest-release', date '2025-06-30', '{"geography":"Greater Sydney GCCSA","population":5638830,"annual_change":75230,"annual_change_pct":1.4}'::jsonb),
    ('cc_au_unsw_sydney_living_cost_2026_v1', 'https://www.unsw.edu.au/study/your-future/cost-of-living-sydney', date '2026-08-07', '{"monthly_low":2645,"monthly_high":4166,"currency":"AUD","population":"international student living and studying in Sydney","indicative":true}'::jsonb),
    ('cc_au_transport_nsw_fares_2026_v1', 'https://transportnsw.info/tickets-fares/fares', date '2026-08-07', '{"adult_weekly_cap":50,"concession_weekly_cap":25,"currency":"AUD","modes":["metro","train","bus","ferry","light rail"]}'::jsonb),
    ('cc_au_study_nsw_work_rights_2026_v1', 'https://www.study.nsw.gov.au/current-students/working-in-nsw/work-rights', date '2026-08-07', '{"hours_per_fortnight":48,"during_term":true,"unrestricted_when_course_not_in_session":true}'::jsonb),
    ('cc_au_study_nsw_sydney_destination_2026_v1', 'https://www.study.nsw.gov.au/why-nsw/destinations/sydney', date '2026-08-07', '{"sectors":["Finance and banking","Technology and innovation","Business and professional services","Tourism and hospitality"],"jobs_connect":true}'::jsonb)
)
insert into evidence.source_snapshots (
  source_id, source_url, content_sha256, data_as_of, retrieved_at, valid_from, snapshot_status, metadata
)
select
  s.id,
  d.source_url,
  encode(digest(d.source_key || '|' || d.data_as_of::text || '|' || d.metadata::text, 'sha256'), 'hex'),
  d.data_as_of,
  now(),
  d.data_as_of,
  'captured',
  d.metadata || jsonb_build_object('captured_for', 'sydney_city_mvp_v1', 'country_code', 'AU')
from snapshot_data d
join evidence.sources s on s.source_key = d.source_key
on conflict (source_id, content_sha256) where content_sha256 is not null do update set
  source_url = excluded.source_url,
  data_as_of = excluded.data_as_of,
  retrieved_at = excluded.retrieved_at,
  valid_from = excluded.valid_from,
  snapshot_status = 'captured',
  metadata = excluded.metadata;

with sydney as (
  select id from core.geographies
  where country_code = 'AU' and geography_type = 'city' and slug = 'sydney'
    and canonical_geography_id is null and status = 'active'
  limit 1
)
delete from evidence.metric_observations o
using sydney s
where o.scope_type = 'city'
  and o.scope_id = s.id::text
  and o.metric_key in (
    'city_population',
    'student_living_cost_monthly_range',
    'public_transport_weekly_cap',
    'student_work_hours_fortnight',
    'employment_focus_sectors'
  );

with sydney as (
  select id from core.geographies
  where country_code = 'AU' and geography_type = 'city' and slug = 'sydney'
    and canonical_geography_id is null and status = 'active'
  limit 1
), metric_data(metric_key, source_key, value, unit, confidence, evidence_kind, methodology, assumptions, effective_from) as (
  values
    ('city_population', 'cc_au_abs_sydney_population_2025_v1', '{"amount":5638830,"geography":"Greater Sydney GCCSA","annual_change":75230,"annual_change_pct":1.4}'::jsonb, 'people', 'high', 'observed', 'ABS estimated resident population for the Greater Sydney GCCSA at 30 June 2025.', '{}'::jsonb, date '2025-06-30'),
    ('student_living_cost_monthly_range', 'cc_au_unsw_sydney_living_cost_2026_v1', '{"low":2645,"high":4166,"currency":"AUD","period":"month","scenario":"international student living and studying in Sydney","indicative":true}'::jsonb, 'AUD/month', 'medium', 'observed', 'UNSW indicative monthly Sydney living-cost range; actual costs vary by accommodation and lifestyle.', '{"tuition_excluded":true}'::jsonb, date '2026-08-07'),
    ('public_transport_weekly_cap', 'cc_au_transport_nsw_fares_2026_v1', '{"adult":50,"concession":25,"currency":"AUD","period":"week","modes":["metro","train","bus","ferry","light rail"],"concession_requires_eligibility":true}'::jsonb, 'AUD/week', 'high', 'observed', 'Transport for NSW Opal weekly travel caps. Airport station access fees are separate.', '{"airport_station_access_fee_excluded":true}'::jsonb, date '2026-08-07'),
    ('student_work_hours_fortnight', 'cc_au_study_nsw_work_rights_2026_v1', '{"hours":48,"period":"fortnight_during_study","unrestricted_when_course_not_in_session":true}'::jsonb, 'hours/fortnight', 'high', 'observed', 'Study NSW summary of the Australian student visa work-hours condition.', '{}'::jsonb, date '2026-08-07'),
    ('employment_focus_sectors', 'cc_au_study_nsw_sydney_destination_2026_v1', '{"sectors":["Finance and banking","Technology and innovation","Business and professional services","Tourism and hospitality"],"basis":"Study NSW destination guidance","jobs_connect_available":true}'::jsonb, 'qualitative', 'medium', 'observed', 'Qualitative employment themes highlighted by Study NSW for Sydney; not a shortage ranking.', '{"not_a_shortage_measure":true}'::jsonb, date '2026-08-07')
)
insert into evidence.metric_observations (
  metric_key, scope_type, scope_id, value, unit, source_snapshot_id,
  evidence_kind, confidence, methodology, assumptions, effective_from,
  review_status, reviewed_at, reviewer_note, created_at, updated_at
)
select
  m.metric_key, 'city', s.id::text, m.value, m.unit, ss.id,
  m.evidence_kind, m.confidence, m.methodology, m.assumptions, m.effective_from,
  'verified', now(), 'Sydney city MVP verified from official government or university primary sources.', now(), now()
from metric_data m
cross join sydney s
join evidence.sources src on src.source_key = m.source_key
join evidence.source_snapshots ss on ss.source_id = src.id
  and ss.data_as_of = m.effective_from
  and ss.snapshot_status in ('captured','unchanged')
order by m.metric_key;

with sydney as (
  select id from core.geographies
  where country_code = 'AU' and geography_type = 'city' and slug = 'sydney'
    and canonical_geography_id is null and status = 'active'
  limit 1
)
delete from public.report_metric_evidence_city p
using sydney s
where p.geography_id = s.id;

insert into public.report_metric_evidence_city (
  geography_id, scope_type, scope_id, metric_key, value, source_name, source_url,
  data_as_of, last_verified_at, confidence, evidence_kind, review_status, created_at, updated_at
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
  and g.country_code = 'AU'
  and g.slug = 'sydney'
  and g.canonical_geography_id is null
  and o.review_status = 'verified'
  and o.metric_key in (
    'city_population',
    'student_living_cost_monthly_range',
    'public_transport_weekly_cap',
    'student_work_hours_fortnight',
    'employment_focus_sectors'
  );
