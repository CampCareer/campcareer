-- ============================================================================
-- Degree Risk — Add earnings distribution & median debt to public.majors
-- Date: 30 June 2026
--
-- Columns:
--   earnings_p25   int  — 25th percentile earnings 4 years post-graduation
--                          (College Scorecard EARN_P25_4YR_NAT)
--   earnings_p75   int  — 75th percentile earnings 4 years post-graduation
--                          (College Scorecard EARN_P75_4YR_NAT)
--   median_debt    int  — Median debt among completers
--                          (College Scorecard DEBT_ALL_PP_ANY_MDN)
-- ============================================================================

ALTER TABLE public.majors
  ADD COLUMN IF NOT EXISTS earnings_p25 int,
  ADD COLUMN IF NOT EXISTS earnings_p75 int,
  ADD COLUMN IF NOT EXISTS median_debt int;

COMMENT ON COLUMN public.majors.earnings_p25 IS
  '25th percentile earnings 4 years post-graduation (College Scorecard EARN_P25_4YR_NAT)';
COMMENT ON COLUMN public.majors.earnings_p75 IS
  '75th percentile earnings 4 years post-graduation (College Scorecard EARN_P75_4YR_NAT)';
COMMENT ON COLUMN public.majors.median_debt IS
  'Median debt among completers (College Scorecard DEBT_ALL_PP_ANY_MDN)';
