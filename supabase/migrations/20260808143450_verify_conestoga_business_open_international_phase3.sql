-- Verify occupation-priority Conestoga business programmes that are both open and available to international students.
-- Official programme pages, international catalogue and open-program list checked 2026-08-08.

with verified(title, official_program_url, program_code) as (
  values
    ('Bachelor of Business Administration (Honours) - Accounting, Audit and Information Technology', 'https://www.conestogac.on.ca/fulltime/bachelor-of-business-administration-honours-accounting-audit-and-information-technology', '1241C'),
    ('Business - Finance', 'https://www.conestogac.on.ca/fulltime/business-finance', '1396'),
    ('Business Administration - Accounting', 'https://www.conestogac.on.ca/fulltime/business-administration-accounting', '0011'),
    ('Business - Supply Chain and Operations for Commercial Trucking', 'https://www.conestogac.on.ca/fulltime/business-supply-chain-and-operations-for-commercial-trucking', '1540'),
    ('Human Resources Management (Optional Co-op)', 'https://www.conestogac.on.ca/fulltime/human-resources-management', '0965'),
    ('Supply Chain Management - Global', 'https://www.conestogac.on.ca/fulltime/supply-chain-management-global', '1411')
), updated_catalog as (
  update public.program_catalog_ca_staging c
  set official_program_url=v.official_program_url,
      program_code=coalesce(c.program_code,v.program_code),
      source_status='official_program_page_verified_open_international_2026',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  from verified v
  where c.institution_name='Conestoga College' and c.title=v.title
  returning c.id
)
update public.program_pgwp_ca_staging p
set international_students_eligible=true,
    international_program_admission_status='official_program_page_open_international_2026',
    verified_at=now()
where p.program_catalog_id in (select id from updated_catalog);
