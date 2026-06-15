-- Migration: link degree-risk assessments to authenticated accounts
--
-- assessments were anonymous-only (anon INSERT, no SELECT). This adds an
-- OPTIONAL user_id so a signed-in user's past checks can be listed on their
-- home hub, while keeping the public value-first funnel (anonymous quiz) intact:
--   * anonymous INSERT still works (user_id stays NULL)
--   * a logged-in user may SELECT only their own rows (user_id = auth.uid())
--   * a logged-in user may CLAIM a still-anonymous row (user_id IS NULL) by
--     setting user_id = auth.uid() — used to attach the pre-login quiz result to
--     the account right after sign-in. They can never reassign someone else's row.
--
-- REVIEW BEFORE RUNNING. Wrapped in a transaction; safe to re-run (idempotent).

BEGIN;

ALTER TABLE public.assessments
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS assessments_user_id_idx ON public.assessments (user_id);

ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Drop any pre-existing policies (idempotent re-run) without hard-coding names.
DO $$
DECLARE pol_name text;
BEGIN
  FOR pol_name IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'assessments'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.assessments', pol_name);
  END LOOP;
END$$;

-- Anyone (anon or authenticated) may create an assessment. Anonymous inserts
-- leave user_id NULL; a logged-in user may stamp their own id at insert time.
CREATE POLICY "assessments_insert"
  ON public.assessments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());

-- A user may read only their own linked assessments.
CREATE POLICY "assessments_select_own"
  ON public.assessments
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Claim: a logged-in user may attach a still-anonymous assessment to their
-- account (the quiz they completed just before signing in). NULL -> own id only.
CREATE POLICY "assessments_claim_own"
  ON public.assessments
  FOR UPDATE
  TO authenticated
  USING (user_id IS NULL)
  WITH CHECK (user_id = auth.uid());

COMMIT;
