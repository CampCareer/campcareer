BEGIN;

CREATE TABLE IF NOT EXISTS public.occupation_state_ca (
  id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  noc_code          TEXT        NOT NULL REFERENCES public.occupations_ca(noc_code) ON DELETE CASCADE,
  province          TEXT        NOT NULL,
  median_wage_cad   NUMERIC,
  low_wage_cad      NUMERIC,
  high_wage_cad     NUMERIC,
  shortage_rating   NUMERIC,
  data_source       TEXT,
  UNIQUE (noc_code, province)
);

CREATE INDEX IF NOT EXISTS idx_occupation_state_ca_province ON public.occupation_state_ca(province);
CREATE INDEX IF NOT EXISTS idx_occupation_state_ca_noc_code ON public.occupation_state_ca(noc_code);

COMMENT ON TABLE  public.occupation_state_ca IS 'Canadian NOC 2021 occupation wage/shortage data by province/territory';
COMMENT ON COLUMN public.occupation_state_ca.median_wage_cad IS 'Median annual salary in CAD for this province';
COMMENT ON COLUMN public.occupation_state_ca.shortage_rating IS 'Provincial shortage rating 1-5';

COMMIT;
