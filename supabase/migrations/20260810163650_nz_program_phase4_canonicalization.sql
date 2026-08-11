-- New Zealand Programs Phase 4.1 canonicalization.
-- Canonicalizes only the verified 24-program Tier A occupation-led cohort.
-- Stable identity is (source_name, source_program_key); staging identity values are not durable catalogue IDs.
-- No programme campus/city linkage is inferred in this phase.

DO $$
DECLARE
  tier_a_count integer;
  institution_count integer;
  missing_identity_count integer;
  duplicate_source_count integer;
  invalid_international_count integer;
  approved_relation_count integer;
  relation_career_count integer;
BEGIN
  SELECT count(*), count(DISTINCT institution_id), count(*) FILTER (WHERE institution_id IS NULL)
  INTO tier_a_count, institution_count, missing_identity_count
  FROM public.program_catalog_nz_staging
  WHERE verification_tier='A';

  IF tier_a_count<>24 OR institution_count<>8 OR missing_identity_count<>0 THEN
    RAISE EXCEPTION 'NZ Phase 4.1 expected 24 Tier A programmes across 8 canonical institutions with no missing identities; found % / % / %',
      tier_a_count,institution_count,missing_identity_count;
  END IF;

  SELECT count(*) INTO duplicate_source_count
  FROM (
    SELECT source_name,source_program_key
    FROM public.program_catalog_nz_staging
    WHERE verification_tier='A'
    GROUP BY source_name,source_program_key
    HAVING count(*)>1
  ) d;

  IF duplicate_source_count>0 THEN
    RAISE EXCEPTION 'NZ Phase 4.1 blocked: % duplicate Tier A source identities',duplicate_source_count;
  END IF;

  SELECT count(*) INTO invalid_international_count
  FROM public.program_catalog_nz_staging p
  JOIN public.program_international_nz_staging x ON x.program_catalog_id=p.id
  WHERE p.verification_tier='A'
    AND (
      x.international_students_eligible IS DISTINCT FROM TRUE
      OR x.code_signatory_status<>'confirmed'
      OR x.verification_status<>'verified'
      OR nullif(btrim(x.international_source_url),'') IS NULL
      OR nullif(btrim(x.code_signatory_source_url),'') IS NULL
    );

  IF invalid_international_count>0 THEN
    RAISE EXCEPTION 'NZ Phase 4.1 blocked: % Tier A programmes lack Phase 3 international/Code evidence',invalid_international_count;
  END IF;

  SELECT count(*),count(DISTINCT canonical_career_id)
  INTO approved_relation_count,relation_career_count
  FROM public.program_occupation_nz_staging
  WHERE review_status='approved';

  IF approved_relation_count<>39 OR relation_career_count<>35 THEN
    RAISE EXCEPTION 'NZ Phase 4.1 expected 39 approved relations across 35 careers; found % / %',approved_relation_count,relation_career_count;
  END IF;
END $$;

INSERT INTO catalog.programmes(
  id,institution_id,canonical_title,qualification_level_id,programme_type,
  field_code,field_name,default_duration_months,status,created_at,updated_at
)
SELECT
  md5('NZ|PROGRAM|'||p.source_name||chr(31)||p.source_program_key)::uuid,
  p.institution_id,
  p.title,
  NULL,
  p.degree_level,
  NULL,
  nullif(btrim(p.field_category),''),
  p.default_duration_months,
  'active',
  now(),now()
FROM public.program_catalog_nz_staging p
WHERE p.verification_tier='A'
ON CONFLICT (id) DO UPDATE SET
  institution_id=excluded.institution_id,
  canonical_title=excluded.canonical_title,
  qualification_level_id=NULL,
  programme_type=excluded.programme_type,
  field_code=NULL,
  field_name=excluded.field_name,
  default_duration_months=excluded.default_duration_months,
  status='active',
  updated_at=now();

INSERT INTO catalog.programme_identifiers(
  programme_id,identifier_system,identifier_value,source_url,valid_from,valid_to
)
SELECT
  md5('NZ|PROGRAM|'||p.source_name||chr(31)||p.source_program_key)::uuid,
  'NZ_PROGRAM_SOURCE_HASH',
  md5(p.source_name||chr(31)||p.source_program_key),
  p.official_program_url,
  p.source_as_of,
  NULL
FROM public.program_catalog_nz_staging p
WHERE p.verification_tier='A'
ON CONFLICT (identifier_system,identifier_value) DO UPDATE SET
  programme_id=excluded.programme_id,
  source_url=excluded.source_url,
  valid_from=excluded.valid_from,
  valid_to=NULL;

INSERT INTO catalog.programme_offerings(
  id,programme_id,campus_id,market,delivery_mode,intake_label,intake_start_date,
  application_deadline,duration_months,enrolment_status,source_url,valid_from,
  valid_to,source_system,source_record_key,verification_status,source_checked_at,
  created_at,updated_at
)
SELECT
  md5('NZ|OFFERING|'||p.source_name||chr(31)||p.source_program_key)::uuid,
  md5('NZ|PROGRAM|'||p.source_name||chr(31)||p.source_program_key)::uuid,
  NULL,
  'international',
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
  coalesce(x.admission_source_url,x.international_source_url,p.official_program_url),
  p.source_as_of,
  NULL,
  'NZ_PROGRAM_PHASE3_CANONICAL',
  md5(p.source_name||chr(31)||p.source_program_key),
  'verified',
  coalesce(x.verified_at,p.collected_at),
  now(),now()
