-- United States Programs Phase 3 verification.
-- Re-verifies the bounded 24-programme cohort and separates provider F-1/SEVIS context,
-- programme-specific international admission, OPT/STEM OPT, accreditation and programme location.

DO $$
DECLARE
  programme_count integer;
  provider_count integer;
  relation_count integer;
  career_count integer;
  exact_cip_count integer;
  delivery_count integer;
BEGIN
  SELECT count(*), count(DISTINCT institution_id)
    INTO programme_count, provider_count
  FROM public.program_catalog_us_staging
  WHERE verification_tier = 'A';

  SELECT count(*), count(DISTINCT canonical_career_id)
    INTO relation_count, career_count
  FROM public.program_occupation_us_staging
  WHERE review_status = 'approved';

  SELECT count(*) INTO exact_cip_count
  FROM public.program_catalog_us_staging
  WHERE cip_evidence_status = 'verified' AND cip_code IS NOT NULL;

  SELECT count(*) INTO delivery_count
  FROM public.program_catalog_us_staging
  WHERE programme_delivery_verified = true;

  IF programme_count <> 24 OR provider_count <> 8 THEN
    RAISE EXCEPTION 'US Phase 3 preflight expected 24 programmes / 8 providers; found % / %', programme_count, provider_count;
  END IF;
  IF relation_count <> 65 OR career_count <> 42 THEN
    RAISE EXCEPTION 'US Phase 3 preflight expected 65 relations / 42 careers; found % / %', relation_count, career_count;
  END IF;
  IF exact_cip_count <> 6 THEN
    RAISE EXCEPTION 'US Phase 3 preflight expected 6 exact verified CIP rows; found %', exact_cip_count;
  END IF;
  IF delivery_count <> 0 THEN
    RAISE EXCEPTION 'US Phase 3 must not inherit programme delivery assertions; found %', delivery_count;
  END IF;
END $$;

-- Re-check programme identity/currentness against the current official programme/catalogue pages.
UPDATE public.program_catalog_us_staging
SET source_as_of = DATE '2026-08-10',
    collection_status = 'phase3_verified_current_program',
    international_source_url = CASE unitid
      WHEN '170976' THEN 'https://internationalcenter.umich.edu/isss/new-transfer-students'
      WHEN '236948' THEN 'https://iss.washington.edu/5-things-to-know-for-new-international-students/'
      WHEN '190415' THEN 'https://international.globallearning.cornell.edu/getting-started/apply-student-status'
      WHEN '174066' THEN 'https://isss.umn.edu/new-students/request-your-i20-ds2019'
      WHEN '228778' THEN 'https://global.utexas.edu/isss/immigration/student-statuses'
      WHEN '214777' THEN 'https://global.psu.edu/landing/guide-f-1-j-1-visa-process'
      WHEN '240444' THEN 'https://iss.wisc.edu/students/immigration-overview/'
      WHEN '193900' THEN 'https://engineering.nyu.edu/life-tandon/student-life/international-students'
      ELSE international_source_url
    END
WHERE verification_tier = 'A';

-- Strengthen programme-specific accreditation evidence where a current official source was checked.
UPDATE public.program_catalog_us_staging
SET programmatic_accreditation_context = 'Engineering Accreditation Commission of ABET',
    accreditation_source_url = 'https://cee.engin.umich.edu/undergraduate-studies/major-in-civil-engineering/accreditation/'
WHERE source_program_key = 'umich-bse-civil-engineering';

UPDATE public.program_catalog_us_staging
SET programmatic_accreditation_context = 'Engineering Accreditation Commission of ABET',
    accreditation_source_url = 'https://www.ce.washington.edu/about/abet'
WHERE source_program_key = 'uw-bs-civil-engineering';

UPDATE public.program_catalog_us_staging
SET programmatic_accreditation_context = 'Council on Social Work Education (CSWE) accredited',
    accreditation_source_url = 'https://www.washington.edu/provost/accreditation/specialized-accreditations/'
WHERE source_program_key = 'uw-basw-social-welfare';

UPDATE public.program_catalog_us_staging
SET programmatic_accreditation_context = 'Engineering Accreditation Commission of ABET',
    accreditation_source_url = 'https://catalog.utexas.edu/undergraduate/engineering/degrees-and-programs/'
WHERE source_program_key = 'utaustin-bs-civil-engineering';

UPDATE public.program_catalog_us_staging
SET programmatic_accreditation_context = 'Engineering Accreditation Commission of ABET',
    accreditation_source_url = 'https://www.me.psu.edu/students/undergraduate/Accreditation.aspx'
WHERE source_program_key = 'psu-bs-mechanical-engineering';

