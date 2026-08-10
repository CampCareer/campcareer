-- Ireland Programs Phase 4 canonicalization gate.
-- Only Phase 3 Tier B rows become canonical. Tier C remains staging-only.
-- Tier A is zero, so all new offerings remain unverified and server-only.
-- Existing IE legacy programmes stay active until a publication-ready cohort exists.

DO $$
DECLARE b integer; c integer; a integer; inst integer; missing integer;
BEGIN
  SELECT count(*) FILTER (WHERE verification_tier='A'),
         count(*) FILTER (WHERE verification_tier='B'),
         count(*) FILTER (WHERE verification_tier='C')
  INTO a,b,c FROM public.program_catalog_ie_staging;
  SELECT count(DISTINCT institution_id),
         count(*) FILTER (WHERE institution_id IS NULL OR nullif(btrim(provider_program_url),'') IS NULL)
  INTO inst,missing FROM public.program_catalog_ie_staging WHERE verification_tier='B';
  IF a<>0 OR b<>28 OR c<>12 OR inst<>9 OR missing<>0 THEN
    RAISE EXCEPTION 'IE Phase 4 gate failed: A% B% C% inst% missing%',a,b,c,inst,missing;
  END IF;
END $$;

INSERT INTO catalog.programmes(id,institution_id,canonical_title,qualification_level_id,programme_type,status,created_at,updated_at)
SELECT md5('IE|PROGRAM|'||p.source_name||chr(31)||p.source_program_key)::uuid,
       p.institution_id,p.title,ql.id,p.course_type,'active',now(),now()
FROM public.program_catalog_ie_staging p
LEFT JOIN core.qualification_frameworks qf ON qf.country_code='IE' AND qf.framework_code='NFQ'
LEFT JOIN core.qualification_levels ql ON ql.framework_id=qf.id AND ql.level_code=p.nfq_level::text
WHERE p.verification_tier='B'
ON CONFLICT (id) DO UPDATE SET
  institution_id=excluded.institution_id,canonical_title=excluded.canonical_title,
  qualification_level_id=excluded.qualification_level_id,programme_type=excluded.programme_type,
  status='active',updated_at=now();

INSERT INTO catalog.programme_identifiers(programme_id,identifier_system,identifier_value,source_url,valid_from,valid_to)
SELECT md5('IE|PROGRAM|'||p.source_name||chr(31)||p.source_program_key)::uuid,
       'IE_PROGRAM_SOURCE_HASH',md5(p.source_name||chr(31)||p.source_program_key),
       p.provider_program_url,p.source_as_of,NULL
FROM public.program_catalog_ie_staging p WHERE p.verification_tier='B'
ON CONFLICT (identifier_system,identifier_value) DO UPDATE SET
  programme_id=excluded.programme_id,source_url=excluded.source_url,valid_from=excluded.valid_from,valid_to=NULL;

INSERT INTO catalog.programme_offerings(
  id,programme_id,campus_id,market,delivery_mode,enrolment_status,source_url,valid_from,valid_to,
  source_system,source_record_key,verification_status,source_checked_at,created_at,updated_at)
SELECT md5('IE|OFFERING|'||p.source_name||chr(31)||p.source_program_key)::uuid,
       md5('IE|PROGRAM|'||p.source_name||chr(31)||p.source_program_key)::uuid,
       NULL,'international',CASE WHEN x.full_time_daytime_verified IS TRUE THEN 'full-time' ELSE NULL END,
       CASE x.international_admission_status WHEN 'open' THEN 'open' WHEN 'closed' THEN 'closed' WHEN 'not_yet_open' THEN 'planned' ELSE 'unknown' END,
       coalesce(x.eligible_programme_source_url,p.provider_program_url),greatest(p.source_as_of,x.source_checked_at),NULL,
       'IE_PROGRAM_PHASE3_CANONICAL',md5(p.source_name||chr(31)||p.source_program_key),'unverified',
       coalesce(x.verified_at,p.collected_at),now(),now()
FROM public.program_catalog_ie_staging p
JOIN public.program_international_ie_staging x ON x.program_catalog_id=p.id
WHERE p.verification_tier='B'
ON CONFLICT (id) DO UPDATE SET
  programme_id=excluded.programme_id,market=excluded.market,delivery_mode=excluded.delivery_mode,
  enrolment_status=excluded.enrolment_status,source_url=excluded.source_url,valid_from=excluded.valid_from,
  valid_to=NULL,source_system=excluded.source_system,source_record_key=excluded.source_record_key,
  verification_status='unverified',source_checked_at=excluded.source_checked_at,updated_at=now();

