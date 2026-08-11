-- Denmark Cities Phase 4: five verified decision metrics for each of the five Tier A municipalities.
-- Production evidence was applied as idempotent metric-family upserts before this migration-history version was recorded.
-- This file is the replayable source of truth for fresh environments.

with t as (select id,slug,name,metadata->>'dst_municipality_code' code from core.geographies where country_code='DK' and metadata->>'publication_tier'='A'),
v(slug,amount) as (values ('copenhagen',670389::numeric),('frederiksberg',105947),('odense',213140),('aarhus',378270),('aalborg',226404))
insert into public.report_metric_evidence_city(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select md5('dk_city_phase4:'||t.id||':city_population')::uuid,t.id,'city',t.id::text,'city_population',jsonb_build_object('amount',v.amount,'geography',t.name||' Municipality','geography_kind','dst_municipality','municipality_code',t.code,'estimate_kind','population_first_day_of_quarter','quarter','2026Q3','estimate_date','2026-07-01'),'Statistics Denmark — FOLK1A','https://www.statbank.dk/FOLK1A','2026-07-01',now(),'high','observed','verified',now(),now()
from t join v using(slug)
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status='verified',updated_at=now();

with t as (select id from core.geographies where country_code='DK' and metadata->>'publication_tier'='A')
insert into public.report_metric_evidence_city(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select md5('dk_city_phase4:'||t.id||':student_living_cost_monthly_range')::uuid,t.id,'city',t.id::text,'student_living_cost_monthly_range',jsonb_build_object('low',8450,'high',13700,'currency','DKK','period','month','reference_scope','national_baseline','city_specific',false,'indicative',true,'note','Official national rough student budget baseline; retained equally across the five cities rather than mixing incompatible city-specific baskets.'),'Study in Denmark — Bank & Budget','https://studyindenmark.dk/live-in-denmark/bank-budget','2026-08-10',now(),'medium','calculated','verified',now(),now()
from t
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status='verified',updated_at=now();

with t as (select id,slug from core.geographies where country_code='DK' and metadata->>'publication_tier'='A'),
v(slug,amount,period,kind,note,source,url) as (values
 ('copenhagen',24::numeric,'2_zones','single_ticket','General adult reference; not a student concession.','Public Transport Denmark — Fares & Tickets','https://www.publictransport.dk/en/tickets'),
 ('frederiksberg',24,'2_zones','single_ticket','General adult capital-area reference; not a student concession.','Public Transport Denmark — Fares & Tickets','https://www.publictransport.dk/en/tickets'),
 ('odense',28,'1_to_2_zones','fynbus_single_ticket_adult','General adult reference.','FynBus — Fares','https://en.fynbus.dk/fares/fares'),
 ('aarhus',26,'1_to_2_zones','midttrafik_single_ticket_adult','General adult reference.','Midttrafik — Adult ticket prices','https://www.midttrafik.dk/english/prices/adult-16-66-years/'),
 ('aalborg',24,'2_zones','nt_single_ticket_adult','General adult reference.','Nordjyllands Trafikselskab — Prices and rules','https://www.en.ntrejse.dk/prices-and-rules'))
insert into public.report_metric_evidence_city(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select md5('dk_city_phase4:'||t.id||':student_transport_reference')::uuid,t.id,'city',t.id::text,'student_transport_reference',jsonb_build_object('amount',v.amount,'currency','DKK','period',v.period,'reference_kind',v.kind,'student_specific',false,'source_native_period',true,'note',v.note),v.source,v.url,'2026-08-10',now(),'high','observed','verified',now(),now()
from t join v using(slug)
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status='verified',updated_at=now();

with t as (select id from core.geographies where country_code='DK' and metadata->>'publication_tier'='A')
insert into public.report_metric_evidence_city(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select md5('dk_city_phase4:'||t.id||':student_work_hours_week')::uuid,t.id,'city',t.id::text,'student_work_hours_week',jsonb_build_object('hours_normal_period',90,'period','month','normal_period_months',jsonb_build_array('September','October','November','December','January','February','March','April','May'),'full_time_months',jsonb_build_array('June','July','August'),'context','state_approved_higher_education_student_residence_permit','national_rule',true,'limited_work_permit',true,'note','Relevant permit context: up to 90 hours per month September-May and full-time June-August; do not convert the monthly cap to a weekly entitlement.'),'SIRI / New to Denmark — Higher education','https://www.nyidanmark.dk/en-GB/You-want-to-apply/Study/Higher-Education','2026-08-10',now(),'high','observed','verified',now(),now()
from t
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status='verified',updated_at=now();

with t as (select id,slug from core.geographies where country_code='DK' and metadata->>'publication_tier'='A'),
v(slug,basis,sectors,source,url) as (values
 ('copenhagen','Business Strategy 2024-2027','["Life science","Green solutions","Creative industries","Tourism","International business"]'::jsonb,'City of Copenhagen — Business Strategy 2024-2027','https://www.kk.dk/politik/politikker-og-indsatser/beskaeftigelse-erhverv-og-oekonomi/erhvervsstrategi-2024-2027'),
 ('frederiksberg','Business Strategy 2024-2027','["Knowledge and education","Sustainable business","Tourism and culture","Retail and city life","Entrepreneurship"]'::jsonb,'Frederiksberg Municipality — Business Strategy 2024-2027','https://www.frederiksberg.dk/erhverv/erhvervsservice-og-nyhedsbrev/erhvervsstrategi'),
 ('odense','Invest in Odense focus areas','["Automation technology","Advanced aviation technology","Health technology","Life science","Startups and investment"]'::jsonb,'Odense Municipality — Invest in Odense','https://www.odense.dk/byens-udvikling/vaekst-i-odense/invest-in-odense'),
 ('aarhus','City Brand Aarhus economic strengths','["Renewable energy","Digital technology","Health","Food","Industrial innovation"]'::jsonb,'Aarhus Municipality — Core story of Aarhus','https://designguide.aarhus.dk/citybrandaarhus/tekster/kernefortaellingen-om-aarhus'),
 ('aalborg','Business Strategy 2023-2026','["Industry and technology","Green energy","Digitalisation","Health technology","Circular economy"]'::jsonb,'Aalborg Municipality — Business Strategy 2023-2026','https://www.aalborg.dk/om-kommunen/politikker-strategier-og-planer/erhvervsstrategi/'))
insert into public.report_metric_evidence_city(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select md5('dk_city_phase4:'||t.id||':employment_focus_sectors')::uuid,t.id,'city',t.id::text,'employment_focus_sectors',jsonb_build_object('basis',v.basis,'sectors',v.sectors,'indicative',true,'not_shortage_ranking',true),v.source,v.url,'2026-08-10',now(),'medium','observed','verified',now(),now()
from t join v using(slug)
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status='verified',updated_at=now();

do $$ declare n integer; bad integer; begin
  select count(*) into n from public.report_metric_evidence_city r join core.geographies g on g.id=r.geography_id where g.country_code='DK' and g.metadata->>'publication_tier'='A' and r.review_status='verified' and r.metric_key in ('city_population','student_living_cost_monthly_range','student_transport_reference','student_work_hours_week','employment_focus_sectors');
  if n<>25 then raise exception 'DK Tier A metrics expected 25, found %',n; end if;
  select count(*) into bad from (select g.id from core.geographies g left join public.report_metric_evidence_city r on r.geography_id=g.id and r.review_status='verified' and r.metric_key in ('city_population','student_living_cost_monthly_range','student_transport_reference','student_work_hours_week','employment_focus_sectors') where g.country_code='DK' and g.metadata->>'publication_tier'='A' group by g.id having count(r.metric_key)<>5) q;
  if bad<>0 then raise exception 'Each DK Tier A city must have five verified metrics'; end if;
end $$;