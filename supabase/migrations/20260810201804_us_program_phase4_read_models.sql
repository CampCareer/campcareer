-- United States Programs Phase 4 server-only read models.
-- These views canonicalize verified programme identity without making a Phase 5 public-release decision.
-- Programme-specific international eligibility remains unresolved; therefore all Phase 4 explorer rows are review_ready and non-indexable.

CREATE OR REPLACE VIEW public.program_occupation_canonical_us_v1
WITH (security_invoker = true) AS
SELECT
  c.programme_id,
  c.institution_id,
  c.institution_slug,
  c.institution_name,
  c.source_name,
  c.source_program_key,
  o.canonical_career_id,
  o.relation_type AS source_relation_type,
  CASE
    WHEN o.relation_type = 'direct' THEN 'direct'
    ELSE 'related'
  END AS normalized_relation_type,
  o.match_basis,
  o.match_pattern,
  o.rule_version,
  o.source_checked_at,
  o.reviewed_at,
  o.reviewer_note
FROM public.program_catalog_canonical_us_v1 c
JOIN public.program_catalog_us_staging p
  ON p.source_name = c.source_name
 AND p.source_program_key = c.source_program_key
JOIN public.program_occupation_us_staging o
  ON o.program_catalog_id = p.id
WHERE o.review_status = 'approved'
  AND p.verification_tier = 'A'
  AND p.collection_status = 'phase3_verified_current_program';

CREATE OR REPLACE VIEW public.program_explorer_us_v1
WITH (security_invoker = true) AS
SELECT
  c.programme_id,
  c.institution_id,
  c.institution_slug,
  c.institution_name,
  c.unitid,
  c.canonical_title,
  c.credential_name,
  c.award_level,
  c.programme_type,
  c.field_name,
  c.default_duration_months,
  c.study_mode,
  c.credit_units,
  c.credit_unit_type,
  c.cip_code,
  c.cip_evidence_status,
  c.verification_tier,
  'review_ready'::text AS publication_status,
  false AS indexable,
  'programme_specific_international_eligibility_unresolved'::text AS release_gate_reason,
  c.international_students_eligible,
  c.sevp_status,
  c.canonical_admission_state,
  c.intake_label,
  c.intake_start_date,
  c.application_deadline,
  c.exact_cip_verified_for_stem,
  c.stem_designated_cip,
  c.stem_list_version,
  c.stem_list_checked_at,
  c.enrolment_status,
  c.offering_verification_status,
  c.offering_market,
  NULL::uuid AS campus_id,
  NULL::text AS city_slug,
  NULL::text AS city_name,
  COALESCE((
    SELECT array_agg(DISTINCT r.canonical_career_id ORDER BY r.canonical_career_id)
    FROM public.program_occupation_canonical_us_v1 r
    WHERE r.programme_id = c.programme_id
  ), ARRAY[]::text[]) AS canonical_career_ids,
  c.official_program_url
FROM public.program_catalog_canonical_us_v1 c
WHERE c.verification_tier = 'A';

CREATE OR REPLACE VIEW public.program_detail_us_v1
WITH (security_invoker = true) AS
SELECT
  e.programme_id,
  e.institution_id,
  e.institution_slug,
  e.institution_name,
  e.unitid,
  e.canonical_title,
  e.credential_name,
  e.award_level,
  e.programme_type,
  e.field_name,
  e.default_duration_months,
  e.study_mode,
  e.credit_units,
  e.credit_unit_type,
  e.cip_code,
  e.cip_evidence_status,
  e.verification_tier,
  e.publication_status,
  e.indexable,
  e.release_gate_reason,
  e.international_students_eligible,
  e.sevp_status,
  e.canonical_admission_state,
  e.intake_label,
  e.intake_start_date,
  e.application_deadline,
  e.exact_cip_verified_for_stem,
  e.stem_designated_cip,
  e.stem_list_version,
  e.stem_list_checked_at,
  e.enrolment_status,
  e.offering_verification_status,
  e.offering_market,
  e.campus_id,
  e.city_slug,
  e.city_name,
  e.canonical_career_ids,
  e.official_program_url,
  c.source_name,
  c.source_program_key,
  c.source_program_name,
  c.cip_source_url,
  c.institutional_accreditation_context,
  c.programmatic_accreditation_context,
  c.accreditation_source_url,
  c.official_catalog_url,
  c.source_as_of,
  c.collection_status,
  c.programme_delivery_verified,
  c.programme_delivery_source_url,
  c.international_admission_status,
  c.sevp_school_name,
  c.sevp_campus_context,
  c.sevp_source_url,
  c.student_visa_category_context,
  c.student_visa_context,
  c.visa_source_url,
  c.stem_list_source_url,
  c.opt_context,
  c.stem_opt_context,
  c.admission_source_url,
  c.international_source_url,
  c.international_verification_status,
  c.international_source_checked_at,
  c.verified_at,
  COALESCE((
    SELECT jsonb_agg(
      jsonb_build_object(
        'careerId', r.canonical_career_id,
        'relationType', r.normalized_relation_type,
        'sourceRelationType', r.source_relation_type,
        'matchBasis', r.match_basis,
        'sourceCheckedAt', r.source_checked_at,
        'reviewerNote', r.reviewer_note
      )
      ORDER BY r.canonical_career_id, r.source_relation_type
    )
    FROM public.program_occupation_canonical_us_v1 r
    WHERE r.programme_id = e.programme_id
  ), '[]'::jsonb) AS occupation_relations
FROM public.program_explorer_us_v1 e
JOIN public.program_catalog_canonical_us_v1 c ON c.programme_id = e.programme_id;

