-- New Zealand Programs Phase 4.2-4.4 canonical read models.
-- The shared country_occupation_profiles table has no NZ rows, so reviewed programme-career
-- relations remain in a country-specific canonical read model instead of fabricating profile records.
-- No programme campus/city linkage is created without programme-level delivery evidence.

CREATE OR REPLACE VIEW public.program_occupation_canonical_nz_v1
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
FROM public.program_catalog_canonical_nz_v1 c
JOIN public.program_catalog_nz_staging p
  ON p.source_name=c.source_name
 AND p.source_program_key=c.source_program_key
JOIN public.program_occupation_nz_staging o
  ON o.program_catalog_id=p.id
WHERE o.review_status='approved'
  AND p.verification_tier='A';

COMMENT ON VIEW public.program_occupation_canonical_nz_v1 IS
  'Service-role NZ Phase 4 canonical Programme to Career relations. Relations preserve reviewed direct/related semantics and do not imply licensing, registration, visa or employment eligibility.';

REVOKE ALL ON public.program_occupation_canonical_nz_v1 FROM public,anon,authenticated;
GRANT SELECT ON public.program_occupation_canonical_nz_v1 TO service_role;

CREATE OR REPLACE VIEW public.program_explorer_nz_v1
WITH (security_invoker=true) AS
SELECT
  c.programme_id,
  c.institution_id,
  c.institution_slug,
  c.institution_name,
  c.canonical_title,
  c.qualification_name,
  c.degree_level,
  c.nzqcf_level,
  c.nzqcf_credits,
  c.programme_type,
  c.field_name,
  c.default_duration_months,
  c.study_mode,
  c.verification_tier,
  'publishable'::text AS publication_status,
  true AS indexable,
  c.international_students_eligible,
  c.code_signatory_status,
  c.canonical_admission_state,
  c.intake_label,
  c.intake_start_date,
  c.application_deadline,
  c.post_study_work_context,
  po.enrolment_status,
  po.verification_status AS offering_verification_status,
  null::uuid AS campus_id,
  null::text AS city_slug,
  null::text AS city_name,
  coalesce((
    SELECT array_agg(DISTINCT r.canonical_career_id ORDER BY r.canonical_career_id)
    FROM public.program_occupation_canonical_nz_v1 r
    WHERE r.programme_id=c.programme_id
  ),array[]::text[]) AS canonical_career_ids,
  c.official_program_url
FROM public.program_catalog_canonical_nz_v1 c
JOIN catalog.programme_offerings po
  ON po.programme_id=c.programme_id
 AND po.source_system='NZ_PROGRAM_PHASE3_CANONICAL'
WHERE c.verification_tier='A';

COMMENT ON VIEW public.program_explorer_nz_v1 IS
  'Service-role NZ Phase 4 programme explorer. Contains only verified Tier A occupation-led programmes; canonical city/campus remain null without programme-delivery linkage.';

REVOKE ALL ON public.program_explorer_nz_v1 FROM public,anon,authenticated;
GRANT SELECT ON public.program_explorer_nz_v1 TO service_role;

CREATE OR REPLACE VIEW public.program_detail_nz_v1
WITH (security_invoker=true) AS
SELECT
  e.*,
  c.source_name,
  c.source_program_key,
  c.source_program_name,
  c.provider_number,
  c.programme_authority,
  c.programme_authority_url,
  c.collection_status,
  c.language_context,
  c.programme_international_source_url,
  c.international_admission_status,
  c.admission_source_url,
  c.international_source_url,
  c.code_signatory_source_url,
  c.student_visa_context,
  c.post_study_work_rule_effective_date,
  c.visa_source_url,
  c.international_verification_status,
  c.international_source_checked_at,
  c.verified_at,
  coalesce((
    SELECT jsonb_agg(
      jsonb_build_object(
        'careerId',r.canonical_career_id,
        'relationType',r.normalized_relation_type,
        'sourceRelationType',r.source_relation_type,
        'matchBasis',r.match_basis,
        'sourceCheckedAt',r.source_checked_at,
        'reviewerNote',r.reviewer_note
      ) ORDER BY r.canonical_career_id,r.source_relation_type
    )
    FROM public.program_occupation_canonical_nz_v1 r
    WHERE r.programme_id=e.programme_id
  ),'[]'::jsonb) AS occupation_relations
FROM public.program_explorer_nz_v1 e
JOIN public.program_catalog_canonical_nz_v1 c
  ON c.programme_id=e.programme_id;

