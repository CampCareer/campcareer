-- Ireland Programs Phase 2 bounded seed.
-- 32 higher-education programmes + 8 employment-based apprenticeships.
-- The cohort is occupation-led and intentionally does not try to cover all 80 careers.
-- Legacy Qualifax is discovery/provenance only; exact current international eligibility remains pending.

WITH he_seed(legacy_course_id,current_provider_slug,identity_status) AS (
  VALUES
    (508,'dublin-city-university','resolved_current'),
    (645,'dublin-city-university','resolved_current'),
    (759,'dublin-city-university','resolved_current'),
    (506,'trinity-college-dublin','resolved_current'),
    (2814,'trinity-college-dublin','resolved_current'),
    (939,'trinity-college-dublin','resolved_current'),
    (45,'university-college-dublin','resolved_current'),
    (100,'university-college-dublin','resolved_current'),
    (2698,'university-college-dublin','resolved_current'),
    (3,'university-college-cork','resolved_current'),
    (504,'university-college-cork','resolved_current'),
    (2696,'university-college-cork','resolved_current'),
    (505,'university-of-limerick','resolved_current'),
    (580,'university-of-limerick','resolved_current'),
    (847,'university-of-limerick','resolved_current'),
    (44,'university-of-galway','resolved_current'),
    (522,'university-of-galway','resolved_current'),
    (823,'university-of-galway','resolved_current'),
    (102,'technological-university-dublin','resolved_alias'),
    (475,'technological-university-dublin','resolved_alias'),
    (573,'technological-university-dublin','resolved_alias'),
    (618,'technological-university-dublin','resolved_alias'),
    (664,'technological-university-dublin','resolved_alias'),
    (973,'technological-university-dublin','resolved_alias'),
    (20,'maynooth-university','resolved_current'),
    (642,'maynooth-university','resolved_current'),
    (2801,'maynooth-university','resolved_current'),
    (575,'munster-technological-university','resolved_alias'),
    (603,'munster-technological-university','resolved_alias'),
    (624,'munster-technological-university','resolved_alias'),
    (821,'munster-technological-university','resolved_alias'),
    (3459,'munster-technological-university','resolved_alias')
),
resolved_he AS (
  SELECT s.legacy_course_id,s.identity_status,c.college_name,c.title,c.nfq_level,c.course_type,c.qualifax_url,c.synced_at,
         i.id AS institution_id,i.canonical_name,i.slug
  FROM he_seed s
  JOIN public.courses_ie c ON c.id=s.legacy_course_id
  JOIN catalog.institutions i
    ON i.country_code='IE' AND i.status='active' AND i.slug=s.current_provider_slug
)
INSERT INTO public.program_catalog_ie_staging (
  source_name,source_program_key,legacy_course_id,provider_kind,institution_id,provider_name,
  canonical_provider_name,provider_slug,provider_identity_status,title,nfq_level,course_type,
  delivery_model,study_mode,qualifax_url,provider_program_url,recognition_basis,recognition_source_url,
  currentness_status,source_as_of,collection_status,verification_tier
)
SELECT
  'IE_QUALIFAX_2026_BOUNDED','qualifax-'||legacy_course_id::text,legacy_course_id,'higher_education',institution_id,
  college_name,canonical_name,slug,identity_status,title,nfq_level,course_type,'higher_education',NULL,
  qualifax_url,NULL,'nfq_legacy_mapping','https://www.qqi.ie/national-framework-of-qualifications',
  'legacy_snapshot_needs_recheck',synced_at::date,'occupation_bounded_he_discovery','B'
FROM resolved_he
ON CONFLICT (source_name,source_program_key) DO UPDATE SET
  legacy_course_id=excluded.legacy_course_id,
  provider_kind=excluded.provider_kind,
  institution_id=excluded.institution_id,
  provider_name=excluded.provider_name,
  canonical_provider_name=excluded.canonical_provider_name,
  provider_slug=excluded.provider_slug,
  provider_identity_status=excluded.provider_identity_status,
  title=excluded.title,
  nfq_level=excluded.nfq_level,
  course_type=excluded.course_type,
  delivery_model=excluded.delivery_model,
  study_mode=excluded.study_mode,
  qualifax_url=excluded.qualifax_url,
  provider_program_url=excluded.provider_program_url,
  recognition_basis=excluded.recognition_basis,
  recognition_source_url=excluded.recognition_source_url,
  currentness_status=excluded.currentness_status,
  source_as_of=excluded.source_as_of,
  collection_status=excluded.collection_status,
  verification_tier=excluded.verification_tier;

