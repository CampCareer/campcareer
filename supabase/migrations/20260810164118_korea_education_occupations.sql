-- South Korea Education / Social Services occupation cohort.
-- Classification basis: Korean Employment Classification of Occupations (KECO) 2025.
-- Community Worker uses broader 2311 Social Worker only for community-services scope.

insert into public.country_occupation_profiles (
  profile_key,country_code,canonical_career_id,official_title,official_code_system,official_code_version,
  official_unit_group_code,currency,registration_required,registration_authority,registration_url,
  publication_status,source_checked_at,updated_at
) values
  ('KR:early-childhood-teacher','KR','early-childhood-teacher','유치원 교사','KECO','2025','2130','KRW',true,'교육부 교원자격','https://www.law.go.kr/conAdmrulByLsPop.do?lsiSeq=269635','profile_ready','2026-08-10',now()),
  ('KR:primary-school-teacher','KR','primary-school-teacher','초등학교 교사','KECO','2025','2122','KRW',true,'교육부 교원자격','https://law.go.kr/lsInfoP.do?ancYnChk=0&lsId=000900','profile_ready','2026-08-10',now()),
  ('KR:secondary-school-teacher','KR','secondary-school-teacher','중·고등학교 교사','KECO','2025','2121','KRW',true,'교육부 교원자격','https://law.go.kr/lsInfoP.do?ancYnChk=0&lsId=000900','profile_ready','2026-08-10',now()),
  ('KR:special-education-teacher','KR','special-education-teacher','특수교육 교사','KECO','2025','2123','KRW',true,'교육부 교원자격','https://law.go.kr/lsInfoP.do?ancYnChk=0&lsId=000900','profile_ready','2026-08-10',now()),
  ('KR:social-worker','KR','social-worker','사회복지사','KECO','2025','2311','KRW',true,'보건복지부 사회복지사 자격','https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=252709','profile_ready','2026-08-10',now()),
  ('KR:youth-worker','KR','youth-worker','청소년 지도사','KECO','2025','2313','KRW',true,'성평등가족부 청소년지도사','https://www.law.go.kr/LSW/lsInfoP.do?lsId=000816&urlMode=lsInfoP','profile_ready','2026-08-10',now()),
  ('KR:community-worker','KR','community-worker','사회복지사 — community worker scope','KECO','2025','2311','KRW',false,null,null,'profile_ready','2026-08-10',now()),
  ('KR:counsellor','KR','counsellor','상담 전문가','KECO','2025','2312','KRW',false,null,null,'profile_ready','2026-08-10',now())
on conflict (profile_key) do update set
  country_code=excluded.country_code,
  canonical_career_id=excluded.canonical_career_id,
  official_title=excluded.official_title,
  official_code_system=excluded.official_code_system,
  official_code_version=excluded.official_code_version,
  official_unit_group_code=excluded.official_unit_group_code,
  currency=excluded.currency,
  registration_required=excluded.registration_required,
  registration_authority=excluded.registration_authority,
  registration_url=excluded.registration_url,
  publication_status=excluded.publication_status,
  source_checked_at=excluded.source_checked_at,
  updated_at=now();

