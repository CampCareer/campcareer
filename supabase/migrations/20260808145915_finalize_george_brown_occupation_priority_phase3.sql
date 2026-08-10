-- Finalize the last unresolved occupation-priority George Brown business programmes.
with verified(program_code, official_program_url) as (
  values
    ('B107','https://www.georgebrown.ca/programs/business-administration-accounting-program-b107'),
    ('B126','https://www.georgebrown.ca/programs/business-administration-project-management-program-b126'),
    ('B133','https://www.georgebrown.ca/programs/business-finance-program-b133?year=2026')
), updated as (
  update public.program_catalog_ca_staging c
  set official_program_url=v.official_program_url,
      source_status='official_program_page_verified_international_open_2026_27',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  from verified v
  where c.institution_name='George Brown Polytechnic' and c.program_code=v.program_code
  returning c.id,c.program_code
), admission_updated as (
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
  and c.program_code in ('B107','B126');
