-- Normalize existing Canada city geographies for stable user-facing routes.
-- Canada v1 intentionally preserves named-city study markets rather than
-- aggregating neighbouring municipalities into a metro claim without campus-level proof.

update core.geographies
set slug = regexp_replace(code, '-[a-z]{2}$', ''),
    scope_kind = coalesce(scope_kind, 'city'),
    status = 'active',
    metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
      'canada_city_normalization_v1', true,
      'study_destination_scope', 'named_city',
      'normalization_note', 'Do not infer GTA/CMA membership for programme delivery without explicit city or campus evidence.'
    ),
    updated_at = now()
where country_code = 'CA'
  and geography_type = 'city'
  and canonical_geography_id is null
  and code ~ '-[a-z]{2}$';

insert into core.geography_aliases (
  geography_id, country_code, alias, alias_normalized, region_code,
  alias_type, source_system, source_url
)
select
  g.id,
  'CA',
  g.name,
  lower(regexp_replace(trim(g.name), '\s+', ' ', 'g')),
  g.region_code,
  'canonical_name',
  'core.geographies',
  null
from core.geographies g
where g.country_code = 'CA'
  and g.geography_type = 'city'
  and g.canonical_geography_id is null
  and g.status = 'active'
on conflict do nothing;

insert into core.geography_aliases (
  geography_id, country_code, alias, alias_normalized, region_code,
  alias_type, source_system, source_url
)
select distinct
  g.id,
  'CA',
  c.name,
  lower(regexp_replace(trim(c.name), '\s+', ' ', 'g')),
  g.region_code,
  'source',
  'public.cities_ca',
  null
from public.cities_ca c
join core.geographies g
  on g.country_code = 'CA'
 and g.geography_type = 'city'
 and g.canonical_geography_id is null
 and lower(g.name) = lower(c.name)
 and coalesce(g.region_code, '') = coalesce(c.province, '')
where g.status = 'active'
on conflict do nothing;
