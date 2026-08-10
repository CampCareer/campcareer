-- NL Programs Phase 4.1 canonicalization.
--
-- Canonicalizes only the Phase 3 Tier A cohort. Tier C HBO provider candidates
-- remain staging-only until their canonical institution identities are resolved.
--
-- Stable identity:
--   (source_name, source_program_key)
-- Canonical programme/offering UUIDs are deterministic hashes of that identity.
-- No database-generated staging IDs are used as durable catalogue identifiers.

DO $$
DECLARE
  publishable_count integer;
  institution_count integer;
  missing_identity_count integer;
  duplicate_source_count integer;
  recognised_code_count integer;
BEGIN
  SELECT
    count(*),
    count(DISTINCT institution_id),
    count(*) FILTER (WHERE institution_id IS NULL),
    count(*) FILTER (WHERE recognised_program_code IS NOT NULL)
  INTO publishable_count,institution_count,missing_identity_count,recognised_code_count
  FROM public.program_catalog_nl_staging
  WHERE verification_tier='A';

  IF publishable_count<>26 OR institution_count<>7 OR recognised_code_count<>15 THEN
    RAISE EXCEPTION 'NL Phase 4.1 expected 26 Tier A programmes across 7 institutions with 15 recognised codes; found % / % / %',
      publishable_count,institution_count,recognised_code_count;
  END IF;

  IF missing_identity_count>0 THEN
    RAISE EXCEPTION 'NL Phase 4.1 blocked: % Tier A programmes lack canonical institution identity',missing_identity_count;
  END IF;

  SELECT count(*) INTO duplicate_source_count
  FROM (
    SELECT source_name,source_program_key
    FROM public.program_catalog_nl_staging
    WHERE verification_tier='A'
    GROUP BY source_name,source_program_key
    HAVING count(*)>1
  ) d;

  IF duplicate_source_count>0 THEN
    RAISE EXCEPTION 'NL Phase 4.1 blocked: % duplicate Tier A source identities',duplicate_source_count;
  END IF;
END $$;

INSERT INTO catalog.programmes(
  id,institution_id,canonical_title,qualification_level_id,programme_type,
  field_code,field_name,default_duration_months,status,created_at,updated_at
)
SELECT
  md5('NL|PROGRAM|'||p.source_name||chr(31)||p.source_program_key)::uuid,
  p.institution_id,
  p.title,
  NULL,
  coalesce(nullif(btrim(p.programme_type),''),nullif(btrim(p.degree_type),''),nullif(btrim(p.canonical_level),'')),
  NULL,
  nullif(btrim(p.field_category),''),
  p.duration_months,
  'active',
  now(),now()
FROM public.program_catalog_nl_staging p
WHERE p.verification_tier='A'
ON CONFLICT (id) DO UPDATE SET
  institution_id=excluded.institution_id,
  canonical_title=excluded.canonical_title,
  qualification_level_id=NULL,
  programme_type=excluded.programme_type,
  field_code=excluded.field_code,
  field_name=excluded.field_name,
  default_duration_months=excluded.default_duration_months,
  status='active',
  updated_at=now();

-- Every canonical NL programme gets a stable source identity hash.
INSERT INTO catalog.programme_identifiers(
  programme_id,identifier_system,identifier_value,source_url,valid_from,valid_to
)
SELECT
  md5('NL|PROGRAM|'||p.source_name||chr(31)||p.source_program_key)::uuid,
  'NL_PROGRAM_SOURCE_HASH',
  md5(p.source_name||chr(31)||p.source_program_key),
  p.official_program_url,
  p.source_as_of,
  NULL
FROM public.program_catalog_nl_staging p
WHERE p.verification_tier='A'
ON CONFLICT (identifier_system,identifier_value) DO UPDATE SET
  programme_id=excluded.programme_id,
  source_url=excluded.source_url,
  valid_from=excluded.valid_from,
  valid_to=NULL;

-- Preserve official Dutch recognised programme codes when directly evidenced.
INSERT INTO catalog.programme_identifiers(
  programme_id,identifier_system,identifier_value,source_url,valid_from,valid_to
)
SELECT
  md5('NL|PROGRAM|'||p.source_name||chr(31)||p.source_program_key)::uuid,
  'NL_RIO_PROGRAM_CODE',
  p.recognised_program_code,
  coalesce(p.recognition_source_url,p.official_program_url),
  p.source_as_of,
  NULL
FROM public.program_catalog_nl_staging p
WHERE p.verification_tier='A'
  AND p.recognised_program_code IS NOT NULL
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
  md5('NL|OFFERING|'||p.source_name||chr(31)||p.source_program_key)::uuid,
  md5('NL|PROGRAM|'||p.source_name||chr(31)||p.source_program_key)::uuid,
  NULL,
  'international',
  p.study_mode,
  x.intake_label,
  x.intake_start_date,
  x.application_deadline,
  p.duration_months,
  CASE x.canonical_admission_state
    WHEN 'open' THEN 'open'
    WHEN 'closed' THEN 'closed'
    WHEN 'not_yet_open' THEN 'planned'
    ELSE 'unknown'
  END,
  coalesce(x.admission_source_url,x.international_source_url,p.official_program_url),
  greatest(p.source_as_of,x.source_as_of),
  NULL,
  'NL_PROGRAM_PHASE3_CANONICAL',
  md5(p.source_name||chr(31)||p.source_program_key),
  'verified',
  coalesce(x.verified_at,p.collected_at),
  now(),now()
FROM public.program_catalog_nl_staging p
JOIN public.program_international_nl_staging x
  ON x.program_catalog_id=p.id
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

