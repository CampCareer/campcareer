-- Publish Vancouver, Montreal and Ottawa city metrics and normalize Canada transport
-- to a period-agnostic student_transport_reference contract. Toronto's earlier
-- monthly-specific key is migrated to the generic contract here.

insert into evidence.sources (
  source_key, organisation_name, source_name, source_type, canonical_url,
  country_code, active, updated_at
)
values
  ('cc_ca_statscan_vancouver_2021_v1', 'Statistics Canada', '2021 Census Profile — Vancouver, City', 'government_dataset', 'https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?DGUIDlist=2021A00055915022&GENDERlist=1&HEADERlist=0&Lang=E&STATISTIClist=1', 'CA', true, now()),
  ('cc_ca_ubc_vancouver_living_2026_v1', 'University of British Columbia', 'VIRS fee, iMED & budgeting — Vancouver living budget', 'provider', 'https://goglobal.ubc.ca/go-global/coming-ubc/visiting-international-research-students/virs-fee-imed-budgeting', 'CA', true, now()),
  ('cc_ca_translink_upass_2026_v1', 'TransLink', 'U-Pass BC fees', 'regulator', 'https://www.translink.ca/transit-fares/u-pass-bc', 'CA', true, now()),
  ('cc_ca_vancouver_innovation_sectors_v1', 'City of Vancouver', 'Vancouver innovation economy map', 'government_dataset', 'https://vancouver.ca/home-property-development/vancouver-innovation-economy-map.aspx', 'CA', true, now()),
  ('cc_ca_statscan_montreal_2021_v1', 'Statistics Canada', '2021 Census Profile — Montréal, Ville', 'government_dataset', 'https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/Page.cfm?DGUIDlist=2021A00052466023&GENDERlist=1&HEADERlist=0&Lang=E&STATISTIClist=1', 'CA', true, now()),
  ('cc_ca_mcgill_montreal_living_2026_v1', 'McGill University', 'Cost of living — estimated monthly living costs', 'provider', 'https://www.mcgill.ca/macdonald/graduate-studies/funding', 'CA', true, now()),
  ('cc_ca_stm_student_fare_2026_v1', 'Société de transport de Montréal', 'Choosing the right fare — reduced student fare 18+', 'regulator', 'https://www.stm.info/en/info/fares/transit-fares/choosing-right-fare', 'CA', true, now()),
  ('cc_ca_montreal_economic_plan_2030_v1', 'Ville de Montréal', '2030 Economic Plan — strategic sectors and niches', 'government_dataset', 'https://montreal.ca/en/articles/2030-economic-plan-bold-framework-prosperous-city-93514', 'CA', true, now()),
  ('cc_ca_statscan_ottawa_2021_v1', 'Statistics Canada', '2021 Census Profile — Ottawa, City', 'government_dataset', 'https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?DGUIDlist=2021A00053506008&GENDERlist=1&HEADERlist=0&Lang=E&STATISTIClist=1', 'CA', true, now()),
  ('cc_ca_uottawa_living_2026_v1', 'University of Ottawa', 'International Viewbook 2026 — housing, food and other costs', 'provider', 'https://www.uottawa.ca/study/sites/g/files/bhrskd296/files/2025-09/international-viewbook-2026-EN.pdf', 'CA', true, now()),
  ('cc_ca_uottawa_upass_2026_v1', 'University of Ottawa', 'U-Pass cost, validity and important dates', 'provider', 'https://www.uottawa.ca/campus-life/upass/cost-validity-important-dates', 'CA', true, now()),
  ('cc_ca_ottawa_economic_sectors_2026_v1', 'City of Ottawa', 'Why Ottawa? — diverse economy', 'government_dataset', 'https://ottawa.ca/en/business/economic-development-services/economic-development/why-ottawa', 'CA', true, now())
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
    ('cc_ca_statscan_vancouver_2021_v1', 'https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?DGUIDlist=2021A00055915022&GENDERlist=1&HEADERlist=0&Lang=E&STATISTIClist=1', date '2021-05-11', '{"population":662248,"population_2016":631486,"change_pct":4.9,"geography":"Vancouver, City (Census subdivision)"}'::jsonb),
    ('cc_ca_ubc_vancouver_living_2026_v1', 'https://goglobal.ubc.ca/go-global/coming-ubc/visiting-international-research-students/virs-fee-imed-budgeting', date '2026-08-08', '{"minimum_monthly_budget":2200,"currency":"CAD","wording":"Plan on at least $2,200 CAD per month to live in Vancouver","scenario":"VIRS budgeting guidance"}'::jsonb),
    ('cc_ca_translink_upass_2026_v1', 'https://www.translink.ca/transit-fares/u-pass-bc', date '2026-08-08', '{"current_monthly_fee":46.90,"current_valid_from":"2025-09-01","current_valid_to":"2026-08-31","next_monthly_fee":47.85,"next_valid_from":"2026-09-01","next_valid_to":"2027-08-31","currency":"CAD"}'::jsonb),
    ('cc_ca_vancouver_innovation_sectors_v1', 'https://vancouver.ca/home-property-development/vancouver-innovation-economy-map.aspx', date '2026-08-08', '{"sectors":["Technology and digital","Creative industries","Life sciences and medical","Green innovation","Specialized manufacturing"]}'::jsonb),
    ('cc_ca_statscan_montreal_2021_v1', 'https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/Page.cfm?DGUIDlist=2021A00052466023&GENDERlist=1&HEADERlist=0&Lang=E&STATISTIClist=1', date '2021-05-11', '{"population":1762949,"population_2016":1704694,"change_pct":3.4,"geography":"Montréal, Ville (Census subdivision)"}'::jsonb),
    ('cc_ca_mcgill_montreal_living_2026_v1', 'https://www.mcgill.ca/macdonald/graduate-studies/funding', date '2026-08-08', '{"monthly_low":1807,"monthly_high":3171,"monthly_average":2405,"currency":"CAD","categories":["housing","food","utilities","internet","phone","entertainment","transportation"]}'::jsonb),
    ('cc_ca_stm_student_fare_2026_v1', 'https://www.stm.info/en/info/fares/transit-fares/choosing-right-fare', date '2026-08-08', '{"student_18_plus_monthly_all_modes_a":66,"regular_monthly_all_modes_a":110,"currency":"CAD","photo_opus_required":true,"zone":"A"}'::jsonb),
    ('cc_ca_montreal_economic_plan_2030_v1', 'https://montreal.ca/en/articles/2030-economic-plan-bold-framework-prosperous-city-93514', date '2026-08-08', '{"sectors":["Creative and cultural industries","Sustainable finance","Life sciences","Aerospace","Clean technologies","Artificial intelligence and data science","Advanced manufacturing"]}'::jsonb),
    ('cc_ca_statscan_ottawa_2021_v1', 'https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?DGUIDlist=2021A00053506008&GENDERlist=1&HEADERlist=0&Lang=E&STATISTIClist=1', date '2021-05-11', '{"population":1017449,"population_2016":934243,"change_pct":8.9,"geography":"Ottawa, City (Census subdivision)"}'::jsonb),
    ('cc_ca_uottawa_living_2026_v1', 'https://www.uottawa.ca/study/sites/g/files/bhrskd296/files/2025-09/international-viewbook-2026-EN.pdf', date '2025-09-01', '{"eight_month_low":25000,"eight_month_high":36000,"currency":"CAD","label":"Housing, food and other costs","viewbook_year":2026}'::jsonb),
    ('cc_ca_uottawa_upass_2026_v1', 'https://www.uottawa.ca/campus-life/upass/cost-validity-important-dates', date '2026-05-01', '{"spring_summer_2026":234.80,"valid_from":"2026-05-01","valid_to":"2026-08-31","fall_2026":240.67,"fall_valid_from":"2026-09-01","fall_valid_to":"2026-12-31","currency":"CAD"}'::jsonb),
    ('cc_ca_ottawa_economic_sectors_2026_v1', 'https://ottawa.ca/en/business/economic-development-services/economic-development/why-ottawa', date '2026-08-08', '{"sectors":["Technology and ICT","Life sciences and health","Clean technologies","Defence and aerospace","Public administration","Education","Tourism"]}'::jsonb)
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
  d.metadata || jsonb_build_object('captured_for', 'canada_city_metrics_batch_v1', 'country_code', 'CA')
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
  where country_code='CA' and geography_type='city' and slug='toronto'
    and canonical_geography_id is null and status='active'
  limit 1
)
delete from evidence.metric_observations o
using toronto t
where o.scope_type='city' and o.scope_id=t.id::text
  and o.metric_key in ('student_transport_monthly_reference','student_transport_reference');

