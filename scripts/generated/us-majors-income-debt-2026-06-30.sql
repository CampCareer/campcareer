-- ================================================================
-- Migration: Add earnings_p25, earnings_p75, median_debt to majors
-- Also insert the 10 new US majors and populate income/debt fields
-- Run this in Supabase SQL editor (Dashboard > SQL Editor)
-- Safe to re-run (uses IF NOT EXISTS / ON CONFLICT DO NOTHING)
-- ================================================================

-- Step 1: Add columns (idempotent)
ALTER TABLE majors ADD COLUMN IF NOT EXISTS earnings_p25 int;
ALTER TABLE majors ADD COLUMN IF NOT EXISTS earnings_p75 int;
ALTER TABLE majors ADD COLUMN IF NOT EXISTS median_debt int;

-- Step 2: Insert 10 new US majors (idempotent via ON CONFLICT DO NOTHING)
INSERT INTO majors (slug, name, country, field_group, median_starting_salary, avg_annual_tuition_intl, employment_rate, employment_score, payback_years, overall_risk, data_confidence, last_verified)
VALUES
  ('mechanical-engineering','Mechanical Engineering','US','Engineering',71090,34402,96,95,6,'low','verified','2026-06-30'),
  ('electrical-engineering','Electrical Engineering','US','Engineering',78980,34242,95,94,5,'low','verified','2026-06-30'),
  ('biology','Biology','US','Science',31982,32955,91,90,12,'high','verified','2026-06-30'),
  ('finance','Finance','US','Business',59392,31306,96,95,6,'low','verified','2026-06-30'),
  ('marketing','Marketing','US','Business',47425,30783,96,95,8,'medium','verified','2026-06-30'),
  ('economics','Economics','US','Social Sciences',55168,36785,93,92,8,'medium','verified','2026-06-30'),
  ('mathematics','Mathematics','US','Science',51372,34056,91,90,8,'medium','verified','2026-06-30'),
  ('chemical-engineering','Chemical Engineering','US','Engineering',73628,38456,96,95,6,'low','verified','2026-06-30'),
  ('communications','Communications','US','Communications',36889,31922,95,94,10,'high','verified','2026-06-30'),
  ('political-science','Political Science','US','Social Sciences',38028,34872,92,91,11,'high','verified','2026-06-30')
ON CONFLICT (slug, country) DO NOTHING;

-- Step 3: Update earnings_p25, earnings_p75, median_debt for all 20 US majors
UPDATE majors SET
  earnings_p25 = 74830,  earnings_p75 = 152038, median_debt = 31017,
  layer_meta = layer_meta || '{"debt":{"confidence":"verified","last_verified":"2026-06-30","source_name":"College Scorecard Field of Study Data (06102026)","source_url":"https://collegescorecard.ed.gov/data/","note":{"en":"Median debt among completers (DEBT_ALL_PP_ANY_MDN). US national avg ≈ $30k.","ko":"졸업생 중위 부채 (DEBT_ALL_PP_ANY_MDN). 미국 평균 ≈ $30k."}}}'::jsonb
WHERE slug = 'computer-science' AND country = 'US';

UPDATE majors SET
  earnings_p25 = 74169,  earnings_p75 = 150326, median_debt = 31221,
  layer_meta = layer_meta || '{"debt":{"confidence":"verified","last_verified":"2026-06-30","source_name":"College Scorecard Field of Study Data (06102026)","source_url":"https://collegescorecard.ed.gov/data/","note":{"en":"Median debt among completers (DEBT_ALL_PP_ANY_MDN). US national avg ≈ $30k.","ko":"졸업생 중위 부채 (DEBT_ALL_PP_ANY_MDN). 미국 평균 ≈ $30k."}}}'::jsonb
WHERE slug = 'data-analytics' AND country = 'US';

