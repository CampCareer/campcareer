-- Publish five verified decision metrics for the ten approved UK Tier A cities.
-- Metric contract mirrors the Canada/U.S. rollout: population, indicative student living cost,
-- transport reference, Student visa work-hours reference, and employment-focus sectors.

with tier_a as (
  select id, slug
  from core.geographies
  where country_code='UK'
    and geography_type='city'
    and status='active'
    and canonical_geography_id is null
    and coalesce(metadata->>'publication_tier','')='A'
), rows(slug, amount, geography_label, evidence_kind) as (
  values
    ('london', 9089736::numeric, 'Greater London', 'calculated'),
    ('manchester', 589670, 'Manchester local authority', 'observed'),
    ('birmingham', 1183618, 'Birmingham local authority', 'observed'),
    ('edinburgh', 530680, 'City of Edinburgh council area', 'observed'),
    ('glasgow', 650300, 'Glasgow City council area', 'observed'),
    ('cardiff', 383919, 'Cardiff local authority', 'observed'),
    ('belfast', 352390, 'Belfast local government district', 'observed'),
    ('oxford', 166034, 'Oxford local authority', 'observed'),
    ('cambridge', 149352, 'Cambridge local authority', 'observed'),
    ('bristol', 494399, 'Bristol, City of local authority', 'observed')
)
insert into public.report_metric_evidence_city
(id, geography_id, scope_type, scope_id, metric_key, value, source_name, source_url, data_as_of, last_verified_at, confidence, evidence_kind, review_status, created_at, updated_at)
select
  gen_random_uuid(), t.id, 'city', t.id::text, 'city_population',
  jsonb_build_object(
    'amount', r.amount,
    'geography', r.geography_label,
    'estimate_date', '2024-06-30'
  ) || case when r.slug='london' then jsonb_build_object('aggregation','sum_33_greater_london_local_authorities') else '{}'::jsonb end,
  'Office for National Statistics — Explore Local Statistics: Total population (mid-2024)',
  'https://www.ons.gov.uk/explore-local-statistics/api/v1/data.csv?geo=ltla&indicator=population-count&time=2024-06-30',
  '2024-06-30'::date, now(), 'high', r.evidence_kind, 'verified', now(), now()
from rows r join tier_a t on t.slug=r.slug
on conflict (geography_id, metric_key) do update set
  value=excluded.value, source_name=excluded.source_name, source_url=excluded.source_url,
  data_as_of=excluded.data_as_of, last_verified_at=now(), confidence=excluded.confidence,
  evidence_kind=excluded.evidence_kind, review_status='verified', updated_at=now();

with tier_a as (
  select id, slug from core.geographies
  where country_code='UK' and geography_type='city' and status='active'
    and canonical_geography_id is null and coalesce(metadata->>'publication_tier','')='A'
), rows(slug, low_amount, high_amount, scenario, source_name, source_url, evidence_kind, extra) as (
  values
    ('london',1812.67::numeric,1812.67::numeric,'UCL 2026/27 average self-catered hall rent over 9 months plus published monthly essential costs; transport is included in the essential-cost bundle','University College London — How much does it cost to study at UCL?','https://www.ucl.ac.uk/study/student-finances/cost-study/how-much-does-it-cost-study-ucl','calculated','{}'::jsonb),
    ('manchester',1484,1503,'University of Manchester 2026/27 undergraduate monthly estimate; main total to self-catered variant','University of Manchester — Cost of living','https://www.manchester.ac.uk/study/undergraduate/fees-and-funding/cost-of-living/index.htm','observed','{}'::jsonb),
    ('birmingham',1373.67,1373.67,'University of Birmingham self-catered essential £207/week plus variable £110/week, converted using 52/12 weeks per month','University of Birmingham — Living costs','https://www.birmingham.ac.uk/study/student-experience/advice-support/money-advice/living-costs','calculated','{}'::jsonb),
    ('edinburgh',1546,1546,'University of Edinburgh 2026/27 average monthly living cost for a single undergraduate student','University of Edinburgh — 2026/27 undergraduate living-cost estimate','https://study.ed.ac.uk/programmes/undergraduate/2026/153-economics-and-accounting','observed','{}'::jsonb),
    ('glasgow',2318.33,2318.33,'University of Glasgow 2026/27 weekly living allowance excluding visa, IHS and flights; £535/week converted using 52/12 weeks per month','University of Glasgow — Cost of Living 2026/27','https://www.gla.ac.uk/myglasgow/registry/finance/usloans/costofliving202627/','calculated','{"source_context":"US federal-loan living-cost allowance"}'::jsonb),
    ('cardiff',1125.91,1304.80,'Cardiff University 2026/27 international undergraduate private-accommodation total to university-accommodation total; travel excluded by source','Cardiff University — Living costs calculator','https://www.cardiff.ac.uk/study/student-life/cost-of-living/living-costs-calculator','observed','{"travel_included":false}'::jsonb),
    ('belfast',1300,1300,'Queen''s University Belfast guide for monthly living costs including accommodation','Queen''s University Belfast — Costs and Living in Belfast','https://www.qub.ac.uk/Study/international-students/incoming-exchange/costs-living-in-belfast/','observed','{}'::jsonb),
    ('oxford',1405,2105,'University of Oxford 2026/27 likely monthly living-cost range for a single full-time student','University of Oxford — Living costs 2026-27','https://www.ox.ac.uk/admissions/undergraduate/fees-and-funding/living-costs','observed','{}'::jsonb),
    ('cambridge',1655,1655,'University of Cambridge 2026/27 postgraduate average basic living-cost benchmark','University of Cambridge — Living costs (Maintenance)','https://www.postgraduate.study.cam.ac.uk/finance/maintenance','observed','{"student_level":"postgraduate benchmark"}'::jsonb),
    ('bristol',1401,1862,'University of Bristol 2025/26 observed student survey: undergraduate to postgraduate average monthly spend','University of Bristol — Budgeting and living expenses','https://www.bristol.ac.uk/students/support/finances/advice/living-expenses/','observed','{"reference_academic_year":"2025/26"}'::jsonb)
)
insert into public.report_metric_evidence_city
(id, geography_id, scope_type, scope_id, metric_key, value, source_name, source_url, data_as_of, last_verified_at, confidence, evidence_kind, review_status, created_at, updated_at)
select
  gen_random_uuid(), t.id, 'city', t.id::text, 'student_living_cost_monthly_range',
  jsonb_build_object('low',r.low_amount,'high',r.high_amount,'period','month','currency','GBP','scenario',r.scenario,'indicative',true) || r.extra,
  r.source_name, r.source_url, '2026-08-08'::date, now(), 'medium', r.evidence_kind, 'verified', now(), now()
