-- Correct Centennial 3221 after cross-checking the official availability updates and Fall 2026 new-student orientation list.
-- Electronics Engineering Technician was reinstated for Winter 2026 and 3221 appears in the Fall 2026 orientation cohort.
with updated as (
  update public.program_catalog_ca_staging c
  set source_status='official_program_reinstated_active_2026_detail_url_pending',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  where c.institution_name='Centennial College' and c.program_code='3221'
  returning c.id
)
update public.program_pgwp_ca_staging p
set international_students_eligible=true,
    international_program_admission_status='program_reinstated_active_in_2026_international_detail_verification_pending',
    verified_at=now()
where p.program_catalog_id in (select id from updated);