UPDATE majors SET
  earnings_p25 = 79895,  earnings_p75 = 141943, median_debt = 32226,
  layer_meta = layer_meta || '{"debt":{"confidence":"verified","last_verified":"2026-06-30","source_name":"College Scorecard Field of Study Data (06102026)","source_url":"https://collegescorecard.ed.gov/data/","note":{"en":"Median debt among completers (DEBT_ALL_PP_ANY_MDN). US national avg ≈ $30k.","ko":"졸업생 중위 부채 (DEBT_ALL_PP_ANY_MDN). 미국 평균 ≈ $30k."}}}'::jsonb
WHERE slug = 'software-engineering' AND country = 'US';

UPDATE majors SET
  earnings_p25 = 67807,  earnings_p75 = 114393, median_debt = 20864,
  layer_meta = layer_meta || '{"debt":{"confidence":"verified","last_verified":"2026-06-30","source_name":"College Scorecard Field of Study Data (06102026)","source_url":"https://collegescorecard.ed.gov/data/","note":{"en":"Median debt among completers (DEBT_ALL_PP_ANY_MDN). US national avg ≈ $30k.","ko":"졸업생 중위 부채 (DEBT_ALL_PP_ANY_MDN). 미국 평균 ≈ $30k."}}}'::jsonb
WHERE slug = 'nursing' AND country = 'US';

UPDATE majors SET
  earnings_p25 = 73883,  earnings_p75 = 101174, median_debt = 35101,
  layer_meta = layer_meta || '{"debt":{"confidence":"verified","last_verified":"2026-06-30","source_name":"College Scorecard Field of Study Data (06102026)","source_url":"https://collegescorecard.ed.gov/data/","note":{"en":"Median debt among completers (DEBT_ALL_PP_ANY_MDN). US national avg ≈ $30k.","ko":"졸업생 중위 부채 (DEBT_ALL_PP_ANY_MDN). 미국 평균 ≈ $30k."}}}'::jsonb
WHERE slug = 'civil-engineering' AND country = 'US';

UPDATE majors SET
  earnings_p25 = 47762,  earnings_p75 = 93825,  median_debt = 21551,
  layer_meta = layer_meta || '{"debt":{"confidence":"verified","last_verified":"2026-06-30","source_name":"College Scorecard Field of Study Data (06102026)","source_url":"https://collegescorecard.ed.gov/data/","note":{"en":"Median debt among completers (DEBT_ALL_PP_ANY_MDN). US national avg ≈ $30k.","ko":"졸업생 중위 부채 (DEBT_ALL_PP_ANY_MDN). 미국 평균 ≈ $30k."}}}'::jsonb
WHERE slug = 'business-management' AND country = 'US';

UPDATE majors SET
  earnings_p25 = 56205,  earnings_p75 = 97191,  median_debt = 29108,
  layer_meta = layer_meta || '{"debt":{"confidence":"verified","last_verified":"2026-06-30","source_name":"College Scorecard Field of Study Data (06102026)","source_url":"https://collegescorecard.ed.gov/data/","note":{"en":"Median debt among completers (DEBT_ALL_PP_ANY_MDN). US national avg ≈ $30k.","ko":"졸업생 중위 부채 (DEBT_ALL_PP_ANY_MDN). 미국 평균 ≈ $30k."}}}'::jsonb
WHERE slug = 'accounting' AND country = 'US';

UPDATE majors SET
  earnings_p25 = 32910,  earnings_p75 = 70406,  median_debt = 51747,
  layer_meta = layer_meta || '{"debt":{"confidence":"verified","last_verified":"2026-06-30","source_name":"College Scorecard Field of Study Data (06102026)","source_url":"https://collegescorecard.ed.gov/data/","note":{"en":"Median debt among completers (DEBT_ALL_PP_ANY_MDN). US national avg ≈ $30k.","ko":"졸업생 중위 부채 (DEBT_ALL_PP_ANY_MDN). 미국 평균 ≈ $30k."}}}'::jsonb
WHERE slug = 'ux-design' AND country = 'US';

