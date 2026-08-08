-- Hold Conestoga HVAC from Tier A despite appearing on the current open/international lists.
-- The current programme page says students living outside Ontario are not eligible to apply.
-- Keep the official programme identity, but require manual admission review before publication.

with held as (
  update public.program_catalog_ca_staging c
  set official_program_url = 'https://www.conestogac.on.ca/fulltime/heating-refrigeration-and-air-conditioning-technician',
      program_code = coalesce(c.program_code, '0465'),
      source_status = 'pending_review_current_admission_restriction_2026',
      source_as_of = greatest(coalesce(c.source_as_of, date '1900-01-01'), date '2026-08-08')
  where c.institution_name = 'Conestoga College'
    and c.title = 'Heating, Refrigeration and Air Conditioning Technician'
  returning c.id
)
update public.program_pgwp_ca_staging p
set international_program_admission_status = 'restricted_not_open_outside_ontario_current_program_page',
    verified_at = now()
where p.program_catalog_id in (select id from held);
