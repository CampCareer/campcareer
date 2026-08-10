-- Verify occupation-priority George Brown ECE/community/health/hospitality programmes with an open international intake in the official 2026-27 availability table.
with verified(program_code, official_program_url) as (
  values
    ('C100','https://www.georgebrown.ca/programs/early-childhood-education-program-c100?year=2026'),
    ('C118','https://www.georgebrown.ca/programs/early-childhood-education-program-consecutive-diplomadegree-c118?year=2026'),
    ('C130','https://www.georgebrown.ca/programs/early-childhood-education-program-fast-track-c130?year=2026'),
    ('C160','https://www.georgebrown.ca/programs/early-childhood-education-program-accelerated-c160?year=2026'),
    ('C133','https://www.georgebrown.ca/programs/child-and-youth-care-program-c133?year=2026'),
    ('C153','https://www.georgebrown.ca/programs/child-and-youth-care-program-accelerated-c153?year=2026'),
    ('C119','https://www.georgebrown.ca/programs/social-service-worker-program-c119?year=2026'),
    ('C135','https://www.georgebrown.ca/programs/social-service-worker-program-accelerated-c135?year=2026'),
    ('C112','https://www.georgebrown.ca/programs/personal-support-worker-program-psw-c112?year=2026'),
    ('S121','https://www.georgebrown.ca/programs/practical-nursing-program-pn-s121?year=2026'),
    ('S126','https://www.georgebrown.ca/programs/occupational-therapist-assistant-and-physiotherapist-assistant-program-s126?year=2026'),
    ('H100','https://www.georgebrown.ca/programs/culinary-management-program-h100?year=2026'),
    ('H113','https://www.georgebrown.ca/programs/baking-and-pastry-arts-management-program-h113?year=2026'),
    ('H128','https://www.georgebrown.ca/programs/baking-and-pastry-foundations-program-h128?year=2026'),
    ('H130','https://www.georgebrown.ca/programs/tourism-and-hospitality-management-program-h130?year=2026'),
    ('H315','https://www.georgebrown.ca/programs/honours-bachelor-of-commerce-program-culinary-management-h315?year=2026'),
    ('H316','https://www.georgebrown.ca/programs/honours-bachelor-of-commerce-culinary-management-program-bridging-h316?year=2026'),
    ('P113','https://www.georgebrown.ca/programs/animation-3d-for-extended-reality-program-p113')
), updated as (
  update public.program_catalog_ca_staging c
  set official_program_url=v.official_program_url,
      source_status='official_program_page_verified_international_open_2026_27',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  from verified v
  where c.institution_name='George Brown Polytechnic' and c.program_code=v.program_code
  returning c.id,c.program_code
), pgwp_update as (
  update public.program_pgwp_ca_staging p
  set international_students_eligible=true,
      international_program_admission_status='official_program_availability_international_open_2026_27',
      verified_at=now()
  where p.program_catalog_id in (select id from updated)
  returning p.program_catalog_id
)
update public.program_pgwp_ca_staging p
set ircc_program_eligible=false,
    pgwp_program_status='school_official_pgwp_ineligible_2026_27',
    verified_at=now()
from public.program_catalog_ca_staging c
where p.program_catalog_id=c.id
  and c.institution_name='George Brown Polytechnic'
  and c.program_code='P113';
