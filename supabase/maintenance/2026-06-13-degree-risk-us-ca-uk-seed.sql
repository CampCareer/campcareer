-- ============================================================================
-- Degree Risk — US / CA / UK seed + AU/IE sources top-up — 13 June 2026
-- REVIEW BEFORE RUNNING. Nothing in this file has been executed.
--
-- Purpose
--   The Degree Risk Checker now scores 5 countries (US, CA, UK, AU, IE). The
--   majors table previously held only AU + IE rows. This file:
--     1. Pre-flight: dumps current rows + constraints so you can confirm the
--        country CHECK and (slug, country) uniqueness before inserting.
--     2. Inserts 30 rows (10 majors × US/CA/UK), all data_confidence='estimate'.
--     3. Tops up AU/IE `sources` arrays so the demand / AI / ROI layers also
--        get a source link (originally only employment + visa were populated).
--
-- Schema note (verified against the live table 2026-06-13)
--   Real columns used: slug, name, country, field_group, employment_rate,
--   employment_score, occupation_list_match, post_study_work_years,
--   visa_pathway_score, market_demand_score, ai_exposure_band, ai_note,
--   median_starting_salary, avg_annual_tuition_intl, payback_years,
--   overall_risk, risk_summary, alternatives, sources, data_confidence,
--   last_verified. (id / created_at / updated_at use defaults.)
--   ai_exposure_band domain is 'low' | 'medium' | 'high'.
--
-- Data confidence
--   Every US/CA/UK row is an ESTIMATE (data_confidence='estimate',
--   last_verified=NULL). Salary/tuition/employment figures are directional
--   placeholders; verify against the named primary sources before flipping any
--   row to 'verified'.
--
-- Visa-layer semantics (occupation_list_match, post_study_work_years)
--   US — occupation_list_match = STEM-OPT-eligible field; post_study_work_years
--        = 3 (12mo OPT + 24mo STEM extension) for STEM, else 1 (OPT only).
--   CA — occupation_list_match = covered by an Express Entry category-based draw
--        (STEM / healthcare); post_study_work_years = 3 (PGWP max).
--   UK — occupation_list_match = realistic Skilled Worker / Immigration Salary
--        List route; post_study_work_years = 2 (Graduate Route).
--        NOTE: Graduate Route shortens to 18 months from 2027 — re-check next pass.
-- ============================================================================

-- ── PRE-FLIGHT (run first, read the output, then decide) ───────────────────
SELECT slug, country, data_confidence, last_verified
FROM public.majors
ORDER BY country, slug;

SELECT conname, pg_get_constraintdef(oid) AS def
FROM pg_constraint
WHERE conrelid = 'public.majors'::regclass;

-- If the country CHECK only allows ('AU','IE'), widen it before inserting.
-- Replace <check_name> with the conname from the query above, then run:
--
--   ALTER TABLE public.majors DROP CONSTRAINT <check_name>;
--   ALTER TABLE public.majors
--     ADD CONSTRAINT majors_country_check
--     CHECK (country IN ('US','CA','UK','AU','IE'));
--
-- The INSERTs use ON CONFLICT (slug, country); confirm a UNIQUE/PK on
-- (slug, country) exists in the pre-flight output. If not, create it:
--   ALTER TABLE public.majors ADD CONSTRAINT majors_slug_country_key UNIQUE (slug, country);

BEGIN;

