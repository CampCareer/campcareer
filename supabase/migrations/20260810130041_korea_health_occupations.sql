-- South Korea Health occupation cohort: 8 canonical careers.
-- Classification basis: Korean Employment Classification of Occupations (KECO) 2025.
-- KR v1 remains evidence-conservative: exact-code comparable market and visa series are not inferred.

insert into public.country_occupation_profiles (
  profile_key,country_code,canonical_career_id,official_title,official_code_system,official_code_version,
  official_unit_group_code,currency,registration_required,registration_authority,registration_url,
  publication_status,source_checked_at,updated_at
)
values
  ('KR:registered-nurse','KR','registered-nurse','간호사','KECO','2025','3040','KRW',true,'보건복지부; 한국보건의료인국가시험원','https://www.kuksiwon.or.kr/','profile_ready','2026-08-10',now()),
  ('KR:midwife','KR','midwife','간호사 — 조산사 scope','KECO','2025','3040','KRW',true,'보건복지부; 한국보건의료인국가시험원','https://www.kuksiwon.or.kr/','profile_ready','2026-08-10',now()),
  ('KR:care-worker','KR','care-worker','요양보호사','KECO','2025','5501','KRW',true,'시·도지사; 요양보호사교육기관 및 자격시험 체계','https://www.kuksiwon.or.kr/','profile_ready','2026-08-10',now()),
  ('KR:physiotherapist','KR','physiotherapist','물리 및 작업 치료사 — 물리치료사 scope','KECO','2025','3065','KRW',true,'보건복지부; 한국보건의료인국가시험원','https://www.kuksiwon.or.kr/','profile_ready','2026-08-10',now()),
  ('KR:medical-laboratory-technician','KR','medical-laboratory-technician','임상병리사','KECO','2025','3061','KRW',true,'보건복지부; 한국보건의료인국가시험원','https://www.kuksiwon.or.kr/','profile_ready','2026-08-10',now()),
  ('KR:radiographer','KR','radiographer','방사선사','KECO','2025','3062','KRW',true,'보건복지부; 한국보건의료인국가시험원','https://www.kuksiwon.or.kr/','profile_ready','2026-08-10',now()),
  ('KR:pharmacist','KR','pharmacist','약사','KECO','2025','3031','KRW',true,'보건복지부; 한국보건의료인국가시험원','https://www.kuksiwon.or.kr/','profile_ready','2026-08-10',now()),
  ('KR:occupational-therapist','KR','occupational-therapist','물리 및 작업 치료사 — 작업치료사 scope','KECO','2025','3065','KRW',true,'보건복지부; 한국보건의료인국가시험원','https://www.kuksiwon.or.kr/','profile_ready','2026-08-10',now())
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
  ('KR:registered-nurse','2026-08-10',0,0,0,0,13,0,0,0,2,15,'career-opportunity-kr-v1','provisional',
    jsonb_build_object(
      'classification_scope','KECO 2025 3040 간호사. Canonical Registered Nurse is represented within the licensed nurse group.',
      'registration_basis','The Nursing Act requires eligible nursing graduates to pass the national nursing examination and obtain a Ministry of Health and Welfare licence.',
      'program_scope','Six verified Study in Korea nursing mappings are retained as direct study evidence; programme presence does not by itself guarantee national-exam eligibility for every international student.',
      'market_scope','No recurring exact-code KECO 3040 vacancy, comparable salary or official shortage series is normalised for KR v1.',
      'visa_scope','No occupation-specific visa credit is assigned without a verified pathway tied to this canonical occupation.'
    ),'2026-08-10'),
  ('KR:midwife','2026-08-10',0,0,0,0,3,0,0,0,1,4,'career-opportunity-kr-v1','provisional',
    jsonb_build_object(
      'classification_scope','KECO 2025 places 조산사 within broader 3040 간호사; the canonical profile is restricted to midwifery.',
      'registration_basis','Under the Medical Service Act currently in force, the domestic route requires a nursing licence, one year of midwifery training at a recognised medical institution, the national midwife examination and a Ministry licence.',
      'program_scope','No direct Korean midwifery programme mapping is published because general nursing degrees do not satisfy the full statutory midwife route by themselves.',
      'market_scope','Broader 3040 nursing labour evidence is not reused as midwife-only evidence.',
      'visa_scope','No occupation-specific visa credit is assigned without verified midwife-specific pathway evidence.'
    ),'2026-08-10'),
  ('KR:care-worker','2026-08-10',0,0,0,0,15,0,0,0,4,19,'career-opportunity-kr-v1','provisional',
    jsonb_build_object(
      'classification_scope','Exact KECO 2025 5501 요양보호사; unlicensed 간병인 5502 and other care roles are excluded.',
      'registration_basis','The Elderly Welfare Act requires completion of the prescribed caregiver education course, passing the caregiver qualification examination and issuance of the qualification certificate.',
      'program_scope','Two verified social-welfare degree mappings are retained as related study only and do not replace the statutory caregiver training and qualification route.',
      'market_scope','No recurring exact-code KECO 5501 vacancy, comparable wage or shortage series is normalised for KR v1.',
      'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.'
    ),'2026-08-10'),
  ('KR:physiotherapist','2026-08-10',0,0,0,0,12,0,0,0,2,14,'career-opportunity-kr-v1','provisional',
    jsonb_build_object(
      'classification_scope','KECO 2025 3065 combines 물리 및 작업 치료사; this profile is restricted to 물리치료사.',
      'registration_basis','Physical therapists are licensed medical technologists under the Medical Technologists Act and require the applicable national examination and Ministry licence.',
      'program_scope','One verified Study in Korea Physical Therapy programme is retained as direct study evidence, subject to individual national-exam eligibility review.',
      'market_scope','Broader KECO 3065 observations are not presented as physical-therapist-only market evidence.',
      'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.'
    ),'2026-08-10'),
  ('KR:medical-laboratory-technician','2026-08-10',0,0,0,0,12,0,0,0,2,14,'career-opportunity-kr-v1','provisional',
    jsonb_build_object(
      'classification_scope','Exact KECO 2025 3061 임상병리사.',
      'registration_basis','Clinical laboratory technologists are licensed medical technologists under the Medical Technologists Act and require the applicable national examination and Ministry licence.',
      'program_scope','One verified Clinical Laboratory Science mapping is direct; four biotechnology or life-science mappings remain related and are not treated as substitutes for professional licensure.',
      'market_scope','No recurring exact-code KECO 3061 vacancy, comparable salary or official shortage series is normalised for KR v1.',
      'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.'
    ),'2026-08-10'),
  ('KR:radiographer','2026-08-10',0,0,0,0,12,0,0,0,2,14,'career-opportunity-kr-v1','provisional',
    jsonb_build_object(
      'classification_scope','Exact KECO 2025 3062 방사선사.',
      'registration_basis','Radiologic technologists are licensed medical technologists under the Medical Technologists Act and require the applicable national examination and Ministry licence.',
      'program_scope','One verified Study in Korea Radiological Science mapping is retained as direct study evidence, subject to individual national-exam eligibility review.',
      'market_scope','No recurring exact-code KECO 3062 vacancy, comparable salary or official shortage series is normalised for KR v1.',
      'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.'
    ),'2026-08-10'),
  ('KR:pharmacist','2026-08-10',0,0,0,0,8,0,0,0,1,9,'career-opportunity-kr-v1','provisional',
    jsonb_build_object(
      'classification_scope','Exact KECO 2025 3031 약사, separated from 3032 한약사 in the revised classification.',
      'registration_basis','The Pharmaceutical Affairs Act requires graduation with an accredited pharmacy degree, passing the national pharmacist examination and receiving a Ministry of Health and Welfare pharmacist licence.',
      'program_scope','Two verified Study in Korea pharmacy mappings are retained as direct study evidence; professional-exam eligibility remains an individual and programme-level requirement.',
      'market_scope','No recurring exact-code KECO 3031 vacancy, comparable salary or official shortage series is normalised for KR v1.',
      'visa_scope','No occupation-specific visa credit is assigned without verified pathway evidence.'
    ),'2026-08-10'),
  ('KR:occupational-therapist','2026-08-10',0,0,0,0,12,0,0,0,2,14,'career-opportunity-kr-v1','provisional',
    jsonb_build_object(
      'classification_scope','KECO 2025 3065 combines 물리 및 작업 치료사; this profile is restricted to 작업치료사.',
      'registration_basis','Occupational therapists are licensed medical technologists under the Medical Technologists Act and require the applicable national examination and Ministry licence.',
      'program_scope','One verified Study in Korea Occupational Therapy mapping is retained as direct study evidence, subject to individual national-exam eligibility review.',
      'market_scope','Broader KECO 3065 observations are not presented as occupational-therapist-only market evidence.',
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
  profile_key,official_code,official_title,legacy_code_system,legacy_code_version,legacy_code,
  shortage_rating,visa_eligible,included_in_rollup,sort_order,source_url,source_checked_at
)
values
  ('KR:registered-nurse','3040','간호사',null,null,null,null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:midwife','3040','간호사',null,null,null,null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:care-worker','5501','요양보호사',null,null,null,null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:physiotherapist','3065','물리 및 작업 치료사',null,null,null,null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:medical-laboratory-technician','3061','임상병리사',null,null,null,null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:radiographer','3062','방사선사',null,null,null,null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:pharmacist','3031','약사',null,null,null,null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10'),
  ('KR:occupational-therapist','3065','물리 및 작업 치료사',null,null,null,null,null,true,1,'https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','2026-08-10')
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
  ('KR:registered-nurse','job_search','고용24 — 채용정보 상세검색','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','official_job_board',null,1,'2026-08-10'),
  ('KR:registered-nurse','source','한국고용정보원 — 한국고용직업분류 2025','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','official_classification',null,1,'2026-08-10'),
  ('KR:registered-nurse','source','국가법령정보센터 — 간호법','https://www.law.go.kr/LSW/lsInfoP.do?ancYnChk=&chrClsCd=010202&efYd=20250621&lsiSeq=265413&urlMode=lsInfoP','official_regulation',null,2,'2026-08-10'),

  ('KR:midwife','job_search','고용24 — 채용정보 상세검색','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','official_job_board',null,1,'2026-08-10'),
  ('KR:midwife','source','한국고용정보원 — 한국고용직업분류 2025','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','official_classification',null,1,'2026-08-10'),
  ('KR:midwife','source','국가법령정보센터 — 의료법 조산사 면허','https://www.law.go.kr/LSW/lsInfoP.do?ancYnChk=0&chrClsCd=010202&efYd=20260407&lsiSeq=285327&urlMode=lsInfoP','official_regulation',null,2,'2026-08-10'),

  ('KR:care-worker','job_search','고용24 — 채용정보 상세검색','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','official_job_board',null,1,'2026-08-10'),
  ('KR:care-worker','source','한국고용정보원 — 한국고용직업분류 2025','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','official_classification',null,1,'2026-08-10'),
  ('KR:care-worker','source','국가법령정보센터 — 노인복지법 요양보호사','https://www.law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1028261159','official_regulation',null,2,'2026-08-10'),

  ('KR:physiotherapist','job_search','고용24 — 채용정보 상세검색','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','official_job_board',null,1,'2026-08-10'),
  ('KR:physiotherapist','source','한국고용정보원 — 한국고용직업분류 2025','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','official_classification',null,1,'2026-08-10'),
  ('KR:physiotherapist','source','국가법령정보센터 — 의료기사 등에 관한 법률','https://www.law.go.kr/LSW/lsInfoP.do?ancYnChk=0&chrClsCd=010202&efYd=20260701&lsiSeq=281937&urlMode=lsInfoP','official_regulation',null,2,'2026-08-10'),

  ('KR:medical-laboratory-technician','job_search','고용24 — 채용정보 상세검색','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','official_job_board',null,1,'2026-08-10'),
  ('KR:medical-laboratory-technician','source','한국고용정보원 — 한국고용직업분류 2025','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','official_classification',null,1,'2026-08-10'),
  ('KR:medical-laboratory-technician','source','국가법령정보센터 — 의료기사 등에 관한 법률','https://www.law.go.kr/LSW/lsInfoP.do?ancYnChk=0&chrClsCd=010202&efYd=20260701&lsiSeq=281937&urlMode=lsInfoP','official_regulation',null,2,'2026-08-10'),

  ('KR:radiographer','job_search','고용24 — 채용정보 상세검색','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','official_job_board',null,1,'2026-08-10'),
  ('KR:radiographer','source','한국고용정보원 — 한국고용직업분류 2025','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','official_classification',null,1,'2026-08-10'),
  ('KR:radiographer','source','국가법령정보센터 — 의료기사 등에 관한 법률','https://www.law.go.kr/LSW/lsInfoP.do?ancYnChk=0&chrClsCd=010202&efYd=20260701&lsiSeq=281937&urlMode=lsInfoP','official_regulation',null,2,'2026-08-10'),

  ('KR:pharmacist','job_search','고용24 — 채용정보 상세검색','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','official_job_board',null,1,'2026-08-10'),
  ('KR:pharmacist','source','한국고용정보원 — 한국고용직업분류 2025','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','official_classification',null,1,'2026-08-10'),
  ('KR:pharmacist','source','국가법령정보센터 — 약사법 약사 자격과 면허','https://www.law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1032074919','official_regulation',null,2,'2026-08-10'),

  ('KR:occupational-therapist','job_search','고용24 — 채용정보 상세검색','https://www.work24.go.kr/wk/a/b/1200/retriveDtlEmpSrchList.do','official_job_board',null,1,'2026-08-10'),
  ('KR:occupational-therapist','source','한국고용정보원 — 한국고용직업분류 2025','https://www.keis.or.kr/keis/ko/proj/114/pblc/detail.do?categoryIdx=125&pubIdx=11172','official_classification',null,1,'2026-08-10'),
  ('KR:occupational-therapist','source','국가법령정보센터 — 의료기사 등에 관한 법률','https://www.law.go.kr/LSW/lsInfoP.do?ancYnChk=0&chrClsCd=010202&efYd=20260701&lsiSeq=281937&urlMode=lsInfoP','official_regulation',null,2,'2026-08-10')
on conflict (profile_key,link_type,url) do update set
  label=excluded.label,
  provider_type=excluded.provider_type,
  region_code=excluded.region_code,
  sort_order=excluded.sort_order,
  source_checked_at=excluded.source_checked_at;

-- Reuse only already-reviewed Korean programme mappings and preserve their direct/related strength.
insert into public.country_occupation_program_links (
  profile_key,program_ref,relation_type,source_checked_at
)
values
  ('KR:care-worker','studyinkorea:100215:bachelor:social-welfare','related','2026-08-09'),
  ('KR:care-worker','studyinkorea:100332:bachelor:social-welfare','related','2026-08-09'),
  ('KR:medical-laboratory-technician','studyinkorea:100115:bachelor:clinical-laboratory-science','direct','2026-08-09'),
  ('KR:medical-laboratory-technician','studyinkorea:100070:bachelor:biotechnology','related','2026-08-09'),
  ('KR:medical-laboratory-technician','studyinkorea:100332:bachelor:mechanical-biomedical-engineering','related','2026-08-09'),
  ('KR:medical-laboratory-technician','studyinkorea:100400:bachelor:life-sciences','related','2026-08-09'),
  ('KR:medical-laboratory-technician','studyinkorea:100406:bachelor:bio-brain-engineering','related','2026-08-09'),
  ('KR:occupational-therapist','studyinkorea:100140:bachelor:occupational-therapy','direct','2026-08-09'),
  ('KR:pharmacist','studyinkorea:100190:bachelor:pharmacy-six-year','direct','2026-08-09'),
  ('KR:pharmacist','studyinkorea:100289:bachelor:pharmacy','direct','2026-08-09'),
  ('KR:physiotherapist','studyinkorea:100115:bachelor:physical-therapy','direct','2026-08-09'),
  ('KR:radiographer','studyinkorea:100140:bachelor:radiological-science','direct','2026-08-09'),
  ('KR:registered-nurse','studyinkorea:100070:bachelor:nursing','direct','2026-08-09'),
  ('KR:registered-nurse','studyinkorea:100190:bachelor:nursing','direct','2026-08-09'),
  ('KR:registered-nurse','studyinkorea:100215:bachelor:nursing','direct','2026-08-09'),
  ('KR:registered-nurse','studyinkorea:100289:bachelor:nursing','direct','2026-08-09'),
  ('KR:registered-nurse','studyinkorea:100332:bachelor:nursing','direct','2026-08-09'),
  ('KR:registered-nurse','studyinkorea:100487:bachelor:nursing','direct','2026-08-09')
on conflict (profile_key,program_ref) do update set
  relation_type=excluded.relation_type,
  source_checked_at=excluded.source_checked_at;
