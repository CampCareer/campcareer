-- Spain Cities Phase 4: exactly five verified decision-support metrics for each of seven Tier A municipalities.

with t as (
  select id,slug,name,code from core.geographies
  where country_code='ES' and metadata->>'publication_tier'='A' and canonical_geography_id is null
), v(slug,amount) as (
  values
    ('madrid',3506730::numeric),
    ('barcelona',1731649),
    ('valencia',840792),
    ('sevilla',689423),
    ('granada',233975),
    ('malaga',599063),
    ('bilbao',346933)
)
insert into public.report_metric_evidence_city(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select md5('es_city_phase4:'||t.id||':city_population')::uuid,t.id,'city',t.id::text,'city_population',
       jsonb_build_object('amount',v.amount,'geography',t.name||' municipality','geography_kind','ine_municipality','municipality_code',t.code,'estimate_kind','official_municipal_register','estimate_date','2025-01-01'),
       'INE — Official population figures from Spanish municipalities',
       'https://ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736177011&idp=1254734710990&menu=resultados',
       '2025-01-01',now(),'high','observed','verified',now(),now()
from t join v using(slug)
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status='verified',updated_at=now();

with t as (
  select id,slug from core.geographies where country_code='ES' and metadata->>'publication_tier'='A' and canonical_geography_id is null
), v(slug,low,high,kind,city_specific,full_budget,note,source,url,evidence_kind) as (values
 ('madrid',800::numeric,1600::numeric,'full_student_budget_broad_range',true,true,'UAM estimates approximately EUR 800–1,200/month for tighter student budgets and EUR 1,200–1,600 or more depending on accommodation and personal spending. The stored range spans the stated broad student estimate.','Universidad Autónoma de Madrid — Accommodation and cost of living','https://www.uam.es/uam/internacional/estudiantes/alojamiento','observed'),
 ('barcelona',1300,1500,'full_student_budget_minimum_range',true,true,'UPC advises international students to have at least EUR 1,300–1,500/month for accommodation and living expenses.','UPC — Cost of living and prices','https://www.upc.edu/sri/en/mobility_office/students-mobility-office/incomings/studying-at-the-upc/copy_of_cost-of-living-and-prices','observed'),
 ('valencia',695,795,'source_component_core_monthly_subtotal',true,false,'Calculated from current UV reference components: shared-room rent EUR 350–450, utilities EUR 50, home internet EUR 45 and maintenance/groceries EUR 250. It excludes transport, leisure and other discretionary costs and is not a full student budget.','Universitat de València — Incoming student cost references','https://www.uv.es/uvweb/estudiantes-uv/ca/mobilitat-intercanvi/estudiants-altres-universitats-incoming/erasmus-estudis-/incoming-/estudiants-admessos-1286012860595.html','calculated'),
 ('sevilla',306,707.5,'university_residence_accommodation_only',true,false,'Current room/studio starting-price range at Resa Rector Ramón Carande, one of the University of Sevilla residences listed for the 2026/27 allocation process. Accommodation only reference, not a full living-cost estimate.','Universidad de Sevilla 2026/27 residence listing / Resa Rector Ramón Carande','https://resa.es/es/residencias/sevilla/rector-ramon-carande/','observed'),
 ('granada',650,850,'full_student_budget_range',true,true,'UGR states that student living costs tend to vary between EUR 650 and EUR 850/month depending on lifestyle.','Universidad de Granada — About studying at the UGR','https://www.ugr.es/en/study/undergraduate/about-studying-at-the-ugr','observed'),
 ('malaga',879,929,'university_residence_accommodation_only',true,false,'Current CIE-UMA Campus Málaga residence individual-studio accommodation prices. Accommodation only reference, not a full living-cost estimate.','Universidad de Málaga — Campus Málaga University Residence','https://www.uma.es/centrointernacionaldeespanol/info/132420/residencia-resa-teatinos/?set_language=en','observed'),
 ('bilbao',650,800,'full_student_budget_range',true,true,'EHU Faculty of Economics and Business incoming-student datasheet gives a total monthly living-cost reference of EUR 650–800.','EHU — Faculty of Economics and Business incoming datasheet','https://www.ehu.eus/en/web/ekonomia-enpresa-fakultatea/datasheet','observed')
)
insert into public.report_metric_evidence_city(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select md5('es_city_phase4:'||t.id||':student_living_cost_monthly_range')::uuid,t.id,'city',t.id::text,'student_living_cost_monthly_range',
       jsonb_build_object('low',v.low,'high',v.high,'currency','EUR','period','month','reference_kind',v.kind,'city_specific',v.city_specific,'full_budget',v.full_budget,'indicative',true,'ranking_safe',false,'note',v.note),
       v.source,v.url,'2026-08-11',now(),case when v.evidence_kind='calculated' then 'medium' else 'high' end,v.evidence_kind,'verified',now(),now()
from t join v using(slug)
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status='verified',updated_at=now();

with t as (
  select id,slug from core.geographies where country_code='ES' and metadata->>'publication_tier'='A' and canonical_geography_id is null
), v(slug,amount,period,kind,student_specific,note,source,url) as (values
 ('madrid',10::numeric,'30_days','crtm_abono_joven_15_25',true,'Unlimited travel across all Madrid tariff zones for eligible holders from age 15 until age 26. Current 2026 subsidised fare.','CRTM — Abono Joven','https://crtm.es/billetes-y-tarifas/buscador/abono-joven/?lang=es&zona=A'),
 ('barcelona',45.50,'90_days','tmb_t_jove_under_30',true,'Personal under-30 pass with unlimited integrated journeys across all ATM Barcelona fare zones for 90 consecutive days.','TMB — T-jove 2026 fares','https://static-web.tmb.cat/en/barcelona-fares-metro-bus/transport-ticket-fares'),
 ('valencia',12.50,'30_days','emt_jove_under_30',true,'Monthly under-30 pass with unlimited journeys on the EMT València network; subsidised price valid through 31 December 2026.','EMT València — Fares and titles','https://www.emtvalencia.es/wp/tarifas-y-titulos/'),
 ('sevilla',8.80,'calendar_month','tussam_joven_16_29',true,'Personal pass for ages 16–29 with unlimited travel during the calendar month, excluding airport and special services; current subsidised fare.','TUSSAM — Personalised Joven card','https://www.tussam.es/es/tarjetas-personalizadas'),
 ('granada',0.65,'per_trip','granada_bonobus_universitario',true,'Authorised urban bus university/youth per-trip reference. Stored source-native per trip rather than converted into a monthly fare.','Ayuntamiento de Granada — authorised urban bus tariffs','https://www.granada.org/inet/wordenanz.nsf/mtod/D078C27AF3EF5C74C1258BFC003575EA'),
 ('malaga',0.62,'per_first_stage','ctmam_transport_card_zero_jump_2026',false,'Current 2026 zero-jump metropolitan transport-card fare reference. Under-30 Tarjeta Joven holders receive an additional 25% recharge bonus; the stored amount is the published base card cancellation value, not a synthetic monthly student fare.','Consorcio de Transporte Metropolitano del Área de Málaga — 2026 fares','https://ctmam.es/tarifas/'),
 ('bilbao',30.00,'30_days','ctb_mensual_gazte_bilbao',true,'Monthly Gazte Bilbao Barik reference. Eligibility and network conditions follow CTB rules.','Consorcio de Transportes de Bizkaia — Gazte Bilbao','https://www.ctb.eus/es/tarifas-funiculares-marzo')
)
insert into public.report_metric_evidence_city(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select md5('es_city_phase4:'||t.id||':student_transport_reference')::uuid,t.id,'city',t.id::text,'student_transport_reference',
       jsonb_build_object('amount',v.amount,'currency','EUR','period',v.period,'reference_kind',v.kind,'student_specific',v.student_specific,'source_native_period',true,'note',v.note),
       v.source,v.url,'2026-08-11',now(),'high','observed','verified',now(),now()
from t join v using(slug)
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status='verified',updated_at=now();

with t as (
  select id from core.geographies where country_code='ES' and metadata->>'publication_tier'='A' and canonical_geography_id is null
)
insert into public.report_metric_evidence_city(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select md5('es_city_phase4:'||t.id||':student_work_hours_week')::uuid,t.id,'city',t.id::text,'student_work_hours_week',
       jsonb_build_object('hours_normal_period',30,'period','week','national_rule',true,'city_specific',false,'compatibility_required',true,'note','Long-duration study holders may work where the activity is compatible with the study authorisation and does not exceed 30 hours, subject to the current regulation and stated exceptions. This is national context, not a city labour-market score.'),
       'Ministerio de Inclusión — Hoja 4 bis: acceso al empleo durante estancia por estudios',
       'https://www.inclusion.gob.es/en/web/migraciones/w/hoja-4-bis-acceso-al-empleo-de-las-personas-titulares-de-una-autorizacion-de-estancia-de-larga-duracion-por-estudios-movilidad-de-alumnos-servicios-de-voluntariado-o-actividades-formativas',
       '2025-05-01',now(),'high','observed','verified',now(),now()
from t
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status='verified',updated_at=now();

with t as (
  select id,slug from core.geographies where country_code='ES' and metadata->>'publication_tier'='A' and canonical_geography_id is null
), v(slug,basis,sectors,source,url) as (values
 ('madrid','Madrid City 2026 strategic cluster framework','["Cybersecurity","Digital health","Big Data and artificial intelligence","Construction, architecture and engineering","Logistics and urban distribution","Fintech and Insurtech"]'::jsonb,'Ayuntamiento de Madrid — Strategic sector clusters 2026','https://diario.madrid.es/blog/notas-de-prensa/el-ayuntamiento-refuerza-la-colaboracion-con-las-agrupaciones-empresariales-sectoriales-o-clusteres-en-2026/'),
 ('barcelona','Barcelona Activa strategic activity sectors','["Digital economy","Creative and cultural industries","Health and quality of life","Green economy and sustainability","Blue economy","Manufacturing industry"]'::jsonb,'Barcelona Activa — Strategic industries','https://empreses.barcelonactiva.cat/en/strategic-industries'),
 ('valencia','València I+D+i and technology growth-potential sectors','["Agri-food","Mobility","Utilities","Chemical and pharmaceutical industry"]'::jsonb,'Ajuntament de València — Sectores tractores','https://www.valencia.es/es/-/sectores-tractores'),
 ('sevilla','Sevilla 2030 sector-study framework','["Aerospace","Industry","Logistics and transport","Commerce","Crafts and fashion"]'::jsonb,'Ayuntamiento de Sevilla — Plan Estratégico 2030 sector studies','https://www.sevilla.org/planestrategico2030/documentos/sevilla-2030/estudios-sectoriales'),
 ('granada','Granada municipal 2026 business-specialisation training priorities','["Artificial intelligence","Digital transformation","Circular economy","Entrepreneurship and business growth"]'::jsonb,'Ayuntamiento de Granada — Monográficos de Especialización 2026','https://www.granada.org/inet/empleo.nsf/0/8661D67E3C96613CC1258D95001C93B4?open=&pag=ini03'),
 ('malaga','Málaga FYCMA 2025–2026 strategic and emerging sector programme','["Health","Technology","Culture and entertainment","Tourism","Mobility and motor","Business and economic activity"]'::jsonb,'Ayuntamiento de Málaga — FYCMA strategic and emerging sectors','https://www.malaga.eu/el-ayuntamiento/notas-de-prensa/detalle-de-la-nota-de-prensa/index.html?id=176520'),
 ('bilbao','Bilbao Ekintza smart-specialisation sectors','["Advanced services (KIBS)","Digital economy","Creative and cultural industries","Tourism"]'::jsonb,'Bilbao Ekintza — Smart Specialisation','https://www.bilbaoekintza.eus/en/about-us/areas-of-action/business-development-employment/smart-specialisation')
)
insert into public.report_metric_evidence_city(id,geography_id,scope_type,scope_id,metric_key,value,source_name,source_url,data_as_of,last_verified_at,confidence,evidence_kind,review_status,created_at,updated_at)
select md5('es_city_phase4:'||t.id||':employment_focus_sectors')::uuid,t.id,'city',t.id::text,'employment_focus_sectors',
       jsonb_build_object('basis',v.basis,'sectors',v.sectors,'indicative',true,'not_shortage_ranking',true,'not_job_guarantee',true,'note','Official/local economic-development context only. Sector lists are not directly comparable city rankings and do not imply individual job availability.'),
       v.source,v.url,'2026-08-11',now(),'medium','observed','verified',now(),now()
from t join v using(slug)
on conflict(geography_id,metric_key) do update set value=excluded.value,source_name=excluded.source_name,source_url=excluded.source_url,data_as_of=excluded.data_as_of,last_verified_at=now(),confidence=excluded.confidence,evidence_kind=excluded.evidence_kind,review_status='verified',updated_at=now();

create or replace view public.city_metric_directory_es_v1 with (security_invoker=true) as
select g.id city_id,g.slug city_slug,g.name city_name,r.metric_key,r.value,r.source_name,r.source_url,r.data_as_of,r.confidence,r.evidence_kind
from core.geographies g
join public.report_metric_evidence_city r on r.geography_id=g.id and r.scope_type='city' and r.review_status='verified'
where g.country_code='ES' and g.metadata->>'publication_tier'='A'
  and r.metric_key in ('city_population','student_living_cost_monthly_range','student_transport_reference','student_work_hours_week','employment_focus_sectors');

revoke all on public.city_metric_directory_es_v1 from public,anon,authenticated;
grant select on public.city_metric_directory_es_v1 to service_role;

do $$ declare n integer; bad integer; unsafe_cost integer; begin
  select count(*) into n from public.city_metric_directory_es_v1;
  if n<>35 then raise exception 'ES Tier A metrics expected 35 verified rows, found %',n; end if;
  select count(*) into bad from (
    select g.id from core.geographies g
    left join public.city_metric_directory_es_v1 r on r.city_id=g.id
    where g.country_code='ES' and g.metadata->>'publication_tier'='A'
    group by g.id having count(r.metric_key)<>5
  ) q;
  if bad<>0 then raise exception 'Each ES Tier A city must have exactly five verified metrics'; end if;
  select count(*) into unsafe_cost from public.city_metric_directory_es_v1
  where metric_key='student_living_cost_monthly_range' and coalesce((value->>'ranking_safe')::boolean,true) is true;
  if unsafe_cost<>0 then raise exception 'Spain living-cost references must not be marked ranking-safe'; end if;
end $$;
