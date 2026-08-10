-- Ireland Programs Phase 3 current verification.
-- Exact TrustEd eligible-programme rows remain a separate publication gate.
-- Tier A is intentionally impossible in this migration unless that programme-level evidence is verified.

DO $$
DECLARE
  programme_count integer;
  he_count integer;
  apprenticeship_count integer;
BEGIN
  SELECT count(*) INTO programme_count FROM public.program_catalog_ie_staging;
  SELECT count(*) INTO he_count FROM public.program_catalog_ie_staging WHERE provider_kind='higher_education';
  SELECT count(*) INTO apprenticeship_count FROM public.program_catalog_ie_staging WHERE provider_kind='apprenticeship_authority';

  IF programme_count<>40 OR he_count<>32 OR apprenticeship_count<>8 THEN
    RAISE EXCEPTION 'IE Phase 3 blocked: unexpected Phase 2 cohort total %, HE %, apprenticeship %', programme_count, he_count, apprenticeship_count;
  END IF;
END $$;

WITH verification_seed(
  legacy_course_id,provider_program_url,study_mode,currentness_status,verification_tier,
  international_students_eligible,full_time_daytime_verified,international_admission_status,
  international_verification_status,reviewer_note
) AS (
  VALUES
    (508,'https://www.dcu.ie/courses/undergraduate/school-computing/computer-science','full_time','current_provider_verified','B',true,true,'closed','review_required','Official DCU programme, full-time mode and non-EU application route verified. 2026 non-EU application deadline has passed. Exact TrustEd eligible-programme row remains pending.'),
    (645,'https://www.dcu.ie/courses/undergraduate/school-computing/data-science-and-artificial-intelligence','full_time','current_provider_verified','B',true,true,'closed','review_required','Official DCU programme, full-time mode and non-EU application route verified. 2026 non-EU application deadline has passed. Exact TrustEd eligible-programme row remains pending.'),
    (759,'https://www.dcu.ie/courses/undergraduate/institute-education/bachelor-education-primary-teaching','full_time','current_provider_verified','B',true,true,'closed','review_required','Official DCU programme, full-time mode and non-EU application route verified. 2026 non-EU application deadline has passed. Teaching Council registration remains a separate professional requirement. Exact TrustEd eligible-programme row remains pending.'),

    (506,'https://www.tcd.ie/courses/undergraduate/courses/computer-science/','full_time','current_provider_verified','B',true,true,'closed','review_required','Official Trinity programme and full-time non-EU route verified. 2026 non-EU application deadline has passed. Exact TrustEd eligible-programme row remains pending.'),
    (2814,'https://www.tcd.ie/courses/postgraduate/courses/diagnostic-radiography-msc/','full_time','current_provider_verified','B',true,true,'closed','review_required','Official Trinity Diagnostic Radiography MSc is full-time and the 2026 closing date has passed. CORU approves the qualification, but professional registration remains separate. Exact TrustEd eligible-programme row remains pending.'),
    (939,'https://www.tcd.ie/courses/undergraduate/courses/environmental-science-and-engineering/','full_time','current_provider_verified','B',true,true,'closed','review_required','Official Trinity programme and full-time non-EU route verified. 2026 non-EU application deadline has passed. Exact TrustEd eligible-programme row remains pending.'),

    (45,'https://hub.ucd.ie/usis/!W_HU_MENU.P_PUBLISH?MAJR=UAS1&p_tag=COURSE','full_time_on_campus','current_provider_verified','B',true,true,'open','review_required','Official UCD Agricultural Science page shows full-time on-campus delivery, an international non-EU audience and Apply Now for the September intake. Exact TrustEd eligible-programme row remains pending.'),
    (100,'https://hub.ucd.ie/usis/!W_HU_MENU.P_PUBLISH?MAJR=ATS4&p_tag=COURSE','full_time_on_campus','current_provider_verified','B',true,true,'closed','review_required','Official UCD Architecture page shows full-time on-campus delivery and explicitly marks 2026 Non-EU Undergraduates Closed. Statutory architect registration is separate from programme completion. Exact TrustEd eligible-programme row remains pending.'),
    (2698,'https://hub.ucd.ie/usis/!W_HU_MENU.P_PUBLISH?KEYWORD=msc+cybersecurity&MAJR=T380&p_tag=COURSE','part_time_blended','current_provider_verified','C',false,false,'restricted','rejected','Official UCD page identifies this MSc as two-year part-time blended study and explicitly states part-time courses are not eligible for a Study Visa. International applicants may apply in other circumstances, but this is not a standard CampCareer international student-permission route.'),

    (3,'https://www.ucc.ie/en/ck202/index.html','full_time','current_provider_verified','B',true,true,'closed','review_required','Official UCC Accounting programme and non-EU route verified. The 2026 international undergraduate application window has passed. Exact TrustEd eligible-programme row remains pending.'),
    (504,'https://www.ucc.ie/en/ck401/','full_time','current_provider_verified','B',true,true,'closed','review_required','Official UCC Computer Science programme and non-EU route verified. UCC reports the 2026 international application as closed. Exact TrustEd eligible-programme row remains pending.'),
    (2696,'https://www.ucc.ie/en/msccyb/','full_time','current_provider_verified','B',true,true,'closed','review_required','Official UCC Cybersecurity MSc is full-time with non-EU fees and is currently closed for the 2026 intake. Exact TrustEd eligible-programme row remains pending.'),

    (505,NULL,NULL,'legacy_snapshot_needs_recheck','C',NULL,NULL,'unknown','review_required','Current University of Limerick official provider programme page for the legacy Computer Science row was not resolved in this Phase 3 pass. Do not publish or infer international eligibility from legacy Qualifax alone.'),
    (580,'https://www.ul.ie/study/undergraduate/construction-management-and-engineering-bsc','full_time','current_provider_verified','B',true,true,'eligible_schedule_unknown','review_required','Official University of Limerick Construction Management and Engineering programme is current, full-time and exposes a Non-EU fee/application route. A current international closing date was not resolved; exact TrustEd eligible-programme row remains pending.'),
    (847,NULL,NULL,'legacy_snapshot_needs_recheck','C',NULL,NULL,'unknown','review_required','Current University of Limerick official provider programme page for the legacy Electrical Engineering row was not resolved in this Phase 3 pass. Do not publish or infer international eligibility from legacy Qualifax alone.'),

    (44,'https://www.universityofgalway.ie/courses/undergraduate-courses/agricultural-science.html','full_time_on_campus','current_provider_verified','B',true,true,'open','review_required','Official University of Galway programme shows on-campus Level 8 delivery, non-EU tuition and a full-degree international application route. September 2026 non-EU applications are open. Exact TrustEd eligible-programme row remains pending.'),
    (522,'https://www.universityofgalway.ie/courses/undergraduate-courses/computer-science-and-information-technology.html','full_time_on_campus','current_provider_verified','B',true,true,'open','review_required','Official University of Galway programme and full-degree non-EU application route verified for September 2026; applications are open. Exact TrustEd eligible-programme row remains pending.'),
    (823,'https://www.universityofgalway.ie/courses/undergraduate-courses/civil-engineering.html','full_time_on_campus','current_provider_verified','B',true,true,'open','review_required','Official University of Galway Civil Engineering programme and full-degree non-EU application route verified for September 2026; applications are open. Exact TrustEd eligible-programme row remains pending.'),

    (102,'https://www.tudublin.ie/study/undergraduate/courses/architecture-tu832/','full_time','current_provider_verified','B',true,true,'closed','review_required','Official TU Dublin Architecture TU832 programme is full-time and provides non-EU fee/application context. The September 2026 non-EU application window closed in June. Statutory architect registration remains separate. Exact TrustEd eligible-programme row remains pending.'),
    (475,'https://www.tudublin.ie/study/undergraduate/courses/computing-with-it-management-tu865/','full_time','current_provider_verified','B',true,true,'closed','review_required','Official TU Dublin TU865 page identifies the current Cloud Computing programme as full-time with non-EU context. The September 2026 non-EU application window closed in June. Exact TrustEd eligible-programme row remains pending.'),
    (573,'https://www.tudublin.ie/study/undergraduate/courses/construction-management-tu833/','full_time','current_provider_verified','B',true,true,'closed','review_required','Official TU Dublin Construction Management TU833 programme is full-time with non-EU context. The September 2026 non-EU application window closed in June. Exact TrustEd eligible-programme row remains pending.'),
    (618,'https://www.tudublin.ie/study/undergraduate/courses/culinary-arts--tu942/','full_time','current_provider_verified','B',true,true,'closed','review_required','Official TU Dublin Culinary Arts TU942 programme is full-time and explicitly supports international applicants. The September 2026 non-EU application window closed in June. Exact TrustEd eligible-programme row remains pending.'),
    (664,'https://www.tudublin.ie/study/undergraduate/courses/computing-dig-forensics-and-cyber-sec-tu863/','full_time','current_provider_verified','B',true,true,'closed','review_required','Official TU Dublin Digital Forensics and Cyber Security TU863 programme is full-time with non-EU/student-visa context. The September 2026 non-EU application window closed in June. Exact TrustEd eligible-programme row remains pending.'),
    (973,'https://www.tudublin.ie/study/undergraduate/courses/film-and-broadcasting-tu983/','full_time','current_provider_verified','B',true,true,'closed','review_required','Official TU Dublin Film and Broadcasting TU983 programme is full-time with non-EU/student-visa context. The September 2026 non-EU application window closed in June. Exact TrustEd eligible-programme row remains pending.'),

    (20,'https://www.maynoothuniversity.ie/study-maynooth/undergraduate-studies/courses/ba-accounting-and-finance','standard_undergraduate_mode_pending_daytime_check','current_provider_verified','B',true,NULL,'closed','review_required','Official Maynooth BA Accounting and Finance and international applicant route verified. The programme closed 1 July 2026. A separate explicit full-time daytime statement was not resolved, and the exact TrustEd eligible-programme row remains pending.'),
    (642,'https://www.maynoothuniversity.ie/study-maynooth/undergraduate-studies/courses/bsc-bachelor-data-science','standard_undergraduate_mode_pending_daytime_check','current_provider_verified','B',true,NULL,'closed','review_required','Official Maynooth BSc Data Science and international applicant route verified. The programme closed 1 July 2026. A separate explicit full-time daytime statement was not resolved, and the exact TrustEd eligible-programme row remains pending.'),
    (2801,'https://www.maynoothuniversity.ie/study-maynooth/postgraduate-studies/courses/msc-design-user-experience-interaction-uxi','full_time_on_site','current_provider_verified','B',true,true,'open','review_required','Official Maynooth MSc UX&I is full-time on-site. International applications are open for 2026/27 and the programme closing date is 14 August 2026. Exact TrustEd eligible-programme row remains pending.'),

    (575,'https://www.mtu.ie/courses/mt856/','full_time','current_provider_verified','B',true,true,'closed','review_required','Official MTU Construction Management MT856 is full-time with non-EU application context. The 2026 non-EU deadline has passed. Exact TrustEd eligible-programme row remains pending.'),
    (603,'https://www.mtu.ie/courses/mt824/','full_time','current_provider_verified','B',true,true,'closed','review_required','Official MTU Creative Digital Media MT824 is full-time with non-EU application context. The 2026 non-EU deadline has passed. Exact TrustEd eligible-programme row remains pending.'),
    (624,'https://www.mtu.ie/courses/mt949/','full_time','current_provider_verified','B',true,true,'closed','review_required','Official MTU Culinary Leadership and Management MT949 is full-time with non-EU application context. MTU Cork reports September 2026 international applications closed. Exact TrustEd eligible-programme row remains pending.'),
    (821,'https://www.mtu.ie/courses/mt838/','full_time','current_provider_verified','B',true,true,'closed','review_required','Official MTU Chemical and Biopharmaceutical Engineering MT838 is full-time with non-EU application context. The 2026 non-EU deadline has passed. Exact TrustEd eligible-programme row remains pending.'),
    (3459,'https://www.mtu.ie/courses/mt764/','full_time','current_provider_verified','C',NULL,true,'restricted','review_required','Official MTU Marine Engineering MT764 is full-time, but non-EU access is conditional and normally requires sponsorship by an approved internationally trading shipping company plus additional requirements. It is not represented as a general international-student route.')
)
UPDATE public.program_catalog_ie_staging p
SET provider_program_url=v.provider_program_url,
    study_mode=v.study_mode,
    currentness_status=v.currentness_status,
    source_as_of=DATE '2026-08-10',
    verification_tier=v.verification_tier,
    collection_status=CASE
      WHEN v.verification_tier='B' THEN 'phase3_tier_b_current_programme_international_route_trusted_row_pending'
      ELSE 'phase3_tier_c_restricted_or_current_provider_evidence_unresolved'
    END
