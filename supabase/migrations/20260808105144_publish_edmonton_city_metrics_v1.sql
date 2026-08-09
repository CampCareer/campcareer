-- Publish Edmonton named-city metrics for the Canada city product.

insert into evidence.sources (
  source_key, organisation_name, source_name, source_type, canonical_url,
  country_code, active, updated_at
)
values
  ('cc_ca_statscan_edmonton_2021_v1', 'Statistics Canada', '2021 Census Profile — Edmonton, City', 'government_dataset', 'https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?DGUIDlist=2021A00054811061&Lang=E', 'CA', true, now()),
  ('cc_ca_ualberta_edmonton_living_v1', 'University of Alberta', 'Alberta School of Business incoming exchange fact sheet — estimated expenses', 'provider', 'https://www.ualberta.ca/en/business/media-library/international/documents/incoming/asb-fact-sheet.pdf', 'CA', true, now()),
  ('cc_ca_ualberta_upass_2026_v1', 'University of Alberta Students Union', 'Schedule of Fees — UPass', 'market', 'https://docs.su.ualberta.ca/books/bylaw-article-i-governance/page/regulation-16001-schedule-of-fees', 'CA', true, now()),
  ('cc_ca_edmonton_industrial_sectors_2026_v1', 'City of Edmonton', 'Industrial Growth — key sectors driving industrial investment', 'government_dataset', 'https://www.edmonton.ca/business_economy/industrial-growth', 'CA', true, now())
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
    ('cc_ca_statscan_edmonton_2021_v1','https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?DGUIDlist=2021A00054811061&Lang=E',date '2021-05-11','{"population":1010899,"population_2016":933088,"change_pct":8.3,"geography":"Edmonton, City (Census subdivision)"}'::jsonb),
    ('cc_ca_ualberta_edmonton_living_v1','https://www.ualberta.ca/en/business/media-library/international/documents/incoming/asb-fact-sheet.pdf',date '2026-08-08','{"semester_low":6080,"semester_high":13690,"semester_months":4,"currency":"CAD","scenario":"incoming exchange student on-campus estimate","includes":["housing","meals","books and classroom materials","mandatory health insurance","U-Pass","other/personal expenses"]}'::jsonb),
    ('cc_ca_ualberta_upass_2026_v1','https://docs.su.ualberta.ca/books/bylaw-article-i-governance/page/regulation-16001-schedule-of-fees',date '2026-08-08','{"amount":182.50,"currency":"CAD","period":"term","assessment":"Fall, Winter and intersession","exceptions_apply":true}'::jsonb),
    ('cc_ca_edmonton_industrial_sectors_2026_v1','https://www.edmonton.ca/business_economy/industrial-growth',date '2026-08-08','{"sectors":["Advanced manufacturing","Artificial intelligence and technology","Energy and clean technology"]}'::jsonb)
)
insert into evidence.source_snapshots (
  source_id, source_url, content_sha256, data_as_of, retrieved_at, valid_from,
  snapshot_status, metadata
)
select s.id,d.source_url,
  encode(digest(d.source_key || '|' || d.data_as_of::text || '|' || d.metadata::text,'sha256'),'hex'),
  d.data_as_of,now(),d.data_as_of,'captured',
  d.metadata || jsonb_build_object('captured_for','edmonton_city_metrics_v1','country_code','CA')
from snapshot_data d join evidence.sources s on s.source_key=d.source_key
on conflict (source_id,content_sha256) where content_sha256 is not null do update set
  source_url=excluded.source_url,data_as_of=excluded.data_as_of,retrieved_at=excluded.retrieved_at,
  valid_from=excluded.valid_from,snapshot_status='captured',metadata=excluded.metadata;

with edmonton as (
  select id from core.geographies where country_code='CA' and geography_type='city'
    and slug='edmonton' and canonical_geography_id is null and status='active' limit 1
)
delete from evidence.metric_observations o using edmonton c
where o.scope_type='city' and o.scope_id=c.id::text
  and o.metric_key in ('city_population','student_living_cost_monthly_range','student_transport_reference','student_work_hours_week','employment_focus_sectors');

