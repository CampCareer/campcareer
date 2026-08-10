-- UK Programs Phase 3 canonical admission-state normalization.
-- Preserve the evidence-rich free-text international_admission_status while
-- adding a stable publication-facing state for Phase 4/5 routing and UI.

alter table public.program_international_uk_staging
  add column if not exists canonical_admission_state text;

alter table public.program_international_uk_staging
  drop constraint if exists program_international_uk_staging_canonical_admission_state_check;

alter table public.program_international_uk_staging
  add constraint program_international_uk_staging_canonical_admission_state_check
  check (canonical_admission_state in (
    'open',
    'closed',
    'not_yet_open',
    'restricted',
    'eligible_schedule_unknown',
    'unknown'
  ));

update public.program_international_uk_staging
set canonical_admission_state = case
  when lower(international_admission_status) like '%next_cycle_2027%'
    then 'not_yet_open'
  when lower(international_admission_status) like '%closed%'
    or lower(international_admission_status) like '%course_full%'
    or lower(international_admission_status) like '%waiting_list%'
    or lower(international_admission_status) like '%reserve_list%'
    then 'closed'
  when lower(international_admission_status) like 'open_%'
    or lower(international_admission_status) like '%clearing_2026_available%'
    then 'open'
  else 'eligible_schedule_unknown'
end;

alter table public.program_international_uk_staging
  alter column canonical_admission_state set not null;

comment on column public.program_international_uk_staging.canonical_admission_state is
  'Phase 3 publication-facing admission state. The original international_admission_status remains the evidence-preserving source description.';

create index if not exists program_international_uk_staging_canonical_state_idx
  on public.program_international_uk_staging (canonical_admission_state, international_students_eligible);

do $$
declare
  open_count integer;
  closed_count integer;
  not_yet_open_count integer;
  unknown_schedule_count integer;
begin
  select
    count(*) filter (where canonical_admission_state='open'),
    count(*) filter (where canonical_admission_state='closed'),
    count(*) filter (where canonical_admission_state='not_yet_open'),
    count(*) filter (where canonical_admission_state='eligible_schedule_unknown')
  into open_count, closed_count, not_yet_open_count, unknown_schedule_count
  from public.program_international_uk_staging;

  if open_count <> 22 or closed_count <> 17 or not_yet_open_count <> 1 or unknown_schedule_count <> 52 then
    raise exception 'Unexpected UK Phase 3 admission-state result: open %, closed %, not_yet_open %, eligible_schedule_unknown %',
      open_count, closed_count, not_yet_open_count, unknown_schedule_count;
  end if;
end $$;
