-- Hold Centennial occupation-priority IT rows that are explicitly online-only in the current official program directory; CampCareer v1 public study catalogue prioritizes in-Canada campus study.
with held(program_code, official_program_url) as (
  values
    ('3462','https://www.centennialcollege.ca/programs-courses/full-time/artificial-intelligence-online'),
    ('3468','https://www.centennialcollege.ca/programs-courses/full-time/software-engineering-technician-online'),
    ('3469','https://www.centennialcollege.ca/programs-courses/full-time/software-engineering-technology-online'),
    ('3472','https://www.centennialcollege.ca/programs-courses/full-time/artificial-intelligence-fast-track-online')
), updated as (
  update public.program_catalog_ca_staging c
  set official_program_url=h.official_program_url,
      source_status='pending_review_online_only_non_campus_2026_27',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  from held h
  where c.institution_name='Centennial College' and c.program_code=h.program_code
  returning c.id
)
update public.program_pgwp_ca_staging p
set international_program_admission_status='international_application_path_exists_but_program_is_online_only_non_campus',
    verified_at=now()
where p.program_catalog_id in (select id from updated);