from rows r join tier_a t on t.slug=r.slug
on conflict (geography_id, metric_key) do update set
  value=excluded.value, source_name=excluded.source_name, source_url=excluded.source_url,
  data_as_of=excluded.data_as_of, last_verified_at=now(), confidence=excluded.confidence,
  evidence_kind=excluded.evidence_kind, review_status='verified', updated_at=now();

with tier_a as (
  select id, slug from core.geographies
  where country_code='UK' and geography_type='city' and status='active'
    and canonical_geography_id is null and coalesce(metadata->>'publication_tier','')='A'
), rows(slug, amount, period, transport_kind, eligibility_required, extra, source_name, source_url) as (
  values
    ('london',119.90::numeric,'month','tfl_18plus_student_oyster_zones_1_2_travelcard',true,'{"eligibility":"18+ Student Oyster photocard","zones":"1-2"}'::jsonb,'Transport for London — 18+ Student Oyster photocard prices 2026','https://content.tfl.gov.uk/18-plus-student-oyster-photocard-fares.pdf'),
    ('manchester',63.30,'28_days','bee_network_28_day_anybus_young_person_student',true,'{"eligibility":"young person/student product; scheme conditions apply"}'::jsonb,'Bee Network — 28 day Bee AnyBus young person/student','https://tfgm.com/tickets-and-passes/28-day-bee-anybus-young-person'),
    ('birmingham',56.00,'4_weeks','tfwm_student_regional_bus_4_week',true,'{"eligibility":"student ticket"}'::jsonb,'Transport for West Midlands — Student Regional bus 4 week','https://ticketing.tfwm.org.uk/Home/SearchResults/27'),
    ('edinburgh',68.00,'4_weeks','lothian_student_ridacard_4_week',true,'{"eligibility":"eligible student with valid matriculation card"}'::jsonb,'Lothian Buses — Student Ridacard','https://www.lothianbuses.com/students/'),
    ('glasgow',60.00,'28_days','spt_subway_adult_smartcard_28_day',false,'{"student_specific_discount":false}'::jsonb,'SPT — Subway tickets','https://www.spt.co.uk/tickets/subway-tickets/'),
    ('cardiff',49.00,'28_days','cardiff_bus_4_week_to_go_my_travelpass',true,'{"eligibility":"age 16-21 with My Travel Pass"}'::jsonb,'Cardiff Bus — Fares and tickets','https://www.cardiffbus.com/mobile-tickets'),
    ('belfast',2.50,'day','translink_ylink_metro_glider_day_ticket',true,'{"eligibility":"yLink age 16-23","discount_context":"50% off eligible standard adult fares"}'::jsonb,'Translink — yLink','https://www.translink.co.uk/tickets/travelcards/ylink'),
    ('oxford',4.50,'day','oxford_bus_cityzone_freeflow_day_cap',false,'{"student_specific_discount":false,"effective_from":"2026-02-22"}'::jsonb,'Oxford Bus Company — Fare Changes from 22 February 2026','https://www.oxfordbus.co.uk/fare-changes-22nd-february-2026'),
    ('cambridge',1.00,'single_journey','cpca_tiger_pass_under_25_bus_fare',true,'{"eligibility":"age 25 or under with free Tiger Pass"}'::jsonb,'Cambridgeshire & Peterborough Combined Authority — £1 Bus Fare','https://cambridgeshirepeterborough-ca.gov.uk/onepoundbusfare/'),
    ('bristol',91.08,'month','first_bus_bristol_zone_student_month',true,'{"eligibility":"student ID or accepted student verification","effective_from":"2026-01-04"}'::jsonb,'First Bus — University of Bristol student tickets','https://www.firstbus.co.uk/bristol-bath-and-west/your-services/bristol-universities/university-bristol')
)
insert into public.report_metric_evidence_city
(id, geography_id, scope_type, scope_id, metric_key, value, source_name, source_url, data_as_of, last_verified_at, confidence, evidence_kind, review_status, created_at, updated_at)
select
  gen_random_uuid(), t.id, 'city', t.id::text, 'student_transport_reference',
  jsonb_build_object('amount',r.amount,'period',r.period,'currency','GBP','transport_kind',r.transport_kind,'eligibility_required',r.eligibility_required) || r.extra,
  r.source_name, r.source_url, '2026-08-08'::date, now(), 'high', 'observed', 'verified', now(), now()
