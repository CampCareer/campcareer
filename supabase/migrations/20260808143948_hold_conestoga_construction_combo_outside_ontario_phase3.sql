-- Hold occupation-priority Conestoga construction-combination programmes whose current pages restrict applicants living outside Ontario.
-- Preserve programme identity but prevent Tier A publication while the current restriction applies.

with held(title, official_program_url, program_code) as (
  values
    ('Construction Techniques (Carpentry, Electrical, HVAC and Welding)', 'https://www.conestogac.on.ca/fulltime/construction-techniques-carpentry-electrical-hvac-and-welding', '07161'),
    ('Construction Techniques (Masonry, Plumbing, Electrical, and Carpentry)', 'https://www.conestogac.on.ca/fulltime/construction-techniques-masonry-plumbing-electrical-and-carpentry', '07164'),
    ('Construction Techniques (Welding, HVAC, Plumbing, and Masonry)', 'https://www.conestogac.on.ca/fulltime/construction-techniques-welding-hvac-plumbing-and-masonry', '07163')
), updated_catalog as (
  update public.program_catalog_ca_staging c
  set official_program_url=h.official_program_url,
      program_code=coalesce(c.program_code,h.program_code),
      source_status='pending_review_current_admission_restriction_2026',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  from held h
  where c.institution_name='Conestoga College' and c.title=h.title
  returning c.id
)
update public.program_pgwp_ca_staging p
set international_program_admission_status='restricted_not_open_outside_ontario_current_program_page',
    verified_at=now()
where p.program_catalog_id in (select id from updated_catalog);
