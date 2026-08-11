-- United States Programs Phase 4 canonicalization.
-- Canonicalize only the verified 24-programme Phase 3 cohort.
-- Stable identity is (source_name, source_program_key); no staging row id is durable identity.
-- Programme-level international eligibility and delivery location remain unresolved unless explicitly evidenced.

DO $$
DECLARE
  programme_count integer;
  provider_count integer;
  international_verified_count integer;
  sevp_confirmed_count integer;
  relation_count integer;
  career_count integer;
  outside_target_count integer;
  delivery_assertion_count integer;
  existing_us_programmes integer;
BEGIN
  SELECT count(*), count(DISTINCT institution_id)
    INTO programme_count, provider_count
  FROM public.program_catalog_us_staging
  WHERE verification_tier = 'A'
    AND collection_status = 'phase3_verified_current_program';

  SELECT count(*), count(*) FILTER (WHERE sevp_status = 'confirmed')
    INTO international_verified_count, sevp_confirmed_count
  FROM public.program_international_us_staging x
  JOIN public.program_catalog_us_staging p ON p.id = x.program_catalog_id
  WHERE p.verification_tier = 'A'
    AND p.collection_status = 'phase3_verified_current_program'
    AND x.verification_status = 'verified';

  SELECT count(*), count(DISTINCT canonical_career_id)
    INTO relation_count, career_count
  FROM public.program_occupation_us_staging o
  JOIN public.program_catalog_us_staging p ON p.id = o.program_catalog_id
  WHERE p.verification_tier = 'A'
    AND p.collection_status = 'phase3_verified_current_program'
    AND o.review_status = 'approved';

  SELECT count(*) INTO outside_target_count
  FROM public.program_occupation_us_staging o
  JOIN public.program_catalog_us_staging p ON p.id = o.program_catalog_id
  WHERE p.verification_tier = 'A'
    AND p.collection_status = 'phase3_verified_current_program'
    AND o.review_status = 'approved'
    AND NOT EXISTS (
      SELECT 1
      FROM public.program_occupation_match_rules r
      WHERE r.country_code = 'CA'
        AND r.rule_version = 'v1'
        AND r.review_status = 'approved'
        AND r.canonical_career_id = o.canonical_career_id
    );

  SELECT count(*) INTO delivery_assertion_count
  FROM public.program_catalog_us_staging
  WHERE verification_tier = 'A'
    AND collection_status = 'phase3_verified_current_program'
    AND (programme_delivery_verified IS TRUE OR programme_delivery_source_url IS NOT NULL);

  SELECT count(*) INTO existing_us_programmes
  FROM catalog.programmes pr
  JOIN catalog.institutions i ON i.id = pr.institution_id
  WHERE i.country_code = 'US';

  IF programme_count <> 24 OR provider_count <> 8 THEN
    RAISE EXCEPTION 'US Phase 4 expected 24 verified programmes across 8 providers; got % programmes / % providers', programme_count, provider_count;
  END IF;
  IF international_verified_count <> 24 OR sevp_confirmed_count <> 24 THEN
    RAISE EXCEPTION 'US Phase 4 expected 24 verified international-context rows and 24 confirmed provider SEVP contexts; got % / %', international_verified_count, sevp_confirmed_count;
  END IF;
  IF relation_count <> 65 OR career_count <> 42 OR outside_target_count <> 0 THEN
    RAISE EXCEPTION 'US Phase 4 expected 65 approved relations / 42 careers / 0 outside target 80; got % / % / %', relation_count, career_count, outside_target_count;
  END IF;
  IF delivery_assertion_count <> 0 THEN
    RAISE EXCEPTION 'US Phase 4 refuses programme delivery inference; found % asserted delivery rows', delivery_assertion_count;
  END IF;
  IF existing_us_programmes <> 0 THEN
    RAISE EXCEPTION 'US Phase 4 expected no pre-existing canonical US programmes before first canonicalization; found %', existing_us_programmes;
  END IF;
END $$;

INSERT INTO catalog.programmes (
  id,
  institution_id,
  canonical_title,
  qualification_level_id,
  programme_type,
  field_code,
  field_name,
  default_duration_months,
  status,
  updated_at
)
SELECT
  md5('US|PROGRAM|' || p.source_name || chr(31) || p.source_program_key)::uuid,
  p.institution_id,
  p.title,
  NULL::uuid,
  p.award_level,
  CASE WHEN p.cip_evidence_status = 'verified' THEN p.cip_code ELSE NULL END,
  p.field_category,
  p.default_duration_months,
  'active',
  now()
