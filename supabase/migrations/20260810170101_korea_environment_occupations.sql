-- South Korea Environment occupation cohort.
-- Classification basis: Korean Employment Classification of Occupations (KECO) 2025.
-- Several canonical careers are broader than one KECO unit group; those mappings are explicitly scoped.

insert into public.country_occupation_profiles (
  profile_key,country_code,canonical_career_id,official_title,official_code_system,official_code_version,
  official_unit_group_code,currency,registration_required,registration_authority,registration_url,
  publication_status,source_checked_at,updated_at
)
values
  ('KR:environmental-scientist','KR','environmental-scientist','생명과학 연구원 — environmental science/ecology scope','KECO','2025','1221','KRW',false,null,null,'profile_ready','2026-08-10',now()),
  ('KR:agronomist','KR','agronomist','생명과학 연구원 — agronomy/crop-science scope','KECO','2025','1221','KRW',false,null,null,'profile_ready','2026-08-10',now()),
  ('KR:farm-manager','KR','farm-manager','농업 생산 경영 — farm-manager umbrella','KECO','2025',null,'KRW',false,null,null,'profile_ready','2026-08-10',now()),
  ('KR:forestry-technician','KR','forestry-technician','농림어업 관련 시험원 — forestry technician scope','KECO','2025','1223','KRW',false,'산림청 산림기술자 제도','https://www.forest.go.kr/','profile_ready','2026-08-10',now()),
  ('KR:food-technologist','KR','food-technologist','식품공학 기술자 및 연구원','KECO','2025','1571','KRW',false,null,null,'profile_ready','2026-08-10',now()),
  ('KR:sustainability-specialist','KR','sustainability-specialist','환경공학 기술자 및 연구원 — sustainability/environmental-consulting scope','KECO','2025','1555','KRW',false,null,null,'profile_ready','2026-08-10',now()),
  ('KR:horticulturist','KR','horticulturist','원예작물 재배원','KECO','2025','9014','KRW',false,null,null,'profile_ready','2026-08-10',now()),
  ('KR:animal-science-technician','KR','animal-science-technician','농림어업 관련 시험원 — animal-science/livestock technician scope','KECO','2025','1223','KRW',false,null,null,'profile_ready','2026-08-10',now())
on conflict (profile_key) do update set
  country_code=excluded.country_code,canonical_career_id=excluded.canonical_career_id,official_title=excluded.official_title,
  official_code_system=excluded.official_code_system,official_code_version=excluded.official_code_version,
  official_unit_group_code=excluded.official_unit_group_code,currency=excluded.currency,
  registration_required=excluded.registration_required,registration_authority=excluded.registration_authority,
  registration_url=excluded.registration_url,publication_status=excluded.publication_status,
  source_checked_at=excluded.source_checked_at,updated_at=now();

