-- Hold occupation-priority Conestoga trades programmes whose current programme pages restrict applicants living outside Ontario.
-- Preserve current programme identity but prevent Tier A publication until the restriction changes or is clarified.

with held(title, official_program_url, program_code) as (
  values
    ('Construction Techniques (Carpentry)', 'https://www.conestogac.on.ca/fulltime/construction-techniques-carpentry', '07165'),
    ('Electrical Engineering Technician - Industrial (Optional Co-op)', 'https://www.conestogac.on.ca/fulltime/electrical-engineering-technician-industrial', '1154')
), updated_catalog as (
  update public.program_catalog_ca_staging c
  set official_program_url=h.official_program_url,
      program_code=coalesce(c.program_code,h.program_code),
      source_status='pending_review_current_admission_restriction_2026',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  from held h
  where c.institution_name='Conestoga College' and c.title=h.title
  returning c.id
)
update public.program_pgwp_ca_staging p
set international_program_admission_status='restricted_not_open_outside_ontario_current_program_page',
    verified_at=now()
where p.program_catalog_id in (select id from updated_catalog);
