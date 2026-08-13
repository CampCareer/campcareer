-- Norway Cities Phase 4: exactly five verified decision metrics for each of five Tier A municipalities.

-- 1. Municipality population, Statistics Norway reference date 2026-01-01.
with t as (
  select id,slug,name,code from core.geographies where country_code='NO' and metadata->>'publication_tier'='A'
),
v(slug,amount) as (values
  ('oslo',728714::numeric),
  ('trondheim',218460),
  ('stavanger',151669),
  ('as',22725),
  ('tromso',79943)
)
insert into public.report_metric_evidence_city(
  id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at
)
select md5('no_city_phase4:'||t.id||':city_population')::uuid,t.id,'city',t.id::text,'city_population',
       jsonb_build_object(
         'amount',v.amount,'geography',t.name||' municipality','geography_kind','statistics_norway_municipality',
         'municipality_code',t.code,'estimate_kind','registered_population','estimate_date','2026-01-01'
       ),
       'Statistics Norway — Population by municipality','https://www.ssb.no/en/statbank1/table/07459','2026-01-01',now(),'high','observed','verified',now(),now()
from t join v using(slug)
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status='verified',updated_at=now();

-- 2. National student living-cost planning reference. Deliberately identical across cities; not a city cost ranking.
with t as (select id from core.geographies where country_code='NO' and metadata->>'publication_tier'='A')
insert into public.report_metric_evidence_city(
  id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at
)
select md5('no_city_phase4:'||t.id||':student_living_cost_monthly_range')::uuid,t.id,'city',t.id::text,'student_living_cost_monthly_range',
       jsonb_build_object(
         'low',15488,'high',15488,'currency','NOK','period','month','reference_scope','national_student_living_cost_reference',
         'city_specific',false,'indicative',true,'academic_year_reference',170368,'academic_year','2026-2027',
         'note','Study in Norway and UDI use NOK 15,488 per month / NOK 170,368 per academic year as the 2026–2027 student living-cost/funds reference. The same national reference is retained for every city and is not a measured city cost ranking.'
       ),
       'Study in Norway — Cost and requirements','https://studyinnorway.no/cost-and-requirements','2026-08-11',now(),'high','observed','verified',now(),now()
from t
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status='verified',updated_at=now();

-- 3. Source-native local student/student-relevant transport references.
with t as (select id,slug from core.geographies where country_code='NO' and metadata->>'publication_tier'='A'),
v(slug,amount,period,kind,student_specific,note,source,url) as (values
  ('oslo',393::numeric,'30_days','ruter_zone_1_student_30_day',true,'Ruter student 30-day ticket for Oslo Zone 1; student eligibility rules apply.','Ruter — 30-day ticket prices from 3 May 2026','https://ruter.no/nyheter/prisen-pa-manedskort-for-voksne-og-barn-gar-ned-3-mai'),
  ('trondheim',425,'30_days','atb_one_zone_student_30_day',true,'AtB one-zone student 30-day ticket, used as the Trondheim local reference; student eligibility rules apply.','AtB — 30-day ticket','https://www.atb.no/en/30day-ticket/'),
  ('stavanger',396,'30_days','kolumbus_one_zone_student_30_day',true,'Kolumbus one-zone student 30-day ticket, used as the Stavanger local reference; student eligibility rules apply.','Kolumbus — 30-day ticket','https://www.kolumbus.no/en/tickets/-prices-and-products/30-dayticket/'),
  ('as',551,'30_days','ruter_akershus_one_zone_student_30_day',true,'Ruter student 30-day ticket for one zone in Akershus, used as an Ås local reference; travel to Oslo may require additional zones.','Ruter — 30-day ticket prices from 3 May 2026','https://ruter.no/nyheter/prisen-pa-manedskort-for-voksne-og-barn-gar-ned-3-mai'),
  ('tromso',265,'30_days','svipper_tromso_young_adult_30_day',false,'Svipper Tromsø municipality 30-day fare for young adults aged 18–29. This is student-relevant and age-based, not a dedicated student fare.','Svipper — Bus fares','https://svipper.no/menu/tickets/bus-fares/?sprak=3')
)
insert into public.report_metric_evidence_city(
  id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at
)
select md5('no_city_phase4:'||t.id||':student_transport_reference')::uuid,t.id,'city',t.id::text,'student_transport_reference',
       jsonb_build_object(
         'amount',v.amount,'currency','NOK','period',v.period,'reference_kind',v.kind,'student_specific',v.student_specific,
         'source_native_period',true,'note',v.note
       ),
       v.source,v.url,'2026-08-11',now(),'high','observed','verified',now(),now()
from t join v using(slug)
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status='verified',updated_at=now();

