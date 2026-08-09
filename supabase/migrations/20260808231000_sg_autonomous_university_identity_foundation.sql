-- Singapore Tier A autonomous-university identity foundation.
--
-- MOE recognises six Autonomous Universities: NUS, NTU, SMU, SUTD, SIT and
-- SUSS. The official legal/entity identifier used here is Singapore's Unique
-- Entity Number (UEN) / company registration number. Ownership is deliberately
-- left null: MOE's publicly-funded status is not the same thing as CampCareer's
-- legal ownership classification.

with source_rows(uen, slug, canonical_name, website_url, source_url) as (
  values
    ('200604346E', 'national-university-of-singapore', 'National University of Singapore', 'https://www.nus.edu.sg/', 'https://www.science.nus.edu.sg/contact-us/'),
    ('200604393R', 'nanyang-technological-university', 'Nanyang Technological University', 'https://www.ntu.edu.sg/', 'https://www.ntu.edu.sg/business/admissions/NEE/contact-us'),
    ('200000267Z', 'singapore-management-university', 'Singapore Management University', 'https://www.smu.edu.sg/', 'https://ink.library.smu.edu.sg/oh_pressrelease/129/'),
    ('200913519C', 'singapore-university-of-technology-and-design', 'Singapore University of Technology and Design', 'https://www.sutd.edu.sg/', 'https://www.sutd.edu.sg/wp-content/uploads/2024/12/SUTD-Donation-Form_2021.pdf'),
    ('200917667D', 'singapore-institute-of-technology', 'Singapore Institute of Technology', 'https://www.singaporetech.edu.sg/', 'https://www.singaporetech.edu.sg/procurement-opportunities/to2026006'),
    ('200504979Z', 'singapore-university-of-social-sciences', 'Singapore University of Social Sciences', 'https://www.suss.edu.sg/', 'https://www.myskillsfuture.gov.sg/content/portal/en/public/training-provider.html?UEN=200504979Z&pageNo=-86')
)
insert into catalog.institutions(
  id,
  country_code,
  canonical_name,
  institution_type,
  website_url,
  status,
  slug,
  institution_kind,
  ownership_type
)
select
  md5('sg:uen:' || uen)::uuid,
  'SG',
  canonical_name,
  'university',
  website_url,
  'active',
  slug,
  'university',
  null
from source_rows
on conflict (country_code, slug) where slug is not null
do update set
  canonical_name = excluded.canonical_name,
  institution_type = excluded.institution_type,
  website_url = excluded.website_url,
  status = excluded.status,
  institution_kind = excluded.institution_kind,
  ownership_type = null,
  updated_at = now();

with source_rows(uen, slug, source_url) as (
  values
    ('200604346E', 'national-university-of-singapore', 'https://www.science.nus.edu.sg/contact-us/'),
    ('200604393R', 'nanyang-technological-university', 'https://www.ntu.edu.sg/business/admissions/NEE/contact-us'),
    ('200000267Z', 'singapore-management-university', 'https://ink.library.smu.edu.sg/oh_pressrelease/129/'),
    ('200913519C', 'singapore-university-of-technology-and-design', 'https://www.sutd.edu.sg/wp-content/uploads/2024/12/SUTD-Donation-Form_2021.pdf'),
    ('200917667D', 'singapore-institute-of-technology', 'https://www.singaporetech.edu.sg/procurement-opportunities/to2026006'),
    ('200504979Z', 'singapore-university-of-social-sciences', 'https://www.myskillsfuture.gov.sg/content/portal/en/public/training-provider.html?UEN=200504979Z&pageNo=-86')
)
insert into catalog.institution_identifiers(
  institution_id,
  identifier_system,
  identifier_value,
  source_url
)
select
  i.id,
  'SG_UEN',
  s.uen,
  s.source_url
from source_rows s
join catalog.institutions i
  on i.country_code = 'SG'
 and i.slug = s.slug
on conflict (identifier_system, identifier_value)
do update set
  institution_id = excluded.institution_id,
  source_url = excluded.source_url;

create or replace view public.institution_identity_sg_v1
with (security_invoker = true) as
select
  i.id as institution_id,
  i.country_code,
  i.slug,
  i.canonical_name,
  official.identifier_value as uen,
  official.source_url as uen_source_url
from catalog.institutions i
join catalog.institution_identifiers official
  on official.institution_id = i.id
 and official.identifier_system = 'SG_UEN'
where i.country_code = 'SG'
  and i.status <> 'inactive'
  and i.slug is not null;

comment on view public.institution_identity_sg_v1 is
  'Service-role Singapore Autonomous University identity view. SG_UEN is the source-backed Singapore Unique Entity Number / registration number.';

revoke all on public.institution_identity_sg_v1 from public, anon, authenticated;
grant select on public.institution_identity_sg_v1 to service_role;

do $$
declare
  institution_count integer;
  identity_count integer;
  invalid_uen_count integer;
  bad_website_count integer;
  bad_kind_count integer;
  inferred_ownership_count integer;
begin
  select count(*) into institution_count
  from catalog.institutions
  where country_code = 'SG'
    and status <> 'inactive';

  if institution_count <> 6 then
    raise exception 'Expected 6 SG Autonomous Universities, found %', institution_count;
  end if;

  select count(*) into identity_count from public.institution_identity_sg_v1;
  if identity_count <> 6 then
    raise exception 'Expected 6 SG UEN identities, found %', identity_count;
  end if;

  select count(*) into invalid_uen_count
  from public.institution_identity_sg_v1
  where uen !~ '^[0-9]{9}[A-Z]$'
     or uen_source_url !~ '^https://';

  if invalid_uen_count > 0 then
    raise exception 'Found % invalid SG UEN identities', invalid_uen_count;
  end if;

  select count(*) into bad_website_count
  from catalog.institutions
  where country_code = 'SG'
    and status <> 'inactive'
    and (website_url is null or website_url !~ '^https://');

  if bad_website_count > 0 then
    raise exception 'Found % SG universities without HTTPS official websites', bad_website_count;
  end if;

  select count(*) into bad_kind_count
  from catalog.institutions
  where country_code = 'SG'
    and status <> 'inactive'
    and institution_kind is distinct from 'university';

  if bad_kind_count > 0 then
    raise exception 'Found % SG institutions without university classification', bad_kind_count;
  end if;

  select count(*) into inferred_ownership_count
  from catalog.institutions
  where country_code = 'SG'
    and status <> 'inactive'
    and ownership_type is not null;

  if inferred_ownership_count > 0 then
    raise exception 'SG ownership must remain uninferred; found % populated rows', inferred_ownership_count;
  end if;
end $$;
