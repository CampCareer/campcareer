-- Finalize remaining occupation-priority Conestoga rows checked against current official pages on 2026-08-08.
with verified as (
  update public.program_catalog_ca_staging c
  set official_program_url='https://www.conestogac.on.ca/fulltime/social-media-marketing',
      program_code=coalesce(c.program_code,'1537'),
      source_status='official_program_page_verified_open_international_2026',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  where c.institution_name='Conestoga College' and c.title='Social Media Marketing'
  returning c.id
), verified_pgwp as (
  update public.program_pgwp_ca_staging p
  set international_students_eligible=true,
      international_program_admission_status='official_program_page_open_international_2026',
      verified_at=now()
  where p.program_catalog_id in (select id from verified)
  returning p.program_catalog_id
), held(title, official_program_url, program_code) as (
  values
    ('Business Administration - Accounting Accelerated','https://www.conestogac.on.ca/fulltime/business-administration-accounting-accelerated','2011'),
    ('Esports Marketing and Event Management','https://www.conestogac.on.ca/fulltime/esports-marketing-and-event-management','1563'),
    ('Interactive Media Management - Interaction Design','https://www.conestogac.on.ca/fulltime/interactive-media-management-interaction-design','1404'),
    ('Nutrition and Food Service Management','https://www.conestogac.on.ca/fulltime/nutrition-and-food-service-management','1570'),
    ('Strategic Marketing and Research Analysis','https://www.conestogac.on.ca/fulltime/strategic-marketing-and-research-analysis','1597'),
    ('Strategic Marketing Communications','https://www.conestogac.on.ca/fulltime/strategic-marketing-communications','1403')
), held_updated as (
  update public.program_catalog_ca_staging c
  set official_program_url=h.official_program_url,
      program_code=coalesce(c.program_code,h.program_code),
      source_status='not_accepting_current_2026',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  from held h
  where c.institution_name='Conestoga College' and c.title=h.title
  returning c.id
)
update public.program_pgwp_ca_staging p
set international_program_admission_status='applications_not_currently_accepted_2026',
    verified_at=now()
where p.program_catalog_id in (select id from held_updated);
