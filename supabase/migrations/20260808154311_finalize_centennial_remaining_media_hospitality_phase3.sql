-- Finalize remaining Centennial occupation-priority media/hospitality rows conservatively after current official-site review on 2026-08-08.
with broadcasting as (
  update public.program_catalog_ca_staging c
  set official_program_url='https://www.centennialcollege.ca/programs-courses/full-time/radio-television-film-digital-media', source_status='official_program_page_verified_international_available_2026_27', source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  where c.institution_name='Centennial College' and c.program_code='6401' returning c.id
), broadcasting_pgwp as (
  update public.program_pgwp_ca_staging p set international_students_eligible=true, international_program_admission_status='official_program_page_international_available_september_2026', ircc_program_eligible=false, pgwp_program_status='school_official_pgwp_ineligible_2026_27', verified_at=now() where p.program_catalog_id in (select id from broadcasting) returning p.program_catalog_id
), broadcasting_relation as (
  update public.program_occupation_ca_staging o set review_status='approved', match_basis='manual', relation_type='related', source_checked_at=now(), reviewed_at=now(), reviewer_note='Broadcasting covers film/TV/digital production and editing; related to multimedia design but not a direct multimedia-designer credential.' where o.program_catalog_id in (select id from broadcasting) and o.canonical_career_id='multimedia-designer' returning o.program_catalog_id
), unresolved(program_code, note) as (
  values
    ('6420','Current in-person Graphic Design code is confirmed by Centennial admissions/tuition sources, but the individual programme URL currently redirects to the general full-time directory; keep Tier B until a stable programme-specific URL is available.'),
    ('1830','Hotel, Resort and Restaurant Management is reinstated/current for 2026-27, but its individual programme route currently resolves to the general full-time directory; keep Tier B until stable deep link verification.'),
    ('1831','Event Management is current in Centennial programme/tuition sources, but its campus individual programme route currently resolves to the general full-time directory; keep Tier B until stable deep link verification.')
), unresolved_catalog as (
  update public.program_catalog_ca_staging c set source_status='official_current_program_detail_url_unresolved_2026', source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08') from unresolved u where c.institution_name='Centennial College' and c.program_code=u.program_code returning c.id,c.program_code
), unresolved_links as (
  update public.program_occupation_ca_staging o set review_status='approved', match_basis='manual', relation_type=case when c.program_code='6420' then 'direct' when c.program_code='1831' then 'direct' else 'common_pathway' end, source_checked_at=now(), reviewed_at=now(), reviewer_note=u.note
  from public.program_catalog_ca_staging c join unresolved u on u.program_code=c.program_code where o.program_catalog_id=c.id and c.institution_name='Centennial College' returning o.program_catalog_id
), legacy_6480 as (
  update public.program_catalog_ca_staging c set source_status='pending_review_legacy_or_delivery_variant_not_current_admission_code_2026', source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08') where c.institution_name='Centennial College' and c.program_code='6480' returning c.id
)
update public.program_pgwp_ca_staging p set international_students_eligible=false, international_program_admission_status='current_centennial_graphic_design_admission_codes_are_6020_and_6420_not_6480', verified_at=now() where p.program_catalog_id in (select id from legacy_6480);