-- Provider-level F-1 / I-20 / SEVIS context is confirmed for all eight providers.
-- This does NOT assert that every programme is open to every international applicant,
-- and it does NOT create a programme delivery campus/city assertion.
UPDATE public.program_international_us_staging i
SET sevp_status = 'confirmed',
    sevp_school_name = c.institution_name,
    sevp_campus_context = 'Provider-level F-1/I-20 sponsorship confirmed; not programme-delivery evidence.',
    sevp_source_url = CASE c.unitid
      WHEN '170976' THEN 'https://internationalcenter.umich.edu/isss/new-transfer-students'
      WHEN '236948' THEN 'https://iss.washington.edu/5-things-to-know-for-new-international-students/'
      WHEN '190415' THEN 'https://international.globallearning.cornell.edu/getting-started/apply-student-status'
      WHEN '174066' THEN 'https://isss.umn.edu/new-students/request-your-i20-ds2019'
      WHEN '228778' THEN 'https://global.utexas.edu/isss/immigration/student-statuses'
      WHEN '214777' THEN 'https://global.psu.edu/landing/guide-f-1-j-1-visa-process'
      WHEN '240444' THEN 'https://iss.wisc.edu/students/immigration-overview/'
      WHEN '193900' THEN 'https://engineering.nyu.edu/life-tandon/student-life/international-students'
      ELSE i.sevp_source_url
    END,
    student_visa_category_context = 'F-1 academic student context supported at provider level; J-1 may apply in qualifying exchange or sponsorship contexts.',
    student_visa_context = 'Acceptance by a SEVP-approved school, SEVIS registration/Form I-20 and the visa application are separate applicant-level requirements; visa issuance is not guaranteed.',
    visa_source_url = 'https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html',
    opt_context = 'F-1 practical training is temporary employment directly related to the student major and requires authorization; programme existence alone does not guarantee OPT.',
    stem_opt_context = 'A 24-month STEM OPT extension is applicant-, school-, employer- and degree/CIP-sensitive. The exact qualifying CIP must appear on the DHS STEM list and DSO/USCIS/employer requirements remain separate.',
    exact_cip_verified_for_stem = CASE WHEN c.cip_evidence_status = 'verified' AND c.cip_code IS NOT NULL THEN true ELSE false END,
    stem_list_version = CASE WHEN c.cip_evidence_status = 'verified' AND c.cip_code IS NOT NULL
      THEN 'DHS STEM Designated Degree Program List; checked 2026-08-10; latest published update located 2024-07-23'
      ELSE NULL END,
    stem_list_source_url = CASE WHEN c.cip_evidence_status = 'verified' AND c.cip_code IS NOT NULL
      THEN 'https://www.ice.gov/sevis/practical-training'
      ELSE NULL END,
    stem_list_checked_at = CASE WHEN c.cip_evidence_status = 'verified' AND c.cip_code IS NOT NULL
      THEN DATE '2026-08-10'
      ELSE NULL END,
    source_checked_at = DATE '2026-08-10',
    verification_status = 'verified',
    verified_at = now(),
    international_source_url = CASE c.unitid
      WHEN '170976' THEN 'https://internationalcenter.umich.edu/isss/new-transfer-students'
      WHEN '236948' THEN 'https://iss.washington.edu/5-things-to-know-for-new-international-students/'
      WHEN '190415' THEN 'https://international.globallearning.cornell.edu/getting-started/apply-student-status'
      WHEN '174066' THEN 'https://isss.umn.edu/new-students/request-your-i20-ds2019'
      WHEN '228778' THEN 'https://global.utexas.edu/isss/immigration/student-statuses'
      WHEN '214777' THEN 'https://global.psu.edu/landing/guide-f-1-j-1-visa-process'
      WHEN '240444' THEN 'https://iss.wisc.edu/students/immigration-overview/'
      WHEN '193900' THEN 'https://engineering.nyu.edu/life-tandon/student-life/international-students'
      ELSE i.international_source_url
    END,
    reviewer_note = 'Phase 3 verified current programme identity and provider-level F-1/I-20 context. Programme-specific international admission remains unasserted unless separately evidenced; programme location is not inferred.'
FROM public.program_catalog_us_staging c
WHERE c.id = i.program_catalog_id
  AND c.verification_tier = 'A';

