-- South Korea Engineering occupation cohort.
-- Classification basis: Korean Employment Classification of Occupations (KECO) 2025.
-- Manufacturing Engineer, Industrial Engineer and Engineering Technician use broader anchors with explicit scope caveats.

insert into public.country_occupation_profiles (
  profile_key,country_code,canonical_career_id,official_title,official_code_system,official_code_version,
  official_unit_group_code,currency,registration_required,registration_authority,registration_url,
  publication_status,source_checked_at,updated_at
)
values
  ('KR:civil-engineer','KR','civil-engineer','토목공학 기술자','KECO','2025','1403','KRW',false,'한국산업인력공단 Q-Net 국가기술자격','https://www.q-net.or.kr/man001.do?gSite=Q','profile_ready','2026-08-10',now()),
  ('KR:mechanical-engineer','KR','mechanical-engineer','기계공학 기술자 및 연구원','KECO','2025','1511','KRW',false,'한국산업인력공단 Q-Net 국가기술자격','https://www.q-net.or.kr/man001.do?gSite=Q','profile_ready','2026-08-10',now()),
  ('KR:electrical-engineer','KR','electrical-engineer','전기공학 기술자 및 연구원','KECO','2025','1531','KRW',false,'한국산업인력공단 Q-Net 국가기술자격','https://www.q-net.or.kr/man001.do?gSite=Q','profile_ready','2026-08-10',now()),
  ('KR:manufacturing-engineer','KR','manufacturing-engineer','기계공학 기술자 및 연구원 — 제조 엔지니어 scope','KECO','2025','1511','KRW',false,null,null,'profile_ready','2026-08-10',now()),
  ('KR:industrial-engineer','KR','industrial-engineer','기타 공학 관련 기술자 및 시험원 — 산업공학 엔지니어 scope','KECO','2025','1599','KRW',false,null,null,'profile_ready','2026-08-10',now()),
  ('KR:chemical-engineer','KR','chemical-engineer','화학공학 기술자 및 연구원','KECO','2025','1541','KRW',false,'한국산업인력공단 Q-Net 국가기술자격','https://www.q-net.or.kr/man001.do?gSite=Q','profile_ready','2026-08-10',now()),
  ('KR:environmental-engineer','KR','environmental-engineer','환경공학 기술자 및 연구원','KECO','2025','1555','KRW',false,'한국산업인력공단 Q-Net 국가기술자격','https://www.q-net.or.kr/man001.do?gSite=Q','profile_ready','2026-08-10',now()),
  ('KR:engineering-technician','KR','engineering-technician','기타 공학 관련 기술자 및 시험원 — Engineering Technician umbrella','KECO','2025','1599','KRW',false,null,null,'profile_ready','2026-08-10',now())
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
  ('KR:civil-engineer','2026-08-10',0,0,0,0,10,0,0,0,5,15,'career-opportunity-kr-v1','provisional',
    jsonb_build_object(
      'classification_scope','KECO 2025 1403 토목공학 기술자 is a direct canonical mapping.',
      'entry_level_basis','Reviewed Korean civil-engineering Bachelor programmes provide a structured graduate pathway.',
      'qualification_note','Q-Net 토목기사 and higher credentials are relevant to many project or statutory duties but are not assumed mandatory for every civil-engineer job.',
      'market_scope','Exact recurring 1403 vacancy, comparable salary and shortage series are not yet normalised.',
      'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.',
      'score_scope','KR v1 credits only entry accessibility and non-universal licensing burden.'
    ),'2026-08-10'),
  ('KR:mechanical-engineer','2026-08-10',0,0,0,0,10,0,0,0,5,15,'career-opportunity-kr-v1','provisional',
    jsonb_build_object(
      'classification_scope','KECO 2025 1511 기계공학 기술자 및 연구원 is the direct occupational anchor and spans multiple mechanical industries.',
      'entry_level_basis','A large reviewed set of Korean mechanical-engineering Bachelor programmes provides direct graduate entry.',
      'qualification_note','Mechanical and facility qualifications are role-dependent rather than a universal personal licence.',
      'market_scope','Broader machinery, automotive, shipbuilding or aerospace conditions are not substituted for exact 1511 market evidence.',
      'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.',
      'score_scope','KR v1 credits only entry accessibility and non-universal licensing burden.'
    ),'2026-08-10'),
  ('KR:electrical-engineer','2026-08-10',0,0,0,0,10,0,0,0,4,14,'career-opportunity-kr-v1','provisional',
    jsonb_build_object(
      'classification_scope','KECO 2025 1531 전기공학 기술자 및 연구원 is the core mapping.',
      'entry_level_basis','Reviewed electrical and electrical-electronic engineering degrees provide structured graduate entry.',
      'qualification_note','Electrical construction, safety, supervision and designated technical duties can impose additional statutory qualification requirements, so burden credit is slightly reduced.',
      'market_scope','No exact recurring 1531 vacancy, salary, shortage or growth series is scored in KR v1.',
      'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.',
      'score_scope','Only entry accessibility and burden are credited.'
    ),'2026-08-10'),
  ('KR:manufacturing-engineer','2026-08-10',0,0,0,0,10,0,0,0,5,15,'career-opportunity-kr-v1','provisional',
    jsonb_build_object(
      'classification_scope','KECO 2025 has no standalone Manufacturing Engineer 세분류. CampCareer uses broader 1511 기계공학 기술자 및 연구원 only for the manufacturing-engineering scope.',
      'entry_level_basis','Reviewed mechanical, industrial and automotive programmes are related academic pathways; none is promoted beyond its existing reviewed relation.',
      'qualification_note','No universal manufacturing-engineer personal licence is assumed.',
      'market_scope','1511 group labour data is not treated as manufacturing-engineer-only evidence.',
      'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.',
      'score_scope','The broader mapping remains provisional and market components stay unscored.'
    ),'2026-08-10'),
  ('KR:industrial-engineer','2026-08-10',0,0,0,0,10,0,0,0,5,15,'career-opportunity-kr-v1','provisional',
    jsonb_build_object(
      'classification_scope','KECO 2025 has no dedicated 산업공학 기술자 세분류. CampCareer uses 1599 기타 공학 관련 기술자 및 시험원 as a broad anchor and restricts scope to systems, operations, productivity and optimisation engineering.',
      'entry_level_basis','Nine reviewed Korean industrial-engineering and industrial-management degree mappings provide direct study evidence.',
      'qualification_note','No universal industrial-engineer personal licence is assumed.',
      'market_scope','The broad 1599 classification cannot support industrial-engineer-only wage, shortage or vacancy scoring.',
      'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.',
      'score_scope','Only structured graduate entry and low universal licensing burden are credited.'
    ),'2026-08-10'),
  ('KR:chemical-engineer','2026-08-10',0,0,0,0,10,0,0,0,5,15,'career-opportunity-kr-v1','provisional',
    jsonb_build_object(
      'classification_scope','KECO 2025 1541 화학공학 기술자 및 연구원 is a direct mapping.',
      'entry_level_basis','Reviewed chemical-engineering and closely aligned chemical/biological programmes provide direct degree pathways.',
      'qualification_note','Q-Net 화공기사 and higher credentials are useful for relevant process and plant roles but are not a universal licence.',
      'market_scope','Sector-level chemical demand is not converted into exact 1541 shortage or salary points.',
      'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.',
      'score_scope','KR v1 credits only entry accessibility and non-universal licensing burden.'
    ),'2026-08-10'),
  ('KR:environmental-engineer','2026-08-10',0,0,0,0,10,0,0,0,4,14,'career-opportunity-kr-v1','provisional',
    jsonb_build_object(
      'classification_scope','KECO 2025 1555 환경공학 기술자 및 연구원 is a direct mapping.',
      'entry_level_basis','Reviewed environmental, civil-environmental and energy-environment degree pathways support graduate entry.',
      'qualification_note','Statutory environmental-management, measurement and facility duties can require specific credentials, so burden credit is slightly reduced.',
      'market_scope','Neighbouring energy, testing and industrial-environment codes are not aggregated into the canonical market score.',
      'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.',
      'score_scope','Exact shortage, vacancy, salary and growth evidence remains unscored.'
    ),'2026-08-10'),
  ('KR:engineering-technician','2026-08-10',0,0,0,0,15,0,0,0,5,20,'career-opportunity-kr-v1','provisional',
    jsonb_build_object(
      'classification_scope','Engineering Technician is a CampCareer umbrella. KECO 2025 distributes discipline-specific testing and technical-support work across multiple codes; 1599 is retained only as a broad profile anchor.',
      'entry_level_basis','Vocational, junior-college, practical and discipline-specific technical routes support relatively accessible entry compared with professional-engineer careers.',
      'qualification_note','No single universal licence covers the umbrella; actual requirements depend on the discipline and statutory duty.',
      'program_scope','Only two already-reviewed Korean programmes are linked and both remain related rather than direct.',
      'market_scope','Unrelated technician groups are not aggregated into a synthetic national market score.',
      'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.',
      'score_scope','Higher entry accessibility is credited while all market components remain unscored.'
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
  profile_key,official_code,official_title,legacy_code_system,legacy_code_version,legacy_code,
  shortage_rating,visa_eligible,included_in_rollup,sort_order,source_url,source_checked_at
)
values
  ('KR:civil-engineer','1403','토목공학 기술자',null,null,null,null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:mechanical-engineer','1511','기계공학 기술자 및 연구원',null,null,null,null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:electrical-engineer','1531','전기공학 기술자 및 연구원',null,null,null,null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:manufacturing-engineer','1511','기계공학 기술자 및 연구원 — manufacturing scope',null,null,null,null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:industrial-engineer','1599','기타 공학 관련 기술자 및 시험원 — industrial engineering scope',null,null,null,null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:chemical-engineer','1541','화학공학 기술자 및 연구원',null,null,null,null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:environmental-engineer','1555','환경공학 기술자 및 연구원',null,null,null,null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:engineering-technician','1599','기타 공학 관련 기술자 및 시험원 — umbrella anchor',null,null,null,null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:engineering-technician','1407','건설자재 시험원',null,null,null,null,null,false,2,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:engineering-technician','1513','기계 및 로봇공학 시험원',null,null,null,null,null,false,3,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:engineering-technician','1522','금속 및 재료공학 시험원',null,null,null,null,null,false,4,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:engineering-technician','1534','전기 및 전자공학 시험원',null,null,null,null,null,false,5,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:engineering-technician','1542','화학공학 시험원',null,null,null,null,null,false,6,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:engineering-technician','1552','가스 및 에너지 시험원',null,null,null,null,null,false,7,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:engineering-technician','1554','신재생에너지 시험원',null,null,null,null,null,false,8,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:engineering-technician','1556','환경공학 시험원',null,null,null,null,null,false,9,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:engineering-technician','1562','섬유공학 시험원',null,null,null,null,null,false,10,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:engineering-technician','1572','식품공학 시험원',null,null,null,null,null,false,11,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:engineering-technician','1583','소방·방재 및 산업안전 시험원',null,null,null,null,null,false,12,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10')
on conflict (profile_key,official_code) do update set
  official_title=excluded.official_title,
  included_in_rollup=excluded.included_in_rollup,
  sort_order=excluded.sort_order,
  source_url=excluded.source_url,
  source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_links (
  profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at
)
select profile_key,'job_search','고용24 — 채용정보 상세검색','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','official_job_board',null,1,'2026-08-10'
from public.country_occupation_profiles
where country_code='KR' and canonical_career_id in (
  'civil-engineer','mechanical-engineer','electrical-engineer','manufacturing-engineer','industrial-engineer','chemical-engineer','environmental-engineer','engineering-technician'
)
on conflict (profile_key,link_type,url) do update set label=excluded.label,provider_type=excluded.provider_type,sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_links (
  profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at
)
select profile_key,'source','한국고용정보원 — 한국고용직업분류 2025','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','official_classification',null,1,'2026-08-10'
from public.country_occupation_profiles
where country_code='KR' and canonical_career_id in (
  'civil-engineer','mechanical-engineer','electrical-engineer','manufacturing-engineer','industrial-engineer','chemical-engineer','environmental-engineer','engineering-technician'
)
on conflict (profile_key,link_type,url) do update set label=excluded.label,provider_type=excluded.provider_type,sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_links (
  profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at
)
select profile_key,'source','Q-Net — 국가기술자격','https://www.q-net.or.kr/man001.do?gSite=Q','official_qualification',null,2,'2026-08-10'
from public.country_occupation_profiles
where profile_key in ('KR:civil-engineer','KR:mechanical-engineer','KR:electrical-engineer','KR:chemical-engineer','KR:environmental-engineer')
on conflict (profile_key,link_type,url) do update set label=excluded.label,provider_type=excluded.provider_type,sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

-- Reuse only already-reviewed Korean programme mappings. Preserve direct mappings; all other reviewed relationships remain related.
insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at)
select
  'KR:' || canonical_career_id,
  source_program_key,
  case when relation_type='direct' then 'direct' else 'related' end,
  source_checked_at
from public.program_occupation_kr_v1
where canonical_career_id in (
  'civil-engineer','mechanical-engineer','electrical-engineer','manufacturing-engineer','industrial-engineer','chemical-engineer','environmental-engineer','engineering-technician'
)
on conflict (profile_key,program_ref) do update set
  relation_type=excluded.relation_type,
  source_checked_at=excluded.source_checked_at;
