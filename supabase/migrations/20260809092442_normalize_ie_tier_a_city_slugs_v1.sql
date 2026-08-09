-- Normalize the approved Ireland Tier A city geographies for stable public routes.
-- Preserve existing UUIDs. This phase changes geography identity/scope only;
-- legacy campus and programme links remain unverified until Phase 3.

with approved(code, public_slug, province, study_scope, boundary_label, scope_note) as (
  values
    ('dublin-ie', 'dublin', 'Leinster', 'dublin_four_local_authorities', 'Dublin City, Fingal, Dún Laoghaire-Rathdown and South Dublin local-authority areas', 'Dublin is a four-local-authority study destination for product purposes. Campus inclusion still requires explicit official address/location evidence; legacy Dublin labels are not authoritative.'),
    ('cork-ie', 'cork', 'Munster', 'cork_city', 'Cork City study destination', 'Use verified Cork City campus locations. Do not infer County Cork membership or include an institution location merely because the provider uses Cork in its name.'),
    ('galway-ie', 'galway', 'Connacht', 'galway_city', 'Galway City study destination', 'Use verified Galway City campus locations. Legacy Galway and Galway City strings are discovery aliases only and do not independently verify campus membership.'),
    ('limerick-ie', 'limerick', 'Munster', 'limerick_urban', 'Limerick urban study destination', 'Use explicit Limerick/Castletroy higher-education location evidence. Do not infer all County Limerick locations into the public destination.')
)
update core.geographies g
set slug = a.public_slug,
    scope_kind = 'city',
    status = 'active',
    metadata = coalesce(g.metadata, '{}'::jsonb) || jsonb_build_object(
      'ie_city_normalization_v1', true,
      'publication_tier', 'A',
      'public_slug', a.public_slug,
      'province', a.province,
      'study_destination_scope', a.study_scope,
      'scope_boundary_label', a.boundary_label,
      'scope_note', a.scope_note,
      'campus_membership_contract', 'phase_3_explicit_location_evidence_required'
    ),
    updated_at = now()
from approved a
where g.country_code = 'IE'
  and g.geography_type = 'city'
  and g.canonical_geography_id is null
  and g.code = a.code;

insert into core.geography_aliases (
  geography_id, country_code, alias, alias_normalized, region_code,
  alias_type, source_system, source_url
)
select
  g.id,
  'IE',
  g.name,
  lower(regexp_replace(trim(g.name), '\s+', ' ', 'g')),
  g.region_code,
  'canonical_name',
  'core.geographies',
  null
from core.geographies g
where g.country_code = 'IE'
  and g.geography_type = 'city'
  and g.canonical_geography_id is null
  and g.code in ('dublin-ie','cork-ie','galway-ie','limerick-ie')
on conflict do nothing;

insert into core.geography_aliases (
  geography_id, country_code, alias, alias_normalized, region_code,
  alias_type, source_system, source_url
)
select
  g.id,
  'IE',
  c.name,
  lower(regexp_replace(trim(c.name), '\s+', ' ', 'g')),
  g.region_code,
  'source',
  'public.cities_ie',
  null
from public.cities_ie c
join core.geographies g
  on g.country_code = 'IE'
 and g.geography_type = 'city'
 and g.canonical_geography_id is null
 and g.code = c.city_slug
where c.city_slug in ('dublin-ie','cork-ie','galway-ie','limerick-ie')
on conflict do nothing;

insert into core.geography_aliases (
  geography_id, country_code, alias, alias_normalized, region_code,
  alias_type, source_system, source_url
)
select
  g.id,
  'IE',
  g.code,
  lower(trim(g.code)),
  g.region_code,
  'legacy',
  'core.geographies',
  null
from core.geographies g
where g.country_code = 'IE'
  and g.geography_type = 'city'
  and g.canonical_geography_id is null
  and g.code in ('dublin-ie','cork-ie','galway-ie','limerick-ie')
on conflict do nothing;

insert into core.geography_aliases (
  geography_id, country_code, alias, alias_normalized, region_code,
  alias_type, source_system, source_url
)
select
  g.id,
  'IE',
  g.slug,
  lower(trim(g.slug)),
  g.region_code,
  'slug',
  'core.geographies',
  null
from core.geographies g
where g.country_code = 'IE'
  and g.geography_type = 'city'
  and g.canonical_geography_id is null
  and g.code in ('dublin-ie','cork-ie','galway-ie','limerick-ie')
on conflict do nothing;

with locality_alias(code, alias) as (
  values
    ('dublin-ie', 'Dublin City'),
    ('cork-ie', 'Cork City'),
    ('galway-ie', 'Galway City'),
    ('limerick-ie', 'Limerick City')
)
insert into core.geography_aliases (
  geography_id, country_code, alias, alias_normalized, region_code,
  alias_type, source_system, source_url
)
select
  g.id,
  'IE',
  a.alias,
  lower(regexp_replace(trim(a.alias), '\s+', ' ', 'g')),
  g.region_code,
  'locality',
  'ie_city_normalization_v1',
  null
from locality_alias a
join core.geographies g
  on g.country_code='IE'
 and g.geography_type='city'
 and g.canonical_geography_id is null
 and g.code=a.code
on conflict do nothing;

do $$
declare
  normalized_count integer;
  tier_b_touched integer;
begin
  select count(*) into normalized_count
  from core.geographies g
  where g.country_code='IE'
    and g.geography_type='city'
    and g.canonical_geography_id is null
    and g.code in ('dublin-ie','cork-ie','galway-ie','limerick-ie')
    and g.scope_kind='city'
    and g.status='active'
    and g.slug in ('dublin','cork','galway','limerick')
    and g.metadata->>'publication_tier'='A'
    and g.metadata->>'campus_membership_contract'='phase_3_explicit_location_evidence_required';

  if normalized_count <> 4 then
    raise exception 'Ireland Tier A city normalization expected 4 rows, found %', normalized_count;
  end if;

  select count(*) into tier_b_touched
  from core.geographies g
  where g.country_code='IE'
    and g.code in ('maynooth-ie','waterford-ie','athlone-ie','sligo-ie','dundalk-ie','letterkenny-ie')
    and (g.metadata->>'ie_city_normalization_v1')::boolean is true;

  if tier_b_touched <> 0 then
    raise exception 'Ireland Tier B geographies were unexpectedly normalized: %', tier_b_touched;
  end if;
end $$;
