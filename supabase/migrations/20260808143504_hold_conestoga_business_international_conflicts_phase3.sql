-- Hold occupation-priority Conestoga business programmes whose current international catalogue and programme-page availability evidence conflict.
-- Preserve programme identity but require manual review before Tier A publication.

with held(title, official_program_url, program_code) as (
  values
    ('Business - Marketing', 'https://www.conestogac.on.ca/fulltime/business-marketing', '1242'),
    ('Professional Accounting Practice', 'https://www.conestogac.on.ca/fulltime/professional-accounting-practice', '1568')
), updated_catalog as (
  update public.program_catalog_ca_staging c
  set official_program_url=h.official_program_url,
      program_code=coalesce(c.program_code,h.program_code),
      source_status='pending_review_conflicting_international_availability_2026',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  from held h
  where c.institution_name='Conestoga College' and c.title=h.title
  returning c.id
)
update public.program_pgwp_ca_staging p
set international_program_admission_status='pending_review_conflicting_international_catalog_and_program_page_2026',
    verified_at=now()
where p.program_catalog_id in (select id from updated_catalog);
