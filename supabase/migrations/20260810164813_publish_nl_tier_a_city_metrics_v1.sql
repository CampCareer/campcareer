-- Netherlands Cities Phase 4: publish the same five verified decision metrics for the five Tier A municipalities.
-- Source-native living-cost and transport methodologies are preserved rather than forced into false comparability.

with t as (
  select id,slug,name from core.geographies
  where country_code='NL' and geography_type='city' and canonical_geography_id is null
    and status='active' and metadata->>'publication_tier'='A'
), v(slug,amount,code) as (values
  ('amsterdam',941927::numeric,'GM0363'),
  ('maastricht',126026,'GM0935'),
  ('rotterdam',673804,'GM0599'),
  ('groningen',244427,'GM0014'),
  ('eindhoven',249783,'GM0772')
)
insert into public.report_metric_evidence_city
(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select md5('nl_city_phase4:'||t.id::text||':city_population')::uuid,t.id,'city',t.id::text,'city_population',
  jsonb_build_object('amount',v.amount,'geography',t.name||' municipality','geography_kind','cbs_municipality','municipality_code',v.code,'estimate_kind','population_on_1_january','estimate_date','2026-01-01'),
  'Statistics Netherlands (CBS) — Gebieden in Nederland 2026','https://www.cbs.nl/nl-nl/cijfers/detail/86247NED','2026-01-01',now(),'high','observed','verified',now(),now()
from t join v using(slug)
on conflict(geography_id,metric_key) do update set
  value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,
  last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status=excluded.review_status,updated_at=now();

with t as (
  select id,slug from core.geographies where country_code='NL' and status='active' and metadata->>'publication_tier'='A'
), v(slug,lo,hi,scenario,source,url,confidence,evidence,reference_scope) as (values
  ('amsterdam',975::numeric,1500::numeric,'UvA international-student living expenses including rent; tuition excluded','University of Amsterdam — Living expenses and money matters','https://www.uva.nl/en/education/practical-information/living-in-amsterdam/living-expenses/living-expenses-uva.html','high','observed','city_university_reference'),
  ('maastricht',1550,1550,'UM 2026/27 Brightlands scholarship living-expense budget, normalized from 13-month total; indicative proxy','Maastricht University — UM Brightlands Talent Scholarship','https://www.maastrichtuniversity.nl/studeren/toelating-inschrijving/financing-your-studies/scholarships/um-brightlands-talent','medium','calculated','city_university_budget_proxy'),
  ('rotterdam',1390,1390,'Erasmus University College 2026/27 housing, insurance and daily-expense budget; tuition and study materials excluded','Erasmus University Rotterdam — Erasmus University College costs','https://www.eur.nl/en/euc/application-admissions/costs','medium','calculated','city_university_budget_proxy'),
  ('groningen',1000,1100,'University of Groningen current international-student average monthly living cost; tuition excluded','University of Groningen — International portal FAQ','https://www.rug.nl/fse/education/choose-your-study/international-portal/get-to-know-us/faq?lang=en','high','observed','city_university_reference'),
  ('eindhoven',1000,1500,'National student monthly spending range retained as an explicit baseline because a complete current TU/e city-specific total was not verified','Study in NL — Daily student expenses and cost of living in the Netherlands','https://www.studyinnl.org/finances/daily-student-expenses-and-cost-of-living-in-the-netherlands','medium','observed','national_baseline')
)
insert into public.report_metric_evidence_city
(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select md5('nl_city_phase4:'||t.id::text||':student_living_cost_monthly_range')::uuid,t.id,'city',t.id::text,'student_living_cost_monthly_range',
  jsonb_build_object('low',v.lo,'high',v.hi,'currency','EUR','period','month','scenario',v.scenario,'reference_scope',v.reference_scope,'city_specific',v.reference_scope<>'national_baseline','indicative',true),
  v.source,v.url,'2026-08-10',now(),v.confidence,v.evidence,'verified',now(),now()
from t join v using(slug)
on conflict(geography_id,metric_key) do update set
  value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,
  last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status=excluded.review_status,updated_at=now();

with t as (
  select id,slug from core.geographies where country_code='NL' and status='active' and metadata->>'publication_tier'='A'
), v(slug,amount,period,kind,note,source,url) as (values
  ('amsterdam',3.40::numeric,'1_hour','gvb_1_hour','2026 standard GVB one-hour fare; general reference','GVB — GVB 1 hour','https://gvb.nl/en/en/travel-products/hour-and-day-tickets/gvb-1-hour-ticket'),
  ('maastricht',10.00,'month','arriva_limburg_offpeak','Monthly product price; 40% off-peak discount on Arriva services in Limburg','Arriva — Dal Korting Limburg','https://shop.arriva.nl/arriva-webshop/limburg/dal-korting-limburg/'),
  ('rotterdam',5.50,'2_hours','ret_2_hour','2026 RET two-hour fare; general reference','Rotterdam Tourist Information — public transport fares 2026','https://www.rotterdam.info/en/visit/good-to-know/travelling-in-rotterdam'),
  ('groningen',5.00,'month','arriva_noord_offpeak','Monthly product price; 40% off-peak discount on participating northern services','Arriva — Dal Korting Noord','https://shop.arriva.nl/arriva-webshop/noord/dal-korting-noord/'),
  ('eindhoven',5.15,'single_bus_trip','bravo_single_ride','2026 Bravo one-trip fare on Arriva and Hermes buses in Brabant','Bravo — Ritkaart','https://www.bravo.info/vervoerbewijzen/losse-kaartjes/ritkaart')
)
insert into public.report_metric_evidence_city
(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select md5('nl_city_phase4:'||t.id::text||':student_transport_reference')::uuid,t.id,'city',t.id::text,'student_transport_reference',
  jsonb_build_object('amount',v.amount,'period',v.period,'currency','EUR','reference_kind',v.kind,'student_specific',false,'source_native_period',true,'note',v.note),
  v.source,v.url,'2026-08-10',now(),'high','observed','verified',now(),now()
from t join v using(slug)
on conflict(geography_id,metric_key) do update set
  value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,
  last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status=excluded.review_status,updated_at=now();

with t as (
  select id from core.geographies where country_code='NL' and status='active' and metadata->>'publication_tier'='A'
)
insert into public.report_metric_evidence_city
(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select md5('nl_city_phase4:'||t.id::text||':student_work_hours_week')::uuid,t.id,'city',t.id::text,'student_work_hours_week',
  jsonb_build_object('hours_term_time',16,'period','week','context','study_residence_permit_employee','full_time_months',jsonb_build_array('June','July','August'),'employer_work_permit_required',true,'choice_required',true,'national_rule',true,'self_employment_rule_separate',true,'note','Employee work uses either the weekly limit or full-time work in June, July and August; employer permit required. Other residence or nationality rules may differ.'),
  'Immigration and Naturalisation Service (IND) — Student residence permit for university or HBO',
  'https://ind.nl/en/residence-permits/study/student-residence-permit-for-university-or-higher-professional-education',
  '2026-06-08',now(),'high','observed','verified',now(),now()
from t
on conflict(geography_id,metric_key) do update set
  value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,
  last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status=excluded.review_status,updated_at=now();

with t as (
  select id,slug from core.geographies where country_code='NL' and status='active' and metadata->>'publication_tier'='A'
), v(slug,basis,sectors,source,url) as (values
  ('amsterdam','Municipal economy and sector datasets','["ICT and digitalisation","Financial services","Creative industries","Retail","Hospitality and tourism"]'::jsonb,'City of Amsterdam — Economy and sector datasets','https://onderzoek.amsterdam.nl/dataset/economie-en-sectoren'),
  ('maastricht','Municipal Economic Vision 2040','["Health and preventive healthcare","Knowledge economy and education","Business services","Retail and hospitality","Manufacturing","Culture and creative industries"]'::jsonb,'Municipality of Maastricht — Economic Vision 2040','https://www.maastrichtbeleid.nl/beleidsinformatie/Beleidsinformatie/2025/Economische%20Visie'),
  ('rotterdam','Municipal 2026 economic-development focus','["Port and maritime economy","Energy transition and hydrogen","Life Sciences and Health","Circular economy","Digitalisation and innovative manufacturing"]'::jsonb,'Municipality of Rotterdam — Excellent business climate, Budget 2026','https://www.watdoetdegemeente.rotterdam.nl/begroting-2026/programmas/economische-ontwikkeling/doel-excellent-ondernemersklimaat/'),
  ('groningen','Municipal economic profile and knowledge ecosystem','["Knowledge and education","Energy transition","Health and healthy ageing","Digital economy and ICT","Food and agriculture"]'::jsonb,'Municipality of Groningen — Economic profile and policy','https://gemeente.groningen.nl/economisch-profiel-en-beleid'),
  ('eindhoven','Municipal Brainport knowledge and manufacturing context','["High-tech manufacturing","Semiconductors and microchips","Knowledge industry and R&D","Advanced supply-chain manufacturing","Technology education"]'::jsonb,'Municipality of Eindhoven — Eindhoven as an economic global player','https://www.eindhoven.nl/stad-en-wonen/stad/erfgoed/de-geschiedenis-van-eindhoven/eindhoven-als-economische-wereldspeler')
)
insert into public.report_metric_evidence_city
(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select md5('nl_city_phase4:'||t.id::text||':employment_focus_sectors')::uuid,t.id,'city',t.id::text,'employment_focus_sectors',
  jsonb_build_object('basis',v.basis,'sectors',v.sectors,'indicative',true,'not_shortage_ranking',true),
  v.source,v.url,'2026-08-10',now(),'medium','observed','verified',now(),now()
from t join v using(slug)
on conflict(geography_id,metric_key) do update set
  value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,
  last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status=excluded.review_status,updated_at=now();

do $$
declare total_n integer; bad_city_n integer;
begin
  select count(*) into total_n
  from public.report_metric_evidence_city r
  join core.geographies g on g.id=r.geography_id
  where g.country_code='NL' and g.metadata->>'publication_tier'='A' and r.review_status='verified'
    and r.metric_key in ('city_population','student_living_cost_monthly_range','student_transport_reference','student_work_hours_week','employment_focus_sectors');
  if total_n<>25 then raise exception 'NL Tier A metrics expected 25 verified rows, found %',total_n; end if;

  select count(*) into bad_city_n from (
    select g.id
    from core.geographies g
    left join public.report_metric_evidence_city r
      on r.geography_id=g.id and r.review_status='verified'
     and r.metric_key in ('city_population','student_living_cost_monthly_range','student_transport_reference','student_work_hours_week','employment_focus_sectors')
    where g.country_code='NL' and g.metadata->>'publication_tier'='A'
    group by g.id
    having count(r.metric_key)<>5
  ) q;
  if bad_city_n<>0 then raise exception 'Each NL Tier A city must have five verified metrics'; end if;
end $$;
