-- Normalize the approved U.S. Tier A city geographies for stable public routes.
-- Preserve existing UUIDs and named-city scope. Do not infer metro, borough,
-- or neighbouring-municipality campus membership without explicit geography evidence.

with approved(code, public_slug) as (
  values
    ('new-york-ny', 'new-york'),
    ('boston-ma', 'boston'),
    ('los-angeles-ca', 'los-angeles'),
    ('chicago-il', 'chicago'),
    ('seattle-wa', 'seattle'),
    ('san-diego-ca', 'san-diego'),
    ('philadelphia-pa', 'philadelphia'),
    ('tempe-az', 'tempe')
)
update core.geographies g
set slug = a.public_slug,
    scope_kind = 'city',
    status = 'active',
    metadata = coalesce(g.metadata, '{}'::jsonb) || jsonb_build_object(
      'us_city_normalization_v1', true,
      'study_destination_scope', 'named_city',
      'publication_tier', 'A',
      'public_slug', a.public_slug,
      'scope_note', 'Do not infer metro, borough, or neighbouring municipality membership for campus/programme delivery without explicit geography evidence.'
    ),
    updated_at = now()
from approved a
where g.country_code = 'US'
  and g.geography_type = 'city'
  and g.canonical_geography_id is null
  and g.code = a.code;

insert into core.geography_aliases (
  geography_id, country_code, alias, alias_normalized, region_code,
  alias_type, source_system, source_url
)
select
  g.id,
  'US',
  g.name,
  lower(regexp_replace(trim(g.name), '\s+', ' ', 'g')),
  g.region_code,
  'canonical_name',
  'core.geographies',
  null
from core.geographies g
where g.country_code = 'US'
  and g.geography_type = 'city'
  and g.canonical_geography_id is null
  and g.code in (
    'new-york-ny','boston-ma','los-angeles-ca','chicago-il',
    'seattle-wa','san-diego-ca','philadelphia-pa','tempe-az'
  )
on conflict do nothing;

insert into core.geography_aliases (
  geography_id, country_code, alias, alias_normalized, region_code,
  alias_type, source_system, source_url
)
select
  g.id,
  'US',
  c.name,
  lower(regexp_replace(trim(c.name), '\s+', ' ', 'g')),
  g.region_code,
  'source',
  'public.cities_us',
  null
from public.cities_us c
join core.geographies g
  on g.country_code = 'US'
 and g.geography_type = 'city'
 and g.canonical_geography_id is null
 and g.code = c.city_slug
where c.city_slug in (
  'new-york-ny','boston-ma','los-angeles-ca','chicago-il',
  'seattle-wa','san-diego-ca','philadelphia-pa','tempe-az'
)
on conflict do nothing;

insert into core.geography_aliases (
  geography_id, country_code, alias, alias_normalized, region_code,
  alias_type, source_system, source_url
)
select
  g.id,
  'US',
  c.city_slug,
  lower(trim(c.city_slug)),
  g.region_code,
  'slug',
  'public.cities_us',
  null
from public.cities_us c
join core.geographies g
  on g.country_code = 'US'
 and g.geography_type = 'city'
 and g.canonical_geography_id is null
 and g.code = c.city_slug
where c.city_slug in (
  'new-york-ny','boston-ma','los-angeles-ca','chicago-il',
  'seattle-wa','san-diego-ca','philadelphia-pa','tempe-az'
)
on conflict do nothing;
