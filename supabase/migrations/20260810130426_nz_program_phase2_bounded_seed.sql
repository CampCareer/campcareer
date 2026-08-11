-- New Zealand Programs Phase 2 bounded seed.
-- Deliberately limited to 24 current university pathways with direct or reviewed related relevance
-- to CampCareer's canonical 80 programme-matching occupations. Unrelated programmes are out of scope.

ALTER TABLE public.program_catalog_nz_staging
  ADD COLUMN default_duration_months integer CHECK (default_duration_months IS NULL OR default_duration_months > 0),
  ADD COLUMN language_context text;

WITH provider_identity AS (
  SELECT DISTINCT ON (ii.identifier_value)
    ii.identifier_value AS provider_number,
    i.id AS institution_id,
    i.canonical_name AS institution_name
  FROM catalog.institution_identifiers ii
  JOIN catalog.institutions i ON i.id=ii.institution_id
  WHERE ii.identifier_system='NZ_MOE_PROVIDER_NUMBER'
    AND i.country_code='NZ'
    AND i.status='active'
  ORDER BY ii.identifier_value, i.updated_at DESC NULLS LAST
),
programme_seed(provider_number,source_program_key,source_program_name,title,qualification_name,degree_level,nzqcf_level,nzqcf_credits,default_duration_months,field_category,official_program_url) AS (
  VALUES
  ('7001','uoa-behons-civil-engineering','Bachelor of Engineering (Honours) — Civil Engineering','Civil Engineering','Bachelor of Engineering (Honours)','BACHELOR_HONOURS',8,480,48,'Engineering','https://www.auckland.ac.nz/en/study/study-options/find-a-study-option/bachelor-of-engineering-honours-behons.html'),
  ('7001','uoa-behons-software-engineering','Bachelor of Engineering (Honours) — Software Engineering','Software Engineering','Bachelor of Engineering (Honours)','BACHELOR_HONOURS',8,480,48,'Technology','https://www.auckland.ac.nz/en/study/study-options/find-a-study-option/software-engineering/undergraduate.html'),
  ('7001','uoa-bsc-data-science','Bachelor of Science — Data Science','Data Science','Bachelor of Science','BACHELOR',7,NULL,36,'Technology','https://www.auckland.ac.nz/en/study/study-options/find-a-study-option/data-science.html'),

  ('7008','aut-bhsc-nursing','Bachelor of Health Science (Nursing)','Nursing','Bachelor of Health Science (Nursing)','BACHELOR',7,NULL,36,'Health','https://www.aut.ac.nz/study/study-options/health-sciences/courses/bachelor-of-health-science-in-nursing'),
  ('7008','aut-bhsc-midwifery','Bachelor of Health Science (Midwifery)','Midwifery','Bachelor of Health Science (Midwifery)','BACHELOR',7,480,48,'Health','https://www.aut.ac.nz/study/study-options/health-sciences/courses/bachelor-of-health-science-in-midwifery'),
  ('7008','aut-bhsc-physiotherapy','Bachelor of Health Science (Physiotherapy)','Physiotherapy','Bachelor of Health Science (Physiotherapy)','BACHELOR',7,NULL,48,'Health','https://www.aut.ac.nz/study/study-options/health-sciences/courses/bachelor-of-health-science-in-physiotherapy'),

  ('7007','otago-bphysio','Bachelor of Physiotherapy','Physiotherapy','Bachelor of Physiotherapy','BACHELOR',7,NULL,48,'Health','https://www.otago.ac.nz/courses/qualifications/bachelor-of-physiotherapy'),
  ('7007','otago-bpharm','Bachelor of Pharmacy','Pharmacy','Bachelor of Pharmacy','BACHELOR',7,NULL,48,'Health','https://www.otago.ac.nz/courses/qualifications/bachelor-of-pharmacy'),
  ('7007','otago-bmlsc','Bachelor of Medical Laboratory Science','Medical Laboratory Science','Bachelor of Medical Laboratory Science','BACHELOR',7,NULL,48,'Health','https://www.otago.ac.nz/courses/qualifications/bachelor-of-medical-laboratory-science'),

  ('7003','massey-bconst-construction-management','Bachelor of Construction — Construction Management','Construction Management','Bachelor of Construction','BACHELOR',7,360,36,'Construction','https://www.massey.ac.nz/study/all-qualifications-and-degrees/bachelor-of-construction-UBCNS/'),
  ('7003','massey-bfoodtech-hons','Bachelor of Food Technology with Honours','Food Technology','Bachelor of Food Technology with Honours','BACHELOR_HONOURS',8,480,48,'Environment and Agriculture','https://www.massey.ac.nz/study/all-qualifications-and-degrees/bachelor-of-food-technology-with-honours-UHFDT/'),
  ('7003','massey-bav-air-transport-pilot','Bachelor of Aviation — Air Transport Pilot','Air Transport Pilot','Bachelor of Aviation','BACHELOR',7,480,36,'Transport','https://www.massey.ac.nz/study/all-qualifications-and-degrees/bachelor-of-aviation-UBAVT/'),

  ('7005','uc-behons-electrical-electronic','Bachelor of Engineering with Honours — Electrical and Electronic Engineering','Electrical and Electronic Engineering','Bachelor of Engineering with Honours','BACHELOR_HONOURS',8,NULL,48,'Engineering','https://www.canterbury.ac.nz/study/academic-study/qualifications/bachelor-of-engineering-with-honours'),
  ('7005','uc-bforestrysci','Bachelor of Forestry Science','Forestry Science','Bachelor of Forestry Science','BACHELOR',7,480,48,'Environment and Agriculture','https://www.canterbury.ac.nz/study/academic-study/qualifications/bachelor-of-forestry-science'),
  ('7005','uc-bswhons','Bachelor of Social Work with Honours','Social Work','Bachelor of Social Work with Honours','BACHELOR_HONOURS',8,480,48,'Education and Social','https://www.canterbury.ac.nz/study/academic-study/qualifications/bachelor-of-social-work-with-honours'),

  ('7006','lincoln-bagrisci','Bachelor of Agricultural Science','Agricultural Science','Bachelor of Agricultural Science','BACHELOR',7,480,48,'Environment and Agriculture','https://www.lincoln.ac.nz/study/study-programmes/programme-search/bachelor-of-agricultural-science/'),
  ('7006','lincoln-benvmgmt','Bachelor of Environmental Management','Environmental Management','Bachelor of Environmental Management','BACHELOR',7,360,36,'Environment and Agriculture','https://www.lincoln.ac.nz/study/study-programmes/programme-search/bachelor-of-environmental-management/'),
  ('7006','lincoln-mtourismmgmt','Master of Tourism Management','Tourism Management','Master of Tourism Management','MASTER',9,180,12,'Hospitality','https://www.lincoln.ac.nz/study/study-programmes/programme-search/master-of-tourism-management/'),

  ('7002','waikato-btchg-early-childhood','Bachelor of Teaching — Early Childhood','Early Childhood Teaching','Bachelor of Teaching','BACHELOR',7,360,36,'Education and Social','https://www.waikato.ac.nz/study/qualifications/bachelor-of-teaching/'),
  ('7002','waikato-btchg-primary','Bachelor of Teaching — Primary','Primary Teaching','Bachelor of Teaching','BACHELOR',7,360,36,'Education and Social','https://www.waikato.ac.nz/study/qualifications/bachelor-of-teaching/'),
  ('7002','waikato-bbus-accounting','Bachelor of Business — Accounting','Accounting','Bachelor of Business','BACHELOR',7,360,36,'Business','https://www.waikato.ac.nz/study/qualifications/bachelor-of-business/'),

  ('7004','vuw-bdi-interaction-design','Bachelor of Design Innovation — Interaction Design','Interaction Design','Bachelor of Design Innovation','BACHELOR',7,360,36,'Design and Creative','https://www.wgtn.ac.nz/explore/degrees/design-innovation/overview'),
  ('7004','vuw-bdi-communication-design','Bachelor of Design Innovation — Communication Design','Communication Design','Bachelor of Design Innovation','BACHELOR',7,360,36,'Design and Creative','https://www.wgtn.ac.nz/explore/degrees/design-innovation/overview'),
  ('7004','vuw-bcom-hrer','Bachelor of Commerce — Human Resource Management and Employment Relations','Human Resource Management and Employment Relations','Bachelor of Commerce','BACHELOR',7,NULL,36,'Business','https://www.wgtn.ac.nz/explore/degrees/commerce/overview')
)
INSERT INTO public.program_catalog_nz_staging (
  source_name,source_program_key,institution_id,institution_name,provider_number,
  source_program_name,title,qualification_name,degree_level,nzqcf_level,nzqcf_credits,
  default_duration_months,study_mode,field_category,programme_authority,programme_authority_url,
  official_program_url,international_source_url,programme_delivery_verified,programme_delivery_source_url,
  language_context,source_as_of,collection_status,verification_tier
)
SELECT
  'NZ_OFFICIAL_2026',s.source_program_key,p.institution_id,p.institution_name,s.provider_number,
  s.source_program_name,s.title,s.qualification_name,s.degree_level,s.nzqcf_level,s.nzqcf_credits,
  s.default_duration_months,'full-time',s.field_category,'CUAP',
  'https://www.universitiesnz.ac.nz/quality-assurance/programme-approval-and-accreditation-cuap',
  s.official_program_url,NULL,false,NULL,NULL,DATE '2026-08-10','official_current_program_collected','A'