FROM public.program_catalog_nz_staging p
JOIN public.program_international_nz_staging x ON x.program_catalog_id=p.id
WHERE p.verification_tier='A'
ON CONFLICT (id) DO UPDATE SET
  programme_id=excluded.programme_id,
  campus_id=NULL,
  market=excluded.market,
  delivery_mode=excluded.delivery_mode,
  intake_label=excluded.intake_label,
  intake_start_date=excluded.intake_start_date,
  application_deadline=excluded.application_deadline,
  duration_months=excluded.duration_months,
  enrolment_status=excluded.enrolment_status,
  source_url=excluded.source_url,
  valid_from=excluded.valid_from,
  valid_to=NULL,
  source_system=excluded.source_system,
  source_record_key=excluded.source_record_key,
  verification_status='verified',
  source_checked_at=excluded.source_checked_at,
  updated_at=now();

CREATE OR REPLACE VIEW public.program_catalog_canonical_nz_v1
WITH (security_invoker=true) AS
SELECT
  pr.id AS programme_id,
  p.source_name,
  p.source_program_key,
  source_id.identifier_value AS source_hash,
  p.provider_number,
  pr.institution_id,
  i.slug AS institution_slug,
  i.canonical_name AS institution_name,
  pr.canonical_title,
  p.source_program_name,
  p.qualification_name,
  p.degree_level,
  p.nzqcf_level,
  p.nzqcf_credits,
  pr.programme_type,
  pr.field_name,
  pr.default_duration_months,
  p.study_mode,
  p.language_context,
  p.programme_authority,
  p.programme_authority_url,
  p.verification_tier,
  p.collection_status,
  p.official_program_url,
  p.international_source_url AS programme_international_source_url,
  x.international_students_eligible,
  x.international_admission_status AS canonical_admission_state,
  x.international_admission_status,
  x.code_signatory_status,
  x.code_signatory_source_url,
  x.student_visa_context,
  x.post_study_work_context,
  x.post_study_work_rule_effective_date,
  x.intake_label,
  x.intake_start_date,
  x.application_deadline,
  x.admission_source_url,
  x.international_source_url,
  x.visa_source_url,
  x.verification_status AS international_verification_status,
  x.source_checked_at AS international_source_checked_at,
  x.verified_at
FROM public.program_catalog_nz_staging p
JOIN public.program_international_nz_staging x ON x.program_catalog_id=p.id
JOIN catalog.programmes pr
  ON pr.id=md5('NZ|PROGRAM|'||p.source_name||chr(31)||p.source_program_key)::uuid
JOIN catalog.institutions i ON i.id=pr.institution_id
JOIN catalog.programme_identifiers source_id
  ON source_id.programme_id=pr.id
 AND source_id.identifier_system='NZ_PROGRAM_SOURCE_HASH'
WHERE p.verification_tier='A'
  AND pr.status='active';

COMMENT ON VIEW public.program_catalog_canonical_nz_v1 IS
  'Service-role NZ Phase 4 canonical programme cohort. Contains only the verified 24-program Tier A occupation-led cohort; qualification_level_id remains null until NZQCF framework rows are modeled in core.';

REVOKE ALL ON public.program_catalog_canonical_nz_v1 FROM public,anon,authenticated;
GRANT SELECT ON public.program_catalog_canonical_nz_v1 TO service_role;

DO $$
DECLARE
  canonical_count integer;
  institution_count integer;
  source_identifier_count integer;
  offering_count integer;
  offering_with_campus_count integer;
  verified_offering_count integer;
  open_offering_count integer;
  total_nz_programme_count integer;
  active_nz_programme_count integer;
BEGIN
  SELECT count(*),count(DISTINCT institution_id)
  INTO canonical_count,institution_count
  FROM public.program_catalog_canonical_nz_v1;

  IF canonical_count<>24 OR institution_count<>8 THEN
    RAISE EXCEPTION 'Unexpected NZ Phase 4 canonical cohort: % rows across % institutions',canonical_count,institution_count;
  END IF;

  SELECT count(*) INTO source_identifier_count
  FROM catalog.programme_identifiers pi
  JOIN catalog.programmes p ON p.id=pi.programme_id
  JOIN catalog.institutions i ON i.id=p.institution_id
  WHERE i.country_code='NZ' AND pi.identifier_system='NZ_PROGRAM_SOURCE_HASH';

  IF source_identifier_count<>24 THEN
    RAISE EXCEPTION 'Expected 24 NZ canonical source identifiers; found %',source_identifier_count;
  END IF;

  SELECT
    count(*),
    count(*) FILTER (WHERE campus_id IS NOT NULL),
    count(*) FILTER (WHERE verification_status='verified'),
    count(*) FILTER (WHERE enrolment_status='open')
  INTO offering_count,offering_with_campus_count,verified_offering_count,open_offering_count
  FROM catalog.programme_offerings
  WHERE source_system='NZ_PROGRAM_PHASE3_CANONICAL';

  IF offering_count<>24 OR offering_with_campus_count<>0 OR verified_offering_count<>24 OR open_offering_count<>6 THEN
    RAISE EXCEPTION 'Unexpected NZ offering state: total %, campus %, verified %, open %',
      offering_count,offering_with_campus_count,verified_offering_count,open_offering_count;
  END IF;

  SELECT count(*),count(*) FILTER (WHERE p.status='active')
  INTO total_nz_programme_count,active_nz_programme_count
  FROM catalog.programmes p
  JOIN catalog.institutions i ON i.id=p.institution_id
  WHERE i.country_code='NZ';

  IF total_nz_programme_count<>24 OR active_nz_programme_count<>24 THEN
    RAISE EXCEPTION 'Expected 24 total / 24 active NZ programmes after Phase 4.1; found % / %',
      total_nz_programme_count,active_nz_programme_count;
  END IF;
END $$;
