-- Migration: Create saved_universities table for bookmarking universities
-- from the map page's university info card.
--
-- Columns:
--   user_id    — auth.users id (owner)
--   univ_slug   — URL slug for the university (e.g. "harvard-university")
--   univ_name  — human-readable university name
--   created_at — auto-set on insert
--
-- RLS: Each user can manage only their own rows (ALL policy).

BEGIN;

CREATE TABLE IF NOT EXISTS public.saved_universities (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id    UUID         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  univ_slug  TEXT         NOT NULL,
  univ_name  TEXT         NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Unique constraint: one save per user + university slug
ALTER TABLE public.saved_universities
  ADD CONSTRAINT saved_universities_user_slug_unique
  UNIQUE (user_id, univ_slug);

DO $$
DECLARE pol_name text;
BEGIN
  FOR pol_name IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'saved_universities'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.saved_universities', pol_name);
  END LOOP;
END$$;

CREATE POLICY "users_manage_own_saved_universities"
  ON public.saved_universities
  FOR ALL
  USING      (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

COMMIT;
