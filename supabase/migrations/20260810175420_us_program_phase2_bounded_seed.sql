-- United States Programs Phase 2 bounded occupation-led seed.
-- 24 exact current programmes across 8 existing Tier A institutions.
-- No national catalogue import, no programme city/campus inference, no STEM OPT determination.

DO $$
DECLARE
  resolved_count integer;
BEGIN
  SELECT count(*) INTO resolved_count
  FROM public.institution_identity_us_tier_a_v1
  WHERE unitid IN ('170976','236948','190415','174066','228778','214777','240444','193900');
  IF resolved_count <> 8 THEN
    RAISE EXCEPTION 'Expected 8 Tier A US provider identities; found %', resolved_count;
  END IF;
END $$;

WITH seed(unitid, source_program_key, source_program_name, title, credential_name, award_level, cip_code, cip_evidence_status, cip_source_url, credit_units, credit_unit_type, default_duration_months, study_mode, field_category, programmatic_accreditation_context, accreditation_source_url, official_program_url, official_catalog_url) AS (
  VALUES
  ('170976','umich-bse-civil-engineering','Civil Engineering','Civil Engineering','Bachelor of Science in Engineering (B.S.E.)','BACHELOR',NULL,'unresolved',NULL,NULL,NULL,NULL,'in_person','Engineering',NULL,NULL,'https://cee.engin.umich.edu/undergraduate-studies/major-in-civil-engineering/','https://bulletin.engin.umich.edu/ug-ed/degrees/'),
  ('170976','umich-bse-industrial-operations-engineering','Industrial and Operations Engineering','Industrial and Operations Engineering','Bachelor of Science in Engineering (B.S.E.)','BACHELOR',NULL,'unresolved',NULL,NULL,NULL,NULL,'in_person','Engineering','Engineering Accreditation Commission of ABET','https://ioe.engin.umich.edu/undergraduate/accreditation/','https://ioe.engin.umich.edu/undergraduate/major-in-ioe/','https://bulletin.engin.umich.edu/ug-ed/degrees/'),
  ('170976','umich-bsn','Bachelor of Science in Nursing (BSN)','Nursing','Bachelor of Science in Nursing (BSN)','BACHELOR',NULL,'unresolved',NULL,NULL,NULL,48,'in_person','Health','CCNE accredited; Michigan Board of Nursing approved','https://nursing.umich.edu/academics/accreditations-disclosures','https://nursing.umich.edu/academics/BSN',NULL),
  ('236948','uw-bs-informatics','Informatics','Informatics','Bachelor of Science in Informatics','BACHELOR',NULL,'unresolved',NULL,NULL,NULL,NULL,'in_person','Technology',NULL,NULL,'https://ischool.uw.edu/programs/informatics/','https://ischool.uw.edu/programs/informatics/curriculum'),
  ('236948','uw-bs-civil-engineering','Civil Engineering','Civil Engineering','Bachelor of Science in Civil Engineering','BACHELOR',NULL,'unresolved',NULL,NULL,NULL,NULL,'in_person','Engineering',NULL,NULL,'https://admit.washington.edu/majors/civil-engineering/','https://www.engr.washington.edu/departments/degree-options'),
  ('236948','uw-basw-social-welfare','Social Welfare','Social Welfare','Bachelor of Arts in Social Welfare (BASW)','BACHELOR',NULL,'unresolved',NULL,NULL,NULL,NULL,'in_person','Education and Social',NULL,NULL,'https://admit.washington.edu/majors/social-welfare/','https://www.washington.edu/students/gencat/program/S/SocialWork-779.html'),
  ('190415','cornell-bs-hotel-administration','Hotel Administration (BS)','Hotel Administration','Bachelor of Science','BACHELOR','52.0904','verified','https://catalog.cornell.edu/programs/hotel-management-bs/',120,'semester_credits',NULL,'in_person','Hospitality','AACSB-accredited bachelor degree in hotel administration','https://catalog.cornell.edu/programs/hotel-management-bs/','https://catalog.cornell.edu/programs/hotel-management-bs/','https://business.cornell.edu/programs/bs-hotel-administration/'),
  ('190415','cornell-bs-food-science','Food Science (BS)','Food Science','Bachelor of Science','BACHELOR','01.1001','verified','https://catalog.cornell.edu/programs/food-science-bs/',NULL,NULL,48,'in_person','Environment and Agriculture',NULL,NULL,'https://catalog.cornell.edu/programs/food-science-bs/','https://catalog.cornell.edu/programs/food-science-bs/'),
  ('190415','cornell-barch-architecture','Architecture (BAR)','Architecture','Bachelor of Architecture (B.Arch.)','BACHELOR_PROFESSIONAL','04.0902','verified','https://catalog.cornell.edu/programs/architecture-barch/',NULL,NULL,60,'in_person','Design and Creative','NAAB accredited','https://catalog.cornell.edu/programs/architecture-barch/','https://aap.cornell.edu/architecture/bachelor-of-architecture/','https://catalog.cornell.edu/programs/architecture-barch/'),
  ('174066','umn-bs-forest-natural-resource-management','Forest and Natural Resource Management','Forest and Natural Resource Management','Bachelor of Science','BACHELOR',NULL,'unresolved',NULL,NULL,NULL,48,'in_person','Environment and Agriculture','Society of American Foresters accredited tracks','https://forestry.umn.edu/bs-forest-and-natural-resource-management','https://forestry.umn.edu/bs-forest-and-natural-resource-management',NULL),
  ('174066','umn-bs-food-science','Food Science','Food Science','Bachelor of Science','BACHELOR',NULL,'unresolved',NULL,NULL,NULL,NULL,'in_person','Environment and Agriculture',NULL,NULL,'https://cfans.umn.edu/academics/cfans-majors-minors/food-science','https://slo.umn.edu/undergraduate-experience/college-program-student-learning-outcomes'),
  ('174066','umn-bs-plant-science','Plant Science','Plant Science','Bachelor of Science','BACHELOR',NULL,'unresolved',NULL,NULL,NULL,NULL,'in_person','Environment and Agriculture',NULL,NULL,'https://cfans.umn.edu/academics/cfans-majors-minors/plant-science','https://slo.umn.edu/undergraduate-experience/college-program-student-learning-outcomes'),
  ('228778','utaustin-bs-civil-engineering','Bachelor of Science in Civil Engineering','Civil Engineering','Bachelor of Science in Civil Engineering','BACHELOR',NULL,'unresolved',NULL,NULL,NULL,NULL,'in_person','Engineering',NULL,NULL,'https://catalog.utexas.edu/undergraduate/engineering/degrees-and-programs/bs-civil-engineering/','https://catalog.utexas.edu/undergraduate/engineering/degrees-and-programs/bs-civil-engineering/'),
  ('228778','utaustin-bba-accounting','Accounting','Accounting','Bachelor of Business Administration','BACHELOR',NULL,'unresolved',NULL,120,'semester_hours',48,'in_person','Business',NULL,NULL,'https://catalog.utexas.edu/undergraduate/business/degrees-and-programs/bachelor-of-business-administration/accounting/','https://catalog.utexas.edu/undergraduate/business/degrees-and-programs/bachelor-of-business-administration/accounting/'),
  ('228778','utaustin-bsid-interior-design','Bachelor of Science in Interior Design','Interior Design','Bachelor of Science in Interior Design','BACHELOR',NULL,'unresolved',NULL,126,'semester_hours',48,'in_person','Design and Creative','Council for Interior Design Accreditation (CIDA) accredited','https://soa.utexas.edu/interior-design/undergraduate','https://soa.utexas.edu/interior-design/undergraduate',NULL),
  ('214777','psu-bs-supply-chain-information-systems','Supply Chain and Information Systems, B.S.','Supply Chain and Information Systems','Bachelor of Science','BACHELOR',NULL,'unresolved',NULL,120,'credits',NULL,'in_person','Business','AACSB-accredited Smeal business programme','https://bulletins.psu.edu/undergraduate/colleges/smeal-business/supply-chain-information-systems-bs/','https://bulletins.psu.edu/undergraduate/colleges/smeal-business/supply-chain-information-systems-bs/','https://bulletins.psu.edu/undergraduate/colleges/smeal-business/supply-chain-information-systems-bs/'),
  ('214777','psu-bs-cybersecurity-analytics-operations','Cybersecurity Analytics and Operations, B.S.','Cybersecurity Analytics and Operations','Bachelor of Science','BACHELOR',NULL,'unresolved',NULL,NULL,NULL,NULL,'in_person','Technology',NULL,NULL,'https://bulletins.psu.edu/undergraduate/colleges/information-sciences-technology/cybersecurity-analytics-operations-bs/','https://bulletins.psu.edu/undergraduate/colleges/information-sciences-technology/cybersecurity-analytics-operations-bs/'),
  ('214777','psu-bs-mechanical-engineering','Mechanical Engineering, B.S. (Engineering)','Mechanical Engineering','Bachelor of Science','BACHELOR',NULL,'unresolved',NULL,131,'credits',NULL,'in_person','Engineering',NULL,NULL,'https://bulletins.psu.edu/undergraduate/colleges/engineering/mechanical-engineering-bs/','https://bulletins.psu.edu/undergraduate/colleges/engineering/mechanical-engineering-bs/'),
  ('240444','wisc-bs-data-science','Data Science, BS','Data Science','Bachelor of Science','BACHELOR',NULL,'unresolved',NULL,NULL,NULL,NULL,'in_person','Technology',NULL,NULL,'https://guide.wisc.edu/undergraduate/letters-science/statistics/data-science-bs/','https://guide.wisc.edu/undergraduate/letters-science/statistics/data-science-bs/'),
  ('240444','wisc-bs-environmental-engineering','Environmental Engineering, BS','Environmental Engineering','Bachelor of Science','BACHELOR',NULL,'unresolved',NULL,NULL,NULL,NULL,'in_person','Engineering','Engineering Accreditation Commission of ABET','https://guide.wisc.edu/undergraduate/engineering/civil-environmental-engineering/environmental-engineering-bs/index.html','https://guide.wisc.edu/undergraduate/engineering/civil-environmental-engineering/environmental-engineering-bs/index.html','https://guide.wisc.edu/undergraduate/engineering/civil-environmental-engineering/environmental-engineering-bs/index.html'),
  ('240444','wisc-ba-information-science','Information Science, BA','Information Science','Bachelor of Arts','BACHELOR',NULL,'unresolved',NULL,NULL,NULL,NULL,'in_person','Technology',NULL,NULL,'https://guide.wisc.edu/undergraduate/letters-science/information/information-science-ba/','https://guide.wisc.edu/undergraduate/letters-science/information/information-science-ba/'),
  ('193900','nyu-bs-integrated-design-media','Integrated Design and Media (BS)','Integrated Design and Media','Bachelor of Science','BACHELOR','11.0103','verified','https://bulletins.nyu.edu/undergraduate/engineering/programs/integrated-design-media-bs/',120,'credits',NULL,'in_person','Design and Creative',NULL,NULL,'https://engineering.nyu.edu/academics/programs/integrated-design-media-bs','https://bulletins.nyu.edu/undergraduate/engineering/programs/integrated-design-media-bs/'),
  ('193900','nyu-bs-hospitality-travel-tourism-management','Hospitality, Travel and Tourism Management (BS)','Hospitality, Travel and Tourism Management','Bachelor of Science','BACHELOR','52.0901','verified','https://bulletins.nyu.edu/undergraduate/professional-studies/programs/hospitality-travel-tourism-management-bs/',NULL,NULL,NULL,'in_person','Hospitality',NULL,NULL,'https://bulletins.nyu.edu/undergraduate/professional-studies/programs/hospitality-travel-tourism-management-bs/','https://bulletins.nyu.edu/undergraduate/professional-studies/programs/hospitality-travel-tourism-management-bs/'),
  ('193900','nyu-bs-computer-science','Computer Science (BS)','Computer Science','Bachelor of Science','BACHELOR','11.0101','verified','https://bulletins.nyu.edu/undergraduate/engineering/programs/computer-science-bs/',NULL,NULL,NULL,'in_person','Technology',NULL,NULL,'https://bulletins.nyu.edu/undergraduate/engineering/programs/computer-science-bs/','https://bulletins.nyu.edu/undergraduate/engineering/programs/computer-science-bs/')
), resolved AS (
  SELECT s.*, i.institution_id, i.canonical_name AS institution_name
  FROM seed s
  JOIN public.institution_identity_us_tier_a_v1 i ON i.unitid=s.unitid
)
INSERT INTO public.program_catalog_us_staging (
  source_name,source_program_key,institution_id,institution_name,unitid,source_program_name,title,credential_name,award_level,
  cip_code,cip_evidence_status,cip_source_url,credit_units,credit_unit_type,default_duration_months,study_mode,field_category,
  programmatic_accreditation_context,accreditation_source_url,official_program_url,official_catalog_url,programme_delivery_verified,
  source_as_of,collection_status,verification_tier
)
SELECT
  'US_OFFICIAL_PROGRAM_PHASE2',source_program_key,institution_id,institution_name,unitid,source_program_name,title,credential_name,award_level,
  cip_code,cip_evidence_status,cip_source_url,credit_units,credit_unit_type,default_duration_months,study_mode,field_category,
  programmatic_accreditation_context,accreditation_source_url,official_program_url,official_catalog_url,false,
  DATE '2026-08-10','official_current_program_collected','A'