insert into public.country_occupation_metric_snapshots (
  profile_key,as_of_date,shortage_component,vacancy_intensity_component,employer_diversity_component,vacancy_trend_component,
  entry_level_component,salary_component,growth_component,visa_component,entry_burden_component,
  opportunity_score,score_methodology_version,score_status,score_evidence,source_checked_at
)
values
  ('KR:environmental-scientist','2026-08-10',0,0,0,0,10,0,0,0,5,15,'career-opportunity-kr-v1','provisional',jsonb_build_object(
    'classification_scope','KECO 2025 1221 생명과학 연구원 is broader than Environmental Scientist; CampCareer limits this profile to environmental science, ecology and environmental research work.',
    'entry_level_basis','Four reviewed Korean environmental-science or closely aligned programmes provide direct study evidence.',
    'market_scope','No exact recurring Environmental Scientist-only vacancy, salary, shortage or growth series is normalised.',
    'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.',
    'score_scope','KR v1 credits only structured graduate entry and low universal licensing burden.'
  ),'2026-08-10'),
  ('KR:agronomist','2026-08-10',0,0,0,0,10,0,0,0,5,15,'career-opportunity-kr-v1','provisional',jsonb_build_object(
    'classification_scope','KECO 2025 1221 생명과학 연구원 includes agronomy, crop science, agricultural research and related applied life-science work; CampCareer restricts this profile to agronomy/crop-science scope.',
    'entry_level_basis','Two direct and two related reviewed Korean programmes support crop-science and agricultural study routes.',
    'market_scope','Broader agriculture-sector conditions are not converted into exact Agronomist market points.',
    'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.',
    'score_scope','Only graduate entry accessibility and non-universal licensing burden are credited.'
  ),'2026-08-10'),
  ('KR:farm-manager','2026-08-10',0,0,0,0,15,0,0,0,5,20,'career-opportunity-kr-v1','provisional',jsonb_build_object(
    'classification_scope','KECO 2025 has no one generic Farm Manager unit group. Crop and livestock production is classified by production type, so the profile intentionally has no single roll-up code.',
    'entry_level_basis','Farm management can be reached through agricultural study plus practical production and business experience; three reviewed Korean programmes are retained as related pathways.',
    'qualification_note','There is no universal Farm Manager personal licence, although chemicals, machinery, livestock, food-safety and other activities can have separate compliance requirements.',
    'market_scope','Production-specific farmer codes are not aggregated into a fabricated generic Farm Manager market score.',
    'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.',
    'score_scope','KR v1 credits flexible entry and low universal licensing burden only.'
  ),'2026-08-10'),
  ('KR:forestry-technician','2026-08-10',0,0,0,0,15,0,0,0,3,18,'career-opportunity-kr-v1','provisional',jsonb_build_object(
    'classification_scope','KECO 2025 1223 농림어업 관련 시험원 covers technical forestry testing, field support and related applied work; the canonical profile is restricted to forestry technician duties.',
    'entry_level_basis','Technical and practical forestry routes can support entry; one reviewed Korean Forest Science programme is linked as direct study evidence.',
    'qualification_note','The broad occupation is not universally licensed, but statutory forest-project design, supervision and specified forest-technology work can require a 산림기술자 qualification under the Forest Technology Promotion and Management Act.',
    'market_scope','Forestry-worker and forestry-researcher data are not blended into a synthetic technician-only score.',
    'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.',
    'score_scope','Entry access receives credit while role-specific statutory qualification risk lowers burden credit.'
  ),'2026-08-10'),
  ('KR:food-technologist','2026-08-10',0,0,0,0,10,0,0,0,5,15,'career-opportunity-kr-v1','provisional',jsonb_build_object(
    'classification_scope','KECO 2025 1571 식품공학 기술자 및 연구원 is the direct occupational anchor for food technology, product development, processing and technical quality work.',
    'entry_level_basis','Four reviewed direct food-engineering/food-science programmes plus three related programmes provide strong study-pathway coverage.',
    'qualification_note','No single personal licence is mandatory for all Food Technologist roles; regulated food-safety or responsible-person duties can impose separate requirements.',
    'market_scope','Food-industry growth or broad production hiring is not substituted for exact 1571 labour-market evidence.',
    'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.',
    'score_scope','Only structured graduate entry and low universal licensing burden are credited.'
  ),'2026-08-10'),
  ('KR:sustainability-specialist','2026-08-10',0,0,0,0,10,0,0,0,5,15,'career-opportunity-kr-v1','provisional',jsonb_build_object(
    'classification_scope','KECO 2025 has no standalone Sustainability Specialist. CampCareer uses 1555 환경공학 기술자 및 연구원 only as a broader environmental-consulting/sustainability anchor, not as an exact equivalence.',
    'entry_level_basis','Five reviewed environmental programmes are retained as related study evidence; none is promoted to a direct sustainability qualification.',
    'qualification_note','There is no universal Sustainability Specialist occupational licence.',
    'market_scope','Environmental-engineering employment, salary and vacancies are not presented as Sustainability Specialist-only evidence.',
    'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.',
    'score_scope','The broader mapping remains provisional and all market components stay unscored.'
  ),'2026-08-10'),
  ('KR:horticulturist','2026-08-10',0,0,0,0,15,0,0,0,5,20,'career-opportunity-kr-v1','provisional',jsonb_build_object(
    'classification_scope','KECO 2025 9014 원예작물 재배원 is the practical horticultural-production anchor. Research-focused horticulture remains within 1221 and is not rolled into this profile.',
    'entry_level_basis','Horticulture can be entered through practical production experience, vocational routes or university study; two direct and one related reviewed Korean programmes are available.',
    'qualification_note','No universal personal licence applies to horticultural production, though pesticides, machinery and specialised activities can carry separate requirements.',
    'market_scope','Landscape work and agronomy research are kept separate from horticultural-production market evidence.',
    'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.',
    'score_scope','Flexible entry receives higher credit while market components remain unscored.'
  ),'2026-08-10'),
  ('KR:animal-science-technician','2026-08-10',0,0,0,0,15,0,0,0,5,20,'career-opportunity-kr-v1','provisional',jsonb_build_object(
    'classification_scope','KECO 2025 1223 농림어업 관련 시험원 is a broader technical anchor that includes livestock and agricultural testing/support work. Clinical veterinary work is excluded.',
    'entry_level_basis','One direct Animal Life Resources programme and one related Food & Animal Biotechnology programme provide reviewed study evidence.',
    'qualification_note','No universal Animal Science Technician licence is assumed; particular breeding, veterinary-support, laboratory or biosecurity procedures may have separate rules.',
    'market_scope','Veterinary, livestock-farming and broad agricultural technician signals are not merged into a fabricated exact market score.',
    'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.',
    'score_scope','Technical entry accessibility is credited while market and visa components remain unscored.'
  ),'2026-08-10')