FROM verification_seed v
WHERE p.legacy_course_id=v.legacy_course_id
  AND p.provider_kind='higher_education';

WITH verification_seed(
  legacy_course_id,international_students_eligible,full_time_daytime_verified,international_admission_status,
  international_verification_status,reviewer_note
) AS (
  VALUES
    (508,true,true,'closed','review_required','Official current programme and provider-level international route verified; exact TrustEd eligible-programme row remains pending.'),
    (645,true,true,'closed','review_required','Official current programme and provider-level international route verified; exact TrustEd eligible-programme row remains pending.'),
    (759,true,true,'closed','review_required','Official current programme and provider-level international route verified; Teaching Council registration remains separate; exact TrustEd eligible-programme row remains pending.'),
    (506,true,true,'closed','review_required','Official current programme and provider-level international route verified; exact TrustEd eligible-programme row remains pending.'),
    (2814,true,true,'closed','review_required','Official current programme and provider-level international route verified. CORU-approved qualification does not remove the separate registration requirement. Exact TrustEd eligible-programme row remains pending.'),
    (939,true,true,'closed','review_required','Official current programme and provider-level international route verified; exact TrustEd eligible-programme row remains pending.'),
    (45,true,true,'open','review_required','Official UCD full-time on-campus programme and current non-EU Apply Now route verified; exact TrustEd eligible-programme row remains pending.'),
    (100,true,true,'closed','review_required','Official UCD full-time on-campus programme verified and 2026 non-EU route is closed; architect registration remains separate; exact TrustEd eligible-programme row remains pending.'),
    (2698,false,false,'restricted','rejected','UCD explicitly states this two-year part-time blended MSc is not eligible for a Study Visa. It is excluded from the standard CampCareer international student-permission pathway.'),
    (3,true,true,'closed','review_required','Official current UCC programme and international route verified; 2026 application window is closed; exact TrustEd eligible-programme row remains pending.'),
    (504,true,true,'closed','review_required','Official current UCC programme and international route verified; 2026 application window is closed; exact TrustEd eligible-programme row remains pending.'),
    (2696,true,true,'closed','review_required','Official current UCC full-time MSc and non-EU context verified; 2026 application is closed; exact TrustEd eligible-programme row remains pending.'),
    (505,NULL,NULL,'unknown','review_required','Official current UL programme source was not resolved in this pass. Legacy Qualifax is insufficient for international eligibility or publication.'),
    (580,true,true,'eligible_schedule_unknown','review_required','Official current UL full-time programme and Non-EU route verified, but a current international closing date and exact TrustEd eligible-programme row remain pending.'),
    (847,NULL,NULL,'unknown','review_required','Official current UL programme source was not resolved in this pass. Legacy Qualifax is insufficient for international eligibility or publication.'),
    (44,true,true,'open','review_required','Official University of Galway full-degree non-EU route is open for September 2026; exact TrustEd eligible-programme row remains pending.'),
    (522,true,true,'open','review_required','Official University of Galway full-degree non-EU route is open for September 2026; exact TrustEd eligible-programme row remains pending.'),
    (823,true,true,'open','review_required','Official University of Galway full-degree non-EU route is open for September 2026; exact TrustEd eligible-programme row remains pending.'),
    (102,true,true,'closed','review_required','Official TU Dublin full-time programme and non-EU route verified; September 2026 applications are closed; architect registration remains separate; exact TrustEd eligible-programme row remains pending.'),
    (475,true,true,'closed','review_required','Official TU Dublin full-time programme and non-EU route verified; September 2026 applications are closed; exact TrustEd eligible-programme row remains pending.'),
    (573,true,true,'closed','review_required','Official TU Dublin full-time programme and non-EU route verified; September 2026 applications are closed; exact TrustEd eligible-programme row remains pending.'),
    (618,true,true,'closed','review_required','Official TU Dublin full-time programme and non-EU route verified; September 2026 applications are closed; exact TrustEd eligible-programme row remains pending.'),
    (664,true,true,'closed','review_required','Official TU Dublin full-time programme and non-EU/student-visa context verified; September 2026 applications are closed; exact TrustEd eligible-programme row remains pending.'),
    (973,true,true,'closed','review_required','Official TU Dublin full-time programme and non-EU/student-visa context verified; September 2026 applications are closed; exact TrustEd eligible-programme row remains pending.'),
    (20,true,NULL,'closed','review_required','Official Maynooth programme and international application route verified; programme closed 1 July 2026. Explicit full-time daytime evidence and exact TrustEd eligible-programme row remain pending.'),
    (642,true,NULL,'closed','review_required','Official Maynooth programme and international application route verified; programme closed 1 July 2026. Explicit full-time daytime evidence and exact TrustEd eligible-programme row remain pending.'),
    (2801,true,true,'open','review_required','Official Maynooth full-time on-site MSc and international application route verified; closing date is 14 August 2026. Exact TrustEd eligible-programme row remains pending.'),
    (575,true,true,'closed','review_required','Official MTU full-time programme and non-EU route verified; 2026 deadline passed; exact TrustEd eligible-programme row remains pending.'),
    (603,true,true,'closed','review_required','Official MTU full-time programme and non-EU route verified; 2026 deadline passed; exact TrustEd eligible-programme row remains pending.'),
    (624,true,true,'closed','review_required','Official MTU full-time programme and non-EU route verified; MTU Cork September 2026 international applications are closed; exact TrustEd eligible-programme row remains pending.'),
    (821,true,true,'closed','review_required','Official MTU full-time programme and non-EU route verified; 2026 deadline passed; exact TrustEd eligible-programme row remains pending.'),
    (3459,NULL,true,'restricted','review_required','Official MTU Marine Engineering is full-time, but non-EU access is conditional on approved international shipping-company sponsorship and other requirements. Do not present as a general international-student route.')
)
UPDATE public.program_international_ie_staging x
SET ilep_or_trusted_programme_status='not_programme_verified',
    international_students_eligible=v.international_students_eligible,
    full_time_daytime_verified=v.full_time_daytime_verified,
    international_admission_status=v.international_admission_status,
    student_permission_context=CASE
      WHEN v.legacy_course_id=2698 THEN 'Part-time blended study is not a Study Visa route; UCD explicitly states part-time courses are not eligible for a Study Visa.'
      WHEN v.legacy_course_id=3459 THEN 'Full-time course, but non-EU access is conditional on approved international shipping-company sponsorship and additional maritime entry requirements.'
      WHEN v.legacy_course_id IN (505,847) THEN 'Current official provider programme evidence is unresolved; no student-permission eligibility is inferred from legacy catalogue data.'
      ELSE 'Provider programme and international admission context have been checked, but exact TrustEd eligible-programme status remains a separate publication gate.'
    END,
    stamp1g_context='NFQ level or provider admission alone is not treated as proof of Third Level Graduate Programme eligibility; immigration scheme conditions remain separate.',
    eligible_programme_source_url=NULL,
    immigration_source_url='https://www.irishimmigration.ie/coming-to-study-in-ireland/what-are-my-study-options/a-third-level-course-or-a-language-course/',
    verification_status=v.international_verification_status,
    source_checked_at=DATE '2026-08-10',
    verified_at=now(),
    reviewer_note=v.reviewer_note
