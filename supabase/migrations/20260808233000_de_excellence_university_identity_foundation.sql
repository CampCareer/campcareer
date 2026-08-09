-- Germany Tier A institution identity foundation.
--
-- Source strategy:
-- - HRK Hochschulkompass verifies state/state-recognised German universities.
-- - DFG Excellence Strategy (March 2026) selects the ten excellence sites
--   continuing from 2027; Berlin University Alliance expands to FU/HU/TU,
--   giving 12 university entities for CampCareer Tier A.
-- - HRK bulk TXT is NOT imported because commercial reuse requires permission.
--
-- Germany has no single common UKPRN/UEN-like national identifier used here.
-- DE_HRK_VERIFIED_DOMAIN stores the manually verified official university
-- domain as a source-backed identity attribute; it is not presented as a
-- regulatory number.

with source_rows(domain_key, slug, canonical_name, website_url) as (
  values
    ('rwth-aachen.de', 'rwth-aachen-university', 'RWTH Aachen University', 'https://www.rwth-aachen.de/'),
    ('uni-bonn.de', 'university-of-bonn', 'University of Bonn', 'https://www.uni-bonn.de/'),
    ('fu-berlin.de', 'freie-universitaet-berlin', 'Freie Universität Berlin', 'https://www.fu-berlin.de/'),
    ('hu-berlin.de', 'humboldt-universitaet-zu-berlin', 'Humboldt-Universität zu Berlin', 'https://www.hu-berlin.de/'),
    ('tu.berlin', 'technische-universitaet-berlin', 'Technische Universität Berlin', 'https://www.tu.berlin/'),
    ('tu-dresden.de', 'technische-universitaet-dresden', 'Technische Universität Dresden', 'https://tu-dresden.de/'),
    ('uni-hamburg.de', 'universitaet-hamburg', 'Universität Hamburg', 'https://www.uni-hamburg.de/'),
    ('uni-heidelberg.de', 'heidelberg-university', 'Heidelberg University', 'https://www.uni-heidelberg.de/'),
    ('kit.edu', 'karlsruhe-institute-of-technology', 'Karlsruhe Institute of Technology', 'https://www.kit.edu/'),
    ('lmu.de', 'ludwig-maximilians-universitaet-munich', 'Ludwig-Maximilians-Universität München', 'https://www.lmu.de/'),
    ('tum.de', 'technical-university-of-munich', 'Technical University of Munich', 'https://www.tum.de/'),
    ('uni-tuebingen.de', 'university-of-tuebingen', 'University of Tübingen', 'https://uni-tuebingen.de/')
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
  md5('de:official-domain:' || domain_key)::uuid,
  'DE',
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

with source_rows(domain_key, slug, website_url) as (
  values
    ('rwth-aachen.de', 'rwth-aachen-university', 'https://www.rwth-aachen.de/'),
    ('uni-bonn.de', 'university-of-bonn', 'https://www.uni-bonn.de/'),
    ('fu-berlin.de', 'freie-universitaet-berlin', 'https://www.fu-berlin.de/'),
    ('hu-berlin.de', 'humboldt-universitaet-zu-berlin', 'https://www.hu-berlin.de/'),
    ('tu.berlin', 'technische-universitaet-berlin', 'https://www.tu.berlin/'),
    ('tu-dresden.de', 'technische-universitaet-dresden', 'https://tu-dresden.de/'),
    ('uni-hamburg.de', 'universitaet-hamburg', 'https://www.uni-hamburg.de/'),
    ('uni-heidelberg.de', 'heidelberg-university', 'https://www.uni-heidelberg.de/'),
    ('kit.edu', 'karlsruhe-institute-of-technology', 'https://www.kit.edu/'),
    ('lmu.de', 'ludwig-maximilians-universitaet-munich', 'https://www.lmu.de/'),
    ('tum.de', 'technical-university-of-munich', 'https://www.tum.de/'),
    ('uni-tuebingen.de', 'university-of-tuebingen', 'https://uni-tuebingen.de/')
)
insert into catalog.institution_identifiers(
  institution_id,
  identifier_system,
  identifier_value,
  source_url
)
select
  i.id,
  'DE_HRK_VERIFIED_DOMAIN',
  s.domain_key,
  s.website_url
from source_rows s
join catalog.institutions i
  on i.country_code = 'DE'
 and i.slug = s.slug
on conflict (identifier_system, identifier_value)
do update set
  institution_id = excluded.institution_id,
  source_url = excluded.source_url;

create or replace view public.institution_identity_de_v1
with (security_invoker = true) as
select
  i.id as institution_id,
  i.country_code,
  i.slug,
  i.canonical_name,
  official.identifier_value as official_domain,
  official.source_url as official_domain_source_url
from catalog.institutions i
join catalog.institution_identifiers official
  on official.institution_id = i.id
 and official.identifier_system = 'DE_HRK_VERIFIED_DOMAIN'
where i.country_code = 'DE'
  and i.status <> 'inactive'
  and i.slug is not null;

comment on view public.institution_identity_de_v1 is
  'Service-role Germany Tier A identity view. official_domain is a manually HRK-verified official university domain, not a German regulatory identifier.';

revoke all on public.institution_identity_de_v1 from public, anon, authenticated;
grant select on public.institution_identity_de_v1 to service_role;

do $$
declare
  institution_count integer;
  identity_count integer;
  bad_domain_count integer;
  bad_website_count integer;
  bad_kind_count integer;
  ownership_inferred_count integer;
begin
  select count(*) into institution_count
  from catalog.institutions
  where country_code = 'DE'
    and status <> 'inactive';

  if institution_count <> 12 then
    raise exception 'Expected 12 DE Tier A university entities, found %', institution_count;
  end if;

  select count(*) into identity_count from public.institution_identity_de_v1;
  if identity_count <> 12 then
    raise exception 'Expected 12 DE official-domain identities, found %', identity_count;
  end if;

  select count(*) into bad_domain_count
  from public.institution_identity_de_v1
  where official_domain !~ '^[a-z0-9.-]+[.][a-z]{2,}$'
     or official_domain_source_url !~ '^https://';

  if bad_domain_count > 0 then
    raise exception 'Found % invalid DE official-domain identities', bad_domain_count;
  end if;

  select count(*) into bad_website_count
  from catalog.institutions
  where country_code = 'DE'
    and status <> 'inactive'
    and (website_url is null or website_url !~ '^https://');

  if bad_website_count > 0 then
    raise exception 'Found % DE Tier A institutions without HTTPS official websites', bad_website_count;
  end if;

  select count(*) into bad_kind_count
  from catalog.institutions
  where country_code = 'DE'
    and status <> 'inactive'
    and institution_kind is distinct from 'university';

  if bad_kind_count > 0 then
    raise exception 'Found % DE Tier A institutions without university classification', bad_kind_count;
  end if;

  select count(*) into ownership_inferred_count
  from catalog.institutions
  where country_code = 'DE'
    and status <> 'inactive'
    and ownership_type is not null;

  if ownership_inferred_count > 0 then
    raise exception 'DE ownership must remain uninferred until separately verified; found % rows', ownership_inferred_count;
  end if;
end $$;
