-- Belgium Cities Phase 4: five verified decision metrics for the six Tier A study destinations.
-- The statements are idempotent; production was verified before this migration-history checkpoint was recorded.
with t as (select id,slug from core.geographies where country_code='BE' and status='active' and metadata->>'publication_tier'='A'),
v(slug,amount,label,kind,refnis,source,url) as (values
('brussels',1255834::numeric,'Brussels-Capital Region','statbel_region','04000','Statbel — Total population in Belgium and the regions','https://bestat.statbel.fgov.be/bestat/crosstable.xhtml?view=fc14c1ce-7361-4d42-a892-fce8e81a1b79'),
('ghent',273790,'Gent municipality','municipality_register','44021','City of Ghent','https://stad.gent/nl/over-gent-stadsbestuur/nieuws-evenementen/al-bijna-275000-gentenaars-en-dat-aantal-blijft-toenemen'),
('leuven',105233,'Leuven municipality','municipality_register','24062','City of Leuven','https://www.leuven.be/over-leuven'),
('antwerp',570362,'Antwerpen municipality','municipality_register','11002','City of Antwerp — Stad in Cijfers','https://stadincijfers.antwerpen.be/mosaic/hoofd-dashboard/omgevingsscan-context'),
('louvain-la-neuve',31823,'Ottignies-Louvain-la-Neuve municipality','statbel_municipality_via_iweps','25121','WalStat / IWEPS','https://walstat.iweps.be/walstat-fiche-entite.php?entite_id=25121'),
('liege',198102,'Liège municipality','statbel_municipality_via_iweps','62063','WalStat / IWEPS','https://walstat.iweps.be/walstat-fiche-entite.php?entite_id=62063'))
insert into public.report_metric_evidence_city(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select gen_random_uuid(),t.id,'city',t.id::text,'city_population',jsonb_build_object('amount',v.amount,'geography',v.label,'geography_kind',v.kind,'refnis_code',v.refnis,'reference_date','2026-01-01','scope_contract_preserved',true),v.source,v.url,'2026-01-01',now(),'high','observed','verified',now(),now()
from v join t using(slug)
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence=excluded.confidence,evidence_kind='observed',review_status='verified',updated_at=now();

with t as (select id,slug from core.geographies where country_code='BE' and status='active' and metadata->>'publication_tier'='A'),
v(slug,lo,hi,kind,note,confidence,source,url) as (values
('brussels',950::numeric,1350::numeric,'student_budget_range','ULB current partner guidance for a student studying and living in Brussels; includes accommodation, study expenses, food, public transport and leisure.','high','ULB — Information for Partner Universities','https://www.ulb.be/en/mobility/for-partner-universities'),
('ghent',1200,1800,'international_phd_researcher_reference','UGent estimate is for international PhD students and researchers, not a degree-student survey; retained as a transparent indicative Ghent reference.','low','Ghent University — Cost of living in Ghent','https://www.ugent.be/en/work/talent/welcoming-new-staff/costoflivingghent.html/'),
('leuven',1050,1400,'ku_leuven_belgium_student_guidance','KU Leuven publishes this as a Belgium-wide student living-expense estimate; it is not a Leuven market survey.','medium','KU Leuven — Cost of living in Belgium','https://www.kuleuven.be/english/apply/life-at-ku-leuven/money-matters/cost-of-living-in-belgium'),
('antwerp',1461,1461,'degree_student_survey_point','Average monthly total from degree students who were in Antwerp in academic year 2024-25.','high','University of Antwerp — Cost of studying and living','https://www.uantwerpen.be/en/life-in-antwerp/budget-social-facilities/cost-of-studying/'),
('louvain-la-neuve',1000,1200,'uclouvain_real_cost_guidance','UCLouvain international mobility guidance; not a municipality-wide market survey.','medium','UCLouvain — International mobility FAQ','https://www.uclouvain.be/en/international/mobility-faq'),
('liege',700,1000,'student_budget_range','ULiège Erasmus guide estimate; study-related costs are additional.','medium','University of Liège — Erasmus Guide','https://www.international.uliege.be/books/ErasmusGuideEn/'))
insert into public.report_metric_evidence_city(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select gen_random_uuid(),t.id,'city',t.id::text,'student_living_cost_monthly_range',jsonb_build_object('low',v.lo,'high',v.hi,'period','month','currency','EUR','reference_kind',v.kind,'note',v.note,'indicative',true,'methodology_varies_by_city',true),v.source,v.url,'2026-08-10',now(),v.confidence,'observed','verified',now(),now()
from v join t using(slug)
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence=excluded.confidence,evidence_kind='observed',review_status='verified',updated_at=now();

with t as (select id,slug from core.geographies where country_code='BE' and status='active' and metadata->>'publication_tier'='A'),
v(slug,amount,period,kind,source,url) as (values
('brussels',12::numeric,'year','stib_student_pass','STIB-MIVB — School season tickets','https://www.stib-mivb.be/renew-your-school-season-ticket'),
('ghent',165,'year','de_lijn_18_24','De Lijn — Buzzy Pazz 18-24','https://www.delijn.be/en/content/buzzy-pazz-18-24-jaar/'),
('leuven',25,'academic_year','ku_leuven_student_bus_pass','KU Leuven — Campus Leuven student bus pass','https://www.kuleuven.be/english/life-at-ku-leuven/transportation/how-to-apply-for-a-student-bus-pass-in-leuven'),
('antwerp',165,'year','de_lijn_18_24','De Lijn — Buzzy Pazz 18-24','https://www.delijn.be/en/content/buzzy-pazz-18-24-jaar/'),
('louvain-la-neuve',12,'year','regional_youth_pass','TEC Belgium','https://www.letec.be/'),
('liege',12,'year','regional_youth_pass','TEC Belgium','https://www.letec.be/'))
insert into public.report_metric_evidence_city(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select gen_random_uuid(),t.id,'city',t.id::text,'student_transport_reference',jsonb_build_object('amount',v.amount,'period',v.period,'currency','EUR','reference_kind',v.kind,'eligibility_or_enrolment_conditions_apply',true,'source_native_period',true),v.source,v.url,'2026-08-10',now(),'high','observed','verified',now(),now()
from v join t using(slug)
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence='high',evidence_kind='observed',review_status='verified',updated_at=now();

insert into public.report_metric_evidence_city(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select gen_random_uuid(),g.id,'city',g.id::text,'student_work_hours_week',jsonb_build_object('hours_school_period',20,'period','week','school_holidays_unlimited_under_student_residence_work_rule',true,'compatibility_with_studies_required',true,'eligibility_conditions_apply',true,'national_rule',true,'residence_context','foreign_students_authorised_to_reside_as_students','note','Outside school holidays, eligible students may work no more than 20 hours per week and the work must remain compatible with studies.'),'Belgian FPS Employment — Foreign workers in a special residence situation','https://employment.belgium.be/en/themes/international/foreign-workers/employment-foreign-workers-special-residence-situation','2026-08-10',now(),'high','observed','verified',now(),now()
from core.geographies g where g.country_code='BE' and g.status='active' and g.metadata->>'publication_tier'='A'
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence='high',evidence_kind='observed',review_status='verified',updated_at=now();

with t as (select id,slug from core.geographies where country_code='BE' and status='active' and metadata->>'publication_tier'='A'),
v(slug,basis,sectors,source,url) as (values
('brussels','regional business clusters','["Sustainable construction and renovation","Software and digital industry","Audiovisual and interactive media","Medical devices and digital health","Tourism, events and culture","Circular economy"]'::jsonb,'hub.brussels — Business clusters','https://hub.brussels/en/network-companies-clusters/'),
('ghent','city technology ecosystem','["Biotech","Healthtech","Cleantech","Digital tech","Advanced manufacturing and resource recovery"]'::jsonb,'City of Ghent — The future is tech','https://stad.gent/en/invest-ghent/future-tech'),
('leuven','innovation-region focus domains','["Health and life sciences","Deep tech and advanced engineering","Digital and AI","B2B services"]'::jsonb,'Leuven MindGate','https://www.leuvenmindgate.be/'),
('antwerp','city investment ecosystem and port-industry profile','["Port and logistics","Chemicals and petrochemicals","Digital innovation","Circular economy","Health","Creative and fashion industries"]'::jsonb,'Business in Antwerp — Why invest','https://www.businessinantwerp.eu/en/why-invest'),
('louvain-la-neuve','university science-park majority sectors','["Life sciences","Engineering","Fine chemistry","Information and communication technology","Greentech"]'::jsonb,'UCLouvain — Economic development','https://www.uclouvain.be/fr/universite/developpement-economique'),
('liege','city economic-activity profile','["Transport and logistics","Metals and advanced manufacturing","Aerospace and microtechnology","Biotechnology","Services and environmental activities"]'::jsonb,'City of Liège — Economic Activities','https://www.liege.be/en/live-in-liege/invest-in-liege/economic-activities'))
insert into public.report_metric_evidence_city(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select gen_random_uuid(),t.id,'city',t.id::text,'employment_focus_sectors',jsonb_build_object('sectors',v.sectors,'basis',v.basis,'indicative',true,'not_shortage_ranking',true,'not_job_guarantee',true),v.source,v.url,'2026-08-10',now(),'medium','observed','verified',now(),now()
from v join t using(slug)
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence='medium',evidence_kind='observed',review_status='verified',updated_at=now();

do $$ begin
  if (select count(*) from public.report_metric_evidence_city m join core.geographies g on g.id=m.geography_id where g.country_code='BE' and g.metadata->>'publication_tier'='A' and m.review_status='verified' and m.metric_key in ('city_population','student_living_cost_monthly_range','student_transport_reference','student_work_hours_week','employment_focus_sectors')) <> 30 then raise exception 'BE Phase 4 expected 30 verified core metric rows'; end if;
  if exists(select 1 from public.city_programme_directory_be_v1) then raise exception 'BE city programme directory must remain empty'; end if;
end $$;
