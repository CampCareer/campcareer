-- au_major_signals: aggregated labour-market & cost signals per STUDY_CONCEPT
-- Populated by scripts/seed-au-major-signals.ts
-- Used by /au/majors decision tool

CREATE TABLE public.au_major_signals (
  concept_id text NOT NULL,
  country text NOT NULL DEFAULT 'AU',

  -- Shortage signals (from JSA OSL 2025)
  shortage_national_pct numeric(5,2),    -- % of mapped occupations with national shortage (S)
  shortage_states_affected int,          -- count of states/territories with shortage (S or M)
  on_csol_pct numeric(5,2),             -- % of mapped occupations on Home Affairs CSOL

  -- Employment outlook (from JSA Employment Projections)
  outlook_2030_change_pct numeric(7,2), -- avg % employment change 2025→2030
  outlook_2035_change_pct numeric(7,2), -- avg % employment change 2025→2035
  outlook_direction text,               -- "growing" | "stable" | "declining"

  -- Salary signals (from ABS 6306.0 + occupations_au.median_salary_aud)
  salary_min_aud int,                   -- lowest median salary among mapped occupations
  salary_max_aud int,                   -- highest median salary among mapped occupations
  salary_median_aud int,                -- median across mapped occupations

  -- Study cost (from courses_au CRICOS fees)
  cost_bachelor_median_aud int,         -- median annual intl tuition for Bachelor-level courses
  cost_diploma_median_aud int,          -- median annual intl tuition for Diploma-level courses
  cost_duration_years numeric(3,1),     -- typical study duration in years

  -- PR relevance (editorial + data hybrid)
  pr_score int,                         -- 0–100 composite score
  pr_note text,                         -- editorial PR pathway note

  -- AI exposure (editorial)
  ai_exposure_band text,                -- "low" | "medium" | "high"
  ai_note text,                         -- editorial AI impact note

  -- Occupation metadata
  occupation_count int,                 -- number of mapped occupations
  representative_occupations jsonb,     -- [{oscaCode, label, labelKo}]

  -- Data provenance
  data_sources jsonb,                   -- [{name, url}]
  last_verified date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  PRIMARY KEY (concept_id, country)
);

-- Index for listing all signals for a country (the main /au/majors query)
CREATE INDEX idx_au_major_signals_country ON public.au_major_signals (country);

COMMENT ON TABLE public.au_major_signals IS 'Aggregated labour-market, salary, outlook and cost signals per STUDY_CONCEPT for the AU majors decision tool.';

-- RLS: public read, authenticated write
ALTER TABLE public.au_major_signals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read au_major_signals"
  ON public.au_major_signals
  FOR SELECT
  USING (true);

CREATE POLICY "Service role write au_major_signals"
  ON public.au_major_signals
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