FROM programme_seed s
JOIN provider_identity p USING (provider_number)
ON CONFLICT (source_name,source_program_key) DO UPDATE SET
  institution_id=excluded.institution_id,
  institution_name=excluded.institution_name,
  provider_number=excluded.provider_number,
  source_program_name=excluded.source_program_name,
  title=excluded.title,
  qualification_name=excluded.qualification_name,
  degree_level=excluded.degree_level,
  nzqcf_level=excluded.nzqcf_level,
  nzqcf_credits=excluded.nzqcf_credits,
  default_duration_months=excluded.default_duration_months,
  study_mode=excluded.study_mode,
  field_category=excluded.field_category,
  programme_authority=excluded.programme_authority,
  programme_authority_url=excluded.programme_authority_url,
  official_program_url=excluded.official_program_url,
  programme_delivery_verified=excluded.programme_delivery_verified,
  programme_delivery_source_url=excluded.programme_delivery_source_url,
  source_as_of=excluded.source_as_of,
  collection_status=excluded.collection_status,
  verification_tier=excluded.verification_tier;

WITH relation_seed(source_program_key,canonical_career_id,relation_type,match_basis) AS (
  VALUES
  ('uoa-behons-civil-engineering','civil-engineer','direct','Named Civil Engineering specialisation'),
  ('uoa-behons-civil-engineering','construction-manager','related','Engineering degree is a reviewed related pathway, not a construction-management qualification'),
  ('uoa-behons-software-engineering','software-developer','direct','Named Software Engineering specialisation'),
  ('uoa-behons-software-engineering','cloud-engineer','related','Software engineering is a reviewed adjacent technical pathway'),
  ('uoa-behons-software-engineering','web-designer','related','Software engineering is a reviewed adjacent web pathway, not a web-design award'),
  ('uoa-behons-software-engineering','project-manager','related','Programme includes engineering/project methodology but is not a project-management award'),
  ('uoa-bsc-data-science','data-analyst','direct','Official subject career outcomes include data analyst'),
  ('uoa-bsc-data-science','data-engineer','related','Data Science is a reviewed adjacent pathway to data engineering'),
  ('uoa-bsc-data-science','database-administrator','related','Official subject career outcomes include database administrator'),

  ('aut-bhsc-nursing','registered-nurse','direct','Professional Nursing degree'),
  ('aut-bhsc-midwifery','midwife','direct','Professional Midwifery degree'),
  ('aut-bhsc-physiotherapy','physiotherapist','direct','Professional Physiotherapy degree'),

  ('otago-bphysio','physiotherapist','direct','Professional Physiotherapy degree'),
  ('otago-bpharm','pharmacist','direct','Professional Pharmacy degree'),
  ('otago-bmlsc','medical-laboratory-technician','related','Medical Laboratory Science is a higher-level reviewed route in the same laboratory profession; technician scope remains distinct'),

  ('massey-bconst-construction-management','construction-manager','direct','Named Construction Management major'),
  ('massey-bconst-construction-management','project-manager','related','Construction programme includes project-management practice in a sector-specific context'),
  ('massey-bfoodtech-hons','food-technologist','direct','Named Food Technology professional degree'),
  ('massey-bav-air-transport-pilot','commercial-pilot','direct','Air Transport Pilot major integrates flight training and CPL competencies'),

  ('uc-behons-electrical-electronic','electrical-engineer','direct','Named Electrical and Electronic Engineering specialisation'),
  ('uc-behons-electrical-electronic','engineering-technician','related','Professional engineering degree is related to the broader engineering-technology occupation family but is not a technician award'),
  ('uc-bforestrysci','forestry-technician','related','Forestry Science is a higher-level reviewed forestry pathway; technician scope remains distinct'),
  ('uc-bswhons','social-worker','direct','Professional Social Work degree'),

  ('lincoln-bagrisci','agronomist','direct','Programme explicitly includes agronomy, crop and soil science'),
  ('lincoln-bagrisci','farm-manager','related','Agricultural Science includes farm systems and management but is not a dedicated farm-management award'),
  ('lincoln-benvmgmt','environmental-scientist','related','Environmental Management includes physical environmental science and analysis but is multidisciplinary'),
  ('lincoln-benvmgmt','sustainability-specialist','direct','Sustainability and environmental management are central programme outcomes'),
  ('lincoln-mtourismmgmt','tourism-manager','direct','Named Tourism Management masters degree'),
  ('lincoln-mtourismmgmt','hotel-manager','related','Tourism management is a reviewed related hospitality-management pathway'),
  ('lincoln-mtourismmgmt','event-planner','related','Official career outcomes include event-management roles'),

  ('waikato-btchg-early-childhood','early-childhood-teacher','direct','Professional Early Childhood teaching qualification'),
  ('waikato-btchg-primary','primary-school-teacher','direct','Professional Primary teaching qualification'),
  ('waikato-bbus-accounting','accountant','direct','Named Accounting major and professional accounting pathway'),
  ('waikato-bbus-accounting','auditor','related','Official Accounting career outcomes include auditor'),

  ('vuw-bdi-interaction-design','ux-designer','direct','Named Interaction Design major focuses on digital interactions, apps and websites'),
  ('vuw-bdi-interaction-design','web-designer','related','Interaction Design is a reviewed adjacent web-experience pathway'),
  ('vuw-bdi-communication-design','graphic-designer','direct','Named Communication Design major'),
  ('vuw-bdi-communication-design','multimedia-designer','related','Communication Design is a reviewed adjacent multimedia pathway'),
  ('vuw-bcom-hrer','human-resources-specialist','direct','Named Human Resource Management and Employment Relations major')
)
INSERT INTO public.program_occupation_nz_staging (
  program_catalog_id,canonical_career_id,rule_version,match_basis,match_pattern,
  review_status,relation_type,source_checked_at,reviewer_note
)
SELECT p.id,r.canonical_career_id,'nz-program-occupation-v1',r.match_basis,p.title,
       'approved',r.relation_type,DATE '2026-08-10',
       'Phase 2 bounded-seed review: relation is educational relevance only and does not imply licensing, registration, visa or employment eligibility.'