FROM public.program_catalog_us_staging p
JOIN public.program_international_us_staging x ON x.program_catalog_id = p.id
WHERE p.verification_tier = 'A'
  AND p.collection_status = 'phase3_verified_current_program'
  AND x.verification_status = 'verified'
ON CONFLICT (id) DO UPDATE SET
  institution_id = EXCLUDED.institution_id,
  canonical_title = EXCLUDED.canonical_title,
  qualification_level_id = EXCLUDED.qualification_level_id,
  programme_type = EXCLUDED.programme_type,
  field_code = EXCLUDED.field_code,
  field_name = EXCLUDED.field_name,
  default_duration_months = EXCLUDED.default_duration_months,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO catalog.programme_identifiers (
  programme_id,
  identifier_system,
  identifier_value,
  source_url,
  valid_from
)
SELECT
  md5('US|PROGRAM|' || p.source_name || chr(31) || p.source_program_key)::uuid,
  'US_PROGRAM_SOURCE_HASH',
  md5(p.source_name || chr(31) || p.source_program_key),
  p.official_program_url,
  p.source_as_of
FROM public.program_catalog_us_staging p
JOIN public.program_international_us_staging x ON x.program_catalog_id = p.id
WHERE p.verification_tier = 'A'
  AND p.collection_status = 'phase3_verified_current_program'
  AND x.verification_status = 'verified'
ON CONFLICT (identifier_system, identifier_value) DO UPDATE SET
  programme_id = EXCLUDED.programme_id,
  source_url = EXCLUDED.source_url,
  valid_from = EXCLUDED.valid_from;

INSERT INTO catalog.programme_offerings (
  id,
  programme_id,
  campus_id,
  market,
  delivery_mode,
  intake_label,
  intake_start_date,
  application_deadline,
  duration_months,
  enrolment_status,
  source_url,
  valid_from,
  source_system,
  source_record_key,
  verification_status,
  source_checked_at,
  updated_at
)
SELECT
  md5('US|OFFERING|' || p.source_name || chr(31) || p.source_program_key)::uuid,
  md5('US|PROGRAM|' || p.source_name || chr(31) || p.source_program_key)::uuid,
  NULL::uuid,
  'unknown',
  p.study_mode,
  x.intake_label,
  x.intake_start_date,
  x.application_deadline,
  p.default_duration_months,
  CASE x.international_admission_status
    WHEN 'open' THEN 'open'
    WHEN 'closed' THEN 'closed'
    WHEN 'not_yet_open' THEN 'planned'
    ELSE 'unknown'
  END,
  p.official_program_url,
  p.source_as_of,
  'US_PROGRAM_PHASE3_CANONICAL',
  md5(p.source_name || chr(31) || p.source_program_key),
  'verified',
  x.source_checked_at::timestamptz,
  now()
FROM public.program_catalog_us_staging p
JOIN public.program_international_us_staging x ON x.program_catalog_id = p.id
WHERE p.verification_tier = 'A'
  AND p.collection_status = 'phase3_verified_current_program'
  AND x.verification_status = 'verified'
ON CONFLICT (id) DO UPDATE SET
  programme_id = EXCLUDED.programme_id,
  campus_id = NULL,
  market = EXCLUDED.market,
  delivery_mode = EXCLUDED.delivery_mode,
  intake_label = EXCLUDED.intake_label,
  intake_start_date = EXCLUDED.intake_start_date,
  application_deadline = EXCLUDED.application_deadline,
  duration_months = EXCLUDED.duration_months,
  enrolment_status = EXCLUDED.enrolment_status,
  source_url = EXCLUDED.source_url,
  valid_from = EXCLUDED.valid_from,
  source_system = EXCLUDED.source_system,
  source_record_key = EXCLUDED.source_record_key,
  verification_status = EXCLUDED.verification_status,
  source_checked_at = EXCLUDED.source_checked_at,
  updated_at = now();

