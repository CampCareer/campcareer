-- Publish Perth city metrics using the same evidence contract as other Australian city profiles.
-- Living cost is a calculated monthly equivalent of Murdoch University's approximate A$500/week guide.

insert into evidence.sources (
  source_key, organisation_name, source_name, source_type, canonical_url, country_code, active, updated_at
)
values
  ('cc_au_abs_perth_population_2025_v1', 'Australian Bureau of Statistics', 'Regional population 2024-25 — Greater Perth', 'government_dataset', 'https://www.abs.gov.au/statistics/people/population/regional-population/latest-release', 'AU', true, now()),
  ('cc_au_murdoch_perth_living_cost_2026_v1', 'Murdoch University', 'Living costs — Perth', 'provider', 'https://www.murdoch.edu.au/study/international-students/life-in-perth/living-costs', 'AU', true, now()),
  ('cc_au_transperth_tertiary_fares_2026_v1', 'Transperth', 'Tertiary SmartRider and concession fares', 'regulator', 'https://www.transperth.wa.gov.au/tickets-fares/fares', 'AU', true, now()),
  ('cc_au_study_australia_work_rights_2026_v1', 'Study Australia', 'Work in Australia', 'government_dataset', 'https://www.studyaustralia.gov.au/en/work-in-australia', 'AU', true, now()),
  ('cc_au_city_perth_key_sectors_2026_v1', 'City of Perth', 'Key sectors and industries', 'government_dataset', 'https://perth.wa.gov.au/businesses/investing-in-perth/key-sectors-and-industries', 'AU', true, now())
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
    ('cc_au_abs_perth_population_2025_v1', 'https://www.abs.gov.au/statistics/people/population/regional-population/latest-release', date '2025-06-30', '{"geography":"Greater Perth GCCSA","population":2452765,"annual_change":58088,"annual_change_pct":2.4}'::jsonb),
    ('cc_au_murdoch_perth_living_cost_2026_v1', 'https://www.murdoch.edu.au/study/international-students/life-in-perth/living-costs', date '2026-08-07', '{"weekly_reference":500,"monthly_equivalent":2166.67,"currency":"AUD","tuition_excluded":true,"calculation":"500*52/12","approximate":true}'::jsonb),
    ('cc_au_transperth_tertiary_fares_2026_v1', 'https://www.transperth.wa.gov.au/tickets-fares/fares', date '2026-08-07', '{"concession_go_anywhere_cash":1.60,"concession_go_anywhere_smartrider_10pct":1.44,"concession_go_anywhere_smartrider_20pct":1.28,"currency":"AUD","tertiary_smartrider_required":true,"fare_effective":"2026-01-01"}'::jsonb),
    ('cc_au_study_australia_work_rights_2026_v1', 'https://www.studyaustralia.gov.au/en/work-in-australia', date '2026-08-07', '{"hours_per_fortnight":48,"during_study":true,"unlimited_during_scheduled_breaks":true}'::jsonb),
    ('cc_au_city_perth_key_sectors_2026_v1', 'https://perth.wa.gov.au/businesses/investing-in-perth/key-sectors-and-industries', date '2026-08-07', '{"sectors":["Mining, resources and energy","Property and construction","Innovation and technology","Education and international student services","Health and life sciences","Tourism, retail and hospitality"],"scope":"City of Perth economic-development context"}'::jsonb)
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
  d.metadata || jsonb_build_object('captured_for','perth_city_v1','country_code','AU')
from snapshot_data d
join evidence.sources s on s.source_key=d.source_key
on conflict (source_id, content_sha256) where content_sha256 is not null do update set
  source_url=excluded.source_url,
  data_as_of=excluded.data_as_of,
  retrieved_at=excluded.retrieved_at,
  valid_from=excluded.valid_from,
  snapshot_status='captured',
  metadata=excluded.metadata;

with perth as (
  select id from core.geographies
  where country_code='AU' and geography_type='city' and slug='perth'
    and canonical_geography_id is null and status='active' limit 1
)
delete from evidence.metric_observations o
using perth p
where o.scope_type='city' and o.scope_id=p.id::text
  and o.metric_key in ('city_population','student_living_cost_monthly_range','public_transport_flat_fare','student_work_hours_fortnight','employment_focus_sectors');

