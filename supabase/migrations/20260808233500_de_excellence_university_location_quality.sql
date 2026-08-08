-- Germany Tier A location quality layer.
--
-- DFG's March 2026 continued Excellence-site decision is used to verify the
-- institution city for the 12 university entities in CampCareer Tier A.
-- These are city-level institution locations, not a complete campus inventory.
-- No street address or coordinates are inferred.

with city_rows(name, slug) as (
  values
    ('Aachen', 'aachen'),
    ('Bonn', 'bonn'),
    ('Berlin', 'berlin'),
    ('Dresden', 'dresden'),
    ('Hamburg', 'hamburg'),
    ('Heidelberg', 'heidelberg'),
    ('Karlsruhe', 'karlsruhe'),
    ('Munich', 'munich'),
    ('Tübingen', 'tuebingen')
)
insert into core.geographies(
  id,
  country_code,
  geography_type,
  name,
  slug,
  metadata,
  status
)
select
  md5('de:city:' || slug)::uuid,
  'DE',
  'city',
  name,
  slug,
  jsonb_build_object(
    'source_tier', 'official_federal_research_strategy',
    'source_system', 'DFG_EXCELLENCE_STRATEGY',
    'normalization_batch', 'de_excellence_locations_v1'
  ),
  'active'
from city_rows
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  metadata = coalesce(core.geographies.metadata, '{}'::jsonb) || excluded.metadata,
  status = excluded.status,
  updated_at = now();

with location_rows(domain_key, city_name, city_slug) as (
  values
    ('rwth-aachen.de', 'Aachen', 'aachen'),
    ('uni-bonn.de', 'Bonn', 'bonn'),
    ('fu-berlin.de', 'Berlin', 'berlin'),
    ('hu-berlin.de', 'Berlin', 'berlin'),
    ('tu.berlin', 'Berlin', 'berlin'),
    ('tu-dresden.de', 'Dresden', 'dresden'),
    ('uni-hamburg.de', 'Hamburg', 'hamburg'),
    ('uni-heidelberg.de', 'Heidelberg', 'heidelberg'),
    ('kit.edu', 'Karlsruhe', 'karlsruhe'),
    ('lmu.de', 'Munich', 'munich'),
    ('tum.de', 'Munich', 'munich'),
    ('uni-tuebingen.de', 'Tübingen', 'tuebingen')
), resolved as (
  select
    identity.institution_id,
    identity.official_domain,
    identity.official_domain_source_url,
    l.city_name,
    l.city_slug,
    g.id as geography_id
  from location_rows l
  join public.institution_identity_de_v1 identity
    on identity.official_domain = l.domain_key
  join core.geographies g
    on g.country_code = 'DE'
   and g.geography_type = 'city'
   and g.slug = l.city_slug
   and g.status = 'active'
)
insert into catalog.campuses(
  id,
  institution_id,
  name,
  city,
  locality,
  country_code,
  geography_id,
  locality_geography_id,
  official_url,
  source_url,
  source_checked_at,
  metadata,
  status
)
select
  md5('de:excellence-city:' || r.official_domain)::uuid,
  r.institution_id,
  'Verified institution city',
  r.city_name,
  r.city_name,
  'DE',
  r.geography_id,
  r.geography_id,
  r.official_domain_source_url,
  'https://www.dfg.de/en/service/press/press-releases/2026/press-release-no-04',
  now(),
  jsonb_build_object(
    'record_scope', 'tier_a_institution_city',
    'location_quality', 'verified_official_city',
    'display_policy', 'preferred',
    'source_tier', 'official_federal_research_strategy',
    'source_system', 'DFG_EXCELLENCE_STRATEGY',
    'official_domain', r.official_domain,
    'location_key', 'dfg-excellence-site-city',
    'coordinate_precision', 'not_asserted',
    'campus_inventory_complete', false,
    'programme_assignment_verified', false,
    'normalization_batch', 'de_excellence_locations_v1'
  ),
  'active'
from resolved r
on conflict (id) do update set
  name = excluded.name,
  city = excluded.city,
  locality = excluded.locality,
  geography_id = excluded.geography_id,
  locality_geography_id = excluded.locality_geography_id,
  official_url = excluded.official_url,
  source_url = excluded.source_url,
  source_checked_at = excluded.source_checked_at,
  metadata = excluded.metadata,
  status = excluded.status,
  updated_at = now();

create or replace view public.institution_location_de_v1
with (security_invoker = true) as
select
  c.institution_id,
  c.id as campus_id,
  c.name,
  g.name as city_name,
  g.slug as city_slug,
  coalesce(nullif(c.city, ''), nullif(c.locality, '')) as reported_city,
  c.region,
  c.address_line,
  c.postal_code,
  c.official_url,
  c.source_url,
  c.source_checked_at,
  c.metadata ->> 'location_quality' as location_quality,
  c.metadata ->> 'record_scope' as record_scope,
  c.metadata ->> 'official_domain' as official_domain
from catalog.campuses c
join catalog.institutions i
  on i.id = c.institution_id
 and i.country_code = 'DE'
left join core.geographies g
  on g.id = coalesce(c.locality_geography_id, c.geography_id)
 and g.status = 'active'
where c.status <> 'inactive'
  and c.metadata ->> 'location_quality' = 'verified_official_city';

comment on view public.institution_location_de_v1 is
  'Service-role Germany Tier A city-level locations verified through the DFG Excellence Strategy; not a complete campus inventory.';

revoke all on public.institution_location_de_v1 from public, anon, authenticated;
grant select on public.institution_location_de_v1 to service_role;

do $$
declare
  city_count integer;
  location_count integer;
  institution_count integer;
  precise_claim_count integer;
  bad_source_count integer;
begin
  select count(*) into city_count
  from core.geographies
  where country_code = 'DE'
    and geography_type = 'city'
    and status = 'active'
    and metadata ->> 'normalization_batch' = 'de_excellence_locations_v1';

  if city_count <> 9 then
    raise exception 'Expected 9 DE Tier A cities, found %', city_count;
  end if;

  select count(*), count(distinct institution_id)
  into location_count, institution_count
  from public.institution_location_de_v1;

  if location_count <> 12 or institution_count <> 12 then
    raise exception 'Expected 12 DE city locations across 12 institutions, found % across %', location_count, institution_count;
  end if;

  select count(*) into precise_claim_count
  from catalog.campuses c
  join catalog.institutions i on i.id = c.institution_id
  where i.country_code = 'DE'
    and c.status <> 'inactive'
    and c.metadata ->> 'location_quality' = 'verified_official_city'
    and (
      c.latitude is not null
      or c.longitude is not null
      or c.address_line is not null
      or c.postal_code is not null
    );

  if precise_claim_count > 0 then
    raise exception 'DE Tier A city records must not assert unverified campus precision; found %', precise_claim_count;
  end if;

  select count(*) into bad_source_count
  from public.institution_location_de_v1
  where source_url is null
     or source_url !~ '^https://www[.]dfg[.]de/'
     or location_quality is distinct from 'verified_official_city';

  if bad_source_count > 0 then
    raise exception 'Found % DE locations without DFG provenance', bad_source_count;
  end if;
end $$;
