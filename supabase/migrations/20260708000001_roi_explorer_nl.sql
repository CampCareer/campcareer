BEGIN;

DROP MATERIALIZED VIEW IF EXISTS roi_explorer_nl;

CREATE MATERIALIZED VIEW roi_explorer_nl AS
SELECT
  c.id::TEXT                                          AS college_id,
  c.name                                              AS college_name,
  c.province                                          AS college_state,
  c.city                                              AS college_city,
  'public'                                            AS school_type,
  COALESCE(c.tuition, 15000)                          AS tuition,
  COALESCE(c.graduation_rate, 0.82)                   AS graduation_rate,
  COALESCE(c.median_earnings, 48000)                  AS median_earnings,
  NULL::TEXT                                          AS field_name,
  NULL::INT                                           AS nfq_level,
  NULL::NUMERIC                                       AS employment_rate,
  ci.rent_median::INT                                 AS rent_median,
  ci.cost_of_living_index::INT                        AS cost_of_living_index,
  NULL::INT                                           AS median_household_income,
  3                                                   AS duration_years,
  0                                                   AS course_count,
  NULL::NUMERIC                                       AS avg_cao_points,
  NULL::NUMERIC                                       AS min_cao_points,
  NULL::NUMERIC                                       AS max_cao_points,
  -- net_salary = median_earnings - student_rent_share * 12 * (1 + living_cost_multiplier)
  ROUND(COALESCE(c.median_earnings, 48000) - COALESCE(ci.rent_median, 1000) * 0.45 * 12 * 1.4)::INT AS net_salary,
  -- roi_score = net_salary * graduation_rate / (tuition * 3) * 100
  CASE
    WHEN COALESCE(c.tuition, 15000) > 0 AND COALESCE(c.median_earnings, 48000) > 0
    THEN ROUND((COALESCE(c.median_earnings, 48000) - COALESCE(ci.rent_median, 1000) * 0.45 * 12 * 1.4) * COALESCE(c.graduation_rate, 0.82) / (COALESCE(c.tuition, 15000) * 3) * 100, 1)
    ELSE 0
  END::NUMERIC                                        AS roi_score,
  -- payback_years = tuition * 3 / net_salary
  CASE
    WHEN (COALESCE(c.median_earnings, 48000) - COALESCE(ci.rent_median, 1000) * 0.45 * 12 * 1.4) > 0
    THEN ROUND(COALESCE(c.tuition, 15000) * 3.0 / (COALESCE(c.median_earnings, 48000) - COALESCE(ci.rent_median, 1000) * 0.45 * 12 * 1.4), 1)
    ELSE 0
  END::NUMERIC                                        AS payback_years
FROM colleges_nl c
LEFT JOIN (
  SELECT
    LOWER(name) AS city_name,
    MAX(rent_median) AS rent_median,
    MAX(cost_of_living_index) AS cost_of_living_index
  FROM nl_cities
  GROUP BY LOWER(name)
) ci ON LOWER(c.city) = ci.city_name;

CREATE UNIQUE INDEX IF NOT EXISTS idx_roi_explorer_nl_college ON roi_explorer_nl(college_id);

COMMENT ON MATERIALIZED VIEW roi_explorer_nl IS 'NL institution-level ROI data';

COMMIT;