-- 4. National study-permit work-right context. Not a city differentiator.
with t as (select id from core.geographies where country_code='NO' and metadata->>'publication_tier'='A')
insert into public.report_metric_evidence_city(
  id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at
)
select md5('no_city_phase4:'||t.id||':student_work_hours_week')::uuid,t.id,'city',t.id::text,'student_work_hours_week',
       jsonb_build_object(
         'hours_normal_period',20,'period','week','national_rule',true,'full_time_holidays',true,'self_employment_allowed',false,
         'note','A Norwegian study permit normally includes permission to work part-time for up to 20 hours per week alongside studies and full-time during holidays. UDI eligibility and permit conditions apply; this national rule is not a city differentiator.'
       ),
       'Norwegian Directorate of Immigration — Study permit','https://www.udi.no/en/want-to-apply/studies/studietillatelse/','2026-08-11',now(),'high','observed','verified',now(),now()
from t
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status='verified',updated_at=now();

-- 5. Official/local economic-development focus sectors. Context only, never a shortage or job-guarantee score.
with t as (select id,slug from core.geographies where country_code='NO' and metadata->>'publication_tier'='A'),
v(slug,basis,sectors,source,url) as (values
  ('oslo','Oslo Business Region innovation and sustainable-growth focus','["Climate and green solutions","Health and life sciences","Mobility","Technology and high-growth startups"]'::jsonb,'Oslo Business Region — About','https://oslobusinessregion.no/about'),
  ('trondheim','Trondheim municipality Technology Capital business-development priorities','["Ocean industries and technology","Health","Energy","Digitalisation and technology"]'::jsonb,'Trondheim municipality — Business and community development','https://www.trondheim.kommune.no/tema/klima-miljo-og-naring/naringsutvikling/naring-og-samfunnsutvikling/'),
  ('stavanger','City of Stavanger Business Strategy 2021–2030 priority areas','["Energy and green transition","Agriculture and aquaculture","Industry and technology","Experiences and tourism"]'::jsonb,'City of Stavanger — Business Strategy 2021–2030','https://www.stavanger.kommune.no/naring-og-arbeidsliv/naringsstrategi-2020-2030/'),
  ('as','Campus Ås innovation-district and knowledge-environment strengths','["Research and knowledge-intensive innovation","Bioeconomy and life sciences","Food and agriculture","Sustainable land use"]'::jsonb,'Ås municipality — Campus Ås innovation district','https://www.as.kommune.no/nyheter/2026-02-13-as-blir-innovasjonsdistrikt'),
  ('tromso','Tromsø municipality current business strengths and Arctic value chains','["Fisheries and aquaculture","Tourism","Knowledge and technology industries","ICT and Arctic science","Life sciences"]'::jsonb,'Tromsø municipality — Business in Tromsø','https://tromso.kommune.no/naeringslivet-i-tromso')
)
insert into public.report_metric_evidence_city(
  id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at
)
select md5('no_city_phase4:'||t.id||':employment_focus_sectors')::uuid,t.id,'city',t.id::text,'employment_focus_sectors',
       jsonb_build_object(
         'basis',v.basis,'sectors',v.sectors,'indicative',true,'not_shortage_ranking',true,
         'note','Official/local economic-development context only; not a shortage ranking, occupation-demand score or employment guarantee.'
       ),
       v.source,v.url,'2026-08-11',now(),'medium','observed','verified',now(),now()
from t join v using(slug)
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status='verified',updated_at=now();

do $$
declare n integer; bad integer; excluded integer;
begin
  select count(*) into n
  from public.report_metric_evidence_city r join core.geographies g on g.id=r.geography_id
  where g.country_code='NO' and g.metadata->>'publication_tier'='A' and r.review_status='verified'
    and r.metric_key in ('city_population','student_living_cost_monthly_range','student_transport_reference','student_work_hours_week','employment_focus_sectors');
  if n<>25 then raise exception 'NO Tier A metrics expected 25, found %',n; end if;

  select count(*) into bad from (
    select g.id
    from core.geographies g
    left join public.report_metric_evidence_city r
      on r.geography_id=g.id and r.review_status='verified'
      and r.metric_key in ('city_population','student_living_cost_monthly_range','student_transport_reference','student_work_hours_week','employment_focus_sectors')
    where g.country_code='NO' and g.metadata->>'publication_tier'='A'
    group by g.id having count(r.metric_key)<>5
  ) q;
  if bad<>0 then raise exception 'Each NO Tier A city must have exactly five verified metrics'; end if;

  select count(*) into excluded
  from public.report_metric_evidence_city r join core.geographies g on g.id=r.geography_id
  where g.country_code='NO' and g.slug in ('bodo','kongsberg','kristiansand','bergen','elverum')
    and r.metric_key in ('city_population','student_living_cost_monthly_range','student_transport_reference','student_work_hours_week','employment_focus_sectors')
    and r.id::text=md5('no_city_phase4:'||g.id||':'||r.metric_key)::uuid::text;
  if excluded<>0 then raise exception 'Excluded Norway city received Phase 4 metrics'; end if;
end $$;
