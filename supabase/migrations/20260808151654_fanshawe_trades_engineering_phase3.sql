-- Classify occupation-priority Fanshawe trades/engineering programmes using current programme availability plus the official PGWP-aligned list, checked 2026-08-08.
with verified(program_code, official_program_url, cip_code) as (
  values
    ('AAM5','https://www.fanshawec.ca/programs/aam5-aviation-technician-aircraft-maintenance-co-op/next','47.0607'),
    ('AVI3','https://www.fanshawec.ca/programs/avi3-aviation-technology-aircraft-maintenance-avionics-co-op/next','47.0607'),
    ('CEN2','https://www.fanshawec.ca/programs/cen2-construction-engineering-technician/next','15.1001'),
    ('CEY2','https://www.fanshawec.ca/programs/cey2-civil-engineering-technology/next','15.0201'),
    ('CIN1','https://www.fanshawec.ca/programs/cin1-civil-engineering-technician/next','15.0201'),
    ('CIN2','https://www.fanshawec.ca/programs/cin2-civil-engineering-technician/next','15.0201'),
    ('CMY3','https://www.fanshawec.ca/programs/cmy3-construction-engineering-technology-management-co-op/next','15.1001'),
    ('CPJ3','https://www.fanshawec.ca/programs/cpj3-construction-project-management/next','52.2002'),
    ('CRQ1','https://www.fanshawec.ca/programs/crq1-carpentry-and-renovation-techniques/next','46.0201'),
    ('CRT1','https://www.fanshawec.ca/programs/crt1-carpentry-and-renovation-technician/next','46.0201'),
    ('ELT1','https://www.fanshawec.ca/programs/elt1-electrical-techniques/next','46.0302'),
    ('EMN2','https://www.fanshawec.ca/programs/emn2-electromechanical-engineering-technician-coop/next','15.0403'),
    ('EMY1','https://www.fanshawec.ca/programs/emy1-electromechanical-engineering-technology/next','15.0403'),
    ('MIM3S','https://www.fanshawec.ca/programs/mim3s-mechanical-engineering-technician-industrial-maintenance/next','15.0805'),
    ('WFT1','https://www.fanshawec.ca/programs/wft1-welding-and-fabrication-technician/next','48.0508'),
    ('WTQ1J','https://www.fanshawec.ca/programs/wtq1j-welding-techniques/next','48.0508')
), updated_catalog as (
  update public.program_catalog_ca_staging c
  set official_program_url=v.official_program_url,
      source_status='official_program_page_verified_international_open_or_waitlisted_2026_27',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  from verified v
  where c.institution_name='Fanshawe College' and c.program_code=v.program_code
  returning c.id,c.program_code
), updated_pgwp as (
  update public.program_pgwp_ca_staging p
  set international_students_eligible=true,
      international_program_admission_status='official_program_page_international_open_or_waitlisted_2026_27',
      ircc_program_eligible=true,
      pgwp_program_status='school_official_pgwp_eligible_2026_27',
      cip_code=v.cip_code,
      verified_at=now()
  from updated_catalog c join verified v on v.program_code=c.program_code
  where p.program_catalog_id=c.id
  returning p.program_catalog_id
), held(program_code, official_program_url, cip_code) as (
  values
    ('ELN2','https://www.fanshawec.ca/programs/eln2-electrical-engineering-technician/next','15.0303'),
    ('ELY6','https://www.fanshawec.ca/programs/ely6-electrical-engineering-technologyco-op/next','15.0303'),
    ('PLQ1','https://www.fanshawec.ca/programs/plq1-plumbing-techniques/next','46.0503')
), held_catalog as (
  update public.program_catalog_ca_staging c
  set official_program_url=h.official_program_url,
      source_status='international_not_accepting_current_future_intake_2026_27',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  from held h
  where c.institution_name='Fanshawe College' and c.program_code=h.program_code
  returning c.id,c.program_code
), held_pgwp as (
  update public.program_pgwp_ca_staging p
  set international_students_eligible=true,
      international_program_admission_status='international_intake_closed_current_page_2026_27',
      ircc_program_eligible=true,
      pgwp_program_status='school_official_pgwp_eligible_2026_27',
      cip_code=h.cip_code,
      verified_at=now()
  from held_catalog c join held h on h.program_code=c.program_code
  where p.program_catalog_id=c.id
  returning p.program_catalog_id
), duplicate_shadow as (
  update public.program_catalog_ca_staging c
  set source_status='legacy_duplicate_shadow_current_coded_program',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  where c.id=1970
  returning c.id
)
update public.program_pgwp_ca_staging p
set international_students_eligible=false,
    international_program_admission_status='duplicate_shadow_of_fanshawe_aam5',
    verified_at=now()
where p.program_catalog_id in (select id from duplicate_shadow);