-- Exact-CIP STEM checks. Positive only where the exact verified CIP could be directly corroborated
-- against current DHS-list-based institutional evidence. Hospitality CIP rows remain unresolved,
-- rather than being guessed negative.
UPDATE public.program_international_us_staging i
SET stem_designated_cip = CASE c.cip_code
      WHEN '01.1001' THEN true
      WHEN '04.0902' THEN true
      WHEN '11.0101' THEN true
      WHEN '11.0103' THEN true
      ELSE NULL
    END,
    reviewer_note = CASE c.cip_code
      WHEN '01.1001' THEN reviewer_note || ' Exact CIP 01.1001 Food Science corroborated as STEM-designated; applicant-specific STEM OPT is not guaranteed.'
      WHEN '04.0902' THEN reviewer_note || ' Exact CIP 04.0902 Architectural and Building Sciences/Technology corroborated as STEM-designated; applicant-specific STEM OPT is not guaranteed.'
      WHEN '11.0101' THEN reviewer_note || ' Exact CIP 11.0101 Computer and Information Sciences, General corroborated as STEM-designated; applicant-specific STEM OPT is not guaranteed.'
      WHEN '11.0103' THEN reviewer_note || ' Exact CIP 11.0103 Information Technology corroborated as STEM-designated; applicant-specific STEM OPT is not guaranteed.'
      WHEN '52.0901' THEN reviewer_note || ' Exact CIP 52.0901 was checked but no direct current DHS-list membership evidence was retained; STEM designation remains unresolved rather than guessed negative.'
      WHEN '52.0904' THEN reviewer_note || ' Exact CIP 52.0904 was checked but no direct current DHS-list membership evidence was retained; STEM designation remains unresolved rather than guessed negative.'
      ELSE reviewer_note
    END
FROM public.program_catalog_us_staging c
WHERE c.id = i.program_catalog_id
  AND c.cip_evidence_status = 'verified'
  AND c.cip_code IS NOT NULL;

DO $$
DECLARE
  programme_count integer;
  provider_count integer;
  current_count integer;
  sevp_confirmed_count integer;
  context_verified_count integer;
  programme_intl_positive_count integer;
  schedule_unknown_count integer;
  exact_cip_count integer;
  exact_cip_for_stem_count integer;
  stem_positive_count integer;
  exact_cip_stem_unresolved_count integer;
  delivery_count integer;
BEGIN
  SELECT count(*), count(DISTINCT institution_id),
         count(*) FILTER (WHERE collection_status = 'phase3_verified_current_program'),
         count(*) FILTER (WHERE cip_evidence_status = 'verified' AND cip_code IS NOT NULL),
         count(*) FILTER (WHERE programme_delivery_verified = true)
    INTO programme_count, provider_count, current_count, exact_cip_count, delivery_count
  FROM public.program_catalog_us_staging
  WHERE verification_tier = 'A';

  SELECT count(*) FILTER (WHERE i.sevp_status = 'confirmed'),
         count(*) FILTER (WHERE i.verification_status = 'verified'),
         count(*) FILTER (WHERE i.international_students_eligible = true),
         count(*) FILTER (WHERE i.international_admission_status = 'eligible_schedule_unknown'),
         count(*) FILTER (WHERE i.exact_cip_verified_for_stem = true),
         count(*) FILTER (WHERE i.stem_designated_cip = true),
         count(*) FILTER (WHERE i.exact_cip_verified_for_stem = true AND i.stem_designated_cip IS NULL)
    INTO sevp_confirmed_count, context_verified_count, programme_intl_positive_count,
         schedule_unknown_count, exact_cip_for_stem_count, stem_positive_count,
         exact_cip_stem_unresolved_count
  FROM public.program_international_us_staging i
  JOIN public.program_catalog_us_staging c ON c.id = i.program_catalog_id
  WHERE c.verification_tier = 'A';

  IF programme_count <> 24 OR provider_count <> 8 OR current_count <> 24 THEN
    RAISE EXCEPTION 'US Phase 3 expected 24 current programmes across 8 providers; found programmes %, providers %, current %', programme_count, provider_count, current_count;
  END IF;
  IF sevp_confirmed_count <> 24 OR context_verified_count <> 24 THEN
    RAISE EXCEPTION 'US Phase 3 expected provider F-1 context and verification on all 24 rows; found SEVP %, verified %', sevp_confirmed_count, context_verified_count;
  END IF;
  IF programme_intl_positive_count <> 0 OR schedule_unknown_count <> 24 THEN
    RAISE EXCEPTION 'US Phase 3 must not infer programme-specific international admission; positive %, schedule-unknown %', programme_intl_positive_count, schedule_unknown_count;
  END IF;
  IF exact_cip_count <> 6 OR exact_cip_for_stem_count <> 6 THEN
    RAISE EXCEPTION 'US Phase 3 expected 6 exact CIP rows reviewed for STEM; catalog %, international %', exact_cip_count, exact_cip_for_stem_count;
  END IF;
  IF stem_positive_count <> 4 OR exact_cip_stem_unresolved_count <> 2 THEN
    RAISE EXCEPTION 'US Phase 3 expected 4 positive STEM CIP and 2 exact-CIP unresolved rows; positive %, unresolved %', stem_positive_count, exact_cip_stem_unresolved_count;
  END IF;
  IF delivery_count <> 0 THEN
    RAISE EXCEPTION 'US Phase 3 introduced unsupported programme delivery assertions: %', delivery_count;
  END IF;
END $$;