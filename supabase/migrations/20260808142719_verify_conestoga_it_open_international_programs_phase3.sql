-- Verify current Conestoga IT programmes that are both open and available to international students.
-- Official programme pages, Conestoga international catalogue and open-program list checked 2026-08-08.

with verified(title, official_program_url, program_code) as (
  values
    ('Bachelor of Computer Science', 'https://www.conestogac.on.ca/fulltime/bachelor-of-computer-science', '1635C'),
    ('Bachelor of Computer Science (Honours)', 'https://www.conestogac.on.ca/fulltime/bachelor-of-computer-science-honours', '1514C'),
    ('Bachelor of Data Analytics', 'https://www.conestogac.on.ca/fulltime/bachelor-of-data-analytics', '1664C'),
    ('Computer Programming', 'https://www.conestogac.on.ca/fulltime/computer-programming', '1009'),
    ('Computer Programming and Analysis (Optional Co-op)', 'https://www.conestogac.on.ca/fulltime/computer-programming-and-analysis', '0057'),
    ('Computer Systems Technician - Information Technology Infrastructure and Services (Optional Co-op)', 'https://www.conestogac.on.ca/fulltime/computer-systems-technician-information-technology-infrastructure-and-services', '1097'),
    ('Cybersecurity Response Planning (Optional Co-op)', 'https://www.conestogac.on.ca/fulltime/cybersecurity-response-planning', '1580'),
    ('Information Technology Project Management', 'https://www.conestogac.on.ca/fulltime/information-technology-project-management', '1566'),
    ('Software Engineering Technician', 'https://www.conestogac.on.ca/fulltime/software-engineering-technician', '1046'),
    ('Software Engineering Technology (Optional Co-op)', 'https://www.conestogac.on.ca/fulltime/software-engineering-technology', '1132')
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