FROM relation_seed r
JOIN public.program_catalog_nz_staging p
  ON p.source_name='NZ_OFFICIAL_2026'
 AND p.source_program_key=r.source_program_key
ON CONFLICT (program_catalog_id,canonical_career_id,rule_version) DO UPDATE SET
  match_basis=excluded.match_basis,
  match_pattern=excluded.match_pattern,
  review_status=excluded.review_status,
  relation_type=excluded.relation_type,
  source_checked_at=excluded.source_checked_at,
  reviewed_at=now(),
  reviewer_note=excluded.reviewer_note;

INSERT INTO public.program_international_nz_staging (
  program_catalog_id,international_students_eligible,international_admission_status,
  code_signatory_status,code_signatory_source_url,student_visa_context,post_study_work_context,
  post_study_work_rule_effective_date,intake_label,intake_start_date,application_deadline,
  admission_source_url,international_source_url,visa_source_url,verification_status,
  source_checked_at,verified_at,reviewer_note
)
SELECT
  p.id,NULL,'eligible_schedule_unknown','not_programme_verified',NULL,
  'Student visa eligibility must be verified separately against current Immigration New Zealand rules and an offer of place from an approved provider.',
  'Post Study Work Visa eligibility is qualification-sensitive and effective-dated; Phase 2 does not infer eligibility from programme existence.',
  NULL,NULL,NULL,NULL,NULL,NULL,
  'https://www.immigration.govt.nz/study/for-education-providers/offering-a-place-to-a-student/',
  'programme_identity_verified_context_pending',DATE '2026-08-10',NULL,
  'Phase 3 must verify programme-level international eligibility, current application timing, Code-signatory context and any applicable post-study-work rule.'
