BEGIN;

CREATE TABLE IF NOT EXISTS public.occupation_state_uk (
  id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  soc_code          TEXT        NOT NULL REFERENCES public.occupations_uk(soc_code) ON DELETE CASCADE,
  region            TEXT        NOT NULL,
  median_salary_gbp NUMERIC,
  shortage_rating   NUMERIC,
  data_source       TEXT,
  UNIQUE (soc_code, region)
);

CREATE INDEX IF NOT EXISTS idx_occupation_state_uk_region    ON public.occupation_state_uk(region);
CREATE INDEX IF NOT EXISTS idx_occupation_state_uk_soc_code  ON public.occupation_state_uk(soc_code);

COMMENT ON TABLE  public.occupation_state_uk IS 'UK SOC 2020 occupation wage/shortage data by ITL1 region';
COMMENT ON COLUMN public.occupation_state_uk.region IS 'ITL1 region code (TLC-TLN)';
COMMENT ON COLUMN public.occupation_state_uk.median_salary_gbp IS 'Median annual salary in GBP for this region';
COMMENT ON COLUMN public.occupation_state_uk.shortage_rating IS 'Regional shortage rating 1-5';

COMMIT;
