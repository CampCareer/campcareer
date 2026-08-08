-- Verify occupation-priority Centennial business and construction-project programmes using current Fall 2026 orientation, current official programme pages with international application paths, and 2026-27 availability updates checked 2026-08-08.
with verified(program_code, official_program_url) as (
  values
    ('2405','https://www.centennialcollege.ca/programs-courses/full-time/business-administration-accounting'),
    ('2506','https://www.centennialcollege.ca/programs-courses/full-time/business-operations'),
    ('2507','https://www.centennialcollege.ca/programs-courses/full-time/business-operations-management'),
    ('2801','https://www.centennialcollege.ca/programs-courses/full-time/business-accounting'),
    ('2805','https://www.centennialcollege.ca/programs-courses/full-time/business-marketing'),
    ('2816','https://www.centennialcollege.ca/programs-courses/full-time/human-resources-business'),
    ('2849','https://www.centennialcollege.ca/programs-courses/full-time/marketing-digital-engagement-strategy'),
    ('2862','https://www.centennialcollege.ca/programs-courses/full-time/logistics-management'),
    ('3130','https://www.centennialcollege.ca/programs-courses/full-time/construction-project-management')
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
      international_program_admission_status='official_current_program_with_international_application_path_fall_2026',
      verified_at=now()
  where p.program_catalog_id in (select id from updated)
  returning p.program_catalog_id
), direct_relations as (
  update public.program_occupation_ca_staging o
  set review_status='approved', match_basis='manual', relation_type='direct', source_checked_at=now(), reviewed_at=now(), reviewer_note='Reviewed against current Centennial programme scope and career focus.'
  from public.program_catalog_ca_staging c
  where o.program_catalog_id=c.id and c.institution_name='Centennial College'
    and ((c.program_code in ('2405','2801') and o.canonical_career_id='accountant') or (c.program_code in ('2805','2849') and o.canonical_career_id='marketing-specialist') or (c.program_code='2816' and o.canonical_career_id='human-resources-specialist'))
  returning o.program_catalog_id
), construction_relation as (
  update public.program_occupation_ca_staging o
  set review_status='approved', match_basis='manual', relation_type='common_pathway', source_checked_at=now(), reviewed_at=now(), reviewer_note='Construction Project Management is a common pathway for construction/project management roles.'
  from public.program_catalog_ca_staging c
  where o.program_catalog_id=c.id and c.institution_name='Centennial College' and c.program_code='3130' and o.canonical_career_id in ('construction-manager','project-manager')
  returning o.program_catalog_id
)
update public.program_occupation_ca_staging o
set review_status='approved', match_basis='manual', relation_type='common_pathway', source_checked_at=now(), reviewed_at=now(), reviewer_note='Supply-chain/operations programme is a common pathway across logistics, supply-chain analysis and warehouse management roles.'
from public.program_catalog_ca_staging c
where o.program_catalog_id=c.id and c.institution_name='Centennial College' and c.program_code in ('2506','2507','2862') and o.canonical_career_id in ('logistics-coordinator','supply-chain-analyst','warehouse-manager');
