-- Cross-check occupation-priority Algonquin rows originally collected from the general programme directory against the current international availability register, checked 2026-08-08.
with verified(program_code, official_program_url, pgwp_eligible, cip_code) as (
  values
    ('0006X03FWO','https://www.algonquincollege.com/sat/program/computer-engineering-technology-computing-science/',true,'15.1201'),
    ('0190X03FWO','https://www.algonquincollege.com/acce/program/construction-engineering-technician/',true,'15.1001'),
    ('0214C01FWO','https://www.algonquincollege.com/business-hospitality/program/business-accounting/',false,null),
    ('0214E01FWO','https://www.algonquincollege.com/business-hospitality/program/business-marketing/',false,null),
    ('0216L01FWO','https://www.algonquincollege.com/business-hospitality/program/business-administration-materials-and-operations-management/',true,'52.0203'),
    ('0300X01FWO','https://www.algonquincollege.com/mediaanddesign/program/imm/',true,'11.0801'),
    ('0317X03FWO','https://www.algonquincollege.com/acce/program/electrical-engineering-technician/',true,'15.0303'),
    ('0336X03FWO','https://www.algonquincollege.com/sat/program/computer-programming/',true,'11.0201'),
    ('0354X01FWO','https://www.algonquincollege.com/business-hospitality/program/culinary-management/',false,null),
    ('0476X01FWO','https://www.algonquincollege.com/wellness-safety-community/program/child-and-youth-care/',true,'44.0702'),
    ('0550X03FWO','https://www.algonquincollege.com/sat/program/electro-mechanical-engineering-technician-robotics/',true,'15.0403'),
    ('0590X04FWO','https://www.algonquincollege.com/acce/program/heating-refrigeration-and-air-conditioning-technician/',true,'15.0501'),
    ('1201X01FWO','https://www.algonquincollege.com/business-hospitality/program/baking-and-pastry-arts/',false,null),
    ('1207X01FWO','https://www.algonquincollege.com/business-hospitality/program/baking-and-pastry-arts-management/',false,null),
    ('1288X01FWO','https://www.algonquincollege.com/mediaanddesign/program/animation/',false,null),
    ('1315X01FWO','https://www.algonquincollege.com/business-hospitality/program/bookkeeping-and-accounting-practices/',false,null),
    ('1317X01FWO','https://www.algonquincollege.com/business-hospitality/program/accounting-and-financial-practice/',false,null),
    ('1331X01FWO','https://www.algonquincollege.com/business-hospitality/program/business-supply-chain-and-operations/',true,'52.0203'),
    ('1400X01FWO','https://www.algonquincollege.com/mediaanddesign/program/graphic-design/',true,'50.0409'),
    ('1441X01FWO','https://www.algonquincollege.com/mediaanddesign/program/user-experience-design/',true,'11.0105'),
    ('1452X01FWO','https://www.algonquincollege.com/mediaanddesign/program/drawing-foundations-for-animation-and-illustration/',false,null),
    ('1507X01FWO','https://www.algonquincollege.com/acce/program/welding-and-fabrication-techniques/',true,'48.0508'),
    ('1514X03FWO','https://www.algonquincollege.com/sat/program/business-intelligence-system-infrastructure/',true,'52.1301'),
    ('1521X01FWO','https://www.algonquincollege.com/acce/program/mechanical-techniques-plumbing/',true,'46.0503'),
    ('1522X01FWO','https://www.algonquincollege.com/sat/program/aircraft-maintenance-technician/',true,'47.0607'),
    ('1530X01FWO','https://www.algonquincollege.com/sat/program/cyber-security-analysis/',true,'11.1003'),
    ('1532X01FWO','https://www.algonquincollege.com/acce/program/electrical-techniques/',true,'46.0302'),
    ('1535X03FWO','https://www.algonquincollege.com/sat/program/artificial-intelligence-software-development/',true,'11.0102'),
    ('1560X03FWO','https://www.algonquincollege.com/sat/program/computer-systems-technician-networking/',true,'11.1001'),
    ('1561X03FWO','https://www.algonquincollege.com/sat/program/computer-programming-and-analysis/',true,'11.0201'),
    ('1615X01FWO','https://www.algonquincollege.com/health-sciences/program/medical-radiation-technology/',true,'51.0911'),
    ('1617X01FWO','https://www.algonquincollege.com/wellness-safety-community/program/bachelor-of-early-learning-and-community-development/',true,null),
    ('1704X01FWO','https://www.algonquincollege.com/health-sciences/program/practical-nursing/',true,'51.3901'),
    ('6066X03FWO','https://www.algonquincollege.com/business-hospitality/program/bachelor-of-commerce-supply-chain-management/',true,null),
    ('6148X03FWO','https://www.algonquincollege.com/mediaanddesign/program/bachelor-of-interior-design/',true,null),
    ('6149X03FWO','https://www.algonquincollege.com/mediaanddesign/program/interactive-media-design/',true,'11.0801'),
    ('6307X01FWO','https://www.algonquincollege.com/health-sciences/program/personal-support-worker/',true,'51.2602'),
    ('6327X03FWO','https://www.algonquincollege.com/business-hospitality/program/bachelor-of-commerce-marketing-honours/',true,null),
    ('6328X03FWO','https://www.algonquincollege.com/business-hospitality/program/bachelor-of-commerce-strategic-human-resources-management-honours/',true,null),
    ('6442X04FWO','https://www.algonquincollege.com/acce/program/building-construction-technician/',true,'46.0415'),
    ('6607X01FWO','https://www.algonquincollege.com/wellness-safety-community/program/bachelor-of-child-and-youth-care/',true,null),
    ('6616X01FWO','https://www.algonquincollege.com/health-sciences/program/bachelor-of-science-in-nursing-honours/',true,null)
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
    ('0216A01FWO','not_listed_on_current_international_availability_2026_27'),
    ('0216K01FWO','not_listed_on_current_international_availability_2026_27'),
    ('0318X03FWO','not_listed_on_current_international_availability_2026_27'),
    ('0530X01FWO','international_suspended_fall_2026'),
    ('1456X01FWO','not_listed_on_current_international_availability_2026_27'),
    ('6450X03FWO','international_suspended_fall_2026')
), held_catalog as (
  update public.program_catalog_ca_staging c
  set source_status=case when h.admission_status like 'international_suspended%' then 'international_suspended_current_intake_2026' else 'international_not_available_current_2026_27' end,
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  from held h
  where c.institution_name='Algonquin College' and c.program_code=h.program_code
  returning c.id,c.program_code
)
update public.program_pgwp_ca_staging p
set international_program_admission_status=h.admission_status,
    international_students_eligible=case when h.admission_status like 'not_listed%' then false else p.international_students_eligible end,
    verified_at=now()
from held_catalog c join held h on h.program_code=c.program_code
where p.program_catalog_id=c.id;