FROM public.program_catalog_nz_staging p
WHERE p.source_name='NZ_OFFICIAL_2026'
ON CONFLICT (program_catalog_id) DO UPDATE SET
  international_students_eligible=excluded.international_students_eligible,
  international_admission_status=excluded.international_admission_status,
  code_signatory_status=excluded.code_signatory_status,
  student_visa_context=excluded.student_visa_context,
  post_study_work_context=excluded.post_study_work_context,
  visa_source_url=excluded.visa_source_url,
  verification_status=excluded.verification_status,
  source_checked_at=excluded.source_checked_at,
  verified_at=excluded.verified_at,
  reviewer_note=excluded.reviewer_note;

DO $$
DECLARE
  programme_count integer;
  institution_count integer;
  relation_count integer;
  career_count integer;
  international_count integer;
  missing_relation_count integer;
  non_target_relation_count integer;
  location_inference_count integer;
  missing_url_count integer;
BEGIN
  SELECT count(*),count(DISTINCT institution_id),count(*) FILTER (WHERE official_program_url IS NULL OR official_program_url !~ '^https://')
  INTO programme_count,institution_count,missing_url_count
  FROM public.program_catalog_nz_staging
  WHERE source_name='NZ_OFFICIAL_2026';

  IF programme_count<>24 OR institution_count<>8 THEN
    RAISE EXCEPTION 'NZ Phase 2 expected 24 bounded programmes across 8 universities; found % / %',programme_count,institution_count;
  END IF;
  IF missing_url_count<>0 THEN
    RAISE EXCEPTION 'NZ Phase 2 expected official HTTPS programme URLs for every bounded programme; missing %',missing_url_count;
  END IF;

  SELECT count(*),count(DISTINCT o.canonical_career_id)
  INTO relation_count,career_count
  FROM public.program_occupation_nz_staging o
  JOIN public.program_catalog_nz_staging p ON p.id=o.program_catalog_id
  WHERE p.source_name='NZ_OFFICIAL_2026' AND o.review_status='approved';

  IF relation_count<>39 OR career_count<>35 THEN
    RAISE EXCEPTION 'NZ Phase 2 expected 39 approved relations covering 35 target careers; found % / %',relation_count,career_count;
  END IF;

  SELECT count(*) INTO missing_relation_count
  FROM public.program_catalog_nz_staging p
  WHERE p.source_name='NZ_OFFICIAL_2026'
    AND NOT EXISTS (
      SELECT 1 FROM public.program_occupation_nz_staging o
      WHERE o.program_catalog_id=p.id AND o.review_status='approved'
    );
  IF missing_relation_count<>0 THEN
    RAISE EXCEPTION 'NZ Phase 2 invariant failed: % programmes have no approved target-career relation',missing_relation_count;
  END IF;

  SELECT count(*) INTO non_target_relation_count
  FROM public.program_occupation_nz_staging o
  JOIN public.program_catalog_nz_staging p ON p.id=o.program_catalog_id
  WHERE p.source_name='NZ_OFFICIAL_2026'
    AND o.review_status='approved'
    AND NOT EXISTS (
      SELECT 1 FROM public.program_occupation_match_rules r
      WHERE r.country_code='CA'
        AND r.rule_version='v1'
        AND r.canonical_career_id=o.canonical_career_id
    );
  IF non_target_relation_count<>0 THEN
    RAISE EXCEPTION 'NZ Phase 2 invariant failed: % relations fall outside the canonical 80-career target set',non_target_relation_count;
  END IF;

  SELECT count(*) INTO international_count
  FROM public.program_international_nz_staging i
  JOIN public.program_catalog_nz_staging p ON p.id=i.program_catalog_id
  WHERE p.source_name='NZ_OFFICIAL_2026';
  IF international_count<>24 THEN
    RAISE EXCEPTION 'NZ Phase 2 expected one international-context row per programme; found %',international_count;
  END IF;

  SELECT count(*) INTO location_inference_count
  FROM public.program_catalog_nz_staging
  WHERE source_name='NZ_OFFICIAL_2026'
    AND (programme_delivery_verified OR programme_delivery_source_url IS NOT NULL);
  IF location_inference_count<>0 THEN
    RAISE EXCEPTION 'NZ Phase 2 invariant failed: % programme delivery locations were asserted in the bounded seed',location_inference_count;
  END IF;
END $$;
