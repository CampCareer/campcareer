-- Sweden Cities Phase 4: five verified decision metrics for each of the six Tier A municipalities.

with t as (select id,slug,name,metadata->>'scb_municipality_code' municipality_code from core.geographies where country_code='SE' and metadata->>'publication_tier'='A'),
v(slug,amount) as (values ('stockholm',999239::numeric),('gothenburg',613278),('uppsala',249726),('lund',132333),('linkoping',168714),('umea',135273))
insert into public.report_metric_evidence_city(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select md5('se_city_phase4:'||t.id||':city_population')::uuid,t.id,'city',t.id::text,'city_population',jsonb_build_object('amount',v.amount,'geography',t.name||' Municipality','geography_kind','scb_municipality','municipality_code',t.municipality_code,'estimate_kind','registered_population_year_end','estimate_date','2025-12-31'),'Statistics Sweden — Population by region, 2025','https://www.statistikdatabasen.scb.se/pxweb/en/ssd/START__BE__BE0101__BE0101A/BefolkningCKM/','2025-12-31',now(),'high','observed','verified',now(),now()
from t join v using(slug)
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status='verified',updated_at=now();

with t as (select id from core.geographies where country_code='SE' and metadata->>'publication_tier'='A')
insert into public.report_metric_evidence_city(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select md5('se_city_phase4:'||t.id||':student_living_cost_monthly_range')::uuid,t.id,'city',t.id::text,'student_living_cost_monthly_range',jsonb_build_object('low',10656,'high',10656,'currency','SEK','period','month','reference_scope','national_student_budget','city_specific',false,'indicative',true,'note','Official Study in Sweden monthly student budget baseline. It is retained equally across cities rather than presented as a city-specific cost ranking.'),'Study in Sweden — Fees & costs','https://studyinsweden.se/plan-your-studies/fees-costs/','2026-08-10',now(),'medium','calculated','verified',now(),now()
from t
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status='verified',updated_at=now();

with t as (select id,slug from core.geographies where country_code='SE' and metadata->>'publication_tier'='A'),
v(slug,amount,period,kind,note,source,url) as (values
 ('stockholm',43::numeric,'75_minutes','single_ticket_adult','General adult SL single-journey reference; discounted student eligibility is separate.','SL — Single journey tickets','https://sl.se/en/fares-and-tickets/visitor-tickets/single-journey-tickets'),
 ('gothenburg',38,'90_minutes','zone_a_single_ticket_adult','General adult Zone A reference for Gothenburg-area travel.','Västtrafik — Tap and travel in Zone A','https://www.vasttrafik.se/en/Tickets/more-about-tickets/Tap-payment/'),
 ('uppsala',40,'75_minutes','single_ticket_adult','Regular adult 75-minute UL reference; discounted student eligibility is separate.','UL — 2026 ticket prices','https://www.ul.se/sidfot/om-ul/aktuellt/nya-biljettpriser-fran-8-januari-2026/'),
 ('lund',327.5,'30_days','temporary_half_price_period_ticket','Current 2026 half-price 30-day small-zone/major-city ticket covering Lund; ordinary reference is SEK 655. Temporary subsidy applies in the second half of 2026.','Skånetrafiken — Half price on 30-day tickets','https://www.skanetrafiken.se/sok/?searchQuery=30-dagarsbiljetter'),
 ('linkoping',35,'60_minutes','city_zone_single_ticket_adult','General adult Linköping city-zone single ticket.','Östgötatrafiken — Single ticket','https://www.ostgotatrafiken.se/biljetter/biljetter-och-priser/enkelbiljett'),
 ('umea',31,'1_hour','prepurchased_single_ticket_adult','General adult pre-purchased Ultra single ticket; onboard price differs.','Ultra Umeå — Single tickets','https://www.tabussen.nu/en/ultra/tickets-and-prices/single-tickets/')
)
insert into public.report_metric_evidence_city(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select md5('se_city_phase4:'||t.id||':student_transport_reference')::uuid,t.id,'city',t.id::text,'student_transport_reference',jsonb_build_object('amount',v.amount,'currency','SEK','period',v.period,'reference_kind',v.kind,'student_specific',false,'source_native_period',true,'note',v.note),v.source,v.url,'2026-08-10',now(),'high','observed','verified',now(),now()
from t join v using(slug)
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status='verified',updated_at=now();

with t as (select id from core.geographies where country_code='SE' and metadata->>'publication_tier'='A')
insert into public.report_metric_evidence_city(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select md5('se_city_phase4:'||t.id||':student_work_hours_week')::uuid,t.id,'city',t.id::text,'student_work_hours_week',jsonb_build_object('hours_normal_period',15,'period','week','context','first_or_second_cycle_higher_education_residence_permit','effective_for_permit_granted_on_or_after','2026-06-11','unlimited_work_months',jsonb_build_array('June','July','August'),'national_rule',true,'note','For relevant bachelor/master residence permits granted on or after 11 June 2026: maximum 15 hours/week during semesters. June-August and listed study/research exceptions may exceed this. Earlier permits can follow transitional rules until a later decision.'),'Swedish Migration Agency — Higher education study permit work rules','https://www.migrationsverket.se/en/you-want-to-extend/study/higher-education.html','2026-08-10',now(),'high','observed','verified',now(),now()
from t
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status='verified',updated_at=now();

with t as (select id,slug from core.geographies where country_code='SE' and metadata->>'publication_tier'='A'),
v(slug,basis,sectors,source,url) as (values
 ('stockholm','Stockholm Business Region current ecosystem strengths','["Tech and digitalisation","Life science","Sustainable technology","Finance","Creative industries"]'::jsonb,'Stockholm Business Region — business and innovation','https://en.stockholmbusinessregion.se/'),
 ('gothenburg','Business Region Göteborg focus industries','["Automotive and mobility","Life science","Logistics","ICT and tech","Urban development"]'::jsonb,'Business Region Göteborg — Strong industries','https://www.businessregiongoteborg.se/analys-omvarld/branschfakta'),
 ('uppsala','Uppsala municipality growth-focus industries','["Life science","Digital development","Green development","Visitor economy"]'::jsonb,'Uppsala Municipality — Growth focus sectors','https://www.uppsala.se/foretag-och-naringsliv/traffar-och-natverk/uppsala-tillvaxtdag/'),
 ('lund','Lund/Skåne specialization and innovation context','["Tech","Life science and health","Food","Advanced materials and manufacturing","Smart sustainable cities"]'::jsonb,'City of Lund — Attractive Lund portfolio','https://lund.se/kommun-och-politik/projekt-och-samarbeten/utvecklingsprojekt/portfolj-attraktiva-lund'),
 ('linkoping','Linköping municipality strong industry context','["Aviation technology","Information and communications technology","Health and medical technology","Agrotech","Greentech"]'::jsonb,'Linköping Municipality — Local industry','https://datavisualisering.linkoping.se/en/business-linkoping/local-industry/the-groundbreaking-innovations/'),
 ('umea','Umeå municipality career-sector context','["Tech industry","Life science and biotech","Health","Creative and cultural","Startups"]'::jsonb,'Umeå Municipality — Work in Umeå','https://www.umea.se/flytta/english/movetoumea/workinumea.4.3062064417f8b7979381550.html')
)
insert into public.report_metric_evidence_city(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select md5('se_city_phase4:'||t.id||':employment_focus_sectors')::uuid,t.id,'city',t.id::text,'employment_focus_sectors',jsonb_build_object('basis',v.basis,'sectors',v.sectors,'indicative',true,'not_shortage_ranking',true,'note','Official local economic-development context; not a shortage ranking, job guarantee or occupation-level demand score.'),v.source,v.url,'2026-08-10',now(),'medium','observed','verified',now(),now()
from t join v using(slug)
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status='verified',updated_at=now();

do $$ declare n integer; bad integer; begin
  select count(*) into n from public.report_metric_evidence_city r join core.geographies g on g.id=r.geography_id where g.country_code='SE' and g.metadata->>'publication_tier'='A' and r.review_status='verified' and r.metric_key in ('city_population','student_living_cost_monthly_range','student_transport_reference','student_work_hours_week','employment_focus_sectors');
  if n<>30 then raise exception 'SE Tier A metrics expected 30, found %',n; end if;
  select count(*) into bad from (select g.id from core.geographies g left join public.report_metric_evidence_city r on r.geography_id=g.id and r.review_status='verified' and r.metric_key in ('city_population','student_living_cost_monthly_range','student_transport_reference','student_work_hours_week','employment_focus_sectors') where g.country_code='SE' and g.metadata->>'publication_tier'='A' group by g.id having count(r.metric_key)<>5) q;
  if bad<>0 then raise exception 'Each SE Tier A city must have five verified metrics'; end if;
end $$;