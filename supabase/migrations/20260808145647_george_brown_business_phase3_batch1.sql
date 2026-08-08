-- Classify occupation-priority George Brown business programmes using official 2026-27 availability and programme links checked 2026-08-08.
with verified(program_code, official_program_url) as (
  values
    ('B103','https://www.georgebrown.ca/programs/business-accounting-program-b103?year=2026'),
    ('B157','https://www.georgebrown.ca/programs/business-administration-accounting-program-with-work-experience-b157?year=2026'),
    ('B130','https://www.georgebrown.ca/programs/business-administration-finance-program-b130?year=2026'),
    ('B150','https://www.georgebrown.ca/programs/business-administration-finance-program-with-work-experience-b150?year=2026'),
    ('B108','https://www.georgebrown.ca/programs/business-administration-marketing-program-b108?year=2026'),
    ('B158','https://www.georgebrown.ca/programs/business-administration-marketing-program-with-work-experience-b158?year=2026'),
    ('B120','https://www.georgebrown.ca/programs/business-marketing-program-b120?year=2026'),
    ('B312','https://www.georgebrown.ca/programs/honours-bachelor-of-commerce-digital-marketing-program-b312?year=2026'),
    ('B433','https://www.georgebrown.ca/programs/marketing-management-digital-media-program-postgraduate-b433?year=2026'),
    ('B400','https://www.georgebrown.ca/programs/sport-and-event-marketing-program-postgraduate-b400?year=2026'),
    ('B144','https://www.georgebrown.ca/programs/business-administration-human-resources-program-b144?year=2026'),
    ('B154','https://www.georgebrown.ca/programs/business-administration-human-resources-program-with-work-experience-b154?year=2026'),
    ('B156','https://www.georgebrown.ca/programs/business-administration-project-management-program-with-work-experience-b156?year=2026'),
    ('B122','https://www.georgebrown.ca/programs/business-administration-supply-chain-and-operations-management-program-b122?year=2026'),
    ('B162','https://www.georgebrown.ca/programs/business-administration-supply-chain-and-operations-management-program-with-work-experience-b162?year=2026'),
    ('B134','https://www.georgebrown.ca/programs/business-human-resources-program-b134?year=2026'),
    ('B408','https://www.georgebrown.ca/programs/human-resources-management-program-postgraduate-b408?year=2026'),
    ('B415','https://www.georgebrown.ca/programs/project-management-program-postgraduate-b415?year=2026')
), verified_catalog as (
  update public.program_catalog_ca_staging c
  set official_program_url=v.official_program_url,
      source_status='official_program_page_verified_international_open_2026_27',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  from verified v
  where c.institution_name='George Brown Polytechnic' and c.program_code=v.program_code
  returning c.id
), verified_pgwp as (
  update public.program_pgwp_ca_staging p
  set international_students_eligible=true,
      international_program_admission_status='official_program_availability_international_open_2026_27',
      verified_at=now()
  where p.program_catalog_id in (select id from verified_catalog)
  returning p.program_catalog_id
), held(program_code, admission_status) as (
  values
    ('B423','international_not_available_2026_27'),
    ('B425','international_not_available_2026_27'),
    ('B426','international_not_available_2026_27'),
    ('B428','international_not_available_2026_27'),
    ('B429','international_suspended_2026_27')
), held_catalog as (
  update public.program_catalog_ca_staging c
  set source_status='international_not_available_or_suspended_2026_27',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  from held h
  where c.institution_name='George Brown Polytechnic' and c.program_code=h.program_code
  returning c.id,c.program_code
)
update public.program_pgwp_ca_staging p
set international_program_admission_status=h.admission_status,
    verified_at=now()
from held_catalog c join held h on h.program_code=c.program_code
where p.program_catalog_id=c.id;
