-- South Korea Trades & Construction occupation cohort.
-- Classification basis: Korean Employment Classification of Occupations (KECO) 2025.
-- Market scoring remains deliberately conservative until exact-code comparable labour series are normalised.

insert into public.country_occupation_profiles (
  profile_key,country_code,canonical_career_id,official_title,official_code_system,official_code_version,
  official_unit_group_code,currency,registration_required,registration_authority,registration_url,
  publication_status,source_checked_at,updated_at
)
values
  ('KR:carpenter','KR','carpenter','건축 목공','KECO','2025','7016','KRW',false,'한국산업인력공단 Q-Net 국가기술자격','https://www.q-net.or.kr/man001.do?gSite=Q','profile_ready','2026-08-10',now()),
  ('KR:electrician','KR','electrician','내선 전기공','KECO','2025','8312','KRW',false,'한국산업인력공단 Q-Net 국가기술자격','https://www.q-net.or.kr/man001.do?gSite=Q','profile_ready','2026-08-10',now()),
  ('KR:plumber','KR','plumber','건설 배관공','KECO','2025','7031','KRW',false,'한국산업인력공단 Q-Net 국가기술자격','https://www.q-net.or.kr/man001.do?gSite=Q','profile_ready','2026-08-10',now()),
  ('KR:wall-floor-tiler','KR','wall-floor-tiler','바닥재 시공원','KECO','2025','7024','KRW',false,'한국산업인력공단 Q-Net 국가기술자격','https://www.q-net.or.kr/man001.do?gSite=Q','profile_ready','2026-08-10',now()),
  ('KR:welder','KR','welder','용접원','KECO','2025','8241','KRW',false,'한국산업인력공단 Q-Net 국가기술자격','https://www.q-net.or.kr/man001.do?gSite=Q','profile_ready','2026-08-10',now()),
  ('KR:bricklayer','KR','bricklayer','조적공 및 석재 부설원','KECO','2025','7017','KRW',false,'한국산업인력공단 Q-Net 국가기술자격','https://www.q-net.or.kr/man001.do?gSite=Q','profile_ready','2026-08-10',now()),
  ('KR:hvac-technician','KR','hvac-technician','냉동·냉장·공조기 설치 및 정비원','KECO','2025','8115','KRW',false,'한국산업인력공단 Q-Net 국가기술자격','https://www.q-net.or.kr/man001.do?gSite=Q','profile_ready','2026-08-10',now()),
  ('KR:construction-manager','KR','construction-manager','건설 및 광업 관련 관리자','KECO','2025','0161','KRW',false,null,null,'profile_ready','2026-08-10',now())
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
  (
    'KR:carpenter','2026-08-10',0,0,0,0,15,0,0,0,5,20,'career-opportunity-kr-v1','provisional',
    jsonb_build_object(
      'classification_scope','KECO 2025 7016 건축 목공. Canonical carpenter scope is represented directly within the architectural-carpentry group.',
      'entry_level_basis','Vocational training and supervised site experience provide practical entry routes; a university degree is not assumed.',
      'qualification_note','Q-Net currently administers 건축목공기능사. This is treated as a relevant qualification, not a universal personal licence.',
      'market_scope','KEIS reports sector-wide construction employment stress together with ageing, youth avoidance and domestic skilled-labour shortages, but that evidence is not an exact 7016 shortage series.',
      'vacancy_scope','Work24 has current recruitment search, but a recurring exact-code three-month vacancy series has not yet been normalised.',
      'salary_scope','No current comparable exact-code national wage series is scored in KR v1.',
      'visa_scope','No occupation-specific visa credit is assigned without a verified pathway tied to the canonical occupation.',
      'score_scope','KR v1 is evidence-conservative and is not yet a completed cross-country market ranking.'
    ),'2026-08-10'
  ),
  (
    'KR:electrician','2026-08-10',0,0,0,0,12,0,0,0,4,16,'career-opportunity-kr-v1','provisional',
    jsonb_build_object(
      'classification_scope','KECO 2025 8312 내선 전기공, aligned to building electrical installation and maintenance.',
      'entry_level_basis','Vocational electrical training, practical site experience and national technical qualifications provide a structured entry route.',
      'qualification_note','Q-Net electrical qualifications can support employment, while regulated electrical-construction duties and project requirements must be checked separately.',
      'vacancy_scope','No recurring exact-code KECO 8312 vacancy series is normalised for scoring.',
      'salary_scope','No current comparable exact-code national wage series is scored in KR v1.',
      'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.',
      'score_scope','Only entry accessibility and burden are credited; market components remain unscored.'
    ),'2026-08-10'
  ),
  (
    'KR:plumber','2026-08-10',0,0,0,0,15,0,0,0,5,20,'career-opportunity-kr-v1','provisional',
    jsonb_build_object(
      'classification_scope','KECO 2025 7031 건설 배관공.',
      'entry_level_basis','Vocational training and supervised work experience are established trade-entry routes.',
      'qualification_note','Q-Net 배관기능사 is relevant evidence of trade competence; gas, fire-protection and facility work can carry separate requirements.',
      'vacancy_scope','Current Work24 recruitment is not yet converted into a recurring exact-code vacancy series.',
      'salary_scope','No current comparable exact-code national wage series is scored in KR v1.',
      'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.',
      'score_scope','Only entry accessibility and burden are credited; market components remain unscored.'
    ),'2026-08-10'
  ),
  (
    'KR:wall-floor-tiler','2026-08-10',0,0,0,0,15,0,0,0,5,20,'career-opportunity-kr-v1','provisional',
    jsonb_build_object(
      'classification_scope','KECO 2025 7024 바닥재 시공원 is broader than tile setting. CampCareer restricts the canonical profile to the 타일공 subset.',
      'entry_level_basis','Practical vocational training and supervised construction experience provide accessible entry routes.',
      'qualification_note','Q-Net 타일기능사 is a relevant national technical qualification, not a universal licence for all tile work.',
      'vacancy_scope','Broader 7024 recruitment is not presented as tile-only recurring vacancy evidence.',
      'salary_scope','Broader-group wage evidence is not scored as tile-only salary evidence.',
      'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.',
      'score_scope','The broader classification mapping is handled conservatively; market components remain unscored.'
    ),'2026-08-10'
  ),
  (
    'KR:welder','2026-08-10',0,0,0,0,15,0,0,0,5,20,'career-opportunity-kr-v1','provisional',
    jsonb_build_object(
      'classification_scope','KECO 2025 8241 용접원 across construction and industrial work.',
      'entry_level_basis','Vocational training and process-specific practical experience provide direct skilled-trade entry routes.',
      'qualification_note','Current Q-Net welding certificates are process-specific, including 피복아크용접기능사, 가스텅스텐아크용접기능사 and 이산화탄소가스아크용접기능사.',
      'vacancy_scope','The broad 8241 code is not converted into a construction-only recurring vacancy series.',
      'salary_scope','No current comparable exact-code national wage series is scored in KR v1.',
      'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.',
      'score_scope','Only entry accessibility and burden are credited; broad-industry market signals are not inferred.'
    ),'2026-08-10'
  ),
  (
    'KR:bricklayer','2026-08-10',0,0,0,0,15,0,0,0,5,20,'career-opportunity-kr-v1','provisional',
    jsonb_build_object(
      'classification_scope','KECO 2025 7017 조적공 및 석재 부설원 is broader than bricklaying. CampCareer restricts the canonical profile to 조적공 and 벽돌공 work.',
      'entry_level_basis','Practical training and supervised site experience provide the core entry route.',
      'qualification_note','Q-Net 조적기능사 is a relevant national technical qualification, not a universal personal licence.',
      'vacancy_scope','Broader 7017 recruitment is not presented as bricklayer-only recurring vacancy evidence.',
      'salary_scope','Broader-group wage evidence is not scored as bricklayer-only salary evidence.',
      'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.',
      'score_scope','The narrower canonical scope is preserved and market components remain unscored.'
    ),'2026-08-10'
  ),
  (
    'KR:hvac-technician','2026-08-10',0,0,0,0,12,0,0,0,4,16,'career-opportunity-kr-v1','provisional',
    jsonb_build_object(
      'classification_scope','KECO 2025 8115 냉동·냉장·공조기 설치 및 정비원.',
      'entry_level_basis','Mechanical or refrigeration training plus practical installation and maintenance experience provide a structured entry route.',
      'qualification_note','Q-Net 공조냉동기계기능사 and higher technical qualifications are relevant; role-specific facility and safety requirements may also apply.',
      'program_scope','One verified Study in Korea refrigeration and air-conditioning engineering programme is retained as related study, not a direct trade licence.',
      'vacancy_scope','No recurring exact-code KECO 8115 national vacancy series is normalised for scoring.',
      'salary_scope','No current comparable exact-code national wage series is scored in KR v1.',
      'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.',
      'score_scope','Only entry accessibility and burden are credited; market components remain unscored.'
    ),'2026-08-10'
  ),
  (
    'KR:construction-manager','2026-08-10',0,0,0,0,5,0,0,0,2,7,'career-opportunity-kr-v1','provisional',
    jsonb_build_object(
      'classification_scope','KECO 2025 0161 건설 및 광업 관련 관리자 is broader than construction management. CampCareer restricts the canonical profile to the construction-management subset.',
      'entry_level_basis','Management roles are experience-sensitive. Relevant architecture, architectural-engineering and civil-engineering degrees are related pathways rather than automatic entry to a manager role.',
      'qualification_note','Individual projects and appointments may require or prefer engineering, architecture, safety or construction qualifications; no universal 0161 personal licence is assumed.',
      'program_scope','Five verified Study in Korea architecture and civil-engineering programme mappings are retained as related study only.',
      'vacancy_scope','Current Work24 0161 advertisements show construction-management use but are not a normalised construction-only recurring vacancy series.',
      'salary_scope','Broad 0161 salary evidence is not scored as construction-manager-only salary evidence.',
      'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.',
      'score_scope','Limited entry credit reflects the experience-sensitive management pathway; market components remain unscored.'
    ),'2026-08-10'
  )
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
  ('KR:carpenter','7016','건축 목공',null,null,null,null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:electrician','8312','내선 전기공',null,null,null,null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:plumber','7031','건설 배관공',null,null,null,null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:wall-floor-tiler','7024','바닥재 시공원',null,null,null,null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:welder','8241','용접원',null,null,null,null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:bricklayer','7017','조적공 및 석재 부설원',null,null,null,null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:hvac-technician','8115','냉동·냉장·공조기 설치 및 정비원',null,null,null,null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:construction-manager','0161','건설 및 광업 관련 관리자',null,null,null,null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10')