-- ── UNITED STATES (course length ~4 years) ─────────────────────────────────
INSERT INTO public.majors (
  slug, name, country, field_group, employment_rate, employment_score,
  occupation_list_match, post_study_work_years, visa_pathway_score,
  market_demand_score, ai_exposure_band, ai_note, median_starting_salary,
  avg_annual_tuition_intl, payback_years, overall_risk, risk_summary,
  alternatives, sources, data_confidence, last_verified
)
SELECT v.slug, v.name, 'US', v.field_group, v.employment_rate, v.employment_rate,
       v.occupation_list_match, v.post_study_work_years, v.visa_pathway_score,
       v.market_demand_score, v.ai_exposure_band, v.ai_note, v.median_starting_salary,
       v.avg_annual_tuition_intl, v.payback_years, v.overall_risk, v.risk_summary,
       v.alternatives,
       '[
         {"name":"College Scorecard — tuition, median earnings & graduate outcomes (U.S. Dept of Education)","url":"https://collegescorecard.ed.gov/"},
         {"name":"BLS Occupational Outlook Handbook — employment & demand outlook","url":"https://www.bls.gov/ooh/"},
         {"name":"USCIS — STEM OPT extension & H-1B visa","url":"https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt"},
         {"name":"OECD AI exposure / Felten occupational AI-exposure index","url":"https://www.oecd.org/employment-outlook/"}
       ]'::jsonb,
       'estimate', NULL
FROM (VALUES
  ('computer-science','Computer Science','tech',85,true,3,85,88,'medium','AI assists coding, but system design and integration work keeps growing.',85000,50000,5,'medium','Strong demand and STEM-OPT runway, but entry-level coding is where AI pressure lands first — the upside goes to those who move past boilerplate fast.',ARRAY['software-engineering','data-analytics']),
  ('data-analytics','Data Analytics','tech',80,true,3,84,82,'high','Routine reporting automates fast; advanced analytics and ML skills stay in demand.',78000,48000,5,'medium','A STEM pathway with real hiring, but routine reporting is automating — the durable roles need modelling and ML depth.',ARRAY['computer-science','software-engineering']),
  ('software-engineering','Software Engineering','tech',86,true,3,86,87,'medium','AI tooling speeds delivery; engineering ownership stays human.',90000,50000,5,'low','Among the safer bets: STEM-OPT eligibility, high pay, and engineering judgment that AI tooling speeds up rather than replaces.',ARRAY['computer-science','data-analytics']),
  ('nursing','Nursing','health',92,false,1,45,90,'low','Hands-on care is hard to automate; ageing demand keeps rising.',75000,40000,5,'low','High employment and demand, but the work-visa path is narrower for internationals than the STEM fields — license and state rules matter.',ARRAY['psychology']),
  ('civil-engineering','Civil Engineering','engineering',84,true,3,82,76,'low','Site work and stamped approvals keep engineers essential.',68000,45000,6,'low','Steady demand, STEM-OPT eligibility, and regulated sign-off that keeps humans in the loop.',ARRAY['software-engineering']),
  ('business-management','Business','business',74,false,1,40,65,'high','Generic admin work is exposed; strategy and people leadership less so.',60000,45000,7,'medium','Hiring is broad but generic; only 1 year of OPT and an exposed skill base mean you need a specialisation that pays.',ARRAY['accounting','data-analytics']),
  ('accounting','Accounting','business',80,false,1,42,70,'high','Bookkeeping automates; audit, advisory and compliance persist.',58000,42000,7,'medium','Reliable hiring and clear licensure, but bookkeeping automates and the visa runway is short without STEM status.',ARRAY['business-management','data-analytics']),
  ('ux-design','UX Design','design',72,false,1,42,64,'medium','AI drafts screens; research, strategy and craft still differentiate.',65000,42000,6,'medium','Creative demand exists, but a 1-year visa window and AI draft tools mean research and strategy skills decide who stays.',ARRAY['computer-science','psychology']),
  ('psychology','Psychology','social',68,false,1,38,58,'low','Clinical and counselling work needs licensure and human trust.',45000,38000,8,'medium','Meaningful field, but most clinical roles need US licensure and graduate study — the bachelor alone has a thin work-visa path.',ARRAY['nursing']),
  ('music','Music','creative',60,false,1,35,45,'medium','Generative audio pressures stock work; performance and direction stay human.',40000,40000,9,'high','What this path costs: high tuition, a 1-year visa window, and AI pressure on stock work. It works when you build performance, teaching or direction income — not recorded output alone.',ARRAY['ux-design'])
) AS v(slug, name, field_group, employment_rate, occupation_list_match, post_study_work_years, visa_pathway_score, market_demand_score, ai_exposure_band, ai_note, median_starting_salary, avg_annual_tuition_intl, payback_years, overall_risk, risk_summary, alternatives)
ON CONFLICT (slug, country) DO UPDATE SET
  name = EXCLUDED.name, field_group = EXCLUDED.field_group,
  employment_rate = EXCLUDED.employment_rate, employment_score = EXCLUDED.employment_score,
  occupation_list_match = EXCLUDED.occupation_list_match, post_study_work_years = EXCLUDED.post_study_work_years,
  visa_pathway_score = EXCLUDED.visa_pathway_score, market_demand_score = EXCLUDED.market_demand_score,
  ai_exposure_band = EXCLUDED.ai_exposure_band, ai_note = EXCLUDED.ai_note,
  median_starting_salary = EXCLUDED.median_starting_salary, avg_annual_tuition_intl = EXCLUDED.avg_annual_tuition_intl,
  payback_years = EXCLUDED.payback_years, overall_risk = EXCLUDED.overall_risk, risk_summary = EXCLUDED.risk_summary,
  alternatives = EXCLUDED.alternatives, sources = EXCLUDED.sources,
  data_confidence = EXCLUDED.data_confidence, last_verified = EXCLUDED.last_verified;

