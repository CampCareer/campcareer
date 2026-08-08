-- Classify occupation-priority George Brown IT/Data programmes using official 2026-27 availability and current programme pages checked 2026-08-08.
with verified(program_code, official_program_url) as (
  values
    ('B430','https://www.georgebrown.ca/programs/people-analytics-program-postgraduate-b430?year=2026'),
    ('T405','https://www.georgebrown.ca/programs/information-systems-business-analysis-program-with-experiential-learning-capstone-postgraduate-t405?year=2026'),
    ('T433','https://www.georgebrown.ca/programs/cyber-security-program-postgraduate-t433?year=2026'),
    ('T440','https://www.georgebrown.ca/programs/mobile-application-development-and-strategy-program-postgraduate-t440?year=2026'),
    ('T465','https://www.georgebrown.ca/programs/cloud-computing-technologies-program-postgraduate-t465?year=2026')
), verified_catalog as (
  update public.program_catalog_ca_staging c
  set official_program_url=v.official_program_url,
      source_status='official_program_page_verified_international_open_2026_27',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  from verified v
  where c.institution_name='George Brown Polytechnic' and c.program_code=v.program_code
  returning c.id,c.program_code
), verified_pgwp as (
  update public.program_pgwp_ca_staging p
  set international_students_eligible=true,
      international_program_admission_status='official_program_page_international_open_2026_27',
      verified_at=now()
  from verified_catalog c
  where p.program_catalog_id=c.id
  returning p.program_catalog_id
), t440_pgwp as (
  update public.program_pgwp_ca_staging p
  set ircc_program_eligible=false,
      pgwp_program_status='school_official_pgwp_ineligible_2026_27',
      verified_at=now()
  from public.program_catalog_ca_staging c
  where p.program_catalog_id=c.id
    and c.institution_name='George Brown Polytechnic'
    and c.program_code='T440'
  returning p.program_catalog_id
), held(program_code, admission_status) as (
  values
    ('B412','international_suspended_2026_27'),
    ('B419','international_not_available_2026_27'),
    ('B422','international_not_available_2026_27'),
    ('T197','international_not_available_2026_27'),
    ('T411','international_suspended_2026_27')
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
