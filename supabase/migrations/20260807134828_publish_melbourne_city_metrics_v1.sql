-- Publish Melbourne city metrics on the same evidence contract used by Sydney.
-- Calculated values remain explicitly marked as calculated rather than observed.

insert into evidence.sources (
  source_key, organisation_name, source_name, source_type, canonical_url, country_code, active, updated_at
)
values
  ('cc_au_abs_melbourne_population_2025_v1', 'Australian Bureau of Statistics', 'Regional population 2024-25 — Greater Melbourne', 'government_dataset', 'https://www.abs.gov.au/statistics/people/population/regional-population/latest-release', 'AU', true, now()),
  ('cc_au_monash_melbourne_living_cost_2026_v1', 'Monash University', 'Cost of living — Melbourne international students', 'provider', 'https://www.monash.edu/study/why-choose-monash/our-locations/life-in-melbourne/cost-of-living', 'AU', true, now()),
  ('cc_au_transport_vic_international_student_pass_2026_v1', 'Transport Victoria', 'International Student Travel Pass', 'regulator', 'https://transport.vic.gov.au/news-and-resources/campaigns/international-students', 'AU', true, now()),
  ('cc_au_study_melbourne_work_rights_2026_v1', 'Study Melbourne', 'Work while you study', 'government_dataset', 'https://studymelbourne.vic.gov.au/working/work-while-you-study', 'AU', true, now()),
  ('cc_au_study_melbourne_career_2026_v1', 'Study Melbourne', 'A great place to start your career', 'government_dataset', 'https://studymelbourne.vic.gov.au/why-melbourne/a-great-place-to-start-your-career', 'AU', true, now())
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
    ('cc_au_abs_melbourne_population_2025_v1', 'https://www.abs.gov.au/statistics/people/population/regional-population/latest-release', date '2025-06-30', '{"geography":"Greater Melbourne GCCSA","population":5435590,"annual_change":105030,"annual_change_pct":2.0}'::jsonb),
    ('cc_au_monash_melbourne_living_cost_2026_v1', 'https://www.monash.edu/study/why-choose-monash/our-locations/life-in-melbourne/cost-of-living', date '2026-08-07', '{"annual_low":30000,"annual_high":45000,"monthly_low":2500,"monthly_high":3750,"currency":"AUD","calculation":"annual range divided by 12"}'::jsonb),
    ('cc_au_transport_vic_international_student_pass_2026_v1', 'https://transport.vic.gov.au/news-and-resources/campaigns/international-students', date '2026-08-07', '{"statewide_90_day":154,"statewide_180_day":308,"statewide_365_day":556,"currency":"AUD","discount_pct":50,"eligibility_required":true}'::jsonb),
    ('cc_au_study_melbourne_work_rights_2026_v1', 'https://studymelbourne.vic.gov.au/working/work-while-you-study', date '2026-06-03', '{"hours_per_fortnight":48,"during_term":true,"unrestricted_when_course_not_in_session":true}'::jsonb),
    ('cc_au_study_melbourne_career_2026_v1', 'https://studymelbourne.vic.gov.au/why-melbourne/a-great-place-to-start-your-career', date '2026-07-21', '{"sectors":["ICT","Healthcare","Professional services","Education","Advanced manufacturing"],"future_industries":["Robotics","Artificial intelligence","Cybersecurity","Clean energy","Agritech"]}'::jsonb)
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
  d.metadata || jsonb_build_object('captured_for','melbourne_city_compare_v1','country_code','AU')
from snapshot_data d
join evidence.sources s on s.source_key=d.source_key
on conflict (source_id, content_sha256) where content_sha256 is not null do update set
  source_url=excluded.source_url,
  data_as_of=excluded.data_as_of,
  retrieved_at=excluded.retrieved_at,
  valid_from=excluded.valid_from,
  snapshot_status='captured',
  metadata=excluded.metadata;

with cities as (
  select id,slug from core.geographies
  where country_code='AU' and geography_type='city' and slug in ('sydney','melbourne')
    and canonical_geography_id is null and status='active'
)
delete from evidence.metric_observations o
using cities c
where o.scope_type='city' and o.scope_id=c.id::text
  and (
    (c.slug='melbourne' and o.metric_key in ('city_population','student_living_cost_monthly_range','public_transport_student_pass','student_transport_weekly_reference','student_work_hours_fortnight','employment_focus_sectors'))
    or (c.slug='sydney' and o.metric_key='student_transport_weekly_reference')
  );

