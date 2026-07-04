BEGIN;

-- Add COPS projection columns to occupations_ca
ALTER TABLE occupations_ca
  ADD COLUMN IF NOT EXISTS cops_future_outlook text,
  ADD COLUMN IF NOT EXISTS cops_recent_outlook text,
  ADD COLUMN IF NOT EXISTS projected_job_openings bigint,
  ADD COLUMN IF NOT EXISTS projected_job_seekers bigint,
  ADD COLUMN IF NOT EXISTS employment_growth bigint;

COMMENT ON COLUMN occupations_ca.cops_future_outlook IS 'COPS 2024-2033 projected labour market condition (e.g. Strong risk of Shortage, Balance, Moderate risk of Surplus)';
COMMENT ON COLUMN occupations_ca.cops_recent_outlook IS 'COPS 2021-2023 recent labour market condition';
COMMENT ON COLUMN occupations_ca.projected_job_openings IS 'COPS total projected job openings 2024-2033 (expansion + replacement)';
COMMENT ON COLUMN occupations_ca.projected_job_seekers IS 'COPS total projected job seekers 2024-2033';
COMMENT ON COLUMN occupations_ca.employment_growth IS 'COPS projected employment growth (expansion demand) 2024-2033';

COMMIT;
