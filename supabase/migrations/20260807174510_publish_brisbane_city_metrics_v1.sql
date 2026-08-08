-- Publish Brisbane city metrics using the same evidence contract as Sydney and Melbourne.
-- Flat public-transport fare is stored per journey; it is not converted into an arbitrary weekly estimate.

insert into evidence.sources (
  source_key, organisation_name, source_name, source_type, canonical_url, country_code, active, updated_at
)
values
  ('cc_au_abs_brisbane_population_2025_v1', 'Australian Bureau of Statistics', 'Regional population 2024-25 — Greater Brisbane', 'government_dataset', 'https://www.abs.gov.au/statistics/people/population/regional-population/latest-release', 'AU', true, now()),
  ('cc_au_uq_brisbane_living_cost_2026_v1', 'The University of Queensland', 'Cost of living as a student in Brisbane', 'provider', 'https://study.uq.edu.au/university-life/living-in-queensland/cost-living', 'AU', true, now()),
  ('cc_au_translink_50_cent_fares_2026_v1', 'Translink', 'Tertiary student travel — 50 cent fares', 'regulator', 'https://translink.com.au/tickets-and-fares/concessions/tertiary', 'AU', true, now()),
  ('cc_au_study_australia_work_rights_2026_v1', 'Study Australia', 'Work in Australia', 'government_dataset', 'https://www.studyaustralia.gov.au/en/work-in-australia', 'AU', true, now()),
  ('cc_au_beda_brisbane_key_industries_2026_v1', 'Brisbane Economic Development Agency', 'Brisbane key industries', 'government_dataset', 'https://choose.brisbane.qld.au/business/key-industries', 'AU', true, now())
on conflict (source_key) do update set
  organisation_name=excluded.organisation_name,
  source_name=excluded.source_name,
  source_type=excluded.source_type,
  canonical_url=excluded.canonical_url,
  country_code=excluded.country_code,
  active=true,
  updated_at=now();

