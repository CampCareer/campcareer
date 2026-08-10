-- Classify occupation-priority Algonquin programmes from the official International Program Availability table and linked programme pages, checked 2026-08-08.
with verified(program_code, official_program_url, pgwp_eligible, cip_code) as (
  values
    ('6450C03FWO','https://www.algonquincollege.com/business-hospitality/program/bachelor-of-digital-marketing-communication-honours-pathway-for-advertising-and-marketing-communications-management/',true,null),
    ('6450A03FWO','https://www.algonquincollege.com/business-hospitality/program/bachelor-of-digital-marketing-communication-honours-pathway-for-business-administration-marketing-and-business/',true,null),
    ('1617B01FWO','https://www.algonquincollege.com/wellness-safety-community/program/bachelor-of-early-learning-and-community-development-entry-level/',false,null),
    ('6519B03FWO','https://www.algonquincollege.com/sat/program/bachelor-of-automation-and-robotics-pathway-for-electrical-engineering-technology/',true,null),
    ('6519A03FWO','https://www.algonquincollege.com/sat/program/bachelor-of-automation-and-robotics-pathway-for-electro-mechanical-engineering-technician/',true,null),
    ('6519C03FWO','https://www.algonquincollege.com/sat/program/bachelor-of-automation-and-robotics-pathway-for-mechanical-engineering-technology/',true,null),
    ('6148B03FWO','https://www.algonquincollege.com/mediaanddesign/program/bachelor-of-interior-design-entry-level/',true,null),
    ('1512E03FWO','https://www.algonquincollege.com/acce/program/bachelor-of-building-science-pathway-for-construction-and-civil-engineering/',true,null),
    ('1512F03FWO','https://www.algonquincollege.com/acce/program/bachelor-of-building-science-pathway-for-mechanical-engineering/',true,null),
    ('6616X01FPM','https://www.algonquincollege.com/pembroke/program/bachelor-of-science-in-nursing-honours/',true,null),
    ('6520A03FWO','https://www.algonquincollege.com/sat/program/bachelor-of-technology-in-business-systems-development-honours-pathway-computer-programming-and-computer-engineering-technology-computing-science/',true,null),
    ('1519X01FPM','https://www.algonquincollege.com/pembroke/program/carpentry-renovation-techniques/',true,'46.0201'),
    ('0150X10FPM','https://www.algonquincollege.com/pembroke/program/computer-systems-technician/',true,'15.1202'),
    ('0430X04FPM','https://www.algonquincollege.com/pembroke/program/early-childhood-education/',true,'19.0709'),
    ('0430X04FWO','https://www.algonquincollege.com/wellness-safety-community/program/early-childhood-education-non-semestered-diploma/',true,'19.0709'),
    ('0430X01FWO','https://www.algonquincollege.com/wellness-safety-community/program/early-childhood-education/',true,'19.0709'),
    ('1532X01FPM','https://www.algonquincollege.com/pembroke/program/electrical-techniques/',true,'46.0302'),
    ('1517X03FWO','https://www.algonquincollege.com/sat/program/environmental-management-and-assessment/',true,'03.0201'),
    ('0108X04FPM','https://www.algonquincollege.com/pembroke/program/forestry-technician/',false,null),
    ('0010X03FWO','https://www.algonquincollege.com/sat/program/mechanical-engineering-technology/',true,'15.0805'),
    ('1623X01FWO','https://www.algonquincollege.com/wellness-safety-community/program/occupational-therapist-assistant-physiotherapist-assistant/',true,'51.0817'),
    ('6307X01FPM','https://www.algonquincollege.com/pembroke/program/personal-support-worker/',true,'51.2602'),
    ('6307X01FPH','https://www.algonquincollege.com/health-sciences/program/personal-support-worker-perley-rideau-veterans-health-centre/',true,'51.2602'),
    ('1704X01FPM','https://www.algonquincollege.com/pembroke/program/practical-nursing/',true,'51.3901'),
    ('1704X01FPH','https://www.algonquincollege.com/health-sciences/program/practical-nursing-perley-rideau-veterans-health-centre/',true,'51.3901'),
    ('1312X03FWO','https://www.algonquincollege.com/business-hospitality/program/project-management/',false,null),
    ('0432X01FPM','https://www.algonquincollege.com/pembroke/program/social-service-worker/',true,'44.0000'),
    ('0432X01FWO','https://www.algonquincollege.com/wellness-safety-community/program/social-service-worker/',true,'44.0000'),
    ('0432Z05FWO','https://www.algonquincollege.com/wellness-safety-community/program/social-service-worker-intensive/',true,'44.0000'),
    ('1319X03FWO','https://www.algonquincollege.com/business-hospitality/program/supply-chain-management-global/',true,'52.0203'),
    ('1214X01FPM','https://www.algonquincollege.com/pembroke/program/urban-forestry-arboriculture/',true,'01.0699'),
    ('6320X01FWO','https://www.algonquincollege.com/wellness-safety-community/program/veterinary-technician/',true,'01.8301')
), updated_catalog as (
  update public.program_catalog_ca_staging c
  set official_program_url=v.official_program_url,
      source_status='official_international_availability_open_or_waitlisted_2026_27',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  from verified v
  where c.institution_name='Algonquin College' and c.program_code=v.program_code
  returning c.id,c.program_code
), updated_pgwp as (
  update public.program_pgwp_ca_staging p
  set international_students_eligible=true,
      international_program_admission_status='official_international_availability_open_or_waitlisted_2026_27',
      ircc_program_eligible=v.pgwp_eligible,
      pgwp_program_status=case when v.pgwp_eligible then 'school_official_pgwp_eligible_2026_27' else 'school_official_pgwp_ineligible_2026_27' end,
      cip_code=coalesce(v.cip_code,p.cip_code),
      verified_at=now()
  from updated_catalog c join verified v on v.program_code=c.program_code
  where p.program_catalog_id=c.id
  returning p.program_catalog_id
), held(program_code, admission_status) as (
  values
    ('6450B03FWO','international_suspended_fall_2026'),
    ('6519D03FWO','international_suspended_fall_2026')
), held_catalog as (
  update public.program_catalog_ca_staging c
  set source_status='international_suspended_current_intake_2026',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  from held h
  where c.institution_name='Algonquin College' and c.program_code=h.program_code
  returning c.id,c.program_code
)
update public.program_pgwp_ca_staging p
set international_program_admission_status=h.admission_status,
    verified_at=now()
from held_catalog c join held h on h.program_code=c.program_code
where p.program_catalog_id=c.id;