with melbourne as (
  select id from core.geographies
  where country_code='AU' and geography_type='city' and slug='melbourne'
    and canonical_geography_id is null and status='active' limit 1
), metric_data(metric_key,source_key,value,unit,confidence,evidence_kind,methodology,assumptions,effective_from) as (
  values
    ('city_population','cc_au_abs_melbourne_population_2025_v1','{"amount":5435590,"geography":"Greater Melbourne GCCSA","annual_change":105030,"annual_change_pct":2.0}'::jsonb,'people','high','observed','ABS estimated resident population for Greater Melbourne GCCSA at 30 June 2025.','{}'::jsonb,date '2025-06-30'),
    ('student_living_cost_monthly_range','cc_au_monash_melbourne_living_cost_2026_v1','{"low":2500,"high":3750,"currency":"AUD","period":"month","annual_low":30000,"annual_high":45000,"scenario":"single international student living in Melbourne","indicative":true}'::jsonb,'AUD/month','medium','calculated','Monash indicative annual Melbourne living-cost range divided by 12 to create a monthly comparison range.','{"tuition_excluded":true,"annual_range_divided_by":12}'::jsonb,date '2026-08-07'),
    ('public_transport_student_pass','cc_au_transport_vic_international_student_pass_2026_v1','{"statewide_90_day":154,"statewide_180_day":308,"statewide_365_day":556,"currency":"AUD","discount_pct":50,"coverage":"unlimited bus train tram across Victoria","eligibility_required":true}'::jsonb,'AUD/pass','high','observed','Transport Victoria International Student Travel Pass prices for eligible international students.','{"eligibility_required":true}'::jsonb,date '2026-08-07'),
    ('student_transport_weekly_reference','cc_au_transport_vic_international_student_pass_2026_v1','{"amount":10.69,"currency":"AUD","period":"week","annual_pass":556,"basis":"365-day International Student Travel Pass","transport_kind":"student_pass_weekly_equivalent","eligibility_required":true}'::jsonb,'AUD/week','high','calculated','A comparison-only weekly equivalent calculated as the 365-day International Student Travel Pass price divided by 52 weeks.','{"calculation":"556/52","eligibility_required":true,"not_a_weekly_fare_cap":true}'::jsonb,date '2026-08-07'),
    ('student_work_hours_fortnight','cc_au_study_melbourne_work_rights_2026_v1','{"hours":48,"period":"fortnight_during_study","unrestricted_when_course_not_in_session":true}'::jsonb,'hours/fortnight','high','observed','Study Melbourne summary of the Australian student visa work-hours condition.','{}'::jsonb,date '2026-06-03'),
    ('employment_focus_sectors','cc_au_study_melbourne_career_2026_v1','{"sectors":["ICT","Healthcare","Professional services","Education","Advanced manufacturing"],"future_industries":["Robotics","Artificial intelligence","Cybersecurity","Clean energy","Agritech"],"basis":"Study Melbourne city career guidance"}'::jsonb,'qualitative','medium','observed','Qualitative career themes highlighted by Study Melbourne; not a shortage ranking.','{"not_a_shortage_measure":true}'::jsonb,date '2026-07-21')
)
insert into evidence.metric_observations (
  metric_key,scope_type,scope_id,value,unit,source_snapshot_id,evidence_kind,confidence,methodology,assumptions,effective_from,review_status,reviewed_at,reviewer_note,created_at,updated_at
)
select
  m.metric_key,'city',city.id::text,m.value,m.unit,ss.id,m.evidence_kind,m.confidence,m.methodology,m.assumptions,m.effective_from,'verified',now(),'Melbourne city comparison metric verified from primary government or university sources.',now(),now()
from metric_data m
cross join melbourne city
join evidence.sources src on src.source_key=m.source_key
join evidence.source_snapshots ss on ss.source_id=src.id and ss.data_as_of=m.effective_from and ss.snapshot_status in ('captured','unchanged');

with sydney as (
  select id from core.geographies
  where country_code='AU' and geography_type='city' and slug='sydney'
    and canonical_geography_id is null and status='active' limit 1
), source_snapshot as (
  select ss.id
  from evidence.source_snapshots ss
  join evidence.sources s on s.id=ss.source_id
  where s.source_key='cc_au_transport_nsw_fares_2026_v1' and ss.data_as_of=date '2026-08-07'
  order by ss.retrieved_at desc limit 1
)
insert into evidence.metric_observations (
  metric_key,scope_type,scope_id,value,unit,source_snapshot_id,evidence_kind,confidence,methodology,assumptions,effective_from,review_status,reviewed_at,reviewer_note,created_at,updated_at
)
select
  'student_transport_weekly_reference','city',sydney.id::text,
  '{"amount":50,"currency":"AUD","period":"week","basis":"adult Opal weekly travel cap","transport_kind":"full_fare_weekly_cap","eligibility_required":false,"eligible_concession_amount":25}'::jsonb,
  'AUD/week',source_snapshot.id,'observed','high','Transport for NSW adult Opal weekly cap used as a comparison reference; eligible concession cap is stored separately.','{"airport_station_access_fee_excluded":true}'::jsonb,date '2026-08-07','verified',now(),'Sydney comparison transport reference derived directly from the published weekly cap.',now(),now()
from sydney cross join source_snapshot;

with target_cities as (
  select id from core.geographies
  where country_code='AU' and geography_type='city' and slug in ('sydney','melbourne')
    and canonical_geography_id is null and status='active'
)
delete from public.report_metric_evidence_city p
using target_cities c
where p.geography_id=c.id
  and p.metric_key in ('city_population','student_living_cost_monthly_range','public_transport_student_pass','public_transport_weekly_cap','student_transport_weekly_reference','student_work_hours_fortnight','employment_focus_sectors');

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
where o.scope_type='city' and g.country_code='AU' and g.slug in ('sydney','melbourne')
  and g.canonical_geography_id is null and o.review_status='verified'
  and o.metric_key in ('city_population','student_living_cost_monthly_range','public_transport_student_pass','public_transport_weekly_cap','student_transport_weekly_reference','student_work_hours_fortnight','employment_focus_sectors');
