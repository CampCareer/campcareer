BEGIN;

CREATE TABLE IF NOT EXISTS public.occupations_ca (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  noc_code        TEXT         NOT NULL UNIQUE,
  occupation_en   TEXT         NOT NULL,
  occupation_ko   TEXT,
  median_salary_cad NUMERIC,
  low_wage_cad    NUMERIC,
  high_wage_cad   NUMERIC,
  average_wage_cad NUMERIC,
  q1_wage_cad     NUMERIC,
  q3_wage_cad     NUMERIC,
  shortage_rating NUMERIC,
  on_teer_eligible BOOLEAN DEFAULT FALSE,
  related_broad_field TEXT,
  confidence      TEXT         DEFAULT 'estimate',
  data_source     TEXT,
  last_verified   TIMESTAMPTZ  DEFAULT now()
);

COMMENT ON TABLE  public.occupations_ca IS 'Canadian NOC 2021 occupation wage data from ESDC Job Bank (2024)';
COMMENT ON COLUMN public.occupations_ca.noc_code IS 'NOC 2021 5-digit unit group code';
COMMENT ON COLUMN public.occupations_ca.median_salary_cad IS 'Median annual salary in CAD (hourly × 2080 for LFS data)';

COMMIT;
