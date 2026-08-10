-- NZ Programs Phase 2 staging index closeout.
-- Covers the institution foreign key used for bounded provider-level audits.
CREATE INDEX IF NOT EXISTS program_catalog_nz_staging_institution_idx
  ON public.program_catalog_nz_staging (institution_id);
