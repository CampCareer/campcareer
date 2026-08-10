-- NL Programs Phase 3 verification.
--
-- Publication readiness is separate from the current application window.
-- Tier policy:
--   A = canonical NL provider + current official programme evidence + IND Study
--       sponsor evidence + full-time evidence + programme-level international
--       admission/eligibility evidence.
--   B = canonical provider + sponsor + current official programme evidence, but
--       programme-level international evidence remains unresolved.
--   C = provider identity or another publication-critical dimension remains
--       unresolved. Phase 2 HBO provider candidates intentionally remain here.
--
-- This migration does not promote HBO provider candidates into catalog.institutions.

DO $$
DECLARE
  programme_count integer;
  international_count integer;
  duplicate_source_groups integer;
  duplicate_provider_title_groups integer;
  duplicate_recognition_groups integer;
  missing_programme_source_count integer;
  incomplete_approved_link_count integer;
BEGIN
  SELECT count(*) INTO programme_count FROM public.program_catalog_nl_staging;
  SELECT count(*) INTO international_count FROM public.program_international_nl_staging;

  IF programme_count <> 37 OR international_count <> 37 OR programme_count <> international_count THEN
    RAISE EXCEPTION 'NL Phase 3 blocked: expected 37 programme/international rows 1:1, found % / %', programme_count, international_count;
  END IF;

  SELECT count(*) INTO duplicate_source_groups
  FROM (
    SELECT source_name, source_program_key
    FROM public.program_catalog_nl_staging
    GROUP BY source_name, source_program_key
    HAVING count(*) > 1
  ) d;

  SELECT count(*) INTO duplicate_provider_title_groups
  FROM (
    SELECT lower(btrim(institution_name)), lower(btrim(title))
    FROM public.program_catalog_nl_staging
    GROUP BY 1, 2
    HAVING count(*) > 1
  ) d;

  SELECT count(*) INTO duplicate_recognition_groups
  FROM (
    SELECT recognised_program_code
    FROM public.program_catalog_nl_staging
    WHERE recognised_program_code IS NOT NULL
    GROUP BY recognised_program_code
    HAVING count(*) > 1
  ) d;

  IF duplicate_source_groups > 0 OR duplicate_provider_title_groups > 0 OR duplicate_recognition_groups > 0 THEN
    RAISE EXCEPTION 'NL Phase 3 blocked: duplicate groups source %, provider/title %, recognised code %',
      duplicate_source_groups, duplicate_provider_title_groups, duplicate_recognition_groups;
  END IF;

  SELECT count(*) INTO missing_programme_source_count
  FROM public.program_catalog_nl_staging
  WHERE nullif(btrim(official_program_url), '') IS NULL OR source_as_of IS NULL;

  IF missing_programme_source_count > 0 THEN
    RAISE EXCEPTION 'NL Phase 3 blocked: % programmes lack official URL/source date', missing_programme_source_count;
  END IF;

  SELECT count(*) INTO incomplete_approved_link_count
  FROM public.program_occupation_nl_staging
  WHERE review_status = 'approved'
    AND (source_checked_at IS NULL OR reviewed_at IS NULL);

  IF incomplete_approved_link_count > 0 THEN
    RAISE EXCEPTION 'NL Phase 3 blocked: % approved occupation links lack review/source dates', incomplete_approved_link_count;
  END IF;
END $$;

WITH exact_rows(source_program_key, recognised_program_code, official_program_url) AS (
  VALUES
    ('utwente-technical-computer-science','59335','https://www.utwente.nl/en/education/bachelor/programmes/technical-computer-science/'),
    ('utwente-business-information-technology','56066','https://www.utwente.nl/en/education/bachelor/programmes/business-information-technology/'),
    ('utwente-chemical-science-engineering','56960','https://www.utwente.nl/en/education/bachelor/programmes/chemical-science-engineering/'),
    ('utwente-civil-engineering','50352','https://www.utwente.nl/en/education/bachelor/programmes/civil-engineering/'),
    ('utwente-communication-science','56615','https://www.utwente.nl/en/education/bachelor/programmes/communication-science/'),
    ('utwente-creative-technology','50447','https://www.utwente.nl/en/education/bachelor/programmes/creative-technology/'),
    ('utwente-electrical-engineering','56953','https://www.utwente.nl/en/education/bachelor/programmes/electrical-engineering/'),
    ('utwente-industrial-design-engineering','50975','https://www.utwente.nl/en/education/bachelor/programmes/industrial-design-engineering/'),
    ('utwente-industrial-engineering-management','56994','https://www.utwente.nl/en/education/bachelor/programmes/industrial-engineering-management/'),
    ('utwente-international-business-administration','50952','https://www.utwente.nl/en/education/bachelor/programmes/international-business-administration/'),
    ('utwente-mechanical-engineering','50439','https://www.utwente.nl/en/education/bachelor/programmes/mechanical-engineering/')
)
UPDATE public.program_catalog_nl_staging p
SET recognised_program_code = e.recognised_program_code,
    official_program_url = e.official_program_url,
    recognition_source_url = e.official_program_url,
    source_as_of = DATE '2026-08-10'
