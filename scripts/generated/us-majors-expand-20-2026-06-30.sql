-- ============================================================================
-- US Degree Risk — Expand from 10 to 20 majors (30 June 2026)
--
-- Adds 10 new US majors with verified College Scorecard data.
-- Data sources same as us-majors-verify-2026-06-30.sql.
-- ============================================================================

-- Helper payback: ROUND(tuition * 4 / (salary * 0.35))
-- Ensures the same methodology as the existing 10 verified US majors.

DO $$
DECLARE
  today TEXT := '2026-06-30';
  v_slug TEXT;
  v_salary INT;
  v_tuition INT;
  v_emp INT;
  v_field_group TEXT;
  v_stem BOOLEAN;
  v_occ_match BOOLEAN;
  v_psw_yrs INT;
  v_visa_score INT;
  v_demand_score INT;
  v_ai_band TEXT;
  v_ai_note TEXT;
  v_risk TEXT;
  v_risk_summary TEXT;
  v_alternatives TEXT[];
  v_payback INT;
BEGIN

  -- ══════════════════════════════════════════════════════════════════════════
  -- 1. MECHANICAL ENGINEERING (CIP 14.1901)
  -- ══════════════════════════════════════════════════════════════════════════
  v_slug := 'mechanical-engineering';
  v_salary := 70513; v_tuition := 34402; v_emp := 96;
  v_field_group := 'engineering'; v_stem := true;
  v_occ_match := true; v_psw_yrs := 3; v_visa_score := 86;
  v_demand_score := 80; v_ai_band := 'medium';
  v_ai_note := 'CAD and simulation tools are AI-assisted, but physical design, testing, and manufacturing oversight keep engineers central.';
  v_risk := 'low';
  v_risk_summary := 'A broad STEM field with steady industrial demand. Hands-on design and manufacturing keep AI exposure moderate. STEM-OPT eligibility and high employment make it a reliable choice.';
  v_alternatives := ARRAY['electrical-engineering', 'civil-engineering'];
  v_payback := GREATEST(1, ROUND(v_tuition * 4 / (v_salary * 0.35)));

  INSERT INTO public.majors (slug, name, country, field_group, employment_rate, employment_score, occupation_list_match, post_study_work_years, visa_pathway_score, market_demand_score, ai_exposure_band, ai_note, median_starting_salary, avg_annual_tuition_intl, payback_years, overall_risk, risk_summary, alternatives, sources, data_confidence, last_verified)
  VALUES (v_slug, 'Mechanical Engineering', 'US', v_field_group, v_emp, v_emp, v_occ_match, v_psw_yrs, v_visa_score, v_demand_score, v_ai_band, v_ai_note, v_salary, v_tuition, v_payback, v_risk, v_risk_summary, v_alternatives,
    '[{"name":"College Scorecard — Mechanical Engineering (CIP 14.1901) field-of-study median earnings & out-of-state tuition (U.S. Dept of Education)","url":"https://collegescorecard.ed.gov/search/?cip=14.1901&credential=3"},{"name":"BLS Occupational Outlook Handbook — employment & demand outlook","url":"https://www.bls.gov/ooh/"},{"name":"USCIS — STEM OPT extension & H-1B visa","url":"https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt"},{"name":"OECD AI exposure / Felten occupational AI-exposure index","url":"https://www.oecd.org/employment-outlook/"}]'::jsonb,
    'verified', today)
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
  RAISE NOTICE '%: inserted/updated (salary=$,%, tuition=$,%, emp=%, payback=%yr, risk=%)', v_slug, v_salary, v_tuition, v_emp, v_payback, v_risk;

  -- ══════════════════════════════════════════════════════════════════════════
  -- 2. ELECTRICAL ENGINEERING (CIP 14.1001)
  -- ══════════════════════════════════════════════════════════════════════════
  v_slug := 'electrical-engineering';
  v_salary := 77478; v_tuition := 34242; v_emp := 95;
  v_field_group := 'engineering'; v_stem := true;
  v_occ_match := true; v_psw_yrs := 3; v_visa_score := 86;
  v_demand_score := 85; v_ai_band := 'medium';
  v_ai_note := 'EDA and simulation tools use AI for routing and optimisation, but system architecture and hardware design stay human.';
  v_risk := 'low';
  v_risk_summary := 'Core engineering field with strong demand in tech, energy and telecoms. Among the highest starting salaries, STEM-OPT eligibility, and engineering judgment that AI augments rather than replaces.';
  v_alternatives := ARRAY['mechanical-engineering', 'computer-science'];
  v_payback := GREATEST(1, ROUND(v_tuition * 4 / (v_salary * 0.35)));

  INSERT INTO public.majors (slug, name, country, field_group, employment_rate, employment_score, occupation_list_match, post_study_work_years, visa_pathway_score, market_demand_score, ai_exposure_band, ai_note, median_starting_salary, avg_annual_tuition_intl, payback_years, overall_risk, risk_summary, alternatives, sources, data_confidence, last_verified)
  VALUES (v_slug, 'Electrical Engineering', 'US', v_field_group, v_emp, v_emp, v_occ_match, v_psw_yrs, v_visa_score, v_demand_score, v_ai_band, v_ai_note, v_salary, v_tuition, v_payback, v_risk, v_risk_summary, v_alternatives,
    '[{"name":"College Scorecard — Electrical Engineering (CIP 14.1001) field-of-study median earnings & out-of-state tuition (U.S. Dept of Education)","url":"https://collegescorecard.ed.gov/search/?cip=14.1001&credential=3"},{"name":"BLS Occupational Outlook Handbook — employment & demand outlook","url":"https://www.bls.gov/ooh/"},{"name":"USCIS — STEM OPT extension & H-1B visa","url":"https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt"},{"name":"OECD AI exposure / Felten occupational AI-exposure index","url":"https://www.oecd.org/employment-outlook/"}]'::jsonb,
    'verified', today)
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
  RAISE NOTICE '%: inserted/updated', v_slug;

  -- ══════════════════════════════════════════════════════════════════════════
  -- 3. BIOLOGY (CIP 26.0101)
  -- ══════════════════════════════════════════════════════════════════════════
  v_slug := 'biology';
  v_salary := 32283; v_tuition := 32955; v_emp := 91;
  v_field_group := 'science'; v_stem := true;
  v_occ_match := true; v_psw_yrs := 3; v_visa_score := 80;
  v_demand_score := 70; v_ai_band := 'low';
  v_ai_note := 'Lab work and clinical roles are hands-on and hard to automate — AI assists bioinformatics but wet-lab remains human.';
  v_risk := 'medium';
  v_risk_summary := 'A foundational life-sciences degree with STEM-OPT eligibility, but a bachelor alone has thin career prospects — most go on to graduate or professional school (medical, pharmacy, PA). Low starting salary reflects this.';
  v_alternatives := ARRAY['psychology', 'nursing'];
  v_payback := GREATEST(1, ROUND(v_tuition * 4 / (v_salary * 0.35)));

  INSERT INTO public.majors (slug, name, country, field_group, employment_rate, employment_score, occupation_list_match, post_study_work_years, visa_pathway_score, market_demand_score, ai_exposure_band, ai_note, median_starting_salary, avg_annual_tuition_intl, payback_years, overall_risk, risk_summary, alternatives, sources, data_confidence, last_verified)
  VALUES (v_slug, 'Biology', 'US', v_field_group, v_emp, v_emp, v_occ_match, v_psw_yrs, v_visa_score, v_demand_score, v_ai_band, v_ai_note, v_salary, v_tuition, v_payback, v_risk, v_risk_summary, v_alternatives,
    '[{"name":"College Scorecard — Biology (CIP 26.0101) field-of-study median earnings & out-of-state tuition (U.S. Dept of Education)","url":"https://collegescorecard.ed.gov/search/?cip=26.0101&credential=3"},{"name":"BLS Occupational Outlook Handbook — employment & demand outlook","url":"https://www.bls.gov/ooh/"},{"name":"USCIS — STEM OPT extension & H-1B visa","url":"https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt"},{"name":"OECD AI exposure / Felten occupational AI-exposure index","url":"https://www.oecd.org/employment-outlook/"}]'::jsonb,
    'verified', today)
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
  RAISE NOTICE '%: inserted/updated', v_slug;

  -- ══════════════════════════════════════════════════════════════════════════
  -- 4. FINANCE (CIP 52.0801)
  -- ══════════════════════════════════════════════════════════════════════════
  v_slug := 'finance';
  v_salary := 55456; v_tuition := 31306; v_emp := 96;
  v_field_group := 'business'; v_stem := false;
  v_occ_match := false; v_psw_yrs := 1; v_visa_score := 42;
  v_demand_score := 75; v_ai_band := 'high';
  v_ai_note := 'Algorithmic trading, robo-advisory and automated reporting pressure routine finance work — strategy and relationship management persist.';
  v_risk := 'medium';
  v_risk_summary := 'Strong hiring in banking and corporate finance with competitive salaries, but the non-STEM visa window and AI pressure on quantitative roles are real constraints.';
  v_alternatives := ARRAY['accounting', 'economics'];
  v_payback := GREATEST(1, ROUND(v_tuition * 4 / (v_salary * 0.35)));

  INSERT INTO public.majors (slug, name, country, field_group, employment_rate, employment_score, occupation_list_match, post_study_work_years, visa_pathway_score, market_demand_score, ai_exposure_band, ai_note, median_starting_salary, avg_annual_tuition_intl, payback_years, overall_risk, risk_summary, alternatives, sources, data_confidence, last_verified)
  VALUES (v_slug, 'Finance', 'US', v_field_group, v_emp, v_emp, v_occ_match, v_psw_yrs, v_visa_score, v_demand_score, v_ai_band, v_ai_note, v_salary, v_tuition, v_payback, v_risk, v_risk_summary, v_alternatives,
    '[{"name":"College Scorecard — Finance (CIP 52.0801) field-of-study median earnings & out-of-state tuition (U.S. Dept of Education)","url":"https://collegescorecard.ed.gov/search/?cip=52.0801&credential=3"},{"name":"BLS Occupational Outlook Handbook — employment & demand outlook","url":"https://www.bls.gov/ooh/"},{"name":"USCIS — Optional Practical Training (OPT) & H-1B visa","url":"https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt"},{"name":"OECD AI exposure / Felten occupational AI-exposure index","url":"https://www.oecd.org/employment-outlook/"}]'::jsonb,
    'verified', today)
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
  RAISE NOTICE '%: inserted/updated', v_slug;

  -- ══════════════════════════════════════════════════════════════════════════
  -- 5. MARKETING (CIP 52.1401)
  -- ══════════════════════════════════════════════════════════════════════════
  v_slug := 'marketing';
  v_salary := 45529; v_tuition := 30783; v_emp := 96;
  v_field_group := 'business'; v_stem := false;
  v_occ_match := false; v_psw_yrs := 1; v_visa_score := 35;
  v_demand_score := 72; v_ai_band := 'high';
  v_ai_note := 'Content generation, ad placement and campaign analytics automate fast — brand strategy and creative direction stay human.';
  v_risk := 'medium';
  v_risk_summary := 'Broad career options with decent hiring rates, but moderate starting salaries and a 1-year visa window. AI content tools put pressure on entry-level creative and analytical roles.';
  v_alternatives := ARRAY['business-management', 'communications'];
  v_payback := GREATEST(1, ROUND(v_tuition * 4 / (v_salary * 0.35)));

  INSERT INTO public.majors (slug, name, country, field_group, employment_rate, employment_score, occupation_list_match, post_study_work_years, visa_pathway_score, market_demand_score, ai_exposure_band, ai_note, median_starting_salary, avg_annual_tuition_intl, payback_years, overall_risk, risk_summary, alternatives, sources, data_confidence, last_verified)
  VALUES (v_slug, 'Marketing', 'US', v_field_group, v_emp, v_emp, v_occ_match, v_psw_yrs, v_visa_score, v_demand_score, v_ai_band, v_ai_note, v_salary, v_tuition, v_payback, v_risk, v_risk_summary, v_alternatives,
    '[{"name":"College Scorecard — Marketing (CIP 52.1401) field-of-study median earnings & out-of-state tuition (U.S. Dept of Education)","url":"https://collegescorecard.ed.gov/search/?cip=52.1401&credential=3"},{"name":"BLS Occupational Outlook Handbook — employment & demand outlook","url":"https://www.bls.gov/ooh/"},{"name":"USCIS — Optional Practical Training (OPT) & H-1B visa","url":"https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt"},{"name":"OECD AI exposure / Felten occupational AI-exposure index","url":"https://www.oecd.org/employment-outlook/"}]'::jsonb,
    'verified', today)
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
  RAISE NOTICE '%: inserted/updated', v_slug;

  -- ══════════════════════════════════════════════════════════════════════════
  -- 6. ECONOMICS (CIP 45.0601 / 52.0601)
  -- ══════════════════════════════════════════════════════════════════════════
  v_slug := 'economics';
  v_salary := 53872; v_tuition := 36785; v_emp := 93;
  v_field_group := 'social'; v_stem := false;
  v_occ_match := false; v_psw_yrs := 1; v_visa_score := 55;
  v_demand_score := 70; v_ai_band := 'medium';
  v_ai_note := 'Economic analysis and reporting automate in part, but policy advisory and behavioural economics require human judgment.';
  v_risk := 'medium';
  v_risk_summary := 'A versatile degree with strong analytical career paths and good mid-career earnings. The visa constraints and modest entry salary balance out its strong long-term upside.';
  v_alternatives := ARRAY['finance', 'mathematics'];
  v_payback := GREATEST(1, ROUND(v_tuition * 4 / (v_salary * 0.35)));

  INSERT INTO public.majors (slug, name, country, field_group, employment_rate, employment_score, occupation_list_match, post_study_work_years, visa_pathway_score, market_demand_score, ai_exposure_band, ai_note, median_starting_salary, avg_annual_tuition_intl, payback_years, overall_risk, risk_summary, alternatives, sources, data_confidence, last_verified)
  VALUES (v_slug, 'Economics', 'US', v_field_group, v_emp, v_emp, v_occ_match, v_psw_yrs, v_visa_score, v_demand_score, v_ai_band, v_ai_note, v_salary, v_tuition, v_payback, v_risk, v_risk_summary, v_alternatives,
    '[{"name":"College Scorecard — Economics (CIP 45.0601 / 52.0601) field-of-study median earnings & out-of-state tuition (U.S. Dept of Education)","url":"https://collegescorecard.ed.gov/search/?cip=45.0601,52.0601&credential=3"},{"name":"BLS Occupational Outlook Handbook — employment & demand outlook","url":"https://www.bls.gov/ooh/"},{"name":"USCIS — Optional Practical Training (OPT) & H-1B visa","url":"https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt"},{"name":"OECD AI exposure / Felten occupational AI-exposure index","url":"https://www.oecd.org/employment-outlook/"}]'::jsonb,
    'verified', today)
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
  RAISE NOTICE '%: inserted/updated', v_slug;

  -- ══════════════════════════════════════════════════════════════════════════
  -- 7. MATHEMATICS (CIP 27.0101)
  -- ══════════════════════════════════════════════════════════════════════════
  v_slug := 'mathematics';
  v_salary := 50879; v_tuition := 34056; v_emp := 91;
  v_field_group := 'science'; v_stem := true;
  v_occ_match := true; v_psw_yrs := 3; v_visa_score := 87;
  v_demand_score := 78; v_ai_band := 'medium';
  v_ai_note := 'AI assists computation and data analysis, but mathematical reasoning, modelling, and proof-based work stay human.';
  v_risk := 'low';
  v_risk_summary := 'A highly versatile STEM degree with strong demand in data science, actuarial science and quant finance. STEM-OPT eligibility and mathematical reasoning that AI augments rather than replaces.';
  v_alternatives := ARRAY['data-analytics', 'computer-science'];
  v_payback := GREATEST(1, ROUND(v_tuition * 4 / (v_salary * 0.35)));

  INSERT INTO public.majors (slug, name, country, field_group, employment_rate, employment_score, occupation_list_match, post_study_work_years, visa_pathway_score, market_demand_score, ai_exposure_band, ai_note, median_starting_salary, avg_annual_tuition_intl, payback_years, overall_risk, risk_summary, alternatives, sources, data_confidence, last_verified)
  VALUES (v_slug, 'Mathematics', 'US', v_field_group, v_emp, v_emp, v_occ_match, v_psw_yrs, v_visa_score, v_demand_score, v_ai_band, v_ai_note, v_salary, v_tuition, v_payback, v_risk, v_risk_summary, v_alternatives,
    '[{"name":"College Scorecard — Mathematics (CIP 27.0101) field-of-study median earnings & out-of-state tuition (U.S. Dept of Education)","url":"https://collegescorecard.ed.gov/search/?cip=27.0101&credential=3"},{"name":"BLS Occupational Outlook Handbook — employment & demand outlook","url":"https://www.bls.gov/ooh/"},{"name":"USCIS — STEM OPT extension & H-1B visa","url":"https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt"},{"name":"OECD AI exposure / Felten occupational AI-exposure index","url":"https://www.oecd.org/employment-outlook/"}]'::jsonb,
    'verified', today)
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
  RAISE NOTICE '%: inserted/updated', v_slug;

  -- ══════════════════════════════════════════════════════════════════════════
  -- 8. CHEMICAL ENGINEERING (CIP 14.0701)
  -- ══════════════════════════════════════════════════════════════════════════
  v_slug := 'chemical-engineering';
  v_salary := 72351; v_tuition := 38456; v_emp := 96;
  v_field_group := 'engineering'; v_stem := true;
  v_occ_match := true; v_psw_yrs := 3; v_visa_score := 86;
  v_demand_score := 78; v_ai_band := 'low';
  v_ai_note := 'Process engineering, lab work and plant operations are hands-on — AI assists simulation but chemical process design stays human.';
  v_risk := 'low';
  v_risk_summary := 'High-paying engineering field with demand from pharma, energy and materials. STEM-OPT eligibility and strong employment rates make it a solid low-risk option.';
  v_alternatives := ARRAY['mechanical-engineering', 'biology'];
  v_payback := GREATEST(1, ROUND(v_tuition * 4 / (v_salary * 0.35)));

  INSERT INTO public.majors (slug, name, country, field_group, employment_rate, employment_score, occupation_list_match, post_study_work_years, visa_pathway_score, market_demand_score, ai_exposure_band, ai_note, median_starting_salary, avg_annual_tuition_intl, payback_years, overall_risk, risk_summary, alternatives, sources, data_confidence, last_verified)
  VALUES (v_slug, 'Chemical Engineering', 'US', v_field_group, v_emp, v_emp, v_occ_match, v_psw_yrs, v_visa_score, v_demand_score, v_ai_band, v_ai_note, v_salary, v_tuition, v_payback, v_risk, v_risk_summary, v_alternatives,
    '[{"name":"College Scorecard — Chemical Engineering (CIP 14.0701) field-of-study median earnings & out-of-state tuition (U.S. Dept of Education)","url":"https://collegescorecard.ed.gov/search/?cip=14.0701&credential=3"},{"name":"BLS Occupational Outlook Handbook — employment & demand outlook","url":"https://www.bls.gov/ooh/"},{"name":"USCIS — STEM OPT extension & H-1B visa","url":"https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt"},{"name":"OECD AI exposure / Felten occupational AI-exposure index","url":"https://www.oecd.org/employment-outlook/"}]'::jsonb,
    'verified', today)
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
  RAISE NOTICE '%: inserted/updated', v_slug;

  -- ══════════════════════════════════════════════════════════════════════════
  -- 9. COMMUNICATIONS (CIP 09.0101)
  -- ══════════════════════════════════════════════════════════════════════════
  v_slug := 'communications';
  v_salary := 35102; v_tuition := 31922; v_emp := 95;
  v_field_group := 'social'; v_stem := false;
  v_occ_match := false; v_psw_yrs := 1; v_visa_score := 30;
  v_demand_score := 60; v_ai_band := 'high';
  v_ai_note := 'Content writing, editing and media production automate fast — strategic comms, crisis management and storytelling stay human.';
  v_risk := 'medium';
  v_risk_summary := 'A broad social-sciences degree with decent employment rates but modest starting salaries. Non-STEM visa and heavy AI pressure on content roles are the main challenges.';
  v_alternatives := ARRAY['marketing', 'psychology'];
  v_payback := GREATEST(1, ROUND(v_tuition * 4 / (v_salary * 0.35)));

  INSERT INTO public.majors (slug, name, country, field_group, employment_rate, employment_score, occupation_list_match, post_study_work_years, visa_pathway_score, market_demand_score, ai_exposure_band, ai_note, median_starting_salary, avg_annual_tuition_intl, payback_years, overall_risk, risk_summary, alternatives, sources, data_confidence, last_verified)
  VALUES (v_slug, 'Communications', 'US', v_field_group, v_emp, v_emp, v_occ_match, v_psw_yrs, v_visa_score, v_demand_score, v_ai_band, v_ai_note, v_salary, v_tuition, v_payback, v_risk, v_risk_summary, v_alternatives,
    '[{"name":"College Scorecard — Communications (CIP 09.0101) field-of-study median earnings & out-of-state tuition (U.S. Dept of Education)","url":"https://collegescorecard.ed.gov/search/?cip=09.0101&credential=3"},{"name":"BLS Occupational Outlook Handbook — employment & demand outlook","url":"https://www.bls.gov/ooh/"},{"name":"USCIS — Optional Practical Training (OPT) & H-1B visa","url":"https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt"},{"name":"OECD AI exposure / Felten occupational AI-exposure index","url":"https://www.oecd.org/employment-outlook/"}]'::jsonb,
    'verified', today)
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
  RAISE NOTICE '%: inserted/updated', v_slug;

  -- ══════════════════════════════════════════════════════════════════════════
  -- 10. POLITICAL SCIENCE (CIP 45.1001)
  -- ══════════════════════════════════════════════════════════════════════════
  v_slug := 'political-science';
  v_salary := 36738; v_tuition := 34872; v_emp := 92;
  v_field_group := 'social'; v_stem := false;
  v_occ_match := false; v_psw_yrs := 1; v_visa_score := 30;
  v_demand_score := 62; v_ai_band := 'medium';
  v_ai_note := 'Policy analysis and research are AI-assisted but governance, diplomacy and advocacy require human relationships.';
  v_risk := 'medium';
  v_risk_summary := 'A strong foundation for law school, policy careers and government. Bachelor alone has modest starting salaries and a short visa runway — plan for graduate study.';
  v_alternatives := ARRAY['economics', 'communications'];
  v_payback := GREATEST(1, ROUND(v_tuition * 4 / (v_salary * 0.35)));

  INSERT INTO public.majors (slug, name, country, field_group, employment_rate, employment_score, occupation_list_match, post_study_work_years, visa_pathway_score, market_demand_score, ai_exposure_band, ai_note, median_starting_salary, avg_annual_tuition_intl, payback_years, overall_risk, risk_summary, alternatives, sources, data_confidence, last_verified)
  VALUES (v_slug, 'Political Science', 'US', v_field_group, v_emp, v_emp, v_occ_match, v_psw_yrs, v_visa_score, v_demand_score, v_ai_band, v_ai_note, v_salary, v_tuition, v_payback, v_risk, v_risk_summary, v_alternatives,
    '[{"name":"College Scorecard — Political Science (CIP 45.1001) field-of-study median earnings & out-of-state tuition (U.S. Dept of Education)","url":"https://collegescorecard.ed.gov/search/?cip=45.1001&credential=3"},{"name":"BLS Occupational Outlook Handbook — employment & demand outlook","url":"https://www.bls.gov/ooh/"},{"name":"USCIS — Optional Practical Training (OPT) & H-1B visa","url":"https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt"},{"name":"OECD AI exposure / Felten occupational AI-exposure index","url":"https://www.oecd.org/employment-outlook/"}]'::jsonb,
    'verified', today)
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
  RAISE NOTICE '%: inserted/updated', v_slug;

  -- ══════════════════════════════════════════════════════════════════════════
  -- LAYER META — set employment & roi to verified for all 10 new US majors
  -- ══════════════════════════════════════════════════════════════════════════
  FOR v_slug IN SELECT slug FROM public.majors WHERE country = 'US' AND slug IN ('mechanical-engineering','electrical-engineering','biology','finance','marketing','economics','mathematics','chemical-engineering','communications','political-science') LOOP
    UPDATE public.majors SET
      layer_meta = jsonb_build_object(
        'employment', jsonb_build_object(
          'confidence', 'verified',
          'last_verified', today,
          'source_name', 'College Scorecard Field of Study Data (06102026)',
          'source_url', 'https://collegescorecard.ed.gov/data/',
          'note', jsonb_build_object('en', 'Employment rate: share of non-enrolled graduates working 1 year post-graduation', 'ko', '취업률: 졸업 1년 후 비재학 졸업생 중 취업자 비율')
        ),
        'roi', jsonb_build_object(
          'confidence', 'verified',
          'last_verified', today,
          'source_name', 'College Scorecard Field of Study Data (06102026)',
          'source_url', 'https://collegescorecard.ed.gov/data/',
          'note', jsonb_build_object(
            'en', 'Salary: median earnings 1 year post-graduation (all institutions). Tuition: out-of-state tuition as proxy for international costs.',
            'ko', '급여: 졸업 1년 후 중위 소득(전체 기관). 학비: 국제학생 비용 대용으로 out-of-state 등록금 사용.'
          )
        ),
        'visa', jsonb_build_object(
          'confidence', 'estimate',
          'last_verified', NULL,
          'source_name', 'USCIS STEM OPT & H-1B guidance',
          'source_url', 'https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt',
          'note', NULL
        ),
        'demand', jsonb_build_object(
          'confidence', 'estimate',
          'last_verified', NULL,
          'source_name', 'BLS Occupational Outlook Handbook',
          'source_url', 'https://www.bls.gov/ooh/',
          'note', NULL
        ),
        'ai_exposure', jsonb_build_object(
          'confidence', 'estimate',
          'last_verified', NULL,
          'source_name', 'OECD AI exposure / Felten occupational AI-exposure index',
          'source_url', 'https://www.oecd.org/employment-outlook/',
          'note', NULL
        )
      )
    WHERE slug = v_slug AND country = 'US';
  END LOOP;

  RAISE NOTICE 'All 10 new US majors inserted/updated with layer_meta.';

END $$;

-- ── Verify ──────────────────────────────────────────────────────────────────
SELECT slug, name, median_starting_salary, avg_annual_tuition_intl, employment_rate, payback_years, overall_risk, data_confidence, last_verified
FROM public.majors WHERE country = 'US' ORDER BY slug;
