-- UK Programs Phase 4.1 canonicalization.
--
-- Canonicalizes only the Phase 3 publication cohort (Tier A/B). Tier C remains
-- staging-only and cannot leak into catalog.programmes through this migration.
--
-- Stable identity rule:
--   (source_name, source_program_key)
-- is the source identity. Canonical programme/offering UUIDs are deterministic
-- hashes of that stable identity; no database-generated staging IDs are baked
-- into this data migration.
--
-- Legacy UK programmes are retained for provenance but retired from active
-- catalogue use, matching the Canada canonicalization precedent.

DO $$
DECLARE
  publishable_count integer;
  tier_a_count integer;
  tier_b_count integer;
  institution_count integer;
  missing_identity_count integer;
  duplicate_source_count integer;
BEGIN
  SELECT
    count(*),
    count(*) FILTER (WHERE verification_tier='A'),
    count(*) FILTER (WHERE verification_tier='B'),
    count(DISTINCT institution_id),
    count(*) FILTER (WHERE institution_id IS NULL)
  INTO publishable_count,tier_a_count,tier_b_count,institution_count,missing_identity_count
  FROM public.program_catalog_uk_staging
  WHERE verification_tier IN ('A','B');

  IF publishable_count<>76 OR tier_a_count<>75 OR tier_b_count<>1 OR institution_count<>19 THEN
    RAISE EXCEPTION 'UK Phase 4.1 expected 76 publishable programmes (A75/B1) across 19 institutions; found % (A%/B%) across %',
      publishable_count,tier_a_count,tier_b_count,institution_count;
  END IF;

  IF missing_identity_count>0 THEN
    RAISE EXCEPTION 'UK Phase 4.1 blocked: % publishable programmes lack canonical institution identity',missing_identity_count;
  END IF;

  SELECT count(*) INTO duplicate_source_count
  FROM (
    SELECT source_name,source_program_key
    FROM public.program_catalog_uk_staging
    WHERE verification_tier IN ('A','B')
    GROUP BY source_name,source_program_key
    HAVING count(*)>1
  ) d;

  IF duplicate_source_count>0 THEN
    RAISE EXCEPTION 'UK Phase 4.1 blocked: % duplicate publishable source identities',duplicate_source_count;
  END IF;
END $$;

INSERT INTO catalog.programmes(
  id,institution_id,canonical_title,qualification_level_id,programme_type,
  field_code,field_name,default_duration_months,status,created_at,updated_at
)
SELECT
  md5('UK|PROGRAM|'||p.source_name||chr(31)||p.source_program_key)::uuid,
  p.institution_id,
  p.title,
  NULL,
  coalesce(nullif(btrim(p.qualification_title),''),nullif(btrim(p.canonical_level),'')),
  NULL,
  nullif(btrim(p.field_category),''),
  p.duration_months,
  'active',
  now(),now()
FROM public.program_catalog_uk_staging p
WHERE p.verification_tier IN ('A','B')
ON CONFLICT (id) DO UPDATE SET
  institution_id=excluded.institution_id,
  canonical_title=excluded.canonical_title,
  qualification_level_id=excluded.qualification_level_id,
  programme_type=excluded.programme_type,
  field_code=excluded.field_code,
  field_name=excluded.field_name,
  default_duration_months=excluded.default_duration_months,
  status='active',
  updated_at=now();

INSERT INTO catalog.programme_identifiers(
  programme_id,identifier_system,identifier_value,source_url,valid_from,valid_to
)
SELECT
  md5('UK|PROGRAM|'||p.source_name||chr(31)||p.source_program_key)::uuid,
  'UK_PROGRAM_SOURCE_HASH',
  md5(p.source_name||chr(31)||p.source_program_key),
  p.official_program_url,
  p.source_as_of,
  NULL
FROM public.program_catalog_uk_staging p
WHERE p.verification_tier IN ('A','B')
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
  md5('UK|OFFERING|'||p.source_name||chr(31)||p.source_program_key)::uuid,
  md5('UK|PROGRAM|'||p.source_name||chr(31)||p.source_program_key)::uuid,
  NULL,
  'international',
  NULL,
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
  'UK_PROGRAM_PHASE3_CANONICAL',
  md5(p.source_name||chr(31)||p.source_program_key),
  CASE WHEN p.verification_tier='A' THEN 'verified' ELSE 'unverified' END,
  coalesce(x.verified_at,p.collected_at),
  now(),now()
