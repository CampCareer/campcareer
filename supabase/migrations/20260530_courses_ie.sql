-- Migration: Create courses_ie table for Qualifax Level 8 course data
-- Run this in Supabase SQL Editor before executing upsert-courses-ie.ts

CREATE TABLE IF NOT EXISTS courses_ie (
  id              BIGSERIAL PRIMARY KEY,
  course_code     TEXT,
  title           TEXT        NOT NULL,
  nfq_level       SMALLINT    DEFAULT 8,
  course_type     TEXT,
  college_name    TEXT        NOT NULL,
  institution_id  TEXT,                          -- FK to colleges_ie (nullable for unmatched)
  city            TEXT,
  duration_years  NUMERIC(3,1),
  cao_points_2025 INTEGER,
  qualifax_url    TEXT        UNIQUE NOT NULL,
  synced_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS courses_ie_institution_id_idx ON courses_ie (institution_id);
CREATE INDEX IF NOT EXISTS courses_ie_cao_points_idx     ON courses_ie (cao_points_2025 DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS courses_ie_college_name_idx   ON courses_ie (college_name);
