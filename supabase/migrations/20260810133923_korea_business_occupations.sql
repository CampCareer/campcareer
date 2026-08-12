-- South Korea Business occupation cohort.
-- Classification basis: Korean Employment Classification of Occupations (KECO) 2025.
-- Supply Chain Analyst, Auditor and Project Manager use broader anchors with explicit scope caveats.

insert into public.country_occupation_profiles (
  profile_key,country_code,canonical_career_id,official_title,official_code_system,official_code_version,
  official_unit_group_code,currency,registration_required,registration_authority,registration_url,
  publication_status,source_checked_at,updated_at
)
values
  ('KR:accountant','KR','accountant','회계 사무원','KECO','2025','0271','KRW',false,null,null,'profile_ready','2026-08-10',now()),
  ('KR:financial-analyst','KR','financial-analyst','투자 및 신용 분석가','KECO','2025','0311','KRW',false,null,null,'profile_ready','2026-08-10',now()),
  ('KR:business-analyst','KR','business-analyst','경영 및 진단 전문가 — business analyst scope','KECO','2025','0221','KRW',false,null,null,'profile_ready','2026-08-10',now()),
  ('KR:supply-chain-analyst','KR','supply-chain-analyst','자재관리 사무원 — supply-chain analyst scope','KECO','2025','0284','KRW',false,null,null,'profile_ready','2026-08-10',now()),
  ('KR:human-resources-specialist','KR','human-resources-specialist','인사 및 노사 관련 전문가 — HR specialist scope','KECO','2025','0222','KRW',false,null,null,'profile_ready','2026-08-10',now()),
  ('KR:marketing-specialist','KR','marketing-specialist','상품 기획 전문가 — marketing specialist scope','KECO','2025','0243','KRW',false,null,null,'profile_ready','2026-08-10',now()),
  ('KR:auditor','KR','auditor','회계사 — audit scope','KECO','2025','0231','KRW',false,'금융위원회 공인회계사 제도 — statutory external-audit scope only','https://www.fsc.go.kr/po040200/87049','profile_ready','2026-08-10',now()),
  ('KR:project-manager','KR','project-manager','경영 기획 사무원 — project-management scope','KECO','2025','0261','KRW',false,null,null,'profile_ready','2026-08-10',now())
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
  ('KR:accountant','2026-08-10',0,0,0,0,15,0,0,0,5,20,'career-opportunity-kr-v1','provisional',
    jsonb_build_object(
      'classification_scope','Canonical Accountant is anchored to KECO 2025 0271 회계 사무원 because CampCareer includes general corporate accounting as well as accounting-office work; licensed public accountants remain a separate regulated profession.',
      'entry_level_basis','Accounting, business and finance study provide accessible entry, with one reviewed Accounting master programme retained as direct study evidence.',
      'registration_scope','Ordinary accounting work has no universal personal licence; statutory public-accounting authority requires the separate CPA pathway.',
      'market_scope','Exact recurring 0271 vacancy, comparable salary, shortage and growth series are not yet normalised.',
      'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.'
    ),'2026-08-10'),
  ('KR:financial-analyst','2026-08-10',0,0,0,0,10,0,0,0,5,15,'career-opportunity-kr-v1','provisional',
    jsonb_build_object(
      'classification_scope','KECO 2025 0311 투자 및 신용 분석가 covers investment and credit-analysis work and is broader than some corporate-finance analyst titles.',
      'entry_level_basis','Two direct finance or quantitative-risk programmes and six related economics pathways are already reviewed.',
      'registration_scope','No universal personal licence is assumed for the canonical analyst role; regulated financial functions can impose separate requirements.',
      'market_scope','Finance-sector activity is not converted into exact 0311 salary, vacancy or shortage points.',
      'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.'
    ),'2026-08-10'),
  ('KR:business-analyst','2026-08-10',0,0,0,0,10,0,0,0,5,15,'career-opportunity-kr-v1','provisional',
    jsonb_build_object(
      'classification_scope','Business Analyst uses broader KECO 2025 0221 경영 및 진단 전문가 and is restricted to management-analysis, organisational-diagnosis and consulting work.',
      'entry_level_basis','One Information Systems programme remains direct and eight business or industrial-management programmes remain related.',
      'registration_scope','No universal statutory personal licence is required for general business analysis.',
      'market_scope','Broad 0221 group statistics are not presented as business-analyst-only evidence.',
      'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.'
    ),'2026-08-10'),
  ('KR:supply-chain-analyst','2026-08-10',0,0,0,0,10,0,0,0,5,15,'career-opportunity-kr-v1','provisional',
    jsonb_build_object(
      'classification_scope','KECO 2025 has no standalone Supply Chain Analyst classification. CampCareer uses 0284 자재관리 사무원 as a broader purchasing, materials, inventory and logistics-control anchor.',
      'entry_level_basis','Five reviewed industrial and systems-engineering programmes are related pathways only.',
      'registration_scope','No universal personal licence is assumed; customs, bonded-warehouse and regulated transport duties can have separate credentials.',
      'market_scope','Operational 0284 labour data are not treated as supply-chain-analyst-only evidence.',
      'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.'
    ),'2026-08-10'),
  ('KR:human-resources-specialist','2026-08-10',0,0,0,0,10,0,0,0,5,15,'career-opportunity-kr-v1','provisional',
    jsonb_build_object(
      'classification_scope','KECO 2025 0222 인사 및 노사 관련 전문가 includes HR and labour-relations work; CampCareer restricts this profile to general HR specialist scope.',
      'entry_level_basis','One reviewed Business Administration programme is retained as related study rather than direct professional preparation.',
      'registration_scope','General HR work has no universal licence; 공인노무사 is a separately regulated profession within the wider labour-relations space.',
      'market_scope','Shared 0222 group data are not presented as HR-specialist-only evidence.',
      'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.'
    ),'2026-08-10'),
  ('KR:marketing-specialist','2026-08-10',0,0,0,0,10,0,0,0,5,15,'career-opportunity-kr-v1','provisional',
    jsonb_build_object(
      'classification_scope','Marketing Specialist maps to the marketing subset of KECO 2025 0243 상품 기획 전문가.',
      'entry_level_basis','Three reviewed business, communication and media programmes remain related study.',
      'registration_scope','No universal statutory personal licence is required for marketing-specialist work.',
      'market_scope','The broader 0243 product-planning group is not used as marketing-only salary, shortage or vacancy evidence.',
      'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.'
    ),'2026-08-10'),
  ('KR:auditor','2026-08-10',0,0,0,0,8,0,0,0,3,11,'career-opportunity-kr-v1','provisional',
    jsonb_build_object(
      'classification_scope','Auditor is anchored to KECO 2025 0231 회계사 for professional financial-audit scope, while internal-audit roles can sit outside licensed public-accounting practice.',
      'entry_level_basis','The reviewed Accounting master programme remains related because a degree alone does not confer statutory audit authority.',
      'registration_scope','Not every auditor is a CPA, but statutory public-accounting and external financial-audit work follows the regulated 공인회계사 framework.',
      'market_scope','CPA exam volumes and accounting-sector demand are not treated as exact auditor labour-market evidence.',
      'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.'
    ),'2026-08-10'),
  ('KR:project-manager','2026-08-10',0,0,0,0,8,0,0,0,5,13,'career-opportunity-kr-v1','provisional',
    jsonb_build_object(
      'classification_scope','KECO 2025 has no universal cross-industry Project Manager occupation. CampCareer uses 0261 경영 기획 사무원 as a general project-planning anchor.',
      'entry_level_basis','Four reviewed business or industrial-management programmes are related pathways, while many PM roles still expect prior domain or delivery experience.',
      'registration_scope','No universal statutory personal licence is required for general project management; sector-specific duties may impose separate requirements.',
      'market_scope','Cross-industry salaries and vacancies are not synthesised into a single exact PM market score.',
      'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.'
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
  ('KR:accountant','0271','회계 사무원',null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:financial-analyst','0311','투자 및 신용 분석가',null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:business-analyst','0221','경영 및 진단 전문가 — business analyst scope',null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:supply-chain-analyst','0284','자재관리 사무원 — supply-chain analyst scope',null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:human-resources-specialist','0222','인사 및 노사 관련 전문가 — HR specialist scope',null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:marketing-specialist','0243','상품 기획 전문가 — marketing specialist scope',null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:auditor','0231','회계사 — audit scope',null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:project-manager','0261','경영 기획 사무원 — project-management scope',null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10')
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
values
  ('KR:accountant','job_search','고용24 — 채용정보 상세검색','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','official_job_board',null,1,'2026-08-10'),
  ('KR:accountant','source','한국고용정보원 — 한국고용직업분류 2025','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','official_classification',null,1,'2026-08-10'),
  ('KR:accountant','source','금융위원회 — 2026 공인회계사 시험','https://www.fsc.go.kr/po040200/87049','official_regulator',null,2,'2026-08-10'),
  ('KR:financial-analyst','job_search','고용24 — 채용정보 상세검색','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','official_job_board',null,1,'2026-08-10'),
  ('KR:financial-analyst','source','한국고용정보원 — 한국고용직업분류 2025','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','official_classification',null,1,'2026-08-10'),
  ('KR:business-analyst','job_search','고용24 — 채용정보 상세검색','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','official_job_board',null,1,'2026-08-10'),
  ('KR:business-analyst','source','한국고용정보원 — 한국고용직업분류 2025','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','official_classification',null,1,'2026-08-10'),
  ('KR:supply-chain-analyst','job_search','고용24 — 채용정보 상세검색','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','official_job_board',null,1,'2026-08-10'),
  ('KR:supply-chain-analyst','source','한국고용정보원 — 한국고용직업분류 2025','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','official_classification',null,1,'2026-08-10'),
  ('KR:human-resources-specialist','job_search','고용24 — 채용정보 상세검색','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','official_job_board',null,1,'2026-08-10'),
  ('KR:human-resources-specialist','source','한국고용정보원 — 한국고용직업분류 2025','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','official_classification',null,1,'2026-08-10'),
  ('KR:marketing-specialist','job_search','고용24 — 채용정보 상세검색','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','official_job_board',null,1,'2026-08-10'),
  ('KR:marketing-specialist','source','한국고용정보원 — 한국고용직업분류 2025','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','official_classification',null,1,'2026-08-10'),
  ('KR:auditor','job_search','고용24 — 채용정보 상세검색','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','official_job_board',null,1,'2026-08-10'),
  ('KR:auditor','source','한국고용정보원 — 한국고용직업분류 2025','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','official_classification',null,1,'2026-08-10'),
  ('KR:auditor','source','금융위원회 — 2026 공인회계사 시험','https://www.fsc.go.kr/po040200/87049','official_regulator',null,2,'2026-08-10'),
  ('KR:project-manager','job_search','고용24 — 채용정보 상세검색','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','official_job_board',null,1,'2026-08-10'),
  ('KR:project-manager','source','한국고용정보원 — 한국고용직업분류 2025','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','official_classification',null,1,'2026-08-10')
on conflict (profile_key,link_type,url) do update set
  label=excluded.label,
  provider_type=excluded.provider_type,
  region_code=excluded.region_code,
  sort_order=excluded.sort_order,
  source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_program_links (
  profile_key,program_ref,relation_type,source_checked_at
)
values
  ('KR:accountant','studyinkorea:100061:master:accounting','direct','2026-08-09'),
  ('KR:auditor','studyinkorea:100061:master:accounting','related','2026-08-09'),
  ('KR:business-analyst','studyinkorea:100487:bachelor:information-systems','direct','2026-08-09'),
  ('KR:business-analyst','studyinkorea:100061:bachelor:business-administration','related','2026-08-09'),
  ('KR:business-analyst','studyinkorea:100070:bachelor:business-administration','related','2026-08-09'),
  ('KR:business-analyst','studyinkorea:100190:bachelor:business-administration','related','2026-08-09'),
  ('KR:business-analyst','studyinkorea:100215:bachelor:business-administration','related','2026-08-09'),
  ('KR:business-analyst','studyinkorea:100241:bachelor:business-administration','related','2026-08-09'),
  ('KR:business-analyst','studyinkorea:100289:bachelor:business-administration','related','2026-08-09'),
  ('KR:business-analyst','studyinkorea:100400:bachelor:industrial-management-engineering','related','2026-08-09'),
  ('KR:business-analyst','studyinkorea:100487:bachelor:business-administration','related','2026-08-09'),
  ('KR:financial-analyst','studyinkorea:100289:bachelor:quantitative-risk-management','direct','2026-08-09'),
  ('KR:financial-analyst','studyinkorea:100487:bachelor:finance','direct','2026-08-09'),
  ('KR:financial-analyst','studyinkorea:100061:bachelor:economics','related','2026-08-09'),
  ('KR:financial-analyst','studyinkorea:100070:bachelor:economics','related','2026-08-09'),
  ('KR:financial-analyst','studyinkorea:100190:bachelor:economics','related','2026-08-09'),
  ('KR:financial-analyst','studyinkorea:100215:bachelor:economics','related','2026-08-09'),
  ('KR:financial-analyst','studyinkorea:100241:bachelor:global-economics','related','2026-08-09'),
  ('KR:financial-analyst','studyinkorea:100289:bachelor:economics','related','2026-08-09'),
  ('KR:human-resources-specialist','studyinkorea:100215:bachelor:business-administration','related','2026-08-09'),
  ('KR:marketing-specialist','studyinkorea:100215:bachelor:business-administration','related','2026-08-09'),
  ('KR:marketing-specialist','studyinkorea:100215:bachelor:communication','related','2026-08-09'),
  ('KR:marketing-specialist','studyinkorea:100332:bachelor:communication-media','related','2026-08-09'),
  ('KR:project-manager','studyinkorea:100215:bachelor:business-administration','related','2026-08-09'),
  ('KR:project-manager','studyinkorea:100289:bachelor:business-administration','related','2026-08-09'),
  ('KR:project-manager','studyinkorea:100400:bachelor:industrial-management-engineering','related','2026-08-09'),
  ('KR:project-manager','studyinkorea:100487:bachelor:business-administration','related','2026-08-09'),
  ('KR:supply-chain-analyst','studyinkorea:100070:bachelor:industrial-management-engineering','related','2026-08-09'),
  ('KR:supply-chain-analyst','studyinkorea:100215:bachelor:industrial-engineering','related','2026-08-09'),
  ('KR:supply-chain-analyst','studyinkorea:100241:bachelor:systems-management-engineering','related','2026-08-09'),
  ('KR:supply-chain-analyst','studyinkorea:100406:bachelor:industrial-systems-engineering','related','2026-08-09'),
  ('KR:supply-chain-analyst','studyinkorea:100487:bachelor:industrial-engineering','related','2026-08-09')
on conflict (profile_key,program_ref) do update set
  relation_type=excluded.relation_type,
  source_checked_at=excluded.source_checked_at;
