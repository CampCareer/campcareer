-- South Korea Technology occupation cohort.
-- Classification basis: Korean Employment Classification of Occupations (KECO) 2025.
-- Market scoring is deliberately conservative until exact-code comparable labour series are normalised.

insert into public.country_occupation_profiles (
  profile_key,country_code,canonical_career_id,official_title,official_code_system,official_code_version,
  official_unit_group_code,currency,registration_required,registration_authority,registration_url,
  publication_status,source_checked_at,updated_at
)
values
  ('KR:software-developer','KR','software-developer','응용 소프트웨어 개발자','KECO','2025','1332','KRW',false,null,null,'profile_ready','2026-08-10',now()),
  ('KR:data-analyst','KR','data-analyst','데이터 분석가','KECO','2025','1352','KRW',false,null,null,'profile_ready','2026-08-10',now()),
  ('KR:data-engineer','KR','data-engineer','데이터 시스템 전문가 — 데이터 엔지니어 scope','KECO','2025','1351','KRW',false,null,null,'profile_ready','2026-08-10',now()),
  ('KR:cybersecurity-analyst','KR','cybersecurity-analyst','정보 보안 전문가','KECO','2025','1342','KRW',false,null,null,'profile_ready','2026-08-10',now()),
  ('KR:network-administrator','KR','network-administrator','정보 시스템 운영자 — 네트워크 관리자 scope','KECO','2025','1361','KRW',false,null,null,'profile_ready','2026-08-10',now()),
  ('KR:cloud-engineer','KR','cloud-engineer','시스템 소프트웨어 개발자 — 클라우드 엔지니어 scope','KECO','2025','1331','KRW',false,null,null,'profile_ready','2026-08-10',now()),
  ('KR:database-administrator','KR','database-administrator','데이터 시스템 전문가 — 데이터베이스 관리자 scope','KECO','2025','1351','KRW',false,null,null,'profile_ready','2026-08-10',now()),
  ('KR:ict-support-technician','KR','ict-support-technician','정보 시스템 운영자 — IT 기술지원 scope','KECO','2025','1361','KRW',false,null,null,'profile_ready','2026-08-10',now())
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
)
values
  ('KR:software-developer','2026-08-10',0,0,0,0,13,0,0,0,5,18,'career-opportunity-kr-v1','provisional',jsonb_build_object(
    'classification_scope','KECO 2025 1332 응용 소프트웨어 개발자. The global canonical Software Developer title is broader, so system-software and web-only roles are not silently rolled into this profile.',
    'entry_level_basis','Software and computing degrees are common pathways, but portfolio and demonstrated programming capability also support entry.',
    'registration_scope','No universal statutory personal licence is required for application software development.',
    'market_scope','Industry-wide software signals are not treated as an exact 1332 shortage, salary or vacancy series.',
    'visa_scope','No occupation-specific visa credit is assigned without a verified pathway tied to the canonical occupation.',
    'score_scope','KR v1 credits only entry accessibility and burden until comparable market evidence is normalised.'
  ),'2026-08-10'),
  ('KR:data-analyst','2026-08-10',0,0,0,0,10,0,0,0,5,15,'career-opportunity-kr-v1','provisional',jsonb_build_object(
    'classification_scope','KECO 2025 1352 데이터 분석가 is a direct canonical mapping.',
    'entry_level_basis','Data science, statistics, mathematics and computing degrees are common pathways; practical SQL, Python and analytical skills are important.',
    'registration_scope','No universal statutory Data Analyst licence is required.',
    'market_scope','No recurring exact-code vacancy, national salary or shortage series is scored in KR v1.',
    'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.',
    'score_scope','KR v1 remains provisional.'
  ),'2026-08-10'),
  ('KR:data-engineer','2026-08-10',0,0,0,0,8,0,0,0,5,13,'career-opportunity-kr-v1','provisional',jsonb_build_object(
    'classification_scope','KECO 2025 has no standalone Data Engineer unit group. CampCareer uses 1351 데이터 시스템 전문가 and restricts the canonical scope to data-pipeline, platform and infrastructure engineering.',
    'entry_level_basis','The role is technically specialised and commonly follows computing or data-focused higher education plus practical platform experience.',
    'registration_scope','No universal statutory Data Engineer licence is required.',
    'market_scope','Broader 1351 market values are not presented as Data Engineer-only evidence.',
    'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.',
    'score_scope','KR v1 remains provisional.'
  ),'2026-08-10'),
  ('KR:cybersecurity-analyst','2026-08-10',0,0,0,0,10,0,0,0,5,15,'career-opportunity-kr-v1','provisional',jsonb_build_object(
    'classification_scope','KECO 2025 1342 정보 보안 전문가 is a direct canonical mapping.',
    'entry_level_basis','Cybersecurity, information security and computing study are common pathways, alongside practical security operations and incident-response capability.',
    'registration_scope','No single universal private-sector information-security personal licence is assumed.',
    'market_scope','Strategic importance of cybersecurity is not converted into shortage or growth credit without exact evidence.',
    'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.',
    'score_scope','KR v1 remains provisional.'
  ),'2026-08-10'),
  ('KR:network-administrator','2026-08-10',0,0,0,0,13,0,0,0,5,18,'career-opportunity-kr-v1','provisional',jsonb_build_object(
    'classification_scope','Network Administrator is represented within broader KECO 2025 1361 정보 시스템 운영자 and restricted to network and infrastructure administration duties.',
    'entry_level_basis','Networking, information systems and computer engineering study plus practical administration experience provide common entry routes.',
    'registration_scope','No universal statutory Network Administrator licence is required.',
    'market_scope','Broader 1361 market values are not presented as network-administrator-only evidence.',
    'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.',
    'score_scope','KR v1 remains provisional.'
  ),'2026-08-10'),
  ('KR:cloud-engineer','2026-08-10',0,0,0,0,8,0,0,0,5,13,'career-opportunity-kr-v1','provisional',jsonb_build_object(
    'classification_scope','CampCareer maps Cloud Engineer to KECO 2025 1331 시스템 소프트웨어 개발자 because the official scope includes cloud-environment design and cloud-system engineering.',
    'entry_level_basis','Cloud engineering commonly requires computing foundations plus Linux, networking, infrastructure-as-code and platform skills.',
    'registration_scope','No universal statutory Cloud Engineer licence is required.',
    'market_scope','Pure cloud operations may sit closer to 1361 and are not silently included; no exact cloud-only market series is scored.',
    'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.',
    'score_scope','KR v1 remains provisional.'
  ),'2026-08-10'),
  ('KR:database-administrator','2026-08-10',0,0,0,0,10,0,0,0,5,15,'career-opportunity-kr-v1','provisional',jsonb_build_object(
    'classification_scope','Database Administrator is represented within KECO 2025 1351 데이터 시스템 전문가, whose scope includes database design, operation, control, support, management and backup.',
    'entry_level_basis','Database, computer science and information-systems study plus practical SQL and platform administration are common routes.',
    'registration_scope','No universal statutory Database Administrator licence is required.',
    'market_scope','Broader 1351 market values are not presented as DBA-only evidence.',
    'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.',
    'score_scope','KR v1 remains provisional.'
  ),'2026-08-10'),
  ('KR:ict-support-technician','2026-08-10',0,0,0,0,15,0,0,0,5,20,'career-opportunity-kr-v1','provisional',jsonb_build_object(
    'classification_scope','ICT Support Technician is represented within KECO 2025 1361 정보 시스템 운영자, which includes technical support for system users and troubleshooting.',
    'entry_level_basis','Applied IT education, certifications and practical troubleshooting experience can provide accessible entry routes.',
    'registration_scope','No universal statutory ICT Support Technician licence is required.',
    'market_scope','Broader 1361 market values are not presented as ICT-support-only evidence.',
    'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.',
    'score_scope','KR v1 remains provisional.'
  ),'2026-08-10')
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
)
values
  ('KR:software-developer','1332','응용 소프트웨어 개발자',null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:data-analyst','1352','데이터 분석가',null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:data-engineer','1351','데이터 시스템 전문가',null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:cybersecurity-analyst','1342','정보 보안 전문가',null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:network-administrator','1361','정보 시스템 운영자',null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:cloud-engineer','1331','시스템 소프트웨어 개발자',null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:database-administrator','1351','데이터 시스템 전문가',null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:ict-support-technician','1361','정보 시스템 운영자',null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10')
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
)
select profile_key,'job_search','고용24 — 채용정보 상세검색','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','official_job_board',null,1,'2026-08-10'
from (values
  ('KR:software-developer'),('KR:data-analyst'),('KR:data-engineer'),('KR:cybersecurity-analyst'),
  ('KR:network-administrator'),('KR:cloud-engineer'),('KR:database-administrator'),('KR:ict-support-technician')
) as p(profile_key)
on conflict (profile_key,link_type,url) do update set label=excluded.label,provider_type=excluded.provider_type,sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_links (
  profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at
)
select profile_key,'source','한국고용정보원 — 한국고용직업분류 2025','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','official_classification',null,1,'2026-08-10'
from (values
  ('KR:software-developer'),('KR:data-analyst'),('KR:data-engineer'),('KR:cybersecurity-analyst'),
  ('KR:network-administrator'),('KR:cloud-engineer'),('KR:database-administrator'),('KR:ict-support-technician')
) as p(profile_key)
on conflict (profile_key,link_type,url) do update set label=excluded.label,provider_type=excluded.provider_type,sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_links (
  profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at
)
select profile_key,'source','한국고용정보원 — 직업별 활용 기술 및 도구 목록','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11203','official_occupation_research',null,2,'2026-08-10'
from (values
  ('KR:software-developer'),('KR:data-analyst'),('KR:data-engineer'),('KR:cybersecurity-analyst'),
  ('KR:network-administrator'),('KR:cloud-engineer'),('KR:database-administrator'),('KR:ict-support-technician')
) as p(profile_key)
on conflict (profile_key,link_type,url) do update set label=excluded.label,provider_type=excluded.provider_type,sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at)
select
  'KR:' || mapping.canonical_career_id,
  mapping.source_program_key,
  case when mapping.relation_type = 'direct' then 'direct' else 'related' end,
  mapping.source_checked_at
from public.program_occupation_kr_v1 mapping
where mapping.canonical_career_id in (
  'software-developer','data-analyst','data-engineer','cybersecurity-analyst',
  'network-administrator','cloud-engineer','database-administrator','ict-support-technician'
)
on conflict (profile_key,program_ref) do update set
  relation_type=excluded.relation_type,
  source_checked_at=excluded.source_checked_at;
