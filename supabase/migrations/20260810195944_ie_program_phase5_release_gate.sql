-- Ireland Programs Phase 5 release gate.
--
-- Ireland currently has canonical Tier B programme rows but zero Tier A rows.
-- Tier B means review-ready only: exact current TrustEd Ireland / ILEP
-- programme-level eligibility has not been matched. Phase 5 therefore records
-- an explicit server-only release decision instead of exposing programme routes.

CREATE OR REPLACE VIEW public.program_publication_gate_ie_v1
WITH (security_invoker=true) AS
WITH tier_counts AS (
  SELECT
    count(*) FILTER (WHERE verification_tier='A')::integer AS tier_a_count,
    count(*) FILTER (WHERE verification_tier='B')::integer AS tier_b_count,
    count(*) FILTER (WHERE verification_tier='C')::integer AS tier_c_count
  FROM public.program_catalog_ie_staging
),
publishable AS (
  SELECT count(*)::integer AS publishable_count
  FROM public.program_catalog_canonical_ie_v1 c
  WHERE c.verification_tier='A'
    AND c.eligible_programme_source_url IS NOT NULL
    AND c.international_students_eligible IS TRUE
    AND c.full_time_daytime_verified IS TRUE
    AND c.offering_verification_status='verified'
)
SELECT
  'IE'::text AS country_code,
  (p.publishable_count > 0) AS publication_ready,
  t.tier_a_count,
  t.tier_b_count,
  t.tier_c_count,
  p.publishable_count,
  CASE
    WHEN p.publishable_count > 0 THEN 'ready'
    ELSE 'exact_eligible_programme_evidence_required'
  END::text AS reason_code,
  (SELECT max(source_checked_at) FROM public.program_international_ie_staging) AS evidence_checked_through
FROM tier_counts t
CROSS JOIN publishable p;

COMMENT ON VIEW public.program_publication_gate_ie_v1 IS
  'Ireland Programs Phase 5 server-only release gate. Public publication requires Tier A exact eligible-programme evidence, positive international eligibility, verified full-time daytime study, and a verified canonical offering.';

REVOKE ALL ON public.program_publication_gate_ie_v1 FROM public, anon, authenticated;
GRANT SELECT ON public.program_publication_gate_ie_v1 TO service_role;

DO $$
DECLARE
  g record;
BEGIN
  SELECT * INTO g FROM public.program_publication_gate_ie_v1;

  IF g.country_code <> 'IE'
     OR g.publication_ready IS DISTINCT FROM false
     OR g.tier_a_count <> 0
     OR g.tier_b_count <> 28
     OR g.tier_c_count <> 12
     OR g.publishable_count <> 0
     OR g.reason_code <> 'exact_eligible_programme_evidence_required' THEN
    RAISE EXCEPTION 'IE Phase 5 release gate unexpected state: %', row_to_json(g);
  END IF;

  IF to_regclass('public.program_explorer_ie_v1') IS NOT NULL
     OR to_regclass('public.program_detail_ie_v1') IS NOT NULL
     OR to_regclass('public.program_compare_ie_v1') IS NOT NULL THEN
    RAISE EXCEPTION 'IE Phase 5 gate failed: public programme read models must remain absent while Tier A is zero';
  END IF;
END $$;
