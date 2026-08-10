-- Canada Programs Phase 3: first BCIT occupation-priority URL verification batch.
-- Uses stable institution/title/credential keys rather than generated staging ids.

with verified(title, credential_type, official_program_url) as (
  values
    ('Chemical and Environmental Engineering Technology', 'Diploma', 'https://www.bcit.ca/programs/chemical-and-environmental-engineering-technology-diploma-full-time-5375dipma/'),
    ('Civil Engineering', 'Diploma', 'https://www.bcit.ca/programs/civil-engineering-diploma-full-time-5410diplt/'),
    ('Civil Engineering', 'Bachelor of Engineering', 'https://www.bcit.ca/programs/civil-engineering-bachelor-of-engineering-full-time-8660beng/'),
    ('Construction Management', 'Diploma', 'https://www.bcit.ca/programs/construction-management-diploma-part-time-7710dipma/'),
    ('Construction Management', 'Bachelor of Technology', 'https://www.bcit.ca/programs/construction-management-bachelor-of-technology-full-time-part-time-8800btech/'),
    ('Electrical and Computer Engineering Technology (Automation and Instrumentation Option)', 'Diploma', 'https://www.bcit.ca/programs/electrical-and-computer-engineering-technology-automation-and-instrumentation-option-diploma-full-time-534adipma/'),
    ('Electrical and Computer Engineering Technology (Electrical Power and Industrial Control Option)', 'Diploma', 'https://www.bcit.ca/programs/electrical-and-computer-engineering-technology-electrical-power-and-industrial-control-option-diploma-full-time-534bdipma/'),
    ('Electrical and Computer Engineering Technology (Telecommunications and Networks Option)', 'Diploma', 'https://www.bcit.ca/programs/electrical-and-computer-engineering-technology-telecommunications-and-networks-option-diploma-full-time-534cdipma/'),
    ('Electrical Engineering', 'Bachelor of Engineering', 'https://www.bcit.ca/programs/electrical-engineering-bachelor-of-engineering-full-time-8030beng/'),
    ('Environmental Engineering', 'Bachelor of Technology', 'https://www.bcit.ca/programs/environmental-engineering-bachelor-of-technology-full-time-part-time-8120btech/'),
    ('Geomatics Engineering Technology', 'Diploma', 'https://www.bcit.ca/programs/geomatics-engineering-technology-diploma-full-time-7535dipma/'),
    ('Interior Design', 'Bachelor of Interior Design', 'https://www.bcit.ca/programs/interior-design-bachelor-of-interior-design-full-time-8830bid/'),
    ('Mechanical Engineering Technology (Mechanical Design Option)', 'Diploma', 'https://www.bcit.ca/programs/mechanical-engineering-technology-mechanical-design-option-diploma-full-time-635ddiplt/'),
    ('Mechanical Engineering Technology (Mechanical Manufacturing Option)', 'Diploma', 'https://www.bcit.ca/programs/mechanical-engineering-technology-mechanical-manufacturing-option-diploma-full-time-635ediplt/'),
    ('Mechanical Engineering Technology (Mechanical Systems Option)', 'Diploma', 'https://www.bcit.ca/programs/mechanical-engineering-technology-mechanical-systems-option-diploma-full-time-635cdiplt/'),
    ('Mechatronics and Robotics', 'Diploma', 'https://www.bcit.ca/programs/mechatronics-and-robotics-diploma-full-time-7340diplt/'),
    ('Sustainable Business Leadership', 'Advanced Diploma', 'https://www.bcit.ca/programs/sustainable-business-leadership-advanced-diploma-full-time-5180advdip/')
), updated as (
  update public.program_catalog_ca_staging c
  set official_program_url = v.official_program_url
  from verified v
  where c.institution_id = 'british-columbia-institute-of-technology'
    and c.title = v.title
    and c.credential_type = v.credential_type
  returning c.id
)
update public.program_occupation_ca_staging s
set source_checked_at = date '2026-08-08'
where s.program_catalog_id in (select id from updated);