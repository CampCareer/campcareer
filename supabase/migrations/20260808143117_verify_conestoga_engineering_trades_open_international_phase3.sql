-- Verify occupation-priority Conestoga engineering/trades programmes that are both open and available to international students.
-- Official programme pages, international catalogue and open-program list checked 2026-08-08.

with verified(title, official_program_url, program_code) as (
  values
    ('Architecture - Construction Engineering Technology (Optional Co-op)', 'https://www.conestogac.on.ca/fulltime/architecture-construction-engineering-technology', '0025'),
    ('Bachelor of Interior Design (Honours)', 'https://www.conestogac.on.ca/fulltime/bachelor-of-interior-design-honours', '1068C'),
    ('Civil Engineering Technician (Optional Co-op)', 'https://www.conestogac.on.ca/fulltime/civil-engineering-technician', '1629'),
    ('Civil Engineering Technology (Optional Co-op)', 'https://www.conestogac.on.ca/fulltime/civil-engineering-technology', '0024'),
    ('Mechanical Engineering Technology - Design and Analysis (Optional Co-op)', 'https://www.conestogac.on.ca/fulltime/mechanical-engineering-technology-design-and-analysis', '0073'),
    ('Mechanical Engineering Technology - Robotics and Automation (Optional Co-op)', 'https://www.conestogac.on.ca/fulltime/mechanical-engineering-technology-robotics-and-automation', '0092'),
    ('Electrical Techniques', 'https://www.conestogac.on.ca/fulltime/electrical-techniques', '1327'),
    ('Welding Techniques', 'https://www.conestogac.on.ca/fulltime/welding-techniques', '1193')
), updated_catalog as (
  update public.program_catalog_ca_staging c
  set official_program_url = v.official_program_url,
      program_code = coalesce(c.program_code, v.program_code),
      source_status = 'official_program_page_verified_open_international_2026',
      source_as_of = greatest(coalesce(c.source_as_of, date '1900-01-01'), date '2026-08-08')
  from verified v
  where c.institution_name = 'Conestoga College'
    and c.title = v.title
  returning c.id
)
update public.program_pgwp_ca_staging p
set international_students_eligible = true,
    international_program_admission_status = 'official_program_page_open_international_2026',
    verified_at = now()
where p.program_catalog_id in (select id from updated_catalog);
