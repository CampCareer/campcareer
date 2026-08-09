-- New Zealand Tier A university location quality layer.
--
-- NZQA provider profiles publish the head-office city and provider number.
-- These rows intentionally represent registry-backed institution locations,
-- not a complete campus inventory and not programme-to-campus assignments.
-- No precise coordinates are asserted at this stage.

with city_rows(name, slug) as (
  values
    ('Auckland', 'auckland'),
    ('Hamilton', 'hamilton'),
    ('Palmerston North', 'palmerston-north'),
    ('Wellington', 'wellington'),
    ('Christchurch', 'christchurch'),
    ('Lincoln', 'lincoln'),
    ('Dunedin', 'dunedin')
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
  md5('nz:city:' || slug)::uuid,
  'NZ',
  'city',
  name,
  slug,
  jsonb_build_object(
    'source_tier', 'government_registry',
    'registry_system', 'NZQA',
    'normalization_batch', 'nz_university_locations_v1'
  ),
  'active'
from city_rows
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  metadata = coalesce(core.geographies.metadata, '{}'::jsonb) || excluded.metadata,
  status = excluded.status,
  updated_at = now();

with location_rows(provider_number, city_name, city_slug) as (
  values
    ('7001', 'Auckland', 'auckland'),
    ('7008', 'Auckland', 'auckland'),
    ('7002', 'Hamilton', 'hamilton'),
    ('7003', 'Palmerston North', 'palmerston-north'),
    ('7004', 'Wellington', 'wellington'),
    ('7005', 'Christchurch', 'christchurch'),
    ('7006', 'Lincoln', 'lincoln'),
    ('7007', 'Dunedin', 'dunedin')
), resolved as (
  select
    identity.institution_id,
    identity.provider_number,
    identity.provider_source_url,
    i.website_url,
    l.city_name,
    l.city_slug,
    g.id as geography_id
  from location_rows l
  join public.institution_identity_nz_v1 identity
    on identity.provider_number = l.provider_number
  join catalog.institutions i
    on i.id = identity.institution_id
  join core.geographies g
    on g.country_code = 'NZ'
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
  md5('nz:registered-location:' || r.provider_number)::uuid,
  r.institution_id,
  'Registered institution location',
  r.city_name,
  r.city_name,
  'NZ',
  r.geography_id,
  r.geography_id,
  r.website_url,
  r.provider_source_url,
  now(),
  jsonb_build_object(
    'record_scope', 'registered_institution_location',
    'location_quality', 'verified_registry_city',
    'display_policy', 'preferred',
    'source_tier', 'government_registry',
    'registry_system', 'NZQA',
    'provider_number', r.provider_number,
    'location_key', 'nzqa-head-office-city',
    'coordinate_precision', 'not_asserted',
    'programme_assignment_verified', false,
    'normalization_batch', 'nz_university_locations_v1'
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

create or replace view public.institution_location_nz_v1
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
  c.metadata ->> 'provider_number' as provider_number
from catalog.campuses c
join catalog.institutions i
  on i.id = c.institution_id
 and i.country_code = 'NZ'
left join core.geographies g
  on g.id = coalesce(c.locality_geography_id, c.geography_id)
 and g.status = 'active'
where c.status <> 'inactive'
  and c.metadata ->> 'location_quality' = 'verified_registry_city';

comment on view public.institution_location_nz_v1 is
  'Service-role New Zealand Tier A institution location view using NZQA registry-backed head-office cities without inventing precise campus coordinates.';

revoke all on public.institution_location_nz_v1 from public, anon, authenticated;
grant select on public.institution_location_nz_v1 to service_role;

do $$
declare
  city_count integer;
  location_count integer;
  institution_count integer;
  bad_source_count integer;
  coordinate_count integer;
  duplicate_count integer;
begin
  select count(*) into city_count
  from core.geographies
  where country_code = 'NZ'
    and geography_type = 'city'
    and status = 'active'
    and metadata ->> 'normalization_batch' = 'nz_university_locations_v1';

  if city_count <> 7 then
    raise exception 'Expected 7 NZ Tier A registry cities, found %', city_count;
  end if;

  select count(*), count(distinct institution_id)
  into location_count, institution_count
  from public.institution_location_nz_v1;

  if location_count <> 8 or institution_count <> 8 then
    raise exception 'Expected 8 NZ registry locations across 8 universities, found % across %', location_count, institution_count;
  end if;

  select count(*) into bad_source_count
  from public.institution_location_nz_v1
  where source_url is null
     or source_url !~ '^https://www[.]nzqa[.]govt[.]nz/providers/details[.]do[?]providerId='
     or location_quality is distinct from 'verified_registry_city';

  if bad_source_count > 0 then
    raise exception 'Found % NZ locations without valid NZQA provenance', bad_source_count;
  end if;

  select count(*) into coordinate_count
  from catalog.campuses c
  join catalog.institutions i on i.id = c.institution_id
  where i.country_code = 'NZ'
    and c.status <> 'inactive'
    and c.metadata ->> 'location_quality' = 'verified_registry_city'
    and (c.latitude is not null or c.longitude is not null);

  if coordinate_count > 0 then
    raise exception 'NZ registry locations must not assert unverified precise coordinates; found %', coordinate_count;
  end if;

  select count(*) into duplicate_count
  from (
    select institution_id, metadata ->> 'location_key'
    from catalog.campuses c
    join catalog.institutions i on i.id = c.institution_id
    where i.country_code = 'NZ'
      and c.status <> 'inactive'
      and c.metadata ->> 'location_quality' = 'verified_registry_city'
    group by institution_id, metadata ->> 'location_key'
    having count(*) > 1
  ) d;

  if duplicate_count > 0 then
    raise exception 'Found % duplicate NZ registry location keys', duplicate_count;
  end if;
end $$;