with toronto as (
  select id from core.geographies
  where country_code='CA' and geography_type='city' and slug='toronto'
    and canonical_geography_id is null and status='active'
  limit 1
), src as (
  select ss.id snapshot_id
  from evidence.source_snapshots ss
  join evidence.sources s on s.id=ss.source_id
  where s.source_key='cc_ca_ttc_fares_2026_v1'
    and ss.data_as_of=date '2026-08-08'
  order by ss.retrieved_at desc limit 1
)
insert into evidence.metric_observations (
  metric_key, scope_type, scope_id, value, unit, source_snapshot_id,
  evidence_kind, confidence, methodology, assumptions, effective_from,
  review_status, reviewed_at, reviewer_note, created_at, updated_at
)
select
  'student_transport_reference','city',t.id::text,
  '{"amount":128.15,"currency":"CAD","period":"month","transport_kind":"ttc_post_secondary_monthly_pass","eligibility_required":true,"adult_single_fare":3.30}'::jsonb,
  'CAD/month',src.snapshot_id,'observed','high',
  'TTC published post-secondary monthly pass; valid post-secondary photo identification requirements apply.',
  '{"not_equivalent_to_pay_as_you_go":true}'::jsonb,date '2026-08-08',
  'verified',now(),'Canada generic transport contract migration.',now(),now()
