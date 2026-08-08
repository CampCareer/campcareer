-- Verify occupation-priority Conestoga data, creative, education and community programmes.
-- Current individual programme pages, international applicant/fee evidence and open-program status checked 2026-08-08.

with verified(title, official_program_url, program_code) as (
  values
    ('Bachelor of Data Science and Artificial Intelligence (Honours)', 'https://www.conestogac.on.ca/fulltime/bachelor-of-data-science-and-artificial-intelligence-honours', '1682C'),
    ('Animation', 'https://www.conestogac.on.ca/fulltime/animation', '1400'),
    ('Bachelor of Animation', 'https://www.conestogac.on.ca/fulltime/bachelor-of-animation', '1671C'),
    ('Graphic Design', 'https://www.conestogac.on.ca/fulltime/graphic-design', '0049'),
    ('Advertising and Marketing Communications', 'https://www.conestogac.on.ca/fulltime/advertising-and-marketing-communications', '1532'),
    ('Bachelor of Early Learning Program Development (Honours)', 'https://www.conestogac.on.ca/fulltime/bachelor-of-early-learning-program-development-honours', '1355C'),
    ('Early Childhood Education', 'https://www.conestogac.on.ca/fulltime/early-childhood-education', '0003'),
    ('Early Childhood Education Fast Track (ECE)', 'https://www.conestogac.on.ca/fulltime/early-childhood-education-fast-track-ece', '00031'),
    ('Management in Community Services', 'https://www.conestogac.on.ca/fulltime/management-in-community-services', '1276'),
    ('Social Service Worker', 'https://www.conestogac.on.ca/fulltime/social-service-worker', '0009')
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