CREATE OR REPLACE VIEW public.program_catalog_canonical_nl_v1
WITH (security_invoker=true) AS
SELECT
  pr.id AS programme_id,
  p.source_name,
  p.source_program_key,
  source_id.identifier_value AS source_hash,
  p.recognised_program_code,
  p.offered_program_code,
  pr.institution_id,
  i.slug AS institution_slug,
  i.canonical_name AS institution_name,
  p.brin_code,
  p.education_sector,
  pr.canonical_title,
  p.source_program_name,
  p.native_level_code,
  p.degree_type,
  p.eqf_level,
  p.nlqf_level,
  p.ects,
  p.canonical_level,
  pr.programme_type,
  pr.field_name,
  p.city AS source_city,
  p.campus AS source_campus,
  pr.default_duration_months,
  p.study_mode,
  p.language_code,
  p.verification_tier,
  p.collection_status,
  p.official_program_url,
  p.recognition_source_url,
  x.student_sponsor_eligible,
  x.accredited_programme_evidence,
  x.full_time_evidence,
  x.international_students_eligible,
  x.canonical_admission_state,
  x.international_admission_status,
  x.intake_label,
  x.intake_start_date,
  x.application_deadline,
  x.admission_source_url,
  x.international_source_url,
  x.sponsor_source_url,
  x.verification_status AS international_verification_status,
  x.verified_at
FROM public.program_catalog_nl_staging p
JOIN public.program_international_nl_staging x
  ON x.program_catalog_id=p.id
JOIN catalog.programmes pr
  ON pr.id=md5('NL|PROGRAM|'||p.source_name||chr(31)||p.source_program_key)::uuid
JOIN catalog.institutions i
  ON i.id=pr.institution_id
JOIN catalog.programme_identifiers source_id
  ON source_id.programme_id=pr.id
 AND source_id.identifier_system='NL_PROGRAM_SOURCE_HASH'
WHERE p.verification_tier='A'
  AND pr.status='active';

COMMENT ON VIEW public.program_catalog_canonical_nl_v1 IS
  'Service-role NL Phase 4 canonical programme cohort. Contains only Phase 3 Tier A programmes; unresolved HBO provider candidates remain staging-only.';

REVOKE ALL ON public.program_catalog_canonical_nl_v1 FROM public,anon,authenticated;
GRANT SELECT ON public.program_catalog_canonical_nl_v1 TO service_role;

DO $$
DECLARE
  canonical_count integer;
  institution_count integer;
  source_identifier_count integer;
  rio_identifier_count integer;
  offering_count integer;
  offering_with_campus_count integer;
  verified_offering_count integer;
  tier_c_leak_count integer;
  total_nl_programme_count integer;
  active_nl_programme_count integer;
BEGIN
  SELECT count(*),count(DISTINCT institution_id)
  INTO canonical_count,institution_count
  FROM public.program_catalog_canonical_nl_v1;

  IF canonical_count<>26 OR institution_count<>7 THEN
    RAISE EXCEPTION 'Unexpected NL Phase 4 canonical cohort: % rows across % institutions',canonical_count,institution_count;
  END IF;

  SELECT count(*) INTO source_identifier_count
  FROM catalog.programme_identifiers pi
  JOIN catalog.programmes p ON p.id=pi.programme_id
  JOIN catalog.institutions i ON i.id=p.institution_id
  WHERE i.country_code='NL' AND pi.identifier_system='NL_PROGRAM_SOURCE_HASH';

  SELECT count(*) INTO rio_identifier_count
  FROM catalog.programme_identifiers pi
  JOIN catalog.programmes p ON p.id=pi.programme_id
  JOIN catalog.institutions i ON i.id=p.institution_id
  WHERE i.country_code='NL' AND pi.identifier_system='NL_RIO_PROGRAM_CODE';

  IF source_identifier_count<>26 OR rio_identifier_count<>15 THEN
    RAISE EXCEPTION 'Expected NL canonical identifiers source 26 / RIO 15; found % / %',source_identifier_count,rio_identifier_count;
  END IF;

  SELECT
    count(*),
    count(*) FILTER (WHERE campus_id IS NOT NULL),
    count(*) FILTER (WHERE verification_status='verified')
  INTO offering_count,offering_with_campus_count,verified_offering_count
  FROM catalog.programme_offerings
  WHERE source_system='NL_PROGRAM_PHASE3_CANONICAL';

  IF offering_count<>26 OR offering_with_campus_count<>0 OR verified_offering_count<>26 THEN
    RAISE EXCEPTION 'Unexpected NL offering state: total %, campus %, verified %',
      offering_count,offering_with_campus_count,verified_offering_count;
  END IF;

  SELECT count(*) INTO tier_c_leak_count
  FROM public.program_catalog_nl_staging p
  JOIN catalog.programme_identifiers pi
    ON pi.identifier_system='NL_PROGRAM_SOURCE_HASH'
   AND pi.identifier_value=md5(p.source_name||chr(31)||p.source_program_key)
  WHERE p.verification_tier='C';

  IF tier_c_leak_count>0 THEN
    RAISE EXCEPTION 'NL Phase 4 invariant failed: % Tier C programmes leaked into canonical catalogue',tier_c_leak_count;
  END IF;

  SELECT count(*),count(*) FILTER (WHERE p.status='active')
  INTO total_nl_programme_count,active_nl_programme_count
  FROM catalog.programmes p
  JOIN catalog.institutions i ON i.id=p.institution_id
  WHERE i.country_code='NL';

  IF total_nl_programme_count<>26 OR active_nl_programme_count<>26 THEN
    RAISE EXCEPTION 'Expected 26 total / 26 active NL programmes after Phase 4.1; found % / %',
      total_nl_programme_count,active_nl_programme_count;
  END IF;
END $$;
