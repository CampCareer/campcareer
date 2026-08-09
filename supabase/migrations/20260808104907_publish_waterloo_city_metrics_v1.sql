-- Publish Waterloo named-city metrics for the Canada city product.

insert into evidence.sources (
  source_key, organisation_name, source_name, source_type, canonical_url,
  country_code, active, updated_at
)
values
  ('cc_ca_statscan_waterloo_2021_v1', 'Statistics Canada', '2021 Census Profile — Waterloo, City', 'government_dataset', 'https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?DGUIDlist=2021A00053530016&Lang=E', 'CA', true, now()),
  ('cc_ca_uwaterloo_living_2026_v1', 'University of Waterloo', 'Living costs and housing — estimated living costs', 'provider', 'https://uwaterloo.ca/future-graduate-students/funding/living-costs-and-housing', 'CA', true, now()),
  ('cc_ca_uwaterloo_upass_fall_2026_v1', 'University of Waterloo', 'Undergraduate incidental fees Fall 2026 — GRT UPass', 'provider', 'https://uwaterloo.ca/finance/undergraduate-incidental-fees-fall-2026', 'CA', true, now()),
  ('cc_ca_waterloo_key_sectors_2026_v1', 'City of Waterloo', 'Key sectors and employers', 'government_dataset', 'https://www.waterloo.ca/why-waterloo/key-sectors-and-employers/', 'CA', true, now())
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
    ('cc_ca_statscan_waterloo_2021_v1','https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?DGUIDlist=2021A00053530016&Lang=E',date '2021-05-11','{"population":121436,"population_2016":104986,"change_pct":15.7,"geography":"Waterloo, City (Census subdivision)"}'::jsonb),
    ('cc_ca_uwaterloo_living_2026_v1','https://uwaterloo.ca/future-graduate-students/funding/living-costs-and-housing',date '2026-08-08','{"monthly_low":2121,"monthly_high":3071,"currency":"CAD","scenario":"single person living in Waterloo; lower amount based on shared accommodation","includes":["housing","food","telephone","entertainment","personal care","clothing","laundry","transportation","books and supplies"]}'::jsonb),
    ('cc_ca_uwaterloo_upass_fall_2026_v1','https://uwaterloo.ca/finance/undergraduate-incidental-fees-fall-2026',date '2026-08-08','{"fall_2026_upass":137.70,"currency":"CAD","period":"term","eligibility":"full-time undergraduate students enrolled in three or more courses at Waterloo Region campuses"}'::jsonb),
    ('cc_ca_waterloo_key_sectors_2026_v1','https://www.waterloo.ca/why-waterloo/key-sectors-and-employers/',date '2026-08-08','{"sectors":["Technology and innovation","Advanced manufacturing","Fintech and insurance","Health and medtech","Creative industries"]}'::jsonb)
)
insert into evidence.source_snapshots (
  source_id, source_url, content_sha256, data_as_of, retrieved_at, valid_from,
  snapshot_status, metadata
)
select s.id,d.source_url,
  encode(digest(d.source_key || '|' || d.data_as_of::text || '|' || d.metadata::text,'sha256'),'hex'),
  d.data_as_of,now(),d.data_as_of,'captured',
  d.metadata || jsonb_build_object('captured_for','waterloo_city_metrics_v1','country_code','CA')
from snapshot_data d join evidence.sources s on s.source_key=d.source_key
on conflict (source_id,content_sha256) where content_sha256 is not null do update set
  source_url=excluded.source_url,data_as_of=excluded.data_as_of,retrieved_at=excluded.retrieved_at,
  valid_from=excluded.valid_from,snapshot_status='captured',metadata=excluded.metadata;

with waterloo as (
  select id from core.geographies where country_code='CA' and geography_type='city'
    and slug='waterloo' and canonical_geography_id is null and status='active' limit 1
)
delete from evidence.metric_observations o using waterloo c
where o.scope_type='city' and o.scope_id=c.id::text
  and o.metric_key in ('city_population','student_living_cost_monthly_range','student_transport_reference','student_work_hours_week','employment_focus_sectors');

