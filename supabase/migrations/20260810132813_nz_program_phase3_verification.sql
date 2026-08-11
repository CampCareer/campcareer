-- New Zealand Programs Phase 3 verification.
-- Scope remains the 24-program occupation-led Phase 2 cohort only.
-- Publication readiness is independent from whether an application window is open today.

DO $$
DECLARE
  programme_count integer;
  international_count integer;
  approved_relation_count integer;
  distinct_career_count integer;
  duplicate_source_count integer;
  duplicate_provider_title_count integer;
  missing_source_count integer;
  incomplete_relation_count integer;
  non_target_relation_count integer;
BEGIN
  SELECT count(*) INTO programme_count FROM public.program_catalog_nz_staging;
  SELECT count(*) INTO international_count FROM public.program_international_nz_staging;
  SELECT count(*) FILTER (WHERE review_status = 'approved'), count(DISTINCT canonical_career_id) FILTER (WHERE review_status = 'approved')
    INTO approved_relation_count, distinct_career_count
  FROM public.program_occupation_nz_staging;

  IF programme_count <> 24 OR international_count <> 24 OR programme_count <> international_count THEN
    RAISE EXCEPTION 'NZ Phase 3 blocked: expected 24 programme/international rows 1:1, found % / %', programme_count, international_count;
  END IF;

  IF approved_relation_count <> 39 OR distinct_career_count <> 35 THEN
    RAISE EXCEPTION 'NZ Phase 3 blocked: expected 39 approved relations across 35 careers, found % / %', approved_relation_count, distinct_career_count;
  END IF;

  SELECT count(*) INTO duplicate_source_count
  FROM (
    SELECT source_name, source_program_key
    FROM public.program_catalog_nz_staging
    GROUP BY source_name, source_program_key
    HAVING count(*) > 1
  ) d;

  SELECT count(*) INTO duplicate_provider_title_count
  FROM (
    SELECT institution_id, lower(btrim(title))
    FROM public.program_catalog_nz_staging
    GROUP BY institution_id, lower(btrim(title))
    HAVING count(*) > 1
  ) d;

  IF duplicate_source_count > 0 OR duplicate_provider_title_count > 0 THEN
    RAISE EXCEPTION 'NZ Phase 3 blocked: duplicate source groups %, provider/title groups %', duplicate_source_count, duplicate_provider_title_count;
  END IF;

  SELECT count(*) INTO missing_source_count
  FROM public.program_catalog_nz_staging
  WHERE nullif(btrim(official_program_url), '') IS NULL
     OR official_program_url !~ '^https://'
     OR source_as_of IS NULL;

  IF missing_source_count > 0 THEN
    RAISE EXCEPTION 'NZ Phase 3 blocked: % programmes lack current official HTTPS source evidence', missing_source_count;
  END IF;

  SELECT count(*) INTO incomplete_relation_count
  FROM public.program_occupation_nz_staging
  WHERE review_status = 'approved'
    AND (source_checked_at IS NULL OR reviewed_at IS NULL);

  IF incomplete_relation_count > 0 THEN
    RAISE EXCEPTION 'NZ Phase 3 blocked: % approved occupation relations lack review/source dates', incomplete_relation_count;
  END IF;

  SELECT count(*) INTO non_target_relation_count
  FROM public.program_occupation_nz_staging r
  WHERE r.review_status = 'approved'
    AND NOT EXISTS (
      SELECT 1
      FROM public.program_occupation_match_rules m
      WHERE m.country_code = 'CA'
        AND m.review_status = 'approved'
        AND m.canonical_career_id = r.canonical_career_id
    );

  IF non_target_relation_count > 0 THEN
    RAISE EXCEPTION 'NZ Phase 3 blocked: % approved relations fall outside the canonical 80-career target set', non_target_relation_count;
  END IF;
END $$;