from toronto t cross join src;

with target_cities as (
  select id from core.geographies
  where country_code='CA' and geography_type='city'
    and slug in ('vancouver','montreal','ottawa')
    and canonical_geography_id is null and status='active'
)
delete from evidence.metric_observations o
using target_cities c
where o.scope_type='city' and o.scope_id=c.id::text
  and o.metric_key in (
    'city_population','student_living_cost_monthly_range','student_transport_reference',
    'student_work_hours_week','employment_focus_sectors'
  );

with metric_data(city_slug, metric_key, source_key, source_date, value, unit, confidence, evidence_kind, methodology, assumptions, effective_from) as (
  values
    ('vancouver','city_population','cc_ca_statscan_vancouver_2021_v1',date '2021-05-11','{"amount":662248,"geography":"Vancouver, City (Census subdivision)","change_pct_2016_2021":4.9}'::jsonb,'people','high','observed','Statistics Canada 2021 Census population for Vancouver city census subdivision.','{"not_cma_population":true}'::jsonb,date '2021-05-11'),
    ('vancouver','student_living_cost_monthly_range','cc_ca_ubc_vancouver_living_2026_v1',date '2026-08-08','{"low":2200,"high":2200,"currency":"CAD","period":"month","scenario":"UBC VIRS minimum monthly Vancouver budget","indicative":true,"minimum_reference":true}'::jsonb,'CAD/month','medium','observed','UBC advises VIRS students to plan on at least CAD 2,200 per month to live in Vancouver.','{"point_minimum_not_range":true,"tuition_excluded":true}'::jsonb,date '2026-08-08'),
    ('vancouver','student_transport_reference','cc_ca_translink_upass_2026_v1',date '2026-08-08','{"amount":46.90,"currency":"CAD","period":"month","transport_kind":"upass_bc_monthly","eligibility_required":true,"valid_to":"2026-08-31","next_amount":47.85,"next_effective_from":"2026-09-01"}'::jsonb,'CAD/month','high','observed','Current U-Pass BC monthly fee for eligible students through August 31, 2026.','{"institution_and_student_association_eligibility_applies":true}'::jsonb,date '2026-08-08'),
    ('vancouver','student_work_hours_week','cc_ca_ircc_student_work_2026_v1',date '2026-08-08','{"hours":24,"period":"week_during_academic_sessions","unlimited_during_eligible_scheduled_breaks":true,"eligibility_conditions_apply":true}'::jsonb,'hours/week','high','observed','IRCC off-campus work rule for eligible international students during regular academic sessions.','{}'::jsonb,date '2026-08-08'),
    ('vancouver','employment_focus_sectors','cc_ca_vancouver_innovation_sectors_v1',date '2026-08-08','{"sectors":["Technology and digital","Creative industries","Life sciences and medical","Green innovation","Specialized manufacturing"],"basis":"City of Vancouver innovation economy clusters"}'::jsonb,'qualitative','medium','observed','Qualitative city economic context from Vancouver innovation economy clusters; not a shortage ranking.','{"not_a_shortage_measure":true}'::jsonb,date '2026-08-08'),
    ('montreal','city_population','cc_ca_statscan_montreal_2021_v1',date '2021-05-11','{"amount":1762949,"geography":"Montréal, Ville (Census subdivision)","change_pct_2016_2021":3.4}'::jsonb,'people','high','observed','Statistics Canada 2021 Census population for Montréal city census subdivision.','{"not_cma_population":true}'::jsonb,date '2021-05-11'),
    ('montreal','student_living_cost_monthly_range','cc_ca_mcgill_montreal_living_2026_v1',date '2026-08-08','{"low":1807,"high":3171,"currency":"CAD","period":"month","scenario":"McGill estimated monthly student living costs","indicative":true}'::jsonb,'CAD/month','medium','observed','McGill published estimated monthly student living costs including housing, food, utilities, internet, phone, entertainment and transport.','{"tuition_excluded":true}'::jsonb,date '2026-08-08'),
    ('montreal','student_transport_reference','cc_ca_stm_student_fare_2026_v1',date '2026-08-08','{"amount":66,"currency":"CAD","period":"month","transport_kind":"stm_student_monthly_all_modes_a","eligibility_required":true,"zone":"A","photo_opus_required":true}'::jsonb,'CAD/month','high','observed','STM reduced student fare for students age 18+ on a monthly All Modes A pass. Photo OPUS card required.','{"zone_a_only":true}'::jsonb,date '2026-08-08'),
    ('montreal','student_work_hours_week','cc_ca_ircc_student_work_2026_v1',date '2026-08-08','{"hours":24,"period":"week_during_academic_sessions","unlimited_during_eligible_scheduled_breaks":true,"eligibility_conditions_apply":true}'::jsonb,'hours/week','high','observed','IRCC off-campus work rule for eligible international students during regular academic sessions.','{}'::jsonb,date '2026-08-08'),
    ('montreal','employment_focus_sectors','cc_ca_montreal_economic_plan_2030_v1',date '2026-08-08','{"sectors":["Creative and cultural industries","Sustainable finance","Life sciences","Aerospace","Clean technologies","Artificial intelligence and data science","Advanced manufacturing"],"basis":"Ville de Montréal 2030 Economic Plan"}'::jsonb,'qualitative','medium','observed','Qualitative strategic sectors and niches from Montréal 2030 Economic Plan; not a shortage ranking.','{"not_a_shortage_measure":true}'::jsonb,date '2026-08-08'),
    ('ottawa','city_population','cc_ca_statscan_ottawa_2021_v1',date '2021-05-11','{"amount":1017449,"geography":"Ottawa, City (Census subdivision)","change_pct_2016_2021":8.9}'::jsonb,'people','high','observed','Statistics Canada 2021 Census population for Ottawa city census subdivision.','{"not_cma_population":true}'::jsonb,date '2021-05-11'),
    ('ottawa','student_living_cost_monthly_range','cc_ca_uottawa_living_2026_v1',date '2025-09-01','{"low":3125,"high":4500,"currency":"CAD","period":"month","scenario":"uOttawa International Viewbook 2026 housing, food and other costs","indicative":true}'::jsonb,'CAD/month','medium','calculated','uOttawa approximate CAD 25,000–36,000 housing, food and other costs for 8 months divided by 8.','{"eight_month_low":25000,"eight_month_high":36000,"tuition_excluded":true}'::jsonb,date '2025-09-01'),
    ('ottawa','student_transport_reference','cc_ca_uottawa_upass_2026_v1',date '2026-05-01','{"amount":234.80,"currency":"CAD","period":"4_month_term","transport_kind":"ottawa_upass_term","eligibility_required":true,"valid_to":"2026-08-31","next_amount":240.67,"next_effective_from":"2026-09-01"}'::jsonb,'CAD/4-month term','high','observed','uOttawa Spring-Summer 2026 U-Pass fee, valid May 1 through August 31, 2026.','{"university_upass_eligibility_applies":true}'::jsonb,date '2026-05-01'),
    ('ottawa','student_work_hours_week','cc_ca_ircc_student_work_2026_v1',date '2026-08-08','{"hours":24,"period":"week_during_academic_sessions","unlimited_during_eligible_scheduled_breaks":true,"eligibility_conditions_apply":true}'::jsonb,'hours/week','high','observed','IRCC off-campus work rule for eligible international students during regular academic sessions.','{}'::jsonb,date '2026-08-08'),
    ('ottawa','employment_focus_sectors','cc_ca_ottawa_economic_sectors_2026_v1',date '2026-08-08','{"sectors":["Technology and ICT","Life sciences and health","Clean technologies","Defence and aerospace","Public administration","Education","Tourism"],"basis":"City of Ottawa economic development guidance"}'::jsonb,'qualitative','medium','observed','Qualitative Ottawa economic context from City economic development guidance; not a shortage ranking.','{"not_a_shortage_measure":true}'::jsonb,date '2026-08-08')
)
insert into evidence.metric_observations (
  metric_key, scope_type, scope_id, value, unit, source_snapshot_id,
  evidence_kind, confidence, methodology, assumptions, effective_from,
  review_status, reviewed_at, reviewer_note, created_at, updated_at
)
select
  m.metric_key,'city',g.id::text,m.value,m.unit,ss.id,m.evidence_kind,m.confidence,
  m.methodology,m.assumptions,m.effective_from,'verified',now(),
  'Canada named-city metric verified from official government, transit authority or university primary source.',now(),now()