with metric_data(metric_key,source_key,source_date,value,unit,confidence,evidence_kind,methodology,assumptions,effective_from) as (
  values
    ('city_population','cc_ca_statscan_waterloo_2021_v1',date '2021-05-11','{"amount":121436,"geography":"Waterloo, City (Census subdivision)","change_pct_2016_2021":15.7}'::jsonb,'people','high','observed','Statistics Canada 2021 Census population for Waterloo city census subdivision.','{"not_region_or_cma_population":true}'::jsonb,date '2021-05-11'),
    ('student_living_cost_monthly_range','cc_ca_uwaterloo_living_2026_v1',date '2026-08-08','{"low":2121,"high":3071,"currency":"CAD","period":"month","scenario":"single person living in Waterloo; lower amount based on shared accommodation","indicative":true}'::jsonb,'CAD/month','medium','observed','University of Waterloo estimated monthly living costs for a single person living in Waterloo.','{"tuition_excluded":true,"books_and_supplies_included":true}'::jsonb,date '2026-08-08'),
    ('student_transport_reference','cc_ca_uwaterloo_upass_fall_2026_v1',date '2026-08-08','{"amount":137.70,"currency":"CAD","period":"term","transport_kind":"grt_upass_fall_undergraduate_term","eligibility_required":true,"effective_term":"Fall 2026"}'::jsonb,'CAD/term','high','observed','University of Waterloo Fall 2026 GRT UPass compulsory fee for eligible full-time undergraduate students at Waterloo Region campuses.','{"institution_specific_student_product":true,"not_monthly_equivalent":true}'::jsonb,date '2026-09-01'),
    ('student_work_hours_week','cc_ca_ircc_student_work_2026_v1',date '2026-08-08','{"hours":24,"period":"week_during_academic_sessions","unlimited_during_eligible_scheduled_breaks":true,"eligibility_conditions_apply":true}'::jsonb,'hours/week','high','observed','IRCC off-campus work rule for eligible international students during regular academic sessions.','{}'::jsonb,date '2026-08-08'),
    ('employment_focus_sectors','cc_ca_waterloo_key_sectors_2026_v1',date '2026-08-08','{"sectors":["Technology and innovation","Advanced manufacturing","Fintech and insurance","Health and medtech","Creative industries"],"basis":"City of Waterloo key sectors and employers"}'::jsonb,'qualitative','medium','observed','Qualitative Waterloo industry context from City economic development guidance; not a shortage ranking.','{"not_a_shortage_measure":true}'::jsonb,date '2026-08-08')
)
insert into evidence.metric_observations (
  metric_key,scope_type,scope_id,value,unit,source_snapshot_id,evidence_kind,confidence,
  methodology,assumptions,effective_from,review_status,reviewed_at,reviewer_note,created_at,updated_at
)
select m.metric_key,'city',g.id::text,m.value,m.unit,ss.id,m.evidence_kind,m.confidence,
  m.methodology,m.assumptions,m.effective_from,'verified',now(),
  'Waterloo named-city metric verified from official government or University of Waterloo primary sources.',now(),now()
from metric_data m
join core.geographies g on g.country_code='CA' and g.geography_type='city' and g.slug='waterloo'
  and g.canonical_geography_id is null and g.status='active'
join evidence.sources s on s.source_key=m.source_key
join evidence.source_snapshots ss on ss.source_id=s.id and ss.data_as_of=m.source_date
  and ss.snapshot_status in ('captured','unchanged');

with waterloo as (
  select id from core.geographies where country_code='CA' and geography_type='city'
    and slug='waterloo' and canonical_geography_id is null and status='active' limit 1
)
delete from public.report_metric_evidence_city p using waterloo c where p.geography_id=c.id;

insert into public.report_metric_evidence_city (
  geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,
  last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at
)
select o.scope_id::uuid,o.scope_type,o.scope_id,o.metric_key,o.value,s.source_name,ss.source_url,
  coalesce(ss.data_as_of,o.effective_from,current_date),coalesce(o.reviewed_at,o.updated_at,now()),
  o.confidence,o.evidence_kind,o.review_status,o.created_at,o.updated_at
from evidence.metric_observations o
join evidence.source_snapshots ss on ss.id=o.source_snapshot_id
join evidence.sources s on s.id=ss.source_id
join core.geographies g on g.id::text=o.scope_id
where o.scope_type='city' and g.country_code='CA' and g.slug='waterloo'
  and g.canonical_geography_id is null and o.review_status='verified'
  and o.metric_key in ('city_population','student_living_cost_monthly_range','student_transport_reference','student_work_hours_week','employment_focus_sectors');
