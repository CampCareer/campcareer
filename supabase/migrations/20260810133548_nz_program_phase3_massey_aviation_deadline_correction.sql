-- NZ Programs Phase 3 source correction.
-- Massey's current admission due-date table gives the 2027 Semester One
-- Bachelor of Aviation international application due date as 30 October 2026.
-- This more intake-specific current source supersedes the generic major-page
-- wording that states 1 October for international Semester One applications.

UPDATE public.program_international_nz_staging x
SET application_deadline = DATE '2026-10-30',
    intake_label = 'Semester One 2027 selected-entry intake',
    admission_source_url = 'https://www.massey.ac.nz/study/admission-and-enrolment/key-admission-and-course-enrolment-dates/admission-application-due-dates/',
    source_checked_at = DATE '2026-08-10',
    verified_at = now(),
    reviewer_note = concat_ws(' ', nullif(btrim(reviewer_note), ''), 'Phase 3 source correction: 2027 intake-specific Massey admission due-date table supersedes generic major-page deadline wording.')
FROM public.program_catalog_nz_staging p
WHERE x.program_catalog_id = p.id
  AND p.source_program_key = 'massey-bav-air-transport-pilot';

DO $$
DECLARE
  deadline date;
  open_count integer;
  schedule_unknown_count integer;
BEGIN
  SELECT x.application_deadline INTO deadline
  FROM public.program_catalog_nz_staging p
  JOIN public.program_international_nz_staging x ON x.program_catalog_id=p.id
  WHERE p.source_program_key='massey-bav-air-transport-pilot';

  IF deadline <> DATE '2026-10-30' THEN
    RAISE EXCEPTION 'NZ Phase 3 aviation deadline correction failed: %', deadline;
  END IF;

  SELECT count(*) FILTER (WHERE international_admission_status='open'),
         count(*) FILTER (WHERE international_admission_status='eligible_schedule_unknown')
    INTO open_count, schedule_unknown_count
  FROM public.program_international_nz_staging;

  IF open_count <> 6 OR schedule_unknown_count <> 18 THEN
    RAISE EXCEPTION 'NZ Phase 3 admission distribution changed unexpectedly: open %, unknown %', open_count, schedule_unknown_count;
  END IF;
END $$;
