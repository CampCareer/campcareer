-- Canada Programs Phase 3: BCIT Trades programs currently marked international.
-- Non-international trade programs were rejected by the reconciliation migration.
-- Interior Design Diploma remains unresolved because the catalogue has distinct full-time and part-time pages.

with verified(title, credential_type, official_program_url) as (
  values
    ('Cabinetmaker (Joiner) Foundation', 'Certificate', 'https://www.bcit.ca/programs/cabinetmaker-joiner-foundation-certificate-full-time-2060cert/'),
    ('Carpentry Framing and Forming Foundation', 'Certificate', 'https://www.bcit.ca/programs/carpentry-framing-and-forming-foundation-certificate-full-time-1645cert/'),
    ('Interior Design Fundamentals', 'Certificate', 'https://www.bcit.ca/programs/interior-design-fundamentals-certificate-full-time-part-time-6195cert/'),
    ('Security Systems Technician', 'Certificate', 'https://www.bcit.ca/programs/security-systems-technician-certificate-full-time-2915cert/')
), updated as (
  update public.program_catalog_ca_staging c
  set official_program_url = v.official_program_url
  from verified v
  where c.institution_id = 'british-columbia-institute-of-technology'
    and c.title = v.title
    and c.credential_type = v.credential_type
    and c.official_program_url is null
  returning c.id
)
update public.program_occupation_ca_staging s
set source_checked_at = date '2026-08-08'
where s.program_catalog_id in (select id from updated);