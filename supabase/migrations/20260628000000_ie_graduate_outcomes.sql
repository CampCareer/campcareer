-- IE Graduate Outcomes data from CSO HEO06 (HEA Graduate Outcomes Survey)
-- First destination of graduates, 9 months post-graduation, Class of 2022
-- National-level aggregates by ISCED broad field + degree class

CREATE TABLE IF NOT EXISTS graduate_outcomes_ie (
  id                    BIGSERIAL PRIMARY KEY,
  isced_code            TEXT NOT NULL,            -- ISCED-F 2013 broad field code (01-10)
  field_name            TEXT NOT NULL,            -- English name (e.g. "ICT")
  graduation_year       INTEGER NOT NULL DEFAULT 2022,
  degree_class          TEXT,                     -- NULL for aggregate; H1/H21/H22/H3/Unknown
  total_graduates       INTEGER NOT NULL DEFAULT 0,
  employment_only       INTEGER NOT NULL DEFAULT 0,
  education_only        INTEGER NOT NULL DEFAULT 0,
  employment_and_education INTEGER NOT NULL DEFAULT 0,
  neither               INTEGER NOT NULL DEFAULT 0,
  not_captured          INTEGER NOT NULL DEFAULT 0,
  employment_rate_pct   NUMERIC(5,1),
  education_rate_pct    NUMERIC(5,1),
  unemployment_rate_pct NUMERIC(5,1),
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE graduate_outcomes_ie ADD CONSTRAINT go_ie_unique UNIQUE (isced_code, degree_class);
CREATE INDEX IF NOT EXISTS go_ie_field_idx ON graduate_outcomes_ie (field_name);

COMMENT ON TABLE graduate_outcomes_ie IS
  'CSO HEO06 – HEA Graduate Outcomes Survey (Class of 2022). National-level graduate outcomes 9 months post-graduation.';

-- Occupations in shortage (Critical Skills Occupations List)
-- Source: DETE Schedule 3, SI 444 of 2024 (effective 02 Sep 2024)

CREATE TABLE IF NOT EXISTS shortage_occupations_ie (
  id                BIGSERIAL PRIMARY KEY,
  soc_code          TEXT NOT NULL,             -- SOC 2010 3-digit or 4-digit code
  soc_level         TEXT NOT NULL,             -- SOC-3 or SOC-4
  category          TEXT NOT NULL,             -- Employment category name
  employments       TEXT[],                    -- Specific employments/skills within category
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE shortage_occupations_ie ADD CONSTRAINT so_ie_unique UNIQUE (soc_code);

COMMENT ON TABLE shortage_occupations_ie IS
  'Critical Skills Occupations List – DETE Schedule 3, SI 444/2024. Shortage occupations eligible for Critical Skills Employment Permit.';