UPDATE majors SET
  earnings_p25 = 35740,  earnings_p75 = 67229,  median_debt = 30834,
  layer_meta = layer_meta || '{"debt":{"confidence":"verified","last_verified":"2026-06-30","source_name":"College Scorecard Field of Study Data (06102026)","source_url":"https://collegescorecard.ed.gov/data/","note":{"en":"Median debt among completers (DEBT_ALL_PP_ANY_MDN). US national avg ≈ $30k.","ko":"졸업생 중위 부채 (DEBT_ALL_PP_ANY_MDN). 미국 평균 ≈ $30k."}}}'::jsonb
WHERE slug = 'psychology' AND country = 'US';

UPDATE majors SET
  earnings_p25 = 26048,  earnings_p75 = 58755,  median_debt = 47181,
  layer_meta = layer_meta || '{"debt":{"confidence":"verified","last_verified":"2026-06-30","source_name":"College Scorecard Field of Study Data (06102026)","source_url":"https://collegescorecard.ed.gov/data/","note":{"en":"Median debt among completers (DEBT_ALL_PP_ANY_MDN). US national avg ≈ $30k.","ko":"졸업생 중위 부채 (DEBT_ALL_PP_ANY_MDN). 미국 평균 ≈ $30k."}}}'::jsonb
WHERE slug = 'music' AND country = 'US';

UPDATE majors SET
  earnings_p25 = 77665,  earnings_p75 = 109050, median_debt = 36460,
  layer_meta = layer_meta || '{"debt":{"confidence":"verified","last_verified":"2026-06-30","source_name":"College Scorecard Field of Study Data (06102026)","source_url":"https://collegescorecard.ed.gov/data/","note":{"en":"Median debt among completers (DEBT_ALL_PP_ANY_MDN). US national avg ≈ $30k.","ko":"졸업생 중위 부채 (DEBT_ALL_PP_ANY_MDN). 미국 평균 ≈ $30k."}}}'::jsonb
WHERE slug = 'mechanical-engineering' AND country = 'US';

UPDATE majors SET
  earnings_p25 = 84635,  earnings_p75 = 122440, median_debt = 31266,
  layer_meta = layer_meta || '{"debt":{"confidence":"verified","last_verified":"2026-06-30","source_name":"College Scorecard Field of Study Data (06102026)","source_url":"https://collegescorecard.ed.gov/data/","note":{"en":"Median debt among completers (DEBT_ALL_PP_ANY_MDN). US national avg ≈ $30k.","ko":"졸업생 중위 부채 (DEBT_ALL_PP_ANY_MDN). 미국 평균 ≈ $30k."}}}'::jsonb
WHERE slug = 'electrical-engineering' AND country = 'US';

UPDATE majors SET
  earnings_p25 = 38929,  earnings_p75 = 79199,  median_debt = 34468,
  layer_meta = layer_meta || '{"debt":{"confidence":"verified","last_verified":"2026-06-30","source_name":"College Scorecard Field of Study Data (06102026)","source_url":"https://collegescorecard.ed.gov/data/","note":{"en":"Median debt among completers (DEBT_ALL_PP_ANY_MDN). US national avg ≈ $30k.","ko":"졸업생 중위 부채 (DEBT_ALL_PP_ANY_MDN). 미국 평균 ≈ $30k."}}}'::jsonb
WHERE slug = 'biology' AND country = 'US';

UPDATE majors SET
  earnings_p25 = 60801,  earnings_p75 = 111527, median_debt = 38133,
  layer_meta = layer_meta || '{"debt":{"confidence":"verified","last_verified":"2026-06-30","source_name":"College Scorecard Field of Study Data (06102026)","source_url":"https://collegescorecard.ed.gov/data/","note":{"en":"Median debt among completers (DEBT_ALL_PP_ANY_MDN). US national avg ≈ $30k.","ko":"졸업생 중위 부채 (DEBT_ALL_PP_ANY_MDN). 미국 평균 ≈ $30k."}}}'::jsonb
WHERE slug = 'finance' AND country = 'US';