from rows r join tier_a t on t.slug=r.slug
on conflict (geography_id, metric_key) do update set
  value=excluded.value, source_name=excluded.source_name, source_url=excluded.source_url,
  data_as_of=excluded.data_as_of, last_verified_at=now(), confidence=excluded.confidence,
  evidence_kind=excluded.evidence_kind, review_status='verified', updated_at=now();

with tier_a as (
  select id from core.geographies
  where country_code='UK' and geography_type='city' and status='active'
    and canonical_geography_id is null and coalesce(metadata->>'publication_tier','')='A'
)
insert into public.report_metric_evidence_city
(id, geography_id, scope_type, scope_id, metric_key, value, source_name, source_url, data_as_of, last_verified_at, confidence, evidence_kind, review_status, created_at, updated_at)
select
  gen_random_uuid(), t.id, 'city', t.id::text, 'student_work_hours_week',
  '{"hours":20,"period":"week_during_term_time","context":"student_visa_full_time_degree_level_or_above_at_compliant_higher_education_provider","full_time_outside_term":true,"eligibility_conditions_apply":true,"national_rule":true,"note":"Below-degree, part-time and other study categories can have different or no work permission."}'::jsonb,
  'GOV.UK Immigration Rules Appendix Student — ST 26 Work conditions',
  'https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-student',
  '2026-08-08'::date, now(), 'high', 'observed', 'verified', now(), now()
from tier_a t
on conflict (geography_id, metric_key) do update set
  value=excluded.value, source_name=excluded.source_name, source_url=excluded.source_url,
  data_as_of=excluded.data_as_of, last_verified_at=now(), confidence=excluded.confidence,
  evidence_kind=excluded.evidence_kind, review_status='verified', updated_at=now();