WITH apprenticeship_seed(legacy_course_id) AS (
  VALUES (2490),(2491),(2497),(3221),(3222),(3227),(3516),(3520)
)
INSERT INTO public.program_catalog_ie_staging (
  source_name,source_program_key,legacy_course_id,provider_kind,institution_id,provider_name,
  canonical_provider_name,provider_slug,provider_identity_status,title,nfq_level,course_type,
  delivery_model,study_mode,qualifax_url,provider_program_url,recognition_basis,recognition_source_url,
  currentness_status,source_as_of,collection_status,verification_tier
)
SELECT
  'IE_GENERATION_APPRENTICESHIP_2026','qualifax-'||c.id::text,c.id,'apprenticeship_authority',NULL,c.college_name,
  'SOLAS',NULL,'authority_without_catalog_institution',c.title,c.nfq_level,c.course_type,
  'employment_based_apprenticeship',NULL,c.qualifax_url,NULL,'generation_apprenticeship',
  'https://apprenticeship.ie/craft-apprenticeship-training-locations',
  'current_national_directory_verified',DATE '2026-08-10','occupation_bounded_employment_pathway','C'
FROM apprenticeship_seed s
JOIN public.courses_ie c ON c.id=s.legacy_course_id
ON CONFLICT (source_name,source_program_key) DO UPDATE SET
  legacy_course_id=excluded.legacy_course_id,
  provider_kind=excluded.provider_kind,
  institution_id=excluded.institution_id,
  provider_name=excluded.provider_name,
  canonical_provider_name=excluded.canonical_provider_name,
  provider_slug=excluded.provider_slug,
  provider_identity_status=excluded.provider_identity_status,
  title=excluded.title,
  nfq_level=excluded.nfq_level,
  course_type=excluded.course_type,
  delivery_model=excluded.delivery_model,
  study_mode=excluded.study_mode,
  qualifax_url=excluded.qualifax_url,
  recognition_basis=excluded.recognition_basis,
  recognition_source_url=excluded.recognition_source_url,
  currentness_status=excluded.currentness_status,
  source_as_of=excluded.source_as_of,
  collection_status=excluded.collection_status,
  verification_tier=excluded.verification_tier;