-- ── CANADA (PGWP = 3 years; Express Entry favours STEM + healthcare) ───────
INSERT INTO public.majors (
  slug, name, country, field_group, employment_rate, employment_score,
  occupation_list_match, post_study_work_years, visa_pathway_score,
  market_demand_score, ai_exposure_band, ai_note, median_starting_salary,
  avg_annual_tuition_intl, payback_years, overall_risk, risk_summary,
  alternatives, sources, data_confidence, last_verified
)
SELECT v.slug, v.name, 'CA', v.field_group, v.employment_rate, v.employment_rate,
       v.occupation_list_match, v.post_study_work_years, v.visa_pathway_score,
       v.market_demand_score, v.ai_exposure_band, v.ai_note, v.median_starting_salary,
       v.avg_annual_tuition_intl, v.payback_years, v.overall_risk, v.risk_summary,
       v.alternatives,
       '[
         {"name":"Statistics Canada — graduate employment & earnings","url":"https://www.statcan.gc.ca/"},
         {"name":"Job Bank — labour market outlook by occupation","url":"https://www.jobbank.gc.ca/trend-analysis"},
         {"name":"IRCC — Post-Graduation Work Permit & Express Entry category-based selection","url":"https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation.html"},
         {"name":"OECD AI exposure / Felten occupational AI-exposure index","url":"https://www.oecd.org/employment-outlook/"}
       ]'::jsonb,
       'estimate', NULL