CREATE OR REPLACE VIEW public.program_compare_us_v1
WITH (security_invoker = true) AS
SELECT
  programme_id,
  institution_id,
  institution_slug,
  institution_name,
  unitid,
  canonical_title,
  credential_name,
  award_level,
  programme_type,
  field_name,
  default_duration_months,
  study_mode,
  credit_units,
  credit_unit_type,
  cip_code,
  cip_evidence_status,
  verification_tier,
  publication_status,
  indexable,
  release_gate_reason,
  international_students_eligible,
  sevp_status,
  canonical_admission_state,
  intake_label,
  intake_start_date,
  application_deadline,
  exact_cip_verified_for_stem,
  stem_designated_cip,
  stem_list_version,
  stem_list_checked_at,
  enrolment_status,
  offering_verification_status,
  offering_market,
  campus_id,
  city_slug,
  city_name,
  canonical_career_ids,
  official_program_url
FROM public.program_explorer_us_v1;

REVOKE ALL ON public.program_occupation_canonical_us_v1 FROM public, anon, authenticated;
REVOKE ALL ON public.program_explorer_us_v1 FROM public, anon, authenticated;
REVOKE ALL ON public.program_detail_us_v1 FROM public, anon, authenticated;
REVOKE ALL ON public.program_compare_us_v1 FROM public, anon, authenticated;

GRANT SELECT ON public.program_occupation_canonical_us_v1 TO service_role;
GRANT SELECT ON public.program_explorer_us_v1 TO service_role;
GRANT SELECT ON public.program_detail_us_v1 TO service_role;
GRANT SELECT ON public.program_compare_us_v1 TO service_role;

DO $$
DECLARE
  relation_count integer;
  career_count integer;
  explorer_count integer;
  detail_count integer;
  compare_count integer;
  indexable_count integer;
  review_ready_count integer;
  international_positive_count integer;
  schedule_unknown_count integer;
  stem_positive_count integer;
  exact_cip_stem_unresolved_count integer;
  campus_link_count integer;
  outside_target_count integer;
  occupation_profile_count integer;
BEGIN
  SELECT count(*), count(DISTINCT canonical_career_id)
    INTO relation_count, career_count
  FROM public.program_occupation_canonical_us_v1;

  SELECT count(*),
         count(*) FILTER (WHERE indexable IS TRUE),
         count(*) FILTER (WHERE publication_status = 'review_ready'),
         count(*) FILTER (WHERE international_students_eligible IS TRUE),
         count(*) FILTER (WHERE canonical_admission_state = 'eligible_schedule_unknown'),
         count(*) FILTER (WHERE stem_designated_cip IS TRUE),
         count(*) FILTER (WHERE exact_cip_verified_for_stem IS TRUE AND stem_designated_cip IS NULL),
         count(*) FILTER (WHERE campus_id IS NOT NULL OR city_slug IS NOT NULL OR city_name IS NOT NULL)
    INTO explorer_count, indexable_count, review_ready_count, international_positive_count,
         schedule_unknown_count, stem_positive_count, exact_cip_stem_unresolved_count, campus_link_count
  FROM public.program_explorer_us_v1;

  SELECT count(*) INTO detail_count FROM public.program_detail_us_v1;
  SELECT count(*) INTO compare_count FROM public.program_compare_us_v1;

  SELECT count(*) INTO outside_target_count
  FROM public.program_occupation_canonical_us_v1 o
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.program_occupation_match_rules r
    WHERE r.country_code = 'CA'
      AND r.rule_version = 'v1'
      AND r.review_status = 'approved'
      AND r.canonical_career_id = o.canonical_career_id
  );

  SELECT count(*) INTO occupation_profile_count
  FROM public.country_occupation_profiles
  WHERE country_code = 'US';

  IF relation_count <> 65 OR career_count <> 42 OR outside_target_count <> 0 THEN
    RAISE EXCEPTION 'US Phase 4 relation invariant failed: % relations / % careers / % outside target 80', relation_count, career_count, outside_target_count;
  END IF;
  IF explorer_count <> 24 OR detail_count <> 24 OR compare_count <> 24 THEN
    RAISE EXCEPTION 'US Phase 4 read-model invariant failed: explorer % / detail % / compare %', explorer_count, detail_count, compare_count;
  END IF;
  IF indexable_count <> 0 OR review_ready_count <> 24 THEN
    RAISE EXCEPTION 'US Phase 4 release gate failed: expected 0 indexable / 24 review_ready; got % / %', indexable_count, review_ready_count;
  END IF;
  IF international_positive_count <> 0 OR schedule_unknown_count <> 24 THEN
    RAISE EXCEPTION 'US Phase 4 international boundary failed: expected 0 programme-level positive / 24 schedule unknown; got % / %', international_positive_count, schedule_unknown_count;
  END IF;
  IF stem_positive_count <> 4 OR exact_cip_stem_unresolved_count <> 2 THEN
    RAISE EXCEPTION 'US Phase 4 STEM invariant failed: expected 4 positive / 2 exact-CIP unresolved; got % / %', stem_positive_count, exact_cip_stem_unresolved_count;
  END IF;
  IF campus_link_count <> 0 THEN
    RAISE EXCEPTION 'US Phase 4 must not expose inferred programme location; found % read-model links', campus_link_count;
  END IF;
  IF occupation_profile_count <> 0 THEN
    RAISE EXCEPTION 'US Phase 4 must not fabricate country occupation profiles; found %', occupation_profile_count;
  END IF;
END $$;