-- Strengthen the aviation programme identity from the generic qualification page
-- to Massey's current Air Transport Pilot major page.
UPDATE public.program_catalog_nz_staging
SET official_program_url = 'https://www.massey.ac.nz/study/all-qualifications-and-degrees/bachelor-of-aviation-UBAVT/air-transport-pilot-UBAVT1JARTP1/',
    international_source_url = 'https://www.massey.ac.nz/study/all-qualifications-and-degrees/bachelor-of-aviation-UBAVT/air-transport-pilot-UBAVT1JARTP1/',
    source_as_of = DATE '2026-08-10'
WHERE source_program_key = 'massey-bav-air-transport-pilot';

-- Current international-study evidence. Exact programme pages are used where they
-- carry international fees/requirements; degree/international subject pages are
-- paired with the exact programme identity where the provider publishes them separately.
WITH evidence(source_program_key, international_source_url) AS (
  VALUES
    ('uoa-behons-civil-engineering','https://www.auckland.ac.nz/en/about-us/about-the-university/the-university/official-publications/university-calendar/current-calendar/academic-statutes-and-regulations/international-students.html'),
    ('uoa-behons-software-engineering','https://www.auckland.ac.nz/en/study/study-options/find-a-study-option/software-engineering/undergraduate.html'),
    ('uoa-bsc-data-science','https://www.auckland.ac.nz/en/study/study-options/find-a-study-option/data-science.html'),
    ('aut-bhsc-nursing','https://www.aut.ac.nz/study/study-options/health-sciences/courses/bachelor-of-health-science-in-nursing'),
    ('aut-bhsc-midwifery','https://www.aut.ac.nz/study/study-options/health-sciences/courses/bachelor-of-health-science-in-midwifery'),
    ('aut-bhsc-physiotherapy','https://www.aut.ac.nz/study/study-options/health-sciences/courses/bachelor-of-health-science-in-physiotherapy'),
    ('otago-bphysio','https://www.otago.ac.nz/healthsciences/students/professional/physiotherapy'),
    ('otago-bpharm','https://www.otago.ac.nz/healthsciences/students/professional/pharmacy'),
    ('otago-bmlsc','https://www.otago.ac.nz/healthsciences/students/professional/medical-laboratory-science'),
    ('massey-bconst-construction-management','https://www.massey.ac.nz/study/all-qualifications-and-degrees/bachelor-of-construction-UBCNS/'),
    ('massey-bfoodtech-hons','https://www.massey.ac.nz/study/all-qualifications-and-degrees/bachelor-of-food-technology-with-honours-UHFDT/'),
    ('massey-bav-air-transport-pilot','https://www.massey.ac.nz/study/all-qualifications-and-degrees/bachelor-of-aviation-UBAVT/air-transport-pilot-UBAVT1JARTP1/'),
    ('uc-behons-electrical-electronic','https://www.canterbury.ac.nz/study/academic-study/engineering/international-pathway-engineering'),
    ('uc-bforestrysci','https://www.canterbury.ac.nz/study/academic-study/qualifications/bachelor-of-forestry-science'),
    ('uc-bswhons','https://www.canterbury.ac.nz/study/academic-study/qualifications/bachelor-of-social-work-with-honours'),
    ('lincoln-bagrisci','https://www.lincoln.ac.nz/study/study-programmes/programme-search/bachelor-of-agricultural-science/'),
    ('lincoln-benvmgmt','https://www.lincoln.ac.nz/study/study-programmes/programme-search/bachelor-of-environmental-management/'),
    ('lincoln-mtourismmgmt','https://www.lincoln.ac.nz/study/study-programmes/programme-search/master-of-tourism-management/'),
    ('waikato-btchg-early-childhood','https://www.waikato.ac.nz/study/qualifications/bachelor-of-teaching/'),
    ('waikato-btchg-primary','https://www.waikato.ac.nz/study/qualifications/bachelor-of-teaching/'),
    ('waikato-bbus-accounting','https://www.waikato.ac.nz/study/fees-costs/international-tuition-costs/'),
    ('vuw-bdi-interaction-design','https://www.wgtn.ac.nz/explore/study-areas/design/study?international=true&subject=interaction-design'),
    ('vuw-bdi-communication-design','https://www.wgtn.ac.nz/explore/study-areas/design/study?international=true&subject=communication-design'),
    ('vuw-bcom-hrer','https://www.wgtn.ac.nz/explore/study-areas/human-resources/study?international=true')
)
UPDATE public.program_catalog_nz_staging p
SET international_source_url = e.international_source_url,
    source_as_of = DATE '2026-08-10'