WITH relation_seed(legacy_course_id,canonical_career_id,relation_type,access_model,match_basis) AS (
  VALUES
    (508,'software-developer','direct','higher_education','Named Computer Science degree'),
    (645,'data-analyst','direct','higher_education','Named Data Science and Artificial Intelligence degree'),
    (645,'data-engineer','related','higher_education','Data Science is a reviewed adjacent pathway to data engineering'),
    (759,'primary-school-teacher','direct','higher_education','Named Primary Teaching degree'),
    (506,'software-developer','direct','higher_education','Named Computer Science degree'),
    (2814,'radiographer','direct','higher_education','Named Diagnostic Radiography postgraduate programme'),
    (939,'environmental-engineer','direct','higher_education','Named Environmental Science and Engineering degree'),
    (939,'environmental-scientist','related','higher_education','Environmental science is explicit in the programme title'),
    (939,'sustainability-specialist','related','higher_education','Reviewed environmental/sustainability pathway'),
    (45,'agronomist','direct','higher_education','Named Agricultural Science degree'),
    (45,'farm-manager','related','higher_education','Agricultural Science is a reviewed farm-systems pathway, not a dedicated farm-management award'),
    (100,'architect','direct','higher_education','Named Architecture degree'),
    (2698,'cybersecurity-analyst','direct','higher_education','Named Cybersecurity postgraduate programme'),
    (3,'accountant','direct','higher_education','Named Accounting degree'),
    (3,'auditor','related','higher_education','Accounting is a reviewed professional pathway to audit roles'),
    (504,'software-developer','direct','higher_education','Named Computer Science degree'),
    (2696,'cybersecurity-analyst','direct','higher_education','Named Cybersecurity postgraduate programme'),
    (505,'software-developer','direct','higher_education','Named Computer Science degree'),
    (580,'construction-manager','direct','higher_education','Named Construction Management and Engineering degree'),
    (580,'project-manager','related','higher_education','Construction management is a reviewed sector-specific project-management pathway'),
    (847,'electrical-engineer','direct','higher_education','Named Electrical Engineering degree'),
    (44,'agronomist','direct','higher_education','Named Agricultural Science degree'),
    (44,'farm-manager','related','higher_education','Agricultural Science is a reviewed farm-systems pathway, not a dedicated farm-management award'),
    (522,'software-developer','direct','higher_education','Named Computer Science and Information Technology degree'),
    (522,'ict-support-technician','related','higher_education','Information Technology is a reviewed related ICT support pathway'),
    (522,'network-administrator','related','higher_education','Information Technology is a reviewed related network-systems pathway'),
    (823,'civil-engineer','direct','higher_education','Named Civil Engineering degree'),
    (102,'architect','direct','higher_education','Named Architecture degree'),
    (475,'cloud-engineer','direct','higher_education','Named Cloud Computing degree'),
    (475,'network-administrator','related','higher_education','Cloud Computing is a reviewed infrastructure/network pathway'),
    (475,'ict-support-technician','related','higher_education','Cloud Computing is a reviewed infrastructure support pathway'),
    (573,'construction-manager','direct','higher_education','Named Construction Management degree'),
    (573,'project-manager','related','higher_education','Construction management is a reviewed sector-specific project-management pathway'),
    (618,'chef','direct','higher_education','Named Culinary Arts degree'),
    (618,'cook','direct','higher_education','Named Culinary Arts degree'),
    (664,'cybersecurity-analyst','direct','higher_education','Named Digital Forensics and Cyber Security degree'),
    (973,'film-editor','related','higher_education','Film and Broadcasting is a reviewed film-production pathway'),
    (973,'multimedia-designer','related','higher_education','Film and Broadcasting is a reviewed multimedia-production pathway'),
    (20,'accountant','direct','higher_education','Named Accounting and Finance degree'),
    (20,'financial-analyst','related','higher_education','Finance is explicit in the degree title'),
    (642,'data-analyst','direct','higher_education','Named Data Science degree'),
    (642,'data-engineer','related','higher_education','Data Science is a reviewed adjacent pathway to data engineering'),
    (2801,'ux-designer','direct','higher_education','Named User Experience and Interaction programme'),
    (2801,'web-designer','related','higher_education','UX and interaction design is a reviewed adjacent web-design pathway'),
    (575,'construction-manager','direct','higher_education','Named Construction Management degree'),
    (575,'project-manager','related','higher_education','Construction management is a reviewed sector-specific project-management pathway'),
    (603,'multimedia-designer','direct','higher_education','Named Creative Digital Media degree'),
    (603,'graphic-designer','related','higher_education','Creative Digital Media is a reviewed visual-design pathway'),
    (603,'film-editor','related','higher_education','Creative Digital Media is a reviewed production/post-production pathway'),
    (624,'chef','direct','higher_education','Named Culinary Leadership and Management degree'),
    (624,'hospitality-supervisor','related','higher_education','Culinary leadership is a reviewed hospitality-supervision pathway'),
    (624,'restaurant-manager','related','higher_education','Culinary leadership is a reviewed food-service management pathway'),
    (821,'chemical-engineer','direct','higher_education','Named Chemical and Biopharmaceutical Engineering degree'),
    (821,'manufacturing-engineer','related','higher_education','Biopharmaceutical engineering is a reviewed process/manufacturing pathway'),
    (3459,'marine-engineer','direct','higher_education','Named Marine Engineering degree'),
    (2490,'bricklayer','direct','employment_based_apprenticeship','National Brick and Stonelaying apprenticeship'),
    (2491,'carpenter','direct','employment_based_apprenticeship','National Carpentry and Joinery apprenticeship'),
    (2497,'plumber','direct','employment_based_apprenticeship','National Plumbing apprenticeship'),
    (3221,'aircraft-maintenance-technician','direct','employment_based_apprenticeship','National Aircraft Mechanics apprenticeship'),
    (3222,'electrician','direct','employment_based_apprenticeship','National Electrical apprenticeship'),
    (3227,'hvac-technician','direct','employment_based_apprenticeship','National Refrigeration and Air Conditioning apprenticeship'),
    (3516,'welder','direct','employment_based_apprenticeship','National Metal Fabrication apprenticeship is a reviewed welding/fabrication pathway'),
    (3520,'plumber','related','employment_based_apprenticeship','National Pipefitting apprenticeship is related to the broader plumbing/pipe systems occupation family')
)
INSERT INTO public.program_occupation_ie_staging (
  program_catalog_id,canonical_career_id,rule_version,match_basis,match_pattern,review_status,
  relation_type,access_model,source_checked_at,reviewer_note
)
SELECT
  p.id,r.canonical_career_id,'ie-program-occupation-v1',r.match_basis,p.title,'approved',
  r.relation_type,r.access_model,DATE '2026-08-10',
  CASE WHEN r.access_model='employment_based_apprenticeship'
    THEN 'Educational/occupational pathway only. Apprenticeship requires an employer relationship and is not represented as an ordinary non-EEA student-permission route.'
    ELSE 'Educational relevance only. This relationship does not imply professional registration, licensing, immigration eligibility or employment eligibility.' END
