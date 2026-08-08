-- Publish Calgary named-city metrics for the Canada city product.

insert into evidence.sources (
  source_key, organisation_name, source_name, source_type, canonical_url,
  country_code, active, updated_at
)
values
  ('cc_ca_statscan_calgary_2021_v1', 'Statistics Canada', '2021 Census Profile — Calgary, City', 'government_dataset', 'https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?DGUIDlist=2021A00054806016&Lang=E', 'CA', true, now()),
  ('cc_ca_mru_calgary_living_2026_v1', 'Mount Royal University', 'International Pathway — additional student expenses', 'provider', 'https://www.mtroyal.ca/ProgramsCourses/International-Pathway-Admission-Requirements.htm', 'CA', true, now()),
  ('cc_ca_calgary_transit_fares_2026_v1', 'Calgary Transit', 'Calgary Transit fares changing for 2026', 'regulator', 'https://transit-prd.calgary.ca/news/calgary-transit-fares-changing-for-2026.html', 'CA', true, now()),
  ('cc_ca_calgary_key_industries_2026_v1', 'Calgary Economic Development', 'Calgary key industries', 'market', 'https://www.calgaryeconomicdevelopment.com/key-industries/', 'CA', true, now())
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
    ('cc_ca_statscan_calgary_2021_v1','https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?DGUIDlist=2021A00054806016&Lang=E',date '2021-05-11','{"population":1306784,"population_2016":1239220,"change_pct":5.5,"geography":"Calgary, City (Census subdivision)"}'::jsonb),
    ('cc_ca_mru_calgary_living_2026_v1','https://www.mtroyal.ca/ProgramsCourses/International-Pathway-Admission-Requirements.htm',date '2026-08-08','{"eight_month_residence_low":6742,"eight_month_residence_high":9728,"food":3000,"clothing_personal_care":1200,"entertainment":600,"books_supplies_excluded":1500,"transport":"U-Pass included in tuition/fees","currency":"CAD"}'::jsonb),
    ('cc_ca_calgary_transit_fares_2026_v1','https://transit-prd.calgary.ca/news/calgary-transit-fares-changing-for-2026.html',date '2026-08-08','{"upass_winter_2026":175,"upass_fall_2026":180,"adult_monthly_2026":126,"adult_single_2026":4,"currency":"CAD"}'::jsonb),
    ('cc_ca_calgary_key_industries_2026_v1','https://www.calgaryeconomicdevelopment.com/key-industries/',date '2026-08-08','{"sectors":["Aerospace","Agribusiness","Defence","Digital and creative","Energy and environment","Financial services","Life sciences","Technology","Transportation and logistics"]}'::jsonb)
)
insert into evidence.source_snapshots (
  source_id, source_url, content_sha256, data_as_of, retrieved_at, valid_from,
  snapshot_status, metadata
)
select s.id,d.source_url,
  encode(digest(d.source_key || '|' || d.data_as_of::text || '|' || d.metadata::text,'sha256'),'hex'),
  d.data_as_of,now(),d.data_as_of,'captured',
  d.metadata || jsonb_build_object('captured_for','calgary_city_metrics_v1','country_code','CA')
from snapshot_data d join evidence.sources s on s.source_key=d.source_key
on conflict (source_id,content_sha256) where content_sha256 is not null do update set
  source_url=excluded.source_url,data_as_of=excluded.data_as_of,retrieved_at=excluded.retrieved_at,
  valid_from=excluded.valid_from,snapshot_status='captured',metadata=excluded.metadata;

with calgary as (
  select id from core.geographies where country_code='CA' and geography_type='city'
    and slug='calgary' and canonical_geography_id is null and status='active' limit 1
)
delete from evidence.metric_observations o using calgary c
where o.scope_type='city' and o.scope_id=c.id::text
  and o.metric_key in ('city_population','student_living_cost_monthly_range','student_transport_reference','student_work_hours_week','employment_focus_sectors');