FROM resolved;

WITH rel(source_program_key, canonical_career_id, relation_type, match_basis, reviewer_note) AS (
  VALUES
  ('umich-bse-civil-engineering','civil-engineer','direct','Named civil engineering bachelor pathway','Educational relevance only; professional engineering licensure is separate.'),
  ('umich-bse-civil-engineering','construction-manager','related','Civil engineering curriculum supports construction/infrastructure management careers','Related pathway; not a construction-management credential.'),
  ('umich-bse-industrial-operations-engineering','industrial-engineer','direct','Named industrial and operations engineering bachelor pathway','Educational relevance only.'),
  ('umich-bse-industrial-operations-engineering','manufacturing-engineer','related','Industrial/operations systems training is relevant to manufacturing engineering','Related pathway.'),
  ('umich-bse-industrial-operations-engineering','supply-chain-analyst','related','Official programme career examples include supply chain analysis','Related pathway.'),
  ('umich-bse-industrial-operations-engineering','business-analyst','related','Official programme career examples include business analyst','Related pathway.'),
  ('umich-bse-industrial-operations-engineering','project-manager','related','Official programme career examples include project manager','Related pathway.'),
  ('umich-bsn','registered-nurse','direct','Prelicensure BSN nursing pathway','State licensure and NCLEX remain separate requirements.'),
  ('uw-bs-informatics','business-analyst','common_pathway','Information systems, organizations and product management curriculum','Common pathway; role outcome is not guaranteed.'),
  ('uw-bs-informatics','data-analyst','common_pathway','Informatics includes data science and information analysis coursework','Common pathway.'),
  ('uw-bs-informatics','ux-designer','common_pathway','Human-centered design and design methods are core programme themes','Common pathway.'),
  ('uw-bs-informatics','database-administrator','related','Information systems and data management coursework is relevant','Related pathway.'),
  ('uw-bs-civil-engineering','civil-engineer','direct','Named civil engineering bachelor pathway','Professional engineering licensure remains separate.'),
  ('uw-bs-civil-engineering','construction-manager','related','Civil engineering curriculum includes construction area','Related pathway.'),
  ('uw-basw-social-welfare','social-worker','direct','BASW prepares entry-level baccalaureate social workers','State social-work licensure remains separate.'),
  ('uw-basw-social-welfare','community-worker','related','Social welfare curriculum supports community-focused practice','Related pathway.'),
  ('uw-basw-social-welfare','youth-worker','related','Social welfare education is relevant to youth/community services','Related pathway.'),
  ('cornell-bs-hotel-administration','hotel-manager','direct','Named hotel administration bachelor pathway','Educational relationship only.'),
  ('cornell-bs-hotel-administration','hospitality-supervisor','direct','Hospitality operations and management are core curriculum areas','Direct education pathway.'),
  ('cornell-bs-hotel-administration','restaurant-manager','common_pathway','Official curriculum includes restaurant and food/beverage management','Common pathway.'),
  ('cornell-bs-hotel-administration','tourism-manager','common_pathway','Hospitality programme prepares leaders across travel and recreation industries','Common pathway.'),
  ('cornell-bs-hotel-administration','event-planner','common_pathway','Hospitality curriculum includes special events and service management','Common pathway.'),
  ('cornell-bs-food-science','food-technologist','direct','Named food science bachelor pathway aligned to food technology careers','Direct education pathway.'),
  ('cornell-barch-architecture','architect','direct','NAAB-accredited professional Bachelor of Architecture','Professional licensure remains separate.'),
  ('umn-bs-forest-natural-resource-management','forestry-technician','related','Four-year forest and natural resource management degree is relevant but above technician level','Related higher-level pathway, not technician-equivalent.'),
  ('umn-bs-forest-natural-resource-management','environmental-scientist','common_pathway','Forest management, conservation and environmental curriculum','Common pathway.'),
  ('umn-bs-food-science','food-technologist','direct','Named food science major with food processing and product-development focus','Direct education pathway.'),
  ('umn-bs-plant-science','agronomist','direct','Plant Science offers an Agronomy Production track','Direct pathway to agronomy-oriented work.'),
  ('umn-bs-plant-science','horticulturist','common_pathway','Plant Science offers horticultural production and nursery/floriculture tracks','Common pathway.'),
  ('umn-bs-plant-science','farm-manager','related','Agronomy production training is relevant to crop/farm management','Related pathway.'),
  ('utaustin-bs-civil-engineering','civil-engineer','direct','Named civil engineering bachelor pathway','Professional engineering licensure remains separate.'),
  ('utaustin-bs-civil-engineering','construction-manager','related','Civil engineering education supports construction/infrastructure management','Related pathway.'),
  ('utaustin-bba-accounting','accountant','direct','Named accounting BBA pathway','Professional certification such as CPA remains separate.'),
  ('utaustin-bba-accounting','auditor','direct','Accounting curriculum includes auditing/financial reporting pathway context','Professional certification remains separate.'),
  ('utaustin-bba-accounting','financial-analyst','related','Accounting training supports financial analysis roles','Related pathway.'),
  ('utaustin-bsid-interior-design','interior-designer','direct','CIDA-accredited Bachelor of Science in Interior Design','Jurisdiction-specific certification/registration remains separate.'),
  ('psu-bs-supply-chain-information-systems','supply-chain-analyst','direct','Named supply chain and information systems bachelor pathway','Direct education pathway.'),
  ('psu-bs-supply-chain-information-systems','logistics-coordinator','direct','Programme explicitly covers logistics, sourcing, production and fulfillment','Direct education pathway.'),
  ('psu-bs-supply-chain-information-systems','warehouse-manager','related','Supply-chain operations education is relevant to warehouse management','Related pathway.'),
  ('psu-bs-cybersecurity-analytics-operations','cybersecurity-analyst','direct','Named cybersecurity analytics and operations bachelor pathway','Direct education pathway.'),
  ('psu-bs-cybersecurity-analytics-operations','network-administrator','related','Programme covers networks and cyberdefense technologies','Related pathway.'),
  ('psu-bs-mechanical-engineering','mechanical-engineer','direct','Named mechanical engineering bachelor pathway','Professional engineering licensure remains separate.'),
  ('psu-bs-mechanical-engineering','manufacturing-engineer','related','Mechanical engineering curriculum includes product design and manufacturing processes','Related pathway.'),
  ('wisc-bs-data-science','data-analyst','direct','Named data science bachelor pathway centered on data management, modeling and analysis','Direct education pathway.'),
  ('wisc-bs-data-science','data-engineer','related','Computing and data management curriculum is relevant to data engineering','Related pathway.'),
  ('wisc-bs-data-science','database-administrator','related','Data management and computing curriculum is relevant to database work','Related pathway.'),
  ('wisc-bs-environmental-engineering','environmental-engineer','direct','ABET-accredited environmental engineering bachelor pathway','Professional engineering licensure remains separate.'),
  ('wisc-bs-environmental-engineering','environmental-scientist','related','Environmental science and engineering curriculum is relevant','Related pathway.'),
  ('wisc-ba-information-science','business-analyst','common_pathway','Information systems, people, data and organizational problem-solving curriculum','Common pathway.'),
  ('wisc-ba-information-science','ux-designer','common_pathway','Information Science emphasizes design and use of human-centered information systems','Common pathway.'),
  ('wisc-ba-information-science','data-analyst','related','Data-driven systems and information management curriculum','Related pathway.'),
  ('nyu-bs-integrated-design-media','multimedia-designer','direct','Integrated Design and Media centers image, sound, narrative and interactivity','Direct creative-technology pathway.'),
  ('nyu-bs-integrated-design-media','ux-designer','common_pathway','Programme includes user-experience design coursework','Common pathway.'),
  ('nyu-bs-integrated-design-media','web-designer','related','Interactive digital-media curriculum is relevant to web design','Related pathway.'),
  ('nyu-bs-integrated-design-media','animator','related','Digital media curriculum includes motion/interactive production','Related pathway.'),
  ('nyu-bs-hospitality-travel-tourism-management','hotel-manager','direct','Named hospitality management bachelor pathway','Direct education pathway.'),
  ('nyu-bs-hospitality-travel-tourism-management','tourism-manager','direct','Named travel and tourism management bachelor pathway','Direct education pathway.'),
  ('nyu-bs-hospitality-travel-tourism-management','event-planner','common_pathway','Programme explicitly includes special event planning','Common pathway.'),
  ('nyu-bs-hospitality-travel-tourism-management','restaurant-manager','common_pathway','Programme includes food and beverage operations','Common pathway.'),
  ('nyu-bs-hospitality-travel-tourism-management','hospitality-supervisor','direct','Hospitality operations and management are core programme outcomes','Direct education pathway.'),
  ('nyu-bs-computer-science','software-developer','direct','Named computer science bachelor pathway','Direct education pathway.'),
  ('nyu-bs-computer-science','cloud-engineer','related','Computer systems/software foundation is relevant to cloud engineering','Related pathway.'),
  ('nyu-bs-computer-science','database-administrator','related','Computer science foundation is relevant to database administration','Related pathway.'),
  ('nyu-bs-computer-science','cybersecurity-analyst','related','Official programme notes departmental strength/courses in cybersecurity','Related pathway.'),
  ('nyu-bs-computer-science','web-designer','related','Computer science supports technical web implementation but is not a design degree','Related pathway.')
)
INSERT INTO public.program_occupation_us_staging (
  program_catalog_id,canonical_career_id,match_basis,review_status,relation_type,source_checked_at,reviewer_note
)
SELECT p.id,r.canonical_career_id,r.match_basis,'approved',r.relation_type,DATE '2026-08-10',r.reviewer_note
FROM rel r
JOIN public.program_catalog_us_staging p
  ON p.source_name='US_OFFICIAL_PROGRAM_PHASE2'
 AND p.source_program_key=r.source_program_key;