FROM verification_seed v
JOIN public.program_catalog_ie_staging p ON p.legacy_course_id=v.legacy_course_id
WHERE x.program_catalog_id=p.id
  AND p.provider_kind='higher_education';

-- Regulated profession boundaries are educational-pathway notes, never automatic registration claims.
UPDATE public.program_occupation_ie_staging o
SET reviewer_note = CASE
      WHEN p.legacy_course_id=759 AND o.canonical_career_id='primary-school-teacher'
        THEN 'Educational pathway verified. DCU is an accredited primary ITE provider; Teaching Council registration, qualification and vetting requirements remain separate from programme admission and immigration.'
      WHEN p.legacy_course_id=2814 AND o.canonical_career_id='radiographer'
        THEN 'Educational pathway verified. CORU lists Trinity MSc Diagnostic Radiography as an approved qualification, but CORU registration and protected-title requirements remain separate from programme admission and immigration.'
      WHEN p.legacy_course_id IN (100,102) AND o.canonical_career_id='architect'
        THEN 'Educational pathway verified. In Ireland the title Architect is protected and statutory registration on the Register of Architects remains separate from completing this programme.'
      ELSE o.reviewer_note
    END,
    source_checked_at=DATE '2026-08-10',
    reviewed_at=now()
FROM public.program_catalog_ie_staging p
WHERE o.program_catalog_id=p.id
  AND (
    (p.legacy_course_id=759 AND o.canonical_career_id='primary-school-teacher') OR
    (p.legacy_course_id=2814 AND o.canonical_career_id='radiographer') OR
    (p.legacy_course_id IN (100,102) AND o.canonical_career_id='architect')
  );

