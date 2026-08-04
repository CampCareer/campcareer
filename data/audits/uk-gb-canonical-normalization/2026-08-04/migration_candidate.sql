-- Migration Candidate: UK → GB Canonical Normalization
-- Task: 10.8A UK/GB Canonical Normalization Plan
-- Date: 2026-08-04
-- Branch: audit/uk-gb-canonical-normalization-v1
-- Git Commit: 40e0848a52ef306e32387a15e2665862a382055
-- Supabase Project: babylusxcknjerxtepoc
-- Case: A (UK row exists in core.countries; no GB row exists)
--
-- IMPORTANT: This is a DRY-RUN candidate only. It must NOT be executed
-- against the production database without explicit human approval.
-- All changes are wrapped in a transaction that can be rolled back.

BEGIN;

-- ============================================================================
-- 1. Update core.countries row: change code from 'UK' to 'GB'
-- ============================================================================
UPDATE core.countries
SET code = 'GB',
    updated_at = NOW()
WHERE code = 'UK';

-- ============================================================================
-- 2. Update FK references in core.geographies
-- ============================================================================
UPDATE core.geographies
SET country_code = 'GB',
    updated_at = NOW()
WHERE country_code = 'UK';

-- ============================================================================
-- 3. Update FK references in core.qualification_frameworks
-- ============================================================================
UPDATE core.qualification_frameworks
SET country_code = 'GB',
    updated_at = NOW()
WHERE country_code = 'UK';

-- ============================================================================
-- 4. Update FK references in public.campuses
-- ============================================================================
UPDATE public.campuses
SET country_code = 'GB',
    updated_at = NOW()
WHERE country_code = 'UK';

-- ============================================================================
-- 5. Update FK references in public.institutions
-- ============================================================================
UPDATE public.institutions
SET country_code = 'GB',
    updated_at = NOW()
WHERE country_code = 'UK';

-- ============================================================================
-- 6. Update FK references in public.outcome_observations
-- ============================================================================
UPDATE public.outcome_observations
SET country_code = 'GB',
    updated_at = NOW()
WHERE country_code = 'UK';

-- ============================================================================
-- 7. Update FK references in public.occupations
-- ============================================================================
UPDATE public.occupations
SET country_code = 'GB',
    updated_at = NOW()
WHERE country_code = 'UK';

-- ============================================================================
-- 8. Update FK references in public.country_pr_pathways
-- ============================================================================
UPDATE public.country_pr_pathways
SET country_code = 'GB',
    updated_at = NOW()
WHERE country_code = 'UK';

-- ============================================================================
-- 9. Update JSONB metadata columns where country = 'UK'
-- ============================================================================
UPDATE core.geographies
SET metadata = jsonb_set(metadata, '{country}', '"GB"')
WHERE metadata->>'country' = 'UK';

UPDATE core.qualification_frameworks
SET metadata = jsonb_set(metadata, '{country}', '"GB"')
WHERE metadata->>'country' = 'UK';

UPDATE public.campuses
SET metadata = jsonb_set(metadata, '{country}', '"GB"')
WHERE metadata->>'country' = 'UK';

UPDATE public.institutions
SET metadata = jsonb_set(metadata, '{country}', '"GB"')
WHERE metadata->>'country' = 'UK';

UPDATE public.outcome_observations
SET metadata = jsonb_set(metadata, '{country}', '"GB"')
WHERE metadata->>'country' = 'UK';

UPDATE public.occupations
SET metadata = jsonb_set(metadata, '{country}', '"GB"')
WHERE metadata->>'country' = 'UK';

-- ============================================================================
-- 10. Verify migration results
-- ============================================================================
-- Verify core.countries has GB row and no UK row
-- SELECT code, name FROM core.countries WHERE code IN ('GB', 'UK') ORDER BY code;
-- Expected: GB row exists, UK row does not exist

-- Verify no remaining UK references in FK columns
-- SELECT 'core.geographies' AS table_name, COUNT(*) AS uk_count FROM core.geographies WHERE country_code = 'UK'
-- UNION ALL SELECT 'core.qualification_frameworks', COUNT(*) FROM core.qualification_frameworks WHERE country_code = 'UK'
-- UNION ALL SELECT 'public.campuses', COUNT(*) FROM public.campuses WHERE country_code = 'UK'
-- UNION ALL SELECT 'public.institutions', COUNT(*) FROM public.institutions WHERE country_code = 'UK'
-- UNION ALL SELECT 'public.outcome_observations', COUNT(*) FROM public.outcome_observations WHERE country_code = 'UK'
-- UNION ALL SELECT 'public.occupations', COUNT(*) FROM public.occupations WHERE country_code = 'UK'
-- UNION ALL SELECT 'public.country_pr_pathways', COUNT(*) FROM public.country_pr_pathways WHERE country_code = 'UK';
-- Expected: all counts = 0

-- Verify JSONB metadata no longer contains UK country values
-- SELECT COUNT(*) FROM core.geographies WHERE metadata->>'country' = 'UK';
-- Expected: 0

COMMIT;

-- ============================================================================
-- POST-MIGRATION: Application code changes required
-- ============================================================================
-- The following application code files still reference 'UK' as a country code
-- and must be updated to use 'GB' in a separate deployment:
--
-- 1. src/lib/data-foundation/entity-aliases.ts - PRODUCT_COUNTRY_CODES and aliases
-- 2. src/lib/data-foundation/country-normalization.ts - COUNTRY_ALIASES mapping
-- 3. src/app/api/maps/data/[country]/route.ts - COUNTRIES set
-- 4. src/app/map/LeafletMap.tsx - ActiveCountry type and UK references
-- 5. src/app/map/CampCareerMaps.tsx - ActiveCountry type and UK references
-- 6. src/lib/workspace/visa-catalog.ts - countryCode fields
-- 7. src/lib/workspace/country-explorer.ts - code field
-- 8. src/lib/blog/compare-link.ts - DEFAULT_COUNTRIES
-- 9. src/lib/map-slugs.ts - uk slug mapping
-- 10. src/lib/i18n/dictionaries/en.ts - UK label
-- 11. src/lib/i18n/dictionaries/ko.ts - UK label
-- 12. src/lib/degree-risk.ts - CountryCode type and ALL_COUNTRIES
-- 13. src/data/launch-countries.ts - UK in union type
-- 14. src/data/study-concepts.ts - UK in decisionReady arrays
-- 15. src/app/(workspace)/compare/countries-compare-matrix.tsx
-- 16. src/app/(workspace)/countries/countries-explorer.tsx
-- 17. src/app/api/compare/majors/route.ts - uk mapping
-- 18. src/app/api/compare/careers/route.ts - uk mapping