insert into public.country_occupation_metric_snapshots (
  profile_key,as_of_date,
  shortage_component,vacancy_intensity_component,employer_diversity_component,vacancy_trend_component,
  entry_level_component,salary_component,growth_component,visa_component,entry_burden_component,
  opportunity_score,score_methodology_version,score_status,score_evidence,source_checked_at
) values
  ('KR:early-childhood-teacher','2026-08-10',0,0,0,0,10,0,0,0,1,11,'career-opportunity-kr-v1','provisional',
    jsonb_build_object('classification_scope','KECO 2025 2130 유치원 교사 is the canonical mapping and is kept separate from childcare-centre 보육교사.','entry_level_basis','A reviewed Early Childhood Education degree provides a direct teacher-education route.','qualification_note','Kindergarten teacher certification is mandatory; public appointment is a separate employment step.','market_scope','Exact recurring 2130 vacancy, comparable salary, shortage and growth evidence is not yet normalised.','visa_scope','No occupation-specific visa credit is assigned.','score_scope','Only structured entry and qualification burden are credited.'),'2026-08-10'),
  ('KR:primary-school-teacher','2026-08-10',0,0,0,0,8,0,0,0,1,9,'career-opportunity-kr-v1','provisional',
    jsonb_build_object('classification_scope','KECO 2025 2122 초등학교 교사 is a direct mapping.','entry_level_basis','Approved elementary teacher-education is a narrow professional route.','qualification_note','Elementary teacher qualification is mandatory; public schools additionally use the teacher appointment examination.','market_scope','Public appointment numbers or broad education statistics are not converted into exact labour-market components.','visa_scope','No occupation-specific visa credit is assigned.','score_scope','Only entry and burden are credited.'),'2026-08-10'),
  ('KR:secondary-school-teacher','2026-08-10',0,0,0,0,10,0,0,0,1,11,'career-opportunity-kr-v1','provisional',
    jsonb_build_object('classification_scope','KECO 2025 2121 중·고등학교 교사 is direct; subject specialisations remain within this group.','entry_level_basis','Four reviewed subject-education programmes provide direct examples of approved teacher preparation.','qualification_note','A subject-appropriate secondary teacher qualification is mandatory; public appointment is separate.','market_scope','Subject-specific teacher demand is not reconstructed from broader teacher statistics.','visa_scope','No occupation-specific visa credit is assigned.','score_scope','Only structured entry and burden are credited.'),'2026-08-10'),
  ('KR:special-education-teacher','2026-08-10',0,0,0,0,10,0,0,0,1,11,'career-opportunity-kr-v1','provisional',
    jsonb_build_object('classification_scope','KECO 2025 2123 특수교육 교사 is a direct mapping.','entry_level_basis','A reviewed Special Education Bachelor programme provides a direct teacher-training pathway.','qualification_note','The applicable special-school teacher qualification is mandatory and varies by school level.','market_scope','General disability-services or school-teacher data is not substituted for exact special-education evidence.','visa_scope','No occupation-specific visa credit is assigned.','score_scope','Only entry and qualification burden are credited.'),'2026-08-10'),
  ('KR:social-worker','2026-08-10',0,0,0,0,12,0,0,0,2,14,'career-opportunity-kr-v1','provisional',
    jsonb_build_object('classification_scope','KECO 2025 2311 사회복지사 is a direct canonical mapping.','entry_level_basis','Five reviewed Social Welfare Bachelor programmes provide direct academic pathways.','qualification_note','Statutory social-worker qualification requirements apply to the canonical role.','market_scope','Broader social-service demand is not converted into exact 2311 market scores.','visa_scope','No occupation-specific visa credit is assigned.','score_scope','Only structured entry and credential burden are credited.'),'2026-08-10'),
  ('KR:youth-worker','2026-08-10',0,0,0,0,10,0,0,0,2,12,'career-opportunity-kr-v1','provisional',
    jsonb_build_object('classification_scope','KECO 2025 2313 청소년 지도사 is used for the canonical Youth Worker.','entry_level_basis','The reviewed Social Welfare programme is retained only as related preparation.','qualification_note','The statutory 청소년지도사 route requires the applicable qualification assessment and designated training.','market_scope','Youth-service sector demand is not treated as exact 2313 shortage or vacancy evidence.','visa_scope','No occupation-specific visa credit is assigned.','score_scope','Only entry and qualification burden are credited.'),'2026-08-10'),
  ('KR:community-worker','2026-08-10',0,0,0,0,15,0,0,0,5,20,'career-opportunity-kr-v1','provisional',
    jsonb_build_object('classification_scope','KECO 2025 has no standalone Community Worker matching CampCareer; broader 2311 사회복지사 is used only for community welfare and outreach scope.','entry_level_basis','Four reviewed Social Welfare programmes are related study pathways.','qualification_note','No single universal Community Worker licence applies, although specific social-welfare roles may require the social-worker credential.','market_scope','Broader 2311 labour data is not presented as community-worker-only evidence.','visa_scope','No occupation-specific visa credit is assigned.','score_scope','Accessible related study and low universal licensing burden are credited.'),'2026-08-10'),
  ('KR:counsellor','2026-08-10',0,0,0,0,12,0,0,0,4,16,'career-opportunity-kr-v1','provisional',
    jsonb_build_object('classification_scope','KECO 2025 2312 상담 전문가 is the occupational group, covering multiple counselling settings.','entry_level_basis','Five reviewed Psychology programmes provide related academic preparation rather than direct professional qualification.','qualification_note','No single universal licence covers all counsellors; specific school, youth and clinical settings can require separate credentials or postgraduate training.','market_scope','Broader counselling demand is not converted into exact comparable components.','visa_scope','No occupation-specific visa credit is assigned.','score_scope','Academic access and non-universal licensing burden are credited conservatively.'),'2026-08-10')
on conflict (profile_key,as_of_date) do update set
  shortage_component=excluded.shortage_component,
  vacancy_intensity_component=excluded.vacancy_intensity_component,
  employer_diversity_component=excluded.employer_diversity_component,
  vacancy_trend_component=excluded.vacancy_trend_component,
  entry_level_component=excluded.entry_level_component,
  salary_component=excluded.salary_component,
  growth_component=excluded.growth_component,
  visa_component=excluded.visa_component,
  entry_burden_component=excluded.entry_burden_component,
  opportunity_score=excluded.opportunity_score,
  score_methodology_version=excluded.score_methodology_version,
  score_status=excluded.score_status,
  score_evidence=excluded.score_evidence,
  source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_specialisations (
  profile_key,official_code,official_title,shortage_rating,visa_eligible,included_in_rollup,sort_order,source_url,source_checked_at
) values
  ('KR:early-childhood-teacher','2130','유치원 교사',null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:primary-school-teacher','2122','초등학교 교사',null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:secondary-school-teacher','2121','중·고등학교 교사',null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:special-education-teacher','2123','특수교육 교사',null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:social-worker','2311','사회복지사',null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:youth-worker','2313','청소년 지도사',null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:community-worker','2311','사회복지사 — community worker scope',null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:counsellor','2312','상담 전문가',null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10')
