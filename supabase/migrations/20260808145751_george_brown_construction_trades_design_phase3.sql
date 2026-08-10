-- Verify occupation-priority George Brown construction/trades/design programmes with an open international intake in the official 2026-27 availability table.
with verified(program_code, official_program_url) as (
  values
    ('T105','https://www.georgebrown.ca/programs/construction-engineering-technology-program-t105?year=2026'),
    ('T161','https://www.georgebrown.ca/programs/construction-engineering-technician-program-t161?year=2026'),
    ('T164','https://www.georgebrown.ca/programs/civil-engineering-technology-program-t164?year=2026'),
    ('T312','https://www.georgebrown.ca/programs/honours-bachelor-of-technology-program-construction-management-t312?year=2026'),
    ('T314','https://www.georgebrown.ca/programs/honours-bachelor-of-technology-construction-management-program-bridging-t314?year=2026'),
    ('T316','https://www.georgebrown.ca/programs/honours-bachelor-of-technology-construction-management-program-bridging-t316?year=2026'),
    ('T317','https://www.georgebrown.ca/programs/honours-bachelor-of-technology-construction-management-program-bridging-t317?year=2026'),
    ('T318','https://www.georgebrown.ca/programs/honours-bachelor-of-technology-construction-management-program-bridging-t318?year=2026'),
    ('T180','https://www.georgebrown.ca/programs/carpentry-and-renovation-technician-program-t180?year=2026'),
    ('T167','https://www.georgebrown.ca/programs/electrical-techniques-program-t167?year=2026'),
    ('T162','https://www.georgebrown.ca/programs/heating-refrigeration-and-air-conditioning-technology-program-t162?year=2026'),
    ('T165','https://www.georgebrown.ca/programs/plumbing-techniques-program-t165?year=2026'),
    ('T166','https://www.georgebrown.ca/programs/welding-techniques-program-t166'),
    ('T178','https://www.georgebrown.ca/programs/interior-design-program-t178?year=2026'),
    ('T320','https://www.georgebrown.ca/programs/bachelor-of-interior-design-honours-program-t320?year=2026'),
    ('T182','https://www.georgebrown.ca/programs/electromechanical-engineering-technology-power-and-control-program-t182?year=2026'),
    ('G113','https://www.georgebrown.ca/programs/interaction-design-program-g113'),
    ('G122','https://www.georgebrown.ca/programs/graphic-design-program-g122?year=2026'),
    ('T141','https://www.georgebrown.ca/programs/computer-systems-technician-program-t141?year=2026')
), updated as (
  update public.program_catalog_ca_staging c
  set official_program_url=v.official_program_url,
      source_status='official_program_page_verified_international_open_2026_27',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  from verified v
  where c.institution_name='George Brown Polytechnic' and c.program_code=v.program_code
  returning c.id
)
update public.program_pgwp_ca_staging p
set international_students_eligible=true,
    international_program_admission_status='official_program_availability_international_open_2026_27',
    verified_at=now()
where p.program_catalog_id in (select id from updated);
