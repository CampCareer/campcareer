-- United States Programs Phase 5 release gate.
-- Phase 4 canonicalized 24 verified programme identities, but programme-specific
-- international eligibility remains unresolved. Provider-level SEVP/F-1 context
-- is not sufficient to publish a programme as internationally available.

CREATE OR REPLACE VIEW public.program_publication_gate_us_v1
WITH (security_invoker=true) AS
WITH canonical_counts AS (
  SELECT
    count(*)::integer AS canonical_count,
    count(*) FILTER (WHERE verification_tier='A')::integer AS tier_a_count,
    count(*) FILTER (WHERE international_students_eligible IS TRUE)::integer AS programme_international_positive_count,
    count(*) FILTER (WHERE offering_market IN ('international','both'))::integer AS international_market_offering_count,
    count(*) FILTER (WHERE offering_verification_status='verified')::integer AS verified_offering_count,
    count(*) FILTER (WHERE campus_id IS NOT NULL)::integer AS campus_link_count
  FROM public.program_catalog_canonical_us_v1
),
publishable AS (
  SELECT count(*)::integer AS publishable_count
  FROM public.program_catalog_canonical_us_v1 c
  WHERE c.verification_tier='A'
    AND c.international_students_eligible IS TRUE
    AND c.offering_market IN ('international','both')
    AND c.offering_verification_status='verified'
)
SELECT
  'US'::text AS country_code,
  (p.publishable_count > 0) AS publication_ready,
  c.canonical_count,
  c.tier_a_count,
  c.programme_international_positive_count,
  c.international_market_offering_count,
  c.verified_offering_count,
  c.campus_link_count,
  p.publishable_count,
  CASE
    WHEN p.publishable_count > 0 THEN 'ready'
    ELSE 'programme_specific_international_eligibility_required'
  END::text AS reason_code,
  (SELECT max(international_source_checked_at) FROM public.program_catalog_canonical_us_v1) AS evidence_checked_through
FROM canonical_counts c
CROSS JOIN publishable p;

COMMENT ON VIEW public.program_publication_gate_us_v1 IS
  'US Programs Phase 5 server-only release gate. Provider-level SEVP/F-1 context does not establish programme-level international eligibility; public release requires positive programme eligibility and an international/both verified offering.';

REVOKE ALL ON public.program_publication_gate_us_v1 FROM public, anon, authenticated;
GRANT SELECT ON public.program_publication_gate_us_v1 TO service_role;

DO $$
DECLARE
  g record;
BEGIN
  SELECT * INTO g FROM public.program_publication_gate_us_v1;

  IF g.country_code <> 'US'
     OR g.publication_ready IS DISTINCT FROM false
     OR g.canonical_count <> 24
     OR g.tier_a_count <> 24
     OR g.programme_international_positive_count <> 0
     OR g.international_market_offering_count <> 0
     OR g.verified_offering_count <> 24
     OR g.campus_link_count <> 0
     OR g.publishable_count <> 0
     OR g.reason_code <> 'programme_specific_international_eligibility_required' THEN
    RAISE EXCEPTION 'US Phase 5 release gate unexpected state: %', row_to_json(g);
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.program_explorer_us_v1 WHERE indexable IS TRUE
  ) THEN
    RAISE EXCEPTION 'US Phase 5 gate failed: no US programme may become indexable while programme-level international eligibility is unresolved';
  END IF;
END $$;