with metric_data(metric_key,source_key,source_date,value,unit,confidence,evidence_kind,methodology,assumptions,effective_from) as (
  values
    ('city_population','cc_ca_statscan_edmonton_2021_v1',date '2021-05-11','{"amount":1010899,"geography":"Edmonton, City (Census subdivision)","change_pct_2016_2021":8.3}'::jsonb,'people','high','observed','Statistics Canada 2021 Census population for Edmonton city census subdivision.','{"not_cma_population":true}'::jsonb,date '2021-05-11'),
    ('student_living_cost_monthly_range','cc_ca_ualberta_edmonton_living_v1',date '2026-08-08','{"low":1520,"high":3422.50,"currency":"CAD","period":"month","scenario":"UAlberta incoming exchange student on-campus estimate","indicative":true}'::jsonb,'CAD/month','medium','calculated','University of Alberta semester living-expense estimate of CAD 6,080–13,690 divided by four months. Tuition and airfare are excluded by the source; books, health insurance, U-Pass and personal expenses are included.','{"semester_months":4,"tuition_excluded":true,"books_included":true,"health_insurance_included":true}'::jsonb,date '2026-08-08'),
    ('student_transport_reference','cc_ca_ualberta_upass_2026_v1',date '2026-08-08','{"amount":182.50,"currency":"CAD","period":"term","transport_kind":"edmonton_upass_term","eligibility_required":true}'::jsonb,'CAD/term','high','observed','University of Alberta Students Union published U-Pass fee. Fall, Winter and intersession assessments apply, with listed exceptions.','{"institution_specific_student_product":true,"not_monthly_equivalent":true}'::jsonb,date '2026-08-08'),
    ('student_work_hours_week','cc_ca_ircc_student_work_2026_v1',date '2026-08-08','{"hours":24,"period":"week_during_academic_sessions","unlimited_during_eligible_scheduled_breaks":true,"eligibility_conditions_apply":true}'::jsonb,'hours/week','high','observed','IRCC off-campus work rule for eligible international students during regular academic sessions.','{}'::jsonb,date '2026-08-08'),
    ('employment_focus_sectors','cc_ca_edmonton_industrial_sectors_2026_v1',date '2026-08-08','{"sectors":["Advanced manufacturing","Artificial intelligence and technology","Energy and clean technology"],"basis":"City of Edmonton key sectors driving industrial investment"}'::jsonb,'qualitative','medium','observed','Qualitative Edmonton industrial investment context from City economic development guidance; not a shortage ranking.','{"not_a_shortage_measure":true}'::jsonb,date '2026-08-08')
)
insert into evidence.metric_observations (
  metric_key,scope_type,scope_id,value,unit,source_snapshot_id,evidence_kind,confidence,
  methodology,assumptions,effective_from,review_status,reviewed_at,reviewer_note,created_at,updated_at
)
select m.metric_key,'city',g.id::text,m.value,m.unit,ss.id,m.evidence_kind,m.confidence,
  m.methodology,m.assumptions,m.effective_from,'verified',now(),
  'Edmonton named-city metric verified from official government or University of Alberta primary sources.',now(),now()
from metric_data m
join core.geographies g on g.country_code='CA' and g.geography_type='city' and g.slug='edmonton'
  and g.canonical_geography_id is null and g.status='active'
join evidence.sources s on s.source_key=m.source_key
join evidence.source_snapshots ss on ss.source_id=s.id and ss.data_as_of=m.source_date
  and ss.snapshot_status in ('captured','unchanged');

with edmonton as (
  select id from core.geographies where country_code='CA' and geography_type='city'
    and slug='edmonton' and canonical_geography_id is null and status='active' limit 1
)
delete from public.report_metric_evidence_city p using edmonton c where p.geography_id=c.id;

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
where o.scope_type='city' and g.country_code='CA' and g.slug='edmonton'
  and g.canonical_geography_id is null and o.review_status='verified'
  and o.metric_key in ('city_population','student_living_cost_monthly_range','student_transport_reference','student_work_hours_week','employment_focus_sectors');
