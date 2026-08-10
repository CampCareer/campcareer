-- Hold occupation-priority George Brown programmes with no open international intake in the official 2026-27 availability table.
with held(program_code, admission_status) as (
  values
    ('T403','international_not_available_or_suspended_2026_27'),
    ('T408','international_not_available_2026_27'),
    ('T550','international_closed_or_not_available_2026_27'),
    ('T146','international_not_available_or_suspended_2026_27'),
    ('T160','international_closed_or_not_available_2026_27'),
    ('T191','international_not_available_2026_27'),
    ('C132','international_not_available_2026_27'),
    ('C148','international_suspended_2026_27'),
    ('C150','international_not_available_2026_27'),
    ('C305','international_closed_or_not_available_2026_27'),
    ('H132','international_not_available_or_suspended_2026_27'),
    ('H133','international_suspended_2026_27'),
    ('H141','international_suspended_or_not_available_2026_27'),
    ('H411','international_not_available_2026_27'),
    ('P114','international_closed_or_not_available_2026_27'),
    ('S318','international_not_available_2026_27'),
    ('S402','international_not_available_2026_27'),
    ('S404','international_not_available_2026_27'),
    ('S414','international_not_available_2026_27'),
    ('S425','international_not_available_2026_27')
), held_catalog as (
  update public.program_catalog_ca_staging c
  set source_status='international_not_available_or_suspended_2026_27',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  from held h
  where c.institution_name='George Brown Polytechnic' and c.program_code=h.program_code
  returning c.id,c.program_code
)
update public.program_pgwp_ca_staging p
set international_program_admission_status=h.admission_status,
    verified_at=now()
from held_catalog c join held h on h.program_code=c.program_code
where p.program_catalog_id=c.id;