FROM (VALUES
  ('computer-science','Computer Science','tech',84,true,3,88,86,'medium','AI assists coding, but system design and integration work keeps growing.',70000,36000,5,'low','Strong demand, a 3-year PGWP, and STEM Express Entry draws make this one of the cleaner study-to-PR paths in Canada.',ARRAY['software-engineering','data-analytics']),
  ('data-analytics','Data Analytics','tech',79,true,3,86,80,'high','Routine reporting automates fast; advanced analytics and ML skills stay in demand.',65000,35000,5,'low','Healthy hiring plus STEM-aligned PR draws; the durable roles lean on modelling rather than routine reporting.',ARRAY['computer-science','software-engineering']),
  ('software-engineering','Software Engineering','tech',85,true,3,88,85,'medium','AI tooling speeds delivery; engineering ownership stays human.',72000,36000,5,'low','High pay, 3-year PGWP, and Express Entry STEM priority — a strong combination for staying long-term.',ARRAY['computer-science','data-analytics']),
  ('nursing','Nursing','health',93,true,3,90,92,'low','Hands-on care is hard to automate; ageing demand keeps rising.',68000,32000,4,'low','Acute shortages, healthcare Express Entry draws, and a 3-year PGWP make nursing one of Canada''s strongest PR pathways.',ARRAY['psychology']),
  ('civil-engineering','Civil Engineering','engineering',83,true,3,85,75,'low','Site work and stamped approvals keep engineers essential.',66000,34000,5,'low','Solid demand, STEM PR priority, and regulated practice that keeps engineers in the loop.',ARRAY['software-engineering']),
  ('business-management','Business','business',73,false,3,65,64,'high','Generic admin work is exposed; strategy and people leadership less so.',55000,33000,6,'medium','The PGWP is generous, but general business sits outside category-based PR draws and is more AI-exposed — specialise to stand out.',ARRAY['accounting','data-analytics']),
  ('accounting','Accounting','business',79,false,3,65,68,'high','Bookkeeping automates; audit, advisory and compliance persist.',56000,32000,6,'medium','Reliable hiring and a long PGWP, though general accounting is AI-exposed and outside the STEM PR fast lanes.',ARRAY['business-management','data-analytics']),
  ('ux-design','UX Design','design',71,false,3,63,62,'medium','AI drafts screens; research, strategy and craft still differentiate.',60000,33000,6,'medium','A 3-year PGWP gives room to build a portfolio, but design sits outside category PR draws and faces AI draft tools.',ARRAY['computer-science','psychology']),
  ('psychology','Psychology','social',67,false,3,60,57,'low','Clinical and counselling work needs licensure and human trust.',48000,31000,7,'medium','The PGWP helps, but most clinical roles need provincial licensure and further study — plan the graduate route early.',ARRAY['nursing']),
  ('music','Music','creative',59,false,3,58,44,'medium','Generative audio pressures stock work; performance and direction stay human.',42000,32000,8,'high','What this path costs: modest salaries against rising tuition. It works when you combine performance, teaching and production income — and the 3-year PGWP buys time to build it.',ARRAY['ux-design'])
) AS v(slug, name, field_group, employment_rate, occupation_list_match, post_study_work_years, visa_pathway_score, market_demand_score, ai_exposure_band, ai_note, median_starting_salary, avg_annual_tuition_intl, payback_years, overall_risk, risk_summary, alternatives)
ON CONFLICT (slug, country) DO UPDATE SET
  name = EXCLUDED.name, field_group = EXCLUDED.field_group,
  employment_rate = EXCLUDED.employment_rate, employment_score = EXCLUDED.employment_score,
  occupation_list_match = EXCLUDED.occupation_list_match, post_study_work_years = EXCLUDED.post_study_work_years,
  visa_pathway_score = EXCLUDED.visa_pathway_score, market_demand_score = EXCLUDED.market_demand_score,
  ai_exposure_band = EXCLUDED.ai_exposure_band, ai_note = EXCLUDED.ai_note,
  median_starting_salary = EXCLUDED.median_starting_salary, avg_annual_tuition_intl = EXCLUDED.avg_annual_tuition_intl,
  payback_years = EXCLUDED.payback_years, overall_risk = EXCLUDED.overall_risk, risk_summary = EXCLUDED.risk_summary,
  alternatives = EXCLUDED.alternatives, sources = EXCLUDED.sources,
  data_confidence = EXCLUDED.data_confidence, last_verified = EXCLUDED.last_verified;

