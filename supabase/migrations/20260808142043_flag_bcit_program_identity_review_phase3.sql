-- Canada Programs Phase 3: keep ambiguous BCIT programme identities in Tier B.
-- Current BCIT catalogue exposes multiple delivery-specific detail pages while staging has one row.

with ambiguous(title, credential_type) as (
  values
    ('Accounting', 'Diploma'),
    ('Finance', 'Diploma'),
    ('Interior Design', 'Diploma')
), affected as (
  select c.id
  from public.program_catalog_ca_staging c
  join ambiguous a
    on a.title = c.title
   and a.credential_type = c.credential_type
  where c.institution_id = 'british-columbia-institute-of-technology'
    and c.official_program_url is null
)
update public.program_occupation_ca_staging s
set reviewer_note = 'Manual identity review required: current BCIT catalogue exposes multiple delivery-specific program pages for one staging row.',
    source_checked_at = date '2026-08-08'
where s.program_catalog_id in (select id from affected)
  and s.review_status = 'candidate';