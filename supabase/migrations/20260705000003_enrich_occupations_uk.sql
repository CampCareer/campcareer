BEGIN;

-- Add mean, Q1, Q3, employment columns to occupations_uk
ALTER TABLE public.occupations_uk
  ADD COLUMN IF NOT EXISTS mean_salary_gbp    NUMERIC,
  ADD COLUMN IF NOT EXISTS q1_salary_gbp      NUMERIC,
  ADD COLUMN IF NOT EXISTS q3_salary_gbp      NUMERIC,
  ADD COLUMN IF NOT EXISTS employment_thousands NUMERIC;

COMMENT ON COLUMN public.occupations_uk.mean_salary_gbp IS 'Mean (average) annual salary in GBP (UK-wide)';
COMMENT ON COLUMN public.occupations_uk.q1_salary_gbp IS '25th percentile annual salary in GBP (Q1 / lower quartile)';
COMMENT ON COLUMN public.occupations_uk.q3_salary_gbp IS '75th percentile annual salary in GBP (Q3 / upper quartile)';
COMMENT ON COLUMN public.occupations_uk.employment_thousands IS 'Number of jobs in thousands (UK-wide)';

-- Same columns for regional table
ALTER TABLE public.occupation_state_uk
  ADD COLUMN IF NOT EXISTS mean_salary_gbp     NUMERIC,
  ADD COLUMN IF NOT EXISTS q1_salary_gbp       NUMERIC,
  ADD COLUMN IF NOT EXISTS q3_salary_gbp       NUMERIC,
  ADD COLUMN IF NOT EXISTS employment_thousands  NUMERIC;

COMMENT ON COLUMN public.occupation_state_uk.mean_salary_gbp IS 'Mean annual salary in GBP for this region';
COMMENT ON COLUMN public.occupation_state_uk.q1_salary_gbp IS '25th percentile annual salary in GBP for this region';
COMMENT ON COLUMN public.occupation_state_uk.q3_salary_gbp IS '75th percentile annual salary in GBP for this region';
COMMENT ON COLUMN public.occupation_state_uk.employment_thousands IS 'Number of jobs in thousands for this region';

COMMIT;