-- ── UNITED KINGDOM (Graduate Route = 2 years; course length 3 years) ───────
INSERT INTO public.majors (
  slug, name, country, field_group, employment_rate, employment_score,
  occupation_list_match, post_study_work_years, visa_pathway_score,
  market_demand_score, ai_exposure_band, ai_note, median_starting_salary,
  avg_annual_tuition_intl, payback_years, overall_risk, risk_summary,
  alternatives, sources, data_confidence, last_verified
)
SELECT v.slug, v.name, 'UK', v.field_group, v.employment_rate, v.employment_rate,
       v.occupation_list_match, v.post_study_work_years, v.visa_pathway_score,
       v.market_demand_score, v.ai_exposure_band, v.ai_note, v.median_starting_salary,
       v.avg_annual_tuition_intl, v.payback_years, v.overall_risk, v.risk_summary,
       v.alternatives,
       '[
         {"name":"HESA Graduate Outcomes Survey","url":"https://www.hesa.ac.uk/data-and-analysis/graduates"},
         {"name":"GOV.UK — Graduate Route & Skilled Worker / Immigration Salary List (UKVI)","url":"https://www.gov.uk/graduate-visa"},
         {"name":"ONS labour market overview — demand","url":"https://www.ons.gov.uk/employmentandlabourmarket"},
         {"name":"Discover Uni — tuition & graduate salary data","url":"https://discoveruni.gov.uk/"},
         {"name":"OECD AI exposure / Felten occupational AI-exposure index","url":"https://www.oecd.org/employment-outlook/"}
       ]'::jsonb,
       'estimate', NULL
FROM (VALUES
  ('computer-science','Computer Science','tech',84,true,2,80,85,'medium','AI assists coding, but system design and integration work keeps growing.',32000,26000,5,'medium','Good demand and a Skilled Worker route, but the 2-year Graduate Route is tighter than Canada/Australia and entry coding is AI-exposed.',ARRAY['software-engineering','data-analytics']),
  ('data-analytics','Data Analytics','tech',79,true,2,80,80,'high','Routine reporting automates fast; advanced analytics and ML skills stay in demand.',31000,25000,5,'medium','Hiring is solid and a skilled-worker path exists, but routine analytics automates — depth in modelling decides longevity.',ARRAY['computer-science','software-engineering']),
  ('software-engineering','Software Engineering','tech',85,true,2,82,84,'medium','AI tooling speeds delivery; engineering ownership stays human.',34000,26000,5,'low','Strong pay relative to UK norms, a recognised Skilled Worker route, and engineering judgment AI speeds up rather than replaces.',ARRAY['computer-science','data-analytics']),
  ('nursing','Nursing','health',92,true,2,85,90,'low','Hands-on care is hard to automate; ageing demand keeps rising.',28000,22000,5,'low','NHS shortages, an Immigration Salary List route, and steady demand make nursing one of the UK''s most reliable paths.',ARRAY['psychology']),
  ('civil-engineering','Civil Engineering','engineering',83,true,2,78,74,'low','Site work and stamped approvals keep engineers essential.',30000,24000,5,'low','Infrastructure demand and a recognised Skilled Worker route, with regulated sign-off keeping engineers essential.',ARRAY['software-engineering']),
  ('business-management','Business','business',73,false,2,55,63,'high','Generic admin work is exposed; strategy and people leadership less so.',28000,23000,6,'medium','Broad hiring but generic skills, a 2-year window, and high AI exposure — a clear specialisation is what converts it to a career.',ARRAY['accounting','data-analytics']),
  ('accounting','Accounting','business',79,true,2,72,69,'high','Bookkeeping automates; audit, advisory and compliance persist.',29000,22000,5,'medium','Recognised qualifications and shortage-list eligibility help, though routine accounting is AI-exposed.',ARRAY['business-management','data-analytics']),
  ('ux-design','UX Design','design',71,false,2,55,62,'medium','AI drafts screens; research, strategy and craft still differentiate.',30000,23000,6,'medium','Creative hiring exists, but design sits outside shortage routes and the 2-year window is tight against AI draft tools.',ARRAY['computer-science','psychology']),
  ('psychology','Psychology','social',67,false,2,52,57,'low','Clinical and counselling work needs licensure and human trust.',26000,22000,7,'medium','A respected field, but clinical roles need further UK study and registration — the bachelor''s work-visa path is thin.',ARRAY['nursing']),
  ('music','Music','creative',59,false,2,50,44,'medium','Generative audio pressures stock work; performance and direction stay human.',25000,23000,8,'high','What this path costs: modest pay, no shortage route, and a 2-year window. It works when you build performance, teaching and production income early.',ARRAY['ux-design'])
) AS v(slug, name, field_group, employment_rate, occupation_list_match, post_study_work_years, visa_pathway_score, market_demand_score, ai_exposure_band, ai_note, median_starting_salary, avg_annual_tuition_intl, payback_years, overall_risk, risk_summary, alternatives)
ON CONFLICT (slug, country) DO UPDATE SET
  name = EXCLUDED.name, field_group = EXCLUDED.field_group,
  employment_rate = EXCLUDED.employment_rate, employment_score = EXCLUDED.employment_score,
  occupation_list_match = EXCLUDED.occupation_list_match, post_study_work_years = EXCLUDED.post_study_work_years,
  visa_pathway_score = EXCLUDED.visa_pathway_score, market_demand_score = EXCLUDED.market_demand_score,
  ai_exposure_band = EXCLUDED.ai_exposure_band, ai_note = EXCLUDED.ai_note,
  median_starting_salary = EXCLUDED.median_starting_salary, avg_annual_tuition_intl = EXCLUDED.avg_annual_tuition_intl,
  payback_years = EXCLUDED.payback_years, overall_risk = EXCLUDED.overall_risk, risk_summary = EXCLUDED.risk_summary,
  alternatives = EXCLUDED.alternatives, sources = EXCLUDED.sources,
  data_confidence = EXCLUDED.data_confidence, last_verified = EXCLUDED.last_verified;

