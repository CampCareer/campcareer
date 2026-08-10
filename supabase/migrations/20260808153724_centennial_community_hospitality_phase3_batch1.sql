-- Verify clear Centennial community/hospitality occupation pathways and reject non-core/false-positive occupation matches using current official programme pages checked 2026-08-08.
with verified(program_code, official_program_url) as (
  values
    ('1201','https://www.centennialcollege.ca/programs-courses/full-time/1201'),
    ('1203','https://www.centennialcollege.ca/programs-courses/full-time/social-service-worker'),
    ('1205','https://www.centennialcollege.ca/programs-courses/full-time/child-youth-care'),
    ('1230','https://www.centennialcollege.ca/programs-courses/full-time/community-development-work'),
    ('1607','https://www.centennialcollege.ca/programs-courses/full-time/nutrition-and-food-service-management'),
    ('1810','https://www.centennialcollege.ca/programs-courses/full-time/baking-skills'),
    ('1811','https://www.centennialcollege.ca/programs-courses/full-time/culinary-management'),
    ('1813','https://www.centennialcollege.ca/programs-courses/full-time/baking-pastry-management'),
    ('1838','https://www.centennialcollege.ca/programs-courses/full-time/event-planning')
), updated as (
  update public.program_catalog_ca_staging c
  set official_program_url=v.official_program_url,
      source_status='official_program_page_verified_international_active_2026_27',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  from verified v
  where c.institution_name='Centennial College' and c.program_code=v.program_code
  returning c.id,c.program_code
), admission as (
  update public.program_pgwp_ca_staging p
  set international_students_eligible=true,
      international_program_admission_status='official_program_page_current_with_international_application_path_2026_27',
      verified_at=now()
  where p.program_catalog_id in (select id from updated)
  returning p.program_catalog_id
), foundation as (
  update public.program_catalog_ca_staging c
  set official_program_url='https://www.centennialcollege.ca/programs-courses/full-time/1232',
      source_status='excluded_non_core_foundation_pathway',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  where c.institution_name='Centennial College' and c.program_code='1232'
  returning c.id
), reject_foundation as (
  update public.program_occupation_ca_staging o
  set review_status='rejected', match_basis='manual', relation_type=null,
      source_checked_at=now(), reviewed_at=now(),
      reviewer_note='Rejected: Community Services and Child Studies Foundations is a preparatory foundation programme, not a direct/community-worker study pathway.'
  where o.program_catalog_id in (select id from foundation) and o.canonical_career_id='community-worker'
  returning o.program_catalog_id
), reject_hotel_supply as (
  update public.program_occupation_ca_staging o
  set review_status='rejected', match_basis='manual', relation_type=null,
      source_checked_at=now(), reviewed_at=now(),
      reviewer_note='Rejected: Hospitality - Hotel Operations Management is not a Supply Chain Analyst programme.'
  from public.program_catalog_ca_staging c
  where o.program_catalog_id=c.id and c.institution_name='Centennial College' and c.program_code='1807'
    and o.canonical_career_id='supply-chain-analyst'
  returning o.program_catalog_id
), direct_relations as (
  update public.program_occupation_ca_staging o
  set review_status='approved', match_basis='manual', relation_type='direct',
      source_checked_at=now(), reviewed_at=now(),
      reviewer_note='Reviewed against current official Centennial programme scope and career outcomes.'
  from public.program_catalog_ca_staging c
  where o.program_catalog_id=c.id and c.institution_name='Centennial College'
    and ((c.program_code='1201' and o.canonical_career_id='early-childhood-teacher')
      or (c.program_code='1203' and o.canonical_career_id='community-worker')
      or (c.program_code='1205' and o.canonical_career_id='youth-worker')
      or (c.program_code in ('1810','1813') and o.canonical_career_id='baker')
      or (c.program_code='1811' and o.canonical_career_id='chef')
      or (c.program_code='1838' and o.canonical_career_id='event-planner'))
  returning o.program_catalog_id
), pathway_relations as (
  update public.program_occupation_ca_staging o
  set review_status='approved', match_basis='manual', relation_type='common_pathway',
      source_checked_at=now(), reviewed_at=now(),
      reviewer_note='Reviewed as a common education pathway to the occupation.'
  from public.program_catalog_ca_staging c
  where o.program_catalog_id=c.id and c.institution_name='Centennial College'
    and c.program_code='1230' and o.canonical_career_id='community-worker'
  returning o.program_catalog_id
)
update public.program_occupation_ca_staging o
set review_status='approved', match_basis='manual', relation_type='related',
    source_checked_at=now(), reviewed_at=now(),
    reviewer_note='Related food-service management pathway; not a one-to-one hospitality supervisor credential.'
from public.program_catalog_ca_staging c
where o.program_catalog_id=c.id and c.institution_name='Centennial College'
  and c.program_code='1607' and o.canonical_career_id='hospitality-supervisor';