FROM exact_rows e
WHERE p.source_program_key = e.source_program_key;

UPDATE public.program_international_nl_staging x
SET accredited_programme_evidence = TRUE,
    full_time_evidence = TRUE,
    international_students_eligible = TRUE,
    international_admission_status = 'programme_international_evidence_present',
    admission_source_url = 'https://www.utwente.nl/en/education/bachelor/apply/diplomas/',
    international_source_url = 'https://www.utwente.nl/en/education/bachelor/apply/diplomas/',
    source_as_of = DATE '2026-08-10',
    verification_status = 'programme_and_sponsor_evidence',
    verified_at = now()
FROM public.program_catalog_nl_staging p
WHERE x.program_catalog_id = p.id
  AND p.source_program_key LIKE 'utwente-%';

UPDATE public.program_international_nl_staging x
SET full_time_evidence = TRUE,
    international_students_eligible = TRUE,
    international_admission_status = 'programme_international_evidence_present',
    admission_source_url = 'https://www.wur.nl/en/education/bachelor/application-admission-bachelors/apply-bachelors-programme/international-prior-education',
    international_source_url = 'https://www.wur.nl/en/education/bachelor/application-admission-bachelors/apply-bachelors-programme/international-prior-education',
    source_as_of = DATE '2026-08-10',
    verification_status = 'programme_and_sponsor_evidence',
    verified_at = now()
FROM public.program_catalog_nl_staging p
WHERE x.program_catalog_id = p.id
  AND p.source_program_key LIKE 'wur-%';

UPDATE public.program_international_nl_staging x
SET full_time_evidence = TRUE,
    international_students_eligible = TRUE,
    international_admission_status = 'closed_2026_2027_application_window',
    admission_source_url = 'https://www.uva.nl/en/programmes/bachelors/business-analytics/application-and-admission/international-prior-education/international-prior-education.html',
    international_source_url = 'https://www.uva.nl/en/programmes/bachelors/business-analytics/application-and-admission/international-prior-education/international-prior-education.html',
    source_as_of = DATE '2026-08-10',
    verification_status = 'programme_and_sponsor_evidence',
    verified_at = now()
FROM public.program_catalog_nl_staging p
WHERE x.program_catalog_id = p.id
  AND p.source_program_key = 'uva-business-analytics';

UPDATE public.program_international_nl_staging x
SET full_time_evidence = TRUE,
    international_students_eligible = TRUE,
    international_admission_status = 'programme_international_evidence_present',
    international_source_url = COALESCE(x.international_source_url, x.admission_source_url),
    source_as_of = DATE '2026-08-10',
    verification_status = 'programme_and_sponsor_evidence_provider_identity_pending',
    verified_at = now()
FROM public.program_catalog_nl_staging p
WHERE x.program_catalog_id = p.id
  AND p.institution_id IS NULL
  AND p.education_sector = 'HBO';

ALTER TABLE public.program_international_nl_staging
  ADD COLUMN IF NOT EXISTS canonical_admission_state text;

ALTER TABLE public.program_international_nl_staging
  DROP CONSTRAINT IF EXISTS program_international_nl_staging_canonical_admission_state_check;

ALTER TABLE public.program_international_nl_staging
  ADD CONSTRAINT program_international_nl_staging_canonical_admission_state_check
  CHECK (canonical_admission_state IN (
    'open','closed','not_yet_open','restricted','eligible_schedule_unknown','unknown'
  ));

UPDATE public.program_international_nl_staging x
SET canonical_admission_state = CASE
  WHEN p.source_program_key = 'uva-business-analytics' THEN 'closed'
  ELSE 'eligible_schedule_unknown'
END
FROM public.program_catalog_nl_staging p
WHERE x.program_catalog_id = p.id;

ALTER TABLE public.program_international_nl_staging
  ALTER COLUMN canonical_admission_state SET NOT NULL;

CREATE INDEX IF NOT EXISTS program_international_nl_staging_canonical_state_idx
  ON public.program_international_nl_staging (canonical_admission_state, international_students_eligible);

COMMENT ON COLUMN public.program_international_nl_staging.canonical_admission_state IS
  'Phase 3 publication-facing admission state. Programme eligibility and current application-window state are separate facts.';

