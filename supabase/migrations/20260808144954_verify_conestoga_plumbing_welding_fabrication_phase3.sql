-- Verify current occupation-priority Conestoga trade programmes open to international applicants.
with verified(title, official_program_url, program_code) as (
  values
    ('Mechanical Techniques - Plumbing','https://www.conestogac.on.ca/fulltime/mechanical-techniques-plumbing','1245'),
    ('Welding and Fabrication Technician','https://www.conestogac.on.ca/fulltime/welding-and-fabrication-technician','0046')
), updated as (
  update public.program_catalog_ca_staging c
  set official_program_url=v.official_program_url,
      program_code=coalesce(c.program_code,v.program_code),
      source_status='official_program_page_verified_open_international_2026',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  from verified v
  where c.institution_name='Conestoga College' and c.title=v.title
  returning c.id
)
update public.program_pgwp_ca_staging p
set international_students_eligible=true,
    international_program_admission_status='official_program_page_open_international_2026',
    verified_at=now()
where p.program_catalog_id in (select id from updated);