FROM public.program_catalog_uk_staging p
JOIN public.program_international_uk_staging x
  ON x.program_catalog_id=p.id
WHERE p.verification_tier IN ('A','B')
ON CONFLICT (id) DO UPDATE SET
  programme_id=excluded.programme_id,
  campus_id=excluded.campus_id,
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
  verification_status=excluded.verification_status,
  source_checked_at=excluded.source_checked_at,
  updated_at=now();

-- Retain legacy UK programme UUIDs and identifiers as historical provenance,
-- but remove them from active catalogue surfaces.
UPDATE catalog.programmes p
SET status='inactive',updated_at=now()
WHERE EXISTS (
  SELECT 1
  FROM catalog.programme_identifiers legacy
  WHERE legacy.programme_id=p.id
    AND legacy.identifier_system='LEGACY_COURSES_UK_ID'
)
AND EXISTS (
  SELECT 1
  FROM catalog.institutions i
  WHERE i.id=p.institution_id
    AND i.country_code='UK'
);

UPDATE catalog.programme_offerings po
SET
  verification_status='stale',
  valid_to=coalesce(po.valid_to,current_date),
  updated_at=now()
WHERE EXISTS (
  SELECT 1
  FROM catalog.programme_identifiers legacy
  JOIN catalog.programmes p ON p.id=legacy.programme_id
  JOIN catalog.institutions i ON i.id=p.institution_id
  WHERE legacy.identifier_system='LEGACY_COURSES_UK_ID'
    AND i.country_code='UK'
    AND po.programme_id=p.id
);

CREATE OR REPLACE VIEW public.program_catalog_canonical_uk_v1
WITH (security_invoker=true) AS
SELECT
  pr.id AS programme_id,
  p.source_name,
  p.source_program_key,
  pi.identifier_value AS source_hash,
  pr.institution_id,
  i.slug AS institution_slug,
  i.canonical_name AS institution_name,
  pr.canonical_title,
  p.source_program_name,
  p.qualification_title,
  p.native_framework,
  p.native_level_code,
  p.canonical_level,
  pr.programme_type,
  pr.field_name,
  p.city,
  p.campus,
  pr.default_duration_months,
  p.study_mode,
  p.verification_tier,
  p.collection_status,
  p.official_program_url,
  p.official_qualification_url,
  x.international_students_eligible,
  x.student_sponsor_eligible,
  x.cas_eligibility,
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
FROM public.program_catalog_uk_staging p
JOIN public.program_international_uk_staging x
  ON x.program_catalog_id=p.id
JOIN catalog.programmes pr
  ON pr.id=md5('UK|PROGRAM|'||p.source_name||chr(31)||p.source_program_key)::uuid
JOIN catalog.institutions i
  ON i.id=pr.institution_id
JOIN catalog.programme_identifiers pi
  ON pi.programme_id=pr.id
 AND pi.identifier_system='UK_PROGRAM_SOURCE_HASH'
WHERE p.verification_tier IN ('A','B')
  AND pr.status='active';

COMMENT ON VIEW public.program_catalog_canonical_uk_v1 IS
  'Service-role UK Phase 4 canonical programme cohort. Contains only Phase 3 Tier A/B programmes; Tier C remains staging-only.';

REVOKE ALL ON public.program_catalog_canonical_uk_v1 FROM public,anon,authenticated;
GRANT SELECT ON public.program_catalog_canonical_uk_v1 TO service_role;

DO $$
DECLARE
  canonical_count integer;
  tier_a_count integer;
  tier_b_count integer;
  institution_count integer;
  identifier_count integer;
  offering_count integer;
  offering_with_campus_count integer;
  verified_offering_count integer;
  unverified_offering_count integer;
  tier_c_leak_count integer;
  legacy_inactive_count integer;
  legacy_active_count integer;
  legacy_stale_offering_count integer;
  total_uk_programme_count integer;
  active_uk_programme_count integer;
