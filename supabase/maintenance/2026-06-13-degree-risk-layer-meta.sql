-- ============================================================================
-- Degree Risk — per-layer confidence/source metadata (layer_meta) — 13 Jun 2026
-- REVIEW BEFORE RUNNING. Nothing in this file has been executed.
--
-- Purpose
--   Move confidence/source/as-of from row-level (data_confidence, last_verified)
--   to PER-LAYER, so employment / visa / demand / ai_exposure / roi can each
--   carry their own source + verification date. This is the "vessel" only —
--   NO metric values or scores are changed. All layers start as 'estimate'
--   with last_verified = null; source_name/source_url are materialized from the
--   existing `sources` array using the (corrected) layer→source mapping, so the
--   visa layer points at the visa source for every country (incl. US/CA).
--
-- Shape of public.majors.layer_meta (jsonb):
--   {
--     "employment":  { "confidence":"estimate","last_verified":null,"source_name":"...","source_url":"...","note":null },
--     "visa":        { ... }, "demand": { ... }, "ai_exposure": { ... }, "roi": { ... }
--   }
--
-- sources are uniform across all 10 majors within each country (verified
-- 2026-06-13), so one UPDATE per country backfills all 10 rows.
-- ============================================================================

-- ── PRE-FLIGHT ─────────────────────────────────────────────────────────────
SELECT count(*) AS total_rows FROM public.majors;            -- expect 50
SELECT column_name FROM information_schema.columns
WHERE table_schema='public' AND table_name='majors' AND column_name='layer_meta';  -- expect 0 rows (not yet added)

BEGIN;

ALTER TABLE public.majors ADD COLUMN IF NOT EXISTS layer_meta jsonb;

-- Row-level confidence is superseded by layer_meta. Kept for now (not dropped).
COMMENT ON COLUMN public.majors.data_confidence IS 'DEPRECATED 2026-06-13: superseded by layer_meta.<layer>.confidence';
COMMENT ON COLUMN public.majors.last_verified   IS 'DEPRECATED 2026-06-13: superseded by layer_meta.<layer>.last_verified';

-- ── UNITED STATES ────────────────────────────────────────────────────────
UPDATE public.majors SET layer_meta = jsonb_build_object(
  'employment', jsonb_build_object('confidence','estimate','last_verified',null,'note',null,
    'source_name','College Scorecard — tuition, median earnings & graduate outcomes (U.S. Dept of Education)',
    'source_url','https://collegescorecard.ed.gov/'),
  'visa', jsonb_build_object('confidence','estimate','last_verified',null,'note',null,
    'source_name','USCIS — STEM OPT extension & H-1B visa',
    'source_url','https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt'),
  'demand', jsonb_build_object('confidence','estimate','last_verified',null,'note',null,
    'source_name','BLS Occupational Outlook Handbook — employment & demand outlook',
    'source_url','https://www.bls.gov/ooh/'),
  'ai_exposure', jsonb_build_object('confidence','estimate','last_verified',null,'note',null,
    'source_name','OECD AI exposure / Felten occupational AI-exposure index',
    'source_url','https://www.oecd.org/employment-outlook/'),
  'roi', jsonb_build_object('confidence','estimate','last_verified',null,'note',null,
    'source_name','College Scorecard — tuition, median earnings & graduate outcomes (U.S. Dept of Education)',
    'source_url','https://collegescorecard.ed.gov/')
) WHERE country = 'US';

-- ── CANADA ─────────────────────────────────────────────────────────────────
UPDATE public.majors SET layer_meta = jsonb_build_object(
  'employment', jsonb_build_object('confidence','estimate','last_verified',null,'note',null,
    'source_name','Statistics Canada — graduate employment & earnings',
    'source_url','https://www.statcan.gc.ca/'),
  'visa', jsonb_build_object('confidence','estimate','last_verified',null,'note',null,
    'source_name','IRCC — Post-Graduation Work Permit & Express Entry category-based selection',
    'source_url','https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation.html'),
  'demand', jsonb_build_object('confidence','estimate','last_verified',null,'note',null,
    'source_name','Job Bank — labour market outlook by occupation',
    'source_url','https://www.jobbank.gc.ca/trend-analysis'),
  'ai_exposure', jsonb_build_object('confidence','estimate','last_verified',null,'note',null,
    'source_name','OECD AI exposure / Felten occupational AI-exposure index',
    'source_url','https://www.oecd.org/employment-outlook/'),
  'roi', jsonb_build_object('confidence','estimate','last_verified',null,'note',null,
    'source_name','Statistics Canada — graduate employment & earnings',
    'source_url','https://www.statcan.gc.ca/')
) WHERE country = 'CA';

