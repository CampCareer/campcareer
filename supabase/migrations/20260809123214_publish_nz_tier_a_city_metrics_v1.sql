-- Publish the same five verified decision metrics for the five approved New Zealand Tier A cities.
-- Source-native fare/living-cost methodologies are preserved; programme coverage remains independent.

with t as (
  select id,slug from core.geographies
  where country_code='NZ' and geography_type='city'
    and canonical_geography_id is null and status='active'
    and metadata->>'publication_tier'='A'
), v(slug,amount,label,url,geo_kind) as (
  values
    ('auckland',1547200::numeric,'Auckland urban area','https://tools.summaries.stats.govt.nz/places/UR/auckland','stats_nz_urban_area'),
    ('christchurch',419200,'Christchurch City territorial authority','https://tools.summaries.stats.govt.nz/places/TA/christchurch-city','stats_nz_territorial_authority'),
    ('hamilton',192100,'Hamilton City territorial authority','https://tools.summaries.stats.govt.nz/places/TA/hamilton-city','stats_nz_territorial_authority'),
    ('wellington',210800,'Wellington City territorial authority','https://tools.summaries.stats.govt.nz/places/TA/wellington-city','stats_nz_territorial_authority'),
    ('dunedin',132800,'Dunedin City territorial authority','https://tools.summaries.stats.govt.nz/places/TA/dunedin-city','stats_nz_territorial_authority')
)
insert into public.report_metric_evidence_city
(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select gen_random_uuid(),t.id,'city',t.id::text,'city_population',
  jsonb_build_object('amount',v.amount,'geography',v.label,'geography_kind',v.geo_kind,'estimate_kind','estimated_resident_population','estimate_date','2025-06-30'),
  'Stats NZ — Place and ethnic group summaries',v.url,'2025-06-30',now(),'high','observed','verified',now(),now()
from v join t using(slug)
on conflict(geography_id,metric_key) do update set
  value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,
  data_as_of=excluded.data_as_of,last_verified_at=now(),confidence='high',evidence_kind='observed',review_status='verified',updated_at=now();

with t as (
  select id,slug from core.geographies
  where country_code='NZ' and geography_type='city'
    and canonical_geography_id is null and status='active'
    and metadata->>'publication_tier'='A'
), v(slug,lo,hi,weekly_lo,weekly_hi,scenario,source,url) as (
  values
    ('auckland',1867.67::numeric,1871.70::numeric,431::numeric,431.93::numeric,'University accommodation vs nearby shared flat weekly examples, converted weekly × 52 / 12','University of Auckland — accommodation cost comparison','https://www.auckland.ac.nz/en/on-campus/accommodation/accommodation-options/why-live-with-us.html'),
    ('christchurch',1889.33,2275.00,436,525,'UC 2026 flatting to hall-of-residence weekly estimates, converted weekly × 52 / 12','University of Canterbury — living costs','https://www.canterbury.ac.nz/study/getting-started/study-and-living-costs/living-costs'),
    ('hamilton',1521.00,2751.67,351,635,'University of Waikato Hamilton basic weekly expense range, converted weekly × 52 / 12','University of Waikato — Cost of living','https://www.waikato.ac.nz/study/international/preparing-to-come-to-new-zealand/cost-of-living/'),
    ('wellington',2127.67,2127.67,491,491,'Manaaki scholarship basic living allowance proxy of NZ$982 fortnightly, converted weekly × 52 / 12; not a market-cost survey','Victoria University of Wellington — Manaaki living allowance','https://www.wgtn.ac.nz/international/scholarships-fees/manaaki-new-zealand-scholarships-programme/what-the-scholarship-covers'),
    ('dunedin',2383.33,2925.00,550,675,'Otago recommended NZ$22,000–27,000 for 40 academic weeks, converted to weekly then weekly × 52 / 12','University of Otago — Living costs','https://www.otago.ac.nz/international/future-students/accommodation-living/living-costs')
)
insert into public.report_metric_evidence_city
(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select gen_random_uuid(),t.id,'city',t.id::text,'student_living_cost_monthly_range',
  jsonb_build_object('low',v.lo,'high',v.hi,'period','month','currency','NZD','weekly_source_low',v.weekly_lo,'weekly_source_high',v.weekly_hi,'conversion','weekly_x_52_div_12','scenario',v.scenario,'indicative',true),
  v.source,v.url,'2026-08-09',now(),'medium','calculated','verified',now(),now()
from v join t using(slug)
on conflict(geography_id,metric_key) do update set
  value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,
  data_as_of=excluded.data_as_of,last_verified_at=now(),confidence='medium',evidence_kind='calculated',review_status='verified',updated_at=now();

with t as (
  select id,slug from core.geographies
  where country_code='NZ' and geography_type='city'
    and canonical_geography_id is null and status='active'
    and metadata->>'publication_tier'='A'
), v(slug,amount,period,kind,eligibility,note,source,url) as (
  values
    ('auckland',1.55::numeric,'single_trip','one_zone_tertiary_at_hop',true,'Registered AT HOP tertiary concession; full-time Auckland tertiary eligibility applies','Auckland Transport — bus and train fares','https://at.govt.nz/bus-train-ferry/fares-and-discounts/bus-and-train-fares'),
    ('christchurch',2.50,'single_bus_trip','metro_youth_19_24',true,'Youth 19–24 Metrocard fare; tertiary-specific concession was discontinued from 30 June 2025','Metro Christchurch — fares','https://www.metroinfo.co.nz/metrocard-and-fares/fares/'),
    ('hamilton',2.67,'single_trip','one_zone_adult_bee_card',true,'Registered Bee Card reference fare; no generic tertiary concession is asserted','BUSIT — fares','https://www.busit.co.nz/fares/'),
    ('wellington',1.59,'single_trip','one_zone_peak_tertiary',true,'Metlink tertiary concession; 1-zone peak fare from 15 May 2026','Metlink — tickets and fares','https://www.metlink.org.nz/getting-started/tickets-and-fares'),
    ('dunedin',2.50,'single_bus_trip','adult_bee_card_flat_fare',true,'Adult 19+ Bee Card fare; no generic tertiary concession is asserted','Otago Regional Council — Orbus fares','https://www.orc.govt.nz/orbus/fares/')
)
insert into public.report_metric_evidence_city
(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select gen_random_uuid(),t.id,'city',t.id::text,'student_transport_reference',
  jsonb_build_object('amount',v.amount,'period',v.period,'currency','NZD','reference_kind',v.kind,'eligibility_or_fare_card_required',v.eligibility,'note',v.note,'source_native_period',true),
  v.source,v.url,'2026-08-09',now(),'high','observed','verified',now(),now()
from v join t using(slug)
on conflict(geography_id,metric_key) do update set
  value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,
  data_as_of=excluded.data_as_of,last_verified_at=now(),confidence='high',evidence_kind='observed',review_status='verified',updated_at=now();

with t as (
  select id from core.geographies
  where country_code='NZ' and geography_type='city'
    and canonical_geography_id is null and status='active'
    and metadata->>'publication_tier'='A'
)
insert into public.report_metric_evidence_city
(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select gen_random_uuid(),id,'city',id::text,'student_work_hours_week',
  '{"hours_term_time":25,"period":"week","context":"eligible_student_visa","full_time_during_eligible_scheduled_breaks":true,"eligibility_conditions_apply":true,"national_rule":true,"effective_from":"2025-11-03","note":"Check the eVisa conditions. Some visas granted before 3 November 2025 may retain a 20-hour condition unless varied or replaced."}'::jsonb,
  'Immigration New Zealand — Working on a student visa',
  'https://www.immigration.govt.nz/study/once-you-have-a-student-visa/working-on-a-student-visa/',
  '2026-08-09',now(),'high','observed','verified',now(),now()
from t
on conflict(geography_id,metric_key) do update set
  value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,
  data_as_of=excluded.data_as_of,last_verified_at=now(),confidence='high',evidence_kind='observed',review_status='verified',updated_at=now();

with t as (
  select id,slug from core.geographies
  where country_code='NZ' and geography_type='city'
    and canonical_geography_id is null and status='active'
    and metadata->>'publication_tier'='A'
), v(slug,basis,sectors,source,url) as (
  values
    ('auckland','Auckland economic-development key industries','["Technology","Screen and creative","Circular economy","Building and infrastructure","Food and beverage","Medtech"]'::jsonb,'Auckland NZ — Key industries','https://industry.aucklandnz.com/invest/key-industries'),
    ('christchurch','ChristchurchNZ growth sectors','["Aerospace and future transport","Healthtech","Cleantech","Bioeconomy","Antarctic gateway"]'::jsonb,'ChristchurchNZ — Growth sectors','https://www.christchurchnz.com/business/growth-sectors/'),
    ('hamilton','Hamilton City Council key sectors','["Tech and innovation","Logistics","Manufacturing","Education","Healthcare"]'::jsonb,'Hamilton City Council — Economic development','https://hamilton.govt.nz/your-city/our-citys-economy/economic-development'),
    ('wellington','Wellington sectors of strength','["Science","Climate action and environment","Technology","Screen"]'::jsonb,'WellingtonNZ — Sectors of strength','https://www.wellingtonnz.com/business-events-conferences/hosting-your-conference-in-wellington/wellingtons-sectors-of-strength'),
    ('dunedin','Dunedin economy and forecast service-sector strengths','["Healthcare and social assistance","Education and training","Professional, scientific and technical services","Construction","Transport"]'::jsonb,'Dunedin City Council — Significant forecasting assumptions','https://www.dunedin.govt.nz/council/annual-and-long-term-plans/9-year-plan-2025-2034/section-4/significant-forecasting-assumptions')
)
insert into public.report_metric_evidence_city
(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select gen_random_uuid(),t.id,'city',t.id::text,'employment_focus_sectors',
  jsonb_build_object('basis',v.basis,'sectors',v.sectors,'indicative',true,'not_shortage_ranking',true),
  v.source,v.url,'2026-08-09',now(),'medium','observed','verified',now(),now()
from v join t using(slug)
on conflict(geography_id,metric_key) do update set
  value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,
  data_as_of=excluded.data_as_of,last_verified_at=now(),confidence='medium',evidence_kind='observed',review_status='verified',updated_at=now();

do $$
declare total_n integer; bad_city_n integer;
begin
  select count(*) into total_n
  from public.report_metric_evidence_city r
  join core.geographies g on g.id=r.geography_id
  where g.country_code='NZ'
    and g.metadata->>'publication_tier'='A'
    and r.review_status='verified'
    and r.metric_key in ('city_population','student_living_cost_monthly_range','student_transport_reference','student_work_hours_week','employment_focus_sectors');
  if total_n<>25 then raise exception 'NZ Tier A metrics expected 25 verified rows, found %',total_n; end if;

  select count(*) into bad_city_n from (
    select g.id
    from core.geographies g
    left join public.report_metric_evidence_city r
      on r.geography_id=g.id
     and r.review_status='verified'
     and r.metric_key in ('city_population','student_living_cost_monthly_range','student_transport_reference','student_work_hours_week','employment_focus_sectors')
    where g.country_code='NZ' and g.metadata->>'publication_tier'='A'
    group by g.id
    having count(r.metric_key)<>5
  ) q;
  if bad_city_n<>0 then raise exception 'Every NZ Tier A city must have exactly five verified metrics'; end if;
end $$;
