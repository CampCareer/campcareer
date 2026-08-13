-- South Korea Cities Phase 4: exactly five verified decision-support metrics for each of six Tier A administrative cities.

with t as (
  select id,slug,name,code from core.geographies where country_code='KR' and metadata->>'publication_tier'='A' and canonical_geography_id is null
), v(slug,amount,official_name) as (values
 ('seoul',9289813::numeric,'서울특별시'),('busan',3232370,'부산광역시'),('daejeon',1442034,'대전광역시'),
 ('suwon',1185770,'경기도 수원시'),('yongin',1090211,'경기도 용인시'),('pohang',487008,'경상북도 포항시')
)
insert into public.report_metric_evidence_city(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select md5('kr_city_phase4:'||t.id||':city_population')::uuid,t.id,'city',t.id::text,'city_population',
 jsonb_build_object('amount',v.amount,'unit','people','geography',v.official_name,'geography_kind','mois_resident_registration_admin_area','admin_code',t.code,
 'estimate_kind','official_resident_registration_population','estimate_date','2026-06-30','foreigners_included',false),
 'MOIS — Resident Registration Population Statistics','https://jumin.mois.go.kr/statMonth.do','2026-06-30',now(),'high','observed','verified',now(),now()
from t join v using(slug)
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status='verified',updated_at=now();

with t as (
 select id from core.geographies where country_code='KR' and metadata->>'publication_tier'='A' and canonical_geography_id is null
)
insert into public.report_metric_evidence_city(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select md5('kr_city_phase4:'||t.id||':student_living_cost_monthly_range')::uuid,t.id,'city',t.id::text,'student_living_cost_monthly_range',
 jsonb_build_object('low',750000,'high',1000000,'currency','KRW','period','month','reference_kind','national_student_living_cost_planning_range','city_specific',false,
 'full_budget',true,'indicative',true,'regional_price_variation',true,'ranking_safe',false,
 'note','Study in Korea publishes an approximate national monthly planning range. Prices may vary by region and housing choice. This value is a non-ranking baseline and does not establish equal costs across the six cities.'),
 'Study in Korea / NIIED — Living Costs and Expenses','https://www.studyinkorea.go.kr/en_US/life/livingExpense.do','2026-08-11',now(),'medium','observed','verified',now(),now()
from t
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status='verified',updated_at=now();

with t as (
 select id,slug from core.geographies where country_code='KR' and metadata->>'publication_tier'='A' and canonical_geography_id is null
), v(slug,amount,kind,mode,student_specific,data_date,note,source,url) as (values
 ('seoul',1550::numeric,'adult_transit_card_base_fare','subway',false,'2025-06-28'::date,'Adult subway base fare using a transit card. Stored as a source-native single-ride reference, not a monthly student fare.','Seoul Metropolitan Government — Subway fares','https://english.seoul.go.kr/policy/transportation/modes-of-transport/subway/'),
 ('busan',1550,'adult_transit_card_base_fare','city_bus',false,'2023-10-06','Adult city-bus transportation-card fare. Stored source-native.','Busan Metropolitan City — Public transportation fares','https://www.busan.go.kr/eng/public-transportation'),
 ('daejeon',1500,'adult_transit_card_base_fare','city_bus',false,'2026-08-11','Current general city-bus transportation-card fare shown by Daejeon. Stored source-native.','Daejeon Metropolitan City — Major public utility rates','https://daejeon.go.kr/drh/DrhContentsHtmlView.do?menuSeq=3308'),
 ('suwon',1650,'adult_transit_card_base_fare','city_bus',false,'2025-10-25','Adult general city/local-bus transportation-card fare effective from 25 October 2025.','Suwon Special City — Bus fare adjustment','https://www.suwon.go.kr/web/board/BD_board.view.do?bbsCd=1043&seq=20251013104218481'),
 ('yongin',1650,'adult_transit_card_base_fare','demand_responsive_bus',false,'2026-03-03','Yongin Ddokbus base fare paid by linked transportation card. Stored as a current source-native local public-transport reference.','Yongin Special City — Ddokbus service','https://www.yongin.go.kr/user/bbs/BD_selectBbs.do?q_bbsCode=1020&q_bbscttSn=20260303092649231'),
 ('pohang',1200,'adult_transit_card_base_fare','city_bus',false,'2026-08-11','Published adult bus fare is KRW 1,300 with a KRW 100 transportation-card discount, yielding KRW 1,200. Stored source-native.','Pohang City — Bus fare information','https://cn.pohang.go.kr/dept/contents.do?mid=0505020100')
)
insert into public.report_metric_evidence_city(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select md5('kr_city_phase4:'||t.id||':student_transport_reference')::uuid,t.id,'city',t.id::text,'student_transport_reference',
 jsonb_build_object('amount',v.amount,'currency','KRW','period','single_base_ride','reference_kind',v.kind,'mode',v.mode,'student_specific',v.student_specific,'source_native_period',true,'note',v.note),
 v.source,v.url,v.data_date,now(),'high','observed','verified',now(),now()
from t join v using(slug)
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status='verified',updated_at=now();

with t as (
 select id from core.geographies where country_code='KR' and metadata->>'publication_tier'='A' and canonical_geography_id is null
)
insert into public.report_metric_evidence_city(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select md5('kr_city_phase4:'||t.id||':student_work_hours_week')::uuid,t.id,'city',t.id::text,'student_work_hours_week',
 jsonb_build_object('hours_normal_period',30,'period','week','national_rule',true,'city_specific',false,'conditional_permission_required',true,'korean_proficiency_required',true,
 'graduate_reference_hours',35,'note','Thirty hours is a national reference ceiling used for the city profile, not an automatic entitlement. Detailed permitted hours vary by programme level, year, Korean proficiency, accredited-university/academic status and immigration permission; graduate reference conditions can reach 35 hours.'),
 'Study in Korea / NIIED — Part-time employment rules','https://studyinkorea.go.kr/ko/life/residenceAndStayInfo.do?tab=part-time-job','2026-08-11',now(),'high','observed','verified',now(),now()
from t
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status='verified',updated_at=now();

with t as (
 select id,slug from core.geographies where country_code='KR' and metadata->>'publication_tier'='A' and canonical_geography_id is null
), v(slug,basis,sectors,source,url) as (values
 ('seoul','Seoul 2026 strategic R&D and emerging-industry framework','["Artificial intelligence","Biotechnology and medicine","Quantum technology","Robotics","Fintech","Creative industries"]'::jsonb,'Seoul Metropolitan Government — Seoul-style R&D strategic industries','https://english.seoul.go.kr/seoul-to-invest-krw-42-5b-in-ai-led-seoul-style-rd-the-largest-in-five-years/'),
 ('busan','Busan nine strategic industries','["Digital technology","Future mobility","Energy technology","Convergence components and materials","Biohealth","Lifestyle","Culture and tourism","Marine","Finance"]'::jsonb,'Busan Metropolitan City — Nine strategic industries','https://www.busan.go.kr/depart/ecnmcompanypolicy'),
 ('daejeon','Daejeon ABCD+QR strategic-industry framework','["Aerospace","Bio","Chips","Defense","Quantum","Robot"]'::jsonb,'Daejeon Metropolitan City — 2026 SME support direction','https://daejeon.go.kr/drh/DrhContentsHtmlView.do?menuSeq=7889'),
 ('suwon','Suwon advanced-industry R&D / Topdong Innovation Valley framework','["Semiconductors","Information technology","Artificial intelligence and software","Biotechnology and medical","Internet of Things and robotics","Future mobility and energy"]'::jsonb,'Suwon Special City — Topdong Innovation Valley advanced industries','https://www.suwon.go.kr/web/board/BD_board.view.do?bbsCd=1043&seq=20260319164220126'),
 ('yongin','Yongin semiconductor ecosystem and industrial-land strategy','["Semiconductors","Semiconductor materials, parts and equipment","Fabless and chip design"]'::jsonb,'Yongin Special City — Semiconductor ecosystem industrial strategy','https://www.yongin.go.kr/user/bbs/BD_selectBbs.do?q_bbsCode=1020&q_bbscttSn=20260223110338652'),
 ('pohang','Pohang 2026 major strategic projects','["Steel and advanced materials","Secondary batteries","Artificial intelligence","Quantum technology","Biomedical and green bio","Hydrogen and clean energy"]'::jsonb,'Pohang City — Major projects and strategic industries','https://bis.pohang.go.kr/portal/contents.do?mid=0407020000')
)
insert into public.report_metric_evidence_city(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select md5('kr_city_phase4:'||t.id||':employment_focus_sectors')::uuid,t.id,'city',t.id::text,'employment_focus_sectors',
 jsonb_build_object('basis',v.basis,'sectors',v.sectors,'indicative',true,'not_shortage_ranking',true,'not_job_guarantee',true,
 'note','Official local economic-development context only. Sector lists are not directly comparable city rankings and do not imply individual job availability.'),
 v.source,v.url,'2026-08-11',now(),'medium','observed','verified',now(),now()
from t join v using(slug)
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status='verified',updated_at=now();

create or replace view public.city_metric_directory_kr_v1 with (security_invoker=true) as
select g.id city_id,g.slug city_slug,g.name city_name,r.metric_key,r.value,r.source_name,r.source_url,r.data_as_of,r.confidence,r.evidence_kind
from core.geographies g join public.report_metric_evidence_city r on r.geography_id=g.id and r.scope_type='city' and r.review_status='verified'
where g.country_code='KR' and g.metadata->>'publication_tier'='A'
 and r.metric_key in ('city_population','student_living_cost_monthly_range','student_transport_reference','student_work_hours_week','employment_focus_sectors');

revoke all on public.city_metric_directory_kr_v1 from public,anon,authenticated;
grant select on public.city_metric_directory_kr_v1 to service_role;

do $$
declare metric_n integer; city_n integer; bad_city integer; bad_living integer; bad_work integer; bad_sector integer;
begin
 select count(*) into metric_n from public.city_metric_directory_kr_v1;
 if metric_n<>30 then raise exception 'KR Phase 4 expected 30 verified metric rows, found %',metric_n; end if;
 select count(distinct city_id) into city_n from public.city_metric_directory_kr_v1;
 if city_n<>6 then raise exception 'KR Phase 4 expected metrics for six cities, found %',city_n; end if;
 select count(*) into bad_city from (select city_id,count(*) n from public.city_metric_directory_kr_v1 group by city_id having count(*)<>5) x;
 if bad_city<>0 then raise exception 'Every KR Tier A city must have exactly five metrics'; end if;
 select count(*) into bad_living from public.city_metric_directory_kr_v1 where metric_key='student_living_cost_monthly_range' and (coalesce((value->>'ranking_safe')::boolean,true) or coalesce((value->>'city_specific')::boolean,true));
 if bad_living<>0 then raise exception 'KR living-cost national baseline must remain non-ranking and non-city-specific'; end if;
 select count(*) into bad_work from public.city_metric_directory_kr_v1 where metric_key='student_work_hours_week' and (coalesce((value->>'national_rule')::boolean,false) is false or coalesce((value->>'city_specific')::boolean,true) is true);
 if bad_work<>0 then raise exception 'KR student-work context must remain national'; end if;
 select count(*) into bad_sector from public.city_metric_directory_kr_v1 where metric_key='employment_focus_sectors' and (coalesce((value->>'not_shortage_ranking')::boolean,false) is false or coalesce((value->>'not_job_guarantee')::boolean,false) is false);
 if bad_sector<>0 then raise exception 'KR employment sectors must not become shortage or job-guarantee claims'; end if;
end $$;
