-- Review-first storage for future country occupation imports. These records are
-- intentionally not readable by anonymous users until an application layer
-- publishes a qualified, reviewed occupation page.

BEGIN;

CREATE TABLE IF NOT EXISTS public.source_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL,
  category TEXT NOT NULL,
  source_url TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  retrieved_at TIMESTAMPTZ NOT NULL,
  summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (country_code, category, content_hash)
);

CREATE TABLE IF NOT EXISTS public.source_change_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL,
  category TEXT NOT NULL,
  previous_snapshot_id UUID REFERENCES public.source_snapshots(id) ON DELETE SET NULL,
  current_snapshot_id UUID REFERENCES public.source_snapshots(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'review-required' CHECK (status IN ('review-required', 'approved', 'rejected')),
  reviewer_note TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pilot_occupation_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL,
  source_code TEXT NOT NULL,
  isco_code TEXT,
  name_en TEXT NOT NULL,
  name_ko TEXT,
  local_name TEXT,
  median_salary NUMERIC,
  shortage_score NUMERIC,
  foreign_worker_pathway JSONB NOT NULL DEFAULT '{}'::jsonb,
  language_requirement JSONB NOT NULL DEFAULT '{}'::jsonb,
  job_quality JSONB NOT NULL DEFAULT '{}'::jsonb,
  source_ids UUID[] NOT NULL DEFAULT '{}',
  review_status TEXT NOT NULL DEFAULT 'review-required' CHECK (review_status IN ('review-required', 'approved', 'rejected')),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (country_code, source_code)
);

ALTER TABLE public.source_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_change_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pilot_occupation_reviews ENABLE ROW LEVEL SECURITY;

COMMIT;
