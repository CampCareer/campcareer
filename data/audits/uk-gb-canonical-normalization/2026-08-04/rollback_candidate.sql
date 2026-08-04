-- Rollback Candidate: GB → UK (Reverse of UK → GB Normalization)
-- Task: 10.8A UK/GB Canonical Normalization Plan
-- Date: 2026-08-04
-- Branch: audit/uk-gb-canonical-normalization-v1
-- Git Commit: 40e0848a52ef306e32387a15e2665862a382055
-- Supabase Project: babylusxcknjerxtepoc
--
-- IMPORTANT: This rollback script reverses the migration candidate changes.
-- It must ONLY be executed if the migration candidate has been applied
-- and a rollback is required.
-- All changes are wrapped in a transaction.

BEGIN;

-- ============================================================================
-- 1. Restore core.countries row: change code from 'GB' back to 'UK'
-- ============================================================================
UPDATE core.countries
SET code = 'UK',
    updated_at = NOW()
WHERE code = 'GB';

-- ============================================================================
-- 2. Restore FK references in core.geographies
-- ============================================================================
UPDATE core.geographies
SET country_code = 'UK',
    updated_at = NOW()
WHERE country_code = 'GB';

-- ============================================================================
-- 3. Restore FK references in core.qualification_frameworks
-- ============================================================================
UPDATE core.qualification_frameworks
SET country_code = 'UK',
    updated_at = NOW()
WHERE country_code = 'GB';

-- ============================================================================
-- 4. Restore FK references in public.campuses
-- ============================================================================
UPDATE public.campuses
SET country_code = 'UK',
    updated_at = NOW()
WHERE country_code = 'GB';

-- ============================================================================
-- 5. Restore FK references in public.institutions
-- ============================================================================
UPDATE public.institutions
SET country_code = 'UK',
    updated_at = NOW()
WHERE country_code = 'GB';

-- ============================================================================
-- 6. Restore FK references in public.outcome_observations
-- ============================================================================
UPDATE public.outcome_observations
SET country_code = 'UK',
    updated_at = NOW()
WHERE country_code = 'GB';

-- ============================================================================
-- 7. Restore FK references in public.occupations
-- ============================================================================
UPDATE public.occupations
SET country_code = 'UK',
    updated_at = NOW()
WHERE country_code = 'GB';

-- ============================================================================
-- 8. Restore FK references in public.country_pr_pathways
-- ============================================================================
UPDATE public.country_pr_pathways
SET country_code = 'UK',
    updated_at = NOW()
WHERE country_code = 'GB';

-- ============================================================================
-- 9. Restore JSONB metadata columns where country = 'GB'
-- ============================================================================
UPDATE core.geographies
SET metadata = jsonb_set(metadata, '{country}', '"UK"')
WHERE metadata->>'country' = 'GB';

UPDATE core.qualification_frameworks
SET metadata = jsonb_set(metadata, '{country}', '"UK"')
WHERE metadata->>'country' = 'GB';

UPDATE public.campuses
SET metadata = jsonb_set(metadata, '{country}', '"UK"')
WHERE metadata->>'country' = 'GB';

UPDATE public.institutions
SET metadata = jsonb_set(metadata, '{country}', '"UK"')
WHERE metadata->>'country' = 'GB';

UPDATE public.outcome_observations
SET metadata = jsonb_set(metadata, '{country}', '"UK"')
WHERE metadata->>'country' = 'GB';

UPDATE public.occupations
SET metadata = jsonb_set(metadata, '{country}', '"UK"')
WHERE metadata->>'country' = 'GB';

-- ============================================================================
-- 10. Verify rollback results
-- ============================================================================
-- Verify core.countries has UK row and no GB row
-- SELECT code, name FROM core.countries WHERE code IN ('GB', 'UK') ORDER BY code;
-- Expected: UK row exists, GB row does not exist

-- Verify all FK references restored to UK
-- SELECT 'core.geographies' AS table_name, COUNT(*) AS uk_count FROM core.geographies WHERE country_code = 'UK'
-- UNION ALL SELECT 'core.qualification_frameworks', COUNT(*) FROM core.qualification_frameworks WHERE country_code = 'UK'
-- UNION ALL SELECT 'public.campuses', COUNT(*) FROM public.campuses WHERE country_code = 'UK'
-- UNION ALL SELECT 'public.institutions', COUNT(*) FROM public.institutions WHERE country_code = 'UK'
-- UNION ALL SELECT 'public.outcome_observations', COUNT(*) FROM public.outcome_observations WHERE country_code = 'UK'
-- UNION ALL SELECT 'public.occupations', COUNT(*) FROM public.occupations WHERE country_code = 'UK'
-- UNION ALL SELECT 'public.country_pr_pathways', COUNT(*) FROM public.country_pr_pathways WHERE country_code = 'UK';
-- Expected: all counts match pre-migration values

-- Verify JSONB metadata restored to UK country values
-- SELECT COUNT(*) FROM core.geographies WHERE metadata->>'country' = 'UK';
-- Expected: matches pre-migration count

COMMIT;