UPDATE majors SET
  earnings_p25 = 49693,  earnings_p75 = 93086,  median_debt = 36445,
  layer_meta = layer_meta || '{"debt":{"confidence":"verified","last_verified":"2026-06-30","source_name":"College Scorecard Field of Study Data (06102026)","source_url":"https://collegescorecard.ed.gov/data/","note":{"en":"Median debt among completers (DEBT_ALL_PP_ANY_MDN). US national avg ≈ $30k.","ko":"졸업생 중위 부채 (DEBT_ALL_PP_ANY_MDN). 미국 평균 ≈ $30k."}}}'::jsonb
WHERE slug = 'marketing' AND country = 'US';

UPDATE majors SET
  earnings_p25 = 57773,  earnings_p75 = 115095, median_debt = 40939,
  layer_meta = layer_meta || '{"debt":{"confidence":"verified","last_verified":"2026-06-30","source_name":"College Scorecard Field of Study Data (06102026)","source_url":"https://collegescorecard.ed.gov/data/","note":{"en":"Median debt among completers (DEBT_ALL_PP_ANY_MDN). US national avg ≈ $30k.","ko":"졸업생 중위 부채 (DEBT_ALL_PP_ANY_MDN). 미국 평균 ≈ $30k."}}}'::jsonb
WHERE slug = 'economics' AND country = 'US';

UPDATE majors SET
  earnings_p25 = 49058,  earnings_p75 = 97414,  median_debt = 31804,
  layer_meta = layer_meta || '{"debt":{"confidence":"verified","last_verified":"2026-06-30","source_name":"College Scorecard Field of Study Data (06102026)","source_url":"https://collegescorecard.ed.gov/data/","note":{"en":"Median debt among completers (DEBT_ALL_PP_ANY_MDN). US national avg ≈ $30k.","ko":"졸업생 중위 부채 (DEBT_ALL_PP_ANY_MDN). 미국 평균 ≈ $30k."}}}'::jsonb
WHERE slug = 'mathematics' AND country = 'US';

UPDATE majors SET
  earnings_p25 = 80300,  earnings_p75 = 117974, median_debt = 34420,
  layer_meta = layer_meta || '{"debt":{"confidence":"verified","last_verified":"2026-06-30","source_name":"College Scorecard Field of Study Data (06102026)","source_url":"https://collegescorecard.ed.gov/data/","note":{"en":"Median debt among completers (DEBT_ALL_PP_ANY_MDN). US national avg ≈ $30k.","ko":"졸업생 중위 부채 (DEBT_ALL_PP_ANY_MDN). 미국 평균 ≈ $30k."}}}'::jsonb
WHERE slug = 'chemical-engineering' AND country = 'US';

UPDATE majors SET
  earnings_p25 = 39504,  earnings_p75 = 75978,  median_debt = 32358,
  layer_meta = layer_meta || '{"debt":{"confidence":"verified","last_verified":"2026-06-30","source_name":"College Scorecard Field of Study Data (06102026)","source_url":"https://collegescorecard.ed.gov/data/","note":{"en":"Median debt among completers (DEBT_ALL_PP_ANY_MDN). US national avg ≈ $30k.","ko":"졸업생 중위 부채 (DEBT_ALL_PP_ANY_MDN). 미국 평균 ≈ $30k."}}}'::jsonb
WHERE slug = 'communications' AND country = 'US';

UPDATE majors SET
  earnings_p25 = 44731,  earnings_p75 = 85350,  median_debt = 39028,
  layer_meta = layer_meta || '{"debt":{"confidence":"verified","last_verified":"2026-06-30","source_name":"College Scorecard Field of Study Data (06102026)","source_url":"https://collegescorecard.ed.gov/data/","note":{"en":"Median debt among completers (DEBT_ALL_PP_ANY_MDN). US national avg ≈ $30k.","ko":"졸업생 중위 부채 (DEBT_ALL_PP_ANY_MDN). 미국 평균 ≈ $30k."}}}'::jsonb
WHERE slug = 'political-science' AND country = 'US';
