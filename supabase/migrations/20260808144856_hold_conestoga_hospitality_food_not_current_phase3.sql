-- Hold Conestoga hospitality/food programmes without a current open international intake as of 2026-08-08.
with held(title, official_program_url, admission_status) as (
  values
    ('Event Management','https://www.conestogac.on.ca/fulltime/event-management','latest_listed_intake_january_2026_passed_no_current_open_intake'),
    ('Food and Beverage Management - Hotel and Restaurant Operations (Optional Co-op)','https://www.conestogac.on.ca/fulltime/food-and-beverage-management-hotel-and-restaurant-operations','applications_not_currently_accepted_2026'),
    ('Food Processing Technician (Optional Co-op)','https://www.conestogac.on.ca/fulltime/food-processing-technician','applications_not_currently_accepted_2027'),
    ('Food Safety and Quality Assurance - Food Processing','https://www.conestogac.on.ca/fulltime/food-safety-and-quality-assurance-food-processing','latest_listed_intake_january_2026_passed_no_current_open_intake'),
    ('Global Hospitality Management (Optional Co-op)','https://www.conestogac.on.ca/fulltime/global-hospitality-management','applications_not_currently_accepted_2026'),
    ('Hospitality Operations - Food and Beverage','https://www.conestogac.on.ca/fulltime/hospitality-operations-food-and-beverage','applications_not_currently_accepted_2026'),
    ('Italian Culinary Arts','https://www.conestogac.on.ca/fulltime/italian-culinary-arts','latest_listed_intake_september_2025_passed_no_current_open_intake')
), updated as (
  update public.program_catalog_ca_staging c
  set official_program_url=h.official_program_url,
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
