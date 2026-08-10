-- Normalize the approved New Zealand Tier A city geographies for stable city routes.
-- Preserve existing geography UUIDs. Phase 2 defines geography identity and scope only;
-- campus membership and programme delivery remain Phase 3 responsibilities.

with approved(city_name, public_slug, region_name, boundary_label, scope_note) as (
  values
    ('Auckland', 'auckland', 'Auckland', 'Auckland urban area (Stats NZ urban/rural geography)', 'Use the Stats NZ Auckland urban area as the public study-destination boundary, not the full Auckland Region. Whangārei / Tai Tokerau is a separate destination and must not be inferred into Auckland.'),
    ('Christchurch', 'christchurch', 'Canterbury', 'Christchurch urban area (Stats NZ urban/rural geography)', 'Use the Stats NZ Christchurch urban area. Lincoln remains a separate place and is not included merely because it is in Canterbury or near Christchurch.'),
    ('Hamilton', 'hamilton', 'Waikato', 'Hamilton urban area (Stats NZ urban/rural geography)', 'Use the Stats NZ Hamilton urban area. Tauranga is a separate study destination and must not be inferred into Hamilton from University of Waikato provider identity.'),
    ('Wellington', 'wellington', 'Wellington', 'Wellington urban area (Stats NZ urban/rural geography)', 'Use the Stats NZ Wellington urban area, not the full Wellington Region. Campus membership still requires an explicit official location within the approved urban boundary.'),
    ('Dunedin', 'dunedin', 'Otago', 'Dunedin urban area (Stats NZ urban/rural geography)', 'Use the Stats NZ Dunedin urban area. Do not infer Queenstown, Southland, or other Otago teaching/research locations into Dunedin.')
)
update core.geographies g
set slug = a.public_slug,
    geography_type = 'city',
    scope_kind = 'city',
    region_code = a.region_name,
    status = 'active',
    metadata = coalesce(g.metadata, '{}'::jsonb) || jsonb_build_object(
      'nz_city_normalization_v1', true,
      'publication_tier', 'A',
      'public_slug', a.public_slug,
      'region', a.region_name,
      'study_destination_scope', 'stats_nz_urban_area',
      'scope_boundary_label', a.boundary_label,
      'scope_note', a.scope_note,
      'scope_standard', 'SSGA23 urban/rural geography',
      'scope_source_url', 'https://www.stats.govt.nz/methods/geographic-hierarchy/',
      'population_geography_contract', 'stats_nz_urban_area',
      'campus_membership_contract', 'phase_3_explicit_location_evidence_required'
    ),
    updated_at = now()
from approved a
where g.country_code = 'NZ'
  and g.geography_type = 'city'
  and g.canonical_geography_id is null
  and g.name = a.city_name
  and g.slug = a.public_slug;

insert into core.geography_aliases (
  geography_id, country_code, alias, alias_normalized, region_code,
  alias_type, source_system, source_url
)
select
  g.id,
  'NZ',
  g.name,
  lower(regexp_replace(trim(g.name), '\s+', ' ', 'g')),
  g.region_code,
  'canonical_name',
  'core.geographies',
  'https://www.stats.govt.nz/methods/geographic-hierarchy/'
from core.geographies g
where g.country_code = 'NZ'
  and g.geography_type = 'city'
  and g.canonical_geography_id is null
  and g.slug in ('auckland','christchurch','hamilton','wellington','dunedin')
on conflict do nothing;

insert into core.geography_aliases (
  geography_id, country_code, alias, alias_normalized, region_code,
  alias_type, source_system, source_url
)
select
  g.id,
  'NZ',
  g.slug,
  lower(trim(g.slug)),
  g.region_code,
  'slug',
  'core.geographies',
  'https://www.stats.govt.nz/methods/geographic-hierarchy/'
from core.geographies g
where g.country_code = 'NZ'
  and g.geography_type = 'city'
  and g.canonical_geography_id is null
  and g.slug in ('auckland','christchurch','hamilton','wellington','dunedin')
on conflict do nothing;

do $$
declare
  normalized_count integer;
  duplicate_count integer;
  tier_b_touched integer;
  alias_count integer;
begin
  select count(*) into normalized_count
  from core.geographies g
  where g.country_code = 'NZ'
    and g.geography_type = 'city'
    and g.canonical_geography_id is null
    and g.slug in ('auckland','christchurch','hamilton','wellington','dunedin')
    and g.scope_kind = 'city'
    and g.status = 'active'
    and g.region_code is not null
    and g.metadata->>'publication_tier' = 'A'
    and g.metadata->>'study_destination_scope' = 'stats_nz_urban_area'
    and g.metadata->>'population_geography_contract' = 'stats_nz_urban_area'
    and g.metadata->>'campus_membership_contract' = 'phase_3_explicit_location_evidence_required';

  if normalized_count <> 5 then
    raise exception 'New Zealand Tier A city normalization expected 5 rows, found %', normalized_count;
  end if;

  select count(*) into duplicate_count
  from (
    select slug
    from core.geographies
    where country_code='NZ'
      and geography_type='city'
      and canonical_geography_id is null
      and slug in ('auckland','christchurch','hamilton','wellington','dunedin')
    group by slug
    having count(*) <> 1
  ) d;

  if duplicate_count <> 0 then
    raise exception 'New Zealand Tier A canonical city duplicate contract failed for % slug(s)', duplicate_count;
  end if;

  select count(*) into tier_b_touched
  from core.geographies g
  where g.country_code='NZ'
    and g.slug in ('palmerston-north','lincoln')
    and coalesce((g.metadata->>'nz_city_normalization_v1')::boolean, false) is true;

  if tier_b_touched <> 0 then
    raise exception 'New Zealand Tier B geographies were unexpectedly normalized: %', tier_b_touched;
  end if;

  select count(*) into alias_count
  from core.geography_aliases a
  join core.geographies g on g.id=a.geography_id
  where g.country_code='NZ'
    and g.slug in ('auckland','christchurch','hamilton','wellington','dunedin')
    and a.alias_type in ('canonical_name','slug');

  if alias_count < 10 then
    raise exception 'Expected at least 10 New Zealand Tier A canonical/slug aliases, found %', alias_count;
  end if;
end $$;