with tier_a as (
  select id, slug from core.geographies
  where country_code='UK' and geography_type='city' and status='active'
    and canonical_geography_id is null and coalesce(metadata->>'publication_tier','')='A'
), rows(slug, basis, sectors, source_name, source_url) as (
  values
    ('london','London City Hall growth sectors','["Financial and business services","Technology","Life sciences","Creative industries","Green economy","Visitor economy"]'::jsonb,'London City Hall — Supporting London''s sectors growth','https://www.london.gov.uk/programmes-strategies/business-and-economy/mayors-priorities-londons-economy-and-business/supporting-londons-sectors-growth'),
    ('manchester','Greater Manchester frontier sectors; regional career context for Manchester city','["Advanced Materials and Manufacturing","Creative Industries","Digital, Cyber and AI","Health Innovation and Life Sciences","Low Carbon"]'::jsonb,'Greater Manchester Combined Authority — Sector Development Plans','https://www.greatermanchester-ca.gov.uk/what-we-do/economy/sector-development-plans/'),
    ('birmingham','Birmingham growth and Industrial Strategy focus sectors','["Professional and business services","Life sciences","Creative and digital","Clean energy","Financial services"]'::jsonb,'Growth in Brum — Key economic sectors','https://growth.birmingham.gov.uk/info/2/discover/7/major-developments-brum/19'),
    ('edinburgh','City of Edinburgh Economic Needs Study key sectors','["Tourism","Renewable energy","Creative industries","Financial services","Data","Life sciences and biotechnology"]'::jsonb,'City of Edinburgh Council — Economic Needs Study: Economic Overview','https://www.edinburgh.gov.uk/downloads/file/39274/economic-needs-study-economic-overview'),
    ('glasgow','Glasgow City Region cluster and growth strengths','["Clinical life sciences and biotechnology","Fintech","Energy and green transition","Digital creative industries","Advanced manufacturing and precision engineering","Space and satellite technology"]'::jsonb,'Invest Glasgow — Clusters','https://www.investglasgow.com/ecosystem/clusters'),
    ('cardiff','Cardiff Capital Region priority-growth context for Cardiff','["FinTech","Cybersecurity and analytics","Creative economy","Compound semiconductors","MedTech","Energy and environment"]'::jsonb,'Cardiff Capital Region — About CCR','https://www.cardiffcapitalregion.wales/about-ccr/'),
    ('belfast','Belfast City Council investment key sectors','["Advanced engineering and manufacturing","Creative and digital","Financial and professional services","Hospitality and tourism","Life and health sciences"]'::jsonb,'Belfast City Council — Key Sectors','https://www.belfastcity.gov.uk/investinbelfast/key-sectors'),
    ('oxford','Oxford City Council business-sector strengths','["Education","Health and biotechnology","Digital, creative and publishing","Vehicle manufacturing","Professional and scientific services"]'::jsonb,'Oxford City Council — Oxford''s business sectors','https://www.oxford.gov.uk/oxfords-economy/oxfords-business-sectors'),
    ('cambridge','Cambridgeshire and Peterborough priority sectors; regional career context for Cambridge','["Defence","Digital technologies","Advanced manufacturing and materials","Life sciences","Energy and clean-tech","Agri-food and tech"]'::jsonb,'Cambridgeshire & Peterborough Combined Authority — UKREiiF 2026','https://cambridgeshirepeterborough-ca.gov.uk/inward-investment/ukreiif-2026/'),
    ('bristol','Bristol City Council business-location sector strengths','["Advanced engineering","Financial services","High tech","Zero carbon","Professional services","Creative and digital"]'::jsonb,'Bristol City Council — Locating your business','https://www.bristol.gov.uk/economic-development/locating-your-business')
)
insert into public.report_metric_evidence_city
(id, geography_id, scope_type, scope_id, metric_key, value, source_name, source_url, data_as_of, last_verified_at, confidence, evidence_kind, review_status, created_at, updated_at)
select
  gen_random_uuid(), t.id, 'city', t.id::text, 'employment_focus_sectors',
  jsonb_build_object('basis',r.basis,'sectors',r.sectors),
  r.source_name, r.source_url, '2026-08-08'::date, now(), 'high', 'observed', 'verified', now(), now()
from rows r join tier_a t on t.slug=r.slug
on conflict (geography_id, metric_key) do update set
  value=excluded.value, source_name=excluded.source_name, source_url=excluded.source_url,
  data_as_of=excluded.data_as_of, last_verified_at=now(), confidence=excluded.confidence,
  evidence_kind=excluded.evidence_kind, review_status='verified', updated_at=now();

do $$
declare
  metric_keys text[] := array[
    'city_population',
    'student_living_cost_monthly_range',
    'student_transport_reference',
    'student_work_hours_week',
    'employment_focus_sectors'
  ];
begin
  if (
    select count(*) from core.geographies
    where country_code='UK' and geography_type='city' and status='active'
      and canonical_geography_id is null and coalesce(metadata->>'publication_tier','')='A'
  ) <> 10 then
    raise exception 'UK Tier A metric contract expected exactly 10 cities';
  end if;

  if (
    select count(*)
    from public.report_metric_evidence_city m
    join core.geographies g on g.id=m.geography_id
    where g.country_code='UK'
      and coalesce(g.metadata->>'publication_tier','')='A'
      and m.metric_key=any(metric_keys)
  ) <> 50 then
    raise exception 'UK Tier A metric contract expected exactly 50 metric rows';
  end if;

  if exists (
    select 1
    from core.geographies g
    where g.country_code='UK' and g.geography_type='city' and g.status='active'
      and g.canonical_geography_id is null and coalesce(g.metadata->>'publication_tier','')='A'
      and (
        select count(*)
        from public.report_metric_evidence_city m
        where m.geography_id=g.id
          and m.metric_key=any(metric_keys)
          and m.review_status='verified'
      ) <> 5
  ) then
    raise exception 'Every UK Tier A city must have exactly five verified core metrics';
  end if;
end $$;