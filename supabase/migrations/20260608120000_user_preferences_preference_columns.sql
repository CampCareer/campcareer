-- Migration: Add planning preference columns to user_preferences
-- These columns are written during onboarding and read by dashboard / decision engine.
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS goal              text;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS budget            text;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS english           text;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS environment       text;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS recommended_country text;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS completed_at      timestamptz;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS updated_at        timestamptz DEFAULT now();

-- Optional decision-profile columns (add later when UI is ready)
-- ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS target_degree_level  text;
-- ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS citizenship_country  text;
-- ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS max_annual_tuition   integer;
-- ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS needs_pr_pathway     boolean DEFAULT false;
-- ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS needs_work_visa      boolean DEFAULT false;
