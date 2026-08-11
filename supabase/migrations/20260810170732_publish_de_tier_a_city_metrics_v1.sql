-- Germany Cities Phase 4: publish five source-backed decision metrics for the nine Tier A municipalities.
-- Population uses the Phase 2 Destatis/GV-ISys municipality contract. Cost/transport values preserve source-native methodology.

with t as (
  select id,slug from core.geographies
  where country_code='DE' and geography_type='city' and canonical_geography_id is null
    and status='active' and metadata->>'publication_tier'='A'
), v(slug,amount,ags,label,url) as (values
  ('berlin',3685265::numeric,'11000000','Berlin, Stadt','https://www.statistikportal.de/de/gemeindeverzeichnis/11000000'),
  ('munich',1505005,'09162000','München, Landeshauptstadt','https://www.statistikportal.de/de/gemeindeverzeichnis/09162000'),
  ('hamburg',1862565,'02000000','Hamburg, Freie und Hansestadt','https://www.statistikportal.de/de/gemeindeverzeichnis/02000000'),
  ('aachen',262670,'05334002','Aachen, Stadt','https://www.statistikportal.de/de/gemeindeverzeichnis/05334002'),
  ('bonn',323336,'05314000','Bonn, Stadt','https://www.statistikportal.de/de/gemeindeverzeichnis/05314000'),
  ('dresden',564904,'14612000','Dresden, Stadt','https://www.statistikportal.de/de/gemeindeverzeichnis/14612000'),
  ('heidelberg',155756,'08221000','Heidelberg, Stadt','https://www.statistikportal.de/de/gemeindeverzeichnis/08221000'),
  ('karlsruhe',309050,'08212000','Karlsruhe, Stadt','https://www.statistikportal.de/de/gemeindeverzeichnis/08212000'),
  ('tuebingen',92322,'08416041','Tübingen, Universitätsstadt','https://www.statistikportal.de/de/gemeindeverzeichnis/08416041')
)
insert into public.report_metric_evidence_city
(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select gen_random_uuid(),t.id,'city',t.id::text,'city_population',
  jsonb_build_object('amount',v.amount,'geography',v.label,'geography_kind','destatis_gvisys_municipality','ags',v.ags,'reference_date','2024-12-31','statistical_population',true,'municipal_register_comparison_not_used',true),
  'Statistische Ämter des Bundes und der Länder — GV-ISys',v.url,'2024-12-31',now(),'high','observed','verified',now(),now()
from v join t using(slug)
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence='high',evidence_kind='observed',review_status='verified',updated_at=now();

with t as (
  select id,slug from core.geographies where country_code='DE' and geography_type='city' and canonical_geography_id is null and status='active' and metadata->>'publication_tier'='A'
), v(slug,lo,hi,kind,note,source,url) as (values
  ('berlin',900::numeric,1150::numeric,'range','TU Berlin IMES recommended monthly living-cost range for Berlin; programme-specific guidance used as a city student budget reference.','TU Berlin — IMES Double Degree Students','https://www.tu.berlin/en/eim/msc-imes/overview/double-degree-students'),
  ('munich',1500,1500,'point_estimate','LMU recommends budgeting about EUR 1,500 per month in Munich.','LMU Munich — Living costs','https://www.lmu.de/en/workspace-for-students/international-student-guide/living-costs/index.html'),
  ('hamburg',1000,1600,'range_open_high','University of Hamburg states a broad student budget of EUR 1,000–1,600 or more per month. High value is an indicative reference, not a hard cap.','University of Hamburg — MIBAS Costs and Funding','https://www.wiso.uni-hamburg.de/en/studienbuero-sozialoekonomie/studiengaenge/msc-mibas/costs-and-funding.html'),
  ('aachen',1100,1100,'minimum_reference','RWTH advises international students to plan at least about EUR 1,100 per month for studying/living costs in Aachen.','RWTH Aachen University — Costs','https://www.rwth-aachen.de/cms/root/studium/vor-dem-studium/internationale-studieninteressierte/organisation-des-studienaufenthaltes/internationale-studierende/~bqmo/kosten/'),
  ('bonn',1000,1000,'point_estimate','University of Bonn states student living expenses are roughly EUR 1,000 per month.','University of Bonn — Costs and Financing for International Students','https://www.uni-bonn.de/en/studying/international-students/costs-and-financing-for-international-students/page'),
  ('dresden',750,900,'range','TU Dresden Hydro Science & Engineering describes typical monthly living expenses in Dresden as EUR 750–900.','TU Dresden — Hydro Science & Engineering','https://tu-dresden.de/bu/umwelt/hydro/studium/studienangebot/master/master_hse'),
  ('heidelberg',895,2013,'range','Heidelberg University publishes an approximate monthly range from EUR 895 to EUR 2,013 depending on lifestyle.','Heidelberg University — Study Financing for International Students','https://www.uni-heidelberg.de/en/study-financing-for-international-students'),
  ('karlsruhe',800,900,'range','KIT Mechanical Engineering states average student living costs in Karlsruhe around EUR 800–900 per month.','KIT — Mechanical Engineering student FAQ','https://www.mach.kit.edu/english/4714.php'),
  ('tuebingen',900,1200,'germany_average_local_guidance','University of Tübingen gives a current Germany-average student budget of EUR 900–1,200 and separately warns that Tübingen housing is expensive; this is not a Tübingen market-cost survey.','University of Tübingen — Application and preparation','https://uni-tuebingen.de/en/113870')
)
insert into public.report_metric_evidence_city
(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select gen_random_uuid(),t.id,'city',t.id::text,'student_living_cost_monthly_range',
  jsonb_build_object('low',v.lo,'high',v.hi,'period','month','currency','EUR','reference_kind',v.kind,'note',v.note,'indicative',true,'methodology_varies_by_city',true),
  v.source,v.url,'2026-08-10',now(),case when t.slug='tuebingen' then 'low' else 'medium' end,'observed','verified',now(),now()
from v join t using(slug)
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence=excluded.confidence,evidence_kind='observed',review_status='verified',updated_at=now();

with t as (
  select id,slug from core.geographies where country_code='DE' and geography_type='city' and canonical_geography_id is null and status='active' and metadata->>'publication_tier'='A'
), v(slug,amount,lo,hi,period,kind,note,source,url) as (values
  ('berlin',226.80::numeric,null::numeric,null::numeric,'semester','deutschlandsemesterticket','WS 2026/27 solidarity ticket; EUR 37.80/month equivalent, EUR 226.80 per six-month semester.','AStA TU Berlin — Deutschlandsemesterticket WS 2026/27','https://asta.tu-berlin.de/artikel/die-befragung-zum-deutschlandweiten-semesterticket-fuer-das-wintersemester-2026-27-04-05-08-05-2026-auf-isis/'),
  ('munich',43,null,null,'month','student_deutschlandticket','LMU current student budget page lists the Deutschlandticket für Studierende at EUR 43/month. Eligibility and current transport-provider terms apply.','LMU Munich — Living costs','https://www.lmu.de/en/workspace-for-students/international-student-guide/living-costs/index.html'),
  ('hamburg',226.80,null,null,'semester','deutschlandsemesterticket','WS 2026/27 semester public transport pass component; total semester contribution is EUR 402.','University of Hamburg — Semester contribution','https://www.uni-hamburg.de/en/campuscenter/studienorganisation/studienverlauf/beitraege-gebuehren/semesterbeitrag/'),
  ('aachen',226.80,null,null,'semester','deutschlandsemesterticket','WS 2026/27 German semester ticket; separate Zuid-Limburg add-on EUR 7.77; total mobility contribution EUR 234.57.','AStA RWTH Aachen — Finance and semester contribution','https://www.asta.rwth-aachen.de/en/about-us/finance/'),
  ('bonn',226.80,null,null,'semester','deutschlandsemesterticket','WS 2026/27 Deutschlandsemesterticket component of the University of Bonn semester fee.','University of Bonn — Costs','https://www.uni-bonn.de/en/studying/application-admission-and-enrollment/costs'),
  ('dresden',226.80,null,null,'semester','deutschlandsemesterticket','WS 2026/27 Deutschlandsemesterticket; total semester contribution EUR 361.00.','StuRa TU Dresden — Semester contribution','https://www.stura.tu-dresden.de/semesterbeitrag'),
  ('heidelberg',null,45,63,'month','public_transport_budget_range','Heidelberg University current monthly public-transport budget range; regular Deutschlandticket is EUR 63/month and lower eligible student/youth options may apply.','Heidelberg University — Study Financing for International Students','https://www.uni-heidelberg.de/en/study-financing-for-international-students'),
  ('karlsruhe',45,null,null,'month','d_ticket_jugendbw_student','KVV D-Ticket JugendBW for eligible students under 27 is EUR 45/month in 2026. KVV states no Karlsruhe higher-education agreement exists for a Deutschlandsemesterticket; the previous Studikarte ended 31 July 2026.','Karlsruher Verkehrsverbund — D-Ticket JugendBW','https://www.kvv.de/fahrkarten/fahrkarten-preise/schueler-studentinnen/d-ticket-jugendbw.html'),
  ('tuebingen',45,null,null,'month','d_ticket_jugendbw_student','naldo D-Ticket JugendBW is EUR 45/month for eligible students in 2026; naldo also lists a EUR 161.10 semester ticket as an alternative.','Verkehrsverbund naldo — Student tickets','https://www.naldo.de/tickets/studierende/')
)
insert into public.report_metric_evidence_city
(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select gen_random_uuid(),t.id,'city',t.id::text,'student_transport_reference',
  jsonb_strip_nulls(jsonb_build_object('amount',v.amount,'low',v.lo,'high',v.hi,'period',v.period,'currency','EUR','reference_kind',v.kind,'note',v.note,'eligibility_or_enrolment_conditions_apply',true,'source_native_period',true)),
  v.source,v.url,'2026-08-10',now(),'high','observed','verified',now(),now()
from v join t using(slug)
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence='high',evidence_kind='observed',review_status='verified',updated_at=now();

with t as (
  select id from core.geographies where country_code='DE' and geography_type='city' and canonical_geography_id is null and status='active' and metadata->>'publication_tier'='A'
)
insert into public.report_metric_evidence_city
(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select gen_random_uuid(),id,'city',id::text,'student_work_hours_week',
  jsonb_build_object('hours_term_time',20,'period','week','full_days_per_year',140,'half_days_per_year',280,'full_time_during_semester_breaks',true,'student_auxiliary_task_exception',true,'eligibility_conditions_apply',true,'national_rule',true,'residence_context','third_country_students','note','Third-country students may use the 140 full/280 half-day annual rule or work up to 20 hours/week during lecture periods; student auxiliary academic work is exempt from these restrictions.'),
  'Make it in Germany — Study and work','https://www.make-it-in-germany.com/en/study-vocational-training/studies-in-germany/work','2026-08-10',now(),'high','observed','verified',now(),now()
from t
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence='high',evidence_kind='observed',review_status='verified',updated_at=now();

with t as (
  select id,slug from core.geographies where country_code='DE' and geography_type='city' and canonical_geography_id is null and status='active' and metadata->>'publication_tier'='A'
), v(slug,basis,sectors,source,url,data_date) as (values
  ('berlin','Berlin Partner official industry sectors','["Healthcare and life sciences","DigiTech","Media and creative industries","Transport, mobility and logistics","Energy and environmental technology","Photonics and microelectronics","Manufacturing","Services"]'::jsonb,'Berlin Business Location Center — Industry information','https://www.businesslocationcenter.de/en/business-location/industry-information','2026-08-10'::date),
  ('munich','City of Munich business-development industry profile','["ICT","Automotive and mobility","Life sciences — biotech and pharma","Green economy","Finance","Creative industries"]'::jsonb,'City of Munich — Industries','https://stadt.muenchen.de/lhm-ms-wirtschaftsfoerderung-en/en/business-location/industries.html','2026-08-10'),
  ('hamburg','Hamburg Business official industry mix and technology strengths','["Logistics","Industry and aviation","IT and ICT","Media and creative industries","Medical, pharmaceutical and biotechnology","Life sciences","Renewable energy","Mobility and marine technology"]'::jsonb,'Hamburg Business — Top facts Hamburg','https://hamburg-business.com/en/why-hamburg/top-facts-hamburg','2026-08-10'),
  ('aachen','City of Aachen future-sector and regional-development profile','["Energy","Artificial intelligence and digital","Automotive and mobility","Semiconductor technology","Circular economy","High-tech research and startups","Sustainable industry"]'::jsonb,'City of Aachen — Regional development','https://www.aachen.de/wirtschaft-wissenschaft/grenzueberschreitende-zusammenarbeit-und-regionalentwicklung/regionalentwicklung/','2026-08-10'),
  ('bonn','City of Bonn annual economic report key sectors','["Information and telecommunications technology","IT security","Healthcare","Science and research","Knowledge-intensive services"]'::jsonb,'City of Bonn — Annual Economic Report 2024 location marketing','https://www.bonn.de/themen-entdecken/wirtschaft-wissenschaft/jahreswirtschaftsbericht-2024/standortentwicklung/standortmarketing.php','2024-12-31'),
  ('dresden','City of Dresden strong-industry profile','["Microelectronics and semiconductors","Nanotechnology","Robotics","Internet of Things and cloud","Artificial intelligence and 6G","Life sciences","Sustainability technologies"]'::jsonb,'City of Dresden — Tomorrow’s Home','https://www.dresden.de/de/wirtschaft/tomorrowshome.php','2025-05-21'),
  ('heidelberg','City of Heidelberg employment by economic sector, current city statistics','["Healthcare and social work","Professional, scientific and technical services","Education","Information and communication","Manufacturing"]'::jsonb,'City of Heidelberg — Economic data','https://www.heidelberg.de/hd%2CLde/HD/Arbeiten%2Bin%2BHeidelberg/Wirtschaftsdaten.html','2025-06-30'),
  ('karlsruhe','City of Karlsruhe official networks and clusters','["Information and communication technology","Automotive and mobility","Energy","Culture and creative industries","Research and development"]'::jsonb,'City of Karlsruhe — Networks and clusters','https://www.karlsruhe.de/wirtschaft-wissenschaft/wirtschaftsstandort/netzwerke-cluster','2026-08-10'),
  ('tuebingen','City of Tübingen business-location and science profile','["Medical technology","Biotechnology","Artificial intelligence and research","Mechanical engineering and toolmaking","Industrial production","Public research and healthcare"]'::jsonb,'City of Tübingen — Business location','https://www.tuebingen.de/28547.html','2026-08-10')
)
insert into public.report_metric_evidence_city
(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select gen_random_uuid(),t.id,'city',t.id::text,'employment_focus_sectors',
  jsonb_build_object('basis',v.basis,'sectors',v.sectors,'indicative',true,'not_shortage_ranking',true,'not_job_guarantee',true),
  v.source,v.url,v.data_date,now(),'medium','observed','verified',now(),now()
from v join t using(slug)
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence='medium',evidence_kind='observed',review_status='verified',updated_at=now();

do $$
declare total_n integer; bad_city_n integer; bad_population_n integer; bad_work_n integer; bad_sector_n integer; programme_n integer;
begin
  select count(*) into total_n from public.report_metric_evidence_city r join core.geographies g on g.id=r.geography_id
  where g.country_code='DE' and g.metadata->>'publication_tier'='A' and r.review_status='verified'
    and r.metric_key in ('city_population','student_living_cost_monthly_range','student_transport_reference','student_work_hours_week','employment_focus_sectors');
  if total_n<>45 then raise exception 'DE Tier A metrics expected 45 verified rows, found %',total_n; end if;

  select count(*) into bad_city_n from (
    select g.id from core.geographies g left join public.report_metric_evidence_city r on r.geography_id=g.id and r.review_status='verified'
      and r.metric_key in ('city_population','student_living_cost_monthly_range','student_transport_reference','student_work_hours_week','employment_focus_sectors')
    where g.country_code='DE' and g.metadata->>'publication_tier'='A' group by g.id having count(r.metric_key)<>5
  ) q;
  if bad_city_n<>0 then raise exception 'Every DE Tier A city must have exactly five verified metrics'; end if;

  select count(*) into bad_population_n from public.report_metric_evidence_city r join core.geographies g on g.id=r.geography_id
  where g.country_code='DE' and g.metadata->>'publication_tier'='A' and r.metric_key='city_population'
    and (r.value->>'geography_kind' <> 'destatis_gvisys_municipality' or r.value->>'ags' <> g.metadata->>'official_municipality_code_ags');
  if bad_population_n<>0 then raise exception 'DE population geography contract failed for % row(s)',bad_population_n; end if;

  select count(*) into bad_work_n from public.report_metric_evidence_city r join core.geographies g on g.id=r.geography_id
  where g.country_code='DE' and g.metadata->>'publication_tier'='A' and r.metric_key='student_work_hours_week' and coalesce((r.value->>'national_rule')::boolean,false) is not true;
  if bad_work_n<>0 then raise exception 'DE student work rule must be explicitly national'; end if;

  select count(*) into bad_sector_n from public.report_metric_evidence_city r join core.geographies g on g.id=r.geography_id
  where g.country_code='DE' and g.metadata->>'publication_tier'='A' and r.metric_key='employment_focus_sectors' and coalesce((r.value->>'not_shortage_ranking')::boolean,false) is not true;
  if bad_sector_n<>0 then raise exception 'DE employment sectors must not be presented as shortage rankings'; end if;

  select count(*) into programme_n from public.city_programme_directory_de_v1;
  if programme_n<>0 then raise exception 'DE Phase 4 must not infer programme delivery; found % city programme rows',programme_n; end if;
end $$;
