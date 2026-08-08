-- Singapore Autonomous University location quality layer.
--
-- One current, institution-official primary/contact location is published for
-- each of the six Tier A Autonomous Universities. Address precision is taken
-- directly from current university contact/campus pages. No coordinates are
-- inferred.

insert into core.geographies(
  id,
  country_code,
  geography_type,
  name,
  slug,
  metadata,
  status
)
values (
  md5('sg:city:singapore')::uuid,
  'SG',
  'city',
  'Singapore',
  'singapore',
  jsonb_build_object(
    'source_tier', 'official_institution',
    'normalization_batch', 'sg_au_locations_v1'
  ),
  'active'
)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  metadata = coalesce(core.geographies.metadata, '{}'::jsonb) || excluded.metadata,
  status = excluded.status,
  updated_at = now();

with location_rows(
  uen,
  location_name,
  address_line,
  postal_code,
  source_url
) as (
  values
    ('200604346E', 'Kent Ridge / University Hall', '21 Lower Kent Ridge Road', '119077', 'https://www.nus.edu.sg/contact'),
    ('200604393R', 'Main Campus', '50 Nanyang Avenue', '639798', 'https://www.ntu.edu.sg/ncpa/about-us/contact-us'),
    ('200000267Z', 'Administration Building', '81 Victoria Street', '188065', 'https://www.smu.edu.sg/about/contact'),
    ('200913519C', 'SUTD Campus', '8 Somapah Road', '487372', 'https://www.sutd.edu.sg/contact-us/contact-sutd/'),
    ('200917667D', 'Punggol Campus', '1 Punggol Coast Road', '828608', 'https://www.singaporetech.edu.sg/campus-locations'),
    ('200504979Z', 'Clementi Campus', '463 Clementi Road', '599494', 'https://www.suss.edu.sg/contact-us')
), resolved as (
  select
    identity.institution_id,
    identity.uen,
    l.location_name,
    l.address_line,
    l.postal_code,
    l.source_url,
    g.id as geography_id
  from location_rows l
  join public.institution_identity_sg_v1 identity
    on identity.uen = l.uen
  join core.geographies g
    on g.country_code = 'SG'
   and g.geography_type = 'city'
   and g.slug = 'singapore'
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
  address_line,
  postal_code,
  official_url,
  source_url,
  source_checked_at,
  metadata,
  status
)
select
  md5('sg:au-location:' || r.uen)::uuid,
  r.institution_id,
  r.location_name,
  'Singapore',
  'Singapore',
  'SG',
  r.geography_id,
  r.geography_id,
  r.address_line,
  r.postal_code,
  r.source_url,
  r.source_url,
  now(),
  jsonb_build_object(
    'record_scope', 'official_primary_location',
    'location_quality', 'verified_official',
    'display_policy', 'preferred',
    'source_tier', 'official_institution',
    'uen', r.uen,
    'location_key', 'official-primary-address',
    'coordinate_precision', 'not_asserted',
    'programme_assignment_verified', false,
    'normalization_batch', 'sg_au_locations_v1'
  ),
  'active'
from resolved r
on conflict (id) do update set
  name = excluded.name,
  city = excluded.city,
  locality = excluded.locality,
  geography_id = excluded.geography_id,
  locality_geography_id = excluded.locality_geography_id,
  address_line = excluded.address_line,
  postal_code = excluded.postal_code,
  official_url = excluded.official_url,
  source_url = excluded.source_url,
  source_checked_at = excluded.source_checked_at,
  metadata = excluded.metadata,
  status = excluded.status,
  updated_at = now();

create or replace view public.institution_location_sg_v1
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
  c.metadata ->> 'uen' as uen
from catalog.campuses c
join catalog.institutions i
  on i.id = c.institution_id
 and i.country_code = 'SG'
left join core.geographies g
  on g.id = coalesce(c.locality_geography_id, c.geography_id)
 and g.status = 'active'
where c.status <> 'inactive'
  and c.metadata ->> 'location_quality' = 'verified_official';

comment on view public.institution_location_sg_v1 is
  'Service-role Singapore Autonomous University locations sourced from current official university contact/campus pages; no coordinates inferred.';

revoke all on public.institution_location_sg_v1 from public, anon, authenticated;
grant select on public.institution_location_sg_v1 to service_role;

do $$
declare
  location_count integer;
  institution_count integer;
  missing_address_count integer;
  bad_source_count integer;
  coordinate_count integer;
begin
  select count(*), count(distinct institution_id)
  into location_count, institution_count
  from public.institution_location_sg_v1;

  if location_count <> 6 or institution_count <> 6 then
    raise exception 'Expected 6 SG official locations across 6 universities, found % across %', location_count, institution_count;
  end if;

  select count(*) into missing_address_count
  from public.institution_location_sg_v1
  where address_line is null
     or postal_code !~ '^[0-9]{6}$';

  if missing_address_count > 0 then
    raise exception 'Found % SG locations without source-backed address/postal data', missing_address_count;
  end if;

  select count(*) into bad_source_count
  from public.institution_location_sg_v1
  where source_url is null
     or source_url !~ '^https://'
     or location_quality is distinct from 'verified_official';

  if bad_source_count > 0 then
    raise exception 'Found % SG locations without official HTTPS provenance', bad_source_count;
  end if;

  select count(*) into coordinate_count
  from catalog.campuses c
  join catalog.institutions i on i.id = c.institution_id
  where i.country_code = 'SG'
    and c.status <> 'inactive'
    and c.metadata ->> 'location_quality' = 'verified_official'
    and (c.latitude is not null or c.longitude is not null);

  if coordinate_count > 0 then
    raise exception 'SG official locations must not assert unverified coordinates; found %', coordinate_count;
  end if;
end $$;