with snapshot_data(source_key, source_url, data_as_of, metadata) as (
  values
    ('cc_au_abs_brisbane_population_2025_v1', 'https://www.abs.gov.au/statistics/people/population/regional-population/latest-release', date '2025-06-30', '{"geography":"Greater Brisbane GCCSA","population":2833524,"annual_change":58223,"annual_change_pct":2.1}'::jsonb),
    ('cc_au_uq_brisbane_living_cost_2026_v1', 'https://study.uq.edu.au/university-life/living-in-queensland/cost-living', date '2026-08-07', '{"monthly_low":1326,"monthly_high":3739,"currency":"AUD","scenario":"single student living off-campus or in student accommodation in Brisbane","tuition_excluded":true,"indicative":true}'::jsonb),
    ('cc_au_translink_50_cent_fares_2026_v1', 'https://translink.com.au/tickets-and-fares/concessions/tertiary', date '2026-08-07', '{"fare_per_journey":0.50,"currency":"AUD","coverage":"Translink services","tertiary_concession_application_required":false,"airtrain_exception":true}'::jsonb),
    ('cc_au_study_australia_work_rights_2026_v1', 'https://www.studyaustralia.gov.au/en/work-in-australia', date '2026-08-07', '{"hours_per_fortnight":48,"during_study":true,"unlimited_during_scheduled_breaks":true}'::jsonb),
    ('cc_au_beda_brisbane_key_industries_2026_v1', 'https://choose.brisbane.qld.au/business/key-industries', date '2026-08-07', '{"sectors":["Health","Tourism","Property and construction","Logistics","Advanced manufacturing","Business services"]}'::jsonb)
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
  d.metadata || jsonb_build_object('captured_for','brisbane_city_v1','country_code','AU')
from snapshot_data d
join evidence.sources s on s.source_key=d.source_key
on conflict (source_id, content_sha256) where content_sha256 is not null do update set
  source_url=excluded.source_url,
  data_as_of=excluded.data_as_of,
  retrieved_at=excluded.retrieved_at,
  valid_from=excluded.valid_from,
  snapshot_status='captured',
  metadata=excluded.metadata;

with brisbane as (
  select id from core.geographies
  where country_code='AU' and geography_type='city' and slug='brisbane'
    and canonical_geography_id is null and status='active' limit 1
)
delete from evidence.metric_observations o
using brisbane b
where o.scope_type='city' and o.scope_id=b.id::text
  and o.metric_key in ('city_population','student_living_cost_monthly_range','public_transport_flat_fare','student_work_hours_fortnight','employment_focus_sectors');

with brisbane as (
  select id from core.geographies
  where country_code='AU' and geography_type='city' and slug='brisbane'
    and canonical_geography_id is null and status='active' limit 1
), metric_data(metric_key,source_key,value,unit,confidence,evidence_kind,methodology,assumptions,effective_from) as (
  values
    ('city_population','cc_au_abs_brisbane_population_2025_v1','{"amount":2833524,"geography":"Greater Brisbane GCCSA","annual_change":58223,"annual_change_pct":2.1}'::jsonb,'people','high','observed','ABS estimated resident population for Greater Brisbane GCCSA at 30 June 2025.','{}'::jsonb,date '2025-06-30'),
    ('student_living_cost_monthly_range','cc_au_uq_brisbane_living_cost_2026_v1','{"low":1326,"high":3739,"currency":"AUD","period":"month","scenario":"single student living off-campus or in student accommodation in Brisbane","indicative":true}'::jsonb,'AUD/month','medium','observed','UQ published monthly total for a student living off-campus or in student accommodation in Brisbane.','{"tuition_excluded":true,"personal_budget_varies":true}'::jsonb,date '2026-08-07'),
    ('public_transport_flat_fare','cc_au_translink_50_cent_fares_2026_v1','{"amount":0.50,"currency":"AUD","period":"trip","transport_kind":"flat_fare_per_journey","eligibility_required":false,"coverage":"Translink network","airtrain_exception":true}'::jsonb,'AUD/trip','high','observed','Translink tertiary travel guidance states fares are 50 cents per journey regardless of distance or payment method.','{"airtrain_exception":true,"not_a_weekly_cap":true}'::jsonb,date '2026-08-07'),
    ('student_work_hours_fortnight','cc_au_study_australia_work_rights_2026_v1','{"hours":48,"period":"fortnight_during_study","unrestricted_when_course_not_in_session":true}'::jsonb,'hours/fortnight','high','observed','Australian Government Study Australia summary of Student visa work hours.','{"individual_visa_conditions_should_be_checked":true}'::jsonb,date '2026-08-07'),
    ('employment_focus_sectors','cc_au_beda_brisbane_key_industries_2026_v1','{"sectors":["Health","Tourism","Property and construction","Logistics","Advanced manufacturing","Business services"],"basis":"Brisbane Economic Development Agency key industries"}'::jsonb,'qualitative','medium','observed','Qualitative Brisbane key-industry context from the city economic development agency; not a shortage ranking.','{"not_a_shortage_measure":true}'::jsonb,date '2026-08-07')
)
insert into evidence.metric_observations (
  metric_key,scope_type,scope_id,value,unit,source_snapshot_id,evidence_kind,confidence,methodology,assumptions,effective_from,review_status,reviewed_at,reviewer_note,created_at,updated_at
)
select
  m.metric_key,'city',city.id::text,m.value,m.unit,ss.id,m.evidence_kind,m.confidence,m.methodology,m.assumptions,m.effective_from,'verified',now(),'Brisbane city metric verified from primary government, university or official city economic-development sources.',now(),now()
from metric_data m
cross join brisbane city
join evidence.sources src on src.source_key=m.source_key
join evidence.source_snapshots ss on ss.source_id=src.id and ss.data_as_of=m.effective_from and ss.snapshot_status in ('captured','unchanged');

with brisbane as (
  select id from core.geographies
  where country_code='AU' and geography_type='city' and slug='brisbane'
    and canonical_geography_id is null and status='active' limit 1
)
delete from public.report_metric_evidence_city p
using brisbane b
where p.geography_id=b.id
  and p.metric_key in ('city_population','student_living_cost_monthly_range','public_transport_flat_fare','student_work_hours_fortnight','employment_focus_sectors');

insert into public.report_metric_evidence_city (
  geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at
)
select
  o.scope_id::uuid,o.scope_type,o.scope_id,o.metric_key,o.value,src.source_name,ss.source_url,
  coalesce(ss.data_as_of,o.effective_from,current_date),coalesce(o.reviewed_at,o.updated_at,now()),
  o.confidence,o.evidence_kind,o.review_status,o.created_at,o.updated_at
from evidence.metric_observations o
join evidence.source_snapshots ss on ss.id=o.source_snapshot_id
join evidence.sources src on src.id=ss.source_id
join core.geographies g on g.id::text=o.scope_id
where o.scope_type='city' and g.country_code='AU' and g.slug='brisbane'
  and g.canonical_geography_id is null and o.review_status='verified'
  and o.metric_key in ('city_population','student_living_cost_monthly_range','public_transport_flat_fare','student_work_hours_fortnight','employment_focus_sectors');
