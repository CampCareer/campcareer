-- Verify occupation-priority Centennial engineering programmes whose current detail pages show international availability for Sep 2026 and PGWP alignment.
with verified(program_code, official_program_url, cip_code) as (
  values
    ('3822','https://www.centennialcollege.ca/programs-courses/full-time/electrical-engineering-technician','15.0303'),
    ('3823','https://www.centennialcollege.ca/programs-courses/full-time/electrical-engineering-technology','15.0303'),
    ('4105','https://www.centennialcollege.ca/programs-courses/full-time/automation-and-robotics-technician','15.0403'),
    ('4125','https://www.centennialcollege.ca/programs-courses/full-time/automation-robotics-technician-fast-track','15.0403'),
    ('4106','https://www.centennialcollege.ca/programs-courses/full-time/automation-and-robotics-technology','15.0403'),
    ('4126','https://www.centennialcollege.ca/programs-courses/full-time/automation-and-robotics-technology-fast-track','15.0403'),
    ('3755','https://www.centennialcollege.ca/programs-courses/full-time/energy-systems-engineering-technician',null),
    ('3756','https://www.centennialcollege.ca/programs-courses/full-time/energy-systems-engineering-technology','15.0501'),
    ('3776','https://www.centennialcollege.ca/programs-courses/full-time/energy-systems-engineering-technology-fast-track','15.0501'),
    ('3825','https://www.centennialcollege.ca/programs-courses/full-time/heating-refrigeration-and-ac-technician','15.0501'),
    ('3701','https://www.centennialcollege.ca/programs-courses/full-time/mechanical-engineering-technician-design','15.0805'),
    ('3703','https://www.centennialcollege.ca/programs-courses/full-time/mechanical-engineering-technology-design','15.0805'),
    ('3735','https://www.centennialcollege.ca/programs-courses/full-time/mechanical-engineering-technology-design-fast-track','15.0805')
), updated as (
  update public.program_catalog_ca_staging c
  set official_program_url=v.official_program_url,
      source_status='official_program_page_verified_international_available_2026_27',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  from verified v
  where c.institution_name='Centennial College' and c.program_code=v.program_code
  returning c.id,c.program_code
)
update public.program_pgwp_ca_staging p
set international_students_eligible=true,
    international_program_admission_status='official_program_page_international_available_2026_27',
    ircc_program_eligible=true,
    pgwp_program_status='school_official_pgwp_eligible_2026_27',
    cip_code=coalesce(v.cip_code,p.cip_code),
    verified_at=now()
from updated u join verified v on v.program_code=u.program_code
where p.program_catalog_id=u.id;
