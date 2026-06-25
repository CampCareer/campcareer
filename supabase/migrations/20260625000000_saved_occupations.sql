-- Migration: Create saved_occupations table for bookmarking occupations
-- from the map page's occupation detail panel.
--
-- Columns:
--   user_id    — auth.users id (owner)
--   occ_code   — ANZSCO (AU) or SOC (US) occupation code
--   occ_title  — human-readable occupation name
--   country    — "AU" or "US"
--   created_at — auto-set on insert
--
-- RLS: Each user can manage only their own rows (ALL policy).

BEGIN;

CREATE TABLE IF NOT EXISTS public.saved_occupations (
  id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id   UUID         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  occ_code  TEXT         NOT NULL,
  occ_title TEXT         NOT NULL DEFAULT '',
  country   TEXT         NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Unique constraint: one save per user + occupation code
ALTER TABLE public.saved_occupations
  ADD CONSTRAINT saved_occupations_user_occ_unique
  UNIQUE (user_id, occ_code);

DO $$
DECLARE pol_name text;
BEGIN
  FOR pol_name IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'saved_occupations'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.saved_occupations', pol_name);
  END LOOP;
END$$;

CREATE POLICY "users_manage_own_saved_occupations"
  ON public.saved_occupations
  FOR ALL
  USING      (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

COMMIT;