CREATE OR REPLACE VIEW public.program_catalog_canonical_us_v1
WITH (security_invoker = true) AS
SELECT
  pr.id AS programme_id,
  p.source_name,
  p.source_program_key,
  source_id.identifier_value AS source_hash,
  p.unitid,
  pr.institution_id,
  i.slug AS institution_slug,
  i.canonical_name AS institution_name,
  pr.canonical_title,
  p.source_program_name,
  p.credential_name,
  p.award_level,
  p.cip_code,
  p.cip_evidence_status,
  p.cip_source_url,
  p.credit_units,
  p.credit_unit_type,
  pr.programme_type,
  pr.field_code,
  pr.field_name,
  pr.default_duration_months,
  p.study_mode,
  p.institutional_accreditation_context,
  p.programmatic_accreditation_context,
  p.accreditation_source_url,
  p.verification_tier,
  p.collection_status,
  p.official_program_url,
  p.official_catalog_url,
  p.source_as_of,
  p.programme_delivery_verified,
  p.programme_delivery_source_url,
  x.international_students_eligible,
  x.international_admission_status AS canonical_admission_state,
  x.international_admission_status,
  x.sevp_status,
  x.sevp_school_name,
  x.sevp_campus_context,
  x.sevp_source_url,
  x.student_visa_category_context,
  x.student_visa_context,
  x.visa_source_url,
  x.exact_cip_verified_for_stem,
  x.stem_designated_cip,
  x.stem_list_version,
  x.stem_list_source_url,
  x.stem_list_checked_at,
  x.opt_context,
  x.stem_opt_context,
  x.intake_label,
  x.intake_start_date,
  x.application_deadline,
  x.admission_source_url,
  x.international_source_url,
  x.verification_status AS international_verification_status,
  x.source_checked_at AS international_source_checked_at,
  x.verified_at,
  po.id AS offering_id,
  po.market AS offering_market,
  po.enrolment_status,
  po.verification_status AS offering_verification_status,
  po.campus_id
FROM public.program_catalog_us_staging p
JOIN public.program_international_us_staging x ON x.program_catalog_id = p.id
JOIN catalog.programmes pr
  ON pr.id = md5('US|PROGRAM|' || p.source_name || chr(31) || p.source_program_key)::uuid
JOIN catalog.institutions i ON i.id = pr.institution_id
JOIN catalog.programme_identifiers source_id
  ON source_id.programme_id = pr.id
 AND source_id.identifier_system = 'US_PROGRAM_SOURCE_HASH'
JOIN catalog.programme_offerings po
  ON po.programme_id = pr.id
 AND po.source_system = 'US_PROGRAM_PHASE3_CANONICAL'
WHERE p.verification_tier = 'A'
  AND p.collection_status = 'phase3_verified_current_program'
  AND x.verification_status = 'verified'
  AND pr.status = 'active';

REVOKE ALL ON public.program_catalog_canonical_us_v1 FROM public, anon, authenticated;
GRANT SELECT ON public.program_catalog_canonical_us_v1 TO service_role;

DO $$
DECLARE
  canonical_count integer;
  provider_count integer;
  identifier_count integer;
  offering_count integer;
  campus_link_count integer;
  verified_offering_count integer;
  unknown_market_count integer;
  qualification_level_link_count integer;
BEGIN
  SELECT count(*), count(DISTINCT institution_id)
    INTO canonical_count, provider_count
  FROM public.program_catalog_canonical_us_v1;

  SELECT count(*) INTO identifier_count
  FROM catalog.programme_identifiers
  WHERE identifier_system = 'US_PROGRAM_SOURCE_HASH';

  SELECT count(*),
         count(*) FILTER (WHERE campus_id IS NOT NULL),
         count(*) FILTER (WHERE verification_status = 'verified'),
         count(*) FILTER (WHERE market = 'unknown')
    INTO offering_count, campus_link_count, verified_offering_count, unknown_market_count
  FROM catalog.programme_offerings
  WHERE source_system = 'US_PROGRAM_PHASE3_CANONICAL';

  SELECT count(*) INTO qualification_level_link_count
  FROM catalog.programmes pr
  JOIN catalog.programme_identifiers pi ON pi.programme_id = pr.id
  WHERE pi.identifier_system = 'US_PROGRAM_SOURCE_HASH'
    AND pr.qualification_level_id IS NOT NULL;

  IF canonical_count <> 24 OR provider_count <> 8 THEN
    RAISE EXCEPTION 'US Phase 4 canonical invariant failed: % programmes / % providers', canonical_count, provider_count;
  END IF;
  IF identifier_count <> 24 OR offering_count <> 24 OR verified_offering_count <> 24 THEN
    RAISE EXCEPTION 'US Phase 4 identity/offering invariant failed: % identifiers / % offerings / % verified', identifier_count, offering_count, verified_offering_count;
  END IF;
  IF campus_link_count <> 0 THEN
    RAISE EXCEPTION 'US Phase 4 must not infer programme campus; found % links', campus_link_count;
  END IF;
  IF unknown_market_count <> 24 THEN
    RAISE EXCEPTION 'US Phase 4 programme-level international market remains unresolved; expected 24 unknown offerings, got %', unknown_market_count;
  END IF;
  IF qualification_level_link_count <> 0 THEN
    RAISE EXCEPTION 'US Phase 4 must not fabricate qualification framework links; found %', qualification_level_link_count;
  END IF;
END $$;