on conflict (profile_key,as_of_date) do update set
  shortage_component=excluded.shortage_component,vacancy_intensity_component=excluded.vacancy_intensity_component,
  employer_diversity_component=excluded.employer_diversity_component,vacancy_trend_component=excluded.vacancy_trend_component,
  entry_level_component=excluded.entry_level_component,salary_component=excluded.salary_component,growth_component=excluded.growth_component,
  visa_component=excluded.visa_component,entry_burden_component=excluded.entry_burden_component,opportunity_score=excluded.opportunity_score,
  score_methodology_version=excluded.score_methodology_version,score_status=excluded.score_status,
  score_evidence=excluded.score_evidence,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_specialisations (
  profile_key,official_code,official_title,legacy_code_system,legacy_code_version,legacy_code,
  shortage_rating,visa_eligible,included_in_rollup,sort_order,source_url,source_checked_at
)
values
  ('KR:environmental-scientist','1221','생명과학 연구원 — environmental science/ecology scope',null,null,null,null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:agronomist','1221','생명과학 연구원 — agronomy/crop-science scope',null,null,null,null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:farm-manager','9011','곡식작물 재배원 — production-specific farm scope',null,null,null,null,null,false,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:farm-manager','9012','채소 및 특용작물 재배원 — production-specific farm scope',null,null,null,null,null,false,2,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:farm-manager','9013','과수작물 재배원 — production-specific farm scope',null,null,null,null,null,false,3,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:farm-manager','9014','원예작물 재배원 — production-specific farm scope',null,null,null,null,null,false,4,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:farm-manager','9021','낙농 관련 종사원 — production-specific farm scope',null,null,null,null,null,false,5,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:farm-manager','9022','한우 및 육우 사육원 — production-specific farm scope',null,null,null,null,null,false,6,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:farm-manager','9023','돼지 사육원 — production-specific farm scope',null,null,null,null,null,false,7,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:farm-manager','9024','가금 사육원 — production-specific farm scope',null,null,null,null,null,false,8,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:farm-manager','9029','기타 축산 및 사육 관련 종사원 — production-specific farm scope',null,null,null,null,null,false,9,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:forestry-technician','1223','농림어업 관련 시험원 — forestry technician scope',null,null,null,null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:food-technologist','1571','식품공학 기술자 및 연구원',null,null,null,null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:food-technologist','1572','식품공학 시험원',null,null,null,null,null,false,2,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:sustainability-specialist','1555','환경공학 기술자 및 연구원 — sustainability/environmental-consulting proxy',null,null,null,null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:horticulturist','9014','원예작물 재배원',null,null,null,null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:animal-science-technician','1223','농림어업 관련 시험원 — animal-science/livestock technician scope',null,null,null,null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10')
on conflict (profile_key,official_code) do update set
  official_title=excluded.official_title,included_in_rollup=excluded.included_in_rollup,sort_order=excluded.sort_order,
  source_url=excluded.source_url,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_links (profile_key,link_type,label,url,provider_type,sort_order,source_checked_at)
select p.profile_key,'job_search','Work24 채용정보','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','government',10,'2026-08-10'
from public.country_occupation_profiles p
where p.country_code='KR' and p.canonical_career_id in (
  'environmental-scientist','agronomist','farm-manager','forestry-technician','food-technologist','sustainability-specialist','horticulturist','animal-science-technician'
)
on conflict (profile_key,link_type,url) do update set label=excluded.label,provider_type=excluded.provider_type,sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_links (profile_key,link_type,label,url,provider_type,sort_order,source_checked_at)
select p.profile_key,'source','한국고용정보원 KECO 2025','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','government',20,'2026-08-10'
from public.country_occupation_profiles p
where p.country_code='KR' and p.canonical_career_id in (
  'environmental-scientist','agronomist','farm-manager','forestry-technician','food-technologist','sustainability-specialist','horticulturist','animal-science-technician'
)
on conflict (profile_key,link_type,url) do update set label=excluded.label,provider_type=excluded.provider_type,sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_links (profile_key,link_type,label,url,provider_type,sort_order,source_checked_at)
values ('KR:forestry-technician','source','산림기술 진흥 및 관리에 관한 법률','https://www.law.go.kr/LSW/LsiJoLinkP.do?docType=JO&joNo=000200000&languageType=KO&lsNm=%EC%82%B0%EB%A6%BC%EA%B8%B0%EC%88%A0+%EC%A7%84%ED%9D%A5+%EB%B0%8F+%EA%B4%80%EB%A6%AC%EC%97%90+%EA%B4%80%ED%95%9C+%EB%B2%95%EB%A5%A0&paras=1','government',30,'2026-08-10')
on conflict (profile_key,link_type,url) do update set label=excluded.label,provider_type=excluded.provider_type,sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at)
select 'KR:' || m.canonical_career_id,m.source_program_key,
  case when m.relation_type='direct' then 'direct' else 'related' end,m.source_checked_at
from public.program_occupation_kr_v1 m
where m.canonical_career_id in (
  'environmental-scientist','agronomist','farm-manager','forestry-technician','food-technologist','sustainability-specialist','horticulturist','animal-science-technician'
)
on conflict (profile_key,program_ref) do update set relation_type=excluded.relation_type,source_checked_at=excluded.source_checked_at;
