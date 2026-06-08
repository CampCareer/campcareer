-- Migration: Add field and updated_at columns to user_preferences
--
-- Context: The live database is missing these two columns even though earlier
-- migrations reference them.  This migration uses IF NOT EXISTS so it is safe
-- to run on any state of the database — idempotent.
--
-- user_preferences current live columns (as of 2026-06-08):
--   id, goal, budget, english, environment, recommended_country, completed_at
--
-- Missing columns added here:
--   field        — the field of study selected during onboarding
--   updated_at   — last time the row was written (set by app on every upsert)

ALTER TABLE public.user_preferences
  ADD COLUMN IF NOT EXISTS field      text,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
