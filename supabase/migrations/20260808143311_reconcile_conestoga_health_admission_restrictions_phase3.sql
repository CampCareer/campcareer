-- Reconcile current Conestoga health-program admission restrictions against official programme pages.
-- Keep current programme identity evidence while preventing restricted/domestic-only rows from becoming Tier A.

with domestic_only(title, official_program_url, program_code, source_status, admission_status) as (
  values
    ('Personal Support Worker', 'https://www.conestogac.on.ca/fulltime/personal-support-worker', null::text, 'official_program_page_international_redirect_2026', 'international_ineligible_separate_international_program_required_2026'),
    ('Personal Support Worker - FAST Delivery', 'https://www.conestogac.on.ca/fulltime/personal-support-worker-fast-delivery', null::text, 'not_accepting_current_program_2026', 'not_accepting_international_redirect_to_separate_program_2026'),
    ('Medical Laboratory Science', 'https://www.conestogac.on.ca/fulltime/medical-laboratory-science', '1542', 'official_program_page_international_ineligible_2026', 'not_eligible_for_study_permit_program_not_open_to_international_students_2026')
), updated_domestic as (
  update public.program_catalog_ca_staging c
  set official_program_url = d.official_program_url,
      program_code = coalesce(c.program_code, d.program_code),
      source_status = d.source_status,
      source_as_of = greatest(coalesce(c.source_as_of, date '1900-01-01'), date '2026-08-08')
  from domestic_only d
  where c.institution_name='Conestoga College' and c.title=d.title
  returning c.id
), updated_domestic_pgwp as (
  update public.program_pgwp_ca_staging p
  set international_students_eligible=false,
      international_program_admission_status=d.admission_status,
      verified_at=now()
  from public.program_catalog_ca_staging c
  join domestic_only d on d.title=c.title
  where p.program_catalog_id=c.id and c.institution_name='Conestoga College'
  returning p.program_catalog_id
), restricted(title, official_program_url, program_code) as (
  values
    ('Medical Laboratory Assistant/Technician', 'https://www.conestogac.on.ca/fulltime/medical-laboratory-assistant-technician', '1620'),
    ('Veterinary Technician', 'https://www.conestogac.on.ca/fulltime/veterinary-technician', '1547')
), updated_restricted as (
  update public.program_catalog_ca_staging c
  set official_program_url=r.official_program_url,
      program_code=coalesce(c.program_code,r.program_code),
      source_status='pending_review_current_admission_restriction_2026',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  from restricted r
  where c.institution_name='Conestoga College' and c.title=r.title
  returning c.id
)
update public.program_pgwp_ca_staging p
set international_program_admission_status='restricted_not_open_outside_ontario_current_program_page',
    verified_at=now()
where p.program_catalog_id in (select id from updated_restricted);
