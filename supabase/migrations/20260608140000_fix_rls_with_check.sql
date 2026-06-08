-- Migration: Add explicit WITH CHECK to RLS policies on user-owned tables
--
-- Problem: user_preferences, saved_courses, and user_checklist_progress each
-- have a single ALL policy with a USING clause but no WITH CHECK clause.
-- Without WITH CHECK, Postgres allows inserts/updates that the USING filter
-- would hide (policy is technically permissive on write).
--
-- Fix: For each table, drop all existing policies via a DO block (so we do not
-- need to hard-code the policy names), then recreate a single ALL policy with
-- both USING and WITH CHECK set to the same owner predicate.
--
-- Tables NOT touched by this migration:
--   checklist_cache         — public read, no user ownership required
--   user_career_paths       — already has WITH CHECK
--   user_timeline           — has separate insert/select/update policies
--
-- This migration is wrapped in a transaction; if any step fails the whole
-- migration is rolled back so no policies are left in a broken state.

BEGIN;

-- ── user_preferences ─────────────────────────────────────────────────────────
-- Owner column: id (matches auth.uid())
DO $$
DECLARE pol_name text;
BEGIN
  FOR pol_name IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'user_preferences'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.user_preferences', pol_name);
  END LOOP;
END$$;

CREATE POLICY "users_manage_own_preferences"
  ON public.user_preferences
  FOR ALL
  USING      (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ── saved_courses ─────────────────────────────────────────────────────────────
-- Owner column: user_id
DO $$
DECLARE pol_name text;
BEGIN
  FOR pol_name IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'saved_courses'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.saved_courses', pol_name);
  END LOOP;
END$$;

CREATE POLICY "users_manage_own_saved_courses"
  ON public.saved_courses
  FOR ALL
  USING      (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── user_checklist_progress ───────────────────────────────────────────────────
-- Owner column: user_id
DO $$
DECLARE pol_name text;
BEGIN
  FOR pol_name IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'user_checklist_progress'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.user_checklist_progress', pol_name);
  END LOOP;
END$$;

CREATE POLICY "users_manage_own_checklist_progress"
  ON public.user_checklist_progress
  FOR ALL
  USING      (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

COMMIT;