on conflict (profile_key,official_code) do update set
  official_title=excluded.official_title,
  shortage_rating=excluded.shortage_rating,
  visa_eligible=excluded.visa_eligible,
  included_in_rollup=excluded.included_in_rollup,
  sort_order=excluded.sort_order,
  source_url=excluded.source_url,
  source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_links (
  profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at
) values
  ('KR:early-childhood-teacher','job_search','Work24 — 유치원 교사 채용','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','official_job_board',null,1,'2026-08-10'),
  ('KR:primary-school-teacher','job_search','Work24 — 초등학교 교사 채용','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','official_job_board',null,1,'2026-08-10'),
  ('KR:secondary-school-teacher','job_search','Work24 — 중·고등학교 교사 채용','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','official_job_board',null,1,'2026-08-10'),
  ('KR:special-education-teacher','job_search','Work24 — 특수교육 교사 채용','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','official_job_board',null,1,'2026-08-10'),
  ('KR:social-worker','job_search','Work24 — 사회복지사 채용','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','official_job_board',null,1,'2026-08-10'),
  ('KR:youth-worker','job_search','Work24 — 청소년 지도사 채용','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','official_job_board',null,1,'2026-08-10'),
  ('KR:community-worker','job_search','Work24 — 지역사회 복지·커뮤니티 채용','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','official_job_board',null,1,'2026-08-10'),
  ('KR:counsellor','job_search','Work24 — 상담 전문가 채용','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','official_job_board',null,1,'2026-08-10'),
  ('KR:early-childhood-teacher','source','KEIS — KECO 2025 classification','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','official_classification',null,1,'2026-08-10'),
  ('KR:primary-school-teacher','source','KEIS — KECO 2025 classification','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','official_classification',null,1,'2026-08-10'),
  ('KR:secondary-school-teacher','source','KEIS — KECO 2025 classification','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','official_classification',null,1,'2026-08-10'),
  ('KR:special-education-teacher','source','KEIS — KECO 2025 classification','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','official_classification',null,1,'2026-08-10'),
  ('KR:social-worker','source','KEIS — KECO 2025 classification','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','official_classification',null,1,'2026-08-10'),
  ('KR:youth-worker','source','KEIS — KECO 2025 classification','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','official_classification',null,1,'2026-08-10'),
  ('KR:community-worker','source','KEIS — KECO 2025 classification','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','official_classification',null,1,'2026-08-10'),
  ('KR:counsellor','source','KEIS — KECO 2025 classification','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','official_classification',null,1,'2026-08-10'),
  ('KR:early-childhood-teacher','source','Teacher qualification standards — current Ministry of Education notice','https://www.law.go.kr/conAdmrulByLsPop.do?lsiSeq=269635','official_law',null,2,'2026-08-10'),
  ('KR:primary-school-teacher','source','Elementary and Secondary Education Act — teacher qualifications','https://law.go.kr/lsInfoP.do?ancYnChk=0&lsId=000900','official_law',null,2,'2026-08-10'),
  ('KR:secondary-school-teacher','source','Elementary and Secondary Education Act — teacher qualifications','https://law.go.kr/lsInfoP.do?ancYnChk=0&lsId=000900','official_law',null,2,'2026-08-10'),
  ('KR:special-education-teacher','source','Elementary and Secondary Education Act — teacher qualifications','https://law.go.kr/lsInfoP.do?ancYnChk=0&lsId=000900','official_law',null,2,'2026-08-10'),
  ('KR:social-worker','source','Social Welfare Services Act — social-worker qualification','https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=252709','official_law',null,2,'2026-08-10'),
  ('KR:youth-worker','source','Framework Act on Youth — youth-leader qualification','https://www.law.go.kr/LSW/lsInfoP.do?lsId=000816&urlMode=lsInfoP','official_law',null,2,'2026-08-10')
on conflict (profile_key,link_type,url) do update set
  label=excluded.label,
  provider_type=excluded.provider_type,
  region_code=excluded.region_code,
  sort_order=excluded.sort_order,
  source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at)
select
  'KR:' || canonical_career_id,
  source_program_key,
  case when relation_type='direct' then 'direct' else 'related' end,
  source_checked_at
from public.program_occupation_kr_v1
where canonical_career_id in (
  'early-childhood-teacher','primary-school-teacher','secondary-school-teacher','special-education-teacher',
  'social-worker','youth-worker','community-worker','counsellor'
)
on conflict (profile_key,program_ref) do update set
  relation_type=excluded.relation_type,
  source_checked_at=excluded.source_checked_at;