DO $$
DECLARE
  tier_a_count integer;
  tier_b_count integer;
  tier_c_count integer;
  current_provider_count integer;
  programme_url_count integer;
  intl_true_count integer;
  intl_false_count integer;
  full_time_true_count integer;
  full_time_false_count integer;
  open_count integer;
  closed_count integer;
  restricted_count integer;
  unknown_count integer;
  schedule_unknown_count integer;
  exact_trusted_eligible_count integer;
  invalid_b_count integer;
BEGIN
  SELECT
    count(*) FILTER (WHERE verification_tier='A'),
    count(*) FILTER (WHERE verification_tier='B'),
    count(*) FILTER (WHERE verification_tier='C'),
    count(*) FILTER (WHERE currentness_status='current_provider_verified'),
    count(*) FILTER (WHERE provider_program_url IS NOT NULL)
  INTO tier_a_count,tier_b_count,tier_c_count,current_provider_count,programme_url_count
  FROM public.program_catalog_ie_staging;

  IF tier_a_count<>0 OR tier_b_count<>28 OR tier_c_count<>12 THEN
    RAISE EXCEPTION 'Unexpected IE Phase 3 tiers A %, B %, C %',tier_a_count,tier_b_count,tier_c_count;
  END IF;

  IF current_provider_count<>30 OR programme_url_count<>30 THEN
    RAISE EXCEPTION 'Unexpected IE Phase 3 current-provider evidence: current %, URLs %',current_provider_count,programme_url_count;
  END IF;

  SELECT
    count(*) FILTER (WHERE international_students_eligible IS TRUE),
    count(*) FILTER (WHERE international_students_eligible IS FALSE),
    count(*) FILTER (WHERE full_time_daytime_verified IS TRUE),
    count(*) FILTER (WHERE full_time_daytime_verified IS FALSE),
    count(*) FILTER (WHERE international_admission_status='open'),
    count(*) FILTER (WHERE international_admission_status='closed'),
    count(*) FILTER (WHERE international_admission_status='restricted'),
    count(*) FILTER (WHERE international_admission_status='unknown'),
    count(*) FILTER (WHERE international_admission_status='eligible_schedule_unknown'),
    count(*) FILTER (WHERE ilep_or_trusted_programme_status='eligible')
  INTO intl_true_count,intl_false_count,full_time_true_count,full_time_false_count,open_count,closed_count,restricted_count,unknown_count,schedule_unknown_count,exact_trusted_eligible_count
  FROM public.program_international_ie_staging;

  IF intl_true_count<>28 OR intl_false_count<>1 THEN
    RAISE EXCEPTION 'Unexpected IE Phase 3 international eligibility true %, false %',intl_true_count,intl_false_count;
  END IF;

  IF full_time_true_count<>27 OR full_time_false_count<>1 THEN
    RAISE EXCEPTION 'Unexpected IE Phase 3 full-time checks true %, false %',full_time_true_count,full_time_false_count;
  END IF;

  IF open_count<>5 OR closed_count<>22 OR restricted_count<>10 OR unknown_count<>2 OR schedule_unknown_count<>1 THEN
    RAISE EXCEPTION 'Unexpected IE Phase 3 admission states open %, closed %, restricted %, unknown %, schedule unknown %',open_count,closed_count,restricted_count,unknown_count,schedule_unknown_count;
  END IF;

  IF exact_trusted_eligible_count<>0 THEN
    RAISE EXCEPTION 'IE Phase 3 must not assert exact TrustEd programme eligibility without exact list-row verification';
  END IF;

  SELECT count(*) INTO invalid_b_count
  FROM public.program_catalog_ie_staging p
  JOIN public.program_international_ie_staging x ON x.program_catalog_id=p.id
  WHERE p.verification_tier='B'
    AND (
      p.provider_kind<>'higher_education'
      OR p.currentness_status<>'current_provider_verified'
      OR p.provider_program_url IS NULL
      OR x.trusted_ireland_provider_authorised IS DISTINCT FROM TRUE
      OR x.international_students_eligible IS DISTINCT FROM TRUE
      OR x.verification_status<>'review_required'
      OR x.ilep_or_trusted_programme_status<>'not_programme_verified'
    );

  IF invalid_b_count>0 THEN
    RAISE EXCEPTION 'IE Phase 3 invariant failed: % Tier B rows lack the required current-provider/international boundary',invalid_b_count;
  END IF;
END $$;