with metric_data(metric_key,source_key,source_date,value,unit,confidence,evidence_kind,methodology,assumptions,effective_from) as (
  values
    ('city_population','cc_ca_statscan_calgary_2021_v1',date '2021-05-11','{"amount":1306784,"geography":"Calgary, City (Census subdivision)","change_pct_2016_2021":5.5}'::jsonb,'people','high','observed','Statistics Canada 2021 Census population for Calgary city census subdivision.','{"not_cma_population":true}'::jsonb,date '2021-05-11'),
    ('student_living_cost_monthly_range','cc_ca_mru_calgary_living_2026_v1',date '2026-08-08','{"low":1442.75,"high":1816,"currency":"CAD","period":"month","scenario":"MRU 8-month residence/rent, food, clothing/personal care and entertainment","indicative":true}'::jsonb,'CAD/month','medium','calculated','MRU current eight-month additional expense components: residence/rent CAD 6,742–9,728 + food CAD 3,000 + clothing/personal care CAD 1,200 + entertainment CAD 600, divided by 8. Books/supplies and tuition excluded; U-Pass is included in institutional fees.','{"eight_month_living_low":11542,"eight_month_living_high":14528,"books_supplies_excluded":true,"tuition_excluded":true}'::jsonb,date '2026-08-08'),
    ('student_transport_reference','cc_ca_calgary_transit_fares_2026_v1',date '2026-08-08','{"amount":180,"currency":"CAD","period":"term","transport_kind":"calgary_upass_fall_term","eligibility_required":true,"effective_from":"2026-09-01","winter_2026_amount":175,"adult_monthly_pass":126}'::jsonb,'CAD/term','high','observed','City-approved Fall 2026 Calgary Transit U-Pass fee. Winter 2026 U-Pass was CAD 175; student eligibility and institutional assessment rules apply.','{"upcoming_fall_reference":true,"not_monthly_equivalent":true}'::jsonb,date '2026-09-01'),
    ('student_work_hours_week','cc_ca_ircc_student_work_2026_v1',date '2026-08-08','{"hours":24,"period":"week_during_academic_sessions","unlimited_during_eligible_scheduled_breaks":true,"eligibility_conditions_apply":true}'::jsonb,'hours/week','high','observed','IRCC off-campus work rule for eligible international students during regular academic sessions.','{}'::jsonb,date '2026-08-08'),
    ('employment_focus_sectors','cc_ca_calgary_key_industries_2026_v1',date '2026-08-08','{"sectors":["Aerospace","Agribusiness","Defence","Digital and creative","Energy and environment","Financial services","Life sciences","Technology","Transportation and logistics"],"basis":"Calgary Economic Development key industries"}'::jsonb,'qualitative','medium','observed','Qualitative Calgary industry context; not a shortage ranking.','{"not_a_shortage_measure":true}'::jsonb,date '2026-08-08')
)
insert into evidence.metric_observations (
  metric_key,scope_type,scope_id,value,unit,source_snapshot_id,evidence_kind,confidence,
  methodology,assumptions,effective_from,review_status,reviewed_at,reviewer_note,created_at,updated_at
)
select m.metric_key,'city',g.id::text,m.value,m.unit,ss.id,m.evidence_kind,m.confidence,
  m.methodology,m.assumptions,m.effective_from,'verified',now(),
  'Calgary named-city metric verified from official government, transit or post-secondary primary source.',now(),now()
from metric_data m
join core.geographies g on g.country_code='CA' and g.geography_type='city' and g.slug='calgary'
  and g.canonical_geography_id is null and g.status='active'
join evidence.sources s on s.source_key=m.source_key
join evidence.source_snapshots ss on ss.source_id=s.id and ss.data_as_of=m.source_date
  and ss.snapshot_status in ('captured','unchanged');

with calgary as (
  select id from core.geographies where country_code='CA' and geography_type='city'
    and slug='calgary' and canonical_geography_id is null and status='active' limit 1
)
delete from public.report_metric_evidence_city p using calgary c where p.geography_id=c.id;

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
where o.scope_type='city' and g.country_code='CA' and g.slug='calgary'
  and g.canonical_geography_id is null and o.review_status='verified'
  and o.metric_key in ('city_population','student_living_cost_monthly_range','student_transport_reference','student_work_hours_week','employment_focus_sectors');