CREATE OR REPLACE VIEW public.program_catalog_canonical_ie_v1 WITH (security_invoker=true) AS
SELECT pr.id AS programme_id,p.source_name,p.source_program_key,pi.identifier_value AS source_hash,
       pr.institution_id,i.slug AS institution_slug,i.canonical_name AS institution_name,
       pr.canonical_title,p.nfq_level,ql.label AS qualification_level_label,pr.programme_type,
       p.verification_tier,p.collection_status,p.provider_program_url AS official_program_url,p.qualifax_url,
       x.trusted_ireland_provider_authorised,x.ilep_or_trusted_programme_status,x.international_students_eligible,
       x.full_time_daytime_verified,x.international_admission_status,x.verification_status AS international_verification_status,
       o.id AS offering_id,o.enrolment_status,o.verification_status AS offering_verification_status
FROM public.program_catalog_ie_staging p
JOIN public.program_international_ie_staging x ON x.program_catalog_id=p.id
JOIN catalog.programmes pr ON pr.id=md5('IE|PROGRAM|'||p.source_name||chr(31)||p.source_program_key)::uuid
JOIN catalog.institutions i ON i.id=pr.institution_id
JOIN catalog.programme_identifiers pi ON pi.programme_id=pr.id AND pi.identifier_system='IE_PROGRAM_SOURCE_HASH'
LEFT JOIN core.qualification_levels ql ON ql.id=pr.qualification_level_id
JOIN catalog.programme_offerings o ON o.id=md5('IE|OFFERING|'||p.source_name||chr(31)||p.source_program_key)::uuid
WHERE p.verification_tier='B' AND pr.status='active';
REVOKE ALL ON public.program_catalog_canonical_ie_v1 FROM public,anon,authenticated;
GRANT SELECT ON public.program_catalog_canonical_ie_v1 TO service_role;

CREATE OR REPLACE VIEW public.program_occupation_canonical_ie_v1 WITH (security_invoker=true) AS
SELECT md5('IE|PROGRAM|'||p.source_name||chr(31)||p.source_program_key)::uuid AS programme_id,
       o.canonical_career_id,o.relation_type,o.access_model,o.match_basis,o.rule_version,o.source_checked_at,o.reviewed_at,o.reviewer_note
FROM public.program_catalog_ie_staging p
JOIN public.program_occupation_ie_staging o ON o.program_catalog_id=p.id
WHERE p.verification_tier='B' AND o.review_status='approved';
REVOKE ALL ON public.program_occupation_canonical_ie_v1 FROM public,anon,authenticated;
GRANT SELECT ON public.program_occupation_canonical_ie_v1 TO service_role;

DO $$
DECLARE canonical integer; rel integer; careers integer; leaks integer; legacy_active integer;
BEGIN
  SELECT count(*) INTO canonical FROM public.program_catalog_canonical_ie_v1;
  SELECT count(*),count(DISTINCT canonical_career_id) INTO rel,careers FROM public.program_occupation_canonical_ie_v1;
  SELECT count(*) INTO leaks FROM public.program_catalog_ie_staging p JOIN catalog.programme_identifiers pi
    ON pi.identifier_system='IE_PROGRAM_SOURCE_HASH' AND pi.identifier_value=md5(p.source_name||chr(31)||p.source_program_key)
    WHERE p.verification_tier='C';
  SELECT count(*) INTO legacy_active FROM catalog.programmes p
    JOIN catalog.programme_identifiers pi ON pi.programme_id=p.id AND pi.identifier_system='LEGACY_COURSES_IE_ID'
    JOIN catalog.institutions i ON i.id=p.institution_id AND i.country_code='IE' WHERE p.status='active';
  IF canonical<>28 OR rel<>51 OR careers<>32 OR leaks<>0 OR legacy_active<>2876 THEN
    RAISE EXCEPTION 'IE Phase 4 invariant failed: canonical% rel% careers% leaks% legacy%',canonical,rel,careers,leaks,legacy_active;
  END IF;
  IF to_regclass('public.program_explorer_ie_v1') IS NOT NULL OR to_regclass('public.program_detail_ie_v1') IS NOT NULL THEN
    RAISE EXCEPTION 'IE Phase 4 publication gate failed';
  END IF;
END $$;