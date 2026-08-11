-- NL Programs Phase 4.2-4.4 integration closeout.
--
-- country_occupation_profiles currently has no NL rows, so reviewed programme to
-- career relations are exposed through an NL canonical read model instead of
-- fabricating shared profile records.
--
-- No programme campus/canonical-city linkage is created here. Raw source city
-- text remains provenance in program_catalog_canonical_nl_v1, but publication
-- surfaces keep canonical city/campus fields null until an explicit programme-
-- level location relation is modelled.

CREATE OR REPLACE VIEW public.program_occupation_canonical_nl_v1
WITH (security_invoker=true) AS
SELECT
  c.programme_id,
  c.institution_id,
  c.institution_slug,
  c.institution_name,
  c.source_name,
  c.source_program_key,
  o.canonical_career_id,
  o.relation_type AS source_relation_type,
  CASE WHEN o.relation_type='direct' THEN 'direct' ELSE 'related' END AS normalized_relation_type,
  o.match_basis,
  o.match_pattern,
  o.rule_version,
  o.source_checked_at,
  o.reviewed_at,
  o.reviewer_note
FROM public.program_catalog_canonical_nl_v1 c
JOIN public.program_catalog_nl_staging p
  ON p.source_name=c.source_name
 AND p.source_program_key=c.source_program_key
JOIN public.program_occupation_nl_staging o
  ON o.program_catalog_id=p.id
WHERE o.review_status='approved'
  AND p.verification_tier='A';

COMMENT ON VIEW public.program_occupation_canonical_nl_v1 IS
  'Service-role NL Phase 4 canonical Programme to Career relations using reviewed staging relations and deterministic canonical programme UUIDs.';

REVOKE ALL ON public.program_occupation_canonical_nl_v1 FROM public,anon,authenticated;
GRANT SELECT ON public.program_occupation_canonical_nl_v1 TO service_role;

CREATE OR REPLACE VIEW public.program_explorer_nl_v1
WITH (security_invoker=true) AS
SELECT
  c.programme_id,
  c.institution_id,
  c.institution_slug,
  c.institution_name,
  c.canonical_title,
  c.recognised_program_code,
  c.education_sector,
  c.native_level_code,
  c.degree_type,
  c.eqf_level,
  c.nlqf_level,
  c.ects,
  c.canonical_level,
  c.programme_type,
  c.field_name,
  c.default_duration_months,
  c.study_mode,
  c.language_code,
  c.verification_tier,
  'publishable'::text AS publication_status,
  true AS indexable,
  c.international_students_eligible,
  c.student_sponsor_eligible,
  c.accredited_programme_evidence,
  c.full_time_evidence,
  c.canonical_admission_state,
  c.intake_label,
  c.intake_start_date,
  c.application_deadline,
  po.enrolment_status,
  po.verification_status AS offering_verification_status,
  null::uuid AS campus_id,
  null::text AS city_slug,
  null::text AS city_name,
  coalesce((
    SELECT array_agg(DISTINCT r.canonical_career_id ORDER BY r.canonical_career_id)
    FROM public.program_occupation_canonical_nl_v1 r
    WHERE r.programme_id=c.programme_id
  ),array[]::text[]) AS canonical_career_ids,
  c.official_program_url
FROM public.program_catalog_canonical_nl_v1 c
JOIN catalog.programme_offerings po
  ON po.programme_id=c.programme_id
 AND po.source_system='NL_PROGRAM_PHASE3_CANONICAL'
WHERE c.verification_tier='A';

COMMENT ON VIEW public.program_explorer_nl_v1 IS
  'Service-role NL Phase 4 programme explorer. Contains only Tier A programmes; canonical city/campus remain null until programme-level location linkage exists.';

REVOKE ALL ON public.program_explorer_nl_v1 FROM public,anon,authenticated;
GRANT SELECT ON public.program_explorer_nl_v1 TO service_role;

CREATE OR REPLACE VIEW public.program_detail_nl_v1
WITH (security_invoker=true) AS
SELECT
  e.*,
  c.source_name,
  c.source_program_key,
  c.source_program_name,
  c.offered_program_code,
  c.brin_code,
  c.source_city,
  c.source_campus,
  c.collection_status,
  c.recognition_source_url,
  c.international_admission_status,
  c.admission_source_url,
  c.international_source_url,
  c.sponsor_source_url,
  c.international_verification_status,
  c.verified_at,
  coalesce((
    SELECT jsonb_agg(
      jsonb_build_object(
        'careerId',r.canonical_career_id,
        'relationType',r.normalized_relation_type,
        'sourceRelationType',r.source_relation_type,
        'matchBasis',r.match_basis,
        'sourceCheckedAt',r.source_checked_at
      ) ORDER BY r.canonical_career_id,r.source_relation_type
    )
    FROM public.program_occupation_canonical_nl_v1 r
    WHERE r.programme_id=e.programme_id
  ),'[]'::jsonb) AS occupation_relations
