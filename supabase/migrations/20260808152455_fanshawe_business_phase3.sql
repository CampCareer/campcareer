-- Classify occupation-priority Fanshawe business programmes using current programme pages checked 2026-08-08.
with verified(program_code, official_program_url) as (
  values
    ('AOM2','https://www.fanshawec.ca/programs/aom2-aerospace-operations-management/next'),
    ('BAA2','https://www.fanshawec.ca/programs/baa2-business-administration-accounting/next'),
    ('BAC2','https://www.fanshawec.ca/programs/bac2-business-accounting/next'),
    ('BAC4','https://www.fanshawec.ca/programs/bac4-business-accounting-co-op/next'),
    ('BAM2','https://www.fanshawec.ca/programs/bam2-business-administration-marketing/next'),
    ('BCA1','https://www.fanshawec.ca/programs/bca1-honours-bachelor-commerce-accounting/next'),
    ('BDM1','https://www.fanshawec.ca/programs/bdm1-honours-bachelor-commerce-digital-marketing/next'),
    ('BFN4','https://www.fanshawec.ca/programs/bfn4-business-finance/next'),
    ('BFN5','https://www.fanshawec.ca/programs/bfn5-business-finance-co-op/next'),
    ('BHM1','https://www.fanshawec.ca/programs/bhm1-honours-bachelor-commerce-human-resources-management/next'),
    ('BHR1','https://www.fanshawec.ca/programs/bhr1-business-human-resources/next'),
    ('BLS3','https://www.fanshawec.ca/programs/bls3-business-supply-chain-and-operations/next'),
    ('BLS4','https://www.fanshawec.ca/programs/bls4-business-supply-chain-and-operations-co-op/next'),
    ('BMK1','https://www.fanshawec.ca/programs/bmk1-business-marketing/next'),
    ('BMK2','https://www.fanshawec.ca/programs/bmk2-business-marketing-co-op/next'),
    ('CRM2','https://www.fanshawec.ca/programs/crm2-customer-relationship-marketing-sales-management/next'),
    ('MKM1','https://www.fanshawec.ca/programs/mkm1-marketing-management/next'),
    ('SCM2','https://www.fanshawec.ca/programs/scm2-supply-chain-management-logistics-co-op/next'),
    ('FMC3','https://www.fanshawec.ca/programs/fmc3-fashion-marketing-and-management/next')
), updated_catalog as (
  update public.program_catalog_ca_staging c
  set official_program_url=v.official_program_url,
      source_status='official_program_page_verified_international_open_2026_27',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  from verified v
  where c.institution_name='Fanshawe College' and c.program_code=v.program_code
  returning c.id
), updated_admission as (
  update public.program_pgwp_ca_staging p
  set international_students_eligible=true,
      international_program_admission_status='official_program_page_international_open_2026_27',
      verified_at=now()
  where p.program_catalog_id in (select id from updated_catalog)
  returning p.program_catalog_id
), online_held(program_code, official_program_url) as (
  values
    ('HMG1','https://www.fanshawec.ca/programs/hmg1-human-resources-management/next'),
    ('PAC2','https://www.fanshawec.ca/programs/pac2-professional-accounting/next'),
    ('PRJ1','https://www.fanshawec.ca/programs/prj1-project-management/next')
), online_updated as (
  update public.program_catalog_ca_staging c
  set official_program_url=h.official_program_url,
      source_status='pending_review_online_only_non_campus_2026_27',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  from online_held h
  where c.institution_name='Fanshawe College' and c.program_code=h.program_code
  returning c.id
), online_pgwp as (
  update public.program_pgwp_ca_staging p
  set international_program_admission_status='international_application_supported_but_fully_online_only_2026_27',
      verified_at=now()
  where p.program_catalog_id in (select id from online_updated)
  returning p.program_catalog_id
), smm1 as (
  update public.program_catalog_ca_staging c
  set official_program_url='https://www.fanshawec.ca/programs/smm1-sport-and-event-marketing/next',
      source_status='international_not_accepting_current_future_intake_2026',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  where c.institution_name='Fanshawe College' and c.program_code='SMM1'
  returning c.id
)
update public.program_pgwp_ca_staging p
set international_program_admission_status='international_september_2026_closed',
    verified_at=now()
where p.program_catalog_id in (select id from smm1);