on conflict (profile_key,official_code) do update set
  official_title=excluded.official_title,
  legacy_code_system=excluded.legacy_code_system,
  legacy_code_version=excluded.legacy_code_version,
  legacy_code=excluded.legacy_code,
  shortage_rating=excluded.shortage_rating,
  visa_eligible=excluded.visa_eligible,
  included_in_rollup=excluded.included_in_rollup,
  sort_order=excluded.sort_order,
  source_url=excluded.source_url,
  source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_links (
  profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at
)
values
  ('KR:carpenter','job_search','고용24 — 채용정보 상세검색','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','official_job_board',null,1,'2026-08-10'),
  ('KR:carpenter','source','한국고용정보원 — 한국고용직업분류 2025','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','official_classification',null,1,'2026-08-10'),
  ('KR:carpenter','source','Q-Net — 국가기술자격','https://www.q-net.or.kr/man001.do?gSite=Q','official_qualification',null,2,'2026-08-10'),
  ('KR:carpenter','source','한국고용정보원 — 2025 건설업 고용변동 분석','https://www.keis.or.kr/keis/ko/bbs/225/detail.do?pageIndex=1&pageItm=10&pstSn=64356&searchGbn=0&searchOrderSort=0','official_labour_market',null,3,'2026-08-10'),

  ('KR:electrician','job_search','고용24 — 채용정보 상세검색','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','official_job_board',null,1,'2026-08-10'),
  ('KR:electrician','source','한국고용정보원 — 한국고용직업분류 2025','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','official_classification',null,1,'2026-08-10'),
  ('KR:electrician','source','Q-Net — 국가기술자격','https://www.q-net.or.kr/man001.do?gSite=Q','official_qualification',null,2,'2026-08-10'),

  ('KR:plumber','job_search','고용24 — 채용정보 상세검색','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','official_job_board',null,1,'2026-08-10'),
  ('KR:plumber','source','한국고용정보원 — 한국고용직업분류 2025','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','official_classification',null,1,'2026-08-10'),
  ('KR:plumber','source','Q-Net — 국가기술자격','https://www.q-net.or.kr/man001.do?gSite=Q','official_qualification',null,2,'2026-08-10'),

  ('KR:wall-floor-tiler','job_search','고용24 — 채용정보 상세검색','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','official_job_board',null,1,'2026-08-10'),
  ('KR:wall-floor-tiler','source','한국고용정보원 — 한국고용직업분류 2025','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','official_classification',null,1,'2026-08-10'),
  ('KR:wall-floor-tiler','source','Q-Net — 국가기술자격','https://www.q-net.or.kr/man001.do?gSite=Q','official_qualification',null,2,'2026-08-10'),

  ('KR:welder','job_search','고용24 — 채용정보 상세검색','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','official_job_board',null,1,'2026-08-10'),
  ('KR:welder','source','한국고용정보원 — 한국고용직업분류 2025','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','official_classification',null,1,'2026-08-10'),
  ('KR:welder','source','Q-Net — 국가기술자격','https://www.q-net.or.kr/man001.do?gSite=Q','official_qualification',null,2,'2026-08-10'),

  ('KR:bricklayer','job_search','고용24 — 채용정보 상세검색','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','official_job_board',null,1,'2026-08-10'),
  ('KR:bricklayer','source','한국고용정보원 — 한국고용직업분류 2025','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','official_classification',null,1,'2026-08-10'),
  ('KR:bricklayer','source','Q-Net — 국가기술자격','https://www.q-net.or.kr/man001.do?gSite=Q','official_qualification',null,2,'2026-08-10'),

  ('KR:hvac-technician','job_search','고용24 — 채용정보 상세검색','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','official_job_board',null,1,'2026-08-10'),
  ('KR:hvac-technician','source','한국고용정보원 — 한국고용직업분류 2025','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','official_classification',null,1,'2026-08-10'),
  ('KR:hvac-technician','source','Q-Net — 국가기술자격','https://www.q-net.or.kr/man001.do?gSite=Q','official_qualification',null,2,'2026-08-10'),

  ('KR:construction-manager','job_search','고용24 — 채용정보 상세검색','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','official_job_board',null,1,'2026-08-10'),
  ('KR:construction-manager','source','한국고용정보원 — 한국고용직업분류 2025','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','official_classification',null,1,'2026-08-10'),
  ('KR:construction-manager','source','한국고용정보원 — 2025 건설업 고용변동 분석','https://www.keis.or.kr/keis/ko/bbs/225/detail.do?pageIndex=1&pageItm=10&pstSn=64356&searchGbn=0&searchOrderSort=0','official_labour_market',null,2,'2026-08-10')
