-- Verify occupation-priority Fanshawe IT/Data programmes using current international availability and Fanshawe PGWP-aligned list checked 2026-08-08.
with verified(program_code, official_program_url, cip_code) as (
  values
    ('CPA3','https://www.fanshawec.ca/programs/cpa3-computer-programming-and-analysis/next','11.0201'),
    ('CTN2','https://www.fanshawec.ca/programs/ctn2-computer-systems-technician/current','15.1202'),
    ('CYB1','https://www.fanshawec.ca/programs/cyb1-cyber-security/next','11.1003'),
    ('DAA1','https://www.fanshawec.ca/programs/daa1-data-analytics/current','30.7101')
), updated_catalog as (
  update public.program_catalog_ca_staging c
  set official_program_url=v.official_program_url,
      source_status='official_program_page_verified_international_open_2026_27',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  from verified v
  where c.institution_name='Fanshawe College' and c.program_code=v.program_code
  returning c.id,c.program_code
), updated_pgwp as (
  update public.program_pgwp_ca_staging p
  set international_students_eligible=true,
      international_program_admission_status='official_program_page_international_open_2026_27',
      ircc_program_eligible=true,
      pgwp_program_status='school_official_pgwp_eligible_2026_27',
      cip_code=v.cip_code,
      verified_at=now()
  from updated_catalog c join verified v on v.program_code=c.program_code
  where p.program_catalog_id=c.id
  returning p.program_catalog_id
), ban2 as (
  update public.program_catalog_ca_staging c
  set official_program_url='https://www.fanshawec.ca/programs/ban2-business-analysis/current',
      source_status='pending_review_online_only_non_campus_2026',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  where c.institution_name='Fanshawe College' and c.program_code='BAN2'
  returning c.id
)
update public.program_pgwp_ca_staging p
set international_students_eligible=true,
    international_program_admission_status='international_applications_supported_but_fully_online_only_2026',
    ircc_program_eligible=null,
    pgwp_program_status='online_only_pgwp_not_verified_hold',
    verified_at=now()
where p.program_catalog_id in (select id from ban2);
