-- UK Programs Phase 3 verification tiers.
--
-- Publication readiness is intentionally separated from current admission state.
-- A currently closed programme can still be Tier A when the programme identity,
-- canonical provider identity, Student-sponsor evidence and programme-level
-- international eligibility are source-verified.
--
-- CAS is deliberately NOT a Tier A requirement. GOV.UK defines a CAS as a
-- student-specific reference assigned after an education provider has offered a
-- place. A static programme catalogue must therefore not infer CAS issuance.
--
-- Tier rules for this checkpoint:
--   A = canonical provider + official current programme source + current
--       programme-level international eligibility + Student-sponsor evidence.
--   B = canonical provider and official programme evidence, but one publication
--       eligibility dimension remains unresolved.
--   C = provider identity or international eligibility is not publication-ready.

DO $$
DECLARE
  programme_count integer;
  international_count integer;
  duplicate_identity_groups integer;
  missing_programme_source_count integer;
  incomplete_approved_link_count integer;
BEGIN
  SELECT count(*) INTO programme_count
  FROM public.program_catalog_uk_staging;

  SELECT count(*) INTO international_count
  FROM public.program_international_uk_staging;

  IF programme_count <> international_count THEN
    RAISE EXCEPTION 'UK Phase 3 blocked: programme/international rows are not 1:1 (% vs %)', programme_count, international_count;
  END IF;

  SELECT count(*) INTO duplicate_identity_groups
  FROM (
    SELECT source_name, source_program_key
    FROM public.program_catalog_uk_staging
    GROUP BY source_name, source_program_key
    HAVING count(*) > 1
  ) d;

  IF duplicate_identity_groups > 0 THEN
    RAISE EXCEPTION 'UK Phase 3 blocked: % duplicate source identity groups', duplicate_identity_groups;
  END IF;

  SELECT count(*) INTO missing_programme_source_count
  FROM public.program_catalog_uk_staging
  WHERE nullif(btrim(official_program_url), '') IS NULL
     OR source_as_of IS NULL;

  IF missing_programme_source_count > 0 THEN
    RAISE EXCEPTION 'UK Phase 3 blocked: % staged programmes lack official source URL/date', missing_programme_source_count;
  END IF;

  SELECT count(*) INTO incomplete_approved_link_count
  FROM public.program_occupation_uk_staging
  WHERE review_status = 'approved'
    AND (source_checked_at IS NULL OR reviewed_at IS NULL);

  IF incomplete_approved_link_count > 0 THEN
    RAISE EXCEPTION 'UK Phase 3 blocked: % approved occupation links lack review/source dates', incomplete_approved_link_count;
  END IF;
END $$;

UPDATE public.program_catalog_uk_staging p
SET verification_tier = CASE
      WHEN p.institution_id IS NOT NULL
       AND nullif(btrim(p.official_program_url), '') IS NOT NULL
       AND p.source_as_of IS NOT NULL
       AND x.student_sponsor_eligible IS TRUE
       AND x.international_students_eligible IS TRUE
       AND nullif(btrim(x.international_source_url), '') IS NOT NULL
       AND x.source_as_of IS NOT NULL
       AND x.verification_status NOT ILIKE '%unresolved%'
       AND x.verification_status <> 'not_yet_verified'
      THEN 'A'
      WHEN p.institution_id IS NOT NULL
       AND nullif(btrim(p.official_program_url), '') IS NOT NULL
       AND p.source_as_of IS NOT NULL
       AND x.student_sponsor_eligible IS TRUE
       AND nullif(btrim(x.international_source_url), '') IS NOT NULL
       AND x.source_as_of IS NOT NULL
      THEN 'B'
      ELSE 'C'
    END,
    collection_status = CASE
      WHEN p.institution_id IS NOT NULL
       AND nullif(btrim(p.official_program_url), '') IS NOT NULL
       AND p.source_as_of IS NOT NULL
       AND x.student_sponsor_eligible IS TRUE
       AND x.international_students_eligible IS TRUE
       AND nullif(btrim(x.international_source_url), '') IS NOT NULL
       AND x.source_as_of IS NOT NULL
       AND x.verification_status NOT ILIKE '%unresolved%'
       AND x.verification_status <> 'not_yet_verified'
      THEN 'phase3_tier_a_source_verified'
      WHEN p.institution_id IS NOT NULL
       AND nullif(btrim(p.official_program_url), '') IS NOT NULL
       AND p.source_as_of IS NOT NULL
       AND x.student_sponsor_eligible IS TRUE
       AND nullif(btrim(x.international_source_url), '') IS NOT NULL
       AND x.source_as_of IS NOT NULL
      THEN 'phase3_tier_b_programme_level_international_eligibility_pending'
      ELSE 'phase3_tier_c_provider_identity_or_international_evidence_pending'
    END
FROM public.program_international_uk_staging x
WHERE x.program_catalog_id = p.id;

DO $$
DECLARE
  tier_a_count integer;
  tier_b_count integer;
  tier_c_count integer;
  tier_a_invalid_count integer;
  tier_a_cas_inferred_count integer;
BEGIN
  SELECT
    count(*) FILTER (WHERE verification_tier = 'A'),
    count(*) FILTER (WHERE verification_tier = 'B'),
    count(*) FILTER (WHERE verification_tier = 'C')
  INTO tier_a_count, tier_b_count, tier_c_count
  FROM public.program_catalog_uk_staging;

  IF tier_a_count <> 75 OR tier_b_count <> 1 OR tier_c_count <> 16 THEN
    RAISE EXCEPTION 'Unexpected UK Phase 3 tier result: A %, B %, C %', tier_a_count, tier_b_count, tier_c_count;
  END IF;

  SELECT count(*) INTO tier_a_invalid_count
  FROM public.program_catalog_uk_staging p
  JOIN public.program_international_uk_staging x
    ON x.program_catalog_id = p.id
  WHERE p.verification_tier = 'A'
    AND (
      p.institution_id IS NULL
      OR nullif(btrim(p.official_program_url), '') IS NULL
      OR p.source_as_of IS NULL
      OR x.student_sponsor_eligible IS DISTINCT FROM TRUE
      OR x.international_students_eligible IS DISTINCT FROM TRUE
      OR nullif(btrim(x.international_source_url), '') IS NULL
      OR x.source_as_of IS NULL
    );

  IF tier_a_invalid_count > 0 THEN
    RAISE EXCEPTION 'UK Phase 3 invariant failed: % Tier A rows lack required evidence', tier_a_invalid_count;
  END IF;

  SELECT count(*) INTO tier_a_cas_inferred_count
  FROM public.program_catalog_uk_staging p
  JOIN public.program_international_uk_staging x
    ON x.program_catalog_id = p.id
  WHERE p.verification_tier = 'A'
    AND x.cas_eligibility IS NOT NULL;

  IF tier_a_cas_inferred_count > 0 THEN
    RAISE EXCEPTION 'UK Phase 3 invariant failed: CAS was inferred for % Tier A rows', tier_a_cas_inferred_count;
  END IF;
END $$;