on conflict (profile_key,link_type,url) do update set
  label=excluded.label,
  provider_type=excluded.provider_type,
  region_code=excluded.region_code,
  sort_order=excluded.sort_order,
  source_checked_at=excluded.source_checked_at;

-- Reuse only already-verified Korea programme mappings. They are intentionally stored as related study,
-- not as direct trade licences or guaranteed entry-to-practice programmes.
insert into public.country_occupation_program_links (
  profile_key,program_ref,relation_type,source_checked_at
)
values
  ('KR:hvac-technician','studyinkorea:100472:bachelor:refrigeration-air-conditioning-engineering','related','2026-08-09'),
  ('KR:construction-manager','studyinkorea:100061:bachelor:architecture-engineering','related','2026-08-09'),
  ('KR:construction-manager','studyinkorea:100070:bachelor:civil-environmental-architectural-engineering','related','2026-08-09'),
  ('KR:construction-manager','studyinkorea:100215:bachelor:architecture','related','2026-08-09'),
  ('KR:construction-manager','studyinkorea:100215:bachelor:civil-urban-environmental-engineering','related','2026-08-09'),
  ('KR:construction-manager','studyinkorea:100241:bachelor:civil-architectural-environmental-system-engineering','related','2026-08-09')
on conflict (profile_key,program_ref) do update set
  relation_type=excluded.relation_type,
  source_checked_at=excluded.source_checked_at;
