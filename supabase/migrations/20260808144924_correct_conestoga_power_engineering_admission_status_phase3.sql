-- Correct Power Engineering Technology using the current canonical page checked 2026-08-08.
-- International tuition exists, but both Canadian and international applications are not currently accepted.
with updated as (
  update public.program_catalog_ca_staging c
  set official_program_url='https://www.conestogac.on.ca/fulltime/power-engineering-technology',
      program_code=coalesce(c.program_code,'1535'),
      source_status='not_accepting_current_2026',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  where c.institution_name='Conestoga College' and c.title='Power Engineering Technology'
  returning c.id
)
update public.program_pgwp_ca_staging p
set international_program_admission_status='applications_not_currently_accepted_2026',
    verified_at=now()
where p.program_catalog_id in (select id from updated);