from metric_data m
join core.geographies g
  on g.country_code='CA' and g.geography_type='city' and g.slug=m.city_slug
 and g.canonical_geography_id is null and g.status='active'
join evidence.sources s on s.source_key=m.source_key
join evidence.source_snapshots ss on ss.source_id=s.id and ss.data_as_of=m.source_date
 and ss.snapshot_status in ('captured','unchanged')
order by m.city_slug,m.metric_key;

with target_cities as (
  select id from core.geographies
  where country_code='CA' and geography_type='city'
    and slug in ('toronto','vancouver','montreal','ottawa')
    and canonical_geography_id is null and status='active'
)
delete from public.report_metric_evidence_city p
using target_cities c
where p.geography_id=c.id;

insert into public.report_metric_evidence_city (
  geography_id, scope_type, scope_id, metric_key, value, source_name, source_url,
  data_as_of, last_verified_at, confidence, evidence_kind, review_status,
  created_at, updated_at
)
select
  o.scope_id::uuid,o.scope_type,o.scope_id,o.metric_key,o.value,s.source_name,ss.source_url,
  coalesce(ss.data_as_of,o.effective_from,current_date),
  coalesce(o.reviewed_at,o.updated_at,now()),o.confidence,o.evidence_kind,o.review_status,
  o.created_at,o.updated_at
from evidence.metric_observations o
join evidence.source_snapshots ss on ss.id=o.source_snapshot_id
join evidence.sources s on s.id=ss.source_id
join core.geographies g on g.id::text=o.scope_id
where o.scope_type='city'
  and g.country_code='CA'
  and g.slug in ('toronto','vancouver','montreal','ottawa')
  and g.canonical_geography_id is null
  and o.review_status='verified'
  and o.metric_key in (
    'city_population','student_living_cost_monthly_range','student_transport_reference',
    'student_work_hours_week','employment_focus_sectors'
  );
