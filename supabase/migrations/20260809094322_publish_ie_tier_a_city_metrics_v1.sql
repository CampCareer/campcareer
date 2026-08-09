-- Publish five verified decision metrics for the four approved Ireland Tier A cities.
-- Transport remains source-native; living-cost values preserve source-specific methodology.

with t as (
  select id,slug from core.geographies
  where country_code='IE' and geography_type='city'
    and canonical_geography_id is null and metadata->>'publication_tier'='A'
), v(slug,amount,label,url) as (
  values
    ('dublin',1458154::numeric,'Dublin four local-authority areas','https://www.cso.ie/en/csolatestnews/pressreleases/2023pressreleases/pressstatementcensusofpopulation2022-summaryresultsdublin/'),
    ('cork',222335,'Cork city and suburbs','https://www.cso.ie/en/releasesandpublications/ep/p-cpp1/censusofpopulation2022profile1-populationdistributionandmovements/backgroundnotes/'),
    ('galway',85856,'Galway city and suburbs','https://www.cso.ie/en/releasesandpublications/ep/p-cpp1/censusofpopulation2022profile1-populationdistributionandmovements/backgroundnotes/'),
    ('limerick',103611,'Limerick city and suburbs','https://www.cso.ie/en/releasesandpublications/ep/p-cpp1/censusofpopulation2022profile1-populationdistributionandmovements/backgroundnotes/')
)
insert into public.report_metric_evidence_city
(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select gen_random_uuid(),t.id,'city',t.id::text,'city_population',
  jsonb_build_object('amount',v.amount,'geography',v.label,'census_date','2022-04-03'),
  'Central Statistics Office — Census of Population 2022',v.url,'2022-04-03',now(),'high','observed','verified',now(),now()
from v join t using(slug)
on conflict(geography_id,metric_key) do update set
  value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,
  data_as_of=excluded.data_as_of,last_verified_at=now(),confidence='high',
  evidence_kind='observed',review_status='verified',updated_at=now();

with t as (
  select id,slug from core.geographies
  where country_code='IE' and geography_type='city'
    and canonical_geography_id is null and metadata->>'publication_tier'='A'
), v(slug,lo,hi,scenario,source,url,kind) as (
  values
    ('dublin',2318::numeric,2318::numeric,'UCD monthly student estimate','UCD Global — Living Costs','https://www.ucd.ie/global/study-at-ucd/scholarshipsfinances/livingcosts/','observed'),
    ('cork',1181,2923,'UCC monthly guide including accommodation','UCC — Cost of Living','https://www.ucc.ie/en/international/studentinfohub/beforeyouarrive/costofliving/','observed'),
    ('galway',1628,2128,'Shared-room €700–€1,200 plus up-to €928 non-accommodation allowance','University of Galway — student cost guides','https://www.universityofgalway.ie/student-life/accommodation/off-campus/','calculated'),
    ('limerick',1547.33,1547.33,'MIC 2026/27 monthly costs plus textbooks amortised over 9 months','Mary Immaculate College — The Basics','https://www.mic.ul.ie/international/international/essential-information/the-basics','calculated')
)
insert into public.report_metric_evidence_city
(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select gen_random_uuid(),t.id,'city',t.id::text,'student_living_cost_monthly_range',
  jsonb_build_object('low',v.lo,'high',v.hi,'period','month','currency','EUR','scenario',v.scenario,'indicative',true),
  v.source,v.url,'2026-08-09',now(),'medium',v.kind,'verified',now(),now()
from v join t using(slug)
on conflict(geography_id,metric_key) do update set
  value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,
  data_as_of=excluded.data_as_of,last_verified_at=now(),confidence='medium',
  evidence_kind=excluded.evidence_kind,review_status='verified',updated_at=now();

with t as (
  select id,slug from core.geographies
  where country_code='IE' and geography_type='city'
    and canonical_geography_id is null and metadata->>'publication_tier'='A'
), v(slug,amount,period,kind) as (
  values
    ('dublin',1.00::numeric,'90_minutes','tfi_dublin_zone_1_student_90_minute'),
    ('cork',0.85,'single_journey','cork_city_student_leap'),
    ('galway',0.65,'single_journey','galway_city_student_leap'),
    ('limerick',0.65,'single_journey','limerick_city_student_leap')
)
insert into public.report_metric_evidence_city
(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select gen_random_uuid(),t.id,'city',t.id::text,'student_transport_reference',
  jsonb_build_object('amount',v.amount,'period',v.period,'currency','EUR','transport_kind',v.kind,'eligibility_required',true,'source_native_period',true),
  'Transport for Ireland — Student/Young Adult Leap fares','https://www.transportforireland.ie/fares/bus-fares/',
  '2026-08-09',now(),'high','observed','verified',now(),now()
from v join t using(slug)
on conflict(geography_id,metric_key) do update set
  value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,
  data_as_of=excluded.data_as_of,last_verified_at=now(),confidence='high',
  evidence_kind='observed',review_status='verified',updated_at=now();

with t as (
  select id from core.geographies
  where country_code='IE' and geography_type='city'
    and canonical_geography_id is null and metadata->>'publication_tier'='A'
)
insert into public.report_metric_evidence_city
(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select gen_random_uuid(),id,'city',id::text,'student_work_hours_week',
  '{"hours_term_time":20,"hours_designated_holidays":40,"period":"week","context":"stamp_2_student_permission","eligibility_conditions_apply":true,"national_rule":true}'::jsonb,
  'Immigration Service Delivery — Stamp 2 conditions',
  'https://www.irishimmigration.ie/registering-your-immigration-permission/information-on-registering/immigration-permission-stamps/',
  '2026-08-09',now(),'high','observed','verified',now(),now()
from t
on conflict(geography_id,metric_key) do update set
  value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,
  data_as_of=excluded.data_as_of,last_verified_at=now(),confidence='high',
  evidence_kind='observed',review_status='verified',updated_at=now();

with t as (
  select id,slug from core.geographies
  where country_code='IE' and geography_type='city'
    and canonical_geography_id is null and metadata->>'publication_tier'='A'
), v(slug,basis,sectors,source,url) as (
  values
    ('dublin','Dublin city-region key sectors','["Technology","Financial services","Professional services","Life sciences","Transport and logistics","Arts and recreation"]'::jsonb,'Dublin.ie / Dublin City Council','https://dublin.ie/invest/key-sectors/'),
    ('cork','Cork City economic sectors','["Technology and ICT","Life sciences","Cybersecurity","International and business services","Engineering and clean technology","Energy and food innovation"]'::jsonb,'Cork City Council — LECP','https://publications.corkcity.ie/view/925196156/18/'),
    ('galway','Galway City cluster context','["MedTech","ICT and digital","Research and innovation","Creative and cultural industries"]'::jsonb,'Galway City Council — 2026 cluster context','https://www.galwaycity.ie/news/2026/galway-city-council-establishes-new-eu-project-unit-to-draw-down-european-funding'),
    ('limerick','Limerick key industry sectors','["Digital and technology","Life sciences and healthcare","Financial and professional services","Advanced manufacturing","Smart energy","Creative and media"]'::jsonb,'Limerick.ie — Key Sectors','https://www.limerick.ie/business/sectors')
)
insert into public.report_metric_evidence_city
(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select gen_random_uuid(),t.id,'city',t.id::text,'employment_focus_sectors',
  jsonb_build_object('basis',v.basis,'sectors',v.sectors,'indicative',true,'not_shortage_ranking',true),
  v.source,v.url,'2026-08-09',now(),'medium','observed','verified',now(),now()
from v join t using(slug)
on conflict(geography_id,metric_key) do update set
  value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,
  data_as_of=excluded.data_as_of,last_verified_at=now(),confidence='medium',
  evidence_kind='observed',review_status='verified',updated_at=now();

do $$
declare n integer;
begin
  select count(*) into n
  from public.report_metric_evidence_city r
  join core.geographies g on g.id=r.geography_id
  where g.country_code='IE'
    and g.metadata->>'publication_tier'='A'
    and r.review_status='verified'
    and r.metric_key in (
      'city_population','student_living_cost_monthly_range','student_transport_reference',
      'student_work_hours_week','employment_focus_sectors'
    );
  if n<>20 then
    raise exception 'IE Tier A metrics expected 20 rows, found %',n;
  end if;
end $$;
