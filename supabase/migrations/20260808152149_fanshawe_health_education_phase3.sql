-- Classify occupation-priority Fanshawe health/education/community programmes and review occupation relations using current official programme pages and PGWP-aligned register, checked 2026-08-08.
with verified(program_code, official_program_url, admission_status, pgwp_eligible, cip_code) as (
  values
    ('ECE1','https://www.fanshawec.ca/programs/ece1-early-childhood-education/next','official_program_page_international_open_2026_27',true,'19.0709'),
    ('ECE6','https://www.fanshawec.ca/programs/ece6-early-childhood-education-fast-track/next','official_program_page_international_open_2026',true,'19.0709'),
    ('OPA1','https://www.fanshawec.ca/programs/opa1-occupational-therapist-assistant-and-physiotherapist-asst/next','official_program_page_international_open_2026',true,'51.0803'),
    ('PNG5','https://www.fanshawec.ca/programs/png5-practical-nursing/next','official_program_page_international_open_prehealth_required_2026',true,'51.3901'),
    ('PSW6','https://www.fanshawec.ca/programs/psw6-personal-support-worker/next','official_program_page_international_open_2026_27',true,'51.2602'),
    ('PSW9','https://www.fanshawec.ca/programs/psw9-personal-support-worker/next','official_program_page_international_open_weekend_2026',null,null),
    ('PTN1','https://www.fanshawec.ca/programs/ptn1-pharmacy-technician/next','official_program_page_international_open_2026_27',true,'51.0805'),
    ('RPA1','https://www.fanshawec.ca/programs/rpa1-community-pharmacy-assistant/next','official_program_page_international_open_2026_27',true,'51.0805'),
    ('SSW1','https://www.fanshawec.ca/programs/ssw1-social-service-worker/next','official_program_page_international_open_2026_27',true,'44.0000'),
    ('SSW2','https://www.fanshawec.ca/programs/ssw2-social-service-worker-fast-track/current','official_program_page_international_open_2026',true,'44.0000')
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
      international_program_admission_status=v.admission_status,
      ircc_program_eligible=v.pgwp_eligible,
      pgwp_program_status=case
        when v.pgwp_eligible is true then 'school_official_pgwp_eligible_2026_27'
        when v.pgwp_eligible is false then 'school_official_pgwp_ineligible_2026_27'
        else 'school_pgwp_alignment_not_listed_no_inference'
      end,
      cip_code=coalesce(v.cip_code,p.cip_code),
      verified_at=now()
  from updated_catalog c join verified v on v.program_code=c.program_code
  where p.program_catalog_id=c.id
  returning p.program_catalog_id
), ece5j as (
  update public.program_catalog_ca_staging c
  set official_program_url='https://www.fanshawec.ca/programs/ece5j-early-childhood-education-accelerated/current',
      source_status='international_not_accepting_current_future_intake_2026_27',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  where c.institution_name='Fanshawe College' and c.program_code='ECE5J'
  returning c.id
), ece5j_pgwp as (
  update public.program_pgwp_ca_staging p
  set international_students_eligible=true,
      international_program_admission_status='international_only_listed_2026_august_closed_no_future_open_intake',
      ircc_program_eligible=null,
      pgwp_program_status='school_pgwp_alignment_not_listed_no_inference',
      verified_at=now()
  where p.program_catalog_id in (select id from ece5j)
  returning p.program_catalog_id
), nsg4 as (
  update public.program_catalog_ca_staging c
  set program_code='NSG4',
      official_program_url='https://www.fanshawec.ca/programs/nsg4-bachelor-science-nursing/next',
      source_status='international_not_available_domestic_only_2026_27',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  where c.id=1973 and c.institution_name='Fanshawe College'
  returning c.id
), nsg4_pgwp as (
  update public.program_pgwp_ca_staging p
  set international_students_eligible=false,
      international_program_admission_status='current_program_domestic_applicants_only_2026_27',
      verified_at=now()
  where p.program_catalog_id in (select id from nsg4)
  returning p.program_catalog_id
), clt1 as (
  update public.program_catalog_ca_staging c
  set official_program_url='https://www.fanshawec.ca/programs/clt1-chemical-laboratory-technology-science-laboratory/next',
      source_status='official_program_page_verified_international_open_2026',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  where c.institution_name='Fanshawe College' and c.program_code='CLT1'
  returning c.id
), reject_clt1 as (
  update public.program_occupation_ca_staging o
  set review_status='rejected',
      match_basis='manual',
      relation_type=null,
      source_checked_at=now(),
      reviewed_at=now(),
      reviewer_note='Rejected: Chemical Laboratory Technology prepares for industrial/research laboratory work, not the Medical Laboratory Technician occupation.'
  where o.program_catalog_id in (select id from clt1)
    and o.canonical_career_id='medical-laboratory-technician'
  returning o.program_catalog_id
), approve_direct as (
  update public.program_occupation_ca_staging o
  set review_status='approved',
      match_basis='manual',
      relation_type='direct',
      source_checked_at=now(),
      reviewed_at=now(),
      reviewer_note='Reviewed against current official Fanshawe programme page.'
  from public.program_catalog_ca_staging c
  where o.program_catalog_id=c.id and c.institution_name='Fanshawe College'
    and ((c.program_code in ('ECE1','ECE6') and o.canonical_career_id='early-childhood-teacher')
      or (c.program_code in ('PSW6','PSW9') and o.canonical_career_id='care-worker')
      or (c.program_code in ('SSW1','SSW2') and o.canonical_career_id='community-worker')
      or (c.program_code='NSG4' and o.canonical_career_id='registered-nurse'))
  returning o.program_catalog_id
)
update public.program_occupation_ca_staging o
set review_status='approved',
    match_basis='manual',
    relation_type='related',
    source_checked_at=now(),
    reviewed_at=now(),
    reviewer_note='Related health pathway; this programme does not itself confer the target professional title.'
from public.program_catalog_ca_staging c
where o.program_catalog_id=c.id and c.institution_name='Fanshawe College'
  and ((c.program_code='OPA1' and o.canonical_career_id in ('occupational-therapist','physiotherapist'))
    or (c.program_code in ('PTN1','RPA1') and o.canonical_career_id='pharmacist')
    or (c.program_code='PNG5' and o.canonical_career_id='registered-nurse'));