BEGIN
  SELECT
    count(*),
    count(*) FILTER (WHERE verification_tier='A'),
    count(*) FILTER (WHERE verification_tier='B'),
    count(DISTINCT institution_id)
  INTO canonical_count,tier_a_count,tier_b_count,institution_count
  FROM public.program_catalog_canonical_uk_v1;

  IF canonical_count<>76 OR tier_a_count<>75 OR tier_b_count<>1 OR institution_count<>19 THEN
    RAISE EXCEPTION 'Unexpected UK Phase 4.1 canonical cohort: % rows (A%/B%) across % institutions',
      canonical_count,tier_a_count,tier_b_count,institution_count;
  END IF;

  SELECT count(*) INTO identifier_count
  FROM catalog.programme_identifiers pi
  JOIN catalog.programmes p ON p.id=pi.programme_id
  JOIN catalog.institutions i ON i.id=p.institution_id
  WHERE i.country_code='UK'
    AND pi.identifier_system='UK_PROGRAM_SOURCE_HASH';

  IF identifier_count<>76 THEN
    RAISE EXCEPTION 'Expected 76 UK canonical source identifiers, found %',identifier_count;
  END IF;

  SELECT
    count(*),
    count(*) FILTER (WHERE campus_id IS NOT NULL),
    count(*) FILTER (WHERE verification_status='verified'),
    count(*) FILTER (WHERE verification_status='unverified')
  INTO offering_count,offering_with_campus_count,verified_offering_count,unverified_offering_count
  FROM catalog.programme_offerings
  WHERE source_system='UK_PROGRAM_PHASE3_CANONICAL';

  IF offering_count<>76 OR offering_with_campus_count<>0 OR verified_offering_count<>75 OR unverified_offering_count<>1 THEN
    RAISE EXCEPTION 'Unexpected UK canonical offering state: total %, campus %, verified %, unverified %',
      offering_count,offering_with_campus_count,verified_offering_count,unverified_offering_count;
  END IF;

  SELECT count(*) INTO tier_c_leak_count
  FROM public.program_catalog_uk_staging p
  JOIN catalog.programme_identifiers pi
    ON pi.identifier_system='UK_PROGRAM_SOURCE_HASH'
   AND pi.identifier_value=md5(p.source_name||chr(31)||p.source_program_key)
  WHERE p.verification_tier='C';

  IF tier_c_leak_count>0 THEN
    RAISE EXCEPTION 'UK Phase 4.1 invariant failed: % Tier C programmes leaked into canonical catalogue',tier_c_leak_count;
  END IF;

  SELECT
    count(*) FILTER (WHERE p.status='inactive'),
    count(*) FILTER (WHERE p.status='active')
  INTO legacy_inactive_count,legacy_active_count
  FROM catalog.programmes p
  JOIN catalog.programme_identifiers legacy
    ON legacy.programme_id=p.id
   AND legacy.identifier_system='LEGACY_COURSES_UK_ID'
  JOIN catalog.institutions i
    ON i.id=p.institution_id
   AND i.country_code='UK';

  IF legacy_inactive_count<>185 OR legacy_active_count<>0 THEN
    RAISE EXCEPTION 'Expected all 185 legacy UK programmes inactive; inactive %, active %',legacy_inactive_count,legacy_active_count;
  END IF;

  SELECT count(*) INTO legacy_stale_offering_count
  FROM catalog.programme_offerings po
  JOIN catalog.programme_identifiers legacy
    ON legacy.programme_id=po.programme_id
   AND legacy.identifier_system='LEGACY_COURSES_UK_ID'
  JOIN catalog.programmes p ON p.id=po.programme_id
  JOIN catalog.institutions i ON i.id=p.institution_id AND i.country_code='UK'
  WHERE po.verification_status='stale'
    AND po.valid_to IS NOT NULL;

  IF legacy_stale_offering_count<>185 THEN
    RAISE EXCEPTION 'Expected 185 stale legacy UK offerings, found %',legacy_stale_offering_count;
  END IF;

  SELECT
    count(*),
    count(*) FILTER (WHERE p.status='active')
  INTO total_uk_programme_count,active_uk_programme_count
  FROM catalog.programmes p
  JOIN catalog.institutions i ON i.id=p.institution_id
  WHERE i.country_code='UK';

  IF total_uk_programme_count<>261 OR active_uk_programme_count<>76 THEN
    RAISE EXCEPTION 'Expected 261 total / 76 active UK programmes after Phase 4.1; found % / %',
      total_uk_programme_count,active_uk_programme_count;
  END IF;
END $$;