-- Reconcile occupation-priority Conestoga programmes with current official admission restrictions as of 2026-08-08.
with closed_programmes(title, official_program_url) as (
  values
    ('Bachelor of Human Resource Management', 'https://www.conestogac.on.ca/fulltime/bachelor-of-human-resource-management'),
    ('Business Analytics', 'https://www.conestogac.on.ca/fulltime/business-analytics'),
    ('Cloud Data Management', 'https://www.conestogac.on.ca/fulltime/cloud-data-management'),
    ('Information Technology Business Analysis', 'https://www.conestogac.on.ca/fulltime/information-technology-business-analysis'),
    ('Project Management', 'https://www.conestogac.on.ca/fulltime/project-management'),
    ('Sustainable Urban Design', 'https://www.conestogac.on.ca/fulltime/sustainable-urban-design'),
    ('Virtualization and Cloud Computing', 'https://www.conestogac.on.ca/fulltime/virtualization-and-cloud-computing')
), closed_updated as (
  update public.program_catalog_ca_staging c
  set official_program_url=v.official_program_url,
      source_status='not_accepting_current_2026',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  from closed_programmes v
  where c.institution_name='Conestoga College' and c.title=v.title
  returning c.id
), closed_pgwp as (
  update public.program_pgwp_ca_staging p
  set international_program_admission_status='applications_not_currently_accepted_2026',
      verified_at=now()
  where p.program_catalog_id in (select id from closed_updated)
  returning p.program_catalog_id
), bscn_updated as (
  update public.program_catalog_ca_staging c
  set official_program_url='https://www.conestogac.on.ca/fulltime/bachelor-of-science-nursing-honours',
      program_code=coalesce(c.program_code,'1573'),
      source_status='pending_review_current_admission_restriction_2026',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  where c.institution_name='Conestoga College' and c.title='Bachelor of Science - Nursing (Honours)'
  returning c.id
), bscn_pgwp as (
  update public.program_pgwp_ca_staging p
  set international_students_eligible=false,
      international_program_admission_status='restricted_not_open_outside_ontario_current_program_page',
      verified_at=now()
  where p.program_catalog_id in (select id from bscn_updated)
  returning p.program_catalog_id
), practical_updated as (
  update public.program_catalog_ca_staging c
  set official_program_url='https://www.conestogac.on.ca/fulltime/practical-nursing',
      program_code=coalesce(c.program_code,'1077'),
      source_status='pending_review_international_direct_entry_restriction_2027',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  where c.institution_name='Conestoga College' and c.title='Practical Nursing'
  returning c.id
)
update public.program_pgwp_ca_staging p
set international_students_eligible=true,
    international_program_admission_status='international_direct_entry_not_available_prehealth_required_2027',
    verified_at=now()
where p.program_catalog_id in (select id from practical_updated);