FROM evidence e
WHERE p.source_program_key = e.source_program_key;

-- Provider-level Code context is intentionally stored separately from programme
-- international eligibility. These are current provider statements that the
-- universities observe / are bound by the Code for international learners.
WITH code_evidence(provider_number, code_source_url) AS (
  VALUES
    ('7001','https://www.auckland.ac.nz/en/about-us/about-the-university/the-university/official-publications/university-calendar/current-calendar/academic-statutes-and-regulations/international-students.html'),
    ('7008','https://www.aut.ac.nz/international/find-an-international-agent/for-agents-prospective-and-registered-agents'),
    ('7007','https://www.otago.ac.nz/international/education-pastoral-care-of-international-students-code-of-practice'),
    ('7003','https://www.massey.ac.nz/about/university-calendar-and-regulations/enrolment-regulations/'),
    ('7005','https://www.canterbury.ac.nz/life/support-and-wellbeing/uc-support-services/international-student-support'),
    ('7006','https://www.lincoln.ac.nz/study/apply-and-enrol/apply/insurance-requirements/'),
    ('7002','https://www.waikato.ac.nz/int/study/international/preparing-to-come-to-new-zealand/international-student-policies/'),
    ('7004','https://www.wgtn.ac.nz/international/why-wellington/support')
)
UPDATE public.program_international_nz_staging x
SET code_signatory_status = 'confirmed',
    code_signatory_source_url = c.code_source_url
FROM public.program_catalog_nz_staging p
JOIN code_evidence c ON c.provider_number = p.provider_number
WHERE x.program_catalog_id = p.id;

-- All 24 current rows have direct official evidence of an international route.
-- This does not mean applications are universally open or that a student visa is guaranteed.
UPDATE public.program_international_nz_staging x
SET international_students_eligible = TRUE,
    international_source_url = p.international_source_url,
    student_visa_context = 'Current official programme/provider evidence supports an international study route. Programme eligibility and Code context do not guarantee a student visa; the applicant must satisfy Immigration New Zealand requirements and any programme-specific conditions.',
    post_study_work_context = CASE
      WHEN p.nzqcf_level = 9 THEN 'Current Immigration New Zealand rules allow a Post Study Work Visa application after a New Zealand level 9 degree studied full-time for at least 30 weeks; a qualifying master''s can support up to three years. This is qualification-level context, not an applicant-specific visa decision.'
      ELSE 'Current Immigration New Zealand rules allow a Post Study Work Visa application after a New Zealand degree at level 7 or above studied full-time for at least 30 weeks. Visa outcome and occupational registration remain applicant-specific.'
    END,
    post_study_work_rule_effective_date = NULL,
    visa_source_url = 'https://www.immigration.govt.nz/study/after-you-finish-your-study/qualifications-needed-for-a-post-study-work-visa/',
    verification_status = 'verified',
    source_checked_at = DATE '2026-08-10',
    verified_at = now(),
    reviewer_note = 'Phase 3 separates programme identity, international eligibility, current application timing, provider Code context, visa context and professional registration.'
FROM public.program_catalog_nz_staging p
WHERE x.program_catalog_id = p.id;

-- Current-window states are asserted only where the official source gives a live
-- application window as of 2026-08-10. All other verified programmes stay
-- eligible_schedule_unknown rather than inferring a current window.
UPDATE public.program_international_nz_staging
SET international_admission_status = 'eligible_schedule_unknown',
    intake_label = NULL,
    intake_start_date = NULL,
    application_deadline = NULL,
    admission_source_url = NULL;

