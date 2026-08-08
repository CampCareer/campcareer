-- Hold occupation-priority Conestoga programmes whose current official pages are not accepting applications.
with held(title, official_program_url) as (
  values
    ('3D Computer Animation', 'https://www.conestogac.on.ca/fulltime/3d-computer-animation'),
    ('Broadcasting Performance and Digital Media', 'https://www.conestogac.on.ca/fulltime/broadcasting-performance-and-digital-media'),
    ('Computer Animation - Motion Graphics', 'https://www.conestogac.on.ca/fulltime/computer-animation-motion-graphics'),
    ('Computer Programming - Data Management', 'https://www.conestogac.on.ca/fulltime/computer-programming-data-management'),
    ('Construction Management (Optional Co-op)', 'https://www.conestogac.on.ca/fulltime/construction-management'),
    ('Construction Project Management', 'https://www.conestogac.on.ca/fulltime/construction-project-management')
), updated_catalog as (
  update public.program_catalog_ca_staging c
  set official_program_url=h.official_program_url,
      source_status='not_accepting_current_2026',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  from held h
  where c.institution_name='Conestoga College' and c.title=h.title
  returning c.id
)
update public.program_pgwp_ca_staging p
set international_program_admission_status='applications_not_currently_accepted_2026',
    verified_at=now()
where p.program_catalog_id in (select id from updated_catalog);
