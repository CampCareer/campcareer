BEGIN;

-- UK SOC 2020 occupation wage/shortage data
CREATE TABLE IF NOT EXISTS public.occupations_uk (
  id                 BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  soc_code           TEXT         NOT NULL UNIQUE,
  occupation_en      TEXT         NOT NULL,
  occupation_ko      TEXT,
  median_salary_gbp  NUMERIC,
  on_sol             BOOLEAN     DEFAULT FALSE,
  on_isl             BOOLEAN     DEFAULT FALSE,
  confidence         TEXT         DEFAULT 'estimate',
  related_broad_field TEXT,
  source_name        TEXT,
  source_url         TEXT,
  last_verified      TIMESTAMPTZ  DEFAULT now()
);

COMMENT ON TABLE  public.occupations_uk IS 'UK SOC 2020 occupation data from ONS ASHE / Home Office SOL (2025)';
COMMENT ON COLUMN public.occupations_uk.soc_code IS 'SOC 2020 4-digit unit group code';
COMMENT ON COLUMN public.occupations_uk.median_salary_gbp IS 'Median annual salary in GBP (UK-wide)';
COMMENT ON COLUMN public.occupations_uk.on_sol IS 'On the national Shortage Occupation List';
COMMENT ON COLUMN public.occupations_uk.on_isl IS 'On the Immigration Salary List (replaced SOL for skilled worker visa)';

COMMIT;