WITH open_windows(source_program_key, deadline, intake_label, admission_source_url) AS (
  VALUES
    ('otago-bphysio', DATE '2026-08-13', '2027 Health Sciences Professional Programme selection', 'https://www.otago.ac.nz/healthsciences/students/professional/physiotherapy'),
    ('otago-bpharm', DATE '2026-08-13', '2027 Health Sciences Professional Programme selection', 'https://www.otago.ac.nz/healthsciences/students/professional/pharmacy'),
    ('otago-bmlsc', DATE '2026-08-13', '2027 Health Sciences Professional Programme selection', 'https://www.otago.ac.nz/healthsciences/students/professional/medical-laboratory-science'),
    ('massey-bav-air-transport-pilot', DATE '2026-10-01', 'Next Semester One selected-entry intake', 'https://www.massey.ac.nz/study/all-qualifications-and-degrees/bachelor-of-aviation-UBAVT/air-transport-pilot-UBAVT1JARTP1/'),
    ('waikato-btchg-early-childhood', DATE '2026-08-24', 'Trimester A 2027', 'https://www.waikato.ac.nz/study/options/subject-areas/education/onsite-initial-teaching-education/guide-to-applying/'),
    ('waikato-btchg-primary', DATE '2026-08-24', 'Trimester A 2027', 'https://www.waikato.ac.nz/study/options/subject-areas/education/onsite-initial-teaching-education/guide-to-applying/')
)
UPDATE public.program_international_nz_staging x
SET international_admission_status = 'open',
    application_deadline = o.deadline,
    intake_label = o.intake_label,
    admission_source_url = o.admission_source_url
FROM public.program_catalog_nz_staging p
JOIN open_windows o ON o.source_program_key = p.source_program_key
WHERE x.program_catalog_id = p.id;

-- Preserve professional/licensing boundaries on direct pathways. A study relation
-- is not itself evidence of professional registration or licence eligibility.
UPDATE public.program_occupation_nz_staging
SET reviewer_note = concat_ws(' ', nullif(btrim(reviewer_note), ''),
  'Phase 3: education pathway only; professional registration/licensing requirements remain separate and must be checked independently.'),
    source_checked_at = DATE '2026-08-10',
    reviewed_at = now()
WHERE review_status = 'approved'
  AND canonical_career_id IN (
    'registered-nurse','midwife','physiotherapist','pharmacist','social-worker',
    'early-childhood-teacher','primary-school-teacher','commercial-pilot'
  );

-- Tier policy:
-- A = canonical provider + current exact programme identity + reviewed target-career
--     relation(s) + current official international-route evidence + confirmed provider
--     Code context. A current application window is NOT required.
-- B = programme identity and target relation are sound but a publication-critical
--     international/Code dimension is unresolved.
-- C = programme/provider identity or target relevance is unresolved.
UPDATE public.program_catalog_nz_staging p
SET verification_tier = CASE
      WHEN p.institution_id IS NOT NULL
       AND nullif(btrim(p.official_program_url), '') IS NOT NULL
       AND p.source_as_of IS NOT NULL
       AND x.international_students_eligible IS TRUE
       AND nullif(btrim(x.international_source_url), '') IS NOT NULL
       AND x.code_signatory_status = 'confirmed'
       AND nullif(btrim(x.code_signatory_source_url), '') IS NOT NULL
       AND x.verification_status = 'verified'
       AND EXISTS (
         SELECT 1 FROM public.program_occupation_nz_staging r
         WHERE r.program_catalog_id = p.id AND r.review_status = 'approved'
       )
      THEN 'A'
      WHEN p.institution_id IS NOT NULL
       AND nullif(btrim(p.official_program_url), '') IS NOT NULL
       AND EXISTS (
         SELECT 1 FROM public.program_occupation_nz_staging r
         WHERE r.program_catalog_id = p.id AND r.review_status = 'approved'
       )
      THEN 'B'
      ELSE 'C'
    END,
    collection_status = CASE
      WHEN x.international_students_eligible IS TRUE
       AND x.code_signatory_status = 'confirmed'
       AND x.verification_status = 'verified'
      THEN 'phase3_tier_a_source_verified'
      ELSE 'phase3_review_required'
    END
FROM public.program_international_nz_staging x
WHERE x.program_catalog_id = p.id;

