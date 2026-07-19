-- Keep the existing ownership model while avoiding per-row auth lookups on
-- Dashboard's latest-assessment query. The table remains RLS-protected.
BEGIN;

DROP POLICY IF EXISTS "assessments_insert" ON public.assessments;
DROP POLICY IF EXISTS "assessments_select_own" ON public.assessments;
DROP POLICY IF EXISTS "assessments_claim_own" ON public.assessments;

CREATE POLICY "assessments_insert"
  ON public.assessments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (user_id IS NULL OR user_id = (SELECT auth.uid()));

CREATE POLICY "assessments_select_own"
  ON public.assessments
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "assessments_claim_own"
  ON public.assessments
  FOR UPDATE
  TO authenticated
  USING (user_id IS NULL)
  WITH CHECK (user_id = (SELECT auth.uid()));

COMMIT;
