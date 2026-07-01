-- ============================================================================
-- US Degree Risk — Data Verification via College Scorecard
-- Date: 2026-06-30
--
-- Updates 10 US majors with verified data from College Scorecard
-- Field of Study Data (Most-Recent-Cohorts-Field-of-Study_06102026).
--
-- Sources:
--   - College Scorecard Field of Study Data: https://collegescorecard.ed.gov/data/
--   - Earnings: EARN_MDN_1YR (median earnings 1 year post-graduation, bachelor's)
--   - Tuition: TUITIONFEE_OUT (out-of-state tuition as proxy for international costs)
--   - Employment: WNE/(WNE+NWNE) ratio 1 year post-graduation
--
-- Run: psql or Supabase SQL Editor
-- ============================================================================

-- Helper: compute payback years (total tuition / annual savings at 35% of salary)
-- total_tuition = tuition * 4 years; annual_savings = salary * 0.35

DO $$
DECLARE
  today TEXT := '2026-06-30';
  v_slug TEXT;
  v_salary INT;
  v_tuition INT;
  v_emp INT;
  v_payback INT;
BEGIN

  -- ── computer-science: CIP 11.0701 ─────────────────────────────────────────
  v_slug := 'computer-science'; v_salary := 73404; v_tuition := 34779; v_emp := 93;
  v_payback := GREATEST(1, ROUND(v_tuition * 4 / (v_salary * 0.35)));
  UPDATE public.majors SET
    median_starting_salary = v_salary,
    avg_annual_tuition_intl = v_tuition,
    employment_rate = v_emp,
    employment_score = v_emp,
    payback_years = v_payback,
    data_confidence = 'verified',
    last_verified = today,
    sources = COALESCE(sources, '[]'::jsonb) || jsonb_build_array(
      jsonb_build_object(
        'name', 'College Scorecard — Computer Science (CIP 11.0701) field-of-study median earnings & out-of-state tuition (U.S. Dept of Education)',
        'url', 'https://collegescorecard.ed.gov/search/?cip=11.0701&credential=3'
      )
    ),
    layer_meta = jsonb_set(
      COALESCE(layer_meta, '{}'::jsonb),
      '{employment}',
      jsonb_build_object(
        'confidence', 'verified',
        'last_verified', today,
        'source_name', 'College Scorecard Field of Study Data (06102026)',
        'source_url', 'https://collegescorecard.ed.gov/data/',
        'note', jsonb_build_object('en', 'Employment rate: share of non-enrolled graduates working 1 year post-graduation', 'ko', '취업률: 졸업 1년 후 비재학 졸업생 중 취업자 비율')
      )
    )
  WHERE slug = v_slug AND country = 'US';
  RAISE NOTICE '%: salary=$%, tuition=$%, emp=%, payback=%yr → verified', v_slug, v_salary, v_tuition, v_emp, v_payback;

  -- ── data-analytics: proxied by CIP 11.0701, 30.7001, 30.7100 ──────────────
  v_slug := 'data-analytics'; v_salary := 72111; v_tuition := 34765; v_emp := 93;
  v_payback := GREATEST(1, ROUND(v_tuition * 4 / (v_salary * 0.35)));
  UPDATE public.majors SET
    median_starting_salary = v_salary,
    avg_annual_tuition_intl = v_tuition,
    employment_rate = v_emp,
    employment_score = v_emp,
    payback_years = v_payback,
    data_confidence = 'verified',
    last_verified = today,
    sources = COALESCE(sources, '[]'::jsonb) || jsonb_build_array(
      jsonb_build_object(
        'name', 'College Scorecard — Data Analytics (proxied by CIP 11.0701 & 27.0501) field-of-study data (U.S. Dept of Education)',
        'url', 'https://collegescorecard.ed.gov/search/?cip=11.0701,27.0501&credential=3'
      )
    ),
    layer_meta = jsonb_set(
      COALESCE(layer_meta, '{}'::jsonb),
      '{employment}',
      jsonb_build_object(
        'confidence', 'verified',
        'last_verified', today,
        'source_name', 'College Scorecard Field of Study Data (06102026)',
        'source_url', 'https://collegescorecard.ed.gov/data/',
        'note', jsonb_build_object('en', 'Employment rate: share of non-enrolled graduates working 1 year post-graduation', 'ko', '취업률: 졸업 1년 후 비재학 졸업생 중 취업자 비율')
      )
    )
  WHERE slug = v_slug AND country = 'US';
  RAISE NOTICE '%: salary=$%, tuition=$%, emp=%, payback=%yr → verified', v_slug, v_salary, v_tuition, v_emp, v_payback;

  -- ── software-engineering: proxied by CIP 11.0701, 14.0901, 14.1001 ────────
  v_slug := 'software-engineering'; v_salary := 76067; v_tuition := 34087; v_emp := 94;
  v_payback := GREATEST(1, ROUND(v_tuition * 4 / (v_salary * 0.35)));
  UPDATE public.majors SET
    median_starting_salary = v_salary,
    avg_annual_tuition_intl = v_tuition,
    employment_rate = v_emp,
    employment_score = v_emp,
    payback_years = v_payback,
    data_confidence = 'verified',
    last_verified = today,
    sources = COALESCE(sources, '[]'::jsonb) || jsonb_build_array(
      jsonb_build_object(
        'name', 'College Scorecard — Software Engineering (proxied by CIP 11.0701, 14.0901, 14.1001) field-of-study data (U.S. Dept of Education)',
        'url', 'https://collegescorecard.ed.gov/search/?cip=11.0701,14.0901,14.1001&credential=3'
      )
    ),
    layer_meta = jsonb_set(
      COALESCE(layer_meta, '{}'::jsonb),
      '{employment}',
      jsonb_build_object(
        'confidence', 'verified',
        'last_verified', today,
        'source_name', 'College Scorecard Field of Study Data (06102026)',
        'source_url', 'https://collegescorecard.ed.gov/data/',
        'note', jsonb_build_object('en', 'Employment rate: share of non-enrolled graduates working 1 year post-graduation', 'ko', '취업률: 졸업 1년 후 비재학 졸업생 중 취업자 비율')
      )
    )
  WHERE slug = v_slug AND country = 'US';
  RAISE NOTICE '%: salary=$%, tuition=$%, emp=%, payback=%yr → verified', v_slug, v_salary, v_tuition, v_emp, v_payback;

  -- ── nursing: CIP 51.3801 ──────────────────────────────────────────────────
  v_slug := 'nursing'; v_salary := 75419; v_tuition := 26856; v_emp := 98;
  v_payback := GREATEST(1, ROUND(v_tuition * 4 / (v_salary * 0.35)));
  UPDATE public.majors SET
    median_starting_salary = v_salary,
    avg_annual_tuition_intl = v_tuition,
    employment_rate = v_emp,
    employment_score = v_emp,
    payback_years = v_payback,
    data_confidence = 'verified',
    last_verified = today,
    sources = COALESCE(sources, '[]'::jsonb) || jsonb_build_array(
      jsonb_build_object(
        'name', 'College Scorecard — Registered Nursing (CIP 51.3801) field-of-study median earnings & out-of-state tuition (U.S. Dept of Education)',
        'url', 'https://collegescorecard.ed.gov/search/?cip=51.3801&credential=3'
      )
    ),
    layer_meta = jsonb_set(
      COALESCE(layer_meta, '{}'::jsonb),
      '{employment}',
      jsonb_build_object(
        'confidence', 'verified',
        'last_verified', today,
        'source_name', 'College Scorecard Field of Study Data (06102026)',
        'source_url', 'https://collegescorecard.ed.gov/data/',
        'note', jsonb_build_object('en', 'Employment rate: share of non-enrolled graduates working 1 year post-graduation', 'ko', '취업률: 졸업 1년 후 비재학 졸업생 중 취업자 비율')
      )
    )
  WHERE slug = v_slug AND country = 'US';
  RAISE NOTICE '%: salary=$%, tuition=$%, emp=%, payback=%yr → verified', v_slug, v_salary, v_tuition, v_emp, v_payback;

  -- ── civil-engineering: CIP 14.0801 ────────────────────────────────────────
  v_slug := 'civil-engineering'; v_salary := 69072; v_tuition := 34006; v_emp := 97;
  v_payback := GREATEST(1, ROUND(v_tuition * 4 / (v_salary * 0.35)));
  UPDATE public.majors SET
    median_starting_salary = v_salary,
    avg_annual_tuition_intl = v_tuition,
    employment_rate = v_emp,
    employment_score = v_emp,
    payback_years = v_payback,
    data_confidence = 'verified',
    last_verified = today,
    sources = COALESCE(sources, '[]'::jsonb) || jsonb_build_array(
      jsonb_build_object(
        'name', 'College Scorecard — Civil Engineering (CIP 14.0801) field-of-study median earnings & out-of-state tuition (U.S. Dept of Education)',
        'url', 'https://collegescorecard.ed.gov/search/?cip=14.0801&credential=3'
      )
    ),
    layer_meta = jsonb_set(
      COALESCE(layer_meta, '{}'::jsonb),
      '{employment}',
      jsonb_build_object(
        'confidence', 'verified',
        'last_verified', today,
        'source_name', 'College Scorecard Field of Study Data (06102026)',
        'source_url', 'https://collegescorecard.ed.gov/data/',
        'note', jsonb_build_object('en', 'Employment rate: share of non-enrolled graduates working 1 year post-graduation', 'ko', '취업률: 졸업 1년 후 비재학 졸업생 중 취업자 비율')
      )
    )
  WHERE slug = v_slug AND country = 'US';
  RAISE NOTICE '%: salary=$%, tuition=$%, emp=%, payback=%yr → verified', v_slug, v_salary, v_tuition, v_emp, v_payback;

  -- ── business-management: CIP 52.0101, 52.0201 ─────────────────────────────
  v_slug := 'business-management'; v_salary := 47119; v_tuition := 27773; v_emp := 94;
  v_payback := GREATEST(1, ROUND(v_tuition * 4 / (v_salary * 0.35)));
  UPDATE public.majors SET
    median_starting_salary = v_salary,
    avg_annual_tuition_intl = v_tuition,
    employment_rate = v_emp,
    employment_score = v_emp,
    payback_years = v_payback,
    data_confidence = 'verified',
    last_verified = today,
    sources = COALESCE(sources, '[]'::jsonb) || jsonb_build_array(
      jsonb_build_object(
        'name', 'College Scorecard — Business (CIP 52.0101, 52.0201) field-of-study median earnings & out-of-state tuition (U.S. Dept of Education)',
        'url', 'https://collegescorecard.ed.gov/search/?cip=52.0101,52.0201&credential=3'
      )
    ),
    layer_meta = jsonb_set(
      COALESCE(layer_meta, '{}'::jsonb),
      '{employment}',
      jsonb_build_object(
        'confidence', 'verified',
        'last_verified', today,
        'source_name', 'College Scorecard Field of Study Data (06102026)',
        'source_url', 'https://collegescorecard.ed.gov/data/',
        'note', jsonb_build_object('en', 'Employment rate: share of non-enrolled graduates working 1 year post-graduation', 'ko', '취업률: 졸업 1년 후 비재학 졸업생 중 취업자 비율')
      )
    )
  WHERE slug = v_slug AND country = 'US';
  RAISE NOTICE '%: salary=$%, tuition=$%, emp=%, payback=%yr → verified', v_slug, v_salary, v_tuition, v_emp, v_payback;

  -- ── accounting: CIP 52.0301 ───────────────────────────────────────────────
  v_slug := 'accounting'; v_salary := 53755; v_tuition := 29618; v_emp := 94;
  v_payback := GREATEST(1, ROUND(v_tuition * 4 / (v_salary * 0.35)));
  UPDATE public.majors SET
    median_starting_salary = v_salary,
    avg_annual_tuition_intl = v_tuition,
    employment_rate = v_emp,
    employment_score = v_emp,
    payback_years = v_payback,
    data_confidence = 'verified',
    last_verified = today,
    sources = COALESCE(sources, '[]'::jsonb) || jsonb_build_array(
      jsonb_build_object(
        'name', 'College Scorecard — Accounting (CIP 52.0301) field-of-study median earnings & out-of-state tuition (U.S. Dept of Education)',
        'url', 'https://collegescorecard.ed.gov/search/?cip=52.0301&credential=3'
      )
    ),
    layer_meta = jsonb_set(
      COALESCE(layer_meta, '{}'::jsonb),
      '{employment}',
      jsonb_build_object(
        'confidence', 'verified',
        'last_verified', today,
        'source_name', 'College Scorecard Field of Study Data (06102026)',
        'source_url', 'https://collegescorecard.ed.gov/data/',
        'note', jsonb_build_object('en', 'Employment rate: share of non-enrolled graduates working 1 year post-graduation', 'ko', '취업률: 졸업 1년 후 비재학 졸업생 중 취업자 비율')
      )
    )
  WHERE slug = v_slug AND country = 'US';
  RAISE NOTICE '%: salary=$%, tuition=$%, emp=%, payback=%yr → verified', v_slug, v_salary, v_tuition, v_emp, v_payback;

  -- ── ux-design: proxied by CIP 50.0401 (Design and Applied Arts) ────────────
  v_slug := 'ux-design'; v_salary := 33413; v_tuition := 32054; v_emp := 90;
  v_payback := GREATEST(1, ROUND(v_tuition * 4 / (v_salary * 0.35)));
  UPDATE public.majors SET
    median_starting_salary = v_salary,
    avg_annual_tuition_intl = v_tuition,
    employment_rate = v_emp,
    employment_score = v_emp,
    payback_years = v_payback,
    data_confidence = 'verified',
    last_verified = today,
    sources = COALESCE(sources, '[]'::jsonb) || jsonb_build_array(
      jsonb_build_object(
        'name', 'College Scorecard — UX Design (proxied by CIP 50.0401 Design and Applied Arts) field-of-study data (U.S. Dept of Education)',
        'url', 'https://collegescorecard.ed.gov/search/?cip=50.0401&credential=3'
      )
    ),
    layer_meta = jsonb_set(
      COALESCE(layer_meta, '{}'::jsonb),
      '{employment}',
      jsonb_build_object(
        'confidence', 'verified',
        'last_verified', today,
        'source_name', 'College Scorecard Field of Study Data (06102026)',
        'source_url', 'https://collegescorecard.ed.gov/data/',
        'note', jsonb_build_object('en', 'Employment rate: share of non-enrolled graduates working 1 year post-graduation', 'ko', '취업률: 졸업 1년 후 비재학 졸업생 중 취업자 비율')
      )
    )
  WHERE slug = v_slug AND country = 'US';
  RAISE NOTICE '%: salary=$%, tuition=$%, emp=%, payback=%yr → verified', v_slug, v_salary, v_tuition, v_emp, v_payback;

  -- ── psychology: CIP 42.0101 ───────────────────────────────────────────────
  v_slug := 'psychology'; v_salary := 31713; v_tuition := 32488; v_emp := 92;
  v_payback := GREATEST(1, ROUND(v_tuition * 4 / (v_salary * 0.35)));
  UPDATE public.majors SET
    median_starting_salary = v_salary,
    avg_annual_tuition_intl = v_tuition,
    employment_rate = v_emp,
    employment_score = v_emp,
    payback_years = v_payback,
    data_confidence = 'verified',
    last_verified = today,
    sources = COALESCE(sources, '[]'::jsonb) || jsonb_build_array(
      jsonb_build_object(
        'name', 'College Scorecard — Psychology (CIP 42.0101) field-of-study median earnings & out-of-state tuition (U.S. Dept of Education)',
        'url', 'https://collegescorecard.ed.gov/search/?cip=42.0101&credential=3'
      )
    ),
    layer_meta = jsonb_set(
      COALESCE(layer_meta, '{}'::jsonb),
      '{employment}',
      jsonb_build_object(
        'confidence', 'verified',
        'last_verified', today,
        'source_name', 'College Scorecard Field of Study Data (06102026)',
        'source_url', 'https://collegescorecard.ed.gov/data/',
        'note', jsonb_build_object('en', 'Employment rate: share of non-enrolled graduates working 1 year post-graduation', 'ko', '취업률: 졸업 1년 후 비재학 졸업생 중 취업자 비율')
      )
    )
  WHERE slug = v_slug AND country = 'US';
  RAISE NOTICE '%: salary=$%, tuition=$%, emp=%, payback=%yr → verified', v_slug, v_salary, v_tuition, v_emp, v_payback;

  -- ── music: CIP 50.0901 ────────────────────────────────────────────────────
  v_slug := 'music'; v_salary := 28062; v_tuition := 34134; v_emp := 90;
  v_payback := GREATEST(1, ROUND(v_tuition * 4 / (v_salary * 0.35)));
  UPDATE public.majors SET
    median_starting_salary = v_salary,
    avg_annual_tuition_intl = v_tuition,
    employment_rate = v_emp,
    employment_score = v_emp,
    payback_years = v_payback,
    data_confidence = 'verified',
    last_verified = today,
    sources = COALESCE(sources, '[]'::jsonb) || jsonb_build_array(
      jsonb_build_object(
        'name', 'College Scorecard — Music (CIP 50.0901) field-of-study median earnings & out-of-state tuition (U.S. Dept of Education)',
        'url', 'https://collegescorecard.ed.gov/search/?cip=50.0901&credential=3'
      )
    ),
    layer_meta = jsonb_set(
      COALESCE(layer_meta, '{}'::jsonb),
      '{employment}',
      jsonb_build_object(
        'confidence', 'verified',
        'last_verified', today,
        'source_name', 'College Scorecard Field of Study Data (06102026)',
        'source_url', 'https://collegescorecard.ed.gov/data/',
        'note', jsonb_build_object('en', 'Employment rate: share of non-enrolled graduates working 1 year post-graduation', 'ko', '취업률: 졸업 1년 후 비재학 졸업생 중 취업자 비율')
      )
    )
  WHERE slug = v_slug AND country = 'US';
  RAISE NOTICE '%: salary=$%, tuition=$%, emp=%, payback=%yr → verified', v_slug, v_salary, v_tuition, v_emp, v_payback;

  -- ── ROI layer: update all 10 majors ───────────────────────────────────────
  FOR v_slug IN SELECT slug FROM public.majors WHERE country = 'US' LOOP
    UPDATE public.majors SET
      layer_meta = jsonb_set(
        layer_meta,
        '{roi}',
        jsonb_build_object(
          'confidence', 'verified',
          'last_verified', today,
          'source_name', 'College Scorecard Field of Study Data (06102026)',
          'source_url', 'https://collegescorecard.ed.gov/data/',
          'note', jsonb_build_object(
            'en', 'Salary: median earnings 1 year post-graduation (all institutions). Tuition: out-of-state tuition as proxy for international costs.',
            'ko', '급여: 졸업 1년 후 중위 소득(전체 기관). 학비: 국제학생 비용 대용으로 out-of-state 등록금 사용.'
          )
        )
      )
    WHERE slug = v_slug AND country = 'US';
  END LOOP;

  RAISE NOTICE 'All US majors updated to verified.';
END $$;

-- Verify
SELECT slug, median_starting_salary, avg_annual_tuition_intl, employment_rate, payback_years, data_confidence, last_verified
FROM public.majors WHERE country = 'US' ORDER BY slug;