-- ── UNITED KINGDOM ───────────────────────────────────────────────────────
UPDATE public.majors SET layer_meta = jsonb_build_object(
  'employment', jsonb_build_object('confidence','estimate','last_verified',null,'note',null,
    'source_name','HESA Graduate Outcomes Survey',
    'source_url','https://www.hesa.ac.uk/data-and-analysis/graduates'),
  'visa', jsonb_build_object('confidence','estimate','last_verified',null,'note',null,
    'source_name','GOV.UK — Graduate Route & Skilled Worker / Immigration Salary List (UKVI)',
    'source_url','https://www.gov.uk/graduate-visa'),
  'demand', jsonb_build_object('confidence','estimate','last_verified',null,'note',null,
    'source_name','ONS labour market overview — demand',
    'source_url','https://www.ons.gov.uk/employmentandlabourmarket'),
  'ai_exposure', jsonb_build_object('confidence','estimate','last_verified',null,'note',null,
    'source_name','OECD AI exposure / Felten occupational AI-exposure index',
    'source_url','https://www.oecd.org/employment-outlook/'),
  'roi', jsonb_build_object('confidence','estimate','last_verified',null,'note',null,
    'source_name','Discover Uni — tuition & graduate salary data',
    'source_url','https://discoveruni.gov.uk/')
) WHERE country = 'UK';

-- ── AUSTRALIA ────────────────────────────────────────────────────────────
UPDATE public.majors SET layer_meta = jsonb_build_object(
  'employment', jsonb_build_object('confidence','estimate','last_verified',null,'note',null,
    'source_name','QILT Graduate Outcomes Survey 2024 — full-time employment by study area',
    'source_url','https://www.qilt.edu.au/surveys/graduate-outcomes-survey-(gos)'),
  'visa', jsonb_build_object('confidence','estimate','last_verified',null,'note',null,
    'source_name','Core Skills Occupation List (CSOL) — Dept of Home Affairs',
    'source_url','https://immi.homeaffairs.gov.au/Documents/core-sol.pdf'),
  'demand', jsonb_build_object('confidence','estimate','last_verified',null,'note',null,
    'source_name','Jobs and Skills Australia — labour market outlook',
    'source_url','https://www.jobsandskills.gov.au/'),
  'ai_exposure', jsonb_build_object('confidence','estimate','last_verified',null,'note',null,
    'source_name','OECD AI exposure / Felten occupational AI-exposure index',
    'source_url','https://www.oecd.org/employment-outlook/'),
  'roi', jsonb_build_object('confidence','estimate','last_verified',null,'note',null,
    'source_name','CRICOS — course tuition registry',
    'source_url','https://cricos.education.gov.au/')
) WHERE country = 'AU';

-- ── IRELAND ──────────────────────────────────────────────────────────────
UPDATE public.majors SET layer_meta = jsonb_build_object(
  'employment', jsonb_build_object('confidence','estimate','last_verified',null,'note',null,
    'source_name','HEA Graduate Outcomes Survey, Class of 2024',
    'source_url','https://hea.ie/statistics/graduate-outcomes/key-findings-go-2024/'),
  'visa', jsonb_build_object('confidence','estimate','last_verified',null,'note',null,
    'source_name','Critical Skills Occupations List — Dept of Enterprise',
    'source_url','https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/employment-permit-eligibility/highly-skilled-eligible-occupations-list/'),
  'demand', jsonb_build_object('confidence','estimate','last_verified',null,'note',null,
    'source_name','EGFSN — labour market and future skills forecasts',
    'source_url','https://www.skillsireland.ie/'),
  'ai_exposure', jsonb_build_object('confidence','estimate','last_verified',null,'note',null,
    'source_name','OECD AI exposure / Felten occupational AI-exposure index',
    'source_url','https://www.oecd.org/employment-outlook/'),
  'roi', jsonb_build_object('confidence','estimate','last_verified',null,'note',null,
    'source_name','CSO Ireland — graduate earnings',
    'source_url','https://www.cso.ie/')
) WHERE country = 'IE';

-- ── POST-FLIGHT — expect 50 rows, each with all 5 layer keys ───────────────
SELECT count(*) AS rows_with_all_5_layers
FROM public.majors
WHERE layer_meta ?& array['employment','visa','demand','ai_exposure','roi'];  -- expect 50

SELECT country,
       layer_meta->'visa'->>'source_name'   AS visa_source,
       layer_meta->'roi'->>'source_name'    AS roi_source,
       layer_meta->'employment'->>'confidence' AS emp_conf
FROM public.majors GROUP BY country, visa_source, roi_source, emp_conf ORDER BY country;

COMMIT;
