-- Hold Conestoga occupation-priority rows without a current open international application path.
with held(title, official_program_url, program_code, admission_status) as (
  values
    ('Motive Power Technician - Automotive Service','https://www.conestogac.on.ca/fulltime/motive-power-technician-automotive-service','0741','current_page_canadian_application_only_2026'),
    ('Predictive Analytics','https://www.conestogac.on.ca/fulltime/predictive-analytics','1498','applications_not_currently_accepted_2026'),
    ('Production GMAW Welder','https://www.conestogac.on.ca/fulltime/production-gmaw-welder','1337','applications_not_currently_accepted_current_page'),
    ('Sustainable Waste Management (Optional Co-op)','https://www.conestogac.on.ca/fulltime/sustainable-waste-management','1599','applications_not_currently_accepted_2027'),
    ('Woodworking Techniques - CNC','https://www.conestogac.on.ca/fulltime/woodworking-techniques-cnc',null,'applications_not_currently_accepted_no_intake'),
    ('Woodworking Technology (Optional Co-op)','https://www.conestogac.on.ca/fulltime/woodworking-technology','0804','applications_not_currently_accepted_2026')
), updated as (
  update public.program_catalog_ca_staging c
  set official_program_url=h.official_program_url,
      program_code=coalesce(c.program_code,h.program_code),
      source_status='not_accepting_current_2026',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  from held h
  where c.institution_name='Conestoga College' and c.title=h.title
  returning c.id,c.title
)
update public.program_pgwp_ca_staging p
set international_program_admission_status=h.admission_status,
    verified_at=now()
from held h join updated u on u.title=h.title
where p.program_catalog_id=u.id;