UPDATE public.program_catalog_nl_staging p
SET verification_tier = CASE
      WHEN p.institution_id IS NOT NULL
       AND nullif(btrim(p.official_program_url), '') IS NOT NULL
       AND p.source_as_of IS NOT NULL
       AND x.student_sponsor_eligible IS TRUE
       AND x.full_time_evidence IS TRUE
       AND x.international_students_eligible IS TRUE
       AND nullif(btrim(x.international_source_url), '') IS NOT NULL
       AND nullif(btrim(x.sponsor_source_url), '') IS NOT NULL
       AND x.source_as_of IS NOT NULL
      THEN 'A'
      WHEN p.institution_id IS NOT NULL
       AND nullif(btrim(p.official_program_url), '') IS NOT NULL
       AND p.source_as_of IS NOT NULL
       AND x.student_sponsor_eligible IS TRUE
       AND x.full_time_evidence IS TRUE
       AND nullif(btrim(x.sponsor_source_url), '') IS NOT NULL
       AND x.source_as_of IS NOT NULL
      THEN 'B'
      ELSE 'C'
    END,
    collection_status = CASE
      WHEN p.institution_id IS NOT NULL
       AND x.student_sponsor_eligible IS TRUE
       AND x.full_time_evidence IS TRUE
       AND x.international_students_eligible IS TRUE
       AND nullif(btrim(x.international_source_url), '') IS NOT NULL
      THEN 'phase3_tier_a_source_verified'
      WHEN p.institution_id IS NOT NULL
       AND x.student_sponsor_eligible IS TRUE
       AND x.full_time_evidence IS TRUE
      THEN 'phase3_tier_b_programme_international_evidence_pending'
      ELSE 'phase3_tier_c_provider_identity_or_eligibility_pending'
    END
FROM public.program_international_nl_staging x
WHERE x.program_catalog_id = p.id;

DO $$
DECLARE
  tier_a_count integer;
  tier_b_count integer;
  tier_c_count integer;
  tier_a_invalid_count integer;
  tier_c_with_canonical_provider integer;
  closed_count integer;
  schedule_unknown_count integer;
  exact_twente_count integer;
BEGIN
  SELECT
    count(*) FILTER (WHERE verification_tier = 'A'),
    count(*) FILTER (WHERE verification_tier = 'B'),
    count(*) FILTER (WHERE verification_tier = 'C')
  INTO tier_a_count, tier_b_count, tier_c_count
  FROM public.program_catalog_nl_staging;

  IF tier_a_count <> 26 OR tier_b_count <> 0 OR tier_c_count <> 11 THEN
    RAISE EXCEPTION 'Unexpected NL Phase 3 tier result: A %, B %, C %', tier_a_count, tier_b_count, tier_c_count;
  END IF;

  SELECT count(*) INTO tier_a_invalid_count
  FROM public.program_catalog_nl_staging p
  JOIN public.program_international_nl_staging x ON x.program_catalog_id = p.id
  WHERE p.verification_tier = 'A'
    AND (
      p.institution_id IS NULL
      OR nullif(btrim(p.official_program_url), '') IS NULL
      OR p.source_as_of IS NULL
      OR x.student_sponsor_eligible IS DISTINCT FROM TRUE
      OR x.full_time_evidence IS DISTINCT FROM TRUE
      OR x.international_students_eligible IS DISTINCT FROM TRUE
      OR nullif(btrim(x.international_source_url), '') IS NULL
      OR nullif(btrim(x.sponsor_source_url), '') IS NULL
      OR x.source_as_of IS NULL
    );

  IF tier_a_invalid_count > 0 THEN
    RAISE EXCEPTION 'NL Phase 3 invariant failed: % Tier A rows lack required evidence', tier_a_invalid_count;
  END IF;

  SELECT count(*) INTO tier_c_with_canonical_provider
  FROM public.program_catalog_nl_staging
  WHERE verification_tier = 'C' AND institution_id IS NOT NULL;

  IF tier_c_with_canonical_provider > 0 THEN
    RAISE EXCEPTION 'NL Phase 3 invariant failed: % Tier C rows unexpectedly have canonical provider identity', tier_c_with_canonical_provider;
  END IF;

  SELECT
    count(*) FILTER (WHERE canonical_admission_state = 'closed'),
    count(*) FILTER (WHERE canonical_admission_state = 'eligible_schedule_unknown')
  INTO closed_count, schedule_unknown_count
  FROM public.program_international_nl_staging;

  IF closed_count <> 1 OR schedule_unknown_count <> 36 THEN
    RAISE EXCEPTION 'Unexpected NL admission states: closed %, eligible_schedule_unknown %', closed_count, schedule_unknown_count;
  END IF;

  SELECT count(*) INTO exact_twente_count
  FROM public.program_catalog_nl_staging
  WHERE source_program_key LIKE 'utwente-%'
    AND recognised_program_code IS NOT NULL
    AND official_program_url NOT LIKE '%programmes/?%';

  IF exact_twente_count <> 11 THEN
    RAISE EXCEPTION 'NL Phase 3 invariant failed: expected 11 exact Twente programme identities, found %', exact_twente_count;
  END IF;
END $$;