-- ── AU / IE sources top-up (add demand / AI / ROI source links) ────────────
-- Existing AU/IE rows already store sources as an ARRAY with employment + visa
-- entries only. Replace with a fuller array so every layer resolves a source
-- link (findSource matches by keyword). Idempotent.
UPDATE public.majors SET sources = '[
  {"name":"QILT Graduate Outcomes Survey 2024 — full-time employment by study area","url":"https://www.qilt.edu.au/surveys/graduate-outcomes-survey-(gos)"},
  {"name":"Core Skills Occupation List (CSOL) — Dept of Home Affairs","url":"https://immi.homeaffairs.gov.au/Documents/core-sol.pdf"},
  {"name":"Temporary Graduate visa (subclass 485) — Dept of Home Affairs","url":"https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-graduate-485/post-higher-education-work"},
  {"name":"Jobs and Skills Australia — labour market outlook","url":"https://www.jobsandskills.gov.au/"},
  {"name":"CRICOS — course tuition registry","url":"https://cricos.education.gov.au/"},
  {"name":"OECD AI exposure / Felten occupational AI-exposure index","url":"https://www.oecd.org/employment-outlook/"}
]'::jsonb
WHERE country = 'AU';

UPDATE public.majors SET sources = '[
  {"name":"HEA Graduate Outcomes Survey, Class of 2024","url":"https://hea.ie/statistics/graduate-outcomes/key-findings-go-2024/"},
  {"name":"Critical Skills Occupations List — Dept of Enterprise","url":"https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/employment-permit-eligibility/highly-skilled-eligible-occupations-list/"},
  {"name":"Stamp 1G, Third Level Graduate Programme — Irish Immigration Service","url":"https://www.irishimmigration.ie/my-situation-has-changed-since-i-arrived-in-ireland/third-level-graduate-programme/"},
  {"name":"EGFSN — labour market and future skills forecasts","url":"https://www.skillsireland.ie/"},
  {"name":"CSO Ireland — graduate earnings","url":"https://www.cso.ie/"},
  {"name":"OECD AI exposure / Felten occupational AI-exposure index","url":"https://www.oecd.org/employment-outlook/"}
]'::jsonb
WHERE country = 'IE';

-- ── POST-FLIGHT — expect 10 rows per country (50 total) ────────────────────
SELECT country, count(*) AS n FROM public.majors GROUP BY country ORDER BY country;

COMMIT;
