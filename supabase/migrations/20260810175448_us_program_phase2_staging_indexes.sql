-- United States Programs Phase 2 staging indexes for bounded verification work.
CREATE INDEX program_catalog_us_staging_institution_idx
  ON public.program_catalog_us_staging (institution_id);
CREATE INDEX program_catalog_us_staging_unitid_idx
  ON public.program_catalog_us_staging (unitid);
CREATE INDEX program_catalog_us_staging_cip_idx
  ON public.program_catalog_us_staging (cip_code)
  WHERE cip_code IS NOT NULL;
CREATE INDEX program_occupation_us_staging_career_idx
  ON public.program_occupation_us_staging (canonical_career_id, review_status);
CREATE INDEX program_international_us_staging_sevp_idx
  ON public.program_international_us_staging (sevp_status, verification_status);
