-- ============================================================================
-- Degree Risk data verification — 12 June 2026
-- REVIEW BEFORE RUNNING. Nothing in this file has been executed.
--
-- Scope of this pass (what could actually be verified from primary/secondary
-- web sources on 12 Jun 2026):
--
--   VERIFIED  — visa layer: 485 / Stamp 1G durations, occupation-list
--               membership for the occupations listed per-section below.
--   NOT VERIFIED — per-field employment rates and median starting salaries.
--               The QILT and HEA per-field tables are published as
--               PDF/XLSX downloads that were unreachable from the build
--               sandbox (qilt.edu.au and mirrors return HTTP 403 to
--               non-browser clients). Only headline figures could be
--               confirmed via search snippets; they are recorded in the
--               comments below as anchors, NOT applied as updates.
--
-- The sandbox also has no Supabase credentials, so the "current seeded
-- value" column could not be read. Run the PRE-FLIGHT query first and
-- compare against the VERIFIED FACTS section before applying anything.
-- ============================================================================

-- ── PRE-FLIGHT: capture current seeded values for the diff ─────────────────
SELECT slug, country, employment_rate, median_starting_salary,
       occupation_list_match, post_study_work_years,
       data_confidence, last_verified
FROM public.majors
ORDER BY country, slug;

-- ============================================================================
-- VERIFIED FACTS (12 Jun 2026) — with sources
-- ============================================================================
-- AUSTRALIA — QILT Graduate Outcomes Survey
--   Latest release: 2024 GOS national report ("Short-term Graduate Outcomes
--   in Australia"); 2024 GOS International Report published September 2025.
--   • Domestic undergraduate full-time employment rate: 74.0% in 2024
--     (down from 79.0% in 2023).
--   • Per-study-area rates: in Table 6 of the national report — NOT
--     retrievable from this sandbox (403). Source to verify against:
--     https://www.qilt.edu.au/docs/default-source/default-document-library/2024-gos-national-report.pdf
--     https://www.qilt.edu.au/docs/default-source/default-document-library/2024-gos-international-report.pdf
--
-- AUSTRALIA — visa layer
--   • Temporary Graduate (485) Post-Higher Education Work stream:
--     bachelor = 2 years, masters = 2–3 years, age limit under 35.
--     https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-graduate-485/post-higher-education-work
--   • Core Skills Occupation List (CSOL, ~456 occupations):
--     CONFIRMED on list: Software Engineer (261313), Registered Nurse,
--     Civil Engineer.
--     NOT CONFIRMED this pass: Accountant (General), Psychologist,
--     Data Scientist/Analyst, Web/UX Designer, Musician, ICT Business
--     Analyst — check the official instrument before updating those rows:
--     https://immi.homeaffairs.gov.au/Documents/core-sol.pdf
--
-- IRELAND — HEA Graduate Outcomes Survey
--   Latest release: Class of 2024, published 27 November 2025.
--   • Overall: 80.2% of graduates in employment nine months after
--     graduation (Class of 2023: 80.0%; Class of 2022: 83.0%).
--   • Highest field: Education 91.6%. Lowest: Arts & Humanities 63.1%.
--   • Salary: 55.3% of disclosing graduates earned over €40,000.
--   • Full per-field table: https://hea.ie/statistics/graduate-outcomes/key-findings-go-2024/
--
-- IRELAND — visa layer
--   • Stamp 1G (Third Level Graduate Programme): Level 8 = 12 months
--     (non-renewable); Level 9 = up to 24 months (12 + 12 renewal).
--     https://www.irishimmigration.ie/my-situation-has-changed-since-i-arrived-in-ireland/third-level-graduate-programme/
--   • Critical Skills Occupations List (last consultation closed
--     19 Sep 2025; CSEP minimum salary €40,904 from 1 Mar 2026):
--     CONFIRMED on list: software developers/engineers, data
--     analysts/scientists, registered nurses, civil engineers,
--     chartered/qualified accountants.
--     NOT CONFIRMED this pass: psychologists, UX designers, musicians,
--     general business roles — check before updating those rows:
--     https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/employment-permit-eligibility/highly-skilled-eligible-occupations-list/
-- ============================================================================

BEGIN;

-- ── SECTION 1 — Visa layer, VERIFIED 2026-06-12 ────────────────────────────
-- Assumes country codes 'AU'/'IE' and kebab-case slugs; adjust if the
-- seeded data differs (see pre-flight output).
-- post_study_work_years here = post-study work rights following a
-- bachelor-level award. If the seeded column means something else
-- (e.g. masters-level max), do not apply these two statements.

UPDATE public.majors SET
  post_study_work_years = 2,
  sources = jsonb_set(COALESCE(sources, '{}'::jsonb), '{visa}', jsonb_build_object(
    'label', 'Temporary Graduate visa (485), Post-Higher Education Work stream — Dept of Home Affairs',
    'url', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-graduate-485/post-higher-education-work',
    'verified', '2026-06-12'))
WHERE country = 'AU';

UPDATE public.majors SET
  post_study_work_years = 1,
  sources = jsonb_set(COALESCE(sources, '{}'::jsonb), '{visa}', jsonb_build_object(
    'label', 'Stamp 1G, Third Level Graduate Programme — Irish Immigration Service',
    'url', 'https://www.irishimmigration.ie/my-situation-has-changed-since-i-arrived-in-ireland/third-level-graduate-programme/',
    'verified', '2026-06-12'))
WHERE country = 'IE';

-- Occupation-list membership — only the occupations confirmed this pass.
UPDATE public.majors SET occupation_list_match = true
WHERE country = 'AU'
  AND slug IN ('computer-science', 'software-engineering',  -- Software Engineer 261313 on CSOL
               'nursing',                                    -- Registered Nurse on CSOL
               'civil-engineering');                         -- Civil Engineer on CSOL

UPDATE public.majors SET occupation_list_match = true
WHERE country = 'IE'
  AND slug IN ('computer-science', 'software-engineering',  -- software developers/engineers on CSL
               'data-analytics',                             -- data analysts/scientists on CSL
               'nursing',                                    -- registered nurses on CSL
               'civil-engineering',                          -- civil engineers on CSL
               'accounting');                                -- qualified accountants on CSL

-- ── SECTION 2 — Employment rate & salary: PENDING, do not run as-is ────────
-- Could not be verified from this sandbox (primary tables unreachable).
-- Template per row once the QILT Table 6 / HEA GO-2024 field tables are in
-- hand — fill <...> and uncomment:
--
-- UPDATE public.majors SET
--   employment_rate = <verified %>,
--   median_starting_salary = <verified salary>,
--   sources = jsonb_set(COALESCE(sources, '{}'::jsonb), '{employment}', jsonb_build_object(
--     'label', '<QILT 2024 GOS national report | HEA Graduate Outcomes, Class of 2024>',
--     'url', '<report url>',
--     'verified', '2026-06-12'))
-- WHERE slug = '<slug>' AND country = '<AU|IE>';

-- ── SECTION 3 — Confidence flags ───────────────────────────────────────────
-- Intentionally NOT setting data_confidence='verified' on any row in this
-- pass: a row is only "verified" once its employment and salary figures
-- (Section 2) are confirmed against the primary tables, not just the visa
-- layer. Once Section 2 is filled in for a row, append it here:
--
-- UPDATE public.majors SET data_confidence = 'verified', last_verified = '2026-06-12'
-- WHERE (slug, country) IN ( <fully verified rows only> );

COMMIT;
