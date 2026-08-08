-- Verify occupation-priority Centennial campus IT/networking/software programmes using current Fall 2026 orientation, current official detail pages with international application paths, and current international-program guidance checked 2026-08-08. PGWP remains unknown where code-level official evidence was not captured.
with verified(program_code, official_program_url) as (
  values
    ('3224','https://www.centennialcollege.ca/programs-courses/full-time/cybersecurity'),
    ('3402','https://www.centennialcollege.ca/programs-courses/full-time/artificial-intelligence'),
    ('3404','https://www.centennialcollege.ca/programs-courses/full-time/networking-computer-systems-technician'),
    ('3405','https://www.centennialcollege.ca/programs-courses/full-time/networking-computer-systems-technology'),
    ('3408','https://www.centennialcollege.ca/programs-courses/full-time/software-engineering-technician'),
    ('3409','https://www.centennialcollege.ca/programs-courses/full-time/software-engineering-technology'),
    ('3422','https://www.centennialcollege.ca/programs-courses/full-time/artificial-intelligence-fast-track'),
    ('3424','https://www.centennialcollege.ca/programs-courses/full-time/networking-computer-systems-technician-fast-track'),
    ('3425','https://www.centennialcollege.ca/programs-courses/full-time/networking-computer-systems-technology-fast-track'),
    ('3428','https://www.centennialcollege.ca/programs-courses/full-time/software-engineering-technician-fast-track'),
    ('3429','https://www.centennialcollege.ca/programs-courses/full-time/software-engineering-technology-fast-track')
), updated as (
  update public.program_catalog_ca_staging c
  set official_program_url=v.official_program_url,
      source_status='official_program_page_verified_international_active_2026_27',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  from verified v
  where c.institution_name='Centennial College' and c.program_code=v.program_code
  returning c.id
)
update public.program_pgwp_ca_staging p
set international_students_eligible=true,
    international_program_admission_status='official_current_program_with_international_application_path_fall_2026',
    verified_at=now()
where p.program_catalog_id in (select id from updated);