DO $$
DECLARE
  tier_a integer;
  tier_b integer;
  tier_c integer;
  verified_international integer;
  code_confirmed integer;
  open_count integer;
  schedule_unknown_count integer;
  invalid_tier_a integer;
  non_target_relation_count integer;
  programme_without_relation integer;
  delivery_assertions integer;
BEGIN
  SELECT count(*) FILTER (WHERE verification_tier='A'),
         count(*) FILTER (WHERE verification_tier='B'),
         count(*) FILTER (WHERE verification_tier='C')
    INTO tier_a,tier_b,tier_c
  FROM public.program_catalog_nz_staging;

  IF tier_a <> 24 OR tier_b <> 0 OR tier_c <> 0 THEN
    RAISE EXCEPTION 'Unexpected NZ Phase 3 tier result: A %, B %, C %', tier_a,tier_b,tier_c;
  END IF;

  SELECT count(*) FILTER (WHERE international_students_eligible IS TRUE AND verification_status='verified'),
         count(*) FILTER (WHERE code_signatory_status='confirmed'),
         count(*) FILTER (WHERE international_admission_status='open'),
         count(*) FILTER (WHERE international_admission_status='eligible_schedule_unknown')
    INTO verified_international, code_confirmed, open_count, schedule_unknown_count
  FROM public.program_international_nz_staging;

  IF verified_international <> 24 OR code_confirmed <> 24 THEN
    RAISE EXCEPTION 'NZ Phase 3 international verification failed: verified %, Code confirmed %', verified_international, code_confirmed;
  END IF;

  IF open_count <> 6 OR schedule_unknown_count <> 18 THEN
    RAISE EXCEPTION 'Unexpected NZ Phase 3 admission states: open %, eligible_schedule_unknown %', open_count, schedule_unknown_count;
  END IF;

  SELECT count(*) INTO invalid_tier_a
  FROM public.program_catalog_nz_staging p
  JOIN public.program_international_nz_staging x ON x.program_catalog_id=p.id
  WHERE p.verification_tier='A'
    AND (p.institution_id IS NULL
      OR nullif(btrim(p.official_program_url),'') IS NULL
      OR nullif(btrim(p.international_source_url),'') IS NULL
      OR x.international_students_eligible IS DISTINCT FROM TRUE
      OR x.code_signatory_status <> 'confirmed'
      OR nullif(btrim(x.code_signatory_source_url),'') IS NULL
      OR x.verification_status <> 'verified');

  IF invalid_tier_a > 0 THEN
    RAISE EXCEPTION 'NZ Phase 3 invariant failed: % Tier A rows lack required evidence', invalid_tier_a;
  END IF;

  SELECT count(*) INTO non_target_relation_count
  FROM public.program_occupation_nz_staging r
  WHERE r.review_status='approved'
    AND NOT EXISTS (
      SELECT 1 FROM public.program_occupation_match_rules m
      WHERE m.country_code='CA' AND m.review_status='approved'
        AND m.canonical_career_id=r.canonical_career_id
    );

  IF non_target_relation_count > 0 THEN
    RAISE EXCEPTION 'NZ Phase 3 invariant failed: % relations outside canonical 80', non_target_relation_count;
  END IF;

  SELECT count(*) INTO programme_without_relation
  FROM public.program_catalog_nz_staging p
  WHERE NOT EXISTS (
    SELECT 1 FROM public.program_occupation_nz_staging r
    WHERE r.program_catalog_id=p.id AND r.review_status='approved'
  );

  IF programme_without_relation > 0 THEN
    RAISE EXCEPTION 'NZ Phase 3 invariant failed: % programmes have no approved target-career relation', programme_without_relation;
  END IF;

  SELECT count(*) INTO delivery_assertions
  FROM public.program_catalog_nz_staging
  WHERE programme_delivery_verified IS TRUE OR programme_delivery_source_url IS NOT NULL;

  IF delivery_assertions <> 0 THEN
    RAISE EXCEPTION 'NZ Phase 3 invariant failed: programme delivery location was asserted before canonical location integration';
  END IF;
END $$;
