-- Verify occupation-priority Conestoga engineering programmes currently open to international applicants.
with verified(title, official_program_url, program_code) as (
  values
    ('Electrical Engineering Technician', 'https://www.conestogac.on.ca/fulltime/electrical-engineering-technician', '0071'),
    ('Electrical Engineering Technology (Optional Co-op)', 'https://www.conestogac.on.ca/fulltime/electrical-engineering-technology', '0928'),
    ('Energy Systems Engineering Technology - Electrical (Optional Co-op)', 'https://www.conestogac.on.ca/fulltime/energy-systems-engineering-technology-electrical', '0029'),
    ('Welding Engineering Technician - Robotics (Optional Co-op)', 'https://www.conestogac.on.ca/fulltime/welding-engineering-technician-robotics', '1502'),
    ('Welding Engineering Technology - Inspection (Optional Co-op)', 'https://www.conestogac.on.ca/fulltime/welding-engineering-technology-inspection', '0043')
), updated_catalog as (
  update public.program_catalog_ca_staging c
  set official_program_url = v.official_program_url,
      program_code = coalesce(c.program_code, v.program_code),
      source_status = 'official_program_page_verified_open_international_2026',
      source_as_of = greatest(coalesce(c.source_as_of, date '1900-01-01'), date '2026-08-08')
  from verified v
  where c.institution_name = 'Conestoga College' and c.title = v.title
  returning c.id
)
update public.program_pgwp_ca_staging p
set international_students_eligible = true,
    international_program_admission_status = 'official_program_page_open_international_2026',
    verified_at = now()
where p.program_catalog_id in (select id from updated_catalog);
