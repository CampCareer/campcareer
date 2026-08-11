-- Normalize the approved Netherlands Tier A city geographies for stable city routes.
-- Preserve existing geography UUIDs. Phase 2 defines geography identity and scope only;
-- campus membership and programme delivery remain Phase 3 responsibilities.

with approved(city_name, public_slug, region_code, province_name, municipality_code, boundary_label, scope_note) as (
  values
    ('Amsterdam', 'amsterdam', 'NH', 'Noord-Holland', 'GM0363', 'Amsterdam municipality (CBS municipal division 2026)', 'Use the municipality of Amsterdam as the public study-destination boundary. Do not automatically include Amstelveen, Diemen, or the wider Amsterdam metropolitan area.'),
    ('Maastricht', 'maastricht', 'LI', 'Limburg', 'GM0935', 'Maastricht municipality (CBS municipal division 2026)', 'Use the municipality of Maastricht. Do not substitute Limburg province statistics for Maastricht city statistics.'),
    ('Rotterdam', 'rotterdam', 'ZH', 'Zuid-Holland', 'GM0599', 'Rotterdam municipality (CBS municipal division 2026)', 'Use the municipality of Rotterdam. Do not silently expand the city boundary to Rijnmond or the wider Rotterdam-The Hague metropolitan area.'),
    ('Groningen', 'groningen', 'GR', 'Groningen', 'GM0014', 'Groningen municipality (CBS municipal division 2026)', 'Use the municipality of Groningen. Do not substitute Province of Groningen statistics for Groningen city statistics.'),
    ('Eindhoven', 'eindhoven', 'NB', 'Noord-Brabant', 'GM0772', 'Eindhoven municipality (CBS municipal division 2026)', 'Use the municipality of Eindhoven. Do not treat the broader Brainport region as the public city boundary.')
)
update core.geographies g
set slug = a.public_slug,
    geography_type = 'city',
    scope_kind = 'city',
    region_code = a.region_code,
    status = 'active',
    metadata = coalesce(g.metadata, '{}'::jsonb) || jsonb_build_object(
      'nl_city_normalization_v1', true,
      'publication_tier', 'A',
      'public_slug', a.public_slug,
      'province_code', a.region_code,
      'province_name', a.province_name,
      'cbs_municipality_code', a.municipality_code,
      'study_destination_scope', 'cbs_municipality',
      'scope_boundary_label', a.boundary_label,
      'scope_note', a.scope_note,
      'scope_standard', 'CBS municipal division 2026',
      'scope_reference_date', '2026-01-01',
      'scope_source_url', 'https://www.cbs.nl/nl-nl/cijfers/detail/86247NED',
      'population_geography_contract', 'cbs_municipality',
      'student_demand_geography_contract', 'nuffic_municipality',
      'campus_membership_contract', 'phase_3_explicit_location_evidence_required'
    ),
    updated_at = now()
from approved a
where g.country_code = 'NL'
  and g.geography_type = 'city'
  and g.canonical_geography_id is null
  and g.name = a.city_name;

insert into core.geography_aliases (
  geography_id, country_code, alias, alias_normalized, region_code,
  alias_type, source_system, source_url
)
select
  g.id,
  'NL',
  g.name,
  lower(regexp_replace(trim(g.name), '\s+', ' ', 'g')),
  g.region_code,
  'canonical_name',
  'core.geographies',
  'https://www.cbs.nl/nl-nl/cijfers/detail/86247NED'
from core.geographies g
where g.country_code = 'NL'
  and g.geography_type = 'city'
  and g.canonical_geography_id is null
  and g.slug in ('amsterdam','maastricht','rotterdam','groningen','eindhoven')
on conflict do nothing;

insert into core.geography_aliases (
  geography_id, country_code, alias, alias_normalized, region_code,
  alias_type, source_system, source_url
)
select
  g.id,
  'NL',
  g.slug,
  lower(trim(g.slug)),
  g.region_code,
  'slug',
  'core.geographies',
  'https://www.cbs.nl/nl-nl/cijfers/detail/86247NED'
from core.geographies g
where g.country_code = 'NL'
  and g.geography_type = 'city'
  and g.canonical_geography_id is null
  and g.slug in ('amsterdam','maastricht','rotterdam','groningen','eindhoven')
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
  where g.country_code = 'NL'
    and g.geography_type = 'city'
    and g.canonical_geography_id is null
    and g.slug in ('amsterdam','maastricht','rotterdam','groningen','eindhoven')
    and g.scope_kind = 'city'
    and g.status = 'active'
    and g.metadata->>'publication_tier' = 'A'
    and g.metadata->>'study_destination_scope' = 'cbs_municipality'
    and g.metadata->>'population_geography_contract' = 'cbs_municipality'
    and g.metadata->>'campus_membership_contract' = 'phase_3_explicit_location_evidence_required'
    and g.metadata->>'cbs_municipality_code' is not null;

  if normalized_count <> 5 then
    raise exception 'Netherlands Tier A city normalization expected 5 rows, found %', normalized_count;
  end if;

  select count(*) into duplicate_count
  from (
    select slug
    from core.geographies
    where country_code = 'NL'
      and geography_type = 'city'
      and canonical_geography_id is null
      and slug in ('amsterdam','maastricht','rotterdam','groningen','eindhoven')
    group by slug
    having count(*) <> 1
  ) d;

  if duplicate_count <> 0 then
    raise exception 'Netherlands Tier A canonical city duplicate contract failed for % slug(s)', duplicate_count;
  end if;

  select count(*) into tier_b_touched
  from core.geographies g
  where g.country_code = 'NL'
    and g.name in ('Delft','Utrecht','Enschede','Tilburg','Leiden','Nijmegen','Wageningen')
    and coalesce((g.metadata->>'nl_city_normalization_v1')::boolean, false) is true;

  if tier_b_touched <> 0 then
    raise exception 'Netherlands Tier B geographies were unexpectedly normalized: %', tier_b_touched;
  end if;

  select count(*) into alias_count
  from core.geography_aliases a
  join core.geographies g on g.id = a.geography_id
  where g.country_code = 'NL'
    and g.slug in ('amsterdam','maastricht','rotterdam','groningen','eindhoven')
    and a.alias_type in ('canonical_name','slug');

  if alias_count < 10 then
    raise exception 'Expected at least 10 Netherlands Tier A canonical/slug aliases, found %', alias_count;
  end if;
end $$;