with perth as (
  select id from core.geographies
  where country_code='AU' and geography_type='city' and slug='perth'
    and canonical_geography_id is null and status='active' limit 1
), metric_data(metric_key,source_key,value,unit,confidence,evidence_kind,methodology,assumptions,effective_from) as (
  values
    ('city_population','cc_au_abs_perth_population_2025_v1','{"amount":2452765,"geography":"Greater Perth GCCSA","annual_change":58088,"annual_change_pct":2.4}'::jsonb,'people','high','observed','ABS estimated resident population for Greater Perth GCCSA at 30 June 2025.','{}'::jsonb,date '2025-06-30'),
    ('student_living_cost_monthly_range','cc_au_murdoch_perth_living_cost_2026_v1','{"low":2166.67,"high":2166.67,"currency":"AUD","period":"month","weekly_reference":500,"scenario":"approximate Perth student living-expense budget","indicative":true}'::jsonb,'AUD/month','medium','calculated','Murdoch University advises approximately A$500 per week for Perth living expenses; monthly equivalent is calculated as 500 × 52 ÷ 12.','{"tuition_excluded":true,"vehicle_costs_excluded":true,"textbooks_excluded":true,"holiday_travel_excluded":true,"calculation":"500*52/12","personal_budget_varies":true}'::jsonb,date '2026-08-07'),
    ('public_transport_flat_fare','cc_au_transperth_tertiary_fares_2026_v1','{"amount":1.60,"currency":"AUD","period":"trip","transport_kind":"tertiary_concession_go_anywhere_fare","eligibility_required":true,"proof":"Tertiary SmartRider","smartrider_10pct":1.44,"smartrider_20pct":1.28}'::jsonb,'AUD/trip','high','observed','Transperth 2026 concession Go Anywhere fare; eligible full-time university or TAFE students must carry a Tertiary SmartRider for the concession.','{"headline_uses_cash_concession_fare":true,"smartrider_discounts_stored_separately":true,"not_a_weekly_cap":true}'::jsonb,date '2026-08-07'),
    ('student_work_hours_fortnight','cc_au_study_australia_work_rights_2026_v1','{"hours":48,"period":"fortnight_during_study","unrestricted_when_course_not_in_session":true}'::jsonb,'hours/fortnight','high','observed','Australian Government Study Australia summary of Student visa work hours.','{"individual_visa_conditions_should_be_checked":true}'::jsonb,date '2026-08-07'),
    ('employment_focus_sectors','cc_au_city_perth_key_sectors_2026_v1','{"sectors":["Mining, resources and energy","Property and construction","Innovation and technology","Education and international student services","Health and life sciences","Tourism, retail and hospitality"],"basis":"City of Perth key sectors and industries"}'::jsonb,'qualitative','medium','observed','Qualitative City of Perth economic-development sectors; used as local career context rather than a shortage or employment-probability ranking.','{"not_a_shortage_measure":true,"city_lga_context_not_full_greater_perth":true}'::jsonb,date '2026-08-07')
)
insert into evidence.metric_observations (
  metric_key,scope_type,scope_id,value,unit,source_snapshot_id,evidence_kind,confidence,methodology,assumptions,effective_from,review_status,reviewed_at,reviewer_note,created_at,updated_at
)
select
  m.metric_key,'city',city.id::text,m.value,m.unit,ss.id,m.evidence_kind,m.confidence,m.methodology,m.assumptions,m.effective_from,'verified',now(),'Perth city metric verified from primary government, university, public transport or official city economic-development sources.',now(),now()
from metric_data m
cross join perth city
join evidence.sources src on src.source_key=m.source_key
join evidence.source_snapshots ss on ss.source_id=src.id and ss.data_as_of=m.effective_from and ss.snapshot_status in ('captured','unchanged');

with perth as (
  select id from core.geographies
  where country_code='AU' and geography_type='city' and slug='perth'
    and canonical_geography_id is null and status='active' limit 1
)
delete from public.report_metric_evidence_city p
using perth city
where p.geography_id=city.id
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
where o.scope_type='city' and g.country_code='AU' and g.slug='perth'
  and g.canonical_geography_id is null and o.review_status='verified'
  and o.metric_key in ('city_population','student_living_cost_monthly_range','public_transport_flat_fare','student_work_hours_fortnight','employment_focus_sectors');