FROM public.program_explorer_nl_v1 e
JOIN public.program_catalog_canonical_nl_v1 c
  ON c.programme_id=e.programme_id;

COMMENT ON VIEW public.program_detail_nl_v1 IS
  'Service-role NL Phase 4 programme detail with source provenance, Dutch recognition metadata and reviewed career relations.';

REVOKE ALL ON public.program_detail_nl_v1 FROM public,anon,authenticated;
GRANT SELECT ON public.program_detail_nl_v1 TO service_role;

CREATE OR REPLACE VIEW public.program_compare_nl_v1
WITH (security_invoker=true) AS
SELECT
  programme_id,
  institution_id,
  institution_slug,
  institution_name,
  canonical_title,
  recognised_program_code,
  education_sector,
  degree_type,
  eqf_level,
  nlqf_level,
  ects,
  canonical_level,
  programme_type,
  field_name,
  default_duration_months,
  study_mode,
  language_code,
  verification_tier,
  publication_status,
  indexable,
  international_students_eligible,
  student_sponsor_eligible,
  accredited_programme_evidence,
  full_time_evidence,
  canonical_admission_state,
  intake_label,
  intake_start_date,
  application_deadline,
  enrolment_status,
  campus_id,
  city_slug,
  city_name,
  canonical_career_ids,
  official_program_url
FROM public.program_explorer_nl_v1;

COMMENT ON VIEW public.program_compare_nl_v1 IS
  'Service-role NL Phase 4 comparison projection. Canonical programme city/campus remain null rather than inferred from institution presence or raw text.';

REVOKE ALL ON public.program_compare_nl_v1 FROM public,anon,authenticated;
GRANT SELECT ON public.program_compare_nl_v1 TO service_role;

DO $$
DECLARE
  relation_count integer;
  relation_career_count integer;
  explorer_count integer;
  detail_count integer;
  compare_count integer;
  indexable_count integer;
  city_link_count integer;
  nl_profile_count integer;
  tier_c_leak_count integer;
BEGIN
  SELECT count(*),count(DISTINCT canonical_career_id)
  INTO relation_count,relation_career_count
  FROM public.program_occupation_canonical_nl_v1;

  IF relation_count<>56 OR relation_career_count<>30 THEN
    RAISE EXCEPTION 'Expected 56 canonical NL programme-career relations across 30 careers; found % / %',relation_count,relation_career_count;
  END IF;

  SELECT
    count(*),
    count(*) FILTER (WHERE indexable),
    count(*) FILTER (WHERE campus_id IS NOT NULL OR city_slug IS NOT NULL)
  INTO explorer_count,indexable_count,city_link_count
  FROM public.program_explorer_nl_v1;

  IF explorer_count<>26 OR indexable_count<>26 THEN
    RAISE EXCEPTION 'Expected NL explorer 26 Tier A/indexable rows; found % / %',explorer_count,indexable_count;
  END IF;

  IF city_link_count<>0 THEN
    RAISE EXCEPTION 'NL Phase 4 invariant failed: % programme city/campus links were created without canonical programme-level linkage',city_link_count;
  END IF;

  SELECT count(*) INTO detail_count FROM public.program_detail_nl_v1;
  SELECT count(*) INTO compare_count FROM public.program_compare_nl_v1;

  IF detail_count<>26 OR compare_count<>26 THEN
    RAISE EXCEPTION 'Expected 26 NL detail / compare rows; found % / %',detail_count,compare_count;
  END IF;

  SELECT count(*) INTO nl_profile_count
  FROM public.country_occupation_profiles
  WHERE country_code='NL';

  IF nl_profile_count<>0 THEN
    RAISE NOTICE 'NL country_occupation_profiles now has % rows; shared country_occupation_program_links can be materialized later without changing canonical programme identity',nl_profile_count;
  END IF;

  SELECT count(*) INTO tier_c_leak_count
  FROM public.program_occupation_canonical_nl_v1 r
  JOIN public.program_catalog_nl_staging p
    ON p.source_name=r.source_name
   AND p.source_program_key=r.source_program_key
  WHERE p.verification_tier='C';

  IF tier_c_leak_count>0 THEN
    RAISE EXCEPTION 'NL Phase 4 invariant failed: % Tier C career relations leaked into canonical read models',tier_c_leak_count;
  END IF;
END $$;
