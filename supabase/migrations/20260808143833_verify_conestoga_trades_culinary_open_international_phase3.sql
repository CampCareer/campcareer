-- Verify occupation-priority Conestoga trades and culinary programmes that are currently open to international applicants.
-- Current individual programme pages, international applicant/fee evidence and open-program status checked 2026-08-08.

with verified(title, official_program_url, program_code) as (
  values
    ('Carpentry and Renovation Technician (Optional Co-op)', 'https://www.conestogac.on.ca/fulltime/carpentry-and-renovation-technician', '1142'),
    ('Construction Techniques - Brick and Stone', 'https://www.conestogac.on.ca/fulltime/construction-techniques-brick-and-stone', '1497'),
    ('Baking and Pastry Arts', 'https://www.conestogac.on.ca/fulltime/baking-and-pastry-arts', '1377'),
    ('Baking and Pastry Arts Management (Optional Co-op)', 'https://www.conestogac.on.ca/fulltime/baking-and-pastry-arts-management', '1484'),
    ('Culinary Management (Co-op)', 'https://www.conestogac.on.ca/fulltime/culinary-management-co-op', '1026C')
), updated_catalog as (
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
where p.program_catalog_id in (select id from updated_catalog);
