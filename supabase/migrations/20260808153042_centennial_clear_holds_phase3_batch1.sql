-- Hold occupation-priority Centennial programmes that are clearly unavailable to new international applicants as of 2026-08-08.
-- Sources: current Centennial International restricted-program guidance and 2025/2026-27 program availability updates.
with held(program_code, source_status, admission_status) as (
  values
    ('3206','international_not_available_program_suspended_2026_27','program_suspended_no_new_intake_2026_27'),
    ('3221','international_not_available_fast_track_suspended_2026_27','fast_track_variant_suspended_no_new_intake_2026_27'),
    ('3222','international_not_available_fast_track_suspended_2026_27','fast_track_variant_suspended_no_new_intake_2026_27'),
    ('3620','international_not_available_program_suspended_2026_27','program_suspended_no_new_intake_2026_27'),
    ('3631','international_not_available_fast_track_suspended_2026_27','fast_track_variant_suspended_no_new_intake_2026_27'),
    ('3704','international_not_available_program_suspended_2026_27','program_suspended_no_new_intake_2026_27'),
    ('3747','international_not_available_fast_track_suspended_2026_27','fast_track_variant_suspended_no_new_intake_2026_27'),
    ('6423','international_not_available_program_suspended_not_reinstated_2026_27','program_suspended_not_reinstated_for_2026_27'),
    ('1808','international_not_available_program_suspended_not_reinstated_2026_27','program_suspended_not_reinstated_for_2026_27'),
    ('8226','international_restricted_coop_apprenticeship','international_restricted_apprenticeship_program'),
    ('8530','international_restricted_apprenticeship','international_restricted_apprenticeship_program')
), updated as (
  update public.program_catalog_ca_staging c
  set source_status=h.source_status,
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  from held h
  where c.institution_name='Centennial College' and c.program_code=h.program_code
  returning c.id,c.program_code
)
update public.program_pgwp_ca_staging p
set international_students_eligible=false,
    international_program_admission_status=h.admission_status,
    verified_at=now()
from updated u join held h on h.program_code=u.program_code
where p.program_catalog_id=u.id;