COMMENT ON VIEW public.program_detail_nz_v1 IS
  'Service-role NZ Phase 4 programme detail with source provenance, NZQCF metadata, international/Code/visa context and reviewed career relations.';

REVOKE ALL ON public.program_detail_nz_v1 FROM public,anon,authenticated;
GRANT SELECT ON public.program_detail_nz_v1 TO service_role;

CREATE OR REPLACE VIEW public.program_compare_nz_v1
WITH (security_invoker=true) AS
SELECT
  programme_id,
  institution_id,
  institution_slug,
  institution_name,
  canonical_title,
  qualification_name,
  degree_level,
  nzqcf_level,
  nzqcf_credits,
  programme_type,
  field_name,
  default_duration_months,
  study_mode,
  verification_tier,
  publication_status,
  indexable,
  international_students_eligible,
  code_signatory_status,
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
FROM public.program_explorer_nz_v1;

COMMENT ON VIEW public.program_compare_nz_v1 IS
  'Service-role NZ Phase 4 comparison projection. Qualification metadata remains source-backed; programme city/campus remain null rather than inferred from institution geography.';

REVOKE ALL ON public.program_compare_nz_v1 FROM public,anon,authenticated;
GRANT SELECT ON public.program_compare_nz_v1 TO service_role;

DO $$
DECLARE
  relation_count integer;
  relation_career_count integer;
  explorer_count integer;
  detail_count integer;
  compare_count integer;
  indexable_count integer;
  city_link_count integer;
  open_count integer;
  schedule_unknown_count integer;
  nz_profile_count integer;
  non_target_relation_count integer;
BEGIN
  SELECT count(*),count(DISTINCT canonical_career_id)
  INTO relation_count,relation_career_count
  FROM public.program_occupation_canonical_nz_v1;

  IF relation_count<>39 OR relation_career_count<>35 THEN
    RAISE EXCEPTION 'Expected 39 canonical NZ programme-career relations across 35 careers; found % / %',relation_count,relation_career_count;
  END IF;

  SELECT
    count(*),
    count(*) FILTER (WHERE indexable),
    count(*) FILTER (WHERE campus_id IS NOT NULL OR city_slug IS NOT NULL),
    count(*) FILTER (WHERE canonical_admission_state='open'),
    count(*) FILTER (WHERE canonical_admission_state='eligible_schedule_unknown')
  INTO explorer_count,indexable_count,city_link_count,open_count,schedule_unknown_count
  FROM public.program_explorer_nz_v1;

  IF explorer_count<>24 OR indexable_count<>24 THEN
    RAISE EXCEPTION 'Expected NZ explorer 24 Tier A/indexable rows; found % / %',explorer_count,indexable_count;
  END IF;

  IF city_link_count<>0 THEN
    RAISE EXCEPTION 'NZ Phase 4 invariant failed: % programme city/campus links were created without programme-level delivery evidence',city_link_count;
  END IF;

  IF open_count<>6 OR schedule_unknown_count<>18 THEN
    RAISE EXCEPTION 'Expected NZ admission state open 6 / schedule unknown 18; found % / %',open_count,schedule_unknown_count;
  END IF;

  SELECT count(*) INTO detail_count FROM public.program_detail_nz_v1;
  SELECT count(*) INTO compare_count FROM public.program_compare_nz_v1;

  IF detail_count<>24 OR compare_count<>24 THEN
    RAISE EXCEPTION 'Expected 24 NZ detail / compare rows; found % / %',detail_count,compare_count;
  END IF;

  SELECT count(*) INTO nz_profile_count
  FROM public.country_occupation_profiles
  WHERE country_code='NZ';

  IF nz_profile_count<>0 THEN
    RAISE NOTICE 'NZ country_occupation_profiles now has % rows; shared profile links may be materialized later without changing canonical programme identity',nz_profile_count;
  END IF;

  SELECT count(*) INTO non_target_relation_count
  FROM public.program_occupation_canonical_nz_v1 r
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.program_occupation_match_rules m
    WHERE m.country_code='CA'
      AND m.review_status='approved'
      AND m.canonical_career_id=r.canonical_career_id
  );

  IF non_target_relation_count>0 THEN
    RAISE EXCEPTION 'NZ Phase 4 invariant failed: % canonical relations fall outside the canonical 80-career target set',non_target_relation_count;
  END IF;
END $$;
