-- Publish Adelaide city metrics using the same evidence contract as other Australian city profiles.
-- Living cost is converted from StudyAdelaide's A$350-A$700 weekly international-student range.
-- Tertiary students use Adelaide Metro concession fares; the cheaper 'Student' fare is for school students.

insert into evidence.sources (
  source_key, organisation_name, source_name, source_type, canonical_url, country_code, active, updated_at
)
values
  ('cc_au_abs_adelaide_population_2025_v1', 'Australian Bureau of Statistics', 'Regional population 2024-25 — Greater Adelaide', 'government_dataset', 'https://www.abs.gov.au/statistics/people/population/regional-population/2024-25', 'AU', true, now()),
  ('cc_au_studyadelaide_living_cost_2026_v1', 'StudyAdelaide', 'Cost of living in Adelaide', 'government_dataset', 'https://studyadelaide.com/life/cost-of-living', 'AU', true, now()),
  ('cc_au_adelaide_metro_tertiary_fares_2026_v1', 'Adelaide Metro', 'Adelaide Metro concession fares for tertiary students', 'regulator', 'https://www.adelaidemetro.com.au/tickets-and-fares/adelaide-metro-fares', 'AU', true, now()),
  ('cc_au_study_australia_work_rights_2026_v1', 'Study Australia', 'Work in Australia', 'government_dataset', 'https://www.studyaustralia.gov.au/en/work-in-australia', 'AU', true, now()),
  ('cc_au_sa_key_industries_2026_v1', 'Government of South Australia', 'Key industries in South Australia', 'government_dataset', 'https://migration.sa.gov.au/before-applying/work-in-sa/key-industries', 'AU', true, now())
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
    ('cc_au_abs_adelaide_population_2025_v1', 'https://www.abs.gov.au/statistics/people/population/regional-population/2024-25', date '2025-06-30', '{"geography":"Greater Adelaide GCCSA","population":1491015,"annual_change":18647,"annual_change_pct":1.3}'::jsonb),
    ('cc_au_studyadelaide_living_cost_2026_v1', 'https://studyadelaide.com/life/cost-of-living', date '2026-08-07', '{"weekly_low":350,"weekly_high":700,"monthly_low":1516.67,"monthly_high":3033.33,"currency":"AUD","scenario":"international student overall living costs in Adelaide","calculation":"weekly*52/12","indicative":true}'::jsonb),
    ('cc_au_adelaide_metro_tertiary_fares_2026_v1', 'https://www.adelaidemetro.com.au/tickets-and-fares/adelaide-metro-fares', date '2026-08-07', '{"concession_peak":2.25,"concession_off_peak":1.30,"concession_28_day_pass":59.60,"currency":"AUD","tertiary_student_uses_concession":true,"student_fare_is_school_only":true}'::jsonb),
    ('cc_au_study_australia_work_rights_2026_v1', 'https://www.studyaustralia.gov.au/en/work-in-australia', date '2026-08-07', '{"hours_per_fortnight":48,"during_study":true,"unlimited_during_scheduled_breaks":true}'::jsonb),
    ('cc_au_sa_key_industries_2026_v1', 'https://migration.sa.gov.au/before-applying/work-in-sa/key-industries', date '2026-08-07', '{"sectors":["Defence and space","Renewable energy and green tech","Health and medical","Critical and emerging technologies","Education","Tourism, food and established industries"],"scope":"South Australia economic context"}'::jsonb)
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
  d.metadata || jsonb_build_object('captured_for','adelaide_city_v1','country_code','AU')
from snapshot_data d
join evidence.sources s on s.source_key=d.source_key
on conflict (source_id, content_sha256) where content_sha256 is not null do update set
  source_url=excluded.source_url,
  data_as_of=excluded.data_as_of,
  retrieved_at=excluded.retrieved_at,
  valid_from=excluded.valid_from,
  snapshot_status='captured',
  metadata=excluded.metadata;

with adelaide as (
  select id from core.geographies
  where country_code='AU' and geography_type='city' and slug='adelaide'
    and canonical_geography_id is null and status='active' limit 1
)
delete from evidence.metric_observations o
using adelaide a
where o.scope_type='city' and o.scope_id=a.id::text
  and o.metric_key in ('city_population','student_living_cost_monthly_range','public_transport_flat_fare','student_work_hours_fortnight','employment_focus_sectors');