FROM relation_seed r
JOIN public.program_catalog_ie_staging p ON p.legacy_course_id=r.legacy_course_id
ON CONFLICT (program_catalog_id,canonical_career_id,rule_version) DO UPDATE SET
  match_basis=excluded.match_basis,
  match_pattern=excluded.match_pattern,
  review_status=excluded.review_status,
  relation_type=excluded.relation_type,
  access_model=excluded.access_model,
  source_checked_at=excluded.source_checked_at,
  reviewed_at=now(),
  reviewer_note=excluded.reviewer_note;

INSERT INTO public.program_international_ie_staging (
  program_catalog_id,trusted_ireland_provider_authorised,trusted_ireland_source_url,
  ilep_or_trusted_programme_status,international_students_eligible,full_time_daytime_verified,
  international_admission_status,student_permission_context,stamp1g_context,
  eligible_programme_source_url,immigration_source_url,verification_status,source_checked_at,
  verified_at,reviewer_note
)
SELECT
  p.id,
  CASE WHEN p.provider_kind='higher_education' THEN true ELSE NULL END,
  CASE WHEN p.provider_kind='higher_education' THEN 'https://www.qqi.ie/news/qqi-announces-first-28-higher-education-institutions-authorised-to-use-trusted-ireland-quality' ELSE NULL END,
  CASE WHEN p.provider_kind='higher_education' THEN 'not_programme_verified' ELSE 'not_applicable' END,
  NULL,NULL,
  CASE WHEN p.provider_kind='higher_education' THEN 'eligible_schedule_unknown' ELSE 'restricted' END,
  CASE WHEN p.provider_kind='higher_education'
    THEN 'Provider-level TrustEd Ireland authorisation is verified, but exact eligible-programme status and full-time daytime study remain programme-level Phase 3 checks.'
    ELSE 'This is an employment-based apprenticeship pathway. Employer hiring/registration requirements are separate from ordinary student-permission study.' END,
  CASE WHEN p.provider_kind='higher_education'
    THEN 'NFQ level alone is not treated as proof of Third Level Graduate Programme eligibility; scheme conditions remain separate.'
    ELSE 'Not represented as a student-programme Stamp 1G pathway.' END,
  NULL,
  CASE WHEN p.provider_kind='higher_education'
    THEN 'https://www.irishimmigration.ie/coming-to-study-in-ireland/what-are-my-study-options/a-third-level-course-or-a-language-course/'
    ELSE NULL END,
  CASE WHEN p.provider_kind='higher_education' THEN 'provider_authorised_programme_pending' ELSE 'employment_based_not_student_route' END,
  DATE '2026-08-10',NULL,
  CASE WHEN p.provider_kind='higher_education'
    THEN 'Phase 2 verifies provider-level TrustEd context only. Do not infer exact programme eligibility, open applications or student permission from the legacy Qualifax row.'
    ELSE 'Current national apprenticeship identity retained as an occupation pathway. International student eligibility is intentionally not asserted.' END
FROM public.program_catalog_ie_staging p
ON CONFLICT (program_catalog_id) DO UPDATE SET
  trusted_ireland_provider_authorised=excluded.trusted_ireland_provider_authorised,
  trusted_ireland_source_url=excluded.trusted_ireland_source_url,
  ilep_or_trusted_programme_status=excluded.ilep_or_trusted_programme_status,
  international_students_eligible=excluded.international_students_eligible,
  full_time_daytime_verified=excluded.full_time_daytime_verified,
  international_admission_status=excluded.international_admission_status,
  student_permission_context=excluded.student_permission_context,
  stamp1g_context=excluded.stamp1g_context,
  eligible_programme_source_url=excluded.eligible_programme_source_url,
  immigration_source_url=excluded.immigration_source_url,
  verification_status=excluded.verification_status,
  source_checked_at=excluded.source_checked_at,
  verified_at=excluded.verified_at,
  reviewer_note=excluded.reviewer_note;