INSERT INTO public.program_international_us_staging (
  program_catalog_id,international_students_eligible,international_admission_status,sevp_status,
  student_visa_context,visa_source_url,exact_cip_verified_for_stem,stem_designated_cip,stem_list_source_url,
  opt_context,stem_opt_context,verification_status,source_checked_at,reviewer_note
)
SELECT
  p.id,NULL,'eligible_schedule_unknown','unresolved',
  'F/M student-visa outcome is applicant-specific; exact school/campus SEVP match remains pending Phase 3.',
  'https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html',
  CASE WHEN p.cip_evidence_status='verified' THEN true ELSE NULL END,
  NULL,
  'https://www.ice.gov/sevis/practical-training',
  'OPT is applicant/status-sensitive and must relate to the student major; no applicant outcome is asserted in Phase 2.',
  'No programme-level STEM OPT designation is asserted in Phase 2. Positive status requires exact CIP verification plus current DHS STEM-list review and other eligibility conditions.',
  'programme_identity_verified_context_pending',DATE '2026-08-10',
  'Programme identity is source-backed. International admission, exact SEVP campus, current intake/deadline and STEM OPT context remain deliberately unresolved for Phase 3.'
FROM public.program_catalog_us_staging p
WHERE p.source_name='US_OFFICIAL_PROGRAM_PHASE2';