with adelaide as (
  select id from core.geographies
  where country_code='AU' and geography_type='city' and slug='adelaide'
    and canonical_geography_id is null and status='active' limit 1
), metric_data(metric_key,source_key,value,unit,confidence,evidence_kind,methodology,assumptions,effective_from) as (
  values
    ('city_population','cc_au_abs_adelaide_population_2025_v1','{"amount":1491015,"geography":"Greater Adelaide GCCSA","annual_change":18647,"annual_change_pct":1.3}'::jsonb,'people','high','observed','ABS estimated resident population for Greater Adelaide GCCSA at 30 June 2025.','{}'::jsonb,date '2025-06-30'),
    ('student_living_cost_monthly_range','cc_au_studyadelaide_living_cost_2026_v1','{"low":1516.67,"high":3033.33,"currency":"AUD","period":"month","weekly_low":350,"weekly_high":700,"scenario":"international student overall living costs in Adelaide","indicative":true}'::jsonb,'AUD/month','medium','calculated','StudyAdelaide publishes an overall A$350-A$700 weekly range; monthly equivalents are calculated as weekly × 52 ÷ 12.','{"tuition_excluded":true,"personal_budget_varies":true,"calculation":"weekly*52/12"}'::jsonb,date '2026-08-07'),
    ('public_transport_flat_fare','cc_au_adelaide_metro_tertiary_fares_2026_v1','{"amount":2.25,"currency":"AUD","period":"trip","transport_kind":"tertiary_concession_peak_fare","eligibility_required":true,"off_peak":1.30,"concession_28_day_pass":59.60,"student_fare_is_school_only":true}'::jsonb,'AUD/trip','high','observed','Full-time post-secondary students use Adelaide Metro concession fares. Headline value is the concession peak metroCARD/Buy & Go fare; off-peak and 28-day concession pass are stored separately.','{"valid_student_id_required":true,"student_ticket_category_is_primary_high_school_only":true,"not_a_weekly_cap":true}'::jsonb,date '2026-08-07'),
    ('student_work_hours_fortnight','cc_au_study_australia_work_rights_2026_v1','{"hours":48,"period":"fortnight_during_study","unrestricted_when_course_not_in_session":true}'::jsonb,'hours/fortnight','high','observed','Australian Government Study Australia summary of Student visa work hours.','{"individual_visa_conditions_should_be_checked":true}'::jsonb,date '2026-08-07'),
    ('employment_focus_sectors','cc_au_sa_key_industries_2026_v1','{"sectors":["Defence and space","Renewable energy and green tech","Health and medical","Critical and emerging technologies","Education","Tourism, food and established industries"],"basis":"Government of South Australia key industries"}'::jsonb,'qualitative','medium','observed','Qualitative South Australian key-industry context; used for Adelaide career context rather than as a city-level shortage ranking.','{"not_a_shortage_measure":true,"state_context_not_city_probability":true}'::jsonb,date '2026-08-07')
)
insert into evidence.metric_observations (
  metric_key,scope_type,scope_id,value,unit,source_snapshot_id,evidence_kind,confidence,methodology,assumptions,effective_from,review_status,reviewed_at,reviewer_note,created_at,updated_at
)
select
  m.metric_key,'city',city.id::text,m.value,m.unit,ss.id,m.evidence_kind,m.confidence,m.methodology,m.assumptions,m.effective_from,'verified',now(),'Adelaide city metric verified from primary government, official destination, public transport and Australian Government sources.',now(),now()
from metric_data m
cross join adelaide city
join evidence.sources src on src.source_key=m.source_key
join evidence.source_snapshots ss on ss.source_id=src.id and ss.data_as_of=m.effective_from and ss.snapshot_status in ('captured','unchanged');

with adelaide as (
  select id from core.geographies
  where country_code='AU' and geography_type='city' and slug='adelaide'
    and canonical_geography_id is null and status='active' limit 1
)
delete from public.report_metric_evidence_city p
using adelaide city
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
where o.scope_type='city' and g.country_code='AU' and g.slug='adelaide'
  and g.canonical_geography_id is null and o.review_status='verified'
  and o.metric_key in ('city_population','student_living_cost_monthly_range','public_transport_flat_fare','student_work_hours_fortnight','employment_focus_sectors');
