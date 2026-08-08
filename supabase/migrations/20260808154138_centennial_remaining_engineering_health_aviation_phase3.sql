-- Verify remaining clear Centennial engineering/health/aviation occupation-priority programmes using current official programme pages and 2026 programme inventories checked 2026-08-08.
with verified(program_code, official_program_url) as (
  values
    ('3205','https://www.centennialcollege.ca/programs-courses/full-time/electronics-engineering-technician'),
    ('3221','https://www.centennialcollege.ca/programs-courses/full-time/electronics-engineering-technician-fast-track'),
    ('3407','https://www.centennialcollege.ca/programs-courses/full-time/biomedical-engineering-technology'),
    ('3427','https://www.centennialcollege.ca/programs-courses/full-time/biomedical-engineering-technology-fast-track'),
    ('3721','https://www.centennialcollege.ca/programs-courses/full-time/aerospace-manufacturing-engineering-technician'),
    ('3722','https://www.centennialcollege.ca/programs-courses/full-time/aerospace-manufacturing-engineering-technology'),
    ('3725','https://www.centennialcollege.ca/programs-courses/full-time/mech-engineering-tech-design-industrial-fast-track'),
    ('3775','https://www.centennialcollege.ca/programs-courses/full-time/energy-systems-engineering-technician-fast-track'),
    ('3831','https://www.centennialcollege.ca/programs-courses/full-time/electrical-techniques'),
    ('3832','https://www.centennialcollege.ca/programs-courses/full-time/electrical-engineering-technician-fast-track'),
    ('3833','https://www.centennialcollege.ca/programs-courses/full-time/electrical-engineering-technology-fast-track-4-sem'),
    ('5850','https://www.centennialcollege.ca/programs-courses/full-time/pharmacy-technician'),
    ('8112','https://www.centennialcollege.ca/programs-courses/full-time/aircraft-maintenance-aviation-technician')
), updated as (
  update public.program_catalog_ca_staging c set official_program_url=v.official_program_url, source_status='official_program_page_verified_international_active_2026_27', source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08') from verified v where c.institution_name='Centennial College' and c.program_code=v.program_code returning c.id,c.program_code
), admission as (
  update public.program_pgwp_ca_staging p set international_students_eligible=true, international_program_admission_status='official_current_program_with_international_application_path_2026_27', verified_at=now() where p.program_catalog_id in (select id from updated) returning p.program_catalog_id
), direct_relations as (
  update public.program_occupation_ca_staging o set review_status='approved', match_basis='manual', relation_type='direct', source_checked_at=now(), reviewed_at=now(), reviewer_note='Reviewed against current Centennial programme scope and occupational preparation.'
  from public.program_catalog_ca_staging c where o.program_catalog_id=c.id and c.institution_name='Centennial College' and ((c.program_code in ('3205','3221','3407','3427','3721','3722','3725','3775','3832','3833') and o.canonical_career_id='engineering-technician') or (c.program_code='3831' and o.canonical_career_id='electrician') or (c.program_code='8112' and o.canonical_career_id='aircraft-maintenance-technician')) returning o.program_catalog_id
), professional_related as (
  update public.program_occupation_ca_staging o set review_status='approved', match_basis='manual', relation_type='related', source_checked_at=now(), reviewed_at=now(), reviewer_note='Related education pathway; this technician/technology programme does not itself confer the target regulated professional title.'
  from public.program_catalog_ca_staging c where o.program_catalog_id=c.id and c.institution_name='Centennial College' and ((c.program_code in ('3205','3221','3832','3833') and o.canonical_career_id='electrical-engineer') or (c.program_code='3725' and o.canonical_career_id='mechanical-engineer') or (c.program_code='5850' and o.canonical_career_id='pharmacist')) returning o.program_catalog_id
)
select count(*) from updated;