DO $$
DECLARE
  programme_count integer;
  provider_count integer;
  relation_count integer;
  career_count integer;
  non_target_relations integer;
  international_count integer;
  delivery_assertions integer;
  verified_cip_count integer;
BEGIN
  SELECT count(*), count(DISTINCT institution_id), count(*) FILTER (WHERE cip_evidence_status='verified'),
         count(*) FILTER (WHERE programme_delivery_verified)
  INTO programme_count,provider_count,verified_cip_count,delivery_assertions
  FROM public.program_catalog_us_staging
  WHERE source_name='US_OFFICIAL_PROGRAM_PHASE2';

  SELECT count(*),count(DISTINCT canonical_career_id)
  INTO relation_count,career_count
  FROM public.program_occupation_us_staging o
  JOIN public.program_catalog_us_staging p ON p.id=o.program_catalog_id
  WHERE p.source_name='US_OFFICIAL_PROGRAM_PHASE2' AND o.review_status='approved';

  SELECT count(*) INTO non_target_relations
  FROM public.program_occupation_us_staging o
  JOIN public.program_catalog_us_staging p ON p.id=o.program_catalog_id
  WHERE p.source_name='US_OFFICIAL_PROGRAM_PHASE2'
    AND o.review_status='approved'
    AND NOT EXISTS (
      SELECT 1 FROM public.program_occupation_match_rules m
      WHERE m.country_code='CA' AND m.rule_version='v1' AND m.review_status='approved'
        AND m.canonical_career_id=o.canonical_career_id
    );

  SELECT count(*) INTO international_count
  FROM public.program_international_us_staging i
  JOIN public.program_catalog_us_staging p ON p.id=i.program_catalog_id
  WHERE p.source_name='US_OFFICIAL_PROGRAM_PHASE2';

  IF programme_count<>24 OR provider_count<>8 THEN
    RAISE EXCEPTION 'Expected 24 US Phase 2 programmes across 8 providers; found % / %',programme_count,provider_count;
  END IF;
  IF relation_count<>65 OR career_count<>42 THEN
    RAISE EXCEPTION 'Expected 65 approved relations across 42 target careers; found % / %',relation_count,career_count;
  END IF;
  IF non_target_relations<>0 THEN
    RAISE EXCEPTION 'US Phase 2 contains % relations outside canonical 80',non_target_relations;
  END IF;
  IF international_count<>24 THEN
    RAISE EXCEPTION 'Expected 24 US international-context rows; found %',international_count;
  END IF;
  IF delivery_assertions<>0 THEN
    RAISE EXCEPTION 'US Phase 2 must not infer programme delivery location; found % assertions',delivery_assertions;
  END IF;
  IF verified_cip_count<>6 THEN
    RAISE EXCEPTION 'Expected exactly 6 programme rows with current official exact CIP evidence; found %',verified_cip_count;
  END IF;
END $$;
